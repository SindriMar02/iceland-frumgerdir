import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { createServer } from 'node:http'
import puppeteer from 'puppeteer-core'
const ROOT='dist-katrin'
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.avif':'image/avif','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json','.txt':'text/plain','.xml':'application/xml'}
const srv=createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=join(ROOT,p);if(existsSync(f)&&statSync(f).isDirectory())f=join(f,'index.html');if(!existsSync(f)||p.endsWith('/'))f=join(ROOT,'index.html');try{const b=readFileSync(f);r.writeHead(200,{'content-type':MIME[extname(f)]||'application/octet-stream'});r.end(b)}catch{r.writeHead(404);r.end('x')}}).listen(0)
const port=srv.address().port
const br=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'})
for (const [w,h] of [[1490,1230],[1280,800]]) {
  const page=await br.newPage(); await page.setViewport({width:w,height:h})
  await (await page.createCDPSession()).send('Emulation.setEmulatedMedia',{features:[{name:'hover',value:'none'},{name:'pointer',value:'coarse'}]})
  await page.goto(`http://localhost:${port}/`,{waitUntil:'networkidle0'})
  await page.evaluate(()=>{document.querySelector('.ki-curtain')?.remove();document.documentElement.style.scrollBehavior='auto'})
  await new Promise(r=>setTimeout(r,900))
  const y=await page.evaluate(()=>{const g=document.querySelectorAll('.parallax--sticky')[0];return g.getBoundingClientRect().top+window.scrollY+(g.getBoundingClientRect().height-g.querySelector('.parallax__header').clientHeight)})
  for(let k=0;k<3;k++){await page.evaluate(y=>{window.scrollTo(0,y);window.dispatchEvent(new Event('scroll'))},y);await new Promise(r=>setTimeout(r,150))}
  await new Promise(r=>setTimeout(r,1500))
  const rows=await page.evaluate(()=>[...document.querySelectorAll('.parallax__deep .ki-stratum')].map(li=>{
    const f=li.querySelector('.ki-stratum-fig').getBoundingClientRect(), i=li.querySelector('img').getBoundingClientRect()
    return `${li.querySelector('.ki-stratum-name').textContent.padEnd(9)} figure ${Math.round(f.width)}x${Math.round(f.height)}  img ${Math.round(i.width)}x${Math.round(i.height)}  ${Math.abs(f.height-i.height)<1&&Math.abs(f.width-i.width)<1?'fills':'GAP '+Math.round(f.height-i.height)+'px'}`}))
  console.log(`${w}x${h}\n  `+rows.join('\n  '))
  await page.screenshot({path:`/tmp/ki-gate/spec-${w}x${h}.png`})
  await page.close()
}
await br.close(); srv.close()
