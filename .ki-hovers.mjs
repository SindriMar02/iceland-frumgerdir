/* mid-hover frames of the flair pieces: pill fill, text roll, register peek */
import puppeteer from 'puppeteer-core'
const [url, out] = process.argv.slice(2)
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const p = await br.newPage()
await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await p.goto(url, { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 2600))
const clipAround = async (sel, pad) => { const b = await p.$eval(sel, e => { const r = e.getBoundingClientRect(); return [r.x, r.y, r.width, r.height] })
  return { x: Math.max(0, b[0] - pad), y: Math.max(0, b[1] - pad), width: b[2] + pad * 2, height: b[3] + pad * 2 } }
await p.hover('.ki-fill'); await new Promise(r => setTimeout(r, 700))
await p.screenshot({ path: `${out}-fill.png`, clip: await clipAround('.ki-show-cta', 40) })
await p.hover('.ki-show-cta .ki-cta'); await new Promise(r => setTimeout(r, 220))
await p.screenshot({ path: `${out}-roll.png`, clip: await clipAround('.ki-show-cta', 40) })
const y = await p.$eval('#skra', e => e.getBoundingClientRect().top + scrollY)
for (let s = 0; s <= y + 400; s += 600) { await p.evaluate(v => scrollTo({ top: v, behavior: 'instant' }), s); await new Promise(r => setTimeout(r, 120)) }
await new Promise(r => setTimeout(r, 1200))
const a = await p.$('#skra a[data-preview]')
await a.hover(); const bb = await a.boundingBox()
for (let i = 0; i < 8; i++) { await p.mouse.move(bb.x + 40 + i * 12, bb.y + bb.height / 2); await new Promise(r => setTimeout(r, 60)) }
await new Promise(r => setTimeout(r, 900))
await p.screenshot({ path: `${out}-peek.png` })
console.log(await p.$eval('.ki-peek', e => ({ on: e.hasAttribute('data-on'), t: e.style.transform, img: !!e.querySelector('img') })))
await br.close()
