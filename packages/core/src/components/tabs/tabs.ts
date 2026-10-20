import { UIElement } from '../../base/ui-element';

export class UITabs extends UIElement {
  static get observedAttributes(): string[] {
    return ['value'];
  }

  get value(): string {
    return this.getAttribute('value') || '';
  }

  set value(val: string) {
    this.setAttribute('value', val);
    this.syncTabsAndPanels();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.listen('click', this.handleClick.bind(this));
    this.listen('keydown', this.handleKeyDown.bind(this));
    // 초기 슬롯 로드 후 탭 동기화
    setTimeout(() => this.syncTabsAndPanels(), 0);
  }

  private handleClick(e: MouseEvent): void {
    const tab = (e.target as HTMLElement).closest('ui-tab');
    if (tab && !tab.hasAttribute('disabled')) {
      const val = tab.getAttribute('value') || '';
      this.value = val;
      this.emit('change', { value: val });
    }
  }

  private handleKeyDown(e: KeyboardEvent): void {
    const tabs = Array.from(this.querySelectorAll<UITab>('ui-tab:not([disabled])'));
    if (!tabs.length) return;

    const currentIndex = tabs.findIndex((t) => t.getAttribute('value') === this.value);
    let nextIndex = currentIndex;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = tabs.length - 1;
    }

    if (nextIndex !== currentIndex && tabs[nextIndex]) {
      const nextTab = tabs[nextIndex]!;
      const nextVal = nextTab.getAttribute('value') || '';
      this.value = nextVal;
      nextTab.focus();
      this.emit('change', { value: nextVal });
    }
  }

  private syncTabsAndPanels(): void {
    const activeVal = this.value;
    const tabs = Array.from(this.querySelectorAll('ui-tab'));
    const panels = Array.from(this.querySelectorAll('ui-tab-panel'));

    tabs.forEach((tab) => {
      const isActive = tab.getAttribute('value') === activeVal;
      tab.setAttribute('aria-selected', String(isActive));
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    panels.forEach((panel) => {
      const isActive = panel.getAttribute('value') === activeVal;
      if (isActive) {
        panel.removeAttribute('hidden');
        panel.setAttribute('tabindex', '0');
      } else {
        panel.setAttribute('hidden', '');
      }
    });
  }

  protected render(): void {
    this.root.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--ui-font-family-base, sans-serif);
        }
        .tablist-wrapper {
          display: flex;
          border-bottom: var(--ui-border-width-thin, 1px) solid var(--ui-color-border, #e0e0e0);
          gap: var(--ui-space-1, 4px);
        }
        .panels-wrapper {
          padding-top: var(--ui-space-4, 16px);
        }
      </style>
      <div class="tablist-wrapper" role="tablist">
        <slot name="tabs"></slot>
      </div>
      <div class="panels-wrapper">
        <slot></slot>
      </div>
    `;
  }
}

export class UITab extends HTMLElement {
  connectedCallback(): void {
    this.setAttribute('role', 'tab');
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '-1');
    }
    this.style.all = 'unset';
    this.style.display = 'inline-flex';
    this.style.alignItems = 'center';
    this.style.padding = '8px 16px';
    this.style.cursor = 'pointer';
    this.style.fontSize = 'var(--ui-font-size-sm, 14px)';
    this.style.fontWeight = 'var(--ui-font-weight-medium, 500)';
    this.style.borderBottom = '2px solid transparent';
    this.style.marginBottom = '-1px';
    this.style.userSelect = 'none';

    this.render();
  }

  static get observedAttributes(): string[] {
    return ['aria-selected', 'disabled'];
  }

  attributeChangedCallback(): void {
    this.render();
  }

  private render(): void {
    const isSelected = this.getAttribute('aria-selected') === 'true';
    const isDisabled = this.hasAttribute('disabled');

    this.style.color = isSelected
      ? 'var(--ui-color-primary, #ff5500)'
      : 'var(--ui-color-text-secondary, #616161)';
    this.style.borderBottomColor = isSelected ? 'var(--ui-color-primary, #ff5500)' : 'transparent';
    this.style.opacity = isDisabled ? '0.5' : '1';
    this.style.pointerEvents = isDisabled ? 'none' : 'auto';
  }
}

export class UITabPanel extends HTMLElement {
  connectedCallback(): void {
    this.setAttribute('role', 'tabpanel');
  }
}

if (!customElements.get('ui-tabs')) {
  customElements.define('ui-tabs', UITabs);
}
if (!customElements.get('ui-tab')) {
  customElements.define('ui-tab', UITab);
}
if (!customElements.get('ui-tab-panel')) {
  customElements.define('ui-tab-panel', UITabPanel);
}
