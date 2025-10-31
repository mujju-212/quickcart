import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))
from utils.database import db

banners = db.execute_query('SELECT id, title, image_url FROM banners ORDER BY display_order', fetch=True)
print("\nBanner Image URLs:")
print("=" * 80)
for b in banners:
    print(f"{b['id']}. {b['title']}")
    print(f"   {b['image_url']}")
    print()
