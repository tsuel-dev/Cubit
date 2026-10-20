import { UIElement } from '../../base/ui-element';

export class UIBreadcrumbs extends UIElement {
  static get observedAttributes(): string[] {
    return ['separator', 'aria-label'];
  }

  get separator(): string {
    return this.getAttribute('separator') || '/';
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'navigation');
    const ariaLabel = this.getAttribute('aria-label') || 'Breadcrumbs';
    this.setAttribute('aria-label', ariaLabel);
    this.syncSeparators();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'separator') {
      this.syncSeparators();
    }
  }

  private syncSeparators(): void {
    const items = Array.from(this.querySelectorAll('ui-breadcrumb-item'));
    items.forEach((item, index) => {
      if (index === items.length - 1) {
        item.setAttribute('current', 'true');
        item.removeAttribute('separator');
      } else {
        item.removeAttribute('current');
        item.setAttribute('separator', this.separator);
      }
    });
  }

  protected render(): void {
    this.root.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--ui-font-family-base, sans-serif);
        }
        ol {
          all: unset;
          display: flex;
          align-items: center;
          gap: var(--ui-space-2, 8px);
          list-style: none;
          font-size: var(--ui-font-size-sm, 14px);
          flex-wrap: wrap;
        }
      </style>
      <ol>
        <slot></slot>
      </ol>
    `;

    const slot = this.root.querySelector('slot');
    if (slot) {
      slot.addEventListener('slotchange', () => this.syncSeparators());
    }
  }
}

export class UIBreadcrumbItem extends UIElement {
  static get observedAttributes(): string[] {
    return ['href', 'separator', 'current'];
  }

  get href(): string {
    return this.getAttribute('href') || '';
  }

  get separator(): string {
    return this.getAttribute('separator') || '';
  }

  get current(): boolean {
    return this.hasAttribute('current') || this.getAttribute('current') === 'true';
  }

  protected render(): void {
    const href = this.href;
    const current = this.current;
    const separator = this.separator;

    this.root.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          align-items: center;
          gap: var(--ui-space-2, 8px);
          font-family: var(--ui-font-family-base, sans-serif);
          font-size: var(--ui-font-size-sm, 14px);
        }
        li {
          all: unset;
          display: inline-flex;
          align-items: center;
          gap: var(--ui-space-2, 8px);
        }
        a {
          color: var(--ui-color-text-secondary, #616161);
          text-decoration: none;
          transition: color var(--ui-transition-fast);
        }
        a:hover {
          color: var(--ui-color-primary, #ff5500);
          text-decoration: underline;
        }
        a:focus-visible {
          outline: 2px solid var(--ui-color-focus-ring, #ff5500);
          outline-offset: 2px;
        }
        .current {
          color: var(--ui-color-text-primary, #000000);
          font-weight: var(--ui-font-weight-semibold, 600);
        }
        .separator {
          color: var(--ui-color-text-muted, #9e9e9e);
          user-select: none;
        }
      </style>
      <li role="listitem">
        ${
          current
            ? `<span class="current" aria-current="page"><slot></slot></span>`
            : href
              ? `<a href="${this.safeUrl(href)}"><slot></slot></a>`
              : `<span><slot></slot></span>`
        }
        ${separator ? `<span class="separator" aria-hidden="true">${this.escapeHtml(separator)}</span>` : ''}
      </li>
    `;
  }
}

if (!customElements.get('ui-breadcrumbs')) {
  customElements.define('ui-breadcrumbs', UIBreadcrumbs);
}
if (!customElements.get('ui-breadcrumb-item')) {
  customElements.define('ui-breadcrumb-item', UIBreadcrumbItem);
}
