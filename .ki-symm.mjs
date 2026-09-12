/* the hero pair: equal pills, centred on the frame and on the name */
import puppeteer from 'puppeteer-core'
const [url, out] = process.argv.slice(2)
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
for (const [w, h] of [[1440, 900], [1024, 768], [390, 844]]) {
  const p = await br.newPage(); await p.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: w < 800, hasTouch: w < 800 })
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await p.goto(url, { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 1500))
  const m = await p.evaluate(() => {
    const c = (e) => { const r = e.getBoundingClientRect(); return { l: r.left, r: r.right, w: r.width, h: r.height, cx: r.left + r.width / 2, t: r.top } }
    const pills = [...document.querySelectorAll('.ki-show-cta .ki-fill')].filter(e => getComputedStyle(e).display !== 'none').map(c)
    const labels = [...document.querySelectorAll('.ki-show-cta .ki-fill')].filter(e => getComputedStyle(e).display !== 'none').map(e => { const a = c(e), b = c(e.querySelector('.ki-fill-label')), d = c(e.querySelector('.ki-fill-dot')); return { padL: Math.round(b.l - a.l), gapToDot: Math.round(d.l - b.r) } })
    const pair = c(document.querySelector('.ki-show-cta')), name = c(document.querySelector('.ki-show-name')), role = c(document.querySelector('.ki-show-role'))
    return { pills: pills.map(x => [Math.round(x.w), Math.round(x.h), Math.round(x.t)]), labels, pairCx: Math.round(pair.cx), nameCx: Math.round(name.cx), roleCx: Math.round(role.cx), frameCx: innerWidth / 2 }
  })
  console.log(w, JSON.stringify(m))
  const cta = await p.$eval('.ki-show-lockup', e => { const r = e.getBoundingClientRect(); return { x: 0, y: r.top + scrollY, width: innerWidth, height: r.height } })
  await p.screenshot({ path: `${out}-${w}.png`, clip: cta })
  await p.close()
}
await br.close()
