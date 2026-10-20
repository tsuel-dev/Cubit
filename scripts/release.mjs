#!/usr/bin/env node
/*
 * Cubit UI release helper: preflight -> (optional version bump) -> checks -> publish -> verify -> tag.
 *
 *   node scripts/release.mjs --dry-run            everything except the actual upload
 *   node scripts/release.mjs                      interactive release (asks before publishing)
 *   node scripts/release.mjs --yes                no confirmation prompt
 *   node scripts/release.mjs --bump 1.0.1         set all 4 package versions first (and commit)
 *   node scripts/release.mjs --otp 123456         pass a 2FA one-time code to npm
 *   node scripts/release.mjs --push-tag           push the v<version> tag afterwards
 *
 * Run it in a normal (local-disk) clone of the repository, logged in with `npm login`.
 * It never reads or prints credentials.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const opt = (n) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const DRY = flag('dry-run');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PKGS = ['tokens', 'core', 'react', 'svelte'];
const isWin = process.platform === 'win32';

const log = (m) => console.log(m);
const ok = (m) => console.log(`  [ok]   ${m}`);
const warn = (m) => console.log(`  [warn] ${m}`);
function fail(m, hint) {
  console.error(`\n  [FAIL] ${m}`);
  if (hint) console.error(`         -> ${hint}`);
  process.exit(1);
}
const run = (cmd, a, o = {}) => execFileSync(cmd, a, { cwd: root, encoding: 'utf8', shell: isWin, stdio: ['ignore', 'pipe', 'pipe'], ...o }).trim();
const tryRun = (cmd, a) => {
  try {
    return { ok: true, out: run(cmd, a) };
  } catch (e) {
    return { ok: false, out: String(e.stderr || e.message) };
  }
};
const stream = (cmd, a) => {
  const r = spawnSync(cmd, a, { cwd: root, stdio: 'inherit', shell: isWin });
  if (r.status !== 0) fail(`command failed: ${cmd} ${a.join(' ')}`);
};
const readPkg = (p) => JSON.parse(fs.readFileSync(path.join(root, 'packages', p, 'package.json'), 'utf8'));

log('\n== 1. Preflight');
const branch = run('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
const dirty = run('git', ['status', '--porcelain']);
const strict = !DRY;
if (branch !== 'main') (strict ? fail : warn)(`branch is "${branch}", expected main`);
else ok('on branch main');
if (dirty) (strict ? fail : warn)('working tree is not clean', 'commit or stash your changes first');
else ok('working tree clean');
const f = tryRun('git', ['fetch', 'origin', 'main']);
if (f.ok) {
  const [ahead, behind] = run('git', ['rev-list', '--left-right', '--count', 'HEAD...origin/main']).split(/\s+/).map(Number);
  if (behind > 0) (strict ? fail : warn)(`local main is ${behind} commit(s) behind origin/main`, 'git pull');
  else if (ahead > 0) (strict ? fail : warn)(`local main has ${ahead} unpushed commit(s)`, 'git push origin main (so the published code matches GitHub)');
  else ok('in sync with origin/main');
} else warn('could not fetch origin; skipped sync check');

const who = tryRun('npm', ['whoami']);
if (!who.ok) fail('not logged in to npm', 'run: npm login');
ok(`npm user: ${who.out}`);

log('\n== 2. Packages and versions');
if (opt('bump')) {
  const v = opt('bump');
  if (!/^\d+\.\d+\.\d+$/.test(v || '')) fail(`invalid --bump value "${v}"`, 'use x.y.z, e.g. 1.0.1');
  for (const p of PKGS) {
    const f2 = path.join(root, 'packages', p, 'package.json');
    const raw = fs.readFileSync(f2, 'utf8');
    const j = JSON.parse(raw);
    j.version = v;
    fs.writeFileSync(f2, JSON.stringify(j, null, 2) + (raw.endsWith('\n') ? '\n' : ''));
  }
  ok(`set version ${v} in ${PKGS.length} packages`);
  if (!DRY) {
    run('git', ['add', 'packages/*/package.json']);
    run('git', ['commit', '-m', `chore(release): v${v}\n\nCo-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`]);
    ok('committed version bump');
  } else warn('dry run: version bump left uncommitted');
}
const metas = PKGS.map((p) => readPkg(p));
const versions = new Set(metas.map((m) => m.version));
if (versions.size !== 1) fail(`package versions differ: ${metas.map((m) => `${m.name}@${m.version}`).join(', ')}`, 'use --bump x.y.z');
const version = metas[0].version;
ok(`all packages at ${version}`);

const scope = metas[0].name.split('/')[0].replace('@', '');
const orgCheck = tryRun('npm', ['org', 'ls', scope]);
if (scope === who.out) ok(`scope @${scope} is your personal scope`);
else if (orgCheck.ok) ok(`you are a member of npm org "${scope}"`);
else {
  (DRY ? warn : fail)(`npm scope @${scope} not found or you are not a member`,
    `create the org at https://www.npmjs.com/org/create (name "${scope}", Free plan), or rename the scope (see PUBLISHING.md)`);
}

const already = [];
for (const m of metas) {
  const v = tryRun('npm', ['view', `${m.name}@${version}`, 'version']);
  if (v.ok && v.out === version) already.push(m.name);
}
if (already.length === metas.length) fail(`${version} is already published for all packages`, 'bump the version: --bump x.y.z');
if (already.length) warn(`already published (will be skipped): ${already.join(', ')}`);
else ok('version not yet published');

log('\n== 3. Install, lint, build, typecheck, dry-run pack');
stream('pnpm', ['install', '--frozen-lockfile']);
stream('pnpm', ['run', 'release:check']);
ok('release:check passed');

if (DRY) {
  log('\nDry run finished. Nothing was published.');
  process.exit(0);
}

log(`\n== 4. Publish ${metas.map((m) => `${m.name}@${version}`).join(', ')}`);
if (!flag('yes')) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const a = (await rl.question('Publish to the public npm registry now? This cannot be undone. Type "publish" to continue: ')).trim();
  rl.close();
  if (a !== 'publish') fail('aborted by user');
}
// npm publish <tarball> per package (works with passkey/web-auth in an interactive terminal)
const pub = ['scripts/publish-packages.mjs'];
if (opt('otp')) pub.push('--otp', opt('otp'));
stream('node', pub);

log('\n== 5. Verify');
let allOk = true;
for (const m of metas) {
  let seen = false;
  for (let i = 0; i < 12 && !seen; i++) {
    const v = tryRun('npm', ['view', `${m.name}@${version}`, 'version']);
    seen = v.ok && v.out === version;
    if (!seen) await new Promise((r) => setTimeout(r, 5000));
  }
  (seen ? ok : warn)(`${m.name}@${version} ${seen ? 'is live' : 'not visible yet'}`);
  allOk &&= seen;
}

log('\n== 6. Tag');
const tag = `v${version}`;
if (tryRun('git', ['rev-parse', tag]).ok) warn(`tag ${tag} already exists`);
else {
  run('git', ['tag', '-a', tag, '-m', `Release ${tag}`]);
  ok(`created local tag ${tag}`);
}
if (flag('push-tag')) {
  stream('git', ['push', 'origin', tag]);
  warn('pushing a v* tag also starts .github/workflows/publish.yml (needs the NPM_TOKEN secret; already published versions are skipped)');
} else log(`  not pushed. To push: git push origin ${tag}`);

log(allOk ? `\nDone. https://www.npmjs.com/package/${metas[1].name}` : '\nPublished, but some packages are not visible yet; re-check with npm view in a minute.');
