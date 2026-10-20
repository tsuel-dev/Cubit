import { UIElement } from '../../base/ui-element';

export class UIBadge extends UIElement {
  static get observedAttributes(): string[] {
    return ['variant', 'size'];
  }

  get variant(): string {
    return this.getAttribute('variant') || 'primary';
  }

  get size(): string {
    return this.getAttribute('size') || 'md';
  }

  protected render(): void {
    const variant = this.variant;
    const size = this.size;

    this.root.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          font-family: var(--ui-font-family-base, sans-serif);
          user-select: none;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--ui-font-weight-semibold, 600);
          line-height: var(--ui-line-height-none, 1);
          border-radius: var(--ui-radius-sm, 1px);
          box-sizing: border-box;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Sizes */
        .badge.sm {
          font-size: 10px;
          padding: 2px 4px;
        }
        .badge.md {
          font-size: var(--ui-font-size-xs, 12px);
          padding: 3px 6px;
        }
        .badge.lg {
          font-size: var(--ui-font-size-sm, 14px);
          padding: 4px 8px;
        }

        /* Variants */
        .badge.primary {
          background-color: var(--ui-color-primary, #ff5500);
          color: var(--ui-color-primary-contrast, #ffffff);
        }
        .badge.secondary {
          background-color: var(--ui-color-bg-secondary, #ffebcc);
          color: var(--ui-color-text-primary, #000000);
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-primary, #ff5500);
        }
        .badge.outline {
          background-color: transparent;
          color: var(--ui-color-text-primary, #000000);
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-border-strong, #000000);
        }
        .badge.success {
          background-color: var(--ui-color-success-bg, #e8f5e9);
          color: var(--ui-color-success, #1b873f);
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-success, #1b873f);
        }
        .badge.warning {
          background-color: var(--ui-color-warning-bg, #fffbeb);
          color: var(--ui-color-warning, #d97706);
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-warning, #d97706);
        }
        .badge.error {
          background-color: var(--ui-color-error-bg, #fde8e8);
          color: var(--ui-color-error, #d32f2f);
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-error, #d32f2f);
        }
      </style>
      <span class="badge ${variant} ${size}">
        <slot></slot>
      </span>
    `;
  }
}

if (!customElements.get('ui-badge')) {
  customElements.define('ui-badge', UIBadge);
}
