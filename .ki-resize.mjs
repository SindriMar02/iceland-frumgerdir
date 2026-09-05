/* the stale-measure case: load narrow, widen, and see whether the track's
   last panel still reaches the right edge */
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
await page.setViewport({width:1200,height:900})
await page.goto(`http://localhost:${port}/`,{waitUntil:'networkidle0'})
await page.evaluate(()=>{document.querySelector('.ki-curtain')?.remove();document.documentElement.style.scrollBehavior='auto'})
await new Promise(r=>setTimeout(r,1400))
for (const [w,h] of [[1200,900],[1990,1300],[1600,820]]) {
  await page.setViewport({width:w,height:h})
  await new Promise(r=>setTimeout(r,700))
  const H=await page.evaluate(()=>document.documentElement.scrollHeight)
  for(let y=0;y<=H;y+=600){await page.evaluate(y=>window.scrollTo(0,y),y);await new Promise(r=>setTimeout(r,45))}
  const end=await page.evaluate(()=>{
    const sec=document.querySelector('[data-ki-hscroll]')
    const y=sec.getBoundingClientRect().top+window.scrollY+(sec.offsetHeight-window.innerHeight)
    window.scrollTo(0,y); return y})
  for(let k=0;k<3;k++){await page.evaluate(y=>window.scrollTo(0,y),end);await new Promise(r=>setTimeout(r,160))}
  const r=await page.evaluate(()=>{
    const t=document.querySelector('.ki-hs-track')
    const last=t.lastElementChild.getBoundingClientRect()
    return {right:Math.round(last.right), iw:window.innerWidth,
      pinTop:Math.round(document.querySelector('.ki-hs-pin').getBoundingClientRect().top)}})
  console.log(`${w}x${h}: last panel right ${r.right} / viewport ${r.iw}  pinTop ${r.pinTop}  ${r.right===r.iw?'FULL BLEED':'SHORT by '+(r.iw-r.right)}`)
}
await br.close(); srv.close()
