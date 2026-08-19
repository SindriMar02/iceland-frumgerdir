import puppeteer from 'puppeteer-core'
import { writeFileSync, readFileSync } from 'node:fs'
const SP='/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/d20d2de7-77d0-473d-a794-5c6ca8fe50cb/scratchpad'
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms))
const cats=JSON.parse(readFileSync(SP+'/tark-harvest.json')).cats
// candidate project links (dynamic wix pages)
const urls=[...new Set(Object.values(cats).flatMap(c=>c.links))]
  .filter(u=>!/atvinnuh|%C3%ADb%C3%BA%C3%B0arh|h%C3%B3tel-og|%C3%AD%C3%BEr%C3%B3ttir|skipulag$|i%C3%B0na%C3%B0ur|home|verk|vid$|EN/i.test(u))
console.log('candidate project pages:',urls.length); urls.forEach(u=>console.log(' ',u.replace('https://www.tark.is','')))
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--hide-scrollbars']})
const p=await b.newPage(); await p.setViewport({width:1440,height:900})
const pages=[]
for(const u of urls){
  try{
    await p.goto(u,{waitUntil:'networkidle2',timeout:45000}); await sleep(2500)
    await p.mouse.move(700,400); for(let i=0;i<12;i++){await p.mouse.wheel({deltaY:700});await sleep(110)}
    await sleep(1500)
    const d=await p.evaluate(()=>{
      const t=document.body.innerText.replace(/[ \t]+/g,' ')
      const imgs=[...new Set([...document.images].map(i=>i.currentSrc||i.src)
        .filter(s=>/wixstatic\.com\/media/.test(s))
        .map(s=>s.replace(/\/v1\/.*/,'')))] // original resolution
      return {url:location.href, title:document.title.slice(0,60), text:t.slice(0,900), imgs:imgs.slice(0,20)}
    })
    pages.push(d); console.log('ok',d.title,'imgs:',d.imgs.length)
  }catch(e){ console.log('fail',u.slice(-30)) }
}
writeFileSync(SP+'/tark-pages.json',JSON.stringify(pages,null,1))
await b.close()
