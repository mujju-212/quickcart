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
    return this.makeRequest('/offers');
  }

  async getActiveOffers() {
    try {
      console.log('🎁 Loading active offers from API...');
      const offers = await this.makeRequest('/offers/active');
      console.log('🎁 Active offers loaded:', offers);
      return offers;
    } catch (error) {
      console.error('❌ Error loading offers:', error);
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
    return this.makeRequest('/offers', {
      method: 'POST',
      body: JSON.stringify(offerData)
    });
  }

  async updateOffer(offerId, updateData) {
    return this.makeRequest(`/offers/${offerId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }

  async deleteOffer(offerId) {
    return this.makeRequest(`/offers/${offerId}`, {
      method: 'DELETE'
    });
  }

  async incrementUsage(offerId) {
    return this.makeRequest(`/offers/${offerId}/increment`, {
      method: 'POST'
    });
  }
}

export default new OffersService();