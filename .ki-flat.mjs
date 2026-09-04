/* Is any frame of the stone ever flat? Measures the hero's last frame and the
   way out's first frame at three viewport shapes, including the pane the
   flat brown was seen in. sigma under ~1 and a p1..p99 range under ~3 means
   paint; material is anything above that. */
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { createServer } from 'node:http'
import puppeteer from 'puppeteer-core'
const ROOT='dist-katrin'
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.avif':'image/avif','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json','.txt':'text/plain','.xml':'application/xml'}
const srv=createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=join(ROOT,p);if(existsSync(f)&&statSync(f).isDirectory())f=join(f,'index.html');if(!existsSync(f)||p.endsWith('/'))f=join(ROOT,'index.html');try{const b=readFileSync(f);r.writeHead(200,{'content-type':MIME[extname(f)]||'application/octet-stream'});r.end(b)}catch{r.writeHead(404);r.end('x')}}).listen(0)
const port=srv.address().port
const br=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'})
for (const [w,h] of [[1490,1230],[1280,800],[390,844]]) {
  const page=await br.newPage(); await page.setViewport({width:w,height:h,isMobile:w<600,hasTouch:w<600})
  await (await page.createCDPSession()).send('Emulation.setEmulatedMedia',{features:[{name:'hover',value:'none'},{name:'pointer',value:'coarse'}]})
  await page.goto(`http://localhost:${port}/`,{waitUntil:'networkidle0'})
  await page.evaluate(()=>{document.querySelector('.ki-curtain')?.remove();document.documentElement.style.scrollBehavior='auto'})
  await new Promise(r=>setTimeout(r,1000))
  const g=await page.evaluate(()=>[...document.querySelectorAll('.parallax--sticky')].map(e=>{const r=e.getBoundingClientRect();return {top:r.top+window.scrollY,span:r.height-e.querySelector('.parallax__header').clientHeight}}))
  for (const [name,y] of [['hero-end', g[0].top+g[0].span],['gate-rest', g[1].top],['gate-25', g[1].top+g[1].span*0.25]]) {
    for(let k=0;k<3;k++){await page.evaluate(y=>{window.scrollTo(0,y);window.dispatchEvent(new Event('scroll'))},y);await new Promise(r=>setTimeout(r,140))}
    await page.screenshot({path:`/tmp/ki-gate/flat-${w}x${h}-${name}.png`})
  }
  await page.close()
}
await br.close(); srv.close(); console.log('shots ok')
