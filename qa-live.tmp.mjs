import puppeteer from 'puppeteer-core'
const S='/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/0c8b390d-7d33-494a-8c90-b2993b4bb4b6/scratchpad'
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'})
const page=await b.newPage(); await page.setViewport({width:1440,height:900})
const errs=[],failed=[]
page.on('pageerror',e=>errs.push('JS: '+e.message))
page.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text().slice(0,160))})
page.on('requestfailed',r=>failed.push(r.url().slice(-70)+' '+r.failure()?.errorText))
page.on('response',r=>{if(r.status()>=400)failed.push(r.status()+' '+r.url().slice(-70))})
await page.goto('https://sindrimar02.github.io/iceland-frumgerdir/preview/bilageirinn/',{waitUntil:'networkidle2',timeout:45000})
await new Promise(r=>setTimeout(r,6000))
const state=await page.evaluate(()=>({
  title:document.title,
  h1:document.querySelector('h1')?.textContent?.trim().slice(0,50)||null,
  sections:document.querySelectorAll('main > section').length,
  bodyText:document.body.innerText.trim().length,
  loaderVisible:(()=>{const l=document.querySelector('[aria-hidden="true"][style*="z-index: 100"]');return l?getComputedStyle(l).opacity:'no-loader'})(),
}))
await page.screenshot({path:`${S}/live-check.png`})
console.log(JSON.stringify({state,errors:errs.slice(0,6),failed:failed.slice(0,6)},null,1))
await b.close()
