import puppeteer from 'puppeteer-core'
const OUT='/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/178c1017-68f7-49a5-929d-87c47995abb6/scratchpad/'
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox']})
const p=await b.newPage()
await p.setViewport({width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true})
await p.goto('http://localhost:4571/preview/tryggvaskali/',{waitUntil:'networkidle0',timeout:90000})
await new Promise(r=>setTimeout(r,2400))
const state=()=>p.evaluate(()=>{const h=document.querySelector('.ts-header'),a=document.querySelector('a[href="#top"]')
 return {y:Math.round(window.scrollY),headerTop:Math.round(h.getBoundingClientRect().top),
  up:h.classList.contains('ts-header-up'),markVis:getComputedStyle(a.firstElementChild).visibility}})
// smooth-ish scroll down in steps, then back up in steps
const log=[]
for(const y of [0,600,1200,1800,2400]){await p.evaluate(v=>window.scrollTo(0,v),y);await new Promise(r=>setTimeout(r,700));log.push(await state())}
for(const y of [2100,1800,1500]){await p.evaluate(v=>window.scrollTo(0,v),y);await new Promise(r=>setTimeout(r,700));log.push(await state())}
console.log('SCROLL LOG',JSON.stringify(log))
// section audit: any element wider than viewport, and the gallery
const overflow=await p.evaluate(()=>{const out=[];document.querySelectorAll('main *').forEach(e=>{const r=e.getBoundingClientRect()
 if(r.width>window.innerWidth+1&&r.height>0)out.push({t:e.tagName,c:(e.className||'').toString().slice(0,60),w:Math.round(r.width)})});return out.slice(0,10)})
console.log('OVERFLOW',JSON.stringify(overflow))
// screenshot the gallery region
await p.evaluate(()=>window.scrollTo(0,1750)); await new Promise(r=>setTimeout(r,800))
await p.screenshot({path:OUT+'m-05-gallery.jpg',type:'jpeg',quality:80})
await p.evaluate(()=>window.scrollTo(0,900)); await new Promise(r=>setTimeout(r,800))
await p.screenshot({path:OUT+'m-06-mid.jpg',type:'jpeg',quality:80})
await b.close()
