/**
 * Reynir CMS check — run this before handing the studio over, and after any
 * schema or content change.
 *
 *   node tools/reynir-cms-check.mjs
 *
 * Two halves:
 *
 * 1. VALIDATE the live dataset. Every field the site reads, checked for the
 *    things a person editing content actually does wrong: a half-filled
 *    bilingual field (one language blank on the live site), a menu item with
 *    no price, an order option group with no id (which silently stops the
 *    form recording that choice), a gallery entry with no uploaded asset.
 *
 * 2. EXERCISE the merge against deliberately broken payloads. What the site
 *    does with a deleted document, a cleared field, a half-emptied list or a
 *    malformed response is what decides whether an owner can break the page
 *    from the studio. These are the scenarios, not hypotheticals.
 *
 * The merge function is bundled out of the app source with esbuild so this
 * tests the REAL code path the site uses, not a copy of it that can drift.
 */
import { execFileSync } from 'node:child_process'
import { writeFileSync, rmSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const PROJECT = 'v4v3s4wg'
const DATASET = 'production'

/* ── build the real merge() out of the app source ───────────────────────── */
/* Inside the project, not the OS temp dir: the bundle keeps react and the
   sanity packages EXTERNAL, so Node has to be able to resolve them from here. */
const tmp = join(process.cwd(), 'node_modules', '.cache', 'reynir-cms-check')
mkdirSync(tmp, { recursive: true })
const entry = join(tmp, 'entry.ts')
const bundle = join(tmp, 'bundle.mjs')
writeFileSync(entry, `import { merge, QUERY } from ${JSON.stringify(join(process.cwd(), 'src/preview/reynir/sanity.ts'))}
;(globalThis).__merge = merge; (globalThis).__QUERY = QUERY
`)
execFileSync('npx', ['esbuild', entry, '--bundle', '--platform=node', '--format=esm',
  `--outfile=${bundle}`,
  '--loader:.webp=empty', '--loader:.png=empty', '--loader:.jpg=empty',
  '--loader:.jpeg=empty', '--loader:.svg=empty', '--loader:.mp4=empty',
  '--external:@sanity/client', '--external:@sanity/image-url',
  '--external:@sanity/visual-editing', '--external:react',
  '--define:import.meta.env={"BASE_URL":"/","VITE_REYNIR_STANDALONE":"1","MODE":"production","DEV":false,"PROD":true}',
  '--log-level=error'], { stdio: 'inherit' })
await import(pathToFileURL(bundle).href)
const merge = globalThis.__merge
const QUERY = globalThis.__QUERY

/* ── fetch the live dataset ─────────────────────────────────────────────── */
const url = `https://${PROJECT}.api.sanity.io/v2025-08-15/data/query/${DATASET}` +
  `?query=${encodeURIComponent(QUERY)}&returnQuery=false&perspective=published`
const res = await fetch(url, { signal: AbortSignal.timeout(45_000) })
if (!res.ok) { console.error(`CMS fetch failed: HTTP ${res.status}`); process.exit(1) }
const LIVE = (await res.json()).result
const clone = (o) => JSON.parse(JSON.stringify(o))

let problems = 0
const bad = (m) => { problems++; console.log('  PROBLEM  ' + m) }

/* ── 1. validate ────────────────────────────────────────────────────────── */
console.log('\n── live dataset ──')
const loc = (v, path, required = true) => {
  if (v == null || (typeof v === 'object' && !Object.keys(v).length)) {
    if (required) bad(`${path}: missing`)
    return
  }
  const filled = ['is', 'en'].filter((l) => (v?.[l] || '').trim())
  if (filled.length === 1) bad(`${path}: only "${filled[0]}" filled — the other language renders blank`)
  else if (!filled.length && required) bad(`${path}: empty in both languages`)
}

const s = LIVE.settings || {}
for (const f of ['phoneDisplay','phoneHref','email','orderEmail','facebook','instagram','ahaUrl','woltUrl','mainAddress'])
  if (!(s[f] || '').trim()) bad(`settings.${f}: empty`)
loc(s.trustLine, 'settings.trustLine')
for (const day of ['mon','tue','wed','thu','fri','sat','sun']) {
  const h = LIVE.hours?.[day]
  if (!h) { bad(`hours.${day}: missing`); continue }
  if (!h.closed) for (const f of ['open','close']) if (h[f] == null || h[f] === '') bad(`hours.${day}.${f}: empty`)
}
for (const f of ['heroTitle','heroSub','heroLine','heroPhotoCaption']) loc(LIVE.hero?.[f], `hero.${f}`)
for (const f of ['statementQuote','statementWho','storyP1','storyP2']) loc(LIVE.story?.[f], `story.${f}`)

const VALID = new Set(['featured','menu','bread','cakes'])
let featured = 0
for (const m of LIVE.menuItems || []) {
  const nm = m.name || '(unnamed)'
  if (!(m.name || '').trim()) bad('a menuItem has no name — it will not render')
  if (!VALID.has(m.category)) bad(`menuItem "${nm}": category "${m.category}" is not one of ${[...VALID].join('/')}`)
  if (m.category === 'featured') featured++
  if (!(m.price || '').trim()) bad(`menuItem "${nm}": no price`)
  loc(m.tag, `menuItem "${nm}".tag`, false)
  loc(m.desc, `menuItem "${nm}".desc`, false)
}
if (featured !== 1) bad(`${featured} items marked "featured" — the design shows exactly one`)
for (const [i, r] of (LIVE.reviews || []).entries()) {
  loc(r.quote, `review[${i}].quote`)
  if (!(r.who || '').trim()) bad(`review[${i}]: no attribution`)
}
for (const [i, g] of (LIVE.gallery || []).entries()) {
  if (!g.image?.asset) bad(`gallery[${i}]: no uploaded image`)
  loc(g.caption, `gallery[${i}].caption`, false)
}
for (const p of LIVE.orderProducts || []) {
  const nm = p.name?.is || '(unnamed)'
  if (!p.id) bad(`orderProduct "${nm}": no id — the product is dropped from the form`)
  loc(p.name, `orderProduct "${nm}".name`)
  for (const f of ['basePrice','leadDays']) if (p[f] == null) bad(`orderProduct "${nm}".${f}: empty`)
  if (!(p.groups || []).length) bad(`orderProduct "${nm}": no option groups — it is dropped from the form`)
  /* Per-person pricing has one way to go wrong silently: the rate is set but
     the sizes carry no headcount, so every cake computes to 0 kr. and the page
     cheerfully offers free cakes. Catch it here, not in a customer's basket. */
  if (p.pricePerPerson) {
    const sizeId = p.sizeGroupId
    const sizeGroup = (p.groups || []).find((g) => g.id === sizeId)
    if (!sizeId) {
      bad(`orderProduct "${nm}": priced per person but no size group named — every size would cost 0 kr.`)
    } else if (!sizeGroup) {
      bad(`orderProduct "${nm}": size group "${sizeId}" does not exist — every size would cost 0 kr.`)
    } else {
      for (const [ci, c] of (sizeGroup.choices || []).entries()) {
        if (!(typeof c.serves === 'number' && c.serves > 0)) {
          bad(`orderProduct "${nm}" / size choice ${ci} "${c.label?.is || ci}": no headcount — it would price at 0 kr.`)
        }
      }
    }
  } else if (p.sizeGroupId) {
    /* The flat-priced twin of the same failure. A sized product with no
       per-person rate takes its price from `price` on each size choice; a
       choice missing it falls through to a basePrice that these products
       deliberately leave at 0, so the cake is offered free. Half-priced groups
       are the real risk — the owner adds a third size in the studio and does
       not fill the price in — so every choice in the group is required to
       carry one, not just the first. */
    const sizeGroup = (p.groups || []).find((g) => g.id === p.sizeGroupId)
    if (!sizeGroup) {
      bad(`orderProduct "${nm}": size group "${p.sizeGroupId}" does not exist — every size would cost 0 kr.`)
    } else {
      for (const [ci, c] of (sizeGroup.choices || []).entries()) {
        if (!(typeof c.price === 'number' && c.price > 0)) {
          bad(`orderProduct "${nm}" / size choice ${ci} "${c.label?.is || ci}": no price — it would be offered at 0 kr.`)
        }
      }
    }
  }
  for (const g of p.groups || []) {
    const gl = g.label?.is || '(unlabelled)'
    if (!g.id) bad(`orderProduct "${nm}" / group "${gl}": no id — the choice is not recorded on the order`)
    loc(g.label, `orderProduct "${nm}" / group "${gl}".label`)
    for (const [ci, c] of (g.choices || []).entries()) {
      if (!c.id) bad(`orderProduct "${nm}" / "${gl}" / choice ${ci}: no id`)
      loc(c.label, `orderProduct "${nm}" / "${gl}" / choice ${ci}.label`)
      // A surcharge on an option that shows no price is a number nobody sees.
      if (c.quoteOnly && c.priceDelta > 0) {
        bad(`orderProduct "${nm}" / "${gl}" / "${c.label?.is || ci}": quote-only but carries a +${c.priceDelta} kr. surcharge that is never shown`)
      }
      // A field with no question is a blank box the customer cannot answer.
      if (c.freeText && !(c.freeText.label?.is || c.freeText.label?.en)) {
        bad(`orderProduct "${nm}" / "${gl}" / "${c.label?.is || ci}": opens a text field with no question on it`)
      }
      // Asking for a photo without asking what of leaves the baker guessing.
      if (c.needsPhoto && !c.freeText) {
        bad(`orderProduct "${nm}" / "${gl}" / "${c.label?.is || ci}": expects a photo but never asks what it should be of`)
      }
    }
  }
}
for (const key of ['occasions','pickupLocations'])
  for (const [i, o] of (LIVE[key] || []).entries()) {
    if (!o.id) bad(`${key}[${i}]: no id`)
    loc(o.label, `${key}[${i}].label`)
  }
console.log(problems ? `  ${problems} problem(s) above` : '  all fields complete')

/* ── 2. drift between the CMS and the bundled fallback ──────────────────── */
console.log('\n── CMS vs bundled fallback ──')
const cms = merge(LIVE), fb = merge(null)
for (const k of ['MENU','BREAD','CAKES']) {
  const c = cms[k].map((x) => x.name), b = fb[k].map((x) => x.name)
  const onlyCms = c.filter((x) => !b.includes(x)), onlyFb = b.filter((x) => !c.includes(x))
  if (!onlyCms.length && !onlyFb.length) console.log(`  ${k}: identical (${c.length})`)
  else {
    if (onlyCms.length) console.log(`  ${k}: only in CMS — vanishes if Sanity is unreachable: ${onlyCms.join(', ')}`)
    if (onlyFb.length) console.log(`  ${k}: only in code — reappears if the CMS list is emptied: ${onlyFb.join(', ')}`)
  }
}

/* ── 3. scenarios ───────────────────────────────────────────────────────── */
console.log('\n── scenarios ──')
let pass = 0, fail = 0
const check = (name, cond, detail = '') => {
  if (cond) { pass++; console.log(`  ok    ${name}`) }
  else { fail++; console.log(`  FAIL  ${name}${detail ? ' -> ' + detail : ''}`) }
}
const run = (name, fn) => { try { return fn() } catch (e) { fail++; console.log(`  THREW ${name}: ${e.message}`); return null } }

let c = run('unreachable', () => merge(null))
check('Sanity unreachable: page still has a menu', c?.MENU.length > 0)
check('Sanity unreachable: order catalogue survives', c?.ORDER_PRODUCTS.length > 0)

let raw = clone(LIVE)
raw.menuItems = []; raw.reviews = []; raw.gallery = []; raw.orderProducts = []; raw.pickupLocations = []
c = run('all collections emptied', () => merge(raw))
check('every collection emptied: falls back rather than showing nothing',
  c?.MENU.length > 0 && c?.REVIEWS.length > 0 && c?.GALLERY.length > 0 && c?.ORDER_PRODUCTS.length > 0)

raw = clone(LIVE)
const keep = raw.menuItems.filter((m) => m.category === 'bread').slice(0, 3)
raw.menuItems = raw.menuItems.filter((m) => m.category !== 'bread').concat(keep)
c = run('partial delete', () => merge(raw))
check('deleting SOME breads keeps the deletion (does not resurrect them)', c?.BREAD.length === 3, String(c?.BREAD.length))

raw = clone(LIVE); raw.hero.heroTitle.en = ''
c = run('cleared language', () => merge(raw))
check('clearing one language falls back to the bundled text, not blank', !!c?.heroTitle.en)

raw = clone(LIVE); raw.menuItems.push({ category: 'bread', name: '', price: '500 kr.' })
c = run('nameless item', () => merge(raw))
check('a nameless menu item is dropped, not rendered as a blank row', c?.BREAD.length === fbLen(cms.BREAD))
function fbLen(a) { return a.length }

raw = clone(LIVE); raw.orderProducts = raw.orderProducts.map((p) => ({ ...p, groups: [] }))
c = run('order products broken', () => merge(raw))
check('order products stripped of options fall back to the bundled catalogue', c?.ORDER_PRODUCTS.length > 0)

for (const [name, payload] of Object.entries({
  'menuItems as an object': { ...clone(LIVE), menuItems: {} },
  'settings null': { ...clone(LIVE), settings: null },
  'hours null': { ...clone(LIVE), hours: null },
  'everything null': {},
})) {
  c = run(name, () => merge(payload))
  check(`malformed (${name}): survives with a usable page`, c?.MENU.length > 0 && !!c?.LINKS.phone && !!c?.heroTitle.is)
}

raw = clone(LIVE); raw.hours.sun = { closed: true }
c = run('sunday closed', () => merge(raw))
check('marking a day closed is reflected', c?.HOURS_BY_DAY[0].closed === true)

/* Per-person pricing, the way it actually gets broken in a studio: someone
   edits the size list and drops the headcount off a row. The merge must not
   invent one, and the price must not silently become 0 kr. */
raw = clone(LIVE)
{
  const p = (raw.orderProducts || []).find((x) => x.pricePerPerson)
  const g = p && (p.groups || []).find((x) => x.id === p.sizeGroupId)
  if (g) g.choices = g.choices.map((ch) => ({ ...ch, serves: undefined }))
  c = run('per-person edit', () => merge(raw))
  const merged = c?.ORDER_PRODUCTS.find((x) => x.pricePerPerson)
  const sizeGroup = merged && merged.groups.find((x) => x.id === merged.sizeGroupId)
  check('a size stripped of its headcount stays unpriced rather than becoming free',
    !!sizeGroup && sizeGroup.choices.every((ch) => ch.serves === undefined))
}

/* The same edit on a flat-priced product: someone clears the price off a size
   row. It must survive as "no price", never as a free cake.

   Built here rather than read off the live CMS on purpose. This asserts what
   the MERGE does with a flat-priced product, which is a property of the code;
   whether the studio has actually been seeded with one yet is a launch step,
   and tying a code test to it would go red for the wrong reason. */
const flatProduct = (priced) => ({
  id: 'flattest',
  name: { is: 'Prófvara', en: 'Test product' },
  blurb: { is: 'Prófun', en: 'Test' },
  basePrice: 0,
  sizeGroupId: 'staerd',
  leadDays: 2,
  groups: [
    {
      id: 'staerd', kind: 'single', required: true,
      label: { is: 'Stærð', en: 'Size' },
      choices: [
        { id: 's10', label: { is: '10-15 manna', en: 'Serves 10-15' }, priceDelta: 0, ...(priced ? { price: 5500 } : {}) },
        { id: 's20', label: { is: '20-25 manna', en: 'Serves 20-25' }, priceDelta: 0, ...(priced ? { price: 6950 } : {}) },
      ],
    },
  ],
})

raw = clone(LIVE)
{
  raw.orderProducts = [...(raw.orderProducts || []), flatProduct(false)]
  c = run('flat-price edit', () => merge(raw))
  const merged = c?.ORDER_PRODUCTS.find((x) => x.id === 'flattest')
  const sizeGroup = merged && merged.groups.find((x) => x.id === merged.sizeGroupId)
  check('a flat size stripped of its price stays unpriced rather than becoming free',
    !!sizeGroup && sizeGroup.choices.every((ch) => typeof ch.price !== 'number'))
}

raw = clone(LIVE)
{
  raw.orderProducts = [...(raw.orderProducts || []), flatProduct(true)]
  c = run('flat-price merge', () => merge(raw))
  const merged = c?.ORDER_PRODUCTS.find((x) => x.id === 'flattest')
  const g = merged && merged.groups.find((x) => x.id === merged.sizeGroupId)
  const prices = (g?.choices || []).map((ch) => ch.price)
  check('fixed size prices come back through the merge exactly as typed',
    prices.length === 2 && prices[0] === 5500 && prices[1] === 6950)
}

/* The rate itself emptied. Falling back to basePrice is right; pricing every
   size at 0 kr. is not. */
raw = clone(LIVE)
{
  for (const p of raw.orderProducts || []) if (p.pricePerPerson) p.pricePerPerson = 0
  c = run('per-person edit', () => merge(raw))
  check('a per-person rate of 0 is treated as unset, not as free cakes',
    c?.ORDER_PRODUCTS.every((p) => p.pricePerPerson === undefined))
}

/* Quote-only and the field a choice opens have to survive the CMS round trip,
   or a bespoke cake starts quoting the standard rate again. */
c = run('live merge', () => merge(clone(LIVE)))
{
  const all = (c?.ORDER_PRODUCTS || []).flatMap((p) => p.groups).flatMap((g) => g.choices)
  check('quote-only choices survive the merge', all.some((ch) => ch.quoteOnly === true))
  check('the field a choice opens survives the merge', all.some((ch) => !!ch.freeText?.label?.is))
  check('ingredients a choice adds survive the merge', all.some((ch) => !!ch.adds?.length))
  check('a layer swap survives the merge', all.some((ch) => !!ch.swap?.layerId))
}

/* A swap pointing at a layer that no longer exists replaces nothing and the
   customer is quietly shown the wrong recipe. Catch the dangling reference. */
for (const p of (LIVE.orderProducts || [])) {
  const ids = new Set((p.composition || []).map((l) => l.id))
  for (const g of p.groups || [])
    for (const c of g.choices || [])
      if (c.swap?.layerId && !ids.has(c.swap.layerId))
        bad(`orderProduct "${p.name?.is}" / "${c.label?.is}": swaps out layer "${c.swap.layerId}", which is not in the recipe`)
}
check('no choice swaps out a layer that does not exist', problems === 0, `${problems} problem(s)`)

rmSync(tmp, { recursive: true, force: true })
console.log(`\n${pass} scenario check(s) passed, ${fail} failed, ${problems} content problem(s)\n`)
process.exit(fail || problems ? 1 : 0)
