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
await (await page.createCDPSession()).send('Emulation.setEmulatedMedia',{features:[{name:'hover',value:'none'},{name:'pointer',value:'coarse'}]})
await page.goto(`http://localhost:${port}/`,{waitUntil:'networkidle0'})
await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto'})
await new Promise(r=>setTimeout(r,1500))
const meta=await page.evaluate(()=>{
  const rs=[...document.querySelectorAll('.parallax--sticky')].map(e=>{const r=e.getBoundingClientRect()
    return {top:Math.round(r.top+window.scrollY), h:Math.round(r.height), hdr:e.querySelector('.parallax__header').clientHeight}})
  return {rs, docH:document.documentElement.scrollHeight}})
console.log(JSON.stringify(meta))


for (const y of [2100,2450,2600,2800,3000]) {
  await page.evaluate(y=>{window.scrollTo(0,y);window.dispatchEvent(new Event('scroll'))}, y)
  await new Promise(r=>setTimeout(r,1200))
  const v=await page.evaluate(()=>{
    const S=window.__ST, roots=[...document.querySelectorAll('.parallax')]
    const g=roots[1]
    const deep=g.querySelector('[data-parallax-deep]')
    return {prog:S.getAll().map(t=>+t.progress.toFixed(3)),
      gatePlate:[...g.querySelectorAll('[data-parallax-plate]')].map(e=>Math.round(new DOMMatrix(getComputedStyle(e).transform).m42)),
      deepOp:+getComputedStyle(deep).opacity, deepVis:getComputedStyle(deep).visibility,
      stag:[...deep.querySelectorAll('[data-parallax-stagger]')].map(e=>(getComputedStyle(e).clipPath||'').slice(0,22)),
      band:g.dataset.kiBand}})
  console.log(y, JSON.stringify(v))
}
await br.close(); srv.close()
