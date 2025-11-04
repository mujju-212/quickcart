const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

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
        body: JSON.stringify({ phoneNumber: phone })
      });
      
      // If development mode, show OTP in console and alert
      if (response.development_mode && response.otp) {
        console.log('🔔 DEVELOPMENT MODE - OTP:', response.otp);
      }
      
      return {
        success: response.success,
        message: response.message,
        demo: response.development_mode,
        demoOTP: response.otp
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
        body: JSON.stringify({ phoneNumber: phone, otp })
      });

      if (response.success) {
        // 🔒 SECURITY: Store JWT token if user exists
        if (response.token && response.user) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('token', response.token); // Store as 'token' for compatibility
          localStorage.setItem('currentUser', JSON.stringify(response.user));
        }
        
        return {
          success: true,
          user: response.user,
          token: response.token,
          isNewUser: response.isNewUser || false,
          phone: response.phone,
          message: response.message || 'OTP verified successfully'
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

      if (response.success && response.token && response.user) {
        // 🔒 SECURITY: Store JWT token and user data
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('token', response.token); // Store as 'token' for compatibility
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('isAdmin', 'true');
        
        return {
          success: true,
          user: response.user,
          token: response.token
        };
      }
      
      return {
        success: false,
        message: response.message || 'Invalid credentials'
      };
    } catch (error) {
      console.error('Admin login error:', error);
      return {
        success: false,
        message: error.message || 'Login failed'
      };
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('authToken');
    localStorage.removeItem('token'); // Also remove 'token'
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