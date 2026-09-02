import puppeteer from 'puppeteer-core'
const SITES = [
  ['lagskogur', 'https://sindrimar02.github.io/lagskogur-preview/'],
  ['austurey',  'https://sindrimar02.github.io/austurey-preview/'],
  ['nollur',    'https://sindrimar02.github.io/iceland-frumgerdir/preview/nollur/'],
]
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', userDataDir: '/tmp/three-measure' })
const out = {}
for (const [slug, url] of SITES) {
  const p = await b.newPage()
  const errs = []
  p.on('pageerror', e => errs.push('page: ' + e.message))
  p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0,120)) })
  p.on('response', r => { if (r.status() >= 400) errs.push(`${r.status()} ${r.url().slice(-60)}`) })
  await p.setCacheEnabled(false)
  await p.setViewport({ width: 440, height: 956, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  await p.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1')
  await p.evaluateOnNewDocument(() => { for (const k of ['nl_seen','sl_seen','lg_seen','au_seen','seen']) sessionStorage.setItem(k,'1') })
  await p.goto(url, { waitUntil: 'domcontentloaded' })
  await new Promise(r => setTimeout(r, 4000))
  out[slug] = await p.evaluate(() => {
    const VW = window.innerWidth
    const res = { vw: VW, docOverflow: document.documentElement.scrollWidth - VW, height: document.body.scrollHeight }
    // 1. any element wider than the viewport (overflow:clip hides this from doc scrollWidth)
    const wide = []
    document.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect()
      if (r.width > VW + 2 && r.height > 8) {
        const cs = getComputedStyle(el)
        if (cs.position === 'fixed') return
        wide.push({ sel: el.tagName.toLowerCase() + '.' + (el.className?.toString().trim().split(/\s+/).slice(0,2).join('.') || ''), w: Math.round(r.width), x: Math.round(r.left) })
      }
    })
    // dedupe by selector, keep widest
    const byS = {}
    for (const w of wide) if (!byS[w.sel] || byS[w.sel].w < w.w) byS[w.sel] = w
    res.widerThanViewport = Object.values(byS).sort((a,b) => b.w - a.w).slice(0, 12)
    // 2. fixed / sticky top chrome: does it have a background?
    res.chrome = []
    document.querySelectorAll('*').forEach(el => {
      const cs = getComputedStyle(el)
      if (cs.position !== 'fixed' && cs.position !== 'sticky') return
      const r = el.getBoundingClientRect()
      if (r.top > 120 || r.height > 300 || r.width < VW * 0.5) return
      res.chrome.push({
        sel: el.tagName.toLowerCase() + '.' + (el.className?.toString().trim().split(/\s+/).slice(0,2).join('.') || ''),
        pos: cs.position, top: Math.round(r.top), h: Math.round(r.height),
        bg: cs.backgroundColor, blur: cs.backdropFilter,
        padTop: cs.paddingTop, z: cs.zIndex,
      })
    })
    // 3. horizontal scroll rails
    res.rails = []
    document.querySelectorAll('*').forEach(el => {
      if (el.scrollWidth > el.clientWidth + 20 && el.clientWidth > VW * 0.6) {
        const cs = getComputedStyle(el)
        res.rails.push({ sel: el.tagName.toLowerCase() + '.' + (el.className?.toString().trim().split(/\s+/).slice(0,2).join('.') || ''), scrollW: el.scrollWidth, clientW: el.clientWidth, ox: cs.overflowX })
      }
    })
    // 4. biggest type on the page
    const sizes = []
    document.querySelectorAll('h1,h2,h3,p,li,span,div').forEach(el => {
      if (!el.childNodes.length || ![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) return
      const fs = parseFloat(getComputedStyle(el).fontSize)
      if (fs >= 34) sizes.push({ fs: Math.round(fs), t: el.textContent.trim().slice(0, 42) })
    })
    res.bigType = sizes.sort((a,b) => b.fs - a.fs).slice(0, 6)
    // 5. viewport units in stylesheets
    let css = ''
    for (const s of document.styleSheets) { try { for (const r of s.cssRules) css += r.cssText } catch {} }
    res.units = { vh: (css.match(/\d+vh\b/g)||[]).length, svh: (css.match(/\d+svh\b/g)||[]).length, dvh: (css.match(/\d+dvh\b/g)||[]).length }
    res.htmlBg = getComputedStyle(document.documentElement).backgroundColor
    res.bodyBg = getComputedStyle(document.body).backgroundColor
    // 6. small tap targets among links/buttons
    res.smallTaps = []
    document.querySelectorAll('a,button,[role=button]').forEach(el => {
      const r = el.getBoundingClientRect()
      if (r.width < 2 || r.height < 2) return
      if (r.height < 40 || r.width < 40) res.smallTaps.push({ sel: (el.className?.toString().trim().split(/\s+/)[0] || el.tagName), w: Math.round(r.width), h: Math.round(r.height), t: el.textContent.trim().slice(0,20) })
    })
    res.smallTaps = res.smallTaps.slice(0, 10)
    return res
  })
  out[slug].errors = errs.slice(0, 8)
  await p.close()
}
console.log(JSON.stringify(out, null, 1))
await b.close()
