from flask import Flask
from config import Config
from models import db
from flask_cors import CORS  # For CORS support if frontend and backend are on different ports

app = Flask(__name__, static_url_path='/static', static_folder='static')
app.config.from_object(Config)
CORS(app)  # Enable CORS for cross-origin requests

db.init_app(app)

# Create the database and tables
with app.app_context():
    db.create_all()

from routes import *  # Import routes after initializing the app

if __name__ == '__main__':
    app.run(debug=True, port=5001)
