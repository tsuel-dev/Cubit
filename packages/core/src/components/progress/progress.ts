import { UIElement } from '../../base/ui-element';

export class UIProgress extends UIElement {
  static get observedAttributes(): string[] {
    return ['value', 'max', 'size', 'variant', 'aria-label'];
  }

  get value(): number {
    return parseFloat(this.getAttribute('value') || '0');
  }

  set value(val: number) {
    this.setAttribute('value', String(val));
  }

  get max(): number {
    return parseFloat(this.getAttribute('max') || '100');
  }

  set max(val: number) {
    this.setAttribute('max', String(val));
  }

  get size(): string {
    return this.getAttribute('size') || 'md';
  }

  get variant(): string {
    return this.getAttribute('variant') || 'primary';
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'progressbar');
  }

  protected render(): void {
    const val = Math.min(Math.max(this.value, 0), this.max);
    const percentage = this.max > 0 ? (val / this.max) * 100 : 0;
    const size = this.size;
    const variant = this.variant;
    const ariaLabel = this.getAttribute('aria-label') || 'Progress';

    this.setAttribute('aria-valuenow', String(val));
    this.setAttribute('aria-valuemin', '0');
    this.setAttribute('aria-valuemax', String(this.max));
    this.setAttribute('aria-label', ariaLabel);

    this.root.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          font-family: var(--ui-font-family-base, sans-serif);
        }
        .track {
          width: 100%;
          background-color: var(--ui-color-bg-muted, #f5f5f5);
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #e0e0e0);
          border-radius: var(--ui-radius-sm, 1px);
          overflow: hidden;
          box-sizing: border-box;
          position: relative;
        }

        /* Sizes */
        .track.sm { height: 6px; }
        .track.md { height: 10px; }
        .track.lg { height: 16px; }

        .bar {
          height: 100%;
          width: ${percentage}%;
          transition: width var(--ui-transition-normal);
        }

        /* Variants */
        .bar.primary {
          background-color: var(--ui-color-primary, #ff5500);
        }
        .bar.success {
          background-color: var(--ui-color-success, #1b873f);
        }
        .bar.warning {
          background-color: var(--ui-color-warning, #d97706);
        }
        .bar.error {
          background-color: var(--ui-color-error, #d32f2f);
        }
      </style>
      <div class="track ${size}">
        <div class="bar ${variant}"></div>
      </div>
    `;
  }
}

if (!customElements.get('ui-progress')) {
  customElements.define('ui-progress', UIProgress);
}
