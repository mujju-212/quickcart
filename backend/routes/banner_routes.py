from flask import Blueprint, request, jsonify
from utils.database import db
from utils.auth_middleware import admin_required
import logging

logger = logging.getLogger(__name__)
banner_bp = Blueprint('banners', __name__)

@banner_bp.route('/', methods=['GET'])
def get_all_banners():
    """Get all banners"""
    try:
        query = """
            SELECT * FROM banners 
            ORDER BY display_order, id
        """
        banners = db.execute_query(query, fetch=True)
        
        return jsonify({
            "success": True,
            "banners": [dict(banner) for banner in banners],
            "count": len(banners)
        })
        
    except Exception as e:
        logger.error(f"Error fetching banners: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@banner_bp.route('/active', methods=['GET'])
def get_active_banners():
    """Get only active banners"""
    try:
        query = """
            SELECT * FROM banners 
            WHERE status = 'active'
            AND (start_date IS NULL OR start_date <= CURRENT_DATE)
            AND (end_date IS NULL OR end_date >= CURRENT_DATE)
            ORDER BY display_order, id
        """
        banners = db.execute_query(query, fetch=True)
        
        return jsonify({
            "success": True,
            "banners": [dict(banner) for banner in banners],
            "count": len(banners)
        })
        
    except Exception as e:
        logger.error(f"Error fetching active banners: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@banner_bp.route('/<int:banner_id>', methods=['GET'])
def get_banner_by_id(banner_id):
    """Get a specific banner by ID"""
    try:
        query = "SELECT * FROM banners WHERE id = %s"
        banner = db.execute_query_one(query, (banner_id,))
        
        if not banner:
            return jsonify({"success": False, "error": "Banner not found"}), 404
        
        return jsonify({
            "success": True,
            "banner": dict(banner)
        })
        
    except Exception as e:
        logger.error(f"Error fetching banner {banner_id}: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@banner_bp.route('/', methods=['POST'])
@admin_required
def create_banner(current_user):
    """Create a new banner (Admin only)"""
    try:
        data = request.get_json()
        
        if not data.get('image_url'):
            return jsonify({"success": False, "error": "Image URL is required"}), 400
        
        query = """
            INSERT INTO banners (title, subtitle, image_url, link_url, status, display_order, start_date, end_date)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """
        
        params = (
            data.get('title', ''),
            data.get('subtitle', ''),
            data['image_url'],
            data.get('link_url', ''),
            data.get('status', 'active'),
            data.get('display_order', 0),
            data.get('start_date'),
            data.get('end_date')
        )
        
        result = db.execute_query(query, params, fetch=True)
        
        if result:
            return jsonify({
                "success": True,
                "banner": dict(result[0]),
                "message": "Banner created successfully"
            }), 201
        
        return jsonify({"success": False, "error": "Failed to create banner"}), 500
        
    except Exception as e:
        logger.error(f"Error creating banner: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@banner_bp.route('/<int:banner_id>', methods=['PUT'])
@admin_required
def update_banner(current_user, banner_id):
    """Update a banner (Admin only)"""
    try:
        data = request.get_json()
        
        # Build dynamic update query to only update provided fields
        update_fields = []
        params = []
        
        field_mapping = {
            'title': 'title',
            'subtitle': 'subtitle',
            'image_url': 'image_url',
            'link_url': 'link_url',
            'status': 'status',
            'display_order': 'display_order',
            'start_date': 'start_date',
            'end_date': 'end_date'
        }
        
        for field_key, db_column in field_mapping.items():
            if field_key in data:
                # Skip empty optional fields
                if field_key in ['link_url', 'subtitle'] and not data[field_key]:
                    continue
                update_fields.append(f"{db_column} = %s")
                params.append(data[field_key])
        
        if not update_fields:
            return jsonify({"success": False, "error": "No fields to update"}), 400
        
        params.append(banner_id)
        
        query = f"""
            UPDATE banners 
            SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING *
        """
        
        result = db.execute_query(query, params, fetch=True)
        
        if result:
            return jsonify({
                "success": True,
                "banner": dict(result[0]),
                "message": "Banner updated successfully"
            })
        
        return jsonify({"success": False, "error": "Banner not found"}), 404
        
    except Exception as e:
        logger.error(f"Error updating banner {banner_id}: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@banner_bp.route('/<int:banner_id>', methods=['DELETE'])
@admin_required
def delete_banner(current_user, banner_id):
    """Delete a banner (Admin only)"""
    try:
        query = "DELETE FROM banners WHERE id = %s RETURNING id"
        result = db.execute_query(query, (banner_id,), fetch=True)
        
        if result:
            return jsonify({
                "success": True,
                "message": "Banner deleted successfully"
            })
        
        return jsonify({"success": False, "error": "Banner not found"}), 404
        
    except Exception as e:
        logger.error(f"Error deleting banner {banner_id}: {e}")
        return jsonify({"success": False, "error": str(e)}), 500
