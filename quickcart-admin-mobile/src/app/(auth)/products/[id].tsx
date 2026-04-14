// Product Detail Screen

import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, Image, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useProduct, useDeleteProduct, useToggleProductActive, useUpdateStock } from '../../../hooks/useProducts';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import StockBadge from '../../../components/products/StockBadge';
import { StatusBadge } from '../../../components/common';
import { SkeletonCard } from '../../../components/common/Skeleton';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing, borderRadius } from '../../../theme/spacing';
import { formatPrice, formatDate } from '../../../utils/helpers';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const productId = Number(id);

  const { data: product, isLoading, refetch, isRefetching } = useProduct(productId);
  const deleteProduct = useDeleteProduct();
  const toggleActive = useToggleProductActive();
  const updateStock = useUpdateStock();

  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [newStock, setNewStock] = useState('');

  const handleDelete = () => {
    Alert.alert('Delete Product', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          deleteProduct.mutate(productId, {
            onSuccess: () => router.back(),
            onError: (e: any) => Alert.alert('Error', e?.message || 'Failed to delete'),
          }),
      },
    ]);
  };

  const handleToggle = () => {
    if (!product) return;
    toggleActive.mutate(
      { id: productId, active: !product.is_active },
      { onSuccess: () => refetch() }
    );
  };

  const handleStockUpdate = () => {
    const qty = parseInt(newStock, 10);
    if (isNaN(qty) || qty < 0) return;
    updateStock.mutate(
      { id: productId, quantity: qty },
      {
        onSuccess: () => {
          setStockModalOpen(false);
          setNewStock('');
          refetch();
        },
      }
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <SkeletonCard style={{ height: 200, margin: spacing.md }} />
        <SkeletonCard style={{ height: 160, margin: spacing.md }} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, styles.center]}>
        <MaterialCommunityIcons name="alert-circle" size={48} color={colors.text.disabled} />
        <Text style={styles.notFoundText}>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[colors.primary[600]]} />
        }
      >
        {/* Product image */}
        {product.image_url ? (
          <Image source={{ uri: product.image_url }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <MaterialCommunityIcons name="image-outline" size={48} color={colors.text.disabled} />
          </View>
        )}

        {/* Basic info */}
        <Card>
          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{product.name}</Text>
              {product.category_name && (
                <Text style={styles.categoryText}>{product.category_name}</Text>
              )}
            </View>
            <View style={styles.priceCol}>
              <Text style={styles.price}>{formatPrice(product.price)}</Text>
              {(product.original_price ?? 0) > product.price && (
                <Text style={styles.originalPrice}>{formatPrice(product.original_price!)}</Text>
              )}
            </View>
          </View>

          <View style={styles.badgeRow}>
            <StockBadge quantity={product.stock} />
            <StatusBadge
              status={product.is_active ? 'active' : 'inactive'}
              type="offer"
            />
          </View>
        </Card>

        {/* Description */}
        {product.description && (
          <Card title="Description">
            <Text style={styles.description}>{product.description}</Text>
          </Card>
        )}

        {/* Details */}
        <Card title="Details">
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Unit</Text>
            <Text style={styles.detailValue}>{product.unit || 'piece'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Stock</Text>
            <Text style={styles.detailValue}>{product.stock}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Created</Text>
            <Text style={styles.detailValue}>{formatDate(product.created_at)}</Text>
          </View>
          {product.updated_at && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Updated</Text>
              <Text style={styles.detailValue}>{formatDate(product.updated_at)}</Text>
            </View>
          )}
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Edit Product"
            icon="pencil"
            onPress={() => router.push({ pathname: '/(auth)/products/create', params: { editId: product.id } })}
            style={{ flex: 1 }}
          />
          <Button
            title="Update Stock"
            variant="outline"
            icon="package-variant"
            onPress={() => {
              setNewStock(String(product.stock));
              setStockModalOpen(true);
            }}
            style={{ flex: 1 }}
          />
        </View>

        <View style={styles.actions}>
          <Button
            title={product.is_active ? 'Deactivate' : 'Activate'}
            variant="secondary"
            icon={product.is_active ? 'eye-off' : 'eye'}
            onPress={handleToggle}
            loading={toggleActive.isPending}
            style={{ flex: 1 }}
          />
          <Button
            title="Delete"
            variant="danger"
            icon="delete-outline"
            onPress={handleDelete}
            loading={deleteProduct.isPending}
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>

      {/* Stock update modal */}
      <Modal
        visible={stockModalOpen}
        title="Update Stock"
        onClose={() => setStockModalOpen(false)}
        footer={
          <View style={styles.modalFooter}>
            <Button title="Cancel" variant="outline" onPress={() => setStockModalOpen(false)} style={{ flex: 1 }} />
            <Button title="Update" onPress={handleStockUpdate} loading={updateStock.isPending} style={{ flex: 1 }} />
          </View>
        }
      >
        <Input
          label="New Stock Quantity"
          value={newStock}
          onChangeText={setNewStock}
          keyboardType="number-pad"
          placeholder="0"
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingBottom: spacing['3xl'],
  },
  image: {
    width: '100%',
    height: 240,
  },
  imagePlaceholder: {
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: colors.text.primary,
  },
  categoryText: {
    ...typography.small,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: colors.primary[700],
  },
  originalPrice: {
    ...typography.small,
    color: colors.text.disabled,
    textDecorationLine: 'line-through',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  detailLabel: {
    ...typography.body,
    color: colors.text.tertiary,
  },
  detailValue: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  notFoundText: {
    ...typography.body,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
