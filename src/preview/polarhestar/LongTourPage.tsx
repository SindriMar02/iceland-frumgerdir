/**
 * Pólar Hestar — one long tour (/preview/polarhestar/ferd/:id).
 *
 * What the front-page card could not hold: the day-by-day itinerary (the
 * company's own text), a schematic route map whose pins light as each day
 * scrolls into reading position (Hotel Laugar's grounds-plan device), the
 * facts, and this tour's departures with a prefilled request. The hero photo
 * grows from an inset frame to full-bleed on scroll (Realevate) on fine
 * pointers; phones get it full-bleed from the start.
 *
 * Facts and dates come from the same CMS documents as the front page through
 * schedule.ts; the itinerary from the CMS `itinerary` field, seeded from
 * polarhestar.is (itineraries.ts is the offline fallback).
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Mail, Phone } from 'lucide-react'
import { stegaClean } from '@sanity/client/stega'
import { companyEntry } from './company'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { SiteContentProvider, useSiteContent, altIs, type LongTourX } from './sanity'
import {
  BEDS, LEVEL, NO_DATES, STATUS_LABEL, formatRange, herdLine, nightsLine, priceEur, todayIso, upcoming, weekday,
  type DepartureRow, type Lang,
} from './schedule'
import { DAY_TITLE, ITINERARIES, MAP_PLACE } from './itineraries'
import { RegionMap } from './RegionMap'
import { useGrowingHero, useSmoothScroll } from './motion'

const MIST = '#EDF1F7'
const PAPER = '#F7FAFC'
const INK = '#161B3C'
const BODY = '#3D4565'
const CLAY = '#3B8FD4'
const CLAY_TX = '#2160A6'
const CLAY_FILL = '#202070'
const SLATE = '#57608A'
const NIGHT = '#111530'
const ICE = '#9BD8F3'
const AMBER_TX = '#7A4E00'

const LOGO = `${import.meta.env.BASE_URL}polarhestar/logo.png`
const LANGS: Lang[] = ['is', 'en', 'de']
const HOME = '/preview/polarhestar'
const tri = (lang: Lang, is: string, en: string, de: string) => (lang === 'is' ? is : lang === 'de' ? de : en)
const MAP_LABEL = (id: string) => MAP_PLACE[id]?.label ?? ''

function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('ph-lang') as Lang | null
      if (saved && LANGS.includes(saved)) return saved
      const nav = (navigator.languages ?? [navigator.language]).map((l) => l.slice(0, 2))
      return nav.find((l): l is Lang => LANGS.includes(l as Lang)) ?? 'en'
    } catch {
      return 'en'
    }
  })
  const set = (l: Lang) => {
    try { localStorage.setItem('ph-lang', l) } catch { /* private mode */ }
    setLang(l)
  }
  return [lang, set]
}

function requestHref(email: string, tour: LongTourX, d: DepartureRow | null, lang: Lang) {
  const name = stegaClean(tour.name[lang])
  const dates = d ? formatRange(d.start, d.end, lang, true) : ''
  const subject = d ? `${name} · ${dates}` : name
  const body = tri(
    lang,
    `Ferð: ${name}\nBrottför: ${dates || '(óskatímabil)'}\nFjöldi knapa:\nReynsla af hestamennsku:\nFyrirspurn eða athugasemdir:\n`,
    `Tour: ${name}\nDeparture: ${dates || '(preferred dates)'}\nNumber of riders:\nRiding experience:\nQuestions or notes:\n`,
    `Tour: ${name}\nTermin: ${dates || '(Wunschzeitraum)'}\nAnzahl Reiter:\nReiterfahrung:\nFragen oder Hinweise:\n`,
  )
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: PAPER, boxShadow: '0 1px 2px rgba(22,27,60,0.05)' }}>
      <p className="font-hanken text-[0.68rem] font-semibold tracking-[0.14em] uppercase" style={{ color: SLATE }}>{label}</p>
      <p className="mt-1 font-hanken text-base font-medium" style={{ color: INK }}>{value}</p>
    </div>
  )
}

function TourPageInner() {
  const { id = '' } = useParams()
  const { LONG_TOURS, EMAIL, PHONE_DISPLAY, PHONE_HREF } = useSiteContent()
  const [lang, setLang] = useLang()
  const tour = LONG_TOURS.find((t) => t.id === id)
  const itinerary = tour?.itinerary ?? ITINERARIES[id]
  const days = itinerary?.days ?? []
  const today = todayIso()
  const rows = useMemo(() => (tour ? upcoming(tour, today) : []), [tour, today])

  const heroRef = useRef<HTMLElement>(null)
  useSmoothScroll()
  useGrowingHero(heroRef, '.ph-tour-frame')

  // the day in reading position lights its places on the map
  const [activeDay, setActiveDay] = useState(1)
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-day]'))
    if (!els.length) return
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) if (e.isIntersecting) setActiveDay(Number((e.target as HTMLElement).dataset.day))
      },
      { rootMargin: '-35% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [days.length])

  useEffect(() => {
    setThemeColor(MIST)
    if (tour) document.title = `${stegaClean(tour.name[lang])} · Pólar Hestar`
    window.scrollTo(0, 0)
  }, [lang, tour])

  const goDay = (n: number) => {
    const el = document.getElementById(`dagur-${n}`)
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
  }

  if (!tour) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-24 font-hanken" style={{ color: BODY }}>
        <p className="font-spectral text-2xl" style={{ color: INK }}>{tri(lang, 'Ferðin fannst ekki.', 'That tour was not found.', 'Diese Tour wurde nicht gefunden.')}</p>
        <Link to={`${HOME}#lengri`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: CLAY_TX }}>
          <ArrowLeft className="h-4 w-4" /> {tri(lang, 'Allar lengri ferðir', 'All long tours', 'Alle langen Touren')}
        </Link>
      </main>
    )
  }

  const facts: Array<[string, string]> = [
    [tri(lang, 'Lengd', 'Length', 'Dauer'), nightsLine(tour, lang)],
    [tri(lang, 'Reiðdagar', 'Riding days', 'Reittage'), String(tour.ridingDays)],
    [tri(lang, 'Dagleiðir', 'Daily rides', 'Tagesritte'), `${tour.kmMin}–${tour.kmMax} km`],
    [tri(lang, 'Laust stóð', 'Free-running herd', 'Freilaufende Herde'), herdLine(tour, lang)],
    [tri(lang, 'Reynsla', 'Riding level', 'Reiterfahrung'), LEVEL[tour.level][lang]],
    [tri(lang, 'Lágmarksaldur', 'Minimum age', 'Mindestalter'), tri(lang, `${tour.minAge} ára`, `${tour.minAge} years`, `${tour.minAge} Jahre`)],
    ...(tour.maxRiders ? [[tri(lang, 'Hámark', 'Group size', 'Teilnehmer'), tri(lang, `${tour.maxRiders} knapar`, `max. ${tour.maxRiders} riders`, `max. ${tour.maxRiders} Reiter`)] as [string, string]] : []),
    [tri(lang, 'Gisting', 'Accommodation', 'Unterkunft'), BEDS[tour.beds][lang]],
    [tri(lang, 'Verð á mann', 'Price per person', 'Preis pro Person'), priceEur(tour.priceEur, lang)],
  ]

  return (
    <div lang={lang} style={{ background: MIST, color: BODY }} className="min-h-screen overflow-x-clip font-hanken antialiased">
      <style>{`
        .ph-tour-frame{clip-path:inset(0 round 0)}
        .ph-day{opacity:.55;transition:opacity .5s ease}
        .ph-day[data-on="true"]{opacity:1}
        .ph-day-rise{animation:phDayRise .7s cubic-bezier(.2,.7,.2,1) both}
        @keyframes phDayRise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        @media (prefers-reduced-motion: reduce){.ph-day{opacity:1;transition:none}.ph-day-rise{animation:none}}
      `}</style>

      <a href="#efni" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold" style={{ color: INK }}>
        {tri(lang, 'Fara beint í efni', 'Skip to content', 'Zum Inhalt springen')}
      </a>
      <header className="sticky top-0 z-30 border-b backdrop-blur-md" style={{ background: `${MIST}e6`, borderColor: '#161B3C12' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-8">
          <Link to={HOME} className="flex shrink-0 items-center gap-2" aria-label={tri(lang, 'Forsíða Pólar Hestar', 'Pólar Hestar home', 'Pólar Hestar Startseite')}>
            <img src={LOGO} alt="" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-2">
            <div role="group" aria-label={tri(lang, 'Tungumál', 'Language', 'Sprache')} className="flex rounded-full border p-[3px] text-[0.72rem] font-semibold" style={{ borderColor: '#1a2a5e22' }}>
              {LANGS.map((code) => (
                <button key={code} type="button" onClick={() => setLang(code)} aria-pressed={lang === code} className="min-h-10 w-11 rounded-full uppercase tracking-[0.1em] transition-colors md:min-h-8 md:w-10" style={lang === code ? { background: INK, color: MIST } : { color: BODY }}>
                  {code}
                </button>
              ))}
            </div>
            <a href={requestHref(EMAIL, tour, rows.find((r) => r.status === 'open' || r.status === 'few') ?? null, lang)} className="hidden rounded-full px-4 py-2 text-sm font-semibold text-white sm:inline-flex" style={{ background: CLAY_FILL }}>
              {tri(lang, 'Senda fyrirspurn', 'Send a request', 'Anfrage senden')}
            </a>
          </div>
        </div>
      </header>

      <main id="efni">
        {/* hero — the frame grows to full-bleed on scroll (desktop) */}
        <section ref={heroRef} className="relative min-h-[88svh] overflow-hidden" style={{ background: NIGHT }}>
          <div className="ph-tour-frame absolute inset-0 overflow-hidden">
            <img
              src={tour.pic.src}
              srcSet={tour.pic.srcSet}
              sizes="100vw"
              alt={altIs(lang, tour.pic.alt) ?? tri(lang, `Íslenskt landslag (${tour.name.is})`, `Icelandic landscape (${tour.name.en})`, `Isländische Landschaft (${tour.name.de})`)}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: tour.pic.pos }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(13,16,40,.25) 0%, rgba(13,16,40,.2) 40%, rgba(13,16,40,.85) 100%)' }} />
          </div>
          <div className="relative z-10 mx-auto flex min-h-[88svh] w-full max-w-6xl flex-col justify-end px-5 pb-14 pt-28 md:px-8 md:pb-20">
            <Link to={`${HOME}#lengri`} className="ph-day-rise mb-6 inline-flex items-center gap-1.5 self-start text-sm font-medium text-white/85">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {tri(lang, 'Allar lengri ferðir', 'All long tours', 'Alle langen Touren')}
            </Link>
            <p className="ph-day-rise text-[0.72rem] font-semibold tracking-[0.2em] uppercase" style={{ color: ICE, animationDelay: '60ms' }}>
              {tri(lang, 'Lengri ferð', 'Long tour', 'Lange Reittour')} · {nightsLine(tour, lang)}
            </p>
            <h1 className="ph-day-rise mt-3 max-w-4xl text-balance font-spectral text-[clamp(2.4rem,1.4rem+4.6vw,4.6rem)] leading-[1.02] text-white" style={{ animationDelay: '120ms' }}>
              {tour.name[lang]}
            </h1>
            <p className="ph-day-rise mt-5 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg" style={{ animationDelay: '200ms' }}>
              {tour.blurb[lang]}
            </p>
            <div className="ph-day-rise mt-7 flex flex-wrap items-center gap-3" style={{ animationDelay: '280ms' }}>
              <a href="#brottfarir" className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold" style={{ background: MIST, color: INK }}>
                {rows.length
                  ? tri(lang, `Brottfarir ${rows[0].year}`, `Departures ${rows[0].year}`, `Termine ${rows[0].year}`)
                  : NO_DATES[lang]}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#dagskra" className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold text-white" style={{ borderColor: 'rgba(255,255,255,.35)' }}>
                {tri(lang, 'Dagur fyrir dag', 'Day by day', 'Tag für Tag')}
              </a>
            </div>
          </div>
        </section>

        {/* facts */}
        <section className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16" aria-label={tri(lang, 'Staðreyndir', 'Facts', 'Fakten')}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {facts.map(([l, v]) => <Fact key={l} label={l} value={v} />)}
          </div>
        </section>

        {/* itinerary + map */}
        {days.length > 0 && (
          <section id="dagskra" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-16 md:px-8 md:pb-24" aria-labelledby="ph-days">
            <p className="text-[0.72rem] font-semibold tracking-[0.16em] uppercase" style={{ color: CLAY_TX }}>
              {tri(lang, 'Dagskrá ferðar', 'Itinerary', 'Reiseverlauf')}
            </p>
            <h2 id="ph-days" className="mt-2 font-spectral text-[clamp(1.8rem,1.2rem+2vw,2.6rem)] leading-tight" style={{ color: INK }}>
              {tri(lang, 'Dagur fyrir dag', 'Day by day', 'Tag für Tag')}
            </h2>
            <div className="mt-4 flex flex-wrap gap-1.5" role="list" aria-label={tri(lang, 'Dagar', 'Days', 'Tage')}>
              {days.map((d) => (
                <button
                  key={d.n}
                  type="button"
                  role="listitem"
                  onClick={() => goDay(d.n)}
                  aria-current={d.n === activeDay ? 'true' : undefined}
                  className="min-h-9 min-w-9 rounded-full px-3 text-sm font-semibold tabular-nums transition-colors"
                  style={d.n === activeDay ? { background: INK, color: MIST } : { background: `${INK}0d`, color: BODY }}
                >
                  {d.n}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
              <div className="lg:sticky lg:top-24 lg:self-start">
                <div className="rounded-[24px] p-3 md:p-4" style={{ background: PAPER, boxShadow: '0 1px 2px rgba(22,27,60,0.05), 0 18px 40px -28px rgba(22,27,60,0.35)' }}>
                  <RegionMap tourId={tour.id} activeDay={activeDay} lang={lang} onPick={goDay} />
                </div>
              </div>
              <ol className="m-0 list-none space-y-6 p-0">
                {days.map((d) => (
                  <li key={d.n} id={`dagur-${d.n}`} data-day={d.n} data-on={d.n === activeDay} className="ph-day scroll-mt-28">
                    <article className="rounded-[22px] p-6 md:p-7" style={{ background: PAPER }}>
                      <div className="flex items-baseline gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full font-hanken text-sm font-bold text-white" style={{ background: d.n === activeDay ? CLAY_FILL : SLATE }} aria-hidden="true">
                          {d.n}
                        </span>
                        <h3 className="font-spectral text-xl leading-snug" style={{ color: INK }}>
                          {tri(lang, `Dagur ${d.n}`, `Day ${d.n}`, `Tag ${d.n}`)}
                          {d.kind ? <span style={{ color: SLATE }}> · {DAY_TITLE[d.kind][lang]}</span> : null}
                        </h3>
                      </div>
                      <p className="mt-3 text-[0.98rem] leading-relaxed" style={{ color: BODY }}>{d.body[lang]}</p>
                      {d.places.length > 0 && (
                        <p className="mt-3 text-xs" style={{ color: CLAY_TX }}>
                          {d.places.map(MAP_LABEL).filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </article>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* departures */}
        <section id="brottfarir" className="scroll-mt-20" style={{ background: NIGHT }}>
          <div className="mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
            <p className="text-[0.72rem] font-semibold tracking-[0.16em] uppercase" style={{ color: ICE }}>
              {tri(lang, 'Brottfarir', 'Departures', 'Termine')}
            </p>
            <h2 className="mt-2 font-spectral text-[clamp(1.8rem,1.2rem+2vw,2.6rem)] leading-tight text-white">
              {rows.length ? tri(lang, `Næstu ferðir ${rows[0].year}`, `Next departures ${rows[0].year}`, `Nächste Termine ${rows[0].year}`) : NO_DATES[lang]}
            </h2>
            {tour.datesNote && <p className="mt-3 max-w-2xl text-sm text-white/80">{tour.datesNote[lang]}</p>}
            <ul className="mt-6 grid gap-3 md:grid-cols-2">
              {rows.map((d) => {
                const open = d.status === 'open' || d.status === 'few'
                return (
                  <li key={d.start} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl px-5 py-4" style={{ background: '#252D5E' }}>
                    <div>
                      <p className="font-hanken text-base font-semibold text-white tabular-nums">{formatRange(d.start, d.end, lang, true)}</p>
                      <p className="mt-0.5 text-xs text-white/70">
                        {weekday(d.start, lang)} → {weekday(d.end, lang)} · {nightsLine(tour, lang)}
                        {d.note ? ` · ${d.note[lang]}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full px-2.5 py-1 text-[0.72rem] font-semibold" style={d.status === 'few' ? { background: '#F2C46D', color: AMBER_TX } : d.status === 'open' ? { background: `${ICE}33`, color: ICE } : { background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.7)' }}>
                        {STATUS_LABEL[d.status][lang]}
                      </span>
                      {open && (
                        <a href={requestHref(EMAIL, tour, d, lang)} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold" style={{ background: MIST, color: INK }}>
                          {tri(lang, 'Fyrirspurn', 'Request', 'Anfrage')} <ArrowRight className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/85">
              <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 underline underline-offset-4"><Mail className="h-4 w-4" style={{ color: ICE }} /> {EMAIL}</a>
              <a href={PHONE_HREF} className="inline-flex items-center gap-2"><Phone className="h-4 w-4" style={{ color: ICE }} /> {PHONE_DISPLAY}</a>
              <Link to={`${HOME}/dagskra#${tour.id}`} className="underline underline-offset-4" style={{ color: CLAY }}>
                {tri(lang, 'Öll dagskráin', 'The whole schedule', 'Der ganze Terminplan')}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <PreviewFooter company={companyEntry} verifiedContent />
      <PreviewChrome company={companyEntry} />
    </div>
  )
}

export default function LongTourPage() {
  return (
    <SiteContentProvider>
      <TourPageInner />
    </SiteContentProvider>
  )
}
