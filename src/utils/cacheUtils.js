// Cache utility for better performance
// Reduces API calls by caching responses

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map();

export const cacheUtils = {
  /**
   * Get data from cache or fetch if not available/expired
   * @param {string} key - Cache key
   * @param {Function} fetchFn - Function to fetch data if cache miss
   * @param {number} duration - Cache duration in milliseconds (default: 5 min)
   */
  async getOrFetch(key, fetchFn, duration = CACHE_DURATION) {
    const cached = cache.get(key);
    const now = Date.now();

    // Return cached data if valid
    if (cached && (now - cached.timestamp) < duration) {
      console.log(`Cache hit: ${key}`);
      return cached.data;
    }

    // Fetch fresh data
    console.log(`Cache miss: ${key}, fetching...`);
    try {
      const data = await fetchFn();
      cache.set(key, {
        data,
        timestamp: now
      });
      return data;
    } catch (error) {
      // Return stale cache if fetch fails
      if (cached) {
        console.log(`Fetch failed, returning stale cache: ${key}`);
        return cached.data;
      }
      throw error;
    }
  },

  /**
   * Invalidate specific cache key
   */
  invalidate(key) {
    cache.delete(key);
    console.log(`Cache invalidated: ${key}`);
  },

  /**
   * Invalidate cache keys matching pattern
   */
  invalidatePattern(pattern) {
    const keys = Array.from(cache.keys());
    keys.forEach(key => {
      if (key.includes(pattern)) {
        cache.delete(key);
        console.log(`Cache invalidated: ${key}`);
      }
    });
  },

  /**
   * Clear all cache
   */
  clear() {
    cache.clear();
    console.log('All cache cleared');
  },

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: cache.size,
      keys: Array.from(cache.keys())
    };
  }
};

export default cacheUtils;
