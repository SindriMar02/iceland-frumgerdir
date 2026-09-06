import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/nl-qa-profile' })
const p = await b.newPage()
const errors = []
p.on('pageerror', (e) => errors.push(`page: ${e.message}`))
p.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text().slice(0, 200)}`) })
await p.setViewport({ width: 1440, height: 900 })
await p.evaluateOnNewDocument(() => sessionStorage.setItem('nl_seen', '1'))
await p.goto('http://localhost:5299/preview/nollur', { waitUntil: 'domcontentloaded' })
await p.evaluate(() => document.fonts.ready)
await new Promise(r => setTimeout(r, 2200))
await p.screenshot({ path: 'scripts/nollur-shots/behind-rest.png' })
// scroll partway through the hero panel (desktop = horizontal journey driven by vertical wheel)
for (let i = 0; i < 6; i++) { await p.mouse.wheel({ deltaY: 260 }); await new Promise(r => setTimeout(r, 40)) }
await new Promise(r => setTimeout(r, 700))
await p.screenshot({ path: 'scripts/nollur-shots/behind-mid.png' })
for (let i = 0; i < 8; i++) { await p.mouse.wheel({ deltaY: 260 }); await new Promise(r => setTimeout(r, 40)) }
await new Promise(r => setTimeout(r, 700))
await p.screenshot({ path: 'scripts/nollur-shots/behind-far.png' })
// mobile
await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await p.reload({ waitUntil: 'domcontentloaded' })
await new Promise(r => setTimeout(r, 2200))
await p.screenshot({ path: 'scripts/nollur-shots/behind-m-rest.png' })
await p.evaluate(() => window.scrollTo(0, window.innerHeight * 0.55))
await new Promise(r => setTimeout(r, 700))
await p.screenshot({ path: 'scripts/nollur-shots/behind-m-mid.png' })
console.log(JSON.stringify({ errors }))
await b.close()
