import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  ADDRESS,
  CARDS,
  EMAIL,
  EXTRAS,
  EXTRA_PRICES,
  FACEBOOK,
  FACTS,
  HOURS,
  IMG,
  MAPS,
  NOONA,
  PHONE_DISPLAY,
  PHONE_HREF,
  SAFETY,
  SERVICES,
  SINGLES,
  SKIN_TYPES,
  STORY,
} from './data'

const company = getPreviewCompany('arsol')

/* ── Ársól — "year-sun". A silkscreen sólarplakat like Sælan's, but its own
      dusk-to-UV run: warm sand paper, a setting-sun in tangerine and coral,
      and one deep-plum plate (the extras) that nods to the beds' UV glow. ── */
const PAGE = '#F6E7D3' // warm sand paper, the page ground
const PAPER = '#FCF3E4' // lighter paper: cards, tickets, photo mounts
const INK = '#2B1726' // deep aubergine-plum, text and rules
const SUN = '#E88A2E' // warm tangerine — decorative fills + INK-on-SUN stamps
const SIGNAL = '#D2402A' // coral signal — display type 24px+ only
const SIGNAL_DEEP = '#AE2E1B' // deeper coral — CTA fills (white text) + small accent text
const PLATE = '#241026' // the single dark plate (extras chapter)
const PLATE_INK = '#F3E0CE' // ink on the dark plate

const BASE = import.meta.env.BASE_URL
const POSTER = "'Tanker-Regular', 'Bebas Neue', sans-serif"
const SANS = "'CabinetGrotesk-Regular', system-ui, sans-serif"
const SANS_MED = "'CabinetGrotesk-Medium', system-ui, sans-serif"
const SANS_BOLD = "'CabinetGrotesk-Bold', system-ui, sans-serif"
const MONO = "'Space Mono', monospace"

const isk = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

/* ── IO reveal — a soft rise; failsafe timer means nothing stays hidden ── */
function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
    )
    io.observe(el)
    const t = window.setTimeout(() => {
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight && r.bottom > 0) setOn(true)
    }, 1500)
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [])
  return (
    <div ref={ref} data-in={on} className={`ar-reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* ── Stamp — flat print block with a hard offset shadow ─────────────────── */
function Stamp({
  href,
  children,
  variant = 'sun',
  onPlate = false,
}: {
  href: string
  children: ReactNode
  variant?: 'sun' | 'coral'
  onPlate?: boolean
}) {
  const edge = onPlate ? PLATE_INK : INK
  const coral = variant === 'coral'
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="ar-stamp inline-flex items-center px-7 py-4 text-base tracking-[0.06em] uppercase"
      style={{
        background: coral ? SIGNAL_DEEP : SUN,
        color: coral ? PAPER : INK,
        border: `2px solid ${edge}`,
        boxShadow: `5px 5px 0 ${edge}`,
        fontFamily: SANS_BOLD,
      }}
    >
      {children}
    </a>
  )
}

/* ── Poster image — taped print with a hard shadow. Falls back to a warm
      sunset gradient frame until the Higgsfield shot lands in public/arsol/. ── */
function Poster({
  src,
  alt,
  ratio = '4 / 3',
  className = '',
  shadow = 6,
  onPlate = false,
}: {
  src: string
  alt: string
  ratio?: string
  className?: string
  shadow?: number
  onPlate?: boolean
}) {
  const [failed, setFailed] = useState(false)
  const edge = onPlate ? PLATE_INK : INK
  return (
    <figure className={`relative ${className}`}>
      <div className="border-2 p-2 pb-3" style={{ background: onPlate ? '#160A18' : PAPER, borderColor: edge, boxShadow: `${shadow}px ${shadow}px 0 ${edge}` }}>
        {failed ? (
          <div
            className="grid w-full place-items-center"
            style={{
              aspectRatio: ratio,
              background: `radial-gradient(120% 120% at 70% 15%, ${SUN} 0%, ${SIGNAL} 42%, ${PLATE} 100%)`,
            }}
          >
            <span className="px-4 text-center text-[11px] tracking-[0.14em] uppercase" style={{ fontFamily: MONO, color: '#FCF3E4', opacity: 0.9 }}>
              Mynd væntanleg
            </span>
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            onError={() => setFailed(true)}
            className="block w-full object-cover"
            style={{ aspectRatio: ratio }}
          />
        )}
      </div>
    </figure>
  )
}

/* ── Dotted-leader price line, straight off a printed menu ─────────────── */
function MenuRow({ label, sub, price, onPlate = false }: { label: string; sub?: string; price: string; onPlate?: boolean }) {
  const ink = onPlate ? PLATE_INK : INK
  return (
    <div className="flex items-baseline gap-3 py-3">
      <span className="shrink-0 text-lg md:text-xl" style={{ fontFamily: SANS_MED, color: ink }}>
        {label}
        {sub ? (
          <span className="ml-2 text-sm" style={{ fontFamily: MONO, opacity: 0.7 }}>
            {sub}
          </span>
        ) : null}
      </span>
      <span aria-hidden="true" className="min-w-6 flex-1 border-b-2 border-dotted" style={{ borderColor: `${ink}66`, transform: 'translateY(-4px)' }} />
      <span className="shrink-0 text-2xl whitespace-nowrap uppercase md:text-3xl" style={{ fontFamily: POSTER, color: ink }}>
        {price}
      </span>
    </div>
  )
}

/* ── Setting-sun — pure CSS/SVG poster mark, works with zero imagery ─────── */
function SettingSun({ heat = 0.62, className = '', idle = true }: { heat?: number; className?: string; idle?: boolean }) {
  // heat 0→1 warms and widens the glow; rays lengthen a touch
  const rays = 12
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="ar-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={SUN} />
          <stop offset={`${52 + heat * 12}%`} stopColor={SIGNAL} />
          <stop offset="100%" stopColor={SIGNAL_DEEP} />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r={38 + heat * 8} fill="url(#ar-sun)" className={idle ? 'ar-sun-breathe' : ''} style={{ transformOrigin: '100px 100px' }} />
      <g stroke={SIGNAL} strokeWidth="4" strokeLinecap="round" opacity={0.85}>
        {Array.from({ length: rays }, (_, i) => {
          const a = (i / rays) * Math.PI * 2
          const r0 = 54 + heat * 6
          const r1 = r0 + 14 + heat * 12
          return (
            <line
              key={i}
              x1={100 + Math.cos(a) * r0}
              y1={100 + Math.sin(a) * r0}
              x2={100 + Math.cos(a) * r1}
              y2={100 + Math.sin(a) * r1}
            />
          )
        })}
      </g>
    </svg>
  )
}

/* ── SIGNATURE — skin-type sun-dial. Pick a húðgerð, the sun warms and the
      recommended minutes stamp in. Educational, honest, on-brand. ────────── */
function SkinDial() {
  const [pick, setPick] = useState(2) // default: fair-ish
  const active = SKIN_TYPES.find((s) => s.id === pick) ?? SKIN_TYPES[1]
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      {/* the dial */}
      <div className="relative mx-auto w-full max-w-sm">
        <div
          className="relative grid aspect-square place-items-center border-2"
          style={{ background: PAPER, borderColor: INK, boxShadow: `8px 8px 0 ${INK}` }}
        >
          <SettingSun heat={active.heat} idle className="h-[86%] w-[86%] ar-dial-sun" />
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="w-[46%] text-center">
              <span className="block text-[10px] tracking-[0.18em] uppercase" style={{ fontFamily: MONO, color: PAPER }}>
                Ráðlagt
              </span>
              <span aria-live="polite" className="mt-0.5 block text-4xl leading-none uppercase md:text-5xl" style={{ fontFamily: POSTER, color: PAPER }}>
                {active.short}
              </span>
              <span className="mt-0.5 block text-xs tracking-[0.16em] uppercase" style={{ fontFamily: MONO, color: PAPER }}>
                mínútur
              </span>
            </div>
          </div>
          <span className="sr-only" aria-live="polite">
            Ráðlagður tími: {active.minutes}
          </span>
        </div>
      </div>

      {/* the picker */}
      <div>
        <div role="radiogroup" aria-label="Veldu húðgerð" className="grid gap-3 sm:grid-cols-2">
          {SKIN_TYPES.map((s) => {
            const on = s.id === pick
            return (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setPick(s.id)}
                className="ar-skin flex flex-col items-start px-4 py-3 text-left"
                style={{
                  background: on ? INK : PAPER,
                  color: on ? PAPER : INK,
                  border: `2px solid ${INK}`,
                  boxShadow: on ? `2px 2px 0 ${SIGNAL_DEEP}` : `4px 4px 0 ${INK}`,
                }}
              >
                <span className="flex items-center gap-2 text-xs tracking-[0.1em] uppercase" style={{ fontFamily: MONO, color: on ? SUN : SIGNAL_DEEP }}>
                  <span className="inline-block h-3 w-3 rounded-full" style={{ background: `hsl(${28 - s.id * 3} 70% ${64 - s.heat * 26}%)`, border: `1px solid ${on ? PAPER : INK}` }} />
                  Húðgerð {s.id}
                </span>
                <span className="mt-1 text-base leading-tight" style={{ fontFamily: SANS_BOLD }}>
                  {s.skin}
                </span>
                <span className="text-sm" style={{ fontFamily: SANS, opacity: 0.75 }}>
                  {s.hair}
                </span>
              </button>
            )
          })}
        </div>
        <p className="mt-6 max-w-md text-lg leading-relaxed" style={{ fontFamily: SANS_MED }}>
          {active.note}
        </p>
        <p className="mt-4 max-w-md text-sm leading-relaxed" style={{ opacity: 0.8 }}>
          {SAFETY.join('. ')}. Ráðlagður tími er viðmið, húðin þín ræður alltaf ferðinni.
        </p>
      </div>
    </div>
  )
}

export default function ArsolPage() {
  useEffect(() => {
    setThemeColor(PAGE)
  }, [])

  const jsonLd = useMemo(
    () =>
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TanningSalon',
        name: 'Sólbaðsstofan Ársól',
        url: 'https://noona.app/arsol',
        telephone: '+354 835 1717',
        email: EMAIL,
        image: company.thumb,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Hrísholt 17',
          addressLocality: 'Selfoss',
          postalCode: '800',
          addressCountry: 'IS',
        },
        geo: { '@type': 'GeoCoordinates', latitude: 63.936779, longitude: -20.981588 },
        openingHours: 'Mo-Su 11:00-22:00',
        priceRange: '2000-32000 ISK',
      }),
    [],
  )

  const bed = SERVICES[0]

  return (
    <div className="ar-root min-h-screen overflow-x-hidden pb-[4.5rem] antialiased md:pb-0" style={{ background: PAGE, color: INK, fontFamily: SANS }}>
      <link rel="stylesheet" href={`${BASE}fonts/tanker/css/tanker.css`} />
      <link rel="stylesheet" href={`${BASE}fonts/cabinet-grotesk/css/cabinet-grotesk.css`} />
      <script type="application/ld+json">{jsonLd}</script>

      <style>{`
        .ar-reveal{opacity:0;transform:translateY(14px) scale(.995);transition:opacity .5s ease,transform .5s cubic-bezier(0.22,1,0.36,1)}
        .ar-reveal[data-in="true"]{opacity:1;transform:none}
        .ar-stamp{transition:transform .15s ease,box-shadow .15s ease}
        .ar-stamp:hover{transform:translate(2px,2px);box-shadow:3px 3px 0 ${INK}}
        .ar-stamp:active{transform:translate(5px,5px);box-shadow:0 0 0 ${INK}}
        .ar-ticket{transition:transform .35s cubic-bezier(0.22,1,0.36,1)}
        .ar-ticket:hover{transform:rotate(-0.5deg) translateY(-4px)}
        .ar-skin{transition:transform .18s ease,box-shadow .18s ease,background .2s ease,color .2s ease}
        .ar-skin:hover{transform:translate(-1px,-1px)}
        .ar-skin:active{transform:translate(1px,1px)}
        .ar-dial-sun{transition:filter .4s ease}
        .ar-sun-breathe{animation:ar-breathe 6s ease-in-out infinite}
        @keyframes ar-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
        .ar-root :focus-visible{outline:3px solid ${SIGNAL_DEEP};outline-offset:3px}
        @media (prefers-reduced-motion: reduce){
          .ar-root *,.ar-root *::before,.ar-root *::after{transition-duration:.01ms!important;animation-duration:.01ms!important;animation-iteration-count:1!important}
          .ar-reveal{opacity:1;transform:none;transition:none}
        }
      `}</style>

      {/* ── Seamless header on the poster ───────────────────────────────── */}
      <header className="absolute inset-x-0 top-0 z-40">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-5 py-5 md:px-8">
          <a href="#top" className="flex items-baseline gap-2" aria-label="Sólbaðsstofan Ársól">
            <span className="text-3xl uppercase md:text-4xl" style={{ fontFamily: POSTER, color: INK }}>
              Ársól
            </span>
            <span className="hidden text-[11px] tracking-[0.14em] uppercase sm:inline" style={{ fontFamily: MONO, color: SIGNAL_DEEP }}>
              Selfoss
            </span>
          </a>
          <nav className="hidden items-center gap-8 text-base md:flex" style={{ fontFamily: SANS_BOLD }} aria-label="Valmynd">
            <a href="#bekkurinn" className="underline-offset-4 hover:underline" style={{ color: INK }}>Bekkurinn</a>
            <a href="#verdskra" className="underline-offset-4 hover:underline" style={{ color: INK }}>Verðskrá</a>
            <a href="#hudin" className="underline-offset-4 hover:underline" style={{ color: INK }}>Húðgerð</a>
            <a href="#hvild" className="underline-offset-4 hover:underline" style={{ color: INK }}>Sauna & nudd</a>
          </nav>
          <Stamp href={NOONA} variant="coral">Bóka tíma</Stamp>
        </div>
      </header>

      {/* ── HERO — the setting sun behind the poster ────────────────────── */}
      <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden border-b-2" style={{ borderColor: INK }}>
        {/* the sun, low behind the type */}
        <div className="pointer-events-none absolute -top-28 -right-24 h-[280px] w-[280px] opacity-45 md:top-6 md:right-4 md:h-[560px] md:w-[560px] md:opacity-90" aria-hidden="true">
          <SettingSun heat={0.7} className="h-full w-full" />
        </div>
        <div className="relative mx-auto w-full max-w-[1280px] px-5 pt-24 pb-10 md:px-8 md:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
            <div className="relative z-10">
              <p className="text-sm tracking-[0.14em] uppercase" style={{ fontFamily: MONO, color: SIGNAL_DEEP }}>
                Sólbaðsstofan á Selfossi
              </p>
              <h1 className="mt-4 text-[clamp(3.4rem,9vw,8rem)] leading-[0.82] uppercase" style={{ fontFamily: POSTER, color: INK }}>
                Sólin þín,
                <br />
                <span style={{ color: SIGNAL }}>alla daga</span>
              </h1>
              <p className="mt-6 max-w-sm text-lg leading-snug" style={{ fontFamily: SANS_MED, color: INK }}>
                Fjórir nýir Luxura X7 bekkir, infrarauður saunaklefi og nuddstóll. Opið alla daga frá 11 til 22.
              </p>

              {/* the offer sticker */}
              <a
                href="#verdskra"
                className="ar-ticket relative mt-9 inline-flex items-center gap-5 border-2 py-3 pr-4 pl-5"
                style={{ background: PAPER, borderColor: INK, boxShadow: `6px 6px 0 ${INK}` }}
                aria-label="10 skipta kort, sýnishorn af verði"
              >
                <span>
                  <span className="block text-[11px] tracking-[0.12em] uppercase" style={{ fontFamily: MONO, color: SIGNAL_DEEP }}>
                    10 skipta kort · sýnishorn
                  </span>
                  <span className="mt-0.5 flex items-baseline gap-2">
                    <span className="text-3xl uppercase md:text-4xl" style={{ fontFamily: POSTER, color: INK }}>
                      {isk(CARDS[1].price)}
                    </span>
                  </span>
                </span>
                <span className="grid h-10 w-10 shrink-0 place-items-center" style={{ background: SUN, color: INK, border: `2px solid ${INK}` }} aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </a>

              <div className="mt-5">
                <a href="#verdskra" className="text-base underline underline-offset-4" style={{ fontFamily: SANS_BOLD, color: INK }}>
                  Sjá alla verðskrá
                </a>
              </div>
            </div>

            <Poster src={IMG.heroBed} alt="Luxura X7 ljósabekkur hjá Ársól" ratio="4 / 3" shadow={10} />
          </div>
        </div>
      </section>

      {/* ── Fact lines — three stamped facts ────────────────────────────── */}
      <section className="border-b-2" style={{ borderColor: INK }}>
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 divide-y-2 px-5 sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0 md:px-8" style={{ borderColor: INK }}>
          {FACTS.map((f, i) => (
            <Reveal key={f.big} delay={i * 80} className="py-8 sm:px-6 sm:first:pl-0 sm:last:pr-0">
              <p className="text-4xl uppercase md:text-5xl" style={{ fontFamily: POSTER, color: i === 1 ? SIGNAL : INK }}>
                {f.big}
              </p>
              <p className="mt-1 text-base" style={{ fontFamily: SANS_MED }}>
                {f.small}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Bekkurinn — Luxura X7 ×4 ────────────────────────────────────── */}
      <section id="bekkurinn" className="scroll-mt-20 border-b-2" style={{ borderColor: INK }}>
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-8 md:py-28">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
            <Reveal>
              <Poster src={bed.image} alt="Luxura X7 ljósabekkurinn í Ársól" ratio="4 / 5" />
            </Reveal>
            <Reveal delay={100}>
              <p className="text-sm tracking-[0.1em] uppercase" style={{ fontFamily: MONO, color: SIGNAL_DEEP }}>
                {bed.kicker}
              </p>
              <h2 className="mt-2 text-5xl leading-[0.92] uppercase md:text-7xl" style={{ fontFamily: POSTER }}>
                {bed.name}
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-relaxed">{bed.body}</p>
              <ul className="mt-7 flex flex-col border-t-2" style={{ borderColor: INK }}>
                {bed.specs.map((s) => (
                  <li key={s} className="flex items-center gap-3 border-b py-2.5 text-base" style={{ borderColor: `${INK}33`, fontFamily: SANS_MED }}>
                    <span aria-hidden="true" className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: SUN, border: `1.5px solid ${INK}` }} />
                    {s}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Stamp href={NOONA} variant="coral">Bóka bekk</Stamp>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Verðskrá — the printed board, sample prices ─────────────────── */}
      <section id="verdskra" className="scroll-mt-20 border-b-2" style={{ borderColor: INK }}>
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <div className="border-2 p-6 pb-10 sm:p-10 md:p-14" style={{ background: PAPER, borderColor: INK, boxShadow: `12px 12px 0 ${INK}` }}>
              <div className="flex flex-wrap items-end justify-between gap-6 border-b-2 pb-8" style={{ borderColor: INK }}>
                <h2 className="text-5xl leading-[0.92] uppercase md:text-8xl" style={{ fontFamily: POSTER }}>
                  Verðskrá
                </h2>
                <span className="text-xs tracking-[0.12em] uppercase" style={{ fontFamily: MONO, color: SIGNAL_DEEP }}>
                  Sýnishorn · staðfestist hjá Ársól
                </span>
              </div>

              <div className="mt-10 grid gap-14 lg:grid-cols-2 lg:gap-24">
                <div>
                  <p className="text-3xl uppercase md:text-4xl" style={{ fontFamily: POSTER, color: SIGNAL }}>
                    Stakir tímar
                  </p>
                  <div className="mt-3">
                    {SINGLES.map((row) => (
                      <MenuRow key={row.label + row.minutes} label={row.label} sub={row.minutes} price={isk(row.price)} />
                    ))}
                    <MenuRow label="Öryrkjar og eldri borgarar" price="afsláttur" />
                  </div>
                </div>

                <div>
                  <p className="text-3xl uppercase md:text-4xl" style={{ fontFamily: POSTER }}>
                    Klippikort
                  </p>
                  <div className="mt-6 grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
                    {CARDS.map((c) => (
                      <div key={c.label} className="flex items-center justify-between gap-4 border-2 px-5 py-4" style={{ borderColor: INK, background: PAGE }}>
                        <div>
                          <p className="text-2xl uppercase" style={{ fontFamily: POSTER }}>{c.label}</p>
                          <p className="text-xs tracking-[0.08em] uppercase" style={{ fontFamily: MONO, color: SIGNAL_DEEP }}>{c.note}</p>
                        </div>
                        <p className="text-2xl uppercase whitespace-nowrap" style={{ fontFamily: POSTER }}>{isk(c.price)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8">
                    <Stamp href={NOONA} variant="coral">Bóka tíma</Stamp>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
          <p className="mt-5 text-sm leading-relaxed" style={{ fontFamily: MONO, opacity: 0.75 }}>
            Verð eru sýnishorn í frumgerð og yrðu staðfest með stofunni. Rauntímabókun og verð eru á Noona.
          </p>
        </div>
      </section>

      {/* ── SIGNATURE — húðgerðar sun-dial ──────────────────────────────── */}
      <section id="hudin" className="scroll-mt-20 border-b-2" style={{ borderColor: INK }}>
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <p className="text-sm tracking-[0.1em] uppercase" style={{ fontFamily: MONO, color: SIGNAL_DEEP }}>
              Húðin þín ræður tímanum
            </p>
            <h2 className="mt-2 max-w-3xl text-4xl leading-[0.95] uppercase md:text-6xl" style={{ fontFamily: POSTER }}>
              Hvað hentar þinni húð?
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-snug" style={{ fontFamily: SANS_MED }}>
              Veldu húðgerð og sólin sýnir þér ráðlagðan tíma. Byrjaðu alltaf á styttri tíma og finndu þinn takt.
            </p>
          </Reveal>
          <div className="mt-14">
            <Reveal>
              <SkinDial />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Hvíld — the dark plate: infrared sauna + massage chair ───────── */}
      <section id="hvild" className="scroll-mt-20 border-b-2" style={{ borderColor: INK, background: PLATE, color: PLATE_INK }}>
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <p className="text-sm tracking-[0.1em] uppercase" style={{ fontFamily: MONO, color: SUN }}>
              Meira en ljós
            </p>
            <h2 className="mt-3 max-w-3xl text-5xl leading-[0.92] uppercase md:text-7xl" style={{ fontFamily: POSTER, color: PLATE_INK }}>
              Hiti og hvíld
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed" style={{ color: `${PLATE_INK}d9` }}>
              Ekki bara sól. Infrarauður saunaklefi og nuddstóll gera Ársól að litlum griðastað í miðri viku.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-16">
            {EXTRAS.map((x, i) => (
              <Reveal key={x.id} delay={i * 100}>
                <Poster src={x.image} alt={x.name} ratio="3 / 2" onPlate />
                <h3 className="mt-6 text-3xl uppercase md:text-4xl" style={{ fontFamily: POSTER, color: PLATE_INK }}>
                  {x.name}
                </h3>
                <p className="mt-3 max-w-md text-base leading-relaxed" style={{ color: `${PLATE_INK}cc` }}>
                  {x.line}
                </p>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 border-t-2 pt-8" style={{ borderColor: `${PLATE_INK}44` }}>
            <div className="max-w-md">
              {EXTRA_PRICES.map((row) => (
                <MenuRow key={row.label} label={row.label} sub={row.minutes} price={isk(row.price)} onPlate />
              ))}
              <p className="mt-3 text-sm" style={{ color: `${PLATE_INK}a8`, fontFamily: MONO }}>
                Sýnishorn af verði. Staðfestist hjá Ársól.
              </p>
            </div>
            <div className="mt-8">
              <Stamp href={NOONA} onPlate>Bóka tíma</Stamp>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sagan + staðurinn ───────────────────────────────────────────── */}
      <section id="stadurinn" className="relative">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-8 md:py-28">
          <div className="grid items-center gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
            <Reveal>
              <Poster src={IMG.interior} alt="Inni hjá Sólbaðsstofunni Ársól á Selfossi" ratio="4 / 3" />
            </Reveal>
            <Reveal delay={100}>
              <h2 className="max-w-xl text-4xl leading-[0.95] uppercase md:text-6xl" style={{ fontFamily: POSTER }}>
                {STORY.headline}
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed">{STORY.body}</p>
              <div className="mt-8 max-w-md border-t-2" style={{ borderColor: INK }}>
                <a href={MAPS} target="_blank" rel="noreferrer" className="flex items-baseline justify-between border-b py-3 underline-offset-4 hover:underline" style={{ borderColor: `${INK}33`, color: INK, fontFamily: SANS_MED }}>
                  <span>{ADDRESS.street}</span>
                  <span style={{ fontFamily: MONO, fontSize: '0.9rem' }}>{ADDRESS.town}</span>
                </a>
                {HOURS.map((h) => (
                  <div key={h.day} className="flex items-baseline justify-between border-b py-3" style={{ borderColor: `${INK}33`, fontFamily: SANS_MED }}>
                    <span>{h.day}</span>
                    <span style={{ fontFamily: MONO, fontSize: '0.9rem' }}>{h.time}</span>
                  </div>
                ))}
                <a href={PHONE_HREF} className="flex items-baseline justify-between border-b py-3 underline-offset-4 hover:underline" style={{ borderColor: `${INK}33`, color: INK, fontFamily: SANS_MED }}>
                  <span>Sími</span>
                  <span style={{ fontFamily: MONO, fontSize: '0.9rem' }}>{PHONE_DISPLAY}</span>
                </a>
                <a href={`mailto:${EMAIL}`} className="flex items-baseline justify-between border-b py-3 underline-offset-4 hover:underline" style={{ borderColor: `${INK}33`, color: INK, fontFamily: SANS_MED }}>
                  <span>Netfang</span>
                  <span style={{ fontFamily: MONO, fontSize: '0.8rem' }}>{EMAIL}</span>
                </a>
              </div>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Stamp href={NOONA} variant="coral">Bóka tíma</Stamp>
                <a href={FACEBOOK} target="_blank" rel="noreferrer" className="text-base underline underline-offset-4" style={{ fontFamily: SANS_BOLD, color: INK }}>
                  Facebook
                </a>
              </div>
            </Reveal>
          </div>
        </div>

        {/* colophon */}
        <div className="border-t-2" style={{ borderColor: INK }}>
          <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-4 px-5 py-7 text-sm sm:flex-row sm:items-center md:px-8">
            <p className="text-2xl uppercase" style={{ fontFamily: POSTER, color: SIGNAL }}>
              Ársól
            </p>
            <div className="flex flex-wrap gap-6" style={{ fontFamily: MONO }}>
              <a href={NOONA} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline" style={{ color: INK }}>Bóka á Noona</a>
              <a href={FACEBOOK} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline" style={{ color: INK }}>Facebook</a>
              <a href={MAPS} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline" style={{ color: INK }}>Kort</a>
            </div>
          </div>
        </div>
      </section>

      <PreviewFooter company={company} />

      {/* ── Mobile sticky CTA ───────────────────────────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t-2 p-3 md:hidden" style={{ background: PAGE, borderColor: INK }}>
        <a
          href={NOONA}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 items-center justify-center px-5 py-3.5 text-sm tracking-[0.06em] uppercase"
          style={{ background: SIGNAL_DEEP, color: PAPER, border: `2px solid ${INK}`, boxShadow: `4px 4px 0 ${INK}`, fontFamily: SANS_BOLD }}
        >
          Bóka tíma
        </a>
        <a href={PHONE_HREF} className="grid h-12 w-12 shrink-0 place-items-center" style={{ border: `2px solid ${INK}`, color: INK, background: PAPER }} aria-label="Hringja í Ársól">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </a>
      </div>

      <PreviewChrome company={company} />
    </div>
  )
}
