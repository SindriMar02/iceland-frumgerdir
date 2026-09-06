import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/nl-seam-profile2' })
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 900 })
await p.goto('https://sindrimar02.github.io/iceland-frumgerdir/preview/nollur/', { waitUntil: 'networkidle0', timeout: 45000 })
await p.evaluate(() => document.fonts.ready)
await new Promise(r => setTimeout(r, 2000))
const maxScroll = await p.evaluate(() => document.body.scrollHeight - window.innerHeight)
console.log('maxScroll', maxScroll)
let lo = 0, hi = maxScroll
for (let i = 0; i < 24; i++) {
  const mid = Math.round((lo + hi) / 2)
  await p.evaluate((y) => window.scrollTo(0, y), mid)
  await new Promise(r => setTimeout(r, 60))
  const barnLeft = await p.evaluate(() => document.querySelector('.nl-barn').getBoundingClientRect().left)
  if (barnLeft > 700) lo = mid; else hi = mid
}
await p.evaluate((y) => window.scrollTo(0, y), hi)
await new Promise(r => setTimeout(r, 300))
const bl = await p.evaluate(() => document.querySelector('.nl-barn').getBoundingClientRect().left)
console.log('settled barnLeft', bl, 'scrollY', hi)
await p.screenshot({ path: 'scripts/nollur-shots/seam-precise.png' })
await b.close()
