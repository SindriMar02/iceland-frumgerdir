/* Fast local gate on both new builds before deploy. */
import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless:'new', args:['--no-sandbox'], protocolTimeout:240000 })

const paint = (sel) => {
  const el = document.querySelector(sel)
  if (!el) return null
  const cs = getComputedStyle(el)
  const m = new DOMMatrixReadOnly(cs.transform)
  return { op: Math.round(parseFloat(cs.opacity)*100)/100, y: Math.round(m.m42*10)/10, x: Math.round(m.m41*10)/10,
           clip: (cs.clipPath||'none').slice(0,26), vis: cs.visibility }
}

for (const [slug, p1, wordSel, extraSel] of [
  ['laxfoss', 'lx', '.lx-wm-letter', '.lx-wm-brink'],
  ['glasscottages', 'gc', '.gc-wm-solid', '.gc-wm-ghost-b'],
]) {
  const url = `http://localhost:4571/preview/${slug}/`
  console.log(`\n████ ${slug.toUpperCase()}`)
  const p = await b.newPage()
  await p.setViewport({ width: 1440, height: 900 })
  const errors = []
  p.on('pageerror', (e) => errors.push(e.message.slice(0, 120)))
  p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 120)) })

  // 1 · loader (forced) counts and leaves
  await p.goto(url + '?loader', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await new Promise(r => setTimeout(r, 300))
  const l0 = await p.evaluate((px) => !!document.querySelector(`.${px}-loader`), p1)
  const lj = await p.evaluate((px) => new Promise((res) => {
    const seen = new Set(); let n = 0
    const iv = setInterval(() => {
      const l = document.querySelector(`.${px}-loader`)
      const t = document.querySelector(`.${px}-loader-pct`)?.textContent
      if (t) seen.add(t)
      if (!l || ++n > 80) { clearInterval(iv); res({ steps: seen.size, left: !l }) }
    }, 60)
  }), p1)
  console.log(`  loader     : mounts ${l0 ? '✓' : '✗'} · ${lj.steps} distinct % · unmounts ${lj.left ? '✓' : '✗'}`)

  // 2 · wordmark reveal (fresh, no loader)
  const before = await p.evaluate(paint, wordSel)
  await new Promise(r => setTimeout(r, 4200))
  const after = await p.evaluate(paint, wordSel)
  const extra = await p.evaluate(paint, extraSel)
  console.log(`  wordmark   : ${JSON.stringify(before)} → ${JSON.stringify(after)}`)
  console.log(`  second el  : ${JSON.stringify(extra)}`)

  // 3 · full sweep: reveals, zero-size, h-scroll, pin activity
  await p.mouse.move(720, 450)
  const H = await p.evaluate(() => document.body.scrollHeight)
  for (let i = 0; i < 60; i++) { await p.mouse.wheel({ deltaY: 800 }); await new Promise(r => setTimeout(r, 30)) }
  await new Promise(r => setTimeout(r, 1500))
  const sweep = await p.evaluate((px) => {
    const hiddenByDesign = (el) => { let n = el; while (n) { const cs = getComputedStyle(n); if (cs.display === 'none' || cs.visibility === 'hidden') return true; n = n.parentElement } return false }
    const frames = [...document.querySelectorAll(`figure[class*="frame"]`)]
    const zero = frames.filter(f => { const r = f.getBoundingClientRect(); return (r.width === 0 || r.height === 0) && !hiddenByDesign(f) })
    const rv = [...document.querySelectorAll(`.${px}-rv, .${px}-clip`)]
    const cold = rv.filter(e => !e.classList.contains('is-in') && !hiddenByDesign(e) && e.getBoundingClientRect().height > 0)
    const drifted = [...document.querySelectorAll(`.${px}-frame-in`)].filter(e => (e.style.transform || '').includes('translate3d')).length
    return { frames: frames.length, zero: zero.map(z => z.className.slice(0, 40)), rvTotal: rv.length, cold: cold.length,
      hscroll: document.documentElement.scrollWidth > window.innerWidth + 1,
      drifted, scrollY: Math.round(scrollY), bodyH: document.body.scrollHeight }
  }, p1)
  console.log(`  sweep      : ${sweep.frames} frames · zero-size ${sweep.zero.length ? '✗ ' + sweep.zero.join('|') : '✓ none'} · reveals cold ${sweep.cold}/${sweep.rvTotal} · drift active on ${sweep.drifted} · h-scroll ${sweep.hscroll ? '✗' : '✓ none'}`)
  console.log(`  travelled  : ${sweep.scrollY}px of ${sweep.bodyH}px`)
  if (errors.length) console.log(`  JS ERRORS  : ${[...new Set(errors)].slice(0,4).join(' | ')}`)
  else console.log('  JS errors  : none')
  await p.close()
}
await b.close()
