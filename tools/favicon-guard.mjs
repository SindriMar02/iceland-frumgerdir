#!/usr/bin/env node
// favicon-guard — gates EVERY preview deploy. Wired into every deploy.sh.
//
// Why this exists: the ARTIX site is deployed at the root of sindrimar02.github.io.
// Browsers cache favicons per ORIGIN, so any page on that origin that fails to present
// a usable icon silently shows ARTIX's helm in a prospective client's tab.
// It shipped that way three times: Coppermine (2026-07-25), and Jungle + five other
// live previews (2026-07-27).
//
// FOUR rules, all enforced here. Each one is a bug that actually shipped:
//   1. Every deployable page MUST declare rel="icon".
//   2. The href MUST be relative or a data: URI — never rooted at "/" — because a
//      GitHub Pages *project* site lives under /repo-name/ and "/" is the origin root.
//   3. The icon set MUST include a raster fallback (.png/.ico). Safari does not render
//      SVG favicons AT ALL — file href OR data: URI — so an SVG-only page falls back to
//      the origin icon exactly like rule 1, even though the SVG resolves 200 and Chrome
//      shows it correctly. This is what broke Jungle on 2026-07-27.
//   4. Scanning a target MUST find at least one page. The 2026-07-27 sweep passed with
//      "8 page(s) OK" while covering ZERO pages for aldamusic/hyrox/erna — those build
//      to dist/ and have no source .html, and dist/ used to be skipped. A guard that
//      silently checks nothing is worse than no guard, because it reads as a pass.
//
// Usage:  favicon-guard [dir]
//   With no argument, sweeps the whole workspace regardless of cwd (manual audit).
//   In a deploy script, ALWAYS pass the staged output directory, so what gets checked
//   is byte-for-byte what gets published:
//     node "$TOOLS/favicon-guard.mjs" "$WT" || exit 1
//   Exits 1 on any failure.

import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// Anchor to this script's own location (…/_tools/), not process.cwd(), which is
// whatever repo the user happens to be standing in.
const WORKSPACE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const EXPLICIT = Boolean(process.argv[2]);
const ROOT = EXPLICIT ? resolve(process.argv[2]) : WORKSPACE;

// NOTE: dist/build are deliberately NOT skipped. They are what actually deploys.
// Skipping them is precisely how three broken previews passed this guard.
const SKIP = new Set(['node_modules', '.git', '.next', 'qa-shots', 'qa', 'coverage']);

// Pages that are not deployed as their own site: local handoffs, email templates,
// component sheets, internal tooling, and saved scrapes of OTHER companies' sites
// (research-assets). None of these ever own a browser tab a client will see.
const EXEMPT = [
  /handoff/i,
  /\/email\//,
  /\bci\.html$/,
  /\/research-assets\//,
  /\/_?tools\//,
  /\/fonttest\//,
];

// Nearest ancestor that looks like a project root, so we can resolve an absolute
// href the way the deployed site would.
function projectRootOf(file) {
  let dir = dirname(file);
  while (dir.startsWith(ROOT) && dir !== ROOT) {
    if (existsSync(join(dir, '.git')) || existsSync(join(dir, 'package.json'))) return dir;
    dir = dirname(dir);
  }
  return ROOT;
}

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name) || e.name.startsWith('.')) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = walk(ROOT).filter((f) => !EXEMPT.some((re) => re.test(f)));
const problems = [];
const warnings = [];

// Rule 4 — a scan that covers nothing must never read as a pass.
if (files.length === 0) {
  console.error(`FAIL  ${ROOT}`);
  console.error(`      no .html pages found to check — a guard that checks nothing is not a pass.`);
  console.error(`      If this project builds to dist/, run the guard AFTER the build, on the output.`);
  process.exit(1);
}

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const rel = relative(ROOT, file);

  const tags = html.match(/<link\b[^>]*\brel=["'](?:shortcut\s+)?icon["'][^>]*>/gi) ?? [];
  if (tags.length === 0) {
    problems.push([rel, 'no rel="icon" declared — the tab will inherit the origin-root icon']);
    continue;
  }

  // Rule 3: Safari ignores SVG favicons entirely (file href AND data:image/svg+xml),
  // then falls back to the origin icon. At least one rel="icon" must be raster.
  const hasRaster = tags.some(
    (t) =>
      /\btype=["']image\/(?:png|x-icon|vnd\.microsoft\.icon)["']/i.test(t) ||
      /\bhref=["'][^"']*\.(?:png|ico)(?:[?#][^"']*)?["']/i.test(t) ||
      /\bhref=["']data:image\/png/i.test(t)
  );
  if (!hasRaster) {
    problems.push([rel, 'icon set is SVG-only — Safari ignores SVG favicons and shows the origin icon; add a PNG/ICO fallback']);
  }

  for (const tag of tags) {
    const href = tag.match(/\bhref=["']([^"']+)["']/i)?.[1];
    if (!href) {
      problems.push([rel, 'rel="icon" with no href']);
      continue;
    }
    if (href.startsWith('data:')) continue;               // no network fetch to fail
    if (/^https?:\/\//i.test(href) || href.startsWith('//')) continue; // external, deliberate

    if (href.startsWith('/')) {
      // Only safe when the project is served from a domain root (Cloudflare Pages).
      // On a GitHub Pages project site this points outside the site entirely.
      const proj = projectRootOf(file);
      const clean = href.split(/[?#]/)[0];
      const found = [join(proj, 'public', clean), join(proj, clean)].find((p) => existsSync(p));
      if (found) {
        warnings.push([rel, `absolute href "${href}" — OK only because this project deploys at a domain root`]);
      } else {
        problems.push([rel, `absolute href "${href}" resolves to the ORIGIN ROOT, not this site`]);
      }
      continue;
    }
    // Relative: the file has to actually be on disk, or it 404s and we fall back again.
    const target = join(dirname(file), href.split(/[?#]/)[0]);
    if (!existsSync(target)) {
      problems.push([rel, `href "${href}" does not exist on disk`]);
    } else if (statSync(target).size === 0) {
      problems.push([rel, `href "${href}" is a zero-byte file`]);
    } else if (/\.(png|ico)$/i.test(target) && statSync(target).size < 70) {
      // A stroke-only SVG rendered through ImageMagick yields a valid but EMPTY png.
      // Anything under ~70 bytes cannot contain a drawn mark.
      problems.push([rel, `href "${href}" is ${statSync(target).size} bytes — almost certainly a blank render`]);
    }
  }
}

const width = Math.max(0, ...[...problems, ...warnings].map(([f]) => f.length));
for (const [file, msg] of problems) console.error(`FAIL  ${file.padEnd(width)}  ${msg}`);
for (const [file, msg] of warnings) console.warn(`warn  ${file.padEnd(width)}  ${msg}`);

if (problems.length) {
  console.error(`\n${problems.length} favicon problem(s) across ${files.length} page(s). Fix before deploying.`);
  process.exit(1);
}
console.log(`favicon-guard: ${files.length} page(s) OK`);
