// Products List Screen

import React, { useCallback } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SearchHeader from '../../../components/common/SearchHeader';
import ProductCard from '../../../components/products/ProductCard';
import FloatingActionButton from '../../../components/common/FloatingActionButton';
import EmptyState from '../../../components/common/EmptyState';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { useProducts } from '../../../hooks/useProducts';
import { useFilterStore } from '../../../stores/filterStore';
import { useDebounce } from '../../../hooks/useDebounce';
import { colors } from '../../../theme/colors';
import { spacing, borderRadius } from '../../../theme/spacing';

export default function ProductsListScreen() {
  const router = useRouter();
  const { productSearch, productViewMode, setProductFilter } = useFilterStore();
  const setProductSearch = (search: string) => setProductFilter({ productSearch: search });
  const setProductViewMode = (mode: 'grid' | 'list') => setProductFilter({ productViewMode: mode });
  const debouncedSearch = useDebounce(productSearch, 400);

  const { data, isLoading, isRefetching, refetch } = useProducts({
    search: debouncedSearch || undefined,
    page: 1,
  });

  const products = (data as any)?.products || (data as any)?.data || [];

  const toggleView = () => {
    setProductViewMode(productViewMode === 'grid' ? 'list' : 'grid');
  };

  const renderItem = useCallback(({ item }: { item: any }) => (
    <ProductCard
      product={item}
      viewMode={productViewMode}
      onPress={() => router.push(`/(auth)/products/${item.product_id}`)}
    />
  ), [productViewMode]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <SearchHeader
            value={productSearch}
            onChangeText={setProductSearch}
            placeholder="Search products..."
          />
        </View>
        <TouchableOpacity style={styles.viewToggle} onPress={toggleView}>
          <MaterialCommunityIcons
            name={productViewMode === 'grid' ? 'view-list' : 'view-grid'}
            size={22}
            color={colors.primary[600]}
          />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingList}>
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} style={styles.skeletonCard} />)}
        </View>
      ) : products.length === 0 ? (
        <EmptyState
          icon="shopping"
          title="No Products"
          description={productSearch ? 'Try a different search' : 'Add your first product'}
          actionLabel="Add Product"
          onAction={() => router.push('/(auth)/products/create')}
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.product_id)}
          renderItem={renderItem}
          numColumns={productViewMode === 'grid' ? 2 : 1}
          key={productViewMode}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[colors.primary[600]]} />
          }
        />
      )}

      <FloatingActionButton
        icon="plus"
        onPress={() => router.push('/(auth)/products/create')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.sm,
  },
  viewToggle: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  list: {
    padding: spacing.md,
    paddingTop: 0,
  },
  loadingList: {
    padding: spacing.md,
  },
  skeletonCard: {
    height: 90,
    marginBottom: spacing.sm,
  },
});
