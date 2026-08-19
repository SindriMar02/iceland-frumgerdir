import puppeteer from 'puppeteer-core'
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms))
const TARGETS=[
  ['yrki.is','https://www.yrki.is/','verk'],
  ['ark.is (ARKÍS)','https://www.ark.is/','verkefni'],
  ['pk.is','https://pk.is/','project'],
  ['hornsteinar.is','https://hornsteinar.is/','verk'],
  ['glamakim.is','https://www.glamakim.is/','verk'],
  ['bygg.is','https://www.bygg.is/','verk'],
]
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--hide-scrollbars','--ignore-certificate-errors']})
for(const [name,url,kw] of TARGETS){
  const p=await b.newPage(); await p.setViewport({width:1440,height:900})
  try{ await p.goto(url,{waitUntil:'networkidle2',timeout:35000}) }catch{ console.log(name,'LOAD FAIL'); await p.close(); continue }
  await sleep(1800); await p.mouse.move(700,400)
  for(let i=0;i<12;i++){await p.mouse.wheel({deltaY:500});await sleep(90)}
  await sleep(1200)
  // collect candidate project URLs
  let urls=await p.evaluate((kw)=>{
    const a=[...document.querySelectorAll('a')].map(x=>x.href).filter(h=>h&&h.includes(location.hostname))
    return [...new Set(a.filter(h=>new RegExp(kw,'i').test(h)))].slice(0,30)
  },kw)
  // if index page found, go one level deeper
  if(urls.length){
    try{
      await p.goto(urls[0],{waitUntil:'networkidle2',timeout:30000}); await sleep(1500)
      await p.mouse.move(700,400); for(let i=0;i<10;i++){await p.mouse.wheel({deltaY:500});await sleep(90)}
      const deeper=await p.evaluate((kw)=>{
        const a=[...document.querySelectorAll('a')].map(x=>x.href).filter(h=>h&&h.includes(location.hostname))
        return [...new Set(a.filter(h=>new RegExp(kw,'i').test(h)))].slice(0,30)
      },kw)
      if(deeper.length>urls.length) urls=deeper
    }catch{}
  }
  let found=[]
  for(const u of urls.slice(1,5)){
    try{
      await p.goto(u,{waitUntil:'networkidle2',timeout:30000}); await sleep(1400)
      await p.mouse.move(700,400); for(let i=0;i<8;i++){await p.mouse.wheel({deltaY:500});await sleep(90)}
      const d=await p.evaluate(()=>{
        const t=document.body.innerText.replace(/\s+/g,' ')
        return {url:location.pathname.slice(0,40),
          areas:(t.match(/[\d.,]+\s?(?:m2|m²|fermetr\w*)/gi)||[]).slice(0,4),
          yrs:(t.match(/\b(19|20)\d{2}\b/g)||[]).slice(0,3),
          imgs:[...document.images].filter(i=>i.naturalWidth>300).length,
          maxW:Math.max(0,...[...document.images].map(i=>i.naturalWidth)),
          txt:t.length}
      })
      found.push(d)
    }catch{}
  }
  console.log(`\n=== ${name} (${urls.length} project urls) ===`)
  found.forEach(f=>console.log(`  ${f.url.padEnd(40)} areas:${JSON.stringify(f.areas)} yrs:${JSON.stringify(f.yrs)} img>300:${f.imgs} max:${f.maxW} txt:${f.txt}`))
  await p.close()
}
await b.close()
