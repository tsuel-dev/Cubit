import { UIElement } from '../../base/ui-element';

/**
 * ui-textarea — 여러 줄 입력. ui-input 과 같은 value/disabled/invalid 계약을 따르며
 * <form> 에 참여한다(name 속성으로 제출, reset·fieldset disabled 지원).
 */
export class UITextarea extends UIElement {
  static override formAssociated = true;
  private defaultValue = '';

  static get observedAttributes(): string[] {
    return [
      'value', 'placeholder', 'rows', 'maxlength', 'resize', 'size',
      'disabled', 'readonly', 'invalid', 'aria-label',
    ];
  }

  get value(): string {
    const ta = this.root.querySelector('textarea');
    return ta ? ta.value : this.getAttribute('value') || '';
  }

  set value(val: string) {
    this.setAttribute('value', val);
    const ta = this.root.querySelector('textarea');
    if (ta) ta.value = val;
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

  override connectedCallback(): void {
    this.defaultValue = this.getAttribute('value') || '';
    super.connectedCallback();
  }

  /** <form>.reset() 시 초기값으로 복원 */
  formResetCallback(): void {
    this.value = this.defaultValue;
  }

  /** value 속성 변경은 내부 textarea 를 제자리 갱신해 포커스·캐럿을 보존한다. */
  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (name === 'value' && oldValue !== newValue) {
      this.setFormValue(newValue ?? '');
      const ta = this.root.querySelector('textarea');
      if (ta) {
        if (ta.value !== newValue) {
          const start = ta.selectionStart;
          const end = ta.selectionEnd;
          ta.value = newValue ?? '';
          if (newValue !== null && start <= newValue.length) {
            try { ta.setSelectionRange(start, Math.min(end, newValue.length)); } catch { /* noop */ }
          }
        }
        this.updateCounter();
        return;
      }
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  private updateCounter(): void {
    const counter = this.root.querySelector('.counter');
    const ta = this.root.querySelector('textarea');
    const max = this.getAttribute('maxlength');
    if (counter && ta && max) counter.textContent = `${ta.value.length} / ${max}`;
  }

  protected render(): void {
    const size = ['sm', 'md', 'lg'].includes(this.getAttribute('size') || '') ? (this.getAttribute('size') as string) : 'md';
    const resize = ['none', 'vertical', 'both'].includes(this.getAttribute('resize') || '') ? (this.getAttribute('resize') as string) : 'vertical';
    const rows = Math.max(1, parseInt(this.getAttribute('rows') || '3', 10) || 3);
    const maxlength = parseInt(this.getAttribute('maxlength') || '', 10);
    const hasMax = Number.isFinite(maxlength) && maxlength > 0;
    const disabled = this.disabled;
    const readonly = this.hasAttribute('readonly');
    const invalid = this.invalid;
    const ariaLabel = this.getAttribute('aria-label') || '';
    const placeholder = this.getAttribute('placeholder') || '';
    const currentVal = this.getAttribute('value') || '';
    this.setFormValue(currentVal);

    this.root.innerHTML = `
      <style>
        :host { display: block; font-family: var(--ui-font-family-base, sans-serif); }
        .wrapper {
          position: relative;
          box-sizing: border-box;
          background-color: var(--ui-color-bg-surface, #ffffff);
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #e0e0e0);
          border-radius: var(--ui-radius-sm, 8px);
          transition: border-color var(--ui-transition-fast), box-shadow var(--ui-transition-fast);
        }
        .wrapper:hover:not(.disabled) { border-color: var(--ui-color-border-strong, #000000); }
        .wrapper.focused {
          border-color: var(--ui-color-primary, #ff5500);
          box-shadow: 0 0 0 1px var(--ui-color-primary, #ff5500);
        }
        .wrapper.invalid { border-color: var(--ui-color-error, #d32f2f); }
        .wrapper.invalid.focused { box-shadow: 0 0 0 1px var(--ui-color-error, #d32f2f); }
        .wrapper.disabled {
          background-color: var(--ui-color-bg-muted, #f5f5f5);
          opacity: 0.6;
          cursor: not-allowed;
        }
        textarea {
          all: unset;
          display: block;
          width: 100%;
          box-sizing: border-box;
          white-space: pre-wrap;
          overflow: auto;
          color: var(--ui-color-text-primary, #000000);
          font-family: inherit;
          line-height: var(--ui-line-height-normal, 1.5);
          resize: ${resize};
        }
        textarea::placeholder { color: var(--ui-color-text-muted, #9e9e9e); }
        textarea:disabled { cursor: not-allowed; }
        .sm textarea { padding: var(--ui-space-1, 4px) var(--ui-space-2, 8px); font-size: var(--ui-font-size-xs, 12px); }
        .md textarea { padding: var(--ui-space-2, 8px) var(--ui-space-3, 12px); font-size: var(--ui-font-size-sm, 14px); }
        .lg textarea { padding: var(--ui-space-3, 12px) var(--ui-space-4, 16px); font-size: var(--ui-font-size-md, 16px); }
        .counter {
          text-align: right;
          padding: 0 var(--ui-space-3, 12px) var(--ui-space-1, 4px);
          font-size: var(--ui-font-size-xs, 12px);
          color: var(--ui-color-text-muted, #9e9e9e);
        }
      </style>
      <div class="wrapper ${size} ${disabled ? 'disabled' : ''} ${invalid ? 'invalid' : ''}">
        <textarea
          rows="${rows}"
          placeholder="${this.escapeHtml(placeholder)}"
          ${hasMax ? `maxlength="${maxlength}"` : ''}
          ${disabled ? 'disabled' : ''}
          ${readonly ? 'readonly' : ''}
          aria-invalid="${invalid ? 'true' : 'false'}"
          ${ariaLabel ? `aria-label="${this.escapeHtml(ariaLabel)}"` : ''}
        >
${this.escapeHtml(currentVal)}</textarea>
        ${hasMax ? `<div class="counter" aria-hidden="true">${currentVal.length} / ${maxlength}</div>` : ''}
      </div>
    `;

    const ta = this.root.querySelector('textarea');
    const wrapper = this.root.querySelector('.wrapper');
    if (ta && wrapper) {
      ta.onfocus = () => wrapper.classList.add('focused');
      ta.onblur = () => wrapper.classList.remove('focused');
      ta.oninput = () => {
        this.setAttribute('value', ta.value);
        this.emit('input', { value: ta.value });
      };
      ta.onchange = () => {
        this.setAttribute('value', ta.value);
        this.emit('change', { value: ta.value });
      };
    }
  }
}

if (!customElements.get('ui-textarea')) {
  customElements.define('ui-textarea', UITextarea);
}
