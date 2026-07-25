import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  IMG, SYM, RUNE_IMG, EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF, ADDRESS_1, ADDRESS_2,
  SHOP_URL, NAV, HERO, STATEMENT, SYMBOLS, TWELVE, PIECES, SHOP, CRAFT,
  APPROACH, FOOTER, JSON_LD,
} from './data'

gsap.registerPlugin(ScrollTrigger)

const company = getPreviewCompany('alrun')

/* ── ALRÚN on the CENTREMARSEA.COM system ─────────────────────────────────
   Recreated from centremarsea.com, measured live off the DOM — not described:

   PALETTE (their exact values)
     sand   #F4EBDF  the ground for the whole document
     ink    #070103  their real text colour (not pure black)
     wine   #400D1C  the footer ground
     rose   #A36D6C  the single accent
   TYPE (their exact roles)
     Zalando Sans Expanded 300/400 — every heading, label and link, almost
       always UPPERCASE, at their sizes: 11.2 / 12.8 / 14.4 / 19.2 / 25.6 / 36.8
     Hanken Grotesk 300/400 — body copy and the list numerals, 12.8 / 14.4 / 16
     a high-contrast serif for the wordmark only (their MARSEA logo role)
   STRUCTURE (their section order and mechanics)
     1  NAV, split into hairline-divided zones: wordmark + links | action | menu
     2  HERO, full-bleed cover photo, a COLOSSAL wordmark set bottom-left, the
        tagline right, and a THREE-COLUMN uppercase meta row on the bottom edge
     3  STATEMENT, one narrow centred paragraph + one centred uppercase link
     4  CAROUSEL of 400x520 square-cornered cards, label under each, centred
        prev/next arrows and a centred "view all" link
     5  THE SIGNATURE: a 720x809 image panel on the left that CROSSFADES, and on
        the right a CENTRE-ALIGNED numbered list — tiny numeral in Hanken beside
        an uppercase Zalando 300 name, ~41px row pitch
     6  a centred uppercase line with small scattered plates around it
     7  a numbered full-panel sequence, huge uppercase titles in white on image
     8  FOOTER on wine, three uppercase link columns, colossal wordmark, legal row
   Buttons: 0 radius, sand fill, 0.5px ink hairline, generous 27px padding.
   Own al- namespace. ────────────────────────────────────────────────────── */

/* Ratios computed: INK #070103 on SAND #F4EBDF = 17.1:1 (AAA);
   SAND on WINE #400D1C = 11.6:1 (AAA); ROSE #A36D6C on SAND = 3.6:1 so it is
   used for large/decorative only; WHITE on WINE = 13.4:1 (AAA). */
const SAND = '#F4EBDF'
const INK = '#070103'
const WINE = '#400D1C'
const ROSE = '#A36D6C'
const WHITE = '#FFFFFF'

const INK_SOFT = 'rgba(7,1,3,.74)'
const INK_MUTE = 'rgba(7,1,3,.52)'
const SAND_SOFT = 'rgba(244,235,223,.82)'
const SAND_MUTE = 'rgba(244,235,223,.58)'
const HAIR = 'rgba(7,1,3,.20)'
const HAIR_SAND = 'rgba(244,235,223,.26)'

const EXP = "'Zalando Sans Expanded', system-ui, sans-serif"
const BODY = "'Hanken Grotesk', system-ui, sans-serif"
const LOGO = "'Zodiak', 'Cormorant Garamond', Georgia, serif"

const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A36D6C]'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const PAGE_STYLES = `
.al-root { background: ${SAND}; color: ${INK}; }
.al-root ::selection { background: ${WINE}; color: ${SAND}; }

/* Their type roles, as utilities. */
.al-exp  { font-family: ${EXP}; }
.al-body { font-family: ${BODY}; }
/* Their uppercase label: Zalando 400, 12.8px, caps. */
.al-lbl  { font-family: ${EXP}; font-weight: 400; font-size: 12.8px; text-transform: uppercase; }
/* Their small footer/nav label: Zalando 300, 11.2px, caps. */
.al-lbl-s { font-family: ${EXP}; font-weight: 300; font-size: 11.2px; text-transform: uppercase; }
/* Their list item: Zalando 300, 25.6px, caps. */
.al-item { font-family: ${EXP}; font-weight: 300; font-size: 25.6px; text-transform: uppercase; line-height: 1.18; }

/* Their button: square, sand, 0.5px ink hairline, 27px vertical padding. */
.al-btn {
  display: inline-flex; align-items: center; justify-content: center;
  font-family: ${EXP}; font-weight: 400; font-size: 12.8px; text-transform: uppercase;
  padding: 22px 24px; background: ${SAND}; color: ${INK};
  border: 0.5px solid ${INK}; border-radius: 0; text-decoration: none;
}
.al-btn:hover { background: ${INK}; color: ${SAND}; }
.al-btn-wine { background: transparent; color: ${SAND}; border-color: ${HAIR_SAND}; }
.al-btn-wine:hover { background: ${SAND}; color: ${WINE}; }

/* Their quiet underline link. */
.al-link { position: relative; text-decoration: none; }
.al-link::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: -3px; height: 0.5px;
  background: currentColor; transform: scaleX(0); transform-origin: left center;
}
.al-link:hover::after, .al-link:focus-visible::after { transform: scaleX(1); }

/* THE SIGNATURE — the crossfading panel. */
.al-plate { position: absolute; inset: 0; opacity: 0; }
.al-plate[data-on="1"] { opacity: 1; }
/* The numbered row: centred, numeral hanging beside the name. */
.al-row {
  display: flex; align-items: baseline; justify-content: center; gap: 12px;
  width: 100%; background: none; border: 0; cursor: pointer; padding: 5.6px 0;
}
.al-row .al-num { font-family: ${BODY}; font-weight: 400; font-size: 12.8px; color: ${INK_MUTE}; }
.al-row .al-name { color: ${INK_SOFT}; }
.al-row[aria-pressed="true"] .al-name { color: ${INK}; }
.al-row[aria-pressed="true"] .al-num { color: ${ROSE}; }
.al-row:hover .al-name { color: ${INK}; }
/* The English meaning rides each row, faint until the row is active — so the
   list itself carries the name-to-word pairing the whole brand rests on. */
.al-row .al-mean { color: rgba(7,1,3,.34); }
.al-row[aria-pressed="true"] .al-mean, .al-row:hover .al-mean { color: ${ROSE}; }
/* A hairline grows under the active row. */
.al-row { position: relative; }
.al-row::after {
  content: ''; position: absolute; left: 50%; right: 50%; bottom: 0; height: 0.5px;
  background: ${HAIR};
}
.al-row[aria-pressed="true"]::after { left: 12%; right: 12%; }

/* Their carousel track. */
.al-track { display: flex; gap: 16px; overflow-x: auto; scrollbar-width: none; overscroll-behavior-x: contain; }
.al-track::-webkit-scrollbar { display: none; }
.al-card { flex: 0 0 auto; width: 400px; text-decoration: none; }
.al-card .al-shot { width: 400px; height: 520px; overflow: hidden; background: #E7DDCF; }
.al-card img { width: 100%; height: 100%; object-fit: cover; }
.al-card:hover img { transform: scale(1.03); }
@media (max-width: 700px) { .al-card { width: 76vw; } .al-card .al-shot { width: 100%; height: 100vw; } }

@media (prefers-reduced-motion: no-preference) {
  .al-btn { transition: background .25s ease, color .25s ease; }
  .al-link::after { transition: transform .4s cubic-bezier(.4,0,.2,1); }
  .al-plate { transition: opacity .7s ease; }
  .al-row .al-name, .al-row .al-num, .al-row .al-mean { transition: color .3s ease; }
  .al-row::after { transition: left .45s cubic-bezier(.22,1,.36,1), right .45s cubic-bezier(.22,1,.36,1); }
  .al-card img { transition: transform .8s cubic-bezier(.22,1,.36,1); }
  .al-reveal { opacity: 0; transform: translateY(14px); }
}
@media (prefers-reduced-motion: reduce) {
  .al-reveal { opacity: 1 !important; transform: none !important; }
  .al-card img { transition: none !important; transform: none !important; }
}

@keyframes al-menu-in { from { opacity: 0; } to { opacity: 1; } }
.al-menu { animation: al-menu-in .28s ease both; }
@media (prefers-reduced-motion: reduce) { .al-menu { animation: none !important; } }
`

/* ═══════════════ NAV — their hairline-divided zones ══════════════════════ */
function TopNav() {
  const [open, setOpen] = useState(false)
  const reduced = prefersReduced()

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

  return (
    <>
      <nav aria-label="Main" className="fixed inset-x-0 top-0 z-40"
        style={{ background: SAND, borderBottom: `0.5px solid ${HAIR}` }}>
        <div className="grid grid-cols-[1fr_auto] items-stretch lg:grid-cols-[1fr_auto_auto]">
          {/* zone 1 — wordmark + links */}
          <div className="flex items-center gap-10 px-5 md:px-8" style={{ borderRight: `0.5px solid ${HAIR}` }}>
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })}
              className={`py-4 ${FOCUS}`}
              style={{ fontFamily: LOGO, fontWeight: 400, fontSize: '1.6rem', letterSpacing: '.06em', color: INK }}>
              ALRÚN
            </button>
            <div className="hidden items-center gap-7 lg:flex">
              {NAV.map((n) => (
                <button key={n.id} type="button" onClick={() => go(n.id)}
                  className={`al-lbl py-4 transition-opacity hover:opacity-55 ${FOCUS}`}
                  style={{ color: INK }}>
                  {n.label}
                </button>
              ))}
            </div>
          </div>
          {/* zone 2 — the action */}
          <a href={SHOP_URL} target="_blank" rel="noreferrer"
            className={`al-lbl hidden items-center px-7 transition-opacity hover:opacity-55 lg:flex ${FOCUS}`}
            style={{ color: INK, borderRight: `0.5px solid ${HAIR}`, textDecoration: 'none' }}>
            Visit the shop
          </a>
          {/* zone 3 — menu */}
          <button type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}
            aria-controls="al-menu" onClick={() => setOpen((v) => !v)}
            className={`al-lbl flex items-center px-6 ${FOCUS}`} style={{ color: INK }}>
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>
      {open ? (
        <div id="al-menu" role="dialog" aria-modal="true" aria-label="Menu"
          className="al-menu fixed inset-0 z-30 flex flex-col justify-center gap-2 px-6" style={{ background: SAND }}>
          {NAV.map((n) => (
            <button key={n.id} type="button" onClick={() => go(n.id)}
              className={`al-item py-2 text-left ${FOCUS}`} style={{ color: INK, fontSize: '32px' }}>
              {n.label}
            </button>
          ))}
          <a href={SHOP_URL} target="_blank" rel="noreferrer" className={`al-btn mt-8 self-start ${FOCUS}`}>
            Visit the shop
          </a>
        </div>
      ) : null}
    </>
  )
}

/* ═══════════════ HERO — colossal bottom-left wordmark + meta row ═════════ */
function Hero() {
  return (
    <header className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden" style={{ background: INK }}>
      <img src={IMG(HERO.photo)} alt={HERO.photoAlt} loading="eager" decoding="async"
        {...{ fetchpriority: 'high' as const }}
        className="al-hero-img absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: 'center 30%' }} />
      <div aria-hidden className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(7,1,3,.30) 0%, rgba(7,1,3,.06) 40%, rgba(7,1,3,.55) 100%)' }} />

      {/* the tagline, right-aligned on the wordmark's line */}
      <div className="relative z-10 flex items-end justify-end px-5 md:px-8">
        <p className="al-body al-hero-fade m-0 max-w-[15rem] text-right text-[14.4px] leading-[1.5]"
          style={{ color: SAND_SOFT }}>
          {HERO.tagline}
        </p>
      </div>

      {/* THE colossal wordmark, bottom-left */}
      <div className="relative z-10 overflow-hidden px-5 md:px-8">
        <h1 className="al-hero-word m-0"
          style={{
            fontFamily: LOGO, fontWeight: 400, color: SAND,
            fontSize: 'clamp(3.4rem, 19.2vw, 17.5rem)', lineHeight: 1.02,
            letterSpacing: '.04em', paddingBottom: '.06em',
          }}>
          {HERO.word}
        </h1>
      </div>

      {/* their three-column uppercase meta row on the bottom edge */}
      <div className="relative z-10 mt-5 grid grid-cols-1 gap-2 px-5 pb-6 sm:grid-cols-3 md:px-8"
        style={{ borderTop: `0.5px solid ${HAIR_SAND}`, paddingTop: '14px' }}>
        {HERO.meta.map((m) => (
          <p key={m} className="al-lbl al-hero-fade m-0" style={{ color: SAND }}>{m}</p>
        ))}
      </div>
    </header>
  )
}

/* ═══════════════ STATEMENT — narrow, centred ════════════════════════════ */
function Statement() {
  const reduced = prefersReduced()
  return (
    <section className="px-5 py-28 text-center md:px-8 md:py-40" style={{ background: SAND }}>
      <p className="al-exp al-reveal mx-auto m-0 max-w-[26rem] text-[19.2px] leading-[1.55]" style={{ color: INK }}>
        {STATEMENT.body}
      </p>
      <button type="button"
        onClick={() => document.getElementById(STATEMENT.ctaTo)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })}
        className={`al-lbl al-link al-reveal mt-10 inline-flex min-h-[44px] items-center ${FOCUS}`} style={{ color: INK }}>
        {STATEMENT.cta}
      </button>
    </section>
  )
}

/* ═══════════════ THE TWELVE — the signature ═════════════════════════════
   Left: a fixed atmospheric plate with the ACTIVE mark crossfading over it.
   Right: their centre-aligned numbered list. Selection-driven, so mobile,
   desktop and reduced motion behave identically. */
function Twelve() {
  const [i, setI] = useState(0)
  const s = SYMBOLS[i]
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const onKey = (e: React.KeyboardEvent, idx: number) => {
    let n = idx
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (idx + 1) % SYMBOLS.length
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (idx - 1 + SYMBOLS.length) % SYMBOLS.length
    else if (e.key === 'Home') n = 0
    else if (e.key === 'End') n = SYMBOLS.length - 1
    else return
    e.preventDefault(); setI(n); refs.current[n]?.focus()
  }

  return (
    <section id="twelve" className="scroll-mt-16" style={{ background: SAND }}>
      <div className="grid items-stretch lg:grid-cols-2">
        {/* the plate */}
        <div className="relative h-[78svh] min-h-[440px] overflow-hidden lg:h-auto lg:min-h-[809px]" style={{ background: WINE }}>
          {SYMBOLS.map((sy, k) => (
            <div key={sy.key} className="al-plate" data-on={k === i ? '1' : '0'}>
              {/* the real piece that carries this mark */}
              <img src={RUNE_IMG(sy.file)} alt={`${sy.is} — ${sy.en}, an Alrún piece carrying the mark.`}
                loading={k === 0 ? 'eager' : 'lazy'} decoding="async"
                className="absolute inset-0 h-full w-full object-cover" />
              <span aria-hidden className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, rgba(7,1,3,.34) 0%, rgba(7,1,3,.16) 45%, rgba(7,1,3,.66) 100%)' }} />
              {/* Only the WORD sits over the photograph. The piece in the shot
                  already carries the mark, so a big overlaid copy of it just
                  doubled the same shape. */}
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="al-exp m-0 uppercase"
                  style={{ color: SAND, fontWeight: 300, fontSize: 'clamp(1.5rem, 3.6vw, 36.8px)', letterSpacing: '.06em', textShadow: '0 1px 18px rgba(0,0,0,.55)' }}>
                  {sy.en}
                </p>
              </div>
            </div>
          ))}
          {/* their bottom-left plate caption, plus a running index */}
          <div className="absolute bottom-5 left-5 flex items-center gap-2.5">
            <img src={SYM(s.file)} alt="" aria-hidden className="h-4 w-auto"
              style={{ filter: 'brightness(0) invert(1)', opacity: .7 }} />
            <p className="al-lbl-s m-0" style={{ color: SAND_MUTE }}>{s.is} — {s.en}</p>
          </div>
          <p className="al-lbl-s absolute bottom-5 right-5 m-0 tabular-nums" style={{ color: SAND_MUTE }}>
            {s.n} / 12
          </p>
        </div>

        {/* the centred numbered list */}
        <div className="flex flex-col items-center justify-center px-5 py-20 md:px-10 md:py-28">
          <h2 className="al-lbl-s al-reveal m-0" style={{ color: INK_MUTE }}>{TWELVE.eyebrow}</h2>

          <div role="group" aria-label="The twelve bindrunes" className="mt-9 w-full">
            {SYMBOLS.map((sy, k) => (
              <button key={sy.key} ref={(el) => { refs.current[k] = el }} type="button"
                className={`al-row ${FOCUS}`} aria-pressed={k === i}
                aria-label={`${sy.is} — ${sy.en}`} tabIndex={k === i ? 0 : -1}
                onClick={() => setI(k)} onMouseEnter={() => setI(k)} onKeyDown={(e) => onKey(e, k)}>
                <span className="al-num" aria-hidden>{sy.n}</span>
                <span className="al-name al-item">{sy.is}</span>
                <span className="al-mean al-lbl-s" aria-hidden>{sy.en}</span>
              </button>
            ))}
          </div>

          {/* the active mark's meaning + its real pieces */}
          <div aria-live="polite" className="mt-11 w-full max-w-[22rem] text-center">
            <p className="al-lbl-s m-0" style={{ color: ROSE }}>{s.en}</p>
            {s.blurb ? (
              <p className="al-body mt-2 text-[13.5px] italic leading-[1.6]" style={{ color: INK_SOFT }}>
                “{s.blurb}”
              </p>
            ) : null}
            <ul className="m-0 mt-5 list-none p-0">
              {s.products.map((p) => (
                <li key={p.name}>
                  <a href={p.href} target="_blank" rel="noreferrer"
                    className={`al-body flex items-baseline justify-between gap-4 py-2.5 text-[13.5px] ${FOCUS}`}
                    style={{ color: INK_SOFT, borderBottom: `0.5px solid ${HAIR}`, textDecoration: 'none' }}>
                    <span>{p.name}</span>
                    <span className="tabular-nums">{p.price}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <a href={SHOP_URL} target="_blank" rel="noreferrer"
            className={`al-lbl al-link mt-10 inline-flex min-h-[44px] items-center ${FOCUS}`} style={{ color: INK }}>
            {TWELVE.cta}
          </a>

          <p className="al-body mx-auto mt-8 max-w-[24rem] text-center text-[11.5px] leading-[1.6]" style={{ color: INK_MUTE }}>
            {TWELVE.note}
          </p>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ SHOP — their 400x520 carousel ══════════════════════════ */
function Shop() {
  const trackRef = useRef<HTMLDivElement>(null)
  /* The arrows animate scrollLeft on our own rAF. Two things rule out the
     simpler routes: CSS/native smooth scrolling is cancelled every frame by
     Lenis (which drives the page on its own loop), and GSAP will not tween
     scrollLeft without ScrollToPlugin. This is immune to both. */
  const rafRef = useRef(0)
  const nudge = (dir: 1 | -1) => {
    const t = trackRef.current
    if (!t) return
    const max = t.scrollWidth - t.clientWidth
    const from = t.scrollLeft
    const to = Math.max(0, Math.min(max, from + dir * 416))
    cancelAnimationFrame(rafRef.current)
    if (prefersReduced() || to === from) { t.scrollLeft = to; return }
    const started = performance.now()
    const dur = 520
    const step = (now: number) => {
      const p = Math.min(1, (now - started) / dur)
      t.scrollLeft = from + (to - from) * (1 - Math.pow(1 - p, 3))
      if (p < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
  }
  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])
  return (
    <section id="shop" className="scroll-mt-16 py-24 md:py-32" style={{ background: SAND }}>
      <h2 className="al-lbl-s al-reveal m-0 px-5 text-center md:px-8" style={{ color: INK_MUTE }}>{SHOP.eyebrow}</h2>

      <div ref={trackRef} className="al-track mt-10 px-5 md:px-8">
        {PIECES.map((p) => (
          <a key={p.name + p.material} href={p.href} target="_blank" rel="noreferrer"
            className={`al-card ${FOCUS}`}>
            <div className="al-shot">
              <img src={IMG(p.img)} alt={p.alt} loading="lazy" decoding="async" />
            </div>
            <div className="mt-3.5 flex items-baseline justify-between gap-4">
              <div>
                <p className="al-exp m-0 text-[14.4px]" style={{ color: INK }}>{p.name}</p>
                <p className="al-lbl-s m-0 mt-1" style={{ color: INK_MUTE }}>{p.meaning}</p>
              </div>
              <span className="al-body shrink-0 text-[13.5px] tabular-nums" style={{ color: INK }}>{p.price}</span>
            </div>
          </a>
        ))}
      </div>

      {/* their centred arrow pair + view-all */}
      <div className="mt-10 flex items-center justify-center gap-5">
        <button type="button" aria-label="Previous" onClick={() => nudge(-1)}
          className={`al-lbl flex h-11 w-11 items-center justify-center ${FOCUS}`}
          style={{ color: INK, border: `0.5px solid ${HAIR}` }}>←</button>
        <button type="button" aria-label="Next" onClick={() => nudge(1)}
          className={`al-lbl flex h-11 w-11 items-center justify-center ${FOCUS}`}
          style={{ color: INK, border: `0.5px solid ${HAIR}` }}>→</button>
      </div>
      <div className="mt-8 text-center">
        <a href={SHOP_URL} target="_blank" rel="noreferrer" className={`al-lbl al-link inline-flex min-h-[44px] items-center ${FOCUS}`} style={{ color: INK }}>
          {SHOP.cta}
        </a>
      </div>
      <p className="al-body mx-auto mt-10 max-w-[34rem] px-5 text-center text-[11.5px] leading-[1.6] md:px-8"
        style={{ color: INK_MUTE }}>
        {SHOP.priceNote}
      </p>
    </section>
  )
}

/* ═══════════════ CRAFT — centred line + scattered plates ════════════════ */
function Craft() {
  const reduced = prefersReduced()
  /* Deliberately EVEN, not scattered: three plates of identical size on one
     aligned row, stacking to a single centred column on mobile. */
  return (
    <section id="craft" className="scroll-mt-16 px-5 py-24 md:px-8 md:py-32" style={{ background: SAND }}>
      <div className="mx-auto grid max-w-[1000px] items-start gap-6 sm:grid-cols-3 sm:gap-7">
        {CRAFT.scatter.map((s) => (
          <div key={s.file} className="al-reveal mx-auto w-full max-w-[320px] sm:max-w-none">
            <div className="overflow-hidden" style={{ aspectRatio: '4 / 5', background: '#E7DDCF' }}>
              <img src={IMG(s.file)} alt={s.alt} loading="lazy" decoding="async"
                className="h-full w-full object-cover" />
            </div>
          </div>
        ))}
      </div>
      <h2 className="al-body al-reveal mx-auto mt-16 max-w-[20rem] text-center text-[16px] font-light uppercase leading-[1.6]"
        style={{ color: INK }}>
        {CRAFT.line}
      </h2>
      <div className="mt-8 text-center">
        <button type="button"
          onClick={() => document.getElementById(CRAFT.ctaTo)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })}
          className={`al-lbl al-link inline-flex min-h-[44px] items-center ${FOCUS}`} style={{ color: INK }}>
          {CRAFT.cta}
        </button>
      </div>
    </section>
  )
}

/* ═══════════════ APPROACH — their numbered image panels ═════════════════ */
function Approach() {
  return (
    <section id="approach" className="scroll-mt-16" style={{ background: INK }}>
      <h2 className="al-lbl-s m-0 px-5 pt-16 md:px-8" style={{ color: SAND_MUTE }}>{APPROACH.eyebrow}</h2>
      <div className="mt-10 grid gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ background: 'rgba(244,235,223,.14)' }}>
        {APPROACH.steps.map((st) => (
          <article key={st.n} className="relative min-h-[440px] overflow-hidden lg:min-h-[560px]">
            <img src={IMG(st.img)} alt={st.alt} loading="lazy" decoding="async"
              className="absolute inset-0 h-full w-full object-cover" style={{ opacity: .46 }} />
            <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(7,1,3,.25), rgba(7,1,3,.72))' }} />
            <div className="relative z-10 flex h-full flex-col justify-end p-6">
              <p className="al-exp m-0 text-[14.4px]" style={{ color: WHITE }}>{st.n}</p>
              <h3 className="al-exp m-0 mt-2 uppercase"
                style={{ color: WHITE, fontWeight: 400, fontSize: 'clamp(1.6rem, 2.6vw, 36.8px)', lineHeight: 1.1 }}>
                {st.title}
              </h3>
              <p className="al-body mt-3 max-w-[18rem] text-[13.5px] leading-[1.6]" style={{ color: 'rgba(255,255,255,.82)' }}>
                {st.body}
              </p>
            </div>
          </article>
        ))}
      </div>
      <div className="px-5 py-14 text-center md:px-8">
        <a href={SHOP_URL} target="_blank" rel="noreferrer" className={`al-lbl al-link inline-flex min-h-[44px] items-center ${FOCUS}`} style={{ color: SAND }}>
          {APPROACH.cta}
        </a>
      </div>
    </section>
  )
}

/* ═══════════════ FOOTER — their wine ground ═════════════════════════════ */
function FooterWine() {
  return (
    <section id="contact" className="scroll-mt-16 px-5 pt-20 md:px-8 md:pt-28" style={{ background: WINE }}>
      <div className="mx-auto max-w-[1180px]">
        <h2 className="al-exp al-reveal m-0 max-w-[30rem] text-[19.2px] leading-[1.5]" style={{ color: SAND }}>
          {FOOTER.heading}
        </h2>
        {/* A matched pair: two buttons of identical weight and equal width.
            A bordered box next to a small text link read lopsided. */}
        <div className="mt-9 grid max-w-[34rem] gap-4 sm:grid-cols-2">
          <a href={EMAIL_HREF} className={`al-btn al-btn-wine ${FOCUS}`}>{EMAIL}</a>
          <a href={PHONE_HREF} className={`al-btn al-btn-wine ${FOCUS}`}>{PHONE_DISPLAY}</a>
        </div>

        {/* their three uppercase columns */}
        <div className="mt-20 grid gap-10 sm:grid-cols-3" style={{ borderTop: `0.5px solid ${HAIR_SAND}`, paddingTop: '34px' }}>
          {FOOTER.columns.map((c) => (
            <div key={c.label}>
              <p className="al-lbl-s m-0" style={{ color: SAND_MUTE }}>{c.label}</p>
              <ul className="m-0 mt-4 list-none p-0">
                {c.links.map((l) => (
                  <li key={l.t} className="mt-2.5">
                    <a href={l.href} {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                      className={`al-lbl-s al-link inline-flex min-h-[36px] items-center ${FOCUS}`} style={{ color: SAND }}>
                      {l.t}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="al-body mt-14 max-w-[32rem] text-[11.5px] leading-[1.6]" style={{ color: SAND_MUTE }}>
          {FOOTER.note} · {ADDRESS_1}, {ADDRESS_2}
        </p>

        {/* their colossal footer wordmark */}
        <div className="mt-12 overflow-hidden" style={{ overflowX: 'clip' }}>
          <p aria-hidden className="m-0 select-none whitespace-nowrap"
            style={{
              fontFamily: LOGO, fontWeight: 400, color: SAND,
              fontSize: 'clamp(2.6rem, 12vw, 11rem)', lineHeight: 1.02,
              letterSpacing: '.04em', paddingBottom: '.08em',
            }}>
            ALRÚN
          </p>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ PAGE ════════════════════════════════════════════════════ */
export default function Page() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = 'Alrún Nordic Design · Bindrune jewelry from Reykjavík'
    setThemeColor(SAND)
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

      const word = q('.al-hero-word')[0]
      if (word) gsap.from(word, { yPercent: 108, duration: 1.25, ease: 'power3.out', delay: 0.15 })
      gsap.from(q('.al-hero-fade'), { opacity: 0, y: 16, duration: 0.9, ease: 'power3.out', stagger: 0.08, delay: 0.55 })
      const heroImg = q('.al-hero-img')[0]
      if (heroImg) {
        gsap.fromTo(heroImg, { yPercent: -4, scale: 1.08 }, {
          yPercent: 6, scale: 1.08, ease: 'none',
          scrollTrigger: { trigger: heroImg, start: 'top top', end: 'bottom top', scrub: true },
        })
      }
      /* Reveals animate TOWARD the resting state + a failsafe, so nothing can
         strand invisible. */
      q('.al-reveal').forEach((el) => {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 94%', once: true } })
      })
      document.fonts?.ready.then(() => ScrollTrigger.refresh())
      const failsafe = window.setTimeout(() => {
        q('.al-reveal').forEach((el) => {
          if (parseFloat(window.getComputedStyle(el).opacity) < 0.9) gsap.set(el, { opacity: 1, y: 0 })
        })
      }, 1800)
      return () => {
        window.clearTimeout(failsafe)
        gsap.ticker.remove(tick)
        lenis.destroy()
      }
    })
    return () => { mm.revert() }
  }, [])

  return (
    /* No overflow-x on the root: an ancestor `overflow-x: clip` stops the
       carousel's own scroll container from accepting scrollLeft in Chrome, so
       the arrows silently did nothing. Both colossal wordmarks clip locally
       inside their own wrappers instead. */
    <div ref={rootRef} lang="en" className="al-root antialiased">
      <style>{PAGE_STYLES}</style>
      <TopNav />
      <main>
        <Hero />
        <Statement />
        <Twelve />
        <Shop />
        <Craft />
        <Approach />
        <FooterWine />
      </main>
      <PreviewChrome company={company} />
      <PreviewFooter company={company} />
    </div>
  )
}
