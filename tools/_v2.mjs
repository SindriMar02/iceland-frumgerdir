import puppeteer from 'puppeteer-core'
const URL='https://sindrimar02.github.io/iceland-frumgerdir/preview/nypugardar/'
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox'],protocolTimeout:600000})
const p=await b.newPage(); await p.setViewport({width:1440,height:900})
await p.goto(URL,{waitUntil:'networkidle2',timeout:120000})
const h=await p.evaluate(()=>document.documentElement.scrollHeight)
for(let y=0;y<h;y+=700){await p.evaluate(v=>window.scrollTo(0,v),y);await new Promise(r=>setTimeout(r,120))}
// force every image to finish decoding, then report
const res = await p.evaluate(async () => {
  const imgs=[...document.querySelectorAll('img')]
  const results = await Promise.all(imgs.map(async i => {
    try { await i.decode(); return null } catch (e) { return (i.currentSrc||i.src).split('/').pop() + ' :: ' + e.message }
  }))
  return { total: imgs.length, failed: results.filter(Boolean) }
})
console.log('decode() over all images — total:', res.total, '| failed:', res.failed.length)
res.failed.forEach(f=>console.log('   ', f))
const still = await p.evaluate(()=>[...document.querySelectorAll('img')].filter(i=>!(i.complete&&i.naturalWidth>0)).map(i=>(i.currentSrc||i.src).split('/').pop()))
console.log('naturalWidth===0 after decode:', still.length, still.join(', '))
await b.close()
