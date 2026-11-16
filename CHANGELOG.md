# Changelog / 변경 이력

> 한국어 요약이 기준입니다. If an English line differs from the Korean one, the Korean text prevails.

## Unreleased

- 개선: `ui-accordion` 헤더에 `aria-controls`/`aria-disabled`·패널 `aria-labelledby`, ↑/↓/Home/End 로 헤더 이동(비활성 건너뜀), 열고 닫아도 키보드 포커스 유지(재렌더 시 포커스가 사라지던 문제). / Improved: accordion ARIA wiring, arrow/Home/End navigation, focus kept across toggle.
- 개선: `ui-toast` 마우스·포커스 중 자동 닫힘 일시정지(WCAG 2.2.1), Esc 로 닫기, `error`/`warning` 은 `role=alert`(assertive). / Improved: toast pauses auto-dismiss on hover/focus, closes on Esc, urgent variants announced assertively.
- 변경: 라이선스를 새 TLL-BY-NC-ND 조건(식별 `422DF40527`)으로 교체. 저작자 표기 `tsuel`, 비영리 모델 학습만 허용, AI 입력·검색 수집 금지, 사전 통지, 영리 이용은 cubit@mataku.org 별도 허락, 지역(KP·CN·RU)별 조건, 준거법 KR. `LICENSE`·패키지 LICENSE·README 갱신. / Changed: license replaced with the new TLL-BY-NC-ND terms (fingerprint `422DF40527`).
- 추가: `ui-link` 하이퍼링크 컴포넌트(React `Link`, Svelte `Link`). `href`·`target`·`rel`·`variant`(primary/muted/inherit)·`underline`·`external`·`disabled`·`download`, 안전하지 않은 스킴은 비활성 텍스트로 렌더, `target="_blank"`/`external` 은 `rel="noopener noreferrer"` 자동. / Added: `ui-link` with safe-URL handling and automatic `rel`.
- 수정: `ui-input`/`ui-textarea` 의 기본 `input` 이벤트가 shadow 밖으로 새어 React/Svelte 래퍼 핸들러가 `{value}` 대신 `Event` 를 받던 문제. 래퍼도 `CustomEvent` 만 처리. / Fix: native `input` event leaked out of the shadow root, so wrapper handlers received an `Event` instead of `{value}`.
- 추가: `ui-input` Enter 암묵 폼 제출(IME 조합 중 제외), 제약 검증(`required`/`pattern`/`maxlength` …)을 폼 검증에 연결, `autocomplete`·`inputmode`·`enterkeyhint`·`maxlength`·`minlength`·`required`·`pattern`·`min`·`max`·`step` 속성. / Added: implicit form submit on Enter, constraint validation wired into forms, and passthrough attributes.
- 개선: `ui-input` 속성 변경(`aria-label`·`placeholder`·`invalid`·`disabled` 등)이 포커스·IME 조합을 끊지 않도록 제자리 갱신. / Improved: in-place attribute updates keep focus and IME composition.
- 개선: `FocusTrap` 이 shadow DOM 과 `<slot>` 콘텐츠를 탐색, `position: fixed` 요소 처리, 닫을 때 이전 포커스 복원. `ui-modal`/`ui-drawer` 열림 중 배경 스크롤 잠금, `ui-drawer` 포커스 트랩 추가. / Improved: shadow/slot-aware focus trap with focus restore; scroll lock for modal and drawer; drawer now traps focus.
- 추가: `ui-select` 방향키·Home/End·Enter/Space·타입어헤드·Tab 닫기와 `aria-selected`, `ui-dropdown` 방향키·Home/End·Esc 포커스 복귀·트리거 `aria-expanded`, `ui-radio` 방향키 이동(roving tabindex). / Added: keyboard support for select, dropdown, and radio.
- 개선: 같은 CSS 는 한 번만 파싱해 모든 인스턴스가 공유(constructable stylesheet, 미지원 환경은 기존 방식). `ui-tabs` 탭↔패널 `aria-controls`/`aria-labelledby`, `ui-tooltip` 설명 노출. / Improved: shared constructable stylesheets (with fallback); tab/panel ARIA relations; tooltip description.
- 개선: `prefers-reduced-motion` 에서 전환 토큰을 0 으로, 드로어 애니메이션 해제. / Improved: reduced-motion support.

## 3.0.0

- Cubit UI 최초 공개 버전. 30종 웹 컴포넌트(`@cubit-ui/core`), 디자인 토큰(`@cubit-ui/tokens`), React·Svelte 래퍼. / First public release: 30 web components, design tokens, and React and Svelte wrappers.
- 라이선스: **TLL-BY-NC-ND** (`LICENSE`). / License: **TLL-BY-NC-ND** (`LICENSE`).
