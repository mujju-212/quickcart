"""
Offer Routes - Handles promotional offers and discount codes
"""

from flask import Blueprint, request, jsonify
from datetime import datetime, date
from backend.utils.database import db

offer_bp = Blueprint('offers', __name__)

@offer_bp.route('', methods=['GET'])
def get_all_offers():
    """Get all offers (admin only)"""
    try:
        query = """
            SELECT id, title, description, code, discount_type, discount_value,
                   min_order_value, max_discount_amount, image_url, status,
                   start_date, end_date, usage_limit, used_count,
                   applicable_categories, offer_type, created_at
            FROM offers
            ORDER BY created_at DESC
        """
        offers = db.execute_query(query, fetch=True)
        
        # Convert date objects to strings
        for offer in offers:
            if offer.get('start_date'):
                offer['start_date'] = offer['start_date'].isoformat()
            if offer.get('end_date'):
                offer['end_date'] = offer['end_date'].isoformat()
        
        return jsonify(offers), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@offer_bp.route('/active', methods=['GET'])
def get_active_offers():
    """Get all active offers for customers"""
    try:
        today = date.today().isoformat()
        query = """
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
        offers = db.execute_query(query, (today, today), fetch=True)
        
        # Convert date objects to strings
        for offer in offers:
            if offer.get('start_date'):
                offer['start_date'] = offer['start_date'].isoformat()
            if offer.get('end_date'):
                offer['end_date'] = offer['end_date'].isoformat()
        
        return jsonify(offers), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@offer_bp.route('/<int:offer_id>', methods=['GET'])
def get_offer(offer_id):
    """Get a specific offer by ID"""
    try:
        query = """
            SELECT id, title, description, code, discount_type, discount_value,
                   min_order_value, max_discount_amount, image_url, status,
                   start_date, end_date, usage_limit, used_count,
                   applicable_categories, offer_type, created_at
            FROM offers
            WHERE id = %s
        """
        offers = db.execute_query(query, (offer_id,), fetch=True)
        
        if not offers:
            return jsonify({'error': 'Offer not found'}), 404
        
        offer = offers[0]
        if offer.get('start_date'):
            offer['start_date'] = offer['start_date'].isoformat()
        if offer.get('end_date'):
            offer['end_date'] = offer['end_date'].isoformat()
        
        return jsonify(offer), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@offer_bp.route('/validate/<code>', methods=['POST'])
def validate_offer(code):
    """Validate an offer code and calculate discount"""
    try:
        data = request.json
        order_value = data.get('orderValue', 0)
        
        today = date.today().isoformat()
        query = """
            SELECT id, title, code, discount_type, discount_value,
                   min_order_value, max_discount_amount, status,
                   start_date, end_date, usage_limit, used_count
            FROM offers
            WHERE code = %s
        """
        offers = db.execute_query(query, (code.upper(),), fetch=True)
        
        if not offers:
            return jsonify({'valid': False, 'message': 'Invalid offer code'}), 400
        
        offer = offers[0]
        
        # Validate offer status
        if offer['status'] != 'active':
            return jsonify({'valid': False, 'message': 'Offer is not active'}), 400
        
        # Validate dates
        if offer['start_date'].isoformat() > today or offer['end_date'].isoformat() < today:
            return jsonify({'valid': False, 'message': 'Offer has expired or not started yet'}), 400
        
        # Validate usage limit
        if offer['used_count'] >= offer['usage_limit']:
            return jsonify({'valid': False, 'message': 'Offer usage limit reached'}), 400
        
        # Validate minimum order value
        if order_value < offer['min_order_value']:
            return jsonify({
                'valid': False,
                'message': f"Minimum order value should be ₹{offer['min_order_value']}"
            }), 400
        
        # Calculate discount
        discount_amount = 0
        if offer['discount_type'] == 'percentage':
            discount_amount = (order_value * offer['discount_value']) / 100
            if offer['max_discount_amount']:
                discount_amount = min(discount_amount, offer['max_discount_amount'])
        elif offer['discount_type'] == 'fixed':
            discount_amount = min(offer['discount_value'], order_value)
        elif offer['discount_type'] == 'free_delivery':
            discount_amount = 0  # Handled separately in checkout
        
        return jsonify({
            'valid': True,
            'discountAmount': round(discount_amount, 2),
            'offer': {
                'id': offer['id'],
                'title': offer['title'],
                'code': offer['code'],
                'discount_type': offer['discount_type']
            },
            'message': f"Offer applied successfully! You saved ₹{round(discount_amount, 2)}"
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@offer_bp.route('', methods=['POST'])
def create_offer():
    """Create a new offer (admin only)"""
    try:
        data = request.json
        
        query = """
            INSERT INTO offers (title, description, code, discount_type, discount_value,
                              min_order_value, max_discount_amount, image_url, status,
                              start_date, end_date, usage_limit, offer_type, applicable_categories)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """
        
        result = db.execute_query(query, (
            data['title'],
            data.get('description', ''),
            data['code'].upper(),
            data['discount_type'],
            data['discount_value'],
            data.get('min_order_value', 0),
            data.get('max_discount_amount'),
            data.get('image_url', ''),
            data.get('status', 'active'),
            data['start_date'],
            data['end_date'],
            data.get('usage_limit', 1000),
            data.get('offer_type', 'general'),
            data.get('applicable_categories', 'all')
        ))
        
        return jsonify({'message': 'Offer created successfully', 'id': result[0]['id']}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@offer_bp.route('/<int:offer_id>', methods=['PUT'])
def update_offer(offer_id):
    """Update an existing offer (admin only)"""
    try:
        data = request.json
        
        query = """
            UPDATE offers
            SET title = %s, description = %s, code = %s, discount_type = %s,
                discount_value = %s, min_order_value = %s, max_discount_amount = %s,
                image_url = %s, status = %s, start_date = %s, end_date = %s,
                usage_limit = %s, offer_type = %s, applicable_categories = %s
            WHERE id = %s
        """
        
        db.execute_query(query, (
            data['title'],
            data.get('description', ''),
            data['code'].upper(),
            data['discount_type'],
            data['discount_value'],
            data.get('min_order_value', 0),
            data.get('max_discount_amount'),
            data.get('image_url', ''),
            data.get('status', 'active'),
            data['start_date'],
            data['end_date'],
            data.get('usage_limit', 1000),
            data.get('offer_type', 'general'),
            data.get('applicable_categories', 'all'),
            offer_id
        ))
        
        return jsonify({'message': 'Offer updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@offer_bp.route('/<int:offer_id>', methods=['DELETE'])
def delete_offer(offer_id):
    """Delete an offer (admin only)"""
    try:
        query = "DELETE FROM offers WHERE id = %s"
        db.execute_query(query, (offer_id,))
        return jsonify({'message': 'Offer deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@offer_bp.route('/<int:offer_id>/increment', methods=['POST'])
def increment_usage(offer_id):
    """Increment the usage count of an offer"""
    try:
        query = """
            UPDATE offers
            SET used_count = used_count + 1
            WHERE id = %s
            RETURNING used_count
        """
        result = db.execute_query(query, (offer_id,), fetch=True)
        return jsonify({'used_count': result[0]['used_count']}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
