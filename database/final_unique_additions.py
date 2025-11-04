import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

conn = psycopg2.connect('postgresql://postgres:mk0492@localhost:5432/blink_basket')
cur = conn.cursor(cursor_factory=RealDictCursor)

# Final unique products with completely different names
final_products = {
    3: [  # Bakery & Biscuits
        ('Unibic Choco Ripple Cookies', 40, 50, 160, '150 g', 'Chocolate ripple cookies', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'),
        ('Dukes Waffy Wafers', 10, 15, 250, '75 g', 'Cream wafers', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'),
    ],
    38: [  # Dairy
        ('Go Cheese Slices Pack', 130, 155, 105, '200 g', 'Processed cheese', 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=400'),
    ],
    40: [  # Snacks
        ('Kurkure Masala Munch', 10, 15, 270, '90 g', 'Crunchy snack', 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400'),
        ('Aloo Bhujia Namkeen Haldirams', 38, 48, 185, '200 g', 'Potato snack', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'),
        ('Bikaji Namkeen Mix Variety', 36, 46, 195, '200 g', 'Mixed namkeen', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'),
        ('Uncle Chipps Spicy Treat', 10, 15, 265, '55 g', 'Spicy potato chips', 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400'),
        ('Bingo Tedhe Medhe Masala', 10, 15, 275, '65 g', 'Twisted snack', 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400'),
    ],
    41: [  # Bakery
        ('Marble Cake Slice', 420, 520, 45, '500 g', 'Chocolate marble cake', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'),
    ],
}

print("=" * 70)
print("ADDING FINAL UNIQUE PRODUCTS")
print("=" * 70)

total_added = 0

for cat_id, products in final_products.items():
    cur.execute('SELECT name FROM categories WHERE id = %s', (cat_id,))
    cat_name = cur.fetchone()['name']
    
    cur.execute('SELECT COUNT(*) as count FROM products WHERE category_id = %s AND status = %s', (cat_id, 'active'))
    current_count = cur.fetchone()['count']
    needed = 30 - current_count
    
    print(f"\n📦 {cat_name} (ID: {cat_id})")
    print(f"   Current: {current_count}, Need: {needed}")
    
    cur.execute('SELECT name FROM products WHERE category_id = %s', (cat_id,))
    existing = {row['name'] for row in cur.fetchall()}
    
    added_count = 0
    for name, price, original_price, stock, size, description, image_url in products:
        if name in existing:
            print(f"   ⏭️  Skipping '{name}' (exists)")
            continue
        
        if added_count >= needed:
            break
        
        try:
            cur.execute('''
                INSERT INTO products (name, category_id, price, original_price, stock, size, description, image_url, status, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'active', %s)
            ''', (name, cat_id, price, original_price, stock, size, description, image_url, datetime.now()))
            added_count += 1
            total_added += 1
            print(f"   ✅ {name} (Stock: {stock})")
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    print(f"   → Added {added_count} (Total: {current_count + added_count})")

conn.commit()
cur.close()
conn.close()

print("\n" + "=" * 70)
print(f"✅ ADDED {total_added} PRODUCTS!")
print("=" * 70)
