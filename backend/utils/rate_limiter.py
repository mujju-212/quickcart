"""
Rate Limiter for QuickCart
Implements database-backed rate limiting to prevent abuse
- 20 OTP requests per day per phone number
- 3 OTP verification attempts per OTP
- General API rate limiting
"""
from datetime import datetime, timedelta
from utils.database import db
from flask import request
import logging

logger = logging.getLogger(__name__)

class RateLimiter:
    """Database-backed rate limiter"""
    
    @staticmethod
    def init_rate_limit_tables():
        """Initialize rate limiting tables in database"""
        try:
            # OTP rate limiting table
            otp_rate_limit_table = """
                CREATE TABLE IF NOT EXISTS otp_rate_limits (
                    id SERIAL PRIMARY KEY,
                    phone VARCHAR(15) NOT NULL,
                    request_count INTEGER DEFAULT 1,
                    last_request TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    reset_date DATE DEFAULT CURRENT_DATE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                
                CREATE INDEX IF NOT EXISTS idx_phone_date 
                ON otp_rate_limits (phone, reset_date);
            """
            
            # API rate limiting table
            api_rate_limit_table = """
                CREATE TABLE IF NOT EXISTS api_rate_limits (
                    id SERIAL PRIMARY KEY,
                    ip_address VARCHAR(50) NOT NULL,
                    endpoint VARCHAR(255) NOT NULL,
                    request_count INTEGER DEFAULT 1,
                    window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                
                CREATE INDEX IF NOT EXISTS idx_ip_endpoint 
                ON api_rate_limits (ip_address, endpoint, window_start);
            """
            
            db.execute_query(otp_rate_limit_table)
            db.execute_query(api_rate_limit_table)
            logger.info("✅ Rate limit tables initialized")
            
        except Exception as e:
            logger.error(f"❌ Error initializing rate limit tables: {e}")
    
    @staticmethod
    def check_otp_rate_limit(phone_number, max_requests=20):
        """
        Check if phone number has exceeded daily OTP limit
        Returns: (allowed: bool, remaining: int, reset_time: datetime)
        """
        try:
            today = datetime.now().date()
            
            # Get or create rate limit record for today
            query = """
                SELECT * FROM otp_rate_limits 
                WHERE phone = %s AND reset_date = %s
            """
            record = db.execute_query_one(query, (phone_number, today))
            
            if not record:
                # First request today - create record
                insert_query = """
                    INSERT INTO otp_rate_limits (phone, request_count, reset_date)
                    VALUES (%s, 1, %s)
                    RETURNING *
                """
                db.execute_query(insert_query, (phone_number, today))
                
                reset_time = datetime.combine(today + timedelta(days=1), datetime.min.time())
                return True, max_requests - 1, reset_time
            
            # Check if limit exceeded
            if record['request_count'] >= max_requests:
                reset_time = datetime.combine(today + timedelta(days=1), datetime.min.time())
                return False, 0, reset_time
            
            # Increment counter
            update_query = """
                UPDATE otp_rate_limits 
                SET request_count = request_count + 1,
                    last_request = CURRENT_TIMESTAMP
                WHERE phone = %s AND reset_date = %s
            """
            db.execute_query(update_query, (phone_number, today))
            
            remaining = max_requests - (record['request_count'] + 1)
            reset_time = datetime.combine(today + timedelta(days=1), datetime.min.time())
            
            return True, remaining, reset_time
            
        except Exception as e:
            logger.error(f"Rate limit check error: {e}")
            # On error, allow request but log it
            return True, max_requests, datetime.now() + timedelta(days=1)
    
    @staticmethod
    def check_api_rate_limit(ip_address, endpoint, max_requests=100, window_minutes=60):
        """
        Check API rate limit for IP and endpoint
        Returns: (allowed: bool, remaining: int, reset_time: datetime)
        """
        try:
            window_start = datetime.now() - timedelta(minutes=window_minutes)
            
            # Clean up old records
            cleanup_query = """
                DELETE FROM api_rate_limits 
                WHERE window_start < %s
            """
            db.execute_query(cleanup_query, (window_start,))
            
            # Get current window records
            query = """
                SELECT SUM(request_count) as total_requests
                FROM api_rate_limits 
                WHERE ip_address = %s 
                AND endpoint = %s 
                AND window_start >= %s
            """
            result = db.execute_query_one(query, (ip_address, endpoint, window_start))
            
            current_count = int(result['total_requests'] or 0)
            
            if current_count >= max_requests:
                reset_time = datetime.now() + timedelta(minutes=window_minutes)
                return False, 0, reset_time
            
            # Record this request
            insert_query = """
                INSERT INTO api_rate_limits (ip_address, endpoint, request_count, window_start)
                VALUES (%s, %s, 1, CURRENT_TIMESTAMP)
            """
            db.execute_query(insert_query, (ip_address, endpoint))
            
            remaining = max_requests - (current_count + 1)
            reset_time = datetime.now() + timedelta(minutes=window_minutes)
            
            return True, remaining, reset_time
            
        except Exception as e:
            logger.error(f"API rate limit check error: {e}")
            return True, max_requests, datetime.now() + timedelta(hours=1)
    
    @staticmethod
    def get_client_ip():
        """Get client IP address from request"""
        if request.headers.get('X-Forwarded-For'):
            return request.headers.get('X-Forwarded-For').split(',')[0]
        elif request.headers.get('X-Real-IP'):
            return request.headers.get('X-Real-IP')
        else:
            return request.remote_addr or 'unknown'
    
    @staticmethod
    def reset_daily_limits():
        """Reset daily OTP limits - run as cron job"""
        try:
            yesterday = datetime.now().date() - timedelta(days=1)
            delete_query = "DELETE FROM otp_rate_limits WHERE reset_date < %s"
            db.execute_query(delete_query, (yesterday,))
            logger.info("✅ Daily OTP limits reset")
        except Exception as e:
            logger.error(f"❌ Error resetting daily limits: {e}")

# Initialize tables on module load
try:
    RateLimiter.init_rate_limit_tables()
except Exception as e:
    logger.error(f"Failed to initialize rate limiter: {e}")
