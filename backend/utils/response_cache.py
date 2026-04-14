import copy
import threading
import time


class ResponseCache:
    """Simple in-memory TTL cache for API response payloads."""

    def __init__(self, max_items=1000):
        self.max_items = max_items
        self._data = {}
        self._lock = threading.Lock()
        self._key_locks = {}

    def _purge_expired(self, now):
        expired = [k for k, v in self._data.items() if v['expires_at'] <= now]
        for key in expired:
            self._data.pop(key, None)

    def get(self, key):
        now = time.time()
        with self._lock:
            self._purge_expired(now)
            item = self._data.get(key)
            if not item:
                return None
            return copy.deepcopy(item['value'])

    def set(self, key, value, ttl_seconds=30):
        now = time.time()
        with self._lock:
            self._purge_expired(now)

            if len(self._data) >= self.max_items:
                oldest_key = min(self._data, key=lambda k: self._data[k]['created_at'])
                self._data.pop(oldest_key, None)

            self._data[key] = {
                'value': copy.deepcopy(value),
                'created_at': now,
                'expires_at': now + ttl_seconds,
            }

    def _get_key_lock(self, key):
        with self._lock:
            lock = self._key_locks.get(key)
            if lock is None:
                lock = threading.Lock()
                self._key_locks[key] = lock
            return lock

    def get_or_set(self, key, producer, ttl_seconds=30):
        cached = self.get(key)
        if cached is not None:
            return cached

        key_lock = self._get_key_lock(key)
        with key_lock:
            cached = self.get(key)
            if cached is not None:
                return cached

            value = producer()
            self.set(key, value, ttl_seconds=ttl_seconds)
            return copy.deepcopy(value)

    def invalidate(self, prefix=None):
        with self._lock:
            if prefix is None:
                self._data.clear()
                return

            keys = [k for k in self._data.keys() if k.startswith(prefix)]
            for key in keys:
                self._data.pop(key, None)


response_cache = ResponseCache()
