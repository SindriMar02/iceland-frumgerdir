/* one frame of the landing hero at a width, after the intro settles */
import puppeteer from 'puppeteer-core'
const [url, out, w, h, slide] = process.argv.slice(2)
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const p = await br.newPage()
await p.setViewport({ width: +w, height: +h, deviceScaleFactor: +w < 800 ? 2 : 1, isMobile: +w < 800, hasTouch: +w < 800 })
await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await p.goto(url, { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 1200))
if (slide) { await p.evaluate(i => document.querySelectorAll('.ki-show-dots button')[i].click(), +slide); await new Promise(r => setTimeout(r, 900)) }
await p.screenshot({ path: out })
await br.close()
