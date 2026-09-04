/* Are the joins actually joins? Every place the page changes surface is
   scrolled to and the frame is read row by row: a seam is a row-to-row jump
   that has no business being there. Measured on flat regions only — a row
   crossing a photograph legitimately jumps. */
import { readFileSync, existsSync } from 'node:fs'
import { join, extname } from 'node:path'
import { createServer } from 'node:http'
import puppeteer from 'puppeteer-core'
const ROOT='dist-katrin'
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.avif':'image/avif','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json','.txt':'text/plain','.xml':'application/xml'}
const srv=createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=join(ROOT,p);if(!existsSync(f)||p.endsWith('/'))f=join(ROOT,'index.html');try{const b=readFileSync(f);r.writeHead(200,{'content-type':MIME[extname(f)]||'application/octet-stream'});r.end(b)}catch{r.writeHead(404);r.end('x')}}).listen(0)
const port=srv.address().port
const browser=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'})
const page=await browser.newPage()
await page.setViewport({width:1280,height:800,deviceScaleFactor:1})
await (await page.createCDPSession()).send('Emulation.setEmulatedMedia',{features:[{name:'hover',value:'none'},{name:'pointer',value:'coarse'}]})
await page.goto(`http://localhost:${port}/`,{waitUntil:'networkidle0'})
await page.evaluate(()=>{document.querySelector('.ki-curtain')?.remove();document.documentElement.style.scrollBehavior='auto'})
await new Promise(r=>setTimeout(r,900))

const spots = await page.evaluate(()=>{
  const g=[...document.querySelectorAll('.parallax--sticky')]
  const pass=document.querySelector('.ki-hs').getBoundingClientRect()
  const dome=document.querySelector('.ki-dome').getBoundingClientRect()
  const S=window.scrollY
  const wrap=(e)=>({top:e.getBoundingClientRect().top+S, bot:e.getBoundingClientRect().bottom+S})
  return {
    heroRelease: wrap(g[0]).bot - 400,        // the descent letting go into the passage
    passIntoGate: pass.bottom + S - 400,      // the passage handing to the gate
    gateRelease: wrap(g[1]).bot - 400,        // the gate letting go into the cream
  }
})
for (const [name, y] of Object.entries(spots)) {
  for (let k=0;k<3;k++){ await page.evaluate(y=>{window.scrollTo(0,y);window.dispatchEvent(new Event('scroll'))},y); await new Promise(r=>setTimeout(r,120)) }
  await page.screenshot({ path: `/tmp/ki-gate/seam-${name}.png` })
}
await browser.close(); srv.close()
