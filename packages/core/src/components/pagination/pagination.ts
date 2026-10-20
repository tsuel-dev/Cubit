import { UIElement } from '../../base/ui-element';

export class UIPagination extends UIElement {
  static get observedAttributes(): string[] {
    return ['current', 'total', 'page-size'];
  }

  get current(): number {
    return parseInt(this.getAttribute('current') || '1', 10);
  }

  set current(val: number) {
    this.setAttribute('current', String(val));
    this.render();
  }

  get total(): number {
    return parseInt(this.getAttribute('total') || '1', 10);
  }

  set total(val: number) {
    this.setAttribute('total', String(val));
    this.render();
  }

  get totalPages(): number {
    const pageSize = parseInt(this.getAttribute('page-size') || '10', 10);
    return Math.max(1, Math.ceil(this.total / pageSize));
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'navigation');
    this.setAttribute('aria-label', 'Pagination');
    this.listen('click', this.handleClick.bind(this));
  }

  private handleClick(e: MouseEvent): void {
    const btn = this.composedTarget(e).closest('button');
    if (!btn || btn.hasAttribute('disabled')) return;

    const action = btn.dataset.action;
    const page = btn.dataset.page;

    if (action === 'prev') {
      if (this.current > 1) {
        this.goToPage(this.current - 1);
      }
    } else if (action === 'next') {
      if (this.current < this.totalPages) {
        this.goToPage(this.current + 1);
      }
    } else if (page) {
      this.goToPage(parseInt(page, 10));
    }
  }

  private goToPage(page: number): void {
    if (page === this.current) return;
    this.current = page;
    this.emit('change', { page });
  }

  protected render(): void {
    const current = this.current;
    const totalPages = this.totalPages;

    // 간결한 페이지 번호 목록 생성 (최대 5개 표시)
    const pages: number[] = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(totalPages, start + 4);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    this.root.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          align-items: center;
          gap: var(--ui-space-1, 4px);
          font-family: var(--ui-font-family-base, sans-serif);
          user-select: none;
        }
        button {
          all: unset;
          min-width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          padding: 0 var(--ui-space-2, 8px);
          font-size: var(--ui-font-size-sm, 14px);
          font-weight: var(--ui-font-weight-medium, 500);
          color: var(--ui-color-text-primary, #000000);
          background-color: var(--ui-color-bg-surface, #ffffff);
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #e0e0e0);
          border-radius: var(--ui-radius-sm, 1px);
          cursor: pointer;
          transition: background-color var(--ui-transition-fast), border-color var(--ui-transition-fast);
        }
        button:hover:not(:disabled) {
          border-color: var(--ui-color-border-strong, #000000);
          background-color: var(--ui-color-bg-muted, #f5f5f5);
        }
        button:focus-visible {
          box-shadow: 0 0 0 2px var(--ui-color-bg-canvas, #ffffff), 0 0 0 4px var(--ui-color-focus-ring, #ff5500);
        }
        button.active {
          background-color: var(--ui-color-primary, #ff5500);
          border-color: var(--ui-color-primary, #ff5500);
          color: var(--ui-color-primary-contrast, #ffffff);
          font-weight: var(--ui-font-weight-bold, 700);
        }
        button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      </style>
      <button data-action="prev" ${current <= 1 ? 'disabled' : ''} aria-label="Previous page">
        &lsaquo;
      </button>
      ${pages
        .map(
          (p) => `
        <button
          data-page="${p}"
          class="${p === current ? 'active' : ''}"
          aria-current="${p === current ? 'page' : 'false'}"
          aria-label="Page ${p}"
        >
          ${p}
        </button>
      `,
        )
        .join('')}
      <button data-action="next" ${current >= totalPages ? 'disabled' : ''} aria-label="Next page">
        &rsaquo;
      </button>
    `;
  }
}

if (!customElements.get('ui-pagination')) {
  customElements.define('ui-pagination', UIPagination);
}
