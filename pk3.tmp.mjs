import puppeteer from 'puppeteer-core'
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms))
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--hide-scrollbars']})
const p=await b.newPage(); await p.setViewport({width:1440,height:900})
await p.goto('https://pk.is/projects/hafnartorg',{waitUntil:'networkidle2',timeout:40000}); await sleep(2500)
await p.mouse.move(700,400); for(let i=0;i<12;i++){await p.mouse.wheel({deltaY:500});await sleep(110)}
await sleep(2000)
const urls=await p.evaluate(()=>[...new Set([...document.querySelectorAll('*')]
  .map(e=>getComputedStyle(e).backgroundImage)
  .filter(v=>/url\(/.test(v))
  .map(v=>(v.match(/url\("?([^")]+)"?\)/)||[])[1])
  .filter(Boolean).filter(u=>/^http/.test(u)))])
console.log('bg image urls found:',urls.length)
console.log(urls.slice(0,5))
// measure real pixel size of a few by loading them
const sizes=[]
for(const u of urls.slice(0,6)){
  const d=await p.evaluate((src)=>new Promise(res=>{
    const i=new Image(); i.onload=()=>res({w:i.naturalWidth,h:i.naturalHeight}); i.onerror=()=>res({w:0,h:0}); i.src=src
  }),u)
  sizes.push({u:u.slice(-46),...d})
}
console.log('\nresolutions:'); sizes.forEach(s=>console.log(`  ${String(s.w).padStart(5)}x${String(s.h).padStart(4)}  ${s.u}`))
await b.close()
