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
    description = db.Column(db.String(250), nullable=False)
    location = db.Column(db.String(250), nullable=False)
    date_lost = db.Column(db.DateTime, nullable=False)
    photos = db.Column(db.String(500), nullable=True)  # Store photo URLs
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))  # Optional, can be None
