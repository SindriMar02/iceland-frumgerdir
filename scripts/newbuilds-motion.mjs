/* The two motion tables for the new builds, on the LIVE urls:
   LERP · SCROLL (drift + signature scrub) · REVEAL · HOVER. */
import puppeteer from 'puppeteer-core'
const B = 'https://sindrimar02.github.io/iceland-frumgerdir/preview'
const b = await puppeteer.launch({ executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless:'new', args:['--no-sandbox','--force-device-scale-factor=1'], protocolTimeout:300000 })

const run = async (slug, px, driftSel, scrubFn, hoverTargets) => {
  const p = await b.newPage()
  await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  await p.goto(`${B}/${slug}/`, { waitUntil:'domcontentloaded', timeout: 90000 })
  await p.evaluate(() => document.fonts.ready)
  await new Promise(r=>setTimeout(r,4000))
  await p.mouse.move(720, 450)
  console.log(`\n████ ${slug.toUpperCase()} — live`)

  /* LERP */
  const trace = await p.evaluate(() => new Promise((res) => {
    const s = []; let n = 0
    const step = () => { s.push(Math.round(scrollY*100)/100); if (++n < 70) requestAnimationFrame(step); else res(s) }
    requestAnimationFrame(step)
    dispatchEvent(new WheelEvent('wheel', { deltaY: 600, bubbles: true, cancelable: true }))
  }))
  const deltas = trace.slice(1).map((v,i)=>Math.round((v-trace[i])*100)/100).filter(d=>d!==0)
  console.log(`  LERP    distinct ${new Set(trace).size} · deltas ${deltas.slice(0,6).join(', ')} · decay ${Math.max(...deltas.map(Math.abs))}→${Math.abs(deltas[deltas.length-1])} · travel ${Math.round(trace[trace.length-1]-trace[0])}px`)

  /* SCROLL: drift on 3 sampled frames (continuous wheel, mid-lerp-safe) */
  const wheelTo = async (target) => { for (let i=0;i<90;i++){ const y=await p.evaluate(()=>scrollY); if (Math.abs(y-target)<14) break; await p.mouse.wheel({deltaY: Math.max(-650,Math.min(650,target-y))}); await new Promise(r=>setTimeout(r,25)) } await new Promise(r=>setTimeout(r,1100)) }
  const n = await p.evaluate((sel)=>document.querySelectorAll(sel).length, driftSel)
  const idxs = [0, Math.floor(n/2), n-1].filter((v,i,a)=>a.indexOf(v)===i && v>=0)
  const rows = []
  for (const i of idxs) {
    const home = await p.evaluate((sel,i)=>{ const el=document.querySelectorAll(sel)[i]; if(!el) return null
      const f=el.parentElement; const r=f.getBoundingClientRect(); return Math.round(scrollY+r.top+r.height/2-innerHeight/2) }, driftSel, i)
    if (home==null || home<0) continue
    const tys=[]
    for (const off of [-300,0,300]) {
      await wheelTo(Math.max(0,home+off))
      tys.push(await p.evaluate((sel,i)=>{ const el=document.querySelectorAll(sel)[i]
        const m=new DOMMatrixReadOnly(getComputedStyle(el).transform); return Math.round(m.m42*100)/100 }, driftSel, i))
    }
    const gap = await p.evaluate((sel,i)=>{ const el=document.querySelectorAll(sel)[i]; const f=el.parentElement
      const ir=el.getBoundingClientRect(), fr=f.getBoundingClientRect()
      return Math.round(Math.max(ir.top-fr.top, fr.bottom-ir.bottom)*10)/10 }, driftSel, i)
    rows.push({ i, range: Math.round((Math.max(...tys)-Math.min(...tys))*100)/100, gap })
  }
  console.log(`  DRIFT   ${n} frames on page (${driftSel})`)
  rows.forEach(r=>console.log(`          frame ${r.i}: Δ ${r.range}px across 3 depths · worst edge gap ${r.gap}px ${r.range>1&&r.gap<=0.5?'✓':'✗'}`))
  await scrubFn(p, wheelTo)

  /* REVEAL: slow full traverse then census */
  await wheelTo(0)
  for (let i=0;i<95;i++){ await p.mouse.wheel({ deltaY: 420 }); await new Promise(r=>setTimeout(r,60)) }
  await new Promise(r=>setTimeout(r,1600))
  const rev = await p.evaluate((px)=>{
    const hidden=(el)=>{let x=el;while(x){const cs=getComputedStyle(x);if(cs.display==='none'||cs.visibility==='hidden')return true;x=x.parentElement}return false}
    const all=[...document.querySelectorAll(`.${px}-rv, .${px}-clip`)]
    const cold=all.filter(e=>!e.classList.contains('is-in')&&!hidden(e)&&e.getBoundingClientRect().height>0)
    return { total: all.length, cold: cold.length, coldCls: cold.slice(0,3).map(e=>e.className.split(' ').slice(0,2).join('.')) }
  }, px)
  console.log(`  REVEAL  ${rev.total-rev.cold}/${rev.total} armed after full traverse ${rev.cold===0?'✓':'✗ cold: '+rev.coldCls.join(', ')}`)

  /* HOVER */
  for (const sel of hoverTargets) {
    const home = await p.evaluate((s)=>{ const e=document.querySelector(s); if(!e) return null
      const cs=getComputedStyle(e); if (cs.position==='fixed'||e.closest('header')) return 'fixed'
      const r=e.getClientRects()[0]||e.getBoundingClientRect(); return Math.round(scrollY+r.top+r.height/2-innerHeight/2) }, sel)
    if (home===null){ console.log(`  HOVER   ${sel} not found ✗`); continue }
    if (home!=='fixed') await wheelTo(Math.max(0,home))
    const box = await p.evaluate((s)=>{ const r=(document.querySelector(s).getClientRects()[0]||document.querySelector(s).getBoundingClientRect()); return { x:Math.round(r.x+r.width/2), y:Math.round(r.top+r.height/2) } }, sel)
    const snap = () => p.evaluate((s)=>{ const e=document.querySelector(s); const cs=getComputedStyle(e)
      return { h:e.matches(':hover'), f:cs.filter, b:cs.borderColor, c:cs.color, u:cs.textDecorationLine, o:cs.opacity } }, sel)
    await p.mouse.move(5,5); await new Promise(r=>setTimeout(r,350)); const rest = await snap()
    await p.mouse.move(box.x, box.y); await new Promise(r=>setTimeout(r,550)); const hov = await snap()
    const ch = Object.keys(rest).filter(k=>k!=='h'&&rest[k]!==hov[k])
    console.log(`  HOVER   ${sel.padEnd(16)} ${!hov.h?'? pointer missed':ch.length?'✓ '+ch.join('+'):'✗ inert'}`)
    await p.mouse.move(5,5)
  }
  await p.close()
}

await run('laxfoss', 'lx', '.lx-frame-in', async (p, wheelTo) => {
  const top = await p.evaluate(()=>{ const d=document.querySelector('.lx-drop'); return Math.round(scrollY+d.getBoundingClientRect().top) })
  await wheelTo(Math.max(0, top-400))
  const seq = []
  for (let i=0;i<44;i++){ await p.mouse.wheel({ deltaY: 320 }); await new Promise(r=>setTimeout(r,55))
    if (i%6===0) seq.push(await p.evaluate(()=>{
      const img=document.querySelector('.lx-drop-img'); const m=new DOMMatrixReadOnly(getComputedStyle(img).transform)
      const yp=Math.round(m.m42/(img.getBoundingClientRect().height||1)*1000)/10
      const ops=[...document.querySelectorAll('.lx-drop-station')].map(s=>Math.round(parseFloat(getComputedStyle(s).opacity)*10)/10)
      return `${yp}% [${ops.join('/')}]` })) }
  console.log(`  SCRUB   THE DROP img rise + stations: ${seq.join(' → ')}`)
}, ['.lx-cta', '.lx-nav-cta', '.lx-a'])

await run('glasscottages', 'gc', '.gc-frame-in', async (p, wheelTo) => {
  const top = await p.evaluate(()=>{ const d=document.querySelector('.gc-chooser'); return Math.round(scrollY+d.getBoundingClientRect().top) })
  await wheelTo(Math.max(0, top-400))
  const seq = []
  for (let i=0;i<40;i++){ await p.mouse.wheel({ deltaY: 320 }); await new Promise(r=>setTimeout(r,55))
    if (i%6===0) seq.push(await p.evaluate(()=>{
      const g=(s)=>getComputedStyle(document.querySelector(s)).clipPath.match(/([\d.]+)%\)?$/)?.[1] ?? getComputedStyle(document.querySelector(s)).clipPath.match(/inset\(([\d.]+)%/)?.[1] ?? '?'
      const bl=getComputedStyle(document.querySelector('.gc-choose-blar .gc-choose-media')).clipPath
      const gr=getComputedStyle(document.querySelector('.gc-choose-graenn .gc-choose-media')).clipPath
      const num=(cp,idx)=>{const m=cp.match(/inset\(([\d.]+)% [\d.]+% ([\d.]+)%/); return m? (idx===0?m[1]:m[2]) : '0'}
      return `B${Math.round(parseFloat(num(bl,1)||0))}/G${Math.round(parseFloat(num(gr,0)||0))}` })) }
  console.log(`  SCRUB   THE CHOOSER opposing insets (Blár-bottom% / Grænn-top%): ${seq.join(' → ')}`)
}, ['.gc-cta', '.gc-nav-cta', '.gc-a', '.gc-choose'])
await b.close()
