// How much of each project's first photograph the cover-cropped hero shows, at desktop and phone.
import puppeteer from 'puppeteer-core'
const BASE = process.argv[2] || 'https://katrin-isfeld.pages.dev'
const slugs = (await (await fetch(BASE + '/sitemap.xml')).text()).match(/\/verkefni\/[a-z0-9-]+\//g).filter((s, i, a) => a.indexOf(s) === i)
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const pg = await br.newPage()
for (const [w, h] of [[1440, 900], [390, 844]]) {
  await pg.setViewport({ width: w, height: h })
  const rows = []
  for (const s of slugs) {
    await pg.goto(BASE + s, { waitUntil: 'networkidle2' })
    const v = await pg.evaluate(() => {
      const im = document.querySelector('.ki-proj-hero img'); if (!im) return null
      const r = im.getBoundingClientRect(), box = r.width / r.height, nat = im.naturalWidth / im.naturalHeight
      return { shown: Math.round(100 * Math.min(box / nat, nat / box)), portrait: nat < 1 }
    })
    if (v) rows.push([s.replace('/verkefni/', ''), v.shown, v.portrait])
  }
  rows.sort((a, b) => a[1] - b[1])
  console.log(`\n${w}px: hero shows % of photo 1 (lowest first)`)
  console.log(rows.slice(0, 8).map((r) => `  ${r[1]}%  ${r[0]}${r[2] ? ' (portrait)' : ''}`).join('\n'))
  console.log(`  under 70%: ${rows.filter((r) => r[1] < 70).length} of ${rows.length}`)
}
await br.close()
