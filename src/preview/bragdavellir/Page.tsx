import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { WaterHero } from './WaterHero'
import {
  IMG, EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF, ADDRESS, BOOKING_URL,
  MAP_EMBED, MAP_LINK, HERO, PLACES, FACTS, COTTAGES, COTTAGES_NOTE,
  COTTAGES_HONEST, BARN, VISIT, JSON_LD,
} from './data'

gsap.registerPlugin(ScrollTrigger)

const company = getPreviewCompany('bragdavellir')

/* ── BRAGÐAVELLIR í fötum thepopuphotel.com ───────────────────────────────
   Structure and design recreated from THE POP-UP HOTEL (thepopuphotel.com),
   torn down LIVE (fonts, palette, section rhythm measured off the DOM):
     · warm-paper ground #F5F2EF · brand green #344541 · near-black #282727
       · cream #EFE9D9 — their exact measured values
     · hairline-divided nav: BOOK button left, centred small-caps tagline,
       links right; white over the hero, paper+green once scrolled
     · full-bleed hero with a centred STACKED LOCKUP (small caps / colossal
       letter-spaced serif / small caps — their THE / POP-UP / HOTEL move)
     · the showcase: a full-viewport plate, then a PAIR of half cards, then a
       full plate again — each labelled ONLY with a giant white handwritten
       script name (their Honeymoon Hand role → Caveat, Icelandic-complete)
     · serif headlines in green with ONE italic-serif em word inside
       (their "Event <em>Experiences</em> Unlike Any Other" move —
       Melodrama + Instrument Serif italic in the Noe Display/Text roles;
       body is Satoshi, which is literally the font their site uses)
     · an italic-serif statement band ON GREEN (their press-quote band — ours
       carries the farm's own line, since we fabricate no press quotes)
     · a cream editorial block, a news-style card grid, a near-black
       "Let's Chat" contact band, and a green closing band
     · square chrome-free buttons: green fill, white Satoshi 12px caps,
       1.2px tracking, 0 radius — their exact button spec
   No scroll-jack; reveals are opacity/transform with a failsafe.
   Own bv- namespace. ────────────────────────────────────────────────────── */

/* Palette — measured off thepopuphotel.com; ratios computed:
   GREEN #344541 on PAPER #F5F2EF ..... 7.55:1 (AAA)
   WHITE on GREEN ..................... 8.66:1 (AAA)
   INK #282727 on PAPER ............... 13.9:1 (AAA)
   WHITE on INK #282727 ............... 14.6:1 (AAA)
   GREEN on CREAM #EFE9D9 ............. 7.06:1 (AAA) */
const PAPER = '#F5F2EF'
const GREEN = '#344541'
const INK = '#282727'
const CREAM = '#EFE9D9'
const WHITE = '#FFFFFF'

const INK_SOFT = 'rgba(40,39,39,.78)'
const INK_MUTE = 'rgba(40,39,39,.55)'
const WHITE_SOFT = 'rgba(255,255,255,.86)'
const WHITE_MUTE = 'rgba(255,255,255,.62)'
const HAIR_DARK = 'rgba(40,39,39,.16)'
const HAIR_LIGHT = 'rgba(255,255,255,.26)'

const MELO = `${import.meta.env.BASE_URL}fonts/melodrama/fonts/`
const SERIF = "'Melodrama', 'Instrument Serif', Georgia, serif"      // Noe Display role
const SERIF_IT = "'Instrument Serif', Georgia, serif"                 // Noe Text italic role
const SCRIPT = "'Caveat', cursive"                                    // Honeymoon Hand role
const SANS = "'Satoshi', system-ui, sans-serif"                       // their actual body font

const FOCUS_L =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F2EF]'
const FOCUS_D =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344541]'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const PAGE_STYLES = `
@font-face { font-family: 'Melodrama'; src: url('${MELO}Melodrama-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Melodrama'; src: url('${MELO}Melodrama-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }
@font-face { font-family: 'Melodrama'; src: url('${MELO}Melodrama-Semibold.woff2') format('woff2'); font-weight: 600; font-style: normal; font-display: swap; }

.bv-root { background: ${PAPER}; color: ${INK}; }
.bv-root ::selection { background: ${GREEN}; color: ${WHITE}; }
.bv-serif { line-height: 1.12; }

/* Their exact button spec: square, green, Satoshi caps 12px, 1.2px tracking. */
.bv-btn {
  display: inline-flex; align-items: center; justify-content: center;
  min-height: 46px; padding: 0 23px; background: ${GREEN}; color: ${WHITE};
  font-size: 12px; text-transform: uppercase; letter-spacing: 1.2px; font-weight: 700;
  border: 0; border-radius: 0; text-decoration: none;
}
.bv-btn:hover { background: ${INK}; }
.bv-btn-ghost { background: transparent; color: ${WHITE}; box-shadow: inset 0 0 0 1px ${WHITE}; }
.bv-btn-ghost:hover { background: ${WHITE}; color: ${GREEN}; }

.bv-ul { position: relative; text-decoration: none; }
.bv-ul::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: -2px; height: 1px;
  background: currentColor; opacity: .5; transform: scaleX(0); transform-origin: left center;
}
.bv-ul:hover::after, .bv-ul:focus-visible::after { transform: scaleX(1); }

/* Showcase plates & cards — 0 radius, image + scrim + white script name. */
.bv-plate { position: relative; display: block; overflow: hidden; border-radius: 0; }
.bv-plate img.bv-ph { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.bv-plate .bv-scrim { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20,22,20,.18) 0%, rgba(20,22,20,.05) 45%, rgba(20,22,20,.52) 100%); }
.bv-plate:hover img.bv-ph { transform: scale(1.03); }

@media (prefers-reduced-motion: no-preference) {
  .bv-ul::after { transition: transform .4s cubic-bezier(.4,0,.2,1); }
  .bv-btn { transition: background .25s ease, color .25s ease; }
  .bv-plate img.bv-ph { transition: transform .9s cubic-bezier(.22,1,.36,1); }
  .bv-reveal { opacity: 0; transform: translateY(16px); }
}
@media (prefers-reduced-motion: reduce) {
  .bv-reveal { opacity: 1 !important; transform: none !important; }
  .bv-plate img.bv-ph { transition: none !important; transform: none !important; }
}

@keyframes bv-menu-in { from { opacity: 0; } to { opacity: 1; } }
.bv-menu-panel { animation: bv-menu-in .28s ease both; }
@media (prefers-reduced-motion: reduce) { .bv-menu-panel { animation: none !important; } }
`

const NAV_LINKS = [
  { id: 'stadir', label: 'Staðir' },
  { id: 'husin', label: 'Húsin' },
  { id: 'hladan', label: 'Hlaðan' },
  { id: 'heimsokn', label: 'Heimsókn' },
] as const

/* ═══════════════ NAV — hairline-divided bar ══════════════════════════════ */
function TopBar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduced = prefersReduced()

  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }), 40)
  }

  const fg = scrolled || open ? GREEN : WHITE
  const hair = scrolled || open ? HAIR_DARK : HAIR_LIGHT

  return (
    <>
      <nav aria-label="Aðalvalmynd" className="fixed inset-x-0 top-0 z-40"
        style={{
          background: scrolled || open ? 'rgba(245,242,239,.96)' : 'transparent',
          borderBottom: `1px solid ${hair}`,
          backdropFilter: scrolled || open ? 'blur(10px)' : undefined,
          WebkitBackdropFilter: scrolled || open ? 'blur(10px)' : undefined,
          transition: 'background .35s ease, border-color .35s ease',
        }}>
        <div className="grid min-h-[58px] grid-cols-[auto_1fr_auto] items-stretch">
          {/* BOOK, hairline-divided — their left zone */}
          <div className="flex items-center px-4 md:px-6" style={{ borderRight: `1px solid ${hair}` }}>
            <a href={BOOKING_URL} target="_blank" rel="noreferrer"
              className={`text-[12px] font-bold uppercase tracking-[1.2px] ${scrolled || open ? FOCUS_D : FOCUS_L}`}
              style={{ fontFamily: SANS, color: fg, textDecoration: 'none' }}>
              Bóka núna
            </a>
          </div>
          {/* centred tagline — their middle zone */}
          <div className="hidden items-center justify-center md:flex">
            <span className="text-[12px] font-bold uppercase tracking-[2px]" style={{ fontFamily: SANS, color: fg }}>
              Sumarhús &amp; Hlaðan við Djúpavog
            </span>
          </div>
          <div className="flex md:hidden" />
          {/* links — their right zone */}
          <div className="flex items-stretch" style={{ borderLeft: `1px solid ${hair}` }}>
            <div className="hidden items-center gap-6 px-6 lg:flex">
              {NAV_LINKS.map((n) => (
                <button key={n.id} type="button" onClick={() => go(n.id)}
                  className={`text-[12px] font-bold uppercase tracking-[1.2px] transition-opacity hover:opacity-60 ${scrolled || open ? FOCUS_D : FOCUS_L}`}
                  style={{ fontFamily: SANS, color: fg }}>
                  {n.label}
                </button>
              ))}
            </div>
            <button type="button" aria-label={open ? 'Loka valmynd' : 'Opna valmynd'} aria-expanded={open}
              aria-controls="bv-menu" onClick={() => setOpen((v) => !v)}
              className={`flex w-14 items-center justify-center lg:hidden ${scrolled || open ? FOCUS_D : FOCUS_L}`}>
              <span className="relative block h-3 w-6">
                <span aria-hidden className="absolute left-0 top-0 block h-px w-6"
                  style={{ background: fg, transform: open ? 'translateY(5.5px) rotate(45deg)' : 'none', transition: reduced ? 'none' : 'transform .3s' }} />
                <span aria-hidden className="absolute bottom-0 left-0 block h-px w-6"
                  style={{ background: fg, transform: open ? 'translateY(-5.5px) rotate(-45deg)' : 'none', transition: reduced ? 'none' : 'transform .3s' }} />
              </span>
            </button>
          </div>
        </div>
      </nav>
      {open ? (
        <div id="bv-menu" role="dialog" aria-modal="true" aria-label="Valmynd"
          className="bv-menu-panel fixed inset-0 z-30 flex flex-col justify-center gap-1 px-6 lg:hidden"
          style={{ background: PAPER }}>
          {NAV_LINKS.map((n) => (
            <button key={n.id} type="button" onClick={() => go(n.id)}
              className={`min-h-[52px] text-left ${FOCUS_D}`}
              style={{ fontFamily: SERIF, fontWeight: 500, fontSize: '2.2rem', color: GREEN }}>
              {n.label}
            </button>
          ))}
          <a href={BOOKING_URL} target="_blank" rel="noreferrer" className="bv-btn mt-6 self-start"
            style={{ fontFamily: SANS }}>
            Bóka núna
          </a>
        </div>
      ) : null}
    </>
  )
}

/* ═══════════════ HERO — full bleed + centred stacked lockup ══════════════ */
function Hero() {
  return (
    <header className="relative flex min-h-[100svh] items-center justify-center overflow-hidden" style={{ background: INK }}>
      {/* The water in the photograph is alive: a WebGL layer disturbs only the
          fjord surface so the reflection breathes while land and sky hold
          still. Falls back to the plain photo under reduced motion / no WebGL.
          The parallax class rides the WRAPPER so image and canvas stay locked
          together. */}
      <WaterHero src={IMG(HERO.photo)} alt={HERO.photoAlt} className="bv-hero-img" />
      <div aria-hidden className="absolute inset-0" style={{ background: 'rgba(24,26,24,.34)' }} />

      {/* THE / POP-UP / HOTEL → SUMARHÚS / BRAGÐAVELLIR / & HLAÐAN */}
      <div className="relative z-10 px-5 text-center">
        <p className="bv-hero-line m-0 text-[12px] font-bold uppercase tracking-[0.42em]"
          style={{ fontFamily: SANS, color: WHITE }}>
          Sumarhús
        </p>
        <h1 className="bv-hero-line m-0 mt-5 uppercase"
          style={{
            fontFamily: SERIF, fontWeight: 500, color: WHITE,
            fontSize: 'clamp(2.5rem, 8.2vw, 7.6rem)', lineHeight: 1.02, letterSpacing: '0.04em',
          }}>
          Bragðavellir
        </h1>
        <p className="bv-hero-line m-0 mt-5 text-[12px] font-bold uppercase tracking-[0.42em]"
          style={{ fontFamily: SANS, color: WHITE }}>
          &amp; Hlaðan
        </p>
      </div>

      <p className="absolute bottom-5 right-5 z-10 m-0 text-[10px] uppercase tracking-[0.16em]"
        style={{ fontFamily: SANS, color: WHITE_MUTE }}>
        {HERO.photoTag}
      </p>
    </header>
  )
}

/* ═══════════════ STAÐIR — the script-named showcase ══════════════════════
   Their homepage engine: full plate → pair of half cards → full plate…,
   each carrying ONLY a giant white handwritten name. */
function Places() {
  const reduced = prefersReduced()
  const go = (id?: string) => { if (id) document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }) }

  /* Group into their rhythm: a full plate stands alone; consecutive halves
     ride together as a pair. */
  const rows: (typeof PLACES[number])[][] = []
  PLACES.forEach((p) => {
    if (p.size === 'full') rows.push([p])
    else {
      const last = rows[rows.length - 1]
      if (last && last[0].size === 'half' && last.length === 1) last.push(p)
      else rows.push([p])
    }
  })

  return (
    <section id="stadir" className="scroll-mt-14">
      <div className="flex flex-col gap-3 md:gap-4">
        {rows.map((row) =>
          row[0].size === 'full' ? (
            <PlaceCard key={row[0].key} p={row[0]} tall onGo={go} />
          ) : (
            <div key={row[0].key + '-pair'} className="grid gap-3 md:grid-cols-2 md:gap-4">
              {row.map((q) => <PlaceCard key={q.key} p={q} onGo={go} />)}
            </div>
          ),
        )}
      </div>
    </section>
  )
}

function PlaceCard({ p, tall = false, onGo }: {
  p: (typeof PLACES)[number]; tall?: boolean; onGo: (id?: string) => void
}) {
  const interactive = Boolean(p.to)
  const Tag = interactive ? 'button' : 'div'
  return (
    <Tag
      {...(interactive ? { type: 'button' as const, onClick: () => onGo(p.to) } : {})}
      className={`bv-plate bv-reveal w-full text-left ${interactive ? FOCUS_L : ''}`}
      style={{ height: tall ? 'min(100svh, 820px)' : 'min(64svh, 460px)' }}
      aria-label={interactive ? `${p.name} — ${p.sub ?? ''}` : undefined}>
      <img className="bv-ph" src={IMG(p.img)} alt={p.alt} loading="lazy" decoding="async" />
      <span aria-hidden className="bv-scrim" />
      <span className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
        <span aria-hidden={interactive}
          style={{
            fontFamily: SCRIPT, fontWeight: 600, color: WHITE,
            fontSize: tall ? 'clamp(3rem, 7.5vw, 5.6rem)' : 'clamp(2.5rem, 5vw, 4rem)',
            lineHeight: 1.05, textShadow: '0 2px 24px rgba(0,0,0,.28)',
          }}>
          {p.name}
        </span>
        {p.sub ? (
          <span className="mt-3 text-[11px] font-bold uppercase tracking-[0.22em]"
            style={{ fontFamily: SANS, color: WHITE_SOFT }}>
            {p.sub}{p.to ? ' ↓' : ''}
          </span>
        ) : null}
      </span>
    </Tag>
  )
}

/* ═══════════════ FACTS STRIP — replaces their logo band, honestly ════════ */
function Facts() {
  return (
    <section className="px-5 py-12 md:px-8 md:py-16" style={{ background: PAPER }}>
      <p className="bv-reveal m-0 text-center text-[12px] font-bold uppercase tracking-[2px]"
        style={{ fontFamily: SANS, color: GREEN }}>
        Gott að vita
      </p>
      <div className="bv-reveal mx-auto mt-7 grid max-w-[1100px] grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4"
        style={{ background: HAIR_DARK, border: `1px solid ${HAIR_DARK}` }}>
        {FACTS.map((f) => (
          <p key={f} className="m-0 flex min-h-[76px] items-center justify-center px-5 text-center text-[13.5px]"
            style={{ fontFamily: SANS, color: INK_SOFT, background: PAPER }}>
            {f}
          </p>
        ))}
      </div>
    </section>
  )
}

/* ═══════════════ HÚSIN — editorial + house cards ═════════════════════════
   Their "Truly Unforgettable / Event <em>Experiences</em> Unlike Any Other"
   block, carrying the three real houses. */
function Houses() {
  return (
    <section id="husin" className="scroll-mt-14 px-5 py-16 md:px-8 md:py-24" style={{ background: PAPER }}>
      <div className="mx-auto max-w-[1200px]">
        <p className="bv-reveal m-0 text-center text-[12px] font-bold uppercase tracking-[2px]"
          style={{ fontFamily: SANS, color: GREEN }}>
          Gistingin
        </p>
        <h2 className="bv-serif bv-reveal m-0 mt-4 text-center"
          style={{ fontFamily: SERIF, fontWeight: 500, color: GREEN, fontSize: 'clamp(2.1rem, 5vw, 3.5rem)' }}>
          Einföld hús, <em style={{ fontFamily: SERIF_IT, fontStyle: 'italic', fontWeight: 400 }}>kyrrð</em> og fjörður
        </h2>
        <p className="bv-reveal mx-auto mt-5 max-w-[40rem] text-center text-[15px] leading-[1.8]"
          style={{ fontFamily: SANS, color: INK_SOFT }}>
          {COTTAGES_HONEST}
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
          {COTTAGES.map((ct) => (
            <article key={ct.key} className="bv-reveal">
              <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 3', background: CREAM }}>
                <img src={IMG(ct.imgs[0].file)} alt={ct.imgs[0].alt} loading="lazy" decoding="async"
                  className="bv-ph absolute inset-0 h-full w-full object-cover" />
              </div>
              <h3 className="bv-serif m-0 mt-5"
                style={{ fontFamily: SERIF, fontWeight: 500, color: GREEN, fontSize: '1.65rem' }}>
                {ct.name}
              </h3>
              <p className="m-0 mt-2 text-[12px] font-bold uppercase tracking-[1.2px]"
                style={{ fontFamily: SANS, color: INK_MUTE }}>
                {ct.size} · {ct.sleeps} · {ct.beds}
              </p>
              <p className="mt-3 text-[14px] leading-[1.7]" style={{ fontFamily: SANS, color: INK_SOFT }}>
                {ct.body}
              </p>
              <a href={BOOKING_URL} target="_blank" rel="noreferrer" className={`bv-btn mt-5 ${FOCUS_D}`}
                style={{ fontFamily: SANS }}>
                Sjá verð og bóka
              </a>
            </article>
          ))}
        </div>
        <p className="bv-reveal mx-auto mt-10 max-w-[44rem] text-center text-[12.5px] leading-[1.7]"
          style={{ fontFamily: SANS, color: INK_MUTE }}>
          {COTTAGES_NOTE}
        </p>
      </div>
    </section>
  )
}

/* ═══════════════ STATEMENT BAND — italic serif on green ══════════════════
   Their press-quote band; ours carries the farm's own line (no invented
   quotes, per the honesty flags). */
function Statement() {
  return (
    <section className="px-5 py-20 md:px-8 md:py-28" style={{ background: GREEN }}>
      <p className="bv-reveal mx-auto m-0 max-w-[52rem] text-center text-balance"
        style={{ fontFamily: SERIF_IT, fontStyle: 'italic', fontWeight: 400, color: WHITE, fontSize: 'clamp(1.7rem, 4vw, 2.9rem)', lineHeight: 1.3 }}>
        “Fjallið fyrir ofan, fjaran fyrir neðan og lítið annað á milli.”
      </p>
      <p className="bv-reveal m-0 mt-6 text-center text-[12px] font-bold uppercase tracking-[2px]"
        style={{ fontFamily: SANS, color: WHITE_MUTE }}>
        Hér er ekkert að flýta sér
      </p>
    </section>
  )
}

/* ═══════════════ HLAÐAN — cream editorial ════════════════════════════════ */
function Barn() {
  return (
    <section id="hladan" className="scroll-mt-14 px-5 py-16 md:px-8 md:py-24" style={{ background: CREAM }}>
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <p className="bv-reveal m-0 text-[12px] font-bold uppercase tracking-[2px]" style={{ fontFamily: SANS, color: GREEN }}>
              {BARN.kicker}
            </p>
            <h2 className="bv-serif bv-reveal m-0 mt-4"
              style={{ fontFamily: SERIF, fontWeight: 500, color: GREEN, fontSize: 'clamp(2.1rem, 5vw, 3.5rem)' }}>
              Bistró í <em style={{ fontFamily: SERIF_IT, fontStyle: 'italic', fontWeight: 400 }}>gömlu</em> fjósi
            </h2>
            <p className="bv-reveal mt-5 max-w-[34rem] text-[15px] leading-[1.8]" style={{ fontFamily: SANS, color: INK_SOFT }}>
              {BARN.body}
            </p>
            <dl className="bv-reveal m-0 mt-8">
              {BARN.hours.map((h) => (
                <div key={h.label} className="flex items-baseline justify-between gap-6 border-b py-3.5" style={{ borderColor: HAIR_DARK }}>
                  <dt className="text-[15px]" style={{ fontFamily: SERIF, fontWeight: 500, color: GREEN }}>{h.label}</dt>
                  <dd className="m-0 text-right text-[12.5px]" style={{ fontFamily: SANS, color: INK_MUTE }}>{h.value}</dd>
                </div>
              ))}
            </dl>
            <p className="bv-reveal mt-5 max-w-[32rem] text-[12.5px] leading-[1.65]" style={{ fontFamily: SANS, color: GREEN }}>
              {BARN.seasonNote}
            </p>
          </div>
          <div className="bv-reveal grid grid-cols-2 gap-3 self-start md:gap-4">
            {BARN.dishes.map((d, i) => (
              <div key={d.file} className={`relative overflow-hidden ${i === 1 || i === 3 ? 'mt-8' : ''}`}
                style={{ aspectRatio: '3 / 4', background: PAPER }}>
                <img src={IMG(d.file)} alt={d.alt} loading="lazy" decoding="async"
                  className="bv-ph absolute inset-0 h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        <p className="bv-reveal mt-10 max-w-[44rem] text-[12.5px] leading-[1.7]" style={{ fontFamily: SANS, color: INK_MUTE }}>
          {BARN.menuNote}
        </p>
      </div>
    </section>
  )
}

/* ═══════════════ HEIMSÓKN — their near-black "Let's Chat" band ═══════════ */
function Visit() {
  return (
    <section id="heimsokn" className="scroll-mt-14 px-5 py-16 md:px-8 md:py-24" style={{ background: INK }}>
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <h2 className="bv-serif bv-reveal m-0"
              style={{ fontFamily: SERIF, fontWeight: 500, color: WHITE, fontSize: 'clamp(2.2rem, 5.5vw, 4rem)' }}>
              Komdu í <em style={{ fontFamily: SERIF_IT, fontStyle: 'italic', fontWeight: 400 }}>heimsókn</em>
            </h2>
            <p className="bv-reveal mt-5 max-w-[30rem] text-[15px] leading-[1.8]" style={{ fontFamily: SANS, color: WHITE_SOFT }}>
              {VISIT.lead}
            </p>
            <dl className="bv-reveal m-0 mt-8 max-w-[32rem]">
              {VISIT.lines.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-6 border-b py-3.5" style={{ borderColor: HAIR_LIGHT }}>
                  <dt className="text-[10.5px] font-bold uppercase tracking-[1.2px]" style={{ fontFamily: SANS, color: WHITE_MUTE }}>{row.label}</dt>
                  <dd className="m-0 text-right">
                    <a href={row.href} {...(row.href === MAP_LINK ? { target: '_blank', rel: 'noreferrer' } : {})}
                      className={`bv-ul inline-flex min-h-[44px] items-center text-[13.5px] ${FOCUS_L}`}
                      style={{ fontFamily: SANS, color: WHITE_SOFT }}>{row.value}</a>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="bv-reveal mt-5 max-w-[30rem] text-[12.5px] leading-[1.6]" style={{ fontFamily: SANS, color: WHITE_MUTE }}>
              {VISIT.note}
            </p>
            <a href={BOOKING_URL} target="_blank" rel="noreferrer" className={`bv-btn mt-7 ${FOCUS_L}`}
              style={{ fontFamily: SANS }}>
              Bóka núna
            </a>
          </div>
          <div className="bv-reveal">
            <div className="overflow-hidden" style={{ boxShadow: `inset 0 0 0 1px ${HAIR_LIGHT}` }}>
              <iframe title={`Kort af Bragðavöllum, ${ADDRESS}`} src={MAP_EMBED} loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" className="h-[320px] w-full border-0 md:h-[430px]"
                style={{ filter: 'grayscale(1) contrast(1.04) brightness(.9)' }} />
            </div>
            <a href={MAP_LINK} target="_blank" rel="noreferrer"
              className={`bv-ul mt-3 inline-flex min-h-[44px] items-center text-[11px] font-bold uppercase tracking-[1.2px] ${FOCUS_L}`}
              style={{ fontFamily: SANS, color: WHITE_MUTE }}>
              Opna í Google kortum
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ CLOSING BAND — green, their footer ground ═══════════════ */
function Closing() {
  return (
    <section className="px-5 py-16 text-center md:px-8 md:py-20" style={{ background: GREEN }}>
      <p className="bv-reveal m-0" style={{ fontFamily: SCRIPT, fontWeight: 600, color: WHITE, fontSize: 'clamp(2.6rem, 6vw, 4.4rem)', lineHeight: 1.05 }}>
        Sjáumst í sveitinni
      </p>
      <div className="bv-reveal mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        <a href={EMAIL_HREF} className={`bv-ul text-[13px] ${FOCUS_L}`} style={{ fontFamily: SANS, color: WHITE_SOFT }}>{EMAIL}</a>
        <a href={PHONE_HREF} className={`bv-ul text-[13px] ${FOCUS_L}`} style={{ fontFamily: SANS, color: WHITE_SOFT }}>{PHONE_DISPLAY}</a>
      </div>
    </section>
  )
}

/* ═══════════════ PAGE ════════════════════════════════════════════════════ */
export default function Page() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = 'Bragðavellir · Sumarhús og Hlaðan við Djúpavog'
    setThemeColor(PAPER)
    const s = document.createElement('script')
    s.type = 'application/ld+json'
    s.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(s)
    return () => { s.remove() }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root)
      const lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 1, smoothWheel: true })
      lenis.on('scroll', ScrollTrigger.update)
      const tick = (t: number) => lenis.raf(t * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)

      /* Toward the resting state, never away from it — see the note in the
         other builds: gsap.from() leaves the lockup invisible to any renderer
         that captures before the tween advances. */
      const heroLines = q('.bv-hero-line')
      gsap.fromTo(heroLines, { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.2 })
      const heroFailsafe = window.setTimeout(() => {
        heroLines.forEach((el) => {
          if (parseFloat(window.getComputedStyle(el).opacity) < 0.9) gsap.set(el, { opacity: 1, y: 0 })
        })
      }, 2200)
      const heroImg = q('.bv-hero-img')[0]
      if (heroImg) {
        gsap.fromTo(heroImg, { yPercent: -4, scale: 1.08 }, {
          yPercent: 6, scale: 1.08, ease: 'none',
          scrollTrigger: { trigger: heroImg, start: 'top top', end: 'bottom top', scrub: true },
        })
      }
      q('.bv-reveal').forEach((el) => {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true } })
      })
      document.fonts?.ready.then(() => ScrollTrigger.refresh())
      const failsafe = window.setTimeout(() => {
        q('.bv-reveal').forEach((el) => {
          if (parseFloat(window.getComputedStyle(el).opacity) < 0.9) gsap.set(el, { opacity: 1, y: 0 })
        })
      }, 1800)
      return () => {
        window.clearTimeout(failsafe)
        window.clearTimeout(heroFailsafe)
        gsap.ticker.remove(tick)
        lenis.destroy()
      }
    })
    return () => { mm.revert() }
  }, [])

  return (
    <div ref={rootRef} lang="is" className="bv-root antialiased" style={{ overflowX: 'clip' }}>
      <style>{PAGE_STYLES}</style>
      <TopBar />
      <main>
        <Hero />
        <Places />
        <Facts />
        <Houses />
        <Statement />
        <Barn />
        <Visit />
        <Closing />
      </main>
      <PreviewChrome company={company} />
      <PreviewFooter company={company} />
    </div>
  )
}
