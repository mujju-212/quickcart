// BannerForm — Create/edit banner form

import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Switch } from 'react-native';
import { Text } from 'react-native-paper';
import Input from '../common/Input';
import Button from '../common/Button';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface BannerFormData {
  title: string;
  subtitle: string;
  image_url: string;
  link_type: string;
  link_value: string;
  position: number;
  is_active: boolean;
}

interface BannerFormProps {
  initialData?: Partial<BannerFormData>;
  onSubmit: (data: BannerFormData) => void;
  loading?: boolean;
  isEdit?: boolean;
}

const LINK_TYPES = ['category', 'product', 'offer', 'external'];

export default function BannerForm({ initialData, onSubmit, loading = false, isEdit = false }: BannerFormProps) {
  const [form, setForm] = useState<BannerFormData>({
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    image_url: initialData?.image_url || '',
    link_type: initialData?.link_type || 'category',
    link_value: initialData?.link_value || '',
    position: initialData?.position || 1,
    is_active: initialData?.is_active ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const setValue = (key: keyof BannerFormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.image_url.trim()) e.image_url = 'Image URL is required';
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
        label="Banner Title *"
        value={form.title}
        onChangeText={(v) => setValue('title', v)}
        placeholder="e.g. Summer Collection"
        error={errors.title}
      />

      <Input
        label="Subtitle"
        value={form.subtitle}
        onChangeText={(v) => setValue('subtitle', v)}
        placeholder="Short description..."
      />

      <Input
        label="Image URL *"
        value={form.image_url}
        onChangeText={(v) => setValue('image_url', v)}
        placeholder="https://example.com/banner.jpg"
        keyboardType="url"
        autoCapitalize="none"
        error={errors.image_url}
      />

      {/* Link type selector */}
      <Text style={styles.fieldLabel}>Link Type</Text>
      <View style={styles.typeRow}>
        {LINK_TYPES.map((type) => (
          <Button
            key={type}
            title={type.charAt(0).toUpperCase() + type.slice(1)}
            variant={form.link_type === type ? 'primary' : 'outline'}
            size="sm"
            onPress={() => setValue('link_type', type)}
          />
        ))}
      </View>

      <Input
        label="Link Value"
        value={form.link_value}
        onChangeText={(v) => setValue('link_value', v)}
        placeholder={
          form.link_type === 'external'
            ? 'https://...'
            : `${form.link_type} ID`
        }
        keyboardType={form.link_type === 'external' ? 'url' : 'default'}
        autoCapitalize="none"
      />

      <Input
        label="Position"
        value={String(form.position)}
        onChangeText={(v) => setValue('position', parseInt(v, 10) || 1)}
        placeholder="1"
        keyboardType="number-pad"
      />

      {/* Active toggle */}
      <View style={styles.toggleRow}>
        <View>
          <Text style={styles.toggleLabel}>Banner Active</Text>
          <Text style={styles.toggleDesc}>Visible to customers in the app</Text>
        </View>
        <Switch
          value={form.is_active}
          onValueChange={(v) => setValue('is_active', v)}
          trackColor={{ false: colors.background.tertiary, true: colors.primary[200] }}
          thumbColor={form.is_active ? colors.primary[600] : colors.text.disabled}
        />
      </View>

      <Button
        title={isEdit ? 'Update Banner' : 'Create Banner'}
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
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
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
