import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { MapPin } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import {
  ADDRESS,
  ARCHIPELAGO,
  EMAIL,
  ERUPTION,
  FACTS,
  FERRY_HREF,
  fmt,
  IMG,
  PHONE_DISPLAY,
  REVIEWS,
  TOURS,
} from './data'

const company = getPreviewCompany('eyjatours')

/* ── Palette — Ocean ink & the puffin spectrum (see design handoff) ────── */
const INK = '#0C2A31' // primary dark ground
const INK_LIFT = '#16505C' // first review card, island fills
const INK_DEEP = '#0A222A' // footer ground
const BONE = '#F3EFE4' // warm light ground
const PAPER = '#FBF8F0' // tour cards, third review card
const LIGHTTX = '#EAF3F1' // text on dark
const DIM = '#A2C0C0' // muted on dark
const INKTX = '#13282C' // text on light
const BODYTX = '#3D4F51' // body on light
const CORAL = '#E5573E' // decorative only
const CORAL_BTN = '#EE6A4F' // ink text on it (AA 4.9)
const CORAL_TX = '#BC3A22' // coral as text on light
const GOLD = '#E0A53A' // accent numerals, italic accent, route line
const TEAL = '#39ADB4' // accent eyebrows, secondary markers
const MAROON = '#481D27' // 1973 chapter ground
const MAROON_TX = '#EAD7D2' // body inside the 1973 chapter
const FOOT_MICRO = '#6f8f8f'

/* ── Unsplash helpers ─────────────────────────────────────────────────── */
const u = (id: string, w = 2000) => `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`
const srcSet = (id: string) => `${u(id, 828)} 828w, ${u(id, 1280)} 1280w, ${u(id, 2000)} 2000w`

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ── Reveal — IO + CSS transition, with a failsafe for throttled tabs ──── */
function Reveal({
  children,
  delay = 0,
  y = 28,
  dur = 0.9,
  className = '',
  style,
}: {
  children: ReactNode
  delay?: number
  y?: number
  dur?: number
  className?: string
  style?: CSSProperties
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
      { rootMargin: '0px 0px -8% 0px', threshold: 0.16 },
    )
    io.observe(el)
    const t = window.setTimeout(() => setShown(true), 1400) // failsafe: never trapped hidden
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
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translateY(${y}px)`,
        transition: `opacity ${dur}s cubic-bezier(.2,.7,.2,1) ${delay}ms, transform ${dur}s cubic-bezier(.2,.7,.2,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

/* ── Count-up — IO triggered, interval stepped, setTimeout lands final ─── */
function CountUp({
  to,
  dec = 0,
  prefix = '',
  suffix = '',
  plain = false,
}: {
  to: number
  dec?: number
  prefix?: string
  suffix?: string
  plain?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState(0)
  const started = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const run = () => {
      if (started.current) return
      started.current = true
      if (prefersReduced()) {
        setN(to)
        return
      }
      const dur = 1500
      const t0 = Date.now()
      const iv = window.setInterval(() => {
        const p = Math.min(1, (Date.now() - t0) / dur)
        const eased = 1 - Math.pow(1 - p, 3)
        setN(to * eased)
        if (p >= 1) window.clearInterval(iv)
      }, 32)
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
      { threshold: 0.5 },
    )
    io.observe(el)
    const fs = window.setTimeout(run, 1600)
    return () => {
      io.disconnect()
      window.clearTimeout(fs)
    }
  }, [to])
  const txt = dec ? n.toFixed(dec) : plain ? String(Math.round(n)) : Math.round(n).toLocaleString('en-US')
  return (
    <span ref={ref}>
      {prefix}
      {txt}
      {suffix}
    </span>
  )
}

/* ── Subtle transform-only parallax (rAF; skipped under reduced motion) ── */
function useParallax() {
  useEffect(() => {
    if (prefersReduced()) return
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-par]'))
    if (!els.length) return
    let tick = false
    const onScroll = () => {
      if (tick) return
      tick = true
      requestAnimationFrame(() => {
        const vh = window.innerHeight
        const y = window.scrollY || 0
        els.forEach((el) => {
          const r = el.getBoundingClientRect()
          const mid = r.top + y + r.height / 2
          const rel = y + vh / 2 - mid
          el.style.transform = `translate3d(0, ${(rel * Number(el.dataset.par)).toFixed(1)}px, 0)`
        })
        tick = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
}

/* ── Eyebrow rule + label ─────────────────────────────────────────────── */
function Eyebrow({ children, color = CORAL_TX, line = CORAL_TX, center = false }: { children: ReactNode; color?: string; line?: string; center?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${center ? 'justify-center' : ''}`}>
      <span className="h-px w-9" style={{ background: line }} />
      <span className="font-hanken text-[12px] font-600 uppercase tracking-[0.18em]" style={{ color }}>
        {children}
      </span>
      {center && <span className="h-px w-9" style={{ background: line }} />}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  NAV                                                                     */
/* ══════════════════════════════════════════════════════════════════════ */
function Nav() {
  const links = [
    { href: '#tours', label: 'Tours' },
    { href: '#island', label: 'The island' },
    { href: '#map', label: 'Map' },
    { href: '#chapter', label: '1973' },
  ]
  return (
    <nav className="pointer-events-none fixed inset-x-0 top-[18px] z-[90] flex justify-center px-3">
      <div
        className="pointer-events-auto flex items-center gap-4 rounded-full py-2 pl-4 pr-2 ring-1 ring-white/35 sm:gap-5"
        style={{ background: 'rgba(243,239,228,.82)', backdropFilter: 'blur(14px)', boxShadow: '0 10px 34px rgba(12,42,49,.28)' }}
      >
        <a href="#top" aria-label="Eyjatours, home" className="flex items-center">
          <img src={IMG.logo} alt="Eyjatours, Vestmannaeyjar" className="block h-8 w-auto" />
        </a>
        <div className="hidden items-center gap-5 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-[13.5px] font-500 transition-opacity hover:opacity-70" style={{ color: INKTX }}>
              {l.label}
            </a>
          ))}
        </div>
        <a
          href="#book"
          className="rounded-full px-5 py-2.5 font-familjen text-[13.5px] font-600 transition-transform active:scale-95"
          style={{ background: INK, color: LIGHTTX }}
        >
          Book a tour
        </a>
      </div>
    </nav>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  HERO — seamless puffin-colony video loop                                */
/* ══════════════════════════════════════════════════════════════════════ */
function Hero({ tourName, guests }: { tourName: string; guests: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reduce, setReduce] = useState(false)
  useEffect(() => {
    setReduce(prefersReduced())
    const v = videoRef.current
    if (!v || prefersReduced()) return
    v.muted = true
    const tryPlay = () => v.play().catch(() => {})
    tryPlay()
    // some tabs only allow play once metadata is ready
    v.addEventListener('canplay', tryPlay, { once: true })
    return () => v.removeEventListener('canplay', tryPlay)
  }, [])

  return (
    <header id="top" className="relative min-h-[100svh] overflow-hidden" style={{ background: INK }}>
      {/* background video layer (subtle parallax) */}
      <div data-par="0.10" className="absolute inset-0 h-[112%]" style={{ top: '-6%' }}>
        {reduce ? (
          <img src={IMG.heroPoster} alt="Atlantic puffins on a grassy clifftop at golden hour, Vestmannaeyjar" className="h-full w-full object-cover" />
        ) : (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            poster={IMG.heroPoster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Atlantic puffins on a grassy clifftop at golden hour, Vestmannaeyjar"
          >
            <source src={IMG.heroVideo} type="video/mp4" />
          </video>
        )}
      </div>
      {/* legibility scrims: bottom darken + teal glow top-right */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(12,42,49,.34) 0%, rgba(12,42,49,.30) 38%, rgba(12,42,49,.78) 74%, rgba(12,42,49,.99) 100%)' }}
      />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 80% at 80% 0%, rgba(57,173,180,.16), transparent 55%)' }} />

      <div className="relative z-[5] mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-[26px] pb-[92px] sm:pb-[104px]">
        <div className="ey-rise mb-auto pt-32" style={{ ['--d' as string]: '50ms' }}>
          <Eyebrow color={DIM} line="rgba(162,192,192,.7)">
            Heimaey, Vestmannaeyjar
          </Eyebrow>
        </div>

        <h1
          className="font-display m-0 leading-[0.96] tracking-[-0.006em]"
          style={{ color: LIGHTTX, fontSize: 'clamp(46px,8.4vw,104px)', textShadow: '0 4px 40px rgba(12,42,49,.4)' }}
        >
          <span className="ey-rise block" style={{ ['--d' as string]: '120ms' }}>
            Born of fire,
          </span>
          <span className="ey-rise block" style={{ ['--d' as string]: '260ms' }}>
            ruled by <span className="italic" style={{ color: GOLD }}>puffins.</span>
          </span>
        </h1>

        <div className="mt-[30px] flex flex-wrap items-end justify-between gap-6">
          <p className="ey-rise m-0 max-w-[380px] leading-[1.55]" style={{ color: LIGHTTX, fontSize: 'clamp(15px,1.4vw,17px)', ['--d' as string]: '460ms' }}>
            Puffins by the million, a volcano that buried a town in 1973, and a skipper born on the rock. Small boats, real stories.
          </p>
          <div className="ey-rise flex items-center gap-2.5 text-[13px]" style={{ color: DIM, ['--d' as string]: '540ms' }}>
            <span className="ey-pulse inline-block h-2 w-2 rounded-full" style={{ background: TEAL }} aria-hidden />
            Ferry Herjólfur from Landeyjahöfn, about 35 min
          </div>
        </div>

        {/* booking search bar (reflects the live booking state) */}
        <div
          className="ey-rise mt-[30px] flex flex-wrap items-stretch gap-2.5 rounded-[14px] p-[13px]"
          style={{ background: 'rgba(243,239,228,.1)', border: '1px solid rgba(234,243,241,.18)', backdropFilter: 'blur(12px)', boxShadow: '0 20px 50px rgba(0,0,0,.3)', ['--d' as string]: '620ms' }}
        >
          {[
            { k: 'Tour', v: tourName },
            { k: 'When', v: 'This summer' },
            { k: 'Guests', v: `${guests} ${guests === 1 ? 'adult' : 'adults'}` },
          ].map((f, i) => (
            <div key={f.k} className={`rounded-[9px] px-4 py-[11px] ${i === 0 ? 'flex-[2_1_200px]' : 'flex-[1_1_120px]'}`} style={{ background: 'rgba(234,243,241,.07)' }}>
              <div className="mb-[3px] text-[10.5px] uppercase tracking-[0.12em]" style={{ color: DIM }}>
                {f.k}
              </div>
              <div className="font-familjen text-[16px] font-500" style={{ color: LIGHTTX }}>
                {f.v}
              </div>
            </div>
          ))}
          <a
            href="#book"
            className="ey-wipe relative flex flex-[1_1_150px] items-center justify-center gap-2 overflow-hidden rounded-[9px] px-5 py-[13px] font-familjen text-[16px] font-600"
            style={{ background: CORAL_BTN, color: INKTX }}
          >
            Check dates <span aria-hidden>→</span>
          </a>
        </div>
      </div>

      <div className="absolute bottom-[18px] left-1/2 z-[5] hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex" style={{ color: DIM }}>
        <span className="text-[11px] uppercase tracking-[0.2em]">Scroll</span>
        <span className="ey-bob text-[17px] leading-none" aria-hidden>↓</span>
      </div>
    </header>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  FACTS BAND                                                              */
/* ══════════════════════════════════════════════════════════════════════ */
function FactsBand() {
  return (
    <section style={{ background: INK }} className="pt-2 pb-16" aria-label="Eyjatours in numbers">
      <h2 className="sr-only">Eyjatours in numbers</h2>
      <div className="mx-auto max-w-6xl px-[26px]">
        <div className="grid border-t" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', borderColor: 'rgba(162,192,192,.22)' }}>
          {FACTS.map((f, i) => (
            <Reveal
              key={f.caption}
              delay={i * 90}
              className={`pt-[34px] pb-[30px] ${i === 0 ? 'pr-[26px]' : i === FACTS.length - 1 ? 'pl-[26px]' : 'px-[26px]'}`}
              style={i < FACTS.length - 1 ? { borderRight: '1px solid rgba(162,192,192,.14)' } : undefined}
            >
              <div className="font-familjen leading-none tracking-[-0.03em] font-600" style={{ color: f.gold ? GOLD : LIGHTTX, fontSize: 'clamp(40px,5vw,62px)' }}>
                <CountUp to={f.value} dec={f.dec} suffix={undefined} plain={f.plain} />
                {f.suffix && <span style={{ fontSize: '0.5em' }}>{f.suffix}</span>}
              </div>
              <div className="mt-2.5 max-w-[170px] text-[13.5px] leading-[1.45]" style={{ color: DIM }}>
                {f.caption}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  INTRO / THE ISLAND (#island)                                            */
/* ══════════════════════════════════════════════════════════════════════ */
function Intro() {
  return (
    <section id="island" className="relative" style={{ background: BONE, padding: 'clamp(70px,9vw,130px) 0' }}>
      <div className="mx-auto grid max-w-6xl items-center px-[26px]" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'clamp(40px,6vw,90px)' }}>
        <div className="relative">
          <Reveal dur={1} className="relative overflow-hidden rounded-[6px]" style={{ boxShadow: '0 30px 70px rgba(12,42,49,.22)' }}>
            <Img
              src={u(IMG.seaCliffs, 1280)}
              srcSet={srcSet(IMG.seaCliffs)}
              sizes="(max-width:768px) 100vw, 45vw"
              alt="Dramatic basalt sea cliffs in the Westman Islands"
              className="block aspect-[4/5] w-full object-cover"
              fallbackClassName="bg-gradient-to-br from-[#16505C] to-[#0C2A31]"
            />
          </Reveal>
        </div>
        <div>
          <Reveal>
            <Eyebrow>A small rock with a big story</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-display mt-[26px] leading-[1.02] tracking-[-0.006em]" style={{ color: INKTX, fontSize: 'clamp(32px,4.6vw,58px)' }}>
              Four thousand people, a million seabirds, one harbour the lava nearly closed.
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-[26px] max-w-[480px] leading-[1.65]" style={{ color: BODYTX, fontSize: 'clamp(16px,1.5vw,18px)' }}>
              Heimaey is the only inhabited island in Vestmannaeyjar, off Iceland's south coast. We grew up here. On the water you get the cliffs where the puffins nest, the black 1973 lava, the sea caves and the stories that go with all of it.
            </p>
          </Reveal>
          <Reveal delay={240} className="mt-[34px] flex flex-wrap gap-3.5">
            <a href="#tours" className="rounded-full px-6 py-3 font-familjen text-[15px] font-600 transition-transform active:scale-95" style={{ background: INK, color: LIGHTTX }}>
              See the three tours
            </a>
            <a href="#map" className="rounded-full border px-6 py-3 font-familjen text-[15px] font-600 transition-colors hover:bg-black/[0.03]" style={{ borderColor: 'rgba(19,40,44,.25)', color: INKTX }}>
              Explore the map
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  TOURS (#tours)                                                          */
/* ══════════════════════════════════════════════════════════════════════ */
function Tours({ onChoose }: { onChoose: (id: string) => void }) {
  const flagship = TOURS.find((t) => t.flagship)!
  const rest = TOURS.filter((t) => !t.flagship)
  return (
    <section id="tours" style={{ background: BONE, padding: '0 0 clamp(70px,9vw,120px)' }}>
      <div className="mx-auto max-w-6xl px-[26px]">
        <Reveal className="mb-11 flex flex-wrap items-end justify-between gap-4.5">
          <h2 className="font-display m-0 leading-none tracking-[-0.006em]" style={{ color: INKTX, fontSize: 'clamp(34px,5vw,64px)' }}>
            Three ways out
            <br />
            <span style={{ color: TEAL }}>on the water.</span>
          </h2>
          <p className="m-0 max-w-[330px] text-[15px] leading-[1.55]" style={{ color: BODYTX }}>
            Every tour visits some of the puffin cliffs, the Eldfell lava, the Viking age stone house and a taste of the island.
          </p>
        </Reveal>

        {/* flagship — full-width feature */}
        <Reveal dur={1}>
          <button
            onClick={() => onChoose(flagship.id)}
            className="group block w-full overflow-hidden rounded-[8px] text-left"
            style={{ background: INK, boxShadow: '0 30px 70px rgba(12,42,49,.25)' }}
          >
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>
              <div className="relative min-h-[340px] overflow-hidden">
                <Img
                  src={u(IMG[flagship.image], 1280)}
                  srcSet={srcSet(IMG[flagship.image])}
                  sizes="(max-width:768px) 100vw, 50vw"
                  alt="Atlantic puffins on a clifftop over the sea"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                  fallbackClassName="bg-gradient-to-br from-[#16505C] to-[#0C2A31]"
                />
                <span className="absolute left-[18px] top-[18px] rounded-full px-3.5 py-[7px] font-familjen text-[12.5px] font-600 tracking-[0.04em]" style={{ background: CORAL_BTN, color: INKTX }}>
                  Flagship tour
                </span>
              </div>
              <div className="flex flex-col justify-center" style={{ padding: 'clamp(30px,3.6vw,52px)' }}>
                <div className="mb-3.5 text-[12px] font-600 uppercase tracking-[0.16em]" style={{ color: TEAL }}>
                  {flagship.meta}
                </div>
                <h3 className="font-familjen m-0 leading-none tracking-[-0.02em] font-600" style={{ color: LIGHTTX, fontSize: 'clamp(30px,3.4vw,46px)' }}>
                  {flagship.name}
                </h3>
                <p className="mb-[26px] mt-[18px] max-w-[440px] text-[16px] leading-[1.6]" style={{ color: DIM }}>
                  {flagship.blurb}
                </p>
                <div className="flex flex-wrap items-center gap-[18px]">
                  <span className="font-familjen text-[15px]" style={{ color: DIM }}>
                    from <span className="text-[26px] font-600" style={{ color: GOLD }}>{fmt(flagship.price)}</span> ISK
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full px-5 py-[11px] font-familjen text-[15px] font-600 transition-transform group-hover:translate-x-0.5" style={{ background: CORAL_BTN, color: INKTX }}>
                    Request booking <span aria-hidden>→</span>
                  </span>
                </div>
              </div>
            </div>
          </button>
        </Reveal>

        {/* two smaller tours */}
        <div className="mt-6 grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
          {rest.map((t, i) => (
            <Reveal key={t.id} delay={90 + i * 90} dur={1}>
              <button
                onClick={() => onChoose(t.id)}
                className="group flex h-full w-full flex-col overflow-hidden rounded-[8px] text-left"
                style={{ background: PAPER, boxShadow: '0 14px 40px rgba(12,42,49,.12)' }}
              >
                <div className="relative h-[200px] overflow-hidden">
                  <Img
                    src={u(IMG[t.image], 1280)}
                    srcSet={srcSet(IMG[t.image])}
                    sizes="(max-width:768px) 100vw, 50vw"
                    alt={t.name}
                    className="h-full w-full object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.05]"
                    fallbackClassName="bg-gradient-to-br from-[#16505C] to-[#0C2A31]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <div className="mb-[11px] text-[12px] font-600 uppercase tracking-[0.14em]" style={{ color: CORAL_TX }}>
                    {t.meta}
                  </div>
                  <h3 className="font-familjen m-0 tracking-[-0.02em] font-600" style={{ color: INKTX, fontSize: 'clamp(24px,2.6vw,32px)' }}>
                    {t.name}
                  </h3>
                  <p className="mb-[22px] mt-3.5 flex-1 text-[15px] leading-[1.55]" style={{ color: BODYTX }}>
                    {t.blurb}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-familjen text-[14px]" style={{ color: BODYTX }}>
                      from <span className="text-[22px] font-600" style={{ color: CORAL_TX }}>{fmt(t.price)}</span> ISK
                    </span>
                    <span className="font-familjen text-[15px] font-600" style={{ color: INKTX }}>
                      Book <span aria-hidden>→</span>
                    </span>
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  ARCHIPELAGO MAP (#map) — signature nautical chart                       */
/* ══════════════════════════════════════════════════════════════════════ */
function ArchipelagoMap() {
  const [isle, setIsle] = useState(0)
  const current = ARCHIPELAGO[isle]
  // OpenStreetMap embed — keyless and frameable (Google's keyless embed now
  // blocks framing with X-Frame-Options). The pin + view follow the selection.
  const lonHalf = 421.875 / Math.pow(2, current.zoom)
  const latHalf = lonHalf * 0.55
  const bbox = `${current.lng - lonHalf},${current.lat - latHalf},${current.lng + lonHalf},${current.lat + latHalf}`
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${current.lat},${current.lng}`
  const gmapsHref = `https://www.google.com/maps/search/?api=1&query=${current.lat},${current.lng}`

  return (
    <section id="map" className="relative overflow-hidden" style={{ background: INK, padding: 'clamp(70px,9vw,120px) 0' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(90% 70% at 22% 18%, rgba(57,173,180,.14), transparent 60%)' }} />
      <div className="relative mx-auto max-w-6xl px-[26px]">
        <Reveal>
          <Eyebrow color={TEAL} line={TEAL}>
            The archipelago
          </Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display mb-11 mt-[18px] max-w-[780px] leading-[1.02] tracking-[-0.006em]" style={{ color: LIGHTTX, fontSize: 'clamp(32px,4.8vw,60px)' }}>
            Fifteen islands, thirty skerries, one harbour to leave from.
          </h2>
        </Reveal>

        <div className="grid items-stretch" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 'clamp(30px,4vw,56px)' }}>
          {/* MAP CARD — live map; the pin + view follow the selected location */}
          <Reveal dur={1} className="h-full min-h-[360px] overflow-hidden rounded-[10px]" style={{ border: '1px solid rgba(162,192,192,.22)', boxShadow: '0 30px 70px rgba(0,0,0,.4)' }}>
            <iframe
              key={current.id}
              title={`Map of ${current.name}, Vestmannaeyjar`}
              src={mapSrc}
              className="block h-[360px] min-h-full w-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </Reveal>

          {/* RIGHT: caption + selectors */}
          <div>
            <Reveal delay={120}>
              <div className="mb-1.5 flex items-baseline gap-3.5">
                <span className="font-display leading-none" style={{ color: GOLD, fontSize: '46px' }}>
                  {String(isle + 1).padStart(2, '0')}
                </span>
                <span className="text-[13px] font-600 tracking-[0.04em]" style={{ color: TEAL }}>
                  Selected point
                </span>
              </div>
              <h3 className="font-display mt-1.5 leading-tight tracking-[-0.006em]" style={{ color: LIGHTTX, fontSize: 'clamp(30px,3.4vw,44px)', minHeight: '1.1em' }}>
                {current.name}
              </h3>
              <p className="mt-4 text-[16px] leading-[1.65]" style={{ color: DIM, minHeight: '4.6em' }}>
                {current.desc}
              </p>
              <a
                href={gmapsHref}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-600 transition-opacity hover:opacity-80"
                style={{ color: TEAL }}
              >
                Open in Google Maps <span aria-hidden>↗</span>
              </a>
            </Reveal>

            <Reveal delay={180} className="mt-6 flex flex-col gap-2">
              {ARCHIPELAGO.map((p, i) => {
                const on = isle === i
                return (
                  <button
                    key={p.id}
                    onClick={() => setIsle(i)}
                    aria-pressed={on}
                    className="flex items-center gap-3 rounded-[10px] px-4 py-3 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E0A53A]"
                    style={{ border: `1px solid ${on ? GOLD : 'rgba(162,192,192,.22)'}`, background: on ? 'rgba(224,165,58,.14)' : 'rgba(234,243,241,.04)' }}
                  >
                    <span
                      className="font-display grid h-7 w-7 shrink-0 place-items-center rounded-full text-[14px]"
                      style={{ background: on ? GOLD : 'rgba(234,243,241,.08)', color: on ? INK : DIM }}
                    >
                      {i + 1}
                    </span>
                    <span className="font-familjen text-[15px] font-600" style={{ color: on ? LIGHTTX : DIM }}>
                      {p.chip}
                    </span>
                    <MapPin className="ml-auto h-4 w-4 shrink-0" style={{ color: on ? GOLD : 'rgba(162,192,192,.45)' }} strokeWidth={2} aria-hidden />
                  </button>
                )
              })}
            </Reveal>

            <Reveal delay={240} className="mt-[26px] flex flex-wrap gap-[30px] border-t pt-6" style={{ borderColor: 'rgba(162,192,192,.18)' }}>
              <div>
                <div className="font-display leading-none" style={{ color: GOLD, fontSize: '30px' }}>~4,300</div>
                <div className="mt-1 text-[13px]" style={{ color: DIM }}>people on Heimaey</div>
              </div>
              <div>
                <div className="font-display leading-none" style={{ color: GOLD, fontSize: '30px' }}>1963</div>
                <div className="mt-1 text-[13px]" style={{ color: DIM }}>Surtsey born of fire</div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  THE 1973 CHAPTER (#chapter) — signature                                 */
/* ══════════════════════════════════════════════════════════════════════ */
function Eruption() {
  return (
    <section id="chapter" className="relative overflow-hidden" style={{ background: '#0E0A09', color: LIGHTTX, padding: 'clamp(80px,11vw,150px) 0' }}>
      {/* still lava image that glides on scroll (parallax, transform-only) */}
      <div data-par="0.12" className="absolute inset-[-16%] will-change-transform">
        <Img
          src={u(IMG.lava, 2000)}
          srcSet={srcSet(IMG.lava)}
          sizes="100vw"
          alt=""
          className="h-full w-full object-cover"
          fallbackClassName="bg-gradient-to-br from-[#2A1512] to-[#0E0A09]"
        />
      </div>
      {/* neutral cinematic darken for legibility — keeps the lava's true colour, no red wash */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,7,6,.58) 0%, rgba(10,7,6,.48) 44%, rgba(10,7,6,.8) 100%)' }} aria-hidden />

      <div className="relative mx-auto max-w-[1100px] px-[26px] text-center">
        <Reveal className="flex justify-center">
          <Eyebrow color={CORAL_BTN} line={CORAL} center>
            {ERUPTION.when}
          </Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display mx-auto max-w-[900px] leading-[1.02] tracking-[-0.006em]" style={{ fontSize: 'clamp(34px,5.4vw,72px)' }}>
            {ERUPTION.heading}
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mx-auto mt-7 max-w-[640px] leading-[1.7]" style={{ color: MAROON_TX, fontSize: 'clamp(16px,1.5vw,18px)' }}>
            {ERUPTION.body}
          </p>
        </Reveal>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '28px', marginTop: 'clamp(46px,6vw,72px)' }}>
          {ERUPTION.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100}>
              <div className="font-familjen leading-none tracking-[-0.02em] font-600" style={{ color: GOLD, fontSize: 'clamp(44px,5.5vw,72px)' }}>
                <CountUp to={s.value} prefix={s.prefix} />
              </div>
              <div className="mt-2.5 text-[13.5px]" style={{ color: MAROON_TX }}>
                {s.label}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={360} className="mt-10">
          <span className="inline-block rounded-full border px-[18px] py-2.5 text-[13.5px]" style={{ borderColor: 'rgba(234,215,210,.3)', color: MAROON_TX }}>
            {ERUPTION.chip}
          </span>
        </Reveal>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  MEET EBBI                                                               */
/* ══════════════════════════════════════════════════════════════════════ */
function MeetEbbi() {
  return (
    <section style={{ background: BONE, padding: 'clamp(70px,9vw,120px) 0' }}>
      <div className="mx-auto grid max-w-6xl items-center px-[26px]" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'clamp(40px,6vw,80px)' }}>
        <div>
          <Reveal>
            <Eyebrow>Your skipper</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-display mt-[22px] leading-none tracking-[-0.006em]" style={{ color: INKTX, fontSize: 'clamp(32px,4.6vw,58px)' }}>
              Meet Ebbi.
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-6 max-w-[460px] leading-[1.65]" style={{ color: BODYTX, fontSize: 'clamp(16px,1.5vw,18px)' }}>
              Einar Birgir Baldursson, Ebbi to everyone here, was born and raised on Heimaey and has run these tours for about twelve years. He knows which cliff the puffins favour on a given wind, and where the lava stopped a hundred metres short of the harbour.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <blockquote className="font-display mt-[30px] max-w-[440px] border-l-[3px] pl-[22px] italic leading-[1.3] font-500" style={{ borderColor: GOLD, color: INKTX, fontSize: 'clamp(20px,2.2vw,26px)' }}>
              "This is not a script. It is where I grew up, so I just show you my island."
            </blockquote>
          </Reveal>
        </div>
        <Reveal delay={120} dur={1} className="relative">
          <div className="overflow-hidden rounded-[6px]" style={{ boxShadow: '0 30px 70px rgba(12,42,49,.22)' }}>
            <Img
              src={u(IMG.helm, 1280)}
              srcSet={srcSet(IMG.helm)}
              sizes="(max-width:768px) 100vw, 45vw"
              alt="The skipper in the wheelhouse of a small boat"
              className="block aspect-[5/4] w-full object-cover"
              fallbackClassName="bg-gradient-to-br from-[#16505C] to-[#0C2A31]"
            />
          </div>
          <div className="ey-float absolute -left-4 bottom-6 rounded-[8px] px-5 py-3.5" style={{ background: INK, color: LIGHTTX, boxShadow: '0 16px 36px rgba(12,42,49,.3)' }}>
            <div className="font-familjen text-[18px] font-600">Ebbi</div>
            <div className="text-[12.5px]" style={{ color: DIM }}>Owner, guide, islander</div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  REVIEWS                                                                 */
/* ══════════════════════════════════════════════════════════════════════ */
function Reviews() {
  const grounds = {
    teal: { bg: INK_LIFT, quote: LIGHTTX, mark: GOLD, cap: DIM, capWeight: 400 },
    coral: { bg: CORAL_BTN, quote: '#2A0F14', mark: MAROON, cap: '#5a2329', capWeight: 600 },
    bone: { bg: PAPER, quote: INKTX, mark: GOLD, cap: BODYTX, capWeight: 400 },
  }
  return (
    <section className="relative overflow-hidden" style={{ background: INK, padding: 'clamp(70px,9vw,120px) 0' }}>
      <div className="mx-auto max-w-6xl px-[26px]">
        <Reveal>
          <span className="font-hanken text-[12px] font-600 uppercase tracking-[0.18em]" style={{ color: TEAL }}>
            From the boat
          </span>
          <h2 className="font-display mt-3.5 max-w-[760px] leading-[1.02] tracking-[-0.006em]" style={{ color: LIGHTTX, fontSize: 'clamp(32px,4.8vw,60px)' }}>
            What people say after a day on the water.
          </h2>
        </Reveal>
        <div className="mt-11 grid items-start gap-[22px]" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))' }}>
          {REVIEWS.map((r, i) => {
            const g = grounds[r.variant]
            return (
              <Reveal key={r.name} delay={i * 110} dur={1} y={32} style={r.variant === 'coral' ? { marginTop: '46px' } : undefined}>
                <figure className="m-0 rounded-[8px] px-[30px] py-[34px]" style={{ background: g.bg, boxShadow: '0 18px 44px rgba(0,0,0,.25)' }}>
                  <div className="font-familjen text-[54px] leading-[0.6]" style={{ color: g.mark }} aria-hidden>
                    “
                  </div>
                  <blockquote className="font-familjen my-3.5 mb-[22px] text-[21px] leading-[1.35] font-500" style={{ color: g.quote }}>
                    {r.quote}
                  </blockquote>
                  <figcaption className="text-[13.5px]" style={{ color: g.cap, fontWeight: g.capWeight }}>
                    {r.name}, {r.place}
                  </figcaption>
                </figure>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  BOOKING PANEL (#book) — signature                                       */
/* ══════════════════════════════════════════════════════════════════════ */
function Booking({
  tour,
  setTour,
  guests,
  setGuests,
  date,
  setDate,
  shownTotal,
}: {
  tour: number
  setTour: (i: number) => void
  guests: number
  setGuests: (n: number) => void
  date: string
  setDate: (s: string) => void
  shownTotal: number
}) {
  const t = TOURS[tour]
  const total = t.price * guests
  const subject = `Booking request: ${t.name}`
  const body = `Hi Ebbi,\n\nI would like to request the ${t.name.replace(/^The /, '')} tour.\nDate: ${date}\nGuests: ${guests}\nEstimated total: ${fmt(total)} ISK\n\nThank you!`
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  const contact = [ADDRESS, PHONE_DISPLAY, EMAIL]

  return (
    <section id="book" style={{ background: BONE, padding: 'clamp(70px,9vw,120px) 0' }}>
      <div className="mx-auto grid max-w-6xl items-center px-[26px]" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'clamp(36px,5vw,72px)' }}>
        <Reveal>
          <Eyebrow>Plan your visit</Eyebrow>
          <h2 className="font-display mt-[22px] leading-[1.02] tracking-[-0.006em]" style={{ color: INKTX, fontSize: 'clamp(32px,4.6vw,58px)' }}>
            Build your day,
            <br />
            then send it to Ebbi.
          </h2>
          <p className="mb-[30px] mt-6 max-w-[430px] text-[16px] leading-[1.65]" style={{ color: BODYTX }}>
            Pick a tour, a date and your group size. The total updates as you go, then we open a prefilled email so you can send your request straight to the harbour.
          </p>
          <div className="flex flex-col gap-3.5">
            {contact.map((c, i) => (
              <div key={c} className="flex items-center gap-3.5 text-[15px]" style={{ color: INKTX }}>
                <span className="grid h-[34px] w-[34px] place-items-center rounded-full font-familjen font-600" style={{ background: INK, color: LIGHTTX }}>
                  {i + 1}
                </span>
                {c}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120} dur={1} y={36} className="rounded-[14px]" style={{ background: INK, padding: 'clamp(26px,3vw,38px)', boxShadow: '0 36px 80px rgba(12,42,49,.32)' }}>
          <div className="mb-3.5 text-[11px] font-600 uppercase tracking-[0.14em]" style={{ color: DIM }}>
            Choose your tour
          </div>
          <div className="mb-6 flex flex-col gap-2.5" role="group" aria-label="Choose your tour">
            {TOURS.map((tr, i) => {
              const on = tour === i
              return (
                <button
                  key={tr.id}
                  onClick={() => setTour(i)}
                  aria-pressed={on}
                  className="flex items-center justify-between gap-2.5 rounded-[9px] px-4 py-3.5 text-left font-familjen text-[15.5px] font-600 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E0A53A]"
                  style={{
                    border: `1px solid ${on ? CORAL_BTN : 'rgba(162,192,192,.24)'}`,
                    background: on ? 'rgba(238,106,79,.16)' : 'rgba(234,243,241,.04)',
                    color: on ? LIGHTTX : DIM,
                    boxShadow: on ? `inset 0 0 0 1px ${CORAL_BTN}` : 'none',
                  }}
                >
                  <span>{tr.name}</span>
                  <span className="text-[13px] font-400 opacity-80">{fmt(tr.price)} ISK</span>
                </button>
              )
            })}
          </div>

          <div className="mb-6 flex flex-wrap gap-3.5">
            <label className="block flex-[1_1_150px]">
              <span className="mb-2.5 block text-[11px] font-600 uppercase tracking-[0.14em]" style={{ color: DIM }}>
                Date
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-[8px] px-3.5 py-3 font-hanken text-[15px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ border: '1px solid rgba(162,192,192,.28)', background: 'rgba(234,243,241,.06)', color: LIGHTTX, colorScheme: 'dark', outlineColor: GOLD }}
              />
            </label>
            <div className="flex-[1_1_150px]">
              <span className="mb-2.5 block text-[11px] font-600 uppercase tracking-[0.14em]" style={{ color: DIM }}>
                Guests
              </span>
              <div className="flex items-center justify-between rounded-[8px] px-2.5 py-[7px]" style={{ border: '1px solid rgba(162,192,192,.28)', background: 'rgba(234,243,241,.06)' }}>
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  aria-label="Fewer guests"
                  disabled={guests <= 1}
                  className="grid h-[34px] w-[34px] place-items-center rounded-[7px] border-0 text-[20px] leading-none transition-opacity disabled:opacity-40"
                  style={{ background: 'rgba(234,243,241,.1)', color: LIGHTTX, cursor: 'pointer' }}
                >
                  −
                </button>
                <span className="font-familjen text-[20px] font-600" style={{ color: LIGHTTX }}>
                  {guests}
                </span>
                <button
                  onClick={() => setGuests(Math.min(12, guests + 1))}
                  aria-label="More guests"
                  disabled={guests >= 12}
                  className="grid h-[34px] w-[34px] place-items-center rounded-[7px] border-0 text-[20px] leading-none transition-opacity disabled:opacity-40"
                  style={{ background: 'rgba(234,243,241,.1)', color: LIGHTTX, cursor: 'pointer' }}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="mb-[22px] flex items-end justify-between gap-4 border-y py-5" style={{ borderColor: 'rgba(162,192,192,.18)' }}>
            <div>
              <div className="mb-1 text-[12px]" style={{ color: DIM }}>
                Estimated total
              </div>
              <div className="font-familjen leading-none tracking-[-0.02em] font-600" style={{ color: GOLD, fontSize: 'clamp(34px,4vw,48px)' }}>
                {fmt(shownTotal)} <span className="font-500" style={{ fontSize: '0.42em', color: DIM }}>ISK</span>
              </div>
            </div>
            <div className="text-right text-[12.5px] leading-[1.4]" style={{ color: DIM }}>
              {t.name}
              <br />
              {guests} {guests === 1 ? 'guest' : 'guests'}
            </div>
          </div>

          <a href={mailto} className="ey-wipe relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-[10px] p-4 font-familjen text-[17px] font-600" style={{ background: CORAL_BTN, color: INKTX }}>
            Request this booking <span aria-hidden>→</span>
          </a>
          <p className="mt-3.5 text-center text-[12px]" style={{ color: DIM }}>
            No payment now. We confirm by email from the harbour.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  FINAL CTA                                                               */
/* ══════════════════════════════════════════════════════════════════════ */
function FinalCta() {
  return (
    <section className="relative flex min-h-[74vh] items-center overflow-hidden" style={{ background: INK }}>
      <div data-par="0.10" className="absolute inset-0 h-[120%]" style={{ top: '-10%' }}>
        <Img
          src={u(IMG.seaStack, 2000)}
          srcSet={srcSet(IMG.seaStack)}
          sizes="100vw"
          alt="A lone sea stack in the Atlantic"
          className="ey-ken h-full w-full object-cover"
          fallbackClassName="bg-gradient-to-br from-[#16505C] to-[#0C2A31]"
        />
      </div>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(12,42,49,.5), rgba(12,42,49,.8))' }} />
      <div className="relative mx-auto max-w-[1000px] px-[26px] text-center" style={{ paddingTop: 'clamp(70px,9vw,120px)', paddingBottom: 'clamp(70px,9vw,120px)' }}>
        <Reveal dur={1}>
          <h2 className="font-display leading-[1.02] tracking-[-0.006em]" style={{ color: LIGHTTX, fontSize: 'clamp(40px,7vw,96px)' }}>
            Come over.
            <br />
            We will take it from the harbour.
          </h2>
        </Reveal>
        <Reveal delay={140} dur={1} className="mt-9 flex flex-wrap justify-center gap-3.5">
          <a href="#book" className="rounded-full px-8 py-4 font-familjen text-[17px] font-600 transition-transform active:scale-95" style={{ background: CORAL_BTN, color: INKTX }}>
            Request a booking
          </a>
          <a href={FERRY_HREF} target="_blank" rel="noopener noreferrer" className="rounded-full border px-8 py-4 font-familjen text-[17px] font-600 transition-colors hover:bg-white/5" style={{ borderColor: 'rgba(234,243,241,.4)', color: LIGHTTX }}>
            Check the ferry
          </a>
        </Reveal>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  MARKETING FOOTER                                                        */
/* ══════════════════════════════════════════════════════════════════════ */
function MarketingFooter() {
  return (
    <footer style={{ background: INK_DEEP, color: DIM, padding: 'clamp(50px,6vw,80px) 0 36px' }}>
      <div className="mx-auto max-w-6xl px-[26px]">
        <div className="grid gap-9 border-b pb-10" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', borderColor: 'rgba(162,192,192,.16)' }}>
          <div>
            <img src={IMG.logo} alt="Eyjatours" className="mb-[18px] block h-12 rounded-[10px] px-3 py-2" style={{ background: BONE }} />
            <p className="m-0 max-w-[280px] text-[14px] leading-[1.6]">
              Family run puffin and volcano tours on Heimaey, Vestmannaeyjar, off the south coast of Iceland.
            </p>
          </div>
          <div>
            <div className="font-familjen mb-3.5 font-600" style={{ color: LIGHTTX }}>Visit</div>
            <div className="flex flex-col gap-2.5 text-[14px]">
              <span>Básaskersbryggja 8, at the harbour</span>
              <span>Ferry Herjólfur from Landeyjahöfn, about 35 min</span>
              <a href={FERRY_HREF} target="_blank" rel="noopener noreferrer" className="no-underline" style={{ color: TEAL }}>
                herjolfur.is
              </a>
            </div>
          </div>
          <div>
            <div className="font-familjen mb-3.5 font-600" style={{ color: LIGHTTX }}>Contact</div>
            <div className="flex flex-col gap-2.5 text-[14px]">
              <a href={`mailto:${EMAIL}`} className="no-underline" style={{ color: 'inherit' }}>{EMAIL}</a>
              <a href="tel:+3548526939" className="no-underline" style={{ color: 'inherit' }}>{PHONE_DISPLAY}</a>
            </div>
          </div>
          <div>
            <div className="font-familjen mb-3.5 font-600" style={{ color: LIGHTTX }}>Tours</div>
            <div className="flex flex-col gap-2.5 text-[14px]">
              {TOURS.map((t) => (
                <a key={t.id} href="#tours" className="no-underline" style={{ color: 'inherit' }}>
                  {t.name}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-3.5 pt-6 text-[12px]" style={{ color: FOOT_MICRO }}>
          <span>© 2026 Eyjatours, Vestmannaeyjar.</span>
          <span className="max-w-[560px] leading-[1.5]">
            Prices and visitor quotes shown are sample data for this preview. The puffin colony is one of the world's largest. 1973 figures are approximate and historically sourced.
          </span>
        </div>
      </div>
    </footer>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  PAGE                                                                    */
/* ══════════════════════════════════════════════════════════════════════ */
export default function EyjatoursPage() {
  const [tour, setTour] = useState(0)
  const [guests, setGuests] = useState(2)
  const [date, setDate] = useState('2026-07-14')
  const [shownTotal, setShownTotal] = useState(TOURS[0].price * 2)

  useParallax()

  useEffect(() => {
    document.title = 'Eyjatours · Puffin & Volcano Tours, Vestmannaeyjar'
    setThemeColor(INK)
    return () => setThemeColor('#0a1320')
  }, [])

  // live total — tween toward price * guests (instant under reduced motion)
  const target = TOURS[tour].price * guests
  useEffect(() => {
    if (prefersReduced()) {
      setShownTotal(target)
      return
    }
    const start = shownTotal
    const t0 = Date.now()
    const dur = 520
    const iv = window.setInterval(() => {
      const p = Math.min(1, (Date.now() - t0) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setShownTotal(Math.round(start + (target - start) * eased))
      if (p >= 1) window.clearInterval(iv)
    }, 16)
    const fs = window.setTimeout(() => {
      window.clearInterval(iv)
      setShownTotal(target)
    }, dur + 120)
    return () => {
      window.clearInterval(iv)
      window.clearTimeout(fs)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])

  const choose = (id: string) => {
    const i = TOURS.findIndex((t) => t.id === id)
    if (i >= 0) setTour(i)
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="font-hanken overflow-x-hidden" style={{ background: INK, color: INKTX }}>
      <style>{`
        #eyja-root ::selection { background:${GOLD}; color:${INKTX}; }
        /* Hero entrance — base state visible; only the keyframe (which runs even
           in a throttled tab, unlike rAF/Framer) drops it in. */
        .ey-rise { opacity:1; }
        @media (prefers-reduced-motion: no-preference) {
          .ey-rise { animation: ey-rise .9s cubic-bezier(.2,.7,.2,1) var(--d,0ms) both; }
          @keyframes ey-rise { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:none; } }
          @keyframes ey-ken { from { transform:scale(1.04); } to { transform:scale(1.18); } }
          @keyframes ey-float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-12px); } }
          @keyframes ey-pulse { 0%,100% { opacity:.45; transform:scale(1); } 50% { opacity:1; transform:scale(1.35); } }
          @keyframes ey-wipe { 0% { transform:translateX(-130%); } 60%,100% { transform:translateX(130%); } }
          @keyframes ey-drift { 0%,100% { transform:translate(0,0); } 50% { transform:translate(3%,-4%); } }
          @keyframes ey-bob { 0%,100% { transform:translateY(0); } 50% { transform:translateY(7px); } }
          .ey-ken { animation: ey-ken 24s ease-in-out infinite alternate; }
          .ey-float { animation: ey-float 6s ease-in-out infinite; }
          .ey-pulse { animation: ey-pulse 2.6s ease-in-out infinite; }
          .ey-drift { animation: ey-drift 16s ease-in-out infinite; }
          .ey-bob { animation: ey-bob 2s ease-in-out infinite; }
          .ey-wipe::after { content:''; position:absolute; inset:0; background:linear-gradient(100deg, transparent, rgba(255,255,255,.45), transparent); transform:translateX(-130%); animation: ey-wipe 4s ease-in-out infinite; pointer-events:none; }
        }
      `}</style>
      <div id="eyja-root">
        <PreviewChrome company={company} />
        <Nav />
        <main>
          <Hero tourName={TOURS[tour].name} guests={guests} />
          <FactsBand />
          <Intro />
          <Tours onChoose={choose} />
          <ArchipelagoMap />
          <Eruption />
          <MeetEbbi />
          <Reviews />
          <Booking
            tour={tour}
            setTour={setTour}
            guests={guests}
            setGuests={setGuests}
            date={date}
            setDate={setDate}
            shownTotal={shownTotal}
          />
          <FinalCta />
        </main>
        <MarketingFooter />
        <PreviewFooter company={company} />
      </div>
    </div>
  )
}
