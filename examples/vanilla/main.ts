import '@cubit-ui/core';
import { setTheme, getTheme } from '@cubit-ui/tokens';

/* URL 파라미터 테마 강제 (?theme=dark|light) — 테스트/공유용 */
const urlTheme = new URLSearchParams(location.search).get('theme');
if (urlTheme === 'dark' || urlTheme === 'light') setTheme(urlTheme);

/* 공통 참조 */
const toastStack = document.getElementById('toastStack') as HTMLElement;

type ToastVariant = 'info' | 'success' | 'warning' | 'error';

function showToast(message: string, variant: ToastVariant = 'info', duration = 3500): void {
  const toast = document.createElement('ui-toast') as any;
  toast.setAttribute('variant', variant);
  toast.setAttribute('duration', String(duration));
  toast.textContent = message;
  toastStack.appendChild(toast);
  requestAnimationFrame(() => {
    toast.open = true;
  });
  toast.addEventListener('close', () => toast.remove());
}

async function withButtonLock(
  button: any,
  busyLabel: string,
  action: () => Promise<void>,
  failLabel = '다시 시도',
): Promise<void> {
  if (button.dataset.busy === '1') return;
  const original = button.textContent;
  button.dataset.busy = '1';
  button.setAttribute('disabled', '');
  button.textContent = busyLabel;
  try {
    await action();
    button.textContent = original;
  } catch (err) {
    button.textContent = failLabel;
    showToast(err instanceof Error ? err.message : '요청 처리 중 오류가 발생했습니다.', 'error');
    setTimeout(() => {
      button.textContent = original;
    }, 2200);
  } finally {
    button.removeAttribute('disabled');
    delete button.dataset.busy;
  }
}

/* =========================================================
 * 1. 테마 토글 (상단바 + 히어로)
 * ========================================================= */
const themeToggles = Array.from(document.querySelectorAll<HTMLElement>('#themeToggle, #themeToggle2'));
function themeLabel(): string {
  return getTheme() === 'dark' ? '☀ 라이트 모드' : '🌙 다크 모드';
}
function applyThemeLabel(): void {
  for (const t of themeToggles) t.textContent = themeLabel();
}
applyThemeLabel();
for (const t of themeToggles) {
  t.removeAttribute('onclick');
  t.addEventListener('click', () => {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
    applyThemeLabel();
    showToast(getTheme() === 'dark' ? '다크 테마가 적용되었습니다.' : '라이트 테마가 적용되었습니다.', 'info', 2000);
  });
}

/* =========================================================
 * 2. Table 구조 프로젝션 (파서 우회 — Props 표/데모 표 공통)
 * ========================================================= */
document.querySelectorAll<HTMLElement>('ui-table').forEach((table) => {
  const tpl = table.querySelector('template');
  if (tpl) {
    table.appendChild(tpl.content);
    tpl.remove();
  }
});

/* =========================================================
 * 3. Modal
 * ========================================================= */
const demoModal = document.getElementById('demoModal') as any;
document.getElementById('openModalBtn')?.addEventListener('click', () => {
  demoModal.open = true;
});
document.getElementById('closeModalBtn')?.addEventListener('click', () => {
  demoModal.open = false;
});
document.getElementById('confirmModalBtn')?.addEventListener('click', () => {
  demoModal.open = false;
  showToast('모달 확인 — 설정이 저장되었습니다.', 'success');
});

/* =========================================================
 * 4. Drawer — 모바일 목차 (사이드바를 Drawer로 복제)
 * ========================================================= */
const navDrawer = document.getElementById('navDrawer') as any;
const navDrawerBody = document.getElementById('navDrawerBody') as HTMLElement;
const navList = document.getElementById('navList') as HTMLElement;

if (navDrawer && navList && navDrawerBody) {
  const clone = navList.cloneNode(true) as HTMLElement;
  clone.removeAttribute('id');
  clone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
  navDrawerBody.appendChild(clone);
  navDrawerBody.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      if (getComputedStyle(navDrawer).display !== 'none') navDrawer.open = false;
    });
  });
  navDrawer.addEventListener('close', () => {
    navDrawer.open = false;
  });
}

/* 햄버거 → Drawer (모바일 전용) */
const isMobile = (): boolean => window.matchMedia('(max-width: 940px)').matches;
document.getElementById('navBtn')?.addEventListener('click', () => {
  if (isMobile()) navDrawer.open = true;
});
/* 데스크톱에서는 Drawer 섹션의 데모 버튼 */
document.getElementById('openDrawerBtn2')?.addEventListener('click', () => {
  navDrawer.open = true;
});
navDrawer.addEventListener('close', () => {
  navDrawer.open = false;
});

/* =========================================================
 * 5. 사이드바 인스턴트 검색 필터
 * ========================================================= */
const navFilter = document.getElementById('navFilter') as HTMLInputElement;
if (navFilter && navList) {
  navFilter.addEventListener('input', () => {
    const q = navFilter.value.trim().toLowerCase();
    const items = navList.querySelectorAll<HTMLAnchorElement>('.nav-item');
    let currentTitle: HTMLElement | null = null;
    let groupVisible = false;

    const titles = Array.from(navList.querySelectorAll<HTMLElement>('.nav-group-title'));
    for (const title of titles) title.style.display = '';

    items.forEach((item) => {
      const match = !q || item.textContent!.toLowerCase().includes(q);
      item.style.display = match ? '' : 'none';
      if (match) groupVisible = true;
      currentTitle = item.previousElementSibling;
    });
    /* 그룹이 완전 비면 그룹 타이틀 숨김 */
    for (const title of titles) {
      let el = title.nextElementSibling as HTMLElement | null;
      let visible = false;
      while (el && !el.classList.contains('nav-group-title')) {
        if (el.classList.contains('nav-item') && el.style.display !== 'none') {
          visible = true;
          break;
        }
        el = el.nextElementSibling as HTMLElement | null;
      }
      title.style.display = visible ? '' : 'none';
    }
    void currentTitle;
    void groupVisible;
  });
}

/* Ctrl+K → 검색 포커스 */
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    navFilter?.focus();
  }
});

/* =========================================================
 * 6. Scrollspy — 현재 섹션 하이라이트 + 크럼브 갱신
 * ========================================================= */
const crumb = document.getElementById('crumb') as HTMLElement;
const sections = Array.from(document.querySelectorAll<HTMLElement>('section.cat'));
const navAnchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav-item'));

function setActive(id: string): void {
  navAnchors.forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
  });
}

const spy = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const sec = entry.target as HTMLElement;
      setActive(sec.id);
      if (crumb) {
        const label = sec.getAttribute('data-crumb') ?? '소개';
        crumb.innerHTML = `Cubit UI <b>/ ${label}</b>`;
      }
      break;
    }
  },
  { rootMargin: '-64px 0px -60% 0px', threshold: 0 },
);
sections.forEach((s) => spy.observe(s));

/* 히어로(맨 위)는 별도 관찰 — 섹션 위에 있으면 소개 */
const hero = document.getElementById('top');
if (hero) {
  new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActive('top');
          if (crumb) crumb.innerHTML = 'Cubit UI <b>/ 소개</b>';
          break;
        }
      }
    },
    { rootMargin: '-64px 0px -70% 0px', threshold: 0 },
  ).observe(hero);
}

/* =========================================================
 * 7. Log — 스트리밍 데모 (push API + 자동 정리)
 * ========================================================= */
const streamLog = document.getElementById('streamLog') as any;
let logSeq = 0;
const LOG_SAMPLES: Array<[string, string]> = [
  ['info', 'GET /api/items — 200 · 18ms'],
  ['success', '캐시 갱신 완료 (key=profile)'],
  ['warning', '재시도 필요 — 503 서비스 과부하'],
  ['error', '파일 쓰기 실패 — 권한 거부'],
  ['debug', 'tick: GC 소요 11ms'],
];
function stamp(): string {
  const t = new Date();
  return [t.getHours(), t.getMinutes(), t.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':');
}
document.getElementById('logPushBtn')?.addEventListener('click', () => {
  if (!streamLog) return;
  const [lv, msg] = LOG_SAMPLES[logSeq % LOG_SAMPLES.length];
  logSeq++;
  streamLog.push(lv, msg, stamp());
});
document.getElementById('logClearBtn')?.addEventListener('click', () => {
  streamLog?.clear();
});

/* =========================================================
 * 8. Toast 데모 버튼
 * ========================================================= */
document.getElementById('toastInfoBtn')?.addEventListener('click', () => showToast('정보 메시지입니다. 배경/글자색은 정보 토큰을 사용합니다.', 'info'));
document.getElementById('toastSuccessBtn')?.addEventListener('click', () => showToast('작업이 성공적으로 완료되었습니다.', 'success'));
document.getElementById('toastErrorBtn')?.addEventListener('click', () => showToast('작업을 완료할 수 없습니다. 다시 시도해 주세요.', 'error'));

/* =========================================================
 * 8. UX 패턴 A — 검색 상태 머신
 * ========================================================= */
const searchInput = document.getElementById('searchInput') as any;
const searchBtn = document.getElementById('searchBtn') as any;
const searchResultsBox = document.getElementById('searchResults') as HTMLElement;

interface SearchItem {
  title: string;
  extra: string;
}

const catalog: SearchItem[] = [
  { title: 'Primary Button — 주요 행동', extra: '가이드' },
  { title: 'Badge 변형 6종', extra: '가이드' },
  { title: 'WCAG 2.1 AA 포커스 표준', extra: '접근성' },
  { title: 'Drawer Offcanvas 패턴', extra: '컴포넌트' },
  { title: 'Skeleton 콘텐츠 Placeholder', extra: '컴포넌트' },
];

function renderSearchState(state: 'loading' | 'done', items?: SearchItem[], error?: string): void {
  if (!searchResultsBox) return;
  searchResultsBox.innerHTML = '';
  if (state === 'loading') {
    const spinner = document.createElement('ui-spinner') as any;
    spinner.setAttribute('size', 'sm');
    searchResultsBox.appendChild(spinner);
    return;
  }
  if (error) {
    const alert = document.createElement('ui-alert') as any;
    alert.setAttribute('variant', 'error');
    alert.setAttribute('title', '검색 실패');
    alert.textContent = error;
    searchResultsBox.appendChild(alert);
    return;
  }
  if (!items || items.length === 0) {
    const alert = document.createElement('ui-alert') as any;
    alert.setAttribute('variant', 'warning');
    alert.setAttribute('title', '검색 결과가 없습니다');
    alert.textContent = '다른 검색어로 다시 시도해 보세요.';
    searchResultsBox.appendChild(alert);
    return;
  }
  for (const item of items) {
    const row = document.createElement('div');
    row.className = 'result-item';
    const title = document.createElement('strong');
    title.textContent = item.title;
    const tag = document.createElement('ui-badge') as any;
    tag.setAttribute('variant', 'outline');
    tag.textContent = item.extra;
    row.append(title, tag);
    searchResultsBox.appendChild(row);
  }
}

async function runSearch(): Promise<void> {
  const query = (searchInput?.value ?? '').trim();
  if (!query) {
    showToast('검색어를 입력해 주세요.', 'warning');
    return;
  }
  searchResultsBox.innerHTML = '';
  await withButtonLock(searchBtn, '검색 중...', async () => {
    renderSearchState('loading');
    await new Promise((r) => setTimeout(r, 900));
    if (/fail/i.test(query)) {
      renderSearchState('done', [], '서버 응답이 500이었습니다. 네트워크를 확인하거나 잠시 후 다시 시도해 주세요.');
      return;
    }
    if (/없음/.test(query)) {
      renderSearchState('done', []);
      return;
    }
    renderSearchState(
      'done',
      catalog.filter((it) => (it.title + it.extra).toLowerCase().includes(query.toLowerCase())),
    );
  });
}
searchBtn?.addEventListener('click', runSearch);
searchInput?.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Enter') runSearch();
});

/* =========================================================
 * 9. UX 패턴 B — 버튼 잠금
 * ========================================================= */
document.getElementById('taskBtn')?.addEventListener('click', async () => {
  await withButtonLock(document.getElementById('taskBtn'), '처리 중...', async () => {
    await new Promise((r) => setTimeout(r, 1400));
    showToast('작업이 완료되었습니다.', 'success');
  });
});

document.getElementById('flakyBtn')?.addEventListener('click', async () => {
  const btn = document.getElementById('flakyBtn');
  await withButtonLock(
    btn,
    '처리 중...',
    async () => {
      await new Promise((r) => setTimeout(r, 1200));
      if (!btn.dataset.sustain) {
        btn.dataset.sustain = '1';
        throw new Error('전송 실패 (요청 타임아웃)');
      }
      showToast('재시도 성공 — 서버가 정상 응답했습니다.', 'success');
      delete btn.dataset.sustain;
    },
  );
});

/* =========================================================
 * 10. UX 패턴 C — 실시간 상태 칩 동기화
 * ========================================================= */
const stateChip = document.getElementById('serverStateChip') as any;
const stateUpdated = document.getElementById('stateUpdated') as HTMLElement;
const stateSpinner = document.getElementById('stateSpinner') as any;

const STATES: Array<{ label: string; variant: string }> = [
  { label: '방송중', variant: 'success' },
  { label: '일시정지', variant: 'warning' },
  { label: '대기 중', variant: 'outline' },
];
let stateIndex = 0;

function renderServerState(): void {
  if (!stateChip) return;
  const s = STATES[stateIndex];
  stateChip.setAttribute('variant', s.variant);
  stateChip.textContent = s.label;
  if (stateUpdated) {
    const t = new Date();
    stateUpdated.textContent = `${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}:${t.getSeconds().toString().padStart(2, '0')}`;
  }
}
renderServerState();
window.setInterval(() => {
  stateIndex = (stateIndex + 1) % STATES.length;
  if (stateSpinner) {
    stateSpinner.style.visibility = 'visible';
    setTimeout(() => {
      if (stateSpinner) stateSpinner.style.visibility = 'hidden';
    }, 700);
  }
  window.setTimeout(renderServerState, 700);
}, 4000);

// ---- v1.1 demos: segmented / stepper / chip ----
const segDemo = document.getElementById('segDemo');
const segOut = document.getElementById('segOut');
segDemo?.addEventListener('change', (e) => {
  if (segOut) segOut.textContent = `선택: ${(e as CustomEvent<{ value: string }>).detail.value}`;
});

const stepDemo = document.getElementById('stepDemo') as (HTMLElement & { current: number }) | null;
document.getElementById('stepPrev')?.addEventListener('click', () => {
  if (stepDemo) stepDemo.current = Math.max(0, stepDemo.current - 1);
});
document.getElementById('stepNext')?.addEventListener('click', () => {
  if (stepDemo) stepDemo.current = Math.min(3, stepDemo.current + 1);
});

document.getElementById('chipBox')?.addEventListener('remove', (e) => {
  // 칩은 스스로 사라지지 않는다: 앱이 직접 제거한다.
  (e.target as HTMLElement).remove();
});
