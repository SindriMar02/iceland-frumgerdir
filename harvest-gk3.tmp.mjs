import puppeteer from 'puppeteer-core'
import { writeFileSync, readFileSync } from 'node:fs'
const SP='/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/d20d2de7-77d0-473d-a794-5c6ca8fe50cb/scratchpad'
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms))
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--hide-scrollbars']})
const p=await b.newPage(); await p.setViewport({width:1440,height:900})

// gather urls: homepage (deep scroll) + /projects (deep scroll, long waits)
let links=new Set(JSON.parse(readFileSync(SP+'/gk-nav.json')).navLinks
  .map(l=>l.h).filter(h=>/glamakim\.is\/20\d\d\//.test(h)))
for(const u of ['https://glamakim.is/','https://glamakim.is/projects/']){
  try{
    await p.goto(u,{waitUntil:'networkidle2',timeout:40000}); await sleep(2500)
    await p.mouse.move(700,400)
    for(let i=0;i<40;i++){await p.mouse.wheel({deltaY:800});await sleep(160)}
    await sleep(2000)
    const found=await p.evaluate(()=>[...new Set([...document.querySelectorAll('a')].map(a=>a.href).filter(h=>/glamakim\.is\/20\d\d\//.test(h)))])
    found.forEach(f=>links.add(f))
    console.log(u,'->',found.length,'cumulative:',links.size)
  }catch(e){console.log(u,'FAIL',e.message.slice(0,50))}
}
links=[...links].map(u=>u.replace(/\/$/,''))
console.log('total:',links.length)

const pages={}
for(const [k,u] of [['about','https://glamakim.is/about'],['staff','https://glamakim.is/staff-page']]){
  await p.goto(u,{waitUntil:'networkidle2',timeout:35000}).catch(()=>{})
  await sleep(1800); await p.mouse.move(700,400); for(let i=0;i<12;i++){await p.mouse.wheel({deltaY:600});await sleep(80)}
  pages[k]=await p.evaluate(()=>document.body.innerText.replace(/[ \t]+/g,' ').trim().slice(0,6000))
}

const projects=[]
for(const u of links){
  try{
    await p.goto(u,{waitUntil:'networkidle2',timeout:35000}); await sleep(1100)
    await p.mouse.move(700,400); for(let i=0;i<6;i++){await p.mouse.wheel({deltaY:600});await sleep(70)}
    await sleep(500)
    const d=await p.evaluate(()=>{
      const t=document.body.innerText.replace(/[ \t]+/g,' ')
      const h1=document.querySelector('h1, .entry-title')
      const imgs=[...document.images].map(i=>i.currentSrc||i.src).filter(s=>/uploads/.test(s)&&!/logo|icon/i.test(s))
      const full=[...new Set(imgs.map(s=>s.replace(/-\d+x\d+(?=\.\w+$)/,'')))]
      return {url:location.href, name:(h1?h1.innerText:document.title.split('–')[0]).trim(),
        text:t.slice(0,1800),
        areas:(t.match(/[\d.,]+\s?(?:m2|m²|fm)\b/gi)||[]),
        years:(t.match(/\b(19|20)\d{2}\b/g)||[]),
        photos:full.slice(0,24)}
    })
    projects.push(d); process.stdout.write('.')
  }catch{ process.stdout.write('x') }
}
console.log('\nprojects:',projects.length)
writeFileSync(SP+'/gk-harvest.json',JSON.stringify({harvestedAt:'2026-08-10',pages,projects},null,1))
console.log('saved')
await b.close()
