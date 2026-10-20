import { UIElement } from '../../base/ui-element';
import { FocusTrap } from '../../base/focus-trap';

export class UIModal extends UIElement {
  static get observedAttributes(): string[] {
    return ['open', 'title', 'aria-label'];
  }

  private focusTrap: FocusTrap | null = null;
  private handleKeyDownBound: (e: KeyboardEvent) => void;

  constructor() {
    super();
    this.handleKeyDownBound = this.handleKeyDown.bind(this);
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

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('keydown', this.handleKeyDownBound);
    if (this.open) {
      this.setupFocusTrap();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.handleKeyDownBound);
    if (this.focusTrap) {
      this.focusTrap.deactivate();
    }
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'open') {
      if (this.open) {
        this.setupFocusTrap();
      } else {
        if (this.focusTrap) {
          this.focusTrap.deactivate();
        }
      }
    }
  }

  private setupFocusTrap(): void {
    setTimeout(() => {
      if (!this.focusTrap) {
        this.focusTrap = new FocusTrap(this.root);
      }
      this.focusTrap.activate();
    }, 0);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (!this.open) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
    }
  }

  public close(): void {
    this.open = false;
    this.emit('close');
  }

  protected render(): void {
    const isOpen = this.open;
    const title = this.title;
    const ariaLabel = this.getAttribute('aria-label') || title || 'Dialog';

    this.root.innerHTML = `
      <style>
        :host {
          display: ${isOpen ? 'block' : 'none'};
          font-family: var(--ui-font-family-base, sans-serif);
        }
        .backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: var(--ui-space-4, 16px);
          box-sizing: border-box;
        }
        .dialog {
          background-color: var(--ui-color-bg-surface, #ffffff);
          color: var(--ui-color-text-primary, #000000);
          border: var(--ui-border-width-thick, 2px) solid var(--ui-color-border-strong, #000000);
          border-radius: var(--ui-radius-lg, 16px);
          box-sizing: border-box;
          width: 100%;
          max-width: 520px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
          outline: none;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--ui-space-3, 12px) var(--ui-space-4, 16px);
          border-bottom: var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #e0e0e0);
          background-color: var(--ui-color-bg-subtle, #fafafa);
        }
        .title {
          font-size: var(--ui-font-size-md, 16px);
          font-weight: var(--ui-font-weight-bold, 700);
          margin: 0;
        }
        .close-btn {
          all: unset;
          cursor: pointer;
          padding: var(--ui-space-1, 4px);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--ui-radius-sm, 1px);
        }
        .close-btn:hover {
          background-color: var(--ui-color-bg-muted, #f5f5f5);
        }
        .close-btn:focus-visible {
          box-shadow: 0 0 0 2px var(--ui-color-focus-ring, #ff5500);
        }
        .close-icon {
          width: 16px;
          height: 16px;
          stroke: var(--ui-color-text-primary, #000000);
          stroke-width: 2;
        }
        .body {
          padding: var(--ui-space-4, 16px);
          font-size: var(--ui-font-size-sm, 14px);
          line-height: var(--ui-line-height-normal, 1.5);
          overflow-y: auto;
          max-height: 70vh;
        }
        .footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: var(--ui-space-2, 8px);
          padding: var(--ui-space-3, 12px) var(--ui-space-4, 16px);
          border-top: var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #e0e0e0);
          background-color: var(--ui-color-bg-subtle, #fafafa);
        }
      </style>
      <div class="backdrop" id="backdrop">
        <div
          class="dialog"
          role="dialog"
          aria-modal="true"
          aria-label="${this.escapeHtml(ariaLabel)}"
          tabindex="-1"
        >
          <div class="header">
            <h2 class="title">${this.escapeHtml(title)}</h2>
            <button class="close-btn" aria-label="Close dialog" id="closeBtn">
              <svg class="close-icon" viewBox="0 0 16 16">
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>
          </div>
          <div class="body">
            <slot></slot>
          </div>
          <div class="footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    `;

    const backdrop = this.root.querySelector('#backdrop');
    const closeBtn = this.root.querySelector('#closeBtn');

    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          this.close();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.close();
      });
    }
  }
}

if (!customElements.get('ui-modal')) {
  customElements.define('ui-modal', UIModal);
}
