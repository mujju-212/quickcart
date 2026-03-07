import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ChevronRight, Package } from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { formatPrice, formatDate } from '@utils/helpers';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@utils/constants';
import { Badge } from '@components/ui';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

export interface OrderData {
  id: string | number;
  order_number?: string;
  status: string;
  total_amount: number;
  created_at: string;
  items?: Array<{
    id: string | number;
    name: string;
    image_url?: string;
    quantity: number;
    price: number;
  }>;
  item_count?: number;
}

interface OrderCardProps {
  order: OrderData;
  onPress?: (orderId: string | number) => void;
  index?: number;
  style?: ViewStyle;
}

// ──────────────────────────────────────────
//  Status Badge variant mapping
// ──────────────────────────────────────────

function getStatusVariant(status: string) {
  const s = status?.toLowerCase();
  if (s === 'delivered') return 'success' as const;
  if (s === 'cancelled') return 'error' as const;
  if (s === 'shipped' || s === 'out_for_delivery') return 'info' as const;
  if (s === 'processing' || s === 'confirmed') return 'warning' as const;
  return 'neutral' as const;
}

// ──────────────────────────────────────────
//  Component
// ──────────────────────────────────────────

export function OrderCard({ order, onPress, index = 0, style }: OrderCardProps) {
  const items = order.items || [];
  const previewItems = items.slice(0, 3);
  const extraCount = items.length - 3;
  const itemCount = order.item_count || items.length;

  return (
    <Animated.View entering={FadeInUp.delay(index * 80).springify()}>
      <TouchableOpacity
        style={[styles.card, style]}
        activeOpacity={0.7}
        onPress={() => onPress?.(order.id)}
        disabled={!onPress}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.orderNumber}>
              #{order.order_number || order.id}
            </Text>
            <Text style={styles.date}>{formatDate(order.created_at)}</Text>
          </View>
          <Badge
            label={
              ORDER_STATUS_LABELS[order.status?.toLowerCase()] ||
              order.status?.replace(/_/g, ' ')
            }
            variant={getStatusVariant(order.status)}
            size="sm"
          />
        </View>

        {/* Item Previews */}
        {previewItems.length > 0 ? (
          <View style={styles.itemsRow}>
            {previewItems.map((item, i) => (
              <Image
                key={item.id || i}
                source={{
                  uri: item.image_url || 'https://via.placeholder.com/48',
                }}
                style={styles.itemThumb}
              />
            ))}
            {extraCount > 0 && (
              <View style={styles.extraBadge}>
                <Text style={styles.extraText}>+{extraCount}</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.itemsRow}>
            <Package size={18} color={colors.textTertiary} />
            <Text style={styles.itemCountText}>
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.total}>{formatPrice(order.total_amount)}</Text>
          {onPress && <ChevronRight size={18} color={colors.textTertiary} />}
        </View>
      </TouchableOpacity>
    </Animated.View>
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  orderNumber: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  date: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
  itemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  itemThumb: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
  },
  extraBadge: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraText: {
    ...typography.labelSmall,
    color: colors.textTertiary,
    fontWeight: '600',
  },
  itemCountText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  total: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    fontWeight: '700',
  },
});

export default OrderCard;
