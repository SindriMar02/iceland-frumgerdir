/* Gluggar gate — verifies the ported design against the handoff spec AND
 * against our verified content (the prototype shipped placeholder copy). */
import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

const URL = process.env.NA_URL || 'http://localhost:5199/preview/naustid'
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/02537dce-6838-4208-8842-7378d05ae886/scratchpad/gluggar-gate'
fs.mkdirSync(OUT, { recursive: true })
const log = []
const say = (...a) => { const s = a.join(' '); log.push(s); console.log(s) }

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--no-sandbox'],
})

const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 120000 })
await page.evaluate(() => document.fonts.ready)

/* ── 1 · PRELOADER ─────────────────────────────────────────────────────── */
const preEarly = await page.evaluate(() => {
  const p = document.querySelector('[data-preloader]')
  return { display: p ? getComputedStyle(p).display : null, count: document.querySelector('[data-preloader-count]')?.textContent }
})
await new Promise((r) => setTimeout(r, 3800))
const preLate = await page.evaluate(() => {
  const p = document.querySelector('[data-preloader]')
  return { display: p ? getComputedStyle(p).display : null, count: document.querySelector('[data-preloader-count]')?.textContent }
})
say('── PRELOADER ──')
say('early:', JSON.stringify(preEarly), '→ late:', JSON.stringify(preLate))
say('curtain left  :', preLate.display === 'none' ? 'PASS' : 'FAIL')
say('counter hit100:', preLate.count === '100' ? 'PASS' : `FAIL (${preLate.count})`)

/* ── 2 · CONTENT — our verified facts, not the prototype's ─────────────── */
const txt = await page.evaluate(() => document.querySelector('#na-root').innerText)
say('')
say('── CONTENT (verified vs prototype placeholders) ──')
const must = [
  ['hours 11:30–21:30', /11:30[–-]21:30/],
  ['no prototype hours 12:00–21:00', /12:00[–-]21:00/, true],
  ['real dish Plokkfiskur', /Plokkfiskur/],
  ['real dish Rabarbaragrautur', /Rabarbaragrautur/],
  ['no invented Humarsúpa', /Humarsúpa/, true],
  ['no invented Fiskispjót', /Fiskispjót/, true],
  ['real quote (Sluurpy)', /Sluurpy/],
  ['no prototype TripAdvisor stand-in quote', /Ósvikin og notaleg/, true],
  ['story: tvær mágkonur', /mágkonur/],
  ['no "family from the start" claim', /fylgt fjölskyldunni frá upphafi/, true],
  ['no harbour-slab claim', /hvalir úti á flóa/, true],
  ['menu honesty note', /breytist eftir árstíð/],
  ['prototype self-描 hero sub gone', /situr bak við glugga/, true],
]
let cfail = 0
for (const [label, re, mustNotMatch] of must) {
  const hit = re.test(txt)
  const ok = mustNotMatch ? !hit : hit
  if (!ok) cfail++
  say(`  ${ok ? 'PASS' : 'FAIL'}  ${label}`)
}
say('content failures:', cfail)

/* ── 3 · JOURNEY ───────────────────────────────────────────────────────── */
const geo = await page.evaluate(() => {
  const track = document.querySelector('[data-track]')
  const wrap = document.querySelector('[data-journey]')
  return {
    trackW: track.scrollWidth,
    travel: track.scrollWidth - innerWidth,
    wrapTop: wrap.offsetTop,
    wrapH: Math.round(wrap.getBoundingClientRect().height),
    panels: [...track.children].map((p) => ({ slab: p.dataset.panel === 'slab', left: p.offsetLeft, w: Math.round(p.offsetWidth) })),
  }
})
say('')
say('── JOURNEY ──')
say('track', geo.trackW, '· travel', geo.travel, '· wrapper height', geo.wrapH, '(expect travel+900 =', geo.travel + 900, ')')
say('panels:', JSON.stringify(geo.panels))

const wheelTo = async (target, tol = 8) => {
  await page.mouse.move(720, 450)
  let guard = 0, stalled = 0, prev = -1
  for (;;) {
    const y = await page.evaluate(() => window.scrollY)
    const d = target - y
    if (Math.abs(d) <= tol || guard++ > 700) break
    if (y === prev && ++stalled > 14) break
    if (y !== prev) stalled = 0
    prev = y
    await page.mouse.wheel({ deltaY: Math.max(-650, Math.min(650, d)) })
    await new Promise((r) => setTimeout(r, 16))
  }
  /* scrubLerp 0.08 needs time to converge */
  await new Promise((r) => setTimeout(r, 1600))
  return page.evaluate(() => Math.round(window.scrollY))
}
const trackX = () => page.evaluate(() => Math.round(new DOMMatrixReadOnly(getComputedStyle(document.querySelector('[data-track]')).transform).m41))
const progW = () => page.evaluate(() => +new DOMMatrixReadOnly(getComputedStyle(document.querySelector('[data-progress]')).transform).a.toFixed(3))

const xs = []
for (const f of [0, 0.25, 0.5, 0.75, 1]) {
  await wheelTo(geo.wrapTop + geo.travel * f)
  xs.push({ x: await trackX(), p: await progW() })
}
say('track x    :', JSON.stringify(xs.map((s) => s.x)))
say('progress   :', JSON.stringify(xs.map((s) => s.p)))
const moved = Math.abs(xs[4].x - xs[0].x)
say('traverses  :', moved > geo.travel * 0.85 ? 'PASS' : 'FAIL', `(${moved} of ${geo.travel})`)
say('monotonic  :', xs.every((s, i) => i === 0 || s.x <= xs[i - 1].x + 3) ? 'PASS' : 'FAIL')
say('progress→1 :', xs[4].p > 0.9 ? 'PASS' : `FAIL (${xs[4].p})`)

/* ── 4 · WINDOW DRIFT — move, return, and never bleed ──────────────────── */
const readWins = () =>
  page.evaluate(() =>
    [...document.querySelectorAll('.na-win')].map((w) => {
      const host = w.parentElement
      const m = new DOMMatrixReadOnly(getComputedStyle(w).transform)
      const hr = host.getBoundingClientRect(), wr = w.getBoundingClientRect()
      return {
        tx: Math.round(m.m41 * 100) / 100,
        overL: Math.round((hr.left - wr.left) * 10) / 10,
        overR: Math.round((wr.right - hr.right) * 10) / 10,
        drift: Number(w.dataset.win),
      }
    }),
  )
say('')
say('── WINDOW DRIFT ──')
const nWins = (await readWins()).length
const dres = []
for (let i = 0; i < nWins; i++) {
  const tgt = await page.evaluate((idx) => {
    const w = document.querySelectorAll('.na-win')[idx]
    const panel = w.closest('[data-panel]')
    if (!panel) return null
    const track = document.querySelector('[data-track]')
    const travel = track.scrollWidth - innerWidth
    return { travel, centre: Math.max(0, Math.min(travel, panel.offsetLeft + panel.offsetWidth / 2 - innerWidth / 2)) }
  }, i)
  if (!tgt) { dres.push(null); continue }
  const toY = (px) => geo.wrapTop + Math.max(0, Math.min(tgt.travel, px))
  const ya = await wheelTo(toY(tgt.centre - 300)); const a = (await readWins())[i]
  const yb = await wheelTo(toY(tgt.centre + 300)); const b = (await readWins())[i]
  const yc = await wheelTo(toY(tgt.centre - 300)); const c = (await readWins())[i]
  dres.push({ i, drift: a.drift, a: a.tx, b: b.tx, back: c.tx, ys: [ya, yb, yc], over: Math.min(a.overL, a.overR, b.overL, b.overR) })
}
let mv = 0, rt = 0, bled = 0, counted = 0
for (const r of dres) {
  if (!r) continue
  counted++
  const didMove = Math.abs(r.b - r.a) > 3
  const scrollReturned = Math.abs(r.ys[2] - r.ys[0]) <= 12
  const didReturn = Math.abs(r.back - r.a) < 3
  if (didMove) mv++
  if (didReturn) rt++
  if (r.over < 0) bled++
  say(`win ${r.i} d=${r.drift} : ${r.a} → ${r.b} → ${r.back}  ${didMove ? 'MOVED' : 'static'} ${didReturn ? 'RETURNED' : scrollReturned ? 'DRIFTED' : 'scroll-did-not-return'}  overhang ${r.over}px`)
}
say(`moved ${mv}/${counted} · returned ${rt}/${counted} · edge-bleed ${bled} ${bled === 0 ? 'PASS' : 'FAIL'}`)

/* ── 5 · MASKS + STACK ─────────────────────────────────────────────────── */
await wheelTo(geo.wrapTop + geo.travel)
const masks = await page.evaluate(() => {
  const all = [...document.querySelectorAll('.na-mask')]
  const seen = all.filter((e) => { const r = e.getBoundingClientRect(); return r.left < innerWidth && r.right > 0 && r.top < innerHeight && r.bottom > 0 })
  const stuck = seen.filter((e) => new DOMMatrixReadOnly(getComputedStyle(e).transform).m42 > 4)
  return { total: all.length, seen: seen.length, stuck: stuck.length, txt: stuck.slice(0, 3).map((e) => e.textContent.trim().slice(0, 28)) }
})
say('')
say('── MASKS ──')
say('masks', masks.total, '· in view', masks.seen, '· still hidden', masks.stuck, masks.stuck === 0 ? 'PASS' : 'FAIL ' + JSON.stringify(masks.txt))

const docH = await page.evaluate(() => document.documentElement.scrollHeight)
await wheelTo(docH - 1400)
const stack = await page.evaluate(() => {
  const u = document.querySelector('[data-stack-under]')
  const m = new DOMMatrixReadOnly(getComputedStyle(u).transform)
  return { scale: +m.a.toFixed(3), opacity: +getComputedStyle(u).opacity }
})
say('')
say('── STICKY-STACK CLOSE ──')
say('under-section scale', stack.scale, '· opacity', stack.opacity, stack.scale < 0.999 && stack.opacity < 0.999 ? 'PASS (receding)' : 'FAIL')

/* ── 6 · FPS across the journey ────────────────────────────────────────── */
await wheelTo(geo.wrapTop + 40)
await page.evaluate(() => { window.__f = []; let l = performance.now(); window.__s = false
  const t = (n) => { window.__f.push(n - l); l = n; if (!window.__s) requestAnimationFrame(t) }; requestAnimationFrame(t) })
for (let i = 0; i < 110; i++) { await page.mouse.wheel({ deltaY: 220 }); await new Promise((r) => setTimeout(r, 16)) }
const fps = await page.evaluate(() => {
  window.__s = true
  const f = window.__f.filter((x) => x > 0 && x < 500).sort((a, b) => a - b)
  const pct = (p) => Math.round(f[Math.floor(f.length * p)] * 10) / 10
  return { avg: Math.round(1000 / (f.reduce((a, b) => a + b, 0) / f.length) * 10) / 10, p95: pct(0.95), worst: Math.round(f[f.length - 1]), janky: Math.round(f.filter((x) => x > 20).length / f.length * 1000) / 10, n: f.length }
})
say('')
say('── FPS ──')
say(`avg ${fps.avg} · p95 ${fps.p95}ms · worst ${fps.worst}ms · >20ms ${fps.janky}%  (${fps.n} frames)`)

/* ── 7 · LANGUAGE TOGGLE ───────────────────────────────────────────────── */
await page.evaluate(() => window.scrollTo(0, 0))
await new Promise((r) => setTimeout(r, 600))
const langBefore = await page.evaluate(() => document.documentElement.lang)
await page.evaluate(() => [...document.querySelectorAll('#na-root button')].find((b) => /^(EN|ÍS)$/.test(b.textContent.trim()))?.click())
await new Promise((r) => setTimeout(r, 700))
const langAfter = await page.evaluate(() => ({
  lang: document.documentElement.lang,
  hasEN: /Book a table/.test(document.querySelector('#na-root').innerText),
  hoursStill: /11:30[–-]21:30/.test(document.querySelector('#na-root').innerText),
}))
say('')
say('── LANGUAGE ──')
say(`lang ${langBefore} → ${langAfter.lang} · EN copy present ${langAfter.hasEN ? 'PASS' : 'FAIL'} · hours unchanged ${langAfter.hoursStill ? 'PASS' : 'FAIL'}`)

/* ── 8 · REDUCED MOTION + MOBILE ───────────────────────────────────────── */
const rp = await browser.newPage()
await rp.setViewport({ width: 1440, height: 900 })
await rp.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await rp.goto(URL, { waitUntil: 'networkidle0', timeout: 120000 })
await rp.evaluate(() => document.fonts.ready)
await new Promise((r) => setTimeout(r, 2200))
const rm = await rp.evaluate(() => ({
  pre: getComputedStyle(document.querySelector('[data-preloader]')).display,
  stuckMasks: [...document.querySelectorAll('.na-mask')].filter((e) => new DOMMatrixReadOnly(getComputedStyle(e).transform).m42 > 2).length,
  stuckFades: [...document.querySelectorAll('.na-fade')].filter((e) => +getComputedStyle(e).opacity < 1).length,
  drifted: [...document.querySelectorAll('.na-win')].filter((e) => getComputedStyle(e).transform !== 'none').length,
  trackDir: getComputedStyle(document.querySelector('[data-track]')).flexDirection,
  stackPos: getComputedStyle(document.querySelector('[data-stack-under]')).position,
}))
say('')
say('── REDUCED MOTION ──')
say('preloader hidden', rm.pre === 'none' ? 'PASS' : 'FAIL')
say('stranded masks', rm.stuckMasks, rm.stuckMasks === 0 ? 'PASS' : 'FAIL')
say('stranded fades', rm.stuckFades, rm.stuckFades === 0 ? 'PASS' : 'FAIL')
say('drifted windows', rm.drifted, rm.drifted === 0 ? 'PASS' : 'FAIL')
say('track stacked', rm.trackDir, rm.trackDir === 'column' ? 'PASS' : 'FAIL')
say('stack un-stuck', rm.stackPos, rm.stackPos === 'relative' ? 'PASS' : 'FAIL')
await rp.screenshot({ path: OUT + '/reduced.png', fullPage: true })
await rp.close()

const mp = await browser.newPage()
await mp.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await mp.goto(URL, { waitUntil: 'networkidle0', timeout: 120000 })
await mp.evaluate(() => document.fonts.ready)
await new Promise((r) => setTimeout(r, 4200))
const mob = await mp.evaluate(() => {
  const tr = document.querySelector('[data-track]')
  const cs = getComputedStyle(tr)
  return {
    overflowX: cs.overflowX, snap: cs.scrollSnapType,
    viewPos: getComputedStyle(document.querySelector('[data-journey-view]')).position,
    hint: getComputedStyle(document.querySelector('[data-swipe-hint]')).display,
    hOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    panelW: Math.round(tr.children[0].getBoundingClientRect().width),
  }
})
say('')
say('── MOBILE 390 ──')
say('rail overflowX', mob.overflowX, '· snap', mob.snap, mob.overflowX === 'auto' && mob.snap.includes('mandatory') ? 'PASS' : 'FAIL')
say('view not pinned', mob.viewPos, mob.viewPos === 'relative' ? 'PASS' : 'FAIL')
say('swipe hint shown', mob.hint, mob.hint !== 'none' ? 'PASS' : 'FAIL')
say('page h-overflow', mob.hOverflow, mob.hOverflow <= 0 ? 'PASS' : 'FAIL')
say('first panel width', mob.panelW, '(≈90vw = 351)')
await mp.screenshot({ path: OUT + '/mobile.png' })
await mp.close()

fs.writeFileSync(OUT + '/gate.txt', log.join('\n'))
await browser.close()
console.log('\nartifacts in', OUT)
