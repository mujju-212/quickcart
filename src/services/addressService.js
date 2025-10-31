const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class AddressService {
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
      console.error('Address API request failed:', error);
      throw error;
    }
  }

  async getUserAddresses(phone) {
    try {
      const response = await this.makeRequest(`/users/addresses?phone=${phone}`);
      return response;
    } catch (error) {
      console.error('Error fetching addresses:', error);
      // Fallback to localStorage
      const addresses = localStorage.getItem('addresses');
      return { success: false, addresses: addresses ? JSON.parse(addresses) : [] };
    }
  }

  async addAddress(phone, addressData) {
    try {
      const response = await this.makeRequest('/users/addresses', {
        method: 'POST',
        body: JSON.stringify({ phone, ...addressData })
      });
      return response;
    } catch (error) {
      console.error('Error adding address:', error);
      // Fallback to localStorage
      const addresses = localStorage.getItem('addresses');
      const addressList = addresses ? JSON.parse(addresses) : [];
      const newAddress = { id: Date.now(), ...addressData };
      addressList.push(newAddress);
      localStorage.setItem('addresses', JSON.stringify(addressList));
      return { success: true, address: newAddress };
    }
  }

  async updateAddress(addressId, addressData) {
    try {
      const response = await this.makeRequest(`/users/addresses/${addressId}`, {
        method: 'PUT',
        body: JSON.stringify(addressData)
      });
      return response;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  }

  async deleteAddress(addressId) {
    try {
      const response = await this.makeRequest(`/users/addresses/${addressId}`, {
        method: 'DELETE'
      });
      return response;
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  }

  async setDefaultAddress(addressId) {
    try {
      const response = await this.makeRequest(`/users/addresses/${addressId}/default`, {
        method: 'PUT'
      });
      return response;
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  }
}

export const addressService = new AddressService();
export default addressService;