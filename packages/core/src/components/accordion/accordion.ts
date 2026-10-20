import { UIElement } from '../../base/ui-element';

export class UIAccordion extends UIElement {
  static get observedAttributes(): string[] {
    return ['multiple'];
  }

  get multiple(): boolean {
    return this.hasAttribute('multiple');
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.listen('toggle-item', this.handleItemToggle.bind(this) as EventListener);
  }

  private handleItemToggle(e: CustomEvent<{ item: UIAccordionItem; open: boolean }>): void {
    if (this.multiple) return;

    if (e.detail.open) {
      const items = Array.from(this.querySelectorAll('ui-accordion-item'));
      items.forEach((item) => {
        if (item !== e.detail.item && item instanceof UIAccordionItem) {
          item.open = false;
        }
      });
    }
  }

  protected render(): void {
    this.root.innerHTML = `
      <style>
        :host {
          display: block;
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #e0e0e0);
          border-radius: var(--ui-radius-sm, 1px);
          overflow: hidden;
          font-family: var(--ui-font-family-base, sans-serif);
        }
      </style>
      <slot></slot>
    `;
  }
}

export class UIAccordionItem extends UIElement {
  static get observedAttributes(): string[] {
    return ['open', 'title', 'disabled'];
  }

  get open(): boolean {
    return this.getBooleanAttr('open');
  }

  set open(val: boolean) {
    this.setBooleanAttr('open', val);
  }

  override get title(): string {
    return this.getAttribute('title') || '';
  }

  override set title(val: string) {
    this.setAttribute('title', val);
  }

  get disabled(): boolean {
    return this.getBooleanAttr('disabled');
  }

  public toggle(): void {
    if (this.disabled) return;
    this.open = !this.open;
    this.emit('toggle-item', { item: this, open: this.open });
    this.emit('change', { open: this.open });
  }

  protected render(): void {
    const isOpen = this.open;
    const isDisabled = this.disabled;
    const title = this.title;

    this.root.innerHTML = `
      <style>
        :host {
          display: block;
          border-bottom: var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #e0e0e0);
        }
        :host(:last-of-type) {
          border-bottom: none;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--ui-space-3, 12px) var(--ui-space-4, 16px);
          background-color: var(--ui-color-bg-surface, #ffffff);
          color: var(--ui-color-text-primary, #000000);
          font-size: var(--ui-font-size-sm, 14px);
          font-weight: var(--ui-font-weight-semibold, 600);
          cursor: pointer;
          user-select: none;
          outline: none;
          transition: background-color var(--ui-transition-fast);
        }
        .header:hover:not(.disabled) {
          background-color: var(--ui-color-bg-muted, #f5f5f5);
        }
        .header:focus-visible {
          box-shadow: inset 0 0 0 2px var(--ui-color-focus-ring, #ff5500);
        }
        .header.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .icon {
          width: 14px;
          height: 14px;
          stroke: currentColor;
          stroke-width: 2;
          transition: transform var(--ui-transition-fast);
        }
        .header.open .icon {
          transform: rotate(180deg);
        }
        .content {
          display: ${isOpen ? 'block' : 'none'};
          padding: var(--ui-space-4, 16px);
          background-color: var(--ui-color-bg-subtle, #fafafa);
          font-size: var(--ui-font-size-sm, 14px);
          line-height: var(--ui-line-height-normal, 1.5);
          color: var(--ui-color-text-primary, #000000);
        }
      </style>
      <div
        class="header ${isOpen ? 'open' : ''} ${isDisabled ? 'disabled' : ''}"
        role="button"
        tabindex="${isDisabled ? '-1' : '0'}"
        aria-expanded="${isOpen}"
      >
        <span>${this.escapeHtml(title)}</span>
        <svg class="icon" viewBox="0 0 16 16">
          <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="square" />
        </svg>
      </div>
      <div class="content" role="region">
        <slot></slot>
      </div>
    `;

    const header = this.root.querySelector('.header');
    if (header) {
      header.addEventListener('click', () => this.toggle());
      header.addEventListener('keydown', (e: Event) => {
        const kb = e as KeyboardEvent;
        if (kb.key === ' ' || kb.key === 'Enter') {
          kb.preventDefault();
          this.toggle();
        }
      });
    }
  }
}

if (!customElements.get('ui-accordion')) {
  customElements.define('ui-accordion', UIAccordion);
}
if (!customElements.get('ui-accordion-item')) {
  customElements.define('ui-accordion-item', UIAccordionItem);
}
