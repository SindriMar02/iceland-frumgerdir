import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import Lenis from 'lenis'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { CanvasEngine, hasWebGL } from './webgl'
import type { PlaneHandle, ShaderKind } from './webgl'
import {
  IMG, EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF, COMPANY_LINE, COMPANY_ADDRESS,
  PHOTOS, VISUALS, MOUNTAINS, HOUSES, STATUS_LABEL, DOCUMENTS, ENQUIRY_HOUSES, NAV,
} from './data'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)
CustomEase.create('hkKon', '.17,.84,.44,1')

const company = getPreviewCompany('heklusyn')

/* ═════════════════════════════════════════════════════════════════════════
   KONONENKO TRANSPLANT — full system replacement (see KONONENKO-BRIEF.md).
   One shared THREE.js canvas (webgl.ts) renders every photograph and every
   Tölvumynd render as a plane synced to its DOM twin's rect each frame; the
   DOM <img> underneath stays in the markup for SSR/SEO/a11y and is only
   visibility-hidden once the canvas is confirmed running. Paper-white
   ground throughout, near-black text, the mixed Switzer/Hedvig headline
   device, comma-nav chrome, fact-ledger anatomy, a Kononenko-style work
   grid with the sketch-develop hover lens. Heklusýn's own signature — the
   eight-mountain interactive horizon — is kept and restyled monochrome.
   ═════════════════════════════════════════════════════════════════════════ */

const BASE = import.meta.env.BASE_URL
const FONTS_SW = `${BASE}fonts/switzer/`
const FONTS_HV = `${BASE}fonts/hedvig/`
const FILM = `${BASE}heklusyn/hero-film.mp4`

const SWITZER = "'HK Switzer', -apple-system, sans-serif"
const HEDVIG = "'HK Hedvig', Georgia, serif"

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const isCoarsePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
const canHover = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/* Ground everywhere is paper white. Only five colours exist on the page;
   every other colour arrives through photography.
   Contrast (relative-luminance formula, computed below in the report):
   INK #111111 / GROUND #ffffff ............ 18.88:1 (AAA)
   MUTED #767676 / GROUND #ffffff ........... 4.55:1 (AA, normal text floor)
   INK #111111 / BAND #f0f0f0 ............... 16.57:1 (AAA)
   INK #111111 / RULE #e2e2e2 ............... 14.58:1 (AAA)
   MUTED #767676 / BAND #f0f0f0 ............. 3.99:1 (FAILS AA — muted text
     is therefore never placed on the #f0f0f0 chrome band, only on #fff)
   WHITE #ffffff / hero video, under the gradient scrim below — not a flat
     pair (photography), scrim opacity chosen so the darkest text-bearing
     region is effectively near-black, matching the INK/GROUND ratio.        */
const INK = '#111111'
const GROUND = '#ffffff'
const MUTED = '#767676'
const RULE = '#e2e2e2'
const BAND = '#f0f0f0'

const DUR = { s: 0.4, m: 0.8, l: 1.2 }
const EASE = 'hkKon'
const STAGGER = 0.045

/* Module-scope Lenis instance so Chrome's nav clicks route scroll through
   it — null under the capability gate (reduced motion / touch / no WebGL),
   where scroll is native and anchor links use scrollIntoView instead. */
let hkLenis: Lenis | null = null

const PAGE_STYLES = `
@font-face { font-family:'HK Switzer'; src:url('${FONTS_SW}Switzer-Regular.woff2') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
@font-face { font-family:'HK Switzer'; src:url('${FONTS_SW}Switzer-Medium.woff2') format('woff2'); font-weight:500; font-style:normal; font-display:swap; }
@font-face { font-family:'HK Switzer'; src:url('${FONTS_SW}Switzer-Semibold.woff2') format('woff2'); font-weight:600; font-style:normal; font-display:swap; }
@font-face { font-family:'HK Switzer'; src:url('${FONTS_SW}Switzer-Bold.woff2') format('woff2'); font-weight:700; font-style:normal; font-display:swap; }
@font-face {
  font-family:'HK Hedvig'; font-weight:400; font-style:normal; font-display:swap;
  src:url('${FONTS_HV}hedvig-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family:'HK Hedvig'; font-weight:400; font-style:normal; font-display:swap;
  src:url('${FONTS_HV}hedvig-latin-ext.woff2') format('woff2');
  unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

.hk-root {
  --hk-gutter: clamp(20px, 5vw, 96px);
  --hk-h1: clamp(2.75rem, 2.6vw + 2.05rem, 6.5rem);
  --hk-h2: clamp(1.875rem, 1.5vw + 1.4rem, 3.25rem);
  --hk-h3: clamp(1.375rem, 0.6vw + 1.15rem, 1.75rem);
  --hk-num: clamp(3.25rem, 5.6vw + 1.1rem, 7.75rem);
  --hk-lead: clamp(1.125rem, 0.35vw + 1rem, 1.375rem);
  --hk-body: clamp(1rem, 0.15vw + 0.95rem, 1.0625rem);
  --hk-label: 11px;
  font-family: ${SWITZER};
  background: ${GROUND}; color: ${INK};
  overflow-x: clip;
  position: relative;
  /* The shared canvas lives in document.body at z-index:1 (webgl.ts); this
     wrapper must out-rank it so every static-flow text node in the page
     paints above the canvas, not beneath it (position:fixed + z-index
     content always paints above non-positioned flow otherwise). */
  z-index: 2;
}
.hk-root ::selection { background: ${INK}; color: ${GROUND}; }
.hk-root :focus-visible { outline: 2px solid ${INK}; outline-offset: 3px; border-radius: 1px; }
.hk-root section, .hk-root header { scroll-margin-top: 64px; }
.hk-root h1, .hk-root h2, .hk-root h3, .hk-root .hk-fit {
  overflow-wrap: break-word; word-break: break-word; hyphens: auto;
}
.hk-serif { font-family: ${HEDVIG}; font-style: normal; font-weight: 400; }

/* ═══ Chrome ═══ */
.hk-chrome-bar { transition: background-color ${DUR.s}s ${EASE}, border-color ${DUR.s}s ${EASE}; }
.hk-chrome-link { transition: color ${DUR.s}s ${EASE}, opacity ${DUR.s}s ${EASE}; }
.hk-chrome-link:hover, .hk-chrome-link[aria-current="true"] { text-decoration: underline; text-underline-offset: .2em; }

/* ═══ Hero name reveal — GSAP SplitText words,chars, the ONLY char/word
   split on the page (repo law: no line-splitting of paragraphs anywhere,
   ever). Word wrappers stay inline-block/nowrap so a line never breaks
   mid-word; descenders get room via the padding/margin pair below. ═══ */
.hk-word { display: inline-block; white-space: nowrap; vertical-align: top; overflow: hidden; padding-bottom: .22em; margin-bottom: -.22em; }
.hk-char { display: inline-block; }

/* ═══ Reveal primitives — h (hero chars only), ctn (opacity+y whole
   element), line (clip-path wipe on hairline rules). No CSS transition on
   any of these: every value here is written once by a fromTo tween toward
   the resting state, never rewritten every scroll tick, so nothing here
   collides with the "no transition on scrub-written properties" rule. ═══ */
[data-hk-reveal] { }

/* ═══ Canvas image wrapper — the visible, hit-testable box the engine
   reads getBoundingClientRect() from every frame. The real <img> inside is
   visibility-hidden only once a plane is actually registered (webgl.ts);
   until then, or with no WebGL/reduced-motion/touch, it stays the visible
   photograph itself. ═══ */
.hk-plane { position: relative; overflow: hidden; background: ${BAND}; }
.hk-plane img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }

.hk-rule { height: 1px; background: ${RULE}; width: 100%; }

/* ═══ Work grid ═══ */
.hk-grid-row { display: grid; gap: var(--hk-gutter); }
@media (min-width: 700px) { .hk-grid-row.hk-grid-row-2 { grid-template-columns: 1fr 1fr; } }
.hk-grid-row-feature { display: grid; gap: calc(var(--hk-gutter) / 2); }
@media (min-width: 700px) { .hk-grid-row-feature { grid-template-columns: 1fr 1fr; } }

/* ═══ Mountain ridge — plain-text roving-tabindex list, small ink ticks on
   the diagram itself (skýringarmynd), never a filled pill/button. ═══ */
.hk-ridge-btn {
  background: none; border: 0; padding: .3em .1em; cursor: pointer; min-height: 44px;
  font-family: ${SWITZER}; color: ${MUTED}; text-align: left;
}
.hk-ridge-btn[aria-pressed="true"] { color: ${INK}; text-decoration: underline; text-underline-offset: .2em; }
.hk-ridge-btn { transition: color ${DUR.s}s ${EASE}; }
.hk-tick { position: absolute; bottom: 0; width: 1px; background: rgba(255,255,255,.55); transition: background-color ${DUR.s}s ${EASE}, height ${DUR.s}s ${EASE}; }
.hk-tick[data-active="true"] { background: #fff; }

/* ═══ Enquiry form — plain fields, plain underlined submit link, no pills,
   no buttons, no icons. ═══ */
.hk-field { width: 100%; min-height: 48px; background: transparent; border: 0; border-bottom: 1px solid rgba(17,17,17,.28); color: ${INK}; font-family: ${SWITZER}; font-size: var(--hk-body); padding: .6em .1em; }
.hk-field::placeholder { color: rgba(17,17,17,.42); }
.hk-field:focus { border-bottom-color: ${INK}; }
.hk-field { transition: border-color ${DUR.s}s ${EASE}; }
select.hk-field { appearance: none; }
.hk-underline-link { color: ${INK}; text-decoration: underline; text-underline-offset: .22em; text-decoration-thickness: 1px; }
.hk-underline-link { transition: opacity ${DUR.s}s ${EASE}; }
@media (hover: hover) { .hk-underline-link:hover { opacity: .62; } }

@media (prefers-reduced-motion: reduce) {
  .hk-hero-video { display: none; }
}
`

/* ═════════════════════════════════════════════════════════════════════════
   WebGL engine context — one CanvasEngine instance for the whole page,
   provided once at Page level, consumed by every CanvasImage.
   ═════════════════════════════════════════════════════════════════════════ */
const EngineContext = createContext<{ engine: CanvasEngine | null; capable: boolean }>({
  engine: null, capable: false,
})
const useEngine = () => useContext(EngineContext)

/* ═════════════════════════════════════════════════════════════════════════
   Small shared pieces
   ═════════════════════════════════════════════════════════════════════════ */
function Kicker({ children, tone = 'ink' }: { children: ReactNode; tone?: 'ink' | 'light' }) {
  return (
    <p className="m-0" style={{
      fontFamily: SWITZER, fontWeight: 600, fontSize: 'var(--hk-label)',
      letterSpacing: '.2em', textTransform: 'uppercase',
      color: tone === 'light' ? 'rgba(255,255,255,.82)' : MUTED,
    }}>
      {children}
    </p>
  )
}

function SectionRule() {
  return <div data-hk-reveal="line" aria-hidden className="hk-rule" />
}

function Serif({ children }: { children: ReactNode }) {
  return <em className="hk-serif">{children}</em>
}

/* Kononenko's mixed-typeface headline device: one word in Hedvig serif, the
   rest in Switzer sans, same line/size. Used for every display headline on
   the page (hero, footer repeat, and the main section h2s). */
function MixedHeading({
  as: Tag = 'h2', sans, serif, size = 'h2', color = INK, className = '', style,
}: {
  as?: 'h1' | 'h2' | 'p'; sans: string; serif: string; size?: 'h1' | 'h2'; color?: string
  className?: string; style?: React.CSSProperties
}) {
  return (
    <Tag
      data-hk-reveal={Tag === 'h1' ? 'h' : 'ctn'}
      className={`hk-fit m-0 ${className}`}
      style={{ fontFamily: SWITZER, fontWeight: 500, color, fontSize: `var(--hk-${size})`, lineHeight: 1.12, letterSpacing: '-.01em', marginTop: '.5em', ...style }}
    >
      {sans}
      {sans && serif ? ' ' : ''}
      <Serif>{serif}</Serif>
    </Tag>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   CanvasImage — the shared DOM twin every image on the page renders through.
   Wrapper stays visible/interactive; the <img> inside is hidden once a
   canvas plane is confirmed registered.
   ═════════════════════════════════════════════════════════════════════════ */
function CanvasImage({
  file, alt, shader, className = '', style, border = false, priority = false, aspect,
}: {
  file: string; alt: string; shader: ShaderKind; className?: string
  style?: React.CSSProperties; border?: boolean; priority?: boolean; aspect?: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const handleRef = useRef<PlaneHandle | null>(null)
  const { engine, capable } = useEngine()

  useEffect(() => {
    if (!capable || !engine) return
    const wrapper = wrapRef.current
    const img = imgRef.current
    if (!wrapper || !img) return
    const handle = engine.register({ wrapper, img, shader, borderPx: border ? 1.5 : 0 })
    handleRef.current = handle
    return () => { handle.destroy(); handleRef.current = null }
  }, [engine, capable, shader, border])

  useEffect(() => {
    if (!capable || shader !== 'sketch' || !canHover()) return
    const wrapper = wrapRef.current
    if (!wrapper) return
    const move = (e: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect()
      const u = clamp01((e.clientX - rect.left) / rect.width)
      const v = clamp01(1 - (e.clientY - rect.top) / rect.height)
      handleRef.current?.setPointer(u, v, true)
    }
    const leave = () => handleRef.current?.setPointer(-1, -1, false)
    wrapper.addEventListener('pointermove', move)
    wrapper.addEventListener('pointerleave', leave)
    return () => {
      wrapper.removeEventListener('pointermove', move)
      wrapper.removeEventListener('pointerleave', leave)
    }
  }, [capable, shader])

  return (
    <div
      ref={wrapRef}
      className={`hk-plane ${className}`}
      style={{ aspectRatio: aspect, ...style }}
      {...(capable ? { role: 'img' as const, 'aria-label': alt } : {})}
    >
      <img
        ref={imgRef}
        src={IMG(file)}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...(priority ? { fetchpriority: 'high' } : {})}
      />
    </div>
  )
}

function TolvumyndLabel({ room }: { room: string }) {
  return (
    <p className="m-0" style={{
      fontFamily: SWITZER, fontWeight: 600, fontSize: '11px', letterSpacing: '.14em',
      textTransform: 'uppercase', color: INK, marginTop: '.6em',
    }}>
      Tölvumynd{room ? ` · ${room}` : ''}
    </p>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   Chrome — three-line stacked wordmark, comma-separated nav, no pills, no
   buttons, no icons. Dark-on-white everywhere; white with a bottom scrim
   only while the hero video is behind it.
   ═════════════════════════════════════════════════════════════════════════ */
function Chrome() {
  const [overHero, setOverHero] = useState(true)

  useEffect(() => {
    const hero = document.getElementById('hk-hero')
    if (!hero) return
    const io = new IntersectionObserver(
      ([entry]) => setOverHero(entry.isIntersecting),
      { rootMargin: '-64px 0px -82% 0px', threshold: 0 },
    )
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  const color = overHero ? '#ffffff' : INK
  const barBg = overHero ? 'transparent' : 'rgba(255,255,255,.92)'
  const barBorder = overHero ? 'transparent' : RULE

  const go = (id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    if (hkLenis) hkLenis.scrollTo(target, { offset: -64 })
    else target.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <div
      className="hk-chrome-bar fixed inset-x-0 top-0 z-40 flex items-start justify-between backdrop-blur-sm"
      style={{ background: barBg, borderBottom: `1px solid ${barBorder}`, padding: '14px var(--hk-gutter)' }}
    >
      <a
        href="#hk-hero"
        onClick={(e) => { e.preventDefault(); if (hkLenis) hkLenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' }) }}
        className="hk-chrome-link inline-flex min-h-[44px] flex-col leading-none"
        style={{ color, fontFamily: SWITZER, fontWeight: 600, fontSize: '13px', letterSpacing: '.01em' }}
      >
        <span>Heklusýn</span>
        <span style={{ opacity: .68, fontWeight: 400 }}>Rangárslétta</span>
        <span style={{ opacity: .68, fontWeight: 400 }}>Ytri-Rangá</span>
      </a>
      <nav aria-label="Kaflar síðunnar" className="hidden min-h-[44px] items-center gap-5 pt-1 lg:flex">
        {NAV.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => go(n.id)}
            className="hk-chrome-link whitespace-nowrap"
            style={{ color, fontFamily: SWITZER, fontWeight: 500, fontSize: '13px' }}
          >
            {n.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §1 Hero — poster-first video slot, giant mixed-type bottom-left name.
   ═════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const [reduced] = useState(() => prefersReduced())
  return (
    <header id="hk-hero" className="relative" style={{ height: '100svh', minHeight: 560, overflow: 'hidden', background: INK }}>
      {reduced ? (
        <img
          src={IMG(PHOTOS.heroEstate.file)} alt={PHOTOS.heroEstate.alt}
          loading="eager" decoding="async" {...{ fetchpriority: 'high' }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <video
          className="hk-hero-video absolute inset-0 h-full w-full object-cover"
          autoPlay muted loop playsInline
          poster={IMG(PHOTOS.heroEstate.file)}
        >
          <source src={FILM} type="video/mp4" />
        </video>
      )}
      <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,.08) 0%, rgba(0,0,0,.18) 40%, rgba(0,0,0,.72) 78%, rgba(0,0,0,.86) 100%)' }} />

      <div className="relative z-10 flex h-full flex-col justify-end" style={{ padding: `0 var(--hk-gutter) clamp(28px, 6vh, 64px)` }}>
        <p data-hk-reveal="ctn" className="m-0" style={{ fontFamily: SWITZER, fontWeight: 600, fontSize: 'var(--hk-label)', letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,.82)' }}>
          {company.location}
        </p>
        <h1
          data-hk-reveal="h"
          className="hk-fit m-0"
          style={{ fontFamily: SWITZER, fontWeight: 500, color: '#fff', fontSize: 'var(--hk-h1)', lineHeight: 1.05, letterSpacing: '-.015em', marginTop: '.2em' }}
        >
          Heklusýn <Serif>við Ytri-Rangá</Serif>
        </h1>
        <p data-hk-reveal="ctn" className="m-0" style={{ fontFamily: SWITZER, color: 'rgba(255,255,255,.86)', fontSize: 'var(--hk-body)', lineHeight: 1.6, marginTop: '1.1em', maxWidth: '30em' }}>
          Fimmtíu hektarar á vesturbakka Ytri-Rangár. Tólf til fjórtán hús á öllu svæðinu, ekkert fleira.
        </p>
      </div>
    </header>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §2 Manifesto + fact ledger — Fágæti og kyrrð
   ═════════════════════════════════════════════════════════════════════════ */
const LEDGER: Array<[string, string]> = [
  ['Landið', '50 hektarar'],
  ['Hús', '12 til 14'],
  ['Lóðir', 'allt að 5 hekturum'],
  ['Upphaf', 'Leirubakki, sjálfstæð eign 2020'],
  ['Áin', 'Ytri-Rangá'],
  ['Verð', 'frá 109.000.000 kr.'],
]

function Manifesto() {
  return (
    <section id="hk-thesis" style={{ padding: 'clamp(64px, 11vw, 140px) var(--hk-gutter)' }}>
      <Kicker>Fágætið</Kicker>
      <SectionRule />
      <MixedHeading sans="Fágæti og" serif="kyrrð" />
      <p data-hk-reveal="ctn" style={{ fontFamily: SWITZER, color: INK, fontSize: 'var(--hk-lead)', lineHeight: 1.6, maxWidth: '34em', marginTop: '1em' }}>
        Fimmtíu hektarar liggja að Ytri-Rangá. Þar munu aðeins tólf til fjórtán hús rísa, hvert á lóð sem getur
        orðið allt að fimm hekturum að stærð. Landinu var ekki skipt í sem flestar lóðir. Því var úthlutað í
        tólf til fjórtán.
      </p>

      <dl className="m-0" style={{ marginTop: 'clamp(32px, 5vw, 56px)' }}>
        {LEDGER.map(([label, value]) => (
          <div key={label} data-hk-reveal="ctn" className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1" style={{ borderTop: `1px solid ${RULE}`, padding: '1.1em 0' }}>
            <dt className="m-0" style={{ fontFamily: SWITZER, fontWeight: 600, fontSize: 'var(--hk-label)', letterSpacing: '.16em', textTransform: 'uppercase', color: MUTED }}>{label}</dt>
            <dd className="m-0" style={{ fontFamily: SWITZER, fontWeight: 500, fontSize: 'var(--hk-lead)', color: INK }}>{value}</dd>
          </div>
        ))}
        <div aria-hidden style={{ borderTop: `1px solid ${RULE}` }} />
      </dl>
    </section>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §3 Landið — origin, two real photographs
   ═════════════════════════════════════════════════════════════════════════ */
function Land() {
  return (
    <section id="hk-land" style={{ padding: '0 var(--hk-gutter) clamp(64px, 11vw, 140px)' }}>
      <MixedHeading sans="Landið heldur" serif="húsinu" />
      <p data-hk-reveal="ctn" style={{ fontFamily: SWITZER, color: INK, fontSize: 'var(--hk-body)', lineHeight: 1.7, maxWidth: '34em', marginTop: '1em' }}>
        Landið var áður hluti af sögulegu bújörðinni Leirubakka. Það varð sjálfstæð eign við Ytri-Rangá árið
        2020, félagið sjálft skráð ári síðar. Á svæðinu er þess gætt að raska sem minnst núverandi
        hraunmyndunum, mosa og gróðri sem fyrir er.
      </p>

      <div className="grid gap-4 sm:grid-cols-2" style={{ marginTop: 'clamp(28px, 4vw, 48px)' }}>
        <div>
          <CanvasImage file={PHOTOS.houseAutumn.file} alt={PHOTOS.houseAutumn.alt} shader="media" aspect="4/3" />
          <p className="m-0" style={{ fontFamily: SWITZER, color: MUTED, fontSize: '13px', marginTop: '.6em' }}>Húsið á haustbakkanum</p>
        </div>
        <div>
          <CanvasImage file={PHOTOS.winterDusk.file} alt={PHOTOS.winterDusk.alt} shader="media" aspect="4/3" />
          <p className="m-0" style={{ fontFamily: SWITZER, color: MUTED, fontSize: '13px', marginTop: '.6em' }}>Vetrarkvöld á svæðinu</p>
        </div>
      </div>
    </section>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §4 Services line — one long h2, comma-separated
   ═════════════════════════════════════════════════════════════════════════ */
function Services() {
  return (
    <section id="hk-services" style={{ padding: '0 var(--hk-gutter) clamp(64px, 11vw, 140px)' }}>
      <Kicker>Umfangið</Kicker>
      <SectionRule />
      <h2
        data-hk-reveal="ctn"
        className="hk-fit m-0"
        style={{ fontFamily: SWITZER, fontWeight: 500, color: INK, fontSize: 'var(--hk-h2)', lineHeight: 1.18, marginTop: '.5em', maxWidth: '22em' }}
      >
        Heilsárshús, lóðir, hönnun, <Serif>bygging</Serif>
      </h2>
    </section>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §5 Method pair — Frá teikningu að húsi
   ═════════════════════════════════════════════════════════════════════════ */
function Method() {
  return (
    <section id="hk-method" style={{ padding: '0 var(--hk-gutter) clamp(64px, 11vw, 140px)' }}>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <Kicker>Ferlið</Kicker>
          <SectionRule />
          <MixedHeading sans="Frá teikningu að" serif="húsi" />
          <p data-hk-reveal="ctn" style={{ fontFamily: SWITZER, color: INK, fontSize: 'var(--hk-body)', lineHeight: 1.7, maxWidth: '30em', marginTop: '1em' }}>
            Hönnunargögn og teikningar frá þróunaraðila liggja til grundvallar hverju húsi. Grunnmyndin er fyrsta
            skrefið, húsið sjálft það síðasta.
          </p>
        </div>
        <div>
          <CanvasImage file={VISUALS.plan.file} alt={VISUALS.plan.alt} shader="sketch" aspect="4/3" />
          <TolvumyndLabel room={VISUALS.plan.room} />
        </div>
      </div>
    </section>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §6 Work grid — Húsin. Alternating 2/1/2, Kononenko's own pattern.
   ═════════════════════════════════════════════════════════════════════════ */
type GridAssign = { shader: ShaderKind; file: string; alt: string; room?: string }
const GRID_MEDIA: Record<string, GridAssign | [GridAssign, GridAssign]> = {
  'Rangárslétta 2': [
    { shader: 'media', file: PHOTOS.construction.file, alt: PHOTOS.construction.alt },
    { shader: 'media', file: PHOTOS.houseBuilt.file, alt: PHOTOS.houseBuilt.alt },
  ],
  'Rangárslétta 3': { shader: 'sketch', file: VISUALS.living.file, alt: VISUALS.living.alt, room: VISUALS.living.room },
  'Rangárslétta 9': { shader: 'sketch', file: VISUALS.kitchen.file, alt: VISUALS.kitchen.alt, room: VISUALS.kitchen.room },
  'Rangárslétta 10': { shader: 'sketch', file: VISUALS.exterior.file, alt: VISUALS.exterior.alt, room: VISUALS.exterior.room },
  'Rangárslétta 11': { shader: 'sketch', file: VISUALS.plan.file, alt: VISUALS.plan.alt, room: VISUALS.plan.room },
}

function GridCaption({ house }: { house: (typeof HOUSES)[number] }) {
  const sold = house.statuses.includes('selt')
  return (
    <div style={{ marginTop: '.8em' }}>
      <p className="m-0 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span style={{
          fontFamily: SWITZER, fontWeight: 600, color: INK, fontSize: 'var(--hk-h3)',
          textDecoration: sold ? 'line-through' : 'none', textDecorationColor: MUTED, textDecorationThickness: '1.5px',
        }}>
          {house.name}
        </span>
        {house.price ? <span style={{ fontFamily: SWITZER, fontWeight: 600, color: INK, fontSize: 'var(--hk-body)' }}>{house.price}</span> : null}
      </p>
      <p className="m-0" style={{ fontFamily: SWITZER, color: MUTED, fontSize: 'var(--hk-body)', marginTop: '.3em' }}>
        {[house.size, house.plot].filter(Boolean).join(' · ') || 'Stærð og lóð ekki gefin upp'}
      </p>
      <p className="m-0" style={{ fontFamily: SWITZER, fontWeight: 600, color: INK, fontSize: '12px', letterSpacing: '.06em', textTransform: 'uppercase', marginTop: '.5em' }}>
        {house.statuses.map((s) => STATUS_LABEL[s]).join(' · ')}
      </p>
    </div>
  )
}

function GridTile({ house }: { house: (typeof HOUSES)[number] }) {
  const assign = GRID_MEDIA[house.name]
  return (
    <div data-hk-reveal="ctn">
      {Array.isArray(assign) ? (
        <div className="grid grid-cols-2 gap-2">
          {assign.map((a) => (
            <CanvasImage key={a.file} file={a.file} alt={a.alt} shader={a.shader} aspect="4/3" border />
          ))}
        </div>
      ) : (
        <CanvasImage file={assign.file} alt={assign.alt} shader={assign.shader} aspect="4/3" border />
      )}
      {!Array.isArray(assign) && assign.shader === 'sketch' ? <TolvumyndLabel room={assign.room ?? ''} /> : null}
      <GridCaption house={house} />
    </div>
  )
}

function WorkGrid() {
  const rows: Array<(typeof HOUSES)[number][]> = [
    [HOUSES[1], HOUSES[2]], // R3, R9
    [HOUSES[0]], // R2 — feature
    [HOUSES[3], HOUSES[4]], // R10, R11
  ]
  return (
    <section id="hk-houses" style={{ padding: '0 var(--hk-gutter) clamp(64px, 11vw, 140px)' }}>
      <Kicker>Staða húsanna</Kicker>
      <SectionRule />
      <MixedHeading sans="Fimm hús á" serif="landinu" />
      <p data-hk-reveal="ctn" style={{ fontFamily: SWITZER, color: MUTED, fontSize: 'var(--hk-body)', lineHeight: 1.6, maxWidth: '34em', marginTop: '1em' }}>
        Seld hús standa áfram í skránni og með yfirstrikun, því fágætið er röksemdin.
      </p>

      <div className="flex flex-col" style={{ gap: 'clamp(40px, 6vw, 72px)', marginTop: 'clamp(36px, 5vw, 64px)' }}>
        {rows.map((row, i) => (
          <div key={i} className={row.length === 2 ? 'hk-grid-row hk-grid-row-2' : 'hk-grid-row-feature'}>
            {row.map((house) => <GridTile key={house.name} house={house} />)}
          </div>
        ))}
      </div>
    </section>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §7 Mountains — Sjóndeildarhringurinn, restyled monochrome
   ═════════════════════════════════════════════════════════════════════════ */
function Mountains() {
  const [selected, setSelected] = useState(0)
  const [focusIdx, setFocusIdx] = useState(0)
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([])

  const move = (next: number) => {
    const clamped = (next + MOUNTAINS.length) % MOUNTAINS.length
    setFocusIdx(clamped)
    setSelected(clamped)
    btnRefs.current[clamped]?.focus()
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); move(focusIdx + 1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); move(focusIdx - 1) }
    else if (e.key === 'Home') { e.preventDefault(); move(0) }
    else if (e.key === 'End') { e.preventDefault(); move(MOUNTAINS.length - 1) }
  }

  return (
    <section id="hk-horizon" style={{ padding: '0 var(--hk-gutter) clamp(64px, 11vw, 140px)' }}>
      <Kicker>Fjöllin átta</Kicker>
      <SectionRule />
      <MixedHeading sans="Fjöllin" serif="átta" />
      <p data-hk-reveal="ctn" style={{ fontFamily: SWITZER, color: INK, fontSize: 'var(--hk-body)', lineHeight: 1.6, maxWidth: '34em', marginTop: '1em' }}>
        Frá landinu sjást átta fjöll. Þau eru nefnd hér og staðsett á myndinni til skýringar, ekki eftir mældri
        hnitasetningu. Veldu nafn til að sjá það á sjóndeildarhringnum.
      </p>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,220px)_1fr] lg:items-center" style={{ marginTop: 'clamp(28px, 4vw, 48px)' }}>
        <div
          role="group"
          aria-label="Fjöllin átta"
          onKeyDown={onKeyDown}
          className="flex flex-row flex-wrap gap-x-4 gap-y-1 lg:flex-col lg:gap-y-2"
        >
          {MOUNTAINS.map((m, i) => (
            <button
              key={m.name}
              ref={(el) => { btnRefs.current[i] = el }}
              type="button"
              aria-pressed={selected === i}
              tabIndex={focusIdx === i ? 0 : -1}
              onClick={() => { setSelected(i); setFocusIdx(i) }}
              className="hk-ridge-btn"
              style={{ fontSize: '14px' }}
            >
              {m.name}
            </button>
          ))}
        </div>

        <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
          <CanvasImage file={PHOTOS.landRiver.file} alt={PHOTOS.landRiver.alt} shader="media" className="absolute inset-0 h-full w-full" />
          <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,.08) 0%, rgba(0,0,0,.5) 100%)' }} />
          <span aria-hidden className="absolute left-3 top-3" style={{ fontFamily: SWITZER, fontWeight: 600, fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#fff' }}>
            Skýringarmynd
          </span>
          {MOUNTAINS.map((m, i) => (
            <span key={m.name} aria-hidden className="hk-tick" data-active={selected === i} style={{ left: `${m.pos}%`, height: selected === i ? '18px' : '9px' }} />
          ))}
          <p aria-live="polite" className="hk-fit absolute inset-x-0 bottom-0 m-0 text-center" style={{ color: '#fff', fontSize: 'var(--hk-h3)', padding: '0 16px 20px' }}>
            <Serif>{MOUNTAINS[selected].name}</Serif>
          </p>
        </div>
      </div>
    </section>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §8 Gögnin — compliance as monument
   ═════════════════════════════════════════════════════════════════════════ */
function Docs() {
  return (
    <section id="hk-docs" style={{ padding: '0 var(--hk-gutter) clamp(64px, 11vw, 140px)' }}>
      <Kicker>Tæknileg gögn</Kicker>
      <SectionRule />
      <MixedHeading sans="Gögnin og" serif="gagnsæi" />

      <div className="grid gap-8 sm:grid-cols-3" style={{ marginTop: 'clamp(28px, 4vw, 48px)' }}>
        {DOCUMENTS.map((d) => (
          <div key={d.label} data-hk-reveal="ctn">
            <p className="m-0" style={{ fontFamily: SWITZER, fontWeight: 500, color: INK, fontSize: 'var(--hk-h3)', lineHeight: 1.1 }}>{d.count}</p>
            <p className="m-0" style={{ fontFamily: SWITZER, fontWeight: 600, color: INK, fontSize: '13px', letterSpacing: '.02em', textTransform: 'uppercase', marginTop: '.3em' }}>{d.label}</p>
            <p className="m-0" style={{ fontFamily: SWITZER, color: MUTED, fontSize: 'var(--hk-body)', lineHeight: 1.6, marginTop: '.3em' }}>{d.note}</p>
          </div>
        ))}
      </div>
      <p data-hk-reveal="ctn" style={{ fontFamily: SWITZER, color: MUTED, fontSize: 'var(--hk-body)', lineHeight: 1.7, maxWidth: '32em', marginTop: 'clamp(28px, 4vw, 48px)', borderTop: `1px solid ${RULE}`, paddingTop: '1.2em' }}>
        Skjölin eru þróunaraðilans eigin gögn og eru ekki endurbirt hér.
      </p>
    </section>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §9 Stat monument
   ═════════════════════════════════════════════════════════════════════════ */
function Stats() {
  const sold = HOUSES.filter((h) => h.statuses.includes('selt')).length
  const stats: Array<[string, string]> = [
    ['2020', 'Landið sjálfstæð eign'],
    ['50', 'Hektarar'],
    ['12 til 14', 'Hús'],
    [String(sold), 'Seld'],
  ]
  return (
    <section id="hk-stats" style={{ padding: '0 var(--hk-gutter) clamp(64px, 11vw, 140px)' }}>
      <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([num, label]) => (
          <div key={label} data-hk-reveal="ctn">
            <p className="hk-fit m-0" style={{ fontFamily: SWITZER, fontWeight: 500, color: INK, fontSize: num.length > 5 ? 'var(--hk-h2)' : 'var(--hk-num)', lineHeight: 1 }}>{num}</p>
            <p className="m-0" style={{ fontFamily: SWITZER, fontWeight: 600, color: MUTED, fontSize: '12px', letterSpacing: '.08em', textTransform: 'uppercase', marginTop: '.6em' }}>{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   §10 Fyrirspurn + footer
   ═════════════════════════════════════════════════════════════════════════ */
function Enquiry() {
  const [name, setName] = useState('')
  const [addr, setAddr] = useState('')
  const [house, setHouse] = useState(ENQUIRY_HOUSES[0])

  const mailHref = useMemo(() => {
    const subject = `Fyrirspurn um ${house}`
    const bodyLines = [
      `Nafn: ${name || '[nafn]'}`,
      `Netfang: ${addr || '[netfang]'}`,
      `Hús: ${house}`,
      '',
      'Skrifaðu skilaboð hér.',
    ]
    return `${EMAIL_HREF}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`
  }, [name, addr, house])

  return (
    <section id="hk-enquiry" style={{ padding: 'clamp(64px, 11vw, 140px) var(--hk-gutter) clamp(48px, 8vw, 96px)' }}>
      <Kicker>Hafa samband</Kicker>
      <SectionRule />
      <h2 data-hk-reveal="ctn" className="m-0" style={{ fontFamily: SWITZER, fontWeight: 500, color: INK, fontSize: 'var(--hk-h2)', lineHeight: 1.15, marginTop: '.5em' }}>
        Fyrirspurn
      </h2>

      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]" style={{ marginTop: 'clamp(28px, 4vw, 48px)' }}>
        <form
          data-hk-reveal="ctn"
          className="flex flex-col gap-6"
          onSubmit={(e) => { e.preventDefault(); window.location.href = mailHref }}
        >
          <div>
            <label htmlFor="hk-f-name" className="sr-only">Nafn</label>
            <input id="hk-f-name" className="hk-field" placeholder="Nafn" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </div>
          <div>
            <label htmlFor="hk-f-email" className="sr-only">Netfang</label>
            <input id="hk-f-email" type="email" className="hk-field" placeholder="Netfang" value={addr} onChange={(e) => setAddr(e.target.value)} autoComplete="email" />
          </div>
          <div>
            <label htmlFor="hk-f-house" className="sr-only">Hvaða hús</label>
            <select id="hk-f-house" className="hk-field" value={house} onChange={(e) => setHouse(e.target.value)}>
              {ENQUIRY_HOUSES.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <a href={mailHref} className="hk-underline-link inline-flex min-h-[44px] items-center self-start" style={{ fontFamily: SWITZER, fontWeight: 600, fontSize: '15px' }}>
            Senda fyrirspurn
          </a>
          <p style={{ fontFamily: SWITZER, color: MUTED, fontSize: '13px', lineHeight: 1.5, maxWidth: '26em' }}>
            Opnast í tölvupóstforritinu þínu, stílað á {EMAIL}.
          </p>
        </form>

        <div data-hk-reveal="ctn" className="flex flex-col gap-6">
          <div>
            <p className="m-0" style={{ fontFamily: SWITZER, fontWeight: 600, fontSize: 'var(--hk-label)', letterSpacing: '.16em', textTransform: 'uppercase', color: MUTED }}>Bein leið</p>
            <a href={EMAIL_HREF} className="hk-underline-link mt-2 block" style={{ fontFamily: SWITZER, fontWeight: 500, fontSize: 'var(--hk-lead)' }}>{EMAIL}</a>
            <a href={PHONE_HREF} className="mt-1 block" style={{ fontFamily: SWITZER, color: INK, fontSize: 'var(--hk-body)' }}>{PHONE_DISPLAY}</a>
          </div>
          <div style={{ borderTop: `1px solid ${RULE}`, paddingTop: '1.2em' }}>
            <p className="m-0" style={{ fontFamily: SWITZER, fontWeight: 600, fontSize: 'var(--hk-label)', letterSpacing: '.16em', textTransform: 'uppercase', color: MUTED }}>Félagið</p>
            <p className="mt-2" style={{ fontFamily: SWITZER, color: INK, fontSize: 'var(--hk-body)', lineHeight: 1.6 }}>{COMPANY_LINE}<br />{COMPANY_ADDRESS}</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 'clamp(72px, 12vw, 160px)', borderTop: `1px solid ${RULE}`, paddingTop: 'clamp(28px, 4vw, 48px)' }}>
        <p data-hk-reveal="ctn" className="hk-fit m-0" style={{ fontFamily: SWITZER, fontWeight: 500, color: INK, fontSize: 'var(--hk-h1)', lineHeight: 1.02, letterSpacing: '-.015em' }}>
          Heklusýn <Serif>við Ytri-Rangá</Serif>
        </p>
        <p className="m-0" style={{ fontFamily: SWITZER, color: MUTED, fontSize: '13px', lineHeight: 1.6, marginTop: 'clamp(20px, 3vw, 32px)' }}>
          {COMPANY_LINE} · {COMPANY_ADDRESS}
        </p>
      </div>
    </section>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
   Page
   ═════════════════════════════════════════════════════════════════════════ */
export default function HeklusynPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [engineState, setEngineState] = useState<{ engine: CanvasEngine | null; capable: boolean }>({ engine: null, capable: false })

  useEffect(() => {
    document.title = 'Heklusýn · Tólf hús á fimmtíu hekturum'
    setThemeColor(GROUND)
    let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const created = !tag
    if (!tag) {
      tag = document.createElement('meta')
      tag.name = 'description'
      document.head.appendChild(tag)
    }
    const prev = tag.content
    tag.content = 'Fimmtíu hektarar við Ytri-Rangá, tólf til fjórtán hús. Sjóndeildarhringurinn, húsin og landið sjálft, í stað verðlauss PDF-safns.'
    return () => {
      if (created) tag?.remove()
      else if (tag) tag.content = prev
    }
  }, [])

  /* The WebGL canvas + Lenis share one capability gate (KONONENKO-BRIEF §7):
     no WebGL, prefers-reduced-motion, or a coarse (touch) primary pointer
     ⇒ neither is created; every CanvasImage's real <img> simply stays
     visible, exactly the reference's own fallback shape. */
  useEffect(() => {
    const capable = !prefersReduced() && hasWebGL() && !isCoarsePointer()
    if (!capable) { setEngineState({ engine: null, capable: false }); return }
    // A throw during engine construction must degrade to plain DOM images,
    // never take down the React tree (THREE API drift did exactly that on
    // the sister page).
    let engine: CanvasEngine | null = null
    try { engine = new CanvasEngine(BASE) } catch { engine = null }
    if (!engine) { setEngineState({ engine: null, capable: false }); return }
    setEngineState({ engine, capable: true })

    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    hkLenis = lenis
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      hkLenis = null
      engine.dispose()
      setEngineState({ engine: null, capable: false })
    }
  }, [])

  /* Text reveals — gated on prefers-reduced-motion only (independent of the
     WebGL/Lenis capability gate above: a desktop visitor without WebGL
     support still gets ordinary fade/char reveals on native scroll). Every
     tween is fromTo(...) toward the resting state React already rendered;
     the only char/word split is the hero h1. */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const mm = gsap.matchMedia()
    mm.add({ motion: '(prefers-reduced-motion: no-preference)' }, (ctx) => {
      const c = ctx.conditions as { motion: boolean }
      if (!c.motion) return undefined

      const splits: SplitText[] = []
      const revealEls = Array.from(root.querySelectorAll<HTMLElement>('[data-hk-reveal]'))
      revealEls.forEach((el) => {
        const kind = el.dataset.hkReveal
        const st = { trigger: el, start: 'top 88%', toggleActions: 'play none none none', once: true } as const

        if (kind === 'h') {
          splits.push(SplitText.create(el, {
            type: 'words,chars', wordsClass: 'hk-word', charsClass: 'hk-char', autoSplit: false,
            onSplit: (self) => {
              gsap.fromTo(self.chars, { yPercent: 112 }, {
                yPercent: 0, duration: DUR.l, ease: EASE, stagger: STAGGER,
                scrollTrigger: { ...st, start: 'top 95%' },
              })
              return undefined
            },
          }))
        } else if (kind === 'line') {
          gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, {
            clipPath: 'inset(0 0 0% 0)', duration: DUR.m, ease: EASE,
            scrollTrigger: { ...st, start: 'top 94%' },
          })
        } else {
          gsap.fromTo(el, { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: DUR.m, ease: EASE,
            scrollTrigger: st,
          })
        }
      })

      document.fonts.ready.then(() => ScrollTrigger.refresh())

      /* Failsafe: 2s after mount, clear any leftover inline reveal styles
         regardless of trigger state. clearProps limited to
         transform/clipPath ONLY — never 'all', which would also wipe
         React's own inline fontSize/color/fontFamily. */
      const failsafe = window.setTimeout(() => {
        gsap.set(
          root.querySelectorAll('[data-hk-reveal], [data-hk-reveal] *'),
          { opacity: 1, clearProps: 'transform,clipPath' },
        )
      }, 2000)

      return () => {
        window.clearTimeout(failsafe)
        splits.forEach((sp) => sp.revert())
      }
    })
    return () => { mm.revert() }
  }, [])

  return (
    <EngineContext.Provider value={engineState}>
      <div ref={rootRef} className="hk-root" lang="is">
        <style>{PAGE_STYLES}</style>
        <Chrome />
        <main>
          <Hero />
          <Manifesto />
          <Land />
          <Services />
          <Method />
          <WorkGrid />
          <Mountains />
          <Docs />
          <Stats />
          <Enquiry />
        </main>
        <PreviewFooter company={company} />
        <PreviewChrome company={company} />
      </div>
    </EngineContext.Provider>
  )
}
