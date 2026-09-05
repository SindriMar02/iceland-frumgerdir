import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { createServer } from 'node:http'
import puppeteer from 'puppeteer-core'
import { PNG } from 'pngjs'
const ROOT='dist-katrin'
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.avif':'image/avif','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json','.txt':'text/plain','.xml':'application/xml'}
const srv=createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=join(ROOT,p);if(existsSync(f)&&statSync(f).isDirectory())f=join(f,'index.html');if(!existsSync(f)||p.endsWith('/'))f=join(ROOT,'index.html');try{const b=readFileSync(f);r.writeHead(200,{'content-type':MIME[extname(f)]||'application/octet-stream'});r.end(b)}catch{r.writeHead(404);r.end('x')}}).listen(0)
const port=srv.address().port
const br=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'})
const page=await br.newPage(); await page.setViewport({width:1600,height:1000})
await page.goto(`http://localhost:${port}/`,{waitUntil:'domcontentloaded'})
const t0=Date.now()
const brightest=(png,box)=>{let m=0;for(let y=Math.max(0,box.y0);y<Math.min(png.height,box.y1);y++)for(let x=Math.max(0,box.x0);x<Math.min(png.width,box.x1);x++){const i=(y*png.width+x)*4;const l=(png.data[i]*0.2126+png.data[i+1]*0.7152+png.data[i+2]*0.0722)|0;if(l>m)m=l}return m}
for (const at of [200,700,1200,1600,2600,3600]) {
  const w=at-(Date.now()-t0); if(w>0) await new Promise(r=>setTimeout(r,w))
  const d=await page.evaluate(()=>{
    const mask=document.querySelector('.ki-plx-l'), i=mask.querySelector('i')
    const h1=document.querySelector('.ki-plx-name').getBoundingClientRect()
    return {maskH:+mask.getBoundingClientRect().height.toFixed(1),
      iH:+i.getBoundingClientRect().height.toFixed(1),
      m42:+new DOMMatrix(getComputedStyle(i).transform).m42.toFixed(1),
      inline:i.getAttribute('style')||'',
      h1:{x0:Math.round(h1.left),y0:Math.round(h1.top),x1:Math.round(h1.right),y1:Math.round(h1.bottom)},
      font:document.fonts?document.fonts.status:'?'}})
  const shot=PNG.sync.read(await page.screenshot())
  console.log(`${String(at).padStart(4)}ms  mask ${d.maskH}  letter ${d.iH}  m42 ${d.m42}px  brightest in h1 box ${brightest(shot,d.h1)}  fonts ${d.font}  inline "${d.inline.slice(0,60)}"`)
}
await br.close(); srv.close()
