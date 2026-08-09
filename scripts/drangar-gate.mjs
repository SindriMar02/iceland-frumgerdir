/* Transplant gate — SAME probe over the reference and the build
   (reference-transplant-gate memory: paste BOTH tables or the build failed). */
import puppeteer from 'puppeteer-core'

const targets = [
  ['reference', 'https://normalisboring.es/'],
  ['drangar', process.env.DR_URL ?? 'http://localhost:5399/preview/drangar'],
]

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  userDataDir: '/tmp/dr-gate-profile',
  args: ['--window-size=1440,900'],
})

for (const [name, url] of targets) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.evaluateOnNewDocument(() => {
    try { localStorage.setItem('first_charge', '1'); sessionStorage.setItem('dr_seen', '1') } catch {}
  })
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })
    await new Promise((r) => setTimeout(r, 5000))
    /* wheel a bit so lazily-armed triggers exist */
    for (let i = 0; i < 6; i++) { await page.mouse.wheel({ deltaY: 500 }); await new Promise((r) => setTimeout(r, 60)) }
    await new Promise((r) => setTimeout(r, 800))
    const res = await page.evaluate(() => {
      const st = (window.ScrollTrigger ? window.ScrollTrigger.getAll() : [])
      const scrubbed = st.filter((t) => t.vars && t.vars.scrub !== undefined && t.vars.scrub !== false).length
      const pinned = st.filter((t) => t.vars && t.vars.pin).length
      let clip = 0, blend = 0, willc = 0
      document.querySelectorAll('*').forEach((el) => {
        const cs = getComputedStyle(el)
        if (cs.clipPath && cs.clipPath !== 'none') clip += 1
        if (cs.mixBlendMode && cs.mixBlendMode !== 'normal') blend += 1
        if (cs.willChange && cs.willChange !== 'auto') willc += 1
      })
      return {
        triggers: st.length, scrubbed, pinned,
        clipPathEls: clip, mixBlendEls: blend, willChangeEls: willc,
        splitChars: document.querySelectorAll('.char, .dr-char').length,
        customCursor: !!document.querySelector('#mouse, .dr-cursor'),
        lenis: !!(window.lenis || document.documentElement.classList.contains('lenis')) || typeof window.Lenis !== 'undefined',
      }
    })
    console.log(JSON.stringify({ name, ...res }))
  } catch (e) {
    console.log(JSON.stringify({ name, error: String(e).slice(0, 120) }))
  }
  await page.close()
}
await browser.close()
