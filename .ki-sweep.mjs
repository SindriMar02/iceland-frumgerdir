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
let last=null
for (let y=0; y<=meta.rs[1].top+meta.rs[1].h+400; y+=150) {
  await page.evaluate(y=>{window.scrollTo(0,y);window.dispatchEvent(new Event('scroll'))}, y)
  await new Promise(r=>setTimeout(r,40))
  const v=await page.evaluate(()=>{
    const roots=[...document.querySelectorAll('.parallax')]
    return roots.map(r=>[...r.querySelectorAll('[data-parallax-plate]')].map(e=>Math.round(new DOMMatrix(getComputedStyle(e).transform).m42))[0])})
  const key=v.join('|')
  if (key!==last) { console.log(`  y ${String(y).padStart(5)}  descent plate0 ${String(v[0]).padStart(6)}  gate plate0 ${String(v[1]).padStart(6)}`); last=key }
}
await br.close(); srv.close()
