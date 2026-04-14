// Create / Edit Offer Screen

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { offerService } from '../../../services/offerService';
import OfferForm from '../../../components/offers/OfferForm';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

export default function CreateOfferScreen() {
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = !!editId;
  const offerId = Number(editId);

  const { data: existingOffer, isLoading: loading } = useQuery({
    queryKey: ['offer', offerId],
    queryFn: () => offerService.getOffer(offerId),
    enabled: isEdit,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => offerService.createOffer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      Alert.alert('Success', 'Offer created');
      router.back();
    },
    onError: (e: any) => Alert.alert('Error', e?.message || 'Failed to create'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => offerService.updateOffer(offerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      Alert.alert('Success', 'Offer updated');
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
        <Stack.Screen options={{ title: 'Edit Offer' }} />
        <SkeletonCard style={{ height: 400, margin: spacing.md }} />
      </View>
    );
  }

  const initialData = isEdit ? ((existingOffer as any)?.offer || existingOffer) : undefined;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: isEdit ? 'Edit Offer' : 'Add Offer' }} />
      <OfferForm
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
