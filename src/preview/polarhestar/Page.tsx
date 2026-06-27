import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  Minus,
  Phone,
  Plus,
  Quote,
  Star,
} from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import {
  ADDRESS,
  COPY,
  EMAIL,
  IMG,
  type Lang,
  LONG_TOURS,
  MAPS_HREF,
  PHONE_DISPLAY,
  PHONE_HREF,
  REVIEWS,
  SEASONS,
  SHOP,
  SHORT_TOURS,
  STATS,
  type Tour,
} from './data'

const company = getPreviewCompany('polarhestar')

/* ── Palette — Heath & Saddle: bone, deep pine, terracotta, basalt ── */
const MIST = '#EEE7DA' // bone — warm light ground
const PAPER = '#F6F1E6' // lighter card on bone
const INK = '#1E2420' // basalt near-black (green-tinted) — text on light
const BODY = '#434A41' // warm green-grey body text on light
const CLAY = '#B0572E' // terracotta — bright accent, decorative icons, tints
const CLAY_TX = '#8E4623' // terracotta as text on light grounds (AA ≥4.5)
const CLAY_FILL = '#A9572F' // terracotta button fill behind white text (~5:1)
const CLAY_HI = '#E4B074' // warm tan-gold — accent on dark grounds
const SLATE = '#5E6A4C' // moss green — secondary text/icons on light (AA)
const TWILIGHT = '#20352B' // deep pine green — feature band ground
const TWILIGHT2 = '#2B463A' // pine card / active tab on dark
const BASALT = '#161B19' // darkest ground — seasons + final CTA

/* ── helpers ──────────────────────────────────────────────────────────── */
const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`
const srcSet = (id: string) => `${u(id, 828)} 828w, ${u(id, 1280)} 1280w, ${u(id, 2000)} 2000w`
const isk = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'
const fmtDate = (iso: string, lang: Lang) =>
  new Intl.DateTimeFormat(lang === 'is' ? 'is-IS' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso + 'T00:00:00'))
const isoDay = (d: Date) =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)

/* ── Scroll reveal — IO + CSS "mist clearing"; failsafe so it never sticks ── */
function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
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
    const t = window.setTimeout(() => setShown(true), 1400) // failsafe for throttled tabs
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [])
  return (
    <div ref={ref} data-show={shown} className={`ph-reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* ── Eyebrow label (tracked small-caps grotesque) ─────────────────────── */
function Eyebrow({ children, on = 'light' }: { children: ReactNode; on?: 'light' | 'dark' }) {
  return (
    <p
      className="font-hanken text-[0.72rem] font-semibold tracking-[0.24em] uppercase"
      style={{ color: on === 'dark' ? CLAY_HI : CLAY_TX }}
    >
      {children}
    </p>
  )
}

/* ── Booking panel — the flaw-fixing centrepiece (date with year, live price) ── */
function Booking({
  t,
  lang,
  selectedId,
  onSelect,
}: {
  t: typeof COPY['is']
  lang: Lang
  selectedId: string
  onSelect: (id: string) => void
}) {
  const tour = SHORT_TOURS.find((x) => x.id === selectedId) ?? SHORT_TOURS[0]
  const today = new Date()
  const [date, setDate] = useState(() => isoDay(new Date(today.getTime() + 7 * 864e5)))
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [done, setDone] = useState(false)

  const childPrice = Math.max(tour.price - 2000, 0)
  const total = tour.price * adults + childPrice * children

  const Step = ({ n, label }: { n: number; label: string }) => (
    <div className="mb-3 flex items-center gap-2">
      <span
        className="grid h-6 w-6 place-items-center rounded-full font-hanken text-xs font-bold text-white"
        style={{ background: CLAY_FILL }}
        aria-hidden="true"
      >
        {n}
      </span>
      <span className="font-hanken text-sm font-semibold" style={{ color: INK }}>
        {label}
      </span>
    </div>
  )

  const Stepper = ({
    label,
    value,
    set,
    min,
  }: {
    label: string
    value: number
    set: (n: number) => void
    min: number
  }) => (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="font-hanken text-sm" style={{ color: BODY }}>
        {label}
      </span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => set(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`${label}: ${lang === 'is' ? 'fækka' : 'decrease'}`}
          className="grid h-11 w-11 place-items-center rounded-full border transition-colors disabled:opacity-30"
          style={{ borderColor: '#0000001f', color: INK }}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-5 text-center font-hanken text-base font-semibold tabular-nums" style={{ color: INK }}>
          {value}
        </span>
        <button
          type="button"
          onClick={() => set(Math.min(10, value + 1))}
          aria-label={`${label}: ${lang === 'is' ? 'fjölga' : 'increase'}`}
          className="grid h-11 w-11 place-items-center rounded-full border transition-colors hover:bg-black/5"
          style={{ borderColor: '#0000001f', color: INK }}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  )

  return (
    <div className="grid gap-0 overflow-hidden rounded-[28px] shadow-[0_30px_70px_-30px_rgba(28,42,46,0.5)] md:grid-cols-2" style={{ background: PAPER }}>
      {/* image side */}
      <div className="relative min-h-[240px] overflow-hidden md:min-h-full">
        <Img
          src={u(IMG.booking, 1000)}
          alt={lang === 'is' ? 'Tveir íslenskir hestar á beit' : 'Two Icelandic horses grazing'}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(120deg, ${TWILIGHT}cc, transparent 70%)` }} />
        <div className="relative p-6 md:p-8">
          <p className="max-w-[15rem] font-spectral text-2xl leading-snug text-white md:text-3xl">{t.bookPanelLine}</p>
          <p className="mt-2 max-w-[15rem] font-hanken text-sm text-white/85">{t.bookBody}</p>
        </div>
      </div>

      {/* form side */}
      <div className="p-6 md:p-8">
        {done ? (
          <div className="flex h-full flex-col items-start justify-center">
            <span className="grid h-12 w-12 place-items-center rounded-full" style={{ background: CLAY_FILL }}>
              <Check className="h-6 w-6 text-white" />
            </span>
            <h3 className="mt-4 font-spectral text-2xl" style={{ color: INK }}>
              {t.confirmedTitle}
            </h3>
            <p className="mt-2 font-hanken text-sm leading-relaxed" style={{ color: BODY }}>
              {t.confirmedBody}
            </p>
            <dl className="mt-5 w-full space-y-1.5 rounded-2xl p-4 font-hanken text-sm" style={{ background: MIST, color: INK }}>
              <div className="flex justify-between gap-4">
                <dt style={{ color: BODY }}>{tour.name[lang]}</dt>
                <dd className="font-semibold">{fmtDate(date, lang)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt style={{ color: BODY }}>
                  {adults}{' '}
                  {lang === 'is' ? (adults === 1 ? 'fullorðinn' : 'fullorðnir') : adults === 1 ? 'adult' : 'adults'}
                  {children > 0
                    ? ` · ${children} ${
                        lang === 'is' ? (children === 1 ? 'barn' : 'börn') : children === 1 ? 'child' : 'children'
                      }`
                    : ''}
                </dt>
                <dd className="font-semibold">{isk(total)}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={() => setDone(false)}
              className="mt-5 font-hanken text-sm font-semibold underline underline-offset-4"
              style={{ color: CLAY_TX }}
            >
              {t.bookAgain}
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setDone(true)
            }}
          >
            <Step n={1} label={t.stepTour} />
            <div className="mb-5 flex flex-wrap gap-2">
              {SHORT_TOURS.map((x) => {
                const active = x.id === tour.id
                return (
                  <button
                    key={x.id}
                    type="button"
                    onClick={() => onSelect(x.id)}
                    aria-pressed={active}
                    className="rounded-full border px-3.5 py-2.5 font-hanken text-sm font-medium transition-all"
                    style={
                      active
                        ? { background: INK, color: MIST, borderColor: INK }
                        : { background: 'transparent', color: BODY, borderColor: '#0000001f' }
                    }
                  >
                    {x.name[lang]}
                  </button>
                )
              })}
            </div>

            <Step n={2} label={t.stepDate} />
            <label className="mb-5 block">
              <span className="sr-only">{t.dateLabel}</span>
              <div className="flex items-center gap-2 rounded-xl border px-3.5 py-3" style={{ borderColor: '#0000001f', background: MIST }}>
                <Calendar className="h-4 w-4 shrink-0" style={{ color: CLAY_TX }} aria-hidden="true" />
                <input
                  type="date"
                  value={date}
                  min={isoDay(today)}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent font-hanken text-sm outline-none"
                  style={{ color: INK }}
                />
              </div>
              <span className="mt-1.5 block font-hanken text-xs" style={{ color: SLATE }}>
                {fmtDate(date, lang)}
              </span>
            </label>

            <Step n={3} label={t.stepRiders} />
            <div className="divide-y" style={{ borderColor: '#0000000f' }}>
              <Stepper label={t.adults} value={adults} set={setAdults} min={1} />
              <Stepper label={t.children} value={children} set={setChildren} min={0} />
            </div>
            {children > 0 && (
              <p className="mt-2 font-hanken text-xs" style={{ color: SLATE }}>
                {t.childDiscountApplied}
              </p>
            )}

            <div className="mt-5 flex items-end justify-between border-t pt-4" style={{ borderColor: '#0000001a' }}>
              <div>
                <p className="font-hanken text-xs tracking-wide uppercase" style={{ color: SLATE }}>
                  {t.totalLabel}
                </p>
                <p className="font-spectral text-3xl" style={{ color: INK }}>
                  {isk(total)}
                </p>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-hanken text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5"
                style={{ background: CLAY_FILL }}
              >
                {t.confirmBtn}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

/* ── Seasons — signature "Ljós Norðursins" switcher ───────────────────── */
function SeasonSwitcher({ t, lang }: { t: typeof COPY['is']; lang: Lang }) {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const season = SEASONS[active]
  const onTabKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    let next = active
    if (e.key === 'ArrowRight') next = (active + 1) % SEASONS.length
    else if (e.key === 'ArrowLeft') next = (active - 1 + SEASONS.length) % SEASONS.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = SEASONS.length - 1
    else return
    e.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }
  return (
    <div>
      <div
        role="tabpanel"
        id="season-panel"
        aria-labelledby={`season-tab-${season.id}`}
        className="relative aspect-[16/10] w-full overflow-hidden rounded-[28px] md:aspect-[21/9]"
      >
        {SEASONS.map((s, i) => (
          <Img
            key={s.id}
            src={u(s.image, 1800)}
            srcSet={srcSet(s.image)}
            sizes="(max-width: 1100px) 100vw, 1100px"
            alt={
              lang === 'is'
                ? `Íslenskir hestar — ${s.name.is.toLowerCase()}`
                : `Icelandic horses — ${s.name.en.toLowerCase()}`
            }
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
            style={{ opacity: i === active ? 1 : 0 }}
          />
        ))}
        {/* legibility + season glow */}
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${TWILIGHT}22 0%, transparent 30%, ${TWILIGHT}e6 100%)` }} />
        <div
          className="pointer-events-none absolute inset-0 transition-colors duration-700"
          style={{ background: `radial-gradient(80% 60% at 50% 12%, ${season.glow}33, transparent 60%)` }}
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
          <p className="font-hanken text-xs font-semibold tracking-[0.24em] uppercase" style={{ color: CLAY_HI }}>
            {season.kicker[lang]}
          </p>
          <h3 className="mt-1 font-spectral text-3xl text-white md:text-5xl">{season.name[lang]}</h3>
          <p className="mt-2 max-w-xl font-hanken text-sm leading-relaxed text-white/85 md:text-base">{season.line[lang]}</p>
          <p className="mt-3 inline-flex items-center gap-1.5 font-hanken text-sm font-medium" style={{ color: CLAY_HI }}>
            <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            {season.tour[lang]}
          </p>
        </div>
      </div>

      {/* season tabs */}
      <div className="mt-4 grid grid-cols-3 gap-3" role="tablist" aria-label={t.seasonsEyebrow} onKeyDown={onTabKey}>
        {SEASONS.map((s, i) => {
          const on = i === active
          return (
            <button
              key={s.id}
              id={`season-tab-${s.id}`}
              role="tab"
              aria-selected={on}
              aria-controls="season-panel"
              tabIndex={on ? 0 : -1}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              onClick={() => setActive(i)}
              className="group rounded-2xl border px-3 py-3 text-left transition-all"
              style={{
                background: on ? TWILIGHT2 : 'transparent',
                borderColor: on ? '#ffffff26' : '#ffffff14',
              }}
            >
              <span className="block font-spectral text-lg text-white md:text-xl">{s.name[lang]}</span>
              <span className="mt-0.5 block font-hanken text-[0.72rem] tracking-wide text-white/65">{s.kicker[lang]}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────────────── */
export default function PolarHestarPage() {
  const [lang, setLang] = useState<Lang>('is')
  const [scrolled, setScrolled] = useState(false)
  const [bookTour, setBookTour] = useState(SHORT_TOURS[0].id)
  const t = COPY[lang]
  const bookingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = 'Pólar Hestar — hestaferðir við Eyjafjörð'
    setThemeColor(MIST)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goBook = (id: string) => {
    setBookTour(id)
    bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const navLink = 'font-hanken text-sm font-medium transition-colors'

  return (
    <div lang={lang} style={{ background: MIST, color: BODY }} className="ph-root min-h-screen overflow-x-hidden font-hanken antialiased">
      {/* scoped motion + theme */}
      <style>{`
        .ph-reveal{opacity:0;transform:translateY(20px);filter:blur(6px);transition:opacity .9s ease,transform .9s cubic-bezier(.2,.7,.2,1),filter .9s ease}
        .ph-reveal[data-show="true"]{opacity:1;transform:none;filter:none}
        .ph-hero-rise{animation:phHeroRise .9s cubic-bezier(.2,.7,.2,1) both}
        @keyframes phHeroRise{from{transform:translateY(18px)}to{transform:none}}
        .ph-proc:hover .ph-track{animation-play-state:paused}
        .ph-card-img{transition:transform .7s cubic-bezier(.2,.7,.2,1)}
        .ph-card:hover .ph-card-img{transform:scale(1.05)}
        .ph-root :focus-visible{outline:2px solid #1C2A2E;outline-offset:2px;border-radius:4px}
        .ph-dark :focus-visible{outline-color:#E4B074}
        @media (prefers-reduced-motion: reduce){
          .ph-reveal{opacity:1;transform:none;filter:none;transition:none}
          .ph-hero-rise{animation:none}
          .ph-card-img{transition:none}
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <header
        className="fixed inset-x-0 top-0 z-40 transition-all duration-300"
        style={{
          background: scrolled ? `${MIST}f2` : 'transparent',
          boxShadow: scrolled ? '0 1px 0 rgba(35,40,42,0.08)' : 'none',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <a
            href="#top"
            className="font-spectral text-lg font-semibold tracking-tight transition-colors md:text-xl"
            style={{ color: scrolled ? INK : '#fff' }}
          >
            Pólar&nbsp;Hestar
          </a>
          <nav className="hidden items-center gap-7 md:flex" aria-label={lang === 'is' ? 'Valmynd' : 'Menu'}>
            {[
              ['#ferdir', t.nav.tours],
              ['#arstidir', t.nav.seasons],
              ['#heimsokn', t.nav.visit],
            ].map(([href, label]) => (
              <a key={href} href={href} className={navLink} style={{ color: scrolled ? BODY : '#ffffffe6' }}>
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLang(lang === 'is' ? 'en' : 'is')}
              className="rounded-full border px-3 py-2 font-hanken text-xs font-semibold transition-colors"
              style={{
                color: scrolled ? INK : '#fff',
                borderColor: scrolled ? '#23282a33' : '#ffffff66',
              }}
              aria-label={lang === 'is' ? 'Switch to English' : 'Skipta yfir á íslensku'}
            >
              {t.langBtn}
            </button>
            <button
              type="button"
              onClick={() => goBook(bookTour)}
              className="hidden rounded-full px-4 py-2 font-hanken text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 sm:inline-flex"
              style={{ background: CLAY_FILL }}
            >
              {t.nav.cta}
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section id="top" className="relative flex min-h-[100svh] items-end overflow-hidden">
        <Img
          src={u(IMG.hero, 2000)}
          srcSet={srcSet(IMG.hero)}
          sizes="100vw"
          fetchpriority="high"
          loading="eager"
          alt={
            lang === 'is'
              ? 'Íslensk hross með ljósan fax fyrir framan þokuhulin fjöll á Norðurlandi'
              : 'Icelandic horses with pale manes before mist-wrapped North Iceland mountains'
          }
          className="kenburns absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(180deg, rgba(20,26,28,0.5) 0%, rgba(20,26,28,0.15) 32%, rgba(20,26,28,0.35) 62%, rgba(20,26,28,0.85) 100%)` }}
        />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 md:px-8 md:pb-24">
          <p className="ph-hero-rise font-hanken text-xs font-semibold tracking-[0.24em] text-white/80 uppercase" style={{ animationDelay: '0ms' }}>
            {t.heroEyebrow}
          </p>
          <h1 className="ph-hero-rise mt-4 max-w-4xl font-spectral text-[2.6rem] leading-[1.04] text-white md:text-7xl" style={{ animationDelay: '60ms' }}>
            {t.heroH1a}
            <br />
            <span className="italic" style={{ color: CLAY_HI }}>
              {t.heroH1b}
            </span>
          </h1>
          <p className="ph-hero-rise mt-5 max-w-xl font-hanken text-base leading-relaxed text-white/90 md:text-lg" style={{ animationDelay: '120ms' }}>
            {t.heroLede}
          </p>
          <div className="ph-hero-rise mt-7 flex flex-wrap items-center gap-3" style={{ animationDelay: '180ms' }}>
            <button
              type="button"
              onClick={() => goBook(bookTour)}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-hanken text-sm font-semibold shadow-xl transition-transform hover:-translate-y-0.5"
              style={{ background: MIST, color: INK }}
            >
              {t.heroBook}
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#ferdir"
              className="inline-flex items-center gap-2 rounded-full border px-6 py-3.5 font-hanken text-sm font-semibold text-white transition-colors hover:bg-white/10"
              style={{ borderColor: '#ffffff66' }}
            >
              {t.heroTours}
            </a>
          </div>
          <div className="ph-hero-rise mt-9 flex flex-wrap items-center gap-x-7 gap-y-3" style={{ animationDelay: '240ms' }}>
            <Stat value={`${STATS.years}`} label={t.statYears} />
            <span className="hidden h-8 w-px bg-white/25 sm:block" aria-hidden="true" />
            <Stat value={`${STATS.horses}`} label={t.statHorses} />
            <span className="hidden h-8 w-px bg-white/25 sm:block" aria-hidden="true" />
            <div className="flex items-center gap-2" role="img" aria-label={lang === 'is' ? `${STATS.rating} af 5 á Tripadvisor` : `${STATS.rating} out of 5 on Tripadvisor`}>
              <Star className="h-4 w-4 fill-current" style={{ color: CLAY_HI }} aria-hidden="true" />
              <span className="font-spectral text-2xl text-white">{STATS.rating}</span>
              <span className="font-hanken text-xs text-white/70">
                {STATS.reviews} {t.statRating}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STORY ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <Reveal>
            <Eyebrow>{t.storyEyebrow}</Eyebrow>
            <h2 className="mt-3 font-spectral text-3xl leading-tight md:text-5xl" style={{ color: INK }}>
              {t.storyH2}
            </h2>
            <p className="mt-5 font-hanken text-base leading-relaxed" style={{ color: BODY }}>
              {t.storyP1}
            </p>
            <p className="mt-4 font-hanken text-base leading-relaxed" style={{ color: BODY }}>
              {t.storyP2}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <figure className="relative">
              <div className="overflow-hidden rounded-[28px] shadow-[0_30px_60px_-30px_rgba(28,42,46,0.45)]">
                <Img
                  src={u(IMG.story, 1100)}
                  srcSet={srcSet(IMG.story)}
                  sizes="(max-width: 768px) 100vw, 540px"
                  alt={lang === 'is' ? 'Hvítur íslenskur hestur í þoku' : 'A white Icelandic horse in the mist'}
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ── PULL QUOTE (folkloric line) — deep-pine feature band ─────────── */}
      <section className="ph-dark px-5 py-20 md:py-28" style={{ background: TWILIGHT }}>
        <Reveal className="mx-auto max-w-4xl text-center">
          <span className="mx-auto mb-6 block h-px w-16" style={{ background: CLAY_HI }} aria-hidden="true" />
          <p className="font-spectral text-3xl leading-snug italic text-white md:text-5xl">
            {t.storyQuote}
          </p>
        </Reveal>
      </section>

      {/* ── HERD PROCESSION (signature) ─────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <Reveal className="mx-auto mb-8 max-w-6xl px-5 md:px-8">
          <Eyebrow>{t.procEyebrow}</Eyebrow>
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-xl font-spectral text-3xl leading-tight md:text-4xl" style={{ color: INK }}>
              {t.procH2}
            </h2>
            <p className="max-w-md font-hanken text-sm leading-relaxed" style={{ color: BODY }}>
              {t.procBody}
            </p>
          </div>
        </Reveal>
        <div className="ph-proc relative overflow-hidden" aria-hidden="true">
          <div className="ph-track animate-marquee flex w-max gap-4">
            {[...IMG.procession, ...IMG.procession].map((id, i) => (
              <div key={i} className="h-48 w-36 shrink-0 overflow-hidden rounded-2xl md:h-60 md:w-44" style={{ background: PAPER }}>
                <img src={u(id, 400)} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
          {/* edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-28" style={{ background: `linear-gradient(90deg, ${MIST}, transparent)` }} />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-28" style={{ background: `linear-gradient(270deg, ${MIST}, transparent)` }} />
        </div>
      </section>

      {/* ── SHORT TOURS ─────────────────────────────────────────────────── */}
      <section id="ferdir" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 md:px-8 md:py-24">
        <Reveal>
          <Eyebrow>{t.toursEyebrow}</Eyebrow>
          <h2 className="mt-3 max-w-2xl font-spectral text-3xl leading-tight md:text-5xl" style={{ color: INK }}>
            {t.toursH2}
          </h2>
          <p className="mt-4 max-w-2xl font-hanken text-base leading-relaxed" style={{ color: BODY }}>
            {t.toursBody}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SHORT_TOURS.map((tour, i) => (
            <Reveal key={tour.id} delay={i * 80}>
              <TourCard tour={tour} lang={lang} t={t} onBook={() => goBook(tour.id)} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-1.5">
          <p className="inline-flex items-center gap-1.5 font-hanken text-xs" style={{ color: SLATE }}>
            <Check className="h-3.5 w-3.5" style={{ color: CLAY_TX }} aria-hidden="true" />
            {t.childNote}
          </p>
          <p className="inline-flex items-center gap-1.5 font-hanken text-xs" style={{ color: SLATE }}>
            <Check className="h-3.5 w-3.5" style={{ color: CLAY_TX }} aria-hidden="true" />
            {t.weightNote}
          </p>
        </Reveal>
      </section>

      {/* ── BOOKING ─────────────────────────────────────────────────────── */}
      <section id="boka" ref={bookingRef} className="ph-dark scroll-mt-20 px-5 py-16 md:py-24" style={{ background: TWILIGHT }}>
        <div className="mx-auto max-w-5xl">
          <Reveal className="mb-8 text-center">
            <Eyebrow on="dark">{t.bookEyebrow}</Eyebrow>
            <h2 className="mt-3 font-spectral text-3xl leading-tight text-white md:text-5xl">
              {t.bookH2}
            </h2>
          </Reveal>
          <Reveal>
            <Booking t={t} lang={lang} selectedId={bookTour} onSelect={setBookTour} />
          </Reveal>
        </div>
      </section>

      {/* ── SEASONS (signature) ─────────────────────────────────────────── */}
      <section id="arstidir" className="ph-dark scroll-mt-20" style={{ background: BASALT }}>
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <Reveal className="mb-8 max-w-2xl">
            <Eyebrow on="dark">{t.seasonsEyebrow}</Eyebrow>
            <h2 className="mt-3 font-spectral text-3xl leading-tight text-white md:text-5xl">{t.seasonsH2}</h2>
            <p className="mt-4 font-hanken text-base leading-relaxed text-white/75">{t.seasonsBody}</p>
          </Reveal>
          <Reveal>
            <SeasonSwitcher t={t} lang={lang} />
          </Reveal>
        </div>
      </section>

      {/* ── LONG TOURS ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <Reveal className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <Eyebrow>{t.longEyebrow}</Eyebrow>
            <h2 className="mt-3 font-spectral text-3xl leading-tight md:text-5xl" style={{ color: INK }}>
              {t.longH2}
            </h2>
          </div>
          <p className="max-w-sm font-hanken text-sm leading-relaxed" style={{ color: BODY }}>
            {t.longBody}
          </p>
        </Reveal>

        <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 scrollbar-none md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:grid-cols-3">
          {LONG_TOURS.map((tour, i) => (
            <Reveal key={tour.id} delay={i * 60} className="w-[78%] shrink-0 snap-start sm:w-[46%] md:w-auto">
              <article className="ph-card group h-full overflow-hidden rounded-[24px]" style={{ background: PAPER }}>
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={u(tour.image, 800)}
                    srcSet={`${u(tour.image, 600)} 600w, ${u(tour.image, 900)} 900w`}
                    sizes="(max-width: 768px) 80vw, 360px"
                    alt={
                      lang === 'is'
                        ? `Íslenskt landslag — ${tour.name}`
                        : `Icelandic landscape — ${tour.name}`
                    }
                    loading="lazy"
                    decoding="async"
                    className="ph-card-img h-full w-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <p className="font-hanken text-[0.7rem] font-semibold tracking-[0.18em] uppercase" style={{ color: CLAY_TX }}>
                    {t.multiDay}
                  </p>
                  <h3 className="mt-1.5 font-spectral text-xl leading-snug" style={{ color: INK }}>
                    {tour.name}
                  </h3>
                  <p className="mt-2 font-hanken text-sm leading-relaxed" style={{ color: BODY }}>
                    {tour.blurb[lang]}
                  </p>
                  <a
                    href={`mailto:${EMAIL}?subject=${encodeURIComponent(tour.name)}`}
                    className="mt-3 inline-flex items-center gap-1 font-hanken text-sm font-semibold transition-colors"
                    style={{ color: CLAY_TX }}
                  >
                    {t.enquireBtn}
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── TRUST / REVIEWS / FAMILY ────────────────────────────────────── */}
      <section className="ph-dark px-5 py-16 md:py-24" style={{ background: TWILIGHT }}>
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-10 text-center">
            <Eyebrow on="dark">{t.trustEyebrow}</Eyebrow>
            <h2 className="mt-3 font-spectral text-3xl leading-tight text-white md:text-5xl">
              {t.trustH2}
            </h2>
            <div className="mt-4 flex items-center justify-center gap-2" role="img" aria-label={lang === 'is' ? `${STATS.rating} af 5` : `${STATS.rating} out of 5`}>
              {[0, 1, 2, 3, 4].map((s) => (
                <Star key={s} className="h-5 w-5 fill-current" style={{ color: CLAY_HI }} aria-hidden="true" />
              ))}
              <span className="ml-2 font-hanken text-sm" style={{ color: MIST }}>
                {t.trustBody}
              </span>
            </div>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <Reveal key={i} delay={i * 80}>
                <figure className="flex h-full flex-col rounded-[22px] p-6" style={{ background: MIST }}>
                  <Quote className="h-6 w-6" style={{ color: CLAY }} aria-hidden="true" />
                  <blockquote className="mt-3 flex-1 font-spectral text-lg leading-relaxed italic" style={{ color: INK }}>
                    {r.quote[lang]}
                  </blockquote>
                  <figcaption className="mt-4 font-hanken text-sm font-semibold" style={{ color: BODY }}>
                    {r.name} <span className="font-normal" style={{ color: SLATE }}>· {r.origin[lang]}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          {/* family */}
          <Reveal className="mt-12">
            <div className="grid items-center gap-8 overflow-hidden rounded-[28px] md:grid-cols-2" style={{ background: MIST }}>
              <div className="order-2 p-7 md:order-1 md:p-10">
                <Eyebrow>{t.trustEyebrow}</Eyebrow>
                <h3 className="mt-2 font-spectral text-2xl md:text-3xl" style={{ color: INK }}>
                  {t.familyTitle}
                </h3>
                <p className="mt-3 font-hanken text-base leading-relaxed" style={{ color: BODY }}>
                  {t.familyBody}
                </p>
              </div>
              <div className="order-1 h-56 overflow-hidden md:order-2 md:h-full">
                <Img
                  src={u(IMG.family, 1000)}
                  srcSet={srcSet(IMG.family)}
                  sizes="(max-width: 768px) 100vw, 540px"
                  alt={lang === 'is' ? 'Tveir knapar á íslenskum hestum í norðlensku landslagi' : 'Two riders on Icelandic horses in a northern landscape'}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SHOP (photo-light) — fixes the dead-end shop ─────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <Reveal className="mb-8 max-w-xl">
          <Eyebrow>{t.shopEyebrow}</Eyebrow>
          <h2 className="mt-3 font-spectral text-3xl leading-tight md:text-4xl" style={{ color: INK }}>
            {t.shopH2}
          </h2>
          <p className="mt-3 font-hanken text-sm leading-relaxed" style={{ color: BODY }}>
            {t.shopBody}
          </p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          {SHOP.map((item, i) => (
            <Reveal key={i} delay={i * 70}>
              <div className="flex h-full items-center justify-between gap-4 rounded-2xl border p-5" style={{ borderColor: '#23282a1a', background: PAPER }}>
                <div>
                  <p className="font-spectral text-lg" style={{ color: INK }}>
                    {item.name[lang]}
                  </p>
                  <p className="mt-0.5 font-hanken text-sm font-semibold" style={{ color: CLAY_TX }}>
                    {isk(item.price)}
                  </p>
                </div>
                <a
                  href={`mailto:${EMAIL}?subject=${encodeURIComponent(item.name[lang])}`}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white transition-transform hover:-translate-y-0.5"
                  style={{ background: INK }}
                  aria-label={`${t.orderBtn}: ${item.name[lang]}`}
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── VISIT / LOCATION ────────────────────────────────────────────── */}
      <section id="heimsokn" className="scroll-mt-20 px-5 pb-20 md:pb-28">
        <div className="mx-auto grid max-w-6xl items-stretch gap-6 overflow-hidden md:grid-cols-2">
          <Reveal className="flex">
            <div className="flex w-full flex-col justify-center rounded-[28px] p-7 md:p-10" style={{ background: PAPER }}>
              <Eyebrow>{t.visitEyebrow}</Eyebrow>
              <h2 className="mt-3 font-spectral text-3xl leading-tight md:text-4xl" style={{ color: INK }}>
                {t.visitH2}
              </h2>

              <dl className="mt-6 space-y-5">
                <InfoRow icon={<MapPin className="h-5 w-5" />} label={t.addressLabel}>
                  {ADDRESS}
                </InfoRow>
                <InfoRow icon={<ArrowRight className="h-5 w-5" />} label={t.gettingThereLabel}>
                  {t.gettingThere}
                </InfoRow>
                <InfoRow icon={<Clock className="h-5 w-5" />} label={t.seasonLabel}>
                  {t.seasonInfo}
                </InfoRow>
                <InfoRow icon={<Phone className="h-5 w-5" />} label={lang === 'is' ? 'Sími' : 'Phone'}>
                  <a href={PHONE_HREF} className="underline underline-offset-4" style={{ color: INK }}>
                    {PHONE_DISPLAY}
                  </a>
                </InfoRow>
              </dl>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={MAPS_HREF}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-hanken text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                  style={{ background: CLAY_FILL }}
                >
                  <MapPin className="h-4 w-4" />
                  {t.mapsBtn}
                </a>
                <a
                  href={PHONE_HREF}
                  className="inline-flex items-center gap-2 rounded-full border px-5 py-3 font-hanken text-sm font-semibold transition-colors hover:bg-black/5"
                  style={{ borderColor: '#23282a33', color: INK }}
                >
                  <Phone className="h-4 w-4" />
                  {t.callBtn}
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex items-center gap-2 rounded-full border px-5 py-3 font-hanken text-sm font-semibold transition-colors hover:bg-black/5"
                  style={{ borderColor: '#23282a33', color: INK }}
                >
                  <Mail className="h-4 w-4" />
                  {t.emailBtn}
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="flex">
            <div className="min-h-[280px] w-full overflow-hidden rounded-[28px]">
              <Img
                src={u(IMG.location, 1100)}
                srcSet={srcSet(IMG.location)}
                sizes="(max-width: 768px) 100vw, 540px"
                alt={lang === 'is' ? 'Vegur meðfram firði á Norðurlandi' : 'A road along a fjord in North Iceland'}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────── */}
      <section className="ph-dark relative overflow-hidden">
        <Img
          src={u(IMG.ctaBand, 1800)}
          srcSet={srcSet(IMG.ctaBand)}
          sizes="100vw"
          alt={lang === 'is' ? 'Hross á gylltum haga við sólarlag' : 'Horses in a golden meadow at sunset'}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${BASALT}cc, ${BASALT}e6)` }} />
        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center md:py-32">
          <Reveal>
            <h2 className="font-spectral text-4xl leading-tight text-white md:text-6xl">{t.ctaH2}</h2>
            <p className="mx-auto mt-4 max-w-xl font-hanken text-base text-white/85 md:text-lg">{t.ctaBody}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => goBook(bookTour)}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-hanken text-sm font-semibold shadow-xl transition-transform hover:-translate-y-0.5"
                style={{ background: MIST, color: INK }}
              >
                {t.heroBook}
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href={PHONE_HREF}
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3.5 font-hanken text-sm font-semibold text-white transition-colors hover:bg-white/10"
                style={{ borderColor: '#ffffff66' }}
              >
                <Phone className="h-4 w-4" />
                {PHONE_DISPLAY}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <PreviewFooter company={company} />

      {/* ── MOBILE STICKY CTA ───────────────────────────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t p-3 md:hidden" style={{ background: `${MIST}f5`, borderColor: '#23282a1f', backdropFilter: 'blur(8px)' }}>
        <button
          type="button"
          onClick={() => goBook(bookTour)}
          className="flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 font-hanken text-sm font-semibold text-white shadow-lg"
          style={{ background: CLAY_FILL }}
        >
          {t.stickyBook}
          <ArrowRight className="h-4 w-4" />
        </button>
        <a
          href={PHONE_HREF}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border"
          style={{ borderColor: '#23282a33', color: INK }}
          aria-label={t.callBtn}
        >
          <Phone className="h-5 w-5" />
        </a>
      </div>

      <PreviewChrome company={company} />
    </div>
  )
}

/* ── small presentational helpers ─────────────────────────────────────── */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-spectral text-2xl text-white">{value}</span>
      <span className="font-hanken text-xs text-white/70">{label}</span>
    </div>
  )
}

function TourCard({ tour, lang, t, onBook }: { tour: Tour; lang: Lang; t: typeof COPY['is']; onBook: () => void }) {
  return (
    <article className="ph-card flex h-full flex-col overflow-hidden rounded-[22px] shadow-[0_18px_40px_-28px_rgba(28,42,46,0.55)]" style={{ background: PAPER }}>
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={u(tour.image, 700)}
          srcSet={`${u(tour.image, 500)} 500w, ${u(tour.image, 800)} 800w`}
          sizes="(max-width: 640px) 100vw, 280px"
          alt={lang === 'is' ? `${tour.name.is} — íslenskir hestar` : `${tour.name.en} — Icelandic horses`}
          loading="lazy"
          decoding="async"
          className="ph-card-img h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <span className="rounded-full px-2.5 py-1 font-hanken text-[0.68rem] font-semibold" style={{ background: `${CLAY}1f`, color: CLAY_TX }}>
            {tour.level[lang]}
          </span>
          <span className="font-hanken text-xs" style={{ color: SLATE }}>
            {tour.meta[lang]}
          </span>
        </div>
        <h3 className="mt-3 font-spectral text-xl leading-snug" style={{ color: INK }}>
          {tour.name[lang]}
        </h3>
        <p className="mt-2 flex-1 font-hanken text-sm leading-relaxed" style={{ color: BODY }}>
          {tour.blurb[lang]}
        </p>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="font-hanken text-[0.68rem] tracking-wide uppercase" style={{ color: SLATE }}>
              {t.fromLabel}
            </p>
            <p className="font-spectral text-lg" style={{ color: INK }}>
              {isk(tour.price)}
            </p>
          </div>
          <button
            type="button"
            onClick={onBook}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-hanken text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            style={{ background: INK }}
          >
            {t.bookBtn}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  )
}

function InfoRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 shrink-0" style={{ color: CLAY_TX }} aria-hidden="true">
        {icon}
      </span>
      <div>
        <dt className="font-hanken text-xs font-semibold tracking-wide uppercase" style={{ color: SLATE }}>
          {label}
        </dt>
        <dd className="mt-0.5 font-hanken text-sm leading-relaxed" style={{ color: BODY }}>
          {children}
        </dd>
      </div>
    </div>
  )
}
