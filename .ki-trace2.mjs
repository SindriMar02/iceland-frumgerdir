import puppeteer from 'puppeteer-core'
import { readFileSync } from 'node:fs'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage(); await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
const cdp = await page.createCDPSession()
await page.goto(process.argv[2], { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 4500))
await page.evaluate(() => window.scrollTo(0, 16400)); await new Promise(r => setTimeout(r, 900))
await cdp.send('Emulation.setCPUThrottlingRate', 4 ? { rate: 4 } : { rate: 1 })
await page.tracing.start({ path: '/tmp/ki-t2.json', categories: ['devtools.timeline','disabled-by-default-devtools.timeline'] })
for (let i = 0; i < 26; i++) { await cdp.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 700, y: 450, deltaX: 0, deltaY: 150, pointerType: 'mouse' }); await new Promise(r => setTimeout(r, 16)) }
await new Promise(r => setTimeout(r, 400)); await page.tracing.stop()
const ev = JSON.parse(readFileSync('/tmp/ki-t2.json','utf8')).traceEvents
const tot={},cnt={}
for (const e of ev) { if (e.ph!=='X'||!e.dur) continue; tot[e.name]=(tot[e.name]||0)+e.dur/1000; cnt[e.name]=(cnt[e.name]||0)+1 }
for (const [n,ms] of Object.entries(tot).sort((a,b)=>b[1]-a[1]).slice(0,12)) console.log(String(Math.round(ms)).padStart(5)+'ms '+String(cnt[n]).padStart(5)+'x  '+n)
const imgs={}
for (const e of ev) if (/Decode|PaintImage/.test(e.name)&&e.dur) { const u=(e.args?.data?.url||e.args?.imageUrl||'?').split('/').pop(); imgs[u]=(imgs[u]||0)+e.dur/1000 }
console.log('image work:'); for (const [k,v] of Object.entries(imgs).sort((a,b)=>b[1]-a[1]).slice(0,6)) console.log('  '+Math.round(v)+'ms '+k)
await br.close()
