/**
 * Öruggt skjól — shared UI shell: palette, fonts, language toggle, header,
 * footer, buttons, and the one-time ambient-motion stylesheet.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, animate, useInView, useReducedMotion, type MotionValue } from 'framer-motion'
import { CATEGORIES, ORG, SERVICES, UI, type L, type Lang, type Service } from './data'
import { Reveal } from '../../components/Reveal'
import { SndrBadge } from '../SndrBadge'

/* ── palette ──────────────────────────────────────────────────────────── */

export const C = {
  cream: '#FBF3E7', // page ground
  cream2: '#F6EAD7', // alt section / cards
  oat: '#EFDFC7', // deeper warm panel
  line: '#E7D6BC', // hairlines
  cocoa: '#3A2C22', // headings
  body: '#6A5648', // body text
  clay: '#B0512F', // primary accent as text/fill (AA on cream)
  clayText: '#A2492A', // accent when used as small text
  terra: '#D9744E', // decorative terracotta
  sun: '#E1962F', // sun-gold as text (AA); illustrations use lighter
  sage: '#5E8A5E', // sage as text (AA)
  sky: '#4E86A6', // sky-blue as text (AA)
  rose: '#C06C7C', // rose as text (AA)
  deep: '#4A3123', // deep cocoa band ground
  deepText: '#F6E8D5', // text on deep band
  // Gold for SMALL text on deep grounds. C.sun (#E1962F) is only 4.9:1 on
  // C.deep and 3.6:1 over a translucent white panel, so it fails WCAG AA at
  // body size; these are measured replacements (6.6:1 and 5.3:1).
  sunOnDeep: '#F2B65E',
  sunOnPanel: '#F5C173',
}

/* ── fonts ────────────────────────────────────────────────────────────── */

/*
 * Type recut 2026-07-17, to sit with the watercolor art direction:
 * Fraunces (warm literary display serif, latin-ext = full Icelandic) over
 * Author (humanist text sans, variable). Self-hosted from the local library
 * at public/bofs/fonts/. Caveat stays for the single handwritten grace note.
 */
const DISPLAY = '"Fraunces", "Bricolage Grotesque", Georgia, serif'
const BODY = '"Author", "Hanken Grotesk", system-ui, sans-serif'
const HAND = '"Caveat", cursive'
export const FONT = { display: DISPLAY, body: BODY, hand: HAND }

/* ── assets ───────────────────────────────────────────────────────────── */

/** Base-path-safe URL for a file in public/bofs/. */
export const asset = (f: string) => `${import.meta.env.BASE_URL}bofs/${f}`
/** The real, official Barna- og fjölskyldustofa emblem. */
export const LOGO = asset('bofs-logo.png')

/* ── scrolling ────────────────────────────────────────────────────────── */

/*
 * NO LENIS ON THESE PAGES — measured decision, do not reintroduce.
 * A live profiler in Sindri's own Chrome showed the page renders at a
 * locked 58 to 60 fps in every section with every suspect toggled, yet
 * scrolling still felt laggy: the latency was Lenis's wheel interception
 * replacing native trackpad inertia with interpolation. Scrolling here is
 * fully native; anchors glide via the global html scroll-behavior smooth
 * rule in index.css and the scroll-mt-24 offsets on every section target.
 */

/* ── language ─────────────────────────────────────────────────────────── */

const LANG_KEY = 'bofs-lang'
const LANG_EVT = 'bofs-lang-change'

function readLang(): Lang {
  try {
    const v = localStorage.getItem(LANG_KEY)
    return v === 'en' || v === 'is' ? v : 'is'
  } catch {
    return 'is'
  }
}

export function useLang(): [Lang, (l: Lang) => void, (v: L) => string] {
  const [lang, setLangState] = useState<Lang>(readLang)

  useEffect(() => {
    const h = () => setLangState(readLang())
    window.addEventListener(LANG_EVT, h)
    return () => window.removeEventListener(LANG_EVT, h)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((l: Lang) => {
    try {
      localStorage.setItem(LANG_KEY, l)
    } catch {
      /* private mode — session only */
    }
    window.dispatchEvent(new Event(LANG_EVT))
  }, [])

  const pick = useCallback((v: L) => v[lang], [lang])
  return [lang, setLang, pick]
}

/* ── ambient motion + base styles (injected once) ─────────────────────── */

/* ── painted surface primitives ───────────────────────────────────────── */

/*
 * Until now the watercolours sat on a flat web page: solid hex grounds, hard
 * rectangular crops, cast shadows. The paintings were doing all the work and
 * the interface around them spoke a different material language.
 *
 * Everything below exists to make the INTERFACE behave the way the paintings
 * do, so the site reads as one sheet of paper rather than as a website that
 * contains pictures. It is all generated SVG: no texture download, no extra
 * request, no JavaScript, and nothing animates. The motion lock still holds.
 */

/*
 * Cold-press paper tooth. Fractal noise, desaturated, then compressed by the
 * feComponentTransfer into the 0.86 to 1.0 range so that multiplying it over
 * a ground darkens by at most 14% at the darkest speck and about 6% on
 * average. Full-range grey noise multiplied would halve the luminance and
 * wreck every contrast ratio on the site.
 *
 * Tiles at 260px, which stays illegible as a repeat even at the 1.22 zoom of
 * the largest reader text setting.
 */
const PAPER =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='0.14' intercept='0.86'/%3E%3CfeFuncG type='linear' slope='0.14' intercept='0.86'/%3E%3CfeFuncB type='linear' slope='0.14' intercept='0.86'/%3E%3CfeFuncA type='linear' slope='0' intercept='1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='260' height='260' filter='url(%23p)'/%3E%3C/svg%3E\")"

/*
 * A wash does not end in a straight line. Each mask is a soft-cornered field
 * pushed around by turbulence and then blurred, so a painting dissolves into
 * the paper instead of being cut off by a rectangle. preserveAspectRatio none
 * plus mask-size 100% 100% lets one mask stretch to any slot.
 *
 * Two shapes only, matching the two crops the site already uses: the plain
 * field, and the arch doorway that appears at most once per page.
 */
const wetFilter =
  "%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.011 0.022' numOctaves='3' seed='9' result='n'/%3E%3CfeDisplacementMap in='SourceGraphic' in2='n' scale='20' xChannelSelector='R' yChannelSelector='G'/%3E%3CfeGaussianBlur stdDeviation='2.2'/%3E%3C/filter%3E"

const WET =
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='450' preserveAspectRatio='none'%3E${wetFilter}%3Crect x='18' y='18' width='564' height='414' rx='14' fill='%23fff' filter='url(%23w)'/%3E%3C/svg%3E")`

/*
 * The card head: wet along the BOTTOM only. The rect deliberately overhangs
 * the viewBox on three sides so that after the blur and displacement those
 * edges are still far outside the box and stay hard, letting the painting
 * bleed off the card while only the bottom dissolves into the card's paper.
 */
const WET_HEAD =
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='450' preserveAspectRatio='none'%3E${wetFilter}%3Crect x='-60' y='-60' width='720' height='462' fill='%23fff' filter='url(%23w)'/%3E%3C/svg%3E")`

/* the doorway: a half-round head on straight jambs, matching .bofs-arch */
const WET_ARCH =
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='450' preserveAspectRatio='none'%3E${wetFilter}%3Cpath d='M18 402 L18 300 A282 282 0 0 1 582 300 L582 402 Q582 432 552 432 L48 432 Q18 432 18 402 Z' fill='%23fff' filter='url(%23w)'/%3E%3C/svg%3E")`

/*
 * A rule in a painting is a brushstroke: it varies in thickness along its
 * length and runs dry at one end. Carried as a mask rather than a coloured
 * image so the stroke can take any colour from CSS.
 */
const INK_RULE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='6' preserveAspectRatio='none'%3E%3Cpath d='M3 3.2 C 90 1.7, 170 4.3, 258 2.6 C 350 1.1, 430 4.1, 512 2.9 C 550 2.4, 575 3.4, 597 2.8' stroke='%23fff' stroke-width='2.1' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")"

export function BofsStyles() {
  return (
    <>
      <style>{`
      @font-face { font-family:'Fraunces'; src:url('${asset('fonts/fraunces-400.woff2')}') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
      @font-face { font-family:'Fraunces'; src:url('${asset('fonts/fraunces-500.woff2')}') format('woff2'); font-weight:500; font-style:normal; font-display:swap; }
      @font-face { font-family:'Fraunces'; src:url('${asset('fonts/fraunces-600.woff2')}') format('woff2'); font-weight:600; font-style:normal; font-display:swap; }
      @font-face { font-family:'Author'; src:url('${asset('fonts/author-var.woff2')}') format('woff2'); font-weight:200 800; font-style:normal; font-display:swap; }

      /*
       * The page ground is paper, not a colour. Every other surface in the
       * system sits on this, and that is what makes the paintings and the
       * interface read as one object rather than as pictures on a website.
       */
      .bofs-root { background-color:${C.cream}; background-image:${PAPER}; background-size:260px 260px; background-blend-mode:multiply; color:${C.body}; font-family:${BODY}; -webkit-font-smoothing:antialiased; }
      .bofs-root ::selection { background:${C.terra}; color:#fff; }
      /* a serif display wants air, not grotesk tightness */
      .bofs-display { font-family:${DISPLAY}; color:${C.cocoa}; font-weight:600; letter-spacing:-0.012em; line-height:1.08; }
      .bofs-display-xl { font-weight:500; letter-spacing:-0.018em; line-height:1.04; }
      .bofs-display-sm { font-weight:600; letter-spacing:-0.004em; }
      .bofs-hand { font-family:${HAND}; }
      /* long Icelandic compounds orphan easily; balance headings, pretty leads */
      .bofs-balance { text-wrap:balance; }
      .bofs-pretty { text-wrap:pretty; }
      /* one statement style, reused as each page's single large gesture */
      .bofs-statement { font-family:${DISPLAY}; color:${C.cocoa}; font-weight:500; font-size:clamp(24px,3.6vw,38px); line-height:1.2; letter-spacing:-0.012em; }
      .bofs-num { font-variant-numeric:tabular-nums; font-feature-settings:'tnum' 1; }
      .bofs-root a { color:inherit; }
      .bofs-focus:focus-visible { outline:3px solid ${C.clay}; outline-offset:3px; border-radius:10px; }
      .bofs-root .no-scrollbar { scrollbar-width:none; -ms-overflow-style:none; }
      .bofs-root .no-scrollbar::-webkit-scrollbar { display:none; }

      /* reader comfort: zoom reflows properly, unlike transform:scale */
      html[data-bofs-text="lg"] .bofs-root { zoom:1.1; }
      html[data-bofs-text="xl"] .bofs-root { zoom:1.22; }

      /* one photographic language: unify eleven photos into one shoot */
      .bofs-photo { filter:saturate(.94) sepia(.05) contrast(.99); }
      /* the doorway crop; at most one per page */
      .bofs-arch { border-radius:999px 999px 30px 30px; }

      /*
       * Any band that lays down its own opaque colour would cover the sheet,
       * so it re-lays the tooth inside itself. Multiplied, so that where two
       * washes overlap they darken the way layered pigment does, rather than
       * fogging toward grey the way stacked alpha does.
       */
      .bofs-wash { position:relative; }
      .bofs-wash::before {
        content:''; position:absolute; inset:0; pointer-events:none;
        background-image:${PAPER}; background-size:220px 220px; mix-blend-mode:multiply;
      }

      /* pigment pools toward one part of the paper instead of filling a
         rectangle evenly; two soft blooms, never a hard boundary */
      .bofs-bloom { position:relative; }
      .bofs-bloom::after {
        content:''; position:absolute; inset:0; pointer-events:none; mix-blend-mode:multiply;
        background:
          radial-gradient(72% 56% at 16% 10%, rgba(74,49,35,.05), rgba(74,49,35,0) 70%),
          radial-gradient(82% 62% at 88% 96%, rgba(74,49,35,.06), rgba(74,49,35,0) 72%);
      }

      /*
       * WET EDGES. A painting dissolves into the paper; it does not stop at a
       * crop. The ::after is edge darkening, where pigment pools and dries
       * darker at the boundary of a wash. It is masked along with its parent,
       * so the darkening follows the wobble exactly.
       *
       * Do not put .bofs-bloom on the same element: both use ::after.
       */
      .bofs-wet, .bofs-wet-arch {
        position:relative;
        -webkit-mask-size:100% 100%; mask-size:100% 100%;
        -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat;
      }
      .bofs-wet { -webkit-mask-image:${WET}; mask-image:${WET}; }
      .bofs-wet-arch { -webkit-mask-image:${WET_ARCH}; mask-image:${WET_ARCH}; }

      /* the service-card head: bleeds off three sides, dissolves at the foot.
         Pooling runs along the bottom only, since that is the only edge where
         the wash actually stops. */
      .bofs-wet-head {
        position:relative; display:block;
        -webkit-mask-image:${WET_HEAD}; mask-image:${WET_HEAD};
        -webkit-mask-size:100% 100%; mask-size:100% 100%;
        -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat;
      }
      .bofs-wet-head::after {
        content:''; position:absolute; inset:0; pointer-events:none; mix-blend-mode:multiply;
        background:linear-gradient(to bottom, rgba(74,49,35,0) 68%, rgba(74,49,35,.13) 100%);
      }
      .bofs-wet::after, .bofs-wet-arch::after {
        content:''; position:absolute; inset:0; pointer-events:none; mix-blend-mode:multiply;
        background:radial-gradient(118% 118% at 50% 44%, rgba(74,49,35,0) 56%, rgba(74,49,35,.10) 84%, rgba(74,49,35,.21) 100%);
      }

      /* a rule in a painting is a brushstroke: thickness varies along its
         length and it runs dry at the end. Carried as a mask so the stroke
         takes its colour from CSS and can sit on any ground. */
      /* no width here on purpose: a block div already fills its container,
         and an absolutely positioned one is sized by its left/right offsets,
         which a width:100% would override */
      .bofs-rule {
        border:0; display:block; height:6px;
        -webkit-mask-image:${INK_RULE}; mask-image:${INK_RULE};
        -webkit-mask-size:100% 100%; mask-size:100% 100%;
        -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat;
        background-color:${C.line};
      }
      .bofs-rule-clay { background-color:${C.clay}; opacity:.5; }
      .bofs-rule-deep { background-color:${C.deepText}; opacity:.32; }

      /* micro-interaction craft: composited-only lifts, gated behind real hover */
      .bofs-lift { transition:transform .2s ease-out, box-shadow .2s ease-out; }
      .bofs-press { transition:transform .12s ease-out; }
      .bofs-press:active { transform:scale(.985); }
      @media (hover:hover) and (pointer:fine) {
        .bofs-lift:hover { transform:translateY(-3px); }
      }

      /*
       * NO LOOPING AMBIENT ANIMATION — professionalisation decision 2026-07-17.
       * Drifting clouds, flying birds, breathing suns and twinkling windows
       * read as a children's book; the register here is warm-institutional.
       * All motion is either a one-shot entrance or user-triggered feedback.
       */
      @media (prefers-reduced-motion: reduce) {
        .bofs-faq { transition:none !important; }
      }
    `}</style>

      {/*
        One shared filter for the wet seams, rendered here because BofsStyles
        mounts exactly once per page. Defining it inside each divider instead
        would put duplicate ids in the DOM, which is the sort of thing the
        accessibility audit exists to catch.
      */}
      <svg
        aria-hidden="true"
        focusable="false"
        width="0"
        height="0"
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      >
        <defs>
        </defs>
      </svg>
    </>
  )
}

/* ── wordmark ─────────────────────────────────────────────────────────── */

export function Wordmark({ onDeep = false, compact = false }: { onDeep?: boolean; compact?: boolean }) {
  const ink = onDeep ? C.deepText : C.cocoa
  return (
    <span className="flex items-center gap-2.5">
      {/* The real Barna- og fjölskyldustofa emblem, bare — no tile around it */}
      <img src={LOGO} width={34} height={34} alt="" aria-hidden="true" className="h-[34px] w-[34px] shrink-0" />
      <span className="leading-none">
        <span
          className={`block font-semibold ${compact ? 'text-[15px]' : 'text-[13.5px] sm:text-[16px]'}`}
          style={{ fontFamily: DISPLAY, color: ink, letterSpacing: '-0.01em' }}
        >
          Barna- og fjölskyldustofa
        </span>
        {!compact && (
          <span
            className="mt-1 hidden text-[9.5px] font-bold uppercase sm:block"
            style={{ color: onDeep ? C.sun : C.clayText, letterSpacing: '0.24em', lineHeight: 1 }}
          >
            Öruggt skjól
          </span>
        )}
      </span>
    </span>
  )
}

/* ── buttons ──────────────────────────────────────────────────────────── */

type BtnProps = {
  children: ReactNode
  href?: string
  to?: string
  onClick?: () => void
  variant?: 'primary' | 'soft' | 'ghost' | 'deep'
  className?: string
  icon?: ReactNode
}

const btnBase =
  'bofs-focus bofs-press inline-flex items-center justify-center gap-2 rounded-[13px] px-6 py-3 text-[15px] font-semibold transition-all duration-200 will-change-transform hover:-translate-y-0.5'

function btnStyle(variant: BtnProps['variant']) {
  switch (variant) {
    case 'soft':
      return { background: '#fff', color: C.cocoa, boxShadow: '0 2px 0 ' + C.line }
    case 'ghost':
      return { background: 'transparent', color: C.clayText, boxShadow: 'inset 0 0 0 1.5px ' + C.line }
    case 'deep':
      // pigment weight, not elevation: an inked bottom edge instead of a
      // shadow cast onto paper the button is supposed to be part of
      return { background: C.sun, color: '#3A2410', boxShadow: 'inset 0 -2px 0 rgba(58,44,34,.22)' }
    case 'primary':
    default:
      return { background: C.clay, color: '#FFF6EC', boxShadow: 'inset 0 -2px 0 rgba(58,20,8,.26)' }
  }
}

export function Button({ children, href, to, onClick, variant = 'primary', className = '', icon }: BtnProps) {
  const style = btnStyle(variant)
  const cls = `${btnBase} ${className}`
  const inner = (
    <>
      {children}
      {icon}
    </>
  )
  if (to)
    return (
      <Link to={to} className={cls} style={style} onClick={onClick}>
        {inner}
      </Link>
    )
  if (href)
    return (
      <a href={href} className={cls} style={style} onClick={onClick}>
        {inner}
      </a>
    )
  return (
    <button type="button" className={cls} style={style} onClick={onClick}>
      {inner}
    </button>
  )
}

/* ── language toggle ──────────────────────────────────────────────────── */

export function LangToggle({ lang, setLang, onDeep = false }: { lang: Lang; setLang: (l: Lang) => void; onDeep?: boolean }) {
  const opts: Lang[] = ['is', 'en']
  return (
    <div
      className="relative inline-flex items-center rounded-full p-0.5"
      style={{ background: onDeep ? 'rgba(255,255,255,.12)' : '#fff', boxShadow: onDeep ? 'none' : `inset 0 0 0 1px ${C.line}` }}
      role="group"
      aria-label="Language"
    >
      {opts.map((o) => {
        const active = lang === o
        return (
          <button
            key={o}
            type="button"
            onClick={() => setLang(o)}
            className="bofs-focus relative z-10 rounded-full px-3 py-1 text-[13px] font-bold uppercase tracking-wide transition-colors"
            style={{ color: active ? '#FFF6EC' : onDeep ? C.deepText : C.body }}
            aria-pressed={active}
          >
            {active && (
              <motion.span
                layoutId={`langpill-${onDeep ? 'd' : 'l'}`}
                className="absolute inset-0 -z-10 rounded-full"
                style={{ background: C.clay }}
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            {o === 'is' ? 'ÍS' : 'EN'}
          </button>
        )
      })}
    </div>
  )
}

/* ── header ───────────────────────────────────────────────────────────── */

export function Header() {
  const [lang, setLang, pick] = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [services, setServices] = useState(false)
  const servicesRef = useRef<HTMLDivElement | null>(null)
  const { pathname } = useLocation()
  const onHome = pathname.endsWith('/preview/bofs') || pathname.endsWith('/preview/bofs/')

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24)
    h()
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  // close both menus whenever the route changes
  useEffect(() => {
    setOpen(false)
    setServices(false)
  }, [pathname])

  // dropdown: close on Escape or outside pointer
  useEffect(() => {
    if (!services) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setServices(false)
    const onDown = (e: PointerEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) setServices(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [services])

  const base = onHome ? '' : '/preview/bofs'
  const homes = SERVICES.filter((s) => s.category === 'heimili')
  const thjonusta = SERVICES.filter((s) => s.category === 'thjonusta')
  const pageLinks = [
    { label: pick(UI.nav.system), to: '/preview/bofs/kerfid' },
    { label: pick(UI.nav.about), to: '/preview/bofs/um-stofnunina' },
    { label: pick(UI.nav.report), to: `${base}#tilkynna` },
    { label: pick(UI.nav.help), to: `${base}#help` },
  ]
  const isActive = (to: string) => pathname === to

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className="mx-auto mt-3 flex items-center justify-between gap-4 rounded-2xl px-3 py-2 pr-3 pl-4 transition-all duration-500 sm:mt-4"
        style={{
          margin: '12px 12px 0',
          maxWidth: 'min(1180px, calc(100% - 24px))',
          marginLeft: 'auto',
          marginRight: 'auto',
          background: scrolled ? 'rgba(251,243,231,.92)' : 'rgba(251,243,231,.35)',
          boxShadow: scrolled ? `0 10px 30px -22px rgba(58,44,34,.45), inset 0 0 0 1px ${C.line}` : 'none',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(10px)' : 'none',
        }}
      >
        <Link to="/preview/bofs" className="bofs-focus shrink-0 rounded-2xl" aria-label="Barna- og fjölskyldustofa">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex">
          <div className="relative" ref={servicesRef}>
            <button
              type="button"
              className="bofs-focus flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[14.5px] font-semibold transition-colors hover:bg-white/60"
              style={{ color: C.cocoa }}
              aria-haspopup="true"
              aria-expanded={services}
              onClick={() => setServices((v) => !v)}
            >
              {pick(UI.nav.services)}
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" style={{ transform: services ? 'rotate(180deg)' : 'none', transition: 'transform .2s ease-out' }}>
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <AnimatePresence>
              {services && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                  style={{ transformOrigin: 'top left', background: 'rgba(251,243,231,.97)', boxShadow: `0 26px 54px -26px rgba(58,44,34,.55), inset 0 0 0 1px ${C.line}`, backdropFilter: 'blur(14px)' }}
                  className="absolute left-0 top-[calc(100%+10px)] grid w-[520px] grid-cols-2 gap-1 rounded-2xl p-3"
                >
                  {[
                    { title: pick(CATEGORIES[0].title), list: homes },
                    { title: pick(CATEGORIES[1].title), list: thjonusta },
                  ].map((col) => (
                    <div key={col.title}>
                      <span className="block px-3 pb-1 pt-2 text-[11.5px] font-bold uppercase tracking-[0.16em]" style={{ color: C.clayText }}>
                        {col.title}
                      </span>
                      {col.list.map((s) => (
                        <Link
                          key={s.slug}
                          to={`/preview/bofs/${s.slug}`}
                          className="bofs-focus flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-white/70"
                        >
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.hue }} />
                          <span className="leading-tight">
                            <span className="block text-[14.5px] font-semibold" style={{ color: C.cocoa }}>
                              {s.name}
                            </span>
                            <span className="block text-[12px]" style={{ color: C.body }}>
                              {pick(s.kind)}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {pageLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="bofs-focus rounded-lg px-3.5 py-2 text-[14.5px] font-semibold transition-colors hover:bg-white/60"
              style={{ color: C.cocoa, background: isActive(l.to) ? 'rgba(255,255,255,.6)' : undefined }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="tel:112"
            className="bofs-focus bofs-press hidden items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13.5px] font-bold sm:inline-flex"
            style={{ background: '#A83A24', color: '#fff' }}
          >
            <PhoneGlyph /> {pick(UI.emergencyChip)}
          </a>
          <span className="hidden sm:block">
            <LangToggle lang={lang} setLang={setLang} />
          </span>
          <button
            type="button"
            className="bofs-focus grid h-10 w-10 place-items-center rounded-xl xl:hidden"
            style={{ background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}` }}
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-4 w-5">
              <span className="absolute inset-x-0 top-0 h-0.5 rounded" style={{ background: C.cocoa, transform: open ? 'translateY(7px) rotate(45deg)' : 'none', transition: '.3s' }} />
              <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded" style={{ background: C.cocoa, opacity: open ? 0 : 1, transition: '.3s' }} />
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded" style={{ background: C.cocoa, transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none', transition: '.3s' }} />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-3 mt-2 max-h-[80vh] overflow-y-auto rounded-2xl p-3 xl:hidden"
            style={{ background: 'rgba(251,243,231,.97)', boxShadow: `0 24px 48px -24px rgba(58,44,34,.5), inset 0 0 0 1px ${C.line}`, backdropFilter: 'blur(14px)' }}
          >
            <MobileGroup label={pick({ is: 'Síður', en: 'Pages' })}>
              {pageLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="bofs-focus block rounded-2xl px-4 py-3 text-[16px] font-semibold hover:bg-white/70"
                  style={{ color: C.cocoa }}
                >
                  {l.label}
                </Link>
              ))}
            </MobileGroup>
            <MobileGroup label={pick(UI.nav.services)}>
              <div className="grid grid-cols-2 gap-1">
                {SERVICES.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/preview/bofs/${s.slug}`}
                    onClick={() => setOpen(false)}
                    className="bofs-focus flex items-center gap-2 rounded-2xl px-3 py-2.5 text-[14.5px] font-semibold hover:bg-white/70"
                    style={{ color: C.cocoa }}
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: s.hue }} />
                    {s.name}
                  </Link>
                ))}
              </div>
            </MobileGroup>
            <a
              href="tel:112"
              onClick={() => setOpen(false)}
              className="mt-1 block rounded-2xl px-4 py-3 text-[16px] font-bold"
              style={{ background: '#A83A24', color: '#fff' }}
            >
              {pick(UI.emergencyChip)}
            </a>
            <div className="mt-2 flex items-center justify-between rounded-2xl px-4 py-2.5" style={{ background: '#fff' }}>
              <span className="text-[14px] font-semibold" style={{ color: C.body }}>
                {pick({ is: 'Tungumál', en: 'Language' })}
              </span>
              <LangToggle lang={lang} setLang={setLang} />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

function MobileGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-1">
      <span className="block px-4 pb-1 pt-2 text-[11.5px] font-bold uppercase tracking-[0.16em]" style={{ color: C.clayText }}>
        {label}
      </span>
      {children}
    </div>
  )
}

function PhoneGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L16 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 3-2z"
        fill="currentColor"
      />
    </svg>
  )
}

/* ── footer ───────────────────────────────────────────────────────────── */

export function Footer() {
  const [, , pick] = useLang()
  const homes = SERVICES.filter((s) => s.category === 'heimili')
  const services = SERVICES.filter((s) => s.category === 'thjonusta')
  return (
    <footer style={{ background: C.deep, color: C.deepText }}>
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        {/*
          Three groups, not five columns. The old layout stacked five blocks at
          a 48px gap, which on a phone became a footer taller than the viewport
          and at tablet width left a single orphan block on its own row. The
          link lists now sit in their own sub-grid so they pair up on a phone
          and only spread out when there is room.
        */}
        <div className="grid gap-x-10 gap-y-12 lg:grid-cols-[1.15fr_2fr_1fr]">
          <div>
            <Wordmark onDeep />
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed" style={{ color: 'rgba(246,232,213,.75)' }}>
              {pick(UI.footerTagline)}
            </p>
            <a
              href="tel:112"
              className="bofs-focus mt-5 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13.5px] font-bold"
              style={{ background: '#A83A24', color: '#fff' }}
            >
              <PhoneGlyph />
              {pick({ is: 'Neyð? Hringdu í 112', en: 'Emergency? Call 112' })}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3">
            <div>
              <h4 className="mb-3 text-[12.5px] font-bold uppercase tracking-widest" style={{ color: C.sun }}>
                {pick(UI.nav.homes)}
              </h4>
              <ul className="space-y-0.5 text-[15px]">
                {homes.map((s) => (
                  <li key={s.slug}>
                    <Link to={`/preview/bofs/${s.slug}`} className="bofs-focus inline-block rounded py-1 transition-opacity hover:opacity-70" style={{ color: '#DCCCBA' }}>
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-[12.5px] font-bold uppercase tracking-widest" style={{ color: C.sun }}>
                {pick(UI.footerServices)}
              </h4>
              <ul className="space-y-0.5 text-[15px]">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link to={`/preview/bofs/${s.slug}`} className="bofs-focus inline-block rounded py-1 transition-opacity hover:opacity-70" style={{ color: '#DCCCBA' }}>
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="mb-3 text-[12.5px] font-bold uppercase tracking-widest" style={{ color: C.sun }}>
                {pick(UI.footerSite)}
              </h4>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-0.5 text-[15px] sm:grid-cols-1">
                {[
                    { label: pick(UI.nav.system), to: '/preview/bofs/kerfid' },
                  { label: pick(UI.nav.about), to: '/preview/bofs/um-stofnunina' },
                  { label: pick({ is: 'Fréttir', en: 'News' }), to: '/preview/bofs/frettir' },
                  { label: pick(UI.nav.report), to: '/preview/bofs#tilkynna' },
                  { label: pick(UI.nav.help), to: '/preview/bofs#help' },
                  { label: pick({ is: 'Aðgengi', en: 'Accessibility' }), to: '/preview/bofs/adgengi' },
                  { label: pick({ is: 'Persónuvernd', en: 'Privacy' }), to: '/preview/bofs/personuvernd' },
                ].map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="bofs-focus inline-block rounded py-1 transition-opacity hover:opacity-70" style={{ color: '#DCCCBA' }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-[12.5px] font-bold uppercase tracking-widest" style={{ color: C.sun }}>
              {pick(UI.footerContact)}
            </h4>
            <ul className="space-y-0.5 text-[15px]" style={{ color: 'rgba(246,232,213,.85)' }}>
              <li className="py-1">{ORG.address}</li>
              <li>
                <a className="bofs-focus inline-block rounded py-1 hover:opacity-70" href={`tel:${ORG.phone.replace(/\s/g, '')}`}>
                  {ORG.phone}
                </a>
              </li>
              <li>
                <a className="bofs-focus inline-block rounded py-1 hover:opacity-70" href={`mailto:${ORG.email}`}>
                  {ORG.email}
                </a>
              </li>
            </ul>
            <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: 'rgba(246,232,213,.6)' }}>
              {pick(ORG.hours)}
            </p>
            <a href="tel:1717" className="bofs-focus mt-4 inline-block rounded py-1 text-[13.5px] leading-relaxed transition-opacity hover:opacity-70" style={{ color: '#C8B6A5' }}>
              {pick({ is: 'Hjálparsími Rauða krossins 1717, allan sólarhringinn', en: 'Red Cross helpline 1717, around the clock' })}
            </a>
          </div>
        </div>

        {/* One rule at the bottom, not three. */}
        <div className="mt-14 flex flex-col gap-5 border-t pt-6 text-[13px] sm:flex-row sm:items-start sm:justify-between" style={{ borderColor: 'rgba(246,232,213,.16)', color: 'rgba(246,232,213,.6)' }}>
          <p className="max-w-md">
            {pick(UI.conceptBadge)}
            <span className="mt-1 block" style={{ color: 'rgba(246,232,213,.75)' }}>
              {pick({
                is: 'Merki og nafn Barna- og fjölskyldustofu eru eign stofnunarinnar.',
                en: 'The Barna- og fjölskyldustofa emblem and name are property of the agency.',
              })}
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <TextSizeControl onDeep />
            <p>{pick(UI.rights)} · 2026</p>
            <SndrBadge dark />
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ── shared bits: eyebrow, section head, arrow, service card ──────────── */

export function Arrow({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Eyebrow({ children, color = C.clayText }: { children: ReactNode; color?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {children}
    </span>
  )
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  align = 'left',
  onDeep = false,
}: {
  eyebrow?: string
  title: ReactNode
  lead?: string
  align?: 'left' | 'center'
  onDeep?: boolean
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && <Eyebrow color={onDeep ? C.sun : C.clayText}>{eyebrow}</Eyebrow>}
      <h2 className="bofs-display mt-3 text-[clamp(28px,5vw,46px)]" style={{ color: onDeep ? C.deepText : C.cocoa }}>
        {title}
      </h2>
      {lead && (
        <p className="mt-4 text-[17px] leading-relaxed" style={{ color: onDeep ? 'rgba(246,232,213,.8)' : C.body }}>
          {lead}
        </p>
      )}
    </div>
  )
}

/*
 * Where each painting sits inside the card head. These are hand-set rather
 * than centre-cropped: the nine paintings have very different compositions
 * (Stuðlar is an aerial, Bjargey looks across a fjord, Barnahús is two chairs
 * in a corner) and an automatic centre crop puts the horizon in a different
 * place on every card, which makes the row read as five unrelated pictures
 * instead of one hand.
 */
const CARD_CROP: Record<Service['art'], string> = {
  studlar: 'center 58%',
  esjan: 'center 55%',
  blonduhlid: 'center 46%',
  bjargey: 'center 47%',
  laekjarbakki: 'center 58%',
  barnahus: 'center 55%',
  mst: 'center 62%',
  sok: 'center 58%',
  fostur: 'center 60%',
}

export function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  const [, , pick] = useLang()
  return (
    <Reveal delay={(index % 3) * 0.08} y={26}>
      <Link
        to={`/preview/bofs/${service.slug}`}
        className="bofs-focus bofs-lift group relative flex h-full flex-col overflow-hidden rounded-[18px]"
        style={{ background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}` }}
      >
        {/*
          The painting is the card's head. It is decorative here, so alt is
          empty: the name is announced by the h3 immediately below, and a
          screen reader should not have to sit through a watercolour
          description before hearing which centre this is.
        */}
        <span className="bofs-wet-head" style={{ background: service.hueSoft }}>
          <img
            src={asset(`card-${service.art}.jpg`)}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            width={640}
            height={360}
            className="bofs-photo block h-[132px] w-full object-cover"
            style={{ objectPosition: CARD_CROP[service.art] ?? 'center 55%' }}
          />
        </span>
        {/* a div, not a span: this wraps an h3, and a span may only contain
            phrasing content. <a> itself is transparent, so a div is fine. */}
        <div className="flex flex-1 flex-col p-6 pt-5">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-bold" style={{ background: service.hueSoft, color: C.cocoa }}>
            {pick(service.kind)}
          </span>
          <h3 className="bofs-display bofs-display-sm mt-3 text-[23px]">{service.name}</h3>
          <p className="mt-2 flex-1 text-[15px] leading-relaxed" style={{ color: C.body }}>
            {pick(service.card)}
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-bold" style={{ color: C.clayText }}>
            {pick(UI.exploreCentre)}
            <Arrow className="transition-transform duration-200 ease-out group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </Reveal>
  )
}

/* ── handwriting: the annotation writes itself on ─────────────────────── */

/**
 * A Caveat annotation that reveals left to right, as if being written.
 *
 * The observed wrapper is NEVER clipped: an element that clips itself to zero
 * width is never "in view" for IntersectionObserver, so the reveal would never
 * fire and the line would ship invisible. Outer span observes, inner animates.
 * The negative bottom/right insets keep descenders and Icelandic accents from
 * being shaved off at the clip edge.
 */
export function Handwritten({
  children,
  className = '',
  style,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  delay?: number
}) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  const shown = reduce || inView
  return (
    <span ref={ref} className={`bofs-hand inline-block ${className}`} style={style}>
      <motion.span
        className="inline-block"
        initial={reduce ? false : { clipPath: 'inset(-12% 100% -18% -2%)' }}
        animate={shown ? { clipPath: 'inset(-12% -4% -18% -2%)' } : undefined}
        transition={{ duration: 0.9, delay, ease: [0.22, 0.61, 0.36, 1] }}
        style={{ willChange: 'clip-path' }}
      >
        {children}
      </motion.span>
    </span>
  )
}

/* ── reader comfort: text size (persisted, shared across pages) ────────── */

export type TextSize = 'md' | 'lg' | 'xl'
const TEXT_KEY = 'bofs-text'
const TEXT_EVT = 'bofs-text-change'

function readTextSize(): TextSize {
  try {
    const v = localStorage.getItem(TEXT_KEY)
    return v === 'lg' || v === 'xl' ? v : 'md'
  } catch {
    return 'md'
  }
}

export function useTextSize(): [TextSize, (t: TextSize) => void] {
  const [size, setSizeState] = useState<TextSize>('md')

  // read after mount so the first paint matches the server-agnostic default
  useEffect(() => {
    setSizeState(readTextSize())
    const h = () => setSizeState(readTextSize())
    window.addEventListener(TEXT_EVT, h)
    return () => window.removeEventListener(TEXT_EVT, h)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.bofsText = size
    return () => {
      delete document.documentElement.dataset.bofsText
    }
  }, [size])

  const setSize = useCallback((t: TextSize) => {
    try {
      localStorage.setItem(TEXT_KEY, t)
    } catch {
      /* private mode, session only */
    }
    window.dispatchEvent(new Event(TEXT_EVT))
  }, [])

  return [size, setSize]
}

/** Small Aa control. Browser zoom exists, but many readers never find it. */
export function TextSizeControl({ onDeep = false }: { onDeep?: boolean }) {
  const [size, setSize] = useTextSize()
  const [, , pick] = useLang()
  const opts: { key: TextSize; label: string; px: number }[] = [
    { key: 'md', label: 'A', px: 13 },
    { key: 'lg', label: 'A', px: 15.5 },
    { key: 'xl', label: 'A', px: 18 },
  ]
  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-[13px]" style={{ color: onDeep ? 'rgba(246,232,213,.7)' : C.body }}>
        {pick({ is: 'Leturstærð', en: 'Text size' })}
      </span>
      <div
        className="inline-flex items-center gap-0.5 rounded-full p-0.5"
        style={{ background: onDeep ? 'rgba(255,255,255,.1)' : '#fff', boxShadow: onDeep ? 'none' : `inset 0 0 0 1px ${C.line}` }}
        role="group"
        aria-label={pick({ is: 'Leturstærð', en: 'Text size' })}
      >
        {opts.map((o) => {
          const active = size === o.key
          return (
            <button
              key={o.key}
              type="button"
              onClick={() => setSize(o.key)}
              aria-pressed={active}
              className="bofs-focus grid h-7 w-7 place-items-center rounded-full font-bold leading-none transition-colors"
              style={{
                fontSize: o.px,
                background: active ? C.clay : 'transparent',
                color: active ? '#FFF6EC' : onDeep ? C.deepText : C.body,
              }}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── count-up number (verified stats only) ────────────────────────────── */

export function StatCountUp({ value, format = 'plain', className, style }: { value: number; format?: 'plain' | 'thousand'; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [lang] = useLang()
  const inView = useInView(ref, { once: true, margin: '-70px' })
  const reduce = useReducedMotion()
  // Deterministic grouping: Icelandic thousands separator is a period, English a
  // comma. Do it by hand; this Chrome's ICU mis-maps is-IS to a comma.
  const sep = lang === 'is' ? '.' : ','
  const fmt = useCallback((n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep), [sep])

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (reduce || !inView) {
      if (reduce) node.textContent = fmt(value)
      return
    }
    const controls = animate(0, value, {
      duration: format === 'thousand' ? 1.4 : 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = fmt(v)
      },
    })
    return () => controls.stop()
  }, [inView, reduce, value, fmt, format])

  return (
    <span ref={ref} className={`bofs-num ${className ?? ''}`} style={style}>
      {reduce ? fmt(value) : fmt(0)}
    </span>
  )
}

/* ── sticky scroll-spy sub-nav (shared by the two long pages) ─────────── */

export function SubNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? '')
  const idKey = sections.map((s) => s.id).join('|')

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
    if (!els.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-42% 0px -52% 0px', threshold: [0, 0.2, 0.5, 1] },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idKey])

  return (
    <div className="sticky top-[84px] z-40 mx-auto max-w-6xl px-4">
      <nav
        className="no-scrollbar flex gap-1 overflow-x-auto rounded-full p-1.5"
        style={{ background: 'rgba(251,243,231,.92)', boxShadow: `inset 0 0 0 1px ${C.line}, 0 12px 30px -22px rgba(58,44,34,.5)`, backdropFilter: 'blur(10px)' }}
        aria-label="On this page"
      >
        {sections.map((s) => {
          const on = active === s.id
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="bofs-focus relative shrink-0 rounded-full px-3.5 py-1.5 text-[13.5px] font-semibold transition-colors"
              style={{ color: on ? '#FFF6EC' : C.body }}
              aria-current={on ? 'true' : undefined}
            >
              {on && (
                <motion.span
                  layoutId="bofs-subnav"
                  className="absolute inset-0 -z-10 rounded-full"
                  style={{ background: C.clay }}
                  transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                />
              )}
              {s.label}
            </a>
          )
        })}
      </nav>
    </div>
  )
}

/* ── compositor-only scroll rail (the one scrubbed signature on kerfid) ── */

export function ScrollRail({ progress, className }: { progress?: MotionValue<number>; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-full ${className ?? ''}`} style={{ background: C.line }} aria-hidden="true">
      {progress ? (
        <motion.div className="h-full w-full origin-top rounded-full" style={{ background: C.clay, scaleY: progress }} />
      ) : (
        <div className="h-full w-full rounded-full" style={{ background: C.clay }} />
      )}
    </div>
  )
}

/* ── slim concept disclaimer bar ──────────────────────────────────────── */

export function ConceptBar() {
  const [, , pick] = useLang()
  return (
    <div className="w-full py-1.5 text-center text-[12px] font-medium" style={{ background: C.oat, color: C.body }}>
      {pick(UI.conceptBadge)}
    </div>
  )
}
