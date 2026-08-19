import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

const url = process.argv[2]
const slug = process.argv[3]
const depths = (process.argv[4] || '0,0.12,0.25,0.4,0.55,0.7,0.85').split(',').map(Number)
const ROOT = '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/02537dce-6838-4208-8842-7378d05ae886/scratchpad/refs/' + slug
fs.mkdirSync(ROOT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  userDataDir: '/private/tmp/claude-501/-Users-sindri-Documents-Website-redesign-mockups/02537dce-6838-4208-8842-7378d05ae886/scratchpad/refs/_profile-' + slug,
  args: ['--no-sandbox', '--force-device-scale-factor=1', '--autoplay-policy=no-user-gesture-required'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 })
await page.evaluate(() => document.fonts.ready).catch(() => {})
await new Promise((r) => setTimeout(r, 6000))

// dismiss obvious cookie walls by clicking a decline/accept-necessary style button? -> no, we just probe
const probe = await page.evaluate(() => {
  const cs = (e) => getComputedStyle(e)
  const body = cs(document.body)
  const count = new Map()
  const bump = (m, k) => m.set(k, (m.get(k) || 0) + 1)
  const colors = new Map(), bgs = new Map(), fams = new Map(), sizes = new Map()
  const all = Array.from(document.querySelectorAll('*')).slice(0, 4000)
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
  const heads = Array.from(document.querySelectorAll('h1,h2,h3')).slice(0, 14).map((h) => {
    const s = cs(h)
    return { t: h.textContent.replace(/\s+/g, ' ').trim().slice(0, 56), fs: Math.round(parseFloat(s.fontSize)), lh: s.lineHeight, ls: s.letterSpacing, ff: s.fontFamily.split(',')[0], w: s.fontWeight, tt: s.textTransform }
  })
  const libs = Object.keys(window).filter((k) => /^(gsap|ScrollTrigger|Lenis|barba|Swiper|THREE|SplitText|ScrollSmoother|Flip|Draggable|Observer)$/i.test(k))
  const canvases = Array.from(document.querySelectorAll('canvas')).map((c) => ({ w: c.width, h: c.height, cls: c.className.toString().slice(0, 40) }))
  const vids = Array.from(document.querySelectorAll('video')).map((v) => ({ src: (v.currentSrc || '').split('/').pop().slice(0, 40), w: v.videoWidth, h: v.videoHeight }))
  const radii = top(new Map(all.filter((e) => cs(e).borderRadius !== '0px').reduce((m, e) => (m.set(cs(e).borderRadius, (m.get(cs(e).borderRadius) || 0) + 1), m), new Map())), 6)
  const shadows = top(new Map(all.filter((e) => cs(e).boxShadow !== 'none').reduce((m, e) => (m.set(cs(e).boxShadow, (m.get(cs(e).boxShadow) || 0) + 1), m), new Map())), 4)
  const mixes = all.filter((e) => cs(e).mixBlendMode !== 'normal').length
  const clips = all.filter((e) => cs(e).clipPath !== 'none').length
  const masks = all.filter((e) => (cs(e).maskImage || 'none') !== 'none').length
  const svgs = document.querySelectorAll('svg').length
  const fullBleed = all.filter((e) => { const r = e.getBoundingClientRect(); return r.width >= window.innerWidth - 2 && r.height > 400 }).length
  return {
    url: location.href, docH: document.documentElement.scrollHeight, vw: window.innerWidth,
    bodyBg: body.backgroundColor, bodyColor: body.color, bodyFont: body.fontFamily,
    topBg: top(bgs, 8), topColor: top(colors, 8), topFam: top(fams, 6), topType: top(sizes, 12),
    heads, libs, canvases, vids, radii, shadows,
    counts: { mixBlend: mixes, clipPath: clips, mask: masks, svg: svgs, fullBleed, imgs: document.images.length },
  }
})
fs.writeFileSync(ROOT + '/probe.json', JSON.stringify(probe, null, 2))
console.log(JSON.stringify(probe, null, 1).slice(0, 6000))

for (const d of depths) {
  await page.evaluate((dd) => window.scrollTo({ top: (document.documentElement.scrollHeight - window.innerHeight) * dd, behavior: 'instant' }), d)
  await new Promise((r) => setTimeout(r, 1400))
  await page.mouse.wheel({ deltaY: 2 })
  await new Promise((r) => setTimeout(r, 900))
  await page.screenshot({ path: `${ROOT}/d${String(Math.round(d * 100)).padStart(3, '0')}.png` })
}
await browser.close()
console.log('shots in', ROOT)
