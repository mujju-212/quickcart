from flask import Blueprint, request, jsonify
from services.sms_service import SMSService
from utils.otp_manager import OTPManager
from utils.rate_limiter import RateLimiter
from utils.input_validator import InputValidator
from utils.auth_middleware import generate_token
from utils.database import db
import os

# Create blueprint for authentication routes
auth_bp = Blueprint('auth', __name__)

# Initialize services
sms_service = SMSService()
otp_manager = OTPManager()

# Environment check
IS_DEVELOPMENT = os.environ.get('FLASK_ENV') == 'development'

@auth_bp.route('/send-otp', methods=['POST'])
def send_otp():
    """Send OTP to phone number with rate limiting"""
    try:
        data = request.get_json()
        phone_number = data.get('phoneNumber')
        
        if not phone_number:
            return jsonify({
                'success': False,
                'message': 'Phone number is required'
            }), 400
        
        # Validate phone number
        is_valid, clean_phone, error = InputValidator.validate_phone(phone_number)
        if not is_valid:
            return jsonify({
                'success': False,
                'message': error
            }), 400
        
        phone_number = clean_phone
        
        # 🔒 SECURITY: Check OTP rate limit (20 per day)
        allowed, remaining, reset_time = RateLimiter.check_otp_rate_limit(phone_number, max_requests=20)
        
        if not allowed:
            return jsonify({
                'success': False,
                'message': f'Daily OTP limit exceeded. Try again after {reset_time.strftime("%I:%M %p")}',
                'rate_limit_exceeded': True,
                'reset_time': reset_time.isoformat()
            }), 429
        
        # Send OTP via SMS
        result = sms_service.send_otp_sms(phone_number)
        
        # Store OTP for verification
        otp_manager.store_otp(phone_number, result['otp'])
        
        # Prepare response
        response_data = {
            'success': True,
            'message': result['message'],
            'provider': result['provider'],
            'remaining_attempts': remaining
        }
        
        # 🔒 SECURITY: Only expose OTP in development mode
        if result['provider'] == 'development' and IS_DEVELOPMENT:
            print(f"🔔 DEVELOPMENT MODE: OTP for {phone_number} is: {result['otp']}")
            response_data['development_mode'] = True
            response_data['otp'] = result['otp']
            response_data['message'] = f"Development Mode: OTP is {result['otp']}"
        
        return jsonify(response_data)
            
    except Exception as e:
        print(f"❌ Send OTP Error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    """Verify OTP and generate JWT token"""
    try:
        data = request.get_json()
        phone_number = data.get('phoneNumber')
        otp = data.get('otp')
        
        if not phone_number or not otp:
            return jsonify({
                'success': False,
                'message': 'Phone number and OTP are required'
            }), 400
        
        # Validate phone number
        is_valid, clean_phone, error = InputValidator.validate_phone(phone_number)
        if not is_valid:
            return jsonify({'success': False, 'message': error}), 400
        
        phone_number = clean_phone
        
        # Verify OTP
        result = otp_manager.verify_otp(phone_number, otp)
        
        if result['success']:
            # Check if user exists in database
            user_query = "SELECT * FROM users WHERE phone = %s AND status = 'active'"
            user = db.execute_query_one(user_query, (phone_number,))
            
            if user:
                # 🔒 SECURITY: Generate JWT token
                user_dict = dict(user)
                token = generate_token(user_dict)
                
                # Update login count and last login
                update_query = """
                    UPDATE users 
                    SET login_count = login_count + 1, 
                        last_login = CURRENT_TIMESTAMP 
                    WHERE phone = %s
                """
                db.execute_query(update_query, (phone_number,))
                
                # Fetch updated user data
                user = db.execute_query_one(user_query, (phone_number,))
                
                return jsonify({
                    'success': True,
                    'message': 'OTP verified successfully',
                    'user': dict(user),
                    'token': token,  # 🔒 JWT Token
                    'isNewUser': False
                })
            else:
                # New user - return success but indicate they need to complete profile
                return jsonify({
                    'success': True,
                    'message': 'OTP verified successfully',
                    'user': None,
                    'token': None,
                    'isNewUser': True,
                    'phone': phone_number
                })
        else:
            return jsonify(result), 400
            
    except Exception as e:
        print(f"❌ Verify OTP Error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@auth_bp.route('/complete-profile', methods=['POST'])
def complete_profile():
    """Complete new user profile and generate JWT token"""
    try:
        data = request.get_json()
        phone = data.get('phone')
        name = data.get('name')
        email = data.get('email', '')
        
        if not phone or not name:
            return jsonify({'success': False, 'message': 'Phone and name are required'}), 400
        
        # Validate inputs
        is_valid, clean_phone, error = InputValidator.validate_phone(phone)
        if not is_valid:
            return jsonify({'success': False, 'message': error}), 400
        
        is_valid, clean_name, error = InputValidator.validate_name(name)
        if not is_valid:
            return jsonify({'success': False, 'message': error}), 400
        
        # Validate email if provided
        clean_email = None
        if email:
            is_valid, clean_email, error = InputValidator.validate_email(email)
            if not is_valid:
                return jsonify({'success': False, 'message': error}), 400
        
        # Create user
        insert_query = """
            INSERT INTO users (phone, name, email, status)
            VALUES (%s, %s, %s, 'active')
            RETURNING *
        """
        user = db.execute_query_one(insert_query, (clean_phone, clean_name, clean_email))
        
        if user:
            # 🔒 SECURITY: Generate JWT token
            user_dict = dict(user)
            token = generate_token(user_dict)
            
            return jsonify({
                'success': True,
                'message': 'Profile created successfully',
                'user': user_dict,
                'token': token  # 🔒 JWT Token
            })
        else:
            return jsonify({'success': False, 'message': 'Failed to create user profile'}), 500
            
    except Exception as e:
        print(f"❌ Complete Profile Error: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

@auth_bp.route('/admin-login', methods=['POST'])
def admin_login():
    """Admin login with username/password and JWT token"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'success': False, 'message': 'Username and password are required'}), 400
        
        # Sanitize username
        username = InputValidator.sanitize_string(username, 50)
        
        # 🔒 SECURITY: Hardcoded admin for demo (in production, use database)
        if username == 'admin' and password == 'admin123':
            admin_data = {
                'id': 1,
                'name': 'Admin',
                'phone': 'admin',
                'email': 'admin@quickcart.com',
                'is_admin': True,
                'status': 'active'
            }
            
            # Generate JWT token with admin flag
            token = generate_token(admin_data)
            
            return jsonify({
                'success': True,
                'message': 'Admin login successful',
                'user': admin_data,
                'token': token
            })
        
        # Check database for admin users (if phone number is provided)
        admin_query = """
            SELECT * FROM users 
            WHERE phone = %s 
            AND is_admin = true 
            AND status = 'active'
        """
        admin = db.execute_query_one(admin_query, (username,))
        
        # Database admin check
        if admin and password == 'admin123':  # TODO: Use bcrypt in production
            # 🔒 SECURITY: Generate JWT token with admin flag
            admin_dict = dict(admin)
            token = generate_token(admin_dict)
            
            return jsonify({
                'success': True,
                'message': 'Admin login successful',
                'user': admin_dict,
                'token': token  # 🔒 JWT Token with is_admin=true
            })
        
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
            
    except Exception as e:
        print(f"❌ Admin Login Error: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

@auth_bp.route('/otp-status/<phone_number>', methods=['GET'])
def get_otp_status(phone_number):
    """Get OTP status for a phone number"""
    try:
        status = otp_manager.get_otp_status(phone_number)
        return jsonify({
            'success': True,
            'data': status
        })
    except Exception as e:
        print(f"OTP Status Error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500