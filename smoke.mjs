import puppeteer from 'puppeteer-core'
const slugs=['drangar','mirrorhouse','listak','chrislund','katrinisfeld','rakararnir','naustid','tannlaeknavaktin','thg','elfa','myndo','laxfoss']
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox']})
let bad=0
for(const s of slugs){
 const p=await b.newPage(); const errs=[]
 p.on('pageerror',e=>errs.push(e.message.slice(0,70)))
 p.on('console',m=>{if(m.type()==='error'&&!/favicon|404/i.test(m.text()))errs.push('C:'+m.text().slice(0,70))})
 await p.setViewport({width:1400,height:900})
 try{
  await p.goto(`http://localhost:5399/preview/${s}`,{waitUntil:'networkidle0',timeout:70000})
  await new Promise(r=>setTimeout(r,1400))
  const d=await p.evaluate(()=>({kids:document.getElementById('root')?.children.length||0,
    text:document.body.innerText.replace(/\s+/g,' ').trim().length,
    imgs:document.querySelectorAll('img').length,
    broken:[...document.querySelectorAll('img')].filter(i=>i.complete&&i.naturalWidth===0).length}))
  const ok=d.kids>0&&d.text>300&&errs.length===0
  if(!ok)bad++
  console.log((ok?'OK  ':'FAIL')+` ${s.padEnd(18)} text=${String(d.text).padEnd(6)} imgs=${d.imgs} broken=${d.broken} ${errs.slice(0,1).join('')}`)
 }catch(e){bad++;console.log('FAIL '+s+' '+String(e).slice(0,60))}
 await p.close()
}
console.log(bad===0?'ALL PAGES OK':`${bad} FAILED`)
await b.close()
