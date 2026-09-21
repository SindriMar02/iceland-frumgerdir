/**
 * Reynir bakarí — make what the Studio shows the same as what the site shows,
 * for the two lists the site was still taking from its own bundle
 * (audit 2026-09-21, findings B2 and B9):
 *
 *  1. Meðlæti (orderExtras). The site found the three extras by EXACT menu
 *     name, so renaming "Kleina" froze its order price at the bundled 395 kr.
 *     Seeded as references to the menu items: a price changed on the menu
 *     reaches the order form, and Sanity refuses to delete a menu item an
 *     extra still points at. No kjör/bulk prices: those are unconfirmed and
 *     stay off, exactly as they are today.
 *  2. Tilefni for private customers. All seven occasions in the Studio are
 *     company ones (a lane that is switched off), so the owner saw seven
 *     entries that change nothing, and the eight the site shows came from the
 *     bundle. Seeded as person occasions; the first one makes the CMS list
 *     take over that half (sanity.ts merges per audience). "afmaeli" is taken
 *     by the company doc, so the private one is "afmaeli-p".
 *  3. Hotspot on the four product photos, at the centre: that is the crop the
 *     site already serves, so nothing moves, and the owner starts from a
 *     hotspot he can see and drag instead of a warning.
 *
 *   node tools/reynir-seed-cms-2026-09-21.mjs           # dry run
 *   node tools/reynir-seed-cms-2026-09-21.mjs --write
 *
 * Safe: skips anything that already exists or has an open draft, every patch
 * carries ifRevisionID, uploads de-duplicate by hash. Auth: Sanity CLI login.
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { homedir } from 'node:os'
import { fileURLToPath } from 'node:url'

const API = 'https://v4v3s4wg.api.sanity.io/v2025-08-15'
const DATASET = 'production'
const WRITE = process.argv.includes('--write')
const PUB = join(dirname(fileURLToPath(import.meta.url)), '../public/reynir/order')
const token = JSON.parse(readFileSync(join(homedir(), '.config/sanity/config.json'), 'utf8')).authToken
if (!token) { console.error('No Sanity CLI login.'); process.exit(1) }
const auth = { Authorization: `Bearer ${token}` }
const query = async (q) => (await (await fetch(`${API}/data/query/${DATASET}?query=${encodeURIComponent(q)}`, { headers: auth })).json()).result
const mutate = async (mutations) => {
  const r = await fetch(`${API}/data/mutate/${DATASET}?returnIds=true`, { method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify({ mutations }) })
  const out = await r.json()
  if (!r.ok || out.error) throw new Error(JSON.stringify(out))
  return out.transactionId
}
const bi = (is, en) => ({ _type: 'localeString', is, en })

const EXTRAS = [
  { id: 'kleinur', menu: 'Kleina', label: bi('Kleinur', 'Kleinur'), file: 'extra-kleinur.webp', step: 5, max: 100 },
  { id: 'lengjur', menu: 'Vínarbrauðslengja með súkkulaðiglassúr', label: bi('Vínarbrauðslengjur', 'Vínarbrauðslengjur'), file: 'extra-lengjur.webp', step: 1, max: 10 },
  { id: 'pistasiusnudar', menu: 'Pistasíusnúður', label: bi('Pistasíusnúðar', 'Pistachio snúðar'), file: 'extra-pistasiu.webp', step: 5, max: 60 },
]
const OCCASIONS = [
  ['afmaeli-p', 'Afmæli', 'Birthday', ['Til hamingju með afmælið, Anna', 'Happy birthday Anna']],
  ['barnaafmaeli', 'Barnaafmæli', "Child's birthday", ['Til hamingju Emma, 6 ára', 'Happy birthday Emma, 6 today']],
  ['ferming', 'Ferming', 'Confirmation', ['Fermingardagurinn, 25. apríl', 'Confirmation day, 25 April']],
  ['skirn', 'Skírn', 'Christening', ['Skírnardagurinn', 'Christening day']],
  ['brudkaup', 'Brúðkaup', 'Wedding', ['Anna og Jón', 'Anna & Jón']],
  ['utskrift', 'Útskrift', 'Graduation', ['Til hamingju með útskriftina', 'Congratulations on your graduation']],
  ['erfidrykkja-p', 'Erfidrykkja', 'Funeral reception', null],
  ['annad-p', 'Annað', 'Something else', null, true],
]
const PRODUCTS = ['marsipanterta', 'kransakaka', 'ricecrispies', 'barnaterta'].map((p) => `orderProduct-${p}`)

const settings = (await query('*[_id in ["siteSettings","drafts.siteSettings"]]{_id,_rev,"n":count(orderExtras)}'))
const menu = await query('*[_type=="menuItem" && !(_id in path("drafts.**"))]{_id,name,price}')
const occ = await query('*[_type=="occasion"]{_id,"id":id.current}')
const prods = await query(`*[_id in ${JSON.stringify([...PRODUCTS, ...PRODUCTS.map((p) => `drafts.${p}`)])}]{_id,_rev,"img":image.asset._ref,"hs":defined(image.hotspot)}`)

const pub = settings.find((s) => s._id === 'siteSettings')
const plan = { extras: null, occasions: [], hotspots: [] }
if (settings.some((s) => s._id === 'drafts.siteSettings')) console.log('SKIP extras: siteSettings has an open draft')
else if (pub.n) console.log(`SKIP extras: ${pub.n} already set`)
else {
  const rows = EXTRAS.map((e) => {
    const m = menu.find((x) => x.name === e.menu)
    if (!m) throw new Error(`menu item not found: ${e.menu}`)
    console.log(`  extra ${e.id.padEnd(16)} → ${m._id} (${m.name}, ${m.price}), step ${e.step}, max ${e.max}`)
    return { ...e, ref: m._id }
  })
  plan.extras = rows
}
for (const o of OCCASIONS) {
  if (occ.some((x) => x.id === o[0] || x._id === `occasion-${o[0]}`)) console.log(`  SKIP occasion ${o[0]} (exists)`)
  else { plan.occasions.push(o); console.log(`  occasion ${o[0].padEnd(14)} ${o[1]}`) }
}
for (const id of PRODUCTS) {
  const p = prods.find((d) => d._id === id)
  if (!p?.img) console.log(`  SKIP hotspot ${id} (no photo)`)
  else if (prods.some((d) => d._id === `drafts.${id}`)) console.log(`  SKIP hotspot ${id} (open draft)`)
  else if (p.hs) console.log(`  SKIP hotspot ${id} (already set)`)
  else { plan.hotspots.push(p); console.log(`  hotspot centre ${id}`) }
}
if (!WRITE) { console.log('\nDry run. Re-run with --write.'); process.exit(0) }

if (plan.extras) {
  const rows = []
  for (const e of plan.extras) {
    const up = await fetch(`${API}/assets/images/${DATASET}?filename=${e.file}`, { method: 'POST', headers: { ...auth, 'Content-Type': 'image/webp' }, body: readFileSync(join(PUB, e.file)) })
    const asset = (await up.json()).document
    if (!asset?._id) throw new Error(`upload failed: ${e.file}`)
    rows.push({ _key: e.id, _type: 'orderExtra', id: { _type: 'slug', current: e.id }, menuItem: { _type: 'reference', _ref: e.ref }, label: e.label,
      image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id }, hotspot: { _type: 'sanity.imageHotspot', x: 0.5, y: 0.5, width: 1, height: 1 } }, step: e.step, max: e.max })
  }
  console.log('extras tx', await mutate([{ patch: { id: 'siteSettings', ifRevisionID: pub._rev, set: { orderExtras: rows } } }]))
}
if (plan.occasions.length) {
  console.log('occasions tx', await mutate(plan.occasions.map(([id, is, en, sug, free], i) => ({ create: {
    _id: `occasion-${id}`, _type: 'occasion', id: { _type: 'slug', current: id }, label: bi(is, en), audience: 'person',
    freeText: !!free, ...(sug ? { suggests: bi(sug[0], sug[1]) } : {}), order: (i + 1) * 10 } }))))
}
for (const p of plan.hotspots) {
  console.log('hotspot tx', p._id, await mutate([{ patch: { id: p._id, ifRevisionID: p._rev, set: { 'image.hotspot': { _type: 'sanity.imageHotspot', x: 0.5, y: 0.5, width: 1, height: 1 } } } }]))
}
console.log('done')
