/**
 * Analytics Service
 * Handles all admin dashboard analytics API calls
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

/**
 * Get authentication headers with JWT token
 */
const getAuthHeaders = () => {
  // Get token from localStorage (most reliable)
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  
  if (!token) {
    console.warn('⚠️ No authentication token found');
  }
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * Get comprehensive dashboard statistics
 * Returns: totals, orders by status, recent orders, top products, category sales, revenue trend
 */
export const getDashboardStats = async () => {
  try {
    console.log('📊 Fetching dashboard stats from:', `${API_BASE_URL}/analytics/dashboard-stats`);
    const headers = getAuthHeaders();
    console.log('📤 Request headers:', headers);
    
    const response = await fetch(`${API_BASE_URL}/analytics/dashboard-stats`, {
      method: 'GET',
      headers: headers,
      credentials: 'include'
    });

    console.log('📥 Response status:', response.status, response.statusText);
    const data = await response.json();
    console.log('📦 Response data:', data);
    
    if (!response.ok) {
      console.error('❌ Response not OK:', data);
      throw new Error(data.message || 'Failed to fetch dashboard statistics');
    }

    console.log('✅ Dashboard stats fetched successfully');
    return {
      success: true,
      data: data.data
    };
  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch dashboard statistics',
      data: null
    };
  }
};

/**
 * Get revenue chart data for specified period
 * @param {string} period - '7d', '30d', '90d', '1y'
 */
export const getRevenueChartData = async (period = '7d') => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/analytics/revenue-chart?period=${period}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch revenue chart data');
    }

    return {
      success: true,
      data: data.data
    };
  } catch (error) {
    console.error('Error fetching revenue chart data:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch revenue chart data',
      data: []
    };
  }
};

/**
 * Get detailed product performance metrics
 */
export const getProductPerformance = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/product-performance`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include'
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch product performance');
    }

    return {
      success: true,
      data: data.data
    };
  } catch (error) {
    console.error('Error fetching product performance:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch product performance',
      data: []
    };
  }
};

/**
 * Get category performance metrics
 */
export const getCategoryPerformance = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/category-performance`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include'
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch category performance');
    }

    return {
      success: true,
      data: data.data
    };
  } catch (error) {
    console.error('Error fetching category performance:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch category performance',
      data: []
    };
  }
};

/**
 * Get real-time performance metrics
 */
export const getPerformanceMetrics = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/performance-metrics`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include'
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch performance metrics');
    }

    return {
      success: true,
      data: data.data
    };
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch performance metrics',
      data: null
    };
  }
};

const analyticsService = {
  getDashboardStats,
  getRevenueChartData,
  getProductPerformance,
  getCategoryPerformance,
  getPerformanceMetrics
};

export default analyticsService;
