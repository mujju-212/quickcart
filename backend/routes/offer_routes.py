"""
Offer Routes - Handles promotional offers and discount codes
"""

from flask import Blueprint, request, jsonify
from datetime import datetime, date
from backend.utils.database import db
from backend.utils.auth_middleware import admin_required
from backend.utils.response_cache import response_cache

offer_bp = Blueprint('offers', __name__)


def _has_applicable_products_column():
    """Return True when offers.applicable_products exists in the current database."""
    try:
        row = db.execute_query_one(
            """
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_schema = 'public'
                  AND table_name = 'offers'
                  AND column_name = 'applicable_products'
            ) AS exists
            """
        )
        return bool(row and row.get('exists'))
    except Exception:
        # Fail closed to the legacy schema path.
        return False

@offer_bp.route('', methods=['GET'])
def get_all_offers():
    """Get all offers (admin only)"""
    try:
        has_applicable_products = _has_applicable_products_column()
        select_applicable_products = ", applicable_products" if has_applicable_products else ""

        query = f"""
            SELECT id, title, description, code, discount_type, discount_value,
                   min_order_value, max_discount_amount, image_url, status,
                   start_date, end_date, usage_limit, used_count,
                   applicable_categories{select_applicable_products}, offer_type, created_at
            FROM offers
            ORDER BY created_at DESC
        """
        offers = db.execute_query(query, fetch=True)
        
        # Convert date objects to strings
        for offer in offers:
            if not has_applicable_products:
                offer['applicable_products'] = 'all'
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
        cache_key = "offers:active:v1"
        def build_payload():
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

            return offers

        offers = response_cache.get_or_set(cache_key, build_payload, ttl_seconds=45)
        return jsonify(offers), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@offer_bp.route('/<int:offer_id>', methods=['GET'])
def get_offer(offer_id):
    """Get a specific offer by ID"""
    try:
        has_applicable_products = _has_applicable_products_column()
        select_applicable_products = ", applicable_products" if has_applicable_products else ""

        query = f"""
            SELECT id, title, description, code, discount_type, discount_value,
                   min_order_value, max_discount_amount, image_url, status,
                   start_date, end_date, usage_limit, used_count,
                   applicable_categories{select_applicable_products}, offer_type, created_at
            FROM offers
            WHERE id = %s
        """
        offers = db.execute_query(query, (offer_id,), fetch=True)
        
        if not offers:
            return jsonify({'error': 'Offer not found'}), 404
        
        offer = offers[0]
        if not has_applicable_products:
            offer['applicable_products'] = 'all'
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
                'discount_type': offer['discount_type'],
                'discount_value': float(offer['discount_value']),
                'min_order_value': float(offer['min_order_value']),
                'max_discount_amount': float(offer['max_discount_amount']) if offer['max_discount_amount'] else None,
                'start_date': offer['start_date'].isoformat(),
                'end_date': offer['end_date'].isoformat()
            },
            'message': f"Offer applied successfully! You saved ₹{round(discount_amount, 2)}"
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@offer_bp.route('', methods=['POST'])
@admin_required
def create_offer(current_user):
    """Create a new offer (admin only)"""
    try:
        data = request.json

        has_applicable_products = _has_applicable_products_column()

        if has_applicable_products:
            query = """
                INSERT INTO offers (title, description, code, discount_type, discount_value,
                                  min_order_value, max_discount_amount, image_url, status,
                                  start_date, end_date, usage_limit, offer_type,
                                  applicable_categories, applicable_products)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """

            params = (
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
                data.get('applicable_products', 'all')
            )
        else:
            query = """
                INSERT INTO offers (title, description, code, discount_type, discount_value,
                                  min_order_value, max_discount_amount, image_url, status,
                                  start_date, end_date, usage_limit, offer_type,
                                  applicable_categories)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """

            params = (
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
            )

        result = db.execute_query(query, params, fetch=True)

        response_cache.invalidate("offers:")
        
        return jsonify({'message': 'Offer created successfully', 'id': result[0]['id']}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@offer_bp.route('/<int:offer_id>', methods=['PUT'])
@admin_required
def update_offer(current_user, offer_id):
    """Update an existing offer (admin only)"""
    try:
        data = request.json

        has_applicable_products = _has_applicable_products_column()

        if has_applicable_products:
            query = """
                UPDATE offers
                SET title = %s, description = %s, code = %s, discount_type = %s,
                    discount_value = %s, min_order_value = %s, max_discount_amount = %s,
                    image_url = %s, status = %s, start_date = %s, end_date = %s,
                    usage_limit = %s, offer_type = %s, applicable_categories = %s,
                    applicable_products = %s
                WHERE id = %s
            """

            params = (
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
                data.get('applicable_products', 'all'),
                offer_id
            )
        else:
            query = """
                UPDATE offers
                SET title = %s, description = %s, code = %s, discount_type = %s,
                    discount_value = %s, min_order_value = %s, max_discount_amount = %s,
                    image_url = %s, status = %s, start_date = %s, end_date = %s,
                    usage_limit = %s, offer_type = %s, applicable_categories = %s
                WHERE id = %s
            """

            params = (
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
            )

        db.execute_query(query, params)

        response_cache.invalidate("offers:")
        
        return jsonify({'message': 'Offer updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@offer_bp.route('/<int:offer_id>', methods=['DELETE'])
@admin_required
def delete_offer(current_user, offer_id):
    """Delete an offer (admin only)"""
    try:
        query = "DELETE FROM offers WHERE id = %s"
        db.execute_query(query, (offer_id,))
        response_cache.invalidate("offers:")
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
        response_cache.invalidate("offers:")
        return jsonify({'used_count': result[0]['used_count']}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
