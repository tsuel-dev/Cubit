import { UIElement } from '../../base/ui-element';

export class UICard extends UIElement {
  static get observedAttributes(): string[] {
    return ['variant', 'bordered'];
  }

  get variant(): string {
    return this.getAttribute('variant') || 'default';
  }

  get bordered(): boolean {
    return this.hasAttribute('bordered') || this.variant === 'bordered';
  }

  protected render(): void {
    const variant = this.variant;
    const isBordered = this.bordered;

    this.root.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--ui-font-family-base, sans-serif);
          box-sizing: border-box;
        }
        .card {
          background-color: var(--ui-color-bg-surface, #ffffff);
          color: var(--ui-color-text-primary, #000000);
          border: ${isBordered ? 'var(--ui-border-width-thin, 1px) solid var(--ui-color-border-strong, #000000)' : 'var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #e0e0e0)'};
          border-radius: var(--ui-radius-sm, 1px);
          box-sizing: border-box;
          overflow: hidden;
        }
        .card.elevated {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .card.secondary {
          background-color: var(--ui-color-bg-secondary, #ffebcc);
          border-color: var(--ui-color-primary, #ff5500);
        }
        ::slotted([slot="header"]) {
          padding: var(--ui-space-3, 12px) var(--ui-space-4, 16px);
          border-bottom: var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #e0e0e0);
          font-weight: var(--ui-font-weight-bold, 700);
          font-size: var(--ui-font-size-md, 16px);
        }
        .content {
          padding: var(--ui-space-4, 16px);
          font-size: var(--ui-font-size-sm, 14px);
          line-height: var(--ui-line-height-normal, 1.5);
        }
        ::slotted([slot="footer"]) {
          padding: var(--ui-space-3, 12px) var(--ui-space-4, 16px);
          border-top: var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #e0e0e0);
          background-color: var(--ui-color-bg-subtle, #fafafa);
        }
      </style>
      <div class="card ${variant}">
        <slot name="header"></slot>
        <div class="content">
          <slot></slot>
        </div>
        <slot name="footer"></slot>
      </div>
    `;
  }
}

if (!customElements.get('ui-card')) {
  customElements.define('ui-card', UICard);
}
