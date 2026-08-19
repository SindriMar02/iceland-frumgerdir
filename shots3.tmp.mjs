import puppeteer from 'puppeteer-core'
const OUT='/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/d20d2de7-77d0-473d-a794-5c6ca8fe50cb/scratchpad'
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms))
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--hide-scrollbars']})

for(const [pfx,slug] of [['yrki','yrki'],['gk','glamakim'],['tark','tark']]){
  // desktop shots
  const p=await b.newPage(); await p.setViewport({width:1440,height:900,deviceScaleFactor:2})
  await p.goto(`http://localhost:5412/preview/${slug}`,{waitUntil:'networkidle2',timeout:60000}); await sleep(3800)
  await p.mouse.move(720,450)
  const Y=()=>p.evaluate(()=>Math.round(window.scrollY))
  async function to(t){for(let i=0;i<400;i++){const y=await Y();const g=t-y;if(Math.abs(g)<14)break;await p.mouse.wheel({deltaY:Math.max(-520,Math.min(520,g))});await sleep(48)}await sleep(850)}
  const top=(id)=>p.evaluate(i=>Math.round(document.getElementById(i).getBoundingClientRect().top+scrollY),id)
  await p.screenshot({path:`${OUT}/3-${slug}-hero.png`})
  await to(await top(`${pfx}-thesis`)+80); await p.screenshot({path:`${OUT}/3-${slug}-thesis.png`})
  const diagId=slug==='glamakim'?`${pfx}-spans`:`${pfx}-scale`
  await to(await top(diagId)+300); await p.screenshot({path:`${OUT}/3-${slug}-diagram.png`})
  await to(await top(`${pfx}-works`)+150)
  await p.mouse.move(400,620); await sleep(500); await p.mouse.move(430,650); await sleep(900)
  await p.screenshot({path:`${OUT}/3-${slug}-works.png`})
  // marquee: prove tx moves under wheel
  const reg=await top(`${pfx}-register`)
  await to(reg+300)
  const tx=()=>p.evaluate((x)=>{const e=document.querySelector('.'+x+'-skyline-track');const m=getComputedStyle(e).transform.match(/matrix\(([^)]*)\)/);return m?Number(m[1].split(',')[4]).toFixed(1):null},pfx)
  const t1=await tx(); await p.mouse.wheel({deltaY:400}); await sleep(600); const t2=await tx()
  console.log(slug,'marquee tx moved:',t1,'->',t2,Math.abs(t2-t1)>1?'OK':'STATIC?')
  await p.screenshot({path:`${OUT}/3-${slug}-register.png`})
  const H=await p.evaluate(()=>document.body.scrollHeight)
  await to(H-1000); await p.screenshot({path:`${OUT}/3-${slug}-enquiry.png`})
  await p.close()

  // phone: blank-band sweep + shots
  const m=await b.newPage(); await m.setViewport({width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true})
  await m.goto(`http://localhost:5412/preview/${slug}`,{waitUntil:'networkidle2',timeout:60000}); await sleep(4000)
  const MH=await m.evaluate(()=>document.body.scrollHeight)
  for(let y=0;y<MH;y+=500){await m.evaluate(yy=>window.scrollTo(0,yy),y);await sleep(90)}
  await m.evaluate(()=>window.scrollTo(0,0)); await sleep(700)
  const secs=await m.evaluate(()=>{
    return [...document.querySelectorAll('main > *')].map((el)=>{
      const r=el.getBoundingClientRect()
      const imgs=[...el.querySelectorAll('img')]
      const imgArea=imgs.reduce((a,im)=>{const q=im.getBoundingClientRect();return a+q.width*q.height},0)
      const txt=(el.innerText||'').replace(/\s+/g,' ').trim()
      return {id:el.id||el.tagName, h:Math.round(r.height), txt:txt.length, imgs:imgs.length,
        ratio:+(imgArea/(390*Math.max(r.height,1))).toFixed(2), dens:+(txt.length/Math.max(r.height,1)).toFixed(3)}
    })
  })
  const suspects=secs.filter(s=>(s.h>250&&s.dens<0.03&&s.ratio<0.06))
  console.log(slug,'phone sections:',secs.length,'suspects:',JSON.stringify(suspects))
  console.log('  noHscroll:',await m.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1))
  const mtop=await m.evaluate((id)=>Math.round(document.getElementById(id).getBoundingClientRect().top+scrollY),diagId)
  await m.evaluate(y=>window.scrollTo(0,y),mtop+250); await sleep(1200)
  await m.screenshot({path:`${OUT}/3-${slug}-phone-diagram.png`})
  const wtop=await m.evaluate((x)=>Math.round(document.getElementById(x+'-works').getBoundingClientRect().top+scrollY),pfx)
  await m.evaluate(y=>window.scrollTo(0,y),wtop+300); await sleep(1200)
  await m.screenshot({path:`${OUT}/3-${slug}-phone-works.png`})
  await m.close()
}
await b.close()
