"""Update admin user with proper phone number"""
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

# Update admin phone to a valid number
new_phone = '9876543210'  # Change this if you want a different number

cursor.execute("""
    UPDATE users 
    SET phone = %s 
    WHERE id = 1 AND role = 'admin'
    RETURNING id, name, phone, role
""", (new_phone,))

result = cursor.fetchone()
conn.commit()

if result:
    print(f"\n✅ Admin user updated successfully!")
    print(f"   ID: {result[0]}")
    print(f"   Name: {result[1]}")
    print(f"   Phone: {result[2]}")
    print(f"   Role: {result[3]}")
    print(f"\n📱 Now login with phone: {result[2]}")
    print(f"💡 You'll receive an OTP to this number")
else:
    print("\n❌ Failed to update admin user")

cursor.close()
conn.close()
