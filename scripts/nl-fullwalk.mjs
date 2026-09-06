import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/nl-walk-live' })
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 900 })
await p.goto('https://sindrimar02.github.io/iceland-frumgerdir/preview/nollur/', { waitUntil: 'networkidle0', timeout: 45000 })
await p.evaluate(() => document.fonts.ready)
await new Promise(r => setTimeout(r, 2000))
const sections = ['hero','arrival','statement','reno','houses','shednote','materials','farm','isl','saga','summer','cierre','footer']
// desktop is a horizontal journey; step through by wheel ticks and shoot each stop
for (let i = 0; i < 13; i++) {
  for (let k = 0; k < 8; k++) { await p.mouse.wheel({ deltaY: 300 }); await new Promise(r => setTimeout(r, 25)) }
  await new Promise(r => setTimeout(r, 500))
  await p.screenshot({ path: `scripts/nollur-shots/walk-${String(i).padStart(2,'0')}.png` })
}
await b.close()
