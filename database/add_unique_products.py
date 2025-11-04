import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

conn = psycopg2.connect('postgresql://postgres:mk0492@localhost:5432/blink_basket')
cur = conn.cursor(cursor_factory=RealDictCursor)

# Check which categories need products
cur.execute('''
    SELECT c.id, c.name, COUNT(p.id) as product_count
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
    WHERE c.status = 'active'
    GROUP BY c.id, c.name
    HAVING COUNT(p.id) < 30
    ORDER BY COUNT(p.id) ASC
''')

categories_needing_products = cur.fetchall()

print("=" * 70)
print("CATEGORIES NEEDING PRODUCTS")
print("=" * 70)

for cat in categories_needing_products:
    needed = 30 - cat['product_count']
    print(f"{cat['name']:30} - Need {needed} more products")

# Completely unique products for each category
unique_products = {
    'Bakery & Biscuits': [
        ('Parle-G Gluco Biscuit', 5, 10, 300, '100 g', 'Classic glucose biscuit', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'),
        ('Britannia Tiger Biscuits', 10, 15, 250, '100 g', 'Crunchy butter cookies', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'),
    ],
    
    'Dairy': [
        ('Amul Masti Dahi', 24, 30, 190, '400 g', 'Smooth curd', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400'),
        ('Nestle A+ Milk', 28, 35, 200, '500 ml', 'Toned milk', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400'),
        ('Britannia Milkman Dahi', 22, 28, 195, '200 g', 'Fresh yogurt', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400'),
    ],
    
    'Snacks': [
        ('Mad Angles Achari Masti', 10, 15, 260, '72 g', 'Pickle flavor chips', 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400'),
        ('Lays American Style Cream', 20, 25, 240, '52 g', 'Cream chips', 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400'),
        ('Bingo Yumitos Tomato', 10, 15, 250, '65 g', 'Tomato chips', 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400'),
        ('Cheetos Flaming Hot', 20, 28, 220, '50 g', 'Spicy cheese snack', 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400'),
    ],
    
    'Bakery': [
        ('Walnut Cake', 580, 680, 28, '500 g', 'Rich walnut cake', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'),
        ('Carrot Cake', 520, 620, 32, '500 g', 'Cream cheese carrot cake', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400'),
        ('Tiramisu Cake', 680, 780, 25, '500 g', 'Italian tiramisu', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400'),
        ('Choco Lava Cake', 350, 450, 40, '2 pcs', 'Melting chocolate cake', 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400'),
    ],
    
    'Tea, Coffee & Health Drink': [
        ('Wagh Bakri Tea', 260, 290, 115, '1 kg', 'Premium tea leaves', 'https://images.unsplash.com/photo-1597318167374-45db9e05eeef?w=400'),
    ],
}

total_added = 0

for cat_dict in categories_needing_products:
    cat_name = cat_dict['name']
    cat_id = cat_dict['id']
    needed = 30 - cat_dict['product_count']
    
    if cat_name not in unique_products:
        continue
    
    print(f"\n📦 Adding to {cat_name} (need {needed} products)")
    
    # Get existing product names
    cur.execute('SELECT name FROM products WHERE category_id = %s', (cat_id,))
    existing = {row['name'] for row in cur.fetchall()}
    
    added_count = 0
    for name, price, original_price, stock, size, description, image_url in unique_products[cat_name]:
        if name in existing:
            print(f"   ⏭️  Skipping '{name}' (already exists)")
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
            print(f"   ✅ Added: {name}")
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    print(f"   → Added {added_count} products")

conn.commit()
cur.close()
conn.close()

print("\n" + "=" * 70)
print(f"✅ Added {total_added} unique products!")
print("=" * 70)
