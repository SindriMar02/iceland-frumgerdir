/**
 * Round-verify: walk a pinned section through its scroll range, screenshot
 * each beat and report what is ACTUALLY on screen — geometry, not just
 * computed opacity. Built because Laxfoss's DROP probed "1.00 visible" at
 * every beat while the section still read as broken on screen: opacity alone
 * cannot see an element parked outside the viewport or behind the pin.
 *
 *   node scripts/verify-round.mjs laxfoss
 *   node scripts/verify-round.mjs glasscottages
 *
 * Lenis eats programmatic scrollTo, so every move goes through the wheel.
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const SHOTS = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/4620e487-992b-47b4-82cb-450e30d8aace/scratchpad/shots'
mkdirSync(SHOTS, { recursive: true })

const ORIGIN = process.env.ORIGIN || 'http://localhost:5199'

const BUILDS = {
  laxfoss: {
    url: `${ORIGIN}/preview/laxfoss`,
    pin: '.lx-drop',
    items: '.lx-drop-station',
    label: 'DROP',
  },
  glasscottages: {
    url: `${ORIGIN}/preview/glasscottages`,
    pin: '.gc-night',
    items: '.gc-night-layer',
    label: 'NIGHT',
  },
}

const key = process.argv[2]
const B = BUILDS[key]
if (!B) { console.error('usage: verify-round.mjs <laxfoss|glasscottages>'); process.exit(1) }

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
const errs = []
page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)))
await page.goto(B.url, { waitUntil: 'networkidle0', timeout: 120000 })
await page.evaluate(() => document.fonts.ready)
await new Promise((r) => setTimeout(r, 3800))
await page.mouse.move(720, 450)

const wheelTo = async (targetY, tol = 10) => {
  let guard = 0, stalled = 0, prev = -1
  await page.mouse.move(720, 450)
  for (;;) {
    const y = await page.evaluate(() => window.scrollY)
    if (Math.abs(targetY - y) <= tol || guard++ > 800) break
    if (y === prev && ++stalled > 14) break
    if (y !== prev) stalled = 0
    prev = y
    await page.mouse.wheel({ deltaY: Math.max(-700, Math.min(700, targetY - y)) })
    await new Promise((r) => setTimeout(r, 16))
  }
  await new Promise((r) => setTimeout(r, 900))
  return page.evaluate(() => Math.round(window.scrollY))
}

/* the pin's scroll range, read from the spacer ScrollTrigger inserts */
const range = await page.evaluate((sel) => {
  const el = document.querySelector(sel)
  if (!el) return null
  const spacer = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : null
  const box = spacer || el
  const top = box.getBoundingClientRect().top + window.scrollY
  return { top: Math.round(top), height: Math.round(box.offsetHeight), pinned: !!spacer }
}, B.pin)

if (!range) { console.error(`no ${B.pin} on the page`); await browser.close(); process.exit(1) }

console.log(`\n████ ${key.toUpperCase()} · ${B.label} — ${B.url}`)
console.log(`pin box: top ${range.top}, height ${range.height}, pin-spacer ${range.pinned}\n`)

const STEPS = 9
for (let i = 0; i < STEPS; i++) {
  const p = i / (STEPS - 1)
  const y = Math.round(range.top + p * Math.max(0, range.height - 900))
  const at = await wheelTo(y)

  const state = await page.evaluate((sel) => {
    const vh = window.innerHeight
    const seen = (r) => r.width > 2 && r.height > 2 && r.bottom > 0 && r.top < vh
    return Array.from(document.querySelectorAll(sel)).map((el) => {
      const cs = getComputedStyle(el)
      const r = el.getBoundingClientRect()
      return {
        op: Number(cs.opacity).toFixed(2),
        vis: cs.visibility === 'visible' ? 'v' : 'h',
        top: Math.round(r.top),
        h: Math.round(r.height),
        onScreen: seen(r),
      }
    })
  }, B.items)

  /* what colour is the middle of the viewport? a white band where the photo
     should be is the exact symptom that opacity probing cannot see. */
  const mid = await page.evaluate(() => {
    const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)
    if (!el) return 'none'
    let n = el, bg = 'rgba(0, 0, 0, 0)'
    while (n && bg === 'rgba(0, 0, 0, 0)') { bg = getComputedStyle(n).backgroundColor; n = n.parentElement }
    return `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]} bg=${bg}`
  })

  const line = state
    .map((s) => `${s.op}/${s.vis}${s.onScreen ? '' : '·OFF'}@${s.top}`)
    .join('  ')
  console.log(`p=${p.toFixed(2)} y=${at}  ${line}`)
  console.log(`         centre: ${mid}`)

  await page.screenshot({ path: `${SHOTS}/${key}-${String(i).padStart(2, '0')}.png` })
}

console.log(errs.length ? `\npage errors: ${errs.join(' | ')}` : '\nno page errors')
console.log(`shots: ${SHOTS}/${key}-*.png\n`)
await browser.close()
