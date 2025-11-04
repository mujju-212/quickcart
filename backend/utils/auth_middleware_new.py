"""
Authentication Middleware - Redesigned
JWT token validation and admin authorization
"""
import jwt
from functools import wraps
from flask import request, jsonify
from datetime import datetime, timedelta
from backend.utils.database import db
import os
import logging

logger = logging.getLogger(__name__)

# JWT Configuration
SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRY_HOURS = 168  # 7 days

def generate_token(user_data):
    """
    Generate JWT token for user
    Args:
        user_data: dict with user info (id, phone, role, etc.)
    Returns:
        JWT token string
    """
    # Check if user is admin
    is_admin = user_data.get('is_admin', False) or user_data.get('role') == 'admin'
    
    payload = {
        'user_id': user_data.get('id'),
        'phone': user_data.get('phone'),
        'is_admin': is_admin,
        'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRY_HOURS),
        'iat': datetime.utcnow()
    }
    
    token = jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)
    logger.info("🔑 Token generated for user %s (admin=%s)", user_data.get('id'), is_admin)
    return token

def verify_token(token):
    """
    Verify JWT token
    Args:
        token: JWT token string
    Returns:
        dict with {'success': bool, 'data': payload or error message}
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        logger.info("✅ Token verified for user %s", payload.get('user_id'))
        return {'success': True, 'data': payload}
    except jwt.ExpiredSignatureError:
        logger.warning("⏰ Token expired")
        return {'success': False, 'error': 'Token has expired'}
    except jwt.InvalidTokenError as e:
        logger.warning("❌ Invalid token: %s", str(e))
        return {'success': False, 'error': 'Invalid token'}

def token_required(f):
    """
    Decorator to require valid JWT token for route
    Token can be in:
    1. Authorization header: Bearer <token>
    2. Cookie: token or auth_token
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Try to get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            logger.info("🔍 Token found in Authorization header")
        
        # Try to get token from cookies
        if not token:
            token = request.cookies.get('token') or request.cookies.get('auth_token')
            if token:
                logger.info("🔍 Token found in cookies")
        
        if not token:
            logger.warning("🚫 No token provided")
            return jsonify({
                'success': False,
                'error': 'Authentication token is missing'
            }), 401
        
        # Verify token
        result = verify_token(token)
        if not result['success']:
            logger.warning("🚫 Token verification failed: %s", result.get('error'))
            return jsonify({
                'success': False,
                'error': result.get('error', 'Invalid token')
            }), 401
        
        # Pass user data to the route
        return f(result['data'], *args, **kwargs)
    
    return decorated

def admin_required(f):
    """
    Decorator to require admin privileges
    First validates JWT token, then checks if user is admin in database
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # STEP 1: Extract token
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            logger.info("🔍 [ADMIN] Token found in Authorization header")
        
        if not token:
            token = request.cookies.get('token') or request.cookies.get('auth_token')
            if token:
                logger.info("🔍 [ADMIN] Token found in cookies")
        
        if not token:
            logger.warning("🚫 [ADMIN] No token provided")
            return jsonify({
                'success': False,
                'error': 'Authentication required - No token provided'
            }), 401
        
        # STEP 2: Verify token
        result = verify_token(token)
        if not result['success']:
            logger.warning("🚫 [ADMIN] Token verification failed: %s", result.get('error'))
            return jsonify({
                'success': False,
                'error': result.get('error', 'Invalid token')
            }), 401
        
        # STEP 3: Check if token claims admin
        if not result['data'].get('is_admin'):
            logger.warning("🚫 [ADMIN] Token does not have admin flag. User: %s", result['data'].get('user_id'))
            return jsonify({
                'success': False,
                'error': 'Admin privileges required - Token not for admin'
            }), 403
        
        # STEP 4: Verify admin in database
        user_id = result['data']['user_id']
        logger.info("🔍 [ADMIN] Verifying admin user in database: user_id=%s", user_id)
        
        try:
            # Query database for admin user - USING CORRECT COLUMN: role = 'admin'
            user_query = """
                SELECT id, name, phone, email, role, status 
                FROM users 
                WHERE id = %s AND role = 'admin' AND status = 'active'
            """
            admin_user = db.execute_query_one(user_query, (user_id,))
            
            if not admin_user:
                logger.warning("🚫 [ADMIN] User not found or not admin in database. user_id=%s", user_id)
                return jsonify({
                    'success': False,
                    'error': 'Admin user not found or inactive'
                }), 403
            
            logger.info("✅ [ADMIN] Admin verified: %s (%s)", admin_user['name'], admin_user['phone'])
            
            # Pass admin user data to the route
            return f(dict(admin_user), *args, **kwargs)
            
        except Exception as e:
            logger.error("❌ [ADMIN] Database error during admin verification: %s", str(e))
            return jsonify({
                'success': False,
                'error': 'Authorization failed - Database error',
                'details': str(e)
            }), 500
    
    return decorated

def get_current_user():
    """
    Get current user from token (helper function)
    Returns user data or None
    """
    token = None
    
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
    
    if not token:
        token = request.cookies.get('token') or request.cookies.get('auth_token')
    
    if not token:
        return None
    
    result = verify_token(token)
    if not result['success']:
        return None
    
    return result['data']
