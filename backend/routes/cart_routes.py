from flask import Blueprint, request, jsonify
from utils.database import db
import logging

logger = logging.getLogger(__name__)
cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/', methods=['GET'])
def get_user_cart():
    """Get user's cart items"""
    try:
        phone = request.args.get('phone')
        if not phone:
            return jsonify({"success": False, "error": "Phone number required"}), 400
        
        # Get user ID
        user_query = "SELECT id FROM users WHERE phone = %s"
        user = db.execute_query_one(user_query, (phone,))
        
        if not user:
            return jsonify({"success": True, "cart": []})
        
        query = """
            SELECT c.*, p.name, p.price, p.original_price, p.size, 
                   p.image_url, p.stock, p.category_name
            FROM cart_items c
            JOIN products p ON c.product_id = p.id
            WHERE (c.user_id = %s OR c.phone = %s) AND p.status = 'active'
            ORDER BY c.created_at DESC
        """
        
        cart_items = db.execute_query(query, (user['id'], phone), fetch=True)
        
        # Calculate totals
        subtotal = sum(item['price'] * item['quantity'] for item in cart_items)
        delivery_fee = 20.00 if cart_items else 0
        total = subtotal + delivery_fee
        
        return jsonify({
            "success": True,
            "cart": [dict(item) for item in cart_items],
            "summary": {
                "subtotal": float(subtotal),
                "delivery_fee": float(delivery_fee),
                "total": float(total),
                "items_count": len(cart_items)
            }
        })
        
    except Exception as e:
        logger.error(f"Error fetching cart: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@cart_bp.route('/add', methods=['POST'])
def add_to_cart():
    """Add item to cart"""
    try:
        data = request.get_json()
        
        required_fields = ['phone', 'product_id', 'quantity']
        if not all(field in data for field in required_fields):
            return jsonify({"success": False, "error": "Phone, product_id, and quantity are required"}), 400
        
        if data['quantity'] <= 0:
            return jsonify({"success": False, "error": "Quantity must be positive"}), 400
        
        # Get user ID
        user_query = "SELECT id FROM users WHERE phone = %s"
        user = db.execute_query_one(user_query, (data['phone'],))
        user_id = user['id'] if user else None
        
        # Check if product exists and is available
        product_query = "SELECT stock FROM products WHERE id = %s AND status = 'active'"
        product = db.execute_query_one(product_query, (data['product_id'],))
        
        if not product:
            return jsonify({"success": False, "error": "Product not found or unavailable"}), 404
        
        if product['stock'] < data['quantity']:
            return jsonify({"success": False, "error": f"Only {product['stock']} items available"}), 400
        
        # Check if item already in cart
        existing_item_query = """
            SELECT id, quantity FROM cart_items 
            WHERE product_id = %s AND (user_id = %s OR phone = %s)
        """
        existing_item = db.execute_query_one(existing_item_query, (data['product_id'], user_id, data['phone']))
        
        if existing_item:
            # Update existing item
            new_quantity = existing_item['quantity'] + data['quantity']
            if new_quantity > product['stock']:
                return jsonify({"success": False, "error": f"Total quantity exceeds stock ({product['stock']} available)"}), 400
            
            update_query = """
                UPDATE cart_items 
                SET quantity = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING *
            """
            result = db.execute_query(update_query, (new_quantity, existing_item['id']), fetch=True)
        else:
            # Add new item
            insert_query = """
                INSERT INTO cart_items (user_id, phone, product_id, quantity)
                VALUES (%s, %s, %s, %s)
                RETURNING *
            """
            result = db.execute_query(insert_query, (user_id, data['phone'], data['product_id'], data['quantity']), fetch=True)
        
        if result:
            return jsonify({
                "success": True,
                "cart_item": dict(result[0]),
                "message": "Item added to cart successfully"
            })
        
        return jsonify({"success": False, "error": "Failed to add item to cart"}), 500
        
    except Exception as e:
        logger.error(f"Error adding to cart: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@cart_bp.route('/update', methods=['PUT'])
def update_cart_item():
    """Update cart item quantity"""
    try:
        data = request.get_json()
        
        required_fields = ['phone', 'product_id', 'quantity']
        if not all(field in data for field in required_fields):
            return jsonify({"success": False, "error": "Phone, product_id, and quantity are required"}), 400
        
        if data['quantity'] < 0:
            return jsonify({"success": False, "error": "Quantity cannot be negative"}), 400
        
        # Get user ID
        user_query = "SELECT id FROM users WHERE phone = %s"
        user = db.execute_query_one(user_query, (data['phone'],))
        user_id = user['id'] if user else None
        
        if data['quantity'] == 0:
            # Remove item from cart
            delete_query = """
                DELETE FROM cart_items 
                WHERE product_id = %s AND (user_id = %s OR phone = %s)
                RETURNING *
            """
            result = db.execute_query(delete_query, (data['product_id'], user_id, data['phone']), fetch=True)
            
            if result:
                return jsonify({
                    "success": True,
                    "message": "Item removed from cart"
                })
        else:
            # Check stock availability
            product_query = "SELECT stock FROM products WHERE id = %s AND status = 'active'"
            product = db.execute_query_one(product_query, (data['product_id'],))
            
            if not product:
                return jsonify({"success": False, "error": "Product not found"}), 404
            
            if product['stock'] < data['quantity']:
                return jsonify({"success": False, "error": f"Only {product['stock']} items available"}), 400
            
            # Update quantity
            update_query = """
                UPDATE cart_items 
                SET quantity = %s, updated_at = CURRENT_TIMESTAMP
                WHERE product_id = %s AND (user_id = %s OR phone = %s)
                RETURNING *
            """
            result = db.execute_query(update_query, (data['quantity'], data['product_id'], user_id, data['phone']), fetch=True)
            
            if result:
                return jsonify({
                    "success": True,
                    "cart_item": dict(result[0]),
                    "message": "Cart updated successfully"
                })
        
        return jsonify({"success": False, "error": "Cart item not found"}), 404
        
    except Exception as e:
        logger.error(f"Error updating cart: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@cart_bp.route('/remove', methods=['DELETE'])
def remove_from_cart():
    """Remove item from cart"""
    try:
        data = request.get_json()
        
        required_fields = ['phone', 'product_id']
        if not all(field in data for field in required_fields):
            return jsonify({"success": False, "error": "Phone and product_id are required"}), 400
        
        # Get user ID
        user_query = "SELECT id FROM users WHERE phone = %s"
        user = db.execute_query_one(user_query, (data['phone'],))
        user_id = user['id'] if user else None
        
        query = """
            DELETE FROM cart_items 
            WHERE product_id = %s AND (user_id = %s OR phone = %s)
            RETURNING *
        """
        result = db.execute_query(query, (data['product_id'], user_id, data['phone']), fetch=True)
        
        if result:
            return jsonify({
                "success": True,
                "message": "Item removed from cart successfully"
            })
        
        return jsonify({"success": False, "error": "Cart item not found"}), 404
        
    except Exception as e:
        logger.error(f"Error removing from cart: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@cart_bp.route('/clear', methods=['DELETE'])
def clear_cart():
    """Clear all items from cart"""
    try:
        phone = request.args.get('phone')
        if not phone:
            return jsonify({"success": False, "error": "Phone number required"}), 400
        
        # Get user ID
        user_query = "SELECT id FROM users WHERE phone = %s"
        user = db.execute_query_one(user_query, (phone,))
        user_id = user['id'] if user else None
        
        query = "DELETE FROM cart_items WHERE user_id = %s OR phone = %s"
        db.execute_query(query, (user_id, phone))
        
        return jsonify({
            "success": True,
            "message": "Cart cleared successfully"
        })
        
    except Exception as e:
        logger.error(f"Error clearing cart: {e}")
        return jsonify({"success": False, "error": str(e)}), 500