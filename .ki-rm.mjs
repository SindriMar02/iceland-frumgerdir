/* every reveal in both deep blocks, at real settle times: is everything held
   at the start, does it uncover monotonically, and does any opacity move */
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { createServer } from 'node:http'
import puppeteer from 'puppeteer-core'
const ROOT='dist-katrin'
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.avif':'image/avif','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json','.txt':'text/plain','.xml':'application/xml'}
const srv=createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=join(ROOT,p);if(existsSync(f)&&statSync(f).isDirectory())f=join(f,'index.html');if(!existsSync(f)||p.endsWith('/'))f=join(ROOT,'index.html');try{const b=readFileSync(f);r.writeHead(200,{'content-type':MIME[extname(f)]||'application/octet-stream'});r.end(b)}catch{r.writeHead(404);r.end('x')}}).listen(0)
const port=srv.address().port
const br=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'})
const page=await br.newPage(); await page.setViewport({width:1600,height:1000})
page.on('pageerror',e=>console.log('PAGEERROR',e.message))
await page.evaluateOnNewDocument(()=>{try{sessionStorage.setItem('ki_seen','1')}catch{}})
await (await page.createCDPSession()).send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'},{name:'hover',value:'none'},{name:'pointer',value:'coarse'}]})
await page.goto(`http://localhost:${port}/`,{waitUntil:'networkidle0'})
await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto'})
await new Promise(r=>setTimeout(r,1500))
const rs=await page.evaluate(()=>[...document.querySelectorAll('.parallax--sticky')].map(e=>{const r=e.getBoundingClientRect();return {top:Math.round(r.top+window.scrollY), span:Math.round(r.height-e.querySelector('.parallax__header').clientHeight)}}))
const num=s=>{const m=String(s).match(/[\d.]+/);return m?+m[0]:(String(s)==='none'?-1:0)}

const d=await page.evaluate(()=>{
  const out=[]
  for (const deep of document.querySelectorAll('[data-parallax-deep]')) {
    const cs=getComputedStyle(deep)
    const st=[...deep.querySelectorAll('[data-parallax-stagger]')]
    const wd=[...deep.querySelectorAll('[data-parallax-word]')]
    out.push({disp:cs.display, vis:cs.visibility, op:cs.opacity,
      clip:[...new Set(st.map(e=>getComputedStyle(e).clipPath))],
      wordT:[...new Set(wd.map(e=>getComputedStyle(e).transform))],
      staticStrata:getComputedStyle(document.querySelector('.ki-strata-static')).display})
  }
  return out})
console.log(JSON.stringify(d,null,1))
await br.close(); srv.close()
