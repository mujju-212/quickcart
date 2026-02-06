# User Guide: Order Tracking & Management

**Document Version:** 1.0  
**Last Updated:** February 2026  
**Target Audience:** End Users, Customer Support  
**Related Documents:** [USER_04_CART_CHECKOUT.md](USER_04_CART_CHECKOUT.md), [USER_08_ACCOUNT_MANAGEMENT.md](USER_08_ACCOUNT_MANAGEMENT.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Accessing Your Orders](#accessing-your-orders)
3. [Order Status Lifecycle](#order-status-lifecycle)
4. [Tracking Your Order](#tracking-your-order)
5. [Order Details](#order-details)
6. [Order Timeline](#order-timeline)
7. [Download Invoice](#download-invoice)
8. [Order Actions](#order-actions)
9. [Delivery Information](#delivery-information)
10. [Troubleshooting](#troubleshooting)

---

## Overview

QuickCart provides real-time order tracking so you can monitor your purchases from placement to delivery. Track multiple orders, view detailed timelines, and download invoices—all from your account dashboard.

### Key Features

- **Real-time Tracking**: Live status updates for your orders
- **Order History**: View all past and current orders
- **Detailed Timeline**: 5-stage tracking with timestamps
- **Invoice Download**: Professional PDF invoices
- **Order Search**: Find orders by ID, date, or status
- **Status Notifications**: Email/SMS alerts for status changes

### Tracking Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Order Tracking System                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  User Dashboard        Order Service         Database      │
│       │                     │                     │         │
│       │  View Orders        │                     │         │
│       ├────────────────────>│  GET /orders        │         │
│       │                     ├────────────────────>│         │
│       │                     │  Fetch orders       │         │
│       │  Order List         │  + timeline         │         │
│       │<────────────────────┤<────────────────────┤         │
│       │                     │                     │         │
│       │  Track Order        │  GET /orders/:id    │         │
│       ├────────────────────>├────────────────────>│         │
│       │  Order Details      │  Order + items      │         │
│       │<────────────────────┤<────────────────────┤         │
│       │  + Timeline         │  + timeline         │         │
│       │                     │                     │         │
│  Admin Panel                │  Update Status      │         │
│       │                     │  POST /orders/      │         │
│       │                     │  update-status      │         │
│       │                     ├────────────────────>│         │
│       │                     │  Insert timeline    │         │
│       │                     │  Send notification  │         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Accessing Your Orders

### From Account Dashboard

**Step 1: Navigate to Account**
- Click on your profile icon in header
- Select "My Account" from dropdown

**Step 2: Go to Orders Section**
```
My Account
├── Dashboard
├── Profile
├── Orders          ← Click here
├── Addresses
└── Wishlist
```

### Direct URL Access

Navigate directly to: `https://quickcart.com/account/orders`

### From Order Confirmation

**After placing an order:**
- Click "Track Order" on confirmation page
- Or click "View Order Details"

### From Email/SMS

**Order confirmation includes:**
- Direct tracking link
- Order ID for manual search
```
Track your order: 
https://quickcart.com/orders/QC1707654321ABC
```

---

## Order Status Lifecycle

### Status Flow Diagram

```
┌────────────────────────────────────────────────────────────┐
│                     Order Status Flow                      │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  PENDING                                                   │
│    ↓                                                       │
│  CONFIRMED                                                 │
│    ↓                                                       │
│  PREPARING                                                 │
│    ↓                                                       │
│  OUT FOR DELIVERY                                          │
│    ↓                                                       │
│  DELIVERED   ✓                                             │
│                                                            │
│  (Any stage)  →  CANCELLED  ✗                             │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Status Definitions

| Status | Description | Typical Duration | What's Happening |
|--------|-------------|------------------|------------------|
| **Pending** | Order received | 5-10 minutes | Payment verification, order review |
| **Confirmed** | Order accepted | 10-30 minutes | Assigned to warehouse, inventory check |
| **Preparing** | Being packed | 30-60 minutes | Items picked, quality checked, packed |
| **Out for Delivery** | On the way | 1-3 hours | With delivery partner, en route |
| **Delivered** | Completed | - | Successfully delivered to customer |
| **Cancelled** | Order cancelled | - | Cancelled by user or system |

### Status Colors

Each status has a visual indicator:

- 🟡 **Pending** (Yellow) - Awaiting confirmation
- 🔵 **Confirmed** (Blue) - Accepted by seller
- 🟠 **Preparing** (Orange) - Being prepared
- 🟣 **Out for Delivery** (Purple) - In transit
- 🟢 **Delivered** (Green) - Successfully delivered
- 🔴 **Cancelled** (Red) - Order cancelled

---

## Tracking Your Order

### Orders List View

```
┌─────────────────────────────────────────────────────────────┐
│  My Orders (12 orders)                   [Search: ___]      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Order #QC1707654321ABC            🟠 Out for Delivery│  │
│  │ Placed: Feb 2, 2026 10:30 AM         Total: ₹346.30 │  │
│  │                                                       │  │
│  │ [Item 1] [Item 2] [Item 3]  (+2 more items)         │  │
│  │                                                       │  │
│  │ Estimated Delivery: Today, 2:00 PM - 4:00 PM         │  │
│  │                                                       │  │
│  │ [Track Order] [View Details] [Download Invoice]      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Order #QC1707598765XYZ            🟢 Delivered       │  │
│  │ Placed: Jan 28, 2026 3:45 PM         Total: ₹523.40 │  │
│  │                                                       │  │
│  │ [Item 1] [Item 2]                                    │  │
│  │                                                       │  │
│  │ Delivered: Jan 29, 2026 11:20 AM                     │  │
│  │                                                       │  │
│  │ [View Details] [Reorder] [Download Invoice]          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Filtering Orders

**Filter Options:**
- **All Orders** - Show everything
- **Active** - Pending, Confirmed, Preparing, Out for Delivery
- **Completed** - Delivered orders
- **Cancelled** - Cancelled orders

**Date Range:**
- Last 30 days (default)
- Last 3 months
- Last 6 months
- Custom date range

### Searching Orders

**Search by:**
- Order ID (e.g., QC1707654321ABC)
- Product name
- Order date
- Total amount range

```javascript
// Frontend: Fetch and filter orders
const Orders = ({ orders }) => {
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    let filtered = orders;
    
    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => 
        order.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }
    
    // Search by order ID or product name
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items?.some(item => 
          item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    setFilteredOrders(filtered);
  }, [orders, filterStatus, searchTerm]);
  
  return (
    // Render filtered orders
  );
};
```

---

## Order Details

### Detailed Order View

Clicking "View Details" shows complete order information:

```
┌─────────────────────────────────────────────────────────────┐
│  Order #QC1707654321ABC                                     │
│  Status: Out for Delivery 🟠                                │
│  Placed: Feb 2, 2026 10:30 AM                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📦 ORDER ITEMS (3 items)                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ [Image] Fresh Apples                        ₹99.00    │  │
│  │         500g  •  Qty: 2                   = ₹198.00   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ [Image] Amul Milk                           ₹49.00    │  │
│  │         1L    •  Qty: 1                   = ₹49.00    │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ [Image] Whole Wheat Bread                   ₹40.00    │  │
│  │         400g  •  Qty: 1                   = ₹40.00    │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  💰 PAYMENT SUMMARY                                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Subtotal (3 items)                          ₹287.00   │  │
│  │ Delivery Fee                                ₹29.00    │  │
│  │ Handling Fee                                ₹5.00     │  │
│  │ Discount (WELCOME10)                       -₹28.70    │  │
│  │ ─────────────────────────────────────────────────     │  │
│  │ Total Paid                                  ₹292.30   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  🏠 DELIVERY ADDRESS                                        │
│  John Doe, 9876543210                                       │
│  123 Main Street, Koramangala                               │
│  Bengaluru, Karnataka - 560034                              │
│                                                             │
│  💳 PAYMENT METHOD                                          │
│  Cash on Delivery                                           │
│                                                             │
│  [Download Invoice] [Track Order] [Need Help?]              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Order Information Breakdown

**Order Header:**
- Order ID (unique identifier)
- Current status with badge
- Order placed date/time
- Estimated delivery time

**Order Items:**
- Product images (60x60px thumbnails)
- Product name and size
- Unit price and quantity
- Line total for each item

**Payment Summary:**
- Subtotal (before fees/discounts)
- Delivery fee (₹0 if free delivery)
- Handling fee (₹5 fixed)
- Applied discount (coupon code shown)
- Final total paid

**Additional Information:**
- Delivery address (name, phone, full address)
- Payment method (COD, UPI, Card)
- Order notes (if any)

---

## Order Timeline

### Visual Timeline Component

```
┌─────────────────────────────────────────────────────────────┐
│  ORDER TRACKING TIMELINE                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✓ Order Placed                                             │
│    Feb 2, 2026 10:30 AM                                     │
│    Your order has been received                             │
│    │                                                        │
│    ●                                                        │
│    │                                                        │
│  ✓ Confirmed                                                │
│    Feb 2, 2026 10:35 AM                                     │
│    Order confirmed by seller                                │
│    │                                                        │
│    ●                                                        │
│    │                                                        │
│  ✓ Preparing                                                │
│    Feb 2, 2026 11:15 AM                                     │
│    Your order is being prepared                             │
│    │                                                        │
│    ●  ← Current Status                                      │
│    │                                                        │
│  ○ Out for Delivery                                         │
│    Pending                                                  │
│    Your order will be on the way soon                       │
│    │                                                        │
│    ○                                                        │
│    │                                                        │
│  ○ Delivered                                                │
│    Pending                                                  │
│    Order will be delivered to your address                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Timeline Stages

**1. Order Placed (Pending)**
- ✓ **Timestamp:** Order creation time
- **Description:** "Your order has been received"
- **Icon:** 🛒 Shopping cart
- **Auto-triggered:** When order is created

**2. Confirmed**
- ✓ **Timestamp:** Admin confirmation time
- **Description:** "Order confirmed by seller"
- **Icon:** ✓ Check circle
- **Triggered by:** Admin accepts order

**3. Preparing**
- ✓ **Timestamp:** Preparation start time
- **Description:** "Your order is being prepared"
- **Icon:** 📦 Box
- **Triggered by:** Items being packed

**4. Out for Delivery**
- ✓ **Timestamp:** Dispatch time
- **Description:** "Your order is on the way"
- **Icon:** 🚚 Truck
- **Triggered by:** Order handed to delivery partner

**5. Delivered**
- ✓ **Timestamp:** Delivery completion time
- **Description:** "Order successfully delivered"
- **Icon:** ✓✓ Double check
- **Triggered by:** Delivery confirmation

### Timeline Data Structure

```javascript
// Frontend: Render timeline
const OrderTimeline = ({ status, timeline = [] }) => {
  const orderStatuses = [
    {
      key: 'pending',
      label: 'Order Placed',
      icon: 'fas fa-shopping-cart',
      description: 'Your order has been received'
    },
    {
      key: 'confirmed',
      label: 'Confirmed',
      icon: 'fas fa-check-circle',
      description: 'Order confirmed by seller'
    },
    {
      key: 'preparing',
      label: 'Preparing',
      icon: 'fas fa-box',
      description: 'Your order is being prepared'
    },
    {
      key: 'out_for_delivery',
      label: 'Out for Delivery',
      icon: 'fas fa-shipping-fast',
      description: 'Your order is on the way'
    },
    {
      key: 'delivered',
      label: 'Delivered',
      icon: 'fas fa-check-double',
      description: 'Order successfully delivered'
    }
  ];
  
  // Find current status index
  const currentStatusIndex = orderStatuses.findIndex(
    s => s.key === status?.toLowerCase()
  );
  
  return (
    <div className="order-timeline">
      {orderStatuses.map((statusItem, index) => {
        const timelineEntry = timeline.find(
          t => t.status?.toLowerCase() === statusItem.key
        );
        const isCompleted = currentStatusIndex >= index;
        const isCurrent = currentStatusIndex === index;
        
        return (
          <div 
            className={`timeline-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
          >
            <div className="timeline-icon">
              <i className={statusItem.icon}></i>
            </div>
            <div className="timeline-content">
              <h6>{statusItem.label}</h6>
              <p>{statusItem.description}</p>
              {timelineEntry?.timestamp && (
                <span className="timeline-date">
                  {new Date(timelineEntry.timestamp).toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
```

```python
# Backend: Get order with timeline
@order_bp.route('/<order_id>', methods=['GET'])
@token_required
def get_order_by_id(current_user, order_id):
    # Get order details
    order = db.execute_query_one("""
        SELECT o.*, 
               JSON_AGG(
                   JSON_BUILD_OBJECT(
                       'product_id', oi.product_id,
                       'product_name', oi.product_name,
                       'quantity', oi.quantity,
                       'price', oi.product_price,
                       'total', oi.total_price
                   )
               ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.id = %s
        GROUP BY o.id
    """, (order_id,))
    
    # Get timeline
    timeline = db.execute_query("""
        SELECT status, timestamp, completed, notes 
        FROM order_timeline 
        WHERE order_id = %s 
        ORDER BY timestamp ASC
    """, (order_id,), fetch=True)
    
    order['timeline'] = [dict(t) for t in timeline]
    
    return jsonify({
        "success": True,
        "order": dict(order)
    })
```

### Cancelled Order Timeline

**If order is cancelled:**
```
┌─────────────────────────────────────────────────────────────┐
│  ✗ Order Cancelled                                          │
│    Feb 2, 2026 11:45 AM                                     │
│    This order has been cancelled                            │
│    Reason: Customer requested cancellation                  │
│                                                             │
│    Refund Status: Processed                                 │
│    Refund Amount: ₹346.30                                   │
│    Expected in 5-7 business days                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Download Invoice

### Invoice Features

**Professional PDF Invoice includes:**
- Company branding (QuickCart logo)
- Invoice number (same as order ID)
- Invoice date (order date)
- Billing/delivery address
- Itemized product list with prices
- Tax breakdown (if applicable)
- Payment method
- Terms and conditions

### Downloading Invoice

**Step 1: Access Invoice**
- From order details page
- Click "Download Invoice" button

**Step 2: PDF Generation**
- Professional invoice generated using jsPDF
- Auto-downloads to your device
- Filename: `Invoice_QC1707654321ABC.pdf`

**Invoice Sample:**
```
┌─────────────────────────────────────────────────────────────┐
│  [LOGO]  QuickCart                                          │
│          Your One-Stop Shop for Everything                  │
│          www.quickcart.com | support@quickcart.com          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TAX INVOICE                      Invoice #: QC1707654321ABC│
│                                   Date: Feb 2, 2026         │
│                                                             │
│  BILL TO:                         SHIP TO:                  │
│  John Doe                         John Doe                  │
│  9876543210                       123 Main Street           │
│                                   Koramangala               │
│                                   Bengaluru, KA - 560034    │
│                                                             │
│  ITEMS:                                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Product      Size  Qty  Price    Total             │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ Fresh Apples 500g  2    ₹99.00   ₹198.00          │   │
│  │ Amul Milk    1L    1    ₹49.00   ₹49.00           │   │
│  │ Wheat Bread  400g  1    ₹40.00   ₹40.00           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Subtotal:                                      ₹287.00     │
│  Delivery Fee:                                  ₹29.00      │
│  Handling Fee:                                  ₹5.00       │
│  Discount (WELCOME10):                         -₹28.70      │
│  ─────────────────────────────────────────────────────      │
│  TOTAL:                                         ₹292.30     │
│                                                             │
│  Payment Method: Cash on Delivery                           │
│                                                             │
│  Thank you for shopping with QuickCart!                     │
│  For support: support@quickcart.com | 1800-123-4567         │
└─────────────────────────────────────────────────────────────┘
```

### Invoice Generation Code

```javascript
// Frontend: Generate PDF invoice
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const generateInvoice = (order) => {
  const doc = new jsPDF();
  
  // Header with logo
  doc.setFillColor(255, 224, 27);
  doc.rect(0, 0, 210, 45, 'F');
  
  doc.setFontSize(26);
  doc.setTextColor(0, 0, 0);
  doc.text('QuickCart', 35, 20);
  
  doc.setFontSize(9);
  doc.text('Your One-Stop Shop for Everything', 35, 26);
  
  // Invoice title
  doc.setFontSize(18);
  doc.text('TAX INVOICE', 20, 65);
  
  // Invoice details
  doc.setFontSize(9);
  doc.text(`Invoice #: ${order.id}`, 140, 65);
  doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 140, 70);
  
  // Billing and shipping info
  doc.text('BILL TO:', 20, 85);
  doc.text(order.user_name, 20, 90);
  doc.text(order.phone, 20, 95);
  
  doc.text('SHIP TO:', 120, 85);
  const address = order.delivery_address.split('\n');
  address.forEach((line, i) => {
    doc.text(line, 120, 90 + (i * 5));
  });
  
  // Items table
  const items = order.items.map(item => [
    item.product_name,
    item.size || 'N/A',
    item.quantity,
    `₹${item.product_price.toFixed(2)}`,
    `₹${item.total_price.toFixed(2)}`
  ]);
  
  doc.autoTable({
    startY: 110,
    head: [['Product', 'Size', 'Qty', 'Price', 'Total']],
    body: items,
    theme: 'grid'
  });
  
  // Pricing summary
  let finalY = doc.lastAutoTable.finalY + 10;
  doc.text(`Subtotal: ₹${order.subtotal.toFixed(2)}`, 150, finalY, { align: 'right' });
  doc.text(`Delivery: ₹${order.delivery_fee.toFixed(2)}`, 150, finalY + 5, { align: 'right' });
  if (order.discount > 0) {
    doc.text(`Discount: -₹${order.discount.toFixed(2)}`, 150, finalY + 10, { align: 'right' });
    finalY += 5;
  }
  doc.text(`Total: ₹${order.total.toFixed(2)}`, 150, finalY + 15, { align: 'right' });
  
  // Footer
  doc.text('Thank you for shopping with QuickCart!', 105, finalY + 30, { align: 'center' });
  
  // Save PDF
  doc.save(`Invoice_${order.id}.pdf`);
};
```

---

## Order Actions

### Available Actions by Status

| Status | Available Actions |
|--------|-------------------|
| **Pending** | Cancel Order, Contact Support |
| **Confirmed** | Cancel Order (within 5 min), Contact Support |
| **Preparing** | Contact Support |
| **Out for Delivery** | Track in Real-time, Contact Support |
| **Delivered** | Reorder, Leave Review, Download Invoice |
| **Cancelled** | View Refund Status, Reorder |

### Reordering

**Quick Reorder:**
- Click "Reorder" button on order card
- All items added to cart
- Proceed to checkout

```javascript
// Frontend: Reorder functionality
const handleReorder = async (order) => {
  try {
    // Add all order items to cart
    for (const item of order.items) {
      await addToCart({
        id: item.product_id,
        name: item.product_name,
        price: item.product_price
      }, item.quantity);
    }
    
    showToast('Items added to cart!', 'success');
    navigate('/cart');
  } catch (error) {
    showToast('Failed to reorder', 'error');
  }
};
```

### Cancelling Order

**Cancellation Window:**
- ✅ **Pending**: Can cancel anytime
- ✅ **Confirmed**: Can cancel within 5 minutes
- ❌ **Preparing/Later**: Cannot cancel (contact support)

**Step 1: Click "Cancel Order"**

**Step 2: Confirmation Dialog**
```
┌─────────────────────────────────────────────────────┐
│  Cancel Order?                                      │
│                                                     │
│  Are you sure you want to cancel this order?        │
│  Order #QC1707654321ABC                             │
│  Total: ₹346.30                                     │
│                                                     │
│  Select reason:                                     │
│  ○ Ordered by mistake                               │
│  ● Want to change address                           │
│  ○ Found better price elsewhere                     │
│  ○ Delivery time too long                           │
│  ○ Other reason                                     │
│                                                     │
│  [Go Back]  [Confirm Cancellation]                  │
└─────────────────────────────────────────────────────┘
```

**Step 3: Cancellation Processed**
- Order status changed to "Cancelled"
- Refund initiated (if paid online)
- Confirmation email/SMS sent

### Contacting Support

**From Order Page:**
- Click "Need Help?" button
- Pre-fills order ID in support form
- Options:
  - Track order issue
  - Delivery delay
  - Product quality
  - Refund inquiry
  - Other

---

## Delivery Information

### Estimated Delivery Time

**Calculation:**
- **Standard**: Next day (10 AM - 12 PM)
- **Express**: Same day (if ordered before 12 PM)
- **Slot-based**: User-selected time slot

**Display Format:**
```
Estimated Delivery:
Tomorrow, Feb 3
10:00 AM - 12:00 PM
```

### Delivery Partner

**Information Shown:**
- Partner name (e.g., "QuickCart Express")
- Delivery person name (when assigned)
- Contact number (when out for delivery)
- Live tracking link

### Delivery Instructions

**Add during checkout:**
- "Leave at door"
- "Call before delivery"
- "Ring doorbell"
- "Contact security first"

---

## Troubleshooting

### Common Issues

#### 1. "Order not showing in My Orders"

**Problem:** Recently placed order not visible

**Solutions:**
- Wait 2-3 minutes for database sync
- Refresh the page
- Check spam/junk for order confirmation email
- Verify you're logged in with correct account
- Contact support with order ID

#### 2. "Status not updating"

**Problem:** Order status hasn't changed in hours

**Solutions:**
- Refresh page to get latest status
- Check if it's within normal time window
- Contact support if delay exceeds 24 hours
- Check email for any update notifications

#### 3. "Cannot download invoice"

**Problem:** Invoice download failing

**Solutions:**
- Check browser pop-up blocker
- Try different browser
- Clear browser cache
- Wait until order is delivered
- Contact support for email copy

#### 4. "Wrong delivery address"

**Problem:** Order going to old/wrong address

**Solutions:**
- Contact support immediately
- If status is "Pending", might be updatable
- Cannot change after "Out for Delivery"
- May need to cancel and reorder

#### 5. "Delivery delayed"

**Problem:** Order not delivered by estimated time

**Solutions:**
- Check order timeline for updates
- Contact delivery partner (if number provided)
- Call customer support
- Delays of 2-4 hours are common during peak
- Escalate if delayed >24 hours

#### 6. "Item missing from delivered order"

**Problem:** Received order but items missing

**Solutions:**
- Check all bags/packages carefully
- Compare with order details
- Contact support within 24 hours
- Provide photos if possible
- Refund/replacement will be processed

#### 7. "Cannot cancel order"

**Problem:** Cancel button disabled/not working

**Solutions:**
- Check if past cancellation window
- Confirmed orders: 5-minute window only
- Contact support for special cancellation
- May incur cancellation fee if already shipped

### Getting Real-time Help

**Customer Support:**
- **Phone:** 1800-123-4567 (24/7)
- **Email:** support@quickcart.com
- **Live Chat:** Available on website (9 AM - 9 PM)
- **WhatsApp:** +91 98765 43210

**Self-Service Options:**
- Check [FAQ](../FAQ.md)
- View [User Guide](USER_01_GETTING_STARTED.md)
- Read [Checkout Guide](USER_04_CART_CHECKOUT.md)

---

## Summary

### Key Points

✅ **Access Orders**
- From account dashboard
- Direct URL or email link
- Search by order ID

✅ **Track Status**
- 5-stage timeline (Pending → Delivered)
- Real-time status updates
- Email/SMS notifications

✅ **Order Details**
- Complete item list
- Payment summary
- Delivery information
- Timeline with timestamps

✅ **Actions Available**
- Download PDF invoice
- Reorder items
- Cancel (if eligible)
- Contact support

### Best Practices

**For Users:**
- Save order ID for tracking
- Check email for status updates
- Download invoice after delivery
- Contact support early if issues
- Provide accurate delivery address

**For Smooth Delivery:**
- Be available during delivery window
- Keep phone accessible
- Have payment ready for COD
- Check items immediately on delivery
- Report issues within 24 hours

---

**Related Documentation:**
- [USER_04_CART_CHECKOUT.md](USER_04_CART_CHECKOUT.md) - Placing orders
- [USER_08_ACCOUNT_MANAGEMENT.md](USER_08_ACCOUNT_MANAGEMENT.md) - Managing account
- [ADMIN_03_ORDER_MANAGEMENT.md](ADMIN_03_ORDER_MANAGEMENT.md) - Admin order processing

**Last Updated:** February 2026  
**Document Maintainer:** QuickCart Documentation Team
