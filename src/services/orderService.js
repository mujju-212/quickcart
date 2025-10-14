const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class OrderService {
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
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Order API request failed:', error);
      throw error;
    }
  }

  async getAllOrders() {
    try {
      const response = await this.makeRequest('/orders');
      return response.orders || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  async getOrderById(id) {
    try {
      const response = await this.makeRequest(`/orders/${id}`);
      return response.order;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  }

  async getUserOrders(phone) {
    try {
      const response = await this.makeRequest(`/orders?phone=${phone}`);
      return response.orders || [];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  }

  async createOrder(orderData) {
    try {
      const response = await this.makeRequest('/orders/create', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
      return response.order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId, newStatus, notes = '') {
    try {
      const response = await this.makeRequest(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus, notes })
      });
      return response.order;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  async cancelOrder(orderId) {
    try {
      const response = await this.makeRequest(`/orders/${orderId}/cancel`, {
        method: 'PUT'
      });
      return response.order;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }

  async getOrderStats() {
    try {
      const response = await this.makeRequest('/orders/stats');
      return response.stats || {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        deliveredOrders: 0
      };
    } catch (error) {
      console.error('Error fetching order stats:', error);
      return {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        deliveredOrders: 0
      };
    }
  }
}

export default new OrderService();