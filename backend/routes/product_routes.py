from flask import Blueprint, request, jsonify
from backend.utils.database import db
from backend.utils.auth_middleware import admin_required, optional_auth
from backend.utils.input_validator import InputValidator
from backend.utils.response_cache import response_cache
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
        include_out_of_stock = request.args.get('include_out_of_stock', 'false').lower() == 'true'

        cache_key = (
            f"products:list:v2:category={category or ''}:search={search or ''}:"
            f"limit={limit or ''}:include_oos={include_out_of_stock}"
        )
        def build_payload():
            query = """
                SELECT p.*, c.name as category_name 
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.id 
                WHERE p.status = 'active'
            """
            params = []

            # By default, exclude out-of-stock products for customers
            if not include_out_of_stock:
                query_nonlocal = query + " AND p.stock > 0"
            else:
                query_nonlocal = query

            if category:
                query_nonlocal += " AND (p.category_name = %s OR c.name = %s)"
                params.extend([category, category])

            if search:
                query_nonlocal += " AND (p.name ILIKE %s OR p.description ILIKE %s)"
                search_term = f"%{search}%"
                params.extend([search_term, search_term])

            query_nonlocal += " ORDER BY p.id"

            if limit:
                query_nonlocal += " LIMIT %s"
                params.append(limit)

            products = db.execute_query(query_nonlocal, params, fetch=True)

            return {
                "success": True,
                "products": [dict(product) for product in products],
                "count": len(products)
            }

        payload = response_cache.get_or_set(cache_key, build_payload, ttl_seconds=30)

        return jsonify(payload)
        
    except Exception as e:
        logger.error(f"Error fetching products: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@product_bp.route('/<int:product_id>', methods=['GET'])
def get_product_by_id(product_id):
    """Get a specific product by ID"""
    try:
        cache_key = f"products:by-id:{product_id}"
        def build_payload():
            query = """
                SELECT p.*, c.name as category_name 
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.id 
                WHERE p.id = %s AND p.status = 'active'
            """
            product = db.execute_query_one(query, (product_id,))

            if not product:
                return None

            return {
                "success": True,
                "product": dict(product)
            }

        payload = response_cache.get_or_set(cache_key, build_payload, ttl_seconds=60)

        if payload is None:
            return jsonify({"success": False, "error": "Product not found"}), 404

        return jsonify(payload)
        
    except Exception as e:
        logger.error(f"Error fetching product {product_id}: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@product_bp.route('/category/<category_name>', methods=['GET'])
def get_products_by_category(category_name):
    """Get products by category name"""
    try:
        cache_key = f"products:category:{category_name}"
        def build_payload():
            query = """
                SELECT p.*, c.name as category_name 
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.id 
                WHERE (p.category_name = %s OR c.name = %s) AND p.status = 'active'
                ORDER BY p.id
            """
            products = db.execute_query(query, (category_name, category_name), fetch=True)

            return {
                "success": True,
                "products": [dict(product) for product in products],
                "category": category_name,
                "count": len(products)
            }

        payload = response_cache.get_or_set(cache_key, build_payload, ttl_seconds=30)

        return jsonify(payload)
        
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
        # Don't sanitize category_name yet - we need the raw value for lookup
        category_name_raw = data['category_name']
        description = InputValidator.sanitize_string(data.get('description', ''), max_length=1000)
        
        # Validate price
        price_valid, validated_price, price_error = InputValidator.validate_price(data['price'])
        if not price_valid:
            return jsonify({"success": False, "error": price_error}), 400
        
        # Validate stock (simpler validation for product stock, not cart quantity)
        try:
            validated_stock = int(data['stock'])
            if validated_stock < 0:
                return jsonify({"success": False, "error": "Stock cannot be negative"}), 400
            if validated_stock > 100000:
                return jsonify({"success": False, "error": "Stock exceeds maximum limit"}), 400
        except (ValueError, TypeError):
            return jsonify({"success": False, "error": "Invalid stock value"}), 400
        
        # Get category ID from name (use raw value for lookup)
        category_query = "SELECT id, name FROM categories WHERE name = %s"
        category_result = db.execute_query(category_query, (category_name_raw,), fetch=True)
        category_id = category_result[0]['id'] if category_result and len(category_result) > 0 else None
        category_name = category_result[0]['name'] if category_result and len(category_result) > 0 else category_name_raw
        
        if not category_id:
            return jsonify({"success": False, "error": f"Category '{category_name_raw}' not found"}), 400
        
        # Validate original_price if provided
        if 'original_price' in data:
            original_price_valid, validated_original_price, original_price_error = InputValidator.validate_price(data['original_price'])
            if not original_price_valid:
                return jsonify({"success": False, "error": f"Original price error: {original_price_error}"}), 400
        else:
            validated_original_price = validated_price
        
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
            validated_price,
            validated_original_price,
            data['size'],
            validated_stock,
            data.get('image_url', ''),
            description
        )
        
        result = db.execute_query(query, params, fetch=True)
        
        if result:
            response_cache.invalidate("products:")
            response_cache.invalidate("categories:")

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
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": f"Failed to create product: {str(e)}"}), 500

@product_bp.route('/<int:product_id>', methods=['PUT'])
@admin_required
def update_product(current_user, product_id):
    """
    🔒 SECURED: Update a product (Admin only)
    """
    try:
        data = request.get_json()
        
        # Debug logging
        logger.info(f"🔄 Updating product {product_id}")
        logger.info(f"📦 Received data: {data}")
        
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
                    logger.info(f"💰 Validating {field}: {data[field]} (type: {type(data[field])})")
                    price_valid, validated_price_val, price_error = InputValidator.validate_price(data[field])
                    if not price_valid:
                        logger.error(f"❌ Price validation failed for {field}: {price_error}")
                        return jsonify({"success": False, "error": f"{field}: {price_error}"}), 400
                    value = validated_price_val
                    logger.info(f"✅ {field} validated: {value}")
                elif field == 'stock':
                    # Validate stock (for product stock, not cart quantity - allow larger values)
                    try:
                        value = int(data[field])
                        if value < 0:
                            return jsonify({"success": False, "error": "Stock cannot be negative"}), 400
                        if value > 100000:
                            return jsonify({"success": False, "error": "Stock exceeds maximum limit"}), 400
                    except (ValueError, TypeError):
                        logger.error(f"❌ Invalid stock value: {data[field]}")
                        return jsonify({"success": False, "error": f"Invalid stock value: {data[field]}"}), 400
                else:
                    value = data[field]
                
                update_fields.append(f"{field} = %s")
                params.append(value)
        
        if not update_fields:
            logger.error("❌ No valid fields to update")
            return jsonify({"success": False, "error": "No valid fields to update"}), 400
        
        # Update category_id if category_name changed
        if 'category_name' in data:
            logger.info(f"🏷️ Looking up category: {data['category_name']}")
            category_query = "SELECT id FROM categories WHERE name = %s"
            # Don't sanitize for lookup - use the raw value to match database
            category_result = db.execute_query(category_query, (data['category_name'],), fetch=True)
            logger.info(f"🏷️ Category query result: {category_result}")
            if category_result and len(category_result) > 0:
                update_fields.append("category_id = %s")
                params.append(category_result[0]['id'])
                logger.info(f"✅ Category ID: {category_result[0]['id']}")
            else:
                logger.error(f"❌ Category not found: {data['category_name']}")
                return jsonify({"success": False, "error": f"Category '{data['category_name']}' not found"}), 400
        
        params.append(product_id)
        
        query = f"""
            UPDATE products 
            SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING *
        """
        
        logger.info(f"🔧 SQL Query: {query}")
        logger.info(f"🔧 SQL Params: {params}")
        
        result = db.execute_query(query, params, fetch=True)
        
        if result:
            response_cache.invalidate("products:")
            response_cache.invalidate("categories:")
            logger.info(f"✅ Admin {current_user['id']} updated product {product_id}")
            
            return jsonify({
                "success": True,
                "product": dict(result[0]),
                "message": "Product updated successfully"
            })
        
        return jsonify({"success": False, "error": "Product not found"}), 404
        
    except Exception as e:
        logger.error(f"Error updating product {product_id}: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": f"Failed to update product: {str(e)}"}), 500

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
            response_cache.invalidate("products:")
            response_cache.invalidate("categories:")
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