#!/usr/bin/env python3
"""
Database Reset Script - Drop and recreate the database
"""
import os
import sys
import psycopg2
from psycopg2 import sql
from pathlib import Path

# Add parent directory to Python path
current_dir = Path(__file__).parent
parent_dir = current_dir.parent
sys.path.append(str(parent_dir))

from backend.config.config import Config

def reset_database():
    """Drop and recreate the database"""
    try:
        # Connect to PostgreSQL without specifying database
        conn = psycopg2.connect(
            host=Config.DB_HOST,
            port=Config.DB_PORT,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            database='postgres'  # Connect to default postgres database
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        print(f"🗑️  Dropping database: {Config.DB_NAME}")
        # Terminate connections to the database first
        cursor.execute("""
            SELECT pg_terminate_backend(pg_stat_activity.pid)
            FROM pg_stat_activity
            WHERE pg_stat_activity.datname = %s
            AND pid <> pg_backend_pid()
        """, (Config.DB_NAME,))
        
        # Drop database if exists
        cursor.execute(sql.SQL("DROP DATABASE IF EXISTS {}").format(sql.Identifier(Config.DB_NAME)))
        
        # Create fresh database
        print(f"🆕 Creating database: {Config.DB_NAME}")
        cursor.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(Config.DB_NAME)))
        
        cursor.close()
        conn.close()
        
        print("✅ Database reset successfully")
        return True
        
    except Exception as e:
        print(f"❌ Error resetting database: {str(e)}")
        return False

if __name__ == '__main__':
    if reset_database():
        print("\n🚀 Now running setup.py to create tables and data...")
        os.system('python setup.py')
    else:
        print("❌ Database reset failed")