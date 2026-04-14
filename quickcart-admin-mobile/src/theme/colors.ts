// QuickCart Admin — Color Palette
// Deep Blue authority theme for admin panel

export const colors = {
  // Primary (shade palette so colors.primary[600] etc. work)
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#1E40AF',
    700: '#1E3A8A',
  } as { [key: number]: string; 50: string; 100: string; 200: string; 300: string; 400: string; 500: string; 600: string; 700: string },
  primaryLight: '#3B82F6',
  primaryDark: '#1E3A8A',
  accent: '#FFD700', // QuickCart Gold brand consistency

  // Backgrounds (nested for colors.background.primary etc.)
  background: {
    primary: '#F1F5F9',
    secondary: '#E2E8F0',
    tertiary: '#F8FAFC',
  },
  surface: '#FFFFFF',
  card: '#FFFFFF',

  // Text (nested for colors.text.primary etc.)
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    tertiary: '#94A3B8',
    disabled: '#CBD5E1',
  },

  // Legacy flat aliases (keep for backwards compat)
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textOnPrimary: '#FFFFFF',

  // Status
  success: '#16A34A',
  warning: '#D97706',
  error: '#DC2626',
  info: '#2563EB',

  // Borders
  border: '#E2E8F0',
  divider: '#F1F5F9',

  // Chart palette
  chart: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'],

  // Order status colors
  status: {
    pending: '#F59E0B',
    confirmed: '#3B82F6',
    processing: '#8B5CF6',
    shipped: '#06B6D4',
    out_for_delivery: '#06B6D4',
    delivered: '#16A34A',
    cancelled: '#DC2626',
  },

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.2)',

  // Misc
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export type ColorKey = keyof typeof colors;
export type StatusColorKey = keyof typeof colors.status;
