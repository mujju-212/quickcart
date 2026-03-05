import api, { ApiResponse } from './api';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

export interface Offer {
  id: number;
  title: string;
  description?: string;
  code: string;
  discount_type: 'percentage' | 'flat';
  discount_value: number;
  min_order_value?: number;
  max_discount_amount?: number;
  start_date: string;
  end_date: string;
  image_url?: string;
  status: string;
  usage_count: number;
  usage_limit?: number;
  offer_type?: string;
  applicable_categories?: string;
  applicable_products?: string;
}

export interface ValidateOfferResult {
  valid: boolean;
  discount: number;
  message?: string;
  offer?: Offer;
}

// ──────────────────────────────────────────
//  Endpoints
// ──────────────────────────────────────────

export async function getActiveOffers(): Promise<Offer[]> {
  const { data } = await api.get('/offers/active');
  return data.offers ?? data;
}

export async function getOfferById(offerId: number): Promise<Offer> {
  const { data } = await api.get(`/offers/${offerId}`);
  return data.offer ?? data;
}

export async function validateCoupon(
  code: string,
  orderValue: number,
): Promise<ValidateOfferResult> {
  const { data } = await api.post(`/offers/validate/${encodeURIComponent(code)}`, { orderValue });
  return data;
}

export async function incrementOfferUsage(offerId: number): Promise<ApiResponse> {
  const { data } = await api.post(`/offers/${offerId}/increment`);
  return data;
}

const offerService = {
  getActiveOffers,
  getOfferById,
  validateCoupon,
  incrementOfferUsage,
};

export default offerService;
