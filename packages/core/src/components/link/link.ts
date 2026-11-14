import { UIElement } from '../../base/ui-element';

/**
 * <ui-link href="..."> — 토큰 기반 하이퍼링크.
 * - 안전하지 않은 스킴(javascript: 등)이나 href 없음, disabled 이면 링크 대신 비활성 텍스트로 렌더한다.
 * - target="_blank" 또는 external 이면 rel="noopener noreferrer" 를 자동으로 붙인다.
 */
export class UILink extends UIElement {
  static get observedAttributes(): string[] {
    return ['href', 'target', 'rel', 'variant', 'underline', 'external', 'disabled', 'download'];
  }

  get href(): string {
    return this.getAttribute('href') || '';
  }

  get variant(): string {
    return this.getAttribute('variant') || 'primary';
  }

  get underline(): string {
    const v = this.getAttribute('underline');
    return v === 'always' || v === 'none' ? v : 'hover';
  }

  get external(): boolean {
    return this.getBooleanAttr('external');
  }

  set external(val: boolean) {
    this.setBooleanAttr('external', val);
  }

  get disabled(): boolean {
    return this.getBooleanAttr('disabled');
  }

  set disabled(val: boolean) {
    this.setBooleanAttr('disabled', val);
  }

  protected render(): void {
    const href = this.href ? this.safeUrl(this.href) : '';
    const inactive = this.disabled || !href;
    const newTab = this.external || this.getAttribute('target') === '_blank';
    const target = newTab ? '_blank' : this.getAttribute('target') || '';
    const relTokens = new Set((this.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
    if (newTab) {
      relTokens.add('noopener');
      relTokens.add('noreferrer');
    }
    const rel = [...relTokens].join(' ');
    const arrow = this.external ? '<span class="ext" aria-hidden="true">↗</span>' : '';
    const attrs = inactive
      ? 'class="link" aria-disabled="true"'
      : `class="link" href="${href}"` +
        (target ? ` target="${this.escapeHtml(target)}"` : '') +
        (rel ? ` rel="${this.escapeHtml(rel)}"` : '') +
        (this.hasAttribute('download') ? ` download="${this.escapeHtml(this.getAttribute('download') ?? '')}"` : '');
    const tag = inactive ? 'span' : 'a';

    this.paint(`
      <style>
        :host {
          display: inline;
          font-family: inherit;
        }
        .link {
          color: var(--ui-color-primary, #ff5500);
          text-decoration: none;
          border-radius: var(--ui-radius-sm, 1px);
          cursor: pointer;
        }
        .link.muted {
          color: var(--ui-color-text-secondary, #555555);
        }
        .link.inherit {
          color: inherit;
        }
        .link.u-always {
          text-decoration: underline;
        }
        a.link.u-hover:hover {
          text-decoration: underline;
        }
        a.link.primary:hover {
          color: var(--ui-color-primary-hover, #e04b00);
        }
        a.link.primary:active {
          color: var(--ui-color-primary-active, #c24000);
        }
        a.link:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px var(--ui-color-bg-canvas, #ffffff), 0 0 0 4px var(--ui-color-focus-ring, #ff5500);
        }
        span.link {
          color: var(--ui-color-text-muted, #999999);
          cursor: not-allowed;
        }
        .ext {
          font-size: 0.85em;
          margin-left: 0.15em;
        }
        @media (forced-colors: active) {
          .link { color: LinkText; }
          span.link { color: GrayText; }
        }
      </style>
      <${tag} ${attrs.replace('class="link"', `class="link ${this.escapeHtml(this.variant)} u-${this.underline}"`)}><slot></slot>${arrow}</${tag}>
    `);
  }
}

if (!customElements.get('ui-link')) {
  customElements.define('ui-link', UILink);
}
