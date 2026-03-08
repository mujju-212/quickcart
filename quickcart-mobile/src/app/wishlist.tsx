import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import AnimatedRN, { FadeInUp, FadeOutRight, Layout } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Heart, ShoppingCart, Trash2, X } from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { shadows } from '@theme/shadows';
import { Header, EmptyState } from '@components/common';
import { Button, Badge } from '@components/ui';
import { useWishlistStore } from '@stores/wishlistStore';
import { useCartStore } from '@stores/cartStore';
import { useProducts } from '@hooks/useProducts';
import { formatPrice, calculateDiscount } from '@utils/helpers';
import { triggerHaptic } from '@utils/haptics';

// ──────────────────────────────────────────
//  Wishlist Screen
// ──────────────────────────────────────────

export default function WishlistScreen() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  const wishlistIds = useWishlistStore((s) => s.items);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const clearWishlist = useWishlistStore((s) => s.clearAll);
  const addToCart = useCartStore((s) => s.addItem);

  // Fetch product details for wishlist items
  const { data: allProducts, isLoading, refetch, isRefetching } = useProducts({
    limit: 100,
  });

  const wishlistProducts = useMemo(() => {
    if (!allProducts) return [];
    const products = allProducts;
    const wishlistIdSet = new Set(wishlistIds.map((p: any) => p.id));
    return products.filter((p: any) =>
      wishlistIdSet.has(p.id)
    );
  }, [allProducts, wishlistIds]);

  const handleRemove = useCallback(
    (product: any) => {
      toggleWishlist(product.id?.toString() || product.id);
      triggerHaptic('impact');
    },
    [toggleWishlist]
  );

  const handleAddToCart = useCallback(
    (product: any) => {
      addToCart({
        id: product.id,
        product_id: product.id,
        name: product.name,
        price: product.discount_price || product.price,
        image_url: product.image_url || product.images?.[0],
        quantity: 1,
        size: product.size || '',
        stock: product.stock || 0,
      });
      triggerHaptic('success');
    },
    [addToCart]
  );

  const handleClearAll = useCallback(() => {
    Alert.alert(
      'Clear Wishlist',
      'Remove all items from your wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearWishlist();
            triggerHaptic('warning');
          },
        },
      ]
    );
  }, [clearWishlist]);

  const handleProductPress = useCallback(
    (product: any) => {
      router.push({ pathname: '/product/[id]', params: { id: product.id } });
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      const discount = calculateDiscount(item.original_price || item.price, item.discount_price || item.price);
      const hasDiscount = discount > 0 && item.discount_price;
      const isOutOfStock = item.stock === 0 || item.is_out_of_stock;

      return (
        <AnimatedRN.View
          entering={FadeInUp.delay(index * 60).springify()}
          exiting={FadeOutRight.springify()}
          layout={Layout.springify()}
        >
          <TouchableOpacity
            style={styles.itemCard}
            onPress={() => handleProductPress(item)}
            activeOpacity={0.7}
          >
            {/* Product Image */}
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: item.image || item.images?.[0] }}
                style={styles.productImage}
                resizeMode="cover"
              />
              {hasDiscount && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{discount}% OFF</Text>
                </View>
              )}
              {isOutOfStock && (
                <View style={styles.oosOverlay}>
                  <Text style={styles.oosText}>Out of Stock</Text>
                </View>
              )}
            </View>

            {/* Product Info */}
            <View style={styles.itemInfo}>
              <Text style={styles.productName} numberOfLines={2}>
                {item.name}
              </Text>

              {item.brand && (
                <Text style={styles.productBrand}>{item.brand}</Text>
              )}

              <View style={styles.priceRow}>
                <Text style={styles.currentPrice}>
                  {formatPrice(item.discount_price || item.price)}
                </Text>
                {hasDiscount && (
                  <Text style={styles.originalPrice}>
                    {formatPrice(item.original_price || item.price)}
                  </Text>
                )}
              </View>

              {/* Rating */}
              {item.rating && (
                <View style={styles.ratingRow}>
                  <Text style={styles.ratingText}>⭐ {item.rating.toFixed(1)}</Text>
                  {item.review_count && (
                    <Text style={styles.reviewCount}>
                      ({item.review_count})
                    </Text>
                  )}
                </View>
              )}

              {/* Actions */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.addCartBtn}
                  onPress={() => handleAddToCart(item)}
                  disabled={isOutOfStock}
                  activeOpacity={0.7}
                >
                  <ShoppingCart size={14} color={isOutOfStock ? colors.textTertiary : colors.black} />
                  <Text
                    style={[
                      styles.addCartText,
                      isOutOfStock && styles.addCartTextDisabled,
                    ]}
                  >
                    {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => handleRemove(item)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <X size={16} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </AnimatedRN.View>
      );
    },
    [handleProductPress, handleAddToCart, handleRemove]
  );

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <Header
        title="Wishlist"
        subtitle={wishlistIds.length > 0 ? `${wishlistIds.length} items` : undefined}
        rightActions={
          wishlistIds.length > 0
            ? (
                <TouchableOpacity onPress={handleClearAll}>
                  <Trash2 size={20} color={colors.error} />
                </TouchableOpacity>
              )
            : undefined
        }
      />

      <FlatList
        data={wishlistProducts}
        keyExtractor={(item: any) => item.id?.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            preset="wishlist"
            title="Your wishlist is empty"
            message="Save items you love by tapping the heart icon"
            actionLabel="Browse Products"
            onAction={() => router.push('/(tabs)')}
          />
        }
      />
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
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },

  // Item card
  itemCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    ...shadows.sm,
  },

  // Image
  imageWrapper: {
    width: 120,
    height: 140,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.grey100,
  },
  discountBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: colors.error,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  discountText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
    fontSize: 10,
  },
  oosOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  oosText: {
    ...typography.labelSmall,
    color: colors.white,
    fontWeight: '700',
  },

  // Info
  itemInfo: {
    flex: 1,
    padding: spacing.sm,
    justifyContent: 'space-between',
  },
  productName: {
    ...typography.bodyMedium,
    color: colors.text,
    fontWeight: '600',
    lineHeight: 20,
  },
  productBrand: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 4,
  },
  currentPrice: {
    ...typography.h5,
    color: colors.text,
  },
  originalPrice: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '600',
  },
  reviewCount: {
    ...typography.caption,
    color: colors.textTertiary,
  },

  // Actions
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  addCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    flex: 1,
    justifyContent: 'center',
  },
  addCartText: {
    ...typography.labelSmall,
    color: colors.black,
    fontWeight: '700',
  },
  addCartTextDisabled: {
    color: colors.textTertiary,
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    backgroundColor: colors.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
