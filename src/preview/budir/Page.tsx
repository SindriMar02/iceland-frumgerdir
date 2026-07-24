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
  IMG, EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF, ADDRESS,
  BOOKING_URL, MAP_EMBED, MAP_LINK, NAV, HERO, RAILS, ROOMS, ROOMS_NOTE,
  RESTAURANT, SAGA, WEDDINGS, PLACE, PHOTOS, JSON_LD,
} from './data'

gsap.registerPlugin(ScrollTrigger, SplitText)

const company = getPreviewCompany('budir')

/* Module-scoped handle to the desktop horizontal journey so anchor nav can
   map a panel to its vertical scroll offset (labelToScroll pattern). Set and
   cleared by Page()'s matchMedia branch. */
let journeyNav: { master: ScrollTrigger; track: HTMLElement } | null = null

/* ── „Svarti punkturinn" — the black anchor. ────────────────────────────────
   The cream hotel and the black church are the only fixed things in a
   landscape that never repeats. System: warm bone paper, black ink bands,
   colossal ultralight Boska serif sitting ON a horizon line, a sky that
   changes colour across the whole scroll while the black type and the
   photographs stay put. Lineage: normalisboring.es (cropped ultralight
   display, italic-serif interruptions, masked SplitText reveals, vertical
   rails, disassembled lockup, tiny typographic furniture). ──────────────── */

/* Palette — computed WCAG ratios (relative luminance):
   INK  #111111 on BONE #EFEAE0 ..... 15.75:1 (AAA) — and inverted on bands
   OLIVE #8A8455 on BONE ............  3.18:1 — LARGE display text only
   OLIVE_INK #5F5A38 on BONE ........  5.83:1 (AA small) · 5.4:1 on dusk tint
   BRASS #A8802F on BONE ............  3.02:1 — decorative accents only
   BRASS on INK band ................  5.21:1 — tiny furniture on black OK
   ink @62% on bone ≈ 4.9:1 · bone @80% on ink ≈ 10.6:1 · @64% ≈ 7.1:1  */
const BONE = '#EFEAE0'
const INK = '#111111'
const OLIVE = '#8A8455'      // large display accents only (restaurant wall)
const OLIVE_INK = '#5F5A38'  // small-text-safe olive
const BRASS = '#A8802F'      // the single saturated accent — tiny uses only

const INK_SOFT = 'rgba(17,17,17,.80)'
const INK_MUTE = 'rgba(17,17,17,.62)'
const BONE_SOFT = 'rgba(239,234,224,.82)'
const BONE_MUTE = 'rgba(239,234,224,.64)'
const HAIR_INK = 'rgba(17,17,17,.16)'
const HAIR_BONE = 'rgba(239,234,224,.20)'

const GROTESK = 'var(--font-familjen)'
const SERIF = "'Boska', 'Cormorant Garamond', Georgia, serif"

const FONTS = `${import.meta.env.BASE_URL}fonts/boska/`

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A8802F]'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ── Sky scrub — one scrubbed value drives the whole world. Everything is
   derived from raw progress inside a single onUpdate (craft-ledger rule). ── */
interface SkyStop { p: number; hi: string; lo: string; ground: string }
const SKY_STOPS: SkyStop[] = [
  { p: 0.0, hi: '#F3EDDD', lo: '#EDE1C7', ground: '#EFEAE0' }, // dögun — bone
  { p: 0.36, hi: '#D7E1E6', lo: '#ECEFEB', ground: '#EAEDEA' }, // dagur — pale blue
  { p: 0.7, hi: '#E9D8AC', lo: '#F0E5C7', ground: '#F0E8D3' }, // gyllt síðdegi
  { p: 1.0, hi: '#5C6874', lo: '#9FA7AE', ground: '#E2E0DA' }, // rökkur — slate
]
function mixHex(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16)
  const pb = parseInt(b.slice(1), 16)
  const ch = (shift: number) => {
    const va = (pa >> shift) & 255
    const vb = (pb >> shift) & 255
    return Math.round(va + (vb - va) * t)
  }
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`
}
function skyAt(p: number): { hi: string; lo: string; ground: string } {
  const clamped = Math.min(1, Math.max(0, p))
  let i = 0
  while (i < SKY_STOPS.length - 2 && clamped > SKY_STOPS[i + 1].p) i += 1
  const a = SKY_STOPS[i]
  const b = SKY_STOPS[i + 1]
  const t = (clamped - a.p) / (b.p - a.p)
  return { hi: mixHex(a.hi, b.hi, t), lo: mixHex(a.lo, b.lo, t), ground: mixHex(a.ground, b.ground, t) }
}

/* ── Page-local styles: Boska @font-face, bu- keyframes, media-gated rooms
   rail, reduced-motion neutralisation. Nothing leaks outside bu-. ────────── */
const PAGE_STYLES = `
@font-face {
  font-family: 'Boska';
  src: url('${FONTS}Boska-Extralight.woff2') format('woff2');
  font-weight: 200; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Boska';
  src: url('${FONTS}Boska-ExtralightItalic.woff2') format('woff2');
  font-weight: 200; font-style: italic; font-display: swap;
}
@font-face {
  font-family: 'Boska';
  src: url('${FONTS}Boska-Light.woff2') format('woff2');
  font-weight: 300; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Boska';
  src: url('${FONTS}Boska-LightItalic.woff2') format('woff2');
  font-weight: 300; font-style: italic; font-display: swap;
}

.bu-root {
  --bu-sky-hi: ${SKY_STOPS[0].hi};
  --bu-sky-lo: ${SKY_STOPS[0].lo};
  --bu-ground: ${SKY_STOPS[0].ground};
}
.bu-root ::selection { background: ${INK}; color: ${BONE}; }

/* Boska Extralight metrics (upm 1000, asc 960, desc 250, cap 715, Ú accent
   715–925). Chars get line-height 1.21 (= (asc+desc)/upm) so each
   inline-block's background box starts exactly at the ascender — then on the
   hero Ú the zone above 19.6% of that box is the acute accent only, and
   painting it brass via background-clip touches no cap stroke. */
.bu-hero-char, .bu-pre-char { display: inline-block; line-height: 1.21; will-change: transform; }
.bu-u-accent {
  background: linear-gradient(180deg, ${BRASS} 0 19.6%, ${INK} 19.6%);
  background-repeat: no-repeat;
  -webkit-background-clip: text; background-clip: text;
  color: transparent;
}

/* The hero mask: clipped at the HORIZON (wrapper), never per-line — accents
   get 0.24em of headroom, the baseline is pulled to the mask's bottom edge
   (descent = 0.25em below it) so the caps stand exactly on the line. */
.bu-hero-mask { overflow: hidden; padding-top: 0.24em; }
.bu-hero-word { line-height: 1; margin-bottom: -0.25em; }

.bu-pre-mask { overflow: hidden; padding-top: 0.24em; }

/* Mask headroom (item 3): SplitText char masks clip to the char's line-box, so
   any Boska line-height below the glyph's full em extent (asc .96 + desc .25 =
   1.21) guillotines accents/descenders (Í acute, g/j/þ/p descenders). Force a
   comfortable ≥1.28 on every char-split display element (eras + panel titles)
   so the reveal clips the MOTION, never the GLYPH. Beats the inline/desktop
   line-heights those headings set. */
.bu-chars { line-height: 1.28 !important; }

.bu-vert { writing-mode: vertical-rl; transform: rotate(180deg); }

/* Photo base saturation. The come-closer zoom lives on .bu-media-down (never
   a GSAP target — the peel/parallax animate .bu-media-up / .bu-media-source,
   so a CSS transform here can never fight an inline GSAP transform). */
.bu-photo .bu-photo-img { filter: saturate(.84); }
.bu-photo:hover .bu-photo-img { filter: saturate(1); }
.bu-photo:hover .bu-media-down { transform: scale(1.04); }
/* Brass inset frame draws in — the cohesive "come closer" cue. */
.bu-flip-frame::after {
  content: ''; position: absolute; inset: 0; z-index: 4; pointer-events: none;
  border: 1px solid ${BRASS}; opacity: 0; transform: scale(1.03); transform-origin: center;
}
.bu-photo:hover .bu-flip-frame::after { opacity: .85; transform: scale(1); }
.bu-photo figcaption { opacity: .82; }
.bu-photo:hover figcaption { opacity: 1; }

/* flipMedia (the reference's measured recipe): every frame stacks TWO copies
   of the same image. The top copy (.bu-media-up) peels away — clip-path
   inset driven by a CSS var for the lateral variants, y for upDown — while
   the source copy beneath settles. Reduced motion drops the top copy
   entirely; the resting state is always the bare visible photo. */
.bu-media-down { position: absolute; inset: 0; overflow: hidden; }
.bu-media-up {
  position: absolute; inset: 0; overflow: hidden;
  --bu-clip: 0% 0% 0% 0%;
  clip-path: inset(var(--bu-clip));
}
@media (prefers-reduced-motion: reduce) { .bu-media-up { display: none; } }

/* Fixed journey progress bar — the visible signal that the page is
   advancing sideways. Fills 0→100% with the master trigger's progress. */
.bu-progress {
  position: fixed; left: 0; bottom: 0; z-index: 50;
  height: 3px; width: 100%; transform-origin: left center;
  transform: scaleX(0); background: ${BRASS}; pointer-events: none;
}
@media (prefers-reduced-motion: reduce) { .bu-progress { display: none; } }

/* Small-furniture mask-rise (labels, specs, hours) — assembles via
   containerAnimation as its panel slides in. Reduced motion / no-JS rests
   fully visible; JS arms the hidden start. */
.bu-up { will-change: transform, opacity; }

/* Staðurinn photos — vertical stack by default; a lateral row inside the
   journey (media block below). */
.bu-place-strip { display: grid; gap: 2.75rem; }

/* Footer sign-off (item 2): reserve descender room so j / á / ð never clip at
   the black band's bottom edge (the panel is overflow:hidden). */
.bu-footer-word { padding-bottom: .22em; }
.bu-p-foot { padding-bottom: 2.5rem; }

/* TEXT LINKS — one vocabulary: a brass underline that wipes in from the left.
   Replaces the old static text-decoration transition so they never conflict. */
.bu-ul {
  position: relative; text-decoration: none;
}
.bu-ul::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: 1px;
  height: 1px; background: ${BRASS}; transform: scaleX(0); transform-origin: left center;
}
.bu-ul:hover::after, .bu-ul:focus-visible::after { transform: scaleX(1); }

/* CTA BUTTONS — keep the letter-spacing expand AND a brass fill wiping up from
   the bottom, behind ink-on-brass text. INK (#111) on BRASS (#A8802F) = 5.2:1
   (AA). Text/icons sit on z-index:1 above the ::before fill. */
.bu-cta { position: relative; overflow: hidden; isolation: isolate; }
.bu-cta::before {
  content: ''; position: absolute; inset: 0; z-index: -1; background: ${BRASS};
  transform: scaleY(0); transform-origin: bottom center;
}
/* !important: the CTAs set color inline (BONE on their INK bg); the hover
   must flip the text to INK so it reads on the brass fill (5.2:1 AA). */
.bu-cta:hover { letter-spacing: .24em; color: ${INK} !important; }
.bu-cta:hover::before { transform: scaleY(1); }

/* Clickable slab (room categories) — subtle lift paired with the photo hover. */
.bu-slab:hover { transform: translateY(-4px); box-shadow: 0 18px 40px -20px rgba(17,17,17,.45); }

/* All hover motion is gated here — reduced motion gets the same end states
   instantly (no transition declared → instant). */
@media (prefers-reduced-motion: no-preference) {
  .bu-ul::after { transition: transform .4s cubic-bezier(.4,0,.2,1); }
  .bu-cta { transition: letter-spacing .35s ease, color .2s ease; }
  .bu-cta::before { transition: transform .45s cubic-bezier(.4,0,.2,1); }
  .bu-photo .bu-photo-img { transition: filter .6s ease; }
  .bu-photo .bu-media-down { transition: transform .7s cubic-bezier(.22,1,.36,1); }
  .bu-flip-frame::after { transition: opacity .5s ease, transform .5s cubic-bezier(.22,1,.36,1); }
  .bu-photo figcaption { transition: opacity .4s ease; }
  .bu-slab { transition: transform .5s cubic-bezier(.22,1,.36,1), box-shadow .5s ease; }
}

/* Rooms — vertical stack by default; panels riding the journey on desktop. */
.bu-rooms-track { display: grid; gap: 4.5rem; padding: 3.5rem clamp(1.25rem, 5vw, 4rem) 5.5rem; }
.bu-rooms-intro { max-width: 34rem; }

/* ═══ THE HORIZONTAL JOURNEY (the reference's architecture, their is_mobile
   split): desktop + motion-ok lays EVERY panel on one max-content track,
   translated by ONE pinned master scrub — vertical wheel input travels the
   page sideways. Below lg or under reduced motion none of this CSS exists
   and the page is the plain vertical document above. ═══ */
@media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
  .bu-journey { height: 100svh; overflow: hidden; }
  .bu-track {
    position: relative; display: flex; width: max-content;
    height: 100svh; align-items: stretch;
  }
  .bu-track > * { height: 100svh; flex: none; overflow: hidden; }
  .bu-p-hero, .bu-p-rails, .bu-p-foot { width: 100vw; }
  .bu-p-rails { min-height: 0; }

  /* rooms — the old inner rail becomes panels on the single journey */
  .bu-p-rooms { width: max-content; }
  .bu-rooms-viewport { height: 100svh; display: flex; align-items: center; }
  .bu-rooms-track {
    display: flex; align-items: center; flex-wrap: nowrap;
    gap: 6vw; padding: 0 8vw 0 6vw; width: max-content;
  }
  .bu-rooms-intro { width: 30vw; max-width: none; flex: none; }
  /* !important: these h2s size themselves via inline clamp() for the
     vertical page; the journey's tighter columns must win over inline. */
  .bu-rooms-intro h2 { font-size: min(6.5vw, 13svh) !important; white-space: nowrap; }
  .bu-slab { width: clamp(340px, 24vw, 460px); flex: none; }

  /* restaurant — one wide black panel, content flowing laterally */
  .bu-p-rest { width: max-content; }
  .bu-rest-inner {
    display: flex; align-items: center; gap: 5vw;
    height: 100svh; width: max-content; padding: 0 6vw;
  }
  .bu-rest-head { width: 22vw; align-self: flex-start; padding-top: 10svh; }
  .bu-rest-title { font-size: min(7.5vw, 14svh); white-space: nowrap; margin: 0; }
  .bu-rest-grid { display: flex; align-items: center; gap: 4vw; margin-top: 0; width: max-content; }
  .bu-rest-copy { width: min(34rem, 32vw); }
  .bu-rest-hours { width: clamp(280px, 22vw, 360px); }
  .bu-rest-photos { display: flex; align-items: center; gap: 3vw; margin-top: 0; width: max-content; }
  .bu-rest-photos > figure { width: clamp(250px, 20vw, 380px); }

  /* saga — era columns side by side */
  .bu-p-saga { width: max-content; display: flex; align-items: stretch; }
  .bu-saga-head { width: 26vw; flex: none; padding: 10svh 0 0 5vw; }
  .bu-saga-head h2 { font-size: min(2.6vw, 5svh) !important; max-width: 18vw; }
  .bu-saga-steps {
    display: flex; align-items: center; gap: 6vw;
    padding: 0 8vw 0 3vw; width: max-content;
  }
  .bu-saga-step { margin-top: 0; width: max-content; }
  .bu-saga-row { display: block; width: max-content; }
  .bu-saga-step .bu-era { font-size: min(10vw, 19svh); margin-left: 0; line-height: 0.95; }
  .bu-saga-text { padding: 2svh 0 0; max-width: 24rem; }
  .bu-saga-photo { margin: 3svh 0 0; padding: 0; }
  .bu-saga-photo figure { max-width: min(30vw, 56svh); }

  /* weddings */
  .bu-p-wed { width: max-content; }
  .bu-wed-inner {
    display: flex; align-items: center; gap: 5vw;
    height: 100svh; width: max-content; padding: 0 6vw;
  }
  .bu-wed-head { width: 18vw; align-self: flex-start; padding-top: 10svh; }
  .bu-wed-grid { display: flex; align-items: center; gap: 4vw; margin-top: 0; width: max-content; }
  .bu-wed-copy { width: min(26rem, 26vw); max-width: none; }
  .bu-wed-copy h2 { font-size: min(3.4vw, 6.5svh) !important; }
  .bu-wed-photos { display: flex; align-items: center; gap: 3vw; width: max-content; }
  .bu-wed-photos > figure { width: clamp(240px, 20vw, 380px); }

  /* staðurinn */
  .bu-p-place { width: max-content; }
  .bu-place-inner {
    display: flex; align-items: center; gap: 5vw;
    height: 100svh; width: max-content; padding: 0 8vw 0 6vw;
  }
  .bu-place-head { width: 20vw; align-self: flex-start; padding-top: 10svh; }
  .bu-place-titlegrid { display: block; margin-top: 0; width: 26vw; }
  .bu-place-titlegrid h2 { font-size: min(4vw, 8svh) !important; }
  .bu-place-stripwrap { margin-top: 0; }
  .bu-place-strip { display: flex; align-items: center; width: max-content; gap: 3vw; }
  .bu-place-strip .bu-slab-place { width: clamp(280px, 24vw, 440px); flex: none; }

  /* footer */
  .bu-p-foot { display: flex; flex-direction: column; justify-content: space-between; padding-bottom: 4svh; }
  .bu-foot-grid { margin-top: 3svh; }
  .bu-foot-map { height: min(420px, 46svh); }
  .bu-foot-wordwrap { margin-top: 0; }
}

@keyframes bu-menu-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes bu-menu-link { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: none; } }
.bu-menu-panel { animation: bu-menu-in .3s ease both; }
.bu-menu-link { animation: bu-menu-link .55s cubic-bezier(.22,1,.36,1) both; }

@media (prefers-reduced-motion: reduce) {
  .bu-menu-panel, .bu-menu-link { animation: none !important; opacity: 1 !important; transform: none !important; }
  .bu-photo .bu-photo-img { transition: none !important; filter: none !important; transform: none !important; }
  .bu-cta { transition: none !important; }
}
`

/* ═══════════════ Photo — the fixed things; they never animate ════════════ */
function Photo({
  src, alt, spec, aspect = 'aspect-[4/3]', className = '', position = 'center',
  priority = false, tone = 'light', flip, flipScrub = false, parallax = false,
}: {
  src: string; alt: string; spec?: string; aspect?: string; className?: string
  position?: string; priority?: boolean; tone?: 'light' | 'dark'
  flip?: 'up' | 'left' | 'right'; flipScrub?: boolean; parallax?: boolean
}) {
  const [failed, setFailed] = useState(false)
  return (
    <figure className={`bu-photo relative m-0 ${className}`}>
      <div className={`bu-flip-frame relative overflow-hidden ${aspect}`}
        data-bu-flip={flip}
        data-bu-scrub={flipScrub ? '1' : undefined}
        data-bu-parallax={parallax ? '1' : undefined}>
        {failed ? (
          <div className="absolute inset-0" style={{ background: '#DCD5C4' }} role="img" aria-label={alt} />
        ) : (
          <>
            <div className="bu-media-down">
              <img
                src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async"
                {...(priority ? { fetchpriority: 'high' as const } : {})}
                onError={() => setFailed(true)}
                className="bu-photo-img bu-media-source absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: position }}
              />
            </div>
            {flip ? (
              <div className="bu-media-up" aria-hidden>
                <img
                  src={src} alt="" loading={priority ? 'eager' : 'lazy'} decoding="async"
                  className="bu-photo-img absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: position }}
                />
              </div>
            ) : null}
          </>
        )}
      </div>
      {spec ? (
        <figcaption
          className="bu-up mt-0 flex items-baseline justify-between gap-4 border-t pt-2.5 text-[10.5px] uppercase tracking-[0.18em]"
          style={{
            fontFamily: GROTESK,
            borderColor: tone === 'light' ? HAIR_INK : HAIR_BONE,
            color: tone === 'light' ? INK_MUTE : BONE_MUTE,
          }}>
          <span>{spec}</span>
        </figcaption>
      ) : null}
    </figure>
  )
}

/* ═══════════════ Section head — the horizon rule persists ════════════════ */
function SectionHead({ index, label, tone = 'light' }: {
  index: string; label: string; tone?: 'light' | 'dark'
}) {
  return (
    <div>
      <div className="bu-rule-draw h-px w-full origin-left"
        style={{ background: tone === 'light' ? INK : BONE, opacity: tone === 'light' ? 0.55 : 0.4 }} />
      <div className="bu-up flex items-baseline justify-between pt-3 text-[11px] font-medium uppercase tracking-[0.24em]"
        style={{ fontFamily: GROTESK, color: tone === 'light' ? INK_MUTE : BONE_MUTE }}>
        <span>{label}</span>
        <span aria-hidden style={{ color: tone === 'light' ? OLIVE_INK : BONE_MUTE }}>({index})</span>
      </div>
    </div>
  )
}

/* ═══════════════ Header + full-screen bone menu ══════════════════════════ */
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
      const target = document.getElementById(id)
      if (!target) return
      if (journeyNav) {
        /* Horizontal journey: map the panel's x on the track to the master
           trigger's scroll range (labelToScroll pattern, done manually). */
        const { master, track } = journeyNav
        const maxX = Math.max(1, track.scrollWidth - window.innerWidth)
        const x = Math.min(target.offsetLeft, maxX)
        const top = master.start + (x / maxX) * (master.end - master.start)
        window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' })
      } else {
        target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
      }
    }, 40)
  }
  const solid = scrolled || open

  return (
    <>
      <nav aria-label="Aðalvalmynd" className="fixed inset-x-0 top-0 z-40"
        style={{
          background: solid ? 'rgba(239,234,224,.94)' : 'transparent',
          borderBottom: `1px solid ${solid ? HAIR_INK : 'transparent'}`,
          backdropFilter: solid ? 'blur(8px)' : undefined,
          WebkitBackdropFilter: solid ? 'blur(8px)' : undefined,
          transition: 'background .35s ease, border-color .35s ease',
        }}>
        <div className="flex items-center justify-between px-5 py-4 md:px-8">
          <button type="button"
            onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }) }}
            className={`min-h-[44px] text-[12px] font-semibold uppercase tracking-[0.32em] ${FOCUS}`}
            style={{ fontFamily: GROTESK, color: INK }}>
            Hótel Búðir
          </button>
          <div className="hidden items-center gap-8 lg:flex">
            {NAV.map((n) => (
              <button key={n.id} type="button" onClick={() => go(n.id)}
                className={`min-h-[44px] text-[12px] font-medium uppercase tracking-[0.18em] transition-opacity hover:opacity-60 ${FOCUS}`}
                style={{ fontFamily: GROTESK, color: INK }}>
                {n.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-5">
            <a href={PHONE_HREF}
              className={`hidden min-h-[44px] items-center text-[12px] tracking-[0.06em] sm:flex ${FOCUS}`}
              style={{ fontFamily: GROTESK, color: INK_SOFT }}>
              {PHONE_DISPLAY}
            </a>
            <a href={BOOKING_URL} target="_blank" rel="noreferrer"
              className={`bu-ul flex min-h-[44px] items-center text-[13px] font-medium tracking-[0.04em] ${FOCUS}`}
              style={{ fontFamily: GROTESK, color: INK }}>
              (Bóka)
            </a>
            <button type="button" aria-label={open ? 'Loka valmynd' : 'Opna valmynd'}
              aria-expanded={open} aria-controls="bu-menu"
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
      {/* Sibling of nav — the nav's backdrop-filter must never become this
          overlay's containing block (craft-ledger gotcha). */}
      {open ? (
        <div id="bu-menu" role="dialog" aria-modal="true" aria-label="Valmynd"
          className="bu-menu-panel fixed inset-0 z-30 flex flex-col justify-between px-6 pb-10 pt-28 lg:hidden"
          style={{ background: BONE }}>
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {NAV.map((n, i) => (
              <li key={n.id} className="bu-menu-link" style={{ animationDelay: `${90 + i * 60}ms` }}>
                <button type="button" onClick={() => go(n.id)}
                  className={`min-h-[48px] text-left text-[2.3rem] font-light ${FOCUS}`}
                  style={{ fontFamily: SERIF, fontWeight: 300, color: INK, lineHeight: 1.15 }}>
                  {n.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="bu-menu-link flex flex-wrap items-center gap-x-8 gap-y-3"
            style={{ animationDelay: `${90 + NAV.length * 60}ms` }}>
            <a href={BOOKING_URL} target="_blank" rel="noreferrer"
              className={`bu-ul flex min-h-[44px] items-center text-[14px] font-medium tracking-[0.04em] ${FOCUS}`}
              style={{ fontFamily: GROTESK, color: INK }}>
              (Bóka herbergi)
            </a>
            <a href={PHONE_HREF}
              className={`flex min-h-[44px] items-center text-[13px] tracking-[0.06em] ${FOCUS}`}
              style={{ fontFamily: GROTESK, color: INK_SOFT }}>
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      ) : null}
    </>
  )
}

/* ═══════════════ HERO — the word stands on the horizon ═══════════════════ */
function Hero() {
  const heroChars = HERO.word.split('')
  return (
    <header className="bu-p-hero relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Sky — driven by the page-wide scrub via CSS custom properties. */}
      <div className="relative" style={{
        height: '62svh',
        background: 'linear-gradient(180deg, var(--bu-sky-hi) 0%, var(--bu-sky-lo) 100%)',
      }}>
        <p className="bu-hero-fade absolute left-5 top-20 m-0 text-[11px] font-medium uppercase tracking-[0.26em] md:left-8"
          style={{ fontFamily: GROTESK, color: INK_SOFT }}>
          {HERO.eyebrow}
        </p>
        <div className="absolute inset-x-0 bottom-0">
          <p className="bu-hero-fade m-0 pb-2 text-center text-[12px] font-medium uppercase tracking-[0.5em]"
            style={{ fontFamily: GROTESK, color: INK_SOFT }} aria-hidden>
            {HERO.wordPrefix}
          </p>
          <div className="bu-hero-mask">
            <h1 aria-label={`${HERO.wordPrefix} ${HERO.word}`}
              className="bu-hero-word m-0 whitespace-nowrap text-center font-extralight"
              style={{
                fontFamily: SERIF, fontWeight: 200, color: INK,
                fontSize: 'min(38vw, 50svh)', letterSpacing: '-0.02em',
              }}>
              {heroChars.map((ch, i) => (
                <span key={`${ch}-${i}`} aria-hidden
                  className={`bu-hero-char${ch === 'Ú' ? ' bu-u-accent' : ''}`}>
                  {ch}
                </span>
              ))}
            </h1>
          </div>
        </div>
      </div>

      {/* THE horizon. Full-strength ink, 1px. */}
      <div aria-hidden className="h-px w-full" style={{ background: INK }} />

      {/* Below sea level: the real place, quiet. Band ≤ 45vh (1080px source). */}
      <div className="relative flex-1" style={{ minHeight: '38svh', background: INK }}>
        <div className="bu-flip-frame bu-hero-frame absolute inset-0 overflow-hidden"
          data-bu-flip="up" data-bu-parallax="1">
          <div className="bu-media-down">
            <img src={IMG(PHOTOS.heroWater.file)} alt={HERO.photoAlt}
              loading="eager" decoding="async" {...{ fetchpriority: 'high' as const }}
              className="bu-photo-img bu-media-source absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: 'center 55%', filter: 'saturate(.9)' }} />
          </div>
          <div className="bu-media-up" aria-hidden>
            <img src={IMG(PHOTOS.heroWater.file)} alt=""
              loading="eager" decoding="async"
              className="bu-photo-img absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: 'center 55%', filter: 'saturate(.9)' }} />
          </div>
        </div>
        {/* No solid box: a soft bone scrim radiating from the copy so the ink
            type reads as bare editorial text on the photo. Anchored over the
            content (25% 45%), full-strength through the text + buttons, fading
            to transparent before the block's far corners — no rectangle edge
            colliding with the BÚÐIR letters. INK_SOFT over the ≥.9 bone zone
            where all copy sits ≈ 12:1 (AAA). */}
        <div className="bu-hero-fade absolute left-0 top-0 max-w-[34rem] p-5 md:left-8 md:max-w-[30rem] md:p-7"
          style={{ background: 'radial-gradient(115% 140% at 25% 45%, rgba(239,234,224,.95) 0%, rgba(239,234,224,.9) 50%, rgba(239,234,224,.5) 74%, rgba(239,234,224,0) 96%)' }}>
          <p className="m-0 text-[14px] leading-[1.7] md:text-[15px]"
            style={{ fontFamily: GROTESK, color: INK_SOFT }}>
            {HERO.sub}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href={BOOKING_URL} target="_blank" rel="noreferrer"
              className={`bu-cta inline-flex min-h-[48px] items-center px-6 text-[12px] font-semibold uppercase tracking-[0.2em] ${FOCUS}`}
              style={{ fontFamily: GROTESK, background: INK, color: BONE }}>
              {HERO.cta}
            </a>
            <a href={PHONE_HREF}
              className={`bu-ul inline-flex min-h-[44px] items-center text-[13px] tracking-[0.06em] ${FOCUS}`}
              style={{ fontFamily: GROTESK, color: INK }}>
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
        <p className="bu-hero-fade absolute bottom-3 right-4 m-0 hidden px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] md:block"
          style={{
            fontFamily: GROTESK, color: INK_SOFT,
            background: 'linear-gradient(90deg, rgba(239,234,224,0) 0%, rgba(239,234,224,.82) 38%)',
            textShadow: '0 1px 5px rgba(239,234,224,.85)',
          }}>
          Hótelið og svarta kirkjan við ósinn
        </p>
      </div>
    </header>
  )
}

/* ═══════════════ RAILS — their three phrases, colossal ═══════════════════
   Grotesque caps interrupted mid-line by the italic serif noun — the
   reference's signature type move, carried by their own homepage copy. */
function Rails() {
  return (
    <section aria-label="Búðir" className="bu-rails-sec bu-p-rails relative flex min-h-[92svh] flex-col"
      style={{ background: 'var(--bu-ground)', overflowX: 'clip' }}>
      <div className="px-5 pt-14 md:px-8">
        <SectionHead index="01" label={HERO.word} />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-6 px-5 py-20 md:gap-8 md:px-8">
        {RAILS.map((phrase, i) => {
          const [first, ...rest] = phrase.split(' ')
          return (
            <div key={phrase} className="bu-mask bu-rail overflow-hidden"
              style={{ paddingLeft: `${i * 7}%` }}>
              <p className="bu-mrise m-0 whitespace-nowrap"
                style={{ lineHeight: 1.26, fontSize: 'clamp(1.9rem, 6.6vw, 5.6rem)' }}>
                <span className="font-semibold uppercase"
                  style={{ fontFamily: GROTESK, letterSpacing: '-0.01em', color: INK }}>
                  {first}
                </span>{' '}
                <em style={{ fontFamily: SERIF, fontWeight: 300, fontStyle: 'italic', color: OLIVE }}>
                  {rest.join(' ')}
                </em>
                <span aria-hidden className="ml-4 hidden align-super text-[11px] font-medium tracking-[0.2em] sm:inline"
                  style={{ fontFamily: GROTESK, color: INK_MUTE }}>
                  (0{i + 1})
                </span>
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ═══════════════ HERBERGI — horizontal scrub past the four categories ════ */
function Rooms() {
  return (
    <section id="herbergi" className="bu-rooms bu-p-rooms scroll-mt-16" style={{ background: 'var(--bu-ground)' }}>
      <div className="px-5 pt-14 md:px-8 lg:hidden">
        <SectionHead index="02" label={NAV[0].label} />
      </div>
      <div className="bu-rooms-viewport">
        <div className="bu-rooms-track">
          <div className="bu-rooms-intro flex items-stretch gap-6">
            <span aria-hidden className="bu-vert hidden text-[11px] font-medium uppercase tracking-[0.3em] lg:block"
              style={{ fontFamily: GROTESK, color: INK_MUTE }}>
              {NAV[0].label} · (02)
            </span>
            <div>
              <h2 className="bu-chars m-0"
                style={{
                  fontFamily: SERIF, fontWeight: 200, color: INK,
                  fontSize: 'clamp(3.4rem, 8.5vw, 7.5rem)', lineHeight: 1.08,
                }}>
                {NAV[0].label}
              </h2>
              <p className="bu-lines mt-6 max-w-[24rem] text-[14.5px] leading-[1.7]"
                style={{ fontFamily: GROTESK, color: INK_SOFT }}>
                {ROOMS_NOTE}
              </p>
              <a href={BOOKING_URL} target="_blank" rel="noreferrer"
                className={`bu-ul mt-4 inline-flex min-h-[44px] items-center text-[13px] font-medium tracking-[0.04em] ${FOCUS}`}
                style={{ fontFamily: GROTESK, color: INK }}>
                (Bóka)
              </a>
            </div>
          </div>
          {ROOMS.map((room, i) => (
            <article key={room.key} className="bu-slab">
              <Photo src={IMG(room.img)} alt={room.alt} aspect="aspect-[4/5]"
                spec={`${room.wing} · 0${i + 1}`} flip={i % 2 === 0 ? 'right' : 'left'} />
              <h3 className="bu-lines mb-0 mt-4"
                style={{
                  fontFamily: SERIF, fontWeight: 300, color: INK,
                  fontSize: 'clamp(1.7rem, 2.6vw, 2.3rem)', lineHeight: 1.28,
                }}>
                {room.name}
              </h3>
              <p className="bu-lines mt-3 text-[14px] leading-[1.7]"
                style={{ fontFamily: GROTESK, color: INK_SOFT }}>
                {room.body}
              </p>
              <a href={BOOKING_URL} target="_blank" rel="noreferrer"
                className={`bu-ul mt-3 inline-flex min-h-[44px] items-center text-[12px] font-medium uppercase tracking-[0.18em] ${FOCUS}`}
                style={{ fontFamily: GROTESK, color: INK }}>
                Bóka
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ VEITINGASTAÐURINN — the black band ══════════════════════ */
function Restaurant() {
  /* The italic-serif interruption, built strictly from their own sentence. */
  const [barBefore, barAfter] = RESTAURANT.barLine.split('stórbrotnu útsýni')
  return (
    <section id="veitingar" className="bu-p-rest scroll-mt-16" style={{ background: INK }}>
      <div className="bu-rest-inner px-5 pb-20 pt-14 md:px-8 md:pb-28">
        <div className="bu-rest-head">
          <SectionHead index="03" label={NAV[1].label} tone="dark" />
        </div>
        <h2 className="bu-chars bu-rest-title mb-0 mt-10"
          style={{
            fontFamily: SERIF, fontWeight: 200, color: BONE,
            fontSize: 'clamp(2.7rem, 8.5vw, 7.5rem)', lineHeight: 1.06,
            marginLeft: '-0.04em',
          }}>
          {RESTAURANT.title}
        </h2>

        <div className="bu-rest-grid mt-12 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div className="bu-rest-copy">
            <p className="bu-lines m-0 max-w-[36rem] text-[15.5px] leading-[1.8]"
              style={{ fontFamily: GROTESK, color: BONE_SOFT }}>
              {RESTAURANT.body}
            </p>
            <p className="bu-lines mb-0 mt-10 max-w-[40rem]"
              style={{ lineHeight: 1.24, fontSize: 'clamp(1.5rem, 3.6vw, 2.9rem)' }}>
              <span className="font-semibold uppercase"
                style={{ fontFamily: GROTESK, letterSpacing: '-0.005em', color: BONE }}>
                {barBefore}
              </span>
              <em style={{ fontFamily: SERIF, fontWeight: 300, fontStyle: 'italic', color: BONE }}>
                stórbrotnu útsýni
              </em>
              <span className="font-semibold uppercase"
                style={{ fontFamily: GROTESK, letterSpacing: '-0.005em', color: BONE }}>
                {barAfter}
              </span>
            </p>
          </div>
          <div className="bu-rest-hours">
            <dl className="m-0">
              {RESTAURANT.hours.map((h) => (
                <div key={h.label}
                  className="bu-up flex items-baseline justify-between gap-6 border-b py-4"
                  style={{ borderColor: HAIR_BONE }}>
                  <dt className="text-[12px] font-medium uppercase tracking-[0.2em]"
                    style={{ fontFamily: GROTESK, color: BONE_MUTE }}>
                    {h.label}
                  </dt>
                  <dd className="m-0 text-right text-[13.5px] tracking-[0.03em]"
                    style={{ fontFamily: GROTESK, color: BONE_SOFT }}>
                    {h.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="bu-rest-photos mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          <Photo src={IMG(PHOTOS.plateFish.file)} alt={PHOTOS.plateFish.alt}
            aspect="aspect-[4/5]" spec="Fiskréttur á steindiski" tone="dark" flip="left" />
          <Photo src={IMG(PHOTOS.barTeal.file)} alt={PHOTOS.barTeal.alt}
            aspect="aspect-[4/5]" spec="Barinn" tone="dark" className="lg:mt-14" flip="up" />
          <Photo src={IMG(PHOTOS.breakfast.file)} alt={PHOTOS.breakfast.alt}
            aspect="aspect-[4/5]" spec={RESTAURANT.hours[0].label} tone="dark" flip="right"
            className="sm:col-span-2 sm:mx-auto sm:w-2/3 lg:col-span-1 lg:mx-0 lg:w-auto" />
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ SAGAN — eras bleeding off the left edge ═════════════════ */
function Saga() {
  const sagaPhotos = [PHOTOS.churchHill, null, PHOTOS.snow] as const
  return (
    <section id="sagan" className="bu-p-saga scroll-mt-16 overflow-hidden"
      style={{ background: 'var(--bu-ground)' }}>
      <div className="bu-saga-head px-5 pt-14 md:px-8">
        <SectionHead index="04" label={NAV[2].label} />
        <div className="flex items-end justify-between gap-8">
          <h2 className="bu-lines mb-0 mt-10 max-w-[30rem]"
            style={{
              fontFamily: SERIF, fontWeight: 300, color: INK,
              fontSize: 'clamp(1.9rem, 4vw, 3.2rem)', lineHeight: 1.15,
            }}>
            {SAGA.title}
          </h2>
          <span aria-hidden className="bu-vert hidden pb-2 text-[11px] font-medium uppercase tracking-[0.3em] lg:block"
            style={{ fontFamily: GROTESK, color: INK_MUTE }}>
            {NAV[2].label} · Búðir
          </span>
        </div>
      </div>

      <div className="bu-saga-steps pb-24 pt-6 md:pb-32">
        {SAGA.steps.map((step, i) => {
          const photo = sagaPhotos[i]
          return (
            <div key={step.era} className="bu-saga-step mt-16 md:mt-24">
              <div className="bu-saga-row grid items-end gap-x-10 gap-y-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
                <div aria-label={step.era} role="heading" aria-level={3}
                  className="bu-chars bu-era whitespace-nowrap"
                  style={{
                    fontFamily: SERIF, fontWeight: 200, color: INK,
                    fontSize: 'clamp(5rem, 16vw, 13rem)', lineHeight: 0.95,
                    marginLeft: 'max(-6vw, -4rem)',
                  }}>
                  {step.era}
                </div>
                <p className="bu-lines bu-saga-text m-0 max-w-[30rem] px-5 pb-3 text-[15px] leading-[1.8] md:px-0 md:pr-8"
                  style={{ fontFamily: GROTESK, color: INK_SOFT }}>
                  {step.text}
                </p>
              </div>
              {photo ? (
                <div className={`bu-saga-photo mt-12 px-5 md:px-8 ${i === 0 ? 'md:ml-[38%]' : 'md:mr-[42%]'}`}>
                  <Photo src={IMG(photo.file)} alt={photo.alt} aspect="aspect-[16/10]"
                    spec={photo.alt} className="max-w-[560px]"
                    flip={i === 0 ? 'right' : 'left'} flipScrub={i === 0} />
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ═══════════════ BRÚÐKAUP — quiet ════════════════════════════════════════ */
function Weddings() {
  return (
    <section id="brudkaup" className="bu-p-wed scroll-mt-16" style={{ background: 'var(--bu-ground)' }}>
      <div className="bu-wed-inner px-5 pb-24 pt-14 md:px-8 md:pb-32">
        <div className="bu-wed-head">
          <SectionHead index="05" label={NAV[3].label} />
        </div>
        <div className="bu-wed-grid mt-12 grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div className="bu-wed-copy max-w-[26rem]">
            <h2 className="bu-chars m-0"
              style={{
                fontFamily: SERIF, fontWeight: 200, color: INK,
                fontSize: 'clamp(2.4rem, 5.5vw, 4.6rem)', lineHeight: 1.08,
              }}>
              {WEDDINGS.title}
            </h2>
            <p className="bu-lines mb-0 mt-7 text-[15px] leading-[1.8]"
              style={{ fontFamily: GROTESK, color: INK_SOFT }}>
              {WEDDINGS.body}
            </p>
            <a href={EMAIL_HREF}
              className={`bu-cta mt-8 inline-flex min-h-[48px] items-center px-6 text-[12px] font-semibold uppercase tracking-[0.2em] ${FOCUS}`}
              style={{ fontFamily: GROTESK, background: INK, color: BONE }}>
              {WEDDINGS.cta}
            </a>
          </div>
          <div className="bu-wed-photos grid gap-10 sm:grid-cols-[1.15fr_1fr] sm:items-start">
            <Photo src={IMG(PHOTOS.eventHall.file)} alt={PHOTOS.eventHall.alt}
              aspect="aspect-[4/5]" spec="Veislusalurinn" flip="right" flipScrub parallax />
            <Photo src={IMG(PHOTOS.churchGrass.file)} alt={PHOTOS.churchGrass.alt}
              aspect="aspect-[4/5]" spec="Hótelið á tanganum" className="sm:mt-20" flip="left" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ STAÐURINN — the landscape, captioned honestly ═══════════ */
function Place() {
  const slabs = [PHOTOS.coast, PHOTOS.aerial, PHOTOS.beach] as const
  return (
    <section id="stadurinn" className="bu-p-place scroll-mt-16" style={{ background: 'var(--bu-ground)' }}>
      <div className="bu-place-inner px-5 pb-24 pt-14 md:px-8 md:pb-32">
        <div className="bu-place-head">
          <SectionHead index="06" label={NAV[4].label} />
        </div>
        <div className="bu-place-titlegrid mt-12 grid gap-8 md:grid-cols-2 md:items-end">
          <h2 className="bu-chars m-0"
            style={{
              fontFamily: SERIF, fontWeight: 200, color: INK,
              fontSize: 'clamp(2.6rem, 6.5vw, 5.5rem)', lineHeight: 1.05,
            }}>
            {PLACE.title}
          </h2>
          <p className="bu-lines m-0 max-w-[26rem] text-[15px] leading-[1.8] md:justify-self-end"
            style={{ fontFamily: GROTESK, color: INK_SOFT }}>
            {PLACE.body}
          </p>
        </div>
        {/* A lateral photo row inside the journey; a plain stack below lg /
            reduced motion. The journey itself provides the sideways travel —
            the coast panorama gets the inner parallax, the beach the scrubbed
            peel. */}
        <div className="bu-place-stripwrap mt-14">
          <div className="bu-place-strip">
            {slabs.map((ph, i) => (
              <Photo key={ph.file} src={IMG(ph.file)} alt={ph.alt} aspect="aspect-[4/5]"
                spec={ph.alt} className={`bu-slab-place${i === 1 ? ' lg:mt-14' : ''}`}
                flip={i === 1 ? 'left' : 'right'} flipScrub={i === 2} parallax={i === 0} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ FOOTER — night; the lockup disassembled ═════════════════ */
function FooterBlack() {
  return (
    <footer className="bu-p-foot relative overflow-hidden" style={{ background: INK }}>
      <div className="flex items-baseline justify-between px-5 pt-10 md:px-8">
        <span className="text-[12px] font-semibold uppercase tracking-[0.32em]"
          style={{ fontFamily: GROTESK, color: BONE }}>
          Hótel
        </span>
        <a href={BOOKING_URL} target="_blank" rel="noreferrer"
          className={`bu-ul inline-flex min-h-[44px] items-center text-[13px] font-medium tracking-[0.04em] ${FOCUS}`}
          style={{ fontFamily: GROTESK, color: BONE }}>
          (Bóka)
        </a>
      </div>

      <div className="bu-foot-grid mt-14 grid gap-12 px-5 md:grid-cols-[1.2fr_1fr] md:gap-20 md:px-8">
        <dl className="m-0 max-w-[30rem]">
          {[
            { label: 'Netfang', value: EMAIL, href: EMAIL_HREF },
            { label: 'Sími', value: PHONE_DISPLAY, href: PHONE_HREF },
            { label: 'Heimilisfang', value: ADDRESS, href: MAP_LINK },
          ].map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-6 border-b py-4"
              style={{ borderColor: HAIR_BONE }}>
              <dt className="text-[11px] font-medium uppercase tracking-[0.22em]"
                style={{ fontFamily: GROTESK, color: BONE_MUTE }}>
                {row.label}
              </dt>
              <dd className="m-0 text-right">
                <a href={row.href}
                  {...(row.href === MAP_LINK ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className={`bu-ul inline-flex min-h-[44px] items-center text-[14px] tracking-[0.02em] ${FOCUS}`}
                  style={{ fontFamily: GROTESK, color: BONE_SOFT }}>
                  {row.value}
                </a>
              </dd>
            </div>
          ))}
        </dl>
        <div>
          <div className="overflow-hidden"
            style={{ border: '1px solid rgba(168,128,47,.45)', boxShadow: `inset 0 0 0 1px ${HAIR_BONE}` }}>
            <iframe title={`Kort af Hótel Búðum, ${ADDRESS}`} src={MAP_EMBED}
              loading="eager" referrerPolicy="no-referrer-when-downgrade"
              className="bu-foot-map h-[320px] w-full border-0"
              style={{ filter: 'grayscale(1) contrast(1.05) brightness(.85)' }} />
          </div>
          <a href={MAP_LINK} target="_blank" rel="noreferrer"
            className={`bu-ul mt-3 inline-flex min-h-[44px] items-center text-[11px] font-medium uppercase tracking-[0.18em] ${FOCUS}`}
            style={{ fontFamily: GROTESK, color: BONE_MUTE }}>
            Opna í Google kortum
          </a>
        </div>
      </div>

      {/* The reference's colossal cropped sign-off, sunk below the fold edge;
          the lockup's other half anchors the opposite corner. */}
      <div className="bu-foot-wordwrap relative mt-16">
        <span className="absolute bottom-6 right-5 z-10 text-[12px] font-semibold uppercase tracking-[0.32em] md:right-8"
          style={{ fontFamily: GROTESK, color: BONE }}>
          Búðir
        </span>
        <p aria-hidden className="bu-footer-word m-0 select-none whitespace-nowrap pl-2 font-extralight"
          style={{
            fontFamily: SERIF, fontWeight: 200, color: BONE,
            fontSize: 'min(17vw, 15rem)', lineHeight: 0.95,
            transform: 'translateY(0.04em)',
          }}>
          Við sjáumst
        </p>
      </div>
    </footer>
  )
}

/* ═══════════════ PAGE ════════════════════════════════════════════════════ */
export default function Page() {
  const rootRef = useRef<HTMLDivElement>(null)
  const preRef = useRef<HTMLDivElement>(null)

  /* Preloader: first visit only, never under reduced motion. */
  const [pre, setPre] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    if (prefersReduced()) return false
    try { return window.localStorage.getItem('bu_seen') !== '1' } catch { return false }
  })
  const preShownRef = useRef(pre)

  useEffect(() => {
    document.title = 'Hótel Búðir · Sveitahótel á Snæfellsnesi'
    setThemeColor(BONE)
    const s = document.createElement('script')
    s.type = 'application/ld+json'
    s.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(s)
    return () => { s.remove() }
  }, [])

  /* Preloader timeline — ≤1.6s: chars rise from the masked baseline, the
     thin rule draws, the bone sheet releases upward. */
  useEffect(() => {
    try { window.localStorage.setItem('bu_seen', '1') } catch { /* private mode */ }
    if (!pre) return
    const el = preRef.current
    if (!el) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const chars = el.querySelectorAll('.bu-pre-char')
    const rule = el.querySelector('.bu-pre-rule')
    const tl = gsap.timeline({
      onComplete: () => {
        setPre(false)
        ScrollTrigger.refresh()
      },
    })
    tl.fromTo(chars, { yPercent: 115 }, { yPercent: 0, duration: 0.75, ease: 'power4.out', stagger: 0.05 }, 0)
      .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, 0.2)
      .to(el, { yPercent: -100, duration: 0.55, ease: 'power3.inOut' }, 1.05)
    return () => {
      document.body.style.overflow = prevOverflow
      tl.kill()
    }
  }, [pre])

  /* All scroll choreography. Reduced motion: the matchMedia branch returns
     before a single tween is created — every element's resting CSS state is
     fully visible, no pin, no scrub, no preloader. */
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
        const progress = q('.bu-progress')[0] as HTMLElement | undefined

        /* 0 — LENIS drives the scroll. Without a rAF loop pumping
           ScrollTrigger.update on every frame, the pinned scrub could stall
           at x=0 (the shipped freeze); Lenis both fixes that and gives the
           momentum feel the reference has. Armed in BOTH desktop and mobile
           motion branches; never under reduced motion (this whole callback
           is gated on c.motion above). */
        const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true })
        lenis.on('scroll', ScrollTrigger.update)
        const tick = (t: number) => lenis.raf(t * 1000)
        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)

        /* 1 — Sky colours: derived from ONE progress value in one callback.
           On desktop that value is the master journey trigger's progress;
           on mobile it is the vertical page trigger's. */
        const applySky = (p: number) => {
          const s = skyAt(p)
          root.style.setProperty('--bu-sky-hi', s.hi)
          root.style.setProperty('--bu-sky-lo', s.lo)
          root.style.setProperty('--bu-ground', s.ground)
        }
        applySky(0)

        /* 2 — THE MASTER (their engine, verbatim shape): all panels on one
           max-content track; ONE pinned trigger scrubs ONE track tween
           across the whole traverse. containerAnimation REQUIRES a tween
           (not a timeline) — the previous timeline form is the likely cause
           of the frozen x=0. end/x are function-form so they recompute after
           layout settles (invalidateOnRefresh). */
        const journeyEl = q('.bu-journey')[0] as HTMLElement | undefined
        const track = q('.bu-track')[0] as HTMLElement | undefined
        const maxX = () => track ? Math.max(1, track.scrollWidth - window.innerWidth) : 1
        let journeyTween: gsap.core.Tween | undefined
        if (c.desktop && journeyEl && track) {
          journeyTween = gsap.to(track, { x: () => -maxX(), ease: 'none' })
          const master = ScrollTrigger.create({
            animation: journeyTween,
            trigger: journeyEl,
            pin: journeyEl,
            scrub: 1,
            start: 'top top',
            end: () => '+=' + maxX(),
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              applySky(self.progress)
              if (progress) progress.style.transform = `scaleX(${self.progress})`
            },
          })
          journeyNav = { master, track }
        } else {
          ScrollTrigger.create({
            trigger: root,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.4,
            onUpdate: (self) => {
              applySky(self.progress)
              if (progress) progress.style.transform = `scaleX(${self.progress})`
            },
          })
        }

        /* Every per-element trigger goes through this: on the journey it
           rides containerAnimation with left-based positions (their exact
           pattern); on the vertical page it is a plain viewport trigger. */
        const trig = (
          el: Element | null | undefined, v: string, h: string,
          extra?: Record<string, unknown>,
        ): ScrollTrigger.Vars =>
          (journeyTween
            ? { trigger: el, containerAnimation: journeyTween, start: h, ...extra }
            : { trigger: el, start: v, ...extra }) as ScrollTrigger.Vars

        /* 3 — Hero: BÚÐIR rises from below the horizon, masked at the
           horizon wrapper (never per-line — Icelandic accents keep their
           0.24em headroom inside the mask). */
        const introDelay = preShownRef.current ? 1.35 : 0.2
        gsap.fromTo(q('.bu-hero-char'), { yPercent: 118 }, {
          yPercent: 0, duration: 1.3, ease: 'power3.out', stagger: 0.07, delay: introDelay,
        })
        gsap.from(q('.bu-hero-fade'), {
          opacity: 0, y: 22, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: introDelay + 0.5,
        })

        /* 4 — Rails + hand-masked statements: play on enter, reverse on
           leave-back (the reference's toggle behaviour). */
        q('.bu-mrise').forEach((el) => {
          gsap.from(el, {
            yPercent: 112, duration: 1, ease: 'power3.out',
            scrollTrigger: trig(el, 'top 88%', 'left 88%', { toggleActions: 'play none none reverse' }),
          })
        })

        /* 5 — Horizon rules draw in. */
        q('.bu-rule-draw').forEach((el) => {
          gsap.from(el, {
            scaleX: 0, duration: 1.1, ease: 'power2.inOut',
            scrollTrigger: trig(el, 'top 92%', 'left 92%', { toggleActions: 'play none none reverse' }),
          })
        })

        /* 6 — SplitText reveals. autoSplit re-splits when Boska finishes
           loading; onSplit returns the tween so it is rebuilt cleanly.
           Line masks carry leading ≥1.15 wherever accents occur. */
        q('.bu-lines').forEach((el) => {
          splits.push(SplitText.create(el, {
            type: 'lines', mask: 'lines', autoSplit: true,
            onSplit: (self) => gsap.from(self.lines, {
              yPercent: 112, duration: 0.9, ease: 'power3.out', stagger: 0.09,
              scrollTrigger: trig(el, 'top 87%', 'left 87%', { toggleActions: 'play none none reverse' }),
            }),
          }))
        })
        q('.bu-chars').forEach((el) => {
          splits.push(SplitText.create(el, {
            type: 'chars', mask: 'chars', autoSplit: true,
            onSplit: (self) => gsap.from(self.chars, {
              yPercent: 110, duration: 0.8, ease: 'power3.out', stagger: 0.035,
              scrollTrigger: trig(el, 'top 86%', 'left 86%', { toggleActions: 'play none none reverse' }),
            }),
          }))
        })

        /* 6b — Small furniture (eyebrows, indices, specs, hours, room names
           and bodies) rises as its panel slides in from the right — start
           'left 85%' via containerAnimation so the panel visibly ASSEMBLES.
           Mask-rise rather than SplitText on the tiny mono/tracked labels
           (SplitText fights letter-spacing at that size). */
        q('.bu-up').forEach((el) => {
          gsap.from(el, {
            yPercent: 40, opacity: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: trig(el, 'top 90%', 'left 85%', { toggleActions: 'play none none reverse' }),
          })
        })

        /* 7 — flipMedia peels (their measured recipe): the top copy of the
           image peels away — clip-path inset for the lateral variants, y for
           upDown — while the source copy settles beneath (counter scale /
           counter y). Default is time-based on entry; a few hero-moment
           photos ride a scrub instead (their cierre pattern). */
        const peel = (frame: HTMLElement, tlVars: gsap.TimelineVars) => {
          const dir = (frame.dataset.buFlip ?? 'up') as 'up' | 'left' | 'right'
          const up = frame.querySelector('.bu-media-up')
          const src = frame.querySelector('.bu-media-source')
          const isParallax = frame.dataset.buParallax === '1'
          if (!up || !src) return
          const tl = gsap.timeline(tlVars)
          if (dir === 'up') {
            tl.to(up, { y: '-105%', duration: 1.5, ease: 'power3.out' }, 0)
            if (!isParallax) tl.from(src, { y: '-10%', duration: 2, ease: 'power3.out' }, 0)
          } else if (dir === 'right') {
            /* their leftRight */
            tl.to(up, { '--bu-clip': '0% 100% 0% 0%', duration: 1.5, ease: 'power2.out' }, 0)
            if (!isParallax) tl.from(src, { scale: 1.2, duration: 2, ease: 'power2.out' }, 0)
          } else {
            /* their rightLeft */
            tl.to(up, { '--bu-clip': '0% 0% 0% 100%', duration: 1.5, ease: 'power2.out' }, 0)
            if (!isParallax) tl.from(src, { scale: 1.2, duration: 2, ease: 'power2.out' }, 0)
          }
        }
        q('[data-bu-flip]').forEach((el) => {
          const frame = el as HTMLElement
          if (frame.classList.contains('bu-hero-frame')) return
          const scrubbed = frame.dataset.buScrub === '1'
          peel(frame, {
            scrollTrigger: scrubbed
              ? trig(frame, 'top 88%', 'left 88%', {
                end: journeyTween ? 'left 42%' : 'top 42%', scrub: 0.4,
              })
              : trig(frame, 'top 88%', 'left 88%', { toggleActions: 'play none none none' }),
          })
        })
        /* The hero band is in view at load, so its peel is time-based and
           synced to the intro: the top copy slides away as the word rises
           out of the sea. */
        const heroFrame = q('.bu-hero-frame')[0] as HTMLElement | undefined
        if (heroFrame) {
          const heroUp = heroFrame.querySelector('.bu-media-up')
          const heroSrc = heroFrame.querySelector('.bu-media-source')
          if (heroUp && heroSrc) {
            const htl = gsap.timeline({ delay: introDelay + 0.1 })
            htl.to(heroUp, { y: '-105%', duration: 1.5, ease: 'power3.out' }, 0)
            htl.from(heroSrc, { y: '-10%', duration: 2, ease: 'power3.out' }, 0)
          }
        }

        /* 8 — Inner parallax (their projectInt move), journey only: on the
           largest panel images the source drifts inside its frame as the
           page travels past. Constant slight over-scale keeps the pan
           gap-free; total lateral travel 15% of the frame. */
        if (journeyTween) {
          q('[data-bu-parallax]').forEach((el) => {
            const src = el.querySelector('.bu-media-source')
            if (!src) return
            gsap.fromTo(src, { xPercent: 7.5, scale: 1.16 }, {
              xPercent: -7.5, scale: 1.16, ease: 'none',
              scrollTrigger: {
                trigger: el, containerAnimation: journeyTween,
                start: 'left 100%', end: 'right 0%', scrub: true,
              },
            })
          })
        }

        /* 9 — Side-to-side drifts. On the journey they ride the traverse
           via containerAnimation (offsets relative to the panel's passage);
           on mobile they are the halved vertical-trigger versions. */
        const amp = c.desktop ? 1 : 0.5
        const railsSec = q('.bu-rails-sec')[0]
        const railFrom = [-14, 14, -10]
        const railTo = [4, -4, 6]
        q('.bu-rail').forEach((el, i) => {
          gsap.fromTo(el, { x: `${railFrom[i] * amp}vw` }, {
            x: `${railTo[i] * amp}vw`, ease: 'none',
            scrollTrigger: trig(railsSec, 'top bottom', 'left 100%', {
              end: journeyTween ? 'right 0%' : 'bottom top', scrub: 0.6,
            }),
          })
        })
        q('.bu-era').forEach((el) => {
          gsap.fromTo(el, { x: '0vw' }, {
            x: `${-12 * amp}vw`, ease: 'none',
            scrollTrigger: trig(el, 'top bottom', 'left 100%', {
              end: journeyTween ? 'left 0%' : 'bottom top', scrub: 0.6,
            }),
          })
        })
        const footWord = q('.bu-footer-word')[0]
        if (footWord) {
          gsap.fromTo(footWord, { x: `${10 * amp}vw` }, {
            x: `${-4 * amp}vw`, ease: 'none',
            scrollTrigger: trig(footWord, 'top bottom', 'left 100%', {
              end: journeyTween ? 'left 20%' : 'top 30%', scrub: 0.6,
            }),
          })
        }

        /* The traverse = track.scrollWidth − innerWidth, and scrollWidth is
           only correct once BOTH the display font (Boska changes panel widths)
           AND every in-track image (each panel sizes to its photos) have
           loaded. Refresh after each so end/x are measured against the true
           ~14000px track, never a collapsed early-layout value. */
        document.fonts.ready.then(() => ScrollTrigger.refresh())
        const imgs = Array.from(root.querySelectorAll('.bu-track img'))
        Promise.all(imgs.map((im) => {
          const el = im as HTMLImageElement
          if (el.complete && el.naturalWidth > 0) return Promise.resolve()
          const dec = el.decode ? el.decode().catch(() => undefined) : undefined
          return dec ?? new Promise<void>((res) => {
            el.addEventListener('load', () => res(), { once: true })
            el.addEventListener('error', () => res(), { once: true })
          })
        })).then(() => ScrollTrigger.refresh())

        return () => {
          gsap.ticker.remove(tick)
          lenis.destroy()
          splits.forEach((sp) => sp.revert())
          journeyNav = null
        }
      },
    )
    return () => { mm.revert() }
  }, [])

  return (
    <div ref={rootRef} lang="is" className="bu-root antialiased"
      style={{ background: 'var(--bu-ground)', overflowX: 'clip' }}>
      <style>{PAGE_STYLES}</style>
      <div className="bu-progress" aria-hidden />

      {pre ? (
        <div ref={preRef} aria-hidden
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center"
          style={{ background: BONE }}>
          <div className="bu-pre-mask">
            <p className="m-0 whitespace-nowrap"
              style={{
                fontFamily: SERIF, fontWeight: 200, color: INK,
                fontSize: 'min(17vw, 7.5rem)', lineHeight: 1, letterSpacing: '-0.02em',
              }}>
              {HERO.word.split('').map((ch, i) => (
                <span key={`${ch}-${i}`} className={`bu-pre-char${ch === 'Ú' ? ' bu-u-accent' : ''}`}>
                  {ch}
                </span>
              ))}
            </p>
          </div>
          <span className="bu-pre-rule mt-5 block h-px w-40 origin-left" style={{ background: INK }} />
        </div>
      ) : null}

      <TopNav />
      {/* The journey: pinned + translated sideways on desktop. The shared
          PreviewChrome/PreviewFooter stay OUTSIDE it, in normal vertical
          flow after the pin releases — never pinned, never translated. */}
      <div className="bu-journey">
        <main className="bu-track">
          <Hero />
          <Rails />
          <Rooms />
          <Restaurant />
          <Saga />
          <Weddings />
          <Place />
          <FooterBlack />
        </main>
      </div>
      <PreviewChrome company={company} />
      <PreviewFooter company={company} />
    </div>
  )
}
