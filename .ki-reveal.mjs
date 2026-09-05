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
await (await page.createCDPSession()).send('Emulation.setEmulatedMedia',{features:[{name:'hover',value:'none'},{name:'pointer',value:'coarse'}]})
await page.goto(`http://localhost:${port}/`,{waitUntil:'networkidle0'})
await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto'})
await new Promise(r=>setTimeout(r,1500))
const rs=await page.evaluate(()=>[...document.querySelectorAll('.parallax--sticky')].map(e=>{const r=e.getBoundingClientRect();return {top:Math.round(r.top+window.scrollY), span:Math.round(r.height-e.querySelector('.parallax__header').clientHeight)}}))
const num=s=>{const m=String(s).match(/[\d.]+/);return m?+m[0]:(String(s)==='none'?-1:0)}
for (const [i,label] of [[0,'descent / strata'],[1,'way out / gate']]) {
  const seen={op:new Set(),vis:new Set()}
  const series=[]
  for (let k=0;k<=16;k++) {
    const p=k/16
    await page.evaluate(y=>{window.scrollTo(0,y);window.dispatchEvent(new Event('scroll'))}, rs[i].top+rs[i].span*p)
    await new Promise(r=>setTimeout(r,650))
    const d=await page.evaluate(j=>{
      const deep=document.querySelectorAll('[data-parallax-deep]')[j]
      const st=[...deep.querySelectorAll('[data-parallax-stagger]')]
      const wd=[...deep.querySelectorAll('[data-parallax-word]')]
      const g=e=>getComputedStyle(e)
      return {clip:st.map(e=>g(e).clipPath), wy:wd.map(e=>Math.round(new DOMMatrix(g(e).transform).m42)),
        op:[...st,...wd].map(e=>g(e).opacity), vis:[...st,...wd].map(e=>g(e).visibility),
        deepOp:g(deep).opacity}}, i)
    d.op.forEach(v=>seen.op.add(v)); d.vis.forEach(v=>seen.vis.add(v))
    seen.op.add(d.deepOp)
    series.push({p, clip:d.clip.map(num), wy:d.wy})
  }
  let none=0, rev=0
  for (let k=0;k<series[0].clip.length;k++){ let prev=null
    for (const r of series){ const v=r.clip[k]; if(v<0) none++; if(prev!==null && v>prev+0.5) rev++; prev=v } }
  let wrev=0
  for (let k=0;k<series[0].wy.length;k++){ let prev=null
    for (const r of series){ const v=r.wy[k]; if(prev!==null && v>prev+2) wrev++; prev=v } }
  console.log(`${label}
  held at start: clip ${series[0].clip.join(',')}   word y ${series[0].wy.join(',')}
  at the end:    clip ${series[series.length-1].clip.join(',')}   word y ${series[series.length-1].wy.join(',')}
  frames where an item had NO clip at all: ${none}   clip reversals ${rev}   word reversals ${wrev}
  every opacity value seen: ${[...seen.op].sort().join(', ')}
  every visibility seen:    ${[...seen.vis].join(', ')}`)
}
await br.close(); srv.close()
