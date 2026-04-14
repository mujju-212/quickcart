// Create / Edit Category Screen

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, Alert, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../../services/categoryService';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing, borderRadius } from '../../../theme/spacing';

export default function CreateCategoryScreen() {
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = !!editId;
  const categoryId = Number(editId);

  const { data: existingCategory, isLoading: loading } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => categoryService.getCategory(categoryId),
    enabled: isEdit,
  });

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (existingCategory) {
      const cat = (existingCategory as any)?.category || existingCategory;
      setName(cat.name || '');
      setDescription(cat.description || '');
      setImageUrl(cat.image_url || '');
    }
  }, [existingCategory]);

  const createMutation = useMutation({
    mutationFn: (data: any) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      Alert.alert('Success', 'Category created');
      router.back();
    },
    onError: (e: any) => Alert.alert('Error', e?.message || 'Failed to create'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => categoryService.updateCategory(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      Alert.alert('Success', 'Category updated');
      router.back();
    },
    onError: (e: any) => Alert.alert('Error', e?.message || 'Failed to update'),
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const validate = () => {
    const err: any = {};
    if (!name.trim()) err.name = 'Category name is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const data = {
      name: name.trim(),
      description: description.trim() || undefined,
      image_url: imageUrl.trim() || undefined,
    };
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  if (isEdit && loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Edit Category' }} />
        <SkeletonCard style={{ height: 300, margin: spacing.md }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: isEdit ? 'Edit Category' : 'Add Category' }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          {/* Image Preview */}
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
          ) : (
            <View style={[styles.imagePreview, styles.imagePlaceholder]}>
              <MaterialCommunityIcons name="image-plus" size={40} color={colors.text.disabled} />
              <Text style={styles.imagePlaceholderText}>Add image URL below</Text>
            </View>
          )}

          <Card style={styles.formCard}>
            <Input
              label="Category Name *"
              value={name}
              onChangeText={setName}
              placeholder="e.g. Fruits & Vegetables"
              error={errors.name}
            />

            <Input
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Optional description"
              multiline
              numberOfLines={3}
            />

            <Input
              label="Image URL"
              value={imageUrl}
              onChangeText={setImageUrl}
              placeholder="https://example.com/image.jpg"
              autoCapitalize="none"
              keyboardType="url"
            />

            <View style={styles.buttonRow}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => router.back()}
                style={{ flex: 1 }}
              />
              <Button
                title={isEdit ? 'Update Category' : 'Create Category'}
                onPress={handleSubmit}
                loading={isPending}
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    paddingBottom: spacing['3xl'],
  },
  imagePreview: {
    width: '100%',
    height: 180,
    backgroundColor: colors.background.tertiary,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    ...typography.small,
    color: colors.text.disabled,
    marginTop: spacing.xs,
  },
  formCard: {
    margin: spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});
