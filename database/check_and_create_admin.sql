-- Check for admin users
SELECT 'Admin Users:' as info;
SELECT id, name, phone, role, status FROM users WHERE role = 'admin';

-- Show all users with roles
SELECT 'All Users:' as info;
SELECT id, name, phone, role, status FROM users ORDER BY id;

-- If no admin users exist, uncomment and run ONE of these:

-- Option 1: Update an existing user to admin (replace phone number)
-- UPDATE users SET role = 'admin' WHERE phone = '9999999999';

-- Option 2: Create a new admin user
-- INSERT INTO users (name, phone, role, status)  
-- VALUES ('Admin User', '9999999999', 'admin', 'active');
