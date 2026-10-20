import { UIElement } from '../../base/ui-element';

/**
 * ui-empty-state — 빈 목록·검색 결과 없음·오류 안내.
 * <ui-empty-state heading="결과가 없습니다" description="다른 검색어로 다시 시도하세요">
 *   <svg slot="icon">…</svg>
 *   <ui-button>다시 검색</ui-button>      <!-- 기본 슬롯 = 다음 행동 -->
 * </ui-empty-state>
 */
export class UIEmptyState extends UIElement {
  static get observedAttributes(): string[] {
    return ['heading', 'description', 'size', 'variant'];
  }

  protected render(): void {
    const heading = this.getAttribute('heading') || '';
    const description = this.getAttribute('description') || '';
    const size = this.getAttribute('size') === 'sm' ? 'sm' : 'md';
    const variant = ['default', 'error'].includes(this.getAttribute('variant') || '') ? (this.getAttribute('variant') as string) : 'default';

    this.root.innerHTML = `
      <style>
        :host { display: block; font-family: var(--ui-font-family-base, sans-serif); }
        .box {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: var(--ui-space-2, 8px);
          box-sizing: border-box;
          padding: var(--ui-space-8, 32px) var(--ui-space-4, 16px);
          border: var(--ui-border-width-thin, 1px) dashed var(--ui-color-border, #e0e0e0);
          border-radius: var(--ui-radius-md, 12px);
          background-color: var(--ui-color-bg-subtle, #fafafa);
          color: var(--ui-color-text-secondary, #616161);
        }
        .box.sm { padding: var(--ui-space-4, 16px); gap: var(--ui-space-1, 4px); }
        .box.error { border-color: var(--ui-color-error, #d32f2f); background-color: var(--ui-color-error-bg, #fde8e8); }
        .icon { display: none; color: var(--ui-color-text-muted, #9e9e9e); font-size: 32px; line-height: 1; }
        .icon.has { display: block; }
        .heading {
          margin: 0;
          font-size: var(--ui-font-size-md, 16px);
          font-weight: var(--ui-font-weight-semibold, 600);
          color: var(--ui-color-text-primary, #000000);
        }
        .sm .heading { font-size: var(--ui-font-size-sm, 14px); }
        .desc { margin: 0; max-width: 42ch; font-size: var(--ui-font-size-sm, 14px); line-height: var(--ui-line-height-normal, 1.5); }
        .sm .desc { font-size: var(--ui-font-size-xs, 12px); }
        .actions { display: none; margin-top: var(--ui-space-2, 8px); gap: var(--ui-space-2, 8px); flex-wrap: wrap; justify-content: center; }
        .actions.has { display: flex; }
      </style>
      <div class="box ${size} ${variant}">
        <div class="icon" aria-hidden="true"><slot name="icon"></slot></div>
        ${heading ? `<h3 class="heading">${this.escapeHtml(heading)}</h3>` : ''}
        ${description ? `<p class="desc">${this.escapeHtml(description)}</p>` : ''}
        <div class="actions"><slot></slot></div>
      </div>
    `;

    // 슬롯에 내용이 있을 때만 영역을 보여준다(빈 점선 박스 안의 불필요한 여백 방지).
    const mark = (slotName: string | null, el: Element | null): void => {
      const slot = this.root.querySelector<HTMLSlotElement>(slotName ? `slot[name="${slotName}"]` : 'slot:not([name])');
      if (!slot || !el) return;
      const sync = (): void => {
        el.classList.toggle('has', slot.assignedNodes({ flatten: true }).some((n) => n.nodeType === 1 || (n.textContent || '').trim() !== ''));
      };
      slot.addEventListener('slotchange', sync);
      sync();
    };
    mark('icon', this.root.querySelector('.icon'));
    mark(null, this.root.querySelector('.actions'));
  }
}

if (!customElements.get('ui-empty-state')) {
  customElements.define('ui-empty-state', UIEmptyState);
}
