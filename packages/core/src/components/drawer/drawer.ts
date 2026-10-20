import { UIElement } from '../../base/ui-element';

/**
 * <ui-drawer> — Offcanvas 사이드 패널
 *
 * 속성:
 *   open      : 열림 상태 (boolean)
 *   side      : 'left' | 'right' (기본 right)
 *   title     : 헤더 타이틀
 *
 * 슬롯:
 *   (default) : 본문
 *   footer    : 하단 액션 영역
 *
 * UIElementBase 공통 동작: ESC 닫기, 백드롭 클릭 닫기, 포커스 트랩
 */
export class UIDrawer extends UIElement {
  static get observedAttributes(): string[] {
    return ['open', 'side', 'title'];
  }

  constructor() {
    super();
    // 컴포넌트가 자체 키보드 동작을 갖지 않으므로 상위 기본 role/value 방지
    this.removeAttribute('tabindex');
  }

  get open(): boolean {
    return this.getBooleanAttr('open');
  }

  set open(val: boolean) {
    this.setBooleanAttr('open', val);
  }

  get side(): string {
    return this.getAttribute('side') || 'right';
  }

  override get title(): string {
    return this.getAttribute('title') || '';
  }

  override set title(val: string) {
    this.setAttribute('title', val);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute('role')) this.setAttribute('role', 'dialog');
    this.setAttribute('aria-modal', 'true');

    // ESC 닫기
    this.listen('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.open) this.close();
    });
  }

  public close(): void {
    this.open = false;
    this.emit('close', {});
  }

  protected render(): void {
    const open = this.open;
    const side = this.side === 'left' ? 'left' : 'right';
    const title = this.title;

    if (!open) {
      this.root.innerHTML = '';
      return;
    }

    this.root.innerHTML = `
      <style>
        :host {
          position: fixed;
          inset: 0;
          z-index: 1000;
          font-family: var(--ui-font-family-base, sans-serif);
        }
        .backdrop {
          position: absolute;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
        }
        .panel {
          position: absolute;
          top: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          width: min(360px, 88vw);
          background-color: var(--ui-color-bg-surface, #ffffff);
          color: var(--ui-color-text-primary, #000000);
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #e0e0e0);
          border-radius: var(--ui-radius-md, 12px);
          margin: var(--ui-space-3, 12px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
          animation: slide-in 160ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .panel.left {
          left: 0;
          border-top-left-radius: var(--ui-radius-md, 12px);
          border-bottom-left-radius: var(--ui-radius-md, 12px);
        }
        .panel.right {
          right: 0;
          border-top-right-radius: var(--ui-radius-md, 12px);
          border-bottom-right-radius: var(--ui-radius-md, 12px);
        }
        @keyframes slide-in {
          from { transform: translateX(${side === 'left' ? '-24px' : '24px'}); opacity: 0.4; }
          to   { transform: translateX(0); opacity: 1; }
        }
        header.head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ui-space-2, 8px);
          padding: var(--ui-space-4, 16px);
          border-bottom: var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #e0e0e0);
        }
        .head h2 {
          margin: 0;
          font-size: var(--ui-font-size-lg, 18px);
          font-weight: var(--ui-font-weight-semibold, 600);
        }
        .close-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          color: inherit;
          border-radius: var(--ui-radius-full, 9999px);
          cursor: pointer;
          font-size: var(--ui-font-size-lg, 18px);
          line-height: 1;
        }
        .close-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px var(--ui-color-bg-canvas, #ffffff), 0 0 0 4px var(--ui-color-focus-ring, #ff5500);
        }
        .body {
          flex: 1;
          overflow-y: auto;
          padding: var(--ui-space-4, 16px);
        }
        footer.foot {
          padding: var(--ui-space-4, 16px);
          border-top: var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #e0e0e0);
        }
        :host(:focus-visible) {
          outline: none;
        }
      </style>
      <div class="backdrop" data-backdrop></div>
      <div class="panel ${side}" part="panel">
        <header class="head">
          <h2>${this.escapeHtml(title)}</h2>
          <button class="close-btn" data-close aria-label="닫기">✕</button>
        </header>
        <div class="body"><slot></slot></div>
        <footer class="foot" style="display:none;"><slot name="footer"></slot></footer>
      </div>
    `;

    const footer = this.root.querySelector('footer.foot') as HTMLElement;
    if (this.querySelector('[slot="footer"]')) footer.style.display = 'block';

    const backdrop = this.root.querySelector('[data-backdrop]') as HTMLElement;
    backdrop.addEventListener('click', () => this.close());
    this.root.querySelector('[data-close]')?.addEventListener('click', () => this.close());

    // 첫 내부 요소로 포커스 이동 (접근성)
    requestAnimationFrame(() => {
      (this.root.querySelector('.close-btn') as HTMLElement | null)?.focus();
    });
  }
}

if (!customElements.get('ui-drawer')) {
  customElements.define('ui-drawer', UIDrawer);
}
