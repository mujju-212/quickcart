import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

conn = psycopg2.connect('postgresql://postgres:mk0492@localhost:5432/blink_basket')
cur = conn.cursor(cursor_factory=RealDictCursor)

# Comprehensive products data for ALL categories - 30 products each with minimum 20 stock
products_data = {
    'Atta, Rice & Dal': [
        ('Aashirvaad Atta', 240, 260, 150, '5 kg', 'Whole wheat flour', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'),
        ('India Gate Basmati Rice', 550, 600, 100, '5 kg', 'Premium basmati rice', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'),
        ('Toor Dal', 120, 140, 120, '1 kg', 'Pigeon peas lentils', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400'),
        ('Moong Dal', 110, 130, 130, '1 kg', 'Green gram lentils', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400'),
        ('Masoor Dal', 100, 120, 140, '1 kg', 'Red lentils', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400'),
        ('Chana Dal', 90, 110, 120, '1 kg', 'Bengal gram lentils', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400'),
        ('Urad Dal', 130, 150, 100, '1 kg', 'Black gram lentils', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400'),
        ('Pillsbury Chakki Atta', 220, 250, 110, '5 kg', 'Fresh chakki atta', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'),
        ('Fortune Atta', 235, 265, 95, '5 kg', 'Multigrade atta', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'),
        ('Daawat Basmati Rice', 480, 520, 85, '5 kg', 'Traditional basmati', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'),
        ('Kohinoor Basmati Rice', 600, 650, 75, '5 kg', 'Super basmati', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'),
        ('Sona Masoori Rice', 280, 320, 120, '5 kg', 'Medium grain rice', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'),
        ('Brown Rice', 180, 210, 90, '1 kg', 'Healthy brown rice', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'),
        ('Rajma', 140, 160, 110, '1 kg', 'Red kidney beans', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400'),
        ('Kabuli Chana', 120, 140, 100, '1 kg', 'White chickpeas', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400'),
        ('Black Chana', 100, 120, 95, '1 kg', 'Black chickpeas', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400'),
        ('Lobiya', 90, 110, 85, '500 g', 'Black eyed beans', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400'),
        ('Soyabean', 80, 100, 90, '1 kg', 'Soya beans', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400'),
        ('Poha', 45, 55, 150, '500 g', 'Flattened rice', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'),
        ('Sabudana', 60, 75, 130, '500 g', 'Tapioca pearls', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400'),
        ('Besan', 70, 85, 120, '1 kg', 'Gram flour', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'),
        ('Suji/Rawa', 40, 50, 140, '500 g', 'Semolina', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'),
        ('Maida', 35, 45, 135, '1 kg', 'All purpose flour', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'),
        ('Sooji', 38, 48, 125, '500 g', 'Fine semolina', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'),
        ('Dalia', 55, 70, 100, '500 g', 'Broken wheat', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'),
        ('Puffed Rice', 30, 40, 160, '200 g', 'Murmura', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'),
        ('Beaten Rice', 35, 45, 145, '500 g', 'Chiwda poha', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'),
        ('Arhar Dal', 115, 135, 105, '1 kg', 'Split pigeon peas', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400'),
        ('Mixed Dal', 95, 115, 110, '500 g', 'Five dal mix', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400'),
        ('Vermicelli', 35, 45, 155, '400 g', 'Seviyan', 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=400'),
    ],
    
    'Masala, Oil & More': [
        ('Fortune Sunflower Oil', 180, 200, 100, '1 L', 'Refined sunflower oil', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400'),
        ('Everest Garam Masala', 40, 50, 150, '50 g', 'Blended spice mix', 'https://images.unsplash.com/photo-1596040033229-a0b3b6087c8e?w=400'),
        ('MDH Chana Masala', 35, 45, 140, '100 g', 'Chickpea masala', 'https://images.unsplash.com/photo-1596040033229-a0b3b6087c8e?w=400'),
        ('Catch Turmeric Powder', 30, 40, 160, '100 g', 'Pure turmeric', 'https://images.unsplash.com/photo-1615485500834-bc10199bc6c4?w=400'),
        ('Red Chilli Powder', 45, 55, 145, '200 g', 'Hot red chilli', 'https://images.unsplash.com/photo-1596040033229-a0b3b6087c8e?w=400'),
        ('Coriander Powder', 35, 45, 150, '100 g', 'Ground coriander', 'https://images.unsplash.com/photo-1596040033229-a0b3b6087c8e?w=400'),
        ('Cumin Seeds', 80, 95, 120, '100 g', 'Whole jeera', 'https://images.unsplash.com/photo-1596040033229-a0b3b6087c8e?w=400'),
        ('Mustard Seeds', 40, 50, 130, '100 g', 'Black mustard seeds', 'https://images.unsplash.com/photo-1596040033229-a0b3b6087c8e?w=400'),
        ('Saffola Gold Oil', 250, 280, 80, '1 L', 'Blended oil', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400'),
        ('Dalda Vanaspati', 120, 140, 95, '1 kg', 'Cooking fat', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400'),
        ('Parachute Coconut Oil', 180, 210, 110, '1 L', 'Pure coconut oil', 'https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=400'),
        ('Tata Salt', 20, 25, 200, '1 kg', 'Iodized salt', 'https://images.unsplash.com/photo-1608256543730-6a21e6e6ef7e?w=400'),
        ('Black Pepper', 120, 140, 90, '100 g', 'Whole black pepper', 'https://images.unsplash.com/photo-1596040033229-a0b3b6087c8e?w=400'),
        ('Bay Leaves', 35, 45, 125, '10 g', 'Tej patta', 'https://images.unsplash.com/photo-1596040033229-a0b3b6087c8e?w=400'),
        ('Cardamom', 180, 210, 70, '50 g', 'Green cardamom', 'https://images.unsplash.com/photo-1596040033229-a0b3b6087c8e?w=400'),
        ('Cloves', 90, 110, 85, '50 g', 'Whole cloves', 'https://images.unsplash.com/photo-1596040033229-a0b3b6087c8e?w=400'),
        ('Cinnamon', 60, 75, 100, '50 g', 'Cinnamon sticks', 'https://images.unsplash.com/photo-1596040033229-a0b3b6087c8e?w=400'),
        ('Fennel Seeds', 50, 65, 110, '100 g', 'Saunf', 'https://images.unsplash.com/photo-1596040033229-a0b3b6087c8e?w=400'),
        ('Fenugreek Seeds', 35, 45, 115, '100 g', 'Methi seeds', 'https://images.unsplash.com/photo-1596040033229-a0b3b6087c8e?w=400'),
        ('Asafoetida', 45, 60, 95, '50 g', 'Hing powder', 'https://images.unsplash.com/photo-1596040033229-a0b3b6087c8e?w=400'),
        ('Vinegar', 30, 40, 140, '500 ml', 'White vinegar', 'https://images.unsplash.com/photo-1585968348329-33c13f9ff446?w=400'),
        ('Soy Sauce', 80, 95, 105, '200 ml', 'Dark soy sauce', 'https://images.unsplash.com/photo-1617343267444-e32c8e5c6e05?w=400'),
        ('Tomato Ketchup', 90, 110, 120, '500 g', 'Tomato sauce', 'https://images.unsplash.com/photo-1598914639184-4e4d3d318ea8?w=400'),
        ('Chilli Sauce', 70, 85, 115, '200 g', 'Red chilli sauce', 'https://images.unsplash.com/photo-1617343268204-32241e5e2065?w=400'),
        ('Sesame Oil', 150, 180, 75, '500 ml', 'Cold pressed sesame', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400'),
        ('Olive Oil', 450, 500, 60, '500 ml', 'Extra virgin olive oil', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400'),
        ('Rice Bran Oil', 160, 190, 85, '1 L', 'Healthy rice bran oil', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400'),
        ('Dry Mango Powder', 40, 50, 130, '100 g', 'Amchur powder', 'https://images.unsplash.com/photo-1596040033229-a0b3b6087c8e?w=400'),
        ('Chat Masala', 30, 40, 145, '50 g', 'Tangy chat masala', 'https://images.unsplash.com/photo-1596040033229-a0b3b6087c8e?w=400'),
        ('Kitchen King Masala', 45, 55, 125, '100 g', 'Vegetable masala', 'https://images.unsplash.com/photo-1596040033229-a0b3b6087c8e?w=400'),
    ],
    
    'Tea, Coffee & Health Drink': [
        ('Tata Tea Gold', 280, 310, 120, '1 kg', 'Premium tea leaves', 'https://images.unsplash.com/photo-1597318167374-45db9e05eeef?w=400'),
        ('Brooke Bond Red Label', 250, 280, 130, '1 kg', 'Strong tea', 'https://images.unsplash.com/photo-1597318167374-45db9e05eeef?w=400'),
        ('Nescafe Classic Coffee', 280, 320, 100, '200 g', 'Instant coffee', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'),
        ('Bru Instant Coffee', 260, 290, 110, '200 g', 'Pure coffee', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'),
        ('Green Tea', 180, 210, 90, '100 bags', 'Organic green tea', 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400'),
        ('Lipton Yellow Label', 240, 270, 115, '1 kg', 'Classic tea', 'https://images.unsplash.com/photo-1597318167374-45db9e05eeef?w=400'),
        ('Taj Mahal Tea', 270, 300, 105, '1 kg', 'Rich tea blend', 'https://images.unsplash.com/photo-1597318167374-45db9e05eeef?w=400'),
        ('Society Tea', 230, 260, 125, '1 kg', 'Premium blend', 'https://images.unsplash.com/photo-1597318167374-45db9e05eeef?w=400'),
        ('Horlicks', 340, 380, 85, '500 g', 'Health drink', 'https://images.unsplash.com/photo-1625869016774-3a92be2ae2cd?w=400'),
        ('Bournvita', 320, 360, 95, '500 g', 'Chocolate health drink', 'https://images.unsplash.com/photo-1625869016774-3a92be2ae2cd?w=400'),
        ('Complan', 380, 420, 75, '500 g', 'Nutrition drink', 'https://images.unsplash.com/photo-1625869016774-3a92be2ae2cd?w=400'),
        ('Boost', 330, 370, 90, '500 g', 'Energy drink powder', 'https://images.unsplash.com/photo-1625869016774-3a92be2ae2cd?w=400'),
        ('Organic India Tulsi Tea', 220, 250, 70, '100 g', 'Herbal tulsi tea', 'https://images.unsplash.com/photo-1597318167374-45db9e05eeef?w=400'),
        ('Chamomile Tea', 280, 320, 65, '50 bags', 'Relaxing herbal tea', 'https://images.unsplash.com/photo-1597318167374-45db9e05eeef?w=400'),
        ('Earl Grey Tea', 300, 340, 60, '100 g', 'Bergamot tea', 'https://images.unsplash.com/photo-1597318167374-45db9e05eeef?w=400'),
        ('Oolong Tea', 350, 390, 55, '100 g', 'Weight loss tea', 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400'),
        ('Masala Chai', 260, 290, 100, '500 g', 'Spiced tea mix', 'https://images.unsplash.com/photo-1597318167374-45db9e05eeef?w=400'),
        ('Ginger Tea', 190, 220, 95, '200 g', 'Ginger flavored tea', 'https://images.unsplash.com/photo-1597318167374-45db9e05eeef?w=400'),
        ('Lemon Tea', 200, 230, 90, '200 g', 'Lemon flavored tea', 'https://images.unsplash.com/photo-1597318167374-45db9e05eeef?w=400'),
        ('Davidoff Coffee', 580, 640, 45, '200 g', 'Premium coffee', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'),
        ('Lavazza Coffee', 620, 680, 40, '200 g', 'Italian coffee', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'),
        ('Blue Tokai Coffee', 450, 500, 50, '250 g', 'Artisan coffee', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'),
        ('Continental Coffee', 240, 280, 85, '200 g', 'Filter coffee', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'),
        ('Protinex', 480, 530, 60, '400 g', 'Protein supplement', 'https://images.unsplash.com/photo-1625869016774-3a92be2ae2cd?w=400'),
        ('Ensure', 650, 720, 45, '400 g', 'Complete nutrition', 'https://images.unsplash.com/photo-1625869016774-3a92be2ae2cd?w=400'),
        ('Milo', 290, 330, 80, '400 g', 'Chocolate malt drink', 'https://images.unsplash.com/photo-1625869016774-3a92be2ae2cd?w=400'),
        ('Matcha Green Tea', 550, 600, 35, '100 g', 'Japanese matcha', 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400'),
        ('Peppermint Tea', 240, 280, 70, '50 bags', 'Cooling herbal tea', 'https://images.unsplash.com/photo-1597318167374-45db9e05eeef?w=400'),
        ('Jasmine Tea', 320, 360, 55, '100 g', 'Floral green tea', 'https://images.unsplash.com/photo-1597318167374-45db9e05eeef?w=400'),
        ('Herbal Tea Mix', 280, 320, 65, '100 bags', 'Mixed herbs tea', 'https://images.unsplash.com/photo-1597318167374-45db9e05eeef?w=400'),
    ],
}

print("=" * 70)
print("ADDING 30 PRODUCTS TO EMPTY CATEGORIES")
print("=" * 70)

# Get category IDs
cur.execute("SELECT id, name FROM categories WHERE name IN ('Atta, Rice & Dal', 'Masala, Oil & More', 'Tea, Coffee & Health Drink')")
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
            print(f"   ✅ Added: {name} (Stock: {stock})")
        except Exception as e:
            print(f"   ❌ Error adding {name}: {e}")
    
    print(f"   → Added {added_count} new products to {category_name}")

conn.commit()
cur.close()
conn.close()

print("\n" + "=" * 70)
print(f"✅ SUCCESSFULLY ADDED {total_added} PRODUCTS!")
print("=" * 70)
