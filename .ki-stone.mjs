import puppeteer from 'puppeteer-core'
import { readFileSync } from 'node:fs'
const [url, y0, y1, tag] = [process.argv[2], +process.argv[3], +process.argv[4], process.argv[5]||'x']
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage(); await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
const cdp = await page.createCDPSession()
await page.goto(url, { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 4500))
await page.evaluate(y => window.scrollTo(0, y), y0); await new Promise(r => setTimeout(r, 900))
await page.tracing.start({ path: `/tmp/ki-stone-${tag}.json`, categories: ['devtools.timeline','disabled-by-default-devtools.timeline'] })
const steps = Math.round((y1 - y0) / 60)
for (let i = 0; i < steps; i++) { await cdp.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 700, y: 450, deltaX: 0, deltaY: 60, pointerType: 'mouse' }); await new Promise(r => setTimeout(r, 16)) }
await new Promise(r => setTimeout(r, 500)); await page.tracing.stop()
const ev = JSON.parse(readFileSync(`/tmp/ki-stone-${tag}.json`, 'utf8')).traceEvents
const tot = {}, cnt = {}
for (const e of ev) { if (e.ph !== 'X' || !e.dur) continue; tot[e.name] = (tot[e.name]||0) + e.dur/1000; cnt[e.name] = (cnt[e.name]||0) + 1 }
const pick = ['RunTask','Paint','RasterTask','Commit','Layerize','UpdateLayerTree','PrePaint','UpdateLayoutTree','FunctionCall','EventDispatch','ImageDecodeTask','Decode LazyPixelRef','GPUTask','DrawFrame']
console.log(`${tag}  y${y0}-${y1}  ${steps} steps`)
for (const n of pick) if (tot[n]) console.log('   ' + String(Math.round(tot[n])).padStart(5) + 'ms ' + String(cnt[n]).padStart(5) + 'x  ' + n)
await br.close()
