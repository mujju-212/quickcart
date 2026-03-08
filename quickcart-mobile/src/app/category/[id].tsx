import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AnimatedRN, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SlidersHorizontal, ChevronDown } from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { Header } from '@components/common';
import { ProductGrid } from '@components/product';
import { Chip, BottomSheet } from '@components/ui';
import { useProducts } from '@hooks/useProducts';
import { useCartStore } from '@stores/cartStore';
import { CartFooter, MiniCartBar } from '@components/cart';

const SORT_OPTIONS = [
  { label: 'Popular', value: 'popular' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Rating', value: 'rating' },
];

const PRICE_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Under ₹500', value: '0-500' },
  { label: '₹500 - ₹1000', value: '500-1000' },
  { label: '₹1000 - ₹2000', value: '1000-2000' },
  { label: '₹2000+', value: '2000-99999' },
];

// ──────────────────────────────────────────
//  Category / Product Listing Screen
// ──────────────────────────────────────────

export default function CategoryScreen() {
  const router = useRouter();
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const { top } = useSafeAreaInsets();
  const cartItems = useCartStore((s) => s.items);

  const [sort, setSort] = useState('popular');
  const [priceFilter, setPriceFilter] = useState('');
  const [page, setPage] = useState(1);

  const queryParams = {
    category: id !== 'featured' && id !== 'new' && id !== 'deals' ? id : undefined,
    limit: 20,
  };

  const {
    data: productsData,
    isLoading,
    isFetching,
    refetch,
  } = useProducts(queryParams);

  const products = productsData || [];

  const handleLoadMore = useCallback(() => {
    if (!isFetching) {
      setPage((p) => p + 1);
    }
  }, [isFetching]);

  const screenTitle = name || (
    id === 'featured' ? 'Featured' :
    id === 'new' ? 'New Arrivals' :
    id === 'deals' ? 'Top Deals' :
    'Products'
  );

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <Header title={screenTitle} />

      {/* Filter Bar */}
      <AnimatedRN.View entering={FadeInUp.springify()} style={styles.filterBar}>
        {/* Sort */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortRow}
        >
          {SORT_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              label={opt.label}
              selected={sort === opt.value}
              onPress={() => {
                setSort(opt.value);
                setPage(1);
              }}
              size="sm"
            />
          ))}
        </ScrollView>
      </AnimatedRN.View>

      {/* Product Grid */}
      <ProductGrid
        products={products}
        loading={isLoading}
        onEndReached={handleLoadMore}
        emptyPreset="products"
      />

      {/* Mini Cart */}
      {cartItems.length > 0 && (
        <MiniCartBar
          itemCount={cartItems.length}
          total={0}
          onPress={() => router.push('/(tabs)/cart')}
        />
      )}
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
  filterBar: {
    backgroundColor: colors.white,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.xs,
  },
  sortRow: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  priceRow: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  gridContent: {
    paddingTop: spacing.sm,
    paddingBottom: 100,
  },
});
