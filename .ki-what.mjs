import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { createServer } from 'node:http'
import puppeteer from 'puppeteer-core'
const ROOT='dist-katrin'
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.avif':'image/avif','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json','.txt':'text/plain','.xml':'application/xml'}
const srv=createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=join(ROOT,p);if(existsSync(f)&&statSync(f).isDirectory())f=join(f,'index.html');if(!existsSync(f)||p.endsWith('/'))f=join(ROOT,'index.html');try{const b=readFileSync(f);r.writeHead(200,{'content-type':MIME[extname(f)]||'application/octet-stream'});r.end(b)}catch{r.writeHead(404);r.end('x')}}).listen(0)
const port=srv.address().port
const br=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'})
const page=await br.newPage(); await page.setViewport({width:1280,height:800})
await (await page.createCDPSession()).send('Emulation.setEmulatedMedia',{features:[{name:'hover',value:'none'},{name:'pointer',value:'coarse'}]})
await page.goto(`http://localhost:${port}/`,{waitUntil:'networkidle0'})
await page.evaluate(()=>{document.querySelector('.ki-curtain')?.remove();document.documentElement.style.scrollBehavior='auto'})
await new Promise(r=>setTimeout(r,900))
const y = await page.evaluate(()=>{const g=document.querySelectorAll('.parallax--sticky')[0];return g.getBoundingClientRect().bottom+window.scrollY-400})
for(let k=0;k<3;k++){await page.evaluate(y=>{window.scrollTo(0,y);window.dispatchEvent(new Event('scroll'))},y);await new Promise(r=>setTimeout(r,150))}
await new Promise(r=>setTimeout(r,1500))   // give far-down images time to decode
const info = await page.evaluate(()=>{
  const at=(x,y)=>{const e=document.elementFromPoint(x,y); if(!e) return 'nothing'
    const cs=getComputedStyle(e); const path=[]; let n=e
    while(n && path.length<5){path.push((n.className||n.tagName).toString().split(' ').slice(0,2).join('.'));n=n.parentElement}
    return {path:path.join(' < '), bg:cs.backgroundColor, img:cs.backgroundImage.slice(0,60), r:e.getBoundingClientRect().toJSON()}}
  const g1=document.querySelectorAll('.parallax--sticky')[1]
  const hdr=g1.querySelector('.parallax__header').getBoundingClientRect()
  const near=g1.querySelector('[data-parallax-layer="4"]'); const face=near.querySelector('.parallax__plate-face')
  return { gateHeader:[Math.round(hdr.top),Math.round(hdr.bottom)],
    nearBox:near.getBoundingClientRect().toJSON(), faceBox:face.getBoundingClientRect().toJSON(),
    faceImg:getComputedStyle(face).backgroundImage.slice(0,70),
    at300:at(640,300), at500:at(640,500), at700:at(640,700) }
})
console.log(JSON.stringify(info,null,1))
await page.screenshot({path:'/tmp/ki-gate/seam-late.png'})
await br.close(); srv.close()
