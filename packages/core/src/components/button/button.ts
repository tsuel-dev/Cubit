import { UIElement } from '../../base/ui-element';

export class UIButton extends UIElement {
  static get observedAttributes(): string[] {
    return ['variant', 'size', 'disabled', 'type', 'aria-label'];
  }

  get variant(): string {
    return this.getAttribute('variant') || 'primary';
  }

  get size(): string {
    return this.getAttribute('size') || 'md';
  }

  get disabled(): boolean {
    return this.getBooleanAttr('disabled');
  }

  set disabled(val: boolean) {
    this.setBooleanAttr('disabled', val);
  }

  get type(): string {
    return this.getAttribute('type') || 'button';
  }

  protected render(): void {
    const variant = this.variant;
    const size = this.size;
    const disabled = this.disabled;
    const ariaLabel = this.getAttribute('aria-label') || '';

    this.root.innerHTML = `
      <style>
        :host {
          display: inline-block;
          font-family: var(--ui-font-family-base, sans-serif);
        }
        button {
          all: unset;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--ui-space-2, 8px);
          box-sizing: border-box;
          font-family: inherit;
          font-weight: var(--ui-font-weight-medium, 500);
          cursor: pointer;
          border-radius: var(--ui-radius-sm, 1px);
          transition: background-color var(--ui-transition-fast), border-color var(--ui-transition-fast), color var(--ui-transition-fast);
          user-select: none;
          text-decoration: none;
          outline: none;
        }

        /* Sizes */
        button.sm {
          height: 28px;
          padding: 0 var(--ui-space-2, 8px);
          font-size: var(--ui-font-size-xs, 12px);
        }
        button.md {
          height: 36px;
          padding: 0 var(--ui-space-4, 16px);
          font-size: var(--ui-font-size-sm, 14px);
        }
        button.lg {
          height: 44px;
          padding: 0 var(--ui-space-6, 24px);
          font-size: var(--ui-font-size-md, 16px);
        }

        /* Variants */
        button.primary {
          background-color: var(--ui-color-primary, #ff5500);
          color: var(--ui-color-primary-contrast, #ffffff);
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-primary, #ff5500);
        }
        button.primary:hover:not(:disabled) {
          background-color: var(--ui-color-primary-hover, #e04b00);
          border-color: var(--ui-color-primary-hover, #e04b00);
        }
        button.primary:active:not(:disabled) {
          background-color: var(--ui-color-primary-active, #cc4400);
        }

        button.secondary {
          background-color: var(--ui-color-bg-secondary, #ffebcc);
          color: var(--ui-color-text-primary, #000000);
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-primary, #ff5500);
        }
        button.secondary:hover:not(:disabled) {
          background-color: var(--ui-color-bg-secondary-subtle, #ffe4c9);
        }

        button.outline {
          background-color: transparent;
          color: var(--ui-color-text-primary, #000000);
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-border-strong, #000000);
        }
        button.outline:hover:not(:disabled) {
          background-color: var(--ui-color-bg-muted, #f5f5f5);
        }

        button.ghost {
          background-color: transparent;
          color: var(--ui-color-text-primary, #000000);
          border: var(--ui-border-width-thin, 1px) solid transparent;
        }
        button.ghost:hover:not(:disabled) {
          background-color: var(--ui-color-bg-muted, #f5f5f5);
        }

        button.danger {
          background-color: var(--ui-color-error, #d32f2f);
          color: var(--ui-color-error-contrast, #ffffff);
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-error, #d32f2f);
        }
        button.danger:hover:not(:disabled) {
          filter: brightness(0.9);
        }

        /* Focus & WCAG AA Ring */
        button:focus-visible {
          box-shadow: 0 0 0 2px var(--ui-color-bg-canvas, #ffffff), 0 0 0 4px var(--ui-color-focus-ring, #ff5500);
        }

        /* Disabled */
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      </style>
      <button
        class="${variant} ${size}"
        type="${this.type}"
        ${disabled ? 'disabled' : ''}
        ${disabled ? 'aria-disabled="true"' : ''}
        ${ariaLabel ? `aria-label="${this.escapeHtml(ariaLabel)}"` : ''}
      >
        <slot></slot>
      </button>
    `;

    const btn = this.root.querySelector('button');
    if (btn) {
      btn.onclick = (e) => {
        if (this.disabled) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }
        if (this.type === 'submit') {
          const form = this.closest('form');
          if (form) form.requestSubmit();
        } else if (this.type === 'reset') {
          const form = this.closest('form');
          if (form) form.reset();
        }
      };
    }
  }
}

if (!customElements.get('ui-button')) {
  customElements.define('ui-button', UIButton);
}
