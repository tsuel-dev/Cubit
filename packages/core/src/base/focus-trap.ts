/**
 * FocusTrap Utility
 * WCAG 2.1 AA 규격의 키보드 포커스 트랩 (Modal, Popover 등에서 포커스가 벗어나지 않도록 방지)
 */

export class FocusTrap {
  private element: HTMLElement | ShadowRoot;
  private firstFocusableEl: HTMLElement | null = null;
  private lastFocusableEl: HTMLElement | null = null;
  private handleKeyDownBound: (e: KeyboardEvent) => void;
  private active = false;

  private static FOCUSABLE_SELECTORS = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'ui-button:not([disabled])',
    'ui-input:not([disabled])',
  ].join(',');

  constructor(element: HTMLElement | ShadowRoot) {
    this.element = element;
    this.handleKeyDownBound = this.handleKeyDown.bind(this);
  }

  public activate(): void {
    this.updateFocusableElements();
    if (this.firstFocusableEl) {
      this.firstFocusableEl.focus();
    }
    document.addEventListener('keydown', this.handleKeyDownBound);
    this.active = true;
  }

  public deactivate(): void {
    if (!this.active) return;
    document.removeEventListener('keydown', this.handleKeyDownBound);
    this.active = false;
  }

  private updateFocusableElements(): void {
    const focusableNodes = Array.from(
      this.element.querySelectorAll<HTMLElement>(FocusTrap.FOCUSABLE_SELECTORS),
    ).filter((el) => el.offsetParent !== null || el.offsetWidth > 0 || el.offsetHeight > 0);

    this.firstFocusableEl = focusableNodes[0] || null;
    this.lastFocusableEl = focusableNodes[focusableNodes.length - 1] || null;
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (e.key !== 'Tab') return;

    this.updateFocusableElements();

    if (!this.firstFocusableEl || !this.lastFocusableEl) {
      e.preventDefault();
      return;
    }

    if (e.shiftKey) {
      if (document.activeElement === this.firstFocusableEl || this.element === document.activeElement) {
        this.lastFocusableEl.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === this.lastFocusableEl) {
        this.firstFocusableEl.focus();
        e.preventDefault();
      }
    }
  }
}
