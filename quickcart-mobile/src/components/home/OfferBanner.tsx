import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, ViewStyle } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Tag, Clock, ArrowRight } from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { shadows } from '@theme/shadows';
import { Badge } from '@components/ui';
import type { Offer } from '@services/offerService';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

interface OfferBannerProps {
  offers: Offer[];
  style?: ViewStyle;
}

// ──────────────────────────────────────────
//  Component
// ──────────────────────────────────────────

export function OfferBanner({ offers, style }: OfferBannerProps) {
  const router = useRouter();

  if (!offers.length) return null;

  return (
    <Animated.View
      entering={FadeInUp.delay(350).duration(400)}
      style={[styles.wrapper, style]}
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🔥 Deals & Offers</Text>
        <Pressable onPress={() => router.push('/offers')}>
          <Text style={styles.seeAll}>See All</Text>
        </Pressable>
      </View>

      {offers.slice(0, 3).map((offer, index) => (
        <Pressable
          key={offer.id}
          onPress={() => router.push(`/offers` as any)}
          style={[styles.offerCard, index < offers.length - 1 && { marginBottom: spacing.sm }]}
        >
          {/* Left: Discount Tag */}
          <View style={styles.discountBadge}>
            <Tag size={16} color={colors.white} />
            <Text style={styles.discountText}>
              {offer.discount_type === 'percentage'
                ? `${offer.discount_value}% OFF`
                : `₹${offer.discount_value} OFF`}
            </Text>
          </View>

          {/* Info */}
          <View style={styles.offerInfo}>
            <Text style={styles.offerTitle} numberOfLines={1}>
              {offer.title}
            </Text>
            {offer.code && (
              <View style={styles.codeRow}>
                <Text style={styles.codeLabel}>Code: </Text>
                <Text style={styles.codeValue}>{offer.code}</Text>
              </View>
            )}
            {offer.min_order_value && (
              <Text style={styles.offerCondition}>
                Min. order ₹{offer.min_order_value}
              </Text>
            )}
          </View>

          {/* Arrow */}
          <ArrowRight size={18} color={colors.textTertiary} />
        </Pressable>
      ))}
    </Animated.View>
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  seeAll: {
    ...typography.labelMedium,
    color: colors.primary,
  },
  offerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    ...shadows.sm,
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.discount,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
  },
  discountText: {
    ...typography.labelSmall,
    color: colors.white,
    marginLeft: 4,
    fontWeight: '700',
  },
  offerInfo: {
    flex: 1,
  },
  offerTitle: {
    ...typography.labelLarge,
    color: colors.textPrimary,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  codeLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  codeValue: {
    ...typography.labelSmall,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 1,
  },
  offerCondition: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 1,
  },
});

export default OfferBanner;
