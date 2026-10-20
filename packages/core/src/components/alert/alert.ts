import { UIElement } from '../../base/ui-element';

export class UIAlert extends UIElement {
  static get observedAttributes(): string[] {
    return ['variant', 'title', 'closable', 'aria-label'];
  }

  get variant(): string {
    return this.getAttribute('variant') || 'info';
  }

  override get title(): string {
    return this.getAttribute('title') || '';
  }

  override set title(val: string) {
    this.setAttribute('title', val);
  }

  get closable(): boolean {
    return this.getBooleanAttr('closable');
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'alert');
  }

  public close(): void {
    this.style.display = 'none';
    this.emit('close');
  }

  protected render(): void {
    const variant = this.variant;
    const title = this.title;
    const closable = this.closable;

    this.root.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--ui-font-family-base, sans-serif);
          font-size: var(--ui-font-size-sm, 14px);
          box-sizing: border-box;
          margin-bottom: var(--ui-space-3, 12px);
        }
        .alert {
          display: flex;
          align-items: flex-start;
          gap: var(--ui-space-3, 12px);
          padding: var(--ui-space-3, 12px) var(--ui-space-4, 16px);
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #e0e0e0);
          border-left-width: 4px;
          border-radius: var(--ui-radius-sm, 1px);
          line-height: var(--ui-line-height-normal, 1.5);
        }
        .alert.info {
          background-color: var(--ui-color-info-bg, #e0f2fe);
          border-color: var(--ui-color-info, #0284c7);
          color: var(--ui-color-text-primary, #000000);
        }
        .alert.success {
          background-color: var(--ui-color-success-bg, #e8f5e9);
          border-color: var(--ui-color-success, #1b873f);
          color: var(--ui-color-text-primary, #000000);
        }
        .alert.warning {
          background-color: var(--ui-color-warning-bg, #fffbeb);
          border-color: var(--ui-color-warning, #d97706);
          color: var(--ui-color-text-primary, #000000);
        }
        .alert.error {
          background-color: var(--ui-color-error-bg, #fde8e8);
          border-color: var(--ui-color-error, #d32f2f);
          color: var(--ui-color-text-primary, #000000);
        }
        .content {
          flex: 1;
        }
        .title {
          font-weight: var(--ui-font-weight-bold, 700);
          margin-bottom: var(--ui-space-1, 4px);
        }
        .close-btn {
          all: unset;
          cursor: pointer;
          padding: var(--ui-space-1, 4px);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: inherit;
          opacity: 0.7;
          border-radius: var(--ui-radius-sm, 1px);
        }
        .close-btn:hover {
          opacity: 1;
        }
        .close-btn:focus-visible {
          box-shadow: 0 0 0 2px var(--ui-color-focus-ring, #ff5500);
        }
        .close-icon {
          width: 14px;
          height: 14px;
          stroke: currentColor;
          stroke-width: 2;
        }
      </style>
      <div class="alert ${variant}">
        <div class="content">
          ${title ? `<div class="title">${this.escapeHtml(title)}</div>` : ''}
          <slot></slot>
        </div>
        ${
          closable
            ? `
          <button class="close-btn" aria-label="Dismiss alert" id="closeBtn">
            <svg class="close-icon" viewBox="0 0 16 16">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        `
            : ''
        }
      </div>
    `;

    const closeBtn = this.root.querySelector('#closeBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }
  }
}

if (!customElements.get('ui-alert')) {
  customElements.define('ui-alert', UIAlert);
}
