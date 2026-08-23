/**
 * Verifies the image-mask drift on the Tannlæknavaktin hero.
 *
 * MUST run headless: a backgrounded or hidden tab pauses rAF, which freezes
 * the gsap ticker and makes the transform read as a permanent 0 even when the
 * mechanism is perfectly healthy. Reading a transform ONCE proves nothing —
 * this drives several scroll depths, asserts the values differ, and asserts
 * they come back on the way up.
 */
import puppeteer from 'puppeteer-core'

const URL = process.argv[2] || 'http://localhost:4199/preview/tannlaeknavaktin/'

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  userDataDir: '/tmp/tlv-drift-profile',
  args: ['--no-sandbox', '--force-color-profile=srgb'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await page.goto(URL, { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 1600))

const readY = () => page.evaluate(() => {
  const fi = document.querySelector('.tlv-hero .tlv-frame-in')
  const box = fi.parentElement.getBoundingClientRect()
  const img = fi.getBoundingClientRect()
  const m = getComputedStyle(fi).transform.match(/matrix\(([^)]+)\)/)
  return {
    ty: m ? +parseFloat(m[1].split(',')[5]).toFixed(2) : null,
    inset: getComputedStyle(fi).top,
    // the edge test: the image must always overhang the frame on both sides
    topGap: +(box.top - img.top).toFixed(1),
    bottomGap: +(img.bottom - box.bottom).toFixed(1),
  }
})

const samples = []
for (const y of [0, 200, 400, 650, 400, 0]) {
  await page.evaluate((v) => window.scrollTo(0, v), y)
  await new Promise((r) => setTimeout(r, 420))
  samples.push({ scrollY: y, ...(await readY()) })
}

console.log(JSON.stringify(samples, null, 1))
const ys = samples.map((s) => s.ty)
console.log('distinct translate values :', new Set(ys).size)
console.log('drift is running          :', new Set(ys).size > 1)
console.log('reverses on scroll up     :', ys[0] === ys[5] && ys[2] === ys[4])
console.log('image never exposes edge  :', samples.every((s) => s.topGap >= 0 && s.bottomGap >= 0))

await browser.close()
