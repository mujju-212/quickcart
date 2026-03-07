import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Star, Send, X } from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { Button } from '@components/ui';
import { triggerHaptic } from '@utils/haptics';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

interface ReviewFormProps {
  /** Pre-filled rating (for editing) */
  initialRating?: number;
  /** Pre-filled comment (for editing) */
  initialComment?: string;
  /** Called when user submits */
  onSubmit: (rating: number, comment: string) => void;
  /** Called to cancel / close the form */
  onCancel?: () => void;
  /** Loading state while submitting */
  isLoading?: boolean;
  /** Edit mode title */
  isEditing?: boolean;
  style?: ViewStyle;
}

// ──────────────────────────────────────────
//  Star Picker
// ──────────────────────────────────────────

const STAR_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

function StarPicker({
  rating,
  onSelect,
}: {
  rating: number;
  onSelect: (r: number) => void;
}) {
  return (
    <View style={styles.starPicker}>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            activeOpacity={0.7}
            onPress={() => {
              triggerHaptic('selection');
              onSelect(star);
            }}
            style={styles.starTouch}
          >
            <Star
              size={32}
              color={star <= rating ? colors.rating : colors.border}
              fill={star <= rating ? colors.rating : 'transparent'}
            />
          </TouchableOpacity>
        ))}
      </View>
      {rating > 0 && (
        <Text style={styles.starLabel}>{STAR_LABELS[rating]}</Text>
      )}
    </View>
  );
}

// ──────────────────────────────────────────
//  Review Form Component
// ──────────────────────────────────────────

export function ReviewForm({
  initialRating = 0,
  initialComment = '',
  onSubmit,
  onCancel,
  isLoading = false,
  isEditing = false,
  style,
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [error, setError] = useState('');

  const maxChars = 500;

  const handleSubmit = useCallback(() => {
    if (rating === 0) {
      setError('Please select a rating');
      triggerHaptic('error');
      return;
    }
    setError('');
    triggerHaptic('success');
    onSubmit(rating, comment.trim());
  }, [rating, comment, onSubmit]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Animated.View entering={FadeInUp.duration(300)} style={[styles.container, style]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {isEditing ? 'Edit Review' : 'Write a Review'}
          </Text>
          {onCancel && (
            <TouchableOpacity onPress={onCancel} hitSlop={8}>
              <X size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Star Picker */}
        <StarPicker rating={rating} onSelect={setRating} />
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Comment Input */}
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.textInput}
            placeholder="Share your experience with this product..."
            placeholderTextColor={colors.textTertiary}
            value={comment}
            onChangeText={(t) => {
              if (t.length <= maxChars) setComment(t);
            }}
            multiline
            maxLength={maxChars}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>
            {comment.length}/{maxChars}
          </Text>
        </View>

        {/* Submit */}
        <Button
          title={isEditing ? 'Update Review' : 'Submit Review'}
          onPress={handleSubmit}
          loading={isLoading}
          disabled={rating === 0}
          icon={<Send size={16} color={colors.white} />}
          iconPosition="left"
          fullWidth
        />
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  starPicker: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  starTouch: {
    padding: 4,
  },
  starLabel: {
    ...typography.labelSmall,
    color: colors.primary,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  error: {
    ...typography.caption,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  inputWrap: {
    marginBottom: spacing.md,
  },
  textInput: {
    ...typography.bodyMedium,
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  charCount: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'right',
    marginTop: 4,
  },
});

export default ReviewForm;
