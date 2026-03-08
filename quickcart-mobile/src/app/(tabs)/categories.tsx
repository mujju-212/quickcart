import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  Dimensions,
} from 'react-native';
import AnimatedRN, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Grid3X3, ChevronRight } from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { Header } from '@components/common';
import { Skeleton } from '@components/ui';
import { useQuery } from '@tanstack/react-query';
import categoryService from '@services/categoryService';
import type { Category } from '@services/categoryService';
import { QUERY_KEYS } from '@utils/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NUM_COLUMNS = 3;
const CARD_GAP = spacing.sm;
const CARD_SIZE = (SCREEN_WIDTH - spacing.md * 2 - CARD_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

// ──────────────────────────────────────────
//  Categories Tab Screen
// ──────────────────────────────────────────

export default function CategoriesScreen() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  const {
    data: categories = [],
    isLoading,
    refetch,
  } = useQuery<Category[]>({
    queryKey: QUERY_KEYS.categories,
    queryFn: categoryService.getCategories,
  });

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleCategoryPress = useCallback(
    (category: any) => {
      router.push({
        pathname: '/category/[id]',
        params: { id: category.id, name: category.name },
      });
    },
    [router]
  );

  const renderCategory = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      const emoji = '📦';
      return (
        <AnimatedRN.View entering={FadeInUp.delay(index * 50).springify()}>
          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(item)}
            activeOpacity={0.7}
          >
            {/* Image or Emoji */}
            <View style={styles.imageWrap}>
              {item.image_url ? (
                <Image source={{ uri: item.image_url }} style={styles.categoryImage} />
              ) : (
                <Text style={styles.emoji}>{emoji}</Text>
              )}
            </View>

            {/* Name */}
            <Text style={styles.categoryName} numberOfLines={2}>
              {item.name}
            </Text>

            {/* Product count if available */}
            {item.product_count != null && (
              <Text style={styles.productCount}>{item.product_count} items</Text>
            )}
          </TouchableOpacity>
        </AnimatedRN.View>
      );
    },
    [handleCategoryPress]
  );

  const renderSkeleton = () => (
    <View style={styles.skeletonGrid}>
      {Array.from({ length: 9 }).map((_, i) => (
        <View key={i} style={styles.skeletonCard}>
          <Skeleton width={CARD_SIZE - 24} height={CARD_SIZE - 24} borderRadius={borderRadius.md} />
          <Skeleton width={60} height={14} borderRadius={4} style={{ marginTop: 8 }} />
        </View>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <Header title="Categories" />

      {isLoading ? (
        renderSkeleton()
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => String(item.id)}
          numColumns={NUM_COLUMNS}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Grid3X3 size={48} color={colors.textTertiary} />
              <Text style={styles.emptyText}>No categories available</Text>
            </View>
          }
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
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  row: {
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
  categoryCard: {
    width: CARD_SIZE,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  imageWrap: {
    width: CARD_SIZE - 32,
    height: CARD_SIZE - 32,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  emoji: {
    fontSize: 36,
  },
  categoryName: {
    ...typography.labelSmall,
    color: colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
  },
  productCount: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.bodyMedium,
    color: colors.textTertiary,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  skeletonCard: {
    width: CARD_SIZE,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
});
