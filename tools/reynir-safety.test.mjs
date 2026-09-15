import {test} from 'node:test'
import assert from 'node:assert/strict'
import {fileURLToPath} from 'node:url'
import {build} from 'esbuild'
import {mkdirSync} from 'node:fs'
mkdirSync(new URL('../node_modules/.cache/reynir-safety/', import.meta.url), {recursive: true})
const out = new URL('../node_modules/.cache/reynir-safety/source.mjs', import.meta.url)
await build({stdin: {contents: `export * from './src/preview/reynir/order'; export * from './src/preview/reynir/availability'; export {merge} from './src/preview/reynir/sanity';`, resolveDir: fileURLToPath(new URL('..', import.meta.url)), loader: 'ts'}, outfile: fileURLToPath(out), bundle: true, packages: 'external', platform: 'node', format: 'esm', define: {'import.meta.env': '{"BASE_URL":"/"}'}, logLevel: 'silent'})
const m = await import(out.href)
test('all four approved catalogue products remain orderable', () => m.ORDER_PRODUCTS.forEach(p => assert.equal(m.isProductOrderable(p), true, p.id)))
test('missing size prices and zero per-person rates are rejected', () => {
  const p = structuredClone(m.ORDER_PRODUCTS.find(p => p.id === 'barnaterta'))
  const size = p.groups.find(g => g.id === p.sizeGroupId)
  delete size.choices[0].price
  assert.equal(m.isProductOrderable(p), false)
  assert.equal(m.choicePriceOf(p, size.choices[0]), null)
  assert.equal(m.isProductOrderable({...m.ORDER_PRODUCTS[0], pricePerPerson: 0}), false)
})
test('empty CMS collections stay empty; address changes are used', () => {
  const result = m.merge({settings: {mainAddress: 'New address'}, orderProducts: [], menuItems: [], reviews: [], gallery: [], occasions: [], pickupLocations: []})
  for (const field of ['ORDER_PRODUCTS', 'MENU', 'BREAD', 'CAKES', 'REVIEWS', 'GALLERY', 'OCCASIONS', 'PICKUP_LOCATIONS']) assert.deepEqual(result[field], [], field)
  assert.equal(result.mainName, 'New address')
})
test('ordinary fixed-price products need no option groups', () => {
  const result = m.merge({orderProducts: [{id: 'tray', name: {is: 'Bakki', en: 'Tray'}, basePrice: 1200, leadDays: 2, groups: []}]})
  assert.equal(result.ORDER_PRODUCTS.length, 1)
})
const weekly = Array.from({length: 7}, () => ({open: 420, close: 1020}))
test('48 hours, strictest basket notice and holidays constrain slots', () => {
  const now = Date.parse('2026-09-15T16:00:00Z')
  const minimum = m.noticeAt([{leadDays: 1}, {leadDays: 2}], now)
  assert.deepEqual(m.pickupSlots('2026-09-17', weekly, [], minimum), ['16:00', '16:30'])
  assert.deepEqual(m.pickupSlots('2026-09-17', weekly, [{date: '2026-09-17', closed: true, open: 0, close: 0}], minimum), [])
  assert.deepEqual(m.pickupSlots('2026-09-18', weekly, [{date: '2026-09-18', open: 600, close: 660}], minimum), ['10:00', '10:30'])
})
test('calendar-day mode is explicit; malformed dates and hours yield no slots', () => {
  const now = Date.parse('2026-09-15T16:00:00Z')
  assert.equal(m.bakeryDate(m.noticeAt([{leadDays: 2, noticeMode: 'calendarDays'}], now)), '2026-09-17')
  assert.equal(m.pickupSlots('2026-09-17', weekly, [], m.noticeAt([{leadDays: 2, noticeMode: 'calendarDays'}], now))[0], '07:00')
  assert.deepEqual(m.pickupSlots('2026-02-30', weekly, [], now), [])
  assert.deepEqual(m.pickupSlots('2026-09-18', weekly, [{date: '2026-09-18', open: 6039, close: 60}], now), [])
})
test('unapproved promotions are disabled and extra prices follow the menu', () => {
  const content = m.merge({menuItems: [{name: 'Kleina', category: 'menu', price: '450 kr.'}]})
  assert.equal(content.VEISLUKJOR.discountPct, 0)
  const extra = content.ORDER_EXTRAS.find(e => e.id === 'kleinur')
  assert.equal(extra.unitPrice, 450)
  assert.equal(m.extraUnitPrice(extra, 100, false), 450)
})
test('approved CMS offer, extras, images, pause and text controls are consumed', () => {
  const content = m.merge({settings: {
    ordersPaused: true, textOverrides: [{key: 'page:storyPageTitle', text: {is: 'Ný saga', en: 'New story'}}],
    images: [{slot: 'hero', image: {asset: {_ref: 'image-abc-800x600-jpg'}}, caption: {is: 'Mynd', en: 'Photo'}}],
    partyOffer: {enabled: true, threshold: 60000, discountPct: 4},
    orderExtras: [{id: 'tray', menuItem: {name: 'Bakki', price: '1.250 kr.'}, step: 1, max: 5, kjorPrice: 1100, bulkAt: 3}],
  }})
  assert.equal(content.ordersPaused, true)
  assert.equal(content.textOverrides['page:storyPageTitle'].is, 'Ný saga')
  assert.match(content.images.hero.src, /cdn.sanity.io/)
  assert.equal(content.VEISLUKJOR.discountPct, 4)
  assert.equal(content.ORDER_EXTRAS[0].unitPrice, 1250)
  assert.equal(m.extraUnitPrice(content.ORDER_EXTRAS[0], 3, false), 1100)
})
test('malformed published weekly hours close that day safely', () => {
  const content = m.merge({hours: {sun: {open: '99:99', close: '01:00'}}})
  assert.equal(content.HOURS_BY_DAY[0].closed, true)
})
