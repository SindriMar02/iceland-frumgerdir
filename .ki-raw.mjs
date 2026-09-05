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
await page.evaluateOnNewDocument(()=>{try{sessionStorage.setItem('ki_seen','1')}catch{}})
await (await page.createCDPSession()).send('Emulation.setEmulatedMedia',{features:[{name:'hover',value:'none'},{name:'pointer',value:'coarse'}]})
await page.goto(`http://localhost:${port}/`,{waitUntil:'networkidle0'})
await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto'})
await new Promise(r=>setTimeout(r,1400))
const info=await page.evaluate(()=>{
  const st=window.ScrollTrigger||null
  return {triggers: st? st.getAll().length : 'no ScrollTrigger global',
    deeps: document.querySelectorAll('[data-parallax-deep]').length,
    stag0: document.querySelectorAll('[data-parallax-deep]')[0].querySelectorAll('[data-parallax-stagger]').length,
    stag1: document.querySelectorAll('[data-parallax-deep]')[1].querySelectorAll('[data-parallax-stagger]').length}})
console.log(JSON.stringify(info))
const g=await page.evaluate(()=>[...document.querySelectorAll('.parallax--sticky')].map(e=>{const r=e.getBoundingClientRect();return {top:r.top+window.scrollY, span:r.height-e.querySelector('.parallax__header').clientHeight}}))
for (const [idx,label] of [[0,'strata'],[1,'gate']]) {
  for (const p of [0,0.3,0.55,0.7,0.85,1]) {
    await page.evaluate(y=>{window.scrollTo(0,y);window.dispatchEvent(new Event('scroll'))}, g[idx].top+g[idx].span*p)
    await new Promise(r=>setTimeout(r,90))
    const d=await page.evaluate(i=>{
      const deep=document.querySelectorAll('[data-parallax-deep]')[i]
      const S=[...deep.querySelectorAll('[data-parallax-stagger]')].slice(0,3).map(e=>(e.getAttribute('style')||'-').replace(/translate: none; rotate: none; scale: none; ?/,'').slice(0,54))
      const W=[...deep.querySelectorAll('[data-parallax-word]')].slice(0,3).map(e=>(e.getAttribute('style')||'-').replace(/translate: none; rotate: none; scale: none; ?/,'').slice(0,44))
      return {S,W}}, idx)
    console.log(`${label} p=${p}\n   stag ${d.S.join(' | ')}\n   word ${d.W.join(' | ')}`)
  }
}
await br.close(); srv.close()
