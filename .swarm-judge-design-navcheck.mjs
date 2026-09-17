import puppeteer from 'puppeteer-core'
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/judge-design'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await page.goto('http://localhost:8963/italskar-innrettingar', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 1500))
await page.evaluate(() => window.scrollTo({ top: 1750, behavior: 'instant' }))
await new Promise(r => setTimeout(r, 2000))
await page.screenshot({ path: `${OUT}/italskar-navoverlap.png`, clip: {x:0,y:0,width:1440,height:120} })
const nav = await page.evaluate(() => {
  const el = document.querySelector('header') || document.querySelector('nav')
  if (!el) return 'no header/nav found'
  const cs = getComputedStyle(el)
  return { tag: el.tagName, bg: cs.backgroundColor, position: cs.position, zIndex: cs.zIndex }
})
console.log(JSON.stringify(nav))
await br.close()
