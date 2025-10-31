import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
    'database': os.getenv('DB_NAME', 'blink_basket'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'mk0492')
}

def create_offers_table():
    """Create the offers table and insert default data"""
    try:
        # Connect to database
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        print("🎁 Creating offers table...")
        
        # Create offers table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS offers (
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
            )
        """)
        
        # Create indexes
        cur.execute("CREATE INDEX IF NOT EXISTS idx_offers_code ON offers(code)")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status)")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_offers_dates ON offers(start_date, end_date)")
        
        # Create trigger for updated_at
        cur.execute("""
            DROP TRIGGER IF EXISTS update_offers_updated_at ON offers;
            CREATE TRIGGER update_offers_updated_at 
            BEFORE UPDATE ON offers 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column()
        """)
        
        # Check if offers already exist
        cur.execute("SELECT COUNT(*) FROM offers")
        count = cur.fetchone()[0]
        
        if count == 0:
            print("📝 Inserting default offers...")
            cur.execute("""
                INSERT INTO offers (title, description, code, discount_type, discount_value, min_order_value, max_discount_amount, image_url, status, start_date, end_date, offer_type) VALUES
                ('First Order', 'Use code: FIRST20', 'FIRST20', 'percentage', 20, 299, 100, 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=200&fit=crop&q=80', 'active', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'first_order'),
                ('Free Delivery', 'No delivery charges', 'FREEDEL999', 'free_delivery', 0, 999, 40, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop&q=80', 'active', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'free_delivery'),
                ('Weekend Special', 'On orders above ₹1500', 'WEEKEND100', 'fixed', 100, 1500, 100, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop&q=80', 'active', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'weekend_special')
            """)
        else:
            print(f"ℹ️  Offers table already has {count} records")
        
        conn.commit()
        print("✅ Offers table created successfully!")
        
        # Verify data
        cur.execute("SELECT id, title, code FROM offers")
        offers = cur.fetchall()
        print(f"\n📊 Current offers in database:")
        for offer in offers:
            print(f"   - {offer[1]} (Code: {offer[2]})")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    return True

if __name__ == '__main__':
    create_offers_table()
