# npm 배포 절차 (PUBLISHING)

`@cubit-ui/tokens`, `@cubit-ui/core`, `@cubit-ui/react`, `@cubit-ui/svelte` 4개 패키지를 npm에 올리는 절차입니다.
**로그인·패스키 승인은 관리자가 직접 합니다.** 비밀번호·토큰·OTP는 채팅이나 파일 어디에도 붙여넣지 마세요.

배포 방법은 두 가지입니다. 평소에는 **A. 태그 자동 배포**(GitHub ↔ npm 연동)를 쓰고, 연동이 막혔을 때만 **B. 수동 배포**를 씁니다.

## 0. 준비 (최초 1회)

1. npm 계정 + **2단계 인증** (패스키/FIDO2 가능)
2. npm 조직 `cubit-ui` (Free 플랜, 공개 패키지 무료) — 만들어져 있음
3. 4개 패키지가 npm에 한 번 이상 올라가 있어야 연동 설정을 할 수 있습니다.

## A. 태그 자동 배포 — GitHub Actions ↔ npm Trusted Publishing

토큰 없이 GitHub이 OIDC로 npm에 신원을 증명하는 방식입니다. 장기 토큰을 저장하지 않으므로 가장 안전합니다.

### A-1. 연동 설정 (최초 1회, 패키지 4개 각각)

npm 웹에서: 패키지 페이지 → **Settings → Trusted Publisher → GitHub Actions** 에 아래 값을 입력합니다.

| 항목 | 값 |
| :--- | :--- |
| Organization or user | `tsuel-dev` |
| Repository | `Cubit` |
| Workflow filename | `publish.yml` |
| Environment | (비워둠) |

또는 CLI(대화형 터미널에서 패스키 승인 필요):

```bash
npm trust github @cubit-ui/tokens --file publish.yml --repo tsuel-dev/Cubit --allow-publish -y
npm trust github @cubit-ui/core   --file publish.yml --repo tsuel-dev/Cubit --allow-publish -y
npm trust github @cubit-ui/react  --file publish.yml --repo tsuel-dev/Cubit --allow-publish -y
npm trust github @cubit-ui/svelte --file publish.yml --repo tsuel-dev/Cubit --allow-publish -y
npm trust list @cubit-ui/core
```

### A-2. 배포하기

1. 4개 패키지의 `version` 을 같은 값으로 올립니다 (`node scripts/release.mjs --bump 1.0.2 --dry-run` 로 점검 가능).
2. 커밋하고 `main` 에 push 합니다. CI가 통과하는지 확인합니다.
3. 태그를 만들어 push 합니다:

```bash
git tag v1.0.2
git push origin v1.0.2
```

`publish.yml` 이 lint → build → typecheck → (태그와 패키지 버전 일치 확인) → 배포를 실행하고, 배포 증명(provenance)이 자동으로 붙습니다. 이미 올라간 버전은 건너뜁니다.

## B. 수동 배포 (대화형 터미널, 패스키)

```bash
npm login
node scripts/release.mjs --dry-run      # 사전 점검 + 빌드 + dry-run (업로드 없음)
node scripts/release.mjs                # 점검 후 "publish" 를 입력하면 배포
```

- 패키지마다 npm이 브라우저 인증 URL을 출력합니다. Enter → 브라우저에서 패스키로 승인합니다.
- 비대화형 환경(CI, 에디터 내장 도구 등)에서는 승인 창을 띄울 수 없어 실패합니다. 반드시 직접 연 터미널에서 실행하세요.
- 로컬 디스크의 clone 에서 실행해야 합니다(네트워크 드라이브에서는 vite 빌드가 안 됩니다).

## 확인

```bash
npm view @cubit-ui/core version
npm trust list @cubit-ui/core
```

배포 직후에는 레지스트리 반영에 몇 분 걸려 `E404` 가 나올 수 있습니다. 업로드 로그에 `+ @cubit-ui/...@x.y.z` 가 찍혔다면 성공이니 잠시 후 다시 확인하세요.

## 자주 나는 문제

| 증상 | 원인 / 해결 |
| :--- | :--- |
| 직후 `npm view` 가 `E404` | 반영 지연(약 3분). 업로드 로그의 `+ 패키지@버전` 을 먼저 확인 |
| `ERR_PNPM_OTP_NON_INTERACTIVE` | `pnpm publish` 는 비대화형에서 패스키 승인 불가 → 직접 연 터미널에서 B 방법 사용 |
| `E403 cannot publish over the previously published versions` | 같은 버전 재배포 불가 → 버전을 올림 |
| `E404 Scope not found` | npm 조직 `cubit-ui` 없음 |
| Actions 에서 `ENEEDAUTH` / 401 | Trusted Publisher 미설정, 또는 워크플로 파일명·저장소 값이 설정과 다름 |
| Actions 에서 `provenance` 오류 | `package.json` 의 `repository.url` 이 실제 저장소와 일치해야 함(현재 일치) |
| 태그 push 후 "tag matches" 단계 실패 | 태그(`vX.Y.Z`)와 4개 패키지 `version` 이 다름 |

## scope 이름을 바꾸는 경우

`@cubit-ui` 를 쓸 수 없다면 저장소 전체에서 `@cubit-ui/` 를 새 scope 로 치환해야 합니다
(`package.json` 4개 + examples + README 7종 + `pnpm-lock.yaml`). 치환 후 `pnpm install` 로 lockfile 을 갱신하고 `node scripts/release.mjs --dry-run` 을 통과시키세요.

## 문의

법적·라이선스·보안 관련 연락은 github@mataku.org 로 받습니다.
