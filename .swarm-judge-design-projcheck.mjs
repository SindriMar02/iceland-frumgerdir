import puppeteer from 'puppeteer-core'
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/judge-design'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await page.goto('http://localhost:8963/verkefni/hotel-hekla', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 1500))
await page.evaluate(() => window.scrollTo({ top: 750, behavior: 'instant' }))
await new Promise(r => setTimeout(r, 600))
await page.screenshot({ path: `${OUT}/hekla-title-area.png` })
// check hero image natural size vs displayed size
const heroInfo = await page.evaluate(() => {
  const imgs = Array.from(document.images).slice(0,3)
  return imgs.map(i => ({src: i.currentSrc.slice(-80), natW: i.naturalWidth, natH: i.naturalHeight, dispW: i.clientWidth, dispH: i.clientHeight}))
})
console.log(JSON.stringify(heroInfo, null, 2))
await br.close()
