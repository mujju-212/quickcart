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
def get_dashboard_stats():
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
            
            # 8. Sales by Category - Fixed column name
            cursor.execute('''
                SELECT 
                    c.name as category_name,
                    COUNT(DISTINCT oi.order_id) as order_count,
                    SUM(oi.quantity) as items_sold,
                    SUM(oi.total_price) as revenue
                FROM categories c
                LEFT JOIN products p ON c.id = p.category_id
                LEFT JOIN order_items oi ON p.id = oi.product_id
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
def get_revenue_chart_data():
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
            
            # Fixed: total_amount -> total, PostgreSQL date syntax
            cursor.execute('''
                SELECT 
                    DATE(created_at) as date,
                    COUNT(*) as order_count,
                    SUM(total) as revenue
                FROM orders
                WHERE created_at >= CURRENT_DATE - INTERVAL '%s days'
                AND status != 'cancelled'
                GROUP BY DATE(created_at)
                ORDER BY date
            ''' % days)
            
            chart_data = []
            for row in cursor.fetchall():
                chart_data.append({
                    'date': str(row['date']),
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
def get_product_performance():
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
