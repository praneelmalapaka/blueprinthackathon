from flask import request, jsonify
from app import app, db
from models import LostItem, FoundItem, User
from fuzzywuzzy import fuzz
from geopy.distance import geodesic

@app.route('/api/report-lost', methods=['POST'])
def report_lost():
    data = request.form
    user = User.query.filter_by(email=data.get('email')).first()

    lost_item = LostItem(
        description=data['description'],
        location=data['location'],
        date_lost=data['date_lost'],
        photos=data['photos'],  # In production, upload to S3 and save URLs
        user_id=user.id
    )
    db.session.add(lost_item)
    db.session.commit()
    return jsonify({'message': 'Lost item reported successfully'}), 201

@app.route('/api/report-found', methods=['POST'])
def report_found():
    data = request.form
    user = User.query.filter_by(email=data.get('email')).first()

    found_item = FoundItem(
        description=data['description'],
        location=data['location'],
        date_found=data['date_found'],
        photos=data['photos'],  # Same as lost items, save URLs in production
        anonymous=data.get('anonymous', False),
        user_id=user.id
    )
    db.session.add(found_item)
    db.session.commit()
    return jsonify({'message': 'Found item reported successfully'}), 201

@app.route('/api/match-lost-found', methods=['GET'])
def match_lost_found():
    lost_item_id = request.args.get('lost_item_id')
    lost_item = LostItem.query.get(lost_item_id)
    found_items = FoundItem.query.all()

    matches = []
    for found_item in found_items:
        desc_match = fuzz.ratio(lost_item.description, found_item.description)
        location_match = geodesic(lost_item.location, found_item.location).km <= 10
        time_match = abs((lost_item.date_lost - found_item.date_found).days) <= 7

        if desc_match > 80 and location_match and time_match:
            matches.append(found_item)

    return jsonify([item.id for item in matches])