import puppeteer from 'puppeteer-core'
const OUT='/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/d20d2de7-77d0-473d-a794-5c6ca8fe50cb/scratchpad'
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms))
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--hide-scrollbars']})
const p=await b.newPage(); await p.setViewport({width:1440,height:900,deviceScaleFactor:2})
await p.goto('https://www.yrki.is/',{waitUntil:'networkidle2',timeout:45000}); await sleep(3000)
await p.mouse.move(700,400); for(let i=0;i<10;i++){await p.mouse.wheel({deltaY:500});await sleep(110)}
await sleep(1500)
await p.screenshot({path:`${OUT}/yrki-home.png`})
console.log('HOME:',JSON.stringify(await p.evaluate(()=>({
  title:document.title, txt:document.body.innerText.replace(/\s+/g,' ').slice(0,300),
  imgs:[...document.images].map(i=>({w:i.naturalWidth,src:(i.currentSrc||i.src).slice(-40)})).slice(0,8),
  navs:[...document.querySelectorAll('a')].map(a=>a.innerText.trim()).filter(Boolean).slice(0,15),
}))))
// portfolio index
await p.goto('https://www.yrki.is/verkefni/',{waitUntil:'networkidle2',timeout:45000}); await sleep(2500)
await p.mouse.move(700,400); for(let i=0;i<20;i++){await p.mouse.wheel({deltaY:600});await sleep(110)}
await sleep(2000)
const idx=await p.evaluate(()=>{
  const links=[...new Set([...document.querySelectorAll('a')].map(a=>a.href).filter(h=>/portfolio_page/.test(h)))]
  return {projectCount:links.length, links:links.slice(0,60),
    imgs:[...document.images].filter(i=>i.naturalWidth>200).length,
    maxW:Math.max(0,...[...document.images].map(i=>i.naturalWidth))}
})
console.log('\nPORTFOLIO INDEX: projects =',idx.projectCount,' imgs =',idx.imgs,' maxW =',idx.maxW)
await p.screenshot({path:`${OUT}/yrki-verkefni.png`})
// sample project pages for areas/years
let withArea=0, samples=[]
for(const u of idx.links.slice(0,14)){
  try{
    await p.goto(u,{waitUntil:'networkidle2',timeout:30000}); await sleep(1200)
    await p.mouse.move(700,400); for(let i=0;i<6;i++){await p.mouse.wheel({deltaY:500});await sleep(80)}
    const d=await p.evaluate(()=>{
      const t=document.body.innerText.replace(/\s+/g,' ')
      return {name:document.title.split('|')[0].trim().slice(0,34),
        areas:(t.match(/[\d.,]+\s?(?:m2|m²)/gi)||[]).slice(0,3),
        yrs:(t.match(/\b(19|20)\d{2}\b/g)||[]).slice(0,2),
        imgs:[...document.images].filter(i=>i.naturalWidth>400).length,
        maxW:Math.max(0,...[...document.images].map(i=>i.naturalWidth)),
        txt:t.length}
    })
    if(d.areas.length) withArea++
    samples.push(d)
  }catch{}
}
console.log('\nsampled',samples.length,'projects,',withArea,'publish an area')
samples.forEach(s=>console.log(`  ${s.name.padEnd(34)} areas:${JSON.stringify(s.areas).padEnd(16)} yrs:${JSON.stringify(s.yrs).padEnd(10)} img>400:${s.imgs} max:${s.maxW} txt:${s.txt}`))
await b.close()
