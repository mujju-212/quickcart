const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class WishlistService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async makeRequest(endpoint, options = {}) {
    try {
      const defaultHeaders = {
        'Content-Type': 'application/json'
      };

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Wishlist API request failed:', error);
      throw error;
    }
  }

  async getWishlist(phone) {
    try {
      const response = await this.makeRequest(`/wishlist?phone=${phone}`);
      return response;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return { success: false, wishlist: [] };
    }
  }

  async addToWishlist(phone, productId) {
    try {
      const response = await this.makeRequest('/wishlist/add', {
        method: 'POST',
        body: JSON.stringify({ phone, product_id: productId })
      });
      return response;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  }

  async removeFromWishlist(phone, productId) {
    try {
      const response = await this.makeRequest('/wishlist/remove', {
        method: 'DELETE',
        body: JSON.stringify({ phone, product_id: productId })
      });
      return response;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  }

  async clearWishlist(phone) {
    try {
      const response = await this.makeRequest('/wishlist/clear', {
        method: 'DELETE',
        body: JSON.stringify({ phone })
      });
      return response;
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      throw error;
    }
  }

  async checkInWishlist(phone, productId) {
    try {
      const response = await this.makeRequest(`/wishlist/check/${productId}?phone=${phone}`);
      return response;
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return { success: false, in_wishlist: false };
    }
  }
}

export const wishlistService = new WishlistService();
export default wishlistService;