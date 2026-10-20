import { UIElement } from '../../base/ui-element';

export class UICheckbox extends UIElement {
  static override formAssociated = true;
  private defaultChecked = false;

  static get observedAttributes(): string[] {
    return ['checked', 'disabled', 'indeterminate', 'name', 'value', 'aria-label'];
  }

  get checked(): boolean {
    return this.getBooleanAttr('checked');
  }

  set checked(val: boolean) {
    this.setBooleanAttr('checked', val);
  }

  get indeterminate(): boolean {
    return this.getBooleanAttr('indeterminate');
  }

  set indeterminate(val: boolean) {
    this.setBooleanAttr('indeterminate', val);
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
    this.setAttribute('tabindex', this.disabled ? '-1' : '0');
    this.setAttribute('role', 'checkbox');
    this.listen('keydown', this.handleKeyDown.bind(this));
    this.listen('click', this.handleClick.bind(this));
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (this.disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this.toggle();
    }
  }

  private handleClick(e: MouseEvent): void {
    if (this.disabled) {
      e.preventDefault();
      return;
    }
    this.toggle();
  }

  /** <form>.reset() 시 초기 상태로 복원 */
  formResetCallback(): void {
    this.checked = this.defaultChecked;
  }

  public toggle(): void {
    if (this.disabled) return;
    this.checked = !this.checked;
    if (this.indeterminate) {
      this.indeterminate = false;
    }
    this.setAttribute('aria-checked', String(this.checked));
    this.emit('change', { checked: this.checked });
  }

  protected render(): void {
    const checked = this.checked;
    const indeterminate = this.indeterminate;
    const disabled = this.disabled;

    this.setFormValue(checked ? (this.getAttribute('value') ?? 'on') : null);
    this.setAttribute('aria-checked', indeterminate ? 'mixed' : String(checked));
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
        .box {
          width: 16px;
          height: 16px;
          box-sizing: border-box;
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-border-strong, #000000);
          border-radius: var(--ui-radius-sm, 1px);
          background-color: var(--ui-color-bg-surface, #ffffff);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background-color var(--ui-transition-fast), border-color var(--ui-transition-fast);
        }
        :host(:focus-visible) .box {
          box-shadow: 0 0 0 2px var(--ui-color-bg-canvas, #ffffff), 0 0 0 4px var(--ui-color-focus-ring, #ff5500);
        }
        .box.checked, .box.indeterminate {
          background-color: var(--ui-color-primary, #ff5500);
          border-color: var(--ui-color-primary, #ff5500);
        }
        .icon {
          display: none;
          fill: var(--ui-color-primary-contrast, #ffffff);
          width: 12px;
          height: 12px;
        }
        .checked .icon-check {
          display: block;
        }
        .indeterminate .icon-minus {
          display: block;
        }
        .label {
          line-height: var(--ui-line-height-normal, 1.5);
        }
      </style>
      <div class="box ${checked ? 'checked' : ''} ${indeterminate ? 'indeterminate' : ''}">
        <svg class="icon icon-check" viewBox="0 0 16 16">
          <path d="M13.5 3.5L6.5 11.5L2.5 7.5" stroke="white" stroke-width="2" stroke-linecap="square" fill="none" />
        </svg>
        <svg class="icon icon-minus" viewBox="0 0 16 16">
          <rect x="2" y="7" width="12" height="2" fill="white" />
        </svg>
      </div>
      <span class="label"><slot></slot></span>
    `;
  }
}

if (!customElements.get('ui-checkbox')) {
  customElements.define('ui-checkbox', UICheckbox);
}
