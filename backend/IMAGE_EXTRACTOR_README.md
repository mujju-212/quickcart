# Google Image Extractor Tool

A reusable Python tool for extracting product images from Google Image Search and updating the QuickCart database.

## Features

- ✅ Extract real product images from Google Image Search
- ✅ Automatic duplicate detection and filtering
- ✅ Database integration with PostgreSQL
- ✅ Progress tracking and detailed logging
- ✅ Error handling and retry logic
- ✅ Configurable image count per product

## Installation

Required dependencies:
```bash
pip install psycopg2 requests beautifulsoup4
```

## Usage

### Basic Example

```python
from backend.image_extractor_tool import ImageExtractor

# Initialize the extractor
extractor = ImageExtractor(
    dbname="blink_basket",
    user="postgres",
    password="mk0492",
    host="localhost",
    port="5432"
)

# Define products with Google Image Search URLs
products = [
    (product_id, "Product Name", [
        "https://www.google.com/search?tbm=isch&q=search+term+1",
        "https://www.google.com/search?tbm=isch&q=search+term+2",
        "https://www.google.com/search?tbm=isch&q=search+term+3"
    ]),
    # Add more products...
]

# Extract and update
result = extractor.extract_and_update(products, category_name="Beverages")

# Check results
print(f"Success: {result['success']}/{result['total']}")
print(f"Failed: {result['failed']}/{result['total']}")
```

### Real Example: Bakery Products

```python
from backend.image_extractor_tool import ImageExtractor

extractor = ImageExtractor(
    dbname="blink_basket",
    user="postgres",
    password="mk0492"
)

bakery_products = [
    (634, "Bread", [
        "https://www.google.com/search?tbm=isch&q=White+Bread+Loaf",
        "https://www.google.com/search?tbm=isch&q=Bread+Slices+Plate",
        "https://www.google.com/search?tbm=isch&q=Modern+Bread+Packet"
    ]),
    (636, "Milk Bread", [
        "https://www.google.com/search?tbm=isch&q=Britannia+Milk+Bread",
        "https://www.google.com/search?tbm=isch&q=Modern+Milk+Bread",
        "https://www.google.com/search?tbm=isch&q=Bonn+Milk+Bread"
    ]),
    (795, "Parle-G Gluco Biscuit", [
        "https://www.google.com/search?tbm=isch&q=Parle-G+Biscuit+Packet",
        "https://www.google.com/search?tbm=isch&q=Parle-G+Glucose+Biscuit",
        "https://www.google.com/search?tbm=isch&q=Parle-G+With+Tea"
    ])
]

result = extractor.extract_and_update(bakery_products, category_name="Bakery Items")
```

## How It Works

1. **Google Search Parsing**: Uses BeautifulSoup and regex to extract image URLs from Google Image Search results
2. **Duplicate Filtering**: Removes duplicate images to ensure variety
3. **Image Collection**: Extracts 4 unique images per product
4. **Database Update**: Stores images as JSON array in the `products.image_url` column
5. **Progress Tracking**: Provides detailed console output with success/failure status

## Image Extraction Methods

The tool uses two extraction methods:

### Method 1: JavaScript Array Parsing (Primary)
Extracts URLs from JavaScript arrays embedded in Google's HTML:
```python
pattern = r'\["(https://[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)",\d+,\d+\]'
```

### Method 2: IMG Tag Parsing (Fallback)
Extracts from HTML `<img>` tags as a backup method

## Configuration

### Database Connection
```python
extractor = ImageExtractor(
    dbname="blink_basket",     # Database name
    user="postgres",            # Username
    password="mk0492",          # Password
    host="localhost",           # Host (default: localhost)
    port="5432"                # Port (default: 5432)
)
```

### Custom Image Count
Modify `required_count` parameter in `extract_images_for_product()` method

### Request Delays
Default: 2 seconds between Google searches (respectful to servers)
Modify `time.sleep(2)` in the code if needed

## Output Format

### Console Output
```
🎨 BAKERY ITEMS IMAGE EXTRACTION
================================================================================
Total Products: 3
================================================================================

[1/3] Bread (ID: 634)
  🔍 White Bread Loaf
  ✓ Found: 4
  🔍 Bread Slices Plate
  ✓ Found: 4
  ✅ Updated with 4 images

[2/3] Milk Bread (ID: 636)
  🔍 Britannia Milk Bread
  ✓ Found: 4
  ✅ Updated with 4 images

================================================================================
✅ SUCCESS: 3/3 products updated
⚠️  FAILED: 0/3 products
🎉 ALL PRODUCTS COMPLETED!
================================================================================
```

### Return Value
```python
{
    "success": 3,   # Number of successfully updated products
    "failed": 0,    # Number of failed products
    "total": 3      # Total products processed
}
```

## Database Schema

Images are stored in the `products` table:
```sql
products (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255),
    image_url TEXT  -- JSON array: ["url1", "url2", "url3", "url4"]
)
```

## Error Handling

- **Connection Errors**: Gracefully handles database connection failures
- **HTTP Errors**: Catches and logs failed HTTP requests
- **Parsing Errors**: Falls back to alternative extraction methods
- **Insufficient Images**: Duplicates first image if fewer than 4 found

## Best Practices

1. **Rate Limiting**: Built-in 2-second delay between requests
2. **User-Agent**: Uses modern Chrome user-agent string
3. **Unique Images**: Automatically filters duplicates
4. **Clean URLs**: Removes unnecessary query parameters
5. **Progress Tracking**: Real-time feedback on extraction progress

## Troubleshooting

### No Images Found
- Check if Google Image Search URLs are valid
- Verify internet connection
- Ensure search terms are specific enough

### Database Update Failed
- Verify database credentials
- Check if product IDs exist in database
- Ensure `image_url` column accepts TEXT data type

### HTTP Timeout Errors
- Increase timeout in `requests.get(timeout=15)`
- Check firewall/proxy settings

## Future Enhancements

- [ ] Add support for multiple image sources (Bing, DuckDuckGo)
- [ ] Implement image quality validation
- [ ] Add caching mechanism for repeated searches
- [ ] Support for batch processing from CSV files
- [ ] Image dimension verification
- [ ] Async/parallel processing for faster extraction

## License

Part of QuickCart e-commerce platform
