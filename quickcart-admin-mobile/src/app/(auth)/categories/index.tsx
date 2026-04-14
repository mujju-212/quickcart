// Categories List Screen

import React, { useState, useCallback } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, Alert, TouchableOpacity, Image } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../../services/categoryService';
import SearchHeader from '../../../components/common/SearchHeader';
import Card from '../../../components/common/Card';
import FloatingActionButton from '../../../components/common/FloatingActionButton';
import EmptyState from '../../../components/common/EmptyState';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { useDebounce } from '../../../hooks/useDebounce';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing, borderRadius } from '../../../theme/spacing';

export default function CategoriesListScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['categories', debouncedSearch],
    queryFn: () => categoryService.getCategories(),
  });

  const deleteCategory = useMutation({
    mutationFn: (id: number) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const categories = (data as any)?.categories || data || [];

  const handleDelete = (category: any) => {
    Alert.alert(
      'Delete Category',
      `Delete "${category.name}"? Products in this category will be unassigned.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteCategory.mutate(category.category_id),
        },
      ]
    );
  };

  const renderItem = useCallback(({ item }: { item: any }) => (
    <Card style={styles.categoryCard}>
      <TouchableOpacity
        onPress={() => router.push({ pathname: '/(auth)/categories/create', params: { editId: item.category_id } })}
        activeOpacity={0.7}
        style={styles.cardContent}
      >
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.categoryImage} />
        ) : (
          <View style={[styles.categoryImage, styles.imagePlaceholder]}>
            <MaterialCommunityIcons name="shape" size={24} color={colors.primary[400]} />
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.categoryName}>{item.name}</Text>
          {item.description && (
            <Text style={styles.categoryDesc} numberOfLines={1}>
              {item.description}
            </Text>
          )}
          {item.product_count != null && (
            <Text style={styles.countText}>
              {item.product_count} product{item.product_count !== 1 ? 's' : ''}
            </Text>
          )}
        </View>

        <View style={styles.actionButtons}>
          <IconButton
            icon="pencil-outline"
            size={20}
            iconColor={colors.primary[600]}
            onPress={() =>
              router.push({ pathname: '/(auth)/categories/create', params: { editId: item.category_id } })
            }
          />
          <IconButton
            icon="delete-outline"
            size={20}
            iconColor={colors.status.cancelled}
            onPress={() => handleDelete(item)}
          />
        </View>
      </TouchableOpacity>
    </Card>
  ), []);

  return (
    <View style={styles.container}>
      <SearchHeader
        value={search}
        onChangeText={setSearch}
        placeholder="Search categories..."
      />

      {isLoading ? (
        <View style={styles.loadingList}>
          {[1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} style={styles.skeletonCard} />)}
        </View>
      ) : categories.length === 0 ? (
        <EmptyState
          icon="shape-plus"
          title="No Categories"
          description={search ? 'Try a different search' : 'Create your first category'}
          actionLabel="Add Category"
          onAction={() => router.push('/(auth)/categories/create')}
        />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => String(item.category_id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[colors.primary[600]]} />
          }
        />
      )}

      <FloatingActionButton
        icon="plus"
        onPress={() => router.push('/(auth)/categories/create')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  list: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  loadingList: {
    padding: spacing.md,
  },
  skeletonCard: {
    height: 70,
    marginBottom: spacing.sm,
  },
  categoryCard: {
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.md,
  },
  imagePlaceholder: {
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  categoryName: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    fontSize: 15,
  },
  categoryDesc: {
    ...typography.small,
    color: colors.text.tertiary,
    marginTop: 1,
  },
  countText: {
    ...typography.caption,
    color: colors.primary[600],
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
  },
});
