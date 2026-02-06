# User Guide: Wishlist Management

**Document Version:** 1.0  
**Last Updated:** February 2026  
**Target Audience:** End Users  
**Related Documents:** [USER_03_SHOPPING_GUIDE.md](USER_03_SHOPPING_GUIDE.md), [USER_04_CART_CHECKOUT.md](USER_04_CART_CHECKOUT.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Adding to Wishlist](#adding-to-wishlist)
3. [Viewing Wishlist](#viewing-wishlist)
4. [Managing Wishlist Items](#managing-wishlist-items)
5. [Moving to Cart](#moving-to-cart)
6. [Sharing Wishlist](#sharing-wishlist)
7. [Wishlist Features](#wishlist-features)

---

## Overview

Save products you love for later! QuickCart's wishlist lets you bookmark items, track prices, and quickly add them to your cart when you're ready to buy.

### Key Features

- ❤️ **Save Products**: Bookmark items for later
- 🔄 **Sync Across Devices**: Access wishlist on any device (logged-in users)
- 📊 **Price Tracking**: Monitor price changes
- 🛒 **Quick Add to Cart**: One-click cart addition
- 👥 **Share Lists**: Share wishlist with family/friends

---

## Adding to Wishlist

### From Product Card

**Click the heart icon** on any product card:

```
┌───────────────────────────┐
│  [Product Image]          │
│  ♡  ← Click to add        │
│  Product Name             │
│  ₹99.00                   │
│  [Add to Cart]            │
└───────────────────────────┘
```

After clicking:
- Heart icon fills: ♥ (red)
- Toast notification: "Added to wishlist!"
- Product saved to database (logged-in) or localStorage (guest)

### From Product Details

**Click "Add to Wishlist" button** on product details page.

### Keyboard Shortcut

Press `W` while hovering over a product card (optional feature).

---

## Viewing Wishlist

### Access Your Wishlist

**Method 1: Header Menu**
- Click wishlist icon (♡) in header
- Badge shows item count

**Method 2: Account Dashboard**
- Go to "My Account" → "Wishlist"

**Method 3: Direct URL**
- Navigate to `/account/wishlist`

### Wishlist Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  My Wishlist (5 items)                       [Clear All]    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [Image]  Fresh Apples              ₹99.00  [×]      │   │
│  │          500g • In Stock                            │   │
│  │          [Add to Cart]  [Remove]                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [Image]  Amul Milk                 ₹49.00  [×]      │   │
│  │          1L • In Stock                              │   │
│  │          [Add to Cart]  [Remove]                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Managing Wishlist Items

### Removing Items

**Method 1:** Click "Remove" button
**Method 2:** Click heart icon (♥) on product card (toggles off)
**Method 3:** Click [×] icon on wishlist page

**Confirmation:**
```
✓ Removed from wishlist
```

### Clear All Items

Click "Clear All" button:

```
┌─────────────────────────────────────┐
│  Clear Wishlist?                    │
│  Remove all 5 items?                │
│  [Cancel]  [Clear All]              │
└─────────────────────────────────────┘
```

---

## Moving to Cart

### Quick Add to Cart

**From Wishlist Page:**
1. Click "Add to Cart" button
2. Item added to cart (quantity: 1)
3. Item remains in wishlist
4. Toast notification: "Added to cart!"

**Add Multiple Items:**
- Select checkboxes next to items
- Click "Add Selected to Cart"

```javascript
// Frontend: Add wishlist item to cart
const handleAddToCart = async (product) => {
  await addToCart(product, 1);
  showToast('Added to cart!', 'success');
};
```

### Bulk Actions

Select multiple items and:
- Add all to cart
- Remove all
- Move to cart and remove from wishlist

---

## Sharing Wishlist

### Generate Share Link

**Steps:**
1. Go to wishlist page
2. Click "Share Wishlist" button
3. Copy generated link
4. Share via WhatsApp, Email, SMS

**Example Link:**
```
https://quickcart.com/wishlist/share/abc123xyz
```

### Shared Wishlist View

Recipients see:
- Your wishlist items (read-only)
- Product names, images, prices
- "View Product" links
- Cannot modify your wishlist

---

## Wishlist Features

### Storage & Sync

**Logged-in Users:**
- Stored in database
- Syncs across all devices
- Persists forever (until you remove)

**Guest Users:**
- Stored in localStorage
- Limited to one device
- Cleared if browser data cleared

**Migration:**
When guest logs in, their wishlist merges with account wishlist.

```javascript
// Backend: Get wishlist
@wishlist_bp.route('/', methods=['GET'])
def get_user_wishlist():
    phone = request.args.get('phone')
    user = db.execute_query_one(
        "SELECT id FROM users WHERE phone = %s",
        (phone,)
    )
    
    wishlist = db.execute_query("""
        SELECT w.*, p.name, p.price, p.image_url, p.stock
        FROM wishlist_items w
        JOIN products p ON w.product_id = p.id
        WHERE w.user_id = %s AND p.status = 'active'
        ORDER BY w.created_at DESC
    """, (user['id'],), fetch=True)
    
    return jsonify({
        "success": True,
        "wishlist": [dict(item) for item in wishlist],
        "count": len(wishlist)
    })
```

### Stock Notifications

**Out of Stock Items:**
- Marked clearly on wishlist
- Email notification when back in stock (optional feature)

**Price Drop Alerts:**
- Optional email alerts for price reductions (future feature)

---

## Troubleshooting

### Common Issues

**1. Items not saving**
- Log in to save permanently
- Check browser cookies/localStorage enabled

**2. Wishlist empty after login**
- Guest wishlist transfers on first login
- Contact support if items missing

**3. Cannot add to cart**
- Check if item is in stock
- Refresh page and try again

---

**Related Documentation:**
- [USER_03_SHOPPING_GUIDE.md](USER_03_SHOPPING_GUIDE.md)
- [USER_04_CART_CHECKOUT.md](USER_04_CART_CHECKOUT.md)
- [USER_08_ACCOUNT_MANAGEMENT.md](USER_08_ACCOUNT_MANAGEMENT.md)
