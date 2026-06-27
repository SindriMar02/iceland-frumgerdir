import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Check,
  Clock,
  Compass,
  Mail,
  MapPin,
  Minus,
  Phone,
  Plus,
  Quote,
  Ship,
  Waves,
} from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { StickyCta } from '../../components/StickyCta'
import { setThemeColor } from '../../lib/preview'
import {
  ADDRESS,
  ARCHIPELAGO,
  EMAIL,
  ERUPTION,
  FERRY_HREF,
  IMG,
  isk,
  MAPS_HREF,
  PHONE_DISPLAY,
  PHONE_HREF,
  PLAN,
  REVIEWS,
  TOURS,
  TRUST,
  type Isle,
  type Tour,
} from './data'

const company = getPreviewCompany('eyjatours')

/* ── Palette — Deep ocean & the puffin spectrum ───────────────────────── */
const INK = '#0C2A31' //  deep ocean — primary dark ground
const INK2 = '#0F353E' //  raised surface on dark
const INK3 = '#16505C' //  lifted panel / hover on dark
const LIGHTTX = '#EAF3F1' //  near-white text on dark
const DIM = '#A2C0C0' //  muted text on dark (AA on INK)
const BONE = '#F3EFE4' //  warm light ground
const PAPER = '#FBF8F0' //  card on bone
const INKTX = '#13282C' //  text on light
const BODYTX = '#3D4F51' //  body text on light
const CORAL = '#E5573E' //  primary accent — decorative fills, icons, lines
const CORAL_BTN = '#EE6A4F' //  CTA fill behind dark-ink labels (AA ~4.9 on ink)
const CORAL_TX = '#BC3A22' //  coral as text on light (AA)
const GOLD = '#E0A53A' //  warm secondary accent
const TEAL = '#39ADB4' //  cool secondary accent
const MAROON = '#481D27' //  eruption ground — deep oxblood
const MAROON2 = '#6A2A33' //  eruption lift

/* ── Unsplash helpers ─────────────────────────────────────────────────── */
const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`
const srcSet = (id: string) => `${u(id, 828)} 828w, ${u(id, 1280)} 1280w, ${u(id, 2000)} 2000w`

/* ── Reveal — IO + CSS transition, with a failsafe for throttled tabs ──── */
function Reveal({
  children,
  className = '',
  delay = 0,
  y = 26,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    io.observe(el)
    const t = window.setTimeout(() => setShown(true), 1400)
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [])
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translateY(${y}px)`,
        transition: `opacity 0.8s cubic-bezier(0.21,0.65,0.36,1) ${delay}ms, transform 0.8s cubic-bezier(0.21,0.65,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

/* ── Count-up — interval stepped, setTimeout failsafe lands final value ── */
function CountUp({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState(0)
  const started = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const run = () => {
      if (started.current) return
      started.current = true
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setN(to)
        return
      }
      const dur = 1300
      const t0 = Date.now()
      const iv = window.setInterval(() => {
        const p = Math.min(1, (Date.now() - t0) / dur)
        const eased = 1 - Math.pow(1 - p, 3)
        setN(Math.round(to * eased))
        if (p >= 1) window.clearInterval(iv)
      }, 40)
      window.setTimeout(() => {
        window.clearInterval(iv)
        setN(to)
      }, dur + 250)
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          run()
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    const fs = window.setTimeout(run, 1500)
    return () => {
      io.disconnect()
      window.clearTimeout(fs)
    }
  }, [to])
  return (
    <span ref={ref}>
      {prefix}
      {n.toLocaleString('en-US')}
      {suffix}
    </span>
  )
}

/* ── Eyebrow ───────────────────────────────────────────────────────────── */
function Eyebrow({ children, on = 'light' }: { children: ReactNode; on?: 'light' | 'dark' }) {
  return (
    <p
      className="font-hanken text-[0.7rem] font-semibold tracking-[0.26em] uppercase"
      style={{ color: on === 'dark' ? GOLD : CORAL_TX }}
    >
      {children}
    </p>
  )
}

/* ── Primary button (coral pill, dark-ink label, nested arrow) ─────────── */
function BookButton({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-2.5 rounded-full pl-6 pr-2 py-2 text-[0.95rem] font-semibold transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] ${className}`}
      style={{ background: CORAL_BTN, color: INK }}
    >
      {children}
      <span
        className="grid h-9 w-9 place-items-center rounded-full transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        style={{ background: INK, color: CORAL_BTN }}
      >
        <ArrowUpRight className="h-4 w-4" strokeWidth={2.4} />
      </span>
    </a>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  NAV                                                                     */
/* ══════════════════════════════════════════════════════════════════════ */
function Nav() {
  const links = [
    { href: '#tours', label: 'Tours' },
    { href: '#island', label: 'The island' },
    { href: '#story', label: '1973' },
    { href: '#visit', label: 'Visit' },
  ]
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-3 pt-3 sm:pt-4">
      <nav
        className="flex w-full max-w-5xl items-center justify-between gap-3 rounded-full py-2 pl-3 pr-2 shadow-[0_10px_40px_-12px_rgba(5,25,30,0.5)] ring-1 ring-black/5 backdrop-blur-xl"
        style={{ background: 'rgba(251,248,240,0.82)' }}
      >
        <a href="#top" className="flex items-center gap-2" aria-label="Eyjatours, home">
          <img src={IMG.logo} alt="Eyjatours" className="h-9 w-auto sm:h-10" />
        </a>
        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[0.92rem] font-medium transition-colors hover:opacity-70"
              style={{ color: INKTX }}
            >
              {l.label}
            </a>
          ))}
        </div>
        <BookButton href="#book" className="!py-1.5 !pl-5 !text-[0.9rem]">
          Book
        </BookButton>
      </nav>
    </header>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  HERO                                                                    */
/* ══════════════════════════════════════════════════════════════════════ */
function Hero() {
  const rootRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    // Gate the entrance on a real animation frame. In a throttled / backgrounded
    // tab rAF never fires, so the attribute is never added and the hero simply
    // sits at its natural opacity:1 (never trapped hidden). See project lesson.
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => rootRef.current?.setAttribute('data-ey-play', ''))
    })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [])
  return (
    <section ref={rootRef} id="top" className="relative min-h-[100dvh] overflow-hidden" style={{ background: INK }}>
      {/* background image */}
      <div className="absolute inset-0">
        <Img
          src={u(IMG.heroPuffins, 2000)}
          srcSet={srcSet(IMG.heroPuffins)}
          sizes="100vw"
          alt="Atlantic puffins on a grassy clifftop in the Westman Islands"
          fetchpriority="high"
          className="kenburns h-full w-full object-cover"
          fallbackClassName="bg-gradient-to-b from-[#16505C] to-[#0C2A31]"
        />
      </div>
      {/* scrims: bottom + left so the headline always clears AA */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(12,42,49,0.34) 0%, rgba(12,42,49,0.04) 30%, rgba(12,42,49,0.55) 74%, rgba(12,42,49,0.93) 100%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(100deg, rgba(12,42,49,0.74) 0%, rgba(12,42,49,0.18) 48%, transparent 72%)` }}
      />

      <div className="relative mx-auto flex min-h-[100dvh] max-w-6xl flex-col justify-end px-5 pb-24 pt-28 sm:px-8 sm:pb-28">
        <div className="max-w-3xl">
          <div className="ey-rise" style={{ ['--d' as string]: '40ms' }}>
            <Eyebrow on="dark">Vestmannaeyjar · Iceland</Eyebrow>
          </div>
          <h1
            className="ey-rise font-familjen mt-5 text-[clamp(2.7rem,7.4vw,5.3rem)] font-600 leading-[1.02] tracking-[-0.02em]"
            style={{ color: LIGHTTX, ['--d' as string]: '140ms' }}
          >
            Meet the island of
            <br />
            puffins and fire.
          </h1>
          <p
            className="ey-rise mt-6 max-w-xl text-[1.06rem] leading-relaxed"
            style={{ color: '#D4E4E2', ['--d' as string]: '260ms' }}
          >
            One of the world’s largest puffin colonies, a volcano that reshaped the island in 1973, and a
            local who grew up here to show you both.
          </p>
          <div className="ey-rise mt-9 flex flex-wrap items-center gap-3" style={{ ['--d' as string]: '380ms' }}>
            <BookButton href="#book">Book a tour</BookButton>
            <a
              href="#tours"
              className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[0.95rem] font-semibold backdrop-blur-sm transition-colors"
              style={{ borderColor: 'rgba(234,243,241,0.35)', color: LIGHTTX }}
            >
              See the tours
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  TRUST BAND                                                              */
/* ══════════════════════════════════════════════════════════════════════ */
function Trust() {
  const icons = [Waves, MapPin, Compass, Ship]
  return (
    <section style={{ background: INK2 }} aria-label="Why visit with Eyjatours">
      <h2 className="sr-only">Why visit Vestmannaeyjar with Eyjatours</h2>
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-6 px-5 py-7 sm:px-8 md:grid-cols-4">
        {TRUST.map((t, i) => {
          const Icon = icons[i]
          return (
            <div key={t} className="flex items-center gap-3 px-1">
              <Icon className="h-5 w-5 shrink-0" style={{ color: TEAL }} strokeWidth={1.8} aria-hidden />
              <span className="text-[0.86rem] font-medium leading-snug" style={{ color: DIM }}>
                {t}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  INTRO — the pull                                                        */
/* ══════════════════════════════════════════════════════════════════════ */
function Intro() {
  return (
    <section style={{ background: BONE }} className="px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <Eyebrow>You have not seen Iceland yet</Eyebrow>
          <h2
            className="font-familjen mt-5 text-[clamp(2rem,4.4vw,3.4rem)] font-500 leading-[1.08] tracking-[-0.015em]"
            style={{ color: INKTX }}
          >
            The Westman Islands sit just off the south coast, close enough to see and wild enough to feel
            like another country.
          </h2>
          <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed" style={{ color: BODYTX }}>
            Thirty minutes by ferry from the mainland, Heimaey is a single small town wrapped in sea cliffs,
            sitting under a volcano that nearly buried it. Eyjatours is run by people born here, and an
            afternoon with them is the difference between seeing the island and understanding it.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
            {[
              ['~1.6m', 'puffins each summer'],
              ['1973', 'the year the volcano came'],
              ['~15', 'islands in the archipelago'],
            ].map(([k, v]) => (
              <div key={v}>
                <p className="font-familjen text-3xl font-600" style={{ color: CORAL_TX }}>
                  {k}
                </p>
                <p className="mt-1 text-sm" style={{ color: BODYTX }}>
                  {v}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-5">
          <Reveal>
            <figure className="relative">
              <div
                className="overflow-hidden rounded-[26px]"
                style={{ boxShadow: '0 30px 60px -28px rgba(12,42,49,0.45)' }}
              >
                <Img
                  src={u(IMG.puffinPortrait, 1280)}
                  srcSet={srcSet(IMG.puffinPortrait)}
                  sizes="(max-width: 768px) 100vw, 40vw"
                  alt="An Atlantic puffin close up"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-[1.2s] ease-out hover:scale-[1.04]"
                  fallbackClassName="bg-gradient-to-br from-[#16505C] to-[#0C2A31]"
                />
              </div>
              <figcaption
                className="absolute bottom-4 left-4 rounded-full px-4 py-2 text-xs font-semibold backdrop-blur-md"
                style={{ background: 'rgba(12,42,49,0.7)', color: LIGHTTX }}
              >
                The Atlantic puffin, lundi
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  TOURS                                                                   */
/* ══════════════════════════════════════════════════════════════════════ */
function TourCard({ tour, onChoose }: { tour: Tour; onChoose: (id: string) => void }) {
  return (
    <div
      className="group flex h-full flex-col overflow-hidden rounded-[24px] ring-1 transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_rgba(12,42,49,0.5)]"
      style={{ background: PAPER, borderColor: 'transparent', ['--tw-ring-color' as string]: 'rgba(19,40,44,0.08)' }}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Img
          src={u(IMG[tour.image], 1280)}
          srcSet={srcSet(IMG[tour.image])}
          sizes="(max-width: 768px) 100vw, 30vw"
          alt={tour.name}
          className="h-full w-full object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.05]"
          fallbackClassName="bg-gradient-to-br from-[#16505C] to-[#0C2A31]"
        />
        <span
          className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.72rem] font-semibold backdrop-blur-md"
          style={{ background: 'rgba(251,248,240,0.92)', color: INKTX }}
        >
          <Calendar className="h-3.5 w-3.5" style={{ color: CORAL_TX }} strokeWidth={2.2} aria-hidden />
          {tour.window}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em]" style={{ color: CORAL_TX }}>
          {tour.season}
        </p>
        <h3 className="font-familjen mt-1.5 text-2xl font-600" style={{ color: INKTX }}>
          {tour.name}
        </h3>
        <p className="mt-3 text-[0.95rem] leading-relaxed" style={{ color: BODYTX }}>
          {tour.blurb}
        </p>
        <ul className="mt-5 space-y-2">
          {tour.includes.map((inc) => (
            <li key={inc} className="flex items-start gap-2.5 text-[0.9rem]" style={{ color: BODYTX }}>
              <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: TEAL }} strokeWidth={2.4} aria-hidden />
              {inc}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-end justify-between gap-3 border-t pt-5" style={{ borderColor: 'rgba(19,40,44,0.1)' }}>
          <div>
            <p className="text-xs" style={{ color: BODYTX }}>
              <Clock className="mr-1 inline h-3.5 w-3.5 align-[-2px]" strokeWidth={2} aria-hidden />
              {tour.duration}
            </p>
            <p className="mt-1 font-familjen text-xl font-600" style={{ color: INKTX }}>
              {isk(tour.adult)}
              <span className="ml-1 text-sm font-400" style={{ color: BODYTX }}>
                / adult
              </span>
            </p>
          </div>
          <button
            onClick={() => onChoose(tour.id)}
            className="group/btn inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-transform active:scale-95"
            style={{ background: INK, color: LIGHTTX }}
          >
            Choose
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" strokeWidth={2.2} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  )
}

function Tours({ onChoose }: { onChoose: (id: string) => void }) {
  const flagship = TOURS.find((t) => t.flagship)!
  const rest = TOURS.filter((t) => !t.flagship)
  return (
    <section id="tours" style={{ background: BONE }} className="px-5 pb-24 sm:px-8 md:pb-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <Eyebrow>Three ways onto the island</Eyebrow>
          <h2
            className="font-familjen mt-4 text-[clamp(2rem,4.4vw,3.2rem)] font-500 leading-[1.08] tracking-[-0.015em]"
            style={{ color: INKTX }}
          >
            Small groups, a local guide, and the whole island in an afternoon.
          </h2>
        </div>

        {/* flagship — wide feature */}
        <Reveal>
          <div
            className="group grid overflow-hidden rounded-[28px] ring-1 md:grid-cols-2"
            style={{ background: INK, ['--tw-ring-color' as string]: 'rgba(12,42,49,0.1)' }}
          >
            <div className="relative min-h-[280px] overflow-hidden md:min-h-[440px]">
              <Img
                src={u(IMG[flagship.image], 1280)}
                srcSet={srcSet(IMG[flagship.image])}
                sizes="(max-width: 768px) 100vw, 50vw"
                alt={flagship.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                fallbackClassName="bg-gradient-to-br from-[#16505C] to-[#0C2A31]"
              />
              <span
                className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.74rem] font-semibold"
                style={{ background: CORAL_BTN, color: INK }}
              >
                Most popular
              </span>
            </div>
            <div className="flex flex-col justify-center p-8 md:p-11">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em]" style={{ color: GOLD }}>
                {flagship.season} · {flagship.window}
              </p>
              <h3 className="font-familjen mt-2 text-[clamp(1.8rem,3vw,2.6rem)] font-600 leading-tight" style={{ color: LIGHTTX }}>
                {flagship.name}
              </h3>
              <p className="mt-4 text-[1.02rem] leading-relaxed" style={{ color: '#CBE0DE' }}>
                {flagship.blurb}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2.5">
                {flagship.includes.map((inc) => (
                  <div key={inc} className="flex items-start gap-2 text-[0.88rem]" style={{ color: DIM }}>
                    <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: TEAL }} strokeWidth={2.4} aria-hidden />
                    {inc}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <BookButton href="#book">Book this tour</BookButton>
                <p className="text-sm" style={{ color: DIM }}>
                  <span className="font-familjen text-xl font-600" style={{ color: LIGHTTX }}>
                    {isk(flagship.adult)}
                  </span>{' '}
                  adult · {isk(flagship.child)} child · {flagship.duration.toLowerCase()}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* two smaller tours */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {rest.map((t, i) => (
            <Reveal key={t.id} delay={i * 80}>
              <TourCard tour={t} onChoose={onChoose} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  ARCHIPELAGO — the signature illustrative chart                          */
/* ══════════════════════════════════════════════════════════════════════ */
const TONE: Record<Isle['tone'], string> = {
  home: '#EAF3F1',
  puffin: GOLD,
  fire: CORAL,
  young: TEAL,
}

function Archipelago() {
  const [active, setActive] = useState<string>('heimaey')
  const [drawn, setDrawn] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDrawn(true)
          io.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    const t = window.setTimeout(() => setDrawn(true), 1500)
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [])
  const current = ARCHIPELAGO.find((i) => i.id === active)!
  // route visits the four headline stops
  const route = ['heimaey', 'eldfell', 'bjarnarey', 'storhofdi', 'surtsey']
    .map((id) => ARCHIPELAGO.find((i) => i.id === id)!)
    .map((i, idx) => `${idx === 0 ? 'M' : 'L'} ${i.x} ${i.y}`)
    .join(' ')

  return (
    <section id="island" className="grain px-5 py-24 sm:px-8 md:py-32" style={{ background: INK }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <Eyebrow on="dark">Where you’ll go</Eyebrow>
          <h2
            className="font-familjen mt-4 text-[clamp(2rem,4.4vw,3.2rem)] font-500 leading-[1.08] tracking-[-0.015em]"
            style={{ color: LIGHTTX }}
          >
            A scatter of islands, and only one with a harbour light on.
          </h2>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-12">
          {/* the chart */}
          <div ref={wrapRef} className="lg:col-span-7">
            <div
              className="relative overflow-hidden rounded-[28px] p-2 ring-1"
              style={{ background: INK2, ['--tw-ring-color' as string]: 'rgba(234,243,241,0.08)' }}
            >
              <svg viewBox="0 0 100 100" className="h-auto w-full" role="img" aria-label="Illustrative map of the Westman Islands archipelago">
                <defs>
                  <radialGradient id="ey-sea" cx="50%" cy="40%" r="75%">
                    <stop offset="0%" stopColor="#15454F" />
                    <stop offset="100%" stopColor="#0B252B" />
                  </radialGradient>
                </defs>
                <rect width="100" height="100" fill="url(#ey-sea)" />
                {/* faint lat/long-free grid */}
                {[20, 40, 60, 80].map((g) => (
                  <g key={g} stroke="rgba(234,243,241,0.05)" strokeWidth="0.3">
                    <line x1="0" y1={g} x2="100" y2={g} />
                    <line x1={g} y1="0" x2={g} y2="100" />
                  </g>
                ))}
                {/* the boat route — self-draws on view */}
                <path
                  d={route}
                  fill="none"
                  stroke={CORAL}
                  strokeWidth="0.7"
                  strokeLinecap="round"
                  strokeDasharray="2 2.4"
                  pathLength={100}
                  style={{
                    strokeDashoffset: drawn ? 0 : 100,
                    transition: 'stroke-dashoffset 2.4s cubic-bezier(0.4,0,0.2,1)',
                  }}
                />
                {/* islands */}
                {ARCHIPELAGO.map((isle) => {
                  const on = isle.id === active
                  return (
                    <g
                      key={isle.id}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setActive(isle.id)}
                      onClick={() => setActive(isle.id)}
                    >
                      <circle
                        cx={isle.x}
                        cy={isle.y}
                        r={isle.r}
                        fill={on ? 'rgba(234,243,241,0.14)' : 'rgba(234,243,241,0.07)'}
                        stroke={TONE[isle.tone]}
                        strokeWidth={on ? 0.9 : 0.5}
                        style={{ transition: 'all 0.4s ease' }}
                      />
                      <circle cx={isle.x} cy={isle.y} r="1.1" fill={TONE[isle.tone]} />
                      <text
                        x={isle.x}
                        y={isle.y - isle.r - 1.6}
                        textAnchor="middle"
                        fontSize="3"
                        fontWeight="600"
                        fill={on ? '#EAF3F1' : 'rgba(234,243,241,0.6)'}
                        style={{ transition: 'fill 0.3s ease' }}
                      >
                        {isle.name}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
            {/* accessible isle buttons (also the mobile control) */}
            <div className="mt-4 flex flex-wrap gap-2">
              {ARCHIPELAGO.map((isle) => (
                <button
                  key={isle.id}
                  onClick={() => setActive(isle.id)}
                  aria-pressed={isle.id === active}
                  className="rounded-full px-3.5 py-1.5 text-[0.8rem] font-medium transition-colors"
                  style={
                    isle.id === active
                      ? { background: TONE[isle.tone], color: INK }
                      : { background: INK3, color: DIM }
                  }
                >
                  {isle.name}
                </button>
              ))}
            </div>
          </div>

          {/* the read-out */}
          <div className="lg:col-span-5">
            <div key={current.id}>
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: TONE[current.tone] }}
                aria-hidden
              />
              <h3 className="font-familjen mt-4 text-[clamp(1.9rem,3.4vw,2.8rem)] font-600 leading-tight" style={{ color: LIGHTTX }}>
                {current.name}
              </h3>
              <p className="mt-4 text-[1.05rem] leading-relaxed" style={{ color: DIM }}>
                {current.fact}
              </p>
              <p className="mt-6 text-sm" style={{ color: 'rgba(162,192,192,0.7)' }}>
                Hover or tap an island to follow the route. The dotted line is roughly where the boat takes
                you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  ERUPTION — the island that came back                                    */
/* ══════════════════════════════════════════════════════════════════════ */
function Eruption() {
  return (
    <section id="story" className="relative overflow-hidden px-5 py-24 sm:px-8 md:py-32" style={{ background: MAROON }}>
      {/* breathing lava glow */}
      <div
        className="pointer-events-none absolute -right-32 top-1/3 h-[460px] w-[460px] rounded-full blur-[90px] ey-glow"
        style={{ background: 'radial-gradient(circle, rgba(229,87,62,0.5), transparent 70%)' }}
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Eyebrow on="dark">23 January 1973</Eyebrow>
          <h2
            className="font-familjen mt-4 text-[clamp(2.1rem,4.8vw,3.6rem)] font-500 leading-[1.06] tracking-[-0.015em]"
            style={{ color: '#FBEDE6' }}
          >
            The island that came back.
          </h2>
          {ERUPTION.body.map((p, i) => (
            <p key={i} className="mt-5 max-w-xl text-[1.04rem] leading-relaxed" style={{ color: 'rgba(251,237,230,0.82)' }}>
              {p}
            </p>
          ))}
        </div>
        <div className="lg:col-span-6">
          <Reveal>
            <div
              className="overflow-hidden rounded-[26px] ring-1"
              style={{ ['--tw-ring-color' as string]: 'rgba(251,237,230,0.14)', boxShadow: '0 40px 80px -36px rgba(0,0,0,0.6)' }}
            >
              <Img
                src={u(IMG.lava, 1280)}
                srcSet={srcSet(IMG.lava)}
                sizes="(max-width: 1024px) 100vw, 45vw"
                alt="Lava glowing from an Icelandic eruption"
                className="aspect-[5/4] w-full object-cover"
                fallbackClassName="bg-gradient-to-br from-[#6A2A33] to-[#481D27]"
              />
            </div>
          </Reveal>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {ERUPTION.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-5"
                style={{ background: MAROON2 }}
              >
                <p className="font-familjen text-[2rem] font-600 leading-none" style={{ color: GOLD }}>
                  <CountUp to={s.value} prefix={s.prefix ?? ''} suffix={s.suffix ?? ''} />
                </p>
                <p className="mt-2 text-[0.82rem] leading-snug" style={{ color: 'rgba(251,237,230,0.72)' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  MEET EBBI                                                               */
/* ══════════════════════════════════════════════════════════════════════ */
function MeetEbbi() {
  return (
    <section style={{ background: BONE }} className="px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Reveal>
            <div className="overflow-hidden rounded-[26px]" style={{ boxShadow: '0 30px 60px -28px rgba(12,42,49,0.45)' }}>
              <Img
                src={u(IMG.helm, 1280)}
                srcSet={srcSet(IMG.helm)}
                sizes="(max-width: 768px) 100vw, 40vw"
                alt="A skipper at the helm of a small boat"
                className="aspect-[4/5] w-full object-cover"
                fallbackClassName="bg-gradient-to-br from-[#16505C] to-[#0C2A31]"
              />
            </div>
          </Reveal>
        </div>
        <div className="md:col-span-7">
          <Eyebrow>Your guide</Eyebrow>
          <h2
            className="font-familjen mt-4 text-[clamp(2rem,4.4vw,3.2rem)] font-500 leading-[1.08] tracking-[-0.015em]"
            style={{ color: INKTX }}
          >
            Ebbi has been showing people this island for years.
          </h2>
          <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed" style={{ color: BODYTX }}>
            Einar Birgir Baldursson, known to everyone as Ebbi, runs Eyjatours with his family. He grew up
            on Heimaey, and he tells the island the way only someone from here can. The puffins, the
            eruption, the names of the rocks. After more than a decade of small-group tours, he still gets a
            kick out of the moment a visitor sees their first puffin.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
            {[
              ['Family run', 'a small island operation'],
              ['Local guide', 'born and raised on Heimaey'],
              ['Small groups', 'never a crowd on the cliffs'],
            ].map(([k, v]) => (
              <div key={k} className="max-w-[14rem]">
                <p className="font-familjen text-lg font-600" style={{ color: CORAL_TX }}>
                  {k}
                </p>
                <p className="mt-1 text-sm" style={{ color: BODYTX }}>
                  {v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  REVIEWS                                                                 */
/* ══════════════════════════════════════════════════════════════════════ */
function Reviews() {
  return (
    <section className="px-5 py-24 sm:px-8 md:py-32" style={{ background: INK }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <Eyebrow on="dark">From the visitors’ book</Eyebrow>
          <h2
            className="font-familjen mt-4 text-[clamp(2rem,4.4vw,3.2rem)] font-500 leading-[1.08] tracking-[-0.015em]"
            style={{ color: LIGHTTX }}
          >
            People come for the puffins and remember the afternoon.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * 90}>
              <figure
                className="flex h-full flex-col rounded-[24px] p-7 ring-1"
                style={{ background: INK2, ['--tw-ring-color' as string]: 'rgba(234,243,241,0.08)' }}
              >
                <Quote className="h-7 w-7" style={{ color: CORAL }} strokeWidth={1.6} aria-hidden />
                <blockquote className="mt-4 flex-1 text-[1.02rem] leading-relaxed" style={{ color: LIGHTTX }}>
                  {r.quote}
                </blockquote>
                <figcaption className="mt-6 text-sm" style={{ color: DIM }}>
                  <span className="font-semibold" style={{ color: '#CBE0DE' }}>
                    {r.name}
                  </span>{' '}
                  · {r.place}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  PLAN + BOOKING                                                          */
/* ══════════════════════════════════════════════════════════════════════ */
function Stepper({ label, value, set, min = 0 }: { label: string; value: number; set: (n: number) => void; min?: number }) {
  return (
    <div>
      <label className="mb-1.5 block text-[0.78rem] font-semibold uppercase tracking-wide" style={{ color: BODYTX }}>
        {label}
      </label>
      <div className="flex items-center gap-3 rounded-full px-2 py-1.5" style={{ background: PAPER, border: '1px solid rgba(19,40,44,0.12)' }}>
        <button
          onClick={() => set(Math.max(min, value - 1))}
          className="grid h-11 w-11 place-items-center rounded-full transition-colors disabled:opacity-30"
          style={{ background: '#EFE9DB', color: INKTX }}
          disabled={value <= min}
          aria-label={`Fewer ${label.toLowerCase()}`}
        >
          <Minus className="h-4 w-4" strokeWidth={2.4} />
        </button>
        <span className="min-w-[2.5rem] text-center font-familjen text-lg font-600" style={{ color: INKTX }}>
          {value}
        </span>
        <button
          onClick={() => set(value + 1)}
          className="grid h-11 w-11 place-items-center rounded-full transition-colors"
          style={{ background: INK, color: LIGHTTX }}
          aria-label={`More ${label.toLowerCase()}`}
        >
          <Plus className="h-4 w-4" strokeWidth={2.4} />
        </button>
      </div>
    </div>
  )
}

function Booking({ selected, setSelected }: { selected: string; setSelected: (id: string) => void }) {
  const [date, setDate] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const tour = TOURS.find((t) => t.id === selected)!
  const total = adults * tour.adult + children * tour.child

  const enquiry = () => {
    const lines = [
      `Hi Ebbi,`,
      ``,
      `I would like to book the ${tour.name}.`,
      date ? `Date: ${new Date(date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}` : `Date: (flexible)`,
      `Guests: ${adults} adult${adults === 1 ? '' : 's'}${children ? ` and ${children} child${children === 1 ? '' : 'ren'}` : ''}`,
      `Estimated total: ${isk(total)}`,
      ``,
      `Thank you!`,
    ]
    return `mailto:${EMAIL}?subject=${encodeURIComponent('Tour booking request: ' + tour.name)}&body=${encodeURIComponent(lines.join('\n'))}`
  }

  return (
    <div className="rounded-[26px] p-6 ring-1 sm:p-8" style={{ background: BONE, ['--tw-ring-color' as string]: 'rgba(19,40,44,0.1)' }}>
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em]" style={{ color: CORAL_TX }}>
        Request a tour
      </p>
      <h3 className="font-familjen mt-2 text-2xl font-600" style={{ color: INKTX }}>
        Pick a tour and a day.
      </h3>

      {/* tour choice */}
      <div className="mt-6 grid gap-2.5" role="group" aria-label="Choose a tour">
        {TOURS.map((t) => {
          const on = t.id === selected
          return (
            <button
              key={t.id}
              aria-pressed={on}
              onClick={() => setSelected(t.id)}
              className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition-all"
              style={{
                background: on ? INK : PAPER,
                border: `1px solid ${on ? INK : 'rgba(19,40,44,0.12)'}`,
              }}
            >
              <span>
                <span className="block text-[0.95rem] font-semibold" style={{ color: on ? LIGHTTX : INKTX }}>
                  {t.name}
                </span>
                <span className="block text-xs" style={{ color: on ? DIM : BODYTX }}>
                  {t.window} · {t.duration.toLowerCase()}
                </span>
              </span>
              <span
                className="grid h-5 w-5 shrink-0 place-items-center rounded-full border"
                style={{ borderColor: on ? CORAL_BTN : 'rgba(19,40,44,0.3)', background: on ? CORAL_BTN : 'transparent' }}
              >
                {on && <Check className="h-3 w-3" style={{ color: INK }} strokeWidth={3} />}
              </span>
            </button>
          )
        })}
      </div>

      {/* date + guests */}
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <label className="mb-1.5 block text-[0.78rem] font-semibold uppercase tracking-wide" style={{ color: BODYTX }}>
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-full px-4 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C2A31]"
            style={{ background: PAPER, border: '1px solid rgba(19,40,44,0.12)', color: INKTX }}
          />
        </div>
        <Stepper label="Adults" value={adults} set={setAdults} min={1} />
        <Stepper label="Children" value={children} set={setChildren} />
      </div>

      {/* total + cta */}
      <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t pt-6" style={{ borderColor: 'rgba(19,40,44,0.12)' }}>
        <div>
          <p className="text-xs" style={{ color: BODYTX }}>
            Estimated total
          </p>
          <p className="font-familjen text-3xl font-600" style={{ color: INKTX }}>
            {isk(total)}
          </p>
          <p className="mt-1 text-xs" style={{ color: BODYTX }}>
            Children under 12 at {isk(tour.child)}
          </p>
        </div>
        <a
          href={enquiry()}
          className="group inline-flex items-center gap-2.5 rounded-full pl-6 pr-2 py-2 text-[0.95rem] font-semibold transition-transform active:scale-[0.97]"
          style={{ background: CORAL_BTN, color: INK }}
        >
          Send request to Ebbi
          <span className="grid h-9 w-9 place-items-center rounded-full transition-transform group-hover:translate-x-0.5" style={{ background: INK, color: CORAL_BTN }}>
            <Mail className="h-4 w-4" strokeWidth={2.2} />
          </span>
        </a>
      </div>
      <p className="mt-4 text-xs leading-relaxed" style={{ color: BODYTX }}>
        This opens a ready-to-send email to Ebbi with your details. He confirms availability and the
        meeting time by reply.
      </p>
    </div>
  )
}

function Plan({ selected, setSelected }: { selected: string; setSelected: (id: string) => void }) {
  const facts = [
    { icon: Calendar, title: 'When to come', body: PLAN.season },
    { icon: Ship, title: 'Getting here', body: PLAN.ferry },
    { icon: MapPin, title: 'Where we meet', body: PLAN.meet },
  ]
  return (
    <section id="visit" style={{ background: BONE }} className="px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <Eyebrow>Plan your visit</Eyebrow>
          <h2
            className="font-familjen mt-4 text-[clamp(2rem,4.4vw,3.2rem)] font-500 leading-[1.08] tracking-[-0.015em]"
            style={{ color: INKTX }}
          >
            Easy to reach, hard to leave.
          </h2>
        </div>
        <div id="book" className="grid items-start gap-10 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-5">
            {facts.map((f) => (
              <Reveal key={f.title}>
                <div className="flex gap-4 rounded-2xl p-5" style={{ background: PAPER }}>
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full" style={{ background: '#EFE9DB' }}>
                    <f.icon className="h-5 w-5" style={{ color: CORAL_TX }} strokeWidth={1.9} aria-hidden />
                  </div>
                  <div>
                    <h3 className="text-[1.02rem] font-semibold" style={{ color: INKTX }}>
                      {f.title}
                    </h3>
                    <p className="mt-1.5 text-[0.92rem] leading-relaxed" style={{ color: BODYTX }}>
                      {f.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
            <div className="flex flex-wrap gap-3 px-1 pt-1">
              <a href={FERRY_HREF} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: CORAL_TX }}>
                Ferry timetable <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
              </a>
              <a href={MAPS_HREF} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: CORAL_TX }}>
                Find us on the map <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
              </a>
            </div>
          </div>
          <div className="lg:col-span-7">
            <Booking selected={selected} setSelected={setSelected} />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  FINAL CTA                                                               */
/* ══════════════════════════════════════════════════════════════════════ */
function FinalCta() {
  return (
    <section className="relative overflow-hidden px-5 py-24 sm:px-8 md:py-32" style={{ background: INK }}>
      <div className="absolute inset-0 opacity-30">
        <Img
          src={u(IMG.seaStack, 2000)}
          srcSet={srcSet(IMG.seaStack)}
          sizes="100vw"
          alt=""
          className="h-full w-full object-cover"
          fallbackClassName="bg-gradient-to-br from-[#16505C] to-[#0C2A31]"
        />
      </div>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(12,42,49,0.7), rgba(12,42,49,0.92))' }} />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="font-familjen text-[clamp(2.3rem,5.4vw,4rem)] font-500 leading-[1.05] tracking-[-0.02em]" style={{ color: LIGHTTX }}>
          Come and meet the puffins.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[1.06rem] leading-relaxed" style={{ color: '#CBE0DE' }}>
          The boat is small, the season is short, and the island is waiting. Send Ebbi a note and pick your
          afternoon.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <BookButton href="#book">Book a tour</BookButton>
          <a href={PHONE_HREF} className="inline-flex items-center gap-2 text-[0.98rem] font-semibold" style={{ color: LIGHTTX }}>
            <Phone className="h-4 w-4" strokeWidth={2.1} aria-hidden />
            {PHONE_DISPLAY}
          </a>
        </div>
        <p className="mt-6 text-sm" style={{ color: DIM }}>
          <a href={`mailto:${EMAIL}`} className="underline underline-offset-2">
            {EMAIL}
          </a>{' '}
          · {ADDRESS}
        </p>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  PAGE                                                                    */
/* ══════════════════════════════════════════════════════════════════════ */
export default function EyjatoursPage() {
  const [selected, setSelected] = useState('puffin-volcano')
  useEffect(() => {
    document.title = 'Eyjatours · Puffin & Volcano Tours, Vestmannaeyjar'
    setThemeColor(INK)
    return () => setThemeColor('#0a1320')
  }, [])

  const choose = (id: string) => {
    setSelected(id)
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="font-hanken overflow-x-hidden" style={{ background: INK }}>
      <style>{`
        /* Hero entrance: base state is visible (opacity:1). The animation only
           runs once a real rAF tick adds [data-ey-play], so a throttled or
           backgrounded tab never traps the hero hidden. */
        .ey-rise { opacity: 1; }
        @media (prefers-reduced-motion: no-preference) {
          [data-ey-play] .ey-rise { animation: ey-rise 0.85s cubic-bezier(0.21,0.65,0.36,1) var(--d, 0ms) both; }
          @keyframes ey-rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
          @keyframes ey-glow { 0%,100% { opacity: 0.55; transform: scale(1); } 50% { opacity: 0.85; transform: scale(1.08); } }
          .ey-glow { animation: ey-glow 7s ease-in-out infinite; }
        }
      `}</style>
      <PreviewChrome company={company} />
      <Nav />
      <main>
        <Hero />
        <Trust />
        <Intro />
        <Tours onChoose={choose} />
        <Archipelago />
        <Eruption />
        <MeetEbbi />
        <Reviews />
        <Plan selected={selected} setSelected={setSelected} />
        <FinalCta />
      </main>
      <PreviewFooter company={company} />
      <StickyCta
        label="Puffin & volcano tours from the harbour"
        button="Book"
        href="#book"
        buttonClassName="text-[#0C2A31]"
        barClassName="bg-[#0F353E]/90 text-white border-t border-white/10"
      />
    </div>
  )
}
