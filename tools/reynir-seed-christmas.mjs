/**
 * Reynir bakarí — put the Christmas products into the Studio (Jólin > Jólavörur).
 *
 * The Christmas page shows the built-in list (src/preview/reynir/jol-data.ts)
 * until the Studio has products, and switches to the Studio's list as a whole
 * the moment it has one (all-or-nothing, like the gallery). So the Studio must
 * start with the same list, or the owner's first edit would make the rest of
 * the page vanish. This creates them, with the photos he sent on 16 Nov 2026
 * (email), 17 Nov (Messenger: hnoðuð lagterta, vanilluhringir) and 18 Nov
 * (Messenger: hvít lagterta, kókosspesíur, súkkulaðibitakökur).
 * The list below mirrors jol-data.ts; keep the two in step.
 *
 *   node tools/reynir-seed-christmas.mjs            # show what would change
 *   node tools/reynir-seed-christmas.mjs --write    # apply it
 *
 * Safe: createIfNotExists with fixed ids, so re-running never duplicates and
 * never overwrites anything he has edited. Also sets siteSettings.christmas
 * to on only if it is missing. Auth: the Sanity CLI login.
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { homedir } from 'node:os'
import { fileURLToPath } from 'node:url'

const PROJECT = 'v4v3s4wg'
const DATASET = 'production'
const API = `https://${PROJECT}.api.sanity.io/v2025-08-15`
const WRITE = process.argv.includes('--write')
const PUB = join(dirname(fileURLToPath(import.meta.url)), '../public/reynir/jol/vorur')

const L = (is, en) => ({ _type: 'localeString', is, en })
const PRODUCTS = [
  ['lagterta-hraerd', 'lagtertur', 10, L('Lagterta hrærð með kremi', 'Layer cake with cream'), '2.470 kr.'],
  ['lagterta-hnodud', 'lagtertur', 20, L('Lagterta hnoðuð með kremi og sveskjusultu', 'Kneaded layer cake with cream and prune jam'), '2.470 kr.', 'lagterta-hnodud.webp'],
  ['lagterta-karamellu', 'lagtertur', 30, L('Karamellulagterta með kremi', 'Caramel layer cake with cream'), '2.470 kr.', 'lagterta.webp'],
  ['lagterta-hvit', 'lagtertur', 40, L('Hvít lagterta með rabarbarasultu', 'White layer cake with rhubarb jam'), '2.470 kr.', 'lagterta-hvit.webp'],
  ['lagterta-half', 'lagtertur', 50, L('Hálf lagterta', 'Half layer cake'), '1.350 kr.'],
  ['ensk-avaxtakaka', 'kokur', 10, L('Ensk ávaxtakaka', 'English fruit cake'), '2.550 kr.', 'jolakaka.webp'],
  ['vanilluhringir', 'smakokur', 10, L('Vanilluhringir', 'Vanilla rings'), '999 kr.', 'vanilluhringir.webp'],
  ['mommukokur', 'smakokur', 20, L('Mömmukökur', 'Mömmukökur'), '999 kr.', 'mommukokur.webp'],
  ['lakkristoppar', 'smakokur', 30, L('Lakkrístoppar', 'Liquorice meringues'), '999 kr.', 'lakkristoppar.webp'],
  ['piparkokur', 'smakokur', 40, L('Piparkökur', 'Gingerbread cookies'), '999 kr.'],
  ['spesiur', 'smakokur', 50, L('Spesíur', 'Spesíur butter cookies'), '999 kr.'],
  ['kokosspesiur', 'smakokur', 60, L('Kókosspesíur', 'Coconut spesíur'), '999 kr.', 'kokosspesiur.webp'],
  ['sukkuladibitakokur', 'smakokur', 70, L('Súkkulaðibitakökur', 'Chocolate chip cookies'), '999 kr.', 'sukkuladibitakokur.webp'],
  ['butterdeigsbotn', 'annad', 10, L('Butterdeigsbotn', 'Puff pastry base'), '1.750 kr.', 'butterdeig.webp'],
]

// photo descriptions, mirrored from jol-data.ts pic(...)
const ALTS = {
  'lagterta-hnodud.webp': L('Hnoðuð lagterta með kremi og sveskjusultu, skorin', 'Kneaded layer cake with cream and prune jam, cut'),
  'lagterta.webp': L('Karamellulagterta með kremi, sneidd, við jólakúlur', 'Caramel layer cake with cream, sliced, beside Christmas baubles'),
  'lagterta-hvit.webp': L('Hvít hnoðuð lagterta með rabarbarasultu', 'White kneaded layer cake with rhubarb jam'),
  'jolakaka.webp': L('Ensk ávaxtakaka, skorin í sneiðar', 'English fruit cake, cut into slices'),
  'vanilluhringir.webp': L('Vanilluhringir á bökunarpappír', 'Vanilla rings on baking paper'),
  'mommukokur.webp': L('Mömmukökur á bökunarplötu', 'Mömmukökur on a baking sheet'),
  'lakkristoppar.webp': L('Lakkrístoppar í bökunarformum', 'Liquorice meringues in paper cases'),
  'kokosspesiur.webp': L('Kókosspesíur á bökunarplötu', 'Coconut spesíur on a baking sheet'),
  'sukkuladibitakokur.webp': L('Súkkulaðibitakökur á bökunarplötu', 'Chocolate chip cookies on a baking sheet'),
  'butterdeig.webp': L('Butterdeigsbotnar', 'Puff pastry bases'),
}

const token = JSON.parse(readFileSync(join(homedir(), '.config/sanity/config.json'), 'utf8')).authToken
if (!token) { console.error('No Sanity CLI login. Run `npx sanity login`.'); process.exit(1) }
const auth = { Authorization: `Bearer ${token}` }

const ids = PRODUCTS.map(([slug]) => `christmasProduct-${slug}`)
const q = encodeURIComponent(`{"have": *[_id in ${JSON.stringify(ids)}]._id, "settings": *[_id=="siteSettings"][0]{_id, christmas}}`)
const res = (await (await fetch(`${API}/data/query/${DATASET}?query=${q}`, { headers: auth })).json()).result
const have = new Set(res?.have || [])

console.log('\nChristmas products → Sanity\n')
for (const [slug, , , name, price, file] of PRODUCTS) {
  const id = `christmasProduct-${slug}`
  console.log(`  ${have.has(id) ? 'exists, left alone' : 'create'.padEnd(18)}  ${id.padEnd(40)} ${name.is} · ${price}${file ? ` · photo ${file}` : ''}`)
}
console.log(`\n  siteSettings.christmas: ${res?.settings?.christmas ? 'already set, left alone' : 'set to on (missing)'}`)

if (!WRITE) { console.log('\nDry run. Re-run with --write to apply.\n'); process.exit(0) }

const mutations = []
for (const [slug, group, order, name, price, file] of PRODUCTS) {
  const id = `christmasProduct-${slug}`
  if (have.has(id)) continue
  const doc = { _id: id, _type: 'christmasProduct', group, order, name, price, active: true }
  if (file) {
    const up = await fetch(`${API}/assets/images/${DATASET}?filename=${encodeURIComponent(file)}`, {
      method: 'POST', headers: { ...auth, 'Content-Type': 'image/webp' }, body: readFileSync(join(PUB, file)),
    })
    const asset = (await up.json()).document
    if (!up.ok || !asset?._id) { console.error(`Upload failed for ${file}`); process.exit(1) }
    doc.image = { _type: 'image', asset: { _type: 'reference', _ref: asset._id }, ...(ALTS[file] ? { alt: ALTS[file] } : {}) }
  }
  mutations.push({ createIfNotExists: doc })
}
if (!res?.settings?.christmas) mutations.push({ patch: { id: 'siteSettings', setIfMissing: { christmas: { on: true } } } })
if (!mutations.length) { console.log('\nNothing to do.\n'); process.exit(0) }

const m = await fetch(`${API}/data/mutate/${DATASET}?returnIds=true`, {
  method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify({ mutations }),
})
const out = await m.json()
if (!m.ok || out.error) { console.error('Mutation failed:', JSON.stringify(out)); process.exit(1) }
console.log(`\nDone: ${mutations.length} mutation(s), tx ${out.transactionId}. The publish webhook rebuilds the site.\n`)
