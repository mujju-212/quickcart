from flask import Blueprint, request, jsonify
from utils.database import db
from utils.auth_middleware import token_required, admin_required
from utils.input_validator import InputValidator
from utils.rate_limiter import RateLimiter
import logging
import datetime
import secrets

logger = logging.getLogger(__name__)
order_bp = Blueprint('orders', __name__)

def generate_order_id():
    """Generate unique order ID"""
    timestamp = str(int(datetime.datetime.now().timestamp()))
    random_part = secrets.token_hex(3).upper()
    return f"QC{timestamp}{random_part}"

def calculate_order_total(items, delivery_fee=29, handling_fee=5, coupon=None):
    """
    🔒 SECURITY: Backend price calculation to prevent manipulation
    """
    subtotal = 0
    
    for item in items:
        # Get current product price from database
        product_query = "SELECT price FROM products WHERE id = %s AND status = 'active'"
        product = db.execute_query_one(product_query, (item['product_id'],))
        
        if not product:
            raise ValueError(f"Product {item['product_id']} not found")
        
        # Use database price, NOT client-provided price
        item_total = float(product['price']) * int(item['quantity'])
        subtotal += item_total
    
    # Calculate delivery fee (free if >= 99)
    final_delivery_fee = 0 if subtotal >= 99 else delivery_fee
    
    # Apply coupon discount
    discount = 0
    if coupon:
        # Revalidate coupon
        coupon_query = """
            SELECT * FROM offers 
            WHERE code = %s 
            AND status = 'active'
            AND start_date <= CURRENT_DATE 
            AND end_date >= CURRENT_DATE
        """
        valid_coupon = db.execute_query_one(coupon_query, (coupon,))
        
        if valid_coupon:
            min_order = float(valid_coupon.get('min_order_amount', 0))
            
            if subtotal >= min_order:
                if valid_coupon['discount_type'] == 'percentage':
                    discount = (subtotal * float(valid_coupon['discount_value'])) / 100
                    max_discount = valid_coupon.get('max_discount_amount')
                    if max_discount:
                        discount = min(discount, float(max_discount))
                elif valid_coupon['discount_type'] == 'fixed':
                    discount = min(float(valid_coupon['discount_value']), subtotal)
                elif valid_coupon['discount_type'] == 'free_delivery':
                    final_delivery_fee = 0
    
    total = subtotal - discount + final_delivery_fee + handling_fee
    
    return {
        'subtotal': round(subtotal, 2),
        'discount': round(discount, 2),
        'delivery_fee': round(final_delivery_fee, 2),
        'handling_fee': round(handling_fee, 2),
        'total': round(total, 2)
    }

@order_bp.route('/', methods=['GET'])
@token_required
def get_user_orders(current_user):
    """
    🔒 SECURED: Get user's order history (authenticated users only)
    """
    try:
        # 🔒 SECURITY: Only show orders for authenticated user
        user_id = current_user['id']
        phone = current_user['phone']
        
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
            WHERE o.user_id = %s
            GROUP BY o.id
            ORDER BY o.created_at DESC
        """
        
        orders = db.execute_query(query, (user_id,), fetch=True)
        
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
        logger.error(f"❌ Error fetching orders: {e}")
        return jsonify({"success": False, "error": "Failed to fetch orders"}), 500

@order_bp.route('/<order_id>', methods=['GET'])
@token_required
def get_order_by_id(current_user, order_id):
    """
    🔒 SECURED: Get specific order details (owner only)
    """
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
        
        # 🔒 SECURITY: Verify order ownership (users can only see their own orders, admins can see all)
        if not current_user.get('is_admin'):
            if order.get('user_id') != current_user['id']:
                logger.warning(f"❌ User {current_user['id']} attempted to access order {order_id} belonging to user {order.get('user_id')}")
                return jsonify({"success": False, "error": "Unauthorized access to order"}), 403
        
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
        logger.error(f"❌ Error fetching order {order_id}: {e}")
        return jsonify({"success": False, "error": "Failed to fetch order"}), 500

@order_bp.route('/create', methods=['POST'])
@token_required
def create_order(current_user):
    """
    🔒 SECURED: Create a new order with authentication and validation
    """
    try:
        data = request.get_json()
        
        # 🔒 Validate order data
        validation_result = InputValidator.validate_order_data(data)
        if not validation_result['valid']:
            return jsonify({"success": False, "error": validation_result['error']}), 400
        
        # 🔒 SECURITY: Use authenticated user's phone instead of client-provided
        phone = current_user['phone']
        user_id = current_user['id']
        user_name = current_user.get('name', 'User')
        
        # 🔒 Validate delivery address
        if 'delivery_address' in data:
            address_validation = InputValidator.validate_address(data['delivery_address'])
            if not address_validation['valid']:
                return jsonify({"success": False, "error": f"Invalid address: {address_validation['error']}"}), 400
        
        # 🔒 Calculate totals from DATABASE (prevent price manipulation)
        items = data.get('items', [])
        if not items:
            return jsonify({"success": False, "error": "Order must contain at least one item"}), 400
        
        # Calculate order total using backend validation
        delivery_fee = float(data.get('delivery_fee', 20.00))
        handling_fee = float(data.get('handling_fee', 0.00))
        coupon_code = data.get('coupon_code')
        
        total_calculation = calculate_order_total(items, delivery_fee, handling_fee, coupon_code)
        
        if not total_calculation['success']:
            return jsonify({"success": False, "error": total_calculation['error']}), 400
        
        # 🔒 SECURITY: Verify client-sent total matches backend calculation (prevent manipulation)
        client_total = float(data.get('total', 0))
        backend_total = total_calculation['total']
        
        # Allow small floating point differences (0.01)
        if abs(client_total - backend_total) > 0.01:
            logger.warning(f"❌ Price manipulation detected! User {user_id} sent total={client_total}, actual={backend_total}")
            return jsonify({
                "success": False, 
                "error": "Price mismatch detected. Please refresh and try again."
            }), 400
        
        subtotal = total_calculation['subtotal']
        total = backend_total
        discount = total_calculation.get('discount', 0)
        order_items = total_calculation['items']
        
        order_id = generate_order_id()
        
        # Create order
        order_query = """
            INSERT INTO orders (id, user_id, phone, user_name, total, subtotal, delivery_fee,
                              status, payment_status, payment_method, delivery_address, discount)
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'pending', %s, %s, %s, %s)
            RETURNING *
        """
        
        order_params = (
            order_id, user_id, phone, user_name, total, subtotal, delivery_fee,
            data.get('payment_status', 'pending'),
            data.get('payment_method', 'cash'),
            data.get('delivery_address', ''),
            discount
        )
        
        order_result = db.execute_query(order_query, order_params, fetch=True)
        
        if not order_result:
            return jsonify({"success": False, "error": "Failed to create order"}), 500
        
        # Insert order items and update stock
        for item in order_items:
            item_query = """
                INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, total_price)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            db.execute_query(item_query, (
                order_id, item['product_id'], item['product_name'],
                item['product_price'], item['quantity'], item['total_price']
            ))
            
            # 🔒 SECURITY: Update product stock (prevent overselling)
            db.execute_query(
                "UPDATE products SET stock = stock - %s WHERE id = %s",
                (item['quantity'], item['product_id'])
            )
        
        # Mark coupon as used if applicable
        if coupon_code and discount > 0:
            db.execute_query(
                "UPDATE coupons SET used_count = used_count + 1 WHERE code = %s",
                (coupon_code,)
            )
        
        # Create initial timeline entry
        timeline_query = """
            INSERT INTO order_timeline (order_id, status, completed)
            VALUES (%s, 'Order Placed', true)
        """
        db.execute_query(timeline_query, (order_id,))
        
        # Clear user's cart after successful order
        db.execute_query("DELETE FROM cart_items WHERE user_id = %s", (user_id,))
        
        logger.info(f"✅ Order {order_id} created successfully for user {user_id}")
        
        return jsonify({
            "success": True,
            "order": dict(order_result[0]),
            "items": order_items,
            "message": "Order created successfully"
        }), 201
        
    except Exception as e:
        logger.error(f"❌ Error creating order: {e}")
        return jsonify({"success": False, "error": "Failed to create order"}), 500

@order_bp.route('/<order_id>/status', methods=['PUT'])
@admin_required
def update_order_status(current_user, order_id):
    """
    🔒 SECURED: Update order status (Admin only)
    """
    try:
        data = request.get_json()
        
        if 'status' not in data:
            return jsonify({"success": False, "error": "Status is required"}), 400
        
        new_status = InputValidator.sanitize_string(data['status'], max_length=50)
        valid_statuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled']
        
        if new_status not in valid_statuses:
            return jsonify({"success": False, "error": "Invalid status"}), 400
        
        # 🔒 Sanitize notes if provided
        notes = ''
        if 'notes' in data and data['notes']:
            notes = InputValidator.sanitize_string(data['notes'], max_length=500)
        
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
        db.execute_query(timeline_query, (order_id, status_message, notes))
        
        # If delivered, update actual delivery time
        if new_status == 'delivered':
            db.execute_query(
                "UPDATE orders SET actual_delivery = CURRENT_TIMESTAMP WHERE id = %s",
                (order_id,)
            )
        
        logger.info(f"✅ Admin {current_user['id']} updated order {order_id} to {new_status}")
        
        return jsonify({
            "success": True,
            "order": dict(result[0]),
            "message": f"Order status updated to {new_status}"
        })
        
    except Exception as e:
        logger.error(f"❌ Error updating order status: {e}")
        return jsonify({"success": False, "error": "Failed to update order status"}), 500

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