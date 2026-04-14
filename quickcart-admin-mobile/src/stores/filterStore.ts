// QuickCart Admin — Filter Store (Zustand)

import { create } from 'zustand';
import { OrderStatus } from '../utils/constants';

interface FilterState {
  // Order filters
  orderStatus: OrderStatus | 'all';
  orderSearch: string;
  orderSort: 'newest' | 'oldest' | 'highest' | 'lowest';

  // Product filters
  productSearch: string;
  productCategory: number | null;
  productStockStatus: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';
  productViewMode: 'grid' | 'list';

  // Customer filters
  customerSearch: string;
  customerSort: 'newest' | 'most_orders' | 'highest_spend';

  // Review filters
  reviewStatus: 'all' | 'pending' | 'approved' | 'flagged';
  reviewSort: 'newest' | 'lowest_rated' | 'most_reported';

  // Offer filters
  offerStatus: 'all' | 'active' | 'expired' | 'upcoming';

  // Report date range
  reportPeriod: 'today' | 'yesterday' | '7days' | '30days' | 'custom';
  reportStartDate: string | null;
  reportEndDate: string | null;

  // Actions
  setOrderFilter: (filters: Partial<Pick<FilterState, 'orderStatus' | 'orderSearch' | 'orderSort'>>) => void;
  setProductFilter: (filters: Partial<Pick<FilterState, 'productSearch' | 'productCategory' | 'productStockStatus' | 'productViewMode'>>) => void;
  setCustomerFilter: (filters: Partial<Pick<FilterState, 'customerSearch' | 'customerSort'>>) => void;
  setReviewFilter: (filters: Partial<Pick<FilterState, 'reviewStatus' | 'reviewSort'>>) => void;
  setOfferFilter: (filters: Partial<Pick<FilterState, 'offerStatus'>>) => void;
  setReportDateRange: (period: FilterState['reportPeriod'], start?: string, end?: string) => void;
  resetFilters: () => void;
}

const initialState = {
  orderStatus: 'all' as const,
  orderSearch: '',
  orderSort: 'newest' as const,
  productSearch: '',
  productCategory: null,
  productStockStatus: 'all' as const,
  productViewMode: 'grid' as const,
  customerSearch: '',
  customerSort: 'newest' as const,
  reviewStatus: 'all' as const,
  reviewSort: 'newest' as const,
  offerStatus: 'all' as const,
  reportPeriod: '7days' as const,
  reportStartDate: null,
  reportEndDate: null,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,

  setOrderFilter: (filters) => set((state) => ({ ...state, ...filters })),
  setProductFilter: (filters) => set((state) => ({ ...state, ...filters })),
  setCustomerFilter: (filters) => set((state) => ({ ...state, ...filters })),
  setReviewFilter: (filters) => set((state) => ({ ...state, ...filters })),
  setOfferFilter: (filters) => set((state) => ({ ...state, ...filters })),

  setReportDateRange: (period, start, end) =>
    set({ reportPeriod: period, reportStartDate: start || null, reportEndDate: end || null }),

  resetFilters: () => set(initialState),
}));
