/**
 * Pólar Hestar — the schedule page (/preview/polarhestar/dagskra).
 *
 * One page a guest can trust for "when": every long-tour departure with its
 * status, every short ride with its season and times. Nothing on it is typed
 * by hand. It renders from the same CMS documents as the main page, through
 * schedule.ts, so the card on the front page and the row here can't disagree.
 *
 * Palette and type mirror Page.tsx (kept local so this route doesn't pull the
 * whole front page into its chunk).
 */
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Clock, Mail, Users } from 'lucide-react'
import { stegaClean } from '@sanity/client/stega'
import { companyEntry } from './company'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { SiteContentProvider, useHashLanding, useSiteContent, type LongTourX, type TourX } from './sanity'
import {
  BEDS, LEVEL, NO_DATES, STATUS_LABEL, allDepartures, bookable, formatRange, herdLine, monthShort, monthsLabel,
  nightsLine, priceEur, runsIn, todayIso, upcoming, weekday, type DepartureRow, type Lang,
} from './schedule'

const MIST = '#EDF1F7'
const PAPER = '#F7FAFC'
const INK = '#161B3C'
const BODY = '#3D4565'
const CLAY = '#3B8FD4'
const CLAY_TX = '#2160A6'
const CLAY_FILL = '#202070'
const SLATE = '#57608A'
const NIGHT = '#111530'
const NIGHT2 = '#252D5E'
const ICE = '#9BD8F3'
const AMBER = '#F2C46D' // "few places left" on the night ground only
const AMBER_TX = '#7A4E00' // the same, as text on light (AA)

const LOGO = `${import.meta.env.BASE_URL}polarhestar/logo.png`
const LANGS: Lang[] = ['is', 'en', 'de']
const HOME = '/preview/polarhestar'
const tri = (lang: Lang, is: string, en: string, de: string) => (lang === 'is' ? is : lang === 'de' ? de : en)
const isk = (n: number, lang: Lang) =>
  `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'en' ? ',' : '.')} kr.`

/* ── timeline geometry: a day's position across its calendar year ─────── */
const dayOfYear = (iso: string) => {
  const d = new Date(iso + 'T12:00:00Z')
  const start = Date.UTC(d.getUTCFullYear(), 0, 1)
  return Math.floor((d.getTime() - start) / 86400000)
}
const daysInYear = (y: number) => (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0) ? 366 : 365)
const monthStartPct = (y: number, m: number) => (dayOfYear(`${y}-${String(m).padStart(2, '0')}-01`) / daysInYear(y)) * 100

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

function StatusChip({ status, lang }: { status: DepartureRow['status']; lang: Lang }) {
  const style =
    status === 'open'
      ? { background: `${CLAY}14`, color: CLAY_TX }
      : status === 'few'
        ? { background: `${AMBER}40`, color: AMBER_TX }
        : { background: `${INK}0d`, color: SLATE }
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-1 font-hanken text-[0.72rem] font-semibold whitespace-nowrap" style={style}>
      {STATUS_LABEL[status][lang]}
    </span>
  )
}

/* ── The year at a glance ─────────────────────────────────────────────── */
function YearGlance({
  year, lang, longTours, shortTours, today,
}: { year: number; lang: Lang; longTours: LongTourX[]; shortTours: TourX[]; today: string }) {
  const todayPct = today.startsWith(String(year)) ? (dayOfYear(today) / daysInYear(year)) * 100 : null
  const rows = longTours.map((t) => ({
    t,
    deps: allDepartures(t).filter((d) => d.year === year && d.start >= today && d.status !== 'cancelled'),
  }))
  const grid = (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {Array.from({ length: 12 }, (_, i) => (
        <span key={i} className="absolute top-0 bottom-0 w-px" style={{ left: `${monthStartPct(year, i + 1)}%`, background: '#ffffff12' }} />
      ))}
      {todayPct !== null && (
        <span className="absolute top-0 bottom-0 w-px" style={{ left: `${todayPct}%`, background: `${ICE}99` }} />
      )}
    </div>
  )
  return (
    <figure
      className="ph-dark overflow-hidden rounded-[24px] p-5 md:p-8"
      style={{ background: NIGHT }}
      aria-label={tri(lang, `Yfirlit ársins ${year}`, `The year ${year} at a glance`, `Das Jahr ${year} im Überblick`)}
    >
      <div className="grid grid-cols-1 gap-x-6 md:grid-cols-[13rem_1fr]">
        <div className="hidden md:block" />
        <div className="relative mb-3 h-5" aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => (
            <span
              key={i}
              className="absolute top-0 font-hanken text-[0.66rem] font-semibold tracking-[0.08em] uppercase"
              style={{ left: `${monthStartPct(year, i + 1)}%`, color: '#ffffff8c', paddingLeft: 3 }}
            >
              <span className="md:hidden">{monthShort(i + 1, lang).slice(0, 1)}</span>
              <span className="hidden md:inline">{monthShort(i + 1, lang)}</span>
            </span>
          ))}
        </div>

        {rows.map(({ t, deps }, r) => (
          <div key={t.id} className="contents">
            <a href={`#${t.id}`} className="mt-3 block font-hanken text-[0.8rem] leading-tight text-white/85 hover:text-white md:mt-0 md:self-center md:py-2">
              {t.name[lang]}
            </a>
            <div className="relative h-7 md:h-9">
              {grid}
              {deps.length === 0 && (
                <span className="absolute inset-y-0 left-0 flex items-center font-hanken text-[0.72rem] italic" style={{ color: '#ffffff66' }}>
                  {tri(lang, 'Dagsetningar óbirtar', 'Dates not published', 'Termine offen')}
                </span>
              )}
              {deps.map((d, i) => {
                const left = (dayOfYear(d.start) / daysInYear(year)) * 100
                const width = Math.max(((dayOfYear(d.end) - dayOfYear(d.start) + 1) / daysInYear(year)) * 100, 1.2)
                const full = d.status === 'full'
                return (
                  <span
                    key={d.start}
                    className="ph-bar absolute inset-y-0 my-auto h-3 rounded-full md:h-4"
                    title={`${formatRange(d.start, d.end, lang)} · ${STATUS_LABEL[d.status][lang]}`}
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      background: full ? 'transparent' : d.status === 'few' ? AMBER : ICE,
                      boxShadow: full ? `inset 0 0 0 1.5px ${ICE}73` : 'none',
                      animationDelay: `${80 + r * 45 + i * 25}ms`,
                    }}
                  />
                )
              })}
            </div>
          </div>
        ))}

        <div className="col-span-full my-4 h-px" style={{ background: '#ffffff14' }} />

        {shortTours.map((t) => (
          <div key={t.id} className="contents">
            <span className="mt-2 block font-hanken text-[0.8rem] leading-tight text-white/70 md:mt-0 md:self-center md:py-1.5">
              {t.name[lang]}
            </span>
            <div className="relative h-5 md:h-7">
              {grid}
              {Array.from({ length: 12 }, (_, i) =>
                runsIn(t.months, i + 1) ? (
                  <span
                    key={i}
                    className="absolute inset-y-0 my-auto h-1.5"
                    style={{
                      left: `${monthStartPct(year, i + 1)}%`,
                      width: `${(i === 11 ? 100 : monthStartPct(year, i + 2)) - monthStartPct(year, i + 1)}%`,
                      background: `${ICE}59`,
                    }}
                  />
                ) : null,
              )}
            </div>
          </div>
        ))}
      </div>

      <figcaption className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-hanken text-[0.72rem]" style={{ color: '#ffffffa6' }}>
        <span className="inline-flex items-center gap-2"><i className="block h-2.5 w-6 rounded-full" style={{ background: ICE }} />{STATUS_LABEL.open[lang]}</span>
        <span className="inline-flex items-center gap-2"><i className="block h-2.5 w-6 rounded-full" style={{ background: AMBER }} />{STATUS_LABEL.few[lang]}</span>
        <span className="inline-flex items-center gap-2"><i className="block h-2.5 w-6 rounded-full" style={{ boxShadow: `inset 0 0 0 1.5px ${ICE}73` }} />{STATUS_LABEL.full[lang]}</span>
        <span className="inline-flex items-center gap-2"><i className="block h-1.5 w-6" style={{ background: `${ICE}59` }} />{tri(lang, 'Stuttar ferðir í boði', 'Short rides on offer', 'Kurze Ritte im Angebot')}</span>
        {todayPct !== null && (
          <span className="inline-flex items-center gap-2"><i className="block h-3 w-px" style={{ background: ICE }} />{tri(lang, 'Í dag', 'Today', 'Heute')}</span>
        )}
      </figcaption>
    </figure>
  )
}

/* ── one long tour, with every departure ──────────────────────────────── */
function LongTourBlock({ tour, lang, email, today }: { tour: LongTourX; lang: Lang; email: string; today: string }) {
  // a cancelled date stays listed (struck through) so a guest who saw it earlier isn't left guessing
  const deps = allDepartures(tour).filter((d) => d.start >= today)
  const live = upcoming(tour, today)
  const facts: [string, string][] = [
    [tri(lang, 'Lengd', 'Length', 'Dauer'), nightsLine(tour, lang)],
    [tri(lang, 'Reiðdagar', 'Riding days', 'Reittage'), String(tour.ridingDays)],
    [tri(lang, 'Knapar', 'Riders', 'Reiter'), LEVEL[tour.level][lang].replace(/^(Fyrir|Für) /, '')],
    [tri(lang, 'Lágmarksaldur', 'Minimum age', 'Mindestalter'), tri(lang, `${tour.minAge} ára`, `${tour.minAge} years`, `${tour.minAge} Jahre`)],
    ...(tour.maxRiders
      ? [[tri(lang, 'Hópur', 'Group', 'Gruppe'), tri(lang, `Hámark ${tour.maxRiders}`, `Max ${tour.maxRiders}`, `Max. ${tour.maxRiders}`)] as [string, string]]
      : []),
    [tri(lang, 'Á dag', 'Per day', 'Pro Tag'), `${tour.kmMin}–${tour.kmMax} km`],
    [tri(lang, 'Hross', 'Horses', 'Pferde'), herdLine(tour, lang)],
    [tri(lang, 'Gisting', 'Beds', 'Unterkunft'), BEDS[tour.beds][lang]],
  ]
  return (
    <article id={tour.id} className="scroll-mt-24 overflow-hidden rounded-[24px] ring-1 ring-[#161B3C0f]" style={{ background: PAPER }}>
      <div className="flex flex-col gap-6 p-6 md:flex-row md:p-8">
        <div className="md:w-[40%]">
          <img
            src={tour.pic.src}
            srcSet={tour.pic.srcSet}
            sizes="(max-width: 768px) 100vw, 380px"
            width={760}
            height={570}
            alt={tour.pic.alt ?? ''}
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full rounded-[16px] object-cover"
            style={{ objectPosition: tour.pic.pos }}
          />
          <p className="mt-4 font-hanken text-sm leading-relaxed" style={{ color: BODY }}>{tour.blurb[lang]}</p>
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="font-spectral text-[1.7rem] leading-tight" style={{ color: INK }}>{tour.name[lang]}</h3>
            <p className="font-hanken text-sm" style={{ color: SLATE }}>
              <span className="font-spectral text-2xl tabular-nums" style={{ color: CLAY_TX }}>{priceEur(tour.priceEur, lang)}</span>{' '}
              {tri(lang, 'á mann', 'per person', 'pro Person')}
            </p>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 border-y py-4 sm:grid-cols-4" style={{ borderColor: '#161B3C14' }}>
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="font-hanken text-[0.68rem] font-semibold tracking-[0.1em] uppercase" style={{ color: SLATE }}>{k}</dt>
                <dd className="mt-0.5 font-hanken text-[0.84rem] leading-snug" style={{ color: INK }}>{v}</dd>
              </div>
            ))}
          </dl>

          <h4 className="mt-5 font-hanken text-[0.72rem] font-semibold tracking-[0.14em] uppercase" style={{ color: CLAY_TX }}>
            {tri(lang, 'Brottfarir', 'Departures', 'Termine')}
          </h4>
          {deps.length ? (
            <ul className="mt-2 divide-y" style={{ borderColor: '#161B3C12' }}>
              {deps.map((d) => {
                const gone = d.status === 'cancelled'
                return (
                  <li key={d.start} id={`${tour.id}-${d.start}`} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3" style={{ borderColor: '#161B3C12' }}>
                    <div className="min-w-0">
                      <p className={`font-hanken text-[0.95rem] font-semibold tabular-nums ${gone ? 'line-through' : ''}`} style={{ color: gone ? SLATE : INK }}>
                        {formatRange(d.start, d.end, lang, true)}
                      </p>
                      <p className="font-hanken text-xs" style={{ color: SLATE }}>
                        {tri(lang, 'Sótt á Akureyri', 'Pickup in Akureyri', 'Abholung in Akureyri')}, {weekday(d.start, lang)}
                        {d.note?.[lang] ? ` · ${d.note[lang]}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusChip status={d.status} lang={lang} />
                      {bookable(d) && (
                        <a
                          href={requestHref(email, tour, d, lang)}
                          className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 font-hanken text-[0.8rem] font-semibold text-white transition-transform hover:-translate-y-0.5"
                          style={{ background: CLAY_FILL }}
                          aria-label={tri(
                            lang,
                            `Senda fyrirspurn um ${stegaClean(tour.name.is)}, ${formatRange(d.start, d.end, 'is', true)}`,
                            `Request ${stegaClean(tour.name.en)}, ${formatRange(d.start, d.end, 'en', true)}`,
                            `${stegaClean(tour.name.de)} anfragen, ${formatRange(d.start, d.end, 'de', true)}`,
                          )}
                        >
                          <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                          {tri(lang, 'Fyrirspurn', 'Request', 'Anfragen')}
                        </a>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : null}
          {!live.length && (
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-[14px] px-4 py-3" style={{ background: `${INK}08` }}>
              <p className="font-hanken text-sm" style={{ color: BODY }}>{(tour.datesNote?.[lang] || '').trim() || NO_DATES[lang]}</p>
              <a href={requestHref(email, tour, null, lang)} className="font-hanken text-sm font-semibold underline underline-offset-4" style={{ color: CLAY_TX }}>
                {tri(lang, 'Spyrja um dagsetningar', 'Ask about dates', 'Nach Terminen fragen')}
              </a>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

function SchedulePageInner() {
  const { LONG_TOURS, SHORT_TOURS, SCHEDULE, EMAIL, CHILD_DISCOUNT, PHONE_DISPLAY, PHONE_HREF } = useSiteContent()
  const [lang, setLang] = useLang()
  useHashLanding()
  const today = todayIso()

  const years = useMemo(() => {
    const ys = [...new Set(LONG_TOURS.flatMap((t) => upcoming(t, today).map((d) => d.year)))].sort()
    return ys.length ? ys : [Number(today.slice(0, 4))]
  }, [LONG_TOURS, today])
  const [year, setYear] = useState<number | null>(null)
  const shownYear = year !== null && years.includes(year) ? year : years[0]

  useEffect(() => {
    setThemeColor(MIST)
    document.title = tri(lang, 'Dagskrá og dagsetningar · Pólar Hestar', 'Schedule and dates · Pólar Hestar', 'Termine · Pólar Hestar')
  }, [lang])

  return (
    <div lang={lang} style={{ background: MIST, color: BODY }} className="min-h-screen overflow-x-hidden font-hanken antialiased">
      <style>{`
        .ph-bar{transform-origin:left center;animation:phBar .4s cubic-bezier(.2,.7,.2,1) both}
        @keyframes phBar{from{transform:scaleX(0);opacity:0}to{transform:none;opacity:1}}
        @keyframes phFade{from{opacity:0}to{opacity:1}}
        @media (prefers-reduced-motion: reduce){.ph-bar{animation:phFade .2s ease-out both}}
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
            <div role="group" aria-label={tri(lang, 'Tungumál', 'Language', 'Sprache')} className="flex rounded-full border p-[3px] text-[0.72rem] font-semibold" style={{ borderColor: '#1a205226' }}>
              {LANGS.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  className="min-h-10 w-11 rounded-full uppercase tracking-[0.1em] transition-colors md:min-h-8 md:w-10"
                  style={lang === code ? { background: INK, color: MIST } : { color: BODY }}
                >
                  {code}
                </button>
              ))}
            </div>
            <Link to={`${HOME}#boka`} className="hidden rounded-full px-4 py-2 text-sm font-semibold text-white sm:inline-flex" style={{ background: CLAY_FILL }}>
              {tri(lang, 'Bóka reiðtúr', 'Book a ride', 'Ritt buchen')}
            </Link>
          </div>
        </div>
      </header>

      <main id="efni" className="mx-auto max-w-6xl px-4 pt-10 pb-20 md:px-8 md:pt-16">
        <Link to={`${HOME}#lengri`} className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: SLATE }}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {tri(lang, 'Til baka á forsíðu', 'Back to the front page', 'Zurück zur Startseite')}
        </Link>
        <p className="mt-8 text-[0.72rem] font-semibold tracking-[0.16em] uppercase" style={{ color: CLAY_TX }}>{SCHEDULE.eyebrow[lang]}</p>
        <h1 className="mt-2 max-w-3xl text-balance font-spectral text-[clamp(2.1rem,1.4rem+3vw,3.6rem)] leading-[1.05]" style={{ color: INK }}>
          {SCHEDULE.title[lang]}
        </h1>
        <p className="mt-4 max-w-2xl text-[1.02rem] leading-relaxed">{SCHEDULE.intro[lang]}</p>

        <section className="mt-10" aria-labelledby="ph-year">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 id="ph-year" className="font-spectral text-2xl" style={{ color: INK }}>
              {tri(lang, `Árið ${shownYear}`, `${shownYear} at a glance`, `${shownYear} im Überblick`)}
            </h2>
            {years.length > 1 && (
              <div role="group" aria-label={tri(lang, 'Ár', 'Year', 'Jahr')} className="flex gap-1 rounded-full p-1" style={{ background: `${INK}0d` }}>
                {years.map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => setYear(y)}
                    aria-pressed={y === shownYear}
                    className="min-h-9 rounded-full px-4 text-sm font-semibold tabular-nums"
                    style={y === shownYear ? { background: INK, color: MIST } : { color: BODY }}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>
          <YearGlance year={shownYear} lang={lang} longTours={LONG_TOURS} shortTours={SHORT_TOURS} today={today} />
        </section>

        <section className="mt-16" aria-labelledby="ph-long">
          <h2 id="ph-long" className="font-spectral text-[clamp(1.6rem,1.2rem+1.4vw,2.2rem)]" style={{ color: INK }}>
            {tri(lang, 'Lengri ferðir', 'Long rides', 'Lange Reittouren')}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed">{SCHEDULE.longTerms[lang]}</p>
          <div className="mt-7 flex flex-col gap-6">
            {LONG_TOURS.map((t) => (
              <LongTourBlock key={t.id} tour={t} lang={lang} email={EMAIL} today={today} />
            ))}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="ph-short">
          <h2 id="ph-short" className="font-spectral text-[clamp(1.6rem,1.2rem+1.4vw,2.2rem)]" style={{ color: INK }}>
            {tri(lang, 'Stuttar ferðir', 'Short rides', 'Kurze Ritte')}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed">
            {SCHEDULE.shortTerms[lang]}{' '}
            {tri(
              lang,
              `Börn 12 ára og yngri greiða ${isk(CHILD_DISCOUNT, lang)} minna.`,
              `Children aged 12 and under pay ${isk(CHILD_DISCOUNT, lang)} less.`,
              `Kinder bis 12 Jahre zahlen ${isk(CHILD_DISCOUNT, lang)} weniger.`,
            )}
          </p>
          <ul className="mt-7 grid gap-4 md:grid-cols-2">
            {SHORT_TOURS.map((t) => (
              <li key={t.id} id={t.id} className="scroll-mt-24 flex flex-col rounded-[20px] p-5 ring-1 ring-[#161B3C0f] md:p-6" style={{ background: PAPER }}>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-spectral text-xl leading-snug" style={{ color: INK }}>{t.name[lang]}</h3>
                  <p className="shrink-0 font-spectral text-xl tabular-nums" style={{ color: CLAY_TX }}>{isk(t.price, lang)}</p>
                </div>
                <p className="mt-1 text-xs" style={{ color: SLATE }}>
                  {tri(lang, 'Börn', 'Children', 'Kinder')} {isk(Math.max(0, t.price - CHILD_DISCOUNT), lang)}
                  {' · '}
                  {t.level[lang]}
                  {t.minRiders > 1 ? ` · ${tri(lang, `lágmark ${t.minRiders} knapar`, `min. ${t.minRiders} riders`, `mind. ${t.minRiders} Reiter`)}` : ''}
                </p>
                <dl className="mt-4 grid grid-cols-2 gap-3 border-t pt-4 text-[0.84rem]" style={{ borderColor: '#161B3C14', color: INK }}>
                  <div>
                    <dt className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase" style={{ color: SLATE }}>{tri(lang, 'Tímabil', 'Season', 'Saison')}</dt>
                    <dd className="mt-0.5">{monthsLabel(t.months, lang)}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase" style={{ color: SLATE }}>{tri(lang, 'Brottför', 'Departs', 'Abritt')}</dt>
                    <dd className="mt-0.5 flex flex-wrap gap-1.5">
                      {t.times?.length ? (
                        t.times.map((h) => (
                          <span key={h} className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 tabular-nums" style={{ background: `${INK}0a` }}>
                            <Clock className="h-3 w-3" aria-hidden="true" style={{ color: SLATE }} />
                            {h}
                          </span>
                        ))
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" aria-hidden="true" style={{ color: SLATE }} />
                          {tri(lang, 'Eftir samkomulagi', 'By arrangement', 'Nach Absprache')}
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
                <Link
                  to={`${HOME}?ferd=${encodeURIComponent(t.id)}#boka`}
                  className="mt-5 inline-flex items-center gap-1 self-start text-sm font-semibold"
                  style={{ color: CLAY_TX }}
                >
                  {tri(lang, 'Bóka þessa ferð', 'Book this ride', 'Diesen Ritt buchen')}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm">
            {tri(lang, 'Breytingar eða seinkun samdægurs? Hringdu í', 'Same-day change or running late? Call', 'Kurzfristige Änderung oder Verspätung? Rufen Sie an:')}{' '}
            <a href={PHONE_HREF} className="font-semibold underline underline-offset-4" style={{ color: CLAY_TX }}>{PHONE_DISPLAY}</a>
          </p>
        </section>
      </main>

      <div className="border-t" style={{ borderColor: '#161B3C12', background: NIGHT2 }} />
      <PreviewFooter company={companyEntry} verifiedContent />
      <PreviewChrome company={companyEntry} />
    </div>
  )
}

export default function PolarHestarSchedulePage() {
  return (
    <SiteContentProvider>
      <SchedulePageInner />
    </SiteContentProvider>
  )
}
