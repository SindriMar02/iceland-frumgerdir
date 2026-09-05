/* at the end of the descent, is any of the wordmark still painted? */
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
  for (const p of [0,0.35,0.6,0.8,1]) {
    await page.evaluate(y=>{window.scrollTo(0,y);window.dispatchEvent(new Event('scroll'))}, rs.top+rs.span*p)
    await new Promise(r=>setTimeout(r,800))
    const box=await page.evaluate(()=>{const r=document.querySelector('.ki-plx-name').getBoundingClientRect()
      return {x0:Math.max(0,Math.round(r.left)),y0:Math.max(0,Math.round(r.top)),x1:Math.round(r.right),y1:Math.round(r.bottom)}})
    if (box.y1<=0 || box.y0>=h) { out.push(`p=${p} offscreen`); continue }
    const png=PNG.sync.read(await page.screenshot())
    let bright=0,n=0
    for(let y=box.y0;y<Math.min(png.height,box.y1);y++)for(let x=box.x0;x<Math.min(png.width,box.x1);x++){
      const i=(y*png.width+x)*4;const L=png.data[i]*.2126+png.data[i+1]*.7152+png.data[i+2]*.0722
      n++; if(L>150) bright++ }
    out.push(`p=${p} type pixels ${(bright/n*100).toFixed(1)}%`)
  }
  console.log(`${w}x${h}  `+out.join('  ·  '))
  await page.close()
}
await br.close()
