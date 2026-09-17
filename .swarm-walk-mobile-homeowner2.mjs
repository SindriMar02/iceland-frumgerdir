import puppeteer from 'puppeteer-core'
import fs from 'fs'

const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/walk-mobile-homeowner'
fs.mkdirSync(OUT, { recursive: true })

const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage()
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
const log = []
const shot = async (name) => { await page.screenshot({ path: `${OUT}/${name}.png` }); log.push(`shot: ${name}`) }

// Task 2: tap "Verkefnin" pill button on landing -> goes to /verkefni
await page.goto('http://localhost:8963/', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 1500))
const verkefninBtn = await page.evaluateHandle(() => [...document.querySelectorAll('a')].find(a => a.href.endsWith('/verkefni') && a.textContent.includes('VERKEFNIN')))
const el = verkefninBtn.asElement()
if (el) { await el.click() } else { log.push('VERKEFNIN button not found by heuristic, navigating directly'); await page.goto('http://localhost:8963/verkefni') }
await new Promise(r => setTimeout(r, 1200))
log.push('URL after tap: ' + page.url())
await shot('03-verkefni-listing-top')

// scroll to find kitchen ("Eldhús") entries
let found = []
for (let i=0;i<12;i++){
  await page.evaluate(() => window.scrollBy({top: 500, behavior:'instant'}))
  await new Promise(r=>setTimeout(r,150))
  const texts = await page.evaluate(() => [...document.querySelectorAll('a')].filter(a=>/eldhús/i.test(a.textContent)).map(a=>({t:a.textContent.trim(), href:a.getAttribute('href')})))
  found = found.concat(texts)
}
log.push('KITCHEN LINKS FOUND WHILE SCROLLING:\n'+JSON.stringify(found,null,1))
await shot('04-verkefni-listing-scrolled')

// click first kitchen project (Eldhúsrými í Skuggahverfi)
await page.evaluate(() => window.scrollTo(0,0))
await new Promise(r=>setTimeout(r,300))
const kitchenHandle = await page.evaluateHandle(() => [...document.querySelectorAll('a')].find(a => /skuggahverfi/i.test(a.getAttribute('href')||'')))
const kEl = kitchenHandle.asElement()
if (kEl) {
  await kEl.scrollIntoView()
  await new Promise(r=>setTimeout(r,300))
  await shot('05-before-click-kitchen')
  await kEl.click()
} else {
  log.push('Kitchen link not found, navigating directly')
  await page.goto('http://localhost:8963/verkefni/eldhusrymi-i-skuggahverfi')
}
await new Promise(r => setTimeout(r, 1200))
log.push('URL after kitchen click: ' + page.url())
await shot('06-kitchen-project-top')

// scroll through the project photos
for (let i=0;i<6;i++){
  await page.evaluate(() => window.scrollBy({top: 700, behavior:'instant'}))
  await new Promise(r=>setTimeout(r,200))
  if (i===2 || i===5) await shot(`07-kitchen-scroll-${i}`)
}

// look for contact / process info on this page
const pageText = await page.evaluate(()=>document.body.innerText)
log.push('KITCHEN PAGE TEXT (first 1500 chars):\n'+pageText.slice(0,1500))
log.push('...LAST 1500 chars:\n'+pageText.slice(-1500))

fs.writeFileSync(`${OUT}/log-part2.txt`, log.join('\n\n'))
await br.close()
