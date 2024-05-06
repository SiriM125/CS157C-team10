from flask import Flask, jsonify, session
from flask_cqlalchemy import CQLAlchemy
from flask_session import Session

import uuid
import os

from flask_cors import CORS
from cassandra.cluster import Cluster


app = Flask(__name__)
CORS(app)

app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = os.urandom(24)

Session(app)

app.config['CASSANDRA_HOSTS'] = ['127.0.0.1']
app.config['CASSANDRA_KEYSPACE'] = 'mawls'

cluster = Cluster(['127.0.0.1'])
dbSession = cluster.connect('mawls')

db = CQLAlchemy(app)


# Used for logging in
@app.route("/api/login/<username>/<password>")
def login(username, password):

    query = "SELECT * FROM user WHERE username = %s AND password = %s ALLOW FILTERING"
    result = dbSession.execute(query, (username, password))
    
    data = []
    for row in result:
        data.append({
            'user_id': row.user_id,
            'email': row.email,
            'password': row.password,
            'username': row.username
        })

    # Check if user exists with given credentials. 
    if len(data) == 0:
        return jsonify({'message': 'Invalid username or password'}), 401
    else:
        # Set the session stuff.
        user_info = data[0]
        session['user_id'] = str(user_info['user_id']) 
        session['username'] = username
        session['logged_in'] = True
        return jsonify({'message': 'Login successful'}), 200
        
# Used to log out. 
@app.route("/api/logout")
def logout():
    # Clear session data
    session.pop('username', None)
    session.pop('logged_in', None)
    session.pop('user_id', None)
    
    return jsonify({'message': 'Logout successful'}), 200

# Get username of the current user
@app.route("/api/username")
def username():
    # Check if user is logged in
    if 'logged_in' in session and session['logged_in']:
        # Retrieve username from session
        username = session['username']
        return jsonify({'message': f'Welcome, {username}!'})
    else:
        return jsonify({'message': 'You are not logged in'}), 401


# Used for registering a NEW user
@app.route("/api/register/<username>/<email>/<password>") 
def register(username, email, password):

    # First, check if there is an account with the given email already. If so, operation fails. 
    query = "SELECT * FROM user WHERE email = '" + email + "' ALLOW FILTERING"
    result = dbSession.execute(query)
    
    data = []
    for row in result:
        data.append({
            'user_id': row.user_id,
            'email': row.email,
            'password': row.password,
            'username': row.username
        })

    # Check if user exists with given email. Fail the operation if so.
    if len(data) != 0:
        return jsonify({'message': 'This email has already been used'}), 401

    # Check if there is an account with the given username. If so, operation fails
    query = "SELECT * FROM user WHERE username = '" + username + "' ALLOW FILTERING"
    result = dbSession.execute(query)
    
    data = []
    for row in result:
        data.append({
            'user_id': row.user_id,
            'email': row.email,
            'password': row.password,
            'username': row.username
        })

    # Check if user exists with given username. Fail the operation if so.
    if len(data) != 0:
        return jsonify({'message': 'This username has already been used'}), 401

    # Reaching here means the email hasn't been used yet
    try: 
        # Generate UUID for the user_id
        user_id = uuid.uuid4()
        
        # Insert the new user data into the User table
        # query = "INSERT INTO user (user_id, email, password, username) VALUES (%s, %s, %s, %s)"
        # dbSession.execute(query, (user_id, email, password, username))
        
        # Temporary - Adds users, and put them into the default lounge.
        query = "INSERT INTO user (user_id, email, password, username, lounges) VALUES (%s, %s, %s, %s, %s)"
        lounge_id = uuid.UUID("5467d1f9-8575-428d-9496-7494191f7dde") # Insert your UUID for the lounge here. //87826075-dfb2-420e-a8ef-71f889731ec3
        dbSession.execute(query, (user_id, email, password, username, [lounge_id]))
        
        # Return success message
        return jsonify({'message': 'User registration successful'}), 201
    
    except Exception as e:
        # Handle errors
        print('Error:', e)
        return jsonify({'message': 'Server error occurred during user registration'}), 500
    

#Get username
@app.route("/api/get_username")
def get_username():
    if 'username' in session: 
        return jsonify({'username': session['username']})
    else: 
        return jsonify({'message': 'Username not found'}), 404
    
# Create new lounge
@app.route("/api/create_lounge/<lounge_name>/<user_id>")
def create_lounge(lounge_name, user_id):
    try:
        lounge_id = uuid.uuid4()
        query = "INSERT INTO lounge (lounge_id, lounge_name, creator_id) VALUES (%s, %s, %s)"
        dbSession.execute(query, (lounge_id, lounge_name, uuid.UUID(user_id)))
        add_lounge_query = "UPDATE users SET lounges = lounges + [%s] WHERE user_id = %s"
        dbSession.execute(add_lounge_query, (lounge_id, uuid.UUID(user_id)))  
        return jsonify({'message': 'Lounge was created successfully', 'lounge_id': str(lounge_id)}), 201
    except Exception as e:
        print('Error:', e)
        return jsonify({'message': 'Server error occurred during lounge creation'}), 500
    
# Delete an existing lounge (only creator can delete)
@app.route("/api/delete_lounge/<lounge_id>/<user_id>")
def delete_lounge(lounge_id, user_id):
    try:
        query = "SELECT * FROM lounge WHERE lounge_id = %s AND creator_id = %s"
        result = dbSession.execute(query, (uuid.UUID(lounge_id), uuid.UUID(user_id))).one()
        if not result:
            return jsonify({'message': 'You do not have permission to delete this lounge'}), 401
        
        query = "DELETE FROM lounge WHERE lounge_id = %s"
        dbSession.execute(query, (uuid.UUID(lounge_id),))
        
        return jsonify({'message': 'Lounge deleted successfully'}), 200
    except Exception as e:
        print('Error:', e)
        return jsonify({'message': 'Server error occurred during lounge deletion'}), 500

#For user to enter an existing lounge given lounge ID    
@app.route("/api/enter_lounge/<user_id>/<lounge_id>")
def enter_lounge(user_id, lounge_id):
    try:
        query = "SELECT * FROM Lounge WHERE lounge_id = %s"
        lounge_result = dbSession.execute(query, (uuid.UUID(lounge_id),)).one()
        if not lounge_result:
            return jsonify({'message': 'Lounge does not exist'}), 404
        query = "UPDATE User SET lounges = lounges + [%s] WHERE user_id = %s"
        dbSession.execute(query, (uuid.UUID(lounge_id), uuid.UUID(user_id)))
        return jsonify({'message': 'Entered lounge successfully'}), 200
    except Exception as e:
        print('Error:', e)
        return jsonify({'message': 'Server error occurred during entry to lounge'}), 500
    
# For user to exit lounge
@app.route("/api/exit_lounge/<user_id>/<lounge_id>")
def exit_lounge(user_id, lounge_id):
    try:
        query = "UPDATE User SET lounges = lounges - [%s] WHERE user_id = %s"
        dbSession.execute(query, (uuid.UUID(lounge_id), uuid.UUID(user_id)))
        return jsonify({'message': 'You have exited the lounge successfully'}), 200
    except Exception as e:
        print('Error:', e)
        return jsonify({'message': 'Server error occurred during exit from lounge'}), 500

# - - - Database creation/class stuff below - - -

class User(db.Model):
    user_id = db.columns.UUID(primary_key=True, )
    username = db.columns.Text(required=True)
    password = db.columns.Text(required=True)
    email = db.columns.Text(required=True)
    lounges = db.columns.List(db.columns.UUID)

class Lounge(db.Model):
    lounge_id = db.columns.UUID(primary_key=True)
    lounge_name = db.columns.Text(required=True)
    creator_id = db.columns.UUID(required=True) #ID of user that created the database
    # lounge_members = db.columns.List(db.columns.Text)
    # lounge_members = db.columns.List(db.columns.Text)

class Message(db.Model):
    message_id = db.columns.UUID(primary_key=True)
    channel_id = db.columns.UUID(required=True)
    sender_name = db.columns.Text(required=True)
    content = db.columns.Text(required=True)
    message_timestamp = db.columns.DateTime(required=True)

class Channel(db.Model):
    channel_id = db.columns.UUID(primary_key=True)
    channel_name = db.columns.Text(required=True)
    lounge_id = db.columns.UUID(required=True)

# Create mawls keyspace. Does not do anything if keyspace already exists.
db.create_keyspace_simple(name = "mawls", replication_factor=1) 

# Create tables
db.sync_db()





# EXPERIMENTS BELOW! 

# # Used for testing purposes. Returns a JSON.
# @app.route("/api/testing")
# def testing():
#     # Fetch data from your data source
#     data = {'Jack': 'So, am I gonna get paid or what?'}
#     return jsonify(data)


# # Tests how querying can be done...
# @app.route("/api/test_data")
# def testing2():
#     query = "SELECT * FROM user WHERE email = 'steven@gmail.com' ALLOW FILTERING"
#     result = session.execute(query)
    
#     # Convert Cassandra rows to a list of dictionaries
#     data = []
#     for row in result:
#         data.append({
#             'user_id': row.user_id,
#             'email': row.email,
#             'password': row.password,
#             'username': row.username
#         })
    
#     # Check if user exists
#     if len(data) == 0:
#         return jsonify({'message': 'User not found'})
    
#     # Convert data to JSON and return
#     return jsonify(data)


# # Used to see how I can pass in arguments through URL 
# @app.route("/api/test_email/<email>")
# def testing3(email):
#     query = "SELECT * FROM user WHERE email = '" + email + "' ALLOW FILTERING"
#     result = session.execute(query)
    
#     # Convert Cassandra rows to a list of dictionaries
#     data = []
#     for row in result:
#         data.append({
#             'user_id': row.user_id,
#             'email': row.email,
#             'password': row.password,
#             'username': row.username
#         })

#     # Check if user exists
#     if len(data) == 0:
#         return jsonify({'message': 'User not found'})
    
#     # Convert data to JSON and return
#     return jsonify(data)