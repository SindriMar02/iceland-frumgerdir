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
const KEEP = new Set(['index.html', '404.html', 'assets', 'nypugardar', '_redirects', '_headers', 'robots.txt', 'sitemap.xml', 'llms.txt'])
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

writeFileSync(join(dist, '404.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found | Nýpugarðar</title><link rel="icon" href="/nypugardar/brand/favicon-32.png"><style>body{margin:0;padding:10vh 8vw;background:#15130f;color:#f6f1e7;font:20px/1.6 system-ui}a{color:inherit}</style></head><body><main><h1>Page not found</h1><p>This address does not exist. / Þessi síða fannst ekki.</p><a href="/">Return to Nýpugarðar</a> · <a href="/is/">Forsíða</a></main></body></html>`)
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
    '/en / 301',
    '/en/* / 301',
    '/herbergi /rooms 301',
    '# Language roots without the slash',
    '/is /is/ 301',
    '# Browsers and some crawlers ask for /favicon.ico regardless of <link rel=icon>',
    '/favicon.ico /nypugardar/brand/favicon-32.png 200',
    '# Unknown paths use the real 404.html; every valid route is prerendered.',
    '',
  ].join('\n'),
)

/* Security headers Pages does not send on its own, and the cache policy.

   HSTS without includeSubDomains: mail.glacierview.is and smtp. are Opex's, not
   ours. frame-ancestors 'none' is the modern X-Frame-Options; both are sent for
   older browsers. No full CSP: the page carries inline JSON-LD and Vite's
   modulepreload, and a wrong CSP breaks a live site silently.

   Cache-Control was missing until 2026-09-20, so everything fell back to
   Cloudflare's four-hour browser TTL with must-revalidate: every returning
   visitor re-checked the CSS, the JS and all six Erode weights against the
   origin. Measured over the week before the fix, /assets/ served 259 misses and
   124 revalidations and not one edge hit.

   The pages.dev rules keep nypugardar.pages.dev out of the index. It serves this
   exact site, so without them it is a crawlable duplicate competing with
   glacierview.is; rel=canonical asks Google to consolidate, X-Robots-Tag tells
   it. The :version form covers the per-deploy preview hosts. */
writeFileSync(
  join(dist, '_headers'),
  [
    '# Vite fingerprints every name in /assets/, so a year is safe: a changed file',
    '# is a changed URL, and a returning visitor fetches none of it twice.',
    '/assets/*',
    '  Cache-Control: public, max-age=31536000, immutable',
    '',
    '# Photographs and film keep their names across builds. A month is long enough',
    '# to help a repeat visitor and short enough that a replaced photo appears.',
    '/nypugardar/*',
    '  Cache-Control: public, max-age=2592000',
    '',
    '/*',
    '  Strict-Transport-Security: max-age=31536000',
    '  X-Frame-Options: DENY',
    '  Content-Security-Policy: frame-ancestors \'none\'',
    '  X-Content-Type-Options: nosniff',
    '  Referrer-Policy: strict-origin-when-cross-origin',
    '  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    '',
    '# The Pages host must never compete with glacierview.is in search.',
    'https://nypugardar.pages.dev/*',
    '  X-Robots-Tag: noindex',
    '',
    'https://:version.nypugardar.pages.dev/*',
    '  X-Robots-Tag: noindex',
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
