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

import { useId } from 'react'
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

/* ── still sky accents (no looping animation; the scene is a painting) ── */

function SunGlyph({ style }: { style?: CSSProperties }) {
  return (
    <svg className="absolute" style={style} viewBox="0 0 320 320" aria-hidden="true">
      <defs>
        <radialGradient id="sunGlowHtml" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFE7A8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFE7A8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="160" cy="160" r="150" fill="url(#sunGlowHtml)" />
      <circle cx="160" cy="160" r="52" fill="#F6D08C" opacity="0.9" />
    </svg>
  )
}

function MoonGlyph({ style }: { style?: CSSProperties }) {
  return (
    <svg className="absolute" style={style} viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <radialGradient id="moonGlowHtml" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFF0C9" stopOpacity="0.4" />
          <stop offset="1" stopColor="#FFF0C9" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#moonGlowHtml)" />
      <circle cx="60" cy="60" r="24" fill="#F4E4BC" opacity="0.9" />
    </svg>
  )
}

function StarGlyph({ style }: { style?: CSSProperties }) {
  return (
    <svg className="absolute" style={style} viewBox="0 0 12 12" aria-hidden="true">
      <circle cx="6" cy="6" r="1.6" fill="#F4E4BC" opacity="0.8" />
    </svg>
  )
}

/* ── The valley scene: day (hero) or dusk (pre-footer bookend) ─────────── */

type Palette = 'day' | 'dusk'

/*
 * Both palettes are deliberately muted: the valley is a quiet backdrop with
 * the saturation of a wash drawing, not a storybook spread. Warmth comes from
 * the cream sky and the lit windows, never from loud greens.
 */
const PALETTES: Record<Palette, { sky: [string, string, string]; hillFar: [string, string]; hillMid: [string, string]; hillNear: [string, string]; path: [string, string]; bush: string }> = {
  day: {
    sky: ['#F8EAD8', '#FAF0E2', '#FAF3E7'],
    hillFar: ['#D8DECC', '#CFD7C4'],
    hillMid: ['#BBC7AB', '#B0BEA1'],
    hillNear: ['#9CAE90', '#90A385'],
    path: ['#F1E3CB', '#E8D6B9'],
    bush: '#8A9C7E',
  },
  dusk: {
    sky: ['#3C2C20', '#55402E', '#684A36'],
    hillFar: ['#5E6E60', '#525F53'],
    hillMid: ['#4C5F4B', '#435343'],
    hillNear: ['#3C4F3A', '#344632'],
    path: ['#D3BC96', '#C2A87E'],
    bush: '#31452F',
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

      {/* still sky accents: painted once, no looping motion anywhere */}
      {ambient && !dusk && (
        <div className="absolute inset-0 overflow-hidden">
          <SunGlyph style={{ right: '6%', top: '7%', width: 'clamp(150px, 19vw, 280px)' }} />
        </div>
      )}
      {ambient && dusk && (
        <div className="absolute inset-0 overflow-hidden">
          <MoonGlyph style={{ right: '9%', top: '10%', width: 'clamp(80px, 10vw, 120px)' }} />
          <StarGlyph style={{ left: '22%', top: '20%', width: 11 }} />
          <StarGlyph style={{ left: '54%', top: '14%', width: 9 }} />
          <StarGlyph style={{ left: '78%', top: '32%', width: 10 }} />
        </div>
      )}
    </div>
  )
}

/* ── Per-service artwork (a cozy scene tinted to the service hue) ──────── */

export type ArtKey =
  | 'studlar'
  | 'esjan'
  | 'blonduhlid'
  | 'bjargey'
  | 'laekjarbakki'
  | 'barnahus'
  | 'mst'
  | 'sok'
  | 'fostur'

/**
 * One monoline mark per service: a stroke-drawn house on a soft hue disc with
 * a single quiet motif. Iconography, not illustration — nothing fills except
 * the lit window, nothing animates, so it reads institutional while the hue
 * keeps it warm.
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
      {/* soft hue disc: the only field of colour, calm and brandable */}
      <circle cx="100" cy="100" r="96" fill={hueSoft} />

      {/* monoline house */}
      <path d="M56 96 L100 60 L144 96" fill="none" stroke={hue} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M66 92 V130 a10 10 0 0 0 10 10 H124 a10 10 0 0 0 10 -10 V92" fill="none" stroke={hue} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      {/* the lit window: the one warm fill on the mark */}
      <rect x="87" y="102" width="26" height="26" rx="6" fill="#FFE6AE" />
      <rect x="87" y="102" width="26" height="26" rx="6" fill="none" stroke={hue} strokeWidth="3.5" opacity="0.45" />

      {/* per-service motif: one quiet stroke gesture */}
      {art === 'studlar' && <path d="M50 48 Q100 24 150 48" fill="none" stroke={hue} strokeWidth="6" strokeLinecap="round" opacity="0.55" />}
      {/* Esjan: the dotted path of mapping a situation */}
      {art === 'esjan' && (
        <g fill="none" stroke={hue} strokeWidth="6" strokeLinecap="round" opacity="0.8">
          <path d="M118 164 q14 -10 28 -4 q10 4 20 -2" strokeDasharray="0.5 13" />
        </g>
      )}
      {/* Blönduhlíð: a sheltering roof over a smaller roof, home after treatment */}
      {art === 'blonduhlid' && (
        <path d="M116 168 l16 -14 l16 14 M136 168 l14 -12 l14 12" fill="none" stroke={hue} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
      )}
      {art === 'bjargey' && (
        <g fill="none" stroke={hue} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
          <path d="M148 170 V148" />
          <path d="M148 156 q-10 -2 -14 -12" />
          <path d="M148 150 q10 -2 14 -12" />
        </g>
      )}
      {art === 'laekjarbakki' && <path d="M114 166 q14 -14 28 0 q10 10 24 2" fill="none" stroke={hue} strokeWidth="6" strokeLinecap="round" opacity="0.7" />}
      {art === 'barnahus' && (
        <path
          d="M148 172 c-9 -7 -15 -12 -15 -19 0 -5 4 -8 8 -8 3 0 5 2 7 4 2 -2 4 -4 7 -4 4 0 8 3 8 8 0 7 -6 12 -15 19z"
          fill="none"
          stroke={hue}
          strokeWidth="5.5"
          strokeLinejoin="round"
          opacity="0.85"
        />
      )}
      {art === 'mst' && (
        <g opacity="0.85">
          <path d="M124 164 L146 170 L166 162" fill="none" stroke={hue} strokeWidth="4" opacity="0.5" />
          <circle cx="124" cy="164" r="5.5" fill={hue} />
          <circle cx="146" cy="170" r="4.5" fill={hue} />
          <circle cx="166" cy="162" r="5" fill={hue} />
        </g>
      )}
      {art === 'sok' && (
        <g fill="none" stroke={hue} strokeWidth="5.5" strokeLinecap="round" opacity="0.8">
          <path d="M118 170 q22 -26 44 0" />
          <path d="M140 148 v-8" />
        </g>
      )}
      {art === 'fostur' && (
        <path d="M114 168 q10 -14 24 -8 q4 2 6 6 q2 -4 6 -6 q14 -6 24 8" fill="none" stroke={hue} strokeWidth="6" strokeLinecap="round" opacity="0.75" />
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

/* ── seam geometry ────────────────────────────────────────────────────── */

/*
 * The seams used to get their hand-painted wobble from an SVG filter
 * (feTurbulence + feDisplacementMap on the <g>). That filter RASTERISES: the
 * browser renders the filter region to a bitmap in the path's own 1440-unit
 * coordinate space and then scales that bitmap to the element's real size.
 * These seams are stretched across the full viewport with
 * preserveAspectRatio="none", so on a wide or retina screen the bitmap is
 * upscaled and the edge goes visibly blocky. Safari is the worst of the
 * engines here because it caps filter raster size and upscales the result.
 *
 * So the wobble is now baked into the path itself: the curve is sampled,
 * displaced by deterministic value noise, and re-emitted as one smooth cubic
 * spline. Same painterly intent, but pure vector, so it stays crisp at any
 * width in any engine, and there is one less filter for the compositor to run
 * while the page scrolls.
 *
 * Deterministic on purpose. The shapes must be identical on every render and
 * every machine, so this uses a hashed value noise rather than Math.random.
 */

interface Pt {
  x: number
  y: number
}

/** Walk the subset of path commands the seams actually use: M, L, H, Q, T. */
function samplePath(d: string, step = 10): Pt[] {
  const out: Pt[] = []
  let cur: Pt = { x: 0, y: 0 }
  let lastCtrl: Pt | null = null
  const quad = (p0: Pt, c: Pt, p1: Pt) => {
    const n = Math.max(2, Math.round((Math.abs(p1.x - p0.x) + Math.abs(p1.y - p0.y)) / step))
    for (let i = 1; i <= n; i++) {
      const t = i / n
      const u = 1 - t
      out.push({
        x: u * u * p0.x + 2 * u * t * c.x + t * t * p1.x,
        y: u * u * p0.y + 2 * u * t * c.y + t * t * p1.y,
      })
    }
  }
  for (const tk of d.match(/[MLQTH][^MLQTHVZ]*/gi) ?? []) {
    const cmd = tk[0].toUpperCase()
    const a = (tk.slice(1).match(/-?\d*\.?\d+/g) ?? []).map(Number)
    if (cmd === 'M') {
      cur = { x: a[0], y: a[1] }
      out.push(cur)
      lastCtrl = null
    } else if (cmd === 'L') {
      cur = { x: a[0], y: a[1] }
      out.push(cur)
      lastCtrl = null
    } else if (cmd === 'H') {
      // sampled rather than jumped, so the noise also rides along flat runs
      const n = Math.max(2, Math.round(Math.abs(a[0] - cur.x) / step))
      for (let i = 1; i <= n; i++) out.push({ x: cur.x + ((a[0] - cur.x) * i) / n, y: cur.y })
      cur = { x: a[0], y: cur.y }
      lastCtrl = null
    } else if (cmd === 'Q') {
      const c: Pt = { x: a[0], y: a[1] }
      const p: Pt = { x: a[2], y: a[3] }
      quad(cur, c, p)
      cur = p
      lastCtrl = c
    } else if (cmd === 'T') {
      const c: Pt = lastCtrl ? { x: 2 * cur.x - lastCtrl.x, y: 2 * cur.y - lastCtrl.y } : cur
      const p = { x: a[0], y: a[1] }
      quad(cur, c, p)
      cur = p
      lastCtrl = c
    }
  }
  return out
}

const hash = (i: number, seed: number) => {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453
  return (x - Math.floor(x)) * 2 - 1
}

/** Smoothed value noise, so the displacement drifts rather than jitters. */
function valueNoise(t: number, seed: number, wavelength: number) {
  const p = t / wavelength
  const i = Math.floor(p)
  const f = p - i
  const s = f * f * (3 - 2 * f)
  return hash(i, seed) * (1 - s) + hash(i + 1, seed) * s
}

/*
 * Two octaves, matching the old filter's baseFrequency of 0.004 and 0.011:
 * a long slow drift with a finer tremor on top. Amplitude ~2.6 reproduces the
 * old displacement scale of 5 (which displaced by +/- half its value).
 */
function wobble(pts: Pt[], seed: number, amp = 2.6): Pt[] {
  return pts.map((p) => ({
    x: p.x,
    y: p.y + amp * (valueNoise(p.x, seed, 250) * 0.72 + valueNoise(p.x, seed + 31, 90) * 0.28),
  }))
}

const r1 = (n: number) => Math.round(n * 10) / 10

/** Catmull-Rom through the points, emitted as cubics so the curve stays soft. */
function toPath(pts: Pt[]): string {
  if (pts.length < 2) return ''
  let d = `M${r1(pts[0].x)} ${r1(pts[0].y)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? pts[i + 1]
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 }
    d += ` C${r1(c1.x)} ${r1(c1.y)} ${r1(c2.x)} ${r1(c2.y)} ${r1(p2.x)} ${r1(p2.y)}`
  }
  return d
}

/*
 * Computed once per shape and cached. The pooling stroke rides a SEPARATELY
 * seeded wobble, so the visible band thickens and thins where the two curves
 * drift apart. That variation is what the displacement filter used to give
 * for free, and it is the thing that stops the seam reading as a printed rule.
 */
const seamCache = new Map<string, { fill: string; edge: string }>()

function seamGeometry(edgePath: string, bottom: number, seed: number) {
  const key = `${edgePath}|${bottom}|${seed}`
  const hit = seamCache.get(key)
  if (hit) return hit
  const base = samplePath(edgePath)
  const fillPts = wobble(base, seed)
  const edgePts = wobble(base, seed + 17, 3.1)
  const first = fillPts[0]
  const last = fillPts[fillPts.length - 1]
  const made = {
    fill: `${toPath(fillPts)} L${r1(last.x)} ${bottom} L${r1(first.x)} ${bottom} Z`,
    edge: toPath(edgePts),
  }
  seamCache.set(key, made)
  return made
}

/*
 * Each seam is drawn twice: the fill that pours into the next section, and an
 * edge-only stroke along the same curve. The stroke is the pigment pooling
 * that dries darker wherever one wash met another, which is the detail that
 * stops a section boundary reading as a vector curve. Both sit in one <g> so
 * the shared turbulence filter wobbles them identically; stroking the fill
 * path directly would draw the closing segment down the sides too.
 */
const SEAM_POOL = 'rgba(58,44,34,.11)'

function Seam({
  viewBox,
  edgePath,
  bottom,
  seed,
  color,
  flip,
  className,
}: {
  viewBox: string
  edgePath: string
  /** y the fill drops to, past the bottom of the viewBox so it never gaps */
  bottom: number
  seed: number
  color: string
  flip?: boolean
  className?: string
}) {
  const { fill, edge } = seamGeometry(edgePath, bottom, seed)
  /*
   * The pooling stroke is clipped to the fill shape. Displacing a 2.5px line
   * tears it into fragments and flings some of them clear of the edge, which
   * showed up as dark dashes floating on the cream above the wave. Clipped to
   * the fill, any tearing stays on the dark side where it reads as pigment
   * settling, which is what it is meant to look like anyway.
   *
   * useId keeps the clip id unique when several seams share a page; the colons
   * React puts in the id are stripped because they are awkward in url().
   */
  const clipId = `bofs-seamclip-${useId().replace(/:/g, '')}`
  return (
    <svg
      className={className}
      viewBox={viewBox}
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ display: 'block', transform: flip ? 'scaleY(-1)' : undefined }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={fill} />
        </clipPath>
      </defs>
      {/* No filter. The wobble lives in the path data, so this stays vector. */}
      <g>
        <path d={fill} fill={color} />
        <path d={edge} fill="none" stroke={SEAM_POOL} strokeWidth="9" clipPath={`url(#${clipId})`} />
      </g>
    </svg>
  )
}

export function WaveDivider({ color, flip = false, className }: { color: string; flip?: boolean; className?: string }) {
  return (
    <Seam
      viewBox="0 0 1440 80"
      edgePath="M0 40 Q 360 0 720 40 T 1440 40"
      bottom={96}
      seed={11}
      color={color}
      flip={flip}
      className={className}
    />
  )
}

export function HillDivider({ color, flip = false, className }: { color: string; flip?: boolean; className?: string }) {
  return (
    <Seam
      viewBox="0 0 1440 90"
      edgePath="M0 62 Q 300 20 640 52 T 1160 46 Q 1320 40 1440 58"
      bottom={106}
      seed={23}
      color={color}
      flip={flip}
      className={className}
    />
  )
}

export function ArchNotchDivider({ color, flip = false, className }: { color: string; flip?: boolean; className?: string }) {
  return (
    <Seam
      viewBox="0 0 1440 90"
      /* flat horizon that lifts into one central doorway arch */
      edgePath="M0 66 H620 Q 660 66 686 40 Q 720 6 754 40 Q 780 66 820 66 H1440"
      bottom={106}
      seed={37}
      color={color}
      flip={flip}
      className={className}
    />
  )
}
