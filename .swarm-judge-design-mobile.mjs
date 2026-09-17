import puppeteer from 'puppeteer-core'
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/judge-design'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage()
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })

// mobile home
await page.goto('http://localhost:8963/', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 1500))
await page.screenshot({ path: `${OUT}/mobile-home-top.png` })

// open burger menu
const burger = await page.$('header button, header [role="button"], header svg')
try {
  await page.click('header button')
  await new Promise(r => setTimeout(r, 500))
  await page.screenshot({ path: `${OUT}/mobile-home-menu.png` })
  await page.keyboard.press('Escape')
  await new Promise(r => setTimeout(r, 300))
} catch (e) { console.log('burger click failed', e.message) }

// info popover
try {
  const iBtn = await page.$('button:has-text("i")')
} catch(e) {}
// try clicking the small "i" circle near slide caption
const els = await page.$$eval('button, [role="button"]', els => els.map((e,idx)=>({idx, text: e.textContent.trim(), rect: e.getBoundingClientRect()})))
console.log('mobile buttons:', JSON.stringify(els.filter(e=>e.text.length<3 || e.text.toLowerCase()==='i')))

await new Promise(r => setTimeout(r, 300))

// swipe slideshow: touch drag
await page.touchscreen.touchStart(340, 400)
await page.touchscreen.touchMove(60, 400)
await page.touchscreen.touchEnd()
await new Promise(r => setTimeout(r, 800))
await page.screenshot({ path: `${OUT}/mobile-home-afterswipe.png` })

// mobile project page
await page.goto('http://localhost:8963/verkefni/hotel-hekla', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 1500))
await page.screenshot({ path: `${OUT}/mobile-project-top.png` })
await page.evaluate(() => window.scrollTo({top: 900, behavior:'instant'}))
await new Promise(r => setTimeout(r, 400))
await page.screenshot({ path: `${OUT}/mobile-project-scroll1.png` })

await br.close()
