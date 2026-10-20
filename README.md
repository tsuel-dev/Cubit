# Cubit UI — Design System & Component Library

[한국어](README.md) | [English](README.en.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [Español](README.es.md) | [Português](README.pt.md)

> **언어 안내:** 이 한국어 README가 기준 문서입니다. 다른 언어의 README는 참고용 번역이며, 내용이 다르거나 번역이 부정확할 경우 한국어 README를 우선합니다.

> **자체 디자인 토큰 시스템을 기준으로 한 표준화 및 크로스 프레임워크 일관된 UX 제공**

Cubit UI는 단단하고 신뢰감 있는 기하학적 미학(**Cubit · Minimal**: 라운드 토큰(8/12/16px + Pill), 4px/8px Spacing, 선명한 테두리 대비)을 기반으로 한 표준 UI 컴포넌트 라이브러리입니다.

핵심 컴포넌트를 표준 **Web Components(Custom Elements + Scoped Shadow DOM)**로 1회 구현하고, **React** 및 **Svelte** 래퍼를 1:1로 제공하여 프레임워크에 구애받지 않고 완전히 동일한 디자인 토큰과 API 계약을 유지합니다.

---

## 0. 빠른 시작

```bash
git clone https://github.com/tsuel-dev/Cubit.git
cd Cubit
pnpm install
pnpm run build
```

---

## 1. 아키텍처 및 패키지 구성

```text
packages/
├── tokens/   # 원시 토큰, 시맨틱 토큰, 라이트/다크 테마 및 CSS 변수 생성기
├── core/     # 30종 Web Components 본체 (외부 UI 의존성 Zero, WCAG 2.1 AA)
├── react/    # React 18/19 래퍼 (forwardRef, 타입 세이프 Props, 이벤트 매핑)
└── svelte/   # Svelte 4/5 래퍼 (반응형 바인딩, 슬롯 포워딩, 커스텀 이벤트)

examples/
├── vanilla/  # 순수 HTML + Web Components 쇼케이스
├── react/    # React TSX 쇼케이스
└── svelte/   # Svelte 쇼케이스
```

---

## 2. 디자인 토큰 사양 (불변 기준값 준수)

- **색상 기준**:
  - 기본 배경 / 전경: `White (#ffffff)` / `Black (#000000)`
  - 강조색 (Primary / Accent): `#ff5500`
  - 보조·배경용 (Secondary): `#ffebcc`, `#ffe4c9`
  - 다크 모드: Black (`#000000`) 및 심도별 Dark Gray 배경과 고대비 보정(#ff5500 가독성 유지, WCAG 2.1 AA 4.5:1 이상 대비 보장)
- **미학 (Cubit · Minimal)**:
  - 코너 둥글기 토큰: `--ui-radius-sm: 8px` (버튼·카드 등 일반 컨트롤) / `--ui-radius-md: 12px` (컨테이너) / `--ui-radius-lg: 16px` (모달·대형 패널) / `--ui-radius-full: 9999px` (배지·스위치 트랙 등 pill)
  - 간격 스케일: `4px / 8px` 기반 토큰
  - 테두리: 선명한 테두리 및 계층 분리 (불필요한 그림자 배제)
- **타이포그래피**:
  - 외부 폰트 다운로드 없이 OS 네이티브 **시스템 폰트 스택** 사용

---

## 3. 설치 및 사용법 (로컬 워크스페이스 기준)

모노레포 내 또는 로컬 프로젝트에서 패키지를 참조하여 사용할 수 있습니다.

### 3.1. 디자인 토큰 스타일시트 로드 (공통 필수)
프로젝트 엔트리포인트(HTML 또는 루트 번들)에 토큰 CSS를 포함합니다:
```html
<!-- HTML에서 로드 시 -->
<link rel="stylesheet" href="./packages/tokens/dist/css/tokens.css" />
<link rel="stylesheet" href="./packages/tokens/dist/css/dark.css" />
```
```ts
// JS/TS 번들러(Vite, Webpack 등)에서 import 시
import '@cubit-ui/tokens/css/tokens.css';
import '@cubit-ui/tokens/css/dark.css';
```

### 3.2. Vanilla (Web Components)
```ts
import '@cubit-ui/core';
```
```html
<ui-button variant="primary" size="md">저장하기</ui-button>
<ui-input placeholder="이름을 입력하세요"></ui-input>
<ui-modal id="myModal" title="알림">
  <p>모달 내용입니다.</p>
  <div slot="footer">
    <ui-button variant="outline" onclick="document.getElementById('myModal').open=false">닫기</ui-button>
  </div>
</ui-modal>
```

### 3.3. React
```tsx
import React, { useState } from 'react';
import { Button, Input, Modal, Alert } from '@cubit-ui/react';

export function MyComponent() {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState('');

  return (
    <div>
      <Alert variant="info" title="알림">React 컴포넌트가 정상 동작합니다.</Alert>
      <Input value={val} onChange={(detail) => setVal(detail.value)} placeholder="입력" />
      <Button variant="primary" onClick={() => setOpen(true)}>모달 열기</Button>
      
      <Modal open={open} title="확인" onClose={() => setOpen(false)}>
        <p>선택된 값: {val}</p>
        <div slot="footer">
          <Button variant="outline" onClick={() => setOpen(false)}>취소</Button>
        </div>
      </Modal>
    </div>
  );
}
```

### 3.4. Svelte
```svelte
<script lang="ts">
  import { Button, Input, Modal, Alert } from '@cubit-ui/svelte';

  let open = false;
  let text = '';

  function handleInputChange(e: CustomEvent<{ value: string }>) {
    text = e.detail.value;
  }
</script>

<Alert variant="success" title="Svelte 예제">Svelte 바인딩 예제입니다.</Alert>
<Input value={text} on:change={handleInputChange} placeholder="입력하세요" />
<Button variant="primary" on:click={() => open = true}>모달 열기</Button>

<Modal {open} title="Svelte 모달" on:close={() => open = false}>
  <p>입력된 텍스트: {text}</p>
  <div slot="footer">
    <Button variant="outline" on:click={() => open = false}>닫기</Button>
  </div>
</Modal>
```

---

## 4. 컴포넌트 30종 API 및 Props 명세 표

| 구분 | 컴포넌트 태그 / 이름 | 주요 Props / 속성 | 발화 이벤트 | 접근성 (ARIA / WCAG) |
| :--- | :--- | :--- | :--- | :--- |
| **기본 1** | `ui-button` / `Button` | `variant` (primary/secondary/outline/ghost/danger), `size` (sm/md/lg), `disabled`, `type` | `click` | `aria-disabled`, 고대비 포커스링 |
| **기본 2** | `ui-input` / `Input` | `value`, `placeholder`, `type`, `disabled`, `readonly`, `size`, `invalid` | `input`, `change` | `aria-invalid`, `aria-disabled` |
| **기본 3** | `ui-checkbox` / `Checkbox` | `checked`, `disabled`, `indeterminate`, `name`, `value` | `change` | `role="checkbox"`, `aria-checked`, Space 키 |
| **기본 4** | `ui-radio` / `Radio` | `checked`, `disabled`, `name`, `value` | `change` | `role="radio"`, 그룹 배타적 선택, Space 키 |
| **기본 5** | `ui-switch` / `Switch` | `checked`, `disabled` | `change` | `role="switch"`, `aria-checked`, pill 트랙 + 원형 썸 |
| **기본 6** | `ui-select` / `Select` | `value`, `placeholder`, `disabled`, `size`, `open` | `change`, `open`, `close` | `role="combobox"`, Esc 닫기, 외부 클릭 닫기 |
| **기본 7** | `ui-modal` / `Modal` | `open`, `title` | `close` | `role="dialog"`, `aria-modal`, 포커스 트랩, Esc 닫기 |
| **기본 8** | `ui-toast` / `Toast` | `variant` (info/success/warning/error), `duration`, `open` | `close` | `role="status"`, `aria-live="polite"`, 자동 소멸 타이머 |
| **기본 9** | `ui-tooltip` / `Tooltip` | `content`, `position` (top/bottom/left/right) | - | `role="tooltip"`, hover/focus 트리거, Esc 탈출 |
| **기본 10** | `ui-tabs` / `Tabs` | `value` | `change` | `role="tablist/tab/tabpanel"`, 화살표/Home/End 키 |
| **기본 11** | `ui-badge` / `Badge` | `variant` (primary/secondary/outline/success/warning/error), `size` | - | pill 라벨, 고대비 텍스트 |
| **기본 12** | `ui-spinner` / `Spinner` | `size` (sm/md/lg) | - | `role="status"`, `aria-label="Loading"` |
| **기본 13** | `ui-alert` / `Alert` | `variant` (info/success/warning/error), `title`, `closable` | `close` | `role="alert"`, 색상 대비 4.5:1 보장 |
| **확장 14** | `ui-card` / `Card` | `variant` (default/elevated/secondary/bordered), `bordered` | - | header, body, footer 슬롯 분리 |
| **확장 15** | `ui-accordion` / `Accordion` | `multiple` (`ui-accordion-item`: `open`, `title`, `disabled`) | `change`, `toggle-item` | `role="region"`, `aria-expanded`, Enter/Space |
| **확장 16** | `ui-dropdown` / `Dropdown` | `open`, `placement`, `disabled` | `open`, `close` | `role="menu"`, `role="menuitem"`, 외부 클릭 닫기 |
| **확장 17** | `ui-progress` / `Progress` | `value`, `max`, `size`, `variant` | - | `role="progressbar"`, `aria-valuenow/min/max` |
| **확장 18** | `ui-pagination` / `Pagination` | `current`, `total`, `page-size` | `change` | `role="navigation"`, `aria-current="page"`, 키보드 |
| **확장 19** | `ui-table` / `Table` | `striped`, `bordered`, `hoverable` | - | `role="table"`, 보조 배경색(`#ffe4c9`) 호버 |
| **확장 20** | `ui-avatar` / `Avatar` | `src`, `alt`, `name`, `size` (sm/md/lg), `shape` (circle/square) | - | 원형 기본, `shape="square"` 옵션, 이미지 실패 시 이니셜 폴백 |
| **확장 21** | `ui-breadcrumbs` / `Breadcrumbs` | `separator` (`ui-breadcrumb-item`: `href`, `current`) | - | `role="navigation"`, `aria-current="page"` |
| **확장 22** | `ui-drawer` / `Drawer` | `open`, `side` (left/right), `title` | `close` | 포커스 트랩, Esc/백드롭 닫기, 오프캔버스 |
| **확장 23** | `ui-skeleton` / `Skeleton` | `variant` (text/circle/rect), `width`, `height`, `lines` | - | `aria-hidden`, `prefers-reduced-motion`에서 shimmer 정지 |
| **확장 24** | `ui-navbar` / `Navbar` | `brand`, `sticky` | - | `role="navigation"`, default 링크 슬롯 + `actions` 슬롯 |
| **데이터 25** | `ui-log` / `Log` (+ `ui-log-item` / `LogItem`) | `label`, `height`, `wrap`, `auto-scroll`, `max`, `empty` (`ui-log-item`: `level`(info/success/warning/error/debug), `time`) | `copy` | `role="log"`, `aria-live="polite"`, 스티키 바텀, API: `push()` / `scrollDown()` / `clear()` |
| **신규 26** | `ui-textarea` / `Textarea` | `value`, `placeholder`, `rows`, `maxlength`, `resize` (none/vertical/both), `size`, `name`, `disabled`, `readonly`, `invalid` | `input`, `change` | `aria-invalid`, 폼 연동(`name`, reset, fieldset disabled), `maxlength` 지정 시 글자 수 표시 |
| **신규 27** | `ui-empty-state` / `EmptyState` | `heading`, `description`, `size` (sm/md), `variant` (default/error) | - | 제목은 `<h3>`, 장식 아이콘은 보조기기에서 숨김, 행동 슬롯 |
| **신규 28** | `ui-segmented` / `Segmented` | `value`, `size` (sm/md/lg), `disabled` (`ui-segment`: `value`, `disabled`) | `change` | `role="radiogroup"`/`role="radio"`, `aria-checked`, 화살표/Home/End 키(roving tabindex) |
| **신규 29** | `ui-stepper` / `Stepper` | `current`, `orientation` (horizontal/vertical) (`ui-step`: `label`, `description`, `status`) | - | `role="list"`/`listitem`, `aria-current="step"`, 단계 상태를 스크린리더에 전달 |
| **신규 30** | `ui-chip` / `Chip` | `variant` (neutral/primary/success/warning/error), `size` (sm/md), `removable`, `disabled`, `remove-label` | `remove` | 삭제 가능하면 포커스 가능, × 버튼에 `aria-label`, Delete/Backspace로 삭제 요청 |

> **폼 지원 (v1.1):** `ui-input`, `ui-textarea`, `ui-checkbox`, `ui-radio`, `ui-switch` 는 폼에 참여합니다: `name` 으로 제출되고 `<form>.reset()` 과 `<fieldset disabled>` 를 따릅니다.

---

## 5. 라이트 / 다크 모드 전환 가이드

라이브러리는 기본적으로 CSS 변수 기반 테마 시스템을 사용하므로, HTML 문서의 최상위 태그(`html` 또는 `body`)에 `data-theme` 속성을 지정하는 것만으로 모든 컴포넌트가 즉시 전환됩니다.

### 5.1. HTML 속성으로 직접 전환
```html
<!-- 라이트 모드 강제 -->
<html data-theme="light">

<!-- 다크 모드 강제 -->
<html data-theme="dark">

<!-- OS 테마 자동 감응 (data-theme 속성 제거 시 prefers-color-scheme 동작) -->
<html>
```

### 5.2. JS/TS 헬퍼 함수 사용
`@cubit-ui/tokens`에서 제공하는 런타임 헬퍼를 사용할 수 있습니다:
```ts
import { setTheme, getTheme } from '@cubit-ui/tokens';

// 다크 모드로 전환
setTheme('dark');

// 라이트 모드로 전환
setTheme('light');

// 시스템 설정으로 복원
setTheme('system');

// 현재 설정 확인
console.log(getTheme()); // 'light' | 'dark' | 'system'
```

---

## 6. 디자인 토큰 커스터마이징 방법

글로벌 CSS 또는 특정 컨테이너 스코프에서 CSS Custom Properties를 오버라이드하면, 하위 컴포넌트에 즉시 전파됩니다.

```css
/* 애플리케이션의 커스텀 브랜드 오버라이드 예시 */
:root {
  /* 프라이머리 컬러를 브랜드에 맞게 변경 */
  --ui-color-primary: #ff4500;
  --ui-color-primary-hover: #e03e00;
  
/* 기본 8px 버튼 라운드를 카드처럼 더 크게 */
  --ui-radius-sm: 12px;
  
  /* 기본 서체 스택 변경 */
  --ui-font-family-base: "Pretendard", -apple-system, BlinkMacSystemFont, sans-serif;
}
```

---

## 7. UX 표준 사용 지침 (실서비스 감사 기반 패턴)

실서비스 감사에서 반복적으로 발견된 문제 유형을 **컴포넌트 조합 표준 패턴**으로 정의합니다.
아래 4가지는 라이브러리 문서(`examples/vanilla` — UX Patterns 섹션)의 라이브 데모와 동일합니다.

### 7.1. 검색 상태 머신 — 로딩 / 성공 / 빈 결과 / 실패의 4상태 명시

**원칙**: 검색·조회는 4개 상태를 "항상 명시적으로" 렌더링합니다.
`슬로우 로딩 → 무한 로딩`(로딩 표시 누락), `실패 → 빈 결과로 은폐`, `빈 결과 → 빈 화면`은 모두 버그로 취급합니다.

- **로딩**: `ui-spinner size="sm"`을 결과 영역에 표시, 검색 버튼은 7.2 잠금 패턴 적용
- **빈 결과**: `ui-alert variant="warning"` + 다음 액션 안내("다른 검색어로 다시 시도")
- **실패**: `ui-alert variant="error"` + 재시도 방법까지 표시 (네트워크 문제라는 사실 버튼 라벨에 은폐 금지)
- 결과 영역 컨테이너는 `aria-live="polite"` 부여 (스크린리더가 갱신 전달)

```ts
// 표준 골격 (vanilla)
const box = document.getElementById('searchResults'); // aria-live="polite"
box.innerHTML = '';
button.disabled = true;           // 1) 즉시 잠금
box.appendChild(spinner);         // 2) 로딩 표시
const items = await fetch(...);   // 
if (items.length === 0) renderEmpty();   // 3) 빈 결과 = 경고 Alert
box.appendChild(resultRow);              // 4) 성공 = 실제 결과
button.disabled = false;          // 항상 원복
```

**안티패턴**: 결과 영역을 그대로 두고 토스트로만 끝내기 / 실패를 "완료" 배지로 표현하기.

### 7.2. 버튼 중복 클릭 잠금 — busy 가드 + 실패 후 재시도 라벨

**원칙**: 처리 시간이 0.5초 이상이거나 중복 생성이 큰 작업의 버튼은 반드시 잠급니다.
잠금 없는 "무방비 버튼"은 더블클릭으로 중복 전송을 만듭니다.

- 처리 중: `disabled` 속성 + 라벨을 `"처리 중..."`으로 교체
- 실패 시: 라벨을 `"다시 시도"`로 복귀 + `ui-toast variant="error"`로 원인 표시 (2초 후 원래 라벨 복원)
- 성공 시: 원래 라벨 복원 + `ui-toast variant="success"`로 결과 피드백

```ts
async function withButtonLock(button, busyLabel, action, failLabel = '다시 시도') {
  if (button.dataset.busy === '1') return;   // 중복 클릭 가드
  const original = button.textContent;
  button.dataset.busy = '1';
  button.setAttribute('disabled', '');
  button.textContent = busyLabel;
  try {
    await action();
    button.textContent = original;
  } catch (err) {
    button.textContent = failLabel;
    showToast(err.message, 'error');
    setTimeout(() => { button.textContent = original; }, 2200);
  } finally {
    button.removeAttribute('disabled');
    delete button.dataset.busy;
  }
}
```

**안티패턴**: 클릭 타임아웃 없이 `await` 할 것(사용자가 재클릭할 수 있음) / 실패를 무음으로 복귀시키기.

### 7.3. 실시간 상태 칩 — 배지 값은 "실제 값"에서 유래

**원칙**: 서버/서비스 상태 칩(`ui-badge`)의 `variant`와 텍스트는 반드시 최신 상태 값에서
따라와야 합니다. 라벨만 바뀌고 색이 고정되거나, 값 없이 늘 "정상" 표시를 유지하는 것은 **거짓 표시**입니다.

- 갱신 시작: 항목 옆 `ui-spinner size="sm"` 노출 (갱신 중임을 알림)
- 값 도착: `badge.setAttribute('variant', 상태에 맞는 variant)` + 텍스트 교체 — 동기 갱신
- 마지막 확인 시각을 항상 병기 (`"마지막 확인: 19:39:23"`) — 신선도를 사용자가 직접 판단하도록
- 서로 다른 상태 → `success`(정상) / `warning`(지연·보류) / `outline`(대기) 구분

```html
<ui-badge id="stateChip" variant="outline">대기 중</ui-badge>
<ui-spinner size="sm" id="stateSpinner" style="visibility: hidden;"></ui-spinner>
마지막 확인: <span id="stateUpdated">—</span>
```

**안티패턴**: 한 번 "정상"이라고 칩을 채우고 영구 고정 / 실패 상태인데 성공 배지 유지.

### 7.4. 로그·장문 텍스트 — `<pre>` 낙서 대신 `ui-log`

**원칙**: 서버 로그, 작업 이력, 실행 결과처럼 계속 늘어나는 장문 텍스트는 `ui-log`로 표준화합니다.

- 접근성 내장: `role="log"` + `aria-live="polite"` (직접 지정 불필요)
- 스티키 바텀: 사용자가 위에서 읽는 중이면 새 항목이 와도 강제 스크롤하지 않음, 바닥 근처일 때만 따라감
- 용량 보호: `max` 초과 시 오래된 항목부터 자동 제거(기본 500) — DOM 무한 성장 방지
- 레벨 색 `level="info/success/warning/error/debug"`, `time` 타임스탬프, 헤더 복사 버튼 + `copy` 이벤트 내장
- 장문 줄바꿈은 `wrap`, 표준 로그처럼 가로 스크롤이 기본

```html
<ui-log label="gateway.log" height="240px">
  <ui-log-item level="info" time="19:31:02">GET /healthz — 204 · 3ms</ui-log-item>
  <ui-log-item level="error" time="19:33:12">SSH 점검 실패 — 경로 파싱 오류</ui-log-item>
</ui-log>
```

```ts
// 스트리밍 (vanilla)
const log = document.getElementById('myLog');      // ui-log 요소
log.push('success', '배포 완료 (v2.4.1)', stamp()); // push API
log.push('warning', '디스크 82% — 임계치 초과');
log.clear();                                       // 전체 비우기
```

**안티패턴**: 그냥 `div.appendChild(p)`로 쌓기(읽던 위치 붕괴, 무한 성장) / 색 대비를 각자 조합(레벨 색 토큰 미신용).

---

## 8. 배포 준비 상태 안내 (CI & Publish)

- **GitHub Actions CI (`.github/workflows/ci.yml`)**:
  - `pnpm install` → `eslint` → `vite build` → `tsc (typecheck)` 전체 파이프라인 자동화 구성 완료.
- **npm 배포 및 GitHub 릴리즈**:
  - 모든 패키지(`tokens`, `core`, `react`, `svelte`)는 `package.json`에 `main`, `module`, `types`, `exports`, `files` 명세가 완성형으로 세팅되어 있습니다.
  - **실제 `npm publish`는 관리자가 필요 시 수행**합니다. (자동 배포 미실행)

---

## 라이선스 / License

Cubit UI는 **TLL-BY-NC-ND** ([Tsuel Liberty License](https://tll.mataku.org))로 제공됩니다. 한국어 문구가 기준이며, 다른 언어와 다르면 한국어가 우선합니다.

- 라이선스 전문: [`LICENSE`](./LICENSE)
- [라이선스 상세 링크 (쉬운 설명·조건 확인)](https://tll.mataku.org/?lang=ko#/detail?by=1&attr=tsuel%28%40tsuel-dev%29&cm=titleNameLink&sa=0&nc=1&nd=1&reg_e=1&reg_m=forbid&reg_l=RU%2CCN%2CKP&ad=none&ai=deny)
- TLL 소개 및 생성기: <https://tll.mataku.org>

| 조건 | 내용 |
|---|---|
| BY | 저작자 `tsuel(@tsuel-dev)`를 **저작물 제목 + 이름 + 링크**로 표시해야 합니다 |
| NC | 영리 목적 이용 금지 |
| ND | 수정·2차 저작물 제작 금지 |
| 지역 | 러시아·중국·북한에서는 이용 금지 |
| AI | 인공지능·기계학습 모델의 학습 데이터로 사용 금지 |

- 이 라이선스는 크리에이티브 커먼즈 라이선스가 **아니며**, 오픈소스(OSI) 정의를 충족하지 않습니다.
- 이 문서는 법적 효력에 대해 전문가(변호사) 검토가 필요하며, 자동 생성된 문구는 법률 자문이 아닙니다.

---

## 연락처 / Contact

법적 요청, 라이선스·저작권 문의, 보안 취약점 제보, 또는 개발자 간 협의가 필요한 경우 아래 주소로 연락해 주세요.

If you need to reach the maintainers for any legal, licensing, security or other obligation, or for coordination between developers, please contact:

**github@mataku.org**
