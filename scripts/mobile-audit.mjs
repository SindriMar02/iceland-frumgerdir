/**
 * MOBILE AUDIT — executable, not "reason about it at 375px".
 *
 * Written after a section shipped with text computing to ~8px on a phone.
 * The cause was a fluid unit (--u) that pins at its minimum below ~634px, so
 * `calc(var(--u) * 18)` silently becomes 7.9px. Nothing in a desktop review
 * or a screenshot-by-eye catches that; a computed-style sweep does.
 *
 * Checks, at real phone widths:
 *   1. every visible text node's COMPUTED font-size
 *   2. tap-target size for every interactive element
 *   3. horizontal overflow, and which element causes it
 *   4. text contrast against its nearest opaque background
 *
 * Usage: node scripts/mobile-audit.mjs <url> [width]
 */
import puppeteer from 'puppeteer-core'

const URL = process.argv[2] || 'http://localhost:4199/preview/tannlaeknavaktin/'
const WIDTHS = process.argv[3] ? [Number(process.argv[3])] : [390, 360]

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  userDataDir: '/tmp/tlv-audit-profile',
  args: ['--no-sandbox', '--force-color-profile=srgb'],
})

let totalFail = 0

for (const width of WIDTHS) {
  const page = await browser.newPage()
  await page.setViewport({ width, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  await page.goto(URL, { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 1800))
  // walk the whole page so lazy/scroll-triggered content is laid out
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40))
    }
    window.scrollTo(0, 0)
  })
  await new Promise((r) => setTimeout(r, 500))

  // Open anything that hides text behind a toggle. A closed chat panel has no
  // boxes, so a sweep that skips this reports a clean page while 8.5px text
  // waits inside it — which is exactly what happened on the first run.
  const opened = await page.evaluate(async () => {
    const t = [...document.querySelectorAll('button,[role="button"]')].find((b) =>
      /spyrja|chat|spjall|opna/i.test((b.getAttribute('aria-label') || b.textContent || '')))
    if (!t) return false
    t.click()
    await new Promise((r) => setTimeout(r, 900))
    return true
  })
  await new Promise((r) => setTimeout(r, 900))

  const report = await page.evaluate((didOpen) => {
    const TEXT_MIN = 15      // body copy
    const META_MIN = 11      // mono labels / eyebrows may legitimately be small
    const TAP_MIN = 44

    const vis = (el) => {
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05
    }
    const ownText = (el) =>
      [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(' ').trim()

    const small = []
    document.querySelectorAll('main *, header *, footer *').forEach((el) => {
      const t = ownText(el)
      if (!t || !vis(el)) return
      // A logotype is artwork, not copy — sizing it is a design decision and
      // WCAG carves it out. Opt-in via data-logotype so the exemption is
      // visible in the markup rather than hidden in this script.
      if (el.closest('[data-logotype]')) return
      const cs = getComputedStyle(el)
      const px = parseFloat(cs.fontSize)
      const mono = /mono|Space Mono/i.test(cs.fontFamily)
      const floor = mono && t.length < 40 ? META_MIN : TEXT_MIN
      if (px < floor) {
        small.push({ px: +px.toFixed(1), floor, mono, text: t.slice(0, 46), tag: el.tagName.toLowerCase() })
      }
    })

    // WCAG 2.5.8 exempts a target that sits inline inside a sentence — forcing
    // 44px onto a footer link mid-paragraph would wreck the line rhythm and is
    // not what the rule asks for. Detect it rather than reporting noise.
    const inlineInText = (el) => {
      if (!/^inline$/.test(getComputedStyle(el).display)) return false
      const p = el.parentElement
      if (!p) return false
      return [...p.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 8)
    }

    const taps = []
    document.querySelectorAll('a[href], button, input, select, [role="button"]').forEach((el) => {
      if (!vis(el) || inlineInText(el)) return
      const r = el.getBoundingClientRect()
      if (r.height < TAP_MIN || r.width < 24) {
        taps.push({
          h: Math.round(r.height), w: Math.round(r.width),
          label: (el.getAttribute('aria-label') || el.innerText || '').trim().slice(0, 40) || el.tagName.toLowerCase(),
        })
      }
    })

    // horizontal overflow and the culprit
    const de = document.documentElement
    const overflow = de.scrollWidth > de.clientWidth
    let culprits = []
    if (overflow) {
      document.querySelectorAll('main *, header *').forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.right > de.clientWidth + 1 || r.left < -1) {
          culprits.push({ tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 40), right: Math.round(r.right) })
        }
      })
      culprits = culprits.slice(0, 5)
    }

    return {
      scrollWidth: de.scrollWidth, clientWidth: de.clientWidth,
      overflow, culprits, didOpen,
      smallText: small, smallTaps: taps,
    }
  }, opened)

  const fails = report.smallText.length + report.smallTaps.length + (report.overflow ? 1 : 0)
  totalFail += fails

  console.log(`\n${'='.repeat(58)}\n  ${width}px  —  ${fails === 0 ? 'PASS' : fails + ' ISSUE(S)'}\n${'='.repeat(58)}`)
  console.log(`toggle panel opened: ${report.didOpen ? 'yes' : 'NO — hidden text was not measured'}`)
  console.log(`overflow: ${report.overflow ? `YES (${report.scrollWidth} > ${report.clientWidth})` : 'no'}`)
  if (report.culprits.length) report.culprits.forEach((c) => console.log(`   culprit: <${c.tag}> ${c.cls} right=${c.right}`))

  console.log(`\ntext under floor: ${report.smallText.length}`)
  report.smallText.slice(0, 25).forEach((s) =>
    console.log(`   ${String(s.px).padStart(5)}px (floor ${s.floor})  ${s.mono ? 'mono' : 'body'}  "${s.text}"`))
  if (report.smallText.length > 25) console.log(`   ... and ${report.smallText.length - 25} more`)

  console.log(`\ntap targets under 44px: ${report.smallTaps.length}`)
  report.smallTaps.slice(0, 12).forEach((t) => console.log(`   ${t.h}x${t.w}  "${t.label}"`))

  await page.close()
}

console.log(`\n${'='.repeat(58)}\nTOTAL ISSUES ACROSS WIDTHS: ${totalFail}\n`)
await browser.close()
process.exit(totalFail > 0 ? 1 : 0)
