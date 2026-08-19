import puppeteer from 'puppeteer-core'
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms))
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--hide-scrollbars']})
const p=await b.newPage(); await p.setViewport({width:1440,height:900})
await p.goto('https://rvkark.is/',{waitUntil:'networkidle2',timeout:60000}); await sleep(2500)
const rows=await p.evaluate(()=>{
  const txt=document.body.innerText
  const i=txt.indexOf('Status')
  const tail=txt.slice(i+6)
  return tail.split('\n').map(s=>s.trim()).filter(Boolean)
})
// rebuild records of 7 fields
const recs=[]; for(let i=0;i+5<rows.length;i+=6){ recs.push({no:rows[i],name:rows[i+1],m2:rows[i+2],yr:rows[i+3],type:rows[i+4],place:rows[i+5],status:rows[i+6]}) }
console.log('projects parsed:',recs.length)
console.log('with m2:',recs.filter(r=>/^[\d,\.]+$/.test((r.m2||'').replace(/\s/g,''))).length)
console.log('with year:',recs.filter(r=>/^(19|20)\d\d$/.test(r.yr||'')).length)
const types=[...new Set(recs.map(r=>r.type))]
const statuses=[...new Set(recs.map(r=>r.status))]
console.log('types:',types.join(' | '))
console.log('statuses:',statuses.join(' | '))
console.log('first 12:'); recs.slice(0,12).forEach(r=>console.log('  ',[r.no,r.name,r.m2,r.yr,r.type,r.place,r.status].join(' · ')))
const nums=recs.map(r=>Number((r.m2||'').replace(/[^\d]/g,''))).filter(n=>n>0).sort((a,b)=>a-b)
console.log('m2 range:',nums[0],'->',nums[nums.length-1],' count:',nums.length)
// a project page
const q=await b.newPage(); await q.setViewport({width:1440,height:900})
await q.goto('https://rvkark.is/verk/tsk',{waitUntil:'networkidle2',timeout:60000}); await sleep(2000)
await q.mouse.move(700,400); for(let i=0;i<8;i++){await q.mouse.wheel({deltaY:500});await sleep(120)}
await sleep(1800)
console.log('\nPROJECT PAGE /verk/tsk:',JSON.stringify(await q.evaluate(()=>({
  title:document.title, text:document.body.innerText.replace(/\s+/g,' ').slice(0,700),
  realImgs:[...document.images].filter(i=>i.naturalWidth>200).length,
  maxW:Math.max(0,...[...document.images].map(i=>i.naturalWidth)),
})),null,1))
await b.close()
