"""
Google Image Extractor Tool for QuickCart
==========================================
A reusable tool to extract product images from Google Image Search and update the database.

Usage:
------
from backend.image_extractor_tool import ImageExtractor

# Initialize extractor
extractor = ImageExtractor(
    dbname="blink_basket",
    user="postgres",
    password="mk0492",
    host="localhost",
    port="5432"
)

# Extract images for products
products = [
    (product_id, "Product Name", [
        "https://www.google.com/search?tbm=isch&q=search+term+1",
        "https://www.google.com/search?tbm=isch&q=search+term+2",
        "https://www.google.com/search?tbm=isch&q=search+term+3"
    ]),
    # ... more products
]

result = extractor.extract_and_update(products)
print(f"Success: {result['success']}/{result['total']}")
"""

import psycopg2
import requests
from bs4 import BeautifulSoup
import json
import time
import re
from typing import List, Tuple, Dict


class ImageExtractor:
    """Extract product images from Google Image Search and update database"""
    
    def __init__(self, dbname: str, user: str, password: str, host: str = "localhost", port: str = "5432"):
        """
        Initialize the Image Extractor
        
        Args:
            dbname: PostgreSQL database name
            user: Database username
            password: Database password
            host: Database host (default: localhost)
            port: Database port (default: 5432)
        """
        self.db_config = {
            "dbname": dbname,
            "user": user,
            "password": password,
            "host": host,
            "port": port
        }
        self.conn = None
        self.cursor = None
        
    def connect(self):
        """Establish database connection"""
        try:
            self.conn = psycopg2.connect(**self.db_config)
            self.cursor = self.conn.cursor()
            return True
        except Exception as e:
            print(f"❌ Database connection failed: {e}")
            return False
    
    def disconnect(self):
        """Close database connection"""
        if self.cursor:
            self.cursor.close()
        if self.conn:
            self.conn.close()
    
    def extract_images_from_google_search(self, search_url: str, max_images: int = 4) -> List[str]:
        """
        Extract image URLs from a Google Image Search page
        
        Args:
            search_url: Google Image Search URL
            max_images: Maximum number of images to extract (default: 4)
            
        Returns:
            List of image URLs
        """
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
            response = requests.get(search_url, headers=headers, timeout=15)
            response.raise_for_status()
            
            image_urls = []
            
            # Method 1: Extract from JavaScript arrays in page source
            scripts = re.findall(r'\["(https://[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)",\d+,\d+\]', response.text)
            for url in scripts:
                if 'gstatic.com' not in url and 'google.com/images' not in url:
                    clean_url = url.replace('\\u003d', '=').replace('\\u0026', '&')
                    if clean_url not in image_urls:
                        image_urls.append(clean_url)
            
            # Method 2: Extract from img tags (fallback)
            soup = BeautifulSoup(response.text, 'html.parser')
            img_tags = soup.find_all('img')
            for img in img_tags:
                src = img.get('src', '')
                if src.startswith('http') and any(ext in src for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                    if 'gstatic.com' not in src and 'google.com/images' not in src:
                        if src not in image_urls:
                            image_urls.append(src)
            
            return image_urls[:max_images]
            
        except Exception as e:
            print(f"    ⚠️ Error extracting from {search_url[:50]}...: {str(e)[:50]}")
            return []
    
    def extract_images_for_product(self, search_urls: List[str], required_count: int = 4) -> List[str]:
        """
        Extract images from multiple search URLs for a single product
        
        Args:
            search_urls: List of Google Image Search URLs
            required_count: Number of images required (default: 4)
            
        Returns:
            List of exactly 'required_count' unique image URLs
        """
        all_images = []
        
        for search_url in search_urls:
            search_term = search_url.split('q=')[-1].replace('+', ' ')
            print(f"  🔍 {search_term[:50]}")
            
            images = self.extract_images_from_google_search(search_url)
            all_images.extend(images)
            print(f"  {'✓' if images else '❌'} Found: {len(images)}")
            
            time.sleep(2)  # Be respectful to Google servers
        
        # Get unique images
        unique_images = list(dict.fromkeys(all_images))
        
        # If we have fewer than required, duplicate the first image
        if len(unique_images) > 0:
            while len(unique_images) < required_count:
                unique_images.append(unique_images[0])
        
        return unique_images[:required_count]
    
    def update_product_images(self, product_id: int, image_urls: List[str]) -> bool:
        """
        Update product images in the database
        
        Args:
            product_id: Product ID
            image_urls: List of image URLs
            
        Returns:
            True if successful, False otherwise
        """
        try:
            json_urls = json.dumps(image_urls)
            self.cursor.execute(
                "UPDATE products SET image_url = %s WHERE id = %s",
                (json_urls, product_id)
            )
            self.conn.commit()
            return True
        except Exception as e:
            print(f"    ❌ Database update failed: {e}")
            return False
    
    def extract_and_update(self, products: List[Tuple[int, str, List[str]]], 
                          category_name: str = "Products") -> Dict[str, int]:
        """
        Extract images for multiple products and update database
        
        Args:
            products: List of tuples (product_id, product_name, [search_urls])
            category_name: Name of the category for display (default: "Products")
            
        Returns:
            Dictionary with 'success', 'failed', and 'total' counts
        """
        if not self.connect():
            return {"success": 0, "failed": len(products), "total": len(products)}
        
        print(f"\n🎨 {category_name.upper()} IMAGE EXTRACTION")
        print("=" * 100)
        print(f"Total Products: {len(products)}")
        print("=" * 100)
        
        success_count = 0
        failed_count = 0
        
        for idx, (product_id, product_name, search_urls) in enumerate(products, 1):
            print(f"\n[{idx}/{len(products)}] {product_name} (ID: {product_id})")
            
            # Extract images
            image_urls = self.extract_images_for_product(search_urls)
            
            if len(image_urls) > 0:
                # Update database
                if self.update_product_images(product_id, image_urls):
                    print(f"  ✅ Updated with {len(image_urls)} images")
                    success_count += 1
                else:
                    print(f"  ❌ Database update failed")
                    failed_count += 1
            else:
                print(f"  ❌ No images found")
                failed_count += 1
        
        print("\n" + "=" * 100)
        print(f"✅ SUCCESS: {success_count}/{len(products)} products updated")
        print(f"⚠️  FAILED: {failed_count}/{len(products)} products")
        if failed_count == 0:
            print("🎉 ALL PRODUCTS COMPLETED!")
        print("=" * 100)
        
        self.disconnect()
        
        return {
            "success": success_count,
            "failed": failed_count,
            "total": len(products)
        }


# Example usage
if __name__ == "__main__":
    # Example: Extract images for a few products
    extractor = ImageExtractor(
        dbname="blink_basket",
        user="postgres",
        password="mk0492"
    )
    
    # Sample product data
    sample_products = [
        (1, "Sample Product 1", [
            "https://www.google.com/search?tbm=isch&q=product+name+1",
            "https://www.google.com/search?tbm=isch&q=product+brand+1"
        ]),
        (2, "Sample Product 2", [
            "https://www.google.com/search?tbm=isch&q=product+name+2",
            "https://www.google.com/search?tbm=isch&q=product+brand+2"
        ])
    ]
    
    # Run extraction
    result = extractor.extract_and_update(sample_products, category_name="Sample Category")
    
    print(f"\n📊 Final Results:")
    print(f"   Success: {result['success']}")
    print(f"   Failed: {result['failed']}")
    print(f"   Total: {result['total']}")
