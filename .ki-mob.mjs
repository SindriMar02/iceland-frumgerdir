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
await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true})
await (await page.createCDPSession()).send('Emulation.setEmulatedMedia',{features:[{name:'hover',value:'none'},{name:'pointer',value:'coarse'}]})
await page.goto(`http://localhost:${port}/`,{waitUntil:'networkidle0'})
await page.evaluate(()=>{document.querySelector('.ki-curtain')?.remove();document.documentElement.style.scrollBehavior='auto'})
await new Promise(r=>setTimeout(r,1000))
const g = await page.evaluate(()=>{const e=document.querySelector('.parallax--sticky')
  return {top:e.getBoundingClientRect().top+window.scrollY, span:e.getBoundingClientRect().height - e.querySelector('.parallax__header').clientHeight}})
for (const [n,p] of [['m-h-00',0.0],['m-h-40',0.40],['m-h-90',0.90],['m-h-100',1.0]]) {
  for (let k=0;k<3;k++){ await page.evaluate((y)=>{window.scrollTo(0,y);window.dispatchEvent(new Event('scroll'))}, g.top+g.span*p); await new Promise(r=>setTimeout(r,120)) }
  await page.screenshot({path:`/tmp/ki-gate/${n}.png`})
}
const st = await page.evaluate(()=>{
  const H = document.querySelector('.parallax__header').getBoundingClientRect()
  return ['6','7','8'].map(l=>{const e=document.querySelector(`[data-parallax-layer="${l}"]`)
    const r=e.getBoundingClientRect(); return `L${l} bottom ${Math.round(r.bottom-H.top)}`}).join('  ')
})
console.log('mobile, end of descent:', st)
await br.close(); srv.close()
