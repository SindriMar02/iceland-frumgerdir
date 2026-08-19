import puppeteer from 'puppeteer-core'
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms))
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--hide-scrollbars']})
const p=await b.newPage(); await p.setViewport({width:1440,height:900})
const walk=async(u,n=14)=>{await p.goto(u,{waitUntil:'networkidle2',timeout:50000});await sleep(2200);await p.mouse.move(700,400);for(let i=0;i<n;i++){await p.mouse.wheel({deltaY:700});await sleep(110)}await sleep(1400)}

// ── YRKI: any individual emails or per-person pages?
await walk('https://www.yrki.is/stofan/',20)
console.log('YRKI stofan:',JSON.stringify(await p.evaluate(()=>{
  const mails=[...new Set([...document.body.innerText.matchAll(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g)].map(m=>m[0]))]
  const mailtos=[...new Set([...document.querySelectorAll('a[href^="mailto:"]')].map(a=>a.getAttribute('href')))]
  const links=[...new Set([...document.querySelectorAll('a')].map(a=>a.getAttribute('href')||'').filter(h=>/starf|team|stofan\/|person/i.test(h)))]
  return {mailsInText:mails, mailtos, personLinks:links.slice(0,10)}
}),null,1))
// hafa samband page
await walk('https://www.yrki.is/hafa-samband/',10)
console.log('YRKI hafa-samband:',JSON.stringify(await p.evaluate(()=>{
  const t=document.body.innerText.replace(/[ \t]+/g,' ')
  return {mails:[...new Set([...t.matchAll(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}|[a-zA-Z0-9._%+-]+\[at\][a-zA-Z0-9.-]+\.[a-z]{2,}/g)].map(m=>m[0]))],
    snippet:t.slice(0,420)}
}),null,1))
// ── TARK: confirm framkvæmdastjóri
await walk('https://www.tark.is/',30)
console.log('TARK CEO:',JSON.stringify(await p.evaluate(()=>{
  const t=document.body.innerText.replace(/[ \t]+/g,' ')
  const i=t.indexOf('framkvæmdastjóri')
  return {around:i>0?t.slice(Math.max(0,i-320),i+90).replace(/\n+/g,' | '):'not found'}
}),null,1))
await b.close()
