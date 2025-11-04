from flask import Blueprint, request, jsonify
from utils.database import db
from utils.auth_middleware import admin_required
from utils.input_validator import InputValidator
import logging

logger = logging.getLogger(__name__)
category_bp = Blueprint('categories', __name__)

@category_bp.route('/', methods=['GET'])
def get_all_categories():
    """Get all categories with product count (user view - only non-empty categories)"""
    try:
        # Get categories with count of in-stock products
        query = """
            SELECT 
                c.*,
                COUNT(p.id) as products_count
            FROM categories c
            LEFT JOIN products p ON c.id = p.category_id 
                AND p.status = 'active' 
                AND p.stock > 0
            WHERE c.status = 'active'
            GROUP BY c.id
            ORDER BY c.position, c.id
        """
        categories = db.execute_query(query, fetch=True)
        
        # Filter out categories with no products
        categories_with_products = [dict(cat) for cat in categories if cat['products_count'] > 0]
        
        return jsonify({
            "success": True,
            "categories": categories_with_products,
            "count": len(categories_with_products)
        })
        
    except Exception as e:
        logger.error(f"Error fetching categories: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@category_bp.route('/admin', methods=['GET'])
@admin_required
def get_all_categories_admin(current_user):
    """
    🔒 SECURED: Get ALL categories with product count for admin (includes empty categories)
    """
    try:
        # Get all categories with count of ALL products (not just in-stock)
        query = """
            SELECT 
                c.*,
                COUNT(p.id) as products_count
            FROM categories c
            LEFT JOIN products p ON c.id = p.category_id 
                AND p.status = 'active'
            WHERE c.status = 'active'
            GROUP BY c.id
            ORDER BY c.position, c.id
        """
        categories = db.execute_query(query, fetch=True)
        
        # Return ALL categories for admin (including empty ones)
        all_categories = [dict(cat) for cat in categories]
        
        return jsonify({
            "success": True,
            "categories": all_categories,
            "count": len(all_categories)
        })
        
    except Exception as e:
        logger.error(f"Error fetching admin categories: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@category_bp.route('/<int:category_id>', methods=['GET'])
def get_category_by_id(category_id):
    """Get a specific category by ID"""
    try:
        query = "SELECT * FROM categories WHERE id = %s AND status = 'active'"
        category = db.execute_query_one(query, (category_id,))
        
        if not category:
            return jsonify({"success": False, "error": "Category not found"}), 404
        
        return jsonify({
            "success": True,
            "category": dict(category)
        })
        
    except Exception as e:
        logger.error(f"Error fetching category {category_id}: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@category_bp.route('/', methods=['POST'])
@admin_required
def create_category(current_user):
    """
    🔒 SECURED: Create a new category (Admin only)
    """
    try:
        data = request.get_json()
        
        if not data.get('name'):
            return jsonify({"success": False, "error": "Category name is required"}), 400
        
        # 🔒 Sanitize input
        name = InputValidator.sanitize_string(data['name'], max_length=100)
        position = data.get('position', 0)
        
        query = """
            INSERT INTO categories (name, image_url, position, status)
            VALUES (%s, %s, %s, 'active')
            RETURNING *
        """
        
        params = (
            name,
            data.get('image_url', ''),
            position
        )
        
        result = db.execute_query(query, params, fetch=True)
        
        if result:
            logger.info(f"✅ Admin {current_user['id']} created category: {name}")
            
            return jsonify({
                "success": True,
                "category": dict(result[0]),
                "message": "Category created successfully"
            }), 201
        
        return jsonify({"success": False, "error": "Failed to create category"}), 500
        
    except Exception as e:
        logger.error(f"❌ Error creating category: {e}")
        return jsonify({"success": False, "error": "Failed to create category"}), 500

@category_bp.route('/<int:category_id>', methods=['PUT'])
@admin_required
def update_category(current_user, category_id):
    """
    🔒 SECURED: Update a category (Admin only)
    """
    try:
        data = request.get_json()
        
        update_fields = []
        params = []
        
        allowed_fields = ['name', 'image_url', 'status', 'position']
        
        for field in allowed_fields:
            if field in data:
                # 🔒 Sanitize string fields
                if field in ['name', 'status']:
                    value = InputValidator.sanitize_string(data[field], max_length=200)
                elif field == 'position':
                    value = int(data[field])
                else:
                    value = data[field]
                update_fields.append(f"{field} = %s")
                params.append(value)
        
        if not update_fields:
            return jsonify({"success": False, "error": "No valid fields to update"}), 400
        
        params.append(category_id)
        
        query = f"""
            UPDATE categories 
            SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING *
        """
        
        result = db.execute_query(query, params, fetch=True)
        
        if result:
            return jsonify({
                "success": True,
                "category": dict(result[0]),
                "message": "Category updated successfully"
            })
        
        return jsonify({"success": False, "error": "Category not found"}), 404
        
    except Exception as e:
        logger.error(f"Error updating category {category_id}: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@category_bp.route('/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    """Delete a category (Admin only)"""
    try:
        # Check if category has products
        product_count_query = "SELECT COUNT(*) as count FROM products WHERE category_id = %s AND status = 'active'"
        result = db.execute_query_one(product_count_query, (category_id,))
        
        if result and result['count'] > 0:
            return jsonify({
                "success": False, 
                "error": f"Cannot delete category with {result['count']} active products"
            }), 400
        
        # Soft delete - set status to inactive
        query = """
            UPDATE categories 
            SET status = 'inactive', updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING *
        """
        
        result = db.execute_query(query, (category_id,), fetch=True)
        
        if result:
            return jsonify({
                "success": True,
                "message": "Category deleted successfully"
            })
        
        return jsonify({"success": False, "error": "Category not found"}), 404
        
    except Exception as e:
        logger.error(f"Error deleting category {category_id}: {e}")
        return jsonify({"success": False, "error": str(e)}), 500