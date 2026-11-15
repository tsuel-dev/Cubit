# @cubit-ui/react

React wrappers for the Cubit UI Web Components (type-safe props, event mapping). Requires React 18 or 19.

> **Language notice:** The Korean README ([README.md](https://github.com/tsuel-dev/Cubit/blob/main/README.md)) in the repository root always takes precedence. If this document differs from it or is inaccurate, the Korean README prevails.

## Install

```bash
npm install @cubit-ui/react
```

## Usage

```tsx
import { Button, Input } from '@cubit-ui/react';

export const Demo = () => (
  <>
    <Input placeholder="Name" />
    <Button variant="primary">Save</Button>
  </>
);
```

## Links

- Repository & full documentation: <https://github.com/tsuel-dev/Cubit>
- Issues: <https://github.com/tsuel-dev/Cubit/issues>
- Contact (legal, licensing, security): github@mataku.org

License: TLL-BY-NC-ND (Tsuel Liberty License) — see [LICENSE](./LICENSE). License details: [tll.mataku.org](https://tll.mataku.org/?lang=en#/detail?by=1&attr=tsuel&cm=titleNameLink&sa=0&nc=1&nd=1&reg_e=1&reg_m=forbid&reg_l=KP%2CCN%2CRU&ad=none&ai=nc-only&rp_e=1&rp=%5B%5B%22KP%22%2C1%2C%22combined%22%2C%22%22%2C%22legal%22%2C%22%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD%28KR%29%EC%9D%98+%EB%82%A8%EB%B6%81%EA%B5%90%EB%A5%98%ED%98%91%EB%A0%A5%EB%B2%95%28Inter-Korean+Exchange+and+Cooperation+Act%29%EC%97%90+%EB%94%B0%EB%9D%BC+%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD+%EA%B5%AD%EB%AF%BC%EC%9D%80+%EB%B6%81%ED%95%9C%28KP%29%EC%97%90+%EC%9E%90%EB%A3%8C%EB%A5%BC+%EC%A0%9C%EA%B3%B5%ED%95%A0+%EC%88%98+%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4.+%EA%B4%80%EB%A0%A8%ED%95%98%EC%97%AC+%EC%A0%95%EB%B6%80+%EA%B8%B0%EA%B4%80%EC%9D%98+%ED%97%88%EA%B0%80%EA%B0%80+%ED%95%84%EC%9A%94%ED%95%A9%EB%8B%88%EB%8B%A4.%22%2C%22contract%22%2C%22%22%5D%2C%5B%22CN%22%2C1%2C%22combined%22%2C%22%22%2C%22security%2ChumanRights%22%2C%22%EA%B5%AD%EA%B0%80+%EC%B0%A8%EC%9B%90%EC%9D%98+%EC%9D%B8%ED%84%B0%EB%84%B7+%EA%B2%80%EC%97%B4%2C+%ED%91%9C%ED%98%84%EC%9D%98+%EC%9E%90%EC%9C%A0+%EC%A0%9C%ED%95%9C+%EB%B0%8F+%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4+%ED%86%B5%EC%A0%9C+%EB%AC%B8%EC%A0%9C%2C+%EC%A0%80%EC%9E%91%EA%B6%8C+%EC%9D%98%EC%8B%9D%EC%9D%98+%EA%B5%AD%EA%B0%80%EC%A0%81+%EB%B6%80%EC%9E%AC+%EB%93%B1%EC%9C%BC%EB%A1%9C+%EC%9D%B8%ED%95%B4+%EC%A0%9C%ED%95%9C%ED%95%A9%EB%8B%88%EB%8B%A4.%22%2C%22%22%2C%22%22%5D%2C%5B%22RU%22%2C1%2C%22territory%22%2C%22%22%2C%22conflict%22%2C%22%EB%9D%BC%EC%9D%B4%EC%84%BC%EC%8A%A4+%EC%A0%9C%EA%B3%B5%EC%9E%90%EB%8A%94+%EC%A0%84%EC%9F%81%EC%97%90+%EA%B2%B0%EC%82%AC+%EB%B0%98%EB%8C%80%ED%95%98%EB%A9%B0%2C+%EB%8C%80%EB%9F%AC%EC%8B%9C%EC%95%84+%EA%B2%BD%EC%A0%9C%EC%A0%9C%EC%9E%AC+%EC%A0%95%EC%B1%85%EC%97%90+%EB%8F%99%EC%9D%98%ED%95%98%EA%B3%A0+%EC%9D%B4%EB%A5%BC+%EC%A4%80%EC%88%98%ED%95%98%EA%B8%B0+%EC%9C%84%ED%95%9C+%EC%A1%B0%EC%B9%98%EC%9E%85%EB%8B%88%EB%8B%A4.+%EC%9D%B4%EC%97%90+%EB%8C%80%ED%95%B4+%EC%86%8C%EB%AA%85%ED%95%A0+%EC%88%98+%EC%9E%88%EA%B1%B0%EB%82%98+%EC%A0%84%EC%9F%81%EC%97%90+%EB%B0%98%EB%8C%80%ED%95%98%EB%8A%94+%EC%A6%9D%EB%B9%99+%EC%9E%90%EB%A3%8C%EA%B0%80+%EC%9E%88%EC%9D%84+%EA%B2%BD%EC%9A%B0+%ED%97%88%EC%9A%A9%EB%90%A9%EB%8B%88%EB%8B%A4.%22%2C%22contract%22%2C%22%22%5D%5D&aii=deny&aix=deny&ail=1&tdm=1&fb=military%2Csurveillance%2Chate%2Cadult%2Cgambling&pat=grantRetaliate&bnd=allow&cp=docs&cc_e=1&cc_c=cubit%40mataku.org&tm=1&nt=before&term_e=1&term_d=0&law=KR&note=default+contact+%3A+cubit%40mataku.org&fp=422DF40527).
