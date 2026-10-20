import { UIElement } from '../../base/ui-element';

export class UIInput extends UIElement {
  static override formAssociated = true;
  private defaultValue = '';

  static get observedAttributes(): string[] {
    return ['value', 'placeholder', 'type', 'disabled', 'readonly', 'size', 'invalid', 'aria-label'];
  }

  get value(): string {
    const input = this.root.querySelector('input');
    return input ? input.value : this.getAttribute('value') || '';
  }

  set value(val: string) {
    this.setAttribute('value', val);
    const input = this.root.querySelector('input');
    if (input) input.value = val;
  }

  get disabled(): boolean {
    return this.getBooleanAttr('disabled') || this.formDisabled;
  }

  set disabled(val: boolean) {
    this.setBooleanAttr('disabled', val);
  }

  get invalid(): boolean {
    return this.getBooleanAttr('invalid');
  }

  set invalid(val: boolean) {
    this.setBooleanAttr('invalid', val);
  }

  /**
   * value 속성 변경은 내부 input 값을 제자리 갱신한다.
   * 전체 재렌더를 하면 input 요소가 교체되어 포커스·캐릿이 사라진다.
   */
  override attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    if (name === 'value' && oldValue !== newValue) {
      this.setFormValue(newValue ?? '');
      const input = this.root.querySelector('input');
      if (input) {
        if (input.value !== newValue) {
          const start = input.selectionStart ?? null;
          const end = input.selectionEnd ?? null;
          input.value = newValue ?? '';
          // 외부 갱신이어도 캐릿 위치 보존 (선택이 유지될 때만)
          if (start !== null && end !== null && newValue !== null && start <= newValue.length) {
            try { input.setSelectionRange(start, end); } catch { /* type=number 등 */ }
          }
        }
        return;
      }
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  override connectedCallback(): void {
    this.defaultValue = this.getAttribute('value') || '';
    super.connectedCallback();
  }

  /** <form>.reset() 시 초기값으로 복원 */
  formResetCallback(): void {
    this.value = this.defaultValue;
  }

  protected render(): void {
    const type = this.getAttribute('type') || 'text';
    const placeholder = this.getAttribute('placeholder') || '';
    const size = this.getAttribute('size') || 'md';
    const disabled = this.disabled;
    const readonly = this.hasAttribute('readonly');
    const invalid = this.invalid;
    const ariaLabel = this.getAttribute('aria-label') || '';
    const currentVal = this.getAttribute('value') || '';
    this.setFormValue(currentVal);

    this.root.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--ui-font-family-base, sans-serif);
        }
        .wrapper {
          display: flex;
          align-items: center;
          position: relative;
          box-sizing: border-box;
          background-color: var(--ui-color-bg-surface, #ffffff);
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #e0e0e0);
          border-radius: var(--ui-radius-sm, 1px);
          transition: border-color var(--ui-transition-fast), box-shadow var(--ui-transition-fast);
        }
        .wrapper:hover:not(.disabled) {
          border-color: var(--ui-color-border-strong, #000000);
        }
        .wrapper.focused {
          border-color: var(--ui-color-primary, #ff5500);
          box-shadow: 0 0 0 1px var(--ui-color-primary, #ff5500);
        }
        .wrapper.invalid {
          border-color: var(--ui-color-error, #d32f2f);
        }
        .wrapper.invalid.focused {
          box-shadow: 0 0 0 1px var(--ui-color-error, #d32f2f);
        }
        .wrapper.disabled {
          background-color: var(--ui-color-bg-muted, #f5f5f5);
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Sizes */
        .wrapper.sm {
          height: 28px;
          padding: 0 var(--ui-space-2, 8px);
          font-size: var(--ui-font-size-xs, 12px);
        }
        .wrapper.md {
          height: 36px;
          padding: 0 var(--ui-space-3, 12px);
          font-size: var(--ui-font-size-sm, 14px);
        }
        .wrapper.lg {
          height: 44px;
          padding: 0 var(--ui-space-4, 16px);
          font-size: var(--ui-font-size-md, 16px);
        }

        input {
          all: unset;
          width: 100%;
          height: 100%;
          color: var(--ui-color-text-primary, #000000);
          font-family: inherit;
          font-size: inherit;
          box-sizing: border-box;
        }
        input::placeholder {
          color: var(--ui-color-text-muted, #9e9e9e);
        }
        input:disabled {
          cursor: not-allowed;
        }
      </style>
      <div class="wrapper ${this.escapeHtml(size)} ${disabled ? 'disabled' : ''} ${invalid ? 'invalid' : ''}">
        <input
          type="${this.escapeHtml(type)}"
          placeholder="${this.escapeHtml(placeholder)}"
          value="${this.escapeHtml(currentVal)}"
          ${disabled ? 'disabled' : ''}
          ${readonly ? 'readonly' : ''}
          ${disabled ? 'aria-disabled="true"' : ''}
          ${invalid ? 'aria-invalid="true"' : 'aria-invalid="false"'}
          ${ariaLabel ? `aria-label="${this.escapeHtml(ariaLabel)}"` : ''}
        />
      </div>
    `;

    const input = this.root.querySelector('input');
    const wrapper = this.root.querySelector('.wrapper');

    if (input && wrapper) {
      input.onfocus = () => wrapper.classList.add('focused');
      input.onblur = () => wrapper.classList.remove('focused');
      input.oninput = (e) => {
        const val = (e.target as HTMLInputElement).value;
        this.setAttribute('value', val);
        this.emit('input', { value: val });
      };
      input.onchange = (e) => {
        const val = (e.target as HTMLInputElement).value;
        this.setAttribute('value', val);
        this.emit('change', { value: val });
      };
    }
  }
}

if (!customElements.get('ui-input')) {
  customElements.define('ui-input', UIInput);
}
