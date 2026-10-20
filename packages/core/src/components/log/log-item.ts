import { UIElement } from '../../base/ui-element';

/**
 * <ui-log-item> — 로그 1행
 *
 * <ui-log> 안에서 사용. level에 따라 좌측 마커/텍스트 색이 결정된다.
 *
 * 속성:
 *   level : 'info' | 'success' | 'warning' | 'error' | 'debug' (기본 info)
 *   time  : 타임스탬프 문자열 (예: '19:39:23') — 생략 가능
 */
export class UILogItem extends UIElement {
  static get observedAttributes(): string[] {
    return ['level', 'time'];
  }

  get level(): string {
    const v = this.getAttribute('level') || 'info';
    return ['info', 'success', 'warning', 'error', 'debug'].includes(v) ? v : 'info';
  }

  get time(): string {
    return this.getAttribute('time') || '';
  }

  protected render(): void {
    const time = this.time;

    this.root.innerHTML = `
      <style>
        :host {
          display: flex;
          gap: var(--ui-space-2, 8px);
          align-items: center;
          padding: var(--ui-space-1, 4px) 0;
          font-family: var(--ui-font-family-mono, monospace);
          font-size: var(--ui-font-size-xs, 12px);
          line-height: var(--ui-line-height-normal, 1.5);
        }
        .marker {
          flex: none;
          width: 6px;
          height: 6px;
          border-radius: var(--ui-radius-full, 9999px);
          background: var(--ui-color-border-strong, #9e9e9e);
        }
        :host([level="success"]) .marker { background: var(--ui-color-success, #4ade80); }
        :host([level="warning"]) .marker { background: var(--ui-color-warning, #fbbf24); }
        :host([level="error"])   .marker { background: var(--ui-color-error, #f87171); }
        :host([level="debug"])   .marker { background: var(--ui-color-text-muted, #9e9e9e); }
        .time {
          flex: none;
          color: var(--ui-color-text-muted, #9e9e9e);
          user-select: text;
        }
        .msg {
          flex: 1;
          min-width: 0;
          color: var(--ui-color-text-primary, #000000);
          white-space: inherit; /* ui-log의 nowrap/pre-wrap 상속 */
          user-select: text;
        }
        :host([level="success"]) .msg { color: var(--ui-color-success, #4ade80); }
        :host([level="warning"]) .msg { color: var(--ui-color-warning, #fbbf24); }
        :host([level="error"])   .msg { color: var(--ui-color-error, #f87171); }
        :host([level="debug"])   .msg { color: var(--ui-color-text-muted, #9e9e9e); }
      </style>
      <span class="marker" aria-hidden="true"></span>
      ${time ? `<span class="time">${this.escapeHtml(time)}</span>` : ''}
      <span class="msg"><slot></slot></span>
    `;
  }
}

if (!customElements.get('ui-log-item')) {
  customElements.define('ui-log-item', UILogItem);
}
