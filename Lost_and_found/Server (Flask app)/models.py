from app import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class LostItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(250), nullable=False)
    location = db.Column(db.String(250), nullable=False)
    date_lost = db.Column(db.DateTime, nullable=False)
    photos = db.Column(db.String(500), nullable=True)  # Store photo URLs
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

class FoundItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(250), nullable=False)
    location = db.Column(db.String(250), nullable=False)
    date_found = db.Column(db.DateTime, nullable=False)
    photos = db.Column(db.String(500), nullable=True)
    anonymous = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))