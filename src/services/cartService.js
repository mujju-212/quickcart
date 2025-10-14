const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class CartService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async makeRequest(endpoint, options = {}) {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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
      console.error('Cart API request failed:', error);
      throw error;
    }
  }

  async getCart() {
    try {
      const response = await this.makeRequest('/cart');
      return response.cart || [];
    } catch (error) {
      console.error('Error fetching cart:', error);
      return [];
    }
  }

  async addToCart(productId, quantity = 1) {
    try {
      const response = await this.makeRequest('/cart/add', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, quantity })
      });
      return response.cart || [];
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  async removeFromCart(productId) {
    try {
      const response = await this.makeRequest(`/cart/remove/${productId}`, {
        method: 'DELETE'
      });
      return response.cart || [];
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  async updateQuantity(productId, quantity) {
    try {
      const response = await this.makeRequest('/cart/update', {
        method: 'PUT',
        body: JSON.stringify({ product_id: productId, quantity })
      });
      return response.cart || [];
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      throw error;
    }
  }

  async clearCart() {
    try {
      const response = await this.makeRequest('/cart/clear', {
        method: 'DELETE'
      });
      return response.cart || [];
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  async getCartTotal() {
    try {
      const response = await this.makeRequest('/cart/total');
      return response.total || 0;
    } catch (error) {
      console.error('Error getting cart total:', error);
      const cart = await this.getCart();
      return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
  }

  async getCartItemsCount() {
    try {
      const cart = await this.getCart();
      return cart.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error('Error getting cart items count:', error);
      return 0;
    }
  }
}

export default new CartService();