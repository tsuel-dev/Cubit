import { UIElement } from '../../base/ui-element';

/**
 * <ui-skeleton> — 로딩 중 콘텐츠 자리 표시
 *
 * 속성:
 *   variant : 'text' | 'circle' | 'rect' (기본 text)
 *   width   : CSS width (예: '60%', '120px') — text/rect만
 *   height  : CSS height — rect 전용 (기본 16px)
 *   lines   : text 여러 줄 (기본 1)
 */
export class UISkeleton extends UIElement {
  static get observedAttributes(): string[] {
    return ['variant', 'width', 'height', 'lines'];
  }

  get variant(): string {
    return this.getAttribute('variant') || 'text';
  }

  get width(): string {
    return this.getAttribute('width') || '';
  }

  get height(): string {
    return this.getAttribute('height') || '';
  }

  get lines(): number {
    const n = parseInt(this.getAttribute('lines') || '1', 10);
    return Number.isFinite(n) && n > 0 ? Math.min(n, 6) : 1;
  }

  protected render(): void {
    const variant = this.variant;

    const widthStyle = this.width ? `width: ${this.escape(this.width)};` : '';
    const heightStyle = this.height ? `height: ${this.escape(this.height)};` : '';

    const bars =
      variant === 'text' && this.lines > 1
        ? Array.from({ length: this.lines }, (_, i) => {
            const isLast = i === this.lines - 1;
            const w = isLast ? 'width: 70%;' : 'width: 100%;';
            return `<span class="shimmer bar" style="${w}"></span>`;
          }).join('')
        : `<span class="shimmer ${variant === 'circle' ? 'circle' : variant === 'rect' ? 'rect' : 'bar'}" style="${widthStyle}${heightStyle}"></span>`;

    this.root.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--ui-font-family-base, sans-serif);
        }
        .wrap {
          display: inline-flex;
          flex-direction: column;
          gap: var(--ui-space-2, 8px);
        }
        .shimmer {
          display: block;
          background: linear-gradient(
            90deg,
            var(--ui-color-skeleton, #e9ecef) 25%,
            var(--ui-color-skeleton-shine, #f8f9fa) 50%,
            var(--ui-color-skeleton, #e9ecef) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.4s ease infinite;
        }
        .bar   { height: 14px; border-radius: var(--ui-radius-sm, 8px); width: 100%; }
        .rect  { border-radius: var(--ui-radius-sm, 8px); }
        .circle{ border-radius: var(--ui-radius-full, 9999px); width: 36px; height: 36px; }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .shimmer { animation: none; }
        }
      </style>
      <div class="wrap" aria-hidden="true">${bars}</div>
    `;
  }

  private escape(s: string): string {
    return s.replace(/["<>]/g, '');
  }
}

if (!customElements.get('ui-skeleton')) {
  customElements.define('ui-skeleton', UISkeleton);
}
