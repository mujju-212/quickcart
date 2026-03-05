import api, { ApiResponse } from './api';
import { Product } from './productService';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

export interface WishlistItem extends Product {
  wishlist_id?: number;
}

// ──────────────────────────────────────────
//  Endpoints
// ──────────────────────────────────────────

export async function getWishlist(phone: string): Promise<WishlistItem[]> {
  const { data } = await api.get('/wishlist/', { params: { phone } });
  return data.wishlist ?? data.items ?? data;
}

export async function addToWishlist(phone: string, productId: number): Promise<ApiResponse> {
  const { data } = await api.post('/wishlist/add', { phone, product_id: productId });
  return data;
}

export async function removeFromWishlist(phone: string, productId: number): Promise<ApiResponse> {
  const { data } = await api.delete('/wishlist/remove', {
    data: { phone, product_id: productId },
  });
  return data;
}

export async function clearWishlist(phone: string): Promise<ApiResponse> {
  const { data } = await api.delete('/wishlist/clear', { data: { phone } });
  return data;
}

export async function isInWishlist(phone: string, productId: number): Promise<boolean> {
  const { data } = await api.get(`/wishlist/check/${productId}`, { params: { phone } });
  return data.in_wishlist ?? data.exists ?? false;
}

const wishlistService = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  isInWishlist,
};

export default wishlistService;
