import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode, RefObject } from 'react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { PartialPrototypeBanner } from '../PartialPrototypeBanner'
import { setThemeColor } from '../../lib/preview'
import {
  CARDS,
  CLOCKS,
  CONTEXT_COPY,
  CONTEXT_STATS,
  EXHIBITS,
  FACTS,
  FAQ,
  FILES,
  GOOD_TO_KNOW,
  IMAGES,
  PAIR,
  PLIES,
  RANKS,
  REPLAY_NOTE,
  TIMELINE,
  imgSet,
  startPlacement,
  type Placed,
} from './data'

const company = getPreviewCompany('fischersetur')

/* ── Palette (brief) ─────────────────────────────────────────────────────── */
const GROUND = '#0B0C0E' // near-black ink ground
const SURFACE = '#15171A' // raised surface
const INK = '#F4F1EA' // bone type / light pieces
const MUTED = '#9CA0A6' // secondary
const ACCENT = '#3FA7D6' // glacier blue — functional only
const BONE = '#E8E4D8' // light-square fill
const DARKSQ = '#2A2D31' // dark-square fill (a lifted ink, AA glyph contrast)
const HAIR = 'rgba(244,241,234,0.12)' // hairline divider

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ── Reveal: IO + CSS transition, in-view-on-mount + setTimeout failsafe ──── */
function Reveal({
  children,
  delay = 0,
  y = 22,
  className = '',
  style,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    // in-view-on-mount check (IO can miss already-visible nodes in throttled tabs)
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.14 },
    )
    io.observe(el)
    const t = window.setTimeout(() => setShown(true), 1300)
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [])
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translateY(${y}px)`,
        transition: `opacity .85s cubic-bezier(.2,.7,.2,1) ${delay}ms, transform .85s cubic-bezier(.2,.7,.2,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

/* ── Count-up: IO + interval, setTimeout lands final value ───────────────── */
function CountUp({ to, className, style }: { to: number; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState(0)
  const started = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const run = () => {
      if (started.current) return
      started.current = true
      if (prefersReduced()) {
        setN(to)
        return
      }
      const dur = 1100
      const t0 = Date.now()
      const iv = window.setInterval(() => {
        const p = Math.min(1, (Date.now() - t0) / dur)
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
        if (p >= 1) window.clearInterval(iv)
      }, 32)
      window.setTimeout(() => {
        window.clearInterval(iv)
        setN(to)
      }, dur + 220)
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          run()
          io.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    const fs = window.setTimeout(run, 1500)
    return () => {
      io.disconnect()
      window.clearTimeout(fs)
    }
  }, [to])
  // grouped with a dot to echo the Icelandic "1.700" admission notation
  const txt = n.toLocaleString('de-DE')
  return (
    <span ref={ref} className={className} style={style}>
      {txt}
    </span>
  )
}

/* ── Chess piece glyphs as SVG paths (no font dependency) ─────────────────── */
/* Filled silhouettes, ~45-unit box, centred. ink = black piece, bone = white. */
const GLYPH: Record<string, string> = {
  k: 'M22.5 6v6m-3-3h6M22.5 12c-5 0-9 3.5-9 9 0 5 5 7 9 12 4-5 9-7 9-12 0-5.5-4-9-9-9z M12 33c4-3 17-3 21 0v5H12v-5z',
  q: 'M9 14a2.5 2.5 0 1 1 0-.1zM22.5 11a2.5 2.5 0 1 1 0-.1zM36 14a2.5 2.5 0 1 1 0-.1zM11 16l4 12h15l4-12-6 8-3-10-3 10-3-10-3 10-6-8z M12 33c4-3 17-3 21 0v5H12v-5z',
  r: 'M13 12h4v3h4v-3h3v3h4v-3h4v8l-3 3v8H16v-8l-3-3v-8z M12 33c4-3 17-3 21 0v5H12v-5z',
  b: 'M22.5 7c2 0 3.5 1.5 3.5 3.5 0 1.3-.7 2.3-1.6 3 3.6 1.8 6.1 5.6 6.1 10 0 3-2 6-7.5 8-5.5-2-7.5-5-7.5-8 0-4.4 2.5-8.2 6.1-10-.9-.7-1.6-1.7-1.6-3C20 8.5 21.5 7 22.5 7z M12 33c4-3 17-3 21 0v5H12v-5z',
  n: 'M22 9c5 0 9 3 11 9 2 6 1 12 1 15H14c0-3 2-6 5-8-3 0-6 1-8-1 1-4 4-6 6-8-1-1-1-3 0-4 2 1 3 0 5-2v-1z M14 33h20v5H14v-5z',
  p: 'M22.5 11a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9z M16 21c2 1.5 11 1.5 13 0 1.5 3-1 6-1.5 9H17.5C17 27 14.5 24 16 21z M13 33c4-2.5 15-2.5 19 0v5H13v-5z',
}

/* ── Engine: derive piece placement (stable ids) after N plies ────────────── */
function placementAfter(plyCount: number): Placed[] {
  // deep-copy the starting placement
  const pieces: Placed[] = startPlacement().map((p) => ({ ...p }))
  const at = (sq: string) => pieces.find((p) => !p.captured && p.sq === sq)
  for (let i = 0; i < plyCount && i < PLIES.length; i++) {
    const ply = PLIES[i]
    if (ply.capture) {
      const taken = at(ply.to)
      if (taken) taken.captured = true
    }
    const moving = at(ply.from)
    if (moving) moving.sq = ply.to
    if (ply.castle) {
      const rook = at(ply.castle.from)
      if (rook) rook.sq = ply.castle.to
    }
  }
  return pieces
}

/* Square -> 0..7 grid coords (white at bottom, a1 bottom-left). */
const sqToXY = (sq: string) => ({
  x: FILES.indexOf(sq[0] as (typeof FILES)[number]),
  y: 7 - (Number(sq[1]) - 1), // rank 8 -> row 0
})

const isLight = (x: number, y: number) => (x + y) % 2 === 0

/* ── The SVG board ────────────────────────────────────────────────────────
   `flash` = {from,to} squares to highlight in accent for the active move.   */
function ChessBoard({
  pieces,
  flash,
  tilt = false,
  showCoords = false,
  ariaLabel = 'Chessboard',
  ariaHidden = false,
  className = '',
  style,
}: {
  pieces: Placed[]
  flash?: string[] | null
  tilt?: boolean
  showCoords?: boolean
  ariaLabel?: string
  ariaHidden?: boolean
  className?: string
  style?: CSSProperties
}) {
  const S = 45 // square unit
  const PAD = showCoords ? 20 : 0
  const total = S * 8
  const reduce = useReducedFlag()

  const cells = []
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      cells.push(
        <rect
          key={`c${x}-${y}`}
          x={PAD + x * S}
          y={PAD + y * S}
          width={S}
          height={S}
          fill={isLight(x, y) ? BONE : DARKSQ}
        />,
      )
    }
  }

  const flashSquares: string[] = flash ?? []

  return (
    <svg
      viewBox={`0 0 ${total + PAD * 2} ${total + PAD * 2}`}
      className={className}
      style={{
        ...style,
        transform: tilt && !reduce ? 'perspective(1400px) rotateX(9deg) rotateZ(-2.5deg)' : undefined,
        transformOrigin: 'center',
      }}
      role={ariaHidden ? undefined : 'img'}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden || undefined}
    >
      <rect x={0} y={0} width={total + PAD * 2} height={total + PAD * 2} fill={GROUND} />
      {cells}

      {/* active-move highlights */}
      {flashSquares.map((sq) => {
        const { x, y } = sqToXY(sq)
        return (
          <rect
            key={`f${sq}`}
            x={PAD + x * S}
            y={PAD + y * S}
            width={S}
            height={S}
            fill={ACCENT}
            opacity={0.42}
          />
        )
      })}

      {/* coordinate edges in Space Mono */}
      {showCoords &&
        FILES.map((f, i) => (
          <text
            key={`fl${f}`}
            x={PAD + i * S + S / 2}
            y={PAD + total + 14}
            fill={MUTED}
            fontSize={11}
            fontFamily="var(--font-mono), monospace"
            textAnchor="middle"
          >
            {f}
          </text>
        ))}
      {showCoords &&
        RANKS.map((rk, i) => (
          <text
            key={`rk${rk}`}
            x={11}
            y={PAD + i * S + S / 2 + 4}
            fill={MUTED}
            fontSize={11}
            fontFamily="var(--font-mono), monospace"
            textAnchor="middle"
          >
            {rk}
          </text>
        ))}

      {/* pieces — keyed by STABLE id so the DOM node persists and slides */}
      <g>
        {pieces.map((p) => {
          const { x, y } = sqToXY(p.sq)
          const white = p.piece === p.piece.toUpperCase()
          const glyph = GLYPH[p.piece.toLowerCase()]
          return (
            <g
              key={p.id}
              transform={`translate(${PAD + x * S}, ${PAD + y * S})`}
              style={{ transition: reduce ? 'none' : 'transform .26s cubic-bezier(.2,.8,.2,1)' }}
            >
              <g
                style={{
                  transformOrigin: `${S / 2}px ${S / 2}px`,
                  transform: p.captured ? 'scale(0)' : 'scale(1)',
                  opacity: p.captured ? 0 : 0.98,
                  filter: p.captured ? 'grayscale(1)' : 'none',
                  transition: reduce ? 'none' : 'transform .2s ease, opacity .2s ease, filter .2s ease',
                }}
              >
                <path
                  d={glyph}
                  fill={white ? INK : '#101216'}
                  stroke={white ? '#0B0C0E' : '#CFCFC8'}
                  strokeWidth={white ? 1.2 : 1.6}
                  strokeLinejoin="round"
                />
              </g>
            </g>
          )
        })}
      </g>
    </svg>
  )
}

/* shared reduced-motion flag hook */
function useReducedFlag() {
  const [reduce, setReduce] = useState(false)
  useEffect(() => {
    setReduce(prefersReduced())
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduce(mq.matches)
    mq.addEventListener?.('change', on)
    return () => mq.removeEventListener?.('change', on)
  }, [])
  return reduce
}

/* ── Passive parallax: translateY ≤ max, reduced-motion = 0 ──────────────── */
function useParallax(max = 22) {
  const ref = useRef<HTMLDivElement>(null)
  const [y, setY] = useState(0)
  const reduce = useReducedFlag()
  useEffect(() => {
    if (reduce) {
      setY(0)
      return
    }
    const el = ref.current
    if (!el) return
    const compute = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      // -1..1 across the viewport, centred when element is mid-screen
      const p = (rect.top + rect.height / 2 - vh / 2) / vh
      setY(Math.max(-max, Math.min(max, -p * max)))
    }
    compute()
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [reduce, max])
  return { ref, y }
}

/* ── Stroke-draw on enter (shared with timeline thread) ──────────────────── */
function useDrawOnEnter() {
  const ref = useRef<SVGSVGElement>(null)
  const [drawn, setDrawn] = useState(false)
  const reduce = useReducedFlag()
  useEffect(() => {
    if (reduce) {
      setDrawn(true)
      return
    }
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight * 0.9 && r.bottom > 0) {
      setDrawn(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDrawn(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    const t = window.setTimeout(() => setDrawn(true), 1400)
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [reduce])
  return { ref, drawn }
}

/* ── Eyebrow (Space Mono caps) ───────────────────────────────────────────── */
function Eyebrow({ children, color = ACCENT }: { children: ReactNode; color?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-8" style={{ background: color }} />
      <span className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color }}>
        {children}
      </span>
    </div>
  )
}

/* ── Smooth-scroll helper (respects reduced-motion via CSS) ──────────────── */
function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = prefersReduced()
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  STICKY NAV — appears after the hero, smooth-scroll anchors + Plan CTA      */
/* ══════════════════════════════════════════════════════════════════════════ */
const NAV_LINKS = [
  { id: 'match', label: 'THE MATCH' },
  { id: 'inside', label: 'INSIDE' },
  { id: 'timeline', label: 'TIMELINE' },
  { id: 'visit', label: 'VISIT' },
] as const

function StickyNav({ sentinel }: { sentinel: RefObject<HTMLDivElement> }) {
  const [stuck, setStuck] = useState(false)
  const [active, setActive] = useState<string>('')
  const reduce = useReducedFlag()

  // toggle visibility once the hero sentinel leaves the viewport
  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { rootMargin: '-72px 0px 0px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [sentinel])

  // active-section underline — one IO across the anchored sections
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.id)
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (vis[0]) setActive(vis[0].target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5] },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div
      className="fixed inset-x-0 top-0 z-40"
      style={{
        transform: stuck ? 'translateY(0)' : 'translateY(-100%)',
        opacity: stuck ? 1 : 0,
        transition: reduce ? 'none' : 'transform .42s cubic-bezier(.2,.8,.2,1), opacity .42s ease',
        background: 'rgba(11,12,14,0.72)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${HAIR}`,
        pointerEvents: stuck ? 'auto' : 'none',
      }}
    >
      <div className="mx-auto flex max-w-[1240px] items-center gap-4 px-6 py-3">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}
          className="font-clash text-[1.05rem] font-[600] tracking-[-0.01em]"
          style={{ color: INK }}
        >
          FISCHERSETUR
        </button>
        <nav className="ml-auto hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollToId(l.id)}
              className="font-mono text-[11px] tracking-[0.16em] transition-colors"
              style={{ color: active === l.id ? INK : MUTED }}
            >
              <span className="relative inline-block py-1">
                {l.label}
                <span
                  className="absolute -bottom-0.5 left-0 h-px transition-all duration-300"
                  style={{ width: active === l.id ? '100%' : '0%', background: ACCENT }}
                />
              </span>
            </button>
          ))}
        </nav>
        <div className="ml-auto md:ml-0 hidden lg:block font-mono text-[10.5px] tracking-[0.14em]" style={{ color: MUTED }}>
          OPEN DAILY · 13–17 · 24 MAY–12 OCT
        </div>
        <button
          onClick={() => scrollToId('visit')}
          className="fc-cta ml-auto md:ml-4 inline-flex min-h-[40px] items-center gap-2 rounded-[2px] px-4 py-2 font-mono text-[12px] tracking-[0.08em] transition-transform"
          style={{ background: ACCENT, color: GROUND }}
        >
          PLAN YOUR VISIT <span aria-hidden>↓</span>
        </button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  HERO — the opening position                                                */
/* ══════════════════════════════════════════════════════════════════════════ */
function Hero({ sentinel }: { sentinel: RefObject<HTMLDivElement> }) {
  const pieces = useMemo(() => startPlacement(), [])
  return (
    <header className="relative overflow-hidden" style={{ background: GROUND, minHeight: '100svh' }}>
      {/* faint board-grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(${INK} 1px, transparent 1px), linear-gradient(90deg, ${INK} 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />
      <div className="relative mx-auto flex min-h-[100svh] max-w-[1240px] flex-col px-6 pb-24 pt-28 md:pb-32">
        <div className="grid flex-1 items-center gap-10 md:grid-cols-12 md:gap-6">
          {/* BOARD — bleeds left on desktop, top band on mobile */}
          <div className="order-1 md:order-1 md:col-span-7 lg:col-span-7">
            <div
              className="fc-setup relative mx-auto w-full max-w-[560px] md:-ml-[10%] md:max-w-none"
              style={{ filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.55))' }}
            >
              <ChessBoard pieces={pieces} tilt showCoords ariaLabel="Chessboard, starting position" className="w-full" />
            </div>
          </div>

          {/* NAME — three lines + filled lower column */}
          <div className="order-2 md:col-span-5 lg:col-span-5">
            <Eyebrow>FISCHERSETUR · SELFOSS · 63.93°N</Eyebrow>
            <h1
              className="font-clash mt-6 font-[600] leading-[0.92] tracking-[-0.02em]"
              style={{ color: INK, fontSize: 'clamp(2.6rem, 7vw, 7rem)' }}
            >
              {FACTS.nameLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="font-satoshi mt-7 max-w-[34ch] text-[clamp(1rem,1.4vw,1.18rem)] leading-[1.55]" style={{ color: MUTED }}>
              {FACTS.tagline}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => scrollToId('visit')}
                className="fc-cta inline-flex min-h-[46px] items-center gap-2 rounded-[2px] px-6 py-3 font-mono text-[13px] tracking-[0.08em] transition-transform"
                style={{ background: ACCENT, color: GROUND }}
              >
                PLAN YOUR VISIT <span aria-hidden>↓</span>
              </button>
              <button
                onClick={() => scrollToId('match')}
                className="fc-ghost inline-flex min-h-[46px] items-center gap-2 rounded-[2px] px-6 py-3 font-mono text-[13px] tracking-[0.08em] transition-colors"
                style={{ border: `1px solid ${HAIR}`, color: INK }}
              >
                REPLAY THE MATCH <span aria-hidden>↓</span>
              </button>
            </div>

            {/* quick-facts row */}
            <div className="mt-9 grid grid-cols-3 gap-px overflow-hidden rounded-[2px]" style={{ background: HAIR }}>
              {[
                ['OPEN DAILY', '13:00–17:00'],
                ['ADMISSION', '1.700 ISK'],
                ['SEASON', '24 MAY–12 OCT'],
              ].map(([k, v]) => (
                <div key={k} className="px-3 py-4" style={{ background: SURFACE }}>
                  <div className="font-mono text-[9.5px] tracking-[0.16em]" style={{ color: MUTED }}>
                    {k}
                  </div>
                  <div className="font-mono mt-1.5 text-[12.5px] tracking-[0.06em]" style={{ color: INK }}>
                    {v}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 font-mono text-[10px] tracking-[0.14em]" style={{ color: MUTED }}>
              EST. 2013 · UNDER 14 FREE · SELFOSS · SUÐURLAND
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div className="pointer-events-none mt-10 hidden items-center justify-center gap-3 md:flex">
          <span className="font-mono text-[10px] tracking-[0.22em]" style={{ color: MUTED }}>
            SCROLL
          </span>
          <span className="fc-tick block h-7 w-px" style={{ background: `linear-gradient(${ACCENT}, transparent)` }} />
        </div>
      </div>

      {/* sentinel: when this leaves view, the sticky nav appears */}
      <div ref={sentinel} aria-hidden className="absolute left-0 top-[78svh] h-px w-px" />

      {/* bottom score ribbon */}
      <div
        className="absolute inset-x-0 bottom-0 overflow-hidden border-t"
        style={{ borderColor: HAIR, background: 'rgba(11,12,14,0.65)', backdropFilter: 'blur(6px)' }}
      >
        <div className="fc-marquee whitespace-nowrap py-3 font-mono text-[12px] tracking-[0.16em]" style={{ color: MUTED }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="mx-6">
              REYKJAVÍK 1972 &nbsp;—&nbsp; FISCHER <span style={{ color: ACCENT }}>12½ · 8½</span> SPASSKY &nbsp;—&nbsp; THE MATCH OF THE CENTURY
            </span>
          ))}
        </div>
      </div>
    </header>
  )
}

/* ── Framed image (grayscale, toned to the ink/bone world) ───────────────── */
function FramedImage({
  id,
  alt,
  sizes,
  widths,
  className = '',
  imgClassName = '',
  fetchPriority,
  style,
}: {
  id: string
  alt: string
  sizes: string
  widths?: number[]
  className?: string
  imgClassName?: string
  fetchPriority?: 'high' | 'low' | 'auto'
  style?: CSSProperties
}) {
  const s = imgSet(id, widths)
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ border: `1px solid ${HAIR}`, background: SURFACE, ...style }}>
      <img
        src={s.src}
        srcSet={s.srcSet}
        sizes={sizes}
        alt={alt}
        loading={fetchPriority === 'high' ? 'eager' : 'lazy'}
        fetchPriority={fetchPriority}
        className={`h-full w-full object-cover ${imgClassName}`}
        style={{ filter: 'grayscale(1) contrast(1.06) brightness(0.92)' }}
      />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  CONTEXT BAND — why this match still matters                                */
/* ══════════════════════════════════════════════════════════════════════════ */
function ContextBand() {
  const { ref, y } = useParallax(24)
  const img = imgSet(IMAGES.contextBand, [1280, 1920, 2400])
  return (
    <section className="relative overflow-hidden" style={{ background: GROUND, borderTop: `1px solid ${HAIR}`, borderBottom: `1px solid ${HAIR}` }}>
      {/* full-bleed archival-style image with gradient overlay for AA */}
      <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0" style={{ transform: `translateY(${y}px)`, willChange: 'transform' }}>
        <img
          src={img.src}
          srcSet={img.srcSet}
          sizes="100vw"
          alt=""
          loading="lazy"
          className="h-[112%] w-full object-cover"
          style={{ filter: 'grayscale(1) contrast(1.1) brightness(0.7)', opacity: 0.38 }}
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(11,12,14,0.82), rgba(11,12,14,0.64) 45%, rgba(11,12,14,0.9))' }}
      />

      <div className="relative mx-auto max-w-[1240px] px-6 py-24 md:py-32">
        <Reveal>
          <Eyebrow>WHY IT STILL MATTERS · 1972</Eyebrow>
        </Reveal>
        <Reveal delay={90}>
          <h2 className="font-clash mt-6 max-w-[18ch] font-[600] leading-[0.98] tracking-[-0.02em]" style={{ color: INK, fontSize: 'clamp(2.2rem,5vw,4.6rem)' }}>
            The Match of the Century.
          </h2>
        </Reveal>
        <Reveal delay={170}>
          <p className="font-satoshi mt-7 max-w-[58ch] text-[clamp(1rem,1.4vw,1.2rem)] leading-[1.65]" style={{ color: INK }}>
            {CONTEXT_COPY}
          </p>
        </Reveal>

        {/* 4-up stat strip */}
        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[2px] md:grid-cols-4" style={{ background: HAIR }}>
          {CONTEXT_STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="h-full">
              <div className="flex h-full flex-col px-5 py-7" style={{ background: 'rgba(21,23,26,0.86)' }}>
                <div className="font-clash font-[600] leading-[0.95] tracking-[-0.01em]" style={{ color: INK, fontSize: 'clamp(1.7rem,3vw,2.6rem)' }}>
                  {s.value != null ? <CountUp to={s.value} /> : s.display}
                </div>
                <div className="font-mono mt-3 text-[10.5px] uppercase leading-[1.5] tracking-[0.12em]" style={{ color: MUTED }}>
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <div className="mt-6 font-mono text-[11px] tracking-[0.14em]" style={{ color: ACCENT }}>
            THE FIRST CHESS MUSEUM IN THE NORDIC COUNTRIES
          </div>
        </Reveal>
        <p className="mt-3 font-mono text-[10px] tracking-[0.1em]" style={{ color: MUTED }}>
          Background image indicative.
        </p>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  SIGNATURE — scroll-replay on a pinned board                                */
/* ══════════════════════════════════════════════════════════════════════════ */
function MatchReplay() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0) // active card index
  const [progress, setProgress] = useState(0) // 0..1 across the section
  const reduce = useReducedFlag()

  // Passive synchronous scroll handler: read rect, map to card index, write state.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const compute = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // section is tall; the pinned stage occupies the first 100vh.
      // progress 0..1 across the scrollable remainder maps to card index.
      const scrolled = -rect.top
      const scrollable = el.offsetHeight - vh
      const p = scrollable > 0 ? Math.min(1, Math.max(0, scrolled / scrollable)) : 0
      const idx = Math.min(CARDS.length - 1, Math.floor(p * CARDS.length + 0.0001))
      setActive((prev) => (prev === idx ? prev : idx))
      setProgress(p)
    }

    compute()
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [])

  const card = CARDS[active]
  const pieces = useMemo(() => placementAfter(card.ply), [card.ply])
  const lastPly = card.ply > 0 ? PLIES[card.ply - 1] : null
  const flash: string[] | null = lastPly
    ? [lastPly.from, lastPly.to, ...(lastPly.castle ? [lastPly.castle.from, lastPly.castle.to] : [])]
    : null
  const clock = CLOCKS[active]

  return (
    <section ref={sectionRef} id="match" className="relative" style={{ background: GROUND, height: `${CARDS.length * 100}vh` }}>
      {/* pinned stage */}
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* section heading strip */}
        <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-3 px-6 pt-10 md:pt-12">
          <Eyebrow>THE SIGNATURE · MOVE BY MOVE</Eyebrow>
          <span className="font-mono text-[10.5px] tracking-[0.16em]" style={{ color: MUTED }}>
            REYKJAVÍK 1972 · GAME 6 · A RECONSTRUCTION
          </span>
        </div>

        <div className="mx-auto grid w-full max-w-[1240px] flex-1 grid-rows-[auto_1fr] items-center gap-4 px-6 pb-6 md:grid-cols-12 md:grid-rows-1 md:gap-8">
          {/* left gutter progress line (desktop) */}
          <div className="relative order-1 hidden md:col-span-1 md:block">
            <div className="relative mx-auto h-[60%] w-px" style={{ background: HAIR }}>
              <div
                className="absolute left-0 top-0 w-px"
                style={{ height: `${Math.round(progress * 100)}%`, background: ACCENT, transition: reduce ? 'none' : 'height .12s linear' }}
              />
            </div>
            <div className="mt-3 text-center font-mono text-[10px] tracking-[0.12em]" style={{ color: MUTED }}>
              {String(active + 1).padStart(2, '0')}/{String(CARDS.length).padStart(2, '0')}
            </div>
          </div>

          {/* BOARD — top on mobile, left on desktop */}
          <div className="order-1 md:order-2 md:col-span-6">
            <div className="relative mx-auto w-full max-w-[min(34vh,360px)] md:max-w-[640px]">
              {/* dual clock */}
              <div className="mb-1.5 flex items-center justify-between font-mono text-[12px] tracking-[0.12em]">
                <Clock label="WHITE · FISCHER" time={clock.white} running={clock.running === 'w'} />
                <span className="text-[11px]" style={{ color: MUTED }}>
                  GAME 6 · 1972
                </span>
                <Clock label="BLACK · SPASSKY" time={clock.black} running={clock.running === 'b'} align="right" />
              </div>
              <div className="mb-3 text-center font-mono text-[9.5px] tracking-[0.16em]" style={{ color: MUTED }}>
                CLOCK TIMES · ILLUSTRATIVE SAMPLE
              </div>
              <div style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.5))' }}>
                <ChessBoard pieces={pieces} flash={flash} showCoords ariaHidden className="w-full" />
              </div>
            </div>
          </div>

          {/* RAIL — the active move card (cross-faded by state) */}
          <div className="order-2 md:order-3 md:col-span-5">
            <div className="fc-movecard relative">
              <div key={active} className={reduce ? '' : 'fc-card-in'}>
                <div className="font-mono text-[12px] tracking-[0.14em]" style={{ color: ACCENT }}>
                  MOVE {String(active + 1).padStart(2, '0')} / {String(CARDS.length).padStart(2, '0')}
                </div>
                <div
                  className="font-clash mt-2 font-[600] leading-[0.95] tracking-[-0.02em]"
                  style={{ color: INK, fontSize: 'clamp(1.9rem, 4vw, 3.4rem)' }}
                >
                  {card.index}
                </div>
                <pre
                  className="mt-4 whitespace-pre-wrap font-mono text-[15px] leading-[1.7]"
                  style={{ color: INK }}
                >
                  {card.notation}
                </pre>
                <div className="font-satoshi mt-2 text-[15px] font-[500]" style={{ color: INK }}>
                  {card.title}
                </div>
                <p className="font-satoshi mt-3 max-w-[42ch] text-[14.5px] leading-[1.62]" style={{ color: MUTED }}>
                  {card.stakes}
                </p>

                {/* climax inset — appears with the final 'Spassky applauds' card */}
                {active === CARDS.length - 1 && (
                  <div className="mt-4 flex items-center gap-4 md:mt-5">
                    <FramedImage
                      id={IMAGES.replayInset}
                      alt="Vintage chess players at a tournament board, black and white"
                      sizes="(max-width: 768px) 33vw, 300px"
                      widths={[320, 480, 640]}
                      className="h-[88px] w-[112px] shrink-0 rounded-[2px] md:h-[150px] md:w-[200px]"
                    />
                    <div>
                      <div className="font-clash text-[1.4rem] font-[600] leading-[1.05]" style={{ color: INK }}>
                        12½ – 8½
                      </div>
                      <p className="font-satoshi mt-1.5 text-[13px] leading-[1.5]" style={{ color: MUTED }}>
                        Spassky rose and applauded. Fischer took the title.
                      </p>
                      <div className="mt-1 font-mono text-[9px] tracking-[0.14em]" style={{ color: MUTED }}>
                        ARCHIVAL IMAGE INDICATIVE
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* progress dots */}
            <div className="mt-7 flex items-center gap-2">
              {CARDS.map((_, i) => (
                <span
                  key={i}
                  className="h-[3px] flex-1 rounded-full transition-colors duration-300"
                  style={{ background: i <= active ? ACCENT : 'rgba(244,241,234,0.28)' }}
                />
              ))}
            </div>
            <p className="font-mono mt-4 max-w-[46ch] text-[11px] leading-[1.6] tracking-[0.04em]" style={{ color: MUTED }}>
              {REPLAY_NOTE}
            </p>
            {reduce && (
              <p className="font-satoshi mt-3 text-[12px]" style={{ color: MUTED }}>
                Reduced-motion: scroll to step through each position.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Clock({ label, time, running, align = 'left' }: { label: string; time: string; running: boolean; align?: 'left' | 'right' }) {
  return (
    <div className={align === 'right' ? 'text-right' : ''}>
      <div className="flex items-center gap-1.5" style={{ justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}>
        {align === 'left' && (
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: running ? ACCENT : 'transparent', border: running ? 'none' : `1px solid ${MUTED}` }}
          />
        )}
        <span style={{ color: running ? ACCENT : INK }}>{time}</span>
        {align === 'right' && (
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: running ? ACCENT : 'transparent', border: running ? 'none' : `1px solid ${MUTED}` }}
          />
        )}
      </div>
      <div className="mt-1 text-[9px] tracking-[0.16em]" style={{ color: MUTED }}>
        {label}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  INSIDE THE CENTER — staggered editorial gallery of what you'll see          */
/* ══════════════════════════════════════════════════════════════════════════ */
function Inside() {
  return (
    <section id="inside" className="relative" style={{ background: GROUND, borderTop: `1px solid ${HAIR}` }}>
      <div className="mx-auto max-w-[1240px] px-6 py-24 md:py-32">
        <div className="md:flex md:items-end md:justify-between md:gap-8">
          <Reveal>
            <Eyebrow>WHAT YOU’LL SEE · AUSTURVEGUR 21</Eyebrow>
            <h2 className="font-clash mt-6 max-w-[14ch] font-[600] leading-[0.98] tracking-[-0.02em]" style={{ color: INK, fontSize: 'clamp(2.2rem,5vw,4.6rem)' }}>
              Inside the Center.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="font-satoshi mt-6 max-w-[40ch] text-[15px] leading-[1.6] md:mt-0 md:text-right" style={{ color: MUTED }}>
              One small room in Selfoss, devoted entirely to the game — the match, the man, and a board waiting for you.
            </p>
          </Reveal>
        </div>

        {/* staggered tall-tile gallery */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {EXHIBITS.map((ex, i) => (
            <Reveal key={ex.no} delay={i * 90} className={ex.tall ? 'lg:pt-0' : 'lg:pt-16'}>
              <article className="fc-tile group relative flex h-full flex-col">
                <FramedImage
                  id={ex.img.id}
                  alt={ex.img.alt}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  widths={[480, 720, 960]}
                  className="w-full rounded-[2px]"
                  imgClassName="fc-tile-img"
                  style={{ height: ex.tall ? 'clamp(360px, 46vw, 480px)' : 'clamp(320px, 40vw, 420px)' }}
                />
                <div className="fc-cap mt-[-44px] ml-3 mr-3 rounded-[2px] px-4 py-4" style={{ background: 'rgba(11,12,14,0.92)', border: `1px solid ${HAIR}` }}>
                  <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.16em]" style={{ color: ACCENT }}>
                    <span>{ex.no}</span>
                    <span className="fc-rule h-px w-4" style={{ background: ACCENT }} />
                    <span style={{ color: MUTED }}>{ex.mono}</span>
                  </div>
                  <h3 className="font-clash mt-2 text-[1.15rem] font-[600] leading-[1.1]" style={{ color: INK }}>
                    {ex.title}
                  </h3>
                  <p className="font-satoshi mt-2 text-[13px] leading-[1.55]" style={{ color: MUTED }}>
                    {ex.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="mt-10 font-mono text-[10px] tracking-[0.1em]" style={{ color: MUTED }}>
          Interior imagery indicative — a sense of the collection, not the exact display.
        </p>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  TIMELINE — Fischer & Iceland, an era spine with large feature images        */
/* ══════════════════════════════════════════════════════════════════════════ */
function Timeline() {
  const { ref, drawn } = useDrawOnEnter()
  return (
    <section id="timeline" className="relative" style={{ background: SURFACE, borderTop: `1px solid ${HAIR}` }}>
      <div className="mx-auto max-w-[1240px] px-6 py-24 md:py-32">
        <Reveal>
          <Eyebrow>THE ERA SPINE · FISCHER &amp; ICELAND</Eyebrow>
          <h2 className="font-clash mt-6 max-w-[16ch] font-[600] leading-[0.98] tracking-[-0.02em]" style={{ color: INK, fontSize: 'clamp(2.2rem,5vw,4.6rem)' }}>
            From Brooklyn to Laugardælir.
          </h2>
        </Reveal>

        <div className="relative mt-16">
          {/* the accent thread (desktop centre, mobile left) */}
          <svg ref={ref} aria-hidden className="pointer-events-none absolute left-4 top-0 h-full w-px md:left-1/2 md:-translate-x-1/2" preserveAspectRatio="none" viewBox="0 0 1 100">
            <line x1="0.5" y1="0" x2="0.5" y2="100" stroke={HAIR} strokeWidth="1" />
            <line
              x1="0.5"
              y1="0"
              x2="0.5"
              y2="100"
              stroke={ACCENT}
              strokeWidth="1"
              pathLength={100}
              style={{
                strokeDasharray: 100,
                strokeDashoffset: drawn ? 0 : 100,
                transition: 'stroke-dashoffset 1.6s ease',
              }}
            />
          </svg>

          <div className="space-y-12 md:space-y-20">
            {TIMELINE.map((node, i) => {
              const left = i % 2 === 0
              return (
                <Reveal key={node.year} delay={60} y={26}>
                  <div className="relative grid grid-cols-[auto_1fr] gap-5 pl-1 md:grid-cols-2 md:gap-12">
                    {/* node dot */}
                    <span
                      className="absolute left-4 top-1.5 z-10 h-3 w-3 -translate-x-1/2 rounded-full md:left-1/2"
                      style={{ background: ACCENT, boxShadow: `0 0 0 4px ${SURFACE}` }}
                    />

                    {/* TEXT block */}
                    <div className={`col-start-2 md:col-start-auto ${left ? 'md:order-1 md:pr-12 md:text-right' : 'md:order-2 md:col-start-2 md:pl-12'}`}>
                      <div className="font-clash font-[600] leading-[0.9] tracking-[-0.02em]" style={{ color: INK, fontSize: 'clamp(2.4rem,5vw,4.2rem)' }}>
                        {node.year}
                      </div>
                      <div className="font-satoshi mt-2 text-[1.05rem] font-[500]" style={{ color: INK }}>
                        {node.title}
                      </div>
                      <p className={`font-satoshi mt-2 max-w-[42ch] text-[14px] leading-[1.6] ${left ? 'md:ml-auto' : ''}`} style={{ color: MUTED }}>
                        {node.body}
                      </p>
                    </div>

                    {/* IMAGE block (large feature) or spacer */}
                    <div className={`col-start-2 mt-1 md:col-start-auto ${left ? 'md:order-2 md:pl-12' : 'md:order-1 md:pr-12'}`}>
                      {node.img ? (
                        <FramedImage
                          id={node.img.id}
                          alt={node.img.alt}
                          sizes="(max-width: 768px) 100vw, 46vw"
                          widths={[640, 960, 1280]}
                          className="w-full rounded-[2px]"
                          style={{ height: 'clamp(220px, 32vw, 360px)' }}
                        />
                      ) : (
                        <div className="hidden h-full items-center md:flex">
                          <div className="font-mono text-[11px] tracking-[0.18em]" style={{ color: MUTED, opacity: 0.5 }}>
                            <span aria-hidden>{left ? '↗' : '↖'}</span> {node.year}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
        <p className="mt-12 font-mono text-[10px] tracking-[0.1em]" style={{ color: MUTED }}>
          Era imagery indicative. Dates and facts verified.
        </p>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  VISIT — a chess-rank strip                                                  */
/* ══════════════════════════════════════════════════════════════════════════ */
function Visit() {
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${FACTS.lat},${FACTS.lng}`
  return (
    <section id="visit" style={{ background: GROUND }} className="border-t" >
      <div className="mx-auto max-w-[1240px] px-6 py-20 md:py-28" style={{ borderColor: HAIR }}>
        <Reveal>
          <Eyebrow>PLAN YOUR VISIT · THE PRACTICAL BOARD</Eyebrow>
          <h2 className="font-clash mt-6 max-w-[16ch] font-[600] leading-[0.98] tracking-[-0.02em]" style={{ color: INK, fontSize: 'clamp(2rem, 4.4vw, 4rem)' }}>
            When, how much, where.
          </h2>
        </Reveal>

        {/* the rank strip: 4 cells */}
        <div className="mt-12 grid gap-px overflow-hidden rounded-[2px] sm:grid-cols-2 lg:grid-cols-4" style={{ background: HAIR }}>
          {/* HOURS — ink cell */}
          <Reveal delay={0} className="h-full">
            <RankCell tone="ink">
              <CellLabel>01 · HOURS</CellLabel>
              <div className="font-mono text-[13px] tracking-[0.1em]" style={{ color: ACCENT }}>
                {FACTS.openLabel}
              </div>
              <div className="font-clash mt-3 font-[600] leading-[1.05]" style={{ color: INK, fontSize: 'clamp(1.4rem,2.4vw,2rem)' }}>
                {FACTS.hours}
              </div>
              <div className="font-mono mt-2 text-[12px] tracking-[0.08em]" style={{ color: MUTED }}>
                {FACTS.season}
              </div>
              <p className="font-satoshi mt-5 text-[13.5px]" style={{ color: MUTED }}>
                {FACTS.winter}
              </p>
            </RankCell>
          </Reveal>

          {/* ADMISSION — bone cell (dark text on bone) */}
          <Reveal delay={90} className="h-full">
            <RankCell tone="bone">
              <CellLabel tone="bone">02 · ADMISSION</CellLabel>
              <div className="font-clash mt-1 font-[600] leading-[0.95]" style={{ color: GROUND, fontSize: 'clamp(2.4rem,5vw,4rem)' }}>
                <CountUp to={1700} />
                <span className="font-mono align-top text-[0.34em] tracking-[0.12em]" style={{ color: GROUND }}>
                  {' '}
                  ISK
                </span>
              </div>
              <div className="font-mono mt-3 text-[12px] tracking-[0.12em]" style={{ color: '#2A2D31' }}>
                {FACTS.admissionNote}
              </div>
              <p className="font-satoshi mt-5 text-[13.5px]" style={{ color: '#3A3D42' }}>
                Cash and card at the door. Roughly the price of a coffee and a game well played.
              </p>
            </RankCell>
          </Reveal>

          {/* FIND US — ink cell with styled map + CTA */}
          <Reveal delay={180} className="h-full">
            <RankCell tone="ink">
              <CellLabel>03 · FIND US</CellLabel>
              <div className="font-satoshi mt-1 text-[clamp(1.05rem,1.6vw,1.25rem)] font-[500] leading-[1.35]" style={{ color: INK }}>
                {FACTS.address}
              </div>
              {/* styled mini-map — Ölfusá river bend + Austurvegur pin */}
              <div className="fc-map mt-4 w-full overflow-hidden rounded-[2px]" style={{ border: `1px solid ${HAIR}`, background: '#0E1013' }}>
                <SelfossMap />
              </div>
              <div className="font-mono mt-3 text-[12px] tracking-[0.08em]" style={{ color: MUTED }}>
                {FACTS.gps}
              </div>
              <a
                href={mapsHref}
                target="_blank"
                rel="noreferrer"
                className="fc-cta mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-[2px] px-5 py-3 font-mono text-[13px] tracking-[0.08em] transition-transform"
                style={{ background: ACCENT, color: GROUND }}
              >
                OPEN IN MAPS <span aria-hidden>↗</span>
              </a>
            </RankCell>
          </Reveal>

          {/* GOOD TO KNOW — ink cell */}
          <Reveal delay={270} className="h-full">
            <RankCell tone="ink">
              <CellLabel>04 · GOOD TO KNOW</CellLabel>
              <ul className="mt-1 space-y-3">
                {GOOD_TO_KNOW.map((g) => (
                  <li key={g} className="flex items-start gap-2.5 font-satoshi text-[14px] leading-[1.4]" style={{ color: INK }}>
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: ACCENT }} />
                    {g}
                  </li>
                ))}
              </ul>
              <div className="mt-6 space-y-1.5 font-mono text-[12px] tracking-[0.06em]" style={{ color: MUTED }}>
                <a href={`tel:${FACTS.phoneHref}`} className="block hover:opacity-80" style={{ color: INK }}>
                  {FACTS.phone}
                </a>
                <a href={`mailto:${FACTS.email}`} className="block hover:opacity-80">
                  {FACTS.email}
                </a>
              </div>
            </RankCell>
          </Reveal>
        </div>

        {/* wide wayfinding photo band */}
        <Reveal delay={80} className="mt-px">
          <div className="relative overflow-hidden rounded-[2px]" style={{ border: `1px solid ${HAIR}` }}>
            <FramedImage
              id={IMAGES.wayfinding}
              alt="A South Iceland town street near Selfoss, indicative"
              sizes="100vw"
              widths={[1280, 1920, 2400]}
              className="w-full"
              style={{ height: 'clamp(200px, 26vw, 320px)', border: 'none' }}
            />
            <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(11,12,14,0.85), rgba(11,12,14,0.3) 60%, transparent)' }} />
            <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-9">
              <div className="font-mono text-[10.5px] tracking-[0.18em]" style={{ color: ACCENT }}>
                AUSTURVEGUR 21 · 800 SELFOSS
              </div>
              <div className="font-clash mt-2 max-w-[20ch] text-[clamp(1.4rem,3vw,2.4rem)] font-[600] leading-[1.05]" style={{ color: INK }}>
                On the main street through South Iceland.
              </div>
              <div className="mt-1 font-mono text-[9.5px] tracking-[0.1em]" style={{ color: MUTED }}>
                Wayfinding image indicative.
              </div>
            </div>
          </div>
        </Reveal>

        {/* Pair your visit row */}
        <div className="mt-px grid gap-px overflow-hidden rounded-[2px] md:grid-cols-2" style={{ background: HAIR }}>
          {PAIR.map((p, i) => (
            <Reveal key={p.title} delay={i * 90} className="h-full">
              <div className="fc-pair flex h-full items-start gap-4 px-7 py-7 transition-transform" style={{ background: SURFACE }}>
                <span className="font-clash text-[1.4rem] font-[600]" style={{ color: ACCENT }} aria-hidden>
                  ↗
                </span>
                <div>
                  <div className="font-mono text-[10.5px] tracking-[0.16em]" style={{ color: MUTED }}>
                    {p.label}
                  </div>
                  <div className="font-satoshi mt-1.5 text-[1.05rem] font-[500]" style={{ color: INK }}>
                    {p.title}
                  </div>
                  <p className="font-satoshi mt-1.5 max-w-[40ch] text-[13.5px] leading-[1.55]" style={{ color: MUTED }}>
                    {p.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Styled Selfoss mini-map (Ölfusá bend + Austurvegur pin), no stock photo ─ */
function SelfossMap() {
  return (
    <svg viewBox="0 0 320 150" className="w-full" role="img" aria-label="Map of Selfoss centred on Austurvegur 21">
      <rect x="0" y="0" width="320" height="150" fill="#0E1013" />
      {/* faint grid */}
      {Array.from({ length: 7 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 25} x2="320" y2={i * 25} stroke={HAIR} strokeWidth="0.5" />
      ))}
      {Array.from({ length: 13 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 25} y1="0" x2={i * 25} y2="150" stroke={HAIR} strokeWidth="0.5" />
      ))}
      {/* Ölfusá river bend */}
      <path d="M-10 30 C70 38 110 78 150 86 C210 98 250 70 340 96 L340 150 L-10 150 Z" fill="rgba(63,167,214,0.10)" stroke="rgba(63,167,214,0.5)" strokeWidth="1.4" />
      <text x="40" y="128" fontSize="9" fontFamily="var(--font-mono), monospace" fill="rgba(63,167,214,0.7)">ÖLFUSÁ</text>
      {/* Austurvegur — the main street */}
      <line x1="0" y1="62" x2="320" y2="54" stroke={MUTED} strokeWidth="2.4" />
      <text x="222" y="46" fontSize="8.5" fontFamily="var(--font-mono), monospace" fill={MUTED}>AUSTURVEGUR</text>
      {/* cross streets */}
      <line x1="120" y1="0" x2="118" y2="86" stroke={HAIR} strokeWidth="1.4" />
      <line x1="210" y1="0" x2="206" y2="78" stroke={HAIR} strokeWidth="1.4" />
      {/* the pin */}
      <circle cx="168" cy="58" r="14" fill="none" stroke={ACCENT} strokeWidth="1" opacity="0.45" />
      <circle cx="168" cy="58" r="5" fill={ACCENT} />
      <text x="168" y="84" fontSize="8.5" fontFamily="var(--font-mono), monospace" fill={INK} textAnchor="middle">FISCHERSETUR</text>
    </svg>
  )
}

function RankCell({ tone, children }: { tone: 'ink' | 'bone'; children: ReactNode }) {
  return (
    <div
      className="fc-cell flex h-full flex-col p-8 md:p-9"
      style={{ background: tone === 'bone' ? BONE : SURFACE }}
    >
      {children}
    </div>
  )
}
function CellLabel({ children, tone = 'ink' }: { children: ReactNode; tone?: 'ink' | 'bone' }) {
  return (
    <div className="font-mono mb-5 text-[11px] uppercase tracking-[0.2em]" style={{ color: tone === 'bone' ? '#3A3D42' : MUTED }}>
      {children}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  FAQ — good to know, an accordion                                            */
/* ══════════════════════════════════════════════════════════════════════════ */
function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="relative" style={{ background: GROUND, borderTop: `1px solid ${HAIR}` }}>
      <div className="mx-auto max-w-[1240px] px-6 py-24 md:py-32">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <Reveal>
              <Eyebrow>GOOD TO KNOW</Eyebrow>
              <h2 className="font-clash mt-6 max-w-[12ch] font-[600] leading-[0.98] tracking-[-0.02em]" style={{ color: INK, fontSize: 'clamp(2rem,4.4vw,3.6rem)' }}>
                Before you come.
              </h2>
              <p className="font-satoshi mt-6 max-w-[34ch] text-[14.5px] leading-[1.6]" style={{ color: MUTED }}>
                Everything a first-time visitor tends to ask. Still unsure?{' '}
                <a href={`tel:${FACTS.phoneHref}`} className="underline-offset-4 hover:opacity-80" style={{ color: ACCENT }}>
                  Call us
                </a>{' '}
                or{' '}
                <a href={`mailto:${FACTS.email}`} className="underline-offset-4 hover:opacity-80" style={{ color: ACCENT }}>
                  send an email
                </a>
                .
              </p>
            </Reveal>
          </div>

          <div className="md:col-span-8">
            <Reveal delay={80}>
              <div className="overflow-hidden rounded-[2px]" style={{ border: `1px solid ${HAIR}`, background: SURFACE }}>
                {FAQ.map((item, i) => {
                  const isOpen = open === i
                  return (
                    <div key={item.q} style={{ borderTop: i === 0 ? 'none' : `1px solid ${HAIR}` }}>
                      <button
                        onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center gap-4 px-6 py-5 text-left"
                      >
                        <span className="font-mono text-[11px] tracking-[0.12em]" style={{ color: ACCENT }}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="font-satoshi flex-1 text-[1.02rem] font-[500]" style={{ color: INK }}>
                          {item.q}
                        </span>
                        <span
                          className="font-mono text-[18px] leading-none transition-transform duration-300"
                          style={{ color: MUTED, transform: isOpen ? 'rotate(45deg)' : 'none' }}
                          aria-hidden
                        >
                          +
                        </span>
                      </button>
                      <div
                        className="fc-acc grid px-6"
                        style={{
                          gridTemplateRows: isOpen ? '1fr' : '0fr',
                          opacity: isOpen ? 1 : 0,
                          transition: 'grid-template-rows .34s cubic-bezier(.2,.8,.2,1), opacity .34s ease, padding-bottom .34s ease',
                          paddingBottom: isOpen ? '1.25rem' : 0,
                        }}
                      >
                        <p className="overflow-hidden pl-[2.1rem] font-satoshi text-[14px] leading-[1.65]" style={{ color: MUTED }}>
                          {item.a}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  CLOSER — buried at Laugardælir / resignation                               */
/* ══════════════════════════════════════════════════════════════════════════ */
function Closer() {
  const ref = useRef<HTMLDivElement>(null)
  const [draw, setDraw] = useState(false)
  const reduce = useReducedFlag()
  useEffect(() => {
    if (reduce) {
      setDraw(true)
      return
    }
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight) {
      setDraw(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDraw(true)
          io.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    const t = window.setTimeout(() => setDraw(true), 1400)
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [reduce])

  const closerImg = imgSet(IMAGES.closer, [1280, 1920, 2400])
  return (
    <section ref={ref} className="relative overflow-hidden" style={{ background: GROUND }}>
      {/* raised full-bleed grayscale image — a real closing image moment */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <img
          src={closerImg.src}
          srcSet={closerImg.srcSet}
          sizes="100vw"
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
          style={{ filter: 'grayscale(1) contrast(1.12) brightness(0.7)', opacity: 0.5 }}
        />
      </div>
      <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,12,14,0.74), rgba(11,12,14,0.6) 40%, rgba(11,12,14,0.92))' }} />

      {/* toppled king — line-art, draws once */}
      <svg
        viewBox="0 0 300 200"
        aria-hidden
        className="pointer-events-none absolute -right-8 bottom-0 h-[70%] w-auto opacity-[0.22] md:opacity-[0.26]"
      >
        <g
          transform="translate(150,110) rotate(74)"
          fill="none"
          stroke={INK}
          strokeWidth="2.4"
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{
            strokeDasharray: 900,
            strokeDashoffset: draw ? 0 : 900,
            transition: reduce ? 'none' : 'stroke-dashoffset 1.4s ease',
          }}
        >
          <path d="M0 -78 v14 m-9 -7 h18" />
          <path d="M0 -64 c-20 0 -34 14 -34 34 0 20 18 28 34 46 16 -18 34 -26 34 -46 0 -20 -14 -34 -34 -34z" />
          <path d="M-38 30 c16 -12 60 -12 76 0 v18 h-76 z" />
        </g>
      </svg>

      <div className="relative mx-auto max-w-[1240px] px-6 py-28 md:py-40">
        <Reveal>
          <Eyebrow>THE RESIGNATION · LAUGARDÆLIR</Eyebrow>
        </Reveal>
        <Reveal delay={120}>
          <h2
            className="font-clash mt-7 max-w-[14ch] font-[600] leading-[0.96] tracking-[-0.02em]"
            style={{ color: INK, fontSize: 'clamp(2.4rem, 6vw, 6rem)' }}
          >
            He came back to Iceland to stay.
          </h2>
        </Reveal>
        <Reveal delay={220}>
          <p className="font-satoshi mt-8 max-w-[52ch] text-[clamp(1rem,1.4vw,1.18rem)] leading-[1.7]" style={{ color: MUTED }}>
            Bobby Fischer broke a Soviet hold on the world crown that had stood since 1948 — in a hall in Reykjavík, in the
            summer of 1972. He died an Icelandic citizen, and lies in a small churchyard at Laugardælir, near Selfoss, where
            this museum keeps his memory.
          </p>
        </Reveal>
        <Reveal delay={300}>
          <p className="font-satoshi mt-9 max-w-[46ch] text-[15px] leading-[1.65]" style={{ color: INK }}>
            Open daily this summer — come and play a game where the Match of the Century is kept.
          </p>
        </Reveal>
        <Reveal delay={360}>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              onClick={() => scrollToId('visit')}
              className="fc-cta inline-flex min-h-[46px] items-center gap-2 rounded-[2px] px-6 py-3 font-mono text-[13px] tracking-[0.08em] transition-transform"
              style={{ background: ACCENT, color: GROUND }}
            >
              PLAN YOUR VISIT <span aria-hidden>↑</span>
            </button>
            <a
              href={`tel:${FACTS.phoneHref}`}
              className="fc-ghost inline-flex min-h-[46px] items-center gap-2 rounded-[2px] px-6 py-3 font-mono text-[13px] tracking-[0.08em] transition-colors"
              style={{ border: `1px solid ${HAIR}`, color: INK }}
            >
              {FACTS.phone}
            </a>
          </div>
        </Reveal>
        <Reveal delay={420}>
          <div className="mt-12 font-mono text-[12px] tracking-[0.16em]" style={{ color: MUTED }}>
            BOBBY FISCHER &nbsp;—&nbsp; 1943–2008 &nbsp;—&nbsp; <span style={{ color: INK }}>ICELANDIC CITIZEN</span> &nbsp;—&nbsp; LAUGARDÆLIR
          </div>
        </Reveal>
        <div className="mt-4 font-mono text-[10px] tracking-[0.1em]" style={{ color: MUTED }}>
          Closing image indicative.
        </div>
      </div>

      {/* footer proper — hairline-divided */}
      <div className="relative border-t" style={{ borderColor: HAIR }}>
        <div className="mx-auto grid max-w-[1240px] gap-8 px-6 py-12 md:grid-cols-4">
          <div className="font-clash text-[1.4rem] font-[600] tracking-[-0.01em]" style={{ color: INK }}>
            FISCHERSETUR
          </div>
          <FooterCol label="VISIT">
            {FACTS.address}
            <br />
            {FACTS.season} · {FACTS.hours}
          </FooterCol>
          <FooterCol label="CONTACT">
            <a href={`mailto:${FACTS.email}`} className="hover:opacity-80" style={{ color: 'inherit' }}>
              {FACTS.email}
            </a>
            <br />
            <a href={`tel:${FACTS.phoneHref}`} className="hover:opacity-80" style={{ color: 'inherit' }}>
              {FACTS.phone}
            </a>
          </FooterCol>
          <FooterCol label="ONLINE">
            FISCHERSETUR.IS
            <br />
            <span style={{ color: MUTED }}>Selfoss · South Iceland</span>
          </FooterCol>
        </div>
        <div className="mx-auto max-w-[1240px] px-6 pb-10">
          <p className="font-mono text-[10.5px] leading-[1.6] tracking-[0.04em]" style={{ color: MUTED, opacity: 0.8 }}>
            Concept preview. The move replay is a reconstruction of the documented 1972 Fischer–Spassky games (Reykjavík);
            clock readouts shown are illustrative sample tempo. No awards, ratings, or reviews are shown — none are published.
          </p>
        </div>
      </div>
    </section>
  )
}

function FooterCol({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="font-mono mb-3 text-[11px] uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
        {label}
      </div>
      <div className="font-satoshi text-[14px] leading-[1.7]" style={{ color: INK }}>
        {children}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  PAGE                                                                        */
/* ══════════════════════════════════════════════════════════════════════════ */
export default function FischerseturPage() {
  const heroSentinel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    document.title = 'Bobby Fischer Center · Fischersetur, Selfoss'
    setThemeColor(GROUND)
    return () => setThemeColor('#0a1320')
  }, [])

  return (
    <div className="font-satoshi" style={{ background: GROUND, color: INK }}>
      <style>{`
        #fc-root ::selection { background:${ACCENT}; color:${GROUND}; }
        .fc-setup { opacity:1; }
        .fc-movecard { min-height:160px; }
        @media (min-width:768px) { .fc-movecard { min-height:230px; } }
        @media (prefers-reduced-motion: no-preference) {
          .fc-setup { animation: fc-drop .9s cubic-bezier(.2,.8,.2,1) both; }
          @keyframes fc-drop { from { opacity:0; transform:translateY(-10px) scale(.99); } to { opacity:1; transform:none; } }
          .fc-marquee { display:inline-block; animation: fc-marq 38s linear infinite; }
          @keyframes fc-marq { from { transform:translateX(0); } to { transform:translateX(-50%); } }
          .fc-card-in { animation: fc-card .4s cubic-bezier(.2,.8,.2,1) both; }
          @keyframes fc-card { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
          .fc-cta:hover { transform:translateY(-2px); }
          .fc-cta:active { transform:translateY(0); }
          .fc-ghost:hover { border-color:${ACCENT} !important; color:${ACCENT}; }
          .fc-tick { animation: fc-tick 2.4s ease-in-out infinite; transform-origin:top; }
          @keyframes fc-tick { 0%,100% { transform:scaleY(.4); opacity:.4; } 50% { transform:scaleY(1); opacity:1; } }
          .fc-tile-img { transition: filter .5s ease, transform .6s cubic-bezier(.2,.8,.2,1); }
          .fc-tile:hover .fc-tile-img { filter:grayscale(.25) contrast(1.06) brightness(.96) !important; transform:scale(1.04); }
          .fc-cap { transition: transform .35s cubic-bezier(.2,.8,.2,1); }
          .fc-tile:hover .fc-cap { transform:translateY(-6px); }
          .fc-rule { transition: width .35s ease; }
          .fc-tile:hover .fc-rule { width:1.75rem; }
          .fc-pair:hover { transform:translateX(4px); }
        }
        .fc-cta:focus-visible, .fc-ghost:focus-visible { outline:2px solid ${INK}; outline-offset:2px; }
        #fc-root a:focus-visible, #fc-root button:focus-visible { outline:2px solid ${ACCENT}; outline-offset:2px; border-radius:2px; }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior:auto; }
          .fc-tile-img { filter:grayscale(1) contrast(1.06) brightness(.92) !important; }
        }
        html { scroll-behavior:smooth; }
      `}</style>
      <div id="fc-root">
        <PreviewChrome company={company} />
        <PartialPrototypeBanner />
        <StickyNav sentinel={heroSentinel} />
        <main>
          <Hero sentinel={heroSentinel} />
          <ContextBand />
          <MatchReplay />
          <Inside />
          <Timeline />
          <Visit />
          <Faq />
          <Closer />
        </main>
        <PreviewFooter company={company} />
      </div>
    </div>
  )
}
