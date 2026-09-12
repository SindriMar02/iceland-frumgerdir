/* /hafa-samband: the shared form on a light band, with the pill submit */
import puppeteer from 'puppeteer-core'
const [url, out] = process.argv.slice(2)
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const p = await br.newPage(); await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await p.goto(url, { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 1200))
const r = await p.$eval('.ki-samb-body', e => { const b = e.getBoundingClientRect(); return { y: b.top + scrollY, h: b.height } })
await p.screenshot({ path: `${out}.png`, clip: { x: 0, y: r.y, width: 1440, height: Math.min(r.h, 1100) }, captureBeyondViewport: true })
const s = await p.$eval('.ki-samb-body .ki-fill', e => { const c = getComputedStyle(e), bg = getComputedStyle(e.querySelector('.ki-fill-bg')); return { color: c.color, border: c.borderColor, disc: bg.backgroundColor, h: e.getBoundingClientRect().height } })
console.log(JSON.stringify(s), await p.evaluate(() => document.querySelectorAll('form.ki-form').length))
await br.close()
