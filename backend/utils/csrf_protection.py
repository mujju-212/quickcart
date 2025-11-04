"""
CSRF Protection Utility
Provides CSRF token generation and validation for state-changing operations
"""
import secrets
import hmac
import hashlib
import time
from functools import wraps
from flask import request, jsonify
import os

class CSRFProtection:
    """CSRF token generation and validation"""
    
    # Secret key for CSRF token signing (should match JWT secret)
    CSRF_SECRET = None
    
    @classmethod
    def initialize(cls):
        """Initialize CSRF secret key"""
        cls.CSRF_SECRET = os.environ.get('JWT_SECRET_KEY')
        if not cls.CSRF_SECRET:
            flask_env = os.environ.get('FLASK_ENV', 'production')
            if flask_env == 'development':
                cls.CSRF_SECRET = 'dev-csrf-secret-key'
                print("⚠️  WARNING: Using default CSRF secret in development mode")
            else:
                raise ValueError("JWT_SECRET_KEY environment variable must be set for CSRF protection!")
    
    @classmethod
    def generate_token(cls, session_identifier):
        """
        Generate a CSRF token for a specific session
        
        Args:
            session_identifier: Unique identifier for the session (e.g., user_id)
            
        Returns:
            str: CSRF token
        """
        if not cls.CSRF_SECRET:
            cls.initialize()
        
        # Generate timestamp (valid for 1 hour)
        timestamp = str(int(time.time()))
        
        # Create token data
        token_data = f"{session_identifier}:{timestamp}"
        
        # Sign the token
        signature = hmac.new(
            cls.CSRF_SECRET.encode(),
            token_data.encode(),
            hashlib.sha256
        ).hexdigest()
        
        # Combine token data and signature
        token = f"{token_data}:{signature}"
        
        return token
    
    @classmethod
    def validate_token(cls, token, session_identifier, max_age=3600):
        """
        Validate a CSRF token
        
        Args:
            token: CSRF token to validate
            session_identifier: Expected session identifier
            max_age: Maximum age of token in seconds (default 1 hour)
            
        Returns:
            bool: True if valid, False otherwise
        """
        if not cls.CSRF_SECRET:
            cls.initialize()
        
        try:
            # Parse token
            parts = token.split(':')
            if len(parts) != 3:
                return False
            
            token_session_id, token_timestamp, token_signature = parts
            
            # Verify session identifier matches
            if token_session_id != str(session_identifier):
                return False
            
            # Verify timestamp is not expired
            current_time = int(time.time())
            token_time = int(token_timestamp)
            
            if current_time - token_time > max_age:
                return False
            
            # Verify signature
            token_data = f"{token_session_id}:{token_timestamp}"
            expected_signature = hmac.new(
                cls.CSRF_SECRET.encode(),
                token_data.encode(),
                hashlib.sha256
            ).hexdigest()
            
            # Use constant-time comparison to prevent timing attacks
            return hmac.compare_digest(token_signature, expected_signature)
            
        except Exception as e:
            print(f"CSRF validation error: {str(e)}")
            return False
    
    @classmethod
    def get_session_identifier(cls, request_obj):
        """
        Extract session identifier from request
        
        Args:
            request_obj: Flask request object
            
        Returns:
            str: Session identifier (user_id from JWT or IP address)
        """
        # Try to get user_id from JWT token (set by auth middleware)
        user_id = getattr(request_obj, 'user_id', None)
        
        if user_id:
            return str(user_id)
        
        # Fallback to IP address for non-authenticated requests
        return request_obj.remote_addr or 'unknown'


def csrf_protect(f):
    """
    Decorator to protect routes with CSRF validation
    
    Usage:
        @app.route('/api/admin/products', methods=['POST'])
        @admin_required
        @csrf_protect
        def create_product():
            # ... route logic
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Skip CSRF check for GET, HEAD, OPTIONS (safe methods)
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return f(*args, **kwargs)
        
        # Get CSRF token from header
        csrf_token = request.headers.get('X-CSRF-Token')
        
        if not csrf_token:
            return jsonify({
                'success': False,
                'error': 'CSRF token missing',
                'message': 'CSRF token required for this operation'
            }), 403
        
        # Get session identifier
        session_identifier = CSRFProtection.get_session_identifier(request)
        
        # Validate token
        if not CSRFProtection.validate_token(csrf_token, session_identifier):
            return jsonify({
                'success': False,
                'error': 'CSRF token invalid',
                'message': 'Invalid or expired CSRF token'
            }), 403
        
        # Token is valid, proceed with request
        return f(*args, **kwargs)
    
    return decorated_function


# Initialize CSRF protection on module load
try:
    CSRFProtection.initialize()
except Exception as e:
    print(f"⚠️  CSRF Protection initialization warning: {str(e)}")
