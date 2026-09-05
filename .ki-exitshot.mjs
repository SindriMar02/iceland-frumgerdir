import { readFileSync, existsSync } from 'node:fs'
import { join, extname } from 'node:path'
import { createServer } from 'node:http'
import puppeteer from 'puppeteer-core'
const ROOT='dist-katrin'
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.avif':'image/avif','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json','.txt':'text/plain','.xml':'application/xml'}
const srv=createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=join(ROOT,p);if(!existsSync(f)||p.endsWith('/'))f=join(ROOT,'index.html');try{const b=readFileSync(f);r.writeHead(200,{'content-type':MIME[extname(f)]||'application/octet-stream'});r.end(b)}catch{r.writeHead(404);r.end('x')}}).listen(0)
const port=srv.address().port
const br=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'})
const page=await br.newPage(); await page.setViewport({width:1280,height:800})
await (await page.createCDPSession()).send('Emulation.setEmulatedMedia',{features:[{name:'hover',value:'none'},{name:'pointer',value:'coarse'}]})
await page.goto(`http://localhost:${port}/`,{waitUntil:'networkidle0'})
await page.evaluate(()=>{document.querySelector('.ki-curtain')?.remove();document.documentElement.style.scrollBehavior='auto'})
await new Promise(r=>setTimeout(r,900))
for (const p of [0.30,0.40,0.45,0.50,0.57,0.65]) {
  for(let k=0;k<4;k++){ await page.evaluate((p)=>{const g=document.querySelectorAll('.parallax--sticky')[1]
    const s=g.getBoundingClientRect().height-g.querySelector('.parallax__header').clientHeight
    window.scrollTo(0,g.getBoundingClientRect().top+window.scrollY+s*p);window.dispatchEvent(new Event('scroll'))},p)
    await new Promise(r=>setTimeout(r,110)) }
  await page.screenshot({path:`/tmp/ki-gate/x-${String(Math.round(p*100))}.png`})
}
await br.close(); srv.close(); console.log('ok')
