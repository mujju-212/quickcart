// ImageUploader — Image URL input with preview

import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, TextInput } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface ImageUploaderProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
}

export default function ImageUploader({ imageUrl, onImageChange }: ImageUploaderProps) {
  const [editing, setEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(imageUrl);
  const [error, setError] = useState(false);

  const handleSave = () => {
    onImageChange(tempUrl);
    setEditing(false);
    setError(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Product Image</Text>

      {/* Preview */}
      <View style={styles.previewWrap}>
        {imageUrl && !error ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.preview}
            onError={() => setError(true)}
          />
        ) : (
          <View style={[styles.preview, styles.placeholder]}>
            <MaterialCommunityIcons name="image-plus" size={40} color={colors.text.disabled} />
            <Text style={styles.placeholderText}>No image</Text>
          </View>
        )}

        {/* Edit overlay */}
        <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
          <MaterialCommunityIcons name="pencil" size={16} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* URL input (expanded) */}
      {editing && (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={tempUrl}
            onChangeText={(v) => {
              setTempUrl(v);
              setError(false);
            }}
            placeholder="Paste image URL..."
            placeholderTextColor={colors.text.disabled}
            autoCapitalize="none"
            keyboardType="url"
          />
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <MaterialCommunityIcons name="check" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}
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
  previewWrap: {
    position: 'relative',
    alignSelf: 'center',
  },
  preview: {
    width: 160,
    height: 160,
    borderRadius: borderRadius.lg,
  },
  placeholder: {
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    ...typography.small,
    color: colors.text.disabled,
    marginTop: spacing.xs,
  },
  editBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    ...typography.body,
    color: colors.text.primary,
  },
  saveBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
