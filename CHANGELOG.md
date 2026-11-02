# Changelog / 변경 이력

> 한국어 요약이 기준입니다. If an English line differs from the Korean one, the Korean text prevails.

## Unreleased

- 수정: `ui-input`/`ui-textarea` 의 기본 `input` 이벤트가 shadow 밖으로 새어 React/Svelte 래퍼 핸들러가 `{value}` 대신 `Event` 를 받던 문제. 래퍼도 `CustomEvent` 만 처리. / Fix: native `input` event leaked out of the shadow root, so wrapper handlers received an `Event` instead of `{value}`.
- 추가: `ui-input` Enter 암묵 폼 제출(IME 조합 중 제외), 제약 검증(`required`/`pattern`/`maxlength` …)을 폼 검증에 연결, `autocomplete`·`inputmode`·`enterkeyhint`·`maxlength`·`minlength`·`required`·`pattern`·`min`·`max`·`step` 속성. / Added: implicit form submit on Enter, constraint validation wired into forms, and passthrough attributes.
- 개선: `ui-input` 속성 변경(`aria-label`·`placeholder`·`invalid`·`disabled` 등)이 포커스·IME 조합을 끊지 않도록 제자리 갱신. / Improved: in-place attribute updates keep focus and IME composition.
- 개선: `FocusTrap` 이 shadow DOM 과 `<slot>` 콘텐츠를 탐색, `position: fixed` 요소 처리, 닫을 때 이전 포커스 복원. `ui-modal`/`ui-drawer` 열림 중 배경 스크롤 잠금, `ui-drawer` 포커스 트랩 추가. / Improved: shadow/slot-aware focus trap with focus restore; scroll lock for modal and drawer; drawer now traps focus.
- 추가: `ui-select` 방향키·Home/End·Enter/Space·타입어헤드·Tab 닫기와 `aria-selected`, `ui-dropdown` 방향키·Home/End·Esc 포커스 복귀·트리거 `aria-expanded`, `ui-radio` 방향키 이동(roving tabindex). / Added: keyboard support for select, dropdown, and radio.
- 개선: `prefers-reduced-motion` 에서 전환 토큰을 0 으로, 드로어 애니메이션 해제. / Improved: reduced-motion support.

## 3.0.0

- Cubit UI 최초 공개 버전. 30종 웹 컴포넌트(`@cubit-ui/core`), 디자인 토큰(`@cubit-ui/tokens`), React·Svelte 래퍼. / First public release: 30 web components, design tokens, and React and Svelte wrappers.
- 라이선스: **TLL-BY-NC-ND** (`LICENSE`). / License: **TLL-BY-NC-ND** (`LICENSE`).
