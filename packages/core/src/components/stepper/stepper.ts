import { UIElement } from '../../base/ui-element';

/**
 * ui-stepper / ui-step — 단계 진행 표시(설정 마법사, 체크아웃 등).
 *
 * <ui-stepper current="1">
 *   <ui-step label="계정" description="이메일 입력"></ui-step>
 *   <ui-step label="서버" description="IMAP/SMTP"></ui-step>
 *   <ui-step label="완료"></ui-step>
 * </ui-stepper>
 *
 * current(0부터) 앞의 단계는 done, current 는 active, 뒤는 pending.
 * 개별 단계에 status="error" 를 주면 오류 표시(done/active 보다 우선).
 */
export class UIStepper extends UIElement {
  static get observedAttributes(): string[] {
    return ['current', 'orientation', 'aria-label'];
  }

  get current(): number {
    const n = parseInt(this.getAttribute('current') || '0', 10);
    return Number.isFinite(n) ? n : 0;
  }

  set current(val: number) {
    this.setAttribute('current', String(val));
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'list');
    this.refresh();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    this.refresh();
  }

  /** 자식 ui-step 의 상태·번호·마지막 여부를 갱신 (자식이 속성 변경 시에도 호출) */
  refresh(): void {
    const steps = Array.from(this.querySelectorAll<UIStep>('ui-step'));
    const cur = this.current;
    steps.forEach((step, i) => {
      const explicit = step.getAttribute('status');
      const state = explicit === 'error' ? 'error' : i < cur ? 'done' : i === cur ? 'active' : 'pending';
      step.setAttribute('data-state', state);
      step.setAttribute('data-index', String(i + 1));
      step.toggleAttribute('data-last', i === steps.length - 1);
      step.toggleAttribute('data-vertical', this.getAttribute('orientation') === 'vertical');
      if (state === 'active') step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });
  }

  protected render(): void {
    const vertical = this.getAttribute('orientation') === 'vertical';
    this.root.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: ${vertical ? 'column' : 'row'};
          align-items: ${vertical ? 'stretch' : 'flex-start'};
          gap: 0;
          font-family: var(--ui-font-family-base, sans-serif);
        }
      </style>
      <slot></slot>
    `;
    this.root.querySelector('slot')?.addEventListener('slotchange', () => this.refresh());
  }
}

export class UIStep extends UIElement {
  static get observedAttributes(): string[] {
    return ['label', 'description', 'status', 'data-state', 'data-index', 'data-last', 'data-vertical'];
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'listitem');
    (this.closest('ui-stepper') as UIStepper | null)?.refresh();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    // 사용자가 status/label 을 바꾼 경우 부모가 다시 계산하도록 알림 (data-* 는 부모가 쓴 값이라 제외)
    if (!name.startsWith('data-')) (this.closest('ui-stepper') as UIStepper | null)?.refresh();
  }

  protected render(): void {
    const state = this.getAttribute('data-state') || 'pending';
    const index = this.getAttribute('data-index') || '';
    const last = this.hasAttribute('data-last');
    const vertical = this.hasAttribute('data-vertical');
    const label = this.getAttribute('label') || '';
    const description = this.getAttribute('description') || '';
    const marker =
      state === 'done'
        ? '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        : state === 'error'
          ? '!'
          : this.escapeHtml(index);
    const stateText = { done: 'completed', active: 'current step', pending: 'upcoming', error: 'error' }[state] || '';

    this.root.innerHTML = `
      <style>
        :host {
          display: flex;
          flex: ${last || vertical ? '0 0 auto' : '1 1 0'};
          flex-direction: ${vertical ? 'row' : 'column'};
          min-width: 0;
          font-family: var(--ui-font-family-base, sans-serif);
        }
        .row { display: flex; align-items: center; gap: var(--ui-space-2, 8px); ${vertical ? 'flex-direction: column; align-items: center;' : ''} }
        .marker {
          flex: none;
          width: 28px; height: 28px;
          box-sizing: border-box;
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: var(--ui-radius-full, 9999px);
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-border-strong, #000000);
          background-color: var(--ui-color-bg-surface, #ffffff);
          color: var(--ui-color-text-secondary, #616161);
          font-size: var(--ui-font-size-xs, 12px);
          font-weight: var(--ui-font-weight-semibold, 600);
        }
        .done .marker { background-color: var(--ui-color-primary, #ff5500); border-color: var(--ui-color-primary, #ff5500); color: var(--ui-color-primary-contrast, #ffffff); }
        .active .marker { border-color: var(--ui-color-primary, #ff5500); color: var(--ui-color-primary, #ff5500); box-shadow: 0 0 0 3px var(--ui-color-primary-subtle, #fff3e6); }
        .error .marker { background-color: var(--ui-color-error, #d32f2f); border-color: var(--ui-color-error, #d32f2f); color: var(--ui-color-error-contrast, #ffffff); }
        .line {
          flex: 1 1 auto;
          ${vertical ? 'width: 2px; min-height: 20px; margin: 0 auto;' : 'height: 2px; min-width: 16px;'}
          background-color: var(--ui-color-border, #e0e0e0);
          ${last ? 'display: none;' : ''}
        }
        .done .line { background-color: var(--ui-color-primary, #ff5500); }
        .text { ${vertical ? 'margin-left: var(--ui-space-3, 12px); padding-bottom: var(--ui-space-4, 16px);' : 'margin-top: var(--ui-space-2, 8px); padding-right: var(--ui-space-2, 8px);'} min-width: 0; }
        .label { font-size: var(--ui-font-size-sm, 14px); font-weight: var(--ui-font-weight-medium, 500); color: var(--ui-color-text-primary, #000000); }
        .pending .label { color: var(--ui-color-text-secondary, #616161); }
        .error .label { color: var(--ui-color-error, #d32f2f); }
        .desc { font-size: var(--ui-font-size-xs, 12px); color: var(--ui-color-text-secondary, #616161); }
        .vh { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
        .wrap { display: flex; ${vertical ? 'flex-direction: row;' : 'flex-direction: column; flex: 1;'} }
        .vrail { display: flex; flex-direction: column; align-items: center; }
      </style>
      ${
        vertical
          ? `<div class="wrap ${state}">
               <div class="vrail"><span class="marker" aria-hidden="true">${marker}</span><span class="line"></span></div>
               <div class="text"><div class="label">${this.escapeHtml(label)}<span class="vh"> (${stateText})</span></div>${description ? `<div class="desc">${this.escapeHtml(description)}</div>` : ''}<slot></slot></div>
             </div>`
          : `<div class="wrap ${state}">
               <div class="row"><span class="marker" aria-hidden="true">${marker}</span><span class="line"></span></div>
               <div class="text"><div class="label">${this.escapeHtml(label)}<span class="vh"> (${stateText})</span></div>${description ? `<div class="desc">${this.escapeHtml(description)}</div>` : ''}<slot></slot></div>
             </div>`
      }
    `;
  }
}

if (!customElements.get('ui-stepper')) {
  customElements.define('ui-stepper', UIStepper);
}
if (!customElements.get('ui-step')) {
  customElements.define('ui-step', UIStep);
}
