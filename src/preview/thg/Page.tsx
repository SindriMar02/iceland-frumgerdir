import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import Lenis from 'lenis'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  IMG, ADDRESS, PHONE_DISPLAY, PHONE_HREF, EMAIL, EMAIL_HREF, KT, MAP_LINK,
  PRACTICE, THESIS_QUOTES, CODENAME, TAGLINE, PROJECTS, INTERIORS,
  TVENNS_KONAR, KOLASUNDID, PAGE_TITLE, PAGE_DESCRIPTION, JSON_LD,
} from './data'
import type { Project } from './data'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)
CustomEase.create('thgOut', '0.25,1,0.5,1')
CustomEase.create('thgIn', '0.5,0,0.75,0')
CustomEase.create('thgInOut', '0.75,0,0.25,1')
CustomEase.create('thgJourney', '0.25,0,0.75,1')

const company = getPreviewCompany('thg')

/* ── THG Arkitektar — "Staðarandi" ───────────────────────────────────────
   Design system transplanted from the era-residence.com teardown (the
   MECHANICS only — fluid canvas, self-theming chrome, six reveal
   primitives, horizontal journey). Surface is entirely THG's own: concrete
   and graphite, two grotesk faces, colour drawn only from the seven
   projects' own photography. No arches, no Didone, no gold-on-black.

   Judged by architects. Restraint over decoration, always. ──────────────── */

const CONCRETE = '#E8E6E1'
const GRAPHITE = '#1C1D1F'
const INK = '#16181A'
const MUTED = '#5A5E62'
const BRICK = '#A8412A'
const PAPER = '#E8E6E1'
const PAPER_MUTED = '#A7A6A3'

const DISPLAY = "'THG Apfel', 'Helvetica Neue', Arial, sans-serif"
const BODY = "'THG Switzer', 'Helvetica Neue', Arial, sans-serif"
const FONTS_APFEL = `${import.meta.env.BASE_URL}fonts/apfel/`
const FONTS_SWITZER = `${import.meta.env.BASE_URL}fonts/switzer/`

/* Duration ladder + easing — BRIEF §5.3 / era teardown Phase 6, verbatim. */
const DUR = { s: 0.4, m: 0.8, l: 1.2 }
const EASE = { out: 'thgOut', in: 'thgIn', inout: 'thgInOut' }

const FOCUS_CLASS = 'thg-focus-ring'

/* ── Per-project themes — each ground colour was sampled from that
   building's OWN photograph (median-cut quantisation of the actual JPEG,
   picked for the most distinct swatch), then nudged to clear WCAG AA
   against its paired text colour. Verified ratios (relative-luminance
   formula, computed 2026-07-27):

     borg       ground #2E1911  text #E8E6E1 (paper)  → 13.33:1  AAA
     marina     ground #23302F  text #E8E6E1 (paper)  → 10.97:1  AAA
     konsulat   ground #E4E7EA  text #16181A (ink)     → 14.34:1  AAA
     von        ground #DEDDD9  text #16181A (ink)     → 13.10:1  AAA
     eir        ground #EDE7DB  text #16181A (ink)     → 14.46:1  AAA
     hrafnista  ground #E3E5EA  text #16181A (ink)     → 14.12:1  AAA
     saavik     ground #E6E1D2  text #16181A (ink)     → 13.62:1  AAA

   Each theme's small saturated "accent" (a genuine colour lifted straight
   from that project's own photo) is DECORATIVE ONLY — underlines, dots,
   the field-label rule — never body text; see contrast notes inline. ──── */
const THEME_CSS = `
.thg-root [data-thg-theme="concrete"] { --thg-bg:${CONCRETE}; --thg-fg:${INK}; --thg-fg-muted:${MUTED}; --thg-focus:${BRICK}; --thg-accent:${BRICK}; }
.thg-root [data-thg-theme="graphite"] { --thg-bg:${GRAPHITE}; --thg-fg:${PAPER}; --thg-fg-muted:${PAPER_MUTED}; --thg-focus:${PAPER}; --thg-accent:${BRICK}; }
.thg-root [data-thg-theme="borg"]      { --thg-bg:#2E1911; --thg-fg:#E8E6E1; --thg-fg-muted:#B9B7B2; --thg-focus:#E8E6E1; --thg-accent:#C79A5B; }
.thg-root [data-thg-theme="marina"]    { --thg-bg:#23302F; --thg-fg:#E8E6E1; --thg-fg-muted:#B9B7B2; --thg-focus:#E8E6E1; --thg-accent:#B36E5C; }
.thg-root [data-thg-theme="konsulat"]  { --thg-bg:#E4E7EA; --thg-fg:#16181A; --thg-fg-muted:#5A5E62; --thg-focus:${BRICK}; --thg-accent:#6B7480; }
.thg-root [data-thg-theme="von"]       { --thg-bg:#DEDDD9; --thg-fg:#16181A; --thg-fg-muted:#5A5E62; --thg-focus:${BRICK}; --thg-accent:#8C8A82; }
.thg-root [data-thg-theme="eir"]       { --thg-bg:#EDE7DB; --thg-fg:#16181A; --thg-fg-muted:#5A5E62; --thg-focus:${BRICK}; --thg-accent:#C1642A; }
.thg-root [data-thg-theme="hrafnista"] { --thg-bg:#E3E5EA; --thg-fg:#16181A; --thg-fg-muted:#5A5E62; --thg-focus:${BRICK}; --thg-accent:#4C74A8; }
.thg-root [data-thg-theme="saavik"]    { --thg-bg:#E6E1D2; --thg-fg:#16181A; --thg-fg-muted:#5A5E62; --thg-focus:${BRICK}; --thg-accent:#8C8355; }
.thg-root [data-thg-theme] { background: var(--thg-bg); color: var(--thg-fg); }
`

const PAGE_STYLES = `
@font-face { font-family:'THG Apfel'; src:url('${FONTS_APFEL}ApfelGrotezk-Regular.woff2') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
@font-face { font-family:'THG Apfel'; src:url('${FONTS_APFEL}ApfelGrotezk-Mittel.woff2') format('woff2'); font-weight:500; font-style:normal; font-display:swap; }
@font-face { font-family:'THG Apfel'; src:url('${FONTS_APFEL}ApfelGrotezk-Fett.woff2') format('woff2'); font-weight:700; font-style:normal; font-display:swap; }
@font-face { font-family:'THG Switzer'; src:url('${FONTS_SWITZER}Switzer-Regular.woff2') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
@font-face { font-family:'THG Switzer'; src:url('${FONTS_SWITZER}Switzer-Medium.woff2') format('woff2'); font-weight:500; font-style:normal; font-display:swap; }
@font-face { font-family:'THG Switzer'; src:url('${FONTS_SWITZER}Switzer-Semibold.woff2') format('woff2'); font-weight:600; font-style:normal; font-display:swap; }
@font-face { font-family:'THG Switzer'; src:url('${FONTS_SWITZER}Switzer-Bold.woff2') format('woff2'); font-weight:700; font-style:normal; font-display:swap; }

/* ═══ 1 — THE FLUID CANVAS (era teardown Phase 2.1 / BRIEF §5.1) ═══════════
   Mathematically identical to "html{font-size:1vw}" + calc(Nrem/ratio) —
   1rem at that font-size literally equals 1vw, so calc(Nrem/ratio) always
   reduces to (N/ratio)vw. Expressing it directly in vw lets the fluid
   canvas stay SCOPED to .thg-root instead of overwriting the shared
   <html> font-size for every other route in this app. */
.thg-root {
  --thg-ratio: 16;   /* desktop canvas: 1600px */
  --thg-u4:  calc(4  * 1vw / var(--thg-ratio));
  --thg-u8:  calc(8  * 1vw / var(--thg-ratio));
  --thg-u12: calc(12 * 1vw / var(--thg-ratio));
  --thg-u16: calc(16 * 1vw / var(--thg-ratio));
  --thg-u24: calc(24 * 1vw / var(--thg-ratio));
  --thg-u32: calc(32 * 1vw / var(--thg-ratio));
  --thg-u48: calc(48 * 1vw / var(--thg-ratio));
  --thg-u64: calc(64 * 1vw / var(--thg-ratio));
  --thg-u96: calc(96 * 1vw / var(--thg-ratio));
  --thg-u160: calc(160 * 1vw / var(--thg-ratio));
  --thg-gutter: var(--thg-u48);
  --thg-chrome-fg: ${PAPER};
}
@media (min-width: 768px) and (max-width: 991px) { .thg-root { --thg-ratio: 8.34; --thg-gutter: var(--thg-u24); } } /* tablet canvas: 834px */
@media (max-width: 767px) { .thg-root { --thg-ratio: 4.16; --thg-gutter: var(--thg-u24); } } /* mobile canvas: 416px */

.thg-root { font-family: ${BODY}; }
.thg-root ::selection { background: ${INK}; color: ${CONCRETE}; }
.thg-container { padding-inline: var(--thg-gutter); }

${THEME_CSS}

/* ═══ 2 — SELF-THEMING FIXED CHROME (era Phase 5.4 / BRIEF §5.2) ═══════════
   #thg-chrome sits outside every themed section, so it cannot inherit
   --thg-fg by cascade. Page.tsx reads each themed zone's OWN computed
   --thg-fg (the CSS above is the single source of truth) and writes it
   onto --thg-chrome-fg only when the active zone changes — never on every
   scroll tick, so this 0.4s colour transition never fights a per-frame
   write (the "no CSS transition on a scrub-driven property" rule). */
#thg-chrome { color: var(--thg-chrome-fg); transition: color ${DUR.s}s cubic-bezier(.25,1,.5,1); }

/* ═══ 3 — FOCUS — visible on both concrete and graphite grounds ═══════════
   Each theme block above defines --thg-focus to the colour that clears
   3:1 against ITS OWN ground (paper on the dark project/graphite grounds,
   brick on every light one) — see the contrast table in the comment above
   THEME_CSS. */
.thg-root .${FOCUS_CLASS}:focus-visible,
.thg-root .thg-track:focus-visible,
.thg-root a:focus-visible,
.thg-root button:focus-visible {
  outline: 2px solid var(--thg-focus, ${BRICK});
  outline-offset: 3px;
  border-radius: 1px;
}

/* ═══ 4 — SIX REVEAL PRIMITIVES, era Phase 5.7 / BRIEF §5.3 ════════════════
   Every element below keeps its ORDINARY resting layout in plain CSS —
   there is no opacity:0 default anywhere on this page. JS (inside a
   prefers-reduced-motion:no-preference matchMedia branch) calls
   gsap.from(el, hiddenState) which briefly sets an inline "from" style and
   animates BACK to the element's natural computed style. If JS never runs,
   or a crawler/screenshot service renders before ScrollTrigger fires, the
   element is simply sitting at its normal, fully visible layout — nothing
   to "clear". A 2s failsafe (Page(), below) additionally clears any
   leftover inline reveal styles as a backstop against a stuck mid-tween
   frame. Icelandic accents (þ/ð/á/é/í/ó/ú/ý/æ/ö) get line-height ≥1.22 on
   every char-split element so ascenders/accents are never guillotined by
   the SplitText line mask. */
.thg-chars { line-height: 1.22 !important; }
/* SplitText char elements MUST stay inline-block. GSAP's own mask option
   emits block-level wrappers in this version, which stacks every character
   on its own line, so the per-character mask is done here instead. */
.thg-char {
  display: inline-block;
  vertical-align: top;
  will-change: transform, opacity;
}
/* Keeps each word atomic so a line never breaks between two characters. */
.thg-word { display: inline-block; white-space: nowrap; vertical-align: top; }
.thg-hero-h1 > div, .thg-hero-h1 > span,
[data-thg-reveal='h'] > div, [data-thg-reveal='h'] > span { display: inline-block; vertical-align: top; }
.thg-lines { line-height: 1.5; }

/* ═══ 5 — THE APERTURE SHUTTER (BRIEF §6.1 / era §3 "shutter reveal") ═════
   Resting state (no JS): both panels are already retracted to zero width —
   the photo and the hero copy are fully visible from the very first
   paint. JS sets an inline "from" clip-path that covers each half and
   converges them at the centre seam, then animates BACK to this resting
   inset(...) value — the shutter opens toward what was already there. */
.thg-shutter { position: absolute; inset: 0; background: ${GRAPHITE}; pointer-events: none; }
.thg-shutter-left  { clip-path: inset(0 100% 0 0); }
.thg-shutter-right { clip-path: inset(0 0 0 100%); }
.thg-hero-frame { position: absolute; inset: 0; overflow: hidden; }
.thg-hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transform-origin: 50% 62%; }

/* ═══ 6 — THE HORIZONTAL JOURNEY (BRIEF §6.3) ══════════════════════════════
   Base state (mobile AND prefers-reduced-motion:reduce): a plain
   scroll-snap swipe rail — never a scroll-jack, never pinned. Same seven
   panels, same DOM order, real focusable content, screen-reader-linear.
   Promoted to the pinned era-style journey ONLY at >=992px AND
   prefers-reduced-motion:no-preference. */
.thg-journey { position: relative; }
.thg-track {
  display: flex; overflow-x: auto; overflow-y: hidden;
  scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.thg-track::-webkit-scrollbar { display: none; }
.thg-panel { flex: 0 0 88vw; scroll-snap-align: start; min-height: 78svh; }
@media (min-width: 480px) { .thg-panel { flex-basis: 62vw; } }
.thg-journey-label { padding: var(--thg-u32) var(--thg-gutter) var(--thg-u16); }
.thg-progress { display: none; }

@media (min-width: 992px) and (prefers-reduced-motion: no-preference) {
  .thg-journey { height: 100svh; overflow: hidden; }
  .thg-track {
    position: relative; overflow: visible; scroll-snap-type: none;
    width: max-content; height: 100svh; align-items: stretch;
    will-change: transform; backface-visibility: hidden;
  }
  .thg-panel { flex: none; width: 100vw; height: 100svh; min-height: 0; scroll-snap-align: none; }
  .thg-journey-label {
    position: absolute; left: 0; bottom: 0; z-index: 5; pointer-events: none;
    padding: 0 var(--thg-gutter) var(--thg-u32);
  }
  .thg-progress {
    display: block; position: absolute; left: 0; right: 0; bottom: 0; z-index: 6;
    height: 3px; transform-origin: left center; transform: scaleX(0);
    background: ${BRICK};
  }
}

/* ═══ 7 — Reduced motion: neutralise anything decorative that remains ═════ */
@media (prefers-reduced-motion: reduce) {
  .thg-hero-img { transform: none !important; }
}

/* ═══ 8 — Misc furniture ════════════════════════════════════════════════ */
.thg-rule { height: 1px; width: 100%; transform-origin: left center; }
.thg-field-row + .thg-field-row { border-top-width: 1px; }
.thg-diagram-path { fill: none; stroke-width: 1.5; }
`

/* ═══════════════════════════ small helpers ════════════════════════════ */
function Kicker({ children, tone }: { children: React.ReactNode; tone?: string }) {
  return (
    <p
      className="m-0 text-[11px] font-medium uppercase tracking-[0.24em]"
      style={{ fontFamily: BODY, color: tone ?? 'var(--thg-fg-muted)' }}
    >
      {children}
    </p>
  )
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div data-thg-reveal="c" className="thg-container pt-16 md:pt-20">
      <div aria-hidden className="thg-rule mb-4" style={{ background: 'var(--thg-fg)', opacity: 0.18 }} />
      <Kicker>{eyebrow}</Kicker>
      <h2
        data-thg-reveal="h"
        className="thg-chars m-0 mt-3"
        style={{ fontFamily: DISPLAY, fontWeight: 500, color: 'var(--thg-fg)', fontSize: 'clamp(1.9rem,4.4vw,3.4rem)', lineHeight: 1.12, letterSpacing: '-0.01em' }}
      >
        {title}
      </h2>
    </div>
  )
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="thg-field-row flex items-baseline justify-between gap-6 py-2.5" style={{ borderColor: 'color-mix(in srgb, var(--thg-fg) 16%, transparent)' }}>
      <dt className="m-0 text-[11px] font-medium uppercase tracking-[0.18em]" style={{ fontFamily: BODY, color: 'var(--thg-fg-muted)' }}>{label}</dt>
      <dd className="m-0 text-right text-[17px]" style={{ fontFamily: BODY, color: 'var(--thg-fg)' }}>{value}</dd>
    </div>
  )
}

/* ═══════════════════════════ CHROME — the fixed logo + label ═══════════ */
function Chrome() {
  return (
    <div
      id="thg-chrome"
      className="thg-container fixed inset-x-0 top-0 z-40 flex min-h-[56px] items-center justify-between py-3"
    >
      <a
        href="#thg-top"
        className={`inline-flex min-h-[44px] items-center gap-2.5 ${FOCUS_CLASS}`}
        aria-label="Fara efst á síðu, THG Arkitektar"
      >
        <img src={IMG('mark')} alt="" aria-hidden className="h-6 w-6 rounded-sm object-cover md:h-7 md:w-7" />
        <span className="text-[12px] font-medium uppercase tracking-[0.22em]" style={{ fontFamily: BODY }}>
          THG Arkitektar
        </span>
      </a>
      <span aria-hidden className="hidden text-[11px] uppercase tracking-[0.32em] opacity-80 sm:inline" style={{ fontFamily: BODY }}>
        {CODENAME}
      </span>
    </div>
  )
}

/* ═══════════════════════════ 1 · APERTURE (hero) ════════════════════════ */
function Aperture() {
  return (
    <header
      id="thg-top"
      data-thg-theme="graphite"
      className="thg-chrome-zone relative flex min-h-[100svh] items-end overflow-hidden"
    >
      <div className="thg-hero-frame">
        <img
          src={IMG('borg-exterior')}
          alt="Viðbygging Hótel Borgar í Reykjavík, fyrsti áfangi stækkunar hótelsins sem THG Arkitektar hönnuðu."
          className="thg-hero-img"
          loading="eager"
          decoding="async"
          {...{ fetchpriority: 'high' }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          /* The hero photograph is a near-white building against a pale sky, so
             a soft bottom gradient is not enough: the type zone needs a solid
             floor or the eyebrow, H1 and practice line all sit at roughly 1.5:1. */
          style={{ background: 'linear-gradient(180deg, rgba(28,29,31,0) 0%, rgba(22,24,26,.28) 40%, rgba(22,24,26,.80) 68%, rgba(22,24,26,.92) 100%)' }}
        />
      </div>
      <div className="thg-shutter thg-shutter-left" aria-hidden />
      <div className="thg-shutter thg-shutter-right" aria-hidden />

      <div className="thg-container relative z-[1] w-full pb-14 pt-32 md:pb-20">
        <p className="thg-hero-eyebrow m-0 mb-5 text-[11px] font-medium uppercase tracking-[0.3em]" style={{ fontFamily: BODY, color: PAPER_MUTED }}>
          {CODENAME}
        </p>
        <h1
          className="thg-hero-h1 thg-chars m-0 max-w-[18ch]"
          style={{ fontFamily: DISPLAY, fontWeight: 500, color: PAPER, fontSize: 'clamp(2.3rem,6.4vw,5.4rem)', lineHeight: 1.14, letterSpacing: '-0.01em' }}
        >
          {TAGLINE}
        </h1>
        <p
          className="thg-hero-practice m-0 mt-8 text-[15px] uppercase tracking-[0.14em] md:text-[16px]"
          style={{ fontFamily: BODY, color: PAPER_MUTED }}
        >
          1994 · {PRACTICE.staffLine} · ISO 9001:2015
        </p>
      </div>
    </header>
  )
}

/* ═══════════════════════════ 2 · STAÐARANDI (the thesis) ═══════════════ */
function Stadarandi() {
  return (
    <section id="stadarandi" data-thg-theme="concrete" className="thg-chrome-zone relative pb-20 md:pb-28">
      <SectionHead eyebrow="Rökin" title="Staðarandi" />
      <div className="thg-container mt-10 md:mt-14">
        <p data-thg-reveal="p" className="thg-lines m-0 max-w-[46ch] text-[17px] leading-[1.7]" style={{ fontFamily: BODY, color: 'var(--thg-fg)' }}>
          Þrisvar á sínum eigin vef orðar stofan sömu hugsunina, án þess að nefna hana. Verkin sjálf segja hana best.
        </p>
        <ol className="m-0 mt-12 grid list-none gap-10 p-0 md:mt-16 md:grid-cols-3 md:gap-8">
          {THESIS_QUOTES.map((t, i) => (
            <li key={t.project} data-thg-reveal="c">
              <span aria-hidden className="block text-[12px] font-medium tracking-[0.1em]" style={{ fontFamily: BODY, color: BRICK }}>
                0{i + 1}
              </span>
              <div aria-hidden className="thg-rule my-3" style={{ background: 'var(--thg-fg)', opacity: 0.18 }} />
              <blockquote className="m-0">
                <p className="m-0 text-[19px] leading-[1.45]" style={{ fontFamily: DISPLAY, fontWeight: 400, color: 'var(--thg-fg)' }}>
                  „{t.quote}"
                </p>
              </blockquote>
              <cite className="mt-4 block text-[12px] font-medium not-italic uppercase tracking-[0.16em]" style={{ fontFamily: BODY, color: 'var(--thg-fg-muted)' }}>
                {t.project}
              </cite>
              {t.note ? (
                <p className="m-0 mt-1 text-[12px]" style={{ fontFamily: BODY, color: 'var(--thg-fg-muted)' }}>{t.note}</p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ═══════════════════════════ 3 · VERKIN (horizontal journey) ═══════════ */
function ProjectPanel({ project, index }: { project: Project; index: number }) {
  /* Two solid zones, not a gradient-over-photo: the photo stays at full
     strength (this IS the "one large photograph" the brief asks for), and
     the caption plate below is an OPAQUE var(--thg-bg) fill — the exact
     hex this theme's contrast ratio was computed against (see THEME_CSS
     comment above), never a partial-opacity blend that would drift off
     that verified number. */
  return (
    <article
      className="thg-panel relative flex flex-col overflow-hidden"
      data-thg-theme={project.theme}
      aria-label={project.name}
    >
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <img
          src={IMG(project.image)}
          alt={project.alt}
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="thg-container relative shrink-0 py-6 md:py-8" style={{ background: 'var(--thg-bg)' }}>
        <span aria-hidden className="block text-[12px] font-medium tracking-[0.14em]" style={{ fontFamily: BODY, color: 'var(--thg-accent)' }}>
          0{index + 1} / 07
        </span>
        <h3
          data-thg-reveal="h"
          className="thg-chars m-0 mt-3 max-w-[16ch]"
          style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 'clamp(1.6rem,3.4vw,2.5rem)', lineHeight: 1.16 }}
        >
          {project.name}
        </h3>
        <dl className="m-0 mt-5 max-w-[30ch]" data-thg-reveal="c">
          <Field label="Staður" value={project.place} />
          <Field label="Ár" value={project.year} />
          <Field label="Umfang" value={project.size} />
          <Field label="Verkkaupi" value={project.client} />
        </dl>
      </div>
    </article>
  )
}

function Verkin() {
  return (
    <section id="verkin" data-thg-theme="graphite" className="thg-chrome-zone thg-journey">
      {/* DOM order: the heading precedes the rail so reading/keyboard order
          stays "Verkin" then its seven panels on mobile (plain flow); the
          desktop media query lifts this into an absolute bottom-left
          overlay, where DOM order no longer matters. */}
      <div className="thg-journey-label">
        <Kicker tone={PAPER_MUTED}>Sjö byggingar, þrjátíu og tvö ár</Kicker>
        <h2 className="m-0 mt-2 text-[13px] font-medium uppercase tracking-[0.24em]" style={{ fontFamily: BODY, color: PAPER }}>
          Verkin
        </h2>
      </div>
      <div
        className="thg-track"
        data-thg-track
        tabIndex={0}
        role="group"
        aria-label="Verkin, sjö byggingar. Renna lárétt eða nota örvatakka."
      >
        {PROJECTS.map((p, i) => (
          <ProjectPanel key={p.key} project={p} index={i} />
        ))}
      </div>
      <div className="thg-progress" aria-hidden />
    </section>
  )
}

/* ═══════════════════════════ 4 · INNANDYRA ══════════════════════════════ */
function Innandyra() {
  return (
    <section id="innandyra" data-thg-theme="concrete" className="thg-chrome-zone pb-20 md:pb-28">
      <SectionHead eyebrow="Rýmin" title="Innandyra" />
      <div className="thg-container mt-8 md:mt-10">
        <p data-thg-reveal="p" className="thg-lines m-0 max-w-[42ch] text-[17px] leading-[1.7]" style={{ fontFamily: BODY, color: 'var(--thg-fg)' }}>
          Þú hefur líklega þegar komið inn í eitt af þessum.
        </p>
      </div>
      <div className="thg-container mt-10 grid grid-cols-2 gap-3 md:mt-14 md:grid-cols-4 md:gap-4">
        {INTERIORS.map((shot) => (
          <figure key={shot.image} data-thg-reveal="c" className="m-0">
            <div className="aspect-[4/5] overflow-hidden">
              <img src={IMG(shot.image)} alt={shot.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </div>
            <figcaption className="mt-2 text-[11px] uppercase tracking-[0.12em]" style={{ fontFamily: BODY, color: 'var(--thg-fg-muted)' }}>
              {shot.project}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

/* ═══════════════════════════ 5 · TVENNS KONAR HÚS ═══════════════════════ */
function TvennsKonarHus() {
  const { hotel, care } = TVENNS_KONAR
  return (
    <section id="tvenns-konar-hus" data-thg-theme="graphite" className="thg-chrome-zone pb-20 md:pb-28">
      <SectionHead eyebrow="Tvær áttir" title="Tvenns konar hús" />
      <div className="thg-container mt-8 md:mt-10">
        <p data-thg-reveal="p" className="thg-lines m-0 max-w-[44ch] text-[17px] leading-[1.7]" style={{ fontFamily: BODY, color: 'var(--thg-fg)' }}>
          Byggingar fyrir eina nótt. Og byggingar fyrir síðustu árin.
        </p>
      </div>
      <div className="thg-container mt-12 grid gap-8 md:mt-16 md:grid-cols-2 md:gap-6">
        {[hotel, care].map((h) => (
          <div key={h.label} data-thg-reveal="c" className="flex flex-col overflow-hidden">
            <div className="aspect-[4/3] shrink-0">
              <img src={IMG(h.image)} alt={`${h.project}, ${h.label.toLowerCase()}`} loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </div>
            {/* Solid graphite plate, not a gradient over the photo — keeps
                paper-on-graphite at the exact verified 13.52:1 (AAA). */}
            <div className="p-6 md:p-8" style={{ background: GRAPHITE }}>
              <Kicker tone={PAPER_MUTED}>{h.label}</Kicker>
              <p className="m-0 mt-2 text-[15px]" style={{ fontFamily: BODY, color: PAPER }}>{h.project}</p>
              <p className="m-0 mt-3" style={{ fontFamily: DISPLAY, fontWeight: 500, color: PAPER, fontSize: 'clamp(2.6rem,6vw,4.2rem)', lineHeight: 1 }}>
                {h.figure}
                <span className="ml-3 align-middle text-[14px] font-normal uppercase tracking-[0.1em]" style={{ fontFamily: BODY, color: PAPER_MUTED }}>
                  {h.unit}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ═══════════════════════════ 6 · KOLASUNDIÐ ══════════════════════════════ */
function Kolasundid() {
  return (
    <section id="kolasundid" data-thg-theme="concrete" className="thg-chrome-zone pb-20 md:pb-28">
      <SectionHead eyebrow="Ein hugmynd" title={KOLASUNDID.title} />
      <div className="thg-container mt-10 grid gap-10 md:mt-14 md:grid-cols-[1.1fr_1fr] md:gap-14">
        <div data-thg-reveal="c" className="relative aspect-[4/3] overflow-hidden md:aspect-[5/4]">
          <img src={IMG(KOLASUNDID.image)} alt="Kolasundið, göngugatan sem liggur gegnum jarðhæð Reykjavík Konsúlat." loading="lazy" decoding="async" className="h-full w-full object-cover" />
        </div>
        <div>
          <p data-thg-reveal="p" className="thg-lines m-0 text-[17px] leading-[1.75]" style={{ fontFamily: BODY, color: 'var(--thg-fg)' }}>
            {KOLASUNDID.body}
          </p>
          <div data-thg-reveal="c" className="mt-10">
            <svg viewBox="0 0 320 90" className="w-full max-w-[22rem]" aria-hidden role="presentation">
              <path
                className="thg-diagram-path"
                d="M8 66 C 70 66, 90 20, 158 20 S 250 66, 312 24"
                style={{ stroke: 'var(--thg-accent, #A8412A)' }}
              />
              <circle cx="8" cy="66" r="3.5" style={{ fill: 'var(--thg-fg)' }} />
              <circle cx="312" cy="24" r="3.5" style={{ fill: 'var(--thg-fg)' }} />
            </svg>
            <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-[0.12em]" style={{ fontFamily: BODY, color: 'var(--thg-fg-muted)' }}>
              <span>Gamli miðbærinn</span>
              <span>Gamla sjávarlóðin</span>
            </div>
            <p className="m-0 mt-4 text-[12px] italic" style={{ fontFamily: BODY, color: 'var(--thg-fg-muted)' }}>
              {KOLASUNDID.diagramLabel}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════ 7 · STOFAN (compliance as monument) ═══════ */
function Stofan() {
  return (
    <section id="stofan" data-thg-theme="graphite" className="thg-chrome-zone pb-20 md:pb-28">
      <SectionHead eyebrow="Stofan" title="Stofan" />
      <div className="thg-container mt-10 md:mt-14">
        <p
          data-thg-reveal="h"
          className="thg-chars m-0"
          style={{ fontFamily: DISPLAY, fontWeight: 500, color: PAPER, fontSize: 'clamp(3.4rem,11vw,9rem)', lineHeight: 1, letterSpacing: '-0.01em' }}
        >
          1994
        </p>
        <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-2 md:gap-10">
          <p data-thg-reveal="c" className="m-0 text-[19px] leading-[1.4]" style={{ fontFamily: DISPLAY, fontWeight: 400, color: PAPER }}>
            {PRACTICE.staffLine}. {PRACTICE.quality}.
          </p>
          <p data-thg-reveal="p" className="thg-lines m-0 max-w-[46ch] text-[17px] leading-[1.75]" style={{ fontFamily: BODY, color: PAPER_MUTED }}>
            {PRACTICE.services}
          </p>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════ 8 · SAMBAND ════════════════════════════════ */
function Samband() {
  return (
    <section id="samband" data-thg-theme="graphite" className="thg-chrome-zone pb-24 md:pb-32">
      <SectionHead eyebrow="Hafið samband" title="Samband" />
      <div className="thg-container mt-10 md:mt-14">
        <dl className="m-0 max-w-[34rem]">
          <div className="thg-field-row flex items-baseline justify-between gap-6 py-4" style={{ borderColor: 'rgba(232,230,225,.16)' }}>
            <dt className="m-0 text-[12px] font-medium uppercase tracking-[0.2em]" style={{ fontFamily: BODY, color: PAPER_MUTED }}>Heimilisfang</dt>
            <dd className="m-0 text-right">
              <a href={MAP_LINK} target="_blank" rel="noreferrer" className={`inline-flex min-h-[44px] items-center text-[17px] underline underline-offset-4 ${FOCUS_CLASS}`} style={{ fontFamily: BODY, color: PAPER }}>
                {ADDRESS}
              </a>
            </dd>
          </div>
          <div className="thg-field-row flex items-baseline justify-between gap-6 py-4" style={{ borderColor: 'rgba(232,230,225,.16)' }}>
            <dt className="m-0 text-[12px] font-medium uppercase tracking-[0.2em]" style={{ fontFamily: BODY, color: PAPER_MUTED }}>Sími</dt>
            <dd className="m-0 text-right">
              <a href={PHONE_HREF} className={`inline-flex min-h-[44px] items-center text-[17px] underline underline-offset-4 ${FOCUS_CLASS}`} style={{ fontFamily: BODY, color: PAPER }}>
                {PHONE_DISPLAY}
              </a>
            </dd>
          </div>
          <div className="thg-field-row flex items-baseline justify-between gap-6 py-4" style={{ borderColor: 'rgba(232,230,225,.16)' }}>
            <dt className="m-0 text-[12px] font-medium uppercase tracking-[0.2em]" style={{ fontFamily: BODY, color: PAPER_MUTED }}>Netfang</dt>
            <dd className="m-0 text-right">
              <a href={EMAIL_HREF} className={`inline-flex min-h-[44px] items-center text-[17px] underline underline-offset-4 ${FOCUS_CLASS}`} style={{ fontFamily: BODY, color: PAPER }}>
                {EMAIL}
              </a>
            </dd>
          </div>
        </dl>
        <p className="m-0 mt-10 text-[12px]" style={{ fontFamily: BODY, color: PAPER_MUTED }}>THG Arkitektar ehf · {KT}</p>
      </div>
    </section>
  )
}

/* ═══════════════════════════════ PAGE ════════════════════════════════════ */
export default function Page() {
  const rootRef = useRef<HTMLDivElement>(null)
  const journeyActiveRef = useRef(false)

  useEffect(() => {
    document.title = PAGE_TITLE
    setThemeColor(GRAPHITE)
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const created = !meta
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    const prevDesc = meta.content
    meta.content = PAGE_DESCRIPTION
    const s = document.createElement('script')
    s.type = 'application/ld+json'
    s.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(s)
    return () => {
      s.remove()
      if (created) meta?.remove()
      else if (meta) meta.content = prevDesc
    }
  }, [])

  /* Self-theming chrome for the VERTICAL page (era §5.4 / BRIEF §5.2): the
     fixed chrome reads the CSS custom property of whichever top-level
     section currently sits at its own vertical position, and only writes
     when the active zone actually changes. Runs regardless of
     prefers-reduced-motion — a colour swap is not the kind of motion that
     rule guards against, and the chrome must stay legible either way.
     Deliberately paused (journeyActiveRef) while the horizontal journey is
     pinned; the GSAP effect below drives chrome colour there instead, keyed
     to which project panel is centred rather than page scroll position. */
  useEffect(() => {
    const chrome = document.getElementById('thg-chrome')
    if (!chrome) return
    const zones = Array.from(document.querySelectorAll<HTMLElement>('.thg-chrome-zone'))
    const CHROME_Y = 44
    let raf = 0
    let current: HTMLElement | null = null
    const apply = () => {
      if (journeyActiveRef.current) return
      let active = zones[0] ?? null
      for (const z of zones) {
        const r = z.getBoundingClientRect()
        if (r.top <= CHROME_Y && r.bottom >= CHROME_Y) { active = z; break }
      }
      if (!active || active === current) return
      current = active
      const fg = getComputedStyle(active).getPropertyValue('--thg-fg').trim()
      if (fg) chrome.style.setProperty('--thg-chrome-fg', fg)
    }
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => { raf = 0; apply() })
    }
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('thg:journey-released', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('thg:journey-released', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  /* All scroll choreography. Reduced motion: the matchMedia branch returns
     before a single tween is created — every element sits at its normal,
     fully visible resting layout; no pin, no scrub, no shutter, no journey
     pin (the CSS media query above already keeps the journey as a plain
     scroll-snap rail in that case). */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const mm = gsap.matchMedia()
    mm.add(
      { motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 992px)' },
      (mctx) => {
        const c = mctx.conditions as { motion: boolean; desktop: boolean }
        if (!c.motion) return undefined
        const q = gsap.utils.selector(root)
        const splits: SplitText[] = []

        const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true })
        lenis.on('scroll', ScrollTrigger.update)
        const tick = (t: number) => lenis.raf(t * 1000)
        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)

        /* THE HORIZONTAL JOURNEY — era §5.6 / BRIEF §6.3. section height ==
           track scrollWidth, so vertical scroll maps 1:1 onto horizontal
           travel; ease + scrub exactly as specified. containerAnimation
           REQUIRES a tween (not a timeline); end/x are function-form so
           they recompute after layout (invalidateOnRefresh). */
        const journeyEl = q('.thg-journey')[0] as HTMLElement | undefined
        const track = q('.thg-track')[0] as HTMLElement | undefined
        const panels = q('.thg-panel') as HTMLElement[]
        const progressEl = q('.thg-progress')[0] as HTMLElement | undefined
        const maxX = () => (track ? Math.max(1, track.scrollWidth - window.innerWidth) : 1)
        let journeyTween: gsap.core.Tween | undefined

        if (c.desktop && journeyEl && track) {
          journeyTween = gsap.to(track, { x: () => -maxX(), ease: 'thgJourney', force3D: true })
          let lastPanel = -1
          ScrollTrigger.create({
            animation: journeyTween,
            trigger: journeyEl,
            pin: journeyEl,
            scrub: 0.25,
            start: 'top top',
            end: () => '+=' + maxX(),
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressEl) progressEl.style.transform = `scaleX(${self.progress})`
              const idx = Math.min(panels.length - 1, Math.floor(self.progress * panels.length))
              if (idx !== lastPanel && panels[idx]) {
                lastPanel = idx
                const chrome = document.getElementById('thg-chrome')
                const fg = getComputedStyle(panels[idx]).getPropertyValue('--thg-fg').trim()
                if (chrome && fg) chrome.style.setProperty('--thg-chrome-fg', fg)
              }
            },
            onEnter: () => { journeyActiveRef.current = true },
            onEnterBack: () => { journeyActiveRef.current = true },
            onLeave: () => { journeyActiveRef.current = false; window.dispatchEvent(new Event('thg:journey-released')) },
            onLeaveBack: () => { journeyActiveRef.current = false; window.dispatchEvent(new Event('thg:journey-released')) },
          })
        }

        /* Per-element trigger: inside the pinned track it rides
           containerAnimation with left-based positions; everywhere else
           (the seven normal vertical sections) it's a plain viewport
           trigger. Mobile/tablet (journeyTween undefined) never wires a
           containerAnimation — the track there is a native scroll-snap
           rail, not a scrub target. */
        const trig = (el: Element, v: string, h: string, extra?: Record<string, unknown>): ScrollTrigger.Vars => {
          const inTrack = !!(el as HTMLElement).closest?.('.thg-track')
          return (inTrack && journeyTween
            ? { trigger: el, containerAnimation: journeyTween, start: h, ...extra }
            : { trigger: el, start: v, ...extra }) as ScrollTrigger.Vars
        }

        /* THE APERTURE SHUTTER — time-based (the hero is visible at load,
           not scroll-triggered): converges at the centre seam as the "from"
           state, then opens back to the resting (already-open) inset. */
        gsap.fromTo(q('.thg-shutter-left'), { clipPath: 'inset(0 50% 0 0)' }, { clipPath: 'inset(0 100% 0 0)', duration: 1.15, ease: EASE.inout, delay: 0.1 })
        gsap.fromTo(q('.thg-shutter-right'), { clipPath: 'inset(0 0 0 50%)' }, { clipPath: 'inset(0 0 0 100%)', duration: 1.15, ease: EASE.inout, delay: 0.1 })
        gsap.fromTo(q('.thg-hero-img'), { scale: 1.1 }, { scale: 1, duration: 1.6, ease: EASE.out, delay: 0.1 })
        const heroH1 = q('.thg-hero-h1')[0] as HTMLElement | undefined
        if (heroH1) {
          splits.push(SplitText.create(heroH1, {
            // 'words,chars', never 'chars' alone: inline-block characters with
            // no word wrapper let the browser break a line mid-word ("fyri /
            // r er."). The word wrapper keeps each word atomic.
            // No mask option either: GSAP's mask wrappers render as block-level
            // divs here and would stack every character on its own line.
            type: 'words,chars',
            wordsClass: 'thg-word',
            charsClass: 'thg-char',
            autoSplit: true,
            onSplit: (self) => {
              // fromTo toward the resting state, never gsap.from: a from()
              // tween writes the hidden state as an inline style, so a paused
              // rAF, a crawler or a screenshot service gets an invisible H1.
              gsap.fromTo(
                self.chars,
                { opacity: 0, yPercent: 60, rotateY: 75 },
                { opacity: 1, yPercent: 0, rotateY: 0, duration: DUR.l, ease: EASE.out, stagger: 0.02, delay: 0.55, clearProps: 'transform' },
              )
              return undefined
            },
          }))
        }
        gsap.fromTo(q('.thg-hero-eyebrow'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: DUR.m, ease: EASE.out, delay: 0.3 })
        gsap.fromTo(q('.thg-hero-practice'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: DUR.m, ease: EASE.out, delay: 1.0 })

        /* THE SIX REVEAL PRIMITIVES (simplified to the four this page
           actually uses: heading chars, masked body lines, container
           fade+rise, rule wipe) — era §5.7 / BRIEF §5.3. Inside the track,
           only wired on desktop: on mobile/tablet the rail is a native
           scroll-snap gesture and every panel shares one vertical position,
           so a vertical ScrollTrigger there would fire for all seven at
           once. Mobile panels simply render at their normal, fully legible
           resting state instead — content is identical either way. */
        const revealables = Array.from(root.querySelectorAll<HTMLElement>('[data-thg-reveal]'))
        revealables.forEach((el, i) => {
          const inTrack = !!el.closest('.thg-track')
          if (inTrack && !c.desktop) return
          const kind = el.dataset.thgReveal
          /* Every reveal below is fromTo, toward the element's resting state.
             gsap.from() would write the hidden state as an inline style at
             ScrollTrigger init, so anything that never advances the timeline
             (paused rAF, a crawler, a screenshot service) would be left with
             permanently invisible content. */
          if (kind === 'h') {
            splits.push(SplitText.create(el, {
              // No mask option: GSAP's char mask wrappers are block-level here
              // and would stack every character on its own line. CSS masks the
              // chars instead (.thg-char), guaranteed inline-block.
              type: 'words,chars', wordsClass: 'thg-word', charsClass: 'thg-char', autoSplit: true,
              onSplit: (self) => {
                gsap.fromTo(self.chars,
                  { opacity: 0, yPercent: 55, rotateY: 80 },
                  {
                    opacity: 1, yPercent: 0, rotateY: 0, duration: DUR.l, ease: EASE.out, stagger: 0.02,
                    clearProps: 'transform',
                    scrollTrigger: trig(el, 'top 85%', 'left 85%', { toggleActions: 'play none none reverse' }),
                  })
                return undefined
              },
            }))
          } else if (kind === 'p') {
            splits.push(SplitText.create(el, {
              type: 'lines', mask: 'lines', autoSplit: true,
              onSplit: (self) => {
                gsap.fromTo(self.lines,
                  { yPercent: 112 },
                  {
                    yPercent: 0, duration: DUR.l, ease: EASE.out, stagger: 0.08,
                    scrollTrigger: trig(el, 'top 88%', 'left 88%', { toggleActions: 'play none none reverse' }),
                  })
                return undefined
              },
            }))
          } else if (kind === 'line') {
            gsap.fromTo(el,
              { scaleX: 0 },
              {
                scaleX: 1, duration: DUR.m, ease: EASE.inout, transformOrigin: 'left center',
                scrollTrigger: trig(el, 'top 92%', 'left 92%', { toggleActions: 'play none none reverse' }),
              })
          } else {
            gsap.fromTo(el,
              { opacity: 0, y: 22 },
              {
                opacity: 1, y: 0, duration: DUR.m, ease: EASE.out, delay: (i % 4) * 0.04,
                scrollTrigger: trig(el, 'top 90%', 'left 90%', { toggleActions: 'play none none reverse' }),
              })
          }
        })

        /* Kolasundið diagram — resting state (no JS) is fully drawn; JS
           animates FROM an undrawn dash-offset back to it. */
        const diagramPath = root.querySelector<SVGPathElement>('.thg-diagram-path') ?? undefined
        if (diagramPath) {
          const len = diagramPath.getTotalLength()
          gsap.set(diagramPath, { strokeDasharray: len })
          gsap.fromTo(diagramPath,
            { strokeDashoffset: len },
            {
              strokeDashoffset: 0, duration: DUR.l * 1.8, ease: EASE.out,
              scrollTrigger: trig(diagramPath, 'top 82%', 'left 82%', { toggleActions: 'play none none reverse' }),
            })
        }

        /* The track's scrollWidth is only correct once the display font
           (Apfel Grotezk changes panel-name widths) and every in-track
           image have finished loading — refresh after both so end/x are
           measured against the true track width. */
        document.fonts.ready.then(() => ScrollTrigger.refresh())
        const imgs = Array.from(root.querySelectorAll('.thg-track img'))
        Promise.all(imgs.map((im) => {
          const el = im as HTMLImageElement
          if (el.complete && el.naturalWidth > 0) return Promise.resolve()
          const dec = el.decode ? el.decode().catch(() => undefined) : undefined
          return dec ?? new Promise<void>((res) => {
            el.addEventListener('load', () => res(), { once: true })
            el.addEventListener('error', () => res(), { once: true })
          })
        })).then(() => ScrollTrigger.refresh())

        /* ~2s failsafe (BRIEF §7): clear any leftover inline reveal styles
           regardless of whether their ScrollTrigger has fired yet, so a
           paused rAF, a crawler, or a screenshot service never renders a
           mid-tween "hidden" frame. */
        const failsafe = window.setTimeout(() => {
          // Clear ONLY the properties the reveals animate. clearProps:'all'
          // also wipes React's own inline style attribute, which is where the
          // hero's font-size, font-family and colour live, so it silently
          // reset the H1 to 16px unstyled text two seconds after every load.
          gsap.set(
            root.querySelectorAll('[data-thg-reveal], [data-thg-reveal] *, .thg-hero-h1, .thg-hero-h1 *, .thg-hero-eyebrow, .thg-hero-practice'),
            { opacity: 1, clearProps: 'transform,clipPath' },
          )
        }, 2000)

        return () => {
          window.clearTimeout(failsafe)
          gsap.ticker.remove(tick)
          lenis.destroy()
          splits.forEach((sp) => sp.revert())
          journeyActiveRef.current = false
        }
      },
    )
    return () => { mm.revert() }
  }, [])

  return (
    <div ref={rootRef} lang="is" className="thg-root antialiased" style={{ background: CONCRETE, overflowX: 'clip' }}>
      <style>{PAGE_STYLES}</style>
      <PreviewChrome company={company} />
      <Chrome />
      <main>
        <Aperture />
        <Stadarandi />
        <Verkin />
        <Innandyra />
        <TvennsKonarHus />
        <Kolasundid />
        <Stofan />
        <Samband />
      </main>
      <PreviewFooter company={company} />
    </div>
  )
}
