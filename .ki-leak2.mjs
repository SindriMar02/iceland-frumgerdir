import puppeteer from 'puppeteer-core'
import { PNG } from 'pngjs'
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await br.newPage(); await page.setViewport({ width: 1440, height: 900 })
await page.goto('http://localhost:5411/preview/katrinisfeld', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 4200))
await page.evaluate(() => document.querySelectorAll('.ki-newest, .ki-newest *').forEach(e => e.style.animation = 'none'))
const a = PNG.sync.read(await page.screenshot())
await page.evaluate(() => { document.querySelector('[data-parallax-deep]').style.visibility = 'hidden' })
const b = PNG.sync.read(await page.screenshot())
let n=0, x0=1e9,y0=1e9,x1=0,y1=0
for (let i = 0; i < a.data.length; i += 4) if (Math.abs(a.data[i]-b.data[i]) + Math.abs(a.data[i+1]-b.data[i+1]) + Math.abs(a.data[i+2]-b.data[i+2]) > 24) { n++; const p=i/4, x=p%1440, y=(p/1440)|0; x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y) }
console.log('diff px', n, n? `bbox x${x0}-${x1} y${y0}-${y1}`:'')
console.log(JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('.ki-strata-title [data-parallax-word]')].map(e => { const m=e.parentElement.getBoundingClientRect(), r=e.getBoundingClientRect(); return {maskBottom:Math.round(m.bottom), wordTop:Math.round(r.top)} }))))
await br.close()
