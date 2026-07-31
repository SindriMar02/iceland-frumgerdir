import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, Mail, MapPin, Menu as MenuIcon, Phone, X } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  ADDRESS,
  CARS,
  CHEAPEST,
  DEAREST,
  EMAIL,
  FEES,
  FINANCING,
  FOUNDED,
  HOURS,
  HOURS_NOTE,
  KT,
  LEGAL,
  LICENCE,
  MAPS,
  MAPS_EMBED,
  MAX_PRICE,
  MIN_PRICE,
  NAME,
  PHONE_DISPLAY,
  PHONE_HREF,
  SEO,
  SOLULAUN,
  SPAN,
  TEAM,
  asset,
  isk,
  iskShort,
} from './data'
import type { Car } from './data'

const company = getPreviewCompany('hofdabilar')

/* ── „ALLUR SKALINN" ───────────────────────────────────────────────────────
   Höfðabílar do not have a target customer, they have a RANGE: a 590.000 kr
   1999 Cadillac DeVille parked on the same lot as a 24.800.000 kr Range
   Rover, plus a quad bike and a work van. The white-label template they
   share with most of the sector flattens all of it into identical grey
   thumbnails. So the page is built as a price SCALE you drag, and the lot
   resolves around your budget.

   The visual system is taken from their own 2002 logo, a chromed circle
   holding a chequered flag: the chequer becomes the structural grid and the
   section boundary. The idea is ARRIVAL, not speed — „leitin endar hér" —
   which is honest for a dealer selling family SUVs and a Renault Trafic.

   Ground is deliberately bright chrome-white, the opposite of the night-lot
   dark used on the Bílás page, so the two car pages share no look.        ── */

const PAPER = '#F4F5F6'
const PAPER_2 = '#E8EAEC'
const INK = '#17191B'
const SLATE = '#2D4950'
const CYAN = '#35A9C5' /* logo cyan — FILLS only */
const CYAN_INK = '#0F6076' /* darkened for text on paper — 6.5:1 */
const CYAN_LIFT = '#9ED4E2' /* lifted for text on slate — 5.9:1 */
const CHROME = '#5E5F5F' /* muted label text on paper — 6.0:1 */
const HAIR = 'rgba(23,25,27,0.14)'

const DISPLAY = "'Syne', system-ui, sans-serif"
const BODY = "'Geist', system-ui, sans-serif"
const MONO = "'Geist Mono', ui-monospace, monospace"

/* Log mapping so the cheap end of the scale is not crushed against the axis. */
const LOG_MIN = Math.log(MIN_PRICE)
const LOG_MAX = Math.log(MAX_PRICE)
const toPct = (price: number) => ((Math.log(price) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 100
/* Pin both endpoints exactly. exp(log(x)) drifts a hair below x, which at the
   top of the range silently excluded the dearest car on the lot — the one
   thing this page must be able to reach. */
const fromSlider = (v: number) =>
  v <= 0 ? MIN_PRICE : v >= 1000 ? MAX_PRICE : Math.exp(LOG_MIN + (v / 1000) * (LOG_MAX - LOG_MIN))
const toSlider = (price: number) => ((Math.log(price) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 1000
/* Guard the comparison too, so a rounded display can never disagree with the
   set it describes. */
const withinBudget = (price: number, budget: number) => price <= budget + 1

const NAV = [
  { href: '#skalinn', label: 'Verðskalinn' },
  { href: '#lodin', label: 'Á planinu' },
  { href: '#okkur', label: 'Um okkur' },
  { href: '#verdskra', label: 'Verðskrá' },
  { href: '#stadsetning', label: 'Staðsetning' },
]

/* ── Small shared pieces ──────────────────────────────────────────────── */

/** Lowercase `fetchpriority` is a real DOM attribute React 18's types don't model. */
const eagerHero = { fetchpriority: 'high' } as unknown as Record<string, string>

function Label({
  children,
  className = '',
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <span
      className={`block text-[12px] uppercase ${className}`}
      style={{ fontFamily: MONO, letterSpacing: '0.16em', ...style }}
    >
      {children}
    </span>
  )
}

/** The chequered flag from their own mark, as a structural band. */
function Chequer({
  height = 16,
  square = 16,
  className = '',
  color = INK,
  drift = true,
}: {
  height?: number
  square?: number
  className?: string
  color?: string
  drift?: boolean
}) {
  const reduce = useReducedMotion()
  return (
    <div
      aria-hidden
      className={`hb-chequer w-full overflow-hidden ${className}`}
      style={{ height }}
    >
      <div
        className={drift && !reduce ? 'hb-chequer-run' : ''}
        style={{
          height,
          width: '200%',
          backgroundImage: `repeating-conic-gradient(${color} 0% 25%, transparent 0% 50%)`,
          backgroundSize: `${square * 2}px ${square * 2}px`,
        }}
      />
    </div>
  )
}

function Rise({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.62, delay, ease: [0.22, 0.68, 0.32, 1] }}
    >
      {children}
    </motion.div>
  )
}

function Section({
  id,
  children,
  className = '',
  style,
}: {
  id?: string
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <section id={id} className={`hb-sec px-5 sm:px-8 ${className}`} style={style}>
      <div className="mx-auto w-full max-w-[1240px]">{children}</div>
    </section>
  )
}

function PriceTag({ car, size = 'md' }: { car: Car; size?: 'md' | 'lg' }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div
        className={size === 'lg' ? 'text-[30px] sm:text-[38px]' : 'text-[22px] sm:text-[25px]'}
        style={{ fontFamily: DISPLAY, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }}
      >
        {isk(car.price)}
        <span className="text-[0.62em] font-normal"> kr.</span>
      </div>
      {car.exVsk && (
        <span className="text-[12px]" style={{ fontFamily: MONO, color: CHROME }}>
          án vsk. · með vsk. {isk(car.vskPrice ?? 0)} kr.
        </span>
      )}
      {car.was && (
        <span className="text-[12px]" style={{ fontFamily: MONO, color: CHROME }}>
          Verð áður <s>{isk(car.was)} kr.</s>
        </span>
      )}
    </div>
  )
}

function CarCard({ car, eager = false }: { car: Car; eager?: boolean }) {
  return (
    <article
      className="hb-card group flex h-full flex-col overflow-hidden"
      style={{ background: '#FFFFFF', border: `1px solid ${HAIR}` }}
    >
      <div className="hb-shot relative overflow-hidden" style={{ background: PAPER_2 }}>
        <img
          src={asset(car.img)}
          alt={car.alt}
          width={1000}
          height={800}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          {...(eager ? eagerHero : {})}
          className="hb-shot-img block w-full"
          style={{ aspectRatio: '5 / 4', height: 'auto', objectFit: 'cover' }}
        />
        {car.isNew && (
          <span
            className="absolute left-0 top-0 px-2.5 py-1 text-[12px] uppercase"
            style={{ fontFamily: MONO, letterSpacing: '0.14em', background: CYAN, color: INK }}
          >
            Nýtt
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div>
          <Label style={{ color: CHROME }} className="mb-1">
            <span style={{ color: CHROME }}>{car.make}</span>
          </Label>
          <h3
            className="text-[17px] sm:text-[18px]"
            style={{ fontFamily: DISPLAY, fontWeight: 600, lineHeight: 1.22, color: INK }}
          >
            {car.model}
          </h3>
        </div>

        <PriceTag car={car} />

        <dl
          className="mt-auto grid grid-cols-2 gap-x-3 gap-y-1.5 border-t pt-3 text-[13px]"
          style={{ borderColor: HAIR, fontFamily: MONO, color: CHROME }}
        >
          <div className="flex flex-col">
            <dt className="text-[12px] uppercase" style={{ letterSpacing: '0.12em' }}>
              Nýskráður
            </dt>
            <dd style={{ color: INK }}>{car.reg}</dd>
          </div>
          <div className="flex flex-col">
            <dt className="text-[12px] uppercase" style={{ letterSpacing: '0.12em' }}>
              Akstur
            </dt>
            <dd style={{ color: INK }}>{car.km}</dd>
          </div>
          <div className="flex flex-col">
            <dt className="text-[12px] uppercase" style={{ letterSpacing: '0.12em' }}>
              Eldsneyti
            </dt>
            <dd style={{ color: INK }}>{car.fuel}</dd>
          </div>
          <div className="flex flex-col">
            <dt className="text-[12px] uppercase" style={{ letterSpacing: '0.12em' }}>
              Skipting
            </dt>
            <dd style={{ color: INK }}>{car.gear}</dd>
          </div>
        </dl>

        {car.badge && (
          <p
            className="text-[12.5px]"
            style={{ fontFamily: MONO, color: CYAN_INK, lineHeight: 1.4 }}
          >
            {car.badge}
          </p>
        )}
      </div>
    </article>
  )
}

/* ── THE SCALE — the signature ────────────────────────────────────────────
   A single budget control. Drag it and the lot resolves: every one of the 26
   cars is a tick on a logarithmic axis, ticks inside budget fill with the
   logo cyan, and the best car you can actually drive away in is featured.
   User-driven, so it needs no scroll plumbing and works under reduced
   motion and on a keyboard for free.                                     ── */
function Scale() {
  const [slider, setSlider] = useState(() => Math.round(toSlider(4500000)))
  const budget = useMemo(() => fromSlider(slider), [slider])

  const inBudget = useMemo(() => CARS.filter((c) => withinBudget(c.price, budget)), [budget])
  const best = useMemo(
    () => inBudget.slice().sort((a, b) => b.price - a.price)[0] ?? CHEAPEST,
    [inBudget],
  )

  return (
    <Section id="skalinn" style={{ background: SLATE, color: PAPER }}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
        <div>
          <Label className="mb-4" style={{ color: CYAN_LIFT }}>
            <span style={{ color: CYAN_LIFT }}>Verðskalinn</span>
          </Label>
          <h2
            className="hb-h2 mb-5"
            style={{ fontFamily: DISPLAY, fontWeight: 700, color: PAPER }}
          >
            Hvað ertu að hugsa um að borga?
          </h2>
          <p
            className="mb-8 max-w-[46ch] text-[16px] sm:text-[17px]"
            style={{ fontFamily: BODY, lineHeight: 1.65, color: '#D6DDE0' }}
          >
            Dragðu til og planið raðar sér eftir buddunni. Allir {CARS.length} bílarnir hér að neðan
            standa við Fossháls 27 núna, og skalinn nær frá {isk(MIN_PRICE)} kr. upp í{' '}
            {isk(MAX_PRICE)} kr.
          </p>

          {/* The axis — every car on the lot is a real tick on it. */}
          <div className="mb-4">
            <div className="hb-axis relative" style={{ height: 150 }}>
              {/* ticks: every real car on the lot */}
              <div className="absolute inset-x-0" style={{ top: 0, height: 96 }}>
                {CARS.map((c) => {
                  const on = withinBudget(c.price, budget)
                  return (
                    <span
                      key={c.id}
                      aria-hidden
                      className="hb-tick absolute bottom-0 block"
                      style={{
                        left: `${toPct(c.price)}%`,
                        width: on ? 3 : 2,
                        height: on ? 96 : 30,
                        marginLeft: on ? -1.5 : -1,
                        background: on ? CYAN : 'rgba(244,245,246,0.3)',
                      }}
                    />
                  )
                })}
              </div>

              <input
                type="range"
                min={0}
                max={1000}
                step={1}
                value={slider}
                onChange={(e) => setSlider(Number(e.target.value))}
                className="hb-range absolute inset-x-0"
                style={{ top: 74 }}
                aria-label="Hámarksverð"
                aria-valuetext={`${isk(Math.round(budget))} krónur`}
              />

              <div
                className="absolute inset-x-0 flex justify-between text-[12px]"
                style={{ top: 122, fontFamily: MONO, color: '#B9C4C8' }}
              >
                <span>{iskShort(MIN_PRICE)}</span>
                <span aria-hidden className="hidden sm:inline">
                  Hvert strik er einn bíll á planinu
                </span>
                <span>{iskShort(MAX_PRICE)}</span>
              </div>
            </div>
          </div>

          <div
            className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t pt-5"
            style={{ borderColor: 'rgba(244,245,246,0.2)' }}
          >
            <span
              className="text-[34px] sm:text-[42px]"
              style={{
                fontFamily: DISPLAY,
                fontWeight: 700,
                color: PAPER,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              {isk(Math.round(budget / 10000) * 10000)}
              <span className="text-[0.6em] font-normal"> kr.</span>
            </span>
            <span className="text-[14px]" style={{ fontFamily: MONO, color: CYAN_LIFT }}>
              {inBudget.length} {inBudget.length === 1 ? 'ökutæki' : 'ökutæki'} á þessu verði eða
              undir
            </span>
          </div>
        </div>

        {/* The best car you can actually drive away in */}
        <div>
          <div
            className="hb-best overflow-hidden"
            style={{ background: '#FFFFFF', color: INK, border: `1px solid rgba(244,245,246,0.18)` }}
          >
            <div className="relative">
              <img
                key={best.id}
                src={asset(best.img)}
                alt={best.alt}
                width={1000}
                height={800}
                loading="lazy"
                decoding="async"
                className="hb-best-img block w-full"
                style={{ aspectRatio: '5 / 4', height: 'auto', objectFit: 'cover' }}
              />
              <span
                className="absolute left-0 top-0 px-3 py-1.5 text-[12px] uppercase"
                style={{ fontFamily: MONO, letterSpacing: '0.14em', background: CYAN, color: INK }}
              >
                Besti bíllinn á þessu verði
              </span>
            </div>
            <div className="p-5 sm:p-6">
              <Label className="mb-1.5">
                <span style={{ color: CHROME }}>{best.make}</span>
              </Label>
              <h3
                className="mb-3 text-[20px] sm:text-[23px]"
                style={{ fontFamily: DISPLAY, fontWeight: 700, lineHeight: 1.2 }}
              >
                {best.model}
              </h3>
              <PriceTag car={best} size="lg" />
              <p className="mt-3 text-[13.5px]" style={{ fontFamily: MONO, color: CHROME }}>
                {best.reg} · {best.km} · {best.fuel} · {best.gear}
              </p>
              <a
                href={PHONE_HREF}
                className="hb-btn mt-5 inline-flex w-full items-center justify-center gap-2 px-5 py-3.5 text-[15px]"
                style={{ background: INK, color: PAPER, fontFamily: BODY, fontWeight: 600 }}
              >
                <Phone size={17} aria-hidden />
                Spyrja um þennan bíl
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function HofdabilarPage() {
  const [menu, setMenu] = useState(false)
  const [fuel, setFuel] = useState<string>('Allt')
  const menuBtn = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    document.title = SEO.title
    setThemeColor(PAPER)
    const meta = document.querySelector('meta[name="description"]')
    const prev = meta?.getAttribute('content') ?? null
    meta?.setAttribute('content', SEO.description)
    const html = document.documentElement
    const prevLang = html.lang
    html.lang = 'is'
    return () => {
      if (prev !== null) meta?.setAttribute('content', prev)
      html.lang = prevLang
    }
  }, [])

  /* Body scroll lock while the mobile menu is open. */
  useEffect(() => {
    if (!menu) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenu(false)
        menuBtn.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [menu])

  const shown = useMemo(
    () => (fuel === 'Allt' ? CARS : CARS.filter((c) => c.fuel === fuel)),
    [fuel],
  )

  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'AutoDealer',
      name: LEGAL,
      url: 'https://hofdabilar.is',
      telephone: '+354 577 4747',
      email: EMAIL,
      foundingDate: String(FOUNDED),
      address: {
        '@type': 'PostalAddress',
        streetAddress: ADDRESS.street,
        addressLocality: 'Reykjavík',
        postalCode: '110',
        addressCountry: 'IS',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '10:00',
          closes: '17:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday'],
          opens: '12:00',
          closes: '15:00',
        },
      ],
      makesOffer: CARS.slice(0, 8).map((c) => ({
        '@type': 'Offer',
        priceCurrency: 'ISK',
        price: c.price,
        itemOffered: { '@type': 'Car', name: `${c.make} ${c.model}`, vehicleModelDate: c.reg },
      })),
    }),
    [],
  )

  return (
    <div className="hb-root" style={{ background: PAPER, color: INK, fontFamily: BODY }}>
      <PreviewChrome company={company} />

      <style>{`
        .hb-root { --hb-pad: clamp(56px, 8vw, 104px); }
        .hb-root h1, .hb-root h2, .hb-root h3 { text-wrap: balance; }
        .hb-sec { padding-top: var(--hb-pad); padding-bottom: var(--hb-pad); }
        /* Must out-specify .hb-sec itself — a bare pb-0 loses the cascade
           at equal specificity (craft ledger #58). */
        .hb-sec.hb-tight-b { padding-bottom: clamp(26px, 3vw, 40px); }
        .hb-sec.hb-tight-t { padding-top: clamp(26px, 3vw, 40px); }
        .hb-h1 {
          font-size: clamp(46px, 11vw, 132px);
          line-height: 1.02;
          letter-spacing: -0.035em;
        }
        /* Icelandic acutes need room on multi-line display settings. */
        .hb-h2 {
          font-size: clamp(28px, 4.4vw, 46px);
          line-height: 1.18;
          letter-spacing: -0.02em;
        }
        .hb-h3 { font-size: clamp(20px, 2.4vw, 26px); line-height: 1.24; letter-spacing: -0.015em; }

        @keyframes hbChequerRun { from { transform: translate3d(0,0,0); } to { transform: translate3d(-50%,0,0); } }
        .hb-chequer-run { animation: hbChequerRun 14s linear infinite; will-change: transform; }

        .hb-card { transition: transform .32s cubic-bezier(.22,.68,.32,1), box-shadow .32s ease, border-color .32s ease; }
        .hb-card:hover, .hb-card:focus-within { transform: translateY(-3px); border-color: ${CYAN}; box-shadow: 0 10px 30px rgba(23,25,27,.10); }
        .hb-shot-img { transition: transform .5s cubic-bezier(.22,.68,.32,1); }
        .hb-card:hover .hb-shot-img { transform: scale(1.035); }

        .hb-btn { transition: background .22s ease, color .22s ease, transform .22s ease; }
        .hb-btn:hover { transform: translateY(-2px); }

        .hb-chip { transition: background .2s ease, color .2s ease, border-color .2s ease; }

        .hb-tick { transition: height .28s cubic-bezier(.22,.68,.32,1), background .28s ease; }

        /* The scale control */
        .hb-range { -webkit-appearance: none; appearance: none; width: 100%; background: transparent; height: 44px; cursor: grab; }
        .hb-range:active { cursor: grabbing; }
        .hb-range::-webkit-slider-runnable-track { height: 2px; background: rgba(244,245,246,0.34); }
        .hb-range::-moz-range-track { height: 2px; background: rgba(244,245,246,0.34); }
        .hb-range::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 26px; height: 26px; margin-top: -12px;
          background: ${CYAN}; border: 3px solid ${SLATE}; border-radius: 0;
          box-shadow: 0 0 0 1px ${CYAN};
        }
        .hb-range::-moz-range-thumb {
          width: 26px; height: 26px;
          background: ${CYAN}; border: 3px solid ${SLATE}; border-radius: 0;
          box-shadow: 0 0 0 1px ${CYAN};
        }
        .hb-range:focus-visible { outline: none; }
        .hb-range:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 3px ${PAPER}; }
        .hb-range:focus-visible::-moz-range-thumb { box-shadow: 0 0 0 3px ${PAPER}; }

        .hb-root a:focus-visible, .hb-root button:focus-visible, .hb-root input:focus-visible {
          outline: 3px solid ${CYAN_INK}; outline-offset: 3px;
        }
        .hb-onslate a:focus-visible, .hb-onslate button:focus-visible { outline-color: ${CYAN_LIFT}; }

        .hb-menu-link { opacity: 0; transform: translateY(14px); animation: hbMenuIn .42s cubic-bezier(.22,.68,.32,1) forwards; }
        @keyframes hbMenuIn { to { opacity: 1; transform: none; } }

        @media (prefers-reduced-motion: reduce) {
          .hb-chequer-run { animation: none; }
          .hb-menu-link { animation: none; opacity: 1; transform: none; }
          .hb-card, .hb-shot-img, .hb-btn, .hb-tick { transition: none; }
        }
      `}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Header ───────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40"
        style={{ background: 'rgba(244,245,246,0.94)', borderBottom: `1px solid ${HAIR}` }}
      >
        <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <a href="#top" className="flex items-center gap-3 py-1" aria-label={`${NAME}, forsíða`}>
            <img
              src={asset('logo.png')}
              alt=""
              aria-hidden
              width={38}
              height={39}
              className="block"
              style={{ width: 38, height: 'auto' }}
            />
            <span
              className="text-[17px] sm:text-[19px]"
              style={{ fontFamily: DISPLAY, fontWeight: 800, letterSpacing: '-0.01em' }}
            >
              HÖFÐABÍLAR
            </span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Aðalvalmynd">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="inline-flex items-center py-3 text-[14.5px]"
                style={{ fontFamily: BODY, fontWeight: 500, color: INK }}
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={PHONE_HREF}
              className="hb-btn hidden items-center gap-2 px-4 py-2.5 text-[14.5px] sm:inline-flex"
              style={{ background: INK, color: PAPER, fontFamily: BODY, fontWeight: 600 }}
            >
              <Phone size={16} aria-hidden />
              {PHONE_DISPLAY}
            </a>
            <button
              ref={menuBtn}
              type="button"
              onClick={() => setMenu(true)}
              className="inline-flex h-11 w-11 items-center justify-center lg:hidden"
              style={{ border: `1px solid ${HAIR}` }}
              aria-label="Opna valmynd"
              aria-expanded={menu}
            >
              <MenuIcon size={20} aria-hidden />
            </button>
          </div>
        </div>
        <Chequer height={6} square={6} color={INK} />
      </header>

      {/* Mobile menu — sibling of the header so no backdrop-filter containing
          block can collapse it (craft ledger #29). */}
      {menu && (
        <div
          className="fixed inset-0 z-50 flex flex-col lg:hidden"
          style={{ background: PAPER }}
          role="dialog"
          aria-modal="true"
          aria-label="Valmynd"
        >
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ borderBottom: `1px solid ${HAIR}` }}
          >
            <span style={{ fontFamily: DISPLAY, fontWeight: 800 }}>HÖFÐABÍLAR</span>
            <button
              type="button"
              onClick={() => {
                setMenu(false)
                menuBtn.current?.focus()
              }}
              className="inline-flex h-11 w-11 items-center justify-center"
              style={{ border: `1px solid ${HAIR}` }}
              aria-label="Loka valmynd"
              autoFocus
            >
              <X size={20} aria-hidden />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 px-5 py-8" aria-label="Valmynd">
            {NAV.map((n, i) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setMenu(false)}
                className="hb-menu-link py-3 text-[27px]"
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  animationDelay: `${i * 55}ms`,
                }}
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="px-5 pb-8">
            <a
              href={PHONE_HREF}
              className="hb-btn flex items-center justify-center gap-2 px-5 py-4 text-[16px]"
              style={{ background: INK, color: PAPER, fontFamily: BODY, fontWeight: 600 }}
            >
              <Phone size={18} aria-hidden />
              Hringja í {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      )}

      <main id="top">
        {/* ── 1 · Hero ───────────────────────────────────────────────── */}
        <Section className="hb-tight-b">
          <Label className="mb-6" style={{ color: CHROME }}>
            <span style={{ color: CHROME }}>
              Stofnað {FOUNDED} · {ADDRESS.street}, {ADDRESS.town}
            </span>
          </Label>

          <h1
            className="hb-h1 mb-7"
            style={{ fontFamily: DISPLAY, fontWeight: 800, color: INK }}
          >
            Allur skalinn.
          </h1>

          <div className="grid gap-7 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] lg:items-end">
            <p
              className="max-w-[52ch] text-[17px] sm:text-[19px]"
              style={{ fontFamily: BODY, lineHeight: 1.6 }}
            >
              Á planinu okkar við Fossháls stendur fornbíll á {isk(MIN_PRICE)} kr. við hliðina á
              Range Rover á {isk(MAX_PRICE)} kr. Þar á milli eru rafbílar, jeppar, sendibíll og
              fjórhjól. {CARS.length} ökutæki, eitt plan, {SPAN}-faldur verðmunur frá enda til enda.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={PHONE_HREF}
                className="hb-btn inline-flex items-center gap-2 px-6 py-4 text-[16px]"
                style={{ background: INK, color: PAPER, fontFamily: BODY, fontWeight: 600 }}
              >
                <Phone size={18} aria-hidden />
                Hringja í {PHONE_DISPLAY}
              </a>
              <a
                href="#skalinn"
                className="hb-btn inline-flex items-center gap-2 px-6 py-4 text-[16px]"
                style={{
                  background: 'transparent',
                  color: INK,
                  border: `1.5px solid ${INK}`,
                  fontFamily: BODY,
                  fontWeight: 600,
                }}
              >
                Finna bíl á mínu verði
                <ArrowRight size={17} aria-hidden />
              </a>
            </div>
          </div>
        </Section>

        {/* ── 2 · The two ends of the scale, side by side ─────────────── */}
        <Section className="hb-tight-t">
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
            {[CHEAPEST, DEAREST].map((car, i) => (
              <Rise key={car.id} delay={i * 0.08}>
                <figure className="relative overflow-hidden" style={{ background: PAPER_2 }}>
                  <img
                    src={asset(car.img)}
                    alt={car.alt}
                    width={1000}
                    height={800}
                    loading="eager"
                    decoding="async"
                    {...eagerHero}
                    className="block w-full"
                    style={{ aspectRatio: '16 / 11', height: 'auto', objectFit: 'cover' }}
                  />
                  <figcaption
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 p-4 sm:p-5"
                    style={{ background: i === 0 ? INK : CYAN, color: i === 0 ? PAPER : INK }}
                  >
                    <span className="text-[13px]" style={{ fontFamily: MONO }}>
                      {i === 0 ? 'Ódýrasti bíllinn á planinu' : 'Dýrasti bíllinn á planinu'}
                      <span className="block opacity-80">
                        {car.make} {car.model} · {car.reg}
                      </span>
                    </span>
                    <span
                      className="text-[26px] sm:text-[32px]"
                      style={{
                        fontFamily: DISPLAY,
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.1,
                      }}
                    >
                      {isk(car.price)}
                      <span className="text-[0.6em] font-normal"> kr.</span>
                    </span>
                  </figcaption>
                </figure>
              </Rise>
            ))}
          </div>
        </Section>

        {/* ── 3 · THE SCALE (signature) ───────────────────────────────── */}
        <div className="hb-onslate">
          <Chequer height={14} square={14} color={SLATE} />
          <Scale />
          <Chequer height={14} square={14} color={SLATE} />
        </div>

        {/* ── 4 · Á planinu — the full lot ────────────────────────────── */}
        <Section id="lodin">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
            <div>
              <Label className="mb-3" style={{ color: CHROME }}>
                <span style={{ color: CHROME }}>Á planinu núna</span>
              </Label>
              <h2 className="hb-h2" style={{ fontFamily: DISPLAY, fontWeight: 700 }}>
                {CARS.length} ökutæki við Fossháls 27
              </h2>
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Sía eftir eldsneyti">
              {['Allt', 'Rafmagn', 'Bensín/Rafmagn', 'Dísel', 'Bensín'].map((f) => {
                const on = fuel === f
                const n = f === 'Allt' ? CARS.length : CARS.filter((c) => c.fuel === f).length
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFuel(f)}
                    aria-pressed={on}
                    className="hb-chip px-3.5 py-3 text-[13.5px]"
                    style={{
                      fontFamily: MONO,
                      border: `1px solid ${on ? INK : HAIR}`,
                      background: on ? INK : 'transparent',
                      color: on ? PAPER : INK,
                    }}
                  >
                    {f} <span style={{ opacity: 0.6 }}>{n}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((car, i) => (
              <li key={car.id}>
                <Rise delay={Math.min(i, 5) * 0.04}>
                  <CarCard car={car} />
                </Rise>
              </li>
            ))}
          </ul>

          <p className="mt-7 text-[14px]" style={{ fontFamily: MONO, color: CHROME }}>
            Verð og upplýsingar eins og þær stóðu á söluskrá Höfðabíla 31. júlí 2026.
          </p>
        </Section>

        {/* ── 5 · Chequer band — the typographic peak ─────────────────── */}
        <div style={{ background: INK, color: PAPER }} className="hb-onslate">
          <Chequer height={22} square={22} color={INK} />
          <Section className="py-0" style={{ paddingTop: 'clamp(48px,7vw,88px)', paddingBottom: 'clamp(48px,7vw,88px)' }}>
            <Rise>
              <p
                className="max-w-[16ch] text-[clamp(38px,8vw,92px)]"
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 800,
                  lineHeight: 1.08,
                  letterSpacing: '-0.03em',
                }}
              >
                Leitin endar hér.
              </p>
              <p
                className="mt-6 max-w-[54ch] text-[16px] sm:text-[18px]"
                style={{ fontFamily: BODY, lineHeight: 1.6, color: '#C9CFD2' }}
              >
                Köflótti fáninn hefur verið í merkinu okkar síðan {FOUNDED}. Hann snýst ekki um hraða
                heldur um að vera kominn á leiðarenda. Þú kemur við á planinu, við finnum bílinn og
                reiknum greiðslubyrðina með þér áður en nokkuð er skrifað undir.
              </p>
            </Rise>
          </Section>
          <Chequer height={22} square={22} color={INK} />
        </div>

        {/* ── 6 · Um okkur + fólkið ──────────────────────────────────── */}
        <Section id="okkur">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <Rise>
              <Label className="mb-3" style={{ color: CHROME }}>
                <span style={{ color: CHROME }}>Um Höfðabíla</span>
              </Label>
              <h2 className="hb-h2 mb-5" style={{ fontFamily: DISPLAY, fontWeight: 700 }}>
                Sama planið síðan {FOUNDED}
              </h2>
              <p className="mb-4 text-[16px] sm:text-[17px]" style={{ lineHeight: 1.65 }}>
                Höfðabílar standa við Fossháls 27, Dragháls megin. Merkið okkar hefur borið ártalið{' '}
                {FOUNDED} frá upphafi. Hér er löggiltur bifreiðasali á staðnum og tveir söluráðgjafar
                sem þú nærð beint í, ekki í gegnum þjónustuver.
              </p>
              <p className="mb-6 text-[16px] sm:text-[17px]" style={{ lineHeight: 1.65 }}>
                Við tökum inn allt frá fornbílum upp í nýja jeppa. Þess vegna er úrvalið hjá okkur
                svona breitt, og þess vegna borgar sig að kíkja við jafnvel þótt þú vitir ekki
                nákvæmlega hvað þú ert að leita að.
              </p>
              <p className="text-[13.5px]" style={{ fontFamily: MONO, color: CHROME }}>
                {LICENCE}
                <br />
                {LEGAL} · kt. {KT}
              </p>
            </Rise>

            <Rise delay={0.08}>
              <ul className="list-none space-y-0 p-0" style={{ borderTop: `1px solid ${HAIR}` }}>
                {TEAM.map((p) => (
                  <li
                    key={p.email}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5"
                    style={{ borderBottom: `1px solid ${HAIR}` }}
                  >
                    <div>
                      <p className="hb-h3" style={{ fontFamily: DISPLAY, fontWeight: 600 }}>
                        {p.name}
                      </p>
                      <p className="text-[13.5px]" style={{ fontFamily: MONO, color: CHROME }}>
                        {p.role}
                      </p>
                    </div>
                    <a
                      href={`mailto:${p.email}`}
                      className="inline-flex items-center gap-2 py-3 text-[14.5px] underline underline-offset-4"
                      style={{ color: CYAN_INK, fontFamily: BODY }}
                    >
                      <Mail size={15} aria-hidden />
                      {p.email}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href={PHONE_HREF}
                className="hb-btn mt-7 inline-flex items-center gap-2 px-6 py-4 text-[16px]"
                style={{ background: INK, color: PAPER, fontFamily: BODY, fontWeight: 600 }}
              >
                <Phone size={18} aria-hidden />
                Hringja í {PHONE_DISPLAY}
              </a>
            </Rise>
          </div>
        </Section>

        {/* ── 7 · Verðskrá — surfaced from a buried subpage ───────────── */}
        <Section id="verdskra" style={{ background: PAPER_2 }}>
          <Rise>
            <Label className="mb-3" style={{ color: CHROME }}>
              <span style={{ color: CHROME }}>Verðskrá</span>
            </Label>
            <h2 className="hb-h2 mb-4" style={{ fontFamily: DISPLAY, fontWeight: 700 }}>
              Sölulaunin okkar, uppgefin fyrir fram
            </h2>
            <p className="mb-9 max-w-[58ch] text-[16px] sm:text-[17px]" style={{ lineHeight: 1.65 }}>
              Þú átt að vita hvað það kostar að selja bílinn hjá okkur áður en þú keyrir í hlað. Hér
              er verðskráin okkar í heild sinni.
            </p>
          </Rise>

          <Rise delay={0.06}>
            <div className="grid gap-4 md:grid-cols-3">
              {SOLULAUN.map((s) => (
                <div
                  key={s.band}
                  className="flex flex-col gap-3 p-6"
                  style={{ background: '#FFFFFF', border: `1px solid ${HAIR}` }}
                >
                  <span className="text-[13.5px]" style={{ fontFamily: MONO, color: CHROME }}>
                    {s.band}
                  </span>
                  <span
                    className="mt-auto text-[26px] sm:text-[30px]"
                    style={{
                      fontFamily: DISPLAY,
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.15,
                    }}
                  >
                    {s.fee}
                  </span>
                </div>
              ))}
            </div>

            <dl
              className="mt-4 grid gap-4 sm:grid-cols-2"
              style={{ fontFamily: MONO }}
            >
              {FEES.map((f) => (
                <div
                  key={f.label}
                  className="flex items-baseline justify-between gap-4 p-5"
                  style={{ background: '#FFFFFF', border: `1px solid ${HAIR}` }}
                >
                  <dt className="text-[14px]" style={{ color: CHROME }}>
                    {f.label}
                  </dt>
                  <dd className="text-[17px]" style={{ color: INK }}>
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Rise>
        </Section>

        {/* ── 8 · Fjármögnun ─────────────────────────────────────────── */}
        <Section>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <Rise>
              <Label className="mb-3" style={{ color: CHROME }}>
                <span style={{ color: CHROME }}>Fjármögnun</span>
              </Label>
              <h2 className="hb-h2 mb-5" style={{ fontFamily: DISPLAY, fontWeight: 700 }}>
                {FINANCING.headline}
              </h2>
              <p className="text-[16px] sm:text-[17px]" style={{ lineHeight: 1.65 }}>
                {FINANCING.body}
              </p>
            </Rise>
            <Rise delay={0.08}>
              <ul className="list-none space-y-0 p-0" style={{ borderTop: `1px solid ${HAIR}` }}>
                {FINANCING.points.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-4 py-5 text-[16px]"
                    style={{ borderBottom: `1px solid ${HAIR}`, lineHeight: 1.5 }}
                  >
                    <span
                      className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center"
                      style={{ background: CYAN, color: INK }}
                      aria-hidden
                    >
                      <Check size={14} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </Rise>
          </div>
        </Section>

        {/* ── 9 · Skráðu bílinn þinn ─────────────────────────────────── */}
        <Section style={{ background: SLATE, color: PAPER }} className="hb-onslate">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)] lg:items-center">
            <Rise>
              <Label className="mb-3" style={{ color: CYAN_LIFT }}>
                <span style={{ color: CYAN_LIFT }}>Skráðu bílinn þinn</span>
              </Label>
              <h2 className="hb-h2 mb-5" style={{ fontFamily: DISPLAY, fontWeight: 700, color: PAPER }}>
                Ertu með bíl sem á að fara á planið?
              </h2>
              <p
                className="max-w-[52ch] text-[16px] sm:text-[17px]"
                style={{ lineHeight: 1.65, color: '#D6DDE0' }}
              >
                Við tökum bíla í sölu á öllu verðbilinu, hvort sem bíllinn þinn er á 500 þúsund eða
                20 milljónir. Hringdu eða sendu okkur línu og við segjum þér hvað við teljum
                raunhæft að fá fyrir hann.
              </p>
            </Rise>
            <Rise delay={0.08} className="flex flex-wrap gap-3">
              <a
                href={PHONE_HREF}
                className="hb-btn inline-flex items-center gap-2 px-6 py-4 text-[16px]"
                style={{ background: CYAN, color: INK, fontFamily: BODY, fontWeight: 600 }}
              >
                <Phone size={18} aria-hidden />
                {PHONE_DISPLAY}
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="hb-btn inline-flex items-center gap-2 px-6 py-4 text-[16px]"
                style={{
                  background: 'transparent',
                  color: PAPER,
                  border: `1.5px solid rgba(244,245,246,.5)`,
                  fontFamily: BODY,
                  fontWeight: 600,
                }}
              >
                <Mail size={17} aria-hidden />
                Senda póst
              </a>
            </Rise>
          </div>
        </Section>

        {/* ── 10 · Staðsetning + opnunartími ─────────────────────────── */}
        <Section id="stadsetning">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] lg:gap-14">
            <Rise>
              <Label className="mb-3" style={{ color: CHROME }}>
                <span style={{ color: CHROME }}>Staðsetning og opnunartími</span>
              </Label>
              <h2 className="hb-h2 mb-6" style={{ fontFamily: DISPLAY, fontWeight: 700 }}>
                Fossháls 27, Dragháls megin
              </h2>

              <a
                href={MAPS}
                target="_blank"
                rel="noreferrer"
                className="mb-7 inline-flex items-start gap-3 text-[17px] underline underline-offset-4"
                style={{ color: CYAN_INK }}
              >
                <MapPin size={19} aria-hidden className="mt-1 shrink-0" />
                <span>
                  {ADDRESS.street}
                  <br />
                  {ADDRESS.town}
                </span>
              </a>

              <dl className="list-none p-0" style={{ borderTop: `1px solid ${HAIR}` }}>
                {HOURS.map((h) => (
                  <div
                    key={h.days}
                    className="flex items-baseline justify-between gap-6 py-3.5"
                    style={{ borderBottom: `1px solid ${HAIR}` }}
                  >
                    <dt className="text-[15px]">{h.days}</dt>
                    <dd className="text-[15px]" style={{ fontFamily: MONO }}>
                      {h.time}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-[13.5px]" style={{ fontFamily: MONO, color: CHROME }}>
                {HOURS_NOTE}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={PHONE_HREF}
                  className="hb-btn inline-flex items-center gap-2 px-5 py-3.5 text-[15px]"
                  style={{ background: INK, color: PAPER, fontFamily: BODY, fontWeight: 600 }}
                >
                  <Phone size={17} aria-hidden />
                  {PHONE_DISPLAY}
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="hb-btn inline-flex items-center gap-2 px-5 py-3.5 text-[15px]"
                  style={{
                    background: 'transparent',
                    color: INK,
                    border: `1.5px solid ${INK}`,
                    fontFamily: BODY,
                    fontWeight: 600,
                  }}
                >
                  <Mail size={16} aria-hidden />
                  {EMAIL}
                </a>
              </div>
            </Rise>

            <Rise delay={0.08}>
              {/* No loading="lazy": on a scroll-heavy page the native lazy
                  scheduler can stall a map iframe for many seconds
                  (craft ledger #30). */}
              <iframe
                src={MAPS_EMBED}
                title="Kort af Fossháls 27, Reykjavík"
                className="block w-full"
                style={{ aspectRatio: '4 / 3', height: 'auto', border: `1px solid ${HAIR}` }}
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Rise>
          </div>
        </Section>

        {/* ── 11 · Final CTA ─────────────────────────────────────────── */}
        <div style={{ background: INK, color: PAPER }} className="hb-onslate">
          <Chequer height={18} square={18} color={INK} />
          <Section style={{ paddingTop: 'clamp(52px,7vw,92px)', paddingBottom: 'clamp(52px,7vw,92px)' }}>
            <Rise>
              <h2
                className="mb-6 max-w-[18ch] text-[clamp(32px,6vw,66px)]"
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 800,
                  lineHeight: 1.12,
                  letterSpacing: '-0.03em',
                }}
              >
                Komdu við á planinu.
              </h2>
              <p
                className="mb-8 max-w-[50ch] text-[16px] sm:text-[18px]"
                style={{ lineHeight: 1.6, color: '#C9CFD2' }}
              >
                Það kostar ekkert að kíkja. Við erum við Fossháls 27, Dragháls megin, alla virka daga
                frá 10 til 17.
              </p>
              <a
                href={PHONE_HREF}
                className="hb-btn inline-flex items-center gap-3 px-7 py-5 text-[clamp(20px,3.4vw,30px)]"
                style={{
                  background: CYAN,
                  color: INK,
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                }}
              >
                <Phone size={24} aria-hidden />
                {PHONE_DISPLAY}
              </a>
            </Rise>
          </Section>
          <Chequer height={18} square={18} color={INK} />
        </div>
      </main>

      {/* Mobile sticky CTA */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 flex gap-2 p-3 sm:hidden"
        style={{ background: 'rgba(244,245,246,0.96)', borderTop: `1px solid ${HAIR}` }}
      >
        <a
          href={PHONE_HREF}
          className="flex flex-1 items-center justify-center gap-2 py-3.5 text-[15.5px]"
          style={{ background: INK, color: PAPER, fontFamily: BODY, fontWeight: 600 }}
        >
          <Phone size={17} aria-hidden />
          Hringja í {PHONE_DISPLAY}
        </a>
        <a
          href="#skalinn"
          className="flex items-center justify-center px-4 py-3.5 text-[15.5px]"
          style={{ border: `1.5px solid ${INK}`, color: INK, fontFamily: BODY, fontWeight: 600 }}
        >
          Verðskali
        </a>
      </div>

      <PreviewFooter company={company} />
    </div>
  )
}
