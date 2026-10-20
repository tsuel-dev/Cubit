import { UIElement } from '../../base/ui-element';

export class UISwitch extends UIElement {
  static override formAssociated = true;
  private defaultChecked = false;

  static get observedAttributes(): string[] {
    return ['checked', 'disabled', 'aria-label', 'value'];
  }

  get checked(): boolean {
    return this.getBooleanAttr('checked');
  }

  set checked(val: boolean) {
    this.setBooleanAttr('checked', val);
  }

  get disabled(): boolean {
    return this.getBooleanAttr('disabled') || this.formDisabled;
  }

  set disabled(val: boolean) {
    this.setBooleanAttr('disabled', val);
  }

  override connectedCallback(): void {
    this.defaultChecked = this.checked;
    super.connectedCallback();
    this.setAttribute('role', 'switch');
    this.setAttribute('tabindex', this.disabled ? '-1' : '0');
    this.listen('click', this.handleClick.bind(this));
    this.listen('keydown', this.handleKeyDown.bind(this));
  }

  private handleClick(e: MouseEvent): void {
    if (this.disabled) {
      e.preventDefault();
      return;
    }
    this.toggle();
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (this.disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this.toggle();
    }
  }

  /** <form>.reset() 시 초기 상태로 복원 */
  formResetCallback(): void {
    this.checked = this.defaultChecked;
  }

  public toggle(): void {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.setAttribute('aria-checked', String(this.checked));
    this.emit('change', { checked: this.checked });
  }

  protected render(): void {
    const checked = this.checked;
    const disabled = this.disabled;

    this.setFormValue(checked ? (this.getAttribute('value') ?? 'on') : null);
    this.setAttribute('aria-checked', String(checked));
    this.setAttribute('aria-disabled', String(disabled));
    this.setAttribute('tabindex', disabled ? '-1' : '0');

    this.root.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          align-items: center;
          gap: var(--ui-space-2, 8px);
          font-family: var(--ui-font-family-base, sans-serif);
          font-size: var(--ui-font-size-sm, 14px);
          color: var(--ui-color-text-primary, #000000);
          cursor: pointer;
          user-select: none;
          outline: none;
        }
        :host([disabled]) {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }
        .track {
          width: 36px;
          height: 20px;
          box-sizing: border-box;
          background-color: var(--ui-color-bg-muted, #f5f5f5);
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-border-strong, #000000);
          border-radius: var(--ui-radius-full, 9999px); /* Switch track pill */
          position: relative;
          transition: background-color var(--ui-transition-fast), border-color var(--ui-transition-fast);
        }
        :host(:focus-visible) .track {
          box-shadow: 0 0 0 2px var(--ui-color-bg-canvas, #ffffff), 0 0 0 4px var(--ui-color-focus-ring, #ff5500);
        }
        .track.checked {
          background-color: var(--ui-color-primary, #ff5500); /* 강조색상 */
          border-color: var(--ui-color-primary, #ff5500);
        }
        .thumb {
          width: 10px;
          height: 10px;
          position: absolute;
          top: 4px;
          left: 4px;
          background-color: var(--ui-color-border-strong, #000000);
          border-radius: var(--ui-radius-full, 9999px); /* 썸 pill */
          transition: transform var(--ui-transition-fast), background-color var(--ui-transition-fast), width var(--ui-transition-fast);
        }
        .track.checked .thumb {
          width: 12px;
          transform: translateX(14px);
          background-color: var(--ui-switch-thumb-on, #ffebcc); /* 보조색상1(베이지), 다크 모드에서도 동일 */
        }
        .label {
          line-height: var(--ui-line-height-normal, 1.5);
        }
      </style>
      <div class="track ${checked ? 'checked' : ''}">
        <div class="thumb"></div>
      </div>
      <span class="label"><slot></slot></span>
    `;
  }
}

if (!customElements.get('ui-switch')) {
  customElements.define('ui-switch', UISwitch);
}
