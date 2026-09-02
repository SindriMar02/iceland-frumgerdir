import puppeteer from 'puppeteer-core'
/* A frame fired before the build's own reveal has settled is a blank field with
   an outlined wordmark, which is worse than no image at all. Each job names the
   thing that must be visible, and a job that has not settled refuses to write. */
const JOBS = [/* lagskogur only */
  ['lagskogur', 'https://sindrimar02.github.io/lagskogur-preview/', '.intro__title, h1', 'img.intro__img'],
  ['austurey',  'https://sindrimar02.github.io/austurey-preview/',  '.card_h1', '.hero_img'],
  ['nollur',    'https://sindrimar02.github.io/iceland-frumgerdir/preview/nollur/', '.nl-hero-word', '.nl-hero-cut img'],
]
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--hide-scrollbars'] })
let bad = 0
for (const [slug, url, wmSel, imgSel] of JOBS) {
  const p = await b.newPage()
  await p.setCacheEnabled(false)
  await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
  await p.goto(url + '?shot=' + Math.random().toString(36).slice(2), { waitUntil: 'networkidle0', timeout: 90000 })
  await new Promise(r => setTimeout(r, 8000))
  const ok = await p.evaluate((wmSel, imgSel) => {
    const wm = document.querySelector(wmSel), img = document.querySelector(imgSel)
    const pre = document.querySelector('.preloader, .nl-loader, #preloader')
    const preGone = !pre || getComputedStyle(pre).opacity < 0.02 || getComputedStyle(pre).display === 'none' || pre.hidden
    return {
      wmOpacity: wm ? +getComputedStyle(wm).opacity : null,
      wmFound: !!wm,
      preGone,
      imgComplete: img ? (img.complete && img.naturalWidth > 0) : false,
      imgSrc: img ? img.currentSrc.split('/').pop() : null,
    }
  }, wmSel, imgSel)
  const pass = ok.imgComplete && ok.preGone && (ok.wmOpacity === null || ok.wmOpacity > 0.9)
  if (!pass) { console.error(`${slug}: NOT SETTLED, refusing to write ->`, JSON.stringify(ok)); bad++; await p.close(); continue }
  const out = `${process.env.HOME}/Downloads/frumgerd-${slug}.jpg`
  await p.screenshot({ path: out, type: 'jpeg', quality: 88 })
  console.log(`${slug}: ${out}  (${ok.imgSrc})`)
  await p.close()
}
console.log(bad ? `${bad} NOT WRITTEN` : 'all three written')
await b.close()
