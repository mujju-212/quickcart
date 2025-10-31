#!/usr/bin/env python3
"""
Database setup and migration script for QuickCart
"""
import os
import sys
import psycopg2
import psycopg2.extras
from pathlib import Path

# Add parent directory to Python path
current_dir = Path(__file__).parent
parent_dir = current_dir.parent
sys.path.append(str(parent_dir))

from backend.config.config import Config

def create_database():
    """Create database if it doesn't exist"""
    try:
        # Connect to postgres database to create our database
        conn = psycopg2.connect(
            host=Config.DB_HOST,
            port=Config.DB_PORT,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            database='postgres'
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (Config.DB_NAME,))
        exists = cursor.fetchone()
        
        if not exists:
            cursor.execute(f"CREATE DATABASE {Config.DB_NAME}")
            print(f"✅ Database '{Config.DB_NAME}' created successfully")
        else:
            print(f"📦 Database '{Config.DB_NAME}' already exists")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        return False

def run_sql_file(filename, description=""):
    """Execute SQL file against the database"""
    try:
        sql_file_path = current_dir / filename
        
        if not sql_file_path.exists():
            print(f"❌ SQL file not found: {sql_file_path}")
            return False
        
        # Connect to our application database
        conn = psycopg2.connect(
            host=Config.DB_HOST,
            port=Config.DB_PORT,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            database=Config.DB_NAME
        )
        cursor = conn.cursor()
        
        # Read and execute SQL file
        with open(sql_file_path, 'r', encoding='utf-8') as f:
            sql_content = f.read()
        
        cursor.execute(sql_content)
        conn.commit()
        
        cursor.close()
        conn.close()
        
        print(f"✅ {description or filename} executed successfully")
        return True
        
    except Exception as e:
        print(f"❌ Error executing {filename}: {e}")
        return False

def test_database_connection():
    """Test database connection and basic queries"""
    try:
        conn = psycopg2.connect(Config.DATABASE_URL)
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        # Test basic queries
        cursor.execute("SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public'")
        table_count = cursor.fetchone()['table_count']
        
        cursor.execute("SELECT COUNT(*) as category_count FROM categories")
        category_count = cursor.fetchone()['category_count']
        
        cursor.execute("SELECT COUNT(*) as product_count FROM products")
        product_count = cursor.fetchone()['product_count']
        
        cursor.close()
        conn.close()
        
        print(f"📊 Database Statistics:")
        print(f"   - Tables: {table_count}")
        print(f"   - Categories: {category_count}")
        print(f"   - Products: {product_count}")
        
        return True
        
    except Exception as e:
        print(f"❌ Database connection test failed: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 Setting up QuickCart Database...")
    print(f"📍 Database: {Config.DB_HOST}:{Config.DB_PORT}/{Config.DB_NAME}")
    print("-" * 50)
    
    # Step 1: Create database
    if not create_database():
        print("❌ Failed to create database. Exiting.")
        sys.exit(1)
    
    # Step 2: Create schema
    if not run_sql_file("schema.sql", "Database schema"):
        print("❌ Failed to create database schema. Exiting.")
        sys.exit(1)
    
    # Step 3: Insert categories
    if not run_sql_file("insert_categories.sql", "Categories data"):
        print("❌ Failed to insert categories. Exiting.")
        sys.exit(1)
    
    # Step 4: Insert sample data
    if not run_sql_file("insert_products.sql", "Sample product data"):
        print("❌ Failed to insert sample data. Exiting.")
        sys.exit(1)
    
    # Step 5: Test database
    if not test_database_connection():
        print("❌ Database setup completed but connection test failed.")
        sys.exit(1)
    
    print("-" * 50)
    print("🎉 Database setup completed successfully!")
    print("💡 You can now start the Flask backend server:")
    print("   cd backend && python app.py")

if __name__ == "__main__":
    main()