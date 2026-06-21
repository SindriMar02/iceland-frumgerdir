import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Check, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import {
  CLAY_TEXTURE_ID,
  LEDGER,
  PALETTE,
  PIECES,
  STATUS_LABEL,
  STEPS,
  STUDIO,
  TERMS,
  photo,
} from './data'
import type { Availability, Piece, VesselShape } from './data'

const company = getPreviewCompany('kogga')

const { ground, ground2, clay, porcelain, glaze, oxblood, ink } = PALETTE

/* ── Motion language: THE INLAY ASSEMBLING ───────────────────────────
   Kogga's signature is porcelain fragments INLAID into stoneware. The page
   moves the way a piece is made: small tiles/shards slide in from slight
   offsets and LOCK into place. Nothing slides far; everything settles into a
   grid, quiet and curatorial. Slow ease-out, ~30-50ms stagger. Under
   reduced-motion the fragments are simply already in place.

   HARD RULE: above-the-fold content never gates opacity on a running rAF
   animation (a backgrounded tab freezes rAF and the hero would vanish). The
   hero reveals start opaque; the hero tiles start ~0.9 so a stalled rAF still
   leaves a legible, assembled vessel. ── */

const SETTLE = [0.16, 0.84, 0.24, 1] as const

/** A fragment that drifts in from a slight offset and locks into the grid. */
function Inlay({
  children,
  delay = 0,
  from = { x: -10, y: 8 },
  className,
  onMount = false,
}: {
  children: ReactNode
  delay?: number
  from?: { x: number; y: number }
  className?: string
  /** Above-the-fold content animates on mount so it never waits on scroll. */
  onMount?: boolean
}) {
  const reduce = useReducedMotion()
  const settled = { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }
  // Above-the-fold (onMount) content must never gate its opacity on a running
  // animation — if rAF stalls (background tab) the hero would vanish. So onMount
  // starts fully opaque with only a tiny rise; below-the-fold keeps the reveal.
  const start =
    reduce || onMount
      ? { opacity: 1, x: 0, y: reduce ? 0 : onMount ? 10 : 0, filter: 'blur(0px)' }
      : { opacity: 0, x: from.x, y: from.y, filter: 'blur(2px)' }
  const trigger = onMount
    ? { animate: settled }
    : { whileInView: settled, viewport: { once: true, margin: '-10% 0px -8% 0px' } }
  return (
    <motion.div
      className={className}
      initial={start}
      {...trigger}
      transition={{ duration: 0.75, ease: SETTLE, delay }}
    >
      {children}
    </motion.div>
  )
}

/** A hairline rule that draws across — fine museum line. */
function Rule({ color = ink, delay = 0 }: { color?: string; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <span className="relative block h-px w-full overflow-hidden" aria-hidden="true">
      <span className="absolute inset-0 opacity-20" style={{ background: color }} />
      <motion.span
        className="absolute inset-0"
        style={{ background: color, transformOrigin: 'left' }}
        initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: SETTLE, delay }}
      />
    </span>
  )
}

/* ── Bespoke SVG: a vessel silhouette built from inlaid porcelain shards.
   No stock photos of ceramics (they never match her work). Each card is a
   drawn vessel whose surface carries a porcelain "patchwork" of fragments. ── */

function vesselPath(shape: VesselShape): string {
  switch (shape) {
    case 'bowl':
      return 'M22 64 Q22 96 80 96 Q138 96 138 64 Q138 60 132 58 L28 58 Q22 60 22 64 Z'
    case 'tall':
      return 'M58 30 Q56 22 80 22 Q104 22 102 30 L110 96 Q110 110 80 110 Q50 110 50 96 Z'
    case 'egg':
      return 'M80 18 Q126 40 122 86 Q118 116 80 116 Q42 116 38 86 Q34 40 80 18 Z'
    case 'boat':
      return 'M20 62 Q40 96 80 96 Q120 96 140 62 Q138 58 130 58 L30 58 Q22 58 20 62 Z'
    case 'sphere':
      return 'M80 22 Q138 22 138 70 Q138 118 80 118 Q22 118 22 70 Q22 22 80 22 Z'
    case 'mug':
      return 'M46 36 L114 36 L110 100 Q110 110 80 110 Q50 110 50 100 Z'
    default:
      return ''
  }
}

/** Deterministic little porcelain shards laid into the vessel surface. */
const SHARDS: Array<{ x: number; y: number; r: number; s: number }> = [
  { x: 58, y: 52, r: -18, s: 13 },
  { x: 86, y: 47, r: 12, s: 10 },
  { x: 72, y: 66, r: 26, s: 11 },
  { x: 100, y: 60, r: -8, s: 9 },
  { x: 64, y: 78, r: 8, s: 12 },
  { x: 92, y: 80, r: -22, s: 10 },
  { x: 78, y: 56, r: 40, s: 8 },
  { x: 50, y: 64, r: -34, s: 9 },
]

function Vessel({ piece, reduce }: { piece: Piece; reduce: boolean }) {
  // useId may contain ':' which is invalid inside an SVG url(#...) reference,
  // so sanitise it to a token that is safe in both id and url().
  const uid = `v${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const path = vesselPath(piece.shape)
  return (
    <svg
      viewBox="0 0 160 130"
      className="h-full w-full"
      role="img"
      aria-label={`Skissa af verkinu ${piece.title} úr seríunni ${piece.series}`}
    >
      <defs>
        <clipPath id={uid}>
          <path d={path} />
        </clipPath>
        <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={piece.glaze} stopOpacity="0.96" />
          <stop offset="100%" stopColor={piece.glaze} stopOpacity="0.74" />
        </linearGradient>
        {/* raking gallery light across the body */}
        <linearGradient id={`${uid}-l`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* vessel body */}
      <path d={path} fill={`url(#${uid}-g)`} />
      {/* inlaid porcelain shards, clipped to the body */}
      <g clipPath={`url(#${uid})`}>
        {SHARDS.map((sh, i) => (
          // Rotation MUST stay an SVG presentation attribute: on SVG the CSS
          // `transform` property and the `transform` attribute are the same
          // thing, so animating scale/x/y via Framer's style.transform would
          // overwrite the rotate and the shards would lose their angle. So the
          // lock-in reads purely through the staggered opacity fade.
          <motion.rect
            key={i}
            x={sh.x}
            y={sh.y}
            width={sh.s}
            height={sh.s}
            rx={1.5}
            fill={piece.inlay}
            transform={`rotate(${sh.r} ${sh.x + sh.s / 2} ${sh.y + sh.s / 2})`}
            initial={reduce ? { opacity: 0.92 } : { opacity: 0 }}
            whileInView={{ opacity: 0.92 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: SETTLE, delay: 0.12 + i * 0.05 }}
          />
        ))}
        {/* raking light wash, clipped to the body */}
        <path d={path} fill={`url(#${uid}-l)`} />
      </g>
      {/* rim / contour line locking the inlay in */}
      <path d={path} fill="none" stroke={ink} strokeOpacity="0.14" strokeWidth="1" />
    </svg>
  )
}

/* ── Hero motif: a vessel silhouette ASSEMBLED from a grid of inlay tiles.
   This is the signature "inlay assembling" moment. A coarse grid of porcelain
   fragments slides into place and LOCKS to reveal a vessel; reduced-motion
   shows it already assembled. Tiles start at ~0.9 opacity so a stalled rAF
   never empties the hero. ── */

const HERO_COLS = 11
const HERO_ROWS = 9
const HERO_CELL = 26
const HERO_W = HERO_COLS * HERO_CELL
const HERO_H = HERO_ROWS * HERO_CELL

// A chalice/vessel mask the tiles paint within.
const HERO_VESSEL =
  'M118 26 Q108 22 110 44 Q112 70 96 92 L96 188 Q96 204 143 204 Q190 204 190 188 L190 92 Q174 70 176 44 Q178 22 168 26 Z'

function HeroInlay({ reduce }: { reduce: boolean }) {
  const maskId = `h${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const tiles: Array<{ col: number; row: number }> = []
  for (let r = 0; r < HERO_ROWS; r++) {
    for (let c = 0; c < HERO_COLS; c++) tiles.push({ col: c, row: r })
  }
  // assemble outward from the vessel centre so it reads as "coming together"
  const cx = (HERO_COLS - 1) / 2
  const cy = (HERO_ROWS - 1) / 2
  return (
    <svg
      viewBox={`0 0 ${HERO_W} ${HERO_H}`}
      className="h-full w-full overflow-visible"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <clipPath id={maskId}>
          <path d={HERO_VESSEL} />
        </clipPath>
        <linearGradient id={`${maskId}-sheen`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* soft plinth shadow */}
      <ellipse cx={HERO_W / 2} cy={HERO_H - 12} rx={94} ry={12} fill={ink} opacity={0.08} />
      {/* the plinth slab */}
      <rect
        x={HERO_W / 2 - 86}
        y={HERO_H - 20}
        width={172}
        height={12}
        rx={2}
        fill={porcelain}
        opacity={0.9}
      />
      <g clipPath={`url(#${maskId})`}>
        {tiles.map(({ col, row }, i) => {
          const x = col * HERO_CELL
          const y = row * HERO_CELL
          // alternate porcelain / clay / glaze / oxblood for a patchwork feel
          const pick = (col * 2 + row) % 7
          const fill =
            pick === 0 ? oxblood : pick === 1 || pick === 4 ? glaze : pick === 2 ? clay : porcelain
          const dist = Math.hypot(col - cx, row - cy)
          const fromX = (col < cx ? -1 : 1) * (6 + (i % 4) * 3)
          const fromY = (row < cy ? -1 : 1) * (5 + (i % 3) * 3)
          return (
            <motion.rect
              key={i}
              x={x + 1}
              y={y + 1}
              width={HERO_CELL - 2}
              height={HERO_CELL - 2}
              rx={2}
              fill={fill}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              initial={
                reduce ? { opacity: 0.95, x: 0, y: 0, scale: 1 } : { opacity: 0.9, x: fromX, y: fromY, scale: 0.84 }
              }
              animate={{ opacity: 0.96, x: 0, y: 0, scale: 1 }}
              transition={{
                duration: 0.62,
                ease: SETTLE,
                delay: reduce ? 0 : 0.18 + dist * 0.07,
              }}
            />
          )
        })}
        {/* hairline grout grid inside the vessel — reads as inlaid tiles */}
        <g stroke={ground} strokeOpacity={0.5} strokeWidth={1}>
          {Array.from({ length: HERO_COLS - 1 }).map((_, c) => (
            <line key={`c${c}`} x1={(c + 1) * HERO_CELL} y1={0} x2={(c + 1) * HERO_CELL} y2={HERO_H} />
          ))}
          {Array.from({ length: HERO_ROWS - 1 }).map((_, r) => (
            <line key={`r${r}`} x1={0} y1={(r + 1) * HERO_CELL} x2={HERO_W} y2={(r + 1) * HERO_CELL} />
          ))}
        </g>
        {/* glaze sheen */}
        <path d={HERO_VESSEL} fill={`url(#${maskId}-sheen)`} />
      </g>
      {/* drawn vessel outline locking the fragments together */}
      <motion.path
        d={HERO_VESSEL}
        fill="none"
        stroke={ink}
        strokeOpacity={0.38}
        strokeWidth={1.5}
        initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: SETTLE, delay: reduce ? 0 : 1.0 }}
      />
    </svg>
  )
}

/* ── Availability chip (museum label) ──────────────────────────────── */
function StatusChip({ status }: { status: Availability }) {
  const tone =
    status === 'available'
      ? { dot: glaze, fg: ink }
      : status === 'reserved'
        ? { dot: oxblood, fg: ink }
        : { dot: clay, fg: ink }
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] uppercase"
      style={{ background: `${ink}0d`, color: tone.fg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: tone.dot }} aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  )
}

/* ── Plinth gallery card — the signature interaction ─────────────────
   Each piece sits on a plinth. On hover / focus / tap it LIFTS (translateY +
   shadow) and reveals the glaze story. Price, dimensions, glaze name and
   availability are ALWAYS visible at rest so the grid never hides the facts.
   Keyboard-focusable; story is shown on focus as well as hover and tap. ── */

function PlinthCard({ piece, index, reduce }: { piece: Piece; index: number; reduce: boolean }) {
  const cardRef = useRef<HTMLButtonElement>(null)
  const storyId = useId()
  // tap-to-reveal on touch (where there is no hover); toggles the story open.
  const [open, setOpen] = useState(false)

  // pointer-parallax tilt (gated by reduced-motion + mouse-only)
  const onMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (reduce || e.pointerType !== 'mouse') return
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    el.style.setProperty('--rx', `${(-py * 4).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(px * 5).toFixed(2)}deg`)
  }
  const reset = () => {
    const el = cardRef.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <Inlay
      delay={(index % 3) * 0.05}
      from={{ x: index % 2 === 0 ? -8 : 8, y: 10 }}
      className="[perspective:1200px]"
    >
      <button
        ref={cardRef}
        type="button"
        aria-describedby={storyId}
        aria-expanded={open}
        onPointerMove={onMove}
        onPointerLeave={reset}
        onBlur={reset}
        onClick={() => setOpen((v) => !v)}
        data-open={open ? 'true' : undefined}
        className="group/card relative block w-full rounded-[4px] text-left outline-none [transform-style:preserve-3d] focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-[var(--accent)]"
        style={{
          transform: 'rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))',
          transition: 'transform 0.3s ease-out',
        }}
      >
        {/* the gallery niche: plinth + piece */}
        <div
          className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[4px] border border-[#221d191f] px-6 pt-7 pb-16 transition-[transform,box-shadow,border-color] duration-500 ease-out group-hover/card:-translate-y-2 group-hover/card:border-[color:var(--accent)] group-hover/card:shadow-[0_34px_64px_-32px_rgba(34,29,25,0.5)] group-focus-visible/card:-translate-y-2 group-focus-visible/card:border-[color:var(--accent)] group-focus-visible/card:shadow-[0_34px_64px_-32px_rgba(34,29,25,0.5)] group-data-[open=true]/card:-translate-y-2 group-data-[open=true]/card:shadow-[0_34px_64px_-32px_rgba(34,29,25,0.5)]"
          style={{ background: `linear-gradient(180deg, ${ground} 0%, ${ground2} 100%)` }}
        >
          {/* corner index + availability, museum label feel */}
          <span
            className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.2em]"
            style={{ color: `${ink}80` }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="absolute top-2.5 right-2.5">
            <StatusChip status={piece.status} />
          </span>

          {/* the vessel on its plinth — lifts a touch above the slab on reveal */}
          <div className="relative h-[62%] w-[76%] transition-transform duration-500 ease-out [transform:translateZ(30px)] group-hover/card:[transform:translateZ(38px)_translateY(-2px)] group-focus-visible/card:[transform:translateZ(38px)_translateY(-2px)]">
            <Vessel piece={piece} reduce={reduce} />
          </div>

          {/* plinth slab */}
          <div
            className="absolute inset-x-7 bottom-0 h-12 rounded-t-[2px]"
            style={{ background: `linear-gradient(180deg, ${porcelain}, ${clay}cc)` }}
            aria-hidden="true"
          />
          {/* thin plinth top edge to catch the light */}
          <div
            className="absolute inset-x-7 bottom-12 h-px"
            style={{ background: `${ground}` }}
            aria-hidden="true"
          />
          {/* soft contact shadow under the piece */}
          <div
            className="absolute bottom-[44px] left-1/2 h-3 w-[46%] -translate-x-1/2 rounded-[50%] blur-md transition-all duration-500 group-hover/card:w-[52%] group-hover/card:opacity-70 group-focus-visible/card:w-[52%]"
            style={{ background: `${ink}33` }}
            aria-hidden="true"
          />
        </div>

        {/* label block: title + price + glaze always visible (museum caption) */}
        <div className="mt-4">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-garamond text-[1.35rem] leading-tight tracking-[0.01em]" style={{ color: ink }}>
              {piece.title}
            </h3>
            <span className="shrink-0 font-mono text-sm" style={{ color: ink }}>
              {piece.price}
            </span>
          </div>
          <div className="mt-1 flex items-baseline justify-between gap-3">
            <p className="font-mono text-[11px] tracking-[0.14em] uppercase" style={{ color: oxblood }}>
              {piece.series}
            </p>
            <p className="shrink-0 font-mono text-[11px] tracking-wide" style={{ color: `${ink}99` }}>
              {piece.glazeName}
            </p>
          </div>
          <p className="mt-1.5 font-mono text-[11px] tracking-wide" style={{ color: `${ink}88` }}>
            {piece.dimensions}
          </p>
        </div>

        {/* reveal: the glaze story (visible on hover, focus AND tap) */}
        <div
          id={storyId}
          className="grid grid-rows-[0fr] overflow-hidden opacity-0 transition-[grid-template-rows,opacity,margin] duration-500 ease-out group-hover/card:mt-3 group-hover/card:grid-rows-[1fr] group-hover/card:opacity-100 group-focus-visible/card:mt-3 group-focus-visible/card:grid-rows-[1fr] group-focus-visible/card:opacity-100 group-data-[open=true]/card:mt-3 group-data-[open=true]/card:grid-rows-[1fr] group-data-[open=true]/card:opacity-100"
        >
          <div className="min-h-0">
            <span className="block h-px w-10" style={{ background: `${oxblood}` }} aria-hidden="true" />
            <p className="mt-2.5 max-w-sm text-[0.9rem] leading-relaxed" style={{ color: `${ink}cc` }}>
              {piece.story}
            </p>
            <p className="mt-2.5 font-mono text-[10px] tracking-[0.12em] uppercase" style={{ color: `${ink}80` }}>
              {piece.fired}
            </p>
          </div>
        </div>
      </button>
    </Inlay>
  )
}

/* ── Section heading: small kicker + large EB Garamond line ────────── */
function SectionHead({
  kicker,
  title,
  className,
}: {
  kicker: string
  title: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <Inlay>
        <p className="flex items-center gap-3 font-mono text-xs tracking-[0.28em] uppercase" style={{ color: oxblood }}>
          <span className="h-1.5 w-1.5 rounded-[1px]" style={{ background: oxblood }} aria-hidden="true" />
          {kicker}
        </p>
      </Inlay>
      <Inlay delay={0.06}>
        <h2
          className="mt-4 font-garamond text-[clamp(2.1rem,5.5vw,3.75rem)] leading-[1.04] tracking-[-0.01em]"
          style={{ color: ink }}
        >
          {title}
        </h2>
      </Inlay>
    </div>
  )
}

export default function Page() {
  const reduce = useReducedMotion() ?? false
  const [sent, setSent] = useState(false)
  const emailId = useId()

  useEffect(() => {
    document.title = 'Kogga — keramík og galerí'
  }, [])

  const linkBase =
    'inline-flex min-h-[48px] items-center gap-2 rounded-full px-7 text-sm font-medium tracking-wide transition-[transform,background-color,color] duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2'

  return (
    <div
      lang="is"
      className="min-h-screen font-hanken antialiased"
      // --accent powers every focus-visible ring + nav hover; it was previously
      // undefined (rings rendered colourless). Oxblood is the page accent.
      style={{ background: ground, color: ink, '--accent': oxblood } as CSSProperties}
    >
      <PreviewChrome company={company} />

      {/* selection colour + solid-button helpers tied to the oxblood accent */}
      <style>{`
        ::selection { background: ${oxblood}; color: ${ground}; }
        .kogga-link-solid { background: ${oxblood}; color: ${ground}; }
        .kogga-link-solid:hover { background: ${ink}; }
      `}</style>

      {/* ── top bar ─────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md"
        style={{ background: `${ground}d9`, borderColor: `${ink}14` }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <a
            href="#topp"
            className="font-garamond text-xl tracking-tight transition-colors hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
            style={{ color: ink }}
          >
            Kogga
          </a>
          <nav aria-label="Aðalvalmynd" className="hidden items-center gap-8 md:flex">
            {[
              ['#verkin', 'Verkin'],
              ['#innlegg', 'Innlegg'],
              ['#heimsokn', 'Heimsókn'],
              ['#kaup', 'Kaup'],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="text-sm tracking-wide transition-colors hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
                style={{ color: `${ink}cc` }}
              >
                {label}
              </a>
            ))}
          </nav>
          <a
            href="#heimsokn"
            className="hidden rounded-full px-5 py-2.5 text-sm font-medium transition-colors hover:border-[color:var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] md:inline-flex md:items-center"
            style={{ border: `1px solid ${ink}33`, color: ink }}
          >
            Heimsækja
          </a>
        </div>
      </header>

      <main id="topp">
        {/* ── Hero ───────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-5 pt-14 pb-20 md:px-8 md:pt-24 md:pb-28">
          {/* faint patchwork grid ground */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.045]"
            style={{
              backgroundImage: `linear-gradient(${ink} 1px, transparent 1px), linear-gradient(90deg, ${ink} 1px, transparent 1px)`,
              backgroundSize: '52px 52px',
            }}
          />
          {/* soft glaze bloom behind the motif */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-[-10%] hidden h-[460px] w-[460px] -translate-y-1/2 rounded-full opacity-25 blur-3xl md:block"
            style={{ background: `radial-gradient(circle, ${glaze}, transparent 70%)` }}
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.05fr_0.95fr]">
            <div>
              <Inlay onMount>
                <p className="flex items-center gap-3 font-mono text-xs tracking-[0.26em] uppercase" style={{ color: oxblood }}>
                  <span className="h-1.5 w-1.5 rounded-[1px]" style={{ background: oxblood }} aria-hidden="true" />
                  Keramík og galerí · {company.established}
                </p>
              </Inlay>
              <Inlay delay={0.07} onMount>
                <h1
                  className="mt-6 font-garamond text-[clamp(2.9rem,8.4vw,5.75rem)] leading-[1.0] tracking-[-0.015em]"
                  style={{ color: ink }}
                >
                  Kogga
                  <span className="mt-1 block italic leading-[1.04]" style={{ color: glaze }}>
                    brot fyrir brot
                  </span>
                </h1>
              </Inlay>
              <Inlay delay={0.14} onMount>
                <p className="mt-7 max-w-md text-lg leading-relaxed" style={{ color: `${ink}cc` }}>
                  Í fjörutíu ár hefur Kolbrún Björgólfsdóttir lagt postulín inn í
                  steinleir, brot fyrir brot, eins og bútasaum úr fornum leirum og
                  íslensku landslagi. Hvert verk er sett saman úr mörgum.
                </p>
              </Inlay>
              <Inlay delay={0.2} onMount>
                <div className="mt-9 flex flex-wrap gap-3">
                  <a href="#verkin" className={`kogga-link-solid ${linkBase} focus-visible:outline-[var(--accent)]`}>
                    Skoða verkin
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a
                    href="#heimsokn"
                    className={`${linkBase} hover:border-[color:var(--accent)] hover:text-[var(--accent)] focus-visible:outline-[var(--accent)]`}
                    style={{ border: `1px solid ${ink}33`, color: ink }}
                  >
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    Heimsækja vinnustofuna
                  </a>
                </div>
              </Inlay>
            </div>

            {/* the assembling inlay motif */}
            <div className="relative mx-auto aspect-[10/9] w-full max-w-md">
              <HeroInlay reduce={reduce} />
            </div>
          </div>

          {/* curatorial ledger strip — quiet, verifiable facts */}
          <Inlay delay={0.1}>
            <div className="relative mx-auto mt-16 max-w-6xl">
              <Rule color={ink} />
              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4">
                {LEDGER.map((item) => (
                  <div key={item.k}>
                    <dt className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: oxblood }}>
                      {item.k}
                    </dt>
                    <dd className="mt-1.5 text-sm leading-snug" style={{ color: `${ink}d9` }}>
                      {item.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Inlay>
        </section>

        {/* ── The work ───────────────────────────────────────── */}
        <section id="verkin" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHead
                kicker={`Verkin · ${PIECES.length} stykki`}
                title={
                  <>
                    Hvert stykki <span className="italic" style={{ color: glaze }}>á sínum stalli</span>
                  </>
                }
              />
              <Inlay delay={0.1}>
                <p className="max-w-xs text-sm leading-relaxed md:text-right" style={{ color: `${ink}aa` }}>
                  Smelltu eða snertu verk til að lesa söguna á bak við glerunginn. Verð, stærð
                  og staða eru sýnishorn.
                </p>
              </Inlay>
            </div>

            <div className="mt-12">
              <Rule color={ink} />
            </div>

            <div className="mt-12 grid grid-cols-1 gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {PIECES.map((piece, i) => (
                <PlinthCard key={piece.id} piece={piece} index={i} reduce={reduce} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Innlegg: technique & artist story ───────────────── */}
        <section
          id="innlegg"
          className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28"
          style={{ background: glaze, color: ground }}
        >
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-start">
              <div>
                <Inlay>
                  <p className="flex items-center gap-3 font-mono text-xs tracking-[0.28em] uppercase" style={{ color: `${ground}cc` }}>
                    <span className="h-1.5 w-1.5 rounded-[1px]" style={{ background: `${ground}cc` }} aria-hidden="true" />
                    Innlegg · tæknin
                  </p>
                </Inlay>
                <Inlay delay={0.06}>
                  <h2 className="mt-4 font-garamond text-[clamp(2.1rem,5.5vw,3.5rem)] leading-[1.05] tracking-[-0.01em]">
                    Postulín lagt inn í steinleir
                  </h2>
                </Inlay>

                {/* atmospheric clay texture — mood only, not "her piece" */}
                <Inlay delay={0.12}>
                  <figure className="mt-8 overflow-hidden rounded-[4px]" style={{ border: `1px solid ${ground}22` }}>
                    <Img
                      src={photo(CLAY_TEXTURE_ID, 900)}
                      alt="Hrá leiráferð, notuð sem stemning"
                      className="aspect-[16/10] w-full object-cover opacity-90"
                      fallbackClassName="bg-gradient-to-br from-[#b9a48c] to-[#26433f]"
                    />
                    <figcaption className="px-4 py-2.5 text-[11px] leading-snug tracking-wide" style={{ color: `${ground}a6` }}>
                      Áferð af leir og steinleir. Stemningsmynd, ekki verk listakonunnar.
                    </figcaption>
                  </figure>
                </Inlay>
              </div>

              <div className="md:pt-2">
                <Inlay delay={0.08}>
                  <p className="text-lg leading-relaxed" style={{ color: `${ground}f0` }}>
                    Kolbrún Björgólfsdóttir, fædd 1952, nam við Danska hönnunarskólann í
                    Kaupmannahöfn um miðjan áttunda áratuginn. Síðan hefur hún þróað eigin
                    innlagstækni: litað postulín er skorið í brot og lagt inn í steinleirinn,
                    flís fyrir flís, þar til yfirborðið verður að bútasaum.
                  </p>
                </Inlay>
                <Inlay delay={0.14}>
                  <p className="mt-5 leading-relaxed" style={{ color: `${ground}cc` }}>
                    Mynstrin sækja í forn leirbrot og íslenskt landslag, þúfur, jökla og fjörur.
                    Kogga er ein fárra sem haldið hefur úti opinni vinnustofu og galleríi til
                    langs tíma, undir sama þaki í rauða húsinu við Vesturgötu.
                  </p>
                </Inlay>
                <Inlay delay={0.2}>
                  <blockquote
                    className="mt-8 border-l-2 pl-5 font-garamond text-[1.6rem] leading-snug italic"
                    style={{ borderColor: oxblood, color: ground }}
                  >
                    „Klippimyndatækni og næmt skreytiskyn.”
                    <footer className="mt-3 font-hanken text-sm not-italic" style={{ color: `${ground}b3` }}>
                      Aðalsteinn Ingólfsson, listfræðingur
                    </footer>
                  </blockquote>
                </Inlay>

                {/* the three steps */}
                <div className="mt-10 grid gap-px overflow-hidden rounded-[4px] sm:grid-cols-3" style={{ background: `${ground}26` }}>
                  {STEPS.map((step, i) => (
                    <Inlay key={step.n} delay={0.24 + i * 0.06}>
                      <div className="h-full p-5" style={{ background: glaze }}>
                        <span className="font-mono text-sm" style={{ color: `${ground}99` }}>
                          {step.n}
                        </span>
                        <h3 className="mt-2 font-garamond text-lg" style={{ color: ground }}>
                          {step.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed" style={{ color: `${ground}c4` }}>
                          {step.body}
                        </p>
                      </div>
                    </Inlay>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Visit the studio ───────────────────────────────── */}
        <section id="heimsokn" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <SectionHead
              kicker="Heimsókn"
              title={
                <>
                  Rauða húsið við <span className="italic" style={{ color: oxblood }}>Vesturgötu</span>
                </>
              }
            />

            <div className="mt-12 grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-stretch">
              {/* details */}
              <Inlay>
                <div className="flex h-full flex-col justify-between gap-8">
                  <div className="space-y-7">
                    <div className="flex items-start gap-4">
                      <MapPin className="mt-1 h-5 w-5 shrink-0" style={{ color: oxblood }} aria-hidden="true" />
                      <div>
                        <p className="font-garamond text-xl" style={{ color: ink }}>
                          {STUDIO.address}
                        </p>
                        <p style={{ color: `${ink}aa` }}>{STUDIO.city}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Clock className="mt-1 h-5 w-5 shrink-0" style={{ color: oxblood }} aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium" style={{ color: ink }}>
                          Opnunartími{' '}
                          <span className="font-mono text-[11px] tracking-wide" style={{ color: `${ink}88` }}>
                            (sýnishorn)
                          </span>
                        </p>
                        <ul className="mt-2 max-w-xs space-y-1">
                          {STUDIO.hours.map((h) => (
                            <li key={h.day} className="flex justify-between gap-6 text-sm" style={{ color: `${ink}cc` }}>
                              <span>{h.day}</span>
                              <span className="font-mono whitespace-nowrap">{h.time}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-1">
                      <a
                        href={STUDIO.telHref}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 text-sm transition-colors hover:border-[color:var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                        style={{ border: `1px solid ${ink}2e`, color: ink }}
                      >
                        <Phone className="h-4 w-4" aria-hidden="true" />
                        {STUDIO.tel}
                      </a>
                      <a
                        href={STUDIO.gsmHref}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 text-sm transition-colors hover:border-[color:var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                        style={{ border: `1px solid ${ink}2e`, color: ink }}
                      >
                        <Phone className="h-4 w-4" aria-hidden="true" />
                        {STUDIO.gsm}
                      </a>
                      <a
                        href={`mailto:${STUDIO.email}`}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 text-sm transition-colors hover:border-[color:var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                        style={{ border: `1px solid ${ink}2e`, color: ink }}
                      >
                        <Mail className="h-4 w-4" aria-hidden="true" />
                        {STUDIO.email}
                      </a>
                    </div>
                  </div>
                </div>
              </Inlay>

              {/* bespoke map motif */}
              <Inlay delay={0.1}>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${STUDIO.coords.lat}&mlon=${STUDIO.coords.lng}#map=17/${STUDIO.coords.lat}/${STUDIO.coords.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group/map relative block aspect-[4/3] overflow-hidden rounded-[4px] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] md:aspect-auto md:h-full"
                  style={{ background: porcelain, border: `1px solid ${ink}1f` }}
                  aria-label={`Opna kort af Vesturgötu 5 í nýjum flipa (um það bil ${STUDIO.coords.lat}, ${STUDIO.coords.lng})`}
                >
                  <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
                    {/* harbour water */}
                    <rect x="0" y="0" width="400" height="76" fill={glaze} opacity="0.16" />
                    {/* streets */}
                    {[60, 120, 180, 240].map((y) => (
                      <line key={y} x1="0" y1={y} x2="400" y2={y} stroke={ink} strokeOpacity="0.12" strokeWidth="1.5" />
                    ))}
                    {[70, 150, 230, 310].map((x) => (
                      <line key={x} x1={x} y1="40" x2={x} y2="300" stroke={ink} strokeOpacity="0.12" strokeWidth="1.5" />
                    ))}
                    {/* a couple of city blocks */}
                    <rect x="78" y="100" width="60" height="38" fill={clay} opacity="0.35" rx="2" />
                    <rect x="240" y="170" width="56" height="44" fill={clay} opacity="0.35" rx="2" />
                    <rect x="158" y="240" width="70" height="40" fill={clay} opacity="0.35" rx="2" />
                    {/* the red house marker, with a quiet locating ping */}
                    <g>
                      {!reduce && (
                        <circle cx="150" cy="150" r="6" fill="none" stroke={oxblood} strokeWidth="1.5">
                          <animate attributeName="r" values="6;20" dur="2.4s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.6;0" dur="2.4s" repeatCount="indefinite" />
                        </circle>
                      )}
                      <line x1="150" y1="150" x2="150" y2="120" stroke={oxblood} strokeWidth="2" />
                      <path d="M150 100 l16 14 v18 h-32 v-18 Z" fill={oxblood} />
                      <circle cx="150" cy="150" r="4" fill={oxblood} />
                    </g>
                  </svg>
                  <div
                    className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] tracking-wide backdrop-blur transition-colors group-hover/map:text-[var(--accent)]"
                    style={{ background: `${ground}e6`, color: ink }}
                  >
                    Vesturgata 5 · 101 Reykjavík
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </div>
                </a>
              </Inlay>
            </div>
          </div>
        </section>

        {/* ── Buying & contact ───────────────────────────────── */}
        <section
          id="kaup"
          className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28"
          style={{ background: ink, color: ground }}
        >
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 md:grid-cols-2 md:items-start">
              <div>
                <Inlay>
                  <p className="flex items-center gap-3 font-mono text-xs tracking-[0.28em] uppercase" style={{ color: `${ground}aa` }}>
                    <span className="h-1.5 w-1.5 rounded-[1px]" style={{ background: oxblood }} aria-hidden="true" />
                    Kaup og sending
                  </p>
                </Inlay>
                <Inlay delay={0.06}>
                  <h2 className="mt-4 font-garamond text-[clamp(2.1rem,5.5vw,3.5rem)] leading-[1.05] tracking-[-0.01em]">
                    Eignastu verk
                  </h2>
                </Inlay>
                <Inlay delay={0.1}>
                  <p className="mt-4 max-w-md leading-relaxed" style={{ color: `${ground}cc` }}>
                    Verkin standa til sýnis og sölu í galleríinu við Vesturgötu. Skrifaðu eða
                    komdu við, og við finnum réttu skálina, eggið eða bollann.
                  </p>
                </Inlay>

                <div className="mt-9 space-y-px overflow-hidden rounded-[4px]" style={{ background: `${ground}1f` }}>
                  {TERMS.map((t, i) => (
                    <Inlay key={t.title} delay={0.1 + i * 0.06}>
                      <div className="flex items-start gap-4 p-5" style={{ background: ink }}>
                        <Check className="mt-0.5 h-5 w-5 shrink-0" style={{ color: oxblood }} aria-hidden="true" />
                        <div>
                          <h3 className="font-garamond text-lg">{t.title}</h3>
                          <p className="mt-1 text-sm leading-relaxed" style={{ color: `${ground}bb` }}>
                            {t.body}
                          </p>
                        </div>
                      </div>
                    </Inlay>
                  ))}
                </div>
              </div>

              {/* newsletter signup */}
              <Inlay delay={0.12}>
                <div className="rounded-[4px] p-7 md:p-9" style={{ background: `${ground}12`, border: `1px solid ${ground}24` }}>
                  <h3 className="font-garamond text-2xl">Fréttabréf úr vinnustofunni</h3>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: `${ground}cc` }}>
                    Nýjar seríur, opnanir og verk sem koma úr ofninum. Enginn ruslpóstur.
                  </p>
                  <form
                    className="mt-6"
                    onSubmit={(e) => {
                      e.preventDefault()
                      setSent(true)
                    }}
                  >
                    <label htmlFor={emailId} className="block text-sm font-medium" style={{ color: ground }}>
                      Netfang
                    </label>
                    <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                      <input
                        id={emailId}
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="nafn@netfang.is"
                        className="min-h-[48px] flex-1 rounded-full px-5 text-sm outline-none placeholder:text-[#221d1973] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                        style={{ background: ground, color: ink, border: `1px solid ${ground}33` }}
                      />
                      <button
                        type="submit"
                        className="kogga-link-solid inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                      >
                        {sent ? (
                          <>
                            <Check className="h-4 w-4" aria-hidden="true" /> Skráð
                          </>
                        ) : (
                          'Skrá mig'
                        )}
                      </button>
                    </div>
                    <p aria-live="polite" className="mt-3 min-h-[1.25rem] text-sm" style={{ color: `${ground}cc` }}>
                      {sent ? 'Takk fyrir. Þetta er sýnishorn og ekkert er sent.' : ''}
                    </p>
                  </form>
                </div>
              </Inlay>
            </div>
          </div>
        </section>
      </main>

      {/* ── Mobile sticky CTA (clear of chrome corner buttons) ──
           PreviewChrome floats fixed buttons at bottom-20 (5rem) left/right on
           mobile; this bar sits at bottom-0 and is short enough to stay below
           them. The inner row is capped + centred so its ends never reach the
           corners where those buttons live. ── */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
        style={{ background: `${ground}f2`, borderColor: `${ink}1f` }}
      >
        <div className="mx-auto flex max-w-md gap-3">
          <a
            href="#heimsokn"
            className="kogga-link-solid flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium"
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Heimsækja
          </a>
          <a
            href={`mailto:${STUDIO.email}`}
            className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition-colors"
            style={{ border: `1px solid ${ink}33`, color: ink }}
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Hafa samband
          </a>
        </div>
      </div>

      <PreviewFooter company={company} />
    </div>
  )
}
