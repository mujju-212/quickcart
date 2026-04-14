// QuickCart Admin — Offer Service

import api from './api';

export interface Offer {
  id: number;
  code: string;
  description?: string;
  discount_type: 'percentage' | 'flat';
  discount_value: number;
  max_discount?: number;
  min_order_value?: number;
  usage_limit?: number;
  usage_limit_per_user?: number;
  used_count: number;
  valid_from?: string;
  valid_until?: string;
  is_active: boolean;
  applicable_categories?: number[];
  created_at: string;
  updated_at?: string;
}

export interface OfferFormData {
  code: string;
  description?: string;
  discount_type: 'percentage' | 'flat';
  discount_value: number;
  max_discount?: number;
  min_order_value?: number;
  usage_limit?: number;
  usage_limit_per_user?: number;
  valid_from?: string;
  valid_until?: string;
  is_active?: boolean;
  applicable_categories?: number[];
}

const offerService = {
  /**
   * Get all offers
   */
  getOffers: async (status?: string) => {
    const params: Record<string, string> = {};
    if (status && status !== 'all') params.status = status;
    const response = await api.get('/offers', { params });
    return response.data;
  },

  /**
   * Get single offer
   */
  getOffer: async (id: number): Promise<Offer> => {
    const response = await api.get(`/offers/${id}`);
    return response.data.offer || response.data;
  },

  /**
   * Create offer
   */
  createOffer: async (data: OfferFormData) => {
    const response = await api.post('/offers', data);
    return response.data;
  },

  /**
   * Update offer
   */
  updateOffer: async (id: number, data: Partial<OfferFormData>) => {
    const response = await api.put(`/offers/${id}`, data);
    return response.data;
  },

  /**
   * Delete offer
   */
  deleteOffer: async (id: number) => {
    const response = await api.delete(`/offers/${id}`);
    return response.data;
  },

  /**
   * Toggle offer active status
   */
  toggleOffer: async (id: number) => {
    const response = await api.put(`/offers/${id}/toggle`);
    return response.data;
  },
};

export { offerService };
export default offerService;
