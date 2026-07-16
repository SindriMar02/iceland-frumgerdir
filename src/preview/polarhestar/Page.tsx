import { Fragment, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Facebook,
  Instagram,
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
import { COPY, INSTAGRAM, TRIPADVISOR, type Lang } from './data'
import { stegaClean } from '@sanity/client/stega'
import { SiteContentProvider, useSiteContent, type TourX } from './sanity'

const company = getPreviewCompany('polarhestar')

/* ── Palette — Polar North, built from the logo: glacier white, the logo's
      navy #202070, fjord blue from its gradient, ice-blue highlights ── */
const MIST = '#EDF1F7' // glacier white — cool light ground
const PAPER = '#F7FAFC' // lighter icy card
const INK = '#161B3C' // deep navy ink — text on light
const BODY = '#3D4565' // slate-navy body text on light
const CLAY = '#3B8FD4' // fjord blue — bright accent, decorative icons, tints
const CLAY_TX = '#2160A6' // fjord blue as text on light grounds (AA ≥4.5)
const CLAY_FILL = '#202070' // the logo navy itself — button fill behind white text
const CLAY_HI = '#9BD8F3' // logo ice-blue — accent on dark grounds
const SLATE = '#57608A' // cool slate — secondary text/icons on light (AA)
const TWILIGHT = '#1D2456' // deep indigo — feature band ground
const NIGHT = '#111530' // darkest polar night — seasons + final CTA
const NIGHT2 = '#252D5E' // navy card / active tab on night ground
const ICE = '#9BD8F3' // logo ice-blue (alias of CLAY_HI on night sections)

const LOGO = `${import.meta.env.BASE_URL}polarhestar/logo.png`

const LANGS: Lang[] = ['is', 'en', 'de']
const LANG_NAMES: Record<Lang, string> = { is: 'Íslenska', en: 'English', de: 'Deutsch' }

/* The herd walks in a 4-step size rhythm — tall mare, small foal, wide grazer, medium. */
const HERD_RHYTHM = [
  'h-52 w-40 md:h-64 md:w-48',
  'mt-6 h-40 w-32 md:mt-10 md:h-48 md:w-36',
  'h-48 w-56 md:h-56 md:w-72',
  'mt-3 h-44 w-36 md:mt-5 md:h-60 md:w-44',
]

/* ── helpers ──────────────────────────────────────────────────────────── */
const isk = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'
// hand-rolled for IS — Chrome's is-IS locale data is unreliable (falls back to English)
const MONTHS_IS = ['janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní', 'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember']
const fmtDate = (iso: string, lang: Lang) => {
  const d = new Date(iso + 'T00:00:00')
  if (!iso || Number.isNaN(d.getTime())) return '' // mid-typing/cleared input must never throw
  if (lang === 'is') return `${d.getDate()}. ${MONTHS_IS[d.getMonth()]} ${d.getFullYear()}`
  const locale = lang === 'de' ? 'de-DE' : 'en-GB'
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(d)
}
/** Trilingual inline pick for tiny UI strings that don't live in COPY. */
const tri = (lang: Lang, is: string, en: string, de: string) => (lang === 'is' ? is : lang === 'de' ? de : en)
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
    // Failsafe for throttled tabs/odd embeds: only force-show what should already
    // be on screen — below-fold sections keep their scroll choreography.
    const t = window.setTimeout(() => {
      if (el.getBoundingClientRect().top < window.innerHeight * 1.25) setShown(true)
    }, 1600)
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
function Eyebrow({ children, on = 'light', tint }: { children: ReactNode; on?: 'light' | 'dark'; tint?: string }) {
  return (
    <p
      className="font-hanken text-[0.72rem] font-semibold tracking-[0.24em] uppercase"
      style={{ color: tint ?? (on === 'dark' ? CLAY_HI : CLAY_TX) }}
    >
      {children}
    </p>
  )
}

/* ── Header dropdown — state-driven so hover, keyboard and touch all agree:
      mouse hovers open it, focus keeps it open, Escape closes and restores
      focus, and on touch the first tap opens instead of navigating ── */
function NavDropdown({
  href,
  label,
  kids,
  on,
  color,
}: {
  href: string
  label: string
  kids: [string, string][]
  on: boolean
  color: string
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLAnchorElement>(null)
  const coarse = useRef(false)
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])
  return (
    <div
      ref={wrapRef}
      className="group relative"
      data-open={open}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') setOpen(true)
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') setOpen(false)
      }}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          setOpen(false)
          triggerRef.current?.focus()
        }
      }}
    >
      <a
        ref={triggerRef}
        href={href}
        className="ph-navlink inline-flex items-center gap-1 font-hanken text-sm font-medium transition-colors"
        data-active={on}
        style={{ color }}
        aria-haspopup="true"
        aria-expanded={open}
        onPointerDown={(e) => {
          coarse.current = e.pointerType !== 'mouse'
        }}
        onClick={(e) => {
          if (coarse.current && !open) {
            e.preventDefault() // first touch opens the menu instead of jumping away
            setOpen(true)
          } else {
            setOpen(false)
          }
        }}
      >
        {label}
        <ChevronDown
          className="h-3 w-3 opacity-70 transition-transform duration-300 group-data-[open=true]:rotate-180"
          aria-hidden="true"
        />
      </a>
      <div className="invisible absolute left-0 top-full z-50 translate-y-1 pt-3 opacity-0 transition-all duration-300 ease-[cubic-bezier(.2,.7,.2,1)] group-data-[open=true]:visible group-data-[open=true]:translate-y-0 group-data-[open=true]:opacity-100">
        <div
          className="min-w-[13rem] rounded-2xl p-1.5 shadow-[0_2px_8px_-3px_rgba(18,23,56,0.15),0_24px_48px_-24px_rgba(18,23,56,0.55)] ring-1 ring-[#161B3C14] backdrop-blur-xl"
          style={{ background: 'rgba(247,250,252,0.85)' }}
        >
          {kids.map(([h, sub]) => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="ph-dd-item font-hanken text-sm font-medium">
              {sub}
              <ChevronRight className="ph-dd-arrow h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Word-mask rise — words climb out of overflow masks; driven by the
      nearest .ph-reveal ancestor's data-show, so it shares its failsafe ── */
function MaskWords({ text, stagger = 45, base = 0 }: { text: string; stagger?: number; base?: number }) {
  return (
    <>
      {text.split(' ').map((w, i, arr) => (
        <Fragment key={`${w}-${i}`}>
          <span className="ph-w">
            <span className="ph-wi" style={{ transitionDelay: `${base + i * stagger}ms` }}>
              {w}
            </span>
          </span>
          {i < arr.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </>
  )
}

/* ── Count-up — time-sampled (can't freeze mid-count) + hard failsafe ──── */
function CountUp({
  to,
  decimals = 0,
  lang,
  duration = 1600,
}: {
  to: number
  decimals?: number
  lang: Lang
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [val, setVal] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(to)
      return
    }
    let raf = 0
    let started = false
    const run = () => {
      const t0 = performance.now()
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration)
        setVal(to * (1 - Math.pow(1 - p, 3)))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started) {
          started = true
          run()
          io.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    const failsafe = window.setTimeout(() => {
      if (!started) {
        started = true
        setVal(to)
      }
    }, 2200)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.clearTimeout(failsafe)
    }
  }, [to, duration])
  // Intl 'is-IS' falls back to a dot in some Chromes — force the Icelandic comma
  const fixed = val.toFixed(decimals)
  const txt = lang === 'en' ? fixed : fixed.replace('.', ',') // is + de use decimal comma
  return (
    <span ref={ref} className="tabular-nums">
      {txt}
    </span>
  )
}

/* ── Booking panel — the flaw-fixing centrepiece (date with year, live price) ── */
/* Module scope (not inside Booking) so React keeps identity across renders —
   inline declarations remounted on every keystroke and dropped keyboard focus. */
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
  lang,
}: {
  label: string
  value: number
  set: (n: number) => void
  min: number
  lang: Lang
}) => {
  const prev = useRef(value)
  const dir = value >= prev.current ? 1 : -1
  useEffect(() => {
    prev.current = value
  }, [value])
  return (
  <div className="flex items-center justify-between gap-3 py-2">
    <span className="font-hanken text-sm" style={{ color: BODY }}>
      {label}
    </span>
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => set(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`${label}: ${tri(lang, 'fækka', 'decrease', 'verringern')}`}
        className="grid h-11 w-11 place-items-center rounded-full border transition-colors disabled:opacity-30"
        style={{ borderColor: '#0000001f', color: INK }}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="ph-numwrap w-5 text-center font-hanken text-base font-semibold tabular-nums" style={{ color: INK }}>
        <span key={value} className={dir > 0 ? 'ph-num-up' : 'ph-num-dn'}>{value}</span>
      </span>
      <button
        type="button"
        onClick={() => set(Math.min(10, value + 1))}
        aria-label={`${label}: ${tri(lang, 'fjölga', 'increase', 'erhöhen')}`}
        className="grid h-11 w-11 place-items-center rounded-full border transition-colors hover:bg-black/5"
        style={{ borderColor: '#0000001f', color: INK }}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  </div>
  )
}

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
  const { SHORT_TOURS, BOOKING_EMAIL, PHONE_DISPLAY, PHONE_HREF, PICS, CHILD_DISCOUNT } = useSiteContent()
  const tour = SHORT_TOURS.find((x) => x.id === selectedId) ?? SHORT_TOURS[0]
  const today = new Date()
  const [date, setDate] = useState(() => isoDay(new Date(today.getTime() + 7 * 864e5)))
  const [time, setTime] = useState<string | null>(tour.times?.[0] ?? null)
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [done, setDone] = useState(false)
  /** Frozen at the moment of a successful send, so later tour clicks can't rewrite the receipt. */
  const [receipt, setReceipt] = useState<{
    tourId: string
    tourName: string
    date: string
    time: string | null
    adults: number
    children: number
    total: number
  } | null>(null)
  const doneHeadRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (done) doneHeadRef.current?.focus() // announce + anchor keyboard users on success
  }, [done])
  // Picking a different tour starts a fresh request (and keeps its published times valid)
  useEffect(() => {
    setTime(tour.times?.[0] ?? null)
    setDone(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour.id])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')

  const childPrice = Math.max(tour.price - CHILD_DISCOUNT, 0)
  const total = tour.price * adults + childPrice * children
  // seasonal tours: whisper, never block — the owner may make exceptions
  const chosenMonth = date ? new Date(date + 'T00:00:00').getMonth() + 1 : 0
  const offSeason = !!tour.months?.length && chosenMonth > 0 && !tour.months.includes(chosenMonth)

  /** Real booking request → the owner's booking inbox (FormSubmit relay). */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    // a hung network must never leave the button stuck at "Sendi…"
    const ctrl = new AbortController()
    const kill = window.setTimeout(() => ctrl.abort(), 15000)
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(BOOKING_EMAIL)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        signal: ctrl.signal,
        body: JSON.stringify({
          _subject: `Bókunarbeiðni: ${stegaClean(tour.name.is)} · ${date}`,
          _template: 'table',
          _replyto: email,
          _honey: '', // spam honeypot
          'Ferð': `${stegaClean(tour.name.is)} (${stegaClean(tour.meta.is)})`,
          'Dagsetning': date,
          'Brottfarartími': time ?? 'Eftir samkomulagi',
          'Fullorðnir': String(adults),
          'Börn (12 og yngri)': String(children),
          'Áætlað verð': isk(total),
          'Nafn': name,
          'Netfang': email,
          'Sími': phone || 'Ekki gefið upp',
          'Skilaboð': note || 'Ekki gefið upp',
          'Tungumál gests': LANG_NAMES[lang],
        }),
      })
      const json = (await res.json().catch(() => null)) as { success?: string | boolean } | null
      if (res.ok && json && String(json.success) === 'true') {
        setStatus('idle')
        setReceipt({ tourId: tour.id, tourName: stegaClean(tour.name[lang]), date, time, adults, children, total })
        setDone(true)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    } finally {
      window.clearTimeout(kill)
    }
  }

  return (
    <div className="grid gap-0 overflow-hidden rounded-[28px] shadow-[0_2px_4px_rgba(9,12,36,0.2),0_16px_32px_-16px_rgba(9,12,36,0.35),0_48px_96px_-40px_rgba(9,12,36,0.55)] ring-1 ring-white/10 md:grid-cols-2" style={{ background: PAPER }}>
      {/* image side */}
      <div className="relative min-h-[240px] overflow-hidden md:min-h-full">
        <Img
          src={PICS.booking.src}
          srcSet={PICS.booking.srcSet}
          sizes="(max-width: 768px) 100vw, 520px"
          alt={
            PICS.booking.alt ??
            tri(lang, 'Tveir íslenskir hestar á beit', 'Two Icelandic horses grazing', 'Zwei grasende Islandpferde')
          }
          className="ph-drift absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: PICS.booking.pos }}
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(120deg, ${TWILIGHT}e6, ${TWILIGHT}b3 55%, ${TWILIGHT}80 100%)` }} />
        <div className="relative p-6 md:p-8">
          <p className="max-w-[15rem] font-spectral text-2xl leading-snug text-white md:text-3xl">{t.bookPanelLine}</p>
          <p className="mt-2 max-w-[15rem] font-hanken text-sm text-white/85">{t.bookBody}</p>
        </div>
      </div>

      {/* form side */}
      <div className="p-6 md:p-8">
        {done ? (
          <div role="status" className="flex h-full flex-col items-start justify-center">
            <span className="ph-pop grid h-12 w-12 place-items-center rounded-full" style={{ background: CLAY_FILL }}>
              <Check className="h-6 w-6 text-white" />
            </span>
            <h3 ref={doneHeadRef} tabIndex={-1} className="ph-up mt-4 font-spectral text-2xl outline-none" style={{ color: INK, animationDelay: '60ms' }}>
              {t.confirmedTitle}
            </h3>
            <p className="ph-up mt-2 font-hanken text-sm leading-relaxed" style={{ color: BODY, animationDelay: '100ms' }}>
              {t.confirmedBody}
            </p>
            <dl className="ph-up mt-5 w-full space-y-1.5 rounded-2xl p-4 font-hanken text-sm" style={{ background: MIST, color: INK, animationDelay: '140ms' }}>
              <div className="flex justify-between gap-4">
                <dt style={{ color: BODY }}>{receipt?.tourName ?? tour.name[lang]}</dt>
                <dd className="font-semibold">
                  {fmtDate(receipt?.date ?? date, lang)}
                  {receipt?.time ? ` · ${receipt.time}` : ''}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt style={{ color: BODY }}>
                  {receipt?.adults ?? adults}{' '}
                  {(receipt?.adults ?? adults) === 1
                    ? tri(lang, 'fullorðinn', 'adult', 'Erwachsener')
                    : tri(lang, 'fullorðnir', 'adults', 'Erwachsene')}
                  {(receipt?.children ?? children) > 0
                    ? ` · ${receipt?.children ?? children} ${
                        (receipt?.children ?? children) === 1
                          ? tri(lang, 'barn', 'child', 'Kind')
                          : tri(lang, 'börn', 'children', 'Kinder')
                      }`
                    : ''}
                </dt>
                <dd className="font-semibold">{isk(receipt?.total ?? total)}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={() => setDone(false)}
              className="ph-up mt-5 font-hanken text-sm font-semibold underline underline-offset-4"
              style={{ color: CLAY_TX, animationDelay: '180ms' }}
            >
              {t.bookAgain}
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
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
            <p key={tour.id} className="ph-tick -mt-2 mb-5 font-hanken text-sm" style={{ color: INK }}>
              <span className="font-semibold">{tour.name[lang]}</span>
              <span style={{ color: SLATE }}>
                {' '}· {tour.meta[lang]} · {isk(tour.price)} {t.perPerson}
              </span>
            </p>

            <Step n={2} label={t.stepDate} />
            <label className={`block ${tour.times?.length ? 'mb-3' : 'mb-5'}`}>
              <span className="sr-only">{t.dateLabel}</span>
              <div className="flex items-center gap-2 rounded-xl border px-3.5 py-3" style={{ borderColor: '#0000001f', background: MIST }}>
                <Calendar className="h-4 w-4 shrink-0" style={{ color: CLAY_TX }} aria-hidden="true" />
                <input
                  type="date"
                  required
                  value={date}
                  min={isoDay(today)}
                  max={isoDay(new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()))}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent font-hanken text-sm outline-none"
                  style={{ color: INK }}
                />
              </div>
              <span className="mt-1.5 block font-hanken text-xs" style={{ color: SLATE }}>
                {fmtDate(date, lang)}
              </span>
              {offSeason && (
                <span role="status" className="mt-1.5 block font-hanken text-xs leading-relaxed" style={{ color: CLAY_TX }}>
                  {tri(
                    lang,
                    `${stegaClean(tour.name.is)} er árstíðabundin ferð (${stegaClean(tour.meta.is)}). Veldu dag innan tímabilsins eða aðra ferð.`,
                    `${stegaClean(tour.name.en)} runs seasonally (${stegaClean(tour.meta.en)}). Pick a date in that window, or another tour.`,
                    `${stegaClean(tour.name.de)} findet saisonal statt (${stegaClean(tour.meta.de)}). Wählen Sie ein Datum in diesem Zeitraum oder eine andere Tour.`,
                  )}
                </span>
              )}
            </label>
            {!!tour.times?.length && (
              <fieldset className="mb-5">
                <legend className="mb-1.5 font-hanken text-xs tracking-wide uppercase" style={{ color: SLATE }}>
                  {t.timeLabel}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {tour.times.map((slot) => {
                    const active = slot === time
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTime(slot)}
                        aria-pressed={active}
                        className="rounded-full border px-3.5 py-2 font-hanken text-sm font-medium tabular-nums transition-all"
                        style={
                          active
                            ? { background: INK, color: MIST, borderColor: INK }
                            : { background: 'transparent', color: BODY, borderColor: '#0000001f' }
                        }
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            )}

            <Step n={3} label={t.stepRiders} />
            <div className="divide-y" style={{ borderColor: '#0000000f' }}>
              <Stepper label={t.adults} value={adults} set={setAdults} min={1} lang={lang} />
              <Stepper label={t.children} value={children} set={setChildren} min={0} lang={lang} />
            </div>
            <div className="mt-5">
              <Step n={4} label={t.stepContact} />
              <div className="space-y-2.5">
                <label className="block">
                  <span className="mb-1 block font-hanken text-xs font-medium" style={{ color: SLATE }}>
                    {t.nameLabel}
                  </span>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border px-3.5 py-3 font-hanken text-sm outline-none"
                    style={{ borderColor: '#0000001f', background: MIST, color: INK }}
                  />
                </label>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block font-hanken text-xs font-medium" style={{ color: SLATE }}>
                      {t.emailLabel}
                    </span>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border px-3.5 py-3 font-hanken text-sm outline-none"
                      style={{ borderColor: '#0000001f', background: MIST, color: INK }}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block font-hanken text-xs font-medium" style={{ color: SLATE }}>
                      {t.phoneLabel}
                    </span>
                    <input
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border px-3.5 py-3 font-hanken text-sm outline-none"
                      style={{ borderColor: '#0000001f', background: MIST, color: INK }}
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1 block font-hanken text-xs font-medium" style={{ color: SLATE }}>
                    {t.noteLabel}
                  </span>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full resize-none rounded-xl border px-3.5 py-3 font-hanken text-sm outline-none"
                    style={{ borderColor: '#0000001f', background: MIST, color: INK }}
                  />
                </label>
              </div>
            </div>

            {status === 'error' && (
              <p role="alert" className="mt-3 rounded-xl px-3.5 py-2.5 font-hanken text-xs leading-relaxed" style={{ background: '#FBE9E9', color: '#8C2B2B' }}>
                {t.errorText} <a className="font-semibold underline underline-offset-2" href={PHONE_HREF}>{PHONE_DISPLAY}</a>
              </p>
            )}

            <div className="mt-5 flex items-end justify-between border-t pt-4" style={{ borderColor: '#0000001a' }}>
              <div>
                <p className="font-hanken text-xs tracking-wide uppercase" style={{ color: SLATE }}>
                  {t.totalLabel}
                </p>
                {children > 0 && (
                  <p className="font-hanken text-xs tabular-nums" style={{ color: SLATE }}>
                    {adults} × {isk(tour.price)} · {children} × {isk(childPrice)}
                  </p>
                )}
                <p className="font-spectral text-3xl" style={{ color: INK }}>
                  <span key={total} className="ph-tick">
                    {isk(total)}
                  </span>
                </p>
                {children > 0 && (
                  <p className="font-hanken text-xs" style={{ color: SLATE }}>
                    {t.childDiscountApplied}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                data-busy={status === 'sending'}
                className="ph-cta-send inline-flex items-center gap-2 rounded-full px-5 py-3 font-hanken text-sm font-semibold text-white shadow-lg transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
                style={{ background: CLAY_FILL }}
              >
                {status === 'sending' ? t.sendingBtn : t.confirmBtn}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 flex items-center gap-1.5 font-hanken text-xs" style={{ color: SLATE }}>
              <Check className="h-3.5 w-3.5 shrink-0" style={{ color: CLAY_TX }} aria-hidden="true" />
              {t.bookNoPay}
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

/* ── Seasons — signature "Ljós Norðursins" switcher ───────────────────── */
function SeasonSwitcher({ t, lang }: { t: typeof COPY['is']; lang: Lang }) {
  const { SEASONS } = useSiteContent()
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const firstMount = useRef(true)
  useEffect(() => {
    firstMount.current = false
  }, [])
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
    <div className="relative">
      {/* the season's light floods the whole room, not just the panel */}
      {SEASONS.map((s, i) => (
        <div
          key={s.id}
          aria-hidden="true"
          className="ph-glow pointer-events-none absolute -inset-x-24 -top-44 h-96"
          style={{ opacity: i === active ? 1 : 0, background: `radial-gradient(60% 100% at 50% 0%, ${s.glow}1f, transparent 70%)` }}
        />
      ))}
      <div
        role="tabpanel"
        id="season-panel"
        aria-labelledby={`season-tab-${season.id}`}
        className="relative aspect-[16/10] w-full overflow-hidden rounded-[28px] md:aspect-[21/9]"
      >
        {SEASONS.map((s, i) => (
          <Img
            key={s.id}
            src={s.pic.src}
            srcSet={s.pic.srcSet}
            sizes="(max-width: 1100px) 100vw, 1100px"
            alt={
              s.pic.alt ??
              tri(
                lang,
                `Íslenskir hestar (${s.name.is.toLowerCase()})`,
                `Icelandic horses (${s.name.en.toLowerCase()})`,
                `Islandpferde (${s.name.de.toLowerCase()})`,
              )
            }
            className="ph-season-img absolute inset-0 h-full w-full object-cover"
            style={{ opacity: i === active ? 1 : 0, transform: i === active ? 'scale(1)' : 'scale(1.06)', objectPosition: s.pic.pos }}
          />
        ))}
        {/* legibility scrim + season glow (stacked layers: gradients can't
            transition, opacity can — the light truly dissolves between seasons) */}
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${NIGHT}22 0%, transparent 30%, ${NIGHT}e6 100%)` }} />
        {SEASONS.map((s, i) => (
          <div
            key={s.id}
            aria-hidden="true"
            className="ph-glow pointer-events-none absolute inset-0"
            style={{ opacity: i === active ? 1 : 0, background: `radial-gradient(80% 60% at 50% 12%, ${s.glow}33, transparent 60%)` }}
          />
        ))}
        <div key={season.id} className="absolute inset-x-0 bottom-0 p-6 md:p-10">
          <p
            className={`font-hanken text-xs font-semibold tracking-[0.24em] uppercase ${firstMount.current ? '' : 'ph-cap'}`}
            style={{ color: CLAY_HI }}
          >
            {season.kicker[lang]}
          </p>
          <h3 className={`mt-1 font-spectral text-3xl text-white md:text-5xl ${firstMount.current ? '' : 'ph-cap'}`} style={{ animationDelay: '50ms' }}>
            {season.name[lang]}
          </h3>
          <p
            className={`mt-2 max-w-xl font-hanken text-sm leading-relaxed text-white/85 md:text-base ${firstMount.current ? '' : 'ph-cap'}`}
            style={{ animationDelay: '100ms' }}
          >
            {season.line[lang]}
          </p>
          <p
            className={`mt-3 inline-flex items-center gap-1.5 font-hanken text-sm font-medium ${firstMount.current ? '' : 'ph-cap'}`}
            style={{ color: CLAY_HI, animationDelay: '150ms' }}
          >
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
                background: on ? NIGHT2 : 'transparent',
                borderColor: on ? `${s.glow}55` : '#ffffff14',
                boxShadow: on ? `0 10px 30px -12px ${s.glow}40, inset 0 1px 0 ${CLAY_HI}1a` : 'none',
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
function PolarHestarPageInner() {
  const {
    COPY, SHORT_TOURS, LONG_TOURS, REVIEWS, SHOP, STATS, GTK, FARM, GALLERY, PICS,
    ADDRESS, EMAIL, FACEBOOK, MAPS_HREF, PHONE_DISPLAY, PHONE_HREF,
  } = useSiteContent()
  // First visit: greet guests in their own language (exact match, else EN;
  // Icelandic only for is-browsers). A manual choice persists and always wins.
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('ph-lang') as Lang | null
      if (saved && LANGS.includes(saved)) return saved
      const nav = (navigator.languages ?? [navigator.language]).map((l) => l.slice(0, 2))
      return nav.find((l): l is Lang => LANGS.includes(l as Lang)) ?? 'en'
    } catch {
      return 'is'
    }
  })
  const [scrolled, setScrolled] = useState(false)
  const [barOn, setBarOn] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSec, setActiveSec] = useState('')
  const [veil, setVeil] = useState(false)
  const pendingLang = useRef<Lang | null>(null)
  const [bookTour, setBookTour] = useState(SHORT_TOURS[0].id)
  const t = COPY[lang]
  const minPrice = Math.min(...SHORT_TOURS.map((x) => x.price))
  const bookingRef = useRef<HTMLDivElement>(null)

  /** Þokan — the language changes behind a breath of glacier mist. */
  const switchLang = (code: Lang) => {
    if (code === lang) return
    try { localStorage.setItem('ph-lang', code) } catch { /* private mode */ }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLang(code)
      return
    }
    pendingLang.current = code
    setVeil(true)
    window.setTimeout(() => {
      if (pendingLang.current) setLang(pendingLang.current)
      pendingLang.current = null
      window.setTimeout(() => setVeil(false), 40)
    }, 130)
  }

  // Scroll-spy: the nav underline follows the section under the reading line.
  useEffect(() => {
    const ids = ['ferdir', 'boka', 'arstidir', 'lengri', 'gott', 'baer', 'bud', 'heimsokn']
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) setActiveSec((e.target as HTMLElement).id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  // Mobile menu: lock scroll, close on Escape, return focus to the hamburger.
  const menuBtnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuWasOpen = useRef(false)
  useEffect(() => {
    if (menuWasOpen.current && !menuOpen) menuBtnRef.current?.focus()
    menuWasOpen.current = menuOpen
    if (!menuOpen) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
      if (e.key === 'Tab' && menuRef.current) {
        // keep Tab inside the overlay — the page behind is visually gone
        const focusables = menuRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
        if (!focusables.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  // Verified LocalBusiness JSON-LD so the page carries machine-readable NAP
  useEffect(() => {
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Pólar Hestar',
      description: 'Horse riding tours in North Iceland since 1985. Short rides and multi-day tours from the farm Grýtubakki II by Eyjafjörður.',
      telephone: '+354 896 1879',
      email: EMAIL,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Grýtubakki II',
        addressLocality: 'Grenivík',
        postalCode: '616',
        addressCountry: 'IS',
      },
      sameAs: [FACEBOOK, INSTAGRAM, TRIPADVISOR],
    })
    document.head.appendChild(el)
    return () => {
      document.head.removeChild(el)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    document.title = tri(
      lang,
      'Pólar Hestar · hestaferðir við Eyjafjörð',
      'Pólar Hestar · riding tours in North Iceland',
      'Pólar Hestar · Reittouren in Nordisland',
    )
    document.documentElement.lang = lang
    setThemeColor(MIST)
  }, [lang])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      setBarOn(window.scrollY > window.innerHeight * 0.6)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goBook = (id: string) => {
    setBookTour(id)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    bookingRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

  const navLink = 'font-hanken text-sm font-medium transition-colors'

  return (
    <div lang={lang} style={{ background: MIST, color: BODY }} className="ph-root min-h-screen overflow-x-hidden font-hanken antialiased">
      {/* scoped motion + theme */}
      <style>{`
        .ph-reveal{opacity:0;transform:translateY(16px);filter:blur(6px);transition:opacity .9s ease,transform .9s cubic-bezier(.2,.7,.2,1),filter .9s ease}
        .ph-reveal[data-show="true"]{opacity:1;transform:none;filter:none}
        .ph-hero-rise{animation:phHeroRise .9s cubic-bezier(.2,.7,.2,1) both}
        @keyframes phHeroRise{from{transform:translateY(18px)}to{transform:none}}

        /* hero line masks — the two H1 lines climb out on load */
        .ph-line{display:block;overflow:hidden;padding:.03em .12em .16em .05em;margin:0 -.12em -.16em -.05em}
        .ph-line-i{display:inline-block;transform:translateY(115%);animation:phLineUp 1.1s cubic-bezier(.2,.7,.2,1) forwards}
        @keyframes phLineUp{to{transform:none}}

        /* word masks — driven by the ancestor reveal */
        .ph-w{display:inline-block;overflow:hidden;vertical-align:bottom;padding:.02em .1em .15em .04em;margin:0 -.1em -.15em -.04em}
        .ph-wi{display:inline-block;transform:translateY(112%);transition:transform .85s cubic-bezier(.2,.7,.2,1)}
        .ph-reveal[data-show="true"] .ph-wi{transform:none}

        /* images settle from a slight zoom as they reveal */
        .ph-reveal .ph-live{transform:scale(1.1);transition:transform 1.4s cubic-bezier(.2,.7,.2,1)}
        .ph-reveal[data-show="true"] .ph-live{transform:scale(1)}
        .ph-reveal .ph-card-img{transform:scale(1.08)}
        .ph-reveal[data-show="true"] .ph-card-img{transform:scale(1)}
        .ph-reveal[data-show="true"] .ph-card:hover .ph-card-img{transform:scale(1.05)}
        .ph-card-img{transition:transform .9s cubic-bezier(.2,.7,.2,1)}

        /* slow ambient drift for full-bleed band images */
        .ph-drift{animation:phDrift 26s ease-in-out infinite alternate}
        @keyframes phDrift{from{transform:scale(1.06) translateY(-1.2%)}to{transform:scale(1.12) translateY(1.2%)}}

        /* season panel images breathe in on each switch */
        .ph-season-img{transition:opacity .7s ease-out,transform 1.6s cubic-bezier(.2,.7,.2,1)}

        /* trust stars pop in, staggered */
        .ph-star{opacity:0;transform:scale(.3);transition:opacity .45s ease,transform .6s cubic-bezier(.34,1.56,.64,1)}
        .ph-reveal[data-show="true"] .ph-star{opacity:1;transform:scale(1)}

        /* live total ticks when the price changes */
        .ph-tick{display:inline-block;animation:phTick .45s cubic-bezier(.2,.7,.2,1)}
        @keyframes phTick{0%{transform:scale(1.07)}100%{transform:none}}

        .ph-proc:hover .ph-track{animation-play-state:paused}
        .ph-proc .animate-marquee{animation-duration:48s}
        .ph-horse img{transition:filter .7s ease}
        .ph-horse:hover img{filter:saturate(1) contrast(1.03) brightness(1.01)}
        .ph-card:hover .ph-card-img{transform:scale(1.05)}

        /* glacier grade — one cool world for every CMS photo; touch returns warmth */
        .ph-root img{filter:saturate(.9) contrast(1.03) brightness(1.01)}
        .ph-root .ph-logo{filter:none}
        .ph-card:hover .ph-card-img{filter:saturate(1) contrast(1.03) brightness(1.01)}

        /* micro-craft: selection, underlines, focus (no border-radius — outlines follow the pill) */
        .ph-root ::selection{background:#9BD8F3;color:#161B3C}
        .ph-root a{text-underline-offset:4px;text-decoration-thickness:1px}
        .ph-root :focus-visible{outline:2px solid #202070;outline-offset:3px}
        .ph-dark :focus-visible{outline-color:#9BD8F3}

        /* nav underline — hover draws it, scroll-spy holds it */
        .ph-navlink{position:relative}
        .ph-navlink::after{content:"";position:absolute;left:0;right:0;bottom:-6px;height:2px;border-radius:1px;background:currentColor;opacity:.85;transform:scaleX(0);transform-origin:left;transition:transform .25s cubic-bezier(.2,.7,.2,1)}
        .ph-navlink:hover::after,.ph-navlink[data-active="true"]::after{transform:scaleX(1)}

        /* header dropdown items — fjord-blue hover with a sliding arrow */
        .ph-dd-item{display:flex;align-items:center;justify-content:space-between;gap:.75rem;border-radius:.75rem;padding:.6rem .85rem;color:#3D4565;transition:background-color .2s ease,color .2s ease}
        .ph-dd-item:hover{background:#3B8FD414;color:#2160A6}
        .ph-dd-arrow{opacity:0;transform:translateX(-5px);transition:opacity .2s ease,transform .2s ease;color:#2160A6}
        .ph-dd-item:hover .ph-dd-arrow{opacity:1;transform:none}

        /* Þokan — mist veil on language switch */
        .ph-veil{opacity:0;background:#EDF1F73d;-webkit-backdrop-filter:blur(7px);backdrop-filter:blur(7px);transition:opacity .22s cubic-bezier(.2,.7,.2,1)}
        .ph-veil[data-on="true"]{opacity:1;transition-duration:.13s}

        /* seasons — glow layers crossfade (gradients can't transition; opacity can) */
        .ph-glow{transition:opacity .9s ease}
        .ph-cap{opacity:0;transform:translateY(12px);animation:phCap .5s cubic-bezier(.2,.7,.2,1) forwards}
        @keyframes phCap{to{opacity:1;transform:none}}

        /* booking success choreography */
        .ph-pop{opacity:0;transform:scale(.5);animation:phPop .45s cubic-bezier(.34,1.56,.64,1) forwards}
        @keyframes phPop{to{opacity:1;transform:scale(1)}}
        .ph-up{opacity:0;transform:translateY(10px);animation:phUp .35s cubic-bezier(.2,.7,.2,1) forwards}
        @keyframes phUp{to{opacity:1;transform:none}}

        /* stepper digit roll */
        .ph-numwrap{display:inline-block;overflow:hidden;line-height:1.2}
        .ph-num-up,.ph-num-dn{display:inline-block;animation-duration:.18s;animation-timing-function:cubic-bezier(.2,.7,.2,1);animation-fill-mode:both}
        .ph-num-up{animation-name:phNumUp}.ph-num-dn{animation-name:phNumDn}
        @keyframes phNumUp{from{transform:translateY(65%);opacity:0}}
        @keyframes phNumDn{from{transform:translateY(-65%);opacity:0}}

        /* confirm button in-flight light sweep */
        .ph-cta-send{position:relative;overflow:hidden}
        .ph-cta-send[data-busy="true"]::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.22) 50%,transparent 60%);transform:translateX(-100%);animation:phSweep 1.1s linear infinite}
        @keyframes phSweep{to{transform:translateX(100%)}}

        /* mobile sticky bar earns its entrance */
        .ph-bar{transform:translateY(110%);transition:transform .32s cubic-bezier(.2,.7,.2,1)}
        .ph-bar[data-on="true"]{transform:none}
        @media (prefers-reduced-motion: reduce){
          .ph-reveal{opacity:1;transform:none;filter:none;transition:none}
          .ph-hero-rise,.ph-line-i,.ph-drift,.ph-tick{animation:none}
          .ph-line-i{transform:none}
          .ph-wi{transform:none;transition:none}
          .ph-reveal .ph-live,.ph-reveal .ph-card-img{transform:none;transition:none}
          .ph-star{opacity:1;transform:none;transition:none}
          .ph-card-img,.ph-season-img{transition:none}
          .ph-veil,.ph-cap,.ph-pop,.ph-up,.ph-num-up,.ph-num-dn,.ph-cta-send[data-busy="true"]::after{animation:none}
          .ph-cap,.ph-pop,.ph-up{opacity:1;transform:none}
          .ph-bar,.ph-navlink::after{transition:none}
          .ph-bar{transform:none}
          .ph-horse img{transition:none}
        }
      `}</style>

      {/* skip link — first tab stop, jumps keyboard/AT users past the fixed header */}
      <a
        href="#efni"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:rounded-full focus:px-4 focus:py-2.5 focus:font-hanken focus:text-sm focus:font-semibold focus:text-white"
        style={{ background: CLAY_FILL }}
      >
        {tri(lang, 'Beint í efni', 'Skip to content', 'Zum Inhalt springen')}
      </a>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${scrolled ? '' : 'ph-dark'}`}
        style={{
          background: scrolled ? `${MIST}fa` : 'transparent',
          boxShadow: scrolled ? '0 1px 0 rgba(22,27,60,0.08)' : 'none',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
        }}
      >
        {/* legibility scrim while the header floats over the photo — any CMS hero stays readable */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-28 transition-opacity duration-300"
          style={{ background: 'linear-gradient(180deg, rgba(13,16,40,0.55), transparent)', opacity: scrolled ? 0 : 1 }}
        />
        <div className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#top" className="shrink-0" aria-label="Pólar Hestar">
            <img
              src={LOGO}
              alt="Pólar Hestar"
              className="w-auto transition-all duration-300"
              style={{
                height: scrolled ? '2.6rem' : '3.25rem',
                filter: scrolled ? 'none' : 'drop-shadow(0 3px 10px rgba(10,14,40,0.35))',
              }}
            />
          </a>
          <nav className="hidden items-center gap-6 md:flex" aria-label={tri(lang, 'Valmynd', 'Menu', 'Menü')}>
            {[
              {
                href: '#ferdir',
                label: t.nav.tours,
                kids: [
                  ['#ferdir', tri(lang, 'Stuttar ferðir', 'Short tours', 'Kurze Touren')],
                  ['#lengri', tri(lang, 'Lengri ferðir', 'Long rides', 'Lange Reittouren')],
                  ['#boka', tri(lang, 'Bóka reiðtúr', 'Book a ride', 'Ritt buchen')],
                ] as [string, string][],
              },
              { href: '#arstidir', label: t.nav.seasons },
              {
                href: '#gott',
                label: t.nav.info,
                kids: [
                  ['#gott', tri(lang, 'Gott að vita', 'Good to know', 'Gut zu wissen')],
                  ['#baer', tri(lang, 'Á bænum', 'At the farm', 'Auf dem Hof')],
                  ['#bud', tri(lang, 'Búðin', 'The shop', 'Der Hofladen')],
                ] as [string, string][],
              },
              { href: '#heimsokn', label: t.nav.visit },
            ].map((item) => {
              const on = item.href === '#' + activeSec || !!item.kids?.some(([h]) => h === '#' + activeSec)
              const color = scrolled ? BODY : '#ffffffe6'
              if (!item.kids) {
                return (
                  <a key={item.href} href={item.href} className={`${navLink} ph-navlink`} data-active={on} style={{ color }}>
                    {item.label}
                  </a>
                )
              }
              return <NavDropdown key={item.href} href={item.href} label={item.label} kids={item.kids} on={on} color={color} />
            })}
          </nav>
          <div className="flex items-center gap-2">
            <div
              role="group"
              aria-label={lang === 'is' ? 'Tungumál' : lang === 'de' ? 'Sprache' : 'Language'}
              className="flex overflow-hidden rounded-full border font-hanken text-[0.7rem] font-semibold"
              style={{ borderColor: scrolled ? '#1a205233' : '#ffffff66' }}
            >
              {LANGS.map((code) => {
                const active = lang === code
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => switchLang(code)}
                    aria-pressed={active}
                    aria-label={LANG_NAMES[code]}
                    className="min-h-11 px-3 py-2.5 uppercase tracking-wide transition-colors md:min-h-0"
                    style={
                      active
                        ? { background: scrolled ? INK : '#ffffff', color: scrolled ? MIST : INK }
                        : { color: scrolled ? BODY : '#ffffffd9' }
                    }
                  >
                    {code}
                  </button>
                )
              })}
            </div>
            <button
              type="button"
              onClick={() => goBook(bookTour)}
              className="hidden rounded-full px-4 py-2 font-hanken text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 sm:inline-flex"
              style={{ background: CLAY_FILL }}
            >
              {t.nav.cta}
            </button>
            <button
              ref={menuBtnRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-label={tri(lang, 'Valmynd', 'Menu', 'Menü')}
              className="grid h-11 w-11 place-items-center md:hidden"
              style={{ color: scrolled ? INK : '#fff' }}
            >
              <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
                <span className="block h-px w-full bg-current" />
                <span className="block h-px w-full bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE MENU — polar night panel ─────────────────────────────── */}
      {menuOpen && (
        <div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label={tri(lang, 'Valmynd', 'Menu', 'Menü')}
          className="ph-dark fixed inset-0 z-50 flex flex-col overflow-y-auto p-6 md:hidden"
          style={{ background: NIGHT }}
        >
          <div className="flex items-center justify-between">
            <img src={LOGO} alt="Pólar Hestar" className="h-10 w-auto" />
            <button
              type="button"
              autoFocus
              onClick={() => setMenuOpen(false)}
              aria-label={tri(lang, 'Loka', 'Close', 'Schließen')}
              className="grid h-11 w-11 place-items-center rounded-full border text-white"
              style={{ borderColor: '#ffffff33' }}
            >
              <span className="relative block h-4 w-4" aria-hidden="true">
                <span className="absolute top-1/2 left-0 block h-px w-full rotate-45 bg-current" />
                <span className="absolute top-1/2 left-0 block h-px w-full -rotate-45 bg-current" />
              </span>
            </button>
          </div>
          <nav className="mt-10 flex flex-col" aria-label={tri(lang, 'Valmynd', 'Menu', 'Menü')}>
            {[
              ['#ferdir', tri(lang, 'Stuttar ferðir', 'Short tours', 'Kurze Touren')],
              ['#lengri', tri(lang, 'Lengri ferðir', 'Long rides', 'Lange Reittouren')],
              ['#arstidir', t.nav.seasons],
              ['#gott', t.nav.info],
              ['#bud', tri(lang, 'Búðin', 'The shop', 'Der Hofladen')],
              ['#heimsokn', t.nav.visit],
            ].map(([href, label], i) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="border-b py-4 font-spectral text-[1.7rem] text-white"
                style={{ borderColor: '#ffffff14' }}
              >
                <span className="mr-4 font-hanken text-xs" style={{ color: CLAY_HI }}>
                  0{i + 1}
                </span>
                {label}
              </a>
            ))}
          </nav>
          <div className="mt-auto space-y-4 pb-2">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                goBook(bookTour)
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 font-hanken text-sm font-semibold text-white"
              style={{ background: CLAY_FILL }}
            >
              {t.nav.cta}
              <ArrowRight className="h-4 w-4" />
            </button>
            <a href={PHONE_HREF} className="block text-center font-hanken text-sm" style={{ color: CLAY_HI }}>
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      )}

      {/* Þokan — mist veil for language switches */}
      <div aria-hidden="true" className="ph-veil pointer-events-none fixed inset-0 z-[60]" data-on={veil} />

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <main id="efni">
      <section id="top" className="ph-dark grain relative flex min-h-[100svh] items-end overflow-hidden">
        <Img
          src={PICS.hero.src}
          srcSet={PICS.hero.srcSet}
          sizes="100vw"
          fetchpriority="high"
          loading="eager"
          alt={
            PICS.hero.alt ??
            tri(
              lang,
              'Íslensk hross á vetrarhaga fyrir framan snæviþakið fjall og fjörð',
              'Icelandic horses on a winter pasture before a snow-capped mountain and fjord',
              'Islandpferde auf der Winterweide vor schneebedecktem Berg und Fjord',
            )
          }
          className="kenburns absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: PICS.hero.pos }}
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(180deg, rgba(13,16,40,0.5) 0%, rgba(13,16,40,0.35) 32%, rgba(13,16,40,0.5) 62%, rgba(13,16,40,0.85) 100%)` }}
        />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 md:px-8 md:pb-24">
          <p className="ph-hero-rise font-hanken text-xs font-semibold tracking-[0.24em] text-white/80 uppercase" style={{ animationDelay: '0ms' }}>
            {t.heroEyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl font-spectral text-[clamp(2.6rem,7vw,4.5rem)] leading-[1.04] text-white">
            <span className="ph-line">
              <span className="ph-line-i" style={{ animationDelay: '100ms' }}>
                {t.heroH1a}
              </span>
            </span>
            <span className="ph-line">
              <span className="ph-line-i italic" style={{ animationDelay: '240ms', color: CLAY_HI }}>
                {t.heroH1b}
              </span>
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
            <Stat value={<CountUp to={STATS.years} lang={lang} />} label={t.statYears} />
            <span className="hidden h-8 w-px bg-white/25 sm:block" aria-hidden="true" />
            <Stat value={<CountUp to={STATS.horses} lang={lang} duration={2000} />} label={t.statHorses} />
            <span className="hidden h-8 w-px bg-white/25 sm:block" aria-hidden="true" />
            <Stat
              value={<span className="font-spectral text-2xl text-white">{isk(minPrice)}</span>}
              label={tri(lang, 'verð frá · allt árið', 'from · open all year', 'ab · ganzjährig')}
            />
          </div>
        </div>
      </section>

      {/* ── STORY ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <Reveal>
            <Eyebrow>{t.storyEyebrow}</Eyebrow>
            <h2 className="mt-3 font-spectral text-[clamp(1.9rem,1rem+3.4vw,3.1rem)] leading-tight" style={{ color: INK }}>
              <MaskWords text={t.storyH2} />
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
              <div className="overflow-hidden rounded-[28px] shadow-[0_1px_2px_rgba(22,27,60,0.05),0_10px_22px_-14px_rgba(22,27,60,0.22),0_28px_56px_-32px_rgba(32,32,112,0.35)] ring-1 ring-[#161B3C0f]">
                <Img
                  src={PICS.story.src}
                  srcSet={PICS.story.srcSet}
                  sizes="(max-width: 768px) 100vw, 540px"
                  alt={
                    PICS.story.alt ??
                    tri(lang, 'Hvítur íslenskur hestur í þoku', 'A white Icelandic horse in the mist', 'Ein weißes Islandpferd im Nebel')
                  }
                  className="ph-live aspect-[4/5] w-full object-cover"
                  style={{ objectPosition: PICS.story.pos }}
                />
              </div>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ── PULL QUOTE (folkloric line) — deep-pine feature band ─────────── */}
      <section
        className="ph-dark relative overflow-hidden px-5 py-24 md:py-36"
        style={{
          background: `radial-gradient(90rem 16rem at 50% -6rem, ${CLAY_HI}12, transparent 70%), ${TWILIGHT}`,
          boxShadow: `inset 0 1px 0 ${CLAY_HI}2b`,
        }}
      >
        <Reveal className="relative mx-auto max-w-5xl text-center">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 font-spectral leading-none select-none text-[8rem] md:-top-14 md:text-[13rem]"
            style={{ color: `${CLAY_HI}12` }}
          >
            “
          </span>
          <p className="font-spectral text-[clamp(2.2rem,5.5vw,4.25rem)] leading-[1.15] italic text-white">
            <MaskWords text={t.storyQuote} stagger={70} base={150} />
          </p>
        </Reveal>
      </section>

      {/* ── HERD PROCESSION (signature) ─────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <Reveal className="mx-auto mb-8 max-w-6xl px-5 md:px-8">
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-xl font-spectral text-[clamp(1.75rem,1rem+2.6vw,2.35rem)] leading-tight" style={{ color: INK }}>
              <MaskWords text={t.procH2} />
            </h2>
            <p className="max-w-md font-hanken text-sm leading-relaxed" style={{ color: BODY }}>
              {t.procBody}
            </p>
          </div>
        </Reveal>
        <div className="ph-proc relative overflow-hidden" aria-hidden="true">
          <div className="ph-track animate-marquee flex w-max items-start gap-4">
            {[...GALLERY, ...GALLERY].map((g, i) => {
              // both track halves must style identically for a seamless -50% loop
              const k = i % GALLERY.length
              return (
                <div key={i} className={`ph-horse shrink-0 overflow-hidden rounded-2xl ${HERD_RHYTHM[k % 4]}`} style={{ background: PAPER }}>
                  <img
                    src={g.src}
                    srcSet={g.srcSet}
                    sizes="(max-width: 768px) 45vw, 288px"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                    style={{ objectPosition: g.pos }}
                  />
                </div>
              )
            })}
          </div>
          {/* edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-28" style={{ background: `linear-gradient(90deg, ${MIST}, transparent)` }} />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-28" style={{ background: `linear-gradient(270deg, ${MIST}, transparent)` }} />
        </div>
      </section>

      {/* ── TOURS — short + long, one journey through everything on offer ─── */}
      <section id="ferdir" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 md:px-8 md:py-24">
        <Reveal className="max-w-2xl">
          <Eyebrow>{t.toursZoneEyebrow}</Eyebrow>
          <h2 className="mt-3 font-spectral text-[clamp(1.9rem,1rem+3.4vw,3.1rem)] leading-tight" style={{ color: INK }}>
            <MaskWords text={t.toursH2} />
          </h2>
          <p className="mt-4 font-hanken text-base leading-relaxed" style={{ color: BODY }}>
            {t.toursZoneIntro}
          </p>
        </Reveal>

        {/* Tier 1 — by the hour, all year */}
        <div className="mt-12">
          <Reveal className="flex items-baseline justify-between gap-4 border-b border-[#161B3C14] pb-3">
            <h3 className="font-spectral text-[clamp(1.4rem,1rem+1.3vw,1.9rem)] leading-tight" style={{ color: INK }}>
              {t.toursEyebrow}
            </h3>
            <span className="shrink-0 font-hanken text-[0.72rem] font-semibold tracking-[0.14em] uppercase" style={{ color: CLAY_TX }}>
              {t.toursBadge}
            </span>
          </Reveal>
          <p className="mt-4 max-w-2xl font-hanken text-sm leading-relaxed" style={{ color: BODY }}>
            {t.toursBody}
          </p>

          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SHORT_TOURS.map((tour, i) => (
              <Reveal key={tour.id} delay={i * 70}>
                <TourCard tour={tour} lang={lang} t={t} onBook={() => goBook(tour.id)} />
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-1.5">
            <p className="inline-flex items-center gap-1.5 font-hanken text-xs" style={{ color: SLATE }}>
              <Check className="h-3.5 w-3.5" style={{ color: CLAY_TX }} aria-hidden="true" />
              {t.childNote}
            </p>
            <p className="inline-flex items-center gap-1.5 font-hanken text-xs" style={{ color: SLATE }}>
              <Check className="h-3.5 w-3.5" style={{ color: CLAY_TX }} aria-hidden="true" />
              {t.weightNote}
            </p>
          </Reveal>
        </div>

        {/* Tier 2 — multi-day journeys */}
        <div id="lengri" className="mt-16 scroll-mt-20 md:mt-24">
          <Reveal className="flex flex-col gap-4 border-b border-[#161B3C14] pb-3 md:flex-row md:items-baseline md:justify-between">
            <div className="flex items-baseline gap-3">
              <h3 className="font-spectral text-[clamp(1.4rem,1rem+1.3vw,1.9rem)] leading-tight" style={{ color: INK }}>
                {t.longEyebrow}
              </h3>
              <span className="shrink-0 font-hanken text-[0.72rem] font-semibold tracking-[0.14em] uppercase" style={{ color: CLAY_TX }}>
                {t.longBadge}
              </span>
            </div>
            <p className="font-hanken text-sm leading-relaxed md:text-right" style={{ color: SLATE }}>
              {t.longQuestions}{' '}
              <a href={`mailto:${EMAIL}`} className="font-semibold underline underline-offset-4" style={{ color: CLAY_TX }}>
                {EMAIL}
              </a>
            </p>
          </Reveal>
          <p className="mt-4 max-w-2xl font-hanken text-sm leading-relaxed" style={{ color: BODY }}>
            {t.longBody}
          </p>

          <div className="mt-7 flex flex-col gap-5">
            {LONG_TOURS.map((tour, i) => (
              <Reveal key={tour.id} delay={i * 50}>
                <article
                  className={`ph-card group flex flex-col overflow-hidden rounded-[24px] shadow-[0_1px_2px_rgba(22,27,60,0.05),0_10px_22px_-14px_rgba(22,27,60,0.22),0_28px_56px_-32px_rgba(32,32,112,0.35)] ring-1 ring-[#161B3C0f] md:min-h-[16rem] ${
                    i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
                  }`}
                  style={{ background: PAPER }}
                >
                  <div className="relative overflow-hidden md:w-[42%]">
                    <img
                      src={tour.pic.src}
                      srcSet={tour.pic.srcSet}
                      sizes="(max-width: 768px) 100vw, 460px"
                      alt={
                        tour.pic.alt ??
                        tri(
                          lang,
                          `Íslenskt landslag (${tour.name.is})`,
                          `Icelandic landscape (${tour.name.en})`,
                          `Isländische Landschaft (${tour.name.de})`,
                        )
                      }
                      loading="lazy"
                      decoding="async"
                      className="ph-card-img h-56 w-full object-cover md:absolute md:inset-0 md:h-full"
                      style={{ objectPosition: tour.pic.pos }}
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-3 p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-2">
                      {tour.meta[lang].split(' · ').map((part, j) => (
                        <span
                          key={j}
                          className="rounded-full px-2.5 py-1 font-hanken text-[0.72rem] font-semibold"
                          style={
                            part.includes('€')
                              ? { background: `${CLAY}1f`, color: CLAY_TX }
                              : { background: `${INK}0d`, color: SLATE }
                          }
                        >
                          {part}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-spectral text-2xl leading-snug" style={{ color: INK }}>
                      {tour.name[lang]}
                    </h3>
                    <p className="max-w-2xl font-hanken text-sm leading-relaxed" style={{ color: BODY }}>
                      {tour.blurb[lang]}
                    </p>
                    {(tour.requirements || tour.departures) && (
                      <div className="flex flex-col gap-1 border-t pt-3" style={{ borderColor: '#161B3C12' }}>
                        {tour.requirements && (
                          <p className="font-hanken text-xs leading-relaxed" style={{ color: SLATE }}>
                            {tour.requirements[lang]}
                          </p>
                        )}
                        {tour.departures && (
                          <p className="font-hanken text-xs leading-relaxed font-medium" style={{ color: CLAY_TX }}>
                            {tour.departures[lang]}
                          </p>
                        )}
                      </div>
                    )}
                    <a
                      href={`mailto:${EMAIL}?subject=${encodeURIComponent(stegaClean(tour.name[lang]))}&body=${encodeURIComponent(
                        tri(
                          lang,
                          `Ferð: ${stegaClean(tour.name.is)}\nÓskatímabil:\nFjöldi knapa:\nReynsla af hestamennsku:\n`,
                          `Tour: ${stegaClean(tour.name.en)}\nPreferred dates:\nNumber of riders:\nRiding experience:\n`,
                          `Tour: ${stegaClean(tour.name.de)}\nWunschzeitraum:\nAnzahl Reiter:\nReiterfahrung:\n`,
                        ),
                      )}`}
                      className="mt-1 inline-flex items-center gap-1 self-start font-hanken text-sm font-semibold transition-colors"
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
        </div>
      </section>

      {/* ── BOOKING ─────────────────────────────────────────────────────── */}
      <section
        id="boka"
        ref={bookingRef}
        className="ph-dark scroll-mt-20 px-5 py-16 md:py-24"
        style={{
          background: `radial-gradient(90rem 16rem at 50% -6rem, ${CLAY_HI}12, transparent 70%), ${TWILIGHT}`,
          boxShadow: `inset 0 1px 0 ${CLAY_HI}2b`,
        }}
      >
        <div className="mx-auto max-w-5xl">
          <Reveal className="mb-8 text-center">
            <Eyebrow on="dark">{t.bookEyebrow}</Eyebrow>
            <h2 className="mt-3 font-spectral text-[clamp(1.9rem,1rem+3.4vw,3.1rem)] leading-tight text-white">
              <MaskWords text={t.bookH2} />
            </h2>
          </Reveal>
          <Reveal>
            <Booking t={t} lang={lang} selectedId={bookTour} onSelect={setBookTour} />
          </Reveal>
        </div>
      </section>

      {/* ── SEASONS (signature) ─────────────────────────────────────────── */}
      <section
        id="arstidir"
        className="ph-dark grain relative scroll-mt-20 overflow-hidden"
        style={{ background: NIGHT, boxShadow: `inset 0 1px 0 ${CLAY_HI}2b` }}
      >
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <Reveal className="mb-8 max-w-2xl">
            <Eyebrow tint={ICE}>{t.seasonsEyebrow}</Eyebrow>
            <h2 className="mt-3 font-spectral text-[clamp(1.9rem,1rem+3.4vw,3.1rem)] leading-tight text-white">
              <MaskWords text={t.seasonsH2} />
            </h2>
            <p className="mt-4 font-hanken text-base leading-relaxed text-white/75">{t.seasonsBody}</p>
          </Reveal>
          <Reveal>
            <SeasonSwitcher t={t} lang={lang} />
          </Reveal>
        </div>
      </section>

      {/* ── GOOD TO KNOW — the practical facts from their info pages ────── */}
      <section id="gott" className="scroll-mt-20 px-5 py-16 md:py-20" style={{ background: PAPER }}>
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-8 max-w-2xl">
            <h2 className="font-spectral text-[clamp(1.75rem,1rem+2.6vw,2.35rem)] leading-tight" style={{ color: INK }}>
              <MaskWords text={GTK.heading[lang]} />
            </h2>
            <p className="mt-3 font-hanken text-sm leading-relaxed" style={{ color: BODY }}>
              {GTK.body[lang]}
            </p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GTK.items.map((item, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="h-full rounded-2xl border p-5" style={{ borderColor: '#1a20521a', background: MIST }}>
                  <p className="font-spectral text-lg" style={{ color: INK }}>
                    {item.title[lang]}
                  </p>
                  <p className="mt-1.5 font-hanken text-sm leading-relaxed" style={{ color: BODY }}>
                    {item.body[lang]}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AT THE FARM — the practical zone continues, quieter (rows, not cards) */}
      <section id="baer" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 md:px-8 md:py-24">
        <Reveal className="mb-8 max-w-2xl">
          <h2 className="font-spectral text-[clamp(1.75rem,1rem+2.6vw,2.35rem)] leading-tight" style={{ color: INK }}>
            <MaskWords text={FARM.heading[lang]} />
          </h2>
          <p className="mt-3 font-hanken text-sm leading-relaxed" style={{ color: BODY }}>
            {FARM.body[lang]}
          </p>
        </Reveal>
        <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {FARM.items.map((item, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="border-t pt-4" style={{ borderColor: '#1a205226' }}>
                <p className="font-spectral text-lg" style={{ color: INK }}>
                  {item.title[lang]}
                </p>
                <p className="mt-1.5 font-hanken text-sm leading-relaxed" style={{ color: BODY }}>
                  {item.body[lang]}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── TRUST / REVIEWS / FAMILY ────────────────────────────────────── */}
      <section
        className="ph-dark px-5 py-16 md:py-24"
        style={{
          background: `radial-gradient(90rem 16rem at 50% -6rem, ${CLAY_HI}12, transparent 70%), ${TWILIGHT}`,
          boxShadow: `inset 0 1px 0 ${CLAY_HI}2b`,
        }}
      >
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-10 text-center">
            <Eyebrow on="dark">{t.trustEyebrow}</Eyebrow>
            <h2 className="mt-3 font-spectral text-[clamp(1.9rem,1rem+3.4vw,3.1rem)] leading-tight text-white">
              <MaskWords text={t.trustH2} />
            </h2>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span
                className="flex items-center gap-2"
                role="img"
                aria-label={tri(lang, `${STATS.rating} af 5`, `${STATS.rating.replace(',', '.')} out of 5`, `${STATS.rating} von 5`)}
              >
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star
                    key={s}
                    className="ph-star h-5 w-5 fill-current"
                    style={{ color: CLAY_HI, transitionDelay: `${300 + s * 110}ms` }}
                    aria-hidden="true"
                  />
                ))}
              </span>
              <a
                href={TRIPADVISOR}
                target="_blank"
                rel="noreferrer"
                className="ml-2 font-hanken text-sm underline decoration-white/35 underline-offset-4 transition-colors hover:decoration-white"
                style={{ color: MIST }}
              >
                {t.trustBody}
              </a>
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
                  src={PICS.family.src}
                  srcSet={PICS.family.srcSet}
                  sizes="(max-width: 768px) 100vw, 540px"
                  alt={
                    PICS.family.alt ??
                    tri(
                      lang,
                      'Tveir knapar á íslenskum hestum í norðlensku landslagi',
                      'Two riders on Icelandic horses in a northern landscape',
                      'Zwei Reiter auf Islandpferden in nordischer Landschaft',
                    )
                  }
                  className="ph-live h-full w-full object-cover"
                  style={{ objectPosition: PICS.family.pos }}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SHOP (photo-light) — fixes the dead-end shop ─────────────────── */}
      <section id="bud" className="scroll-mt-20 px-5 py-16 md:py-20" style={{ background: PAPER }}>
        <div className="mx-auto max-w-6xl md:px-3">
        <Reveal className="mb-8 max-w-xl">
          <h2 className="font-spectral text-[clamp(1.75rem,1rem+2.6vw,2.35rem)] leading-tight" style={{ color: INK }}>
            {t.shopH2}
          </h2>
          <p className="mt-3 font-hanken text-sm leading-relaxed" style={{ color: BODY }}>
            {t.shopBody}
          </p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          {SHOP.map((item, i) => (
            <Reveal key={i} delay={i * 70}>
              <div className="flex h-full items-center justify-between gap-4 rounded-2xl border p-5" style={{ borderColor: '#1a20521a', background: MIST }}>
                <div>
                  <p className="font-spectral text-lg" style={{ color: INK }}>
                    {item.name[lang]}
                  </p>
                  <p className="mt-0.5 font-hanken text-sm font-semibold" style={{ color: CLAY_TX }}>
                    {item.from ? `${tri(lang, 'frá', 'from', 'ab')} ${isk(item.price)}` : isk(item.price)}
                  </p>
                </div>
                <a
                  href={`mailto:${EMAIL}?subject=${encodeURIComponent(stegaClean(item.name[lang]))}`}
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
        </div>
      </section>

      {/* ── VISIT / LOCATION ────────────────────────────────────────────── */}
      <section id="heimsokn" className="scroll-mt-20 px-5 pb-20 md:pb-28">
        <div className="mx-auto grid max-w-6xl items-stretch gap-6 overflow-hidden md:grid-cols-2">
          <Reveal className="flex">
            <div className="flex w-full flex-col justify-center rounded-[28px] p-7 md:p-10" style={{ background: PAPER }}>
              <h2 className="font-spectral text-[clamp(1.75rem,1rem+2.6vw,2.35rem)] leading-tight" style={{ color: INK }}>
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
                <InfoRow icon={<Phone className="h-5 w-5" />} label={tri(lang, 'Sími', 'Phone', 'Telefon')}>
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
                  style={{ borderColor: '#1a205233', color: INK }}
                >
                  <Phone className="h-4 w-4" />
                  {t.callBtn}
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex items-center gap-2 rounded-full border px-5 py-3 font-hanken text-sm font-semibold transition-colors hover:bg-black/5"
                  style={{ borderColor: '#1a205233', color: INK }}
                >
                  <Mail className="h-4 w-4" />
                  {t.emailBtn}
                </a>
                <a
                  href={FACEBOOK}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border px-5 py-3 font-hanken text-sm font-semibold transition-colors hover:bg-black/5"
                  style={{ borderColor: '#1a205233', color: INK }}
                >
                  <Facebook className="h-4 w-4" />
                  Facebook
                </a>
                <a
                  href={INSTAGRAM}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border px-5 py-3 font-hanken text-sm font-semibold transition-colors hover:bg-black/5"
                  style={{ borderColor: '#1a205233', color: INK }}
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="flex">
            <div className="min-h-[280px] w-full overflow-hidden rounded-[28px]">
              <Img
                src={PICS.location.src}
                srcSet={PICS.location.srcSet}
                sizes="(max-width: 768px) 100vw, 540px"
                alt={
                  PICS.location.alt ??
                  tri(lang, 'Vegur meðfram firði á Norðurlandi', 'A road along a fjord in North Iceland', 'Eine Straße am Fjord in Nordisland')
                }
                className="ph-live h-full w-full object-cover"
                style={{ objectPosition: PICS.location.pos }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────── */}
      <section className="ph-dark grain relative overflow-hidden">
        <Img
          src={PICS.ctaBand.src}
          srcSet={PICS.ctaBand.srcSet}
          sizes="100vw"
          alt={
            PICS.ctaBand.alt ??
            tri(lang, 'Hross undir þrumuveðurshimni á hraunlendi', 'Horses under a stormy sky on lava-field terrain', 'Pferde unter Gewitterhimmel auf Lavaland')
          }
          className="ph-drift absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: PICS.ctaBand.pos }}
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${NIGHT}59, ${NIGHT}c4)` }} />
        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center md:py-32">
          <Reveal>
            <img
              src={LOGO}
              alt=""
              aria-hidden="true"
              className="mx-auto mb-8 h-20 w-auto md:h-24"
              style={{ filter: 'drop-shadow(0 6px 18px rgba(10,14,40,0.45))' }}
              loading="lazy"
              decoding="async"
            />
            <h2 className="font-spectral text-[clamp(2.4rem,5.5vw,3.9rem)] leading-tight text-white">
              <MaskWords text={t.ctaH2} />
            </h2>
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
      </main>

      <div className="pb-20 md:pb-0">
        <PreviewFooter company={company} />
      </div>

      {/* ── MOBILE STICKY CTA ───────────────────────────────────────────── */}
      <div data-on={barOn} className="ph-bar fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden" style={{ background: `${MIST}f5`, borderColor: '#1a20521f', backdropFilter: 'blur(8px)' }}>
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
          style={{ borderColor: '#1a205233', color: INK }}
          aria-label={t.callBtn}
        >
          <Phone className="h-5 w-5" />
        </a>
      </div>

      <PreviewChrome company={company} />
    </div>
  )
}

export default function PolarHestarPage() {
  return (
    <SiteContentProvider>
      <PolarHestarPageInner />
    </SiteContentProvider>
  )
}

/* ── small presentational helpers ─────────────────────────────────────── */
function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-spectral text-2xl text-white">{value}</span>
      <span className="font-hanken text-xs text-white/70">{label}</span>
    </div>
  )
}

function TourCard({ tour, lang, t, onBook }: { tour: TourX; lang: Lang; t: typeof COPY['is']; onBook: () => void }) {
  return (
    <article className="ph-card flex h-full flex-col overflow-hidden rounded-[22px] shadow-[0_1px_2px_rgba(22,27,60,0.05),0_10px_22px_-14px_rgba(22,27,60,0.22),0_28px_56px_-32px_rgba(32,32,112,0.35)] ring-1 ring-[#161B3C0f]" style={{ background: PAPER }}>
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={tour.pic.src}
          srcSet={tour.pic.srcSet}
          sizes="(max-width: 640px) 100vw, 360px"
          alt={
            tour.pic.alt ??
            tri(lang, `${tour.name.is} (íslenskir hestar)`, `${tour.name.en} (Icelandic horses)`, `${tour.name.de} (Islandpferde)`)
          }
          loading="lazy"
          decoding="async"
          className="ph-card-img h-full w-full object-cover"
          style={{ objectPosition: tour.pic.pos }}
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
