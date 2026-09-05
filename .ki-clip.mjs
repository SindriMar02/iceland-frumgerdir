/* is any letter's ink cut by its mask? Paint the wordmark with the masks on,
   then with overflow visible, and compare the ink's bounding box. */
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
const ink=(png,b)=>{let t=1e9,bm=-1,l=1e9,r=-1,n=0
  for(let y=Math.max(0,b.y0);y<Math.min(png.height,b.y1);y++)for(let x=Math.max(0,b.x0);x<Math.min(png.width,b.x1);x++){
    const i=(y*png.width+x)*4;const L=(png.data[i]*.2126+png.data[i+1]*.7152+png.data[i+2]*.0722)
    if(L>150){n++;if(y<t)t=y;if(y>bm)bm=y;if(x<l)l=x;if(x>r)r=x}}
  return {top:t,bottom:bm,left:l,right:r,n}}
for (const [w,h,tag] of [[1600,1000,'desktop'],[390,844,'phone']]) {
  for (const masked of [true,false]) {
    const page=await br.newPage(); await page.setViewport({width:w,height:h,isMobile:w<600,hasTouch:w<600})
    if(w<600) await (await page.createCDPSession()).send('Emulation.setEmulatedMedia',{features:[{name:'hover',value:'none'},{name:'pointer',value:'coarse'}]})
    await page.evaluateOnNewDocument(()=>{try{sessionStorage.setItem('ki_seen','1')}catch{}})
    await page.goto(`http://localhost:${port}/`,{waitUntil:'networkidle0'})
    await new Promise(r=>setTimeout(r,1200))
    // isolate the type: hide the photographs so only the letters are bright
    await page.evaluate(m=>{const s=document.createElement('style')
      s.textContent='.parallax__layer-img,.parallax__backdrop,.parallax__corner{visibility:hidden!important}'
        +(m?'':'.ki-plx-l{overflow:visible!important}')
      document.head.appendChild(s)},masked)
    await new Promise(r=>setTimeout(r,400))
    const b=await page.evaluate(()=>{const r=document.querySelector('.ki-plx-name').getBoundingClientRect()
      return {x0:Math.round(r.left)-30,y0:Math.round(r.top)-60,x1:Math.round(r.right)+30,y1:Math.round(r.bottom)+60}})
    const png=PNG.sync.read(await page.screenshot())
    const k=ink(png,b)
    console.log(`${tag} masks ${masked?'ON ':'OFF'}  ink top ${k.top} bottom ${k.bottom} left ${k.left} right ${k.right} px ${k.n}`)
    await page.close()
  }
}
await br.close(); srv.close()
