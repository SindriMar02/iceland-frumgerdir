import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  IMG, PHONE_DISPLAY, PHONE_HREF, ADDRESS,
  BOOKING_URL, MAP_EMBED, MAP_LINK, NAV, HERO, SAGA, ROOMS, ROOMS_INTRO,
  ROOMS_NOTE, RATINGS, CAFE, PLACE, VISIT, JSON_LD,
} from './data'

gsap.registerPlugin(ScrollTrigger, SplitText)

const company = getPreviewCompany('sjavarborg')

/* ── „Borgin við sjóinn" — the sea-castle at the harbour. ─────────────────
   One green house on the Stykkishólmur harbour front has been an ice store,
   a home, a shop, a bookstore, a barber, a grocer and now a guesthouse with a
   café — always facing Breiðafjörður. TWO forces: the SEA it stands over and
   the HOUSE that keeps changing use. The page fixes a warm editorial serif on
   a cool fjord-slate world and tells the building's 110 years as its signature
   moment: a pinned heritage timeline where the house builds itself through
   time. Lineage: ballenacabo / our own Hótel Búðir GSAP language — but its own
   structure (vertical, a pinned time-scrub instead of a horizontal journey).
   Nothing here shares budir's bu- namespace. ─────────────────────────────── */

/* Palette — computed WCAG ratios (relative luminance):
   INK #16262B on PAPER #E9E4D8 ...... 12.3:1 (AAA)
   INK on SAND #DED7C6 ............... ~11:1 (AAA)
   BRASS_INK #8A5E22 on PAPER ........  4.5:1 (AA small) — sparing accents
   BRASS #B07A34 on PAPER ............  3.1:1 — LARGE/decorative only
   PAPER on INK band ................. ~12.3:1 (AAA)
   BRASS_LT #CFA15C on INK band ......  6.9:1 (AA small on dark) */
const PAPER = '#E9E4D8'
const SAND = '#DED7C6'      // the slightly deeper band ground
const INK = '#16262B'       // deep fjord slate
const SEA = '#22383D'       // mid sea-slate (dark bands)
const BRASS = '#B07A34'     // decorative / large accent
const BRASS_INK = '#8A5E22' // small-text-safe brass on paper
const BRASS_LT = '#CFA15C'  // small brass on ink bands

const INK_SOFT = 'rgba(22,38,43,.82)'
const INK_MUTE = 'rgba(22,38,43,.60)'
const PAPER_SOFT = 'rgba(233,228,216,.84)'
const PAPER_MUTE = 'rgba(233,228,216,.62)'
const HAIR_INK = 'rgba(22,38,43,.16)'
const HAIR_PAPER = 'rgba(233,228,216,.20)'

/* Erode — a sharp serif with subtly weathered/eroded terminals; self-hosted.
   Its salt-worn character suits a 110-year-old harbour building. Paired with
   Satoshi (already loaded) so the display carries all the personality. */
const FONTS = `${import.meta.env.BASE_URL}fonts/erode/`
const DISPLAY = "'Erode', 'Cormorant Garamond', Georgia, serif"
const SANS = "'Satoshi', system-ui, sans-serif"

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B07A34]'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ── Page-local styles — sb- only, nothing leaks. ─────────────────────── */
const PAGE_STYLES = `
@font-face { font-family: 'Erode'; src: url('${FONTS}Erode-Light.woff2') format('woff2'); font-weight: 300; font-style: normal; font-display: swap; }
@font-face { font-family: 'Erode'; src: url('${FONTS}Erode-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Erode'; src: url('${FONTS}Erode-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }
@font-face { font-family: 'Erode'; src: url('${FONTS}Erode-Semibold.woff2') format('woff2'); font-weight: 600; font-style: normal; font-display: swap; }

.sb-root { background: ${PAPER}; color: ${INK}; }
.sb-root ::selection { background: ${INK}; color: ${PAPER}; }

/* Display + line masks: Erode accents (Í, Á, ð) + descenders (j, g, þ, p)
   need headroom so a char/line reveal clips the MOTION, never the glyph. The
   char masks size to the line-box, so a tight line-height guillotines accents —
   force a comfortable leading on every char-split heading (beats inline). */
.sb-mask { overflow: hidden; padding: 0.1em 0 0.12em; }
.sb-chars { line-height: 1.3 !important; }
.sb-vert { writing-mode: vertical-rl; transform: rotate(180deg); }

/* TEXT LINKS — a brass underline wiping in from the left. */
.sb-ul { position: relative; text-decoration: none; }
.sb-ul::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: -1px;
  height: 1px; background: ${BRASS}; transform: scaleX(0); transform-origin: left center;
}
.sb-ul:hover::after, .sb-ul:focus-visible::after { transform: scaleX(1); }

/* CTA — brass fill wipes up behind ink-on-brass text (INK on BRASS = 5.2:1). */
.sb-cta { position: relative; overflow: hidden; isolation: isolate; }
.sb-cta::before {
  content: ''; position: absolute; inset: 0; z-index: -1; background: ${BRASS};
  transform: scaleY(0); transform-origin: bottom center;
}
.sb-cta:hover { color: ${INK} !important; letter-spacing: .18em; }
.sb-cta:hover::before { transform: scaleY(1); }

/* Photo hover — quiet saturation + a slow inner push. */
.sb-photo .sb-img { filter: saturate(.92); }
.sb-photo:hover .sb-img { filter: saturate(1); transform: scale(1.035); }
.sb-photo figcaption { opacity: .8; }
.sb-photo:hover figcaption { opacity: 1; }

/* Slab lift for room cards + place cards. */
.sb-slab:hover { transform: translateY(-5px); box-shadow: 0 22px 44px -24px rgba(22,38,43,.5); }

@media (prefers-reduced-motion: no-preference) {
  .sb-ul::after { transition: transform .4s cubic-bezier(.4,0,.2,1); }
  .sb-cta { transition: letter-spacing .35s ease, color .2s ease; }
  .sb-cta::before { transition: transform .45s cubic-bezier(.4,0,.2,1); }
  .sb-img { transition: filter .6s ease, transform .8s cubic-bezier(.22,1,.36,1); }
  .sb-photo figcaption { transition: opacity .4s ease; }
  .sb-slab { transition: transform .5s cubic-bezier(.22,1,.36,1), box-shadow .5s ease; }
}

/* Reveal furniture: JS arms the hidden start; without JS / reduced motion the
   resting state is fully visible (opacity/transform only — NO clip-path). */
.sb-up { will-change: transform, opacity; }

/* ═══ THE HERITAGE TIMELINE ═══ Default (mobile + reduced motion): every era
   is a static card stacked vertically, fully legible. Desktop + motion turns
   the stage into a pinned 100svh scrub where the eras crossfade in place and a
   left "core sample" fills with time. The JS only runs in that branch, so the
   mobile CSS below is the safe resting layout. */
.sb-saga-stage { position: relative; }
.sb-era { position: relative; }
.sb-strata, .sb-saga-count { display: none; }

@media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
  .sb-saga-stage { height: 100svh; }
  .sb-era {
    position: absolute; inset: 0; opacity: 0;
    display: grid; align-content: center;
  }
  .sb-strata { display: block; }
  .sb-saga-count { display: flex; }
}

@keyframes sb-menu-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes sb-menu-link { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
.sb-menu-panel { animation: sb-menu-in .3s ease both; }
.sb-menu-link { animation: sb-menu-link .55s cubic-bezier(.22,1,.36,1) both; }

@media (prefers-reduced-motion: reduce) {
  .sb-menu-panel, .sb-menu-link { animation: none !important; opacity: 1 !important; transform: none !important; }
  .sb-img { transition: none !important; filter: none !important; transform: none !important; }
  .sb-cta { transition: none !important; }
}
`

/* ═══════════════ Photo ═══════════════════════════════════════════════════ */
function Photo({
  src, alt, spec, aspect = 'aspect-[4/3]', className = '', position = 'center',
  priority = false, tone = 'light', parallax = false,
}: {
  src: string; alt: string; spec?: string; aspect?: string; className?: string
  position?: string; priority?: boolean; tone?: 'light' | 'dark'; parallax?: boolean
}) {
  const [failed, setFailed] = useState(false)
  return (
    <figure className={`sb-photo relative m-0 ${className}`}>
      <div className={`relative overflow-hidden ${aspect}`}
        style={{ boxShadow: `inset 0 0 0 1px ${tone === 'light' ? HAIR_INK : HAIR_PAPER}` }}>
        {failed ? (
          <div className="absolute inset-0" style={{ background: SAND }} role="img" aria-label={alt} />
        ) : (
          <img
            src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async"
            {...(priority ? { fetchpriority: 'high' as const } : {})}
            data-sb-parallax={parallax ? '1' : undefined}
            onError={() => setFailed(true)}
            className="sb-img absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: position }}
          />
        )}
      </div>
      {spec ? (
        <figcaption
          className="mt-2.5 flex items-baseline justify-between gap-4 border-t pt-2.5 text-[10.5px] uppercase tracking-[0.16em]"
          style={{
            fontFamily: SANS,
            borderColor: tone === 'light' ? HAIR_INK : HAIR_PAPER,
            color: tone === 'light' ? INK_MUTE : PAPER_MUTE,
          }}>
          <span>{spec}</span>
        </figcaption>
      ) : null}
    </figure>
  )
}

/* ═══════════════ Section head — a drawn rule + index ═════════════════════ */
function SectionHead({ index, label, tone = 'light' }: {
  index: string; label: string; tone?: 'light' | 'dark'
}) {
  return (
    <div>
      <div className="sb-rule h-px w-full origin-left"
        style={{ background: tone === 'light' ? INK : PAPER, opacity: tone === 'light' ? 0.5 : 0.4 }} />
      <div className="sb-up flex items-baseline justify-between pt-3 text-[11px] font-medium uppercase tracking-[0.24em]"
        style={{ fontFamily: SANS, color: tone === 'light' ? INK_MUTE : PAPER_MUTE }}>
        <span>{label}</span>
        <span aria-hidden style={{ color: tone === 'light' ? BRASS_INK : BRASS_LT }}>({index})</span>
      </div>
    </div>
  )
}

/* ═══════════════ Header + full-screen menu ═══════════════════════════════ */
function TopNav() {
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
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    window.setTimeout(() => {
      const el = document.getElementById(id)
      el?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
    }, 40)
  }
  const solid = scrolled || open

  return (
    <>
      {/* The hero is a light/dark split, so a single transparent-nav colour
          can't stay legible across it. A frosted-chalk bar with INK text is
          robust over both halves; the hairline firms up on scroll. */}
      <nav aria-label="Aðalvalmynd" className="fixed inset-x-0 top-0 z-40"
        style={{
          background: solid ? 'rgba(233,228,216,.94)' : 'rgba(233,228,216,.58)',
          borderBottom: `1px solid ${solid ? HAIR_INK : 'transparent'}`,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          transition: 'background .35s ease, border-color .35s ease',
        }}>
        <div className="flex items-center justify-between px-5 py-4 md:px-8">
          <button type="button"
            onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }) }}
            className={`min-h-[44px] ${FOCUS}`}
            style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: '1.35rem', letterSpacing: '-0.01em', color: INK }}>
            Sjávarborg
          </button>
          <div className="hidden items-center gap-8 lg:flex">
            {NAV.map((n) => (
              <button key={n.id} type="button" onClick={() => go(n.id)}
                className={`min-h-[44px] text-[12px] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-60 ${FOCUS}`}
                style={{ fontFamily: SANS, color: INK }}>
                {n.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-5">
            <a href={PHONE_HREF}
              className={`hidden min-h-[44px] items-center text-[12px] tracking-[0.04em] sm:flex ${FOCUS}`}
              style={{ fontFamily: SANS, color: INK_SOFT }}>
              {PHONE_DISPLAY}
            </a>
            <a href={BOOKING_URL} target="_blank" rel="noreferrer"
              className={`sb-ul flex min-h-[44px] items-center text-[13px] font-medium tracking-[0.03em] ${FOCUS}`}
              style={{ fontFamily: SANS, color: INK }}>
              Bóka
            </a>
            <button type="button" aria-label={open ? 'Loka valmynd' : 'Opna valmynd'}
              aria-expanded={open} aria-controls="sb-menu"
              onClick={() => setOpen((v) => !v)}
              className={`relative flex h-11 w-11 items-center justify-center lg:hidden ${FOCUS}`}>
              <span aria-hidden className="absolute block h-px w-6"
                style={{
                  background: INK,
                  transform: open ? 'rotate(45deg)' : 'translateY(-4px)',
                  transition: reduced ? 'none' : 'transform .32s cubic-bezier(.22,1,.36,1)',
                }} />
              <span aria-hidden className="absolute block h-px w-6"
                style={{
                  background: INK,
                  transform: open ? 'rotate(-45deg)' : 'translateY(4px)',
                  transition: reduced ? 'none' : 'transform .32s cubic-bezier(.22,1,.36,1)',
                }} />
            </button>
          </div>
        </div>
      </nav>
      {open ? (
        <div id="sb-menu" role="dialog" aria-modal="true" aria-label="Valmynd"
          className="sb-menu-panel fixed inset-0 z-30 flex flex-col justify-between px-6 pb-10 pt-28 lg:hidden"
          style={{ background: PAPER }}>
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {NAV.map((n, i) => (
              <li key={n.id} className="sb-menu-link" style={{ animationDelay: `${90 + i * 60}ms` }}>
                <button type="button" onClick={() => go(n.id)}
                  className={`min-h-[48px] text-left ${FOCUS}`}
                  style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: '2.3rem', color: INK, lineHeight: 1.15 }}>
                  {n.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="sb-menu-link flex flex-wrap items-center gap-x-8 gap-y-3"
            style={{ animationDelay: `${90 + NAV.length * 60}ms` }}>
            <a href={BOOKING_URL} target="_blank" rel="noreferrer"
              className={`sb-ul flex min-h-[44px] items-center text-[14px] font-medium tracking-[0.03em] ${FOCUS}`}
              style={{ fontFamily: SANS, color: INK }}>
              Bóka gistingu
            </a>
            <a href={PHONE_HREF}
              className={`flex min-h-[44px] items-center text-[13px] tracking-[0.04em] ${FOCUS}`}
              style={{ fontFamily: SANS, color: INK_SOFT }}>
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      ) : null}
    </>
  )
}

/* ═══════════════ HERO — a name-led editorial split ═══════════════════════
   Type on the chalk ground (the name means "the castle by the sea"), the sharp
   Súgandisey lighthouse full-bleed alongside. Not a photo-with-title-overlay —
   an asymmetric editorial split that leans into the name. */
function Hero() {
  const chars = HERO.word.split('')
  return (
    <header className="relative grid min-h-[100svh] grid-rows-[44svh_1fr] overflow-hidden lg:grid-cols-[1.06fr_0.94fr] lg:grid-rows-1"
      style={{ background: PAPER }}>
      {/* Type column (second on mobile, first on desktop). */}
      <div className="order-2 flex flex-col justify-between px-5 pb-10 pt-6 md:px-8 lg:order-1 lg:pb-12 lg:pt-28">
        <p className="sb-hero-fade m-0 hidden text-[11px] font-medium uppercase tracking-[0.22em] lg:block"
          style={{ fontFamily: SANS, color: INK_MUTE }}>
          {HERO.eyebrow}
        </p>
        <div className="lg:pb-2">
          <div className="sb-hero-fade flex items-baseline gap-4">
            <span className="text-[13px] font-medium uppercase tracking-[0.28em]" style={{ fontFamily: SANS, color: BRASS_INK }}>
              {HERO.gloss}
            </span>
            <span aria-hidden className="hidden h-px flex-1 sm:block" style={{ background: HAIR_INK }} />
            <span className="text-[11px] font-medium uppercase tracking-[0.2em]" style={{ fontFamily: SANS, color: INK_MUTE }}>
              {HERO.year}
            </span>
          </div>
          <div className="sb-mask mt-2">
            <h1 aria-label={HERO.word} className="m-0"
              style={{
                fontFamily: DISPLAY, fontWeight: 400, color: INK,
                fontSize: 'clamp(3rem, 9vw, 8.5rem)', lineHeight: 1.04, letterSpacing: '-0.015em',
              }}>
              {chars.map((ch, i) => (
                <span key={`${ch}-${i}`} aria-hidden className="sb-hero-char inline-block">{ch}</span>
              ))}
            </h1>
          </div>
          <p className="sb-hero-fade mt-6 max-w-[32rem] text-[15px] leading-[1.75]"
            style={{ fontFamily: SANS, color: INK_SOFT }}>
            {HERO.sub}
          </p>
          <div className="sb-hero-fade mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href={BOOKING_URL} target="_blank" rel="noreferrer"
              className={`sb-cta relative inline-flex min-h-[50px] items-center px-7 text-[12px] font-semibold uppercase tracking-[0.14em] ${FOCUS}`}
              style={{ fontFamily: SANS, border: `1px solid ${INK}`, color: INK }}>
              {HERO.cta}
            </a>
            <a href={PHONE_HREF}
              className={`sb-ul inline-flex min-h-[44px] items-center text-[13px] tracking-[0.04em] ${FOCUS}`}
              style={{ fontFamily: SANS, color: INK }}>
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </div>

      {/* Image column (first on mobile). */}
      <div className="relative order-1 overflow-hidden lg:order-2" style={{ background: INK }}>
        <img src={IMG(HERO.photo)} alt={HERO.photoAlt}
          loading="eager" decoding="async" {...{ fetchpriority: 'high' as const }}
          data-sb-parallax="1"
          className="sb-hero-img absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: 'center 38%' }} />
        <span className="sb-hero-fade absolute bottom-4 right-4 z-10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em]"
          style={{ fontFamily: SANS, color: PAPER_SOFT, background: 'rgba(22,38,43,.55)', backdropFilter: 'blur(4px)' }}>
          {HERO.photoTag}
        </span>
      </div>
    </header>
  )
}

/* ═══════════════ INTRO — one poetic beat ═════════════════════════════════ */
function Intro() {
  return (
    <section className="px-5 pb-16 pt-20 md:px-8 md:pb-24 md:pt-28" style={{ background: PAPER }}>
      <div className="mx-auto max-w-[62rem]">
        <p className="sb-lines m-0 text-balance"
          style={{
            fontFamily: DISPLAY, fontWeight: 400, color: INK,
            fontSize: 'clamp(1.6rem, 4.4vw, 3.1rem)', lineHeight: 1.32, letterSpacing: '-0.01em',
          }}>
          Eitt grænt hús fremst á bryggjunni hefur verið íshús, heimili, verslun og
          er nú gistiheimili með kaffihúsi. Alltaf á sama stað, alltaf með
          Breiðafjörð fyrir framan gluggann.
        </p>
      </div>
    </section>
  )
}

/* ═══════════════ SAGAN — the heritage timeline (signature) ═══════════════
   Desktop + motion: pinned stage, eras crossfade in place while a left "core
   sample" fills with time. Mobile / reduced motion: the SAME eras as a plain
   vertical stack of cards, revealed on scroll. */
function Saga() {
  return (
    <section id="sagan" className="scroll-mt-16 overflow-hidden" style={{ background: SAND }}>
      <div className="px-5 pt-16 md:px-8 md:pt-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead index="01" label={SAGA.title} />
          <div className="mt-10 grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-end">
            <h2 className="sb-chars m-0"
              style={{
                fontFamily: DISPLAY, fontWeight: 400, color: INK,
                fontSize: 'clamp(2.4rem, 6vw, 5rem)', lineHeight: 1.04, letterSpacing: '-0.015em',
              }}>
              {SAGA.title}
            </h2>
            <p className="sb-lines m-0 max-w-[30rem] text-[15px] leading-[1.75] md:justify-self-end"
              style={{ fontFamily: SANS, color: INK_SOFT }}>
              {SAGA.lead}
            </p>
          </div>
        </div>
      </div>

      {/* The stage. */}
      <div className="sb-saga-outer mt-14 md:mt-20">
        <div className="sb-saga-stage mx-auto w-full max-w-[1200px] px-5 md:px-8">
          {/* core-sample strata (desktop scrub only) */}
          <div aria-hidden className="sb-strata pointer-events-none absolute left-5 top-0 bottom-0 z-10 flex md:left-8">
            <div className="relative my-auto h-[62svh] w-px" style={{ background: HAIR_INK }}>
              <div className="sb-strata-fill absolute left-0 top-0 w-px origin-top" style={{ height: '100%', background: BRASS, transform: 'scaleY(0)' }} />
              {SAGA.eras.map((e, i) => (
                <span key={e.year} className="absolute -left-[3px] h-1.5 w-1.5 rounded-full"
                  style={{ top: `${(i / (SAGA.eras.length - 1)) * 100}%`, background: SAND, boxShadow: `0 0 0 1px ${HAIR_INK}` }} />
              ))}
            </div>
          </div>

          {SAGA.eras.map((era, i) => (
            <article key={era.year} className="sb-era pb-16 md:pb-0" data-sb-era={i}>
              <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-center md:gap-14 md:pl-10">
                <div className="order-2 md:order-1">
                  <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.22em]"
                    style={{ fontFamily: SANS, color: BRASS_INK }}>
                    {era.use}
                  </p>
                  <p className="m-0 mt-3 font-normal text-balance"
                    style={{ fontFamily: DISPLAY, fontWeight: 400, color: INK, fontSize: 'clamp(2.4rem, 6vw, 4.8rem)', lineHeight: 1.02, letterSpacing: '-0.02em' }}>
                    {era.year}
                  </p>
                  <h3 className="m-0 mt-5"
                    style={{ fontFamily: DISPLAY, fontWeight: 400, color: INK, fontSize: 'clamp(1.4rem, 2.6vw, 2rem)', lineHeight: 1.2 }}>
                    {era.title}
                  </h3>
                  <p className="mt-3 max-w-[30rem] text-[15px] leading-[1.75]"
                    style={{ fontFamily: SANS, color: INK_SOFT }}>
                    {era.text}
                  </p>
                </div>
                <div className="order-1 md:order-2">
                  <Photo src={IMG(era.img)} alt={era.alt} aspect="aspect-[4/3]"
                    spec={`${era.use} · 0${i + 1}`} position="center" />
                </div>
              </div>
            </article>
          ))}

          {/* era counter (desktop scrub only) */}
          <div aria-hidden className="sb-saga-count pointer-events-none absolute bottom-6 right-5 z-10 items-baseline gap-1.5 md:right-8">
            <span className="sb-saga-idx text-[13px] font-semibold tabular-nums"
              style={{ fontFamily: SANS, color: INK }}>01</span>
            <span className="text-[12px]" style={{ fontFamily: SANS, color: INK_MUTE }}>/ 0{SAGA.eras.length}</span>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-[1200px] px-5 pb-16 text-[12px] md:mt-16 md:px-8 md:pb-24"
        style={{ fontFamily: SANS, color: INK_MUTE }}>
        {SAGA.note}
      </p>
    </section>
  )
}

/* ═══════════════ HERBERGI — rooms + honest booking + ratings ═════════════ */
function Rooms() {
  return (
    <section id="herbergi" className="scroll-mt-16 px-5 py-20 md:px-8 md:py-28" style={{ background: PAPER }}>
      <div className="mx-auto max-w-[1200px]">
        <SectionHead index="02" label="Herbergi" />
        <div className="mt-10 grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-end">
          <h2 className="sb-chars m-0"
            style={{ fontFamily: DISPLAY, fontWeight: 400, color: INK, fontSize: 'clamp(2.4rem, 6vw, 4.6rem)', lineHeight: 1.04, letterSpacing: '-0.015em' }}>
            Gist við höfnina
          </h2>
          <p className="sb-lines m-0 max-w-[32rem] text-[15px] leading-[1.75] md:justify-self-end"
            style={{ fontFamily: SANS, color: INK_SOFT }}>
            {ROOMS_INTRO}
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {ROOMS.map((room, i) => (
            <article key={room.key} className="sb-slab">
              <Photo src={IMG(room.img)} alt={room.alt} aspect="aspect-[4/5]" spec={`0${i + 1}`} />
              <h3 className="mb-0 mt-4"
                style={{ fontFamily: DISPLAY, fontWeight: 400, color: INK, fontSize: 'clamp(1.5rem, 2.4vw, 1.9rem)', lineHeight: 1.2 }}>
                {room.name}
              </h3>
              <p className="mt-2.5 text-[14px] leading-[1.7]"
                style={{ fontFamily: SANS, color: INK_SOFT }}>
                {room.detail}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t pt-8 md:flex-row md:items-center"
          style={{ borderColor: HAIR_INK }}>
          <p className="m-0 max-w-[30rem] text-[13.5px] leading-[1.7]"
            style={{ fontFamily: SANS, color: INK_MUTE }}>
            {ROOMS_NOTE}
          </p>
          <a href={BOOKING_URL} target="_blank" rel="noreferrer"
            className={`sb-cta relative inline-flex min-h-[52px] items-center px-8 text-[12px] font-semibold uppercase tracking-[0.14em] ${FOCUS}`}
            style={{ fontFamily: SANS, background: INK, color: PAPER }}>
            Sjá verð og bóka
          </a>
        </div>

        {/* Ratings — honest platform-cited social proof (fixes the empty
            testimonial placeholder on the live site; no invented quotes). */}
        <dl className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-none border sm:grid-cols-3"
          style={{ borderColor: HAIR_INK, background: HAIR_INK }}>
          {RATINGS.map((r) => (
            <div key={r.platform} className="flex flex-col gap-1 px-6 py-7" style={{ background: PAPER }}>
              <dt className="text-[11px] font-medium uppercase tracking-[0.18em]" style={{ fontFamily: SANS, color: INK_MUTE }}>
                {r.platform}
              </dt>
              <dd className="m-0 flex items-baseline gap-2">
                <span style={{ fontFamily: DISPLAY, fontWeight: 400, color: INK, fontSize: '2.4rem', lineHeight: 1 }}>{r.score}</span>
                <span className="text-[12px]" style={{ fontFamily: SANS, color: INK_MUTE }}>{r.meta}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/* ═══════════════ KAFFIHÚSIÐ + SMØRREBORD — the dark band ═════════════════ */
function Cafe() {
  return (
    <section id="kaffihus" className="scroll-mt-16 px-5 py-20 md:px-8 md:py-28" style={{ background: SEA }}>
      <div className="mx-auto max-w-[1200px]">
        <SectionHead index="03" label="Kaffihúsið" tone="dark" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2 className="sb-chars m-0"
              style={{ fontFamily: DISPLAY, fontWeight: 400, color: PAPER, fontSize: 'clamp(2.4rem, 6vw, 4.6rem)', lineHeight: 1.04, letterSpacing: '-0.015em' }}>
              {CAFE.title}
            </h2>
            <p className="sb-lines mt-6 max-w-[34rem] text-[15px] leading-[1.8]"
              style={{ fontFamily: SANS, color: PAPER_SOFT }}>
              {CAFE.body}
            </p>
            <dl className="mt-9 m-0">
              {CAFE.menu.map((m) => (
                <div key={m.name} className="sb-up flex items-baseline justify-between gap-6 border-b py-4"
                  style={{ borderColor: HAIR_PAPER }}>
                  <dt className="text-[15px]" style={{ fontFamily: DISPLAY, fontWeight: 400, color: PAPER }}>{m.name}</dt>
                  <dd className="m-0 max-w-[16rem] text-right text-[12.5px] leading-[1.5]" style={{ fontFamily: SANS, color: PAPER_MUTE }}>{m.note}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="grid grid-cols-2 gap-5 self-start">
            {CAFE.photos.map((p, i) => (
              <Photo key={p.file} src={IMG(p.file)} alt={p.alt} aspect="aspect-[4/5]" tone="dark"
                className={i === 1 ? 'mt-10' : ''} parallax />
            ))}
          </div>
        </div>

        {/* Smørrebord — a distinct seasonal story beat, not stale nav clutter. */}
        <div className="mt-16 grid gap-10 border-t pt-14 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16"
          style={{ borderColor: HAIR_PAPER }}>
          <div className="grid grid-cols-2 gap-5">
            {CAFE.smorrebord.photos.map((p, i) => (
              <Photo key={p.file} src={IMG(p.file)} alt={p.alt} aspect="aspect-[4/5]" tone="dark"
                className={i === 0 ? 'mt-8' : ''} />
            ))}
          </div>
          <div>
            <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.22em]" style={{ fontFamily: SANS, color: BRASS_LT }}>
              Árstíðabundið
            </p>
            <h3 className="sb-chars mt-3"
              style={{ fontFamily: DISPLAY, fontWeight: 400, color: PAPER, fontSize: 'clamp(1.9rem, 4vw, 3rem)', lineHeight: 1.08 }}>
              {CAFE.smorrebord.title}
            </h3>
            <p className="sb-lines mt-5 max-w-[30rem] text-[15px] leading-[1.8]"
              style={{ fontFamily: SANS, color: PAPER_SOFT }}>
              {CAFE.smorrebord.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ STAÐURINN — the place, honest neighbours ════════════════ */
function Place() {
  return (
    <section id="stadurinn" className="scroll-mt-16 px-5 py-20 md:px-8 md:py-28" style={{ background: PAPER }}>
      <div className="mx-auto max-w-[1200px]">
        <SectionHead index="04" label="Staðurinn" />
        <div className="mt-10 grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-end">
          <h2 className="sb-chars m-0"
            style={{ fontFamily: DISPLAY, fontWeight: 400, color: INK, fontSize: 'clamp(2.4rem, 6vw, 4.6rem)', lineHeight: 1.04, letterSpacing: '-0.015em' }}>
            {PLACE.title}
          </h2>
          <p className="sb-lines m-0 max-w-[34rem] text-[15px] leading-[1.75] md:justify-self-end"
            style={{ fontFamily: SANS, color: INK_SOFT }}>
            {PLACE.body}
          </p>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {PLACE.spots.map((s) => (
            <article key={s.name} className="sb-slab">
              <Photo src={IMG(s.img)} alt={s.alt} aspect="aspect-[4/3]" />
              <h3 className="mb-0 mt-4"
                style={{ fontFamily: DISPLAY, fontWeight: 400, color: INK, fontSize: '1.4rem', lineHeight: 1.2 }}>
                {s.name}
              </h3>
              <p className="mt-2 text-[13.5px] leading-[1.65]" style={{ fontFamily: SANS, color: INK_MUTE }}>
                {s.note}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ HEIMSÓKN — visit / booking / map ════════════════════════ */
function Visit() {
  return (
    <section id="heimsokn" className="scroll-mt-16 px-5 py-20 md:px-8 md:py-28" style={{ background: INK }}>
      <div className="mx-auto max-w-[1200px]">
        <SectionHead index="05" label={VISIT.title} tone="dark" />
        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <h2 className="sb-chars m-0"
              style={{ fontFamily: DISPLAY, fontWeight: 400, color: PAPER, fontSize: 'clamp(2.6rem, 7vw, 5.4rem)', lineHeight: 1.02, letterSpacing: '-0.02em' }}>
              Verið velkomin
            </h2>
            <p className="mt-5 text-[13px] font-medium uppercase tracking-[0.2em]" style={{ fontFamily: SANS, color: BRASS_LT }}>
              {VISIT.season}
            </p>
            <dl className="mt-9 m-0 max-w-[34rem]">
              {VISIT.lines.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-6 border-b py-4" style={{ borderColor: HAIR_PAPER }}>
                  <dt className="text-[11px] font-medium uppercase tracking-[0.2em]" style={{ fontFamily: SANS, color: PAPER_MUTE }}>{row.label}</dt>
                  <dd className="m-0 text-right">
                    <a href={row.href} {...(row.href === MAP_LINK ? { target: '_blank', rel: 'noreferrer' } : {})}
                      className={`sb-ul inline-flex min-h-[44px] items-center text-[14px] tracking-[0.02em] ${FOCUS}`}
                      style={{ fontFamily: SANS, color: PAPER_SOFT }}>
                      {row.value}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
            <a href={BOOKING_URL} target="_blank" rel="noreferrer"
              className={`sb-cta relative mt-9 inline-flex min-h-[52px] items-center px-8 text-[12px] font-semibold uppercase tracking-[0.14em] ${FOCUS}`}
              style={{ fontFamily: SANS, border: `1px solid ${PAPER}`, color: PAPER }}>
              Bóka gistingu
            </a>
            <p className="mt-6 max-w-[30rem] text-[12px] leading-[1.6]" style={{ fontFamily: SANS, color: PAPER_MUTE }}>
              {VISIT.note}
            </p>
          </div>
          <div>
            <div className="overflow-hidden" style={{ boxShadow: `inset 0 0 0 1px ${HAIR_PAPER}`, border: `1px solid rgba(176,122,52,.4)` }}>
              <iframe title={`Kort af Sjávarborg, ${ADDRESS}`} src={MAP_EMBED}
                loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                className="h-[340px] w-full border-0 md:h-[440px]"
                style={{ filter: 'grayscale(1) contrast(1.05) brightness(.86)' }} />
            </div>
            <a href={MAP_LINK} target="_blank" rel="noreferrer"
              className={`sb-ul mt-3 inline-flex min-h-[44px] items-center text-[11px] font-medium uppercase tracking-[0.16em] ${FOCUS}`}
              style={{ fontFamily: SANS, color: PAPER_MUTE }}>
              Opna í Google kortum
            </a>
          </div>
        </div>
      </div>

      {/* colossal sign-off — clip only sideways (overflow-x) so the j
          descender and á accent are never guillotined vertically. */}
      <div className="mt-20 md:mt-28" style={{ overflowX: 'clip' }}>
        <p aria-hidden className="m-0 select-none whitespace-nowrap pl-2 text-center"
          style={{ fontFamily: DISPLAY, fontWeight: 400, color: PAPER, fontSize: 'min(19vw, 14rem)', lineHeight: 1.0, letterSpacing: '-0.03em', paddingTop: '0.06em', paddingBottom: '0.16em' }}>
          Sjáumst
        </p>
      </div>
    </section>
  )
}

/* ═══════════════ PAGE ════════════════════════════════════════════════════ */
export default function Page() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = 'Sjávarborg · Gistiheimili & kaffihús í Stykkishólmi'
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
    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        desktop: '(min-width: 1024px)',
      },
      (mctx) => {
        const c = mctx.conditions as { motion: boolean; desktop: boolean }
        if (!c.motion) return undefined
        const q = gsap.utils.selector(root)
        const splits: SplitText[] = []

        /* Lenis drives the scroll; the ballenacabo lerp. It must pump
           ScrollTrigger.update every frame or the pinned saga scrub can stall. */
        const lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 1, smoothWheel: true })
        lenis.on('scroll', ScrollTrigger.update)
        const tick = (t: number) => lenis.raf(t * 1000)
        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)

        /* Hero: wordmark chars rise, furniture fades up. */
        gsap.from(q('.sb-hero-char'), {
          yPercent: 120, duration: 1.2, ease: 'power3.out', stagger: 0.05, delay: 0.15,
        })
        gsap.from(q('.sb-hero-fade'), {
          opacity: 0, y: 22, duration: 0.9, ease: 'power3.out', stagger: 0.1, delay: 0.55,
        })
        /* Hero parallax drift. */
        const heroImg = q('.sb-hero-img')[0]
        if (heroImg) {
          gsap.fromTo(heroImg, { yPercent: -6, scale: 1.12 }, {
            yPercent: 8, scale: 1.12, ease: 'none',
            scrollTrigger: { trigger: heroImg, start: 'top top', end: 'bottom top', scrub: true },
          })
        }

        /* Drawn rules. */
        q('.sb-rule').forEach((el) => {
          gsap.from(el, {
            scaleX: 0, duration: 1.1, ease: 'power2.inOut',
            scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none reverse' },
          })
        })

        /* SplitText line + char reveals — opacity/transform only, no clip-path. */
        q('.sb-lines').forEach((el) => {
          splits.push(SplitText.create(el, {
            type: 'lines', mask: 'lines', autoSplit: true,
            onSplit: (self) => gsap.from(self.lines, {
              yPercent: 110, duration: 0.9, ease: 'power3.out', stagger: 0.09,
              scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none reverse' },
            }),
          }))
        })
        q('.sb-chars').forEach((el) => {
          splits.push(SplitText.create(el, {
            type: 'chars', mask: 'chars', autoSplit: true,
            onSplit: (self) => gsap.from(self.chars, {
              yPercent: 108, duration: 0.8, ease: 'power3.out', stagger: 0.028,
              scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
            }),
          }))
        })

        /* Small furniture rises. */
        q('.sb-up').forEach((el) => {
          gsap.from(el, {
            yPercent: 36, opacity: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none reverse' },
          })
        })

        /* Inner image parallax (non-hero). */
        q('[data-sb-parallax]').forEach((el) => {
          if (el.classList.contains('sb-hero-img')) return
          gsap.fromTo(el, { yPercent: -7, scale: 1.12 }, {
            yPercent: 7, scale: 1.12, ease: 'none',
            scrollTrigger: { trigger: el.closest('figure') ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
          })
        })

        /* ── THE SIGNATURE: pinned heritage-timeline scrub (desktop only). The
           eras crossfade in place; a left core-sample fills; a counter ticks.
           Below lg / reduced motion this whole block never runs and the eras
           stay a plain vertical card stack (their resting CSS). */
        if (c.desktop) {
          const stage = q('.sb-saga-stage')[0] as HTMLElement | undefined
          const eras = q('.sb-era') as HTMLElement[]
          const fill = q('.sb-strata-fill')[0] as HTMLElement | undefined
          const idxEl = q('.sb-saga-idx')[0] as HTMLElement | undefined
          if (stage && eras.length) {
            const N = eras.length
            /* Plateau cross-dissolve: each era holds full opacity across most of
               its segment (|d| ≤ 0.5−EDGE) and dissolves only in a narrow band at
               the boundaries, crossing its neighbour at 0.5 — so one era reads
               cleanly at a time instead of two ghosting through each other. */
            const EDGE = 0.22
            const applyEra = (p: number) => {
              const f = p * (N - 1)
              eras.forEach((el, i) => {
                const d = Math.abs(f - i)
                const o = Math.max(0, Math.min(1, (0.5 + EDGE - d) / (2 * EDGE)))
                el.style.opacity = String(o)
                el.style.transform = `translateY(${(f - i) * -14}px)`
                el.style.pointerEvents = o > 0.6 ? 'auto' : 'none'
              })
              if (fill) fill.style.transform = `scaleY(${p})`
              if (idxEl) idxEl.textContent = '0' + String(Math.min(N, Math.round(f) + 1))
            }
            applyEra(0)
            ScrollTrigger.create({
              trigger: stage,
              pin: true,
              start: 'center center',
              end: () => '+=' + window.innerHeight * (N - 1) * 0.9,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => applyEra(self.progress),
            })
          }
        }

        /* Refresh once fonts + in-view images settle so pinned distances and
           split lines measure against the true layout. */
        document.fonts?.ready.then(() => ScrollTrigger.refresh())
        const imgs = Array.from(root.querySelectorAll('img'))
        Promise.all(imgs.slice(0, 8).map((im) => {
          const el = im as HTMLImageElement
          if (el.complete && el.naturalWidth > 0) return Promise.resolve()
          const dec = el.decode ? el.decode().catch(() => undefined) : undefined
          return dec ?? Promise.resolve()
        })).then(() => ScrollTrigger.refresh())

        return () => {
          gsap.ticker.remove(tick)
          lenis.destroy()
          splits.forEach((sp) => sp.revert())
          /* applyEra sets inline opacity/transform directly (not a GSAP tween),
             so gsap's own revert won't clear them. Reset here so that crossing
             the desktop breakpoint drops the eras back to the plain, fully
             visible stacked layout — never stuck hidden on mobile. */
          q('.sb-era').forEach((el) => {
            const s = (el as HTMLElement).style
            s.opacity = ''
            s.transform = ''
            s.pointerEvents = ''
          })
        }
      },
    )
    return () => { mm.revert() }
  }, [])

  return (
    <div ref={rootRef} lang="is" className="sb-root antialiased" style={{ overflowX: 'clip' }}>
      <style>{PAGE_STYLES}</style>
      <TopNav />
      <main>
        <Hero />
        <Intro />
        <Saga />
        <Rooms />
        <Cafe />
        <Place />
        <Visit />
      </main>
      <PreviewChrome company={company} />
      <PreviewFooter company={company} />
    </div>
  )
}
