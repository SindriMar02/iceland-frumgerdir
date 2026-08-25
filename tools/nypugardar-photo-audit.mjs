/**
 * Nýpugarðar — photo audit. Does any picture appear on the page twice?
 *
 *   node tools/nypugardar-photo-audit.mjs [url]
 *   default: http://localhost:5299/preview/nypugardar
 *
 * WHY THIS EXISTS. On 2026-08-25 Sindri spotted a repeated image. The audit
 * said 19 of her 43 photographs were rendering twice: the hero also sat in the
 * gallery's land row, every room-list thumbnail reappeared as the first tile of
 * its own gallery row, and two photos Booking files under two room types each
 * showed up in both. None of it was visible from any single screen — you only
 * see it by counting the whole page at once, which is what this does.
 *
 * The rule it enforces: SHE HAS 43 PHOTOGRAPHS AND THE PAGE HAS ROOM FOR 43,
 * so a repeat is never filling a gap — it just reads as though she ran out of
 * pictures. Run this after touching photos.ts, the IMG map in data.ts, or any
 * gallery grouping.
 *
 * Exits non-zero on a repeat so it can gate a deploy.
 */

import puppeteer from 'puppeteer-core'

const URL = process.argv[2] || 'http://localhost:5299/preview/nypugardar'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox'],
  protocolTimeout: 600000,
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 1000 })
await page.goto(URL, { waitUntil: 'networkidle2', timeout: 120000 })

/* Walk the whole page so every lazy tile is in the DOM with its srcset set.
   The ids are read off the markup, not off currentSrc, so a photo counts once
   whatever width the browser happened to pick at this viewport. */
const height = await page.evaluate(() => document.documentElement.scrollHeight)
for (let y = 0; y < height; y += 600) {
  await page.evaluate((v) => window.scrollTo(0, v), y)
  await new Promise((r) => setTimeout(r, 80))
}

const rows = await page.evaluate(() => {
  const idOf = (el) => {
    const m = (el.getAttribute('srcset') || el.getAttribute('src') || '').match(/photos\/(\d+)-/)
    return m ? m[1] : null
  }
  const placeOf = (el) => {
    let n = el
    while (n && n !== document.body) {
      if (n.id) return '#' + n.id
      if (n.tagName === 'HEADER') return 'hero'
      if (n.tagName === 'SECTION') {
        const h = n.querySelector('h2, h3')
        return 'section: ' + (h ? h.innerText.replace(/\s+/g, ' ').slice(0, 30) : '(untitled)')
      }
      n = n.parentElement
    }
    return '?'
  }
  const labelOf = (el) => {
    const gal = document.querySelector('#gallery')
    if (!gal || !gal.contains(el)) return ''
    let best = ''
    for (const l of gal.querySelectorAll('p.font-mono, h3.font-mono')) {
      if (l.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) {
        best = l.innerText.replace(/\s+/g, ' ').trim()
      }
    }
    return best
  }
  return [...document.querySelectorAll('img')]
    .map((el) => ({ id: idOf(el), where: placeOf(el), group: labelOf(el) }))
    .filter((r) => r.id)
})

await browser.close()

const seen = new Map()
for (const r of rows) {
  if (!seen.has(r.id)) seen.set(r.id, [])
  seen.get(r.id).push(r.group ? `${r.where} / ${r.group}` : r.where)
}
const repeats = [...seen.entries()].filter(([, v]) => v.length > 1)

console.log(`[nypugardar-photo-audit] ${URL}`)
console.log(`  image renders   ${rows.length}`)
console.log(`  distinct photos ${seen.size}`)
console.log(`  repeated        ${repeats.length}`)

if (repeats.length) {
  console.log('')
  for (const [id, where] of repeats.sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${id} ×${where.length}`)
    where.forEach((w) => console.log(`      ${w}`))
  }
  console.log('\nA photograph is on the page more than once. See the rule at the top of photos.ts.')
  process.exit(1)
}

console.log('\n  every photograph appears exactly once ✓')
