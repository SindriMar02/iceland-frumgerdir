/* Gate the three openings: loader, wordmark reveal, scroll-away.
 *
 * Every row is measured, never asserted. A reveal that only toggles a class is
 * not a reveal, so each stage reads the computed paint state before and after
 * and reports the delta.
 */
import puppeteer from 'puppeteer-core'

const B = 'https://sindrimar02.github.io/iceland-frumgerdir/preview'
const BUILDS = [
  { key: 'lakeview',    p: 'lv', word: '.lv-wordmark .lv-word', extra: '.lv-wm-rule',  hero: '.lv-hero' },
  { key: 'mysticlight', p: 'ml', word: '.ml-wm-word',           extra: '.ml-wm-sweep', hero: '.ml-hero' },
  { key: 'villanorth',  p: 'vn', word: '.vn-wm-word',           extra: '.vn-wm-rule',  hero: '.vn-hero' },
  { key: 'laxfoss',     p: 'lx', word: '.lx-wm-letter',          extra: '.lx-wm-brink', hero: '.lx-hero', wm: '.lx-wm' },
  { key: 'glasscottages', p: 'gc', word: '.gc-wm-solid',         extra: '.gc-wm-ghost-b', hero: '.gc-hero', wm: '.gc-wm' },
  { key: 'glasshouse',  p: 'gh', word: '.gh-wm-in',              extra: null, hero: '.gh-hero', wm: '.gh-wm' },
  { key: 'svartaborg',  p: 'sb', word: '.sb-wm-word',            extra: null, hero: '.sb-hero', wm: '.sb-wm' },
]

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new', args: ['--no-sandbox'],
})

const paint = (sel) => {
  const el = document.querySelector(sel)
  if (!el) return null
  const cs = getComputedStyle(el)
  const m = new DOMMatrixReadOnly(cs.transform)
  return {
    opacity: Math.round(parseFloat(cs.opacity) * 1000) / 1000,
    filter: cs.filter,
    y: Math.round(m.m42 * 10) / 10,
    scaleX: Math.round(m.a * 1000) / 1000,
    visibility: cs.visibility,
  }
}

for (const b of BUILDS) {
  console.log(`\n████ ${b.key.toUpperCase()}`)

  // ── 1 · LOADER (forced with ?loader) ─────────────────────────────────────
  const p = await browser.newPage()
  await p.setViewport({ width: 1440, height: 900 })
  await p.goto(`${B}/${b.key}?loader`, { waitUntil: 'domcontentloaded', timeout: 90000 })
  // React hydration on a cold CDN load can take >250ms; wait for the mount.
  const early = await p.evaluate((p_) => new Promise((res) => {
    let n = 0
    const iv = setInterval(() => {
      const l = document.querySelector(`.${p_}-loader`)
      if (l) { clearInterval(iv); res({ present: true, pct: document.querySelector(`.${p_}-loader-pct`)?.textContent || '?' }) }
      if (++n > 60) { clearInterval(iv); res(null) }
    }, 50)
  }), b.p)
  console.log(`┌─ loader`)
  console.log(`│  mounts on ?loader        : ${early ? `✓ present, at ${early.pct}` : '✗ never mounted'}`)

  // watch it actually count, then leave
  const journey = await p.evaluate((p_) => new Promise((res) => {
    const seen = new Set(); let sawIt = false; let n = 0
    const iv = setInterval(() => {
      const l = document.querySelector(`.${p_}-loader`)
      if (l) sawIt = true
      const t = document.querySelector(`.${p_}-loader-pct`)?.textContent
      if (t) seen.add(t)
      if ((sawIt && !l) || ++n > 90) { clearInterval(iv); res({ steps: seen.size, left: sawIt && !l }) }
    }, 60)
  }), b.p)
  console.log(`│  distinct % values counted: ${journey.steps}  ${journey.steps >= 6 ? '✓ real progress' : '✗ jumps'}`)
  console.log(`│  unmounts when done       : ${journey.left ? '✓' : '✗ still on screen'}`)

  // ── 2 · WORDMARK REVEAL ──────────────────────────────────────────────────
  await p.close()
  const q = await browser.newPage()
  await q.setViewport({ width: 1440, height: 900 })
  // block the loader so we can catch the pre-reveal frame, then let it play
  await q.goto(`${B}/${b.key}`, { waitUntil: 'domcontentloaded', timeout: 90000 })
  await q.waitForSelector(b.word, { timeout: 15000 }).catch(() => {})
  const before = await q.evaluate(paint, b.word)
  const beforeX = b.extra ? await q.evaluate(paint, b.extra) : null
  await new Promise((r) => setTimeout(r, 4200))
  const after = await q.evaluate(paint, b.word)
  const afterX = b.extra ? await q.evaluate(paint, b.extra) : null
  const changed = before && after && Object.keys(before).filter((k) => before[k] !== after[k])
  const changedX = beforeX && afterX && Object.keys(beforeX).filter((k) => beforeX[k] !== afterX[k])
  console.log(`├─ wordmark reveal`)
  console.log(`│  word  ${b.word}`)
  console.log(`│    before : ${JSON.stringify(before)}`)
  console.log(`│    after  : ${JSON.stringify(after)}`)
  console.log(`│    ${changed && changed.length ? '✓ moved: ' + changed.join('+') : '✗ NO CHANGE'}`)
  if (b.extra) {
    console.log(`│  second element ${b.extra}`)
    console.log(`│    ${changedX && changedX.length ? '✓ moved: ' + changedX.join('+') : '✗ NO CHANGE'}  (${JSON.stringify(beforeX)} → ${JSON.stringify(afterX)})`)
  }
  const rest = after && (after.opacity > 0.9 && after.visibility === 'visible')
  console.log(`│  settles fully visible    : ${rest ? '✓' : '✗ parked at ' + JSON.stringify(after)}`)

  // ── 3 · SCROLL AWAY ──────────────────────────────────────────────────────
  await q.mouse.move(720, 450)
  const wmSel = b.wm || `.${b.p}-wordmark`
  const at0 = await q.evaluate(paint, wmSel)
  for (let i = 0; i < 40; i++) { await q.mouse.wheel({ deltaY: 220 }); await new Promise((r) => setTimeout(r, 16)) }
  await new Promise((r) => setTimeout(r, 1400))
  const at1 = await q.evaluate(paint, wmSel)
  const wordAt1 = await q.evaluate(paint, b.word)
  const awayChanged = at0 && at1 ? Object.keys(at0).filter((k) => at0[k] !== at1[k]) : []
  console.log(`├─ scroll away`)
  console.log(`│    wordmark ${JSON.stringify(at0)}`)
  console.log(`│          →  ${JSON.stringify(at1)}`)
  console.log(`│    ${awayChanged.length ? '✓ ' + awayChanged.join('+') : '✗ INERT'}   word y now ${wordAt1?.y}`)

  // ── 4 · REDUCED MOTION ───────────────────────────────────────────────────
  await q.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await q.goto(`${B}/${b.key}?loader`, { waitUntil: 'domcontentloaded', timeout: 90000 })
  await new Promise((r) => setTimeout(r, 2200))
  const rm = await q.evaluate((p_, wordSel) => {
    const w = document.querySelector(wordSel)
    const cs = w ? getComputedStyle(w) : null
    return {
      loader: !!document.querySelector(`.${p_}-loader`),
      wordOpacity: cs ? cs.opacity : 'n/a',
      wordVisible: cs ? cs.visibility : 'n/a',
      text: document.body.innerText.trim().length,
    }
  }, b.p, b.word)
  console.log(`└─ reduced motion`)
  console.log(`     loader suppressed      : ${rm.loader ? '✗ still mounts' : '✓'}`)
  console.log(`     wordmark visible       : opacity ${rm.wordOpacity}, ${rm.wordVisible}  ${parseFloat(rm.wordOpacity) > 0.9 ? '✓' : '✗ HIDDEN'}`)
  console.log(`     body text rendered     : ${rm.text} chars ${rm.text > 800 ? '✓' : '✗'}`)
  await q.close()
}
await browser.close()
