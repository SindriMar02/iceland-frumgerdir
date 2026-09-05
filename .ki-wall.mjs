/* the wall alone: deep content hidden, every row of the frame measured */
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
for (const [w,h] of [[1990,1300],[1490,1230],[1990,520],[1280,800]]) {
  const page=await br.newPage(); await page.setViewport({width:w,height:h})
  await (await page.createCDPSession()).send('Emulation.setEmulatedMedia',{features:[{name:'hover',value:'none'},{name:'pointer',value:'coarse'}]})
  await page.goto(`http://localhost:${port}/`,{waitUntil:'networkidle0'})
  await page.evaluate(()=>{document.querySelector('.ki-curtain')?.remove();document.documentElement.style.scrollBehavior='auto';const s=document.createElement('style');s.textContent='.parallax__deep,.parallax__corner{visibility:hidden!important}';document.head.appendChild(s)})
  await new Promise(r=>setTimeout(r,900))
  const g=await page.evaluate(()=>[...document.querySelectorAll('.parallax--sticky')].map(e=>{const r=e.getBoundingClientRect();return {top:r.top+window.scrollY,span:r.height-e.querySelector('.parallax__header').clientHeight}}))
  const out=[]
  for (const [name,y] of [['d70',g[0].top+g[0].span*0.7],['d85',g[0].top+g[0].span*0.85],['d100',g[0].top+g[0].span],['w0',g[1].top],['w40',g[1].top+g[1].span*0.4]]) {
    for(let k=0;k<3;k++){await page.evaluate(y=>{window.scrollTo(0,y);window.dispatchEvent(new Event('scroll'))},y);await new Promise(r=>setTimeout(r,140))}
    await new Promise(r=>setTimeout(r,1400))
    const f=`/tmp/ki-gate/WALL-${w}x${h}-${name}.png`
    await page.screenshot({path:f})
    const png=PNG.sync.read(readFileSync(f)); const {width,height,data}=png
    const rows=[]; for(let yy=0;yy<height;yy++){let s=0;for(let x=0;x<width;x++){const i=(yy*width+x)*4;s+=(data[i]+data[i+1]+data[i+2])/3}rows.push(s/width)}
    let worst=0,at=0; for(let yy=1;yy<height;yy++){const d=Math.abs(rows[yy]-rows[yy-1]);if(d>worst){worst=d;at=yy}}
    // also 8-row smoothed step
    let worst8=0,at8=0; for(let yy=8;yy<height-8;yy++){let a=0,b=0;for(let k=0;k<8;k++){a+=rows[yy-1-k];b+=rows[yy+k]}const d=Math.abs(a-b)/8;if(d>worst8){worst8=d;at8=yy}}
    out.push(`${name}: step ${worst.toFixed(1)}@${at} · 8row ${worst8.toFixed(1)}@${at8} · mean ${(rows.reduce((a,b)=>a+b)/height).toFixed(1)}`)
  }
  console.log(`${w}x${h}\n  `+out.join('\n  '))
  await page.close()
}
await br.close(); srv.close()
