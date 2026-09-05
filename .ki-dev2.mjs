/* the DEV server, which is what the browser is actually showing: StrictMode
   double-invokes every effect there and the page is not prerendered */
import puppeteer from 'puppeteer-core'
const URL='http://localhost:5398/preview/katrinisfeld'
const br=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'})
const page=await br.newPage(); await page.setViewport({width:1600,height:1000})
page.on('pageerror',e=>console.log('PAGEERROR',e.message.slice(0,140)))
page.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text().slice(0,140))})
await (await page.createCDPSession()).send('Emulation.setEmulatedMedia',{features:[{name:'hover',value:'none'},{name:'pointer',value:'coarse'}]})
const t0=Date.now()
await page.goto(URL,{waitUntil:'domcontentloaded'})
const snap=async()=>page.evaluate(()=>{
  const l=document.querySelector('[data-parallax-letter]')
  const room=document.querySelector('[data-parallax-layer="1"]')
  const near=document.querySelectorAll('[data-parallax-plate]')[2]
  const h1=document.querySelector('.ki-plx-name')
  return l?{
    attr:document.documentElement.dataset.kiIntro||'-',
    letterY:Math.round(new DOMMatrix(getComputedStyle(l).transform).m42),
    roomOp:+getComputedStyle(room).opacity, nearOp:+getComputedStyle(near).opacity,
    h1Top:Math.round(h1.getBoundingClientRect().top), ov:document.documentElement.style.overflow,
  }:'no letters yet'})
for (const at of [250,600,1000,1500,2200,3000,3800,4600]) {
  const w=at-(Date.now()-t0); if(w>0) await new Promise(r=>setTimeout(r,w))
  console.log(String(at).padStart(4)+'ms', JSON.stringify(await snap()))
}
/* and the descent: does the wordmark leave the screen? */
const rs=await page.evaluate(()=>{const e=document.querySelector('.parallax--sticky');const r=e.getBoundingClientRect()
  return {top:Math.round(r.top+window.scrollY), span:Math.round(r.height-e.querySelector('.parallax__header').clientHeight)}})
console.log('descent', JSON.stringify(rs))
for (const p of [0,0.25,0.5,0.75,1]) {
  await page.evaluate(y=>{window.scrollTo(0,y);window.dispatchEvent(new Event('scroll'))}, rs.top+rs.span*p)
  await new Promise(r=>setTimeout(r,700))
  const d=await page.evaluate(()=>{
    const h1=document.querySelector('.ki-plx-name').getBoundingClientRect()
    const title=document.querySelector('.parallax__layer-title').getBoundingClientRect()
    const masks=[...document.querySelectorAll('.ki-plx-l')].map(e=>{const r=e.getBoundingClientRect();return Math.round(r.top)})
    return {titleTop:Math.round(title.top), h1:[Math.round(h1.top),Math.round(h1.bottom)],
      onScreen:h1.bottom>0&&h1.top<window.innerHeight, maskTop:Math.min(...masks), maskBottom:Math.max(...masks)}})
  console.log(`  p=${p}`, JSON.stringify(d))
}
await br.close()
