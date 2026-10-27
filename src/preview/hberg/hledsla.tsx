import { V } from './vorur'
import { useEffect, useState } from 'react'
import { isCompact, lenisOf } from './ui'




const HERO = 1900

const E = {
  preloader: 'cubic-bezier(.5,0,0,1)',
  hero1: 'cubic-bezier(.64,0,.47,.57)',
  hero2: 'cubic-bezier(.16,.56,.44,1)',
}

export const HLEDSLA_CSS = `
html:has(.hb-root.hb-laest){overflow:hidden}
.hb-root.hb-hled .hb-hero .hb-up{transform:translateY(125%) !important;transition:none !important}
.hb-root.hb-hledB0 .hb-heroP{transform:translateY(100vh)}
.hb-root.hb-hledB0 .hb-haus{visibility:hidden}
.hb-root.hb-hledU .hb-heroP{position:relative;z-index:96;will-change:transform}
.hb-root.hb-hledU .hb-haus{z-index:97;visibility:visible}
.hb-plota{position:fixed;inset:0;z-index:95;background:#204A8E;transform:translateY(100%);
  display:grid;place-items:center;pointer-events:none}
.hb-plotaM{overflow:hidden;width:min(58vw,19rem)}
.hb-plotaM img{width:100%;height:auto;display:block;transform:translateY(105%);transition:transform 1s cubic-bezier(.17,.17,0,1) .2s}
.hb-plota.inn .hb-plotaM img{transform:none}
`

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

export function Hledsla() {
  const [buid, setBuid] = useState(() => typeof window === 'undefined' ? false : reduced())
  const [inn, setInn] = useState(false)

  useEffect(() => {
    if (buid) return
    const root = document.querySelector('.hb-root') as HTMLElement | null
    const plota = document.querySelector('.hb-plota') as HTMLElement | null
    const heroP = document.querySelector('.hb-heroP') as HTMLElement | null
    const haus = document.querySelector('.hb-haus') as HTMLElement | null
    if (!root || !plota || !heroP) { setBuid(true); return }
    root.classList.add('hb-hled', 'hb-hledB0', 'hb-laest')
    const anims: Animation[] = []
    const timers: number[] = []
    let lokid = false

    const klara = () => {
      if (lokid) return
      lokid = true
      
      anims.forEach((a) => { try { a.finish(); a.cancel() } catch {  } })
      timers.forEach((t) => window.clearTimeout(t))
      root.classList.remove('hb-hled', 'hb-hledB0', 'hb-hledU', 'hb-laest')
      heroP.style.transform = ''
      if (haus) haus.style.transform = ''
      root.querySelectorAll('.hb-hero .hb-up, .hb-hero [class*="hb-"]').forEach((n) => n.classList.add('on'))
      lenisOf()?.start(); lenisOf()?.resize()
      setBuid(true)
    }

    const byrja = () => {
      if (lokid) return
      const ride = !isCompact()
      
      anims.push(plota.animate([{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }],
        { duration: 1500, easing: E.preloader, fill: 'forwards' }))
      setInn(true)
      
      timers.push(window.setTimeout(() => {
        root.classList.remove('hb-hledB0'); root.classList.add('hb-hledU')
        const k: Keyframe[] = [
          { transform: 'translateY(100vh)', easing: E.hero1 },
          { transform: 'translateY(31.9vh)', offset: 1 / 3, easing: E.hero2 },
          { transform: 'translateY(0)' },
        ]
        anims.push(heroP.animate(k, { duration: 1500, fill: 'forwards' }))
        if (ride && haus) anims.push(haus.animate(k, { duration: 1500, fill: 'forwards' }))
      }, HERO))
      
      timers.push(window.setTimeout(() => {
        root.classList.remove('hb-hled')
        root.querySelectorAll('.hb-hero .hb-heroT, .hb-hero .hb-rist').forEach((n) => n.classList.add('on'))
      }, HERO + 500))
      
      timers.push(window.setTimeout(() => { root.classList.remove('hb-laest'); lenisOf()?.start() }, HERO + 1860))
      
      timers.push(window.setTimeout(klara, HERO + 2100))
    }

    lenisOf()?.stop()
    
    const imgs = [...root.querySelectorAll<HTMLImageElement>('.hb-hero img')]
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
      
      lokid = true
      window.clearTimeout(wd)
      timers.forEach((t) => window.clearTimeout(t))
      anims.forEach((a) => a.cancel())
      root.classList.remove('hb-hled', 'hb-hledB0', 'hb-hledU', 'hb-laest')
      document.removeEventListener('visibilitychange', vis)
      window.removeEventListener('pageshow', show)
      lenisOf()?.start()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (buid) return null
  return (
    <div className={`hb-plota${inn ? ' inn' : ''}`} aria-hidden="true">
      <div className="hb-plotaM">
        <img src={`${import.meta.env.BASE_URL}hberg/brand/logo.svg${V}`} alt="" width={820} height={378} />
      </div>
    </div>
  )
}
