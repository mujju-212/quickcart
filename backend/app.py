from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
import time
import sys
import threading
from datetime import date

# Add parent directory to Python path so we can import backend modules
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

from backend.config.config import Config
from backend.routes.auth_routes import auth_bp
from backend.routes.product_routes import product_bp
from backend.routes.category_routes import category_bp
from backend.routes.user_routes import user_bp
from backend.routes.cart_routes import cart_bp
from backend.routes.order_routes import order_bp
from backend.routes.wishlist_routes import wishlist_bp
from backend.routes.banner_routes import banner_bp
from backend.routes.offer_routes import offer_bp
from backend.routes.analytics_routes import analytics_bp
from backend.routes.review_routes import review_bp
from backend.routes.report_routes import report_bp
from backend.utils.database import db
from backend.utils.response_cache import response_cache

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def create_app():
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(Config)
    
    # Disable automatic trailing slash redirect
    app.url_map.strict_slashes = False
    
    # Enable CORS for all routes with more permissive settings
    # Allow all origins for tunnel access (use regex pattern for loca.lt domains)
    CORS(app, 
         resources={r"/*": {"origins": "*"}},
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         allow_headers=["Content-Type", "Authorization"],
         supports_credentials=True)
    
    # Test database connection on startup
    with app.app_context():
        if db.test_connection():
            logging.info("✅ Database connection successful")
        else:
            logging.error("❌ Database connection failed")

    def prime_read_cache():
        """Warm the most requested home-page payloads after startup."""
        try:
            categories_query = """
                SELECT c.*, COUNT(p.id) as products_count
                FROM categories c
                LEFT JOIN products p ON c.id = p.category_id
                    AND p.status = 'active'
                    AND p.stock > 0
                WHERE c.status = 'active'
                GROUP BY c.id
                ORDER BY c.position, c.id
            """
            categories = db.execute_query(categories_query, fetch=True)
            categories_payload = {
                "success": True,
                "categories": [dict(cat) for cat in categories if cat['products_count'] > 0],
                "count": len([cat for cat in categories if cat['products_count'] > 0]),
            }
            response_cache.set("categories:active:v1", categories_payload, ttl_seconds=45)

            products_query = """
                SELECT p.*, c.name as category_name
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.status = 'active' AND p.stock > 0
                ORDER BY p.id
            """
            products = db.execute_query(products_query, fetch=True)
            products_payload = {
                "success": True,
                "products": [dict(product) for product in products],
                "count": len(products),
            }
            response_cache.set(
                "products:list:v2:category=:search=:limit=:include_oos=False",
                products_payload,
                ttl_seconds=30,
            )

            banners_query = """
                SELECT * FROM banners
                WHERE status = 'active'
                AND (start_date IS NULL OR start_date <= CURRENT_DATE)
                AND (end_date IS NULL OR end_date >= CURRENT_DATE)
                ORDER BY display_order, id
            """
            banners = db.execute_query(banners_query, fetch=True)
            response_cache.set(
                "banners:active:v1",
                {
                    "success": True,
                    "banners": [dict(banner) for banner in banners],
                    "count": len(banners),
                },
                ttl_seconds=60,
            )

            today = date.today().isoformat()
            offers_query = """
                SELECT id, title, description, code, discount_type, discount_value,
                       min_order_value, max_discount_amount, image_url,
                       start_date, end_date, offer_type
                FROM offers
                WHERE status = 'active'
                  AND start_date <= %s
                  AND end_date >= %s
                  AND used_count < usage_limit
                ORDER BY id ASC
            """
            offers = db.execute_query(offers_query, (today, today), fetch=True)
            offers_payload = []
            for offer in offers:
                offer_dict = dict(offer)
                if offer_dict.get('start_date'):
                    offer_dict['start_date'] = offer_dict['start_date'].isoformat()
                if offer_dict.get('end_date'):
                    offer_dict['end_date'] = offer_dict['end_date'].isoformat()
                offers_payload.append(offer_dict)
            response_cache.set("offers:active:v1", offers_payload, ttl_seconds=45)

            logging.info("✅ Hot API cache primed")
        except Exception as cache_exc:
            logging.warning(f"⚠️ Cache warmup skipped: {cache_exc}")
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(product_bp, url_prefix='/api/products')
    app.register_blueprint(category_bp, url_prefix='/api/categories')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(cart_bp, url_prefix='/api/cart')
    app.register_blueprint(order_bp, url_prefix='/api/orders')
    app.register_blueprint(wishlist_bp, url_prefix='/api/wishlist')
    app.register_blueprint(banner_bp, url_prefix='/api/banners')
    app.register_blueprint(offer_bp, url_prefix='/api/offers')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    app.register_blueprint(review_bp, url_prefix='/api/reviews')
    app.register_blueprint(report_bp, url_prefix='/api/reports')

    # Prime cache in background so first user doesn't pay cold-query latency.
    threading.Thread(target=prime_read_cache, daemon=True).start()
    
    # Add security headers
    @app.after_request
    def add_security_headers(response):
        """Add security headers to all responses"""
        # Prevent MIME type sniffing
        response.headers['X-Content-Type-Options'] = 'nosniff'
        
        # Prevent clickjacking attacks
        response.headers['X-Frame-Options'] = 'DENY'
        
        # Enable XSS protection in older browsers
        response.headers['X-XSS-Protection'] = '1; mode=block'
        
        # Enforce HTTPS in production (HSTS)
        if os.environ.get('FLASK_ENV') == 'production':
            response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        
        # Content Security Policy (CSP) - Basic policy
        response.headers['Content-Security-Policy'] = "default-src 'self'"
        
        # Referrer Policy
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        # Permissions Policy (formerly Feature-Policy)
        response.headers['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
        
        return response
    
    return app

# Create Flask app instance
app = create_app()

@app.route('/')
def hello():
    return jsonify({
        "message": "QuickCart Backend API is running!",
        "status": "success",
        "version": "2.0.0",
        "endpoints": {
            "auth": "/api/auth",
            "products": "/api/products",
            "categories": "/api/categories",
            "users": "/api/users",
            "cart": "/api/cart",
            "orders": "/api/orders",
            "wishlist": "/api/wishlist",
            "health": "/health"
        }
    })

@app.route('/health')
def health_check():
    """Health check endpoint"""
    db_status = "connected" if db.test_connection() else "disconnected"
    sms_services = Config.validate_sms_config() if hasattr(Config, 'validate_sms_config') else {"twilio": False, "fast2sms": False}
    
    return jsonify({
        'success': True,
        'message': 'QuickCart Backend API is running',
        'services': {
            'database': db_status,
            'sms': sms_services,
            'payments': False,  # TODO: Add payment gateway check
        },
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
        'version': '2.0.0'
    })

@app.route('/api')
def api_info():
    """API information endpoint"""
    return jsonify({
        'message': 'QuickCart API',
        'version': '2.0.0',
        'status': 'running',
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    print(f"🚀 Starting QuickCart Backend API on port {port}")
    print(f"🐛 Debug mode: {debug}")
    print(f"🌐 CORS enabled for: http://localhost:3000")
    print(f"🗄️  Database URL: {Config.DATABASE_URL}")
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug,
        threaded=True,
    )