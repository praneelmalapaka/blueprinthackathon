from models import db  # Import the db object from where it’s defined
from app_site import app  # Import your Flask app

def clear_database():
    """Clear all tables in the database."""
    meta = db.metadata
    for table in reversed(meta.sorted_tables):
        print(f'Clearing table {table}')  # Optional: log the tables being cleared
        db.session.execute(table.delete())
    db.session.commit()

def recreate_database():
    """Drop all tables and recreate them."""
    db.drop_all()  # Drop all existing tables
    print("All tables dropped.")
    
    db.create_all()  # Recreate all tables
    print("All tables recreated.")

if __name__ == "__main__":
    with app.app_context():  # Ensure app context is active
        # Clear the database by deleting all rows from tables
        clear_database()
        print("Database cleared.")
        
        # Recreate the database by dropping and then creating all tables
        recreate_database()
        print("Database reconstructed.")
