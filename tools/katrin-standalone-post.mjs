/**
 * Katrín Ísfeld — everything that happens after `vite build`.
 *
 *   1. PRUNE public/. Vite copies the entire public directory, which in this
 *      repo means every other client's photographs — a ~2 GB output for a
 *      site that uses one folder of it.
 *   2. PRERENDER every route to static HTML.
 *   3. INJECT the head: meta, Open Graph, hreflang, schema.org, plus
 *      sitemap.xml, robots.txt, llms.txt and the 301 map.
 *   4. GATE. Grep the emitted files for any other client's slug and fail the
 *      build on a hit. This is the step that turns "the catalogue should be
 *      unreachable" into a failed build rather than a silent leak.
 */
import { readdirSync, rmSync, statSync, readFileSync, renameSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'

const dist = 'dist-katrin'
const KEEP = new Set(['katrinisfeld', 'fonts'])

/* 0 ── Vite names its output after the entry, so a katrin.html entry emits
   dist-katrin/katrin.html and NO index.html. Every static host wants
   index.html, and so does the prerenderer's own fallback. This one fails
   silently in the worst way: the prerender server has nothing to serve, every
   route comes back empty, and the build carries on writing perfect meta tags
   onto blank pages. */
if (existsSync(join(dist, 'katrin.html'))) {
  rmSync(join(dist, 'index.html'), { force: true })
  renameSync(join(dist, 'katrin.html'), join(dist, 'index.html'))
  console.log('katrin-post: katrin.html → index.html')
}
if (!existsSync(join(dist, 'index.html'))) {
  console.error('katrin-post: no index.html in the build output')
  process.exit(1)
}

/* 1 ── prune */
let pruned = 0
for (const entry of readdirSync(dist)) {
  if (entry === 'assets' || entry === 'index.html' || entry.startsWith('.')) continue
  if (KEEP.has(entry)) continue
  const p = join(dist, entry)
  if (statSync(p).isDirectory()) { rmSync(p, { recursive: true, force: true }); pruned++ }
}
/* her own folder still holds the source JPEGs that only exist as fallbacks,
   plus the harvest scratch dirs; keep the JPEGs, drop nothing else here */
console.log(`katrin-post: pruned ${pruned} unrelated public folders`)

/* The source JPEGs are the harvest originals. Nothing in the built markup
   points at them any more — the <img> fallback is WebP — so they are 16 MB of
   host storage serving no request. They stay in the repository. */
const photoDir = join(dist, 'katrinisfeld')
let jpgs = 0, jpgBytes = 0
for (const f of readdirSync(photoDir)) {
  if (!f.endsWith('.jpg')) continue
  jpgBytes += statSync(join(photoDir, f)).size
  rmSync(join(photoDir, f))
  jpgs++
}
console.log(`katrin-post: pruned ${jpgs} source JPEGs (${(jpgBytes / 1024 / 1024).toFixed(1)} MB)`)

/* the fonts folder carries ~30 families for the catalogue; this site uses 3 */
const fontsDir = join(dist, 'fonts')
const USED_FONTS = new Set(['sentient', 'archia', 'geist-mono'])
if (existsSync(fontsDir)) {
  let dropped = 0
  for (const f of readdirSync(fontsDir)) {
    if (!USED_FONTS.has(f)) { rmSync(join(fontsDir, f), { recursive: true, force: true }); dropped++ }
  }
  console.log(`katrin-post: dropped ${dropped} unused font families`)
}

/* 2 + 3 */
const env = { ...process.env, KATRIN_STANDALONE: '1' }
execFileSync('node', ['tools/katrin-prerender.mjs', dist], { stdio: 'inherit', env })
execFileSync('node', ['tools/katrin-seo.mjs', dist], { stdio: 'inherit', env })

/* 4 ── the separation gate */
const OTHER_SLUGS = [
  'reynir', 'bofs', 'mirrorhouse', 'huldamargret', 'chrislund', 'aurora', 'lakeview',
  'flatbakan', 'bilageirinn', 'geisli', 'logak', 'alrun', 'sandholt', 'una', 'motta',
  'smekkleysa', 'drangar', 'obyggdasetur', 'hveravellir', 'thg', 'yrki', 'tark',
]
const files = []
const walk = (d) => {
  for (const e of readdirSync(d)) {
    const p = join(d, e)
    if (statSync(p).isDirectory()) walk(p)
    else if (/\.(js|css|html|txt|xml)$/.test(e)) files.push(p)
  }
}
walk(dist)

const hits = []
for (const f of files) {
  const body = readFileSync(f, 'utf8')
  for (const slug of OTHER_SLUGS) {
    if (new RegExp(`\\b${slug}\\b`, 'i').test(body)) hits.push(`${f} → ${slug}`)
  }
  if (/\/preview\//.test(body)) hits.push(`${f} → a /preview/ path`)
  if (/ownerEmail|conceptTagline|outreach/.test(body)) hits.push(`${f} → catalogue record fields`)
}

if (hits.length) {
  console.error('katrin-post: SEPARATION GATE FAILED — the catalogue leaked into her build:')
  hits.slice(0, 25).forEach((h) => console.error('   ' + h))
  process.exit(1)
}
console.log('katrin-post: separation gate clean')

const total = files.reduce((s, f) => s + statSync(f).size, 0)
const js = files.filter((f) => f.endsWith('.js')).reduce((s, f) => s + statSync(f).size, 0)
console.log(`katrin-post: ${files.length} text files, ${(total / 1024).toFixed(0)} KB (JS ${(js / 1024).toFixed(0)} KB)`)
