from flask import Blueprint, request, jsonify
from utils.database import db
from utils.auth_middleware import admin_required
from utils.input_validator import InputValidator
import logging

logger = logging.getLogger(__name__)
category_bp = Blueprint('categories', __name__)

@category_bp.route('/', methods=['GET'])
def get_all_categories():
    """Get all categories"""
    try:
        query = """
            SELECT * FROM categories 
            WHERE status = 'active' 
            ORDER BY id
        """
        categories = db.execute_query(query, fetch=True)
        
        return jsonify({
            "success": True,
            "categories": [dict(category) for category in categories],
            "count": len(categories)
        })
        
    except Exception as e:
        logger.error(f"Error fetching categories: {e}")
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
        
        query = """
            INSERT INTO categories (name, image_url, status)
            VALUES (%s, %s, 'active')
            RETURNING *
        """
        
        params = (
            name,
            data.get('image_url', '')
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
        
        allowed_fields = ['name', 'image_url', 'status']
        
        for field in allowed_fields:
            if field in data:
                # 🔒 Sanitize string fields
                value = InputValidator.sanitize_string(data[field], max_length=200) if field in ['name', 'status'] else data[field]
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