# QuickCart - Architecture Overview

## 📐 System Architecture

### High-Level Architecture

QuickCart follows a **three-tier architecture** pattern with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           React Single Page Application (SPA)            │  │
│  │  • Customer Interface      • Admin Dashboard             │  │
│  │  • Responsive UI           • Real-time Analytics         │  │
│  │  • Context State Management                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ REST API (JSON over HTTP/HTTPS)
                     │ JWT Authentication Headers
                     │
┌────────────────────▼────────────────────────────────────────────┐
│                     APPLICATION LAYER                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Flask RESTful API Backend                   │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ Routes Layer (Blueprints)                          │  │  │
│  │  │  • Authentication  • Products    • Orders          │  │  │
│  │  │  • Cart           • Users        • Analytics       │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ Middleware Layer                                   │  │  │
│  │  │  • JWT Auth       • Rate Limiting  • CSRF          │  │  │
│  │  │  • Input Validation • Error Handling               │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ Services Layer                                     │  │  │
│  │  │  • SMS Service    • Email Service                  │  │  │
│  │  │  • PDF Generation • Excel Export                   │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ Utils & Helpers                                    │  │  │
│  │  │  • Database Pool  • OTP Manager  • Input Validator │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ PostgreSQL Protocol (psycopg2)
                     │ Connection Pooling
                     │ Parameterized Queries
                     │
┌────────────────────▼────────────────────────────────────────────┐
│                        DATA LAYER                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              PostgreSQL Database                         │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ Relational Schema (12+ Tables)                     │  │  │
│  │  │  • users           • products      • orders        │  │  │
│  │  │  • cart_items      • categories    • reviews       │  │  │
│  │  │  • Foreign Keys    • Indexes       • Constraints   │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

                 ┌─────────────────────────────┐
                 │   EXTERNAL SERVICES         │
                 │  • Twilio/Fast2SMS (SMS)    │
                 │  • MailerSend (Email)       │
                 │  • Payment Gateway (Future) │
                 └─────────────────────────────┘
```

---

## 🏛️ Architectural Patterns

### 1. Three-Tier Architecture
- **Presentation Tier**: React frontend
- **Application Tier**: Flask backend with business logic
- **Data Tier**: PostgreSQL database

### 2. RESTful API Design
- Resource-based URLs
- HTTP methods (GET, POST, PUT, DELETE)
- JSON request/response format
- Stateless authentication (JWT)

### 3. MVC Pattern (Backend)
- **Models**: Database schema and queries
- **Views**: API response formatting
- **Controllers**: Route handlers and business logic

### 4. Component-Based Architecture (Frontend)
- Reusable React components
- Composition over inheritance
- Props and state management
- Context API for global state

### 5. Blueprint Pattern (Flask)
- Modular route organization
- Separated concerns by feature
- Easy to maintain and scale

---

## 🎯 Design Principles

### SOLID Principles
- **Single Responsibility**: Each module has one responsibility
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Interfaces can be substituted
- **Interface Segregation**: Client-specific interfaces
- **Dependency Inversion**: Depend on abstractions

### Additional Principles
- **DRY** (Don't Repeat Yourself): Reusable components and utilities
- **KISS** (Keep It Simple, Stupid): Simple, maintainable code
- **Separation of Concerns**: Clear boundaries between layers
- **Loose Coupling**: Minimal dependencies between modules
- **High Cohesion**: Related functionality grouped together

---

## 🔄 Request Flow

### Customer Request Flow

```
User Action → React Component → API Call → Flask Route → 
Middleware (Auth/Validation) → Business Logic → Database Query → 
Response → JSON → React State Update → UI Render
```

### Detailed Flow Example: Adding Item to Cart

```
┌─────────────┐
│   USER      │ Clicks "Add to Cart" button
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────────────┐
│  REACT COMPONENT (ProductCard.js)                   │
│  • Captures product data                            │
│  • Calls CartContext.addToCart()                    │
└──────┬──────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────┐
│  CART CONTEXT (CartContext.js)                      │
│  • Validates user authentication                    │
│  • Prepares API request payload                     │
│  • Calls fetch() with JWT token                     │
└──────┬──────────────────────────────────────────────┘
       │
       │ HTTP POST /api/cart/add
       │ Headers: { Authorization: "Bearer <JWT>" }
       │ Body: { productId: 123, quantity: 1 }
       │
       ▼
┌─────────────────────────────────────────────────────┐
│  FLASK BACKEND (app.py)                             │
│  • CORS handling                                    │
│  • Security headers                                 │
│  • Routes to cart_bp blueprint                      │
└──────┬──────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────┐
│  MIDDLEWARE (auth_middleware.py)                    │
│  • Extracts JWT token from header                   │
│  • Verifies token signature                         │
│  • Decodes user_id from token                       │
│  • Attaches user info to request context            │
└──────┬──────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────┐
│  CART ROUTE (cart_routes.py)                        │
│  • Validates input data                             │
│  • Checks product availability                      │
│  • Calculates pricing                               │
│  • Calls database utility                           │
└──────┬──────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────┐
│  DATABASE UTILITY (database.py)                     │
│  • Gets database connection from pool               │
│  • Executes parameterized SQL query                 │
│  • INSERT INTO cart_items (...)                     │
│  • Returns result                                   │
└──────┬──────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────┐
│  POSTGRESQL DATABASE                                │
│  • Validates foreign keys                           │
│  • Checks constraints                               │
│  • Inserts record                                   │
│  • Returns success/failure                          │
└──────┬──────────────────────────────────────────────┘
       │
       ▼ Response flows back up
┌─────────────────────────────────────────────────────┐
│  JSON RESPONSE                                      │
│  { success: true, message: "Added to cart",        │
│    cartCount: 3, item: {...} }                      │
└──────┬──────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────┐
│  REACT COMPONENT                                    │
│  • Updates CartContext state                        │
│  • Shows success notification                       │
│  • Updates cart badge count                         │
│  • Re-renders affected components                   │
└─────────────────────────────────────────────────────┘
```

---

## 📦 Frontend Architecture

### React Component Structure

```
src/
├── App.js                    # Root component, routing
├── index.js                  # Entry point
│
├── components/               # Reusable components
│   ├── common/              # Shared components
│   │   ├── Header.js        # Navigation header
│   │   ├── Footer.js        # Site footer
│   │   ├── LoadingSpinner.js
│   │   └── ErrorBoundary.js
│   │
│   ├── product/             # Product-related
│   │   ├── ProductCard.js
│   │   ├── ProductList.js
│   │   └── ProductFilter.js
│   │
│   ├── cart/                # Cart components
│   │   ├── CartItem.js
│   │   ├── CartSummary.js
│   │   └── CartEmpty.js
│   │
│   ├── admin/               # Admin dashboard
│   │   ├── Dashboard.js
│   │   ├── ProductManagement.js
│   │   ├── OrderManagement.js
│   │   └── Analytics.js
│   │
│   └── auth/                # Authentication
│       ├── LoginForm.js
│       └── OTPInput.js
│
├── context/                 # State management
│   ├── AuthContext.js       # User authentication state
│   ├── CartContext.js       # Shopping cart state
│   ├── WishlistContext.js   # Wishlist state
│   └── LocationContext.js   # User location state
│
├── pages/                   # Page components
│   ├── Home.js
│   ├── ProductDetails.js
│   ├── Cart.js
│   ├── Checkout.js
│   ├── Account.js
│   ├── Login.js
│   └── Admin.js
│
├── services/                # API services
│   ├── api.js              # API configuration
│   ├── authService.js      # Authentication API
│   ├── productService.js   # Product API
│   └── orderService.js     # Order API
│
└── utils/                   # Utility functions
    ├── validation.js       # Form validation
    ├── formatting.js       # Data formatting
    └── constants.js        # App constants
```

### State Management Strategy

```
┌─────────────────────────────────────────────────────┐
│              CONTEXT API HIERARCHY                   │
├─────────────────────────────────────────────────────┤
│                                                      │
│  AuthContext (User session)                         │
│  └── Provides: user, isAuthenticated, login,        │
│      logout, token                                  │
│                                                      │
│  CartContext (Shopping cart)                        │
│  └── Provides: cart, cartCount, addToCart,         │
│      removeFromCart, updateQuantity, clearCart      │
│                                                      │
│  WishlistContext (Saved items)                      │
│  └── Provides: wishlist, wishlistCount, addToWish  │
│      list, removeFromWishlist                       │
│                                                      │
│  LocationContext (User location)                    │
│  └── Provides: addresses, currentAddress,          │
│      addAddress, updateAddress                      │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Component Communication

```
Parent Component
    │
    ├─→ Props (Data down)
    │   └─→ Child Component
    │       └─→ Event callback (Up)
    │
    └─→ Context (Global state)
        └─→ Any descendant can access
```

---

## 🐍 Backend Architecture

### Flask Application Structure

```
backend/
├── app.py                   # Application entry point
│   ├── create_app()        # Application factory
│   ├── Blueprint registration
│   ├── Middleware setup
│   └── Error handlers
│
├── config/
│   └── config.py           # Configuration management
│       ├── Database config
│       ├── JWT settings
│       ├── External services
│       └── Environment variables
│
├── routes/                 # API endpoints (Blueprints)
│   ├── auth_routes.py     # /api/auth/*
│   ├── product_routes.py  # /api/products/*
│   ├── cart_routes.py     # /api/cart/*
│   ├── order_routes.py    # /api/orders/*
│   ├── user_routes.py     # /api/users/*
│   ├── category_routes.py # /api/categories/*
│   ├── banner_routes.py   # /api/banners/*
│   ├── offer_routes.py    # /api/offers/*
│   ├── analytics_routes.py# /api/analytics/*
│   ├── review_routes.py   # /api/reviews/*
│   └── report_routes.py   # /api/reports/*
│
├── utils/                  # Utilities and helpers
│   ├── database.py        # Database connection pool
│   ├── auth_middleware.py # JWT verification
│   ├── rate_limiter.py    # Rate limiting
│   ├── csrf_protection.py # CSRF tokens
│   ├── input_validator.py # Input sanitization
│   └── otp_manager.py     # OTP generation
│
└── services/              # External services
    ├── sms_service.py     # Twilio/Fast2SMS
    └── email_service.py   # Email sending
```

### Blueprint Organization

Each blueprint follows this pattern:

```python
# Example: product_routes.py

from flask import Blueprint, request, jsonify
from utils.auth_middleware import token_required, admin_required
from utils.database import db
from utils.input_validator import validate_input

product_bp = Blueprint('products', __name__)

@product_bp.route('/', methods=['GET'])
def get_products():
    """Public endpoint - no auth required"""
    # Business logic
    pass

@product_bp.route('/', methods=['POST'])
@admin_required  # Middleware decorator
def create_product():
    """Admin-only endpoint"""
    # Validate input
    # Process request
    # Return response
    pass
```

---

## 🗄️ Database Architecture

### Schema Design Principles

1. **Normalization**: Tables normalized to 3NF
2. **Referential Integrity**: Foreign key constraints
3. **Indexing**: Indexes on frequently queried columns
4. **Data Types**: Appropriate types for each column
5. **Constraints**: CHECK constraints for data validity

### Entity Relationship Diagram (Simplified)

```
┌─────────────┐
│    USERS    │
└──────┬──────┘
       │ 1
       │
       │ N
┌──────▼──────────┐        ┌──────────────┐
│ USER_ADDRESSES  │        │  CART_ITEMS  │
└─────────────────┘        └──────┬───────┘
                                  │ N
       ┌──────────────────────────┤
       │ 1                        │
┌──────▼──────┐            ┌──────▼───────┐
│  PRODUCTS   │◄───────────│  CATEGORIES  │
└──────┬──────┘ N       1  └──────────────┘
       │ 1
       │
       │ N
┌──────▼──────────┐
│  ORDER_ITEMS    │
└──────┬──────────┘
       │ N
       │
       │ 1
┌──────▼──────┐           ┌──────────────┐
│   ORDERS    │           │   REVIEWS    │
└─────────────┘           └──────────────┘
```

### Connection Pooling

```python
# database.py structure

class Database:
    def __init__(self):
        self.pool = None
    
    def get_connection(self):
        # Returns connection from pool
        pass
    
    def execute_query(self, query, params):
        # Execute with connection pooling
        pass
    
    def close_connection(self, conn):
        # Return to pool
        pass
```

---

## 🔐 Security Architecture

### Multi-Layer Security

```
┌─────────────────────────────────────────────────────┐
│  Layer 1: Network Security                          │
│  • HTTPS enforcement                                │
│  • CORS policy                                      │
│  • Security headers (HSTS, CSP, X-Frame-Options)   │
└──────┬──────────────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────────────┐
│  Layer 2: Authentication                            │
│  • JWT tokens with expiry                           │
│  • OTP-based phone verification                     │
│  • Session management                               │
└──────┬──────────────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────────────┐
│  Layer 3: Authorization                             │
│  • Role-based access control (Customer/Admin)       │
│  • Route protection middleware                      │
│  • Resource ownership verification                  │
└──────┬──────────────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────────────┐
│  Layer 4: Input Validation                          │
│  • Input sanitization                               │
│  • Type checking                                    │
│  • Length limits                                    │
│  • SQL injection prevention (parameterized queries) │
└──────┬──────────────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────────────┐
│  Layer 5: Rate Limiting                             │
│  • Login attempt limits                             │
│  • API request throttling                           │
│  • DDoS protection                                  │
└──────┬──────────────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────────────┐
│  Layer 6: Data Protection                           │
│  • Password hashing (bcrypt)                        │
│  • Sensitive data encryption                        │
│  • No plaintext secrets                             │
└─────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Architecture

### Read Operation (GET Request)

```
Client Request
    ↓
API Gateway (Flask)
    ↓
Authentication Middleware
    ↓
Route Handler
    ↓
Business Logic
    ↓
Database Query (Read)
    ↓
Data Formatting
    ↓
JSON Response
    ↓
Client Receives Data
    ↓
UI Update
```

### Write Operation (POST/PUT Request)

```
Client Request with Data
    ↓
API Gateway (Flask)
    ↓
Authentication Middleware
    ↓
Input Validation
    ↓
CSRF Verification
    ↓
Rate Limiting Check
    ↓
Route Handler
    ↓
Business Logic Validation
    ↓
Database Transaction (Write)
    ↓
Success/Error Response
    ↓
Client Receives Confirmation
    ↓
UI Update
```

---

## 🚀 Scalability Considerations

### Horizontal Scaling

- **Stateless Backend**: Easy to replicate Flask instances
- **Load Balancing**: Distribute requests across servers
- **Database Replication**: Read replicas for scaling reads
- **CDN**: Static asset delivery

### Vertical Scaling

- **Database Optimization**: Indexes, query optimization
- **Caching**: Redis for frequently accessed data
- **Connection Pooling**: Efficient database connections

### Future Enhancements

- **Microservices**: Break into smaller services
- **Message Queue**: Async processing (Celery + Redis)
- **Containerization**: Docker for deployment
- **Kubernetes**: Orchestration for scaling

---

## 🔄 API Architecture

### RESTful API Design

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | /api/products | List products | No |
| GET | /api/products/:id | Get product details | No |
| POST | /api/products | Create product | Admin |
| PUT | /api/products/:id | Update product | Admin |
| DELETE | /api/products/:id | Delete product | Admin |

### Response Format Standard

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-02-01T12:00:00Z"
}
```

### Error Format Standard

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2026-02-01T12:00:00Z"
}
```

---

## 📚 Related Documentation

- [Technology Stack Details](04_TECHNOLOGY_STACK.md)
- [Backend API Documentation](BACKEND_01_API_DOCUMENTATION.md)
- [Database Schema](BACKEND_02_DATABASE_SCHEMA.md)
- [Security Documentation](SECURITY_01_AUTHENTICATION.md)
- [Frontend Architecture](FRONTEND_01_ARCHITECTURE.md)

---

**Architecture Version**: 1.0.0  
**Last Updated**: February 2026  
**Reviewed By**: Development Team
