/**
 * FocusTrap / ScrollLock Utility
 * WCAG 2.1 AA 규격의 키보드 포커스 트랩 (Modal, Drawer 등에서 포커스가 벗어나지 않도록 방지)
 *
 * - shadow DOM 안쪽과 <slot> 으로 투영된 light DOM 요소까지 탐색한다(ui-input 의 내부 input 도 대상).
 * - 가시성은 getClientRects() 로 판정해 position: fixed 요소도 놓치지 않는다.
 * - 해제하면 트랩을 켜기 직전에 포커스가 있던 요소로 되돌린다.
 */

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'summary',
  '[contenteditable=""]',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function isVisible(el: HTMLElement): boolean {
  if (el.hidden) return false;
  const style = getComputedStyle(el);
  if (style.visibility === 'hidden' || style.display === 'none') return false;
  return el.getClientRects().length > 0;
}

/** root 아래의 포커스 가능한 요소를 DOM 순서대로 모은다(shadow root 와 slot 을 통과). */
export function collectFocusable(root: Element | ShadowRoot | Document): HTMLElement[] {
  const out: HTMLElement[] = [];

  const visit = (node: Element): void => {
    if (node instanceof HTMLElement && node.matches(FOCUSABLE) && isVisible(node)) out.push(node);
    if (node instanceof HTMLSlotElement) {
      const assigned = node.assignedElements({ flatten: true });
      if (assigned.length > 0) assigned.forEach(visit);
      else Array.from(node.children).forEach(visit); // 기본 슬롯 콘텐츠
      return;
    }
    if (node.shadowRoot) Array.from(node.shadowRoot.children).forEach(visit);
    // 슬롯을 가진 호스트는 shadowRoot 쪽에서 assignedElements 로 light DOM 을 방문하므로 중복 방문하지 않는다.
    else Array.from(node.children).forEach(visit);
  };

  Array.from(root.children).forEach(visit);
  return out;
}

/** shadow 경계를 뚫고 실제 포커스를 가진 요소를 돌려준다. */
export function deepActiveElement(): Element | null {
  let active: Element | null = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active;
}

export class FocusTrap {
  private element: HTMLElement | ShadowRoot;
  private handleKeyDownBound: (e: KeyboardEvent) => void;
  private active = false;
  private previouslyFocused: HTMLElement | null = null;

  constructor(element: HTMLElement | ShadowRoot) {
    this.element = element;
    this.handleKeyDownBound = this.handleKeyDown.bind(this);
  }

  public activate(): void {
    if (this.active) return;
    const current = deepActiveElement();
    this.previouslyFocused = current instanceof HTMLElement ? current : null;
    const items = collectFocusable(this.element as unknown as Element);
    // 첫 요소가 닫기 버튼이면 본문 입력창을 먼저 잡는 편이 편하지만, 규칙은 단순하게 "첫 요소" 로 둔다.
    const first = items[0];
    if (first) first.focus();
    else if (this.element instanceof ShadowRoot) this.element.querySelector<HTMLElement>('[tabindex="-1"]')?.focus();
    document.addEventListener('keydown', this.handleKeyDownBound);
    this.active = true;
  }

  public deactivate(restoreFocus = true): void {
    if (!this.active) return;
    document.removeEventListener('keydown', this.handleKeyDownBound);
    this.active = false;
    const target = this.previouslyFocused;
    this.previouslyFocused = null;
    if (restoreFocus && target && target.isConnected) target.focus();
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (e.key !== 'Tab') return;

    const items = collectFocusable(this.element as unknown as Element);
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) {
      e.preventDefault();
      return;
    }

    const active = deepActiveElement();
    const inside = active ? items.includes(active as HTMLElement) : false;
    if (e.shiftKey) {
      if (!inside || active === first) {
        last.focus();
        e.preventDefault();
      }
    } else if (!inside || active === last) {
      first.focus();
      e.preventDefault();
    }
  }
}

/** 모달류가 열려 있는 동안 배경 스크롤을 막는다. 여러 개가 겹쳐도 마지막 하나가 닫힐 때만 복원한다. */
export class ScrollLock {
  private static count = 0;
  private static previous = '';
  private held = false;

  public lock(): void {
    if (this.held) return;
    this.held = true;
    if (ScrollLock.count === 0) {
      ScrollLock.previous = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
    }
    ScrollLock.count += 1;
  }

  public unlock(): void {
    if (!this.held) return;
    this.held = false;
    ScrollLock.count -= 1;
    if (ScrollLock.count === 0) document.documentElement.style.overflow = ScrollLock.previous;
  }
}
