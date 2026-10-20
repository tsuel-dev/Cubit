import { UIElement } from '../../base/ui-element';
import './log-item';

/**
 * <ui-log> — 로그/장문 텍스트 뷰어
 *
 * 서버 로그, 작업 이력, 실행 결과 같은 "계속 늘어나는 장문 텍스트"의 표준 표시기.
 * role="log" + aria-live 내장, 자동 스크롤, 개수 제한, 복사 버튼을 표준화한다.
 *
 * 속성:
 *   label       : 헤더 라벨 (aria-label로도 사용)
 *   height      : CSS height (기본 220px)
 *   wrap        : 지정하면 긴 문장을 줄바꿈 (기본: nowrap, 가로 스크롤)
 *   auto-scroll : 새 항목 추가 시 맨 아래로 스크롤 (기본 true, "false"로 해제)
 *   max         : 유지할 최대 항목 수 (기본 500, 초과분은 오래된 것부터 제거)
 *   empty       : 빈 상태 문구 (기본 '표시할 항목이 없습니다.')
 *
 * 자식: <ui-log-item level="success" time="...">메시지</ui-log-item>
 * 이벤트: 'copy' { text }
 * API: push(level, message, time?) · scrollDown() · clear()
 */
export class UILog extends UIElement {
  static get observedAttributes(): string[] {
    return ['label', 'height', 'wrap', 'auto-scroll', 'max', 'empty'];
  }

  get label(): string {
    return this.getAttribute('label') || '';
  }

  get height(): string {
    return this.getAttribute('height') || '220px';
  }

  get wrap(): boolean {
    return this.getBooleanAttr('wrap');
  }

  get autoScroll(): boolean {
    return this.getAttribute('auto-scroll') !== 'false';
  }

  get max(): number {
    const n = parseInt(this.getAttribute('max') || '500', 10);
    return Number.isFinite(n) && n > 0 ? n : 500;
  }

  get emptyText(): string {
    return this.getAttribute('empty') || '표시할 항목이 없습니다.';
  }

  override connectedCallback(): void {
    super.connectedCallback();
    const slot = this.root.querySelector('slot');
    slot?.addEventListener('slotchange', () => this.handleSlotChange());
  }

  /**
   * item 수집 (ui-log-item만)
   */
  private items(): HTMLElement[] {
    return Array.from(this.children).filter(
      (c): c is HTMLElement => c.tagName.toLowerCase() === 'ui-log-item',
    );
  }

  /**
   * 최대 개수 초과 시 오래된 항목 제거 + 스티키 바텀
   */
  private handleSlotChange(): void {
    const box = this.root.querySelector('.viewport') as HTMLElement | null;
    const wasAtBottom = box ? box.scrollHeight - box.scrollTop - box.clientHeight < 40 : true;

    const list = this.items();
    const excess = list.length - this.max;
    for (let i = 0; i < excess; i++) list[i]?.remove();

    if (box && (wasAtBottom || this.autoScroll)) {
      box.scrollTop = box.scrollHeight;
    }
    this.updateEmpty();
    this.updateCount();
  }

  private updateEmpty(): void {
    const el = this.root.querySelector('.empty');
    if (el) el.setAttribute('aria-hidden', this.items().length > 0 ? 'true' : 'false');
  }

  /** 맨 아래로 강제 스크롤 */
  public scrollDown(): void {
    const box = this.root.querySelector('.viewport') as HTMLElement | null;
    if (box) box.scrollTop = box.scrollHeight;
  }

  /** 프로그래매틱 로그 추가 */
  public push(level: string, message: string, time?: string): void {
    const item = document.createElement('ui-log-item');
    item.setAttribute('level', level);
    if (time) item.setAttribute('time', time);
    item.textContent = message;
    this.appendChild(item);
  }

  /** 전체 비우기 */
  public clear(): void {
    this.items().forEach((i) => i.remove());
    this.updateEmpty();
  }

  protected render(): void {
    const label = this.label;
    const heightStyle = `height: ${this.height.replace(/["<>]/g, '')};`;
    const emptyText = this.escapeHtml(this.emptyText);

    this.root.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--ui-font-family-base, sans-serif);
          white-space: ${this.wrap ? 'pre-wrap' : 'nowrap'};
          box-sizing: border-box;
        }
        .log {
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #dee2e6);
          border-radius: var(--ui-radius-md, 12px);
          background-color: var(--ui-color-bg-canvas, #ffffff);
          overflow: hidden;
        }
        .head {
          display: flex;
          align-items: center;
          gap: var(--ui-space-2, 8px);
          padding: var(--ui-space-2, 8px) var(--ui-space-3, 12px);
          border-bottom: var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #dee2e6);
          background-color: var(--ui-color-bg-subtle, #fafafa);
          font-size: var(--ui-font-size-xs, 12px);
          color: var(--ui-color-text-secondary, #495057);
        }
        .head .bar {
          width: 8px; height: 8px; border-radius: var(--ui-radius-full, 9999px);
          background: var(--ui-color-primary, #ff5500);
        }
        .label {
          font-weight: var(--ui-font-weight-semibold, 600);
          color: var(--ui-color-text-primary, #000000);
        }
        .count { color: var(--ui-color-text-muted, #9e9e9e); }
        .spacer { flex: 1; }
        .copy-btn {
          all: unset;
          cursor: pointer;
          padding: 2px var(--ui-space-2, 8px);
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #dee2e6);
          border-radius: var(--ui-radius-full, 9999px);
          font-size: var(--ui-font-size-xs, 12px);
          color: var(--ui-color-text-secondary, #495057);
          background-color: var(--ui-color-bg-surface, #ffffff);
          transition: border-color var(--ui-transition-fast, 120ms), color var(--ui-transition-fast, 120ms);
        }
        .copy-btn:hover { border-color: var(--ui-color-primary, #ff5500); color: var(--ui-color-primary, #ff5500); }
        .copy-btn:focus-visible { box-shadow: 0 0 0 2px var(--ui-color-focus-ring, #ff5500); }
        .viewport {
          overflow: auto;
          ${heightStyle}
          padding: var(--ui-space-3, 12px) var(--ui-space-4, 16px);
        }
        .empty {
          color: var(--ui-color-text-muted, #9e9e9e);
          font-size: var(--ui-font-size-sm, 14px);
          text-align: center;
          padding: var(--ui-space-6, 24px) 0;
          white-space: normal;
        }
        .empty[aria-hidden="true"] { display: none; }
      </style>
      <div class="log" role="log" aria-label="${this.escapeHtml(label || '로그')}" aria-live="polite">
        <div class="head">
          <span class="bar" aria-hidden="true"></span>
          <span class="label">${this.escapeHtml(label || '로그')}</span>
          <span class="count"></span>
          <span class="spacer"></span>
          <button class="copy-btn" title="전체 복사">복사</button>
        </div>
        <div class="viewport">
          <slot></slot>
          <div class="empty">${emptyText}</div>
        </div>
      </div>
    `;

    this.root.querySelector('.copy-btn')?.addEventListener('click', () => {
      const text = this.items().map((i) => i.textContent ?? '').join('\n');
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).catch(() => undefined);
      }
      const btn = this.root.querySelector('.copy-btn');
      if (btn) {
        btn.textContent = '복사됨';
        window.setTimeout(() => {
          btn.textContent = '복사';
        }, 1400);
      }
      this.emit('copy', { text });
    });

    /* 초기 렌더 동기화 */
    this.updateCount();
    this.updateEmpty();
  }

  private updateCount(): void {
    const el = this.root.querySelector('.count');
    if (el) el.textContent = this.items().length > 0 ? `${this.items().length}건` : '';
  }
}

if (!customElements.get('ui-log')) {
  customElements.define('ui-log', UILog);
}
