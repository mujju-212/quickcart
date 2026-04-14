// QuickCart Admin — Product Service

import api from './api';
import { PAGE_SIZE } from '../utils/constants';

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  category_id: number;
  category_name?: string;
  image_url?: string;
  images?: string[];
  stock: number;
  unit?: string;
  size?: string;
  brand?: string;
  is_active: boolean;
  is_featured?: boolean;
  rating_avg?: number;
  rating_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: number;
  stock_status?: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';
  sort?: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  category_id: number;
  stock: number;
  stock_quantity?: number;
  unit?: string;
  size?: string;
  brand?: string;
  is_active?: boolean;
  is_featured?: boolean;
  image_url?: string;
  tags?: string[];
}

const productService = {
  /**
   * Get paginated product list
   */
  getProducts: async (params: ProductsParams = {}) => {
    const { page = 1, limit = PAGE_SIZE, search, category, stock_status, sort } = params;
    const queryParams: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
    };
    if (search) queryParams.search = search;
    if (category) queryParams.category = category.toString();
    if (stock_status && stock_status !== 'all') queryParams.stock_status = stock_status;
    if (sort) queryParams.sort = sort;

    const response = await api.get('/products', { params: queryParams });
    return response.data;
  },

  /**
   * Get single product
   */
  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data.product || response.data;
  },

  /**
   * Create new product
   */
  createProduct: async (data: ProductFormData) => {
    const response = await api.post('/products', data);
    return response.data;
  },

  /**
   * Update product
   */
  updateProduct: async (id: number, data: Partial<ProductFormData>) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  /**
   * Delete product
   */
  deleteProduct: async (id: number) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  /**
   * Quick stock update
   */
  updateStock: async (id: number, stock: number) => {
    const response = await api.put(`/products/${id}/stock`, { stock });
    return response.data;
  },

  /**
   * Toggle product active status
   */
  toggleActive: async (id: number, active?: boolean) => {
    const response = await api.put(`/products/${id}/toggle-active`, { is_active: active });
    return response.data;
  },
};

export type ProductFilters = ProductsParams;
export { productService };
export default productService;
