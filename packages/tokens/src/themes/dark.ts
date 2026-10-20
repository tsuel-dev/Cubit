import { colors } from '../primitives';
import { ThemeTokens } from '../semantics';

/**
 * Dark Theme Tokens
 * 기준값: Background Black 기반 / Text White / Primary #ff5500 유지 및 WCAG 2.1 AA 대비 보장
 * 보조 색상(#ffebcc, #ffe4c9)의 정체성을 다크 모드에 맞게 고대비로 매핑
 */
export const darkTheme: ThemeTokens = {
  // Surface / Background (다크 모드 계층)
  '--ui-color-bg-canvas': colors.black,                    // #000000
  '--ui-color-bg-surface': colors.gray[950],               // #121212
  '--ui-color-bg-muted': colors.gray[900],                 // #212121
  '--ui-color-bg-subtle': colors.gray[800],                // #424242
  '--ui-color-bg-secondary': '#331d0d',                    // #ffebcc의 다크 모드 심도 매핑 (대비 보장)
  '--ui-color-bg-secondary-subtle': '#442611',             // #ffe4c9의 다크 모드 심도 매핑

  // Text / Foreground
  '--ui-color-text-primary': colors.white,                 // #ffffff
  '--ui-color-text-secondary': colors.gray[300],           // #e0e0e0
  '--ui-color-text-muted': colors.gray[400],               // #bdbdbd
  '--ui-color-text-inverse': colors.black,

  // Primary / Brand Accent (#ff5500 대비율 최적화)
  '--ui-color-primary': colors.primary,                    // #ff5500
  '--ui-color-primary-hover': '#ff6e26',                   // 다크 가독성 호버
  '--ui-color-primary-active': '#e04b00',
  '--ui-color-primary-contrast': colors.white,
  '--ui-color-primary-subtle': '#2a1408',

  // Borders & Dividers (Cubit 테두리 대비 강화)
  '--ui-color-border': colors.gray[800],                   // #424242
  '--ui-color-border-strong': colors.gray[500],            // #9e9e9e
  '--ui-color-border-muted': colors.gray[900],             // #212121

  // Focus & Rings
  '--ui-color-focus-ring': '#ff7733',

  // Feedback states (WCAG AA 4.5:1 준수)
  '--ui-color-success': '#4ade80',
  '--ui-color-success-bg': '#052e16',
  '--ui-color-success-contrast': colors.white,

  '--ui-color-warning': '#fbbf24',
  '--ui-color-warning-bg': '#451a03',
  '--ui-color-warning-contrast': colors.black,

  '--ui-color-error': '#f87171',
  '--ui-color-error-bg': '#450a0a',
  '--ui-color-error-contrast': colors.white,

  '--ui-color-info': '#38bdf8',
  '--ui-color-info-bg': '#082f49',
  '--ui-color-info-contrast': colors.white,

  // 보조 브랜드 색상 (보조색상1·2)
  '--ui-color-secondary-1': colors.secondaryAccent1Dark,
  '--ui-color-secondary-2': colors.secondaryAccent2Dark,
  '--ui-color-skeleton': '#333333',
  '--ui-color-skeleton-shine': '#212121',
  '--ui-color-tile': '#161616',
};
