"""
Input Validation and Sanitization for QuickCart
Prevents XSS, SQL Injection, and other injection attacks
"""
import re
import bleach
from email_validator import validate_email, EmailNotValidError
import phonenumbers
from phonenumbers import NumberParseException

class InputValidator:
    """Input validation and sanitization utilities"""
    
    # Allowed HTML tags for rich text (if needed)
    ALLOWED_TAGS = []
    ALLOWED_ATTRIBUTES = {}
    
    @staticmethod
    def sanitize_string(text, max_length=1000):
        """
        Sanitize text input to prevent XSS
        - Removes HTML tags
        - Limits length
        - Escapes special characters
        """
        if not text:
            return ""
        
        # Convert to string
        text = str(text)
        
        # Remove HTML tags
        text = bleach.clean(
            text,
            tags=InputValidator.ALLOWED_TAGS,
            attributes=InputValidator.ALLOWED_ATTRIBUTES,
            strip=True
        )
        
        # Limit length
        text = text[:max_length]
        
        # Remove null bytes
        text = text.replace('\x00', '')
        
        return text.strip()
    
    @staticmethod
    def validate_phone(phone):
        """
        Validate phone number format
        Returns: (is_valid: bool, formatted_phone: str, error: str)
        """
        try:
            # Remove spaces and special characters
            phone = re.sub(r'[^\d+]', '', str(phone))
            
            # Indian phone number validation
            if phone.startswith('+91'):
                phone = phone[3:]
            elif phone.startswith('91') and len(phone) == 12:
                phone = phone[2:]
            
            # Must be exactly 10 digits
            if not re.match(r'^\d{10}$', phone):
                return False, None, "Phone number must be 10 digits"
            
            # First digit should be 6-9
            if phone[0] not in '6789':
                return False, None, "Invalid phone number format"
            
            # Try parsing with phonenumbers library
            try:
                parsed = phonenumbers.parse('+91' + phone, None)
                if phonenumbers.is_valid_number(parsed):
                    return True, phone, None
            except NumberParseException:
                pass
            
            # If library fails, use our validation
            return True, phone, None
            
        except Exception as e:
            return False, None, str(e)
    
    @staticmethod
    def validate_email(email):
        """
        Validate email format
        Returns: (is_valid: bool, normalized_email: str, error: str)
        """
        try:
            if not email:
                return False, None, "Email is required"
            
            # Validate using email-validator library
            validated = validate_email(email, check_deliverability=False)
            return True, validated.email, None
            
        except EmailNotValidError as e:
            return False, None, str(e)
        except Exception as e:
            return False, None, "Invalid email format"
    
    @staticmethod
    def validate_name(name, min_length=2, max_length=100):
        """
        Validate name input
        Returns: (is_valid: bool, sanitized_name: str, error: str)
        """
        try:
            if not name:
                return False, None, "Name is required"
            
            # Sanitize
            name = InputValidator.sanitize_string(name, max_length)
            
            # Check length
            if len(name) < min_length:
                return False, None, f"Name must be at least {min_length} characters"
            
            # Only letters, spaces, and basic punctuation
            if not re.match(r'^[a-zA-Z\s\.\-\']+$', name):
                return False, None, "Name contains invalid characters"
            
            return True, name, None
            
        except Exception as e:
            return False, None, str(e)
    
    @staticmethod
    def validate_pincode(pincode):
        """
        Validate Indian pincode
        Returns: (is_valid: bool, pincode: str, error: str)
        """
        try:
            # Remove spaces
            pincode = str(pincode).replace(' ', '')
            
            # Must be exactly 6 digits
            if not re.match(r'^\d{6}$', pincode):
                return False, None, "Pincode must be 6 digits"
            
            # First digit should not be 0
            if pincode[0] == '0':
                return False, None, "Invalid pincode format"
            
            return True, pincode, None
            
        except Exception as e:
            return False, None, str(e)
    
    @staticmethod
    def validate_price(price):
        """
        Validate price/amount
        Returns: (is_valid: bool, price: float, error: str)
        """
        try:
            price = float(price)
            
            if price < 0:
                return False, None, "Price cannot be negative"
            
            if price > 1000000:  # Max 10 lakh
                return False, None, "Price exceeds maximum limit"
            
            # Round to 2 decimal places
            price = round(price, 2)
            
            return True, price, None
            
        except (ValueError, TypeError):
            return False, None, "Invalid price format"
    
    @staticmethod
    def validate_quantity(quantity):
        """
        Validate quantity
        Returns: (is_valid: bool, quantity: int, error: str)
        """
        try:
            quantity = int(quantity)
            
            if quantity < 1:
                return False, None, "Quantity must be at least 1"
            
            if quantity > 100:  # Max 100 items
                return False, None, "Quantity exceeds maximum limit"
            
            return True, quantity, None
            
        except (ValueError, TypeError):
            return False, None, "Invalid quantity format"
    
    @staticmethod
    def validate_address(address_data):
        """
        Validate complete address object
        Returns: (is_valid: bool, sanitized_data: dict, errors: dict)
        """
        errors = {}
        sanitized = {}
        
        # Name
        is_valid, name, error = InputValidator.validate_name(address_data.get('name', ''))
        if not is_valid:
            errors['name'] = error
        else:
            sanitized['name'] = name
        
        # Phone
        is_valid, phone, error = InputValidator.validate_phone(address_data.get('phone', ''))
        if not is_valid:
            errors['phone'] = error
        else:
            sanitized['phone'] = phone
        
        # House/Building
        house = InputValidator.sanitize_string(address_data.get('house', ''), 200)
        if not house or len(house) < 2:
            errors['house'] = "House/Building details required"
        else:
            sanitized['house'] = house
        
        # Area/Street
        area = InputValidator.sanitize_string(address_data.get('area', ''), 200)
        if not area or len(area) < 2:
            errors['area'] = "Area/Street details required"
        else:
            sanitized['area'] = area
        
        # City
        city = InputValidator.sanitize_string(address_data.get('city', ''), 100)
        if not city or len(city) < 2:
            errors['city'] = "City is required"
        else:
            sanitized['city'] = city
        
        # Pincode
        is_valid, pincode, error = InputValidator.validate_pincode(address_data.get('pincode', ''))
        if not is_valid:
            errors['pincode'] = error
        else:
            sanitized['pincode'] = pincode
        
        # Type
        address_type = address_data.get('type', 'home')
        if address_type not in ['home', 'work', 'other']:
            address_type = 'home'
        sanitized['type'] = address_type
        
        is_valid = len(errors) == 0
        return is_valid, sanitized, errors
    
    @staticmethod
    def validate_order_data(order_data):
        """
        Validate order creation data
        Returns: (is_valid: bool, errors: dict)
        """
        errors = {}
        
        # Items
        if not order_data.get('items') or len(order_data['items']) == 0:
            errors['items'] = "Order must contain at least one item"
        
        # Total amount
        is_valid, total, error = InputValidator.validate_price(order_data.get('total', 0))
        if not is_valid:
            errors['total'] = error
        elif total <= 0:
            errors['total'] = "Order total must be greater than 0"
        
        # Payment method
        payment = order_data.get('payment_method', '')
        if payment not in ['cod', 'upi', 'card', 'netbanking']:
            errors['payment_method'] = "Invalid payment method"
        
        return len(errors) == 0, errors
