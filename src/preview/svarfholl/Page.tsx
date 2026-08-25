import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'
import { companyEntry } from './company'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  IMG, EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF, ADDRESS,
  MAP_EMBED, MAP_LINK, NAV, HERO, RAILS, ROOMS, ROOMS_NOTE,
  RESTAURANT, SAGA, WEDDINGS, PLACE, PHOTOS, JSON_LD,
} from './data'

gsap.registerPlugin(ScrollTrigger, SplitText)

const company = companyEntry

/* Module-scoped handle to the desktop horizontal journey so anchor nav can
   map a panel to its vertical scroll offset (labelToScroll pattern). Set and
   cleared by Page()'s matchMedia branch. */
let journeyNav: { master: ScrollTrigger; track: HTMLElement; lenis: Lenis } | null = null
/* The Lenis instance drives virtual scroll, so native window.scrollTo /
   scrollIntoView are overridden the next frame — anchor nav must route through
   lenis.scrollTo. Exposed here for TopNav's go(). Null when Lenis isn't armed
   (reduced motion), where go() falls back to native scrollIntoView. */
let pageLenis: Lenis | null = null

/* Scroll to the request section (it lives AFTER the pinned journey, in normal
   vertical flow, so plain Lenis scrollTo handles it from anywhere). */
function goBook() {
  const el = document.getElementById('boka')
  if (!el) return
  if (pageLenis) pageLenis.scrollTo(el, { offset: -8 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

/* ── „Ljósin í dalnum" — the lights in the valley. ──────────────────────────
   Svarfhóll's own camera roll keeps catching the sky: aurora over the lit
   chalet window, a rainbow on the home field, the midnight sun on the fells.
   Same engine as the Búðir/Skálakot lockstep pair (horizontal journey, hue
   headings, peels), re-derived skin: warm wool paper, peat ink, roof-red
   accent, and a sky scrub that runs day → gold → dusk → aurora night. ───── */

/* Palette — computed WCAG ratios (relative luminance):
   INK  #111111 on BONE #EFEAE0 ..... 15.75:1 (AAA) — and inverted on bands
   OLIVE #8A8455 on BONE ............  3.18:1 — LARGE display text only
   OLIVE_INK #5F5A38 on BONE ........  5.83:1 (AA small) · 5.4:1 on dusk tint
   BRASS #A8802F on BONE ............  3.02:1 — decorative accents only
   BRASS on INK band ................  5.21:1 — tiny furniture on black OK
   ink @62% on bone ≈ 4.9:1 · bone @80% on ink ≈ 10.6:1 · @64% ≈ 7.1:1  */
const BONE = '#F4F0E7'   /* wool — plastered farmhouse walls */
const INK = '#1B1713'    /* peat — dark timber interiors */
const OLIVE = '#6E7051'      // moss — large display accents only
const OLIVE_INK = '#565839'  // small-text-safe moss
const BRASS = '#A6403A'      // roof red (their farmhouse roof) — tiny uses only

const INK_SOFT = 'rgba(27,23,19,.80)'
const INK_MUTE = 'rgba(27,23,19,.62)'
const BONE_SOFT = 'rgba(244,240,231,.82)'
const BONE_MUTE = 'rgba(244,240,231,.64)'
const HAIR_INK = 'rgba(27,23,19,.16)'
const HAIR_BONE = 'rgba(244,240,231,.20)'

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
  { p: 0.0, hi: '#E7ECE7', lo: '#F1F0E6', ground: '#F4F0E7' }, // dagur — valley grey-green
  { p: 0.4, hi: '#F0E2BE', lo: '#F2EAD2', ground: '#F4EEDC' }, // gyllt — rainbow light
  { p: 0.75, hi: '#B9AFA4', lo: '#D6CCC0', ground: '#EDE7DB' }, // rökkur
  { p: 1.0, hi: '#39453F', lo: '#6E7B72', ground: '#E5E0D3' }, // nótt — aurora green-dark
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

/* ── Page-local styles: Boska @font-face, sv- keyframes, media-gated rooms
   rail, reduced-motion neutralisation. Nothing leaks outside sv-. ────────── */
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

.sv-root {
  --sv-sky-hi: ${SKY_STOPS[0].hi};
  --sv-sky-lo: ${SKY_STOPS[0].lo};
  --sv-ground: ${SKY_STOPS[0].ground};
}
.sv-root ::selection { background: ${INK}; color: ${BONE}; }

/* Boska Extralight metrics (upm 1000, asc 960, desc 250, cap 715, Ó accent
   715–925). Chars get line-height 1.21 (= (asc+desc)/upm) so each
   inline-block's background box starts exactly at the ascender — then on the
   hero Ó the zone above 19.6% of that box is the acute accent only, and
   painting it brass via background-clip touches no cap stroke. */
.sv-hero-char, .sv-pre-char { display: inline-block; line-height: 1.21; will-change: transform; }
.sv-u-accent {
  background: linear-gradient(180deg, ${BRASS} 0 19.6%, ${INK} 19.6%);
  background-repeat: no-repeat;
  -webkit-background-clip: text; background-clip: text;
  color: transparent;
}

/* The hero mask: clipped at the HORIZON (wrapper), never per-line — accents
   get 0.24em of headroom, the baseline is pulled to the mask's bottom edge
   (descent = 0.25em below it) so the caps stand exactly on the line. */
.sv-hero-mask { overflow: hidden; padding-top: 0.24em; }
.sv-hero-word { line-height: 1; margin-bottom: -0.25em; }

.sv-pre-mask { overflow: hidden; padding-top: 0.24em; }

/* Mask headroom (item 3): SplitText char masks clip to the char's line-box, so
   any Boska line-height below the glyph's full em extent (asc .96 + desc .25 =
   1.21) guillotines accents/descenders (Í acute, g/j/þ/p descenders). Force a
   comfortable ≥1.28 on every char-split display element (eras + panel titles)
   so the reveal clips the MOTION, never the GLYPH. Beats the inline/desktop
   line-heights those headings set. */
.sv-chars { line-height: 1.28 !important; }

.sv-vert { writing-mode: vertical-rl; transform: rotate(180deg); }

/* Photo base saturation. The come-closer zoom lives on .sv-media-down (never
   a GSAP target — the peel/parallax animate .sv-media-up / .sv-media-source,
   so a CSS transform here can never fight an inline GSAP transform). */
.sv-photo .sv-photo-img { filter: saturate(.84); }
.sv-photo:hover .sv-photo-img { filter: saturate(1); }
.sv-photo:hover .sv-media-down { transform: scale(1.04); }
/* Brass inset frame draws in — the cohesive "come closer" cue. */
.sv-flip-frame::after {
  content: ''; position: absolute; inset: 0; z-index: 4; pointer-events: none;
  border: 1px solid ${BRASS}; opacity: 0; transform: scale(1.03); transform-origin: center;
}
.sv-photo:hover .sv-flip-frame::after { opacity: .85; transform: scale(1); }
.sv-photo figcaption { opacity: .82; }
.sv-photo:hover figcaption { opacity: 1; }

/* flipMedia (the reference's measured recipe): every frame stacks TWO copies
   of the same image. The top copy (.sv-media-up) peels away — clip-path
   inset driven by a CSS var for the lateral variants, y for upDown — while
   the source copy beneath settles. Reduced motion drops the top copy
   entirely; the resting state is always the bare visible photo. */
.sv-media-down { position: absolute; inset: 0; overflow: hidden; }
.sv-media-up {
  position: absolute; inset: 0; overflow: hidden;
  --sv-clip: 0% 0% 0% 0%;
  clip-path: inset(var(--sv-clip));
}
@media (prefers-reduced-motion: reduce) { .sv-media-up { display: none; } }

/* Fixed journey progress bar — the visible signal that the page is
   advancing sideways. Fills 0→100% with the master trigger's progress. */
.sv-progress {
  position: fixed; left: 0; bottom: 0; z-index: 50;
  height: 3px; width: 100%; transform-origin: left center;
  transform: scaleX(0); background: ${BRASS}; pointer-events: none;
}
@media (prefers-reduced-motion: reduce) { .sv-progress { display: none; } }

/* Small-furniture mask-rise (labels, specs, hours) — assembles via
   containerAnimation as its panel slides in. Reduced motion / no-JS rests
   fully visible; JS arms the hidden start. */
.sv-up { will-change: transform, opacity; }

/* ═══ Hue-heading motif — normalisboring's ACTUAL technique: mix-blend-mode:
   difference on the heading over its photo. The heading is painted near-bone
   (#F4F1EA); difference inverts it against whatever is behind — over the bone
   ground it resolves to ink, over a dark panel to bone, and over the photo to
   the photo's own inverted hue. One rule, no measuring; both light and dark
   panels are handled automatically. The photo is desaturated so the invert
   reads as a controlled tonal HUE, not a psychedelic full-colour invert. ═══ */
.sv-hue { display: grid; place-items: center; }
.sv-hue-fig, .sv-hue-head { grid-area: 1 / 1; }
.sv-hue-fig { position: relative; }
.sv-hue-photo .sv-photo-img { filter: saturate(.5) contrast(1.03) brightness(.96); }
.sv-hue-head {
  position: relative; z-index: 4; pointer-events: none;
  color: #F4F1EA; mix-blend-mode: difference;
  white-space: nowrap; text-align: center;
}
.sv-hue-reveal { opacity: 0; }
@media (prefers-reduced-motion: reduce) { .sv-hue-reveal { opacity: 1 !important; } }

/* ═══ Custom cursor — the reference's signature: a small accent dot that
   auto-inverts (mix-blend difference) and swells with a label over media /
   CTAs. Desktop fine-pointer only; hidden under reduced motion + touch. ═══ */
.sv-cursor {
  position: fixed; left: 0; top: 0; z-index: 80;
  width: .8rem; height: .8rem; margin: -.4rem 0 0 -.4rem; border-radius: 999px;
  background: ${BRASS}; mix-blend-mode: difference; pointer-events: none;
  display: flex; align-items: center; justify-content: center; will-change: transform;
}
.sv-cursor-label {
  font-family: ${GROTESK}; font-size: 10px; letter-spacing: .18em; font-weight: 600;
  text-transform: uppercase; color: ${INK}; white-space: nowrap;
  opacity: 0; transform: scale(.5); pointer-events: none;
}
.sv-cursor.is-grown { mix-blend-mode: normal; width: 5rem; height: 5rem; margin: -2.5rem 0 0 -2.5rem; }
.sv-cursor.is-grown .sv-cursor-label { opacity: 1; transform: scale(1); }
@media (prefers-reduced-motion: no-preference) {
  .sv-cursor { transition: width .32s cubic-bezier(.22,1,.36,1), height .32s cubic-bezier(.22,1,.36,1), margin .32s cubic-bezier(.22,1,.36,1), background .3s ease; }
  .sv-cursor-label { transition: opacity .25s ease, transform .32s cubic-bezier(.34,1.56,.64,1); }
}
@media (prefers-reduced-motion: reduce) { .sv-cursor { display: none !important; } }
@media (pointer: coarse) { .sv-cursor { display: none !important; } }

/* Staðurinn photos — vertical stack by default; a lateral row inside the
   journey (media block below). */
.sv-place-strip { display: grid; gap: 2.75rem; }

/* Footer sign-off (item 2): reserve descender room so j / á / ð never clip at
   the black band's bottom edge (the panel is overflow:hidden). */
.sv-footer-word { padding-bottom: .22em; }
.sv-p-foot { padding-bottom: 2.5rem; }

/* TEXT LINKS — one vocabulary: a brass underline that wipes in from the left.
   Replaces the old static text-decoration transition so they never conflict. */
.sv-ul {
  position: relative; text-decoration: none;
}
.sv-ul::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: 1px;
  height: 1px; background: ${BRASS}; transform: scaleX(0); transform-origin: left center;
}
.sv-ul:hover::after, .sv-ul:focus-visible::after { transform: scaleX(1); }

/* CTA BUTTONS — keep the letter-spacing expand AND a brass fill wiping up from
   the bottom, behind ink-on-brass text. INK (#111) on BRASS (#A8802F) = 5.2:1
   (AA). Text/icons sit on z-index:1 above the ::before fill. */
.sv-cta { position: relative; overflow: hidden; isolation: isolate; }
.sv-cta::before {
  content: ''; position: absolute; inset: 0; z-index: -1; background: ${BRASS};
  transform: scaleY(0); transform-origin: bottom center;
}
/* !important: the CTAs set color inline (BONE on their INK bg); the hover
   must flip the text to INK so it reads on the brass fill (5.2:1 AA). */
.sv-cta:hover { letter-spacing: .24em; color: ${INK} !important; }
.sv-cta:hover::before { transform: scaleY(1); }

/* Room project-picker pill — outlined like the reference "El proyecto", fills
   brass on hover (INK on BRASS = 5.2:1 AA). Colour set inline per band tone, so
   the hover overrides need !important. */
.sv-room-pill:hover, .sv-room-pill:focus-visible {
  background: ${BRASS}; border-color: ${BRASS} !important; color: ${INK} !important;
}

/* Clickable slab (room categories) — subtle lift paired with the photo hover. */
.sv-slab:hover { transform: translateY(-4px); box-shadow: 0 18px 40px -20px rgba(27,23,19,.45); }

/* All hover motion is gated here — reduced motion gets the same end states
   instantly (no transition declared → instant). */
@media (prefers-reduced-motion: no-preference) {
  .sv-ul::after { transition: transform .4s cubic-bezier(.4,0,.2,1); }
  .sv-cta { transition: letter-spacing .35s ease, color .2s ease; }
  .sv-room-pill { transition: background .35s ease, color .25s ease, border-color .35s ease; }
  .sv-cta::before { transition: transform .45s cubic-bezier(.4,0,.2,1); }
  .sv-photo .sv-photo-img { transition: filter .6s ease; }
  .sv-photo .sv-media-down { transition: transform .7s cubic-bezier(.22,1,.36,1); }
  .sv-flip-frame::after { transition: opacity .5s ease, transform .5s cubic-bezier(.22,1,.36,1); }
  .sv-photo figcaption { transition: opacity .4s ease; }
  .sv-slab { transition: transform .5s cubic-bezier(.22,1,.36,1), box-shadow .5s ease; }
}

/* Full-bleed photo slabs (reference full-height image panels) — full-width
   tall blocks in the vertical document; the journey media query promotes them
   to 100vw × 100svh panels. */
.sv-p-bleed { position: relative; width: 100%; min-height: 82svh; }

/* Rooms = the reference "project picker": each room is a full-bleed panel — a
   parallaxing image over a caption band (centred title + corner furniture).
   Vertical stack by default; 100vw panels riding the journey on desktop. */
.sv-rooms-row { display: block; }
.sv-room-panel { position: relative; width: 100%; display: flex; flex-direction: column; }
.sv-room-media { position: relative; width: 100%; height: 56svh; }
.sv-room-band { position: relative; min-height: 44svh; padding: 2.5rem 0; }

/* ═══ THE HORIZONTAL JOURNEY (the reference's architecture, their is_mobile
   split): desktop + motion-ok lays EVERY panel on one max-content track,
   translated by ONE pinned master scrub — vertical wheel input travels the
   page sideways. Below lg or under reduced motion none of this CSS exists
   and the page is the plain vertical document above. ═══ */
@media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
  .sv-journey { height: 100svh; overflow: hidden; }
  .sv-track {
    position: relative; display: flex; width: max-content;
    height: 100svh; align-items: stretch;
    /* Keep the track on its own compositor layer for the whole traverse so
       the browser never promotes/demotes it mid-scroll (measured: removes the
       long frames during the pinned journey). */
    will-change: transform; backface-visibility: hidden;
  }
  /* The peel/parallax targets are transformed or clipped every frame — hint
     them too so each is rasterised once instead of on every tick. */
  .sv-media-up { will-change: clip-path, transform; }
  .sv-media-source { will-change: transform; }
  .sv-track > * { height: 100svh; flex: none; overflow: hidden; }
  .sv-p-hero, .sv-p-rails, .sv-p-foot, .sv-p-bleed { width: 100vw; }
  .sv-p-rails { min-height: 0; }

  /* rooms — each category is its own full-viewport project panel; you travel
     from one to the next as the journey scrolls sideways. */
  .sv-p-rooms { width: max-content; }
  .sv-rooms-row { display: flex; height: 100svh; align-items: stretch; }
  .sv-room-panel { width: 100vw; height: 100svh; }
  .sv-room-media { height: 60svh; }
  .sv-room-band { flex: 1; min-height: 0; padding: 0; }

  /* restaurant — one wide black panel, content flowing laterally */
  .sv-p-rest { width: max-content; }
  .sv-rest-inner {
    display: flex; align-items: center; gap: 5vw;
    height: 100svh; width: max-content; padding: 0 6vw;
  }
  .sv-rest-head { width: 22vw; align-self: flex-start; padding-top: 10svh; }
  .sv-rest-title { font-size: min(7.5vw, 14svh); white-space: nowrap; margin: 0; }
  .sv-rest-grid { display: flex; align-items: center; gap: 4vw; margin-top: 0; width: max-content; }
  .sv-rest-copy { width: min(34rem, 32vw); }
  .sv-rest-hours { width: clamp(280px, 22vw, 360px); }
  .sv-rest-photos { display: flex; align-items: center; gap: 3vw; margin-top: 0; width: max-content; }
  .sv-rest-photos > figure { width: clamp(250px, 20vw, 380px); }

  /* saga — era-over-photo columns side by side */
  .sv-p-saga { width: max-content; display: flex; align-items: stretch; }
  .sv-saga-head { width: 24vw; flex: none; padding: 10svh 0 0 5vw; }
  .sv-saga-head h2 { font-size: min(2.6vw, 5svh) !important; max-width: 18vw; }
  .sv-saga-steps {
    display: flex; align-items: center; gap: 5vw;
    padding: 0 8vw 0 2vw; width: max-content;
  }
  .sv-saga-step {
    margin-top: 0; width: max-content;
    display: flex; flex-direction: column; align-items: center;
  }
  .sv-saga-text { padding: 3svh 0 0; max-width: 24rem; text-align: center; }

  /* weddings */
  .sv-p-wed { width: max-content; }
  .sv-wed-inner {
    display: flex; align-items: center; gap: 5vw;
    height: 100svh; width: max-content; padding: 0 6vw;
  }
  .sv-wed-head { width: 18vw; align-self: flex-start; padding-top: 10svh; }
  .sv-wed-grid { display: flex; align-items: center; gap: 4vw; margin-top: 0; width: max-content; }
  .sv-wed-copy { width: min(26rem, 26vw); max-width: none; }
  .sv-wed-copy h2 { font-size: min(3.4vw, 6.5svh) !important; }
  .sv-wed-photos { display: flex; align-items: center; gap: 3vw; width: max-content; }
  .sv-wed-photos > figure { width: clamp(240px, 20vw, 380px); }

  /* staðurinn */
  .sv-p-place { width: max-content; }
  .sv-place-inner {
    display: flex; align-items: center; gap: 5vw;
    height: 100svh; width: max-content; padding: 0 8vw 0 6vw;
  }
  .sv-place-head { width: 20vw; align-self: flex-start; padding-top: 10svh; }
  .sv-place-titlegrid { display: block; margin-top: 0; width: 26vw; }
  .sv-place-titlegrid h2 { font-size: min(4vw, 8svh) !important; }
  .sv-place-stripwrap { margin-top: 0; }
  .sv-place-strip { display: flex; align-items: center; width: max-content; gap: 3vw; }
  .sv-place-strip .sv-slab-place { width: clamp(280px, 24vw, 440px); flex: none; }

  /* footer */
  .sv-p-foot { display: flex; flex-direction: column; justify-content: space-between; padding-bottom: 4svh; }
  .sv-foot-grid { margin-top: 3svh; }
  .sv-foot-map { height: min(420px, 46svh); }
  .sv-foot-wordwrap { margin-top: 0; }
}

@keyframes sv-menu-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes sv-menu-link { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: none; } }
.sv-menu-panel { animation: sv-menu-in .3s ease both; }
.sv-menu-link { animation: sv-menu-link .55s cubic-bezier(.22,1,.36,1) both; }

@media (prefers-reduced-motion: reduce) {
  .sv-menu-panel, .sv-menu-link { animation: none !important; opacity: 1 !important; transform: none !important; }
  .sv-photo .sv-photo-img { transition: none !important; filter: none !important; transform: none !important; }
  .sv-cta { transition: none !important; }
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
    <figure className={`sv-photo relative m-0 ${className}`}>
      <div className={`sv-flip-frame relative overflow-hidden ${aspect}`}
        data-cursor="Skoða"
        data-sv-flip={flip}
        data-sv-scrub={flipScrub ? '1' : undefined}
        data-sv-parallax={parallax ? '1' : undefined}>
        {failed ? (
          <div className="absolute inset-0" style={{ background: '#DCD5C4' }} role="img" aria-label={alt} />
        ) : (
          <>
            <div className="sv-media-down">
              <img
                src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async"
                {...(priority ? { fetchpriority: 'high' as const } : {})}
                onError={() => setFailed(true)}
                className="sv-photo-img sv-media-source absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: position }}
              />
            </div>
            {flip ? (
              <div className="sv-media-up" aria-hidden>
                <img
                  src={src} alt="" loading={priority ? 'eager' : 'lazy'} decoding="async"
                  className="sv-photo-img absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: position }}
                />
              </div>
            ) : null}
          </>
        )}
      </div>
      {spec ? (
        <figcaption
          className="sv-up mt-0 flex items-baseline justify-between gap-4 border-t pt-2.5 text-[10.5px] uppercase tracking-[0.18em]"
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
      <div className="sv-rule-draw h-px w-full origin-left"
        style={{ background: tone === 'light' ? INK : BONE, opacity: tone === 'light' ? 0.55 : 0.4 }} />
      <div className="sv-up flex items-baseline justify-between pt-3 text-[11px] font-medium uppercase tracking-[0.24em]"
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
      const inTrack = !!target.closest('.sv-track')
      if (journeyNav && inTrack) {
        /* Horizontal journey: map the panel's x on the track to the master
           trigger's scroll range (labelToScroll pattern, done manually), then
           route through Lenis — a native scrollTo would be reverted next frame. */
        const { master, track, lenis } = journeyNav
        const maxX = Math.max(1, track.scrollWidth - window.innerWidth)
        const x = Math.min(target.offsetLeft, maxX)
        const top = master.start + (x / maxX) * (master.end - master.start)
        lenis.scrollTo(top, { immediate: reduced })
      } else if (pageLenis) {
        pageLenis.scrollTo(target, { offset: -64, immediate: reduced })
      } else {
        target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
      }
    }, 40)
  }
  const solid = scrolled || open

  return (
    <>
      <nav aria-label="Main menu" className="fixed inset-x-0 top-0 z-40"
        style={{
          background: solid ? 'rgba(244,240,231,.94)' : 'transparent',
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
            Svarfhóll
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
            <button type="button" onClick={() => go('boka')}
              className={`sv-ul flex min-h-[44px] items-center text-[13px] font-medium tracking-[0.04em] ${FOCUS}`}
              style={{ fontFamily: GROTESK, color: INK }}>
              (Book)
            </button>
            <button type="button" aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open} aria-controls="sv-menu"
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
        <div id="sv-menu" role="dialog" aria-modal="true" aria-label="Menu"
          className="sv-menu-panel fixed inset-0 z-30 flex flex-col justify-between px-6 pb-10 pt-28 lg:hidden"
          style={{ background: BONE }}>
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {NAV.map((n, i) => (
              <li key={n.id} className="sv-menu-link" style={{ animationDelay: `${90 + i * 60}ms` }}>
                <button type="button" onClick={() => go(n.id)}
                  className={`min-h-[48px] text-left text-[2.3rem] font-light ${FOCUS}`}
                  style={{ fontFamily: SERIF, fontWeight: 300, color: INK, lineHeight: 1.15 }}>
                  {n.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="sv-menu-link flex flex-wrap items-center gap-x-8 gap-y-3"
            style={{ animationDelay: `${90 + NAV.length * 60}ms` }}>
            <button type="button" onClick={() => go('boka')}
              className={`sv-ul flex min-h-[44px] items-center text-[14px] font-medium tracking-[0.04em] ${FOCUS}`}
              style={{ fontFamily: GROTESK, color: INK }}>
              (Request dates)
            </button>
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

/* ═══════════════ FullBleed — the reference's full-height photo slab ═══════
   A whole panel that IS a photograph, edge to edge (100vw × 100svh on the
   journey, full-width tall block on mobile). The flipMedia peel wipes the top
   copy away on arrival while the source beneath drifts (inner parallax) as the
   page travels past — their full-bleed-with-parallax move. A single small spec
   chip in the corner names it (year·place·ordinal vocabulary), nothing else. */
function FullBleed({ photoFile, alt, kicker, index, flip = 'left' }: {
  photoFile: string; alt: string; kicker: string; index: string
  flip?: 'up' | 'left' | 'right'
}) {
  return (
    <section className="sv-p-bleed relative overflow-hidden" aria-label={alt} style={{ background: INK }}>
      <div className="sv-flip-frame absolute inset-0 overflow-hidden"
        data-cursor="Skoða" data-sv-flip={flip} data-sv-parallax="1">
        <div className="sv-media-down">
          <img src={IMG(photoFile)} alt={alt} loading="lazy" decoding="async"
            className="sv-photo-img sv-media-source absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="sv-media-up" aria-hidden>
          <img src={IMG(photoFile)} alt="" loading="lazy" decoding="async"
            className="sv-photo-img absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>
      <div className="sv-up absolute bottom-0 left-0 flex items-baseline gap-4 px-5 py-3 md:px-8"
        style={{ background: INK }}>
        <span className="text-[11px] font-medium uppercase tracking-[0.24em]"
          style={{ fontFamily: GROTESK, color: BONE_SOFT }}>{kicker}</span>
        <span aria-hidden className="text-[11px] tracking-[0.2em]"
          style={{ fontFamily: GROTESK, color: BRASS }}>({index})</span>
      </div>
    </section>
  )
}

/* ═══════════════ HERO — the word stands on the horizon ═══════════════════ */
function Hero() {
  const heroChars = HERO.word.split('')
  return (
    <header className="sv-p-hero relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Sky — driven by the page-wide scrub via CSS custom properties. */}
      <div className="relative" style={{
        height: '62svh',
        background: 'linear-gradient(180deg, var(--sv-sky-hi) 0%, var(--sv-sky-lo) 100%)',
      }}>
        <p className="sv-hero-fade absolute left-5 top-20 m-0 text-[11px] font-medium uppercase tracking-[0.26em] md:left-8"
          style={{ fontFamily: GROTESK, color: INK_SOFT }}>
          {HERO.eyebrow}
        </p>
        <div className="absolute inset-x-0 bottom-0">
          <p className="sv-hero-fade m-0 pb-2 text-center text-[12px] font-medium uppercase tracking-[0.5em]"
            style={{ fontFamily: GROTESK, color: INK_SOFT }} aria-hidden>
            {HERO.wordPrefix}
          </p>
          <div className="sv-hero-mask">
            <h1 aria-label={`${HERO.wordPrefix} ${HERO.word}`}
              className="sv-hero-word m-0 whitespace-nowrap text-center font-extralight"
              style={{
                fontFamily: SERIF, fontWeight: 200, color: INK,
                fontSize: 'min(17vw, 33svh)', letterSpacing: '-0.02em',
              }}>
              {heroChars.map((ch, i) => (
                <span key={`${ch}-${i}`} aria-hidden
                  className={`sv-hero-char${ch === 'Ó' ? ' sv-u-accent' : ''}`}>
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
        <div className="sv-flip-frame sv-hero-frame absolute inset-0 overflow-hidden"
          data-sv-flip="up" data-sv-parallax="1">
          <div className="sv-media-down">
            <img src={IMG(PHOTOS.heroWater.file)} alt={HERO.photoAlt}
              loading="eager" decoding="async" {...{ fetchpriority: 'high' as const }}
              className="sv-photo-img sv-media-source absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: 'center 55%', filter: 'saturate(.9)' }} />
          </div>
          <div className="sv-media-up" aria-hidden>
            <img src={IMG(PHOTOS.heroWater.file)} alt=""
              loading="eager" decoding="async"
              className="sv-photo-img absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: 'center 55%', filter: 'saturate(.9)' }} />
          </div>
        </div>
        <p className="sv-hero-fade absolute bottom-0 right-0 m-0 hidden px-4 py-2 text-[10px] uppercase tracking-[0.2em] md:block"
          style={{ fontFamily: GROTESK, color: BONE_MUTE, background: INK }}>
          The farm and the fell across the home field
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
    <section aria-label="Búðir" className="sv-rails-sec sv-p-rails relative flex min-h-[92svh] flex-col"
      style={{ background: 'var(--sv-ground)', overflowX: 'clip' }}>
      <div className="px-5 pt-24 md:px-8">
        <SectionHead index="01" label={HERO.word} />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-6 px-5 py-20 md:gap-8 md:px-8">
        {RAILS.map((phrase, i) => {
          const [first, ...rest] = phrase.split(' ')
          return (
            <div key={phrase} className="sv-mask sv-rail overflow-hidden"
              style={{ paddingLeft: `${4 + i * 6}%` }}>
              <p className="sv-mrise m-0 whitespace-nowrap"
                style={{ lineHeight: 1.26, fontSize: 'clamp(1.7rem, 5.4vw, 4.8rem)' }}>
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

/* ═══════════════ HERBERGI — the reference "project picker" (mod-scroll__
   projects): each room category is its own full-viewport panel — a parallaxing
   image over a caption band that carries the room name centred, with the wing /
   house / ordinal / booking-pill furniture in the four corners. Alternating
   bone/ink bands carry the rhythm (their beige/grey alternation, in Búðir's own
   two inks). Horizontal panels on the journey; a vertical stack on mobile. ═══ */
function Rooms() {
  return (
    <section id="gisting" className="sv-p-rooms scroll-mt-16">
      <div className="sv-rooms-row">
        {ROOMS.map((room, i) => {
          const dark = i % 2 === 1
          const flip = i % 2 === 0 ? 'left' : 'right'
          const titleColor = dark ? BONE : INK
          const furn = dark ? BONE_MUTE : INK_MUTE
          const noteColor = dark ? BONE_SOFT : INK_SOFT
          return (
            <article key={room.key} className="sv-room-panel"
              style={{ background: dark ? INK : 'var(--sv-ground)' }}>
              <div className="sv-room-media sv-flip-frame relative overflow-hidden"
                data-cursor="Skoða" data-sv-flip={flip} data-sv-scrub="1" data-sv-parallax="1">
                <div className="sv-media-down">
                  <img src={IMG(room.img)} alt={room.alt} loading="lazy" decoding="async"
                    className="sv-photo-img sv-media-source absolute inset-0 h-full w-full object-cover" />
                </div>
                <div className="sv-media-up" aria-hidden>
                  <img src={IMG(room.img)} alt="" loading="lazy" decoding="async"
                    className="sv-photo-img absolute inset-0 h-full w-full object-cover" />
                </div>
              </div>
              <div className="sv-room-band relative flex flex-col items-center justify-center px-6 text-center">
                <span className="sv-up absolute left-5 top-5 text-[11px] font-medium uppercase tracking-[0.24em] md:left-8"
                  style={{ fontFamily: GROTESK, color: furn }}>
                  {room.wing}
                </span>
                <span className="sv-up absolute right-5 top-5 text-[11px] font-medium uppercase tracking-[0.24em] md:right-8"
                  style={{ fontFamily: GROTESK, color: furn }}>
                  {i === 0 ? `${NAV[0].label} · (02)` : 'Svarfhóll'}
                </span>
                <h3 className="sv-chars m-0"
                  style={{
                    fontFamily: SERIF, fontWeight: 200, color: titleColor,
                    fontSize: 'clamp(2.4rem, 6vw, 5.5rem)', lineHeight: 1.05,
                  }}>
                  {room.name}
                </h3>
                <p className="sv-lines mx-auto mt-4 max-w-[34rem] text-[14px] leading-[1.7]"
                  style={{ fontFamily: GROTESK, color: noteColor }}>
                  {room.body}
                </p>
                {i === 0 ? (
                  <p className="sv-up mx-auto mt-3 max-w-[30rem] text-[12px] leading-[1.6]"
                    style={{ fontFamily: GROTESK, color: furn }}>
                    {ROOMS_NOTE}
                  </p>
                ) : null}
                <span aria-hidden className="sv-up absolute bottom-6 left-5 text-[13px] tracking-[0.1em] md:left-8"
                  style={{ fontFamily: GROTESK, color: furn }}>
                  0{i + 1}
                </span>
                <button type="button" onClick={goBook}
                  data-cursor="Book"
                  className={`sv-room-pill sv-up absolute bottom-5 right-5 inline-flex min-h-[44px] items-center rounded-full px-6 text-[12px] font-medium uppercase tracking-[0.16em] md:right-8 ${FOCUS}`}
                  style={{
                    fontFamily: GROTESK, color: titleColor,
                    border: `1px solid ${dark ? 'rgba(244,240,231,.4)' : 'rgba(27,23,19,.4)'}`,
                  }}>
                  Book
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

/* ═══════════════ HueHeading — colossal heading crossing a feature photo ═══
   The reference's real technique: the heading sits over a centered photo with
   mix-blend-mode: difference (see .sv-hue-head in PAGE_STYLES). The near-bone
   source inverts against whatever is behind — over the bone ground → ink at
   the ends, over a dark panel → bone, and over the (desaturated) photo → its
   own tonal hue in the middle. Colour, not motion: it persists under reduced
   motion; the reveal only fades it in. The photo is sized by figClass so its
   (narrower) width lets the heading's ends overhang onto the ground. */
function HueHeading({
  text, level = 2, photoFile, photoAlt, fontSize, flip,
  aspect = 'aspect-[3/4]', figClass = '', wrapClass = '',
}: {
  text: string; level?: 2 | 3; photoFile: string; photoAlt: string
  fontSize: string; flip?: 'up' | 'left' | 'right'
  aspect?: string; figClass?: string; wrapClass?: string
}) {
  const Tag = level === 2 ? 'h2' : 'h3'
  const headStyle: CSSProperties = {
    fontFamily: SERIF, fontWeight: 200, fontSize, lineHeight: 1.14,
    letterSpacing: '-0.01em', margin: 0,
  }
  return (
    <div className={`sv-hue relative ${wrapClass}`} style={{ overflowX: 'clip' }}>
      <div className={`sv-hue-fig sv-hue-photo ${figClass}`}>
        <Photo src={IMG(photoFile)} alt={photoAlt} aspect={aspect} flip={flip} />
      </div>
      <Tag className="sv-hue-head sv-hue-reveal" style={headStyle}>{text}</Tag>
    </div>
  )
}

/* ═══════════════ VEITINGASTAÐURINN — the black band ══════════════════════ */
function Restaurant() {
  /* The italic-serif interruption, built strictly from their own sentence. */
  const [barBefore, barAfter] = RESTAURANT.barLine.split(RESTAURANT.barEm)
  return (
    <section id="ljosin" className="sv-p-rest scroll-mt-16" style={{ background: INK }}>
      <div className="sv-rest-inner px-5 pb-20 pt-24 md:px-8 md:pb-28">
        <div className="sv-rest-head">
          <SectionHead index="03" label={NAV[1].label} tone="dark" />
        </div>
        {/* Hue motif: the title crosses the plate — BONE over the black band,
            INK where it crosses the (lightened) photo. */}
        <HueHeading text={RESTAURANT.title} photoFile={PHOTOS.plateFish.file}
          photoAlt={PHOTOS.plateFish.alt}
          flip="up" fontSize="clamp(2.1rem, 7vw, 6.4rem)"
          wrapClass="sv-rest-title mt-10 md:mt-0" figClass="w-[min(72vw,340px)]" />

        <div className="sv-rest-grid mt-12 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div className="sv-rest-copy">
            <p className="sv-lines m-0 max-w-[36rem] text-[15.5px] leading-[1.8]"
              style={{ fontFamily: GROTESK, color: BONE_SOFT }}>
              {RESTAURANT.body}
            </p>
            <p className="sv-lines mb-0 mt-10 max-w-[40rem]"
              style={{ lineHeight: 1.24, fontSize: 'clamp(1.5rem, 3.6vw, 2.9rem)' }}>
              <span className="font-semibold uppercase"
                style={{ fontFamily: GROTESK, letterSpacing: '-0.005em', color: BONE }}>
                {barBefore}
              </span>
              <em style={{ fontFamily: SERIF, fontWeight: 300, fontStyle: 'italic', color: BONE }}>
                {RESTAURANT.barEm}
              </em>
              <span className="font-semibold uppercase"
                style={{ fontFamily: GROTESK, letterSpacing: '-0.005em', color: BONE }}>
                {barAfter}
              </span>
            </p>
          </div>
          <div className="sv-rest-hours">
            <dl className="m-0">
              {RESTAURANT.hours.map((h) => (
                <div key={h.label}
                  className="sv-up flex items-baseline justify-between gap-6 border-b py-4"
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

        <div className="sv-rest-photos mt-16 grid gap-10 sm:grid-cols-2 lg:gap-8">
          <Photo src={IMG(PHOTOS.barTeal.file)} alt={PHOTOS.barTeal.alt}
            aspect="aspect-[4/5]" spec="Midnight sun" tone="dark" flip="up" />
          <Photo src={IMG(PHOTOS.breakfast.file)} alt={PHOTOS.breakfast.alt}
            aspect="aspect-[4/5]" spec="The neighbours" tone="dark" flip="right"
            className="lg:mt-14" />
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ SAGAN — era numerals crossing their photos (hue motif) ══ */
function Saga() {
  const sagaPhotos = [PHOTOS.aerialFarm, PHOTOS.churchGrass, PHOTOS.hosts] as const
  const sagaFlip = ['right', 'left', 'up'] as const
  return (
    <section id="gestabok" className="sv-p-saga scroll-mt-16 overflow-hidden"
      style={{ background: 'var(--sv-ground)' }}>
      <div className="sv-saga-head px-5 pt-24 md:px-8">
        <SectionHead index="04" label={NAV[2].label} />
        <div className="flex items-end justify-between gap-8">
          <h2 className="sv-lines mb-0 mt-10 max-w-[30rem]"
            style={{
              fontFamily: SERIF, fontWeight: 300, color: INK,
              fontSize: 'clamp(1.9rem, 4vw, 3.2rem)', lineHeight: 1.15,
            }}>
            {SAGA.title}
          </h2>
          <span aria-hidden className="sv-vert hidden pb-2 text-[11px] font-medium uppercase tracking-[0.3em] lg:block"
            style={{ fontFamily: GROTESK, color: INK_MUTE }}>
            {NAV[2].label} · Svarfhóll
          </span>
        </div>
      </div>

      <div className="sv-saga-steps pb-24 pt-6 md:pb-32">
        {SAGA.steps.map((step, i) => {
          const photo = sagaPhotos[i]
          return (
            <div key={step.era} className="sv-saga-step mt-16 md:mt-0">
              {/* Solid ink monuments (the hue blend made the numbers murky over
                  these photos — Sindri: "can barely read the numbers"). The
                  numeral stands alone on the ground, a roof-red rule beneath,
                  the photo as its own card below. Legibility first. */}
              <h3 className="sv-chars m-0 text-center"
                style={{
                  fontFamily: SERIF, fontWeight: 200, color: INK,
                  fontSize: 'clamp(4rem, 15vw, 11rem)', lineHeight: 1,
                }}>
                {step.era}
              </h3>
              <span aria-hidden className="mx-auto mt-4 block h-px w-16" style={{ background: BRASS }} />
              <div className="mx-auto mt-8 w-[min(60vw,280px)]">
                <Photo src={IMG(photo.file)} alt={photo.alt} aspect="aspect-[3/4]" flip={sagaFlip[i]} />
              </div>
              <p className="sv-lines sv-saga-text mx-auto mt-8 max-w-[26rem] px-5 text-[15px] leading-[1.8] md:px-0"
                style={{ fontFamily: GROTESK, color: INK_SOFT }}>
                {step.text}
              </p>
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
    <section id="beidni" className="sv-p-wed scroll-mt-16" style={{ background: 'var(--sv-ground)' }}>
      <div className="sv-wed-inner px-5 pb-24 pt-24 md:px-8 md:pb-32">
        <div className="sv-wed-head">
          <SectionHead index="05" label="The request" />
        </div>
        <div className="sv-wed-grid mt-12 grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div className="sv-wed-copy max-w-[26rem]">
            <h2 className="sv-chars m-0"
              style={{
                fontFamily: SERIF, fontWeight: 200, color: INK,
                fontSize: 'clamp(2.4rem, 5.5vw, 4.6rem)', lineHeight: 1.08,
              }}>
              {WEDDINGS.title}
            </h2>
            <p className="sv-lines mb-0 mt-7 text-[15px] leading-[1.8]"
              style={{ fontFamily: GROTESK, color: INK_SOFT }}>
              {WEDDINGS.body}
            </p>
            <button type="button" onClick={goBook}
              className={`sv-cta mt-8 inline-flex min-h-[48px] items-center px-6 text-[12px] font-semibold uppercase tracking-[0.2em] ${FOCUS}`}
              style={{ fontFamily: GROTESK, background: INK, color: BONE }}>
              {WEDDINGS.cta}
            </button>
          </div>
          <div className="sv-wed-photos grid gap-10 sm:grid-cols-[1.15fr_1fr] sm:items-start">
            <Photo src={IMG(PHOTOS.eventHall.file)} alt={PHOTOS.eventHall.alt}
              aspect="aspect-[4/5]" spec="The chalet table" flip="right" flipScrub parallax />
            <Photo src={IMG(PHOTOS.churchGrass.file)} alt={PHOTOS.churchGrass.alt}
              aspect="aspect-[4/5]" spec="The turf cabin" className="sm:mt-20" flip="left" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ STAÐURINN — the landscape, captioned honestly ═══════════ */
function Place() {
  const slabs = [PHOTOS.aerial, PHOTOS.beach] as const
  return (
    <section id="stadurinn" className="sv-p-place scroll-mt-16" style={{ background: 'var(--sv-ground)' }}>
      <div className="sv-place-inner px-5 pb-24 pt-24 md:px-8 md:pb-32">
        <div className="sv-place-head">
          <SectionHead index="06" label={NAV[3].label} />
        </div>
        <div className="sv-place-titlegrid mt-12 grid gap-8 md:grid-cols-2 md:items-center">
          {/* Hue motif: STAÐURINN crosses the coastline — INK over the bone
              ground, BONE where it crosses the darkened photo. */}
          <HueHeading text={PLACE.title} photoFile={PHOTOS.coast.file}
            photoAlt={PHOTOS.coast.alt}
            flip="up" fontSize="clamp(2.6rem, 9vw, 7.5rem)"
            figClass="w-[min(60vw,300px)]" />
          <p className="sv-lines m-0 max-w-[26rem] text-[15px] leading-[1.8] md:justify-self-end"
            style={{ fontFamily: GROTESK, color: INK_SOFT }}>
            {PLACE.body}
          </p>
        </div>
        {/* A lateral photo row inside the journey; a plain stack below lg /
            reduced motion. The journey itself provides the sideways travel —
            the coast panorama gets the inner parallax, the beach the scrubbed
            peel. */}
        <div className="sv-place-stripwrap mt-14">
          <div className="sv-place-strip">
            {slabs.map((ph, i) => (
              <Photo key={ph.file} src={IMG(ph.file)} alt={ph.alt} aspect="aspect-[4/5]"
                spec={ph.alt} className={`sv-slab-place${i === 1 ? ' lg:mt-14' : ''}`}
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
    <footer className="sv-p-foot relative overflow-hidden" style={{ background: INK }}>
      <div className="flex items-baseline justify-between px-5 pt-10 md:px-8">
        <span className="text-[12px] font-semibold uppercase tracking-[0.32em]"
          style={{ fontFamily: GROTESK, color: BONE }}>
          Svarfhóll
        </span>
        <button type="button" onClick={goBook}
          className={`sv-ul inline-flex min-h-[44px] items-center text-[13px] font-medium tracking-[0.04em] ${FOCUS}`}
          style={{ fontFamily: GROTESK, color: BONE }}>
          (Book)
        </button>
      </div>

      <div className="sv-foot-grid mt-14 grid gap-12 px-5 md:grid-cols-[1.2fr_1fr] md:gap-20 md:px-8">
        <dl className="m-0 max-w-[30rem]">
          {[
            { label: 'Email', value: EMAIL, href: EMAIL_HREF },
            { label: 'Phone', value: PHONE_DISPLAY, href: PHONE_HREF },
            { label: 'Address', value: ADDRESS, href: MAP_LINK },
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
                  className={`sv-ul inline-flex min-h-[44px] items-center text-[14px] tracking-[0.02em] ${FOCUS}`}
                  style={{ fontFamily: GROTESK, color: BONE_SOFT }}>
                  {row.value}
                </a>
              </dd>
            </div>
          ))}
        </dl>
        <div>
          <div className="overflow-hidden"
            style={{ border: '1px solid rgba(166,64,58,.45)', boxShadow: `inset 0 0 0 1px ${HAIR_BONE}` }}>
            <iframe title={`Map of Svarfhóll, ${ADDRESS}`} src={MAP_EMBED}
              loading="eager" referrerPolicy="no-referrer-when-downgrade"
              className="sv-foot-map h-[320px] w-full border-0"
              style={{ filter: 'grayscale(1) contrast(1.05) brightness(.85)' }} />
          </div>
          <a href={MAP_LINK} target="_blank" rel="noreferrer"
            className={`sv-ul mt-3 inline-flex min-h-[44px] items-center text-[11px] font-medium uppercase tracking-[0.18em] ${FOCUS}`}
            style={{ fontFamily: GROTESK, color: BONE_MUTE }}>
            Open in Google Maps
          </a>
        </div>
      </div>

      {/* The reference's colossal cropped sign-off, sunk below the fold edge;
          the lockup's other half anchors the opposite corner. */}
      <div className="sv-foot-wordwrap relative mt-16">
        <span className="absolute bottom-6 right-5 z-10 text-[12px] font-semibold uppercase tracking-[0.32em] md:right-8"
          style={{ fontFamily: GROTESK, color: BONE }}>
          Dalir
        </span>
        <p aria-hidden className="sv-footer-word m-0 select-none whitespace-nowrap pl-2 font-extralight"
          style={{
            fontFamily: SERIF, fontWeight: 200, color: BONE,
            fontSize: 'min(12.5vw, 11rem)', lineHeight: 0.95,
            transform: 'translateY(0.04em)',
          }}>
          Sjáumst í dalnum
        </p>
      </div>
    </footer>
  )
}

/* ═══════════════ CursorDot — the reference's signature cursor ════════════
   A small brass dot that trails the pointer (hand-lerped, speed 0.2, like
   their gsap.quickSetter cursor) and auto-inverts via mix-blend difference.
   Over any [data-cursor] element it swells to a disc carrying that element's
   label. Fine-pointer + motion only; the CSS media queries hide it otherwise,
   and the effect no-ops on touch / reduced motion so it is never armed. */
function CursorDot() {
  const ref = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (prefersReduced()) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const dot = ref.current, label = labelRef.current
    if (!dot || !label) return
    let x = window.innerWidth / 2, y = window.innerHeight / 2
    let tx = x, ty = y
    const setX = gsap.quickSetter(dot, 'x', 'px')
    const setY = gsap.quickSetter(dot, 'y', 'px')
    setX(x); setY(y)
    const move = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY }
    const tick = () => { x += (tx - x) * 0.2; y += (ty - y) * 0.2; setX(x); setY(y) }
    const over = (e: PointerEvent) => {
      const t = (e.target as Element | null)?.closest?.('[data-cursor]') as HTMLElement | null
      if (t) { label.textContent = t.dataset.cursor ?? ''; dot.classList.add('is-grown') }
    }
    const out = (e: PointerEvent) => {
      const t = (e.target as Element | null)?.closest?.('[data-cursor]') as HTMLElement | null
      if (t) dot.classList.remove('is-grown')
    }
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over)
    document.addEventListener('pointerout', out)
    gsap.ticker.add(tick)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.removeEventListener('pointerout', out)
      gsap.ticker.remove(tick)
    }
  }, [])
  return (
    <div ref={ref} className="sv-cursor" aria-hidden>
      <span ref={labelRef} className="sv-cursor-label" />
    </div>
  )
}

/* ═══════════════ REQUEST — the SNDR engine form, outside the journey ═════
   Lives in normal vertical flow after the pin releases. POSTs to the
   platform's svarfholl demo tenant (request-to-book, REQUEST mode): the
   record lands on the family's desk, nothing is charged, and the engine's
   refusals surface as sentences. No prices are ever rendered here. */
const BOOK_API =
  (window as unknown as { SVARFHOLL_API?: string }).SVARFHOLL_API ?? 'http://svarfholl.localhost:8787'
const BOOK_UNITS = [
  { id: 'chalet-2', label: 'Chalet 2 · 4', max: 4 },
  { id: 'chalet-3', label: 'Chalet 3 · 4', max: 4 },
  { id: 'farmhouse-room', label: 'Farmhouse room · 3', max: 3 },
] as const
const BOOK_REASONS: Record<string, string> = {
  ALREADY_BOOKED: 'Those nights are already taken for that house. Try other dates, or another house.',
  OVER_CAPACITY: 'That is more guests than the house sleeps.',
  TOO_SOON: 'That arrival is too soon for an online request. Call the family instead.',
  TOO_FAR_AHEAD: 'That is further ahead than the calendar is open. Write to the family.',
  MIN_NIGHTS: 'That stay is too short to request online.',
  MAX_NIGHTS: 'That stay is longer than can be requested online. Write to the family.',
  CLOSED_DAY: 'The farm is closed on those dates.',
  OUT_OF_SEASON: 'The farm is closed on those dates.',
  INVALID_RANGE: 'Departure must come after arrival.',
}

function BookingSection() {
  const [unit, setUnit] = useState<(typeof BOOK_UNITS)[number]['id']>('chalet-2')
  const [sending, setSending] = useState(false)
  const [doneRef, setDoneRef] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const today = new Date().toISOString().slice(0, 10)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = e.currentTarget
    const val = (n: string) => (f.elements.namedItem(n) as HTMLInputElement | null)?.value.trim() ?? ''
    const arrive = val('arrival'), depart = val('departure')
    const guests = parseInt(val('guests'), 10)
    const name = val('name'), phone = val('phone'), email = val('email'), note = val('note')
    const max = BOOK_UNITS.find((u) => u.id === unit)?.max ?? 4
    if (!arrive || !depart || depart <= arrive) { setErr('Pick an arrival and a later departure.'); return }
    if (!(guests >= 1 && guests <= max)) { setErr(`How many of you, 1 to ${max}?`); return }
    if (!name || !phone) { setErr('The family needs a name and a phone number.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr('That email does not look complete.'); return }
    setErr(null); setSending(true)
    fetch(BOOK_API + '/booking/request', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resourceId: unit, date: arrive, endDate: depart, people: guests,
        customer: { name, phone, email }, note,
      }),
    }).then((res) => res.json().then((data) => ({ status: res.status, data })))
      .then((r) => {
        ;(window as unknown as { __bookResult?: unknown }).__bookResult = r
        setSending(false)
        const d = r.data as { ok?: boolean; id?: string; reasons?: string[]; reason?: string; messages?: string[] }
        if (d.ok) { setDoneRef(d.id ?? ''); return }
        if (r.status === 409 && d.reasons?.length) {
          setErr(BOOK_REASONS[d.reasons[0]] ?? 'Those dates cannot be requested online. Call or write to the family.')
          return
        }
        if (r.status === 503 && d.reason === 'paused') { setErr(`Online requests are paused right now. Call ${PHONE_DISPLAY}.`); return }
        setErr(d.messages?.[0] ?? `The request did not go through. Call ${PHONE_DISPLAY} or write to ${EMAIL}.`)
      })
      .catch(() => { setSending(false); setErr(`The booking desk cannot be reached right now. Call ${PHONE_DISPLAY} or write to ${EMAIL}.`) })
  }

  const inputCls = 'w-full min-h-[46px] border px-3 py-2 text-[15px]'
  const inputStyle: CSSProperties = {
    fontFamily: GROTESK, color: INK, background: '#FFFDF8',
    borderColor: 'rgba(27,23,19,.28)', borderRadius: 2,
  }
  const labelCls = 'mb-2 block text-[11px] font-medium uppercase tracking-[0.22em]'
  const labelStyle: CSSProperties = { fontFamily: GROTESK, color: INK_MUTE }

  return (
    <section id="boka" aria-label="Request dates" style={{ background: 'var(--sv-ground)' }}>
      <div className="px-5 pb-24 pt-24 md:px-8 md:pb-28">
        <SectionHead index="07" label={NAV[4].label} />
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div className="max-w-[26rem]">
            <h2 className="m-0" style={{
              fontFamily: SERIF, fontWeight: 200, color: INK,
              fontSize: 'clamp(2.2rem, 5vw, 4.2rem)', lineHeight: 1.08,
            }}>
              Ask for your dates
            </h2>
            <p className="mb-0 mt-6 text-[15px] leading-[1.8]" style={{ fontFamily: GROTESK, color: INK_SOFT }}>
              Choose a house, pick your nights, and the request goes straight to the family. No card and no charge; they confirm each stay personally, the same way they have for nine years.
            </p>
          </div>

          {doneRef !== null ? (
            <div role="status" aria-live="polite">
              <h3 className="m-0" style={{ fontFamily: SERIF, fontWeight: 200, color: INK, fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
                Request sent
              </h3>
              <p className="mb-0 mt-4 max-w-[30rem] text-[15px] leading-[1.8]" style={{ fontFamily: GROTESK, color: INK_SOFT }}>
                Thank you. The request is with the family and they confirm each stay personally. Nothing is charged now.
              </p>
              <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.22em]" style={{ fontFamily: GROTESK, color: BRASS }}>
                Reference {doneRef}
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <fieldset className="m-0 border-0 p-0">
                <legend className={labelCls} style={labelStyle}>The house</legend>
                <div className="flex flex-wrap gap-2">
                  {BOOK_UNITS.map((u) => (
                    <label key={u.id} className="relative">
                      <input type="radio" name="unit" value={u.id} checked={unit === u.id}
                        onChange={() => setUnit(u.id)}
                        className="absolute inset-0 cursor-pointer opacity-0" />
                      <span className="inline-flex min-h-[44px] items-center border px-4 text-[13px]"
                        style={{
                          fontFamily: GROTESK, borderRadius: 2,
                          background: unit === u.id ? INK : '#FFFDF8',
                          color: unit === u.id ? BONE : INK,
                          borderColor: 'rgba(27,23,19,.28)',
                        }}>
                        {u.label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls} style={labelStyle} htmlFor="sv-bk-arrive">Arrival</label>
                  <input id="sv-bk-arrive" name="arrival" type="date" min={today} required className={inputCls} style={inputStyle} />
                </div>
                <div>
                  <label className={labelCls} style={labelStyle} htmlFor="sv-bk-depart">Departure</label>
                  <input id="sv-bk-depart" name="departure" type="date" min={today} required className={inputCls} style={inputStyle} />
                </div>
                <div>
                  <label className={labelCls} style={labelStyle} htmlFor="sv-bk-guests">Guests</label>
                  <input id="sv-bk-guests" name="guests" type="number" min={1} max={4} inputMode="numeric" required className={inputCls} style={inputStyle} />
                </div>
                <div>
                  <label className={labelCls} style={labelStyle} htmlFor="sv-bk-name">Name</label>
                  <input id="sv-bk-name" name="name" type="text" autoComplete="name" required className={inputCls} style={inputStyle} />
                </div>
                <div>
                  <label className={labelCls} style={labelStyle} htmlFor="sv-bk-phone">Phone</label>
                  <input id="sv-bk-phone" name="phone" type="tel" autoComplete="tel" required className={inputCls} style={inputStyle} />
                </div>
                <div>
                  <label className={labelCls} style={labelStyle} htmlFor="sv-bk-email">Email</label>
                  <input id="sv-bk-email" name="email" type="email" autoComplete="email" spellCheck={false} required className={inputCls} style={inputStyle} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls} style={labelStyle} htmlFor="sv-bk-note">Anything else <span style={{ opacity: .6 }}>(optional)</span></label>
                  <textarea id="sv-bk-note" name="note" rows={3} className={inputCls} style={inputStyle}
                    placeholder="Arrival time, the hot pot, riding nearby…" />
                </div>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-5">
                <button type="submit" disabled={sending}
                  className={`sv-cta inline-flex min-h-[48px] items-center px-7 text-[12px] font-semibold uppercase tracking-[0.2em] ${FOCUS}`}
                  style={{ fontFamily: GROTESK, background: INK, color: BONE, border: 0, cursor: 'pointer' }}>
                  {sending ? 'Sending…' : 'Send the request'}
                </button>
                <p className="m-0 max-w-[22rem] text-[12px] leading-[1.6]" style={{ fontFamily: GROTESK, color: INK_MUTE }}>
                  {ROOMS_NOTE}
                </p>
              </div>
              {err ? (
                <p aria-live="polite" className="mb-0 mt-4 text-[13px] font-medium" style={{ fontFamily: GROTESK, color: BRASS }}>
                  {err}
                </p>
              ) : null}
            </form>
          )}
        </div>
      </div>
    </section>
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
    try { return window.localStorage.getItem('sv_seen') !== '1' } catch { return false }
  })
  const preShownRef = useRef(pre)

  useEffect(() => {
    document.title = 'Svarfhóll · Farm stay in Dalir'
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
    try { window.localStorage.setItem('sv_seen', '1') } catch { /* private mode */ }
    if (!pre) return
    const el = preRef.current
    if (!el) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const chars = el.querySelectorAll('.sv-pre-char')
    const rule = el.querySelector('.sv-pre-rule')
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
        const progress = q('.sv-progress')[0] as HTMLElement | undefined

        /* 0 — LENIS drives the scroll. Without a rAF loop pumping
           ScrollTrigger.update on every frame, the pinned scrub could stall
           at x=0 (the shipped freeze); Lenis both fixes that and gives the
           momentum feel the reference has. Armed in BOTH desktop and mobile
           motion branches; never under reduced motion (this whole callback
           is gated on c.motion above). */
        const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true })
        lenis.on('scroll', ScrollTrigger.update)
        pageLenis = lenis
        const tick = (t: number) => lenis.raf(t * 1000)
        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)

        /* 1 — Sky colours: derived from ONE progress value in one callback.
           On desktop that value is the master journey trigger's progress;
           on mobile it is the vertical page trigger's. */
        const applySky = (p: number) => {
          const s = skyAt(p)
          root.style.setProperty('--sv-sky-hi', s.hi)
          root.style.setProperty('--sv-sky-lo', s.lo)
          root.style.setProperty('--sv-ground', s.ground)
        }
        applySky(0)

        /* 2 — THE MASTER (their engine, verbatim shape): all panels on one
           max-content track; ONE pinned trigger scrubs ONE track tween
           across the whole traverse. containerAnimation REQUIRES a tween
           (not a timeline) — the previous timeline form is the likely cause
           of the frozen x=0. end/x are function-form so they recompute after
           layout settles (invalidateOnRefresh). */
        const journeyEl = q('.sv-journey')[0] as HTMLElement | undefined
        const track = q('.sv-track')[0] as HTMLElement | undefined
        const maxX = () => track ? Math.max(1, track.scrollWidth - window.innerWidth) : 1
        let journeyTween: gsap.core.Tween | undefined
        if (c.desktop && journeyEl && track) {
          journeyTween = gsap.to(track, { x: () => -maxX(), ease: 'none', force3D: true })
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
          journeyNav = { master, track, lenis }
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
        gsap.fromTo(q('.sv-hero-char'), { yPercent: 118 }, {
          yPercent: 0, duration: 1.3, ease: 'power3.out', stagger: 0.07, delay: introDelay,
        })
        gsap.from(q('.sv-hero-fade'), {
          opacity: 0, y: 22, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: introDelay + 0.5,
        })

        /* 4 — Rails + hand-masked statements: play on enter, reverse on
           leave-back (the reference's toggle behaviour). */
        q('.sv-mrise').forEach((el) => {
          gsap.from(el, {
            yPercent: 112, duration: 1, ease: 'power3.out',
            scrollTrigger: trig(el, 'top 88%', 'left 88%', { toggleActions: 'play none none reverse' }),
          })
        })

        /* 5 — Horizon rules draw in. */
        q('.sv-rule-draw').forEach((el) => {
          gsap.from(el, {
            scaleX: 0, duration: 1.1, ease: 'power2.inOut',
            scrollTrigger: trig(el, 'top 92%', 'left 92%', { toggleActions: 'play none none reverse' }),
          })
        })

        /* 6 — SplitText reveals. autoSplit re-splits when Boska finishes
           loading; onSplit returns the tween so it is rebuilt cleanly.
           Line masks carry leading ≥1.15 wherever accents occur. */
        /* THE signature reveal (normalisboring): lines rise/drop in ALTERNATING
           directions inside their masks — even lines up from +110%, odd down
           from -110% — so the words cascade rather than march. Function-based
           yPercent + stagger gives the overlap in one tween. */
        q('.sv-lines').forEach((el) => {
          splits.push(SplitText.create(el, {
            type: 'lines', mask: 'lines', autoSplit: true,
            onSplit: (self) => gsap.from(self.lines, {
              yPercent: (i: number) => (i % 2 ? -110 : 110),
              duration: 0.9, ease: 'power3.out', stagger: 0.09,
              scrollTrigger: trig(el, 'top 87%', 'left 87%', { toggleActions: 'play none none reverse' }),
            }),
          }))
        })
        q('.sv-chars').forEach((el) => {
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
        q('.sv-up').forEach((el) => {
          gsap.from(el, {
            yPercent: 40, opacity: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: trig(el, 'top 90%', 'left 85%', { toggleActions: 'play none none reverse' }),
          })
        })

        /* 6c — Hue headings: fade BOTH layers together (opacity only — no
           transform, so the measured bone/ink clip stays pixel-stable through
           the reveal). Colour, not motion: reduced motion renders them solid
           via the CSS media rule. */
        q('.sv-hue-reveal').forEach((el) => {
          gsap.fromTo(el, { opacity: 0 }, {
            opacity: 1, duration: 1, ease: 'power2.out',
            scrollTrigger: trig(el, 'top 85%', 'left 85%', { toggleActions: 'play none none reverse' }),
          })
        })

        /* 7 — flipMedia peels (their measured recipe): the top copy of the
           image peels away — clip-path inset for the lateral variants, y for
           upDown — while the source copy settles beneath (counter scale /
           counter y). Default is time-based on entry; a few hero-moment
           photos ride a scrub instead (their cierre pattern). */
        const peel = (frame: HTMLElement, tlVars: gsap.TimelineVars) => {
          const dir = (frame.dataset.svFlip ?? 'up') as 'up' | 'left' | 'right'
          const up = frame.querySelector('.sv-media-up')
          const src = frame.querySelector('.sv-media-source')
          const isParallax = frame.dataset.svParallax === '1'
          if (!up || !src) return
          const tl = gsap.timeline(tlVars)
          if (dir === 'up') {
            /* A clip WIPE from the top edge, matching the lateral variants.
               (Was `y:-105%` — translating the opaque top copy made an
               identical duplicate visibly slide off the frame.) */
            tl.to(up, { '--sv-clip': '100% 0% 0% 0%', duration: 1.5, ease: 'power2.out' }, 0)
            if (!isParallax) tl.from(src, { y: '-10%', duration: 2, ease: 'power3.out' }, 0)
          } else if (dir === 'right') {
            /* their leftRight */
            tl.to(up, { '--sv-clip': '0% 100% 0% 0%', duration: 1.5, ease: 'power2.out' }, 0)
            if (!isParallax) tl.from(src, { scale: 1.2, duration: 2, ease: 'power2.out' }, 0)
          } else {
            /* their rightLeft */
            tl.to(up, { '--sv-clip': '0% 0% 0% 100%', duration: 1.5, ease: 'power2.out' }, 0)
            if (!isParallax) tl.from(src, { scale: 1.2, duration: 2, ease: 'power2.out' }, 0)
          }
        }
        q('[data-sv-flip]').forEach((el) => {
          const frame = el as HTMLElement
          if (frame.classList.contains('sv-hero-frame')) return
          const scrubbed = frame.dataset.svScrub === '1'
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
        const heroFrame = q('.sv-hero-frame')[0] as HTMLElement | undefined
        if (heroFrame) {
          const heroUp = heroFrame.querySelector('.sv-media-up')
          const heroSrc = heroFrame.querySelector('.sv-media-source')
          if (heroUp && heroSrc) {
            const htl = gsap.timeline({ delay: introDelay + 0.1 })
            htl.to(heroUp, { '--sv-clip': '100% 0% 0% 0%', duration: 1.5, ease: 'power2.out' }, 0)
            htl.from(heroSrc, { y: '-10%', duration: 2, ease: 'power3.out' }, 0)
          }
        }

        /* 8 — Inner parallax (their projectInt move), journey only: on the
           largest panel images the source drifts inside its frame as the
           page travels past. Constant slight over-scale keeps the pan
           gap-free; total lateral travel 15% of the frame. */
        if (journeyTween) {
          q('[data-sv-parallax]').forEach((el) => {
            const src = el.querySelector('.sv-media-source')
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
        const railsSec = q('.sv-rails-sec')[0]
        const railFrom = [-3, 8, -5]
        const railTo = [3, -3, 3]
        q('.sv-rail').forEach((el, i) => {
          gsap.fromTo(el, { x: `${railFrom[i] * amp}vw` }, {
            x: `${railTo[i] * amp}vw`, ease: 'none',
            scrollTrigger: trig(railsSec, 'top bottom', 'left 100%', {
              end: journeyTween ? 'right 0%' : 'bottom top', scrub: 0.6,
            }),
          })
        })
        /* (The saga era lateral drift is retired: the eras are now hue
           headings that must hold a fixed position over their photo for the
           measured clip to stay aligned — a relative drift would misalign the
           bone/ink split. Their reveal is the opacity fade above.) */
        const footWord = q('.sv-footer-word')[0]
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
        const imgs = Array.from(root.querySelectorAll('.sv-track img'))
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
          pageLenis = null
        }
      },
    )
    return () => { mm.revert() }
  }, [])

  return (
    <div ref={rootRef} lang="en" className="sv-root antialiased"
      style={{ background: 'var(--sv-ground)', overflowX: 'clip' }}>
      <style>{PAGE_STYLES}</style>
      <div className="sv-progress" aria-hidden />
      <CursorDot />

      {pre ? (
        <div ref={preRef} aria-hidden
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center"
          style={{ background: BONE }}>
          <div className="sv-pre-mask">
            <p className="m-0 whitespace-nowrap"
              style={{
                fontFamily: SERIF, fontWeight: 200, color: INK,
                fontSize: 'min(14vw, 6rem)', lineHeight: 1, letterSpacing: '-0.02em',
              }}>
              {HERO.word.split('').map((ch, i) => (
                <span key={`${ch}-${i}`} className={`sv-pre-char${ch === 'Ó' ? ' sv-u-accent' : ''}`}>
                  {ch}
                </span>
              ))}
            </p>
          </div>
          <span className="sv-pre-rule mt-5 block h-px w-40 origin-left" style={{ background: INK }} />
        </div>
      ) : null}

      <TopNav />
      {/* The journey: pinned + translated sideways on desktop. The shared
          PreviewChrome/PreviewFooter stay OUTSIDE it, in normal vertical
          flow after the pin releases — never pinned, never translated. */}
      <div className="sv-journey">
        <main className="sv-track">
          <Hero />
          <Rails />
          <FullBleed photoFile={PHOTOS.coast.file} alt={PHOTOS.coast.alt}
            kicker="The rainbow" index="I" flip="left" />
          <Rooms />
          <FullBleed photoFile={PHOTOS.loungeGallery.file} alt={PHOTOS.loungeGallery.alt}
            kicker="Inside the chalets" index="II" flip="right" />
          <Restaurant />
          <FullBleed photoFile={PHOTOS.snow.file} alt={PHOTOS.snow.alt}
            kicker="The winter" index="III" flip="up" />
          <Saga />
          <FullBleed photoFile={PHOTOS.churchHill.file} alt={PHOTOS.churchHill.alt}
            kicker="The lights" index="IV" flip="up" />
          <Weddings />
          <Place />
          <FooterBlack />
        </main>
      </div>
      <BookingSection />
      <PreviewChrome company={company} />
      <PreviewFooter company={company} />
    </div>
  )
}
