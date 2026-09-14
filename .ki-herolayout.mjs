/* the landing frame must never collide: header, newest pill, lockup, caption bar,
   progress, arrows, popover — at five viewports. Also: the progress bar's nearest
   neighbour must be the caption, never the newest pill. */
import puppeteer from 'puppeteer-core'
const [url, out] = process.argv.slice(2)
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const SIZES = [[1440, 900], [1280, 720], [1024, 768], [390, 844], [375, 667]]
let fails = 0
for (const [w, h] of SIZES) {
  const p = await br.newPage(); await p.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: w < 800, hasTouch: w < 800 })
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await p.goto(url, { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 1500))
  const check = async (withInfo) => p.evaluate((withInfo) => {
    const vis = (e) => e && getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden' && e.getBoundingClientRect().width > 0
    const box = (sel) => { const e = document.querySelector(sel); if (!vis(e)) return null; const r = e.getBoundingClientRect(); return { sel, l: r.left, t: r.top, r: r.right, b: r.bottom } }
    const parts = ['.ki-nav-mark', '.ki-burger', '.ki-nav-links', '.ki-newest', '.ki-show-name', '.ki-show-role', '.ki-show-tag', '.ki-show-cta', '.ki-show-cap', '.ki-show-dots', '.ki-show-nav']
    if (withInfo) parts.push('.ki-show-info')
    const bs = parts.map(box).filter(Boolean)
    const hits = []
    for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) {
      const a = bs[i], b = bs[j]
      /* with the i open, everything must still clear everything: the lifted name
         against the header, and the card against the name and the buttons.
         Only the card resting on its own caption row is allowed. */
      if (withInfo && [a.sel, b.sel].includes('.ki-show-info') && [a.sel, b.sel].some(s => s === '.ki-show-cap' || s === '.ki-show-dots' || s === '.ki-show-nav')) continue
      const ox = Math.min(a.r, b.r) - Math.max(a.l, b.l), oy = Math.min(a.b, b.b) - Math.max(a.t, b.t)
      if (ox > 0 && oy > 0) hits.push(`${a.sel} × ${b.sel}`)
    }
    const offscreen = bs.filter(x => x.l < -1 || x.r > innerWidth + 1 || x.t < -1 || x.b > innerHeight + 1).map(x => x.sel)
    const dots = box('.ki-show-dots'), cap = box('.ki-show-cap'), pill = box('.ki-newest')
    const gap = (a, b) => a && b ? Math.round(Math.max(0, Math.max(a.t, b.t) - Math.min(a.b, b.b)) + Math.max(0, Math.max(a.l, b.l) - Math.min(a.r, b.r))) : null
    const nav = box('.ki-nav-mark'), cta = box('.ki-show-cta'), name = box('.ki-show-name')
    return { hits, offscreen, dotsToCap: gap(dots, cap), dotsToPill: gap(dots, pill), pillBelowNav: pill && nav ? Math.round(pill.t - nav.b) : null, pillToName: pill && name ? Math.round(name.t - pill.b) : null, ctaToBar: cta && cap ? Math.round(cap.t - cta.b) : null }
  }, withInfo)
  const base = await check(false)
  await p.click('.ki-show-i'); await new Promise(r => setTimeout(r, 800))
  const info = await check(true)
  await p.screenshot({ path: `${out}-${w}x${h}-info.png` })
  await p.click('.ki-show-i'); await new Promise(r => setTimeout(r, 300))
  await p.screenshot({ path: `${out}-${w}x${h}.png` })
  const bad = base.hits.length || base.offscreen.length || info.hits.length || (base.dotsToPill !== null && base.dotsToCap !== null && base.dotsToPill <= base.dotsToCap) || (base.pillToName !== null && base.pillToName < 16) || (base.ctaToBar !== null && base.ctaToBar < 16)
  if (bad) fails++
  console.log(`${bad ? 'FAIL' : 'ok  '} ${w}x${h}`, JSON.stringify({ ...base, infoHits: info.hits }))
  await p.close()
}
await br.close()
console.log(fails ? `${fails} viewport(s) failed` : 'all viewports clean')
