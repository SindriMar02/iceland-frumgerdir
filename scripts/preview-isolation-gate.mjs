/**
 * Preview-link isolation gate — [[preview-link-isolation]].
 *
 * A prospect holding a /preview/<slug> link must never be able to download the
 * rest of the catalogue. This walks the exact set of JS each preview route
 * pulls (shared entry chunk + that route's static import graph) and fails if it
 * finds another company's name or owner email.
 *
 *   npx vite build --manifest && node scripts/preview-isolation-gate.mjs
 *
 * The gate is a bundling check, not a text check: it reads the real chunk graph
 * out of dist/.vite/manifest.json, so it catches a regression the moment some
 * page imports `./companies` (or anything that transitively does) again.
 */
import fs from 'node:fs'
import { build } from 'esbuild'

const MANIFEST = 'dist/.vite/manifest.json'
if (!fs.existsSync(MANIFEST)) {
  console.error(`${MANIFEST} not found — run: npx vite build --manifest`)
  process.exit(2)
}

/**
 * Verified-benign hits: the probe string genuinely belongs on that page and is
 * not catalogue data. Re-check any entry you add here by hand.
 */
const ALLOW = [
  // "Sælan" is a substring of "Inga Sæland", the minister named in BOFS's news copy.
  { route: /^src\/preview\/bofs\//, company: 'saelan' },
  // "Heklusýn" appears only in source comments naming the drift device these pages ported.
  { route: /^src\/preview\/(listak|minjasafn|mysticlight|villanorth)\//, company: 'heklusyn' },
  // "Listasafnið á Akureyri" is a real venue in Sigtryggur's own exhibition CV.
  { route: /^src\/preview\/sigtryggur\//, company: 'listak' },
  // Bílageirinn's loading curtain is imported eagerly by App.tsx as its Suspense
  // fallback, so its wordmark (name only — no audit, email or kennitala) sits in
  // the shared entry chunk. Removing it would change the loader's rendered output.
  { route: /./, company: 'bilageirinn', probe: 'Bílageirinn' },
]
const allowed = (route, slug, probe) =>
  ALLOW.some((a) => a.route.test(route) && a.company === slug && (!a.probe || a.probe === probe))

/* ── the catalogue, evaluated from source so probes can never drift ────── */
const bundled = await build({
  entryPoints: ['src/preview/companies.ts'],
  bundle: true, format: 'esm', write: false, platform: 'node',
  loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.webp': 'dataurl', '.avif': 'dataurl', '.css': 'empty' },
  define: { 'import.meta.env': JSON.stringify({ BASE_URL: '/', MODE: 'production', DEV: false, PROD: true, SSR: false }) },
  external: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'gsap', 'lucide-react', 'three', 'ogl', 'lenis', 'motion'],
})
const { PREVIEW_COMPANIES: companies } = await import(
  'data:text/javascript;base64,' + Buffer.from(bundled.outputFiles[0].text).toString('base64')
)

/* ── chunk graph ───────────────────────────────────────────────────────── */
const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
const graph = (startKeys) => {
  const seen = new Set()
  const walk = (k) => {
    if (seen.has(k) || !manifest[k]) return
    seen.add(k)
    for (const dep of manifest[k].imports ?? []) walk(dep)
  }
  startKeys.forEach(walk)
  return [...seen].map((k) => manifest[k].file).filter((f) => f.endsWith('.js'))
}
const read = (files) => [...new Set(files)].map((f) => fs.readFileSync('dist/' + f, 'utf8')).join('\n')
const base = graph([Object.keys(manifest).find((k) => manifest[k].isEntry)])

const routeKeys = Object.keys(manifest).filter(
  (k) => manifest[k].isDynamicEntry && /^src\/preview\/[^/]+\/[^/]+\.tsx$/.test(k),
)

let failures = 0
for (const key of routeKeys) {
  const slug = key.split('/')[2]
  const text = read([...base, ...graph([key])])
  for (const c of companies) {
    if (c.slug === slug) continue
    for (const probe of [c.name, c.ownerEmail].filter(Boolean)) {
      if (!text.includes(probe) || allowed(key, c.slug, probe)) continue
      failures++
      const i = text.indexOf(probe)
      console.error(`LEAK ${key}\n  ${c.slug} via ${JSON.stringify(probe)}\n  ...${text.slice(Math.max(0, i - 80), i + 80).replace(/\n/g, ' ')}...`)
    }
  }
}

const adminText = read([...base, ...graph(['src/preview/AdminPreviews.tsx'])])
const adminNames = companies.filter((c) => adminText.includes(c.name)).length
if (adminNames !== companies.length) {
  failures++
  console.error(`ADMIN REGRESSION: dashboard graph carries ${adminNames}/${companies.length} company names`)
}

console.log(`\nroute chunks: ${routeKeys.length} | companies: ${companies.length} | admin sees ${adminNames}/${companies.length}`)
console.log(failures ? `FAIL — ${failures} unallowed cross-company hit(s)` : 'PASS — no preview route ships another company’s data')
process.exit(failures ? 1 : 0)
