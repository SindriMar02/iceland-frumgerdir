import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { PokaHnappur, poki } from './poki'
import { pop } from './popup'
import { BASE } from './vorur'



export const C = {
  rautt: '#204A8E',
  gull: '#BEA458',
  blek: '#172D4D',
  pappir: '#F1E8D6',
  pappirHreint: '#FAF5EA',
  dokkt: '#102038',
}

export const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

const finePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(hover: hover) and (pointer: fine)').matches === true


export const isCompact = () => typeof window !== 'undefined' && window.innerWidth <= 991
export const isPhone = () => typeof window !== 'undefined' && window.innerWidth <= 479

const D = (n: string) => `${import.meta.env.BASE_URL}hberg/fonts/${n}`


const TOK: [string, string][] = [
  ['--c-bg', '#FAF5EA'], ['--c-el', '#F1E8D6'], ['--c-el2', '#E8DABC'], ['--c-el3', '#DBC8A0'],
  ['--c-ink', '#172D4D'], ['--c-ink-med', 'rgba(23,45,77,.6)'], ['--c-ink-max', 'rgba(23,45,77,.4)'],
  ['--c-btn', '#172D4D'], ['--c-btn-t', '#FAF5EA'], ['--c-btn2', '#FFFDF8'], ['--c-btn2-t', '#172D4D'],
  ['--c-form', '#FFFDF8'], ['--c-rautt', '#204A8E'], ['--c-lina', 'rgba(23,45,77,.14)'],
]

export const CSS = `
@font-face{font-family:'HB Fraunces';src:url('${import.meta.env.BASE_URL}hberg/fonts/fraunces.woff2') format('woff2');
  font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'HB General';src:url('${D('GeneralSans-Regular.woff2')}') format('woff2');
  font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'HB General';src:url('${D('GeneralSans-Medium.woff2')}') format('woff2');
  font-weight:500;font-style:normal;font-display:swap}
@font-face{font-family:'HB General';src:url('${D('GeneralSans-Semibold.woff2')}') format('woff2');
  font-weight:600;font-style:normal;font-display:swap}

${TOK.map(([k, v]) => `@property ${k}{syntax:'<color>';inherits:true;initial-value:${v}}`).join('\n')}


.hb-root{
  ${TOK.map(([k, v]) => `${k}:${v};`).join(' ')}
  --c-gull:#BEA458; --c-hdr:#FFFDF8; --c-hdr-t:#172D4D;
  --c-flotur:var(--c-el);
  --ease:cubic-bezier(.17,.17,0,1);
  --ease-popup:cubic-bezier(.6,0,0,1);
  --ease-cas:cubic-bezier(.2,0,.1,1);
  --f-disp:'HB Fraunces',Georgia,serif;
  
  --gut:2.0833vw;
  --gap:22.2222vh;
  --band:var(--gap);
  --col:1.0417vw;
  background:var(--c-bg); color:var(--c-ink);
  font-family:'HB General',system-ui,sans-serif;
  font-size:clamp(16px,1.0417vw,19px); line-height:1.5;
  -webkit-font-smoothing:antialiased;
  transition:${TOK.map(([k]) => `${k} .6s var(--ease)`).join(',')};
  display:flex;flex-direction:column;row-gap:var(--gap);
  overflow-x:clip;
}
@media (max-width:991px){.hb-root{--gut:2.604vw;--gap:12.121vh;--col:1.302vw}}
@media (max-width:479px){.hb-root{--gut:max(2.778vw,12px);--gap:12.5vh;--col:2.778vw}}
.hb-root > main{display:contents}
.hb-root[data-theme="dark"]{--c-bg:#102038;--c-el:#213855;--c-el2:#2E4663;--c-el3:#3D5671;--c-ink:#FAF5EA;--c-ink-med:rgba(250,245,234,.7);--c-ink-max:rgba(250,245,234,.5);--c-btn:#FAF5EA;--c-btn-t:#172D4D;--c-lina:rgba(250,245,234,.2)}


.hb-root > main + *{margin-top:calc(-1 * var(--gap))}
.hb-root *,.hb-root *::before,.hb-root *::after{box-sizing:border-box}
.hb-root{touch-action:manipulation;-webkit-tap-highlight-color:rgba(211,32,42,.14)}
.hb-root{color-scheme:light}

html:has(.hb-root),body:has(.hb-root){background-color:#FAF5EA}
.hb-root :is(section[id],[id].hb-kafli){scroll-margin-top:calc(var(--haus-h,64px) + .75rem)}
.hb-root img{display:block;max-width:100%;height:auto}
.hb-root a{color:inherit;text-decoration:none}
.hb-root :focus-visible{outline:2px solid var(--c-rautt);outline-offset:3px}
:where(.hb-root) button{font:inherit;color:inherit}


.hb-disp{font-family:var(--f-disp);font-weight:400;letter-spacing:-.03em;line-height:1;
  font-size:4.17vw;margin:0;text-wrap:balance}
@media (max-width:991px){.hb-disp{font-size:6.25vw;line-height:.95}}
@media (max-width:479px){.hb-disp{font-size:min(13.333vw,3.4rem);line-height:.95}}
.hb-sub{font-family:var(--f-disp);font-weight:400;letter-spacing:-.02em;line-height:1.05;
  font-size:2.08vw;margin:0}
@media (max-width:991px){.hb-sub{font-size:3.255vw}}
@media (max-width:479px){.hb-sub{font-size:max(1.35rem,6.4vw)}}
.hb-merki{font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;font-weight:500;
  color:var(--c-ink-med);margin:0 0 1em}
.hb-brod{max-width:52ch;margin:0;color:var(--c-ink)}
.hb-daufur{color:var(--c-ink-med)}
.hb-smatt{font-size:.8rem;line-height:1.45;color:var(--c-ink-med);margin:.25rem 0 0}
.hb-verd{font-variant-numeric:tabular-nums;font-weight:500}
.hb-wrap{padding:0 var(--gut);position:relative}

.hb-midja{text-align:center;margin-left:auto;margin-right:auto}
@media (max-width:479px){.hb-midja{text-align:left;margin-left:0}}


.hb-mask{overflow:hidden;display:block}
.hb-maskP{padding-bottom:.16em;margin-bottom:-.16em}
.hb-maskP > .hb-up{transform:translateY(118%)}
.on .hb-maskP > .hb-up,.hb-maskP.on > .hb-up,.hb-maskP > .hb-up.on{transform:translateY(0)}
.hb-root.hb-allt .hb-maskP > .hb-up{transform:translateY(0)}

.hb-disp .hb-mask,.hb-sub .hb-mask{padding:.13em 0 .17em;margin:-.13em 0 -.17em}
.hb-disp .hb-lina,.hb-sub .hb-lina{transform:translateY(125%)}
.on .hb-disp .hb-lina,.hb-disp.on .hb-lina,.hb-disp .hb-lina.on,
.on .hb-sub .hb-lina,.hb-sub .hb-lina.on{transform:translateY(0)}
.hb-root.hb-allt .hb-disp .hb-lina,.hb-root.hb-allt .hb-sub .hb-lina{transform:translateY(0)}
.hb-up{transform:translateY(100%);transition:transform var(--dur,1s) var(--ease);transition-delay:var(--d,0s);will-change:transform}
.hb-lina{transform:translateY(108%)}
.on .hb-up,.hb-up.on{transform:translateY(0)}

@media (max-width:479px){.hb-hver > * .hb-up,.hb-hver > .hb-up{transition-delay:0s}}


.hb-btn{display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;border:0;cursor:pointer;
  padding:1.042vw 2.865vw;min-height:44px;font-size:.92rem;font-weight:500;
  background:var(--c-btn);color:var(--c-btn-t);transition:transform .15s ease-out}
.hb-btn.sc{background:var(--c-btn2);color:var(--c-btn2-t)}
.hb-btn.stor{width:100%;padding:1.615vw 2.865vw}
.hb-btn:active{transform:scale(.97)}
@media (max-width:991px){.hb-btn{padding:1.628vw 7.161vw}.hb-btn.stor{padding:2.279vw 7.161vw}}
@media (max-width:479px){.hb-btn{padding:3.472vw 9vw}.hb-btn.stor{padding:4.861vw 9vw}}
.hb-btn[disabled]{opacity:.45;cursor:not-allowed}

.hb-hnappur{display:inline-flex;align-items:center;justify-content:center;border:0;cursor:pointer;min-height:48px;padding:0 1.5rem;
  font-size:.95rem;font-weight:500;background:var(--c-btn);color:var(--c-btn-t)}
.hb-hnappur:active{transform:scale(.98)}


.hb-cas{display:inline-block;height:1.25em;line-height:1.25em;overflow:hidden;vertical-align:top}
.hb-casL{display:block;white-space:pre;height:1.25em}
.hb-casL > span{display:inline-block;transition:transform var(--cd,.5s) var(--ease-cas);
  transition-delay:calc(var(--i,0) * var(--cs,.02s))}
@media (hover:hover) and (pointer:fine){
  .hb-casH:hover .hb-casL > span,.hb-casH:focus-visible .hb-casL > span{transform:translateY(-100%)}
}


.hb-nobg{display:inline-flex;align-items:center;gap:.45em;min-height:44px;font-weight:500;cursor:pointer;
  background:none;border:0;padding:0;color:var(--c-ink);transition:color .2s ease-out}
.hb-nobg i{font-style:normal;display:inline-block;transition:transform .2s ease-out}
@media (hover:hover) and (pointer:fine){.hb-nobg:hover{color:var(--c-ink-med)}.hb-nobg:hover i{transform:translateX(.417vw)}}


.hb-haus{position:fixed;z-index:60;top:2.0833vw;left:2.0833vw;right:2.0833vw;
  display:flex;align-items:flex-start;justify-content:space-between;pointer-events:none}
.hb-haus > *{pointer-events:auto}
.hb-merkid{display:inline-flex;line-height:0}
.hb-merkid img{height:clamp(44px,3.6vw,56px);width:auto}
.hb-hausH{display:flex;align-items:center;gap:.5rem;position:relative}
.hb-haus .hb-pokiH{background:var(--c-hdr);color:var(--c-hdr-t);min-height:max(2.5vw,44px);padding:0 1rem}
.hb-nav{display:flex;align-items:stretch;background:var(--c-hdr);color:var(--c-hdr-t);border-radius:999px;
  min-height:max(2.5vw,44px);padding:0 .35rem;box-shadow:0 1px 0 rgba(23,45,77,.06)}
.hb-navL{display:inline-flex;align-items:center;gap:.4rem;padding:0 1rem;font-size:.9rem;font-weight:500;white-space:nowrap;
  border:0;background:none;cursor:pointer;color:inherit;min-height:max(2.5vw,44px)}
.hb-navL svg{transition:transform .2s cubic-bezier(.23,1,.32,1)}
.hb-navL[aria-expanded="true"] svg{transform:rotate(180deg)}
.hb-navH{position:relative;display:flex}

.hb-fell{position:absolute;top:calc(100% + .5rem);left:0;min-width:15.5rem;background:var(--c-hdr);color:var(--c-hdr-t);
  border-radius:var(--r,14px);padding:.45rem;box-shadow:0 18px 40px -12px rgba(23,45,77,.28),0 0 0 1px rgba(23,45,77,.06);
  opacity:0;transform:translateY(-6px);transform-origin:top left;visibility:hidden;
  transition:opacity .18s ease-out,transform .2s cubic-bezier(.23,1,.32,1),visibility 0s .2s}
.hb-fell.opid{opacity:1;transform:none;visibility:visible;transition:opacity .18s ease-out,transform .2s cubic-bezier(.23,1,.32,1),visibility 0s}
.hb-fell a,.hb-fell button{display:flex;flex-direction:column;align-items:flex-start;width:100%;padding:.6rem .75rem;
  border:0;background:none;cursor:pointer;color:inherit;text-align:left;border-radius:calc(var(--r,14px) - 4px);font-size:.92rem}
.hb-fell small{font-size:.78rem;color:color-mix(in srgb,var(--c-hdr-t) 58%,transparent)}
@media (hover:hover) and (pointer:fine){.hb-fell a:hover,.hb-fell button:hover{background:var(--c-el)}}
.hb-fell a:focus-visible,.hb-fell button:focus-visible{outline:2px solid var(--c-rautt);outline-offset:-2px}
.hb-braud{display:none;width:44px;height:44px;border:0;background:var(--c-hdr);cursor:pointer;
  place-items:center;padding:0;flex:none;color:var(--c-hdr-t)}
.hb-braud span{position:relative;width:18px;height:10px;display:block}
.hb-braud i{position:absolute;left:0;right:0;height:1.5px;background:currentColor;display:block;
  transition:translate .2s var(--ease) .2s,rotate .2s var(--ease) 0s,opacity .1s linear .2s}
.hb-braud i:nth-child(1){top:0}.hb-braud i:nth-child(2){top:4.25px}.hb-braud i:nth-child(3){top:8.5px}
.hb-haus.opin .hb-braud i{transition:translate .2s var(--ease) 0s,rotate .2s var(--ease) .2s,opacity .1s linear 0s}
.hb-haus.opin .hb-braud i:nth-child(1){translate:0 4.25px;rotate:-45deg}
.hb-haus.opin .hb-braud i:nth-child(2){opacity:0}
.hb-haus.opin .hb-braud i:nth-child(3){translate:0 -4.25px;rotate:-135deg}


.hb-panK{position:absolute;top:100%;right:0;overflow:hidden;pointer-events:none;display:none}
.hb-pan{pointer-events:auto;background:var(--c-hdr);color:var(--c-hdr-t);transform:translateY(-101%);
  visibility:hidden;transition:transform .4s var(--ease),visibility 0s .4s}
.hb-pan.opid{transform:none;visibility:visible;transition:transform .4s var(--ease),visibility 0s}

@media (max-width:991px){
  .hb-haus{top:0;left:0;right:0;align-items:center;padding:calc(.5rem + env(safe-area-inset-top)) var(--gut) .5rem;
    background:color-mix(in srgb,var(--c-bg) 90%,transparent);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
    box-shadow:inset 0 -1px 0 var(--c-lina);pointer-events:auto}
  .hb-merkid img{height:44px}
  .hb-hausH{position:static}
  .hb-nav{display:none}
  .hb-haus .hb-pokiH{background:transparent;color:var(--c-ink);padding:0 .3rem}
  .hb-braud{display:grid}
  .hb-panK{display:grid;left:0;right:0;top:100%}
}
.hb-valPan{padding:.6rem var(--gut) calc(1rem + env(safe-area-inset-bottom));max-height:calc(100svh - 64px);overflow:auto;
  overscroll-behavior:contain}
.hb-valKort{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-bottom:.6rem}
.hb-valKort a{background:var(--c-el);display:flex;flex-direction:column;align-items:center;gap:.4rem;padding:.9rem .5rem .7rem;
  font-size:.86rem;color:var(--c-hdr-t);border-radius:var(--r,14px)}
.hb-valKort img{height:96px;width:auto;object-fit:contain}
.hb-valHop{margin:.9rem 0 .35rem;font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;font-weight:500;
  color:color-mix(in srgb,var(--c-hdr-t) 55%,transparent)}
.hb-valRod{display:grid;gap:2px}
.hb-valRod a{display:flex;align-items:center;min-height:52px;padding:0 .9rem;background:var(--c-el);overflow:hidden;border-radius:10px}
.hb-valRod a span{display:block;transform:translateY(105%);transition:transform .2s cubic-bezier(.4,0,1,1)}
.hb-pan.opid .hb-valRod a span{transform:none;transition:transform .55s var(--ease);transition-delay:calc(.08s + var(--i,0) * .04s)}
.hb-valPan .hb-btn{margin-top:.9rem}


.hb-bendill{position:fixed;top:0;left:0;z-index:90;pointer-events:none;border-radius:999px;
  display:grid;place-items:center;color:var(--c-btn-t);width:8.854vw;height:8.854vw;margin:-4.427vw 0 0 -4.427vw;
  font-size:.92rem;font-weight:500;will-change:transform}
.hb-bendill i{display:block;position:absolute;inset:0;border-radius:inherit;background:var(--c-btn);
  transform:scale(.1177);transition:transform .4s var(--ease),background .4s var(--ease)}
.hb-bendill.stor i{transform:scale(1)}
.hb-bendill.yta i{transform:scale(.106)}
.hb-bendill.stor.yta i{transform:scale(.9)}
.hb-bendill b{position:relative;font-weight:500;opacity:0;transition:opacity .25s var(--ease)}
.hb-bendill.stor b{opacity:1}
@media (hover:none),(pointer:coarse){.hb-bendill{display:none}}

@media (prefers-reduced-motion:reduce){
  .hb-root *{transition-duration:.15s !important;animation-duration:.15s !important}
  .hb-up{transform:none !important}
}
.hb-root.hb-allt .hb-up{transform:translateY(0)}
`


export function useWatchdog(ms = 12000) {
  useEffect(() => {
    const t = window.setTimeout(() => {
      document.querySelector('.hb-root')?.classList.add('hb-allt')
    }, ms)
    return () => window.clearTimeout(t)
  }, [ms])
}


export function useInview<T extends HTMLElement>(margin = '0px 0px -12% 0px', hver = false) {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced()) { el.classList.add('on'); return }
    
    if (hver && isPhone()) {
      const kids = [...el.children] as HTMLElement[]
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target) } })
      }, { rootMargin: margin, threshold: 0 })
      kids.forEach((k) => io.observe(k))
      return () => io.disconnect()
    }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('on'); io.disconnect() } },
      { rootMargin: margin, threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [margin, hver])
  return ref
}

export function Reveal({ as: Tag = 'div', className = '', children, style, hver = false, margin, id }: {
  as?: 'div' | 'section' | 'article' | 'ul' | 'li' | 'header' | 'footer' | 'figure'
  className?: string; children: ReactNode; style?: CSSProperties; hver?: boolean; margin?: string; id?: string
}) {
  const ref = useInview<HTMLDivElement>(margin, hver)
  return (
    <Tag ref={ref as never} id={id} className={`${className}${hver ? ' hb-hver' : ''}`} style={style}>{children}</Tag>
  )
}


const isTouch = () => !finePointer()
type LenisLike = { raf: (t: number) => void; destroy: () => void; scrollTo: (t: number | Element, o?: object) => void; stop: () => void; start: () => void; resize: () => void;
  on: (e: 'scroll' | 'virtual-scroll', f: () => void) => () => void; readonly isScrolling: false | 'smooth' | 'native' }
export const lenisOf = () => (window as unknown as { __hbLenis?: LenisLike }).__hbLenis

export function useMjukSkrun() {
  useEffect(() => {
    if (reduced()) return
    if (isTouch()) return
    let lifandi = true
    let raf = 0
    let lenis: LenisLike | null = null
    void import('lenis').then(({ default: Lenis }) => {
      if (!lifandi) return
      lenis = isTouch() ? null : (new Lenis({ duration: 3, smoothWheel: true, gestureOrientation: 'vertical', allowNestedScroll: true }) as unknown as LenisLike)
      if (!lenis) return
      lenis.scrollTo(0, { immediate: true })
      ;(window as unknown as { __hbLenis?: unknown }).__hbLenis = lenis
      
      if (document.querySelector('.hb-root.hb-hled')) lenis.stop()
      
      let still = 0
      const tikk = (t: number) => {
        raf = 0
        if (!lenis) return
        lenis.raf(t)
        still = lenis.isScrolling ? 0 : still + 1
        
        if (still < 20 && !raf) raf = requestAnimationFrame(tikk)
      }
      const wake = () => { still = 0; if (!raf && lifandi) raf = requestAnimationFrame(tikk) }
      const l = lenis
      const scrollTo = l.scrollTo.bind(l), start = l.start.bind(l)
      l.scrollTo = (a, o) => { scrollTo(a, o); wake() }
      l.start = () => { start(); wake() }
      l.on('virtual-scroll', wake)
      l.on('scroll', wake)
      wake()
    })
    return () => {
      lifandi = false; cancelAnimationFrame(raf); lenis?.destroy()
      delete (window as unknown as { __hbLenis?: unknown }).__hbLenis
    }
  }, [])
}


export const step = (i: number): CSSProperties => ({ ['--d' as string]: `${(i * 0.12).toFixed(2)}s` })


export function Ord({ text, className = '', tag: Tag = 'h2', hold = 0, id }: {
  text: string; className?: string; tag?: 'h1' | 'h2' | 'h3'; hold?: number; id?: string
}) {
  const lines = text.split(' | ')
  return (
    <Tag className={className} id={id}>
      {lines.map((l, i) => (
        <span className="hb-mask" key={l + i}>
          <span className="hb-up hb-lina" style={{ ['--d' as string]: `${(hold + i * 0.12).toFixed(2)}s` }}>{l}</span>
        </span>
      ))}
    </Tag>
  )
}

export function Merki({ children }: { children: ReactNode }) {
  return <p className="hb-merki"><span className="hb-mask"><span className="hb-up">{children}</span></span></p>
}


export function Cas({ t }: { t: string }) {
  const ch = [...t]
  const n = Math.max(1, ch.length)
  const k = n >= 5 ? 1 : Math.min(0.8, Math.max(0.45, n / 5))
  const st = (0.15 * k) / n
  const line = ch.map((c, i) => <span key={i} style={{ ['--i' as string]: i }}>{c === ' ' ? ' ' : c}</span>)
  return (
    <span className="hb-cas" style={{ ['--cd' as string]: `${(0.5 * k).toFixed(3)}s`, ['--cs' as string]: `${st.toFixed(4)}s` }}>
      <span className="hb-casL">{line}</span>
      <span className="hb-casL" aria-hidden="true">{line}</span>
    </span>
  )
}


export function Bendill() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [ord, setOrd] = useState('')
  const [yta, setYta] = useState(false)
  useEffect(() => {
    if (!finePointer() || reduced()) return
    const el = ref.current
    if (!el) return
    let x = -200, y = -200, cx = -200, cy = -200, raf = 0, idle = 0, har = false
    const tick = () => {
      cx += (x - cx) * 0.18
      cy += (y - cy) * 0.18
      el.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)`
      raf = Math.abs(x - cx) > 0.3 || Math.abs(y - cy) > 0.3 ? requestAnimationFrame(tick) : 0
    }
    const lesa = () => {
      if (!har) return
      const t = (document.elementFromPoint(x, y) as HTMLElement | null)?.closest?.('[data-bendill]') as HTMLElement | null
      setOrd(t?.dataset.bendill ?? '')
    }
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY; har = true
      if (!raf) raf = requestAnimationFrame(tick)
      const t = (e.target as HTMLElement)?.closest?.('[data-bendill]') as HTMLElement | null
      setOrd(t?.dataset.bendill ?? '')
    }
    const skrun = () => {
      requestAnimationFrame(() => requestAnimationFrame(lesa))
      window.clearTimeout(idle); idle = window.setTimeout(lesa, 120)
    }
    const nidur = () => { setYta(true); window.setTimeout(() => setYta(false), 200) }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('scroll', skrun, { passive: true })
    window.addEventListener('pointerdown', nidur, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move); window.removeEventListener('scroll', skrun)
      window.removeEventListener('pointerdown', nidur); cancelAnimationFrame(raf); window.clearTimeout(idle)
    }
  }, [])
  return (
    <div className={`hb-bendill${ord ? ' stor' : ''}${yta ? ' yta' : ''}`} ref={ref} aria-hidden="true">
      <i /><b>{ord}</b>
    </div>
  )
}


export const inertNar = (lokad: boolean) => (el: HTMLElement | null) => { el?.toggleAttribute('inert', lokad) }

const Ör = () => (
  <svg width="9" height="6" viewBox="0 0 9 6" aria-hidden="true"><path d="M1 1l3.5 3.5L8 1" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>
)


type NavLina = { h: string; t: string; d?: string; poki?: boolean; fn?: () => void }
const HOPAR: { t: string; id: string; rows: NavLina[] }[] = [
  { t: 'Vörur', id: 'vorur', rows: [
    { h: '#linur', t: 'Allar vörulínur', d: 'Hnetur, ávextir, fræ og hnetusmjör' },
    { h: '#vorur', t: 'Hnetur og ávextir', d: 'Tegundir og innihald' },
    { h: '#ofnaemi', t: 'Ofnæmisvaldar', d: 'Skoðaðu innihaldið' },
    { h: '#hvar', t: 'Hvar fæst H-Berg', d: 'Söluaðilar H-Berg', fn: () => pop.open({ k: 'hvar' }) },
  ] },
  { t: 'H-Berg', id: 'hberg', rows: [
    { h: '#poki', t: 'Pöntun fyrir verslanir', d: 'Pöntunarlisti fyrir fyrirtæki', poki: true },
    { h: '#staerra', t: 'Stærri pakkningar', d: 'Fyrir matvælafyrirtæki og stóreldhús', fn: () => pop.open({ k: 'staerra' }) },
    { h: '#um', t: 'Um okkur', d: 'Fjölskyldufyrirtæki frá 2007' },
    { h: '#saga', t: 'Gamalt og nýtt' },
    { h: '#spurt', t: 'Spurt og svarað' },
  ] },
]
const SAMBAND: NavLina = { h: '#erindi', t: 'Hafa samband' }

export function faraA(href: string) {
  const mark = document.querySelector(href)
  if (!mark) return
  const haus = document.querySelector('.hb-haus')
  const offset = isCompact() ? -((haus?.getBoundingClientRect().height ?? 60) + 12) : -24
  const l = lenisOf()
  if (l) l.scrollTo(mark, { offset })
  else window.scrollTo({ top: mark.getBoundingClientRect().top + window.scrollY + offset, behavior: reduced() ? 'auto' : 'smooth' })
  history.replaceState(null, '', href)
}


export function Haus() {
  const [opid, setOpid] = useState<string | null>(null)
  const haus = useRef<HTMLElement | null>(null)
  const loka = useRef(0)
  const valmynd = opid === 'valmynd'

  useEffect(() => {
    if (!opid) return
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      const hver = opid
      setOpid(null)
      haus.current?.querySelector<HTMLElement>(`[aria-controls="hb-fell-${hver}"],.hb-braud`)?.focus()
    }
    const ut = (e: PointerEvent) => { if (!haus.current?.contains(e.target as Node)) setOpid(null) }
    window.addEventListener('keydown', key)
    window.addEventListener('pointerdown', ut)
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('pointerdown', ut) }
  }, [opid])

  useEffect(() => {
    const publish = () => {
      const h = haus.current?.getBoundingClientRect().height
      if (h) (document.querySelector('.hb-root') as HTMLElement | null)?.style.setProperty('--haus-h', `${Math.round(h)}px`)
    }
    publish()
    window.addEventListener('resize', publish)
    return () => window.removeEventListener('resize', publish)
  }, [])

  const fara = (e: MouseEvent<HTMLElement>, l: NavLina) => {
    e.preventDefault()
    const compact = isCompact()
    setOpid(null)
    if (l.poki) { window.setTimeout(() => poki.open(true), compact ? 400 : 0); return }
    if (l.fn) { window.setTimeout(l.fn, compact ? 400 : 0); return }
    window.setTimeout(() => faraA(l.h), compact ? 400 : 0)
  }
  
  const inn = (id: string) => { if (!finePointer()) return; window.clearTimeout(loka.current); setOpid(id) }
  const ut = () => { if (!finePointer()) return; window.clearTimeout(loka.current); loka.current = window.setTimeout(() => setOpid((v) => (v === 'valmynd' ? v : null)), 180) }

  return (
    <header ref={haus} className={`hb-haus${valmynd ? ' opin' : ''}`}>
      <a className="hb-merkid" href="#top" aria-label="H-Berg, á forsíðu"
        onClick={(e) => { e.preventDefault(); setOpid(null); const l = lenisOf(); if (l) l.scrollTo(0); else window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }) }}>
        <img src={`${import.meta.env.BASE_URL}hberg/brand/logo.svg`} alt="H-Berg" width={460} height={212} decoding="async" />
      </a>
      <div className="hb-hausH">
        <nav className="hb-nav" aria-label="Aðalvalmynd">
          {HOPAR.map((g) => (
            <div className="hb-navH" key={g.id} onPointerEnter={() => inn(g.id)} onPointerLeave={ut}>
              <button className="hb-navL" aria-expanded={opid === g.id} aria-controls={`hb-fell-${g.id}`}
                onClick={(e) => {setOpid(opid === g.id ? null : g.id); const key=e.detail===0; window.setTimeout(()=>{ const p=document.getElementById(`hb-fell-${g.id}`); (key?p?.querySelector<HTMLElement>('a'):p)?.focus({preventScroll:true})},30)}}>
                {g.t}<Ör />
              </button>
              <div id={`hb-fell-${g.id}`} tabIndex={-1} className={`hb-fell${opid === g.id ? ' opid' : ''}`}>
                {g.rows.map((r) => (
                  <a key={r.h} href={r.h} tabIndex={opid === g.id ? 0 : -1} onClick={(e) => fara(e, r)}>
                    {r.t}{r.d ? <small>{r.d}</small> : null}
                  </a>
                ))}
              </div>
            </div>
          ))}
          <a className="hb-navL hb-casH" href={SAMBAND.h} onClick={(e) => fara(e, SAMBAND)}><Cas t={SAMBAND.t} /></a>
        </nav>
        <PokaHnappur />
        <button className="hb-braud" aria-expanded={valmynd} aria-controls="hb-valPan"
          aria-label={valmynd ? 'Loka valmynd' : 'Opna valmynd'} onClick={(e) => { setOpid(valmynd ? null : 'valmynd'); if (!valmynd) { const key=e.detail===0; window.setTimeout(()=>{const p=document.getElementById('hb-valPan'); (key?p?.querySelector<HTMLElement>('a'):p)?.focus({preventScroll:true})},30) } }}>
          <span><i /><i /><i /></span>
        </button>
        <div className="hb-panK">
          <div id="hb-valPan" tabIndex={-1} className={`hb-pan hb-valPan${valmynd ? ' opid' : ''}`}>
            <div className="hb-valKort">
              <a href="#vorur" onClick={(e) => fara(e, { h: '#vorur', t: '' })}>
                <img src={`${BASE}hberg/laus/p00.webp`} alt="" width={128} height={128} style={{ height: 64, width: 'auto' }} />Hnetur
              </a>
              <a href="#vorur" onClick={(e) => fara(e, { h: '#vorur', t: '' })}>
                <img src={`${BASE}hberg/laus/p06.webp`} alt="" width={128} height={128} style={{ height: 64, width: 'auto' }} />Ávextir
              </a>
            </div>
            {HOPAR.map((g, gi) => (
              <div key={g.id}>
                <p className="hb-valHop">{g.t}</p>
                <div className="hb-valRod">
                  {g.rows.map((r, i) => (
                    <a key={r.h} href={r.h} tabIndex={valmynd ? 0 : -1} style={{ ['--i' as string]: gi * 4 + i }} onClick={(e) => fara(e, r)}><span>{r.t}</span></a>
                  ))}
                </div>
              </div>
            ))}
            <div className="hb-valRod" style={{ marginTop: '.9rem' }}>
              <a href={SAMBAND.h} tabIndex={valmynd ? 0 : -1} style={{ ['--i' as string]: 11 }} onClick={(e) => fara(e, SAMBAND)}><span>{SAMBAND.t}</span></a>
            </div>
            <button className="hb-btn stor" tabIndex={valmynd ? 0 : -1} onClick={() => { setOpid(null); window.setTimeout(() => poki.open(true), 400) }}>Opna pöntunarlistann</button>
          </div>
        </div>
      </div>
    </header>
  )
}
