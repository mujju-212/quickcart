import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  StatusBar,
  ViewStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { colors } from '@theme/colors';
import { spacing, borderRadius } from '@theme/spacing';
import { typography } from '@theme/typography';

// ──────────────────────────────────────────
//  Constants
// ──────────────────────────────────────────

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GALLERY_HEIGHT = SCREEN_WIDTH; // 1:1 aspect ratio
const THUMBNAIL_SIZE = 56;

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

interface ImageGalleryProps {
  images: string[];
  productName?: string;
  style?: ViewStyle;
}

// ──────────────────────────────────────────
//  Dot Indicators
// ──────────────────────────────────────────

function DotIndicators({
  total,
  activeIndex,
}: {
  total: number;
  activeIndex: number;
}) {
  if (total <= 1) return null;
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === activeIndex ? styles.dotActive : styles.dotInactive,
          ]}
        />
      ))}
    </View>
  );
}

// ──────────────────────────────────────────
//  Thumbnail Strip
// ──────────────────────────────────────────

function ThumbnailStrip({
  images,
  activeIndex,
  onSelect,
}: {
  images: string[];
  activeIndex: number;
  onSelect: (idx: number) => void;
}) {
  if (images.length <= 1) return null;
  return (
    <View style={styles.thumbRow}>
      {images.map((uri, i) => (
        <TouchableOpacity
          key={i}
          activeOpacity={0.7}
          onPress={() => onSelect(i)}
        >
          <Image
            source={{ uri }}
            style={[
              styles.thumb,
              i === activeIndex && styles.thumbActive,
            ]}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ──────────────────────────────────────────
//  Fullscreen Viewer Modal
// ──────────────────────────────────────────

function FullscreenViewer({
  images,
  visible,
  initialIndex,
  onClose,
}: {
  images: string[];
  visible: boolean;
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const flatListRef = useRef<FlatList>(null);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const newIdx = Math.round(x / SCREEN_WIDTH);
      if (newIdx !== index) setIndex(newIdx);
    },
    [index]
  );

  const goTo = useCallback(
    (dir: -1 | 1) => {
      const next = index + dir;
      if (next >= 0 && next < images.length) {
        flatListRef.current?.scrollToOffset({
          offset: next * SCREEN_WIDTH,
          animated: true,
        });
        setIndex(next);
      }
    },
    [index, images.length]
  );

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.fullscreenBg}>
        {/* Close */}
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={onClose}
          hitSlop={12}
        >
          <X size={24} color={colors.white} />
        </TouchableOpacity>

        {/* Counter */}
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>
            {index + 1} / {images.length}
          </Text>
        </View>

        {/* Image List */}
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={initialIndex}
          getItemLayout={(_, i) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * i,
            index: i,
          })}
          onMomentumScrollEnd={onScroll}
          keyExtractor={(_, i) => `fs-${i}`}
          renderItem={({ item }) => (
            <View style={styles.fullscreenSlide}>
              <Image
                source={{ uri: item }}
                style={styles.fullscreenImage}
                resizeMode="contain"
              />
            </View>
          )}
        />

        {/* Nav arrows */}
        {index > 0 && (
          <TouchableOpacity
            style={[styles.navArrow, styles.navArrowLeft]}
            onPress={() => goTo(-1)}
          >
            <ChevronLeft size={28} color={colors.white} />
          </TouchableOpacity>
        )}
        {index < images.length - 1 && (
          <TouchableOpacity
            style={[styles.navArrow, styles.navArrowRight]}
            onPress={() => goTo(1)}
          >
            <ChevronRight size={28} color={colors.white} />
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
}

// ──────────────────────────────────────────
//  Main Gallery Component
// ──────────────────────────────────────────

export function ImageGallery({ images, productName, style }: ImageGalleryProps) {
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const safeImages =
    images && images.length > 0
      ? images
      : ['https://via.placeholder.com/400x400?text=No+Image'];

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      setActiveIndex(Math.round(x / SCREEN_WIDTH));
    },
    []
  );

  const scrollTo = useCallback((idx: number) => {
    flatListRef.current?.scrollToOffset({
      offset: idx * SCREEN_WIDTH,
      animated: true,
    });
    setActiveIndex(idx);
  }, []);

  return (
    <Animated.View entering={FadeIn.duration(300)} style={style}>
      {/* Main Gallery */}
      <View style={styles.galleryWrap}>
        <FlatList
          ref={flatListRef}
          data={safeImages}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScroll}
          keyExtractor={(_, i) => `img-${i}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setShowFullscreen(true)}
              style={styles.slide}
            >
              <Image
                source={{ uri: item }}
                style={styles.mainImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
        />

        {/* Zoom Hint */}
        <View style={styles.zoomHint}>
          <ZoomIn size={16} color={colors.white} />
        </View>

        {/* Dots */}
        <DotIndicators total={safeImages.length} activeIndex={activeIndex} />
      </View>

      {/* Thumbnails */}
      <ThumbnailStrip
        images={safeImages}
        activeIndex={activeIndex}
        onSelect={scrollTo}
      />

      {/* Fullscreen Modal */}
      <FullscreenViewer
        images={safeImages}
        visible={showFullscreen}
        initialIndex={activeIndex}
        onClose={() => setShowFullscreen(false)}
      />
    </Animated.View>
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  galleryWrap: {
    width: SCREEN_WIDTH,
    height: GALLERY_HEIGHT,
    backgroundColor: colors.surface,
    position: 'relative',
  },
  slide: {
    width: SCREEN_WIDTH,
    height: GALLERY_HEIGHT,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  zoomHint: {
    position: 'absolute',
    bottom: 40,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.45)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsRow: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    borderRadius: 4,
  },
  dotActive: {
    width: 20,
    height: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  dotInactive: {
    width: 8,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },

  // Thumbnails
  thumbRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  thumb: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbActive: {
    borderColor: colors.primary,
  },

  // Fullscreen
  fullscreenBg: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBadge: {
    position: 'absolute',
    top: 54,
    left: 16,
    zIndex: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
  },
  counterText: {
    ...typography.labelSmall,
    color: colors.white,
  },
  fullscreenSlide: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  navArrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  navArrowLeft: {
    left: 12,
  },
  navArrowRight: {
    right: 12,
  },
});

export default ImageGallery;
