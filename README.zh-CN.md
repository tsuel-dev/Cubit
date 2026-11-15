# Cubit UI — Design System & Component Library

[한국어](README.md) | [English](README.en.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [Español](README.es.md) | [Português](README.pt.md)

> **语言说明:** 韩语 README ([README.md](README.md)) 始终具有优先效力。如果本译文的内容与韩语 README 不一致,或译文不准确,以韩语 README 为准。

> **以自有设计令牌系统为基准,提供标准化以及跨框架一致的用户体验**

Cubit UI 是一套标准 UI 组件库,基于坚实、可信赖的几何美学(**Cubit · Minimal**:圆角令牌 (8/12/16px + Pill)、4px/8px 间距、清晰的边框对比)。

核心组件只以标准 **Web Components(Custom Elements + 作用域 Shadow DOM)** 实现一次,并提供 1:1 的 **React** 与 **Svelte** 封装,因此无论使用哪种框架,都能保持完全相同的设计令牌和 API 约定。

---

## 0. 快速开始

```bash
git clone https://github.com/tsuel-dev/Cubit.git
cd Cubit
pnpm install
pnpm run build
```

---

## 1. 架构与包结构

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

## 2. 设计令牌规范(遵循不变的基准值)

- **颜色基准**:
  - 默认背景 / 前景:`White (#ffffff)` / `Black (#000000)`
  - 强调色 (Primary / Accent):`#ff5500`
  - 辅助 / 背景用 (Secondary):`#ffebcc`、`#ffe4c9`
  - 深色模式:Black (`#000000`) 与分层的 Dark Gray 背景,并做高对比度校正(保持 `#ff5500` 的可读性,保证 WCAG 2.1 AA 4.5:1 以上的对比度)
- **美学 (Cubit · Minimal)**:
  - 圆角令牌:`--ui-radius-sm: 8px`(按钮、卡片等一般控件) / `--ui-radius-md: 12px`(容器) / `--ui-radius-lg: 16px`(模态框、大型面板) / `--ui-radius-full: 9999px`(徽章、开关轨道等 pill)
  - 间距刻度:以 `4px / 8px` 为基础的令牌
  - 边框:清晰的边框与层级分隔(不使用不必要的阴影)
- **字体排印**:
  - 不下载外部字体,使用操作系统原生的**系统字体栈**

---

## 3. 安装与使用(基于本地工作区)

可以在 monorepo 内或本地项目中引用这些包来使用。

### 3.1. 加载设计令牌样式表(所有场景必需)
在项目入口(HTML 或根 bundle)中引入令牌 CSS:
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

## 4. 30 个组件的 API 与 Props 规范表

| 分类 | 组件标签 / 名称 | 主要 Props / 属性 | 触发事件 | 无障碍 (ARIA / WCAG) |
| :--- | :--- | :--- | :--- | :--- |
| **基础 1** | `ui-button` / `Button` | `variant` (primary/secondary/outline/ghost/danger), `size` (sm/md/lg), `disabled`, `type` | `click` | `aria-disabled`,高对比度焦点环 |
| **基础 2** | `ui-input` / `Input` | `value`, `placeholder`, `type`, `disabled`, `readonly`, `size`, `invalid` | `input`, `change` | `aria-invalid`,`aria-disabled` |
| **基础 3** | `ui-checkbox` / `Checkbox` | `checked`, `disabled`, `indeterminate`, `name`, `value` | `change` | `role="checkbox"`,`aria-checked`,空格键 |
| **基础 4** | `ui-radio` / `Radio` | `checked`, `disabled`, `name`, `value` | `change` | `role="radio"`,组内互斥选择,空格键 |
| **基础 5** | `ui-switch` / `Switch` | `checked`, `disabled` | `change` | `role="switch"`,`aria-checked`,pill 轨道 + 圆形滑块 |
| **基础 6** | `ui-select` / `Select` | `value`, `placeholder`, `disabled`, `size`, `open` | `change`, `open`, `close` | `role="combobox"`,按 Esc 关闭,点击外部关闭 |
| **基础 7** | `ui-modal` / `Modal` | `open`, `title` | `close` | `role="dialog"`,`aria-modal`,焦点陷阱,按 Esc 关闭 |
| **基础 8** | `ui-toast` / `Toast` | `variant` (info/success/warning/error), `duration`, `open` | `close` | `role="status"`,`aria-live="polite"`,自动消失计时器 |
| **基础 9** | `ui-tooltip` / `Tooltip` | `content`, `position` (top/bottom/left/right) | - | `role="tooltip"`,hover/focus 触发,按 Esc 退出 |
| **基础 10** | `ui-tabs` / `Tabs` | `value` | `change` | `role="tablist/tab/tabpanel"`,方向键/Home/End 键 |
| **基础 11** | `ui-badge` / `Badge` | `variant` (primary/secondary/outline/success/warning/error), `size` | - | pill 标签,高对比度文字 |
| **基础 12** | `ui-spinner` / `Spinner` | `size` (sm/md/lg) | - | `role="status"`,`aria-label="Loading"` |
| **基础 13** | `ui-alert` / `Alert` | `variant` (info/success/warning/error), `title`, `closable` | `close` | `role="alert"`,保证 4.5:1 的颜色对比度 |
| **扩展 14** | `ui-card` / `Card` | `variant` (default/elevated/secondary/bordered), `bordered` | - | header、body、footer 插槽相互分离 |
| **扩展 15** | `ui-accordion` / `Accordion` | `multiple` (`ui-accordion-item`: `open`, `title`, `disabled`) | `change`, `toggle-item` | `role="region"`,`aria-expanded`,Enter/空格 |
| **扩展 16** | `ui-dropdown` / `Dropdown` | `open`, `placement`, `disabled` | `open`, `close` | `role="menu"`,`role="menuitem"`,点击外部关闭 |
| **扩展 17** | `ui-progress` / `Progress` | `value`, `max`, `size`, `variant` | - | `role="progressbar"`,`aria-valuenow/min/max` |
| **扩展 18** | `ui-pagination` / `Pagination` | `current`, `total`, `page-size` | `change` | `role="navigation"`,`aria-current="page"`,键盘操作 |
| **扩展 19** | `ui-table` / `Table` | `striped`, `bordered`, `hoverable` | - | `role="table"`,悬停时使用辅助背景色 (`#ffe4c9`) |
| **扩展 20** | `ui-avatar` / `Avatar` | `src`, `alt`, `name`, `size` (sm/md/lg), `shape` (circle/square) | - | 默认圆形,可选 `shape="square"`,图片加载失败时回退为首字母 |
| **扩展 21** | `ui-breadcrumbs` / `Breadcrumbs` | `separator` (`ui-breadcrumb-item`: `href`, `current`) | - | `role="navigation"`,`aria-current="page"` |
| **扩展 22** | `ui-drawer` / `Drawer` | `open`, `side` (left/right), `title` | `close` | 焦点陷阱,按 Esc/点击遮罩关闭,离屏画布 |
| **扩展 23** | `ui-skeleton` / `Skeleton` | `variant` (text/circle/rect), `width`, `height`, `lines` | - | `aria-hidden`,在 `prefers-reduced-motion` 下停止 shimmer |
| **扩展 24** | `ui-navbar` / `Navbar` | `brand`, `sticky` | - | `role="navigation"`,默认链接插槽 + `actions` 插槽 |
| **数据 25** | `ui-log` / `Log` (+ `ui-log-item` / `LogItem`) | `label`, `height`, `wrap`, `auto-scroll`, `max`, `empty` (`ui-log-item`: `level`(info/success/warning/error/debug), `time`) | `copy` | `role="log"`,`aria-live="polite"`,粘性底部,API:`push()` / `scrollDown()` / `clear()` |
| **新增 26** | `ui-textarea` / `Textarea` | `value`, `placeholder`, `rows`, `maxlength`, `resize` (none/vertical/both), `size`, `name`, `disabled`, `readonly`, `invalid` | `input`, `change` | `aria-invalid`,表单关联(`name`、reset、fieldset disabled),设置 `maxlength` 时显示字数 |
| **新增 27** | `ui-empty-state` / `EmptyState` | `heading`, `description`, `size` (sm/md), `variant` (default/error) | - | 标题渲染为 `<h3>`,装饰图标对辅助技术隐藏,操作插槽 |
| **新增 28** | `ui-segmented` / `Segmented` | `value`, `size` (sm/md/lg), `disabled` (`ui-segment`: `value`, `disabled`) | `change` | `role="radiogroup"` / `role="radio"`,`aria-checked`,方向键/Home/End 键(roving tabindex) |
| **新增 29** | `ui-stepper` / `Stepper` | `current`, `orientation` (horizontal/vertical) (`ui-step`: `label`, `description`, `status`) | - | `role="list"` / `listitem`,`aria-current="step"`,向读屏软件播报步骤状态 |
| **新增 30** | `ui-chip` / `Chip` | `variant` (neutral/primary/success/warning/error), `size` (sm/md), `removable`, `disabled`, `remove-label` | `remove` | 可删除时可获得焦点,× 按钮带 `aria-label`,按 Delete/Backspace 请求删除 |

> **表单支持 (v1.1):** `ui-input`、`ui-textarea`、`ui-checkbox`、`ui-radio`、`ui-switch` 会参与表单:按 `name` 提交,并遵循 `<form>.reset()` 与 `<fieldset disabled>`。

---

## 5. 浅色 / 深色模式切换指南

库默认使用基于 CSS 变量的主题系统,因此只需在 HTML 文档的顶层标签(`html` 或 `body`)上设置 `data-theme` 属性,所有组件就会立即切换。

### 5.1. 直接用 HTML 属性切换
```html
<!-- Force light mode -->
<html data-theme="light">

<!-- Force dark mode -->
<html data-theme="dark">

<!-- Follow the OS theme (without data-theme, prefers-color-scheme applies) -->
<html>
```

### 5.2. 使用 JS/TS 辅助函数
可以使用 `@cubit-ui/tokens` 提供的运行时辅助函数:
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

## 6. 自定义设计令牌

在全局 CSS 或特定容器作用域中覆盖 CSS Custom Properties,会立即传递给其下的组件。

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

## 7. UX 标准使用准则(基于真实服务审计的模式)

将真实服务审计中反复出现的问题类型,定义为**组件组合的标准模式**。
以下 4 种模式与库文档(`examples/vanilla` — UX Patterns 部分)中的在线演示一致。

### 7.1. 搜索状态机 — 明确呈现加载中 / 成功 / 空结果 / 失败 4 种状态

**原则**:搜索与查询必须“始终显式地”渲染 4 种状态。
`缓慢加载 → 无限加载`(缺少加载提示)、`失败 → 被掩盖为空结果`、`空结果 → 空白画面` 一律视为缺陷。

- **加载中**:在结果区域显示 `ui-spinner size="sm"`,并对搜索按钮应用 7.2 的锁定模式
- **空结果**:`ui-alert variant="warning"` + 下一步操作提示(“请换一个搜索词再试”)
- **失败**:`ui-alert variant="error"` + 同时显示重试方法(不要把“网络问题”这一事实隐藏在按钮标签里)
- 为结果区域容器设置 `aria-live="polite"`(让屏幕阅读器播报更新)

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

**反模式**:保持结果区域不变、只用 toast 收尾 / 用“完成”徽章表示失败。

### 7.2. 按钮重复点击锁定 — busy 守卫 + 失败后的重试标签

**原则**:处理时间在 0.5 秒以上,或重复创建代价较大的操作,其按钮必须锁定。
没有锁定的“毫无防护的按钮”会因双击而产生重复提交。

- 处理中:`disabled` 属性 + 将标签替换为 `"处理中..."`
- 失败时:标签恢复为 `"重试"` + 用 `ui-toast variant="error"` 显示原因(2 秒后恢复原标签)
- 成功时:恢复原标签 + 用 `ui-toast variant="success"` 反馈结果

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

**反模式**:不设超时就 `await`(用户可能再次点击) / 失败后悄无声息地还原。

### 7.3. 实时状态标签 — 徽章的值来源于“真实值”

**原则**:服务器/服务状态标签(`ui-badge`)的 `variant` 与文字必须跟随最新的状态值。
只改标签文字而颜色固定,或没有值却始终显示“正常”,都属于**虚假显示**。

- 开始刷新:在条目旁显示 `ui-spinner size="sm"`(提示正在刷新)
- 值到达:`badge.setAttribute('variant', 与状态对应的 variant)` + 替换文字 — 同步更新
- 始终同时标注最后检查时间(`"最后检查:19:39:23"`)— 让用户自己判断数据的新鲜度
- 区分不同状态 → `success`(正常) / `warning`(延迟、挂起) / `outline`(等待)

```html
<ui-badge id="stateChip" variant="outline">Waiting</ui-badge>
<ui-spinner size="sm" id="stateSpinner" style="visibility: hidden;"></ui-spinner>
Last checked: <span id="stateUpdated">—</span>
```

**反模式**:一旦填上“正常”就永久固定 / 处于失败状态却保留成功徽章。

### 7.4. 日志与长文本 — 用 `ui-log`,而不是乱涂的 `<pre>`

**原则**:服务器日志、作业历史、执行结果这类不断增长的长文本,统一使用 `ui-log`。

- 内置无障碍:`role="log"` + `aria-live="polite"`(无需自行指定)
- 粘性底部:用户在上方阅读时,新条目到来也不会强制滚动,仅在接近底部时才跟随
- 容量保护:超过 `max`(默认 500)时自动从最旧的条目开始移除 — 防止 DOM 无限增长
- 内置级别颜色 `level="info/success/warning/error/debug"`、`time` 时间戳、头部复制按钮以及 `copy` 事件
- 长行换行用 `wrap`,与标准日志一样默认横向滚动

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

**反模式**:直接用 `div.appendChild(p)` 堆叠(阅读位置会错乱,且无限增长) / 各自组合颜色对比(不使用级别颜色令牌)。

---

## 8. 发布准备状态(CI 与发布)

- **GitHub Actions CI (`.github/workflows/ci.yml`)**:
  - 已自动化完整流水线:`pnpm install` → `eslint` → `vite build` → `tsc (typecheck)`。
- **npm 发布与 GitHub Release**:
  - 所有包(`tokens`、`core`、`react`、`svelte`)的 `package.json` 中均已完整配置 `main`、`module`、`types`、`exports`、`files`。
  - **实际的 `npm publish` 由维护者在需要时执行。**(不会自动发布。)

---

## 许可证 / License

Cubit UI 以 **TLL-BY-NC-ND**([Tsuel Liberty License](https://tll.mataku.org))提供。以韩语文本为准,如与其他语言不一致,以韩语文本为准。

- 许可证全文: [`LICENSE`](./LICENSE)
- [许可证详情链接(通俗说明、条件查看)](https://tll.mataku.org/?lang=zh-CN#/detail?by=1&attr=tsuel&cm=titleNameLink&sa=0&nc=1&nd=1&reg_e=1&reg_m=forbid&reg_l=KP%2CCN%2CRU&ad=none&ai=nc-only&rp_e=1&rp=%5B%5B%22KP%22%2C1%2C%22combined%22%2C%22%22%2C%22legal%22%2C%22%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD%28KR%29%EC%9D%98+%EB%82%A8%EB%B6%81%EA%B5%90%EB%A5%98%ED%98%91%EB%A0%A5%EB%B2%95%28Inter-Korean+Exchange+and+Cooperation+Act%29%EC%97%90+%EB%94%B0%EB%9D%BC+%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD+%EA%B5%AD%EB%AF%BC%EC%9D%80+%EB%B6%81%ED%95%9C%28KP%29%EC%97%90+%EC%9E%90%EB%A3%8C%EB%A5%BC+%EC%A0%9C%EA%B3%B5%ED%95%A0+%EC%88%98+%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4.+%EA%B4%80%EB%A0%A8%ED%95%98%EC%97%AC+%EC%A0%95%EB%B6%80+%EA%B8%B0%EA%B4%80%EC%9D%98+%ED%97%88%EA%B0%80%EA%B0%80+%ED%95%84%EC%9A%94%ED%95%A9%EB%8B%88%EB%8B%A4.%22%2C%22contract%22%2C%22%22%5D%2C%5B%22CN%22%2C1%2C%22combined%22%2C%22%22%2C%22security%2ChumanRights%22%2C%22%EA%B5%AD%EA%B0%80+%EC%B0%A8%EC%9B%90%EC%9D%98+%EC%9D%B8%ED%84%B0%EB%84%B7+%EA%B2%80%EC%97%B4%2C+%ED%91%9C%ED%98%84%EC%9D%98+%EC%9E%90%EC%9C%A0+%EC%A0%9C%ED%95%9C+%EB%B0%8F+%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4+%ED%86%B5%EC%A0%9C+%EB%AC%B8%EC%A0%9C%2C+%EC%A0%80%EC%9E%91%EA%B6%8C+%EC%9D%98%EC%8B%9D%EC%9D%98+%EA%B5%AD%EA%B0%80%EC%A0%81+%EB%B6%80%EC%9E%AC+%EB%93%B1%EC%9C%BC%EB%A1%9C+%EC%9D%B8%ED%95%B4+%EC%A0%9C%ED%95%9C%ED%95%A9%EB%8B%88%EB%8B%A4.%22%2C%22%22%2C%22%22%5D%2C%5B%22RU%22%2C1%2C%22territory%22%2C%22%22%2C%22conflict%22%2C%22%EB%9D%BC%EC%9D%B4%EC%84%BC%EC%8A%A4+%EC%A0%9C%EA%B3%B5%EC%9E%90%EB%8A%94+%EC%A0%84%EC%9F%81%EC%97%90+%EA%B2%B0%EC%82%AC+%EB%B0%98%EB%8C%80%ED%95%98%EB%A9%B0%2C+%EB%8C%80%EB%9F%AC%EC%8B%9C%EC%95%84+%EA%B2%BD%EC%A0%9C%EC%A0%9C%EC%9E%AC+%EC%A0%95%EC%B1%85%EC%97%90+%EB%8F%99%EC%9D%98%ED%95%98%EA%B3%A0+%EC%9D%B4%EB%A5%BC+%EC%A4%80%EC%88%98%ED%95%98%EA%B8%B0+%EC%9C%84%ED%95%9C+%EC%A1%B0%EC%B9%98%EC%9E%85%EB%8B%88%EB%8B%A4.+%EC%9D%B4%EC%97%90+%EB%8C%80%ED%95%B4+%EC%86%8C%EB%AA%85%ED%95%A0+%EC%88%98+%EC%9E%88%EA%B1%B0%EB%82%98+%EC%A0%84%EC%9F%81%EC%97%90+%EB%B0%98%EB%8C%80%ED%95%98%EB%8A%94+%EC%A6%9D%EB%B9%99+%EC%9E%90%EB%A3%8C%EA%B0%80+%EC%9E%88%EC%9D%84+%EA%B2%BD%EC%9A%B0+%ED%97%88%EC%9A%A9%EB%90%A9%EB%8B%88%EB%8B%A4.%22%2C%22contract%22%2C%22%22%5D%5D&aii=deny&aix=deny&ail=1&tdm=1&fb=military%2Csurveillance%2Chate%2Cadult%2Cgambling&pat=grantRetaliate&bnd=allow&cp=docs&cc_e=1&cc_c=cubit%40mataku.org&tm=1&nt=before&term_e=1&term_d=0&law=KR&note=default+contact+%3A+cubit%40mataku.org&fp=422DF40527)
- TLL 介绍与生成器: <https://tll.mataku.org>

| 条件 | 含义 |
|---|---|
| BY | 须以 **作品标题 + 姓名 + 链接** 的方式注明作者 `tsuel` |
| NC | 禁止商业用途 |
| ND | 禁止修改及制作衍生作品 |
| 地区 | 在俄罗斯、中国和朝鲜禁止使用 |
| AI | 仅允许用于学术研究、非商业模型的训练(禁止商业 AI 训练);禁止作为 AI 输入使用、禁止为 AI 搜索/索引而收集;使用 AI 时须标明 |
| 其他 | 使用前须通知作者 · 商业用途须通过 cubit@mataku.org 另行获得许可 · 禁止用于军事、监控、仇恨、成人、赌博目的 · 可在不修改的情况下包含于其他产品 |

- 本许可证**不是**知识共享(Creative Commons)许可证,也不符合开源(OSI)定义。
- 本文件的法律效力需要专业人士(律师)审核,自动生成的文字不构成法律建议。

---

## 联系方式 / Contact

如有法律要求、许可证/版权咨询、安全漏洞报告,或需要开发者之间协商,请通过以下邮箱联系:

**github@mataku.org**
