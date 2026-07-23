import { useEffect, useRef, useState } from 'react'
import type {
  CSSProperties, ReactNode,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from 'react'
import Lenis from 'lenis'
import { Phone, MapPin, ArrowUpRight, ArrowLeftRight, Check, Building2, Home } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  BOOKING_URL, PHONE_DISPLAY, PHONE_HREF, ADDRESS, MAP_EMBED, MAP_LINK,
  IMG, NAV, HERO, FACTS, VADALFJOLL, ROOMS, ROOM_CATEGORIES, THEN_NOW,
  RESTAURANT, CHARACTER, STORY, CAMPSITE, REVIEWS, PRACTICAL, CLOSING, STICKY, JSON_LD,
} from './data'

const company = getPreviewCompany('bjarkalundur')

/* Module-scoped Lenis handle so anchor nav can route through the same smooth-
   scroll instance the page owns, instead of fighting it with native
   scrollIntoView (review P2/motion). Set/cleared by Page()'s effect. */
let lenisInstance: Lenis | null = null

/* ── „Þá / Nú" — heritage editorial, rebuilt clean off the dark+gold reflex.
   Ground is warm ivory (archival paper) with near-black ink text; only two
   feature bands go dark — deep forest for the real green lounges, basalt
   charcoal for Vaðalfjöll — brass is metal hardware, never the CTA crutch.
   The signature is no longer a scroll-drawn line: it's a draggable 1947↔2026
   photo slider, and a real room-category browser replaces the bare booking
   handoff. Photography leads throughout; motion is bespoke to this page only
   (no shared Reveal/TextSplitReveal import — see Emerge/Photo below). ────── */

/* Palette (brief C.Palette). Contrast verified (WCAG relative-luminance):
   INK/IVORY 12.8:1 · IVORY/FOREST 10.5:1 · IVORY/BASALT 11.95:1 (all AAA).
   BRASS is 3.0–3.9:1 against these grounds — a valid non-text UI contrast
   (icons, borders, focus rings) but NOT body text, so a darkened BRASS_INK
   (6.1:1 on ivory) carries small brass-toned copy (eyebrows, price values)
   instead of the raw hue. */
const IVORY = '#F2ECDD'   // dominant ground — archival paper
const INK = '#23281C'     // near-black green — text on ivory, CTA fill on dark
const FOREST = '#1C3A2C'  // feature band — the real green lounges
const BASALT = '#2A2C29'  // feature band — Vaðalfjöll
const BRASS = '#A8802F'   // metal accent only — icons, borders, focus rings
const BRASS_INK = '#6D531F' // darkened brass, AA-safe for small text on ivory
const SAGE = '#7C8467'    // muted secondary — dividers

const INK_SOFT = 'rgba(35,40,28,.82)'      // ~7:1 on ivory
const INK_MUTE = 'rgba(35,40,28,.66)'      // ~5:1 on ivory
const IVORY_SOFT = 'rgba(242,236,221,.85)' // ~8:1 on forest/basalt
const IVORY_MUTE = 'rgba(242,236,221,.70)' // ~6:1 on forest/basalt
const HAIR_ON_IVORY = 'rgba(35,40,28,.13)'
const HAIR_ON_DARK = 'rgba(242,236,221,.16)'

const EASE = 'cubic-bezier(.22,1,.36,1)'
const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A8802F]'
const FOCUS_INSET =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#A8802F]'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Reactive reduced-motion flag (named to match the brief's useReducedMotion()
    convention). Lazily seeded from matchMedia so the very first render is
    already correct — no post-mount flip, no flash of motion for reduced
    users. Content visibility itself is additionally guaranteed by the CSS
    @media(prefers-reduced-motion) block in PAGE_STYLES below (belt+braces). */
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReduced)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/* ═══════════════════════ Page-local bespoke motion (bj- namespaced) ═══════
   All @keyframes + the classes that use them live ONLY here, never in the
   shared index.css. Every one is neutralised under prefers-reduced-motion
   (opacity/transform/filter/clip-path forced to their resting value), so
   reduced-motion users always get the final, fully visible state instantly —
   independent of whatever JS-level state a component is in. */
const PAGE_STYLES = `
@keyframes bj-rise {
  from { opacity: 0; transform: translateY(20px); filter: blur(7px); }
  to   { opacity: 1; transform: translateY(0);     filter: blur(0); }
}
@keyframes bj-drift {
  from { opacity: 0; transform: scale(1.07); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes bj-nudge {
  0%, 100% { transform: translate(-50%,-50%) translateX(0); }
  50%      { transform: translate(-50%,-50%) translateX(7px); }
}
@keyframes bj-sheet {
  from { clip-path: inset(0 0 100% 0); }
  to   { clip-path: inset(0 0 0% 0); }
}
@keyframes bj-link-rise {
  from { opacity: 0; transform: translateY(15px); }
  to   { opacity: 1; transform: translateY(0); }
}
.bj-emerge { opacity: 0; }
.bj-emerge[data-shown="true"] { animation: bj-rise .85s ${EASE} both; }
.bj-drift-img { animation: bj-drift 1.5s ${EASE} both; }
.bj-nudge-hint { animation: bj-nudge 2s ease-in-out infinite; }
.bj-sheet-open { animation: bj-sheet .5s ${EASE} both; }
.bj-link-in { opacity: 0; }
.bj-link-in[data-shown="true"] { animation: bj-link-rise .5s ${EASE} both; }

@media (prefers-reduced-motion: reduce) {
  .bj-emerge, .bj-link-in {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }
  .bj-drift-img, .bj-sheet-open, .bj-nudge-hint {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    clip-path: none !important;
  }
}
`

/* ═══════════════════════ Emerge — bespoke content reveal ══════════════════
   Not the shared whileInView Reveal (unreliable per the redesign-craft
   ledger) — a from-scratch IntersectionObserver + CSS-keyframe reveal, with
   the same on-mount-already-visible check and a hard 1.5s fallback timer so
   content can never get stuck invisible. Visual signature (blur-focus + rise)
   is unique to this page. */
function Emerge({
  children, delay = 0, className = '', style, as = 'div',
}: {
  children: ReactNode; delay?: number; className?: string; style?: CSSProperties
  as?: 'div' | 'span' | 'figure' | 'li' | 'blockquote' | 'p'
}) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) { setShown(true); return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); io.disconnect() }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.15 })
    io.observe(el)
    let t: number | undefined
    if (r.top < window.innerHeight * 1.3) t = window.setTimeout(() => setShown(true), 1500)
    return () => { io.disconnect(); if (t) window.clearTimeout(t) }
  }, [])
  const Tag = as
  return (
    <Tag ref={ref as never} className={`bj-emerge ${className}`} data-shown={shown}
      style={{ ...style, animationDelay: `${delay}ms` }}>
      {children}
    </Tag>
  )
}

/* ═══════════════════════ Photo — real image, two modes ════════════════════
   mode="bg": full-bleed absolute-fill background, mount-triggered (eager,
   not whileInView — brief's explicit rule for full-bleed photos).
   mode="content" (default): scroll-revealed inline photo via Emerge. Both
   fall back to a flat tinted panel (never a broken-image icon) on error. */
function Photo({
  src, alt, mode = 'content', aspect = 'aspect-[4/3]', className = '',
  position = 'center', priority = false, delay = 0,
}: {
  src: string; alt: string; mode?: 'bg' | 'content'; aspect?: string; className?: string
  position?: string; priority?: boolean; delay?: number
}) {
  const [failed, setFailed] = useState(false)
  const img = failed ? (
    <div className="absolute inset-0" style={{ background: mode === 'bg' ? FOREST : '#DCD6C6' }} role="img" aria-label={alt} />
  ) : (
    <img
      src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async"
      {...(priority ? { fetchpriority: 'high' as const } : {})}
      onError={() => setFailed(true)}
      className={`absolute inset-0 h-full w-full object-cover ${mode === 'bg' ? 'bj-drift-img' : ''}`}
      style={{ objectPosition: position }}
    />
  )
  if (mode === 'bg') return img
  return (
    <Emerge as="figure" delay={delay} className={`relative m-0 overflow-hidden ${aspect} ${className}`}>
      {img}
    </Emerge>
  )
}

/* ═══════════════════════ Label — mono eyebrow, ground-aware ═══════════════ */
function Label({ children, tone = 'onLight' }: { children: ReactNode; tone?: 'onLight' | 'onDark' }) {
  return (
    <p className="m-0 font-mono text-[11.5px] font-bold uppercase tracking-[0.24em]"
      style={{ color: tone === 'onDark' ? IVORY_MUTE : BRASS_INK }}>
      {children}
    </p>
  )
}

/* ═══════════════════════ CountUp — 1947 (reduced-safe) ═════════════════════ */
function CountUp({ to, from, className, style }: {
  to: number; from: number; className?: string; style?: CSSProperties
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [val, setVal] = useState(() => (prefersReduced() ? to : from))
  useEffect(() => {
    if (prefersReduced()) return
    const el = ref.current
    if (!el) return
    let raf = 0
    const run = () => {
      const start = performance.now()
      const dur = 900
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / dur)
        const eased = 1 - Math.pow(1 - p, 3)
        setVal(Math.round(from + (to - from) * eased))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { run(); io.disconnect() }
    }, { threshold: 0.6 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [from, to])
  return <span ref={ref} className={className} style={style}>{val}</span>
}

/* ═══════════════════════ NAV ═══════════════════════════════════════════════ */
function TopNav() {
  const reduced = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body + Lenis scroll while the mobile overlay is open; Escape closes.
  useEffect(() => {
    if (!menuOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    lenisInstance?.stop()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      lenisInstance?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const solid = scrolled || menuOpen
  const navText = solid ? INK : IVORY

  const scrollToTop = () => {
    if (lenisInstance) lenisInstance.scrollTo(0, { duration: reduced ? 0 : 1.2 })
    else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }
  const go = (id: string) => {
    setMenuOpen(false)
    if (lenisInstance) lenisInstance.scrollTo(`#${id}`, { duration: reduced ? 0 : 1.2 })
    else document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <>
      <nav aria-label="Aðalvalmynd" className="fixed inset-x-0 top-0 z-40"
        style={{
          background: solid ? IVORY : 'transparent',
          borderBottom: `1px solid ${solid ? HAIR_ON_IVORY : 'transparent'}`,
          backdropFilter: solid ? 'blur(10px)' : undefined,
          WebkitBackdropFilter: solid ? 'blur(10px)' : undefined,
          transition: 'background .35s ease, border-color .35s ease',
        }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
          <button onClick={scrollToTop}
            className={`font-display text-[19px] font-semibold leading-none transition-colors ${FOCUS}`} style={{ color: navText }}>
            Bjarkalundur
          </button>
          <div className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => go(n.id)}
                className={`font-hanken text-[13.5px] font-medium transition-opacity hover:opacity-70 ${FOCUS}`}
                style={{ color: navText }}>
                {n.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <a href={PHONE_HREF}
              className={`hidden font-mono text-[12.5px] tracking-[0.02em] transition-opacity hover:opacity-70 sm:block ${FOCUS}`}
              style={{ color: navText }}>
              {PHONE_DISPLAY}
            </a>
            <a href={BOOKING_URL} target="_blank" rel="noreferrer"
              className={`inline-flex min-h-[44px] items-center rounded-full px-5 font-hanken text-[13px] font-bold transition-transform active:scale-[0.98] ${FOCUS}`}
              style={{ background: solid ? INK : IVORY, color: solid ? IVORY : INK }}>
              Bóka
            </a>
            <button type="button"
              aria-label={menuOpen ? 'Loka valmynd' : 'Opna valmynd'}
              aria-expanded={menuOpen} aria-controls="bj-mobile-nav"
              onClick={() => setMenuOpen((v) => !v)}
              className={`relative flex h-11 w-11 items-center justify-center rounded-full lg:hidden ${FOCUS}`}>
              <span aria-hidden className="absolute block h-[1.5px] w-5 rounded-full"
                style={{
                  background: navText,
                  transform: menuOpen ? 'translateY(0) rotate(45deg)' : 'translateY(-6px)',
                  transition: reduced ? 'none' : `transform .32s ${EASE}`,
                }} />
              <span aria-hidden className="absolute block h-[1.5px] w-5 rounded-full"
                style={{
                  background: navText,
                  opacity: menuOpen ? 0 : 1,
                  transform: menuOpen ? 'scaleX(0)' : 'scaleX(1)',
                  transition: reduced ? 'none' : 'opacity .2s ease, transform .2s ease',
                }} />
              <span aria-hidden className="absolute block h-[1.5px] w-5 rounded-full"
                style={{
                  background: navText,
                  transform: menuOpen ? 'translateY(0) rotate(-45deg)' : 'translateY(6px)',
                  transition: reduced ? 'none' : `transform .32s ${EASE}`,
                }} />
            </button>
          </div>
        </div>
      </nav>
      {/* Sibling of <nav>, not nested inside it — nav's own backdrop-filter would
          otherwise become this overlay's containing block (ledger gotcha). */}
      <MobileNav open={menuOpen} onGo={go} onClose={() => setMenuOpen(false)} reduced={reduced} />
    </>
  )
}

/* ═══════════════════════ MOBILE NAV OVERLAY — full-screen forest ══════════ */
function MobileNav({ open, onGo, onClose, reduced }: {
  open: boolean; onGo: (id: string) => void; onClose: () => void; reduced: boolean
}) {
  if (!open) return null
  return (
    <div id="bj-mobile-nav" role="dialog" aria-modal="true" aria-label="Valmynd"
      className={`fixed inset-0 z-30 flex flex-col pt-[76px] lg:hidden ${reduced ? '' : 'bj-sheet-open'}`}
      style={{ background: FOREST }}>
      <ul className="flex flex-1 flex-col items-start justify-center gap-1 px-8">
        {NAV.map((n, i) => (
          <li key={n.id} className="overflow-hidden">
            <button onClick={() => onGo(n.id)}
              className={`font-display text-[2.1rem] font-semibold ${reduced ? '' : 'bj-link-in'} ${FOCUS}`}
              data-shown="true"
              style={{ color: IVORY, lineHeight: 1.2, animationDelay: reduced ? undefined : `${i * 60 + 90}ms` }}>
              {n.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-5 px-8 pb-10">
        <a href={PHONE_HREF} onClick={onClose}
          className={`inline-flex items-center gap-2 font-mono text-[13px] tracking-[0.02em] ${FOCUS}`}
          style={{ color: IVORY_SOFT }}>
          <Phone size={16} strokeWidth={2} aria-hidden /> {PHONE_DISPLAY}
        </a>
      </div>
    </div>
  )
}

/* ═══════════════════════ HERO ══════════════════════════════════════════════ */
function Hero() {
  return (
    <header className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden" style={{ background: FOREST }}>
      <Photo src={IMG.hero} alt={HERO.alt} mode="bg" position="center 38%" priority />
      <div aria-hidden className="absolute inset-0" style={{
        background:
          'linear-gradient(180deg, rgba(28,58,44,.38) 0%, rgba(28,58,44,.14) 34%, rgba(20,30,22,.58) 66%, rgba(14,20,15,.92) 100%)',
      }} />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-28 md:px-8 md:pb-24">
        <Emerge delay={80}><Label tone="onDark">{HERO.eyebrow}</Label></Emerge>
        <h1 aria-label={`${HERO.line1} ${HERO.line2}`}
          className="mt-4 font-display font-semibold"
          style={{ color: IVORY, fontSize: 'clamp(2.2rem, 9vw, 6.2rem)', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
          {/* aria-label above gives AT the exact accessible name. The literal
              {' '} below joins the two block-level lines with a real text-node
              space, so raw textContent (what crawlers read) is also exactly
              "HLIÐIÐ AÐ VESTFJÖRÐUM" — a display:block span carries no visual
              width from an adjacent whitespace node, so the two-line layout
              and stagger timing are unchanged. */}
          <Emerge as="span" delay={200} className="block">{HERO.line1}</Emerge>
          {' '}
          <Emerge as="span" delay={340} className="block">{HERO.line2}</Emerge>
        </h1>
        <Emerge delay={520} className="mt-6 max-w-xl">
          <p className="font-hanken text-[15px] leading-[1.7] md:text-[17px]" style={{ color: IVORY_SOFT }}>
            {HERO.sub}
          </p>
        </Emerge>
        <Emerge delay={660} className="mt-8 flex flex-wrap items-center gap-3">
          <a href={BOOKING_URL} target="_blank" rel="noreferrer"
            className={`inline-flex min-h-[52px] items-center gap-2 rounded-full px-7 font-hanken text-[15px] font-bold transition-transform active:scale-[0.98] ${FOCUS}`}
            style={{ background: IVORY, color: INK }}>
            Bóka gistingu <ArrowUpRight size={18} strokeWidth={2.2} aria-hidden />
          </a>
          <a href={PHONE_HREF}
            className={`inline-flex min-h-[52px] items-center gap-2 rounded-full border px-6 font-hanken text-[15px] font-semibold transition-colors hover:bg-white/10 ${FOCUS}`}
            style={{ borderColor: BRASS, color: IVORY }}>
            <Phone size={17} strokeWidth={2} aria-hidden /> Hringja
          </a>
        </Emerge>
      </div>
    </header>
  )
}

/* ═══════════════════════ FACTS STRIP — the threshold, ivory ═══════════════ */
function FactsStrip() {
  return (
    <section aria-label="Staðreyndir" style={{ background: IVORY }}>
      <h2 className="sr-only">Staðreyndir um Bjarkalund</h2>
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-5 py-12 md:grid-cols-4 md:px-8 md:py-14">
        {FACTS.map((f, i) => (
          <Emerge key={f.label} delay={i * 90}
            className="border-l px-5 first:border-l-0 md:px-6" style={{ borderColor: HAIR_ON_IVORY }}>
            <div className="font-display text-[2rem] font-semibold md:text-[2.5rem]" style={{ color: INK, lineHeight: 1.15 }}>
              {f.count ? <CountUp from={1900} to={f.count} /> : f.value}
            </div>
            <div className="mt-2.5 font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: INK_MUTE }}>
              {f.label}
            </div>
          </Emerge>
        ))}
      </div>
    </section>
  )
}

/* ═══════════════════════ VAÐALFJÖLL — basalt landmark band ════════════════
   The old scroll-drawn ridge line is retired (brief: signature is now the
   slider). This is a clean photo-led moment: the two real Wikimedia shots,
   credit kept verbatim. */
function Vadalfjoll() {
  return (
    <section id="vadalfjoll" className="relative overflow-hidden" style={{ background: BASALT }}>
      <div className="relative min-h-[58vh] w-full md:min-h-[70vh]">
        <Photo src={IMG.vadalfjoll1} alt={VADALFJOLL.wideAlt} mode="bg" position="center 30%" />
        <div aria-hidden className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(20,21,19,.22) 0%, rgba(20,21,19,.08) 42%, rgba(20,21,19,.74) 100%)',
        }} />
        <div className="relative mx-auto flex h-full max-w-6xl items-end px-5 pb-14 md:px-8">
          <div>
            <Emerge><Label tone="onDark">{VADALFJOLL.eyebrow}</Label></Emerge>
            <Emerge delay={90}>
              <h2 className="mt-3 font-display font-semibold" style={{ color: IVORY, fontSize: 'clamp(2.4rem, 6vw, 4rem)', lineHeight: 1.16 }}>
                {VADALFJOLL.title}
              </h2>
            </Emerge>
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-[1.3fr_1fr] md:items-start md:px-8 md:py-16">
        <Emerge delay={60} className="max-w-xl">
          <p className="font-hanken text-[15px] leading-[1.75] md:text-[16.5px]" style={{ color: IVORY_SOFT }}>
            {VADALFJOLL.body}
          </p>
        </Emerge>
        <div>
          <Photo src={IMG.vadalfjoll2} alt={VADALFJOLL.detailAlt} aspect="aspect-[4/3]" className="rounded-[3px] shadow-2xl" delay={120} />
          <p className="mt-2.5 font-mono text-[10.5px] leading-relaxed tracking-[0.03em]" style={{ color: IVORY_MUTE }}>
            {VADALFJOLL.credit}
          </p>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════ ÞÁ / NÚ — signature draggable slider ═════════════
   role="slider", pointer + touch draggable, arrow-key operable. Under
   prefers-reduced-motion, renders both photos side by side (each labelled)
   instead of the interactive overlay — never hides one behind motion. */
function ThenNow() {
  const reduced = useReducedMotion()
  const [pos, setPos] = useState(50) // % from left where 1947 (archival) is revealed
  const trackRef = useRef<HTMLDivElement>(null)

  const setFromClientX = (clientX: number) => {
    const el = trackRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const pct = ((clientX - r.left) / r.width) * 100
    setPos(Math.max(0, Math.min(100, pct)))
  }

  const onHandleDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setFromClientX(e.clientX)
  }
  const onHandleMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.buttons !== 1) return
    setFromClientX(e.clientX)
  }
  const onKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    const step = e.shiftKey ? 10 : 4
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { setPos((p) => Math.max(0, p - step)); e.preventDefault() }
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { setPos((p) => Math.min(100, p + step)); e.preventDefault() }
    else if (e.key === 'Home') { setPos(0); e.preventDefault() }
    else if (e.key === 'End') { setPos(100); e.preventDefault() }
  }

  return (
    <section id="tha-nu" style={{ background: IVORY }}>
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <Emerge><Label>{THEN_NOW.eyebrow}</Label></Emerge>
        <Emerge delay={80}>
          <h2 className="mt-3 font-display font-semibold" style={{ color: INK, fontSize: 'clamp(2rem, 4.8vw, 3.4rem)', lineHeight: 1.14 }}>
            {THEN_NOW.title}
          </h2>
        </Emerge>
        <Emerge delay={140} className="max-w-lg">
          <p className="mt-5 font-hanken text-[15.5px] leading-[1.75]" style={{ color: INK_SOFT }}>
            {THEN_NOW.body}
          </p>
        </Emerge>

        {reduced ? (
          <div className="mt-9 grid gap-4 md:grid-cols-2">
            <figure className="relative m-0 overflow-hidden rounded-[4px] aspect-[4/3]">
              <img src={IMG.archival} alt={STORY.archivalAlt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
              <figcaption className="absolute left-3 top-3 rounded-full px-3 py-1 font-mono text-[11px] font-bold tracking-[0.06em]" style={{ background: 'rgba(35,40,28,.85)', color: IVORY }}>
                {THEN_NOW.labelThen}
              </figcaption>
            </figure>
            <figure className="relative m-0 overflow-hidden rounded-[4px] aspect-[4/3]">
              <img src={IMG.hero} alt={HERO.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
              <figcaption className="absolute left-3 top-3 rounded-full px-3 py-1 font-mono text-[11px] font-bold tracking-[0.06em]" style={{ background: 'rgba(35,40,28,.85)', color: IVORY }}>
                {THEN_NOW.labelNow}
              </figcaption>
            </figure>
          </div>
        ) : (
          <>
            <div ref={trackRef}
              className="relative mt-9 aspect-[4/3] w-full select-none overflow-hidden rounded-[4px] shadow-xl md:aspect-[16/9]"
              onPointerDown={(e) => setFromClientX(e.clientX)}>
              <img src={IMG.hero} alt={HERO.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" draggable={false} />
              <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
                <img src={IMG.archival} alt={STORY.archivalAlt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" draggable={false} />
              </div>
              <div aria-hidden className="absolute left-3 top-3 rounded-full px-3 py-1 font-mono text-[11px] font-bold tracking-[0.06em]" style={{ background: 'rgba(35,40,28,.85)', color: IVORY }}>
                {THEN_NOW.labelThen}
              </div>
              <div aria-hidden className="absolute right-3 top-3 rounded-full px-3 py-1 font-mono text-[11px] font-bold tracking-[0.06em]" style={{ background: 'rgba(35,40,28,.85)', color: IVORY }}>
                {THEN_NOW.labelNow}
              </div>
              <div aria-hidden className="absolute inset-y-0 w-[2px]" style={{ left: `${pos}%`, background: IVORY, transform: 'translateX(-1px)' }} />
              <button
                type="button" role="slider" aria-orientation="horizontal"
                aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)}
                aria-valuetext={`${Math.round(pos)}% á móti 1947, ${100 - Math.round(pos)}% á móti 2026`}
                aria-label="Berðu saman hótelið árið 1947 og í dag. Dragðu eða notaðu örvatakka."
                onPointerDown={onHandleDown}
                onPointerMove={onHandleMove}
                onKeyDown={onKeyDown}
                className={`bj-nudge-hint absolute top-1/2 flex h-11 w-11 items-center justify-center rounded-full shadow-lg ${FOCUS}`}
                style={{ left: `${pos}%`, transform: 'translate(-50%, -50%)', background: IVORY, border: `2px solid ${BRASS}`, touchAction: 'none' }}>
                <ArrowLeftRight size={18} strokeWidth={2.2} color={INK} aria-hidden />
              </button>
            </div>
            <p className="mt-3 font-mono text-[11px] tracking-[0.03em]" style={{ color: INK_MUTE }}>
              {THEN_NOW.instruction}
            </p>
          </>
        )}
      </div>
    </section>
  )
}

/* ═══════════════════════ ROOMS BROWSER — the second functional fix ════════
   Two accessible tabs (role=tablist/tab/tabpanel, roving tabindex, arrow-key
   operable) replace the bare external handoff: pick a category, see what's
   actually included and a real interior photo, then the booking CTA — with
   the honesty note kept next to it. */
function RoomsBrowser() {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const cat = ROOM_CATEGORIES[active]

  const onTabKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = i
    if (e.key === 'ArrowRight') next = (i + 1) % ROOM_CATEGORIES.length
    else if (e.key === 'ArrowLeft') next = (i - 1 + ROOM_CATEGORIES.length) % ROOM_CATEGORIES.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = ROOM_CATEGORIES.length - 1
    else return
    e.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="herbergi" style={{ background: IVORY }}>
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <Emerge><Label>{ROOMS.eyebrow}</Label></Emerge>
        <Emerge delay={80}>
          <h2 className="mt-3 font-display font-semibold" style={{ color: INK, fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.12 }}>
            {ROOMS.title}
          </h2>
        </Emerge>
        <Emerge delay={140} className="max-w-lg">
          <p className="mt-5 font-hanken text-[15.5px] leading-[1.75]" style={{ color: INK_SOFT }}>
            {ROOMS.body}
          </p>
        </Emerge>

        <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-start md:gap-14">
          <div>
            <div role="tablist" aria-label="Tegundir gistingar" className="flex flex-wrap gap-2.5">
              {ROOM_CATEGORIES.map((c, i) => {
                const Icon = c.id === 'gestahus' ? Home : Building2
                const on = i === active
                return (
                  <button key={c.id} ref={(el) => { tabRefs.current[i] = el }}
                    role="tab" id={`bj-tab-${c.id}`} aria-selected={on} aria-controls={`bj-panel-${c.id}`}
                    tabIndex={on ? 0 : -1}
                    onClick={() => setActive(i)}
                    onKeyDown={(e) => onTabKeyDown(e, i)}
                    className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-5 font-hanken text-[13.5px] font-semibold transition-colors ${FOCUS}`}
                    style={{
                      background: on ? INK : 'transparent',
                      color: on ? IVORY : INK,
                      borderColor: on ? INK : HAIR_ON_IVORY,
                    }}>
                    <Icon size={16} strokeWidth={2} aria-hidden /> {c.label}
                  </button>
                )
              })}
            </div>

            <div role="tabpanel" id={`bj-panel-${cat.id}`} aria-labelledby={`bj-tab-${cat.id}`} className="mt-7">
              <div className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: BRASS_INK }}>
                {cat.count} · {cat.countLabel}
              </div>
              <p className="mt-3 font-hanken text-[15px] leading-[1.7]" style={{ color: INK_SOFT }}>
                {cat.body}
              </p>
              <ul className="mt-5 flex flex-col gap-2.5">
                {cat.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 font-hanken text-[14px]" style={{ color: INK }}>
                    <Check size={16} strokeWidth={2.4} color={BRASS} aria-hidden /> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <a href={BOOKING_URL} target="_blank" rel="noreferrer"
                  className={`inline-flex min-h-[50px] items-center gap-2 rounded-full px-6 font-hanken text-[14.5px] font-bold transition-transform active:scale-[0.98] ${FOCUS}`}
                  style={{ background: INK, color: IVORY }}>
                  {ROOMS.cta} <ArrowUpRight size={17} strokeWidth={2.2} aria-hidden />
                </a>
                <span className="font-mono text-[11.5px] tracking-[0.02em]" style={{ color: INK_MUTE }}>
                  {ROOMS.note}
                </span>
              </div>
            </div>
          </div>

          <Photo key={cat.id} src={IMG[cat.img]} alt={cat.alt} aspect="aspect-[4/3]" className="rounded-[3px]" />
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════ RESTAURANT — forest band ══════════════════════════ */
function Restaurant() {
  return (
    <section id="veitingar" style={{ background: FOREST }}>
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <Emerge><Label tone="onDark">{RESTAURANT.eyebrow}</Label></Emerge>
            <Emerge delay={80}>
              <h2 className="mt-3 font-display font-semibold" style={{ color: IVORY, fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.14 }}>
                {RESTAURANT.title}
              </h2>
            </Emerge>
            <Emerge delay={140} className="max-w-lg">
              <p className="mt-5 font-hanken text-[15.5px] leading-[1.75]" style={{ color: IVORY_SOFT }}>
                {RESTAURANT.body}
              </p>
            </Emerge>
          </div>
          <Emerge delay={120}>
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[12px] tracking-[0.04em]"
              style={{ borderColor: BRASS, color: IVORY_SOFT }}>
              {RESTAURANT.hours}
            </div>
          </Emerge>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {RESTAURANT.gallery.map((g, i) => (
            <Photo key={g.key} src={IMG[g.key as keyof typeof IMG]} alt={g.alt}
              aspect="aspect-[4/5] md:aspect-[3/4]" className="rounded-[3px]" delay={i * 90} />
          ))}
        </div>

        <Emerge delay={120} as="blockquote"
          className="mx-auto mt-12 max-w-2xl border-l-2 pl-6 text-center md:text-left" style={{ borderColor: BRASS }}>
          <p className="font-display text-[1.5rem] font-medium leading-snug" style={{ color: IVORY, lineHeight: 1.3 }}>
            „{RESTAURANT.quote}“
          </p>
          <cite className="mt-3 block font-mono text-[11.5px] not-italic tracking-[0.04em]" style={{ color: IVORY_MUTE }}>
            {RESTAURANT.quoteBy}
          </cite>
        </Emerge>
      </div>
    </section>
  )
}

/* ═══════════════════════ CHARACTER — the green rooms, forest band ═════════ */
function Character() {
  const [active, setActive] = useState(0)
  const panel = CHARACTER.panels[active]
  return (
    <section style={{ background: FOREST }}>
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="max-w-2xl">
          <Emerge><Label tone="onDark">{CHARACTER.eyebrow}</Label></Emerge>
          <Emerge delay={80}>
            <h2 className="mt-3 font-display font-semibold" style={{ color: IVORY, fontSize: 'clamp(2rem, 4.8vw, 3.4rem)', lineHeight: 1.14 }}>
              {CHARACTER.title}
            </h2>
          </Emerge>
          <Emerge delay={140}>
            <p className="mt-5 font-hanken text-[15.5px] leading-[1.75]" style={{ color: IVORY_SOFT }}>
              {CHARACTER.body}
            </p>
          </Emerge>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-[1fr_1.5fr] md:items-stretch">
          <ul className="order-2 flex flex-col justify-center gap-1 md:order-1">
            {CHARACTER.panels.map((p, i) => {
              const on = i === active
              return (
                <li key={p.title}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    className={`group flex min-h-[44px] w-full items-center justify-between gap-4 border-b py-4 text-left transition-colors ${FOCUS}`}
                    style={{ borderColor: HAIR_ON_DARK }}>
                    <span className="font-display text-[1.35rem] font-medium transition-colors md:text-[1.6rem]"
                      style={{ color: on ? IVORY : IVORY_MUTE, lineHeight: 1.25 }}>
                      {p.title}
                    </span>
                    <span className="font-mono text-[11px]" style={{ color: on ? BRASS : 'transparent' }}>
                      0{i + 1}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
          <div className="relative order-1 overflow-hidden rounded-[4px] md:order-2 aspect-[4/3] md:aspect-auto md:min-h-[440px]">
            {CHARACTER.panels.map((p, i) => (
              <img key={p.key} src={IMG[p.key as keyof typeof IMG]} alt={p.alt}
                loading="lazy" decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ opacity: i === active ? 1 : 0, transition: `opacity .7s ${EASE}` }} />
            ))}
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-24"
              style={{ background: 'linear-gradient(180deg, transparent, rgba(20,30,22,.65))' }} />
            <div className="absolute bottom-4 left-4 font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: IVORY }}>
              {panel.title}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════ STORY — 1947 → 2026, ivory ════════════════════════ */
function Story() {
  return (
    <section id="saga" style={{ background: IVORY }}>
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:px-8 md:py-28">
        <div>
          <Emerge><Label>{STORY.eyebrow}</Label></Emerge>
          <Emerge delay={80}>
            <h2 className="mt-3 font-display font-semibold" style={{ color: INK, fontSize: 'clamp(2.4rem, 6vw, 4rem)', lineHeight: 1.13 }}>
              {STORY.title}
            </h2>
          </Emerge>
          <Emerge delay={140} className="max-w-md">
            <p className="mt-5 font-hanken text-[15px] leading-[1.75]" style={{ color: INK_SOFT }}>
              {STORY.intro}
            </p>
          </Emerge>
          <div className="mt-8 max-w-sm">
            <Photo src={IMG.archival} alt={STORY.archivalAlt} aspect="aspect-[800/564]" className="rounded-[3px] shadow-md ring-1 ring-black/5" delay={200} />
          </div>
        </div>
        <div className="flex flex-col justify-center">
          {STORY.timeline.map((t, i) => (
            <Emerge key={t.year} delay={i * 120}
              className="relative border-l-2 pb-10 pl-7 last:pb-0" style={{ borderColor: SAGE }}>
              <span aria-hidden className="absolute -left-[7px] top-1 h-3 w-3 rounded-full" style={{ background: BRASS }} />
              <div className="font-mono text-[13px] font-bold tracking-[0.1em]" style={{ color: BRASS_INK }}>{t.year}</div>
              <p className="mt-2 font-hanken text-[16px] leading-[1.7]" style={{ color: INK }}>{t.text}</p>
            </Emerge>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════ CAMPSITE — photo band + ivory price panel ════════ */
function Campsite() {
  return (
    <section id="tjaldsvaedi" className="relative overflow-hidden" style={{ background: FOREST }}>
      <div className="relative min-h-[42vh] w-full">
        <Photo src={IMG.campsiteField} alt={CAMPSITE.fieldAlt} mode="bg" position="center 60%" />
        <div aria-hidden className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(20,30,22,.32), rgba(20,30,22,.12) 40%, rgba(20,30,22,.88))' }} />
        <div className="relative mx-auto flex h-full max-w-6xl items-end px-5 py-14 md:px-8">
          <div>
            <Emerge><Label tone="onDark">{CAMPSITE.eyebrow}</Label></Emerge>
            <Emerge delay={80}>
              <h2 className="mt-3 font-display font-semibold" style={{ color: IVORY, fontSize: 'clamp(2rem, 5vw, 3.4rem)', lineHeight: 1.14 }}>
                {CAMPSITE.title}
              </h2>
            </Emerge>
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_1fr] md:items-center md:px-8" style={{ background: IVORY }}>
        <Emerge>
          <p className="max-w-md font-hanken text-[15.5px] leading-[1.75]" style={{ color: INK_SOFT }}>
            {CAMPSITE.body}
          </p>
        </Emerge>
        <Emerge delay={100}>
          <dl className="divide-y" style={{ borderColor: HAIR_ON_IVORY }}>
            {CAMPSITE.prices.map((p) => (
              <div key={p.label} className="flex items-baseline justify-between gap-4 py-3.5" style={{ borderColor: HAIR_ON_IVORY }}>
                <dt className="font-hanken text-[14.5px]" style={{ color: INK_SOFT }}>{p.label}</dt>
                <dd className="font-mono text-[15px] font-bold tracking-[0.02em]" style={{ color: BRASS_INK }}>{p.value}</dd>
              </div>
            ))}
          </dl>
        </Emerge>
      </div>
      <div className="relative h-[20vh] min-h-[130px] w-full">
        <Photo src={IMG.heathPanorama} alt={CAMPSITE.wideAlt} mode="bg" position="center" />
        <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(20,30,22,.5), rgba(20,30,22,.3))' }} />
      </div>
    </section>
  )
}

/* ═══════════════════════ REVIEWS — ivory ══════════════════════════════════ */
function Reviews() {
  return (
    <section style={{ background: IVORY }}>
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Emerge><Label>{REVIEWS.eyebrow}</Label></Emerge>
            <Emerge delay={80}>
              <h2 className="mt-3 font-display font-semibold" style={{ color: INK, fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', lineHeight: 1.14 }}>
                {REVIEWS.title}
              </h2>
            </Emerge>
          </div>
          <Emerge delay={120}>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[3rem] font-semibold leading-none" style={{ color: INK }}>{REVIEWS.score}</span>
              <span className="font-mono text-[15px]" style={{ color: INK_MUTE }}>{REVIEWS.scoreScale}</span>
              <span className="ml-2 font-mono text-[11.5px] uppercase tracking-[0.12em]" style={{ color: INK_MUTE }}>
                {REVIEWS.scoreCount}
              </span>
            </div>
          </Emerge>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {/* Illustrative pending exact-quote verification — see data.ts disclaimer below. */}
          {REVIEWS.items.map((r, i) => (
            <Emerge key={r.by + i} delay={i * 90} as="blockquote"
              className="m-0 flex flex-col justify-between rounded-[4px] border p-6"
              style={{ borderColor: HAIR_ON_IVORY, background: '#FBF8F0' }}>
              <p className="font-display text-[1.15rem] font-medium leading-snug" style={{ color: INK, lineHeight: 1.35 }}>
                „{r.quote}“
              </p>
              <cite className="mt-5 font-mono text-[11px] not-italic uppercase tracking-[0.1em]" style={{ color: INK_MUTE }}>
                {r.by}
              </cite>
            </Emerge>
          ))}
        </div>
        <p className="mt-6 font-hanken text-[12px] italic" style={{ color: INK_MUTE }}>
          {REVIEWS.disclaimer}
        </p>
      </div>
    </section>
  )
}

/* ═══════════════════════ PRACTICAL / LOCATION — ivory ══════════════════════ */
function Practical() {
  return (
    <section id="hafa-samband" style={{ background: IVORY }}>
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2 md:gap-14 md:px-8 md:py-28">
        <div>
          <Emerge><Label>{PRACTICAL.eyebrow}</Label></Emerge>
          <Emerge delay={80}>
            <h2 className="mt-3 font-display font-semibold" style={{ color: INK, fontSize: 'clamp(2rem, 4.8vw, 3.2rem)', lineHeight: 1.14 }}>
              {PRACTICAL.title}
            </h2>
          </Emerge>
          <Emerge delay={140} className="max-w-md">
            <p className="mt-5 font-hanken text-[15.5px] leading-[1.75]" style={{ color: INK_SOFT }}>
              {PRACTICAL.gateway}
            </p>
          </Emerge>
          <Emerge delay={200}>
            <dl className="mt-8 divide-y" style={{ borderColor: HAIR_ON_IVORY }}>
              {PRACTICAL.rows.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-4 py-3.5" style={{ borderColor: HAIR_ON_IVORY }}>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: INK_MUTE }}>{row.label}</dt>
                  <dd className="text-right font-hanken text-[14.5px]" style={{ color: INK }}>
                    {row.href ? (
                      <a href={row.href} className={`underline decoration-[#A8802F]/60 underline-offset-4 hover:decoration-[#A8802F] ${FOCUS}`}>
                        {row.value}
                      </a>
                    ) : row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Emerge>
          <Emerge delay={260}>
            <p className="mt-6 inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.04em]" style={{ color: BRASS_INK }}>
              <MapPin size={15} strokeWidth={2} aria-hidden /> {PRACTICAL.season}
            </p>
          </Emerge>
        </div>
        <Emerge delay={120}>
          <div className="h-full min-h-[320px] overflow-hidden rounded-[4px]" style={{ border: `1px solid ${HAIR_ON_IVORY}` }}>
            {/* Eager, no lazy: this is the practical/contact section, expected in view soon. */}
            <iframe title={`Kort af Hótel Bjarkalundi, ${ADDRESS}`} src={MAP_EMBED}
              loading="eager" referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[320px] w-full border-0" />
          </div>
          <a href={MAP_LINK} target="_blank" rel="noreferrer"
            className={`mt-3 inline-flex items-center gap-1.5 font-mono text-[11.5px] tracking-[0.04em] ${FOCUS}`}
            style={{ color: INK_MUTE }}>
            Opna í Google kortum <ArrowUpRight size={13} strokeWidth={2} aria-hidden />
          </a>
        </Emerge>
      </div>
    </section>
  )
}

/* ═══════════════════════ CLOSING CTA — forest bookend ══════════════════════ */
function Closing() {
  return (
    <section id="boka" className="relative overflow-hidden" style={{ background: FOREST }}>
      <div className="mx-auto max-w-4xl px-5 py-24 text-center md:px-8 md:py-32">
        <Emerge><Label tone="onDark">{CLOSING.eyebrow}</Label></Emerge>
        <Emerge delay={80}>
          <h2 className="mx-auto mt-4 max-w-2xl font-display font-semibold" style={{ color: IVORY, fontSize: 'clamp(2.2rem, 6vw, 4rem)', lineHeight: 1.15 }}>
            {CLOSING.title}
          </h2>
        </Emerge>
        <Emerge delay={140}>
          <p className="mx-auto mt-5 max-w-md font-hanken text-[15.5px] leading-[1.7]" style={{ color: IVORY_SOFT }}>
            {CLOSING.body}
          </p>
        </Emerge>
        <Emerge delay={200} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a href={BOOKING_URL} target="_blank" rel="noreferrer"
            className={`inline-flex min-h-[54px] items-center gap-2 rounded-full px-8 font-hanken text-[15px] font-bold transition-transform active:scale-[0.98] ${FOCUS}`}
            style={{ background: IVORY, color: INK }}>
            {CLOSING.book} <ArrowUpRight size={18} strokeWidth={2.2} aria-hidden />
          </a>
          <a href={PHONE_HREF}
            className={`inline-flex min-h-[54px] items-center gap-2 rounded-full border px-7 font-hanken text-[15px] font-semibold ${FOCUS}`}
            style={{ borderColor: BRASS, color: IVORY }}>
            <Phone size={17} strokeWidth={2} aria-hidden /> {PHONE_DISPLAY}
          </a>
        </Emerge>
      </div>
    </section>
  )
}

/* ═══════════════════════ STICKY MOBILE CTA — ink, not brass ═══════════════ */
function StickyBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[auto_1fr] md:hidden"
      style={{ background: INK, paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <a href={PHONE_HREF}
        className={`flex min-h-[54px] items-center gap-2 border-r px-5 font-hanken text-[13.5px] font-bold ${FOCUS_INSET}`}
        style={{ color: IVORY, borderColor: 'rgba(242,236,221,.2)' }}>
        <Phone size={16} strokeWidth={2.2} aria-hidden /> {STICKY.call}
      </a>
      <a href={BOOKING_URL} target="_blank" rel="noreferrer"
        className={`flex min-h-[54px] items-center justify-center font-hanken text-[14.5px] font-bold ${FOCUS_INSET}`}
        style={{ color: IVORY }}>
        {STICKY.book}
      </a>
    </div>
  )
}

/* ═══════════════════════ PAGE ═══════════════════════════════════════════════ */
export default function Page() {
  /* Lenis smooth scroll — skipped entirely under reduced motion. */
  useEffect(() => {
    if (prefersReduced()) return
    const lenis = new Lenis({ duration: 1.1 })
    lenisInstance = lenis
    let raf = 0
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); lenis.destroy(); lenisInstance = null }
  }, [])

  useEffect(() => {
    document.title = 'Hótel Bjarkalundur · Hliðið að Vestfjörðum'
    setThemeColor(IVORY)
    const s = document.createElement('script')
    s.type = 'application/ld+json'
    s.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(s)
    return () => { s.remove() }
  }, [])

  return (
    <div lang="is" className="pb-[calc(54px+env(safe-area-inset-bottom))] font-hanken antialiased md:pb-0" style={{ background: IVORY }}>
      <style>{PAGE_STYLES}</style>
      <TopNav />
      <main>
        <Hero />
        <FactsStrip />
        <Vadalfjoll />
        <ThenNow />
        <RoomsBrowser />
        <Restaurant />
        <Character />
        <Story />
        <Campsite />
        <Reviews />
        <Practical />
        <Closing />
      </main>
      <StickyBar />
      <PreviewChrome company={company} />
      <PreviewFooter company={company} />
    </div>
  )
}
