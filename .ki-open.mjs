/* the opening, frame by frame: does the stone hold from first paint, is the
   name covered, how do the plates sink, is scroll held, and do the repeat
   and reduced-motion paths start at rest */
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { createServer } from 'node:http'
import puppeteer from 'puppeteer-core'
import { PNG } from 'pngjs'
const ROOT='dist-katrin'
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.avif':'image/avif','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json','.txt':'text/plain','.xml':'application/xml'}
const srv=createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=join(ROOT,p);if(existsSync(f)&&statSync(f).isDirectory())f=join(f,'index.html');if(!existsSync(f)||p.endsWith('/'))f=join(ROOT,'index.html');try{const b=readFileSync(f);r.writeHead(200,{'content-type':MIME[extname(f)]||'application/octet-stream'});r.end(b)}catch{r.writeHead(404);r.end('x')}}).listen(0)
const port=srv.address().port
const br=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'})
const state=()=>{
  const L=[...document.querySelectorAll('[data-parallax-letter]')]
  const box=document.querySelector('.ki-plx-l')?.getBoundingClientRect().height||1
  return {
  // how far each letter still sits below its mask, as a fraction of the mask
  letters:L.map(e=>Math.round(new DOMMatrix(getComputedStyle(e).transform).m42/box*100)),
  room:(()=>{const e=document.querySelector('[data-parallax-layer="1"]');return e?(+getComputedStyle(e).opacity).toFixed(2):null})(),
  plates:[...document.querySelectorAll('[data-parallax-plate]')].map(e=>(+getComputedStyle(e).opacity).toFixed(2)),
  role:(+getComputedStyle(document.querySelector('.ki-plx-role')).opacity).toFixed(2),
  corner:(+getComputedStyle(document.querySelector('.parallax__corner')).opacity).toFixed(2),
  ov:document.documentElement.style.overflow, sy:window.scrollY,
  attr:document.documentElement.dataset.kiIntro||'-',
}}
const lum=(png,x,y)=>{const i=(y*png.width+x)*4;return (0.2126*png.data[i]+0.7152*png.data[i+1]+0.0722*png.data[i+2])|0}
for (const [w,h,tag] of [[1600,1000,'desktop'],[390,844,'phone']]) {
  const ctx=await br.createBrowserContext()
  const page=await ctx.newPage(); await page.setViewport({width:w,height:h,isMobile:w<600,hasTouch:w<600})
  if (w<600) await (await page.createCDPSession()).send('Emulation.setEmulatedMedia',{features:[{name:'hover',value:'none'},{name:'pointer',value:'coarse'}]})
  // first paint: block the module so we see the prerendered CSS state alone
  await page.setRequestInterception(true)
  let block=true
  page.on('request',r=>{ if(block&&r.resourceType()==='script'&&r.url().includes('/assets/')) r.abort(); else r.continue() })
  await page.goto(`http://localhost:${port}/`,{waitUntil:'load'})
  await new Promise(r=>setTimeout(r,600))
  const s0=await page.evaluate(state)
  const name=await page.evaluate(()=>{const r=document.querySelector('.ki-plx-name').getBoundingClientRect();return {x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2)}})
  const shot0=PNG.sync.read(await page.screenshot())
  const covered=lum(shot0,name.x,name.y)
  // row-mean brightness of the frame: is it stone?
  let mean=0; for(let i=0;i<shot0.data.length;i+=4*97) mean+=shot0.data[i]; mean=Math.round(mean/(shot0.data.length/(4*97)))
  console.log(`${tag} FIRST PAINT (no JS): letters below mask ${s0.letters.slice(0,3).join(',')}% · room op ${s0.room} · plates op ${s0.plates.join(',')} · corner ${s0.corner} · pixel where name will be ${covered} · frame mean ${mean} (ground if <45)`)
  // now with JS, fresh context
  await page.close()
  const p2=await ctx.newPage(); await p2.setViewport({width:w,height:h,isMobile:w<600,hasTouch:w<600})
  if (w<600) await (await p2.createCDPSession()).send('Emulation.setEmulatedMedia',{features:[{name:'hover',value:'none'},{name:'pointer',value:'coarse'}]})
  await p2.evaluateOnNewDocument(()=>{ try{ if(!localStorage.getItem('visited')){ sessionStorage.clear(); localStorage.setItem('visited','1') } }catch{} })
  const t0=Date.now()
  await p2.goto(`http://localhost:${port}/`,{waitUntil:'domcontentloaded'})
  const rows=[]
  for (const at of [100,500,900,1300,1700,2100,2500,2900,3400,4000]) {
    const wait=at-(Date.now()-t0); if(wait>0) await new Promise(r=>setTimeout(r,wait))
    const s=await p2.evaluate(state); rows.push(`  ${String(at).padStart(4)}ms  letters ${s.letters.slice(0,4).map(v=>String(v).padStart(4)).join(' ')}  role ${s.role}  room ${s.room}  plates ${s.plates.join(' ')}  corner ${s.corner}  ov "${s.ov}"  attr ${s.attr}`)
  }
  console.log(`${tag} OPENING:\n`+rows.join('\n'))
  // scroll attempt mid-intro is held? test at end: try scrolling now
  await p2.evaluate(()=>window.scrollTo(0,600)); await new Promise(r=>setTimeout(r,300))
  const after=await p2.evaluate(state)
  const moved=await p2.evaluate(()=>[...document.querySelectorAll('[data-parallax-plate]')].map(e=>Math.round(new DOMMatrix(getComputedStyle(e).transform).m42)))
  console.log(`${tag} after intro, scrollTo(600): sy ${after.sy} plate y ${moved.join(',')} (scrub live if non-zero)`)
  // repeat visit in same context (sessionStorage now set)
  await p2.goto(`http://localhost:${port}/`,{waitUntil:'load'}); await new Promise(r=>setTimeout(r,200))
  const rep=await p2.evaluate(state)
  console.log(`${tag} REPEAT VISIT at 200ms: letters ${rep.letters.slice(0,3).join(',')}% room ${rep.room} corner ${rep.corner} seen=${await p2.evaluate(()=>document.documentElement.dataset.kiSeen)} attr ${rep.attr}`)
  await ctx.close()
}
// reduced motion, fresh
const ctx=await br.createBrowserContext(); const p3=await ctx.newPage(); await p3.setViewport({width:1600,height:1000})
await p3.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}])
await p3.goto(`http://localhost:${port}/`,{waitUntil:'load'}); await new Promise(r=>setTimeout(r,300))
const rm=await p3.evaluate(state); console.log(`reduced motion at 300ms: letters ${rm.letters.slice(0,3).join(',')}% room ${rm.room} corner ${rm.corner} ov "${rm.ov}" attr ${rm.attr}`)
await ctx.close(); await br.close(); srv.close()
