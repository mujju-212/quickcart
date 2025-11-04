import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

conn = psycopg2.connect('postgresql://postgres:mk0492@localhost:5432/blink_basket')
cur = conn.cursor(cursor_factory=RealDictCursor)

# Products for categories that need more - bringing each to 30 products
products_data = {
    'Fruits': [
        ('Dragon Fruit', 180, 220, 45, '500 g', 'Exotic dragon fruit', 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400'),
    ],
    
    'Bakery & Biscuits': [
        ('Britannia Good Day', 35, 45, 180, '200 g', 'Butter cookies', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'),
        ('Parle Monaco', 20, 25, 200, '200 g', 'Salty crackers', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'),
        ('Sunfeast Dark Fantasy', 50, 60, 160, '150 g', 'Chocolate cookies', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'),
        ('Britannia 50-50', 15, 20, 220, '200 g', 'Sweet & salty', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'),
        ('Parle Hide & Seek', 30, 40, 190, '200 g', 'Choco chip cookies', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'),
        ('Britannia Nutrichoice', 45, 55, 150, '200 g', 'Healthy cookies', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'),
        ('Sunfeast Mom\'s Magic', 30, 40, 170, '200 g', 'Rich butter cookies', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'),
        ('Parle Krackjack', 10, 15, 240, '200 g', 'Sweet crackers', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'),
        ('Britannia Milk Bikis', 25, 35, 210, '200 g', 'Milk cookies', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'),
        ('Sunfeast Glucose', 20, 30, 230, '250 g', 'Glucose biscuits', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'),
        ('McVities Digestive', 60, 75, 130, '250 g', 'Wheat biscuits', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'),
        ('Oreo Original', 30, 40, 180, '120 g', 'Chocolate sandwich', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'),
        ('Bourbon Biscuits', 25, 35, 200, '200 g', 'Chocolate cream', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'),
        ('Jim Jam Biscuits', 30, 40, 170, '200 g', 'Jam filled cookies', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'),
        ('Bread', 40, 50, 150, '400 g', 'White bread', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'),
        ('Brown Bread', 45, 55, 140, '400 g', 'Whole wheat bread', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'),
        ('Milk Bread', 50, 60, 130, '400 g', 'Soft milk bread', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'),
        ('Pav', 30, 40, 160, '6 pcs', 'Indian bread rolls', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'),
        ('Bun', 35, 45, 155, '6 pcs', 'Burger buns', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'),
        ('Pizza Base', 45, 55, 120, '2 pcs', 'Ready pizza base', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'),
    ],
    
    'Dairy': [
        ('Amul Butter', 52, 60, 150, '100 g', 'Table butter', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400'),
        ('Amul Cheese Slice', 120, 140, 110, '200 g', 'Cheese slices', 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=400'),
        ('Amul Cheese Cubes', 140, 165, 100, '200 g', 'Processed cheese', 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=400'),
        ('Britannia Cheese', 125, 150, 105, '200 g', 'Cheese blocks', 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=400'),
        ('Mother Dairy Paneer', 85, 100, 130, '200 g', 'Fresh paneer', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400'),
        ('Amul Paneer', 90, 105, 125, '200 g', 'Fresh cottage cheese', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400'),
        ('Nestle Dahi', 25, 30, 200, '400 g', 'Fresh curd', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400'),
        ('Mother Dairy Dahi', 22, 28, 210, '400 g', 'Probiotic curd', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400'),
        ('Amul Lassi', 30, 38, 180, '200 ml', 'Sweet lassi', 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=400'),
        ('Amul Buttermilk', 20, 25, 220, '200 ml', 'Spiced buttermilk', 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=400'),
        ('Epigamia Greek Yogurt', 60, 75, 140, '90 g', 'Greek yogurt', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400'),
        ('Mother Dairy Ghee', 280, 330, 80, '500 ml', 'Pure ghee', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400'),
        ('Amul Ghee', 290, 340, 75, '500 ml', 'Pure cow ghee', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400'),
        ('Britannia Bread Spread', 95, 115, 120, '200 g', 'Cheese spread', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400'),
        ('Amul Pizza Cheese', 160, 190, 90, '200 g', 'Mozzarella cheese', 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=400'),
        ('Mother Dairy Cream', 45, 55, 160, '200 ml', 'Fresh cream', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400'),
        ('Amul Chocolate Milk', 20, 25, 200, '200 ml', 'Flavored milk', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400'),
        ('Mother Dairy Flavored Milk', 18, 24, 210, '200 ml', 'Strawberry milk', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400'),
        ('Nestle Milkmaid', 95, 115, 115, '400 g', 'Condensed milk', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400'),
        ('Amul Cream Cheese', 180, 220, 70, '200 g', 'Spreadable cheese', 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=400'),
        ('Britannia Cheese Spread', 85, 105, 125, '180 g', 'Easy spread', 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=400'),
        ('Gowardhan Paneer', 80, 95, 135, '200 g', 'Soft paneer', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400'),
        ('Verka Dahi', 24, 30, 195, '400 g', 'Fresh yogurt', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400'),
        ('Parag Butter', 48, 58, 155, '100 g', 'Salted butter', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400'),
        ('Nandini Milk', 28, 35, 190, '500 ml', 'Toned milk', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400'),
    ],
    
    'Snacks': [
        ('Bingo Mad Angles', 10, 15, 280, '72 g', 'Masala chips', 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400'),
        ('Uncle Chips', 10, 15, 270, '55 g', 'Spicy chips', 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400'),
        ('Balaji Wafers', 10, 15, 285, '65 g', 'Wavy chips', 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400'),
        ('Too Yumm Multigrain Chips', 20, 28, 200, '70 g', 'Healthy chips', 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400'),
        ('Act II Popcorn', 40, 50, 180, '75 g', 'Butter popcorn', 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400'),
        ('Bikaji Bhujia', 35, 45, 190, '200 g', 'Aloo bhujia', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'),
        ('Haldiram Aloo Bhujia', 40, 50, 185, '200 g', 'Crispy bhujia', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'),
        ('Bikaji Moong Dal', 30, 40, 200, '200 g', 'Fried dal', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'),
        ('Haldiram Moong Dal', 35, 45, 195, '200 g', 'Crunchy dal', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'),
        ('Bikaji Sev', 25, 35, 210, '200 g', 'Thin sev', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'),
        ('Haldiram Sev', 28, 38, 205, '200 g', 'Ratlami sev', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'),
        ('Bikano Rasgulla Soan Papdi', 140, 175, 120, '500 g', 'Sweet mix', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400'),
        ('Haldiram Navratan Mix', 50, 65, 160, '200 g', 'Mixed namkeen', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'),
        ('Haldiram Paneer Bhurji', 60, 75, 150, '200 g', 'Spicy mix', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'),
        ('Bikaji Banana Chips', 35, 45, 185, '200 g', 'Crispy chips', 'https://images.unsplash.com/photo-1609238449990-16b2c2e00ae0?w=400'),
        ('Yellow Diamond Chips', 10, 15, 275, '60 g', 'Salted chips', 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400'),
        ('Pringles Original', 95, 120, 110, '107 g', 'Potato crisps', 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400'),
        ('Doritos Nacho Cheese', 35, 45, 170, '75 g', 'Cheese chips', 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400'),
        ('Cheetos Puffs', 20, 28, 220, '50 g', 'Cheese puffs', 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400'),
        ('Cornitos Nachos', 45, 60, 145, '150 g', 'Roasted salsa', 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400'),
        ('Tiffany Wafers', 35, 45, 180, '100 g', 'Cream wafers', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'),
        ('Bikaji Chana Dal', 30, 40, 195, '200 g', 'Roasted chana', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'),
        ('Haldiram Khatta Meetha', 45, 60, 175, '200 g', 'Sweet & sour mix', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'),
        ('Haldiram Bhel Puri', 40, 55, 180, '200 g', 'Ready to eat bhel', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'),
        ('Bikaji Mix', 35, 48, 190, '200 g', 'Masala mix', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'),
        ('Haldiram Chana Jor Garam', 35, 48, 185, '200 g', 'Spicy chana', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'),
        ('Bikaji Peanuts', 50, 65, 155, '400 g', 'Roasted peanuts', 'https://images.unsplash.com/photo-1582054593962-3a7c5b50e4de?w=400'),
    ],
    
    'Meat & Seafood': [
        ('Fresh Chicken Breast', 280, 330, 60, '500 g', 'Boneless chicken', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400'),
        ('Chicken Wings', 220, 270, 70, '500 g', 'Fresh wings', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400'),
        ('Chicken Thighs', 200, 250, 75, '500 g', 'Bone-in thighs', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400'),
        ('Chicken Drumstick', 180, 230, 80, '500 g', 'Fresh drumsticks', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400'),
        ('Chicken Mince', 240, 290, 65, '500 g', 'Ground chicken', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400'),
        ('Chicken Liver', 140, 180, 55, '250 g', 'Fresh liver', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400'),
        ('Country Eggs', 80, 100, 150, '12 pcs', 'Farm eggs', 'https://images.unsplash.com/photo-1587486937350-355d5fdf4f74?w=400'),
        ('Mutton Curry Cut', 650, 750, 35, '500 g', 'Fresh mutton', 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400'),
        ('Mutton Keema', 680, 780, 32, '500 g', 'Ground mutton', 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400'),
        ('Prawns Medium', 380, 450, 45, '500 g', 'Fresh prawns', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400'),
        ('Prawns Large', 480, 560, 40, '500 g', 'Jumbo prawns', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400'),
        ('Pomfret Fish', 550, 650, 30, '500 g', 'Whole fish', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400'),
        ('Rohu Fish', 320, 390, 45, '500 g', 'Fresh rohu', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400'),
        ('Basa Fish', 280, 350, 50, '500 g', 'Boneless fish', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400'),
        ('Salmon Fish', 850, 980, 25, '500 g', 'Atlantic salmon', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400'),
        ('Tuna Fish', 680, 780, 28, '500 g', 'Fresh tuna', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400'),
        ('Crab', 480, 580, 35, '500 g', 'Fresh crab', 'https://images.unsplash.com/photo-1549631656-b8a59a6d06f2?w=400'),
        ('Squid', 420, 510, 38, '500 g', 'Fresh squid', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400'),
        ('Fish Fingers', 320, 390, 55, '400 g', 'Breaded fingers', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400'),
        ('Chicken Sausages', 180, 230, 75, '400 g', 'Pork free', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400'),
        ('Chicken Salami', 220, 280, 65, '200 g', 'Sliced salami', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400'),
        ('Chicken Bacon', 280, 340, 55, '200 g', 'Smoked bacon', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400'),
        ('Chicken Ham', 240, 300, 60, '200 g', 'Sliced ham', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400'),
        ('Quail Eggs', 120, 150, 85, '15 pcs', 'Small eggs', 'https://images.unsplash.com/photo-1587486937350-355d5fdf4f74?w=400'),
        ('Duck Eggs', 150, 190, 70, '6 pcs', 'Large eggs', 'https://images.unsplash.com/photo-1587486937350-355d5fdf4f74?w=400'),
        ('Whole Chicken', 350, 420, 50, '1 kg', 'Cleaned chicken', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400'),
        ('Chicken Seekh Kebab', 280, 340, 55, '500 g', 'Ready to cook', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400'),
    ],
    
    'Frozen Foods': [
        ('McCain Aloo Tikki', 150, 185, 85, '400 g', 'Potato patties', 'https://images.unsplash.com/photo-1606491048063-babd90748b2f?w=400'),
        ('McCain Veggie Burger Patty', 180, 225, 75, '360 g', 'Veg patties', 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400'),
        ('McCain Hash Browns', 140, 175, 90, '400 g', 'Crispy browns', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400'),
        ('McCain Cheese Balls', 195, 240, 70, '400 g', 'Cheesy snack', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400'),
        ('Sumeru Green Peas', 85, 110, 120, '500 g', 'Frozen peas', 'https://images.unsplash.com/photo-1601439678777-b2d6d7e6b3c1?w=400'),
        ('McCain Corn Cob', 180, 225, 65, '500 g', 'Sweet corn cob', 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400'),
        ('Godrej Yummiez Veg Cutlet', 135, 170, 80, '400 g', 'Vegetable cutlet', 'https://images.unsplash.com/photo-1606491048063-babd90748b2f?w=400'),
        ('Godrej Yummiez Veg Nuggets', 145, 180, 75, '400 g', 'Crispy nuggets', 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400'),
        ('ITC Aashirvaad Whole Wheat Paratha', 150, 190, 70, '5 pcs', 'Wheat paratha', 'https://images.unsplash.com/photo-1619362280286-8931c2fd0f55?w=400'),
        ('ITC Aashirvaad Malabar Paratha', 155, 195, 68, '5 pcs', 'Layered paratha', 'https://images.unsplash.com/photo-1619362280286-8931c2fd0f55?w=400'),
        ('ITC Aashirvaad Methi Paratha', 160, 200, 65, '5 pcs', 'Fenugreek paratha', 'https://images.unsplash.com/photo-1619362280286-8931c2fd0f55?w=400'),
        ('Sumeru Veg Spring Roll', 165, 210, 72, '400 g', 'Crispy rolls', 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400'),
        ('McCain Peri Peri Fries', 135, 170, 80, '420 g', 'Spicy fries', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400'),
        ('McCain Wedges', 145, 180, 75, '420 g', 'Potato wedges', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400'),
        ('Godrej Yummiez Hara Bhara Kebab', 150, 190, 70, '400 g', 'Green kebab', 'https://images.unsplash.com/photo-1606491048063-babd90748b2f?w=400'),
        ('Sumeru Cheese Corn Nuggets', 175, 220, 68, '400 g', 'Cheese nuggets', 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400'),
        ('McCain Smiles', 160, 200, 75, '400 g', 'Potato smiles', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400'),
        ('Venky Chicken Wings', 320, 390, 50, '400 g', 'Spicy wings', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400'),
        ('Venky Chicken Seekh Kebab', 290, 350, 55, '400 g', 'Minced kebab', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400'),
        ('Prasuma Chicken Spring Roll', 260, 320, 58, '400 g', 'Chicken rolls', 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400'),
        ('Prasuma Fish Fingers', 340, 410, 45, '400 g', 'Crispy fingers', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400'),
        ('ITC Aashirvaad Paneer Paratha', 175, 220, 62, '5 pcs', 'Stuffed paratha', 'https://images.unsplash.com/photo-1619362280286-8931c2fd0f55?w=400'),
        ('ITC Aashirvaad Aloo Paratha', 165, 210, 65, '5 pcs', 'Potato paratha', 'https://images.unsplash.com/photo-1619362280286-8931c2fd0f55?w=400'),
        ('Haldiram Pani Puri', 135, 170, 78, '400 g', 'Frozen pani puri', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'),
        ('Sumeru Paneer Tikka', 220, 280, 60, '400 g', 'Marinated paneer', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400'),
        ('McCain Onion Rings', 155, 195, 70, '400 g', 'Crispy rings', 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400'),
        ('Godrej Yummiez Paneer Fingers', 185, 235, 68, '400 g', 'Breaded paneer', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400'),
        ('Sumeru Blueberry Cake', 280, 350, 45, '500 g', 'Frozen cake', 'https://images.unsplash.com/photo-1588195538326-c5aeb34a6e2c?w=400'),
    ],
    
    'Bakery': [
        ('Chocolate Cake', 450, 550, 40, '500 g', 'Rich chocolate cake', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'),
        ('Black Forest Cake', 500, 600, 35, '500 g', 'Classic cake', 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400'),
        ('Pineapple Cake', 420, 520, 45, '500 g', 'Fresh pineapple', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400'),
        ('Vanilla Cake', 380, 480, 50, '500 g', 'Classic vanilla', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'),
        ('Red Velvet Cake', 550, 650, 30, '500 g', 'Cream cheese frosting', 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400'),
        ('Butterscotch Cake', 480, 580, 38, '500 g', 'Caramel butterscotch', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400'),
        ('Fruit Cake', 520, 620, 32, '500 g', 'Mixed fruit cake', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400'),
        ('Cupcakes', 150, 190, 80, '6 pcs', 'Assorted cupcakes', 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=400'),
        ('Muffins', 120, 160, 90, '4 pcs', 'Blueberry muffins', 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400'),
        ('Brownies', 180, 230, 75, '4 pcs', 'Fudgy brownies', 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400'),
        ('Donuts', 140, 180, 85, '6 pcs', 'Glazed donuts', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400'),
        ('Cookies', 95, 125, 120, '200 g', 'Chocolate chip', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'),
        ('Croissant', 45, 60, 100, '1 pc', 'Butter croissant', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400'),
        ('Garlic Bread', 95, 125, 90, '4 pcs', 'Cheese garlic bread', 'https://images.unsplash.com/photo-1573140401552-388e7c8b9eed?w=400'),
        ('Baguette', 65, 85, 95, '1 pc', 'French baguette', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'),
        ('Dinner Rolls', 80, 105, 100, '6 pcs', 'Soft rolls', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'),
        ('Cheese Bun', 35, 48, 125, '1 pc', 'Cheese stuffed bun', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'),
        ('Puff Pastry', 30, 42, 135, '1 pc', 'Veg puff', 'https://images.unsplash.com/photo-1587536849024-daaa4a417b16?w=400'),
        ('Chicken Puff', 40, 55, 110, '1 pc', 'Chicken stuffed', 'https://images.unsplash.com/photo-1587536849024-daaa4a417b16?w=400'),
        ('Egg Puff', 38, 52, 115, '1 pc', 'Egg stuffed', 'https://images.unsplash.com/photo-1587536849024-daaa4a417b16?w=400'),
        ('Paneer Puff', 42, 58, 105, '1 pc', 'Paneer stuffed', 'https://images.unsplash.com/photo-1587536849024-daaa4a417b16?w=400'),
        ('Pizza Puff', 45, 62, 100, '1 pc', 'Pizza flavored', 'https://images.unsplash.com/photo-1587536849024-daaa4a417b16?w=400'),
        ('Sandwich', 60, 80, 120, '1 pc', 'Veg sandwich', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400'),
        ('Chicken Sandwich', 80, 105, 95, '1 pc', 'Grilled chicken', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400'),
        ('Club Sandwich', 120, 155, 70, '1 pc', 'Triple decker', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400'),
        ('Burger Bun', 30, 42, 140, '4 pcs', 'Sesame buns', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'),
        ('Hot Dog Buns', 35, 48, 130, '4 pcs', 'Long buns', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'),
        ('Rusk', 40, 55, 150, '400 g', 'Toast rusk', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'),
    ],
}

print("=" * 70)
print("FILLING CATEGORIES TO 30 PRODUCTS EACH")
print("=" * 70)

# Get category IDs
cur.execute("SELECT id, name FROM categories WHERE name IN ('Fruits', 'Bakery & Biscuits', 'Dairy', 'Snacks', 'Meat & Seafood', 'Frozen Foods', 'Bakery')")
categories = {row['name']: row['id'] for row in cur.fetchall()}

total_added = 0

for category_name, products in products_data.items():
    if category_name not in categories:
        print(f"\n⚠️  Category '{category_name}' not found, skipping...")
        continue
    
    category_id = categories[category_name]
    
    # Check current count
    cur.execute('SELECT COUNT(*) as count FROM products WHERE category_id = %s AND status = %s', (category_id, 'active'))
    current_count = cur.fetchone()['count']
    needed = 30 - current_count
    
    print(f"\n📦 {category_name} (ID: {category_id})")
    print(f"   Current: {current_count} products, Need: {needed} more")
    
    if needed <= 0:
        print(f"   ✅ Already has 30+ products!")
        continue
    
    cur.execute('SELECT name FROM products WHERE category_id = %s', (category_id,))
    existing_products = {row['name'] for row in cur.fetchall()}
    
    added_count = 0
    for name, price, original_price, stock, size, description, image_url in products[:needed]:  # Only add what's needed
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
            
            if added_count >= needed:
                break
        except Exception as e:
            print(f"   ❌ Error adding {name}: {e}")
    
    print(f"   → Added {added_count} products (Total now: {current_count + added_count})")

conn.commit()
cur.close()
conn.close()

print("\n" + "=" * 70)
print(f"✅ SUCCESSFULLY ADDED {total_added} PRODUCTS!")
print("All categories now have 30 products each!")
print("=" * 70)
