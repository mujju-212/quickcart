// Create / Edit Banner Screen

import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bannerService } from '../../../services/bannerService';
import BannerForm from '../../../components/banners/BannerForm';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

export default function CreateBannerScreen() {
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = !!editId;
  const bannerId = Number(editId);

  const { data: existingBanner, isLoading: loading } = useQuery({
    queryKey: ['banner', bannerId],
    queryFn: () => bannerService.getBanner(bannerId),
    enabled: isEdit,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => bannerService.createBanner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      Alert.alert('Success', 'Banner created');
      router.back();
    },
    onError: (e: any) => Alert.alert('Error', e?.message || 'Failed to create'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => bannerService.updateBanner(bannerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      Alert.alert('Success', 'Banner updated');
      router.back();
    },
    onError: (e: any) => Alert.alert('Error', e?.message || 'Failed to update'),
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (data: any) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  if (isEdit && loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Edit Banner' }} />
        <SkeletonCard style={{ height: 400, margin: spacing.md }} />
      </View>
    );
  }

  const initialData = isEdit ? ((existingBanner as any)?.banner || existingBanner) : undefined;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: isEdit ? 'Edit Banner' : 'Add Banner' }} />
      <BannerForm
        initialData={initialData}
        onSubmit={handleSubmit}
        loading={isPending}
        isEdit={isEdit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
});
