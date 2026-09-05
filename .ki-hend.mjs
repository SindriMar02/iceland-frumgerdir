import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { createServer } from 'node:http'
import puppeteer from 'puppeteer-core'
const ROOT='dist-katrin'
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.avif':'image/avif','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json','.txt':'text/plain','.xml':'application/xml'}
const srv=createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=join(ROOT,p);if(existsSync(f)&&statSync(f).isDirectory())f=join(f,'index.html');if(!existsSync(f)||p.endsWith('/'))f=join(ROOT,'index.html');try{const b=readFileSync(f);r.writeHead(200,{'content-type':MIME[extname(f)]||'application/octet-stream'});r.end(b)}catch{r.writeHead(404);r.end('x')}}).listen(0)
const port=srv.address().port
const br=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'})
for (const [w,h] of [[1440,900],[1990,1300],[2136,1562]]) {
  const page=await br.newPage(); await page.setViewport({width:w,height:h})
  await page.goto(`http://localhost:${port}/`,{waitUntil:'networkidle0'})
  await page.evaluate(()=>{document.querySelector('.ki-curtain')?.remove();document.documentElement.style.scrollBehavior='auto'})
  await new Promise(r=>setTimeout(r,1200))
  const H=await page.evaluate(()=>document.documentElement.scrollHeight)
  for(let y=0;y<=H;y+=Math.round(h*0.5)){await page.evaluate(y=>window.scrollTo(0,y),y);await new Promise(r=>setTimeout(r,60))}
  const info=await page.evaluate(()=>{
    const sec=document.querySelector('[data-ki-hscroll]'), track=sec.querySelector('.ki-hs-track')
    return {sw:track.scrollWidth, ow:track.offsetWidth, bw:track.getBoundingClientRect().width,
      secH:sec.offsetHeight, iw:window.innerWidth, ih:window.innerHeight,
      secTop:sec.getBoundingClientRect().top+window.scrollY,
      slides:[...track.children].map(c=>Math.round(c.getBoundingClientRect().width))}})
  // scroll to the very end of the section
  const endY = info.secTop + (info.secH - info.ih)
  for(let k=0;k<4;k++){await page.evaluate(y=>window.scrollTo(0,y),endY);await new Promise(r=>setTimeout(r,150))}
  const end=await page.evaluate(()=>{
    const sec=document.querySelector('[data-ki-hscroll]'), track=sec.querySelector('.ki-hs-track')
    const last=track.lastElementChild.getBoundingClientRect()
    return {tf:getComputedStyle(track).transform, lastRight:Math.round(last.right), lastLeft:Math.round(last.left),
      pinTop:Math.round(sec.querySelector('.ki-hs-pin').getBoundingClientRect().top)}})
  console.log(`${w}x${h} scrollWidth ${info.sw} innerWidth ${info.iw} distance ${info.sw-info.iw} secH ${info.secH}
   slides ${info.slides.join(',')}  sum ${info.slides.reduce((a,b)=>a+b,0)}
   AT END: lastRight ${end.lastRight} (want ${info.iw})  pinTop ${end.pinTop}  ${end.tf}`)
  await page.close()
}
await br.close(); srv.close()
