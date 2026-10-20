import { UIElement } from '../../base/ui-element';

export class UITable extends UIElement {
  static get observedAttributes(): string[] {
    return ['striped', 'bordered', 'hoverable'];
  }

  private static lightCssInjected = false;

  /**
   * ::slotted() 은 slot 직계 자식(thead/tbody)까지만 도달할 수 있으므로,
   * td/th/tr 같은 간접 콘텐츠는 문서 레벨 라이트 CSS로 스타일링한다.
   * ui-table 태그로 스코프가 한정되므로 외부 영향은 없다.
   */
  private ensureLightCss(): void {
    if (UITable.lightCssInjected) return;
    UITable.lightCssInjected = true;
    const style = document.createElement('style');
    style.setAttribute('data-cubit-ui-table', '');
    style.textContent = `
      ui-table thead th,
      ui-table tbody td {
        padding: var(--ui-space-3, 12px) var(--ui-space-4, 16px);
        text-align: left;
        color: var(--ui-color-text-primary, #000000);
      }
      ui-table thead {
        background-color: var(--ui-color-bg-subtle, #fafafa);
        border-bottom: var(--ui-border-width-thick, 2px) solid var(--ui-color-border-strong, #000000);
      }
      ui-table thead th {
        font-weight: var(--ui-font-weight-bold, 700);
      }
      ui-table tbody td {
        border-bottom: var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #e0e0e0);
      }
      ui-table[bordered] th,
      ui-table[bordered] td {
        border: var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #e0e0e0);
      }
      ui-table[striped] tbody tr:nth-child(even) {
        background-color: var(--ui-color-bg-subtle, #fafafa);
      }
      ui-table[hoverable] tbody tr:hover td {
        background-color: var(--ui-color-bg-secondary-subtle, #ffe4c9);
      }
    `;
    document.head.appendChild(style);
  }

  get striped(): boolean {
    return this.hasAttribute('striped');
  }

  get bordered(): boolean {
    return this.hasAttribute('bordered');
  }

  get hoverable(): boolean {
    return this.hasAttribute('hoverable');
  }

  protected render(): void {
    const isStriped = this.striped;
    const isBordered = this.bordered;
    const isHoverable = this.hoverable;
    this.ensureLightCss();

    this.root.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          overflow-x: auto;
          font-family: var(--ui-font-family-base, sans-serif);
        }
        .table-container {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: var(--ui-font-size-sm, 14px);
          color: var(--ui-color-text-primary, #000000);
          border: ${isBordered ? 'var(--ui-border-width-thin, 1px) solid var(--ui-color-border-strong, #000000)' : 'var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #e0e0e0)'};
        }
        ::slotted(thead) {
          background-color: var(--ui-color-bg-subtle, #fafafa);
          border-bottom: var(--ui-border-width-thick, 2px) solid var(--ui-color-border-strong, #000000);
          font-weight: var(--ui-font-weight-bold, 700);
        }
        ::slotted(th), ::slotted(td) {
          padding: var(--ui-space-3, 12px) var(--ui-space-4, 16px);
          border-bottom: var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #e0e0e0);
        }
        ${
          isBordered
            ? `
          ::slotted(th), ::slotted(td) {
            border: var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #e0e0e0);
          }
        `
            : ''
        }
        ${
          isStriped
            ? `
          ::slotted(tbody tr:nth-child(even)) {
            background-color: var(--ui-color-bg-subtle, #fafafa);
          }
        `
            : ''
        }
        ${
          isHoverable
            ? `
          ::slotted(tbody tr:hover) {
            background-color: var(--ui-color-bg-secondary-subtle, #ffe4c9);
          }
        `
            : ''
        }
      </style>
      <table class="table-container" role="table">
        <slot></slot>
      </table>
    `;
  }
}

if (!customElements.get('ui-table')) {
  customElements.define('ui-table', UITable);
}
