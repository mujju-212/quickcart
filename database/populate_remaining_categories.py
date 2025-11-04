import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

conn = psycopg2.connect('postgresql://postgres:mk0492@localhost:5432/blink_basket')
cur = conn.cursor(cursor_factory=RealDictCursor)

# Complete products data for remaining empty categories - 30 products each
products_data = {
    'Baby Care': [
        ('Pampers Baby Diapers', 999, 1099, 50, 'L Size 68 pcs', 'Soft baby diapers', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400'),
        ('Huggies Diapers', 950, 1050, 55, 'M Size 72 pcs', 'Comfortable diapers', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400'),
        ('MamyPoko Pants', 899, 999, 60, 'XL Size 48 pcs', 'Pant style diapers', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400'),
        ('Johnson Baby Soap', 65, 75, 150, '125 g', 'Gentle baby soap', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400'),
        ('Johnson Baby Shampoo', 180, 210, 120, '200 ml', 'No tears formula', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400'),
        ('Johnson Baby Oil', 195, 230, 110, '200 ml', 'Moisturizing oil', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400'),
        ('Johnson Baby Powder', 140, 170, 130, '200 g', 'Cooling powder', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400'),
        ('Himalaya Baby Cream', 85, 105, 140, '100 g', 'Nourishing cream', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400'),
        ('Chicco Baby Wipes', 180, 210, 100, '72 wipes', 'Gentle cleansing', 'https://images.unsplash.com/photo-1584003527935-0b43a0db3fa0?w=400'),
        ('Mee Mee Baby Wipes', 150, 180, 110, '80 wipes', 'Soft wet wipes', 'https://images.unsplash.com/photo-1584003527935-0b43a0db3fa0?w=400'),
        ('Pigeon Baby Lotion', 220, 260, 90, '200 ml', 'Hydrating lotion', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400'),
        ('Sebamed Baby Cream', 350, 400, 70, '200 ml', 'pH balanced cream', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400'),
        ('Cerelac Wheat', 235, 275, 80, '300 g', 'Baby food cereal', 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400'),
        ('Cerelac Rice', 225, 265, 85, '300 g', 'Rice cereal', 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400'),
        ('Nestum 5 Grains', 275, 320, 65, '300 g', 'Multi grain cereal', 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400'),
        ('Farex Baby Food', 245, 285, 75, '300 g', 'Nutritious food', 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400'),
        ('Huggies Baby Wipes', 200, 240, 95, '80 wipes', 'Extra soft wipes', 'https://images.unsplash.com/photo-1584003527935-0b43a0db3fa0?w=400'),
        ('Pampers Baby Wipes', 190, 230, 100, '72 wipes', 'Gentle wipes', 'https://images.unsplash.com/photo-1584003527935-0b43a0db3fa0?w=400'),
        ('Chicco Bottle', 280, 330, 60, '250 ml', 'BPA free bottle', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400'),
        ('Pigeon Bottle', 240, 290, 70, '240 ml', 'Feeding bottle', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400'),
        ('Mee Mee Feeding Set', 320, 380, 55, '5 pieces', 'Complete set', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400'),
        ('Baby Thermometer', 180, 220, 85, '1 pc', 'Digital thermometer', 'https://images.unsplash.com/photo-1584555684040-bad07c57723e?w=400'),
        ('Baby Nail Cutter', 95, 120, 120, '1 pc', 'Safe nail clipper', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400'),
        ('Baby Hair Brush', 110, 140, 100, '1 pc', 'Soft bristle brush', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400'),
        ('Baby Toothbrush', 85, 110, 130, '1 pc', 'Gentle toothbrush', 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400'),
        ('Baby Toothpaste', 95, 125, 125, '50 g', 'Fluoride free paste', 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400'),
        ('Baby Laundry Detergent', 280, 330, 75, '1 L', 'Gentle detergent', 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400'),
        ('Baby Fabric Softener', 240, 290, 80, '1 L', 'Soft on clothes', 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400'),
        ('Baby Mosquito Repellent', 150, 190, 95, '100 ml', 'Safe repellent', 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=400'),
        ('Baby Sunscreen', 380, 450, 65, '100 ml', 'SPF 50+ protection', 'https://images.unsplash.com/photo-1556228994-3a6b7b7345a2?w=400'),
    ],
    
    'Cleaning & Household': [
        ('Vim Bar', 10, 15, 200, '200 g', 'Dishwash bar', 'https://images.unsplash.com/photo-1585933646032-9a3b4a696897?w=400'),
        ('Vim Liquid', 95, 115, 150, '500 ml', 'Dishwash liquid', 'https://images.unsplash.com/photo-1585933646032-9a3b4a696897?w=400'),
        ('Pril Dishwash Liquid', 120, 145, 130, '500 ml', 'Lemon dishwash', 'https://images.unsplash.com/photo-1585933646032-9a3b4a696897?w=400'),
        ('Harpic Toilet Cleaner', 110, 135, 140, '500 ml', 'Power cleaner', 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400'),
        ('Domex Toilet Cleaner', 95, 120, 145, '500 ml', 'Disinfectant cleaner', 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400'),
        ('Lizol Floor Cleaner', 140, 170, 120, '975 ml', 'Citrus floor cleaner', 'https://images.unsplash.com/photo-1585933646032-9a3b4a696897?w=400'),
        ('Colin Glass Cleaner', 85, 110, 155, '500 ml', 'Streak free shine', 'https://images.unsplash.com/photo-1585933646032-9a3b4a696897?w=400'),
        ('Scotch Brite Scrub Pad', 40, 50, 200, '3 pcs', 'Kitchen scrubber', 'https://images.unsplash.com/photo-1585933646032-9a3b4a696897?w=400'),
        ('Cif Cream', 95, 120, 135, '500 ml', 'Kitchen cleaner', 'https://images.unsplash.com/photo-1585933646032-9a3b4a696897?w=400'),
        ('Surf Excel Detergent', 280, 330, 100, '2 kg', 'Washing powder', 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400'),
        ('Tide Detergent', 270, 320, 105, '2 kg', 'Stain remover', 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400'),
        ('Ariel Detergent', 285, 335, 95, '2 kg', 'Deep cleaning', 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400'),
        ('Comfort Fabric Conditioner', 180, 220, 110, '800 ml', 'Softens clothes', 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400'),
        ('Ujala Fabric Whitener', 45, 60, 160, '500 ml', 'Brightens whites', 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400'),
        ('Vanish Stain Remover', 195, 240, 90, '400 g', 'Removes tough stains', 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400'),
        ('Odonil Room Freshener', 75, 95, 140, '75 g', 'Air freshener', 'https://images.unsplash.com/photo-1585933646032-9a3b4a696897?w=400'),
        ('Ambipur Air Freshener', 250, 300, 85, '275 ml', 'Room spray', 'https://images.unsplash.com/photo-1585933646032-9a3b4a696897?w=400'),
        ('Hit Spray', 120, 150, 125, '400 ml', 'Mosquito spray', 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=400'),
        ('Mortein Coil', 60, 75, 170, '10 coils', 'Mosquito coil', 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=400'),
        ('All Out Liquid', 85, 105, 145, '45 ml refill', 'Mosquito repellent', 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=400'),
        ('Good Knight Refill', 80, 100, 150, '45 ml', 'Liquid refill', 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=400'),
        ('Naphthalene Balls', 30, 40, 180, '100 g', 'Wardrobe freshener', 'https://images.unsplash.com/photo-1585933646032-9a3b4a696897?w=400'),
        ('Cotton Mop', 180, 230, 75, '1 pc', 'Floor mop', 'https://images.unsplash.com/photo-1585933646032-9a3b4a696897?w=400'),
        ('Plastic Bucket', 150, 190, 90, '18 L', 'Storage bucket', 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=400'),
        ('Garbage Bags', 95, 120, 130, '30 pcs', 'Large trash bags', 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400'),
        ('Plastic Dustpan', 65, 85, 155, '1 pc', 'Cleaning dustpan', 'https://images.unsplash.com/photo-1585933646032-9a3b4a696897?w=400'),
        ('Broom Stick', 85, 110, 140, '1 pc', 'Floor broom', 'https://images.unsplash.com/photo-1585933646032-9a3b4a696897?w=400'),
        ('Kitchen Towel', 120, 150, 110, '4 rolls', 'Paper towels', 'https://images.unsplash.com/photo-1585933646032-9a3b4a696897?w=400'),
        ('Rubber Gloves', 75, 95, 160, '1 pair', 'Cleaning gloves', 'https://images.unsplash.com/photo-1585933646032-9a3b4a696897?w=400'),
        ('Duster Cloth', 40, 55, 190, '3 pcs', 'Microfiber cloth', 'https://images.unsplash.com/photo-1585933646032-9a3b4a696897?w=400'),
    ],
    
    'Home Care': [
        ('LED Bulb 9W', 120, 150, 100, '1 pc', 'Energy saving bulb', 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=400'),
        ('LED Tube Light', 280, 330, 70, '20W', 'Cool white light', 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=400'),
        ('Extension Cord', 350, 420, 60, '5 meter', '4 socket extension', 'https://images.unsplash.com/photo-1591290619762-35ba0eeea7a5?w=400'),
        ('Power Strip', 450, 520, 55, '6 socket', 'Surge protector', 'https://images.unsplash.com/photo-1591290619762-35ba0eeea7a5?w=400'),
        ('Ceiling Fan', 2200, 2500, 30, '1200mm', '3 blade fan', 'https://images.unsplash.com/photo-1621331978602-10ed5d969a3e?w=400'),
        ('Table Fan', 1200, 1400, 40, '400mm', 'High speed fan', 'https://images.unsplash.com/photo-1621331978602-10ed5d969a3e?w=400'),
        ('Exhaust Fan', 850, 1000, 45, '150mm', 'Ventilation fan', 'https://images.unsplash.com/photo-1621331978602-10ed5d969a3e?w=400'),
        ('Door Mat', 280, 350, 75, '60x40 cm', 'Anti-slip mat', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400'),
        ('Bathroom Mat', 320, 390, 65, '50x80 cm', 'Absorbent mat', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400'),
        ('Curtain Rod', 480, 580, 50, '7 feet', 'Adjustable rod', 'https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9?w=400'),
        ('Window Curtain', 680, 820, 45, '7x4 feet', 'Polyester curtain', 'https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9?w=400'),
        ('Door Curtain', 520, 640, 55, '7x3.5 feet', 'Cotton curtain', 'https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9?w=400'),
        ('Mosquito Net', 450, 550, 60, 'Double bed', 'Foldable net', 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=400'),
        ('Bed Sheet', 680, 820, 70, 'Double bed', 'Cotton bed sheet', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400'),
        ('Pillow Cover', 180, 230, 120, '2 pcs', 'Soft pillow cover', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400'),
        ('Pillow', 380, 460, 80, '1 pc', 'Soft fiber pillow', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400'),
        ('Blanket', 850, 1020, 50, 'Double bed', 'Warm blanket', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400'),
        ('Comforter', 1580, 1890, 35, 'Double bed', 'Quilted comforter', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400'),
        ('Bath Towel', 380, 460, 90, '70x140 cm', 'Cotton towel', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'),
        ('Hand Towel', 180, 230, 130, '40x60 cm', 'Soft hand towel', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'),
        ('Face Towel', 95, 125, 160, '30x30 cm', 'Small towel', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'),
        ('Bathrobe', 680, 820, 55, 'Free size', 'Cotton bathrobe', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'),
        ('Shower Curtain', 380, 470, 75, '6x7 feet', 'Waterproof curtain', 'https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9?w=400'),
        ('Coat Hanger', 280, 350, 85, '6 hooks', 'Wall mounted hanger', 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400'),
        ('Storage Box', 420, 520, 65, '25 L', 'Plastic storage', 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=400'),
        ('Laundry Basket', 350, 440, 70, '40 L', 'Plastic basket', 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=400'),
        ('Cloth Drying Stand', 850, 1050, 40, 'Foldable', 'Steel stand', 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=400'),
        ('Hangers', 120, 160, 150, '12 pcs', 'Plastic hangers', 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400'),
        ('Shoe Rack', 680, 850, 50, '4 tiers', 'Metal shoe rack', 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400'),
        ('Wall Clock', 380, 480, 75, '12 inch', 'Analog clock', 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400'),
    ],
    
    'Instant & Frozen Food': [
        ('Maggi Noodles', 12, 15, 250, '70 g', '2 minute noodles', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400'),
        ('Yippee Noodles', 10, 13, 280, '70 g', 'Instant noodles', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400'),
        ('Top Ramen', 11, 14, 270, '70 g', 'Curry noodles', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400'),
        ('Knorr Soup', 28, 35, 200, '12 g sachet', 'Instant soup', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400'),
        ('Maggi Pasta', 35, 45, 180, '70 g', 'Instant pasta', 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400'),
        ('McCain Fries', 120, 150, 90, '420 g', 'Frozen french fries', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400'),
        ('McCain Potato Nuggets', 140, 170, 85, '400 g', 'Crispy nuggets', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400'),
        ('Sumeru Momos', 180, 220, 70, '400 g', 'Veg momos', 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400'),
        ('Prasuma Chicken Momos', 240, 290, 60, '400 g', 'Chicken momos', 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400'),
        ('McCain Pizza Pockets', 195, 240, 75, '360 g', 'Frozen pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'),
        ('Venky Chicken Nuggets', 280, 340, 55, '400 g', 'Breaded nuggets', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400'),
        ('Venky Chicken Popcorn', 260, 320, 60, '400 g', 'Crispy popcorn', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400'),
        ('Prasuma Chicken Salami', 180, 230, 70, '200 g', 'Sliced salami', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400'),
        ('Sumeru Sweet Corn', 95, 120, 100, '400 g', 'Frozen corn', 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400'),
        ('McCain Mixed Vegetables', 110, 140, 95, '500 g', 'Frozen veggies', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400'),
        ('ITC Aashirvaad Paratha', 140, 175, 80, '5 pcs', 'Ready to cook', 'https://images.unsplash.com/photo-1619362280286-8931c2fd0f55?w=400'),
        ('Godrej Yummiez Samosa', 120, 150, 85, '400 g', 'Frozen samosa', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'),
        ('MTR Masala Dosa Mix', 55, 70, 140, '500 g', 'Instant dosa mix', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400'),
        ('MTR Idli Mix', 50, 65, 150, '500 g', 'Instant idli mix', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400'),
        ('Gits Dhokla Mix', 48, 62, 155, '200 g', 'Instant dhokla', 'https://images.unsplash.com/photo-1606491048063-babd90748b2f?w=400'),
        ('Gits Gulab Jamun Mix', 62, 78, 130, '200 g', 'Instant sweet mix', 'https://images.unsplash.com/photo-1588326262086-8b3f67625eb2?w=400'),
        ('MTR Poha', 40, 52, 160, '200 g', 'Ready to eat poha', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'),
        ('MTR Upma', 38, 50, 165, '200 g', 'Ready to eat upma', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'),
        ('Haldiram Samosa', 145, 180, 75, '400 g', 'Frozen samosa', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'),
        ('Haldiram Kachori', 135, 170, 80, '400 g', 'Frozen kachori', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'),
        ('Nissin Cup Noodles', 55, 70, 120, '70 g', 'Cup noodles', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400'),
        ('Wai Wai Noodles', 10, 13, 260, '75 g', 'Instant noodles', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400'),
        ('Indomie Noodles', 15, 20, 220, '80 g', 'Indonesian noodles', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400'),
        ('Cornetto Ice Cream', 60, 75, 100, '1 pc', 'Cone ice cream', 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400'),
        ('Amul Ice Cream', 180, 225, 70, '500 ml', 'Vanilla ice cream', 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400'),
    ],
    
    'Personal Care': [
        ('Dettol Soap', 38, 45, 200, '125 g', 'Antibacterial soap', 'https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?w=400'),
        ('Dove Soap', 58, 70, 180, '125 g', 'Moisturizing soap', 'https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?w=400'),
        ('Lux Soap', 32, 40, 210, '125 g', 'Beauty soap', 'https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?w=400'),
        ('Lifebuoy Soap', 30, 38, 220, '125 g', 'Total protection', 'https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?w=400'),
        ('Pears Soap', 48, 60, 190, '125 g', 'Transparent soap', 'https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?w=400'),
        ('Colgate Toothpaste', 85, 105, 160, '200 g', 'Cavity protection', 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400'),
        ('Close Up Toothpaste', 80, 100, 165, '200 g', 'Fresh breath', 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400'),
        ('Sensodyne Toothpaste', 195, 240, 120, '150 g', 'Sensitive teeth', 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400'),
        ('Colgate Toothbrush', 45, 60, 190, '1 pc', 'Soft bristles', 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400'),
        ('Oral-B Toothbrush', 95, 120, 140, '1 pc', 'Medium bristles', 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400'),
        ('Listerine Mouthwash', 180, 225, 110, '250 ml', 'Cool mint', 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400'),
        ('Pantene Shampoo', 195, 240, 120, '340 ml', 'Hair fall control', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400'),
        ('Head & Shoulders', 280, 340, 95, '340 ml', 'Anti-dandruff', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400'),
        ('Dove Shampoo', 240, 295, 105, '340 ml', 'Damage repair', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400'),
        ('Sunsilk Shampoo', 180, 225, 130, '340 ml', 'Smooth & shine', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400'),
        ('Clinic Plus Shampoo', 140, 180, 145, '340 ml', 'Strong & long', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400'),
        ('Parachute Oil', 95, 120, 155, '200 ml', 'Coconut oil', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400'),
        ('Bajaj Almond Oil', 110, 140, 140, '200 ml', 'Hair oil', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400'),
        ('Gillette Razor', 180, 230, 100, '1 pc', 'Disposable razor', 'https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?w=400'),
        ('Gillette Shaving Cream', 140, 180, 115, '195 g', 'Classic cream', 'https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?w=400'),
        ('Old Spice Deo', 240, 295, 90, '150 ml', 'Body spray', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400'),
        ('Axe Deo', 260, 320, 85, '150 ml', 'Long lasting', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400'),
        ('Fogg Deo', 195, 245, 100, '150 ml', 'No gas deo', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400'),
        ('Nivea Body Lotion', 280, 340, 80, '400 ml', 'Moisturizing', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400'),
        ('Vaseline Lotion', 240, 295, 90, '400 ml', 'Healthy white', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400'),
        ('Fair & Lovely Cream', 110, 140, 125, '50 g', 'Fairness cream', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400'),
        ('Lakme Compact', 295, 360, 70, '9 g', 'Face powder', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400'),
        ('Maybelline Lipstick', 380, 450, 60, '3.9 g', 'Matte lipstick', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400'),
        ('Lakme Kajal', 195, 245, 95, '0.35 g', 'Black kajal', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400'),
        ('Nivea Sunscreen', 380, 460, 65, '100 ml', 'SPF 50 protection', 'https://images.unsplash.com/photo-1556228994-3a6b7b7345a2?w=400'),
    ],
    
    'Pet Care': [
        ('Pedigree Dog Food', 380, 450, 80, '1.2 kg', 'Adult dog food', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'),
        ('Drools Dog Food', 420, 495, 70, '1.2 kg', 'Chicken & egg', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'),
        ('Whiskas Cat Food', 280, 340, 90, '1 kg', 'Tuna flavor', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'),
        ('Meo Cat Food', 240, 295, 95, '1 kg', 'Persian cat food', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'),
        ('Pedigree Puppy Food', 420, 495, 65, '1.2 kg', 'Puppy nutrition', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'),
        ('Drools Puppy Food', 450, 530, 60, '1.2 kg', 'Chicken puppy food', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'),
        ('Whiskas Kitten Food', 320, 385, 75, '1 kg', 'Kitten nutrition', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'),
        ('Pedigree Gravy', 45, 55, 180, '80 g pouch', 'Chicken chunks', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'),
        ('Whiskas Gravy', 40, 50, 190, '85 g pouch', 'Fish chunks', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'),
        ('Dog Shampoo', 280, 340, 85, '200 ml', 'Anti-tick shampoo', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400'),
        ('Cat Shampoo', 260, 320, 90, '200 ml', 'Gentle shampoo', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400'),
        ('Pet Brush', 180, 230, 110, '1 pc', 'Grooming brush', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'),
        ('Pet Nail Clipper', 195, 250, 100, '1 pc', 'Safe nail cutter', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'),
        ('Dog Collar', 240, 295, 95, 'Medium size', 'Adjustable collar', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'),
        ('Dog Leash', 280, 340, 85, '1.2 meter', 'Strong leash', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'),
        ('Cat Litter', 420, 495, 70, '5 kg', 'Clumping litter', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'),
        ('Pet Bowl', 180, 230, 115, '2 bowls', 'Steel bowls', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'),
        ('Dog Treats', 195, 245, 105, '500 g', 'Chicken treats', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'),
        ('Cat Treats', 180, 230, 110, '300 g', 'Fish treats', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'),
        ('Pet Toy Ball', 120, 155, 140, '1 pc', 'Rubber ball', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'),
        ('Pet Chew Toy', 195, 250, 100, '1 pc', 'Dental chew', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'),
        ('Pet Bed', 680, 820, 50, 'Medium size', 'Soft pet bed', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'),
        ('Pet Carrier', 850, 1020, 40, 'Small size', 'Travel carrier', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'),
        ('Flea & Tick Spray', 280, 340, 85, '100 ml', 'Pet protection', 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=400'),
        ('Pet Wipes', 195, 245, 105, '80 wipes', 'Cleaning wipes', 'https://images.unsplash.com/photo-1584003527935-0b43a0db3fa0?w=400'),
        ('Pet Ear Cleaner', 180, 230, 110, '100 ml', 'Ear cleaning solution', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'),
        ('Pet Dental Spray', 240, 295, 95, '100 ml', 'Oral hygiene', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'),
        ('Pet Vitamin Supplements', 380, 460, 70, '100 tablets', 'Multivitamins', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'),
        ('Bird Food', 180, 230, 115, '1 kg', 'Mixed seeds', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'),
        ('Fish Food', 95, 125, 150, '100 g', 'Aquarium food', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'),
    ],
    
    'Sweet Tooth': [
        ('Cadbury Dairy Milk', 40, 50, 250, '55 g', 'Milk chocolate', 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400'),
        ('KitKat', 20, 25, 280, '37 g', 'Crispy wafer', 'https://images.unsplash.com/photo-1606312619070-d48b4f0b2aa6?w=400'),
        ('Snickers', 35, 45, 240, '50 g', 'Peanut chocolate', 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400'),
        ('5 Star', 10, 15, 300, '22 g', 'Caramel chocolate', 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400'),
        ('Perk', 10, 15, 295, '28 g', 'Wafer chocolate', 'https://images.unsplash.com/photo-1606312619070-d48b4f0b2aa6?w=400'),
        ('Munch', 10, 15, 290, '28 g', 'Crispy chocolate', 'https://images.unsplash.com/photo-1606312619070-d48b4f0b2aa6?w=400'),
        ('Mars', 40, 50, 220, '51 g', 'Chocolate bar', 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400'),
        ('Milkybar', 20, 25, 270, '28 g', 'White chocolate', 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400'),
        ('Ferrero Rocher', 280, 350, 120, '16 pieces', 'Hazelnut chocolate', 'https://images.unsplash.com/photo-1549575291-b8c184089298?w=400'),
        ('Toblerone', 195, 245, 95, '100 g', 'Swiss chocolate', 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400'),
        ('Lindt', 380, 460, 70, '100 g', 'Premium chocolate', 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400'),
        ('Amul Chocolate', 10, 15, 285, '40 g', 'Milk chocolate', 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400'),
        ('Gems', 10, 15, 275, '30 g', 'Coated chocolate', 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400'),
        ('Eclairs', 5, 10, 350, '50 pcs', 'Toffee eclairs', 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400'),
        ('Mango Bite', 5, 10, 340, '50 pcs', 'Mango candy', 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400'),
        ('Alpenliebe', 60, 75, 200, '100 pcs', 'Fruit candies', 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400'),
        ('Pulse Candy', 1, 2, 400, '1 pc', 'Raw mango candy', 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400'),
        ('Mentos', 20, 25, 280, '1 roll', 'Chewy candy', 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400'),
        ('Center Fresh', 5, 10, 330, '1 strip', 'Chewing gum', 'https://images.unsplash.com/photo-1581798459219-785eb0f89618?w=400'),
        ('Orbit Gum', 10, 15, 310, '1 pack', 'Sugar free gum', 'https://images.unsplash.com/photo-1581798459219-785eb0f89618?w=400'),
        ('Haldiram Soan Papdi', 140, 175, 130, '500 g', 'Indian sweet', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'),
        ('Bikano Rasgulla', 120, 150, 140, '1 kg', 'Soft rasgulla', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400'),
        ('Gulab Jamun', 95, 120, 155, '1 kg', 'Sweet gulab jamun', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400'),
        ('Kaju Katli', 480, 580, 80, '500 g', 'Cashew sweet', 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400'),
        ('Mysore Pak', 320, 390, 95, '500 g', 'Ghee sweet', 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400'),
        ('Jalebi', 180, 230, 120, '500 g', 'Crispy jalebi', 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400'),
        ('Ice Cream Cup', 40, 50, 200, '100 ml', 'Vanilla cup', 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400'),
        ('Kwality Walls Cone', 50, 60, 190, '1 pc', 'Ice cream cone', 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400'),
        ('Mother Dairy Kulfi', 30, 40, 220, '1 pc', 'Traditional kulfi', 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400'),
        ('Amul Nutty Buddy', 25, 35, 240, '1 pc', 'Nut ice cream', 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400'),
    ],
}

print("=" * 70)
print("ADDING 30 PRODUCTS TO ALL REMAINING EMPTY CATEGORIES")
print("=" * 70)

# Get category IDs
cur.execute("SELECT id, name FROM categories WHERE name IN ('Baby Care', 'Cleaning & Household', 'Home Care', 'Instant & Frozen Food', 'Personal Care', 'Pet Care', 'Sweet Tooth')")
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
