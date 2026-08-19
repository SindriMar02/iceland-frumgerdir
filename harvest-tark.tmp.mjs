import puppeteer from 'puppeteer-core'
import { writeFileSync } from 'node:fs'
const SP='/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/d20d2de7-77d0-473d-a794-5c6ca8fe50cb/scratchpad'
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms))
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--hide-scrollbars']})
const p=await b.newPage(); await p.setViewport({width:1440,height:900})

// map site
await p.goto('https://www.tark.is/',{waitUntil:'networkidle2',timeout:60000}); await sleep(3500)
await p.mouse.move(700,400); for(let i=0;i<30;i++){await p.mouse.wheel({deltaY:800});await sleep(120)}
await sleep(2000)
const nav=await p.evaluate(()=>({
  links:[...new Set([...document.querySelectorAll('a')].map(a=>({h:a.href,t:(a.innerText||'').trim().slice(0,40)})).filter(l=>l.h.includes('tark.is')).map(l=>JSON.stringify(l)))].map(s=>JSON.parse(s)),
  text:document.body.innerText.replace(/[ \t]+/g,' ').slice(0,2500),
}))
console.log('nav links:',nav.links.length)
nav.links.slice(0,40).forEach(l=>console.log(' ',l.h.replace('https://www.tark.is',''),'::',l.t.replace(/\n/g,'|')))
writeFileSync(SP+'/tark-nav.json',JSON.stringify(nav,null,1))
await b.close()
