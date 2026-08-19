import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import Lenis from 'lenis'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Gift, Mail, MapPin, Phone, X } from 'lucide-react'
import { companyEntry } from './data'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { BOOKING, CONTACT, FOOD_IMAGES, HERO_IMAGE, JSON_LD, META, PLACE_IMAGES, RESTAURANT_ROOM, SIZES, SRCSET } from './data'

const company = companyEntry

/* ── BIRTAN VIÐ VATNIÐ · Palazzo Sogni transplant ─────────────────────────
   The page drifts through the light of one Mývatn day, and the food is what
   it lights. ONE scroll-progress value (framer's useScroll over the whole
   <main>) drives FOUR fixed, full-bleed colour layers crossfaded by opacity
   only (never background-color transitions) — basalt night, aurora, glacier
   dawn, midnight gold — so the entire page's ground tints continuously as
   you scroll, the way Palazzo Sogni's pinkGradient/blueGradient chapters do.
   The DayJourney section narrates those same four beats in words; the wash
   itself is not scoped to that section, it runs the length of the page.

   Their strongest asset is the March-2026 Eldey plate photography (large,
   2048x1365) — it carries the page. Place photography (lobby/lounge/bar/etc)
   is genuinely small (1205x1600) and is only ever shown in constrained
   portrait frames, never blown up full-bleed. No literal guest-room photo
   exists in their library, so the rooms section is honest: a labelled
   gallery of the hotel's real shared interiors, not staged bedrooms.

   Booking hands off to GODO (propid 118355) — verified live engine, not
   Reserva (reserva.is/hotellaxa 404s). Reserva is gift cards only, at
   gjafabref.reserva.is/hotellaxa, a plain link-out. The booking module is
   OURS rather than an embedded iframe: GODO documents checkin/checkout/
   numadult/numchild as query params on booking.php, so a bespoke card can
   carry the guest's real choice into their live engine instead of dropping a
   boxed third-party form into the middle of the page. Reading live
   availability is a later job and nothing here claims to do it.        ── */

const BASALT = '#0E1114'
const AURORA = '#123B2E'
const GLACIER = '#1C3348'
const GOLD = '#2A2318'
const WASHES = [BASALT, AURORA, GLACIER, GOLD] as const
const WASH_STOPS = [0, 1 / 3, 2 / 3, 1] as const

const INK = '#F4F1EA'
/** >=4.5:1 on every wash (checked: 8.36 / 5.48 / 5.74 / 6.86). Safe for any body text. */
const MUT = '#A7ADB3'
/** Only >=3:1 on aurora/glacier (3.69 / 3.86) — LARGE text, icons, borders,
 *  and solid button fills only. Never small text directly on the wash. */
const ACCENT = '#C8792F'
/** Text-on-ACCENT ink (5.43:1 on ACCENT). */
const BTN_INK = '#1C130A'
const HAIR = 'rgba(244,241,234,0.14)'

const DISPLAY = "'Cabinet Grotesk', sans-serif"
const BODY = "'Switzer', sans-serif"

const EASE = [0.32, 0.72, 0, 1] as const
const BASE = import.meta.env.BASE_URL

/* Variable fonts, wght 100-900 declared once each so font-weight drives the
   axis directly. Both verified Icelandic-safe (þ ð æ ö, both-case acutes). */
const CSS = `
  @font-face { font-family: 'Cabinet Grotesk'; src: url('${BASE}fonts/cabinet-grotesk/fonts/CabinetGrotesk-Variable.woff2') format('woff2'); font-weight: 100 900; font-style: normal; font-display: swap; }
  @font-face { font-family: 'Switzer'; src: url('${BASE}fonts/switzer/Switzer-Variable.woff2') format('woff2'); font-weight: 100 900; font-style: normal; font-display: swap; }
  @font-face { font-family: 'Geist Mono'; src: url('${BASE}fonts/geist-mono/GeistMono-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }

  /* SHAPE RULE, documented so the one-radius lock still holds: every interactive
     control on this page is a full pill; every surface (frames, cards, panels)
     stays at 2px. Buttons are the single documented exception, applied
     everywhere, never case by case.
     Vocabulary lifted from Alrún (.ax-add / .ax-hlink): mono uppercase
     micro-type at .14em tracking, solid fill for primary, hairline for
     secondary, and hover = opacity .88 + translateY(-1px). Deliberately no
     scale and no shadow: the lift is the whole gesture. */
  .laxa-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 10px;
    border-radius: 999px; padding: 13px 26px;
    font-family: 'Geist Mono', ui-monospace, Menlo, monospace;
    font-size: 11.5px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase;
    white-space: nowrap;
    transition: opacity .25s ease, transform .25s cubic-bezier(.22,1,.36,1), border-color .25s ease, background-color .25s ease;
  }
  .laxa-btn:hover { opacity: .88; transform: translateY(-1px); }
  .laxa-btn:active { transform: translateY(0); }
  .laxa-btn-solid { background: ${ACCENT}; color: ${BTN_INK}; border: 1px solid ${ACCENT}; }
  .laxa-btn-ghost { background: transparent; color: ${INK}; border: 1px solid rgba(244,241,234,0.34); }
  .laxa-btn-ghost:hover { border-color: rgba(244,241,234,0.68); }
  @media (prefers-reduced-motion: reduce) {
    .laxa-btn, .laxa-btn:hover, .laxa-btn:active { transition: none; transform: none; }
  }

  /* native date inputs drag the OS widget's own light chrome onto a dark page */
  .laxa-date::-webkit-calendar-picker-indicator { filter: invert(1); opacity: .55; cursor: pointer; }
  .laxa-date::-webkit-calendar-picker-indicator:hover { opacity: 1; }
  .laxa-date::-webkit-datetime-edit { color: inherit; }

  /* the mono micro-labels sit at 10.5-11px, which is fine on a desktop but
     genuinely small on a phone held at arm's length */
  @media (max-width: 640px) {
    .laxa-page .text-\\[10\\.5px\\] { font-size: 12px; }
    .laxa-page .text-\\[11px\\] { font-size: 12px; }
  }

  .laxa-page ::selection { background: ${ACCENT}; color: ${BTN_INK}; }
  .laxa-page a:focus-visible, .laxa-page button:focus-visible {
    outline: 2px solid ${ACCENT}; outline-offset: 3px; border-radius: 2px;
  }

  /* Hero "drift": the front-1 exterior is the one signature large photo
     (4080x3072), so it stands in for Palazzo Sogni's looping hero video —
     a slow, continuous, transform-only breathing motion. */
  @keyframes laxa-drift {
    0%   { transform: scale(1) translate3d(0, 0, 0); }
    100% { transform: scale(1.07) translate3d(-1%, -1.5%, 0); }
  }
  .laxa-drift { animation: laxa-drift 28s cubic-bezier(0.45, 0, 0.55, 1) infinite alternate; }
  @media (prefers-reduced-motion: reduce) {
    .laxa-drift { animation: none !important; }
  }
`

/* ── text reveal (whileInView is safe here: plain opacity/y, never clipped
      or scaled to zero, so its own IntersectionObserver always fires) ── */
function Rise({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/* ── content-image reveal: MOUNT-TRIGGERED only, never whileInView. Every
      real photo on this page uses this, never Rise. ── */
function MountFade({
  children,
  delay = 0,
  className,
  y = 22,
}: {
  children: ReactNode
  delay?: number
  className?: string
  y?: number
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-[19px] uppercase leading-[1.5] tracking-[1px] sm:text-[20px]"
      style={{ fontFamily: DISPLAY, fontWeight: 300, color: MUT }}
    >
      {children}
    </p>
  )
}

function H2({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={`text-[clamp(2.4rem,5.5vw,4.5rem)] uppercase leading-[1.05] tracking-[0.02em] ${className}`}
      style={{ fontFamily: DISPLAY, fontWeight: 150, color: INK }}
    >
      {children}
    </h2>
  )
}

/* ── the wash: ONE scroll-progress value (framer's useScroll over <main>),
      written to a CSS custom property AND used to crossfade four fixed
      full-bleed colour layers by OPACITY ONLY. No window scroll listener. ── */
function WashBackground({ scrollYProgress, reduce }: { scrollYProgress: MotionValue<number>; reduce: boolean | null }) {
  const r0 = useRef<HTMLDivElement>(null)
  const r1 = useRef<HTMLDivElement>(null)
  const r2 = useRef<HTMLDivElement>(null)
  const r3 = useRef<HTMLDivElement>(null)
  const refs = [r0, r1, r2, r3]
  const barRef = useRef<HTMLDivElement>(null)

  const opacityAt = (v: number, stop: number) => Math.max(0, 1 - Math.abs(v - stop) * 3)
  const v0 = reduce ? 0 : Math.max(0, Math.min(1, scrollYProgress.get()))

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reduce) return
    const c = Math.max(0, Math.min(1, v))
    document.documentElement.style.setProperty('--laxa-progress', c.toFixed(4))
    WASH_STOPS.forEach((stop, i) => {
      const el = refs[i].current
      if (el) el.style.opacity = opacityAt(c, stop).toFixed(3)
    })
    if (barRef.current) barRef.current.style.transform = `scaleX(${c})`
  })

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10" style={{ background: BASALT }}>
      {WASHES.map((color, i) => (
        <div
          key={color}
          ref={refs[i]}
          className="absolute inset-0"
          style={{ background: color, opacity: opacityAt(v0, WASH_STOPS[i]), willChange: 'opacity' }}
        />
      ))}
      <div className="fixed inset-x-0 top-0 z-[45] h-px" style={{ background: HAIR }}>
        <div
          ref={barRef}
          className="h-full origin-left"
          style={{ background: ACCENT, transform: `scaleX(${v0})`, willChange: 'transform' }}
        />
      </div>
    </div>
  )
}

/* ── nav: two-line hamburger morphing to an X (transform only), opening a
      full-screen overlay rendered as a SIBLING of the header — never nested
      inside it, since the header's own backdrop-filter would otherwise
      become the overlay's containing block and collapse it to nothing. ── */
const NAV_LINKS = [
  { id: 'eldey', label: 'Eldey' },
  { id: 'herbergi', label: 'Herbergi' },
  { id: 'vatnid', label: 'Vatnið' },
  { id: 'bokun', label: 'Bókun' },
  { id: 'gjafabref', label: 'Gjafabréf' },
  { id: 'upplysingar', label: 'Upplýsingar' },
  { id: 'samband', label: 'Samband' },
]

function Burger({ open }: { open: boolean }) {
  const reduce = useReducedMotion()
  const dur = reduce ? 0 : 0.32
  return (
    <span className="relative block h-3.5 w-6" aria-hidden>
      <motion.span
        className="absolute left-0 top-0 h-px w-full origin-center"
        style={{ background: INK }}
        animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }}
        transition={{ duration: dur, ease: EASE }}
      />
      <motion.span
        className="absolute bottom-0 left-0 h-px w-full origin-center"
        style={{ background: INK }}
        animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }}
        transition={{ duration: dur, ease: EASE }}
      />
    </span>
  )
}

function Header({
  open,
  setOpen,
  scrollY,
  scrollToId,
}: {
  open: boolean
  setOpen: (v: boolean) => void
  scrollY: MotionValue<number>
  scrollToId: (id: string) => void
}) {
  const [solid, setSolid] = useState(false)
  useMotionValueEvent(scrollY, 'change', (v) => {
    setSolid((prev) => (prev === v > 40 ? prev : v > 40))
  })
  return (
    <header
      className="fixed inset-x-0 top-0 z-40 transition-colors duration-500"
      style={{
        background: solid || open ? 'rgba(14,17,20,0.88)' : 'transparent',
        backdropFilter: solid || open ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: solid || open ? 'blur(14px)' : 'none',
        borderBottom: solid || open ? `1px solid ${HAIR}` : '1px solid transparent',
      }}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:px-8">
        <button
          onClick={() => scrollToId('top')}
          className="text-[14px] uppercase tracking-[0.16em]"
          style={{ fontFamily: DISPLAY, fontWeight: 400, color: INK }}
        >
          Hótel Laxá
        </button>
        <button
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-label={open ? 'Loka valmynd' : 'Opna valmynd'}
          className="flex h-11 w-11 items-center justify-center rounded-[2px]"
        >
          <Burger open={open} />
        </button>
      </div>
    </header>
  )
}

function MenuOverlay({ onClose, go }: { onClose: () => void; go: (id: string) => void }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    ref.current?.querySelector<HTMLElement>('a,button')?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Valmynd"
      lang="is"
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-1 px-6"
      style={{ background: 'rgba(14,17,20,0.97)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' }}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
    >
      <button
        onClick={onClose}
        aria-label="Loka valmynd"
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-[2px] border md:right-8 md:top-7"
        style={{ borderColor: HAIR, color: INK }}
      >
        <X size={20} aria-hidden />
      </button>
      <nav className="flex flex-col items-center gap-1">
        {NAV_LINKS.map((l, i) => (
          <motion.button
            key={l.id}
            onClick={() => {
              onClose()
              go(l.id)
            }}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: reduce ? 0 : 0.08 + i * 0.05, ease: EASE }}
            className="px-4 py-2.5 text-center text-[clamp(1.6rem,5vw,2.8rem)] uppercase leading-[1.25]"
            style={{ fontFamily: DISPLAY, fontWeight: 300, letterSpacing: '0.02em', color: INK }}
          >
            {l.label}
          </motion.button>
        ))}
      </nav>
      <a
        href={CONTACT.phoneHref}
        className="mt-8 text-[13px] uppercase tracking-[0.18em]"
        style={{ fontFamily: BODY, color: MUT }}
      >
        {CONTACT.phoneDisplay}
      </a>
    </motion.div>
  )
}

/* ── hero: front-1 exterior, drifting, the codename headline ── */
function Hero({ scrollToId }: { scrollToId: (id: string) => void }) {
  const reduce = useReducedMotion()
  return (
    <section id="top" className="relative flex min-h-[100dvh] items-end overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        <img
          src={HERO_IMAGE.src}
          srcSet={SRCSET[HERO_IMAGE.src]}
          sizes="100vw"
          alt={HERO_IMAGE.alt}
          // @ts-expect-error React 18 DOM typings want the lowercase attribute
          fetchpriority="high"
          className={reduce ? 'h-full w-full object-cover' : 'laxa-drift h-full w-full object-cover'}
        />
        <div
          className="absolute inset-0"
          style={{
            /* Measured, not guessed: with the old stops the 150-weight display sat
               on backdrop pixels around rgb(171,167,157) and read 2.13:1, well
               under the 3:1 large-text floor. The band from 20% to 62% is where
               the eyebrow, headline and standfirst actually land, so it is held
               dark enough for near-white ink while the sky above stays open. */
            background: `linear-gradient(to top, ${BASALT} 6%, rgba(14,17,20,0.78) 22%, rgba(14,17,20,0.66) 44%, rgba(14,17,20,0.42) 62%, rgba(14,17,20,0.16) 80%, rgba(14,17,20,0.34) 100%)`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40"
          style={{ background: 'linear-gradient(to bottom, rgba(4,5,6,0.55), transparent)' }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-20 pt-32 md:px-8 md:pb-28">
        <MountFade>
          <p className="text-[13px] uppercase tracking-[0.2em]" style={{ fontFamily: BODY, color: INK }}>
            Hótel Laxá · Mývatn
          </p>
        </MountFade>

        <div className="mt-4 overflow-hidden">
          <motion.h1
            className="max-w-5xl text-[clamp(2.6rem,9vw,7.5rem)] uppercase leading-[1.02] tracking-[0.01em]"
            style={{ fontFamily: DISPLAY, fontWeight: 150, color: INK }}
            initial={reduce ? false : { y: '110%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 1, delay: 0.15, ease: EASE }}
          >
            Birtan við vatnið
          </motion.h1>
        </div>

        <MountFade delay={0.5} className="mt-7">
          {/* INK, not MUT: this is the only body copy sitting on the photograph,
              and the muted grey measured 3.87:1 against the brightest backdrop
              pixels behind it. MUT stays correct everywhere it sits on a solid
              wash; over media it has to be lifted. */}
          <p className="max-w-lg text-[15px] md:text-[17px]" style={{ fontFamily: BODY, color: INK }}>
            Síðan fylgir ljósi eins dags við Mývatn. Maturinn er það sem birtan lýsir upp.
          </p>
        </MountFade>

        <MountFade delay={0.65} className="mt-9 flex flex-wrap items-center gap-4">
          <button
            onClick={() => scrollToId('eldey')}
            className="laxa-btn laxa-btn-solid group"
          >
            Skoða Eldey
            <ArrowDown size={14} aria-hidden className="transition-transform duration-500 group-hover:translate-y-0.5" />
          </button>
          <button
            onClick={() => scrollToId('bokun')}
            className="laxa-btn laxa-btn-ghost"
          >
            Bóka gistingu
          </button>
        </MountFade>
      </div>
    </section>
  )
}

/* ── the four-wash journey, told in words: one day at Mývatn in four
      beats. The wash itself runs continuously across the whole page — this
      section is where the four moments are named. ── */
const DAY_BEATS = [
  { label: 'Nótt', line: 'Myrkrið sest yfir hraunið. Kyrrðin er alger.' },
  { label: 'Norðurljós', line: 'Grænt ljós dansar yfir vatnið. Himinninn lifnar við.' },
  { label: 'Dagsbirta', line: 'Fjöllin skýrast. Gufan stígur úr jörðinni.' },
  { label: 'Kvöldgull', line: 'Sólin lækkar og allt fær gylltan blæ.' },
]

function DayJourney() {
  return (
    <section id="dagur" className="relative mx-auto max-w-[1400px] px-5 py-32 md:px-8 md:py-40">
      <Rise>
        <Eyebrow>Einn dagur</Eyebrow>
      </Rise>
      <Rise delay={0.06}>
        <H2 className="mt-3 max-w-3xl">Fjórar birtur, einn Mývatnsdagur</H2>
      </Rise>

      <div className="mt-16 flex flex-col md:mt-24">
        {DAY_BEATS.map((b) => (
          <Rise key={b.label}>
            <div
              className="flex flex-col gap-3 border-t py-10 md:flex-row md:items-baseline md:gap-14 md:py-14"
              style={{ borderColor: HAIR }}
            >
              <span
                className="shrink-0 text-[13px] uppercase tracking-[0.18em] md:w-48"
                style={{ fontFamily: BODY, color: INK }}
              >
                {b.label}
              </span>
              <p
                className="max-w-2xl text-[clamp(1.1rem,2.4vw,1.6875rem)] uppercase leading-[1.74] tracking-[0.08em]"
                style={{ fontFamily: DISPLAY, fontWeight: 300, color: MUT }}
              >
                {b.line}
              </p>
            </div>
          </Rise>
        ))}
      </div>
    </section>
  )
}

/* ── Eldey: the centrepiece. The real plated dishes carry this section. ── */
function Eldey() {
  const reduce = useReducedMotion()
  /* One plate at a time, held in a single frame, driven by a real menu index.
     The old 2x4 masonry read as a ragged photo dump: mismatched tile heights,
     rows that did not line up, dead space, and a caption floating over every
     image. This is ledger #14's rule applied - an asymmetric split is allowed
     when it DOES something, and here hovering or focusing a dish swaps the
     panel. Dishes are deduped by name: the source array photographs Blalanga
     and Reyktur silungur twice each, which would print a menu with repeated
     lines. */
  const dishes = FOOD_IMAGES.filter(
    (f, i, arr) => arr.findIndex((x) => x.dish === f.dish) === i,
  )
  const [active, setActive] = useState(0)
  const current = dishes[active]

  return (
    <section id="eldey" className="mx-auto max-w-[1400px] px-5 py-32 md:px-8 md:py-40">
      <div className="max-w-xl">
        <Rise>
          <Eyebrow>Veitingastaðurinn</Eyebrow>
        </Rise>
        <Rise delay={0.06}>
          <h2
            className="mt-2 text-[clamp(3rem,8vw,6rem)] uppercase leading-[0.98] tracking-[0.01em]"
            style={{ fontFamily: DISPLAY, fontWeight: 150, color: INK }}
          >
            Eldey
          </h2>
        </Rise>
        <Rise delay={0.14}>
          <p className="mt-7 text-[15px] md:text-[16px]" style={{ fontFamily: BODY, color: MUT }}>
            Eldey er veitingastaður Hótel Laxár. Réttirnir hér eru af núverandi matseðli, ljósmyndaðir í mars 2026.
          </p>
        </Rise>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-10 md:mt-20 lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-16">
        {/* the index */}
        <ul className="order-2 lg:order-1">
          {dishes.map((d, i) => {
            const on = i === active
            return (
              <li key={d.src}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={on}
                  className="group flex w-full items-baseline gap-5 border-b py-5 text-left transition-colors duration-300 md:py-6"
                  style={{ borderColor: on ? ACCENT : HAIR }}
                >
                  <span
                    className="shrink-0 text-[11px] tracking-[0.16em] transition-colors duration-300"
                    style={{ fontFamily: "'Geist Mono', ui-monospace, monospace", color: on ? ACCENT : MUT }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="text-[clamp(1.25rem,2.6vw,1.9rem)] uppercase leading-[1.15] tracking-[0.02em] transition-colors duration-300"
                    style={{ fontFamily: DISPLAY, fontWeight: on ? 300 : 180, color: on ? INK : MUT }}
                  >
                    {d.dish}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        {/* the plate - one frame, one aspect ratio, crossfaded */}
        <MountFade delay={0.12} className="order-1 lg:order-2 lg:sticky lg:top-24">
          <figure className="relative overflow-hidden rounded-[2px]" style={{ aspectRatio: '2048 / 1365' }}>
            {dishes.map((d, i) => (
              <img
                key={d.src}
                src={d.src}
                srcSet={SRCSET[d.src]}
                sizes={SIZES}
                alt={i === active ? d.alt : ''}
                /* the five inactive plates stay in the DOM so the crossfade has
                   nothing to load mid-swap, but a screen reader must not read
                   out six dishes when one is on screen */
                aria-hidden={i !== active}
                loading={i === 0 ? 'eager' : 'lazy'}
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  opacity: i === active ? 1 : 0,
                  transition: reduce ? 'none' : 'opacity .55s cubic-bezier(.22,1,.36,1)',
                }}
              />
            ))}
          </figure>
          <figcaption
            className="mt-4 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.16em]"
            style={{ fontFamily: "'Geist Mono', ui-monospace, monospace", color: MUT }}
          >
            <span style={{ color: INK }}>{current.dish}</span>
            <span>
              {String(active + 1).padStart(2, '0')} / {String(dishes.length).padStart(2, '0')}
            </span>
          </figcaption>
        </MountFade>
      </div>

      {/* The room itself. This file is 1205x1600 PORTRAIT: an earlier pass put it
          in a full-width 16:7 band, which cropped away most of the picture and
          then upscaled what was left. Shown at its own aspect ratio, contained,
          at a width its resolution genuinely supports. */}
      <MountFade delay={0.1} className="mt-20 md:mt-28">
        <figure className="grid grid-cols-1 items-end gap-8 md:grid-cols-[minmax(0,460px)_1fr] md:gap-14">
          <div className="overflow-hidden rounded-[2px]" style={{ aspectRatio: '1205 / 1600' }}>
            <img
              src={RESTAURANT_ROOM.src}
              alt={RESTAURANT_ROOM.alt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <figcaption className="pb-2">
            <p
              className="text-[10.5px] uppercase tracking-[0.18em]"
              style={{ fontFamily: "'Geist Mono', ui-monospace, monospace", color: MUT }}
            >
              {RESTAURANT_ROOM.label}
            </p>
            <p className="mt-4 max-w-sm text-[15px] md:text-[16px]" style={{ fontFamily: BODY, color: MUT }}>
              Borðstofan snýr að vatninu, svo birtan breytist yfir máltíðina eins og hún gerir úti.
            </p>
          </figcaption>
        </figure>
      </MountFade>
    </section>
  )
}

/* ── rooms: honest about 80. No literal guest-room photo exists in their
      library, so this is a labelled gallery of the real shared interiors,
      never staged as bedrooms. ── */
function Rooms() {
  return (
    <section id="herbergi" className="mx-auto max-w-[1400px] px-5 py-32 md:px-8 md:py-40">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <Rise>
            <Eyebrow>Herbergin</Eyebrow>
          </Rise>
          <Rise delay={0.06}>
            <H2 className="mt-2">80 herbergi við vatnið</H2>
          </Rise>
        </div>
        <Rise delay={0.12}>
          <p className="max-w-sm text-[15px]" style={{ fontFamily: BODY, color: MUT }}>
            Hótel Laxá er sjálfstætt starfandi hótel, ekki hluti af keðju. Hér sjást sameiginleg rými hótelsins, ekki einstök herbergi.
          </p>
        </Rise>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 md:mt-20 md:grid-cols-4 md:gap-5">
        {PLACE_IMAGES.map((p, i) => (
          <MountFade key={p.src + i} delay={0.05 * i}>
            <figure className="group relative overflow-hidden rounded-[2px]" style={{ aspectRatio: '1205 / 1600' }}>
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <figcaption
                className="absolute inset-x-0 bottom-0 p-3 text-[11px] uppercase tracking-[0.14em]"
                style={{ fontFamily: BODY, color: INK, background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)' }}
              >
                {p.label}
              </figcaption>
            </figure>
          </MountFade>
        ))}
      </div>
    </section>
  )
}

/* ── the lake: no photo of Mývatn's water exists in their library, so this
      stays pure typography over the wash — the constraint the brief calls
      out ("design around small images") solved by not using one at all. ── */
function Lake() {
  return (
    <section id="vatnid" className="relative mx-auto max-w-[1400px] px-5 py-40 text-center md:px-8 md:py-56">
      <Rise>
        <Eyebrow>Mývatn</Eyebrow>
      </Rise>
      <Rise delay={0.08}>
        <h2
          className="mx-auto mt-2 max-w-4xl text-[clamp(2.6rem,8vw,7rem)] uppercase leading-[0.98]"
          style={{ fontFamily: DISPLAY, fontWeight: 150, letterSpacing: '0.01em', color: INK }}
        >
          Vatnið er við dyrnar
        </h2>
      </Rise>
      <Rise delay={0.16}>
        <p
          className="mx-auto mt-8 max-w-xl text-[clamp(1rem,1.6vw,1.6875rem)] uppercase leading-[1.74] tracking-[0.08em]"
          style={{ fontFamily: DISPLAY, fontWeight: 300, color: MUT }}
        >
          Grunnt, eldbrunnið stöðuvatn á Norðurlandi. Þekkt fyrir fuglalíf og gervigíga sem hringa sig meðfram ströndinni.
        </p>
      </Rise>
    </section>
  )
}

/* ── booking: hands off to GODO (propid 118355), the live engine — not
      Reserva, which is gift cards only on this property. GODO's documented
      embed requires a FIXED PIXEL HEIGHT with no documented auto-resize or
      postMessage height sync, so this is a deliberately BOXED module: a
      framed window with a stated height, not a fluid full-bleed iframe. ── */
function Booking() {
  /* The raw GODO iframe was the whole problem: a boxed 1990s hotel form
     dropped into the middle of a slow, dark, editorial page. It read as a
     different website.

     So the booking module is now OURS, and the handoff is real rather than
     decorative. GODO documents these query parameters on booking.php:
     checkin, checkout, numnight, numadult, numchild, propid, lang, referer.
     That means a bespoke card can carry the guest's actual choice INTO their
     live engine instead of making them start again, which is strictly better
     than embedding the iframe and is the honest answer to "keep what they run".

     Nothing here pretends to know availability or price. It collects dates and
     guests and hands off. Wiring the live availability read is a later job. */
  const today = new Date()
  const iso = (d: Date) => d.toISOString().slice(0, 10)
  const plus = (n: number) => { const d = new Date(today); d.setDate(d.getDate() + n); return d }
  const [checkin, setCheckin] = useState(iso(plus(1)))
  const [checkout, setCheckout] = useState(iso(plus(3)))
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)

  const nights = Math.max(
    0,
    Math.round((new Date(checkout).getTime() - new Date(checkin).getTime()) / 86400000),
  )
  const href =
    `${BOOKING.godoUrl}&checkin=${checkin}&checkout=${checkout}&numadult=${adults}&numchild=${children}`

  const Stepper = ({
    label, value, set, min = 0, max = 9,
  }: { label: string; value: number; set: (n: number) => void; min?: number; max?: number }) => (
    <div className="flex items-center justify-between py-4">
      <span className="text-[13px]" style={{ fontFamily: BODY, color: INK }}>{label}</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => set(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Fækka: ${label}`}
          className="flex h-11 w-11 items-center justify-center rounded-full border text-[15px] transition-colors disabled:opacity-30"
          style={{ borderColor: HAIR, color: INK }}
        >
          &minus;
        </button>
        <span
          className="w-9 text-center text-[14px] tabular-nums"
          style={{ fontFamily: "'Geist Mono', ui-monospace, monospace", color: INK }}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={() => set(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Fjölga: ${label}`}
          className="flex h-11 w-11 items-center justify-center rounded-full border text-[15px] transition-colors disabled:opacity-30"
          style={{ borderColor: HAIR, color: INK }}
        >
          +
        </button>
      </div>
    </div>
  )

  return (
    <section id="bokun" className="relative mx-auto max-w-[1400px] px-5 py-32 md:px-8 md:py-40">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
        <div>
          <Rise><Eyebrow>Bein bókun</Eyebrow></Rise>
          <Rise delay={0.06}><H2 className="mt-2">Bókaðu beint</H2></Rise>
          <Rise delay={0.12}>
            <p className="mt-7 max-w-md text-[15px] md:text-[16px]" style={{ fontFamily: BODY, color: MUT }}>
              Veldu dagsetningar hér og við opnum bókunarkerfið með valinu þínu tilbúnu. Framboð og verð koma beint úr kerfi hótelsins.
            </p>
          </Rise>
          <Rise delay={0.18}>
            <a
              href={BOOKING.giftCardUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex min-h-[44px] items-center gap-2 text-[12px] uppercase tracking-[0.14em] underline-offset-4 hover:underline"
              style={{ fontFamily: "'Geist Mono', ui-monospace, monospace", color: MUT }}
            >
              <Gift size={14} aria-hidden style={{ color: ACCENT }} />
              Eða gefðu gjafabréf
            </a>
          </Rise>
        </div>

        <MountFade delay={0.15}>
          <div
            className="rounded-[2px] border p-6 md:p-8"
            style={{ borderColor: HAIR, background: 'rgba(244,241,234,0.035)' }}
          >
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'laxa-in', label: 'Innskráning', v: checkin, set: setCheckin, min: iso(today) },
                { id: 'laxa-out', label: 'Útskráning', v: checkout, set: setCheckout, min: checkin },
              ].map((f) => (
                <div key={f.id}>
                  <label
                    htmlFor={f.id}
                    className="block text-[10.5px] uppercase tracking-[0.18em]"
                    style={{ fontFamily: "'Geist Mono', ui-monospace, monospace", color: MUT }}
                  >
                    {f.label}
                  </label>
                  <input
                    id={f.id}
                    type="date"
                    value={f.v}
                    min={f.min}
                    onChange={(e) => f.set(e.target.value)}
                    className="laxa-date mt-2 min-h-[44px] w-full border-0 border-b bg-transparent pb-2 text-[15px] outline-none"
                    style={{ borderColor: HAIR, color: INK, fontFamily: BODY }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-2 divide-y" style={{ borderColor: HAIR }}>
              <Stepper label="Fullorðnir" value={adults} set={setAdults} min={1} />
              <Stepper label="Börn" value={children} set={setChildren} />
            </div>

            <a href={href} target="_blank" rel="noreferrer" className="laxa-btn laxa-btn-solid mt-7 w-full">
              Athuga framboð
              <ArrowUpRight size={14} aria-hidden />
            </a>

            <p
              className="mt-4 text-center text-[10.5px] uppercase tracking-[0.14em]"
              style={{ fontFamily: "'Geist Mono', ui-monospace, monospace", color: MUT }}
            >
              {nights > 0 ? `${nights} ${nights === 1 ? 'nótt' : 'nætur'} · ` : ''}Opnast í bókunarkerfi hótelsins
            </p>
          </div>
        </MountFade>
      </div>
    </section>
  )
}

/* ── gift cards: Reserva, plain link-out, no fake purchase flow ── */
function GiftCards() {
  return (
    <section id="gjafabref" className="mx-auto max-w-[1400px] px-5 py-32 md:px-8 md:py-40">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <Rise>
          <Eyebrow>Gjöf</Eyebrow>
        </Rise>
        <Rise delay={0.06}>
          <H2 className="mt-2">Gjafabréf</H2>
        </Rise>
        <Rise delay={0.12}>
          <p className="mt-6 text-[15px] md:text-[16px]" style={{ fontFamily: BODY, color: MUT }}>
            Gjafabréf á Hótel Laxá eru seld í gegnum Reserva. Veldu upphæð og sendu gjöfina beint.
          </p>
        </Rise>
        <Rise delay={0.18}>
          <a
            href={BOOKING.giftCardUrl}
            target="_blank"
            rel="noreferrer"
            className="laxa-btn laxa-btn-ghost mt-9"
          >
            <Gift size={16} aria-hidden style={{ color: ACCENT }} />
            Kaupa gjafabréf
            <ArrowUpRight size={14} aria-hidden />
          </a>
          <p className="mt-3 text-[12px]" style={{ color: MUT, fontFamily: BODY }}>
            Opnast hjá Reserva, í nýjum flipa.
          </p>
        </Rise>
      </div>
    </section>
  )
}

/* ── practical info ── */
const FACTS = [
  { k: 'Opnað', v: '2014' },
  { k: 'Herbergi', v: '80' },
  { k: 'Veitingastaður', v: 'Eldey, á staðnum' },
  { k: 'Rekstur', v: 'Sjálfstætt starfandi hótel, ekki hluti af keðju' },
  { k: 'Tungumál', v: 'Upplýsingar á íslensku og ensku' },
]

function PracticalInfo() {
  return (
    <section id="upplysingar" className="mx-auto max-w-[1400px] px-5 py-32 md:px-8 md:py-40">
      <Rise>
        <Eyebrow>Gott að vita</Eyebrow>
      </Rise>
      <Rise delay={0.06}>
        <H2 className="mt-2">Hagnýtar upplýsingar</H2>
      </Rise>
      <dl className="mt-14 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 md:mt-20">
        {FACTS.map((f, i) => (
          <Rise key={f.k} delay={0.08 + i * 0.06}>
            <div className="border-t pt-4" style={{ borderColor: HAIR }}>
              <dt className="text-[11px] uppercase tracking-[0.18em]" style={{ fontFamily: BODY, color: MUT }}>
                {f.k}
              </dt>
              <dd className="mt-2 text-[17px]" style={{ fontFamily: BODY, color: INK }}>
                {f.v}
              </dd>
            </div>
          </Rise>
        ))}
      </dl>
      <Rise delay={0.4}>
        <p className="mt-14 text-[12px]" style={{ fontFamily: BODY, color: MUT }}>
          Hótel Laxá ehf. · kt. {CONTACT.kennitala}
        </p>
      </Rise>
    </section>
  )
}

/* ── contact / outro ── */
function ContactOutro() {
  return (
    <section id="samband" className="relative mx-auto max-w-[1400px] px-5 py-32 text-center md:px-8 md:py-44">
      <Rise>
        <Eyebrow>Samband</Eyebrow>
      </Rise>
      <Rise delay={0.08}>
        <h2
          className="mx-auto mt-2 max-w-4xl text-[clamp(2.6rem,8vw,7rem)] uppercase leading-[0.98]"
          style={{ fontFamily: DISPLAY, fontWeight: 150, letterSpacing: '0.01em', color: INK }}
        >
          Komdu við vatnið
        </h2>
      </Rise>
      <Rise delay={0.16}>
        <p className="mx-auto mt-8 max-w-md text-[15px]" style={{ fontFamily: BODY, color: MUT }}>
          {CONTACT.region}
        </p>
      </Rise>
      <Rise delay={0.22}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={CONTACT.phoneHref}
            className="laxa-btn laxa-btn-solid"
          >
            <Phone size={16} aria-hidden />
            {CONTACT.phoneDisplay}
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="laxa-btn laxa-btn-ghost"
          >
            <Mail size={16} aria-hidden />
            {CONTACT.email}
          </a>
          <a
            href={CONTACT.maps}
            target="_blank"
            rel="noreferrer"
            className="laxa-btn laxa-btn-ghost"
          >
            <MapPin size={16} aria-hidden />
            Opna kort
          </a>
        </div>
      </Rise>
    </section>
  )
}

/* ── mobile sticky bar ── */
function StickyBar({ scrollToId }: { scrollToId: (id: string) => void }) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t px-5 py-3 md:hidden"
      style={{ background: 'rgba(14,17,20,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: HAIR }}
    >
      <button
        onClick={() => scrollToId('bokun')}
        className="flex items-center py-3 text-[14px] font-medium"
        style={{ color: INK, fontFamily: BODY }}
      >
        Bóka núna
      </button>
      <a
        href={CONTACT.phoneHref}
        className="laxa-btn laxa-btn-solid"
        style={{ padding: '13px 20px', minHeight: 44 }}
      >
        <Phone size={14} aria-hidden />
        Hringja
      </a>
    </div>
  )
}

/* ── the page ── */
export default function Page() {
  const lenisRef = useRef<Lenis | null>(null)
  const pageRef = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    document.title = META.title
    setThemeColor(BASALT)
    /* the shell's index.html declares lang="en"; this page is Icelandic. */
    document.documentElement.lang = 'is'
    const meta = document.querySelector('meta[name="description"]')
    const prev = meta?.getAttribute('content') ?? ''
    meta?.setAttribute('content', META.description)
    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(ld)
    return () => {
      meta?.setAttribute('content', prev)
      ld.remove()
    }
  }, [])

  useEffect(() => {
    if (reduce) return
    const lenis = new Lenis({ duration: 1.15 })
    lenisRef.current = lenis
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduce])

  const scrollToId = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -16 })
    else el.scrollIntoView()
  }

  /* ONE scroll-progress value over the whole narrative (<main>), driving the
     wash. A second, separate useScroll (window-level) drives only the nav's
     solid/not-solid threshold. Both are framer's useScroll — never a raw
     window scroll listener. */
  const { scrollYProgress } = useScroll({ target: pageRef, offset: ['start start', 'end end'] })
  const { scrollY } = useScroll()

  return (
    <div
      className="laxa-page min-h-[100dvh] overflow-x-clip pb-16 antialiased md:pb-0"
      style={{ background: BASALT, color: INK, fontFamily: BODY }}
    >
      <style>{CSS}</style>
      <WashBackground scrollYProgress={scrollYProgress} reduce={reduce} />
      <Header open={menuOpen} setOpen={setMenuOpen} scrollY={scrollY} scrollToId={scrollToId} />
      <AnimatePresence>
        {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} go={scrollToId} />}
      </AnimatePresence>

      <main ref={pageRef}>
        <Hero scrollToId={scrollToId} />
        <DayJourney />
        <Eldey />
        <Rooms />
        <Lake />
        <Booking />
        <GiftCards />
        <PracticalInfo />
        <ContactOutro />
      </main>

      <PreviewFooter company={company} />
      <PreviewChrome company={company} />
      <StickyBar scrollToId={scrollToId} />
    </div>
  )
}
