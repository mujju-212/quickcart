import React, { useCallback } from 'react';
import { View, StyleSheet, Dimensions, ViewStyle } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '@components/ui';
import { EmptyState } from '@components/common';
import { spacing } from '@theme/spacing';
import type { Product } from '@services/productService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NUM_COLUMNS = 2;
const CARD_GAP = spacing.md;
const CARD_WIDTH = (SCREEN_WIDTH - spacing.lg * 2 - CARD_GAP) / NUM_COLUMNS;

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onAddToCart?: (product: Product) => void;
  onEndReached?: () => void;
  ListHeaderComponent?: React.ReactElement;
  ListFooterComponent?: React.ReactElement;
  style?: ViewStyle;
  emptyPreset?: 'products' | 'search';
}

// ──────────────────────────────────────────
//  Component
// ──────────────────────────────────────────

export function ProductGrid({
  products,
  loading,
  onAddToCart,
  onEndReached,
  ListHeaderComponent,
  ListFooterComponent,
  style,
  emptyPreset = 'products',
}: ProductGridProps) {
  const router = useRouter();

  const renderItem = useCallback(
    ({ item, index }: { item: Product; index: number }) => (
      <View style={[styles.cardWrap, index % 2 === 0 ? styles.leftCard : styles.rightCard]}>
        <ProductCard
          product={item}
          onPress={() => router.push(`/product/${item.id}`)}
          onAddToCart={onAddToCart ? () => onAddToCart(item) : undefined}
          animationDelay={Math.min(index * 60, 600)}
        />
      </View>
    ),
    [router, onAddToCart],
  );

  // Loading skeleton
  if (loading && !products.length) {
    return (
      <View style={[styles.skeletonGrid, style]}>
        {ListHeaderComponent}
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={[styles.cardWrap, i % 2 === 0 ? styles.leftCard : styles.rightCard]}>
            <ProductCardSkeleton />
          </View>
        ))}
      </View>
    );
  }

  return (
    <FlashList
      data={products}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      numColumns={NUM_COLUMNS}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={<EmptyState preset={emptyPreset} />}
    />
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  cardWrap: {
    flex: 1,
    marginBottom: CARD_GAP,
  },
  leftCard: {
    marginRight: CARD_GAP / 2,
  },
  rightCard: {
    marginLeft: CARD_GAP / 2,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
});

export default ProductGrid;
