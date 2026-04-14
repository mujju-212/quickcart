// TopProductsList — Ranked list of top-selling products

import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { formatPrice } from '../../utils/helpers';

interface TopProduct {
  id: number;
  name: string;
  image_url?: string;
  units_sold: number;
  revenue: number;
}

interface TopProductsListProps {
  data: TopProduct[];
  onProductPress?: (id: number) => void;
}

export default function TopProductsList({ data, onProductPress }: TopProductsListProps) {
  if (!data || data.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Selling Products</Text>

      {data.map((product, index) => (
        <TouchableOpacity
          key={product.id}
          style={styles.row}
          onPress={() => onProductPress?.(product.id)}
          activeOpacity={0.7}
        >
          {/* Rank */}
          <View style={[styles.rank, index < 3 && styles.rankTop]}>
            <Text style={[styles.rankText, index < 3 && styles.rankTextTop]}>
              {index + 1}
            </Text>
          </View>

          {/* Image */}
          {product.image_url ? (
            <Image source={{ uri: product.image_url }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <MaterialCommunityIcons name="package-variant" size={18} color={colors.text.disabled} />
            </View>
          )}

          {/* Info */}
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
            <Text style={styles.qty}>{product.units_sold} sold</Text>
          </View>

          {/* Revenue */}
          <Text style={styles.revenue}>{formatPrice(product.revenue)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.cardTitle,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  rank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  rankTop: {
    backgroundColor: colors.accent,
  },
  rankText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: colors.text.secondary,
  },
  rankTextTop: {
    color: '#92400E',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  imagePlaceholder: {
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  qty: {
    ...typography.small,
    color: colors.text.tertiary,
    marginTop: 1,
  },
  revenue: {
    ...typography.bodyMedium,
    color: colors.primary[700],
    marginLeft: spacing.sm,
  },
});
