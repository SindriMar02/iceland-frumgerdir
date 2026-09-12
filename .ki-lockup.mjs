import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage(); await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true })
await (await page.createCDPSession()).send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] })
const t0 = Date.now()
await page.goto(process.argv[2], { waitUntil: 'domcontentloaded' })
for (const at of [800, 1600, 2600, 4000, 6000]) {
  const w = at - (Date.now() - t0); if (w > 0) await new Promise(r => setTimeout(r, w))
  console.log(String(at).padStart(5), JSON.stringify(await page.evaluate(() => {
    const g = s => { const e = document.querySelector(s); if (!e) return null
      const cs = getComputedStyle(e), r = e.getBoundingClientRect()
      return { h: Math.round(r.height), ov: cs.overflow, t: cs.transform === 'none' ? 'none' : Math.round(new DOMMatrix(cs.transform).m42) } }
    return { attr: document.documentElement.dataset.kiIntro || '-',
      roleBox: g('.ki-plx-role'), roleSpan: g('.ki-plx-role > span'),
      tagBox: g('.ki-plx-tag'), tagSpan: g('.ki-plx-tag > span') }
  })))
}
await page.screenshot({ path: '/tmp/ki-lock-m.png' })
await br.close()
