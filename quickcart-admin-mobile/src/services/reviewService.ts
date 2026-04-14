// QuickCart Admin — Review Service

import api from './api';
import { PAGE_SIZE } from '../utils/constants';

export interface Review {
  id: number;
  product_id: number;
  product_name: string;
  product_image?: string;
  user_id: number;
  user_name: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'flagged';
  created_at: string;
  updated_at?: string;
}

export interface ReviewsParams {
  page?: number;
  limit?: number;
  status?: string;
  sort?: 'newest' | 'lowest_rated' | 'most_reported';
}

const reviewService = {
  /**
   * Get paginated reviews
   */
  getReviews: async (params: ReviewsParams = {}) => {
    const { page = 1, limit = PAGE_SIZE, status, sort } = params;
    const queryParams: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
    };
    if (status && status !== 'all') queryParams.status = status;
    if (sort) queryParams.sort = sort;

    const response = await api.get('/reviews', { params: queryParams });
    return response.data;
  },

  /**
   * Approve review
   */
  approveReview: async (id: number) => {
    const response = await api.put(`/reviews/${id}/approve`);
    return response.data;
  },

  /**
   * Flag review
   */
  flagReview: async (id: number, reason?: string) => {
    const response = await api.put(`/reviews/${id}/flag`, { reason });
    return response.data;
  },

  /**
   * Delete review
   */
  deleteReview: async (id: number) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};

export { reviewService };
export default reviewService;
