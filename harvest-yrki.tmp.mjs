import puppeteer from 'puppeteer-core'
import { writeFileSync } from 'node:fs'
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms))
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--hide-scrollbars']})
const p=await b.newPage(); await p.setViewport({width:1440,height:900})

// 1 — project index: all portfolio links + list titles
await p.goto('https://www.yrki.is/verkefni/',{waitUntil:'networkidle2',timeout:45000}); await sleep(2500)
await p.mouse.move(700,400); for(let i=0;i<24;i++){await p.mouse.wheel({deltaY:700});await sleep(90)}
await sleep(1500)
const index=await p.evaluate(()=>{
  const links=[...new Set([...document.querySelectorAll('a')].map(a=>a.href).filter(h=>/portfolio_page/.test(h)))]
  // titles as they appear on the index
  const titles=[...document.querySelectorAll('a')].filter(a=>/portfolio_page/.test(a.href)).map(a=>(a.innerText||'').trim()).filter(Boolean)
  return {links, titles:[...new Set(titles)]}
})
console.log('index links:',index.links.length,'titles:',index.titles.length)

// 2 — practice page
await p.goto('https://www.yrki.is/stofan/',{waitUntil:'networkidle2',timeout:45000}).catch(()=>{})
await sleep(2000); await p.mouse.move(700,400); for(let i=0;i<10;i++){await p.mouse.wheel({deltaY:600});await sleep(90)}
const stofan=await p.evaluate(()=>document.body.innerText.replace(/[ \t]+/g,' ').trim().slice(0,4000))

// 3 — awards/certifications page
await p.goto('https://www.yrki.is/vottanir/',{waitUntil:'networkidle2',timeout:45000}).catch(()=>{})
await sleep(2000); await p.mouse.move(700,400); for(let i=0;i<10;i++){await p.mouse.wheel({deltaY:600});await sleep(90)}
const vottanir=await p.evaluate(()=>document.body.innerText.replace(/[ \t]+/g,' ').trim().slice(0,4000))

// 4 — every project page
const projects=[]
for(const u of index.links){
  try{
    await p.goto(u,{waitUntil:'networkidle2',timeout:35000}); await sleep(1100)
    await p.mouse.move(700,400); for(let i=0;i<6;i++){await p.mouse.wheel({deltaY:600});await sleep(70)}
    await sleep(700)
    const d=await p.evaluate(()=>{
      const t=document.body.innerText.replace(/[ \t]+/g,' ')
      const h1=document.querySelector('h1,h2.entry-title,.portfolio-title')
      const imgs=[...document.images].map(i=>i.currentSrc||i.src).filter(s=>/uploads/.test(s)&&!/logo/i.test(s))
      // biggest variant per image: strip -WxH suffix
      const full=[...new Set(imgs.map(s=>s.replace(/-\d+x\d+(?=\.\w+$)/,'')))]
      return {
        url:location.href, name:(h1?h1.innerText:document.title.split('-')[0]).trim(),
        text:t.slice(0,1600),
        areas:(t.match(/[\d.,]+\s?(?:m2|m²|fm)\b/gi)||[]),
        years:(t.match(/\b(19|20)\d{2}\b/g)||[]),
        photos:full.slice(0,24),
      }
    })
    projects.push(d)
    process.stdout.write('.')
  }catch(e){ process.stdout.write('x') }
}
console.log('\nprojects harvested:',projects.length)
writeFileSync('/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/d20d2de7-77d0-473d-a794-5c6ca8fe50cb/scratchpad/yrki-harvest.json',
  JSON.stringify({harvestedAt:'2026-08-10',index,stofan,vottanir,projects},null,1))
console.log('saved yrki-harvest.json')
await b.close()
