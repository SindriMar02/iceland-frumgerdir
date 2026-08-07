/* Motion review for the three Airbnb builds.
 *
 * Four tables, measured — never asserted:
 *   LERP    Lenis damping: one wheel burst, sampled per rAF. A jump-cut page
 *           shows one delta then zero; a damped page shows a decaying ramp.
 *   SCROLL  Heklusýn drift (must MOVE and never bleed at the frame edge) plus
 *           each build's pinned scrub (traverse / draw / palette).
 *   REVEAL  IO-armed 'is-in': the class must arm AND a paint property must
 *           actually differ before/after ([[framer-reveals-unreliable]]).
 *   HOVER   pointer over each interactive target, property delta measured.
 *
 * Lenis consumes wheel, not scrollTo, so everything is driven with real
 * page.mouse.wheel from a cursor parked mid-viewport.
 */
import puppeteer from 'puppeteer-core'

/* ORIGIN override so the tables can be measured on localhost before a deploy
   as well as on the live pages after one. */
const O = process.env.ORIGIN || 'https://sindrimar02.github.io/iceland-frumgerdir'
const BUILDS = {
  lakeview:    { p: 'lv', url: O + '/preview/lakeview',    drift: '.lv-frame-drift' },
  mysticlight: { p: 'ml', url: O + '/preview/mysticlight', drift: '.ml-frame-in' },
  villanorth:  { p: 'vn', url: O + '/preview/villanorth',  drift: '.vn-frame-in' },
  laxfoss:     { p: 'lx', url: O + '/preview/laxfoss',     drift: '.lx-frame-in' },
  glasscottages:{ p: 'gc', url: O + '/preview/glasscottages', drift: '.gc-frame-in' },
  glasshouse:  { p: 'gh', url: O + '/preview/glasshouse',  drift: '.gh-frame-in' },
  svartaborg:  { p: 'sb', url: O + '/preview/svartaborg',  drift: '.sb-frame-in' },
}

const key = process.argv[2]
const B = BUILDS[key]
if (!B) { console.error('usage: motion-review.mjs <lakeview|mysticlight|villanorth>'); process.exit(1) }

const out = []
const say = (...a) => { const s = a.join(' '); out.push(s); console.log(s) }

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await page.goto(B.url, { waitUntil: 'networkidle0', timeout: 120000 })
await page.evaluate(() => document.fonts.ready)
await new Promise((r) => setTimeout(r, 3500))
await page.mouse.move(720, 450)

const wheelTo = async (targetY, tol = 8) => {
  let guard = 0, stalled = 0, prev = -1
  await page.mouse.move(720, 450)
  for (;;) {
    const y = await page.evaluate(() => window.scrollY)
    if (Math.abs(targetY - y) <= tol || guard++ > 700) break
    if (y === prev && ++stalled > 14) break
    if (y !== prev) stalled = 0
    prev = y
    await page.mouse.wheel({ deltaY: Math.max(-700, Math.min(700, targetY - y)) })
    await new Promise((r) => setTimeout(r, 16))
  }
  await new Promise((r) => setTimeout(r, 1200))
  return page.evaluate(() => Math.round(window.scrollY))
}

say(`\n████ ${key.toUpperCase()} — ${B.url}\n`)

/* Cold reveal state MUST be captured here, on the untouched page. Table 2's
   drift sweep scrolls the whole document, which arms every observer — capture
   after that and "before" is really "after", and every delta reads as zero. */
/* Per build, only the classes that are genuinely reveal-gated. .lv-hero-media
   carries no :not(.is-in) rule in Lakeview (it's Mystic Light's device), so
   including it there manufactures a phantom "never armed". */
const revealSel = key === 'lakeview'
  ? '.lv-rv, .lv-frame-reveal'
  : `.${B.p}-rv, .${B.p}-shot, .${B.p}-frame-reveal, .${B.p}-hero-media`
const COLD = await page.evaluate((sel) => {
  const els = Array.from(document.querySelectorAll(sel))
  /* A node counts as revealed if it carries is-in itself, OR sits under an
     armed ancestor (.lv-frame-reveal is driven by its .lv-rv parent, never
     observed directly), OR has is-settled (only added on a real
     mask-position transitionend, so it is proof the reveal ran). */
  const armed = (e) => e.classList.contains('is-in') || e.classList.contains('is-settled') || !!e.closest('.is-in')
  const cold = els.filter((e) => !armed(e))
  cold.forEach((e, i) => e.setAttribute('data-mr-cold', String(i)))
  const read = (e) => {
    const img = e.querySelector('img') || e
    const cs = getComputedStyle(img)
    return { cls: e.className.split(' ')[0], mask: (cs.webkitMaskPosition || cs.maskPosition || 'none').slice(0, 20), clip: (cs.clipPath || 'none').slice(0, 22), filter: cs.filter.slice(0, 18), op: cs.opacity, tf: cs.transform === 'none' ? 'none' : 'set' }
  }
  return { total: els.length, armed: els.length - cold.length, pick: cold.slice(0, 4).map(read) }
}, revealSel)

/* ─────────────────────────────── 1 · LERP ─────────────────────────────── */
say('┌─ TABLE 1 · LERP (Lenis wheel damping) ─────────────────────────────')
await wheelTo(0)
const trace = await page.evaluate(() => new Promise((res) => {
  const s = []
  let n = 0
  const step = () => { s.push(Math.round(window.scrollY * 100) / 100); if (++n < 70) requestAnimationFrame(step); else res(s) }
  requestAnimationFrame(step)
  window.dispatchEvent(new WheelEvent('wheel', { deltaY: 600, bubbles: true, cancelable: true }))
}))
const deltas = trace.slice(1).map((v, i) => Math.round((v - trace[i]) * 100) / 100).filter((d) => d !== 0)
const distinct = new Set(trace).size
const settleFrames = trace.findIndex((v, i) => i > 4 && v === trace[trace.length - 1])
say(`  distinct scrollY values in 70 frames : ${distinct}   ${distinct >= 12 ? '✓ damped' : '✗ jump-cut'}`)
say(`  first 8 per-frame deltas (px)        : ${deltas.slice(0, 8).join(', ')}`)
say(`  delta decays (max→last non-zero)     : ${deltas.length ? `${Math.max(...deltas.map(Math.abs))} → ${Math.abs(deltas[deltas.length - 1])}` : 'n/a'}`)
say(`  frames to settle                     : ${settleFrames > 0 ? settleFrames : '>70'}`)
say(`  total travel for one 600px burst     : ${Math.round((trace[trace.length - 1] - trace[0]) * 10) / 10}px`)
say('└────────────────────────────────────────────────────────────────────\n')

/* ────────────────────────────── 2 · SCROLL ────────────────────────────── */
say('┌─ TABLE 2 · SCROLL (Heklusýn drift + pinned scrub) ─────────────────')
const frameCount = await page.evaluate((sel) => document.querySelectorAll(sel).length, B.drift)
say(`  drift frames on page (${B.drift}) : ${frameCount}`)

const idxs = Array.from({ length: Math.min(frameCount, 6) }, (_, i) => Math.floor(i * frameCount / Math.min(frameCount, 6)))
say('')
say('  frame │ Δ translateY across 3 depths │ min edge gap (px, must be ≤0) │ verdict')
say('  ──────┼──────────────────────────────┼───────────────────────────────┼────────')
let driftPass = 0, driftBleed = 0
for (const i of idxs) {
  const home = await page.evaluate((sel, i) => {
    const el = document.querySelectorAll(sel)[i]
    if (!el) return null
    const f = el.closest('[class*="frame"]') || el.parentElement
    const r = f.getBoundingClientRect()
    return Math.round(window.scrollY + r.top + r.height / 2 - window.innerHeight / 2)
  }, B.drift, i)
  if (home == null) continue
  const samples = []
  for (const off of [-320, 0, 320]) {
    await wheelTo(Math.max(0, home + off))
    const s = await page.evaluate((sel, i) => {
      const inner = document.querySelectorAll(sel)[i]
      const frame = inner.closest('[class*="frame"]') || inner.parentElement
      const ir = inner.getBoundingClientRect(), fr = frame.getBoundingClientRect()
      const m = new DOMMatrixReadOnly(getComputedStyle(inner).transform)
      return { ty: Math.round(m.m42 * 100) / 100, gapTop: Math.round((ir.top - fr.top) * 10) / 10, gapBot: Math.round((fr.bottom - ir.bottom) * 10) / 10 }
    }, B.drift, i)
    samples.push(s)
  }
  const tys = samples.map((s) => s.ty)
  const range = Math.round((Math.max(...tys) - Math.min(...tys)) * 100) / 100
  const worstGap = Math.max(...samples.flatMap((s) => [s.gapTop, s.gapBot]))
  const moved = range > 1
  const bleeds = worstGap > 0.5
  if (moved && !bleeds) driftPass++
  if (bleeds) driftBleed++
  say(`  ${String(i).padStart(5)} │ ${String(range + 'px').padStart(28)} │ ${String(worstGap).padStart(29)} │ ${moved && !bleeds ? '✓' : moved ? '✗ EDGE BLEED' : '✗ static'}`)
}
say('')
say(`  drift verdict: ${driftPass}/${idxs.length} frames move and hold their edge${driftBleed ? `   ✗ ${driftBleed} bleeding` : ''}`)

// per-build pinned scrub
say('')
const scrub = await (async () => {
  if (key === 'mysticlight') {
    /* Geometry must be read with the section UNPINNED. Inside the pinned range
       GSAP has transformed the trigger, so scrollY + rect.top is not the
       document position and every later sample is offset by the pin distance. */
    await wheelTo(0)
    const geo = await page.evaluate(() => {
      const o = document.querySelector('.ml-sky-outer'), t = document.querySelector('.ml-sky-track')
      if (!o || !t) return null
      return { top: Math.round(window.scrollY + o.getBoundingClientRect().top), traverse: Math.round(t.scrollWidth - window.innerWidth) }
    })
    if (!geo) return '  pinned scrub: .ml-sky-outer not found ✗'
    const read = async (off) => { await wheelTo(geo.top + off); return page.evaluate(() => { const t = document.querySelector('.ml-sky-track'); return Math.round(new DOMMatrixReadOnly(getComputedStyle(t).transform).m41) }) }
    const a = await read(-200), b = await read(Math.round(geo.traverse * 0.5)), c = await read(geo.traverse + 40)
    const pinned = await page.evaluate(() => { const o = document.querySelector('.ml-sky-outer'); return getComputedStyle(o.parentElement).position })
    return [`  pinned journey (.ml-sky-track), traverse target ${geo.traverse}px`,
            `    track x at entry / mid / exit : ${a} → ${b} → ${c}`,
            `    travelled                     : ${Math.abs(c - a)}px  ${Math.abs(c - a) > geo.traverse * 0.85 ? '✓ full traverse' : '✗ short'}`,
            `    pin spacer present            : ${pinned === 'relative' ? '✓' : pinned}`].join('\n')
  }
  if (key === 'glasshouse') {
    await wheelTo(0)
    const top = await page.evaluate(() => { const w = document.querySelector('.gh-window'); return w ? Math.round(window.scrollY + w.getBoundingClientRect().top) : null })
    if (top == null) return '  pinned scrub: .gh-window not found ✗'
    const read = async (off) => { await wheelTo(top + off); return page.evaluate(() => {
      const st = document.querySelector('.gh-sky-stack'); const rel = document.querySelector('.gh-window-release')
      const m = new DOMMatrixReadOnly(getComputedStyle(st).transform)
      return { y: Math.round(m.m42), rel: Math.round((parseFloat(getComputedStyle(rel).opacity)||0)*100)/100 } }) }
    const a = await read(-200), b2 = await read(900), c = await read(1900), d = await read(2500)
    return ['  pinned WINDOW (.gh-sky-stack rides DOWN through the aperture)',
      `    stack y   : ${a.y} → ${b2.y} → ${c.y} → ${d.y}px  ${d.y > a.y ? '✓ travels down (inverted)' : '✗'}`,
      `    release   : ${a.rel} → ${d.rel}  ${a.rel < .05 && d.rel > .9 ? '✓ aurora takes the viewport' : '✗'}`].join('\n')
  }
  if (key === 'svartaborg') {
    await wheelTo(0)
    const read = async (y) => { await wheelTo(y); return page.evaluate(() => {
      const p2 = document.querySelector('.sb-clip-scale')
      const m = new DOMMatrixReadOnly(getComputedStyle(p2).transform)
      const wm = document.querySelector('.sb-wm')
      return { scale: Math.round(m.a*100)/100, wm: Math.round((parseFloat(getComputedStyle(wm).opacity)||0)*100)/100 } }) }
    const a = await read(0), b2 = await read(600), c = await read(1300)
    return ['  pinned FORM (.sb-clip-scale releases the silhouette)',
      `    clip scale: ${a.scale} → ${b2.scale} → ${c.scale}  ${c.scale > 2.5 ? '✓ opens to full bleed' : c.scale + ' ✗'}`,
      `    wordmark  : ${a.wm} → ${c.wm}  ${c.wm < .1 ? '✓ yields to the view' : '✗'}`].join('\n')
  }
  if (key === 'villanorth') {
    await wheelTo(0)
    const top = await page.evaluate(() => { const d = document.querySelector('.vn-drawing-inner'); return d ? Math.round(window.scrollY + d.getBoundingClientRect().top) : null })
    if (top == null) return '  pinned scrub: .vn-drawing-inner not found ✗'
    const read = async (off) => { await wheelTo(top + off); return page.evaluate(() => { const l = document.querySelector('.vn-elev-line'), ph = document.querySelector('.vn-elev-photo'); return { dash: Math.round(parseFloat(getComputedStyle(l).strokeDashoffset) || 0), photo: Math.round((parseFloat(getComputedStyle(ph).opacity) || 0) * 100) / 100 } }) }
    const a = await read(-200), b = await read(700), c = await read(1500), d = await read(2200)
    return [`  pinned drawing (.vn-drawing-inner), elevation traces then crossfades`,
            `    stroke-dashoffset  : ${a.dash} → ${b.dash} → ${c.dash} → ${d.dash}  ${a.dash > 0 && d.dash < a.dash * 0.05 ? '✓ draws to 0' : '✗'}`,
            `    photo layer opacity: ${a.photo} → ${b.photo} → ${c.photo} → ${d.photo}  ${a.photo < 0.05 && d.photo > 0.9 ? '✓ resolves to photo' : '✗'}`].join('\n')
  }
  // lakeview: hero wordmark scrub + night section scrub
  const wm = await (async () => {
    await wheelTo(0)
    const a = await page.evaluate(() => { const w = document.querySelector('.lv-wordmark, [class*="wordmark"]'); return w ? Math.round(new DOMMatrixReadOnly(getComputedStyle(w).transform).m42) : null })
    await wheelTo(600)
    const b = await page.evaluate(() => { const w = document.querySelector('.lv-wordmark, [class*="wordmark"]'); return w ? Math.round(new DOMMatrixReadOnly(getComputedStyle(w).transform).m42) : null })
    return a == null ? '  hero wordmark: not found' : `  hero wordmark scrub y: ${a} → ${b}  ${Math.abs(b - a) > 8 ? '✓ scrubs' : '✗ static'}`
  })()
  const night = await page.evaluate(() => {
    const n = document.querySelector('[class*="night"]')
    return n ? Math.round(window.scrollY + n.getBoundingClientRect().top) : null
  })
  let nightLine = '  night section: not found'
  if (night != null) {
    const read = async (off) => { await wheelTo(Math.max(0, night + off)); return page.evaluate(() => { const n = document.querySelector('[class*="night"]'); const cs = getComputedStyle(n); return { bg: cs.backgroundColor, v: getComputedStyle(document.documentElement).getPropertyValue('--lv-night-t') || '' } }) }
    const a = await read(-400), b = await read(500)
    nightLine = `  night section bg: ${a.bg} → ${b.bg}  ${a.bg !== b.bg ? '✓ scrubs' : '(static bg — scrub drives inner layers)'}`
  }
  return [wm, nightLine].join('\n')
})()
say(scrub)
say('└────────────────────────────────────────────────────────────────────\n')

/* ────────────────────────────── 3 · REVEAL ───────────────────────────── */
say('┌─ TABLE 3 · REVEAL (IO-armed is-in + measured paint delta) ─────────')
const before = COLD
// sweep the whole page so every observer fires
const height = await page.evaluate(() => document.body.scrollHeight)
for (let y = 0; y < height; y += 700) await wheelTo(y, 40)
await new Promise((r) => setTimeout(r, 1500))
const after = await page.evaluate((sel) => {
  const els = Array.from(document.querySelectorAll(sel))
  const isArmed = (e) => e.classList.contains('is-in') || e.classList.contains('is-settled') || !!e.closest('.is-in')
  const armed = els.filter(isArmed)
  const read = (e) => {
    const img = e.querySelector('img') || e
    const cs = getComputedStyle(img)
    return { cls: e.className.split(' ')[0], mask: (cs.webkitMaskPosition || cs.maskPosition || 'none').slice(0, 20), clip: (cs.clipPath || 'none').slice(0, 22), filter: cs.filter.slice(0, 18), op: cs.opacity, tf: cs.transform === 'none' ? 'none' : 'set' }
  }
  const warm = [0, 1, 2, 3].map((i) => { const e = document.querySelector(`[data-mr-cold="${i}"]`); return e ? read(e) : null }).filter(Boolean)
  /* Anything still cold: is it a real miss, or a node the desktop layout never
     paints (a mobile-only variant is display:none, so it can never intersect)? */
  const missed = els.filter((e) => !isArmed(e)).map((e) => {
    const cs = getComputedStyle(e); const r = e.getBoundingClientRect()
    return { cls: e.className.split(' ').slice(0, 2).join('.'), display: cs.display, vis: cs.visibility, w: Math.round(r.width), h: Math.round(r.height) }
  })
  return { total: els.length, armed: armed.length, warm, missed }
}, revealSel)
say(`  reveal targets (${revealSel.replace(/\.\w+-/g, '.')})`)
say(`  armed before any scroll : ${before.armed}/${before.total}  (above-the-fold only — correct)`)
say(`  armed after full sweep  : ${after.armed}/${after.total}  ${after.armed === after.total ? '✓ every one fired' : '— ' + after.missed.length + ' still cold, itemised below'}`)
say('')
say('  same four nodes, cold → warm (this is the paint delta, not a class toggle):')
for (let i = 0; i < before.pick.length; i++) {
  const c = before.pick[i], w = after.warm[i]
  if (!w) continue
  const d = ['mask', 'clip', 'filter', 'op', 'tf'].filter((k) => c[k] !== w[k])
  say(`    ${c.cls.padEnd(17)} mask ${String(c.mask).padEnd(12)} → ${String(w.mask).padEnd(12)} │ clip ${String(c.clip).padEnd(22)} → ${String(w.clip).padEnd(22)} │ op ${c.op} → ${w.op}  ${d.length ? '✓ ' + d.join('+') : '✗ no paint change'}`)
}
if (after.missed.length) {
  say('')
  say('  still cold after sweep:')
  for (const m of after.missed) say(`    ${m.cls.padEnd(30)} display:${m.display} visibility:${m.vis} box ${m.w}×${m.h}  ${m.display === 'none' || (m.w === 0 && m.h === 0) ? '(never painted at 1440px — not a miss)' : '✗ REAL MISS'}`)
}
say('└────────────────────────────────────────────────────────────────────\n')

/* ─────────────────────────────── 4 · HOVER ───────────────────────────── */
say('┌─ TABLE 4 · HOVER (pointer over target, delta measured) ────────────')
const hoverTargets = [`.${B.p}-cta`, `.${B.p}-nav-cta`, `.${B.p}-a`, ...(key === 'villanorth' ? ['.vn-mat-panel'] : []), ...(key === 'mysticlight' ? ['.ml-mark'] : [])]
say('  target            │ property          │ rest → hover                  │ verdict')
say('  ──────────────────┼───────────────────┼───────────────────────────────┼────────')
/* scrollIntoView animates under Lenis, so a rect read straight after it is
   stale and the cursor lands on empty page — that reads as "inert" when the
   hover simply never happened. Drive with wheel, settle, THEN read the rect. */
for (const sel of hoverTargets) {
  const home = await page.evaluate((s) => {
    const e = document.querySelector(s)
    if (!e) return null
    const r = e.getBoundingClientRect()
    if (getComputedStyle(e).position === 'fixed' || e.closest('[style*="fixed"], header')) return 'fixed'
    return Math.round(window.scrollY + r.top + r.height / 2 - window.innerHeight / 2)
  }, sel)
  if (home === null) { say(`  ${sel.padEnd(17)} │ ${'—'.padEnd(17)} │ ${'not found'.padEnd(29)} │ ✗`); continue }
  if (home !== 'fixed') await wheelTo(Math.max(0, home))
  await new Promise((r) => setTimeout(r, 500))
  // fresh rect, after the scroll has actually settled
  /* A wrapped inline <a> has a bounding rect spanning both lines, whose centre
     lands in the leading between them — the pointer hits nothing. Aim at the
     first line box instead. */
  const box = await page.evaluate((s) => {
    const e = document.querySelector(s)
    const rects = e.getClientRects()
    const r = rects.length ? rects[0] : e.getBoundingClientRect()
    return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2), lines: rects.length, on: r.top > 0 && r.bottom < window.innerHeight }
  }, sel)
  /* Many hover rules style a DESCENDANT (.ml-mark:hover .ml-mark-tag), so
     sampling only the hovered element scores a working hover as inert. */
  const snap = async () => page.evaluate((s) => {
    const e = document.querySelector(s)
    const out = { _hovered: e.matches(':hover') }
    const grab = (node, tag) => {
      const cs = getComputedStyle(node); const af = getComputedStyle(node, '::after'); const r = node.getBoundingClientRect()
      out[tag + 'width'] = Math.round(r.width)
      out[tag + 'bg'] = cs.backgroundColor
      out[tag + 'color'] = cs.color
      out[tag + 'opacity'] = cs.opacity
      out[tag + 'border'] = cs.borderColor
      out[tag + 'filter'] = cs.filter
      out[tag + 'shadow'] = cs.boxShadow.slice(0, 30)
      out[tag + 'underline'] = cs.textDecorationLine
      out[tag + 'tf'] = cs.transform === 'none' ? 'none' : [4, 5].map((i) => Math.round(new DOMMatrixReadOnly(cs.transform)['m4' + (i - 3)])).join(',')
      out[tag + 'after-w'] = af.width
      out[tag + 'after-op'] = af.opacity
      out[tag + 'after-tf'] = af.transform === 'none' ? 'none' : Math.round(new DOMMatrixReadOnly(af.transform).m41 * 100) / 100 + 'x'
    }
    grab(e, '')
    Array.from(e.querySelectorAll('*')).slice(0, 10).forEach((c, i) => grab(c, `[${c.className.toString().split(' ')[0] || 'child' + i}] `))
    return out
  }, sel)
  await page.mouse.move(5, 5); await new Promise((r) => setTimeout(r, 400))
  const rest = await snap()
  await page.mouse.move(box.x, box.y); await new Promise((r) => setTimeout(r, 600))
  const hov = await snap()
  /* If :hover never matched, the pointer missed and any "no change" reading is
     meaningless — say so rather than scoring the element inert. */
  const changed = Object.keys(rest).filter((k) => k !== '_hovered' && rest[k] !== hov[k])
  const prop = changed[0] || '—'
  const val = !hov._hovered ? 'POINTER MISSED' : prop === '—' ? 'no change' : `${rest[prop]} → ${hov[prop]}`
  const verdict = !hov._hovered ? '? invalid' : changed.length ? '✓ ' + changed.join('+') : '✗ inert'
  say(`  ${sel.padEnd(17)} │ ${prop.padEnd(17)} │ ${val.slice(0, 29).padEnd(29)} │ ${verdict}`)
  await page.mouse.move(5, 5)
}
say('└────────────────────────────────────────────────────────────────────\n')

/* ───────────────────── 5 · REDUCED MOTION SAFETY ─────────────────────── */
say('┌─ TABLE 5 · prefers-reduced-motion: reduce ─────────────────────────')
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await page.reload({ waitUntil: 'networkidle0', timeout: 120000 })
await new Promise((r) => setTimeout(r, 3000))
const rm = await page.evaluate((sel) => {
  const els = Array.from(document.querySelectorAll(sel))
  const hidden = els.filter((e) => { const cs = getComputedStyle(e); return parseFloat(cs.opacity) < 0.05 || cs.visibility === 'hidden' })
  const text = document.body.innerText.trim().length
  return { total: els.length, hidden: hidden.length, textChars: text }
}, revealSel)
say(`  reveal targets hidden at rest : ${rm.hidden}/${rm.total}  ${rm.hidden === 0 ? '✓ nothing gated blank' : '✗ content gated on motion'}`)
say(`  body text rendered            : ${rm.textChars} chars  ${rm.textChars > 800 ? '✓' : '✗ page reads empty'}`)
say('└────────────────────────────────────────────────────────────────────')

await browser.close()
