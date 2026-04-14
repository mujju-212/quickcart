// ProductForm — Create/edit product form with all fields

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Switch, TextInput } from 'react-native';
import { Text } from 'react-native-paper';
import Input from '../common/Input';
import Button from '../common/Button';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { ProductFormData } from '../../services/productService';

interface Category {
  category_id: number;
  name: string;
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData & { product_id?: number }>;
  categories: Category[];
  onSubmit: (data: ProductFormData) => void;
  loading?: boolean;
  isEdit?: boolean;
}

export default function ProductForm({
  initialData,
  categories,
  onSubmit,
  loading = false,
  isEdit = false,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    original_price: initialData?.original_price || 0,
    category_id: initialData?.category_id || (categories[0]?.category_id || 0),
    stock: initialData?.stock || initialData?.stock_quantity || 0,
    stock_quantity: initialData?.stock_quantity || 0,
    image_url: initialData?.image_url || '',
    is_active: initialData?.is_active ?? true,
    unit: initialData?.unit || 'piece',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const setValue = (key: keyof ProductFormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (form.price <= 0) e.price = 'Price must be greater than 0';
    if (!form.category_id) e.category_id = 'Category is required';
    if ((form.stock_quantity ?? 0) < 0) e.stock_quantity = 'Stock cannot be negative';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(form);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <Input
        label="Product Name *"
        value={form.name}
        onChangeText={(v) => setValue('name', v)}
        placeholder="e.g. Fresh Organic Apples"
        error={errors.name}
      />

      <Input
        label="Description"
        value={form.description}
        onChangeText={(v) => setValue('description', v)}
        placeholder="Product description..."
        multiline
        numberOfLines={4}
        style={{ minHeight: 80, textAlignVertical: 'top' }}
      />

      <View style={styles.row}>
        <View style={styles.half}>
          <Input
            label="Price (₹) *"
            value={form.price ? String(form.price) : ''}
            onChangeText={(v) => setValue('price', parseFloat(v) || 0)}
            placeholder="0.00"
            keyboardType="numeric"
            error={errors.price}
          />
        </View>
        <View style={styles.half}>
          <Input
            label="Original Price (₹)"
            value={form.original_price ? String(form.original_price) : ''}
            onChangeText={(v) => setValue('original_price', parseFloat(v) || 0)}
            placeholder="0.00"
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Category selector */}
      <Text style={styles.fieldLabel}>Category *</Text>
      <View style={styles.categoryGrid}>
        {categories.map((cat) => (
          <Button
            key={cat.category_id}
            title={cat.name}
            variant={form.category_id === cat.category_id ? 'primary' : 'outline'}
            size="sm"
            onPress={() => setValue('category_id', cat.category_id)}
            style={styles.categoryChip}
          />
        ))}
      </View>
      {errors.category_id && <Text style={styles.errorText}>{errors.category_id}</Text>}

      <View style={styles.row}>
        <View style={styles.half}>
          <Input
            label="Stock Quantity *"
            value={form.stock_quantity !== undefined ? String(form.stock_quantity) : ''}
            onChangeText={(v) => setValue('stock_quantity', parseInt(v, 10) || 0)}
            placeholder="0"
            keyboardType="number-pad"
            error={errors.stock_quantity}
          />
        </View>
        <View style={styles.half}>
          <Input
            label="Unit"
            value={form.unit || ''}
            onChangeText={(v) => setValue('unit', v)}
            placeholder="piece, kg, ltr..."
          />
        </View>
      </View>

      <Input
        label="Image URL"
        value={form.image_url || ''}
        onChangeText={(v) => setValue('image_url', v)}
        placeholder="https://..."
        keyboardType="url"
        autoCapitalize="none"
      />

      {/* Active toggle */}
      <View style={styles.toggleRow}>
        <View>
          <Text style={styles.toggleLabel}>Product Active</Text>
          <Text style={styles.toggleDesc}>Visible to customers when active</Text>
        </View>
        <Switch
          value={form.is_active}
          onValueChange={(v) => setValue('is_active', v)}
          trackColor={{ false: colors.background.tertiary, true: colors.primary[200] }}
          thumbColor={form.is_active ? colors.primary[600] : colors.text.disabled}
        />
      </View>

      <Button
        title={isEdit ? 'Update Product' : 'Create Product'}
        onPress={handleSubmit}
        loading={loading}
        fullWidth
        size="lg"
        style={styles.submitBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  half: {
    flex: 1,
  },
  fieldLabel: {
    ...typography.label,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  categoryChip: {
    marginBottom: 0,
  },
  errorText: {
    ...typography.caption,
    color: colors.status.cancelled,
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
    marginTop: spacing.sm,
  },
  toggleLabel: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  toggleDesc: {
    ...typography.small,
    color: colors.text.tertiary,
    marginTop: 1,
  },
  submitBtn: {
    marginTop: spacing.lg,
    marginBottom: spacing['3xl'],
  },
});
