import { UIElement } from '../../base/ui-element';

/**
 * ui-segmented / ui-segment — 상호 배타적 선택 버튼 그룹(보기 전환, 필터 등).
 *
 * <ui-segmented value="list" aria-label="보기 방식">
 *   <ui-segment value="list">목록</ui-segment>
 *   <ui-segment value="grid">격자</ui-segment>
 * </ui-segmented>
 *
 * ARIA radiogroup/radio 패턴: 화살표·Home/End 로 이동하면 즉시 선택(change 이벤트).
 */
export class UISegmented extends UIElement {
  static get observedAttributes(): string[] {
    return ['value', 'size', 'disabled', 'aria-label'];
  }

  get value(): string {
    return this.getAttribute('value') || '';
  }

  set value(val: string) {
    this.setAttribute('value', val);
  }

  get disabled(): boolean {
    return this.getBooleanAttr('disabled');
  }

  set disabled(val: boolean) {
    this.setBooleanAttr('disabled', val);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'radiogroup');
    this.listen('click', this.handleClick.bind(this));
    this.listen('keydown', this.handleKeyDown.bind(this));
    this.refresh();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    this.refresh();
  }

  private segments(): UISegment[] {
    return Array.from(this.querySelectorAll<UISegment>('ui-segment'));
  }

  private enabledSegments(): UISegment[] {
    return this.segments().filter((s) => !s.hasAttribute('disabled') && !this.disabled);
  }

  private select(seg: UISegment): void {
    const val = seg.getAttribute('value') || '';
    if (val === this.value) return;
    this.value = val;
    this.emit('change', { value: val });
  }

  private handleClick(e: MouseEvent): void {
    const seg = (e.target as HTMLElement).closest('ui-segment') as UISegment | null;
    if (!seg || seg.hasAttribute('disabled') || this.disabled) return;
    this.select(seg);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    const list = this.enabledSegments();
    if (!list.length) return;
    const current = list.findIndex((s) => s.getAttribute('value') === this.value);
    let next = current;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = current < 0 ? 0 : (current + 1) % list.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = current < 0 ? list.length - 1 : (current - 1 + list.length) % list.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = list.length - 1;
    else if ((e.key === ' ' || e.key === 'Enter') && (e.target as HTMLElement).closest('ui-segment')) {
      e.preventDefault();
      this.select((e.target as HTMLElement).closest('ui-segment') as UISegment);
      return;
    } else return;
    e.preventDefault();
    const seg = list[next];
    if (seg) {
      this.select(seg);
      seg.focus();
    }
  }

  /** aria-checked / tabindex(roving) 를 자식 ui-segment 에 반영 (자식이 속성 변경 시에도 호출) */
  refresh(): void {
    const segs = this.segments();
    const hasChecked = segs.some((s) => s.getAttribute('value') === this.value && !s.hasAttribute('disabled'));
    let tabbableAssigned = false;
    segs.forEach((seg) => {
      const disabled = seg.hasAttribute('disabled') || this.disabled;
      const checked = seg.getAttribute('value') === this.value;
      seg.setAttribute('aria-checked', String(checked));
      seg.setAttribute('aria-disabled', String(disabled));
      let tab = -1;
      if (!disabled && ((checked && hasChecked) || (!hasChecked && !tabbableAssigned))) {
        tab = 0;
        tabbableAssigned = true;
      }
      seg.setAttribute('tabindex', String(tab));
    });
  }

  protected render(): void {
    const size = ['sm', 'md', 'lg'].includes(this.getAttribute('size') || '') ? (this.getAttribute('size') as string) : 'md';
    this.root.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          box-sizing: border-box;
          padding: 2px;
          gap: 2px;
          background-color: var(--ui-color-bg-muted, #f5f5f5);
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #e0e0e0);
          border-radius: var(--ui-radius-md, 12px);
          font-family: var(--ui-font-family-base, sans-serif);
        }
        :host([disabled]) { opacity: 0.5; }
        ::slotted(ui-segment) {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          cursor: pointer;
          user-select: none;
          white-space: nowrap;
          font-weight: var(--ui-font-weight-medium, 500);
          color: var(--ui-color-text-secondary, #616161);
          border-radius: var(--ui-radius-sm, 8px);
          outline: none;
          transition: background-color var(--ui-transition-fast), color var(--ui-transition-fast);
          ${size === 'sm' ? 'padding: 2px 10px; font-size: var(--ui-font-size-xs, 12px);' : size === 'lg' ? 'padding: 8px 20px; font-size: var(--ui-font-size-md, 16px);' : 'padding: 5px 14px; font-size: var(--ui-font-size-sm, 14px);'}
        }
        ::slotted(ui-segment:hover:not([aria-disabled="true"])) { color: var(--ui-color-text-primary, #000000); }
        ::slotted(ui-segment[aria-checked="true"]) {
          background-color: var(--ui-color-bg-surface, #ffffff);
          color: var(--ui-color-primary, #ff5500);
          box-shadow: 0 0 0 var(--ui-border-width-thin, 1px) var(--ui-color-primary, #ff5500);
        }
        ::slotted(ui-segment[aria-disabled="true"]) { opacity: 0.5; cursor: not-allowed; }
        ::slotted(ui-segment:focus-visible) {
          box-shadow: 0 0 0 2px var(--ui-color-bg-canvas, #ffffff), 0 0 0 4px var(--ui-color-focus-ring, #ff5500);
        }
      </style>
      <slot></slot>
    `;
    this.root.querySelector('slot')?.addEventListener('slotchange', () => this.refresh());
  }
}

export class UISegment extends HTMLElement {
  connectedCallback(): void {
    this.setAttribute('role', 'radio');
    if (!this.hasAttribute('aria-checked')) this.setAttribute('aria-checked', 'false');
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '-1');
    (this.closest('ui-segmented') as UISegmented | null)?.refresh();
  }

  static get observedAttributes(): string[] {
    return ['value', 'disabled'];
  }

  attributeChangedCallback(): void {
    (this.closest('ui-segmented') as UISegmented | null)?.refresh();
  }
}

if (!customElements.get('ui-segmented')) {
  customElements.define('ui-segmented', UISegmented);
}
if (!customElements.get('ui-segment')) {
  customElements.define('ui-segment', UISegment);
}
