#!/usr/bin/env node
/*
 * Publishes the four @cubit-ui packages (in dependency order) to npm.
 * Used by GitHub Actions (npm Trusted Publishing / OIDC) and by scripts/release.mjs.
 *
 *   node scripts/publish-packages.mjs [--dry-run] [--otp 123456]
 *
 * For each package: `pnpm pack` (resolves workspace:* to real versions), skip it if
 * that exact version is already on the registry, otherwise `npm publish <tarball>`.
 * Assumes `pnpm run build` has already been run. No credentials are read or printed.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const otpIdx = args.indexOf('--otp');
const otp = otpIdx >= 0 ? args[otpIdx + 1] : undefined;
const PKGS = ['tokens', 'core', 'react', 'svelte']; // tokens first: the others depend on it
const isWin = process.platform === 'win32';

const sh = (cmd, a, cwd = root, inherit = false) =>
  spawnSync(cmd, a, { cwd, encoding: 'utf8', shell: isWin, stdio: inherit ? 'inherit' : ['ignore', 'pipe', 'pipe'] });

const packs = path.join(root, '.packs');
fs.rmSync(packs, { recursive: true, force: true });
fs.mkdirSync(packs);

let failed = false;
for (const p of PKGS) {
  const dir = path.join(root, 'packages', p);
  const { name, version } = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
  const view = sh('npm', ['view', `${name}@${version}`, 'version']);
  if (view.status === 0 && view.stdout.trim() === version) {
    console.log(`skip   ${name}@${version} (already published)`);
    continue;
  }
  const pack = sh('pnpm', ['pack', '--pack-destination', packs], dir);
  if (pack.status !== 0) {
    console.error(pack.stderr || pack.stdout);
    console.error(`FAILED to pack ${name}`);
    process.exit(1);
  }
  const tgz = path.join(packs, `${name.replace('@', '').replace('/', '-')}-${version}.tgz`);
  if (!fs.existsSync(tgz)) {
    console.error(`tarball not found: ${tgz}`);
    process.exit(1);
  }
  const pubArgs = ['publish', tgz, '--access', 'public'];
  if (DRY) pubArgs.push('--dry-run');
  if (otp) pubArgs.push('--otp', otp);
  console.log(`\n== ${DRY ? 'dry-run ' : ''}publish ${name}@${version}`);
  const r = sh('npm', pubArgs, root, true);
  if (r.status !== 0) {
    console.error(`FAILED to publish ${name}@${version}`);
    failed = true;
    break; // later packages depend on this one
  }
}
fs.rmSync(packs, { recursive: true, force: true });
process.exit(failed ? 1 : 0);
