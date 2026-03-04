// Consistent spacing scale (multiples of 4)
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

// Screen padding
export const screenPadding = {
  horizontal: 16,
  vertical: 16,
} as const;

// Border radius
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
} as const;

// Common layout sizes
export const sizes = {
  // Bottom Tab Bar
  tabBarHeight: 60,
  tabBarIconSize: 24,

  // Header
  headerHeight: 56,

  // Product Card
  productCardImageSize: 120,
  productCardWidth: 170,

  // Category
  categoryIconSize: 64,

  // Banner
  bannerHeight: 180,

  // Button
  buttonHeight: 48,
  buttonHeightSmall: 36,

  // Input
  inputHeight: 48,

  // Avatar
  avatarSmall: 32,
  avatarMedium: 48,
  avatarLarge: 80,

  // Icon
  iconSmall: 16,
  iconMedium: 20,
  iconLarge: 24,
  iconXL: 32,

  // Badge
  badgeSize: 20,
  badgeSmall: 16,

  // Thumbnail
  thumbnailSmall: 48,
  thumbnailMedium: 64,
  thumbnailLarge: 96,

  // Cart Item
  cartItemImageSize: 72,

  // Bottom sheet
  bottomSheetHandle: 4,
} as const;

// Component-specific sizes alias
export const componentSizes = sizes;

export type SpacingKey = keyof typeof spacing;
export type BorderRadiusKey = keyof typeof borderRadius;
