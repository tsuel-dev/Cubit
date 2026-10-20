/**
 * Cubit UI Primitives
 * 불변의 기준 원시값 정의 (절대 변경 금지 기준값 준수)
 */

export const colors = {
  // 기준 색상
  black: '#000000',
  white: '#ffffff',
  
  // 프라이머리 및 보조 (기준값 고정)
  primary: '#ff5500',
  primaryHover: '#e04b00',
  primaryActive: '#cc4400',
  primarySubtle: '#fff3e6',
  
  // 보조 / 배경용 (기준값 고정)
  secondaryBgLight: '#ffebcc',
  secondaryBgSubtle: '#ffe4c9',

  // 보조 브랜드 색상 (보조색상1·2 - 기준값 고정)
  secondaryAccent1: '#0284c7',     // 파랑 계열 (라이트)
  secondaryAccent1Dark: '#38bdf8', // 파랑 계열 (다크)
  secondaryAccent2: '#0d9488',     // 틸 계열 (라이트)
  secondaryAccent2Dark: '#2dd4bf', // 틸 계열 (다크)
  
  // 뉴트럴 계열 (단단한 콘트라스트)
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    950: '#121212',
  },

  // 시맨틱 상태 색상 (AA 대비율 유지)
  success: '#1b873f',
  successBg: '#e8f5e9',
  warning: '#d97706',
  warningBg: '#fffbeb',
  error: '#d32f2f',
  errorBg: '#fde8e8',
  info: '#0284c7',
  infoBg: '#e0f2fe',
} as const;

export const spacing = {
  0: '0px',
  1: '4px',    // 4px 기반 스케일
  2: '8px',    // 8px 기반 스케일
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
} as const;

export const radii = {
  none: '0px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  full: '9999px', // Avatar, Indicator, Pill 전용
} as const;

export const typography = {
  // 시스템 폰트 스택 기반
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
  fontFamilyMono:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
  },
  
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
  },

  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export const borders = {
  width: {
    none: '0px',
    thin: '1px',
    thick: '2px',
  },
} as const;

export const transitions = {
  duration: {
    fast: '100ms',
    normal: '150ms',
    slow: '250ms',
  },
  timing: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;
