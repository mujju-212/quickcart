#!/usr/bin/env python3
from utils.database import db

# Check categories
print("=== CATEGORIES ===")
categories = db.execute_query('SELECT id, name, image_url FROM categories LIMIT 5', fetch=True)
for cat in categories:
    cat_dict = dict(cat)
    print(f"ID: {cat_dict['id']}, Name: {cat_dict['name']}")
    print(f"Image URL: {cat_dict['image_url']}")
    print("-" * 50)

# Check products  
print("\n=== PRODUCTS ===")
products = db.execute_query('SELECT id, name, image_url FROM products LIMIT 3', fetch=True)
for prod in products:
    prod_dict = dict(prod)
    print(f"ID: {prod_dict['id']}, Name: {prod_dict['name']}")
    print(f"Image URL: {prod_dict['image_url']}")
    print("-" * 50)