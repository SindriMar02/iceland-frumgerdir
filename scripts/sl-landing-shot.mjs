import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const p = await b.newPage()
await p.setViewport({ width: 1600, height: 1000 })
await p.goto('https://sindrimar02.github.io/iceland-frumgerdir/preview/svartlodge/', { waitUntil: 'networkidle0', timeout: 45000 })
await p.evaluate(() => document.fonts.ready)
await new Promise(r => setTimeout(r, 2000))
await p.screenshot({ path: '/tmp/frumgerd-svartlodge.png' })
await b.close()
