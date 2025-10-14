import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
from config.config import Config
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Database:
    """Database connection and operations handler"""
    
    def __init__(self):
        self.connection_string = Config.DATABASE_URL
        
    @contextmanager
    def get_connection(self):
        """Get database connection with context manager"""
        conn = None
        try:
            conn = psycopg2.connect(
                self.connection_string,
                cursor_factory=RealDictCursor
            )
            yield conn
        except Exception as e:
            if conn:
                conn.rollback()
            logger.error(f"Database error: {e}")
            raise
        finally:
            if conn:
                conn.close()
    
    @contextmanager
    def get_cursor(self):
        """Get database cursor with connection"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            try:
                yield cursor
                conn.commit()
            except Exception as e:
                conn.rollback()
                logger.error(f"Database transaction error: {e}")
                raise
            finally:
                cursor.close()
    
    def execute_query(self, query, params=None, fetch=False):
        """Execute a database query"""
        try:
            with self.get_cursor() as cursor:
                cursor.execute(query, params)
                if fetch:
                    if 'returning' in query.lower() or query.strip().lower().startswith('select'):
                        return cursor.fetchall()
                    return cursor.rowcount
                return cursor.rowcount
        except Exception as e:
            logger.error(f"Query execution error: {e}")
            raise
    
    def execute_query_one(self, query, params=None):
        """Execute query and fetch one result"""
        try:
            with self.get_cursor() as cursor:
                cursor.execute(query, params)
                return cursor.fetchone()
        except Exception as e:
            logger.error(f"Query execution error: {e}")
            raise
    
    def test_connection(self):
        """Test database connection"""
        try:
            with self.get_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute("SELECT 1")
                    return True
        except Exception as e:
            logger.error(f"Database connection test failed: {e}")
            return False

# Global database instance
db = Database()