import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const p = await br.newPage(); await p.setViewport({ width: 430, height: 932, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await (await p.createCDPSession()).send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] })
await p.goto(process.argv[2], { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 2500))
console.log(JSON.stringify(await p.evaluate(() => {
  const r = s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { t: Math.round(b.top), h: Math.round(b.height), w: Math.round(b.width) } }
  return { hero: r('.ki-proj-hero'), heroImg: r('.ki-proj-hero img'), cover: r('.ki-proj-cover'), gallery: r('.ki-proj-gallery'),
    galleryKids: [...document.querySelectorAll('.ki-proj-gallery > *')].map(e => Math.round(e.getBoundingClientRect().width)) }
})))
await p.screenshot({ path: '/tmp/ki-mtop.png' })
await br.close()
