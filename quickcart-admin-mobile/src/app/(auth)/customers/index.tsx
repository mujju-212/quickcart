// Customers List Screen

import React, { useState, useCallback } from 'react';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import { useRouter } from 'expo-router';
import SearchHeader from '../../../components/common/SearchHeader';
import CustomerCard from '../../../components/customers/CustomerCard';
import EmptyState from '../../../components/common/EmptyState';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { useCustomers } from '../../../hooks/useCustomers';
import { useDebounce } from '../../../hooks/useDebounce';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

const SORT_OPTIONS: { key: 'newest' | 'most_orders' | 'highest_spend'; label: string }[] = [
  { key: 'newest', label: 'Recent' },
  { key: 'most_orders', label: 'Most Orders' },
  { key: 'highest_spend', label: 'Top Spenders' },
];

export default function CustomersListScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'most_orders' | 'highest_spend'>('newest');
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isRefetching, refetch } = useCustomers({
    search: debouncedSearch || undefined,
    sort: sortBy,
  });

  const customers = (data as any)?.customers || (data as any)?.data || data || [];

  const renderItem = useCallback(({ item }: { item: any }) => (
    <CustomerCard
      customer={item}
      onPress={() => router.push(`/(auth)/customers/${item.user_id}`)}
    />
  ), []);

  return (
    <View style={styles.container}>
      <SearchHeader
        value={search}
        onChangeText={setSearch}
        placeholder="Search customers..."
      />

      {/* Sort chips */}
      <View style={styles.chipRow}>
        {SORT_OPTIONS.map((opt) => (
          <Chip
            key={opt.key}
            selected={sortBy === opt.key}
            onPress={() => setSortBy(opt.key)}
            style={[styles.chip, sortBy === opt.key && styles.chipActive]}
            textStyle={[styles.chipText, sortBy === opt.key && styles.chipTextActive]}
            showSelectedCheck={false}
          >
            {opt.label}
          </Chip>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.loadingList}>
          {[1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} style={styles.skeletonCard} />)}
        </View>
      ) : customers.length === 0 ? (
        <EmptyState
          icon="account-group"
          title="No Customers"
          description={search ? 'Try a different search term' : 'No customers registered yet'}
        />
      ) : (
        <FlatList
          data={customers}
          keyExtractor={(item) => String(item.user_id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[colors.primary[600]]} />
          }
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
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
  },
  chip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  chipText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  chipTextActive: {
    color: colors.white,
  },
  list: {
    padding: spacing.md,
    paddingBottom: 80,
  },
  loadingList: {
    padding: spacing.md,
  },
  skeletonCard: {
    height: 80,
    marginBottom: spacing.sm,
  },
});
