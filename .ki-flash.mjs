import puppeteer from 'puppeteer-core'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const p = await br.newPage(); await p.setViewport({ width: 1440, height: 900 })
// throttle so any hydration gap is wide enough to catch
const cdp = await p.createCDPSession()
await cdp.send('Network.enable')
await cdp.send('Network.emulateNetworkConditions', { offline:false, latency:150, downloadThroughput: 700*1024, uploadThroughput: 400*1024 })
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
await p.evaluateOnNewDocument(() => {
  window.__gaps = []; window.__t0 = performance.now()
  const tick = () => {
    const hero = document.querySelector('.parallax__header')
    const name = document.querySelector('.ki-plx-name')
    window.__gaps.push([Math.round(performance.now() - window.__t0), !!hero, !!name, document.getElementById('root')?.children.length ?? 0])
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})
await p.goto(process.argv[2], { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 1200))
const g = await p.evaluate(() => window.__gaps)
const missing = g.filter(([,hero,name]) => !hero || !name)
console.log('frames sampled:', g.length)
console.log('frames with the hero or wordmark MISSING:', missing.length)
if (missing.length) console.log('   first few:', JSON.stringify(missing.slice(0,6)))
console.log('root children over time:', [...new Set(g.map(x=>x[3]))].join(','))
console.log('first sample:', JSON.stringify(g[0]), ' last:', JSON.stringify(g[g.length-1]))
await br.close()
