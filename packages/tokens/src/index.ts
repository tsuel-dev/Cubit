import { lightTheme } from './themes/light';
import { darkTheme } from './themes/dark';
import { staticTokens } from './semantics';

/**
 * 토큰 객체를 CSS Custom Property 문자열 블록으로 변환
 */
export function formatCssVariables<K extends string = string>(tokens: Record<K, string>, indent = '  '): string {
  return Object.entries(tokens)
    .map(([key, value]) => `${indent}${key}: ${value};`)
    .join('\n');
}

/**
 * 라이트 테마 (루트) CSS 생성
 */
export function generateRootCss(): string {
  const allLightTokens = {
    ...staticTokens,
    ...lightTheme,
  };

  return `/* Cubit UI Design Tokens - Root / Light Theme */
:root,
[data-theme="light"] {
${formatCssVariables(allLightTokens)}
}
`;
}

/**
 * 다크 테마 ([data-theme="dark"] 및 @media prefers-color-scheme) CSS 생성
 */
export function generateDarkCss(): string {
  return `/* Cubit UI Design Tokens - Dark Theme */
[data-theme="dark"] {
${formatCssVariables(darkTheme)}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${formatCssVariables(darkTheme, '    ')}
  }
}
`;
}

export * from './primitives';
export * from './semantics';
export * from './themes/light';
export * from './themes/dark';

/**
 * 런타임 테마 적용 헬퍼 (Vanilla / React / Svelte 공용)
 */
export type ThemeMode = 'light' | 'dark' | 'system';

export function setTheme(theme: ThemeMode, targetElement: HTMLElement = document.documentElement): void {
  if (theme === 'system') {
    targetElement.removeAttribute('data-theme');
  } else {
    targetElement.setAttribute('data-theme', theme);
  }
}

export function getTheme(targetElement: HTMLElement = document.documentElement): ThemeMode {
  const attr = targetElement.getAttribute('data-theme');
  if (attr === 'light' || attr === 'dark') {
    return attr;
  }
  return 'system';
}
