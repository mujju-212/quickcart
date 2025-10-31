from flask import Blueprint, request, jsonify
from utils.database import db
from utils.auth_middleware import admin_required, optional_auth
from utils.input_validator import InputValidator
import logging

logger = logging.getLogger(__name__)
product_bp = Blueprint('products', __name__)

@product_bp.route('/', methods=['GET'])
def get_all_products():
    """Get all products with optional filtering"""
    try:
        category = request.args.get('category')
        search = request.args.get('search')
        limit = request.args.get('limit', type=int)
        
        query = """
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.status = 'active'
        """
        params = []
        
        if category:
            query += " AND (p.category_name = %s OR c.name = %s)"
            params.extend([category, category])
        
        if search:
            query += " AND (p.name ILIKE %s OR p.description ILIKE %s)"
            search_term = f"%{search}%"
            params.extend([search_term, search_term])
        
        query += " ORDER BY p.id"
        
        if limit:
            query += " LIMIT %s"
            params.append(limit)
        
        products = db.execute_query(query, params, fetch=True)
        
        return jsonify({
            "success": True,
            "products": [dict(product) for product in products],
            "count": len(products)
        })
        
    except Exception as e:
        logger.error(f"Error fetching products: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@product_bp.route('/<int:product_id>', methods=['GET'])
def get_product_by_id(product_id):
    """Get a specific product by ID"""
    try:
        query = """
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.id = %s AND p.status = 'active'
        """
        product = db.execute_query_one(query, (product_id,))
        
        if not product:
            return jsonify({"success": False, "error": "Product not found"}), 404
        
        return jsonify({
            "success": True,
            "product": dict(product)
        })
        
    except Exception as e:
        logger.error(f"Error fetching product {product_id}: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@product_bp.route('/category/<category_name>', methods=['GET'])
def get_products_by_category(category_name):
    """Get products by category name"""
    try:
        query = """
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE (p.category_name = %s OR c.name = %s) AND p.status = 'active'
            ORDER BY p.id
        """
        products = db.execute_query(query, (category_name, category_name), fetch=True)
        
        return jsonify({
            "success": True,
            "products": [dict(product) for product in products],
            "category": category_name,
            "count": len(products)
        })
        
    except Exception as e:
        logger.error(f"Error fetching products for category {category_name}: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@product_bp.route('/', methods=['POST'])
@admin_required
def create_product(current_user):
    """
    🔒 SECURED: Create a new product (Admin only)
    """
    try:
        data = request.get_json()
        
        required_fields = ['name', 'category_name', 'price', 'size', 'stock']
        if not all(field in data for field in required_fields):
            return jsonify({"success": False, "error": "Missing required fields"}), 400
        
        # 🔒 Validate product data
        name = InputValidator.sanitize_string(data['name'], max_length=200)
        category_name = InputValidator.sanitize_string(data['category_name'], max_length=100)
        description = InputValidator.sanitize_string(data.get('description', ''), max_length=1000)
        
        # Validate price
        price_validation = InputValidator.validate_price(data['price'])
        if not price_validation['valid']:
            return jsonify({"success": False, "error": price_validation['error']}), 400
        
        # Validate stock
        stock_validation = InputValidator.validate_quantity(data['stock'])
        if not stock_validation['valid']:
            return jsonify({"success": False, "error": stock_validation['error']}), 400
        
        # Get category ID from name
        category_query = "SELECT id FROM categories WHERE name = %s"
        category = db.execute_query_one(category_query, (category_name,))
        category_id = category['id'] if category else None
        
        query = """
            INSERT INTO products (name, category_id, category_name, price, original_price, 
                                size, stock, image_url, description, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'active')
            RETURNING *
        """
        
        params = (
            name,
            category_id,
            category_name,
            float(data['price']),
            float(data.get('original_price', data['price'])),
            data['size'],
            int(data['stock']),
            data.get('image_url', ''),
            description
        )
        
        result = db.execute_query(query, params, fetch=True)
        
        if result:
            # Update category product count
            if category_id:
                db.execute_query(
                    "UPDATE categories SET products_count = products_count + 1 WHERE id = %s",
                    (category_id,)
                )
            
            logger.info(f"✅ Admin {current_user['id']} created product: {name}")
            
            return jsonify({
                "success": True,
                "product": dict(result[0]),
                "message": "Product created successfully"
            }), 201
        
        return jsonify({"success": False, "error": "Failed to create product"}), 500
        
    except Exception as e:
        logger.error(f"❌ Error creating product: {e}")
        return jsonify({"success": False, "error": "Failed to create product"}), 500

@product_bp.route('/<int:product_id>', methods=['PUT'])
@admin_required
def update_product(current_user, product_id):
    """
    🔒 SECURED: Update a product (Admin only)
    """
    try:
        data = request.get_json()
        
        # Build dynamic update query
        update_fields = []
        params = []
        
        allowed_fields = ['name', 'category_name', 'price', 'original_price', 
                         'size', 'stock', 'image_url', 'description', 'status']
        
        for field in allowed_fields:
            if field in data:
                # 🔒 Sanitize string fields
                if field in ['name', 'category_name', 'description', 'status']:
                    value = InputValidator.sanitize_string(data[field], max_length=1000)
                # Validate numeric fields
                elif field in ['price', 'original_price']:
                    price_val = InputValidator.validate_price(data[field])
                    if not price_val['valid']:
                        return jsonify({"success": False, "error": price_val['error']}), 400
                    value = float(data[field])
                elif field == 'stock':
                    stock_val = InputValidator.validate_quantity(data[field])
                    if not stock_val['valid']:
                        return jsonify({"success": False, "error": stock_val['error']}), 400
                    value = int(data[field])
                else:
                    value = data[field]
                
                update_fields.append(f"{field} = %s")
                params.append(value)
        
        if not update_fields:
            return jsonify({"success": False, "error": "No valid fields to update"}), 400
        
        # Update category_id if category_name changed
        if 'category_name' in data:
            category_query = "SELECT id FROM categories WHERE name = %s"
            category = db.execute_query_one(category_query, (InputValidator.sanitize_string(data['category_name']),))
            if category:
                update_fields.append("category_id = %s")
                params.append(category['id'])
        
        params.append(product_id)
        
        query = f"""
            UPDATE products 
            SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING *
        """
        
        result = db.execute_query(query, params, fetch=True)
        
        if result:
            logger.info(f"✅ Admin {current_user['id']} updated product {product_id}")
            
            return jsonify({
                "success": True,
                "product": dict(result[0]),
                "message": "Product updated successfully"
            })
        
        return jsonify({"success": False, "error": "Product not found"}), 404
        
    except Exception as e:
        logger.error(f"Error updating product {product_id}: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@product_bp.route('/<int:product_id>', methods=['DELETE'])
@admin_required
def delete_product(current_user, product_id):
    """
    🔒 SECURED: Delete a product (Admin only)
    """
    try:
        # Soft delete - set status to inactive
        query = """
            UPDATE products 
            SET status = 'inactive', updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING category_id
        """
        
        result = db.execute_query(query, (product_id,), fetch=True)
        
        if result:
            category_id = result[0]['category_id']
            
            # Update category product count
            if category_id:
                db.execute_query(
                    """UPDATE categories 
                       SET products_count = (
                           SELECT COUNT(*) FROM products 
                           WHERE category_id = %s AND status = 'active'
                       ) 
                       WHERE id = %s""",
                    (category_id, category_id)
                )
            
            logger.info(f"✅ Admin {current_user['id']} deleted product {product_id}")
            
            return jsonify({
                "success": True,
                "message": "Product deleted successfully"
            })
        
        return jsonify({"success": False, "error": "Product not found"}), 404
        
    except Exception as e:
        logger.error(f"Error deleting product {product_id}: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@product_bp.route('/<int:product_id>/related', methods=['GET'])
def get_related_products(product_id):
    """Get related products for a specific product"""
    try:
        limit = request.args.get('limit', default=4, type=int)
        
        # First get the current product's category
        current_product_query = """
            SELECT category_id FROM products 
            WHERE id = %s AND status = 'active'
        """
        current_product = db.execute_query_one(current_product_query, (product_id,))
        
        if not current_product:
            return jsonify({"success": False, "error": "Product not found"}), 404
        
        category_id = dict(current_product)['category_id']
        
        # Get related products from the same category, excluding the current product
        query = """
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.category_id = %s AND p.id != %s AND p.status = 'active'
            ORDER BY RANDOM()
            LIMIT %s
        """
        related_products = db.execute_query(query, (category_id, product_id, limit), fetch=True)
        
        return jsonify({
            "success": True,
            "products": [dict(product) for product in related_products],
            "count": len(related_products)
        })
        
    except Exception as e:
        logger.error(f"Error fetching related products for {product_id}: {e}")
        return jsonify({"success": False, "error": str(e)}), 500