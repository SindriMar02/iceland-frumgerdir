import { useEffect, useState } from 'react'
import { isCompact, lenisOf } from './ui'

/* The intro, as noho plays it (§4.2 of _docs/noho-teardown.md), in Góa red
   with the crest in the panel:

     t 0.0  the panel rises from below and covers the screen   1.5s  preloader
     t 1.9  the hero rises from a full viewport low to 31.9%   0.5s  hero1
     t 2.4  ...and completes, covering the panel               1.0s  hero2
            (the header rides the identical curve on desktop)
     t 2.4  title lines + image grid rise out of their masks   1.0s  custom-our, 0.12 stagger
     t 2.9  hero slogan                                        0.75s
   (noho's own hero start is 0.5s; see HERO below for why Góa's is later)

   The hitch at 31.9% is the whole effect: one continuous lift that reads as
   weight rather than a slide. Scroll is released when the title lines land,
   not when the timeline ends, so a visitor can leave before it is over.

   Escape hatches (§4.2): a 12s watchdog, visibilitychange and bfcache
   pageshow all jump to the end state. Declared deviation 9: the wait for
   fonts and hero images before starting is capped at 1.2s. Reduced motion
   skips the whole thing. On compact widths the header does not ride (the
   mobile chrome standard: the bar never moves); it simply appears above the
   rising hero. */

/* When the hero starts to rise. noho starts it at 0.5s, while its panel is
   still coming up; Góa's panel carries the crest, and Sindri wanted the crest
   on screen longer (2026-09-21). So the panel rises (1.5s), the crest rises
   in with it and lands at ~1.2s, holds, and only then does the page come up
   over it. The two-stage lift itself is unchanged. */
const HERO = 1900

const E = {
  preloader: 'cubic-bezier(.5,0,0,1)',
  hero1: 'cubic-bezier(.64,0,.47,.57)',
  hero2: 'cubic-bezier(.16,.56,.44,1)',
}

export const HLEDSLA_CSS = `
html:has(.goa-root.goa-laest){overflow:hidden}
.goa-root.goa-hled .goa-hero .goa-up{transform:translateY(125%) !important;transition:none !important}
.goa-root.goa-hledB0 .goa-heroP{transform:translateY(100vh)}
.goa-root.goa-hledB0 .goa-haus{visibility:hidden}
.goa-root.goa-hledU .goa-heroP{position:relative;z-index:96;will-change:transform}
.goa-root.goa-hledU .goa-haus{z-index:97;visibility:visible}
.goa-plota{position:fixed;inset:0;z-index:95;background:#C21514;transform:translateY(100%);
  display:grid;place-items:center;pointer-events:none}
.goa-plotaM{overflow:hidden;width:min(34vh,15rem)}
.goa-plotaM img{width:100%;height:auto;display:block;transform:translateY(105%);transition:transform 1s cubic-bezier(.17,.17,0,1) .2s}
.goa-plota.inn .goa-plotaM img{transform:none}
`

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

export function Hledsla() {
  const [buid, setBuid] = useState(() => typeof window === 'undefined' ? false : reduced())
  const [inn, setInn] = useState(false)

  useEffect(() => {
    if (buid) return
    const root = document.querySelector('.goa-root') as HTMLElement | null
    const plota = document.querySelector('.goa-plota') as HTMLElement | null
    const heroP = document.querySelector('.goa-heroP') as HTMLElement | null
    const haus = document.querySelector('.goa-haus') as HTMLElement | null
    if (!root || !plota || !heroP) { setBuid(true); return }
    root.classList.add('goa-hled', 'goa-hledB0', 'goa-laest')
    const anims: Animation[] = []
    const timers: number[] = []
    let lokid = false

    const klara = () => {
      if (lokid) return
      lokid = true
      /* land every animated element on its end state, then drop the
         animations so nothing keeps a compositing layer afterwards */
      anims.forEach((a) => { try { a.finish(); a.cancel() } catch { /* already done */ } })
      timers.forEach((t) => window.clearTimeout(t))
      root.classList.remove('goa-hled', 'goa-hledB0', 'goa-hledU', 'goa-laest')
      heroP.style.transform = ''
      if (haus) haus.style.transform = ''
      root.querySelectorAll('.goa-hero .goa-up, .goa-hero [class*="goa-"]').forEach((n) => n.classList.add('on'))
      lenisOf()?.start(); lenisOf()?.resize()
      setBuid(true)
    }

    const byrja = () => {
      if (lokid) return
      const ride = !isCompact()
      /* 0.0: the panel rises */
      anims.push(plota.animate([{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }],
        { duration: 1500, easing: E.preloader, fill: 'forwards' }))
      setInn(true)
      /* HERO: the hero, and on desktop the header, rise in two stages */
      timers.push(window.setTimeout(() => {
        root.classList.remove('goa-hledB0'); root.classList.add('goa-hledU')
        const k: Keyframe[] = [
          { transform: 'translateY(100vh)', easing: E.hero1 },
          { transform: 'translateY(31.9vh)', offset: 1 / 3, easing: E.hero2 },
          { transform: 'translateY(0)' },
        ]
        anims.push(heroP.animate(k, { duration: 1500, fill: 'forwards' }))
        if (ride && haus) anims.push(haus.animate(k, { duration: 1500, fill: 'forwards' }))
      }, HERO))
      /* HERO + 0.5: title lines and grid */
      timers.push(window.setTimeout(() => {
        root.classList.remove('goa-hled')
        root.querySelectorAll('.goa-hero .goa-heroT, .goa-hero .goa-rist').forEach((n) => n.classList.add('on'))
      }, HERO + 500))
      /* HERO + ~1.86: the title lines have landed, scroll is released */
      timers.push(window.setTimeout(() => { root.classList.remove('goa-laest'); lenisOf()?.start() }, HERO + 1860))
      /* settle: tidy up */
      timers.push(window.setTimeout(klara, HERO + 2100))
    }

    lenisOf()?.stop()
    /* fonts and the hero pack shots, capped at 1.2s */
    const imgs = [...root.querySelectorAll<HTMLImageElement>('.goa-hero img')]
    const klar = Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      ...imgs.map((im) => (im.complete ? Promise.resolve() : new Promise((r) => { im.addEventListener('load', r, { once: true }); im.addEventListener('error', r, { once: true }) }))),
    ])
    const cap = new Promise((r) => window.setTimeout(r, 1200))
    void Promise.race([klar, cap]).then(byrja)

    const wd = window.setTimeout(klara, 12000)
    const vis = () => { if (document.hidden) klara() }
    const show = (e: PageTransitionEvent) => { if (e.persisted) klara() }
    document.addEventListener('visibilitychange', vis)
    window.addEventListener('pageshow', show)
    return () => {
      /* teardown without finishing: under StrictMode the effect runs twice
         in development, and finishing here would skip the intro entirely */
      lokid = true
      window.clearTimeout(wd)
      timers.forEach((t) => window.clearTimeout(t))
      anims.forEach((a) => a.cancel())
      root.classList.remove('goa-hled', 'goa-hledB0', 'goa-hledU', 'goa-laest')
      document.removeEventListener('visibilitychange', vis)
      window.removeEventListener('pageshow', show)
      lenisOf()?.start()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (buid) return null
  return (
    <div className={`goa-plota${inn ? ' inn' : ''}`} aria-hidden="true">
      <div className="goa-plotaM">
        <img src={`${import.meta.env.BASE_URL}goa/goa-merki-stort.svg`} alt="" width={184} height={230} />
      </div>
    </div>
  )
}
