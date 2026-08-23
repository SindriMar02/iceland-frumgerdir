/* Motion gate for the Naustið rebuild.
 *
 * Proves the two transplanted machines actually run, using the verification
 * method each spec demands:
 *  · Heklusýn — a frame must MOVE and RETURN, and its overhang must stay
 *    positive at every sample (that is the edge-bleed bug --dz prevents).
 *    Off-screen frames are skipped by the loop, so each frame is brought to
 *    viewport/panel centre before sampling, never sampled at fixed depths.
 *  · Búðir — Lenis consumes wheel, not scrollTo, so the journey is driven
 *    with real page.mouse.wheel in <=700px steps and settled for scrub:1.
 */
import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

const URL = process.env.NA_URL || 'http://localhost:5199/preview/naustid'
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/02537dce-6838-4208-8842-7378d05ae886/scratchpad/naustid-motion'
fs.mkdirSync(OUT, { recursive: true })
const log = []
const say = (...a) => { const s = a.join(' '); log.push(s); console.log(s) }

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--no-sandbox'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 120000 })
await page.evaluate(() => document.fonts.ready)
await new Promise((r) => setTimeout(r, 3000))

/* Tolerance matters: the pin maps 1px of scroll to 1px of track travel, so a
 * loose tolerance here shows up directly as "the frame did not return". */
const wheelTo = async (targetY, tol = 6) => {
  let guard = 0
  let stalled = 0
  let prev = -1
  /* The wheel event goes to whatever is under the cursor, which defaults to
   * (0,0) — the fixed chrome. Downward scrolling happened to work there;
   * upward silently did not, which read as "the frame never returned". */
  await page.mouse.move(720, 450)
  for (;;) {
    const y = await page.evaluate(() => window.scrollY)
    const d = targetY - y
    if (Math.abs(d) <= tol || guard++ > 600) break
    if (y === prev && ++stalled > 12) break
    if (y !== prev) stalled = 0
    prev = y
    await page.mouse.wheel({ deltaY: Math.max(-700, Math.min(700, d)) })
    await new Promise((r) => setTimeout(r, 16))
  }
  await new Promise((r) => setTimeout(r, 1100)) // settle scrub:1
  return page.evaluate(() => Math.round(window.scrollY))
}

/* ── 1 · JOURNEY: does the track actually traverse? ─────────────────────── */
say('── BÚÐIR JOURNEY ──')
const geo = await page.evaluate(() => {
  const track = document.querySelector('#na-root .na-track')
  const wrap = document.querySelector('#na-root .na-journey')
  return {
    trackW: track.scrollWidth,
    maxX: track.scrollWidth - innerWidth,
    wrapTop: wrap.getBoundingClientRect().top + scrollY,
    panels: [...track.querySelectorAll('.na-panel')].map((p) => ({ cls: p.className.replace('na-panel ', ''), left: p.offsetLeft, w: Math.round(p.offsetWidth) })),
    display: getComputedStyle(track).display,
  }
})
say('track width     :', geo.trackW, '· maxX', geo.maxX, '· track display', geo.display)
say('panels          :', JSON.stringify(geo.panels))

const trackX = () =>
  page.evaluate(() => {
    const m = new DOMMatrixReadOnly(getComputedStyle(document.querySelector('#na-root .na-track')).transform)
    return Math.round(m.m41)
  })

const samples = []
for (const f of [0, 0.25, 0.5, 0.75, 1]) {
  await wheelTo(geo.wrapTop + geo.maxX * f)
  samples.push({ f, x: await trackX() })
}
say('track x at 0/.25/.5/.75/1 of the pin:', JSON.stringify(samples.map((s) => s.x)))
const monotonic = samples.every((s, i) => i === 0 || s.x <= samples[i - 1].x + 2)
const travelled = Math.abs(samples[samples.length - 1].x - samples[0].x)
say('traverses       :', travelled > geo.maxX * 0.8 ? 'PASS' : 'FAIL', `(moved ${travelled}px of ${geo.maxX})`)
say('monotonic       :', monotonic ? 'PASS' : 'FAIL')

/* screenshots across the journey */
for (const [name, f] of [['j0', 0], ['j1', 0.22], ['j2', 0.45], ['j3', 0.68], ['j4', 0.9]]) {
  await wheelTo(geo.wrapTop + geo.maxX * f)
  await page.screenshot({ path: `${OUT}/${name}.png` })
}

/* ── 2 · HEKLUSÝN DRIFT: move + return + overhang, per frame ───────────── */
say('')
say('── HEKLUSÝN DRIFT ──')
const frameProbe = await page.evaluate(() => {
  window.__frames = [...document.querySelectorAll('#na-root .na-frame')].map((f, i) => {
    const inner = f.querySelector('.na-frame-in')
    return { i, onJourney: !!f.closest('.na-track'), h: Math.round(f.getBoundingClientRect().height) }
  })
  return window.__frames
})
const readFrames = () =>
  page.evaluate(() =>
    [...document.querySelectorAll('#na-root .na-frame')].map((f) => {
      const inner = f.querySelector('.na-frame-in')
      const m = new DOMMatrixReadOnly(getComputedStyle(inner).transform)
      const fr = f.getBoundingClientRect()
      const ir = inner.getBoundingClientRect()
      return {
        ty: Math.round(m.m42 * 100) / 100,
        tx: Math.round(m.m41 * 100) / 100,
        overTop: Math.round((fr.top - ir.top) * 10) / 10,
        overBottom: Math.round((ir.bottom - fr.bottom) * 10) / 10,
        overLeft: Math.round((fr.left - ir.left) * 10) / 10,
        overRight: Math.round((ir.right - fr.right) * 10) / 10,
      }
    }),
  )

/* Bring each frame to centre, then sample either side of centre. */
const results = []
for (let i = 0; i < frameProbe.length; i++) {
  const f = frameProbe[i]
  if (f.onJourney) {
    // horizontal drift: park the panel so this frame is near viewport centre
    /* wrapTop MUST come from the pre-scroll measurement: while the journey is
     * pinned its rect.top is 0 and scrollY is large, so recomputing it here
     * returns the current scroll position and sends the probe past the pin. */
    const target = await page.evaluate((idx) => {
      const fr = document.querySelectorAll('#na-root .na-frame')[idx]
      const panel = fr.closest('.na-panel')
      const track = document.querySelector('#na-root .na-track')
      const maxX = track.scrollWidth - innerWidth
      const centreX = panel.offsetLeft + panel.offsetWidth / 2 - innerWidth / 2
      return { maxX, centre: Math.max(0, Math.min(maxX, centreX)) }
    }, i)
    target.wrapTop = geo.wrapTop
    const toY = (px) => target.wrapTop + Math.max(0, Math.min(target.maxX, px))
    const ya = await wheelTo(toY(target.centre - 260))
    const a = (await readFrames())[i]
    const yb = await wheelTo(toY(target.centre + 260))
    const b = (await readFrames())[i]
    const yc = await wheelTo(toY(target.centre - 260))
    const c = (await readFrames())[i]
    results.push({ i, axis: 'x', a: a.tx, b: b.tx, back: c.tx, ys: [ya, yb, yc], over: Math.min(a.overLeft, a.overRight, b.overLeft, b.overRight) })
  } else {
    const centre = await page.evaluate((idx) => {
      const fr = document.querySelectorAll('#na-root .na-frame')[idx]
      const r = fr.getBoundingClientRect()
      return r.top + scrollY + r.height / 2 - innerHeight / 2
    }, i)
    const ya = await wheelTo(Math.max(0, centre - 260))
    const a = (await readFrames())[i]
    const yb = await wheelTo(Math.max(0, centre + 260))
    const b = (await readFrames())[i]
    const yc = await wheelTo(Math.max(0, centre - 260))
    const c = (await readFrames())[i]
    results.push({ i, axis: 'y', a: a.ty, b: b.ty, back: c.ty, ys: [ya, yb, yc], over: Math.min(a.overTop, a.overBottom, b.overTop, b.overBottom) })
  }
}
let moved = 0, returned = 0, bled = 0
for (const r of results) {
  const didMove = Math.abs(r.b - r.a) > 3
  const didReturn = Math.abs(r.back - r.a) < 3
  if (didMove) moved++
  if (didReturn) returned++
  if (r.over < 0) bled++
  say(
    `frame ${String(r.i).padStart(2)} (${r.axis}) : ${String(r.a).padStart(8)} -> ${String(r.b).padStart(8)} -> ${String(r.back).padStart(8)}  ` +
    `${didMove ? 'MOVED' : 'static'} ${didReturn ? 'RETURNED' : 'DRIFTED'}  overhang ${r.over}px  scrollY ${JSON.stringify(r.ys)}`,
  )
}
say(`moved ${moved}/${results.length} · returned ${returned}/${results.length} · edge-bleed ${bled} ${bled === 0 ? 'PASS' : 'FAIL'}`)

/* ── 3 · TEXT MASK REVEAL ─────────────────────────────────────────────── */
say('')
say('── TEXT MASK ──')
const masks = await page.evaluate(() => {
  const all = [...document.querySelectorAll('#na-root .na-mask-in')]
  const inView = all.filter((el) => {
    const r = el.getBoundingClientRect()
    return r.top < innerHeight && r.bottom > 0 && r.left < innerWidth && r.right > 0
  })
  const stuck = inView.filter((el) => {
    const m = new DOMMatrixReadOnly(getComputedStyle(el).transform)
    return m.m42 > 4
  })
  return {
    total: all.length,
    inView: inView.length,
    stuck: stuck.length,
    stuckText: stuck.slice(0, 4).map((e) => e.textContent.trim().slice(0, 30)),
    headroom: (() => { const w = document.querySelector('#na-root .na-mask'); return w ? getComputedStyle(w).paddingBottom : null })(),
  }
})
say('mask elements   :', masks.total, '· in view', masks.inView, '· still hidden', masks.stuck, masks.stuck === 0 ? 'PASS' : 'FAIL')
if (masks.stuck) say('  stuck:', JSON.stringify(masks.stuckText))
say('mask headroom   :', masks.headroom)

/* ── 4 · FPS across the journey (Búðir §13 method) ─────────────────────── */
say('')
say('── FPS ACROSS THE JOURNEY ──')
await wheelTo(geo.wrapTop + 40)
await page.evaluate(() => {
  window.__f = []
  let last = performance.now()
  window.__stop = false
  const t = (now) => { window.__f.push(now - last); last = now; if (!window.__stop) requestAnimationFrame(t) }
  requestAnimationFrame(t)
})
for (let i = 0; i < 110; i++) {
  await page.mouse.wheel({ deltaY: 220 })
  await new Promise((r) => setTimeout(r, 16))
}
const fps = await page.evaluate(() => {
  window.__stop = true
  const f = window.__f.filter((x) => x > 0 && x < 500).sort((a, b) => a - b)
  const pct = (p) => Math.round(f[Math.floor(f.length * p)] * 10) / 10
  return { n: f.length, avg: Math.round((1000 / (f.reduce((a, b) => a + b, 0) / f.length)) * 10) / 10, p95: pct(0.95), worst: Math.round(f[f.length - 1]), janky: Math.round((f.filter((x) => x > 20).length / f.length) * 1000) / 10 }
})
say(`avg ${fps.avg} fps · p95 ${fps.p95}ms · worst ${fps.worst}ms · janky(>20ms) ${fps.janky}%  (${fps.n} frames)`)

/* ── 5 · REDUCED MOTION ───────────────────────────────────────────────── */
const rp = await browser.newPage()
await rp.setViewport({ width: 1440, height: 900 })
await rp.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await rp.goto(URL, { waitUntil: 'networkidle0', timeout: 120000 })
await rp.evaluate(() => document.fonts.ready)
await new Promise((r) => setTimeout(r, 2500))
const rm = await rp.evaluate(() => ({
  hiddenMasks: [...document.querySelectorAll('#na-root .na-mask-in')].filter((e) => new DOMMatrixReadOnly(getComputedStyle(e).transform).m42 > 2).length,
  hiddenLifts: [...document.querySelectorAll('#na-root .na-lift')].filter((e) => +getComputedStyle(e).opacity < 1).length,
  driftedFrames: [...document.querySelectorAll('#na-root .na-frame-in')].filter((e) => getComputedStyle(e).transform !== 'none').length,
  trackDisplay: getComputedStyle(document.querySelector('#na-root .na-track')).display,
  docH: document.documentElement.scrollHeight,
}))
say('')
say('── REDUCED MOTION ──')
say('stranded masks  :', rm.hiddenMasks, rm.hiddenMasks === 0 ? 'PASS' : 'FAIL')
say('stranded lifts  :', rm.hiddenLifts, rm.hiddenLifts === 0 ? 'PASS' : 'FAIL')
say('drifted frames  :', rm.driftedFrames, rm.driftedFrames === 0 ? 'PASS' : 'FAIL')
say('track display   :', rm.trackDisplay, rm.trackDisplay === 'block' ? 'PASS (stacked)' : 'FAIL')
say('doc height      :', rm.docH)
await rp.screenshot({ path: OUT + '/reduced-full.png', fullPage: true })

fs.writeFileSync(OUT + '/gate.txt', log.join('\n'))
await browser.close()
console.log('\nartifacts in', OUT)
