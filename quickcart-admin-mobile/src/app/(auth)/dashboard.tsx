// Dashboard Screen — Overview of key metrics with charts

import React, { useCallback } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useDashboardOverview,
  useRevenue,
  useOrdersByStatus,
  useTopProducts,
  useCategoryPerformance,
} from '../../hooks/useDashboard';
import StatCard from '../../components/common/StatCard';
import Skeleton, { SkeletonCard } from '../../components/common/Skeleton';
import RevenueChart from '../../components/dashboard/RevenueChart';
import OrdersChart from '../../components/dashboard/OrdersChart';
import CategoryPieChart from '../../components/dashboard/CategoryPieChart';
import TopProductsList from '../../components/dashboard/TopProductsList';
import RecentOrdersList from '../../components/dashboard/RecentOrdersList';
import QuickActionGrid from '../../components/dashboard/QuickActionGrid';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { formatPrice, formatNumber } from '../../utils/helpers';

export default function DashboardScreen() {
  const overview = useDashboardOverview();
  const revenue = useRevenue();
  const ordersByStatus = useOrdersByStatus();
  const topProducts = useTopProducts();
  const categoryPerformance = useCategoryPerformance();

  const isLoading = overview.isLoading;

  const onRefresh = useCallback(() => {
    overview.refetch();
    revenue.refetch();
    ordersByStatus.refetch();
    topProducts.refetch();
    categoryPerformance.refetch();
  }, []);

  const stats = overview.data;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={overview.isRefetching}
          onRefresh={onRefresh}
          colors={[colors.primary[600]]}
          tintColor={colors.primary[600]}
        />
      }
    >
      {/* Quick actions */}
      <QuickActionGrid
        actions={[
          { id: 'pending', label: 'Pending Orders', icon: 'clock-outline', color: colors.status.pending, bgColor: '#FEF3C7', badge: stats?.orders_today || 0 },
          { id: 'low_stock', label: 'Low Stock', icon: 'alert-outline', color: colors.status.cancelled, bgColor: '#FEE2E2', badge: stats?.low_stock_count || 0 },
          { id: 'add_product', label: 'Add Product', icon: 'plus-circle-outline', color: colors.primary[600], bgColor: colors.background.secondary },
          { id: 'reports', label: 'Reports', icon: 'chart-box-outline', color: colors.status.delivered, bgColor: '#D1FAE5' },
        ]}
        onAction={(id: string) => {
          // Navigation handled by parent
        }}
      />

      {/* Stat cards grid */}
      <View style={styles.statGrid}>
        {isLoading ? (
          <>
            <SkeletonCard style={styles.statHalf} />
            <SkeletonCard style={styles.statHalf} />
            <SkeletonCard style={styles.statHalf} />
            <SkeletonCard style={styles.statHalf} />
          </>
        ) : (
          <>
            <StatCard
              title="Total Revenue"
              value={formatPrice(stats?.total_revenue || 0)}
              icon="cash-multiple"
              iconColor={colors.status.delivered}
              trend={stats?.revenue_change_pct != null ? { value: Math.abs(stats.revenue_change_pct), isPositive: stats.revenue_change_pct >= 0 } : undefined}
              style={styles.statHalf}
            />
            <StatCard
              title="Total Orders"
              value={formatNumber(stats?.total_orders || 0)}
              icon="package-variant"
              iconColor={colors.primary[600]}
              trend={stats?.orders_change_pct != null ? { value: Math.abs(stats.orders_change_pct), isPositive: stats.orders_change_pct >= 0 } : undefined}
              style={styles.statHalf}
            />
            <StatCard
              title="Customers"
              value={formatNumber(stats?.total_users || 0)}
              icon="account-group"
              iconColor={colors.status.confirmed}
              trend={stats?.users_change_pct != null ? { value: Math.abs(stats.users_change_pct), isPositive: stats.users_change_pct >= 0 } : undefined}
              style={styles.statHalf}
            />
            <StatCard
              title="Products"
              value={formatNumber(stats?.total_products || 0)}
              icon="shopping"
              iconColor={colors.accent}
              style={styles.statHalf}
            />
          </>
        )}
      </View>

      {/* Revenue chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Revenue Trend</Text>
        {revenue.isLoading ? <SkeletonCard style={{ height: 220 }} /> : (
          <RevenueChart data={revenue.data || []} period="7 days" />
        )}
      </View>

      {/* Orders by status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Orders by Status</Text>
        {ordersByStatus.isLoading ? <SkeletonCard style={{ height: 200 }} /> : (
          <OrdersChart data={ordersByStatus.data || []} />
        )}
      </View>

      {/* Category performance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category Performance</Text>
        {categoryPerformance.isLoading ? <SkeletonCard style={{ height: 200 }} /> : (
          <CategoryPieChart data={categoryPerformance.data || []} />
        )}
      </View>

      {/* Top products */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Products</Text>
        {topProducts.isLoading ? <SkeletonCard style={{ height: 200 }} /> : (
          <TopProductsList data={topProducts.data || []} />
        )}
      </View>

      {/* Recent orders */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        <RecentOrdersList data={[]} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing['3xl'],
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statHalf: {
    width: '48.5%',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
});
