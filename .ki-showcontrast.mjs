/* worst-pixel contrast of the landing-frame type over every slide, both widths */
import puppeteer from 'puppeteer-core'
import { PNG } from 'pngjs'
const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) }
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const SELS = ['.ki-show-name', '.ki-show-role', '.ki-show-tag', '.ki-fill-label', '.ki-show-cta .ki-cta', '.ki-show-n', '.ki-show-title', '.ki-newest-kicker', '.ki-newest-title']
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const p = await br.newPage(); await p.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: w < 800, hasTouch: w < 800 })
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await p.goto(process.argv[2], { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 1500))
  const n = await p.evaluate(() => document.querySelectorAll('.ki-show-dots button').length)
  const worstBySel = {}
  for (let i = 0; i < n; i++) {
    await p.evaluate(i => { const b = document.querySelectorAll('.ki-show-dots button')[i]; b.click() }, i)
    await new Promise(r => setTimeout(r, 900))
    for (const sel of SELS) {
      const box = await p.evaluate(s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect()
        return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), col: getComputedStyle(e).color } }, sel)
      if (!box || box.w < 2 || box.h < 2) continue
      await p.evaluate(s => { document.querySelector(s).style.visibility = 'hidden' }, sel)
      const png = PNG.sync.read(await p.screenshot({ clip: { x: box.x, y: box.y, width: box.w, height: box.h } }))
      await p.evaluate(s => { document.querySelector(s).style.visibility = '' }, sel)
      const m = /(\d+),\s*(\d+),\s*(\d+)/.exec(box.col); const Lt = L(+m[1], +m[2], +m[3])
      let best = 21
      const all = []
      for (let k = 0; k < png.data.length; k += 4) {
        const Lb = L(png.data[k], png.data[k + 1], png.data[k + 2])
        const c = (Math.max(Lt, Lb) + 0.05) / (Math.min(Lt, Lb) + 0.05)
        all.push(c)
        if (c < best) best = c
      }
      all.sort((a, b) => a - b); const p2 = all[Math.floor(all.length * 0.02)]; best = process.env.WORST ? best : p2
      if (process.env.PER && ['.ki-show-name','.ki-show-role','.ki-show-tag'].includes(sel)) console.log(`  ${w} slide ${i + 1} ${sel} ${best.toFixed(2)}`)
      const cur = worstBySel[sel]
      if (!cur || best < cur.c) worstBySel[sel] = { c: best, slide: i + 1 }
    }
  }
  for (const [sel, v] of Object.entries(worstBySel)) console.log(`${w}  ${sel.padEnd(22)} worst ${v.c.toFixed(2)}:1 (slide ${v.slide})  ${v.c >= 4.5 ? 'AA' : v.c >= 3 ? 'AA-large' : 'FAIL'}`)
  await p.close()
}
await br.close()
