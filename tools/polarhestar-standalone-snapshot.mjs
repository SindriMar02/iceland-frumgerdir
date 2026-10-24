/**
 * Pólar Hestar standalone build, step 0: freeze the CMS.
 *
 *   node tools/polarhestar-standalone-snapshot.mjs
 *
 * Reads the PUBLISHED content of Sanity project qkoya49k (dataset production)
 * with the same GROQ query the page runs in the browser (QUERY in
 * src/preview/polarhestar/sanity.ts, extracted from the source so the two can
 * never drift) and writes .cache/polarhestar-cms.json:
 *
 *   { builtAt: "2026-10-24", fetchedAt: "<ISO>", query: <sha1 of the GROQ>, raw: <the response> }
 *
 * Both Vite builds (client + SSR) read that one file, so the prerendered HTML
 * and the bundle the browser hydrates it with are made from identical content.
 * `builtAt` is the date the prerender treats as "today": the client freezes
 * its clock to it for the first render (see now.ts), otherwise a departure
 * that passes between build and visit would render differently on the server
 * and in the browser.
 *
 * The CMS stays the live source after hydration: the page re-fetches and swaps
 * in anything that changed since the build. This snapshot is for crawlers and
 * the first paint; a Sanity change reaches Google at the next build.
 *
 * Read-only: a public GET, no token, nothing is written to Sanity.
 *
 * Flags / env
 *   --offline        reuse the existing .cache file (fails if there is none)
 */
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const OUT = '.cache/polarhestar-cms.json'
const PROJECT = 'qkoya49k'
const DATASET = 'production'
const API_VERSION = '2025-08-15'

if (process.argv.includes('--offline')) {
  if (!existsSync(OUT)) {
    console.error(`polarhestar-snapshot: --offline but ${OUT} does not exist`)
    process.exit(1)
  }
  const s = JSON.parse(readFileSync(OUT, 'utf8'))
  console.log(`polarhestar-snapshot: reusing ${OUT} (built ${s.builtAt}, fetched ${s.fetchedAt})`)
  process.exit(0)
}

const src = readFileSync('src/preview/polarhestar/sanity.ts', 'utf8')
const m = src.match(/export const QUERY = `([\s\S]*?)`\n/)
if (!m) {
  console.error('polarhestar-snapshot: could not find `export const QUERY = `...`` in sanity.ts')
  process.exit(1)
}
const query = m[1].replace(/\$\{IMG_PRJ\}/g, '{asset, hotspot, "alt": alt}')
if (query.includes('${')) {
  console.error('polarhestar-snapshot: QUERY still has an unresolved ${...} placeholder')
  process.exit(1)
}

const url = `https://${PROJECT}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?perspective=published&query=${encodeURIComponent(query)}`
const res = await fetch(url, { headers: { accept: 'application/json' } })
if (!res.ok) {
  console.error(`polarhestar-snapshot: Sanity answered ${res.status} ${res.statusText}\n${(await res.text()).slice(0, 400)}`)
  process.exit(1)
}
const body = await res.json()
const raw = body.result
if (!raw || !Array.isArray(raw.tours) || !raw.tours.length || !Array.isArray(raw.longTours) || !raw.longTours.length) {
  console.error('polarhestar-snapshot: the CMS answered but tours / longTours are empty; refusing to freeze that')
  process.exit(1)
}

/* Iceland is UTC+0 all year, so the UTC date is the local date. */
const builtAt = new Date().toISOString().slice(0, 10)
mkdirSync('.cache', { recursive: true })
writeFileSync(
  OUT,
  JSON.stringify({
    builtAt,
    fetchedAt: new Date().toISOString(),
    query: createHash('sha1').update(query).digest('hex').slice(0, 12),
    raw,
  }),
)
console.log(
  `polarhestar-snapshot: ${OUT} written. ${raw.tours.length} short tours, ${raw.longTours.length} long tours ` +
    `(${raw.longTours.filter((t) => t.active !== false).length} active), ${raw.reviews?.length ?? 0} reviews, ` +
    `${raw.gallery?.length ?? 0} gallery photos. builtAt ${builtAt}`,
)
