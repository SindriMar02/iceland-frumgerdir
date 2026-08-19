import puppeteer from 'puppeteer-core'
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms))
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--hide-scrollbars']})
const p=await b.newPage(); await p.setViewport({width:1440,height:900})
await p.goto('https://rvkark.is/',{waitUntil:'networkidle2',timeout:60000}); await sleep(2500)
// read the table properly from DOM rows, not innerText
const table=await p.evaluate(()=>{
  const trs=[...document.querySelectorAll('tr')]
  return trs.map(tr=>[...tr.querySelectorAll('td,th')].map(td=>td.innerText.trim())).filter(r=>r.length>=6)
})
console.log('table rows:',table.length)
console.log('header:',JSON.stringify(table[0]))
const rowsByName={}
for(const r of table.slice(1)) rowsByName[r[1]]=r
// links per project
const links=await p.evaluate(()=>[...document.querySelectorAll('a[href*="/verk/"]')].map(a=>a.getAttribute('href')))
const uniq=[...new Set(links)]
console.log('project links:',uniq.length)
const out=[]
for(const href of uniq.slice(0,8)){
  const q=await b.newPage(); await q.setViewport({width:1440,height:900})
  try{ await q.goto(href.startsWith('http')?href:'https://rvkark.is'+href,{waitUntil:'domcontentloaded',timeout:40000}) }catch{ await q.close(); continue }
  await sleep(1400)
  const d=await q.evaluate(()=>{
    const t=document.body.innerText.replace(/\s+/g,' ')
    const g=(re)=>{const m=t.match(re);return m?m[1].trim():null}
    return {name:document.title.replace(' — Reykjavík Arkitektar',''),
      size:g(/Stærð\s+([^Á]+?)\s+Ár/), yr:g(/Ár\s+(\d{4})/), num:g(/Verk #\s*(\d+)/),
      client:g(/Verkkaupi\s+([^F]+?)(?:Fyrri|$)/)}
  })
  out.push(d); await q.close()
}
console.log('\n| project | # | page Stærð | page Ár | table Stærð(m2) | table Ár | client |')
console.log('|---|---|---|---|---|---|---|')
for(const d of out){
  const t=rowsByName[d.name]||[]
  console.log(`| ${d.name} | ${d.num} | ${d.size} | ${d.yr} | ${t[2]||'?'} | ${t[3]||'?'} | ${d.client||''} |`)
}
await b.close()
