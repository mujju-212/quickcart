import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AnimatedRN, { FadeInUp, Layout } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  MapPin,
  Plus,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { shadows } from '@theme/shadows';
import { Header } from '@components/common';
import { Button } from '@components/ui';
import { AddressCard, AddressForm } from '@components/address';
import { useLocationStore } from '@stores/locationStore';
import { useCartStore } from '@stores/cartStore';
import { formatPrice } from '@utils/helpers';
import { triggerHaptic } from '@utils/haptics';

// ──────────────────────────────────────────
//  Checkout — Address Selection
// ──────────────────────────────────────────

export default function AddressSelectScreen() {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();

  const addresses = useLocationStore((s) => s.addresses);
  const selectedAddress = useLocationStore((s) => s.selectedAddress);
  const selectAddress = useLocationStore((s) => s.selectAddress);
  const addAddress = useLocationStore((s) => s.addAddress);
  const removeAddress = useLocationStore((s) => s.removeAddress);

  const cartTotal = useCartStore((s) => s.total);
  const deliveryFee = useCartStore((s) => s.deliveryFee);

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(
    selectedAddress?.id ?? null
  );

  const handleSelect = useCallback(
    (address: any) => {
      setSelectedId(address.id);
      selectAddress(address);
      triggerHaptic('selection');
    },
    [selectAddress]
  );

  const handleDelete = useCallback(
    (address: any) => {
      Alert.alert(
        'Delete Address',
        `Remove "${address.label || address.type}" address?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              removeAddress(address.id);
              if (selectedId === address.id) setSelectedId(null);
            },
          },
        ]
      );
    },
    [removeAddress, selectedId]
  );

  const handleAddAddress = useCallback(
    (address: any) => {
      const newAddr = {
        ...address,
        id: Date.now().toString(),
      };
      addAddress(newAddr);
      setSelectedId(newAddr.id);
      selectAddress(newAddr);
      setShowAddForm(false);
      triggerHaptic('success');
    },
    [addAddress, selectAddress]
  );

  const handleContinue = useCallback(() => {
    const chosen = addresses.find((a: any) => a.id === selectedId);
    if (!chosen) {
      Alert.alert('Select Address', 'Please select a delivery address');
      return;
    }
    selectAddress(chosen);
    triggerHaptic('impact');
    router.push('/checkout/payment');
  }, [selectedId, addresses, selectAddress, router]);

  const renderAddress = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <AnimatedRN.View entering={FadeInUp.delay(index * 60).springify()} layout={Layout.springify()}>
        <TouchableOpacity
          style={[
            styles.addressItem,
            selectedId === item.id && styles.addressSelected,
          ]}
          onPress={() => handleSelect(item)}
          activeOpacity={0.7}
        >
          <View style={styles.addressRow}>
            {/* Radio */}
            <View
              style={[
                styles.radio,
                selectedId === item.id && styles.radioActive,
              ]}
            >
              {selectedId === item.id && (
                <View style={styles.radioInner} />
              )}
            </View>

            {/* Address Info */}
            <View style={styles.addressInfo}>
              <View style={styles.addressLabelRow}>
                <Text style={styles.addressLabel}>
                  {item.label || item.type || 'Address'}
                </Text>
                {item.is_default && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </View>
              <Text style={styles.addressName}>{item.name}</Text>
              <Text style={styles.addressText} numberOfLines={2}>
                {item.address_line1}
                {item.address_line2 ? `, ${item.address_line2}` : ''}
              </Text>
              <Text style={styles.addressCity}>
                {item.city}, {item.state} - {item.pincode}
              </Text>
              {item.phone && (
                <Text style={styles.addressPhone}>📞 {item.phone}</Text>
              )}
            </View>
          </View>

          {/* Delete */}
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.deleteText}>Remove</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </AnimatedRN.View>
    ),
    [selectedId, handleSelect, handleDelete]
  );

  // ──── Add New Address Form ────
  if (showAddForm) {
    return (
      <View style={[styles.container, { paddingTop: top }]}>
        <Header
          title="Add New Address"
          showBack
        />
        <AddressForm
          onSubmit={handleAddAddress}
          onCancel={() => setShowAddForm(false)}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <Header title="Select Delivery Address" />

      <FlatList
        data={addresses}
        keyExtractor={(item: any) => item.id}
        renderItem={renderAddress}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <AnimatedRN.View entering={FadeInUp.springify()} style={styles.stepIndicator}>
            <View style={[styles.step, styles.stepActive]}>
              <Text style={styles.stepNumActive}>1</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.step}>
              <Text style={styles.stepNum}>2</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.step}>
              <Text style={styles.stepNum}>3</Text>
            </View>
          </AnimatedRN.View>
        }
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}
            activeOpacity={0.7}
          >
            <Plus size={20} color={colors.primary} />
            <Text style={styles.addButtonText}>Add New Address</Text>
          </TouchableOpacity>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <MapPin size={48} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>No saved addresses</Text>
            <Text style={styles.emptySubtitle}>
              Add a delivery address to continue
            </Text>
            <Button
              title="Add Address"
              onPress={() => setShowAddForm(true)}
              style={{ marginTop: spacing.md }}
            />
          </View>
        }
      />

      {/* Bottom Bar */}
      {addresses.length > 0 && (
        <AnimatedRN.View
          entering={FadeInUp.springify()}
          style={[styles.bottomBar, { paddingBottom: bottom + spacing.sm }]}
        >
          <View style={styles.bottomInfo}>
            <Text style={styles.bottomLabel}>Deliver to</Text>
            <Text style={styles.bottomValue} numberOfLines={1}>
              {selectedId
                ? addresses.find((a: any) => a.id === selectedId)?.address_line_1 || 'Selected'
                : 'Select an address'}
            </Text>
          </View>
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={!selectedId}
            style={styles.continueBtn}
            icon={<ChevronRight size={18} color={colors.black} />}
            iconPosition="right"
          />
        </AnimatedRN.View>
      )}
    </View>
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.md,
    paddingBottom: 120,
  },

  // Step indicator
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  step: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.grey100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepActive: {
    backgroundColor: colors.primary,
  },
  stepNum: {
    ...typography.labelMedium,
    color: colors.textTertiary,
  },
  stepNumActive: {
    ...typography.labelMedium,
    color: colors.black,
    fontWeight: '700',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: colors.grey200,
  },

  // Address item
  addressItem: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.sm,
  },
  addressSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  addressRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.grey300,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioActive: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  addressInfo: {
    flex: 1,
  },
  addressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 4,
  },
  addressLabel: {
    ...typography.labelMedium,
    color: colors.text,
    textTransform: 'uppercase',
  },
  defaultBadge: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  defaultText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '600',
  },
  addressName: {
    ...typography.bodyMedium,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  addressText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  addressCity: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  addressPhone: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginTop: 4,
  },
  deleteBtn: {
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
  },
  deleteText: {
    ...typography.bodySmall,
    color: colors.error,
    fontWeight: '600',
  },

  // Add button
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    marginTop: spacing.sm,
  },
  addButtonText: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: '600',
  },

  // Empty
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    ...typography.h4,
    color: colors.text,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.lg,
  },
  bottomInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  bottomLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  bottomValue: {
    ...typography.bodyMedium,
    color: colors.text,
    fontWeight: '600',
  },
  continueBtn: {
    minWidth: 140,
  },
});
