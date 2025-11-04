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

# Secret key for JWT - should be in environment variable
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRY_HOURS = 24 * 7  # 7 days

def generate_token(user_data):
    """Generate JWT token for authenticated user"""
    # Check if user is admin based on 'role' field or 'is_admin' field
    is_admin = user_data.get('is_admin', False) or user_data.get('role') == 'admin'
    
    payload = {
        'user_id': user_data.get('id'),
        'phone': user_data.get('phone'),
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
            
            # Pass current user to the route
            return f(dict(current_user), *args, **kwargs)
            
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
        
        # Check if user is admin
        if not result['data'].get('is_admin', False):
            return jsonify({
                'success': False,
                'error': 'Admin access required'
            }), 403
        
        try:
            user_query = "SELECT * FROM users WHERE id = %s AND role = 'admin' AND status = 'active'"
            admin_user = db.execute_query_one(user_query, (result['data']['user_id'],))
            
            if not admin_user:
                print(f"❌ Admin user not found for ID: {result['data']['user_id']}")
                return jsonify({
                    'success': False,
                    'error': 'Admin user not found'
                }), 403
            
            return f(dict(admin_user), *args, **kwargs)
            
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
