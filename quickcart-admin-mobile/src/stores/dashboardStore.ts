// QuickCart Admin — Dashboard Store (Zustand)

import { create } from 'zustand';
import analyticsService, {
  DashboardOverview,
  RevenueDataPoint,
  OrdersByStatus,
  TopProduct,
} from '../services/analyticsService';

interface DashboardState {
  overview: DashboardOverview | null;
  revenueData: RevenueDataPoint[];
  ordersByStatus: OrdersByStatus[];
  topProducts: TopProduct[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  revenuePeriod: 7 | 30 | 90;

  // Actions
  fetchAll: () => Promise<void>;
  setRevenuePeriod: (days: 7 | 30 | 90) => void;
  refresh: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  overview: null,
  revenueData: [],
  ordersByStatus: [],
  topProducts: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
  revenuePeriod: 7,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const [overview, revenueData, ordersByStatus, topProducts] = await Promise.all([
        analyticsService.getOverview(),
        analyticsService.getRevenue(get().revenuePeriod),
        analyticsService.getOrdersByStatus(),
        analyticsService.getTopProducts(5),
      ]);

      set({
        overview,
        revenueData,
        ordersByStatus,
        topProducts,
        isLoading: false,
        lastUpdated: new Date(),
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || 'Failed to load dashboard data',
      });
    }
  },

  setRevenuePeriod: async (days: 7 | 30 | 90) => {
    set({ revenuePeriod: days });
    try {
      const revenueData = await analyticsService.getRevenue(days);
      set({ revenueData });
    } catch {
      // Keep existing data on failure
    }
  },

  refresh: async () => {
    await get().fetchAll();
  },
}));
