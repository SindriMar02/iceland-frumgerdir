/* Geometry probe for the two gates.
   Reads the plates' real bounding rects out of a real Chrome at set scroll
   positions, at two viewports, and shoots frames. Nothing here is inferred
   from the CSS — every number is what the engine actually laid out. */
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, extname } from 'node:path'
import { createServer } from 'node:http'
import puppeteer from 'puppeteer-core'

const ROOT = 'dist-katrin'
const MIME = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.webp':'image/webp',
  '.avif':'image/avif', '.jpg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml',
  '.woff2':'font/woff2', '.json':'application/json', '.txt':'text/plain', '.xml':'application/xml' }
const srv = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0])
  let f = join(ROOT, p)
  if (!existsSync(f) || p.endsWith('/')) f = join(ROOT, 'index.html')
  try { const b = readFileSync(f)
    res.writeHead(200, { 'content-type': MIME[extname(f)] || 'application/octet-stream' }); res.end(b) }
  catch { res.writeHead(404); res.end('x') }
}).listen(0)
const port = srv.address().port
const OUT = process.env.OUT || '/tmp/ki-gate'
mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })

const VIEWS = [ { n: 'desktop', w: 1280, h: 800 }, { n: 'phone', w: 390, h: 844 } ]
const report = []

for (const v of VIEWS) {
  const page = await browser.newPage()
  await page.setViewport({ width: v.w, height: v.h, deviceScaleFactor: 1,
    hasTouch: v.n === 'phone', isMobile: v.n === 'phone' })
  /* Lenis OFF for the geometry pass. It is gated to a fine pointer, and with
     it running every scrollTo/scrollBy this probe issues is lerped back
     toward Lenis's own target on the next frame, so the readings were of
     wherever Lenis happened to be rather than of the progress asked for. The
     scroll DRIVER cannot change where a layer lands at a given progress; it
     is checked on its own below. */
  await (await page.createCDPSession()).send('Emulation.setEmulatedMedia',
    { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] })
  await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle0' })
  await page.evaluate(() => { document.documentElement.dataset.kiSeen = '1'
    document.querySelector('.ki-curtain')?.remove()
    /* the shell sets html{scroll-behavior:smooth}, so every scrollBy this
       probe issues ANIMATES — every reading was taken mid-flight, which is
       why progress appeared to cap out around 0.2 whatever was asked for */
    document.documentElement.style.scrollBehavior = 'auto' })
  await new Promise(r => setTimeout(r, 900))

  // the two pinned wrappers, in document order
  const gates = await page.evaluate(() => [...document.querySelectorAll('.parallax--sticky')].map((g, i) => {
    const r = g.getBoundingClientRect()
    return { i, top: r.top + window.scrollY, height: r.height,
             header: g.querySelector('.parallax__header').clientHeight }
  }))
  report.push(`\n### ${v.n} ${v.w}x${v.h} — wrappers: ${gates.map(g => `#${g.i} top ${g.top.toFixed(0)} h ${g.height.toFixed(0)} header ${g.header}`).join(' | ')}`)

  for (const g of gates) {
    const span = g.height - g.header          // the distance it is pinned for
    report.push(`\n  gate #${g.i}  pinned for ${span.toFixed(0)}px`)
    for (const p of [0, 0.25, 0.4, 0.5, 0.6, 0.75, 0.9, 1]) {
      /* The document keeps growing under us — the horizontal chapter's own
         ScrollTrigger pin inserts a spacer once it initialises, and that moves
         everything below it. So converge on the wrapper's top first (that is
         progress 0 by definition) and only then step forward by span*p. */
      let wt = 1e9
      for (let k = 0; k < 12 && Math.abs(wt) > 0.5; k++) {
        wt = await page.evaluate((gi) => {
          const gate = document.querySelectorAll('.parallax--sticky')[gi]
          const t = gate.getBoundingClientRect().top
          window.scrollBy(0, t); window.dispatchEvent(new Event('scroll'))
          return t
        }, g.i)
        await new Promise(r => setTimeout(r, 70))
      }
      await page.evaluate((d) => { window.scrollBy(0, d); window.dispatchEvent(new Event('scroll')) }, span * p)
      await new Promise(r => setTimeout(r, 110))
      const realP = await page.evaluate((gi, span) => {
        const gate = document.querySelectorAll('.parallax--sticky')[gi]
        return -gate.getBoundingClientRect().top / span
      }, g.i, span)
      const m = await page.evaluate((gi) => {
        const gate = document.querySelectorAll('.parallax--sticky')[gi]
        const H = gate.querySelector('.parallax__header').getBoundingClientRect()
        const out = {}
        for (const l of ['1','2','5','3','4']) {
          const el = gate.querySelector(`[data-parallax-layer="${l}"]`)
          if (!el) continue
          const r = el.getBoundingClientRect()
          out[l] = { top: +(r.top - H.top).toFixed(1), bottom: +(r.bottom - H.top).toFixed(1) }
        }
        const d = gate.querySelector('[data-parallax-deep]')
        if (d) { const r = d.getBoundingClientRect()
          out.deep = { op: +getComputedStyle(d).opacity, vis: getComputedStyle(d).visibility,
                       top: +(r.top - H.top).toFixed(0) } }
        return { out, headerTop: +H.top.toFixed(1) }
      }, g.i)
      const crestFracs = { }
      report.push(`    p=${p.toFixed(2)} (real ${realP.toFixed(3)})  hdrTop ${m.headerTop}  ` +
        Object.entries(m.out).map(([k, r]) => k === 'deep'
          ? `deep ${r.vis}/${r.op.toFixed(2)}`
          : `L${k}[${r.top}..${r.bottom}]`).join('  '))
      if ([0, 0.5, 1].includes(p) || (g.i === 1 && [0.4, 0.6, 0.75].includes(p)))
        await page.screenshot({ path: `${OUT}/${v.n}-g${g.i}-${String(Math.round(p*100)).padStart(3,'0')}.png` })
    }
  }

  // the bedrock: is it actually behind the dark run, and are the sections transparent?
  const bed = await page.evaluate(() => {
    const b = document.querySelector('.ki-bedrock')
    if (!b) return null
    const r = b.getBoundingClientRect()
    const cs = getComputedStyle(b)
    const kids = [...b.querySelectorAll('[data-ki-band="dark"], .ki-hs, .ki-verk-sulu')]
      .map(e => ({ cls: e.className.split(' ')[0] || e.tagName,
                   bg: getComputedStyle(e).backgroundColor, img: getComputedStyle(e).backgroundImage.slice(0, 24) }))
    return { h: Math.round(r.height), img: cs.backgroundImage.includes('bedrock.webp'),
             size: cs.backgroundSize, repeat: cs.backgroundRepeat, kids }
  })
  report.push(`\n  bedrock: ${bed ? `${bed.h}px tall · tile ${bed.img} · size ${bed.size} · repeat ${bed.repeat}` : 'MISSING'}`)
  if (bed) for (const k of bed.kids) report.push(`     ${k.cls.padEnd(14)} bg ${k.bg}  img ${k.img}`)
  await page.close()
}
/* ONE Lenis, not two: the page now mounts two of these components, and each
   used to construct its own. Two instances both hijack the wheel and both run
   their own rAF against the same scrollTop, so a notch of wheel travels twice
   as far as it should. */
{
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })
  await (await page.createCDPSession()).send('Emulation.setEmulatedMedia',
    { features: [{ name: 'hover', value: 'hover' }, { name: 'pointer', value: 'fine' }] })
  await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle0' })
  await page.evaluate(() => { document.querySelector('.ki-curtain')?.remove() })
  await new Promise(r => setTimeout(r, 800))
  const gates = await page.evaluate(() => document.querySelectorAll('.parallax--sticky').length)
  const before = await page.evaluate(() => window.scrollY)
  await page.mouse.move(640, 400)
  await page.mouse.wheel({ deltaY: 400 })
  await new Promise(r => setTimeout(r, 1400))
  const after = await page.evaluate(() => window.scrollY)
  const html = await page.evaluate(() => document.documentElement.className)
  report.push(`\n### lenis · ${gates} pinned gates on the page · html class "${html}"`)
  report.push(`  one 400px wheel notch moved the page ${(after - before).toFixed(0)}px  ` +
    `(one instance ~400, two ~800)`)
  await page.close()
}
console.log(report.join('\n'))
writeFileSync(`${OUT}/report.txt`, report.join('\n'))
await browser.close(); srv.close()
