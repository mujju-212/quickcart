-- Insert Products Data from Constants
-- This script populates the products table with data from the React constants
-- Make sure to run insert_categories.sql first

INSERT INTO products (name, category_id, price, original_price, size, stock, image_url, description, status) VALUES
-- Fruits & Vegetables (category_id = 1)
('Fresh Bananas', 1, 40.00, 50.00, '1 kg', 50, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop&q=80', 'Fresh yellow bananas, rich in potassium.', 'active'),
('Red Apples', 1, 120.00, 150.00, '1 kg', 30, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop&q=80', 'Crisp and sweet red apples.', 'active'),
('Fresh Tomatoes', 1, 60.00, 80.00, '1 kg', 40, 'https://tse1.mm.bing.net/th/id/OIP._4FpoAQAvIeIMwRxiDUOJAHaE8?rs=1&pid=ImgDetMain&o=7&rm=3', 'Fresh red tomatoes, perfect for cooking.', 'active'),
('Green Spinach', 1, 30.00, 40.00, '500 g', 25, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop&q=80', 'Fresh green spinach leaves.', 'active'),
('Carrots', 1, 50.00, 60.00, '1 kg', 35, 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400&h=400&fit=crop&q=80', 'Fresh orange carrots.', 'active'),
('Onions', 1, 35.00, 45.00, '1 kg', 60, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=400&fit=crop&q=80', 'Fresh red onions.', 'active'),
('Potatoes', 1, 25.00, 30.00, '1 kg', 80, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=400&fit=crop&q=80', 'Fresh potatoes for cooking.', 'active'),
('Fresh Ginger', 1, 120.00, 150.00, '250 g', 40, 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&h=400&fit=crop&q=80', 'Fresh ginger root.', 'active'),
('Fresh Garlic', 1, 80.00, 100.00, '250 g', 45, 'https://images.unsplash.com/photo-1588417271599-fa6133723207?w=400&h=400&fit=crop&q=80', 'Fresh garlic bulbs.', 'active'),
('Fresh Lemons', 1, 60.00, 70.00, '500 g', 50, 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&h=400&fit=crop&q=80', 'Fresh lemons, rich in vitamin C.', 'active'),
('Fresh Cucumber', 1, 40.00, 50.00, '1 kg', 35, 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&h=400&fit=crop&q=80', 'Fresh green cucumber.', 'active'),
('Fresh Bell Peppers', 1, 80.00, 100.00, '500 g', 25, 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop&q=80', 'Colorful bell peppers.', 'active'),
('Fresh Cauliflower', 1, 50.00, 60.00, '1 piece', 20, 'https://images.unsplash.com/photo-1568584711284-9b146eab5d5e?w=400&h=400&fit=crop&q=80', 'Fresh white cauliflower.', 'active'),
('Fresh Cabbage', 1, 30.00, 40.00, '1 piece', 25, 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&h=400&fit=crop&q=80', 'Fresh green cabbage.', 'active'),
('Fresh Broccoli', 1, 120.00, 150.00, '500 g', 15, 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=400&fit=crop&q=80', 'Fresh green broccoli.', 'active'),
('Fresh Grapes', 1, 100.00, 120.00, '500 g', 30, 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&h=400&fit=crop&q=80', 'Sweet green grapes.', 'active'),
('Fresh Oranges', 1, 80.00, 100.00, '1 kg', 40, 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=400&fit=crop&q=80', 'Juicy oranges, rich in vitamin C.', 'active'),
('Fresh Pineapple', 1, 80.00, 100.00, '1 piece', 20, 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=400&fit=crop&q=80', 'Sweet and tangy pineapple.', 'active'),
('Fresh Mango', 1, 120.00, 150.00, '1 kg', 25, 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop&q=80', 'Sweet and juicy mangoes.', 'active'),
('Fresh Pomegranate', 1, 180.00, 200.00, '500 g', 20, 'https://images.unsplash.com/photo-1564845851885-95764d416742?w=400&h=400&fit=crop&q=80', 'Fresh pomegranate with seeds.', 'active'),

-- Dairy & Breakfast (category_id = 2)
('Amul Milk', 2, 56.00, 60.00, '1 L', 50, 'https://images.unsplash.com/photo-1550583724-b2692b85169f?w=400&h=400&fit=crop&q=80', 'Fresh full cream milk.', 'active'),
('Mother Dairy Curd', 2, 45.00, 50.00, '500 g', 30, 'https://images.unsplash.com/photo-1571212515416-fcd58862d089?w=400&h=400&fit=crop&q=80', 'Fresh curd for daily consumption.', 'active'),
('Amul Butter', 2, 52.00, 55.00, '100 g', 25, 'https://images.unsplash.com/photo-1589985271647-61c2c2c80d9b?w=400&h=400&fit=crop&q=80', 'Creamy butter spread.', 'active'),
('Britannia Bread', 2, 25.00, 28.00, '400 g', 40, 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=400&fit=crop&q=80', 'Fresh whole wheat bread.', 'active'),
('Eggs', 2, 60.00, 70.00, '6 pieces', 35, 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop&q=80', 'Fresh farm eggs.', 'active'),
('Amul Cheese', 2, 120.00, 130.00, '200 g', 20, 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop&q=80', 'Processed cheese slices.', 'active'),
('Cornflakes', 2, 180.00, 200.00, '500 g', 25, 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=400&h=400&fit=crop&q=80', 'Crispy corn flakes cereal.', 'active'),
('Oats', 2, 95.00, 105.00, '500 g', 30, 'https://images.unsplash.com/photo-1574673442427-86fd2d89b9ae?w=400&h=400&fit=crop&q=80', 'Healthy rolled oats.', 'active'),
('Peanut Butter', 2, 250.00, 280.00, '500 g', 15, 'https://images.unsplash.com/photo-1529258283598-8d6fe60b27f4?w=400&h=400&fit=crop&q=80', 'Creamy peanut butter.', 'active'),
('Jam Mixed Fruit', 2, 85.00, 95.00, '200 g', 20, 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=400&fit=crop&q=80', 'Mixed fruit jam.', 'active'),

-- Beverages (category_id = 3)
('Coca Cola', 3, 40.00, 45.00, '500 ml', 100, 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=400&fit=crop&q=80', 'Refreshing cola drink.', 'active'),
('Pepsi', 3, 40.00, 45.00, '500 ml', 100, 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=400&fit=crop&q=80', 'Classic pepsi cola.', 'active'),
('Sprite', 3, 40.00, 45.00, '500 ml', 80, 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop&q=80', 'Lemon lime soda.', 'active'),
('Orange Juice', 3, 120.00, 140.00, '1 L', 50, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&q=80', 'Fresh orange juice.', 'active'),
('Apple Juice', 3, 130.00, 150.00, '1 L', 45, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&q=80', 'Fresh apple juice.', 'active'),
('Green Tea', 3, 180.00, 200.00, '100 g', 30, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop&q=80', 'Healthy green tea leaves.', 'active'),
('Black Tea', 3, 150.00, 170.00, '250 g', 40, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop&q=80', 'Premium black tea.', 'active'),
('Coffee Powder', 3, 280.00, 320.00, '200 g', 25, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop&q=80', 'Instant coffee powder.', 'active'),
('Energy Drink', 3, 125.00, 140.00, '250 ml', 60, 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=400&fit=crop&q=80', 'Energy booster drink.', 'active'),
('Mineral Water', 3, 20.00, 25.00, '1 L', 200, 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop&q=80', 'Pure mineral water.', 'active'),

-- Snacks & Munchies (category_id = 4)
('Lays Chips', 4, 20.00, 25.00, '50 g', 80, 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop&q=80', 'Crispy potato chips.', 'active'),
('Kurkure', 4, 20.00, 25.00, '70 g', 70, 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop&q=80', 'Crunchy corn puffs.', 'active'),
('Haldirams Namkeen', 4, 45.00, 50.00, '150 g', 50, 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop&q=80', 'Traditional Indian snacks.', 'active'),
('Pringles', 4, 99.00, 110.00, '110 g', 30, 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop&q=80', 'Stackable potato crisps.', 'active'),
('Popcorn', 4, 60.00, 70.00, '100 g', 40, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&q=80', 'Butter flavored popcorn.', 'active'),
('Mixed Nuts', 4, 280.00, 320.00, '200 g', 25, 'https://images.unsplash.com/photo-1599599810694-57a2ca8276a8?w=400&h=400&fit=crop&q=80', 'Premium mixed nuts.', 'active'),
('Cashews', 4, 520.00, 580.00, '250 g', 20, 'https://images.unsplash.com/photo-1599599810694-57a2ca8276a8?w=400&h=400&fit=crop&q=80', 'Roasted cashew nuts.', 'active'),
('Almonds', 4, 480.00, 520.00, '250 g', 22, 'https://images.unsplash.com/photo-1599599810694-57a2ca8276a8?w=400&h=400&fit=crop&q=80', 'Premium almonds.', 'active'),
('Raisins', 4, 180.00, 200.00, '200 g', 35, 'https://images.unsplash.com/photo-1599599810694-57a2ca8276a8?w=400&h=400&fit=crop&q=80', 'Sweet dried raisins.', 'active'),
('Dark Chocolate', 4, 150.00, 180.00, '100 g', 30, 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=400&fit=crop&q=80', 'Premium dark chocolate.', 'active'),

-- Bakery & Biscuits (category_id = 5)
('Parle-G Biscuits', 5, 25.00, 28.00, '200 g', 50, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop&q=80', 'Classic glucose biscuits.', 'active'),
('Oreo Cookies', 5, 45.00, 50.00, '150 g', 40, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop&q=80', 'Chocolate cream cookies.', 'active'),
('Britannia Marie Gold', 5, 35.00, 40.00, '200 g', 35, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop&q=80', 'Light and crispy marie biscuits.', 'active'),
('Cake Rusk', 5, 65.00, 75.00, '200 g', 25, 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=400&fit=crop&q=80', 'Crispy cake rusk for tea.', 'active'),
('Chocolate Cake', 5, 350.00, 400.00, '500 g', 10, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop&q=80', 'Rich chocolate cake.', 'active'),
('Croissant', 5, 45.00, 50.00, '2 pieces', 20, 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=400&fit=crop&q=80', 'Buttery croissants.', 'active'),
('Muffins', 5, 120.00, 140.00, '4 pieces', 15, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop&q=80', 'Chocolate chip muffins.', 'active'),
('Donuts', 5, 180.00, 200.00, '6 pieces', 12, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop&q=80', 'Glazed donuts.', 'active'),
('Cookies', 5, 85.00, 95.00, '200 g', 30, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop&q=80', 'Assorted cookies.', 'active'),
('Bun', 5, 30.00, 35.00, '4 pieces', 25, 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=400&fit=crop&q=80', 'Soft burger buns.', 'active');

-- Update category product counts
UPDATE categories SET products_count = (
    SELECT COUNT(*) FROM products WHERE category_id = categories.id
) WHERE id <= 8;