/* Mobile audit of every route in the built site, as a phone (390x844, touch).
   Per route: horizontal overflow, tap targets under 44px, text under 12px,
   images without intrinsic size, console errors, failed requests.
   Usage: node .ki-mobaudit.mjs <base-url> <dist-dir> */
import puppeteer from 'puppeteer-core'
import { readdirSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'
const [base, dist] = process.argv.slice(2)
const routes = []
const walk = (d, rel) => {
  if (existsSync(join(d, 'index.html'))) routes.push(rel || '/')
  for (const e of readdirSync(d)) { const p = join(d, e); if (statSync(p).isDirectory() && !['assets', 'katrinisfeld', 'fonts'].includes(e)) walk(p, `${rel}/${e}`) }
}
walk(dist, '')
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
let bad = 0
for (const r of routes.sort()) {
  const p = await br.newPage()
  await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
  const errs = [], fails = []
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 90)) })
  p.on('pageerror', (e) => errs.push(String(e).slice(0, 90)))
  p.on('requestfailed', (q) => fails.push(q.url().split('/').pop()))
  p.on('response', (s) => { if (s.status() >= 400) fails.push(`${s.status()} ${s.url().split('/').pop()}`) })
  await p.goto(base + r, { waitUntil: 'networkidle0' }); await new Promise((x) => setTimeout(x, 900))
  // walk the page so reveals and lazy content settle
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo({ top: y, behavior: 'instant' }); await new Promise((x) => setTimeout(x, 40)) } scrollTo({ top: 0, behavior: 'instant' }) })
  await new Promise((x) => setTimeout(x, 500))
  const m = await p.evaluate((MIN) => {
    const vis = (e) => { const s = getComputedStyle(e); const b = e.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > 0 && b.width > 0 && b.height > 0 }
    const overflow = document.documentElement.scrollWidth - innerWidth
    const wide = [...document.querySelectorAll('body *')].filter((e) => { const b = e.getBoundingClientRect(); return vis(e) && b.right > innerWidth + 1 && getComputedStyle(e).position !== 'fixed' && !e.closest('[aria-hidden="true"]') }).slice(0, 3).map((e) => e.className || e.tagName)
    // tap targets: controls and standalone links, not links inside running text
    const small = [...document.querySelectorAll('a, button, input, textarea, select, [role="button"]')].filter((e) => {
      if (!vis(e) || e.closest('[inert]') || e.closest('.ki-sr') || e.classList.contains('ki-skip')) return false
      if (e.tagName === 'A' && e.closest('p, li') && e.closest('p, li').textContent.trim().length > e.textContent.trim().length + 12) return false
      const b = e.getBoundingClientRect(); const after = getComputedStyle(e, '::after'); const slop = after.position === 'absolute' && after.inset !== 'auto' ? 12 : 0
      const hit = Math.max(Math.min(b.width, b.height), parseFloat(after.height) || 0); return hit < MIN && Math.min(b.width, b.height) + slop < MIN
    }).map((e) => { const b = e.getBoundingClientRect(); return `${(e.className && String(e.className).split(' ')[0]) || e.tagName}:${Math.round(b.width)}x${Math.round(b.height)}` })
    const tiny = [...document.querySelectorAll('body *')].filter((e) => e.childNodes.length && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && vis(e) && !e.closest('[aria-hidden="true"]') && parseFloat(getComputedStyle(e).fontSize) < 12).map((e) => `${String(e.className).split(' ')[0] || e.tagName}:${getComputedStyle(e).fontSize}`)
    const unsized = [...document.images].filter((i) => !i.getAttribute('width') || !i.getAttribute('height')).length
    return { overflow, wide, small: [...new Set(small)].slice(0, 6), tiny: [...new Set(tiny)].slice(0, 5), unsized }
  }, +(process.env.MIN || 44))
  const issue = m.overflow > 0 || m.small.length || m.tiny.length || m.unsized || errs.length || fails.length
  if (issue) bad++
  console.log(`${issue ? 'FLAG' : 'ok  '} ${r.padEnd(46)} ${issue ? JSON.stringify({ ...m, errs: errs.slice(0, 2), fails: fails.slice(0, 3) }) : ''}`)
  await p.close()
}
await br.close()
console.log(`${routes.length} routes, ${bad} flagged`)
