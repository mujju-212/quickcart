-- ============================================================================
-- QuickCart Data Verification Queries
-- ============================================================================
-- Run these queries in Supabase SQL Editor to verify your data
-- Instructions: Copy one query at a time and paste into SQL Editor
-- ============================================================================

-- 1. Check all categories (should return 13 rows)
SELECT id, name, status, products_count 
FROM categories 
ORDER BY id;

-- 2. Check admin user (should return 1 row)
SELECT id, name, phone, email, role, status 
FROM users 
WHERE role = 'admin';

-- 3. Check all banners (should return 3 rows)
SELECT id, title, subtitle, status, display_order 
FROM banners 
ORDER BY display_order;

-- 4. Check all offers (should return 3 rows)
SELECT id, title, code, discount_type, discount_value, start_date, end_date 
FROM offers 
WHERE status = 'active';

-- 5. Count all tables (should show 0 products initially, but structure exists)
SELECT 
    (SELECT COUNT(*) FROM categories) as categories_count,
    (SELECT COUNT(*) FROM products) as products_count,
    (SELECT COUNT(*) FROM users) as users_count,
    (SELECT COUNT(*) FROM banners) as banners_count,
    (SELECT COUNT(*) FROM offers) as offers_count,
    (SELECT COUNT(*) FROM cart_items) as cart_items_count,
    (SELECT COUNT(*) FROM wishlist_items) as wishlist_items_count,
    (SELECT COUNT(*) FROM orders) as orders_count;

-- 6. List all tables in your database
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 7. Check database indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename, indexname;
