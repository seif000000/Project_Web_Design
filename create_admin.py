"""
Script to create an admin user in the database
Run this script to create an admin account for testing
"""
from app import app, db, User, Role
from werkzeug.security import generate_password_hash

def create_admin():
    with app.app_context():
        # Get admin role
        admin_role = Role.query.filter_by(name='admin').first()
        if not admin_role:
            print("Error: Admin role not found. Please run the Flask app first to initialize the database.")
            return
        
        # Check if admin already exists
        existing_admin = User.query.filter_by(username='admin').first()
        if existing_admin:
            print("Admin user already exists!")
            print(f"Username: {existing_admin.username}")
            print(f"Email: {existing_admin.email}")
            return
        
        # Create admin user
        admin_user = User(
            username='admin',
            email='admin@bookworms.com',
            password=generate_password_hash('123456789'),  # Admin password
            role_id=admin_role.id
        )
        
        db.session.add(admin_user)
        db.session.commit()
        
        print("=" * 50)
        print("Admin user created successfully!")
        print("=" * 50)
        print(f"Username: admin")
        print(f"Email: admin@bookworms.com")
        print(f"Password: 123456789")
        print("=" * 50)
        print("⚠️  IMPORTANT: Only admin can add/edit/delete books!")
        print("=" * 50)

if __name__ == '__main__':
    create_admin()

