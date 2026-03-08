import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowRight, ChevronRight } from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { ONBOARDING_SLIDES } from '@utils/constants';
import { useAuthStore } from '@stores/authStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ──────────────────────────────────────────
//  Slide Component
// ──────────────────────────────────────────

function Slide({ item }: { item: (typeof ONBOARDING_SLIDES)[0] }) {
  return (
    <View style={styles.slide}>
      {/* Illustration area */}
      <View style={styles.illustrationWrap}>
        <Text style={styles.illustrationEmoji}>{item.emoji}</Text>
      </View>
      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideDesc}>{item.description}</Text>
    </View>
  );
}

// ──────────────────────────────────────────
//  Onboarding Screen
// ──────────────────────────────────────────

export default function OnboardingScreen() {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const setHasOnboarded = useAuthStore((s) => s.setHasOnboarded);

  const isLast = activeIndex === ONBOARDING_SLIDES.length - 1;

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      setActiveIndex(Math.round(x / SCREEN_WIDTH));
    },
    []
  );

  const goNext = useCallback(() => {
    if (isLast) {
      setHasOnboarded(true);
      router.replace('/(auth)/login');
    } else {
      flatListRef.current?.scrollToOffset({
        offset: (activeIndex + 1) * SCREEN_WIDTH,
        animated: true,
      });
    }
  }, [activeIndex, isLast, router, setHasOnboarded]);

  const skip = useCallback(() => {
    setHasOnboarded(true);
    router.replace('/(auth)/login');
  }, [router, setHasOnboarded]);

  return (
    <View style={styles.container}>
      {/* Skip */}
      {!isLast && (
        <Animated.View entering={FadeIn.delay(400)} style={styles.skipWrap}>
          <TouchableOpacity onPress={skip} hitSlop={12}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={onScroll}
        keyExtractor={(_, i) => `slide-${i}`}
        renderItem={({ item }) => <Slide item={item} />}
      />

      {/* Bottom Section */}
      <Animated.View
        entering={FadeInUp.delay(300).springify()}
        style={[styles.bottomSection, { paddingBottom: bottom + spacing.lg }]}
      >
        {/* Dots */}
        <View style={styles.dotsRow}>
          {ONBOARDING_SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Next / Get Started button */}
        <TouchableOpacity
          style={styles.nextBtn}
          activeOpacity={0.85}
          onPress={goNext}
        >
          <Text style={styles.nextBtnText}>
            {isLast ? 'Get Started' : 'Next'}
          </Text>
          {isLast ? (
            <ArrowRight size={20} color={colors.textPrimary} />
          ) : (
            <ChevronRight size={20} color={colors.textPrimary} />
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
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
  skipWrap: {
    position: 'absolute',
    top: 56,
    right: spacing.md,
    zIndex: 10,
  },
  skipText: {
    ...typography.labelMedium,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  slide: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: SCREEN_HEIGHT * 0.15,
  },
  illustrationWrap: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  illustrationEmoji: {
    fontSize: 80,
  },
  slideTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  slideDesc: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },
  bottomSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.lg,
  },
  dot: {
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    height: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  dotInactive: {
    width: 8,
    height: 8,
    backgroundColor: colors.border,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    gap: 8,
    width: '100%',
  },
  nextBtnText: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    fontWeight: '700',
  },
});
