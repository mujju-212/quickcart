import React, { useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import AnimatedRN, { FadeInUp, Layout } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Package, ClipboardList } from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { Header, EmptyState } from '@components/common';
import { OrderCard } from '@components/order';
import { Chip } from '@components/ui';
import { Skeleton } from '@components/ui';
import { useOrders } from '@hooks/useOrders';

// ──────────────────────────────────────────
//  Filter Tabs
// ──────────────────────────────────────────
const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

// ──────────────────────────────────────────
//  Orders List Screen
// ──────────────────────────────────────────

export default function OrdersScreen() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('all');

  const { data: orders, isLoading, refetch, isRefetching } = useOrders();

  // Filter orders by tab
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    if (activeTab === 'all') return orders;

    return orders.filter((order: any) => {
      const status = (order.status || '').toLowerCase();
      switch (activeTab) {
        case 'active':
          return ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery'].includes(status);
        case 'delivered':
          return status === 'delivered';
        case 'cancelled':
          return ['cancelled', 'returned', 'refunded'].includes(status);
        default:
          return true;
      }
    });
  }, [orders, activeTab]);

  const handleOrderPress = useCallback(
    (order: any) => {
      router.push({
        pathname: '/orders/[id]',
        params: { id: order.id },
      });
    },
    [router]
  );

  const renderOrder = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <AnimatedRN.View
        entering={FadeInUp.delay(index * 60).springify()}
        layout={Layout.springify()}
      >
        <OrderCard order={item} onPress={() => handleOrderPress(item)} />
      </AnimatedRN.View>
    ),
    [handleOrderPress]
  );

  // Loading skeleton
  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: top }]}>
        <Header title="My Orders" />
        <View style={styles.skeletonList}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.skeletonCard}>
              <Skeleton width="40%" height={16} style={{ marginBottom: 8 }} />
              <Skeleton width="70%" height={14} style={{ marginBottom: 6 }} />
              <Skeleton width="50%" height={14} style={{ marginBottom: 12 }} />
              <Skeleton width="30%" height={20} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <Header title="My Orders" />

      {/* Tab Filter */}
      <AnimatedRN.View entering={FadeInUp.springify()} style={styles.tabBar}>
        {TABS.map((tab) => {
          const count =
            tab.value === 'all'
              ? orders?.length || 0
              : filteredOrders?.length || 0;
          return (
            <Chip
              key={tab.value}
              label={`${tab.label}${tab.value === activeTab ? ` (${tab.value === 'all' ? orders?.length || 0 : filteredOrders?.length || 0})` : ''}`}
              selected={activeTab === tab.value}
              onPress={() => setActiveTab(tab.value)}
              size="sm"
            />
          );
        })}
      </AnimatedRN.View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item: any) => item.id?.toString()}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            preset="orders"
            title={
              activeTab === 'all'
                ? 'No orders yet'
                : `No ${activeTab} orders`
            }
            message={
              activeTab === 'all'
                ? "Your order history will appear here once you make your first purchase"
                : `You don't have any ${activeTab} orders`
            }
            actionLabel={activeTab === 'all' ? 'Start Shopping' : undefined}
            onAction={
              activeTab === 'all'
                ? () => router.push('/(tabs)')
                : undefined
            }
          />
        }
      />
    </View>
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },

  // Skeleton
  skeletonList: {
    padding: spacing.md,
  },
  skeletonCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
});
