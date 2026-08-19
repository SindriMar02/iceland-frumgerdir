import puppeteer from 'puppeteer-core'
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms))
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--hide-scrollbars']})
for(const slug of ['yrki','glamakim','tark']){
  const p=await b.newPage()
  await p.setViewport({width:1280,height:900,deviceScaleFactor:2})
  await p.goto(`https://sindrimar02.github.io/iceland-frumgerdir/preview/${slug}`,{waitUntil:'networkidle2',timeout:60000})
  await sleep(4600)
  const out=`/Users/sindri/Downloads/frumgerd-${slug}.jpg`
  await p.screenshot({path:out,type:'jpeg',quality:92})
  const ok=await p.evaluate(()=>({
    preloaderGone:!document.querySelector('[class*="-pre"]'),
    heroLoaded:(()=>{const i=document.querySelector('section[class$="-hero"] img');return !!i&&i.naturalWidth>100})(),
  }))
  console.log(`${slug.padEnd(9)} -> ${out}  ${JSON.stringify(ok)}`)
  await p.close()
}
await b.close()
