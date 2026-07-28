import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import Lenis from 'lenis'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { initThgImagePipeline } from './webgl'
import {
  IMG, ADDRESS, PHONE_DISPLAY, PHONE_HREF, EMAIL, EMAIL_HREF, KT, MAP_LINK,
  PRACTICE, THESIS_QUOTES, CODENAME, TAGLINE, PROJECTS, INTERIORS,
  PAGE_TITLE, PAGE_DESCRIPTION, JSON_LD,
} from './data'
import type { Project } from './data'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)
CustomEase.create('thgEase', '0.17,0.84,0.44,1')

const company = getPreviewCompany('thg')

/* ── THG Arkitektar — "Staðarandi", on the Kononenko system ──────────────
   kononenkogroup.com transplanted completely (KONONENKO-BRIEF.md): the
   one-canvas WebGL image pipeline (webgl.ts), the ink-sketch-develops-into-
   photograph device on every project image, paper-white near-monochrome
   ground, the mixed-typeface (Switzer + Hedvig accent word) headline
   device, comma-separated text nav, fact-ledger anatomy, alternating work
   grid, stat monument. THG's own seven verified projects, quotes and facts
   fill it — nothing else changes. Judged by architects: restraint over
   decoration, always. ──────────────────────────────────────────────────── */

const PAPER = '#ffffff'
const INK = '#111111'
const MUTED = '#767676'
const RULE = '#e2e2e2'

const SANS = "'THG Switzer', 'Helvetica Neue', Arial, sans-serif"
const SERIF = "'THG Hedvig', Georgia, 'Times New Roman', serif"
const FONTS_SWITZER = `${import.meta.env.BASE_URL}fonts/switzer/`
const FONTS_HEDVIG = `${import.meta.env.BASE_URL}fonts/hedvig/`

const DUR = { s: 0.35, m: 0.7, l: 1.05 }
const EASE = 'thgEase'
const FOCUS = 'thg-focus'

const NAV_ITEMS = [
  { href: '#verkin', label: 'Verkin' },
  { href: '#stadarandi', label: 'Staðarandi' },
  { href: '#innandyra', label: 'Innandyra' },
  { href: '#stofan', label: 'Stofan' },
  { href: '#samband', label: 'Samband' },
]

/** Row layout for the work grid — Kononenko's own alternating 2/1/2 rhythm,
 *  continued once more (2/1/2/2) to land exactly on seven projects with no
 *  orphan card. Order matches PROJECTS (borg, marina, konsulat, von, eir,
 *  hrafnista, saavik), so Konsúlat still surfaces exactly once. */
const WORK_ROWS: Array<Array<Project['key']>> = [
  ['borg', 'marina'],
  ['konsulat'],
  ['von', 'eir'],
  ['hrafnista', 'saavik'],
]

const projectByKey = (key: string): Project => {
  const p = PROJECTS.find((pp) => pp.key === key)
  if (!p) throw new Error(`Unknown THG project key: ${key}`)
  return p
}

const PAGE_STYLES = `
@font-face { font-family:'THG Switzer'; src:url('${FONTS_SWITZER}Switzer-Regular.woff2') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
@font-face { font-family:'THG Switzer'; src:url('${FONTS_SWITZER}Switzer-Medium.woff2') format('woff2'); font-weight:500; font-style:normal; font-display:swap; }
@font-face { font-family:'THG Switzer'; src:url('${FONTS_SWITZER}Switzer-Semibold.woff2') format('woff2'); font-weight:600; font-style:normal; font-display:swap; }
@font-face { font-family:'THG Switzer'; src:url('${FONTS_SWITZER}Switzer-Bold.woff2') format('woff2'); font-weight:700; font-style:normal; font-display:swap; }
/* Hedvig Letters Serif — two files, split by the exact unicode-range Google
   Fonts serves them under (css2 output). Icelandic (þðÞÐáéíóúýæö and every
   other accented Latin-1 glyph) sits entirely inside U+0000-00FF, i.e. the
   "latin" file below — the "latin-ext" file only ever downloads if a
   Latin-Extended-A/B codepoint is actually used on the page, which THG copy
   never does. Both declared per KONONENKO-BRIEF.md §type. */
@font-face {
  font-family:'THG Hedvig'; font-style:normal; font-weight:400; font-display:swap;
  src:url('${FONTS_HEDVIG}hedvig-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family:'THG Hedvig'; font-style:normal; font-weight:400; font-display:swap;
  src:url('${FONTS_HEDVIG}hedvig-latin-ext.woff2') format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

/* ═══ Ground — paper white everywhere, no other colour (KONONENKO-BRIEF §ground) */
.thg-root { font-family:${SANS}; background:${PAPER}; color:${INK}; -webkit-font-smoothing:antialiased; }
.thg-root, .thg-root *, .thg-root *::before, .thg-root *::after { box-sizing:border-box; }
.thg-root ::selection { background:${INK}; color:${PAPER}; }
.thg-serif { font-family:${SERIF}; font-style:normal; font-weight:400; }
.thg-container { max-width:1600px; margin-inline:auto; padding-inline:clamp(20px,5vw,64px); }
/* Long unbroken Icelandic compounds (ráðgjafarþjónusta, umhverfishönnunar)
   inside a narrow 375px column never force horizontal scroll. */
.thg-root h1, .thg-root h2, .thg-root h3, .thg-root p, .thg-root a, .thg-root dd { overflow-wrap:break-word; }

/* ═══ WebGL canvas — first child, unpositioned stacking level, so every
   later DOM element paints above it in normal tree order; a low explicit
   z-index plus .thg-main's z-index:1 makes that unambiguous rather than
   relying purely on paint order. Fixed, DPR-capped and disposed inside
   webgl.ts; pointer-events:none throughout so it never eats clicks. ═══ */
.thg-gl-canvas { position:fixed; inset:0; z-index:0; pointer-events:none; display:block; }
.thg-main { position:relative; z-index:1; }

/* Every [data-thg-plane] wrapper: the DOM <img> is the resting, always-
   visible, no-JS/no-WebGL source of truth (object-fit:cover mirrors
   exactly what the shader's own coverUv() does), hidden via inline style
   ONLY once webgl.ts confirms a texture is ready to replace it in place. */
.thg-plane-frame { position:relative; overflow:hidden; display:block; width:100%; height:100%; background:${RULE}; }
.thg-plane-frame img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block; }

/* ═══ Fixed chrome — comma nav + stacked wordmark, self-toning ═══════════
   Default (no JS, or hero still at the top of the viewport) is the LIGHT
   treatment: paper-white text over the hero's own scrim, because that is
   genuinely what sits behind the bar at first paint. A tiny IntersectionObserver
   (Page(), below) flips a single data attribute to "dark" once the hero has
   scrolled out from under the bar — one discrete state change, never a
   scroll-scrubbed value, so the colour transition here is safe. ═══ */
.thg-chrome { position:fixed; inset-inline:0; top:0; z-index:50; display:flex; flex-wrap:wrap; align-items:flex-start; justify-content:space-between; gap:8px 16px; padding:clamp(16px,2.6vw,28px) clamp(20px,5vw,64px); color:${PAPER}; transition:color .35s cubic-bezier(.17,.84,.44,1); }
.thg-chrome[data-thg-tone='dark'] { color:${INK}; }
.thg-chrome-scrim { position:absolute; inset:-1px 0 auto 0; height:160px; z-index:-1; pointer-events:none; opacity:1; transition:opacity .35s cubic-bezier(.17,.84,.44,1); background:linear-gradient(180deg, rgba(17,17,17,.72) 0%, rgba(17,17,17,0) 100%); }
.thg-chrome[data-thg-tone='dark'] .thg-chrome-scrim { opacity:0; }
.thg-wordmark { display:flex; flex-direction:column; gap:1px; font-size:11px; font-weight:500; letter-spacing:.08em; text-transform:uppercase; line-height:1.4; text-decoration:none; color:inherit; }
.thg-nav { display:flex; flex-wrap:wrap; align-items:baseline; gap:2px 6px; max-width:62vw; font-size:clamp(10.5px,1.6vw,12px); font-weight:500; letter-spacing:.04em; text-transform:uppercase; }
.thg-nav a { text-decoration:none; color:inherit; }
.thg-nav a:hover, .thg-nav a:focus-visible { text-decoration:underline; text-underline-offset:3px; }

.thg-focus:focus-visible { outline:2px solid currentColor; outline-offset:3px; border-radius:1px; }

/* ═══ Hero — poster-first video slot, giant bottom-left mixed-type name ═══ */
.thg-hero { position:relative; min-height:100svh; display:flex; align-items:flex-end; overflow:hidden; }
.thg-hero-media-wrap { position:absolute; inset:0; }
.thg-hero-media { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block; }
/* Stops verified against the worst realistic case (a pure-white sky pixel,
   borg-exterior.jpg's own bottom band measured up to 254/255) at the
   text block's own lowest realistic position (content sits flex-end,
   bottom-anchored, so its top edge is comfortably below 50% of the hero
   in every measured breakpoint from 375 to 1440) — see the contrast table
   in the build report. Steep and early on purpose: a soft, slow gradient
   alone left the eyebrow around 3-4:1 against a bright sky. */
.thg-hero-scrim { position:absolute; inset:0; background:linear-gradient(180deg, rgba(17,17,17,0) 0%, rgba(17,17,17,.3) 30%, rgba(17,17,17,.65) 48%, rgba(17,17,17,.85) 62%, rgba(17,17,17,.94) 100%); }
.thg-hero-content { position:relative; z-index:1; width:100%; padding-top:clamp(120px,17vw,208px); padding-bottom:clamp(40px,7vw,72px); }
.thg-hero-eyebrow { margin:0 0 .9em; font-size:11px; font-weight:500; letter-spacing:.3em; text-transform:uppercase; color:rgba(255,255,255,.88); }
.thg-hero-h1 { margin:0; max-width:20ch; color:${PAPER}; font-weight:500; font-size:clamp(2.4rem,7.4vw,6.6rem); line-height:1; letter-spacing:-.01em; }
.thg-hero-line { margin:1.5em 0 0; font-size:14px; letter-spacing:.08em; text-transform:uppercase; color:rgba(255,255,255,.88); }
/* Char/word split lives ONLY on the hero name (repo law). Word wrapper
   keeps each word atomic so a line never breaks mid-word; chars stay
   inline-block so no per-character mask stacks them one-per-line. */
.thg-word { display:inline-block; white-space:nowrap; vertical-align:top; overflow:hidden; padding-bottom:.22em; margin-bottom:-.22em; }
.thg-char { display:inline-block; }

@media (prefers-reduced-motion:reduce) { .thg-hero-media { transform:none !important; } }

/* ═══ Generic section rhythm ═══════════════════════════════════════════ */
.thg-section { padding-block:clamp(56px,9vw,120px); }
.thg-section-h2 { margin:0 0 .6em; font-weight:500; font-size:clamp(1.7rem,3.6vw,2.6rem); line-height:1.15; letter-spacing:-.01em; }
.thg-section-lede { margin:0; max-width:46ch; font-size:17px; line-height:1.7; color:${MUTED}; }

/* ═══ Manifesto + fact ledger ══════════════════════════════════════════ */
.thg-manifesto-h2 { margin:0 0 clamp(40px,6vw,72px); max-width:22ch; font-weight:500; font-size:clamp(1.9rem,4.8vw,3.7rem); line-height:1.22; letter-spacing:-.01em; }
.thg-ledger { margin:0; border-top:1px solid ${RULE}; }
.thg-ledger-row { display:grid; grid-template-columns:1fr; gap:.4em; padding:20px 0; border-bottom:1px solid ${RULE}; }
.thg-ledger-row h3 { margin:0; font-size:11px; font-weight:500; letter-spacing:.18em; text-transform:uppercase; color:${MUTED}; }
.thg-ledger-row p { margin:0; font-size:17px; line-height:1.55; max-width:62ch; }
@media (min-width:768px) { .thg-ledger-row { grid-template-columns:220px 1fr; align-items:baseline; gap:24px; } }

/* ═══ Services line — one long comma h2 (KONONENKO-BRIEF §services) ═══════ */
.thg-services { padding-block:clamp(40px,7vw,88px); border-block:1px solid ${RULE}; }
.thg-services-h2 { margin:0; font-weight:500; font-size:clamp(1.5rem,3.6vw,2.7rem); line-height:1.38; letter-spacing:-.005em; }

/* ═══ Staðarandi — the three quotes as method blocks ═══════════════════ */
.thg-methods { display:flex; flex-direction:column; gap:2px; margin-top:clamp(40px,6vw,72px); }
.thg-method { display:grid; grid-template-columns:1fr; background:${PAPER}; }
.thg-method-text { order:2; padding:clamp(28px,5vw,64px) clamp(20px,5vw,64px); display:flex; flex-direction:column; justify-content:center; }
.thg-method-media { order:1; aspect-ratio:4/3; }
.thg-method-index { display:block; margin-bottom:.7em; font-size:12px; font-weight:500; letter-spacing:.1em; color:${MUTED}; }
.thg-method blockquote { margin:0; }
.thg-method blockquote p { margin:0; font-weight:400; font-size:clamp(1.2rem,2.4vw,1.7rem); line-height:1.45; }
.thg-method cite { display:block; margin-top:1em; font-style:normal; font-size:12px; font-weight:500; letter-spacing:.14em; text-transform:uppercase; color:${MUTED}; }
.thg-method-note { margin:.6em 0 0; font-size:12px; color:${MUTED}; }
@media (min-width:900px) {
  .thg-method { grid-template-columns:1fr 1fr; align-items:stretch; }
  .thg-method-text { order:1; }
  .thg-method-media { order:2; aspect-ratio:auto; }
  .thg-method-rev .thg-method-text { order:2; }
  .thg-method-rev .thg-method-media { order:1; }
}

/* ═══ Verkin — the work grid, alternating 2/1/2/2 (KONONENKO-BRIEF §grid) ═ */
.thg-work-grid { display:flex; flex-direction:column; gap:clamp(28px,4vw,40px); margin-top:clamp(32px,5vw,56px); }
.thg-work-row { display:grid; grid-template-columns:1fr; gap:clamp(20px,3vw,32px); }
@media (min-width:768px) { .thg-work-row-2 { grid-template-columns:1fr 1fr; } }
.thg-work-card { display:flex; flex-direction:column; }
.thg-work-media { aspect-ratio:4/5; }
.thg-work-row-1 .thg-work-media { aspect-ratio:16/9; }
.thg-work-name { margin:20px 0 0; font-weight:500; font-size:clamp(1.1rem,1.8vw,1.5rem); }
.thg-work-fields { margin:12px 0 0; padding:0; display:flex; flex-wrap:wrap; gap:4px 24px; }
.thg-field { display:flex; gap:8px; align-items:baseline; margin:0; }
.thg-field dt { margin:0; font-size:11px; font-weight:500; letter-spacing:.12em; text-transform:uppercase; color:${MUTED}; }
.thg-field dd { margin:0; font-size:14px; }

/* ═══ Innandyra — interiors, media shader with hairline border ═════════ */
.thg-interiors-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-top:clamp(32px,5vw,56px); list-style:none; padding:0; }
@media (min-width:768px) { .thg-interiors-grid { grid-template-columns:repeat(4,1fr); gap:16px; } }
.thg-interior { margin:0; }
.thg-interior-media { aspect-ratio:4/5; }
.thg-interior figcaption { margin-top:8px; font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:${MUTED}; }

/* ═══ Stofan — stat monument, giant numerals ════════════════════════════ */
.thg-stats { display:grid; grid-template-columns:repeat(2,1fr); gap:clamp(28px,5vw,48px) clamp(16px,3vw,32px); margin-top:clamp(32px,5vw,56px); }
@media (min-width:768px) { .thg-stats { grid-template-columns:repeat(4,1fr); } }
.thg-stat-figure { margin:0; font-weight:500; font-size:clamp(1.7rem,5vw,3.4rem); line-height:1.05; letter-spacing:-.01em; }
.thg-stat-label { margin:.5em 0 0; font-weight:500; font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:${MUTED}; }

/* ═══ Samband + footer ══════════════════════════════════════════════════ */
.thg-contact-list { list-style:none; margin:clamp(24px,4vw,40px) 0 0; padding:0; display:flex; flex-direction:column; gap:14px; }
.thg-contact-list a { display:inline-block; font-size:clamp(1.25rem,3vw,2rem); font-weight:500; color:${INK}; text-decoration:underline; text-underline-offset:6px; text-decoration-color:${RULE}; }
.thg-foot-wordmark-wrap { margin-top:clamp(56px,9vw,120px); padding-top:clamp(28px,4vw,48px); border-top:1px solid ${RULE}; }
.thg-foot-wordmark { margin:0; font-weight:500; font-size:clamp(2.4rem,9.4vw,7.2rem); line-height:1; letter-spacing:-.02em; }
.thg-foot-meta { display:flex; align-items:center; gap:12px; margin-top:clamp(20px,3vw,32px); }
.thg-foot-mark { width:26px; height:26px; object-fit:cover; border-radius:2px; }
.thg-foot-meta p { margin:0; font-size:12px; color:${MUTED}; }
`

/* ═══════════════════════════ small helpers ════════════════════════════ */
function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="thg-field">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

/* ═══════════════════════════ chrome ════════════════════════════════════ */
function Chrome() {
  return (
    <div id="thg-chrome" className="thg-chrome" data-thg-tone="light">
      <span aria-hidden className="thg-chrome-scrim" />
      <a href="#thg-top" className={`thg-wordmark ${FOCUS}`} aria-label="Fara efst á síðu, THG Arkitektar">
        <span>THG</span>
        <span>Arkitektar</span>
        <span>Reykjavík</span>
      </a>
      <nav aria-label="Aðalvalmynd" className="thg-nav">
        {NAV_ITEMS.map((item, i) => (
          <span key={item.href}>
            <a href={item.href} className={FOCUS}>{item.label}</a>
            {i < NAV_ITEMS.length - 1 ? <span aria-hidden>,</span> : null}
          </span>
        ))}
      </nav>
    </div>
  )
}

/* ═══════════════════════════ 1 · hero ═══════════════════════════════════ */
function Hero({ reducedMotion }: { reducedMotion: boolean }) {
  const alt = 'Framhlið Hótel Borgar við Austurvöll í Reykjavík, fyrsti áfangi stækkunar sem THG Arkitektar hönnuðu.'
  return (
    <header id="thg-top" className="thg-hero">
      <div className="thg-hero-media-wrap">
        {reducedMotion ? (
          <img
            src={IMG('borg-exterior')}
            alt={alt}
            className="thg-hero-media"
            loading="eager"
            decoding="async"
            {...{ fetchpriority: 'high' }}
          />
        ) : (
          <video
            className="thg-hero-media"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={IMG('borg-exterior')}
            aria-label={alt}
          >
            <source src={`${import.meta.env.BASE_URL}thg/hero-film.mp4`} type="video/mp4" />
          </video>
        )}
        <div aria-hidden className="thg-hero-scrim" />
      </div>
      <div className="thg-container thg-hero-content">
        <p className="thg-hero-eyebrow" data-thg-reveal>{CODENAME}</p>
        <h1 className="thg-hero-h1">
          THG <em className="thg-serif">Arkitektar</em>
        </h1>
        <p className="thg-hero-line" data-thg-reveal>
          {PRACTICE.founded} · {PRACTICE.staffLine} · ISO 9001:2015
        </p>
      </div>
    </header>
  )
}

/* ═══════════════════════════ 2 · manifesto + ledger ═════════════════════ */
function Manifesto() {
  const parts = TAGLINE.split('fyrir')
  return (
    <section id="stadarandi-inngangur" className="thg-section" aria-labelledby="thg-manifesto-h2">
      <div className="thg-container">
        <h2 id="thg-manifesto-h2" className="thg-manifesto-h2" data-thg-reveal>
          {parts[0]}<em className="thg-serif">fyrir</em>{parts[1]}
        </h2>
        {/* h3-label / value rows, not a real <dl>: Kononenko's own fact
            ledger anatomy (KONONENKO-BRIEF.md §manifesto) pairs a heading
            label with a value paragraph, not a definition-list term/detail
            pair, so a plain div avoids an invalid dl content model. */}
        <div className="thg-ledger">
          <div className="thg-ledger-row" data-thg-reveal>
            <h3>Stofnað</h3>
            <p>{PRACTICE.founded}, {PRACTICE.founder}</p>
          </div>
          <div className="thg-ledger-row" data-thg-reveal>
            <h3>Teymið</h3>
            <p>{PRACTICE.staffLine}</p>
          </div>
          <div className="thg-ledger-row" data-thg-reveal>
            <h3>Gæðakerfi</h3>
            <p>{PRACTICE.quality}</p>
          </div>
          <div className="thg-ledger-row" data-thg-reveal>
            <h3>Þjónusta</h3>
            <p>{PRACTICE.services}</p>
          </div>
          <div className="thg-ledger-row" data-thg-reveal>
            <h3>Verkkaupar</h3>
            <p>{PRACTICE.clients}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════ 3 · services line ═══════════════════════════ */
function ServicesLine() {
  const parts = PRACTICE.services.split('arkitektúrs')
  return (
    <section id="thjonusta" className="thg-services" aria-labelledby="thg-services-h2">
      <div className="thg-container">
        <h2 id="thg-services-h2" className="thg-services-h2" data-thg-reveal>
          {parts[0]}<em className="thg-serif">arkitektúrs</em>{parts[1]}
        </h2>
      </div>
    </section>
  )
}

/* ═══════════════════════════ 4 · staðarandi (the three quotes) ══════════ */
function Stadarandi() {
  return (
    <section id="stadarandi" className="thg-section" aria-labelledby="thg-stadarandi-h2">
      <div className="thg-container">
        <h2 id="thg-stadarandi-h2" className="thg-section-h2" data-thg-reveal>{CODENAME}</h2>
        <p className="thg-section-lede" data-thg-reveal>
          Þrisvar á sínum eigin vef orðar stofan sömu hugsunina, án þess að nefna hana.
        </p>
      </div>
      <div className="thg-methods">
        {THESIS_QUOTES.map((t, i) => {
          const proj = PROJECTS.find((p) => p.name === t.project)
          if (!proj) return null
          return (
            <article key={t.project} className={`thg-method${i % 2 === 1 ? ' thg-method-rev' : ''}`} data-thg-theme={proj.theme}>
              <div className="thg-method-media thg-plane-frame" data-thg-plane="sketch">
                <img src={IMG(proj.image)} alt={proj.alt} loading="lazy" decoding="async" />
              </div>
              <div className="thg-method-text" data-thg-reveal>
                <span aria-hidden className="thg-method-index">0{i + 1}</span>
                <blockquote>
                  <p>„{t.quote}“</p>
                </blockquote>
                <cite>{t.project}</cite>
                {t.note ? <p className="thg-method-note">{t.note}</p> : null}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

/* ═══════════════════════════ 5 · verkin (work grid) ══════════════════════ */
function WorkCard({ project }: { project: Project }) {
  return (
    <article className="thg-work-card" data-thg-reveal>
      <div className="thg-work-media thg-plane-frame" data-thg-plane="sketch">
        <img src={IMG(project.image)} alt={project.alt} loading="lazy" decoding="async" />
      </div>
      <h3 className="thg-work-name">{project.name}</h3>
      <dl className="thg-work-fields">
        <Field label="Staður" value={project.place} />
        <Field label="Ár" value={project.year} />
        <Field label="Umfang" value={project.size} />
        <Field label="Verkkaupi" value={project.client} />
      </dl>
    </article>
  )
}

function Verkin() {
  return (
    <section id="verkin" className="thg-section" aria-labelledby="thg-verkin-h2">
      <div className="thg-container">
        <h2 id="thg-verkin-h2" className="thg-section-h2" data-thg-reveal>Verkin</h2>
        <p className="thg-section-lede" data-thg-reveal>Sjö byggingar, þrjátíu og tvö ár.</p>
      </div>
      <div className="thg-container thg-work-grid">
        {WORK_ROWS.map((row, ri) => (
          <div key={ri} className={`thg-work-row ${row.length === 1 ? 'thg-work-row-1' : 'thg-work-row-2'}`}>
            {row.map((key) => (
              <WorkCard key={key} project={projectByKey(key)} />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

/* ═══════════════════════════ 6 · innandyra ═══════════════════════════════ */
function Innandyra() {
  return (
    <section id="innandyra" className="thg-section" aria-labelledby="thg-innandyra-h2">
      <div className="thg-container">
        <h2 id="thg-innandyra-h2" className="thg-section-h2" data-thg-reveal>Innandyra</h2>
        <p className="thg-section-lede" data-thg-reveal>Þú hefur líklega þegar komið inn í eitt af þessum.</p>
      </div>
      <ul className="thg-container thg-interiors-grid">
        {INTERIORS.map((shot) => (
          <li key={shot.image} className="thg-interior" data-thg-reveal>
            <figure style={{ margin: 0 }}>
              <div className="thg-interior-media thg-plane-frame" data-thg-plane="media" data-thg-border="1">
                <img src={IMG(shot.image)} alt={shot.alt} loading="lazy" decoding="async" />
              </div>
              <figcaption>{shot.project}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ═══════════════════════════ 7 · stofan (stat monument) ══════════════════ */
function Stat({ figure, label }: { figure: string; label: string }) {
  return (
    <div className="thg-stat" data-thg-reveal>
      <p className="thg-stat-figure">{figure}</p>
      <h3 className="thg-stat-label">{label}</h3>
    </div>
  )
}

function Stofan() {
  return (
    <section id="stofan" className="thg-section" aria-labelledby="thg-stofan-h2">
      <div className="thg-container">
        <h2 id="thg-stofan-h2" className="thg-section-h2" data-thg-reveal>Stofan</h2>
        <div className="thg-stats">
          <Stat figure={String(PRACTICE.founded)} label="Stofnað" />
          <Stat figure="Um fjörutíu" label="Í teyminu" />
          <Stat figure={String(PROJECTS.length)} label="Verk sýnd hér" />
          <Stat figure="ISO 9001" label="Vottun frá 2016" />
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════ 8 · samband + footer ════════════════════════ */
function Samband() {
  return (
    <section id="samband" className="thg-section" aria-labelledby="thg-samband-h2">
      <div className="thg-container">
        <h2 id="thg-samband-h2" className="thg-section-h2" data-thg-reveal>Samband</h2>
        <ul className="thg-contact-list" data-thg-reveal>
          <li><a href={MAP_LINK} target="_blank" rel="noreferrer" className={FOCUS}>{ADDRESS}</a></li>
          <li><a href={PHONE_HREF} className={FOCUS}>{PHONE_DISPLAY}</a></li>
          <li><a href={EMAIL_HREF} className={FOCUS}>{EMAIL}</a></li>
        </ul>
      </div>
      <div className="thg-container thg-foot-wordmark-wrap">
        <p className="thg-foot-wordmark">THG <em className="thg-serif">Arkitektar</em></p>
        <div className="thg-foot-meta">
          <img src={IMG('mark')} alt="" aria-hidden className="thg-foot-mark" loading="lazy" decoding="async" />
          <p>THG Arkitektar ehf · {KT}</p>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════ page ════════════════════════════════════ */
export default function Page() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    document.title = PAGE_TITLE
    setThemeColor(INK)
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

  /* Chrome self-toning: white-on-scrim while the hero still covers the bar,
     ink-on-paper once it doesn't. A thin IntersectionObserver band at the
     bar's own height, the standard "sticky header colour swap" trick — one
     discrete write per crossing, never a per-frame scroll value. Runs
     regardless of prefers-reduced-motion (a colour swap, not motion). */
  useEffect(() => {
    const hero = document.getElementById('thg-top')
    const chrome = document.getElementById('thg-chrome')
    if (!hero || !chrome) return
    const io = new IntersectionObserver(
      ([entry]) => {
        chrome.dataset.thgTone = entry.isIntersecting ? 'light' : 'dark'
      },
      { rootMargin: '-88px 0px -100% 0px', threshold: 0 },
    )
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  /* All scroll choreography + the WebGL image pipeline. Reduced motion:
     the matchMedia branch below never runs — every element sits at its
     normal, fully visible resting layout (no opacity:0 default anywhere
     in PAGE_STYLES), and Innandyra/Verkin/Staðarandi images are the plain
     DOM <img>s underneath (no canvas ever mounts). */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root)
      const splits: SplitText[] = []

      /* Lenis + the WebGL pipeline + the sketch shader's hover lens are all
         gated the same way: fine-pointer only. On touch, the reveal
         animations below still run (this whole effect is gated on
         reduced-motion, not on pointer type) — only the canvas, the smooth
         scroll and the cursor lens are desktop-with-a-mouse features,
         matching KONONENKO-BRIEF.md's "No-WebGL/reduced-motion/touch ⇒
         plain DOM images" and "hover lens ... desktop only". */
      const fine = window.matchMedia('(pointer: fine)').matches
      let lenis: Lenis | undefined
      let tick: ((t: number) => void) | undefined
      if (fine) {
        lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true })
        lenis.on('scroll', ScrollTrigger.update)
        tick = (t: number) => lenis!.raf(t * 1000)
        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)
      }
      // Any throw inside pipeline init must degrade to DOM images, never
      // take down the React tree (a THREE colour-space assignment did
      // exactly that once).
      let pipeline: ReturnType<typeof initThgImagePipeline> = null
      if (fine) {
        try { pipeline = initThgImagePipeline(root) } catch { pipeline = null }
      }

      /* Hero name — the ONE place words,chars splitting happens on this
         page. fromTo toward the resting state (never gsap.from): a from()
         tween writes the hidden state as an inline style at ScrollTrigger/
         timeline creation, so a paused rAF, a crawler or a screenshot
         service would see permanently invisible text. */
      const heroH1 = q('.thg-hero-h1')[0] as HTMLElement | undefined
      if (heroH1) {
        splits.push(SplitText.create(heroH1, {
          type: 'words,chars',
          wordsClass: 'thg-word',
          charsClass: 'thg-char',
          autoSplit: false,
          onSplit: (self) => {
            gsap.fromTo(
              self.chars,
              { yPercent: 112 },
              { yPercent: 0, duration: DUR.l, ease: EASE, stagger: 0.018, delay: 0.15, clearProps: 'transform' },
            )
            return undefined
          },
        }))
      }
      gsap.fromTo(q('.thg-hero-eyebrow'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: DUR.m, ease: EASE, delay: 0.05 })
      gsap.fromTo(q('.thg-hero-line'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: DUR.m, ease: EASE, delay: 0.5 })

      /* Every other reveal on the page: one restrained primitive
         (opacity+y fromTo, toward resting, once). Judged by architects —
         no six-device toolkit here, the sketch shader IS the page's
         signature reveal. Hero eyebrow/line are excluded here — they
         already got their own immediate (non-scroll-triggered) fromTo
         above, since the hero is visible at load, not scrolled into view;
         a fromTo defaults immediateRender:true, so running this generic,
         scroll-triggered copy over them too would snap them back to
         opacity:0 the instant it's created, on top of the tween that just
         faded them in. */
      const revealEls = Array.from(root.querySelectorAll<HTMLElement>('[data-thg-reveal]'))
        .filter((el) => !el.closest('.thg-hero'))
      revealEls.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 18 },
          {
            opacity: 1, y: 0, duration: DUR.m, ease: EASE, delay: (i % 3) * 0.05,
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none', once: true },
          },
        )
      })

      /* ~2s failsafe: clear ONLY the properties any of the above animate.
         clearProps:'all' would also wipe React's own inline style
         attribute (e.g. the hero media's object-fit is a class, but any
         future inline style would go with it) — transform/clipPath only. */
      const failsafe = window.setTimeout(() => {
        gsap.set(
          root.querySelectorAll('[data-thg-reveal], [data-thg-reveal] *, .thg-hero-h1, .thg-hero-h1 *, .thg-hero-eyebrow, .thg-hero-line'),
          { opacity: 1, clearProps: 'transform,clipPath' },
        )
      }, 2000)

      return () => {
        window.clearTimeout(failsafe)
        pipeline?.dispose()
        if (tick) gsap.ticker.remove(tick)
        lenis?.destroy()
        splits.forEach((sp) => sp.revert())
      }
    })
    return () => mm.revert()
  }, [])

  return (
    <div ref={rootRef} lang="is" className="thg-root" style={{ background: PAPER, overflowX: 'clip' }}>
      <style>{PAGE_STYLES}</style>
      <PreviewChrome company={company} />
      <Chrome />
      <main className="thg-main">
        <Hero reducedMotion={reducedMotion} />
        <Manifesto />
        <ServicesLine />
        <Stadarandi />
        <Verkin />
        <Innandyra />
        <Stofan />
        <Samband />
      </main>
      <PreviewFooter company={company} />
    </div>
  )
}
