from flask import Flask, jsonify
from flask_cqlalchemy import CQLAlchemy
import uuid

from flask_cors import CORS
from cassandra.cluster import Cluster


app = Flask(__name__)
CORS(app)

app.config['CASSANDRA_HOSTS'] = ['127.0.0.1']
app.config['CASSANDRA_KEYSPACE'] = 'mawls'

cluster = Cluster(['127.0.0.1'])
session = cluster.connect('mawls')

db = CQLAlchemy(app)


# Used for logging in
@app.route("/api/login/<username>/<password>")
def login(username, password):
    query = "SELECT * FROM user WHERE username = %s AND password = %s ALLOW FILTERING"
    result = session.execute(query, (username, password))
    
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
        return jsonify({'message': 'Login successful'}), 200

# Used for registering a NEW user
@app.route("/api/register/<username>/<email>/<password>") 
def register(username, email, password):

    # First, check if there is an account with the given email already. If so, operation fails. 
    query = "SELECT * FROM user WHERE email = '" + email + "' ALLOW FILTERING"
    result = session.execute(query)
    
    data = []
    for row in result:
        data.append({
            'user_id': row.user_id,
            'email': row.email,
            'password': row.password,
            'username': row.username
        })

    # Check if user exists with given credentials. Fail the operation if so.
    if len(data) != 0:
        return jsonify({'message': 'This email has already been used'}), 401

    # Reaching here means the email hasn't been used yet
    try: 
        # Generate UUID for the user_id
        user_id = uuid.uuid4()
        
        # Insert the new user data into the User table
        query = "INSERT INTO user (user_id, email, password, username) VALUES (%s, %s, %s, %s)"
        session.execute(query, (user_id, email, password, username))
        
        # Return success message
        return jsonify({'message': 'User registration successful'}), 201
    
    except Exception as e:
        # Handle errors
        print('Error:', e)
        return jsonify({'message': 'Error occurred during user registration'}), 500
    

# Database creation/class stuff below

class User(db.Model):
    user_id = db.columns.UUID(primary_key=True, )
    username = db.columns.Text(required=True)
    password = db.columns.Text(required=True)
    email = db.columns.Text(required=True)

class Lounge(db.Model):
    lounge_id = db.columns.UUID(primary_key=True)
    lounge_name = db.columns.Text(required=True)
    lounge_members = db.columns.List(db.columns.Text)

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