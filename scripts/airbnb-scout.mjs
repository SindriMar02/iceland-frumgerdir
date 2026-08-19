/* Read Airbnb's public Iceland results filtered to expensive stays.
 * Verifies the criterion FIRST (price + review volume), so a candidate never
 * reaches the site-audit stage unless it is genuinely a premium listing. */
import puppeteer from 'puppeteer-core'
const UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
const b = await puppeteer.launch({ executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless:'new', args:['--no-sandbox','--lang=en-US'], protocolTimeout:240000 })
const seen = new Map()
const pages = [
  'https://www.airbnb.com/s/Iceland/homes?checkin=2026-09-15&checkout=2026-09-18&adults=2&price_min=600&room_types%5B%5D=Entire%20home%2Fapt',
  'https://www.airbnb.com/s/Iceland/homes?checkin=2026-09-15&checkout=2026-09-18&adults=2&price_min=600&room_types%5B%5D=Entire%20home%2Fapt&items_offset=18',
  'https://www.airbnb.com/s/Iceland/homes?checkin=2026-01-20&checkout=2026-01-23&adults=2&price_min=500&room_types%5B%5D=Entire%20home%2Fapt',
]
for (const url of pages) {
  const p = await b.newPage(); await p.setViewport({width:1600,height:1400}); await p.setUserAgent(UA)
  try {
    await p.goto(url, {waitUntil:'domcontentloaded', timeout:90000})
    await new Promise(r=>setTimeout(r,12000))
    await p.evaluate(()=>window.scrollBy(0,3000)); await new Promise(r=>setTimeout(r,4000))
    const cards = await p.evaluate(()=>[...document.querySelectorAll('[itemprop="itemListElement"]')].map(c=>{
      const t=c.innerText.replace(/\s+/g,' ')
      const a=c.querySelector('a[href*="/rooms/"]')
      return { name: t.slice(0,110),
        id: a ? (a.getAttribute('href').match(/\/rooms\/(\d+)/)||[])[1] : null,
        price: (t.match(/\$[\d,]{3,}/g)||[]).pop() || '-',
        rating: (t.match(/([\d.]+)\s*\((\d+)\)/)||[]).slice(1).join(' / ') || '-' }
    }))
    cards.filter(c=>c.id).forEach(c=>{ if(!seen.has(c.id)) seen.set(c.id,c) })
  } catch(e){ console.log('page failed', e.message.slice(0,60)) }
  await p.close()
}
const rows=[...seen.values()]
  .map(c=>({...c, n: parseInt((c.rating.split(' / ')[1]||'0'),10), p: parseInt((c.price.replace(/[^0-9]/g,''))||'0',10)}))
  .filter(c=>c.n>=25)                       // proven volume, not a brand-new listing
  .sort((a,b)=>b.p-a.p)
console.log(`${seen.size} listings read, ${rows.length} with 25+ reviews\n`)
console.log('  price     rating/reviews   room id      title')
rows.slice(0,22).forEach(c=>console.log(`  ${c.price.padStart(8)}  ${c.rating.padStart(12)}   ${String(c.id).padEnd(12)} ${c.name.replace(/^(Guest favorite |Top guest favorite |Superhost )+/,'').slice(0,60)}`))
await b.close()
