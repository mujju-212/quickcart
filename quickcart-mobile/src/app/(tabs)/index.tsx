import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import AnimatedRN, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing } from '@theme/spacing';
import {
  DeliveryHeader,
  HeroBanner,
  CategoryRow,
  ProductSection,
  OfferBanner,
} from '@components/home';
import { MiniCartBar } from '@components/cart';
import { BannerSkeleton, CategoryRowSkeleton, ProductCardSkeleton } from '@components/ui';
import { useProducts } from '@hooks/useProducts';
import { useCartStore } from '@stores/cartStore';
import productService from '@services/productService';
import bannerService from '@services/bannerService';
import categoryService from '@services/categoryService';
import offerService from '@services/offerService';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@utils/constants';
import type { Banner } from '@services/bannerService';
import type { Category } from '@services/categoryService';
import type { Product } from '@services/productService';
import type { Offer } from '@services/offerService';

// ──────────────────────────────────────────
//  Home Tab Screen
// ──────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const cartItems = useCartStore((s) => s.items);

  // ── Data Queries ──
  const {
    data: banners = [],
    isLoading: bannersLoading,
    refetch: refetchBanners,
  } = useQuery<Banner[]>({
    queryKey: QUERY_KEYS.banners,
    queryFn: bannerService.getActiveBanners,
  });

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    refetch: refetchCategories,
  } = useQuery<Category[]>({
    queryKey: QUERY_KEYS.categories,
    queryFn: categoryService.getCategories,
  });

  const {
    data: featuredProducts = [],
    isLoading: featuredLoading,
    refetch: refetchFeatured,
  } = useQuery<Product[]>({
    queryKey: [...QUERY_KEYS.products, 'featured'],
    queryFn: () => productService.getProducts({ limit: 10 }),
  });

  const {
    data: newArrivals = [],
    isLoading: newLoading,
    refetch: refetchNew,
  } = useQuery<Product[]>({
    queryKey: [...QUERY_KEYS.products, 'new'],
    queryFn: () => productService.getProducts({ limit: 10 }),
  });

  const {
    data: topDeals = [],
    isLoading: dealsLoading,
    refetch: refetchDeals,
  } = useQuery<Product[]>({
    queryKey: [...QUERY_KEYS.products, 'deals'],
    queryFn: () => productService.getProducts({ limit: 10 }),
  });

  const {
    data: offers = [],
    isLoading: offersLoading,
    refetch: refetchOffers,
  } = useQuery<Offer[]>({
    queryKey: QUERY_KEYS.offers,
    queryFn: offerService.getActiveOffers,
  });

  const isLoading = bannersLoading || categoriesLoading || featuredLoading;

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refetchBanners(),
      refetchCategories(),
      refetchFeatured(),
      refetchNew(),
      refetchDeals(),
      refetchOffers(),
    ]);
    setRefreshing(false);
  }, []);

  // ── Handlers ──
  const handleSeeAllFeatured = useCallback(() => {
    router.push({ pathname: '/category/[id]', params: { id: 'featured', name: 'Featured' } });
  }, [router]);

  const handleSeeAllNew = useCallback(() => {
    router.push({ pathname: '/category/[id]', params: { id: 'new', name: 'New Arrivals' } });
  }, [router]);

  const handleSeeAllDeals = useCallback(() => {
    router.push({ pathname: '/category/[id]', params: { id: 'deals', name: 'Top Deals' } });
  }, [router]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: top }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Delivery Header */}
        <DeliveryHeader />

        {/* Hero Banners */}
        {bannersLoading ? (
          <BannerSkeleton />
        ) : (
          <HeroBanner
            banners={banners}
          />
        )}

        {/* Categories */}
        <AnimatedRN.View entering={FadeInUp.delay(100).springify()}>
          {categoriesLoading ? (
            <CategoryRowSkeleton />
          ) : (
            <CategoryRow
              categories={categories}
            />
          )}
        </AnimatedRN.View>

        {/* Featured Products */}
        <AnimatedRN.View entering={FadeInUp.delay(200).springify()}>
          {featuredLoading ? (
            <View style={styles.skeletonSection}>
              <ProductCardSkeleton />
            </View>
          ) : (
            <ProductSection
              title="Featured Products"
              products={featuredProducts}
              onSeeAll={handleSeeAllFeatured}
              horizontal
            />
          )}
        </AnimatedRN.View>

        {/* Offer Banner */}
        {offers.length > 0 && (
          <AnimatedRN.View entering={FadeInUp.delay(250).springify()}>
            <OfferBanner offers={offers.slice(0, 1)} />
          </AnimatedRN.View>
        )}

        {/* New Arrivals */}
        <AnimatedRN.View entering={FadeInUp.delay(300).springify()}>
          {newLoading ? (
            <View style={styles.skeletonSection}>
              <ProductCardSkeleton />
            </View>
          ) : (
            <ProductSection
              title="New Arrivals"
              products={newArrivals}
              onSeeAll={handleSeeAllNew}
              horizontal
            />
          )}
        </AnimatedRN.View>

        {/* Top Deals */}
        <AnimatedRN.View entering={FadeInUp.delay(400).springify()}>
          {dealsLoading ? (
            <View style={styles.skeletonSection}>
              <ProductCardSkeleton />
            </View>
          ) : (
            <ProductSection
              title="Top Deals"
              products={topDeals}
              onSeeAll={handleSeeAllDeals}
              horizontal
            />
          )}
        </AnimatedRN.View>

        {/* Second offer banner */}
        {offers.length > 1 && (
          <AnimatedRN.View entering={FadeInUp.delay(450).springify()}>
            <OfferBanner offers={offers.slice(1, 2)} />
          </AnimatedRN.View>
        )}

        {/* Bottom spacer for MiniCartBar */}
        {cartItems.length > 0 && <View style={{ height: 80 }} />}
      </ScrollView>

      {/* Mini Cart Bar */}
      {cartItems.length > 0 && (
        <MiniCartBar
          itemCount={cartItems.length}
          total={cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  skeletonSection: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
