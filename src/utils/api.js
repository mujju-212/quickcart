// src/utils/api.js
import Cookies from 'js-cookie';

/**
 * 🔒 SECURITY: Get Authorization headers with JWT token
 * @returns {Object} Headers object with Authorization token if available
 */
export const getAuthHeaders = () => {
  // Try cookie first (preferred), then localStorage as fallback
  const token = Cookies.get('auth_token') || 
                localStorage.getItem('token') || 
                localStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * 🔒 SECURITY: Fetch wrapper with automatic JWT token injection
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Promise} Fetch promise
 */
export const secureFetch = async (url, options = {}) => {
  const authHeaders = getAuthHeaders();
  
  const config = {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, config);
    
    // 🔒 Handle unauthorized responses
    if (response.status === 401) {
      // Token expired or invalid - clear auth data from BOTH locations
      Cookies.remove('auth_token');
      Cookies.remove('quickcart_user');
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * 🔒 SECURITY: GET request with authentication
 */
export const secureGet = async (url) => {
  return secureFetch(url, { method: 'GET' });
};

/**
 * 🔒 SECURITY: POST request with authentication
 */
export const securePost = async (url, data) => {
  return secureFetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * 🔒 SECURITY: PUT request with authentication
 */
export const securePut = async (url, data) => {
  return secureFetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * 🔒 SECURITY: DELETE request with authentication
 */
export const secureDelete = async (url) => {
  return secureFetch(url, { method: 'DELETE' });
};

export default {
  getAuthHeaders,
  secureFetch,
  secureGet,
  securePost,
  securePut,
  secureDelete,
};
