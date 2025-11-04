"""List all users to find available phone"""
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

print("\n" + "="*80)
print("👥 ALL USERS")
print("="*80)

cursor.execute("SELECT id, name, phone, role, status FROM users ORDER BY role, id LIMIT 20")
users = cursor.fetchall()

for user in users:
    emoji = "👑" if user['role'] == 'admin' else "👤"
    print(f"{emoji} ID: {user['id']:3d} | Phone: {user['phone']:15s} | Name: {user['name']:20s} | Role: {user['role']}")

print("\n" + "="*80)

cursor.close()
conn.close()
