import puppeteer from 'puppeteer-core'
import { readFileSync } from 'node:fs'
const URL = process.argv[2], CPU = +(process.argv[3] || 4)
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage(); await page.setViewport({ width: 1440, height: 900 })
const cdp = await page.createCDPSession()
await page.goto(URL, { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 5000))
await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU })
await page.tracing.start({ path: '/tmp/ki-trace.json', categories: ['devtools.timeline','disabled-by-default-devtools.timeline'] })
const H = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
for (let y = 0; y < H; y += 150) {
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 700, y: 450, deltaX: 0, deltaY: 150, pointerType: 'mouse' })
  await new Promise(r => setTimeout(r, 16))
}
await new Promise(r => setTimeout(r, 500))
await page.tracing.stop()
const ev = JSON.parse(readFileSync('/tmp/ki-trace.json', 'utf8')).traceEvents
const tot = {}, cnt = {}
for (const e of ev) {
  if (e.ph !== 'X' || !e.dur) continue
  tot[e.name] = (tot[e.name] || 0) + e.dur / 1000
  cnt[e.name] = (cnt[e.name] || 0) + 1
}
const rows = Object.entries(tot).sort((a, b) => b[1] - a[1]).slice(0, 14)
for (const [n, ms] of rows) console.log(String(Math.round(ms)).padStart(6) + 'ms  ' + String(cnt[n]).padStart(5) + '×  ' + n)
// forced reflows
const fr = ev.filter(e => e.name === 'Layout' && e.args?.beginData?.stackTrace)
console.log('layouts with a JS stack (forced):', fr.length)
const fn = {}
for (const e of ev) { if (e.name === 'FunctionCall' && e.args?.data?.functionName) { const k = e.args.data.functionName + ' @' + (e.args.data.url||'').split('/').pop(); fn[k] = (fn[k]||0) + e.dur/1000 } }
console.log('top JS frames:'); for (const [k,v] of Object.entries(fn).sort((a,b)=>b[1]-a[1]).slice(0,6)) console.log('  ' + Math.round(v) + 'ms  ' + k)
await br.close()
