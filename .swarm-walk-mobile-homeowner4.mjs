import puppeteer from 'puppeteer-core'
import fs from 'fs'

const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/walk-mobile-homeowner'
fs.mkdirSync(OUT, { recursive: true })

const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage()
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
const log = []
const shot = async (name) => { await page.screenshot({ path: `${OUT}/${name}.png` }); log.push(`shot: ${name}`) }

await page.goto('http://localhost:8963/verkefni/eldhusrymi-i-skuggahverfi', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 1200))

// inspect ALL "Hafa samband" anchors with full geometry + visibility
const info = await page.evaluate(() => {
  const all = [...document.querySelectorAll('a')].filter(a => /hafa samband/i.test(a.textContent))
  return all.map(a => {
    const r = a.getBoundingClientRect()
    const style = getComputedStyle(a)
    return {
      href: a.getAttribute('href'),
      rect: { x: r.x, y: r.y, w: r.width, h: r.height, top: r.top + window.scrollY },
      display: style.display, visibility: style.visibility, opacity: style.opacity,
      offsetParent: a.offsetParent ? a.offsetParent.tagName : null,
      className: a.className
    }
  })
})
log.push('ALL HAFA SAMBAND ANCHORS:\n' + JSON.stringify(info, null, 1))
log.push('document scrollHeight: ' + await page.evaluate(()=>document.body.scrollHeight))

fs.writeFileSync(`${OUT}/log-part4.txt`, log.join('\n\n'))
await br.close()
