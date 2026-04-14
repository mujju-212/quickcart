# QuickCart — Complete Project Summary

## What Is It?

QuickCart is a **full-stack grocery e-commerce platform** (like Blinkit/Zepto) targeting the **Indian market**, with a React frontend, Flask backend, and PostgreSQL (Supabase) database. It supports customer shopping + an admin management panel.

---

## Architecture

| Layer | Tech | Deployment |
|-------|------|------------|
| Frontend | React 18, React Router v6, React Bootstrap 5 | Vercel |
| Backend | Flask 2.3.3, Gunicorn | Render |
| Database | PostgreSQL 16 (Supabase) | Supabase Cloud |
| Auth | JWT (HS256, 7-day) + OTP (phone/email) | — |

---

## Database Schema (12 Tables)

| Table | Purpose |
|-------|---------|
| `categories` | 13 grocery categories (Fruits, Dairy, Bakery, Beverages, etc.) |
| `products` | Items with price, original_price, stock, category FK, soft-delete via status |
| `users` | Customer/admin accounts, identified by phone, login tracking |
| `user_addresses` | Multiple addresses per user (home/work/other), default flag |
| `orders` | Order header — custom ID ("QC" + timestamp + hex), status pipeline (pending → confirmed → preparing → out_for_delivery → delivered/cancelled) |
| `order_items` | Line items per order with snapshotted prices |
| `order_timeline` | Status transition audit log |
| `cart_items` | Server-side cart per user (unique user+product) |
| `wishlist_items` | Server-side wishlist per user |
| `banners` | Promotional hero banners with date scheduling |
| `offers` | Coupon codes — percentage, fixed, or free_delivery discounts |
| `product_reviews` | 1–5 star ratings with verified purchase flag |

Plus auto-`updated_at` triggers on all tables, and performance indexes on foreign keys and common filters.

---

## Backend (Flask) — 12 Blueprint Modules

### Core

- **backend/app.py** — Factory pattern, registers all 12 blueprints under `/api/*`, security headers via `@after_request`, CORS enabled
- **backend/config/config.py** — Env-based config (DB, JWT, SMS, email)
- **backend/utils/database.py** — Singleton `Database` class with context managers, `RealDictCursor`

### Routes

| Blueprint | Prefix | Key Endpoints |
|-----------|--------|---------------|
| `auth` | `/api/auth` | `send-otp`, `verify-otp`, `complete-profile`, `admin-login`, `send-email-otp`, `verify-email-otp`, `csrf-token` |
| `products` | `/api/products` | CRUD + search + related products. Admin: create/update/delete |
| `categories` | `/api/categories` | User view (only with in-stock products), admin view (all). CRUD |
| `orders` | `/api/orders` | Create (backend price calc, prevents price manipulation), list user's orders, admin status updates, timeline tracking |
| `cart` | `/api/cart` | Get/add/update/remove/clear by phone |
| `wishlist` | `/api/wishlist` | Get/add/remove/clear/check |
| `users` | `/api/users` | Profile, registration, address CRUD |
| `reviews` | `/api/reviews` | Per-product reviews, verified purchase check, admin moderation |
| `analytics` | `/api/analytics` | Dashboard stats, revenue charts (7d/30d/90d/1y) |
| `reports` | `/api/reports` | PDF + Excel export for products/orders/users |
| `banners` | `/api/banners` | Banner CRUD + active banners with date filtering |
| `offers` | `/api/offers` | Offer CRUD + coupon validation |

### Security Stack

- **JWT Auth** — `token_required` and `admin_required` decorators, special handling for hardcoded admin (user_id=1)
- **Rate Limiting** — DB-backed: 20 OTP/day per identifier, configurable API rate limits per IP/endpoint
- **CSRF** — HMAC-SHA256 signed tokens with 1hr expiry
- **Input Validation** — bleach sanitization, phone validation (Indian 10-digit), email-validator, pincode/price/quantity validation
- **Security Headers** — CSP, HSTS, X-Frame-Options, X-Content-Type-Options

### Services

- **SMS** — Twilio (primary) → Fast2SMS (backup) → dev fallback (prints OTP to console)
- **Email** — MailerSend API with HTML templates (OTP + welcome emails)

---

## Frontend (React 18)

### App Structure

- **src/App.js** — `AuthProvider > CartProvider > WishlistProvider > LocationProvider > Router`
- Lazy-loaded pages via `React.lazy()` + `Suspense`
- Layout component hides Header/Footer on `/admin` routes
- `ProtectedRoute` component for auth-gated pages (checkout, account, order confirmation)

### 4 Context Providers

| Context | Purpose |
|---------|---------|
| `AuthContext` | JWT + user state in cookies (js-cookie) + localStorage fallback. Login/logout/register/adminLogin |
| `CartContext` | Dual mode: DB-backed for logged-in users, localStorage for guests. Full CRUD |
| `WishlistContext` | Same dual mode pattern. Toggle, check, clear |
| `LocationContext` | Address management, default location "Nagawara, Bengaluru" |

### 18 Pages

| Page | Purpose |
|------|---------|
| `Home` | Banners carousel, category grid, popular products, category-grouped products. Auto-refreshes every 20s |
| `Login` | Phone OTP or Email OTP flow → profile completion for new users. Admin login tab |
| `ProductDetails` | Product images, description, reviews tab, related products, add-to-cart with quantity selector |
| `SearchResults` | Product search with filters |
| `Cart` | Cart items, quantity controls, coupon application, proceed to checkout |
| `Checkout` | 3-step flow: Review → Payment → Success. Address selection/creation, payment method (COD/UPI/Card), backend order creation |
| `Account` | User profile, order history, addresses, wishlist |
| `OrderConfirmation` | Post-order success page |
| `Admin` | Full admin panel with sidebar navigation |
| Static pages | About, Careers, Blog, Contact, Help, Support, Privacy, Terms |

### Admin Panel Components

- **Dashboard** — Stats cards, recent orders, top products, revenue charts
- **OrderManagement** — View all orders, update status
- **ProductManagement** — CRUD products
- **CategoryManagement** — CRUD categories
- **OffersManagement** — Manage coupon codes
- **BannerManagement** — Manage promotional banners
- **Users** — View/manage users
- **ReportsHub** — Generate PDF/Excel reports
- **AdminSettings** — App configuration

### Frontend Services (API Layer)

- Each service class wraps `fetch()` calls to the Flask API
- `secureFetch()` in `src/utils/api.js` auto-injects JWT Bearer token and handles 401 → redirect to login
- `cacheUtils` — In-memory Map cache with 5-min TTL, stale-while-revalidate pattern
- `productService` uses cache for product/category reads
- `orderService` has mock data fallback for development when backend is unavailable

### Custom Hooks

- `useAutoRefresh` — setInterval-based data refresh (used on Home page, 20s interval)
- `useProducts` — Product data fetching hook

### Key UI Features

- Mobile-responsive with `MobileBottomNav` for mobile navigation
- `BackToTop` scroll button
- `BannerCarousel` for hero images
- `ProductCard` with wishlist heart, discount badge, stock warnings, hover effects
- Location detection (geolocation API → random Bengaluru area for demo)
- Toast notifications via DOM manipulation

---

## Authentication Flow

### Customer Login

1. Enter phone/email → backend sends OTP (Twilio/MailerSend) → verify OTP
2. Existing user: returns JWT token + user data → stored in cookies + localStorage
3. New user: `isNewUser=true` → `ProfileCompletionModal` → `complete-profile` API → JWT issued

### Admin Login

1. Hardcoded `admin/admin123` → backend issues JWT → admin panel access
2. Backend double-checks: `admin_required` decorator validates token + `is_admin` role

---

## Order Flow

1. Customer adds items to cart (DB-backed or localStorage)
2. Proceed to checkout → select/add address → choose payment method
3. Frontend sends order with `client_total`
4. **Backend recalculates total from DB prices** (prevents price manipulation)
5. Validates coupon if applied, deducts stock, clears cart
6. Order created with timeline entry, custom ID format "QC" + timestamp

---

## Key Design Patterns

- **Dual-mode data**: Logged-in users use DB; guests use localStorage (cart, wishlist, addresses)
- **Backend price authority**: Order totals always calculated server-side
- **Service layer pattern**: Each frontend feature has a dedicated service class
- **Context-based state**: React Context for global state (auth, cart, wishlist, location)
- **Graceful degradation**: SMS falls back Twilio → Fast2SMS → console, API errors fall back to mock data
- **Auto-refresh**: Home page polls every 20s for fresh data

---

## Project Structure

```
quickcart/
├── backend/                    # Flask API
│   ├── app.py                  # Entry point, blueprint registration
│   ├── config/config.py        # Environment-based configuration
│   ├── routes/                 # 12 route blueprints
│   │   ├── auth_routes.py      # OTP + admin authentication
│   │   ├── product_routes.py   # Product CRUD
│   │   ├── category_routes.py  # Category CRUD
│   │   ├── order_routes.py     # Order creation + management
│   │   ├── cart_routes.py      # Shopping cart
│   │   ├── wishlist_routes.py  # Wishlist
│   │   ├── user_routes.py      # User profiles + addresses
│   │   ├── review_routes.py    # Product reviews
│   │   ├── analytics_routes.py # Dashboard stats + revenue charts
│   │   ├── report_routes.py    # PDF/Excel report generation
│   │   ├── banner_routes.py    # Promotional banners
│   │   └── offer_routes.py     # Coupon/discount management
│   ├── services/               # External integrations
│   │   ├── sms_service.py      # Twilio + Fast2SMS
│   │   └── email_service.py    # MailerSend
│   └── utils/                  # Shared utilities
│       ├── database.py         # PostgreSQL connection handler
│       ├── auth_middleware.py   # JWT decorators
│       ├── input_validator.py  # Sanitization + validation
│       ├── rate_limiter.py     # DB-backed rate limiting
│       ├── csrf_protection.py  # HMAC-signed CSRF tokens
│       └── otp_manager.py      # In-memory OTP store
├── database/                   # DB setup
│   ├── schema.sql              # Full schema (12 tables + indexes + triggers + seed data)
│   ├── setup.py                # DB initialization script
│   ├── populate_products.py    # Product seeder
│   └── seed_all_data.py        # Complete data seeder
├── src/                        # React frontend
│   ├── App.js                  # Root component + routing
│   ├── context/                # 4 context providers (Auth, Cart, Wishlist, Location)
│   ├── pages/                  # 18 page components
│   ├── components/             # Reusable UI components
│   │   ├── admin/              # Admin panel (dashboard, management, reports)
│   │   ├── common/             # Header, Footer, ProtectedRoute, BannerCarousel
│   │   ├── product/            # ProductCard, ProductGrid, ProductReviews
│   │   ├── auth/               # ProfileCompletionModal
│   │   ├── cart/               # Cart components
│   │   ├── checkout/           # Checkout components
│   │   └── search/             # Search components
│   ├── services/               # API service classes (auth, product, order, cart, etc.)
│   ├── hooks/                  # useAutoRefresh, useProducts
│   └── utils/                  # api.js (secureFetch), cacheUtils, constants, helpers
├── docs/                       # Documentation
├── render.yaml                 # Render deployment config
├── vercel.json                 # Vercel deployment config
├── package.json                # Frontend dependencies
└── requirements.txt            # Backend dependencies
```

---

## Deployment

- **Backend**: Render (render.yaml) — Python with Gunicorn, auto-deploy from repo
- **Frontend**: Vercel (vercel.json) — React build, SPA rewrites to index.html
- **Database**: Supabase PostgreSQL — connection string via `DATABASE_URL` env var
- **Production API**: `https://quickcart-api-a09g.onrender.com/api`
