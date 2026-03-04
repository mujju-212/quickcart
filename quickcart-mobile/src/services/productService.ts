import api, { ApiResponse } from './api';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

export interface Product {
  id: number;
  name: string;
  price: number;
  original_price?: number;
  size: string;
  image_url?: string;
  images?: string[];
  additional_images?: string[];
  description?: string;
  category_name: string;
  category_id?: number;
  stock: number;
  in_stock?: boolean;
  status: string;
  brand?: string;
  specifications?: Record<string, string>;
  created_at?: string;
  average_rating?: number;
  review_count?: number;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  limit?: number;
  include_out_of_stock?: boolean;
}

// ──────────────────────────────────────────
//  Endpoints
// ──────────────────────────────────────────

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  const { data } = await api.get('/products/', { params: filters });
  // API returns either { products: [...] } or an array directly
  return data.products ?? data;
}

export async function getProductById(productId: number): Promise<Product> {
  const { data } = await api.get(`/products/${productId}`);
  return data.product ?? data;
}

export async function getProductsByCategory(categoryName: string): Promise<Product[]> {
  const { data } = await api.get(`/products/category/${encodeURIComponent(categoryName)}`);
  return data.products ?? data;
}

export async function getRelatedProducts(productId: number, limit: number = 4): Promise<Product[]> {
  const { data } = await api.get(`/products/${productId}/related`, { params: { limit } });
  return data.products ?? data;
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data } = await api.get('/products/', { params: { search: query } });
  return data.products ?? data;
}

const productService = {
  getProducts,
  getProductById,
  getProductsByCategory,
  getRelatedProducts,
  searchProducts,
};

export default productService;
