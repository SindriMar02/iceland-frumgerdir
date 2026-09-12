import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const p = await br.newPage(); await p.setViewport({ width: 440, height: 956, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await (await p.createCDPSession()).send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] })
await p.goto(process.argv[2], { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 5200))
const h = await p.evaluate(() => document.querySelector('.parallax').offsetHeight)
for (const f of [0.92, 0.98]) {
  await p.evaluate(y => window.scrollTo(0, y), Math.round(h * f - 956))
  await new Promise(r => setTimeout(r, 900))
  await p.screenshot({ path: `/tmp/ki-str-ios-${Math.round(f*100)}.png` })
}
console.log(JSON.stringify(await p.evaluate(() => {
  const r = s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { t: Math.round(b.top), b: Math.round(b.bottom), l: Math.round(b.left), w: Math.round(b.width) } }
  return { vh: innerHeight, deep: r('.ki-plx-deep--strata'), title: r('.ki-strata-title'), core: r('.ki-strata-core'),
    figs: [...document.querySelectorAll('.ki-plx-deep--strata .ki-stratum-fig')].map(e => { const b = e.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height)] }),
    line: r('.ki-plx-deep--strata .ki-strata-line'), cta: r('.ki-plx-deep--strata .ki-plx-deep-cta') }
}), null, 1))
await br.close()
