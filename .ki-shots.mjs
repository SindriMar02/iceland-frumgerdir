import { readFileSync, existsSync, statSync, mkdirSync } from 'node:fs'
import { join, extname } from 'node:path'
import { createServer } from 'node:http'
import puppeteer from 'puppeteer-core'
const ROOT='dist-katrin'
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.avif':'image/avif','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json','.txt':'text/plain','.xml':'application/xml'}
const srv=createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=join(ROOT,p);if(existsSync(f)&&statSync(f).isDirectory())f=join(f,'index.html');if(!existsSync(f)||p.endsWith('/'))f=join(ROOT,'index.html');try{const b=readFileSync(f);r.writeHead(200,{'content-type':MIME[extname(f)]||'application/octet-stream'});r.end(b)}catch{r.writeHead(404);r.end('x')}}).listen(0)
const port=srv.address().port
mkdirSync('/tmp/ki-gate',{recursive:true})
const browser=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'})
for (const v of [{n:'d',w:1280,h:800},{n:'m',w:390,h:844}]) {
  const page=await browser.newPage()
  await page.setViewport({width:v.w,height:v.h,deviceScaleFactor:1,hasTouch:v.n==='m',isMobile:v.n==='m'})
  await (await page.createCDPSession()).send('Emulation.setEmulatedMedia',{features:[{name:'hover',value:'none'},{name:'pointer',value:'coarse'}]})
  await page.goto(`http://localhost:${port}/`,{waitUntil:'networkidle0'})
  await page.evaluate(()=>{document.querySelector('.ki-curtain')?.remove();document.documentElement.style.scrollBehavior='auto'})
  await new Promise(r=>setTimeout(r,900))
  const marks = await page.evaluate(()=>{
    const b=document.querySelector('.ki-bedrock').getBoundingClientRect()
    const top=b.top+window.scrollY
    const gates=[...document.querySelectorAll('.parallax--sticky')].map(g=>{
      const r=g.getBoundingClientRect(); return {top:r.top+window.scrollY, span:r.height-g.querySelector('.parallax__header').clientHeight}})
    return {top, h:b.height, gates}
  })
  const shots = [
    ['bed-a', marks.top+120], ['bed-b', marks.top+marks.h*0.32],
    ['bed-c', marks.top+marks.h*0.70], ['bed-d', marks.top+marks.h-marks.gates[0].span*0+ -900],
  ]
  for (const [name,y] of shots) {
    for (let k=0;k<3;k++){ await page.evaluate(y=>{window.scrollTo(0,y);window.dispatchEvent(new Event('scroll'))},y); await new Promise(r=>setTimeout(r,120)) }
    await page.screenshot({path:`/tmp/ki-gate/${v.n}-${name}.png`})
  }
  // entry at four points
  for (const p of [0,0.12,0.22,0.35]) {
    for (let k=0;k<3;k++){ await page.evaluate((s,p)=>{const g=document.querySelectorAll('.parallax--sticky')[0];window.scrollTo(0,g.getBoundingClientRect().top+window.scrollY+s*p);window.dispatchEvent(new Event('scroll'))},marks.gates[0].span,p); await new Promise(r=>setTimeout(r,110)) }
    await page.screenshot({path:`/tmp/ki-gate/${v.n}-e${String(Math.round(p*100)).padStart(3,'0')}.png`})
  }
  await page.close()
}
await browser.close(); srv.close(); console.log('shots done')
