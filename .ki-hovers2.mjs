/* mid-hover frames after the labels moved into data attributes: a nav link's
   letter roll (mid-roll and settled) and the pill fill (settled) */
import puppeteer from 'puppeteer-core'
const [url, out] = process.argv.slice(2)
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const p = await br.newPage(); await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
await p.goto(url, { waitUntil: 'networkidle0' }); await new Promise((r) => setTimeout(r, 2600))
const clip = async (sel, pad) => { const b = await p.$eval(sel, (e) => { const r = e.getBoundingClientRect(); return [r.x, r.y, r.width, r.height] })
  return { x: Math.max(0, b[0] - pad), y: Math.max(0, b[1] - pad), width: b[2] + pad * 2, height: b[3] + pad * 2 } }
await p.screenshot({ path: `${out}-nav-rest.png`, clip: await clip('.ki-nav-links', 14) })
await p.hover('.ki-nav-links a'); await new Promise((r) => setTimeout(r, 180))
await p.screenshot({ path: `${out}-nav-mid.png`, clip: await clip('.ki-nav-links', 14) })
await new Promise((r) => setTimeout(r, 800))
await p.screenshot({ path: `${out}-nav-done.png`, clip: await clip('.ki-nav-links', 14) })
await p.hover('.ki-show-cta .ki-fill'); await new Promise((r) => setTimeout(r, 900))
await p.screenshot({ path: `${out}-fill.png`, clip: await clip('.ki-show-cta', 20) })
const txt = await p.evaluate(() => document.querySelector('.ki-show-cta').innerText.replace(/\s+/g, ' '))
console.log('pill text as extracted:', JSON.stringify(txt))
await br.close()
