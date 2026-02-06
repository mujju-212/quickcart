# QuickCart - Error Handling & Logging

## 🐛 Complete Error Handling Documentation

This document covers error handling patterns, HTTP status codes, error response formats, logging strategies, and debugging techniques used in QuickCart.

---

## 📋 Table of Contents

1. [Error Handling Overview](#error-handling-overview)
2. [HTTP Status Codes](#http-status-codes)
3. [Error Response Format](#error-response-format)
4. [Backend Error Handling](#backend-error-handling)
5. [Frontend Error Handling](#frontend-error-handling)
6. [Logging Strategy](#logging-strategy)
7. [Error Categories](#error-categories)
8. [Debugging Techniques](#debugging-techniques)
9. [Error Monitoring](#error-monitoring)
10. [Best Practices](#best-practices)

---

## 🎯 Error Handling Overview

### Design Principles

QuickCart follows these error handling principles:

✅ **Consistent**: Uniform error format across all endpoints  
✅ **Informative**: Clear error messages for debugging  
✅ **Secure**: No sensitive data in error responses  
✅ **User-Friendly**: Helpful messages for end users  
✅ **Logged**: All errors captured for monitoring  

### Error Flow

```
┌──────────────────────────────────────────────────┐
│  Request                                         │
│  ↓                                               │
│  Backend Processing                              │
│  ↓                                               │
│  Error Occurs                                    │
│  ↓                                               │
│  ┌──────────────────────────────────────────┐   │
│  │  Error Handler                           │   │
│  │  • Log error details                     │   │
│  │  • Determine error type                  │   │
│  │  • Select HTTP status code               │   │
│  │  • Format error response                 │   │
│  │  • Return to client                      │   │
│  └──────────────────────────────────────────┘   │
│  ↓                                               │
│  Frontend Error Handling                         │
│  ↓                                               │
│  ┌──────────────────────────────────────────┐   │
│  │  Display to User                         │   │
│  │  • Parse error message                   │   │
│  │  • Show user-friendly message            │   │
│  │  • Log to console (dev mode)             │   │
│  │  • Track error (production)              │   │
│  └──────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

---

## 📊 HTTP Status Codes

### Standard Status Codes Used

| Code | Name | Usage | Example |
|------|------|-------|---------|
| **200** | OK | Successful request | Product fetched |
| **201** | Created | Resource created | New product added |
| **400** | Bad Request | Invalid input | Missing required field |
| **401** | Unauthorized | Authentication required | Missing/invalid token |
| **403** | Forbidden | Access denied | Non-admin accessing admin route |
| **404** | Not Found | Resource not found | Product doesn't exist |
| **409** | Conflict | Resource conflict | Duplicate email |
| **422** | Unprocessable Entity | Validation failed | Invalid email format |
| **429** | Too Many Requests | Rate limit exceeded | Too many OTP requests |
| **500** | Internal Server Error | Server error | Database connection failed |
| **503** | Service Unavailable | Service down | Third-party API down |

### Status Code Selection Guide

```python
# 200 OK - Successful GET/PUT/DELETE
if operation_successful:
    return jsonify({'success': True, 'data': data}), 200

# 201 Created - Successful POST (resource created)
if resource_created:
    return jsonify({'success': True, 'id': new_id}), 201

# 400 Bad Request - Invalid input
if missing_required_field:
    return jsonify({'success': False, 'message': 'Field required'}), 400

# 401 Unauthorized - Authentication failed
if not authenticated:
    return jsonify({'success': False, 'error': 'Auth required'}), 401

# 403 Forbidden - Authorized but no permission
if not admin:
    return jsonify({'success': False, 'error': 'Admin only'}), 403

# 404 Not Found - Resource doesn't exist
if not product:
    return jsonify({'success': False, 'message': 'Not found'}), 404

# 429 Too Many Requests - Rate limit exceeded
if rate_limited:
    return jsonify({'success': False, 'message': 'Rate limit'}), 429

# 500 Internal Server Error - Unexpected error
except Exception as e:
    return jsonify({'success': False, 'message': 'Server error'}), 500
```

---

## 📝 Error Response Format

### Standard Error Response

**Format:**
```json
{
  "success": false,
  "error": "Error type or category",
  "message": "Human-readable error description",
  "details": {
    "field": "Additional context",
    "code": "ERROR_CODE"
  }
}
```

### Examples by Type

#### 1. Validation Error (400)

```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Phone number is required",
  "details": {
    "field": "phoneNumber",
    "code": "REQUIRED_FIELD"
  }
}
```

#### 2. Authentication Error (401)

```json
{
  "success": false,
  "error": "Authentication token is missing",
  "message": "Please log in to continue"
}
```

#### 3. Authorization Error (403)

```json
{
  "success": false,
  "error": "Admin access required",
  "message": "You don't have permission to access this resource"
}
```

#### 4. Not Found Error (404)

```json
{
  "success": false,
  "error": "Resource not found",
  "message": "Product with ID 999 not found"
}
```

#### 5. Rate Limit Error (429)

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Daily OTP limit exceeded. Try again after 11:30 PM",
  "rate_limit_exceeded": true,
  "reset_time": "2026-02-01T23:30:00Z"
}
```

#### 6. Server Error (500)

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred. Please try again later"
}
```

---

## 🔧 Backend Error Handling

### Global Error Handler

```python
@app.errorhandler(Exception)
def handle_exception(e):
    """Global exception handler"""
    # Log the error
    app.logger.error(f"Unhandled exception: {str(e)}", exc_info=True)
    
    # Return generic error (don't expose internals)
    return jsonify({
        'success': False,
        'error': 'Internal server error',
        'message': 'An unexpected error occurred'
    }), 500

@app.errorhandler(404)
def handle_not_found(e):
    """Handle 404 errors"""
    return jsonify({
        'success': False,
        'error': 'Not found',
        'message': 'The requested resource was not found'
    }), 404

@app.errorhandler(405)
def handle_method_not_allowed(e):
    """Handle 405 errors"""
    return jsonify({
        'success': False,
        'error': 'Method not allowed',
        'message': f'Method {request.method} not allowed for this endpoint'
    }), 405
```

### Try-Except Patterns

**Pattern 1: Simple Try-Except**

```python
@product_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        cursor = db.get_cursor()
        cursor.execute("SELECT * FROM products WHERE id = %s", (product_id,))
        product = cursor.fetchone()
        
        if not product:
            return jsonify({
                'success': False,
                'message': f'Product {product_id} not found'
            }), 404
        
        return jsonify({
            'success': True,
            'product': product
        }), 200
        
    except Exception as e:
        print(f"❌ Error fetching product: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500
```

**Pattern 2: Specific Exception Handling**

```python
from psycopg2 import IntegrityError, OperationalError

@product_bp.route('/products', methods=['POST'])
def create_product():
    try:
        data = request.get_json()
        cursor = db.get_cursor()
        
        cursor.execute("""
            INSERT INTO products (name, price, category_id)
            VALUES (%s, %s, %s)
            RETURNING *
        """, (data['name'], data['price'], data['category_id']))
        
        product = cursor.fetchone()
        db.commit()
        
        return jsonify({
            'success': True,
            'product': product
        }), 201
        
    except IntegrityError as e:
        db.rollback()
        return jsonify({
            'success': False,
            'error': 'Integrity constraint violated',
            'message': 'Product with this name already exists'
        }), 409
        
    except OperationalError as e:
        db.rollback()
        print(f"❌ Database error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Database connection error'
        }), 503
        
    except KeyError as e:
        return jsonify({
            'success': False,
            'error': 'Validation error',
            'message': f'Missing required field: {str(e)}'
        }), 400
        
    except Exception as e:
        db.rollback()
        print(f"❌ Unexpected error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500
```

### Input Validation Errors

```python
def validate_product_data(data):
    """Validate product creation data"""
    errors = []
    
    if 'name' not in data or not data['name']:
        errors.append({
            'field': 'name',
            'message': 'Product name is required'
        })
    
    if 'price' not in data:
        errors.append({
            'field': 'price',
            'message': 'Price is required'
        })
    elif not isinstance(data['price'], (int, float)) or data['price'] <= 0:
        errors.append({
            'field': 'price',
            'message': 'Price must be a positive number'
        })
    
    if 'category_id' not in data:
        errors.append({
            'field': 'category_id',
            'message': 'Category is required'
        })
    
    if errors:
        return False, errors
    
    return True, None

# Usage in route
@product_bp.route('/products', methods=['POST'])
def create_product():
    data = request.get_json()
    
    # Validate input
    is_valid, errors = validate_product_data(data)
    if not is_valid:
        return jsonify({
            'success': False,
            'error': 'Validation failed',
            'message': 'Invalid product data',
            'errors': errors
        }), 400
    
    # Proceed with creation...
```

### Database Error Handling

```python
class Database:
    def get_cursor(self):
        """Get database cursor with error handling"""
        try:
            if not self.connection or self.connection.closed:
                self._connect()
            return self.connection.cursor(cursor_factory=RealDictCursor)
        except OperationalError as e:
            print(f"❌ Database connection error: {str(e)}")
            # Attempt reconnection
            self._connect()
            return self.connection.cursor(cursor_factory=RealDictCursor)
    
    def commit(self):
        """Commit with error handling"""
        try:
            self.connection.commit()
        except Exception as e:
            print(f"❌ Commit error: {str(e)}")
            self.rollback()
            raise
    
    def rollback(self):
        """Rollback transaction"""
        try:
            self.connection.rollback()
        except Exception as e:
            print(f"❌ Rollback error: {str(e)}")
```

---

## ⚛️ Frontend Error Handling

### Fetch Error Handling

```javascript
async function fetchProducts() {
  try {
    const response = await fetch('/api/products');
    
    // Check HTTP status
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Check success flag
    if (!data.success) {
      throw new Error(data.message || 'Request failed');
    }
    
    return data.products;
    
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // User-friendly message
    if (error.message.includes('Failed to fetch')) {
      alert('Network error. Please check your connection.');
    } else if (error.message.includes('500')) {
      alert('Server error. Please try again later.');
    } else {
      alert(error.message);
    }
    
    return [];
  }
}
```

### Error Boundary Component

```javascript
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Log to error tracking service (production)
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>Something went wrong</h1>
          <p>We're sorry for the inconvenience. Please refresh the page.</p>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Usage in App.js
<ErrorBoundary>
  <Routes>
    <Route path="/" element={<Home />} />
    ...
  </Routes>
</ErrorBoundary>
```

### Toast Notification System

```javascript
// ToastSystem.js
import { useState, useEffect } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  };

  const showError = (message) => showToast(message, 'error', 5000);
  const showSuccess = (message) => showToast(message, 'success', 3000);
  const showWarning = (message) => showToast(message, 'warning', 4000);

  return { toasts, showToast, showError, showSuccess, showWarning };
};

// Usage in components
const { showError, showSuccess } = useToast();

try {
  const response = await fetch('/api/products', { method: 'POST', ... });
  const data = await response.json();
  
  if (data.success) {
    showSuccess('Product added successfully!');
  } else {
    showError(data.message);
  }
} catch (error) {
  showError('Failed to add product. Please try again.');
}
```

---

## 📝 Logging Strategy

### Backend Logging

**Console Logging (Development):**

```python
import os

IS_DEVELOPMENT = os.environ.get('FLASK_ENV') == 'development'

def log_info(message):
    """Log info message"""
    if IS_DEVELOPMENT:
        print(f"ℹ️ {message}")

def log_success(message):
    """Log success message"""
    if IS_DEVELOPMENT:
        print(f"✅ {message}")

def log_warning(message):
    """Log warning message"""
    print(f"⚠️ WARNING: {message}")

def log_error(message, error=None):
    """Log error message"""
    print(f"❌ ERROR: {message}")
    if error and IS_DEVELOPMENT:
        print(f"   Details: {str(error)}")

# Usage
log_info("Fetching products from database")
log_success(f"Product {product_id} created successfully")
log_warning("Low stock detected for product ID 5")
log_error("Database connection failed", error=e)
```

**Structured Logging (Production):**

```python
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/quickcart.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# Usage
logger.info(f"User {user_id} logged in")
logger.warning(f"Rate limit exceeded for phone {phone}")
logger.error(f"Database error: {str(e)}", exc_info=True)
```

### Request Logging

```python
@app.before_request
def log_request():
    """Log incoming requests"""
    if IS_DEVELOPMENT:
        print(f"→ {request.method} {request.path}")
        if request.get_json():
            print(f"  Body: {request.get_json()}")

@app.after_request
def log_response(response):
    """Log outgoing responses"""
    if IS_DEVELOPMENT:
        print(f"← {response.status_code} {request.path}")
    return response
```

### Error Logging

```python
@app.errorhandler(Exception)
def handle_exception(e):
    """Log and handle exceptions"""
    logger.error(
        f"Unhandled exception in {request.method} {request.path}",
        exc_info=True,
        extra={
            'method': request.method,
            'path': request.path,
            'ip': request.remote_addr,
            'user_agent': request.user_agent.string
        }
    )
    
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500
```

### Frontend Logging

```javascript
const logger = {
  info: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`ℹ️ ${message}`, data || '');
    }
  },
  
  success: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${message}`, data || '');
    }
  },
  
  warning: (message, data) => {
    console.warn(`⚠️ ${message}`, data || '');
  },
  
  error: (message, error) => {
    console.error(`❌ ${message}`, error || '');
    
    // Send to error tracking (production)
    if (process.env.NODE_ENV === 'production') {
      // trackError(message, error);
    }
  }
};

// Usage
logger.info('Fetching products');
logger.success('Product added', { id: 123 });
logger.warning('Low stock detected');
logger.error('Failed to fetch', error);
```

---

## 📂 Error Categories

### 1. Client Errors (4xx)

**Bad Request (400):**
- Missing required fields
- Invalid data format
- Malformed JSON

**Unauthorized (401):**
- Missing authentication token
- Invalid token
- Expired token

**Forbidden (403):**
- Insufficient permissions
- Admin-only resource access

**Not Found (404):**
- Resource doesn't exist
- Invalid endpoint

**Rate Limited (429):**
- Too many requests
- OTP limit exceeded

### 2. Server Errors (5xx)

**Internal Server Error (500):**
- Unhandled exceptions
- Database errors
- Third-party API failures

**Service Unavailable (503):**
- Database down
- External service down
- Maintenance mode

---

## 🔍 Debugging Techniques

### Backend Debugging

**1. Print Debugging:**

```python
print(f"📍 Checkpoint 1: user_id = {user_id}")
print(f"📍 Checkpoint 2: query = {query}")
print(f"📍 Checkpoint 3: result = {result}")
```

**2. Interactive Debugger (pdb):**

```python
import pdb

@product_bp.route('/products/<int:product_id>')
def get_product(product_id):
    pdb.set_trace()  # Debugger breakpoint
    cursor = db.get_cursor()
    ...
```

**3. Flask Debug Mode:**

```bash
export FLASK_DEBUG=1
flask run
```

### Frontend Debugging

**1. Console Debugging:**

```javascript
console.log('📍 State:', this.state);
console.log('📍 Props:', this.props);
console.log('📍 Response:', response);
```

**2. React DevTools:**

Install React DevTools browser extension to inspect:
- Component hierarchy
- Props and state
- Context values
- Render performance

**3. Network Tab:**

Inspect API calls:
- Request headers
- Request payload
- Response status
- Response body
- Timing information

---

## 📊 Error Monitoring

### Production Error Tracking

**Recommended Services:**
- Sentry
- Rollbar
- LogRocket
- Bugsnag

**Implementation Example (Sentry):**

```python
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn="https://...@sentry.io/...",
    integrations=[FlaskIntegration()],
    traces_sample_rate=1.0
)

# Errors automatically captured
```

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://...@sentry.io/...",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});

// Errors automatically captured
```

### Custom Error Tracking

```python
def track_error(error, context=None):
    """Track error for monitoring"""
    error_data = {
        'timestamp': datetime.utcnow().isoformat(),
        'error': str(error),
        'type': type(error).__name__,
        'context': context or {}
    }
    
    # Log to file
    with open('logs/errors.log', 'a') as f:
        f.write(json.dumps(error_data) + '\n')
    
    # Send to monitoring service
    # send_to_monitoring(error_data)
```

---

## ✅ Best Practices

### Do's

✅ **Always use try-except blocks**
```python
try:
    # Risky operation
except Exception as e:
    # Handle error
```

✅ **Return appropriate HTTP status codes**
```python
return jsonify({'success': False}), 400  # Not 200!
```

✅ **Log errors with context**
```python
logger.error(f"Error in get_product(id={product_id}): {str(e)}")
```

✅ **Validate input early**
```python
if not data.get('name'):
    return jsonify({'error': 'Name required'}), 400
```

✅ **Use error boundaries (React)**
```jsx
<ErrorBoundary>
  <Component />
</ErrorBoundary>
```

### Don'ts

❌ **Don't expose sensitive data**
```python
# Bad: Exposes database structure
return jsonify({'error': str(e)}), 500

# Good: Generic message
return jsonify({'error': 'Server error'}), 500
```

❌ **Don't ignore errors silently**
```python
# Bad
try:
    dangerous_operation()
except:
    pass  # Silent failure!

# Good
try:
    dangerous_operation()
except Exception as e:
    logger.error(f"Operation failed: {e}")
    raise
```

❌ **Don't use bare except**
```python
# Bad: Catches everything including KeyboardInterrupt
except:
    handle_error()

# Good: Catch specific exceptions
except (ValueError, KeyError) as e:
    handle_error(e)
```

---

## 📚 Related Documentation

- **[Authentication Flow](BACKEND_03_AUTHENTICATION_FLOW.md)** - Auth errors
- **[API Documentation](BACKEND_01_API_DOCUMENTATION.md)** - API error responses
- **[Frontend Architecture](FRONTEND_01_ARCHITECTURE.md)** - Frontend error handling
- **[Security Overview](SECURITY_01_OVERVIEW.md)** - Security-related errors

---

**Error Handling Version**: 2.0.0  
**Last Updated**: February 2026  

🐛 **Handle Errors Gracefully!**
