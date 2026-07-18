/**
 * Öruggt skjól — custom warm illustration system (inline SVG).
 *
 * Everything here is hand-built vector art so it stays crisp, themeable and
 * animatable — and costs zero image credits.
 *
 * PERFORMANCE CONTRACT: browsers cannot composite transforms on elements
 * INSIDE an svg, so anything that animates forever (sun, clouds, birds) must
 * be its own top-level <svg> element moved with plain CSS transforms. The
 * terrain svg stays fully static: painted once, cached as a single GPU
 * texture, then only translated by the hero parallax. Never put an infinite
 * animation back inside the terrain or scrolling drops to CPU repaints.
 */

import type { CSSProperties } from 'react'

/* ── little building blocks (static, inside the terrain svg) ──────────── */

/** A cozy little house with a warmly lit (static) window. */
function House({ x, y, s = 1, wall, roof, glow = '#FFDf9E' }: { x: number; y: number; s?: number; wall: string; roof: string; glow?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="20" cy="53" rx="26" ry="5" fill="#000" opacity="0.06" />
      <rect x="4" y="22" width="32" height="30" rx="4" fill={wall} />
      <path d="M0 24 20 6 40 24Z" fill={roof} />
      <rect x="14" y="30" width="12" height="12" rx="2.5" fill={glow} />
      <rect x="14" y="30" width="12" height="12" rx="2.5" fill="none" stroke={roof} strokeWidth="1.4" opacity="0.5" />
      <line x1="20" y1="30" x2="20" y2="42" stroke={roof} strokeWidth="1" opacity="0.5" />
    </g>
  )
}

function Tree({ x, y, s = 1, c = '#6E9E6E' }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="8" y="26" width="4" height="16" rx="2" fill="#8A6A54" />
      <circle cx="10" cy="18" r="14" fill={c} />
      <circle cx="10" cy="18" r="14" fill="#FFFFFF" opacity="0.08" />
    </g>
  )
}

/* ── ambient movers (each one a composited HTML-level element) ────────── */

function SunGlyph({ style }: { style?: CSSProperties }) {
  return (
    <svg className="bofs-breathe absolute" style={{ willChange: 'transform', ...style }} viewBox="0 0 320 320" aria-hidden="true">
      <defs>
        <radialGradient id="sunGlowHtml" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFE7A8" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFE7A8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="160" cy="160" r="150" fill="url(#sunGlowHtml)" />
      <circle cx="160" cy="160" r="58" fill="#FFD37A" />
      <circle cx="160" cy="160" r="58" fill="#FFFFFF" opacity="0.12" />
    </svg>
  )
}

function CloudGlyph({ top, width, opacity = 0.9, dur, delay }: { top: string; width: string; opacity?: number; dur: number; delay: number }) {
  return (
    <svg
      className="bofs-drift absolute left-0"
      style={{ top, width, opacity, animationDuration: `${dur}s`, animationDelay: `${delay}s`, willChange: 'transform' }}
      viewBox="-10 -1 62 26"
      aria-hidden="true"
    >
      <path d="M0 12c0-7 6-12 13-12 4 0 8 2 10 5 2-2 5-3 8-3 7 0 12 5 12 11 0 1 0 2-1 3H-1c-1-2 1-4 1-4z" fill="#FFFFFF" opacity="0.9" />
      <ellipse cx="20" cy="16" rx="30" ry="7" fill="#FFFFFF" opacity="0.55" />
    </svg>
  )
}

function BirdsGlyph({ style, color = '#7A5A48' }: { style?: CSSProperties; color?: string }) {
  return (
    <svg className="bofs-fly absolute" style={{ willChange: 'transform', ...style }} viewBox="0 0 96 40" aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" opacity="0.5">
        <path d="M0 12C3.6 7.2 6 7.2 8.4 10.8 10.8 7.2 13.2 7.2 16.8 12" />
        <path d="M40 34C42.7 30.4 44.5 30.4 46.3 33.1 48.1 30.4 49.9 30.4 52.6 34" transform="scale(0.9)" />
        <path d="M74 6C77 2 79 2 81 5 83 2 85 2 88 6" />
      </g>
    </svg>
  )
}

function MoonGlyph({ style }: { style?: CSSProperties }) {
  return (
    <svg className="bofs-breathe absolute" style={{ willChange: 'transform', ...style }} viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <radialGradient id="moonGlowHtml" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFF0C9" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFF0C9" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#moonGlowHtml)" />
      <circle cx="60" cy="60" r="26" fill="#FBEAC0" />
      <circle cx="60" cy="60" r="26" fill="#FFFFFF" opacity="0.12" />
    </svg>
  )
}

function StarGlyph({ style, delay = 0 }: { style?: CSSProperties; delay?: number }) {
  return (
    <svg className="bofs-twinkle absolute" style={{ animationDelay: `${delay}s`, ...style }} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M6 0 L7 5 L12 6 L7 7 L6 12 L5 7 L0 6 L5 5Z" fill="#FBEAC0" />
    </svg>
  )
}

/* ── The valley scene: day (hero) or dusk (pre-footer bookend) ─────────── */

type Palette = 'day' | 'dusk'

const PALETTES: Record<Palette, { sky: [string, string, string]; hillFar: [string, string]; hillMid: [string, string]; hillNear: [string, string]; path: [string, string]; bush: string }> = {
  day: {
    sky: ['#FBE7CE', '#FBEEDC', '#FAF3E7'],
    hillFar: ['#CFE0C7', '#C2D8BC'],
    hillMid: ['#A8C79E', '#9BBE92'],
    hillNear: ['#83AC79', '#749E6C'],
    path: ['#F3E4C9', '#EAD6B4'],
    bush: '#6B9663',
  },
  dusk: {
    sky: ['#3A2A1E', '#573C2A', '#6E4A33'],
    hillFar: ['#5E7364', '#516454'],
    hillMid: ['#4C684C', '#425A42'],
    hillNear: ['#3B5439', '#324A31'],
    path: ['#D9BE93', '#C6A878'],
    bush: '#2F4A2E',
  },
}

export function ValleyScene({ className, style, ambient = true, palette = 'day' }: { className?: string; style?: CSSProperties; ambient?: boolean; palette?: Palette }) {
  const p = PALETTES[palette]
  const s = palette // gradient-id suffix so two mounted scenes never collide
  const dusk = palette === 'dusk'
  return (
    <div className={`pointer-events-none ${className ?? ''}`} style={style} aria-hidden="true">
      {/* static terrain: painted once, never repainted while scrolling */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 760"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
      <defs>
        <linearGradient id={`sky-${s}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sky[0]} />
          <stop offset="0.5" stopColor={p.sky[1]} />
          <stop offset="1" stopColor={p.sky[2]} />
        </linearGradient>
        <linearGradient id={`hillFar-${s}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.hillFar[0]} />
          <stop offset="1" stopColor={p.hillFar[1]} />
        </linearGradient>
        <linearGradient id={`hillMid-${s}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.hillMid[0]} />
          <stop offset="1" stopColor={p.hillMid[1]} />
        </linearGradient>
        <linearGradient id={`hillNear-${s}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.hillNear[0]} />
          <stop offset="1" stopColor={p.hillNear[1]} />
        </linearGradient>
        <linearGradient id={`path-${s}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.path[0]} />
          <stop offset="1" stopColor={p.path[1]} />
        </linearGradient>
      </defs>

      {/* sky */}
      <rect x="0" y="0" width="1440" height="760" fill={`url(#sky-${s})`} />

      {/* far hills */}
      <path d="M0 470 Q 360 380 760 452 T 1440 430 V760 H0Z" fill={`url(#hillFar-${s})`} />
      {/* mid hills */}
      <path d="M0 560 Q 420 470 900 545 T 1440 520 V760 H0Z" fill={`url(#hillMid-${s})`} />

      {/* winding path */}
      <path
        d="M690 760 C 700 660 620 640 660 560 C 690 500 740 500 720 452"
        fill="none"
        stroke={`url(#path-${s})`}
        strokeWidth="46"
        strokeLinecap="round"
        opacity={dusk ? 0.75 : 0.95}
      />
      <path
        d="M690 760 C 700 660 620 640 660 560 C 690 500 740 500 720 452"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="46"
        strokeLinecap="round"
        opacity="0.15"
      />

      {/* near hill */}
      <path d="M0 640 Q 500 560 980 630 T 1440 610 V760 H0Z" fill={`url(#hillNear-${s})`} />

      {/* houses tucked along the hills — windows glow brighter at dusk */}
      <House x={190} y={470} s={1.15} wall={dusk ? '#3E4E3D' : '#F4E6D2'} roof="#D9744E" glow={dusk ? '#FFD87E' : '#FFDf9E'} />
      <House x={1090} y={480} s={1} wall={dusk ? '#3E4E3D' : '#F4E6D2'} roof="#5E97B8" glow={dusk ? '#FFD87E' : '#FFDf9E'} />
      <House x={560} y={430} s={0.86} wall={dusk ? '#42513F' : '#F6ECDD'} roof="#6E9E6E" glow={dusk ? '#FFD87E' : '#FFDf9E'} />
      <House x={880} y={452} s={0.78} wall={dusk ? '#42513F' : '#F6ECDD'} roof="#D98895" glow={dusk ? '#FFDD8A' : '#FFE7B0'} />

      {/* the "hero" home at the top of the path */}
      <House x={676} y={392} s={1.5} wall={dusk ? '#4A5A45' : '#FBF1E2'} roof="#E0A94F" glow={dusk ? '#FFE39A' : '#FFE39A'} />

      {/* foreground trees + bushes */}
      <Tree x={70} y={600} s={1.5} c={dusk ? '#3A5638' : '#6E9E6E'} />
      <Tree x={1300} y={590} s={1.7} c={dusk ? '#3A5638' : '#6E9E6E'} />
      <Tree x={1210} y={640} s={1.1} c={dusk ? '#456841' : '#7CA972'} />
      <ellipse cx="360" cy="720" rx="150" ry="34" fill={p.bush} opacity="0.55" />
      <ellipse cx="1050" cy="726" rx="180" ry="36" fill={p.bush} opacity="0.5" />
      </svg>

      {/* ambient sky movers: composited, GPU-only motion above the sky */}
      {ambient && !dusk && (
        <div className="absolute inset-0 overflow-hidden">
          <SunGlyph style={{ right: '5%', top: '6%', width: 'clamp(170px, 22vw, 320px)' }} />
          <CloudGlyph top="12%" width="clamp(90px, 9vw, 130px)" dur={54} delay={-6} />
          <CloudGlyph top="7%" width="clamp(64px, 6.5vw, 92px)" opacity={0.8} dur={64} delay={-30} />
          <CloudGlyph top="17%" width="clamp(76px, 7.5vw, 108px)" opacity={0.85} dur={72} delay={-52} />
          <BirdsGlyph style={{ left: '28%', top: '22%', width: 'clamp(64px, 6vw, 96px)' }} />
        </div>
      )}
      {ambient && dusk && (
        <div className="absolute inset-0 overflow-hidden">
          <MoonGlyph style={{ right: '9%', top: '10%', width: 'clamp(80px, 10vw, 120px)' }} />
          <StarGlyph style={{ left: '18%', top: '18%', width: 12 }} delay={0} />
          <StarGlyph style={{ left: '30%', top: '30%', width: 9 }} delay={-1.5} />
          <StarGlyph style={{ left: '52%', top: '14%', width: 10 }} delay={-2.6} />
          <StarGlyph style={{ left: '68%', top: '26%', width: 8 }} delay={-0.8} />
          <StarGlyph style={{ left: '80%', top: '40%', width: 11 }} delay={-3.4} />
        </div>
      )}
    </div>
  )
}

/* ── Per-service artwork (a cozy scene tinted to the service hue) ──────── */

export type ArtKey =
  | 'studlar'
  | 'blonduhlid'
  | 'bjargey'
  | 'laekjarbakki'
  | 'barnahus'
  | 'mst'
  | 'sok'
  | 'fostur'

/**
 * One flexible cozy-house illustration, differentiated per service by an
 * accent motif (sun, tree, heart, path, hands…) and the service colour.
 */
export function HomeArt({ art, hue, hueSoft, className }: { art: ArtKey; hue: string; hueSoft: string; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      role="img"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* soft round backdrop */}
      <circle cx="100" cy="100" r="96" fill={hueSoft} />
      <circle className="bofs-breathe" style={{ transformOrigin: '148px 56px' }} cx="148" cy="56" r="20" fill={hue} opacity="0.35" />

      {/* ground */}
      <path d="M8 148 Q100 118 192 148 V196 H8Z" fill={hue} opacity="0.22" />

      {/* house */}
      <g transform="translate(56 66)">
        <rect x="6" y="34" width="76" height="58" rx="7" fill="#FBF3E6" />
        <path d="M0 38 44 4 88 38Z" fill={hue} />
        <rect
          className="bofs-twinkle"
          style={{ transformOrigin: '44px 62px' }}
          x="30"
          y="50"
          width="28"
          height="26"
          rx="4"
          fill="#FFE1A0"
        />
        <path d="M30 50 H58 M44 50 V76 M30 63 H58" stroke={hue} strokeWidth="2" opacity="0.5" />
        <rect x="6" y="34" width="76" height="58" rx="7" fill="none" stroke={hue} strokeWidth="2" opacity="0.35" />
      </g>

      {/* per-service accent motif */}
      {art === 'studlar' && (
        // a sheltering roof / hands over the home
        <path d="M40 70 Q100 26 160 70" fill="none" stroke={hue} strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      )}
      {art === 'blonduhlid' && (
        // map / compass dot path
        <g stroke={hue} strokeWidth="3" strokeLinecap="round" opacity="0.7" fill="none">
          <path d="M150 150 q-16 -14 -30 -6 q-16 8 -30 -2" strokeDasharray="1 10" />
          <circle cx="150" cy="150" r="4" fill={hue} stroke="none" />
        </g>
      )}
      {art === 'bjargey' && (
        // a growing sprout
        <g transform="translate(150 120)" stroke={hue} strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M6 40 V10" />
          <path d="M6 20 q-12 -4 -16 -16 q14 2 16 12" fill={hue} opacity="0.3" stroke="none" />
          <path d="M6 14 q12 -4 16 -16 q-14 2 -16 12" fill={hue} opacity="0.4" stroke="none" />
        </g>
      )}
      {art === 'laekjarbakki' && (
        // rolling countryside mounds
        <path d="M116 150 q22 -22 44 0" fill={hue} opacity="0.4" />
      )}
      {art === 'barnahus' && (
        // a big heart sheltering the window
        <path
          className="bofs-beat"
          style={{ transformOrigin: '100px 60px' }}
          d="M100 74c-14-11-26-18-26-31 0-8 6-13 13-13 5 0 9 3 13 8 4-5 8-8 13-8 7 0 13 5 13 13 0 13-12 20-26 31z"
          fill={hue}
          opacity="0.85"
        />
      )}
      {art === 'mst' && (
        // three linked dots — family at home
        <g fill={hue} opacity="0.8">
          <circle cx="42" cy="150" r="8" />
          <circle cx="70" cy="158" r="6" />
          <circle cx="96" cy="150" r="7" />
          <path d="M42 150 L70 158 L96 150" stroke={hue} strokeWidth="2.5" fill="none" opacity="0.6" />
        </g>
      )}
      {art === 'sok' && (
        // a gentle sunrise arc
        <g stroke={hue} strokeWidth="3.5" strokeLinecap="round" opacity="0.7" fill="none">
          <path d="M120 156 q22 -30 44 0" />
          <path d="M132 156 l-6 -8 M164 148 l6 -8 M148 140 v-10" />
        </g>
      )}
      {art === 'fostur' && (
        // two hands / clasped care
        <path
          d="M40 150 q10 -16 26 -10 q6 2 10 8 q4 -6 10 -8 q16 -6 26 10"
          fill="none"
          stroke={hue}
          strokeWidth="4.5"
          strokeLinecap="round"
          opacity="0.65"
        />
      )}
    </svg>
  )
}

/* ── Value icons — soft, rounded, friendly ────────────────────────────── */

export function ValueIcon({ name, color, className }: { name: string; color: string; className?: string }) {
  const common = {
    className,
    viewBox: '0 0 48 48',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true as const,
  }
  const st = { stroke: color, strokeWidth: 2.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (name) {
    case 'shield':
      return (
        <svg {...common}>
          <path d="M24 6l14 5v10c0 9-6 15-14 20-8-5-14-11-14-20V11l14-5z" {...st} />
          <path d="M18 24l4 4 8-9" {...st} />
        </svg>
      )
    case 'heart':
      return (
        <svg {...common}>
          <path d="M24 40C13 32 8 26 8 18c0-5 4-9 9-9 3 0 6 2 7 5 1-3 4-5 7-5 5 0 9 4 9 9 0 8-5 14-16 22z" {...st} />
        </svg>
      )
    case 'home':
      return (
        <svg {...common}>
          <path d="M8 22L24 9l16 13" {...st} />
          <path d="M12 20v18h24V20" {...st} />
          <path d="M20 38V28h8v10" {...st} />
        </svg>
      )
    case 'sun':
    default:
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="8" {...st} />
          <path d="M24 6v4M24 38v4M6 24h4M38 24h4M11 11l3 3M34 34l3 3M37 11l-3 3M14 34l-3 3" {...st} />
        </svg>
      )
  }
}

/*
 * The horizon divider family. Three static single-path shapes, one API.
 * Grammar (keep to at most four seams per page so they stay special):
 *   WaveDivider      crossing into or out of a deep / dusk band (water, night)
 *   HillDivider      moving through the landscape between daylight sections
 *   ArchNotchDivider a doorway into an invitation (before a CTA / foster band)
 * Colours must match the section they pour INTO, or a hairline gap can show.
 */

export function WaveDivider({ color, flip = false, className }: { color: string; flip?: boolean; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ display: 'block', transform: flip ? 'scaleY(-1)' : undefined }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 40 Q 360 0 720 40 T 1440 40 V80 H0 Z" fill={color} />
    </svg>
  )
}

export function HillDivider({ color, flip = false, className }: { color: string; flip?: boolean; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ display: 'block', transform: flip ? 'scaleY(-1)' : undefined }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 62 Q 300 20 640 52 T 1160 46 Q 1320 40 1440 58 V90 H0 Z" fill={color} />
    </svg>
  )
}

export function ArchNotchDivider({ color, flip = false, className }: { color: string; flip?: boolean; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ display: 'block', transform: flip ? 'scaleY(-1)' : undefined }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* flat horizon that lifts into one central doorway arch */}
      <path d="M0 66 H620 Q 660 66 686 40 Q 720 6 754 40 Q 780 66 820 66 H1440 V90 H0 Z" fill={color} />
    </svg>
  )
}
