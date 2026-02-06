# QuickCart - Database Schema Documentation

## 📋 Table of Contents

1. [Database Overview](#database-overview)
2. [Entity Relationship Diagram](#entity-relationship-diagram)
3. [Table Definitions](#table-definitions)
4. [Relationships](#relationships)
5. [Indexes](#indexes)
6. [Triggers](#triggers)
7. [Constraints](#constraints)
8. [Sample Data](#sample-data)

---

## 🗄️ Database Overview

### Database Information

| Property | Value |
|----------|-------|
| **Database Name** | `blink_basket` |
| **DBMS** | PostgreSQL 16 |
| **Character Set** | UTF-8 |
| **Collation** | en_US.UTF-8 |
| **Total Tables** | 12 |
| **Normalization Level** | 3NF |

### Design Principles

- **Referential Integrity**: Foreign key constraints
- **Data Integrity**: CHECK constraints for validation
- **Performance**: Strategic indexes on frequently queried columns
- **Audit Trail**: created_at and updated_at timestamps
- **Cascading Deletes**: Proper ON DELETE actions

---

## 📊 Entity Relationship Diagram

```
┌─────────────┐
│  CATEGORIES │
│ id, name    │
└──────┬──────┘
       │ 1
       │
       │ N
┌──────▼──────────┐         ┌────────────────┐
│   PRODUCTS      │         │     USERS      │
│ id, name, price │         │ id, phone, role│
└──────┬──────────┘         └────────┬───────┘
       │ 1                          │ 1
       │                            │
       ├─────N──────────────────────┤
       │                            │ N
┌──────▼───────┐      ┌─────────────▼─────────┐
│ CART_ITEMS   │      │ USER_ADDRESSES        │
└──────────────┘      └───────────────────────┘
       │ 1                         │ 1
       │                           │
       │ N                         │ N
┌──────▼──────────┐         ┌──────▼──────┐
│ WISHLIST_ITEMS  │         │   ORDERS    │
└─────────────────┘         └──────┬──────┘
       │ N                         │ 1
       │                           │
       │ 1                         │ N
┌──────▼────────────┐       ┌──────▼─────────┐
│ PRODUCT_REVIEWS   │       │ ORDER_ITEMS    │
└───────────────────┘       └────────────────┘

┌─────────────┐     ┌─────────────┐     ┌──────────────────┐
│  BANNERS    │     │   OFFERS    │     │ ORDER_TIMELINE   │
└─────────────┘     └─────────────┘     └──────────────────┘
```

---

## 📁 Table Definitions

### 1. users

Stores user account information for customers and admins.

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE,
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    login_count INTEGER DEFAULT 0,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique user identifier |
| `name` | VARCHAR(100) | NOT NULL | User's full name |
| `phone` | VARCHAR(20) | UNIQUE, NOT NULL | Phone number (login identifier) |
| `email` | VARCHAR(150) | UNIQUE | Email address (optional) |
| `role` | VARCHAR(20) | CHECK | 'customer' or 'admin' |
| `status` | VARCHAR(20) | CHECK | 'active', 'inactive', 'suspended' |
| `login_count` | INTEGER | DEFAULT 0 | Total login count |
| `last_login` | TIMESTAMP | NULL | Last login timestamp |
| `created_at` | TIMESTAMP | DEFAULT NOW | Account creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW | Last update time |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE on `phone`
- UNIQUE on `email`

---

### 2. user_addresses

Stores multiple delivery addresses per user.

```sql
CREATE TABLE user_addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(20),
    address_line_1 VARCHAR(200) NOT NULL,
    address_line_2 VARCHAR(200),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    address_type VARCHAR(20) DEFAULT 'home' CHECK (address_type IN ('home', 'work', 'other')),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique address ID |
| `user_id` | INTEGER | FK → users(id) | User who owns address |
| `phone` | VARCHAR(20) | NULL | Contact phone for address |
| `address_line_1` | VARCHAR(200) | NOT NULL | Street address |
| `address_line_2` | VARCHAR(200) | NULL | Additional address details |
| `city` | VARCHAR(100) | NOT NULL | City name |
| `state` | VARCHAR(100) | NOT NULL | State/Province |
| `postal_code` | VARCHAR(20) | NOT NULL | Zip/Postal code |
| `country` | VARCHAR(100) | DEFAULT 'India' | Country name |
| `address_type` | VARCHAR(20) | CHECK | 'home', 'work', 'other' |
| `is_default` | BOOLEAN | DEFAULT false | Default delivery address flag |

**Relationships:**
- Many addresses belong to one user
- Cascading delete when user is deleted

---

### 3. categories

Product categorization for organization and navigation.

```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    products_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique category ID |
| `name` | VARCHAR(100) | NOT NULL, UNIQUE | Category name |
| `image_url` | TEXT | NULL | Category image URL |
| `status` | VARCHAR(20) | CHECK | 'active' or 'inactive' |
| `products_count` | INTEGER | DEFAULT 0 | Cached product count |
| `created_at` | TIMESTAMP | DEFAULT NOW | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT NOW | Last update timestamp |

**Default Categories:**
- Fruits & Vegetables
- Dairy & Breakfast
- Bakery & Biscuits
- Beverages
- Snacks & Munchies
- Instant & Frozen Food
- Tea, Coffee & Health Drink
- Atta, Rice & Dal
- Masala, Oil & More
- Sweet Tooth
- Cleaning & Household
- Personal Care
- Pet Care

---

### 4. products

Complete product catalog with pricing and inventory.

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    category_name VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    size VARCHAR(50),
    stock INTEGER DEFAULT 0,
    image_url TEXT,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique product ID |
| `name` | VARCHAR(200) | NOT NULL | Product name |
| `category_id` | INTEGER | FK → categories(id) | Category reference |
| `category_name` | VARCHAR(100) | NULL | Denormalized category name |
| `price` | DECIMAL(10,2) | NOT NULL | Current selling price |
| `original_price` | DECIMAL(10,2) | NULL | Original price (for discounts) |
| `size` | VARCHAR(50) | NULL | Package size (e.g., "500g", "1kg") |
| `stock` | INTEGER | DEFAULT 0 | Available quantity |
| `image_url` | TEXT | NULL | Product image URL |
| `description` | TEXT | NULL | Product description |
| `status` | VARCHAR(20) | CHECK | Product status |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `category_id`
- INDEX on `status`

**Business Rules:**
- Price must be > 0
- Stock must be >= 0
- Status 'out_of_stock' when stock = 0

---

### 5. cart_items

User shopping cart items (session-based).

```sql
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(20),
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique cart item ID |
| `user_id` | INTEGER | FK → users(id) | Cart owner |
| `phone` | VARCHAR(20) | NULL | User phone (denormalized) |
| `product_id` | INTEGER | FK → products(id) | Product reference |
| `quantity` | INTEGER | CHECK > 0 | Item quantity |

**Constraints:**
- UNIQUE constraint on (user_id, product_id) - one entry per product per user
- Quantity must be > 0
- Cascading delete on user or product deletion

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `user_id`
- UNIQUE INDEX on `(user_id, product_id)`

---

### 6. wishlist_items

User saved/favorite products.

```sql
CREATE TABLE wishlist_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(20),
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique wishlist item ID |
| `user_id` | INTEGER | FK → users(id) | Wishlist owner |
| `phone` | VARCHAR(20) | NULL | User phone |
| `product_id` | INTEGER | FK → products(id) | Saved product |

**Constraints:**
- UNIQUE constraint on (user_id, product_id)
- Cascading deletes

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `user_id`

---

### 7. orders

Order header information and status tracking.

```sql
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    phone VARCHAR(20) NOT NULL,
    user_name VARCHAR(100),
    total DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 20.00,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
    payment_status VARCHAR(30) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method VARCHAR(50),
    delivery_address TEXT,
    order_date DATE DEFAULT CURRENT_DATE,
    estimated_delivery TIMESTAMP,
    actual_delivery TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | VARCHAR(50) | PRIMARY KEY | Order ID (e.g., "QC1707091200A4F") |
| `user_id` | INTEGER | FK → users(id) | User who placed order |
| `phone` | VARCHAR(20) | NOT NULL | Contact phone |
| `user_name` | VARCHAR(100) | NULL | User name snapshot |
| `total` | DECIMAL(10,2) | NOT NULL | Final order total |
| `subtotal` | DECIMAL(10,2) | NOT NULL | Subtotal before fees |
| `delivery_fee` | DECIMAL(10,2) | DEFAULT 20 | Delivery charge |
| `status` | VARCHAR(30) | CHECK | Order status |
| `payment_status` | VARCHAR(30) | CHECK | Payment status |
| `payment_method` | VARCHAR(50) | NULL | Payment method used |
| `delivery_address` | TEXT | NULL | Full delivery address |
| `order_date` | DATE | DEFAULT today | Order placement date |
| `estimated_delivery` | TIMESTAMP | NULL | Expected delivery time |
| `actual_delivery` | TIMESTAMP | NULL | Actual delivery time |

**Order Lifecycle:**
1. `pending` - Order created
2. `confirmed` - Order accepted
3. `preparing` - Being packed
4. `out_for_delivery` - In transit
5. `delivered` - Completed
6. `cancelled` - Cancelled by user/admin

**Payment Statuses:**
- `pending` - Awaiting payment
- `completed` - Payment received
- `failed` - Payment failed
- `refunded` - Payment refunded

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `user_id`
- INDEX on `phone`
- INDEX on `order_date`
- INDEX on `status`

**ID Generation:**
Format: `QC{timestamp}{random_hex}`
Example: `QC17070912003A4F`

---

### 8. order_items

Line items for each order (products purchased).

```sql
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique line item ID |
| `order_id` | VARCHAR(50) | FK → orders(id) | Parent order |
| `product_id` | INTEGER | FK → products(id) | Product reference |
| `product_name` | VARCHAR(200) | NOT NULL | Product name snapshot |
| `product_price` | DECIMAL(10,2) | NOT NULL | Price at time of purchase |
| `quantity` | INTEGER | CHECK > 0 | Quantity ordered |
| `total_price` | DECIMAL(10,2) | NOT NULL | Line total |

**Business Logic:**
- Prices are snapshots at time of order
- Product name preserved even if product deleted
- Quantity must be > 0
- total_price = product_price × quantity

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `order_id`

---

### 9. order_timeline

Order status change history for tracking.

```sql
CREATE TABLE order_timeline (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed BOOLEAN DEFAULT true,
    notes TEXT
);
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique timeline entry ID |
| `order_id` | VARCHAR(50) | FK → orders(id) | Order reference |
| `status` | VARCHAR(50) | NOT NULL | Status name |
| `timestamp` | TIMESTAMP | DEFAULT NOW | When status occurred |
| `completed` | BOOLEAN | DEFAULT true | Status completion flag |
| `notes` | TEXT | NULL | Additional notes |

**Use Case:**
Track order progress through various stages for customer visibility.

---

### 10. banners

Homepage promotional banners managed by admin.

```sql
CREATE TABLE banners (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    subtitle VARCHAR(200),
    image_url TEXT NOT NULL,
    link_url TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    display_order INTEGER DEFAULT 0,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique banner ID |
| `title` | VARCHAR(200) | NULL | Banner headline |
| `subtitle` | VARCHAR(200) | NULL | Banner subtext |
| `image_url` | TEXT | NOT NULL | Banner image URL |
| `link_url` | TEXT | NULL | Click destination URL |
| `status` | VARCHAR(20) | CHECK | Banner visibility |
| `display_order` | INTEGER | DEFAULT 0 | Sort order |
| `start_date` | DATE | NULL | Display start date |
| `end_date` | DATE | NULL | Display end date |

**Features:**
- Schedule banners with start/end dates
- Control display order
- Link to specific categories or products

---

### 11. offers

Promotional offers and discount coupons.

```sql
CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'free_delivery')),
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_value DECIMAL(10,2) DEFAULT 0,
    max_discount_amount DECIMAL(10,2),
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    usage_limit INTEGER DEFAULT 1000,
    used_count INTEGER DEFAULT 0,
    applicable_categories TEXT DEFAULT 'all',
    offer_type VARCHAR(20) DEFAULT 'general' CHECK (offer_type IN ('general', 'first_order', 'free_delivery', 'weekend_special')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique offer ID |
| `title` | VARCHAR(200) | NOT NULL | Offer title |
| `description` | TEXT | NULL | Offer details |
| `code` | VARCHAR(50) | UNIQUE, NOT NULL | Coupon code |
| `discount_type` | VARCHAR(20) | CHECK | Discount type |
| `discount_value` | DECIMAL(10,2) | NOT NULL | Discount amount/percentage |
| `min_order_value` | DECIMAL(10,2) | DEFAULT 0 | Minimum order requirement |
| `max_discount_amount` | DECIMAL(10,2) | NULL | Maximum discount cap |
| `image_url` | TEXT | NULL | Offer image |
| `status` | VARCHAR(20) | CHECK | Offer status |
| `start_date` | DATE | NOT NULL | Offer start date |
| `end_date` | DATE | NOT NULL | Offer end date |
| `usage_limit` | INTEGER | DEFAULT 1000 | Maximum uses |
| `used_count` | INTEGER | DEFAULT 0 | Times used |
| `applicable_categories` | TEXT | DEFAULT 'all' | Category restrictions |
| `offer_type` | VARCHAR(20) | CHECK | Offer classification |

**Discount Types:**
- `percentage` - Percentage off (e.g., 20% off)
- `fixed` - Fixed amount off (e.g., ₹100 off)
- `free_delivery` - Free delivery fee

**Offer Types:**
- `general` - Available to all
- `first_order` - First-time customers only
- `free_delivery` - Free delivery
- `weekend_special` - Weekend-only offers

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE on `code`
- INDEX on `status`
- INDEX on `(start_date, end_date)`

---

### 12. product_reviews

Customer product reviews and ratings.

```sql
CREATE TABLE product_reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(100) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    verified_purchase BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique review ID |
| `product_id` | INTEGER | FK → products(id) | Product reviewed |
| `user_id` | INTEGER | FK → users(id) | Reviewer |
| `user_name` | VARCHAR(100) | NOT NULL | Reviewer name |
| `rating` | INTEGER | CHECK 1-5 | Star rating |
| `comment` | TEXT | NOT NULL | Review text |
| `verified_purchase` | BOOLEAN | DEFAULT false | Verified buyer flag |
| `helpful_count` | INTEGER | DEFAULT 0 | Helpful votes |
| `status` | VARCHAR(20) | CHECK | Moderation status |

**Review Statuses:**
- `pending` - Awaiting moderation
- `approved` - Published
- `rejected` - Hidden

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `product_id`
- INDEX on `user_id`
- INDEX on `status`

---

## 🔗 Relationships Summary

### One-to-Many Relationships

| Parent Table | Child Table | Relationship | On Delete |
|-------------|-------------|--------------|-----------|
| users | user_addresses | 1:N | CASCADE |
| users | cart_items | 1:N | CASCADE |
| users | wishlist_items | 1:N | CASCADE |
| users | orders | 1:N | SET NULL |
| users | product_reviews | 1:N | SET NULL |
| categories | products | 1:N | SET NULL |
| products | cart_items | 1:N | CASCADE |
| products | wishlist_items | 1:N | CASCADE |
| products | order_items | 1:N | SET NULL |
| products | product_reviews | 1:N | CASCADE |
| orders | order_items | 1:N | CASCADE |
| orders | order_timeline | 1:N | CASCADE |

**CASCADE**: Child records deleted when parent deleted  
**SET NULL**: Foreign key set to NULL when parent deleted

---

## 📈 Indexes

### Purpose of Indexes

Indexes improve query performance for frequently searched columns.

### Index List

```sql
-- Primary Keys (Automatic)
ALTER TABLE users ADD PRIMARY KEY (id);
ALTER TABLE categories ADD PRIMARY KEY (id);
-- ... (all tables)

-- Unique Indexes
CREATE UNIQUE INDEX idx_users_phone ON users(phone);
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_categories_name ON categories(name);
CREATE UNIQUE INDEX idx_offers_code ON offers(code);

-- Performance Indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_phone ON orders(phone);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_cart_user ON cart_items(user_id);
CREATE INDEX idx_wishlist_user ON wishlist_items(user_id);
CREATE INDEX idx_reviews_product ON product_reviews(product_id);
CREATE INDEX idx_reviews_user ON product_reviews(user_id);
CREATE INDEX idx_reviews_status ON product_reviews(status);
CREATE INDEX idx_offers_status ON offers(status);
CREATE INDEX idx_offers_dates ON offers(start_date, end_date);

-- Composite Unique Indexes
CREATE UNIQUE INDEX idx_cart_user_product ON cart_items(user_id, product_id);
CREATE UNIQUE INDEX idx_wishlist_user_product ON wishlist_items(user_id, product_id);
```

---

## ⚡ Triggers

### Auto-Update Timestamps

Automatically update `updated_at` column on row modification.

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all relevant tables
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ... (all tables with updated_at)
```

---

## ✅ Constraints

### CHECK Constraints

```sql
-- Users
CHECK (role IN ('customer', 'admin'))
CHECK (status IN ('active', 'inactive', 'suspended'))

-- Products
CHECK (status IN ('active', 'inactive', 'out_of_stock'))

-- Orders
CHECK (status IN ('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'))
CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded'))

-- Cart Items & Order Items
CHECK (quantity > 0)

-- Product Reviews
CHECK (rating >= 1 AND rating <= 5)
CHECK (status IN ('pending', 'approved', 'rejected'))

-- Offers
CHECK (discount_type IN ('percentage', 'fixed', 'free_delivery'))
CHECK (offer_type IN ('general', 'first_order', 'free_delivery', 'weekend_special'))
```

### UNIQUE Constraints

- users.phone
- users.email
- categories.name
- offers.code
- cart_items(user_id, product_id)
- wishlist_items(user_id, product_id)

---

## 📝 Sample Data

### Default Admin User

```sql
INSERT INTO users (name, phone, email, role, status) 
VALUES ('Admin', 'admin', 'admin@quickcart.com', 'admin', 'active');
```

### Sample Categories (13 total)

See schema.sql for complete list including:
- Fruits & Vegetables
- Dairy & Breakfast
- Beverages
- Snacks & Munchies
- etc.

### Sample Offers (3 default)

- **FIRST20** - 20% off first order
- **FREEDEL999** - Free delivery on ₹999+
- **WEEKEND100** - ₹100 off on ₹1500+

---

## 🔄 Data Flow

### Order Creation Flow

```
1. Check product stock in products table
2. Calculate pricing from products.price
3. Validate coupon in offers table
4. Create record in orders table
5. Create records in order_items table
6. Decrement stock in products table
7. Clear cart in cart_items table
8. Create initial entry in order_timeline table
```

### Price Integrity

**Server-side calculation ensures pricing integrity:**
- Product prices fetched from database (not client)
- Discounts validated against offers table
- Delivery fee calculated based on rules
- Historical prices preserved in order_items

---

## 📚 Related Documentation

- [API Documentation](BACKEND_01_API_DOCUMENTATION.md)
- [Backend Authentication](BACKEND_03_AUTHENTICATION_FLOW.md)
- [Installation Guide](01_INSTALLATION_GUIDE.md)
- [Architecture Overview](03_ARCHITECTURE_OVERVIEW.md)

---

**Database Schema Version**: 1.0.0  
**Last Updated**: February 2026  
**PostgreSQL Version**: 16+
