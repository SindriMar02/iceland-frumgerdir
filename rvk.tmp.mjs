import puppeteer from 'puppeteer-core'
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms))
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--hide-scrollbars']})
for(const vp of [{n:'desktop',width:1440,height:900},{n:'phone',width:390,height:844,isMobile:true,hasTouch:true}]){
  const p=await b.newPage(); await p.setViewport({...vp,deviceScaleFactor:1})
  const failed=[]
  p.on('requestfailed',r=>failed.push(r.url().slice(-40)+' :: '+(r.failure()?.errorText||'')))
  await p.goto('https://rvkark.is/',{waitUntil:'networkidle2',timeout:60000})
  await sleep(2500)
  await p.mouse.move(700,400)
  const H=await p.evaluate(()=>document.body.scrollHeight)
  // real wheel events, like a person
  for(let i=0;i<Math.ceil(H/300);i++){ await p.mouse.wheel({deltaY:300}); await sleep(140) }
  await sleep(2500)
  const r=await p.evaluate(()=>{
    const im=[...document.images]
    const gallery=im.filter(i=>i.getAttribute('data-lazy-src'))
    return {
      totalImgs:im.length,
      galleryImgs:gallery.length,
      stillHidden:gallery.filter(i=>i.naturalWidth<=10).length,
      swappedIn:gallery.filter(i=>i.naturalWidth>10).length,
      pageH:document.body.scrollHeight,
    }})
  console.log(vp.n, JSON.stringify(r), 'reqFailed:', failed.length, failed.slice(0,3))
  await p.close()
}
// can the underlying files be fetched at all?
const p=await b.newPage()
const resp=await p.goto('https://rvkark.is/wp-content/uploads/2025/12/RDB_COVER.jpg',{timeout:45000}).catch(e=>({status:()=>'ERR '+e.message}))
console.log('direct image fetch status:', typeof resp.status==='function'?resp.status():resp)
await b.close()
