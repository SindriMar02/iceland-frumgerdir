import puppeteer from 'puppeteer-core'
/* Every control is exercised with page.click(), which hit-tests through the
   real stacking order. The gallery pass used element.click() inside evaluate,
   which dispatches straight at the node and cannot see an overlay sitting on
   top of it — which is exactly how a page with every click dead still passed. */
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/au-clicks' })
const out = {}, errs = []
async function run(w, h, mobile, tag) {
  const p = await b.newPage()
  p.on('pageerror', e => errs.push(tag + ': ' + e.message))
  p.on('console', m => { if (m.type() === 'error') errs.push(tag + ': ' + m.text().slice(0, 100)) })
  await p.setCacheEnabled(false)
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile })
  if (mobile) await p.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1')
  await p.goto('https://sindrimar02.github.io/austurey-preview/?c=' + Math.random(), { waitUntil: 'networkidle2' })
  await new Promise(r => setTimeout(r, 8000))
  const r = {}
  // 1. nothing covers the nav
  /* the logo is deliberately pointer-events:none over the plate, so it is
     checked after a scroll instead, where it is meant to be live */
  r.navClear = await p.evaluate(() => ['#burger', '.nav_book'].every(sel => {
    const el = document.querySelector(sel); if (!el) return true
    const b = el.getBoundingClientRect()
    /* .nav_book is display:none under 860px; a zero-size box cannot be
       hit-tested and is not a covered control */
    if (b.width < 2 || b.height < 2) return true
    const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2)
    return el.contains(hit) || hit === el
  }))
  // 2. burger really opens and closes
  await p.click('#burger'); await new Promise(x => setTimeout(x, 900))
  r.menuOpened = await p.evaluate(() => document.body.classList.contains('menu-open'))
  await p.click('#burger'); await new Promise(x => setTimeout(x, 900))
  r.menuClosed = await p.evaluate(() => !document.body.classList.contains('menu-open'))
  // 3. a gallery card really opens the lightbox through the stack
  await p.evaluate(() => document.querySelector('#stays').scrollIntoView({ block: 'start' }))
  await new Promise(x => setTimeout(x, 1500))
  await p.click('.gcard_shot'); await new Promise(x => setTimeout(x, 1000))
  r.lightboxOpened = await p.evaluate(() => !document.getElementById('lbox').hidden)
  await p.keyboard.press('Escape'); await new Promise(x => setTimeout(x, 800))
  r.lightboxClosed = await p.evaluate(() => document.getElementById('lbox').hidden)
  // 4. after closing, the nav is clickable again
  await p.evaluate(() => window.scrollTo(0, 0)); await new Promise(x => setTimeout(x, 900))
  await p.click('#burger'); await new Promise(x => setTimeout(x, 900))
  r.menuAfterLightbox = await p.evaluate(() => document.body.classList.contains('menu-open'))
  await p.click('#burger'); await new Promise(x => setTimeout(x, 700))
  // 5. the logo is live once the page has scrolled off the plate
  await p.evaluate(() => window.scrollTo(0, window.innerHeight * 1.6))
  await new Promise(x => setTimeout(x, 1200))
  r.logoLiveAfterScroll = await p.evaluate(() => {
    const el = document.querySelector('.nav_logo'); const b = el.getBoundingClientRect()
    const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2)
    return getComputedStyle(el).pointerEvents !== 'none' && (el.contains(hit) || hit === el)
  })
  await p.close(); return r
}
out.desktop = await run(1440, 900, false, 'desktop')
out.mobile = await run(440, 956, true, 'mobile')
out.errors = errs
console.log(JSON.stringify(out, null, 1))
await b.close()
