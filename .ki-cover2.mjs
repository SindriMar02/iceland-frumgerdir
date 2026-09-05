/* the wordmark's own contribution: shoot the frame, hide only the h1, shoot
   again, and count the pixels that changed */
import puppeteer from 'puppeteer-core'
import { PNG } from 'pngjs'
const br=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'})
for (const [w,h] of [[1600,1000],[390,844],[1990,1300]]) {
  const page=await br.newPage(); await page.setViewport({width:w,height:h})
  await page.evaluateOnNewDocument(()=>{try{sessionStorage.setItem('ki_intro_seen','1')}catch{}})
  await (await page.createCDPSession()).send('Emulation.setEmulatedMedia',{features:[{name:'hover',value:'none'},{name:'pointer',value:'coarse'}]})
  await page.goto('http://localhost:5398/preview/katrinisfeld',{waitUntil:'networkidle0'})
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto'})
  await new Promise(r=>setTimeout(r,1800))
  const rs=await page.evaluate(()=>{const e=document.querySelector('.parallax--sticky');const r=e.getBoundingClientRect()
    return {top:Math.round(r.top+window.scrollY), span:Math.round(r.height-e.querySelector('.parallax__header').clientHeight)}})
  const out=[]
  for (const p of [0,0.2,0.35,0.5,0.7,0.85,1]) {
    await page.evaluate(y=>{window.scrollTo(0,y);window.dispatchEvent(new Event('scroll'))}, rs.top+rs.span*p)
    await new Promise(r=>setTimeout(r,750))
    const a=PNG.sync.read(await page.screenshot())
    await page.evaluate(()=>{document.querySelector('.ki-plx-lockup').style.visibility='hidden'})
    await new Promise(r=>setTimeout(r,150))
    const b=PNG.sync.read(await page.screenshot())
    await page.evaluate(()=>{document.querySelector('.ki-plx-lockup').style.visibility=''})
    let diff=0, top=-1
    for(let y=0;y<a.height;y++)for(let x=0;x<a.width;x++){const i=(y*a.width+x)*4
      if(Math.abs(a.data[i]-b.data[i])>12||Math.abs(a.data[i+1]-b.data[i+1])>12){diff++; if(top<0)top=y}}
    out.push(`p=${p} ${diff===0?'hidden':diff+'px from y'+top}`)
  }
  console.log(`${w}x${h}\n   `+out.join('\n   '))
  await page.close()
}
await br.close()
