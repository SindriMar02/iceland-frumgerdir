import puppeteer from 'puppeteer-core'
import { writeFileSync } from 'node:fs'
const SP='/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/d20d2de7-77d0-473d-a794-5c6ca8fe50cb/scratchpad'
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms))
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--hide-scrollbars']})
const p=await b.newPage(); await p.setViewport({width:1440,height:900})

const CATS=[
 ['atvinnuhusnaedi','https://www.tark.is/atvinnuh%C3%BAsn%C3%A6%C3%B0i'],
 ['ibudarhusnaedi','https://www.tark.is/%C3%ADb%C3%BA%C3%B0arh%C3%BAsn%C3%A6%C3%B0i'],
 ['hotel-ferdathjonusta','https://www.tark.is/h%C3%B3tel-og-fer%C3%B0a%C3%BEj%C3%B3nusta'],
 ['ithrottir-kennsla','https://www.tark.is/%C3%AD%C3%BEr%C3%B3ttir-og-kennsla'],
 ['skipulag','https://www.tark.is/skipulag'],
 ['idnadur','https://www.tark.is/i%C3%B0na%C3%B0ur'],
]
const cats={}
const projectUrls=new Set()
for(const [k,u] of CATS){
  try{
    await p.goto(u,{waitUntil:'networkidle2',timeout:50000}); await sleep(3000)
    await p.mouse.move(700,400); for(let i=0;i<25;i++){await p.mouse.wheel({deltaY:800});await sleep(130)}
    await sleep(1500)
    const d=await p.evaluate(()=>{
      const t=document.body.innerText.replace(/[ \t]+/g,' ')
      // wix dynamic item pages
      const links=[...new Set([...document.querySelectorAll('a')].map(a=>a.href)
        .filter(h=>h.includes('tark.is')&&!/mailto|home|verk$|#/.test(h)))]
      const imgs=[...new Set([...document.images].map(i=>i.currentSrc||i.src).filter(s=>/wixstatic/.test(s)))]
      return {text:t.slice(0,3500), links, imgs:imgs.slice(0,10)}
    })
    cats[k]=d
    d.links.forEach(l=>projectUrls.add(l))
    console.log(k,'text:',d.text.length,'links:',d.links.length,'imgs:',d.imgs.length)
  }catch(e){console.log(k,'FAIL')}
}
// staff page (home has it) + EN about
await p.goto('https://www.tark.is/',{waitUntil:'networkidle2',timeout:50000}); await sleep(3000)
await p.mouse.move(700,400); for(let i=0;i<30;i++){await p.mouse.wheel({deltaY:800});await sleep(110)}
const home=await p.evaluate(()=>document.body.innerText.replace(/[ \t]+/g,' ').trim())
writeFileSync(SP+'/tark-harvest.json',JSON.stringify({harvestedAt:'2026-08-10',home,cats},null,1))
console.log('home text len:',home.length)
console.log('saved tark-harvest.json')
await b.close()
