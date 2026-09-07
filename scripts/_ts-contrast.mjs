import puppeteer from 'puppeteer-core'
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox']})
const p=await b.newPage()
await p.setViewport({width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true})
await p.goto('http://localhost:4571/preview/tryggvaskali/',{waitUntil:'networkidle0',timeout:90000})
await new Promise(r=>setTimeout(r,2500))
const clip=await p.evaluate(()=>{const r=document.querySelector('a[href="#top"]').getBoundingClientRect()
 return {x:Math.round(r.left),y:Math.round(r.top),width:Math.round(r.width),height:Math.round(r.height)}})
// hide the wordmark, photograph what is BEHIND it, then measure
await p.evaluate(()=>{document.querySelector('a[href="#top"]').style.visibility='hidden'})
await new Promise(r=>setTimeout(r,300))
const shot=await p.screenshot({encoding:'base64',clip})
const res=await p.evaluate(async(b64)=>{
 const img=new Image(); img.src='data:image/png;base64,'+b64; await img.decode()
 const c=document.createElement('canvas'); c.width=img.width; c.height=img.height
 const x=c.getContext('2d'); x.drawImage(img,0,0)
 const d=x.getImageData(0,0,c.width,c.height).data
 const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)}
 const L=(r,g,bb)=>.2126*f(r)+.7152*f(g)+.0722*f(bb)
 const inkL=L(250,248,243)
 const ls=[]; for(let i=0;i<d.length;i+=4) ls.push(L(d[i],d[i+1],d[i+2]))
 ls.sort((a,b)=>a-b)
 const q=t=>ls[Math.floor((ls.length-1)*t)]
 const ratio=l=>{const a=Math.max(inkL,l)+.05,b2=Math.min(inkL,l)+.05;return +(a/b2).toFixed(2)}
 return {worstPixel:ratio(ls[ls.length-1]), p95:ratio(q(.95)), median:ratio(q(.5)), best:ratio(ls[0])}
},shot)
console.log(JSON.stringify(res))
await b.close()
