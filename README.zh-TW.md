# Cubit UI — Design System & Component Library

[한국어](README.md) | [English](README.en.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [Español](README.es.md) | [Português](README.pt.md)

> **語言說明:** 韓文 README ([README.md](README.md)) 始終具有優先效力。若本譯文的內容與韓文 README 不一致,或譯文不準確,一律以韓文 README 為準。

> **以自有設計權杖系統為基準,提供標準化以及跨框架一致的使用者體驗**

Cubit UI 是一套標準 UI 元件庫,以穩固、值得信賴的幾何美學為基礎(**Cubit · Minimal**:圓角權杖 (8/12/16px + Pill)、4px/8px 間距、清晰的邊框對比)。

核心元件只以標準 **Web Components(Custom Elements + 作用域 Shadow DOM)** 實作一次,並提供 1:1 的 **React** 與 **Svelte** 封裝,因此不論使用哪種框架,都能維持完全相同的設計權杖與 API 約定。

---

## 0. 快速開始

```bash
git clone https://github.com/tsuel-dev/Cubit.git
cd Cubit
pnpm install
pnpm run build
```

---

## 1. 架構與套件結構

```text
packages/
├── tokens/   # Primitive/semantic tokens, light/dark themes, CSS variable generator
├── core/     # 30 Web Components (zero external UI dependencies, WCAG 2.1 AA)
├── react/    # React 18/19 wrappers (forwardRef, type-safe props, event mapping)
└── svelte/   # Svelte 4/5 wrappers (reactive bindings, slot forwarding, custom events)

examples/
├── vanilla/  # Plain HTML + Web Components showcase
├── react/    # React TSX showcase
└── svelte/   # Svelte showcase
```

---

## 2. 設計權杖規格(遵循不變的基準值)

- **色彩基準**:
  - 預設背景 / 前景:`White (#ffffff)` / `Black (#000000)`
  - 強調色 (Primary / Accent):`#ff5500`
  - 輔助 / 背景用 (Secondary):`#ffebcc`、`#ffe4c9`
  - 深色模式:Black (`#000000`) 與分層的 Dark Gray 背景,並做高對比度校正(維持 `#ff5500` 的可讀性,保證 WCAG 2.1 AA 4.5:1 以上的對比度)
- **美學 (Cubit · Minimal)**:
  - 圓角權杖:`--ui-radius-sm: 8px`(按鈕、卡片等一般控制項) / `--ui-radius-md: 12px`(容器) / `--ui-radius-lg: 16px`(對話框、大型面板) / `--ui-radius-full: 9999px`(徽章、開關軌道等 pill)
  - 間距刻度:以 `4px / 8px` 為基礎的權杖
  - 邊框:清晰的邊框與層級分隔(不使用不必要的陰影)
- **字體排印**:
  - 不下載外部字型,使用作業系統原生的**系統字型堆疊**

---

## 3. 安裝與使用(以本機工作區為準)

可在 monorepo 內或本機專案中引用這些套件來使用。

### 3.1. 載入設計權杖樣式表(所有情境皆必要)
在專案進入點(HTML 或根 bundle)中引入權杖 CSS:
```html
<!-- Load from HTML -->
<link rel="stylesheet" href="./packages/tokens/dist/css/tokens.css" />
<link rel="stylesheet" href="./packages/tokens/dist/css/dark.css" />
```
```ts
// Import from a JS/TS bundler (Vite, Webpack, ...)
import '@cubit-ui/tokens/css/tokens.css';
import '@cubit-ui/tokens/css/dark.css';
```

### 3.2. Vanilla (Web Components)
```ts
import '@cubit-ui/core';
```
```html
<ui-button variant="primary" size="md">Save</ui-button>
<ui-input placeholder="Enter your name"></ui-input>
<ui-modal id="myModal" title="Notice">
  <p>This is the modal content.</p>
  <div slot="footer">
    <ui-button variant="outline" onclick="document.getElementById('myModal').open=false">Close</ui-button>
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
      <Alert variant="info" title="Notice">The React components work.</Alert>
      <Input value={val} onChange={(detail) => setVal(detail.value)} placeholder="Input" />
      <Button variant="primary" onClick={() => setOpen(true)}>Open modal</Button>

      <Modal open={open} title="Confirm" onClose={() => setOpen(false)}>
        <p>Selected value: {val}</p>
        <div slot="footer">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
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

<Alert variant="success" title="Svelte example">A Svelte binding example.</Alert>
<Input value={text} on:change={handleInputChange} placeholder="Type here" />
<Button variant="primary" on:click={() => open = true}>Open modal</Button>

<Modal {open} title="Svelte modal" on:close={() => open = false}>
  <p>Entered text: {text}</p>
  <div slot="footer">
    <Button variant="outline" on:click={() => open = false}>Close</Button>
  </div>
</Modal>
```

---

## 4. 30 個元件的 API 與 Props 規格表

| 分類 | 元件標籤 / 名稱 | 主要 Props / 屬性 | 觸發事件 | 無障礙 (ARIA / WCAG) |
| :--- | :--- | :--- | :--- | :--- |
| **基礎 1** | `ui-button` / `Button` | `variant` (primary/secondary/outline/ghost/danger), `size` (sm/md/lg), `disabled`, `type` | `click` | `aria-disabled`,高對比度焦點環 |
| **基礎 2** | `ui-input` / `Input` | `value`, `placeholder`, `type`, `disabled`, `readonly`, `size`, `invalid` | `input`, `change` | `aria-invalid`,`aria-disabled` |
| **基礎 3** | `ui-checkbox` / `Checkbox` | `checked`, `disabled`, `indeterminate`, `name`, `value` | `change` | `role="checkbox"`,`aria-checked`,空白鍵 |
| **基礎 4** | `ui-radio` / `Radio` | `checked`, `disabled`, `name`, `value` | `change` | `role="radio"`,群組內互斥選擇,空白鍵 |
| **基礎 5** | `ui-switch` / `Switch` | `checked`, `disabled` | `change` | `role="switch"`,`aria-checked`,pill 軌道 + 圓形滑塊 |
| **基礎 6** | `ui-select` / `Select` | `value`, `placeholder`, `disabled`, `size`, `open` | `change`, `open`, `close` | `role="combobox"`,按 Esc 關閉,點擊外部關閉 |
| **基礎 7** | `ui-modal` / `Modal` | `open`, `title` | `close` | `role="dialog"`,`aria-modal`,焦點陷阱,按 Esc 關閉 |
| **基礎 8** | `ui-toast` / `Toast` | `variant` (info/success/warning/error), `duration`, `open` | `close` | `role="status"`,`aria-live="polite"`,自動消失計時器 |
| **基礎 9** | `ui-tooltip` / `Tooltip` | `content`, `position` (top/bottom/left/right) | - | `role="tooltip"`,hover/focus 觸發,按 Esc 離開 |
| **基礎 10** | `ui-tabs` / `Tabs` | `value` | `change` | `role="tablist/tab/tabpanel"`,方向鍵/Home/End 鍵 |
| **基礎 11** | `ui-badge` / `Badge` | `variant` (primary/secondary/outline/success/warning/error), `size` | - | pill 標籤,高對比度文字 |
| **基礎 12** | `ui-spinner` / `Spinner` | `size` (sm/md/lg) | - | `role="status"`,`aria-label="Loading"` |
| **基礎 13** | `ui-alert` / `Alert` | `variant` (info/success/warning/error), `title`, `closable` | `close` | `role="alert"`,保證 4.5:1 的色彩對比度 |
| **擴充 14** | `ui-card` / `Card` | `variant` (default/elevated/secondary/bordered), `bordered` | - | header、body、footer 插槽彼此分離 |
| **擴充 15** | `ui-accordion` / `Accordion` | `multiple` (`ui-accordion-item`: `open`, `title`, `disabled`) | `change`, `toggle-item` | `role="region"`,`aria-expanded`,Enter/空白鍵 |
| **擴充 16** | `ui-dropdown` / `Dropdown` | `open`, `placement`, `disabled` | `open`, `close` | `role="menu"`,`role="menuitem"`,點擊外部關閉 |
| **擴充 17** | `ui-progress` / `Progress` | `value`, `max`, `size`, `variant` | - | `role="progressbar"`,`aria-valuenow/min/max` |
| **擴充 18** | `ui-pagination` / `Pagination` | `current`, `total`, `page-size` | `change` | `role="navigation"`,`aria-current="page"`,鍵盤操作 |
| **擴充 19** | `ui-table` / `Table` | `striped`, `bordered`, `hoverable` | - | `role="table"`,滑過時使用輔助背景色 (`#ffe4c9`) |
| **擴充 20** | `ui-avatar` / `Avatar` | `src`, `alt`, `name`, `size` (sm/md/lg), `shape` (circle/square) | - | 預設為圓形,可選 `shape="square"`,圖片載入失敗時退回顯示姓名縮寫 |
| **擴充 21** | `ui-breadcrumbs` / `Breadcrumbs` | `separator` (`ui-breadcrumb-item`: `href`, `current`) | - | `role="navigation"`,`aria-current="page"` |
| **擴充 22** | `ui-drawer` / `Drawer` | `open`, `side` (left/right), `title` | `close` | 焦點陷阱,按 Esc/點擊遮罩關閉,離屏畫布 |
| **擴充 23** | `ui-skeleton` / `Skeleton` | `variant` (text/circle/rect), `width`, `height`, `lines` | - | `aria-hidden`,在 `prefers-reduced-motion` 下停止 shimmer |
| **擴充 24** | `ui-navbar` / `Navbar` | `brand`, `sticky` | - | `role="navigation"`,預設連結插槽 + `actions` 插槽 |
| **資料 25** | `ui-log` / `Log` (+ `ui-log-item` / `LogItem`) | `label`, `height`, `wrap`, `auto-scroll`, `max`, `empty` (`ui-log-item`: `level`(info/success/warning/error/debug), `time`) | `copy` | `role="log"`,`aria-live="polite"`,黏性底部,API:`push()` / `scrollDown()` / `clear()` |
| **新增 26** | `ui-textarea` / `Textarea` | `value`, `placeholder`, `rows`, `maxlength`, `resize` (none/vertical/both), `size`, `name`, `disabled`, `readonly`, `invalid` | `input`, `change` | `aria-invalid`,表單關聯(`name`、reset、fieldset disabled),設定 `maxlength` 時顯示字數 |
| **新增 27** | `ui-empty-state` / `EmptyState` | `heading`, `description`, `size` (sm/md), `variant` (default/error) | - | 標題以 `<h3>` 呈現,裝飾圖示對輔助技術隱藏,操作插槽 |
| **新增 28** | `ui-segmented` / `Segmented` | `value`, `size` (sm/md/lg), `disabled` (`ui-segment`: `value`, `disabled`) | `change` | `role="radiogroup"` / `role="radio"`,`aria-checked`,方向鍵/Home/End 鍵(roving tabindex) |
| **新增 29** | `ui-stepper` / `Stepper` | `current`, `orientation` (horizontal/vertical) (`ui-step`: `label`, `description`, `status`) | - | `role="list"` / `listitem`,`aria-current="step"`,向螢幕閱讀器傳達步驟狀態 |
| **新增 30** | `ui-chip` / `Chip` | `variant` (neutral/primary/success/warning/error), `size` (sm/md), `removable`, `disabled`, `remove-label` | `remove` | 可刪除時可取得焦點,× 按鈕帶有 `aria-label`,按 Delete/Backspace 請求刪除 |

> **表單支援 (v1.1):** `ui-input`、`ui-textarea`、`ui-checkbox`、`ui-radio`、`ui-switch` 會參與表單:依 `name` 提交,並遵循 `<form>.reset()` 與 `<fieldset disabled>`。

---

## 5. 淺色 / 深色模式切換指南

函式庫預設使用以 CSS 變數為基礎的主題系統,因此只要在 HTML 文件的最上層標籤(`html` 或 `body`)設定 `data-theme` 屬性,所有元件就會立即切換。

### 5.1. 直接用 HTML 屬性切換
```html
<!-- Force light mode -->
<html data-theme="light">

<!-- Force dark mode -->
<html data-theme="dark">

<!-- Follow the OS theme (without data-theme, prefers-color-scheme applies) -->
<html>
```

### 5.2. 使用 JS/TS 輔助函式
可以使用 `@cubit-ui/tokens` 提供的執行階段輔助函式:
```ts
import { setTheme, getTheme } from '@cubit-ui/tokens';

// Switch to dark mode
setTheme('dark');

// Switch to light mode
setTheme('light');

// Restore the system setting
setTheme('system');

// Read the current setting
console.log(getTheme()); // 'light' | 'dark' | 'system'
```

---

## 6. 自訂設計權杖

在全域 CSS 或特定容器作用域中覆寫 CSS Custom Properties,會立即傳遞給其下的元件。

```css
/* Example: custom brand override for an application */
:root {
  /* Change the primary color to match your brand */
  --ui-color-primary: #ff4500;
  --ui-color-primary-hover: #e03e00;

  /* Make the default 8px button radius larger, like cards */
  --ui-radius-sm: 12px;

  /* Change the default font stack */
  --ui-font-family-base: "Pretendard", -apple-system, BlinkMacSystemFont, sans-serif;
}
```

---

## 7. UX 標準使用準則(依據實際服務稽核的模式)

將實際服務稽核中反覆出現的問題類型,定義為**元件組合的標準模式**。
以下 4 種模式與函式庫文件(`examples/vanilla` — UX Patterns 區段)中的線上示範一致。

### 7.1. 搜尋狀態機 — 明確呈現載入中 / 成功 / 無結果 / 失敗 4 種狀態

**原則**:搜尋與查詢必須「始終明確地」呈現 4 種狀態。
`緩慢載入 → 無限載入`(缺少載入提示)、`失敗 → 被掩蓋為無結果`、`無結果 → 空白畫面` 一律視為缺陷。

- **載入中**:在結果區域顯示 `ui-spinner size="sm"`,並對搜尋按鈕套用 7.2 的鎖定模式
- **無結果**:`ui-alert variant="warning"` + 下一步操作提示(「請換個搜尋詞再試一次」)
- **失敗**:`ui-alert variant="error"` + 同時顯示重試方式(不要把「網路問題」這個事實隱藏在按鈕標籤裡)
- 為結果區域容器設定 `aria-live="polite"`(讓螢幕閱讀器播報更新)

```ts
// Standard skeleton (vanilla)
const box = document.getElementById('searchResults'); // aria-live="polite"
box.innerHTML = '';
button.disabled = true;           // 1) lock immediately
box.appendChild(spinner);         // 2) show loading
const items = await fetch(...);
if (items.length === 0) renderEmpty();   // 3) empty result = warning Alert
box.appendChild(resultRow);              // 4) success = actual results
button.disabled = false;          // always restore
```

**反模式**:保持結果區域不變、只用 toast 收尾 / 用「完成」徽章表示失敗。

### 7.2. 按鈕重複點擊鎖定 — busy 防護 + 失敗後的重試標籤

**原則**:處理時間在 0.5 秒以上,或重複建立代價較大的操作,其按鈕必須鎖定。
沒有鎖定的「毫無防護的按鈕」會因雙擊而產生重複送出。

- 處理中:`disabled` 屬性 + 將標籤替換為 `"處理中..."`
- 失敗時:標籤恢復為 `"重試"` + 以 `ui-toast variant="error"` 顯示原因(2 秒後恢復原標籤)
- 成功時:恢復原標籤 + 以 `ui-toast variant="success"` 回饋結果

```ts
async function withButtonLock(button, busyLabel, action, failLabel = 'Try again') {
  if (button.dataset.busy === '1') return;   // double-click guard
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

**反模式**:不設逾時就 `await`(使用者可能再次點擊) / 失敗後無聲無息地還原。

### 7.3. 即時狀態標籤 — 徽章的值來自「真實的值」

**原則**:伺服器/服務狀態標籤(`ui-badge`)的 `variant` 與文字必須跟隨最新的狀態值。
只改標籤文字而顏色固定,或沒有值卻始終顯示「正常」,都屬於**虛假顯示**。

- 開始更新:在項目旁顯示 `ui-spinner size="sm"`(提示正在更新)
- 值抵達:`badge.setAttribute('variant', 與狀態對應的 variant)` + 替換文字 — 同步更新
- 一律併列最後檢查時間(`"最後檢查:19:39:23"`)— 讓使用者自行判斷資料的新鮮度
- 區分不同狀態 → `success`(正常) / `warning`(延遲、擱置) / `outline`(等待)

```html
<ui-badge id="stateChip" variant="outline">Waiting</ui-badge>
<ui-spinner size="sm" id="stateSpinner" style="visibility: hidden;"></ui-spinner>
Last checked: <span id="stateUpdated">—</span>
```

**反模式**:一旦填上「正常」就永久固定 / 處於失敗狀態卻保留成功徽章。

### 7.4. 日誌與長文字 — 用 `ui-log`,而不是隨意塗寫的 `<pre>`

**原則**:伺服器日誌、作業歷程、執行結果這類持續增長的長文字,統一使用 `ui-log`。

- 內建無障礙:`role="log"` + `aria-live="polite"`(無需自行指定)
- 黏性底部:使用者在上方閱讀時,新項目到來也不會強制捲動,僅在接近底部時才跟隨
- 容量保護:超過 `max`(預設 500)時自動從最舊的項目開始移除 — 防止 DOM 無限增長
- 內建等級顏色 `level="info/success/warning/error/debug"`、`time` 時間戳記、標頭複製按鈕與 `copy` 事件
- 長行換行用 `wrap`,與標準日誌一樣預設橫向捲動

```html
<ui-log label="gateway.log" height="240px">
  <ui-log-item level="info" time="19:31:02">GET /healthz — 204 · 3ms</ui-log-item>
  <ui-log-item level="error" time="19:33:12">SSH check failed — path parse error</ui-log-item>
</ui-log>
```

```ts
// Streaming (vanilla)
const log = document.getElementById('myLog');          // ui-log element
log.push('success', 'Deploy complete (v2.4.1)', stamp()); // push API
log.push('warning', 'Disk 82% — over threshold');
log.clear();                                           // clear everything
```

**反模式**:直接用 `div.appendChild(p)` 堆疊(閱讀位置會錯亂,且無限增長) / 各自組合顏色對比(不使用等級顏色權杖)。

---

## 8. 發佈準備狀態(CI 與發佈)

- **GitHub Actions CI (`.github/workflows/ci.yml`)**:
  - 已自動化完整流程:`pnpm install` → `eslint` → `vite build` → `tsc (typecheck)`。
- **npm 發佈與 GitHub Release**:
  - 所有套件(`tokens`、`core`、`react`、`svelte`)的 `package.json` 中皆已完整設定 `main`、`module`、`types`、`exports`、`files`。
  - **實際的 `npm publish` 由維護者在需要時執行。**(不會自動發佈。)

---

## 授權條款 / License

Cubit UI 以 **TLL-BY-NC-ND**([Tsuel Liberty License](https://tll.mataku.org))提供。完整內容請見 [`LICENSE`](./LICENSE)。以韓文文本為準,如與其他語言不一致,以韓文文本為準。

| 條件 | 內容 |
|---|---|
| BY | 須以姓名+連結方式標示作者 `Tsuel (tsuel-dev)` |
| NC | 禁止商業用途 |
| ND | 禁止修改及製作衍生作品 |
| 地區 | 在北韓、中國與俄羅斯限制使用 |
| AI | 禁止作為 AI/機器學習模型的訓練資料 |

- 本授權**不是**創用 CC(Creative Commons)授權,也不符合開放原始碼(OSI)定義。
- 本文件的法律效力需要專業人士(律師)審核,自動產生的文字不構成法律建議。

---

## 聯絡方式 / Contact

如有法律要求、授權/著作權諮詢、資安漏洞通報,或需要開發者之間協調,請透過以下信箱聯絡:

**github@mataku.org**
