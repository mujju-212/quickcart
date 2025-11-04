"""Make existing user (9611608706) an admin"""
import psycopg2

DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'blink_basket',
    'user': 'postgres',
    'password': 'mk0492'
}

conn = psycopg2.connect(**DB_CONFIG)
cursor = conn.cursor()

# Make user with phone 9611608706 an admin
cursor.execute("""
    UPDATE users 
    SET role = 'admin' 
    WHERE phone = '9611608706'
    RETURNING id, name, phone, role
""")

result = cursor.fetchone()
conn.commit()

if result:
    print(f"\n✅ User upgraded to admin successfully!")
    print(f"   ID: {result[0]}")
    print(f"   Name: {result[1]}")
    print(f"   Phone: {result[2]}")
    print(f"   Role: {result[3]}")
    print(f"\n📱 Now:")
    print(f"   1. Restart backend: cd d:\\quickcart\\backend; python app.py")
    print(f"   2. Log out from your app")
    print(f"   3. Log in with phone: {result[2]}")
    print(f"   4. You'll get a NEW token with admin access!")
else:
    print("\n❌ Failed to update user")

cursor.close()
conn.close()
