import { UIElement } from '../../base/ui-element';

export class UIRadio extends UIElement {
  static override formAssociated = true;
  private defaultChecked = false;

  static get observedAttributes(): string[] {
    return ['checked', 'disabled', 'name', 'value'];
  }

  get checked(): boolean {
    return this.getBooleanAttr('checked');
  }

  set checked(val: boolean) {
    this.setBooleanAttr('checked', val);
  }

  get disabled(): boolean {
    return this.getBooleanAttr('disabled') || this.formDisabled;
  }

  set disabled(val: boolean) {
    this.setBooleanAttr('disabled', val);
  }

  get name(): string {
    return this.getAttribute('name') || '';
  }

  get value(): string {
    return this.getAttribute('value') || '';
  }

  override connectedCallback(): void {
    this.defaultChecked = this.checked;
    super.connectedCallback();
    this.setAttribute('role', 'radio');
    this.setAttribute('tabindex', this.disabled ? '-1' : this.checked ? '0' : '-1');
    queueMicrotask(() => this.ensureTabStop());
    this.listen('click', this.handleClick.bind(this));
    this.listen('keydown', this.handleKeyDown.bind(this));
  }

  private handleClick(e: MouseEvent): void {
    if (this.disabled) {
      e.preventDefault();
      return;
    }
    this.select();
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (this.disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this.select();
      return;
    }
    const step = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (step === 0) return;
    // 같은 name 그룹에서 비활성 항목을 건너뛰어 순환 이동하고, 이동한 항목을 선택한다(네이티브 라디오와 동일).
    const group = this.group().filter((el) => !el.disabled);
    const index = group.indexOf(this);
    if (index < 0 || group.length < 2) return;
    e.preventDefault();
    const next = group[(index + step + group.length) % group.length];
    if (next) {
      next.focus();
      next.select();
    }
  }

  /** 그룹에 체크된 항목이 없으면 첫 활성 항목을 Tab 으로 들어갈 수 있게 한다. */
  private ensureTabStop(): void {
    const group = this.group();
    if (group.some((el) => el.checked && !el.disabled)) return;
    const first = group.find((el) => !el.disabled);
    group.forEach((el) => el.setAttribute('tabindex', el === first ? '0' : '-1'));
  }

  /** 같은 name 의 라디오들(name 이 없으면 자기 자신뿐). */
  private group(): UIRadio[] {
    const name = this.name;
    if (!name) return [this];
    const root = this.getRootNode() as Document | ShadowRoot;
    return Array.from(root.querySelectorAll(`ui-radio[name="${CSS.escape(name)}"]`)).filter(
      (el): el is UIRadio => el instanceof UIRadio,
    );
  }

  /** <form>.reset() 시 초기 상태로 복원 */
  formResetCallback(): void {
    this.checked = this.defaultChecked;
  }

  public select(): void {
    if (this.disabled || this.checked) return;

    // 형제 라디오 해제
    const name = this.name;
    if (name) {
      const root = this.getRootNode() as Document | ShadowRoot;
      const siblings = root.querySelectorAll(`ui-radio[name="${CSS.escape(name)}"]`);
      siblings.forEach((el) => {
        if (el !== this && el instanceof UIRadio) {
          el.checked = false;
          el.setAttribute('tabindex', '-1');
        }
      });
    }

    this.checked = true;
    this.setAttribute('tabindex', '0');
    this.setAttribute('aria-checked', 'true');
    this.emit('change', { value: this.value, checked: true });
  }

  protected render(): void {
    const checked = this.checked;
    const disabled = this.disabled;

    this.setFormValue(checked ? (this.getAttribute('value') ?? 'on') : null);
    this.setAttribute('aria-checked', String(checked));
    this.setAttribute('aria-disabled', String(disabled));

    this.paint(`
      <style>
        :host {
          display: inline-flex;
          align-items: center;
          gap: var(--ui-space-2, 8px);
          font-family: var(--ui-font-family-base, sans-serif);
          font-size: var(--ui-font-size-sm, 14px);
          color: var(--ui-color-text-primary, #000000);
          cursor: pointer;
          user-select: none;
          outline: none;
        }
        :host([disabled]) {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }
        .outer {
          width: 16px;
          height: 16px;
          box-sizing: border-box;
          border: var(--ui-border-width-thin, 1px) solid var(--ui-color-border-strong, #000000);
          border-radius: var(--ui-radius-sm, 1px); /* Cubit Minimal 철학 반영 사각형 */
          background-color: var(--ui-color-bg-surface, #ffffff);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: border-color var(--ui-transition-fast);
        }
        :host(:focus-visible) .outer {
          box-shadow: 0 0 0 2px var(--ui-color-bg-canvas, #ffffff), 0 0 0 4px var(--ui-color-focus-ring, #ff5500);
        }
        .outer.checked {
          border-color: var(--ui-color-primary, #ff5500);
          border-width: 2px;
        }
        .inner {
          display: none;
          width: 8px;
          height: 8px;
          background-color: var(--ui-color-primary, #ff5500);
        }
        .outer.checked .inner {
          display: block;
        }
        .label {
          line-height: var(--ui-line-height-normal, 1.5);
        }
      </style>
      <div class="outer ${checked ? 'checked' : ''}">
        <div class="inner"></div>
      </div>
      <span class="label"><slot></slot></span>
    `);
  }
}

if (!customElements.get('ui-radio')) {
  customElements.define('ui-radio', UIRadio);
}
