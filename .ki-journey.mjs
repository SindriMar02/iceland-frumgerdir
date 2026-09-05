/* The journey against its own spec: reserved height = track width - viewport
   + one viewport; the track ends exactly at the last slide; the counter-move
   never exceeds 8%; and the mobile path linearises with the inline transform
   cleared. */
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { createServer } from 'node:http'
import puppeteer from 'puppeteer-core'
const ROOT='dist-katrin'
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.avif':'image/avif','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json','.txt':'text/plain','.xml':'application/xml'}
const srv=createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=join(ROOT,p);if(existsSync(f)&&statSync(f).isDirectory())f=join(f,'index.html');if(!existsSync(f)||p.endsWith('/'))f=join(ROOT,'index.html');try{const b=readFileSync(f);r.writeHead(200,{'content-type':MIME[extname(f)]||'application/octet-stream'});r.end(b)}catch{r.writeHead(404);r.end('x')}}).listen(0)
const port=srv.address().port
const br=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'})
const page=await br.newPage(); await page.setViewport({width:1440,height:900})
await (await page.createCDPSession()).send('Emulation.setEmulatedMedia',{features:[{name:'hover',value:'hover'},{name:'pointer',value:'fine'}]})
await page.goto(`http://localhost:${port}/`,{waitUntil:'networkidle0'})
await page.evaluate(()=>{document.querySelector('.ki-curtain')?.remove();document.documentElement.style.scrollBehavior='auto'})
await new Promise(r=>setTimeout(r,1600))
const g=await page.evaluate(()=>{
  const sec=document.querySelector('.ki-hs'), tr=document.querySelector('.ki-hs-track')
  const r=sec.getBoundingClientRect()
  return {top:r.top+window.scrollY, h:Math.round(r.height), track:tr.scrollWidth, vw:innerWidth, vh:innerHeight,
          slides:[...document.querySelectorAll('.ki-hs-slide')].map(e=>`${e.className.replace('ki-hs-slide ','')}:${Math.round(e.getBoundingClientRect().width)}`),
          doc:document.documentElement.scrollHeight}})
console.log('track', g.track, 'reserved', g.h, 'expected', g.track-g.vw+g.vh, g.h===g.track-g.vw+g.vh?'OK':'MISMATCH')
console.log('slides', g.slides.join('  '))
console.log('page total', g.doc)
const span=g.h-g.vh
let worst=0
for (const p of [0,0.12,0.25,0.38,0.5,0.62,0.75,0.88,1]) {
  for(let k=0;k<3;k++){await page.evaluate(y=>{window.scrollTo(0,y);window.dispatchEvent(new Event('scroll'))},g.top+span*p);await new Promise(r=>setTimeout(r,130))}
  await new Promise(r=>setTimeout(r,400))
  const m=await page.evaluate(()=>{
    const t=document.querySelector('.ki-hs-track').style.transform
    const xs=[...document.querySelectorAll('.ki-hs-img img')].map(i=>{const v=/translate3d\(([-\d.]+)%/.exec(i.style.transform); return v?Math.abs(parseFloat(v[1])):0})
    return {t, maxShift:Math.max(...xs)}})
  worst=Math.max(worst,m.maxShift)
  if ([0,0.25,0.5,0.75,1].includes(p)) await page.screenshot({path:`/tmp/ki-gate/J-${String(Math.round(p*100)).padStart(3,'0')}.png`})
}
console.log('worst counter-move', worst.toFixed(2)+'%', worst<=8.01?'within spec (8%)':'OVER')
await page.close()
// mobile linearises?
const m=await br.newPage(); await m.setViewport({width:390,height:844,isMobile:true,hasTouch:true})
await (await m.createCDPSession()).send('Emulation.setEmulatedMedia',{features:[{name:'hover',value:'none'},{name:'pointer',value:'coarse'}]})
await m.goto(`http://localhost:${port}/`,{waitUntil:'networkidle0'})
await m.evaluate(()=>{document.querySelector('.ki-curtain')?.remove()})
await new Promise(r=>setTimeout(r,1400))
console.log('mobile', await m.evaluate(()=>{
  const sec=document.querySelector('.ki-hs'), tr=document.querySelector('.ki-hs-track')
  return `section height ${sec.style.height||'(auto)'} · track transform ${getComputedStyle(tr).transform} · direction ${getComputedStyle(tr).flexDirection} · doc overflow-x ${document.documentElement.scrollWidth>innerWidth?'OVERFLOW '+document.documentElement.scrollWidth:'none'}`}))
await br.close(); srv.close()
