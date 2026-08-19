import puppeteer from 'puppeteer-core'
import { writeFileSync, readFileSync } from 'node:fs'
const SP='/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/d20d2de7-77d0-473d-a794-5c6ca8fe50cb/scratchpad'
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms))
const old=JSON.parse(readFileSync(SP+'/gk-harvest.json'))
const urls=old.projects.map(p=>p.url)
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--hide-scrollbars']})
const p=await b.newPage(); await p.setViewport({width:1440,height:900})
const projects=[]
for(const u of urls){
  try{
    await p.goto(u,{waitUntil:'networkidle2',timeout:35000}); await sleep(1200)
    await p.mouse.move(700,400); for(let i=0;i<6;i++){await p.mouse.wheel({deltaY:600});await sleep(70)}
    const d=await p.evaluate(()=>{
      // strip header/menu noise from text
      const art=document.querySelector('article, .post, .entry-content, main')||document.body
      const t=art.innerText.replace(/[ \t]+/g,' ').trim()
      const imgs=[...document.images].map(i=>i.currentSrc||i.src).filter(s=>/uploads/.test(s)&&!/logo|icon/i.test(s))
      const full=[...new Set(imgs.map(s=>s.replace(/-\d+x\d+(?=\.\w+$)/,'')))]
      return {url:location.href, title:document.title, text:t.slice(0,2200),
        years:(t.match(/\b(18|19|20)\d{2}\b/g)||[]), photos:full}
    })
    projects.push(d); process.stdout.write('.')
  }catch{process.stdout.write('x')}
}
console.log('\n',projects.length)
writeFileSync(SP+'/gk-harvest2.json',JSON.stringify({harvestedAt:'2026-08-10',pages:old.pages,projects},null,1))
console.log('saved gk-harvest2.json')
await b.close()
