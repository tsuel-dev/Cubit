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

  private handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && this._isOpen) {
      e.preventDefault();
      this.close();
    }
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

    this.root.innerHTML = `
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
    `;

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
