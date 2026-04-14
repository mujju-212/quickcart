// OfferCard — Offer summary card for list view

import React from 'react';
import { StyleSheet, View, TouchableOpacity, Switch } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Badge from '../common/Badge';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import { formatPrice, formatDate } from '../../utils/helpers';

interface Offer {
  offer_id: number;
  title: string;
  code: string;
  discount_type: 'percentage' | 'flat';
  discount_value: number;
  min_order_amount?: number;
  max_uses?: number;
  used_count?: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface OfferCardProps {
  offer: Offer;
  onPress: () => void;
  onToggle?: (active: boolean) => void;
}

export default function OfferCard({ offer, onPress, onToggle }: OfferCardProps) {
  const now = new Date();
  const isExpired = new Date(offer.end_date) < now;
  const isUpcoming = new Date(offer.start_date) > now;

  const statusLabel = isExpired ? 'Expired' : isUpcoming ? 'Upcoming' : offer.is_active ? 'Active' : 'Inactive';
  const statusVariant = isExpired
    ? 'error'
    : isUpcoming
    ? 'info'
    : offer.is_active
    ? 'success'
    : 'neutral';

  const discountDisplay =
    offer.discount_type === 'percentage'
      ? `${offer.discount_value}% OFF`
      : `${formatPrice(offer.discount_value)} OFF`;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Discount banner */}
      <View style={styles.discountBanner}>
        <MaterialCommunityIcons name="tag-outline" size={18} color={colors.white} />
        <Text style={styles.discountText}>{discountDisplay}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title} numberOfLines={1}>{offer.title}</Text>
            <View style={styles.codeRow}>
              <MaterialCommunityIcons name="ticket-percent-outline" size={14} color={colors.text.tertiary} />
              <Text style={styles.code}>{offer.code}</Text>
            </View>
          </View>
          <Badge label={statusLabel} variant={statusVariant} />
        </View>

        {/* Meta info */}
        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Valid</Text>
            <Text style={styles.metaValue}>
              {formatDate(offer.start_date)} - {formatDate(offer.end_date)}
            </Text>
          </View>
          {offer.min_order_amount !== undefined && offer.min_order_amount > 0 && (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Min Order</Text>
              <Text style={styles.metaValue}>{formatPrice(offer.min_order_amount)}</Text>
            </View>
          )}
          {offer.max_uses !== undefined && (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Usage</Text>
              <Text style={styles.metaValue}>{offer.used_count || 0} / {offer.max_uses}</Text>
            </View>
          )}
        </View>

        {/* Toggle row */}
        {onToggle && !isExpired && (
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Active</Text>
            <Switch
              value={offer.is_active}
              onValueChange={onToggle}
              trackColor={{ false: colors.background.tertiary, true: colors.primary[200] }}
              thumbColor={offer.is_active ? colors.primary[600] : colors.text.disabled}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  discountBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary[600],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  discountText: {
    color: colors.white,
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
  },
  body: {
    padding: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    fontFamily: 'Inter_600SemiBold',
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  code: {
    ...typography.small,
    fontFamily: 'Inter_600SemiBold',
    color: colors.primary[700],
    letterSpacing: 0.8,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  metaItem: {},
  metaLabel: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    color: colors.text.disabled,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  metaValue: {
    ...typography.small,
    color: colors.text.secondary,
    marginTop: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  toggleLabel: {
    ...typography.bodyMedium,
    color: colors.text.secondary,
  },
});
