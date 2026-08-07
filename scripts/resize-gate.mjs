/**
 * RESIZE GATE — cross the breakpoint in BOTH directions and prove the page
 * lands in a designed state each time.
 *
 * Written after Laxfoss shipped three absolutely-positioned stations stacked
 * on top of each other as garbled copy, and Glass Cottages shipped chooser
 * columns clipped to nothing on a phone. Both passed every fresh-load check
 * ever run against them: the trigger is a RESIZE across a breakpoint that a
 * one-time `innerWidth` gate was evaluated on. Fresh-load probes cannot see
 * this class of bug at all.
 */
import puppeteer from 'puppeteer-core'
const ORIGIN = process.env.ORIGIN || 'https://sindrimar02.github.io/iceland-frumgerdir'
const slugs = process.argv.slice(2)
if (!slugs.length) { console.error('usage: resize-gate.mjs <slug>...'); process.exit(1) }
const b = await puppeteer.launch({ executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless:'new', args:['--no-sandbox'] })
let failed = 0
/* Only TEXT counts as stacked. The failure this exists to catch is two
   absolutely-positioned copy blocks rendering on top of each other and
   reading as garbled nonsense. Layered IMAGE elements at one position are a
   normal device on these pages (Glass House's seasons band deliberately
   clip-sweeps one photograph over another, Glass Cottages crossfades four
   aurora layers) and flagging those is noise. */
const stacked = () => {
  const groups = {}
  for (const el of document.querySelectorAll('div,section,figure,p')) {
    const cs = getComputedStyle(el)
    if (cs.position !== 'absolute') continue
    if (cs.visibility === 'hidden' || +cs.opacity < 0.05 || cs.display === 'none') continue
    const r = el.getBoundingClientRect()
    if (r.width < 60 || r.height < 30) continue
    const text = (el.innerText || '').replace(/\s+/g, ' ').trim()
    if (text.length < 20) continue
    const k = `${el.className.toString().split(' ')[0]}|${Math.round(r.top)}|${Math.round(r.left)}`
    groups[k] = (groups[k] || 0) + 1
  }
  return Object.entries(groups).filter(([, n]) => n > 1).map(([k, n]) => `${k} x${n}`)
}
/* Clipped-away is only a defect if it survives a real visitor's scroll. These
   pages reveal on IntersectionObserver, so anything below the fold is
   legitimately still closed; measuring before scrolling just reports the
   reveal system working. */
const clipped = () => {
  const shows = (el) => {
    const c = getComputedStyle(el)
    if (c.display === 'none' || c.visibility === 'hidden' || +c.opacity < 0.05) return false
    if (/inset\((100%|0%\s+0%\s+100%)/.test(c.clipPath)) return false
    const im = el.querySelector('img')
    if (im && im.complete && im.naturalWidth > 2) return true
    return (el.innerText || '').trim().length > 8
  }
  return [...document.querySelectorAll('*')].filter((el) => {
    const c = getComputedStyle(el).clipPath
    if (!c || !/inset\((100%|0%\s+0%\s+100%)/.test(c)) return false
    const r = el.getBoundingClientRect()
    if (r.height <= 40) return false
    /* A clipped-away layer is only a defect if NOTHING is left showing in its
       place. Glass House's seasons band ends its sweep with the top layer at
       inset(0% 0% 100%) precisely so the under layer shows through; that is
       the effect completing, not a hole in the page. */
    const sibs = [...(el.parentElement?.children || [])].filter((x) => x !== el)
    if (sibs.some(shows)) return false
    return true
  }).map((el) => el.className.toString().split(' ')[0] + ' ' + getComputedStyle(el).clipPath)
}

for (const slug of slugs) {
  for (const [label, from, to] of [
    ['narrow->wide', { width:569, height:774 }, { width:1400, height:900 }],
    ['wide->narrow', { width:1400, height:900 }, { width:390, height:844 }],
  ]) {
    const p = await b.newPage(); await p.setCacheEnabled(false)
    await p.setViewport(from)
    await p.goto(`${ORIGIN}/preview/${slug}?cb=${Date.now()}`, { waitUntil:'networkidle0', timeout:120000 })
    await new Promise(r => setTimeout(r, 4000))
    await p.setViewport(to); await new Promise(r => setTimeout(r, 2600))
    /* walk the page so every IO-armed reveal gets its chance before we judge */
    const H = await p.evaluate(() => document.body.scrollHeight)
    for (let y = 0; y < H; y += 500) {
      await p.evaluate((v) => window.scrollTo(0, v), y)
      await new Promise(r => setTimeout(r, 110))
    }
    await new Promise(r => setTimeout(r, 1400))
    const dup = await p.evaluate(stacked)
    const clip = to.width < 768 ? await p.evaluate(clipped) : []
    const bad = dup.length || clip.length
    if (bad) failed++
    console.log(`  ${bad ? 'FAIL ' : ' ok  '} ${slug.padEnd(14)} ${label}${dup.length ? '  stacked: ' + dup.join(', ') : ''}${clip.length ? '  clipped-away: ' + clip.join(', ') : ''}`)
    await p.close()
  }
}
await b.close()
console.log(failed ? `\n✗ ${failed} resize path(s) land broken` : '\n✓ every resize path lands in a designed state')
process.exit(failed ? 1 : 0)
