/**
 * Faxi Bakery Café — single-page landing.
 *
 * Faithful production rebuild of the "Faxi Bakery Café" design handoff from
 * Claude design. The handoff's DC-runtime prototype (x-dc / image-slot / {{ }})
 * is reproduced here in React with the project's conventions:
 *   - inline styles + one scoped <style> block for hover/keyframes (per handoff)
 *   - live "fresh in" countdown to the top of the next hour (setInterval, 1s)
 *   - deterministic steam wisps (sin-hash, built once — never on the clock tick)
 *   - one motion language (Lenis + masked wipes + line-split headlines), ./motion.tsx
 *   - seamless hero: the provided cinnamon-roll photo sits on its own cream
 *     ground, which is feathered into the page's cream gradient via a radial mask
 *
 * Exact tokens, type scale, copy and interactions follow the handoff README +
 * Faxi Bakery.dc.html (source of truth).
 */

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { getPreviewCompany } from '../companies'
import { setThemeColor } from '../../lib/preview'
import { FILMS, FULL_MENU, IMAGES, MENU_NOTE, POPULAR, SHOTS, STATS, VISIT } from './data'
import type { Film, MenuGroup, Shot, Tone } from './data'
import { MOTION_CSS, usePageMotion } from './motion'

const company = getPreviewCompany('faxibakery')

// ── Design tokens ────────────────────────────────────────────────────────────
// Cream is sampled EXACTLY from the hero photo's own background edge (#F0E4CF),
// so the page and the crisp photo are the same tone — the photo's rectangular
// edges dissolve into the page with no feather and no visible seam.
const CREAM = '#F1E4CE' // page base — the photo's background cream, exactly
const CREAM_LIGHT = '#FAF3E4' // surfaces / text on dark (light warm tint of cream)
const INK = '#1B1712' // volcanic near-black
const MOSS = '#4C5A41' // moss green
const MOSS_LIGHT = '#A7B197' // muted labels on dark
const SAND = '#D7CDB6' // muted labels on moss
const CARAMEL = '#C2773A' // warm script accent
// Flat cream behind the hero, identical to the photo background.
const HERO_BG = CREAM
const IG = 'https://www.instagram.com/faxi_bakery_/'
// Type. Cabinet Grotesk carries the display voice: modern, premium, with just
// enough warmth in the terminals to belong to a bakery. Hanken keeps the body
// quiet. Azeret Mono does the meta work — labels, counters, prices — which is
// what stops the page reading as a brochure.
const BASE_URL = import.meta.env.BASE_URL
const DISPLAY = "'Cabinet Grotesk', system-ui, sans-serif"
const MONO = "'Azeret Mono', ui-monospace, SFMono-Regular, monospace"
/** Opening reveal: hold on the wordmark, then lift. */
const BOOT_HOLD = 1150
const BOOT_LIFT = 1150

const EASE = 'cubic-bezier(.16,.84,.44,1)'

// Steam defaults (handoff design knobs)
const STEAM = { warmth: '#FBE6C6', opacity: 0.18, spread: 520, speed: 1, wisps: 9 }

// ── Scoped CSS — keyframes + hover states (handoff uses :hover / style-hover) ──
const PAGE_CSS = `
  @font-face{font-family:'Cabinet Grotesk';font-weight:100 900;font-style:normal;font-display:swap;
    src:url('${BASE_URL}fonts/cabinet-grotesk/CabinetGrotesk-Variable.woff2') format('woff2')}
  @font-face{font-family:'Azeret Mono';font-weight:400;font-style:normal;font-display:swap;
    src:url('${BASE_URL}fonts/azeret-mono/AzeretMono-Regular.woff2') format('woff2')}
  @font-face{font-family:'Azeret Mono';font-weight:500;font-style:normal;font-display:swap;
    src:url('${BASE_URL}fonts/azeret-mono/AzeretMono-Medium.woff2') format('woff2')}

  ${MOTION_CSS}
  .faxi-linebox { display:block; overflow:hidden; }
  .faxi-line { display:block; will-change:transform; }

  /* Meta voice: counters, labels, prices. Mono is what keeps this a counter
     and not a brochure. */
  .faxi-meta { font-family:${MONO}; font-size:11px; font-weight:500; letter-spacing:.16em;
               text-transform:uppercase; }

  .faxi-page ::selection { background:${MOSS}; color:${CREAM_LIGHT}; }
  .faxi-headline { letter-spacing:-.03em; display:flex !important; justify-content:center; align-items:baseline; }

  /* Hero height: svh (small viewport) stays constant when an in-app browser's
     toolbar collapses on scroll — vh would resize and snap the bottom-anchored
     roll up and down (the Instagram browser bug). vh first as the fallback. */
  .faxi-hero { min-height:100vh; min-height:100svh; }

  @keyframes faxi-steamA {
    0%   { opacity:0; transform:translate(0,8px) scaleX(.65) scaleY(.85); }
    14%  { opacity:1; }
    45%  { transform:translate(-12px,-52px) scaleX(1.25) scaleY(1.05); }
    72%  { opacity:.55; }
    100% { opacity:0; transform:translate(10px,-136px) scaleX(2.1) scaleY(1.35); }
  }
  @keyframes faxi-steamB {
    0%   { opacity:0; transform:translate(0,8px) scaleX(.7) scaleY(.9); }
    16%  { opacity:1; }
    48%  { transform:translate(14px,-58px) scaleX(1.3) scaleY(1.08); }
    74%  { opacity:.5; }
    100% { opacity:0; transform:translate(-9px,-142px) scaleX(2) scaleY(1.4); }
  }

  .faxi-navlink { color:${INK}; text-decoration:none; transition:color .2s ${EASE}; }
  .faxi-navlink:hover { color:${MOSS}; }

  .faxi-ig { transition:background .25s ${EASE}, color .25s ${EASE}, border-color .25s ${EASE}; }
  .faxi-ig:hover { background:${MOSS}; color:${CREAM_LIGHT}; border-color:${MOSS}; }

  .faxi-cta-primary { transition:background .25s ${EASE}; }
  .faxi-cta-primary:hover { background:${MOSS}; }
  .faxi-cta-ghost { transition:background .25s ${EASE}, border-color .25s ${EASE}; }
  .faxi-cta-ghost:hover { background:#fff; border-color:${INK}; }

  .faxi-card { transition:transform .8s ${EASE}, box-shadow .8s ${EASE}; will-change:transform; }
  .faxi-card:hover { transform:translateY(-6px); box-shadow:0 22px 44px #1B171218; }

  .faxi-visit-cta { transition:background .25s ${EASE}, color .25s ${EASE}; }
  .faxi-visit-cta:hover { background:${CARAMEL}; color:#fff; }

  .faxi-footer-link { transition:color .2s ${EASE}; }
  .faxi-footer-link:hover { color:${CARAMEL}; }

  @media (max-width:860px) {
    .faxi-story-grid, .faxi-visit-grid { grid-template-columns:1fr !important; }
    .faxi-visit-img { order:-1; }
    .faxi-stat-strip { grid-template-columns:repeat(2,1fr) !important; row-gap:30px !important; }
  }
  @media (max-width:560px) {
    .faxi-nav { grid-template-columns:auto 1fr !important; }
    .faxi-nav-links { display:none !important; }
    .faxi-herofoot { flex-direction:column; align-items:flex-start !important; gap:12px; }
    .faxi-hours { text-align:left !important; }
  }
  @media (prefers-reduced-motion: reduce) {
    .faxi-card { transition:none; }
  }

  /* ── the opening ───────────────────────────────────────────────────────────
     The curtain never toggles display; only its transform changes, so it is
     still painted while it lifts. It also stays mounted past the end of its own
     transition. Both of those are the Brass loader's two failure modes.

     Lifting uncovers the page bottom-first, so the entrance delays below run in
     that order too: the roll and the strapline arrive before the headline, and
     the chrome last. Each delay sits just after its own uncover moment. */
  .faxi-curtain { position:fixed; inset:0; z-index:60; display:flex; align-items:center;
                  justify-content:center; background:${CREAM};
                  transform:translateY(0); will-change:transform;
                  transition:transform 1.15s cubic-bezier(.76,0,.24,1); }
  .faxi-ready .faxi-curtain { transform:translateY(-101%); }
  .faxi-curtain-mark { text-align:center; }
  .faxi-curtain-rule { width:170px; height:1px; background:${INK}1f; margin:26px auto 14px; overflow:hidden; }
  .faxi-curtain-rule span { display:block; width:100%; height:100%; background:${CARAMEL};
                            transform:scaleX(0); transform-origin:left center;
                            animation:faxi-fill ${BOOT_HOLD}ms cubic-bezier(.4,0,.2,1) forwards; }
  @keyframes faxi-fill { to { transform:scaleX(1); } }

  /* Hero entrance. Gated on the curtain, never on an observer — an observer
     hands the hero its class at t=0 and the whole entrance plays behind the
     curtain, arriving on a page that is already static. */
  .faxi-enter { transition:opacity .95s cubic-bezier(.22,.61,.36,1),
                           transform .95s cubic-bezier(.22,.61,.36,1); }
  .faxi-boot .faxi-enter { opacity:0; transform:translateY(26px); }
  .faxi-boot.faxi-ready .faxi-enter { opacity:1; transform:none; }
  .faxi-cta-row { transform:translate(-50%,0); }
  .faxi-boot .faxi-cta-row { opacity:0; transform:translate(-50%,26px); }
  .faxi-boot.faxi-ready .faxi-cta-row { opacity:1; transform:translate(-50%,0); }

  /* The roll keeps settling for a beat after the curtain clears. A front-loaded
     expo would spend its movement while still covered and land looking frozen. */
  .faxi-rollsettle { transition:transform 2.6s cubic-bezier(.22,.61,.36,1) .45s; }
  .faxi-boot .faxi-rollsettle { transform:scale(1.07); }
  .faxi-boot.faxi-ready .faxi-rollsettle { transform:none; }

  @media (prefers-reduced-motion: reduce) {
    .faxi-curtain { display:none; }
    .faxi-enter, .faxi-cta-row, .faxi-rollsettle { opacity:1 !important; transform:none !important; transition:none !important; }
    .faxi-boot .faxi-cta-row { transform:translate(-50%,0) !important; }
  }

  /* ── asset slots ───────────────────────────────────────────────────────── */
  .faxi-slot-brief { display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
  .faxi-chip { display:inline-flex; align-items:center; gap:7px; font-family:${MONO}; font-size:9px; font-weight:500;
               letter-spacing:.18em; text-transform:uppercase; padding:5px 10px; border-radius:2px; white-space:nowrap; }

  /* ── out of the oven ───────────────────────────────────────────────────── */
  .faxi-pop-grid { display:grid; grid-template-columns:1.18fr 1fr; gap:clamp(14px,1.6vw,24px); align-items:stretch; }
  .faxi-pop-side { display:flex; flex-direction:column; gap:clamp(14px,1.6vw,24px); }
  .faxi-pop-row  { display:grid; grid-template-columns:132px 1fr; gap:20px; align-items:center; }

  /* ── the menu stage ────────────────────────────────────────────────────── */
  .faxi-rail { position:relative; width:2px; flex:none; align-self:stretch; background:#F1E4CE1f; }
  .faxi-rail > span { position:absolute; inset:0; background:${CARAMEL};
                      transform:scaleY(0); transform-origin:top center; will-change:transform; }
  .faxi-cat { transition:color .55s ${EASE}; }
  .faxi-cat:hover { color:${CREAM_LIGHT} !important; }
  .faxi-cat:focus-visible { outline:2px solid ${CARAMEL}; outline-offset:6px; }
  .faxi-cat, .faxi-filmctl { touch-action:manipulation; -webkit-tap-highlight-color:transparent; }
  .faxi-filmctl:focus-visible { outline:2px solid ${CARAMEL}; outline-offset:4px; }
  .faxi-filmctl { transition:background .25s ${EASE}, border-color .25s ${EASE}; }
  .faxi-filmctl:hover { background:${INK}; border-color:${CREAM_LIGHT}; }

  .faxi-page h2, .faxi-page h3 { text-wrap:balance; }

  /* ── mobile menu rail ──────────────────────────────────────────────────── */
  .faxi-mcats { position:sticky; top:0; z-index:6; display:flex; gap:8px; overflow-x:auto;
                scrollbar-width:none; -webkit-overflow-scrolling:touch;
                padding:13px clamp(20px,5vw,72px); background:${INK}f2;
                backdrop-filter:blur(10px); border-block:1px solid #F6F0E31a; }
  .faxi-mcats::-webkit-scrollbar { display:none; }
  .faxi-mcat { flex:none; font-family:${MONO}; font-size:10px; font-weight:500; letter-spacing:.14em;
               text-transform:uppercase; color:#F6F0E3b8; text-decoration:none; white-space:nowrap;
               padding:14px 16px; border:1px solid #F6F0E326; border-radius:2px;
               touch-action:manipulation; -webkit-tap-highlight-color:transparent;
               transition:color .25s ${EASE}, border-color .25s ${EASE}; }
  .faxi-mcat:hover, .faxi-mcat:focus-visible { color:${CREAM_LIGHT}; border-color:${CARAMEL}; }
  .faxi-mcat:focus-visible { outline:2px solid ${CARAMEL}; outline-offset:3px; }

  @media (max-width:1000px) {
    .faxi-pop-grid { grid-template-columns:1fr !important; }
    .faxi-window-grid { grid-template-columns:1fr !important; }
  }
  .faxi-stat-strip { display:flex; justify-content:space-between; align-items:flex-start; gap:clamp(20px,4vw,60px); }
  .faxi-stat-strip > :nth-child(2) { text-align:center; }
  .faxi-stat-strip > :last-child { text-align:right; }

  @media (max-width:860px) {
    .faxi-story-grid, .faxi-visit-grid, .faxi-pair { grid-template-columns:1fr !important; }
    .faxi-visit-img { order:-1; }
  }
  @media (max-width:560px) {
    .faxi-nav { grid-template-columns:auto 1fr !important; }
    .faxi-nav-links { display:none !important; }
    .faxi-herofoot { flex-direction:column; align-items:flex-start !important; gap:12px; }
    .faxi-hours { text-align:left !important; }
    .faxi-pop-row { grid-template-columns:1fr !important; gap:14px !important; }
    /* The category name and its Icelandic sub already sit on the photo directly
       above the sheet on mobile; repeating them here only forces a wrap. */
    .faxi-sheet-sub { display:none; }
    .faxi-stat-strip { flex-direction:column; gap:22px; }
    .faxi-stat-strip > * { text-align:left !important; }
  }
`

// ── Steam (deterministic; built once, gated behind reduced-motion) ───────────
function Steam({ reduced }: { reduced: boolean }) {
  const wisps = useMemo(() => {
    const { warmth, spread, speed, wisps: n } = STEAM
    void spread
    const rnd = (i: number, s: number) => {
      const x = Math.sin((i + 1) * 12.9898 + s * 78.233) * 43758.5453
      return x - Math.floor(x)
    }
    const out = []
    for (let i = 0; i < n; i++) {
      const leftPct = ((i + 0.5) / n) * 100 + (rnd(i, 1) - 0.5) * (60 / n)
      const w = 14 + rnd(i, 2) * 26
      const h = 64 + rnd(i, 3) * 78
      const dur = (4.4 + rnd(i, 4) * 3.2) / speed
      const delay = -rnd(i, 5) * dur
      const blur = 6 + rnd(i, 6) * 6
      const name = i % 2 ? 'faxi-steamA' : 'faxi-steamB'
      out.push(
        <span
          key={i}
          style={{
            position: 'absolute',
            bottom: 0,
            left: leftPct + '%',
            width: w.toFixed(0) + 'px',
            height: h.toFixed(0) + 'px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${warmth} 0%, rgba(255,255,255,0) 72%)`,
            filter: `blur(${blur.toFixed(1)}px)`,
            animation: `${name} ${dur.toFixed(2)}s ease-in-out ${delay.toFixed(2)}s infinite`,
            willChange: 'transform, opacity',
          }}
        />,
      )
    }
    return out
  }, [])

  if (reduced) return null
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        left: '50%',
        bottom: '42%',
        transform: 'translateX(-50%)',
        width: STEAM.spread + 'px',
        maxWidth: '92vw',
        height: 160,
        opacity: STEAM.opacity,
        zIndex: 2,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
      }}
    >
      {wisps}
    </div>
  )
}

// ── Asset slots ──────────────────────────────────────────────────────────────
// Every image and film on this page resolves in three tiers:
//   1. the real Faxi file under public/faxibakery/  (drop it in, it takes over)
//   2. a vetted stand-in holding the composition    (marked with a corner dot)
//   3. a drawn placeholder carrying the shot brief  (a work order, not a hole)
// Tier 3 is the point of this build: the layout is finished, the content is not,
// and the page says exactly which photo it is still waiting for.

const SLOT_GROUND: Record<Tone, string> = {
  terrain: 'linear-gradient(158deg,#75846A 0%,#4A563F 56%,#2F382A 100%)',
  food: 'linear-gradient(158deg,#EEE1C7 0%,#DCC79F 58%,#C8AE85 100%)',
  room: 'linear-gradient(158deg,#342D25 0%,#1B1712 100%)',
}
const SLOT_INK: Record<Tone, string> = { terrain: '#F1E4CE', food: '#1B1712', room: '#F1E4CE' }

/** Contour lines for terrain/room slots, concentric rings for food. Deterministic. */
function SlotField({ tone, ink }: { tone: Tone; ink: string }) {
  if (tone === 'food') {
    return (
      <svg
        aria-hidden
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.2 }}
      >
        {[34, 68, 102, 136, 170, 204].map((r) => (
          <circle key={r} cx="200" cy="152" r={r} fill="none" stroke={ink} strokeWidth="1" />
        ))}
      </svg>
    )
  }
  return (
    <svg
      aria-hidden
      viewBox="0 0 440 300"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.22 }}
    >
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const y = 22 + i * 42
        return (
          <path
            key={i}
            d={`M -30 ${y} C 70 ${y - 20 - i * 4}, 150 ${y + 19 + i * 3}, 250 ${y - 9} S 400 ${y + 15}, 470 ${y - 3}`}
            fill="none"
            stroke={ink}
            strokeWidth="1"
          />
        )
      })}
    </svg>
  )
}

/** Print-style crop marks — reads as "asset slot" without shouting. */
function CropMarks({ ink }: { ink: string }) {
  const arm = 13
  const off = 12
  const bar = (s: CSSProperties): CSSProperties => ({ position: 'absolute', background: ink, opacity: 0.34, ...s })
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <span style={bar({ top: off, left: off, width: arm, height: 1 })} />
      <span style={bar({ top: off, left: off, width: 1, height: arm })} />
      <span style={bar({ top: off, right: off, width: arm, height: 1 })} />
      <span style={bar({ top: off, right: off, width: 1, height: arm })} />
      <span style={bar({ bottom: off, left: off, width: arm, height: 1 })} />
      <span style={bar({ bottom: off, left: off, width: 1, height: arm })} />
      <span style={bar({ bottom: off, right: off, width: arm, height: 1 })} />
      <span style={bar({ bottom: off, right: off, width: 1, height: arm })} />
    </div>
  )
}

/** The drawn placeholder: what to shoot, and where the file goes. */
function SlotPlaceholder({
  tone,
  label,
  brief,
  file,
  spec,
  compact,
  bleed,
  quiet,
}: {
  tone: Tone
  label: string
  brief: string
  file: string
  spec?: string
  compact?: boolean
  /** The drift layer overhangs its frame by 6% top and bottom, so a marker
   *  pinned in px falls outside the visible crop. Percentages keep it inside. */
  bleed?: boolean
  /** Draw the ground only. Used when something else already labels the slot. */
  quiet?: boolean
}) {
  const ink = SLOT_INK[tone]
  return (
    <div
      role="img"
      aria-label={`Placeholder. Needs ${file}. ${brief}`}
      style={{ position: 'absolute', inset: 0, background: SLOT_GROUND[tone], overflow: 'hidden' }}
    >
      <SlotField tone={tone} ink={ink} />
      <CropMarks ink={ink} />
      {!quiet && (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          gap: compact ? 6 : 10,
          padding: compact ? 12 : 'clamp(18px,2.2vw,28px)',
          paddingBottom: bleed ? '9%' : undefined,
          color: ink,
          textShadow: bleed ? '0 1px 14px #1B171288' : undefined,
        }}
      >
        <span
          className="faxi-chip"
          style={{ alignSelf: 'flex-start', background: `${ink}1f`, border: `1px solid ${ink}3d`, color: ink }}
        >
          <span style={{ width: 5, height: 5, borderRadius: 5, background: ink, display: 'block' }} />
          {label}
        </span>
        {!compact && (
          <p
            className="faxi-slot-brief"
            style={{ margin: 0, fontSize: 'clamp(12px,1vw,13.5px)', lineHeight: 1.5, opacity: 0.86, maxWidth: '46ch' }}
          >
            {brief}
          </p>
        )}
        {!compact && (
          <div style={{ fontSize: 10.5, letterSpacing: '.06em', opacity: 0.62, fontVariantNumeric: 'tabular-nums' }}>
            {file}
            {spec ? ` · ${spec}` : ''}
          </div>
        )}
      </div>
      )}
    </div>
  )
}

/** Quiet marker so a stand-in is never mistaken for Faxi's own photography. */
function StandInDot({ bleed }: { bleed?: boolean }) {
  return (
    <span
      title="Stand-in frame. Swap for Faxi's own photograph."
      style={{
        position: 'absolute',
        left: 12,
        bottom: bleed ? '9%' : 12,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 9px 4px 7px',
        borderRadius: 100,
        background: '#1B1712a3',
        color: '#F1E4CEcc',
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '.14em',
        textTransform: 'uppercase',
        pointerEvents: 'none',
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: 5, background: '#C2773A', display: 'block' }} />
      stand-in
    </span>
  )
}

/** A photo slot. Falls real file → stand-in → placeholder, on load failure. */
function ShotView({
  shot,
  style,
  className,
  priority,
  compact,
  bleed,
  quiet,
  sizes,
}: {
  shot: Shot
  style?: CSSProperties
  className?: string
  priority?: boolean
  compact?: boolean
  bleed?: boolean
  quiet?: boolean
  sizes?: string
}) {
  // 0 = the real file, 1 = the stand-in, 2 = the drawn placeholder.
  const [tier, setTier] = useState<0 | 1 | 2>(0)
  const src = tier === 0 ? shot.src : tier === 1 ? shot.standIn : undefined

  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden', background: SLOT_GROUND[shot.tone], ...style }}>
      {src ? (
        <img
          key={tier}
          src={src}
          alt={shot.alt}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setTier((t) => (t === 0 && shot.standIn ? 1 : 2))}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <SlotPlaceholder
          tone={shot.tone}
          label={compact ? 'photo' : 'photo needed'}
          brief={shot.brief}
          file={shot.file}
          compact={compact}
          bleed={bleed}
          quiet={quiet}
        />
      )}
      {tier === 1 && <StandInDot bleed={bleed} />}
    </div>
  )
}

/** A film slot. The poster sits underneath and the video fades over it once it plays. */
function FilmView({
  film,
  reduced,
  style,
  compact,
  bleed,
}: {
  film: Film
  reduced: boolean
  style?: CSSProperties
  compact?: boolean
  bleed?: boolean
}) {
  const [dead, setDead] = useState(false)
  const [ready, setReady] = useState(false)
  const [paused, setPaused] = useState(false)
  const vid = useRef<HTMLVideoElement>(null)
  const showVideo = !reduced && !dead

  // A decorative loop longer than five seconds must be stoppable (WCAG 2.2.2).
  // The control only appears once a real film is playing; until then the slot
  // is a still and there is nothing to pause.
  const toggle = () => {
    const v = vid.current
    if (!v) return
    if (v.paused) { void v.play(); setPaused(false) } else { v.pause(); setPaused(true) }
  }

  return (
    <div style={{ position: 'relative', overflow: 'hidden', ...style }}>
      <ShotView shot={film.poster} style={{ position: 'absolute', inset: 0 }} compact={compact} bleed={bleed} quiet />
      {showVideo && (
        <video
          ref={vid}
          src={film.src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          onError={() => setDead(true)}
          onCanPlay={() => setReady(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: ready ? 1 : 0,
            transition: `opacity .9s ${EASE}`,
          }}
        />
      )}
      {ready && !reduced && (
        <button
          type="button"
          onClick={toggle}
          aria-label={paused ? 'Play the background film' : 'Pause the background film'}
          className="faxi-filmctl"
          style={{
            position: 'absolute',
            left: compact ? 8 : 'clamp(16px,2vw,26px)',
            bottom: compact ? 8 : 'clamp(16px,2vw,26px)',
            display: 'grid',
            placeItems: 'center',
            width: compact ? 30 : 40,
            height: compact ? 30 : 40,
            borderRadius: 100,
            border: '1px solid #F1E4CE3d',
            background: '#1B1712c4',
            color: CREAM_LIGHT,
            cursor: 'pointer',
            padding: 0,
            zIndex: 3,
          }}
        >
          <span aria-hidden style={{ fontSize: compact ? 11 : 13, lineHeight: 1 }}>{paused ? '\u25B6' : '\u2016'}</span>
        </button>
      )}
      {!ready && !bleed && (
        <div
          style={{
            position: 'absolute',
            right: compact ? 8 : 'clamp(16px,2vw,26px)',
            top: compact ? 8 : 'clamp(16px,2vw,26px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 7,
            maxWidth: compact ? 150 : 280,
            textAlign: 'right',
            zIndex: 3,
          }}
        >
          <span
            className="faxi-chip"
            style={{ background: '#1B1712a8', color: CREAM_LIGHT, border: '1px solid #F1E4CE3d' }}
          >
            <span style={{ width: 0, height: 0, borderLeft: `5px solid ${CREAM_LIGHT}`, borderTop: '3.5px solid transparent', borderBottom: '3.5px solid transparent', display: 'block' }} />
            film slot
          </span>
          {!compact && (
            <span style={{ fontSize: 10.5, lineHeight: 1.45, color: '#F1E4CEb8', textShadow: '0 1px 8px #1B171299' }}>
              {film.file} · {film.spec}
            </span>
          )}
        </div>
      )}
    </div>
  )
}




/** A framed window. Photography always sits inside a frame on this page, and
 *  drifts within it — never a section sliding under the reader. */
function Frame({
  shot,
  ratio,
  delay,
  priority,
  compact,
  quiet,
  fill,
  radius = 18,
}: {
  shot: Shot
  /** Ignored when `fill` is set — the row decides the height instead. */
  ratio?: string
  delay?: number
  priority?: boolean
  /** Small frames have no room for a shot brief; show the marker only. */
  compact?: boolean
  quiet?: boolean
  /** Fill the grid row rather than dictating height from an aspect ratio. */
  fill?: boolean
  radius?: number
}) {
  return (
    <div data-mask data-delay={delay} style={{ position: 'relative', height: fill ? '100%' : undefined, aspectRatio: fill ? undefined : ratio, borderRadius: radius, overflow: 'hidden' }}>
      <div data-drift style={{ position: 'absolute', inset: '-6% 0', height: '112%' }}>
        <ShotView shot={shot} style={{ position: 'absolute', inset: 0 }} priority={priority} compact={compact} quiet={quiet} bleed />
      </div>
    </div>
  )
}

/** Rows for one menu group, set in the cream panel that floats over the ground. */
function GroupRows({ group, animated }: { group: MenuGroup; animated?: boolean }) {
  return (
    <>
      <Line animated={animated}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, paddingBottom: 14, borderBottom: `1px solid ${INK}1a` }}>
          <span className="faxi-meta faxi-sheet-sub" style={{ color: `${INK}8c` }}>Menu · {group.sub}</span>
          <span className="faxi-meta" style={{ color: `${INK}8c` }}>Prices in ISK</span>
        </div>
      </Line>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {group.rows.map((row) => (
          <li key={row.id}>
           <Line animated={animated}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, padding: '11px 0', borderBottom: `1px solid ${INK}12` }}>
            <span style={{ minWidth: 0 }}>
              <span style={{ fontWeight: 600, fontSize: 'clamp(14px,1.15vw,16px)', color: INK }}>{row.name}</span>
              {row.note && (
                <span className="faxi-meta" style={{ display: 'block', marginTop: 4, fontSize: 9.5, letterSpacing: '.12em', color: `${INK}7a` }}>
                  {row.note}
                </span>
              )}
            </span>
            <span style={{ flex: '1 1 auto', minWidth: 12 }} />
            <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 13, color: INK, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
              {row.price}
            </span>
            </div>
           </Line>
          </li>
        ))}
      </ul>
    </>
  )
}

/**
 * Changing category swaps the type on the sheet, and leaves the sheet alone.
 *
 * The first attempt rotated the whole panel about its left edge like a page
 * turning. It never read as paper: a rotating div has no spine, no thickness and
 * no backface, and its perspective projection escapes the card. What it read as
 * was a div rotating.
 *
 * This does what the rest of the page already does — every headline here rises
 * out of an overflow box, so the menu rows do too. Old rows leave upward from
 * the top down, new rows arrive from below in the same order, and the sheet
 * itself never moves. It is the printed side of the card being reset, and it
 * shares a vocabulary with the whole site instead of importing a widget.
 */
const SHEET = {
  enter: { transition: { staggerChildren: 0.035, delayChildren: 0.03 } },
  settled: { transition: { staggerChildren: 0.035 } },
  leave: { transition: { staggerChildren: 0.02 } },
}
const LINE = {
  enter: { y: '116%' },
  settled: { y: '0%', transition: { duration: 0.6, ease: [0.16, 0.84, 0.44, 1] as const } },
  leave: { y: '-116%', transition: { duration: 0.34, ease: [0.7, 0, 0.84, 0] as const } },
}

/** One row of the sheet, masked so its type can slide clear of the card edge. */
function Line({ animated, children }: { animated?: boolean; children: ReactNode }) {
  if (!animated) return <>{children}</>
  return (
    <div style={{ overflow: 'hidden' }}>
      <motion.div variants={LINE}>{children}</motion.div>
    </div>
  )
}


/**
 * The panel is a page in a bound booklet: the spine is its left edge, and moving
 * to the next category lifts the current page and turns it away, revealing the
 * one underneath. Going back turns a page in from the left instead.
 *
 * The card never changes size. A menu page is a fixed piece of paper whether it
 * carries eleven items or four — resizing the card to fit its contents is the
 * tell that it is a div and not a page.
 */

/**
 * The menu stage. The page's centrepiece: the counter's whole range, read against
 * the food itself. Category names stack at large size and ghost back when they are
 * not the one you are on; the ground photograph changes under them; the rows live
 * on a cream panel floating over it.
 *
 * The pin is CSS `position:sticky`, not a ScrollTrigger pin — a real pin rewrites
 * the document height and poisons the trigger positions of everything after it.
 * ScrollTrigger here only reports progress.
 */
function MenuStagePinned() {
  const N = FULL_MENU.length
  const [i, setI] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  // The rail fill is written straight to the node. Routing a per-frame scroll
  // value through React state would re-render the whole stage on every tick.
  const fillRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return
    const st = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        if (fillRef.current) fillRef.current.style.transform = `scaleY(${self.progress})`
        setI(Math.min(N - 1, Math.max(0, Math.floor(self.progress * N * 0.999))))
      },
    })
    return () => st.kill()
  }, [N])

  const jump = (idx: number) => {
    const track = trackRef.current
    if (!track) return
    const top = track.offsetTop + (track.offsetHeight - window.innerHeight) * ((idx + 0.5) / N)
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const group = FULL_MENU[i]

  return (
    <section id="menu" aria-label="The full menu">
      <div ref={trackRef} style={{ position: 'relative', height: `calc(${N} * 82vh + 100svh)` }}>
        <div style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden', background: INK }}>
          {/* ground — one photograph per category, crossfaded */}
          {FULL_MENU.map((g, gi) => (
            <div
              key={g.id}
              aria-hidden
              style={{ position: 'absolute', inset: 0, opacity: gi === i ? 1 : 0, transition: `opacity .9s ${EASE}` }}
            >
              <ShotView shot={g.ground} style={{ position: 'absolute', inset: 0 }} quiet />
            </div>
          ))}
          <div aria-hidden style={{ position: 'absolute', inset: 0, background: `linear-gradient(100deg,${INK}e8 0%,${INK}b0 42%,${INK}70 100%)` }} />

          <div style={{ position: 'relative', height: '100%', maxWidth: 1240, margin: '0 auto', padding: 'clamp(84px,11vh,120px) clamp(20px,4vw,72px) clamp(28px,5vh,56px)', display: 'grid', gridTemplateColumns: '1fr minmax(360px,520px)', gap: 'clamp(24px,4vw,64px)', alignItems: 'center' }}>
            {/* the categories */}
            <div>
              <div className="faxi-meta" style={{ color: CARAMEL, marginBottom: 'clamp(18px,3vh,34px)' }}>
                {String(i + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
              </div>
              <div style={{ display: 'flex', gap: 'clamp(16px,1.6vw,28px)' }}>
              {/* Progress rail. It stretches to exactly the height of the list,
                  so the names double as its tick marks and it needs no chrome
                  of its own: the fill arriving at a name means you are on it. */}
              <div className="faxi-rail" aria-hidden>
                <span ref={fillRef} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(2px,.6vh,8px)', flex: '1 1 auto', minWidth: 0 }}>
                {FULL_MENU.map((g, gi) => (
                  <button
                    key={g.id}
                    type="button"
                    className="faxi-cat"
                    aria-current={gi === i ? 'true' : undefined}
                    onClick={() => jump(gi)}
                    style={{
                      font: 'inherit',
                      fontFamily: DISPLAY,
                      fontWeight: gi === i ? 700 : 500,
                      fontSize: 'clamp(26px,4.4vw,60px)',
                      lineHeight: 1.04,
                      letterSpacing: '-.03em',
                      textAlign: 'left',
                      background: 'none',
                      border: 0,
                      padding: 0,
                      cursor: 'pointer',
                      color: gi === i ? CREAM_LIGHT : `${CREAM_LIGHT}59`,
                      transition: `color .55s ${EASE}, font-weight .55s ${EASE}`,
                    }}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
              </div>
              <p style={{ fontSize: 13.5, lineHeight: 1.55, color: '#F6F0E38f', margin: 'clamp(16px,3vh,30px) 0 0', maxWidth: '44ch' }}>
                {group.blurb}
              </p>
            </div>

            {/* the panel */}
            <div
              data-lenis-prevent
              style={{ height: 'min(64svh,600px)', background: CREAM_LIGHT, borderRadius: 4, padding: 'clamp(20px,2.4vw,30px)', overflow: 'hidden', boxShadow: '0 30px 70px #0d0b0840' }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={group.id} variants={SHEET} initial="enter" animate="settled" exit="leave">
                  <GroupRows group={group} animated />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="faxi-meta" style={{ position: 'absolute', left: 'clamp(20px,4vw,72px)', bottom: 'clamp(18px,3vh,34px)', color: '#F6F0E355', fontSize: 9.5, maxWidth: '46ch', lineHeight: 1.7 }}>
            {MENU_NOTE}
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Narrow screens get the same content, stacked, with the categories promoted to
 * a sticky rail. Five categories and up to eleven rows each is a long scroll,
 * and a long scroll without a way to jump is where a phone menu fails.
 *
 * No pinning here on purpose: a sticky full-height stage on a phone fights the
 * browser chrome collapsing and re-expanding, and wins nothing for it.
 */
function MenuStacked() {
  const pad = { padding: '0 clamp(20px,5vw,72px)', maxWidth: 1240, margin: '0 auto' } as const
  return (
    <section id="menu" aria-label="The full menu" style={{ background: INK, color: CREAM_LIGHT, padding: 'clamp(56px,8vh,110px) 0 clamp(60px,9vh,110px)' }}>
      <div style={{ ...pad, marginBottom: 'clamp(26px,4vh,40px)' }}>
        <div className="faxi-meta" style={{ color: MOSS_LIGHT }}>Everything we make</div>
        <h2 data-lines style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(34px,8vw,64px)', lineHeight: 1, letterSpacing: '-.03em', margin: '14px 0 0' }}>
          The whole counter.
        </h2>
      </div>

      <nav className="faxi-mcats" aria-label="Menu categories">
        {FULL_MENU.map((g) => (
          <a key={g.id} href={`#menu-${g.id}`} className="faxi-mcat">{g.label}</a>
        ))}
      </nav>

      <div style={pad}>
        {FULL_MENU.map((g) => (
          <div key={g.id} id={`menu-${g.id}`} style={{ scrollMarginTop: 76, marginTop: 'clamp(32px,5vh,56px)' }}>
            <div style={{ position: 'relative' }}>
              <Frame shot={g.ground} ratio="16 / 10" radius={4} quiet />
              <div aria-hidden style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top,${INK}d9,${INK}25 58%,transparent)`, pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', left: 16, right: 16, bottom: 14 }}>
                <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(24px,6.5vw,34px)', letterSpacing: '-.03em', lineHeight: 1.02, margin: 0 }}>{g.label}</h3>
                <div className="faxi-meta" style={{ color: CARAMEL, marginTop: 7, fontSize: 9 }}>{g.sub}</div>
              </div>
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.55, color: '#F6F0E38f', margin: '16px 0', maxWidth: '52ch' }}>{g.blurb}</p>
            <div style={{ background: CREAM_LIGHT, borderRadius: 4, padding: 'clamp(18px,5vw,24px)' }}>
              <GroupRows group={g} />
            </div>
          </div>
        ))}
        <p className="faxi-meta" style={{ fontSize: 9, lineHeight: 1.8, color: '#F6F0E355', margin: 'clamp(28px,4vh,44px) 0 0', maxWidth: '46ch' }}>
          {MENU_NOTE}
        </p>
      </div>
    </section>
  )
}

function FullMenu({ reduced }: { reduced: boolean }) {
  const [narrow, setNarrow] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia('(max-width:960px)')
    const sync = () => setNarrow(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return narrow || reduced ? <MenuStacked /> : <MenuStagePinned />
}

export default function FaxiBakeryPage() {
  const reduced = useReducedMotion() ?? false
  const rootRef = useRef<HTMLDivElement>(null)

  // Live "fresh in" countdown to the top of the next hour.
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [])
  const freshIn = useMemo(() => {
    const d = new Date(now)
    const totalSec = Math.max(
      0,
      Math.floor(((60 - d.getMinutes()) * 60000 - d.getSeconds() * 1000) / 1000),
    )
    const mm = String(Math.floor(totalSec / 60)).padStart(2, '0')
    const ss = String(totalSec % 60).padStart(2, '0')
    return `${mm}:${ss}`
  }, [now])

  useEffect(() => {
    setThemeColor(CREAM)
  }, [])

  // The opening reveal. `booting` outlives the lift on purpose: a curtain whose
  // display is removed on the same tick as its transition hard-cuts instead of
  // lifting, which is exactly how the Brass loader failed.
  const [booting, setBooting] = useState(!reduced)
  const [lifted, setLifted] = useState(false)
  useEffect(() => {
    if (reduced) return
    const lift = window.setTimeout(() => setLifted(true), BOOT_HOLD)
    const done = window.setTimeout(() => {
      setBooting(false)
      // Positions measured while the page was covered are not to be trusted.
      ScrollTrigger.refresh()
    }, BOOT_HOLD + BOOT_LIFT + 260)
    return () => {
      window.clearTimeout(lift)
      window.clearTimeout(done)
    }
  }, [reduced])

  // One motion language for the whole page: Lenis, masked image wipes, line-split
  // headlines, framed drift. See ./motion.tsx.
  usePageMotion(rootRef, reduced)

  // Scroll-linked spin: the cinnamon roll is a spiral, so as the hero scrolls
  // past it slowly turns (scrubbed to scroll position) and eases up a touch.
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const rollSpin = useSpring(useTransform(scrollYProgress, [0, 1], [0, 214]), {
    stiffness: 90,
    damping: 22,
    mass: 0.4,
  })
  const rollScale = useTransform(scrollYProgress, [0, 1], [1, 1.07])
  const rollLift = useTransform(scrollYProgress, [0, 1], [0, -36])

  return (
    <div
      ref={rootRef}
      className={`faxi-page faxi-motion${booting ? ' faxi-boot' : ''}${lifted ? ' faxi-ready' : ''}`}
      lang="en"
      style={{
        fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
        color: INK,
        background: CREAM,
        overflowX: 'clip',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{PAGE_CSS}</style>

      {/* ===================== OPENING ===================== */}
      {booting && (
        <div className="faxi-curtain" role="presentation">
          <div className="faxi-curtain-mark">
            <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 'clamp(46px,7vw,92px)', letterSpacing: '-.04em', lineHeight: .9, color: INK }}>Faxi</div>
            <div className="faxi-meta" style={{ color: MOSS, marginTop: 10, fontSize: 10 }}>Bakery · Café</div>
            <div className="faxi-curtain-rule"><span /></div>
            <div className="faxi-meta" style={{ color: '#1B171273', fontSize: 9.5 }}>
              Next batch in <span style={{ fontVariantNumeric: 'tabular-nums', color: CARAMEL }}>{freshIn}</span>
            </div>
          </div>
        </div>
      )}

      {/* ===================== HERO ===================== */}
      <section
        ref={heroRef}
        className="faxi-hero"
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          padding: '26px clamp(20px,4vw,56px) 0',
          background: HERO_BG,
        }}
      >
        {/* nav */}
        <nav
          className="faxi-nav faxi-enter"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: 16,
            position: 'relative',
            zIndex: 5,
            transitionDelay: '.86s',
          }}
        >
          <div
            className="faxi-nav-links"
            style={{ display: 'flex', gap: 26, alignItems: 'center', fontSize: 15, fontWeight: 600, letterSpacing: '.01em' }}
          >
            <a href="#view" className="faxi-navlink">The view</a>
            <a href="#menu" className="faxi-navlink">Menu</a>
            <a href="#story" className="faxi-navlink">Story</a>
            <a href="#visit" className="faxi-navlink">Visit</a>
          </div>
          <div style={{ textAlign: 'center', lineHeight: 0.9 }}>
            <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 30, letterSpacing: '-.02em' }}>Faxi</div>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.42em', color: MOSS, marginTop: 3 }}>BAKERY&nbsp;·&nbsp;CAFÉ</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, alignItems: 'center' }}>
            <a
              href={IG}
              target="_blank"
              rel="noreferrer"
              className="faxi-ig"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: INK, border: '1.5px solid #1B171225', borderRadius: 100, padding: '8px 15px', fontSize: 13, fontWeight: 600 }}
            >
              @faxi_bakery_<span style={{ fontSize: 11 }}>↗</span>
            </a>
          </div>
        </nav>

        {/* ribbon / live clock */}
        <div className="faxi-enter" style={{ display: 'flex', justifyContent: 'center', marginTop: 'clamp(18px,3vh,34px)', transitionDelay: '.80s' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: 12.5, fontWeight: 700, letterSpacing: '.12em', color: MOSS, textTransform: 'uppercase' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: CARAMEL, display: 'inline-block', boxShadow: '0 0 0 4px #C2773A22' }} />
            Next batch out of the oven in{' '}
            <span style={{ fontVariantNumeric: 'tabular-nums', color: INK, background: '#1B17120D', padding: '2px 8px', borderRadius: 6 }}>{freshIn}</span>
          </div>
        </div>

        {/* headline */}
        <div style={{ textAlign: 'center', marginTop: 'clamp(10px,2vh,22px)', position: 'relative', zIndex: 4 }}>
          <h1
            className="faxi-headline faxi-enter"
            style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 'clamp(40px,9vw,132px)', lineHeight: 0.9, letterSpacing: '-.035em', margin: 0, color: INK, whiteSpace: 'nowrap', transitionDelay: '.70s' }}
          >
            CINNAMON ROLL
          </h1>
          <div className="faxi-script faxi-enter" style={{ fontFamily: "'Caveat', cursive", fontWeight: 700, fontSize: 'clamp(30px,6vw,86px)', color: MOSS, lineHeight: 0.7, marginTop: '-.06em', transitionDelay: '.76s' }}>fresh, every hour</div>
        </div>

        {/* roll stage */}
        <div style={{ position: 'relative', flex: 1, minHeight: 'clamp(320px,46vh,560px)', marginTop: 'clamp(14px,2vh,26px)' }}>
          {/* CTAs */}
          <div className="faxi-cta-row" style={{ position: 'absolute', top: '6%', left: '50%', zIndex: 4, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', transitionDelay: '.62s' }}>
            <a href="#menu" className="faxi-cta-primary" style={{ background: INK, color: CREAM_LIGHT, textDecoration: 'none', fontWeight: 600, fontSize: 16, padding: '15px 30px', borderRadius: 100, boxShadow: '0 10px 30px #1B171233' }}>Order ahead</a>
            <a href="#menu" className="faxi-cta-ghost" style={{ background: '#FFFFFFcc', color: INK, textDecoration: 'none', fontWeight: 600, fontSize: 16, padding: '15px 30px', borderRadius: 100, border: '1.5px solid #1B171222', backdropFilter: 'blur(4px)' }}>See the menu</a>
          </div>

          {/* steam */}
          <Steam reduced={reduced} />

          {/* hero photo — crisp, unfeathered. Its own cream background is the
              exact same tone as the page (CREAM), so the square edges dissolve
              into the page while the bun stays sharp. */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 0,
              transform: 'translateX(-50%)',
              width: 'clamp(250px,37vw,460px)',
              zIndex: 1,
            }}
          >
            <div className="faxi-rollsettle">
            <motion.div
              style={{
                aspectRatio: '1 / 1',
                rotate: reduced ? 0 : rollSpin,
                scale: reduced ? 1 : rollScale,
                y: reduced ? 0 : rollLift,
                transformOrigin: '50% 46%',
                willChange: 'transform',
              }}
            >
              <img
                src={IMAGES.hero}
                alt="A single cinnamon roll, fresh from the oven — golden laminated layers dusted with cinnamon sugar"
                decoding="async"
                {...{ fetchpriority: 'high' }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </motion.div>
            </div>
          </div>
        </div>

        {/* hero footer row */}
        <div className="faxi-herofoot faxi-enter" style={{ transitionDelay: '.50s', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, padding: '0 0 26px', position: 'relative', zIndex: 4 }}>
          <div style={{ maxWidth: 340 }}>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(18px,2vw,23px)', lineHeight: 1.05, letterSpacing: '-.01em' }}>A bakery with unregular stuff.</div>
            <div style={{ fontSize: 13.5, color: '#1B1712aa', marginTop: 7, lineHeight: 1.45 }}>Pulled off Route 1 in Hvolsvöllur, under the Eyjafjallajökull volcano. Nice coffee, cool setup.</div>
          </div>
          <div className="faxi-hours" style={{ textAlign: 'right', fontSize: 12.5, fontWeight: 600, letterSpacing: '.1em', color: MOSS, textTransform: 'uppercase', lineHeight: 1.6, whiteSpace: 'nowrap' }}>
            Open every day<br />9 — 8
          </div>
        </div>
      </section>

      {/* ===================== THE COUNTER ===================== */}
      <section id="story" style={{ background: INK, color: CREAM_LIGHT, padding: 'clamp(70px,11vh,140px) clamp(20px,4vw,72px)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div data-rise className="faxi-meta" style={{ color: MOSS_LIGHT }}>The counter</div>

          {/* Headline and lead sit shoulder to shoulder — no centred column, so no void. */}
          <div className="faxi-story-grid" style={{ display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 'clamp(28px,5vw,72px)', alignItems: 'start', marginTop: 'clamp(22px,3vh,34px)' }}>
            <h2 data-lines style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(36px,5vw,74px)', lineHeight: .98, letterSpacing: '-.035em', margin: 0, maxWidth: '13ch' }}>
              A coffee stop with a <span style={{ color: CARAMEL }}>volcano</span> for a view.
            </h2>
            <div>
              <p data-rise style={{ fontSize: 'clamp(15px,1.25vw,17.5px)', lineHeight: 1.62, color: '#F6F0E3cc', margin: 0, maxWidth: '46ch' }}>
                Right where the Ring Road runs under Eyjafjallajökull, Faxi is the kind of place locals linger over coffee and road-trippers cannot quite drive past. We bake our cinnamon rolls fresh{' '}
                <em style={{ fontStyle: 'normal', color: '#fff', borderBottom: `2px solid ${CARAMEL}` }}>every hour, on the hour</em>, so something good is always coming out of the oven.
              </p>
              <p data-rise data-delay="0.08" style={{ fontSize: 'clamp(15px,1.25vw,17.5px)', lineHeight: 1.62, color: '#F6F0E3a8', margin: '18px 0 0', maxWidth: '46ch' }}>
                Real espresso from a real machine, not the automatic kind you find everywhere else in Iceland. Sit inside among the plants, or take one for the road out front.
              </p>
              <div data-rise data-delay="0.14" aria-hidden style={{ fontSize: 21, letterSpacing: '.18em', marginTop: 20 }}>🐌 🐳 🦩 🐿️</div>
            </div>
          </div>

          {/* Framed windows: the room, and the theatre inside it. */}
          <div className="faxi-pair" style={{ display: 'grid', gridTemplateColumns: '1.34fr 1fr', gridAutoRows: 'clamp(240px,32vw,440px)', gap: 'clamp(12px,1.4vw,20px)', marginTop: 'clamp(40px,6vh,74px)' }}>
            <Frame shot={SHOTS.seating} radius={4} fill />
            <Frame shot={SHOTS.kitchen} radius={4} delay={0.1} fill />
          </div>

          <div className="faxi-stat-strip" style={{ marginTop: 'clamp(44px,6vh,80px)', borderTop: '1px solid #F6F0E322', paddingTop: 34 }}>
            {STATS.map((s, i) => (
              <div key={s.caption} data-rise data-delay={0.05 * i}>
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(28px,3.6vw,48px)', letterSpacing: '-.03em', lineHeight: 1 }}>{s.value}</div>
                <div className="faxi-meta" style={{ color: MOSS_LIGHT, marginTop: 10, fontSize: 9.5 }}>{s.caption}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ THE WINDOW — the view, framed, not bled ============ */}
      <section id="view" style={{ background: CREAM, padding: 'clamp(70px,11vh,140px) clamp(20px,4vw,72px)' }}>
        <div className="faxi-window-grid" style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.02fr', gap: 'clamp(28px,5vw,76px)', alignItems: 'center' }}>
          <div>
            <div data-rise className="faxi-meta" style={{ color: MOSS }}>The window</div>
            <h2 data-lines style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(34px,4.4vw,64px)', lineHeight: 1, letterSpacing: '-.035em', margin: '18px 0 0', maxWidth: '15ch' }}>
              Sit for twenty minutes. The mountain does the rest.
            </h2>
            <p data-rise data-delay="0.08" style={{ fontSize: 'clamp(15px,1.2vw,17px)', lineHeight: 1.62, color: '#1B1712a8', maxWidth: '38ch', margin: '22px 0 0' }}>
              Most people plan to stop for five. The window is the reason they do not.
            </p>
            <div data-rise data-delay="0.14" className="faxi-meta" style={{ color: '#1B17126e', marginTop: 26, fontSize: 9.5, lineHeight: 1.9 }}>
              Eyjafjallajökull, out the north glass<br />Route 1 · Hvolsvöllur
            </div>
          </div>

          {/* The film lives in a tall frame, and drifts inside it. */}
          <div data-mask style={{ position: 'relative', aspectRatio: '3 / 4', borderRadius: 4, overflow: 'hidden' }}>
            <FilmView film={FILMS.window} reduced={reduced} style={{ position: 'absolute', inset: 0 }} />
          </div>
        </div>
      </section>

      {/* ===================== OUT OF THE OVEN ===================== */}
      <section id="popular" style={{ background: CREAM, padding: '0 clamp(20px,4vw,72px) clamp(70px,11vh,140px)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 18, paddingTop: 'clamp(50px,8vh,110px)', borderTop: `1px solid ${INK}14` }}>
            <div>
              <div data-rise className="faxi-meta" style={{ color: MOSS }}>What people stop for</div>
              <h2 data-lines style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(36px,5vw,72px)', lineHeight: 1, letterSpacing: '-.035em', margin: '16px 0 0' }}>
                Out of the oven.
              </h2>
            </div>
            <div data-rise className="faxi-meta" style={{ color: '#1B171280', maxWidth: 360, textAlign: 'right', lineHeight: 1.9, fontSize: 9.5 }}>
              Four things, and the case behind them
            </div>
          </div>

          <div className="faxi-pop-grid" style={{ marginTop: 'clamp(32px,5vh,54px)' }}>
            <article className="faxi-feature" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div data-mask style={{ position: 'relative', flex: '1 1 auto', minHeight: 'clamp(300px,44vh,500px)', borderRadius: 4, overflow: 'hidden' }}>
                <div data-drift style={{ position: 'absolute', inset: '-6% 0', height: '112%' }}>
                  <ShotView shot={POPULAR[0].shot} style={{ position: 'absolute', inset: 0 }} sizes="(max-width:1000px) 100vw, 55vw" bleed />
                </div>
                <div style={{ position: 'absolute', right: 14, bottom: 14, width: 'clamp(96px,13vw,138px)', padding: 5, borderRadius: 4, background: '#F1E4CEdd', boxShadow: '0 14px 34px #1B171233' }}>
                  <FilmView film={FILMS.oven} reduced={reduced} compact style={{ aspectRatio: '4 / 5', borderRadius: 2 }} />
                </div>
                <span className="faxi-meta" style={{ position: 'absolute', top: 14, left: 14, background: INK, color: CREAM_LIGHT, padding: '8px 12px', borderRadius: 2, fontSize: 9.5 }}>
                  {POPULAR[0].tag}
                </span>
              </div>
              <div data-rise style={{ padding: '20px 0 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 14 }}>
                  <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(22px,2.4vw,30px)', lineHeight: 1.04, letterSpacing: '-.03em', margin: 0 }}>{POPULAR[0].name}</h3>
                  <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 14, color: INK, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{POPULAR[0].price}</span>
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.55, color: '#1B1712a8', margin: '10px 0 0', maxWidth: '46ch' }}>{POPULAR[0].desc}</p>
                <div className="faxi-meta" style={{ color: CARAMEL, marginTop: 12, fontSize: 9.5 }}>{POPULAR[0].note}</div>
              </div>
            </article>

            <div className="faxi-pop-side">
              {POPULAR.slice(1).map((item, i) => (
                <article key={item.id} className="faxi-pop-row" style={{ flex: '1 1 0' }}>
                  <Frame shot={item.shot} ratio="1 / 1" radius={4} delay={0.05 * i} compact />
                  <div data-rise data-delay={0.05 * i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                      <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(17px,1.6vw,21px)', lineHeight: 1.1, letterSpacing: '-.025em', margin: 0 }}>{item.name}</h3>
                      <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 12.5, color: INK, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{item.price}</span>
                    </div>
                    <p style={{ fontSize: 13.5, lineHeight: 1.5, color: '#1B1712a0', margin: '8px 0 0' }}>{item.desc}</p>
                    <div className="faxi-meta" style={{ color: CARAMEL, marginTop: 8, fontSize: 9 }}>{item.note}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== THE MENU STAGE ===================== */}
      <FullMenu reduced={reduced} />

      {/* ===================== VISIT ===================== */}
      <section id="visit" style={{ background: MOSS, color: CREAM_LIGHT, padding: 'clamp(70px,11vh,140px) clamp(20px,4vw,72px)' }}>
        <div className="faxi-visit-grid" style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(28px,5vw,72px)', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, fontWeight: 700, letterSpacing: '.24em', color: SAND, textTransform: 'uppercase' }}>
              <span style={{ width: 34, height: 1.5, background: SAND }} />Visit
            </div>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(34px,4.6vw,66px)', lineHeight: 1, letterSpacing: '-.025em', margin: '16px 0 0' }}>Pull off the<br />Ring Road.</h2>
            <div style={{ marginTop: 30, display: 'grid', gap: 18, maxWidth: 420 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, borderBottom: '1px solid #F6F0E322', paddingBottom: 14 }}>
                <span style={{ color: SAND, fontSize: 14 }}>Where</span>
                <span style={{ fontWeight: 600, textAlign: 'right' }}>Route 1 · Hvolsvöllur<br />South Iceland</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, borderBottom: '1px solid #F6F0E322', paddingBottom: 14 }}>
                <span style={{ color: SAND, fontSize: 14 }}>Hours</span>
                <span style={{ fontWeight: 600, textAlign: 'right' }}>{VISIT.hours}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, borderBottom: '1px solid #F6F0E322', paddingBottom: 14 }}>
                <span style={{ color: SAND, fontSize: 14 }}>Call</span>
                <a href={`tel:${VISIT.callHref}`} style={{ fontWeight: 600, textAlign: 'right', color: CREAM_LIGHT, textDecoration: 'none' }}>{VISIT.call}</a>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                <span style={{ color: SAND, fontSize: 14 }}>Bookings</span>
                <span style={{ fontWeight: 600, textAlign: 'right' }}>{VISIT.bookings}</span>
              </div>
            </div>
            <a href={IG} target="_blank" rel="noreferrer" className="faxi-visit-cta" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 30, background: CREAM_LIGHT, color: INK, textDecoration: 'none', fontWeight: 700, fontSize: 15, padding: '15px 28px', borderRadius: 100 }}>
              Grab a coffee for the road <span>↗</span>
            </a>
          </div>
          <ShotView shot={SHOTS.terrace} className="faxi-visit-img" style={{ aspectRatio: '1 / 1', borderRadius: 24 }} sizes="(max-width:860px) 100vw, 45vw" />
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer style={{ background: INK, color: CREAM_LIGHT, padding: '46px clamp(20px,4vw,72px)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 24, letterSpacing: '-.02em' }}>
            Faxi <span style={{ color: MOSS_LIGHT, fontWeight: 600, fontSize: 13, letterSpacing: '.2em' }}>BAKERY · CAFÉ</span>
          </div>
          <div style={{ fontSize: 13, color: '#F6F0E388' }}>A bakery with unregular stuff · Hvolsvöllur, Iceland · ©2026</div>
          <a href={IG} target="_blank" rel="noreferrer" className="faxi-footer-link" style={{ color: CREAM_LIGHT, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>@faxi_bakery_ ↗</a>
        </div>
      </footer>

      <PreviewChrome company={company} />
      <PreviewFooter company={company} />
    </div>
  )
}
