import puppeteer from 'puppeteer-core'
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/judge-design'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })

// Home: info popover + slideshow arrow
await page.goto('http://localhost:8963/', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 1500))
// click the "i" button near caption
const iBtn = await page.$('.bottom-0 button, footer button')
try {
  await page.click('text/i')
} catch(e) {}
// more robust: find button with aria-label containing info, else the small round button next to caption text
const clicked = await page.evaluate(() => {
  const btns = Array.from(document.querySelectorAll('button'))
  const target = btns.find(b => b.textContent.trim() === 'i' || (b.getAttribute('aria-label')||'').toLowerCase().includes('uppl'))
  if (target) { target.click(); return true }
  return false
})
console.log('info click', clicked)
await new Promise(r => setTimeout(r, 500))
await page.screenshot({ path: `${OUT}/desktop-home-infopopover.png` })
await page.keyboard.press('Escape')
await new Promise(r => setTimeout(r, 300))

// slideshow next arrow
const arrowClicked = await page.evaluate(() => {
  const btns = Array.from(document.querySelectorAll('button'))
  const target = btns.reverse().find(b => (b.getAttribute('aria-label')||'').toLowerCase().includes('next') || (b.getAttribute('aria-label')||'').toLowerCase().includes('áfram') || (b.getAttribute('aria-label')||'').toLowerCase().includes('næst'))
  if (target) { target.click(); return true }
  return false
})
console.log('arrow click', arrowClicked)
await new Promise(r => setTimeout(r, 700))
await page.screenshot({ path: `${OUT}/desktop-home-afterarrow.png` })

// hover a nav link for letter-roll
await page.hover('header a')
await new Promise(r => setTimeout(r, 250))
await page.screenshot({ path: `${OUT}/desktop-home-navhover.png`, clip: {x:0,y:0,width:900,height:80} })

// hover pill button "Verkefnin"
const pill = await page.$$eval('button', els => els.findIndex(e => e.textContent.includes('VERKEFNIN')))
try {
  const handle = (await page.$$('button'))[pill]
  await handle.hover()
  await new Promise(r => setTimeout(r, 300))
  await page.screenshot({ path: `${OUT}/desktop-home-pillhover.png`, clip: {x:400,y:480,width:500,height:150} })
} catch(e) { console.log('pill hover fail', e.message) }

// card click -> verify navigation
await page.goto('http://localhost:8963/verkefni', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 1200))
await page.screenshot({ path: `${OUT}/desktop-verkefni-top.png` })
// find register list "Skráin öll" section, hover a row
const rows = await page.$$('a')
let hoveredRow = false
for (const a of rows) {
  const txt = await page.evaluate(el => el.textContent, a)
  if (txt && txt.trim().length > 3 && txt.trim().length < 40 && !txt.includes('KATRÍN')) {
    const box = await a.boundingBox()
    if (box && box.y > 600 && box.y < 1400) {
      await page.mouse.move(box.x + box.width/2, box.y + box.height/2)
      await new Promise(r => setTimeout(r, 400))
      hoveredRow = true
      break
    }
  }
}
console.log('hovered register row', hoveredRow)
await page.screenshot({ path: `${OUT}/desktop-verkefni-registerhover.png` })

// click a project card and confirm URL change
const cardLink = await page.$('a[href*="/verkefni/"]')
if (cardLink) {
  await cardLink.click()
  await new Promise(r => setTimeout(r, 1000))
  console.log('navigated to', page.url())
  await page.screenshot({ path: `${OUT}/desktop-cardclick-result.png` })
}

await br.close()
