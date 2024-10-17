from app_site import app, db  
from fuzzywuzzy import fuzz
from geopy.distance import geodesic
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import User, LostItem, FoundItem  
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from urllib.parse import quote  


# Define where to save uploaded images
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Ensure the upload directory exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# User Registration Route
@app.route('/api/registerUser', methods=['POST'])
def register_user():
    data = request.get_json()  
    email = data.get('email')
    password = data.get('password')

    # Check if user already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'message': 'Email already exists'}), 400

    # Create new user and save to the database
    new_user = User(email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'Account created successfully!'}), 201


# User Login Route
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json() 
    email = data.get('email')
    password = data.get('password')

    # Find the user by email
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        # Save user in session
        session['user_id'] = user.id
        return jsonify({'message': 'Login successful!', 'name': email}), 200
    else:
        return jsonify({'message': 'Invalid email or password'}), 400

# User Logout Route
@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out successfully'}), 200

# Submit Lost Item Route
@app.route('/api/submit-lost-item', methods=['POST'])
def submit_lost_item():
    title = request.form.get('title')
    location = request.form.get('location')
    description = request.form.get('description')
    contact_info = request.form.get('contactInfo')

    # Convert the date from string to datetime.date object
    date_lost_str = request.form.get('dateLost')  # This is a string like '2024-10-17'
    try:
        date_lost = datetime.strptime(date_lost_str, '%Y-%m-%d').date()  # Convert to datetime.date
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD.'}), 400

    # Handle the uploaded image (if any)
    file = request.files.get('image')
    if file and allowed_file(file.filename):
        # Secure the filename (remove special characters, spaces, etc.)
        original_filename = secure_filename(file.filename)
    
        # Optionally encode special characters if needed
        cleaned_filename = quote(original_filename)  # Percent-encode special characters

        # Save the file to the specific uploads folder
        file_path = os.path.join(UPLOAD_FOLDER, cleaned_filename)
        
        # Ensure the directory exists
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)
        
        # Save the file
        file.save(file_path)
    else:
        file_path = None

    # Create a new lost item record
    lost_item = LostItem(
        title=title,
        description=description,
        location=location,
        date_lost=date_lost,  # This is now a datetime.date object
        photos=file_path,      # Store the sanitized and encoded filename
        user_id=None           # Adjust this to handle the actual user_id if needed
    )

    db.session.add(lost_item)
    db.session.commit()

    return jsonify({'message': 'Lost item submitted successfully!'}), 201

@app.route('/api/lost-items', methods=['GET'])
def get_lost_items():
    lost_items = LostItem.query.all()

    # Base URL for constructing absolute image paths
    base_url = request.host_url  # This gives you 'http://localhost:5001/'

    lost_items_list = [
        {
            'id': item.id,  # Include the item ID
            'title': item.title,
            'location': item.location,
            'date': item.date_lost.strftime('%Y-%m-%d'),
            'description': item.description,
            'image': base_url + 'static/uploads/' + os.path.basename(item.photos) if item.photos else None
        }
        for item in lost_items
    ]

    return jsonify(lost_items_list), 200

@app.route('/api/user', methods=['GET'])
def get_user_data():
    try:
        if 'user_id' in session:
            user_id = session['user_id']
            user = User.query.get(user_id)
            if user:
                return jsonify({'name': user.email})  # Return user's email as 'name'
        return jsonify({'error': 'User not logged in'}), 401 
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/lost-items/<int:itemId>', methods=['GET'])
def get_lost_item(itemId):
    try:
        item = LostItem.query.get(itemId)
        if item:
            # Construct the image URL similar to get_lost_items
            base_url = request.host_url
            if item.photos:
                image_url = base_url + 'static/uploads/' + os.path.basename(item.photos)
                images = [image_url]
            else:
                images = []

            item_data = {
                'id': item.id,
                'title': item.title,
                'description': item.description,
                'location': item.location,
                'date': item.date_lost.strftime('%Y-%m-%d'),
                'images': images
            }
            response = jsonify(item_data)
            response.headers['Content-Type'] = 'application/json'
            return response, 200
        else:
            return jsonify({'error': 'Item not found'}), 404
    except Exception as e:
        print(f"Error in get_lost_item: {e}")
        return jsonify({'error': 'An error occurred'}), 500