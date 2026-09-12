import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const p = await br.newPage(); await p.setViewport({ width: 1440, height: 1000 })
await p.goto(process.argv[2], { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 3000))
const H = await p.evaluate(() => document.documentElement.scrollHeight)
for (let y = 0; y < H; y += 700) { await p.evaluate(v => scrollTo(0, v), y); await new Promise(r => setTimeout(r, 220)) }
await new Promise(r => setTimeout(r, 900))
await p.evaluate(() => scrollTo(0, document.querySelector('.ki-proj-gallery').offsetTop - 60))
await new Promise(r => setTimeout(r, 900))
await p.screenshot({ path: '/tmp/ki-proj.png' })
console.log(JSON.stringify(await p.evaluate(() => ({
  wide: document.querySelectorAll('.ki-gal-wide').length,
  half: document.querySelectorAll('.ki-gal-half').length,
  credit: document.querySelector('.ki-proj-credit')?.textContent || null,
  widths: [...document.querySelectorAll('.ki-proj-gallery > *')].map(e => Math.round(e.getBoundingClientRect().width)),
}))))
await br.close()
