import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import '@cubit-ui/core';

export interface EventMapping {
  [propName: string]: string; // e.g. onChange: 'change'
}

export function createComponent<P extends Record<string, any>, E extends HTMLElement>(
  tagName: string,
  eventMap: EventMapping = {},
) {
  const Component = forwardRef<E, P>((props, ref) => {
    const elementRef = useRef<E | null>(null);

    useImperativeHandle(ref, () => elementRef.current as E);

    // Event listener registration
    useEffect(() => {
      const el = elementRef.current;
      if (!el) return;

      const cleanups: Array<() => void> = [];

      Object.entries(props).forEach(([propName, handler]) => {
        if (typeof handler !== 'function') return;
        // 명시적 eventMap 우선, 없으면 onXxx → xxx 규칙(첫 글자 소문자)으로 자동 매핑
        const mappedEvent = eventMap[propName];
        const eventName = mappedEvent
          ?? (propName.startsWith('on') && propName.length > 2
            ? propName.charAt(2).toLowerCase() + propName.slice(3)
            : undefined);
        if (!eventName) return;
        const listener = (event: Event) => {
          // 컴포넌트 고유 이벤트(change/close/open/…)는 자식 컴포넌트에서도 버블링되어 올라온다.
          // 예: <Tabs> 안의 <Pagination> 의 change 가 Tabs 의 onChange 로 새지 않도록 자기 자신이 발화한 이벤트만 처리한다.
          if (mappedEvent && event.target !== el) return;
          const customEvent = event as CustomEvent;
          handler(customEvent.detail !== undefined ? customEvent.detail : event);
        };
        el.addEventListener(eventName, listener);
        cleanups.push(() => el.removeEventListener(eventName, listener));
      });

      return () => {
        cleanups.forEach((cleanup) => cleanup());
      };
    }, [props]);

    // Separate attribute props from event handlers and children
    const domProps: Record<string, any> = {};
    const { children, className, style, id, ...rest } = props;

    if (className) domProps.class = className;
    if (style) domProps.style = style;
    if (id) domProps.id = id;

    Object.entries(rest).forEach(([key, value]) => {
      if (typeof value === 'function') return; // 함수는 이벤트 리스너로만 연결
      if (typeof value === 'boolean') {
        // true 는 boolean 그대로 넘긴다. React 19 는 프로퍼티로 대입하므로 ''(falsy)를 주면 open/disabled 등이 꺼진다.
        // React 18(속성 경로)에서도 존재 여부로 판정하는 getBooleanAttr 에는 문제가 없다. false 는 생략한다.
        if (value) domProps[key] = true;
      } else if (value !== undefined && value !== null) {
        domProps[key] = String(value);
      }
    });

    return React.createElement(tagName, { ref: elementRef, ...domProps }, children);
  });

  Component.displayName = `Cubit(${tagName})`;
  return Component;
}
