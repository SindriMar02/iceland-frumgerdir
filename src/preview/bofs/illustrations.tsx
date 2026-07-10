/**
 * Öruggt skjól — custom warm illustration system (inline SVG).
 *
 * Everything here is hand-built vector art so it stays crisp, themeable and
 * animatable — and costs zero image credits. Ambient motion (drifting clouds,
 * a breathing sun, twinkling windows) is driven by CSS keyframes defined once
 * in ui.tsx, referenced here by class name.
 */

import type { CSSProperties } from 'react'

/* ── little building blocks ───────────────────────────────────────────── */

function Cloud({ x, y, s = 1, o = 1, delay = 0, dur = 46 }: { x: number; y: number; s?: number; o?: number; delay?: number; dur?: number }) {
  return (
    <g
      className="bofs-drift"
      style={{ transformOrigin: `${x}px ${y}px`, animationDuration: `${dur}s`, animationDelay: `${delay}s`, opacity: o }}
    >
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path
          d="M0 12c0-7 6-12 13-12 4 0 8 2 10 5 2-2 5-3 8-3 7 0 12 5 12 11 0 1 0 2-1 3H-1c-1-2 1-4 1-4z"
          fill="#FFFFFF"
          opacity="0.9"
        />
        <ellipse cx="20" cy="16" rx="30" ry="7" fill="#FFFFFF" opacity="0.55" />
      </g>
    </g>
  )
}

function Bird({ x, y, s = 1, delay = 0 }: { x: number; y: number; s?: number; delay?: number }) {
  return (
    <path
      className="bofs-fly"
      style={{ animationDelay: `${delay}s` }}
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 4C3 0 5 0 7 3 9 0 11 0 14 4"
      fill="none"
      stroke="#7A5A48"
      strokeWidth="1.6"
      strokeLinecap="round"
      opacity="0.5"
    />
  )
}

/** A cozy little house with a glowing window. */
function House({
  x,
  y,
  s = 1,
  wall,
  roof,
  glow = '#FFDf9E',
  twinkle = 0,
}: {
  x: number
  y: number
  s?: number
  wall: string
  roof: string
  glow?: string
  twinkle?: number
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="20" cy="53" rx="26" ry="5" fill="#000" opacity="0.06" />
      <rect x="4" y="22" width="32" height="30" rx="4" fill={wall} />
      <path d="M0 24 20 6 40 24Z" fill={roof} />
      <rect
        className="bofs-twinkle"
        style={{ animationDelay: `${twinkle}s`, transformOrigin: '20px 36px' }}
        x="14"
        y="30"
        width="12"
        height="12"
        rx="2.5"
        fill={glow}
      />
      <rect x="14" y="30" width="12" height="12" rx="2.5" fill="none" stroke={roof} strokeWidth="1.4" opacity="0.5" />
      <line x1="20" y1="30" x2="20" y2="42" stroke={roof} strokeWidth="1" opacity="0.5" />
    </g>
  )
}

function Tree({ x, y, s = 1, delay = 0, c = '#6E9E6E' }: { x: number; y: number; s?: number; delay?: number; c?: string }) {
  return (
    <g className="bofs-sway" style={{ transformOrigin: `${x}px ${y + 40}px`, animationDelay: `${delay}s` }}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x="8" y="26" width="4" height="16" rx="2" fill="#8A6A54" />
        <circle cx="10" cy="18" r="14" fill={c} />
        <circle cx="10" cy="18" r="14" fill="#FFFFFF" opacity="0.08" />
      </g>
    </g>
  )
}

/* ── The hero: a valley that breathes ─────────────────────────────────── */

export function ValleyScene({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 1440 760"
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-label=""
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FBE7CE" />
          <stop offset="0.5" stopColor="#FBEEDC" />
          <stop offset="1" stopColor="#FAF3E7" />
        </linearGradient>
        <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFE7A8" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFE7A8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hillFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CFE0C7" />
          <stop offset="1" stopColor="#C2D8BC" />
        </linearGradient>
        <linearGradient id="hillMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A8C79E" />
          <stop offset="1" stopColor="#9BBE92" />
        </linearGradient>
        <linearGradient id="hillNear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#83AC79" />
          <stop offset="1" stopColor="#749E6C" />
        </linearGradient>
        <linearGradient id="path" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F3E4C9" />
          <stop offset="1" stopColor="#EAD6B4" />
        </linearGradient>
      </defs>

      {/* sky */}
      <rect x="0" y="0" width="1440" height="760" fill="url(#sky)" />

      {/* sun */}
      <g className="bofs-breathe" style={{ transformOrigin: '1120px 200px' }}>
        <circle cx="1120" cy="200" r="150" fill="url(#sunGlow)" />
        <circle cx="1120" cy="200" r="58" fill="#FFD37A" />
        <circle cx="1120" cy="200" r="58" fill="#FFFFFF" opacity="0.12" />
      </g>

      {/* clouds */}
      <Cloud x={180} y={120} s={1.6} o={0.95} dur={54} />
      <Cloud x={620} y={90} s={1.1} o={0.8} delay={-8} dur={64} />
      <Cloud x={980} y={150} s={1.3} o={0.85} delay={-20} dur={72} />

      {/* birds */}
      <Bird x={430} y={180} s={1.2} />
      <Bird x={470} y={200} s={0.9} delay={-2} />
      <Bird x={505} y={172} s={1} delay={-4} />

      {/* far hills */}
      <path d="M0 470 Q 360 380 760 452 T 1440 430 V760 H0Z" fill="url(#hillFar)" />
      {/* mid hills */}
      <path d="M0 560 Q 420 470 900 545 T 1440 520 V760 H0Z" fill="url(#hillMid)" />

      {/* winding path */}
      <path
        d="M690 760 C 700 660 620 640 660 560 C 690 500 740 500 720 452"
        fill="none"
        stroke="url(#path)"
        strokeWidth="46"
        strokeLinecap="round"
        opacity="0.95"
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
      <path d="M0 640 Q 500 560 980 630 T 1440 610 V760 H0Z" fill="url(#hillNear)" />

      {/* houses tucked along the hills */}
      <House x={190} y={470} s={1.15} wall="#F4E6D2" roof="#D9744E" twinkle={0} />
      <House x={1090} y={480} s={1} wall="#F4E6D2" roof="#5E97B8" twinkle={-1.4} />
      <House x={560} y={430} s={0.86} wall="#F6ECDD" roof="#6E9E6E" twinkle={-2.2} />
      <House x={880} y={452} s={0.78} wall="#F6ECDD" roof="#D98895" twinkle={-0.7} glow="#FFE7B0" />

      {/* the "hero" home at the top of the path */}
      <House x={676} y={392} s={1.5} wall="#FBF1E2" roof="#E0A94F" twinkle={-0.3} glow="#FFE39A" />

      {/* foreground trees + bushes */}
      <Tree x={70} y={600} s={1.5} c="#6E9E6E" />
      <Tree x={1300} y={590} s={1.7} c="#6E9E6E" delay={-1.5} />
      <Tree x={1210} y={640} s={1.1} c="#7CA972" delay={-0.8} />
      <ellipse cx="360" cy="720" rx="150" ry="34" fill="#6B9663" opacity="0.55" />
      <ellipse cx="1050" cy="726" rx="180" ry="36" fill="#6B9663" opacity="0.5" />
    </svg>
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

/* ── A soft decorative wave divider ───────────────────────────────────── */

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
