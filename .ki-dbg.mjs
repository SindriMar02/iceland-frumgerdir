import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { createServer } from 'node:http'
import puppeteer from 'puppeteer-core'
const ROOT='dist-katrin'
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.avif':'image/avif','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json','.txt':'text/plain','.xml':'application/xml'}
const srv=createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=join(ROOT,p);if(existsSync(f)&&statSync(f).isDirectory())f=join(f,'index.html');if(!existsSync(f)||p.endsWith('/'))f=join(ROOT,'index.html');try{const b=readFileSync(f);r.writeHead(200,{'content-type':MIME[extname(f)]||'application/octet-stream'});r.end(b)}catch{r.writeHead(404);r.end('x')}}).listen(0)
const port=srv.address().port
const br=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'})
const page=await br.newPage(); await page.setViewport({width:1600,height:1000})
await page.goto(`http://localhost:${port}/`,{waitUntil:'networkidle0'})
await page.evaluate(()=>{document.querySelector('.ki-curtain')?.remove();document.documentElement.style.scrollBehavior='auto'})
await new Promise(r=>setTimeout(r,1500))
const py=await page.evaluate(()=>{
  const H=document.documentElement.scrollHeight
  for(let y=0;y<=H;y+=500)window.scrollTo(0,y)
  const sec=document.querySelector('[data-ki-hscroll]'),track=sec.querySelector('.ki-hs-track')
  const plate=track.querySelector('.is-plate')
  window.scrollTo(0,0)
  return sec.getBoundingClientRect().top+window.scrollY+Math.max(0,plate.offsetLeft-(window.innerWidth-plate.offsetWidth)/2)})
for(let k=0;k<4;k++){await page.evaluate(y=>window.scrollTo(0,y),py);await new Promise(r=>setTimeout(r,180))}
const d=await page.evaluate(()=>{
  const sy=window.scrollY
  const mark=document.querySelector('.ki-nav-mark').getBoundingClientRect()
  const out=[...document.querySelectorAll('[data-ki-band]')].map(e=>{
    const r=e.getBoundingClientRect()
    return {cls:e.className.slice(0,26), band:e.dataset.kiBand,
      docTop:Math.round(r.top+sy), docBot:Math.round(r.bottom+sy),
      left:Math.round(r.left), right:Math.round(r.right)}})
  return {sy:Math.round(sy), markCentreY:Math.round(sy+mark.top+mark.height/2), markX:Math.round(mark.left+mark.width/2),
    tone:document.querySelector('.ki-nav').dataset.kiTone, on:document.querySelector('.ki-nav-mark').dataset.kiOn, bands:out}})
console.log(JSON.stringify(d,null,1))
await br.close(); srv.close()
