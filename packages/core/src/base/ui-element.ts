/**
 * UIElement: Cubit UI Web Components Base Class
 * Shadow DOM 생성, 속성 감시, 렌더링 라이프사이클 및 커스텀 이벤트 헬퍼
 */

const reflectedClasses = new WeakSet<object>();

function toKebab(name: string): string {
  return name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

/**
 * React 19 와 Svelte 는 커스텀 엘리먼트에 `prop in element` 이면 속성 대신 프로퍼티로 값을 대입한다.
 * `size`·`variant` 처럼 getter 만 있는 접근자에 대입하면 TypeError 로 렌더링이 중단되므로,
 * 관찰 속성과 이름이 같은 getter 전용 접근자에는 속성으로 반영하는 setter 를 자동으로 붙인다.
 * (값이 null/undefined/false 이면 속성 제거, true 이면 빈 속성, 그 외에는 문자열로 저장)
 */
function reflectReadonlyAccessors(ctor: typeof UIElement): void {
  if (reflectedClasses.has(ctor)) return;
  reflectedClasses.add(ctor);
  const observed = new Set((ctor as unknown as { observedAttributes?: string[] }).observedAttributes ?? []);
  for (let proto = ctor.prototype; proto && proto !== UIElement.prototype; proto = Object.getPrototypeOf(proto)) {
    for (const prop of Object.getOwnPropertyNames(proto)) {
      const attribute = toKebab(prop);
      if (!observed.has(attribute)) continue;
      const descriptor = Object.getOwnPropertyDescriptor(proto, prop);
      if (!descriptor || !descriptor.get || descriptor.set) continue;
      Object.defineProperty(proto, prop, {
        ...descriptor,
        set(this: HTMLElement, value: unknown) {
          if (value === null || value === undefined || value === false) this.removeAttribute(attribute);
          else this.setAttribute(attribute, value === true ? '' : String(value));
        },
      });
    }
  }
}

export abstract class UIElement extends HTMLElement {
  /** 폼 참여(name/value 제출, reset, fieldset disabled)가 필요한 컴포넌트는 true 로 오버라이드 */
  static formAssociated = false;

  protected root: ShadowRoot;
  protected internals: ElementInternals | null = null;
  /** 상위 <fieldset disabled> 등 폼이 부여한 비활성 상태 (속성 disabled 와 별개) */
  protected formDisabled = false;
  private lifecycleAbort: AbortController | null = null;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    reflectReadonlyAccessors(this.constructor as typeof UIElement);
    if ((this.constructor as typeof UIElement).formAssociated && typeof this.attachInternals === 'function') {
      try {
        this.internals = this.attachInternals();
      } catch {
        this.internals = null; // 일부 환경(구형 브라우저·테스트 DOM)에서는 미지원
      }
    }
  }

  /** 폼 제출 값 설정. null 이면 제출에서 제외된다. */
  protected setFormValue(value: string | null): void {
    this.internals?.setFormValue(value);
  }

  /** <fieldset disabled> 등으로 폼이 비활성/활성 상태를 바꿀 때 브라우저가 호출한다. */
  formDisabledCallback(disabled: boolean): void {
    this.formDisabled = disabled;
    this.render();
  }

  connectedCallback(): void {
    // 재연결(DOM 이동) 때 호스트 리스너가 중복 등록되지 않도록 수명주기마다 새 컨트롤러를 쓴다.
    this.lifecycleAbort?.abort();
    this.lifecycleAbort = new AbortController();
    this.render();
  }

  disconnectedCallback(): void {
    // 서브클래스에서 오버라이드하는 경우 super.disconnectedCallback() 호출 필수
    this.lifecycleAbort?.abort();
    this.lifecycleAbort = null;
  }

  /**
   * 호스트(this)에 이벤트 리스너를 등록한다. disconnect 시 자동 해제되고
   * 다시 connect 되면 connectedCallback 에서 새로 등록하므로 중복되지 않는다.
   */
  protected listen<K extends keyof HTMLElementEventMap>(
    type: K,
    handler: (event: HTMLElementEventMap[K]) => void,
  ): void;
  protected listen(type: string, handler: EventListener): void;
  protected listen(type: string, handler: EventListener): void {
    this.addEventListener(type, handler, { signal: this.lifecycleAbort?.signal });
  }

  /**
   * HTML 템플릿에 삽입되는 속성/텍스트 값 이스케이프 (속성 주입·XSS 방지)
   */
  protected escapeHtml(value: unknown): string {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * href/src 용: javascript:, data:, vbscript: 스킴은 차단하고 이스케이프한다.
   */
  protected safeUrl(value: string): string {
    const v = value.trim();
    // eslint-disable-next-line no-control-regex
    const scheme = v.replace(/[\u0000-\u0020]/g, '').match(/^([a-z][a-z0-9+.-]*):/i);
    if (scheme && !['http', 'https', 'mailto', 'tel'].includes((scheme[1] ?? '').toLowerCase())) return '';
    return this.escapeHtml(v);
  }

  attributeChangedCallback(
    _name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  /**
   * shadow 경계를 넘어 bubbling된 클릭 등의 이벤트에서 실제 클릭 지점 원소를 얻는다.
   * (e.target은 shadow를 지나며 호스트로 retarget되므로 내부 클릭 판별에 쓸 수 없다)
   */
  protected composedTarget(event: Event): HTMLElement {
    const path = event.composedPath();
    for (const node of path) {
      if (node instanceof HTMLElement) return node;
    }
    return event.target as HTMLElement;
  }

  /**
   * 커스텀 이벤트 발화 (bubbles: true, composed: true)
   */
  protected emit<T = unknown>(name: string, detail?: T): boolean {
    const event = new CustomEvent<T>(name, {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail,
    });
    return this.dispatchEvent(event);
  }

  /**
   * 불리언 속성 헬퍼
   */
  protected getBooleanAttr(name: string): boolean {
    return this.hasAttribute(name);
  }

  protected setBooleanAttr(name: string, value: boolean): void {
    if (value) {
      this.setAttribute(name, '');
    } else {
      this.removeAttribute(name);
    }
  }

  /**
   * 렌더링 템플릿 반환
   */
  protected abstract render(): void;
}
