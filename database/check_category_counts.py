import psycopg2
from psycopg2.extras import RealDictCursor

conn = psycopg2.connect('postgresql://postgres:mk0492@localhost:5432/blink_basket')
cur = conn.cursor(cursor_factory=RealDictCursor)

print("=" * 70)
print("CATEGORIES WITH PRODUCT COUNTS")
print("=" * 70)

cur.execute('''
    SELECT c.name, COUNT(p.id) as product_count
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id
    WHERE c.status = 'active' AND p.status = 'active'
    GROUP BY c.id, c.name
    ORDER BY product_count DESC
''')

categories = cur.fetchall()

for cat in categories:
    status = "✅" if cat['product_count'] >= 30 else "⚠️ "
    print(f"{status} {cat['name']:35} {cat['product_count']:3} products")

print("\n" + "=" * 70)
print(f"Total categories: {len(categories)}")
need_more = [cat for cat in categories if cat['product_count'] < 30]
print(f"Categories needing more products: {len(need_more)}")
if need_more:
    print("\nCategories with < 30 products:")
    for cat in need_more:
        needed = 30 - cat['product_count']
        print(f"  - {cat['name']}: {cat['product_count']} products (need {needed} more)")
print("=" * 70)

cur.close()
conn.close()
