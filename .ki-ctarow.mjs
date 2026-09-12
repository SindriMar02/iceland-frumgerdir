/* text CTAs: label and arrow on one line — crop every .ki-cta on the home page */
import puppeteer from 'puppeteer-core'
const [url, out] = process.argv.slice(2)
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const p = await br.newPage(); await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await p.goto(url, { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 1200))
const boxes = await p.$$eval('.ki-cta', els => els.map(e => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top + scrollY, w: r.width, h: r.height, t: e.textContent.trim().slice(0, 30) } }).filter(b => b.w > 0))
let i = 0
for (const b of boxes.slice(0, 6)) {
  await p.screenshot({ path: `${out}-${i++}.png`, clip: { x: Math.max(0, b.x - 12), y: b.y - 10, width: b.w + 24, height: b.h + 20 }, captureBeyondViewport: true })
}
console.log(boxes.length, 'ctas;', boxes.slice(0, 6).map(b => `${b.t} ${Math.round(b.w)}x${Math.round(b.h)}`).join(' | '))
await br.close()
