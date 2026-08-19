/* Pull every guest-visible string off a live preview, in document order.
 *
 * Regexing the .tsx for quoted strings (what the first handoff did) drags code
 * fragments into the copy file — `, superhost: true, yearsHosting: 5` and
 * half-sentences split across two JSX nodes. Reading the rendered DOM gives the
 * real sentence, assembled, once.
 *
 * usage: node scripts/extract-copy.mjs <slug> [outDir]
 */
import puppeteer from 'puppeteer-core'
import fs from 'node:fs'
import path from 'node:path'

const slug = process.argv[2]
const outDir = process.argv[3] || '.'
if (!slug) { console.error('usage: extract-copy.mjs <slug> [outDir]'); process.exit(1) }
const BASE = `https://sindrimar02.github.io/iceland-frumgerdir/preview/${slug}`

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new', args: ['--no-sandbox'],
})

/** Walk the DOM once, emitting each element that owns direct text. */
const HARVEST = () => {
  const out = []
  const seen = new Set()
  const label = (el) => {
    const cls = (el.className || '').toString().split(' ').filter(Boolean)[0]
    return cls ? `${el.tagName.toLowerCase()}.${cls}` : el.tagName.toLowerCase()
  }
  const hidden = (el) => {
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const cs = getComputedStyle(n)
      if (cs.display === 'none' || cs.visibility === 'hidden') return true
    }
    return false
  }
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT)
  for (let el = walker.currentNode; el; el = walker.nextNode()) {
    if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) continue
    // Only direct text children, so a wrapper doesn't repeat its subtree.
    const own = Array.from(el.childNodes)
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .join(' ')
    if (own && !seen.has(label(el) + own)) {
      seen.add(label(el) + own)
      out.push({ kind: hidden(el) ? 'TEXT (hidden at this breakpoint)' : 'TEXT', where: label(el), value: own })
    }
    /* A sentence with an inline <a> inside it splits across nodes, so the
       fragments above read as broken English. Emit the assembled sentence too
       for the elements that actually hold prose. */
    if (['P', 'LI', 'H1', 'H2', 'H3', 'H4', 'BLOCKQUOTE', 'FIGCAPTION', 'BUTTON', 'LABEL', 'CITE'].includes(el.tagName)) {
      const full = (el.innerText || '').replace(/\s+/g, ' ').trim()
      if (full && full !== own && !seen.has('full' + full)) {
        seen.add('full' + full)
        out.push({ kind: 'TEXT (assembled)', where: label(el), value: full })
      }
    }
    if (el.tagName === 'IMG' && el.alt) out.push({ kind: 'ALT', where: el.getAttribute('src').split('/').pop(), value: el.alt })
    for (const a of ['aria-label', 'placeholder', 'title', 'value', 'alt']) {
      if (el.tagName === 'IMG' && a === 'alt') continue
      const v = el.getAttribute?.(a)
      if (v && v.trim() && !seen.has(a + v)) { seen.add(a + v); out.push({ kind: a.toUpperCase(), where: label(el), value: v.trim() }) }
    }
  }
  return out
}

const render = (rows) => rows.map((r) => `[${r.kind}] ${r.where}\n    ${r.value}`).join('\n\n')

const grab = async (url, opts = {}) => {
  const page = await browser.newPage()
  await page.setViewport({ width: opts.width || 1440, height: 900 })
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 })
  await page.evaluate(() => document.fonts.ready)
  await new Promise((r) => setTimeout(r, 3000))
  // Arm every reveal so nothing is missing from the harvest.
  await page.evaluate(() => document.querySelectorAll('[class*="-rv"], [class*="reveal"], [class*="-shot"]').forEach((e) => e.classList.add('is-in')))
  if (opts.before) await opts.before(page)
  const meta = await page.evaluate(() => ({
    title: document.title,
    desc: document.querySelector('meta[name="description"]')?.content || '(none)',
    robots: document.querySelector('meta[name="robots"]')?.content || '(none)',
    jsonld: Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((s) => s.textContent),
  }))
  const rows = await page.evaluate(HARVEST)
  await page.close()
  return { meta, rows }
}

// ── public page ────────────────────────────────────────────────────────────
const pub = await grab(BASE)
// ── public page, booking form submitted (success + error copy) ─────────────
const sent = await grab(BASE, {
  before: async (page) => {
    await page.evaluate(() => {
      const form = document.querySelector('form')
      if (!form) return
      form.querySelectorAll('input, textarea').forEach((i) => {
        if (i.type === 'date') i.value = '2026-09-14'
        else if (i.type === 'email') i.value = 'test@example.com'
        else if (i.type !== 'submit' && i.type !== 'button') i.value = 'Test'
        i.dispatchEvent(new Event('input', { bubbles: true }))
        i.dispatchEvent(new Event('change', { bubbles: true }))
      })
      form.requestSubmit ? form.requestSubmit() : form.querySelector('[type=submit]')?.click()
    })
    await new Promise((r) => setTimeout(r, 1500))
  },
})
// ── owner dashboard: empty state, then with the request just made ──────────
const dashEmpty = await grab(`${BASE}/stjornbord`, {
  before: async (page) => { await page.evaluate(() => localStorage.clear()); await page.reload({ waitUntil: 'domcontentloaded' }); await new Promise((r) => setTimeout(r, 2500)) },
})

/* Fabricating a localStorage row guesses at the Booking shape. Driving the real
   guest form and then navigating in the SAME page keeps the origin (and so the
   store) intact, and guarantees the row is one the dashboard can actually
   render. Clicking the first row action then exposes the confirmed-state copy. */
const dashFull = await (async () => {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 90000 })
  await new Promise((r) => setTimeout(r, 2500))
  /* React tracks input values on the node, so assigning `.value` leaves state
     stale and the form submits empty. Go through the prototype setter React's
     tracker actually observes, then fire input. */
  await page.evaluate(() => {
    const setNative = (el, val) => {
      const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype
        : el instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype
      Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, val)
      el.dispatchEvent(new Event('input', { bubbles: true }))
      el.dispatchEvent(new Event('change', { bubbles: true }))
    }
    const form = document.querySelector('form')
    form.querySelectorAll('input, textarea, select').forEach((i) => {
      if (i.type === 'date') setNative(i, '2026-09-14')
      else if (i.type === 'email') setNative(i, 'gestur@example.com')
      else if (i.type === 'number') setNative(i, '2')
      else if (i.tagName === 'SELECT') setNative(i, i.options[i.options.length - 1]?.value ?? '')
      else if (!['submit', 'button', 'checkbox', 'radio'].includes(i.type)) setNative(i, 'Test Guest')
    })
  })
  await new Promise((r) => setTimeout(r, 400))
  await page.evaluate(() => {
    const form = document.querySelector('form')
    const btn = form.querySelector('[type=submit]') || Array.from(form.querySelectorAll('button')).pop()
    btn ? btn.click() : form.requestSubmit()
  })
  await new Promise((r) => setTimeout(r, 2000))
  const rowCount = await page.evaluate(() => JSON.parse(localStorage.getItem('mirrorhouse_demo_bookings_v1') || '[]').length)
  console.log(`  seeded ${rowCount} booking row(s) via the real guest form`)
  await page.goto(`${BASE}/stjornbord`, { waitUntil: 'domcontentloaded', timeout: 90000 })
  await new Promise((r) => setTimeout(r, 2500))
  const withRow = await page.evaluate(HARVEST)
  // confirmed / declined state copy
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button')).find((x) => !x.className.includes('mhd-tab'))
    b?.click()
  })
  await new Promise((r) => setTimeout(r, 1200))
  const afterAction = await page.evaluate(HARVEST)
  await page.close()
  return { meta: {}, rows: withRow, afterAction }
})()

fs.mkdirSync(outDir, { recursive: true })
const head = (t) => `${'='.repeat(74)}\n${t}\n${'='.repeat(74)}\n`

fs.writeFileSync(path.join(outDir, 'page-copy.txt'),
  `MIRROR HOUSE — every guest-visible string on the public page\n` +
  `Extracted from the rendered DOM at ${BASE}\n\n` +
  head('PAGE META / SEO') +
  `<title>\n    ${pub.meta.title}\n\nmeta description\n    ${pub.meta.desc}\n\nmeta robots\n    ${pub.meta.robots}\n\n` +
  head('PAGE COPY, IN DOCUMENT ORDER') + render(pub.rows) + '\n\n' +
  head('AFTER THE BOOKING FORM IS SUBMITTED (success / confirmation copy)') +
  render(sent.rows.filter((r) => !pub.rows.some((p) => p.value === r.value))) + '\n')

fs.writeFileSync(path.join(outDir, 'dashboard-copy.txt'),
  `MIRROR HOUSE — owner dashboard demo (${BASE}/stjornbord)\n\n` +
  head('EMPTY STATE (no requests yet)') + render(dashEmpty.rows) + '\n\n' +
  head('WITH ONE REQUEST PRESENT') +
  render(dashFull.rows.filter((r) => !dashEmpty.rows.some((p) => p.value === r.value))) + '\n\n' +
  head('AFTER THE OWNER ACTS ON A REQUEST (confirm / decline state)') +
  render(dashFull.afterAction.filter((r) => !dashFull.rows.some((p) => p.value === r.value))) + '\n')

fs.writeFileSync(path.join(outDir, 'seo-jsonld.json'), pub.meta.jsonld.join('\n\n') || '(none found)')

console.log(`page-copy.txt      ${pub.rows.length} strings (+${sent.rows.filter((r) => !pub.rows.some((p) => p.value === r.value)).length} post-submit)`)
console.log(`dashboard-copy.txt ${dashEmpty.rows.length} empty-state, +${dashFull.rows.filter((r) => !dashEmpty.rows.some((p) => p.value === r.value)).length} with a request`)
await browser.close()
