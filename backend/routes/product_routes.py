from flask import Blueprint, request, jsonify
from utils.database import db
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
def create_product():
    """Create a new product (Admin only)"""
    try:
        data = request.get_json()
        
        required_fields = ['name', 'category_name', 'price', 'size', 'stock']
        if not all(field in data for field in required_fields):
            return jsonify({"success": False, "error": "Missing required fields"}), 400
        
        # Get category ID from name
        category_query = "SELECT id FROM categories WHERE name = %s"
        category = db.execute_query_one(category_query, (data['category_name'],))
        category_id = category['id'] if category else None
        
        query = """
            INSERT INTO products (name, category_id, category_name, price, original_price, 
                                size, stock, image_url, description, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'active')
            RETURNING *
        """
        
        params = (
            data['name'],
            category_id,
            data['category_name'],
            data['price'],
            data.get('original_price', data['price']),
            data['size'],
            data['stock'],
            data.get('image_url', ''),
            data.get('description', '')
        )
        
        result = db.execute_query(query, params, fetch=True)
        
        if result:
            # Update category product count
            if category_id:
                db.execute_query(
                    "UPDATE categories SET products_count = products_count + 1 WHERE id = %s",
                    (category_id,)
                )
            
            return jsonify({
                "success": True,
                "product": dict(result[0]),
                "message": "Product created successfully"
            }), 201
        
        return jsonify({"success": False, "error": "Failed to create product"}), 500
        
    except Exception as e:
        logger.error(f"Error creating product: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@product_bp.route('/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """Update a product (Admin only)"""
    try:
        data = request.get_json()
        
        # Build dynamic update query
        update_fields = []
        params = []
        
        allowed_fields = ['name', 'category_name', 'price', 'original_price', 
                         'size', 'stock', 'image_url', 'description', 'status']
        
        for field in allowed_fields:
            if field in data:
                update_fields.append(f"{field} = %s")
                params.append(data[field])
        
        if not update_fields:
            return jsonify({"success": False, "error": "No valid fields to update"}), 400
        
        # Update category_id if category_name changed
        if 'category_name' in data:
            category_query = "SELECT id FROM categories WHERE name = %s"
            category = db.execute_query_one(category_query, (data['category_name'],))
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
def delete_product(product_id):
    """Delete a product (Admin only)"""
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