/**
 * Post-build for the standalone Nýpugarðar deployment (dist-nypugardar/).
 *
 * Runs after `vite build --config vite.nypugardar.config.ts` and the SSR
 * build, and finishes the job the entry point cannot do alone:
 *
 * 1. nypugardar.html → index.html (Vite keeps the input's filename).
 * 2. PRUNE THE PUBLIC DIR. Vite copies public/ wholesale, and public/ holds
 *    every client's photography. Without this step the farm's deployment
 *    would ship every other prospect's assets to glacierview.is. Whitelist,
 *    not blacklist, so a folder added next month is excluded by default.
 * 3. Analytics: token in, or the tag out entirely.
 * 4. Prerender every route to real HTML, then 404.html + Cloudflare
 *    `_redirects`: the SPA rule, plus 301s from the old WordPress site's
 *    addresses so eight years of inbound links do not die with it.
 * 5. nypugardar-seo.mjs in standalone mode: per-route head, llms.txt,
 *    sitemap.xml, robots.txt at the dist root, where they belong on a domain.
 * 6. favicon-guard over the result.
 * 7. THE SEPARATION GATE: grep the emitted JS/CSS/HTML for other clients'
 *    slugs and catalogue paths. The standalone entry should make leakage
 *    impossible; this check turns "should" into a failed build.
 *
 * Usage:  node tools/nypugardar-standalone-post.mjs
 *         NYPUGARDAR_SITE_URL=https://glacierview.is node tools/nypugardar-standalone-post.mjs
 */
import { existsSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'

const dist = 'dist-nypugardar'
if (!existsSync(dist)) {
  console.error('nypugardar-post: dist-nypugardar missing; run the vite build first')
  process.exit(1)
}

/* 1 ── the shell becomes index.html */
if (existsSync(join(dist, 'nypugardar.html'))) {
  renameSync(join(dist, 'nypugardar.html'), join(dist, 'index.html'))
}

/* 2 ── prune everything the farm does not own */
const KEEP = new Set(['index.html', '404.html', 'assets', 'nypugardar', '_redirects', 'robots.txt', 'sitemap.xml', 'llms.txt'])
let pruned = 0
for (const entry of readdirSync(dist)) {
  if (!KEEP.has(entry)) {
    rmSync(join(dist, entry), { recursive: true, force: true })
    pruned++
  }
}
console.log(`nypugardar-post: pruned ${pruned} catalogue entries from public/`)

/* 3 ── analytics */
const cfToken = process.env.VITE_NYPUGARDAR_CF_ANALYTICS_TOKEN
{
  const shell = join(dist, 'index.html')
  let html = readFileSync(shell, 'utf8')
  if (cfToken) {
    html = html.replace('__CF_ANALYTICS_TOKEN__', cfToken)
    console.log('nypugardar-post: Cloudflare Web Analytics beacon armed')
  } else {
    html = html.replace(/\n?\s*<!-- Cloudflare Web Analytics[\s\S]*?<\/script>\n?/, '\n')
    console.log('nypugardar-post: no analytics token; beacon removed (set VITE_NYPUGARDAR_CF_ANALYTICS_TOKEN to enable)')
  }
  writeFileSync(shell, html)
}

/* 4 ── real HTML in every route, then the host rules */
execFileSync('node', ['tools/nypugardar-prerender.mjs'], { stdio: 'inherit' })

writeFileSync(join(dist, '404.html'), readFileSync(join(dist, 'index.html')))
writeFileSync(
  join(dist, '_redirects'),
  [
    '# The 2017 WordPress site. Every address it had that anyone might still',
    '# hold (bookmarks, HeyIceland, old emails) lands on the equivalent page',
    '# with a permanent redirect, so the link equity moves with the site.',
    '/nypugardar-2 / 301',
    '/nypugardar-2/* / 301',
    '/index.php / 301',
    '/index.php/* / 301',
    '/hello-world / 301',
    '/hello-world/* / 301',
    '/feed / 301',
    '/feed/* / 301',
    '/comments/feed / 301',
    '/wp-content/* / 301',
    '/wp-includes/* / 301',
    '/wp-json/* / 301',
    '/wp-login.php / 301',
    '/wp-admin/* / 301',
    '/xmlrpc.php / 301',
    '/en / 301',
    '/en/* / 301',
    '/herbergi /rooms 301',
    '# Language roots without the slash',
    '/is /is/ 301',
    '# Everything else is the SPA',
    '/* /index.html 200',
    '',
  ].join('\n'),
)

/* 5 ── head injection at the clean paths */
execFileSync('node', ['tools/nypugardar-seo.mjs', dist, '--base=/'], {
  stdio: 'inherit',
  env: { ...process.env, NYPUGARDAR_STANDALONE: '1' },
})

/* 6 ── icon inheritance guard */
execFileSync('node', ['tools/favicon-guard.mjs', dist], { stdio: 'inherit' })

/* 7 ── the separation gate */
const OTHER_CLIENTS = [
  'reynir', 'polarhestar', 'tjoruhusid', 'erpsstadir', 'hofdabilar', 'olvisholt',
  'smekkleysa', 'heklusyn', 'obyggdasetur', 'hveravellir', 'mirrorlodge',
  'gullsmidja', 'rakararnir', 'bilageirinn', 'flatbakan', 'eldofninn',
  'villanorth', 'lakeview', 'svartaborg', 'katrinisfeld', 'PreviewChrome',
  '/preview/', 'companies.ts',
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
  console.error('nypugardar-post: CATALOGUE LEAKED INTO THE CLIENT BUILD:')
  for (const l of leaks) console.error('  ' + l)
  process.exit(1)
}
console.log('nypugardar-post: separation gate clean; no catalogue content in the client build')
