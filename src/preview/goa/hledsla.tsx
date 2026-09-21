import { useEffect, useRef, useState } from 'react'

/* The loading screen. Góa red, the crest rising out of a mask in the middle,
   a paper hairline that fills with REAL progress (the fonts and the hero pack
   shots), then the red wipes up and the crest flies into its slot in the
   header. The header crest stays hidden until the flying one lands on it, so
   the hand-off reads as one object.

   Bounded both ways: never shorter than MIN (a flash reads as a glitch),
   never longer than MAX (a stalled image must not hold the page hostage).
   Reduced motion: no flight, a short cross-fade, done. */

const MIN = 1250
const MAX = 3600

export const HLEDSLA_CSS = `
html:has(.goa-root.goa-hled){overflow:hidden}
.goa-root.goa-hled .goa-hero .goa-up{transform:translateY(125%) !important;transition:none !important}
.goa-root.goa-hled .goa-merkid img,.goa-root.goa-flug .goa-merkid img{visibility:hidden}

.goa-hledB{position:fixed;inset:0;z-index:95;background:#C21514;
  clip-path:inset(0 0 0 0);transition:clip-path .9s cubic-bezier(.76,0,.24,1)}
.goa-hledB.ut{clip-path:inset(0 0 100% 0)}
.goa-hledF{position:fixed;left:0;top:0;z-index:96;pointer-events:none;transform-origin:0 0;
  will-change:transform;transition:transform 1s cubic-bezier(.76,0,.24,1)}
.goa-hledM{overflow:hidden}
.goa-hledM img{display:block;width:100%;height:auto;transform:translateY(105%);
  transition:transform 1s cubic-bezier(.17,.17,0,1)}
.goa-hledF.inn .goa-hledM img{transform:translateY(0)}
.goa-hledL{position:fixed;z-index:96;left:50%;bottom:clamp(2.5rem,9vh,5rem);width:min(12rem,40vw);height:2px;
  margin-left:calc(min(12rem,40vw) / -2);background:rgba(248,241,228,.28);overflow:hidden;
  transition:opacity .3s ease-out}
.goa-hledL i{display:block;height:100%;background:#F8F1E4;transform-origin:0 50%;
  transform:scaleX(var(--p,0));transition:transform .35s ease-out}
.goa-hledL.ut{opacity:0}
.goa-hledT{position:fixed;z-index:96;left:0;right:0;bottom:calc(clamp(2.5rem,9vh,5rem) + 1rem);text-align:center;
  color:#F8F1E4;font-size:.78rem;letter-spacing:.16em;text-transform:uppercase;font-variant-numeric:tabular-nums;
  transition:opacity .3s ease-out}
.goa-hledT.ut{opacity:0}
@media (prefers-reduced-motion:reduce){
  .goa-hledB{transition:opacity .3s ease-out}
  .goa-hledB.ut{clip-path:inset(0 0 0 0);opacity:0}
  .goa-hledF{transition:opacity .3s ease-out}
  .goa-hledF.flug{opacity:0}
  .goa-hledM img{transform:none;transition:none}
}
`

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

type Stig = 'inn' | 'ut' | 'buid'

export function Hledsla() {
  const [stig, setStig] = useState<Stig>('inn')
  const [p, setP] = useState(0)
  const [kominn, setKominn] = useState(false)
  const [ferd, setFerd] = useState<string | null>(null)

  /* place the crest centred on screen; its width is what the flight scales from */
  const [box, setBox] = useState(() => {
    const vh = typeof window === 'undefined' ? 800 : window.innerHeight
    const vw = typeof window === 'undefined' ? 1200 : window.innerWidth
    const h = Math.min(vh * 0.42, 380)
    const w = h * (184 / 230)
    return { w, x: (vw - w) / 2, y: (vh - h) / 2 - vh * 0.03 }
  })
  const boxRef = useRef(box)
  boxRef.current = box

  useEffect(() => {
    const root = document.querySelector('.goa-root') as HTMLElement | null
    root?.classList.add('goa-hled')
    const lenis = (window as unknown as { __goaLenis?: { stop: () => void; start: () => void } }).__goaLenis
    lenis?.stop()
    const t0 = performance.now()
    const rm = reduced()
    const onResize = () => {
      const vh = window.innerHeight, vw = window.innerWidth
      const h = Math.min(vh * 0.42, 380), w = h * (184 / 230)
      setBox({ w, x: (vw - w) / 2, y: (vh - h) / 2 - vh * 0.03 })
    }
    window.addEventListener('resize', onResize)

    /* real progress: fonts + every hero pack shot */
    const imgs = [...document.querySelectorAll<HTMLImageElement>('.goa-hero img, .goa-hledM img')]
    const jobs: Promise<unknown>[] = [
      document.fonts?.ready ?? Promise.resolve(),
      ...imgs.map((im) => (im.complete ? Promise.resolve() : new Promise((r) => { im.addEventListener('load', r, { once: true }); im.addEventListener('error', r, { once: true }) }))),
    ]
    let done = 0
    jobs.forEach((j) => j.then(() => { done += 1; setP(done / jobs.length) }))

    let lokid = false
    const klara = () => {
      if (lokid) return
      lokid = true
      setP(1)
      const wait = Math.max(0, (rm ? 300 : MIN) - (performance.now() - t0))
      window.setTimeout(() => {
        /* aim the flying crest at the header crest's real box */
        const target = document.querySelector('.goa-merkid img')?.getBoundingClientRect()
        if (target && target.width && !rm) {
          setFerd(`translate3d(${target.left}px,${target.top}px,0) scale(${target.width / boxRef.current.w})`)
        }
        root?.classList.remove('goa-hled')
        root?.classList.add('goa-flug')
        setStig('ut')
        lenis?.start()
        window.setTimeout(() => {
          root?.classList.remove('goa-flug')
          setStig('buid')
        }, rm ? 320 : 1050)
      }, wait)
    }
    Promise.all(jobs).then(klara)
    const cap = window.setTimeout(klara, MAX)
    return () => {
      window.clearTimeout(cap)
      window.removeEventListener('resize', onResize)
      root?.classList.remove('goa-hled', 'goa-flug')
      lenis?.start()
    }
  }, [])

  if (stig === 'buid') return null
  const ut = stig === 'ut'
  return (
    <div aria-hidden="true">
      <div className={`goa-hledB${ut ? ' ut' : ''}`} />
      <div className={`goa-hledF${kominn ? ' inn' : ''}${ut ? ' flug' : ''}`}
        style={{ width: box.w, transform: ut && ferd ? ferd : `translate3d(${box.x}px,${box.y}px,0)` }}>
        <div className="goa-hledM">
          {/* rise only once the crest has actually loaded, or on a slow
              connection the mask lifts an empty box */}
          <img src={`${import.meta.env.BASE_URL}goa/goa-merki-stort.svg`} alt="" width={184} height={230}
            ref={(im) => { if (im?.complete && im.naturalWidth && !kominn) requestAnimationFrame(() => setKominn(true)) }}
            onLoad={() => requestAnimationFrame(() => requestAnimationFrame(() => setKominn(true)))} />
        </div>
      </div>
      <p className={`goa-hledT${ut ? ' ut' : ''}`}>Sælgætisgerð síðan 1968</p>
      <div className={`goa-hledL${ut ? ' ut' : ''}`} style={{ ['--p' as string]: p }}><i /></div>
    </div>
  )
}
