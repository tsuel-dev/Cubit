# Cubit UI — Design System & Component Library

[한국어](README.md) | [English](README.en.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [Español](README.es.md) | [Português](README.pt.md)

> **Language notice:** The Korean README ([README.md](README.md)) always takes precedence. If the content of this translation differs from the Korean README, or if the translation is inaccurate, the Korean README prevails.

> **Standardization and a consistent cross-framework UX, built on our own design-token system**

Cubit UI is a standard UI component library built on a solid, trustworthy geometric aesthetic (**Cubit · Minimal**: rounded tokens (8/12/16px + pill), 4px/8px spacing, crisp border contrast).

The core components are implemented once as standard **Web Components (Custom Elements + scoped Shadow DOM)**, with 1:1 **React** and **Svelte** wrappers, so the same design tokens and API contract are kept regardless of framework.

---

## 0. Quick start

```bash
git clone https://github.com/tsuel-dev/Cubit.git
cd Cubit
pnpm install
pnpm run build
```

---

## 1. Architecture and packages

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

## 2. Design token specification (fixed reference values)

- **Colors**:
  - Default background / foreground: `White (#ffffff)` / `Black (#000000)`
  - Accent (Primary / Accent): `#ff5500`
  - Secondary / background: `#ffebcc`, `#ffe4c9`
  - Dark mode: Black (`#000000`) with layered dark-gray backgrounds and high-contrast tuning (keeps `#ff5500` legible, guarantees WCAG 2.1 AA contrast of 4.5:1 or more)
- **Aesthetic (Cubit · Minimal)**:
  - Corner-radius tokens: `--ui-radius-sm: 8px` (general controls such as buttons and cards) / `--ui-radius-md: 12px` (containers) / `--ui-radius-lg: 16px` (modals and large panels) / `--ui-radius-full: 9999px` (pills such as badges and switch tracks)
  - Spacing scale: tokens based on `4px / 8px`
  - Borders: crisp borders and clear layer separation (no unnecessary shadows)
- **Typography**:
  - Uses the OS-native **system font stack**, with no external font downloads

---

## 3. Installation and usage (local workspace)

You can use the packages from within the monorepo or from a local project.

### 3.1. Load the design-token stylesheets (required for all setups)
Include the token CSS in your project entry point (HTML or root bundle):
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

## 4. The 30 components: API and props reference

| Group | Component tag / name | Main props / attributes | Events | Accessibility (ARIA / WCAG) |
| :--- | :--- | :--- | :--- | :--- |
| **Basic 1** | `ui-button` / `Button` | `variant` (primary/secondary/outline/ghost/danger), `size` (sm/md/lg), `disabled`, `type` | `click` | `aria-disabled`, high-contrast focus ring |
| **Basic 2** | `ui-input` / `Input` | `value`, `placeholder`, `type`, `disabled`, `readonly`, `size`, `invalid` | `input`, `change` | `aria-invalid`, `aria-disabled` |
| **Basic 3** | `ui-checkbox` / `Checkbox` | `checked`, `disabled`, `indeterminate`, `name`, `value` | `change` | `role="checkbox"`, `aria-checked`, Space key |
| **Basic 4** | `ui-radio` / `Radio` | `checked`, `disabled`, `name`, `value` | `change` | `role="radio"`, exclusive selection within a group, Space key |
| **Basic 5** | `ui-switch` / `Switch` | `checked`, `disabled` | `change` | `role="switch"`, `aria-checked`, pill track + round thumb |
| **Basic 6** | `ui-select` / `Select` | `value`, `placeholder`, `disabled`, `size`, `open` | `change`, `open`, `close` | `role="combobox"`, closes on Esc, closes on outside click |
| **Basic 7** | `ui-modal` / `Modal` | `open`, `title` | `close` | `role="dialog"`, `aria-modal`, focus trap, closes on Esc |
| **Basic 8** | `ui-toast` / `Toast` | `variant` (info/success/warning/error), `duration`, `open` | `close` | `role="status"`, `aria-live="polite"`, auto-dismiss timer |
| **Basic 9** | `ui-tooltip` / `Tooltip` | `content`, `position` (top/bottom/left/right) | - | `role="tooltip"`, hover/focus trigger, Esc to dismiss |
| **Basic 10** | `ui-tabs` / `Tabs` | `value` | `change` | `role="tablist/tab/tabpanel"`, Arrow/Home/End keys |
| **Basic 11** | `ui-badge` / `Badge` | `variant` (primary/secondary/outline/success/warning/error), `size` | - | pill label, high-contrast text |
| **Basic 12** | `ui-spinner` / `Spinner` | `size` (sm/md/lg) | - | `role="status"`, `aria-label="Loading"` |
| **Basic 13** | `ui-alert` / `Alert` | `variant` (info/success/warning/error), `title`, `closable` | `close` | `role="alert"`, guaranteed 4.5:1 color contrast |
| **Extended 14** | `ui-card` / `Card` | `variant` (default/elevated/secondary/bordered), `bordered` | - | header, body and footer slots kept separate |
| **Extended 15** | `ui-accordion` / `Accordion` | `multiple` (`ui-accordion-item`: `open`, `title`, `disabled`) | `change`, `toggle-item` | `role="region"`, `aria-expanded`, Enter/Space |
| **Extended 16** | `ui-dropdown` / `Dropdown` | `open`, `placement`, `disabled` | `open`, `close` | `role="menu"`, `role="menuitem"`, closes on outside click |
| **Extended 17** | `ui-progress` / `Progress` | `value`, `max`, `size`, `variant` | - | `role="progressbar"`, `aria-valuenow/min/max` |
| **Extended 18** | `ui-pagination` / `Pagination` | `current`, `total`, `page-size` | `change` | `role="navigation"`, `aria-current="page"`, keyboard support |
| **Extended 19** | `ui-table` / `Table` | `striped`, `bordered`, `hoverable` | - | `role="table"`, secondary background (`#ffe4c9`) on hover |
| **Extended 20** | `ui-avatar` / `Avatar` | `src`, `alt`, `name`, `size` (sm/md/lg), `shape` (circle/square) | - | circle by default, optional `shape="square"`, initials fallback when the image fails |
| **Extended 21** | `ui-breadcrumbs` / `Breadcrumbs` | `separator` (`ui-breadcrumb-item`: `href`, `current`) | - | `role="navigation"`, `aria-current="page"` |
| **Extended 22** | `ui-drawer` / `Drawer` | `open`, `side` (left/right), `title` | `close` | focus trap, closes via Esc/backdrop, off-canvas |
| **Extended 23** | `ui-skeleton` / `Skeleton` | `variant` (text/circle/rect), `width`, `height`, `lines` | - | `aria-hidden`, shimmer stops under `prefers-reduced-motion` |
| **Extended 24** | `ui-navbar` / `Navbar` | `brand`, `sticky` | - | `role="navigation"`, default link slot + `actions` slot |
| **Data 25** | `ui-log` / `Log` (+ `ui-log-item` / `LogItem`) | `label`, `height`, `wrap`, `auto-scroll`, `max`, `empty` (`ui-log-item`: `level`(info/success/warning/error/debug), `time`) | `copy` | `role="log"`, `aria-live="polite"`, sticky bottom, API: `push()` / `scrollDown()` / `clear()` |
| **New 26** | `ui-textarea` / `Textarea` | `value`, `placeholder`, `rows`, `maxlength`, `resize` (none/vertical/both), `size`, `name`, `disabled`, `readonly`, `invalid` | `input`, `change` | `aria-invalid`, form-associated (`name`, reset, fieldset disabled), character counter when `maxlength` is set |
| **New 27** | `ui-empty-state` / `EmptyState` | `heading`, `description`, `size` (sm/md), `variant` (default/error) | - | heading rendered as `<h3>`, decorative icon hidden from assistive tech, actions slot |
| **New 28** | `ui-segmented` / `Segmented` | `value`, `size` (sm/md/lg), `disabled` (`ui-segment`: `value`, `disabled`) | `change` | `role="radiogroup"` / `role="radio"`, `aria-checked`, Arrow/Home/End keys (roving tabindex) |
| **New 29** | `ui-stepper` / `Stepper` | `current`, `orientation` (horizontal/vertical) (`ui-step`: `label`, `description`, `status`) | - | `role="list"` / `listitem`, `aria-current="step"`, step state announced to screen readers |
| **New 30** | `ui-chip` / `Chip` | `variant` (neutral/primary/success/warning/error), `size` (sm/md), `removable`, `disabled`, `remove-label` | `remove` | focusable when removable, × button with `aria-label`, Delete/Backspace requests removal |

> **Form support (v1.1):** `ui-input`, `ui-textarea`, `ui-checkbox`, `ui-radio` and `ui-switch` are form-associated: they submit with `name` and honor `<form>.reset()` and `<fieldset disabled>`.

---

## 5. Light / dark mode switching

The library uses a CSS-variable-based theme system, so simply setting the `data-theme` attribute on the top-level tag (`html` or `body`) switches every component instantly.

### 5.1. Switch directly with an HTML attribute
```html
<!-- Force light mode -->
<html data-theme="light">

<!-- Force dark mode -->
<html data-theme="dark">

<!-- Follow the OS theme (without data-theme, prefers-color-scheme applies) -->
<html>
```

### 5.2. Use the JS/TS helpers
You can use the runtime helpers provided by `@cubit-ui/tokens`:
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

## 6. Customizing design tokens

Overriding CSS custom properties in global CSS or in a specific container scope propagates immediately to the components below it.

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

## 7. UX usage guidelines (patterns from real-service audits)

Problem types found repeatedly in real-service audits are defined here as **standard component-composition patterns**.
The four patterns below match the live demos in the library documentation (`examples/vanilla` — UX Patterns section).

### 7.1. Search state machine — always show the four states: loading / success / empty / failure

**Principle**: searches and lookups always render their four states explicitly.
`slow loading → endless loading` (missing loading indicator), `failure → hidden as an empty result`, and `empty result → blank screen` are all treated as bugs.

- **Loading**: show `ui-spinner size="sm"` in the results area and apply the lock pattern from 7.2 to the search button
- **Empty result**: `ui-alert variant="warning"` + guidance for the next action ("try a different search term")
- **Failure**: `ui-alert variant="error"` + how to retry (never hide the fact that it is a network problem in a button label)
- Give the results container `aria-live="polite"` (so screen readers announce updates)

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

**Anti-patterns**: leaving the results area as is and ending with just a toast / showing a failure as a "done" badge.

### 7.2. Locking buttons against double clicks — busy guard + retry label after failure

**Principle**: always lock the button of any action that takes 0.5 s or longer, or where duplicates are costly.
An unguarded button lets a double-click create duplicate submissions.

- While processing: the `disabled` attribute + replace the label with `"Processing..."`
- On failure: return the label to `"Try again"` + show the cause with `ui-toast variant="error"` (restore the original label after 2 s)
- On success: restore the original label + give feedback with `ui-toast variant="success"`

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

**Anti-patterns**: awaiting without a timeout (the user may click again) / silently reverting after a failure.

### 7.3. Live status chips — badge values come from the actual value

**Principle**: the `variant` and text of a server/service status chip (`ui-badge`) must follow the latest status value.
A label that changes while the color stays fixed, or a chip that always says "OK" without a value, is a **false display**.

- Refresh starts: show `ui-spinner size="sm"` next to the item (to signal that it is refreshing)
- Value arrives: `badge.setAttribute('variant', <variant matching the status>)` + replace the text — update synchronously
- Always show the last-checked time (`"Last checked: 19:39:23"`) so users can judge freshness themselves
- Distinguish states: `success` (OK) / `warning` (delayed or pending) / `outline` (waiting)

```html
<ui-badge id="stateChip" variant="outline">Waiting</ui-badge>
<ui-spinner size="sm" id="stateSpinner" style="visibility: hidden;"></ui-spinner>
Last checked: <span id="stateUpdated">—</span>
```

**Anti-patterns**: filling the chip with "OK" once and freezing it / keeping a success badge while in a failure state.

### 7.4. Logs and long text — use `ui-log`, not a scribbled `<pre>`

**Principle**: standardize continuously growing long text such as server logs, job history and execution results with `ui-log`.

- Built-in accessibility: `role="log"` + `aria-live="polite"` (no need to set them yourself)
- Sticky bottom: if the user is reading higher up, new items do not force a scroll; it follows only when near the bottom
- Capacity protection: above `max` (default 500) the oldest items are removed automatically — prevents unbounded DOM growth
- Level colors `level="info/success/warning/error/debug"`, `time` timestamps, a header copy button and the `copy` event are built in
- Wrap long lines with `wrap`; horizontal scrolling is the default, as in standard logs

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

**Anti-patterns**: stacking with a plain `div.appendChild(p)` (the reading position collapses, unbounded growth) / combining colors yourself (not using the level color tokens).

---

## 8. Release readiness (CI & publish)

- **GitHub Actions CI (`.github/workflows/ci.yml`)**:
  - The full pipeline `pnpm install` → `eslint` → `vite build` → `tsc (typecheck)` is automated.
- **npm publishing and GitHub releases**:
  - Every package (`tokens`, `core`, `react`, `svelte`) has complete `main`, `module`, `types`, `exports` and `files` fields in its `package.json`.
  - **Actual `npm publish` is performed by the maintainer when needed.** (No automatic publishing is run.)

---

## License

Cubit UI is provided under **TLL-BY-NC-ND** ([Tsuel Liberty License](https://tll.mataku.org)). The Korean text is the reference; if the English differs, the Korean prevails.

- Full license text: [`LICENSE`](./LICENSE)
- [License details link (plain-language explanation)](https://tll.mataku.org/?lang=en#/detail?by=1&attr=tsuel%28%40tsuel-dev%29&cm=titleNameLink&sa=0&nc=1&nd=1&reg_e=1&reg_m=forbid&reg_l=RU%2CCN%2CKP&ad=none&ai=deny&lang=en&fp=6E4B95B8BB)
- About TLL and the generator: <https://tll.mataku.org>

| Condition | Meaning |
|---|---|
| BY | Credit the author `tsuel(@tsuel-dev)` with **work title + name + link** |
| NC | No commercial use |
| ND | No modifications or derivative works |
| Region | Use prohibited in Russia, China and North Korea |
| AI | No use as training data for AI / machine-learning models |

- This is **not** a Creative Commons license and does not meet the Open Source Definition (OSI).
- This document needs review by a legal professional (lawyer) to confirm its legal effect. Automatically generated text is not legal advice.

---

## Contact

If you need to reach the maintainers for any legal, licensing, copyright, security or other obligation, or for coordination between developers, please contact:

**github@mataku.org**
