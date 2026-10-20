import { colors } from '../primitives';
import { ThemeTokens } from '../semantics';

/**
 * Light Theme Tokens
 * 기준값: Background White / Text Black / Primary #ff5500 / Secondary #ffebcc, #ffe4c9
 */
export const lightTheme: ThemeTokens = {
  // Surface / Background
  '--ui-color-bg-canvas': colors.white,
  '--ui-color-bg-surface': colors.white,
  '--ui-color-bg-muted': colors.gray[100],
  '--ui-color-bg-subtle': colors.gray[50],
  '--ui-color-bg-secondary': colors.secondaryBgLight,      // #ffebcc
  '--ui-color-bg-secondary-subtle': colors.secondaryBgSubtle, // #ffe4c9

  // Text / Foreground
  '--ui-color-text-primary': colors.black,
  '--ui-color-text-secondary': colors.gray[700],
  '--ui-color-text-muted': colors.gray[500],
  '--ui-color-text-inverse': colors.white,

  // Primary / Brand Accent
  '--ui-color-primary': colors.primary,                    // #ff5500
  '--ui-color-primary-hover': colors.primaryHover,        // #e04b00
  '--ui-color-primary-active': colors.primaryActive,      // #cc4400
  '--ui-color-primary-contrast': colors.white,
  '--ui-color-primary-subtle': colors.primarySubtle,

  // Borders & Dividers (Cubit 대비 강화)
  '--ui-color-border': colors.gray[300],
  '--ui-color-border-strong': colors.black,
  '--ui-color-border-muted': colors.gray[200],

  // Focus & Rings
  '--ui-color-focus-ring': colors.primary,

  // Feedback states (WCAG AA 4.5:1 준수)
  '--ui-color-success': colors.success,
  '--ui-color-success-bg': colors.successBg,
  '--ui-color-success-contrast': colors.white,

  '--ui-color-warning': colors.warning,
  '--ui-color-warning-bg': colors.warningBg,
  '--ui-color-warning-contrast': colors.black,

  '--ui-color-error': colors.error,
  '--ui-color-error-bg': colors.errorBg,
  '--ui-color-error-contrast': colors.white,

  '--ui-color-info': colors.info,
  '--ui-color-info-bg': colors.infoBg,
  '--ui-color-info-contrast': colors.white,

  // 보조 브랜드 색상 (보조색상1·2)
  '--ui-color-secondary-1': colors.secondaryAccent1,
  '--ui-color-secondary-2': colors.secondaryAccent2,
  '--ui-color-skeleton': '#e9ecef',
  '--ui-color-skeleton-shine': '#f8f9fa',
  '--ui-color-tile': '#f7f8fa',
};
