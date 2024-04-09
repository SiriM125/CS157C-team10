from flask import Flask
from flask_cqlalchemy import CQLAlchemy

app = Flask(__name__)
app.config['CASSANDRA_HOSTS'] = ['127.0.0.1']
app.config['CASSANDRA_KEYSPACE'] = 'mawls'

db = CQLAlchemy(app)

class User(db.Model):
    user_id = db.columns.UUID(primary_key=True)
    username = db.columns.Text(required=True)
    password = db.columns.Text(required=True)
    email = db.columns.Text(required=True)

class Lounge(db.Model):
    lounge_id = db.columns.UUID(primary_key=True)
    lounge_name = db.columns.Text(required=True)
    lounge_members = db.columns.List(db.columns.Text)

class Message(db.Model):
    message_id = db.columns.UUID(primary_key=True)
    channel_id = db.collumns.UUID(required=True)
    sender_name = db.columns.Text(required=True)
    content = db.columns.Text(required=True)
    timestamp = db.columns.DateTime(required=True)

class Channel(db.Model):
    channel_id = db.columns.UUID(primary_key=True)
    channel_name = db.columns.Text(required=True)
    lounge_id = db.columns.UUID(required=True)

# Create tables
db.create_all()

