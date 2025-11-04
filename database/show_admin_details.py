"""Show admin user details"""
import psycopg2
from psycopg2.extras import RealDictCursor

DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'blink_basket',
    'user': 'postgres',
    'password': 'mk0492'
}

conn = psycopg2.connect(**DB_CONFIG)
cursor = conn.cursor(cursor_factory=RealDictCursor)

cursor.execute("SELECT * FROM users WHERE role = 'admin' ORDER BY id")
admins = cursor.fetchall()

print("\n" + "="*70)
print("📋 ADMIN USERS DETAILS")
print("="*70)
for admin in admins:
    print(f"\nID: {admin['id']}")
    print(f"Name: {admin['name']}")
    print(f"Phone: {admin['phone']}")
    print(f"Email: {admin['email']}")
    print(f"Role: {admin['role']}")
    print(f"Status: {admin['status']}")
    print(f"Created: {admin['created_at']}")
    print(f"Last Login: {admin['last_login']}")

cursor.close()
conn.close()
