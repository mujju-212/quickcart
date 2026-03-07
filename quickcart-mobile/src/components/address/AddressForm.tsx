import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { MapPin, Home, Briefcase, Navigation } from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { Input, Button, Chip, ChipGroup } from '@components/ui';
import { triggerHaptic } from '@utils/haptics';
import { isValidPhone, isValidPincode } from '@utils/helpers';
import type { AddressData } from './AddressCard';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

interface AddressFormProps {
  /** Existing address for editing */
  initialData?: Partial<AddressData>;
  /** Submit handler */
  onSubmit: (data: Omit<AddressData, 'id'>) => void;
  /** Cancel handler */
  onCancel?: () => void;
  /** Loading state */
  isLoading?: boolean;
  style?: ViewStyle;
}

// ──────────────────────────────────────────
//  Label Presets
// ──────────────────────────────────────────

const LABEL_PRESETS = [
  { value: 'home', label: 'Home', icon: Home },
  { value: 'office', label: 'Office', icon: Briefcase },
  { value: 'other', label: 'Other', icon: Navigation },
];

// ──────────────────────────────────────────
//  Component
// ──────────────────────────────────────────

export function AddressForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  style,
}: AddressFormProps) {
  const isEditing = !!initialData?.id;

  const [form, setForm] = useState({
    label: initialData?.label || 'home',
    full_name: initialData?.full_name || '',
    phone: initialData?.phone || '',
    address_line1: initialData?.address_line1 || '',
    address_line2: initialData?.address_line2 || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    pincode: initialData?.pincode || '',
    is_default: initialData?.is_default || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = useCallback((key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  }, []);

  // ── Validation ──
  const validate = useCallback((): boolean => {
    const e: Record<string, string> = {};

    if (!form.full_name.trim()) e.full_name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!isValidPhone(form.phone)) e.phone = 'Enter a valid 10-digit phone';

    if (!form.address_line1.trim()) e.address_line1 = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state.trim()) e.state = 'State is required';
    if (!form.pincode.trim()) e.pincode = 'Pincode is required';
    else if (!isValidPincode(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode';

    setErrors(e);
    if (Object.keys(e).length > 0) {
      triggerHaptic('error');
      return false;
    }
    return true;
  }, [form]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;
    triggerHaptic('success');
    onSubmit({
      label: form.label,
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      address_line1: form.address_line1.trim(),
      address_line2: form.address_line2.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
      is_default: form.is_default,
    });
  }, [form, validate, onSubmit]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={[styles.container, style]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.springify()}>
          {/* Address Label */}
          <Text style={styles.sectionTitle}>Address Type</Text>
          <View style={styles.labelPicker}>
            {LABEL_PRESETS.map((preset) => (
              <Chip
                key={preset.value}
                label={preset.label}
                selected={form.label === preset.value}
                onPress={() => updateField('label', preset.value)}
                icon={<preset.icon size={14} color={
                  form.label === preset.value ? colors.white : colors.textSecondary
                } />}
              />
            ))}
          </View>

          {/* Personal Details */}
          <Text style={styles.sectionTitle}>Personal Details</Text>

          <Input
            label="Full Name"
            placeholder="John Doe"
            value={form.full_name}
            onChangeText={(t) => updateField('full_name', t)}
            error={errors.full_name}
            autoCapitalize="words"
          />

          <Input
            label="Phone Number"
            placeholder="9876543210"
            value={form.phone}
            onChangeText={(t) => updateField('phone', t.replace(/\D/g, ''))}
            error={errors.phone}
            keyboardType="phone-pad"
            maxLength={10}
          />

          {/* Address Details */}
          <Text style={[styles.sectionTitle, { marginTop: spacing.md }]}>
            Address Details
          </Text>

          <Input
            label="Address Line 1"
            placeholder="House No, Building, Street"
            value={form.address_line1}
            onChangeText={(t) => updateField('address_line1', t)}
            error={errors.address_line1}
          />

          <Input
            label="Address Line 2 (Optional)"
            placeholder="Landmark, Area"
            value={form.address_line2}
            onChangeText={(t) => updateField('address_line2', t)}
          />

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Input
                label="City"
                placeholder="Mumbai"
                value={form.city}
                onChangeText={(t) => updateField('city', t)}
                error={errors.city}
              />
            </View>
            <View style={styles.halfField}>
              <Input
                label="State"
                placeholder="Maharashtra"
                value={form.state}
                onChangeText={(t) => updateField('state', t)}
                error={errors.state}
              />
            </View>
          </View>

          <Input
            label="Pincode"
            placeholder="400001"
            value={form.pincode}
            onChangeText={(t) => updateField('pincode', t.replace(/\D/g, ''))}
            error={errors.pincode}
            keyboardType="number-pad"
            maxLength={6}
          />

          {/* Default Toggle */}
          <Chip
            label="Set as default address"
            selected={form.is_default}
            onPress={() => updateField('is_default', !form.is_default)}
            style={{ alignSelf: 'flex-start', marginTop: spacing.sm }}
          />

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title={isEditing ? 'Update Address' : 'Save Address'}
              onPress={handleSubmit}
              loading={isLoading}
              fullWidth
              icon={<MapPin size={16} color={colors.white} />}
              iconPosition="left"
            />
            {onCancel && (
              <Button
                title="Cancel"
                onPress={onCancel}
                variant="ghost"
                fullWidth
                style={{ marginTop: spacing.xs }}
              />
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  labelPicker: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  halfField: {
    flex: 1,
  },
  actions: {
    marginTop: spacing.lg,
  },
});

export default AddressForm;
