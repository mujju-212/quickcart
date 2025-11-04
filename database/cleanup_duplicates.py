import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

# Connect to database
conn = psycopg2.connect('postgresql://postgres:mk0492@localhost:5432/blink_basket')
cur = conn.cursor(cursor_factory=RealDictCursor)

print("=" * 60)
print("STEP 1: REMOVING DUPLICATE PRODUCTS")
print("=" * 60)

# Get all products grouped by name
cur.execute('''
    SELECT name, array_agg(id ORDER BY id) as ids
    FROM products
    GROUP BY name
    HAVING COUNT(*) > 1
''')
duplicates = cur.fetchall()

print(f"\nFound {len(duplicates)} duplicate product names")

# Keep the first ID, delete the rest
deleted_count = 0
for dup in duplicates:
    ids_to_delete = dup['ids'][1:]  # Keep first, delete rest
    print(f"  Removing duplicates of '{dup['name']}': IDs {ids_to_delete}")
    cur.execute('DELETE FROM products WHERE id = ANY(%s)', (ids_to_delete,))
    deleted_count += len(ids_to_delete)

conn.commit()
print(f"\n✅ Removed {deleted_count} duplicate products")

print("\n" + "=" * 60)
print("STEP 2: REMOVING TEST CATEGORIES")
print("=" * 60)

# Remove test categories
test_categories = ['Test Category', 'mk Category', 't2', 'Image Test%', 'Test Category%']
for cat_pattern in test_categories:
    if '%' in cat_pattern:
        cur.execute('DELETE FROM categories WHERE name LIKE %s RETURNING name', (cat_pattern,))
    else:
        cur.execute('DELETE FROM categories WHERE name = %s RETURNING name', (cat_pattern,))
    deleted = cur.fetchall()
    for d in deleted:
        print(f"  Removed category: {d['name']}")

conn.commit()
print(f"\n✅ Removed test categories")

print("\n" + "=" * 60)
print("STEP 3: GETTING CURRENT CATEGORIES")
print("=" * 60)

cur.execute('SELECT id, name FROM categories ORDER BY name')
categories = cur.fetchall()
print(f"\nRemaining categories: {len(categories)}")
for cat in categories:
    cur.execute('SELECT COUNT(*) FROM products WHERE category_id = %s', (cat['id'],))
    count = cur.fetchone()['count']
    print(f"  - {cat['name']} (ID: {cat['id']}): {count} products")

conn.commit()
cur.close()
conn.close()

print("\n" + "=" * 60)
print("CLEANUP COMPLETE!")
print("=" * 60)
print("\nNext: Run populate_products.py to add 30 products per category")
