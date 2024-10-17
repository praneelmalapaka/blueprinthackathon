from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(150), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class FoundItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(250), nullable=False)
    location = db.Column(db.String(250), nullable=False)
    date_found = db.Column(db.DateTime, nullable=False)
    photos = db.Column(db.String(500), nullable=True)
    anonymous = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))  # Corrected here

class LostItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable = False)
    description = db.Column(db.String(250), nullable=False)
    location = db.Column(db.String(250), nullable=False)
    date_lost = db.Column(db.DateTime, nullable=False)
    photos = db.Column(db.String(500), nullable=True)  # Store photo URLs
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))  # Optional, can be None

class Reminder(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    filters = db.Column(db.JSON, nullable=False)  # Store filters as JSON

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)  # The ID of the user who gets the message
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    timestamp = db.Column(db.DateTime, default=db.func.now())  # Timestamp for when the message was created