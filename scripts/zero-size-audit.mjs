/* Any image or frame that renders at zero size on a live page is an invisible
   photo the visitor paid to download. Sweep all three at desktop and mobile. */
import puppeteer from 'puppeteer-core'
/* pages and origin are overridable so the sweep can run on localhost BEFORE a
   deploy, not only after: node scripts/zero-size-audit.mjs laxfoss glasscottages
   with ORIGIN=http://localhost:5199 */
const ORIGIN = process.env.ORIGIN || 'https://sindrimar02.github.io/iceland-frumgerdir'
const PAGES = process.argv.slice(2).length ? process.argv.slice(2) : ['lakeview', 'mysticlight', 'villanorth']
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox'] })
for (const p of PAGES) {
  for (const [label, w, h] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
    const page = await browser.newPage()
    await page.setViewport({ width: w, height: h })
    await page.goto(`${ORIGIN}/preview/${p}`, { waitUntil: 'networkidle0', timeout: 120000 })
    await page.evaluate(() => document.fonts.ready)
    await new Promise((r) => setTimeout(r, 2000))
    const bad = await page.evaluate(() => {
      const hiddenByDesign = (el) => { let n = el; while (n) { const cs = getComputedStyle(n); if (cs.display === 'none' || cs.visibility === 'hidden') return true; n = n.parentElement } return false }
      return Array.from(document.querySelectorAll('figure[class*="frame"]')).filter((f) => {
        const r = f.getBoundingClientRect()
        return (r.width === 0 || r.height === 0) && !hiddenByDesign(f)
      }).map((f) => {
        const im = f.querySelector('img')
        return { cls: f.className.split(' ').filter((c) => !['vn-rv','lv-rv','ml-rv'].includes(c)).join('.'), src: im ? im.src.split('/').pop() : 'no img', parent: (f.parentElement.className || '').toString().split(' ')[0] }
      })
    })
    console.log(`${p.padEnd(12)} ${label.padEnd(8)} ${bad.length ? '✗ ' + bad.length + ' invisible' : '✓ none'}`)
    for (const b of bad) console.log(`               .${b.cls}  →  ${b.src}   (parent .${b.parent})`)
    await page.close()
  }
}
await browser.close()
