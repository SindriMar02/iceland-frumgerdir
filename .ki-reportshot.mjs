/* page-sized screenshots of the audit report HTML, since no PDF rasteriser is installed */
import puppeteer from 'puppeteer-core'
const [src, out, n] = process.argv.slice(2)
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const p = await br.newPage(); await p.setViewport({ width: 816, height: 1056, deviceScaleFactor: 1 })
await p.goto('file://' + src, { waitUntil: 'networkidle0' })
for (let i = 0; i < +n; i++) await p.screenshot({ path: `${out}-${i}.png`, clip: { x: 0, y: i * 1056, width: 816, height: 1056 }, captureBeyondViewport: true })
await br.close()
