import { chromium } from 'playwright'
const [,, route = '', w = '1440', tag = 'home'] = process.argv
const W = +w, H = W < 800 ? 844 : 900
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1, hasTouch: W < 800, isMobile: W < 800 })
const errs = []
p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) })
await p.goto(`http://localhost:5199/preview/bjarkalundur${route}`, { waitUntil: 'networkidle' })
await p.waitForTimeout(1800)
const total = await p.evaluate(() => document.documentElement.scrollHeight)
let i = 0
for (let y = 0; y < total; y += Math.round(H * 0.9)) {
  await p.mouse.wheel(0, 0)
  await p.evaluate(y => window.scrollTo(0, y), y)
  await p.waitForTimeout(700)
  await p.screenshot({ path: `${process.env.OUT}/${tag}-${W}-${String(i++).padStart(2, '0')}.png` })
}
const over = await p.evaluate(() => [...document.querySelectorAll('.bj3 *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > innerWidth + 1 && getComputedStyle(e).position !== 'fixed' && !e.closest('.strip,.filters,.drift') }).slice(0, 8).map(e => e.className || e.tagName))
console.log(JSON.stringify({ total, shots: i, errs: errs.slice(0, 5), overflow: over, sw: await p.evaluate(() => document.documentElement.scrollWidth) }))
await b.close()
