/* the whole mobile page as a filmstrip, so the rhythm can be judged */
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { createServer } from 'node:http'
import puppeteer from 'puppeteer-core'
const ROOT='dist-katrin'
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.avif':'image/avif','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json','.txt':'text/plain','.xml':'application/xml'}
const srv=createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=join(ROOT,p);if(existsSync(f)&&statSync(f).isDirectory())f=join(f,'index.html');if(!existsSync(f)||p.endsWith('/'))f=join(ROOT,'index.html');try{const b=readFileSync(f);r.writeHead(200,{'content-type':MIME[extname(f)]||'application/octet-stream'});r.end(b)}catch{r.writeHead(404);r.end('x')}}).listen(0)
const port=srv.address().port
const br=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'})
const page=await br.newPage(); await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:2})
await (await page.createCDPSession()).send('Emulation.setEmulatedMedia',{features:[{name:'hover',value:'none'},{name:'pointer',value:'coarse'}]})
await page.goto(`http://localhost:${port}/`,{waitUntil:'networkidle0'})
await page.evaluate(()=>{document.querySelector('.ki-curtain')?.remove();document.documentElement.style.scrollBehavior='auto'})
await new Promise(r=>setTimeout(r,1500))
const H=await page.evaluate(()=>document.documentElement.scrollHeight)
for(let y=0;y<=H;y+=400){await page.evaluate(y=>window.scrollTo(0,y),y);await new Promise(r=>setTimeout(r,50))}
const [a,b]=await page.evaluate(()=>{const e=document.querySelector('.ki-hs').getBoundingClientRect();return [e.top+window.scrollY, e.bottom+window.scrollY]})
const n=Number(process.argv[2]||8)
for(let i=0;i<n;i++){
  const y=a+(b-a-844)*i/(n-1)
  for(let k=0;k<3;k++){await page.evaluate(y=>window.scrollTo(0,y),y);await new Promise(r=>setTimeout(r,120))}
  await new Promise(r=>setTimeout(r,800))
  await page.screenshot({path:`/tmp/ki-gate/HS-${i}.png`})
}
await br.close(); srv.close(); console.log('ok '+n)
