"""
Migration Script: Update Rate Limit Tables for Email Support
Drops and recreates otp_rate_limits table with identifier field instead of phone
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.utils.database import db
from backend.utils.rate_limiter import RateLimiter

def migrate():
    """Run migration to update rate limit tables"""
    print("🔄 Starting migration: Update rate limit tables for email support")
    
    try:
        # Drop existing table
        print("📦 Dropping old otp_rate_limits table...")
        drop_query = "DROP TABLE IF EXISTS otp_rate_limits CASCADE;"
        db.execute_query(drop_query)
        print("✅ Old table dropped")
        
        # Recreate with new schema
        print("🆕 Creating new otp_rate_limits table with identifier field...")
        RateLimiter.init_rate_limit_tables()
        print("✅ New table created")
        
        print("\n🎉 Migration completed successfully!")
        print("📧 Rate limiter now supports both phone numbers and email addresses")
        
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        return False
    
    return True

if __name__ == "__main__":
    success = migrate()
    sys.exit(0 if success else 1)
