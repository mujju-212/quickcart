#!/usr/bin/env python3
"""
Quick script to insert sample data into the database
"""
import psycopg2
import sys
from pathlib import Path

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'port': '5432',
    'database': 'blink_basket',
    'user': 'postgres',
    'password': 'mk0492'
}

def run_sql_file(cursor, filename):
    """Execute SQL file"""
    sql_file = Path(__file__).parent / filename
    
    if not sql_file.exists():
        print(f"❌ File not found: {filename}")
        return False
    
    with open(sql_file, 'r', encoding='utf-8') as f:
        sql = f.read()
    
    try:
        cursor.execute(sql)
        print(f"✅ Executed: {filename}")
        return True
    except Exception as e:
        print(f"❌ Error in {filename}: {e}")
        return False

def main():
    try:
        # Connect to database
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        print("✅ Connected to database")
        
        # Insert categories
        if run_sql_file(cursor, 'insert_categories.sql'):
            conn.commit()
        
        # Insert products
        if run_sql_file(cursor, 'insert_products.sql'):
            conn.commit()
        
        # Check counts
        cursor.execute("SELECT COUNT(*) FROM categories")
        cat_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM products")
        prod_count = cursor.fetchone()[0]
        
        print(f"\n📊 Database Status:")
        print(f"   Categories: {cat_count}")
        print(f"   Products: {prod_count}")
        
        cursor.close()
        conn.close()
        print("\n✅ Data insertion completed!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
