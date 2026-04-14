// DataTable — Compact data table for mobile with scrollable rows  

import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

export interface Column<T> {
  key: string;
  title: string;
  width?: number;
  flex?: number;
  render?: (item: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  onRowPress?: (item: T) => void;
  style?: ViewStyle;
  emptyMessage?: string;
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowPress,
  style,
  emptyMessage = 'No data found',
}: DataTableProps<T>) {
  return (
    <View style={[styles.container, style]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Header */}
          <View style={styles.headerRow}>
            {columns.map((col) => (
              <View
                key={col.key}
                style={[
                  styles.cell,
                  col.width ? { width: col.width } : { flex: col.flex || 1 },
                  col.align === 'center' && styles.cellCenter,
                  col.align === 'right' && styles.cellRight,
                ]}
              >
                <Text style={styles.headerText}>{col.title}</Text>
              </View>
            ))}
          </View>

          {/* Rows */}
          {data.length === 0 ? (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyText}>{emptyMessage}</Text>
            </View>
          ) : (
            data.map((item, index) => {
              const Row = onRowPress ? TouchableOpacity : View;
              return (
                <Row
                  key={keyExtractor(item, index)}
                  style={[styles.row, index % 2 === 1 && styles.rowAlt]}
                  {...(onRowPress ? { onPress: () => onRowPress(item), activeOpacity: 0.6 } : {})}
                >
                  {columns.map((col) => (
                    <View
                      key={col.key}
                      style={[
                        styles.cell,
                        col.width ? { width: col.width } : { flex: col.flex || 1 },
                        col.align === 'center' && styles.cellCenter,
                        col.align === 'right' && styles.cellRight,
                      ]}
                    >
                      {col.render ? (
                        col.render(item, index)
                      ) : (
                        <Text style={styles.cellText} numberOfLines={1}>
                          {(item as any)[col.key] ?? '-'}
                        </Text>
                      )}
                    </View>
                  ))}
                </Row>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  rowAlt: {
    backgroundColor: colors.background.primary + '60',
  },
  cell: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
    minWidth: 80,
  },
  cellCenter: { alignItems: 'center' },
  cellRight: { alignItems: 'flex-end' },
  headerText: {
    ...typography.tableHeader,
    color: colors.text.secondary,
  },
  cellText: {
    ...typography.tableCell,
    color: colors.text.primary,
  },
  emptyRow: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.text.disabled,
  },
});
