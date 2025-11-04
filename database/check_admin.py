"""Check if admin users exist in the database"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from backend.utils.database import db

def check_admin_users():
    """Check and display admin users"""
    print("\n" + "="*60)
    print("🔍 CHECKING ADMIN USERS")
    print("="*60)
    
    # Get all admin users
    query = """
        SELECT id, name, phone, role, status, created_at 
        FROM users 
        WHERE role = 'admin'
        ORDER BY id
    """
    
    admins = db.execute_query(query)
    
    if not admins:
        print("\n❌ NO ADMIN USERS FOUND!")
        print("\n💡 To create an admin user, update an existing user:")
        print("   UPDATE users SET role = 'admin' WHERE phone = 'YOUR_PHONE';")
        print("\n   Or insert a new admin:")
        print("   INSERT INTO users (name, phone, role, status)")
        print("   VALUES ('Admin', '9999999999', 'admin', 'active');")
    else:
        print(f"\n✅ Found {len(admins)} admin user(s):\n")
        for admin in admins:
            print(f"📌 ID: {admin['id']}")
            print(f"   Name: {admin['name']}")
            print(f"   Phone: {admin['phone']}")
            print(f"   Role: {admin['role']}")
            print(f"   Status: {admin['status']}")
            print(f"   Created: {admin['created_at']}")
            print()
    
    # Get all users with their roles
    all_users_query = """
        SELECT role, COUNT(*) as count 
        FROM users 
        GROUP BY role
    """
    user_counts = db.execute_query(all_users_query)
    
    print("\n📊 USER DISTRIBUTION:")
    for row in user_counts:
        print(f"   • {row['role']}: {row['count']} users")
    
    print("\n" + "="*60)

if __name__ == '__main__':
    try:
        check_admin_users()
    except Exception as e:
        print(f"\n❌ Error: {e}")
