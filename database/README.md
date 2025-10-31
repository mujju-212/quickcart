# Database Setup Guide

This directory contains the database schema and setup scripts for **QuickCart**.

## Prerequisites

1. **PostgreSQL** installed and running
2. **Python 3.7+** with required packages:
   ```bash
   pip install psycopg2-binary python-dotenv
   ```

## Database Configuration

Create a `.env` file in the backend directory with your database settings:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blink_basket
DB_USER=your_username
DB_PASSWORD=your_password

# Auto-generated DATABASE_URL (don't edit)
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/blink_basket
```

## Setup Instructions

### Option 1: Automated Setup (Recommended)

Run the setup script to automatically create the database and populate it:

```bash
cd database
python setup.py
```

This script will:
- Create the database if it doesn't exist
- Execute `schema.sql` to create all tables
- Execute `insert_products.sql` to populate sample data
- Test the database connection

### Option 2: Manual Setup

1. **Create Database:**
   ```sql
   CREATE DATABASE blink_basket;
   ```

2. **Create Tables:**
   ```bash
   psql -U your_username -d blink_basket -f schema.sql
   ```

3. **Insert Sample Data:**
   ```bash
   psql -U your_username -d blink_basket -f insert_products.sql
   ```

## Database Schema

### Core Tables

- **users** - User accounts and profiles
- **categories** - Product categories
- **products** - Product catalog
- **addresses** - User delivery addresses
- **cart_items** - Shopping cart contents
- **orders** - Order information
- **order_items** - Individual items in orders
- **order_timeline** - Order status tracking

### Key Features

- **Normalized Design** - Proper relationships and constraints
- **Indexes** - Optimized for common queries
- **Triggers** - Automatic timestamp updates
- **JSON Support** - Flexible data storage where needed

## Sample Data

The `insert_products.sql` file includes:
- **8 Categories** - Fruits & Vegetables, Dairy, Bakery, etc.
- **60+ Products** - Real product data with prices and descriptions
- **Proper Categorization** - Products linked to appropriate categories

## Testing the Database

After setup, you can test the database connection:

```python
from backend.utils.database import db

# Test connection
if db.test_connection():
    print("✅ Database connected successfully")
else:
    print("❌ Database connection failed")
```

## Common Issues

### Connection Refused
- Ensure PostgreSQL is running
- Check host/port settings in `.env`
- Verify user permissions

### Authentication Failed
- Double-check username/password in `.env`
- Ensure user has database creation privileges

### Import Errors
- Make sure you're in the correct directory
- Verify Python path includes the backend module

## Database Management

### Backup Database
```bash
pg_dump -U your_username blink_basket > backup.sql
```

### Restore Database
```bash
psql -U your_username blink_basket < backup.sql
```

### Reset Database
```bash
dropdb blink_basket
python setup.py
```

## Performance Tips

1. **Indexes** - The schema includes indexes on frequently queried columns
2. **Connection Pooling** - Use the database utility class for efficient connections
3. **Query Optimization** - Use EXPLAIN ANALYZE to optimize slow queries

## Migration Notes

This database replaces the previous local storage implementation:
- All product data migrated from React constants
- User sessions now persistent across browser restarts
- Cart contents saved in database
- Order history fully tracked
- Real-time inventory management

## Support

If you encounter issues:
1. Check the setup.py output for specific errors
2. Verify your PostgreSQL installation
3. Ensure all environment variables are set correctly
4. Test database connection independently