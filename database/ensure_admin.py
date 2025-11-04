#!/usr/bin/env python3
"""
Ensure admin user exists in the database
"""
import sys
import os
from pathlib import Path

# Add parent directory to Python path
current_dir = Path(__file__).parent
parent_dir = current_dir.parent
sys.path.append(str(parent_dir))
sys.path.append(str(parent_dir / 'backend'))

# Change working directory to backend
os.chdir(parent_dir / 'backend')

from utils.database import db

def ensure_admin_user():
    """Ensure admin user exists in database"""
    try:
        # Check if admin user exists
        check_query = "SELECT id FROM users WHERE phone = 'admin' AND role = 'admin'"
        result = db.execute_query(check_query, fetch=True)
        
        if result and len(result) > 0:
            print(f"✅ Admin user already exists (ID: {result[0]['id']})")
            return True
        
        # Insert admin user
        insert_query = """
            INSERT INTO users (name, phone, email, role, status)
            VALUES ('Admin', 'admin', 'admin@quickcart.com', 'admin', 'active')
            RETURNING id
        """
        result = db.execute_query(insert_query, fetch=True)
        
        if result:
            print(f"✅ Admin user created successfully (ID: {result[0]['id']})")
            return True
        else:
            print("❌ Failed to create admin user")
            return False
            
    except Exception as e:
        print(f"❌ Error ensuring admin user: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    print("🔧 Ensuring admin user exists...")
    success = ensure_admin_user()
    sys.exit(0 if success else 1)
