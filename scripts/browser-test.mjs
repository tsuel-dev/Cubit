// 브라우저 동작 테스트(실제 Chrome). 빌드한 core 번들이 필요하다:
//   CUBIT_CORE=packages/core vite build --config scripts/browser-test.vite.config.mjs   (결과: bundle/cubit-core.js)
//   PUPPETEER_CORE=<puppeteer-core 경로 또는 생략> CHROME_PATH=<chrome 실행 파일> node scripts/browser-test.mjs
// bundle/ 은 이 파일과 같은 폴더 기준이므로 scripts/bundle/ 에 두거나 OUT=scripts/bundle 로 빌드한다.
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const { default: puppeteer } = await import(process.env.PUPPETEER_CORE || 'puppeteer-core');

const here = dirname(fileURLToPath(import.meta.url));
const page_html = `<!doctype html><meta charset="utf-8"><body>
<form id="f"><ui-input id="email" name="email" aria-label="email" required autocomplete="username"></ui-input>
<ui-input id="pw" type="password" aria-label="pw" autocomplete="current-password"></ui-input>
<ui-textarea id="ta" aria-label="memo"></ui-textarea></form>
<button id="before">before</button>
<ui-modal id="m" title="T"><ui-input id="mi" aria-label="mi"></ui-input><div slot="footer"><button id="mb">ok</button></div></ui-modal>
<ui-select id="sel" aria-label="s"><ui-option value="a">Apple</ui-option><ui-option value="b">Banana</ui-option><ui-option value="c">Cherry</ui-option></ui-select>
<ui-dropdown id="dd"><button slot="trigger" id="ddt">menu</button><ui-dropdown-item id="i1">one</ui-dropdown-item><ui-dropdown-item id="i2">two</ui-dropdown-item></ui-dropdown>
<div id="rg"><ui-radio name="g" value="1" id="r1">1</ui-radio><ui-radio name="g" value="2" id="r2">2</ui-radio><ui-radio name="g" value="3" id="r3" disabled>3</ui-radio><ui-radio name="g" value="4" id="r4">4</ui-radio></div>
<ui-tabs id="tabs" value="a"><ui-tab value="a">A</ui-tab><ui-tab value="b">B</ui-tab><ui-tab-panel value="a">pa</ui-tab-panel><ui-tab-panel value="b">pb</ui-tab-panel></ui-tabs>
<ui-tooltip id="tt" content="Helpful"><button>h</button></ui-tooltip>
<ui-button id="b1">1</ui-button><ui-button id="b2">2</ui-button>
<script type="module" src="/cubit-core.js"></script>`;

const server = createServer((req, res) => {
  if (req.url === '/' ) { res.setHeader('content-type', 'text/html'); res.end(page_html); return; }
  if (req.url === '/cubit-core.js') { res.setHeader('content-type', 'text/javascript'); res.end(readFileSync(join(here, 'bundle/cubit-core.js'))); return; }
  res.statusCode = 404; res.end();
}).listen(0);
const port = server.address().port;

const results = {};
const check = (name, ok, extra = '') => (results[name] = ok ? `OK${extra ? ' ' + extra : ''}` : `FAIL ${extra}`);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'], headless: 'new' });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`http://127.0.0.1:${port}/`);
  await page.waitForFunction(() => customElements.get('ui-input') && customElements.get('ui-modal'));
  await wait(200);

  // ---------- 1. 입력 이벤트: 실제 키보드 입력에서 호스트로 새는 기본 input 이벤트가 없어야 한다 ----------
  await page.evaluate(() => {
    window.__ev = [];
    document.getElementById('email').addEventListener('input', (e) => window.__ev.push(e instanceof CustomEvent ? 'custom' : 'native'));
    document.getElementById('ta').addEventListener('input', (e) => window.__ev.push(e instanceof CustomEvent ? 'ta-custom' : 'ta-native'));
  });
  await page.click('#email');
  await page.keyboard.type('ab');
  await page.click('#ta');
  await page.keyboard.type('x');
  const ev = await page.evaluate(() => window.__ev);
  check('input-no-native-leak', ev.join() === 'custom,custom,ta-custom', ev.join());

  // ---------- 2. 속성 전달/검증 ----------
  const attrs = await page.evaluate(() => {
    const i = document.getElementById('email').shadowRoot.querySelector('input');
    return { ac: i.getAttribute('autocomplete'), req: i.required };
  });
  check('passthrough-attributes', attrs.ac === 'username' && attrs.req, JSON.stringify(attrs));
  const pwac = await page.evaluate(() => document.getElementById('pw').shadowRoot.querySelector('input').autocomplete);
  check('password-autocomplete', pwac === 'current-password', pwac);

  // ---------- 3. 제자리 갱신: aria-label/placeholder 변경에도 포커스·입력 유지 ----------
  await page.click('#email');
  await page.evaluate(() => { const el = document.getElementById('email'); window.__inputBefore = el.shadowRoot.querySelector('input'); el.setAttribute('aria-label', 'changed'); el.setAttribute('placeholder', 'p'); el.setAttribute('invalid', ''); });
  const kept = await page.evaluate(() => { const el = document.getElementById('email'); const i = el.shadowRoot.querySelector('input'); return { same: i === window.__inputBefore, focus: el.shadowRoot.activeElement === i, label: i.getAttribute('aria-label'), invalid: i.getAttribute('aria-invalid'), val: i.value }; });
  check('attribute-update-keeps-element-and-focus', kept.same && kept.focus && kept.label === 'changed' && kept.invalid === 'true' && kept.val === 'ab', JSON.stringify(kept));
  await page.evaluate(() => document.getElementById('email').removeAttribute('invalid'));

  // ---------- 4. 폼 검증과 Enter 제출 ----------
  await page.evaluate(() => { window.__submits = 0; document.getElementById('f').addEventListener('submit', (e) => { e.preventDefault(); window.__submits += 1; }); });
  await page.click('#pw');
  await page.keyboard.press('Enter');
  await wait(100);
  check('enter-submits-form', (await page.evaluate(() => window.__submits)) === 1);
  await page.click('#ta');
  await page.keyboard.press('Enter');
  await wait(100);
  check('enter-in-textarea-does-not-submit', (await page.evaluate(() => window.__submits)) === 1);
  const validity = await page.evaluate(() => { const f = document.getElementById('f'); const e = document.getElementById('email'); e.value = ''; return { valid: f.checkValidity() }; });
  check('required-blocks-validity', validity.valid === false, JSON.stringify(validity));
  await page.evaluate(() => { document.getElementById('email').value = 'a@b.c'; });
  check('filled-is-valid', (await page.evaluate(() => document.getElementById('f').checkValidity())) === true);

  // IME 조합 중 Enter 는 제출하지 않는다
  await page.click('#pw');
  const before = await page.evaluate(() => window.__submits);
  await page.evaluate(() => { const i = document.getElementById('pw').shadowRoot.querySelector('input'); i.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', isComposing: true, bubbles: true, composed: true })); });
  check('ime-enter-ignored', (await page.evaluate(() => window.__submits)) === before);

  // ---------- 5. 모달: 포커스 가두기·복원·스크롤 잠금 ----------
  await page.focus('#before');
  await page.evaluate(() => { document.getElementById('m').setAttribute('open', ''); });
  await wait(150);
  const inModal = await page.evaluate(() => { const m = document.getElementById('m'); let a = document.activeElement; const path = []; while (a) { path.push(a.id || a.tagName); a = a.shadowRoot?.activeElement ?? null; } return { path, overflow: document.documentElement.style.overflow }; });
  check('modal-moves-focus-inside', inModal.path.includes('closeBtn'), inModal.path.join('>'));
  check('modal-locks-scroll', inModal.overflow === 'hidden', inModal.overflow);
  // Tab 순환: 닫기 → (slotted) 입력 → (slotted) 버튼 → 다시 닫기
  const seen = [];
  for (let i = 0; i < 4; i += 1) {
    await page.keyboard.press('Tab');
    seen.push(await page.evaluate(() => { let a = document.activeElement; let last = a?.id || a?.tagName; while (a?.shadowRoot?.activeElement) { a = a.shadowRoot.activeElement; last = a.id || a.tagName; } return last; }));
  }
  check('modal-tab-reaches-slotted-content', seen.some((x) => x === 'mb') && seen.some((x) => x === 'INPUT' || x === 'mi'), seen.join('>'));
  check('modal-tab-stays-inside', !seen.includes('before'), seen.join('>'));
  await page.keyboard.press('Escape');
  await wait(100);
  const after = await page.evaluate(() => ({ active: document.activeElement?.id, overflow: document.documentElement.style.overflow }));
  check('modal-restores-focus', after.active === 'before', JSON.stringify(after));
  check('modal-unlocks-scroll', after.overflow === '', JSON.stringify(after));

  // ---------- 6. 셀렉트 키보드 ----------
  await page.evaluate(() => document.getElementById('sel').shadowRoot.querySelector('.trigger').focus());
  await page.keyboard.press('ArrowDown');
  const open1 = await page.evaluate(() => ({ open: document.getElementById('sel').shadowRoot.querySelector('.trigger').getAttribute('aria-expanded'), active: [...document.querySelectorAll('ui-option')].findIndex((o) => o.hasAttribute('data-active')) }));
  check('select-arrow-opens-and-highlights', open1.open === 'true' && open1.active === 0, JSON.stringify(open1));
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await wait(50);
  const picked = await page.evaluate(() => ({ v: document.getElementById('sel').value, open: document.getElementById('sel').shadowRoot.querySelector('.trigger').getAttribute('aria-expanded') }));
  check('select-enter-commits', picked.v === 'b' && picked.open === 'false', JSON.stringify(picked));
  await page.keyboard.type('c');
  await page.keyboard.press('Enter');
  await wait(50);
  check('select-typeahead', (await page.evaluate(() => document.getElementById('sel').value)) === 'c');
  const selected = await page.evaluate(() => [...document.querySelectorAll('ui-option')].map((o) => o.getAttribute('aria-selected')).join());
  check('select-aria-selected', selected === 'false,false,true', selected);

  // ---------- 7. 드롭다운 키보드 ----------
  await page.focus('#ddt');
  await page.keyboard.press('ArrowDown');
  await wait(50);
  const dd = await page.evaluate(() => ({ exp: document.getElementById('ddt').getAttribute('aria-expanded'), haspopup: document.getElementById('ddt').getAttribute('aria-haspopup'), focus: document.activeElement?.id }));
  check('dropdown-arrow-opens-focuses-first', dd.exp === 'true' && dd.haspopup === 'menu' && dd.focus === 'i1', JSON.stringify(dd));
  await page.keyboard.press('ArrowDown');
  check('dropdown-arrow-moves', (await page.evaluate(() => document.activeElement?.id)) === 'i2');
  await page.keyboard.press('Escape');
  await wait(50);
  const dd2 = await page.evaluate(() => ({ focus: document.activeElement?.id, exp: document.getElementById('ddt').getAttribute('aria-expanded') }));
  check('dropdown-escape-returns-focus', dd2.focus === 'ddt' && dd2.exp === 'false', JSON.stringify(dd2));

  // ---------- 8. 라디오 화살표 ----------
  const tabstops = await page.evaluate(() => [...document.querySelectorAll('ui-radio')].map((r) => r.getAttribute('tabindex')).join());
  check('radio-single-tab-stop', tabstops === '0,-1,-1,-1', tabstops);
  await page.focus('#r1');
  await page.keyboard.press('ArrowDown');
  const r2 = await page.evaluate(() => ({ f: document.activeElement?.id, c: [...document.querySelectorAll('ui-radio')].map((r) => r.checked).join() }));
  check('radio-arrow-selects-next', r2.f === 'r2' && r2.c === 'false,true,false,false', JSON.stringify(r2));
  await page.keyboard.press('ArrowDown'); // r3 disabled → r4
  const r4 = await page.evaluate(() => document.activeElement?.id);
  check('radio-skips-disabled', r4 === 'r4', r4);
  await page.keyboard.press('ArrowDown'); // wrap → r1
  check('radio-wraps', (await page.evaluate(() => document.activeElement?.id)) === 'r1');

  // ---------- 9. 탭/툴팁 ARIA, 공유 스타일시트 ----------
  const tabs = await page.evaluate(() => {
    const t = [...document.querySelectorAll('ui-tab')]; const p = [...document.querySelectorAll('ui-tab-panel')];
    return { controls: t.map((x) => x.getAttribute('aria-controls') === p[t.indexOf(x)].id && !!p[t.indexOf(x)].id).join(), labelled: p.map((x, i) => x.getAttribute('aria-labelledby') === t[i].id && !!t[i].id).join() };
  });
  check('tabs-aria-controls-labelledby', tabs.controls === 'true,true' && tabs.labelled === 'true,true', JSON.stringify(tabs));
  check('tooltip-description', (await page.evaluate(() => document.getElementById('tt').getAttribute('aria-description'))) === 'Helpful');
  const shared = await page.evaluate(() => {
    const a = document.getElementById('b1').shadowRoot, b = document.getElementById('b2').shadowRoot;
    return { same: a.adoptedStyleSheets.length === 1 && a.adoptedStyleSheets[0] === b.adoptedStyleSheets[0], noStyleTag: !a.querySelector('style') };
  });
  check('stylesheet-shared-between-instances', shared.same && shared.noStyleTag, JSON.stringify(shared));

  check('no-page-errors', errors.length === 0, errors.join(' | ').slice(0, 300));
} catch (error) {
  results._fatal = `FAIL ${error.stack?.split('\n').slice(0, 3).join(' ')}`;
} finally {
  await browser.close();
  server.close();
}
console.log(JSON.stringify(results, null, 1));
const failed = Object.values(results).filter((v) => v.startsWith('FAIL')).length;
console.log(`passed=${Object.values(results).length - failed} failed=${failed}`);
process.exit(failed ? 1 : 0);
