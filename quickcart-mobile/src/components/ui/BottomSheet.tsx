import React, { useCallback, useMemo, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle, Dimensions } from 'react-native';
import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetScrollView,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { X } from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

export interface BottomSheetRef {
  open: () => void;
  close: () => void;
  snapTo: (index: number) => void;
}

interface BottomSheetProps {
  title?: string;
  snapPoints?: (string | number)[];
  children: React.ReactNode;
  scrollable?: boolean;
  showCloseButton?: boolean;
  showHandle?: boolean;
  onClose?: () => void;
  containerStyle?: ViewStyle;
  enableDynamicSizing?: boolean;
}

// ──────────────────────────────────────────
//  Component
// ──────────────────────────────────────────

export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  (
    {
      title,
      snapPoints: customSnapPoints,
      children,
      scrollable = false,
      showCloseButton = true,
      showHandle = true,
      onClose,
      containerStyle,
      enableDynamicSizing = false,
    },
    ref,
  ) => {
    const sheetRef = useRef<GorhomBottomSheet>(null);

    const snapPoints = useMemo(
      () => customSnapPoints ?? ['50%'],
      [customSnapPoints],
    );

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.snapToIndex(0),
      close: () => sheetRef.current?.close(),
      snapTo: (index: number) => sheetRef.current?.snapToIndex(index),
    }));

    const handleClose = useCallback(() => {
      sheetRef.current?.close();
      onClose?.();
    }, [onClose]);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          pressBehavior="close"
        />
      ),
      [],
    );

    const ContentWrapper = scrollable ? BottomSheetScrollView : BottomSheetView;

    return (
      <GorhomBottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDynamicSizing={enableDynamicSizing}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={showHandle ? styles.handle : { height: 0 }}
        backgroundStyle={styles.background}
        onChange={(index) => {
          if (index === -1) onClose?.();
        }}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <View style={styles.header}>
            {title ? (
              <Text style={styles.title}>{title}</Text>
            ) : (
              <View />
            )}
            {showCloseButton && (
              <Pressable onPress={handleClose} hitSlop={12} style={styles.closeBtn}>
                <X size={20} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>
        )}

        {/* Content */}
        <ContentWrapper
          style={[styles.content, containerStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ContentWrapper>
      </GorhomBottomSheet>
    );
  },
);

BottomSheet.displayName = 'BottomSheet';

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
    flex: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
});

export default BottomSheet;
