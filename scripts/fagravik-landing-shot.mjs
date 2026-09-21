// Landing-page screenshot for the Fagravík outreach email. ALWAYS off the LIVE
// deployed URL, never localhost. Exits non-zero rather than write a bad frame.
import puppeteer from 'puppeteer-core'
const URL = process.argv[2] || 'https://sindrimar02.github.io/iceland-frumgerdir/preview/fagravik/'
const OUT = process.argv[3] || `${process.env.HOME}/Downloads/frumgerd-fagravik.jpg`
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const b = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new', args: ['--no-sandbox', '--force-color-profile=srgb'],
})
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
await p.goto(URL, { waitUntil: 'networkidle0' })
// the opening must be finished: data-intro reaches 'done' (headless skips it)
await p.waitForFunction(() => document.querySelector('.fv')?.dataset.intro === 'done', { timeout: 30000 })
await p.evaluate(() => document.fonts.ready)
await sleep(1200)
const s = await p.evaluate(() => {
  const h1 = document.querySelector('.fv-word'), img = document.querySelector('.fv-hero .bg img')
  return { intro: document.querySelector('.fv').dataset.intro, wm: getComputedStyle(h1).opacity, filter: getComputedStyle(h1).filter,
    img: img.currentSrc.split('/').pop(), decoded: img.complete && img.naturalWidth > 0, fonts: document.fonts.status, y: scrollY }
})
if (s.intro !== 'done' || Number(s.wm) < 0.99 || s.filter !== 'none' || !s.decoded || s.fonts !== 'loaded' || s.y !== 0) {
  console.error('REFUSED: landing not settled', s); await b.close(); process.exit(1)
}
await p.screenshot({ path: OUT, type: 'jpeg', quality: 88 })
console.log('ok', OUT, s)
await b.close()
