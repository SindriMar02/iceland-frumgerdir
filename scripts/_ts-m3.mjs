import puppeteer from 'puppeteer-core'
const OUT='/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/178c1017-68f7-49a5-929d-87c47995abb6/scratchpad/'
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox']})
const p=await b.newPage(); const errs=[]
p.on('pageerror',e=>errs.push(String(e)))
await p.setViewport({width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true})
await p.goto('http://localhost:4571/preview/tryggvaskali/',{waitUntil:'networkidle0',timeout:90000})
await new Promise(r=>setTimeout(r,2500))
await p.screenshot({path:OUT+'f-00-top.jpg',type:'jpeg',quality:80})
await p.evaluate(()=>window.scrollTo(0,2200)); await new Promise(r=>setTimeout(r,900))
await p.screenshot({path:OUT+'f-01-deep.jpg',type:'jpeg',quality:80})
// menu open/close from a scrolled position must not lose the position
const before=await p.evaluate(()=>Math.round(window.scrollY))
await p.evaluate(()=>document.querySelector('.ts-header button').click()); await new Promise(r=>setTimeout(r,1000))
await p.screenshot({path:OUT+'f-02-menu.jpg',type:'jpeg',quality:80})
const locked=await p.evaluate(()=>getComputedStyle(document.body).position)
await p.evaluate(()=>document.querySelector('.ts-menu-panel button').click()); await new Promise(r=>setTimeout(r,900))
const after=await p.evaluate(()=>Math.round(window.scrollY))
// lenis must be absent on touch
const lenis=await p.evaluate(()=>!!document.documentElement.className.match(/lenis/))
const zoom=await p.evaluate(()=>{const e=document.querySelector('.ts-zoom__text');return e?Math.round(e.getBoundingClientRect().width):null})
console.log(JSON.stringify({scrollBefore:before,bodyPositionWhileOpen:locked,scrollAfter:after,lenisClass:lenis,zoomTextWidth:zoom,viewport:390,errs}))
await b.close()
