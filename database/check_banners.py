import sys
import os
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)
sys.path.insert(0, os.path.join(parent_dir, 'backend'))

from utils.database import db
from datetime import datetime

print("=" * 60)
print("ALL BANNERS IN DATABASE")
print("=" * 60)

all_banners = db.execute_query('SELECT * FROM banners ORDER BY display_order', fetch=True)
for banner in all_banners:
    print(f"\nID: {banner['id']}")
    print(f"Title: {banner['title']}")
    print(f"Status: {banner['status']}")
    print(f"Start Date: {banner['start_date']}")
    print(f"End Date: {banner['end_date']}")
    print(f"Display Order: {banner['display_order']}")
    
print("\n" + "=" * 60)
print("ACTIVE BANNERS (What users see)")
print("=" * 60)

today = datetime.now().date()
active_query = """
    SELECT * FROM banners 
    WHERE status = 'active'
    AND (start_date IS NULL OR start_date <= %s)
    AND (end_date IS NULL OR end_date >= %s)
    ORDER BY display_order, id
"""
active_banners = db.execute_query(active_query, (today, today), fetch=True)
print(f"\nFound {len(active_banners)} active banners")
for banner in active_banners:
    print(f"  - {banner['title']}")
