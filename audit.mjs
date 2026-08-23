import puppeteer from 'puppeteer-core'
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox']})
const out={}
for(const [slug,root] of [['myndo','.my'],['elfa','.eg-root']]){
 const p=await b.newPage(); const errs=[]
 p.on('pageerror',e=>errs.push(e.message.slice(0,80)))
 p.on('console',m=>{if(m.type()==='error')errs.push('C:'+m.text().slice(0,80))})
 await p.setViewport({width:390,height:844,deviceScaleFactor:3,isMobile:true,hasTouch:true})
 await p.goto(`http://localhost:5399/preview/${slug}`,{waitUntil:'networkidle0',timeout:60000})
 await p.evaluate(()=>document.querySelectorAll('.my-spy,[data-rv]').forEach(e=>{e.classList.add('is-in');e.classList.add('eg-in')}))
 await new Promise(r=>setTimeout(r,900))
 out[slug]=await p.evaluate((root)=>{
  const de=document.documentElement, R=document.querySelector(root)
  const lum=c=>{const m=c.match(/[\d.]+/g);if(!m)return 1;const[r,g,bb]=m.slice(0,3).map(Number).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*r+.7152*g+.0722*bb}
  const bgOf=e=>{let n=e;while(n){const b=getComputedStyle(n).backgroundColor;if(b&&!/rgba\(0, 0, 0, 0\)/.test(b))return b;n=n.parentElement}return 'rgb(255,255,255)'}
  const bad=[],small=[],tiny=[]
  R.querySelectorAll('*').forEach(e=>{const s=getComputedStyle(e)
   if(s.display==='none'||s.visibility==='hidden')return
   if(!e.children.length&&e.textContent.trim()){
    const fs=parseFloat(s.fontSize),fw=+s.fontWeight||400
    const c=(Math.max(lum(s.color),lum(bgOf(e)))+.05)/(Math.min(lum(s.color),lum(bgOf(e)))+.05)
    const need=(fs>=24||(fs>=18.66&&fw>=700))?3:4.5
    if(c<need)bad.push(e.textContent.trim().slice(0,22)+' '+c.toFixed(2)+' @'+fs.toFixed(0))
    if(fs<12)tiny.push(e.textContent.trim().slice(0,18)+' @'+fs.toFixed(1))}})
  R.querySelectorAll('a,button').forEach(e=>{const r=e.getBoundingClientRect()
   if(r.width>0&&(r.height<44||r.width<44))small.push(((e.textContent||'').trim()||e.getAttribute('aria-label')||e.tagName).slice(0,20)+' '+Math.round(r.width)+'x'+Math.round(r.height))})
  const vp=document.querySelector('meta[name=viewport]')
  return{sw:de.scrollWidth,cw:de.clientWidth,overflow:de.scrollWidth>de.clientWidth+1,
   viewport:vp&&vp.content, pageH:document.body.scrollHeight,
   contrastFails:bad.length,contrast:bad.slice(0,5),
   tinyText:tiny.length,tiny:tiny.slice(0,4),
   smallTaps:small.length,taps:small.slice(0,6),
   imgsNoAlt:[...R.querySelectorAll('img:not([alt])')].length,
   imgsNoLazy:[...R.querySelectorAll('img:not([loading])')].length,
   h1s:R.querySelectorAll('h1').length}
 },root)
 out[slug].errs=errs.slice(0,4)
 await p.close()
}
console.log(JSON.stringify(out,null,1))
await b.close()
