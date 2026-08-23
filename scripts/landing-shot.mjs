// Landing-page screenshot for an outreach email. ALWAYS off the LIVE deployed
// URL, never localhost: the shot has to be what the owner will actually see,
// and it doubles as proof the deploy is good.
//
// Generic, unlike landing-shot-url.mjs, which is hardcoded to Brú's hero
// selectors. Works on any preview: it waits for the page's own settle signals
// where they exist, then asserts on what is actually painted above the fold.
//
//   node scripts/landing-shot.mjs <live-url> <out.jpg>
//
// Refuses to shoot rather than hand over a half-revealed page: every build here
// has some opening motion, and firing the camera early gives a black field,
// which is worse than no image at all.
import puppeteer from 'puppeteer-core'

const URL = process.argv[2]
const OUT = process.argv[3]
if (!URL || !OUT) {
  console.error('usage: node scripts/landing-shot.mjs <live-url> <out.jpg>')
  process.exit(1)
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const b = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--no-sandbox', '--force-color-profile=srgb'],
})
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
await p.goto(URL, { waitUntil: 'networkidle0', timeout: 90000 })

/* Common curtain conventions across these builds; absent on most, so this is a
   best-effort wait rather than a requirement. */
await p
  .waitForFunction(
    () => !document.body.classList.contains('is-loading') && !document.documentElement.classList.contains('is-loading'),
    { timeout: 20000 },
  )
  .catch(() => {})

await p.evaluate(() => document.fonts?.ready)
/* Scroll-triggered reveals only fire once observed, and a shot of the fold
   should show them settled. Nudge and come back. */
await p.evaluate(() => window.scrollTo(0, 600))
await sleep(700)
await p.evaluate(() => window.scrollTo(0, 0))
await sleep(1400)

const state = await p.evaluate(() => {
  const fold = [...document.querySelectorAll('img')].filter((i) => {
    const r = i.getBoundingClientRect()
    return r.top < window.innerHeight && r.bottom > 0 && r.width > 40
  })
  const hidden = [...document.querySelectorAll('h1, h2')].filter((e) => {
    const r = e.getBoundingClientRect()
    if (r.top > window.innerHeight || r.bottom < 0) return false
    return Number(getComputedStyle(e).opacity) < 0.9
  }).length
  return {
    text: document.body.innerText.replace(/\s+/g, ' ').trim().length,
    foldImgs: fold.length,
    broken: fold.filter((i) => i.complete && i.naturalWidth === 0).length,
    undecoded: fold.filter((i) => !i.complete).length,
    hiddenHeadings: hidden,
  }
})

const bad =
  state.text < 300 || state.broken > 0 || state.undecoded > 0 || state.hiddenHeadings > 0
if (bad) {
  console.error('REFUSING to shoot, page not settled:', JSON.stringify(state))
  await b.close()
  process.exit(1)
}

await p.screenshot({ path: OUT, type: 'jpeg', quality: 88 })
console.log('shot:', OUT, JSON.stringify(state))
await b.close()
