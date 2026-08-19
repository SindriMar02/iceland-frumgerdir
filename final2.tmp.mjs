import puppeteer from 'puppeteer-core'
const OUT='/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/d20d2de7-77d0-473d-a794-5c6ca8fe50cb/scratchpad'
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms))
const U='https://sindrimar02.github.io/iceland-frumgerdir/preview/thg'
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--hide-scrollbars']})
const p=await b.newPage(); await p.setViewport({width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true})
await p.goto(U,{waitUntil:'networkidle2',timeout:60000}); await sleep(4200)
const H=await p.evaluate(()=>document.body.scrollHeight)
for(let y=0;y<H;y+=500){await p.evaluate(yy=>window.scrollTo(0,yy),y);await sleep(100)}
console.log('LIVE MOBILE',JSON.stringify(await p.evaluate(()=>{
  const sk=document.querySelector('.thg-skyline'), reg=document.getElementById('thg-register')
  const svg=document.querySelector('.thg-sta svg')
  const worst=Math.max(...[...svg.querySelectorAll('text')].map(t=>t.getBoundingClientRect().right-innerWidth))
  return {skylineH:Math.round(sk.getBoundingClientRect().height), skyFont:getComputedStyle(sk).fontSize,
          gap:Math.round(sk.getBoundingClientRect().top-reg.getBoundingClientRect().bottom),
          worstLabelOverflowPx:Math.round(worst), noHscroll:document.documentElement.scrollWidth<=innerWidth+1}})))
const t=await p.evaluate(()=>Math.round(document.getElementById('thg-register').getBoundingClientRect().top+scrollY))
await p.evaluate(y=>window.scrollTo(0,y),t-60); await sleep(1300)
await p.screenshot({path:`${OUT}/live-register-fixed.png`})
await b.close()
