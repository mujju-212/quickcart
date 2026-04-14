import cacheUtils from '../utils/cacheUtils';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class OffersService {
  async makeRequest(endpoint, options = {}) {
    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getAllOffers() {
    try {
      return await cacheUtils.getOrFetch('offers:all', async () => {
        return this.makeRequest('/offers');
      }, 60 * 1000);
    } catch (error) {
      console.error('Error loading offers:', error);
      return [];
    }
  }

  async getActiveOffers() {
    try {
      return await cacheUtils.getOrFetch('offers:active', async () => {
        return this.makeRequest('/offers/active');
      }, 60 * 1000);
    } catch (error) {
      console.error('Error loading active offers:', error);
      return [];
    }
  }

  async getOfferById(id) {
    return this.makeRequest(`/offers/${id}`);
  }

  async validateOffer(code, orderValue) {
    return this.makeRequest(`/offers/validate/${code}`, {
      method: 'POST',
      body: JSON.stringify({ orderValue })
    });
  }

  async createOffer(offerData) {
    const result = await this.makeRequest('/offers', {
      method: 'POST',
      body: JSON.stringify(offerData)
    });
    cacheUtils.invalidatePattern('offers:');
    return result;
  }

  async updateOffer(offerId, updateData) {
    const result = await this.makeRequest(`/offers/${offerId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
    cacheUtils.invalidatePattern('offers:');
    return result;
  }

  async deleteOffer(offerId) {
    const result = await this.makeRequest(`/offers/${offerId}`, {
      method: 'DELETE'
    });
    cacheUtils.invalidatePattern('offers:');
    return result;
  }

  async incrementUsage(offerId) {
    const result = await this.makeRequest(`/offers/${offerId}/increment`, {
      method: 'POST'
    });
    cacheUtils.invalidatePattern('offers:');
    return result;
  }
}

export default new OffersService();