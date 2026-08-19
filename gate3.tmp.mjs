import puppeteer from 'puppeteer-core'
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms))
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--hide-scrollbars']})

async function probe(pfx,url){
  const p=await b.newPage(); await p.setViewport({width:1440,height:900})
  const errs=[]; p.on('pageerror',e=>errs.push(String(e).slice(0,110)))
  await p.goto(url,{waitUntil:'networkidle2',timeout:60000})
  const o={pfx,errs}
  o.preloader=await p.evaluate(x=>!!document.querySelector('.'+x+'-pre'),pfx)
  await sleep(3400)
  o.preloaderCleared=await p.evaluate(x=>!document.querySelector('.'+x+'-pre'),pfx)
  await p.mouse.move(720,450)
  const Y=()=>p.evaluate(()=>Math.round(window.scrollY))
  async function wheelTo(t){for(let i=0;i<400;i++){const y=await Y();const g=t-y;if(Math.abs(g)<14)break;await p.mouse.wheel({deltaY:Math.max(-520,Math.min(520,g))});await sleep(48)}await sleep(750)}
  const H=await p.evaluate(()=>document.body.scrollHeight); o.pageH=H
  const read=()=>p.evaluate((x)=>{
    const t=(e)=>getComputedStyle(e).transform
    const my=(m)=>{const v=m.match(/matrix\(([^)]*)\)/);return v?Number(v[1].split(',')[5]).toFixed(1):'none'}
    return {
      frameYs:[...document.querySelectorAll('.'+x+'-frame-in')].map(e=>my(t(e))).join('|'),
      textYs:[...document.querySelectorAll('['+'data-'+x+'-tdrift]')].slice(0,5).map(e=>my(t(e))).join('|'),
      chromeInk:document.querySelector('.'+x+'-chrome')?.classList.contains('is-ink'),
      marqueeX:(()=>{const e=document.querySelector('.'+x+'-skyline-track');return e?my(getComputedStyle(e).transform):'NA'})(),
    }},pfx)
  o.samples=[]
  for(const f of [0,.2,.45,.7,.95]){ await wheelTo(Math.round(H*f)); o.samples.push({f,...await read()}) }
  o.inv=await p.evaluate((x)=>{
    const vw=innerWidth
    const imgs=[...document.images].filter(i=>i.getBoundingClientRect().width>80)
    return {
      frames:document.querySelectorAll('.'+x+'-frame').length,
      masks:document.querySelectorAll('.'+x+'-m').length,
      rises:document.querySelectorAll('.'+x+'-r').length,
      rules:document.querySelectorAll('.'+x+'-rule').length,
      tdrifters:document.querySelectorAll('['+'data-'+x+'-tdrift]').length,
      ledRows:document.querySelectorAll('.'+x+'-led').length,
      specRows:document.querySelectorAll('.'+x+'-spec>div').length,
      listRows:document.querySelectorAll('.'+x+'-wrow').length,
      marqueeItems:document.querySelectorAll('.'+x+'-sky li').length,
      diagram:!!document.querySelector('.'+x+'-sta'),
      fields:document.querySelectorAll('.'+x+'-field').length,
      canvases:document.querySelectorAll('canvas').length,
      imgs:imgs.length, broken:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).length,
      stranded:[...document.querySelectorAll('.'+x+'-m,.'+x+'-r')].filter(e=>parseFloat(getComputedStyle(e).opacity)<0.9).length,
    }},pfx)
  await p.close(); return o
}
const ref=await probe('hk','https://sindrimar02.github.io/iceland-frumgerdir/preview/heklusyn')
const builds=[]
for(const [pfx,slug] of [['yrki','yrki'],['gk','glamakim'],['tark','tark']]){
  builds.push(await probe(pfx,`http://localhost:5412/preview/${slug}`))
}
await b.close()
const row=(l,...vals)=>console.log(`| ${l.padEnd(19)} |`+vals.map(v=>` ${String(v).slice(0,22).padEnd(22)} |`).join(''))
console.log(`\n| ${'device'.padEnd(19)} | ${'HEKLUSYN (ref)'.padEnd(22)} | ${'YRKI'.padEnd(22)} | ${'GLAMAKIM'.padEnd(22)} | ${'TARK'.padEnd(22)} |`)
console.log('|'+'-'.repeat(21)+('|'+'-'.repeat(24)).repeat(4)+'|')
const g=(o,fn)=>fn(o)
for(const [label,fn] of [
  ['preloader ok',(o)=>`${o.preloader}/${o.preloaderCleared}`],
  ['canvas',(o)=>o.inv.canvases],['frames',(o)=>o.inv.frames],['masks',(o)=>o.inv.masks],
  ['rises',(o)=>o.inv.rises],['rules',(o)=>o.inv.rules],['tdrifters',(o)=>o.inv.tdrifters],
  ['ledger rows',(o)=>o.inv.ledRows],['spec rows',(o)=>o.inv.specRows],
  ['work rows',(o)=>o.inv.listRows],['marquee items',(o)=>o.inv.marqueeItems],
  ['diagram',(o)=>o.inv.diagram??'n/a'],['form fields',(o)=>o.inv.fields],
  ['imgs/broken',(o)=>`${o.inv.imgs}/${o.inv.broken}`],['stranded',(o)=>o.inv.stranded],
  ['page errors',(o)=>o.errs.length],['pageH',(o)=>o.pageH],
]) row(label,g(ref,fn),...builds.map(x=>g(x,fn)))
console.log('\n-- motion at 5 depths (frame drift first values | chromeInk | marqueeX)')
for(const o of [ref,...builds]){
  console.log(o.pfx.padEnd(5),o.samples.map(s=>`${s.f}:[${String(s.frameYs).slice(0,14)}] ink:${s.chromeInk?1:0} mq:${s.marqueeX}`).join('  '))
}
