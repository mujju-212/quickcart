"""
Create or update an admin user in the database
"""
import psycopg2
from psycopg2.extras import RealDictCursor

# Database connection
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'blink_basket',
    'user': 'postgres',
    'password': 'mk0492'
}

def check_and_create_admin():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        print("\n" + "="*60)
        print("🔍 CHECKING ADMIN USERS")
        print("="*60)
        
        # Check for existing admin users
        cursor.execute("SELECT id, name, phone, role, status FROM users WHERE role = 'admin'")
        admins = cursor.fetchall()
        
        if admins:
            print(f"\n✅ Found {len(admins)} admin user(s):\n")
            for admin in admins:
                print(f"   ID: {admin['id']}")
                print(f"   Name: {admin['name']}")
                print(f"   Phone: {admin['phone']}")
                print(f"   Status: {admin['status']}")
                print()
        else:
            print("\n❌ NO ADMIN USERS FOUND!")
            print("\n🔧 Creating default admin user...")
            
            # Create a default admin user
            cursor.execute("""
                INSERT INTO users (name, phone, role, status)
                VALUES ('Admin User', '9999999999', 'admin', 'active')
                RETURNING id, name, phone, role
            """)
            
            new_admin = cursor.fetchone()
            conn.commit()
            
            print(f"\n✅ Admin user created successfully!")
            print(f"   ID: {new_admin['id']}")
            print(f"   Name: {new_admin['name']}")
            print(f"   Phone: {new_admin['phone']}")
            print(f"   Role: {new_admin['role']}")
            print(f"\n📱 Login with phone: {new_admin['phone']}")
        
        # Show all users
        cursor.execute("SELECT role, COUNT(*) as count FROM users GROUP BY role")
        counts = cursor.fetchall()
        
        print("\n📊 USER DISTRIBUTION:")
        for row in counts:
            print(f"   • {row['role']}: {row['count']} users")
        
        print("\n" + "="*60)
        print("✅ DONE!")
        print("="*60)
        
        cursor.close()
        conn.close()
        
    except psycopg2.Error as e:
        print(f"\n❌ Database Error: {e}")
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == '__main__':
    check_and_create_admin()
