import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/sl-flow' })
const errs = []
const p = await b.newPage()
p.on('pageerror', e => errs.push('page: ' + e.message))
p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0,140)) })
await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await p.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1')
await p.evaluateOnNewDocument(() => { sessionStorage.setItem('sl_seen','1'); localStorage.removeItem('svartlodge_demo_bookings_v1') })
await p.goto('http://localhost:5299/preview/svartlodge', { waitUntil: 'domcontentloaded' })
await new Promise(r => setTimeout(r, 2200))
await p.evaluate(() => document.querySelector('#boka')?.scrollIntoView())
const day = (n) => p.evaluate((n) => { const l = [...document.querySelectorAll('.sl-day')].filter(d => !d.disabled && !d.classList.contains('sl-day--out')); l[n]?.click() }, n)
const note = () => p.evaluate(() => document.querySelector('.sl-stay-note')?.textContent.trim())
const out = {}

// 1. min stay refusal: two adjacent days
await day(2); await new Promise(r => setTimeout(r, 260)); await day(3); await new Promise(r => setTimeout(r, 300))
out.minStay = await note()
// 2. valid range
await day(2); await new Promise(r => setTimeout(r, 260)); await day(6); await new Promise(r => setTimeout(r, 300))
out.valid = await note()
// 3. submit without name
await p.evaluate(() => document.querySelector('.sl-cta').click())
await new Promise(r => setTimeout(r, 300))
out.errNoName = await p.evaluate(() => document.querySelector('.sl-field-error')?.textContent.trim())
// 4. fill and submit
await p.evaluate(() => {
  const set = (sel, v) => { const el = document.querySelector(sel); const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; s.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })) }
  set('input[name=name]', 'Anna Jonsdottir'); set('input[name=email]', 'anna@example.is')
})
await new Promise(r => setTimeout(r, 200))
await p.evaluate(() => document.querySelector('.sl-cta').click())
await new Promise(r => setTimeout(r, 500))
out.done = await p.evaluate(() => ({ title: document.querySelector('.sl-book-done-title')?.textContent.trim(), dates: document.querySelector('.sl-book-done-dates')?.textContent.trim() }))
out.stored = await p.evaluate(() => JSON.parse(localStorage.getItem('svartlodge_demo_bookings_v1') || '[]').map(b => ({ date: b.date, end: b.endDate, people: b.people, units: b.quote?.units, status: b.status })))
await p.screenshot({ path: 'scripts/svartlodge-shots/stay-m-done.png' })

// 5. confirm it in the dashboard, then the nights should read as taken on the site
const d = await p.browser().newPage()
await d.setViewport({ width: 1200, height: 900 })
await d.goto('http://localhost:5299/preview/svartlodge/stjornbord', { waitUntil: 'domcontentloaded' })
await new Promise(r => setTimeout(r, 1500))
out.confirmed = await d.evaluate(() => {
  const rows = JSON.parse(localStorage.getItem('svartlodge_demo_bookings_v1') || '[]')
  rows[0].status = 'CONFIRMED'
  localStorage.setItem('svartlodge_demo_bookings_v1', JSON.stringify(rows))
  try { new BroadcastChannel('svartlodge_demo').postMessage({ t: Date.now() }) } catch {}
  return rows[0].date
})
await new Promise(r => setTimeout(r, 800))
await p.evaluate(() => document.querySelector('.sl-ghost')?.click())
await new Promise(r => setTimeout(r, 600))
out.takenAfterConfirm = await p.evaluate(() => [...document.querySelectorAll('.sl-day--taken')].map(e => e.getAttribute('aria-label')))
await p.screenshot({ path: 'scripts/svartlodge-shots/stay-m-taken.png' })
out.errors = errs
console.log(JSON.stringify(out, null, 1))
await b.close()
