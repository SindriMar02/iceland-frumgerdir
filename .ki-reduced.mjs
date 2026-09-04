/* Reduced motion: a pin whose whole content is the movement must not survive
   as a tall empty section. Both gates collapse to one screen; the descent
   keeps its planes and drops the copy written to arrive at the bottom of it,
   the ascent drops the wall and keeps the light and the sentence. */
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { createServer } from 'node:http'
import puppeteer from 'puppeteer-core'
const ROOT='dist-katrin'
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.avif':'image/avif','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json','.txt':'text/plain','.xml':'application/xml'}
const srv=createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=join(ROOT,p);if(existsSync(f)&&statSync(f).isDirectory())f=join(f,'index.html');if(!existsSync(f)||p.endsWith('/'))f=join(ROOT,'index.html');try{const b=readFileSync(f);r.writeHead(200,{'content-type':MIME[extname(f)]||'application/octet-stream'});r.end(b)}catch{r.writeHead(404);r.end('x')}}).listen(0)
const port=srv.address().port
const br=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'})
const page=await br.newPage(); await page.setViewport({width:1280,height:800})
await (await page.createCDPSession()).send('Emulation.setEmulatedMedia',
  {features:[{name:'prefers-reduced-motion',value:'reduce'},{name:'hover',value:'none'},{name:'pointer',value:'coarse'}]})
await page.goto(`http://localhost:${port}/`,{waitUntil:'networkidle0'})
await page.evaluate(()=>{document.querySelector('.ki-curtain')?.remove();document.documentElement.style.scrollBehavior='auto'})
await new Promise(r=>setTimeout(r,900))
const r = await page.evaluate(()=>{
  const gs=[...document.querySelectorAll('.parallax--sticky')]
  return gs.map(g=>{
    const d=g.querySelector('[data-parallax-deep]')
    const cs=d&&getComputedStyle(d)
    return { h: Math.round(g.getBoundingClientRect().height),
      gate: g.classList.contains('parallax--gate'),
      plates: [...g.querySelectorAll('.parallax__layer-img')].map(e=>getComputedStyle(e).display).join(','),
      deep: cs ? `${cs.display}/${cs.visibility}/${cs.opacity}` : 'none' }
  })
})
console.log('reduced motion, 1280x800:')
for (const g of r) console.log(`  ${g.gate?'ascent ':'descent'}  wrapper ${g.h}px  layer-img display [${g.plates}]  deep ${g.deep}`)
const docH = await page.evaluate(()=>document.documentElement.scrollHeight)
console.log(`  document ${docH}px`)
for (const [n,y] of [['rm-hero',0],['rm-gate',null]]) {
  const yy = y ?? await page.evaluate(()=>{const g=document.querySelectorAll('.parallax--sticky')[1];return g.getBoundingClientRect().top+window.scrollY})
  await page.evaluate(y=>{window.scrollTo(0,y);window.dispatchEvent(new Event('scroll'))},yy)
  await new Promise(r=>setTimeout(r,250))
  await page.screenshot({path:`/tmp/ki-gate/${n}.png`})
}
await br.close(); srv.close()
