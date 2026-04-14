// Banners List Screen

import React, { useState, useCallback } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bannerService } from '../../../services/bannerService';
import BannerCard from '../../../components/banners/BannerCard';
import FloatingActionButton from '../../../components/common/FloatingActionButton';
import EmptyState from '../../../components/common/EmptyState';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

export default function BannersListScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['banners'],
    queryFn: () => bannerService.getBanners(),
  });

  const toggleBanner = useMutation({
    mutationFn: ({ bannerId, isActive }: { bannerId: number; isActive: boolean }) =>
      bannerService.updateBanner(bannerId, { is_active: isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banners'] }),
  });

  const deleteBanner = useMutation({
    mutationFn: (id: number) => bannerService.deleteBanner(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banners'] }),
  });

  const banners = (data as any)?.banners || data || [];

  const handleToggle = (banner: any) => {
    toggleBanner.mutate({ bannerId: banner.banner_id, isActive: !banner.is_active });
  };

  const handleEdit = (banner: any) => {
    router.push({ pathname: '/(auth)/banners/create', params: { editId: banner.banner_id } });
  };

  const handleDelete = (banner: any) => {
    Alert.alert('Delete Banner', `Delete "${banner.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteBanner.mutate(banner.banner_id),
      },
    ]);
  };

  const renderItem = useCallback(({ item }: { item: any }) => (
    <BannerCard
      banner={item}
      onToggle={() => handleToggle(item)}
      onPress={() => handleEdit(item)}
    />
  ), []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {banners.length} Banner{banners.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingList}>
          {[1, 2, 3].map((i) => <SkeletonCard key={i} style={styles.skeletonCard} />)}
        </View>
      ) : banners.length === 0 ? (
        <EmptyState
          icon="image-multiple"
          title="No Banners"
          description="Create promotional banners for the app"
          actionLabel="Add Banner"
          onAction={() => router.push('/(auth)/banners/create')}
        />
      ) : (
        <FlatList
          data={banners}
          keyExtractor={(item) => String(item.banner_id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[colors.primary[600]]} />
          }
        />
      )}

      <FloatingActionButton
        icon="plus"
        onPress={() => router.push('/(auth)/banners/create')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerTitle: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.text.tertiary,
  },
  list: {
    padding: spacing.md,
    paddingTop: 0,
    paddingBottom: 100,
  },
  loadingList: {
    padding: spacing.md,
  },
  skeletonCard: {
    height: 180,
    marginBottom: spacing.sm,
  },
});
