// QuickCart Color Palette
// Consistent across all screens — modern quick-commerce feel

export const colors = {
  // Brand
  primary: '#FFD700',
  primaryDark: '#E6C200',
  primaryLight: '#FFF3B0',
  primaryMuted: '#FFF8DC',

  // Backgrounds
  background: '#FFFFFF',
  surface: '#F7F7F7',
  card: '#FFFFFF',
  inputBg: '#F5F5F5',

  // Text
  text: '#1A1A1A',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',
  textLink: '#3B82F6',
  textDisabled: '#D1D5DB',

  // Status
  success: '#22C55E',
  successLight: '#DCFCE7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Borders & Dividers
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  divider: '#F3F4F6',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Misc
  star: '#FFC107',
  rating: '#FFC107',
  discount: '#EF4444',
  free: '#22C55E',
  skeleton: '#E5E7EB',
  shimmer: '#F3F4F6',

  // Tab Bar
  tabActive: '#FFD700',
  tabInactive: '#9CA3AF',
  tabBg: '#FFFFFF',

  // Cart Badge
  badge: '#EF4444',
  badgeText: '#FFFFFF',

  // Grey Scale
  grey50: '#F9FAFB',
  grey100: '#F3F4F6',
  grey200: '#E5E7EB',
  grey300: '#D1D5DB',
  grey400: '#9CA3AF',
  grey500: '#6B7280',

  // Transparent
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorKey = keyof typeof colors;
