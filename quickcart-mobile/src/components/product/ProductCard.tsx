import React, { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInUp,
} from 'react-native-reanimated';
import { Heart, Star, Plus } from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { shadows } from '@theme/shadows';
import { Badge } from '@components/ui';
import { formatPrice, calculateDiscount } from '@utils/helpers';
import { useWishlistStore } from '@stores/wishlistStore';
import { hapticPresets } from '@utils/haptics';
import type { Product } from '@services/productService';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onAddToCart?: () => void;
  style?: ViewStyle;
  animationDelay?: number;
  compact?: boolean;
}

// ──────────────────────────────────────────
//  Component
// ──────────────────────────────────────────

export function ProductCard({
  product,
  onPress,
  onAddToCart,
  style,
  animationDelay = 0,
  compact = false,
}: ProductCardProps) {
  const scale = useSharedValue(1);
  const isWishlisted = useWishlistStore((s) => s.isInWishlist(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);

  const animatedScale = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handleWishlistToggle = useCallback(() => {
    hapticPresets.tap();
    toggleWishlist(product);
  }, [product, toggleWishlist]);

  const discount = calculateDiscount(product.original_price ?? 0, product.price);
  const outOfStock = product.stock === 0 || product.status === 'out_of_stock';

  return (
    <Animated.View
      entering={FadeInUp.delay(animationDelay).duration(350).springify().damping(16)}
      style={[animatedScale, style]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={outOfStock}
        style={[styles.card, outOfStock && styles.outOfStock]}
      >
        {/* Image */}
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: product.image_url }}
            style={styles.image}
            resizeMode="cover"
          />

          {/* Discount Badge */}
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Badge text={`${discount}% OFF`} variant="discount" size="sm" />
            </View>
          )}

          {/* Wishlist Button */}
          <Pressable
            onPress={handleWishlistToggle}
            hitSlop={10}
            style={styles.wishlistBtn}
          >
            <Heart
              size={18}
              color={isWishlisted ? colors.error : colors.white}
              fill={isWishlisted ? colors.error : 'transparent'}
              strokeWidth={2}
            />
          </Pressable>

          {/* Out of Stock Overlay */}
          {outOfStock && (
            <View style={styles.oosOverlay}>
              <Text style={styles.oosText}>Out of Stock</Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={compact ? 1 : 2}>
            {product.name}
          </Text>

          {product.size && (
            <Text style={styles.size}>{product.size}</Text>
          )}

          {/* Rating */}
          {product.average_rating != null && product.average_rating > 0 && (
            <View style={styles.ratingRow}>
              <Star size={12} color={colors.rating} fill={colors.rating} />
              <Text style={styles.ratingText}>
                {product.average_rating.toFixed(1)}
              </Text>
              {product.review_count != null && product.review_count > 0 && (
                <Text style={styles.reviewCount}>({product.review_count})</Text>
              )}
            </View>
          )}

          {/* Price Row */}
          <View style={styles.priceRow}>
            <View style={styles.priceLeft}>
              <Text style={styles.price}>{formatPrice(product.price)}</Text>
              {product.original_price != null && product.original_price > product.price && (
                <Text style={styles.originalPrice}>
                  {formatPrice(product.original_price)}
                </Text>
              )}
            </View>

            {/* Add to Cart Mini Button */}
            {!outOfStock && onAddToCart && (
              <Pressable
                onPress={(e) => {
                  e.stopPropagation?.();
                  hapticPresets.press();
                  onAddToCart();
                }}
                style={styles.addBtn}
              >
                <Plus size={16} color={colors.white} />
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>
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
    overflow: 'hidden',
    ...shadows.sm,
  },
  outOfStock: {
    opacity: 0.65,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
  },
  wishlistBtn: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  oosOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  oosText: {
    ...typography.labelMedium,
    color: colors.error,
    backgroundColor: colors.errorLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  info: {
    padding: spacing.sm,
  },
  name: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '600',
    lineHeight: 18,
  },
  size: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginLeft: 3,
  },
  reviewCount: {
    ...typography.caption,
    color: colors.textTertiary,
    marginLeft: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xxs,
  },
  priceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  originalPrice: {
    ...typography.caption,
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
    marginLeft: spacing.xxs,
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProductCard;
