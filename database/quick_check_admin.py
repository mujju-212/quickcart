import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from backend.utils.database import db

query = "SELECT id, name, phone, role, status FROM users WHERE role = 'admin'"
admins = db.execute_query(query)

print(f"\n✅ Found {len(admins)} admin user(s):\n")
for admin in admins:
    print(f"ID: {admin['id']}, Name: {admin['name']}, Phone: {admin['phone']}, Status: {admin['status']}")

if len(admins) == 0:
    print("\n❌ NO ADMIN USERS! Run this to create one:")
    print("UPDATE users SET role = 'admin' WHERE phone = 'YOUR_PHONE_HERE';")
