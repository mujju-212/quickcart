// StatusUpdateSheet — Bottom sheet for changing order status

import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BottomSheet from '../common/BottomSheet';
import Button from '../common/Button';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { ORDER_STATUSES, ORDER_STATUS_LABELS, ORDER_STATUS_ICONS, OrderStatus } from '../../utils/constants';

interface StatusUpdateSheetProps {
  visible: boolean;
  onClose: () => void;
  currentStatus: string;
  onUpdate: (status: string, note: string) => void;
  loading?: boolean;
}

export default function StatusUpdateSheet({
  visible,
  onClose,
  currentStatus,
  onUpdate,
  loading = false,
}: StatusUpdateSheetProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [note, setNote] = useState('');

  const handleUpdate = () => {
    if (selectedStatus !== currentStatus) {
      onUpdate(selectedStatus, note);
    }
  };

  // Determine valid next statuses
  const currentIndex = ORDER_STATUSES.findIndex(
    (s) => s.toLowerCase() === currentStatus.toLowerCase()
  );

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Update Order Status" height={500}>
      {/* Status options */}
      <View style={styles.statusGrid}>
        {ORDER_STATUSES.map((status, index) => {
          const statusKey = status as OrderStatus;
          const isActive = selectedStatus.toLowerCase() === status.toLowerCase();
          const isCurrent = currentStatus.toLowerCase() === status.toLowerCase();
          // Allow forward transitions only (or cancel from any state)
          const isDisabled = index < currentIndex && status !== 'cancelled';

          return (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusOption,
                isActive && styles.statusOptionActive,
                isDisabled && styles.statusOptionDisabled,
              ]}
              onPress={() => !isDisabled && setSelectedStatus(status)}
              disabled={isDisabled}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={ORDER_STATUS_ICONS[statusKey] as any}
                size={20}
                color={isActive ? colors.primary[600] : isDisabled ? colors.text.disabled : colors.text.secondary}
              />
              <Text
                style={[
                  styles.statusLabel,
                  isActive && styles.statusLabelActive,
                  isDisabled && styles.statusLabelDisabled,
                ]}
              >
                {ORDER_STATUS_LABELS[statusKey]}
              </Text>
              {isCurrent && <Text style={styles.currentBadge}>Current</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Note input */}
      <View style={styles.noteSection}>
        <Text style={styles.noteLabel}>Note (optional)</Text>
        <TextInput
          style={styles.noteInput}
          value={note}
          onChangeText={setNote}
          placeholder="Add a note about this status change..."
          placeholderTextColor={colors.text.disabled}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      {/* Buttons */}
      <View style={styles.actions}>
        <Button title="Cancel" variant="ghost" onPress={onClose} style={{ flex: 1 }} />
        <Button
          title="Update Status"
          variant="primary"
          onPress={handleUpdate}
          loading={loading}
          disabled={selectedStatus.toLowerCase() === currentStatus.toLowerCase()}
          style={{ flex: 2 }}
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  statusGrid: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm + 2,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  statusOptionActive: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[50],
  },
  statusOptionDisabled: {
    opacity: 0.4,
  },
  statusLabel: {
    ...typography.body,
    color: colors.text.secondary,
    flex: 1,
  },
  statusLabelActive: {
    color: colors.primary[700],
    fontFamily: 'Inter_600SemiBold',
  },
  statusLabelDisabled: {
    color: colors.text.disabled,
  },
  currentBadge: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: colors.primary[600],
    backgroundColor: colors.primary[100],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    textTransform: 'uppercase',
  },
  noteSection: {
    marginBottom: spacing.md,
  },
  noteLabel: {
    ...typography.label,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    ...typography.body,
    color: colors.text.primary,
    minHeight: 72,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
