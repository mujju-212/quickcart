"""
Quick script to check what data exists in the database
"""
import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = "postgresql://postgres:mk0492@localhost:5432/blink_basket"

def check_data():
    conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
    cursor = conn.cursor()
    
    print("=" * 60)
    print("📊 DATABASE DATA CHECK")
    print("=" * 60)
    
    # Check categories
    cursor.execute("SELECT COUNT(*) as count FROM categories")
    cat_count = cursor.fetchone()['count']
    print(f"\n📂 Categories: {cat_count}")
    
    # Check products
    cursor.execute("SELECT COUNT(*) as count FROM products")
    prod_count = cursor.fetchone()['count']
    print(f"🛍️  Products: {prod_count}")
    
    # Check users
    cursor.execute("SELECT COUNT(*) as count FROM users")
    user_count = cursor.fetchone()['count']
    cursor.execute("SELECT COUNT(*) as count FROM users WHERE role = 'customer'")
    customer_count = cursor.fetchone()['count']
    print(f"👥 Total Users: {user_count}")
    print(f"👤 Customers: {customer_count}")
    
    # Check orders
    cursor.execute("SELECT COUNT(*) as count FROM orders")
    order_count = cursor.fetchone()['count']
    print(f"📦 Orders: {order_count}")
    
    # Check revenue
    cursor.execute("SELECT COALESCE(SUM(total), 0) as revenue FROM orders WHERE status != 'cancelled'")
    revenue = cursor.fetchone()['revenue']
    print(f"💰 Total Revenue: ₹{float(revenue):,.2f}")
    
    # Check order statuses
    cursor.execute("SELECT status, COUNT(*) as count FROM orders GROUP BY status")
    print("\n📊 Orders by Status:")
    for row in cursor.fetchall():
        print(f"  • {row['status']}: {row['count']}")
    
    # Check sample products
    cursor.execute("SELECT name, price, stock FROM products LIMIT 5")
    print("\n🛍️  Sample Products:")
    for row in cursor.fetchall():
        print(f"  • {row['name']}: ₹{row['price']} (Stock: {row['stock']})")
    
    print("\n" + "=" * 60)
    cursor.close()
    conn.close()

if __name__ == "__main__":
    check_data()
