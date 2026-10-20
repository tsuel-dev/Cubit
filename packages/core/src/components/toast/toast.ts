import { UIElement } from '../../base/ui-element';

export class UIToast extends UIElement {
  static get observedAttributes(): string[] {
    return ['variant', 'duration', 'open'];
  }

  private timer: number | null = null;

  get variant(): string {
    return this.getAttribute('variant') || 'info';
  }

  get open(): boolean {
    return this.getBooleanAttr('open');
  }

  set open(val: boolean) {
    this.setBooleanAttr('open', val);
  }

  get duration(): number {
    return parseInt(this.getAttribute('duration') || '4000', 10);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'status');
    this.setAttribute('aria-live', 'polite');
    if (this.open) {
      this.startTimer();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.clearTimer();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'open') {
      if (this.open) {
        this.startTimer();
      } else {
        this.clearTimer();
      }
    }
  }

  private startTimer(): void {
    this.clearTimer();
    if (this.duration > 0) {
      this.timer = window.setTimeout(() => {
        this.close();
      }, this.duration);
    }
  }

  private clearTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public close(): void {
    this.open = false;
    this.clearTimer();
    this.emit('close');
  }

  protected render(): void {
    const variant = this.variant;
    const isOpen = this.open;

    this.root.innerHTML = `
      <style>
        :host {
          display: ${isOpen ? 'block' : 'none'};
          font-family: var(--ui-font-family-base, sans-serif);
          font-size: var(--ui-font-size-sm, 14px);
          margin-bottom: var(--ui-space-2, 8px);
        }
        .toast {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ui-space-3, 12px);
          padding: var(--ui-space-3, 12px) var(--ui-space-4, 16px);
          background-color: var(--ui-color-bg-surface, #ffffff);
          color: var(--ui-color-text-primary, #000000);
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-border-strong, #000000);
          border-left-width: 4px;
          border-radius: var(--ui-radius-sm, 1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          min-width: 260px;
          max-width: 420px;
          box-sizing: border-box;
        }
        .toast.info {
          border-left-color: var(--ui-color-info, #0284c7);
        }
        .toast.success {
          border-left-color: var(--ui-color-success, #1b873f);
        }
        .toast.warning {
          border-left-color: var(--ui-color-warning, #d97706);
        }
        .toast.error {
          border-left-color: var(--ui-color-error, #d32f2f);
        }
        .content {
          flex: 1;
          line-height: var(--ui-line-height-normal, 1.5);
        }
        .close-btn {
          all: unset;
          cursor: pointer;
          padding: var(--ui-space-1, 4px);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--ui-radius-sm, 1px);
          color: var(--ui-color-text-muted, #9e9e9e);
        }
        .close-btn:hover {
          color: var(--ui-color-text-primary, #000000);
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
      <div class="toast ${variant}">
        <div class="content"><slot></slot></div>
        <button class="close-btn" aria-label="Close toast" id="closeBtn">
          <svg class="close-icon" viewBox="0 0 16 16">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>
      </div>
    `;

    const closeBtn = this.root.querySelector('#closeBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }
  }
}

if (!customElements.get('ui-toast')) {
  customElements.define('ui-toast', UIToast);
}
