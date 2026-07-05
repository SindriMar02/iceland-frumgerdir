import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  ADDRESS,
  BEDS,
  CARDS,
  EMAIL,
  FACTS,
  IMG,
  K11_PRICES,
  MAPS,
  NOONA,
  PHONE_DISPLAY,
  PHONE_HREF,
  PLANS,
  PLAN_TERMS,
  PRODUCTS,
  REPEAT_PORTAL,
  SAFETY,
  SKIN_TYPES,
  SOCIAL,
  SPRAY,
  STORY,
  TIMES,
} from './data'

const company = getPreviewCompany('saelan')

/* ── Sólplakat — a silkscreened solarium poster. The page IS the logo's
      sun yellow; red and warm ink are the two print colors. One black
      plate (Spraytan.is, the sub-brand) breaks the run on purpose. ── */
const PAGE = '#F3EBD6' // warm cream paper, the page ground
const SUN = '#F3C11B' // logo sun yellow, accents only (stamps, the hop sun)
const INK = '#211B0E' // warm print black, text and rules
const RED = '#C9301C' // logo signal red, display type 24px+ only
const PAPER = '#FBF6EA' // lighter paper: tickets, cards, photo mounts
const PLATE = '#1B160C' // the single dark plate (Spraytan chapter)
const PLATE_INK = '#F2E8D2' // ink on the dark plate

const BASE = import.meta.env.BASE_URL
const POSTER = "'Tanker-Regular', 'CabinetGrotesk-Black', sans-serif"
const WORDMARK = "'Stardom', Georgia, serif"
const SANS = "'CabinetGrotesk-Regular', system-ui, sans-serif"
const SANS_MED = "'CabinetGrotesk-Medium', system-ui, sans-serif"
const SANS_BOLD = "'CabinetGrotesk-Bold', system-ui, sans-serif"
const MONO = "'Space Mono', monospace"

const isk = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

/* ── IO reveal — a quick stamp-in; failsafe timer means nothing sticks ── */
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
    <div ref={ref} data-in={on} className={`sn-reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* ── Stamp button — flat print block with a hard offset shadow ─────────── */
function Stamp({
  href,
  children,
  red = false,
  onPlate = false,
}: {
  href: string
  children: ReactNode
  red?: boolean
  onPlate?: boolean
}) {
  const edge = onPlate ? PLATE_INK : INK
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="sn-stamp inline-flex items-center px-7 py-4 text-base tracking-[0.06em] uppercase"
      style={{
        background: red ? RED : SUN,
        color: red ? PAPER : INK,
        border: `2px solid ${edge}`,
        boxShadow: `5px 5px 0 ${edge}`,
        fontFamily: SANS_BOLD,
      }}
    >
      {children}
    </a>
  )
}

/* ── Morning or day — two plain buttons; the sun hops over the active one ── */
function SunToggle({ morning, setMorning }: { morning: boolean; setMorning: (m: boolean) => void }) {
  return (
    <div className="relative inline-block pt-14" role="group" aria-label="Verðflokkur eftir tíma dags">
      {/* the sun, gliding over whichever half of the day is chosen */}
      <div
        className="sn-sunhop pointer-events-none absolute top-0 grid h-12 w-12 place-items-center rounded-full"
        style={{
          left: morning ? 'calc(25% - 1.5rem)' : 'calc(75% - 1.5rem)',
          background: SUN,
          border: `3px solid ${RED}`,
          boxShadow: `4px 4px 0 ${INK}`,
        }}
        aria-hidden="true"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill={RED} aria-hidden="true">
          <circle cx="12" cy="12" r="5" />
          <g stroke={RED} strokeWidth="2" strokeLinecap="round">
            <path d="M12 1v4M12 19v4M1 12h4M19 12h4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M19.8 4.2 17 7M7 17l-2.8 2.8" />
          </g>
        </svg>
      </div>
      <div className="flex">
        {(
          [
            [true, 'Morgunverð', 'kl. 10 til 14'],
            [false, 'Dagverð', 'kl. 14 til 23'],
          ] as const
        ).map(([isMorning, label, hours]) => {
          const active = morning === isMorning
          return (
            <button
              key={label}
              type="button"
              onClick={() => setMorning(isMorning)}
              aria-pressed={active}
              className="sn-toggle flex-col px-7 py-3.5 text-left"
              style={{
                background: active ? RED : PAPER,
                color: active ? PAPER : INK,
                border: `2px solid ${INK}`,
                marginLeft: isMorning ? 0 : -2,
                fontFamily: SANS_BOLD,
              }}
            >
              <span className="block text-base tracking-[0.06em] uppercase">{label}</span>
              <span className="block text-xs" style={{ fontFamily: MONO, opacity: 0.85 }}>
                {hours}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── Dotted-leader price line, straight off a printed menu ─────────────── */
function MenuRow({ label, sub, price, dim = false }: { label: string; sub?: string; price: string; dim?: boolean }) {
  return (
    <div className="flex items-baseline gap-3 py-3" style={{ opacity: dim ? 0.42 : 1, transition: 'opacity .35s ease' }}>
      <span className="shrink-0 text-lg md:text-xl" style={{ fontFamily: SANS_MED, color: INK }}>
        {label}
        {sub ? (
          <span className="ml-2 text-sm" style={{ fontFamily: MONO }}>
            {sub}
          </span>
        ) : null}
      </span>
      <span aria-hidden="true" className="min-w-6 flex-1 border-b-2 border-dotted" style={{ borderColor: `${INK}66`, transform: 'translateY(-4px)' }} />
      <span className="shrink-0 text-2xl whitespace-nowrap uppercase md:text-3xl" style={{ fontFamily: POSTER, color: INK }}>
        {price}
      </span>
    </div>
  )
}

/* ── Photo scrap — taped-in print, slightly off-square ─────────────────── */
function Scrap({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <figure className={`relative ${className}`}>
      <div className="border-2 p-2 pb-3" style={{ background: PAPER, borderColor: INK, boxShadow: `6px 6px 0 ${INK}` }}>
        <img src={src} alt={alt} loading="lazy" className="block w-full object-cover" />
      </div>
    </figure>
  )
}

export default function SaelanPage() {
  const [morning, setMorning] = useState(true)

  useEffect(() => {
    setThemeColor(PAGE)
  }, [])

  const jsonLd = useMemo(
    () =>
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TanningSalon',
        name: 'Sólbaðsstofan Sælan',
        url: 'https://saelan.is',
        telephone: '+354 544 2424',
        email: EMAIL,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Faxafen 10',
          addressLocality: 'Reykjavík',
          postalCode: '108',
          addressCountry: 'IS',
        },
        priceRange: '2190-8990 ISK',
      }),
    [],
  )

  return (
    <div className="sn-root min-h-screen overflow-x-hidden pb-[4.5rem] antialiased md:pb-0" style={{ background: PAGE, color: INK, fontFamily: SANS }}>
      <link rel="stylesheet" href={`${BASE}fonts/tanker/css/tanker.css`} />
      <link rel="stylesheet" href={`${BASE}fonts/cabinet-grotesk/css/cabinet-grotesk.css`} />
      <script type="application/ld+json">{jsonLd}</script>

      <style>{`
        .sn-reveal{opacity:0;transform:translateY(14px) scale(.995);transition:opacity .5s ease,transform .5s cubic-bezier(0.22,1,0.36,1)}
        .sn-reveal[data-in="true"]{opacity:1;transform:none}
        .sn-stamp{transition:transform .15s ease,box-shadow .15s ease}
        .sn-stamp:hover{transform:translate(2px,2px);box-shadow:3px 3px 0 ${INK}}
        .sn-stamp:active{transform:translate(5px,5px);box-shadow:0 0 0 ${INK}}
        .sn-ticket{transition:transform .35s cubic-bezier(0.22,1,0.36,1)}
        .sn-ticket:hover{transform:rotate(0.5deg) translateY(-4px)}
        .sn-seal{transform:rotate(-10deg);transition:transform .35s cubic-bezier(0.34,1.4,0.5,1)}
        .sn-ticket:hover .sn-seal{transform:rotate(-2deg) scale(1.06)}
        .sn-sunhop{transition:left .5s cubic-bezier(0.34,1.3,0.5,1)}
        .sn-toggle{transition:background .2s ease,color .2s ease}
        .sn-toggle:active{transform:translate(1px,1px)}
        .sn-punch{transition:background .25s ease}
        .sn-card:hover .sn-punch{background:${INK}}
        .sn-scrapimg{transition:transform .4s cubic-bezier(0.22,1,0.36,1)}
        .sn-root :focus-visible{outline:3px solid ${RED};outline-offset:3px}
        @media (prefers-reduced-motion: reduce){
          .sn-root *,.sn-root *::before,.sn-root *::after{transition-duration:.01ms!important;animation-duration:.01ms!important;animation-iteration-count:1!important}
          .sn-reveal{opacity:1;transform:none;transition:none}
        }
      `}</style>

      {/* ── Seamless header on the poster ───────────────────────────────── */}
      <header className="absolute inset-x-0 top-0 z-40">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-5 py-5 md:px-8">
          <a href="#top" className="block" aria-label="Sólbaðsstofan Sælan">
            <img src={IMG.logo} alt="Sólbaðsstofan Sælan" width={512} height={512} className="h-16 w-auto md:h-20" />
          </a>
          <nav className="hidden items-center gap-8 text-base md:flex" style={{ fontFamily: SANS_BOLD }} aria-label="Valmynd">
            <a href="#bekkirnir" className="underline-offset-4 hover:underline" style={{ color: INK }}>
              Bekkirnir
            </a>
            <a href="#verdskra" className="underline-offset-4 hover:underline" style={{ color: INK }}>
              Verðskrá
            </a>
            <a href="#askrift" className="underline-offset-4 hover:underline" style={{ color: INK }}>
              Áskrift
            </a>
            <a href="#spraytan" className="underline-offset-4 hover:underline" style={{ color: INK }}>
              Spraytan
            </a>
          </nav>
          <Stamp href={NOONA} red>
            Bóka tíma
          </Stamp>
        </div>
      </header>

      {/* ── HERO — the flagship K11 bed, contained, on the brand sun ────── */}
      <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden border-b-2" style={{ borderColor: INK }}>
        <div className="mx-auto w-full max-w-[1280px] px-5 pt-24 pb-10 md:px-8 md:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
            {/* content, left */}
            <div className="relative z-10">
              <h1 className="text-[clamp(3.4rem,8.4vw,8rem)] leading-[0.84] uppercase" style={{ fontFamily: POSTER, color: INK }}>
                Gerðu þér{' '}
                <span style={{ color: RED }}>glaðan dag</span>
              </h1>
              <p className="mt-6 max-w-sm text-lg leading-snug" style={{ fontFamily: SANS_MED, color: INK }}>
                Alla daga. Nýjustu ljósabekkir, sjálfvirkt spraytan og áskrift í ljós.
              </p>

              {/* the offer, shrunk to a small stamped sticker */}
              <a
                href="#askrift"
                className="sn-ticket relative mt-9 inline-flex items-center gap-5 border-2 py-3 pr-4 pl-5"
                style={{ background: PAPER, borderColor: INK, boxShadow: `6px 6px 0 ${INK}` }}
                aria-label="Áskrift í ljós, 7.990 krónur á mánuði, borgar sig frá fjórðu heimsókn"
              >
                <span>
                  <span className="block text-[11px] tracking-[0.12em] uppercase" style={{ fontFamily: MONO, color: RED }}>
                    Áskrift · borgar sig frá 4. heimsókn
                  </span>
                  <span className="mt-0.5 flex items-baseline gap-2">
                    <span className="text-3xl uppercase md:text-4xl" style={{ fontFamily: POSTER, color: INK }}>
                      7.990 kr
                    </span>
                    <span className="text-sm" style={{ fontFamily: MONO, color: `${INK}99` }}>
                      /mán
                    </span>
                  </span>
                </span>
                <span className="grid h-10 w-10 shrink-0 place-items-center" style={{ background: RED, color: PAPER, border: `2px solid ${INK}` }} aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </a>

              <div className="mt-5">
                <a href="#verdskra" className="text-base underline underline-offset-4" style={{ fontFamily: SANS_BOLD, color: INK }}>
                  Sjá verðskrá
                </a>
              </div>
            </div>

            {/* the flagship bed, contained, floating on the brand sun */}
            <div className="relative flex flex-col items-center">
              <div className="relative flex w-full items-center justify-center">
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 left-1/2 h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[27rem] sm:w-[27rem] lg:h-[31rem] lg:w-[31rem]"
                  style={{ background: SUN, border: `2px solid ${INK}`, boxShadow: `0 0 0 1.25rem ${SUN}40` }}
                />
                <img
                  src={IMG.bedK11}
                  alt="KBL K11 Air Loft ljósabekkurinn"
                  width={1400}
                  height={877}
                  fetchPriority="high"
                  className="relative block w-full max-w-[38rem]"
                  style={{ filter: `drop-shadow(10px 12px 16px ${INK}33)` }}
                />
              </div>
              <p className="mt-3 text-center text-[11px] tracking-[0.12em] uppercase" style={{ fontFamily: MONO, color: `${INK}88` }}>
                KBL K11 Air Loft
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Fact lines — three stamped facts, no cards ──────────────────── */}
      <section className="border-b-2" style={{ borderColor: INK }}>
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 divide-y-2 px-5 sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0 md:px-8" style={{ borderColor: INK }}>
          {FACTS.map((f, i) => (
            <Reveal key={f.big} delay={i * 80} className="py-8 sm:px-6 sm:first:pl-0 sm:last:pr-0">
              <p className="text-4xl uppercase md:text-5xl" style={{ fontFamily: POSTER, color: i === 1 ? RED : INK }}>
                {f.big}
              </p>
              <p className="mt-1 text-base" style={{ fontFamily: SANS_MED }}>
                {f.small}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Bekkirnir — two poster panels ───────────────────────────────── */}
      <section id="bekkirnir" className="scroll-mt-20 border-b-2" style={{ borderColor: INK }}>
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <h2 className="text-5xl leading-[0.92] uppercase md:text-7xl" style={{ fontFamily: POSTER }}>
              Bekkirnir
            </h2>
          </Reveal>
          <div className="mt-14 flex flex-col gap-20">
            {BEDS.map((bed, i) => (
              <div key={bed.id} className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
                <Reveal className={i % 2 ? 'md:order-2' : ''}>
                  <Scrap src={bed.image} alt={bed.alt} />
                </Reveal>
                <Reveal delay={100} className={i % 2 ? 'md:order-1' : ''}>
                  <p className="text-sm tracking-[0.1em] uppercase" style={{ fontFamily: MONO, color: RED }}>
                    {bed.claim}
                  </p>
                  <h3 className="mt-2 text-4xl leading-[0.95] uppercase md:text-5xl" style={{ fontFamily: POSTER }}>
                    {bed.name}
                  </h3>
                  <p className="mt-4 max-w-lg text-lg leading-relaxed">{bed.body}</p>
                  <ul className="mt-6 flex flex-col border-t-2" style={{ borderColor: INK }}>
                    {bed.specs.map((s) => (
                      <li key={s} className="border-b py-2.5 text-base" style={{ borderColor: `${INK}33`, fontFamily: SANS_MED }}>
                        {s}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Verðskrá — one big board on the wall, kort resting at its base ── */}
      <section id="verdskra" className="scroll-mt-20 border-b-2" style={{ borderColor: INK }}>
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-8 md:py-28">
          {/* the board */}
          <Reveal>
            <div className="border-2 p-6 pb-12 sm:p-10 md:p-14 md:pb-20" style={{ background: PAPER, borderColor: INK, boxShadow: `12px 12px 0 ${INK}` }}>
              <div className="flex flex-wrap items-end justify-between gap-8 border-b-2 pb-8" style={{ borderColor: INK }}>
                <div>
                  <h2 className="text-5xl leading-[0.92] uppercase md:text-8xl" style={{ fontFamily: POSTER }}>
                    Verðskrá
                  </h2>
                  <p className="mt-3 max-w-lg text-lg leading-snug" style={{ fontFamily: SANS_MED }}>
                    Morgunverð gildir frá 10 til 14 og dagverð frá 14 til 23, sólin fylgir þér.
                  </p>
                </div>
                <SunToggle morning={morning} setMorning={setMorning} />
              </div>

              <div className="mt-10 grid gap-14 lg:grid-cols-2 lg:gap-24">
                <div>
                  <div className="flex items-baseline justify-between">
                    <p className="text-3xl uppercase md:text-4xl" style={{ fontFamily: POSTER, color: RED }} aria-live="polite">
                      {morning ? 'Morgunverð' : 'Dagverð'}
                    </p>
                    <p className="text-sm" style={{ fontFamily: MONO }}>
                      {morning ? 'kl. 10 til 14' : 'kl. 14 til 23'}
                    </p>
                  </div>
                  <div className="mt-3">
                    {TIMES.map((row) => (
                      <MenuRow key={row.label + row.minutes} label={row.label} sub={row.minutes} price={isk(morning ? row.morning : row.day)} />
                    ))}
                    <MenuRow label="Öryrkjar" price="10% afsláttur" />
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between">
                    <p className="text-3xl uppercase md:text-4xl" style={{ fontFamily: POSTER }}>
                      K11 Air Loft
                    </p>
                    <p className="text-sm" style={{ fontFamily: MONO }}>
                      FULL LED
                    </p>
                  </div>
                  <div className="mt-3">
                    {K11_PRICES.map((row) => (
                      <MenuRow key={row.label} label={row.label} sub={row.minutes} price={isk(row.price)} />
                    ))}
                  </div>
                  <p className="mt-6 max-w-sm text-base leading-relaxed">
                    Flottasti ljósabekkur í heimi, með Capri, Hawaii og Hamptons stillingunum. Sama verð allan daginn.
                  </p>
                  <div className="mt-8">
                    <Stamp href={NOONA} red>
                      Bóka tíma
                    </Stamp>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* klippikortin resting on the board's lower edge */}
          <div className="relative z-10 -mt-6 grid gap-6 px-3 sm:px-6 md:-mt-12 md:grid-cols-3 md:px-12">
            {CARDS.map((c, i) => {
              const punches = [5, 10, 15][i]
              return (
                <Reveal key={c.label} delay={i * 90}>
                  <div
                    className="sn-card p-6"
                    style={{ background: PAPER, border: `2px solid ${INK}`, boxShadow: `6px 6px 0 ${INK}` }}
                  >
                    <div className="flex items-baseline justify-between">
                      <p className="text-3xl uppercase" style={{ fontFamily: POSTER }}>
                        {c.label}
                      </p>
                      <span className="text-xs tracking-[0.12em] uppercase" style={{ fontFamily: MONO, color: RED }}>
                        Sælan
                      </span>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2" aria-hidden="true">
                      {Array.from({ length: punches }, (_, p) => (
                        <span
                          key={p}
                          className="sn-punch inline-block h-5 w-5 rounded-full"
                          style={{ border: `2px solid ${INK}`, transitionDelay: `${p * 45}ms` }}
                        />
                      ))}
                    </div>
                    <div className="mt-6 flex items-baseline justify-between border-t-2 pt-4" style={{ borderColor: INK }}>
                      <span className="text-sm" style={{ fontFamily: MONO }}>
                        dagur {isk(c.day)}
                      </span>
                      <span className="text-sm" style={{ fontFamily: MONO, color: RED }}>
                        morgunn {isk(c.morning)}
                      </span>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
          <p className="mt-5 text-right text-sm" style={{ fontFamily: MONO }}>
            Klippikort, morgunkortin eru ódýrari.
          </p>
        </div>
      </section>

      {/* ── Áskrift — the membership, fine print up front ───────────────── */}
      <section id="askrift" className="scroll-mt-20 border-b-2" style={{ borderColor: INK }}>
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-8 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <Reveal>
              <h2 className="text-5xl leading-[0.92] uppercase md:text-7xl" style={{ fontFamily: POSTER }}>
                Áskrift í ljós
              </h2>
              <p className="mt-4 max-w-md text-lg leading-snug" style={{ fontFamily: SANS_MED }}>
                Eitt fast verð á mánuði og þú getur komið einu sinni á dag, allt árið um kring.
              </p>
              <ul className="mt-8 flex max-w-md flex-col border-t-2" style={{ borderColor: INK }}>
                {PLAN_TERMS.map((t) => (
                  <li key={t} className="border-b py-3 text-base leading-snug" style={{ borderColor: `${INK}33` }}>
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-4 max-w-md text-sm leading-relaxed">
                Áskriftinni er stjórnað í{' '}
                <a href={REPEAT_PORTAL} target="_blank" rel="noreferrer" className="underline underline-offset-2" style={{ color: INK, fontFamily: SANS_BOLD }}>
                  vefgátt Repeat
                </a>
                , þar segirðu líka upp.
              </p>
            </Reveal>
            <div className="flex flex-col gap-8">
              {PLANS.map((p, i) => (
                <Reveal key={p.id} delay={i * 100}>
                  <div className="p-7" style={{ background: PAPER, border: `2px solid ${INK}`, boxShadow: `6px 6px 0 ${INK}` }}>
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <p className="text-4xl uppercase md:text-5xl" style={{ fontFamily: POSTER, color: RED }}>
                        {isk(p.price)}
                      </p>
                      <p className="text-sm" style={{ fontFamily: MONO }}>
                        á mánuði
                      </p>
                    </div>
                    <p className="mt-2 text-base" style={{ fontFamily: SANS_BOLD }}>
                      {p.binding}
                    </p>
                    <p className="mt-2 max-w-md text-base leading-relaxed">{p.pitch}</p>
                    <div className="mt-6">
                      <Stamp href={p.href}>Koma í áskrift</Stamp>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Spraytan.is — the one dark plate, the sub-brand ─────────────── */}
      <section id="spraytan" className="scroll-mt-20 border-b-2" style={{ borderColor: INK, background: PLATE, color: PLATE_INK }}>
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <p className="text-sm tracking-[0.1em] uppercase" style={{ fontFamily: MONO, color: SUN }}>
              Spraytan.is
            </p>
            <h2 className="mt-3 max-w-4xl text-5xl leading-[0.92] uppercase md:text-7xl" style={{ fontFamily: POSTER, color: PLATE_INK }}>
              {SPRAY.claim}
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed" style={{ color: `${PLATE_INK}d9` }}>
              {SPRAY.intro}
            </p>
          </Reveal>

          <div className="mt-14 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
            <Reveal delay={80}>
              <ul className="flex flex-col border-t-2" style={{ borderColor: `${PLATE_INK}66` }}>
                {SPRAY.solutions.map((s) => (
                  <li key={s.name} className="flex items-center gap-5 border-b py-4" style={{ borderColor: `${PLATE_INK}2e` }}>
                    <span aria-hidden="true" className="h-10 w-10 shrink-0 rounded-full" style={{ background: s.tone, border: `2px solid ${PLATE_INK}` }} />
                    <div>
                      <p className="text-2xl uppercase" style={{ fontFamily: POSTER, color: PLATE_INK }}>
                        {s.name}
                      </p>
                      <p className="text-base leading-snug" style={{ color: `${PLATE_INK}c4` }}>
                        {s.line}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm" style={{ fontFamily: MONO, color: `${PLATE_INK}a8` }}>
                {SPRAY.levels}.
              </p>
            </Reveal>

            <Reveal delay={140}>
              <div>
                {SPRAY.prices.map((p) => (
                  <div key={p.label} className="flex items-baseline gap-3 py-3">
                    <span className="shrink-0 text-lg" style={{ fontFamily: SANS_MED, color: PLATE_INK }}>
                      {p.label}
                    </span>
                    <span aria-hidden="true" className="min-w-6 flex-1 border-b-2 border-dotted" style={{ borderColor: `${PLATE_INK}55`, transform: 'translateY(-4px)' }} />
                    <span className="shrink-0 text-lg whitespace-nowrap" style={{ fontFamily: MONO, color: SUN }}>
                      {isk(p.price)}
                    </span>
                  </div>
                ))}
                {SPRAY.cards.map((c) => (
                  <div key={c.label} className="flex items-baseline gap-3 py-3">
                    <span className="shrink-0 text-lg" style={{ fontFamily: SANS_MED, color: PLATE_INK }}>
                      {c.label} <span style={{ fontFamily: MONO, fontSize: '0.8em', color: `${PLATE_INK}a8` }}>({c.discount})</span>
                    </span>
                    <span aria-hidden="true" className="min-w-6 flex-1 border-b-2 border-dotted" style={{ borderColor: `${PLATE_INK}55`, transform: 'translateY(-4px)' }} />
                    <span className="shrink-0 text-lg whitespace-nowrap" style={{ fontFamily: MONO, color: SUN }}>
                      {isk(c.price)}
                    </span>
                  </div>
                ))}
                <p className="mt-3 text-sm" style={{ color: `${PLATE_INK}a8` }}>
                  {SPRAY.cardsNote}.
                </p>
                <div className="mt-8">
                  <Stamp href={NOONA} onPlate>
                    Bóka tíma
                  </Stamp>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Vörur + húðin — counter goods and the honest chart ──────────── */}
      <section className="border-b-2" style={{ borderColor: INK }}>
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-8 md:py-28">
          <div className="grid items-center gap-12 md:grid-cols-[1fr_1.1fr] md:gap-16">
            <Reveal>
              <h2 className="text-4xl leading-[0.95] uppercase md:text-6xl" style={{ fontFamily: POSTER }}>
                {PRODUCTS.headline}
              </h2>
              <p className="mt-4 max-w-lg text-lg leading-relaxed">{PRODUCTS.body}</p>
            </Reveal>
            <Reveal delay={100}>
              <div className="grid grid-cols-2 gap-6">
                <Scrap src={IMG.products7suns} alt="Dökk 7Suns brúnkukrem í Sælunni" />
                <Scrap src={IMG.products7suns2} alt="Ljós 7Suns brúnkukrem í Sælunni" className="mt-10" />
              </div>
            </Reveal>
          </div>

          <div className="mt-24">
            <Reveal>
              <h2 className="text-4xl leading-[0.95] uppercase md:text-6xl" style={{ fontFamily: POSTER }}>
                Húðin þín ræður tímanum
              </h2>
              <p className="mt-4 max-w-lg text-lg leading-snug" style={{ fontFamily: SANS_MED }}>
                Ráðlagður tími er viðmið, byrjaðu á styttri tíma og finndu þinn takt.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <div className="mt-10 border-t-2" style={{ borderColor: INK }}>
                {SKIN_TYPES.map((s) => (
                  <div key={s.skin} className="grid items-baseline gap-1 border-b py-4 sm:grid-cols-[1fr_auto]" style={{ borderColor: `${INK}33` }}>
                    <p className="text-lg" style={{ fontFamily: SANS_MED }}>
                      {s.skin} <span className="text-base" style={{ fontFamily: SANS }}>({s.hair.toLowerCase()})</span>
                    </p>
                    <p className="text-xl uppercase sm:text-right" style={{ fontFamily: POSTER, color: RED }}>
                      {s.minutes}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed">
                {SAFETY.join('. ')}. Útfjólublá geislun getur skaðað augu og húð og ákveðin lyf og snyrtivörur geta aukið ljósnæmi.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Sagan + staðurinn — the sign is back in the window ──────────── */}
      <section id="stadurinn" className="relative">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-8 md:py-28">
          <div className="grid items-center gap-12 md:grid-cols-[1fr_1.15fr] md:gap-16">
            <Reveal>
              <Scrap src={IMG.storefront} alt="Skilti Sælunnar í glugganum í Faxafeni 10" />
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
                <div className="flex items-baseline justify-between border-b py-3" style={{ borderColor: `${INK}33`, fontFamily: SANS_MED }}>
                  <span>Opið</span>
                  <span style={{ fontFamily: MONO, fontSize: '0.9rem' }}>til 23:00</span>
                </div>
                <a href={PHONE_HREF} className="flex items-baseline justify-between border-b py-3 underline-offset-4 hover:underline" style={{ borderColor: `${INK}33`, color: INK, fontFamily: SANS_MED }}>
                  <span>Sími</span>
                  <span style={{ fontFamily: MONO, fontSize: '0.9rem' }}>{PHONE_DISPLAY}</span>
                </a>
                <a href={`mailto:${EMAIL}`} className="flex items-baseline justify-between border-b py-3 underline-offset-4 hover:underline" style={{ borderColor: `${INK}33`, color: INK, fontFamily: SANS_MED }}>
                  <span>Netfang</span>
                  <span style={{ fontFamily: MONO, fontSize: '0.9rem' }}>{EMAIL}</span>
                </a>
              </div>
              <div className="mt-9">
                <Stamp href={NOONA} red>
                  Bóka tíma
                </Stamp>
              </div>
            </Reveal>
          </div>
        </div>

        {/* colophon */}
        <div className="border-t-2" style={{ borderColor: INK }}>
          <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-4 px-5 py-7 text-sm sm:flex-row sm:items-center md:px-8">
            <p className="text-2xl" style={{ fontFamily: WORDMARK, color: RED }}>
              Sælan
            </p>
            <div className="flex flex-wrap gap-6" style={{ fontFamily: MONO }}>
              <a href={REPEAT_PORTAL} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline" style={{ color: INK }}>
                Mín áskrift
              </a>
              <a href={SOCIAL.facebook} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline" style={{ color: INK }}>
                Facebook
              </a>
              <a href={SOCIAL.instagram} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline" style={{ color: INK }}>
                Instagram
              </a>
              <a href={SOCIAL.instagramSpray} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline" style={{ color: INK }}>
                Spraytan.is
              </a>
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
          style={{ background: RED, color: PAPER, border: `2px solid ${INK}`, boxShadow: `4px 4px 0 ${INK}`, fontFamily: SANS_BOLD }}
        >
          Bóka tíma
        </a>
        <a href={PHONE_HREF} className="grid h-12 w-12 shrink-0 place-items-center" style={{ border: `2px solid ${INK}`, color: INK, background: PAPER }} aria-label="Hringja í Sæluna">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </a>
      </div>

      <PreviewChrome company={company} />
    </div>
  )
}
