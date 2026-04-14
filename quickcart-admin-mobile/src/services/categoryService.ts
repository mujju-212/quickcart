// QuickCart Admin — Category Service

import api from './api';

export interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  display_order?: number;
  product_count?: number;
  created_at: string;
  updated_at?: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  image_url?: string;
  is_active?: boolean;
  display_order?: number;
}

const categoryService = {
  /**
   * Get all categories
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data.categories || response.data || [];
  },

  /**
   * Get single category
   */
  getCategory: async (id: number): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data.category || response.data;
  },

  /**
   * Create category
   */
  createCategory: async (data: CategoryFormData) => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  /**
   * Update category
   */
  updateCategory: async (id: number, data: Partial<CategoryFormData>) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  /**
   * Delete category
   */
  deleteCategory: async (id: number) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export { categoryService };
export default categoryService;
