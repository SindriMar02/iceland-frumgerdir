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

/* ── UV-fresh studio — light, soft and glowing. Off-white ground, one warm
      coral accent, UV gradient orbs as the light source. Rounded geometry,
      soft tinted shadows, one deep violet plate for Spraytan.is. ── */
const BG = '#FAF9F6' // soft off-white ground
const SURF = '#FFFFFF' // card surface
const INK = '#26212E' // cool plum-ink text
const BODY = '#5C5566' // secondary text (AA on BG and SURF)
const CORAL = '#F26B3A' // the accent: warm sun coral (interactive)
const SUNY = '#FFC93F' // sun yellow, the toggle orb + orb gradients
const UVPINK = '#FF7BC1' // decorative orb stop only
const UVBLUE = '#7FA6FF' // decorative orb stop only
const PLATE = '#262038' // the single deep plate (Spraytan chapter)
const PLATE_INK = '#F1EDFA' // ink on the dark plate

const BASE = import.meta.env.BASE_URL
const DISPLAY = "'Zina-Regular', 'CabinetGrotesk-Bold', sans-serif"
const SANS = "'CabinetGrotesk-Regular', system-ui, sans-serif"
const SANS_MED = "'CabinetGrotesk-Medium', system-ui, sans-serif"
const SANS_BOLD = "'CabinetGrotesk-Bold', system-ui, sans-serif"
const MONO = "'Space Mono', monospace"

const CARD_SHADOW = '0 16px 36px -18px rgba(38,33,46,0.28)'
const isk = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

/* ── IO reveal — a soft float-up; failsafe timer means nothing sticks ──── */
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

/* ── Soft button — rounded, coral, gentle lift on hover ────────────────── */
function Soft({ href, children, onPlate = false }: { href: string; children: ReactNode; onPlate?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="sn-soft inline-flex items-center rounded-full px-7 py-3.5 text-base"
      style={{
        background: onPlate ? PLATE_INK : CORAL,
        color: onPlate ? PLATE : INK,
        boxShadow: onPlate ? 'none' : '0 12px 26px -12px rgba(242,107,58,0.65)',
        fontFamily: SANS_BOLD,
      }}
    >
      {children}
    </a>
  )
}

/* ── Morning or day — soft segmented control; the sun glides above ─────── */
function SunToggle({ morning, setMorning }: { morning: boolean; setMorning: (m: boolean) => void }) {
  return (
    <div className="relative inline-block pt-14" role="group" aria-label="Verðflokkur eftir tíma dags">
      <div
        className="sn-sunhop pointer-events-none absolute top-0 h-12 w-12 rounded-full"
        style={{
          left: morning ? 'calc(25% - 1.5rem)' : 'calc(75% - 1.5rem)',
          background: `radial-gradient(circle at 38% 32%, #FFE9A8, ${SUNY} 58%, ${CORAL})`,
          boxShadow: '0 10px 22px -8px rgba(242,107,58,0.75)',
        }}
        aria-hidden="true"
      />
      <div className="flex rounded-full p-1.5" style={{ background: SURF, border: `1px solid ${INK}14`, boxShadow: CARD_SHADOW }}>
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
              className="sn-toggle rounded-full px-6 py-3 text-left"
              style={{
                background: active ? CORAL : 'transparent',
                color: INK,
                fontFamily: SANS_BOLD,
              }}
            >
              <span className="block text-base">{label}</span>
              <span className="block text-xs" style={{ fontFamily: MONO, opacity: 0.75 }}>
                {hours}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── Price row — clean line with a soft divider ────────────────────────── */
function MenuRow({ label, sub, price }: { label: string; sub?: string; price: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b py-3.5" style={{ borderColor: `${INK}0f` }}>
      <span className="text-lg" style={{ fontFamily: SANS_MED, color: INK }}>
        {label}
        {sub ? (
          <span className="ml-2 text-sm" style={{ fontFamily: MONO, color: BODY }}>
            {sub}
          </span>
        ) : null}
      </span>
      <span className="shrink-0 text-lg whitespace-nowrap" style={{ fontFamily: MONO, color: INK }}>
        {price}
      </span>
    </div>
  )
}

/* ── Photo card — rounded, soft-shadowed ───────────────────────────────── */
function PhotoCard({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <figure className={`sn-imgwrap overflow-hidden rounded-[24px] ${className}`} style={{ border: `1px solid ${INK}14`, boxShadow: CARD_SHADOW }}>
      <img src={src} alt={alt} loading="lazy" className="sn-img block h-full w-full object-cover" />
    </figure>
  )
}

export default function SaelanPage() {
  const [morning, setMorning] = useState(true)
  const heroRef = useRef<HTMLElement>(null)

  // The bed rides the first ~viewport of scroll. Synchronous handler writing
  // one CSS var: rAF loops are throttled to death in headless/preview
  // renderers and framer batches on rAF, so this stays the reliable pattern.
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hero.style.setProperty('--p', '0')
      return
    }
    let range = 700
    const measure = () => {
      range = Math.max(320, Math.min(700, window.innerHeight * 0.85))
    }
    let last = ''
    const apply = () => {
      const v = Math.min(1, Math.max(0, window.scrollY / range)).toFixed(4)
      if (v === last) return
      last = v
      hero.style.setProperty('--p', v)
    }
    const onResize = () => {
      measure()
      last = ''
      apply()
    }
    measure()
    apply()
    window.addEventListener('scroll', apply, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', apply)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    setThemeColor(BG)
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
    <div className="sn-root min-h-screen overflow-x-hidden pb-[4.5rem] antialiased md:pb-0" style={{ background: BG, color: BODY, fontFamily: SANS }}>
      <link rel="stylesheet" href={`${BASE}fonts/zina/css/zina.css`} />
      <link rel="stylesheet" href={`${BASE}fonts/cabinet-grotesk/css/cabinet-grotesk.css`} />
      <script type="application/ld+json">{jsonLd}</script>

      <style>{`
        .sn-reveal{opacity:0;transform:translateY(16px);transition:opacity .6s ease,transform .6s cubic-bezier(0.22,1,0.36,1)}
        .sn-reveal[data-in="true"]{opacity:1;transform:none}
        .sn-soft{transition:transform .2s cubic-bezier(0.22,1,0.36,1),box-shadow .2s ease}
        .sn-soft:hover{transform:translateY(-2px)}
        .sn-soft:active{transform:translateY(0) scale(.97)}
        .sn-seal{transform:rotate(-8deg)}
        .sn-sunhop{transition:left .5s cubic-bezier(0.34,1.3,0.5,1)}
        .sn-toggle{transition:background .25s ease}
        .sn-punch{transition:background .25s ease,border-color .25s ease}
        .sn-card:hover .sn-punch{background:${CORAL};border-color:${CORAL}}
        .sn-img{transition:transform 1s cubic-bezier(0.22,1,0.36,1)}
        .sn-imgwrap:hover .sn-img{transform:scale(1.04)}
        .sn-bed{transform:translate3d(0,calc(var(--p,0)*-150px),0) scale(calc(1 + var(--p,0)*0.14)) rotate(calc(var(--p,0)*-4deg));will-change:transform}
        .sn-orb{transform:translate(-50%,-50%) translate3d(0,calc(var(--p,0)*90px),0)}
        .sn-root :focus-visible{outline:3px solid ${CORAL};outline-offset:3px}
        @media (prefers-reduced-motion: reduce){
          .sn-root *,.sn-root *::before,.sn-root *::after{transition-duration:.01ms!important;animation-duration:.01ms!important;animation-iteration-count:1!important}
          .sn-reveal{opacity:1;transform:none;transition:none}
          .sn-bed{transform:none}
          .sn-orb{transform:translate(-50%,-50%)}
        }
      `}</style>

      {/* ── Seamless header ─────────────────────────────────────────────── */}
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
          <Soft href={NOONA}>Bóka tíma</Soft>
        </div>
      </header>

      {/* ── HERO — just the bed, riding the scroll ──────────────────────── */}
      <section id="top" ref={heroRef} className="relative flex min-h-[100svh] flex-col overflow-hidden" style={{ '--p': 0 } as React.CSSProperties}>
        {/* UV light: two big soft gradient orbs, pure paint */}
        <div
          aria-hidden="true"
          className="absolute -top-40 right-[-15%] h-[42rem] w-[42rem] rounded-full"
          style={{ background: `radial-gradient(circle, ${UVPINK}33 0%, ${UVBLUE}24 45%, transparent 70%)` }}
        />
        <div
          aria-hidden="true"
          className="absolute bottom-[-20%] left-[-12%] h-[40rem] w-[40rem] rounded-full"
          style={{ background: `radial-gradient(circle, ${SUNY}40 0%, ${CORAL}1f 48%, transparent 72%)` }}
        />

        <div className="relative mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-5 pt-28 md:px-8">
          <h1 className="text-center text-[clamp(3rem,8vw,7rem)] leading-[1.02]" style={{ fontFamily: DISPLAY, color: INK }}>
            Gerðu þér <span style={{ color: CORAL }}>glaðan dag</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-center text-lg leading-snug md:text-xl" style={{ fontFamily: SANS_MED, color: INK }}>
            Alla daga. Nýjustu ljósabekkir frá Ergoline og KBL, sjálfvirkt spraytan og áskrift í ljós.
          </p>

          {/* the bed they actually run, lifting toward you as you scroll */}
          <div className="relative flex flex-1 items-center justify-center py-10">
            <span
              aria-hidden="true"
              className="sn-orb absolute top-1/2 left-1/2 h-[19rem] w-[19rem] rounded-full md:h-[27rem] md:w-[27rem]"
              style={{
                background: `radial-gradient(circle at 40% 32%, #FFE9A8, ${SUNY} 55%, ${CORAL})`,
                boxShadow: '0 30px 60px -30px rgba(242,107,58,0.5)',
              }}
            />
            <img
              src={IMG.bedPrestige}
              alt="Ergoline Prestige 1400 ljósabekkurinn"
              width={480}
              height={396}
              fetchPriority="high"
              className="sn-bed relative w-full max-w-[32rem]"
              style={{ filter: 'drop-shadow(0 26px 22px rgba(38,33,46,0.28))' }}
            />
          </div>
        </div>

        {/* a still UV tube closes the fold, no motion */}
        <div aria-hidden="true" className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${CORAL}, ${UVPINK} 55%, ${UVBLUE})` }} />
      </section>

      {/* ── Bekkirnir — two soft panels ─────────────────────────────────── */}
      <section id="bekkirnir" className="scroll-mt-20">
        <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-8 md:py-24">
          <Reveal>
            <h2 className="text-4xl leading-[1.02] md:text-6xl" style={{ fontFamily: DISPLAY, color: INK }}>
              Bekkirnir
            </h2>
          </Reveal>
          <div className="mt-12 flex flex-col gap-16 md:gap-24">
            {BEDS.map((bed, i) => (
              <div key={bed.id} className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
                <Reveal className={i % 2 ? 'md:order-2' : ''}>
                  <PhotoCard src={bed.image} alt={bed.alt} className="aspect-[4/3]" />
                </Reveal>
                <Reveal delay={100} className={i % 2 ? 'md:order-1' : ''}>
                  <p className="text-sm" style={{ fontFamily: SANS_BOLD, color: CORAL }}>
                    {bed.claim}
                  </p>
                  <h3 className="mt-2 text-3xl leading-tight md:text-4xl" style={{ fontFamily: DISPLAY, color: INK }}>
                    {bed.name}
                  </h3>
                  <p className="mt-4 max-w-lg text-lg leading-relaxed">{bed.body}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {bed.specs.map((s) => (
                      <li key={s} className="rounded-full px-4 py-2 text-sm" style={{ background: SURF, border: `1px solid ${INK}14`, color: INK, fontFamily: SANS_MED }}>
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

      {/* ── Verðskrá — the sun glides, the menu follows ─────────────────── */}
      <section id="verdskra" className="scroll-mt-20">
        <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-8 md:py-24">
          <Reveal>
            <h2 className="text-4xl leading-[1.02] md:text-6xl" style={{ fontFamily: DISPLAY, color: INK }}>
              Verðskrá
            </h2>
            <p className="mt-4 max-w-lg text-lg leading-snug" style={{ fontFamily: SANS_MED }}>
              Morgunverð gildir frá 10 til 14 og dagverð frá 14 til 23, sólin fylgir þér.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-10">
              <SunToggle morning={morning} setMorning={setMorning} />
            </div>
          </Reveal>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
            <div>
              <div className="flex items-baseline justify-between border-b pb-3" style={{ borderColor: `${INK}1f` }}>
                <p className="text-3xl md:text-4xl" style={{ fontFamily: DISPLAY, color: CORAL }} aria-live="polite">
                  {morning ? 'Morgunverð' : 'Dagverð'}
                </p>
                <p className="text-sm" style={{ fontFamily: MONO }}>
                  {morning ? 'kl. 10 til 14' : 'kl. 14 til 23'}
                </p>
              </div>
              <div className="mt-1">
                {TIMES.map((row) => (
                  <MenuRow key={row.label + row.minutes} label={row.label} sub={row.minutes} price={isk(morning ? row.morning : row.day)} />
                ))}
                <MenuRow label="Öryrkjar" price="10% afsláttur" />
              </div>
              <div className="mt-8">
                <Soft href={NOONA}>Bóka tíma</Soft>
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between border-b pb-3" style={{ borderColor: `${INK}1f` }}>
                <p className="text-3xl md:text-4xl" style={{ fontFamily: DISPLAY, color: INK }}>
                  K11 Air Loft
                </p>
                <p className="text-sm" style={{ fontFamily: MONO }}>
                  FULL LED
                </p>
              </div>
              <div className="mt-1">
                {K11_PRICES.map((row) => (
                  <MenuRow key={row.label} label={row.label} sub={row.minutes} price={isk(row.price)} />
                ))}
              </div>
              <p className="mt-6 max-w-sm text-base leading-relaxed">
                Flottasti ljósabekkur í heimi, með Capri, Hawaii og Hamptons stillingunum. Sama verð allan daginn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tímakort — punch cards, soft edition ────────────────────────── */}
      <section>
        <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-8 md:py-24">
          <Reveal>
            <h2 className="text-4xl leading-[1.02] md:text-6xl" style={{ fontFamily: DISPLAY, color: INK }}>
              Tímakort
            </h2>
            <p className="mt-4 max-w-md text-lg leading-snug" style={{ fontFamily: SANS_MED }}>
              Klippikort eins og þau eiga að vera. Morgunkortin eru ódýrari.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {CARDS.map((c, i) => {
              const punches = [5, 10, 15][i]
              return (
                <Reveal key={c.label} delay={i * 90}>
                  <div className="sn-card rounded-[24px] p-6" style={{ background: SURF, border: `1px solid ${INK}14`, boxShadow: CARD_SHADOW }}>
                    <div className="flex items-baseline justify-between">
                      <p className="text-2xl md:text-3xl" style={{ fontFamily: DISPLAY, color: INK }}>
                        {c.label}
                      </p>
                      <span className="text-xs tracking-[0.12em] uppercase" style={{ fontFamily: MONO, color: CORAL }}>
                        Sælan
                      </span>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2" aria-hidden="true">
                      {Array.from({ length: punches }, (_, p) => (
                        <span
                          key={p}
                          className="sn-punch inline-block h-5 w-5 rounded-full"
                          style={{ border: `2px solid ${INK}33`, transitionDelay: `${p * 45}ms` }}
                        />
                      ))}
                    </div>
                    <div className="mt-6 flex items-baseline justify-between border-t pt-4" style={{ borderColor: `${INK}0f` }}>
                      <span className="text-sm" style={{ fontFamily: MONO, color: INK }}>
                        dagur {isk(c.day)}
                      </span>
                      <span className="text-sm" style={{ fontFamily: MONO, color: CORAL }}>
                        morgunn {isk(c.morning)}
                      </span>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Áskrift — the membership, fine print up front ───────────────── */}
      <section id="askrift" className="scroll-mt-20">
        <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-8 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <Reveal>
              <h2 className="text-4xl leading-[1.02] md:text-6xl" style={{ fontFamily: DISPLAY, color: INK }}>
                Áskrift í ljós
              </h2>
              <p className="mt-4 max-w-md text-lg leading-snug" style={{ fontFamily: SANS_MED }}>
                Eitt fast verð á mánuði og þú getur komið einu sinni á dag, allt árið um kring.
              </p>
              <ul className="mt-8 flex max-w-md flex-col">
                {PLAN_TERMS.map((t) => (
                  <li key={t} className="border-b py-3 text-base leading-snug" style={{ borderColor: `${INK}0f`, color: INK }}>
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
            <div className="flex flex-col gap-6">
              {PLANS.map((p, i) => (
                <Reveal key={p.id} delay={i * 100}>
                  <div className="relative rounded-[24px] p-7" style={{ background: SURF, border: `1px solid ${INK}14`, boxShadow: CARD_SHADOW }}>
                    {i === 0 ? (
                      <span
                        aria-hidden="true"
                        className="sn-seal absolute -top-10 -right-3 z-10 grid h-24 w-24 place-items-center rounded-full text-center md:-top-12 md:-right-5 md:h-28 md:w-28"
                        style={{ background: CORAL, boxShadow: '0 14px 30px -12px rgba(242,107,58,0.7)' }}
                      >
                        <span className="px-3 text-[10px] leading-tight md:text-[11px]" style={{ fontFamily: SANS_BOLD, color: '#FFF6EF' }}>
                          Borgar sig frá 4. heimsókn
                        </span>
                      </span>
                    ) : null}
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <p className="text-4xl md:text-5xl" style={{ fontFamily: DISPLAY, color: CORAL }}>
                        {isk(p.price)}
                      </p>
                      <p className="text-sm" style={{ fontFamily: MONO, color: BODY }}>
                        á mánuði
                      </p>
                    </div>
                    <p className="mt-2 text-base" style={{ fontFamily: SANS_BOLD, color: INK }}>
                      {p.binding}
                    </p>
                    <p className="mt-2 max-w-md text-base leading-relaxed">{p.pitch}</p>
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                      <Soft href={p.href}>Koma í áskrift</Soft>
                      {i === 0 ? (
                        <span className="text-[11px]" style={{ fontFamily: MONO, color: BODY }}>
                          m.v. stakan tíma á 2.590 kr.
                        </span>
                      ) : null}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Spraytan.is — the one deep plate, UV violet ─────────────────── */}
      <section id="spraytan" className="scroll-mt-20 overflow-hidden" style={{ background: PLATE, color: PLATE_INK }}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute h-0 w-0"
        />
        <div className="relative mx-auto max-w-[1280px] px-5 py-16 md:px-8 md:py-24">
          <Reveal>
            <p className="text-sm tracking-[0.1em] uppercase" style={{ fontFamily: MONO, color: UVPINK }}>
              Spraytan.is
            </p>
            <h2 className="mt-3 max-w-3xl text-4xl leading-[1.02] md:text-6xl" style={{ fontFamily: DISPLAY, color: PLATE_INK }}>
              {SPRAY.claim}
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed" style={{ color: `${PLATE_INK}d1` }}>
              {SPRAY.intro}
            </p>
          </Reveal>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
            <Reveal delay={80}>
              <ul className="flex flex-col">
                {SPRAY.solutions.map((s) => (
                  <li key={s.name} className="flex items-center gap-5 border-b py-4" style={{ borderColor: `${PLATE_INK}1f` }}>
                    <span aria-hidden="true" className="h-10 w-10 shrink-0 rounded-full" style={{ background: s.tone, boxShadow: `0 8px 18px -8px ${s.tone}` }} />
                    <div>
                      <p className="text-2xl" style={{ fontFamily: DISPLAY, color: PLATE_INK }}>
                        {s.name}
                      </p>
                      <p className="text-base leading-snug" style={{ color: `${PLATE_INK}b8` }}>
                        {s.line}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm" style={{ fontFamily: MONO, color: `${PLATE_INK}99` }}>
                {SPRAY.levels}.
              </p>
            </Reveal>

            <Reveal delay={140}>
              <div>
                {SPRAY.prices.map((p) => (
                  <div key={p.label} className="flex items-baseline justify-between gap-4 border-b py-3.5" style={{ borderColor: `${PLATE_INK}1f` }}>
                    <span className="text-lg" style={{ fontFamily: SANS_MED, color: PLATE_INK }}>
                      {p.label}
                    </span>
                    <span className="shrink-0 text-lg whitespace-nowrap" style={{ fontFamily: MONO, color: UVPINK }}>
                      {isk(p.price)}
                    </span>
                  </div>
                ))}
                {SPRAY.cards.map((c) => (
                  <div key={c.label} className="flex items-baseline justify-between gap-4 border-b py-3.5" style={{ borderColor: `${PLATE_INK}1f` }}>
                    <span className="text-lg" style={{ fontFamily: SANS_MED, color: PLATE_INK }}>
                      {c.label} <span style={{ fontFamily: MONO, fontSize: '0.8em', color: `${PLATE_INK}99` }}>({c.discount})</span>
                    </span>
                    <span className="shrink-0 text-lg whitespace-nowrap" style={{ fontFamily: MONO, color: UVPINK }}>
                      {isk(c.price)}
                    </span>
                  </div>
                ))}
                <p className="mt-3 text-sm" style={{ color: `${PLATE_INK}99` }}>
                  {SPRAY.cardsNote}.
                </p>
                <div className="mt-8">
                  <Soft href={NOONA} onPlate>
                    Bóka tíma
                  </Soft>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Vörur + húðin — goods and the honest chart ──────────────────── */}
      <section>
        <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-8 md:py-24">
          <div className="grid items-center gap-12 md:grid-cols-[1fr_1.1fr] md:gap-16">
            <Reveal>
              <h2 className="text-3xl leading-[1.05] md:text-5xl" style={{ fontFamily: DISPLAY, color: INK }}>
                {PRODUCTS.headline}
              </h2>
              <p className="mt-4 max-w-lg text-lg leading-relaxed">{PRODUCTS.body}</p>
            </Reveal>
            <Reveal delay={100}>
              <div className="grid grid-cols-2 gap-6">
                <PhotoCard src={IMG.products7suns} alt="Dökk 7Suns brúnkukrem í Sælunni" className="aspect-[4/5]" />
                <PhotoCard src={IMG.products7suns2} alt="Ljós 7Suns brúnkukrem í Sælunni" className="mt-10 aspect-[4/5]" />
              </div>
            </Reveal>
          </div>

          <div className="mt-20 md:mt-28">
            <Reveal>
              <h2 className="text-3xl leading-[1.05] md:text-5xl" style={{ fontFamily: DISPLAY, color: INK }}>
                Húðin þín ræður tímanum
              </h2>
              <p className="mt-4 max-w-lg text-lg leading-snug" style={{ fontFamily: SANS_MED }}>
                Ráðlagður tími er viðmið, byrjaðu á styttri tíma og finndu þinn takt.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <div className="mt-8">
                {SKIN_TYPES.map((s) => (
                  <div key={s.skin} className="grid items-baseline gap-1 border-b py-4 sm:grid-cols-[1fr_auto]" style={{ borderColor: `${INK}0f` }}>
                    <p className="text-lg" style={{ fontFamily: SANS_MED, color: INK }}>
                      {s.skin} <span className="text-base" style={{ fontFamily: SANS, color: BODY }}>({s.hair.toLowerCase()})</span>
                    </p>
                    <p className="text-xl sm:text-right" style={{ fontFamily: DISPLAY, color: CORAL }}>
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

      {/* ── Sagan + staðurinn ───────────────────────────────────────────── */}
      <section id="stadurinn" className="relative">
        <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-8 md:py-24">
          <div className="grid items-center gap-12 md:grid-cols-[1fr_1.15fr] md:gap-16">
            <Reveal>
              <PhotoCard src={IMG.storefront} alt="Skilti Sælunnar í glugganum í Faxafeni 10" className="aspect-[4/5]" />
            </Reveal>
            <Reveal delay={100}>
              <h2 className="max-w-xl text-3xl leading-[1.05] md:text-5xl" style={{ fontFamily: DISPLAY, color: INK }}>
                {STORY.headline}
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed">{STORY.body}</p>

              {/* the story in three beats */}
              <div className="mt-8 max-w-xl">
                {FACTS.map((f, i) => (
                  <div key={f.big} className="relative flex gap-5 pb-7 last:pb-0">
                    {i < FACTS.length - 1 ? (
                      <span aria-hidden="true" className="absolute top-4 left-[5px] h-full w-0.5" style={{ background: `${INK}14` }} />
                    ) : null}
                    <span aria-hidden="true" className="relative mt-2 h-3 w-3 shrink-0 rounded-full" style={{ background: i === 1 ? CORAL : `${INK}33` }} />
                    <div>
                      <p className="text-2xl leading-tight" style={{ fontFamily: DISPLAY, color: i === 1 ? CORAL : INK }}>
                        {f.big}
                      </p>
                      <p className="text-base" style={{ fontFamily: SANS_MED }}>
                        {f.small}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 max-w-md">
                <a href={MAPS} target="_blank" rel="noreferrer" className="flex items-baseline justify-between border-b py-3 underline-offset-4 hover:underline" style={{ borderColor: `${INK}0f`, color: INK, fontFamily: SANS_MED }}>
                  <span>{ADDRESS.street}</span>
                  <span style={{ fontFamily: MONO, fontSize: '0.9rem', color: BODY }}>{ADDRESS.town}</span>
                </a>
                <div className="flex items-baseline justify-between border-b py-3" style={{ borderColor: `${INK}0f`, fontFamily: SANS_MED, color: INK }}>
                  <span>Opið</span>
                  <span style={{ fontFamily: MONO, fontSize: '0.9rem', color: BODY }}>til 23:00</span>
                </div>
                <a href={PHONE_HREF} className="flex items-baseline justify-between border-b py-3 underline-offset-4 hover:underline" style={{ borderColor: `${INK}0f`, color: INK, fontFamily: SANS_MED }}>
                  <span>Sími</span>
                  <span style={{ fontFamily: MONO, fontSize: '0.9rem', color: BODY }}>{PHONE_DISPLAY}</span>
                </a>
                <a href={`mailto:${EMAIL}`} className="flex items-baseline justify-between border-b py-3 underline-offset-4 hover:underline" style={{ borderColor: `${INK}0f`, color: INK, fontFamily: SANS_MED }}>
                  <span>Netfang</span>
                  <span style={{ fontFamily: MONO, fontSize: '0.9rem', color: BODY }}>{EMAIL}</span>
                </a>
              </div>
              <div className="mt-9">
                <Soft href={NOONA}>Bóka tíma</Soft>
              </div>
            </Reveal>
          </div>
        </div>

        {/* colophon */}
        <div className="border-t" style={{ borderColor: `${INK}14` }}>
          <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-4 px-5 py-7 text-sm sm:flex-row sm:items-center md:px-8">
            <img src={IMG.logo} alt="Sólbaðsstofan Sælan" width={512} height={512} className="h-12 w-auto" />
            <div className="flex flex-wrap gap-6" style={{ fontFamily: MONO }}>
              <a href={REPEAT_PORTAL} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline" style={{ color: BODY }}>
                Mín áskrift
              </a>
              <a href={SOCIAL.facebook} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline" style={{ color: BODY }}>
                Facebook
              </a>
              <a href={SOCIAL.instagram} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline" style={{ color: BODY }}>
                Instagram
              </a>
              <a href={SOCIAL.instagramSpray} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline" style={{ color: BODY }}>
                Spraytan.is
              </a>
            </div>
          </div>
        </div>
      </section>

      <PreviewFooter company={company} />

      {/* ── Mobile sticky CTA ───────────────────────────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t p-3 md:hidden" style={{ background: `${BG}f2`, borderColor: `${INK}14`, backdropFilter: 'blur(10px)' }}>
        <a
          href={NOONA}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 items-center justify-center rounded-full px-5 py-3.5 text-sm"
          style={{ background: CORAL, color: INK, fontFamily: SANS_BOLD }}
        >
          Bóka tíma
        </a>
        <a href={PHONE_HREF} className="grid h-12 w-12 shrink-0 place-items-center rounded-full" style={{ background: SURF, border: `1px solid ${INK}14`, color: INK }} aria-label="Hringja í Sæluna">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </a>
      </div>

      <PreviewChrome company={company} />
    </div>
  )
}
