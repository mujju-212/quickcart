import { secureFetch } from '../utils/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class OrderService {
  constructor() {
    this.baseURL = API_BASE_URL;
    // Development mode flag - set to true to skip API calls entirely
    this.isDevelopmentMode = process.env.NODE_ENV === 'development' && 
                             process.env.REACT_APP_USE_MOCK_DATA !== 'false';
    this.backendAvailable = false; // Track if backend is available
    
    // Test backend connectivity in development mode
    if (this.isDevelopmentMode) {
      this.testConnection();
    }
  }

  async makeRequest(endpoint, options = {}) {
    try {
      // 🔒 SECURITY: Use secureFetch which automatically adds JWT token
      const response = await secureFetch(`${this.baseURL}${endpoint}`, options);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // Only log detailed errors in development, not network failures
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        console.warn('🔌 Backend API not available, using mock data');
      } else {
        console.error('Order API request failed:', error);
      }
      throw error;
    }
  }

  async getAllOrders() {
    // If in development mode and backend was previously unavailable, skip API call
    if (this.isDevelopmentMode && !this.backendAvailable) {
      console.log('🚀 Development mode: Using mock orders data');
      return this.getMockOrders();
    }

    try {
      const response = await this.makeRequest('/orders');
      this.backendAvailable = true; // Mark backend as available
      return response.orders || [];
    } catch (error) {
      this.backendAvailable = false; // Mark backend as unavailable
      if (this.isDevelopmentMode) {
        console.log('📦 Backend unavailable - switching to mock data for subsequent calls');
      }
      return this.getMockOrders();
    }
  }

  getMockOrders() {
    if (this.isDevelopmentMode && !this.backendAvailable) {
      console.log('🔧 Development Mode: Using mock order data (backend unavailable)');
    }
    return [
      {
        id: 'ORDER001',
        userId: 'user123',
        customer: 'John Doe',
        customerName: 'John Doe',
        phone: '+91 9876543210',
        email: 'john@example.com',
        address: {
          street: '123 Main Street',
          area: 'Downtown',
          city: 'Mumbai',
          pincode: '400001'
        },
        fullAddress: '123 Main Street, Downtown, Mumbai - 400001',
        paymentStatus: 'Completed',
        items: [
          {
            id: 1,
            name: 'Fresh Apples',
            price: 120,
            quantity: 2,
            image: '/placeholder-apple.jpg'
          },
          {
            id: 2,
            name: 'Bread',
            price: 30,
            quantity: 1,
            image: '/placeholder-bread.jpg'
          }
        ],
        total: 270,
        deliveryFee: 20,
        status: 'pending',
        date: new Date().toISOString(),
        paymentMethod: 'Cash on Delivery',
        deliveryTime: '30-40 mins',
        timeline: [
          {
            status: 'placed',
            time: new Date().toISOString(),
            message: 'Order placed successfully'
          }
        ]
      },
      {
        id: 'ORDER002',
        userId: 'user456',
        customer: 'Jane Smith',
        customerName: 'Jane Smith',
        phone: '+91 9876543211',
        email: 'jane@example.com',
        address: {
          street: '456 Oak Avenue',
          area: 'Suburb',
          city: 'Mumbai',
          pincode: '400002'
        },
        fullAddress: '456 Oak Avenue, Suburb, Mumbai - 400002',
        paymentStatus: 'Completed',
        items: [
          {
            id: 3,
            name: 'Milk',
            price: 50,
            quantity: 2,
            image: '/placeholder-milk.jpg'
          }
        ],
        total: 100,
        deliveryFee: 15,
        status: 'delivered',
        date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        paymentMethod: 'UPI',
        deliveryTime: '20-30 mins',
        timeline: [
          {
            status: 'placed',
            time: new Date(Date.now() - 86400000).toISOString(),
            message: 'Order placed successfully'
          },
          {
            status: 'delivered',
            time: new Date(Date.now() - 82800000).toISOString(), // 1 hour later
            message: 'Order delivered successfully'
          }
        ]
      },
      {
        id: 'ORDER003',
        userId: 'user789',
        customer: 'Bob Johnson',
        customerName: 'Bob Johnson',
        phone: '+91 9876543212',
        email: 'bob@example.com',
        address: {
          street: '789 Pine Road',
          area: 'City Center',
          city: 'Mumbai',
          pincode: '400003'
        },
        fullAddress: '789 Pine Road, City Center, Mumbai - 400003',
        paymentStatus: 'Pending',
        items: [
          {
            id: 4,
            name: 'Rice',
            price: 80,
            quantity: 1,
            image: '/placeholder-rice.jpg'
          },
          {
            id: 5,
            name: 'Dal',
            price: 60,
            quantity: 1,
            image: '/placeholder-dal.jpg'
          }
        ],
        total: 140,
        deliveryFee: 25,
        status: 'out_for_delivery',
        date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        paymentMethod: 'Credit Card',
        deliveryTime: '40-50 mins',
        timeline: [
          {
            status: 'placed',
            time: new Date(Date.now() - 3600000).toISOString(),
            message: 'Order placed successfully'
          },
          {
            status: 'confirmed',
            time: new Date(Date.now() - 3300000).toISOString(), // 5 mins later
            message: 'Order confirmed by store'
          },
          {
            status: 'out_for_delivery',
            time: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
            message: 'Order out for delivery'
          }
        ]
      }
    ];
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
    // Skip API call in development mode if backend unavailable
    if (this.isDevelopmentMode && !this.backendAvailable) {
      const mockOrders = this.getMockOrders();
      return mockOrders.filter(order => order.phone === phone);
    }

    try {
      const response = await this.makeRequest(`/orders?phone=${phone}`);
      this.backendAvailable = true;
      return response.orders || [];
    } catch (error) {
      this.backendAvailable = false;
      // Return filtered mock data for the specific user
      const mockOrders = this.getMockOrders();
      return mockOrders.filter(order => order.phone === phone);
    }
  }

  // Test backend connectivity
  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      this.backendAvailable = response.ok;
      return this.backendAvailable;
    } catch (error) {
      this.backendAvailable = false;
      return false;
    }
  }

  async createOrder(orderData) {
    // Skip API call in development mode if backend unavailable
    if (this.isDevelopmentMode && !this.backendAvailable) {
      // Return mock success response for development
      return {
        id: Date.now().toString(),
        ...orderData,
        status: 'pending',
        date: new Date().toISOString()
      };
    }

    try {
      const response = await this.makeRequest('/orders/create', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
      this.backendAvailable = true;
      return response.order;
    } catch (error) {
      this.backendAvailable = false;
      // Return mock success response for development
      return {
        id: Date.now().toString(),
        ...orderData,
        status: 'pending',
        date: new Date().toISOString()
      };
    }
  }

  async updateOrderStatus(orderId, newStatus, notes = '') {
    // Skip API call in development mode if backend unavailable
    if (this.isDevelopmentMode && !this.backendAvailable) {
      // Return mock success response for development
      return {
        id: orderId,
        status: newStatus,
        notes: notes,
        updatedAt: new Date().toISOString()
      };
    }

    try {
      const response = await this.makeRequest(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus, notes })
      });
      this.backendAvailable = true;
      return response.order;
    } catch (error) {
      this.backendAvailable = false;
      // Return mock success response for development
      return {
        id: orderId,
        status: newStatus,
        notes: notes,
        updatedAt: new Date().toISOString()
      };
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
    // Skip API call in development mode if backend unavailable
    if (this.isDevelopmentMode && !this.backendAvailable) {
      return this.getMockStats();
    }

    try {
      const response = await this.makeRequest('/orders/stats');
      this.backendAvailable = true;
      return response.stats || {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        deliveredOrders: 0
      };
    } catch (error) {
      this.backendAvailable = false;
      return this.getMockStats();
    }
  }

  getMockStats() {
    return {
      totalOrders: 25,
      totalRevenue: 4500,
      pendingOrders: 5,
      deliveredOrders: 18,
      cancelledOrders: 2,
      preparingOrders: 3,
      outForDeliveryOrders: 2
    };
  }
}

export default new OrderService();