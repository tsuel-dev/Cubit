import { UIElement } from '../../base/ui-element';

export class UISpinner extends UIElement {
  static get observedAttributes(): string[] {
    return ['size', 'aria-label'];
  }

  get size(): string {
    return this.getAttribute('size') || 'md';
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'status');
    if (!this.hasAttribute('aria-label')) {
      this.setAttribute('aria-label', 'Loading');
    }
  }

  protected render(): void {
    const size = this.size;

    this.root.innerHTML = `
      <style>
        :host {
          display: inline-block;
          line-height: 0;
        }
        .spinner {
          display: inline-block;
          box-sizing: border-box;
          border-style: solid;
          border-color: var(--ui-color-border, #e0e0e0);
          border-top-color: var(--ui-color-primary, #ff5500);
          border-radius: var(--ui-radius-full, 9999px);
          animation: spin 0.8s linear infinite;
        }
        .spinner.sm {
          width: 16px;
          height: 16px;
          border-width: 2px;
        }
        .spinner.md {
          width: 24px;
          height: 24px;
          border-width: 3px;
        }
        .spinner.lg {
          width: 36px;
          height: 36px;
          border-width: 4px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
      <div class="spinner ${size}"></div>
    `;
  }
}

if (!customElements.get('ui-spinner')) {
  customElements.define('ui-spinner', UISpinner);
}
