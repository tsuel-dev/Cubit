import { UIElement } from '../../base/ui-element';

/**
 * ui-chip — 라벨/태그. removable 이면 × 버튼과 Delete/Backspace 로 `remove` 이벤트를 발화한다.
 * 칩 자체는 DOM 에서 지우지 않는다(프레임워크가 목록을 소유하므로 앱이 상태를 갱신해야 함).
 *
 * <ui-chip variant="primary" removable>작업</ui-chip>
 */
export class UIChip extends UIElement {
  static get observedAttributes(): string[] {
    return ['variant', 'size', 'removable', 'disabled', 'remove-label'];
  }

  get removable(): boolean {
    return this.getBooleanAttr('removable');
  }

  set removable(val: boolean) {
    this.setBooleanAttr('removable', val);
  }

  get disabled(): boolean {
    return this.getBooleanAttr('disabled');
  }

  set disabled(val: boolean) {
    this.setBooleanAttr('disabled', val);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.listen('keydown', this.handleKeyDown.bind(this));
  }

  private requestRemove(): void {
    if (this.disabled || !this.removable) return;
    this.emit('remove');
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (this.disabled || !this.removable) return;
      e.preventDefault();
      this.requestRemove();
    }
  }

  protected render(): void {
    const variant = ['neutral', 'primary', 'success', 'warning', 'error'].includes(this.getAttribute('variant') || '')
      ? (this.getAttribute('variant') as string)
      : 'neutral';
    const size = this.getAttribute('size') === 'sm' ? 'sm' : 'md';
    const removable = this.removable;
    const disabled = this.disabled;
    const removeLabel = this.getAttribute('remove-label') || 'Remove';

    // 삭제 가능한 칩은 키보드로 도달 가능해야 한다.
    if (removable && !disabled) this.setAttribute('tabindex', '0');
    else this.removeAttribute('tabindex');
    this.setAttribute('aria-disabled', String(disabled));

    this.root.innerHTML = `
      <style>
        :host { display: inline-flex; font-family: var(--ui-font-family-base, sans-serif); outline: none; }
        :host(:focus-visible) .chip { box-shadow: 0 0 0 2px var(--ui-color-bg-canvas, #ffffff), 0 0 0 4px var(--ui-color-focus-ring, #ff5500); }
        .chip {
          display: inline-flex;
          align-items: center;
          gap: var(--ui-space-1, 4px);
          box-sizing: border-box;
          max-width: 100%;
          border-radius: var(--ui-radius-full, 9999px);
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #e0e0e0);
          background-color: var(--ui-color-bg-muted, #f5f5f5);
          color: var(--ui-color-text-primary, #000000);
          font-weight: var(--ui-font-weight-medium, 500);
          line-height: var(--ui-line-height-none, 1);
          user-select: none;
        }
        .chip.md { padding: 5px 10px; font-size: var(--ui-font-size-sm, 14px); }
        .chip.sm { padding: 3px 8px; font-size: var(--ui-font-size-xs, 12px); }
        .chip.primary { background-color: var(--ui-color-primary-subtle, #fff3e6); border-color: var(--ui-color-primary, #ff5500); color: var(--ui-color-primary-active, #cc4400); }
        .chip.success { background-color: var(--ui-color-success-bg, #e8f5e9); border-color: var(--ui-color-success, #1b873f); color: var(--ui-color-success, #1b873f); }
        .chip.warning { background-color: var(--ui-color-warning-bg, #fffbeb); border-color: var(--ui-color-warning, #d97706); color: var(--ui-color-warning, #d97706); }
        .chip.error { background-color: var(--ui-color-error-bg, #fde8e8); border-color: var(--ui-color-error, #d32f2f); color: var(--ui-color-error, #d32f2f); }
        .chip.disabled { opacity: 0.5; cursor: not-allowed; }
        .label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        button {
          all: unset;
          display: inline-flex; align-items: center; justify-content: center;
          width: 16px; height: 16px;
          margin-right: -4px;
          border-radius: var(--ui-radius-full, 9999px);
          cursor: pointer;
          color: inherit;
        }
        button:hover { background-color: rgba(0, 0, 0, 0.12); }
        button:focus-visible { box-shadow: 0 0 0 2px var(--ui-color-focus-ring, #ff5500); }
        button[disabled] { cursor: not-allowed; }
        svg { width: 10px; height: 10px; pointer-events: none; }
      </style>
      <span class="chip ${variant} ${size} ${disabled ? 'disabled' : ''}">
        <span class="label"><slot></slot></span>
        ${
          removable
            ? `<button type="button" tabindex="-1" aria-label="${this.escapeHtml(removeLabel)}" ${disabled ? 'disabled' : ''}>
                 <svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 2l6 6M8 2L2 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/></svg>
               </button>`
            : ''
        }
      </span>
    `;

    this.root.querySelector('button')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.requestRemove();
    });
  }
}

if (!customElements.get('ui-chip')) {
  customElements.define('ui-chip', UIChip);
}
