/**
 * Reynir bakarí — push the BUNDLED order catalogue into Sanity.
 *
 * Why this exists: the order catalogue lives in two places at once. `order.ts`
 * is the fallback that ships in the bundle and renders instantly; the Sanity
 * documents are what the owner edits and what OVERRIDES the fallback at
 * runtime. Change only the code and the live site keeps showing the old
 * catalogue, silently — which is exactly what happened when the marsipanterta
 * replaced the generic cake: the code was right and the page was wrong.
 *
 * So the shape is generated FROM the code rather than retyped, and this script
 * is the only supported way to reset the CMS to it.
 *
 *   node tools/reynir-seed-order.mjs            # show what would change
 *   node tools/reynir-seed-order.mjs --write    # apply it
 *
 * ⚠️ This OVERWRITES the order-product documents. Anything the owner has
 * edited in the studio for those products is replaced. Products it does not
 * know about are listed as orphans and never touched automatically, because
 * deleting a product the owner added by hand would be worse than leaving it.
 *
 * Auth comes from the Sanity CLI login (~/.config/sanity/config.json), so it
 * runs as whoever is logged in and needs no token in the repo.
 */
import { execFileSync } from 'node:child_process'
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { homedir } from 'node:os'

const PROJECT = 'v4v3s4wg'
const DATASET = 'production'
const WRITE = process.argv.includes('--write')

const token = (() => {
  try {
    return JSON.parse(readFileSync(join(homedir(), '.config/sanity/config.json'), 'utf8')).authToken
  } catch { return null }
})()
if (!token) {
  console.error('No Sanity CLI login found. Run `npx sanity login` first.')
  process.exit(1)
}

/* ── read the catalogue out of the app source, not a copy of it ─────────── */
const tmp = join(process.cwd(), 'node_modules', '.cache', 'reynir-seed-order')
mkdirSync(tmp, { recursive: true })
const entry = join(tmp, 'entry.ts')
const bundle = join(tmp, 'bundle.mjs')
writeFileSync(entry, `import { ORDER_PRODUCTS } from ${JSON.stringify(join(process.cwd(), 'src/preview/reynir/order.ts'))}
;(globalThis).__P = ORDER_PRODUCTS
`)
execFileSync('npx', ['esbuild', entry, '--bundle', '--platform=node', '--format=esm',
  `--outfile=${bundle}`,
  '--loader:.webp=empty', '--loader:.png=empty', '--loader:.jpg=empty',
  '--define:import.meta.env={"BASE_URL":"/"}', '--log-level=error'], { stdio: 'inherit' })
await import(pathToFileURL(bundle).href)
const PRODUCTS = globalThis.__P

/* ── shape one product as its Sanity document ───────────────────────────── */
const slug = (v) => ({ _type: 'slug', current: v })
const loc = (v) => (v ? { _type: 'localeString', is: v.is, en: v.en } : undefined)
const locT = (v) => (v ? { _type: 'localeText', is: v.is, en: v.en } : undefined)

const docs = PRODUCTS.map((p, i) => {
  const d = {
    _id: `orderProduct-${p.id}`,
    _type: 'orderProduct',
    id: slug(p.id),
    order: (i + 1) * 10,
    active: true,
    name: loc(p.name),
    blurb: locT(p.blurb),
    basePrice: p.basePrice,
    leadDays: p.leadDays,
    groups: p.groups.map((g) => ({
      _type: 'orderGroup',
      _key: g.id,
      id: slug(g.id),
      kind: g.kind,
      label: loc(g.label),
      ...(g.help ? { help: locT(g.help) } : {}),
      // Same opt-in rule as the merge: absent means optional.
      required: g.required === true,
      ...(g.max ? { max: g.max } : {}),
      ...(g.layout ? { layout: g.layout } : {}),
      choices: g.choices.map((c) => ({
        _type: 'orderChoice',
        _key: c.id,
        id: slug(c.id),
        label: loc(c.label),
        priceDelta: c.priceDelta,
        ...(c.note ? { note: locT(c.note) } : {}),
        ...(typeof c.serves === 'number' ? { serves: c.serves } : {}),
        ...(c.quoteOnly ? { quoteOnly: true } : {}),
        ...(c.needsPhoto ? { needsPhoto: true } : {}),
        ...(c.adds ? { adds: c.adds.map(loc) } : {}),
        ...(c.swap
          ? { swap: { layerId: slug(c.swap.layerId), label: loc(c.swap.label) } }
          : {}),
        ...(c.freeText
          ? {
              freeText: {
                label: loc(c.freeText.label),
                placeholder: loc(c.freeText.placeholder),
                maxLength: c.freeText.maxLength,
              },
            }
          : {}),
      })),
    })),
  }
  if (p.pricePerPerson) d.pricePerPerson = p.pricePerPerson
  if (p.composition) {
    d.composition = p.composition.map((l) => ({ _key: l.id, id: slug(l.id), label: loc(l.label) }))
  }
  if (p.compositionGroupId) d.compositionGroupId = slug(p.compositionGroupId)
  if (p.sizeGroupId) d.sizeGroupId = slug(p.sizeGroupId)
  if (p.inscription) {
    d.inscription = {
      label: loc(p.inscription.label),
      placeholder: loc(p.inscription.placeholder),
      maxLength: p.inscription.maxLength,
    }
  }
  return d
})

/* ── what is live now ───────────────────────────────────────────────────── */
const q = encodeURIComponent('*[_type=="orderProduct"]{_id,"id":id.current,"n":name.is,basePrice,pricePerPerson}')
const res = await fetch(`https://${PROJECT}.api.sanity.io/v2025-08-15/data/query/${DATASET}?query=${q}`, {
  headers: { Authorization: `Bearer ${token}` },
})
const live = (await res.json()).result || []
const wantIds = new Set(docs.map((d) => d._id))
const orphans = live.filter((l) => !wantIds.has(l._id))

console.log('\nBundled catalogue → Sanity\n')
for (const d of docs) {
  const was = live.find((l) => l._id === d._id)
  const price = d.pricePerPerson ? `${d.pricePerPerson} kr./mann` : `frá ${d.basePrice} kr.`
  console.log(`  ${was ? 'replace' : 'CREATE '}  ${d._id.padEnd(28)} ${String(d.name.is).padEnd(18)} ${price}`)
}
for (const o of orphans) {
  console.log(`  ORPHAN   ${o._id.padEnd(28)} ${String(o.n || '').padEnd(18)} not in the code, left alone`)
}
if (orphans.length) {
  console.log('\n  Orphans are never deleted automatically. If one is genuinely retired,')
  console.log('  delete it in the studio, or the site keeps offering it.')
}

if (!WRITE) {
  console.log('\nDry run. Re-run with --write to apply.\n')
  process.exit(0)
}

const mutations = docs.map((doc) => ({ createOrReplace: doc }))
const mres = await fetch(`https://${PROJECT}.api.sanity.io/v2025-08-15/data/mutate/${DATASET}?returnDocuments=false`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ mutations }),
})
const out = await mres.json()
if (!mres.ok || out.error) {
  console.error('\nWrite failed:', JSON.stringify(out, null, 2))
  process.exit(1)
}
console.log(`\nWrote ${docs.length} product(s). Transaction ${out.transactionId}\n`)
