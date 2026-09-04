import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { createServer } from 'node:http'
import puppeteer from 'puppeteer-core'
const ROOT='dist-katrin'
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.avif':'image/avif','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json','.txt':'text/plain','.xml':'application/xml'}
const srv=createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=join(ROOT,p);if(existsSync(f)&&statSync(f).isDirectory())f=join(f,'index.html');if(!existsSync(f)||p.endsWith('/'))f=join(ROOT,'index.html');try{const b=readFileSync(f);r.writeHead(200,{'content-type':MIME[extname(f)]||'application/octet-stream'});r.end(b)}catch{r.writeHead(404);r.end('x')}}).listen(0)
const port=srv.address().port
const br=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'})
for (const v of [{n:'d',w:1280,h:900},{n:'m',w:390,h:844}]) {
  const page=await br.newPage()
  await page.setViewport({width:v.w,height:v.h,deviceScaleFactor:1,isMobile:v.n==='m',hasTouch:v.n==='m'})
  await page.goto(`http://localhost:${port}/hafa-samband`,{waitUntil:'networkidle0'})
  await page.evaluate(()=>{document.querySelector('.ki-curtain')?.remove();document.documentElement.style.scrollBehavior='auto'})
  await new Promise(r=>setTimeout(r,900))
  /* the reveals are scroll-driven, so a fullPage shot taken from the top
     catches everything below the fold still hidden — walk the page first */
  const H = await page.evaluate(()=>document.documentElement.scrollHeight)
  for (let y=0; y<=H; y+=Math.round(v.h*0.6)) {
    await page.evaluate(y=>{window.scrollTo(0,y);window.dispatchEvent(new Event('scroll'))},y)
    await new Promise(r=>setTimeout(r,90))
  }
  await page.evaluate(()=>{window.scrollTo(0,0);window.dispatchEvent(new Event('scroll'))})
  await new Promise(r=>setTimeout(r,500))
  await page.screenshot({path:`/tmp/ki-gate/C-${v.n}-full.png`, fullPage:true})
  // does everything a local-search result needs still exist in the text?
  const t = await page.evaluate(()=>document.body.innerText)
  const need = ['Katrínartún','105','Reykjavík','663 3414','katrin@','11','17']
  console.log(v.n, 'crawlable facts:', need.map(x=>`${x}:${t.includes(x)?'ok':'MISSING'}`).join(' '))
  const links = await page.evaluate(()=>({
    tel: !!document.querySelector('a[href^="tel:"]'),
    mail: !!document.querySelector('a[href^="mailto:"]'),
    map: !!document.querySelector('a[href*="maps"], a[href*="ja.is"], a[href*="google"]'),
    h1: document.querySelector('h1')?.textContent,
    h2: [...document.querySelectorAll('h2')].map(e=>e.textContent.trim()).join(' | '),
  }))
  console.log(v.n, links)
  await page.close()
}
await br.close(); srv.close()
