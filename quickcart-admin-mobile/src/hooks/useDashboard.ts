// useDashboard — React Query hooks for dashboard analytics

import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analyticsService';
import { REFRESH_INTERVALS } from '../utils/constants';

export function useDashboardOverview() {
  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: analyticsService.getOverview,
    refetchInterval: REFRESH_INTERVALS.DASHBOARD,
    staleTime: 30_000,
  });
}

export function useRevenue(days: number = 7) {
  return useQuery({
    queryKey: ['dashboard', 'revenue', days],
    queryFn: () => analyticsService.getRevenue(days),
    staleTime: 60_000,
  });
}

export function useOrdersByStatus() {
  return useQuery({
    queryKey: ['dashboard', 'orders-by-status'],
    queryFn: analyticsService.getOrdersByStatus,
    staleTime: 60_000,
  });
}

export function useTopProducts(limit: number = 10) {
  return useQuery({
    queryKey: ['dashboard', 'top-products', limit],
    queryFn: () => analyticsService.getTopProducts(limit),
    staleTime: 120_000,
  });
}

export function useCategoryPerformance() {
  return useQuery({
    queryKey: ['dashboard', 'category-performance'],
    queryFn: analyticsService.getCategoryPerformance,
    staleTime: 120_000,
  });
}

export function useDailyStats(days: number = 7) {
  return useQuery({
    queryKey: ['dashboard', 'daily-stats', days],
    queryFn: () => analyticsService.getDailyStats(days),
    staleTime: 60_000,
  });
}
