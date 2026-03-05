import api, { ApiResponse } from './api';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment: string;
  user_name?: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: Record<string, number>;  // "1"–"5" => count
}

export interface ProductReviewsResult {
  reviews: Review[];
  average_rating: number;
  total_reviews: number;
}

// ──────────────────────────────────────────
//  Endpoints
// ──────────────────────────────────────────

export async function getProductReviews(productId: number): Promise<ProductReviewsResult> {
  const { data } = await api.get(`/reviews/product/${productId}`);
  return data;
}

export async function addReview(
  productId: number,
  rating: number,
  comment: string,
): Promise<ApiResponse<Review>> {
  const { data } = await api.post(`/reviews/product/${productId}`, { rating, comment });
  return data;
}

export async function updateReview(
  reviewId: number,
  updates: { rating?: number; comment?: string },
): Promise<ApiResponse<Review>> {
  const { data } = await api.put(`/reviews/${reviewId}`, updates);
  return data;
}

export async function deleteReview(reviewId: number): Promise<ApiResponse> {
  const { data } = await api.delete(`/reviews/${reviewId}`);
  return data;
}

export async function getReviewStats(productId: number): Promise<ReviewStats> {
  const { data } = await api.get(`/reviews/product/${productId}/stats`);
  return data;
}

const reviewService = {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
  getReviewStats,
};

export default reviewService;
