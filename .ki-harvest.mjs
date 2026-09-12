import puppeteer from 'puppeteer-core'
import { writeFileSync, mkdirSync, existsSync, createWriteStream } from 'node:fs'
import { Readable } from 'node:stream'
const SLUGS = JSON.parse(process.argv[2])
const OUT = '_harvest'
mkdirSync(OUT, { recursive: true })
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage(); await page.setViewport({ width: 1440, height: 1200 })
const manifest = []
for (const u of SLUGS) {
  const full = `https://katrinisfeld.is/verkefni/${u}/`
  await page.goto(full, { waitUntil: 'networkidle2', timeout: 35000 })
  for (let i = 0; i < 14; i++) { await page.evaluate(() => scrollBy(0, 900)); await new Promise(r => setTimeout(r, 240)) }
  await new Promise(r => setTimeout(r, 1200))
  const d = await page.evaluate(() => {
    const urls = new Set()
    for (const a of document.querySelectorAll('a[href*="/wp-content/uploads/"]')) urls.add(a.href)
    for (const i of document.images) {
      const s = i.currentSrc || i.src
      if (s && s.includes('/wp-content/uploads/') && !/logo|icon|avatar/i.test(s)) urls.add(s.replace(/-\d+x\d+(?=\.\w+$)/, ''))
    }
    // body text: the paragraphs that are NOT nav/footer
    const bad = /^(HEIM|VERKEFNI|ÍTALSKAR|INSTAGRAM|STÚDÍÓIÐ|HAFA SAMBAND|©|Katrín Ísfeld ehf)/i
    const ps = [...document.querySelectorAll('p, h1, h2, h3')]
      .map(e => ({ tag: e.tagName, t: e.innerText.trim() }))
      .filter(x => x.t.length > 3 && !bad.test(x.t))
    return { urls: [...urls], ps }
  })
  manifest.push({ slug: u, urls: d.urls, ps: d.ps })
  console.log(`${u.padEnd(48)} ${String(d.urls.length).padStart(3)} originals  ${d.ps.length} text nodes`)
}
writeFileSync(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 1))
await br.close()
