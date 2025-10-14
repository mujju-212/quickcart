from flask import Blueprint, request, jsonify
from utils.database import db
import logging

logger = logging.getLogger(__name__)
user_bp = Blueprint('users', __name__)

@user_bp.route('/profile', methods=['GET'])
def get_user_profile():
    """Get user profile by phone number"""
    try:
        phone = request.args.get('phone')
        if not phone:
            return jsonify({"success": False, "error": "Phone number required"}), 400
        
        query = """
            SELECT id, name, phone, email, role, status, login_count, 
                   last_login, created_at, updated_at
            FROM users 
            WHERE phone = %s AND status = 'active'
        """
        user = db.execute_query_one(query, (phone,))
        
        if not user:
            return jsonify({"success": False, "error": "User not found"}), 404
        
        return jsonify({
            "success": True,
            "user": dict(user)
        })
        
    except Exception as e:
        logger.error(f"Error fetching user profile: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@user_bp.route('/register', methods=['POST'])
def register_user():
    """Register a new user or update existing user"""
    try:
        data = request.get_json()
        
        required_fields = ['name', 'phone']
        if not all(field in data for field in required_fields):
            return jsonify({"success": False, "error": "Name and phone are required"}), 400
        
        # Check if user already exists
        existing_user_query = "SELECT id, login_count FROM users WHERE phone = %s"
        existing_user = db.execute_query_one(existing_user_query, (data['phone'],))
        
        if existing_user:
            # Update existing user's login count and last login
            update_query = """
                UPDATE users 
                SET login_count = login_count + 1, 
                    last_login = CURRENT_TIMESTAMP,
                    updated_at = CURRENT_TIMESTAMP
                WHERE phone = %s
                RETURNING *
            """
            result = db.execute_query(update_query, (data['phone'],), fetch=True)
        else:
            # Create new user
            insert_query = """
                INSERT INTO users (name, phone, email, role, status, login_count, last_login)
                VALUES (%s, %s, %s, 'customer', 'active', 1, CURRENT_TIMESTAMP)
                RETURNING *
            """
            
            email = data.get('email', f"{data['phone']}@blinkbasket.com")
            result = db.execute_query(insert_query, (data['name'], data['phone'], email), fetch=True)
        
        if result:
            user_data = dict(result[0])
            # Remove sensitive information
            user_data.pop('updated_at', None)
            
            return jsonify({
                "success": True,
                "user": user_data,
                "message": "User registered successfully" if not existing_user else "User login updated"
            }), 201 if not existing_user else 200
        
        return jsonify({"success": False, "error": "Failed to register user"}), 500
        
    except Exception as e:
        logger.error(f"Error registering user: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@user_bp.route('/addresses', methods=['GET'])
def get_user_addresses():
    """Get user addresses by phone number"""
    try:
        phone = request.args.get('phone')
        if not phone:
            return jsonify({"success": False, "error": "Phone number required"}), 400
        
        # Get user ID first
        user_query = "SELECT id FROM users WHERE phone = %s"
        user = db.execute_query_one(user_query, (phone,))
        
        if not user:
            return jsonify({"success": False, "addresses": []})
        
        query = """
            SELECT * FROM user_addresses 
            WHERE user_id = %s OR phone = %s
            ORDER BY is_default DESC, created_at DESC
        """
        addresses = db.execute_query(query, (user['id'], phone), fetch=True)
        
        return jsonify({
            "success": True,
            "addresses": [dict(address) for address in addresses]
        })
        
    except Exception as e:
        logger.error(f"Error fetching user addresses: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@user_bp.route('/addresses', methods=['POST'])
def add_user_address():
    """Add a new address for user"""
    try:
        data = request.get_json()
        
        required_fields = ['phone', 'address_line_1', 'city', 'state', 'postal_code']
        if not all(field in data for field in required_fields):
            return jsonify({"success": False, "error": "Missing required address fields"}), 400
        
        # Get user ID
        user_query = "SELECT id FROM users WHERE phone = %s"
        user = db.execute_query_one(user_query, (data['phone'],))
        user_id = user['id'] if user else None
        
        # If this is the first address, make it default
        if user_id:
            existing_addresses_query = "SELECT COUNT(*) as count FROM user_addresses WHERE user_id = %s"
            result = db.execute_query_one(existing_addresses_query, (user_id,))
            is_default = result['count'] == 0
        else:
            is_default = True
        
        query = """
            INSERT INTO user_addresses (user_id, phone, address_line_1, address_line_2, 
                                      city, state, postal_code, country, address_type, is_default)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """
        
        params = (
            user_id,
            data['phone'],
            data['address_line_1'],
            data.get('address_line_2', ''),
            data['city'],
            data['state'],
            data['postal_code'],
            data.get('country', 'India'),
            data.get('address_type', 'home'),
            is_default
        )
        
        result = db.execute_query(query, params, fetch=True)
        
        if result:
            return jsonify({
                "success": True,
                "address": dict(result[0]),
                "message": "Address added successfully"
            }), 201
        
        return jsonify({"success": False, "error": "Failed to add address"}), 500
        
    except Exception as e:
        logger.error(f"Error adding user address: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@user_bp.route('/addresses/<int:address_id>', methods=['PUT'])
def update_user_address(address_id):
    """Update user address"""
    try:
        data = request.get_json()
        
        update_fields = []
        params = []
        
        allowed_fields = ['address_line_1', 'address_line_2', 'city', 'state', 
                         'postal_code', 'country', 'address_type', 'is_default']
        
        for field in allowed_fields:
            if field in data:
                update_fields.append(f"{field} = %s")
                params.append(data[field])
        
        if not update_fields:
            return jsonify({"success": False, "error": "No valid fields to update"}), 400
        
        params.append(address_id)
        
        query = f"""
            UPDATE user_addresses 
            SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING *
        """
        
        result = db.execute_query(query, params, fetch=True)
        
        if result:
            return jsonify({
                "success": True,
                "address": dict(result[0]),
                "message": "Address updated successfully"
            })
        
        return jsonify({"success": False, "error": "Address not found"}), 404
        
    except Exception as e:
        logger.error(f"Error updating address {address_id}: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@user_bp.route('/addresses/<int:address_id>', methods=['DELETE'])
def delete_user_address(address_id):
    """Delete user address"""
    try:
        query = "DELETE FROM user_addresses WHERE id = %s RETURNING *"
        result = db.execute_query(query, (address_id,), fetch=True)
        
        if result:
            return jsonify({
                "success": True,
                "message": "Address deleted successfully"
            })
        
        return jsonify({"success": False, "error": "Address not found"}), 404
        
    except Exception as e:
        logger.error(f"Error deleting address {address_id}: {e}")
        return jsonify({"success": False, "error": str(e)}), 500