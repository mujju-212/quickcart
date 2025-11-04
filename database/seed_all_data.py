"""
Comprehensive Database Seeding Script
Seeds the database with realistic sample data for testing and development
"""
import psycopg2
from psycopg2.extras import RealDictCursor
import random
from datetime import datetime, timedelta
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Database connection
DATABASE_URL = "postgresql://postgres:mk0492@localhost:5432/blink_basket"

def get_connection():
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)

def clear_all_data():
    """Clear existing data (optional - comment out if you want to keep existing data)"""
    print("🗑️  Clearing existing data...")
    conn = get_connection()
    cursor = conn.cursor()
    
    try:
        # Order matters due to foreign keys
        cursor.execute("DELETE FROM order_items")
        cursor.execute("DELETE FROM orders")
        cursor.execute("DELETE FROM cart_items")
        cursor.execute("DELETE FROM wishlist")
        cursor.execute("DELETE FROM products")
        cursor.execute("DELETE FROM categories")
        cursor.execute("DELETE FROM users WHERE role != 'admin'")  # Keep admin users
        
        conn.commit()
        print("✅ Existing data cleared")
    except Exception as e:
        conn.rollback()
        print(f"❌ Error clearing data: {e}")
    finally:
        cursor.close()
        conn.close()

def seed_categories():
    """Seed product categories"""
    print("\n📂 Seeding categories...")
    conn = get_connection()
    cursor = conn.cursor()
    
    categories = [
        ('Fruits', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400', 'active'),
        ('Vegetables', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400', 'active'),
        ('Dairy', 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400', 'active'),
        ('Beverages', 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=400', 'active'),
        ('Snacks', 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400', 'active'),
        ('Bakery', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', 'active'),
        ('Meat & Seafood', 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400', 'active'),
        ('Frozen Foods', 'https://images.unsplash.com/photo-1506617564039-2f3b650b7010?w=400', 'active'),
    ]
    
    category_ids = {}
    for name, img, status in categories:
        cursor.execute("""
            INSERT INTO categories (name, image_url, status, created_at)
            VALUES (%s, %s, %s, NOW())
            ON CONFLICT (name) DO UPDATE SET image_url = EXCLUDED.image_url
            RETURNING id
        """, (name, img, status))
        category_ids[name] = cursor.fetchone()['id']
        print(f"  ✓ {name}")
    
    conn.commit()
    cursor.close()
    conn.close()
    print(f"✅ {len(categories)} categories seeded")
    return category_ids

def seed_products(category_ids):
    """Seed products"""
    print("\n🛍️  Seeding products...")
    conn = get_connection()
    cursor = conn.cursor()
    
    products = [
        # Fruits
        ('Apple - Red Delicious', 'Fresh red apples', 'Fruits', 120, 140, 500, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', '1 kg', 'active'),
        ('Banana - Robusta', 'Fresh yellow bananas', 'Fruits', 40, 50, 300, 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400', '1 dozen', 'active'),
        ('Orange - Nagpur', 'Sweet oranges', 'Fruits', 80, 90, 250, 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400', '1 kg', 'active'),
        ('Mango - Alphonso', 'Premium Alphonso mangoes', 'Fruits', 200, 250, 150, 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400', '1 kg', 'active'),
        ('Grapes - Green', 'Seedless green grapes', 'Fruits', 100, 120, 200, 'https://images.unsplash.com/photo-1599819177331-6d0b2238da0f?w=400', '1 kg', 'active'),
        ('Watermelon', 'Sweet red watermelon', 'Fruits', 30, 40, 180, 'https://images.unsplash.com/photo-1587049352846-4a222e784769?w=400', '1 kg', 'active'),
        
        # Vegetables
        ('Tomato - Hybrid', 'Fresh red tomatoes', 'Vegetables', 35, 40, 400, 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400', '1 kg', 'active'),
        ('Potato', 'Fresh potatoes', 'Vegetables', 25, 30, 500, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400', '1 kg', 'active'),
        ('Onion - Red', 'Fresh red onions', 'Vegetables', 30, 35, 450, 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400', '1 kg', 'active'),
        ('Carrot', 'Fresh orange carrots', 'Vegetables', 40, 50, 300, 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400', '1 kg', 'active'),
        ('Spinach', 'Fresh green spinach', 'Vegetables', 20, 25, 200, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', '1 bunch', 'active'),
        ('Cabbage', 'Fresh green cabbage', 'Vegetables', 30, 35, 250, 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400', '1 piece', 'active'),
        
        # Dairy
        ('Milk - Full Cream', 'Fresh full cream milk', 'Dairy', 60, 70, 200, 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400', '1 liter', 'active'),
        ('Curd - Plain', 'Fresh plain curd', 'Dairy', 50, 60, 150, 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400', '500g', 'active'),
        ('Paneer', 'Fresh paneer', 'Dairy', 120, 140, 100, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', '200g', 'active'),
        ('Butter - Salted', 'Fresh salted butter', 'Dairy', 55, 65, 120, 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400', '100g', 'active'),
        ('Cheese - Slice', 'Cheese slices', 'Dairy', 180, 200, 80, 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400', '200g', 'active'),
        
        # Beverages
        ('Orange Juice', 'Fresh orange juice', 'Beverages', 80, 100, 100, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400', '1L', 'active'),
        ('Coca Cola', 'Soft drink', 'Beverages', 40, 50, 200, 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400', '750ml', 'active'),
        ('Mineral Water', 'Pure mineral water', 'Beverages', 20, 25, 500, 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400', '1L', 'active'),
        ('Green Tea', 'Organic green tea', 'Beverages', 150, 180, 80, 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400', '100g', 'active'),
        
        # Snacks
        ('Potato Chips', 'Crispy potato chips', 'Snacks', 25, 30, 300, 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400', '50g', 'active'),
        ('Biscuits - Marie', 'Classic marie biscuits', 'Snacks', 30, 35, 250, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', '200g', 'active'),
        ('Namkeen Mix', 'Spicy namkeen mix', 'Snacks', 40, 50, 200, 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400', '150g', 'active'),
        
        # Bakery
        ('White Bread', 'Fresh white bread', 'Bakery', 35, 40, 150, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', '400g', 'active'),
        ('Brown Bread', 'Whole wheat bread', 'Bakery', 40, 45, 120, 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400', '400g', 'active'),
        ('Croissant', 'Butter croissant', 'Bakery', 45, 55, 80, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', '2 piece', 'active'),
        
        # Meat & Seafood
        ('Chicken - Breast', 'Fresh chicken breast', 'Meat & Seafood', 280, 320, 100, 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400', '1 kg', 'active'),
        ('Fish - Pomfret', 'Fresh pomfret fish', 'Meat & Seafood', 400, 450, 50, 'https://images.unsplash.com/photo-1534940519139-f860fb3c6e38?w=400', '1 kg', 'active'),
        ('Prawns', 'Fresh prawns', 'Meat & Seafood', 500, 550, 40, 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400', '1 kg', 'active'),
        
        # Frozen Foods
        ('Frozen Peas', 'Frozen green peas', 'Frozen Foods', 60, 70, 150, 'https://images.unsplash.com/photo-1564834744159-ff0ea41ba4b9?w=400', '500g', 'active'),
        ('Frozen Mixed Veg', 'Mixed vegetables', 'Frozen Foods', 80, 90, 120, 'https://images.unsplash.com/photo-1506617564039-2f3b650b7010?w=400', '500g', 'active'),
    ]
    
    product_ids = []
    for name, desc, cat_name, price, original_price, stock, img, size, status in products:
        cursor.execute("""
            INSERT INTO products (name, description, category_id, category_name, price, original_price, stock, image_url, size, status, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
            RETURNING id
        """, (name, desc, category_ids[cat_name], cat_name, price, original_price, stock, img, size, status))
        product_ids.append(cursor.fetchone()['id'])
        print(f"  ✓ {name}")
    
    conn.commit()
    cursor.close()
    conn.close()
    print(f"✅ {len(products)} products seeded")
    return product_ids

def seed_users():
    """Seed sample users"""
    print("\n👥 Seeding users...")
    conn = get_connection()
    cursor = conn.cursor()
    
    users = [
        ('Rahul Sharma', '9876543210', 'customer', 'active'),
        ('Priya Singh', '9876543211', 'customer', 'active'),
        ('Amit Kumar', '9876543212', 'customer', 'active'),
        ('Neha Patel', '9876543213', 'customer', 'active'),
        ('Vikas Gupta', '9876543214', 'customer', 'active'),
        ('Anjali Verma', '9876543215', 'customer', 'active'),
        ('Rajesh Reddy', '9876543216', 'customer', 'active'),
        ('Sneha Mehta', '9876543217', 'customer', 'active'),
        ('Karan Chopra', '9876543218', 'customer', 'active'),
        ('Pooja Iyer', '9876543219', 'customer', 'active'),
        ('Arjun Nair', '9876543220', 'customer', 'active'),
        ('Divya Shah', '9876543221', 'customer', 'active'),
        ('Rohit Joshi', '9876543222', 'customer', 'active'),
        ('Kavita Desai', '9876543223', 'customer', 'active'),
        ('Sandeep Kumar', '9876543224', 'customer', 'active'),
    ]
    
    user_ids = []
    for name, phone, role, status in users:
        cursor.execute("""
            INSERT INTO users (name, phone, role, status, created_at)
            VALUES (%s, %s, %s, %s, NOW())
            ON CONFLICT (phone) DO NOTHING
            RETURNING id
        """, (name, phone, role, status))
        result = cursor.fetchone()
        if result:
            user_ids.append(result['id'])
            print(f"  ✓ {name} ({phone})")
    
    conn.commit()
    cursor.close()
    conn.close()
    print(f"✅ {len(user_ids)} users seeded")
    return user_ids

def seed_orders(user_ids, product_ids):
    """Seed realistic orders with items"""
    print("\n📦 Seeding orders...")
    conn = get_connection()
    cursor = conn.cursor()
    
    statuses = ['delivered', 'delivered', 'delivered', 'shipped', 'processing', 'pending', 'cancelled']
    status_map = {
        'delivered': 'delivered',
        'shipped': 'out_for_delivery',
        'processing': 'preparing',
        'pending': 'pending',
        'cancelled': 'cancelled'
    }
    payment_methods = ['cod', 'online', 'online', 'cod']
    
    orders_created = 0
    total_revenue = 0
    
    # Get user details for generating orders
    cursor.execute("SELECT id, name, phone FROM users WHERE role = 'customer'")
    users = cursor.fetchall()
    
    if not users:
        print("❌ No users found. Please seed users first.")
        conn.close()
        return 0
    
    # Create orders for the last 90 days
    for days_ago in range(90, -1, -1):
        order_date = datetime.now() - timedelta(days=days_ago)
        
        # Random number of orders per day (0-8 orders)
        num_orders = random.randint(0, 8)
        
        for _ in range(num_orders):
            user = random.choice(users)
            status_key = random.choice(statuses)
            status = status_map[status_key]
            payment_method = random.choice(payment_methods)
            payment_status = 'completed' if status == 'delivered' else 'pending'
            
            # Generate order ID
            order_id = f"ORD{order_date.strftime('%Y%m%d')}{random.randint(1000, 9999)}"
            
            # Calculate order items first
            num_items = random.randint(1, 5)
            selected_products = random.sample(product_ids, min(num_items, len(product_ids)))
            
            # Get product details
            order_items = []
            subtotal = 0
            
            for product_id in selected_products:
                cursor.execute("SELECT name, price FROM products WHERE id = %s", (product_id,))
                product = cursor.fetchone()
                if product:
                    quantity = random.randint(1, 3)
                    price = float(product['price'])
                    item_total = price * quantity
                    subtotal += item_total
                    
                    order_items.append({
                        'product_id': product_id,
                        'product_name': product['name'],
                        'price': price,
                        'quantity': quantity,
                        'total': item_total
                    })
            
            if not order_items:
                continue
            
            delivery_fee = 20.00
            total = subtotal + delivery_fee
            
            # Create order
            try:
                cursor.execute("""
                    INSERT INTO orders (
                        id, user_id, phone, user_name, total, subtotal, delivery_fee,
                        status, payment_method, payment_status, 
                        delivery_address, order_date, created_at, updated_at
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    order_id, user['id'], user['phone'], user['name'], 
                    total, subtotal, delivery_fee,
                    status, payment_method, payment_status,
                    f"{user['name']}, Sample Street, City - 400001",
                    order_date.date(), order_date, order_date
                ))
                
                # Insert order items
                for item in order_items:
                    cursor.execute("""
                        INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, total_price, created_at)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """, (order_id, item['product_id'], item['product_name'], item['price'], item['quantity'], item['total'], order_date))
                
                if status != 'cancelled':
                    total_revenue += total
                
                orders_created += 1
                
                if orders_created % 50 == 0:
                    conn.commit()
                    print(f"  ✓ Created {orders_created} orders...")
                    
            except Exception as e:
                print(f"  ⚠️  Error creating order {order_id}: {e}")
                conn.rollback()
                continue
    
    conn.commit()
    cursor.close()
    conn.close()
    print(f"✅ {orders_created} orders seeded")
    print(f"💰 Total revenue: ₹{total_revenue:,.2f}")
    return orders_created

def main():
    print("=" * 60)
    print("🌱 QuickCart Database Seeding")
    print("=" * 60)
    
    try:
        # Optional: Clear existing data (comment out if you want to keep existing data)
        # clear_all_data()
        
        # Seed in order (due to foreign key constraints)
        category_ids = seed_categories()
        product_ids = seed_products(category_ids)
        user_ids = seed_users()
        orders_count = seed_orders(user_ids, product_ids)
        
        print("\n" + "=" * 60)
        print("✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!")
        print("=" * 60)
        print(f"📊 Summary:")
        print(f"  • Categories: {len(category_ids)}")
        print(f"  • Products: {len(product_ids)}")
        print(f"  • Users: {len(user_ids)}")
        print(f"  • Orders: {orders_count}")
        print("\n🎉 Your dashboard should now show real data!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Error seeding database: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
