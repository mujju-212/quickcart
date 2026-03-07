import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ViewStyle,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing } from '@theme/spacing';
import type { Product } from '@services/productService';

// Forward import — ProductCard will be in product components
// We import lazily to avoid circular deps
import { ProductCard } from '@components/product/ProductCard';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

interface ProductSectionProps {
  title: string;
  products: Product[];
  onSeeAll?: () => void;
  horizontal?: boolean;
  loading?: boolean;
  animationDelay?: number;
  style?: ViewStyle;
}

// ──────────────────────────────────────────
//  Component
// ──────────────────────────────────────────

export function ProductSection({
  title,
  products,
  onSeeAll,
  horizontal = true,
  loading = false,
  animationDelay = 300,
  style,
}: ProductSectionProps) {
  const router = useRouter();

  if (!products.length && !loading) return null;

  return (
    <Animated.View
      entering={FadeInUp.delay(animationDelay).duration(400)}
      style={[styles.wrapper, style]}
    >
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {onSeeAll && (
          <Pressable onPress={onSeeAll}>
            <Text style={styles.seeAll}>See All</Text>
          </Pressable>
        )}
      </View>

      {/* Product List */}
      {horizontal ? (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item, index }) => (
            <ProductCard
              product={item}
              onPress={() => router.push(`/product/${item.id}`)}
              style={{ width: 160, marginRight: spacing.md }}
              animationDelay={index * 80}
            />
          )}
        />
      ) : (
        <View style={styles.grid}>
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => router.push(`/product/${product.id}`)}
              style={styles.gridItem}
              animationDelay={index * 80}
            />
          ))}
        </View>
      )}
    </Animated.View>
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
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
  horizontalList: {
    paddingHorizontal: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  gridItem: {
    width: '47%',
  },
});

export default ProductSection;
