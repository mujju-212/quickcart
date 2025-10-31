"""
Seed sample offers and banners with images from Unsplash
"""
import sys
import os

# Add parent directory to path
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)
sys.path.insert(0, os.path.join(parent_dir, 'backend'))

from utils.database import db
from datetime import datetime, timedelta

def seed_offers():
    """Add sample promotional offers"""
    print("🎁 Seeding offers...")
    
    # Clear existing offers
    db.execute_query("DELETE FROM offers", fetch=False)
    
    offers = [
        {
            'title': 'Summer Sale - 30% OFF',
            'description': 'Get 30% off on all fruits and vegetables',
            'code': 'SUMMER30',
            'discount_type': 'percentage',
            'discount_value': 30,
            'min_order_value': 500,
            'max_discount_amount': 200,
            'image_url': 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400',
            'status': 'active',
            'start_date': datetime.now().date(),
            'end_date': (datetime.now() + timedelta(days=30)).date(),
            'usage_limit': 1000,
            'used_count': 0,
            'applicable_categories': 'Fruits,Vegetables',
            'offer_type': 'general'
        },
        {
            'title': 'First Order - Flat ₹100 OFF',
            'description': 'Flat ₹100 discount on your first order above ₹500',
            'code': 'FIRST100',
            'discount_type': 'fixed',
            'discount_value': 100,
            'min_order_value': 500,
            'max_discount_amount': 100,
            'image_url': 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400',
            'status': 'active',
            'start_date': datetime.now().date(),
            'end_date': (datetime.now() + timedelta(days=90)).date(),
            'usage_limit': 500,
            'used_count': 0,
            'applicable_categories': 'All',
            'offer_type': 'first_order'
        },
        {
            'title': 'Weekend Special - 20% OFF',
            'description': 'Weekend special discount on dairy products',
            'code': 'WEEKEND20',
            'discount_type': 'percentage',
            'discount_value': 20,
            'min_order_value': 300,
            'max_discount_amount': 150,
            'image_url': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
            'status': 'active',
            'start_date': datetime.now().date(),
            'end_date': (datetime.now() + timedelta(days=7)).date(),
            'usage_limit': 200,
            'used_count': 0,
            'applicable_categories': 'Dairy',
            'offer_type': 'weekend_special'
        },
        {
            'title': 'Free Delivery - Orders Above ₹1000',
            'description': 'Get free delivery on all orders above ₹1000',
            'code': 'FREEDEL1000',
            'discount_type': 'free_delivery',
            'discount_value': 0,
            'min_order_value': 1000,
            'max_discount_amount': 50,
            'image_url': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
            'status': 'active',
            'start_date': datetime.now().date(),
            'end_date': (datetime.now() + timedelta(days=60)).date(),
            'usage_limit': 300,
            'used_count': 0,
            'applicable_categories': 'All',
            'offer_type': 'free_delivery'
        },
        {
            'title': 'Organic Premium - 25% OFF',
            'description': 'Premium discount on all organic products',
            'code': 'ORGANIC25',
            'discount_type': 'percentage',
            'discount_value': 25,
            'min_order_value': 600,
            'max_discount_amount': 250,
            'image_url': 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400',
            'status': 'active',
            'start_date': datetime.now().date(),
            'end_date': (datetime.now() + timedelta(days=45)).date(),
            'usage_limit': 150,
            'used_count': 0,
            'applicable_categories': 'Vegetables,Fruits',
            'offer_type': 'general'
        }
    ]
    
    query = """
        INSERT INTO offers (
            title, description, code, discount_type, discount_value,
            min_order_value, max_discount_amount, image_url, status,
            start_date, end_date, usage_limit, used_count,
            applicable_categories, offer_type
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    
    for offer in offers:
        params = (
            offer['title'], offer['description'], offer['code'],
            offer['discount_type'], offer['discount_value'],
            offer['min_order_value'], offer['max_discount_amount'],
            offer['image_url'], offer['status'], offer['start_date'],
            offer['end_date'], offer['usage_limit'], offer['used_count'],
            offer['applicable_categories'], offer['offer_type']
        )
        db.execute_query(query, params, fetch=False)
        print(f"✅ Added offer: {offer['title']}")
    
    print(f"✅ Seeded {len(offers)} offers\n")

def seed_banners():
    """Add sample promotional banners"""
    print("🎨 Seeding banners...")
    
    # Clear existing banners
    db.execute_query("DELETE FROM banners", fetch=False)
    
    banners = [
        {
            'title': 'Fresh Fruits Daily',
            'subtitle': 'Get the freshest fruits delivered to your doorstep',
            'image_url': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800',
            'link_url': '/products?category=Fruits',
            'status': 'active',
            'display_order': 1,
            'start_date': datetime.now().date(),
            'end_date': (datetime.now() + timedelta(days=30)).date()
        },
        {
            'title': 'Organic Vegetables',
            'subtitle': '100% Organic - Farm to Table in 24 hours',
            'image_url': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
            'link_url': '/products?category=Vegetables',
            'status': 'active',
            'display_order': 2,
            'start_date': datetime.now().date(),
            'end_date': (datetime.now() + timedelta(days=30)).date()
        },
        {
            'title': 'Fresh Dairy Products',
            'subtitle': 'Pure milk, butter, cheese and more',
            'image_url': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800',
            'link_url': '/products?category=Dairy',
            'status': 'active',
            'display_order': 3,
            'start_date': datetime.now().date(),
            'end_date': (datetime.now() + timedelta(days=30)).date()
        },
        {
            'title': 'Summer Special Sale',
            'subtitle': 'Up to 30% OFF on all items',
            'image_url': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
            'link_url': '/offers',
            'status': 'active',
            'display_order': 4,
            'start_date': datetime.now().date(),
            'end_date': (datetime.now() + timedelta(days=15)).date()
        }
    ]
    
    query = """
        INSERT INTO banners (
            title, subtitle, image_url, link_url, status,
            display_order, start_date, end_date
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    
    for banner in banners:
        params = (
            banner['title'], banner['subtitle'], banner['image_url'],
            banner['link_url'], banner['status'], banner['display_order'],
            banner['start_date'], banner['end_date']
        )
        db.execute_query(query, params, fetch=False)
        print(f"✅ Added banner: {banner['title']}")
    
    print(f"✅ Seeded {len(banners)} banners\n")

if __name__ == '__main__':
    try:
        print("🚀 Starting to seed offers and banners...")
        print("=" * 60)
        seed_offers()
        seed_banners()
        print("=" * 60)
        print("✅ Successfully seeded all offers and banners!")
        
        # Verify counts
        offer_count = db.execute_query("SELECT COUNT(*) as count FROM offers", fetch=True)[0]['count']
        banner_count = db.execute_query("SELECT COUNT(*) as count FROM banners", fetch=True)[0]['count']
        print(f"\n📊 Final counts:")
        print(f"   Offers: {offer_count}")
        print(f"   Banners: {banner_count}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        raise
