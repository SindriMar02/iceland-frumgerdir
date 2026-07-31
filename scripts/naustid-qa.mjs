import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

const URL = process.env.NA_URL || 'http://localhost:5199/preview/naustid'
const OUT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/02537dce-6838-4208-8842-7378d05ae886/scratchpad/naustid-v2'
fs.mkdirSync(OUT, { recursive: true })
const log = []
const say = (...a) => {
  const s = a.join(' ')
  log.push(s)
  console.log(s)
}

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  userDataDir: OUT + '/profile',
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
})

/* ── 1 · REDUCED MOTION: the authoritative completeness check ───────────── */
{
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 90000 })
  await page.evaluate(() => document.fonts.ready)
  await new Promise((r) => setTimeout(r, 2500))
  await page.screenshot({ path: OUT + '/full-reduced.png', fullPage: true })

  const rm = await page.evaluate(() => {
    const hidden = Array.from(document.querySelectorAll('#na-root section, #na-root header')).filter(
      (s) => getComputedStyle(s).opacity !== '1',
    ).length
    const canvases = Array.from(document.querySelectorAll('#na-root canvas')).map((c) => ({
      w: c.width,
      h: c.height,
      op: getComputedStyle(c).opacity,
    }))
    const imgs = Array.from(document.querySelectorAll('#na-root img')).map((i) => ({
      f: i.currentSrc.split('/').pop().slice(0, 26),
      nw: i.naturalWidth,
      op: Math.round(parseFloat(getComputedStyle(i).opacity) * 100) / 100,
    }))
    return { hidden, canvases, imgs, docH: document.documentElement.scrollHeight }
  })
  say('── REDUCED MOTION ──')
  say('sections with opacity!=1 :', rm.hidden, rm.hidden === 0 ? 'PASS' : 'FAIL')
  say('doc height              :', rm.docH)
  say('photos (all should be opacity 1, naturalWidth>0):')
  rm.imgs.forEach((i) => say('   ', JSON.stringify(i)))
  say('rib canvases (should be opacity 0 under reduced motion):')
  rm.canvases.forEach((c) => say('   ', JSON.stringify(c)))
  await page.close()
}

/* ── 2 · NORMAL MOTION: scroll-through, scrub proof, structure probe ────── */
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 90000 })
await page.evaluate(() => document.fonts.ready)
await new Promise((r) => setTimeout(r, 2500))

const wheelTo = async (frac) => {
  const target = await page.evaluate((f) => (document.documentElement.scrollHeight - window.innerHeight) * f, frac)
  let guard = 0
  for (;;) {
    const y = await page.evaluate(() => window.scrollY)
    if (Math.abs(y - target) < 40 || guard++ > 200) break
    await page.mouse.wheel({ deltaY: y < target ? 600 : -600 })
    await new Promise((r) => setTimeout(r, 26))
  }
  await new Promise((r) => setTimeout(r, 900))
}

/* The hero raster must actually contain yellow pixels, or the whole
 * signature silently shipped as an empty canvas. */
const ribInk = async () =>
  page.evaluate(() => {
    const c = document.querySelector('#na-root canvas')
    if (!c) return null
    const ctx = c.getContext('2d')
    const d = ctx.getImageData(0, 0, c.width, Math.min(c.height, 600)).data
    let painted = 0
    for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 20) painted++
    return {
      w: c.width,
      h: c.height,
      paintedPct: Math.round((painted / (d.length / 4)) * 1000) / 10,
      opacity: Math.round(parseFloat(getComputedStyle(c).opacity) * 1000) / 1000,
    }
  })

say('')
say('── HERO RIB RASTER ──')
const rib0 = await ribInk()
say('at scroll 0     :', JSON.stringify(rib0))
await page.screenshot({ path: OUT + '/hero-ribs.png' })

await wheelTo(0.055)
const ribMid = await ribInk()
say('mid-resolve     :', JSON.stringify(ribMid))
await page.screenshot({ path: OUT + '/hero-mid.png' })

await wheelTo(0.1)
const ribEnd = await ribInk()
say('resolved        :', JSON.stringify(ribEnd))
await page.screenshot({ path: OUT + '/hero-photo.png' })

/* REVERSIBILITY — a one-shot IntersectionObserver reveal stays pinned; a real
 * scrub falls again on the way back up (ledger #50). */
await wheelTo(0.0)
const ribBack = await ribInk()
say('scrolled back   :', JSON.stringify(ribBack))
const reversible = rib0 && ribEnd && ribBack && ribEnd.opacity < 0.15 && ribBack.opacity > 0.7
say('SCRUB REVERSIBLE:', reversible ? 'PASS' : 'FAIL', `(${rib0?.opacity} -> ${ribEnd?.opacity} -> ${ribBack?.opacity})`)

/* ── 3 · Section walk-through screenshots ──────────────────────────────── */
for (const f of [0.14, 0.26, 0.38, 0.5, 0.62, 0.74, 0.86, 0.96]) {
  await wheelTo(f)
  await page.screenshot({ path: `${OUT}/s${String(Math.round(f * 100)).padStart(2, '0')}.png` })
}

/* ── 4 · Structure probe — the same probe run against the reference ─────── */
await wheelTo(0.4)
const probe = await page.evaluate(() => {
  const cs = (e) => getComputedStyle(e)
  const bump = (m, k) => m.set(k, (m.get(k) || 0) + 1)
  const colors = new Map(), bgs = new Map(), fams = new Map(), sizes = new Map()
  const all = Array.from(document.querySelectorAll('#na-root *'))
  for (const el of all) {
    const s = cs(el)
    const r = el.getBoundingClientRect()
    if (r.width < 2 || r.height < 2) continue
    bump(bgs, s.backgroundColor)
    if (el.childElementCount === 0 && el.textContent.trim()) {
      bump(colors, s.color)
      bump(fams, s.fontFamily)
      bump(sizes, `${s.fontFamily.split(',')[0]}|${Math.round(parseFloat(s.fontSize))}|${s.fontWeight}|${s.letterSpacing}|${s.textTransform}`)
    }
  }
  const top = (m, n) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n)
  const shadows = all.filter((e) => cs(e).boxShadow !== 'none' && !e.closest('[data-preview-chrome]'))
  const radii = new Map()
  all.forEach((e) => { const b = cs(e).borderRadius; if (b !== '0px') bump(radii, b) })
  const fullBleed = all.filter((e) => { const r = e.getBoundingClientRect(); return r.width >= window.innerWidth - 2 && r.height > 400 }).length
  const h1 = document.querySelector('#na-root h1')
  return {
    docH: document.documentElement.scrollHeight,
    topBg: top(bgs, 6), topColor: top(colors, 6), topFam: top(fams, 6), topType: top(sizes, 10),
    shadowCount: shadows.length,
    shadowSamples: shadows.slice(0, 3).map((e) => cs(e).boxShadow.slice(0, 40)),
    radii: top(radii, 6),
    fullBleed,
    h1Text: h1 ? h1.textContent.replace(/\s+/g, ' ').trim() : null,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }
})
fs.writeFileSync(OUT + '/probe.json', JSON.stringify(probe, null, 2))
say('')
say('── STRUCTURE ──')
say('doc height        :', probe.docH)
say('horizontal overflow:', probe.overflow, probe.overflow <= 0 ? 'PASS' : 'FAIL')
say('box-shadows       :', probe.shadowCount, probe.shadowCount === 0 ? 'PASS (none)' : 'see ' + JSON.stringify(probe.shadowSamples))
say('full-bleed >400px :', probe.fullBleed)
say('h1 textContent    :', JSON.stringify(probe.h1Text))
say('fonts             :', JSON.stringify(probe.topFam))
say('grounds           :', JSON.stringify(probe.topBg))
say('inks              :', JSON.stringify(probe.topColor))
say('radii             :', JSON.stringify(probe.radii))
say('type roles        :')
probe.topType.forEach((t) => say('   ', JSON.stringify(t)))

/* ── 5 · Contrast + tap targets ────────────────────────────────────────── */
const a11y = await page.evaluate(() => {
  const parse = (c) => {
    let m = c.match(/rgba?\(([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:[ ,/]+([\d.]+))?\)/)
    if (m) return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]]
    m = c.match(/color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)(?: \/ ([\d.]+))?\)/)
    if (m) return [+m[1] * 255, +m[2] * 255, +m[3] * 255, m[4] === undefined ? 1 : +m[4]]
    return null
  }
  const lum = ([r, g, b]) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  }
  const over = (fg, bg) => [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3])).concat([1])
  const bgOf = (el) => {
    let n = el
    while (n && n !== document.documentElement) {
      const c = parse(getComputedStyle(n).backgroundColor)
      if (c && c[3] > 0.85) return c
      n = n.parentElement
    }
    return [18, 23, 27, 1]
  }
  const fails = []
  const small = []
  document.querySelectorAll('#na-root p,#na-root a,#na-root span,#na-root h1,#na-root h2,#na-root h3,#na-root li,#na-root button,#na-root label,#na-root dt,#na-root dd,#na-root blockquote,#na-root figcaption').forEach((el) => {
    if (el.childElementCount > 0 || !el.textContent.trim()) return
    const r = el.getBoundingClientRect()
    if (r.width < 2 || r.height < 2) return
    const s = getComputedStyle(el)
    const fg0 = parse(s.color)
    if (!fg0) return
    const bg = bgOf(el)
    const fg = over(fg0, bg)
    const L1 = lum(fg), L2 = lum(bg)
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
    const px = parseFloat(s.fontSize)
    const bold = parseInt(s.fontWeight, 10) >= 700
    const need = px >= 24 || (px >= 18.66 && bold) ? 3 : 4.5
    if (ratio < need) fails.push({ t: el.textContent.trim().slice(0, 34), px: Math.round(px), ratio: Math.round(ratio * 100) / 100, need, color: s.color })
  })
  document.querySelectorAll('#na-root a,#na-root button,#na-root input,#na-root textarea').forEach((el) => {
    const r = el.getBoundingClientRect()
    if (r.width < 1 || r.height < 1) return
    if (r.height < 44 && !el.closest('nav')) small.push({ t: (el.textContent || el.id).trim().slice(0, 26), h: Math.round(r.height) })
  })
  return { fails, small }
})
say('')
say('── A11Y ──')
say('contrast failures :', a11y.fails.length, a11y.fails.length === 0 ? 'PASS' : '')
a11y.fails.slice(0, 12).forEach((f) => say('   ', JSON.stringify(f)))
say('tap targets <44px :', a11y.small.length)
a11y.small.slice(0, 8).forEach((f) => say('   ', JSON.stringify(f)))

/* ── 6 · Mobile pass ───────────────────────────────────────────────────── */
await page.setViewport({ width: 390, height: 844 })
await page.reload({ waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 2200))
const mob = await page.evaluate(() => ({
  overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  docH: document.documentElement.scrollHeight,
}))
say('')
say('── MOBILE 390px ──')
say('horizontal overflow:', mob.overflow, mob.overflow <= 0 ? 'PASS' : 'FAIL')
await page.screenshot({ path: OUT + '/mobile-top.png' })

fs.writeFileSync(OUT + '/qa.txt', log.join('\n'))
await browser.close()
console.log('\nartifacts in', OUT)
