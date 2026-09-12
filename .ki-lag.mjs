import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage(); await page.setViewport({ width: 1440, height: 900 })
const cdp = await page.createCDPSession()
await page.goto(process.argv[2], { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 5000))
const kill = process.argv[3] === 'nolenis'
if (kill) await page.evaluate(() => { document.documentElement.classList.remove('lenis','lenis-smooth') })
// one wheel tick of 300px: how long until the page stops moving, and how far it goes
await page.evaluate(() => { window.__t = []; const f = () => { window.__t.push([performance.now(), scrollY]); requestAnimationFrame(f) }; requestAnimationFrame(f) })
await page.evaluate(() => window.scrollTo(0, 6000))
await new Promise(r => setTimeout(r, 1200))
await page.evaluate(() => { window.__t.length = 0; window.__t0 = performance.now() })
await cdp.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 700, y: 450, deltaX: 0, deltaY: 300, pointerType: 'mouse' })
await new Promise(r => setTimeout(r, 1600))
console.log(JSON.stringify(await page.evaluate(() => {
  const t = window.__t, t0 = window.__t0, y0 = t[0][1]
  const target = t[t.length - 1][1]
  const dist = target - y0
  const at = (frac) => { const want = y0 + dist * frac; const hit = t.find(([, y]) => y >= want - 0.5); return hit ? Math.round(hit[0] - t0) : null }
  return { moved: Math.round(dist), lenis: document.documentElement.classList.contains('lenis'),
    ms_to_10pct: at(0.1), ms_to_50pct: at(0.5), ms_to_90pct: at(0.9), ms_to_99pct: at(0.99) }
})))
await br.close()
