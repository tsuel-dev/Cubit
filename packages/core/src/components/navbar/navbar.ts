import { UIElement } from '../../base/ui-element';

/**
 * <ui-navbar> — 상단 탐색 바
 *
 * 속성:
 *   brand   : 브랜드 텍스트
 *   sticky  : 상단 고정 (boolean)
 *
 * 슬롯:
 *   (default) : nav 링크 영역
 *   actions   : 우측 액션 버튼 영역
 */
export class UINavbar extends UIElement {
  static get observedAttributes(): string[] {
    return ['brand', 'sticky'];
  }

  get brand(): string {
    return this.getAttribute('brand') || '';
  }

  get sticky(): boolean {
    return this.getBooleanAttr('sticky');
  }

  protected render(): void {
    const brand = this.brand;
    const sticky = this.sticky;

    this.root.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--ui-font-family-base, sans-serif);
        }
        ${sticky ? ':host { position: sticky; top: 0; z-index: 500; }' : ''}
        nav.bar {
          display: flex;
          align-items: center;
          gap: var(--ui-space-4, 16px);
          padding: var(--ui-space-3, 12px) var(--ui-space-4, 16px);
          background-color: var(--ui-color-bg-surface, #ffffff);
          color: var(--ui-color-text-primary, #000000);
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #e0e0e0);
          border-radius: var(--ui-radius-md, 12px);
          box-sizing: border-box;
        }
        .brand {
          font-size: var(--ui-font-size-lg, 18px);
          font-weight: var(--ui-font-weight-bold, 700);
          color: var(--ui-color-primary, #ff5500);
          white-space: nowrap;
        }
        .links {
          display: flex;
          align-items: center;
          gap: var(--ui-space-2, 8px);
          flex: 1;
          min-width: 0;
          overflow-x: auto;
        }
        /* 링크 영역 안의 a 태그에 라이브러리 표준 링크 스타일 적용 */
        .links ::slotted(a) {
          display: inline-flex;
          align-items: center;
          padding: var(--ui-space-1, 4px) var(--ui-space-3, 12px);
          color: var(--ui-color-text-secondary, #616161);
          text-decoration: none;
          font-size: var(--ui-font-size-sm, 14px);
          font-weight: var(--ui-font-weight-medium, 500);
          border-radius: var(--ui-radius-sm, 8px);
          transition: background-color var(--ui-transition-fast), color var(--ui-transition-fast);
        }
        .links ::slotted(a:hover) {
          color: var(--ui-color-text-primary, #000000);
          background-color: var(--ui-color-bg-muted, #f5f5f5);
        }
        .links ::slotted(a[aria-current="page"]) {
          color: var(--ui-color-primary, #ff5500);
          background-color: var(--ui-color-primary-subtle, #fff3e6);
        }
        .links ::slotted(a:focus-visible) {
          outline: none;
          box-shadow: 0 0 0 2px var(--ui-color-bg-canvas, #ffffff), 0 0 0 4px var(--ui-color-focus-ring, #ff5500);
        }
        .actions {
          display: flex;
          align-items: center;
          gap: var(--ui-space-2, 8px);
          white-space: nowrap;
        }
        @media (max-width: 640px) {
          nav.bar { flex-wrap: wrap; }
        }
      </style>
      <nav class="bar" aria-label="주요 탐색">
        ${brand ? `<span class="brand">${this.escapeHtml(brand)}</span>` : ''}
        <div class="links"><slot></slot></div>
        <div class="actions"><slot name="actions"></slot></div>
      </nav>
    `;
  }
}

if (!customElements.get('ui-navbar')) {
  customElements.define('ui-navbar', UINavbar);
}
