import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { BASE, V } from './vorur'

// Söluaðilar sem merki á hreyfanlegum borða. Byggt á 21st.dev "Logo Marquee" (ddoemonn, id 23537),
// fært yfir í hreint CSS: stöðvast við hover og fókus, hraðar og hægir mjúklega, virðir reduced motion.
const RAMP = 0.19
const SETTLE = 0.16
const MAX_COPIES = 14

const fold = (x: number, loop: number) => { const m = x % loop; return m > 0 ? m - loop : m }
const clamp = (x: number, a: number, b: number) => (x < a ? a : x > b ? b : x)
const useReduced = () => {
  const [r, setR] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setR(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return r
}

function useLogoMarquee({ speed = 40, gap = 72 }: { speed?: number; gap?: number }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const groupRef = useRef<HTMLUListElement>(null)
  const [copies, setCopies] = useState(4)
  const [held, setHeld] = useState(false)
  const [near, setNear] = useState(false)
  const reduced = useReduced()
  const reducedRef = useRef(reduced); reducedRef.current = reduced
  const movingRef = useRef(false); movingRef.current = !held && !reduced
  const offset = useRef(0), nudge = useRef(0), rate = useRef(0), span = useRef(0)

  const paint = useCallback(() => {
    const t = trackRef.current
    if (!t) return
    const x = reducedRef.current ? 0 : offset.current - span.current
    t.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`
  }, [])

  useLayoutEffect(() => {
    const vp = viewportRef.current, g = groupRef.current
    if (!vp || !g) return
    const measure = () => {
      const w = g.getBoundingClientRect().width
      const loop = w > 0 ? w + gap : 0
      span.current = loop
      offset.current = loop > 0 ? clamp(offset.current, -loop, loop) : 0
      paint()
      const next = reduced || loop <= 0 ? 4 : clamp(Math.ceil(vp.getBoundingClientRect().width / loop) + 3, 4, MAX_COPIES)
      setCopies((p) => (p === next ? p : next))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(vp); ro.observe(g)
    return () => ro.disconnect()
  }, [gap, paint, reduced])

  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return
    const io = new IntersectionObserver((e) => { const x = e[e.length - 1]; if (x) setNear(x.isIntersecting) }, { rootMargin: '96px' })
    io.observe(vp)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (reduced || !near) return
    let frame = 0, last = 0
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0
      last = now
      const loop = span.current
      if (loop <= 0) return
      rate.current += ((movingRef.current ? 1 : 0) - rate.current) * (1 - Math.exp(-dt / RAMP))
      const pull = nudge.current * (1 - Math.exp(-dt / SETTLE))
      nudge.current -= pull
      let x = offset.current - speed * rate.current * dt + pull
      if (rate.current > 0.002 && Math.abs(nudge.current) < 0.25) { nudge.current = 0; x = fold(x, loop) } else x = clamp(x, -loop, loop)
      offset.current = x
      paint()
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [reduced, near, speed, paint])

  useEffect(() => {
    const release = () => setHeld(false)
    window.addEventListener('blur', release)
    return () => window.removeEventListener('blur', release)
  }, [])

  const bind = {
    onPointerEnter: (e: React.PointerEvent) => { if (e.pointerType !== 'touch') setHeld(true) },
    onPointerDown: () => setHeld(true),
    onPointerUp: (e: React.PointerEvent) => { if (e.pointerType === 'touch') setHeld(false) },
    onPointerCancel: () => setHeld(false),
    onPointerLeave: () => setHeld(false),
    onFocus: () => setHeld(true),
    onBlur: () => setHeld(false),
  }
  return { viewportRef, trackRef, groupRef, copies, reduced, bind }
}

const SOLU: { n: string; f: string; h: number; k?: string }[] = [
  { n: 'Bónus', f: 'bonus.webp', h: 1 }, { n: 'Krónan', f: 'kronan.svg', h: .8 }, { n: 'Hagkaup', f: 'hagkaup.svg', h: 1.05 },
  { n: 'Nettó', f: 'netto.svg', h: .8 }, { n: 'Fjarðarkaup', f: 'fjardarkaup.png', h: 1.15 }, { n: 'Samkaup', f: 'samkaup.svg', h: .8 },
  { n: '10-11', f: '1011.png', h: 1.05 }, { n: 'N1', f: 'n1.svg', h: 1.1 }, { n: 'Olís', f: 'olis.svg', h: .85, k: 'flis' },
{ n: 'Kaupfélag Vestur-Húnvetninga', f: 'kvh.svg', h: 1 },
]

export const MERKI_CSS = `
.hb-solu{position:relative;isolation:isolate;overflow:hidden;padding:clamp(1.4rem,2.4vw,2.2rem) 0}
.hb-soluT{margin:0 0 1.1rem;text-align:center;font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;font-weight:500;color:var(--c-ink-med)}
.hb-soluV{overflow-y:hidden;outline:none;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 9%,#000 91%,transparent);mask-image:linear-gradient(90deg,transparent,#000 9%,#000 91%,transparent)}
.hb-soluS{display:flex;width:max-content;align-items:center;will-change:transform}
.hb-soluS ul{display:flex;width:max-content;align-items:center;margin:0;padding:0;list-style:none}
.hb-soluS li{flex:none;display:flex;align-items:center}
.hb-soluS img{display:block;height:calc(clamp(30px,2.6vw,44px) * var(--h,1));width:auto;max-width:9.5rem;object-fit:contain;
  transition:transform .35s var(--ease)}
@media (hover:hover) and (pointer:fine){.hb-soluS li:hover img{transform:scale(1.06)}}
.hb-soluS li.flis{background:#172D4D;border-radius:12px;padding:.45rem .9rem}
.hb-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
`

export function Soluadilar() {
  const gap = 72
  const { viewportRef, trackRef, groupRef, copies, reduced, bind } = useLogoMarquee({ speed: 34, gap })
  const groups = reduced ? 1 : copies
  const live = reduced ? 0 : 1
  return (
    <section className="hb-solu" aria-label="Söluaðilar H-Berg" {...bind}>
      <p className="hb-soluT">Fæst hjá 19 söluaðilum um allt land</p>
      <div ref={viewportRef} className="hb-soluV" tabIndex={reduced ? 0 : undefined} style={{ overflowX: reduced ? 'auto' : 'hidden' }}>
        <div ref={trackRef} className="hb-soluS" style={{ gap }}>
          {Array.from({ length: groups }, (_, c) => (
            <ul key={c} ref={c === live ? groupRef : undefined} aria-hidden={c === live ? undefined : true} style={{ gap }}>
              {SOLU.map((s) => (
                <li key={s.f} className={s.k}>
                  <img src={`${BASE}hberg/solu/${s.f}${V}`} alt="" style={{ ['--h' as string]: s.h }} loading="lazy" decoding="async" />
                  {c === live ? <span className="hb-sr">{s.n}</span> : null}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
