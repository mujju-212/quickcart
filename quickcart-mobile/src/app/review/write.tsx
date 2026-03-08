import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AnimatedRN, {
  FadeInUp,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Star, Camera, X, Send, Check } from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { shadows } from '@theme/shadows';
import { Header } from '@components/common';
import { Button } from '@components/ui';
import reviewService from '@services/reviewService';
import { triggerHaptic } from '@utils/haptics';
import { formatPrice } from '@utils/helpers';

// ──────────────────────────────────────────
//  Star Rating Picker
// ──────────────────────────────────────────

const RATING_LABELS = ['', 'Terrible', 'Poor', 'Average', 'Good', 'Excellent'];

function StarPicker({
  rating,
  onRate,
}: {
  rating: number;
  onRate: (r: number) => void;
}) {
  return (
    <View style={starStyles.container}>
      <View style={starStyles.row}>
        {[1, 2, 3, 4, 5].map((i) => (
          <TouchableOpacity
            key={i}
            onPress={() => {
              onRate(i);
              triggerHaptic('tap');
            }}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <Star
              size={40}
              color={i <= rating ? colors.primary : colors.border}
              fill={i <= rating ? colors.primary : 'transparent'}
            />
          </TouchableOpacity>
        ))}
      </View>
      {rating > 0 && (
        <AnimatedRN.Text
          entering={ZoomIn.springify()}
          style={[starStyles.label, { color: rating >= 4 ? colors.success : rating >= 3 ? colors.primary : colors.error }]}
        >
          {RATING_LABELS[rating]}
        </AnimatedRN.Text>
      )}
    </View>
  );
}

const starStyles = StyleSheet.create({
  container: { alignItems: 'center', gap: spacing.xs },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  label: {
    ...typography.bodyMedium,
    fontWeight: '600',
    marginTop: 4,
  },
});

// ──────────────────────────────────────────
//  Write Review Screen
// ──────────────────────────────────────────

export default function WriteReviewScreen() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    productId: string;
    productName: string;
    productImage: string;
    productPrice: string;
    orderId: string;
  }>();

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ──────────── submit ──────────────

  const handleSubmit = useCallback(async () => {
    if (rating === 0) {
      Alert.alert('Rating required', 'Please select a star rating.');
      return;
    }
    if (!comment.trim()) {
      Alert.alert('Review required', 'Please write a few words about the product.');
      return;
    }

    setLoading(true);
    try {
      await reviewService.addReview(
        Number(params.productId),
        rating,
        comment.trim(),
      );

      triggerHaptic('success');
      setSubmitted(true);

      // Go back after animation
      setTimeout(() => {
        router.back();
      }, 1800);
    } catch (error: any) {
      Alert.alert('Failed', error?.message || 'Could not submit review. Try again.');
    } finally {
      setLoading(false);
    }
  }, [rating, title, comment, params.productId, router]);

  // ──────────── render ──────────────

  if (submitted) {
    return (
      <View style={[styles.container, { paddingTop: top }]}>
        <Header title="Review" />
        <View style={styles.successContainer}>
          <AnimatedRN.View entering={ZoomIn.springify()} style={styles.successCircle}>
            <Check size={48} color={colors.white} />
          </AnimatedRN.View>
          <AnimatedRN.Text entering={FadeInUp.delay(200).springify()} style={styles.successTitle}>
            Thank you!
          </AnimatedRN.Text>
          <AnimatedRN.Text entering={FadeInUp.delay(300).springify()} style={styles.successSub}>
            Your review helps other shoppers make better decisions.
          </AnimatedRN.Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <Header title="Write a Review" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Product Info ── */}
          <AnimatedRN.View entering={FadeInUp.springify()} style={styles.productCard}>
            {params.productImage ? (
              <Image
                source={{ uri: params.productImage }}
                style={styles.productImage}
              />
            ) : (
              <View style={[styles.productImage, styles.imagePlaceholder]}>
                <Star size={24} color={colors.textTertiary} />
              </View>
            )}
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={2}>
                {params.productName || 'Product'}
              </Text>
              {params.productPrice && (
                <Text style={styles.productPrice}>
                  {formatPrice(Number(params.productPrice))}
                </Text>
              )}
            </View>
          </AnimatedRN.View>

          {/* ── Star Rating ── */}
          <AnimatedRN.View entering={FadeInUp.delay(100).springify()} style={styles.section}>
            <Text style={styles.sectionLabel}>Your Rating *</Text>
            <StarPicker rating={rating} onRate={setRating} />
          </AnimatedRN.View>

          {/* ── Title ── */}
          <AnimatedRN.View entering={FadeInUp.delay(150).springify()} style={styles.section}>
            <Text style={styles.sectionLabel}>Review Title (optional)</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="Sum it up in a few words"
              placeholderTextColor={colors.textTertiary}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </AnimatedRN.View>

          {/* ── Comment ── */}
          <AnimatedRN.View entering={FadeInUp.delay(200).springify()} style={styles.section}>
            <Text style={styles.sectionLabel}>Your Review *</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="What did you like or dislike? How was the quality?"
              placeholderTextColor={colors.textTertiary}
              value={comment}
              onChangeText={setComment}
              multiline
              textAlignVertical="top"
              maxLength={1000}
            />
            <Text style={styles.charCount}>{comment.length}/1000</Text>
          </AnimatedRN.View>

          {/* ── Submit ── */}
          <AnimatedRN.View entering={FadeInUp.delay(250).springify()}>
            <Button
              title="Submit Review"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading || rating === 0 || !comment.trim()}
              icon={<Send size={18} color={colors.text} />}
              style={styles.submitBtn}
            />
          </AnimatedRN.View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  flex: { flex: 1 },
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
  },

  // Product card
  productCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.sm,
    marginBottom: spacing.xl,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    ...typography.bodyMedium,
    color: colors.text,
    fontWeight: '600',
  },
  productPrice: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 2,
  },

  // Sections
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.labelMedium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },

  // Title input
  titleInput: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    ...typography.bodyMedium,
    color: colors.text,
    ...shadows.sm,
  },

  // Comment input
  commentInput: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    ...typography.bodyMedium,
    color: colors.text,
    minHeight: 120,
    ...shadows.sm,
  },
  charCount: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'right',
    marginTop: 4,
  },

  // Submit
  submitBtn: {
    marginTop: spacing.md,
  },

  // Success
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  successCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  successTitle: {
    ...typography.h2,
    color: colors.text,
  },
  successSub: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
