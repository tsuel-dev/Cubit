# Cubit UI — Design System & Component Library

[한국어](README.md) | [English](README.en.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [Español](README.es.md) | [Português](README.pt.md)

> **言語に関する注意:** 韓国語の README ([README.md](README.md)) が常に優先されます。この翻訳の内容が韓国語の README と異なる場合、または翻訳が不正確な場合は、韓国語の README を優先します。

> **独自のデザイントークンシステムを基準とした標準化と、フレームワーク横断で一貫した UX の提供**

Cubit UI は、堅牢で信頼感のある幾何学的な美学(**Cubit · Minimal**: 角丸トークン (8/12/16px + Pill)、4px/8px の余白、くっきりとした枠線のコントラスト)に基づく標準 UI コンポーネントライブラリです。

コアコンポーネントを標準の **Web Components(Custom Elements + スコープ付き Shadow DOM)** として一度だけ実装し、**React** と **Svelte** のラッパーを 1:1 で提供することで、フレームワークに依存せず、まったく同じデザイントークンと API 契約を維持します。

---

## 0. クイックスタート

```bash
git clone https://github.com/tsuel-dev/Cubit.git
cd Cubit
pnpm install
pnpm run build
```

---

## 1. アーキテクチャとパッケージ構成

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

## 2. デザイントークン仕様(不変の基準値を遵守)

- **カラー基準**:
  - 基本の背景 / 前景: `White (#ffffff)` / `Black (#000000)`
  - アクセント (Primary / Accent): `#ff5500`
  - 補助・背景用 (Secondary): `#ffebcc`、`#ffe4c9`
  - ダークモード: Black (`#000000`) と段階的な Dark Gray の背景、高コントラスト補正(`#ff5500` の可読性を維持し、WCAG 2.1 AA の 4.5:1 以上のコントラストを保証)
- **美学 (Cubit · Minimal)**:
  - 角丸トークン: `--ui-radius-sm: 8px`(ボタン・カードなど一般的なコントロール) / `--ui-radius-md: 12px`(コンテナ) / `--ui-radius-lg: 16px`(モーダル・大型パネル) / `--ui-radius-full: 9999px`(バッジ・スイッチトラックなどの pill)
  - 余白スケール: `4px / 8px` を基準としたトークン
  - 枠線: くっきりとした枠線と階層の分離(不要な影は排除)
- **タイポグラフィ**:
  - 外部フォントをダウンロードせず、OS ネイティブの**システムフォントスタック**を使用

---

## 3. インストールと使い方(ローカルワークスペース基準)

モノレポ内、またはローカルプロジェクトからパッケージを参照して使用できます。

### 3.1. デザイントークンのスタイルシートを読み込む(共通・必須)
プロジェクトのエントリポイント(HTML またはルートバンドル)にトークン CSS を含めます:
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

## 4. 30 種のコンポーネントの API と Props 仕様表

| 区分 | コンポーネントタグ / 名前 | 主な Props / 属性 | 発火イベント | アクセシビリティ (ARIA / WCAG) |
| :--- | :--- | :--- | :--- | :--- |
| **基本 1** | `ui-button` / `Button` | `variant` (primary/secondary/outline/ghost/danger), `size` (sm/md/lg), `disabled`, `type` | `click` | `aria-disabled`、高コントラストのフォーカスリング |
| **基本 2** | `ui-input` / `Input` | `value`, `placeholder`, `type`, `disabled`, `readonly`, `size`, `invalid` | `input`, `change` | `aria-invalid`、`aria-disabled` |
| **基本 3** | `ui-checkbox` / `Checkbox` | `checked`, `disabled`, `indeterminate`, `name`, `value` | `change` | `role="checkbox"`、`aria-checked`、Space キー |
| **基本 4** | `ui-radio` / `Radio` | `checked`, `disabled`, `name`, `value` | `change` | `role="radio"`、グループ内で排他的に選択、Space キー |
| **基本 5** | `ui-switch` / `Switch` | `checked`, `disabled` | `change` | `role="switch"`、`aria-checked`、pill トラック + 円形サム |
| **基本 6** | `ui-select` / `Select` | `value`, `placeholder`, `disabled`, `size`, `open` | `change`, `open`, `close` | `role="combobox"`、Esc で閉じる、外側クリックで閉じる |
| **基本 7** | `ui-modal` / `Modal` | `open`, `title` | `close` | `role="dialog"`、`aria-modal`、フォーカストラップ、Esc で閉じる |
| **基本 8** | `ui-toast` / `Toast` | `variant` (info/success/warning/error), `duration`, `open` | `close` | `role="status"`、`aria-live="polite"`、自動消滅タイマー |
| **基本 9** | `ui-tooltip` / `Tooltip` | `content`, `position` (top/bottom/left/right) | - | `role="tooltip"`、hover/focus でトリガー、Esc で解除 |
| **基本 10** | `ui-tabs` / `Tabs` | `value` | `change` | `role="tablist/tab/tabpanel"`、矢印/Home/End キー |
| **基本 11** | `ui-badge` / `Badge` | `variant` (primary/secondary/outline/success/warning/error), `size` | - | pill ラベル、高コントラストのテキスト |
| **基本 12** | `ui-spinner` / `Spinner` | `size` (sm/md/lg) | - | `role="status"`、`aria-label="Loading"` |
| **基本 13** | `ui-alert` / `Alert` | `variant` (info/success/warning/error), `title`, `closable` | `close` | `role="alert"`、色のコントラスト比 4.5:1 を保証 |
| **拡張 14** | `ui-card` / `Card` | `variant` (default/elevated/secondary/bordered), `bordered` | - | header、body、footer スロットを分離 |
| **拡張 15** | `ui-accordion` / `Accordion` | `multiple` (`ui-accordion-item`: `open`, `title`, `disabled`) | `change`, `toggle-item` | `role="region"`、`aria-expanded`、Enter/Space |
| **拡張 16** | `ui-dropdown` / `Dropdown` | `open`, `placement`, `disabled` | `open`, `close` | `role="menu"`、`role="menuitem"`、外側クリックで閉じる |
| **拡張 17** | `ui-progress` / `Progress` | `value`, `max`, `size`, `variant` | - | `role="progressbar"`、`aria-valuenow/min/max` |
| **拡張 18** | `ui-pagination` / `Pagination` | `current`, `total`, `page-size` | `change` | `role="navigation"`、`aria-current="page"`、キーボード操作 |
| **拡張 19** | `ui-table` / `Table` | `striped`, `bordered`, `hoverable` | - | `role="table"`、ホバー時に補助背景色 (`#ffe4c9`) |
| **拡張 20** | `ui-avatar` / `Avatar` | `src`, `alt`, `name`, `size` (sm/md/lg), `shape` (circle/square) | - | 既定は円形、`shape="square"` オプション、画像の読み込み失敗時はイニシャルにフォールバック |
| **拡張 21** | `ui-breadcrumbs` / `Breadcrumbs` | `separator` (`ui-breadcrumb-item`: `href`, `current`) | - | `role="navigation"`、`aria-current="page"` |
| **拡張 22** | `ui-drawer` / `Drawer` | `open`, `side` (left/right), `title` | `close` | フォーカストラップ、Esc/バックドロップで閉じる、オフキャンバス |
| **拡張 23** | `ui-skeleton` / `Skeleton` | `variant` (text/circle/rect), `width`, `height`, `lines` | - | `aria-hidden`、`prefers-reduced-motion` では shimmer を停止 |
| **拡張 24** | `ui-navbar` / `Navbar` | `brand`, `sticky` | - | `role="navigation"`、既定のリンクスロット + `actions` スロット |
| **データ 25** | `ui-log` / `Log` (+ `ui-log-item` / `LogItem`) | `label`, `height`, `wrap`, `auto-scroll`, `max`, `empty` (`ui-log-item`: `level`(info/success/warning/error/debug), `time`) | `copy` | `role="log"`、`aria-live="polite"`、スティッキーボトム、API: `push()` / `scrollDown()` / `clear()` |
| **新規 26** | `ui-textarea` / `Textarea` | `value`, `placeholder`, `rows`, `maxlength`, `resize` (none/vertical/both), `size`, `name`, `disabled`, `readonly`, `invalid` | `input`, `change` | `aria-invalid`、フォーム連携(`name`、reset、fieldset disabled)、`maxlength` 指定時は文字数を表示 |
| **新規 27** | `ui-empty-state` / `EmptyState` | `heading`, `description`, `size` (sm/md), `variant` (default/error) | - | 見出しは `<h3>`、装飾アイコンは支援技術から非表示、アクションスロット |
| **新規 28** | `ui-segmented` / `Segmented` | `value`, `size` (sm/md/lg), `disabled` (`ui-segment`: `value`, `disabled`) | `change` | `role="radiogroup"` / `role="radio"`、`aria-checked`、矢印/Home/End キー(roving tabindex) |
| **新規 29** | `ui-stepper` / `Stepper` | `current`, `orientation` (horizontal/vertical) (`ui-step`: `label`, `description`, `status`) | - | `role="list"` / `listitem`、`aria-current="step"`、ステップの状態をスクリーンリーダーに伝達 |
| **新規 30** | `ui-chip` / `Chip` | `variant` (neutral/primary/success/warning/error), `size` (sm/md), `removable`, `disabled`, `remove-label` | `remove` | 削除可能ならフォーカス可能、× ボタンに `aria-label`、Delete/Backspace で削除を要求 |

> **フォームのサポート (v1.1):** `ui-input`、`ui-textarea`、`ui-checkbox`、`ui-radio`、`ui-switch` はフォームに参加します。`name` で送信され、`<form>.reset()` と `<fieldset disabled>` に従います。

---

## 5. ライト / ダークモードの切り替えガイド

ライブラリは既定で CSS 変数ベースのテーマシステムを使用しているため、HTML ドキュメントの最上位タグ(`html` または `body`)に `data-theme` 属性を指定するだけで、すべてのコンポーネントが即座に切り替わります。

### 5.1. HTML 属性で直接切り替える
```html
<!-- Force light mode -->
<html data-theme="light">

<!-- Force dark mode -->
<html data-theme="dark">

<!-- Follow the OS theme (without data-theme, prefers-color-scheme applies) -->
<html>
```

### 5.2. JS/TS ヘルパー関数を使う
`@cubit-ui/tokens` が提供するランタイムヘルパーを使用できます:
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

## 6. デザイントークンのカスタマイズ方法

グローバル CSS または特定のコンテナスコープで CSS Custom Properties を上書きすると、配下のコンポーネントに即座に反映されます。

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

## 7. UX 標準利用ガイドライン(実サービス監査に基づくパターン)

実サービスの監査で繰り返し見つかった問題の種類を、**コンポーネント組み合わせの標準パターン**として定義します。
以下の 4 つは、ライブラリのドキュメント(`examples/vanilla` — UX Patterns セクション)のライブデモと同じです。

### 7.1. 検索の状態マシン — 読み込み中 / 成功 / 結果なし / 失敗の 4 状態を明示

**原則**: 検索・照会は 4 つの状態を「常に明示的に」描画します。
`遅い読み込み → 終わらない読み込み`(読み込み表示の欠落)、`失敗 → 結果なしとして隠蔽`、`結果なし → 空の画面` は、いずれもバグとして扱います。

- **読み込み中**: 結果エリアに `ui-spinner size="sm"` を表示し、検索ボタンには 7.2 のロックパターンを適用
- **結果なし**: `ui-alert variant="warning"` + 次のアクションの案内(「別の検索語でもう一度お試しください」)
- **失敗**: `ui-alert variant="error"` + 再試行の方法まで表示(ネットワークの問題であるという事実をボタンのラベルに隠さない)
- 結果エリアのコンテナには `aria-live="polite"` を付与(スクリーンリーダーが更新を伝える)

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

**アンチパターン**: 結果エリアをそのままにしてトーストだけで終わらせる / 失敗を「完了」バッジで表現する。

### 7.2. ボタンの二重クリックのロック — busy ガード + 失敗後の再試行ラベル

**原則**: 処理に 0.5 秒以上かかる、または重複作成の影響が大きい操作のボタンは、必ずロックします。
ロックのない「無防備なボタン」は、ダブルクリックで二重送信を生みます。

- 処理中: `disabled` 属性 + ラベルを `"処理中..."` に差し替え
- 失敗時: ラベルを `"再試行"` に戻す + `ui-toast variant="error"` で原因を表示(2 秒後に元のラベルへ復元)
- 成功時: 元のラベルへ復元 + `ui-toast variant="success"` で結果をフィードバック

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

**アンチパターン**: タイムアウトなしで `await` する(ユーザーが再クリックできてしまう) / 失敗を無言で元に戻す。

### 7.3. リアルタイム状態チップ — バッジの値は「実際の値」に由来させる

**原則**: サーバー/サービスの状態チップ(`ui-badge`)の `variant` とテキストは、必ず最新の状態値に従わなければなりません。
ラベルだけが変わって色が固定されたり、値がないまま常に「正常」を表示し続けたりするのは**虚偽の表示**です。

- 更新開始: 項目の横に `ui-spinner size="sm"` を表示(更新中であることを知らせる)
- 値の到着: `badge.setAttribute('variant', 状態に合った variant)` + テキストの差し替え — 同期的に更新
- 最終確認時刻を常に併記(`"最終確認: 19:39:23"`)— 鮮度をユーザー自身が判断できるようにする
- 異なる状態を区別 → `success`(正常) / `warning`(遅延・保留) / `outline`(待機)

```html
<ui-badge id="stateChip" variant="outline">Waiting</ui-badge>
<ui-spinner size="sm" id="stateSpinner" style="visibility: hidden;"></ui-spinner>
Last checked: <span id="stateUpdated">—</span>
```

**アンチパターン**: 一度「正常」とチップを埋めて永久に固定する / 失敗状態なのに成功バッジを維持する。

### 7.4. ログ・長文テキスト — `<pre>` の落書きではなく `ui-log`

**原則**: サーバーログ、作業履歴、実行結果のように増え続ける長文テキストは、`ui-log` で標準化します。

- アクセシビリティを内蔵: `role="log"` + `aria-live="polite"`(自分で指定する必要はありません)
- スティッキーボトム: ユーザーが上の方を読んでいる間は、新しい項目が来ても強制スクロールせず、下端付近にいるときだけ追従
- 容量の保護: `max`(既定 500)を超えると古い項目から自動削除 — DOM の無限増大を防止
- レベル色 `level="info/success/warning/error/debug"`、`time` タイムスタンプ、ヘッダーのコピーボタンと `copy` イベントを内蔵
- 長い行の折り返しは `wrap`。標準的なログと同様、横スクロールが既定

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

**アンチパターン**: 単に `div.appendChild(p)` で積み上げる(読んでいた位置が崩れる、無限増大) / 色のコントラストを各自で組み合わせる(レベル色トークンを使わない)。

---

## 8. リリース準備状況(CI と公開)

- **GitHub Actions CI (`.github/workflows/ci.yml`)**:
  - `pnpm install` → `eslint` → `vite build` → `tsc (typecheck)` の全パイプラインを自動化済みです。
- **npm 公開と GitHub リリース**:
  - すべてのパッケージ(`tokens`、`core`、`react`、`svelte`)は、`package.json` に `main`、`module`、`types`、`exports`、`files` の記述が完成した形で設定されています。
  - **実際の `npm publish` は、必要に応じてメンテナーが実施します。**(自動公開は実行していません。)

---

## ライセンス / License

Cubit UI は **TLL-BY-NC-ND**([Tsuel Liberty License](https://tll.mataku.org))で提供されます。韓国語の文言が基準であり、他の言語と異なる場合は韓国語が優先されます。

- ライセンス全文: [`LICENSE`](./LICENSE)
- [ライセンス詳細リンク(やさしい説明・条件の確認)](https://tll.mataku.org/?lang=ja#/detail?by=1&attr=tsuel%28%40tsuel-dev%29&cm=titleNameLink&sa=0&nc=1&nd=1&reg_e=1&reg_m=forbid&reg_l=RU%2CCN%2CKP&ad=none&ai=deny&lang=ja)
- TLL の紹介とジェネレーター: <https://tll.mataku.org>

| 条件 | 内容 |
|---|---|
| BY | 著作者 `tsuel(@tsuel-dev)` を **作品タイトル + 名前 + リンク** で表示すること |
| NC | 営利目的での利用は禁止 |
| ND | 改変・二次的著作物の作成は禁止 |
| 地域 | ロシア・中国・北朝鮮での利用は禁止 |
| AI | AI・機械学習モデルの学習データとしての利用は禁止 |

- これはクリエイティブ・コモンズ・ライセンスでは**なく**、オープンソース(OSI)の定義も満たしません。
- この文書の法的効力については、専門家(弁護士)による確認が必要です。自動生成された文言は法律上の助言ではありません。

---

## 連絡先 / Contact

法的な要請、ライセンス・著作権に関するお問い合わせ、セキュリティ上の問題の報告、または開発者間の調整が必要な場合は、次のアドレスまでご連絡ください。

**github@mataku.org**
