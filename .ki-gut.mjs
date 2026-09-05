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
for(let y=0;y<=H;y+=400){await page.evaluate(y=>window.scrollTo(0,y),y);await new Promise(r=>setTimeout(r,45))}
const rows=await page.evaluate(()=>{
  const out=[]
  const secs=document.querySelectorAll('main#efni > *, .ki-hs-track > *')
  for(const s of secs){
    const r=s.getBoundingClientRect(), cs=getComputedStyle(s)
    // the leftmost text run inside
    let lx=null, first=null
    for(const t of s.querySelectorAll('h1,h2,h3,p,li,span,a')){
      if(!t.textContent.trim()) continue
      const tr=t.getBoundingClientRect()
      if(!tr.width||getComputedStyle(t).visibility==='hidden') continue
      if(lx===null||tr.left<lx){lx=Math.round(tr.left); first=t.textContent.trim().slice(0,18)}
    }
    out.push({cls:(s.className||s.tagName).toString().slice(0,30),
      top:Math.round(r.top+window.scrollY), h:Math.round(r.height),
      pt:cs.paddingTop, pb:cs.paddingBottom, pl:cs.paddingLeft, textLeft:lx, first})
  }
  return out})
for(const r of rows) console.log(`${String(r.textLeft).padStart(4)}  pl ${String(r.pl).padStart(7)}  pt ${String(r.pt).padStart(7)} pb ${String(r.pb).padStart(7)}  h ${String(r.h).padStart(5)}  ${r.cls}  ${r.first||''}`)
await br.close(); srv.close()
