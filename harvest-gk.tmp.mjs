import puppeteer from 'puppeteer-core'
import { writeFileSync } from 'node:fs'
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms))
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--hide-scrollbars']})
const p=await b.newPage(); await p.setViewport({width:1440,height:900})

// map the site first
await p.goto('https://www.glamakim.is/',{waitUntil:'networkidle2',timeout:45000}); await sleep(2200)
await p.mouse.move(700,400); for(let i=0;i<10;i++){await p.mouse.wheel({deltaY:600});await sleep(90)}
const nav=await p.evaluate(()=>({
  title:document.title,
  navLinks:[...new Set([...document.querySelectorAll('a')].map(a=>({h:a.href,t:(a.innerText||'').trim()})).filter(l=>l.t&&l.h.includes(location.hostname)).map(l=>JSON.stringify(l)))].map(s=>JSON.parse(s)).slice(0,50),
  text:document.body.innerText.replace(/[ \t]+/g,' ').slice(0,1200),
}))
console.log(JSON.stringify(nav.navLinks.slice(0,30),null,0))
console.log('HOME TEXT:',nav.text.slice(0,600))
writeFileSync('/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/d20d2de7-77d0-473d-a794-5c6ca8fe50cb/scratchpad/gk-nav.json',JSON.stringify(nav,null,1))
await b.close()
