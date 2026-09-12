import puppeteer from 'puppeteer-core'
import { writeFileSync } from 'node:fs'
const urls = ['innanhusshonnun/fjallalind','innanhusshonnun/hus-i-kopavogi','innanhusshonnun/laugalaekur','innanhusshonnun/sumarhus-olfusi','gistiheimili-hotel/hotel-hekla','ymislegt/fjolmidlar','ymislegt/stemning','innanhusshonnun/nybyggt-hus-i-suluhofda','innanhusshonnun/badherbergi','innanhusshonnun/hus-i-gardabae','innanhusshonnun/barnaherbergi','gistiheimili-hotel/svala-apartments','gistiheimili-hotel/solvallagata','gistiheimili-hotel/old-charm-apt','atvinnuhusnaedi/tannlaeknastofa','atvinnuhusnaedi/skrifstofurymi','innanhusshonnun/honnunar-studio','innanhusshonnun/alfheimar','innanhusshonnun/eldhusrymi','innanhusshonnun/eldhusrymi-i-skandinaviskum-stil','innanhusshonnun/eldhusrymi-i-skuggahverfi','innanhusshonnun/sumarhus-fljotshlid','gistiheimili-hotel/freyja-gistiheimili','gistiheimili-hotel/freyja-luxusibud']
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage(); await page.setViewport({ width: 1440, height: 1200 })
const out = []
for (const u of urls) {
  const full = `https://katrinisfeld.is/verkefni/${u}/`
  try {
    await page.goto(full, { waitUntil: 'networkidle2', timeout: 30000 })
    for (let i = 0; i < 12; i++) { await page.evaluate(() => scrollBy(0, 900)); await new Promise(r => setTimeout(r, 260)) }
    await new Promise(r => setTimeout(r, 1400))
    const d = await page.evaluate(() => {
      const uniq = new Map()
      for (const i of document.images) {
        const s = i.currentSrc || i.src
        if (!s || /logo|icon|avatar|placeholder/i.test(s)) continue
        const base = s.split('/').pop().replace(/-\d+x\d+(?=\.\w+$)/, '')
        if (!uniq.has(base) || i.naturalWidth > uniq.get(base).w) uniq.set(base, { w: i.naturalWidth, h: i.naturalHeight, src: s })
      }
      // also gallery links to full-size files
      for (const a of document.querySelectorAll('a[href*="/wp-content/uploads/"]')) {
        const base = a.href.split('/').pop().replace(/-\d+x\d+(?=\.\w+$)/, '')
        if (!uniq.has(base)) uniq.set(base, { w: 0, h: 0, src: a.href })
      }
      const main = document.querySelector('.entry-content, main, article') || document.body
      const ps = [...main.querySelectorAll('p, h2, h3, li')].map(e => e.innerText.trim()).filter(t => t.length > 2)
      return { title: document.title, imgs: [...uniq.entries()].map(([k, v]) => `${k} ${v.w}x${v.h}`), paras: ps }
    })
    out.push({ slug: u, ...d })
    console.log(`${u.padEnd(48)} imgs:${String(d.imgs.length).padStart(3)}  paras:${d.paras.length}`)
  } catch (e) { console.log(u, 'ERR', e.message.slice(0, 50)); out.push({ slug: u, error: e.message }) }
}
writeFileSync('/tmp/ki-her-content.json', JSON.stringify(out, null, 1))
await br.close()
