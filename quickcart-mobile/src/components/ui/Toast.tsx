import React, { useEffect, useCallback, createContext, useContext, useState } from 'react';
import { Text, StyleSheet, Pressable, Dimensions, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutUp,
} from 'react-native-reanimated';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { shadows } from '@theme/shadows';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastConfig {
  message: string;
  type?: ToastType;
  duration?: number; // ms, default 3000
  action?: { label: string; onPress: () => void };
}

interface ToastItem extends ToastConfig {
  id: string;
}

interface ToastContextType {
  show: (config: ToastConfig) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

// ──────────────────────────────────────────
//  Context
// ──────────────────────────────────────────

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

// ──────────────────────────────────────────
//  Provider
// ──────────────────────────────────────────

let _toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((config: ToastConfig) => {
    const id = String(++_toastId);
    setToasts((prev) => [...prev, { ...config, id }]);

    // Auto-dismiss
    const duration = config.duration ?? 3000;
    setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  const contextValue: ToastContextType = {
    show,
    success: (message, duration) => show({ message, type: 'success', duration }),
    error: (message, duration) => show({ message, type: 'error', duration }),
    warning: (message, duration) => show({ message, type: 'warning', duration }),
    info: (message, duration) => show({ message, type: 'info', duration }),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Toast Stack */}
      <Animated.View style={styles.container} pointerEvents="box-none">
        {toasts.map((toast, index) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            index={index}
            onDismiss={() => removeToast(toast.id)}
          />
        ))}
      </Animated.View>
    </ToastContext.Provider>
  );
}

// ──────────────────────────────────────────
//  Single Toast
// ──────────────────────────────────────────

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={20} color={colors.success} />,
  error: <AlertCircle size={20} color={colors.error} />,
  warning: <AlertTriangle size={20} color={colors.warning} />,
  info: <Info size={20} color={colors.info} />,
};

const bgMap: Record<ToastType, string> = {
  success: colors.successLight,
  error: colors.errorLight,
  warning: colors.warningLight,
  info: colors.infoLight,
};

const borderMap: Record<ToastType, string> = {
  success: colors.success,
  error: colors.error,
  warning: colors.warning,
  info: colors.info,
};

function ToastItem({
  toast,
  index,
  onDismiss,
}: {
  toast: ToastItem;
  index: number;
  onDismiss: () => void;
}) {
  const type = toast.type ?? 'info';

  return (
    <Animated.View
      entering={SlideInUp.springify().damping(18).stiffness(200)}
      exiting={FadeOut.duration(200)}
      style={[
        styles.toast,
        {
          backgroundColor: bgMap[type],
          borderLeftColor: borderMap[type],
        },
        index > 0 && { marginTop: 8 },
      ]}
    >
      {iconMap[type]}

      <Text style={styles.message} numberOfLines={2}>
        {toast.message}
      </Text>

      {toast.action && (
        <Pressable onPress={toast.action.onPress} hitSlop={8}>
          <Text style={[styles.actionText, { color: borderMap[type] }]}>
            {toast.action.label}
          </Text>
        </Pressable>
      )}

      <Pressable onPress={onDismiss} hitSlop={8} style={styles.dismissBtn}>
        <X size={16} color={colors.textSecondary} />
      </Pressable>
    </Animated.View>
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 9999,
    elevation: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    ...shadows.md,
    backgroundColor: colors.white,
  },
  message: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    flex: 1,
    marginLeft: spacing.sm,
  },
  actionText: {
    ...typography.labelMedium,
    marginLeft: spacing.sm,
  },
  dismissBtn: {
    marginLeft: spacing.sm,
    padding: 2,
  },
});

export default ToastProvider;
