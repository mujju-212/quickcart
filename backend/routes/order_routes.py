from flask import Blueprint, request, jsonify
from utils.database import db
import logging
import datetime
import secrets

logger = logging.getLogger(__name__)
order_bp = Blueprint('orders', __name__)

def generate_order_id():
    """Generate unique order ID"""
    timestamp = str(int(datetime.datetime.now().timestamp()))
    random_part = secrets.token_hex(3).upper()
    return f"BLK{timestamp}{random_part}"

@order_bp.route('/', methods=['GET'])
def get_user_orders():
    """Get user's order history"""
    try:
        phone = request.args.get('phone')
        if not phone:
            return jsonify({"success": False, "error": "Phone number required"}), 400
        
        # Get user ID
        user_query = "SELECT id FROM users WHERE phone = %s"
        user = db.execute_query_one(user_query, (phone,))
        
        query = """
            SELECT o.*, 
                   COUNT(oi.id) as items_count,
                   JSON_AGG(
                       JSON_BUILD_OBJECT(
                           'product_name', oi.product_name,
                           'quantity', oi.quantity,
                           'price', oi.product_price
                       )
                   ) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            WHERE o.phone = %s OR (o.user_id = %s)
            GROUP BY o.id
            ORDER BY o.created_at DESC
        """
        
        user_id = user['id'] if user else None
        orders = db.execute_query(query, (phone, user_id), fetch=True)
        
        # Get timeline for each order
        for order in orders:
            timeline_query = """
                SELECT status, timestamp, completed, notes 
                FROM order_timeline 
                WHERE order_id = %s 
                ORDER BY timestamp ASC
            """
            timeline = db.execute_query(timeline_query, (order['id'],), fetch=True)
            order['timeline'] = [dict(t) for t in timeline] if timeline else []
        
        return jsonify({
            "success": True,
            "orders": [dict(order) for order in orders],
            "count": len(orders)
        })
        
    except Exception as e:
        logger.error(f"Error fetching orders: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@order_bp.route('/<order_id>', methods=['GET'])
def get_order_by_id(order_id):
    """Get specific order details"""
    try:
        query = """
            SELECT o.*, 
                   JSON_AGG(
                       JSON_BUILD_OBJECT(
                           'id', oi.id,
                           'product_id', oi.product_id,
                           'product_name', oi.product_name,
                           'product_price', oi.product_price,
                           'quantity', oi.quantity,
                           'total_price', oi.total_price
                       )
                   ) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            WHERE o.id = %s
            GROUP BY o.id
        """
        
        order = db.execute_query_one(query, (order_id,))
        
        if not order:
            return jsonify({"success": False, "error": "Order not found"}), 404
        
        # Get timeline
        timeline_query = """
            SELECT status, timestamp, completed, notes 
            FROM order_timeline 
            WHERE order_id = %s 
            ORDER BY timestamp ASC
        """
        timeline = db.execute_query(timeline_query, (order_id,), fetch=True)
        order_dict = dict(order)
        order_dict['timeline'] = [dict(t) for t in timeline] if timeline else []
        
        return jsonify({
            "success": True,
            "order": order_dict
        })
        
    except Exception as e:
        logger.error(f"Error fetching order {order_id}: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@order_bp.route('/create', methods=['POST'])
def create_order():
    """Create a new order"""
    try:
        data = request.get_json()
        
        required_fields = ['phone', 'items', 'delivery_address']
        if not all(field in data for field in required_fields):
            return jsonify({"success": False, "error": "Phone, items, and delivery_address are required"}), 400
        
        if not data['items']:
            return jsonify({"success": False, "error": "Order must contain at least one item"}), 400
        
        # Get user details
        user_query = "SELECT id, name FROM users WHERE phone = %s"
        user = db.execute_query_one(user_query, (data['phone'],))
        user_id = user['id'] if user else None
        user_name = user['name'] if user else 'Guest'
        
        # Calculate totals
        subtotal = 0
        order_items = []
        
        for item in data['items']:
            if not all(k in item for k in ['product_id', 'quantity']):
                return jsonify({"success": False, "error": "Each item must have product_id and quantity"}), 400
            
            # Get product details
            product_query = "SELECT name, price, stock FROM products WHERE id = %s AND status = 'active'"
            product = db.execute_query_one(product_query, (item['product_id'],))
            
            if not product:
                return jsonify({"success": False, "error": f"Product {item['product_id']} not found"}), 404
            
            if product['stock'] < item['quantity']:
                return jsonify({"success": False, "error": f"Insufficient stock for {product['name']}"}), 400
            
            item_total = float(product['price']) * item['quantity']
            subtotal += item_total
            
            order_items.append({
                'product_id': item['product_id'],
                'product_name': product['name'],
                'product_price': float(product['price']),
                'quantity': item['quantity'],
                'total_price': item_total
            })
        
        delivery_fee = data.get('delivery_fee', 20.00)
        total = subtotal + delivery_fee
        order_id = generate_order_id()
        
        # Create order
        order_query = """
            INSERT INTO orders (id, user_id, phone, user_name, total, subtotal, delivery_fee,
                              status, payment_status, payment_method, delivery_address)
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'pending', %s, %s, %s)
            RETURNING *
        """
        
        order_params = (
            order_id, user_id, data['phone'], user_name, total, subtotal, delivery_fee,
            data.get('payment_status', 'completed'),
            data.get('payment_method', 'cash'),
            data['delivery_address']
        )
        
        order_result = db.execute_query(order_query, order_params, fetch=True)
        
        if not order_result:
            return jsonify({"success": False, "error": "Failed to create order"}), 500
        
        # Insert order items
        for item in order_items:
            item_query = """
                INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, total_price)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            db.execute_query(item_query, (
                order_id, item['product_id'], item['product_name'],
                item['product_price'], item['quantity'], item['total_price']
            ))
            
            # Update product stock
            db.execute_query(
                "UPDATE products SET stock = stock - %s WHERE id = %s",
                (item['quantity'], item['product_id'])
            )
        
        # Create initial timeline entry
        timeline_query = """
            INSERT INTO order_timeline (order_id, status, completed)
            VALUES (%s, 'Order Placed', true)
        """
        db.execute_query(timeline_query, (order_id,))
        
        # Clear user's cart after successful order
        if user_id:
            db.execute_query("DELETE FROM cart_items WHERE user_id = %s OR phone = %s", (user_id, data['phone']))
        
        return jsonify({
            "success": True,
            "order": dict(order_result[0]),
            "items": order_items,
            "message": "Order created successfully"
        }), 201
        
    except Exception as e:
        logger.error(f"Error creating order: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@order_bp.route('/<order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    """Update order status (Admin only)"""
    try:
        data = request.get_json()
        
        if 'status' not in data:
            return jsonify({"success": False, "error": "Status is required"}), 400
        
        new_status = data['status']
        valid_statuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled']
        
        if new_status not in valid_statuses:
            return jsonify({"success": False, "error": "Invalid status"}), 400
        
        # Update order status
        update_query = """
            UPDATE orders 
            SET status = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING *
        """
        
        result = db.execute_query(update_query, (new_status, order_id), fetch=True)
        
        if not result:
            return jsonify({"success": False, "error": "Order not found"}), 404
        
        # Add timeline entry
        timeline_query = """
            INSERT INTO order_timeline (order_id, status, completed, notes)
            VALUES (%s, %s, true, %s)
        """
        
        status_messages = {
            'confirmed': 'Order Confirmed',
            'preparing': 'Preparing',
            'out_for_delivery': 'Out for Delivery',
            'delivered': 'Delivered',
            'cancelled': 'Cancelled'
        }
        
        status_message = status_messages.get(new_status, new_status.title())
        db.execute_query(timeline_query, (order_id, status_message, data.get('notes', '')))
        
        # If delivered, update actual delivery time
        if new_status == 'delivered':
            db.execute_query(
                "UPDATE orders SET actual_delivery = CURRENT_TIMESTAMP WHERE id = %s",
                (order_id,)
            )
        
        return jsonify({
            "success": True,
            "order": dict(result[0]),
            "message": f"Order status updated to {new_status}"
        })
        
    except Exception as e:
        logger.error(f"Error updating order status: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@order_bp.route('/stats', methods=['GET'])
def get_order_stats():
    """Get order statistics (Admin only)"""
    try:
        stats_query = """
            SELECT 
                COUNT(*) as total_orders,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
                COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
                COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
                COALESCE(SUM(CASE WHEN status = 'delivered' THEN total ELSE 0 END), 0) as total_revenue,
                COALESCE(AVG(CASE WHEN status = 'delivered' THEN total ELSE NULL END), 0) as avg_order_value
            FROM orders
        """
        
        stats = db.execute_query_one(stats_query)
        
        return jsonify({
            "success": True,
            "stats": dict(stats)
        })
        
    except Exception as e:
        logger.error(f"Error fetching order stats: {e}")
        return jsonify({"success": False, "error": str(e)}), 500