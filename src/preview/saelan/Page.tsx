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
  SOCIAL,
  SKIN_TYPES,
  SPRAY,
  STORY,
  TIMES,
} from './data'

const company = getPreviewCompany('saelan')

/* ── Palette — Gullni tíminn, drawn from the original Sælan logo: the yellow
      sun, the signal-red serif wordmark, the black pyramid. One dark theme;
      yellow is the interactive accent, red is reserved for the brand voice
      (wordmark + one emphasis per section, large text only). ── */
const GROUND = '#171210' // warm near-black ground (logo black, warmed)
const PANEL = '#201813' // raised section panel
const CARD = '#281E16' // card surface
const INK = '#F9F1DF' // warm ivory headings
const BODY = '#D1BFA3' // warm sand body text (AA on the dark ground)
const HAIR = '#F9F1DF1f' // hairline on dark
const GOLD = '#F7C331' // the accent: logo sun yellow
const GOLD_SOFT = '#FFD97A' // yellow for small text on dark (AA)
const GOLD_DEEP = '#E0A21F' // gradient stop
const RED = '#E8402F' // logo signal red, large display text + wordmark only
const BRONZE = '#8A5A31' // spraytan chapter tint (same warm family)

const BASE = import.meta.env.BASE_URL
const DISPLAY = "'Stardom', Georgia, serif"
const SANS = "'CabinetGrotesk-Regular', system-ui, sans-serif"
const SANS_MED = "'CabinetGrotesk-Medium', system-ui, sans-serif"
const SANS_BOLD = "'CabinetGrotesk-Bold', system-ui, sans-serif"

const isk = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

/* ── IO reveal — CSS owns the motion; failsafe timer means nothing sticks ── */
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

/* ── Gold pill CTA with the nested arrow chip ─────────────────────────── */
function GoldCta({ href, children, big = false }: { href: string; children: ReactNode; big?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`group inline-flex items-center gap-2.5 rounded-full transition duration-300 hover:brightness-105 active:scale-[0.98] active:duration-150 ${
        big ? 'py-3 pr-3 pl-7 text-lg' : 'py-2.5 pr-2 pl-5 text-sm'
      }`}
      style={{ background: `linear-gradient(160deg, ${GOLD_SOFT}, ${GOLD} 55%, ${GOLD_DEEP})`, color: GROUND, fontFamily: SANS_BOLD }}
    >
      {children}
      <span
        className={`grid place-items-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
          big ? 'h-9 w-9' : 'h-7 w-7'
        }`}
        style={{ background: `${GROUND}1f` }}
        aria-hidden="true"
      >
        <svg width={big ? 16 : 13} height={big ? 16 : 13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17 17 7M9 7h8v8" />
        </svg>
      </span>
    </a>
  )
}

export default function SaelanPage() {
  const [tab, setTab] = useState<'day' | 'morning' | 'k11'>('day')

  useEffect(() => {
    setThemeColor(GROUND)
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
    <div className="sn-root min-h-screen overflow-x-hidden pb-[4.5rem] antialiased md:pb-0" style={{ background: GROUND, color: BODY, fontFamily: SANS }}>
      <link rel="stylesheet" href={`${BASE}fonts/cabinet-grotesk/css/cabinet-grotesk.css`} />
      <script type="application/ld+json">{jsonLd}</script>

      <style>{`
        .sn-reveal{opacity:0;transform:translateY(18px);transition:opacity .8s ease,transform .8s cubic-bezier(0.32,0.72,0,1)}
        .sn-reveal[data-in="true"]{opacity:1;transform:none}
        .sn-float{transition:transform .45s cubic-bezier(0.32,0.72,0,1)}
        .sn-float:hover{transform:translateY(-6px)}
        .sn-img{transition:transform 1.2s cubic-bezier(0.32,0.72,0,1)}
        .sn-imgwrap:hover .sn-img{transform:scale(1.045)}
        .sn-tick{animation:snTick .4s cubic-bezier(0.32,0.72,0,1)}
        @keyframes snTick{from{transform:translateY(6px);opacity:0}to{transform:none;opacity:1}}
        .sn-snap{scrollbar-width:none}
        .sn-snap::-webkit-scrollbar{display:none}
        .sn-root :focus-visible{outline:2px solid ${GOLD};outline-offset:3px}
        @media (prefers-reduced-motion: reduce){
          .sn-root *,.sn-root *::before,.sn-root *::after{transition-duration:.01ms!important;animation-duration:.01ms!important;animation-iteration-count:1!important}
          .sn-reveal{opacity:1;transform:none;transition:none}
          .sn-tick{animation:none}
                  }
      `}</style>

      {/* ── Seamless header — no bar, links sit directly on the hero ───── */}
      <header className="absolute inset-x-0 top-0 z-40">
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-5 py-6 md:px-8 md:py-7">
          <a href="#top" className="text-2xl leading-none" style={{ fontFamily: DISPLAY, color: RED }} aria-label="Sælan">
            Sælan
          </a>
          <nav className="hidden items-center gap-8 text-base md:flex" style={{ fontFamily: SANS_MED }} aria-label="Valmynd">
            <a href="#bekkirnir" className="transition-colors duration-300 hover:text-[#FFD97A]" style={{ color: INK }}>
              Bekkirnir
            </a>
            <a href="#verdskra" className="transition-colors duration-300 hover:text-[#FFD97A]" style={{ color: INK }}>
              Verðskrá
            </a>
            <a href="#askrift" className="transition-colors duration-300 hover:text-[#FFD97A]" style={{ color: INK }}>
              Áskrift
            </a>
            <a href="#spraytan" className="transition-colors duration-300 hover:text-[#FFD97A]" style={{ color: INK }}>
              Spraytan
            </a>
          </nav>
          <GoldCta href={NOONA}>Bóka tíma</GoldCta>
        </div>
      </header>

      {/* ── HERO — golden hour trapped indoors: real amber bed photo + sun ── */}
      <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden">
        {/* real photo: their Ergoline glowing amber, masked into the dark left */}
        <div aria-hidden="true" className="absolute inset-y-0 right-0 w-full md:w-[62%]">
          <img
            src={IMG.bedGlow}
            alt=""
            width={1276}
            height={1600}
            fetchPriority="high"
            className="h-full w-full object-cover"
            style={{
              WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 45%)',
              maskImage: 'linear-gradient(90deg, transparent 0%, black 45%)',
              opacity: 0.9,
            }}
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${GROUND}cc 0%, transparent 40%, ${GROUND} 96%)` }} />
          <div className="absolute inset-0 md:hidden" style={{ background: `${GROUND}66` }} />
        </div>
        <div className="relative mx-auto w-full max-w-[1200px] px-5 pt-24 pb-16 md:px-8">
          <div className="max-w-2xl">
            <h1
              className="sn-reveal text-[clamp(2.9rem,8.4vw,5.6rem)] leading-[1.02] text-balance"
              data-in="true"
              style={{ fontFamily: DISPLAY, color: INK }}
            >
              Alltaf sól{' '}
              <span className="block" style={{ color: GOLD }}>
                og sæla.
              </span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed" style={{ color: BODY }}>
              Nýjustu ljósabekkir frá Ergoline og KBL, sjálfvirkt spraytan og áskrift í ljós. Faxafen 10, Reykjavík.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <GoldCta href={NOONA} big>
                Bóka tíma
              </GoldCta>
              <a
                href="#verdskra"
                className="inline-flex items-center rounded-full border px-7 py-3.5 text-lg transition-colors duration-300 hover:bg-white/5"
                style={{ borderColor: `${INK}3d`, color: INK, fontFamily: SANS_MED }}
              >
                Sjá verðskrá
              </a>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px" style={{ background: HAIR }} />
      </section>

      {/* ── Fact band — the honest reopening story in three beats ───────── */}
      <section className="relative">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-y-8 px-5 py-16 sm:grid-cols-3 md:px-8 md:py-20">
          {FACTS.map((f, i) => (
            <Reveal key={f.big} delay={i * 90} className="flex flex-col items-start gap-2 sm:items-center sm:text-center">
              <span className="text-3xl md:text-4xl" style={{ fontFamily: DISPLAY, color: GOLD_SOFT }}>
                {f.big}
              </span>
              <span className="max-w-[22ch] text-sm leading-snug" style={{ color: BODY }}>
                {f.small}
              </span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Bekkirnir — the two machines, told like hardware ────────────── */}
      <section id="bekkirnir" className="relative scroll-mt-24" style={{ background: PANEL }}>
        <div className="mx-auto max-w-[1200px] px-5 py-24 md:px-8 md:py-36">
          <Reveal>
            <h2 className="max-w-3xl text-4xl leading-[1.04] tracking-[-0.02em] md:text-6xl" style={{ fontFamily: DISPLAY, color: INK }}>
              Bekkirnir okkar
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed">
              Tveir af fremstu ljósabekkjum heims standa í Faxafeninu, báðir glænýir og báðir með kælingu.
            </p>
          </Reveal>
          <div className="mt-14 flex flex-col gap-20 md:gap-28">
            {BEDS.map((bed, i) => (
              <div key={bed.id} className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
                <Reveal className={i % 2 ? 'md:order-2' : ''}>
                  {/* double bezel photo frame */}
                  <div className="sn-imgwrap rounded-[24px] border p-1.5" style={{ background: `${INK}0a`, borderColor: HAIR }}>
                    <div className="overflow-hidden rounded-[18px]">
                      <img src={bed.image} alt={bed.alt} loading="lazy" className="sn-img aspect-[4/3] w-full object-cover" />
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={120} className={i % 2 ? 'md:order-1' : ''}>
                  <p className="text-sm" style={{ color: GOLD_SOFT, fontFamily: SANS_BOLD }}>
                    {bed.claim}
                  </p>
                  <h3 className="mt-3 text-3xl leading-tight tracking-[-0.01em] md:text-4xl" style={{ fontFamily: DISPLAY, color: INK }}>
                    {bed.name}
                  </h3>
                  <p className="mt-4 max-w-lg leading-relaxed">{bed.body}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {bed.specs.map((s) => (
                      <li key={s} className="rounded-full border px-3.5 py-1.5 text-sm" style={{ borderColor: HAIR, color: INK, fontFamily: SANS_MED }}>
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

      {/* ── Verðskrá — one designed price list instead of a photo of one ── */}
      <section id="verdskra" className="relative scroll-mt-24">
        <div className="mx-auto max-w-[1200px] px-5 py-24 md:px-8 md:py-36">
          <Reveal>
            <h2 className="text-4xl leading-[1.04] tracking-[-0.02em] md:text-6xl" style={{ fontFamily: DISPLAY, color: INK }}>
              Verðskrá
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed">
              Morgunverð gildir frá 10 til 14 og dagverð frá 14 til 23.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-10 inline-flex flex-wrap gap-1 rounded-full border p-1" style={{ borderColor: HAIR, background: PANEL }} role="group" aria-label="Verðflokkar">
              {(
                [
                  ['day', 'Dagverð'],
                  ['morning', 'Morgunverð'],
                  ['k11', 'K11 Air Loft'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  aria-pressed={tab === id}
                  className="rounded-full px-5 py-3 text-sm transition-all duration-300 active:scale-[0.97]"
                  style={
                    tab === id
                      ? { background: GOLD, color: GROUND, fontFamily: SANS_BOLD }
                      : { color: INK, fontFamily: SANS_MED }
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </Reveal>

          {tab !== 'k11' ? (
            <div key={tab} className="sn-tick mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
              <div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {TIMES.map((row) => (
                    <div key={row.label + row.minutes} className="sn-float flex items-baseline justify-between gap-4 rounded-[18px] border px-5 py-4" style={{ borderColor: HAIR, background: CARD }}>
                      <div>
                        <p className="text-base" style={{ color: INK, fontFamily: SANS_MED }}>
                          {row.label}
                        </p>
                        <p className="text-sm" style={{ color: GOLD_SOFT }}>
                          {row.minutes}
                        </p>
                      </div>
                      <p className="text-xl whitespace-nowrap" style={{ fontFamily: DISPLAY, color: INK }}>
                        {isk(tab === 'day' ? row.day : row.morning)}
                      </p>
                    </div>
                  ))}
                  <div className="flex items-baseline justify-between gap-4 rounded-[18px] border border-dashed px-5 py-4" style={{ borderColor: `${GOLD}47` }}>
                    <p className="text-base" style={{ color: INK, fontFamily: SANS_MED }}>
                      Öryrkjar
                    </p>
                    <p className="text-xl whitespace-nowrap" style={{ fontFamily: DISPLAY, color: GOLD_SOFT }}>
                      10% afsláttur
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-lg" style={{ color: INK, fontFamily: SANS_BOLD }}>
                  Tímakort
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  {CARDS.map((c) => (
                    <div key={c.label} className="flex items-baseline justify-between rounded-[18px] border px-5 py-4" style={{ borderColor: HAIR }}>
                      <p style={{ color: INK, fontFamily: SANS_MED }}>{c.label}</p>
                      <p className="text-xl" style={{ fontFamily: DISPLAY, color: GOLD_SOFT }}>
                        {isk(tab === 'day' ? c.day : c.morning)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <GoldCta href={NOONA}>Bóka tíma</GoldCta>
                </div>
              </div>
            </div>
          ) : (
            <div key="k11" className="sn-tick mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
              <div className="grid gap-2">
                {K11_PRICES.map((row) => (
                  <div key={row.label} className="sn-float flex items-baseline justify-between gap-4 rounded-[18px] border px-5 py-4" style={{ borderColor: HAIR, background: CARD }}>
                    <div>
                      <p className="text-base" style={{ color: INK, fontFamily: SANS_MED }}>
                        {row.label}
                      </p>
                      <p className="text-sm" style={{ color: GOLD_SOFT }}>
                        {row.minutes} · FULL LED
                      </p>
                    </div>
                    <p className="text-xl whitespace-nowrap" style={{ fontFamily: DISPLAY, color: INK }}>
                      {isk(row.price)}
                    </p>
                  </div>
                ))}
              </div>
              <div>
                <p className="max-w-sm leading-relaxed">
                  Flottasti ljósabekkur í heimi, með Capri, Hawaii og Hamptons stillingunum. Verðin hér gilda um FULL LED tímana í K11.
                </p>
                <div className="mt-6">
                  <GoldCta href={NOONA}>Bóka tíma</GoldCta>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Áskrift — two plans, terms stated up front ───────────────────── */}
      <section id="askrift" className="relative scroll-mt-24" style={{ background: PANEL }}>
        <div className="mx-auto max-w-[1200px] px-5 py-24 md:px-8 md:py-36">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
            <Reveal>
              <h2 className="text-4xl leading-[1.04] tracking-[-0.02em] md:text-6xl" style={{ fontFamily: DISPLAY, color: INK }}>
                Áskrift í ljós
              </h2>
              <p className="mt-4 max-w-md text-lg leading-relaxed">
                Eitt fast verð á mánuði og þú getur komið einu sinni á dag, allt árið um kring.
              </p>
              <ul className="mt-8 flex flex-col gap-3">
                {PLAN_TERMS.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-base leading-snug">
                    <span aria-hidden="true" className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full" style={{ background: `${GOLD}26`, color: GOLD_SOFT }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span style={{ color: INK }}>{t}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-relaxed" style={{ color: BODY }}>
                Áskriftinni er stjórnað í{' '}
                <a href={REPEAT_PORTAL} target="_blank" rel="noreferrer" className="underline underline-offset-2 transition-colors duration-300 hover:text-[#FFD97A]" style={{ color: INK }}>
                  vefgátt Repeat
                </a>
                , þar segirðu líka upp.
              </p>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {PLANS.map((p, i) => (
                <Reveal key={p.id} delay={i * 110}>
                  {/* double bezel plan card */}
                  <div className="rounded-[24px] border p-1.5" style={{ background: `${INK}0a`, borderColor: HAIR }}>
                    <div className="flex h-full flex-col rounded-[18px] px-6 py-7" style={{ background: CARD }}>
                      <p className="text-sm" style={{ color: GOLD_SOFT, fontFamily: SANS_BOLD }}>
                        {p.binding}
                      </p>
                      <p className="mt-4 text-4xl" style={{ fontFamily: DISPLAY, color: INK }}>
                        {isk(p.price)}
                      </p>
                      <p className="text-sm" style={{ color: BODY }}>
                        á mánuði
                      </p>
                      <p className="mt-4 flex-1 text-base leading-relaxed" style={{ color: BODY }}>
                        {p.pitch}
                      </p>
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-6 inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm transition-colors duration-300 hover:bg-white/5 active:scale-[0.98]"
                        style={{ borderColor: `${GOLD}59`, color: GOLD_SOFT, fontFamily: SANS_BOLD }}
                      >
                        Koma í áskrift
                      </a>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Spraytan.is — the sub-brand chapter, bronze light ───────────── */}
      <section id="spraytan" className="relative scroll-mt-24 overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0" style={{ background: `radial-gradient(120% 90% at 85% 0%, ${BRONZE}40, transparent 55%)` }} />
        <div className="relative mx-auto max-w-[1200px] px-5 py-24 md:px-8 md:py-36">
          <Reveal>
            <p className="text-xs tracking-[0.18em] uppercase" style={{ color: GOLD_SOFT, fontFamily: SANS_BOLD }}>
              Spraytan.is
            </p>
            <h2 className="mt-3 max-w-3xl text-4xl leading-[1.04] tracking-[-0.02em] md:text-6xl" style={{ fontFamily: DISPLAY, color: INK }}>
              {SPRAY.claim}
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed">{SPRAY.intro}</p>
          </Reveal>

          <Reveal delay={110}>
            <div className="sn-snap mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
              {SPRAY.solutions.map((s) => (
                <div key={s.name} className="sn-float w-[260px] shrink-0 snap-start rounded-[18px] border px-6 py-7 sm:w-[290px] lg:w-auto" style={{ borderColor: HAIR, background: CARD }}>
                  <span aria-hidden="true" className="block h-12 w-12 rounded-full" style={{ background: `radial-gradient(circle at 38% 32%, ${s.tone}, #1c1006)`, boxShadow: `0 8px 24px -8px ${s.tone}99` }} />
                  <p className="mt-5 text-2xl" style={{ fontFamily: DISPLAY, color: INK }}>
                    {s.name}
                  </p>
                  <p className="mt-2 text-base leading-relaxed" style={{ color: BODY }}>
                    {s.line}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm" style={{ color: BODY }}>
              {SPRAY.levels}.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {SPRAY.prices.map((p, i) => (
              <Reveal key={p.label} delay={i * 90}>
                <div className="flex h-full flex-col justify-between rounded-[18px] border px-6 py-6" style={{ borderColor: HAIR }}>
                  <p className="text-base leading-snug" style={{ color: INK, fontFamily: SANS_MED }}>
                    {p.label}
                  </p>
                  <p className="mt-3 text-2xl" style={{ fontFamily: DISPLAY, color: GOLD_SOFT }}>
                    {isk(p.price)}
                  </p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={180}>
              <div className="flex h-full flex-col justify-between rounded-[18px] border px-6 py-6" style={{ borderColor: `${GOLD}59`, background: `${GOLD}0d` }}>
                <div className="flex flex-col gap-2">
                  {SPRAY.cards.map((c) => (
                    <p key={c.label} className="flex items-baseline justify-between gap-3 text-base" style={{ color: INK, fontFamily: SANS_MED }}>
                      <span>
                        {c.label} <span style={{ color: GOLD_SOFT }}>({c.discount})</span>
                      </span>
                      <span style={{ fontFamily: DISPLAY }}>{isk(c.price)}</span>
                    </p>
                  ))}
                </div>
                <p className="mt-3 text-sm" style={{ color: BODY }}>
                  {SPRAY.cardsNote}.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="mt-10">
              <GoldCta href={NOONA} big>
                Bóka tíma
              </GoldCta>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Vörur + húðin — retail brands and honest guidance in one band ── */}
      <section className="relative" style={{ background: PANEL }}>
        <div className="mx-auto max-w-[1200px] px-5 py-24 md:px-8 md:py-36">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
            <Reveal>
              <h2 className="text-3xl leading-[1.06] tracking-[-0.01em] md:text-5xl" style={{ fontFamily: DISPLAY, color: INK }}>
                {PRODUCTS.headline}
              </h2>
              <p className="mt-4 max-w-lg text-lg leading-relaxed">{PRODUCTS.body}</p>
            </Reveal>
            <Reveal delay={120}>
              <div className="grid grid-cols-2 gap-3">
                {[IMG.products7suns, IMG.products7suns2].map((src, i) => (
                  <div
                    key={src}
                    className={`sn-imgwrap overflow-hidden rounded-[18px] border ${i ? 'mt-8 md:rotate-2' : 'md:-rotate-2'}`}
                    style={{ borderColor: HAIR }}
                  >
                    <img
                      src={src}
                      alt={i ? 'Ljós 7Suns brúnkukrem í Sælunni' : 'Dökk 7Suns brúnkukrem í Sælunni'}
                      loading="lazy"
                      className="sn-img aspect-[4/5] w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="mt-24 md:mt-32">
            <Reveal>
              <h2 className="text-3xl leading-[1.06] tracking-[-0.01em] md:text-5xl" style={{ fontFamily: DISPLAY, color: INK }}>
                Húðin þín ræður tímanum
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed">
                Ráðlagður tími er viðmið, byrjaðu á styttri tíma og finndu þinn takt.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {SKIN_TYPES.map((s, i) => (
                <Reveal key={s.skin} delay={i * 80}>
                  <div className="flex h-full flex-col rounded-[18px] border px-5 py-5" style={{ borderColor: HAIR, background: CARD }}>
                    <p className="text-2xl" style={{ fontFamily: DISPLAY, color: GOLD_SOFT }}>
                      {s.minutes}
                    </p>
                    <p className="mt-2 text-base leading-snug" style={{ color: INK, fontFamily: SANS_MED }}>
                      {s.skin}
                    </p>
                    <p className="mt-1 text-sm" style={{ color: BODY }}>
                      {s.hair}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={120}>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed" style={{ color: BODY }}>
                {SAFETY.join('. ')}. Útfjólublá geislun getur skaðað augu og húð og ákveðin lyf og snyrtivörur geta aukið ljósnæmi.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Sagan + staðurinn — storefront, address, final CTA ──────────── */}
      <section id="stadurinn" className="relative overflow-hidden">
        <div className="mx-auto max-w-[1200px] px-5 py-24 md:px-8 md:py-36">
          <div className="grid items-center gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16">
            <Reveal>
              <div className="sn-imgwrap rounded-[24px] border p-1.5" style={{ background: `${INK}0a`, borderColor: HAIR }}>
                <div className="overflow-hidden rounded-[18px]">
                  <img src={IMG.storefront} alt="Skilti Sælunnar í glugganum í Faxafeni 10" loading="lazy" className="sn-img aspect-[4/5] w-full object-cover" />
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <img src={IMG.logo} alt="Upprunalega Sælan merkið, gul sól og pýramídi" loading="lazy" className="h-24 w-auto md:h-28" />
              <h2 className="mt-6 text-3xl leading-[1.06] md:text-5xl text-balance" style={{ fontFamily: DISPLAY, color: INK }}>
                {STORY.headline}
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed">{STORY.body}</p>
              <div className="mt-8 flex flex-col gap-1.5 text-lg" style={{ color: INK, fontFamily: SANS_MED }}>
                <a href={MAPS} target="_blank" rel="noreferrer" className="w-fit underline-offset-4 transition-colors duration-300 hover:text-[#FFD97A] hover:underline">
                  {ADDRESS.street}, {ADDRESS.town}
                </a>
                <p style={{ color: BODY, fontFamily: SANS }}>{ADDRESS.hours}</p>
                <a href={PHONE_HREF} className="w-fit transition-colors duration-300 hover:text-[#FFD97A]">
                  s. {PHONE_DISPLAY}
                </a>
                <a href={`mailto:${EMAIL}`} className="w-fit transition-colors duration-300 hover:text-[#FFD97A]">
                  {EMAIL}
                </a>
              </div>
              <div className="mt-9">
                <GoldCta href={NOONA} big>
                  Bóka tíma
                </GoldCta>
              </div>
            </Reveal>
          </div>
        </div>

        {/* site footer strip */}
        <div className="border-t" style={{ borderColor: HAIR }}>
          <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-4 px-5 py-8 text-sm sm:flex-row sm:items-center md:px-8">
            <p style={{ fontFamily: DISPLAY, color: INK }}>Sælan</p>
            <div className="flex flex-wrap gap-5" style={{ fontFamily: SANS_MED }}>
              <a href={REPEAT_PORTAL} target="_blank" rel="noreferrer" className="transition-colors duration-300 hover:text-[#FFD97A]" style={{ color: BODY }}>
                Mín áskrift
              </a>
              <a href={SOCIAL.facebook} target="_blank" rel="noreferrer" className="transition-colors duration-300 hover:text-[#FFD97A]" style={{ color: BODY }}>
                Facebook
              </a>
              <a href={SOCIAL.instagram} target="_blank" rel="noreferrer" className="transition-colors duration-300 hover:text-[#FFD97A]" style={{ color: BODY }}>
                Instagram
              </a>
              <a href={SOCIAL.instagramSpray} target="_blank" rel="noreferrer" className="transition-colors duration-300 hover:text-[#FFD97A]" style={{ color: BODY }}>
                Spraytan.is
              </a>
            </div>
          </div>
        </div>
      </section>

      <PreviewFooter company={company} />

      {/* ── Mobile sticky CTA ───────────────────────────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t p-3 md:hidden" style={{ background: `${GROUND}f0`, borderColor: HAIR, backdropFilter: 'blur(10px)' }}>
        <a href={NOONA} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center rounded-full px-5 py-3 text-sm" style={{ background: GOLD, color: GROUND, fontFamily: SANS_BOLD }}>
          Bóka tíma
        </a>
        <a href={PHONE_HREF} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border" style={{ borderColor: HAIR, color: INK }} aria-label="Hringja í Sæluna">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </a>
      </div>

      <PreviewChrome company={company} />
    </div>
  )
}
