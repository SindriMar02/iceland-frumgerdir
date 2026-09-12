import puppeteer from 'puppeteer-core'
const URL = process.argv[2] || 'http://localhost:8791/'
const CPU = +(process.argv[3] || 4)
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--enable-gpu-benchmarking'] })
const page = await br.newPage(); await page.setViewport({ width: 1440, height: 900 })
const cdp = await page.createCDPSession()
await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU })
await page.goto(URL, { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 5000))          // let the intro finish
await page.evaluate(() => { try { sessionStorage.setItem('ki_intro_seen','1') } catch {} })

await cdp.send('Performance.enable')
const before = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m => [m.name, m.value]))

// scroll the whole page in fixed steps, measuring frame deltas in-page
const res = await page.evaluate(async () => {
  const H = document.documentElement.scrollHeight - innerHeight
  const frames = []
  let last = performance.now()
  let stop = false
  const tick = () => { const n = performance.now(); frames.push(n - last); last = n; if (!stop) requestAnimationFrame(tick) }
  requestAnimationFrame(tick)
  const STEP = 40
  for (let y = 0; y <= H; y += STEP) {
    window.scrollTo(0, y)
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))
  }
  stop = true
  frames.sort((a, b) => a - b)
  const p = q => frames[Math.min(frames.length - 1, Math.floor(frames.length * q))]
  return { n: frames.length, median: +p(0.5).toFixed(1), p90: +p(0.9).toFixed(1), p99: +p(0.99).toFixed(1), worst: +frames[frames.length-1].toFixed(1), over32: frames.filter(f => f > 32).length, scrollH: H }
})
const after = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m => [m.name, m.value]))
const d = k => +(after[k] - before[k]).toFixed(3)
console.log(`cpu×${CPU}  frames ${res.n}  median ${res.median}ms  p90 ${res.p90}  p99 ${res.p99}  worst ${res.worst}  janky(>32ms) ${res.over32}`)
console.log(`  layouts ${d('LayoutCount')}  recalcs ${d('RecalcStyleCount')}  layoutDur ${d('LayoutDuration')}s  styleDur ${d('RecalcStyleDuration')}s  scriptDur ${d('ScriptDuration')}s  taskDur ${d('TaskDuration')}s`)
await br.close()
