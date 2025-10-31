from flask import Blueprint, request, jsonify
from utils.database import db
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
def create_banner():
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
def update_banner(banner_id):
    """Update a banner (Admin only)"""
    try:
        data = request.get_json()
        
        query = """
            UPDATE banners 
            SET title = %s, subtitle = %s, image_url = %s, link_url = %s, 
                status = %s, display_order = %s, start_date = %s, end_date = %s
            WHERE id = %s
            RETURNING *
        """
        
        params = (
            data.get('title', ''),
            data.get('subtitle', ''),
            data.get('image_url', ''),
            data.get('link_url', ''),
            data.get('status', 'active'),
            data.get('display_order', 0),
            data.get('start_date'),
            data.get('end_date'),
            banner_id
        )
        
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
def delete_banner(banner_id):
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
