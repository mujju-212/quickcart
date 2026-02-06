# QuickCart - Complete API Documentation

## 📋 Table of Contents

1. [API Overview](#api-overview)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
   - [Authentication Endpoints](#authentication-endpoints)
   - [Product Endpoints](#product-endpoints)
   - [Cart Endpoints](#cart-endpoints)
   - [Order Endpoints](#order-endpoints)
   - [User Endpoints](#user-endpoints)
   - [Category Endpoints](#category-endpoints)
   - [Wishlist Endpoints](#wishlist-endpoints)
   - [Banner Endpoints](#banner-endpoints)
   - [Offer Endpoints](#offer-endpoints)
   - [Analytics Endpoints](#analytics-endpoints)
   - [Review Endpoints](#review-endpoints)
   - [Report Endpoints](#report-endpoints)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)

---

## 🌐 API Overview

### Base URL
```
http://localhost:5000/api
```

### Request Format
- **Content-Type**: `application/json`
- **Authorization**: `Bearer <JWT_TOKEN>` (for protected routes)

### Response Format
All API responses follow a standard format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "count": 10
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| **200** | OK | Successful GET, PUT, DELETE |
| **201** | Created | Successful POST |
| **400** | Bad Request | Invalid input |
| **401** | Unauthorized | Missing/invalid auth |
| **403** | Forbidden | Insufficient permissions |
| **404** | Not Found | Resource doesn't exist |
| **429** | Too Many Requests | Rate limit exceeded |
| **500** | Internal Server Error | Server error |

---

## 🔐 Authentication

### JWT Token Structure

```json
{
  "user_id": 123,
  "phone": "+919876543210",
  "role": "customer",
  "exp": 1707172800
}
```

### Authentication Header
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiry
- **Duration**: 24 hours
- **Refresh**: Not implemented (re-login required)

---

## 📡 API Endpoints

## Authentication Endpoints

### 1. Send OTP

Send OTP to phone number for authentication.

**Endpoint:** `POST /api/auth/send-otp`

**Auth Required:** No

**Rate Limit:** 20 requests per day per phone number

**Request Body:**
```json
{
  "phoneNumber": "+919876543210"
}
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "provider": "twilio",
  "remaining_attempts": 19
}
```

**Development Response:**
```json
{
  "success": true,
  "message": "Development Mode: OTP is 123456",
  "provider": "development",
  "otp": "123456",
  "development_mode": true,
  "remaining_attempts": 19
}
```

**Error Response:** `429 Too Many Requests`
```json
{
  "success": false,
  "message": "Daily OTP limit exceeded. Try again after 11:59 PM",
  "rate_limit_exceeded": true,
  "reset_time": "2026-02-01T23:59:59"
}
```

**Validation Rules:**
- Phone format: `+91XXXXXXXXXX` or `XXXXXXXXXX`
- Valid Indian mobile number (10 digits)

---

### 2. Verify OTP

Verify OTP and receive JWT token.

**Endpoint:** `POST /api/auth/verify-otp`

**Auth Required:** No

**Request Body:**
```json
{
  "phoneNumber": "+919876543210",
  "otp": "123456"
}
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "phone": "+919876543210",
    "email": "john@example.com",
    "role": "customer",
    "status": "active"
  }
}
```

**Error Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Invalid or expired OTP"
}
```

**OTP Expiry:** 10 minutes

---

### 3. Check Auth Status

Check if JWT token is valid.

**Endpoint:** `GET /api/auth/check`

**Auth Required:** Yes

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "authenticated": true,
  "user": {
    "id": 1,
    "phone": "+919876543210",
    "role": "customer"
  }
}
```

---

### 4. Admin Login

Admin authentication with rate limiting.

**Endpoint:** `POST /api/auth/admin-login`

**Auth Required:** No

**Rate Limit:** 5 attempts per minute per IP

**Request Body:**
```json
{
  "phone": "+919876543210",
  "password": "securePassword123"
}
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Admin login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "phone": "+919876543210",
    "role": "admin",
    "status": "active"
  }
}
```

---

## Product Endpoints

### 1. Get All Products

Retrieve list of all products with optional filtering.

**Endpoint:** `GET /api/products`

**Auth Required:** No

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `category` | string | Filter by category | `?category=Vegetables` |
| `search` | string | Search in name/description | `?search=tomato` |
| `limit` | integer | Limit results | `?limit=10` |
| `include_out_of_stock` | boolean | Include unavailable items | `?include_out_of_stock=true` |

**Examples:**
```
GET /api/products
GET /api/products?category=Fruits
GET /api/products?search=apple&limit=5
GET /api/products?include_out_of_stock=true
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "name": "Fresh Tomatoes",
      "category_id": 2,
      "category_name": "Vegetables",
      "price": 45.00,
      "original_price": 50.00,
      "size": "500g",
      "stock": 100,
      "image_url": "/images/tomatoes.jpg",
      "description": "Farm fresh tomatoes",
      "status": "active",
      "created_at": "2026-01-15T10:00:00",
      "updated_at": "2026-02-01T08:00:00"
    }
  ],
  "count": 1
}
```

---

### 2. Get Product by ID

Retrieve specific product details.

**Endpoint:** `GET /api/products/<product_id>`

**Auth Required:** No

**Success Response:** `200 OK`
```json
{
  "success": true,
  "product": {
    "id": 1,
    "name": "Fresh Tomatoes",
    "category_name": "Vegetables",
    "price": 45.00,
    "stock": 100,
    "image_url": "/images/tomatoes.jpg",
    "description": "Farm fresh tomatoes"
  }
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "error": "Product not found"
}
```

---

### 3. Create Product (Admin)

Add new product to catalog.

**Endpoint:** `POST /api/products`

**Auth Required:** Yes (Admin only)

**Request Body:**
```json
{
  "name": "Fresh Carrots",
  "category_id": 2,
  "price": 40.00,
  "original_price": 45.00,
  "size": "500g",
  "stock": 150,
  "image_url": "/images/carrots.jpg",
  "description": "Organic carrots",
  "status": "active"
}
```

**Success Response:** `201 Created`
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "id": 101,
    "name": "Fresh Carrots",
    "price": 40.00
  }
}
```

**Validation Rules:**
- `name`: Required, 3-200 characters
- `price`: Required, > 0
- `stock`: Required, >= 0
- `category_id`: Must exist in categories table

---

### 4. Update Product (Admin)

Update existing product.

**Endpoint:** `PUT /api/products/<product_id>`

**Auth Required:** Yes (Admin only)

**Request Body:** (All fields optional)
```json
{
  "price": 42.00,
  "stock": 120,
  "status": "active"
}
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Product updated successfully"
}
```

---

### 5. Delete Product (Admin)

Delete product from catalog.

**Endpoint:** `DELETE /api/products/<product_id>`

**Auth Required:** Yes (Admin only)

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## Cart Endpoints

### 1. Get Cart

Retrieve user's cart items.

**Endpoint:** `GET /api/cart`

**Auth Required:** Yes

**Success Response:** `200 OK`
```json
{
  "success": true,
  "cart": [
    {
      "id": 1,
      "product_id": 5,
      "product_name": "Fresh Tomatoes",
      "price": 45.00,
      "quantity": 2,
      "image_url": "/images/tomatoes.jpg",
      "stock": 100,
      "subtotal": 90.00
    }
  ],
  "cartCount": 1,
  "total": 90.00
}
```

---

### 2. Add to Cart

Add item to cart or update quantity if exists.

**Endpoint:** `POST /api/cart/add`

**Auth Required:** Yes

**Request Body:**
```json
{
  "product_id": 5,
  "quantity": 2
}
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Item added to cart",
  "cart_count": 3
}
```

**Error Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Insufficient stock. Only 10 items available"
}
```

---

### 3. Update Cart Item

Update quantity of cart item.

**Endpoint:** `PUT /api/cart/<cart_item_id>`

**Auth Required:** Yes

**Request Body:**
```json
{
  "quantity": 3
}
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Cart updated successfully"
}
```

---

### 4. Remove from Cart

Remove item from cart.

**Endpoint:** `DELETE /api/cart/<cart_item_id>`

**Auth Required:** Yes

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

---

### 5. Clear Cart

Remove all items from cart.

**Endpoint:** `DELETE /api/cart/clear`

**Auth Required:** Yes

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

---

## Order Endpoints

### 1. Create Order

Place a new order.

**Endpoint:** `POST /api/orders`

**Auth Required:** Yes

**Request Body:**
```json
{
  "items": [
    {
      "product_id": 5,
      "quantity": 2
    }
  ],
  "delivery_address": {
    "address_line_1": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postal_code": "400001"
  },
  "payment_method": "cod",
  "coupon_code": "SAVE10"
}
```

**Success Response:** `201 Created`
```json
{
  "success": true,
  "message": "Order placed successfully",
  "order": {
    "id": "QC17070912003A4F",
    "total": 119.00,
    "status": "pending",
    "payment_status": "pending",
    "estimated_delivery": "2026-02-03T18:00:00",
    "items": [
      {
        "product_name": "Fresh Tomatoes",
        "quantity": 2,
        "price": 45.00,
        "total": 90.00
      }
    ],
    "pricing": {
      "subtotal": 90.00,
      "delivery_fee": 29.00,
      "discount": 0.00,
      "total": 119.00
    }
  }
}
```

**Security Note:** 
- Prices are calculated server-side to prevent manipulation
- Stock is validated and decremented
- Coupon codes are re-validated

---

### 2. Get User Orders

Retrieve all orders for logged-in user.

**Endpoint:** `GET /api/orders`

**Auth Required:** Yes

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status |
| `limit` | integer | Limit results |

**Success Response:** `200 OK`
```json
{
  "success": true,
  "orders": [
    {
      "id": "QC17070912003A4F",
      "total": 119.00,
      "status": "delivered",
      "payment_status": "completed",
      "order_date": "2026-01-28",
      "created_at": "2026-01-28T14:30:00"
    }
  ],
  "count": 1
}
```

---

### 3. Get Order Details

Retrieve specific order with items.

**Endpoint:** `GET /api/orders/<order_id>`

**Auth Required:** Yes

**Success Response:** `200 OK`
```json
{
  "success": true,
  "order": {
    "id": "QC17070912003A4F",
    "user_id": 1,
    "total": 119.00,
    "status": "delivered",
    "payment_status": "completed",
    "delivery_address": "123 Main Street, Mumbai - 400001",
    "items": [
      {
        "product_name": "Fresh Tomatoes",
        "quantity": 2,
        "product_price": 45.00,
        "total_price": 90.00
      }
    ]
  }
}
```

---

### 4. Update Order Status (Admin)

Update order status.

**Endpoint:** `PUT /api/orders/<order_id>/status`

**Auth Required:** Yes (Admin only)

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Valid Statuses:**
- `pending`
- `confirmed`
- `preparing`
- `out_for_delivery`
- `delivered`
- `cancelled`

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Order status updated successfully"
}
```

---

## Category Endpoints

### 1. Get All Categories

Retrieve all product categories.

**Endpoint:** `GET /api/categories`

**Auth Required:** No

**Success Response:** `200 OK`
```json
{
  "success": true,
  "categories": [
    {
      "id": 1,
      "name": "Vegetables",
      "image_url": "/images/vegetables.jpg",
      "products_count": 25,
      "status": "active"
    }
  ],
  "count": 1
}
```

---

### 2. Create Category (Admin)

Add new category.

**Endpoint:** `POST /api/categories`

**Auth Required:** Yes (Admin only)

**Request Body:**
```json
{
  "name": "Dairy Products",
  "image_url": "/images/dairy.jpg"
}
```

**Success Response:** `201 Created`
```json
{
  "success": true,
  "message": "Category created successfully",
  "category": {
    "id": 11,
    "name": "Dairy Products"
  }
}
```

---

## Analytics Endpoints (Admin)

### 1. Dashboard Overview

Get real-time dashboard statistics.

**Endpoint:** `GET /api/analytics/dashboard`

**Auth Required:** Yes (Admin only)

**Success Response:** `200 OK`
```json
{
  "success": true,
  "metrics": {
    "total_sales": 125000.00,
    "total_orders": 450,
    "total_customers": 180,
    "total_products": 95,
    "today_sales": 2500.00,
    "today_orders": 15,
    "pending_orders": 8,
    "low_stock_products": 5
  },
  "recent_orders": [...],
  "top_products": [...],
  "sales_chart": {
    "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    "data": [1200, 1500, 1800, 2000, 2200, 3000, 2500]
  }
}
```

---

## Report Endpoints (Admin)

### 1. Generate Sales Report (PDF)

Generate PDF sales report.

**Endpoint:** `POST /api/reports/sales/pdf`

**Auth Required:** Yes (Admin only)

**Request Body:**
```json
{
  "start_date": "2026-01-01",
  "end_date": "2026-01-31",
  "format": "detailed"
}
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "report_url": "/reports/sales_report_2026_01.pdf",
  "file_name": "sales_report_2026_01.pdf"
}
```

---

### 2. Export Orders (Excel)

Export orders to Excel file.

**Endpoint:** `GET /api/reports/orders/export`

**Auth Required:** Yes (Admin only)

**Query Parameters:**
- `start_date`: Start date (YYYY-MM-DD)
- `end_date`: End date (YYYY-MM-DD)
- `status`: Filter by status

**Success Response:** Binary file download

---

## Error Handling

### Common Error Responses

**Invalid Token:**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**Missing Authorization:**
```json
{
  "success": false,
  "message": "No authorization token provided"
}
```

**Insufficient Permissions:**
```json
{
  "success": false,
  "message": "Admin access required"
}
```

**Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "phone": "Invalid phone number format",
    "price": "Price must be greater than 0"
  }
}
```

---

## Rate Limiting

### Rate Limit Rules

| Endpoint | Limit | Window | Action on Exceed |
|----------|-------|--------|------------------|
| `/auth/send-otp` | 20 requests | 24 hours | Return 429 with reset time |
| `/auth/admin-login` | 5 attempts | 1 minute | Return 429, lock for 5 min |
| General API | 1000 requests | 1 hour | Return 429 with retry-after |

### Rate Limit Headers

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1707176400
```

---

## Testing the API

### Using cURL

```bash
# Send OTP
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+919876543210"}'

# Verify OTP
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+919876543210", "otp": "123456"}'

# Get Products (with token)
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman

1. Import collection from `/docs/postman/QuickCart.postman_collection.json`
2. Set environment variables:
   - `base_url`: `http://localhost:5000`
   - `token`: Your JWT token
3. Run requests from collection

---

## 📖 Related Documentation

- [Backend Authentication Flow](BACKEND_03_AUTHENTICATION_FLOW.md)
- [Database Schema](BACKEND_02_DATABASE_SCHEMA.md)
- [Security Documentation](SECURITY_01_AUTHENTICATION.md)
- [Frontend API Integration](FRONTEND_05_API_INTEGRATION.md)

---

**API Version**: 2.0.0  
**Last Updated**: February 2026  
**Base URL**: `http://localhost:5000/api`
