import psycopg2
from psycopg2.extras import RealDictCursor

# Connect to database (using correct credentials)
conn = psycopg2.connect('postgresql://postgres:mk0492@localhost:5432/blink_basket')
cur = conn.cursor(cursor_factory=RealDictCursor)

# Check current state
print("=" * 60)
print("CURRENT DATABASE STATE")
print("=" * 60)

# Get all products
cur.execute('SELECT id, name, category_id, stock FROM products ORDER BY name')
products = cur.fetchall()
print(f"\nTotal products: {len(products)}")

# Check for duplicates
names = {}
for p in products:
    if p['name'] not in names:
        names[p['name']] = []
    names[p['name']].append(p)

duplicates = {k: v for k, v in names.items() if len(v) > 1}
print(f"\nFound {len(duplicates)} duplicate product names:")
for name, items in list(duplicates.items())[:20]:
    ids = [item['id'] for item in items]
    stocks = [item['stock'] for item in items]
    print(f"  - {name}: {len(items)} times (IDs: {ids}, Stocks: {stocks})")

# Get categories
cur.execute('SELECT id, name FROM categories ORDER BY name')
categories = cur.fetchall()
print(f"\n\nCategories ({len(categories)}):")
for cat in categories:
    cur.execute('SELECT COUNT(*) FROM products WHERE category_id = %s', (cat['id'],))
    count = cur.fetchone()['count']
    print(f"  - {cat['name']} (ID: {cat['id']}): {count} products")

# Check products with 0 stock
cur.execute('SELECT COUNT(*) FROM products WHERE stock = 0')
out_of_stock_count = cur.fetchone()['count']
print(f"\n\nProducts with 0 stock: {out_of_stock_count}")

cur.close()
conn.close()

print("\n" + "=" * 60)
print("Analysis complete. Ready to clean and populate.")
print("=" * 60)
