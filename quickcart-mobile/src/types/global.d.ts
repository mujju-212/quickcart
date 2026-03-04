// ──────────────────────────────────────────
//  Global type declarations for React Native
// ──────────────────────────────────────────

/**
 * React Native provides `__DEV__` at runtime.
 * true when running in development mode, false in production.
 */
declare const __DEV__: boolean;

/**
 * Asset imports – allow importing images/fonts as modules.
 */
declare module '*.png' {
  const value: number;
  export default value;
}

declare module '*.jpg' {
  const value: number;
  export default value;
}

declare module '*.jpeg' {
  const value: number;
  export default value;
}

declare module '*.gif' {
  const value: number;
  export default value;
}

declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module '*.ttf' {
  const value: number;
  export default value;
}

declare module '*.otf' {
  const value: number;
  export default value;
}
