import puppeteer from 'puppeteer-core'

const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/walk-mobile-homeowner'
import fs from 'fs'
fs.mkdirSync(OUT, { recursive: true })

const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage()
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })

const log = []
const shot = async (name) => { await page.screenshot({ path: `${OUT}/${name}.png` }); log.push(`shot: ${name}`) }

// 1. Landing
await page.goto('http://localhost:8963/', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 1500))
await shot('01-landing')

// check what text/elements visible within first viewport (10s comprehension test)
const heroText = await page.evaluate(() => document.body.innerText.slice(0, 800))
log.push('HERO TEXT:\n' + heroText)

// find nav / menu burger
const burgerSel = await page.evaluate(() => {
  const candidates = [...document.querySelectorAll('button, [role="button"], a')]
  const burger = candidates.find(el => /menu|burger/i.test(el.className) || /menu/i.test(el.getAttribute('aria-label')||''))
  return burger ? true : false
})
log.push('burger found by heuristic: ' + burgerSel)

// try clicking the info "i" popover
const iBtn = await page.$('[aria-label*="nfo" i], button:has-text("i")').catch(()=>null)
// evaluate manually for elements with text "i" or aria-label with info
const infoHandle = await page.evaluateHandle(() => {
  const els = [...document.querySelectorAll('button, [role="button"], span, div')]
  return els.find(el => (el.getAttribute('aria-label')||'').toLowerCase().includes('info') || (el.textContent.trim() === 'i' && el.offsetWidth < 40 && el.offsetWidth > 5))
})
const infoEl = infoHandle.asElement()
if (infoEl) {
  const box = await infoEl.boundingBox()
  log.push('info element box: ' + JSON.stringify(box))
  if (box) {
    await infoEl.click()
    await new Promise(r => setTimeout(r, 500))
    await shot('02-info-popover')
    // close it - click elsewhere
    await page.mouse.click(20, 20)
    await new Promise(r => setTimeout(r, 300))
  }
} else {
  log.push('info element NOT found')
}

// find "Nýjasta verkefnið" card and newest-project pill, and "Verkefnin" button
const linksInfo = await page.evaluate(() => {
  const as = [...document.querySelectorAll('a')]
  return as.map(a => ({ text: a.textContent.trim().slice(0,60), href: a.getAttribute('href') })).filter(a => a.text)
})
log.push('LINKS ON LANDING:\n' + JSON.stringify(linksInfo, null, 1))

fs.writeFileSync(`${OUT}/log-part1.txt`, log.join('\n\n'))
await br.close()
