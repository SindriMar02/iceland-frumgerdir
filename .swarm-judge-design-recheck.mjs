import puppeteer from 'puppeteer-core'
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/judge-design'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await page.goto('http://localhost:8963/', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 1500))
await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }))
await new Promise(r => setTimeout(r, 2500))
await page.screenshot({ path: `${OUT}/home-scroll1-recheck.png` })
// check computed styles of the heading
const info = await page.evaluate(() => {
  const els = Array.from(document.querySelectorAll('h1,h2,h3')).filter(e => e.textContent.includes('Hvert'))
  return els.map(e => {
    const cs = getComputedStyle(e)
    return { text: e.textContent, overflow: cs.overflow, height: cs.height, lineHeight: cs.lineHeight, display: cs.display, webkitLineClamp: cs.webkitLineClamp, maxHeight: cs.maxHeight, parentOverflow: getComputedStyle(e.parentElement).overflow, parentHeight: getComputedStyle(e.parentElement).height }
  })
})
console.log(JSON.stringify(info, null, 2))
await br.close()
