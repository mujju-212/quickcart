# Admin Guide: Analytics & Reports

**Document Version:** 1.0  
**Last Updated:** February 2026  
**Target Audience:** Admin Users, Management  
**Related Documents:** [ADMIN_01_DASHBOARD_OVERVIEW.md](ADMIN_01_DASHBOARD_OVERVIEW.md)

---

## Overview

Monitor business performance with real-time analytics: sales trends, revenue insights, customer behavior, and product performance.

---

## Analytics Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  Analytics Overview                        [Date: Last 30d] │
├─────────────────────────────────────────────────────────────┤
│  Key Metrics:                                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Revenue  │ │  Orders  │ │Customers │ │   AOV    │      │
│  │ ₹2.4L    │ │   487    │ │   234    │ │  ₹493    │      │
│  │ +12% ↑   │ │ +8% ↑    │ │ +15% ↑   │ │ +5% ↑    │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                             │
│  Sales Trend (Last 7 days):                                 │
│  ₹40K │     ╱╲                                              │
│       │    ╱  ╲    ╱╲                                       │
│  ₹30K │   ╱    ╲  ╱  ╲                                      │
│       │  ╱      ╲╱    ╲                                     │
│  ₹20K │ ╱              ╲                                    │
│       └──────────────────────────                           │
│        Mon Tue Wed Thu Fri Sat Sun                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Sales Analytics

### Revenue Reports

**Metrics:**
- Total revenue
- Daily/Weekly/Monthly revenue
- Revenue by payment method
- Revenue by category
- Growth rate

**Charts:**
- Line chart: Revenue over time
- Bar chart: Revenue by category
- Pie chart: Payment method distribution

### Order Analytics

**Metrics:**
- Total orders
- Average order value (AOV)
- Orders by status
- Conversion rate
- Repeat purchase rate

**Time filters:**
- Today / Yesterday
- Last 7 / 30 / 90 days
- This month / Last month
- Custom date range

---

## Product Performance

### Top Products

```
┌─────────────────────────────────────────────────────────────┐
│  Top Selling Products (Last 30 days)                        │
├─────────────────────────────────────────────────────────────┤
│  Rank  Product            Units Sold  Revenue    Growth     │
│  1     Fresh Apples       487         ₹48,213    +12% ↑    │
│  2     Amul Milk           356         ₹17,444    +8% ↑     │
│  3     Wheat Bread         298         ₹11,920    +5% ↑     │
│  4     Rice (5kg)          156         ₹15,600    +22% ↑    │
│  5     Cooking Oil (1L)    134         ₹13,400    -3% ↓     │
└─────────────────────────────────────────────────────────────┘
```

### Product Insights

**Analyze:**
- Units sold
- Revenue generated
- Average rating
- Stock turnover rate
- Profit margin (if cost data available)

### Low Performers

**Identify:**
- Products with low sales
- High stock, low sales
- Negative reviews
- Consider: Promotions / Price adjustments / Discontinuation

---

## Customer Analytics

### Customer Segments

**Metrics:**
- Total customers
- New customers (this period)
- Returning customers
- Customer lifetime value (CLV)
- Churn rate

**Segments:**
- First-time buyers
- Repeat customers (2-5 orders)
- Loyal customers (>5 orders)
- Inactive (no orders >90 days)

### Customer Behavior

**Track:**
- Average orders per customer
- Average basket size
- Preferred categories
- Peak shopping times
- Cart abandonment rate

---

## Reports

### Available Reports

1. **Sales Report**
   - Daily/Weekly/Monthly sales
   - Export: PDF, Excel, CSV

2. **Order Report**
   - All orders with details
   - Filter by status, date, payment

3. **Product Report**
   - Product performance
   - Stock levels
   - Category-wise sales

4. **Customer Report**
   - Customer list
   - Purchase history
   - Segmentation

5. **Financial Report**
   - Revenue breakdown
   - Payment method analysis
   - Refunds & cancellations

### Generate Report

**Steps:**
1. Select report type
2. Choose date range
3. Apply filters (optional)
4. Click "Generate"
5. Download (PDF/Excel/CSV)

---

## Dashboard Widgets

### Customizable Dashboard

**Available widgets:**
- Revenue chart
- Orders chart
- Top products table
- Recent orders list
- Low stock alerts
- Customer growth
- Payment methods breakdown
- Category performance

**Customize:**
- Add/remove widgets
- Resize and reorder
- Set refresh intervals

---

## Real-time Monitoring

### Live Stats

**Update frequency:** Every 30 seconds

**Monitor:**
- Active users on site
- Orders in last hour
- Current cart values
- Stock alerts
- System status

---

## Export & Sharing

### Export Options

**Formats:**
- PDF (formatted report)
- Excel (.xlsx)
- CSV (raw data)
- JSON (API data)

### Schedule Reports

**Automate reporting:**
- Daily sales summary (email)
- Weekly performance (email)
- Monthly report (email + PDF)

**Recipients:**
- Management
- Operations team
- Stakeholders

---

## API Endpoints

```javascript
// Get analytics data
GET /api/admin/analytics/overview
Query: date_from, date_to

// Get sales data
GET /api/admin/analytics/sales
Query: date_from, date_to, group_by (day/week/month)

// Get top products
GET /api/admin/analytics/top-products
Query: limit, date_from, date_to

// Get customer analytics
GET /api/admin/analytics/customers
Query: segment, date_from, date_to
```

---

## Best Practices

**✅ Do:**
- Review analytics daily
- Track key metrics
- Act on insights
- Compare periods (WoW, MoM)
- Monitor trends
- Export regular reports

**❌ Don't:**
- Ignore negative trends
- Rely on single metric
- Overlook seasonal patterns
- Skip regular reviews

---

**Related Documentation:**
- [ADMIN_01_DASHBOARD_OVERVIEW.md](ADMIN_01_DASHBOARD_OVERVIEW.md)
- [ADMIN_02_PRODUCT_MANAGEMENT.md](ADMIN_02_PRODUCT_MANAGEMENT.md)
- [ADMIN_03_ORDER_MANAGEMENT.md](ADMIN_03_ORDER_MANAGEMENT.md)
