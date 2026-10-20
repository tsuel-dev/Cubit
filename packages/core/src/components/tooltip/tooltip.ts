import { UIElement } from '../../base/ui-element';

export class UITooltip extends UIElement {
  static get observedAttributes(): string[] {
    return ['content', 'position'];
  }

  get content(): string {
    return this.getAttribute('content') || '';
  }

  set content(val: string) {
    this.setAttribute('content', val);
  }

  get position(): string {
    return this.getAttribute('position') || 'top';
  }

  set position(val: string) {
    this.setAttribute('position', val);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.listen('mouseenter', this.show.bind(this));
    this.listen('mouseleave', this.hide.bind(this));
    this.listen('focusin', this.show.bind(this));
    this.listen('focusout', this.hide.bind(this));
    this.listen('keydown', (e) => {
      if (e.key === 'Escape') this.hide();
    });
  }

  public show(): void {
    const tip = this.root.querySelector('.tooltip');
    if (tip) tip.classList.add('visible');
  }

  public hide(): void {
    const tip = this.root.querySelector('.tooltip');
    if (tip) tip.classList.remove('visible');
  }

  protected render(): void {
    const content = this.content;
    const position = this.position;

    this.root.innerHTML = `
      <style>
        :host {
          display: inline-block;
          position: relative;
          font-family: var(--ui-font-family-base, sans-serif);
        }
        .tooltip {
          position: absolute;
          z-index: 1000;
          background-color: var(--ui-color-border-strong, #000000);
          color: var(--ui-color-text-inverse, #ffffff);
          font-size: var(--ui-font-size-xs, 12px);
          line-height: var(--ui-line-height-tight, 1.25);
          padding: var(--ui-space-1, 4px) var(--ui-space-2, 8px);
          border-radius: var(--ui-radius-sm, 1px);
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          visibility: hidden;
          transition: opacity var(--ui-transition-fast), visibility var(--ui-transition-fast);
        }
        .tooltip.visible {
          opacity: 1;
          visibility: visible;
        }

        /* Positions */
        .tooltip.top {
          bottom: calc(100% + 6px);
          left: 50%;
          transform: translateX(-50%);
        }
        .tooltip.bottom {
          top: calc(100% + 6px);
          left: 50%;
          transform: translateX(-50%);
        }
        .tooltip.left {
          right: calc(100% + 6px);
          top: 50%;
          transform: translateY(-50%);
        }
        .tooltip.right {
          left: calc(100% + 6px);
          top: 50%;
          transform: translateY(-50%);
        }
      </style>
      <slot></slot>
      <div class="tooltip ${position}" role="tooltip" aria-hidden="true">
        ${content}
      </div>
    `;
  }
}

if (!customElements.get('ui-tooltip')) {
  customElements.define('ui-tooltip', UITooltip);
}
