import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  FlatList,
  ViewStyle,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { CategoryRowSkeleton } from '@components/ui';
import type { Category } from '@services/categoryService';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

interface CategoryRowProps {
  categories: Category[];
  isLoading?: boolean;
  style?: ViewStyle;
}

// ──────────────────────────────────────────
//  Placeholder Images
// ──────────────────────────────────────────

const CATEGORY_COLORS: string[] = [
  '#FFE0B2', '#C8E6C9', '#BBDEFB', '#F8BBD0',
  '#D1C4E9', '#FFCCBC', '#B2EBF2', '#FFF9C4',
];

// ──────────────────────────────────────────
//  Component
// ──────────────────────────────────────────

export function CategoryRow({ categories, isLoading, style }: CategoryRowProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={[styles.wrapper, style]}>
        <CategoryRowSkeleton />
      </View>
    );
  }

  if (!categories.length) return null;

  return (
    <Animated.View
      entering={FadeInUp.delay(200).duration(400)}
      style={[styles.wrapper, style]}
    >
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Shop by Category</Text>
        <Pressable onPress={() => router.push('/categories')}>
          <Text style={styles.seeAll}>See All</Text>
        </Pressable>
      </View>

      {/* Horizontal Scroll */}
      <FlatList
        data={categories}
        keyExtractor={(item) => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => router.push(`/category/${item.name}`)}
            style={styles.categoryItem}
          >
            <View
              style={[
                styles.imageWrap,
                { backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] },
              ]}
            >
              {item.image_url ? (
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.categoryImage}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.categoryEmoji}>
                  {getCategoryEmoji(item.name)}
                </Text>
              )}
            </View>
            <Text style={styles.categoryName} numberOfLines={1}>
              {item.name}
            </Text>
          </Pressable>
        )}
      />
    </Animated.View>
  );
}

// ──────────────────────────────────────────
//  Helpers
// ──────────────────────────────────────────

function getCategoryEmoji(name: string): string {
  const map: Record<string, string> = {
    fruits: '🍎',
    vegetables: '🥦',
    dairy: '🥛',
    snacks: '🍿',
    beverages: '🥤',
    bakery: '🍞',
    meat: '🥩',
    frozen: '🧊',
    personal: '🧴',
    household: '🏠',
    baby: '👶',
    pet: '🐾',
  };

  const key = name.toLowerCase();
  for (const [k, v] of Object.entries(map)) {
    if (key.includes(k)) return v;
  }
  return '📦';
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
  list: {
    paddingHorizontal: spacing.lg,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: spacing.lg,
    width: 68,
  },
  imageWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: spacing.xxs,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryName: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default CategoryRow;
