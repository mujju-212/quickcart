import api from './api';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

export interface Banner {
  id: number;
  title?: string;
  subtitle?: string;
  image_url: string;
  link_url?: string;
  link_type?: 'product' | 'category' | 'offer' | 'external';
  link_value?: string;
  status: string;
  display_order?: number;
  start_date?: string;
  end_date?: string;
}

// ──────────────────────────────────────────
//  Endpoints
// ──────────────────────────────────────────

export async function getActiveBanners(): Promise<Banner[]> {
  const { data } = await api.get('/banners/active');
  return data.banners ?? data;
}

export async function getBannerById(bannerId: number): Promise<Banner> {
  const { data } = await api.get(`/banners/${bannerId}`);
  return data.banner ?? data;
}

const bannerService = {
  getActiveBanners,
  getBannerById,
};

export default bannerService;
