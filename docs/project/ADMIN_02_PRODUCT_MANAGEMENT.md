# QuickCart - Product Management Guide

## 🏷️ Complete Product Management Documentation

This comprehensive guide covers all aspects of managing products in QuickCart's admin panel, from adding new products to bulk operations and inventory management.

---

## 📋 Table of Contents

1. [Product Management Overview](#product-management-overview)
2. [Accessing Product Management](#accessing-product-management)
3. [Product List View](#product-list-view)
4. [Adding New Products](#adding-new-products)
5. [Editing Products](#editing-products)
6. [Deleting Products](#deleting-products)
7. [Product Fields Reference](#product-fields-reference)
8. [Image Management](#image-management)
9. [Inventory Management](#inventory-management)
10. [Search & Filters](#search--filters)
11. [Sorting Products](#sorting-products)
12. [Bulk Operations](#bulk-operations)
13. [Product Reviews Management](#product-reviews-management)
14. [Best Practices](#best-practices)
15. [Troubleshooting](#troubleshooting)

---

## 📦 Product Management Overview

### What is Product Management?

The Product Management section is where you control your entire product catalog - from adding new items to managing inventory, pricing, and product information.

### Key Capabilities

✅ **Product Operations**
- Add new products
- Edit existing products
- Delete products
- Duplicate products
- Bulk operations

✅ **Inventory Control**
- Track stock levels
- Set stock thresholds
- Manage availability
- Low stock alerts

✅ **Content Management**
- Product descriptions
- Multiple images
- Pricing information
- Category assignment

✅ **Performance Tracking**
- View product analytics
- Monitor sales
- Track reviews
- Stock movement

---

## 🚪 Accessing Product Management

### Navigation Path

**Method 1: Sidebar Navigation**
```
Admin Dashboard → Products
```

**Method 2: Quick Action**
```
Dashboard → Add New Product button
```

**Method 3: Direct URL**
```
/admin → Products tab
```

### Product Management Interface

```
┌─────────────────────────────────────────────────────────┐
│ 🏷️ Product Management                     [+ Add New]  │
├─────────────────────────────────────────────────────────┤
│ Search: [_____________] 🔍                              │
│                                                          │
│ Filters:                                                │
│ Category: [All ▼] Stock: [All ▼] Price: ₹[__] - ₹[__] │
│                                                          │
│ Sort by: [Relevance ▼]  Show: [10 ▼] per page         │
├─────────────────────────────────────────────────────────┤
│ [Select All] [☑️] 50 products found                     │
│                                                          │
│ ┌─────────────────────────────────────────────────────┐│
│ │ ☑️ [Image] Fresh Tomatoes           ₹40  Stock: 25 ││
│ │    Category: Vegetables             [Edit] [Delete]││
│ ├─────────────────────────────────────────────────────┤│
│ │ ☑️ [Image] Organic Milk             ₹60  Stock: 15 ││
│ │    Category: Dairy                  [Edit] [Delete]││
│ └─────────────────────────────────────────────────────┘│
│                                                          │
│ Showing 1-10 of 50  [< 1 2 3 4 5 >]                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Product List View

### Product Card Layout

Each product in the list displays:

```
┌────────────────────────────────────────────────────┐
│ ☑️ [Product Image]                                 │
│                                                     │
│ Product Name: Fresh Organic Tomatoes               │
│ Category: Vegetables                               │
│ Price: ₹40/kg    Original Price: ₹50               │
│ Stock: 25 units  Status: ✅ In Stock               │
│ Rating: ⭐⭐⭐⭐☆ (4.0) | 15 reviews                │
│                                                     │
│ [✏️ Edit] [🗑️ Delete] [👁️ View] [📋 Duplicate]    │
└────────────────────────────────────────────────────┘
```

### Product Information Display

**Product Details:**
- **Product ID**: Unique identifier (e.g., P001)
- **Name**: Product display name
- **Category**: Product category
- **Price**: Current selling price
- **Original Price**: MRP (if on discount)
- **Stock**: Available quantity
- **Status**: In Stock/Low Stock/Out of Stock
- **Rating**: Average customer rating
- **Reviews**: Total review count
- **Created**: Date added
- **Updated**: Last modified date

### Status Badges

```
Stock Status Indicators:
✅ In Stock     - Green badge (stock > 10)
⚠️ Low Stock    - Yellow badge (stock ≤ 10)
❌ Out of Stock - Red badge (stock = 0)
```

---

## ➕ Adding New Products

### Step-by-Step Process

#### Step 1: Open Product Form

Click **"+ Add New Product"** button

#### Step 2: Fill Product Form

```
┌─────────────────────────────────────────────────────┐
│ Add New Product                          [X] Close  │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Product Name *                                      │
│ [________________________________]                  │
│                                                      │
│ Category *                                          │
│ [Select Category ▼]                                 │
│                                                      │
│ Description                                         │
│ [________________________________]                  │
│ [________________________________]                  │
│ [________________________________]                  │
│                                                      │
│ Price (₹) *        Original Price (₹)              │
│ [_____]           [_____]                          │
│                                                      │
│ Stock Quantity *   Unit                            │
│ [_____]           [kg/liter/piece ▼]               │
│                                                      │
│ Product Images *                                    │
│ ┌──────────┬──────────┬──────────┬──────────┐     │
│ │ [Upload] │ [Upload] │ [Upload] │ [Upload] │     │
│ └──────────┴──────────┴──────────┴──────────┘     │
│                                                      │
│ [Cancel]                    [💾 Add Product]       │
└─────────────────────────────────────────────────────┘
```

#### Step 3: Product Details

**1. Product Name** (Required)
- Clear, descriptive name
- Include key attributes
- Examples:
  - ✅ "Fresh Organic Tomatoes"
  - ✅ "Amul Taza Full Cream Milk 1L"
  - ❌ "Tomatoes" (too generic)

**2. Category** (Required)
- Select from dropdown
- Available categories:
  - 🥬 Vegetables & Fruits
  - 🥛 Dairy & Eggs
  - 🍞 Bakery
  - 🥤 Beverages
  - 🍿 Snacks
  - 🍚 Staples
  - 🍕 Ready to Cook
  - 🧴 Personal Care
  - 🧹 Household
  - 🍬 Chocolates & Sweets
  - 🌿 Organic
  - 🍼 Baby Care
  - 🐾 Pet Supplies

**3. Description** (Optional)
- Detailed product description
- Key features and benefits
- Usage instructions
- Storage guidelines
- Nutritional info (if applicable)

Example:
```
Fresh farm-sourced organic tomatoes, 
rich in vitamins and antioxidants. 
Perfect for salads, cooking, and juices.
Storage: Refrigerate for freshness.
```

**4. Pricing** (Required)
- **Price**: Selling price (₹)
- **Original Price**: MRP/list price (₹)
- Discount calculated automatically
- Enter whole numbers (no decimals for rupees)

Example:
```
Price: ₹40
Original Price: ₹50
Discount: 20% OFF (auto-calculated)
```

**5. Stock & Unit** (Required)
- **Stock Quantity**: Available units
- **Unit**: Measurement unit
  - kg (kilograms)
  - g (grams)
  - L (liters)
  - mL (milliliters)
  - piece (individual items)
  - pack (packages)

Example:
```
Stock: 50
Unit: kg
Display: "₹40/kg"
```

#### Step 4: Upload Images

**Image Requirements:**

✅ **Supported Formats**
- JPEG/JPG
- PNG
- WebP

✅ **Size Guidelines**
- Maximum: 5MB per image
- Recommended: 800x800px
- Minimum: 400x400px
- Aspect Ratio: 1:1 (square)

✅ **Image Tips**
- Use high-quality photos
- Clear product visibility
- White/neutral background
- Good lighting
- Multiple angles

**Upload Process:**
1. Click "Upload" button
2. Select image from computer
3. Image preview appears
4. Repeat for up to 4 images
5. Drag to reorder (first = primary)
6. Click X to remove image

```
Image Slots:
┌──────────┬──────────┬──────────┬──────────┐
│ [Image1] │ [Upload] │ [Upload] │ [Upload] │
│  Primary │ Angle 2  │ Angle 3  │ Angle 4  │
└──────────┴──────────┴──────────┴──────────┘
```

#### Step 5: Save Product

**Validation Checks:**
- ✅ Product name filled
- ✅ Category selected
- ✅ Price entered (>0)
- ✅ Stock entered (≥0)
- ✅ At least 1 image uploaded

**Save Actions:**
- Click "Add Product" button
- System validates input
- Product saved to database
- Success message displayed
- Redirects to product list

**Success Message:**
```
┌────────────────────────────────┐
│ ✅ Product Added Successfully! │
│ "Fresh Tomatoes" is now live.  │
└────────────────────────────────┘
```

---

## ✏️ Editing Products

### How to Edit Products

#### Method 1: Edit Button
```
Product List → Click "Edit" button → Edit Form Opens
```

#### Method 2: Product Details
```
Product Card → Click "View" → Click "Edit" button
```

### Edit Product Form

```
┌─────────────────────────────────────────────────────┐
│ Edit Product: Fresh Tomatoes            [X] Close  │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Product Name *                                      │
│ [Fresh Organic Tomatoes____________]                │
│                                                      │
│ Category *                                          │
│ [Vegetables ▼]                                      │
│                                                      │
│ Description                                         │
│ [Farm-fresh organic tomatoes....]                  │
│                                                      │
│ Price (₹): 40    Original Price (₹): 50            │
│ Discount: 20% OFF                                   │
│                                                      │
│ Stock: 25 units    Unit: kg                        │
│                                                      │
│ Existing Images:                                    │
│ ┌─────┬─────┬─────┬─────┐                         │
│ │ [X] │ [X] │     │     │                         │
│ │ IMG1│ IMG2│     │     │                         │
│ └─────┴─────┴─────┴─────┘                         │
│                                                      │
│ [Cancel]      [Update Product]                     │
└─────────────────────────────────────────────────────┘
```

### Editable Fields

✏️ **Can Edit:**
- Product name
- Description
- Category
- Price
- Original price
- Stock quantity
- Unit
- Images (add/remove/reorder)

🔒 **Cannot Edit:**
- Product ID (system-generated)
- Created date
- Total sales (calculated)

### Quick Edit Features

**Inline Editing:**
Some fields support quick inline editing:
- Stock quantity (click to edit)
- Price (click to edit)
- Status toggle (In Stock/Out of Stock)

```
Product Card - Quick Edit:
Stock: [25 units] ✏️ ← Click to edit
Price: [₹40] ✏️ ← Click to edit
Status: [✅ In Stock ▼] ← Toggle dropdown
```

### Edit History

Track product changes:
- Last updated timestamp
- Updated by (admin name)
- Change log (if enabled)

---

## 🗑️ Deleting Products

### Delete Confirmation

**Safety Measures:**
1. Confirmation dialog appears
2. Must confirm deletion
3. Optional reason field
4. Cannot be undone

```
┌────────────────────────────────────┐
│ ⚠️ Delete Product?                 │
├────────────────────────────────────┤
│ Are you sure you want to delete   │
│ "Fresh Tomatoes"?                 │
│                                    │
│ This action cannot be undone.     │
│                                    │
│ ☑️ Also delete associated reviews  │
│                                    │
│ [Cancel] [🗑️ Delete Permanently]  │
└────────────────────────────────────┘
```

### Soft Delete vs Hard Delete

**Soft Delete** (Default):
- Product hidden from customers
- Retained in database
- Can be restored later
- Order history preserved

**Hard Delete** (Permanent):
- Product completely removed
- All data deleted
- Cannot be restored
- Reviews deleted (optional)

### Bulk Delete

Delete multiple products:
1. Select products (checkboxes)
2. Click "Delete Selected"
3. Confirm bulk deletion
4. All selected products deleted

**Warning**: Use with caution!

---

## 📝 Product Fields Reference

### Complete Field Specifications

#### 1. Product Name
- **Type**: Text (string)
- **Required**: Yes
- **Max Length**: 200 characters
- **Validation**: Not empty
- **Example**: "Fresh Organic Tomatoes"

#### 2. Category
- **Type**: Dropdown (foreign key)
- **Required**: Yes
- **Options**: 13 predefined categories
- **Validation**: Must be valid category ID

#### 3. Description
- **Type**: Textarea (text)
- **Required**: No
- **Max Length**: 2000 characters
- **Format**: Plain text
- **Example**: Product details, features, usage

#### 4. Price
- **Type**: Decimal (10,2)
- **Required**: Yes
- **Min Value**: 0.01
- **Max Value**: 99,999.99
- **Currency**: INR (₹)
- **Example**: 40.00

#### 5. Original Price
- **Type**: Decimal (10,2)
- **Required**: No
- **Default**: Same as price
- **Validation**: Must be ≥ price
- **Purpose**: Show discount

#### 6. Stock Quantity
- **Type**: Integer
- **Required**: Yes
- **Min Value**: 0
- **Default**: 0
- **Example**: 50

#### 7. Unit
- **Type**: Enum/String
- **Required**: Yes
- **Options**: kg, g, L, mL, piece, pack
- **Default**: piece
- **Display**: Appended to price (₹40/kg)

#### 8. Images
- **Type**: JSON array (URLs)
- **Required**: Yes (at least 1)
- **Max Images**: 4 per product
- **Format**: URLs to uploaded images
- **Storage**: Cloud/local storage

#### 9. Created At
- **Type**: Timestamp
- **Auto-generated**: Yes
- **Format**: YYYY-MM-DD HH:MM:SS
- **Timezone**: IST

#### 10. Updated At
- **Type**: Timestamp
- **Auto-updated**: Yes (on every edit)
- **Format**: YYYY-MM-DD HH:MM:SS

---

## 🖼️ Image Management

### Image Upload Process

**Step 1: Select Image**
```
Click Upload → Choose File → Preview Appears
```

**Step 2: Image Preview**
```
┌──────────────────┐
│  [Tomatoes.jpg]  │
│                  │
│   [Image Preview]│
│                  │
│   Size: 2.5 MB   │
│   800x800px      │
│                  │
│  [❌ Remove]     │
└──────────────────┘
```

**Step 3: Multiple Images**
- Upload up to 4 images per product
- First image = primary (featured)
- Drag & drop to reorder
- Click X to remove

### Image Best Practices

✅ **DO:**
- Use high-resolution images (800x800px+)
- Show product clearly
- Use natural lighting
- White or neutral background
- Compress before uploading
- Use multiple angles
- Show product packaging (if applicable)

❌ **DON'T:**
- Upload blurry images
- Use stock photos (if possible)
- Over-edit or filter heavily
- Include text/watermarks
- Use very large files (>5MB)
- Upload duplicate images

### Image Optimization

**Before Upload:**
1. Resize to 800x800px
2. Compress to <1MB
3. Convert to WebP (optional)
4. Remove EXIF data

**Tools:**
- Online: TinyPNG, Squoosh
- Desktop: GIMP, Photoshop
- Mac: Preview (Export)

### Managing Existing Images

**Edit Mode:**
- View all images
- Remove unwanted images
- Add new images
- Reorder images (drag & drop)

```
Image Gallery (Edit Mode):
┌─────┬─────┬─────┬─────┐
│ [X] │ [X] │ [X] │ [+] │
│ ⬆️  │     │     │     │
│ IMG1│ IMG2│ IMG3│ Add │
└─────┴─────┴─────┴─────┘
     ↕️ Drag to reorder
```

### Image Storage

**Backend Storage:**
- Images stored in `/static/uploads/products/`
- Organized by product ID
- Auto-generated filenames
- Original filename preserved in metadata

**Database Storage:**
- URLs stored as JSON array
- Example: `["img1.jpg", "img2.jpg"]`
- Retrieved on product fetch

---

## 📊 Inventory Management

### Stock Tracking

#### Current Stock Display

```
┌──────────────────────────────┐
│ Product: Fresh Tomatoes      │
│                              │
│ Current Stock: 25 units      │
│ Status: ✅ In Stock          │
│                              │
│ Low Stock Threshold: 10      │
│ Reorder Point: 15            │
└──────────────────────────────┘
```

#### Stock Status Calculation

```python
if stock > 10:
    status = "✅ In Stock"
elif stock > 0:
    status = "⚠️ Low Stock"
else:
    status = "❌ Out of Stock"
```

### Updating Stock

**Manual Update:**
1. Click on stock value
2. Enter new quantity
3. Press Enter to save
4. Confirmation message

**Bulk Stock Update:**
1. Select multiple products
2. Click "Update Stock"
3. Enter adjustment (+/-10)
4. Apply to all selected

### Stock Alerts

**Low Stock Notification:**
```
┌────────────────────────────┐
│ ⚠️ Low Stock Alert         │
│ Fresh Tomatoes: 8 units   │
│ Reorder recommended        │
│                            │
│ [Restock Now] [Dismiss]    │
└────────────────────────────┘
```

**Out of Stock:**
- Automatic customer notification
- Product marked as unavailable
- Hidden from search (optional)
- Admin alert sent

### Stock History

Track stock changes:
- Initial stock
- Stock additions
- Sales (order deductions)
- Manual adjustments
- Current stock

```
Stock Movement Log:
┌─────────────────────────────────────┐
│ Date       │ Change │ Type │ Stock │
├─────────────────────────────────────┤
│ 2024-02-10 │  +100  │ Add  │  100  │
│ 2024-02-11 │   -15  │ Sale │   85  │
│ 2024-02-11 │   -20  │ Sale │   65  │
│ 2024-02-12 │   -10  │ Adj  │   55  │
└─────────────────────────────────────┘
```

### Inventory Reports

**Stock Report Features:**
- Current stock levels (all products)
- Low stock items
- Out of stock items
- Stock movement history
- Reorder recommendations
- Export to Excel/PDF

---

## 🔍 Search & Filters

### Search Functionality

**Global Search:**
```
┌─────────────────────────────┐
│ Search products... 🔍       │
└─────────────────────────────┘
```

**Search By:**
- Product name
- Product ID
- Category
- Description (keyword)
- Price range

**Search Examples:**
- "tomato" → Finds all tomato products
- "dairy milk" → Finds milk in dairy
- "₹40" → Finds products around ₹40
- "P001" → Finds product by ID

**Search Results:**
```
┌─────────────────────────────────┐
│ 🔍 Search: "tomato"            │
│ 5 results found                 │
├─────────────────────────────────┤
│ 1. Fresh Tomatoes (₹40/kg)     │
│ 2. Cherry Tomatoes (₹60/kg)    │
│ 3. Tomato Puree (₹35/pack)     │
│ 4. Tomato Sauce (₹50/bottle)   │
│ 5. Tomato Ketchup (₹45/bottle) │
└─────────────────────────────────┘
```

### Filter Options

#### 1. Category Filter
```
Category: [All Categories ▼]
Options:
  - All Categories (default)
  - Vegetables & Fruits
  - Dairy & Eggs
  - Bakery
  - Beverages
  ... (all categories)
```

#### 2. Stock Status Filter
```
Stock: [All ▼]
Options:
  - All (default)
  - In Stock (stock > 10)
  - Low Stock (stock ≤ 10)
  - Out of Stock (stock = 0)
```

#### 3. Price Range Filter
```
Price Range:
Min: [₹___] - Max: [₹___]
[Apply]

Presets:
- Under ₹50
- ₹50 - ₹100
- ₹100 - ₹500
- Above ₹500
```

#### 4. Rating Filter (Future)
```
Rating: [All ▼]
Options:
  - All Ratings
  - 4★ & Above
  - 3★ & Above
  - Below 3★
```

### Advanced Filters

**Combined Filters:**
```
┌───────────────────────────────────┐
│ Advanced Filters                  │
├───────────────────────────────────┤
│ Category: Vegetables              │
│ Stock: In Stock                   │
│ Price: ₹20 - ₹100                 │
│ Created: Last 7 days              │
│                                   │
│ [Reset] [Apply Filters]           │
└───────────────────────────────────┘
```

**Active Filters Display:**
```
Active Filters: [Vegetables] [In Stock] [₹20-₹100]
                   ❌          ❌           ❌
                 (Click X to remove)
```

---

## 🔄 Sorting Products

### Sort Options

**Sort Dropdown:**
```
Sort by: [Relevance ▼]
```

**Available Sorts:**

#### 1. Relevance (Default)
- Search results ranked by relevance
- Default view for searches
- Algorithm-based scoring

#### 2. Name (A-Z)
- Alphabetical ascending
- A → Z sorting
- Good for browsing

#### 3. Name (Z-A)
- Alphabetical descending
- Z → A sorting
- Reverse order

#### 4. Price: Low to High
- Ascending price order
- Cheapest first
- Good for budget shopping

#### 5. Price: High to Low
- Descending price order
- Most expensive first
- Premium products first

#### 6. Newest First
- Recently added products
- Sorted by created_at DESC
- See latest additions

#### 7. Stock: Low to High
- Products with low stock first
- Prioritize restocking
- Inventory management

#### 8. Stock: High to Low
- Well-stocked products first
- Available items prioritized

#### 9. Best Selling (Future)
- Sorted by sales volume
- Popular products first
- Data-driven

### Combined Sort & Filter

**Example:**
```
Category: Vegetables
Sort: Price: Low to High
Result: All vegetables sorted by price ascending
```

---

## ⚡ Bulk Operations

### Selecting Multiple Products

**Select All:**
```
[☑️ Select All] - Selects all products on current page
```

**Individual Selection:**
```
[☑️] Product 1
[☑️] Product 2
[ ] Product 3
[☑️] Product 4
```

**Selection Count:**
```
2 products selected
```

### Bulk Action Menu

```
┌─────────────────────────────────┐
│ Bulk Actions: [Select Action ▼]│
│                                 │
│ - Update Stock                  │
│ - Update Price                  │
│ - Change Category               │
│ - Delete Selected               │
│ - Export Selected               │
│                                 │
│ [Apply]                         │
└─────────────────────────────────┘
```

### Bulk Update Stock

**Process:**
1. Select products
2. Choose "Update Stock"
3. Enter adjustment:
   - Add stock: +50
   - Reduce stock: -10
   - Set stock: =100
4. Confirm
5. All selected products updated

```
┌─────────────────────────────────┐
│ Bulk Update Stock (5 products)  │
├─────────────────────────────────┤
│ Operation: [Add Stock ▼]        │
│ Quantity: [___]                 │
│                                 │
│ Example: +50 adds 50 to each    │
│                                 │
│ [Cancel] [Update All]           │
└─────────────────────────────────┘
```

### Bulk Price Update

**Percentage Change:**
```
┌─────────────────────────────────┐
│ Bulk Price Update               │
├─────────────────────────────────┤
│ Type: [Percentage ▼]            │
│ Change: [+10]%                  │
│                                 │
│ Result: All prices +10%         │
│                                 │
│ Preview:                        │
│ • Product A: ₹40 → ₹44         │
│ • Product B: ₹60 → ₹66         │
│                                 │
│ [Cancel] [Apply Changes]        │
└─────────────────────────────────┘
```

**Fixed Amount Change:**
```
Type: [Fixed Amount ▼]
Change: [+5] rupees
Result: All prices +₹5
```

### Bulk Category Change

**Reassign Category:**
1. Select products
2. Choose "Change Category"
3. Select new category
4. Confirm
5. All products moved to new category

```
┌─────────────────────────────────┐
│ Change Category (3 products)    │
├─────────────────────────────────┤
│ New Category:                   │
│ [Select Category ▼]             │
│                                 │
│ Moving 3 products to:           │
│ • Organic                       │
│                                 │
│ [Cancel] [Move Products]        │
└─────────────────────────────────┘
```

### Bulk Export

**Export Options:**
```
┌─────────────────────────────────┐
│ Export Products                 │
├─────────────────────────────────┤
│ Format: [Excel ▼]               │
│         - Excel (.xlsx)         │
│         - CSV (.csv)            │
│         - PDF (.pdf)            │
│                                 │
│ Include:                        │
│ ☑️ Product Details              │
│ ☑️ Pricing                      │
│ ☑️ Stock Levels                 │
│ ☑️ Images (URLs)                │
│ [ ] Reviews                     │
│                                 │
│ [Cancel] [Export]               │
└─────────────────────────────────┘
```

---

## ⭐ Product Reviews Management

### Viewing Product Reviews

**Access Reviews:**
```
Product Card → [View Reviews] button
OR
Product Edit → Reviews tab
```

**Reviews Panel:**
```
┌─────────────────────────────────────┐
│ Product Reviews: Fresh Tomatoes     │
├─────────────────────────────────────┤
│ Average Rating: ⭐⭐⭐⭐☆ (4.2/5)   │
│ Total Reviews: 15                   │
├─────────────────────────────────────┤
│ Recent Reviews:                     │
│                                     │
│ ⭐⭐⭐⭐⭐ John Doe (2 days ago)     │
│ "Excellent quality, very fresh!"   │
│ [Approve] [Reject] [Reply]          │
│                                     │
│ ⭐⭐⭐⭐ Jane Smith (5 days ago)    │
│ "Good product, fast delivery"      │
│ [Approve] [Reject] [Reply]          │
└─────────────────────────────────────┘
```

### Review Moderation

**Pending Reviews:**
- New reviews await approval
- Admin can approve/reject
- Notification sent to reviewer

**Moderation Actions:**
- ✅ **Approve**: Make review public
- ❌ **Reject**: Hide review (with reason)
- 💬 **Reply**: Respond to review
- 🗑️ **Delete**: Permanently remove

**Bulk Moderation:**
```
[ Select All ]
[☑️] Review 1
[☑️] Review 2
[☑️] Review 3

[Approve All] [Reject All]
```

### Review Analytics

**Performance Metrics:**
```
┌──────────────────────────────────┐
│ Review Statistics                │
├──────────────────────────────────┤
│ 5★: ████████████████ 60% (9)    │
│ 4★: ███████ 27% (4)              │
│ 3★: ███ 13% (2)                  │
│ 2★: █ 0% (0)                     │
│ 1★: █ 0% (0)                     │
└──────────────────────────────────┘
```

---

## 💡 Best Practices

### Product Listing Best Practices

✅ **DO:**
- Write clear, descriptive names
- Use high-quality images
- Provide detailed descriptions
- Set accurate pricing
- Maintain current stock levels
- Categorize correctly
- Include nutritional info (food items)
- Use proper units (kg, L, piece)
- Update regularly
- Monitor reviews

❌ **DON'T:**
- Use ALL CAPS in names
- Upload low-quality images
- Leave description empty
- Set unrealistic prices
- Ignore stock warnings
- Miscategorize products
- Use generic descriptions
- Forget to update stock
- Ignore customer reviews

### Pricing Strategy

**Competitive Pricing:**
- Research competitor prices
- Set competitive rates
- Show original price for discounts
- Use psychological pricing (₹99 vs ₹100)

**Discount Strategy:**
- Occasional discounts drive sales
- Show savings clearly
- Time-limited offers
- Bundle deals

### Inventory Management Tips

**Stock Levels:**
- Keep popular items well-stocked
- Set reorder points
- Monitor sales velocity
- Plan for seasonality
- Buffer stock for high demand

**Stock Rotation:**
- FIFO (First In, First Out)
- Expiry date tracking (food items)
- Clear old stock with discounts

### SEO & Discoverability

**Product Names:**
- Include keywords
- Be specific
- Add brand names
- Use common search terms

**Descriptions:**
- Keyword-rich
- Natural language
- Benefits over features
- Answer common questions

### Image Best Practices

**Photography:**
- Natural lighting
- Multiple angles
- Show scale (if needed)
- Include packaging
- Show product in use

**Technical:**
- Square aspect ratio (1:1)
- 800x800px minimum
- Compress images
- WebP format (if supported)

---

## 🔧 Troubleshooting

### Common Issues

#### Issue 1: Product Not Appearing in Store

**Possible Causes:**
- Stock set to 0
- Category not active
- Product not saved
- Cache not cleared

**Solutions:**
```
1. Check stock > 0
2. Verify category is active
3. Re-save product
4. Clear browser/server cache
5. Check product status
```

#### Issue 2: Images Not Uploading

**Possible Causes:**
- File too large (>5MB)
- Unsupported format
- Server permission issues
- Network error

**Solutions:**
```
1. Compress image (<1MB)
2. Use JPEG/PNG format
3. Check file permissions
4. Retry upload
5. Contact support if persistent
```

#### Issue 3: Price Not Updating

**Possible Causes:**
- Form validation error
- Cache issue
- Concurrent edit conflict
- Database connection issue

**Solutions:**
```
1. Refresh page and retry
2. Clear form and re-enter
3. Check for error messages
4. Verify price format (decimal)
5. Check browser console
```

#### Issue 4: Stock Deduction Not Working

**Possible Causes:**
- Order processing error
- Stock update trigger failed
- Database constraint violation

**Solutions:**
```
1. Manually verify stock
2. Check order logs
3. Review database triggers
4. Update stock manually
5. Contact developer
```

#### Issue 5: Bulk Operation Failed

**Possible Causes:**
- Too many items selected
- Database timeout
- Validation error on some products

**Solutions:**
```
1. Select fewer products (<50)
2. Check individual product errors
3. Retry failed products separately
4. Increase timeout (developer)
```

### Error Messages

**"Product name is required"**
- Solution: Enter product name

**"Please upload at least one image"**
- Solution: Upload product image

**"Price must be greater than 0"**
- Solution: Enter valid price

**"Stock quantity cannot be negative"**
- Solution: Enter 0 or positive number

**"Category not found"**
- Solution: Select valid category from dropdown

**"Image upload failed"**
- Solution: Check file size and format, retry

---

## 📚 Related Admin Guides

Continue learning:

- **[Dashboard Overview](ADMIN_01_DASHBOARD_OVERVIEW.md)** - Admin panel introduction
- **[Order Management](ADMIN_03_ORDER_MANAGEMENT.md)** - Process orders
- **[Category Management](ADMIN_04_CATEGORY_MANAGEMENT.md)** - Organize categories
- **[Analytics & Reports](ADMIN_06_ANALYTICS_REPORTS.md)** - Business insights
- **[Banner & Offers](ADMIN_07_BANNER_OFFER_MANAGEMENT.md)** - Promotions

---

**Product Management Version**: 2.0.0  
**Last Updated**: February 2026  
**Support**: admin@quickcart.com

🏷️ **Master Your Product Catalog!**
