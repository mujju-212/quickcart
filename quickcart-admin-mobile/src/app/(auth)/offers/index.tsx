// Offers List Screen

import React, { useState, useCallback } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, Alert } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { offerService } from '../../../services/offerService';
import SearchHeader from '../../../components/common/SearchHeader';
import OfferCard from '../../../components/offers/OfferCard';
import FloatingActionButton from '../../../components/common/FloatingActionButton';
import EmptyState from '../../../components/common/EmptyState';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { useDebounce } from '../../../hooks/useDebounce';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

const STATUS_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'inactive', label: 'Inactive' },
  { key: 'expired', label: 'Expired' },
];

export default function OffersListScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['offers', debouncedSearch, statusFilter],
    queryFn: () => offerService.getOffers(
      statusFilter !== 'all' ? statusFilter : undefined
    ),
  });

  const toggleOffer = useMutation({
    mutationFn: ({ offerId, isActive }: { offerId: number; isActive: boolean }) =>
      offerService.updateOffer(offerId, { is_active: isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['offers'] }),
  });

  const deleteOffer = useMutation({
    mutationFn: (id: number) => offerService.deleteOffer(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['offers'] }),
  });

  const offers = (data as any)?.offers || data || [];

  const handleToggle = (offer: any) => {
    toggleOffer.mutate({ offerId: offer.offer_id, isActive: !offer.is_active });
  };

  const handleEdit = (offer: any) => {
    router.push({ pathname: '/(auth)/offers/create', params: { editId: offer.offer_id } });
  };

  const handleDelete = (offer: any) => {
    Alert.alert('Delete Offer', `Delete "${offer.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteOffer.mutate(offer.offer_id),
      },
    ]);
  };

  const renderItem = useCallback(({ item }: { item: any }) => (
    <OfferCard
      offer={item}
      onToggle={() => handleToggle(item)}
      onPress={() => handleEdit(item)}
    />
  ), []);

  return (
    <View style={styles.container}>
      <SearchHeader
        value={search}
        onChangeText={setSearch}
        placeholder="Search offers..."
      />

      {/* Status filter chips */}
      <View style={styles.chipRow}>
        {STATUS_FILTERS.map((sf) => (
          <Chip
            key={sf.key}
            selected={statusFilter === sf.key}
            onPress={() => setStatusFilter(sf.key)}
            style={[styles.chip, statusFilter === sf.key && styles.chipActive]}
            textStyle={[styles.chipText, statusFilter === sf.key && styles.chipTextActive]}
            showSelectedCheck={false}
          >
            {sf.label}
          </Chip>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.loadingList}>
          {[1, 2, 3].map((i) => <SkeletonCard key={i} style={styles.skeletonCard} />)}
        </View>
      ) : offers.length === 0 ? (
        <EmptyState
          icon="tag-multiple"
          title="No Offers"
          description={search ? 'Try a different search' : 'Create your first offer'}
          actionLabel="Add Offer"
          onAction={() => router.push('/(auth)/offers/create')}
        />
      ) : (
        <FlatList
          data={offers}
          keyExtractor={(item) => String(item.offer_id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[colors.primary[600]]} />
          }
        />
      )}

      <FloatingActionButton
        icon="plus"
        onPress={() => router.push('/(auth)/offers/create')}
      />
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
    paddingBottom: 100,
  },
  loadingList: {
    padding: spacing.md,
  },
  skeletonCard: {
    height: 140,
    marginBottom: spacing.sm,
  },
});
