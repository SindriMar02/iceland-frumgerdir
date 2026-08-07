/**
 * SECTION AUDIT — walk a live page top to bottom and prove no section ships
 * blank. Preflight checks the page as a whole and the zero-size sweep checks
 * individual frames; neither catches a whole SECTION that renders as an empty
 * band (the Glass Cottages night pin did exactly that, and the Laxfoss drop
 * looked empty for a different reason).
 *
 *   ORIGIN=https://... node scripts/section-audit.mjs laxfoss glasshouse
 *
 * A section fails if, after being scrolled into view, it has real height but
 * no text AND no painted image/canvas inside it.
 */
import puppeteer from 'puppeteer-core'

const ORIGIN = process.env.ORIGIN || 'https://sindrimar02.github.io/iceland-frumgerdir'
const slugs = process.argv.slice(2)
if (!slugs.length) { console.error('usage: section-audit.mjs <slug> [slug...]'); process.exit(1) }

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new', args: ['--no-sandbox'],
})

let failed = 0
for (const slug of slugs) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  const errs = []
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 110)))
  page.on('requestfailed', (r) => errs.push(`REQFAIL ${r.url().split('/').pop()}`))
  await page.goto(`${ORIGIN}/preview/${slug}`, { waitUntil: 'networkidle0', timeout: 120000 })
  await page.evaluate(() => document.fonts.ready)
  await new Promise((r) => setTimeout(r, 4000))
  await page.mouse.move(720, 450)

  /* scroll the whole document so every reveal arms and every pin resolves */
  const H = await page.evaluate(() => document.body.scrollHeight)
  for (let y = 0; y < H; y += 700) {
    await page.mouse.wheel({ deltaY: 700 })
    await new Promise((r) => setTimeout(r, 90))
  }
  await new Promise((r) => setTimeout(r, 1200))

  const rows = await page.evaluate(() => {
    const painted = (el) => {
      for (const im of el.querySelectorAll('img')) {
        if (im.complete && im.naturalWidth > 2) return true
      }
      for (const c of el.querySelectorAll('canvas')) {
        if (c.width > 2 && c.height > 2) return true
      }
      if (el.querySelector('svg, video')) return true
      const cs = getComputedStyle(el)
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return true
      return false
    }
    return [...document.querySelectorAll('section, footer')].map((el) => {
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      const hidden = cs.display === 'none' || cs.visibility === 'hidden'
      const text = (el.innerText || '').replace(/\s+/g, ' ').trim()
      return {
        id: el.id || el.className.toString().split(' ')[0] || el.tagName.toLowerCase(),
        h: Math.round(el.offsetHeight),
        chars: text.length,
        media: painted(el),
        hidden,
      }
    })
  })

  console.log(`\n████ ${slug}`)
  let bad = 0
  for (const s of rows) {
    const empty = !s.hidden && s.h > 120 && s.chars < 12 && !s.media
    if (empty) bad++
    console.log(
      `  ${empty ? 'BLANK ' : '  ok  '} ${s.id.padEnd(22)} h=${String(s.h).padStart(5)}  text=${String(s.chars).padStart(5)}  media=${s.media ? 'y' : 'n'}${s.hidden ? '  (hidden)' : ''}`,
    )
  }
  const uniqErrs = [...new Set(errs)]
  if (uniqErrs.length) console.log(`  errors: ${uniqErrs.slice(0, 4).join(' | ')}`)
  console.log(bad ? `  ✗ ${bad} BLANK section(s)` : `  ✓ ${rows.length} sections, none blank${uniqErrs.length ? ', but see errors' : ', no errors'}`)
  if (bad || uniqErrs.length) failed++
  await page.close()
}
await browser.close()
process.exit(failed ? 1 : 0)
