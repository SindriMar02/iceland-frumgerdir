import puppeteer from 'puppeteer-core'
const OUT='/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/d20d2de7-77d0-473d-a794-5c6ca8fe50cb/scratchpad'
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms))
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--hide-scrollbars']})
const p=await b.newPage(); await p.setViewport({width:1440,height:900,deviceScaleFactor:2})
await p.goto('https://pk.is/',{waitUntil:'networkidle2',timeout:45000}); await sleep(3500)
await p.mouse.move(700,400); for(let i=0;i<14;i++){await p.mouse.wheel({deltaY:500});await sleep(120)}
await sleep(2500)
console.log('PK HOME:',JSON.stringify(await p.evaluate(()=>({
  title:document.title, txtLen:document.body.innerText.length,
  txt:document.body.innerText.replace(/\s+/g,' ').slice(0,220),
  imgTags:document.images.length,
  imgsLoaded:[...document.images].filter(i=>i.naturalWidth>100).length,
  bgImages:[...document.querySelectorAll('*')].filter(e=>/url\(/.test(getComputedStyle(e).backgroundImage)).length,
  pageH:document.body.scrollHeight, videos:document.querySelectorAll('video').length,
}))))
await p.screenshot({path:`${OUT}/pk-home.png`})
// a project page
await p.goto('https://pk.is/projects/hafnartorg',{waitUntil:'networkidle2',timeout:40000}); await sleep(2500)
await p.mouse.move(700,400); for(let i=0;i<10;i++){await p.mouse.wheel({deltaY:500});await sleep(110)}
await sleep(2000)
console.log('PK PROJECT:',JSON.stringify(await p.evaluate(()=>({
  txt:document.body.innerText.replace(/\s+/g,' ').slice(0,420),
  imgsLoaded:[...document.images].filter(i=>i.naturalWidth>300).length,
  maxW:Math.max(0,...[...document.images].map(i=>i.naturalWidth)),
  bgImages:[...document.querySelectorAll('*')].filter(e=>/url\(/.test(getComputedStyle(e).backgroundImage)).length,
}))))
await p.screenshot({path:`${OUT}/pk-project.png`})
await b.close()
