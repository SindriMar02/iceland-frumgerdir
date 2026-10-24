/**
 * Post-build for the standalone Pólar Hestar deployment (dist-polarhestar/).
 *
 * Runs after `vite build --config vite.polarhestar.config.ts` and the SSR build,
 * and finishes the job the entry point cannot do alone:
 *
 * 1. polarhestar.html → index.html (Vite keeps the input's filename).
 * 2. PRUNE THE PUBLIC DIR. Vite copies public/ wholesale, and public/ holds
 *    every client's photography. Without this step the farm's deployment would
 *    ship every other prospect's assets to polarhestar.is. Whitelist, not
 *    blacklist, so a folder added next month is excluded by default.
 * 3. Analytics: token in, or the tag out entirely.
 * 4. Prerender every route to real HTML (11 pages x 3 languages).
 * 5. 404.html, `_redirects` (removed tours + the old polarhestar.is URLs) and
 *    `_headers` (cache policy, security headers, staging hosts out of the index).
 * 6. polarhestar-standalone-seo.mjs: per-route head, robots.txt, sitemap.xml,
 *    llms.txt, written at the dist root where they belong on a domain.
 * 7. THE LINK GATE: every file a page, a stylesheet or a redirect points at must
 *    be in the staged tree. (22 Oct: a deploy skipped one stylesheet and the live
 *    booking sheet went out unstyled.) Then favicon-guard.
 * 8. THE SEPARATION GATE: grep the emitted JS/CSS/HTML for other clients' slugs
 *    and catalogue paths. The standalone entry should make leakage impossible;
 *    this check turns "should" into a failed build.
 *
 * Usage:  node tools/polarhestar-standalone-post.mjs
 *         POLARHESTAR_NOINDEX=1 node tools/polarhestar-standalone-post.mjs   (staging copy)
 */
import { existsSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { execFileSync } from 'node:child_process'

const dist = 'dist-polarhestar'
if (!existsSync(dist)) {
  console.error('polarhestar-post: dist-polarhestar missing; run the vite build first')
  process.exit(1)
}
const fail = (msg) => {
  console.error(`polarhestar-post: ${msg}`)
  process.exit(1)
}

/* 1 ── the shell becomes index.html */
if (existsSync(join(dist, 'polarhestar.html'))) renameSync(join(dist, 'polarhestar.html'), join(dist, 'index.html'))

/* 2 ── prune everything the farm does not own */
const KEEP = new Set(['index.html', '404.html', 'assets', 'polarhestar', 'favicons', '_redirects', '_headers', 'robots.txt', 'sitemap.xml', 'llms.txt'])
let pruned = 0
for (const entry of readdirSync(dist)) {
  if (!KEEP.has(entry)) {
    rmSync(join(dist, entry), { recursive: true, force: true })
    pruned++
  }
}
for (const entry of readdirSync(join(dist, 'favicons'))) {
  if (entry !== 'polarhestar') {
    rmSync(join(dist, 'favicons', entry), { recursive: true, force: true })
    pruned++
  }
}
console.log(`polarhestar-post: pruned ${pruned} catalogue entries from public/`)

/* 3 ── analytics */
const cfToken = process.env.VITE_POLARHESTAR_CF_ANALYTICS_TOKEN
{
  const shell = join(dist, 'index.html')
  let html = readFileSync(shell, 'utf8')
  if (cfToken) {
    html = html.replace('__CF_ANALYTICS_TOKEN__', cfToken)
    console.log('polarhestar-post: Cloudflare Web Analytics beacon armed')
  } else {
    html = html.replace(/\n?\s*<!-- Cloudflare Web Analytics[\s\S]*?<\/script>\n?/, '\n')
    console.log('polarhestar-post: no analytics token; beacon removed (set VITE_POLARHESTAR_CF_ANALYTICS_TOKEN to enable)')
  }
  writeFileSync(shell, html)
}

/* 4 ── real HTML in every route */
execFileSync('node', ['tools/polarhestar-standalone-prerender.mjs'], { stdio: 'inherit' })

/* what the SSR bundle knows about the site (the same content the pages were rendered from) */
const { PAGES, REMOVED } = await import(pathToFileURL(resolve('dist-polarhestar-server/polarhestar-entry-server.js')).href)
const livePaths = new Set(PAGES.map((p) => p.path))

/* 5 ── 404, redirects, headers */
writeFileSync(
  join(dist, '404.html'),
  `<!doctype html><html lang="is"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Síða fannst ekki · Page not found · Seite nicht gefunden | Pólar Hestar</title><link rel="icon" href="/favicons/polarhestar/favicon-32.png" sizes="32x32"><style>body{margin:0;padding:12vh 8vw;background:#111530;color:#edf1f7;font:20px/1.6 system-ui,sans-serif}a{color:#9bd8f3}h1{font-weight:500;font-size:1.8rem;line-height:1.25}p{margin:.4rem 0}</style></head><body><main><h1>Síða fannst ekki<br>Page not found<br>Seite nicht gefunden</h1><p><a href="/" hreflang="is">Forsíða</a> · <a href="/en/" hreflang="en">Home</a> · <a href="/de/" hreflang="de">Startseite</a></p></main></body></html>`,
)

/* The old polarhestar.is (Stefna's Moya CMS), read from its sitemap on 24 Oct 2026. Every address it
   had that anyone might still hold (bookmarks, Tripadvisor, old emails) lands on the equivalent page
   with a permanent redirect, so the link equity moves with the site. */
const OLD = {
  en: {
    prefix: '/en',
    long: { 'ring-around-the-midnightsun': 'midnightsun', 'fascinating-north-iceland': 'fascinating-north', 'summer-farewell': 'hidden-pearls', 'autumn-colours-and-northern-lights': 'autumn-northern-lights' },
    short: { 'grytubakki-charm': 'fyrstu-kynni', 'river-mountains': 'moa-og-mela', 'fascinating-eyjafjordur': 'hofdahringur', 'snowflakes-frostroses': 'frostrosir', 'riding-minigolf': 'sumarsaela' },
    longRoot: 'long-tours', shortRoot: 'short-tours',
    sections: { 'general-information': '#gott', gallery: '#myndir', 'contact-us': '#heimsokn' },
  },
  de: {
    prefix: '/de',
    long: { sommersonnenwende: 'midnightsun', 'faszinierender-norden': 'fascinating-north', sommerausklang: 'hidden-pearls', 'herbstfarben-und-nordlichter': 'autumn-northern-lights' },
    short: { 'zauberhaftes-grytubakki': 'fyrstu-kynni', 'fluss-berge': 'moa-og-mela', 'faszination-eyjafjoerdur': 'hofdahringur', 'schneeflocken-frostrosen': 'frostrosir', 'reiten-minigolf': 'sumarsaela' },
    longRoot: 'lange-reittouren', shortRoot: 'kurze-ritte',
    sections: { informationen: '#gott', bildergalerie: '#myndir' },
  },
}
const redirects = [] // [from, to, status]
const add = (from, to, status = 301) => redirects.push([from, to, status])
const targets = [] // every destination, checked below

for (const [lang, o] of Object.entries(OLD)) {
  add(`${o.prefix}`, `${o.prefix}/`)
  add(`/${lang === 'en' ? 'en' : 'de'}/feed`, `${o.prefix}/`)
  add(`${o.prefix}/${o.longRoot}`, `${o.prefix}/#lengri`)
  add(`${o.prefix}/${o.shortRoot}`, `${o.prefix}/#ferdir`)
  for (const [slug, id] of Object.entries(o.long)) {
    // a tour that is no longer in the CMS goes to the long-tour section, never to a soft 404
    add(`${o.prefix}/${o.longRoot}/${slug}`, REMOVED.liveTours.includes(id) ? `${o.prefix}/ferd/${id}/` : `${o.prefix}/#lengri`)
  }
  for (const [slug, id] of Object.entries(o.short)) {
    add(`${o.prefix}/${o.shortRoot}/${slug}`, REMOVED.liveRides.includes(id) ? `${o.prefix}/reidtur/${id}/` : `${o.prefix}/#ferdir`)
  }
  for (const [slug, hash] of Object.entries(o.sections)) add(`${o.prefix}/${slug}`, `${o.prefix}/${hash}`)
  add(`${o.prefix}/moya/*`, `${o.prefix}/`)
}
add('/en/contact-us', '/en/#heimsokn')
add('/is', '/')
add('/is/*', '/')

/* Tours the CMS no longer publishes (Back to the Roots is not offered in 2027): the page is gone, the
   address is not a soft 404 with a 200, it is a permanent redirect to where those tours now live. */
for (const id of REMOVED.tours) {
  for (const prefix of ['', '/en', '/de']) {
    add(`${prefix}/ferd/${id}`, `${prefix}/#lengri`)
    add(`${prefix}/ferd/${id}/`, `${prefix}/#lengri`)
  }
}
for (const id of REMOVED.rides) {
  for (const prefix of ['', '/en', '/de']) {
    add(`${prefix}/reidtur/${id}`, `${prefix}/#ferdir`)
    add(`${prefix}/reidtur/${id}/`, `${prefix}/#ferdir`)
  }
}

// every destination must be a page this build wrote
for (const [from, to] of redirects) {
  const path = to.split('#')[0]
  const dest = path.replace(/^\/(en|de)$/, '/$1/')
  if (!livePaths.has(dest)) fail(`redirect ${from} → ${to}: ${dest} is not a prerendered page`)
  targets.push(dest)
}
writeFileSync(
  join(dist, '_redirects'),
  [
    '# Removed tours and the old polarhestar.is addresses (Stefna / Moya, read from its sitemap 2026-10-24).',
    '# Each lands on the equivalent page with a permanent redirect, so the link equity moves with the site.',
    ...redirects.map(([f, t, s]) => `${f} ${t} ${s}`),
    '',
    '# Browsers and some crawlers ask for /favicon.ico regardless of <link rel=icon>',
    '/favicon.ico /favicons/polarhestar/favicon-32.png 200',
    '# Unknown paths use the real 404.html; every valid route is prerendered.',
    '',
  ].join('\n'),
)
console.log(`polarhestar-post: _redirects written (${redirects.length} rules)`)

/* Security headers Pages does not send on its own, and the cache policy.
   HSTS without includeSubDomains: the mail host and anything else under polarhestar.is is not ours to pin.
   frame-ancestors lets the CMS studio (Presentation tool) embed the site and nobody else; it replaces
   X-Frame-Options, which cannot name an origin. No full CSP: the pages carry inline JSON-LD and styles,
   and a wrong CSP breaks a live site silently. The pages.dev rules keep a staging host out of the index. */
writeFileSync(
  join(dist, '_headers'),
  [
    '# Vite fingerprints every name in /assets/, so a year is safe: a changed file is a changed URL.',
    '/assets/*',
    '  Cache-Control: public, max-age=31536000, immutable',
    '',
    '# Fonts, logo and horses keep their names across builds. A month helps a repeat visitor and still lets a replaced file appear.',
    '/polarhestar/*',
    '  Cache-Control: public, max-age=2592000',
    '/favicons/*',
    '  Cache-Control: public, max-age=2592000',
    '',
    '/*',
    '  Strict-Transport-Security: max-age=31536000',
    "  Content-Security-Policy: frame-ancestors 'self' https://polarhestar.sanity.studio http://localhost:3333",
    '  X-Content-Type-Options: nosniff',
    '  Referrer-Policy: strict-origin-when-cross-origin',
    '  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    '',
    '# A Pages host must never compete with polarhestar.is in search.',
    'https://polarhestar.pages.dev/*',
    '  X-Robots-Tag: noindex',
    '',
    'https://:version.polarhestar.pages.dev/*',
    '  X-Robots-Tag: noindex',
    '',
  ].join('\n'),
)

/* 6 ── head injection, robots.txt, sitemap.xml, llms.txt */
execFileSync('node', ['tools/polarhestar-standalone-seo.mjs'], { stdio: 'inherit' })

/* 7 ── the link gate */
{
  const missing = []
  const exists = (p) => {
    const f = join(dist, p.replace(/^\//, ''))
    if (!existsSync(f)) return false
    return statSync(f).isDirectory() ? existsSync(join(f, 'index.html')) : true
  }
  const walk = (dir, out = []) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name)
      if (e.isDirectory()) walk(p, out)
      else out.push(p)
    }
    return out
  }
  const check = (from, ref) => {
    if (!ref || !ref.startsWith('/') || ref.startsWith('//')) return // external, relative handled by routers, protocol links
    const path = ref.split('#')[0].split('?')[0]
    if (!path || path === '/') return
    if (!exists(path)) missing.push(`${from} → ${ref}`)
  }
  for (const f of walk(dist)) {
    if (/\.html$/.test(f)) {
      const html = readFileSync(f, 'utf8')
      // the head and the body: href, src, content (og:image is absolute and external), srcset, imagesrcset
      for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) check(f, m[1].replace(/&amp;/g, '&'))
      for (const m of html.matchAll(/(?:srcset|imagesrcset)="([^"]+)"/g)) for (const part of m[1].split(',')) check(f, part.trim().split(/\s+/)[0])
    } else if (/\.css$/.test(f)) {
      const css = readFileSync(f, 'utf8')
      for (const m of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) if (!m[1].startsWith('data:')) check(f, m[1])
    }
  }
  if (missing.length) {
    console.error('polarhestar-post: LINK GATE FAILED, these files are linked but not in the staged tree:')
    for (const m of [...new Set(missing)]) console.error('  ' + m)
    process.exit(1)
  }
  console.log('polarhestar-post: link gate clean; every linked file is in the staged tree')
}
execFileSync('node', ['tools/favicon-guard.mjs', dist], { stdio: 'inherit' })

/* 8 ── the separation gate */
const OTHER_CLIENTS = [
  'reynir', 'nypugardar', 'bjarkalundur', 'tjoruhusid', 'erpsstadir', 'hofdabilar', 'olvisholt',
  'smekkleysa', 'heklusyn', 'obyggdasetur', 'hveravellir', 'mirrorlodge',
  'gullsmidja', 'rakararnir', 'bilageirinn', 'flatbakan', 'eldofninn',
  'villanorth', 'lakeview', 'svartaborg', 'katrinisfeld', 'kaldi', 'vogur', 'thorverk',
  'PreviewChrome', 'PreviewFooter', 'companies.ts', 'company-types', 'outreach', 'conceptTagline',
  '/preview/', 'frumgerdir', 'sindrimar02.github.io', 'Prototype: a design concept', 'Frumgerð: hönnunarhugmynd',
]
const leaks = []
const scan = (dir) => {
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, f.name)
    if (f.isDirectory()) scan(p)
    else if (/\.(js|css|html|txt|xml)$/.test(f.name)) {
      const body = readFileSync(p, 'utf8')
      for (const slug of OTHER_CLIENTS) if (body.includes(slug)) leaks.push(`${p}: "${slug}"`)
    }
  }
}
scan(dist)
if (leaks.length) {
  console.error('polarhestar-post: CATALOGUE LEAKED INTO THE CLIENT BUILD:')
  for (const l of leaks.slice(0, 40)) console.error('  ' + l)
  process.exit(1)
}
console.log('polarhestar-post: separation gate clean; no catalogue content in the client build')

/* 9 ── go-live reminders: right for a staging copy, wrong for the live domain. Warnings, not failures:
      each is a step of _docs/POLARHESTAR-GOLIVE-2026-10-15.md that belongs to the cut-over, not to the build. */
{
  const bundle = walkJs(dist).map((f) => readFileSync(f, 'utf8')).join('\n')
  const warn = []
  if (/sindri@klubbr\.is|sindrimar02@gmail\.com/.test(bundle)) warn.push('the sandbox booking inbox (Sanity siteSettings.bookingEmail, data.ts BOOKING_EMAIL) is still in the bundle: runbook item 4, both → polarhestar@polarhestar.is')
  if (/sndr-platform\.sindri-381\.workers\.dev/.test(bundle)) warn.push('the booking form posts to the workers.dev Worker: runbook item 5, add polarhestar.is + www to the tenant origins before launch')
  warn.push('Sanity CORS must list https://polarhestar.is and https://www.polarhestar.is, or the live CMS refresh is blocked and the page keeps the build-time content (runbook item 7)')
  if (!cfToken) warn.push('no Cloudflare Web Analytics token (VITE_POLARHESTAR_CF_ANALYTICS_TOKEN), and no SNDR Pulse tag: add both at go-live')
  console.log('\npolarhestar-post: GO-LIVE REMINDERS (not build failures):')
  for (const w of warn) console.log('  - ' + w)
}
function walkJs(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) walkJs(p, out)
    else if (/\.js$/.test(e.name)) out.push(p)
  }
  return out
}
