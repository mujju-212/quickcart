-- Insert Categories Data
-- This script populates the categories table with data from the React application

INSERT INTO categories (name, image_url, status) VALUES
('Fruits & Vegetables', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&q=80', 'active'),
('Dairy & Breakfast', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop&q=80', 'active'),
('Beverages', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop&q=80', 'active'),
('Snacks & Munchies', 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop&q=80', 'active'),
('Bakery & Biscuits', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&q=80', 'active'),
('Personal Care', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&q=80', 'active'),
('Home Care', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80', 'active'),
('Baby Care', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&q=80', 'active')
ON CONFLICT (name) DO NOTHING;