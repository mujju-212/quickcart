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

  createBanner(bannerData) {
    const banners = this.getAllBanners();
    const newBanner = {
      id: this.generateBannerId(),
      ...bannerData,
      position: banners.length + 1,
      createdAt: new Date().toISOString()
    };
    
    banners.push(newBanner);
    localStorage.setItem('banners', JSON.stringify(banners));
    return newBanner;
  }

  updateBanner(bannerId, updateData) {
    const banners = this.getAllBanners();
    const bannerIndex = banners.findIndex(banner => banner.id === bannerId);
    
    if (bannerIndex !== -1) {
      banners[bannerIndex] = {
        ...banners[bannerIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('banners', JSON.stringify(banners));
      return banners[bannerIndex];
    }
    
    return null;
  }

  deleteBanner(bannerId) {
    const banners = this.getAllBanners();
    const filteredBanners = banners.filter(banner => banner.id !== bannerId);
    localStorage.setItem('banners', JSON.stringify(filteredBanners));
    return true;
  }

  updateBannerPosition(bannerId, newPosition) {
    const banners = this.getAllBanners();
    const bannerIndex = banners.findIndex(banner => banner.id === bannerId);
    
    if (bannerIndex !== -1) {
      banners[bannerIndex].position = newPosition;
      localStorage.setItem('banners', JSON.stringify(banners));
      return banners[bannerIndex];
    }
    
    return null;
  }

  generateBannerId() {
    return 'banner' + Date.now() + Math.random().toString(36).substr(2, 5);
  }

  getBannerStats() {
    const banners = this.getAllBanners();
    const activeBanners = this.getActiveBanners();
    
    return {
      totalBanners: banners.length,
      activeBanners: activeBanners.length,
      expiredBanners: banners.filter(b => new Date(b.endDate) < new Date()).length,
      upcomingBanners: banners.filter(b => new Date(b.startDate) > new Date()).length
    };
  }
}

export default new BannerService();