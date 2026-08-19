/* Harvest both candidates: their own sites' full-res photos + the Airbnb
   listing's photo set, facts and review quotes. URLs only in this pass;
   download and eyes-on selection happen next. */
import puppeteer from 'puppeteer-core'
import fs from 'node:fs'
const OUT = process.argv[2]
fs.mkdirSync(OUT, { recursive: true })
const UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
const b = await puppeteer.launch({ executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless:'new', args:['--no-sandbox','--lang=en-US'], protocolTimeout:300000 })

const collect = async (url, extractor, settle=6000) => {
  const p = await b.newPage(); await p.setViewport({width:1600,height:1200}); await p.setUserAgent(UA)
  try {
    await p.goto(url, {waitUntil:'domcontentloaded', timeout:90000})
    await new Promise(r=>setTimeout(r,settle))
    // lazy-load sweep
    for (let i=0;i<6;i++){ await p.evaluate(()=>window.scrollBy(0,1400)); await new Promise(r=>setTimeout(r,800)) }
    const out = await p.evaluate(extractor)
    await p.close(); return out
  } catch(e){ await p.close().catch(()=>{}); return {err:e.message.slice(0,90)} }
}

const siteImgs = () => {
  const urls = new Set()
  for (const img of document.querySelectorAll('img')) {
    for (const u of [img.currentSrc, img.src, ...(img.srcset||'').split(',').map(s=>s.trim().split(' ')[0])]) {
      if (u && /^https?/.test(u)) urls.add(u)
    }
  }
  // wix/wp backgrounds
  for (const el of document.querySelectorAll('*')) {
    const bg = getComputedStyle(el).backgroundImage
    const m = bg && bg.match(/url\("(https?[^"]+)"\)/)
    if (m) urls.add(m[1])
  }
  const html = document.documentElement.outerHTML
  for (const m of html.matchAll(/https:\/\/static\.wixstatic\.com\/media\/[^"'\\)\s]+/g)) urls.add(m[0])
  for (const m of html.matchAll(/https:\/\/[^"'\\)\s]*wp-content\/uploads\/[^"'\\)\s]+\.(?:jpe?g|png|webp)/gi)) urls.add(m[0])
  return { images: [...urls], text: document.body.innerText.replace(/\s+/g,' ').slice(0, 3000) }
}

const airbnb = () => {
  const html = document.documentElement.outerHTML
  const pics = new Set()
  for (const m of html.matchAll(/https:\/\/a0\.muscache\.com\/im\/pictures\/[^"'\\\s]+/g)) {
    let u = m[0].replace(/\\u0026/g,'&').replace(/&amp;/g,'&')
    u = u.split('?')[0]
    if (!/user|profile/i.test(u)) pics.add(u)
  }
  const t = document.body.innerText.replace(/\s+/g,' ')
  return {
    photos: [...pics],
    title: document.title,
    rating: (t.match(/([\d.]+)\s*·?\s*(\d+)\s*reviews?/i)||[])[0] || null,
    text: t.slice(0, 6000),
  }
}

const targets = [
  ['laxfoss-site-home',   'https://www.laxfoss.org/', siteImgs],
  ['laxfoss-site-lodge',  'https://www.laxfoss.org/our-lodge', siteImgs],
  ['laxfoss-airbnb',      'https://www.airbnb.com/rooms/48712789?adults=2&check_in=2026-09-15&check_out=2026-09-18', airbnb],
  ['gc-site-home',        'https://glasscottages.com/', siteImgs],
  ['gc-site-cottages',    'https://glasscottages.com/cottages/', siteImgs],
  ['gc-site-gallery',     'https://glasscottages.com/gallery/', siteImgs],
  ['gc-site-about',       'https://glasscottages.com/about-us/', siteImgs],
  ['gc-airbnb',           'https://www.airbnb.com/rooms/42164367?adults=2&check_in=2026-09-15&check_out=2026-09-18', airbnb],
]
for (const [name, url, ex] of targets) {
  const r = await collect(url, ex)
  fs.writeFileSync(`${OUT}/${name}.json`, JSON.stringify(r, null, 1))
  console.log(`${name.padEnd(22)} ${r.err ? 'ERR '+r.err : (r.images?.length ?? r.photos?.length) + ' images' + (r.rating ? '   ' + r.rating : '')}`)
}
await b.close()
