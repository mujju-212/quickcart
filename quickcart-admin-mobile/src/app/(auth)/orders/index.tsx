// Orders List Screen

import React, { useState, useCallback } from 'react';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import SearchHeader from '../../../components/common/SearchHeader';
import OrderCard from '../../../components/orders/OrderCard';
import Skeleton, { SkeletonCard } from '../../../components/common/Skeleton';
import EmptyState from '../../../components/common/EmptyState';
import Badge from '../../../components/common/Badge';
import { useOrders, useOrderStats } from '../../../hooks/useOrders';
import { useFilterStore } from '../../../stores/filterStore';
import { useDebounce } from '../../../hooks/useDebounce';
import { colors } from '../../../theme/colors';
import { spacing, borderRadius } from '../../../theme/spacing';
import { ORDER_STATUSES } from '../../../utils/constants';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';

export default function OrdersListScreen() {
  const router = useRouter();
  const { orderStatus, orderSearch, setOrderFilter } = useFilterStore();
  const setOrderStatus = (status: string) => setOrderFilter({ orderStatus: status as any });
  const setOrderSearch = (search: string) => setOrderFilter({ orderSearch: search });
  const debouncedSearch = useDebounce(orderSearch, 400);

  const { data, isLoading, isRefetching, refetch } = useOrders({
    status: orderStatus || undefined,
    search: debouncedSearch || undefined,
    page: 1,
  });

  const stats = useOrderStats();

  const orders = (data as any)?.orders || (Array.isArray(data) ? data : []);

  const renderItem = useCallback(({ item }: { item: any }) => (
    <OrderCard
      order={item}
      onPress={() => router.push(`/(auth)/orders/${item.id || item.order_id}`)}
    />
  ), []);

  return (
    <View style={styles.container}>
      <SearchHeader
        value={orderSearch}
        onChangeText={setOrderSearch}
        placeholder="Search orders..."
      />

      {/* Status filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        <TouchableOpacity
          style={[styles.chip, !orderStatus && styles.chipActive]}
          onPress={() => setOrderStatus('')}
        >
          <Text style={[styles.chipText, !orderStatus && styles.chipTextActive]}>All</Text>
        </TouchableOpacity>
        {ORDER_STATUSES.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.chip, orderStatus === s && styles.chipActive]}
            onPress={() => setOrderStatus(s)}
          >
            <Text style={[styles.chipText, orderStatus === s && styles.chipTextActive]}>
              {s.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading ? (
        <View style={styles.loadingList}>
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} style={styles.skeletonCard} />)}
        </View>
      ) : orders.length === 0 ? (
        <EmptyState
          icon="package-variant-closed"
          title="No Orders Found"
          description={orderSearch ? 'Try a different search term' : 'No orders match the selected filter'}
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => String(item.id || item.order_id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={[colors.primary[600]]}
            />
          }
          onEndReachedThreshold={0.3}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  chipRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 1,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  chipActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  chipText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.text.secondary,
  },
  chipTextActive: {
    color: colors.white,
  },
  list: {
    padding: spacing.md,
    paddingTop: 0,
  },
  loadingList: {
    padding: spacing.md,
  },
  skeletonCard: {
    height: 100,
    marginBottom: spacing.sm,
  },
});
