import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { ChevronDown, ClipboardList, Menu, Search, X } from 'lucide-react'
import { blekOn, stada, tintLina, useStada } from './state'
import { VORUR, type Vara } from './vorur'
import { KOPAL_LITIR } from './farbe/litir'

/* Málning. The Katla/noho motion system (Lenis with a sleeping loop, mask-rise
   reveals, one custom ease) under a Wellina-style skin: charcoal pill header,
   white canvas, soft grey cards, a serif display and a quiet grotesque. The one
   accent is the visitor's own colour: --tint. See _docs/MALNING-DESIGN-2026-09-29.md.

   Two rules carry the motion:
     1. Nothing fades. Every reveal is y:+ownHeight -> 0 inside a clipped parent.
     2. One ease does almost everything: cubic-bezier(.17,.17,0,1). */

export const C = { blek: '#222221', hvitt: '#FFFFFF', kort: '#F2F2F1', tint0: '#8FA2B0' }

export const B = import.meta.env.BASE_URL
export const M = (p: string) => `${B}malning/${p}`
export const foto = (n: string, w: 640 | 1280 | 1920) => M(`ph/${n}-${w}.webp`)
export const vaMynd = (id: string, w: 480 | 800 = 800) => M(`vorur/${id}-${w}.webp`)

export const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
export const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(hover: hover) and (pointer: fine)').matches === true
const isTouch = () => !finePointer()
export const isCompact = () => typeof window !== 'undefined' && window.innerWidth <= 991
export const isPhone = () => typeof window !== 'undefined' && window.innerWidth <= 479

const F = (n: string) => M(`fonts/${n}`)

export const CSS = `
@font-face{font-family:'MAL Serif';src:url('${F('instrument-serif-400.woff2')}') format('woff2');font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'MAL Serif';src:url('${F('instrument-serif-400-italic.woff2')}') format('woff2');font-weight:400;font-style:italic;font-display:swap}
@font-face{font-family:'MAL Sans';src:url('${F('hanken-400.woff2')}') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'MAL Sans';src:url('${F('hanken-500.woff2')}') format('woff2');font-weight:500;font-display:swap}
@font-face{font-family:'MAL Sans';src:url('${F('hanken-600.woff2')}') format('woff2');font-weight:600;font-display:swap}
@font-face{font-family:'MAL Sans';src:url('${F('hanken-700.woff2')}') format('woff2');font-weight:700;font-display:swap}

@property --tint{syntax:'<color>';inherits:true;initial-value:${C.tint0}}
@property --tint-ink{syntax:'<color>';inherits:true;initial-value:${C.blek}}
@property --tint-lina{syntax:'<color>';inherits:true;initial-value:${C.tint0}}

html:has(.mal-root),body:has(.mal-root){background-color:#fff}
html:has(.mal-root){scroll-padding-top:96px}
.mal-root{--ink:${C.blek};--bg:#fff;--kort:${C.kort};--kort2:#E9E9E7;--lina:rgba(34,34,33,.14);--mute:rgba(34,34,33,.66);
  --tint:${C.tint0};--tint-ink:${C.blek};--tint-lina:${C.tint0};
  --disp:'MAL Serif',Georgia,'Times New Roman',serif;--sans:'MAL Sans',system-ui,-apple-system,'Segoe UI',sans-serif;
  --ease:cubic-bezier(.17,.17,0,1);--skuff:cubic-bezier(.32,.72,0,1);--r:24px;--rs:16px;
  --gutter:clamp(16px,3.4vw,48px);
  background:var(--bg);color:var(--ink);font-family:var(--sans);font-size:16px;line-height:1.55;
  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;overflow-x:clip;
  transition:--tint .7s var(--ease),--tint-ink .7s var(--ease),--tint-lina .7s var(--ease)}
.mal-root *,.mal-root *::before,.mal-root *::after{box-sizing:border-box}
.mal-root img{max-width:100%;display:block}
:where(.mal-root) button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
:where(.mal-root) a{color:inherit}
.mal-root{color-scheme:light;-webkit-tap-highlight-color:transparent}
:where(.mal-root) :is(button,a,input,select,textarea,summary,label){touch-action:manipulation}
.mal-root :is(h1,h2,h3,.mal-h1){text-wrap:balance}
.mal-root :focus-visible{outline:2px solid var(--ink);outline-offset:3px;border-radius:6px}
.mal-root .mal-bl :focus-visible,.mal-haus :focus-visible,.mal-fot :focus-visible{outline-color:#fff}
.mal-skip{position:fixed;left:16px;top:-80px;z-index:200;background:var(--ink);color:#fff;padding:12px 18px;border-radius:12px;transition:top .2s}
.mal-skip:focus{top:16px}

/* ---- reveal: nothing fades, everything rises out of its own mask ---- */
.mal-mask{display:block;overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em}
.mal-up{display:block;transform:translateY(112%);transition:transform 1s var(--ease);transition-delay:var(--d,0s)}
.on .mal-up,.mal-up.on,.mal-allt .mal-up{transform:none}
.mal-rise{transform:translateY(34px);opacity:1;transition:transform 1s var(--ease);transition-delay:var(--d,0s)}
.on.mal-rise,.on .mal-rise,.mal-allt .mal-rise{transform:none}

/* ---- buttons ---- */
.mal-knappur{display:inline-flex;align-items:center;gap:14px;height:52px;padding:0 8px 0 24px;border-radius:999px;
  background:var(--tint);color:var(--tint-ink);font-weight:600;font-size:15px;letter-spacing:.01em;
  transition:transform .2s var(--ease),background .7s var(--ease),color .7s var(--ease)}
.mal-knappur i{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;background:var(--ink);color:#fff;flex:none;
  transition:transform .35s var(--ease)}
.mal-knappur:active{transform:scale(.97)}
.mal-knappur.dokkur{background:var(--ink);color:#fff}
.mal-knappur.dokkur i{background:var(--tint);color:var(--tint-ink)}
.mal-knappur.hljodur{background:var(--kort);color:var(--ink)}
.mal-knappur.hljodur i{background:var(--ink);color:#fff}
@media (hover:hover) and (pointer:fine){.mal-knappur:hover i{transform:translateX(3px)}}
.mal-hring{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:var(--ink);color:#fff;flex:none;
  transition:transform .2s var(--ease),background .7s var(--ease),color .7s var(--ease)}
.mal-hring:active{transform:scale(.93)}
.mal-hring.ljos{background:#fff;color:var(--ink);box-shadow:inset 0 0 0 1px var(--lina)}
.mal-pilla{display:inline-flex;align-items:center;height:44px;padding:0 18px;border-radius:999px;background:transparent;font-size:14px;font-weight:500;
  color:var(--ink);transition:background .25s var(--ease),color .25s var(--ease)}
.mal-pilla[aria-pressed=true],.mal-pilla.virk{background:var(--kort2)}
@media (hover:hover) and (pointer:fine){.mal-pilla:hover{background:var(--kort)}}

/* ---- header: a charcoal pill floating over the hero ---- */
.mal-haus{position:fixed;z-index:70;top:22px;left:0;right:0;margin-inline:auto;width:min(calc(100% - 2*var(--gutter)),1500px);
  height:60px;border-radius:var(--rs);background:var(--ink);color:#fff;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;
  padding:0 12px 0 10px}
.mal-hausV{display:flex;align-items:center;gap:2px;min-width:0}
.mal-hausH{display:flex;align-items:center;justify-content:flex-end;gap:6px;min-width:0}
.mal-hopur{position:relative}
.mal-hopurT{display:flex;align-items:center;gap:6px;height:44px;padding:0 14px;border-radius:12px;font-size:15px;font-weight:500;color:#fff;
  transition:background .2s var(--ease)}
.mal-hopurT svg{transition:transform .3s var(--ease)}
.mal-hopurT[aria-expanded=true] svg{transform:rotate(180deg)}
@media (hover:hover) and (pointer:fine){.mal-hopurT:hover{background:rgba(255,255,255,.1)}}
.mal-merki{display:flex;align-items:center;width:118px;min-height:44px;color:#fff}
.mal-merki img{width:100%;height:auto}
.mal-fell{position:absolute;left:0;top:calc(100% + 14px);min-width:320px;background:#fff;color:var(--ink);border-radius:var(--r);padding:8px;
  box-shadow:0 24px 60px -18px rgba(34,34,33,.28),0 0 0 1px var(--lina);opacity:0;transform:translateY(-6px);pointer-events:none;visibility:hidden;
  transition:opacity .2s var(--ease),transform .2s var(--ease),visibility 0s .2s}
.mal-hopur.opid .mal-fell{opacity:1;transform:none;pointer-events:auto;visibility:visible;transition:opacity .2s var(--ease),transform .2s var(--ease)}
.mal-fell a,.mal-fell button.mal-fellL{display:flex;align-items:center;gap:14px;width:100%;text-align:left;padding:10px 12px;border-radius:16px;text-decoration:none;
  transition:background .2s var(--ease)}
@media (hover:hover) and (pointer:fine){.mal-fell a:hover{background:var(--kort)}}
.mal-fellM{flex:none;width:52px;height:52px;border-radius:12px;background:var(--kort);display:grid;place-items:center;overflow:hidden}
.mal-fellM img{width:84%;height:84%;object-fit:contain;mix-blend-mode:multiply}
.mal-fell b{display:block;font-weight:600;font-size:15px;line-height:1.25}
.mal-fell span{display:block;font-size:13px;color:var(--mute);line-height:1.35}
.mal-leit{position:relative;display:flex;align-items:center}
.mal-leit input{width:230px;height:44px;border:0;background:transparent;color:#fff;font:inherit;font-size:15px;padding:0 44px 0 10px;text-align:right;border-radius:12px}
.mal-leit input::placeholder{color:rgba(255,255,255,.72)}
.mal-leit input:focus{outline:none;background:rgba(255,255,255,.08)}
.mal-leit .lupa{position:absolute;right:12px;pointer-events:none;color:#fff}
.mal-tillog{position:absolute;right:0;top:calc(100% + 14px);width:min(420px,88vw);background:#fff;color:var(--ink);border-radius:var(--r);padding:8px;
  box-shadow:0 24px 60px -18px rgba(34,34,33,.28),0 0 0 1px var(--lina);max-height:70vh;overflow:auto}
.mal-tillog button{display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:8px 10px;border-radius:14px}
.mal-tillog button[aria-selected=true]{background:var(--kort)}
@media (hover:hover) and (pointer:fine){.mal-tillog button:hover{background:var(--kort)}}
.mal-tillog .dott{width:28px;height:28px;border-radius:8px;flex:none;box-shadow:inset 0 0 0 1px var(--lina)}
.mal-tillog em{font-style:normal;font-size:12px;color:var(--mute);margin-left:auto}
.mal-verkT{position:relative;display:grid;place-items:center;width:44px;height:44px;border-radius:12px;color:#fff;transition:background .2s var(--ease)}
@media (hover:hover) and (pointer:fine){.mal-verkT:hover{background:rgba(255,255,255,.1)}}
.mal-tala{position:absolute;top:2px;right:0;min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:var(--tint);color:var(--tint-ink);
  font-size:12px;font-weight:700;display:grid;place-items:center;line-height:1;transition:background .7s var(--ease),color .7s var(--ease)}
.mal-burger{display:none}
.mal-valmynd{display:none}
@media (max-width:991px){
  .mal-haus{grid-template-columns:auto 1fr auto;top:14px;height:56px}
  .mal-hausV{display:none}
  .mal-burger{display:grid;place-items:center;width:44px;height:44px;border-radius:12px;color:#fff}
  .mal-merki{width:104px;justify-self:center}
  .mal-leit{display:none}
  .mal-valmynd{display:block;position:fixed;z-index:69;left:var(--gutter);right:var(--gutter);top:80px;bottom:16px;background:#fff;color:var(--ink);border-radius:var(--r);
    padding:18px 14px 22px;overflow:auto;overscroll-behavior:contain;box-shadow:0 30px 80px -20px rgba(34,34,33,.4),0 0 0 1px var(--lina);
    opacity:0;transform:translateY(-8px);pointer-events:none;visibility:hidden;transition:opacity .25s var(--ease),transform .25s var(--ease),visibility 0s .25s}
  .mal-valmynd.opid{opacity:1;transform:none;pointer-events:auto;visibility:visible;transition:opacity .25s var(--ease),transform .25s var(--ease)}
  .mal-valmynd h3{margin:14px 8px 6px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);font-weight:600}
  .mal-valmynd a{display:flex;align-items:center;gap:14px;padding:12px 8px;border-radius:14px;text-decoration:none;min-height:56px}
  .mal-valmynd a b{display:block;font-weight:600}
  .mal-valmynd a span{display:block;font-size:13px;color:var(--mute)}
}
@media (max-width:479px){.mal-merki{width:96px}.mal-haus{height:54px}}

@media (prefers-reduced-motion:reduce){
  .mal-root *,.mal-root *::before,.mal-root *::after{animation-duration:.01ms !important;transition-duration:.01ms !important;scroll-behavior:auto !important}
  .mal-up,.mal-rise{transform:none !important}
}
`

/* ---------------------------------------------------------------- *
 * Reveal. IntersectionObserver, never a scroll listener.
 * ---------------------------------------------------------------- */
export function useWatchdog(ms = 12000) {
  useEffect(() => {
    const t = window.setTimeout(() => { document.querySelector('.mal-root')?.classList.add('mal-allt') }, ms)
    return () => window.clearTimeout(t)
  }, [ms])
}

export function useInview<T extends HTMLElement>(margin = '0px 0px -12% 0px') {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced()) { el.classList.add('on'); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('on'); io.disconnect() } }, { rootMargin: margin, threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [margin])
  return ref
}

export function Reveal({ as: Tag = 'div', className = '', children, style, margin, id }: {
  as?: 'div' | 'section' | 'article' | 'ul' | 'li' | 'header' | 'footer' | 'figure'
  className?: string; children: ReactNode; style?: CSSProperties; margin?: string; id?: string
}) {
  const ref = useInview<HTMLDivElement>(margin)
  return <Tag ref={ref as never} id={id} className={className} style={style}>{children}</Tag>
}

/** A headline split to lines (separator " | "), each rising out of its own mask. Wrap a word in *asterisks* for the italic. */
export function Ord({ text, className = '', tag: Tag = 'h2', hold = 0, id }: {
  text: string; className?: string; tag?: 'h1' | 'h2' | 'h3'; hold?: number; id?: string
}) {
  const lines = text.split(' | ')
  const ref = useInview<HTMLElement>('0px 0px -8% 0px')
  return (
    <Tag ref={ref as never} className={className} id={id}>
      {lines.map((l, i) => (
        <span className="mal-mask" key={l + i}>
          <span className="mal-up" style={{ ['--d' as string]: `${(hold + i * 0.12).toFixed(2)}s` }}>
            {l.split(/(\*[^*]+\*)/).map((p, j) => (p.startsWith('*') ? <em key={j}>{p.slice(1, -1)}</em> : p))}
          </span>
        </span>
      ))}
    </Tag>
  )
}

export const step = (i: number): CSSProperties => ({ ['--d' as string]: `${(i * 0.08).toFixed(2)}s` })

/* ------------------------------------------------------------------
   The scroll: Lenis at duration 3, fine pointers only. The loop sleeps when
   Lenis is still (Katla lag purge 2026-09-28: 0 style passes at rest).
   ------------------------------------------------------------------ */
type LenisLike = { raf: (t: number) => void; destroy: () => void; scrollTo: (t: number | Element, o?: object) => void; stop: () => void; start: () => void; resize: () => void;
  on: (e: 'scroll' | 'virtual-scroll', f: () => void) => () => void; readonly isScrolling: false | 'smooth' | 'native' }
export const lenisOf = () => (window as unknown as { __malLenis?: LenisLike }).__malLenis

export function useMjukSkrun() {
  useEffect(() => {
    if (reduced() || isTouch()) return
    let lifandi = true
    let raf = 0
    let lenis: LenisLike | null = null
    void import('lenis').then(({ default: Lenis }) => {
      if (!lifandi) return
      lenis = isTouch() ? null : (new Lenis({ duration: 2.2, smoothWheel: true, gestureOrientation: 'vertical', allowNestedScroll: true }) as unknown as LenisLike)
      if (!lenis) return
      lenis.scrollTo(0, { immediate: true })
      ;(window as unknown as { __malLenis?: unknown }).__malLenis = lenis
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
      delete (window as unknown as { __malLenis?: unknown }).__malLenis
    }
  }, [])
}

export function faraA(href: string) {
  if (!href.startsWith('#')) { window.location.href = href; return }
  const el = document.querySelector(href)
  if (!el) return
  /* the footer is a sticky curtain, so its own rect says nothing about where it lands: go to the end of the page */
  const y = href === '#hafa-samband' && getComputedStyle(el).position === 'sticky'
    ? document.documentElement.scrollHeight - window.innerHeight
    : el.getBoundingClientRect().top + window.scrollY - (isCompact() ? 84 : 96)
  const l = lenisOf()
  if (l && !reduced()) l.scrollTo(Math.max(0, y), { duration: 1.6 })
  else window.scrollTo({ top: Math.max(0, y), behavior: reduced() ? 'auto' : 'smooth' })
  history.replaceState(null, '', href)
}

/** The visitor's colour tints the whole page. */
export function useTint(rootRef: React.RefObject<HTMLElement | null>) {
  const st = useStada()
  const hex = st.litur?.hex ?? C.tint0
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    el.style.setProperty('--tint', hex)
    el.style.setProperty('--tint-ink', blekOn(hex))
    el.style.setProperty('--tint-lina', tintLina(hex))
  }, [hex, rootRef])
}

/* ------------------------------------------------------------------ *
 * Header
 * ------------------------------------------------------------------ */
const FL_MYND: Record<string, string> = { inni: 'kopal-10', uti: 'steinvari-2000', vidur: 'kjorvari-14', golf: 'kopal-granitlakk' }
const HOPAR: { id: string; n: string; atridi: { n: string; t: string; href: string; mynd?: string }[] }[] = [
  {
    id: 'vorur', n: 'Vörur',
    atridi: [
      { n: 'Innanhúss', t: 'Veggir, loft og lökk fyrir heimilið', href: '#vorur', mynd: FL_MYND.inni },
      { n: 'Utanhúss', t: 'Steinn, múr, stéttir og þök', href: '#vorur', mynd: FL_MYND.uti },
      { n: 'Viðarvörn', t: 'Kjörvari og hreinsiefni', href: '#vorur', mynd: FL_MYND.vidur },
      { n: 'Gólf', t: 'Grunnar og lökk á gólf og stiga', href: '#vorur', mynd: FL_MYND.golf },
    ],
  },
  {
    id: 'litir', n: 'Litir',
    atridi: [
      { n: 'Blandaðu þinn lit', t: 'Sjáðu litinn á veggnum og fáðu litakóða', href: '#blandari' },
      { n: 'Litakort Kópal', t: 'Áttatíu litir með nöfnum', href: '#litakort' },
      { n: 'Hvað þarf ég?', t: 'Lítrar og tími milli umferða', href: '#verk' },
    ],
  },
  {
    id: 'malning', n: 'Málning',
    atridi: [
      { n: 'Framleitt í Kópavogi', t: 'Eigin uppskriftir síðan 1953', href: '#framleitt' },
      { n: 'Söluaðilar', t: 'Hvar Málning fæst um allt land', href: '#solustadir' },
      { n: 'Spurt og svarað', t: 'Svör úr vörulýsingum Málningar', href: '#spurt' },
      { n: 'Hafa samband', t: 'Söludeild, Dalvegi 18', href: '#hafa-samband' },
    ],
  },
]

export const FL_ID: Record<string, 'inni' | 'uti' | 'vidur' | 'golf'> = { Innanhúss: 'inni', Utanhúss: 'uti', Viðarvörn: 'vidur', Gólf: 'golf' }

export function Haus({ onFlokkur }: { onFlokkur: (f: 'inni' | 'uti' | 'vidur' | 'golf') => void }) {
  const st = useStada()
  const [opid, setOpid] = useState<string | null>(null)
  const [leit, setLeit] = useState('')
  const [leitFokus, setLeitFokus] = useState(false)
  const [val, setVal] = useState(0)
  const rot = useRef<HTMLElement | null>(null)
  const loka = useRef<number>(0)
  const fine = finePointer()

  useEffect(() => {
    const onDoc = (e: PointerEvent) => {
      if (rot.current && !rot.current.contains(e.target as Node)) { setOpid(null); setLeitFokus(false) }
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpid(null); setLeitFokus(false) } }
    document.addEventListener('pointerdown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('pointerdown', onDoc); document.removeEventListener('keydown', onKey) }
  }, [])

  const opnaHop = (id: string) => { window.clearTimeout(loka.current); setOpid(id) }
  const lokaSeinna = () => { window.clearTimeout(loka.current); loka.current = window.setTimeout(() => setOpid(null), 180) }

  const tillogur = useMemo(() => {
    const q = leit.trim().toLocaleLowerCase('is')
    if (q.length < 2) return [] as ({ t: 'vara'; v: Vara } | { t: 'litur'; n: string; hex: string })[]
    const v = VORUR.filter((x) => x.nafn.toLocaleLowerCase('is').includes(q) || x.lysing.toLocaleLowerCase('is').includes(q)).slice(0, 4).map((x) => ({ t: 'vara' as const, v: x }))
    const l = KOPAL_LITIR.filter((x) => x.nafn.toLocaleLowerCase('is').includes(q)).slice(0, 4).map((x) => ({ t: 'litur' as const, n: x.nafn, hex: x.hex }))
    return [...v, ...l]
  }, [leit])

  const velja = (i: number) => {
    const t = tillogur[i]
    if (!t) return
    if (t.t === 'vara') stada.opnaVoru(t.v.id)
    else { stada.setLitur({ hex: t.hex, nafn: `Kópal ${t.n.charAt(0) + t.n.slice(1).toLocaleLowerCase('is')}`, uppruni: 'litakort' }); faraA('#litakort') }
    setLeit(''); setLeitFokus(false); setVal(0)
  }

  const go = (href: string, fl?: 'inni' | 'uti' | 'vidur' | 'golf') => {
    setOpid(null)
    if (fl) onFlokkur(fl)
    faraA(href)
  }
  const fjoldi = st.verk.length + (st.litur ? 1 : 0)

  return (
    <header className="mal-haus" ref={rot as never} aria-label="Aðalvalmynd">
      <a className="mal-skip" href="#efni" onClick={(e) => { e.preventDefault(); faraA('#efni') }}>Fara í efni</a>
      <nav className="mal-hausV" aria-label="Hlutar vefsins">
        {HOPAR.map((h) => (
          <div key={h.id} className={`mal-hopur${opid === h.id ? ' opid' : ''}`}
            onPointerEnter={(e) => { if (fine && e.pointerType === 'mouse') opnaHop(h.id) }}
            onPointerLeave={(e) => { if (fine && e.pointerType === 'mouse') lokaSeinna() }}>
            <button className="mal-hopurT" aria-expanded={opid === h.id} aria-haspopup="true" onClick={() => setOpid(opid === h.id ? null : h.id)}>
              {h.n}<ChevronDown size={16} strokeWidth={1.75} aria-hidden="true" />
            </button>
            <div className="mal-fell" role="group" aria-label={h.n}>
              {h.atridi.map((a) => (
                <a key={a.n} href={a.href} onClick={(e) => { e.preventDefault(); go(a.href, FL_ID[a.n]) }}>
                  {a.mynd && <span className="mal-fellM"><img src={vaMynd(a.mynd, 480)} alt="" width={44} height={44} loading="lazy" /></span>}
                  <span><b>{a.n}</b><span>{a.t}</span></span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <button className="mal-burger" aria-label={opid === 'valmynd' ? 'Loka valmynd' : 'Opna valmynd'} aria-expanded={opid === 'valmynd'} onClick={() => setOpid(opid === 'valmynd' ? null : 'valmynd')}>
        {opid === 'valmynd' ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
      </button>

      <a className="mal-merki" href="#top" aria-label="Málning, forsíða" onClick={(e) => { e.preventDefault(); go('#top') }}>
        <img src={M('brand/merki-hvitt.svg')} alt="Málning" width={118} height={31} />
      </a>

      <div className="mal-hausH">
        <div className="mal-leit" role="search">
          <input type="search" value={leit} placeholder="Hvað vantar þig?" aria-label="Leita að vöru eða lit" aria-controls="mal-tillog" autoComplete="off"
            onChange={(e) => { setLeit(e.target.value); setVal(0) }} onFocus={() => setLeitFokus(true)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setVal((v) => Math.min(tillogur.length - 1, v + 1)) }
              if (e.key === 'ArrowUp') { e.preventDefault(); setVal((v) => Math.max(0, v - 1)) }
              if (e.key === 'Enter') { e.preventDefault(); velja(val) }
            }} />
          <Search className="lupa" size={20} strokeWidth={1.75} aria-hidden="true" />
          {leitFokus && tillogur.length > 0 && (
            <div className="mal-tillog" id="mal-tillog" role="listbox" aria-label="Tillögur">
              {tillogur.map((t, i) => (
                <button key={t.t + (t.t === 'vara' ? t.v.id : t.n)} role="option" aria-selected={i === val} onClick={() => velja(i)}>
                  {t.t === 'vara'
                    ? <><span className="mal-fellM" style={{ width: 28, height: 28, borderRadius: 8 }}><img src={vaMynd(t.v.mynd, 480)} alt="" width={24} height={24} /></span><b>{t.v.nafn}</b><em>Vara</em></>
                    : <><span className="dott" style={{ background: t.hex }} /><b>{t.n.charAt(0) + t.n.slice(1).toLocaleLowerCase('is')}</b><em>Litur</em></>}
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="mal-verkT" aria-label={`Verkblað, ${fjoldi} atriði`} onClick={() => stada.opna(true)}>
          <ClipboardList size={22} strokeWidth={1.6} aria-hidden="true" />
          {fjoldi > 0 && <span className="mal-tala" aria-hidden="true">{fjoldi}</span>}
        </button>
      </div>

      <div className={`mal-valmynd${opid === 'valmynd' ? ' opid' : ''}`} role="dialog" aria-label="Valmynd" aria-hidden={opid !== 'valmynd'}
        {...(opid !== 'valmynd' ? { inert: '' as unknown as boolean } : {})}>
        {HOPAR.map((h) => (
          <div key={h.id}>
            <h3>{h.n}</h3>
            {h.atridi.map((a) => (
              <a key={a.n} href={a.href} onClick={(e) => { e.preventDefault(); go(a.href, FL_ID[a.n]) }}>
                {a.mynd && <span className="mal-fellM"><img src={vaMynd(a.mynd, 480)} alt="" width={44} height={44} loading="lazy" /></span>}
                <span><b>{a.n}</b><span>{a.t}</span></span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </header>
  )
}
