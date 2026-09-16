/**
 * Nýpugarðar landing: motion probe ([[feedback-motion-is-the-gate]]).
 *
 * Runs against a served build (default http://127.0.0.1:5395, the
 * `nypugardar-dist` launch config) in a real, visible-to-itself headless
 * Chrome, because a hidden preview pane starves rAF and finishes transitions
 * instantly. Prints numbers, not impressions:
 *   1. intro: wordmark letter translateY at fixed times after load
 *   2. hero scroll: wrapper y, fog plate y, fade opacity, content blur at
 *      0 / 25 / 50 / 75 / 100% of the hero
 *   3. manifesto mask position, band clip-path, map drive draw at the start,
 *      middle and end of their bands
 *   4. reduced motion: nothing transformed, fog hidden, hero 100svh
 *   5. layout: horizontal overflow at 320 / 390 / 1440, EN and IS
 *
 *   node tools/nypugardar-motion-probe.mjs [baseUrl]
 */
import puppeteer from 'puppeteer-core'

const BASE = process.argv[2] || 'http://127.0.0.1:5395'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const out = {}

/* 1. intro: a rAF recorder injected before any page script, so the timeline
 * starts at navigation and catches a flash of the resting wordmark if one ever
 * comes back (the first version sampled after DOMContentLoaded and missed a
 * hold that never moved at all). */
{
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.evaluateOnNewDocument(() => {
    window.__tl = []
    const t0 = performance.now()
    const tick = () => {
      const l = document.querySelector('.nyp-letter')
      const img = document.querySelector('header img')
      if (l && img) {
        const y = (e) => {
          const m = getComputedStyle(e).transform.match(/matrix\(([^)]+)\)/)
          return m ? m[1].split(',').map(Number) : [1, 0, 0, 1, 0, 0]
        }
        const row = { ms: Math.round(performance.now() - t0), letterY: Math.round(y(l)[5]), photo: y(img)[0].toFixed(3) }
        const last = window.__tl.at(-1)
        if (!last || last.letterY !== row.letterY) window.__tl.push(row)
      }
      if (performance.now() - t0 < 4000) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' })
  await sleep(4200)
  const tl = await page.evaluate(() => window.__tl)
  out.intro = { firstFrame: tl[0], samples: tl.filter((_, i) => i % 3 === 0), settled: tl.at(-1) }
  await page.close()
}

/* 2 + 3. scroll scenes */
{
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(BASE + '/', { waitUntil: 'networkidle0' })
  await sleep(2800)
  const heroH = await page.evaluate(() => document.querySelector('header').offsetHeight)
  const hero = []
  for (const f of [0, 0.25, 0.5, 0.75, 1]) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(heroH * f))
    await sleep(500)
    hero.push(
      await page.evaluate((f) => {
        const h = document.querySelector('header')
        const wrap = h.querySelector('[class*="translateZ"]')
        const fogs = [...h.querySelectorAll('.nyp-fog')].map((e) => {
          const m = getComputedStyle(e).transform.match(/matrix\(([^)]+)\)/)
          return m ? Math.round(Number(m[1].split(',')[5])) : 'none'
        })
        const fade = [...h.querySelectorAll('div')].find((d) => d.style.background?.includes('233'))
        const content = h.querySelector('.z-\\[3\\]')
        const wm = getComputedStyle(wrap).transform.match(/matrix\(([^)]+)\)/)
        return {
          at: f,
          wrapY: wm ? Math.round(Number(wm[1].split(',')[5])) : 0,
          fogY: fogs,
          fade: Number(getComputedStyle(fade).opacity).toFixed(2),
          blur: getComputedStyle(content).filter,
        }
      }, f),
    )
  }
  out.hero = hero

  const scene = async (sel, read) => {
    const rows = []
    const top = await page.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + scrollY, sel)
    for (const off of [-0.8, -0.5, -0.2]) {
      await page.evaluate((y) => window.scrollTo(0, y), Math.round(top + off * 900))
      await sleep(450)
      rows.push({ elTopInViewport: `${Math.round(-off * 100)}%`, ...(await page.evaluate(read, sel)) })
    }
    return rows
  }
  out.manifesto = await scene('.nyp-develop', (s) => ({ mask: getComputedStyle(document.querySelector(s)).getPropertyValue('--mask-position') }))
  out.band = await scene('#farm + section > div', (s) => ({ clip: getComputedStyle(document.querySelector(s)).clipPath }))
  out.route = await scene('[role="img"]', (s) => {
    const el = document.querySelector(s)
    return {
      driveDashOffset: getComputedStyle(el.querySelector('[data-drive]')).strokeDashoffset,
      markerOpacity: getComputedStyle(el.querySelector('[data-marker]')).opacity,
    }
  })
  await page.close()
}

/* 4. reduced motion */
{
  const page = await browser.newPage()
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.setViewport({ width: 390, height: 844 })
  await page.goto(BASE + '/', { waitUntil: 'networkidle0' })
  await sleep(1200)
  out.reduced = await page.evaluate(() => ({
    heroH: document.querySelector('header').offsetHeight,
    fogDisplay: getComputedStyle(document.querySelector('.nyp-fog')).display,
    letterStyle: document.querySelector('.nyp-letter').getAttribute('style'),
    gsapLoaded: [...performance.getEntriesByType('resource')].some((r) => /gsap|ScrollTrigger/i.test(r.name)),
  }))
  await page.close()
}

/* 5. overflow */
{
  const rows = []
  for (const path of ['/', '/is/']) {
    for (const w of [320, 390, 1440]) {
      const page = await browser.newPage()
      await page.setViewport({ width: w, height: 800 })
      await page.goto(BASE + path, { waitUntil: 'networkidle0' })
      await sleep(600)
      rows.push({
        path,
        w,
        ...(await page.evaluate(() => {
          const wm = document.querySelector('.nyp-wordmark')
          return {
            scrollW: document.documentElement.scrollWidth,
            wordmarkW: Math.round(wm.getBoundingClientRect().width),
            h2: [...document.querySelectorAll('h2')].filter((h) => h.scrollWidth > h.clientWidth + 1).map((h) => h.textContent.slice(0, 30)),
          }
        })),
      })
      await page.close()
    }
  }
  out.overflow = rows
}

await browser.close()
console.log(JSON.stringify(out, null, 1))
