from flask import Blueprint, request, jsonify
from utils.database import db
import logging

logger = logging.getLogger(__name__)
wishlist_bp = Blueprint('wishlist', __name__)

@wishlist_bp.route('/', methods=['GET'])
def get_user_wishlist():
    """Get user's wishlist items"""
    try:
        phone = request.args.get('phone')
        if not phone:
            return jsonify({"success": False, "error": "Phone number required"}), 400
        
        # Get user ID
        user_query = "SELECT id FROM users WHERE phone = %s"
        user = db.execute_query_one(user_query, (phone,))
        
        if not user:
            return jsonify({"success": True, "wishlist": []})
        
        query = """
            SELECT w.*, p.name, p.price, p.original_price, p.size, 
                   p.image_url, p.stock, p.category_name, p.description
            FROM wishlist_items w
            JOIN products p ON w.product_id = p.id
            WHERE (w.user_id = %s OR w.phone = %s) AND p.status = 'active'
            ORDER BY w.created_at DESC
        """
        
        wishlist_items = db.execute_query(query, (user['id'], phone), fetch=True)
        
        return jsonify({
            "success": True,
            "wishlist": [dict(item) for item in wishlist_items],
            "count": len(wishlist_items)
        })
        
    except Exception as e:
        logger.error(f"Error fetching wishlist: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@wishlist_bp.route('/add', methods=['POST'])
def add_to_wishlist():
    """Add item to wishlist"""
    try:
        data = request.get_json()
        
        required_fields = ['phone', 'product_id']
        if not all(field in data for field in required_fields):
            return jsonify({"success": False, "error": "Phone and product_id are required"}), 400
        
        # Get user ID
        user_query = "SELECT id FROM users WHERE phone = %s"
        user = db.execute_query_one(user_query, (data['phone'],))
        user_id = user['id'] if user else None
        
        # Check if product exists and is available
        product_query = "SELECT id, name FROM products WHERE id = %s AND status = 'active'"
        product = db.execute_query_one(product_query, (data['product_id'],))
        
        if not product:
            return jsonify({"success": False, "error": "Product not found or unavailable"}), 404
        
        # Check if item already in wishlist
        existing_item_query = """
            SELECT id FROM wishlist_items 
            WHERE product_id = %s AND (user_id = %s OR phone = %s)
        """
        existing_item = db.execute_query_one(existing_item_query, (data['product_id'], user_id, data['phone']))
        
        if existing_item:
            return jsonify({
                "success": True,
                "message": "Product already in wishlist",
                "already_exists": True
            })
        
        # Add to wishlist
        insert_query = """
            INSERT INTO wishlist_items (user_id, phone, product_id)
            VALUES (%s, %s, %s)
            RETURNING id
        """
        
        result = db.execute_query(insert_query, (user_id, data['phone'], data['product_id']), fetch=True)
        
        if result:
            return jsonify({
                "success": True,
                "message": f"{product['name']} added to wishlist",
                "wishlist_item_id": result[0]['id']
            })
        else:
            return jsonify({"success": False, "error": "Failed to add to wishlist"}), 500
            
    except Exception as e:
        logger.error(f"Error adding to wishlist: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@wishlist_bp.route('/remove', methods=['DELETE'])
def remove_from_wishlist():
    """Remove item from wishlist"""
    try:
        data = request.get_json()
        
        required_fields = ['phone', 'product_id']
        if not all(field in data for field in required_fields):
            return jsonify({"success": False, "error": "Phone and product_id are required"}), 400
        
        # Get user ID
        user_query = "SELECT id FROM users WHERE phone = %s"
        user = db.execute_query_one(user_query, (data['phone'],))
        user_id = user['id'] if user else None
        
        # Delete from wishlist
        delete_query = """
            DELETE FROM wishlist_items 
            WHERE product_id = %s AND (user_id = %s OR phone = %s)
            RETURNING id
        """
        
        result = db.execute_query(delete_query, (data['product_id'], user_id, data['phone']), fetch=True)
        
        if result:
            return jsonify({
                "success": True,
                "message": "Product removed from wishlist"
            })
        else:
            return jsonify({"success": False, "error": "Product not found in wishlist"}), 404
            
    except Exception as e:
        logger.error(f"Error removing from wishlist: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@wishlist_bp.route('/clear', methods=['DELETE'])
def clear_wishlist():
    """Clear all items from user's wishlist"""
    try:
        data = request.get_json()
        phone = data.get('phone')
        
        if not phone:
            return jsonify({"success": False, "error": "Phone number required"}), 400
        
        # Get user ID
        user_query = "SELECT id FROM users WHERE phone = %s"
        user = db.execute_query_one(user_query, (phone,))
        user_id = user['id'] if user else None
        
        # Delete all wishlist items
        delete_query = """
            DELETE FROM wishlist_items 
            WHERE user_id = %s OR phone = %s
            RETURNING id
        """
        
        result = db.execute_query(delete_query, (user_id, phone), fetch=True)
        
        return jsonify({
            "success": True,
            "message": f"Cleared {len(result) if result else 0} items from wishlist"
        })
            
    except Exception as e:
        logger.error(f"Error clearing wishlist: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@wishlist_bp.route('/check/<int:product_id>', methods=['GET'])
def check_in_wishlist(product_id):
    """Check if a product is in user's wishlist"""
    try:
        phone = request.args.get('phone')
        if not phone:
            return jsonify({"success": False, "error": "Phone number required"}), 400
        
        # Get user ID
        user_query = "SELECT id FROM users WHERE phone = %s"
        user = db.execute_query_one(user_query, (phone,))
        user_id = user['id'] if user else None
        
        # Check if exists
        check_query = """
            SELECT id FROM wishlist_items 
            WHERE product_id = %s AND (user_id = %s OR phone = %s)
        """
        
        result = db.execute_query_one(check_query, (product_id, user_id, phone))
        
        return jsonify({
            "success": True,
            "in_wishlist": result is not None
        })
            
    except Exception as e:
        logger.error(f"Error checking wishlist: {e}")
        return jsonify({"success": False, "error": str(e)}), 500
