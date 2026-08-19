import puppeteer from 'puppeteer-core'
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms))
const SITES=['https://thgverk.is/','https://www.bygg.is/','https://www.eykt.is/','https://www.istak.is/',
 'https://javerk.is/','https://www.thingvangur.is/','https://www.serverk.is/','https://www.loftorka.is/',
 'https://www.iav.is/','https://www.husvirki.is/','https://www.vordur-verk.is/','https://www.mottak.is/',
 'https://www.arnarson.is/','https://www.sminn.is/','https://www.byggingafelag.is/','https://www.jbbyggingafelag.is/']
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--hide-scrollbars','--ignore-certificate-errors']})
for(const url of SITES){
  const p=await b.newPage(); await p.setViewport({width:1440,height:900})
  const host=url.replace('https://','').replace(/\/$/,'')
  try{ await p.goto(url,{waitUntil:'networkidle2',timeout:30000}) }catch(e){ console.log(`${host.padEnd(26)} LOAD FAIL`); await p.close(); continue }
  await sleep(1800); await p.mouse.move(700,400)
  for(let i=0;i<12;i++){ await p.mouse.wheel({deltaY:500}); await sleep(100) }
  await sleep(1500)
  const d=await p.evaluate(()=>{
    const t=document.body.innerText
    const imgs=[...document.images].filter(i=>i.naturalWidth>60)
    return {txt:t.length,h:document.body.scrollHeight,imgs:imgs.length,
      maxW:Math.max(0,...imgs.map(i=>i.naturalWidth)),
      m2:(t.match(/\b[\d.,]+\s?(m2|m²|fermetr)/gi)||[]).length,
      ibudir:(t.match(/\b[\d.,]+\s?íbúð/gi)||[]).length,
      yrs:(t.match(/\b(19|20)\d{2}\b/g)||[]).length,
      mails:[...new Set((t.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi)||[]).map(x=>x.toLowerCase()))].slice(0,2),
      wp:/wp-content/.test(document.documentElement.innerHTML),
      viewport:!!document.querySelector('meta[name=viewport]'),
      projLinks:[...document.querySelectorAll('a')].filter(a=>/verkefn|verk\/|projects?/i.test(a.getAttribute('href')||'')).length}
  })
  console.log(`${host.padEnd(26)} txt:${String(d.txt).padStart(5)} h:${String(d.h).padStart(5)} img:${String(d.imgs).padStart(3)} max:${String(d.maxW).padStart(5)} m²hits:${String(d.m2).padStart(3)} íbúð:${String(d.ibudir).padStart(3)} yrs:${String(d.yrs).padStart(3)} vp:${d.viewport?'Y':'N'} proj:${String(d.projLinks).padStart(3)} ${d.mails[0]||'NONE'}`)
  await p.close()
}
await b.close()
