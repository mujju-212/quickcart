import api from './api';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
  image_url?: string;
  status: string;
  position?: number;
  product_count?: number;
}

// ──────────────────────────────────────────
//  Endpoints
// ──────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get('/categories/');
  return data.categories ?? data;
}

export async function getCategoryById(categoryId: number): Promise<Category> {
  const { data } = await api.get(`/categories/${categoryId}`);
  return data.category ?? data;
}

const categoryService = {
  getCategories,
  getCategoryById,
};

export default categoryService;
