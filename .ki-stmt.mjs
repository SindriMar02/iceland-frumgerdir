/* The statement and the gate, shot and contrast-measured. The statement's
   scrim comment says re-measure whenever the type moves, and it just moved
   from four scattered words to a centred block. */
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { createServer } from 'node:http'
import puppeteer from 'puppeteer-core'
import { createRequire } from 'node:module'
const require=createRequire(import.meta.url)
const ROOT='dist-katrin'
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.avif':'image/avif','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json','.txt':'text/plain','.xml':'application/xml'}
const srv=createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=join(ROOT,p);if(existsSync(f)&&statSync(f).isDirectory())f=join(f,'index.html');if(!existsSync(f)||p.endsWith('/'))f=join(ROOT,'index.html');try{const b=readFileSync(f);r.writeHead(200,{'content-type':MIME[extname(f)]||'application/octet-stream'});r.end(b)}catch{r.writeHead(404);r.end('x')}}).listen(0)
const port=srv.address().port
const br=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'})
for (const [w,h,tag] of [[1280,800,'d'],[390,844,'m']]) {
  const page=await br.newPage(); await page.setViewport({width:w,height:h,isMobile:w<600,hasTouch:w<600})
  await (await page.createCDPSession()).send('Emulation.setEmulatedMedia',{features:[{name:'hover',value:'none'},{name:'pointer',value:'coarse'}]})
  await page.goto(`http://localhost:${port}/`,{waitUntil:'networkidle0'})
  await page.evaluate(()=>{document.querySelector('.ki-curtain')?.remove();document.documentElement.style.scrollBehavior='auto'})
  await new Promise(r=>setTimeout(r,900))
  const H=await page.evaluate(()=>document.documentElement.scrollHeight)
  for(let y=0;y<=H;y+=Math.round(h*0.6)){await page.evaluate(y=>{window.scrollTo(0,y);window.dispatchEvent(new Event('scroll'))},y);await new Promise(r=>setTimeout(r,70))}
  // the statement, centred in view
  const sy=await page.evaluate(()=>{const e=document.querySelector('.ki-stmt').getBoundingClientRect();return e.top+window.scrollY-(window.innerHeight-e.height)/2})
  for(let k=0;k<3;k++){await page.evaluate(y=>{window.scrollTo(0,y);window.dispatchEvent(new Event('scroll'))},sy);await new Promise(r=>setTimeout(r,160))}
  await new Promise(r=>setTimeout(r,1200))
  await page.screenshot({path:`/tmp/ki-gate/ST-${tag}.png`})
  /* and again with the type hidden: a composite cannot tell a glyph from the
     photograph behind it, and measuring the lit band with the type in it just
     measures the type */
  await page.evaluate(()=>{/* hide the GLYPHS only — the veils are part of the background the type has
   to survive, and hiding them measures a page that does not exist */
    document.querySelectorAll('.ki-stmt-word i').forEach(e=>e.style.visibility='hidden')
    document.querySelector('.ki-stmt-eyebrow > span').style.visibility='hidden'
    document.querySelector('.ki-stmt-sub > span').style.visibility='hidden'})
  await new Promise(r=>setTimeout(r,300))
  await page.screenshot({path:`/tmp/ki-gate/ST-${tag}-bg.png`})
  await page.evaluate(()=>{document.querySelectorAll('.ki-stmt-word i').forEach(e=>e.style.visibility='')
    document.querySelector('.ki-stmt-eyebrow > span').style.visibility=''
    document.querySelector('.ki-stmt-sub > span').style.visibility=''})
  const boxes=await page.evaluate(()=>{
    const R=e=>{const r=e.getBoundingClientRect();return [Math.round(r.left),Math.round(r.top),Math.round(r.right),Math.round(r.bottom)]}
    return {head:[...document.querySelectorAll('.ki-stmt-word i')].map(R),
            eye:R(document.querySelector('.ki-stmt-eyebrow')), sub:R(document.querySelector('.ki-stmt-sub'))}})
  const fs=require('node:fs'); fs.writeFileSync(`/tmp/ki-gate/ST-${tag}-boxes.json`, JSON.stringify(boxes))
  console.log(`${tag} eyebrow ${JSON.stringify(boxes.eye)}  words ${boxes.head.length}`)
  await page.close()
}
await br.close(); srv.close(); console.log('shots ok')
