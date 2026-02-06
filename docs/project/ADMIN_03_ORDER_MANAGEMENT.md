# Admin Guide: Order Management

**Document Version:** 1.0  
**Last Updated:** February 2026  
**Target Audience:** Admin Users, Operations Team  
**Related Documents:** [ADMIN_01_DASHBOARD_OVERVIEW.md](ADMIN_01_DASHBOARD_OVERVIEW.md), [ADMIN_04_INVENTORY.md](ADMIN_04_INVENTORY.md)

---

## Overview

Manage all customer orders from the admin panel: view, update status, process payments, and handle cancellations.

---

## Accessing Order Management

**Navigate to:** Admin Dashboard → Orders

**Or:** `/admin/orders`

---

## Orders Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  Order Management                          [Export Orders]  │
├─────────────────────────────────────────────────────────────┤
│  Filters: [Status ▼] [Date Range ▼] [Search: ___]          │
│                                                             │
│  Quick Stats:                                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Pending  │ │Processing│ │Delivered │ │Cancelled │      │
│  │    24    │ │    12    │ │   487    │ │    8     │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                             │
│  Recent Orders:                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ QC123...  John Doe      ₹346    🟡 Pending   [View]  │  │
│  │ QC456...  Jane Smith    ₹523    🔵 Confirmed [View]  │  │
│  │ QC789...  Bob Johnson   ₹234    🟢 Delivered [View]  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Order Details View

### Complete Order Information

```
┌─────────────────────────────────────────────────────────────┐
│  Order #QC1707654321ABC                      Status: 🟡     │
│  Customer: John Doe (9876543210)                            │
│  Date: Feb 2, 2026 10:30 AM                                 │
├─────────────────────────────────────────────────────────────┤
│  ITEMS (3):                                                 │
│  • Fresh Apples (500g) x2 - ₹198.00                         │
│  • Amul Milk (1L) x1 - ₹49.00                               │
│  • Wheat Bread (400g) x1 - ₹40.00                           │
│                                                             │
│  PAYMENT:                                                   │
│  Subtotal: ₹287.00  │  Delivery: ₹29.00  │  Total: ₹346.30 │
│  Method: COD                                                │
│                                                             │
│  DELIVERY ADDRESS:                                          │
│  123 Main Street, Koramangala, Bengaluru - 560034           │
│                                                             │
│  ACTIONS:                                                   │
│  [Update Status ▼] [Print Invoice] [Contact Customer]      │
└─────────────────────────────────────────────────────────────┘
```

---

## Updating Order Status

### Status Workflow

```
Pending → Confirmed → Preparing → Out for Delivery → Delivered
           ↓
       Cancelled
```

### Change Status

**Steps:**
1. Open order details
2. Click "Update Status" dropdown
3. Select new status
4. Add notes (optional)
5. Click "Update"

**Example:**
```
Update Order Status
├── Current: Pending
├── New Status: [Confirmed ▼]
├── Notes: [Inventory verified, ready to pack]
└── [Cancel] [Update Status]
```

### Status Change Triggers

**Automated Actions:**
- Email/SMS sent to customer
- Timeline updated
- Inventory adjusted (if applicable)
- Analytics updated

```python
# Backend: Update order status
@order_bp.route('/<order_id>/status', methods=['PUT'])
@admin_required
def update_order_status(current_user, order_id):
    data = request.get_json()
    new_status = data['status']
    notes = data.get('notes', '')
    
    # Update order
    db.execute_query("""
        UPDATE orders 
        SET status = %s, updated_at = CURRENT_TIMESTAMP
        WHERE id = %s
    """, (new_status, order_id))
    
    # Add timeline entry
    db.execute_query("""
        INSERT INTO order_timeline 
        (order_id, status, notes, completed)
        VALUES (%s, %s, %s, true)
    """, (order_id, new_status, notes))
    
    # Send notification
    send_status_update_notification(order_id, new_status)
    
    return jsonify({"success": True})
```

---

## Filtering & Searching

### Filter Options

**By Status:**
- All Orders
- Pending
- Confirmed
- Preparing
- Out for Delivery
- Delivered
- Cancelled

**By Date:**
- Today
- Last 7 days
- Last 30 days
- Custom range

**By Payment:**
- COD
- UPI
- Card
- All

### Search

**Search by:**
- Order ID
- Customer name
- Customer phone
- Product name

---

## Bulk Actions

### Select Multiple Orders

- Checkbox selection
- Select all (current page)
- Select by filter

**Available Actions:**
- Export to Excel/CSV
- Print invoices (batch)
- Update status (batch)
- Send notifications

---

## Order Analytics

### Quick Stats

- Total orders today
- Pending orders count
- Revenue today
- Average order value
- Delivery success rate

### Order Reports

**Generate reports:**
- Daily orders summary
- Weekly performance
- Monthly revenue
- Product-wise sales
- Customer-wise orders

**Export formats:** PDF, Excel, CSV

---

## Handling Special Cases

### Cancellations

**Customer-requested:**
1. Verify cancellation request
2. Update status to "Cancelled"
3. Process refund (if paid online)
4. Update inventory
5. Send confirmation

**Admin-initiated:**
- Add detailed cancellation reason
- Contact customer before cancelling
- Process full refund

### Refunds

**Process:**
1. Verify refund eligibility
2. Calculate refund amount
3. Initiate refund through payment gateway
4. Update order status
5. Notify customer (5-7 days for credit)

### Disputes

- Customer complaints
- Missing items
- Quality issues
- Wrong items delivered

**Resolution steps:**
1. Review order details
2. Contact customer
3. Investigate with delivery team
4. Decide: Refund / Replacement / Partial refund
5. Document resolution

---

## Communication

### Contact Customer

**From order page:**
- Click "Contact Customer"
- Pre-filled with order details
- Send via: Email / SMS / Call

**Templates:**
- Order confirmation
- Status update
- Delivery delay notification
- Cancellation notice

---

## Permissions

**Admin Roles:**

| Action | Admin | Operations | Support |
|--------|-------|------------|---------|
| View orders | ✅ | ✅ | ✅ |
| Update status | ✅ | ✅ | ❌ |
| Cancel orders | ✅ | ✅ | ❌ |
| Process refunds | ✅ | ❌ | ❌ |
| Export data | ✅ | ✅ | ❌ |

---

## API Endpoints

```javascript
// Get all orders (admin)
GET /api/admin/orders
Query: status, date_from, date_to, page

// Get order by ID
GET /api/admin/orders/:orderId

// Update order status
PUT /api/admin/orders/:orderId/status
Body: { status, notes }

// Cancel order
POST /api/admin/orders/:orderId/cancel
Body: { reason, refund }
```

---

## Best Practices

**✅ Do:**
- Update status promptly
- Add detailed notes
- Verify before cancelling
- Communicate with customers
- Monitor pending orders

**❌ Don't:**
- Skip status updates
- Cancel without verification
- Delay order processing
- Ignore customer queries

---

## Troubleshooting

**Order not appearing:**
- Check filters
- Verify date range
- Refresh page

**Cannot update status:**
- Check permissions
- Verify order exists
- Check network connection

**Export failing:**
- Reduce date range
- Check file format
- Try smaller batch

---

**Related Documentation:**
- [ADMIN_01_DASHBOARD_OVERVIEW.md](ADMIN_01_DASHBOARD_OVERVIEW.md)
- [ADMIN_02_PRODUCT_MANAGEMENT.md](ADMIN_02_PRODUCT_MANAGEMENT.md)
- [ADMIN_04_INVENTORY.md](ADMIN_04_INVENTORY.md)
- [BACKEND_01_API_DOCUMENTATION.md](BACKEND_01_API_DOCUMENTATION.md)
