/**
 * Post-build for the standalone Hótel Bjarkalundur deployment (dist-bjarkalundur/).
 * Pattern: tools/nypugardar-standalone-post.mjs ([[standalone-client-build]],
 * [[prerender-client-builds]]).
 *
 * Runs after the client build and the SSR build (npm run build:bjarkalundur):
 *  1. bjarkalundur.html → index.html.
 *  2. PRUNE public/: whitelist the hotel's own folders; every other client's
 *     photos would otherwise ship to hotelbjarkalundur.is.
 *  3. PRERENDER all eight routes (IS root, EN /en/) into real HTML and write each
 *     route's head from seo.ts through the server bundle, the same function the
 *     browser uses, so crawler and visitor heads cannot disagree. The build FAILS
 *     on an empty body, escaped CSS or content prerendered at opacity:0.
 *  4. 404.html, _redirects (the old Wix addresses → their new pages, 301),
 *     _headers (cache, security, pages.dev noindex).
 *  5. sitemap.xml, robots.txt, llms.txt at the root.
 *  6. favicon-guard, the SEPARATION GATE, and an INDEXABILITY assertion: every
 *     route must carry its canonical on the live origin and no noindex.
 *
 * Usage:  npm run build:bjarkalundur
 *         BJARKALUNDUR_SITE_URL=https://bjarkalundur.pages.dev npm run build:bjarkalundur  (a preview host)
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { execFileSync } from 'node:child_process'

const dist = 'dist-bjarkalundur'
const LIVE = 'https://www.hotelbjarkalundur.is'
const SITE = (process.env.BJARKALUNDUR_SITE_URL || LIVE).replace(/\/$/, '')
const PREVIEW_HOST = SITE !== LIVE
/* The date the words last changed, per the content history; never the build time
   (Google distrusts a sitemap that restamps every URL on every build). Bump it
   only with a real content change. */
const CONTENT_DATE = '2026-09-26'

if (!existsSync(dist)) { console.error('bjarkalundur-post: dist-bjarkalundur missing; run the vite build first'); process.exit(1) }

/* 1 ── the shell */
if (existsSync(join(dist, 'bjarkalundur.html'))) renameSync(join(dist, 'bjarkalundur.html'), join(dist, 'index.html'))

/* 2 ── prune everything the hotel does not own */
const KEEP = new Set(['index.html', 'assets', 'bjarkalundur', 'fonts'])
let pruned = 0
for (const e of readdirSync(dist)) if (!KEEP.has(e)) { rmSync(join(dist, e), { recursive: true, force: true }); pruned++ }
for (const e of readdirSync(join(dist, 'fonts'))) if (!['nyght-serif', 'finlandica-text'].includes(e)) { rmSync(join(dist, 'fonts', e), { recursive: true, force: true }); pruned++ }
copyFileSync(join(dist, 'bjarkalundur/brand/favicon.ico'), join(dist, 'favicon.ico'))
console.log(`bjarkalundur-post: pruned ${pruned} catalogue entries from public/`)

/* 3 ── real HTML and the right head in every route */
const serverEntry = resolve('dist-bjarkalundur-server/bjarkalundur-entry-server.js')
if (!existsSync(serverEntry)) { console.error('bjarkalundur-post: SSR bundle missing; run the --ssr build first'); process.exit(1) }
const { render, PRERENDER_ROUTES, headFor, headHtml, COPY } = await import(pathToFileURL(serverEntry).href)
const shell = readFileSync(join(dist, 'index.html'), 'utf8')
if (!shell.includes('<div id="root"></div>')) { console.error('bjarkalundur-post: shell has no empty #root to fill'); process.exit(1) }

const textOf = (html) => html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
const MIN_TEXT = 900
for (const r of PRERENDER_ROUTES) {
  const body = await render(r.path)
  const text = textOf(body)
  if (text.length < MIN_TEXT) { console.error(`bjarkalundur-post: ${r.path} prerendered only ${text.length} chars of text; an empty page is what AI crawlers would read`); process.exit(1) }
  const escaped = [...body.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].reduce((n, m) => n + (m[1].match(/&#x27;|&quot;|&amp;/g) || []).length, 0)
  if (escaped) { console.error(`bjarkalundur-post: ${r.path} has HTML-escaped CSS inside <style>; render it with dangerouslySetInnerHTML`); process.exit(1) }
  const hidden = (body.replace(/<style[\s\S]*?<\/style>/g, '').match(/opacity:\s*0[;"]/g) || []).length
  if (hidden) { console.error(`bjarkalundur-post: ${r.path} prerenders ${hidden} element(s) at opacity:0; reveals must arm in an effect`); process.exit(1) }
  const head = headHtml(headFor(r.lang, r.page, SITE))
  const html = shell
    .replace('<html lang="is">', `<html lang="${r.lang}">`)
    .replace(/<title>[\s\S]*?<\/title>/, head)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  const dir = join(dist, r.path.replace(/^\/|\/$/g, ''))
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), PREVIEW_HOST ? html.replace('<meta name="robots" content="max-image-preview:large">', '<meta name="robots" content="noindex, nofollow">') : html)
  console.log(`  ${r.path.padEnd(16)} ${String(text.length).padStart(6)} chars of text · ${COPY[r.lang].meta[r.page].title}`)
}

/* 4 ── host rules */
writeFileSync(join(dist, '404.html'), `<!doctype html><html lang="is"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Síða fannst ekki · Page not found | Hótel Bjarkalundur</title><link rel="icon" href="/bjarkalundur/brand/favicon-48.png" type="image/png" sizes="48x48"><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#232421;color:#F5F4F1;font:17px/1.6 system-ui,sans-serif;text-align:center;padding:24px}a{color:#F5F4F1}</style></head><body><main><h1 style="font-weight:400">Síða fannst ekki · Page not found</h1><p><a href="/">Hótel Bjarkalundur</a> · <a href="/en/">Hotel Bjarkalundur in English</a></p></main></body></html>`)
writeFileSync(join(dist, '_redirects'), [
  '# The old Wix site (English only). Every address it had lands on the matching',
  '# page of the new site, permanently, so its links and rankings move with it.',
  '/about /en/ 301',
  '/acomm /en/rooms/ 301',
  '/book-a-room /en/rooms/ 301',
  '/campsite /en/campsite/ 301',
  '/restaurant /en/ 301',
  '/menu /en/ 301',
  '/location /en/ 301',
  '/contact-us /en/ 301',
  '/blog /en/ 301',
  '/blog/* /en/ 301',
  '# Unknown paths get the real 404.html; every valid route is prerendered.',
  '',
].join('\n'))
writeFileSync(join(dist, '_headers'), [
  '/assets/*',
  '  Cache-Control: public, max-age=31536000, immutable',
  '',
  '/fonts/*',
  '  Cache-Control: public, max-age=31536000, immutable',
  '',
  '/bjarkalundur/*',
  '  Cache-Control: public, max-age=2592000',
  '',
  '/*',
  '  Strict-Transport-Security: max-age=31536000',
  '  X-Frame-Options: DENY',
  "  Content-Security-Policy: frame-ancestors 'none'",
  '  X-Content-Type-Options: nosniff',
  '  Referrer-Policy: strict-origin-when-cross-origin',
  '  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  '',
  '# The Pages host must never compete with the real domain in search.',
  'https://bjarkalundur.pages.dev/*',
  '  X-Robots-Tag: noindex',
  '',
  'https://:version.bjarkalundur.pages.dev/*',
  '  X-Robots-Tag: noindex',
  '',
].join('\n'))

/* 5 ── sitemap, robots, llms.txt. hreflang lives in the head only (one place). */
writeFileSync(join(dist, 'sitemap.xml'), [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...PRERENDER_ROUTES.map((r) => `  <url><loc>${SITE}${r.path}</loc><lastmod>${CONTENT_DATE}</lastmod></url>`),
  '</urlset>', '',
].join('\n'))
writeFileSync(join(dist, 'robots.txt'), PREVIEW_HOST
  ? 'User-agent: *\nDisallow: /\n'
  : `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`)
const en = COPY.en, is = COPY.is
const page = (lang, p) => `${SITE}${PRERENDER_ROUTES.find((r) => r.lang === lang && r.page === p).path}`
writeFileSync(join(dist, 'llms.txt'), [
  '# Hótel Bjarkalundur',
  '',
  `> ${en.meta.home.description}`,
  '',
  `${en.intro.body[0]} ${en.owners.body[0]}`,
  '',
  '## Facts',
  '- Address: Bjarkalundi, 381 Reykhólahreppur, Westfjords, Iceland (Route 60). GPS 65.55643, -22.10442',
  `- Phone: ${'+354 562 1900'} · Email: info.hotelbjarkalundur@gmail.com`,
  '- Check-in from 15:00, check-out by 11:00. Restaurant open daily from 07:00 into the evening while the hotel is open.',
  '- Closed for part of the winter; reopens in March.',
  '- 19 rooms in the main house plus cottages; a campsite by the stream; fuel and EV charging on site.',
  '- Book directly: https://property.godo.is/booking2.php?propid=51121',
  '',
  '## Questions guests ask',
  ...en.faq.items.map((f) => `- ${f.q} ${f.a}`),
  '',
  '## Pages',
  `- [Home (English)](${page('en', 'home')})`,
  `- [Rooms and cottages](${page('en', 'rooms')})`,
  `- [Campsite](${page('en', 'campsite')})`,
  `- [Guest reviews](${page('en', 'reviews')})`,
  `- [Forsíða (íslenska)](${page('is', 'home')})`,
  `- [Gisting](${page('is', 'rooms')})`,
  `- [Tjaldsvæðið](${page('is', 'campsite')})`,
  `- [Umsagnir gesta](${page('is', 'reviews')})`,
  '',
  `${is.meta.home.description}`,
  '',
].join('\n'))

/* 6 ── guards */
execFileSync('node', ['tools/favicon-guard.mjs', dist], { stdio: 'inherit' })

const OTHER_CLIENTS = [
  'reynir', 'nypugardar', 'polarhestar', 'tjoruhusid', 'erpsstadir', 'hofdabilar', 'olvisholt', 'smekkleysa',
  'villanorth', 'katrinisfeld', 'aurorahills', 'instaprent', 'fagravik', 'eyvik', 'PreviewChrome', 'companies.ts', '/preview/',
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
if (leaks.length) { console.error('bjarkalundur-post: CATALOGUE LEAKED INTO THE CLIENT BUILD:'); for (const l of leaks) console.error('  ' + l); process.exit(1) }
console.log('bjarkalundur-post: separation gate clean')

const problems = []
for (const r of PRERENDER_ROUTES) {
  const html = readFileSync(join(dist, r.path.replace(/^\/|\/$/g, ''), 'index.html'), 'utf8')
  const canon = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]
  if (canon !== `${SITE}${r.path}`) problems.push(`${r.path}: canonical ${canon}`)
  if (!PREVIEW_HOST && /<meta name="robots" content="[^"]*noindex/.test(html)) problems.push(`${r.path}: noindex on the live build`)
  if (!/<meta name="robots" content="max-image-preview:large">/.test(html) && !PREVIEW_HOST) problems.push(`${r.path}: robots meta missing`)
  if ((html.match(/hreflang=/g) || []).length !== 3) problems.push(`${r.path}: expected 3 hreflang links`)
  if (!html.includes(`<html lang="${r.lang}">`)) problems.push(`${r.path}: html lang is not ${r.lang}`)
}
if (problems.length) { console.error('bjarkalundur-post: INDEXABILITY CHECK FAILED'); for (const p of problems) console.error('  ' + p); process.exit(1) }
console.log(`bjarkalundur-post: ${PRERENDER_ROUTES.length} routes indexable at ${SITE}${PREVIEW_HOST ? ' (PREVIEW HOST: noindex + Disallow on purpose)' : ''}`)
