# User Guide: Shopping Cart & Checkout Process

**Document Version:** 1.0  
**Last Updated:** February 2026  
**Target Audience:** End Users, Customer Support  
**Related Documents:** [USER_03_SHOPPING_GUIDE.md](USER_03_SHOPPING_GUIDE.md), [USER_05_ORDER_TRACKING.md](USER_05_ORDER_TRACKING.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Shopping Cart Features](#shopping-cart-features)
3. [Adding Items to Cart](#adding-items-to-cart)
4. [Managing Cart Items](#managing-cart-items)
5. [Cart Summary](#cart-summary)
6. [Applying Coupons](#applying-coupons)
7. [Checkout Process](#checkout-process)
8. [Address Management](#address-management)
9. [Payment Methods](#payment-methods)
10. [Order Confirmation](#order-confirmation)
11. [Troubleshooting](#troubleshooting)

---

## Overview

QuickCart's shopping cart and checkout system provides a seamless experience for purchasing groceries online. The cart syncs across devices for logged-in users and offers flexible payment options with transparent pricing.

### Key Features

- **Persistent Cart**: Saved cart for logged-in users (synced with database)
- **Guest Shopping**: LocalStorage-based cart for guest users
- **Real-time Updates**: Instant quantity changes and price calculations
- **Coupon Support**: Percentage, fixed, and free delivery discounts
- **Multiple Addresses**: Save and select delivery addresses
- **Flexible Payments**: COD, UPI, and Card payment options
- **Order Tracking**: Immediate order confirmation with tracking

### Cart Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Cart System Flow                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Product Page          Cart Context         Backend API    │
│       │                     │                     │         │
│       │  Add to Cart        │                     │         │
│       ├────────────────────>│                     │         │
│       │                     │  POST /cart/add     │         │
│       │                     ├────────────────────>│         │
│       │                     │  Check Stock        │         │
│       │                     │<────────────────────┤         │
│       │                     │  Update DB          │         │
│       │                     │                     │         │
│       │  Update UI          │  Reload Cart        │         │
│       │<────────────────────┤<────────────────────┤         │
│       │                     │                     │         │
│  Cart Page                  │                     │         │
│       │  View Cart          │  GET /cart          │         │
│       ├────────────────────>├────────────────────>│         │
│       │  Cart Items +       │  Cart Items +       │         │
│       │<────────────────────┤<────────────────────┤         │
│       │  Summary            │  Summary            │         │
│       │                     │                     │         │
│  Checkout                   │                     │         │
│       │  Place Order        │  POST /orders       │         │
│       ├────────────────────>├────────────────────>│         │
│       │                     │  Calculate Total    │         │
│       │                     │  Create Order       │         │
│       │  Order ID           │<────────────────────┤         │
│       │<────────────────────┤                     │         │
│       │                     │  Clear Cart         │         │
│       │                     ├────────────────────>│         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Shopping Cart Features

### 1. **Dual Storage System**

#### Logged-in Users (Database)
```javascript
// Cart synced with backend database
// Persists across devices and sessions

Cart Storage: PostgreSQL cart_items table
├── user_id: Linked to user account
├── product_id: Product reference
├── quantity: Item quantity
├── created_at: Added timestamp
└── updated_at: Last modified timestamp
```

#### Guest Users (LocalStorage)
```javascript
// Cart stored in browser
// Cleared when browser data is cleared

Cart Storage: localStorage['cart']
├── Product details cached
├── Quantity stored locally
└── Transferred to DB after login
```

### 2. **Cart Persistence**

**After Login:**
- Guest cart items transferred to database
- Merged with existing user cart
- Duplicate products combined (quantities added)

**After Logout:**
- Cart cleared from memory
- Database cart retained for next login

---

## Adding Items to Cart

### From Product Card

**Step 1: Browse Products**
- Navigate to home page or category
- View product cards with details

**Step 2: Click "Add to Cart"**
```
┌───────────────────────────┐
│  Product Card             │
│  ┌─────────────────────┐  │
│  │ [Product Image]     │  │
│  └─────────────────────┘  │
│  Product Name             │
│  ₹99.00 (₹129.00)         │
│  500g                     │
│                           │
│  ┌─────────────────────┐  │
│  │  Add to Cart   [+]  │  ← Click here
│  └─────────────────────┘  │
└───────────────────────────┘
```

**Step 3: Confirmation**
- Toast notification: "Added to cart successfully!"
- Cart icon updates with item count badge
- Product button changes to quantity stepper

### From Product Details Page

**Step 1: View Product Details**
- Click on product card to open details
- Review product information, images, reviews

**Step 2: Add to Cart with Quantity**
```
Product Details
├── Image Gallery
├── Product Info
├── Quantity Selector: [−] 1 [+]
└── [Add to Cart Button]  ← Click here
```

**Step 3: Continue Shopping or View Cart**
- Success notification appears
- Option to "View Cart" or continue shopping

### API Request Example

```javascript
// Frontend: Adding to cart
const addToCart = async (product, quantity = 1) => {
  try {
    const response = await cartService.addToCart(
      user.phone,    // User identifier
      product.id,    // Product ID
      quantity       // Quantity (default 1)
    );
    
    if (response.success) {
      // Reload cart from database
      await loadCart();
      showToast('Added to cart successfully!', 'success');
    }
  } catch (error) {
    showToast('Failed to add item', 'error');
  }
};
```

```python
# Backend: Add to cart endpoint
@cart_bp.route('/add', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    
    # Validate stock availability
    product = db.execute_query_one(
        "SELECT stock FROM products WHERE id = %s",
        (data['product_id'],)
    )
    
    if product['stock'] < data['quantity']:
        return jsonify({
            "success": False,
            "error": f"Only {product['stock']} items available"
        }), 400
    
    # Add or update cart item
    # Returns updated cart item
```

---

## Managing Cart Items

### Viewing Your Cart

**Access Cart:**
- Click cart icon in header (shows item count badge)
- Navigate to `/cart` URL

**Cart Page Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Shopping Cart (3 items)                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Image] Product Name                           ₹99.00   │ │
│ │         500g                                            │ │
│ │         [−] 2 [+]  [Remove]                             │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Image] Another Product                        ₹149.00  │ │
│ │         1kg                                             │ │
│ │         [−] 1 [+]  [Remove]                             │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Updating Quantities

**Using Quantity Stepper:**
```
[−] 2 [+]
 ↓   ↓  ↓
Dec  Qty Inc
```

**Minus Button (−):**
- Decreases quantity by 1
- Minimum quantity: 1
- At quantity 1: Shows confirmation before removal

**Plus Button (+):**
- Increases quantity by 1
- Maximum: Product stock limit
- Shows error if exceeds stock: "Only 5 items available"

**Direct Input (optional):**
- Click on quantity number
- Enter desired quantity
- Validates against stock
- Updates on blur/Enter

### Removing Items

**Method 1: Remove Button**
- Click "Remove" button on cart item
- Item immediately removed from cart
- Cart summary updates

**Method 2: Quantity Zero**
- Decrease quantity to 0
- Confirmation prompt: "Remove item from cart?"
- Click "Yes" to confirm removal

**Confirmation Toast:**
```
✓ Item removed from cart
```

### Quantity Update Logic

```javascript
// Frontend: Update quantity
const updateQuantity = async (productId, newQuantity) => {
  if (newQuantity <= 0) {
    // Remove item if quantity is 0
    await removeFromCart(productId);
    return;
  }
  
  if (user?.phone) {
    // Logged-in user: Update in database
    const response = await cartService.updateQuantity(
      user.phone,
      productId,
      newQuantity
    );
    
    if (response.success) {
      // Update local state
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  } else {
    // Guest user: Update localStorage
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }
};
```

---

## Cart Summary

### Price Breakdown

```
┌─────────────────────────────────────┐
│  Order Summary                      │
├─────────────────────────────────────┤
│  Subtotal (3 items)      ₹347.00    │
│  Delivery Fee            ₹29.00     │
│  Handling Fee            ₹5.00      │
│  ─────────────────────────────────  │
│  Discount (WELCOME10)    −₹34.70    │
│  ─────────────────────────────────  │
│  Total                   ₹346.30    │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  Proceed to Checkout          │  │
│  └───────────────────────────────┘  │
│                                     │
│  💡 Add ₹52 more for FREE delivery! │
└─────────────────────────────────────┘
```

### Price Components

| Component | Calculation | Notes |
|-----------|-------------|-------|
| **Subtotal** | Sum of (price × quantity) | All cart items |
| **Delivery Fee** | ₹29 or ₹0 | Free if subtotal ≥ ₹99 |
| **Handling Fee** | ₹5 (fixed) | Service charge |
| **Discount** | Varies by coupon | Applied after validation |
| **Total** | Subtotal − Discount + Fees | Final payable amount |

### Free Delivery Eligibility

```javascript
// Delivery fee calculation
const subtotal = getCartTotal();
const deliveryFee = subtotal >= 99 ? 0 : 29;

// Display message
if (subtotal < 99) {
  const remaining = 99 - subtotal;
  showMessage(`Add ₹${remaining} more for FREE delivery!`);
}
```

**Free Delivery Conditions:**
1. Cart subtotal ≥ ₹99, OR
2. Free delivery coupon applied

---

## Applying Coupons

### Available Coupon Types

| Type | Description | Example |
|------|-------------|---------|
| **Percentage** | % off on subtotal | 10% off (max ₹50) |
| **Fixed** | Fixed amount off | ₹20 off on orders above ₹199 |
| **Free Delivery** | Waives delivery charge | Free delivery on all orders |

### How to Apply Coupon

**Step 1: Enter Coupon Code**
```
┌─────────────────────────────────────┐
│  Have a coupon?                     │
│  ┌─────────────────┬──────────────┐ │
│  │ WELCOME10       │ [Apply]      │ │
│  └─────────────────┴──────────────┘ │
└─────────────────────────────────────┘
```

**Step 2: Click "Apply" Button**
- Coupon validated against backend
- Checks validity, expiry, minimum order

**Step 3: View Discount**
```
✓ Coupon applied successfully!
  WELCOME10: 10% off (max ₹50)
  You saved ₹34.70
```

### Coupon Validation

```python
# Backend: Validate coupon
@offers_bp.route('/validate', methods=['POST'])
def validate_offer():
    data = request.get_json()
    code = data['code']
    cart_total = data['cart_total']
    
    # Get active coupon
    offer = db.execute_query_one("""
        SELECT * FROM offers
        WHERE code = %s
        AND status = 'active'
        AND start_date <= CURRENT_DATE
        AND end_date >= CURRENT_DATE
    """, (code,))
    
    if not offer:
        return jsonify({
            "valid": False,
            "message": "Invalid or expired coupon"
        })
    
    # Check minimum order amount
    min_order = float(offer.get('min_order_amount', 0))
    if cart_total < min_order:
        return jsonify({
            "valid": False,
            "message": f"Minimum order ₹{min_order} required"
        })
    
    # Calculate discount
    if offer['discount_type'] == 'percentage':
        discount = (cart_total * offer['discount_value']) / 100
        max_discount = offer.get('max_discount_amount')
        if max_discount:
            discount = min(discount, max_discount)
    elif offer['discount_type'] == 'fixed':
        discount = min(offer['discount_value'], cart_total)
    
    return jsonify({
        "valid": True,
        "offer": offer,
        "discount": discount,
        "message": f"Coupon applied! You saved ₹{discount:.2f}"
    })
```

### Removing Coupon

**Click "Remove" next to applied coupon:**
```
✓ WELCOME10 applied  [×Remove]
```

- Discount removed from total
- Delivery fee recalculated
- Summary updated instantly

### Common Coupon Errors

| Error | Reason | Solution |
|-------|--------|----------|
| "Invalid or expired coupon" | Coupon not found/expired | Check code spelling |
| "Minimum order ₹199 required" | Cart total too low | Add more items |
| "Coupon not applicable" | User/category restriction | Try different coupon |
| "Usage limit exceeded" | Coupon used max times | Contact support |

---

## Checkout Process

### Checkout Overview

```
Step 1: Review Order → Step 2: Payment → Step 3: Confirmation
    ✓                     ○                  ○
```

**Prerequisites:**
- User must be logged in
- Cart must have items
- Delivery address required

### Step 1: Order Review

**Address Selection:**
```
┌─────────────────────────────────────────────────────┐
│ Select Delivery Address                             │
├─────────────────────────────────────────────────────┤
│ ● Home                                   [Edit]     │
│   John Doe, 9876543210                              │
│   123 Main Street, Koramangala                      │
│   Bengaluru, Karnataka - 560034                     │
│                                                     │
│ ○ Office                                 [Edit]     │
│   John Doe, 9876543210                              │
│   45 Tech Park, Whitefield                          │
│   Bengaluru, Karnataka - 560066                     │
│                                                     │
│ [+ Add New Address]                                 │
└─────────────────────────────────────────────────────┘
```

**Cart Review:**
- List of all items with images
- Quantities and prices
- Option to edit quantities
- "Back to Cart" button to make changes

**Order Summary:**
- Subtotal, fees, discounts
- Applied coupon (if any)
- Final total

**Action Buttons:**
```
[Back to Cart]  [Continue to Payment →]
```

### Step 2: Payment Method

**Select Payment Option:**
```
┌─────────────────────────────────────────────────────┐
│ Select Payment Method                               │
├─────────────────────────────────────────────────────┤
│ ● Cash on Delivery                                  │
│   Pay when you receive                              │
│   💰 Available for all orders                       │
│                                                     │
│ ○ UPI Payment                                       │
│   GPay, PhonePe, Paytm                             │
│   📱 Instant payment                                │
│                                                     │
│ ○ Credit/Debit Card                                 │
│   Visa, Mastercard, Rupay                          │
│   💳 Secure payment                                 │
└─────────────────────────────────────────────────────┘

[← Back]  [Place Order]
```

**Payment Method Details:**

1. **Cash on Delivery (COD)**
   - No advance payment
   - Pay cash to delivery person
   - Available for all pin codes
   - No extra charges

2. **UPI Payment**
   - Enter UPI ID or scan QR code
   - Instant payment confirmation
   - Supports all UPI apps

3. **Credit/Debit Card**
   - Enter card details securely
   - 3D secure authentication
   - Supports Visa, Mastercard, Rupay

### Step 3: Place Order

**Clicking "Place Order":**
1. Order validated on backend
2. Stock checked for all items
3. Prices recalculated (security measure)
4. Order created in database
5. Cart cleared
6. Confirmation page shown

**Order Creation Request:**
```javascript
// Frontend: Place order
const handlePlaceOrder = async () => {
  try {
    const orderData = {
      phone: user.phone,
      address_id: selectedAddress.id,
      payment_method: selectedPayment.id,
      coupon_code: appliedCoupon?.code,
      items: cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }))
    };
    
    const response = await orderService.createOrder(orderData);
    
    if (response.success) {
      setOrderId(response.order.order_id);
      await clearCart();
      setCurrentStep(3); // Show confirmation
    }
  } catch (error) {
    showToast('Failed to place order', 'error');
  }
};
```

```python
# Backend: Create order
@order_bp.route('/', methods=['POST'])
def create_order():
    data = request.get_json()
    
    # Calculate total (server-side for security)
    calculation = calculate_order_total(
        items=data['items'],
        coupon=data.get('coupon_code')
    )
    
    if not calculation['success']:
        return jsonify(calculation), 400
    
    # Generate order ID
    order_id = generate_order_id()  # e.g., QC1707654321ABC
    
    # Create order in database
    order = db.execute_query("""
        INSERT INTO orders (
            order_id, user_id, address_id,
            payment_method, subtotal, discount,
            delivery_fee, handling_fee, total,
            status, coupon_code
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
        ) RETURNING *
    """, (
        order_id, user_id, address_id,
        payment_method, subtotal, discount,
        delivery_fee, handling_fee, total,
        'pending', coupon_code
    ))
    
    # Save order items
    for item in calculation['items']:
        db.execute_query("""
            INSERT INTO order_items (
                order_id, product_id, product_name,
                product_price, quantity, total_price
            ) VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            order_id, item['product_id'],
            item['product_name'], item['product_price'],
            item['quantity'], item['total_price']
        ))
    
    # Clear user's cart
    db.execute_query("""
        DELETE FROM cart_items WHERE user_id = %s
    """, (user_id,))
    
    return jsonify({
        "success": True,
        "order": dict(order[0]),
        "message": "Order placed successfully!"
    })
```

---

## Address Management

### Viewing Saved Addresses

**Access Addresses:**
- From checkout page
- From account settings

**Address List:**
```
Saved Addresses
├── Home (Default) [Edit] [Delete]
│   John Doe, 9876543210
│   123 Main Street, Koramangala
│   Bengaluru, Karnataka - 560034
│
├── Office [Edit] [Delete] [Set as Default]
│   John Doe, 9876543210
│   45 Tech Park, Whitefield
│   Bengaluru, Karnataka - 560066
│
└── [+ Add New Address]
```

### Adding New Address

**Step 1: Click "Add New Address"**

**Step 2: Fill Address Form**
```
┌─────────────────────────────────────────┐
│ Add Delivery Address                    │
├─────────────────────────────────────────┤
│ Full Name *                             │
│ ┌─────────────────────────────────────┐ │
│ │ John Doe                            │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Phone Number *                          │
│ ┌─────────────────────────────────────┐ │
│ │ 9876543210                          │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ House/Flat/Building *                   │
│ ┌─────────────────────────────────────┐ │
│ │ 123 Main Street                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Area/Locality *                         │
│ ┌─────────────────────────────────────┐ │
│ │ Koramangala                         │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ City *                                  │
│ ┌─────────────────────────────────────┐ │
│ │ Bengaluru                           │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Pincode *                               │
│ ┌─────────────────────────────────────┐ │
│ │ 560034                              │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Address Type                            │
│ ● Home  ○ Office  ○ Other              │
│                                         │
│ [📍 Detect Location]  [Cancel] [Save]   │
└─────────────────────────────────────────┘
```

**Step 3: Validation**
- Name: Letters and spaces only
- Phone: 10 digits, starts with 6-9
- Pincode: 6 digits
- All required fields must be filled

**Step 4: Save Address**
- Saved to database
- Available for future orders
- Can be edited/deleted later

### Editing Address

**Step 1: Click "Edit" on address card**

**Step 2: Modify details**
- Same form as add address
- Pre-filled with existing data

**Step 3: Save Changes**
- Updated in database
- Reflects in address list

### Deleting Address

**Step 1: Click "Delete" on address card**

**Step 2: Confirmation**
```
Delete Address?
Are you sure you want to delete this address?

John Doe, 9876543210
123 Main Street, Koramangala
Bengaluru, Karnataka - 560034

[Cancel]  [Delete]
```

**Step 3: Address Removed**
- Deleted from database
- Cannot be recovered

---

## Payment Methods

### Cash on Delivery (COD)

**How It Works:**
1. Select COD at checkout
2. Place order (no advance payment)
3. Receive order at doorstep
4. Pay cash to delivery person

**Benefits:**
- No online payment required
- No transaction fees
- Available for all orders

**Limitations:**
- Not available for high-value orders (>₹5000)
- Exact change recommended

### UPI Payment

**How It Works:**
1. Select UPI at checkout
2. Enter UPI ID (e.g., username@bank)
3. Approve payment in UPI app
4. Instant payment confirmation

**Supported Apps:**
- Google Pay (GPay)
- PhonePe
- Paytm
- BHIM UPI
- Bank UPI apps

**Benefits:**
- Instant payment
- Secure and encrypted
- Direct bank transfer
- No card details needed

### Credit/Debit Card

**How It Works:**
1. Select Card at checkout
2. Enter card details:
   - Card number (16 digits)
   - Cardholder name
   - Expiry date (MM/YY)
   - CVV (3 digits on back)
3. Complete 3D Secure authentication
4. Payment processed

**Supported Cards:**
- Visa
- Mastercard
- Rupay
- American Express (selected)

**Security:**
- PCI DSS compliant
- 3D Secure (Verified by Visa, Mastercard SecureCode)
- Encrypted transmission
- No card details stored

---

## Order Confirmation

### Success Page

```
┌─────────────────────────────────────────────────────┐
│            ✓ Order Placed Successfully!             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Order ID: QC1707654321ABC                          │
│  Total: ₹346.30                                     │
│  Payment: Cash on Delivery                          │
│                                                     │
│  Estimated Delivery:                                │
│  Tomorrow, 10:00 AM - 12:00 PM                      │
│                                                     │
│  Delivery Address:                                  │
│  John Doe, 9876543210                               │
│  123 Main Street, Koramangala                       │
│  Bengaluru, Karnataka - 560034                      │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │ Track Order                                   │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  [Continue Shopping]  [View Order Details]          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Order Confirmation Email/SMS

**Email Content:**
```
Subject: Order Confirmed - QC1707654321ABC

Hi John,

Your order has been confirmed!

Order Details:
- Order ID: QC1707654321ABC
- Total: ₹346.30
- Items: 3 products

Delivery Address:
123 Main Street, Koramangala
Bengaluru, Karnataka - 560034

Estimated Delivery:
Tomorrow, 10:00 AM - 12:00 PM

Track your order: https://quickcart.com/orders/QC1707654321ABC

Thank you for shopping with QuickCart!
```

**SMS Content:**
```
QuickCart: Order QC1707654321ABC confirmed!
₹346.30 | COD
Delivery tomorrow 10AM-12PM
Track: quickcart.com/orders/QC1707654321ABC
```

### Next Steps After Order

1. **Track Order**: Monitor order status in real-time
2. **Prepare for Delivery**: Ensure someone is available
3. **Arrange Payment**: Keep cash ready for COD
4. **Check Order Details**: Review items and address

---

## Troubleshooting

### Common Issues

#### 1. "Product out of stock"

**Problem:** Item shows in stock but can't add to cart

**Solutions:**
- Refresh page to get latest stock
- Stock may have just sold out
- Try adding lower quantity
- Check back later for restock

#### 2. "Failed to add item to cart"

**Problem:** Add to cart button not working

**Solutions:**
- Check internet connection
- Log in if session expired
- Clear browser cache
- Try different browser
- Contact support if persists

#### 3. Cart not syncing across devices

**Problem:** Cart empty on different device

**Solutions:**
- Ensure logged in with same account
- Check if items are still in stock
- Wait a few seconds for sync
- Manually refresh cart

#### 4. Coupon not applying

**Problem:** Coupon code not accepted

**Solutions:**
- Check code spelling (case-sensitive)
- Verify minimum order amount
- Ensure coupon not expired
- Check if coupon applies to your items
- Try different coupon

#### 5. Can't proceed to checkout

**Problem:** Checkout button disabled

**Solutions:**
- Add items to cart (must have at least 1)
- Log in to your account
- Check if all items are available
- Verify delivery location is serviceable

#### 6. Address not saving

**Problem:** New address won't save

**Solutions:**
- Fill all required fields (marked *)
- Verify phone number format (10 digits)
- Check pincode (6 digits)
- Ensure name has only letters
- Try shorter address text

#### 7. Payment failed

**Problem:** Payment not processing

**Solutions:**

**For UPI:**
- Check UPI ID spelling
- Ensure sufficient balance
- Approve payment in UPI app within time
- Try different UPI app

**For Card:**
- Verify card details (number, CVV, expiry)
- Complete 3D Secure authentication
- Check if card allows online payments
- Contact bank if card declined

**General:**
- Try different payment method
- Use COD as alternative
- Contact support for assistance

#### 8. Order confirmation not received

**Problem:** No email/SMS after order

**Solutions:**
- Check spam/junk folder
- Verify phone number/email in profile
- Check order in "My Orders" section
- Wait a few minutes (may be delayed)
- Contact support with order ID

### Getting Help

**Customer Support:**
- **Email:** support@quickcart.com
- **Phone:** 1800-123-4567 (10 AM - 6 PM)
- **Chat:** Available on website
- **Response Time:** Within 24 hours

**Self-Service:**
- Check [FAQ](../FAQ.md)
- View [Order Tracking Guide](USER_05_ORDER_TRACKING.md)
- Read [Account Management](USER_08_ACCOUNT_MANAGEMENT.md)

---

## Summary

### Key Points

✅ **Cart Management**
- Add items from product cards or details page
- Update quantities with stepper controls
- Remove items individually
- Cart syncs for logged-in users

✅ **Pricing**
- Transparent pricing with breakdown
- Free delivery above ₹99
- Multiple coupon types supported
- Prices calculated on backend (secure)

✅ **Checkout Process**
- 3-step checkout flow
- Address selection/addition
- Multiple payment methods
- Instant order confirmation

✅ **Security**
- Server-side price calculation
- Stock validation on backend
- Secure payment processing
- No card details stored

### Best Practices

**For Users:**
- Keep saved addresses up to date
- Apply coupons before checkout
- Verify order details before placing
- Save order ID for tracking

**For Smooth Experience:**
- Log in before adding items
- Check delivery area availability
- Have payment method ready
- Provide correct contact details

---

**Related Documentation:**
- [USER_03_SHOPPING_GUIDE.md](USER_03_SHOPPING_GUIDE.md) - How to browse and search products
- [USER_05_ORDER_TRACKING.md](USER_05_ORDER_TRACKING.md) - Track your orders
- [USER_08_ACCOUNT_MANAGEMENT.md](USER_08_ACCOUNT_MANAGEMENT.md) - Manage your account
- [BACKEND_01_API_DOCUMENTATION.md](BACKEND_01_API_DOCUMENTATION.md) - Cart/Order API reference

**Last Updated:** February 2026  
**Document Maintainer:** QuickCart Documentation Team
