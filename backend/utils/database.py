import logging
import threading
from contextlib import contextmanager

import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2.pool import ThreadedConnectionPool

from config.config import Config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Database:
    """Database connection and operations handler"""
    
    def __init__(self):
        self.connection_string = Config.DATABASE_URL
        self.min_connections = Config.DB_POOL_MIN
        self.max_connections = Config.DB_POOL_MAX
        self.connect_timeout = Config.DB_CONNECT_TIMEOUT
        self._pool = None
        self._pool_lock = threading.Lock()

    def _init_pool(self):
        """Initialize connection pool lazily and thread-safely."""
        if self._pool is not None:
            return

        with self._pool_lock:
            if self._pool is not None:
                return

            self._pool = ThreadedConnectionPool(
                minconn=self.min_connections,
                maxconn=self.max_connections,
                dsn=self.connection_string,
                connect_timeout=self.connect_timeout,
                application_name='quickcart_api',
                keepalives=1,
                keepalives_idle=30,
                keepalives_interval=10,
                keepalives_count=5,
            )
            logger.info(
                "✅ Database pool initialized (min=%s, max=%s)",
                self.min_connections,
                self.max_connections,
            )

    def close_pool(self):
        """Close all pooled connections."""
        if self._pool is not None:
            self._pool.closeall()
            self._pool = None
            logger.info("✅ Database pool closed")
        
    @contextmanager
    def get_connection(self):
        """Get pooled database connection with context manager."""
        self._init_pool()

        conn = None
        try:
            conn = self._pool.getconn()
            # Reset any aborted transaction state from previous usage.
            conn.rollback()
            yield conn
        except Exception as e:
            if conn:
                conn.rollback()
            logger.error(f"Database error: {e}")
            raise
        finally:
            if conn:
                self._pool.putconn(conn)
    
    @contextmanager
    def get_cursor(self):
        """Get database cursor with connection"""
        with self.get_connection() as conn:
            cursor = conn.cursor(cursor_factory=RealDictCursor)
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