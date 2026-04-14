// ProductCard — Product summary card for grid/list views

import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Badge from '../common/Badge';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import { formatPrice, getStockStatus } from '../../utils/helpers';

interface ProductCardProps {
  product: {
    product_id: number;
    name: string;
    price: number;
    original_price?: number;
    image_url?: string;
    stock_quantity: number;
    is_active: boolean;
    category_name?: string;
  };
  viewMode?: 'grid' | 'list';
  onPress: () => void;
  onToggleActive?: () => void;
}

export default function ProductCard({ product, viewMode = 'grid', onPress, onToggleActive }: ProductCardProps) {
  const stockInfo = getStockStatus(product.stock_quantity);
  const stockVariant = stockInfo === 'out_of_stock' ? 'error' : stockInfo === 'low_stock' ? 'warning' : 'success';

  if (viewMode === 'list') {
    return (
      <TouchableOpacity style={styles.listCard} onPress={onPress} activeOpacity={0.7}>
        {product.image_url ? (
          <Image source={{ uri: product.image_url }} style={styles.listImage} />
        ) : (
          <View style={[styles.listImage, styles.imagePlaceholder]}>
            <MaterialCommunityIcons name="image-outline" size={24} color={colors.text.disabled} />
          </View>
        )}
        <View style={styles.listInfo}>
          <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
          <View style={styles.metaRow}>
            {product.category_name && <Text style={styles.category}>{product.category_name}</Text>}
            <Badge label={stockInfo} variant={stockVariant} size="sm" />
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            {product.original_price && product.original_price > product.price && (
              <Text style={styles.originalPrice}>{formatPrice(product.original_price)}</Text>
            )}
          </View>
        </View>
        {!product.is_active && (
          <View style={styles.inactiveBadge}>
            <Text style={styles.inactiveText}>Inactive</Text>
          </View>
        )}
        <MaterialCommunityIcons name="chevron-right" size={20} color={colors.text.disabled} />
      </TouchableOpacity>
    );
  }

  // Grid view
  return (
    <TouchableOpacity style={styles.gridCard} onPress={onPress} activeOpacity={0.7}>
      {product.image_url ? (
        <Image source={{ uri: product.image_url }} style={styles.gridImage} />
      ) : (
        <View style={[styles.gridImage, styles.imagePlaceholder]}>
          <MaterialCommunityIcons name="image-outline" size={32} color={colors.text.disabled} />
        </View>
      )}
      {!product.is_active && (
        <View style={styles.inactiveOverlay}>
          <Text style={styles.inactiveOverlayText}>Inactive</Text>
        </View>
      )}
      <View style={styles.gridBody}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <View style={styles.gridBottomRow}>
          <Badge label={stockInfo} variant={stockVariant} size="sm" />
          <Text style={styles.stockQty}>{product.stock_quantity}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // List view
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  listImage: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
  },
  listInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 2,
  },
  category: {
    ...typography.small,
    color: colors.text.tertiary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
  },
  originalPrice: {
    ...typography.small,
    color: colors.text.disabled,
    textDecorationLine: 'line-through',
  },
  inactiveBadge: {
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    marginRight: spacing.xs,
  },
  inactiveText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text.disabled,
  },

  // Grid view
  gridCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    flex: 1,
    margin: spacing.xs,
  },
  gridImage: {
    width: '100%',
    height: 120,
  },
  imagePlaceholder: {
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveOverlayText: {
    color: colors.white,
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
  },
  gridBody: {
    padding: spacing.sm,
  },
  name: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  price: {
    ...typography.bodyMedium,
    color: colors.primary[700],
    fontFamily: 'Inter_700Bold',
    marginTop: 2,
  },
  gridBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  stockQty: {
    ...typography.small,
    color: colors.text.tertiary,
  },
});
