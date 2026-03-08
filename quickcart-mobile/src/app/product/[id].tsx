import React, { useCallback, useMemo, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Dimensions,
} from 'react-native';
import AnimatedRN, { FadeInUp, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { ImageGallery } from '@components/product';
import { ReviewCard, ReviewStatsBar } from '@components/product';
import { QuantitySelector, AddToCartButton } from '@components/product';
import { Badge, Button, Skeleton, BottomSheet } from '@components/ui';
import { ErrorState } from '@components/common';
import { useQuery } from '@tanstack/react-query';
import productService from '@services/productService';
import reviewService, { Review } from '@services/reviewService';
import { useAddToCart } from '@hooks/useCart';
import { useWishlistStore } from '@stores/wishlistStore';
import { useCartStore } from '@stores/cartStore';
import { QUERY_KEYS } from '@utils/constants';
import { formatPrice, calculateDiscount } from '@utils/helpers';
import { triggerHaptic } from '@utils/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ──────────────────────────────────────────
//  Product Detail Screen
// ──────────────────────────────────────────

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { top, bottom } = useSafeAreaInsets();
  const addToCartMutation = useAddToCart();
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.isInWishlist(Number(id)));
  const cartItems = useCartStore((s) => s.items);

  const [descExpanded, setDescExpanded] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // ── Fetch Product ──
  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [...QUERY_KEYS.products, id],
    queryFn: () => productService.getProductById(Number(id)),
    enabled: !!id,
  });

  // ── Fetch Reviews ──
  const { data: reviewsData } = useQuery({
    queryKey: [...QUERY_KEYS.reviews(Number(id))],
    queryFn: () => reviewService.getProductReviews(Number(id)),
    enabled: !!id,
  });

  // ── Fetch Review Stats ──
  const { data: reviewStats } = useQuery({
    queryKey: [...QUERY_KEYS.reviews(Number(id)), 'stats'],
    queryFn: () => reviewService.getReviewStats(Number(id)),
    enabled: !!id,
  });

  const reviews: Review[] = reviewsData?.reviews ?? [];
  const displayReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  // Cart quantity for this product
  const cartItem = cartItems.find(
    (i) => String(i.id || i.product_id) === String(id)
  );
  const cartQuantity = cartItem?.quantity || 0;

  // ── Computed ──
  const discountPercent = useMemo(() => {
    if (!product?.original_price || !product?.price) return 0;
    return calculateDiscount(product.original_price, product.price);
  }, [product]);

  const images = useMemo(() => {
    if (!product) return [];
    const imgs = [];
    if (product.image_url) imgs.push(product.image_url);
    if (product.images) imgs.push(...product.images);
    if (product.additional_images) imgs.push(...product.additional_images);
    return [...new Set(imgs)]; // deduplicate
  }, [product]);

  // ── Handlers ──
  const handleShare = useCallback(async () => {
    if (!product) return;
    try {
      await Share.share({
        message: `Check out ${product.name} on QuickCart! ${formatPrice(product.price)}`,
      });
    } catch {}
  }, [product]);

  const handleWishlistToggle = useCallback(() => {
    if (!id) return;
    if (product) toggleWishlist(product);
    triggerHaptic('selection');
  }, [id, product, toggleWishlist]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addToCartMutation.mutate({ productId: product.id, quantity: 1 });
  }, [product, addToCartMutation]);

  const handleWriteReview = useCallback(() => {
    router.push({ pathname: '/review/write', params: { productId: id } });
  }, [id, router]);

  // ── Loading / Error ──
  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: top }]}>
        <Skeleton width={SCREEN_WIDTH} height={SCREEN_WIDTH} />
        <View style={styles.padded}>
          <Skeleton width={200} height={24} borderRadius={6} style={{ marginTop: 16 }} />
          <Skeleton width={120} height={18} borderRadius={6} style={{ marginTop: 8 }} />
          <Skeleton width={SCREEN_WIDTH - 32} height={80} borderRadius={8} style={{ marginTop: 16 }} />
        </View>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={[styles.container, { paddingTop: top }]}>
        <ErrorState preset="server" onRetry={refetch} />
      </View>
    );
  }

  const inStock = product.stock > 0 || product.in_stock !== false;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottom + 90 }}
      >
        {/* Image Gallery */}
        <View style={{ position: 'relative' }}>
          <ImageGallery images={images} />

          {/* Floating header buttons */}
          <View style={[styles.floatingHeader, { top: top + spacing.xs }]}>
            <TouchableOpacity
              style={styles.floatingBtn}
              onPress={() => router.back()}
            >
              <ArrowLeft size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            <View style={styles.floatingRight}>
              <TouchableOpacity style={styles.floatingBtn} onPress={handleShare}>
                <Share2 size={20} color={colors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.floatingBtn} onPress={handleWishlistToggle}>
                <Heart
                  size={20}
                  color={isWishlisted ? colors.error : colors.textPrimary}
                  fill={isWishlisted ? colors.error : 'none'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Discount badge */}
          {discountPercent > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discountPercent}% OFF</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.padded}>
          {/* Category & Brand */}
          <AnimatedRN.View entering={FadeInUp.delay(100).springify()} style={styles.metaRow}>
            {product.category_name && (
              <Badge variant="neutral" size="sm" text={product.category_name} />
            )}
            {product.brand && (
              <Text style={styles.brand}>{product.brand}</Text>
            )}
          </AnimatedRN.View>

          {/* Name */}
          <AnimatedRN.Text
            entering={FadeInUp.delay(150).springify()}
            style={styles.productName}
          >
            {product.name}
          </AnimatedRN.Text>

          {/* Rating */}
          {(product.average_rating || reviewStats?.average_rating) && (
            <AnimatedRN.View entering={FadeInUp.delay(200).springify()} style={styles.ratingRow}>
              <Star size={16} color={colors.warning} fill={colors.warning} />
              <Text style={styles.ratingText}>
                {(product.average_rating || reviewStats?.average_rating || 0).toFixed(1)}
              </Text>
              <Text style={styles.ratingCount}>
                ({reviewStats?.total_reviews || product.review_count || 0} reviews)
              </Text>
            </AnimatedRN.View>
          )}

          {/* Price */}
          <AnimatedRN.View entering={FadeInUp.delay(250).springify()} style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            {product.original_price && product.original_price > product.price && (
              <Text style={styles.originalPrice}>
                {formatPrice(product.original_price)}
              </Text>
            )}
            {discountPercent > 0 && (
              <Text style={styles.savingsText}>
                Save {formatPrice(product.original_price! - product.price)}
              </Text>
            )}
          </AnimatedRN.View>

          {/* Stock status */}
          {!inStock && (
            <View style={styles.outOfStockBanner}>
              <Text style={styles.outOfStockText}>Currently Out of Stock</Text>
            </View>
          )}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Features / Trust badges */}
          <AnimatedRN.View entering={FadeInUp.delay(300).springify()} style={styles.trustRow}>
            <View style={styles.trustItem}>
              <Truck size={18} color={colors.success} />
              <Text style={styles.trustText}>Free Delivery</Text>
            </View>
            <View style={styles.trustItem}>
              <RotateCcw size={18} color={colors.info} />
              <Text style={styles.trustText}>7-Day Return</Text>
            </View>
            <View style={styles.trustItem}>
              <ShieldCheck size={18} color={colors.primary} />
              <Text style={styles.trustText}>Genuine</Text>
            </View>
          </AnimatedRN.View>

          <View style={styles.divider} />

          {/* Description */}
          <AnimatedRN.View entering={FadeInUp.delay(350).springify()}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text
              style={styles.description}
              numberOfLines={descExpanded ? undefined : 4}
            >
              {product.description || 'No description available.'}
            </Text>
            {product.description && product.description.length > 200 && (
              <TouchableOpacity
                onPress={() => setDescExpanded(!descExpanded)}
                style={styles.expandBtn}
              >
                <Text style={styles.expandText}>
                  {descExpanded ? 'Show Less' : 'Read More'}
                </Text>
                {descExpanded ? (
                  <ChevronUp size={14} color={colors.primary} />
                ) : (
                  <ChevronDown size={14} color={colors.primary} />
                )}
              </TouchableOpacity>
            )}
          </AnimatedRN.View>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <AnimatedRN.View entering={FadeInUp.delay(400).springify()}>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Specifications</Text>
              {Object.entries(product.specifications).map(([key, value]) => (
                <View key={key} style={styles.specRow}>
                  <Text style={styles.specKey}>{key}</Text>
                  <Text style={styles.specValue}>{String(value)}</Text>
                </View>
              ))}
            </AnimatedRN.View>
          )}

          {/* Reviews */}
          <View style={styles.divider} />
          <AnimatedRN.View entering={FadeInUp.delay(450).springify()}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <TouchableOpacity onPress={handleWriteReview}>
                <Text style={styles.writeReviewText}>Write a Review</Text>
              </TouchableOpacity>
            </View>

            {/* Review Stats */}
            {reviewStats && (
              <ReviewStatsBar
                averageRating={reviewStats.average_rating}
                totalReviews={reviewStats.total_reviews}
                ratingDistribution={reviewStats.rating_distribution as unknown as Record<number, number>}
              />
            )}

            {/* Review List */}
            {displayReviews.length > 0 ? (
              <View style={styles.reviewList}>
                {displayReviews.map((review: any, i: number) => (
                  <ReviewCard key={review.id || i} review={review} />
                ))}
                {reviews.length > 3 && !showAllReviews && (
                  <TouchableOpacity
                    onPress={() => setShowAllReviews(true)}
                    style={styles.viewAllReviews}
                  >
                    <Text style={styles.viewAllText}>
                      View All {reviews.length} Reviews
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <Text style={styles.noReviews}>No reviews yet. Be the first to review!</Text>
            )}
          </AnimatedRN.View>
        </View>
      </ScrollView>

      {/* Bottom Add-to-Cart Bar */}
      {inStock && (
        <AnimatedRN.View
          entering={SlideInDown.springify()}
          style={[styles.bottomBar, { paddingBottom: bottom + spacing.xs }]}
        >
          <View style={styles.bottomPriceWrap}>
            <Text style={styles.bottomPrice}>{formatPrice(product.price)}</Text>
            {discountPercent > 0 && (
              <Text style={styles.bottomDiscount}>{discountPercent}% off</Text>
            )}
          </View>

          {cartQuantity > 0 ? (
            <QuantitySelector
              quantity={cartQuantity}
              onChange={(qty: number) => {
                // quantity changes handled by store sync
              }}
              min={0}
              max={product.stock || 99}
            />
          ) : (
            <Button
              title="Add to Cart"
              onPress={handleAddToCart}
              style={styles.addToCartBtn}
            />
          )}
        </AnimatedRN.View>
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
    backgroundColor: colors.white,
  },
  padded: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  floatingHeader: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  floatingBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  floatingRight: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  discountBadge: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    backgroundColor: colors.error,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  discountText: {
    ...typography.labelSmall,
    color: colors.white,
    fontWeight: '800',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  brand: {
    ...typography.caption,
    color: colors.textTertiary,
    fontWeight: '600',
  },
  productName: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '800',
    lineHeight: 28,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  ratingText: {
    ...typography.labelMedium,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  ratingCount: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  price: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: '900',
  },
  originalPrice: {
    ...typography.bodyMedium,
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  savingsText: {
    ...typography.labelSmall,
    color: colors.success,
    fontWeight: '700',
  },
  outOfStockBanner: {
    backgroundColor: '#FFF3F3',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginTop: spacing.sm,
    alignItems: 'center',
  },
  outOfStockText: {
    ...typography.labelMedium,
    color: colors.error,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  trustItem: {
    alignItems: 'center',
    gap: 4,
  },
  trustText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  sectionTitle: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  expandText: {
    ...typography.labelSmall,
    color: colors.primary,
    fontWeight: '700',
  },
  specRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  specKey: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    fontWeight: '600',
    width: '40%',
  },
  specValue: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  writeReviewText: {
    ...typography.labelSmall,
    color: colors.primary,
    fontWeight: '700',
  },
  reviewList: {
    gap: spacing.sm,
  },
  viewAllReviews: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  viewAllText: {
    ...typography.labelMedium,
    color: colors.primary,
    fontWeight: '700',
  },
  noReviews: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 10,
  },
  bottomPriceWrap: {
    gap: 2,
  },
  bottomPrice: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '900',
  },
  bottomDiscount: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '700',
  },
  addToCartBtn: {
    minWidth: 140,
  },
});
