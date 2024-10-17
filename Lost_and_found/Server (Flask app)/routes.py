from app_site import app, db  
from fuzzywuzzy import fuzz
from geopy.distance import geodesic
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models import User, LostItem, FoundItem, Reminder, Message
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from urllib.parse import quote 
import smtplib



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

        # Include the user's ID in the response
        return jsonify({'message': 'Login successful!', 'id': user.id, 'name': email}), 200  
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

    check_reminders_for_new_item(lost_item)

    return jsonify({'message': 'Lost item submitted successfully!'}), 201

def check_reminders_for_new_item(lost_item):
    reminders = Reminder.query.all()

    for reminder in reminders:
        filters = reminder.filters

        # Filter checking logic (replace with your actual logic)
        if filters['byName']['enabled'] and filters['byName']['value'].lower() not in lost_item.title.lower():
            continue
        if filters['byLocation']['enabled'] and filters['byLocation']['value'].lower() not in lost_item.location.lower():
            continue
        if filters['byDescription']['enabled'] and filters['byDescription']['value'].lower() not in lost_item.description.lower():
            continue

        print(reminder)
        # Get user by email from the Reminder
        user = User.query.filter_by(email=reminder.email).first()
        if user:
            user_id = user.id
        else:
            continue

        # Create and store the message
        new_message = Message(
            user_id=user_id,
            title="New Lost Item Matching Your Filters",
            content=f"A new lost item matching your filters has been added:\n\n"
                    f"Title: {lost_item.title}\n"
                    f"Location: {lost_item.location}\n"
                    f"Description: {lost_item.description}\n"
                    f"Date Lost: {lost_item.date_lost}"
        )
        db.session.add(new_message)

    db.session.commit()

        

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
    
@app.route('/api/create-reminder', methods=['POST'])
def create_reminder():
    data = request.get_json()

    email = data['email']
    filters = data['filters']

    # Create a new reminder in the database
    new_reminder = Reminder(
        email=email,
        filters=filters
    )

    db.session.add(new_reminder)
    db.session.commit()

    return jsonify({'message': 'Reminder created successfully!'}), 201


@app.route('/api/messages/<int:user_id>', methods=['GET'])  
def get_messages(user_id):  
    print(user_id)
    print("hey")
    try:
        user_messages = Message.query.filter_by(user_id=user_id).order_by(Message.timestamp.desc()).all()

        for message in user_messages:
            message.is_read = True
        db.session.commit()

        messages_list = []
        for message in user_messages:
            message_data = {
                'id': message.id,
                'title': message.title,  
                'content': message.content,  
                'timestamp': message.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                'is_read': message.is_read
            }
            messages_list.append(message_data)

        return jsonify(messages_list)

    except Exception as e:
        print(f"Error fetching messages: {e}")
        return jsonify({'error': 'Failed to fetch messages'}), 500
    
from werkzeug.utils import secure_filename
import os
from urllib.parse import quote

# ... other imports and routes ...

@app.route('/api/submit-found-item', methods=['POST'])
def submit_found_item():
    description = request.form.get('description')
    location = request.form.get('location')
    date_found_str = request.form.get('dateFound')
    anonymous = request.form.get('anonymous') == 'true'

    try:
        date_found = datetime.strptime(date_found_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD.'}), 400

    file = request.files.get('image')
    if file and allowed_file(file.filename):
        original_filename = secure_filename(file.filename)
        cleaned_filename = quote(original_filename)
        file_path = os.path.join(UPLOAD_FOLDER, cleaned_filename)
        
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)
        
        file.save(file_path)
    else:
        file_path = None

    # Get user_id from session (if available)
    user_id = session.get('user_id')  

    found_item = FoundItem(
        description=description,
        location=location,
        date_found=date_found,
        photos=file_path,
        anonymous=anonymous,
        user_id=user_id 
    )

    db.session.add(found_item)
    db.session.commit()

    return jsonify({'message': 'Found item submitted successfully!'}), 201