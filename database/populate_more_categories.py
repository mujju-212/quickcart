import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

conn = psycopg2.connect('postgresql://postgres:mk0492@localhost:5432/blink_basket')
cur = conn.cursor(cursor_factory=RealDictCursor)

# More products for remaining popular categories
products_data = {
    'Dairy & Breakfast': [
        ('Amul Taaza Milk', 26, 28, 200, '500 ml', 'Fresh toned milk', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400'),
        ('Amul Gold Milk', 30, 32, 180, '500 ml', 'Full cream milk', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400'),
        ('Mother Dairy Curd', 28, 30, 150, '400 g', 'Fresh curd', 'https://images.unsplash.com/photo-1571212515416-236ae5716750?w=400'),
        ('Britannia Bread', 40, 45, 100, '400 g', 'Sandwich bread', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'),
        ('Amul Butter', 50, 55, 120, '100 g', 'Fresh salted butter', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400'),
        ('Britannia Cheese Slices', 120, 130, 90, '200 g', 'Processed cheese', 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400'),
        ('Kellogs Cornflakes', 180, 200, 80, '475 g', 'Breakfast cereal', 'https://images.unsplash.com/photo-1612551004825-cb6d3c416a85?w=400'),
        ('Quaker Oats', 150, 170, 100, '1 kg', 'Rolled oats', 'https://images.unsplash.com/photo-1574943320265-ab1de86a96ab?w=400'),
        ('Nestle Ceregrow', 280, 310, 60, '300 g', 'Multigrain cereal', 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400'),
        ('Saffola Oats', 180, 200, 85, '1 kg', 'Masala oats', 'https://images.unsplash.com/photo-1589873264671-f69f5e4dc835?w=400'),
        ('Bagrry\'s Muesli', 350, 400, 50, '500 g', 'Crunchy muesli', 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400'),
        ('Amul Paneer', 90, 100, 110, '200 g', 'Fresh cottage cheese', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400'),
        ('Britannia Milk Bread', 45, 50, 95, '450 g', 'Soft milk bread', 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=400'),
        ('Modern Bread', 40, 45, 100, '400 g', 'White bread', 'https://images.unsplash.com/photo-1576621818543-b23c99c990aa?w=400'),
        ('Harvest Gold Bread', 42, 48, 90, '400 g', 'Whole wheat bread', 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400'),
        ('Amul Cheese Spread', 110, 125, 75, '200 g', 'Plain cheese spread', 'https://images.unsplash.com/photo-1571212515416-236ae5716750?w=400'),
        ('Kissan Jam', 90, 100, 120, '500 g', 'Mixed fruit jam', 'https://images.unsplash.com/photo-1629828874514-7fed1cd46eb7?w=400'),
        ('Nutralite Butter', 45, 50, 100, '100 g', 'Table spread', 'https://images.unsplash.com/photo-1587132117465-532f8e59f488?w=400'),
        ('Nestle Cerelac', 240, 270, 70, '300 g', 'Baby food', 'https://images.unsplash.com/photo-1599567171843-d6d070a2635f?w=400'),
        ('Pediasure', 850, 950, 40, '400 g', 'Nutrition drink', 'https://images.unsplash.com/photo-1601025192770-7009562d5930?w=400'),
        ('Kellogg\'s Chocos', 190, 220, 65, '375 g', 'Chocolate flakes', 'https://images.unsplash.com/photo-1626790680787-de5e9a07bcf2?w=400'),
        ('MTR Vermicelli', 35, 40, 150, '440 g', 'Roasted vermicelli', 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=400'),
        ('Britannia Brown Bread', 50, 55, 80, '400 g', 'Brown bread', 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400'),
        ('Amul Flavored Milk', 20, 22, 200, '200 ml', 'Chocolate milk', 'https://images.unsplash.com/photo-1551008048-17d089a709a6?w=400'),
        ('Yakult Probiotic', 10, 12, 300, '65 ml', 'Probiotic drink', 'https://images.unsplash.com/photo-1619566636777-35ad9f3c93c9?w=400'),
        ('Epigamia Greek Yogurt', 50, 60, 90, '90 g', 'Greek yogurt', 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400'),
        ('Amul Kool Lassi', 22, 25, 120, '200 ml', 'Buttermilk', 'https://images.unsplash.com/photo-1589375599354-92d5bdaf0a8b?w=400'),
        ('Mother Dairy Lassi', 20, 23, 130, '200 ml', 'Sweet lassi', 'https://images.unsplash.com/photo-1626534788840-a54ee6f8a0c5?w=400'),
        ('Nestle Milkmaid', 140, 160, 80, '380 g', 'Condensed milk', 'https://images.unsplash.com/photo-1576551809853-47c9073b3758?w=400'),
        ('Amul Cream', 80, 90, 70, '250 ml', 'Fresh cream', 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400'),
    ],
    
    'Beverages': [
        ('Coca Cola', 40, 45, 200, '750 ml', 'Classic cola', 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400'),
        ('Pepsi', 40, 45, 180, '750 ml', 'Pepsi cola', 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400'),
        ('Sprite', 38, 42, 190, '750 ml', 'Lemon soda', 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=400'),
        ('Fanta', 38, 42, 180, '750 ml', 'Orange drink', 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=400'),
        ('Thums Up', 40, 45, 170, '750 ml', 'Thunder cola', 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400'),
        ('Maaza', 45, 50, 160, '1.2 L', 'Mango drink', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400'),
        ('Frooti', 35, 40, 200, '1 L', 'Mango drink', 'https://images.unsplash.com/photo-1552345387-e4c31f5b0c66?w=400'),
        ('Slice', 45, 50, 150, '1.2 L', 'Mango drink', 'https://images.unsplash.com/photo-1595475038629-2d57f3fc824b?w=400'),
        ('Red Bull', 125, 150, 100, '250 ml', 'Energy drink', 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400'),
        ('Monster Energy', 130, 155, 95, '500 ml', 'Energy drink', 'https://images.unsplash.com/photo-1593886310284-54b896bc3c6f?w=400'),
        ('Real Juice', 60, 70, 120, '1 L', 'Mixed fruit juice', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400'),
        ('Tropicana', 120, 140, 100, '1 L', 'Orange juice', 'https://images.unsplash.com/photo-1600271772470-bd22a42787b3?w=400'),
        ('Paper Boat', 30, 35, 150, '250 ml', 'Aam Panna', 'https://images.unsplash.com/photo-1576773177-c08ae5c1bd92?w=400'),
        ('Rasna', 90, 110, 80, '500 g', 'Instant drink mix', 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400'),
        ('Tang', 95, 110, 85, '500 g', 'Orange powder', 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400'),
        ('Bisleri Water', 20, 22, 300, '1 L', 'Mineral water', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400'),
        ('Kinley Water', 18, 20, 320, '1 L', 'Packaged water', 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400'),
        ('Aquafina Water', 18, 20, 310, '1 L', 'Purified water', 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400'),
        ('Mountain Dew', 40, 45, 175, '750 ml', 'Citrus drink', 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=400'),
        ('7UP', 38, 42, 170, '750 ml', 'Lemon drink', 'https://images.unsplash.com/photo-1626897505687-8d1f0b120d5c?w=400'),
        ('Mirinda', 38, 42, 165, '750 ml', 'Orange soda', 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400'),
        ('Limca', 38, 42, 160, '750 ml', 'Lemon drink', 'https://images.unsplash.com/photo-1590424770853-f63b41a4fa01?w=400'),
        ('Minute Maid', 55, 65, 130, '1 L', 'Pulpy orange', 'https://images.unsplash.com/photo-1568864332193-8d2c4cd0bc46?w=400'),
        ('B Natural', 110, 130, 90, '1 L', 'Fruit juice', 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400'),
        ('Patanjali Aloe Vera', 40, 50, 100, '1 L', 'Aloe vera juice', 'https://images.unsplash.com/photo-1594631252829-c92085f95b30?w=400'),
        ('Appy Fizz', 40, 45, 140, '600 ml', 'Sparkling apple', 'https://images.unsplash.com/photo-1589475661912-d4cd6a4f4cf6?w=400'),
        ('Coke Zero', 42, 48, 130, '750 ml', 'Sugar free cola', 'https://images.unsplash.com/photo-1581006852260-a7fa03fafa23?w=400'),
        ('Diet Pepsi', 42, 48, 125, '750 ml', 'Diet cola', 'https://images.unsplash.com/photo-1622484211286-9306f0dc4afd?w=400'),
        ('Gatorade', 75, 90, 110, '750 ml', 'Sports drink', 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=400'),
        ('Electral', 35, 40, 150, '21.8 g', 'ORS powder', 'https://images.unsplash.com/photo-1622484210376-26ba05d69c8a?w=400'),
    ],
    
    'Snacks & Munchies': [
        ('Lays Classic', 20, 22, 200, '52 g', 'Salted chips', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400'),
        ('Kurkure Masala Munch', 20, 22, 190, '78 g', 'Masala snacks', 'https://images.unsplash.com/photo-1613919113640-25732ec5e61e?w=400'),
        ('Haldiram Namkeen', 40, 45, 150, '200 g', 'Indian snacks', 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400'),
        ('Pringles Original', 150, 170, 80, '110 g', 'Stackable chips', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400'),
        ('Bingo Mad Angles', 20, 22, 180, '72 g', 'Masala chips', 'https://images.unsplash.com/photo-1613919113640-25732ec5e61e?w=400'),
        ('Balaji Wafers', 10, 12, 250, '45 g', 'Potato chips', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400'),
        ('Bikaji Bhujia', 35, 40, 160, '200 g', 'Bhujia sev', 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400'),
        ('Act II Popcorn', 45, 50, 140, '70 g', 'Butter popcorn', 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400'),
        ('Yellow Diamond Chips', 20, 22, 170, '70 g', 'Tomato chips', 'https://images.unsplash.com/photo-1613919113640-25732ec5e61e?w=400'),
        ('Doritos Nacho', 30, 35, 130, '48 g', 'Nacho chips', 'https://images.unsplash.com/photo-1625869016774-3a92be2ae2cd?w=400'),
        ('Cheetos', 25, 28, 150, '55 g', 'Cheese puffs', 'https://images.unsplash.com/photo-1621939511071-e3f8e48f28cd?w=400'),
        ('Haldiram Sev', 30, 35, 160, '200 g', 'Plain sev', 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400'),
        ('Too Yumm Chips', 25, 28, 140, '60 g', 'Healthy chips', 'https://images.unsplash.com/photo-1613919113640-25732ec5e61e?w=400'),
        ('Cornitos Nachos', 35, 40, 110, '60 g', 'Corn chips', 'https://images.unsplash.com/photo-1597218181925-06a08b72f3c2?w=400'),
        ('Haldiram Aloo Bhujia', 35, 40, 150, '200 g', 'Potato sev', 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400'),
        ('Bikanervala Mixture', 45, 50, 130, '200 g', 'Mixed namkeen', 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400'),
        ('Britannia 50-50', 30, 35, 180, '150 g', 'Sweet & salty', 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400'),
        ('Parle-G', 10, 12, 300, '80 g', 'Glucose biscuits', 'https://images.unsplash.com/photo-1605555300643-8f4e0b021e06?w=400'),
        ('Sunfeast Dark Fantasy', 50, 60, 120, '150 g', 'Chocolate cookies', 'https://images.unsplash.com/photo-1588569645821-bf4e6d92e236?w=400'),
        ('Oreo', 35, 40, 160, '120 g', 'Cream biscuits', 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400'),
        ('Hide & Seek', 35, 40, 150, '120 g', 'Choco chip cookies', 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400'),
        ('Monaco', 20, 22, 200, '75 g', 'Salted biscuits', 'https://images.unsplash.com/photo-1605555300643-8f4e0b021e06?w=400'),
        ('Good Day', 35, 40, 170, '150 g', 'Butter cookies', 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400'),
        ('Bourbon', 30, 35, 180, '120 g', 'Chocolate cream', 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400'),
        ('Marie Gold', 25, 30, 200, '120 g', 'Tea biscuits', 'https://images.unsplash.com/photo-1605555300643-8f4e0b021e06?w=400'),
        ('Krackjack', 10, 12, 250, '70 g', 'Sweet & salted', 'https://images.unsplash.com/photo-1605555300643-8f4e0b021e06?w=400'),
        ('Tiger', 10, 12, 240, '80 g', 'Glucose biscuits', 'https://images.unsplash.com/photo-1605555300643-8f4e0b021e06?w=400'),
        ('Treat', 35, 40, 160, '120 g', 'Cream biscuits', 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400'),
        ('Unibic Cookies', 60, 70, 100, '150 g', 'Premium cookies', 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400'),
        ('Karachi Bakery', 180, 200, 60, '200 g', 'Fruit biscuits', 'https://images.unsplash.com/photo-1605555300643-8f4e0b021e06?w=400'),
    ],
}

print("=" * 60)
print("POPULATING MORE CATEGORIES")
print("=" * 60)

# Get category IDs
cur.execute("SELECT id, name FROM categories WHERE name IN ('Dairy & Breakfast', 'Beverages', 'Snacks & Munchies')")
categories = {row['name']: row['id'] for row in cur.fetchall()}

total_added = 0

for category_name, products in products_data.items():
    if category_name not in categories:
        print(f"\n⚠️  Category '{category_name}' not found, skipping...")
        continue
    
    category_id = categories[category_name]
    print(f"\n📦 Adding products to '{category_name}' (ID: {category_id})")
    
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
print(f"✅ SUCCESSFULLY ADDED {total_added} MORE PRODUCTS!")
print("=" * 60)
