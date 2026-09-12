import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage(); await page.setViewport({ width: 1440, height: 900 })
const cdp = await page.createCDPSession()
await page.goto(process.argv[2], { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 5000))
const runs = []
for (let k = 0; k < 6; k++) {
  await page.evaluate(y => window.scrollTo(0, y), 5000 + k * 900)
  await new Promise(r => setTimeout(r, 1100))
  await page.evaluate(() => { window.__t = []; const f = () => { window.__t.push([performance.now(), scrollY]); requestAnimationFrame(f) }; requestAnimationFrame(f); window.__t0 = performance.now() })
  await new Promise(r => setTimeout(r, 40))
  await page.evaluate(() => { window.__t.length = 0; window.__t0 = performance.now() })
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 700, y: 450, deltaX: 0, deltaY: 300, pointerType: 'mouse' })
  await new Promise(r => setTimeout(r, 1500))
  runs.push(await page.evaluate(() => {
    const t = window.__t, t0 = window.__t0, y0 = t[0][1], dist = t[t.length-1][1] - y0
    const at = f => { const h = t.find(([, y]) => y >= y0 + dist * f); return h ? Math.round(h[0] - t0) : null }
    return { d: Math.round(dist), a50: at(.5), a90: at(.9), a99: at(.99) }
  }))
}
const med = k => { const v = runs.map(r => r[k]).filter(Boolean).sort((a,b)=>a-b); return v[Math.floor(v.length/2)] }
console.log(`lenis=${await page.evaluate(()=>document.documentElement.classList.contains('lenis'))}  n=${runs.length}  median 50%:${med('a50')}ms  90%:${med('a90')}ms  99%:${med('a99')}ms   raw ${JSON.stringify(runs.map(r=>r.a90))}`)
await br.close()
