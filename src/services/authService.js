const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class AuthService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async makeRequest(endpoint, options = {}) {
    try {
      const token = localStorage.getItem('authToken');
      const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
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
      console.error('Auth API request failed:', error);
      throw error;
    }
  }

  async sendOTP(phone) {
    try {
      const response = await this.makeRequest('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ phone })
      });
      return {
        success: response.success,
        message: response.message
      };
    } catch (error) {
      console.error('Send OTP Error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send OTP. Please try again.'
      };
    }
  }

  async verifyOTPAndLogin(phone, otp) {
    try {
      const response = await this.makeRequest('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, otp })
      });

      if (response.success) {
        // Store auth token and user data
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        
        return {
          success: true,
          user: response.user,
          message: 'Login successful'
        };
      }
      
      return {
        success: false,
        message: response.message || 'Invalid OTP'
      };
    } catch (error) {
      console.error('Verify OTP Error:', error);
      return {
        success: false,
        message: error.message || 'Failed to verify OTP. Please try again.'
      };
    }
  }

  async adminLogin(username, password) {
    try {
      const response = await this.makeRequest('/auth/admin-login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });

      if (response.success) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('isAdmin', 'true');
        return response.user;
      }
      
      return null;
    } catch (error) {
      console.error('Admin login error:', error);
      return null;
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('authToken');
  }

  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  isAdmin() {
    return localStorage.getItem('isAdmin') === 'true';
  }

  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  async refreshUserData() {
    try {
      const response = await this.makeRequest('/auth/me');
      if (response.success) {
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        return response.user;
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      this.logout();
    }
    return null;
  }

  async getOTPRemainingTime(phone) {
    try {
      const response = await this.makeRequest(`/auth/otp-status/${phone}`);
      return response.remainingTime || 0;
    } catch (error) {
      console.error('Error getting OTP remaining time:', error);
      return 0;
    }
  }
}

export default new AuthService();