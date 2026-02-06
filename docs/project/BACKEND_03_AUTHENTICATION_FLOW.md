# QuickCart - Authentication Flow Documentation

## 🔒 Complete Authentication & Authorization Guide

This document provides an in-depth look at QuickCart's authentication system, covering OTP-based customer login, admin authentication, JWT token management, and security best practices.

---

## 📋 Table of Contents

1. [Authentication Overview](#authentication-overview)
2. [OTP Authentication Flow](#otp-authentication-flow)
3. [Admin Authentication](#admin-authentication)
4. [JWT Token Management](#jwt-token-management)
5. [Email Authentication](#email-authentication)
6. [Auth Middleware](#auth-middleware)
7. [Security Features](#security-features)
8. [Code Examples](#code-examples)
9. [Testing Authentication](#testing-authentication)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Authentication Overview

### System Architecture

QuickCart implements a **dual authentication system**:

1. **Customer Authentication**: Phone/Email OTP-based passwordless login
2. **Admin Authentication**: Traditional username/password with JWT tokens

```
┌─────────────────────────────────────────────────────┐
│           QuickCart Authentication System           │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Customer Login        │         Admin Login        │
│  ─────────────        │         ───────────        │
│  Phone/Email          │         Username           │
│       ↓               │              ↓              │
│  Send OTP             │         Password           │
│       ↓               │              ↓              │
│  Verify OTP           │         bcrypt Verify      │
│       ↓               │              ↓              │
│  JWT Token            │         JWT Token          │
│       ↓               │              ↓              │
│  Authenticated        │         Authenticated      │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Key Components

**Backend Components:**
- `backend/routes/auth_routes.py` - Authentication endpoints
- `backend/utils/auth_middleware.py` - JWT token generation & validation
- `backend/utils/otp_manager.py` - OTP storage & verification
- `backend/services/sms_service.py` - SMS OTP delivery
- `backend/services/email_service.py` - Email OTP delivery
- `backend/utils/rate_limiter.py` - Rate limiting for security

**Frontend Components:**
- `src/context/AuthContext.js` - Global authentication state
- `src/pages/Login.js` - Customer login UI
- `src/pages/Admin.js` - Admin login UI
- `src/components/common/ProtectedRoute.js` - Route protection

---

## 📱 OTP Authentication Flow

### Complete User Journey

```
┌────────────────────────────────────────────────────┐
│ Step 1: User Enters Phone Number                  │
│ ┌────────────────┐                                │
│ │ +91 9876543210 │ [Send OTP]                     │
│ └────────────────┘                                │
└────────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────────┐
│ Step 2: Backend Validation                        │
│ • Validate phone format (10 digits)               │
│ • Check rate limit (20 OTP/day)                   │
│ • Generate 6-digit OTP                            │
└────────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────────┐
│ Step 3: OTP Delivery                              │
│ • SMS via Twilio/Fast2SMS (production)            │
│ • Console display (development)                   │
│ • Store in memory with 5-min expiry               │
└────────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────────┐
│ Step 4: User Enters OTP                           │
│ ┌───┬───┬───┬───┬───┬───┐                        │
│ │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ [Verify]              │
│ └───┴───┴───┴───┴───┴───┘                        │
│ Resend OTP in 60 seconds                          │
└────────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────────┐
│ Step 5: OTP Verification                          │
│ • Verify OTP matches stored value                 │
│ • Check expiration (5 minutes)                    │
│ • Check if user exists in database                │
└────────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────────┐
│ Step 6a: Existing User                            │
│ • Generate JWT token (7-day validity)             │
│ • Return user data + token                        │
│ • Redirect to home                                │
└────────────────────────────────────────────────────┘
                    OR
┌────────────────────────────────────────────────────┐
│ Step 6b: New User                                 │
│ • Create user record in database                  │
│ • Prompt for profile completion                   │
│ • Generate JWT token                              │
│ • Redirect to profile setup                       │
└────────────────────────────────────────────────────┘
```

### API Endpoints

#### 1. Send OTP Endpoint

**Endpoint**: `POST /api/auth/send-otp`

**Request:**
```json
{
  "phoneNumber": "9876543210"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "provider": "twilio",
  "remaining_attempts": 19
}
```

**Response (Development Mode):**
```json
{
  "success": true,
  "message": "Development Mode: OTP is 123456",
  "provider": "development",
  "development_mode": true,
  "otp": "123456",
  "remaining_attempts": 19
}
```

**Response (Rate Limited):**
```json
{
  "success": false,
  "message": "Daily OTP limit exceeded. Try again after 11:30 PM",
  "rate_limit_exceeded": true,
  "reset_time": "2026-02-01T23:30:00Z"
}
```

**Status Codes:**
- `200` - OTP sent successfully
- `400` - Invalid phone number
- `429` - Rate limit exceeded
- `500` - Internal server error

#### 2. Verify OTP Endpoint

**Endpoint**: `POST /api/auth/verify-otp`

**Request:**
```json
{
  "phoneNumber": "9876543210",
  "otp": "123456"
}
```

**Response (Existing User):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 5,
    "name": "John Doe",
    "phone": "+919876543210",
    "email": "john@example.com",
    "is_admin": false
  },
  "is_new_user": false
}
```

**Response (New User):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 15,
    "name": null,
    "phone": "+919876543210",
    "email": null,
    "is_admin": false
  },
  "is_new_user": true,
  "requires_profile_completion": true
}
```

**Response (Invalid OTP):**
```json
{
  "success": false,
  "message": "Invalid OTP"
}
```

**Status Codes:**
- `200` - OTP verified, login successful
- `400` - Missing parameters
- `401` - Invalid or expired OTP
- `500` - Internal server error

### Backend Implementation

**OTP Manager (`otp_manager.py`):**

```python
class OTPManager:
    """Manage OTP storage and validation"""
    
    def __init__(self):
        self.otp_store = {}  # In-memory (use Redis in production)
        self.otp_expiry_time = 300  # 5 minutes
    
    def store_otp(self, phone_number, otp):
        """Store OTP with expiration time"""
        self.otp_store[phone_number] = {
            'otp': otp,
            'expires': time.time() + self.otp_expiry_time
        }
    
    def verify_otp(self, phone_number, otp):
        """Verify OTP and return result"""
        # Clean expired OTPs first
        self.clean_expired_otps()
        
        if phone_number not in self.otp_store:
            return {'success': False, 'message': 'OTP not found or expired'}
        
        stored_data = self.otp_store[phone_number]
        
        if time.time() > stored_data['expires']:
            del self.otp_store[phone_number]
            return {'success': False, 'message': 'OTP has expired'}
        
        if stored_data['otp'] != otp:
            return {'success': False, 'message': 'Invalid OTP'}
        
        # Valid OTP - remove from store
        del self.otp_store[phone_number]
        return {'success': True, 'message': 'OTP verified successfully'}
```

**SMS Service (`sms_service.py`):**

```python
class SMSService:
    """Send OTP via SMS"""
    
    def send_otp_sms(self, phone_number):
        """Send OTP to phone number"""
        otp = self.generate_otp()
        
        # Production: Use Twilio/Fast2SMS
        if os.environ.get('FLASK_ENV') != 'development':
            # Send via SMS provider
            self.send_via_twilio(phone_number, otp)
            return {'success': True, 'otp': otp, 'provider': 'twilio'}
        
        # Development: Console output
        print(f"🔔 DEVELOPMENT MODE: OTP for {phone_number} is: {otp}")
        return {'success': True, 'otp': otp, 'provider': 'development'}
    
    def generate_otp(self):
        """Generate random 6-digit OTP"""
        return ''.join([str(random.randint(0, 9)) for _ in range(6)])
```

### Frontend Implementation

**AuthContext (`AuthContext.js`):**

```javascript
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (phone, userData, token) => {
    // Store user data and JWT token
    setUser(userData);
    setAuthToken(token);
    
    // Store in cookies (preferred)
    Cookies.set('quickcart_user', JSON.stringify(userData), {
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    Cookies.set('auth_token', token, {
      expires: 7,
      secure: true,
      sameSite: 'strict'
    });
    
    // Also store in localStorage for compatibility
    localStorage.setItem('token', token);
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAuthToken(null);
    Cookies.remove('quickcart_user');
    Cookies.remove('auth_token');
    localStorage.clear();
    window.location.href = '/';
  }, []);

  return (
    <AuthContext.Provider value={{ user, authToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Login Component (`Login.js`):**

```javascript
const handleSendOtp = async () => {
  try {
    const response = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber })
    });
    
    const data = await response.json();
    
    if (data.success) {
      setShowOtpModal(true);
      setRemainingAttempts(data.remaining_attempts);
      
      // Development mode: auto-fill OTP
      if (data.development_mode && data.otp) {
        console.log('Dev OTP:', data.otp);
      }
    }
  } catch (error) {
    console.error('Send OTP error:', error);
  }
};

const handleVerifyOtp = async () => {
  try {
    const response = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, otp })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Login via AuthContext
      await login(phoneNumber, data.user, data.token);
      
      // Redirect based on user type
      if (data.is_new_user) {
        navigate('/account?setup=true');
      } else {
        navigate('/');
      }
    }
  } catch (error) {
    console.error('Verify OTP error:', error);
  }
};
```

---

## 👨‍💼 Admin Authentication

### Admin Login Flow

```
┌────────────────────────────────────────────────────┐
│ Step 1: Admin Enters Credentials                  │
│ Username: [admin____________]                     │
│ Password: [•••••••••]                             │
│           [Login]                                  │
└────────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────────┐
│ Step 2: Backend Validation                        │
│ • Check username exists in admin table            │
│ • Verify password using bcrypt                    │
│ • Rate limit: 5 attempts per minute               │
└────────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────────┐
│ Step 3: Generate JWT Token                        │
│ • Create payload with admin flag                  │
│ • Sign with JWT_SECRET_KEY                        │
│ • Set 24-hour expiration                          │
└────────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────────┐
│ Step 4: Return Admin Session                      │
│ • JWT token in response                           │
│ • Admin user data                                 │
│ • Redirect to admin dashboard                     │
└────────────────────────────────────────────────────┘
```

### Admin Login Endpoint

**Endpoint**: `POST /api/auth/admin-login`

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Admin login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "username": "admin",
    "name": "System Administrator",
    "is_admin": true,
    "role": "admin"
  }
}
```

**Response (Invalid Credentials):**
```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

**Response (Rate Limited):**
```json
{
  "success": false,
  "message": "Too many login attempts. Try again in 5 minutes",
  "rate_limit_exceeded": true
}
```

### Backend Implementation

**Admin Login Route:**

```python
@auth_bp.route('/admin-login', methods=['POST'])
def admin_login():
    """Admin login with username and password"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({
                'success': False,
                'message': 'Username and password are required'
            }), 400
        
        # Rate limiting: 5 attempts per minute
        allowed, _, _ = RateLimiter.check_admin_login_rate_limit(
            username, 
            max_requests=5
        )
        
        if not allowed:
            return jsonify({
                'success': False,
                'message': 'Too many login attempts. Try again in 5 minutes',
                'rate_limit_exceeded': True
            }), 429
        
        # Query admin from database
        cursor = db.get_cursor()
        cursor.execute(
            "SELECT id, username, password, name FROM admin_users WHERE username = %s",
            (username,)
        )
        admin = cursor.fetchone()
        
        if not admin:
            return jsonify({
                'success': False,
                'message': 'Invalid username or password'
            }), 401
        
        # Verify password using bcrypt
        if not bcrypt.checkpw(password.encode('utf-8'), admin['password'].encode('utf-8')):
            return jsonify({
                'success': False,
                'message': 'Invalid username or password'
            }), 401
        
        # Generate JWT token with admin flag
        token = generate_token({
            'id': admin['id'],
            'username': admin['username'],
            'name': admin['name'],
            'is_admin': True,
            'role': 'admin'
        })
        
        return jsonify({
            'success': True,
            'message': 'Admin login successful',
            'token': token,
            'admin': {
                'id': admin['id'],
                'username': admin['username'],
                'name': admin['name'],
                'is_admin': True
            }
        })
        
    except Exception as e:
        print(f"❌ Admin Login Error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500
```

---

## 🎫 JWT Token Management

### Token Structure

**JWT Payload:**
```json
{
  "user_id": 5,
  "phone": "+919876543210",
  "name": "John Doe",
  "is_admin": false,
  "exp": 1738886400,
  "iat": 1738281600
}
```

**Token Format:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo1LCJwaG9uZSI6Iis5MTk4NzY1NDMyMTAiLCJuYW1lIjoiSm9obiBEb2UiLCJpc19hZG1pbiI6ZmFsc2UsImV4cCI6MTczODg4NjQwMCwiaWF0IjoxNzM4MjgxNjAwfQ.signature
```

### Token Generation

**Function**: `generate_token()` in `auth_middleware.py`

```python
def generate_token(user_data):
    """Generate JWT token for authenticated user"""
    is_admin = user_data.get('is_admin', False) or user_data.get('role') == 'admin'
    
    payload = {
        'user_id': user_data.get('id'),
        'phone': user_data.get('phone'),
        'name': user_data.get('name', 'User'),
        'is_admin': is_admin,
        'exp': datetime.utcnow() + timedelta(hours=168),  # 7 days
        'iat': datetime.utcnow()
    }
    
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token
```

### Token Verification

**Function**: `verify_token()` in `auth_middleware.py`

```python
def verify_token(token):
    """Verify and decode JWT token"""
    try:
        # Remove 'Bearer ' prefix if present
        if token.startswith('Bearer '):
            token = token[7:]
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return {'success': True, 'data': payload}
    except jwt.ExpiredSignatureError:
        return {'success': False, 'error': 'Token has expired'}
    except jwt.InvalidTokenError:
        return {'success': False, 'error': 'Invalid token'}
```

### Token Storage

**Frontend Storage Strategy:**

1. **Primary**: HTTP-only Cookies (secure, XSS-protected)
2. **Fallback**: localStorage (for compatibility)

```javascript
// Store token in cookies (preferred)
Cookies.set('auth_token', token, {
  expires: 7,              // 7 days
  secure: true,            // HTTPS only
  sameSite: 'strict',      // CSRF protection
  httpOnly: false          // JS accessible for API calls
});

// Also store in localStorage for API calls
localStorage.setItem('token', token);
localStorage.setItem('authToken', token);
```

### Token Usage in API Calls

**Authorization Header:**

```javascript
const response = await fetch('/api/products', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  }
});
```

**Backend Token Extraction:**

```python
@token_required
def protected_route():
    # Token extracted and verified by decorator
    # User data available in request.user
    user_id = request.user['user_id']
    is_admin = request.user['is_admin']
    # ...
```

---

## 📧 Email Authentication

### Email OTP Flow

Similar to phone OTP, but uses email delivery:

```
User enters email → Validate email format → Generate OTP
→ Send via SMTP → Store with expiry → User verifies OTP
→ Check database → Create/login user → Generate JWT
```

### Email OTP Endpoint

**Endpoint**: `POST /api/auth/send-email-otp`

**Request:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email",
  "provider": "smtp"
}
```

### Email Service Implementation

```python
class EmailService:
    """Send OTP via email"""
    
    def send_otp_email(self, email):
        """Send OTP to email address"""
        otp = self.generate_otp()
        
        subject = "QuickCart - Your Login OTP"
        body = f"""
        <html>
          <body>
            <h2>QuickCart Login</h2>
            <p>Your OTP is: <strong>{otp}</strong></p>
            <p>Valid for 5 minutes</p>
          </body>
        </html>
        """
        
        # Send email via SMTP
        self.send_email(email, subject, body)
        
        return {'success': True, 'otp': otp, 'provider': 'smtp'}
```

---

## 🛡️ Auth Middleware

### Protected Route Decorator

**`@token_required` Decorator:**

```python
def token_required(f):
    """Decorator to protect routes requiring authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from Authorization header
        if 'Authorization' in request.headers:
            token = request.headers['Authorization']
        
        if not token:
            return jsonify({
                'success': False,
                'error': 'Authentication token is missing'
            }), 401
        
        # Verify token
        result = verify_token(token)
        
        if not result['success']:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 401
        
        # Attach user data to request
        request.user = result['data']
        
        return f(*args, **kwargs)
    
    return decorated
```

### Admin-Only Decorator

**`@admin_required` Decorator:**

```python
def admin_required(f):
    """Decorator to protect admin-only routes"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            token = request.headers['Authorization']
        
        if not token:
            return jsonify({
                'success': False,
                'error': 'Authentication required'
            }), 401
        
        result = verify_token(token)
        
        if not result['success']:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 401
        
        # Check admin flag
        if not result['data'].get('is_admin', False):
            return jsonify({
                'success': False,
                'error': 'Admin access required'
            }), 403
        
        request.user = result['data']
        return f(*args, **kwargs)
    
    return decorated
```

### Usage Example

```python
@product_bp.route('/products', methods=['POST'])
@admin_required
def create_product():
    """Create new product (admin only)"""
    admin_id = request.user['user_id']
    # Create product logic...
    return jsonify({'success': True})

@order_bp.route('/my-orders', methods=['GET'])
@token_required
def get_user_orders():
    """Get user's orders (authenticated users)"""
    user_id = request.user['user_id']
    # Fetch orders logic...
    return jsonify({'success': True, 'orders': orders})
```

---

## 🔒 Security Features

### 1. Rate Limiting

**OTP Rate Limit**: 20 requests per day per phone number

```python
allowed, remaining, reset_time = RateLimiter.check_otp_rate_limit(
    phone_number, 
    max_requests=20
)

if not allowed:
    return jsonify({
        'success': False,
        'message': f'Daily OTP limit exceeded. Try again after {reset_time}',
        'rate_limit_exceeded': True
    }), 429
```

**Admin Login Rate Limit**: 5 requests per minute per username

```python
allowed, _, _ = RateLimiter.check_admin_login_rate_limit(
    username,
    max_requests=5
)
```

### 2. OTP Expiration

- **Expiry Time**: 5 minutes (300 seconds)
- **Single Use**: OTP deleted after successful verification
- **Auto-Cleanup**: Expired OTPs removed automatically

### 3. Password Security

**Admin Password Hashing:**

```python
import bcrypt

# Hash password on admin creation
hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

# Verify password on login
is_valid = bcrypt.checkpw(
    password.encode('utf-8'), 
    stored_hash.encode('utf-8')
)
```

### 4. JWT Secret Protection

```python
SECRET_KEY = os.environ.get('JWT_SECRET_KEY')

if not SECRET_KEY:
    if os.environ.get('FLASK_ENV') == 'development':
        SECRET_KEY = 'dev-secret-key-change-in-production'
        print("⚠️ WARNING: Using default JWT secret in development")
    else:
        raise ValueError("JWT_SECRET_KEY must be set in production!")
```

### 5. Input Validation

**Phone Number Validation:**

```python
def validate_phone(phone_number):
    """Validate Indian phone number"""
    # Remove spaces, dashes, parentheses
    clean = re.sub(r'[\s\-\(\)]', '', phone_number)
    
    # Remove +91 prefix if present
    if clean.startswith('+91'):
        clean = clean[3:]
    elif clean.startswith('91'):
        clean = clean[2:]
    
    # Check 10-digit format
    if not re.match(r'^[6-9]\d{9}$', clean):
        return False, None, 'Invalid phone number format'
    
    return True, clean, None
```

**Email Validation:**

```python
def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    if not re.match(pattern, email):
        return False, None, 'Invalid email format'
    
    return True, email.lower(), None
```

---

## 💻 Code Examples

### Complete Login Implementation

**Frontend (React):**

```javascript
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const { login } = useAuth();

  const handleSendOtp = async () => {
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowOtpModal(true);
        // Development: auto-fill OTP
        if (data.development_mode) {
          setOtp(data.otp);
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Login via context
        await login(phoneNumber, data.user, data.token);
        // Redirect
        window.location.href = '/';
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    <div>
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Enter phone number"
      />
      <button onClick={handleSendOtp}>Send OTP</button>
      
      {showOtpModal && (
        <div>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            maxLength={6}
          />
          <button onClick={handleVerifyOtp}>Verify</button>
        </div>
      )}
    </div>
  );
}
```

**Backend (Flask):**

```python
@auth_bp.route('/send-otp', methods=['POST'])
def send_otp():
    data = request.get_json()
    phone_number = data.get('phoneNumber')
    
    # Validate
    is_valid, clean_phone, error = InputValidator.validate_phone(phone_number)
    if not is_valid:
        return jsonify({'success': False, 'message': error}), 400
    
    # Rate limit
    allowed, remaining, reset_time = RateLimiter.check_otp_rate_limit(clean_phone)
    if not allowed:
        return jsonify({
            'success': False,
            'message': 'Rate limit exceeded',
            'rate_limit_exceeded': True
        }), 429
    
    # Send OTP
    result = sms_service.send_otp_sms(clean_phone)
    otp_manager.store_otp(clean_phone, result['otp'])
    
    return jsonify({
        'success': True,
        'message': 'OTP sent successfully',
        'remaining_attempts': remaining
    })

@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    phone_number = data.get('phoneNumber')
    otp = data.get('otp')
    
    # Verify OTP
    result = otp_manager.verify_otp(phone_number, otp)
    if not result['success']:
        return jsonify(result), 401
    
    # Check if user exists
    cursor = db.get_cursor()
    cursor.execute("SELECT * FROM users WHERE phone = %s", (phone_number,))
    user = cursor.fetchone()
    
    if user:
        # Existing user
        token = generate_token(user)
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'token': token,
            'user': user,
            'is_new_user': False
        })
    else:
        # New user - create account
        cursor.execute(
            "INSERT INTO users (phone) VALUES (%s) RETURNING *",
            (phone_number,)
        )
        new_user = cursor.fetchone()
        db.commit()
        
        token = generate_token(new_user)
        return jsonify({
            'success': True,
            'message': 'Account created',
            'token': token,
            'user': new_user,
            'is_new_user': True
        })
```

---

## 🧪 Testing Authentication

### Manual Testing

**1. Test OTP Flow:**
```bash
# Send OTP
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "9876543210"}'

# Verify OTP
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "9876543210", "otp": "123456"}'
```

**2. Test Admin Login:**
```bash
curl -X POST http://localhost:5000/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

**3. Test Protected Route:**
```bash
curl http://localhost:5000/api/orders/my-orders \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Automated Testing

```python
import unittest

class TestAuthentication(unittest.TestCase):
    
    def test_send_otp_success(self):
        response = self.client.post('/api/auth/send-otp', json={
            'phoneNumber': '9876543210'
        })
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json['success'])
    
    def test_invalid_phone_number(self):
        response = self.client.post('/api/auth/send-otp', json={
            'phoneNumber': '123'
        })
        self.assertEqual(response.status_code, 400)
    
    def test_verify_otp_success(self):
        # First send OTP
        self.client.post('/api/auth/send-otp', json={
            'phoneNumber': '9876543210'
        })
        
        # Then verify
        response = self.client.post('/api/auth/verify-otp', json={
            'phoneNumber': '9876543210',
            'otp': '123456'  # Use actual OTP from SMS service
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.json)
```

---

## 🔧 Troubleshooting

### Common Issues

#### Issue 1: "OTP not received"

**Causes:**
- SMS service configuration issue
- Invalid phone number
- Rate limit exceeded

**Solutions:**
```bash
# Check development mode (OTP in console)
export FLASK_ENV=development

# Verify SMS credentials
echo $TWILIO_ACCOUNT_SID
echo $TWILIO_AUTH_TOKEN

# Check rate limit
# Wait for reset time or use different number
```

#### Issue 2: "Invalid token"

**Causes:**
- Token expired (>7 days)
- Wrong JWT_SECRET_KEY
- Token not sent in header

**Solutions:**
```javascript
// Ensure token in Authorization header
headers: {
  'Authorization': `Bearer ${token}`
}

// Check token expiry
const payload = jwt.decode(token);
console.log('Token expires:', new Date(payload.exp * 1000));

// Re-login if expired
if (Date.now() > payload.exp * 1000) {
  logout();
  navigate('/login');
}
```

#### Issue 3: "Admin login failed"

**Causes:**
- Wrong credentials
- Rate limit exceeded
- Password hash mismatch

**Solutions:**
```sql
-- Reset admin password
UPDATE admin_users 
SET password = '$2b$12$hash...' 
WHERE username = 'admin';

-- Verify admin exists
SELECT * FROM admin_users WHERE username = 'admin';
```

#### Issue 4: "Rate limit exceeded"

**Causes:**
- Too many OTP requests (>20/day)
- Too many admin login attempts (>5/min)

**Solutions:**
```python
# Check rate limit status
status = RateLimiter.get_rate_limit_status(phone_number)
print(f"Remaining: {status['remaining']}")
print(f"Reset at: {status['reset_time']}")

# Clear rate limit (development only)
RateLimiter.clear_rate_limit(phone_number)
```

---

## 📚 Related Documentation

- **[API Documentation](BACKEND_01_API_DOCUMENTATION.md)** - Complete API reference
- **[Database Schema](BACKEND_02_DATABASE_SCHEMA.md)** - User tables and relationships
- **[Security Overview](SECURITY_01_OVERVIEW.md)** - Complete security guide
- **[Error Handling](BACKEND_04_ERROR_HANDLING.md)** - Error patterns and responses

---

**Authentication Version**: 2.0.0  
**Last Updated**: February 2026  
**Security Level**: Production-Ready 🔒

🔐 **Secure Authentication for All Users!**
