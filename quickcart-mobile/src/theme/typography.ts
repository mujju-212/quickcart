import { Platform, TextStyle } from 'react-native';

// Font Families
const fontFamily = {
  heading: Platform.select({
    ios: 'PlusJakartaSans-Bold',
    android: 'PlusJakartaSans-Bold',
    default: 'System',
  }),
  headingSemiBold: Platform.select({
    ios: 'PlusJakartaSans-SemiBold',
    android: 'PlusJakartaSans-SemiBold',
    default: 'System',
  }),
  body: Platform.select({
    ios: 'Inter-Regular',
    android: 'Inter-Regular',
    default: 'System',
  }),
  bodyMedium: Platform.select({
    ios: 'Inter-Medium',
    android: 'Inter-Medium',
    default: 'System',
  }),
  bodySemiBold: Platform.select({
    ios: 'Inter-SemiBold',
    android: 'Inter-SemiBold',
    default: 'System',
  }),
  bodyBold: Platform.select({
    ios: 'Inter-Bold',
    android: 'Inter-Bold',
    default: 'System',
  }),
};

// Typography Scale
export const typography = {
  hero: {
    fontFamily: fontFamily.heading,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
  } as TextStyle,

  h1: {
    fontFamily: fontFamily.heading,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
  } as TextStyle,

  h2: {
    fontFamily: fontFamily.headingSemiBold,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  } as TextStyle,

  h3: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
  } as TextStyle,

  h4: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  } as TextStyle,

  h5: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  } as TextStyle,

  bodyLarge: {
    fontFamily: fontFamily.body,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  } as TextStyle,

  body: {
    fontFamily: fontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  } as TextStyle,

  bodySmall: {
    fontFamily: fontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  } as TextStyle,

  bodyMedium: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  } as TextStyle,

  caption: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  } as TextStyle,

  overline: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  } as TextStyle,

  price: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  } as TextStyle,

  priceSmall: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
  } as TextStyle,

  priceStrike: {
    fontFamily: fontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    textDecorationLine: 'line-through',
  } as TextStyle,

  button: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
  } as TextStyle,

  buttonSmall: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
  } as TextStyle,

  label: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  } as TextStyle,

  labelMedium: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  } as TextStyle,

  labelLarge: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  } as TextStyle,

  labelSmall: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
  } as TextStyle,

  tabLabel: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
  } as TextStyle,
} as const;

export const fonts = fontFamily;
export type TypographyKey = keyof typeof typography;
