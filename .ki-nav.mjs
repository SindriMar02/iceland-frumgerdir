import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { createServer } from 'node:http'
import puppeteer from 'puppeteer-core'
import { PNG } from 'pngjs'
const ROOT='dist-katrin'
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.avif':'image/avif','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json','.txt':'text/plain','.xml':'application/xml'}
const srv=createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=join(ROOT,p);if(existsSync(f)&&statSync(f).isDirectory())f=join(f,'index.html');if(!existsSync(f)||p.endsWith('/'))f=join(ROOT,'index.html');try{const b=readFileSync(f);r.writeHead(200,{'content-type':MIME[extname(f)]||'application/octet-stream'});r.end(b)}catch{r.writeHead(404);r.end('x')}}).listen(0)
const port=srv.address().port
const lin=c=>{c/=255;return c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4}
const L=(r,g,b)=>0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b)
const ratio=(a,b)=>{const x=Math.max(a,b),y=Math.min(a,b);return (x+0.05)/(y+0.05)}
const br=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'})
const page=await br.newPage(); await page.setViewport({width:1600,height:1000})
await page.goto(`http://localhost:${port}/`,{waitUntil:'networkidle0'})
await page.evaluate(()=>{document.querySelector('.ki-curtain')?.remove();document.documentElement.style.scrollBehavior='auto'})
await new Promise(r=>setTimeout(r,1600))
const spots=[['landing',0]]
// plate slide position
const py=await page.evaluate(()=>{
  const H=document.documentElement.scrollHeight
  for(let y=0;y<=H;y+=500){window.scrollTo(0,y)}
  const sec=document.querySelector('[data-ki-hscroll]'),track=sec.querySelector('.ki-hs-track')
  const plate=track.querySelector('.is-plate')
  window.scrollTo(0,0)
  return sec.getBoundingClientRect().top+window.scrollY+Math.max(0,plate.offsetLeft-(window.innerWidth-plate.offsetWidth)/2)})
spots.push(['plate',py])
for (const [name,y] of spots) {
  for(let k=0;k<4;k++){await page.evaluate(y=>window.scrollTo(0,y),y);await new Promise(r=>setTimeout(r,170))}
  await new Promise(r=>setTimeout(r,900))
  const boxes=await page.evaluate(()=>[...document.querySelectorAll('.ki-nav a,.ki-nav button')].map(e=>{
    const r=e.getBoundingClientRect();const c=getComputedStyle(e).color
    return {t:e.textContent.trim().slice(0,16),x0:Math.round(r.left),y0:Math.round(r.top),x1:Math.round(r.right),y1:Math.round(r.bottom),c,vis:r.width>0}}))
  await page.evaluate(()=>document.querySelectorAll('.ki-nav a,.ki-nav button').forEach(e=>e.style.visibility='hidden'))
  await new Promise(r=>setTimeout(r,250))
  const buf=await page.screenshot()
  await page.evaluate(()=>document.querySelectorAll('.ki-nav a,.ki-nav button').forEach(e=>e.style.visibility=''))
  const png=PNG.sync.read(buf)
  const out=[]
  for(const b of boxes){ if(!b.vis) continue
    const m=b.c.match(/\d+/g).map(Number); const tl=L(m[0],m[1],m[2])
    let worst=0,best=99
    const lums=[]
    for(let y=Math.max(0,b.y0);y<Math.min(png.height,b.y1);y++)for(let x=Math.max(0,b.x0);x<Math.min(png.width,b.x1);x++){
      const i=(y*png.width+x)*4; lums.push(L(png.data[i],png.data[i+1],png.data[i+2]))}
    lums.sort((a,b)=>a-b)
    const p98=lums[Math.floor(lums.length*0.98)], p02=lums[Math.floor(lums.length*0.02)]
    out.push(`${b.t} ${Math.min(ratio(tl,p98),ratio(tl,p02)).toFixed(2)}`)
  }
  console.log(name+': '+out.join(' · '))
}
await br.close(); srv.close()
