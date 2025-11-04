import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

# Connect to database
conn = psycopg2.connect('postgresql://postgres:mk0492@localhost:5432/blink_basket')
cur = conn.cursor(cursor_factory=RealDictCursor)

# Define products for each category with realistic details
# Format: (name, price, original_price, stock, size, description, image_url)

products_data = {
    'Fruits & Vegetables': [
        ('Fresh Tomatoes', 40, 50, 100, '1 kg', 'Fresh red tomatoes, perfect for cooking', 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400'),
        ('Green Spinach', 30, 35, 80, '500 g', 'Fresh green spinach leaves', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400'),
        ('Fresh Carrots', 35, 45, 120, '1 kg', 'Crunchy orange carrots, rich in Vitamin A', 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400'),
        ('Onions', 25, 30, 150, '1 kg', 'Fresh red onions', 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400'),
        ('Potatoes', 20, 25, 200, '1 kg', 'Fresh potatoes for daily cooking', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400'),
        ('Fresh Ginger', 80, 100, 50, '250 g', 'Fresh ginger root', 'https://images.unsplash.com/photo-1599639957043-f3aa5c986398?w=400'),
        ('Fresh Garlic', 120, 150, 60, '250 g', 'Fresh garlic bulbs', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400'),
        ('Fresh Cucumber', 30, 40, 90, '500 g', 'Fresh green cucumbers', 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400'),
        ('Fresh Bell Peppers', 60, 75, 70, '500 g', 'Colorful bell peppers', 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400'),
        ('Fresh Cauliflower', 45, 55, 85, '1 pc', 'Fresh white cauliflower', 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400'),
        ('Fresh Cabbage', 35, 45, 90, '1 pc', 'Fresh green cabbage', 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400'),
        ('Fresh Broccoli', 80, 100, 65, '500 g', 'Fresh green broccoli', 'https://images.unsplash.com/photo-1584270354949-c26e0d6d70a4?w=400'),
        ('Fresh Beans', 50, 60, 100, '500 g', 'Fresh green beans', 'https://images.unsplash.com/photo-1567501671664-eda5f8f2c08f?w=400'),
        ('Fresh Peas', 60, 70, 80, '500 g', 'Fresh green peas', 'https://images.unsplash.com/photo-1587411768378-125369f8b4f2?w=400'),
        ('Fresh Beetroot', 45, 55, 75, '500 g', 'Fresh purple beetroot', 'https://images.unsplash.com/photo-1595585069708-de4c0ee57f46?w=400'),
        ('Fresh Radish', 35, 45, 70, '500 g', 'Fresh white radish', 'https://images.unsplash.com/photo-1615485290889-6b8dcc38223d?w=400'),
        ('Fresh Bottle Gourd', 30, 40, 60, '1 pc', 'Fresh bottle gourd (lauki)', 'https://images.unsplash.com/photo-1625171515074-e7e28c9eb7a6?w=400'),
        ('Fresh Bitter Gourd', 40, 50, 50, '500 g', 'Fresh bitter gourd (karela)', 'https://images.unsplash.com/photo-1629849472480-e5c1c50ee80c?w=400'),
        ('Fresh Ridge Gourd', 35, 45, 55, '500 g', 'Fresh ridge gourd (turai)', 'https://images.unsplash.com/photo-1628773187814-3b3c29c0b650?w=400'),
        ('Fresh Pumpkin', 25, 35, 100, '1 kg', 'Fresh orange pumpkin', 'https://images.unsplash.com/photo-1569976710208-b52636b52c71?w=400'),
        ('Fresh Eggplant', 40, 50, 85, '500 g', 'Fresh purple eggplant (baingan)', 'https://images.unsplash.com/photo-1659261200032-c5ec24d4d634?w=400'),
        ('Fresh Okra', 50, 60, 70, '500 g', 'Fresh green okra (bhindi)', 'https://images.unsplash.com/photo-1596943376820-a5915e677088?w=400'),
        ('Fresh Drumsticks', 60, 75, 65, '500 g', 'Fresh drumsticks (moringa)', 'https://images.unsplash.com/photo-1587411768341-f51d1d5bb31f?w=400'),
        ('Fresh Mushrooms', 100, 120, 40, '250 g', 'Fresh button mushrooms', 'https://images.unsplash.com/photo-1565607136829-825d55a7a3c7?w=400'),
        ('Fresh Corn', 35, 45, 90, '2 pcs', 'Fresh sweet corn', 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400'),
        ('Fresh Lemon', 80, 100, 100, '500 g', 'Fresh juicy lemons', 'https://images.unsplash.com/photo-1587214012736-12e502e1c0ac?w=400'),
        ('Fresh Coriander', 20, 25, 150, '100 g', 'Fresh coriander leaves', 'https://images.unsplash.com/photo-1599223634533-8e9d7b7ff19c?w=400'),
        ('Fresh Mint', 20, 25, 120, '100 g', 'Fresh mint leaves', 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400'),
        ('Fresh Curry Leaves', 15, 20, 100, '50 g', 'Fresh curry leaves', 'https://images.unsplash.com/photo-1596547609652-9cf0d4dcffc7?w=400'),
        ('Fresh Green Chillies', 30, 40, 110, '250 g', 'Fresh hot green chillies', 'https://images.unsplash.com/photo-1584663645472-bf23f61afa10?w=400'),
    ],
    
    'Fruits': [
        ('Fresh Bananas', 50, 60, 150, '1 dozen', 'Fresh ripe bananas', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400'),
        ('Red Apples', 120, 150, 100, '1 kg', 'Fresh red apples from Kashmir', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400'),
        ('Fresh Oranges', 80, 100, 120, '1 kg', 'Sweet juicy oranges', 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400'),
        ('Fresh Grapes', 100, 120, 80, '500 g', 'Fresh green grapes', 'https://images.unsplash.com/photo-1599819177462-be57de6f0c73?w=400'),
        ('Fresh Mango', 150, 180, 90, '1 kg', 'Fresh Alphonso mangoes', 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400'),
        ('Fresh Pineapple', 60, 75, 70, '1 pc', 'Fresh sweet pineapple', 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400'),
        ('Fresh Pomegranate', 140, 170, 75, '1 kg', 'Fresh red pomegranates', 'https://images.unsplash.com/photo-1557160921-42574e41b25d?w=400'),
        ('Fresh Watermelon', 30, 40, 100, '1 kg', 'Fresh sweet watermelon', 'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=400'),
        ('Fresh Papaya', 40, 50, 85, '1 kg', 'Fresh ripe papaya', 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400'),
        ('Fresh Kiwi', 200, 250, 50, '500 g', 'Fresh New Zealand kiwi', 'https://images.unsplash.com/photo-1588935268608-df09d03fec20?w=400'),
        ('Fresh Strawberries', 250, 300, 40, '250 g', 'Fresh red strawberries', 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400'),
        ('Fresh Guava', 60, 75, 90, '1 kg', 'Fresh pink guava', 'https://images.unsplash.com/photo-1536511132770-e5058c0e5c53?w=400'),
        ('Fresh Pears', 130, 160, 70, '1 kg', 'Fresh juicy pears', 'https://images.unsplash.com/photo-1568031813264-d394c5d474b9?w=400'),
        ('Fresh Plums', 150, 180, 60, '500 g', 'Fresh purple plums', 'https://images.unsplash.com/photo-1604848246103-ce5d4de0e14a?w=400'),
        ('Fresh Peaches', 180, 220, 55, '500 g', 'Fresh sweet peaches', 'https://images.unsplash.com/photo-1629828874514-7fed1cd46eb7?w=400'),
        ('Fresh Cherries', 300, 350, 35, '250 g', 'Fresh red cherries', 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=400'),
        ('Fresh Lychee', 200, 240, 45, '500 g', 'Fresh sweet lychee', 'https://images.unsplash.com/photo-1609919862612-34d3e76c9c8b?w=400'),
        ('Fresh Dragon Fruit', 180, 220, 40, '1 pc', 'Fresh white dragon fruit', 'https://images.unsplash.com/photo-1576181206675-ede194e55a96?w=400'),
        ('Fresh Passion Fruit', 250, 300, 30, '250 g', 'Fresh passion fruit', 'https://images.unsplash.com/photo-1605522612207-0e9ad7631733?w=400'),
        ('Fresh Coconut', 45, 55, 100, '1 pc', 'Fresh coconut with water', 'https://images.unsplash.com/photo-1598136704180-6e935c7d1b3c?w=400'),
        ('Fresh Muskmelon', 35, 45, 80, '1 kg', 'Fresh sweet muskmelon', 'https://images.unsplash.com/photo-1629830374041-8f0a78d672e3?w=400'),
        ('Fresh Custard Apple', 100, 120, 60, '500 g', 'Fresh custard apple (sitaphal)', 'https://images.unsplash.com/photo-1620803366004-119b57e8f1b1?w=400'),
        ('Fresh Dates', 280, 320, 50, '500 g', 'Fresh Ajwa dates', 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400'),
        ('Fresh Figs', 350, 400, 35, '250 g', 'Fresh anjeer figs', 'https://images.unsplash.com/photo-1620121182532-e9aaeee34ca7?w=400'),
        ('Fresh Avocado', 200, 250, 40, '1 pc', 'Fresh ripe avocado', 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400'),
        ('Fresh Blueberries', 400, 450, 25, '125 g', 'Fresh blueberries', 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400'),
        ('Fresh Raspberries', 450, 500, 20, '125 g', 'Fresh red raspberries', 'https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?w=400'),
        ('Fresh Blackberries', 420, 470, 22, '125 g', 'Fresh blackberries', 'https://images.unsplash.com/photo-1620574387735-3fc3c05b2bb4?w=400'),
        ('Fresh Apricots', 250, 300, 45, '500 g', 'Fresh sweet apricots', 'https://images.unsplash.com/photo-1623074716561-45f9a9e0f39f?w=400'),
        ('Fresh Grapefruit', 120, 150, 50, '1 kg', 'Fresh pink grapefruit', 'https://images.unsplash.com/photo-1598468413052-9092f1f82c07?w=400'),
    ],
    
    'Vegetables': [
        ('Baby Carrots', 80, 100, 60, '500 g', 'Fresh baby carrots', 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400'),
        ('Baby Corn', 90, 110, 50, '250 g', 'Fresh baby corn', 'https://images.unsplash.com/photo-1536304447803-dc61a93d1180?w=400'),
        ('Cherry Tomatoes', 100, 120, 70, '500 g', 'Fresh cherry tomatoes', 'https://images.unsplash.com/photo-1592924357541-4fae5b5e8f66?w=400'),
        ('Spring Onions', 35, 45, 80, '250 g', 'Fresh spring onions', 'https://images.unsplash.com/photo-1633694388891-1b78f52d0a90?w=400'),
        ('Iceberg Lettuce', 60, 75, 50, '1 pc', 'Fresh iceberg lettuce', 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400'),
        ('Romaine Lettuce', 70, 85, 45, '1 pc', 'Fresh romaine lettuce', 'https://images.unsplash.com/photo-1640958904159-51951eb4649b?w=400'),
        ('Chinese Cabbage', 55, 70, 60, '1 pc', 'Fresh Chinese cabbage', 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=400'),
        ('Bok Choy', 65, 80, 55, '500 g', 'Fresh bok choy', 'https://images.unsplash.com/photo-1618417699296-acefb2d8e744?w=400'),
        ('Zucchini', 70, 85, 65, '500 g', 'Fresh green zucchini', 'https://images.unsplash.com/photo-1564268510-1e1a1d7e23b1?w=400'),
        ('Yellow Squash', 75, 90, 60, '500 g', 'Fresh yellow squash', 'https://images.unsplash.com/photo-1598209153850-e9c50e229ef2?w=400'),
        ('Sweet Potato', 50, 65, 100, '1 kg', 'Fresh sweet potatoes', 'https://images.unsplash.com/photo-1591204603736-ffeaa35e2da1?w=400'),
        ('Purple Cabbage', 45, 60, 70, '1 pc', 'Fresh purple cabbage', 'https://images.unsplash.com/photo-1621949280706-88e7c7afc7f7?w=400'),
        ('Green Capsicum', 55, 70, 85, '500 g', 'Fresh green capsicum', 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400'),
        ('Yellow Capsicum', 70, 85, 75, '500 g', 'Fresh yellow capsicum', 'https://images.unsplash.com/photo-1600958146359-f4479c8f368d?w=400'),
        ('Red Capsicum', 75, 90, 70, '500 g', 'Fresh red capsicum', 'https://images.unsplash.com/photo-1571066811602-716837d681de?w=400'),
        ('Orange Capsicum', 80, 95, 65, '500 g', 'Fresh orange capsicum', 'https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?w=400'),
        ('Kale', 80, 100, 50, '500 g', 'Fresh green kale', 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400'),
        ('Celery', 60, 75, 60, '500 g', 'Fresh celery stalks', 'https://images.unsplash.com/photo-1607807567993-20f8ff890d0c?w=400'),
        ('Leeks', 70, 85, 55, '500 g', 'Fresh leeks', 'https://images.unsplash.com/photo-1618398725719-6f0c8e7d8d92?w=400'),
        ('Turnip', 40, 55, 70, '500 g', 'Fresh turnips', 'https://images.unsplash.com/photo-1603893004253-5657e11c8353?w=400'),
        ('Parsnip', 65, 80, 60, '500 g', 'Fresh parsnips', 'https://images.unsplash.com/photo-1503385079860-07bd84b75020?w=400'),
        ('Brussels Sprouts', 100, 120, 45, '500 g', 'Fresh Brussels sprouts', 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400'),
        ('Asparagus', 200, 250, 40, '250 g', 'Fresh green asparagus', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400'),
        ('Artichoke', 250, 300, 30, '1 pc', 'Fresh artichoke', 'https://images.unsplash.com/photo-1578112010158-eb4699d9aa43?w=400'),
        ('Swiss Chard', 75, 90, 50, '500 g', 'Fresh Swiss chard', 'https://images.unsplash.com/photo-1609626621014-e48c98c49b85?w=400'),
        ('Collard Greens', 70, 85, 55, '500 g', 'Fresh collard greens', 'https://images.unsplash.com/photo-1571849324769-b1e8c47e8c0c?w=400'),
        ('Mustard Greens', 65, 80, 60, '500 g', 'Fresh mustard greens', 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=400'),
        ('Fennel', 90, 110, 45, '500 g', 'Fresh fennel bulbs', 'https://images.unsplash.com/photo-1617607922853-c6df41ed15e8?w=400'),
        ('Water Chestnuts', 120, 150, 40, '500 g', 'Fresh water chestnuts', 'https://images.unsplash.com/photo-1619566636777-b86f1a2e2b8a?w=400'),
        ('Bamboo Shoots', 100, 130, 35, '500 g', 'Fresh bamboo shoots', 'https://images.unsplash.com/photo-1589894404698-1df10eaa7452?w=400'),
    ],
}

print("=" * 60)
print("POPULATING PRODUCTS FOR CATEGORIES")
print("=" * 60)

# Get category IDs
cur.execute("SELECT id, name FROM categories WHERE name IN ('Fruits & Vegetables', 'Fruits', 'Vegetables')")
categories = {row['name']: row['id'] for row in cur.fetchall()}

total_added = 0

for category_name, products in products_data.items():
    if category_name not in categories:
        print(f"\n⚠️  Category '{category_name}' not found, skipping...")
        continue
    
    category_id = categories[category_name]
    print(f"\n📦 Adding products to '{category_name}' (ID: {category_id})")
    
    # Check existing products in this category
    cur.execute('SELECT name FROM products WHERE category_id = %s', (category_id,))
    existing_products = {row['name'] for row in cur.fetchall()}
    
    added_count = 0
    for name, price, original_price, stock, size, description, image_url in products:
        if name in existing_products:
            print(f"   ⏭️  Skipping '{name}' (already exists)")
            continue
        
        try:
            cur.execute('''
                INSERT INTO products (name, category_id, price, original_price, stock, size, description, image_url, status, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'active', %s)
            ''', (name, category_id, price, original_price, stock, size, description, image_url, datetime.now()))
            added_count += 1
            total_added += 1
            print(f"   ✅ Added: {name}")
        except Exception as e:
            print(f"   ❌ Error adding {name}: {e}")
    
    print(f"   → Added {added_count} new products to {category_name}")

conn.commit()
cur.close()
conn.close()

print("\n" + "=" * 60)
print(f"✅ SUCCESSFULLY ADDED {total_added} NEW PRODUCTS!")
print("=" * 60)
