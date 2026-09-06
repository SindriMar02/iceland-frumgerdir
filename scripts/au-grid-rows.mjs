import puppeteer from 'puppeteer-core'
/* Proves nothing is stranded, measured from geometry rather than from the CSS.
   A card contributes to EVERY horizontal band it overlaps, so the villa counts
   in both of the rows it spans; a band is short only if the cards overlapping
   it leave a hole wider than one gap. */
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/au-rows2', args: ['--hide-scrollbars'] })
const out = {}
for (const w of [1440, 1200, 1000, 820, 700, 440]) {
  const p = await b.newPage()
  await p.setCacheEnabled(false)
  await p.setViewport({ width: w, height: 1000, deviceScaleFactor: 1, isMobile: w < 700, hasTouch: w < 700 })
  await p.goto('https://sindrimar02.github.io/austurey-preview/?r=' + Math.random(), { waitUntil: 'networkidle2' })
  await new Promise(r => setTimeout(r, 8000))
  await p.evaluate(() => document.querySelector('#stays')?.scrollIntoView({ block: 'start' }))
  await new Promise(r => setTimeout(r, 1200))
  out[w] = await p.evaluate(() => {
    const grid = document.querySelector('.gal_grid')
    const g = grid.getBoundingClientRect()
    const gap = parseFloat(getComputedStyle(grid).columnGap) || 0
    const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length
    const cards = [...document.querySelectorAll('.gcard')].map(c => {
      const r = c.getBoundingClientRect()
      return { l: r.left - g.left, r: r.right - g.left, t: r.top, b: r.bottom, villa: c.classList.contains('gcard--villa') }
    })
    // horizontal bands = distinct card tops, merged within 3px
    const tops = [...new Set(cards.map(c => Math.round(c.t)))].sort((a, b) => a - b)
    const bands = []
    tops.forEach(t => { if (!bands.length || t - bands[bands.length - 1] > 3) bands.push(t) })
    const report = bands.map(bt => {
      const inBand = cards.filter(c => c.t < bt + 4 && c.b > bt + 4)
      const covered = inBand.reduce((s, c) => s + (c.r - c.l), 0) + gap * Math.max(0, inBand.length - 1)
      const hole = Math.round(g.width - covered)
      return { n: inBand.length, hole, short: hole > gap + 4 }
    })
    return { cols, cards: cards.length,
      bands: report.map(r => r.n).join(' '),
      holes: report.map(r => r.hole).join(' '),
      shortBands: report.filter(r => r.short).length,
      overflow: document.documentElement.scrollWidth - innerWidth }
  })
  await p.screenshot({ path: `scripts/au-grid-${w}.png` })
  await p.close()
}
console.log(JSON.stringify(out, null, 1))
await b.close()
