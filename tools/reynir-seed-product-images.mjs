/**
 * Reynir bakarí — attach the order-card photos to the product documents in Sanity.
 *
 * The site falls back to the bundled `public/reynir/order/*.webp` when a
 * product has no CMS image (sanity.ts), so the page looks right either way.
 * The studio does not: without this the owner opens Marsipanterta and sees an
 * empty photo field, and cannot tell which picture is live. After this runs,
 * what the studio shows is what the site shows.
 *
 *   node tools/reynir-seed-product-images.mjs            # show what would change
 *   node tools/reynir-seed-product-images.mjs --write    # apply it
 *   node tools/reynir-seed-product-images.mjs --write --replace   # also overwrite existing photos
 *
 * Safe by default: a product that already has a photo (the owner may have set
 * one) is skipped unless --replace, a product with an open draft is skipped
 * (patching the published doc would silently fork it from his draft), and each
 * patch is conditional on the revision just read. Sanity de-duplicates uploads
 * by hash, so re-running reuses the same asset.
 *
 * Source frames: `_reference/reynir-photos-2026-08/working/` 091, 020, 082, 089
 * (see `_docs/reynir-photo-map.md` §10). Auth: the Sanity CLI login.
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { homedir } from 'node:os'
import { fileURLToPath } from 'node:url'

const PROJECT = 'v4v3s4wg'
const DATASET = 'production'
const API = `https://${PROJECT}.api.sanity.io/v2025-08-15`
const WRITE = process.argv.includes('--write')
const REPLACE = process.argv.includes('--replace')
const PUB = join(dirname(fileURLToPath(import.meta.url)), '../public/reynir/order')

const PHOTOS = [
  { docId: 'orderProduct-marsipanterta', file: 'marsipanterta.webp' },
  { docId: 'orderProduct-kransakaka', file: 'kransakaka.webp' },
  { docId: 'orderProduct-ricecrispies', file: 'ricecrispies.webp' },
  { docId: 'orderProduct-barnaterta', file: 'barnaterta.webp' },
]

const token = JSON.parse(readFileSync(join(homedir(), '.config/sanity/config.json'), 'utf8')).authToken
if (!token) { console.error('No Sanity CLI login. Run `npx sanity login`.'); process.exit(1) }
const auth = { Authorization: `Bearer ${token}` }

const ids = PHOTOS.flatMap((p) => [p.docId, `drafts.${p.docId}`])
const q = encodeURIComponent(`*[_id in ${JSON.stringify(ids)}]{_id,_rev,"n":name.is,"img":image.asset._ref}`)
const docs = (await (await fetch(`${API}/data/query/${DATASET}?query=${q}`, { headers: auth })).json()).result || []

const plan = []
console.log('\nOrder-card photos → Sanity\n')
for (const p of PHOTOS) {
  const pub = docs.find((d) => d._id === p.docId)
  const draft = docs.find((d) => d._id === `drafts.${p.docId}`)
  let action = 'attach'
  if (!pub) action = 'SKIP (no published doc)'
  else if (draft) action = 'SKIP (open draft, publish or discard it first)'
  else if (pub.img && !REPLACE) action = `SKIP (already has ${pub.img})`
  console.log(`  ${action.padEnd(48)} ${p.docId.padEnd(28)} ← ${p.file}`)
  if (action === 'attach') plan.push({ ...p, rev: pub._rev })
}

if (!WRITE) { console.log('\nDry run. Re-run with --write to apply.\n'); process.exit(0) }
if (!plan.length) { console.log('\nNothing to do.\n'); process.exit(0) }

for (const p of plan) {
  const up = await fetch(`${API}/assets/images/${DATASET}?filename=${encodeURIComponent(p.file)}`, {
    method: 'POST',
    headers: { ...auth, 'Content-Type': 'image/webp' },
    body: readFileSync(join(PUB, p.file)),
  })
  const asset = (await up.json()).document
  if (!up.ok || !asset?._id) { console.error(`Upload failed for ${p.file}`); process.exit(1) }
  const mres = await fetch(`${API}/data/mutate/${DATASET}?returnIds=true`, {
    method: 'POST',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutations: [{ patch: { id: p.docId, ifRevisionID: p.rev, set: { image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } } } } }] }),
  })
  const out = await mres.json()
  if (!mres.ok || out.error) { console.error(`Patch failed for ${p.docId}:`, JSON.stringify(out)); process.exit(1) }
  console.log(`  attached ${asset._id} → ${p.docId} (tx ${out.transactionId})`)
}
console.log(`\nDone: ${plan.length} product photo(s).\n`)
