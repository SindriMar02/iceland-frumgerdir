import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

const URL = process.env.NA_URL || 'http://localhost:5199/preview/naustid'
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/02537dce-6838-4208-8842-7378d05ae886/scratchpad/naustid-mobile'
const CPU = Number(process.env.NA_CPU || 4)
fs.mkdirSync(OUT, { recursive: true })
const log = []
const say = (...a) => { const s = a.join(' '); log.push(s); console.log(s) }

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  userDataDir: OUT + '/profile',
  args: ['--no-sandbox'],
})
const page = await browser.newPage()
const cdp = await page.target().createCDPSession()

/* iPhone 14-class: 390x844 @3x, throttled CPU so we measure a real phone
 * rather than this Mac pretending to be one. */
await page.emulate({
  viewport: { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
})
await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU })

/* ── Network tally ──────────────────────────────────────────────────────── */
const assets = []
page.on('response', async (r) => {
  try {
    const h = r.headers()
    const len = Number(h['content-length'] || 0)
    const t = r.request().resourceType()
    if (['image', 'font', 'script', 'stylesheet', 'document'].includes(t)) {
      assets.push({ t, url: r.url().split('/').pop().split('?')[0].slice(0, 40), bytes: len })
    }
  } catch {}
})

/* ── Instrument BEFORE any page script runs ─────────────────────────────── */
await page.evaluateOnNewDocument(() => {
  window.__long = []
  window.__ls = 0
  try {
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__long.push(Math.round(e.duration))
    }).observe({ entryTypes: ['longtask'] })
  } catch {}
  try {
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) window.__ls += e.value
    }).observe({ type: 'layout-shift', buffered: true })
  } catch {}
  /* Count how often the rib canvases are actually re-rasterised. A redraw
   * mid-scroll is the expensive thing; one per size is fine. */
  window.__draws = 0
  const origGID = CanvasRenderingContext2D.prototype.getImageData
  CanvasRenderingContext2D.prototype.getImageData = function (...a) {
    window.__draws++
    return origGID.apply(this, a)
  }
})

const t0 = Date.now()
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 120000 })
await page.evaluate(() => document.fonts.ready)
const loadMs = Date.now() - t0
await new Promise((r) => setTimeout(r, 2500))

const boot = await page.evaluate(() => ({
  long: window.__long.slice(),
  draws: window.__draws,
  cls: Math.round(window.__ls * 1000) / 1000,
  lcp: (performance.getEntriesByType('largest-contentful-paint').pop() || {}).startTime || null,
  fcp: (performance.getEntriesByName('first-contentful-paint')[0] || {}).startTime || null,
  docH: document.documentElement.scrollHeight,
  canvases: document.querySelectorAll('#na-root canvas').length,
}))
say(`── LOAD (390x844 @3x, CPU x${CPU}) ──`)
say('goto+fonts      :', loadMs, 'ms')
say('FCP / LCP       :', Math.round(boot.fcp), '/', Math.round(boot.lcp), 'ms')
say('CLS             :', boot.cls, boot.cls < 0.1 ? 'PASS' : 'FAIL')
say('long tasks      :', boot.long.length, boot.long.length ? `worst ${Math.max(...boot.long)}ms · ${JSON.stringify(boot.long.slice(0, 10))}` : '')
say('canvas rasters  :', boot.draws, `(${boot.canvases} canvases on page)`)
say('doc height      :', boot.docH)

/* ── Scroll FPS: drive with touch-like wheel, sample rAF deltas ─────────── */
const scrollProbe = async (label, fromFrac, toFrac) => {
  await page.evaluate((f) => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * f), fromFrac)
  await new Promise((r) => setTimeout(r, 700))
  await page.evaluate(() => {
    window.__f = []
    window.__d0 = window.__draws
    let last = performance.now()
    window.__stop = false
    const tick = (t) => {
      window.__f.push(t - last)
      last = t
      if (!window.__stop) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
  const target = await page.evaluate((f) => (document.documentElement.scrollHeight - innerHeight) * f, toFrac)
  let guard = 0
  for (;;) {
    const y = await page.evaluate(() => window.scrollY)
    if (y >= target - 60 || guard++ > 160) break
    await page.mouse.wheel({ deltaY: 420 })
    await new Promise((r) => setTimeout(r, 16))
  }
  const res = await page.evaluate(() => {
    window.__stop = true
    const f = window.__f.filter((x) => x > 0 && x < 400).sort((a, b) => a - b)
    const pct = (p) => f.length ? Math.round(f[Math.floor(f.length * p)] * 10) / 10 : null
    return {
      frames: f.length,
      medianMs: pct(0.5),
      p95Ms: pct(0.95),
      worstMs: f.length ? Math.round(f[f.length - 1]) : null,
      janky: f.filter((x) => x > 32).length,
      draws: window.__draws - window.__d0,
      long: window.__long.length,
    }
  })
  const fps = res.medianMs ? Math.round(1000 / res.medianMs) : 0
  say(
    `${label.padEnd(16)}: ~${fps} fps (median ${res.medianMs}ms, p95 ${res.p95Ms}ms, worst ${res.worstMs}ms) · ` +
    `${res.janky}/${res.frames} frames >32ms · ${res.draws} canvas rasters mid-scroll`,
  )
  return res
}

say('')
say('── SCROLL PERFORMANCE ──')
const hero = await scrollProbe('hero scrub', 0, 0.14)
const mid = await scrollProbe('menu/cladding', 0.18, 0.45)
const tail = await scrollProbe('story→closing', 0.5, 0.95)

/* ── Layout audit at 390 ───────────────────────────────────────────────── */
await page.evaluate(() => window.scrollTo(0, 0))
await new Promise((r) => setTimeout(r, 600))
const layout = await page.evaluate(() => {
  const out = { overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, wide: [], small: [], tiny: [], overlap: [] }
  const vw = document.documentElement.clientWidth
  document.querySelectorAll('#na-root *').forEach((el) => {
    const r = el.getBoundingClientRect()
    if (r.width > vw + 1 && r.height > 4) {
      const s = getComputedStyle(el)
      if (s.position !== 'fixed' && el.tagName !== 'CANVAS')
        out.wide.push({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 40), w: Math.round(r.width) })
    }
  })
  document.querySelectorAll('#na-root a,#na-root button,#na-root input,#na-root textarea,#na-root summary').forEach((el) => {
    const r = el.getBoundingClientRect()
    if (r.width < 1 || r.height < 1) return
    if (r.height < 44 || r.width < 44) out.small.push({ t: (el.textContent || el.id || el.tagName).trim().slice(0, 24), w: Math.round(r.width), h: Math.round(r.height) })
  })
  document.querySelectorAll('#na-root p,#na-root span,#na-root li,#na-root dd,#na-root figcaption,#na-root label').forEach((el) => {
    if (el.childElementCount || !el.textContent.trim()) return
    const px = parseFloat(getComputedStyle(el).fontSize)
    if (px < 12) out.tiny.push({ t: el.textContent.trim().slice(0, 26), px: Math.round(px * 10) / 10 })
  })
  return out
})
say('')
say('── LAYOUT @390 ──')
say('horizontal overflow :', layout.overflow, layout.overflow <= 0 ? 'PASS' : 'FAIL')
say('elements wider than viewport :', layout.wide.length)
layout.wide.slice(0, 6).forEach((w) => say('   ', JSON.stringify(w)))
say('tap targets <44px   :', layout.small.length)
layout.small.slice(0, 10).forEach((s) => say('   ', JSON.stringify(s)))
say('text under 12px     :', layout.tiny.length)
layout.tiny.slice(0, 8).forEach((s) => say('   ', JSON.stringify(s)))

/* ── Bytes ─────────────────────────────────────────────────────────────── */
const byType = {}
for (const a of assets) byType[a.t] = (byType[a.t] || 0) + a.bytes
say('')
say('── NETWORK ──')
Object.entries(byType).sort((a, b) => b[1] - a[1]).forEach(([t, b]) => say(`${t.padEnd(12)}: ${(b / 1024).toFixed(0)} KB`))
say('images, largest first:')
assets.filter((a) => a.t === 'image' && a.bytes > 0).sort((a, b) => b.bytes - a.bytes).slice(0, 8)
  .forEach((a) => say(`    ${a.url.padEnd(30)} ${(a.bytes / 1024).toFixed(0)} KB`))

for (const [f, y] of [['m-hero', 0], ['m-menu', 0.24], ['m-story', 0.5], ['m-close', 0.92]]) {
  await page.evaluate((v) => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * v), y)
  await new Promise((r) => setTimeout(r, 900))
  await page.screenshot({ path: `${OUT}/${f}.png` })
}
await page.screenshot({ path: OUT + '/m-full.png', fullPage: true })

fs.writeFileSync(OUT + '/audit.txt', log.join('\n'))
fs.writeFileSync(OUT + '/raw.json', JSON.stringify({ boot, hero, mid, tail, layout, assets }, null, 2))
await browser.close()
console.log('\nartifacts in', OUT)
