import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { createServer } from 'node:http'
import puppeteer from 'puppeteer-core'
const ROOT='dist-katrin'
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.avif':'image/avif','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json','.txt':'text/plain','.xml':'application/xml'}
const srv=createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=join(ROOT,p);if(existsSync(f)&&statSync(f).isDirectory())f=join(f,'index.html');if(!existsSync(f)||p.endsWith('/'))f=join(ROOT,'index.html');try{const b=readFileSync(f);r.writeHead(200,{'content-type':MIME[extname(f)]||'application/octet-stream'});r.end(b)}catch{r.writeHead(404);r.end('x')}}).listen(0)
const port=srv.address().port
const br=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'})
const page=await br.newPage(); await page.setViewport({width:1280,height:800})
await (await page.createCDPSession()).send('Emulation.setEmulatedMedia',{features:[{name:'hover',value:'hover'},{name:'pointer',value:'fine'}]})
await page.goto(`http://localhost:${port}/`,{waitUntil:'networkidle0'})
await page.evaluate(()=>{document.querySelector('.ki-curtain')?.remove();document.documentElement.style.scrollBehavior='auto'})
await new Promise(r=>setTimeout(r,1200))
const geo = await page.evaluate(()=>{
  const S=window.scrollY, R=(e)=>{const r=e.getBoundingClientRect();return {top:r.top+S,h:r.height}}
  const g=[...document.querySelectorAll('.parallax--sticky')]
  const hs=document.querySelector('.ki-hs')
  return { hero:R(g[0]), pass:R(hs), gate:R(g[1]), doc:document.documentElement.scrollHeight,
           track: document.querySelector('.ki-hs-track').scrollWidth }
})
console.log('hero', geo.hero, '\npassage', geo.pass, '\ngate', geo.gate, '\ndoc', geo.doc, 'track', geo.track)
const shots = {
  'hero-end':   geo.hero.top + geo.hero.h - 800,
  'pass-00':    geo.pass.top,
  'pass-25':    geo.pass.top + (geo.pass.h-800)*0.25,
  'pass-50':    geo.pass.top + (geo.pass.h-800)*0.50,
  'pass-80':    geo.pass.top + (geo.pass.h-800)*0.80,
  'gate-00':    geo.gate.top,
  'gate-50':    geo.gate.top + (geo.gate.h-800)*0.50,
  'gate-99':    geo.gate.top + (geo.gate.h-800)*0.99,
  'after-gate': geo.gate.top + geo.gate.h - 400,
  'light-a':    geo.gate.top + geo.gate.h + 900,
  'light-b':    geo.doc * 0.62,
  'light-c':    geo.doc * 0.78,
  'end':        geo.doc - 900,
  'samband':    geo.doc - 1900,
}
for (const [n,y] of Object.entries(shots)) {
  for (let k=0;k<3;k++){ await page.evaluate(y=>{window.scrollTo(0,y);window.dispatchEvent(new Event('scroll'))},y); await new Promise(r=>setTimeout(r,140)) }
  await page.screenshot({path:`/tmp/ki-gate/P-${n}.png`})
}
await br.close(); srv.close(); console.log('shots ok')
