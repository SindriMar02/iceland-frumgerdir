import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const p = await br.newPage(); await p.setViewport({ width: 1440, height: 1400 })
await p.goto('https://katrinisfeld.is/verkefni/ymislegt/fjolmidlar/', { waitUntil: 'networkidle2' })
for (let i = 0; i < 12; i++) { await p.evaluate(() => scrollBy(0, 800)); await new Promise(r => setTimeout(r, 260)) }
await new Promise(r => setTimeout(r, 1500))
console.log(JSON.stringify(await p.evaluate(() => {
  const bad = /^(HEIM|VERKEFNI|ÍTALSKAR|INSTAGRAM|STÚDÍÓIÐ|HAFA SAMBAND|©)/i
  return {
    links: [...document.querySelectorAll('a[href]')].map(a => ({ t: a.innerText.trim().slice(0,90), h: a.href }))
      .filter(l => l.h && !l.h.includes('katrinisfeld.is') && !l.h.startsWith('tel') && !l.h.startsWith('mailto')),
    imgs: [...new Set([...document.querySelectorAll('a[href*="/wp-content/uploads/"]')].map(a => a.href)
      .concat([...document.images].map(i => (i.currentSrc||'').replace(/-\d+x\d+(?=\.\w+$)/,''))))].filter(u=>u.includes('uploads')),
    text: [...document.querySelectorAll('p,h1,h2,h3,h4,figcaption')].map(e=>e.innerText.trim()).filter(t=>t.length>3 && !bad.test(t)),
  }
}), null, 1))
await br.close()
