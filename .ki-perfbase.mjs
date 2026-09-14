/* Performance baseline per route, as a mid-range phone: 390x844 at DPR 3,
   CPU throttled 4x. Per route: JS transferred, images and bytes loaded
   before any scroll and after a full scroll, LCP, CLS, long tasks (count and
   total ms over 50) during a scripted scroll, and the worst scroll frame.
   Usage: node .ki-perfbase.mjs <base-url> <route> [<route> ...] */
import puppeteer from 'puppeteer-core'
const [base, ...routes] = process.argv.slice(2)
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
for (const r of routes) {
  const p = await br.newPage()
  await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true })
  const cdp = await p.createCDPSession()
  await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  const bytes = { js: 0, img: 0, imgN: 0, font: 0 }; const imgs = new Set()
  cdp.on('Network.loadingFinished', (e) => { const t = reqs.get(e.requestId); if (!t) return
    if (t.type === 'Script') bytes.js += e.encodedDataLength
    if (t.type === 'Image') { bytes.img += e.encodedDataLength; bytes.imgN++; imgs.add(t.url.split('/').pop()) }
    if (t.type === 'Font') bytes.font += e.encodedDataLength })
  const reqs = new Map(); cdp.on('Network.requestWillBeSent', (e) => reqs.set(e.requestId, { type: e.type, url: e.request.url }))
  await p.evaluateOnNewDocument(() => {
    window.__perf = { lcp: 0, cls: 0, long: [] }
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__perf.lcp = e.startTime }).observe({ type: 'largest-contentful-paint', buffered: true })
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__perf.cls += e.value }).observe({ type: 'layout-shift', buffered: true })
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__perf.long.push(e.duration) }).observe({ type: 'longtask', buffered: true })
  })
  await p.goto(base + r, { waitUntil: 'networkidle0', timeout: 90000 }); await new Promise((x) => setTimeout(x, 2500))
  const atLoad = { img: bytes.img, imgN: bytes.imgN, js: bytes.js, font: bytes.font }
  const load = await p.evaluate(() => ({ lcp: Math.round(window.__perf.lcp), cls: +window.__perf.cls.toFixed(4), longN: window.__perf.long.length, longMs: Math.round(window.__perf.long.reduce((a, d) => a + Math.max(0, d - 50), 0)) }))
  const scroll = await p.evaluate(async () => {
    window.__perf.long = []; const H = document.documentElement.scrollHeight - innerHeight; const gaps = []; let last = performance.now()
    for (let y = 0; y <= H; y += 120) { scrollTo({ top: y, behavior: 'instant' }); await new Promise((x) => setTimeout(x, 16)); const n = performance.now(); gaps.push(n - last); last = n }
    await new Promise((x) => setTimeout(x, 800))
    gaps.sort((a, b) => b - a)
    return { steps: gaps.length, worstStep: Math.round(gaps[0]), p95: Math.round(gaps[Math.floor(gaps.length * 0.05)]), longN: window.__perf.long.length, longMs: Math.round(window.__perf.long.reduce((a, d) => a + Math.max(0, d - 50), 0)) }
  })
  await new Promise((x) => setTimeout(x, 1500))
  const kb = (n) => Math.round(n / 1024)
  console.log(`${r.padEnd(40)} load: js ${kb(atLoad.js)}KB font ${kb(atLoad.font)}KB img ${atLoad.imgN}/${kb(atLoad.img)}KB lcp ${load.lcp}ms cls ${load.cls} long ${load.longN}/${load.longMs}ms | scroll: img ${bytes.imgN}/${kb(bytes.img)}KB long ${scroll.longN}/${scroll.longMs}ms step p95 ${scroll.p95}ms worst ${scroll.worstStep}ms`)
  if (r === '/') console.log('   hero images at load:', [...imgs].filter((u) => /s-eldhus-vitt|f-stofa|fjallalind-4|freyja-0|skuggahverfi-0|olfus-0|kopavogur-4/.test(u)).join(' '))
  await p.close()
}
await br.close()
