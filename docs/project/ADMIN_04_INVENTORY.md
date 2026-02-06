# Admin Guide: Inventory & Stock Management

**Document Version:** 1.0  
**Last Updated:** February 2026  
**Target Audience:** Admin Users, Inventory Managers  
**Related Documents:** [ADMIN_02_PRODUCT_MANAGEMENT.md](ADMIN_02_PRODUCT_MANAGEMENT.md)

---

## Overview

Manage product inventory: track stock levels, handle low stock alerts, and ensure product availability.

---

## Stock Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  Inventory Management                   [Export Stock Data] │
├─────────────────────────────────────────────────────────────┤
│  Alerts:                                                    │
│  🔴 Low Stock (15 items)  ⚠️ Out of Stock (3 items)        │
│                                                             │
│  Quick Stats:                                               │
│  • Total Products: 487                                      │
│  • In Stock: 469                                            │
│  • Low Stock: 15                                            │
│  • Out of Stock: 3                                          │
│  • Total Inventory Value: ₹2,45,890                         │
│                                                             │
│  [View Low Stock] [View Out of Stock] [Bulk Update]        │
└─────────────────────────────────────────────────────────────┘
```

---

## Viewing Stock Levels

### Product List with Stock

```
┌─────────────────────────────────────────────────────────────┐
│  Product              Category     Stock    Status    Action│
├─────────────────────────────────────────────────────────────┤
│  Fresh Apples         Fruits       150      ✅       [Edit] │
│  Amul Milk            Dairy        5        ⚠️       [Edit] │
│  Wheat Bread          Bakery       0        ❌       [Edit] │
└─────────────────────────────────────────────────────────────┘
```

**Status Indicators:**
- ✅ **In Stock**: Stock > 10
- ⚠️ **Low Stock**: Stock ≤ 10
- ❌ **Out of Stock**: Stock = 0

---

## Updating Stock

### Single Product Update

**Steps:**
1. Navigate to product (Admin → Products → Select Product)
2. Click "Edit" or "Update Stock"
3. Enter new stock quantity
4. Add reason (optional): "Restocked", "Sold", "Damaged"
5. Click "Update"

**Form:**
```
Update Stock
├── Product: Fresh Apples (500g)
├── Current Stock: 150
├── New Stock: [200___]
├── Reason: [Restocked from supplier]
└── [Cancel] [Update]
```

### Bulk Stock Update

**Upload CSV:**
1. Click "Bulk Update"
2. Download template CSV
3. Fill: product_id, stock_quantity
4. Upload CSV
5. Review changes
6. Confirm bulk update

**CSV Format:**
```csv
product_id,stock_quantity,reason
1,200,Restocked
2,50,Restocked
3,0,Discontinued
```

---

## Low Stock Alerts

### Configuration

**Set thresholds:**
- Low stock level: 10 (default)
- Critical stock level: 5
- Out of stock: 0

**Notification channels:**
- Email alerts
- Dashboard notifications
- SMS (optional)

### Low Stock Products

**View list:**
- Admin → Inventory → Low Stock

**Actions:**
- Reorder from supplier
- Update stock
- Mark as discontinued
- Increase price (limited stock)

---

## Stock History

### Track Stock Changes

**View history:**
- Product details → Stock History tab

```
┌─────────────────────────────────────────────────────────────┐
│  Stock History: Fresh Apples                                │
├─────────────────────────────────────────────────────────────┤
│  Date           Change     New Stock  Reason         By     │
│  Feb 2, 10:30   +50        200        Restocked     Admin   │
│  Feb 1, 15:45   -12        150        Sold          System  │
│  Feb 1, 09:00   +100       162        Restocked     Admin   │
└─────────────────────────────────────────────────────────────┘
```

### Automated Stock Adjustments

**Triggers:**
- Order placed: Decrease stock
- Order cancelled: Increase stock
- Order delivered: Confirm stock change
- Returns: Increase stock

```python
# Backend: Adjust stock on order
def adjust_stock_on_order(order_items, operation='decrease'):
    for item in order_items:
        if operation == 'decrease':
            db.execute_query("""
                UPDATE products 
                SET stock = stock - %s
                WHERE id = %s
            """, (item['quantity'], item['product_id']))
        elif operation == 'increase':
            db.execute_query("""
                UPDATE products 
                SET stock = stock + %s
                WHERE id = %s
            """, (item['quantity'], item['product_id']))
```

---

## Stock Reports

### Generate Reports

**Available reports:**
- Current stock levels (all products)
- Low stock report
- Out of stock report
- Stock movement report (date range)
- Inventory valuation

**Export formats:**
- PDF
- Excel
- CSV

---

## Reorder Management

### Reorder Points

**Set per product:**
- Reorder point: When stock hits this, reorder
- Reorder quantity: How much to order

**Example:**
```
Product: Fresh Apples
├── Current Stock: 8
├── Reorder Point: 10
├── Reorder Quantity: 50
└── Status: ⚠️ Below reorder point → Order 50 units
```

### Supplier Management

**Track suppliers:**
- Supplier name
- Contact info
- Products supplied
- Lead time
- Minimum order quantity

---

## Best Practices

**✅ Do:**
- Check stock daily
- Act on low stock alerts promptly
- Keep accurate records
- Plan for seasonal demand
- Track stock movement

**❌ Don't:**
- Allow stockouts
- Over-stock perishables
- Ignore low stock alerts
- Skip inventory audits
- Forget to update after restocking

---

## API Endpoints

```javascript
// Get all products with stock
GET /api/admin/products?include_stock=true

// Update product stock
PUT /api/admin/products/:id/stock
Body: { stock: 200, reason: "Restocked" }

// Get low stock products
GET /api/admin/inventory/low-stock

// Get stock history
GET /api/admin/products/:id/stock-history
```

---

**Related Documentation:**
- [ADMIN_02_PRODUCT_MANAGEMENT.md](ADMIN_02_PRODUCT_MANAGEMENT.md)
- [ADMIN_03_ORDER_MANAGEMENT.md](ADMIN_03_ORDER_MANAGEMENT.md)
- [BACKEND_02_DATABASE_SCHEMA.md](BACKEND_02_DATABASE_SCHEMA.md)
