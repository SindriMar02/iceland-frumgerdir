/* step the scroll finely through both deep blocks and look for anything
   non-monotonic — a value that goes up and then back down between two
   neighbouring scroll positions is a flicker the eye will catch */
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
// coarse pointer: Lenis off, so window.scrollTo is the truth
await (await page.createCDPSession()).send('Emulation.setEmulatedMedia',{features:[{name:'hover',value:'none'},{name:'pointer',value:'coarse'}]})
await page.goto(`http://localhost:${port}/`,{waitUntil:'networkidle0'})
await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto'})
await new Promise(r=>setTimeout(r,1400))
const g=await page.evaluate(()=>[...document.querySelectorAll('.parallax--sticky')].map(e=>{const r=e.getBoundingClientRect();return {top:r.top+window.scrollY, span:r.height-e.querySelector('.parallax__header').clientHeight}}))
for (const [idx,name] of [[0,'descent / strata'],[1,'way out / gate']]) {
  const rows=[]
  for (let i=0;i<=60;i++) {
    const p=i/60
    await page.evaluate(y=>{window.scrollTo(0,y);window.dispatchEvent(new Event('scroll'))}, g[idx].top+g[idx].span*p)
    await new Promise(r=>setTimeout(r,45))
    const s=await page.evaluate((i)=>{
      const deep=document.querySelectorAll('[data-parallax-deep]')[i]
      const num=(v)=>{const m=String(v).match(/[\d.]+/);return m?+m[0]:0}
      const cs=getComputedStyle(deep)
      return {p:+cs.opacity, v:cs.visibility,
        words:[...deep.querySelectorAll('[data-parallax-word]')].map(e=>+getComputedStyle(e).opacity),
        wy:[...deep.querySelectorAll('[data-parallax-word]')].map(e=>Math.round(new DOMMatrix(getComputedStyle(e).transform).m42)),
        wv:[...deep.querySelectorAll('[data-parallax-word]')].map(e=>getComputedStyle(e).visibility),
        sc:[...deep.querySelectorAll('[data-parallax-stagger]')].map(e=>num(getComputedStyle(e).clipPath)),
        so:[...deep.querySelectorAll('[data-parallax-stagger]')].map(e=>+getComputedStyle(e).opacity),
        sv:[...deep.querySelectorAll('[data-parallax-stagger]')].map(e=>getComputedStyle(e).visibility)}
    }, idx)
    rows.push({p, ...s})
  }
  // any opacity or visibility change at all inside the block?
  const opSet=new Set(), visSet=new Set()
  for(const r of rows){ r.words.forEach(v=>opSet.add(v)); r.so.forEach(v=>opSet.add(v))
    r.wv.forEach(v=>visSet.add(v)); r.sv.forEach(v=>visSet.add(v)) }
  // non-monotonic clip: does any item's inset ever grow again after shrinking?
  let bad=0
  const n=rows[0].sc.length
  for(let k=0;k<n;k++){ let prev=101
    for(const r of rows){ const v=r.sc[k]; if(v>prev+0.6) bad++; prev=Math.min(prev,v) } }
  let wbad=0
  for(let k=0;k<rows[0].wy.length;k++){ let prev=1e9
    for(const r of rows){ const v=r.wy[k]; if(v>prev+2) wbad++; prev=Math.min(prev,v) } }
  const first=rows[0], last=rows[rows.length-1]
  console.log(`${name}
  container opacity  start ${first.p} end ${last.p}  visibility ${first.v} -> ${last.v}
  opacity values seen inside the block: ${[...opSet].sort().join(', ')}
  visibility values seen inside:        ${[...visSet].join(', ')}
  clip wipe reversals: ${bad}   word rise reversals: ${wbad}
  first frame clips ${first.sc.join(',')}  last frame clips ${last.sc.join(',')}
  first frame word y ${first.wy.join(',')}  last ${last.wy.join(',')}`)
}
await br.close(); srv.close()
