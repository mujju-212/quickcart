from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
import time
import sys

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
from backend.utils.database import db

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
    CORS(app, 
         origins=["http://localhost:3000"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         allow_headers=["Content-Type", "Authorization"],
         supports_credentials=True)
    
    # Test database connection on startup
    with app.app_context():
        if db.test_connection():
            logging.info("✅ Database connection successful")
        else:
            logging.error("❌ Database connection failed")
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(product_bp, url_prefix='/api/products')
    app.register_blueprint(category_bp, url_prefix='/api/categories')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(cart_bp, url_prefix='/api/cart')
    app.register_blueprint(order_bp, url_prefix='/api/orders')
    
    return app

# Create Flask app instance
app = create_app()

@app.route('/')
def hello():
    return jsonify({
        "message": "Blink Basket Backend API is running!",
        "status": "success",
        "version": "2.0.0",
        "endpoints": {
            "auth": "/api/auth",
            "products": "/api/products",
            "categories": "/api/categories",
            "users": "/api/users",
            "cart": "/api/cart",
            "orders": "/api/orders",
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
        'message': 'Blink Basket Backend API is running',
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
        'message': 'Blink Basket API',
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
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    print(f"🚀 Starting Blink Basket Backend API on port {port}")
    print(f"🐛 Debug mode: {debug}")
    print(f"🌐 CORS enabled for: http://localhost:3000")
    print(f"🗄️  Database URL: {Config.DATABASE_URL}")
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )