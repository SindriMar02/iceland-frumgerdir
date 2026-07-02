import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
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
   so the array reference is stable across renders. */
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
   Scroll driver. Lenis gives buttery smooth scroll; scroll-linked visuals
   SUBSCRIBE to it and write styles straight to the DOM. The scroll position
   never enters React state, so scrolling re-renders nothing — the single
   biggest jank source in the previous version (a full page-tree render per
   scrolled pixel). Under reduced motion Lenis is off and we fall back to a
   passive window 'scroll' listener. Discrete UI (nav background, active
   bottle) still uses state, but only flips when the value actually changes.
--------------------------------------------------------------------------- */
type ScrollListener = (y: number, docH: number) => void
type Subscribe = (l: ScrollListener) => () => void

function useScrollDriver(reduce: boolean | null) {
  const listenersRef = useRef<Set<ScrollListener>>(new Set())
  const posRef = useRef({ y: 0, docH: 1 })
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const pos = posRef.current
    const emit = () => listenersRef.current.forEach((l) => l(pos.y, pos.docH))
    const measure = () => {
      pos.docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      emit()
    }
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
      pos.y = lenis.scroll
      emit()
      lenis.on('scroll', () => {
        pos.y = lenis ? lenis.scroll : 0
        emit()
      })
      const loop = (time: number) => {
        lenis?.raf(time)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    } else {
      onWin = () => {
        pos.y = window.scrollY || window.pageYOffset
        emit()
      }
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

  const subscribe = useCallback<Subscribe>((l) => {
    listenersRef.current.add(l)
    l(posRef.current.y, posRef.current.docH)
    return () => {
      listenersRef.current.delete(l)
    }
  }, [])

  return { subscribe, lenisRef }
}

/* --- Fixed temperature backdrop: cools at the top, warms toward the still --
   Two STATIC gradient layers; scroll crossfades the warm one in via opacity
   (compositor-only) instead of rebuilding a full-viewport gradient string per
   frame, which forced a full-screen repaint on every scroll tick. */
function TemperatureBackdrop({ subscribe }: { subscribe: Subscribe }) {
  const warmRef = useRef<HTMLDivElement>(null)
  useEffect(
    () =>
      subscribe((y, docH) => {
        const t = clamp(y / docH / 0.42, 0, 1)
        if (warmRef.current) warmRef.current.style.opacity = t.toFixed(3)
      }),
    [subscribe],
  )
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ background: 'radial-gradient(125% 80% at 50% -8%, rgba(116,201,168,0.06), transparent 58%), #0a0b0a' }}
    >
      <div
        ref={warmRef}
        className="absolute inset-0"
        style={{
          opacity: 0,
          willChange: 'opacity',
          background: 'radial-gradient(125% 80% at 50% -8%, rgba(200,136,30,0.16), transparent 58%), #0b0a07',
        }}
      />
    </div>
  )
}

/* --- The thread: a hairline that fills with amber as you descend ----------
   Fill scales and the dot rides a transform — no per-frame layout writes. */
function Thread({ subscribe }: { subscribe: Subscribe }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  useEffect(
    () =>
      subscribe((y, docH) => {
        const p = clamp(y / docH, 0, 1)
        if (fillRef.current) fillRef.current.style.transform = `scaleY(${p})`
        const h = wrapRef.current ? wrapRef.current.clientHeight : 0
        if (dotRef.current) dotRef.current.style.transform = `translate3d(-50%, ${p * h - 3}px, 0)`
      }),
    [subscribe],
  )
  return (
    <div ref={wrapRef} aria-hidden="true" className="pointer-events-none fixed left-4 top-0 z-30 hidden h-screen w-px md:block">
      <div className="absolute inset-0 bg-white/10" />
      <div
        ref={fillRef}
        className="absolute inset-x-0 top-0 h-full origin-top"
        style={{ transform: 'scaleY(0)', willChange: 'transform', background: `linear-gradient(${AMBER_GLOW}, ${AMBER})` }}
      />
      <div
        ref={dotRef}
        className="absolute left-1/2 top-0 h-1.5 w-1.5 rounded-full"
        style={{ transform: 'translate3d(-50%, -3px, 0)', willChange: 'transform', background: AMBER_GLOW, boxShadow: `0 0 10px ${AMBER}` }}
      />
    </div>
  )
}

/* --- Scroll progress hairline along the very top edge --------------------- */
function ProgressBar({ subscribe }: { subscribe: Subscribe }) {
  const barRef = useRef<HTMLDivElement>(null)
  useEffect(
    () =>
      subscribe((y, docH) => {
        if (barRef.current) barRef.current.style.transform = `scaleX(${clamp(y / docH, 0, 1)})`
      }),
    [subscribe],
  )
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-px" aria-hidden="true">
      <div ref={barRef} className="h-full origin-left" style={{ background: AMBER, transform: 'scaleX(0)', willChange: 'transform' }} />
    </div>
  )
}

/* --- Slim top nav with the real 64° mark ----------------------------------
   Subscribes itself; state only flips when the 60px threshold is crossed. */
function TopNav({ subscribe }: { subscribe: Subscribe }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => subscribe((y) => setScrolled(y > 60)), [subscribe])
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

/* --- A journey beat --------------------------------------------------------
   Parallax drift is written straight to a wrapper div from the scroll driver;
   the beat itself never re-renders while scrolling. */
function JourneyBeat({ beat, subscribe, reduce, index }: { beat: Beat; subscribe: Subscribe; reduce: boolean | null; index: number }) {
  const wrap = useRef<HTMLDivElement>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)
  const reveal = useReveal<HTMLDivElement>(reduce)

  useEffect(() => {
    if (reduce || beat.kind !== 'land') return
    let top = 0
    let vh = window.innerHeight
    const measure = () => {
      top = wrap.current ? wrap.current.offsetTop : 0
      vh = window.innerHeight
    }
    measure()
    const settle = window.setTimeout(measure, 500)
    window.addEventListener('resize', measure)
    let last = NaN
    const unsub = subscribe((y) => {
      const shift = clamp((y - top + vh) * 0.04, -50, 50)
      if (shift === last || !parallaxRef.current) return
      last = shift
      parallaxRef.current.style.transform = `translate3d(0, ${-shift}px, 0)`
    })
    return () => {
      window.clearTimeout(settle)
      window.removeEventListener('resize', measure)
      unsub()
    }
  }, [subscribe, reduce, beat.kind])

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
              <div ref={parallaxRef} className="h-full w-full" style={reduce ? undefined : { willChange: 'transform' }}>
                <Img src={beat.img} alt={beat.alt} className="h-full w-full object-cover" style={{ transform: 'scale(1.12)' }} />
              </div>
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
   up behind it. The scroll subscription only computes the active INDEX —
   state changes ~11 times across the whole scroll instead of every frame,
   and every crossfade (glow, backlight, bottle) is a CSS opacity transition
   the compositor runs for free. The bottle's idle float is a CSS keyframe
   (rd-float) instead of a scroll-linked sine. Keyboard users step the range
   via the numbered rail. */
function bottleCutout(s: Spirit) {
  return s.img.replace('/bottles/', '/bottles/cutout/').replace('.jpg', '.png')
}

function Collection({ subscribe, reduce, jumpTo }: { subscribe: Subscribe; reduce: boolean | null; jumpTo: (y: number) => void }) {
  const wrapRef = useRef<HTMLElement>(null)
  const boxRef = useRef({ top: 0, height: 1 })
  const [index, setIndex] = useState(0)

  const N = SPIRITS.length

  useEffect(() => {
    const measure = () => {
      const el = wrapRef.current
      if (el) boxRef.current = { top: el.offsetTop, height: el.offsetHeight }
    }
    measure()
    const t = window.setTimeout(measure, 400)
    window.addEventListener('resize', measure)
    const unsub = subscribe((y) => {
      const box = boxRef.current
      const vh = window.innerHeight
      const local = clamp((y - box.top) / Math.max(1, box.height - vh), 0, 1)
      const i = Math.round(local * (N - 1))
      setIndex((prev) => (prev === i ? prev : i))
    })
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('resize', measure)
      unsub()
    }
  }, [subscribe, N])

  const active = SPIRITS[index]
  const fade = reduce ? 'none' : 'opacity 0.55s ease'
  const fadeGlow = reduce ? 'none' : 'opacity 0.6s ease'

  return (
    <section ref={wrapRef} id="eimingarnar" aria-label="Eimingarnar — úrvalið" style={{ height: `${N * 44}vh` }} className="relative">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        {/* ambient tone glow — one static layer per spirit, crossfaded by opacity */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {SPIRITS.map((s, i) => (
            <div
              key={s.id}
              className="absolute inset-0"
              style={{ opacity: i === index ? 1 : 0, transition: fadeGlow, background: `radial-gradient(58% 56% at 50% 48%, ${s.tone}26, transparent 70%)` }}
            />
          ))}
        </div>
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
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              {SPIRITS.map((s, i) => (
                <div
                  key={s.id}
                  className="absolute inset-0"
                  style={{ opacity: i === index ? 1 : 0, transition: fadeGlow, background: `radial-gradient(42% 46% at 50% 44%, ${s.tone}40, transparent 70%)` }}
                />
              ))}
            </div>
            {/* idle float lives on this wrapper as a compositor-only keyframe. Bottom is
                inset (not flush) so the floor shadow below has room to sit under the
                bottle instead of drawing across its base — the cutout PNGs fill their
                frame edge-to-edge, so inset-0 left zero room for a shadow to live in. */}
            <div className={`absolute inset-x-0 top-0 bottom-8 ${reduce ? '' : 'rd-float'}`}>
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
                    transition: fade,
                    transform: 'translate3d(-50%, 0, 0)',
                    filter: 'drop-shadow(0 26px 38px rgba(0,0,0,0.6))',
                  }}
                />
              ))}
            </div>
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
              {/* the sticky MobileCTA bar already covers this action on phones — showing it twice is
                  what was crowding the mobile page dots, so this pill is desktop-only */}
              <a href="#kaupa" className="hidden min-h-[48px] items-center gap-2 rounded-full px-6 text-sm font-bold text-[#0a0b0a] outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0b0a] md:inline-flex" style={{ background: AMBER, ['--tw-ring-color' as string]: AMBER_GLOW } as CSSProperties}>
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
              onClick={() => jumpTo(boxRef.current.top + (i / (N - 1)) * (boxRef.current.height - window.innerHeight) + 4)}
              className="group flex items-center gap-2 outline-none focus-visible:opacity-100"
              aria-label={`Sýna ${s.name}`}
              aria-current={i === index ? 'true' : undefined}
            >
              <span className="font-sans text-[10px] tabular-nums transition-colors" style={{ color: i === index ? AMBER_GLOW : 'rgba(255,255,255,0.32)' }}>{String(i + 1).padStart(2, '0')}</span>
              <span className="h-px transition-all duration-300" style={{ width: i === index ? 22 : 9, background: i === index ? AMBER_GLOW : 'rgba(255,255,255,0.32)' }} />
            </button>
          ))}
        </div>

        {/* progress dots (mobile) — parked under the section label, clear of both the
            per-bottle CTA and the sticky MobileCTA bar so nothing crowds it at the bottom */}
        <div className="absolute left-1/2 top-24 flex -translate-x-1/2 items-center gap-1.5 md:hidden">
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
  const { subscribe, lenisRef } = useScrollDriver(reduce)
  const jumpTo = useCallback((y: number) => {
    const l = lenisRef.current
    if (l) l.scrollTo(y)
    else window.scrollTo({ top: y })
  }, [lenisRef])

  useEffect(() => {
    document.title = '64° Reykjavik Distillery — Frá villtu í glas'
  }, [])
  useEffect(() => {
    setThemeColor(GROUND)
    return () => setThemeColor(GROUND)
  }, [])

  return (
    <div className="min-h-screen font-sans antialiased" style={{ background: GROUND, color: BONE, isolation: 'isolate' }}>
      <TemperatureBackdrop subscribe={subscribe} />

      {/* Full-viewport fluid, fixed BEHIND all content. Sized with 100lvh (the
          LARGEST viewport) so the collapsing mobile URL bar never changes the
          container's height — a resize here rebuilds the sim's framebuffers and
          visibly glitches the fluid mid-scroll. Skipped entirely under
          prefers-reduced-motion — the page reads well without it and we avoid
          loading Three.js (the WebGL renderer) for users who opt out of motion. */}
      {!reduce && (
        <div className="pointer-events-none fixed inset-x-0 top-0 -z-[1] h-[100lvh]">
          <LiquidEther
            colors={LIQUID_COLORS}
            mouseForce={42}
            cursorSize={172}
            autoSpeed={0.15}
            autoIntensity={2.3}
            autoResumeDelay={500}
            resolution={0.5}
            dt={0.011}
            isViscous
            viscous={18}
            iterationsViscous={20}
            iterationsPoisson={24}
            takeoverDuration={0.5}
            autoRampDuration={1.4}
          />
        </div>
      )}

      <PreviewChrome company={company} />
      <MobileCTA />
      <Thread subscribe={subscribe} />
      <ProgressBar subscribe={subscribe} />

      <TopNav subscribe={subscribe} />
      <Hero />

      <section id="ferdin-anchor" aria-label="Frá villtu í glas">
        <Reveal className="px-5 pt-14 text-center md:pt-20">
          <p className="mx-auto max-w-md font-display text-[clamp(1.1rem,2.6vw,1.5rem)] italic leading-snug" style={{ color: MUTED }}>
            Þrjú skref frá íslenskri heiði í flöskuna þína.
          </p>
        </Reveal>
        {BEATS.map((b, i) => (
          <JourneyBeat key={b.id} beat={b} subscribe={subscribe} reduce={reduce} index={i} />
        ))}
      </section>

      <Collection subscribe={subscribe} reduce={reduce} jumpTo={jumpTo} />
      <BuySection />
      <VisitSection />

      <PreviewFooter company={company} />
    </div>
  )
}
