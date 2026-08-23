import puppeteer from 'puppeteer-core'
const B='https://sindrimar02.github.io/iceland-frumgerdir'
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox']})
for(const slug of ['preview/elfa','preview/myndo']){
 const p=await b.newPage(); const errs=[]
 p.on('pageerror',e=>errs.push(e.message.slice(0,70)))
 await p.setViewport({width:1440,height:900})
 const r=await p.goto(`${B}/${slug}`,{waitUntil:'networkidle0',timeout:70000})
 await new Promise(x=>setTimeout(x,1500))
 const d=await p.evaluate(()=>({title:document.title,
   rootKids:document.getElementById('root')?.children.length||0,
   h1:(document.querySelector('h1')?.innerText||'').slice(0,44),
   text:document.body.innerText.replace(/\s+/g,' ').trim().length,
   imgs:document.querySelectorAll('img').length,
   broken:[...document.querySelectorAll('img')].filter(i=>i.complete&&i.naturalWidth===0).length}))
 console.log(slug, r.status(), JSON.stringify({...d,errs}))
 await p.close()
}
await b.close()
