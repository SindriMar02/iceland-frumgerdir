import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { createServer } from 'node:http'
import puppeteer from 'puppeteer-core'
const ROOT='dist-katrin'
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.avif':'image/avif','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json','.txt':'text/plain','.xml':'application/xml'}
const srv=createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=join(ROOT,p);if(existsSync(f)&&statSync(f).isDirectory())f=join(f,'index.html');if(!existsSync(f)||p.endsWith('/'))f=join(ROOT,'index.html');try{const b=readFileSync(f);r.writeHead(200,{'content-type':MIME[extname(f)]||'application/octet-stream'});r.end(b)}catch{r.writeHead(404);r.end('x')}}).listen(0)
const port=srv.address().port
const br=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'})
const [w,h]=[1600,1000]
const page=await br.newPage(); await page.setViewport({width:w,height:h,deviceScaleFactor:1})
await page.goto(`http://localhost:${port}/`,{waitUntil:'networkidle0'})
await page.evaluate(()=>{document.querySelector('.ki-curtain')?.remove();document.documentElement.style.scrollBehavior='auto'})
await new Promise(r=>setTimeout(r,1600))
await page.screenshot({path:'/tmp/ki-gate/LOOK-landing.png'})
const geom=await page.evaluate(()=>{
  const R=s=>{const e=document.querySelector(s); if(!e) return null; const r=e.getBoundingClientRect(); return {t:Math.round(r.top),b:Math.round(r.bottom),h:Math.round(r.height)}}
  return {name:R('.ki-plx-name'), tag:R('.ki-plx-tag'), card:R('.ki-newest'), vh:window.innerHeight,
    navColors:[...document.querySelectorAll('.ki-nav a,.ki-nav button')].map(e=>getComputedStyle(e).color)}})
console.log('landing', JSON.stringify(geom))
// the plate slide
const H=await page.evaluate(()=>document.documentElement.scrollHeight)
for(let y=0;y<=H;y+=500){await page.evaluate(y=>window.scrollTo(0,y),y);await new Promise(r=>setTimeout(r,55))}
const py=await page.evaluate(()=>{
  const sec=document.querySelector('[data-ki-hscroll]'), track=sec.querySelector('.ki-hs-track')
  const plate=track.querySelector('.is-plate')
  const secTop=sec.getBoundingClientRect().top+window.scrollY
  const dist=track.scrollWidth-window.innerWidth
  // scroll so the plate is centred in the viewport
  const want=plate.offsetLeft-(window.innerWidth-plate.offsetWidth)/2
  return secTop+Math.max(0,Math.min(dist,want))})
for(let k=0;k<4;k++){await page.evaluate(y=>window.scrollTo(0,y),py);await new Promise(r=>setTimeout(r,180))}
await new Promise(r=>setTimeout(r,900))
await page.screenshot({path:'/tmp/ki-gate/LOOK-plate.png'})
await br.close(); srv.close(); console.log('ok')
