// ExportButton — Button to trigger CSV or PDF export

import React, { useState } from 'react';
import { StyleSheet, View, Alert, Share } from 'react-native';
import Button from '../common/Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface ExportButtonProps {
  onExportCSV: () => Promise<string | void>;
  onExportPDF?: () => Promise<string | void>;
  disabled?: boolean;
}

export default function ExportButton({ onExportCSV, onExportPDF, disabled = false }: ExportButtonProps) {
  const [loadingCSV, setLoadingCSV] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState(false);

  const handleCSV = async () => {
    try {
      setLoadingCSV(true);
      const result = await onExportCSV();
      if (result) {
        await Share.share({ message: result, title: 'Export CSV' });
      } else {
        Alert.alert('Success', 'CSV export initiated successfully.');
      }
    } catch (err: any) {
      Alert.alert('Export Failed', err?.message || 'Could not export CSV.');
    } finally {
      setLoadingCSV(false);
    }
  };

  const handlePDF = async () => {
    if (!onExportPDF) return;
    try {
      setLoadingPDF(true);
      const result = await onExportPDF();
      if (result) {
        await Share.share({ message: result, title: 'Export PDF' });
      } else {
        Alert.alert('Success', 'PDF export initiated successfully.');
      }
    } catch (err: any) {
      Alert.alert('Export Failed', err?.message || 'Could not export PDF.');
    } finally {
      setLoadingPDF(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Export CSV"
        variant="outline"
        icon="file-delimited-outline"
        onPress={handleCSV}
        loading={loadingCSV}
        disabled={disabled || loadingPDF}
        style={styles.btn}
      />
      {onExportPDF && (
        <Button
          title="Export PDF"
          variant="outline"
          icon="file-pdf-box"
          onPress={handlePDF}
          loading={loadingPDF}
          disabled={disabled || loadingCSV}
          style={styles.btn}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  btn: {
    flex: 1,
  },
});
