#!/usr/bin/env node
/**
 * Pólar Hestar — static head stamp for the preview routes.
 *
 *   node tools/polarhestar-seo.mjs dist --base=/iceland-frumgerdir/
 *
 * WHY THIS EXISTS (audit of 24 Oct 2026, _docs/polarhestar-seo-audit-2026-10-24)
 * Every route of the preview is the same app shell, and the title, description,
 * canonical and share card were written by React after load. Google renders
 * JavaScript; WhatsApp, Messenger, iMessage and the AI crawlers do not, so they
 * saw "Endurhannanir" and the gallery's Icelandic text about website
 * prototypes. This runs after the build, as tools/reynir-seo.mjs and
 * tools/nypugardar-seo.mjs do for their sites, and writes each route's own
 * <title>, meta description, canonical, Open Graph card (with the farm's own
 * photo from Sanity, cropped to 1200 x 630) and Twitter card into the HTML.
 *
 * What it does NOT do (that is the production build, not this preview):
 * prerender the page body, per-language URLs or hreflang, robots.txt,
 * sitemap.xml, llms.txt, JSON-LD. The `noindex, nofollow` already in the shell
 * is left exactly as it is.
 *
 * The text comes from src/preview/polarhestar/head.ts, bundled here with
 * esbuild, so the browser and the static file can never say different things.
 * The static file is English (the app's default); the hook in useHead.ts
 * switches it when a visitor picks Icelandic or German.
 *
 * Fails the build when a route lacks its own title, description, canonical or
 * card, or when two routes share a title or description.
 */
import { readFileSync, writeFileSync, existsSync, mkdtempSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = process.argv[2] || 'dist'
const basePath = (process.argv.find((a) => a.startsWith('--base=')) || '--base=/').slice(7)

/* The preview lives on the catalogue's github.io project site. A production
   origin (another build) is supplied explicitly, never guessed. */
const SITE = process.env.POLARHESTAR_SITE_URL || ''
const origin = SITE ? SITE.replace(/\/$/, '') : 'https://sindrimar02.github.io'
const prefix = SITE ? '' : basePath.replace(/\/$/, '')
const urlOf = (path) => `${origin}${prefix}/preview/polarhestar/${path}`

const SANITY = 'https://qkoya49k.api.sanity.io/v2025-08-15/data/query/production'

/* ── the text: bundle head.ts so this file never mirrors it ─────────────── */
const out = await build({
  entryPoints: [join(root, 'src/preview/polarhestar/head.ts')],
  bundle: true, format: 'esm', platform: 'node', write: false, logLevel: 'error',
})
const tmp = join(mkdtempSync(join(tmpdir(), 'ph-head-')), 'head.mjs')
writeFileSync(tmp, out.outputFiles[0].text)
const { allStaticHeads } = await import(pathToFileURL(tmp).href)
const heads = allStaticHeads()

/* ── the pictures: the farm's own photos, from the public Sanity dataset ── */
const query = '{"hero": *[_type=="heroSection"][0].image.asset->url, "docs": *[_type in ["tour","longTour"]]{_id, "url": image.asset->url}}'
let hero = ''
const photo = {}
try {
  const res = await fetch(`${SANITY}?query=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const { result } = await res.json()
  hero = result.hero || ''
  for (const d of result.docs) if (d.url) photo[d._id.replace(/^tour-/, 'reidtur/').replace(/^longtour-/, 'ferd/')] = d.url
} catch (e) {
  console.warn(`[polarhestar-seo] WARNING: no Sanity photos (${e.message}); share cards will have no image`)
}
/** 1200 x 630, or the photo's own width at the same ratio when it is narrower: never upscaled. */
function card(url) {
  if (!url) return null
  const m = url.match(/-(\d+)x(\d+)\.\w+$/)
  let w = 1200
  if (m && Number(m[1]) < 1200) w = Number(m[1])
  const h = Math.round((w * 630) / 1200)
  return { src: `${url}?w=${w}&h=${h}&fit=crop`, w, h }
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const MARK = /<!-- ph-seo -->[\s\S]*?<!-- \/ph-seo -->\s*/g

const seen = { title: new Map(), description: new Map() }
const problems = []
let stamped = 0

for (const h of heads) {
  const file = join(dist, 'preview/polarhestar', h.path, 'index.html')
  if (!existsSync(file)) { problems.push(`${h.path || '(home)'}: ${file} was not written by the postbuild route copy`); continue }
  const key = h.path.replace(/\/$/, '')
  const img = card(photo[key] || hero)
  const url = urlOf(h.path)
  const block = [
    '<!-- ph-seo -->',
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Pólar Hestar" />`,
    `<meta property="og:locale" content="en_GB" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:title" content="${esc(h.title)}" />`,
    `<meta property="og:description" content="${esc(h.description)}" />`,
    ...(img ? [`<meta property="og:image" content="${esc(img.src)}" />`, `<meta property="og:image:width" content="${img.w}" />`, `<meta property="og:image:height" content="${img.h}" />`] : []),
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(h.title)}" />`,
    `<meta name="twitter:description" content="${esc(h.description)}" />`,
    ...(img ? [`<meta name="twitter:image" content="${esc(img.src)}" />`] : []),
    '<!-- /ph-seo -->',
  ].join('\n    ')

  let html = readFileSync(file, 'utf8').replace(MARK, '')
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(h.title)}</title>`)
  html = html.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(h.description)}" />`)
  if (!/<title>/.test(html) || !/<meta name="description"/.test(html) || !html.includes('</head>')) { problems.push(`${h.path || '(home)'}: shell has no <title> / description / </head> to stamp`); continue }
  html = html.replace('</head>', `    ${block}\n  </head>`)
  writeFileSync(file, html)
  stamped++

  /* verify what was written, not what was meant to be */
  const got = readFileSync(file, 'utf8')
  const count = (re) => (got.match(re) || []).length
  const where = h.path || '(home)'
  if (count(/<title>/g) !== 1) problems.push(`${where}: ${count(/<title>/g)} <title> tags`)
  if (count(/<meta name="description"/g) !== 1) problems.push(`${where}: ${count(/<meta name="description"/g)} meta descriptions`)
  if (count(/rel="canonical"/g) !== 1) problems.push(`${where}: ${count(/rel="canonical"/g)} canonical links`)
  if (!/property="og:title"/.test(got) || !/name="twitter:card"/.test(got)) problems.push(`${where}: share card missing`)
  if (!img) console.warn(`[polarhestar-seo] WARNING ${where}: no og:image`)
  if (h.description.length > 175) console.warn(`[polarhestar-seo] WARNING ${where}: description is ${h.description.length} characters`)
  for (const f of ['title', 'description']) {
    const prev = seen[f].get(h[f])
    if (prev !== undefined) problems.push(`${where}: same ${f} as ${prev}`)
    seen[f].set(h[f], where)
  }
}

if (problems.length) {
  console.error('[polarhestar-seo] FAILED:\n  ' + problems.join('\n  '))
  process.exit(1)
}
console.log(`[polarhestar-seo] stamped ${stamped} routes (title, description, canonical, og, twitter) under ${origin}${prefix}/preview/polarhestar/`)
