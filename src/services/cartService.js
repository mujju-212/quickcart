const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class CartService {
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
      console.error('Cart API request failed:', error);
      throw error;
    }
  }

  async getCart(phone) {
    try {
      const response = await this.makeRequest(`/cart?phone=${phone}`);
      return response;
    } catch (error) {
      console.error('Error fetching cart:', error);
      return { success: false, cart: [] };
    }
  }

  async addToCart(phone, productId, quantity = 1) {
    try {
      const response = await this.makeRequest('/cart/add', {
        method: 'POST',
        body: JSON.stringify({ phone, product_id: productId, quantity })
      });
      return response;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  async removeFromCart(phone, productId) {
    try {
      const response = await this.makeRequest('/cart/remove', {
        method: 'DELETE',
        body: JSON.stringify({ phone, product_id: productId })
      });
      return response;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  async updateQuantity(phone, productId, quantity) {
    try {
      const response = await this.makeRequest('/cart/update', {
        method: 'PUT',
        body: JSON.stringify({ phone, product_id: productId, quantity })
      });
      return response;
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      throw error;
    }
  }

  async clearCart(phone) {
    try {
      // Backend expects phone as query parameter for DELETE /cart/clear
      const response = await this.makeRequest(`/cart/clear?phone=${phone}`, {
        method: 'DELETE'
      });
      return response;
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