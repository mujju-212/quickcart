"""
Analytics Routes for Admin Dashboard
Provides real-time statistics and insights from the database
"""
from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
from utils.database import db
from utils.auth_middleware import admin_required

analytics_bp = Blueprint('analytics', __name__)  # Removed url_prefix (set in app.py)

@analytics_bp.route('/dashboard-stats', methods=['GET'])
@admin_required
def get_dashboard_stats(admin_user):
    """
    Get comprehensive dashboard statistics including:
    - Total orders, revenue, users, products
    - Recent orders
    - Sales trends
    - Top products
    """
    try:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            
            # 1. Total Orders
            cursor.execute('SELECT COUNT(*) as count FROM orders')
            total_orders = cursor.fetchone()['count']
            
            # 2. Total Revenue (fixed: total_amount -> total)
            cursor.execute('SELECT COALESCE(SUM(total), 0) as revenue FROM orders WHERE status != \'cancelled\'')
            total_revenue = float(cursor.fetchone()['revenue'])
            
            # 3. Total Users (fixed: role 'user' -> 'customer')
            cursor.execute('SELECT COUNT(*) as count FROM users WHERE role = \'customer\'')
            total_users = cursor.fetchone()['count']
            
            # 4. Total Products
            cursor.execute('SELECT COUNT(*) as count FROM products')
            total_products = cursor.fetchone()['count']
            
            # 5. Orders by Status
            cursor.execute('''
                SELECT status, COUNT(*) as count 
                FROM orders 
                GROUP BY status
            ''')
            orders_by_status = {row['status']: row['count'] for row in cursor.fetchall()}
            
            # 6. Recent Orders (last 10) - Fixed column names
            cursor.execute('''
                SELECT 
                    o.id,
                    o.total,
                    o.status,
                    o.created_at,
                    o.user_name as customer_name,
                    o.phone as customer_phone
                FROM orders o
                ORDER BY o.created_at DESC
                LIMIT 10
            ''')
            recent_orders = []
            for row in cursor.fetchall():
                recent_orders.append({
                    'id': row['id'],
                    'orderNumber': row['id'],  # Using order ID as order number
                    'customerName': row['customer_name'] or 'Guest',
                    'customerPhone': row['customer_phone'],
                    'amount': float(row['total']),
                    'status': row['status'],
                    'date': row['created_at'].isoformat() if row['created_at'] else None
                })
        
            # 7. Top Selling Products (by order frequency) - Fixed column name
            cursor.execute('''
                SELECT 
                    p.id,
                    p.name,
                    p.price,
                    p.image_url,
                    COUNT(oi.id) as order_count,
                    SUM(oi.quantity) as total_sold,
                    SUM(oi.total_price) as revenue
                FROM products p
                LEFT JOIN order_items oi ON p.id = oi.product_id
                GROUP BY p.id, p.name, p.price, p.image_url
                ORDER BY order_count DESC, total_sold DESC
                LIMIT 5
            ''')
            top_products = []
            for row in cursor.fetchall():
                top_products.append({
                    'id': row['id'],
                    'name': row['name'],
                    'price': float(row['price']),
                    'imageUrl': row['image_url'],
                    'orderCount': row['order_count'] or 0,
                    'totalSold': row['total_sold'] or 0,
                    'revenue': float(row['revenue'] or 0)
                })
            
            # 8. Sales by Category - Fixed to prevent duplicates and filter cancelled orders
            cursor.execute('''
                SELECT 
                    c.name as category_name,
                    COUNT(DISTINCT oi.order_id) as order_count,
                    SUM(oi.quantity) as items_sold,
                    SUM(oi.total_price) as revenue
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                JOIN categories c ON p.category_id = c.id
                JOIN orders o ON oi.order_id = o.id
                WHERE o.status != 'cancelled'
                GROUP BY c.id, c.name
                ORDER BY revenue DESC
            ''')
            category_sales = []
            for row in cursor.fetchall():
                category_sales.append({
                    'category': row['category_name'],
                    'orderCount': row['order_count'] or 0,
                    'itemsSold': row['items_sold'] or 0,
                    'revenue': float(row['revenue'] or 0)
                })
            
            # 9. Revenue Trend (last 7 days) - Fixed column name
            cursor.execute('''
                SELECT 
                    DATE(created_at) as date,
                    COUNT(*) as order_count,
                    SUM(total) as revenue
                FROM orders
                WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
                AND status != 'cancelled'
                GROUP BY DATE(created_at)
                ORDER BY date
            ''')
            revenue_trend = []
            for row in cursor.fetchall():
                revenue_trend.append({
                    'date': str(row['date']),
                    'orderCount': row['order_count'],
                    'revenue': float(row['revenue'] or 0)
                })
            
            # 10. Today's Stats - Fixed column name
            cursor.execute('''
                SELECT 
                    COUNT(*) as orders_today,
                    COALESCE(SUM(total), 0) as revenue_today
                FROM orders
                WHERE DATE(created_at) = CURRENT_DATE
                ''')
            today_stats = cursor.fetchone()
            
            # 11. This Month's Stats - Fixed column name and SQL syntax
            cursor.execute('''
                SELECT 
                    COUNT(*) as orders_this_month,
                    COALESCE(SUM(total), 0) as revenue_this_month
                FROM orders
                WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
                AND status != 'cancelled'
            ''')
            month_stats = cursor.fetchone()
            
            # 12. Last Month's Stats (for growth calculation) - Fixed
            cursor.execute('''
                SELECT 
                    COUNT(*) as orders_last_month,
                    COALESCE(SUM(total), 0) as revenue_last_month
                FROM orders
                WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
                AND status != 'cancelled'
            ''')
            last_month_stats = cursor.fetchone()
        
        # Calculate growth percentages
        orders_growth = 0
        revenue_growth = 0
        
        if last_month_stats['orders_last_month'] > 0:
            orders_growth = ((month_stats['orders_this_month'] - last_month_stats['orders_last_month']) 
                           / last_month_stats['orders_last_month'] * 100)
        
        if last_month_stats['revenue_last_month'] > 0:
            revenue_growth = ((float(month_stats['revenue_this_month']) - float(last_month_stats['revenue_last_month'])) 
                            / float(last_month_stats['revenue_last_month']) * 100)
        
        return jsonify({
            'success': True,
            'data': {
                'totals': {
                    'totalOrders': total_orders,
                    'totalRevenue': total_revenue,
                    'totalUsers': total_users,
                    'totalProducts': total_products
                },
                'ordersByStatus': orders_by_status,
                'recentOrders': recent_orders,
                'topProducts': top_products,
                'categorySales': category_sales,
                'revenueTrend': revenue_trend,
                'today': {
                    'orders': today_stats['orders_today'],
                    'revenue': float(today_stats['revenue_today'])
                },
                'thisMonth': {
                    'orders': month_stats['orders_this_month'],
                    'revenue': float(month_stats['revenue_this_month']),
                    'ordersGrowth': round(orders_growth, 1),
                    'revenueGrowth': round(revenue_growth, 1)
                }
            }
        }), 200
        
    except Exception as e:
        print(f"Error fetching dashboard stats: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Failed to fetch dashboard statistics: {str(e)}'
        }), 500


@analytics_bp.route('/revenue-chart', methods=['GET'])
@admin_required
def get_revenue_chart_data(admin_user):
    """
    Get revenue chart data for specified period
    Query params: period (7d, 30d, 90d, 1y)
    """
    try:
        period = request.args.get('period', '7d')
        
        # Map period to days
        period_map = {
            '7d': 7,
            '30d': 30,
            '90d': 90,
            '1y': 365
        }
        days = period_map.get(period, 7)
        
        with db.get_connection() as conn:
            cursor = conn.cursor()
            
            # For 7 days, show daily data
            if period == '7d':
                cursor.execute(f'''
                    SELECT 
                        DATE(created_at) as date,
                        COUNT(*) as order_count,
                        SUM(total) as revenue
                    FROM orders
                    WHERE created_at >= CURRENT_DATE - INTERVAL '{days} days'
                    AND status != 'cancelled'
                    GROUP BY DATE(created_at)
                    ORDER BY date
                ''')
                
                chart_data = []
                for row in cursor.fetchall():
                    chart_data.append({
                        'date': str(row['date']),
                        'orderCount': row['order_count'],
                        'revenue': float(row['revenue'] or 0)
                    })
            
            # For 30 days, group into 5-day ranges (6 groups)
            elif period == '30d':
                cursor.execute(f'''
                    SELECT 
                        FLOOR((CURRENT_DATE - DATE(created_at)) / 5) as range_group,
                        MIN(DATE(created_at)) as start_date,
                        MAX(DATE(created_at)) as end_date,
                        COUNT(*) as order_count,
                        SUM(total) as revenue
                    FROM orders
                    WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
                    AND status != 'cancelled'
                    GROUP BY range_group
                    ORDER BY range_group DESC
                ''')
                
                chart_data = []
                for row in cursor.fetchall():
                    # Format date range label
                    start = row['start_date']
                    end = row['end_date']
                    date_label = f"{start.strftime('%d %b')}-{end.strftime('%d %b')}" if start != end else start.strftime('%d %b')
                    
                    chart_data.append({
                        'date': date_label,
                        'orderCount': row['order_count'],
                        'revenue': float(row['revenue'] or 0)
                    })
            
            # For 90 days, group into 10-day ranges (9 groups)
            elif period == '90d':
                cursor.execute(f'''
                    SELECT 
                        FLOOR((CURRENT_DATE - DATE(created_at)) / 10) as range_group,
                        MIN(DATE(created_at)) as start_date,
                        MAX(DATE(created_at)) as end_date,
                        COUNT(*) as order_count,
                        SUM(total) as revenue
                    FROM orders
                    WHERE created_at >= CURRENT_DATE - INTERVAL '90 days'
                    AND status != 'cancelled'
                    GROUP BY range_group
                    ORDER BY range_group DESC
                ''')
                
                chart_data = []
                for row in cursor.fetchall():
                    start = row['start_date']
                    end = row['end_date']
                    date_label = f"{start.strftime('%d %b')}-{end.strftime('%d %b')}" if start != end else start.strftime('%d %b')
                    
                    chart_data.append({
                        'date': date_label,
                        'orderCount': row['order_count'],
                        'revenue': float(row['revenue'] or 0)
                    })
            
            # For 1 year, group by month
            else:
                cursor.execute(f'''
                    SELECT 
                        TO_CHAR(DATE(created_at), 'Mon YYYY') as month_label,
                        DATE_TRUNC('month', created_at) as month_date,
                        COUNT(*) as order_count,
                        SUM(total) as revenue
                    FROM orders
                    WHERE created_at >= CURRENT_DATE - INTERVAL '365 days'
                    AND status != 'cancelled'
                    GROUP BY month_label, month_date
                    ORDER BY month_date
                ''')
                
                chart_data = []
                for row in cursor.fetchall():
                    chart_data.append({
                        'date': row['month_label'],
                        'orderCount': row['order_count'],
                        'revenue': float(row['revenue'] or 0)
                    })
        
        return jsonify({
            'success': True,
            'data': chart_data
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to fetch revenue chart data: {str(e)}'
        }), 500


@analytics_bp.route('/product-performance', methods=['GET'])
@admin_required
def get_product_performance(admin_user):
    """Get detailed product performance metrics"""
    try:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            
            # Fixed: oi.price -> oi.product_price, use total_price
            cursor.execute('''
                SELECT 
                    p.id,
                    p.name,
                    p.price,
                    p.stock,
                    p.image_url,
                    c.name as category_name,
                    COUNT(DISTINCT oi.order_id) as times_ordered,
                    SUM(oi.quantity) as units_sold,
                    SUM(oi.total_price) as total_revenue,
                    AVG(oi.product_price) as avg_selling_price
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN order_items oi ON p.id = oi.product_id
                GROUP BY p.id, p.name, p.price, p.stock, p.image_url, c.name
                ORDER BY total_revenue DESC NULLS LAST
            ''')
            
            products = []
            for row in cursor.fetchall():
                products.append({
                    'id': row['id'],
                    'name': row['name'],
                    'price': float(row['price']),
                    'stock': row['stock'],
                    'imageUrl': row['image_url'],
                    'category': row['category_name'],
                    'timesOrdered': row['times_ordered'] or 0,
                    'unitsSold': row['units_sold'] or 0,
                    'totalRevenue': float(row['total_revenue'] or 0),
                    'avgSellingPrice': float(row['avg_selling_price'] or 0)
                })
        
        return jsonify({
            'success': True,
            'data': products
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to fetch product performance: {str(e)}'
        }), 500


@analytics_bp.route('/category-performance', methods=['GET'])
@admin_required
def get_category_performance(admin_user):
    """Get category-wise performance metrics"""
    try:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT 
                    c.id,
                    c.name,
                    c.image_url,
                    COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'active') as product_count,
                    COUNT(DISTINCT oi.order_id) as order_count,
                    SUM(oi.quantity) as units_sold,
                    SUM(oi.total_price) as revenue
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                JOIN categories c ON p.category_id = c.id
                JOIN orders o ON oi.order_id = o.id
                WHERE o.status != 'cancelled'
                GROUP BY c.id, c.name, c.image_url
                ORDER BY revenue DESC
            ''')
            
            categories = []
            for row in cursor.fetchall():
                categories.append({
                    'id': row['id'],
                    'name': row['name'],
                    'imageUrl': row['image_url'],
                    'productCount': row['product_count'] or 0,
                    'orderCount': row['order_count'] or 0,
                    'unitsSold': row['units_sold'] or 0,
                    'revenue': float(row['revenue'] or 0)
                })
        
        return jsonify({
            'success': True,
            'data': categories
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to fetch category performance: {str(e)}'
        }), 500

@analytics_bp.route('/performance-metrics', methods=['GET'])
@admin_required
def get_performance_metrics(admin_user):
    """Get real-time performance metrics"""
    try:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            
            # Today's orders count
            cursor.execute('''
                SELECT COUNT(*) as today_orders
                FROM orders
                WHERE DATE(created_at) = CURRENT_DATE
                AND status != 'cancelled'
            ''')
            today_orders = cursor.fetchone()['today_orders'] or 0
            
            # Yesterday's orders count for comparison
            cursor.execute('''
                SELECT COUNT(*) as yesterday_orders
                FROM orders
                WHERE DATE(created_at) = CURRENT_DATE - INTERVAL '1 day'
                AND status != 'cancelled'
            ''')
            yesterday_orders = cursor.fetchone()['yesterday_orders'] or 0
            orders_change = calculate_percentage_change(yesterday_orders, today_orders)
            
            # Average order value (last 30 days)
            cursor.execute('''
                SELECT AVG(total) as avg_order_value
                FROM orders
                WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
                AND status != 'cancelled'
            ''')
            avg_order_value = float(cursor.fetchone()['avg_order_value'] or 0)
            
            # Previous 30 days average for comparison
            cursor.execute('''
                SELECT AVG(total) as prev_avg
                FROM orders
                WHERE created_at >= CURRENT_DATE - INTERVAL '60 days'
                AND created_at < CURRENT_DATE - INTERVAL '30 days'
                AND status != 'cancelled'
            ''')
            prev_avg = float(cursor.fetchone()['prev_avg'] or 0)
            avg_change = calculate_percentage_change(prev_avg, avg_order_value)
            
            # Average delivery time (completed orders in last 7 days)
            # Using actual_delivery and created_at to calculate delivery time
            cursor.execute('''
                SELECT AVG(
                    EXTRACT(EPOCH FROM (
                        actual_delivery::timestamp - created_at::timestamp
                    )) / 60
                ) as avg_delivery_mins
                FROM orders
                WHERE status = 'delivered'
                AND created_at >= CURRENT_DATE - INTERVAL '7 days'
                AND actual_delivery IS NOT NULL
            ''')
            avg_delivery_time = cursor.fetchone()['avg_delivery_mins']
            avg_delivery_mins = int(avg_delivery_time) if avg_delivery_time else 0
            
            # Active users (users with orders in last 30 days)
            cursor.execute('''
                SELECT COUNT(DISTINCT user_id) as active_users
                FROM orders
                WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
                AND user_id IS NOT NULL
            ''')
            active_users = cursor.fetchone()['active_users'] or 0
            
            # Previous period active users
            cursor.execute('''
                SELECT COUNT(DISTINCT user_id) as prev_active
                FROM orders
                WHERE created_at >= CURRENT_DATE - INTERVAL '60 days'
                AND created_at < CURRENT_DATE - INTERVAL '30 days'
                AND user_id IS NOT NULL
            ''')
            prev_active = cursor.fetchone()['prev_active'] or 0
            active_change = calculate_percentage_change(prev_active, active_users)
            
            # Return rate (cancelled orders percentage)
            cursor.execute('''
                SELECT 
                    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
                    COUNT(*) as total
                FROM orders
                WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
            ''')
            row = cursor.fetchone()
            return_rate = (row['cancelled'] / row['total'] * 100) if row['total'] > 0 else 0
            
            metrics = {
                'todayOrders': {
                    'value': today_orders,
                    'change': orders_change,
                    'trend': 'up' if orders_change >= 0 else 'down'
                },
                'avgOrderValue': {
                    'value': round(avg_order_value, 2),
                    'change': avg_change,
                    'trend': 'up' if avg_change >= 0 else 'down'
                },
                'avgDeliveryTime': {
                    'value': avg_delivery_mins,
                    'change': 0,  # Can be calculated if historical data is stored
                    'trend': 'neutral'
                },
                'activeUsers': {
                    'value': active_users,
                    'change': active_change,
                    'trend': 'up' if active_change >= 0 else 'down'
                },
                'returnRate': {
                    'value': round(return_rate, 1),
                    'change': 0,  # Can be calculated if historical data is stored
                    'trend': 'neutral'
                }
            }
        
        return jsonify({
            'success': True,
            'data': metrics
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to fetch performance metrics: {str(e)}'
        }), 500

def calculate_percentage_change(old_value, new_value):
    """Calculate percentage change between two values"""
    if old_value == 0:
        return 100 if new_value > 0 else 0
    return round(((new_value - old_value) / old_value) * 100, 1)

@analytics_bp.route('/users', methods=['GET'])
@admin_required
def get_all_users(admin_user):
    """Get all users with their order statistics"""
    try:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            
            # Get all users with their order statistics (including admins)
            cursor.execute("""
                SELECT 
                    u.id,
                    u.name,
                    u.phone,
                    u.email,
                    u.role,
                    u.status,
                    u.created_at,
                    u.last_login,
                    COUNT(DISTINCT o.id) as total_orders,
                    COUNT(DISTINCT CASE WHEN o.status != 'cancelled' THEN o.id END) as completed_orders,
                    COALESCE(SUM(CASE WHEN o.status != 'cancelled' THEN o.total ELSE 0 END), 0) as total_spent,
                    MAX(o.created_at) as last_order_date
                FROM users u
                LEFT JOIN orders o ON u.id = o.user_id
                GROUP BY u.id, u.name, u.phone, u.email, u.role, u.status, u.created_at, u.last_login
                ORDER BY u.created_at DESC
            """)
            
            users = []
            for row in cursor.fetchall():
                users.append({
                    'id': row['id'],
                    'name': row['name'],
                    'phone': row['phone'],
                    'email': row['email'],
                    'role': row['role'],
                    'status': row['status'],
                    'totalOrders': row['total_orders'],  # All orders including cancelled
                    'orderCount': row['completed_orders'],  # Non-cancelled orders only
                    'totalSpent': float(row['total_spent'] or 0),
                    'joinedAt': str(row['created_at']),
                    'lastLogin': str(row['last_login']) if row['last_login'] else None,
                    'lastOrderDate': str(row['last_order_date']) if row['last_order_date'] else None
                })
        
        return jsonify({
            'success': True,
            'data': users
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to fetch users: {str(e)}'
        }), 500
