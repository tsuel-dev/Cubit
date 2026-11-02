import { UIElement } from '../../base/ui-element';

export class UISelect extends UIElement {
  static get observedAttributes(): string[] {
    return ['value', 'placeholder', 'disabled', 'size', 'open', 'aria-label'];
  }

  private _isOpen = false;
  private _selectedValue = '';
  private _selectedLabel = '';
  private handleDocumentClickBound: (e: MouseEvent) => void;

  constructor() {
    super();
    this.handleDocumentClickBound = this.handleDocumentClick.bind(this);
  }

  get value(): string {
    return this._selectedValue || this.getAttribute('value') || '';
  }

  set value(val: string) {
    this._selectedValue = val;
    this.setAttribute('value', val);
    this.updateSelectedLabel();
    this.render();
  }

  get disabled(): boolean {
    return this.getBooleanAttr('disabled');
  }

  set disabled(val: boolean) {
    this.setBooleanAttr('disabled', val);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._selectedValue = this.getAttribute('value') || '';
    this.updateSelectedLabel();
    document.addEventListener('click', this.handleDocumentClickBound);
    this.listen('keydown', this.handleKeyDown.bind(this));
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleDocumentClickBound);
  }

  private handleDocumentClick(e: MouseEvent): void {
    if (!this.contains(e.target as Node) && !this.root.contains(e.target as Node)) {
      this.close();
    }
  }

  private activeIndex = -1;
  private typeahead = '';
  private typeaheadTimer: ReturnType<typeof setTimeout> | null = null;

  private options(): HTMLElement[] {
    return Array.from(this.querySelectorAll<HTMLElement>('ui-option')).filter((o) => !o.hasAttribute('disabled'));
  }

  /** 활성(키보드 하이라이트) 옵션을 표시한다. 옵션은 light DOM 이라 aria-activedescendant 대신 data-active 를 쓴다. */
  private setActive(index: number): void {
    const options = this.options();
    options.forEach((opt, i) => {
      if (i === index) opt.setAttribute('data-active', '');
      else opt.removeAttribute('data-active');
    });
    this.activeIndex = index;
    options[index]?.scrollIntoView?.({ block: 'nearest' });
  }

  private commit(option: HTMLElement): void {
    const val = option.getAttribute('value') || '';
    this.value = val;
    this.close();
    this.emit('change', { value: val });
    this.root.querySelector<HTMLElement>('.trigger')?.focus();
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (this.disabled) return;
    const options = this.options();
    const selected = options.findIndex((o) => o.getAttribute('value') === this._selectedValue);

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        e.preventDefault();
        if (!this._isOpen) {
          this.open();
          this.setActive(selected >= 0 ? selected : e.key === 'ArrowDown' ? 0 : options.length - 1);
          return;
        }
        if (options.length === 0) return;
        const from = this.activeIndex < 0 ? selected : this.activeIndex;
        const step = e.key === 'ArrowDown' ? 1 : -1;
        this.setActive(from < 0 ? (step > 0 ? 0 : options.length - 1) : (from + step + options.length) % options.length);
        return;
      }
      case 'Home':
      case 'End':
        if (!this._isOpen) return;
        e.preventDefault();
        this.setActive(e.key === 'Home' ? 0 : options.length - 1);
        return;
      case ' ':
      case 'Enter': {
        e.preventDefault();
        if (this._isOpen && this.activeIndex >= 0 && options[this.activeIndex]) this.commit(options[this.activeIndex] as HTMLElement);
        else this.toggle();
        return;
      }
      case 'Escape':
        if (this._isOpen) {
          e.preventDefault();
          this.close();
        }
        return;
      case 'Tab':
        if (this._isOpen) this.close(); // 포커스가 떠나면 목록을 닫는다
        return;
      default: {
        // 타입어헤드: 입력한 글자로 시작하는 옵션으로 이동
        if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
        this.typeahead += e.key.toLowerCase();
        if (this.typeaheadTimer) clearTimeout(this.typeaheadTimer);
        this.typeaheadTimer = setTimeout(() => (this.typeahead = ''), 600);
        const hit = options.findIndex((o) => (o.textContent || '').trim().toLowerCase().startsWith(this.typeahead));
        if (hit < 0) return;
        if (!this._isOpen) this.open();
        this.setActive(hit);
      }
    }
  }

  public toggle(): void {
    if (this.disabled) return;
    if (this._isOpen) this.close();
    else this.open();
  }

  public open(): void {
    if (this.disabled || this._isOpen) return;
    this._isOpen = true;
    this.render();
    const options = this.options();
    this.setActive(options.findIndex((o) => o.getAttribute('value') === this._selectedValue));
    this.emit('open');
  }

  public close(): void {
    if (!this._isOpen) return;
    this._isOpen = false;
    this.render();
    this.emit('close');
  }

  private updateSelectedLabel(): void {
    const options = Array.from(this.querySelectorAll('ui-option'));
    const matched = options.find((opt) => opt.getAttribute('value') === this._selectedValue);
    if (matched) {
      this._selectedLabel = matched.textContent || '';
    } else {
      this._selectedLabel = '';
    }
  }

  protected render(): void {
    const disabled = this.disabled;
    const placeholder = this.getAttribute('placeholder') || '선택하세요';
    const displayLabel = this._selectedLabel || placeholder;
    const isOpen = this._isOpen;
    const size = this.getAttribute('size') || 'md';

    // 전체 재렌더가 트리거를 교체하므로, 포커스가 있었다면 새 트리거로 되돌린다(키보드 조작 유지).
    const hadFocus = Boolean(this.root.activeElement?.classList.contains('trigger'));

    this.root.innerHTML = `
      <style>
        :host {
          display: inline-block;
          position: relative;
          font-family: var(--ui-font-family-base, sans-serif);
          font-size: var(--ui-font-size-sm, 14px);
          user-select: none;
          min-width: 160px;
        }
        .trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--ui-space-3, 12px);
          background-color: var(--ui-color-bg-surface, #ffffff);
          color: ${this._selectedLabel ? 'var(--ui-color-text-primary, #000000)' : 'var(--ui-color-text-muted, #9e9e9e)'};
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #e0e0e0);
          border-radius: var(--ui-radius-sm, 1px);
          cursor: pointer;
          outline: none;
          transition: border-color var(--ui-transition-fast), box-shadow var(--ui-transition-fast);
        }
        .trigger.sm { height: 28px; font-size: var(--ui-font-size-xs, 12px); }
        .trigger.md { height: 36px; font-size: var(--ui-font-size-sm, 14px); }
        .trigger.lg { height: 44px; font-size: var(--ui-font-size-md, 16px); }

        .trigger:hover:not(.disabled) {
          border-color: var(--ui-color-border-strong, #000000);
        }
        .trigger:focus-visible, .trigger.open {
          border-color: var(--ui-color-primary, #ff5500);
          box-shadow: 0 0 0 1px var(--ui-color-primary, #ff5500);
        }
        .trigger.disabled {
          background-color: var(--ui-color-bg-muted, #f5f5f5);
          opacity: 0.6;
          cursor: not-allowed;
        }
        .arrow {
          width: 12px;
          height: 12px;
          fill: var(--ui-color-text-primary, #000000);
          transition: transform var(--ui-transition-fast);
        }
        .trigger.open .arrow {
          transform: rotate(180deg);
        }
        .menu {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background-color: var(--ui-color-bg-surface, #ffffff);
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-border-strong, #000000);
          border-radius: var(--ui-radius-sm, 1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          z-index: 1000;
          display: ${isOpen ? 'block' : 'none'};
          max-height: 200px;
          overflow-y: auto;
        }
        ::slotted(ui-option) {
          display: block;
          padding: var(--ui-space-2, 8px) var(--ui-space-3, 12px);
          cursor: pointer;
          color: var(--ui-color-text-primary, #000000);
        }
        ::slotted(ui-option[data-active]) {
          background-color: var(--ui-color-bg-secondary, #ffebcc);
          outline: 2px solid var(--ui-color-primary, #ff5500);
          outline-offset: -2px;
        }
        ::slotted(ui-option[aria-selected="true"]) {
          font-weight: var(--ui-font-weight-bold, 700);
        }
        ::slotted(ui-option:hover) {
          background-color: var(--ui-color-bg-secondary, #ffebcc);
        }
      </style>
      <div
        class="trigger ${size} ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}"
        tabindex="${disabled ? '-1' : '0'}"
        role="combobox"
        aria-expanded="${isOpen}"
        aria-haspopup="listbox"
        aria-disabled="${disabled}"
      >
        <span>${this.escapeHtml(displayLabel)}</span>
        <svg class="arrow" viewBox="0 0 16 16">
          <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="square" />
        </svg>
      </div>
      <div class="menu" role="listbox">
        <slot></slot>
      </div>
    `;

    if (hadFocus) this.root.querySelector<HTMLElement>('.trigger')?.focus();
    this.querySelectorAll('ui-option').forEach((opt) => {
      opt.setAttribute('aria-selected', String(opt.getAttribute('value') === this._selectedValue));
    });
    const trigger = this.root.querySelector('.trigger');
    if (trigger) {
      trigger.addEventListener('click', () => this.toggle());
    }

    const slot = this.root.querySelector('slot');
    if (slot) {
      slot.addEventListener('click', (e) => {
        const option = this.composedTarget(e).closest('ui-option');
        if (option && !option.hasAttribute('disabled')) this.commit(option as HTMLElement);
      });
    }
  }
}

export class UIOption extends HTMLElement {
  connectedCallback(): void {
    this.setAttribute('role', 'option');
  }
}

if (!customElements.get('ui-select')) {
  customElements.define('ui-select', UISelect);
}
if (!customElements.get('ui-option')) {
  customElements.define('ui-option', UIOption);
}
