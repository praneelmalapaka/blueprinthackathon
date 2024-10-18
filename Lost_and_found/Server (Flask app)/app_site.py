import os
from flask import Flask
from config import Config
from models import db
from flask_cors import CORS  # For CORS support if frontend and backend are on different ports

# Get the absolute path of the directory containing the static folder
# Manually set the correct static folder path to the actual location
static_folder_path = '/Users/neildadhich/Desktop/DevSoc Hackathon/blueprinthackathon/Lost_and_found/static/'

app = Flask(__name__, static_folder=static_folder_path, static_url_path='/static')
#print("Static folder absolute path:", os.path.abspath(static_folder_path))
app.config.from_object(Config)
CORS(app)  # Enable CORS for cross-origin requests

db.init_app(app)

# Create the database and tables
with app.app_context():
    db.create_all()

from routes import *  # Import routes after initializing the app

if __name__ == '__main__':
    app.run(debug=True, port=5001)
