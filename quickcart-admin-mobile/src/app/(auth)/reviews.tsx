// Reviews Screen — List with filter, approve/flag/delete actions

import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Text, Chip, IconButton, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../../services/reviewService';
import SearchHeader from '../../components/common/SearchHeader';
import Card from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';
import { SkeletonCard } from '../../components/common/Skeleton';
import { useDebounce } from '../../hooks/useDebounce';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { timeAgo } from '../../utils/helpers';

const STATUS_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'flagged', label: 'Flagged' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((s) => (
        <MaterialCommunityIcons
          key={s}
          name={s <= rating ? 'star' : 'star-outline'}
          size={14}
          color={s <= rating ? '#F59E0B' : colors.text.disabled}
        />
      ))}
    </View>
  );
}

export default function ReviewsScreen() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['reviews', debouncedSearch, statusFilter],
    queryFn: () =>
      reviewService.getReviews({
        status: statusFilter !== 'all' ? statusFilter : undefined,
      }),
  });

  const approveReview = useMutation({
    mutationFn: (id: number) => reviewService.approveReview(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reviews'] }),
  });

  const flagReview = useMutation({
    mutationFn: (id: number) => reviewService.flagReview(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reviews'] }),
  });

  const deleteReview = useMutation({
    mutationFn: (id: number) => reviewService.deleteReview(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reviews'] }),
  });

  const reviews = (data as any)?.reviews || data || [];

  const handleDelete = (review: any) => {
    Alert.alert('Delete Review', 'This review will be permanently removed.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteReview.mutate(review.review_id),
      },
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return colors.status.delivered;
      case 'flagged':
        return colors.status.cancelled;
      case 'pending':
        return colors.status.pending;
      default:
        return colors.text.tertiary;
    }
  };

  const renderItem = useCallback(({ item }: { item: any }) => (
    <Card style={styles.reviewCard}>
      {/* Header: user + product + status */}
      <View style={styles.reviewHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.reviewerName}>{item.user_name || item.customer_name || 'Anonymous'}</Text>
          {item.product_name && (
            <Text style={styles.productName} numberOfLines={1}>{item.product_name}</Text>
          )}
        </View>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status || 'pending') }]}>
          <Text style={styles.statusText}>{(item.status || 'pending').toUpperCase()}</Text>
        </View>
      </View>

      {/* Rating + date */}
      <View style={styles.ratingRow}>
        <StarRating rating={item.rating} />
        <Text style={styles.dateText}>{timeAgo(item.created_at)}</Text>
      </View>

      {/* Comment */}
      {item.comment && (
        <Text style={styles.comment} numberOfLines={3}>{item.comment}</Text>
      )}

      <Divider style={styles.divider} />

      {/* Actions */}
      <View style={styles.actionsRow}>
        {item.status !== 'approved' && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => approveReview.mutate(item.review_id)}
          >
            <MaterialCommunityIcons name="check-circle-outline" size={18} color={colors.status.delivered} />
            <Text style={[styles.actionText, { color: colors.status.delivered }]}>Approve</Text>
          </TouchableOpacity>
        )}
        {item.status !== 'flagged' && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => flagReview.mutate(item.review_id)}
          >
            <MaterialCommunityIcons name="flag-outline" size={18} color="#F59E0B" />
            <Text style={[styles.actionText, { color: '#F59E0B' }]}>Flag</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleDelete(item)}
        >
          <MaterialCommunityIcons name="delete-outline" size={18} color={colors.status.cancelled} />
          <Text style={[styles.actionText, { color: colors.status.cancelled }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Card>
  ), []);

  return (
    <View style={styles.container}>
      <SearchHeader
        value={search}
        onChangeText={setSearch}
        placeholder="Search reviews..."
      />

      {/* Filter chips */}
      <View style={styles.chipRow}>
        {STATUS_FILTERS.map((sf) => (
          <Chip
            key={sf.key}
            selected={statusFilter === sf.key}
            onPress={() => setStatusFilter(sf.key)}
            style={[styles.chip, statusFilter === sf.key && styles.chipActive]}
            textStyle={[styles.chipTextStyle, statusFilter === sf.key && styles.chipTextActive]}
            showSelectedCheck={false}
          >
            {sf.label}
          </Chip>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.loadingList}>
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} style={{ height: 120, marginBottom: spacing.sm }} />)}
        </View>
      ) : reviews.length === 0 ? (
        <EmptyState
          icon="star-half-full"
          title="No Reviews"
          description={search ? 'Try a different search' : 'No reviews to display'}
        />
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => String(item.review_id)}
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
  chipTextStyle: {
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
  reviewCard: {
    marginBottom: spacing.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  reviewerName: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  productName: {
    ...typography.small,
    color: colors.text.tertiary,
    marginTop: 1,
  },
  statusDot: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    color: colors.white,
    letterSpacing: 0.5,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  starRow: {
    flexDirection: 'row',
    gap: 1,
  },
  dateText: {
    ...typography.caption,
    color: colors.text.disabled,
  },
  comment: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  divider: {
    marginVertical: spacing.sm,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
});
