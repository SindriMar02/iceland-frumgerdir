/**
 * Nýpugarðar — guest-review harvest from her Booking.com listing.
 *
 *   node tools/nypugardar-reviews.mjs out.json [pages]
 *
 * Writes the raw pool; the twenty-four that ship are curated by hand out of it
 * into QUOTES in src/preview/nypugardar/data.ts. Nothing here writes into the
 * site directly, on purpose: which reviews a business puts on its own homepage
 * is a judgement call, not something a script should make.
 *
 * THREE THINGS THIS GETS RIGHT THAT THE OBVIOUS VERSION DOES NOT:
 *
 *   1. HEADLESS CHROME'S DEFAULT UA GETS AN EMPTY LIST. Booking answers the
 *      review query with "there are no reviews that match your filters" —
 *      not an error, not a captcha, just nothing. Send a real UA and an
 *      accept-language header and the same code returns everything.
 *
 *   2. CLICKING "READ ALL REVIEWS" TWICE TOGGLES A FILTER. The retry loop that
 *      seems obviously safe is what empties the list. Click it once, then wait.
 *
 *   3. TEXT IS TAKEN WITH ITS LINE BREAKS INTACT. Plenty of these reviews are
 *      written as stacked short lines rather than sentences. Collapsing the
 *      whitespace and pasting full stops back in — which an earlier pass did —
 *      is rewriting a guest's words. `pos` keeps the newlines and the page
 *      renders them.
 *
 * Each card also carries the room type the guest actually booked
 * (`review-room-name`), which lines up with the room ids in godo.ts if a
 * per-room review ever becomes useful.
 *
 * Do NOT run this on a schedule. It pages through a competitor-sensitive
 * surface at ~1.6s per page; harvesting once when the quotes are refreshed is
 * the intended use.
 */
import puppeteer from 'puppeteer-core'
import { writeFileSync } from 'node:fs'

const OUT = process.argv[2]
const PAGES = Number(process.argv[3] || 25)

const b = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new', args: ['--no-sandbox'], protocolTimeout: 600000,
})
const p = await b.newPage()
await p.setViewport({ width: 1280, height: 1000 })
/* Headless Chrome's default UA and missing Accept-Language make Booking serve
 * an empty review list ("no reviews match your filters"). Look like the real
 * browser that works. */
await p.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36')
await p.setExtraHTTPHeaders({ 'accept-language': 'en-GB,en;q=0.9' })
await p.goto('https://www.booking.com/hotel/is/gistiheimilid-nypugordum.en-gb.html', { waitUntil: 'networkidle2', timeout: 90000 })

// Booking sometimes opens on a consent or sign-in overlay; both swallow clicks.
// Clicking consent can navigate, so re-settle before touching anything else.
async function settle() {
  try {
    await p.evaluate(() => {
      document.querySelector('#onetrust-reject-all-handler')?.click()
      document.querySelector('[aria-label="Dismiss sign-in info."]')?.click()
    })
  } catch { /* the click navigated; fine */ }
  await new Promise(r => setTimeout(r, 3000))
}
await settle()

async function openModal() {
  /* Click the opener ONCE. Clicking it again while the modal is up toggles a
   * filter and the list comes back "no reviews match your filters". */
  await p.evaluate(() => {
    document.querySelector('#blockdisplay4')?.scrollIntoView()
    const btn = document.querySelector('[data-testid="fr-read-all-reviews"]')
      || document.querySelector('[data-testid="review-score-read-all-actionable"]')
    btn?.click()
  }).catch(() => {})
  await new Promise(r => setTimeout(r, 4000))

  for (let attempt = 0; attempt < 5; attempt++) {
    const state = await p.evaluate(() => {
      if (document.querySelector('[data-testid="review-card"]')) return 'cards'
      const show = [...document.querySelectorAll('a,button')].find(e => /show all reviews/i.test(e.textContent || ''))
      if (show) { show.click(); return 'clicked show-all' }
      return 'waiting'
    }).catch(e => 'threw')
    console.log('  modal state:', state)
    if (state === 'cards') return true
    await new Promise(r => setTimeout(r, 3000))
  }
  return false
}

// Cookie banner: decline the non-essential ones, then open the list.
try {
  await p.evaluate(() => {
    const d = [...document.querySelectorAll('button')].find(b => /^decline$/i.test((b.textContent || '').trim()))
    d?.click()
  })
} catch {}
await new Promise(r => setTimeout(r, 1500))

if (!await openModal()) {
  console.log('could not open the reviews modal; page title:', await p.title())
  await p.screenshot({ path: '/tmp/booking-debug.png' })
  await b.close(); process.exit(1)
}
await new Promise(r => setTimeout(r, 2500))

const grab = () => p.evaluate(() => [...document.querySelectorAll('[data-testid="review-card"]')].map(c => {
  const clean = s => (s || '').replace(/\s+/g, ' ').trim()
  /* Keep the author's own line breaks. Collapsing them and pasting full stops
   * back in is rewriting somebody's review, which is not ours to do. */
  const raw = s => (s || '').replace(/\r/g, '').split('\n').map(l => l.trim()).filter(Boolean).join('\n')
  const g = t => clean(c.querySelector(`[data-testid="${t}"]`)?.textContent)
  const gRaw = t => raw(c.querySelector(`[data-testid="${t}"]`)?.innerText)
  const av = c.querySelector('[data-testid="review-avatar"]')
  /* Name is the DIV, country the SPAN. Taking "the first two text leaves"
   * silently promotes the next field into `country` when a reviewer has no
   * country on their profile. */
  const name = clean(av?.querySelector('div[class*="b08850ce41"]')?.textContent)
    || clean([...(av?.querySelectorAll('div') || [])].find(e => e.children.length === 0)?.textContent)
  const country = clean(av?.querySelector('span')?.textContent)
  return {
    name, country,
    room: g('review-room-name'), stay: g('review-stay-date'), type: g('review-traveler-type'),
    date: g('review-date').replace(/^Reviewed:\s*/, ''),
    title: g('review-title'),
    score: Number((g('review-score').match(/Scored\s+([\d.]+)/) || [])[1]) || null,
    pos: gRaw('review-positive-text'),
    neg: gRaw('review-negative-text'),
    translated: /translated/i.test(c.innerText),
  }
}))

const all = []
for (let i = 0; i < PAGES; i++) {
  all.push(...await grab())
  const moved = await p.evaluate(() => {
    const n = [...document.querySelectorAll('button')].find(b => (b.getAttribute('aria-label') || '') === 'Next page')
    if (!n || n.disabled) return false
    n.click(); return true
  })
  if (!moved) { console.log(`  no next page after ${i + 1}`); break }
  await new Promise(r => setTimeout(r, 1600))
  if ((i + 1) % 5 === 0) console.log(`  page ${i + 1}, ${all.length} reviews`)
}

const seen = new Set()
const uniq = all.filter(x => { const k = x.name + '|' + x.date + '|' + x.title; if (seen.has(k)) return false; seen.add(k); return true })
writeFileSync(OUT, JSON.stringify(uniq, null, 1))
console.log(`\n${all.length} scraped, ${uniq.length} unique → ${OUT}`)
console.log('score 10:', uniq.filter(x => x.score === 10).length, '| translated:', uniq.filter(x => x.translated).length, '| named country:', uniq.filter(x => x.country).length)
await b.close()
