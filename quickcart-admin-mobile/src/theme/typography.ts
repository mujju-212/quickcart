// QuickCart Admin — Typography
// Denser, data-optimized for admin use

import { StyleSheet } from 'react-native';

export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const typography = StyleSheet.create({
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  small: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
    lineHeight: 16,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  tableHeader: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  tableCell: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  inputText: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
  },
});
