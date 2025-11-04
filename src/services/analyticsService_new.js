/**
 * Analytics Service - Redesigned
 * Frontend API service for admin dashboard analytics
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

/**
 * Get authentication headers with JWT token
 * Checks both 'token' and 'auth_token' cookies
 */
const getAuthHeaders = () => {
  // Extract token from cookies
  const cookies = document.cookie.split('; ');
  const tokenCookie = cookies.find(row => 
    row.startsWith('token=') || row.startsWith('auth_token=')
  );
  const token = tokenCookie ? tokenCookie.split('=')[1] : null;
  
  console.log('🔐 [Analytics] Token status:', token ? 'Found ✅' : 'Not found ❌');
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('🔐 [Analytics] Authorization header added');
  }
  
  return headers;
};

/**
 * Make authenticated API request
 */
const fetchWithAuth = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log(`📡 [Analytics] Request: ${options.method || 'GET'} ${url}`);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    },
    credentials: 'include' // Include cookies
  });
  
  console.log(`📡 [Analytics] Response: ${response.status} ${response.statusText}`);
  
  const data = await response.json();
  
  if (!response.ok) {
    console.error('❌ [Analytics] Error response:', data);
    throw new Error(data.error || data.message || `HTTP ${response.status}`);
  }
  
  console.log('✅ [Analytics] Success:', data.success);
  return data;
};

/**
 * Test analytics service health
 */
export const testAnalyticsHealth = async () => {
  try {
    console.log('🏥 [Analytics] Testing health endpoint...');
    const data = await fetchWithAuth('/analytics/health');
    console.log('✅ [Analytics] Health check passed:', data);
    return data;
  } catch (error) {
    console.error('❌ [Analytics] Health check failed:', error);
    throw error;
  }
};

/**
 * Get comprehensive dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    console.log('📊 [Analytics] Fetching dashboard stats...');
    const data = await fetchWithAuth('/analytics/dashboard-stats');
    console.log('✅ [Analytics] Dashboard stats received');
    return data.data; // Return the data object
  } catch (error) {
    console.error('❌ [Analytics] Failed to fetch dashboard stats:', error);
    throw error;
  }
};

/**
 * Get revenue chart data
 * @param {string} period - Time period: '7d', '30d', '90d', '1y'
 */
export const getRevenueChart = async (period = '30d') => {
  try {
    console.log(`📈 [Analytics] Fetching revenue chart (${period})...`);
    const data = await fetchWithAuth(`/analytics/revenue-chart?period=${period}`);
    console.log('✅ [Analytics] Revenue chart received');
    return data.data;
  } catch (error) {
    console.error('❌ [Analytics] Failed to fetch revenue chart:', error);
    throw error;
  }
};

/**
 * Get product performance metrics
 */
export const getProductPerformance = async () => {
  try {
    console.log('📦 [Analytics] Fetching product performance...');
    const data = await fetchWithAuth('/analytics/product-performance');
    console.log('✅ [Analytics] Product performance received');
    return data.data;
  } catch (error) {
    console.error('❌ [Analytics] Failed to fetch product performance:', error);
    throw error;
  }
};

/**
 * Debug function to check authentication status
 */
export const debugAuth = () => {
  console.log('🔍 [Analytics Debug] Checking authentication...');
  console.log('🔍 [Analytics Debug] All cookies:', document.cookie);
  console.log('🔍 [Analytics Debug] API Base URL:', API_BASE_URL);
  console.log('🔍 [Analytics Debug] Current headers:', getAuthHeaders());
};

export default {
  testAnalyticsHealth,
  getDashboardStats,
  getRevenueChart,
  getProductPerformance,
  debugAuth
};
