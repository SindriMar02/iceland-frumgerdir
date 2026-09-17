/**
 * Öruggt skjól — shared UI shell: palette, fonts, language toggle, header,
 * footer, buttons, and the one-time ambient-motion stylesheet.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, animate, useInView, useReducedMotion, type MotionValue } from 'framer-motion'
import { CATEGORIES, ISLAND, ORG, SERVICES, UI, type L, type Lang, type Service } from './data'
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
/*
 * Type recut 2026-09-17. Fraunces looked best and is the serif every
 * generated site wears, so Sindri asked for a face with the same softness
 * that is not on every AI page. Twelve owned families were set in Icelandic
 * side by side; Sentient (Indian Type Foundry, soft low-contrast serif, full
 * Icelandic) came closest to Fraunces' warmth with a calmer, cleaner drawing.
 * General Sans carries body text. A plain grotesk for everything was tried
 * first and read as a bank. Caveat stays for the single handwritten line.
 */
const DISPLAY = '"Sentient", Georgia, serif'
const BODY = '"General Sans", "Helvetica Neue", Arial, sans-serif'
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

/**
 * Holds a click on a link to another BOFS page for a short exit, then
 * navigates. Same-page anchors, new tabs, modified clicks and anything off
 * the site pass straight through.
 */
function BofsPageTransition() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  useEffect(() => {
    delete document.documentElement.dataset.bofsLeaving
  }, [pathname])
  useEffect(() => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, '')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin) return
      const path = url.pathname.startsWith(base) ? url.pathname.slice(base.length) || '/' : url.pathname
      if (!path.startsWith('/preview/bofs')) return
      if (url.pathname === window.location.pathname) return
      e.preventDefault()
      e.stopPropagation()
      document.documentElement.dataset.bofsLeaving = ''
      window.setTimeout(() => navigate(path + url.search + url.hash), reduce ? 120 : 220)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [navigate])
  return null
}

export function BofsStyles() {
  return (
    <>
      <BofsPageTransition />
      <style>{`
      @font-face { font-family:'Sentient'; src:url('${asset('fonts/Sentient-Regular.woff2')}') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
      @font-face { font-family:'Sentient'; src:url('${asset('fonts/Sentient-Medium.woff2')}') format('woff2'); font-weight:500; font-style:normal; font-display:swap; }
      @font-face { font-family:'Sentient'; src:url('${asset('fonts/Sentient-Bold.woff2')}') format('woff2'); font-weight:700; font-style:normal; font-display:swap; }
      @font-face { font-family:'General Sans'; src:url('${asset('fonts/GeneralSans-Regular.woff2')}') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
      @font-face { font-family:'General Sans'; src:url('${asset('fonts/GeneralSans-Medium.woff2')}') format('woff2'); font-weight:500; font-style:normal; font-display:swap; }
      @font-face { font-family:'General Sans'; src:url('${asset('fonts/GeneralSans-Semibold.woff2')}') format('woff2'); font-weight:600 700; font-style:normal; font-display:swap; }

      /*
       * The page ground is paper, not a colour. Every other surface in the
       * system sits on this, and that is what makes the paintings and the
       * interface read as one object rather than as pictures on a website.
       */
      .bofs-root { background-color:${C.cream}; background-image:${PAPER}; background-size:260px 260px; background-blend-mode:multiply; color:${C.body}; font-family:${BODY}; -webkit-font-smoothing:antialiased; }
      .bofs-root ::selection { background:${C.terra}; color:#fff; }
      /* a soft serif display wants a medium weight and a little air */
      .bofs-display { font-family:${DISPLAY}; color:${C.cocoa}; font-weight:500; letter-spacing:-0.012em; line-height:1.08; }
      .bofs-display-xl { font-weight:500; letter-spacing:-0.018em; line-height:1.02; }
      .bofs-display-sm { font-weight:500; letter-spacing:-0.006em; line-height:1.18; }
      .bofs-hand { font-family:${HAND}; }
      /* long Icelandic compounds orphan easily; balance headings, pretty leads */
      .bofs-balance { text-wrap:balance; }
      .bofs-pretty { text-wrap:pretty; }
      /* one statement style, reused as each page's single large gesture */
      .bofs-statement { font-family:${DISPLAY}; color:${C.cocoa}; font-weight:500; font-size:clamp(24px,3.6vw,38px); line-height:1.2; letter-spacing:-0.012em; }
      .bofs-num { font-variant-numeric:tabular-nums; font-feature-settings:'tnum' 1; }
      /*
       * HOVER LANGUAGE (one system, 2026-09-17). A link draws its underline
       * from the left in 320ms on a strong ease-out; a painting or photo
       * inside a link lifts 4px; a button deepens and presses. Hover only on
       * devices that hover; every transition is transform, opacity or a
       * background-size, and reduced motion collapses them to instant.
       */
      .bofs-way {
        text-decoration:none; padding-bottom:2px;
        background-image:linear-gradient(currentColor, currentColor);
        background-size:0% 2px; background-position:0 100%; background-repeat:no-repeat;
        transition:background-size .32s cubic-bezier(.23,1,.32,1), color .2s ease-out;
      }
      .bofs-way-nav { background-position:0 calc(100% - 5px); }
      @media (hover:hover) and (pointer:fine) {
        .bofs-way:hover, .group:hover .bofs-way, a:hover .bofs-way { background-size:100% 2px; }
        .group:hover .bofs-way-ink { color:${C.clayText}; }
        .bofs-pic { transition:transform .45s cubic-bezier(.23,1,.32,1); }
        .group:hover .bofs-pic { transform:translateY(-4px); }
        .bofs-btn { transition:transform .18s cubic-bezier(.23,1,.32,1), filter .18s ease-out; }
        .bofs-btn:hover { transform:translateY(-1px); filter:brightness(.94) saturate(1.06); }
      }
      .group:focus-visible .bofs-way, .bofs-way:focus-visible { background-size:100% 2px; }
      /*
       * ONE STICKY ROW. On the long pages the section line takes the
       * header's slot: the header slides up as the line slides down, so
       * there is never a bar stacked on a bar.
       */
      .bofs-header { transition:transform .34s cubic-bezier(.23,1,.32,1); }
      html[data-bofs-sub="on"] .bofs-header { transform:translateY(-100%); }

      /*
       * PAGE CHANGES. The old page lifts away for 220ms, the new one rises
       * in over 460ms. The header is outside both, so it stays put.
       */
      .bofs-root > main, .bofs-root > footer { animation:bofs-enter .46s cubic-bezier(.23,1,.32,1) both; }
      @keyframes bofs-enter { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
      html[data-bofs-leaving] .bofs-root > main, html[data-bofs-leaving] .bofs-root > footer {
        animation:none; opacity:0; transform:translateY(-8px);
        transition:opacity .22s ease-in, transform .22s ease-in;
      }
      /*
       * THE OPENING (2026-09-17). The painting settles from a slight zoom
       * and a cream veil over 2.4s; the headline rises line by line from
       * behind its own mask; the kicker, lead and button follow. Runs once
       * per visit to the hero. Reduced motion shows everything at once.
       */
      .bofs-open-scene { animation:bofs-open-scene 2.4s cubic-bezier(.16,1,.3,1) both; }
      @keyframes bofs-open-scene { from { opacity:.0; transform:scale(1.07); filter:saturate(.6); } to { opacity:1; transform:none; filter:none; } }
      .bofs-open-line { display:block; overflow:hidden; padding:.14em 0 .1em; margin:-.14em 0 -.1em; }
      .bofs-open-line > span { display:block; animation:bofs-open-rise 1.15s cubic-bezier(.16,1,.3,1) both; }
      @keyframes bofs-open-rise { from { transform:translateY(112%); } to { transform:none; } }
      .bofs-open-settle { animation:bofs-open-scene 1.5s cubic-bezier(.16,1,.3,1) .15s both; }
      .bofs-open-fade { animation:bofs-open-fade .9s cubic-bezier(.16,1,.3,1) both; }
      @keyframes bofs-open-fade { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }

      @media (prefers-reduced-motion: reduce) {
        .bofs-open-scene, .bofs-open-settle, .bofs-open-line > span, .bofs-open-fade { animation:none; }
        .bofs-header { transition:none; }
        .bofs-root > main, .bofs-root > footer { animation:bofs-fade .2s linear both; }
        @keyframes bofs-fade { from { opacity:0; } to { opacity:1; } }
        html[data-bofs-leaving] .bofs-root > main, html[data-bofs-leaving] .bofs-root > footer { transform:none; transition:opacity .12s linear; }
        .bofs-way, .bofs-pic, .bofs-btn { transition:none; }
        .group:hover .bofs-pic { transform:none; }
      }
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
      /*
       * PERF (2026-09-17): the tooth used to be a ::before on every band with
       * mix-blend-mode, which made the browser re-blend a full-width layer
       * against the page on every scroll frame (21 blended layers on the
       * landing page). It is now painted into the band's own background with
       * background-blend-mode, which is resolved once when the band is
       * painted. Same look, no compositing cost. !important because the
       * bands set their colour with an inline background shorthand.
       */
      .bofs-wash {
        position:relative;
        background-image:${PAPER} !important; background-size:220px 220px !important;
        background-blend-mode:multiply !important;
      }

      /* pigment pools toward one part of the paper instead of filling a
         rectangle evenly; two soft blooms, never a hard boundary */
      /* blooms retired with the blended layers: kept as a no-op class */
      .bofs-bloom { position:relative; }

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
      /* edge darkening removed: it was a second blended layer per painting */

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
       *
       * One exception, asked for by name on 2026-09-17: the hero mist. A pair
       * of soft cream pools that drift 4% across the valley floor over 46
       * seconds. It is a single composited layer (transform only; the blur is
       * rasterised once), it is invisible as motion unless you watch for it,
       * and it stops under reduced motion. Nothing else on the site loops.
       */
      .bofs-mist {
        position:absolute; left:-24%; right:-24%; top:36%; height:28%; pointer-events:none; opacity:.42;
        background:
          radial-gradient(56% 100% at 28% 55%, rgba(251,243,231,.7), rgba(251,243,231,.28) 38%, rgba(251,243,231,0) 72%),
          radial-gradient(48% 100% at 74% 50%, rgba(251,243,231,.6), rgba(251,243,231,.22) 38%, rgba(251,243,231,0) 72%);
        animation:bofs-mist 46s cubic-bezier(.45,0,.55,1) infinite alternate;
      }
      @keyframes bofs-mist { from { transform:translate3d(-4%,0,0); } to { transform:translate3d(4%,1.5%,0); } }
      @media (prefers-reduced-motion: reduce) {
        .bofs-faq { transition:none !important; }
        .bofs-mist { animation:none; }
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
  'bofs-focus bofs-press bofs-btn inline-flex items-center justify-center gap-2 rounded-[6px] px-5 py-3 text-[15px] font-semibold'

function btnStyle(variant: BtnProps['variant']) {
  switch (variant) {
    case 'soft':
      return { background: '#fff', color: C.cocoa, boxShadow: 'inset 0 0 0 1px ' + C.line }
    case 'ghost':
      return { background: 'transparent', color: C.clayText, boxShadow: 'inset 0 0 0 1px ' + C.line }
    case 'deep':
      return { background: C.sun, color: '#3A2410' }
    case 'primary':
    default:
      // flat. A public service button is a button, not a pillow.
      return { background: C.clay, color: '#FFF6EC' }
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
    <header className="bofs-header fixed inset-x-0 top-0 z-50">
      {/* A plain bar the full width of the page, the way bris.se and
          barneombudet.no do it: opaque, a hairline underneath, nothing
          floating. The floating glass pill was the first thing that said
          "generated". */}
      <div
        className="flex h-16 items-center justify-between gap-4 px-5 sm:px-8"
        style={{ background: C.cream, boxShadow: `inset 0 -1px 0 ${scrolled ? C.line : 'rgba(231,214,188,.55)'}` }}
      >
        <Link to="/preview/bofs" className="bofs-focus shrink-0 rounded-2xl" aria-label="Barna- og fjölskyldustofa">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex">
          <div className="relative" ref={servicesRef}>
            <button
              type="button"
              className="bofs-focus group flex items-center gap-1.5 rounded px-3.5 py-2 text-[14.5px] font-semibold"
              style={{ color: C.cocoa }}
              aria-haspopup="true"
              aria-expanded={services}
              onClick={() => setServices((v) => !v)}
            >
              <span className="bofs-way bofs-way-nav" style={{ backgroundSize: services ? '100% 2px' : undefined }}>
                {pick(UI.nav.services)}
              </span>
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
                  style={{ transformOrigin: 'top left', background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}` }}
                  className="absolute left-0 top-[calc(100%+12px)] grid w-[520px] grid-cols-2 gap-1 rounded-[10px] p-3"
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
                          className="bofs-focus group flex items-center gap-2.5 rounded-[6px] px-3 py-2 transition-colors duration-150 hover:bg-[#F6EAD7]"
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
              className="bofs-focus group rounded px-3.5 py-2 text-[14.5px] font-semibold"
              style={{ color: C.cocoa }}
            >
              <span className="bofs-way bofs-way-nav" style={{ backgroundSize: isActive(l.to) ? '100% 2px' : undefined }}>
                {l.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="tel:112"
            className="bofs-focus bofs-press bofs-btn hidden items-center gap-1.5 rounded-[6px] px-3.5 py-2 text-[13.5px] font-bold sm:inline-flex"
            style={{ background: '#A83A24', color: '#fff' }}
          >
            <PhoneGlyph /> {pick(UI.emergencyChip)}
          </a>
          <span className="hidden sm:block">
            <LangToggle lang={lang} setLang={setLang} />
          </span>
          <button
            type="button"
            className="bofs-focus grid h-10 w-10 place-items-center rounded-[6px] xl:hidden"
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
            className="max-h-[80vh] overflow-y-auto p-3 xl:hidden"
            style={{ background: C.cream, boxShadow: `inset 0 -1px 0 ${C.line}` }}
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

export function Footer({ bare = false }: { bare?: boolean }) {
  const [, , pick] = useLang()
  const homes = SERVICES.filter((s) => s.category === 'heimili')
  const services = SERVICES.filter((s) => s.category === 'thjonusta')
  return (
    <footer className="relative" style={{ background: bare ? 'transparent' : C.deep, color: C.deepText }}>
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
              className="bofs-focus bofs-btn bofs-press mt-5 inline-flex items-center gap-2 rounded-[6px] px-3.5 py-2 text-[13.5px] font-bold"
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
                    <Link to={`/preview/bofs/${s.slug}`} className="bofs-focus bofs-way inline-block rounded py-1" style={{ color: '#DCCCBA' }}>
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
                    <Link to={`/preview/bofs/${s.slug}`} className="bofs-focus bofs-way inline-block rounded py-1" style={{ color: '#DCCCBA' }}>
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
                    <Link to={l.to} className="bofs-focus bofs-way inline-block rounded py-1" style={{ color: '#DCCCBA' }}>
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
                <a className="bofs-focus bofs-way inline-block rounded py-1" href={`tel:${ORG.phone.replace(/\s/g, '')}`}>
                  {ORG.phone}
                </a>
              </li>
              <li>
                <a className="bofs-focus bofs-way inline-block rounded py-1" href={`mailto:${ORG.email}`}>
                  {ORG.email}
                </a>
              </li>
            </ul>
            <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: 'rgba(246,232,213,.6)' }}>
              {pick(ORG.hours)}
            </p>
            <IslandLink to={ISLAND.home} onDeep className="mt-4 text-[14px]" />
            <a href="tel:1717" className="bofs-focus bofs-way mt-4 inline-block rounded py-1 text-[13.5px] leading-relaxed" style={{ color: '#C8B6A5' }}>
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

/**
 * The hand-off to island.is. Always the same: a line link that names where
 * it goes, opens the official page in a new tab and says so to a screen
 * reader. Used wherever a visitor needs more than this site's summary.
 */
export function IslandLink({
  to,
  onDeep = false,
  button = false,
  className = '',
}: {
  to: { href: string; label: L }
  onDeep?: boolean
  /** forms, applications and reports: a real button, not a text link */
  button?: boolean
  className?: string
}) {
  const [, , pick] = useLang()
  const sr = <span className="sr-only"> {pick({ is: '(opnast á island.is í nýjum flipa)', en: '(opens on island.is in a new tab)' })}</span>
  if (button)
    return (
      <a href={to.href} target="_blank" rel="noopener noreferrer" className={`${btnBase} ${className}`} style={btnStyle('primary')}>
        {pick(to.label)}
        {sr}
      </a>
    )
  return (
    <a
      href={to.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`bofs-focus group inline-block rounded text-[15px] font-semibold ${className}`}
      style={{ color: onDeep ? C.sunOnDeep : C.clayText }}
    >
      <span className="bofs-way">{pick(to.label)}</span>
      {sr}
    </a>
  )
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── torn paper seam between colour fields ────────────────────────────── */

const TORN = (() => {
  const pts: string[] = []
  let x = 0
  let seed = 7
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
  while (x < 1440) {
    pts.push(`L${x.toFixed(0)} ${(6 + rnd() * 16).toFixed(1)}`)
    x += 14 + rnd() * 30
  }
  return `M0 28 L0 12 ${pts.join(' ')} L1440 10 L1440 28 Z`
})()

/** Sits at the top of a band, filled with that band's colour, and tears into the band above. */
export function Torn({ color, className = '' }: { color: string; className?: string }) {
  return (
    <svg className={`block h-6 w-full sm:h-7 ${className}`} viewBox="0 0 1440 28" preserveAspectRatio="none" aria-hidden="true">
      <path d={TORN} fill={color} />
    </svg>
  )
}

/* ── the opening of every inner page ─────────────────────────────────────── */

/**
 * A plain breadcrumb line, the page title, the lead, and whatever links the
 * page needs. Left aligned, no pill, no arrow, no entrance animation.
 */
export function PageHead({
  crumb,
  title,
  lead,
  children,
  wide = false,
}: {
  crumb: string
  title: ReactNode
  lead?: ReactNode
  children?: ReactNode
  wide?: boolean
}) {
  const [, , pick] = useLang()
  return (
    <div className={`mx-auto px-5 pb-12 pt-28 sm:px-8 sm:pt-32 ${wide ? 'max-w-6xl' : 'max-w-4xl'}`}>
      <nav aria-label={pick({ is: 'Brauðmolar', en: 'Breadcrumb' })} className="text-[14px]" style={{ color: C.body }}>
        <Link to="/preview/bofs" className="bofs-focus group rounded">
          <span className="bofs-way">{pick({ is: 'Forsíða', en: 'Home' })}</span>
        </Link>
        <span aria-hidden="true" className="mx-2">/</span>
        <span aria-current="page" style={{ color: C.cocoa }}>
          {crumb}
        </span>
      </nav>
      {typeof title === 'string' ? (
        <WordReveal as="h1" soft base={0.05} text={title} className="bofs-display bofs-display-xl bofs-balance mt-6 max-w-3xl text-[clamp(36px,5.6vw,64px)]" />
      ) : (
        <h1 className="bofs-display bofs-display-xl bofs-balance mt-6 max-w-3xl text-[clamp(36px,5.6vw,64px)]">{title}</h1>
      )}
      {lead && (
        <p className="bofs-pretty bofs-open-fade mt-6 max-w-2xl text-[18px] leading-relaxed" style={{ color: C.cocoa, animationDelay: '.35s' }}>
          {lead}
        </p>
      )}
      {children && (
        <div className="bofs-open-fade mt-6 flex flex-wrap items-center gap-x-8 gap-y-3" style={{ animationDelay: '.5s' }}>
          {children}
        </div>
      )}
    </div>
  )
}

export function Eyebrow({ children, color = C.clayText }: { children: ReactNode; color?: string }) {
  return (
    <span className="inline-block text-[14px] font-semibold" style={{ color }}>
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
        <p className="bofs-pretty mt-4 text-[17px] leading-relaxed" style={{ color: onDeep ? 'rgba(246,232,213,.85)' : C.cocoa }}>
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

/*
 * A cell in a hairline grid, not a card. ivykids.com sets its programmes as
 * cells divided by 1px lines with one photograph occupying a cell of its
 * own; the eye reads one table of offerings instead of six boxes. The
 * painting sits inside the cell as a picture, the kind is a small coloured
 * tag, and the whole cell is the link.
 */
export function ServiceCard({ service, index = 0 }: { service: Service; index?: number; ground?: string }) {
  const [, , pick] = useLang()
  void index
  return (
    <Link to={`/preview/bofs/${service.slug}`} className="bofs-focus group block rounded">
      <span className="bofs-wet bofs-pic block">
        <img
          src={asset(`card-${service.art}.jpg`)}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          width={640}
          height={400}
          className="bofs-photo block aspect-[16/10] w-full object-cover"
          style={{ objectPosition: CARD_CROP[service.art] ?? 'center 55%' }}
        />
      </span>
      <span className="mt-4 block text-[12.5px] font-semibold uppercase tracking-[0.06em]" style={{ color: C.clayText }}>
        {pick(service.kind)}
      </span>
      <span className="bofs-display bofs-display-sm bofs-way bofs-way-ink mt-1 inline-block text-[26px]">{service.name}</span>
      <span className="mt-2 block text-[15.5px] leading-relaxed" style={{ color: C.cocoa }}>
        {pick(service.card)}
      </span>
    </Link>
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

/* ── the header's second line (the two long pages) ────────────────────── */

/*
 * A page's own sections, as a second line of the header. It is not a pill
 * in the page: it sits directly under the header bar, same cream, one
 * hairline, and it slides down from behind the bar once the reader has
 * scrolled past the page's opening, as if the header grew a line. The
 * current section is underlined with the same drawn line as every other
 * link on the site.
 */
export function SubNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? '')
  const [shown, setShown] = useState(false)
  const reduce = useReducedMotion()
  const idKey = sections.map((s) => s.id).join('|')

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
    if (!els.length) return
    const spy = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-42% 0px -52% 0px', threshold: [0, 0.2, 0.5, 1] },
    )
    els.forEach((el) => spy.observe(el))
    // shown once the first section's top passes the header line. A boolean
    // that only changes twice per page visit, so the listener never causes
    // a render on an ordinary scroll frame.
    const first = els[0]
    const onScroll = () => setShown(first.getBoundingClientRect().top <= 120)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      spy.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idKey])

  useEffect(() => {
    const root = document.documentElement
    if (shown) root.dataset.bofsSub = 'on'
    else delete root.dataset.bofsSub
    return () => {
      delete root.dataset.bofsSub
    }
  }, [shown])

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[60]"
      initial={false}
      animate={{ y: shown ? 0 : '-100%', opacity: shown ? 1 : 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
      style={{ background: C.cream, boxShadow: `inset 0 -1px 0 ${C.line}`, pointerEvents: shown ? 'auto' : 'none' }}
      aria-hidden={!shown}
    >
      <div className="flex h-14 items-center gap-5 px-5 sm:px-8">
      <Link to="/preview/bofs" className="bofs-focus shrink-0 rounded" aria-label="Barna- og fjölskyldustofa" tabIndex={shown ? 0 : -1}>
        <img src={LOGO} width={28} height={28} alt="" aria-hidden="true" className="h-7 w-7" />
      </Link>
      <nav className="no-scrollbar flex min-w-0 flex-1 gap-6 overflow-x-auto" aria-label="On this page">
        {sections.map((s) => {
          const on = active === s.id
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="bofs-focus group shrink-0 py-2 text-[13.5px] font-semibold"
              style={{ color: on ? C.clayText : C.cocoa }}
              aria-current={on ? 'true' : undefined}
              tabIndex={shown ? 0 : -1}
            >
              <span className="bofs-way" style={{ backgroundSize: on ? '100% 2px' : undefined }}>
                {s.label}
              </span>
            </a>
          )
        })}
      </nav>
      <a
        href="tel:112"
        className="bofs-focus bofs-btn bofs-press shrink-0 rounded-[6px] px-3 py-1.5 text-[13px] font-bold"
        style={{ background: '#A83A24', color: '#fff' }}
        tabIndex={shown ? 0 : -1}
      >
        112
      </a>
      </div>
    </motion.div>
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

/* ── hand-drawn marks and word-by-word reveals ─────────────────────────────
 * A headline arrives word by word, each word settling from a soft blur, and
 * its key word is then marked by hand: a pencil underline, once or twice,
 * drawn once as a stroke. The strokes are hand-drawn paths with a slight
 * wobble and tapering ends, not geometric lines. Runs once when the line
 * comes into view; reduced motion shows the finished state.
 */

export const EASE = [0.16, 1, 0.3, 1] as const

export function HandMark({ kind, color, delay = 0 }: { kind: 'underline' | 'double'; color: string; delay?: number }) {
  const reduce = useReducedMotion()
  // Filled swashes, not stroked lines: thin at both ends, fuller in the
  // middle, with a slight rise to the right, like a soft pencil pressed
  // harder mid-stroke. They sit below the descenders (j, p, g) and wipe in
  // from the left. The parent span is the observed element; only the inner
  // svg is clipped, so the in-view check still fires.
  const swashes =
    kind === 'underline'
      ? ['M3 13.6 C 62 10.4, 168 11.6, 297 6.8 C 214 11.6, 96 16.4, 3 14.8 Z']
      : ['M3 8.6 C 62 5.6, 168 7, 297 3 C 214 7.4, 96 11.2, 3 9.8 Z', 'M40 19.6 C 94 17, 176 18, 268 14.8 C 200 18.8, 110 21.6, 40 20.6 Z']
  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute left-[1%] top-full block h-[.26em] w-[99%]"
      initial={reduce ? false : 'hidden'}
      whileInView="shown"
      viewport={{ once: true, amount: 0.6 }}
    >
      {swashes.map((d, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 300 24"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible"
          variants={{ hidden: { clipPath: 'inset(0 100% 0 0)' }, shown: { clipPath: 'inset(0 0% 0 0)' } }}
          transition={{ duration: i === 0 ? 0.7 : 0.5, delay: delay + i * 0.55, ease: [0.65, 0, 0.35, 1] }}
        >
          <path d={d} fill={color} />
        </motion.svg>
      ))}
    </motion.span>
  )
}

/** Words settle into place one after another; `mark` gets a hand-drawn stroke. */
export function WordReveal({
  text,
  mark,
  markKind = 'underline',
  markColor,
  as: Tag = 'p',
  className = '',
  style,
  base = 0,
  soft = false,
}: {
  text: string
  mark?: string
  markKind?: 'underline' | 'double'
  markColor?: string
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span'
  className?: string
  style?: CSSProperties
  base?: number
  /** The quieter sub-page version: no blur, shorter rise, tighter stagger. */
  soft?: boolean
}) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  const markWords = mark ? mark.split(' ') : []
  const markStart = mark ? words.findIndex((_, i) => words.slice(i, i + markWords.length).join(' ') === mark) : -1
  const nodes: ReactNode[] = []
  let i = 0
  while (i < words.length) {
    const isMark = i === markStart
    const chunk = isMark ? words.slice(i, i + markWords.length) : [words[i]]
    const delay = base + i * (soft ? 0.04 : 0.055)
    const inner = (
      <motion.span
        className="inline-block"
        initial={reduce ? false : soft ? { opacity: 0, y: '0.22em' } : { opacity: 0, y: '0.32em', filter: 'blur(6px)' }}
        whileInView={soft ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, delay, ease: EASE }}
      >
        {chunk.join(' ')}
      </motion.span>
    )
    nodes.push(
      <span key={i} className={isMark ? (markKind === 'double' ? 'relative mb-[.3em] inline-block' : 'relative mb-[.2em] inline-block') : 'inline-block'}>
        {inner}
        {isMark && markColor && <HandMark kind={markKind} color={markColor} delay={delay + 0.45} />}
      </span>,
    )
    if (i + chunk.length < words.length) nodes.push(' ')
    i += chunk.length
  }
  return (
    <Tag className={className} style={style}>
      {nodes}
    </Tag>
  )
}
