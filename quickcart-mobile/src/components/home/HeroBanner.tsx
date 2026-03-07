import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  FlatList,
  ViewToken,
} from 'react-native';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { shadows } from '@theme/shadows';
import { BannerSkeleton } from '@components/ui';
import type { Banner } from '@services/bannerService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - spacing.lg * 2;
const BANNER_HEIGHT = 160;
const AUTO_SCROLL_INTERVAL = 4000; // 4s

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

interface HeroBannerProps {
  banners: Banner[];
  isLoading?: boolean;
}

// ──────────────────────────────────────────
//  Component
// ──────────────────────────────────────────

export function HeroBanner({ banners, isLoading }: HeroBannerProps) {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const autoScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-scroll
  useEffect(() => {
    if (!banners.length || banners.length <= 1) return;

    autoScrollTimer.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % banners.length;
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, AUTO_SCROLL_INTERVAL);

    return () => {
      if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
    };
  }, [banners.length]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  // Loading
  if (isLoading) {
    return (
      <View style={styles.wrapper}>
        <BannerSkeleton />
      </View>
    );
  }

  if (!banners.length) return null;

  const handleBannerPress = (banner: Banner) => {
    if (banner.link_type === 'product' && banner.link_value) {
      router.push(`/product/${banner.link_value}`);
    } else if (banner.link_type === 'category' && banner.link_value) {
      router.push(`/category/${banner.link_value}`);
    } else if (banner.link_type === 'offer' && banner.link_value) {
      router.push(`/offers` as any);
    }
  };

  return (
    <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.wrapper}>
      <FlatList
        ref={flatListRef}
        data={banners}
        keyExtractor={(item) => String(item.id)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={BANNER_WIDTH + spacing.md}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleBannerPress(item)}
            style={styles.bannerCard}
          >
            <Image
              source={{ uri: item.image_url }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            {/* Gradient overlay */}
            <View style={styles.overlay}>
              {item.title && (
                <Text style={styles.bannerTitle}>{item.title}</Text>
              )}
              {item.subtitle && (
                <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
              )}
            </View>
          </Pressable>
        )}
      />

      {/* Dot Indicators */}
      {banners.length > 1 && (
        <View style={styles.dots}>
          {banners.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      )}
    </Animated.View>
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  listContent: {
    // gap handled by snapToInterval
  },
  bannerCard: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginRight: spacing.md,
    ...shadows.md,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  bannerTitle: {
    ...typography.h3,
    color: colors.white,
    marginBottom: 2,
  },
  bannerSubtitle: {
    ...typography.bodySmall,
    color: 'rgba(255,255,255,0.9)',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  dotActive: {
    width: 20,
    backgroundColor: colors.primary,
  },
  dotInactive: {
    width: 6,
    backgroundColor: colors.border,
  },
});

export default HeroBanner;
