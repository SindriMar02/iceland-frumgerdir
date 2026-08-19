import puppeteer from 'puppeteer-core'
const OUT='/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/d20d2de7-77d0-473d-a794-5c6ca8fe50cb/scratchpad'
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms))
const URL_='https://sindrimar02.github.io/iceland-frumgerdir/preview/thg'
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--hide-scrollbars']})

// phone
const m=await b.newPage()
await m.setViewport({width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true})
await m.goto(URL_,{waitUntil:'networkidle2',timeout:60000}); await sleep(4200)
const r=await m.evaluate(()=>{
  const row=document.querySelector('.thg-wrow'), th=document.querySelector('.thg-wthumb')
  const intro=[...document.querySelectorAll('#thg-works p')].map(p=>p.innerText.trim()).join(' ')
  return {
    gridCols:getComputedStyle(row).gridTemplateColumns,
    thumbW:Math.round(th.getBoundingClientRect().width),
    rowW:Math.round(row.getBoundingClientRect().width),
    thumbsFullWidth:[...document.querySelectorAll('.thg-wthumb')].every(t=>Math.abs(t.getBoundingClientRect().width-row.getBoundingClientRect().width)<2),
    rows:document.querySelectorAll('.thg-wrow').length,
    introHasEmDash:/[—–]/.test(intro),
    intro:intro.slice(0,90),
    emDashesWholePage:(document.body.innerText.match(/[—–]/g)||[]).length,
    noHscroll:document.documentElement.scrollWidth<=innerWidth+1,
  }})
console.log('PHONE:',JSON.stringify(r,null,1))
const top=await m.evaluate(()=>Math.round(document.getElementById('thg-works').getBoundingClientRect().top+scrollY))
await m.evaluate(y=>window.scrollTo(0,y),top-30); await sleep(1400)
await m.screenshot({path:`${OUT}/final-phone-works.png`})

// desktop unchanged
const d=await b.newPage(); await d.setViewport({width:1440,height:900,deviceScaleFactor:2})
await d.goto(URL_,{waitUntil:'networkidle2',timeout:60000}); await sleep(4000)
console.log('DESKTOP grid:',await d.evaluate(()=>getComputedStyle(document.querySelector('.thg-wrow')).gridTemplateColumns))
await b.close()
