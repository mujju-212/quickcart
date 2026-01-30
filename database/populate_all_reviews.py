import psycopg2
from datetime import datetime, timedelta
import random

# Database connection
def get_db_connection():
    return psycopg2.connect(
        dbname="blink_basket",
        user="postgres",
        password="mk0492",
        host="localhost",
        port="5432"
    )

# Fetch all data
def fetch_all_data():
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Fetch categories
    cur.execute("SELECT id, name FROM categories ORDER BY id")
    categories = cur.fetchall()
    
    # Fetch products by category
    cur.execute("""
        SELECT p.id, p.name, p.category_id, c.name as category_name 
        FROM products p 
        JOIN categories c ON p.category_id = c.id 
        ORDER BY c.id, p.id
    """)
    products = cur.fetchall()
    
    # Fetch users (exclude admin)
    cur.execute("SELECT id, name, email FROM users WHERE role = 'customer' ORDER BY id")
    users = cur.fetchall()
    
    cur.close()
    conn.close()
    
    return categories, products, users

# Product-specific review templates
REVIEW_TEMPLATES = {
    'Dairy': [
        ("Fresh and creamy! Delivered right on time. My family loves it.", 5),
        ("Good quality dairy product. Packaging was intact.", 4),
        ("Very fresh, no complaints. Will order again.", 5),
        ("Nice product but a bit expensive compared to local stores.", 3),
        ("Excellent quality! Best dairy products I've ordered online.", 5),
        ("Fresh and good taste. Delivered before expiry date.", 4),
        ("Average quality. Expected better for the price.", 3),
        ("Superb! My kids love it. Regular customer now.", 5),
    ],
    'Snacks': [
        ("Crispy and tasty! Perfect for evening snacks.", 5),
        ("Good flavor, kids enjoyed it. Fast delivery too.", 4),
        ("Bit too salty for my taste but okay overall.", 3),
        ("Loved it! Best snack I've had in a while.", 5),
        ("Fresh and crunchy. Packaging was good.", 4),
        ("Not bad, but I've had better. It's okay for the price.", 3),
        ("Amazing taste! Highly recommend this.", 5),
        ("Good snack option. Will buy again.", 4),
    ],
    'Beverages': [
        ("Refreshing taste! Great for hot days.", 5),
        ("Good quality beverage. Worth the price.", 4),
        ("Too sweet for my liking, but kids loved it.", 3),
        ("Perfect! Exactly what I was looking for.", 5),
        ("Nice flavor, good packaging. Quick delivery.", 4),
        ("Average taste. Expected more variety.", 3),
        ("Excellent! Best beverage brand. Regular buyer.", 5),
        ("Good product. Satisfactory experience.", 4),
    ],
    'Fruits': [
        ("Very fresh fruits! Quality is top-notch.", 5),
        ("Good quality but some pieces were overripe.", 3),
        ("Excellent freshness. Delivered in perfect condition.", 5),
        ("Fresh and sweet. Worth every penny.", 5),
        ("Good quality overall. Minor bruises on some pieces.", 4),
        ("Not as fresh as I expected. Okay for the price.", 3),
        ("Amazing quality! Best online fruit purchase.", 5),
        ("Fresh and delicious. Will order again.", 4),
    ],
    'Vegetables': [
        ("Fresh vegetables! Much better than local market.", 5),
        ("Good quality veggies. Lasted longer than expected.", 4),
        ("Some pieces were not fresh. Mixed experience.", 3),
        ("Excellent quality! Farm fresh indeed.", 5),
        ("Very fresh, clean and well-packaged.", 5),
        ("Average quality. Some were starting to wilt.", 3),
        ("Superb quality! Regular customer now.", 5),
        ("Good vegetables. Decent quality for online purchase.", 4),
    ],
    'Bakery': [
        ("Soft and fresh! Tastes homemade.", 5),
        ("Good bakery product. Fresh and tasty.", 4),
        ("A bit dry but okay taste. Could be better.", 3),
        ("Delicious! Best bakery items I've ordered online.", 5),
        ("Fresh and soft. Delivered warm. Amazing!", 5),
        ("Good product but arrived slightly crushed.", 3),
        ("Excellent taste! Kids finished it in no time.", 5),
        ("Nice bakery product. Will order again.", 4),
    ],
    'Personal Care': [
        ("Great product! Works as described.", 5),
        ("Good quality personal care item. Satisfied.", 4),
        ("Average product. Nothing special.", 3),
        ("Excellent! Using it regularly now.", 5),
        ("Good quality, genuine product. Fast delivery.", 4),
        ("Not suitable for my skin type but product is okay.", 3),
        ("Love it! Best purchase. Highly recommend.", 5),
        ("Nice product. Does what it claims.", 4),
    ],
    'Household': [
        ("Very useful household item. Good quality.", 5),
        ("Works well. Good value for money.", 4),
        ("Average quality. Does the job though.", 3),
        ("Excellent quality! Durable and effective.", 5),
        ("Good product. Using it daily now.", 4),
        ("Not as effective as I thought. Okay-ish.", 3),
        ("Amazing! Solved my household problem perfectly.", 5),
        ("Nice product. Satisfied with purchase.", 4),
    ],
    'Default': [
        ("Good product! Happy with my purchase.", 4),
        ("Nice quality. Value for money.", 4),
        ("Satisfied with the product. Delivered on time.", 4),
        ("Excellent product! Exceeded expectations.", 5),
        ("Good quality overall. Will buy again.", 4),
        ("Average product. Nothing extraordinary.", 3),
        ("Very good! Recommend to others.", 5),
        ("Decent product. Meets expectations.", 4),
    ]
}

# Get appropriate reviews for a product category
def get_reviews_for_category(category_name):
    for key in REVIEW_TEMPLATES:
        if key.lower() in category_name.lower():
            return REVIEW_TEMPLATES[key]
    return REVIEW_TEMPLATES['Default']

# Insert reviews
def insert_reviews(products, users):
    conn = get_db_connection()
    cur = conn.cursor()
    
    total_reviews = 0
    reviews_by_category = {}
    
    for product_id, product_name, category_id, category_name in products:
        # Get appropriate review templates
        review_templates = get_reviews_for_category(category_name)
        
        # Add 2-4 reviews per product
        num_reviews = random.randint(2, 4)
        selected_users = random.sample(users, min(num_reviews, len(users)))
        selected_reviews = random.sample(review_templates, num_reviews)
        
        if category_name not in reviews_by_category:
            reviews_by_category[category_name] = 0
        
        for i, (user_id, user_name, user_email) in enumerate(selected_users):
            if i >= len(selected_reviews):
                break
                
            comment, rating = selected_reviews[i]
            
            # Random date in the last 30 days
            days_ago = random.randint(1, 30)
            created_at = datetime.now() - timedelta(days=days_ago)
            
            # Check if user bought this product (verified purchase)
            cur.execute("""
                SELECT COUNT(*) FROM order_items oi
                JOIN orders o ON oi.order_id = o.id
                WHERE o.user_id = %s AND oi.product_id = %s AND o.status = 'delivered'
            """, (user_id, product_id))
            
            verified_purchase = cur.fetchone()[0] > 0
            
            try:
                # Check if this user already reviewed this product
                cur.execute("""
                    SELECT COUNT(*) FROM product_reviews 
                    WHERE product_id = %s AND user_id = %s
                """, (product_id, user_id))
                
                if cur.fetchone()[0] > 0:
                    # Skip if already reviewed
                    continue
                
                cur.execute("""
                    INSERT INTO product_reviews 
                    (product_id, user_id, user_name, rating, comment, verified_purchase, status, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, (product_id, user_id, user_name, rating, comment, verified_purchase, 'approved', created_at))
                
                total_reviews += 1
                reviews_by_category[category_name] += 1
                
            except Exception as e:
                print(f"Error adding review for product {product_name}: {e}")
                conn.rollback()
                continue
    
    conn.commit()
    cur.close()
    conn.close()
    
    return total_reviews, reviews_by_category

# Main execution
if __name__ == "__main__":
    print("=" * 70)
    print("QUICKCART - PRODUCT REVIEWS POPULATION SCRIPT")
    print("=" * 70)
    
    # Fetch data
    print("\n📊 Fetching database information...\n")
    categories, products, users = fetch_all_data()
    
    # Display summary
    print(f"Categories found: {len(categories)}")
    for cat_id, cat_name in categories:
        product_count = len([p for p in products if p[2] == cat_id])
        print(f"  • {cat_name}: {product_count} products")
    
    print(f"\nUsers found: {len(users)} customers")
    print(f"Total products: {len(products)}")
    
    # Confirm
    print("\n" + "=" * 70)
    response = input("Ready to populate reviews for all products? (yes/no): ")
    
    if response.lower() in ['yes', 'y']:
        print("\n🔄 Inserting reviews into database...\n")
        total, by_category = insert_reviews(products, users)
        
        print("=" * 70)
        print(f"✅ SUCCESS! Added {total} reviews across all products")
        print("=" * 70)
        print("\n📈 Reviews by Category:")
        for category, count in sorted(by_category.items()):
            print(f"  • {category}: {count} reviews")
        print("\n✅ All reviews have been added successfully!")
        print("=" * 70)
    else:
        print("\n❌ Operation cancelled.")
