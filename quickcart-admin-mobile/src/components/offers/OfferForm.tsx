// OfferForm — Create/edit offer form

import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Switch, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import Input from '../common/Input';
import Button from '../common/Button';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface OfferFormData {
  title: string;
  code: string;
  discount_type: 'percentage' | 'flat';
  discount_value: number;
  min_order_amount: number;
  max_uses: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface OfferFormProps {
  initialData?: Partial<OfferFormData>;
  onSubmit: (data: OfferFormData) => void;
  loading?: boolean;
  isEdit?: boolean;
}

export default function OfferForm({ initialData, onSubmit, loading = false, isEdit = false }: OfferFormProps) {
  const [form, setForm] = useState<OfferFormData>({
    title: initialData?.title || '',
    code: initialData?.code || '',
    discount_type: initialData?.discount_type || 'percentage',
    discount_value: initialData?.discount_value || 0,
    min_order_amount: initialData?.min_order_amount || 0,
    max_uses: initialData?.max_uses || 0,
    start_date: initialData?.start_date || new Date().toISOString().split('T')[0],
    end_date: initialData?.end_date || '',
    is_active: initialData?.is_active ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const setValue = (key: keyof OfferFormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.code.trim()) e.code = 'Offer code is required';
    if (form.discount_value <= 0) e.discount_value = 'Discount must be > 0';
    if (form.discount_type === 'percentage' && form.discount_value > 100) e.discount_value = 'Max 100%';
    if (!form.end_date) e.end_date = 'End date is required';
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
        label="Offer Title *"
        value={form.title}
        onChangeText={(v) => setValue('title', v)}
        placeholder="e.g. Summer Sale 20% Off"
        error={errors.title}
      />

      <Input
        label="Coupon Code *"
        value={form.code}
        onChangeText={(v) => setValue('code', v.toUpperCase())}
        placeholder="e.g. SUMMER20"
        autoCapitalize="characters"
        error={errors.code}
      />

      {/* Discount type selector */}
      <Text style={styles.fieldLabel}>Discount Type</Text>
      <View style={styles.typeRow}>
        <Button
          title="Percentage (%)"
          variant={form.discount_type === 'percentage' ? 'primary' : 'outline'}
          size="sm"
          onPress={() => setValue('discount_type', 'percentage')}
          style={{ flex: 1 }}
        />
        <Button
          title="Flat Amount (₹)"
          variant={form.discount_type === 'flat' ? 'primary' : 'outline'}
          size="sm"
          onPress={() => setValue('discount_type', 'flat')}
          style={{ flex: 1 }}
        />
      </View>

      <Input
        label={`Discount Value (${form.discount_type === 'percentage' ? '%' : '₹'}) *`}
        value={form.discount_value ? String(form.discount_value) : ''}
        onChangeText={(v) => setValue('discount_value', parseFloat(v) || 0)}
        placeholder="0"
        keyboardType="numeric"
        error={errors.discount_value}
      />

      <View style={styles.row}>
        <View style={styles.half}>
          <Input
            label="Min Order (₹)"
            value={form.min_order_amount ? String(form.min_order_amount) : ''}
            onChangeText={(v) => setValue('min_order_amount', parseFloat(v) || 0)}
            placeholder="0"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.half}>
          <Input
            label="Max Uses"
            value={form.max_uses ? String(form.max_uses) : ''}
            onChangeText={(v) => setValue('max_uses', parseInt(v, 10) || 0)}
            placeholder="Unlimited"
            keyboardType="number-pad"
          />
        </View>
      </View>

      {/* Dates */}
      <View style={styles.row}>
        <View style={styles.half}>
          <Input
            label="Start Date *"
            value={form.start_date}
            onChangeText={(v) => setValue('start_date', v)}
            placeholder="YYYY-MM-DD"
          />
        </View>
        <View style={styles.half}>
          <Input
            label="End Date *"
            value={form.end_date}
            onChangeText={(v) => setValue('end_date', v)}
            placeholder="YYYY-MM-DD"
            error={errors.end_date}
          />
        </View>
      </View>

      {/* Active toggle */}
      <View style={styles.toggleRow}>
        <View>
          <Text style={styles.toggleLabel}>Offer Active</Text>
          <Text style={styles.toggleDesc}>Customers can use this offer when active</Text>
        </View>
        <Switch
          value={form.is_active}
          onValueChange={(v) => setValue('is_active', v)}
          trackColor={{ false: colors.background.tertiary, true: colors.primary[200] }}
          thumbColor={form.is_active ? colors.primary[600] : colors.text.disabled}
        />
      </View>

      <Button
        title={isEdit ? 'Update Offer' : 'Create Offer'}
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
  fieldLabel: {
    ...typography.label,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  typeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  half: {
    flex: 1,
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
