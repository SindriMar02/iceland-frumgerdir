import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  BEDS,
  CREAM_PRICE,
  CREAMS,
  EMAIL,
  FAQ,
  FRELSI,
  INFRARED_PRICES,
  LOCATIONS,
  NOONA,
  PHONE_DISPLAY,
  PHONE_HREF,
  PLANS,
  PRICE_GROUPS,
  TRUST,
  WEEKEND_OFFER,
} from './data'

const company = getPreviewCompany('sportsol')

/* ── Palette — Sunhouse: sun-white, deep plum ink, the brand pink, and a
      dawn-to-dusk gradient reserved for the sky and the infrared chapter ── */
const SUNWHITE = '#FFF8EE' // warm light ground
const CARD = '#FFFDF7' // inner card surface
const INK = '#301031' // deep plum ink — text on light (ties to the pink brand)
const BODY = '#5C4260' // plum-grey body text (AA on sun-white)
const PINK = '#F810F0' // the logo's neon fuchsia — large/decorative only (3.1:1)
const PINK_TX = '#A6009F' // fuchsia as small text on light (6.4:1)
const PINK_DEEP = '#B500AE' // fuchsia button fill behind white text (5.9:1)
const GOLD = '#FFB53C' // sun gradient stop (decorative only)
const CORAL = '#FF7752' // sun gradient stop (decorative only)
const DUSK = '#170623' // UV room — hero, infrared chapter, final band
const UVROOM = '#12051C' // deepest room shade behind the tubes
const HAIR = '#30103122' // hairline on light

const BASE = import.meta.env.BASE_URL
const DISPLAY = "'CabinetGrotesk-Extrabold', system-ui, sans-serif"
const DISPLAY_BOLD = "'CabinetGrotesk-Bold', system-ui, sans-serif"
const SANS = "'CabinetGrotesk-Regular', system-ui, sans-serif"
const SANS_MED = "'CabinetGrotesk-Medium', system-ui, sans-serif"
const SANS_BOLD = "'CabinetGrotesk-Bold', system-ui, sans-serif"

const isk = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

const LOGO = `${BASE}sportsol/logo.png`

/* 14 tubes: staggered ignition + individual hum cycles; tube 5 is the
   slightly faulty one that takes longest to strike */
const UV_TUBES = [
  { ignite: 0.2, hum: 9.1, humDelay: 3.2 },
  { ignite: 0.9, hum: 7.4, humDelay: 5.1 },
  { ignite: 0.5, hum: 11.3, humDelay: 2.4 },
  { ignite: 1.4, hum: 8.2, humDelay: 6.3 },
  { ignite: 0.7, hum: 10.6, humDelay: 4.7 },
  { ignite: 2.3, hum: 5.9, humDelay: 2.9 },
  { ignite: 0.35, hum: 9.8, humDelay: 7.2 },
  { ignite: 1.1, hum: 8.8, humDelay: 3.8 },
  { ignite: 0.6, hum: 12.1, humDelay: 5.6 },
  { ignite: 1.7, hum: 7.9, humDelay: 2.2 },
  { ignite: 0.45, hum: 10.2, humDelay: 6.8 },
  { ignite: 1.25, hum: 9.4, humDelay: 4.1 },
  { ignite: 0.85, hum: 8.5, humDelay: 3.5 },
  { ignite: 1.55, hum: 11.7, humDelay: 5.9 },
]

/* ── IO reveal — CSS owns the motion; a failsafe means nothing can stick ── */
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
    <div ref={ref} data-in={on} className={`ss-reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* ── Verðskrá — the day has two prices; a sun dial picks the column ────── */
function PriceBoard() {
  const [slot, setSlot] = useState<'morning' | 'day'>(() => (new Date().getHours() < 14 ? 'morning' : 'day'))
  const morning = slot === 'morning'
  return (
    <div>
      {/* time-of-day dial */}
      <div
        role="group"
        aria-label="Tími dags"
        className="relative mx-auto grid w-full max-w-md grid-cols-2 rounded-full p-1.5"
        style={{ background: '#30103114', border: `1px solid ${HAIR}` }}
      >
        <span
          aria-hidden="true"
          className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{
            background: `linear-gradient(120deg, ${GOLD}, ${CORAL})`,
            transform: morning ? 'translateX(0)' : 'translateX(100%)',
          }}
        />
        {(
          [
            ['morning', 'Fyrir kl. 14', 'Morgunverð'],
            ['day', 'Eftir kl. 14', 'Dagverð'],
          ] as const
        ).map(([id, label, sub]) => (
          <button
            key={id}
            aria-pressed={slot === id}
            onClick={() => setSlot(id)}
            className="relative z-10 rounded-full px-4 py-3 text-center transition-colors duration-300"
            style={{ color: INK }}
          >
            <span className="block text-sm" style={{ fontFamily: SANS_BOLD }}>
              {label}
            </span>
            <span className="block text-[0.72rem] transition-colors duration-300" style={{ fontFamily: SANS_MED, color: slot === id ? INK : BODY }}>
              {sub}
            </span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-center text-sm" style={{ color: BODY }}>
        Morgunverð gildir milli klukkan 10 og 14. Sami tími kostar þá um tuttugu prósentum minna.
      </p>

      {/* groups */}
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {PRICE_GROUPS.map((g, gi) => (
          <Reveal key={g.id} delay={gi * 70}>
            <div className="h-full rounded-[2rem] p-1.5" style={{ background: '#3010310a', border: `1px solid ${HAIR}` }}>
              <div
                className="flex h-full flex-col rounded-[calc(2rem-0.375rem)] p-6"
                style={{ background: CARD, boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.9), 0 20px 45px -30px rgba(48,16,49,0.35)' }}
              >
                <h3 className="text-lg leading-snug" style={{ fontFamily: SANS_BOLD, color: INK }}>
                  {g.name}
                </h3>
                {g.note ? (
                  <p className="mt-0.5 text-sm" style={{ color: PINK_TX, fontFamily: SANS_MED }}>
                    {g.note}
                  </p>
                ) : null}
                <dl className="mt-5 flex-1 space-y-3">
                  {g.rows.map((r) => (
                    <div key={r.minutes} className="flex items-baseline justify-between gap-3">
                      <dt className="text-sm" style={{ color: BODY }}>
                        {r.minutes}
                      </dt>
                      <dd
                        key={`${g.id}-${r.minutes}-${slot}`}
                        className="ss-tick text-lg tabular-nums"
                        style={{ fontFamily: SANS_BOLD, color: INK }}
                      >
                        {isk(morning ? r.morning : r.day)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-8 text-center">
        <a
          href={NOONA}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center rounded-full px-7 py-3.5 text-base text-white transition duration-300 hover:brightness-[1.06] active:scale-[0.98] active:duration-150"
          style={{ background: PINK_DEEP, fontFamily: SANS_BOLD }}
        >
          Bóka tíma
        </a>
      </div>

      {/* weekend + infrared strips */}
      <Reveal className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="rounded-[1.8rem] p-6" style={{ background: `linear-gradient(120deg, ${GOLD}26, ${CORAL}26)`, border: `1px solid ${HAIR}` }}>
          <p className="text-sm" style={{ fontFamily: SANS_BOLD, color: PINK_TX }}>
            {WEEKEND_OFFER.name}
          </p>
          <p className="mt-2 text-base" style={{ color: BODY }}>
            {WEEKEND_OFFER.detail}
          </p>
          <p className="mt-3 text-3xl" style={{ fontFamily: DISPLAY_BOLD, color: INK }}>
            {isk(WEEKEND_OFFER.price)}
          </p>
        </div>
        <div className="rounded-[1.8rem] p-6" style={{ background: DUSK, color: '#FFE9DD' }}>
          <p className="text-sm" style={{ fontFamily: SANS_BOLD, color: '#FF9E7A' }}>
            Infrared bekkurinn
          </p>
          <p className="mt-2 text-base" style={{ color: '#F3D8CF' }}>
            Sama verð frá opnun til lokunar og innifalið í áskrift.
          </p>
          <div className="mt-3 flex gap-6">
            {INFRARED_PRICES.map((r) => (
              <p key={r.minutes}>
                <span className="block text-sm" style={{ color: '#E9BFB2' }}>
                  {r.minutes}
                </span>
                <span className="text-2xl" style={{ fontFamily: DISPLAY_BOLD }}>
                  {isk(r.price)}
                </span>
              </p>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  )
}

/* ── FAQ accordion (native details, WAAPI-free) ────────────────────────── */
function Faq() {
  return (
    <div className="divide-y" style={{ borderColor: HAIR }}>
      {FAQ.map((f) => (
        <details key={f.q} className="ss-faq group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg" style={{ fontFamily: SANS_BOLD, color: INK }}>
            {f.q}
            <span
              aria-hidden="true"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-open:rotate-45"
              style={{ borderColor: HAIR, color: PINK_TX }}
            >
              +
            </span>
          </summary>
          <p className="mt-3 max-w-2xl leading-relaxed" style={{ color: BODY }}>
            {f.a}
          </p>
        </details>
      ))}
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────────────────── */
export default function SportsolPage() {
  useEffect(() => {
    document.title = 'Sportsól | Sólbaðsstofa í Kópavogi og Grafarvogi'
    setThemeColor(SUNWHITE)
    const prevLang = document.documentElement.lang
    document.documentElement.lang = 'is'
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const created = !meta
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    const prev = meta.content
    meta.content =
      'Sportsól rekur tvær sólbaðsstofur: Hamraborg í Kópavogi og Hverafold í Grafarvogi. Áskrift frá 299 kr. á dag og bókun á Noona.'
    return () => {
      if (created) meta?.remove()
      else if (meta) meta.content = prev
      document.documentElement.lang = prevLang
    }
  }, [])

  const jsonLd = useMemo(
    () =>
      JSON.stringify(
        LOCATIONS.map((l) => ({
          '@context': 'https://schema.org',
          '@type': 'TanningSalon',
          name: `Sportsól ${l.name}`,
          telephone: '+354 554 3799',
          email: EMAIL,
          url: 'https://sportsol.is',
          address: {
            '@type': 'PostalAddress',
            streetAddress: l.address,
            addressLocality: l.locality,
            postalCode: l.town.split(' ')[0],
            addressCountry: 'IS',
          },
          priceRange: '1490-9990 ISK',
        })),
      ),
    [],
  )

  return (
    <div className="ss-root min-h-screen overflow-x-hidden pb-[4.5rem] antialiased md:pb-0" style={{ background: SUNWHITE, color: BODY, fontFamily: SANS }}>
      <link rel="stylesheet" href={`${BASE}fonts/cabinet-grotesk/css/cabinet-grotesk.css`} />
      <script type="application/ld+json">{jsonLd}</script>

      <style>{`
        .ss-reveal{opacity:0;transform:translateY(18px);transition:opacity .8s ease,transform .8s cubic-bezier(0.32,0.72,0,1)}
        .ss-reveal[data-in="true"]{opacity:1;transform:none}
        .ss-rise{animation:ssRise .9s cubic-bezier(0.32,0.72,0,1) both}
        @keyframes ssRise{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
        .ss-tick{animation:ssTick .4s cubic-bezier(0.32,0.72,0,1)}
        @keyframes ssTick{0%{transform:translateY(6px);opacity:0}100%{transform:none;opacity:1}}
        .ss-ember{animation:ssEmber 5s ease-in-out infinite alternate}
        @keyframes ssEmber{from{opacity:.55;transform:scale(.96)}to{opacity:.9;transform:scale(1.04)}}
        .ss-float{transition:transform .45s cubic-bezier(0.32,0.72,0,1),box-shadow .45s ease}
        .ss-float:hover{transform:translateY(-6px);box-shadow:0 24px 48px -26px rgba(48,16,49,.32)}
        .uv-tube{will-change:opacity;background:linear-gradient(180deg,#D9C2FF,#FFFFFF 50%,#D9C2FF);box-shadow:0 0 16px 3px rgba(190,150,255,.75),0 0 55px 16px rgba(158,102,255,.4),0 0 120px 40px rgba(248,16,240,.14);opacity:0;animation:uvStrike 1.9s steps(1,end) both,uvHum var(--hum,9s) steps(1,end) var(--humd,3s) infinite}
        @keyframes uvStrike{0%{opacity:.04}9%{opacity:.55}12%{opacity:.08}21%{opacity:.85}26%{opacity:.12}33%{opacity:.06}41%{opacity:1}52%{opacity:.3}58%{opacity:1}74%{opacity:.55}79%,100%{opacity:1}}
        @keyframes uvHum{0%,90.6%{opacity:1}91%{opacity:.78}91.5%{opacity:1}94.8%{opacity:.92}95.1%{opacity:1}97.6%{opacity:.85}97.9%,100%{opacity:1}}
        .ss-faq summary::-webkit-details-marker{display:none}
        .ss-faq[open]>p{animation:ssFaqIn .4s cubic-bezier(0.32,0.72,0,1)}
        @keyframes ssFaqIn{from{opacity:0;transform:translateY(-6px)}}
        .ss-root :focus-visible{outline:2px solid ${PINK_DEEP};outline-offset:3px}
        .ss-snap{scrollbar-width:none}
        .ss-snap::-webkit-scrollbar{display:none}
        @media (prefers-reduced-motion: reduce){
          .ss-root *,.ss-root *::before,.ss-root *::after{transition-duration:.01ms!important;animation-duration:.01ms!important;animation-iteration-count:1!important}
          .ss-reveal{opacity:1;transform:none;transition:none}
          .ss-rise,.ss-tick{animation:none}
          .uv-tube{animation:none;opacity:1}
          .ss-ember{animation:none;opacity:.7}
          .ss-float,.ss-float:hover{transition:none;transform:none}
        }
      `}</style>

      {/* ── Floating pill nav ─────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-4 z-40 px-4">
        <div
          className="mx-auto flex w-full max-w-3xl items-center justify-between rounded-full border py-2 pr-2 pl-5"
          style={{ background: '#FFF8EEe6', borderColor: HAIR, backdropFilter: 'blur(14px)', boxShadow: '0 18px 40px -24px rgba(48,16,49,0.35)' }}
        >
          <a href="#top" className="shrink-0" aria-label="Sportsól">
            <img src={LOGO} alt="Sportsól" className="h-9 w-auto md:h-10" />
          </a>
          <nav className="hidden items-center gap-5 text-sm md:flex" style={{ fontFamily: SANS_MED }} aria-label="Valmynd">
            <a href="#verdskra" className="transition-colors duration-300 hover:text-[#B01F6A]" style={{ color: INK }}>
              Verðskrá
            </a>
            <a href="#askrift" className="transition-colors duration-300 hover:text-[#B01F6A]" style={{ color: INK }}>
              Áskrift
            </a>
            <a href="#bekkirnir" className="transition-colors duration-300 hover:text-[#B01F6A]" style={{ color: INK }}>
              Bekkirnir
            </a>
            <a href="#stofurnar" className="transition-colors duration-300 hover:text-[#B01F6A]" style={{ color: INK }}>
              Stofurnar
            </a>
          </nav>
          <a
            href={NOONA}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full py-2.5 pr-2 pl-4 text-sm text-white transition duration-300 hover:brightness-[1.06] active:scale-[0.98] active:duration-150"
            style={{ background: PINK_DEEP, fontFamily: SANS_BOLD }}
          >
            Bóka tíma
            <span
              className="grid h-7 w-7 place-items-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.2)' }}
              aria-hidden="true"
            >
              ↗
            </span>
          </a>
        </div>
      </header>

      {/* ── HERO — the UV room: tubes ignite on load and hum forever ────── */}
      <section id="top" className="relative flex min-h-[100svh] items-end overflow-hidden" style={{ background: UVROOM }}>
        {/* violet bloom behind the tubes */}
        <div aria-hidden="true" className="absolute inset-0" style={{ background: `radial-gradient(120% 90% at 50% 0%, #2E1046 0%, transparent 60%), radial-gradient(120% 80% at 50% 110%, ${PINK}14 0%, transparent 55%)` }} />
        {/* the tube wall */}
        <div aria-hidden="true" className="absolute inset-x-4 top-0 bottom-0 flex justify-between gap-2 md:inset-x-10">
          {UV_TUBES.map((t, i) => (
            <span
              key={i}
              className="uv-tube h-full w-2 rounded-full md:w-3"
              style={{ animationDelay: `${t.ignite}s`, ['--hum' as string]: `${t.hum}s`, ['--humd' as string]: `${t.humDelay}s` } as React.CSSProperties}
            />
          ))}
        </div>
        {/* legibility scrim over the text side */}
        <div aria-hidden="true" className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${UVROOM}f0 0%, ${UVROOM}b8 42%, ${UVROOM}30 70%, transparent 100%)` }} />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px" style={{ background: '#ffffff14' }} />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-24 pb-28 md:px-8 md:pb-20">
          <div className="max-w-4xl">
            <p className="ss-rise inline-flex items-center rounded-full border px-3.5 py-1.5 text-[0.8rem] tracking-[0.02em]" style={{ borderColor: '#ffffff2e', color: '#F3B8EF', fontFamily: SANS_BOLD, background: '#12051C99' }}>
              Sólbaðsstofur í Kópavogi og Grafarvogi
            </p>
            <h1 className="ss-rise mt-5 max-w-4xl text-[2.6rem] leading-[1.04] md:text-[4.4rem]" style={{ fontFamily: DISPLAY, color: '#FFF6EC', animationDelay: '80ms' }}>
              Komdu í ljós.
              <br />
              <span style={{ color: '#FF6BF7' }}>Frá 299 kr. á dag.</span>
            </h1>
            <p className="ss-rise mt-6 max-w-md text-lg leading-relaxed" style={{ color: '#E9D9F2', animationDelay: '160ms' }}>
              Nýir bekkir í báðum stofum. Áskrift eða stakir tímar, bókað á Noona.
            </p>
            <div className="ss-rise mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: '240ms' }}>
              <a
                href={NOONA}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-full py-3 pr-3 pl-6 text-base text-white shadow-xl transition duration-300 hover:brightness-[1.08] active:scale-[0.98] active:duration-150"
                style={{ background: PINK_DEEP, fontFamily: SANS_BOLD }}
              >
                Bóka tíma
                <span className="grid h-9 w-9 place-items-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ background: 'rgba(255,255,255,0.2)' }} aria-hidden="true">
                  ↗
                </span>
              </a>
              <a href="#verdskra" className="inline-flex items-center rounded-full border px-6 py-3.5 text-base transition-colors duration-300 hover:bg-white/10" style={{ borderColor: '#ffffff45', color: '#FFF6EC', fontFamily: SANS_BOLD }}>
                Sjá verðskrá
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Facts band ──────────────────────────────────────────────────── */}
      <section className="border-b" style={{ borderColor: HAIR }}>
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:grid-cols-3 md:px-8">
          {[
            ['Tvær stofur', 'Hamraborg og Hverafold'],
            ['Nýir bekkir', 'Stofurnar opnuðu 2024 og 2026'],
            ['Opið öll kvöld', 'Til 23:00 eða 23:30 virka daga'],
          ].map(([big, small], i) => (
            <Reveal key={big} delay={i * 80}>
              <p className="text-2xl md:text-3xl" style={{ fontFamily: DISPLAY_BOLD, color: INK }}>
                {big}
              </p>
              <p className="mt-1 text-sm" style={{ color: BODY }}>
                {small}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── VERÐSKRÁ ────────────────────────────────────────────────────── */}
      <section id="verdskra" className="scroll-mt-24 py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl md:text-5xl" style={{ fontFamily: DISPLAY, color: INK }}>
              Klukkan ræður verðinu
            </h2>
            <p className="mt-4 text-lg" style={{ color: BODY }}>
              Öll verð eru uppi á borðum. Veldu tíma dags og sjáðu nákvæmlega hvað tíminn kostar.
            </p>
          </Reveal>
          <PriceBoard />
        </div>
      </section>

      {/* ── ÁSKRIFT ─────────────────────────────────────────────────────── */}
      <section id="askrift" className="scroll-mt-24 border-t py-24 md:py-32" style={{ borderColor: HAIR, background: '#FFF3E2' }}>
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal className="max-w-3xl">
            <h2 className="text-3xl leading-[1.06] md:text-5xl" style={{ fontFamily: DISPLAY, color: INK }}>
              Ljós á hverjum degi, <span style={{ color: PINK }}>fyrir minna en kaffibolla</span>
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed" style={{ color: BODY }}>
              Áskrift gildir alla daga ársins og í báðum stofum. Þú velur ljós eða infrared hverju sinni.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {PLANS.map((p, i) => (
              <Reveal key={p.id} delay={i * 80} className="h-full">
                <div
                  className="ss-float h-full rounded-[2rem] p-1.5"
                  style={{
                    background: p.featured ? `linear-gradient(150deg, ${PINK}, ${CORAL})` : '#3010310a',
                    border: p.featured ? 'none' : `1px solid ${HAIR}`,
                    boxShadow: p.featured ? '0 34px 70px -35px rgba(196,41,121,0.55)' : undefined,
                  }}
                >
                  <div className="flex h-full flex-col rounded-[calc(2rem-0.375rem)] p-7" style={{ background: CARD }}>
                    <h3 className="text-sm" style={{ fontFamily: SANS_BOLD, color: p.featured ? PINK_TX : BODY }}>
                      {p.name}
                    </h3>
                    <p className="mt-4 flex items-baseline gap-2">
                      <span className="text-3xl md:text-4xl" style={{ fontFamily: DISPLAY, color: INK }}>
                        {isk(p.price)}
                      </span>
                      <span className="text-sm" style={{ color: BODY }}>
                        á mánuði
                      </span>
                    </p>
                    <p className="mt-1 text-sm" style={{ color: PINK_TX, fontFamily: SANS_MED }}>
                      um {p.perDay} kr. á dag
                    </p>
                    <p className="mt-4 flex-1 text-sm leading-relaxed" style={{ color: BODY }}>
                      {p.detail}
                    </p>
                    <p className="mt-4 text-xs" style={{ color: BODY }}>
                      {p.cancel}
                    </p>
                    <a
                      href="https://sportsol.is/pages/askriftarkort"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm transition duration-300 hover:brightness-[1.06] active:scale-[0.98] active:duration-150"
                      style={
                        p.featured
                          ? { background: PINK_DEEP, color: '#fff', fontFamily: SANS_BOLD }
                          : { border: `1px solid ${HAIR}`, color: INK, fontFamily: SANS_BOLD }
                      }
                    >
                      Skrá mig í áskrift
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEKKIRNIR — scroll-snap rail ────────────────────────────────── */}
      <section id="bekkirnir" className="scroll-mt-24 py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal className="mb-10 max-w-2xl">
            <h2 className="text-3xl md:text-5xl" style={{ fontFamily: DISPLAY, color: INK }}>
              Hvaða bekkur hentar þér?
            </h2>
            <p className="mt-4 text-lg" style={{ color: BODY }}>
              Fimm gerðir af bekkjum, hver með sinn karakter. Renndu í gegn og finndu þinn.
            </p>
          </Reveal>
        </div>
        <div role="region" aria-label="Bekkirnir" tabIndex={0} className="ss-snap flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:px-[max(2rem,calc((100vw-72rem)/2+2rem))]">
          {BEDS.map((b) => {
            const art =
              b.tone === 'pink'
                ? `radial-gradient(120% 90% at 20% 10%, ${PINK}2b, transparent 60%), linear-gradient(160deg, #FFE3EF, #FFD3E6)`
                : b.tone === 'coral'
                  ? `radial-gradient(120% 90% at 80% 0%, ${CORAL}33, transparent 55%), linear-gradient(160deg, #FFE8D8, #FFD8C4)`
                  : b.tone === 'ember'
                    ? `radial-gradient(120% 120% at 50% 110%, ${CORAL}55, transparent 60%), linear-gradient(160deg, #3A1430, ${DUSK})`
                    : `radial-gradient(120% 90% at 30% 0%, ${GOLD}40, transparent 55%), linear-gradient(160deg, #FFF0CE, #FFE2B8)`
            const dark = b.tone === 'ember'
            return (
              <article key={b.id} className="ss-float w-[19rem] shrink-0 snap-start rounded-[2rem] p-1.5 sm:w-[22rem]" style={{ background: '#3010310a', border: `1px solid ${HAIR}` }}>
                <div className="flex h-full flex-col justify-between rounded-[calc(2rem-0.375rem)] p-7" style={{ background: art, minHeight: '24rem' }}>
                  <div>
                    <div className="flex flex-wrap gap-1.5">
                      {b.locations.map((l) => (
                        <span key={l} className="rounded-full px-2.5 py-1 text-xs" style={{ background: dark ? '#ffffff22' : '#30103114', color: dark ? '#FFD9C9' : INK, fontFamily: SANS_BOLD }}>
                          {l}
                        </span>
                      ))}
                    </div>
                    <h3 className="mt-5 text-2xl leading-[1.1]" style={{ fontFamily: DISPLAY, color: dark ? '#FFF3EA' : INK }}>
                      {b.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed" style={{ color: dark ? '#EFC9BC' : BODY }}>
                      {b.tagline}
                    </p>
                  </div>
                  <p className="mt-6 text-sm" style={{ fontFamily: SANS_BOLD, color: dark ? '#FF9E7A' : PINK_TX }}>
                    {b.minutes}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ── INFRARED — the one dark chapter ─────────────────────────────── */}
      <section className="relative overflow-hidden py-24 md:py-32" style={{ background: DUSK }}>
        <div aria-hidden="true" className="ss-ember absolute top-1/2 left-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: `radial-gradient(circle, ${CORAL}40 0%, ${PINK}22 45%, transparent 70%)` }} />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2 md:px-8">
          <Reveal>
            <p className="inline-flex rounded-full border px-3.5 py-1.5 text-[0.7rem] tracking-[0.16em] uppercase" style={{ borderColor: '#ffffff2b', color: '#FF9E7A', fontFamily: SANS_BOLD }}>
              American M7 í Hamraborg
            </p>
            <h2 className="mt-5 text-3xl leading-[1.06] md:text-5xl" style={{ fontFamily: DISPLAY, color: '#FFF3EA' }}>
              Infrared, <span style={{ color: '#FF9E7A' }}>fimmtán mínútur af hlýju</span>
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed" style={{ color: '#EFC9BC' }}>
              Djúp og kraftmikil infrared meðferð sem skilar hámarksárangri á aðeins fimmtán mínútum. Hreint handklæði og sturtuaðstaða í einkaklefa fylgja hverjum tíma.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a href={NOONA} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full px-6 py-3.5 text-base transition duration-300 hover:brightness-[1.04] active:scale-[0.98] active:duration-150" style={{ background: '#FFF3EA', color: DUSK, fontFamily: SANS_BOLD }}>
                Bóka infrared tíma
              </a>
              <p className="text-sm" style={{ color: '#EFC9BC' }}>
                Frá {isk(1490)} eða innifalið í áskrift
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-sm">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="absolute rounded-full border"
                  style={{
                    inset: `${i * 13}%`,
                    borderColor: `rgba(255, 158, 122, ${0.16 + i * 0.12})`,
                    boxShadow: i === 3 ? `0 0 120px 40px ${CORAL}44, inset 0 0 60px ${CORAL}33` : undefined,
                    background: i === 3 ? `radial-gradient(circle at 40% 35%, ${CORAL}66, ${PINK}33 70%, transparent)` : undefined,
                  }}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FRELSI ──────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2 md:px-8">
          <Reveal className="order-2 md:order-1">
            <figure className="relative mx-auto w-full max-w-sm">
              <div className="absolute inset-0 translate-x-4 translate-y-5 rotate-3 rounded-[1.6rem]" style={{ background: `linear-gradient(140deg, ${GOLD}55, ${CORAL}55)` }} />
              <div className="absolute inset-0 translate-x-2 translate-y-2.5 rotate-1 rounded-[1.6rem]" style={{ background: `linear-gradient(140deg, ${GOLD}88, ${CORAL}88)` }} />
              <div className="relative rounded-[1.6rem] p-7" style={{ background: 'linear-gradient(140deg, #C42979, #C74B28)', boxShadow: '0 34px 70px -30px rgba(196,41,121,0.6)' }}>
                <p className="text-sm tracking-[0.2em] uppercase text-white" style={{ fontFamily: SANS_BOLD }}>
                  Frelsi
                </p>
                <p className="mt-8 text-4xl text-white" style={{ fontFamily: DISPLAY }}>
                  {isk(FRELSI.credit)}
                </p>
                <p className="mt-1 text-white" style={{ fontFamily: SANS_MED }}>
                  inneign fyrir {isk(FRELSI.pay)}
                </p>
                <p className="mt-8 text-xs tracking-wide text-white" style={{ fontFamily: SANS_BOLD }}>
                  Sportsól · Hamraborg og Hverafold
                </p>
              </div>
            </figure>
          </Reveal>
          <Reveal delay={100} className="order-1 md:order-2">
            <h2 className="text-3xl leading-[1.06] md:text-5xl" style={{ fontFamily: DISPLAY, color: INK }}>
              Frelsi: inneign sem <span style={{ color: PINK }}>rennur aldrei út</span>
            </h2>
            <ul className="mt-7 space-y-3">
              {FRELSI.points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-base" style={{ color: BODY }}>
                  <span aria-hidden="true" className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[0.65rem] text-white" style={{ background: PINK_DEEP }}>
                    ✓
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <a href="https://sportsol.is/pages/frelsi" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center rounded-full px-6 py-3.5 text-base text-white transition duration-300 hover:brightness-[1.06] active:scale-[0.98] active:duration-150" style={{ background: PINK_DEEP, fontFamily: SANS_BOLD }}>
              Kaupa Frelsi
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── STOFURNAR ───────────────────────────────────────────────────── */}
      <section id="stofurnar" className="scroll-mt-24 border-t py-24 md:py-32" style={{ borderColor: HAIR, background: '#FFF3E2' }}>
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal className="mb-10 max-w-2xl">
            <h2 className="text-3xl md:text-5xl" style={{ fontFamily: DISPLAY, color: INK }}>
              Tvær stofur, í Kópavogi og Grafarvogi
            </h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2">
            {LOCATIONS.map((l, i) => (
              <Reveal key={l.id} delay={i * 90}>
                <div className="h-full rounded-[2rem] p-1.5" style={{ background: '#3010310a', border: `1px solid ${HAIR}` }}>
                  <div className="flex h-full flex-col rounded-[calc(2rem-0.375rem)] p-7" style={{ background: CARD }}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-2xl" style={{ fontFamily: DISPLAY, color: INK }}>
                          {l.name}
                        </h3>
                        <p className="mt-1" style={{ color: BODY }}>
                          {l.address}, {l.town}
                        </p>
                      </div>
                      <span className="rounded-full px-3 py-1.5 text-xs" style={{ background: `${PINK}1a`, color: PINK_TX, fontFamily: SANS_BOLD }}>
                        Opnuð {l.openedYear}
                      </span>
                    </div>
                    <p className="mt-3 text-sm" style={{ color: PINK_TX, fontFamily: SANS_MED }}>
                      {l.opened}
                    </p>
                    <dl className="mt-5 space-y-1.5 border-t pt-5 text-sm" style={{ borderColor: HAIR }}>
                      {l.hours.map((h) => (
                        <div key={h.days} className="flex justify-between gap-4">
                          <dt style={{ color: BODY }}>{h.days}</dt>
                          <dd className="tabular-nums" style={{ color: INK, fontFamily: SANS_MED }}>
                            {h.time}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {l.beds.map((b) => (
                        <span key={b} className="rounded-full border px-2.5 py-1 text-xs" style={{ borderColor: HAIR, color: BODY }}>
                          {b}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <a href={NOONA} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full px-5 py-3 text-sm text-white transition duration-300 hover:brightness-[1.06] active:scale-[0.98] active:duration-150" style={{ background: PINK_DEEP, fontFamily: SANS_BOLD }}>
                        Bóka í {l.name}
                      </a>
                      <a href={l.maps} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full border px-5 py-2.5 text-sm transition-colors hover:bg-[#3010310d]" style={{ borderColor: HAIR, color: INK, fontFamily: SANS_BOLD }}>
                        Opna í kortum
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── KREM + TRUST ────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="grid gap-14 md:grid-cols-[1fr_1.2fr]">
            <Reveal>
              <h2 className="text-3xl md:text-4xl" style={{ fontFamily: DISPLAY, color: INK }}>
                Sólarkrem í úrvali
              </h2>
              <p className="mt-3 max-w-sm" style={{ color: BODY }}>
                Fjögur krem sem dýpka brúnkuna og verja húðina, {isk(CREAM_PRICE)} hvert.
              </p>
              <ul className="mt-6 space-y-2.5">
                {CREAMS.map((c) => (
                  <li key={c.name}>
                    <a href={c.href} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-3 rounded-full border py-3 pr-4 pl-5 transition-colors hover:bg-[#3010310d]" style={{ borderColor: HAIR }}>
                      <span style={{ fontFamily: SANS_BOLD, color: INK }}>{c.name}</span>
                      <span className="text-sm tabular-nums" style={{ color: PINK_TX, fontFamily: SANS_MED }}>
                        {isk(CREAM_PRICE)}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="text-3xl md:text-4xl" style={{ fontFamily: DISPLAY, color: INK }}>
                Fjölskyldufyrirtæki sem tekur hreinlæti alvarlega
              </h2>
              <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {TRUST.map((t) => (
                  <div key={t.title}>
                    <h3 className="text-lg" style={{ fontFamily: SANS_BOLD, color: INK }}>
                      {t.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed" style={{ color: BODY }}>
                      {t.body}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section className="border-t py-24 md:py-32" style={{ borderColor: HAIR }}>
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <Reveal className="mb-8">
            <h2 className="text-3xl md:text-4xl" style={{ fontFamily: DISPLAY, color: INK }}>
              Spurt og svarað
            </h2>
          </Reveal>
          <Reveal>
            <Faq />
          </Reveal>
        </div>
      </section>

      {/* ── FINAL CTA — sunset ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: DUSK }}>
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/3" style={{ background: `radial-gradient(90% 100% at 50% 100%, ${CORAL}59 0%, ${PINK}33 45%, transparent 75%)` }} />
        <div aria-hidden="true" className="absolute bottom-[-7rem] left-1/2 h-56 w-56 -translate-x-1/2 rounded-full" style={{ background: `radial-gradient(circle at 40% 30%, #FFE9A8, ${GOLD} 50%, ${CORAL})`, boxShadow: `0 0 140px 50px ${CORAL}55` }} />
        <div className="relative mx-auto max-w-3xl px-5 py-28 text-center md:py-36">
          <Reveal>
            <h2 className="text-4xl leading-[1.05] md:text-6xl" style={{ fontFamily: DISPLAY, color: '#FFF3EA' }}>
              Sólin bíður
            </h2>
            <p className="mx-auto mt-5 max-w-md text-lg" style={{ color: '#EFC9BC' }}>
              Lausir tímar í báðum stofum birtast í rauntíma á Noona.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a href={NOONA} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2.5 rounded-full py-3 pr-3 pl-6 text-base transition duration-300 hover:brightness-[1.04] active:scale-[0.98] active:duration-150" style={{ background: '#FFF3EA', color: DUSK, fontFamily: SANS_BOLD }}>
                Bóka tíma
                <span className="grid h-9 w-9 place-items-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ background: `${DUSK}14` }} aria-hidden="true">
                  ↗
                </span>
              </a>
              <a href={PHONE_HREF} className="inline-flex items-center rounded-full border px-6 py-3.5 text-base transition-colors hover:bg-white/10" style={{ borderColor: '#ffffff40', color: '#FFF3EA', fontFamily: SANS_BOLD }}>
                {PHONE_DISPLAY}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <PreviewFooter company={company} />

      {/* ── Mobile sticky CTA ───────────────────────────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t p-3 md:hidden" style={{ background: '#FFF8EEf2', borderColor: HAIR, backdropFilter: 'blur(10px)' }}>
        <a href={NOONA} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center rounded-full px-5 py-3 text-sm text-white" style={{ background: PINK_DEEP, fontFamily: SANS_BOLD }}>
          Bóka tíma á Noona
        </a>
        <a href={PHONE_HREF} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border text-sm" style={{ borderColor: HAIR, color: INK }} aria-label="Hringja í Sportsól">
          ☏
        </a>
      </div>

      <PreviewChrome company={company} />
    </div>
  )
}
