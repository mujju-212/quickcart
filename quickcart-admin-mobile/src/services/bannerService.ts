// QuickCart Admin — Banner Service

import api from './api';

export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  image_url: string;
  link_url?: string;
  is_active: boolean;
  display_order: number;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at?: string;
}

export interface BannerFormData {
  title: string;
  subtitle?: string;
  image_url: string;
  link_url?: string;
  is_active?: boolean;
  display_order?: number;
  start_date?: string;
  end_date?: string;
}

const bannerService = {
  /**
   * Get all banners
   */
  getBanners: async (): Promise<Banner[]> => {
    const response = await api.get('/banners');
    return response.data.banners || response.data || [];
  },

  /**
   * Get single banner
   */
  getBanner: async (id: number): Promise<Banner> => {
    const response = await api.get(`/banners/${id}`);
    return response.data.banner || response.data;
  },

  /**
   * Create banner
   */
  createBanner: async (data: BannerFormData) => {
    const response = await api.post('/banners', data);
    return response.data;
  },

  /**
   * Update banner
   */
  updateBanner: async (id: number, data: Partial<BannerFormData>) => {
    const response = await api.put(`/banners/${id}`, data);
    return response.data;
  },

  /**
   * Delete banner
   */
  deleteBanner: async (id: number) => {
    const response = await api.delete(`/banners/${id}`);
    return response.data;
  },

  /**
   * Toggle banner active
   */
  toggleBanner: async (id: number) => {
    const response = await api.put(`/banners/${id}/toggle`);
    return response.data;
  },
};

export { bannerService };
export default bannerService;
