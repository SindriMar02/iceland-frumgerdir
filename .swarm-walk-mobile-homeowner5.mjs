import puppeteer from 'puppeteer-core'
import fs from 'fs'

const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/walk-mobile-homeowner'
fs.mkdirSync(OUT, { recursive: true })

const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage()
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
const log = []
const shot = async (name) => { await page.screenshot({ path: `${OUT}/${name}.png` }); log.push(`shot: ${name}`) }

await page.goto('http://localhost:8963/', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 1500))

// open burger menu
const burger = await page.evaluateHandle(() => [...document.querySelectorAll('button,[role="button"]')].find(b => /opna valmynd/i.test(b.getAttribute('aria-label')||b.textContent||'')))
const bEl = burger.asElement()
if (bEl) { await bEl.click(); await new Promise(r=>setTimeout(r,500)); await shot('13-mobile-menu-open') }
else log.push('burger not found')

// close menu, then test swipe on hero slideshow
if (bEl) { await bEl.click(); await new Promise(r=>setTimeout(r,400)); }
await shot('14-before-swipe')

// simulate a swipe left on the hero image area
await page.touchscreen.touchStart(320, 250)
await page.touchscreen.touchMove(80, 250)
await page.touchscreen.touchEnd()
await new Promise(r=>setTimeout(r,700))
await shot('15-after-swipe')

const heroTextAfter = await page.evaluate(() => document.querySelector('h1, [class*="hero"], main')?.innerText?.slice(0,200) || 'n/a')
log.push('hero area text after swipe: ' + heroTextAfter)

fs.writeFileSync(`${OUT}/log-part5.txt`, log.join('\n\n'))
await br.close()
