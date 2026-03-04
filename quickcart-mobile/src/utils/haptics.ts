import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Lightweight haptic feedback helpers.
 * Safe on iOS and Android (no-op on web).
 */

export async function lightHaptic(): Promise<void> {
  if (Platform.OS === 'web') return;
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export async function mediumHaptic(): Promise<void> {
  if (Platform.OS === 'web') return;
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

export async function heavyHaptic(): Promise<void> {
  if (Platform.OS === 'web') return;
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}

export async function successHaptic(): Promise<void> {
  if (Platform.OS === 'web') return;
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export async function errorHaptic(): Promise<void> {
  if (Platform.OS === 'web') return;
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}

export async function warningHaptic(): Promise<void> {
  if (Platform.OS === 'web') return;
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}

export async function selectionHaptic(): Promise<void> {
  if (Platform.OS === 'web') return;
  await Haptics.selectionAsync();
}

// Quick preset haptic functions for common actions
export const haptics = {
  /** Tab press, toggles */
  tap: lightHaptic,
  /** Button press, add to cart */
  press: mediumHaptic,
  /** Place order, delete */
  impact: heavyHaptic,
  /** Order placed, payment success */
  success: successHaptic,
  /** Validation error, failed action */
  error: errorHaptic,
  /** Stock warning, low inventory */
  warning: warningHaptic,
  /** Picker scroll, option switch */
  select: selectionHaptic,
  /** Alias for select */
  selection: selectionHaptic,
} as const;

// Alias for components that import `hapticPresets`
export const hapticPresets = haptics;

// Trigger a named haptic preset
export async function triggerHaptic(type: keyof typeof haptics): Promise<void> {
  await haptics[type]();
}

export default haptics;
