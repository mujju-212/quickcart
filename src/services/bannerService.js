const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class BannerService {
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Banner API request failed:', error);
      throw error;
    }
  }

  async getAllBanners() {
    try {
      const response = await this.makeRequest('/banners');
      return response.banners || [];
    } catch (error) {
      console.error('Error fetching banners:', error);
      return [];
    }
  }

  async getActiveBanners() {
    try {
      console.log('🎨 Fetching active banners from API...');
      const response = await this.makeRequest('/banners/active');
      console.log('🎨 Active banners response:', response);
      return response.banners || [];
    } catch (error) {
      console.error('Error fetching active banners:', error);
      return [];
    }
  }

  async createBanner(bannerData) {
    try {
      // Map frontend field names to backend field names
      const payload = {
        title: bannerData.title,
        subtitle: bannerData.description || '',
        image_url: bannerData.image,
        link_url: bannerData.linkUrl || '',
        status: bannerData.status || 'active',
        display_order: bannerData.position || 0,
        start_date: bannerData.startDate || null,
        end_date: bannerData.endDate || null
      };

      console.log('🎨 Creating banner via API:', payload);
      const response = await this.makeRequest('/banners', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      console.log('✅ Banner created:', response);
      return response.banner;
    } catch (error) {
      console.error('Error creating banner:', error);
      throw error;
    }
  }

  async updateBanner(bannerId, updateData) {
    try {
      // Map frontend field names to backend field names
      const payload = {
        title: updateData.title,
        subtitle: updateData.description || '',
        image_url: updateData.image,
        link_url: updateData.linkUrl || '',
        status: updateData.status || 'active',
        display_order: updateData.position || 0,
        start_date: updateData.startDate || null,
        end_date: updateData.endDate || null
      };

      console.log('🎨 Updating banner via API:', bannerId, payload);
      const response = await this.makeRequest(`/banners/${bannerId}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      console.log('✅ Banner updated:', response);
      return response.banner;
    } catch (error) {
      console.error('Error updating banner:', error);
      throw error;
    }
  }

  async deleteBanner(bannerId) {
    try {
      console.log('🗑️ Deleting banner via API:', bannerId);
      const response = await this.makeRequest(`/banners/${bannerId}`, {
        method: 'DELETE'
      });

      console.log('✅ Banner deleted');
      return response.success;
    } catch (error) {
      console.error('Error deleting banner:', error);
      throw error;
    }
  }

  async updateBannerPosition(bannerId, newPosition) {
    try {
      return await this.updateBanner(bannerId, { position: newPosition });
    } catch (error) {
      console.error('Error updating banner position:', error);
      throw error;
    }
  }

  async getBannerStats() {
    try {
      const allBanners = await this.getAllBanners();
      const activeBanners = await this.getActiveBanners();
      
      return {
        totalBanners: allBanners.length,
        activeBanners: activeBanners.length,
        expiredBanners: allBanners.filter(b => b.end_date && new Date(b.end_date) < new Date()).length,
        upcomingBanners: allBanners.filter(b => b.start_date && new Date(b.start_date) > new Date()).length
      };
    } catch (error) {
      console.error('Error getting banner stats:', error);
      return {
        totalBanners: 0,
        activeBanners: 0,
        expiredBanners: 0,
        upcomingBanners: 0
      };
    }
  }
}

export default new BannerService();