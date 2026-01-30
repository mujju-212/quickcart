from flask import Blueprint, request, jsonify
from backend.utils.database import db
from backend.utils.auth_middleware import token_required, admin_required
from backend.utils.input_validator import InputValidator
import logging

review_bp = Blueprint('reviews', __name__)
logger = logging.getLogger(__name__)

@review_bp.route('/product/<int:product_id>', methods=['GET'])
def get_product_reviews(product_id):
    """Get all approved reviews for a product"""
    try:
        query = """
            SELECT 
                r.id, r.product_id, r.user_id, r.user_name, r.rating, 
                r.comment, r.verified_purchase, r.helpful_count, 
                r.status, r.created_at,
                p.name as product_name
            FROM product_reviews r
            LEFT JOIN products p ON r.product_id = p.id
            WHERE r.product_id = %s AND r.status = 'approved'
            ORDER BY r.created_at DESC
        """
        reviews = db.execute_query(query, (product_id,), fetch=True)
        
        # Calculate average rating
        avg_query = """
            SELECT 
                AVG(rating)::NUMERIC(3,1) as average_rating,
                COUNT(*) as total_reviews
            FROM product_reviews
            WHERE product_id = %s AND status = 'approved'
        """
        stats = db.execute_query_one(avg_query, (product_id,))
        
        return jsonify({
            'success': True,
            'reviews': reviews,
            'stats': {
                'average_rating': float(stats['average_rating']) if stats['average_rating'] else 0,
                'total_reviews': stats['total_reviews']
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error fetching reviews: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to fetch reviews'}), 500


@review_bp.route('/product/<int:product_id>', methods=['POST'])
@token_required
def add_review(current_user, product_id):
    """Add a new review for a product"""
    try:
        data = request.get_json()
        
        # Validate inputs
        rating = data.get('rating')
        comment = data.get('comment', '').strip()
        
        if not rating or rating < 1 or rating > 5:
            return jsonify({'success': False, 'message': 'Rating must be between 1 and 5'}), 400
            
        if not comment or len(comment) < 10:
            return jsonify({'success': False, 'message': 'Review must be at least 10 characters'}), 400
            
        if len(comment) > 1000:
            return jsonify({'success': False, 'message': 'Review must be less than 1000 characters'}), 400
        
        # Sanitize comment
        comment = InputValidator.sanitize_string(comment, max_length=1000)
        
        # Check if product exists
        product_query = "SELECT id, name FROM products WHERE id = %s"
        product = db.execute_query_one(product_query, (product_id,))
        
        if not product:
            return jsonify({'success': False, 'message': 'Product not found'}), 404
        
        # Check if user already reviewed this product
        existing_review = db.execute_query_one(
            "SELECT id FROM product_reviews WHERE product_id = %s AND user_id = %s",
            (product_id, current_user['id'])
        )
        
        if existing_review:
            return jsonify({'success': False, 'message': 'You have already reviewed this product'}), 400
        
        # Check if user has purchased this product (for verified purchase)
        purchase_query = """
            SELECT COUNT(*) as purchase_count
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            WHERE oi.product_id = %s AND o.user_id = %s AND o.status = 'delivered'
        """
        purchase_check = db.execute_query_one(purchase_query, (product_id, current_user['id']))
        verified_purchase = purchase_check['purchase_count'] > 0
        
        # Insert review
        insert_query = """
            INSERT INTO product_reviews 
            (product_id, user_id, user_name, rating, comment, verified_purchase, status)
            VALUES (%s, %s, %s, %s, %s, %s, 'approved')
            RETURNING id, product_id, user_id, user_name, rating, comment, 
                      verified_purchase, helpful_count, status, created_at
        """
        
        new_review = db.execute_query_one(
            insert_query,
            (product_id, current_user['id'], current_user['name'], rating, comment, verified_purchase)
        )
        
        logger.info(f"Review added by user {current_user['id']} for product {product_id}")
        
        return jsonify({
            'success': True,
            'message': 'Review added successfully',
            'review': new_review
        }), 201
        
    except Exception as e:
        logger.error(f"Error adding review: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to add review'}), 500


@review_bp.route('/<int:review_id>', methods=['PUT'])
@token_required
def update_review(current_user, review_id):
    """Update user's own review"""
    try:
        data = request.get_json()
        
        # Check if review exists and belongs to user
        review = db.execute_query_one(
            "SELECT * FROM product_reviews WHERE id = %s AND user_id = %s",
            (review_id, current_user['id'])
        )
        
        if not review:
            return jsonify({'success': False, 'message': 'Review not found or unauthorized'}), 404
        
        # Validate inputs
        rating = data.get('rating', review['rating'])
        comment = data.get('comment', review['comment']).strip()
        
        if rating < 1 or rating > 5:
            return jsonify({'success': False, 'message': 'Rating must be between 1 and 5'}), 400
            
        if len(comment) < 10 or len(comment) > 1000:
            return jsonify({'success': False, 'message': 'Review must be between 10 and 1000 characters'}), 400
        
        # Sanitize comment
        comment = InputValidator.sanitize_string(comment, max_length=1000)
        
        # Update review
        update_query = """
            UPDATE product_reviews 
            SET rating = %s, comment = %s
            WHERE id = %s AND user_id = %s
            RETURNING id, product_id, user_id, user_name, rating, comment, 
                      verified_purchase, helpful_count, status, created_at, updated_at
        """
        
        updated_review = db.execute_query_one(
            update_query,
            (rating, comment, review_id, current_user['id'])
        )
        
        return jsonify({
            'success': True,
            'message': 'Review updated successfully',
            'review': updated_review
        }), 200
        
    except Exception as e:
        logger.error(f"Error updating review: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to update review'}), 500


@review_bp.route('/<int:review_id>', methods=['DELETE'])
@token_required
def delete_review(current_user, review_id):
    """Delete user's own review"""
    try:
        # Check if review exists and belongs to user
        review = db.execute_query_one(
            "SELECT * FROM product_reviews WHERE id = %s AND user_id = %s",
            (review_id, current_user['id'])
        )
        
        if not review:
            return jsonify({'success': False, 'message': 'Review not found or unauthorized'}), 404
        
        # Delete review
        db.execute_query("DELETE FROM product_reviews WHERE id = %s", (review_id,))
        
        return jsonify({
            'success': True,
            'message': 'Review deleted successfully'
        }), 200
        
    except Exception as e:
        logger.error(f"Error deleting review: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to delete review'}), 500


# ========== ADMIN ROUTES ==========

@review_bp.route('/admin/all', methods=['GET'])
@admin_required
def get_all_reviews(current_user):
    """Get all reviews (for admin) with filters"""
    try:
        status = request.args.get('status', 'all')
        product_id = request.args.get('product_id')
        limit = int(request.args.get('limit', 100))
        offset = int(request.args.get('offset', 0))
        
        # Build query
        query = """
            SELECT 
                r.id, r.product_id, r.user_id, r.user_name, r.rating, 
                r.comment, r.verified_purchase, r.helpful_count, 
                r.status, r.created_at, r.updated_at,
                p.name as product_name,
                u.phone as user_phone
            FROM product_reviews r
            LEFT JOIN products p ON r.product_id = p.id
            LEFT JOIN users u ON r.user_id = u.id
            WHERE 1=1
        """
        params = []
        
        if status != 'all':
            query += " AND r.status = %s"
            params.append(status)
            
        if product_id:
            query += " AND r.product_id = %s"
            params.append(int(product_id))
        
        query += " ORDER BY r.created_at DESC LIMIT %s OFFSET %s"
        params.extend([limit, offset])
        
        reviews = db.execute_query(query, tuple(params), fetch=True)
        
        # Get total count
        count_query = "SELECT COUNT(*) as total FROM product_reviews"
        count_params = []
        
        if status != 'all':
            count_query += " WHERE status = %s"
            count_params.append(status)
            
        if product_id:
            count_query += f" {'AND' if status != 'all' else 'WHERE'} product_id = %s"
            count_params.append(int(product_id))
        
        total = db.execute_query_one(count_query, tuple(count_params) if count_params else None)
        
        return jsonify({
            'success': True,
            'reviews': reviews,
            'total': total['total'],
            'limit': limit,
            'offset': offset
        }), 200
        
    except Exception as e:
        logger.error(f"Error fetching all reviews: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to fetch reviews'}), 500


@review_bp.route('/admin/<int:review_id>', methods=['DELETE'])
@admin_required
def admin_delete_review(current_user, review_id):
    """Admin delete any review"""
    try:
        # Check if review exists
        review = db.execute_query_one(
            "SELECT * FROM product_reviews WHERE id = %s",
            (review_id,)
        )
        
        if not review:
            return jsonify({'success': False, 'message': 'Review not found'}), 404
        
        # Delete review
        db.execute_query("DELETE FROM product_reviews WHERE id = %s", (review_id,))
        
        logger.info(f"Admin {current_user['id']} deleted review {review_id}")
        
        return jsonify({
            'success': True,
            'message': 'Review deleted successfully'
        }), 200
        
    except Exception as e:
        logger.error(f"Error deleting review (admin): {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to delete review'}), 500


@review_bp.route('/admin/<int:review_id>/status', methods=['PATCH'])
@admin_required
def update_review_status(current_user, review_id):
    """Update review status (approve/reject)"""
    try:
        data = request.get_json()
        status = data.get('status')
        
        if status not in ['pending', 'approved', 'rejected']:
            return jsonify({'success': False, 'message': 'Invalid status'}), 400
        
        # Check if review exists
        review = db.execute_query_one(
            "SELECT * FROM product_reviews WHERE id = %s",
            (review_id,)
        )
        
        if not review:
            return jsonify({'success': False, 'message': 'Review not found'}), 404
        
        # Update status
        update_query = """
            UPDATE product_reviews 
            SET status = %s
            WHERE id = %s
            RETURNING id, status, updated_at
        """
        
        updated_review = db.execute_query_one(update_query, (status, review_id))
        
        logger.info(f"Admin {current_user['id']} updated review {review_id} status to {status}")
        
        return jsonify({
            'success': True,
            'message': f'Review {status} successfully',
            'review': updated_review
        }), 200
        
    except Exception as e:
        logger.error(f"Error updating review status: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to update review status'}), 500


@review_bp.route('/product/<int:product_id>/stats', methods=['GET'])
def get_product_review_stats(product_id):
    """Get detailed review statistics for a product"""
    try:
        stats_query = """
            SELECT 
                COUNT(*) as total_reviews,
                AVG(rating)::NUMERIC(3,1) as average_rating,
                COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
                COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
                COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
                COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
                COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star,
                COUNT(CASE WHEN verified_purchase = true THEN 1 END) as verified_purchases
            FROM product_reviews
            WHERE product_id = %s AND status = 'approved'
        """
        
        stats = db.execute_query_one(stats_query, (product_id,))
        
        return jsonify({
            'success': True,
            'stats': {
                'total_reviews': stats['total_reviews'],
                'average_rating': float(stats['average_rating']) if stats['average_rating'] else 0,
                'rating_distribution': {
                    '5': stats['five_star'],
                    '4': stats['four_star'],
                    '3': stats['three_star'],
                    '2': stats['two_star'],
                    '1': stats['one_star']
                },
                'verified_purchases': stats['verified_purchases']
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error fetching review stats: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to fetch review statistics'}), 500
