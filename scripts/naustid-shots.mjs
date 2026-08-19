import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

const OUT = process.env.OUT || '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/02537dce-6838-4208-8842-7378d05ae886/scratchpad/naustid'
fs.mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  userDataDir: OUT + '/chrome-profile',
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await page.goto('http://localhost:5199/preview/naustid', { waitUntil: 'networkidle0', timeout: 60000 })
await page.evaluate(() => document.fonts.ready)
await new Promise((r) => setTimeout(r, 2000))

// full page under reduced motion = authoritative completeness check (ledger #36b)
await page.screenshot({ path: OUT + '/full-reduced.png', fullPage: true })

// structural probe
const probe = await page.evaluate(() => {
  const secs = Array.from(document.querySelectorAll('section')).map((s, i) => ({
    i,
    id: s.id || null,
    h: Math.round(s.getBoundingClientRect().height),
    bg: getComputedStyle(s).backgroundColor,
    head: (s.querySelector('h1,h2,h3')?.textContent || '').trim().slice(0, 60),
  }))
  const imgs = Array.from(document.images).map((im) => ({
    src: im.currentSrc.split('/').slice(-1)[0].slice(0, 44),
    nw: im.naturalWidth,
    rw: Math.round(im.getBoundingClientRect().width),
  }))
  return {
    secs,
    imgs,
    docH: document.documentElement.scrollHeight,
    fonts: Array.from(new Set(Array.from(document.querySelectorAll('h1,h2,h3,p,a')).map((e) => getComputedStyle(e).fontFamily))),
  }
})
fs.writeFileSync(OUT + '/probe.json', JSON.stringify(probe, null, 2))
console.log(JSON.stringify(probe.secs, null, 1))
console.log('doc height', probe.docH)
console.log('fonts', probe.fonts)

await browser.close()
