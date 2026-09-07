import puppeteer from 'puppeteer-core'
const OUT='/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/178c1017-68f7-49a5-929d-87c47995abb6/scratchpad/'
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox']})
const p=await b.newPage(); const errs=[]
p.on('console',m=>m.type()==='error'&&errs.push(m.text())); p.on('pageerror',e=>errs.push(String(e)))
await p.setViewport({width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true})
await p.goto('http://localhost:4571/preview/tryggvaskali/',{waitUntil:'networkidle0',timeout:90000})
await new Promise(r=>setTimeout(r,2600))
const geo=async()=>p.evaluate(()=>{
  const h=document.querySelector('.ts-header'), a=document.querySelector('a[href="#top"]')
  const burger=h.querySelector('button'), cta=h.querySelector('a')
  const R=e=>{const r=e.getBoundingClientRect();return {x:Math.round(r.left),r:Math.round(r.right),y:Math.round(r.top),b:Math.round(r.bottom),w:Math.round(r.width)}}
  return {scrollY:Math.round(window.scrollY), header:R(h), burger:R(burger), cta:R(cta), mark:R(a),
    markVis:getComputedStyle(a.firstElementChild).visibility, headerClasses:h.className,
    docWidth:document.documentElement.scrollWidth}})
const shots=[]
for(const [name,y] of [['00-top',0],['01-mid',400],['02-docked',700],['03-deep',2200]]){
  await p.evaluate(v=>window.scrollTo(0,v),y); await new Promise(r=>setTimeout(r,900))
  shots.push({name,...await geo()}); await p.screenshot({path:OUT+'m-'+name+'.jpg',type:'jpeg',quality:80})}
await p.evaluate(()=>window.scrollTo(0,0)); await new Promise(r=>setTimeout(r,700))
await p.evaluate(()=>document.querySelector('.ts-header button').click()); await new Promise(r=>setTimeout(r,1100))
await p.screenshot({path:OUT+'m-04-menu.jpg',type:'jpeg',quality:80})
const menu=await p.evaluate(()=>{const pl=document.querySelector('.ts-menu-panel');const r=pl.getBoundingClientRect()
 return {w:Math.round(r.width),vw:window.innerWidth,covers:Math.round(r.width/window.innerWidth*100)}})
console.log(JSON.stringify({shots,menu,errs},null,1))
await b.close()
