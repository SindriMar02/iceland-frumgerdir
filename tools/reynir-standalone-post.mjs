/**
 * Post-build for the standalone Reynir deployment (dist-reynir/).
 *
 * Runs after `vite build --config vite.reynir.config.ts` and finishes the
 * job the entry point cannot do alone:
 *
 * 1. reynir.html → index.html (Vite keeps the input's filename).
 * 2. PRUNE THE PUBLIC DIR. Vite copies public/ wholesale, and public/ holds
 *    74 top-level folders — every client's photography. Without this step the
 *    bakery's deployment would ship every other prospect's assets to
 *    reynirbakari.is. Whitelist, not blacklist, so a new catalogue folder
 *    added next month is excluded by default instead of leaking by default.
 * 3. Per-route index.html copies + 404.html so the SPA's routes answer 200 on
 *    any static host, plus a Cloudflare Pages `_redirects` SPA rule.
 * 4. reynir-seo.mjs in standalone mode: per-route meta/JSON-LD at the clean
 *    root paths, llms.txt, sitemap.xml, robots.txt — at the dist root, where
 *    they belong on a real domain.
 * 5. favicon-guard over the result — the guard that catches icon inheritance.
 * 6. THE SEPARATION GATE: grep the emitted JS for other clients' slugs. The
 *    standalone entry should make catalogue leakage impossible; this check is
 *    what turns "should" into a failed build instead of a silent regression.
 *
 * Usage:  node tools/reynir-standalone-post.mjs
 *         REYNIR_SITE_URL=https://reynirbakari.is node tools/reynir-standalone-post.mjs
 */
import { cpSync, existsSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'

const dist = 'dist-reynir'
if (!existsSync(dist)) {
  console.error('reynir-post: dist-reynir missing — run the vite build first')
  process.exit(1)
}

/* 1 ── the shell becomes index.html */
if (existsSync(join(dist, 'reynir.html'))) {
  renameSync(join(dist, 'reynir.html'), join(dist, 'index.html'))
}

/* 2 ── prune everything the bakery does not own */
const KEEP = new Set(['index.html', '404.html', 'assets', 'reynir', '_redirects', 'robots.txt', 'sitemap.xml', 'llms.txt'])
let pruned = 0
for (const entry of readdirSync(dist)) {
  if (!KEEP.has(entry)) {
    rmSync(join(dist, entry), { recursive: true, force: true })
    pruned++
  }
}
console.log(`reynir-post: pruned ${pruned} catalogue entries from public/`)

/* 3 ── routes answer as real pages */
for (const r of ['panta', 'sagan', 'personuvernd']) {
  cpSync(join(dist, 'index.html'), join(dist, r, 'index.html'))
}
writeFileSync(join(dist, '404.html'), readFileSync(join(dist, 'index.html')))
writeFileSync(join(dist, '_redirects'), '/* /index.html 200\n')

/* 4 ── head injection at the clean paths */
execFileSync('node', ['tools/reynir-seo.mjs', dist, '--base=/'], {
  stdio: 'inherit',
  env: { ...process.env, REYNIR_STANDALONE: '1' },
})

/* 5 ── icon inheritance guard */
execFileSync('node', ['tools/favicon-guard.mjs', dist], { stdio: 'inherit' })

/* 6 ── the separation gate */
const OTHER_CLIENTS = [
  'polarhestar', 'tjoruhusid', 'erpsstadir', 'hofdabilar', 'olvisholt',
  'smekkleysa', 'heklusyn', 'obyggdasetur', 'hveravellir', 'mirrorlodge',
  'gullsmidja', 'rakararnir', 'bilageirinn', 'flatbakan', 'eldofninn',
]
const leaks = []
const scan = (dir) => {
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, f.name)
    if (f.isDirectory()) scan(p)
    else if (/\.(js|css|html)$/.test(f.name)) {
      const body = readFileSync(p, 'utf8')
      for (const slug of OTHER_CLIENTS) if (body.includes(slug)) leaks.push(`${p}: "${slug}"`)
    }
  }
}
scan(dist)
if (leaks.length) {
  console.error('reynir-post: CATALOGUE LEAKED INTO THE CLIENT BUILD:')
  for (const l of leaks) console.error('  ' + l)
  process.exit(1)
}
console.log('reynir-post: separation gate clean — no catalogue content in the client build')
