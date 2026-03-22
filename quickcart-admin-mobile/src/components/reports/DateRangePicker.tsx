// DateRangePicker — Simple date range selector with presets and manual input

import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Input from '../common/Input';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface DateRange {
  start: string;
  end: string;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const PRESETS = [
  { label: 'Today', days: 0 },
  { label: '7 Days', days: 7 },
  { label: '30 Days', days: 30 },
  { label: '90 Days', days: 90 },
  { label: 'This Year', days: -1 },
];

function getPresetRange(days: number): DateRange {
  const end = new Date();
  const start = new Date();
  if (days === -1) {
    start.setMonth(0, 1);
  } else {
    start.setDate(start.getDate() - days);
  }
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const selectPreset = (preset: typeof PRESETS[0]) => {
    setActivePreset(preset.label);
    onChange(getPresetRange(preset.days));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Date Range</Text>

      {/* Presets row */}
      <View style={styles.presetRow}>
        {PRESETS.map((p) => (
          <TouchableOpacity
            key={p.label}
            style={[styles.presetChip, activePreset === p.label && styles.presetChipActive]}
            onPress={() => selectPreset(p)}
          >
            <Text style={[styles.presetText, activePreset === p.label && styles.presetTextActive]}>
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Manual inputs */}
      <View style={styles.inputRow}>
        <View style={styles.half}>
          <Input
            label="Start"
            value={value.start}
            onChangeText={(v) => {
              setActivePreset(null);
              onChange({ ...value, start: v });
            }}
            placeholder="YYYY-MM-DD"
          />
        </View>
        <View style={styles.half}>
          <Input
            label="End"
            value={value.end}
            onChangeText={(v) => {
              setActivePreset(null);
              onChange({ ...value, end: v });
            }}
            placeholder="YYYY-MM-DD"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  presetChip: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 1,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  presetChipActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  presetText: {
    ...typography.small,
    fontFamily: 'Inter_500Medium',
    color: colors.text.secondary,
  },
  presetTextActive: {
    color: colors.white,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  half: {
    flex: 1,
  },
});
