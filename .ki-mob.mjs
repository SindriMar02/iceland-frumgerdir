import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { createServer } from 'node:http'
import puppeteer from 'puppeteer-core'
const ROOT='dist-katrin'
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.avif':'image/avif','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json','.txt':'text/plain','.xml':'application/xml'}
const srv=createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=join(ROOT,p);if(existsSync(f)&&statSync(f).isDirectory())f=join(f,'index.html');if(!existsSync(f)||p.endsWith('/'))f=join(ROOT,'index.html');try{const b=readFileSync(f);r.writeHead(200,{'content-type':MIME[extname(f)]||'application/octet-stream'});r.end(b)}catch{r.writeHead(404);r.end('x')}}).listen(0)
const port=srv.address().port
const br=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'})
const page=await br.newPage()
await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true})
await (await page.createCDPSession()).send('Emulation.setEmulatedMedia',{features:[{name:'hover',value:'none'},{name:'pointer',value:'coarse'}]})
await page.goto(`http://localhost:${port}/`,{waitUntil:'networkidle0'})
await page.evaluate(()=>{document.querySelector('.ki-curtain')?.remove();document.documentElement.style.scrollBehavior='auto'})
await new Promise(r=>setTimeout(r,1000))
const top = await page.evaluate(()=>{const e=document.querySelector('.ki-hs');return e.getBoundingClientRect().top+window.scrollY})
for (const [n,dy,sl] of [['m-pass-a',0,0],['m-pass-b',0,900],['m-pass-c',0,2600]]) {
  await page.evaluate((y,sl)=>{window.scrollTo(0,y);const t=document.querySelector('.ki-hs-track');t.scrollLeft=sl;t.dispatchEvent(new Event('scroll'));window.dispatchEvent(new Event('scroll'))}, top+dy, sl)
  await new Promise(r=>setTimeout(r,350))
  await page.screenshot({path:`/tmp/ki-gate/${n}.png`})
}
const st = await page.evaluate(()=>{
  const sec=document.querySelector('.ki-hs'), pin=document.querySelector('.ki-hs-pin')
  const rock=document.querySelector('.ki-hs-rock'), tr=document.querySelector('.ki-hs-track')
  const R=(e)=>{const r=e.getBoundingClientRect();return `${Math.round(r.top)}..${Math.round(r.bottom)} (h ${Math.round(r.height)})`}
  return { sec:R(sec), pin:R(pin), rock:R(rock), track:R(tr),
    trackScrollW: tr.scrollWidth, trackClientW: tr.clientWidth,
    over:[...document.querySelectorAll('.ki-hs-over')].map(e=>R(e)+' '+getComputedStyle(e).transform) }
})
console.log(JSON.stringify(st,null,1))
await br.close(); srv.close()
