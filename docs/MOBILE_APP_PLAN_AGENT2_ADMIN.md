# QuickCart Mobile App — Agent 2: Admin & Management App

## Branch: `admin-mobile-app`

## Role: Build the complete admin/management mobile application

---

## 1. Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | **React Native 0.76+** with **Expo SDK 52** | Same as customer app — code sharing potential |
| Navigation | **React Navigation 7** (Drawer + Native Stack) | Drawer fits admin panel pattern |
| State Management | **Zustand** | Consistent with customer app |
| API Layer | **Axios** + **React Query (TanStack Query v5)** | Same setup, shared interceptors |
| Animations | **React Native Reanimated 3** | Smooth chart transitions, drawer animations |
| Charts | **Victory Native** or **react-native-chart-kit** | Dashboard analytics visualization |
| Storage | **MMKV** | Token + preferences persistence |
| UI Components | Custom + **React Native Paper** (Material Design 3) | Material fits admin UX pattern well |
| Date Picker | **react-native-date-picker** | Order/report date filtering |
| Image Picker | **expo-image-picker** | Product image upload |
| PDF Export | **react-native-print** + **expo-sharing** | Report export |
| Pull-to-refresh | **react-native-gesture-handler** | Smooth data refresh |
| Tables | **react-native-table-component** or custom | Tabulated data display |
| Fonts | **Inter** (all text) | Clean, data-friendly readability |

---

## 2. Project Structure

```
quickcart-admin-mobile/
├── app/                              # Expo Router
│   ├── _layout.tsx                   # Root (providers, auth guard)
│   ├── index.tsx                     # Redirect to login or dashboard
│   ├── login.tsx                     # Admin login screen
│   ├── (drawer)/                     # Drawer Navigator (authenticated)
│   │   ├── _layout.tsx              # Drawer config + menu items
│   │   ├── dashboard.tsx            # Main dashboard
│   │   ├── orders/
│   │   │   ├── index.tsx            # All orders list
│   │   │   └── [id].tsx             # Order detail + status update
│   │   ├── products/
│   │   │   ├── index.tsx            # Product list + search
│   │   │   ├── [id].tsx             # Edit product
│   │   │   └── create.tsx           # Add new product
│   │   ├── categories/
│   │   │   ├── index.tsx            # Category list
│   │   │   └── create.tsx           # Add/edit category
│   │   ├── customers/
│   │   │   ├── index.tsx            # Customer list
│   │   │   └── [id].tsx             # Customer detail + orders
│   │   ├── offers/
│   │   │   ├── index.tsx            # Offers list
│   │   │   └── create.tsx           # Create/edit offer
│   │   ├── banners/
│   │   │   ├── index.tsx            # Banners list
│   │   │   └── create.tsx           # Create/edit banner
│   │   ├── reviews/
│   │   │   └── index.tsx            # All reviews (moderate)
│   │   ├── reports/
│   │   │   └── index.tsx            # Reports & analytics
│   │   └── settings.tsx             # Admin settings
├── src/
│   ├── components/
│   │   ├── ui/                      # Base components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── DataTable.tsx        # Sortable data table
│   │   │   ├── StatCard.tsx         # Dashboard stat card
│   │   │   ├── StatusBadge.tsx      # Order/product status badge
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Modal.tsx            # Confirmation modals
│   │   │   ├── BottomSheet.tsx
│   │   │   ├── SearchHeader.tsx     # Search + filter header
│   │   │   ├── EmptyState.tsx
│   │   │   └── FloatingActionButton.tsx  # FAB for create actions
│   │   ├── dashboard/
│   │   │   ├── RevenueChart.tsx     # Line chart — revenue over time
│   │   │   ├── OrdersChart.tsx      # Bar chart — orders by status
│   │   │   ├── CategoryPieChart.tsx # Pie chart — sales by category
│   │   │   ├── TopProductsList.tsx  # Top selling products
│   │   │   ├── RecentOrdersList.tsx # Latest 5 orders
│   │   │   └── QuickActionGrid.tsx  # Quick action buttons
│   │   ├── orders/
│   │   │   ├── OrderCard.tsx        # Order list card
│   │   │   ├── OrderTimeline.tsx    # Status update timeline
│   │   │   ├── OrderItemRow.tsx     # Single item in order
│   │   │   └── StatusUpdateSheet.tsx # Bottom sheet to change status
│   │   ├── products/
│   │   │   ├── ProductCard.tsx      # Admin product card
│   │   │   ├── ProductForm.tsx      # Create/edit product form
│   │   │   ├── ImageUploader.tsx    # Multi-image upload
│   │   │   └── StockBadge.tsx       # Stock level indicator
│   │   ├── customers/
│   │   │   ├── CustomerCard.tsx     # Customer list item
│   │   │   └── CustomerStats.tsx    # Orders/spend stats
│   │   ├── offers/
│   │   │   ├── OfferCard.tsx
│   │   │   └── OfferForm.tsx
│   │   ├── banners/
│   │   │   ├── BannerCard.tsx
│   │   │   └── BannerForm.tsx
│   │   └── reports/
│   │       ├── ReportCard.tsx
│   │       ├── DateRangePicker.tsx
│   │       └── ExportButton.tsx
│   ├── stores/
│   │   ├── authStore.ts             # Admin auth state
│   │   ├── dashboardStore.ts        # Dashboard data cache
│   │   └── filterStore.ts           # Active filters state
│   ├── services/
│   │   ├── api.ts                   # Axios instance (admin)
│   │   ├── authService.ts           # Admin login
│   │   ├── orderService.ts          # Order CRUD + status updates
│   │   ├── productService.ts        # Product CRUD
│   │   ├── categoryService.ts       # Category CRUD
│   │   ├── customerService.ts       # Customer list/detail
│   │   ├── offerService.ts          # Offer CRUD
│   │   ├── bannerService.ts         # Banner CRUD
│   │   ├── reviewService.ts         # Review moderation
│   │   ├── analyticsService.ts      # Dashboard analytics
│   │   └── reportService.ts         # Report generation
│   ├── hooks/
│   │   ├── useOrders.ts
│   │   ├── useProducts.ts
│   │   ├── useDashboard.ts
│   │   ├── useCustomers.ts
│   │   └── useDebounce.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts               # formatPrice, formatDate, etc.
│   │   ├── storage.ts               # MMKV wrapper
│   │   └── permissions.ts           # Admin role checks
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── shadows.ts
│   └── assets/
│       ├── lottie/
│       │   ├── empty-orders.json
│       │   ├── success.json
│       │   └── loading.json
│       └── images/
├── app.json
├── eas.json
├── tsconfig.json
├── package.json
└── babel.config.js
```

---

## 3. Design System & Theme

### Admin Color Palette

```
Primary:           #1E40AF (Deep Blue — authority, trust)
Primary Light:     #3B82F6
Primary Dark:      #1E3A8A
Accent:            #FFD700 (QuickCart Gold — brand consistency)

Background:        #F1F5F9 (Slate 100 — easy on eyes for long use)
Surface:           #FFFFFF
Card:              #FFFFFF

Text Primary:      #0F172A (Slate 900)
Text Secondary:    #475569 (Slate 600)
Text Muted:        #94A3B8 (Slate 400)

Success:           #16A34A (Orders delivered, positive stats)
Warning:           #D97706 (Low stock, pending actions)
Error:             #DC2626 (Cancelled, failed, out of stock)
Info:              #2563EB (Informational badges)

Border:            #E2E8F0
Divider:           #F1F5F9

Chart Colors:      ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

Status Colors:
  pending:         #F59E0B (Amber)
  confirmed:       #3B82F6 (Blue)
  processing:      #8B5CF6 (Purple)
  out_for_delivery:#06B6D4 (Cyan)
  delivered:       #16A34A (Green)
  cancelled:       #DC2626 (Red)
```

### Typography (Admin — Denser, Data-Optimized)

```
Page Title:     22px / Bold / Inter
Section Title:  18px / SemiBold / Inter
Card Title:     16px / SemiBold / Inter
Body:           14px / Regular / Inter
Body Small:     13px / Regular / Inter
Caption:        12px / Regular / Inter
Label:          12px / Medium / Inter / Uppercase / Letter-spacing: 0.5px
Stat Number:    28px / Bold / Inter
Stat Label:     12px / Medium / Inter
Table Header:   13px / SemiBold / Inter
Table Cell:     14px / Regular / Inter
```

### Spacing (Same 4px grid)

```
xs: 4    sm: 8    md: 12    lg: 16    xl: 20    2xl: 24    3xl: 32    4xl: 48
```

---

## 4. Screen-by-Screen Specification

### 4.1 Admin Login Screen

**Layout:**
- Centered card on colored background
- QuickCart logo + "Admin Panel" subtitle
- Username input (pre-filled with "admin" in dev mode)
- Password input (show/hide toggle)
- "Sign In" button (Deep Blue, full-width)
- Error message area (red text below button)

**Authentication Flow:**
- POST `/api/auth/admin/login` → `{ username, password }`
- On success: store JWT in MMKV, navigate to dashboard
- On error: shake animation on form + error message
- Biometric login option (Face ID / Fingerprint) for returning admins

**Security:**
- Auto-logout after 30 min inactivity
- Token refresh on app foreground

---

### 4.2 Dashboard Screen (Drawer Home)

**This is the command center — must convey all critical data at a glance.**

**Layout (scrollable, top to bottom):**

1. **Header Bar**
   - Hamburger menu (opens drawer) — left
   - "Dashboard" title — center
   - Notification bell (with badge) — right
   - Refresh button — right

2. **Quick Stats Row** (horizontal scroll, 4 cards)

   ```
   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
   │ 📦 Orders│ │ 💰Revenue│ │ 👥 Users │ │ 📊 Items │
   │    156   │ │ ₹45,230  │ │   1,284  │ │    342   │
   │ +12 today│ │ +₹3.2K ↑ │ │  +8 new  │ │  5 low   │
   │  🟢 +8%  │ │  🟢 +15% │ │  🟡 +2%  │ │  🔴 -3%  │
   └──────────┘ └──────────┘ └──────────┘ └──────────┘
   ```

   - Each card: Icon, title, large number, comparison text, trend arrow
   - Color-coded trend: green (up), red (down), amber (flat)
   - Tap any card → navigates to detailed section

3. **Revenue Chart** (line chart)
   - Toggle: 7 days / 30 days / 3 months
   - Smooth animated line
   - Tap data point → tooltip with exact value + date
   - Gradient fill under line

4. **Orders by Status** (horizontal bar chart or donut)
   - Color-coded by status
   - Legend below
   - Tap segment → filter order list by that status

5. **Recent Orders** (last 5)
   - Compact cards: Order ID, customer name, total, status badge, time ago
   - "View All →" link
   - Tap → order detail

6. **Top Selling Products** (top 5)
   - Product image (small) + name + units sold + revenue
   - Numbered list (1-5)

7. **Quick Actions Grid** (2x3)
   ```
   ┌────────────┐ ┌────────────┐
   │ + Add       │ │ 📋 Pending │
   │   Product   │ │   Orders   │
   ├────────────┤ ├────────────┤
   │ 🏷️ Create  │ │ 📊 View    │
   │   Offer     │ │   Reports  │
   ├────────────┤ ├────────────┤
   │ 🖼️ Add     │ │ ⭐ Review  │
   │   Banner    │ │   Moderate │
   └────────────┘ └────────────┘
   ```

**Pull-to-refresh:** Refreshes all dashboard data (parallel queries)

**Auto-refresh:** Every 60 seconds for real-time order monitoring

---

### 4.3 Drawer Menu

**Layout:**

```
┌─────────────────────────────┐
│  [QuickCart Logo]            │
│  Admin Panel                 │
│  admin@quickcart.com         │
├─────────────────────────────┤
│  📊  Dashboard               │
│  📦  Orders           (23)   │  ← pending count badge
│  📱  Products          (342) │
│  📂  Categories        (13)  │
│  👥  Customers         (1.2K)│
│  🏷️  Offers & Coupons  (5)  │
│  🖼️  Banners           (3)  │
│  ⭐  Reviews           (15)  │  ← unmoderated count
│  📈  Reports                 │
├─────────────────────────────┤
│  ⚙️  Settings                │
│  🚪  Logout                  │
└─────────────────────────────┘
```

- Active item: highlighted with primary color background
- Counts update in real-time (React Query background refetch)
- Drawer opens with smooth slide + overlay
- Swipe from left edge to open (gesture)

---

### 4.4 Orders Management

#### Orders List (`/orders`)

**Layout:**
1. **Header**: "Orders" + search icon + filter icon
2. **Status Filter Tabs** (horizontal scroll)
   - All | Pending | Confirmed | Processing | Out for Delivery | Delivered | Cancelled
   - Each tab shows count
   - Active tab: primary color underline
3. **Sort Options**: Newest | Oldest | Highest Value | Lowest Value
4. **Order Cards List** (FlashList)

**Order Card:**
```
┌─────────────────────────────────────────┐
│  #QC-0001          🟡 Pending           │
│  John Doe • +91 98765 43210             │
│  2 items • ₹450.00                      │
│  📍 Nagawara, Bangalore                 │
│  ⏰ 5 minutes ago                       │
│                                         │
│  [View Details]      [Update Status ▼]  │
└─────────────────────────────────────────┘
```

**Interactions:**
- Tap card → order detail
- "Update Status" → opens status update bottom sheet
- Pull-to-refresh
- Infinite scroll pagination

#### Order Detail (`/orders/[id]`)

**Layout (scrollable):**

1. **Status Header**
   - Large status badge with icon
   - "Update Status" pill button → bottom sheet

2. **Status Timeline** (vertical stepper)
   ```
   ● Order Placed        — 10:30 AM, 28 Feb
   ● Confirmed           — 10:31 AM, 28 Feb
   ○ Processing          — Pending
   ○ Out for Delivery    — Pending
   ○ Delivered           — Pending
   ```
   - Completed steps: filled circle (green)
   - Current step: pulsing circle
   - Pending: hollow circle (grey)

3. **Customer Info Card**
   - Name, phone (tap to call), email
   - Delivery address (tap to open in Maps)

4. **Order Items**
   - Product image + name + quantity + unit price + total
   - Each item row

5. **Bill Summary Card**
   - Item total, delivery fee, discount, final total
   - Payment method badge

6. **Action Buttons** (bottom)
   - "Call Customer" (green phone icon)
   - "Update Status" (primary button)
   - "Cancel Order" (red text, with confirmation modal)

**Status Update Bottom Sheet:**
```
┌─────────────────────────────────────┐
│  Update Order Status                 │
│                                      │
│  ○ Pending                          │
│  ● Confirmed        ← current       │
│  ○ Processing                       │
│  ○ Out for Delivery                 │
│  ○ Delivered                        │
│  ○ Cancelled                        │
│                                      │
│  Note (optional): [_______________]  │
│                                      │
│  [Cancel]          [Update Status]   │
└─────────────────────────────────────┘
```

- Radio selection with color coding
- Optional note field
- Confirmation before updating
- Success toast + haptic after update
- Auto-sends push notification to customer

---

### 4.5 Product Management

#### Product List (`/products`)

**Layout:**
1. **Search Bar** (always visible)
2. **Filter Chips**: All | In Stock | Low Stock | Out of Stock | By Category dropdown
3. **View Toggle**: Grid (□□) / List (≡) — saved preference in MMKV
4. **Product Cards**

**Grid View Card:**
```
┌──────────────────┐
│  [Product Image]  │
│  Product Name     │
│  ₹120 | Stock: 45│
│  🟢 In Stock      │
│  [Edit] [⋮]      │
└──────────────────┘
```

**List View Row:**
```
┌──────────────────────────────────────────┐
│  [img] Product Name          ₹120       │
│        Category • Stock: 45  🟢 Active  │
│                              [Edit] [⋮] │
└──────────────────────────────────────────┘
```

**Three-dot menu (⋮):**
- Edit Product
- Toggle Active/Inactive
- Delete (with confirmation)

**FAB**: "+" button → Create Product

#### Create/Edit Product (`/products/create` or `/products/[id]`)

**Layout (scrollable form):**

1. **Image Upload Section**
   - Main image area (tap to pick from camera/gallery)
   - Additional images row (up to 4)
   - Image crop/resize before upload
   - Drag to reorder

2. **Basic Info**
   - Product Name (input)
   - Description (multi-line textarea)
   - Category (dropdown picker)
   - Brand (input, optional)

3. **Pricing**
   - Price (₹ input, numeric keyboard)
   - Original Price / MRP (for discount calc)
   - Auto-calculated discount % badge preview

4. **Inventory**
   - Stock Quantity (numeric input)
   - Unit (dropdown: piece, kg, g, ml, L, pack)
   - Size/Weight display text (e.g., "500g", "1L")
   - Low Stock Alert Threshold (default: 10)

5. **Details**
   - Tags (chip input — add/remove)
   - Active toggle switch
   - Featured toggle switch

6. **Sticky Bottom Bar**
   - "Save Product" button (primary)
   - "Save as Draft" (secondary, outline)

**Validation:**
- All required fields highlighted in red if empty on submit
- Price must be positive
- Stock must be non-negative
- At least one image required
- Name: 3-100 characters

---

### 4.6 Category Management

#### Category List (`/categories`)

**Layout:**
- Simple list with drag-to-reorder
- Each row: category image + name + product count + active toggle
- Swipe left: Edit | Delete
- FAB: "+" Add category

#### Create/Edit Category (`/categories/create`)

**Form:**
- Category Name (input)
- Category Image (upload)
- Description (optional textarea)
- Active toggle
- Display Order (numeric)

---

### 4.7 Customer Management

#### Customer List (`/customers`)

**Layout:**
1. **Search Bar** (by name, phone, email)
2. **Sort**: Newest | Most Orders | Highest Spend
3. **Customer Cards**

**Customer Card:**
```
┌────────────────────────────────────────┐
│  👤 John Doe                           │
│  📱 +91 98765 43210                    │
│  📧 john@example.com                   │
│                                        │
│  Orders: 12    Spent: ₹5,430           │
│  Joined: Jan 15, 2026                  │
└────────────────────────────────────────┘
```

#### Customer Detail (`/customers/[id]`)

**Layout:**
1. **Profile Header**: Name, phone, email, join date
2. **Stats Row**: Total Orders | Total Spent | Avg Order Value
3. **Recent Orders**: last 10 orders timeline
4. **Saved Addresses**: list of addresses
5. **Actions**: Call | Email | Block/Unblock

---

### 4.8 Offers & Coupons Management

#### Offer List (`/offers`)

**Layout:**
- Status tabs: All | Active | Expired | Upcoming
- Offer cards with code, discount, usage count, expiry

**Offer Card:**
```
┌──────────────────────────────────────────┐
│  🏷️ SAVE20              🟢 Active       │
│  20% off up to ₹100                     │
│  Min order: ₹500                        │
│  Used: 45 / 100 times                   │
│  Expires: Mar 15, 2026                  │
│  [Edit]                  [Deactivate]   │
└──────────────────────────────────────────┘
```

#### Create/Edit Offer (`/offers/create`)

**Form:**
- Coupon Code (auto-generate option)
- Discount Type: Percentage / Flat Amount (toggle)
- Discount Value (₹ or %)
- Maximum Discount Amount (for %)
- Minimum Order Value
- Usage Limit Total
- Usage Limit Per User
- Valid From (date picker)
- Valid Until (date picker)
- Active toggle
- Applicable Categories (multi-select, optional)
- Description

---

### 4.9 Banner Management

#### Banner List (`/banners`)

**Layout:**
- Visual card list (shows actual banner image)
- Active/Inactive toggle per banner
- Drag to reorder display priority

**Banner Card:**
```
┌──────────────────────────────────────────┐
│  ┌────────────────────────────────────┐  │
│  │     [Banner Image Preview]         │  │
│  └────────────────────────────────────┘  │
│  Title: Summer Sale                      │
│  🟢 Active   |   Priority: 1            │
│  Link: /category/5                       │
│  [Edit]                     [Delete]     │
└──────────────────────────────────────────┘
```

#### Create/Edit Banner (`/banners/create`)

**Form:**
- Banner Image (upload, 16:9 ratio enforced with crop guide)
- Title
- Subtitle (optional)
- Link URL / Deep Link
- Active toggle
- Display Priority (numeric)
- Start Date / End Date (optional scheduling)

---

### 4.10 Review Moderation

#### Reviews List (`/reviews`)

**Layout:**
1. **Filter Tabs**: All | Pending | Approved | Flagged
2. **Sort**: Newest | Lowest Rated | Most Reported
3. **Review Cards**

**Review Card:**
```
┌──────────────────────────────────────────┐
│  ⭐⭐⭐⭐☆  4/5         🟡 Pending      │
│  "Great product, fast delivery!"         │
│                                          │
│  By: John D. • on "Organic Atta 5kg"    │
│  📅 2 hours ago                          │
│                                          │
│  [Approve ✓]   [Flag ⚠]   [Delete ✕]   │
└──────────────────────────────────────────┘
```

**Actions:**
- Approve: makes review visible
- Flag: marks for review + optional reason modal
- Delete: confirmation modal → removes review
- Tap product name → navigate to product detail

---

### 4.11 Reports & Analytics

#### Reports Screen (`/reports`)

**Layout (scrollable):**

1. **Date Range Selector** (top)
   - Quick presets: Today | Yesterday | 7 Days | 30 Days | Custom
   - Custom: opens dual date picker

2. **Revenue Report Card**
   - Line chart (revenue over selected period)
   - Total revenue, average daily, peak day
   - Comparison with previous period (% change)

3. **Orders Report Card**
   - Bar chart (orders by day)
   - Total orders, average per day
   - Completion rate, cancellation rate

4. **Category Performance**
   - Pie chart (revenue by category)
   - Horizontal bar chart (units sold by category)
   - Top & bottom performers

5. **Product Performance**
   - Top 10 products table (sortable)
   - Columns: Rank, Product, Sold, Revenue, Avg Rating

6. **Customer Insights**
   - New vs returning customers chart
   - Average order value trend
   - Top customers table

7. **Export Section**
   - "Export as PDF" button
   - "Export as CSV" button
   - Shared via native share sheet

**Export Implementation:**
- Use `react-native-print` to create HTML → PDF
- Use `expo-file-system` + `expo-sharing` for CSV

---

### 4.12 Settings Screen

**Layout:**
1. **Profile Section**
   - Admin username
   - Change password option
   
2. **App Settings**
   - Auto-refresh interval (30s / 60s / 5min / Off)
   - Default view mode (Grid/List)
   - Notification sounds toggle
   - Dark mode toggle (stretch goal)

3. **Store Settings** (if backend supports)
   - Store name
   - Delivery fee
   - Minimum order value
   - Delivery radius

4. **Danger Zone**
   - Clear local cache
   - Reset preferences

5. **About**
   - App version
   - Backend API URL (debug info)

---

## 5. Navigation Structure

```
Root (_layout)
├── login                         # Stack (unauthenticated)
│
├── (drawer)                      # Drawer Navigator (authenticated)
│   ├── dashboard                 # Home
│   ├── orders/
│   │   ├── index                 # Order list
│   │   └── [id]                  # Order detail
│   ├── products/
│   │   ├── index                 # Product list
│   │   ├── create                # Create product
│   │   └── [id]                  # Edit product
│   ├── categories/
│   │   ├── index                 # Category list
│   │   └── create                # Create/edit category
│   ├── customers/
│   │   ├── index                 # Customer list
│   │   └── [id]                  # Customer detail
│   ├── offers/
│   │   ├── index                 # Offers list
│   │   └── create                # Create/edit offer
│   ├── banners/
│   │   ├── index                 # Banner list
│   │   └── create                # Create/edit banner
│   ├── reviews/
│   │   └── index                 # Review moderation
│   ├── reports/
│   │   └── index                 # Reports & analytics
│   └── settings                  # Settings
```

---

## 6. API Integration (Admin Endpoints)

### Authentication

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/admin/login` | Admin login `{ username, password }` |

### Dashboard / Analytics

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/analytics/overview` | Stats overview (orders, revenue, users, products) |
| GET | `/analytics/revenue?days=30` | Revenue data for chart |
| GET | `/analytics/orders-by-status` | Order count by status |
| GET | `/analytics/top-products?limit=10` | Top selling products |
| GET | `/analytics/category-performance` | Sales by category |
| GET | `/analytics/daily-stats?start=&end=` | Daily breakdown |

### Order Management

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/orders?status=&page=&limit=` | List orders (filtered, paginated) |
| GET | `/orders/{id}` | Order detail |
| PUT | `/orders/{id}/status` | Update order status `{ status, note }` |
| DELETE | `/orders/{id}` | Cancel/delete order |

### Product Management

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/products?search=&category=&page=` | List products |
| GET | `/products/{id}` | Product detail |
| POST | `/products` | Create product (multipart/form-data for images) |
| PUT | `/products/{id}` | Update product |
| DELETE | `/products/{id}` | Delete product |
| PUT | `/products/{id}/stock` | Update stock only |
| PUT | `/products/{id}/toggle-active` | Toggle active status |

### Category Management

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/categories` | List all categories |
| POST | `/categories` | Create category |
| PUT | `/categories/{id}` | Update category |
| DELETE | `/categories/{id}` | Delete category |

### Customer Management

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/users?search=&page=&limit=` | List users |
| GET | `/users/{id}` | User detail + stats |
| GET | `/users/{id}/orders` | User's order history |

### Offer Management

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/offers?status=active` | List offers |
| POST | `/offers` | Create offer |
| PUT | `/offers/{id}` | Update offer |
| DELETE | `/offers/{id}` | Delete offer |
| PUT | `/offers/{id}/toggle` | Activate/deactivate |

### Banner Management

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/banners` | List all banners |
| POST | `/banners` | Create banner |
| PUT | `/banners/{id}` | Update banner |
| DELETE | `/banners/{id}` | Delete banner |
| PUT | `/banners/{id}/toggle` | Toggle active |

### Review Moderation

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/reviews?status=pending&page=` | List reviews |
| PUT | `/reviews/{id}/approve` | Approve review |
| PUT | `/reviews/{id}/flag` | Flag review |
| DELETE | `/reviews/{id}` | Delete review |

### Reports

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/reports/sales?start=&end=&format=json` | Sales report data |
| GET | `/reports/inventory` | Inventory report |
| GET | `/reports/customers?start=&end=` | Customer report |
| GET | `/reports/export?type=sales&format=csv` | Export report |

---

## 7. Backend Changes Required

The admin mobile app needs some **new/modified endpoints**. Here's the complete list:

### New Endpoints to Create

| Priority | Endpoint | File | Description |
|----------|----------|------|-------------|
| HIGH | `PUT /api/orders/{id}/status` | `order_routes.py` | Update order status (currently may only exist partially) |
| HIGH | `GET /api/analytics/overview` | `analytics_routes.py` | Aggregate stats (if not exact match exists) |
| HIGH | `GET /api/analytics/revenue` | `analytics_routes.py` | Revenue time series |
| MEDIUM | `POST /api/products` | `product_routes.py` | Create product with image upload |
| MEDIUM | `PUT /api/products/{id}` | `product_routes.py` | Update product |
| MEDIUM | `DELETE /api/products/{id}` | `product_routes.py` | Delete product |
| MEDIUM | `PUT /api/products/{id}/stock` | `product_routes.py` | Quick stock update |
| MEDIUM | `GET /api/users` | `user_routes.py` | Paginated user list with search |
| MEDIUM | `GET /api/users/{id}` | `user_routes.py` | Single user detail |
| LOW | `PUT /api/reviews/{id}/approve` | `review_routes.py` | Approve review |
| LOW | `PUT /api/reviews/{id}/flag` | `review_routes.py` | Flag review |
| LOW | `GET /api/reports/export` | `report_routes.py` | CSV/JSON export |

### Existing Endpoints to Verify/Modify

| Endpoint | Check |
|----------|-------|
| `GET /api/analytics/*` | Verify all dashboard data points are available |
| `GET /api/orders` | Add `?status=` filter + pagination |
| `GET /api/products` | Add `?stock_status=low` filter |
| `POST /api/categories` | Verify create exists |
| `PUT /api/categories/{id}` | Verify update exists |
| `DELETE /api/categories/{id}` | Verify delete exists |
| `POST /api/offers` | Verify create offer |
| `PUT /api/offers/{id}` | Verify update offer |
| `POST /api/banners` | Verify create banner |
| `PUT /api/banners/{id}` | Verify update banner |

### New Database Table

```sql
-- For admin action logging
CREATE TABLE IF NOT EXISTS admin_activity_log (
    id SERIAL PRIMARY KEY,
    admin_id VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,          -- 'order_status_updated', 'product_created', etc.
    entity_type VARCHAR(50),               -- 'order', 'product', 'review', etc.
    entity_id INTEGER,
    details JSONB,                         -- Additional action context
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admin_activity_admin ON admin_activity_log(admin_id);
CREATE INDEX idx_admin_activity_action ON admin_activity_log(action);
CREATE INDEX idx_admin_activity_created ON admin_activity_log(created_at);
```

---

## 8. Real-Time Features

### Order Monitoring

Since the existing backend doesn't have WebSockets, implement **polling** for real-time feel:

```typescript
// Poll for new orders every 30 seconds
const { data: orders } = useQuery({
  queryKey: ['orders', 'pending'],
  queryFn: () => orderService.getOrders({ status: 'pending' }),
  refetchInterval: 30_000,      // 30 seconds
  refetchIntervalInBackground: true,  // Even when app is backgrounded
});

// Show local notification when new pending order arrives
useEffect(() => {
  if (orders?.length > previousCount) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    showLocalNotification({
      title: 'New Order!',
      body: `Order #${orders[0].id} from ${orders[0].customer_name}`,
    });
  }
}, [orders?.length]);
```

### Push Notifications for Admin

| Event | Notification |
|-------|-------------|
| New order placed | "🆕 New order #QC-0045 — ₹560" |
| Order cancelled by customer | "❌ Order #QC-0042 cancelled" |
| Low stock alert | "⚠️ Organic Milk — only 3 left" |
| New review (1-2 stars) | "⭐ Low rating on Atta 5kg — 2/5" |

---

## 9. Offline Capabilities

### Admin-Specific Offline Handling

| Data | Offline Behavior |
|------|-----------------|
| Dashboard stats | Show cached data with "Last updated X min ago" banner |
| Order list | Show cached list, disable status updates |
| Product list | Show cached list, disable edits |
| Status updates | Queue in MMKV, sync when online (optimistic) |
| New products | Save draft locally, upload when connected |

### Network Status Banner

```
┌──────────────────────────────────────────┐
│  ⚠️ You're offline. Changes will sync    │
│     when connection is restored.         │
└──────────────────────────────────────────┘
```

- Appears at top of screen when offline (red/amber background)
- Smooth slide down animation
- Auto-dismiss when back online with "Back online ✓" green flash

---

## 10. Performance & UX Guidelines

### Data Tables

- Use `FlashList` for all lists (orders, products, customers)
- Pagination: 20 items per page, infinite scroll
- Show loading skeleton rows while fetching next page
- Search: debounced 500ms to avoid API spam

### Charts

- Use `VictoryNative` with `animate={{ duration: 500 }}` for smooth transitions
- Lazy load chart components (not imported on initial screen)
- Show skeleton chart placeholder while data loads
- Tap interactions on chart data points

### Forms

- Keyboard-aware scroll views on all form screens
- Auto-scroll to first error field on validation failure
- Unsaved changes warning on back navigation
- Auto-save draft to MMKV every 30 seconds

### Error Handling

- All API calls wrapped with:
  - Loading state → skeleton
  - Error state → retry button + error message
  - Empty state → Lottie animation + helpful text
- Toast notifications for success/error actions
- Network error → auto-retry with exponential backoff

---

## 11. Security Considerations

1. **Admin-only auth guard**: All drawer routes behind `isAdmin` check
2. **Token storage**: JWT in MMKV (encrypted by default on iOS, use MMKV encryption mode on Android)
3. **Auto-logout**: 30-minute inactivity timer
4. **Biometric re-auth**: For sensitive actions (delete product, cancel order)
5. **Audit logging**: All admin actions logged to `admin_activity_log` table
6. **No debug info in production**: Strip dev mode indicators
7. **Certificate pinning**: Pin to API domain SSL cert (stretch goal)

---

## 12. Implementation Order (Sprint Plan)

### Sprint 1 (Week 1-2): Foundation + Dashboard
- [ ] Project setup (Expo, TypeScript, dependencies)
- [ ] Design system (admin theme, colors, typography)
- [ ] Navigation structure (Drawer + Expo Router)
- [ ] API service layer (Axios, admin auth interceptor)
- [ ] Zustand stores (auth, filter)
- [ ] Admin login screen + auth flow
- [ ] Dashboard layout + stat cards
- [ ] Revenue chart integration

### Sprint 2 (Week 3-4): Order Management
- [ ] Orders list screen (filters, search, pagination)
- [ ] Order detail screen (timeline, items, customer info)
- [ ] Status update bottom sheet + API
- [ ] Order notifications (polling for new orders)
- [ ] Pull-to-refresh on all list screens
- [ ] **Backend**: Verify/create order status update endpoint
- [ ] **Backend**: Add order filtering/pagination params

### Sprint 3 (Week 5-6): Product + Category
- [ ] Product list screen (grid + list views)
- [ ] Create product screen (form + image upload)
- [ ] Edit product screen
- [ ] Stock management (quick update)
- [ ] Category list + create/edit
- [ ] **Backend**: Create/verify product CRUD endpoints
- [ ] **Backend**: Add image upload handling

### Sprint 4 (Week 7-8): Customers + Offers + Banners
- [ ] Customer list + detail screens
- [ ] Customer order history
- [ ] Offer list + create/edit screens
- [ ] Banner list + create/edit screens
- [ ] **Backend**: Add user list/detail endpoints
- [ ] **Backend**: Verify offer/banner CRUD

### Sprint 5 (Week 9-10): Reviews + Reports
- [ ] Review moderation screen
- [ ] Approve/flag/delete actions
- [ ] Reports screen (date range + charts)
- [ ] Category performance charts
- [ ] Product performance table
- [ ] PDF/CSV export
- [ ] **Backend**: Add review moderation endpoints
- [ ] **Backend**: Add report export endpoints

### Sprint 6 (Week 11-12): Polish + Testing
- [ ] Settings screen
- [ ] Offline handling + cached data
- [ ] Network status banner
- [ ] Push notifications for admin events
- [ ] Performance profiling
- [ ] Error boundary + crash reporting
- [ ] Admin activity logging
- [ ] EAS Build + internal testing
- [ ] Beta release

---

## 13. Git Branch Strategy

```
main ─────────────────────────────────── (Agent 1: Customer App)
  │
  └── admin-mobile-app ──────────────── (Agent 2: This plan — Admin App)
        │
        ├── admin-mobile/foundation     (Sprint 1 feature branch)
        ├── admin-mobile/orders         (Sprint 2 feature branch)
        ├── admin-mobile/products       (Sprint 3 feature branch)
        ├── admin-mobile/customers      (Sprint 4 feature branch)
        ├── admin-mobile/reports        (Sprint 5 feature branch)
        └── admin-mobile/polish         (Sprint 6 feature branch)
```

### Branch Naming Convention
- Feature: `admin-mobile/<feature-name>`
- Bug fix: `admin-mobile/fix-<description>`
- Backend changes: `admin-mobile/backend-<endpoint>`

### Merge Strategy
1. Agent 2 works on `admin-mobile-app` branch
2. Backend changes by Agent 2 should be **PR'd to main first** (since Agent 1 also needs the backend)
3. After both apps are stable, merge `admin-mobile-app` → `main`
4. Shared backend changes are coordinated — Agent 2 creates backend PRs tagged `[shared-backend]`

---

## 14. Coordination with Agent 1 (Customer App)

### Shared Code/Resources

| Shared Item | Owner | Notes |
|-------------|-------|-------|
| Backend API | Both | Agent 2 adds admin-specific endpoints |
| `push_tokens` table | Agent 1 creates | Agent 2 uses for admin notifications |
| `admin_activity_log` table | Agent 2 creates | Admin only |
| Expo config structure | Both | Same Expo SDK version |
| Theme tokens (QuickCart Gold) | Agent 1 defines | Agent 2 incorporates brand color |

### Communication Points

1. **Before Sprint 2**: Align on order status update endpoint contract
2. **Before Sprint 3**: Align on product CRUD endpoint contract
3. **Before Sprint 4**: Align on push notification payload format
4. **Before Sprint 6**: Coordinate backend merge to main

### Conflict Prevention

- Agent 1 works in `quickcart-mobile/` directory
- Agent 2 works in `quickcart-admin-mobile/` directory
- Backend changes in `backend/` require PR to main before merge
- Both agents use same base URL config pattern
- TypeScript interfaces for API responses should be shared (via npm package or copy)
