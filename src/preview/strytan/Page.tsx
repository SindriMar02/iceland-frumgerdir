import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import OceanDescent from './OceanDescent'
import {
  ADDRESS,
  COURSES,
  CURRENT_SITE,
  DIVES,
  EMAIL,
  LIFE,
  LOGO_WHITE,
  MAPS,
  PHONE_DISPLAY,
  PHONE_HREF,
  REVIEWS,
  SEASON,
  TIMELINE,
  TRIPADVISOR,
} from './data'

const company = getPreviewCompany('strytan')

/* ── Niður að strýtunni — the page sinks from the silver surface down through
      the blue to the glowing hydrothermal chimney. A fixed canvas carries the
      descent; a depth HUD ticks the metres. ───────────────────────────────── */
const DEEP = '#04141A' // page ground (deep ocean ink)
const TEAL = '#37AEBE' // brand accent (their logo teal), links + CTAs
const TEAL_HI = '#7FD6E2' // bright accent on very dark
const GLOW = '#E8A24E' // the vent's warmth — used sparingly
const INK = '#EAF6F8'
const MUT = 'rgba(234,246,248,0.74)'
const MUT2 = 'rgba(234,246,248,0.52)'
const LINE = 'rgba(234,246,248,0.14)'
const PANEL = 'rgba(6,26,33,0.55)'

const DISPLAY = "'Fraunces', Georgia, serif"
const DISPLAY_MED = "'Fraunces', Georgia, serif"
const SANS = "'CabinetGrotesk-Regular', system-ui, sans-serif"
const SANS_MED = "'CabinetGrotesk-Medium', system-ui, sans-serif"
const SANS_BOLD = "'CabinetGrotesk-Bold', system-ui, sans-serif"
const MONO = "'Space Mono', monospace"
const BASE = import.meta.env.BASE_URL
const MAX_DEPTH = 72 // metres — Big Strýtan's base is ~70 m


/* ── IO reveal ──────────────────────────────────────────────────────────── */
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
    const tm = window.setTimeout(() => {
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight && r.bottom > 0) setOn(true)
    }, 1400)
    return () => {
      io.disconnect()
      window.clearTimeout(tm)
    }
  }, [])
  return (
    <div ref={ref} data-in={on} className={`st-reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function CTA({ href, children, solid = true, onClick }: { href: string; children: ReactNode; solid?: boolean; onClick?: () => void }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="st-cta inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm tracking-[0.04em] uppercase"
      style={
        solid
          ? { background: TEAL, color: DEEP, fontFamily: SANS_BOLD }
          : { border: `1.5px solid ${LINE}`, color: INK, fontFamily: SANS_BOLD }
      }
    >
      {children}
    </a>
  )
}

/* ── Enquiry flow — no online booking exists, so this composes an email ──── */
function DiveRequest() {
  const [dive, setDive] = useState('Big Strýtan')
  const [date, setDate] = useState('')
  const [divers, setDivers] = useState(2)
  const [level, setLevel] = useState('Advanced / Drysuit')

  const mailto = useMemo(() => {
    const subject = `Dive request: ${dive}`
    const body =
      `Hi Strýtan Dive Center,\n\n` +
      `I would like to request a dive:\n` +
      `• Dive: ${dive}\n` +
      `• Preferred date: ${date || '(flexible)'}\n` +
      `• Number of divers: ${divers}\n` +
      `• Certification level: ${level}\n\n` +
      `A little about us:\n\n` +
      `Thanks!`
    return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }, [dive, date, divers, level])

  const fieldWrap = 'flex flex-col gap-2'
  const legend = { fontFamily: MONO, color: TEAL_HI, fontSize: 11, letterSpacing: '0.12em' } as const

  return (
    <div className="rounded-2xl border p-6 sm:p-8" style={{ borderColor: LINE, background: PANEL, backdropFilter: 'blur(6px)' }}>
      <div className="grid gap-7 md:grid-cols-2">
        <fieldset className={fieldWrap}>
          <legend className="uppercase" style={legend}>Which dive</legend>
          <div className="mt-1 flex flex-col gap-2">
            {[...DIVES.map((d) => d.name), 'Not sure yet'].map((name) => (
              <label key={name} className="st-opt flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-2.5" style={{ borderColor: dive === name ? TEAL : LINE, background: dive === name ? 'rgba(55,174,190,0.12)' : 'transparent' }}>
                <input type="radio" name="dive" value={name} checked={dive === name} onChange={() => setDive(name)} className="st-radio" />
                <span style={{ fontFamily: SANS_MED, color: INK }}>{name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-7">
          <div className={fieldWrap}>
            <label htmlFor="st-date" className="uppercase" style={legend}>Preferred date</label>
            <input
              id="st-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="st-input rounded-lg border px-4 py-3"
              style={{ borderColor: LINE, background: 'rgba(2,10,14,0.5)', color: INK, fontFamily: SANS_MED, colorScheme: 'dark' }}
            />
          </div>

          <div className={fieldWrap}>
            <span className="uppercase" style={legend}>Divers</span>
            <div className="flex items-center gap-3">
              <button type="button" aria-label="Fewer divers" onClick={() => setDivers((n) => Math.max(1, n - 1))} className="st-step grid h-11 w-11 place-items-center rounded-lg border text-xl" style={{ borderColor: LINE, color: INK }}>−</button>
              <span className="min-w-10 text-center text-2xl" style={{ fontFamily: DISPLAY, color: INK }} aria-live="polite">{divers}</span>
              <button type="button" aria-label="More divers" onClick={() => setDivers((n) => Math.min(8, n + 1))} className="st-step grid h-11 w-11 place-items-center rounded-lg border text-xl" style={{ borderColor: LINE, color: INK }}>+</button>
            </div>
          </div>

          <fieldset className={fieldWrap}>
            <legend className="uppercase" style={legend}>Certification</legend>
            <div className="mt-1 flex flex-wrap gap-2">
              {['Advanced / Drysuit', 'Open Water', 'Not certified yet'].map((lv) => (
                <label key={lv} className="st-opt cursor-pointer rounded-full border px-4 py-2 text-sm" style={{ borderColor: level === lv ? TEAL : LINE, background: level === lv ? 'rgba(55,174,190,0.12)' : 'transparent', color: INK, fontFamily: SANS_MED }}>
                  <input type="radio" name="level" value={lv} checked={level === lv} onChange={() => setLevel(lv)} className="sr-only" />
                  {lv}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-start gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: LINE }}>
        <p className="max-w-sm text-sm" style={{ color: MUT2 }}>
          No online payment. This opens a pre-filled email to Erlendur, who confirms your day and the details.
        </p>
        <a
          href={mailto}
          className="st-cta inline-flex shrink-0 items-center gap-2 rounded-full px-7 py-3.5 text-sm tracking-[0.04em] uppercase"
          style={{ background: TEAL, color: DEEP, fontFamily: SANS_BOLD }}
        >
          Compose request
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </a>
      </div>
    </div>
  )
}

export default function StrytanPage() {
  const depthRef = useRef(0)
  const hudNum = useRef<HTMLSpanElement>(null)
  const hudBar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setThemeColor(DEEP)
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const doc = document.documentElement
        const max = doc.scrollHeight - window.innerHeight
        const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
        depthRef.current = p
        if (hudNum.current) hudNum.current.textContent = String(Math.round(p * MAX_DEPTH))
        if (hudBar.current) hudBar.current.style.transform = `scaleY(${p})`
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const jsonLd = useMemo(
    () =>
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SportsActivityLocation',
        name: 'Strýtan Dive Center',
        url: CURRENT_SITE,
        telephone: '+354 862 2949',
        email: EMAIL,
        image: company.thumb,
        address: { '@type': 'PostalAddress', addressLocality: 'Hjalteyri', addressRegion: 'Eyjafjörður', postalCode: '601', addressCountry: 'IS' },
        description: 'Guided scuba diving on the geothermal hydrothermal chimneys of Eyjafjörður, North Iceland. Since 2010.',
      }),
    [],
  )

  return (
    <div className="st-root min-h-screen overflow-x-hidden pb-[4.75rem] antialiased md:pb-0" style={{ background: DEEP, color: INK, fontFamily: SANS }}>
      <link rel="stylesheet" href={`${BASE}fonts/cabinet-grotesk/css/cabinet-grotesk.css`} />
      <script type="application/ld+json">{jsonLd}</script>

      <style>{`
        .st-reveal{opacity:0;transform:translateY(20px);transition:opacity .7s ease,transform .7s cubic-bezier(0.22,1,0.36,1)}
        .st-reveal[data-in="true"]{opacity:1;transform:none}
        .st-cta{transition:transform .2s ease,box-shadow .2s ease,filter .2s ease}
        .st-cta:hover{transform:translateY(-2px);filter:brightness(1.06);box-shadow:0 10px 30px -12px rgba(55,174,190,0.6)}
        .st-cta:active{transform:translateY(0)}
        .st-card{transition:transform .35s cubic-bezier(0.22,1,0.36,1),border-color .35s ease}
        .st-card:hover{transform:translateY(-5px);border-color:${TEAL}}
        .st-step{transition:border-color .2s ease,background .2s ease}
        .st-step:hover{border-color:${TEAL};background:rgba(55,174,190,0.1)}
        .st-radio{accent-color:${TEAL};width:16px;height:16px}
        .st-opt{transition:border-color .2s ease,background .2s ease}
        .st-input:focus{outline:none;border-color:${TEAL}}
        .st-root :focus-visible{outline:2px solid ${TEAL_HI};outline-offset:3px}
        @media (prefers-reduced-motion: reduce){
          .st-root *,.st-root *::before,.st-root *::after{transition-duration:.01ms!important;animation-duration:.01ms!important}
          .st-reveal{opacity:1;transform:none;transition:none}
        }
      `}</style>

      <OceanDescent depthRef={depthRef} />

      {/* ── Depth HUD ───────────────────────────────────────────────────── */}
      <div className="pointer-events-none fixed bottom-4 left-4 z-30 flex items-center gap-3 md:bottom-6 md:left-6" aria-hidden="true">
        <div className="relative h-16 w-[3px] overflow-hidden rounded-full" style={{ background: LINE }}>
          <div ref={hudBar} className="absolute inset-x-0 top-0 h-full origin-top" style={{ background: TEAL, transform: 'scaleY(0)' }} />
        </div>
        <div style={{ fontFamily: MONO }}>
          <span className="block text-[10px] tracking-[0.18em] uppercase" style={{ color: MUT2 }}>Depth</span>
          <span className="text-lg" style={{ color: TEAL_HI }}>
            <span ref={hudNum}>0</span> m
          </span>
        </div>
      </div>

      {/* ── Content over the descent ────────────────────────────────────── */}
      <div className="relative" style={{ zIndex: 10 }}>
        {/* header */}
        <header className="absolute inset-x-0 top-0 z-40">
          <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between px-5 py-5 md:px-8">
            <a href="#top" className="flex items-center" aria-label="Strýtan Dive Center">
              <img src={LOGO_WHITE} alt="Strýtan Dive Center" width={300} height={120} className="h-9 w-auto md:h-11" />
            </a>
            <nav className="hidden items-center gap-8 text-sm md:flex" style={{ fontFamily: SANS_BOLD }} aria-label="Menu">
              <a href="#dives" className="hover:opacity-70" style={{ color: INK }}>The dives</a>
              <a href="#story" className="hover:opacity-70" style={{ color: INK }}>The chimney</a>
              <a href="#courses" className="hover:opacity-70" style={{ color: INK }}>Courses</a>
              <a href="#request" className="hover:opacity-70" style={{ color: INK }}>Request</a>
            </nav>
            <CTA href="#request">Request a dive</CTA>
          </div>
        </header>

        {/* HERO — the surface */}
        <section id="top" className="relative flex min-h-[100svh] items-center">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(102deg, rgba(4,20,26,0.52) 0%, rgba(4,20,26,0.22) 42%, rgba(4,20,26,0) 70%)' }} />
          <div className="relative mx-auto w-full max-w-[1240px] px-5 pt-28 pb-20 md:px-8">
            <Reveal>
              <p className="text-xs tracking-[0.24em] uppercase" style={{ fontFamily: MONO, color: TEAL_HI }}>
                Hjalteyri · Eyjafjörður · since 2010
              </p>
              <h1 className="mt-6 max-w-4xl text-[clamp(3rem,8vw,7rem)] leading-[0.94]" style={{ fontFamily: DISPLAY, color: INK, fontWeight: 500, letterSpacing: '-0.015em' }}>
                Iceland&rsquo;s underwater
                <span style={{ color: TEAL_HI, fontStyle: 'italic' }}> volcano.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed" style={{ color: MUT }}>
                Strýtan is the only known geothermal hydrothermal chimney a diver can reach. Warm water rising through a mineral cathedral in the cold, clear fjord, dived only from Hjalteyri, only with us.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <CTA href="#request">Request a dive</CTA>
                <CTA href="#dives" solid={false}>See the dives</CTA>
              </div>
              <p className="mt-10 flex items-center gap-2 text-sm" style={{ fontFamily: MONO, color: MUT2 }}>
                <span className="inline-block h-4 w-px" style={{ background: TEAL }} />
                Scroll to descend
              </p>
            </Reveal>
          </div>
        </section>

        {/* INTRO — the chimney fact */}
        <section className="relative">
          <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
            <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-16">
              <Reveal>
                <h2 className="max-w-2xl text-3xl leading-[1.06] md:text-5xl" style={{ fontFamily: DISPLAY, color: INK }}>
                  Eleven thousand years, one chimney, ~72°C
                </h2>
              </Reveal>
              <Reveal delay={100}>
                <p className="text-lg leading-relaxed" style={{ color: MUT }}>
                  Geothermal water seeps up through the seabed of Eyjafjörður and, where it meets the cold sea, leaves its minerals behind. Grain by grain, over roughly eleven millennia, it has built a cone tall enough to dive along, its peak reaching up toward the light. In 2001 it became Iceland’s first protected underwater natural monument.
                </p>
              </Reveal>
            </div>
            <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border sm:grid-cols-4" style={{ borderColor: LINE, background: LINE }}>
              {[
                ['~72°C', 'Venting water'],
                ['~11,000', 'Years to build'],
                ['2001', 'Protected, a first for Iceland'],
                ['2010', 'Diving with us'],
              ].map(([big, small]) => (
                <div key={small} className="px-5 py-7" style={{ background: 'rgba(4,20,26,0.65)' }}>
                  <p className="text-3xl md:text-4xl" style={{ fontFamily: DISPLAY, color: TEAL_HI }}>{big}</p>
                  <p className="mt-1 text-sm" style={{ color: MUT2 }}>{small}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DIVES */}
        <section id="dives" className="relative scroll-mt-20">
          <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
            <Reveal>
              <p className="text-xs tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: TEAL_HI }}>The dives</p>
              <h2 className="mt-3 max-w-3xl text-4xl leading-[1.02] md:text-6xl" style={{ fontFamily: DISPLAY }}>
                Three ways down
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {DIVES.map((d, i) => (
                <Reveal key={d.id} delay={i * 90}>
                  <div className="st-card flex h-full flex-col rounded-2xl border p-7" style={{ borderColor: LINE, background: PANEL, backdropFilter: 'blur(6px)' }}>
                    <p className="text-xs tracking-[0.14em] uppercase" style={{ fontFamily: MONO, color: GLOW }}>{d.tag}</p>
                    <h3 className="mt-2 text-3xl" style={{ fontFamily: DISPLAY, color: INK }}>{d.name}</h3>
                    <div className="mt-4 flex gap-2 text-xs" style={{ fontFamily: MONO }}>
                      <span className="rounded-full border px-3 py-1" style={{ borderColor: LINE, color: TEAL_HI }}>{d.depth}</span>
                      <span className="rounded-full border px-3 py-1" style={{ borderColor: LINE, color: MUT }}>{d.level}</span>
                    </div>
                    <p className="mt-5 text-base leading-relaxed" style={{ color: MUT }}>{d.body}</p>
                    <ul className="mt-6 flex flex-col gap-2">
                      {d.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2.5 text-sm" style={{ color: MUT }}>
                          <span aria-hidden="true" className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: TEAL }} />
                          {h}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-7 pt-2">
                      <a href="#request" className="inline-flex items-center gap-2 text-sm tracking-[0.03em] uppercase" style={{ fontFamily: SANS_BOLD, color: TEAL_HI }}>
                        Request this dive
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                      </a>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* LIFE */}
        <section className="relative">
          <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
            <Reveal>
              <h2 className="max-w-3xl text-4xl leading-[1.02] md:text-6xl" style={{ fontFamily: DISPLAY }}>
                What meets you down there
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2 lg:grid-cols-4" style={{ borderColor: LINE, background: LINE }}>
              {LIFE.map((l, i) => (
                <Reveal key={l.name} delay={i * 70}>
                  <div className="h-full px-6 py-8" style={{ background: 'rgba(4,20,26,0.6)' }}>
                    <h3 className="text-xl" style={{ fontFamily: DISPLAY_MED, color: TEAL_HI }}>{l.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: MUT }}>{l.line}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* STORY + TIMELINE */}
        <section id="story" className="relative scroll-mt-20">
          <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
              <Reveal>
                <p className="text-xs tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: TEAL_HI }}>The diver who found them</p>
                <h2 className="mt-3 text-4xl leading-[1.04] md:text-5xl" style={{ fontFamily: DISPLAY }}>Erlendur Bogason</h2>
                <p className="mt-6 text-lg leading-relaxed" style={{ color: MUT }}>
                  A commercial diver since 1997, Erlendur found the great chimney at Ystavík and, later, the Arnarnes field. He has dived them ever since, working alongside the University of Akureyri and Iceland GeoSurvey and guiding divers as a PADI instructor. You are not booking a tour operator. You are diving with the person who discovered the site.
                </p>
                <div className="mt-8">
                  <a href={TRIPADVISOR} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm tracking-[0.03em] uppercase" style={{ fontFamily: SANS_BOLD, color: TEAL_HI }}>
                    Read the reviews
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg>
                  </a>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <ol className="relative flex flex-col gap-8 border-l-2 pl-8" style={{ borderColor: LINE }}>
                  {TIMELINE.map((t) => (
                    <li key={t.year} className="relative">
                      <span aria-hidden="true" className="absolute -left-[41px] top-1 grid h-5 w-5 place-items-center rounded-full" style={{ background: DEEP, border: `2px solid ${TEAL}` }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: TEAL_HI }} />
                      </span>
                      <p className="text-2xl" style={{ fontFamily: DISPLAY, color: TEAL_HI }}>{t.year}</p>
                      <p className="mt-1 text-base leading-relaxed" style={{ color: MUT }}>{t.text}</p>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </div>
        </section>

        {/* COURSES */}
        <section id="courses" className="relative scroll-mt-20">
          <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
            <Reveal>
              <p className="text-xs tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: TEAL_HI }}>PADI courses</p>
              <h2 className="mt-3 max-w-3xl text-4xl leading-[1.02] md:text-6xl" style={{ fontFamily: DISPLAY }}>New to the deep? Start here</h2>
            </Reveal>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {COURSES.map((c, i) => (
                <Reveal key={c.name} delay={i * 90}>
                  <div className="st-card h-full rounded-2xl border p-7" style={{ borderColor: LINE, background: PANEL, backdropFilter: 'blur(6px)' }}>
                    <span className="text-sm" style={{ fontFamily: MONO, color: GLOW }}>{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="mt-3 text-2xl" style={{ fontFamily: DISPLAY, color: INK }}>{c.name}</h3>
                    <p className="mt-3 text-base leading-relaxed" style={{ color: MUT }}>{c.line}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* REVIEWS (illustrative) */}
        <section className="relative">
          <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="max-w-2xl text-4xl leading-[1.04] md:text-5xl" style={{ fontFamily: DISPLAY }}>Divers surface buzzing</h2>
                <span className="text-xs tracking-[0.14em] uppercase" style={{ fontFamily: MONO, color: MUT2 }}>Sýnishorn · illustrative</span>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {REVIEWS.map((r, i) => (
                <Reveal key={i} delay={i * 90}>
                  <figure className="h-full rounded-2xl border p-7" style={{ borderColor: LINE, background: PANEL }}>
                    <div aria-hidden="true" className="text-sm" style={{ color: GLOW, letterSpacing: '2px' }}>★★★★★</div>
                    <blockquote className="mt-4 text-lg leading-relaxed" style={{ color: INK, fontFamily: DISPLAY_MED }}>“{r.quote}”</blockquote>
                    <figcaption className="mt-5 text-xs tracking-[0.1em] uppercase" style={{ fontFamily: MONO, color: MUT2 }}>{r.by}</figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* REQUEST */}
        <section id="request" className="relative scroll-mt-20">
          <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
            <Reveal>
              <p className="text-xs tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: TEAL_HI }}>Request a dive</p>
              <h2 className="mt-3 max-w-3xl text-4xl leading-[1.02] md:text-6xl" style={{ fontFamily: DISPLAY }}>Tell us your day</h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed" style={{ color: MUT }}>{SEASON.body}</p>
            </Reveal>
            <div className="mt-12">
              <Reveal><DiveRequest /></Reveal>
            </div>
          </div>
        </section>

        {/* VISIT */}
        <section className="relative border-t" style={{ borderColor: LINE }}>
          <div className="mx-auto max-w-[1240px] px-5 py-16 md:px-8 md:py-20">
            <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:gap-16">
              <Reveal>
                <h2 className="text-3xl md:text-4xl" style={{ fontFamily: DISPLAY }}>{SEASON.headline}</h2>
                <div className="mt-7 max-w-md border-t" style={{ borderColor: LINE }}>
                  <a href={MAPS} target="_blank" rel="noreferrer" className="flex items-baseline justify-between border-b py-3.5 hover:opacity-75" style={{ borderColor: LINE }}>
                    <span style={{ fontFamily: SANS_MED }}>{ADDRESS.place}</span>
                    <span className="text-sm" style={{ fontFamily: MONO, color: MUT }}>{ADDRESS.town}</span>
                  </a>
                  <a href={PHONE_HREF} className="flex items-baseline justify-between border-b py-3.5 hover:opacity-75" style={{ borderColor: LINE }}>
                    <span style={{ fontFamily: SANS_MED }}>Phone</span>
                    <span className="text-sm" style={{ fontFamily: MONO, color: MUT }}>{PHONE_DISPLAY}</span>
                  </a>
                  <a href={`mailto:${EMAIL}`} className="flex items-baseline justify-between border-b py-3.5 hover:opacity-75" style={{ borderColor: LINE }}>
                    <span style={{ fontFamily: SANS_MED }}>Email</span>
                    <span className="text-sm" style={{ fontFamily: MONO, color: MUT }}>{EMAIL}</span>
                  </a>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <div className="flex h-full flex-col justify-between rounded-2xl border p-7" style={{ borderColor: LINE, background: PANEL }}>
                  <img src={LOGO_WHITE} alt="Strýtan Dive Center" width={750} height={300} className="h-14 w-auto max-w-[62%] self-start object-contain" />
                  <p className="mt-6 text-base leading-relaxed" style={{ color: MUT }}>
                    The reef is protected and the site is fragile. We dive it in small groups, with respect, so it is still here in another eleven thousand years.
                  </p>
                  <div className="mt-7">
                    <CTA href="#request">Request a dive</CTA>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </div>

      <PreviewFooter company={company} />

      {/* mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t p-3 md:hidden" style={{ background: 'rgba(4,20,26,0.92)', borderColor: LINE, backdropFilter: 'blur(8px)' }}>
        <a href="#request" className="flex flex-1 items-center justify-center rounded-full px-5 py-3.5 text-sm tracking-[0.04em] uppercase" style={{ background: TEAL, color: DEEP, fontFamily: SANS_BOLD }}>
          Request a dive
        </a>
        <a href={PHONE_HREF} className="grid h-12 w-12 shrink-0 place-items-center rounded-full border" style={{ borderColor: LINE, color: INK }} aria-label="Call Strýtan">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
        </a>
      </div>

      <PreviewChrome company={company} />
    </div>
  )
}
