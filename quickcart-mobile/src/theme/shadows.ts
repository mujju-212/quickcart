import { Platform, ViewStyle } from 'react-native';

type ShadowStyle = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

const createShadow = (
  offsetY: number,
  opacity: number,
  radius: number,
  elevation: number
): ShadowStyle => ({
  shadowColor: '#000',
  shadowOffset: { width: 0, height: offsetY },
  shadowOpacity: Platform.OS === 'ios' ? opacity : 0,
  shadowRadius: Platform.OS === 'ios' ? radius : 0,
  elevation: Platform.OS === 'android' ? elevation : 0,
});

export const shadows = {
  none: createShadow(0, 0, 0, 0),
  sm: createShadow(1, 0.05, 2, 1),
  md: createShadow(2, 0.08, 8, 3),
  lg: createShadow(4, 0.12, 16, 6),
  xl: createShadow(8, 0.15, 24, 10),
  card: createShadow(2, 0.06, 6, 2),
  button: createShadow(2, 0.1, 4, 3),
  bottomTab: createShadow(-2, 0.06, 8, 8),
  header: createShadow(2, 0.04, 4, 2),
} as const;

export type ShadowKey = keyof typeof shadows;
