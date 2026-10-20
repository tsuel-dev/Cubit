import { spacing, radii, typography, borders, transitions } from './primitives';

export interface ThemeTokens {
  // Surface / Background
  '--ui-color-bg-canvas': string;
  '--ui-color-bg-surface': string;
  '--ui-color-bg-muted': string;
  '--ui-color-bg-subtle': string;
  '--ui-color-bg-secondary': string;
  '--ui-color-bg-secondary-subtle': string;

  // Text / Foreground
  '--ui-color-text-primary': string;
  '--ui-color-text-secondary': string;
  '--ui-color-text-muted': string;
  '--ui-color-text-inverse': string;

  // Primary / Brand Accent
  '--ui-color-primary': string;
  '--ui-color-primary-hover': string;
  '--ui-color-primary-active': string;
  '--ui-color-primary-contrast': string;
  '--ui-color-primary-subtle': string;

  // Borders & Dividers
  '--ui-color-border': string;
  '--ui-color-border-strong': string;
  '--ui-color-border-muted': string;

  // Focus & Rings
  '--ui-color-focus-ring': string;

  // Feedback states
  '--ui-color-success': string;
  '--ui-color-success-bg': string;
  '--ui-color-success-contrast': string;
  '--ui-color-warning': string;
  '--ui-color-warning-bg': string;
  '--ui-color-warning-contrast': string;
  '--ui-color-error': string;
  '--ui-color-error-bg': string;
  '--ui-color-error-contrast': string;
  '--ui-color-info': string;
  '--ui-color-info-bg': string;
  '--ui-color-info-contrast': string;
  '--ui-color-secondary-1': string;
  '--ui-color-secondary-2': string;
  '--ui-color-skeleton': string;
  '--ui-color-skeleton-shine': string;
  '--ui-color-tile': string;
}

export const staticTokens = {
  // Spacing
  '--ui-space-0': spacing[0],
  '--ui-space-1': spacing[1],
  '--ui-space-2': spacing[2],
  '--ui-space-3': spacing[3],
  '--ui-space-4': spacing[4],
  '--ui-space-5': spacing[5],
  '--ui-space-6': spacing[6],
  '--ui-space-8': spacing[8],
  '--ui-space-10': spacing[10],
  '--ui-space-12': spacing[12],
  '--ui-space-16': spacing[16],

  // Radii (rounded — Bootstrap 스타일 라운딩)
  '--ui-radius-none': radii.none,
  '--ui-radius-sm': radii.sm,
  '--ui-radius-md': radii.md,
  '--ui-radius-lg': radii.lg,
  '--ui-radius-full': radii.full,

  // Typography
  '--ui-font-family-base': typography.fontFamily,
  '--ui-font-family-mono': typography.fontFamilyMono,
  
  '--ui-font-size-xs': typography.fontSize.xs,
  '--ui-font-size-sm': typography.fontSize.sm,
  '--ui-font-size-md': typography.fontSize.md,
  '--ui-font-size-lg': typography.fontSize.lg,
  '--ui-font-size-xl': typography.fontSize.xl,
  '--ui-font-size-2xl': typography.fontSize['2xl'],
  '--ui-font-size-3xl': typography.fontSize['3xl'],

  '--ui-line-height-none': typography.lineHeight.none,
  '--ui-line-height-tight': typography.lineHeight.tight,
  '--ui-line-height-snug': typography.lineHeight.snug,
  '--ui-line-height-normal': typography.lineHeight.normal,
  '--ui-line-height-relaxed': typography.lineHeight.relaxed,

  '--ui-font-weight-normal': typography.fontWeight.normal,
  '--ui-font-weight-medium': typography.fontWeight.medium,
  '--ui-font-weight-semibold': typography.fontWeight.semibold,
  '--ui-font-weight-bold': typography.fontWeight.bold,

  // Borders
  '--ui-border-width-thin': borders.width.thin,
  '--ui-border-width-thick': borders.width.thick,

  // Transitions
  '--ui-transition-fast': `${transitions.duration.fast} ${transitions.timing}`,
  '--ui-transition-normal': `${transitions.duration.normal} ${transitions.timing}`,
  '--ui-transition-slow': `${transitions.duration.slow} ${transitions.timing}`,
} as const;
