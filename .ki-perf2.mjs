import puppeteer from 'puppeteer-core'
const URL = process.argv[2] || 'http://localhost:8791/'
const CPU = +(process.argv[3] || 4)
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage(); await page.setViewport({ width: 1440, height: 900 })
const cdp = await page.createCDPSession()
await page.goto(URL, { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 5000))
const info = await page.evaluate(() => ({ scrollH: document.documentElement.scrollHeight, lenis: !!document.documentElement.className.match(/lenis/), cls: document.documentElement.className, gsap: !!window.gsap }))
console.log('page', JSON.stringify(info))
await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU })
await cdp.send('Performance.enable')
const before = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m => [m.name, m.value]))
await page.evaluate(() => { window.__f = []; let last = performance.now(); window.__stop = false
  const t = () => { const n = performance.now(); window.__f.push(n - last); last = n; if (!window.__stop) requestAnimationFrame(t) }; requestAnimationFrame(t) })
// real wheel gestures, which is what Lenis listens to
const H = info.scrollH - 900
let y = 0
while (y < H) {
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 700, y: 450, deltaX: 0, deltaY: 120, pointerType: 'mouse' })
  y += 120
  await new Promise(r => setTimeout(r, 16))
}
await new Promise(r => setTimeout(r, 600))
const res = await page.evaluate(() => { window.__stop = true; const f = window.__f.slice().sort((a,b)=>a-b)
  const p = q => f[Math.min(f.length-1, Math.floor(f.length*q))]
  return { n: f.length, median: +p(.5).toFixed(1), p90: +p(.9).toFixed(1), p99: +p(.99).toFixed(1), worst: +f[f.length-1].toFixed(1), over32: f.filter(x=>x>32).length, over50: f.filter(x=>x>50).length, endY: Math.round(scrollY) } })
const after = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m => [m.name, m.value]))
const d = k => +(after[k] - before[k]).toFixed(3)
console.log(`cpu×${CPU} frames ${res.n} median ${res.median}ms p90 ${res.p90} p99 ${res.p99} worst ${res.worst} janky>32 ${res.over32} >50 ${res.over50} endY ${res.endY}`)
console.log(`  layouts ${d('LayoutCount')} recalcs ${d('RecalcStyleCount')} layoutDur ${d('LayoutDuration')}s styleDur ${d('RecalcStyleDuration')}s scriptDur ${d('ScriptDuration')}s taskDur ${d('TaskDuration')}s`)
await br.close()
