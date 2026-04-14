// Create / Edit Product Screen

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useProduct, useCreateProduct, useUpdateProduct } from '../../../hooks/useProducts';
import ProductForm from '../../../components/products/ProductForm';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../../../services/categoryService';

export default function CreateProductScreen() {
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const router = useRouter();
  const isEdit = !!editId;
  const productId = Number(editId);

  const { data: product, isLoading: loadingProduct } = useProduct(isEdit ? productId : 0);
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
  });

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const categories = (categoriesData as any)?.categories || categoriesData || [];

  const handleSubmit = (data: any) => {
    if (isEdit) {
      updateProduct.mutate(
        { id: productId, data },
        {
          onSuccess: () => {
            Alert.alert('Success', 'Product updated successfully');
            router.back();
          },
          onError: (e: any) => Alert.alert('Error', e?.message || 'Failed to update'),
        }
      );
    } else {
      createProduct.mutate(data, {
        onSuccess: () => {
          Alert.alert('Success', 'Product created successfully');
          router.back();
        },
        onError: (e: any) => Alert.alert('Error', e?.message || 'Failed to create'),
      });
    }
  };

  if (isEdit && loadingProduct) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Edit Product' }} />
        <SkeletonCard style={{ height: 400, margin: spacing.md }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: isEdit ? 'Edit Product' : 'Add Product' }} />
      <ProductForm
        initialData={isEdit ? product : undefined}
        categories={categories}
        onSubmit={handleSubmit}
        loading={createProduct.isPending || updateProduct.isPending}
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
