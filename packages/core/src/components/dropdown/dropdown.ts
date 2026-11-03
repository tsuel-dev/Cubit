import { UIElement } from '../../base/ui-element';

export class UIDropdown extends UIElement {
  static get observedAttributes(): string[] {
    return ['open', 'placement', 'disabled'];
  }

  private _isOpen = false;
  private handleDocClickBound: (e: MouseEvent) => void;

  constructor() {
    super();
    this.handleDocClickBound = this.handleDocClick.bind(this);
  }

  get open(): boolean {
    return this._isOpen;
  }

  set open(val: boolean) {
    this._isOpen = val;
    this.setBooleanAttr('open', val);
    this.render();
  }

  get placement(): string {
    return this.getAttribute('placement') || 'bottom-start';
  }

  get disabled(): boolean {
    return this.getBooleanAttr('disabled');
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._isOpen = this.hasAttribute('open');
    document.addEventListener('click', this.handleDocClickBound);
    this.listen('keydown', this.handleKeyDown.bind(this));
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleDocClickBound);
  }

  private handleDocClick(e: MouseEvent): void {
    if (!this.contains(e.target as Node) && !this.root.contains(e.target as Node)) {
      if (this._isOpen) this.close();
    }
  }

  private items(): HTMLElement[] {
    return Array.from(this.querySelectorAll<HTMLElement>('ui-dropdown-item')).filter(
      (item) => !item.hasAttribute('disabled') && item.getAttribute('aria-disabled') !== 'true',
    );
  }

  private triggerElement(): HTMLElement | null {
    const slot = this.root.querySelector<HTMLSlotElement>('slot[name="trigger"]');
    return (slot?.assignedElements({ flatten: true })[0] as HTMLElement | undefined) ?? null;
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (this.disabled) return;
    const items = this.items();
    const active = items.findIndex((item) => item === document.activeElement || item.contains(document.activeElement));
    switch (e.key) {
      case 'Escape':
        if (this._isOpen) {
          e.preventDefault();
          this.close();
          this.triggerElement()?.focus(); // 닫으면 트리거로 포커스 복귀
        }
        return;
      case 'ArrowDown':
      case 'ArrowUp': {
        e.preventDefault();
        if (!this._isOpen) this.openDropdown();
        const next = active < 0
          ? (e.key === 'ArrowDown' ? 0 : items.length - 1)
          : (active + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items[next]?.focus();
        return;
      }
      case 'Home':
      case 'End':
        if (!this._isOpen) return;
        e.preventDefault();
        items[e.key === 'Home' ? 0 : items.length - 1]?.focus();
        return;
      case 'Enter':
      case ' ':
        // 항목에 포커스가 있을 때만 활성화(트리거 버튼의 기본 동작은 그대로 둔다)
        if (this._isOpen && active >= 0) {
          e.preventDefault();
          items[active]?.click();
        }
        return;
      case 'Tab':
        if (this._isOpen) this.close();
        return;
    }
  }

  /** 트리거에 메뉴 상태를 알린다(보조기기용). */
  private syncTriggerAria(): void {
    const trigger = this.triggerElement();
    if (!trigger) return;
    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', String(this._isOpen));
  }

  public toggle(): void {
    if (this.disabled) return;
    if (this._isOpen) this.close();
    else this.openDropdown();
  }

  public openDropdown(): void {
    if (this.disabled || this._isOpen) return;
    this.open = true;
    this.emit('open');
  }

  public close(): void {
    if (!this._isOpen) return;
    this.open = false;
    this.emit('close');
  }

  protected render(): void {
    const isOpen = this._isOpen;
    const placement = this.placement;

    this.paint(`
      <style>
        :host {
          display: inline-block;
          position: relative;
          font-family: var(--ui-font-family-base, sans-serif);
        }
        .popover {
          position: absolute;
          z-index: 1000;
          background-color: var(--ui-color-bg-surface, #ffffff);
          color: var(--ui-color-text-primary, #000000);
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-border-strong, #000000);
          border-radius: var(--ui-radius-sm, 1px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          display: ${isOpen ? 'block' : 'none'};
          min-width: 160px;
          box-sizing: border-box;
          padding: var(--ui-space-1, 4px) 0;
        }

        /* Placements */
        .popover.bottom-start { top: calc(100% + 4px); left: 0; }
        .popover.bottom-end { top: calc(100% + 4px); right: 0; }
        .popover.top-start { bottom: calc(100% + 4px); left: 0; }
        .popover.top-end { bottom: calc(100% + 4px); right: 0; }

        ::slotted(ui-dropdown-item) {
          display: block;
          padding: var(--ui-space-2, 8px) var(--ui-space-4, 16px);
          font-size: var(--ui-font-size-sm, 14px);
          cursor: pointer;
          user-select: none;
          color: var(--ui-color-text-primary, #000000);
          transition: background-color var(--ui-transition-fast);
        }
        ::slotted(ui-dropdown-item:hover) {
          background-color: var(--ui-color-bg-secondary, #ffebcc);
        }
      </style>
      <div id="trigger-wrapper">
        <slot name="trigger"></slot>
      </div>
      <div class="popover ${placement}" role="menu" aria-hidden="${!isOpen}">
        <slot></slot>
      </div>
    `);

    this.syncTriggerAria();
    const triggerWrapper = this.root.querySelector('#trigger-wrapper');
    if (triggerWrapper) {
      const triggerEl = triggerWrapper as HTMLElement;
      triggerEl.addEventListener('click', (e: MouseEvent) => {
        e.stopPropagation();
        this.toggle();
      });
    }
  }
}

export class UIDropdownItem extends HTMLElement {
  connectedCallback(): void {
    this.setAttribute('role', 'menuitem');
    this.setAttribute('tabindex', '0');
  }
}

if (!customElements.get('ui-dropdown')) {
  customElements.define('ui-dropdown', UIDropdown);
}
if (!customElements.get('ui-dropdown-item')) {
  customElements.define('ui-dropdown-item', UIDropdownItem);
}
