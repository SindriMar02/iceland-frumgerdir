import puppeteer from 'puppeteer-core'
import { readFileSync } from 'node:fs'
const [url, tag] = [process.argv[2], process.argv[3]]
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage(); await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
const cdp = await page.createCDPSession()
await page.goto(url, { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 3000))
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
await page.tracing.start({ path: `/tmp/t-${tag}.json`, categories: ['devtools.timeline','disabled-by-default-devtools.timeline'] })
const H = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
const steps = Math.min(90, Math.round(H / 150))
for (let i = 0; i < steps; i++) { await cdp.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 700, y: 450, deltaX: 0, deltaY: 150, pointerType: 'mouse' }); await new Promise(r => setTimeout(r, 16)) }
await new Promise(r => setTimeout(r, 600)); await page.tracing.stop()
const ev = JSON.parse(readFileSync(`/tmp/t-${tag}.json`,'utf8')).traceEvents
const tot = {}, cnt = {}
for (const e of ev) { if (e.ph !== 'X' || !e.dur) continue; tot[e.name] = (tot[e.name]||0)+e.dur/1000; cnt[e.name] = (cnt[e.name]||0)+1 }
console.log(`\n${tag}  (${steps} wheel steps over ${H}px, 4x CPU, DPR2)`)
for (const n of ['RunTask','ImageDecodeTask','Decode LazyPixelRef','FunctionCall','EventDispatch','UpdateLayoutTree','Layout','Paint','RasterTask','Commit','Layerize','ParseHTML','EvaluateScript'])
  if (tot[n]) console.log('   '+String(Math.round(tot[n])).padStart(5)+'ms '+String(cnt[n]).padStart(5)+'x  '+n)
await br.close()
