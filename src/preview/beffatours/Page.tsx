import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode, RefObject } from 'react'
import { useReducedMotion } from 'framer-motion'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import {
  BOAT,
  BOOKING,
  BREATH,
  CONTACT,
  DEPARTURES,
  HERO,
  INCLUDED,
  INCLUDED_INTRO,
  PHOTOS,
  SEA,
  SPECIES,
  SPECIES_INTRO,
  STICKY,
  TOUR,
} from './data'

const company = getPreviewCompany('beffatours')

const U = 'https://images.unsplash.com/'
const photo = (id: string, w = 1400) => `${U}${id}?q=80&w=${w}&auto=format&fit=crop`

/* -------------------------------------------------------------------------- */
/* Scroll progress — a single manual, passive scroll listener shared by the    */
/* hero. rAF-throttled. Returns 0..1 progress through the first viewport.       */
/* (Deliberately NOT framer useScroll/useTransform: those use rAF that freezes  */
/*  in a backgrounded tab, which would strand the whale mid-rise.)             */
/* -------------------------------------------------------------------------- */
function useHeroProgress(ref: RefObject<HTMLElement>, reduce: boolean) {
  const [p, setP] = useState(0)
  useEffect(() => {
    if (reduce) {
      setP(0)
      return
    }
    let raf = 0
    const measure = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const h = el.offsetHeight || 1
      // 0 at top of hero, 1 once the hero has fully scrolled past.
      const next = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / h))
      setP(next)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ref, reduce])
  return p
}

/* -------------------------------------------------------------------------- */
/* IntersectionObserver reveal — fade + lift, gated by reduced motion.         */
/* One-shot, below-the-fold only (never gates the hero).                       */
/* -------------------------------------------------------------------------- */
function Reveal({
  children,
  className = '',
  delay = 0,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'li' | 'section' | 'article' | 'figure'
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    if (reduce) {
      setShown(true)
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true)
            io.disconnect()
          }
        }
      },
      { rootMargin: '-64px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduce])
  const Tag = as as 'div'
  return (
    <Tag
      ref={ref as RefObject<HTMLDivElement>}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(26px)',
        transition: reduce
          ? undefined
          : `opacity 0.8s cubic-bezier(0.21,0.65,0.36,1) ${delay}s, transform 0.8s cubic-bezier(0.21,0.65,0.36,1) ${delay}s`,
      }}
    >
      {children}
    </Tag>
  )
}

/* -------------------------------------------------------------------------- */
/* Seven-seat device — the scarcity + intimacy motif.                          */
/* `filled` seats are gone (hollow/dim); the rest glow buoy-orange = free.      */
/* The text is the accessible source of truth; dots are aria-hidden.           */
/* -------------------------------------------------------------------------- */
function Seats({
  filled,
  total = 7,
  size = 12,
  label,
  align = 'start',
}: {
  filled: number
  total?: number
  size?: number
  label?: string
  align?: 'start' | 'center'
}) {
  const free = Math.max(0, total - filled)
  const full = free <= 0
  const text = label ?? (full ? BOOKING.fullTag : `${free} af ${total} sætum laus`)
  return (
    <div
      className={`flex flex-wrap items-center gap-x-2.5 gap-y-1.5 ${
        align === 'center' ? 'justify-center' : ''
      }`}
    >
      <ul className="flex items-center" style={{ gap: Math.max(5, size * 0.5) }} aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => {
          const taken = i < filled
          return (
            <li
              key={i}
              style={{
                width: size,
                height: size,
                borderRadius: 999,
                background: taken ? 'transparent' : SEA.orange,
                border: taken ? `1.5px solid ${SEA.fog}` : `1.5px solid ${SEA.orange}`,
                boxShadow: taken ? 'none' : `0 0 9px ${SEA.orange}66`,
              }}
            />
          )
        })}
      </ul>
      <span
        className="text-xs font-medium tracking-wide tabular-nums"
        style={{ color: full ? SEA.muted : SEA.orange }}
      >
        {text}
      </span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* THE SIGNATURE — a cinematic humpback gliding up through the cold deep, shown
   as a seamless looping background video. (Atmospheric AI-generated footage;
   this is a concept prototype, see the footer.) A subtle scroll parallax keeps
   the hero alive; under reduced motion it holds on the poster frame. */
function WhaleVideo({ p, reduce }: { p: number; reduce: boolean }) {
  const base = import.meta.env.BASE_URL
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.muted = true
    if (reduce) {
      v.pause()
      return
    }
    const played = v.play()
    if (played && typeof played.catch === 'function') played.catch(() => {})
  }, [reduce])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        poster={`${base}media/beffa-whale-poster.jpg`}
        autoPlay={!reduce}
        muted
        loop
        playsInline
        preload="metadata"
        style={{
          transform: reduce
            ? undefined
            : `scale(${(1 + p * 0.06).toFixed(3)}) translateY(${(p * -16).toFixed(1)}px)`,
          willChange: 'transform',
        }}
      >
        <source src={`${base}media/beffa-whale-loop.mp4`} type="video/mp4" />
      </video>
      {/* seat the footage in the brand palette: a cool vignette and a darker foot
          so the headline always holds over it */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 90% at 50% 28%, transparent 42%, ${SEA.abyss}66 100%), linear-gradient(180deg, ${SEA.deep}33 0%, transparent 24%, ${SEA.abyss}aa 100%)`,
        }}
      />
    </div>
  )
}

/* Booking mailto with an editable, pre-filled request template. */
function bookingMailto(label?: string) {
  const subject = label
    ? `Bókunarbeiðni, Beffa Tours (${label})`
    : 'Bókunarbeiðni, Beffa Tours hvalaskoðun'
  const body = [
    'Góðan dag,',
    '',
    'Mig langar að óska eftir sæti í hvalaskoðun á Arnarfirði:',
    '',
    `Brottför: ${label ?? '(hvaða dagur og tími?)'}`,
    'Fjöldi gesta: ',
    'Nafn: ',
    'Sími: ',
    '',
    'Takk fyrir,',
  ].join('\n')
  return `mailto:${company.ownerEmail}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`
}

/* -------------------------------------------------------------------------- */
/* Mobile sticky CTA — appears after the hero. Full-width along the very       */
/* bottom so it never collides with PreviewChrome's corner buttons.            */
/* Reflects the live free-seat count of the selected departure.                */
/* -------------------------------------------------------------------------- */
function MobileBar({ free, full }: { free: number; full: boolean }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    let raf = 0
    const measure = () => {
      raf = 0
      setShow(window.scrollY > 620)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])
  const sub = full ? `${STICKY.sub} · ${BOOKING.fullTag}` : `${free} sæti laus · 2 klst`
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-[opacity,transform] duration-500 md:hidden"
      style={{
        borderColor: '#ffffff14',
        background: '#0a1822f2',
        opacity: show ? 1 : 0,
        transform: show ? 'none' : 'translateY(120%)',
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold" style={{ color: SEA.text }}>
            {STICKY.label}
          </p>
          <p className="truncate text-xs tabular-nums" style={{ color: SEA.muted }}>
            {sub}
          </p>
        </div>
        <a
          href="#bokun"
          lang="is"
          className="shrink-0 rounded-full px-5 py-3 text-sm font-bold transition-transform active:scale-95"
          style={{ background: SEA.orange, color: SEA.ink, minHeight: 44 }}
        >
          {STICKY.cta}
        </a>
      </div>
    </div>
  )
}

/* Small reusable section label chip. */
function Kicker({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.28em]"
      style={{ color: SEA.faint }}
    >
      <span aria-hidden="true" className="inline-block h-px w-7" style={{ background: SEA.orange }} />
      {children}
    </span>
  )
}

/* Shared CTA styling for the warm buoy-orange button. */
const ctaStyle: CSSProperties = {
  background: SEA.orange,
  color: SEA.ink,
  minHeight: 44,
  boxShadow: `0 12px 34px -12px ${SEA.orange}aa`,
  outlineColor: SEA.orange,
}

export default function Page() {
  const reduce = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)
  const p = useHeroProgress(heroRef, !!reduce)

  // Next departure with a free seat = the smart default + the "next available".
  const firstFreeId = useMemo(
    () => DEPARTURES.find((d) => BOAT.seats - d.taken > 0)?.id ?? DEPARTURES[0].id,
    [],
  )
  const [picked, setPicked] = useState<string>(firstFreeId)

  useEffect(() => {
    document.title = 'Beffa Tours — hvalaskoðun á Arnarfirði'
    setThemeColor(SEA.deep)
  }, [])

  const pickedDep = DEPARTURES.find((d) => d.id === picked)
  const pickedFree = pickedDep ? Math.max(0, BOAT.seats - pickedDep.taken) : 0
  const pickedFull = pickedFree <= 0
  const pickedLabel = pickedDep
    ? `${pickedDep.weekday} ${pickedDep.date} kl. ${pickedDep.time}`
    : undefined

  return (
    <div className="min-h-screen font-sans antialiased" style={{ background: SEA.deep, color: SEA.text }}>
      <PreviewChrome company={company} />
      <MobileBar free={pickedFree} full={pickedFull} />

      {/* ===================== HERO + SIGNATURE WHALE ===================== */}
      <header
        ref={heroRef}
        className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
      >
        {/* Vertical depth gradient: pale cold sky → deep sea → abyss */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, #18353f 0%, ${SEA.deep} 44%, ${SEA.abyss} 100%)`,
          }}
        />

        <WhaleVideo p={p} reduce={!!reduce} />

        {/* readability scrim under the copy so text holds over the whale */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[62%]"
          style={{ background: `linear-gradient(180deg, transparent, ${SEA.abyss}cc 78%)` }}
        />

        {/* Copy — ALWAYS opacity:1. The intro animates transform only, so a
            backgrounded tab that freezes the animation can never blank the hero
            (the guardrail failure mode). No Framer / whileInView here. */}
        <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-20 pt-28 sm:pb-28">
          <div style={reduce ? undefined : { animation: 'beffaRise 0.9s cubic-bezier(0.21,0.65,0.36,1) both' }}>
            <Kicker>{HERO.kicker}</Kicker>
            <h1
              className="mt-5 max-w-3xl font-schibsted font-semibold leading-[0.96] tracking-tight"
              style={{ color: SEA.text, fontSize: 'clamp(2.5rem, 9vw, 5.5rem)' }}
            >
              {HERO.h1}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed sm:text-xl" style={{ color: SEA.textDim }}>
              {HERO.sub}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <a
                href="#bokun"
                lang="is"
                className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-base font-bold transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={ctaStyle}
              >
                {HERO.cta}
              </a>
              <a
                href="#ferdin"
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3.5 text-base font-medium transition-colors hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ borderColor: '#ffffff26', color: SEA.text, minHeight: 44, outlineColor: SEA.orange }}
              >
                {HERO.cta2}
              </a>
            </div>

            {/* Seven-seat device — the intimacy promise, up front */}
            <div className="mt-10">
              <Seats filled={0} label={`Aðeins ${BOAT.seats} sæti í hverri ferð`} />
            </div>
          </div>
        </div>

        {/* Quiet scroll hint */}
        <div aria-hidden="true" className="relative z-10 mx-auto mb-6 hidden w-full max-w-5xl px-5 sm:block">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em]" style={{ color: SEA.faint }}>
            <span
              className="inline-block h-3.5 w-px"
              style={{ background: `linear-gradient(${SEA.faint}, transparent)` }}
            />
            {HERO.scrollHint}
          </span>
        </div>
      </header>

      {/* ============================ THE TOUR ============================ */}
      <section
        id="ferdin"
        className="relative mx-auto w-full max-w-5xl px-5 py-24 sm:py-32"
        aria-labelledby="tour-h"
      >
        <Reveal>
          <Kicker>{TOUR.kicker}</Kicker>
          <h2
            id="tour-h"
            className="mt-4 max-w-2xl font-schibsted font-semibold leading-tight"
            style={{ fontSize: 'clamp(1.9rem, 5vw, 3rem)' }}
          >
            {TOUR.title}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed" style={{ color: SEA.textDim }}>
            {TOUR.lead}
          </p>
        </Reveal>

        <ol
          className="mt-14 grid gap-px overflow-hidden rounded-2xl sm:grid-cols-3"
          style={{ background: '#ffffff12' }}
        >
          {TOUR.steps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 0.08}>
              <div className="h-full p-7" style={{ background: SEA.deep }}>
                <span className="font-mono text-sm font-medium tabular-nums" style={{ color: SEA.orange }}>
                  {s.n}
                </span>
                <h3 className="mt-3 font-schibsted text-xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: SEA.textDim }}>
                  {s.d}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>

        {/* Species — honest likelihoods */}
        <Reveal className="mt-20">
          <h3 className="font-schibsted text-xl font-semibold">{SPECIES_INTRO.title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: SEA.textDim }}>
            {SPECIES_INTRO.body}
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SPECIES.map((sp) => (
              <li
                key={sp.is}
                className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3"
                style={{ borderColor: '#ffffff14', background: '#ffffff06' }}
              >
                <div className="min-w-0">
                  <p className="font-medium" style={{ color: SEA.text }}>
                    {sp.is}
                  </p>
                  <p className="text-xs" style={{ color: SEA.faint }}>
                    {sp.en}
                  </p>
                </div>
                <span
                  className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium"
                  style={
                    sp.rare
                      ? { color: SEA.muted, background: '#ffffff0d', border: '1px solid #ffffff1a' }
                      : { color: SEA.orange, background: `${SEA.orange}1a`, border: `1px solid ${SEA.orange}33` }
                  }
                >
                  {sp.chance}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ===================== THE BREATH (full-bleed) ==================== */}
      <section aria-labelledby="breath-h" className="relative overflow-hidden border-y" style={{ borderColor: '#ffffff0d' }}>
        <div aria-hidden="true" className="absolute inset-0" style={{ background: SEA.abyss }} />
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.14]">
          <Img
            src={photo(PHOTOS.sea, 1800)}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
            style={{ filter: 'grayscale(0.6) brightness(0.5)' }}
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: `radial-gradient(120% 80% at 50% 120%, ${SEA.deep} 0%, transparent 70%)` }}
        />
        <Reveal as="figure" className="relative mx-auto w-full max-w-4xl px-5 py-28 text-center sm:py-36">
          <blockquote
            id="breath-h"
            className="mx-auto max-w-3xl font-schibsted font-medium leading-[1.18] tracking-tight"
            style={{ color: SEA.text, fontSize: 'clamp(1.7rem, 4.6vw, 3.1rem)' }}
          >
            {BREATH.quote}
          </blockquote>
          <figcaption className="mt-7 text-[11px] uppercase tracking-[0.28em]" style={{ color: SEA.faint }}>
            {BREATH.attribution}
          </figcaption>
        </Reveal>
      </section>

      {/* ============================ THE BOAT ============================ */}
      <section
        className="relative overflow-hidden"
        style={{ background: '#0a1822' }}
        aria-labelledby="boat-h"
      >
        {/* atmospheric still sea, behind, very dim */}
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.16]">
          <Img
            src={photo(PHOTOS.sea, 1800)}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
            style={{ filter: 'grayscale(0.5) brightness(0.55)' }}
          />
        </div>
        <div className="relative mx-auto grid w-full max-w-5xl gap-12 px-5 py-24 sm:py-32 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal>
            <Kicker>{BOAT.kicker}</Kicker>
            <h2
              id="boat-h"
              className="mt-4 font-schibsted font-semibold leading-tight"
              style={{ fontSize: 'clamp(1.9rem, 5vw, 3rem)' }}
            >
              {BOAT.title}
            </h2>
            <p className="mt-5 text-xl font-medium" style={{ color: SEA.text }}>
              {BOAT.lead}
            </p>

            {/* the contrast device: 200 vs 7, made visual */}
            <div className="mt-6 flex items-stretch gap-3">
              <div
                className="flex-1 rounded-xl border px-4 py-3"
                style={{ borderColor: '#ffffff12', background: '#ffffff05' }}
              >
                <p className="font-mono text-2xl font-semibold tabular-nums" style={{ color: SEA.muted }}>
                  {BOAT.contrast.big}
                </p>
                <p className="mt-0.5 text-xs" style={{ color: SEA.faint }}>
                  gestir á stóru bátunum
                </p>
              </div>
              <div
                className="flex items-center text-2xl font-light"
                style={{ color: SEA.faint }}
                aria-hidden="true"
              >
                vs
              </div>
              <div
                className="flex-1 rounded-xl border px-4 py-3"
                style={{ borderColor: `${SEA.orange}40`, background: `${SEA.orange}12` }}
              >
                <p className="font-mono text-2xl font-semibold tabular-nums" style={{ color: SEA.orange }}>
                  {BOAT.contrast.here}
                </p>
                <p className="mt-0.5 text-xs" style={{ color: SEA.muted }}>
                  gestir á Beffu
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-xl leading-relaxed" style={{ color: SEA.textDim }}>
              {BOAT.body}
            </p>

            <dl
              className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-2xl sm:grid-cols-4"
              style={{ background: '#ffffff12' }}
            >
              {BOAT.specs.map((s) => (
                <div key={s.k} className="px-4 py-5" style={{ background: '#0a1822' }}>
                  <dt className="text-[11px] uppercase tracking-[0.18em]" style={{ color: SEA.faint }}>
                    {s.k}
                  </dt>
                  <dd className="mt-1 font-schibsted text-lg font-semibold">{s.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* "Sjö sæti" diagram — a calm boat plan with seven seats */}
          <Reveal as="figure" delay={0.1}>
            <div className="rounded-3xl border p-7" style={{ borderColor: '#ffffff14', background: '#0c1c2699' }}>
              <svg
                viewBox="0 0 220 320"
                className="mx-auto block w-full max-w-[230px]"
                role="img"
                aria-label={`Skýringarmynd: báturinn Beffa með sjö sætum, mest ${BOAT.seats} gestir`}
              >
                {/* hull */}
                <path
                  d="M110 8 C 165 60, 190 150, 175 270 C 170 300, 145 312, 110 312 C 75 312, 50 300, 45 270 C 30 150, 55 60, 110 8 Z"
                  fill="#0e2530"
                  stroke="#28424e"
                  strokeWidth="2"
                />
                {/* deck line */}
                <path
                  d="M110 26 C 152 70, 172 150, 160 262 C 156 286, 138 296, 110 296 C 82 296, 64 286, 60 262 C 48 150, 68 70, 110 26 Z"
                  fill="none"
                  stroke="#1c3641"
                  strokeWidth="1.5"
                />
                {/* seven seats */}
                {[
                  [110, 90],
                  [85, 130],
                  [135, 130],
                  [85, 180],
                  [135, 180],
                  [85, 230],
                  [135, 230],
                ].map(([cx, cy], i) => (
                  <g key={i}>
                    <circle cx={cx} cy={cy} r="13" fill={SEA.orange} opacity="0.18" />
                    <circle cx={cx} cy={cy} r="7" fill={SEA.orange} />
                  </g>
                ))}
                {/* helm */}
                <rect x="98" y="250" width="24" height="20" rx="4" fill="#28424e" />
              </svg>
              <figcaption className="mt-5">
                <Seats filled={0} align="center" label={`Mest ${BOAT.seats} gestir um borð`} />
              </figcaption>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================= WHAT'S INCLUDED ======================== */}
      <section className="mx-auto w-full max-w-5xl px-5 py-24 sm:py-32" aria-labelledby="incl-h">
        <Reveal>
          <Kicker>{INCLUDED_INTRO.kicker}</Kicker>
          <h2
            id="incl-h"
            className="mt-4 max-w-2xl font-schibsted font-semibold leading-tight"
            style={{ fontSize: 'clamp(1.9rem, 5vw, 3rem)' }}
          >
            {INCLUDED_INTRO.title}
          </h2>
        </Reveal>
        <ul
          className="mt-12 grid gap-px overflow-hidden rounded-2xl sm:grid-cols-2 lg:grid-cols-3"
          style={{ background: '#ffffff10' }}
        >
          {INCLUDED.map((it, i) => (
            <Reveal as="li" key={it.t} delay={(i % 3) * 0.06}>
              <div className="h-full p-7" style={{ background: SEA.deep }}>
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                  style={{ background: `${SEA.orange}1f`, color: SEA.orange }}
                >
                  ✓
                </span>
                <h3 className="mt-4 font-schibsted text-lg font-semibold">{it.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: SEA.textDim }}>
                  {it.d}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ============================= BOOKING ============================ */}
      <section
        id="bokun"
        className="relative overflow-hidden border-y"
        style={{ borderColor: '#ffffff10', background: '#0a1822' }}
        aria-labelledby="book-h"
      >
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.12]">
          <Img
            src={photo(PHOTOS.fjord, 1800)}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
            style={{ filter: 'grayscale(0.45) brightness(0.6)' }}
          />
        </div>
        <div className="relative mx-auto w-full max-w-5xl px-5 py-24 sm:py-32">
          <Reveal>
            <Kicker>{BOOKING.kicker}</Kicker>
            <h2
              id="book-h"
              className="mt-4 max-w-2xl font-schibsted font-semibold leading-tight"
              style={{ fontSize: 'clamp(1.9rem, 5vw, 3rem)' }}
            >
              {BOOKING.title}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed" style={{ color: SEA.textDim }}>
              {BOOKING.lead}
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {DEPARTURES.map((d, i) => {
              const free = Math.max(0, BOAT.seats - d.taken)
              const full = free <= 0
              const active = picked === d.id
              const isNext = !full && d.id === firstFreeId
              return (
                <Reveal key={d.id} delay={(i % 2) * 0.06} className="h-full">
                  <button
                    type="button"
                    disabled={full}
                    onClick={() => setPicked(d.id)}
                    aria-pressed={active}
                    aria-label={`${BOOKING.selectAria}: ${d.weekday} ${d.date} kl. ${d.time}, ${
                      full ? BOOKING.fullTag : `${free} af ${BOAT.seats} sætum laus`
                    }`}
                    className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border p-5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-55"
                    style={{
                      minHeight: 44,
                      borderColor: active ? SEA.orange : '#ffffff1a',
                      background: active ? `${SEA.orange}12` : '#0c1c2680',
                      outlineColor: SEA.orange,
                    }}
                  >
                    {isNext && (
                      <span
                        className="absolute right-0 top-0 rounded-bl-xl px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]"
                        style={{ background: SEA.orange, color: SEA.ink }}
                      >
                        {BOOKING.nextLabel}
                      </span>
                    )}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-schibsted text-lg font-semibold" style={{ color: SEA.text }}>
                          {d.weekday} {d.date}
                        </p>
                        <p className="text-sm tabular-nums" style={{ color: SEA.muted }}>
                          Brottför kl. {d.time} · 2 klst
                        </p>
                      </div>
                      <span
                        aria-hidden="true"
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs transition-colors"
                        style={{
                          borderColor: active ? SEA.orange : '#ffffff2a',
                          color: active ? SEA.orange : 'transparent',
                          background: active ? `${SEA.orange}1a` : 'transparent',
                        }}
                      >
                        ✓
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 sm:mt-auto sm:pt-4">
                      <Seats filled={d.taken} size={10} />
                      <span className="font-mono text-sm tabular-nums" style={{ color: SEA.text }}>
                        {d.price.toLocaleString('is-IS')} {BOOKING.perPerson}
                      </span>
                    </div>
                  </button>
                </Reveal>
              )
            })}
          </div>

          <Reveal className="mt-9">
            <div
              className="flex flex-col items-start gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center sm:justify-between"
              style={{ borderColor: '#ffffff14', background: '#0c1c2699' }}
            >
              <div className="min-w-0">
                <p className="text-sm" style={{ color: SEA.muted }}>
                  {BOOKING.pickedLabel}
                </p>
                <p className="mt-0.5 font-schibsted text-lg font-semibold" style={{ color: SEA.text }}>
                  {pickedLabel ?? BOOKING.pickPrompt}
                </p>
                {pickedDep && (
                  <div className="mt-2">
                    <Seats filled={pickedDep.taken} size={9} />
                  </div>
                )}
              </div>
              <a
                href={bookingMailto(pickedLabel)}
                lang="is"
                className="inline-flex w-full items-center justify-center rounded-full px-7 py-3.5 text-base font-bold transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto"
                style={ctaStyle}
              >
                {BOOKING.cta}
              </a>
            </div>
            <p className="mt-3 text-xs leading-relaxed" style={{ color: SEA.faint }}>
              {BOOKING.note}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ====================== PRACTICAL & CONTACT ====================== */}
      <section
        className="mx-auto w-full max-w-5xl px-5 py-24 pb-28 sm:py-32 md:pb-32"
        aria-labelledby="contact-h"
      >
        <Reveal>
          <Kicker>{CONTACT.kicker}</Kicker>
          <h2
            id="contact-h"
            className="mt-4 max-w-2xl font-schibsted font-semibold leading-tight"
            style={{ fontSize: 'clamp(1.9rem, 5vw, 3rem)' }}
          >
            {CONTACT.title}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Map-style panel */}
          <Reveal>
            <div
              className="relative overflow-hidden rounded-3xl border"
              style={{ borderColor: '#ffffff14', background: '#0a1822', minHeight: 280 }}
            >
              {/* stylised fjord map */}
              <svg
                viewBox="0 0 400 280"
                className="h-full w-full"
                role="img"
                aria-label="Skýringarkort: Bíldudalshöfn við Arnarfjörð"
              >
                <rect width="400" height="280" fill="#0a1822" />
                {/* fjord water */}
                <path
                  d="M0 150 C 90 130, 150 165, 230 150 C 300 137, 360 160, 400 150 L400 280 L0 280 Z"
                  fill="#0e2530"
                />
                {/* subtle contour ridges */}
                {[40, 78, 116].map((y, i) => (
                  <path
                    key={y}
                    d={`M0 ${y} C 110 ${y - 18}, 190 ${y + 14}, 290 ${y - 8} C 340 ${y - 18}, 380 ${y + 6}, 400 ${y}`}
                    fill="none"
                    stroke="#1c3641"
                    strokeWidth="1.5"
                    opacity={0.8 - i * 0.18}
                  />
                ))}
                {/* harbour marker */}
                <g transform="translate(150 150)">
                  <circle r="22" fill={`${SEA.orange}22`} />
                  <circle r="6" fill={SEA.orange} />
                  {!reduce && (
                    <circle r="6" fill="none" stroke={SEA.orange} strokeWidth="1.5">
                      <animate attributeName="r" values="6;20;6" dur="3.6s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0;0.8" dur="3.6s" repeatCount="indefinite" />
                    </circle>
                  )}
                </g>
                <text x="150" y="200" textAnchor="middle" fill={SEA.muted} fontSize="12" fontFamily="monospace">
                  {CONTACT.coordLabel}
                </text>
              </svg>
              <div className="pointer-events-none absolute left-5 top-5">
                <p className="font-schibsted text-lg font-semibold" style={{ color: SEA.text }}>
                  {CONTACT.harbour}
                </p>
                <p className="text-sm" style={{ color: SEA.muted }}>
                  {CONTACT.address}
                </p>
              </div>
            </div>
          </Reveal>

          {/* One clean contact card */}
          <Reveal delay={0.08}>
            <div
              className="flex h-full flex-col rounded-3xl border p-7"
              style={{ borderColor: '#ffffff14', background: '#0c1c2699' }}
            >
              <p className="text-sm leading-relaxed" style={{ color: SEA.textDim }}>
                {CONTACT.bookingVia}. {CONTACT.bookingViaNote}
              </p>

              <dl className="mt-6 space-y-4">
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.18em]" style={{ color: SEA.faint }}>
                    {CONTACT.phoneLabel}
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={CONTACT.phoneHref}
                      className="inline-block font-schibsted text-xl font-semibold underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{ color: SEA.text, outlineColor: SEA.orange, minHeight: 44 }}
                    >
                      {CONTACT.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.18em]" style={{ color: SEA.faint }}>
                    {CONTACT.emailLabel}
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={bookingMailto(pickedLabel)}
                      className="inline-block font-schibsted text-xl font-semibold underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{ color: SEA.text, outlineColor: SEA.orange, minHeight: 44 }}
                    >
                      {CONTACT.email}
                    </a>
                  </dd>
                </div>
              </dl>

              <ul className="mt-6 space-y-2">
                {CONTACT.practical.map((line) => (
                  <li key={line} className="flex gap-2.5 text-sm leading-relaxed" style={{ color: SEA.textDim }}>
                    <span aria-hidden="true" style={{ color: SEA.orange }}>
                      ·
                    </span>
                    {line}
                  </li>
                ))}
              </ul>

              <p className="mt-auto pt-6 text-sm font-medium" style={{ color: SEA.orange }}>
                {CONTACT.family}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <PreviewFooter company={company} />

      {/* Hero intro keyframes — TRANSFORM ONLY, runs once on mount. Opacity is
          never touched, so if the tab is backgrounded mid-animation and the
          frame freezes, the hero copy stays fully visible. */}
      <style>{`
        @keyframes beffaRise {
          from { transform: translateY(18px); }
          to   { transform: none; }
        }
      `}</style>
    </div>
  )
}
