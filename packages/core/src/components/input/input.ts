import { UIElement } from '../../base/ui-element';

export class UIInput extends UIElement {
  static override formAssociated = true;
  private defaultValue = '';

  static get observedAttributes(): string[] {
    return [
      'value', 'placeholder', 'type', 'disabled', 'readonly', 'size', 'invalid', 'aria-label',
      'autocomplete', 'inputmode', 'enterkeyhint', 'maxlength', 'minlength', 'required', 'pattern', 'min', 'max', 'step',
    ];
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

  /** 내부 input 에 그대로 전달하는 선택 속성(없으면 제거). 폼 제출·비밀번호 관리자·모바일 키보드에 필요하다. */
  private static readonly PASSTHROUGH = [
    'autocomplete', 'inputmode', 'enterkeyhint', 'maxlength', 'minlength', 'pattern', 'min', 'max', 'step',
  ] as const;

  /**
   * 속성 변경을 내부 요소에 제자리 반영한다. 전체 재렌더는 input 을 교체해 포커스·IME 조합을 끊으므로 피한다.
   * 반영할 수 없으면(아직 렌더 전) false.
   */
  private syncInPlace(name: string): boolean {
    const input = this.root.querySelector('input');
    const wrapper = this.root.querySelector('.wrapper');
    if (!input || !wrapper) return false;
    switch (name) {
      case 'placeholder': input.placeholder = this.getAttribute('placeholder') || ''; break;
      case 'type': input.type = this.getAttribute('type') || 'text'; break;
      case 'readonly': input.readOnly = this.hasAttribute('readonly'); break;
      case 'required': input.required = this.hasAttribute('required'); break;
      case 'disabled':
        input.disabled = this.disabled;
        wrapper.classList.toggle('disabled', this.disabled);
        if (this.disabled) input.setAttribute('aria-disabled', 'true'); else input.removeAttribute('aria-disabled');
        break;
      case 'invalid':
        wrapper.classList.toggle('invalid', this.invalid);
        input.setAttribute('aria-invalid', this.invalid ? 'true' : 'false');
        break;
      case 'aria-label': {
        const label = this.getAttribute('aria-label');
        if (label) input.setAttribute('aria-label', label); else input.removeAttribute('aria-label');
        break;
      }
      case 'size': {
        const size = this.getAttribute('size') || 'md';
        wrapper.classList.remove('sm', 'md', 'lg');
        wrapper.classList.add(['sm', 'md', 'lg'].includes(size) ? size : 'md');
        break;
      }
      default: {
        if (!(UIInput.PASSTHROUGH as readonly string[]).includes(name)) return false;
        const value = this.getAttribute(name);
        if (value === null) input.removeAttribute(name); else input.setAttribute(name, value);
      }
    }
    this.updateValidity();
    return true;
  }

  /** 내부 input 의 제약 검증(required/pattern/maxlength 등) 결과를 폼 검증에 연결한다. */
  private updateValidity(): void {
    const input = this.root.querySelector('input');
    if (!this.internals || !input) return;
    if (input.validity.valid) {
      this.internals.setValidity({});
    } else {
      // ValidityState 는 열거 가능한 속성이 아니라 플래그를 직접 복사한다.
      const v = input.validity;
      this.internals.setValidity(
        {
          valueMissing: v.valueMissing, typeMismatch: v.typeMismatch, patternMismatch: v.patternMismatch,
          tooLong: v.tooLong, tooShort: v.tooShort, rangeUnderflow: v.rangeUnderflow, rangeOverflow: v.rangeOverflow,
          stepMismatch: v.stepMismatch, badInput: v.badInput,
        },
        input.validationMessage,
        input,
      );
    }
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
        this.updateValidity();
        return;
      }
    }
    if (oldValue !== newValue && name !== 'value' && this.syncInPlace(name)) return;
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
    const required = this.hasAttribute('required');
    const extra = UIInput.PASSTHROUGH
      .filter((name) => this.hasAttribute(name))
      .map((name) => `${name}="${this.escapeHtml(this.getAttribute(name))}"`)
      .join(' ');
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
          ${required ? 'required' : ''}
          ${extra}
          ${disabled ? 'aria-disabled="true"' : ''}
          ${invalid ? 'aria-invalid="true"' : 'aria-invalid="false"'}
          ${ariaLabel ? `aria-label="${this.escapeHtml(ariaLabel)}"` : ''}
        />
      </div>
    `;

    const input = this.root.querySelector('input');
    const wrapper = this.root.querySelector('.wrapper');

    this.updateValidity();
    if (input && wrapper) {
      input.onfocus = () => wrapper.classList.add('focused');
      input.onblur = () => wrapper.classList.remove('focused');
      input.oninput = (e) => {
        // 브라우저 기본 input 이벤트는 composed 라 shadow 밖으로 새어 나간다. 그러면 호스트에서 detail 없는 날 이벤트가
        // 한 번 더 도착해 래퍼(React/Svelte)가 {value} 대신 Event 를 받는다. 아래 emit 한 번만 내보낸다.
        e.stopPropagation();
        const val = (e.target as HTMLInputElement).value;
        this.setAttribute('value', val);
        this.updateValidity();
        this.emit('input', { value: val });
      };
      // Enter 암묵 제출: IME 조합 중이거나 이미 처리된 키는 제외한다.
      input.onkeydown = (e) => {
        if (e.key !== 'Enter' || e.isComposing || e.defaultPrevented || e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) return;
        if (this.disabled || this.hasAttribute('readonly')) return;
        this.requestFormSubmit();
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
