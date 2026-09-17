import puppeteer from 'puppeteer-core'
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/dda2a378-fed2-4edc-83a5-2a93b4e70d42/scratchpad/swarm/lead-verify'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })

// Desktop: nav condense + overlap check on /italskar-innrettingar
{
  const page = await br.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  await page.goto('http://localhost:8963/italskar-innrettingar', { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 1500))
  for (const y of [0, 500, 1000, 1500, 1800]) {
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y)
    await new Promise(r => setTimeout(r, 300))
  }
  const info = await page.evaluate(() => {
    const nav = document.querySelector('.ki-nav')
    const links = document.querySelector('.ki-nav-links')
    const mark = document.querySelector('.ki-nav-mark')
    return {
      condensed: nav?.dataset.kiCondensed,
      tone: nav?.dataset.kiTone,
      linksOpacity: links ? getComputedStyle(links).opacity : null,
      navBg: nav ? getComputedStyle(nav).backgroundColor : null,
      markColor: mark ? getComputedStyle(mark).color : null,
      scrollY: window.scrollY,
    }
  })
  console.log('italskar scrolled 1800:', JSON.stringify(info))
  await page.screenshot({ path: `${OUT}/italskar-scroll1800.png` })
  await page.close()
}

// Desktop home: pill hover mid-transition
{
  const page = await br.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  await page.goto('http://localhost:8963/', { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 1500))
  const pill = await page.$('a.ki-fill')
  const box = await pill.boundingBox()
  await page.mouse.move(box.x + box.width/2, box.y + box.height/2)
  await new Promise(r => setTimeout(r, 250))
  await page.screenshot({ path: `${OUT}/pill-hover-250ms.png`, clip: { x: Math.max(0,box.x-40), y: Math.max(0,box.y-40), width: box.width+80, height: box.height+80 } })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: `${OUT}/pill-hover-1050ms.png`, clip: { x: Math.max(0,box.x-40), y: Math.max(0,box.y-40), width: box.width+80, height: box.height+80 } })
  await page.close()
}

// Mobile home: first viewport + burger/i sizes + duplicate title check
{
  const page = await br.newPage()
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
  await page.goto('http://localhost:8963/', { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 1500))
  const sizes = await page.evaluate(() => {
    const burger = document.querySelector('.ki-burger')
    const i = document.querySelector('.ki-show-i, button.ki-show-i, [class*="show-i"]')
    const bb = burger?.getBoundingClientRect()
    const ib = i?.getBoundingClientRect()
    const texts = Array.from(document.querySelectorAll('h1,h2,p,a,button,span')).map(el => el.textContent.trim()).filter(Boolean)
    const newest = document.querySelector('.ki-newest, a[class*="newest"]')
    return {
      burger: bb ? { w: bb.width, h: bb.height } : null,
      infoBtn: ib ? { w: ib.width, h: ib.height, cls: i.className } : null,
      hasNewest: !!newest,
    }
  })
  console.log('mobile sizes:', JSON.stringify(sizes))
  await page.screenshot({ path: `${OUT}/mobile-home-first.png` })
  await page.close()
}

await br.close()
