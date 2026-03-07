import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Star, ThumbsUp, User } from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { formatRelativeTime, getInitials } from '@utils/helpers';
import type { Review } from '@services/reviewService';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

interface ReviewCardProps {
  review: Review;
  style?: ViewStyle;
}

// ──────────────────────────────────────────
//  Component
// ──────────────────────────────────────────

export function ReviewCard({ review, style }: ReviewCardProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i < review.rating);

  return (
    <View style={[styles.card, style]}>
      {/* Header */}
      <View style={styles.header}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {getInitials(review.user_name || 'Anonymous')}
          </Text>
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.userName}>{review.user_name || 'Anonymous'}</Text>
          <Text style={styles.date}>
            {formatRelativeTime(review.created_at)}
          </Text>
        </View>

        {/* Star Rating Badge */}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingBadgeText}>{review.rating}</Text>
          <Star size={10} color={colors.white} fill={colors.white} />
        </View>
      </View>

      {/* Stars Row */}
      <View style={styles.starsRow}>
        {stars.map((filled, i) => (
          <Star
            key={i}
            size={14}
            color={filled ? colors.rating : colors.border}
            fill={filled ? colors.rating : 'transparent'}
          />
        ))}
      </View>

      {/* Review Text */}
      {review.comment && (
        <Text style={styles.comment}>{review.comment}</Text>
      )}
    </View>
  );
}

// ──────────────────────────────────────────
//  Review Stats Bar
// ──────────────────────────────────────────

interface ReviewStatsBarProps {
  averageRating: number;
  totalReviews: number;
  ratingDistribution?: Record<number, number>;
  style?: ViewStyle;
}

export function ReviewStatsBar({
  averageRating,
  totalReviews,
  ratingDistribution,
  style,
}: ReviewStatsBarProps) {
  return (
    <View style={[styles.statsContainer, style]}>
      {/* Left: Big number */}
      <View style={styles.statsLeft}>
        <Text style={styles.bigRating}>{averageRating.toFixed(1)}</Text>
        <View style={styles.starsRow}>
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={14}
              color={i < Math.round(averageRating) ? colors.rating : colors.border}
              fill={i < Math.round(averageRating) ? colors.rating : 'transparent'}
            />
          ))}
        </View>
        <Text style={styles.totalReviews}>{totalReviews} reviews</Text>
      </View>

      {/* Right: Distribution Bars */}
      {ratingDistribution && (
        <View style={styles.statsRight}>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingDistribution[star] ?? 0;
            const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <View key={star} style={styles.barRow}>
                <Text style={styles.barLabel}>{star}</Text>
                <Star size={10} color={colors.rating} fill={colors.rating} />
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${pct}%` },
                      pct > 60
                        ? { backgroundColor: colors.success }
                        : pct > 30
                        ? { backgroundColor: colors.primary }
                        : { backgroundColor: colors.warning },
                    ]}
                  />
                </View>
                <Text style={styles.barCount}>{count}</Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    ...typography.labelMedium,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
  },
  userName: {
    ...typography.labelMedium,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  date: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  ratingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
    marginRight: 2,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  comment: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 20,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
  },
  statsLeft: {
    alignItems: 'center',
    marginRight: spacing.lg,
    minWidth: 70,
  },
  bigRating: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 40,
  },
  totalReviews: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
  statsRight: {
    flex: 1,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    width: 12,
    textAlign: 'right',
    marginRight: 3,
  },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginHorizontal: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  barCount: {
    fontSize: 10,
    color: colors.textTertiary,
    width: 20,
    textAlign: 'right',
  },
});

export default ReviewCard;
