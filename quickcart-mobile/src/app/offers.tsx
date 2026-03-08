import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import AnimatedRN, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Tag, Clock, Copy, Percent } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { shadows } from '@theme/shadows';
import { Header, EmptyState } from '@components/common';
import { Badge } from '@components/ui';
import { Skeleton } from '@components/ui';
import offerService from '@services/offerService';
import { useQuery } from '@tanstack/react-query';
import { formatPrice, formatDate } from '@utils/helpers';
import { triggerHaptic } from '@utils/haptics';
import { QUERY_KEYS } from '@utils/constants';

// ──────────────────────────────────────────
//  Offers & Coupons Screen
// ──────────────────────────────────────────

export default function OffersScreen() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  const {
    data: offers,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: QUERY_KEYS.offers,
    queryFn: () => offerService.getActiveOffers(),
  });

  const handleCopy = useCallback(async (code: string) => {
    try {
      await Clipboard.setStringAsync(code);
      triggerHaptic('success');
    } catch {}
  }, []);

  const renderOffer = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      const isExpired = item.valid_until && new Date(item.valid_until) < new Date();
      const isActive = !isExpired && item.is_active !== false;

      return (
        <AnimatedRN.View entering={FadeInUp.delay(index * 60).springify()}>
          <View style={[styles.offerCard, !isActive && styles.offerExpired]}>
            {/* Left accent */}
            <View
              style={[
                styles.accent,
                {
                  backgroundColor: isActive
                    ? item.discount_type === 'percentage'
                      ? colors.primary
                      : colors.success
                    : colors.grey300,
                },
              ]}
            />

            <View style={styles.offerContent}>
              {/* Header */}
              <View style={styles.offerHeader}>
                <View style={styles.offerIconCircle}>
                  {item.discount_type === 'percentage' ? (
                    <Percent size={20} color={colors.primary} />
                  ) : (
                    <Tag size={20} color={colors.success} />
                  )}
                </View>
                <View style={styles.offerTitleArea}>
                  <Text style={styles.offerTitle} numberOfLines={1}>
                    {item.title || item.description || 'Special Offer'}
                  </Text>
                  {item.description && item.title && (
                    <Text style={styles.offerDesc} numberOfLines={2}>
                      {item.description}
                    </Text>
                  )}
                </View>
                {!isActive && (
                  <Badge label="Expired" variant="error" size="sm" />
                )}
              </View>

              {/* Discount */}
              <View style={styles.discountRow}>
                <Text style={styles.discountValue}>
                  {item.discount_type === 'percentage'
                    ? `${item.discount_value}% OFF`
                    : `${formatPrice(item.discount_value)} OFF`}
                </Text>
                {item.min_order_amount && (
                  <Text style={styles.condition}>
                    Min. order {formatPrice(item.min_order_amount)}
                  </Text>
                )}
                {item.max_discount && (
                  <Text style={styles.condition}>
                    Max discount {formatPrice(item.max_discount)}
                  </Text>
                )}
              </View>

              {/* Code & Copy */}
              {item.code && (
                <TouchableOpacity
                  style={styles.codeBox}
                  onPress={() => handleCopy(item.code)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.codeText}>{item.code}</Text>
                  <Copy size={14} color={colors.primary} />
                  <Text style={styles.copyLabel}>TAP TO COPY</Text>
                </TouchableOpacity>
              )}

              {/* Validity */}
              {item.valid_until && (
                <View style={styles.validityRow}>
                  <Clock size={12} color={colors.textTertiary} />
                  <Text style={styles.validityText}>
                    {isExpired
                      ? `Expired on ${formatDate(item.valid_until)}`
                      : `Valid until ${formatDate(item.valid_until)}`}
                  </Text>
                </View>
              )}

              {/* Uses */}
              {item.usage_limit && (
                <Text style={styles.usageText}>
                  Used {item.usage_count || 0}/{item.usage_limit} times
                </Text>
              )}
            </View>
          </View>
        </AnimatedRN.View>
      );
    },
    [handleCopy]
  );

  // Loading
  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: top }]}>
        <Header title="Offers & Coupons" />
        <View style={styles.skeletonList}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.skeletonCard}>
              <Skeleton width="60%" height={18} style={{ marginBottom: 8 }} />
              <Skeleton width="40%" height={24} style={{ marginBottom: 8 }} />
              <Skeleton width="50%" height={32} borderRadius={8} style={{ marginBottom: 6 }} />
              <Skeleton width="35%" height={12} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  const offersList = offers || [];

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <Header title="Offers & Coupons" />

      <FlatList
        data={offersList}
        keyExtractor={(item: any) => item.id?.toString() || item.code}
        renderItem={renderOffer}
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
            preset="generic"
            title="No offers available"
            message="Check back later for exciting deals and discounts!"
            actionLabel="Browse Products"
            onAction={() => router.push('/(tabs)')}
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

  // Offer Card
  offerCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    ...shadows.sm,
  },
  offerExpired: {
    opacity: 0.6,
  },
  accent: {
    width: 4,
  },
  offerContent: {
    flex: 1,
    padding: spacing.md,
  },

  // Header
  offerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  offerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.grey50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerTitleArea: {
    flex: 1,
  },
  offerTitle: {
    ...typography.bodyMedium,
    color: colors.text,
    fontWeight: '700',
  },
  offerDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Discount
  discountRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  discountValue: {
    ...typography.h4,
    color: colors.primary,
    fontWeight: '800',
  },
  condition: {
    ...typography.caption,
    color: colors.textTertiary,
    backgroundColor: colors.grey50,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },

  // Code
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  codeText: {
    ...typography.labelMedium,
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: 2,
  },
  copyLabel: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
    fontSize: 9,
  },

  // Validity
  validityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  validityText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  usageText: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
});
