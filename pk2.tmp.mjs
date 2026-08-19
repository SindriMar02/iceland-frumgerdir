import puppeteer from 'puppeteer-core'
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms))
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--hide-scrollbars']})
const p=await b.newPage(); await p.setViewport({width:1440,height:900})
// contact / info page
for(const u of ['https://pk.is/info','https://pk.is/office/page','https://pk.is/contact']){
  try{
    const r=await p.goto(u,{waitUntil:'networkidle2',timeout:30000}); await sleep(2000)
    await p.mouse.move(700,400); for(let i=0;i<8;i++){await p.mouse.wheel({deltaY:500});await sleep(90)}
    const d=await p.evaluate(()=>({t:document.body.innerText.replace(/\s+/g,' ').slice(0,900),
      mails:[...new Set((document.body.innerText.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi)||[]))]}))
    console.log(`\n--- ${u} [${r.status()}] ---\n`,d.t,'\nMAILS:',d.mails)
  }catch(e){ console.log(u,'FAIL') }
}
// site-wide image audit + SEO basics
await p.goto('https://pk.is/',{waitUntil:'networkidle2',timeout:40000}); await sleep(3000)
await p.mouse.move(700,400); for(let i=0;i<14;i++){await p.mouse.wheel({deltaY:500});await sleep(110)}
await sleep(2000)
console.log('\nSEO/A11Y AUDIT (home):',JSON.stringify(await p.evaluate(()=>({
  imgTags:document.images.length,
  h1:document.querySelectorAll('h1').length, h2:document.querySelectorAll('h2').length,
  title:document.title, titleLen:document.title.length,
  metaDesc:(document.querySelector('meta[name=description]')||{}).content||'MISSING',
  jsonLd:document.querySelectorAll('script[type="application/ld+json"]').length,
  og:document.querySelectorAll('meta[property^="og:"]').length,
  textLen:document.body.innerText.trim().length,
  bgImgs:[...document.querySelectorAll('*')].filter(e=>/url\(/.test(getComputedStyle(e).backgroundImage)).length,
})),null,1))
// count projects
await p.goto('https://pk.is/projects/all',{waitUntil:'networkidle2',timeout:40000}).catch(()=>{})
await sleep(2500); await p.mouse.move(700,400); for(let i=0;i<16;i++){await p.mouse.wheel({deltaY:600});await sleep(100)}
await sleep(1800)
console.log('PROJECTS INDEX:',JSON.stringify(await p.evaluate(()=>({
  url:location.href,
  projLinks:[...new Set([...document.querySelectorAll('a')].map(a=>a.getAttribute('href')||'').filter(h=>/\/projects\//.test(h)))].length,
  imgTags:document.images.length,
  bgImgs:[...document.querySelectorAll('*')].filter(e=>/url\(/.test(getComputedStyle(e).backgroundImage)).length,
}))))
await b.close()
