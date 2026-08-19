import puppeteer from 'puppeteer-core'
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms))
const SITES=['https://rvkark.is/','https://www.teikna.is/','https://www.arkitektastofan.is/','https://www.arkitekt.is/is',
 'https://www.ark.is/','https://www.askarkitektar.is/','https://hornsteinar.is/','https://www.utioginni.is/',
 'https://www.tark.is/','https://www.va.is/','https://www.yrki.is/','https://zeppelin.is/','https://www.glamakim.is/',
 'https://arkthing.is/','https://www.basalt.is/','https://www.kanon.is/','https://www.tro.is/','https://www.alark.is/']
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--hide-scrollbars','--ignore-certificate-errors']})
const rows=[]
for(const url of SITES){
  const p=await b.newPage(); await p.setViewport({width:1440,height:900})
  let ok=true, status=0
  try{ const r=await p.goto(url,{waitUntil:'domcontentloaded',timeout:35000}); status=r?r.status():0 }catch(e){ ok=false }
  if(!ok){ rows.push({url,err:'LOAD FAIL'}); await p.close(); continue }
  await sleep(2200)
  try{ await p.mouse.move(700,400); for(let i=0;i<10;i++){await p.mouse.wheel({deltaY:500}); await sleep(90)} }catch{}
  await sleep(1500)
  const d=await p.evaluate(()=>{
    const t=document.body.innerText
    const mails=[...new Set([...document.querySelectorAll('a[href^="mailto:"]')].map(a=>a.getAttribute('href').replace('mailto:','').split('?')[0].toLowerCase()))]
    const bodyMails=[...new Set((t.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi)||[]).map(x=>x.toLowerCase()))]
    const imgs=[...document.images].filter(i=>i.naturalWidth>60)
    const maxImg=Math.max(0,...imgs.map(i=>i.naturalWidth))
    return {
      title:document.title.slice(0,55),
      viewport:!!document.querySelector('meta[name=viewport]'),
      gen:(document.querySelector('meta[name=generator]')||{}).content||'',
      wp:/wp-content|wp-includes/.test(document.documentElement.innerHTML),
      sqspace:/squarespace/i.test(document.documentElement.innerHTML),
      wix:/wix\.com|_wixCssIdFor/i.test(document.documentElement.innerHTML),
      imgs:imgs.length, maxImgW:maxImg,
      hasM2:/\bm2\b|m²|fermetr/i.test(t),
      hasYear:/\b(19|20)\d{2}\b/.test(t),
      mails:[...new Set([...mails,...bodyMails])].slice(0,3),
      textLen:t.length,
      pageH:document.body.scrollHeight,
    }})
  rows.push({url,status,...d}); await p.close()
}
await b.close()
console.log('| site | wp/sq/wix | imgs | maxImgW | m² | yr | mail | textLen | pageH |')
console.log('|---|---|---|---|---|---|---|---|---|')
for(const r of rows){
  if(r.err){ console.log(`| ${r.url} | ${r.err} | | | | | | | |`); continue }
  const cms=r.wp?'WP':(r.sqspace?'SQSP':(r.wix?'WIX':'-'))
  console.log(`| ${r.url.replace('https://','').replace(/\/$/,'')} | ${cms} | ${r.imgs} | ${r.maxImgW} | ${r.hasM2?'Y':'n'} | ${r.hasYear?'Y':'n'} | ${(r.mails[0]||'NONE')} | ${r.textLen} | ${r.pageH} |`)
}
