import { UIElement } from '../../base/ui-element';

export class UIAvatar extends UIElement {
  static get observedAttributes(): string[] {
    return ['src', 'alt', 'name', 'size', 'shape'];
  }

  get src(): string {
    return this.getAttribute('src') || '';
  }

  set src(val: string) {
    this.setAttribute('src', val);
  }

  get alt(): string {
    return this.getAttribute('alt') || '';
  }

  get name(): string {
    return this.getAttribute('name') || '';
  }

  get size(): string {
    return this.getAttribute('size') || 'md';
  }

  get shape(): string {
    return this.getAttribute('shape') || 'circle';
  }

  private getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0]![0] || '') + (parts[1]![0] || '');
    }
    return name.slice(0, 2).toUpperCase();
  }

  protected render(): void {
    const src = this.src;
    const alt = this.alt || this.name;
    const size = this.size;
    const circle = this.shape !== 'square';
    const initials = this.getInitials(this.name);

    this.root.innerHTML = `
      <style>
        :host {
          display: inline-block;
          font-family: var(--ui-font-family-base, sans-serif);
          user-select: none;
        }
        .avatar {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          background-color: var(--ui-color-bg-secondary, #ffebcc);
          color: var(--ui-color-primary, #ff5500);
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-primary, #ff5500);
          border-radius: ${circle ? 'var(--ui-radius-full, 9999px)' : 'var(--ui-radius-sm, 8px)'};
          font-weight: var(--ui-font-weight-bold, 700);
          overflow: hidden;
        }

        /* Sizes */
        .avatar.sm {
          width: 24px;
          height: 24px;
          font-size: 10px;
        }
        .avatar.md {
          width: 36px;
          height: 36px;
          font-size: var(--ui-font-size-sm, 14px);
        }
        .avatar.lg {
          width: 48px;
          height: 48px;
          font-size: var(--ui-font-size-md, 16px);
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      </style>
      <div class="avatar ${this.escapeHtml(size)}" role="img" aria-label="${this.escapeHtml(alt)}">
        ${
          src
            ? `<img src="${this.safeUrl(src)}" alt="${this.escapeHtml(alt)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-flex';" /><span style="display:none;">${this.escapeHtml(initials)}</span>`
            : `<span>${this.escapeHtml(initials)}</span>`
        }
      </div>
    `;
  }
}

if (!customElements.get('ui-avatar')) {
  customElements.define('ui-avatar', UIAvatar);
}
