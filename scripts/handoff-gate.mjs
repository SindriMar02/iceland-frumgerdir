/**
 * HANDOFF GATE — for any sequence of items stacked in ONE position whose
 * visibility is driven by a scrubbed timeline (Laxfoss DROP stations, Glass
 * House pane captions).
 *
 * Two failure modes, and BOTH have shipped on this project:
 *   OVERLAP  two items visible at once. They are absolutely positioned in the
 *            same place, so this renders both texts on top of each other and
 *            reads as duplicated, garbled copy.
 *   GAP      a RANGE where none is visible, which reads as an empty, broken
 *            section.
 *
 * The earlier motion probe measured only "does each item reach opacity 1",
 * which BOTH failure modes pass. This one walks the pinned range in fine
 * steps and counts how many are visible at each sample.
 *
 *   node scripts/handoff-gate.mjs laxfoss
 *   ORIGIN=https://sindrimar02.github.io/iceland-frumgerdir node scripts/handoff-gate.mjs glasshouse
 */
import puppeteer from 'puppeteer-core'

const ORIGIN = process.env.ORIGIN || 'http://localhost:5199'
const BUILDS = {
  laxfoss:    { path: 'laxfoss',    pin: '.lx-drop',        items: '.lx-drop-station', label: 'DROP stations' },
  glasshouse: { path: 'glasshouse', pin: '.gh-window',      items: '.gh-pane-cap',     label: 'pane captions' },
}

const key = process.argv[2]
const B = BUILDS[key]
if (!B) { console.error('usage: handoff-gate.mjs <laxfoss|glasshouse>'); process.exit(1) }

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new', args: ['--no-sandbox', '--force-device-scale-factor=1'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await page.goto(`${ORIGIN}/preview/${B.path}`, { waitUntil: 'networkidle0', timeout: 120000 })
await page.evaluate(() => document.fonts.ready)
await new Promise((r) => setTimeout(r, 3800))
await page.mouse.move(720, 450)

const box = await page.evaluate((sel) => {
  const el = document.querySelector(sel)
  if (!el) return null
  const sp = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el
  return { top: Math.round(sp.getBoundingClientRect().top + window.scrollY), h: Math.round(sp.offsetHeight) }
}, B.pin)
if (!box) { console.error(`no ${B.pin}`); await browser.close(); process.exit(1) }

/* park just above the pin, then walk down in small wheel bursts */
const parkTo = async (target) => {
  let guard = 0, prev = -1, stalled = 0
  for (;;) {
    const y = await page.evaluate(() => window.scrollY)
    if (Math.abs(target - y) <= 14 || guard++ > 900) break
    if (y === prev && ++stalled > 16) break
    if (y !== prev) stalled = 0
    prev = y
    await page.mouse.wheel({ deltaY: Math.max(-800, Math.min(800, target - y)) })
    await new Promise((r) => setTimeout(r, 16))
  }
  await new Promise((r) => setTimeout(r, 800))
}
await parkTo(Math.max(0, box.top - 40))

const STEP = 90, SAMPLES = Math.ceil((box.h + 200) / STEP)
const trace = []
for (let i = 0; i < SAMPLES; i++) {
  const s = await page.evaluate((sel) => {
    const ops = [...document.querySelectorAll(sel)].map((el) => {
      const cs = getComputedStyle(el)
      return cs.visibility === 'hidden' ? 0 : Number(cs.opacity)
    })
    return { y: Math.round(window.scrollY), ops }
  }, B.items)
  trace.push(s)
  await page.mouse.wheel({ deltaY: STEP })
  await new Promise((r) => setTimeout(r, 260))
}

const VIS = 0.05
console.log(`\n████ ${key.toUpperCase()} · ${B.label}`)
console.log(`pin box top ${box.top} height ${box.h}, ${trace.length} samples\n`)

let overlaps = 0, gapRun = 0, worstGap = 0
const inRange = (y) => y >= box.top - 20 && y <= box.top + box.h - 860
for (const t of trace) {
  const n = t.ops.filter((o) => o > VIS).length
  const bar = t.ops.map((o) => o.toFixed(2)).join(' ')
  let flag = ''
  if (n >= 2) { overlaps++; flag = '  <-- OVERLAP (two texts stacked)' }
  if (n === 0 && inRange(t.y)) { gapRun++; worstGap = Math.max(worstGap, gapRun); flag = '  <-- none visible' }
  else gapRun = 0
  console.log(`y=${String(t.y).padStart(5)}  ${bar}${flag}`)
}

console.log('')
console.log(`OVERLAP samples : ${overlaps}   ${overlaps === 0 ? '✓ never two at once' : '✗ FAIL'}`)
console.log(`longest all-dark run inside the pin : ${worstGap} sample(s) (~${worstGap * STEP}px)  ${worstGap <= 1 ? '✓' : '✗ FAIL'}`)
await browser.close()
