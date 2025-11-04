import { useEffect, useRef } from 'react';

/**
 * Custom hook for auto-refreshing data every specified interval
 * @param {Function} callback - Function to call on each refresh
 * @param {number} interval - Refresh interval in milliseconds (default: 20000ms = 20s)
 * @param {boolean} enabled - Whether auto-refresh is enabled (default: true)
 */
const useAutoRefresh = (callback, interval = 20000, enabled = true) => {
  const savedCallback = useRef();

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };

    const id = setInterval(tick, interval);
    console.log(`🔄 Auto-refresh enabled (every ${interval / 1000}s)`);

    return () => {
      clearInterval(id);
      console.log('🔄 Auto-refresh disabled');
    };
  }, [interval, enabled]);
};

export default useAutoRefresh;
