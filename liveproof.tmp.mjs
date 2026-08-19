import puppeteer from 'puppeteer-core'
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms))
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--hide-scrollbars']})
for(const [pfx,slug] of [['yrki','yrki'],['gk','glamakim'],['tark','tark']]){
  const p=await b.newPage(); await p.setViewport({width:1440,height:900})
  await p.goto(`https://sindrimar02.github.io/iceland-frumgerdir/preview/${slug}?loader`,{waitUntil:'domcontentloaded',timeout:60000})
  await sleep(600)
  console.log(slug,'LIVE preloader wordmark:',await p.evaluate((x)=>{const m=document.querySelector('.'+x+'-pre-mark');return m?m.textContent.trim():'(gone)'},pfx))
  await p.close()
}
await b.close()
