"""
Analytics Routes - Dashboard Statistics API
Redesigned from scratch for admin dashboard
"""
from flask import Blueprint, jsonify, request
from backend.utils.database import db
from backend.utils.auth_middleware import admin_required
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

# Create blueprint WITHOUT url_prefix (will be added in app.py)
analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/dashboard-stats', methods=['GET'])
@admin_required
def get_dashboard_stats(admin_user):
    """
    Get comprehensive dashboard statistics
    Returns: orders, products, users, revenue, recent orders, top products
    """
    try:
        logger.info("📊 Dashboard stats requested by admin: %s", admin_user.get('id'))
        
        # 1. TOTAL ORDERS
        orders_query = "SELECT COUNT(*) as count FROM orders"
        total_orders = db.execute_query_one(orders_query)
        orders_count = total_orders['count'] if total_orders else 0
        
        # 2. TOTAL PRODUCTS
        products_query = "SELECT COUNT(*) as count FROM products WHERE status = 'active'"
        total_products = db.execute_query_one(products_query)
        products_count = total_products['count'] if total_products else 0
        
        # 3. TOTAL USERS (customers only)
        users_query = "SELECT COUNT(*) as count FROM users WHERE role = 'customer'"
        total_users = db.execute_query_one(users_query)
        users_count = total_users['count'] if total_users else 0
        
        # 4. TOTAL REVENUE (sum of all order totals)
        revenue_query = "SELECT COALESCE(SUM(total), 0) as revenue FROM orders"
        total_revenue = db.execute_query_one(revenue_query)
        revenue = float(total_revenue['revenue']) if total_revenue else 0.0
        
        # 5. ORDERS BY STATUS
        status_query = """
            SELECT 
                status,
                COUNT(*) as count
            FROM orders
            GROUP BY status
        """
        orders_by_status = db.execute_query(status_query)
        status_breakdown = {row['status']: row['count'] for row in orders_by_status} if orders_by_status else {}
        
        # 6. RECENT ORDERS (last 10)
        recent_orders_query = """
            SELECT 
                id,
                user_name,
                phone,
                total,
                status,
                created_at
            FROM orders
            ORDER BY created_at DESC
            LIMIT 10
        """
        recent_orders_data = db.execute_query(recent_orders_query)
        recent_orders = []
        if recent_orders_data:
            for order in recent_orders_data:
                recent_orders.append({
                    'id': order['id'],
                    'customer': order['user_name'],
                    'phone': order['phone'],
                    'amount': float(order['total']),
                    'status': order['status'],
                    'date': order['created_at'].strftime('%Y-%m-%d %H:%M:%S') if order['created_at'] else None
                })
        
        # 7. TOP SELLING PRODUCTS
        top_products_query = """
            SELECT 
                oi.product_name,
                SUM(oi.quantity) as total_sold,
                SUM(oi.total_price) as revenue
            FROM order_items oi
            GROUP BY oi.product_name
            ORDER BY total_sold DESC
            LIMIT 5
        """
        top_products_data = db.execute_query(top_products_query)
        top_products = []
        if top_products_data:
            for product in top_products_data:
                top_products.append({
                    'name': product['product_name'],
                    'sold': int(product['total_sold']),
                    'revenue': float(product['revenue'])
                })
        
        # 8. CATEGORY SALES
        category_sales_query = """
            SELECT 
                c.name as category,
                COUNT(DISTINCT oi.order_id) as orders,
                SUM(oi.quantity) as items_sold,
                SUM(oi.total_price) as revenue
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            JOIN categories c ON p.category_id = c.id
            GROUP BY c.name
            ORDER BY revenue DESC
        """
        category_sales_data = db.execute_query(category_sales_query)
        category_sales = []
        if category_sales_data:
            for cat in category_sales_data:
                category_sales.append({
                    'category': cat['category'],
                    'orders': int(cat['orders']),
                    'items': int(cat['items_sold']),
                    'revenue': float(cat['revenue'])
                })
        
        # 9. REVENUE TREND (last 7 days)
        revenue_trend_query = """
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as orders,
                SUM(total) as revenue
            FROM orders
            WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        """
        revenue_trend_data = db.execute_query(revenue_trend_query)
        revenue_trend = []
        if revenue_trend_data:
            for day in revenue_trend_data:
                revenue_trend.append({
                    'date': day['date'].strftime('%Y-%m-%d'),
                    'orders': int(day['orders']),
                    'revenue': float(day['revenue'])
                })
        
        # Build response
        response = {
            'success': True,
            'data': {
                'stats': {
                    'totalOrders': orders_count,
                    'totalProducts': products_count,
                    'totalUsers': users_count,
                    'totalRevenue': revenue
                },
                'ordersByStatus': status_breakdown,
                'recentOrders': recent_orders,
                'topProducts': top_products,
                'categorySales': category_sales,
                'revenueTrend': revenue_trend
            }
        }
        
        logger.info("✅ Dashboard stats fetched successfully")
        return jsonify(response), 200
        
    except Exception as e:
        logger.error("❌ Error fetching dashboard stats: %s", str(e))
        return jsonify({
            'success': False,
            'error': 'Failed to fetch dashboard statistics',
            'details': str(e)
        }), 500


@analytics_bp.route('/revenue-chart', methods=['GET'])
@admin_required
def get_revenue_chart(admin_user):
    """
    Get revenue chart data for specified period
    Query params: period (7d, 30d, 90d, 1y)
    """
    try:
        period = request.args.get('period', '30d')
        
        # Map period to days
        period_map = {
            '7d': 7,
            '30d': 30,
            '90d': 90,
            '1y': 365
        }
        days = period_map.get(period, 30)
        
        logger.info("📈 Revenue chart requested: period=%s, admin=%s", period, admin_user.get('id'))
        
        query = """
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as orders,
                SUM(total) as revenue
            FROM orders
            WHERE created_at >= CURRENT_DATE - INTERVAL '%s days'
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        """ % days
        
        data = db.execute_query(query)
        chart_data = []
        if data:
            for row in data:
                chart_data.append({
                    'date': row['date'].strftime('%Y-%m-%d'),
                    'orders': int(row['orders']),
                    'revenue': float(row['revenue'])
                })
        
        return jsonify({
            'success': True,
            'period': period,
            'data': chart_data
        }), 200
        
    except Exception as e:
        logger.error("❌ Error fetching revenue chart: %s", str(e))
        return jsonify({
            'success': False,
            'error': 'Failed to fetch revenue chart data',
            'details': str(e)
        }), 500


@analytics_bp.route('/product-performance', methods=['GET'])
@admin_required
def get_product_performance(admin_user):
    """
    Get product performance metrics
    Returns top products by sales, revenue, and low stock alerts
    """
    try:
        logger.info("📦 Product performance requested by admin: %s", admin_user.get('id'))
        
        # Top products by quantity sold
        top_by_quantity = """
            SELECT 
                oi.product_name,
                SUM(oi.quantity) as total_sold,
                SUM(oi.total_price) as revenue,
                COUNT(DISTINCT oi.order_id) as order_count
            FROM order_items oi
            GROUP BY oi.product_name
            ORDER BY total_sold DESC
            LIMIT 10
        """
        
        # Top products by revenue
        top_by_revenue = """
            SELECT 
                oi.product_name,
                SUM(oi.total_price) as revenue,
                SUM(oi.quantity) as total_sold,
                COUNT(DISTINCT oi.order_id) as order_count
            FROM order_items oi
            GROUP BY oi.product_name
            ORDER BY revenue DESC
            LIMIT 10
        """
        
        # Low stock products
        low_stock = """
            SELECT 
                id,
                name,
                stock,
                price
            FROM products
            WHERE stock < 10 AND status = 'active'
            ORDER BY stock ASC
            LIMIT 10
        """
        
        top_quantity = db.execute_query(top_by_quantity)
        top_revenue = db.execute_query(top_by_revenue)
        low_stock_items = db.execute_query(low_stock)
        
        response = {
            'success': True,
            'data': {
                'topByQuantity': [dict(row) for row in top_quantity] if top_quantity else [],
                'topByRevenue': [dict(row) for row in top_revenue] if top_revenue else [],
                'lowStock': [dict(row) for row in low_stock_items] if low_stock_items else []
            }
        }
        
        logger.info("✅ Product performance fetched successfully")
        return jsonify(response), 200
        
    except Exception as e:
        logger.error("❌ Error fetching product performance: %s", str(e))
        return jsonify({
            'success': False,
            'error': 'Failed to fetch product performance',
            'details': str(e)
        }), 500


@analytics_bp.route('/health', methods=['GET'])
def analytics_health():
    """Health check endpoint - NO authentication required"""
    return jsonify({
        'success': True,
        'service': 'analytics',
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    }), 200
