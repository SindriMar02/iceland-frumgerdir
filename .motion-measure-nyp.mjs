import puppeteer from 'puppeteer-core'
const URL = process.env.MURL || 'https://sindrimar02.github.io/iceland-frumgerdir/preview/nypugardar/'
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox'] })
async function fresh(stubVars) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  if (stubVars) await page.evaluateOnNewDocument(() => {
    const orig = CSSStyleDeclaration.prototype.setProperty
    CSSStyleDeclaration.prototype.setProperty = function (n, v, p) { if (n === '--sky' || n === '--skyink' || n === '--rule') return; return orig.call(this, n, v, p) }
  })
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 2000))
  return page
}
// A. style recalc cost of the per-frame CSS variable writes during a 3 s wheel scroll
for (const stub of [false, true]) {
  const page = await fresh(stub)
  const cdp = await page.target().createCDPSession()
  await cdp.send('Performance.enable')
  const m0 = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]))
  const t0 = Date.now()
  for (let i = 0; i < 60; i++) { await page.mouse.wheel({ deltaY: 120 }); await new Promise((r) => setTimeout(r, 50)) }
  const m1 = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]))
  console.log(stub ? 'STUBBED vars' : 'LIVE vars   ', 'recalcs', (m1.RecalcStyleCount - m0.RecalcStyleCount), 'recalcMs', ((m1.RecalcStyleDuration - m0.RecalcStyleDuration) * 1000).toFixed(1), 'layouts', (m1.LayoutCount - m0.LayoutCount), 'layoutMs', ((m1.LayoutDuration - m0.LayoutDuration) * 1000).toFixed(1), 'over', Date.now() - t0, 'ms')
  await page.close()
}
// B. room strip: arrow click → settle time, and how long card 5 stays clipped after it enters
{
  const page = await fresh(false)
  await page.evaluate(() => document.querySelector('#rooms').scrollIntoView())
  await new Promise((r) => setTimeout(r, 2500))
  const res = await page.evaluate(async () => {
    const strip = document.querySelector('[aria-roledescription="carousel"]')
    const next = document.querySelector('button[aria-label="Next room types"]')
    const imgs = [...strip.querySelectorAll('article img')]
    const clip = (i) => getComputedStyle(imgs[i]).clipPath
    const before = imgs.map((_, i) => clip(i))
    // click next 4 times quickly, sample scrollLeft + card 5 clip every 40ms for 2.5s
    const t0 = performance.now(); const samples = []
    for (let k = 0; k < 4; k++) { next.click(); await new Promise((r) => setTimeout(r, 120)) }
    let settledAt = null, lastLeft = -1, stable = 0, revealedAt = null
    while (performance.now() - t0 < 3000) {
      const left = strip.scrollLeft; const c5 = clip(4)
      if (left === lastLeft) stable++; else stable = 0
      if (stable === 3 && settledAt === null) settledAt = performance.now() - t0 - 80
      if (revealedAt === null && /inset\(0px\)|none/.test(c5)) revealedAt = performance.now() - t0
      samples.push([Math.round(performance.now() - t0), left, c5.slice(0, 22)])
      lastLeft = left
      await new Promise((r) => setTimeout(r, 40))
    }
    return { before, settledAt: settledAt && Math.round(settledAt), revealedAt: revealedAt && Math.round(revealedAt), firstSeen: samples.find((s) => s[1] > 700)?.[0], tail: samples.filter((_, i) => i % 8 === 0).slice(0, 12) }
  })
  console.log('STRIP clip before interaction:', res.before.map((c) => c.slice(0, 16)).join(' | '))
  console.log('STRIP 4 next-clicks: scroll settled at', res.settledAt, 'ms; card5 first past 700px at', res.firstSeen, 'ms; card5 fully revealed at', res.revealedAt, 'ms')
  console.log(JSON.stringify(res.tail))
  await page.close()
}
// C. hover swell timing + count tween on the reviews section
{
  const page = await fresh(false)
  const hover = await page.evaluate(() => {
    const el = document.querySelector('.group-hover\\:scale-\\[1\\.035\\]')
    return el ? getComputedStyle(el).transitionDuration + ' ' + getComputedStyle(el).transitionTimingFunction : 'none on homepage'
  })
  console.log('HOVER swell:', hover)
  await page.evaluate(() => document.querySelector('#reviews').scrollIntoView())
  const t0 = Date.now(); let done = null
  while (Date.now() - t0 < 2500) { const v = await page.evaluate(() => document.querySelector('#reviews .font-erode.tabular-nums')?.textContent); if (v === '8.8' && Date.now() - t0 > 200) { done = Date.now() - t0; break } await new Promise((r) => setTimeout(r, 30)) }
  console.log('COUNT 8.8 landed at ~', done, 'ms after scrollIntoView')
  await page.close()
}
await browser.close()
