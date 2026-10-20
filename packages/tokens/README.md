# @cubit-ui/tokens

Design tokens for Cubit UI: primitive and semantic tokens, light/dark themes, and CSS variables.

> **Language notice:** The Korean README ([README.md](https://github.com/tsuel-dev/Cubit/blob/main/README.md)) in the repository root always takes precedence. If this document differs from it or is inaccurate, the Korean README prevails.

## Install

```bash
npm install @cubit-ui/tokens
```

## Usage

```ts
import '@cubit-ui/tokens/css/tokens.css';
import '@cubit-ui/tokens/css/dark.css';
import { setTheme } from '@cubit-ui/tokens';

setTheme('dark'); // 'light' | 'dark' | 'system'
```

## Links

- Repository & full documentation: <https://github.com/tsuel-dev/Cubit>
- Issues: <https://github.com/tsuel-dev/Cubit/issues>
- Contact (legal, licensing, security): github@mataku.org

License: TLL-BY-NC-ND (Tsuel Liberty License) — see [LICENSE](./LICENSE).
