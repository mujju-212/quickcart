"""
Authentication Middleware for QuickCart
Implements JWT token-based authentication and authorization
"""
from functools import wraps
from flask import request, jsonify
import jwt
import os
from datetime import datetime, timedelta
from utils.database import db

# 🔒 SECURITY: Enforce JWT secret key (no default in production)
SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
if not SECRET_KEY:
    # Only use default in development mode
    if os.environ.get('FLASK_ENV') == 'development':
        SECRET_KEY = 'dev-secret-key-change-in-production'
        print("⚠️  WARNING: Using default JWT secret in development mode")
    else:
        raise ValueError("🔒 SECURITY ERROR: JWT_SECRET_KEY environment variable must be set in production!")

JWT_ALGORITHM = 'HS256'
JWT_EXPIRY_HOURS = 24 * 7  # 7 days

def generate_token(user_data):
    """Generate JWT token for authenticated user"""
    # Check if user is admin based on 'role' field or 'is_admin' field
    is_admin = user_data.get('is_admin', False) or user_data.get('role') == 'admin'
    
    payload = {
        'user_id': user_data.get('id'),
        'phone': user_data.get('phone'),
        'name': user_data.get('name', 'User'),  # Include name in token
        'is_admin': is_admin,
        'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRY_HOURS),
        'iat': datetime.utcnow()
    }
    
    token = jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)
    return token

def verify_token(token):
    """Verify and decode JWT token"""
    try:
        # Remove 'Bearer ' prefix if present
        if token.startswith('Bearer '):
            token = token[7:]
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return {'success': True, 'data': payload}
    except jwt.ExpiredSignatureError:
        return {'success': False, 'error': 'Token has expired'}
    except jwt.InvalidTokenError:
        return {'success': False, 'error': 'Invalid token'}

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
        
        # Get current user from database
        try:
            user_query = "SELECT * FROM users WHERE id = %s AND status = 'active'"
            current_user = db.execute_query_one(user_query, (result['data']['user_id'],))
            
            if not current_user:
                return jsonify({
                    'success': False,
                    'error': 'User not found or inactive'
                }), 401
            
            # Convert to dict and add is_admin flag based on role
            user_dict = dict(current_user)
            user_dict['is_admin'] = user_dict.get('role') == 'admin'
            
            # Pass current user to the route
            return f(user_dict, *args, **kwargs)
            
        except Exception as e:
            return jsonify({
                'success': False,
                'error': 'Authentication failed'
            }), 401
    
    return decorated

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
                'error': 'Authentication token is missing'
            }), 401
        
        result = verify_token(token)
        
        if not result['success']:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 401
        
        # Check admin status - either from token or database
        try:
            user_id = result['data']['user_id']
            print(f"🔍 Checking admin access for user_id: {user_id}")
            
            # First check token
            is_admin_from_token = result['data'].get('is_admin', False)
            print(f"🔍 is_admin from token: {is_admin_from_token}")
            
            # 🔒 SECURITY: For hardcoded admin (user_id=1), trust the token if is_admin=True
            # This allows admin login even if database is not fully set up
            if user_id == 1 and is_admin_from_token:
                print(f"✅ Hardcoded admin (user_id=1) with valid token - access granted")
                # Create a mock admin user object
                admin_user = {
                    'id': 1,
                    'name': 'Admin',
                    'phone': 'admin',
                    'email': 'admin@quickcart.com',
                    'role': 'admin',
                    'is_admin': True,
                    'status': 'active'
                }
                return f(admin_user, *args, **kwargs)
            
            # Verify from database for other users
            user_check_query = "SELECT id, name, role, status FROM users WHERE id = %s"
            user_result = db.execute_query(user_check_query, (user_id,), fetch=True)
            
            print(f"🔍 Database query result: {user_result}")
            
            if not user_result or len(user_result) == 0:
                print(f"❌ User not found in database")
                return jsonify({
                    'success': False,
                    'error': 'User not found'
                }), 403
            
            user_data = user_result[0]
            
            if user_data.get('status') != 'active':
                print(f"❌ User is not active: {user_data.get('status')}")
                return jsonify({
                    'success': False,
                    'error': 'User account is not active'
                }), 403
            
            if user_data.get('role') != 'admin':
                print(f"❌ User is not admin. Role: {user_data.get('role')}")
                return jsonify({
                    'success': False,
                    'error': 'Admin access required'
                }), 403
            
            print(f"✅ Admin access granted for: {user_data.get('name')}")
            return f(user_data, *args, **kwargs)
            
        except Exception as e:
            print(f"❌ Authorization failed: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({
                'success': False,
                'error': 'Authorization failed'
            }), 403
    
    return decorated

def optional_auth(f):
    """Decorator for routes that work with or without authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        current_user = None
        
        if 'Authorization' in request.headers:
            token = request.headers['Authorization']
            result = verify_token(token)
            
            if result['success']:
                try:
                    user_query = "SELECT * FROM users WHERE id = %s AND status = 'active'"
                    current_user = db.execute_query_one(user_query, (result['data']['user_id'],))
                    current_user = dict(current_user) if current_user else None
                except:
                    current_user = None
        
        return f(current_user, *args, **kwargs)
    
    return decorated
