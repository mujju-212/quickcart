import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AnimatedRN, { FadeInUp, FadeOutLeft, Layout } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MapPin, Plus } from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { Header, EmptyState } from '@components/common';
import { Button } from '@components/ui';
import { AddressCard, AddressForm } from '@components/address';
import { useLocationStore } from '@stores/locationStore';
import { triggerHaptic } from '@utils/haptics';

// ──────────────────────────────────────────
//  Address Management Screen
// ──────────────────────────────────────────

export default function AddressesScreen() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  const addresses = useLocationStore((s) => s.addresses);
  const selectedAddress = useLocationStore((s) => s.selectedAddress);
  const addAddress = useLocationStore((s) => s.addAddress);
  const updateAddress = useLocationStore((s) => s.updateAddress);
  const removeAddress = useLocationStore((s) => s.removeAddress);
  const setSelectedAddress = useLocationStore((s) => s.selectAddress);

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const handleAdd = useCallback(
    (data: any) => {
      const newAddr = { ...data, id: Date.now().toString() };
      addAddress(newAddr);
      setShowForm(false);
      triggerHaptic('success');
    },
    [addAddress]
  );

  const handleEdit = useCallback(
    (data: any) => {
      if (editingAddress) {
        updateAddress(editingAddress.id, data);
        setEditingAddress(null);
        setShowForm(false);
        triggerHaptic('success');
      }
    },
    [editingAddress, updateAddress]
  );

  const handleDelete = useCallback(
    (address: any) => {
      Alert.alert(
        'Delete Address',
        `Remove "${address.label || address.type || 'this'}" address?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              removeAddress(address.id);
              triggerHaptic('warning');
            },
          },
        ]
      );
    },
    [removeAddress]
  );

  const handleSetDefault = useCallback(
    (address: any) => {
      setSelectedAddress(address);
      triggerHaptic('selection');
    },
    [setSelectedAddress]
  );

  // Show form
  if (showForm) {
    return (
      <View style={[styles.container, { paddingTop: top }]}>
        <Header
          title={editingAddress ? 'Edit Address' : 'Add Address'}
          showBack
        />
        <AddressForm
          initialData={editingAddress}
          onSubmit={editingAddress ? handleEdit : handleAdd}
          onCancel={() => {
            setShowForm(false);
            setEditingAddress(null);
          }}
        />
      </View>
    );
  }

  const renderAddress = ({ item, index }: { item: any; index: number }) => (
    <AnimatedRN.View
      entering={FadeInUp.delay(index * 60).springify()}
      exiting={FadeOutLeft.springify()}
      layout={Layout.springify()}
    >
      <AddressCard
        address={item}
        selected={selectedAddress?.id === item.id}
        onSelect={() => handleSetDefault(item)}
        onEdit={() => {
          setEditingAddress(item);
          setShowForm(true);
        }}
        onDelete={() => handleDelete(item)}
      />
    </AnimatedRN.View>
  );

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <Header
        title="My Addresses"
        subtitle={`${addresses.length} saved`}
        rightActions={
          <TouchableOpacity onPress={() => setShowForm(true)}>
            <Plus size={22} color={colors.primary} />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={addresses}
        keyExtractor={(item: any) => item.id}
        renderItem={renderAddress}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            preset="generic"
            title="No addresses saved"
            message="Add your delivery addresses for quicker checkout"
            actionLabel="Add Address"
            onAction={() => setShowForm(true)}
          />
        }
        ListFooterComponent={
          addresses.length > 0 ? (
            <Button
              title="Add New Address"
              onPress={() => setShowForm(true)}
              variant="outline"
              icon={<Plus size={18} color={colors.primary} />}
              style={styles.addBtn}
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  addBtn: {
    marginTop: spacing.sm,
  },
});
