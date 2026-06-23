import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'
import Lenis from 'lenis'
import { ArrowDown, ArrowUpRight, Mail, MapPin, Phone, ShoppingBag } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import { ASSET, BEATS, BUY, DISTILLERY, ELF, SPIRITS } from './data'
import LiquidEther from './LiquidEther'
import GradientText from './GradientText'
import type { Beat, Spirit } from './data'

const company = getPreviewCompany('reykjavikdistillery')

/* Stable reference — prevents remount on scroll. Palette maps low→high velocity.
   Stops must be near-luminous: the shader multiplies by velocity magnitude (0..1),
   so dark stops vanish. Gradient: violet night → crowberry → aurora teal → amber flame. */
const LIQUID_COLORS = ['#3d1f6e', '#7b52c4', '#2d9e7e', '#74c9a8', '#c8881e', '#f0a83a', '#ffe0ad']

/* Brand gradient for the hero emphasis word "í glasið" — candlelight amber sweeping
   through cream and a whisper of aurora teal, echoing the ether palette. Module-level
   so the array reference is stable across the hero's per-scroll re-renders. */
const GLASS_GRADIENT = ['#f0a83a', '#ffe0ad', '#e9b86a', '#74c9a8', '#f0a83a']

/* --- Palette ------------------------------------------------------------- */
const GROUND = '#0a0b0a' // basalt near-black
const SURFACE = '#121210' // opaque card surface — sits above the fixed ether so it never bleeds through
const AMBER = '#c8881e' // candlelight amber — CTA fill (black text)
const AMBER_GLOW = '#e9b86a' // light amber — small text / labels on dark (AA)
const BONE = '#f1ede3' // warm light — body type
const MUTED = '#a7a094' // warm taupe — secondary copy (AA on ground)

/* --- Small helpers ------------------------------------------------------- */
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const kr = (n: number) => `${n.toLocaleString('is-IS')} kr`

const hexToRgb = (h: string): [number, number, number] => {
  const n = parseInt(h.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
/** Linear blend between two hex colours, returns an rgb() string. */
const mix = (a: string, b: string, t: number) => {
  const ca = hexToRgb(a)
  const cb = hexToRgb(b)
  const c = ca.map((v, i) => Math.round(v + (cb[i] - v) * clamp(t, 0, 1)))
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`
}

/* ---------------------------------------------------------------------------
   One-shot reveal that NEVER traps content invisible. Visible by default; if
   IO + motion are available it starts translated/transparent and settles once.
   A backgrounded tab that never fires the observer simply shows the fallback.
--------------------------------------------------------------------------- */
function useReveal<T extends HTMLElement = HTMLElement>(reduce: boolean | null) {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(true)
  useEffect(() => {
    if (reduce) return
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    setShown(false)
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '-12% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduce])
  return { ref, shown }
}

/* Reusable scroll-reveal wrapper. Fades + lifts its children in once they enter
   the viewport, using the default-visible useReveal hook (never traps content
   hidden) and a CSS transition (not framer). Stagger with `delay`. */
function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion()
  const { ref, shown } = useReveal<HTMLDivElement>(reduce)
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(22px)',
        transition: reduce ? undefined : 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.21, 0.65, 0.36, 1)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

/* ---------------------------------------------------------------------------
   Scroll driver. Lenis gives buttery smooth scroll; we read the scroll value
   from Lenis's own 'scroll' event (lenis.scroll) so every scroll-linked
   transform tracks it exactly — never framer useScroll, which pins at 0 in the
   backgrounded preview. Under reduced motion Lenis is off and we fall back to a
   passive window 'scroll' listener. Returns the live scrollY, the scrollable
   height, and the Lenis ref (for the collection rail's jump-to). */
function useScrollDriver(reduce: boolean | null) {
  const [scrollY, setScrollY] = useState(0)
  const [docH, setDocH] = useState(1)
  const lenisRef = useRef<Lenis | null>(null)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const measure = () => setDocH(Math.max(1, document.documentElement.scrollHeight - window.innerHeight))
    measure()
    const settle = window.setTimeout(measure, 500)
    window.addEventListener('resize', measure)

    let lenis: Lenis | null = null
    let raf = 0
    let onWin: (() => void) | null = null

    if (!reduce) {
      lenis = new Lenis({ duration: 1.15, easing: (x) => Math.min(1, 1.001 - Math.pow(2, -10 * x)), smoothWheel: true })
      lenisRef.current = lenis
      if (import.meta.env.DEV) (window as unknown as { __lenis?: Lenis }).__lenis = lenis
      lenis.on('scroll', () => setScrollY(lenis ? lenis.scroll : 0))
      const loop = (time: number) => {
        lenis?.raf(time)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    } else {
      onWin = () => setScrollY(window.scrollY || window.pageYOffset)
      onWin()
      window.addEventListener('scroll', onWin, { passive: true })
    }

    return () => {
      window.clearTimeout(settle)
      window.removeEventListener('resize', measure)
      if (onWin) window.removeEventListener('scroll', onWin)
      if (lenis) {
        cancelAnimationFrame(raf)
        lenis.destroy()
        lenisRef.current = null
      }
    }
  }, [reduce])
  return { scrollY, docH, lenisRef }
}

/* --- Fixed temperature backdrop: cools at the top, warms toward the still -- */
function TemperatureBackdrop({ t }: { t: number }) {
  // base basalt warms very slightly; the glow shifts aurora-green -> amber
  const base = mix('#0a0b0a', '#0b0a07', t)
  const glow = mix('#74c9a8', '#c8881e', t)
  const alpha = 0.06 + 0.1 * t
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        background: `radial-gradient(125% 80% at 50% -8%, ${glow.replace('rgb', 'rgba').replace(')', `, ${alpha})`)}, transparent 58%), ${base}`,
      }}
    />
  )
}

/* --- The thread: a hairline that fills with amber as you descend ---------- */
function Thread({ progress }: { progress: number }) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed left-4 top-0 z-30 hidden h-screen w-px md:block">
      <div className="absolute inset-0 bg-white/10" />
      <div className="absolute inset-x-0 top-0 origin-top" style={{ height: '100%', transform: `scaleY(${progress})`, background: `linear-gradient(${AMBER_GLOW}, ${AMBER})` }} />
      <div className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full" style={{ top: `calc(${progress * 100}% - 3px)`, background: AMBER_GLOW, boxShadow: `0 0 10px ${AMBER}` }} />
    </div>
  )
}

/* --- Slim top nav with the real 64° mark --------------------------------- */
function TopNav({ scrolled }: { scrolled: boolean }) {
  return (
    <nav
      className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-3.5 transition-colors duration-500 md:px-10"
      style={{ background: scrolled ? 'rgba(10,11,10,0.72)' : 'transparent', backdropFilter: scrolled ? 'blur(10px)' : 'none' }}
    >
      <a href="#top" className="flex items-center gap-2.5" aria-label="64° Reykjavik Distillery">
        <img src={`${ASSET}brand/logo-small.png`} alt="" aria-hidden="true" className="h-7 w-7 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
        <span className="font-display text-[15px] font-semibold tracking-tight text-[#f1ede3]">
          64<span style={{ color: AMBER_GLOW }}>°</span> Reykjavik Distillery
        </span>
      </a>
      <div className="hidden items-center gap-7 sm:flex">
        <a href="#eimingarnar" className="text-[13px] font-medium text-white/65 transition-colors hover:text-white">Eimingarnar</a>
        <a href="#ferdin" className="text-[13px] font-medium text-white/65 transition-colors hover:text-white">Ferðin</a>
        <a
          href="#kaupa"
          className="inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 text-[13px] font-bold text-[#0a0b0a] transition-opacity hover:opacity-90"
          style={{ background: AMBER }}
        >
          Hvar á að kaupa
        </a>
      </div>
    </nav>
  )
}

/* --- Hero ----------------------------------------------------------------- */
function Hero() {
  // Arm the staggered entrance only once the tab is actually visible. Default
  // state is fully visible, so a background-tab load is never trapped hidden
  // (CSS animations pause in hidden tabs); it simply plays on focus.
  const reduce = useReducedMotion()
  const [play, setPlay] = useState(false)
  useLayoutEffect(() => {
    if (reduce || typeof document === 'undefined') return
    if (document.visibilityState === 'visible') {
      setPlay(true)
      return
    }
    const onVis = () => {
      if (document.visibilityState === 'visible') {
        setPlay(true)
        document.removeEventListener('visibilitychange', onVis)
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [reduce])

  return (
    <header id="top" className="relative flex min-h-[94svh] flex-col justify-end overflow-hidden px-5 pb-14 pt-28 md:px-10 md:pb-20">
      <div className="relative z-10 mx-auto w-full max-w-5xl" {...(play ? { 'data-rd-play': '' } : {})}>
        <p className="rd-enter font-sans text-[11px] font-semibold uppercase tracking-[0.16em] sm:tracking-[0.32em] sm:text-xs" style={{ color: AMBER_GLOW, ['--rd-d' as string]: '60ms' } as CSSProperties}>
          The Original from Iceland · Síðan 2009
        </p>
        <h1 className="rd-enter mt-5 max-w-3xl font-display text-[clamp(2.6rem,8.5vw,6rem)] font-medium leading-[1.0] tracking-[-0.018em] text-[#f4f1ea]" style={{ ['--rd-d' as string]: '150ms' } as CSSProperties}>
          Úr villtri náttúru,
          <br />
          <GradientText className="italic" colors={GLASS_GRADIENT} animationSpeed={7}>
            í glasið.
          </GradientText>
        </h1>
        <p className="rd-enter mt-6 max-w-xl text-base leading-relaxed sm:text-lg" style={{ color: BONE, ['--rd-d' as string]: '260ms' } as CSSProperties}>
          Handtíndar íslenskar jurtir og ber, eimuð í litlum lotum í Hafnarfirði. Fyrsta íslenska örbrugghúsið sinnar tegundar.
        </p>
        <div className="rd-enter mt-9 flex flex-wrap items-center gap-3" style={{ ['--rd-d' as string]: '360ms' } as CSSProperties}>
          <a
            href="#eimingarnar"
            className="inline-flex min-h-[52px] items-center gap-2 rounded-full px-7 text-sm font-bold text-[#0a0b0a] outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0b0a]"
            style={{ background: AMBER, ['--tw-ring-color' as string]: AMBER_GLOW } as CSSProperties}
          >
            Skoða eimingarnar <ArrowDown size={16} aria-hidden="true" />
          </a>
          <a
            href="#ferdin"
            className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-white/25 px-7 text-sm font-semibold text-[#f1ede3] outline-none transition-colors hover:border-white/50 focus-visible:ring-2 focus-visible:ring-white/50"
            style={{ background: SURFACE }}
          >
            Frá villtu í glas
          </a>
        </div>
      </div>
    </header>
  )
}

/* --- A journey beat ------------------------------------------------------- */
function JourneyBeat({ beat, scrollY, reduce, index }: { beat: Beat; scrollY: number; reduce: boolean | null; index: number }) {
  const wrap = useRef<HTMLDivElement>(null)
  const [top, setTop] = useState(0)
  const reveal = useReveal<HTMLDivElement>(reduce)

  useEffect(() => {
    const measure = () => setTop(wrap.current ? wrap.current.offsetTop : 0)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const rel = scrollY - top + (typeof window !== 'undefined' ? window.innerHeight : 800)
  const shift = reduce ? 0 : clamp(rel * 0.04, -50, 50)
  const flip = index % 2 === 1

  return (
    <div ref={wrap} className="relative px-5 py-16 md:px-10 md:py-28">
      <div className={`mx-auto grid max-w-5xl items-center gap-8 md:gap-14 lg:grid-cols-2 ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}>
        {/* Media */}
        <div
          ref={reveal.ref}
          className="relative transition-all duration-700 ease-out"
          style={{ opacity: reveal.shown ? 1 : 0, transform: reveal.shown ? 'none' : 'translateY(22px)' }}
        >
          {beat.kind === 'land' && (
            <figure className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 sm:aspect-[3/2] lg:aspect-[4/5]">
              <Img src={beat.img} alt={beat.alt} className="h-full w-full object-cover" style={{ transform: `translate3d(0, ${-shift}px, 0) scale(1.12)` }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, transparent 50%, rgba(10,11,10,0.7))' }} aria-hidden="true" />
              {beat.tag && (
                <figcaption className="absolute bottom-3 left-3 rounded-full bg-black/45 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-white/65 backdrop-blur-sm">
                  {beat.tag}
                </figcaption>
              )}
            </figure>
          )}

          {beat.kind === 'specimen' && (
            <figure className="relative overflow-hidden rounded-2xl border border-white/10" style={{ background: 'radial-gradient(120% 90% at 50% 35%, #f3f1ec, #d9d6cf)' }}>
              <Img src={beat.img} alt={beat.alt} className="h-full w-full object-cover mix-blend-multiply" />
              <span className="absolute right-3 top-3 font-sans text-[10px] uppercase tracking-[0.16em] text-black/40">Foraged · Ísland</span>
            </figure>
          )}

          {beat.kind === 'schematic' && (
            <figure className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-[#0c0d0c]">
              <Img src={beat.img} alt={beat.alt} className="h-full w-full object-cover" style={{ filter: 'invert(1) brightness(1.18) contrast(1.06) sepia(0.24) hue-rotate(-6deg)', objectPosition: '72% center' }} />
              <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 100% at 72% 50%, rgba(200,136,30,0.12), transparent 62%)' }} aria-hidden="true" />
              <span className="absolute right-3 top-3 font-sans text-[10px] uppercase tracking-[0.16em]" style={{ color: AMBER_GLOW }}>Kopareimi · est. 2009</span>
            </figure>
          )}
        </div>

        {/* Copy */}
        <Reveal delay={120}>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.26em]" style={{ color: AMBER_GLOW }}>
            {String(index + 1).padStart(2, '0')} — {beat.eyebrow}
          </p>
          <h2 className="mt-3 max-w-md font-display text-[clamp(1.9rem,5vw,3.1rem)] font-medium leading-[1.04] tracking-[-0.015em] text-[#f4f1ea]">
            {beat.title}
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed sm:text-base" style={{ color: MUTED }}>
            {beat.body}
          </p>
        </Reveal>
      </div>
    </div>
  )
}

/* --- The Collection: a pinned, cinematic one-bottle-at-a-time reveal ------
   The signature moment. A sticky full-viewport stage; scrolling the tall
   parent crossfades a giant cut-out bottle through the whole range, the
   ambient glow shifts to each spirit's colour, and an oversized index counts
   up behind it. Driven by the passive scrollY (verifiable; survives the
   preview rAF freeze). Keyboard users step the range via the numbered rail. */
function bottleCutout(s: Spirit) {
  return s.img.replace('/bottles/', '/bottles/cutout/').replace('.jpg', '.png')
}

function Collection({ scrollY, reduce, jumpTo }: { scrollY: number; reduce: boolean | null; jumpTo: (y: number) => void }) {
  const wrapRef = useRef<HTMLElement>(null)
  const [box, setBox] = useState({ top: 0, height: 1 })
  useEffect(() => {
    const measure = () => {
      const el = wrapRef.current
      if (el) setBox({ top: el.offsetTop, height: el.offsetHeight })
    }
    measure()
    const t = window.setTimeout(measure, 400)
    window.addEventListener('resize', measure)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('resize', measure)
    }
  }, [])

  const N = SPIRITS.length
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  const local = clamp((scrollY - box.top) / Math.max(1, box.height - vh), 0, 1)
  const f = local * (N - 1)
  const index = Math.min(N - 1, Math.max(0, Math.round(f)))
  const active = SPIRITS[index]
  const lo = Math.floor(f)
  const hi = Math.min(N - 1, lo + 1)
  const glow = mix(SPIRITS[lo].tone, SPIRITS[hi].tone, f - lo)
  const float = reduce ? 0 : Math.sin(scrollY / 240) * 8

  return (
    <section ref={wrapRef} id="eimingarnar" aria-label="Eimingarnar — úrvalið" style={{ height: `${N * 44}vh` }} className="relative">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        {/* ambient tone glow, crossfading between spirits */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(58% 56% at 50% 48%, ${glow}26, transparent 70%)` }} />
        {/* oversized index numeral behind everything */}
        <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[54%] font-display text-[44vw] font-medium leading-none text-white/[0.035] md:text-[30vw]">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* section label (keeps heading order: h2 here, spirit name as h3) */}
        <div className="absolute left-5 top-6 md:left-10 md:top-8">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: AMBER_GLOW }}>Úrvalið</p>
          <h2 className="mt-1 font-display text-lg font-medium text-[#f4f1ea]">Eimingarnar</h2>
        </div>

        <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-2 px-6 md:grid-cols-12 md:gap-6 md:px-10">
          {/* Giant bottle, crossfading */}
          <div className="relative order-1 flex h-[40svh] items-end justify-center md:order-none md:col-span-5 md:h-[80svh]">
            {/* coloured backlight so the bottle (esp. clear spirits) glows off the dark */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(42% 46% at 50% 44%, ${active.tone}40, transparent 70%)`, transition: reduce ? 'none' : 'background 0.5s ease' }} />
            {SPIRITS.map((s, i) => (
              <img
                key={s.id}
                src={bottleCutout(s)}
                alt={i === index ? `${s.name} flaska` : ''}
                aria-hidden={i !== index}
                loading={i < 3 ? 'eager' : 'lazy'}
                decoding="async"
                className="absolute bottom-0 left-1/2 h-full w-auto max-w-[90%] object-contain object-bottom"
                style={{
                  opacity: i === index ? 1 : 0,
                  transition: reduce ? 'none' : 'opacity 0.55s ease',
                  transform: i === index ? `translate3d(-50%, ${float}px, 0)` : 'translate3d(-50%, 0, 0)',
                  filter: 'drop-shadow(0 26px 38px rgba(0,0,0,0.6))',
                }}
              />
            ))}
            {/* floor shadow */}
            <div aria-hidden="true" className="absolute bottom-1 left-1/2 h-5 w-2/3 -translate-x-1/2 rounded-[50%]" style={{ background: 'radial-gradient(closest-side, rgba(0,0,0,0.6), transparent)' }} />
          </div>

          {/* Detail */}
          <div className="relative order-2 md:order-none md:col-span-7 md:pl-6">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: active.tone }}>{active.category}</p>
            <h3 className="mt-2 font-display text-[clamp(2.4rem,6.5vw,5rem)] font-medium leading-[0.96] tracking-[-0.02em] text-[#f4f1ea]">{active.name}</h3>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed sm:text-base" style={{ color: MUTED }}>{active.note}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-sm tabular-nums" style={{ color: BONE }}>
              <span>{active.botanical}</span>
              <span aria-hidden="true" className="opacity-30">·</span>
              <span>{active.abv}</span>
              <span aria-hidden="true" className="opacity-30">·</span>
              <span>{active.size}</span>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <span className="font-display text-2xl" style={{ color: AMBER_GLOW }}>{kr(active.price)}</span>
              <a href="#kaupa" className="inline-flex min-h-[48px] items-center gap-2 rounded-full px-6 text-sm font-bold text-[#0a0b0a] outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0b0a]" style={{ background: AMBER, ['--tw-ring-color' as string]: AMBER_GLOW } as CSSProperties}>
                Hvar á að kaupa <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Numbered rail (desktop) — also the keyboard path through the range */}
        <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-2.5 md:flex">
          {SPIRITS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => jumpTo(box.top + (i / (N - 1)) * (box.height - vh) + 4)}
              className="group flex items-center gap-2 outline-none focus-visible:opacity-100"
              aria-label={`Sýna ${s.name}`}
              aria-current={i === index ? 'true' : undefined}
            >
              <span className="font-sans text-[10px] tabular-nums transition-colors" style={{ color: i === index ? AMBER_GLOW : 'rgba(255,255,255,0.32)' }}>{String(i + 1).padStart(2, '0')}</span>
              <span className="h-px transition-all duration-300" style={{ width: i === index ? 22 : 9, background: i === index ? AMBER_GLOW : 'rgba(255,255,255,0.32)' }} />
            </button>
          ))}
        </div>

        {/* progress dots (mobile) */}
        <div className="absolute bottom-24 left-1/2 flex -translate-x-1/2 items-center gap-1.5 md:hidden">
          {SPIRITS.map((s, i) => (
            <span key={s.id} className="h-1 rounded-full transition-all duration-300" style={{ width: i === index ? 18 : 6, background: i === index ? AMBER_GLOW : 'rgba(255,255,255,0.28)' }} />
          ))}
        </div>

        {/* honesty line — hidden on mobile where it sits behind the sticky CTA bar */}
        <p className="absolute bottom-6 left-5 right-5 mx-auto hidden max-w-md text-center font-sans text-[10px] leading-relaxed sm:block md:left-10 md:right-auto md:text-left" style={{ color: 'rgba(167,160,148,0.55)' }}>
          Raunverulegar vörur og merki. Bragð, verð og stærðir eru sýnishorn.
        </p>
      </div>
    </section>
  )
}

/* --- Where to buy --------------------------------------------------------- */
const BuySection = memo(function BuySection() {
  return (
    <section id="kaupa" aria-labelledby="kaupa-h" className="px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.26em]" style={{ color: AMBER_GLOW }}>Hvar á að kaupa</p>
          <h2 id="kaupa-h" className="mt-3 font-display text-[clamp(2rem,5.5vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.015em] text-[#f4f1ea]">
            Versla 64°
          </h2>
        </Reveal>
        {(() => {
          const [primary, ...rest] = BUY
          return (
            <Reveal delay={120} className="mt-10 grid gap-5 lg:grid-cols-12">
              {/* Featured: the online store — the clearest path to a bottle */}
              <div
                className="relative flex flex-col justify-between gap-8 overflow-hidden rounded-3xl border p-7 md:p-9 lg:col-span-5"
                style={{ borderColor: 'rgba(200,136,30,0.32)', background: `linear-gradient(155deg, rgba(200,136,30,0.16), rgba(255,255,255,0.015) 58%), ${SURFACE}` }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={15} style={{ color: AMBER_GLOW }} aria-hidden="true" />
                    <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: AMBER_GLOW }}>
                      {primary.tag} · skýrasta leiðin
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-[clamp(1.8rem,3.5vw,2.4rem)] font-medium tracking-tight text-[#f4f1ea]">{primary.name}</h3>
                  <p className="mt-3 max-w-sm text-[15px] leading-relaxed" style={{ color: MUTED }}>{primary.detail}</p>
                </div>
                {primary.href && (
                  <a
                    href={primary.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[52px] w-fit items-center gap-2 rounded-full px-7 text-sm font-bold text-[#0a0b0a] outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0b0a]"
                    style={{ background: AMBER, ['--tw-ring-color' as string]: AMBER_GLOW } as CSSProperties}
                  >
                    {primary.cta} <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                )}
              </div>

              {/* The physical stockists — a clean divided list, no orphan card */}
              <div className="lg:col-span-7">
                <p className="mb-3 px-1 font-sans text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'rgba(167,160,148,0.8)' }}>
                  Einnig fáanlegt
                </p>
                <ul className="divide-y divide-white/8 overflow-hidden rounded-3xl border border-white/10" style={{ background: SURFACE }}>
                  {rest.map((b) => (
                    <li key={b.name} className="flex flex-col gap-1.5 p-5 transition-colors hover:bg-white/[0.025] sm:flex-row sm:items-baseline sm:gap-5 md:p-6">
                      <span className="shrink-0 pt-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] sm:w-28" style={{ color: AMBER_GLOW }}>{b.tag}</span>
                      <div>
                        <h3 className="font-display text-lg font-medium tracking-tight text-[#f4f1ea]">{b.name}</h3>
                        <p className="mt-1 text-[13px] leading-relaxed" style={{ color: MUTED }}>{b.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )
        })()}
      </div>
    </section>
  )
})

/* --- Visit + elf footnote ------------------------------------------------- */
const VisitSection = memo(function VisitSection() {
  return (
    <section id="ferdin" aria-labelledby="visit-h" className="px-5 pb-20 pt-4 md:px-10 md:pb-28">
      <Reveal className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10">
        <div className="grid lg:grid-cols-2">
          <div className="relative p-7 md:p-10" style={{ background: SURFACE }}>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.26em]" style={{ color: AMBER_GLOW }}>Heimsókn og smakk</p>
            <h2 id="visit-h" className="mt-3 font-display text-[clamp(1.8rem,5vw,2.7rem)] font-medium leading-[1.04] tracking-[-0.015em] text-[#f4f1ea]">
              Komdu í brugghúsið
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed" style={{ color: MUTED }}>
              Brugghúsið stendur við Lónsbraut í Hafnarfirði. Við bjóðum upp á smökkun á eimingunum eftir samkomulagi. Hringdu og við finnum tíma.
            </p>
            <dl className="mt-7 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} style={{ color: AMBER_GLOW }} aria-hidden="true" className="mt-0.5 shrink-0" />
                <div>
                  <dt className="text-[11px] uppercase tracking-wide" style={{ color: MUTED }}>Heimilisfang</dt>
                  <dd className="mt-0.5 text-[15px] text-[#f1ede3]">{DISTILLERY.addr}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} style={{ color: AMBER_GLOW }} aria-hidden="true" className="mt-0.5 shrink-0" />
                <div>
                  <dt className="text-[11px] uppercase tracking-wide" style={{ color: MUTED }}>Sími</dt>
                  <dd className="mt-0.5">
                    <a href={DISTILLERY.telHref} className="text-[15px] tabular-nums underline-offset-4 hover:underline" style={{ color: AMBER_GLOW }}>{DISTILLERY.tel}</a>
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} style={{ color: AMBER_GLOW }} aria-hidden="true" className="mt-0.5 shrink-0" />
                <div>
                  <dt className="text-[11px] uppercase tracking-wide" style={{ color: MUTED }}>Netfang</dt>
                  <dd className="mt-0.5">
                    <a href={`mailto:${DISTILLERY.email}`} className="text-[15px] underline-offset-4 hover:underline" style={{ color: AMBER_GLOW }}>{DISTILLERY.email}</a>
                  </dd>
                </div>
              </div>
            </dl>
            <a
              href={DISTILLERY.telHref}
              className="mt-8 inline-flex min-h-[48px] items-center gap-2 rounded-full px-6 text-sm font-bold text-[#0a0b0a] outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0b0a]"
              style={{ background: AMBER, ['--tw-ring-color' as string]: AMBER_GLOW } as CSSProperties}
            >
              <Phone size={16} aria-hidden="true" /> Bóka smökkun
            </a>
          </div>

          {/* Elf footnote — the real, charming origin story */}
          <div className="relative flex flex-col justify-center gap-5 border-t border-white/10 p-7 md:p-10 lg:border-l lg:border-t-0" style={{ background: `radial-gradient(120% 100% at 80% 0%, rgba(200,136,30,0.12), transparent 60%), ${SURFACE}` }}>
            <img src={`${ASSET}brand/logo.png`} alt="64° Reykjavik Distillery" className="h-12 w-12 object-contain" style={{ filter: 'brightness(0) invert(1)', opacity: 0.85 }} />
            <p className="font-display text-[clamp(1.4rem,3.5vw,1.9rem)] font-medium italic leading-snug text-[#f1ede3]">
              “{ELF.line}”
            </p>
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: AMBER_GLOW }}>{ELF.toast}</p>
            <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(167,160,148,0.7)' }}>
              {DISTILLERY.tagline} · {DISTILLERY.addr}
            </p>
          </div>
        </div>
      </Reveal>

      <p className="mx-auto mt-6 max-w-5xl text-[11px] leading-relaxed" style={{ color: 'rgba(167,160,148,0.6)' }}>
        Vörumyndir og merki © Reykjavik Distillery. Stemnings- og landslagsmyndir eru sýnishorn.
      </p>
    </section>
  )
})

/* --- Mobile sticky CTA ---------------------------------------------------- */
function MobileCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#0a0b0a]/95 px-4 pt-3 pb-[max(0.8rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
      <a
        href="#kaupa"
        className="flex min-h-[48px] items-center justify-center gap-2 rounded-full px-5 text-sm font-bold text-[#0a0b0a] transition-opacity hover:opacity-90"
        style={{ background: AMBER }}
      >
        <ShoppingBag size={17} aria-hidden="true" /> Hvar á að kaupa
      </a>
    </div>
  )
}

/* ------------------------------------------------------------------------- */
export default function Page() {
  const reduce = useReducedMotion()
  const { scrollY, docH, lenisRef } = useScrollDriver(reduce)
  const jumpTo = useCallback((y: number) => {
    const l = lenisRef.current
    if (l) l.scrollTo(y)
    else window.scrollTo({ top: y })
  }, [lenisRef])

  const progress = useMemo(() => clamp(scrollY / docH, 0, 1), [scrollY, docH])
  // temperature ramps over the journey portion (top ~58% of the page)
  const temp = useMemo(() => clamp(progress / 0.42, 0, 1), [progress])
  useEffect(() => {
    document.title = '64° Reykjavik Distillery — Frá villtu í glas'
  }, [])
  useEffect(() => {
    setThemeColor(GROUND)
    return () => setThemeColor(GROUND)
  }, [])

  return (
    <div className="min-h-screen font-sans antialiased" style={{ background: GROUND, color: BONE, isolation: 'isolate' }}>
      <TemperatureBackdrop t={temp} />

      {/* Full-viewport fluid, fixed BEHIND all content. Skipped entirely under
          prefers-reduced-motion — the page reads well without it and we avoid
          loading Three.js (the WebGL renderer) for users who opt out of motion. */}
      {!reduce && (
        <div className="pointer-events-none fixed inset-0 -z-[1]">
          <LiquidEther
            colors={LIQUID_COLORS}
            mouseForce={42}
            cursorSize={172}
            autoSpeed={0.4}
            autoIntensity={2.3}
            autoResumeDelay={500}
            resolution={0.5}
            dt={0.011}
            isViscous
            viscous={18}
            iterationsViscous={28}
            takeoverDuration={0.5}
            autoRampDuration={0.9}
          />
        </div>
      )}

      <PreviewChrome company={company} />
      <MobileCTA />
      <Thread progress={progress} />

      {/* scroll progress hairline */}
      <div className="fixed inset-x-0 top-0 z-50 h-px" aria-hidden="true">
        <div className="h-full origin-left" style={{ background: AMBER, transform: `scaleX(${progress})` }} />
      </div>

      <TopNav scrolled={scrollY > 60} />
      <Hero />

      <section id="ferdin-anchor" aria-label="Frá villtu í glas">
        <Reveal className="px-5 pt-14 text-center md:pt-20">
          <p className="mx-auto max-w-md font-display text-[clamp(1.1rem,2.6vw,1.5rem)] italic leading-snug" style={{ color: MUTED }}>
            Þrjú skref frá íslenskri heiði í flöskuna þína.
          </p>
        </Reveal>
        {BEATS.map((b, i) => (
          <JourneyBeat key={b.id} beat={b} scrollY={scrollY} reduce={reduce} index={i} />
        ))}
      </section>

      <Collection scrollY={scrollY} reduce={reduce} jumpTo={jumpTo} />
      <BuySection />
      <VisitSection />

      <PreviewFooter company={company} />
    </div>
  )
}
