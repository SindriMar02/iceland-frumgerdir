import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, FormEvent, ReactNode } from 'react'
import Lenis from 'lenis'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  ADDRESS,
  CLOSE_MIN,
  CLOSING,
  DISCLAIMER,
  EMAIL,
  FIND,
  HERO,
  IMG,
  LANTERN,
  MAPS_URL,
  MENU,
  NAV,
  OPEN_MIN,
  PHONE,
  PHONE_HREF,
  RESERVE,
  REVIEWS,
  SOUP,
  STORY,
} from './data'

const company = getPreviewCompany('naustid')

/* ══════════════════════════════════════════════════════════════════════════
 * BÁRUJÁRN — the corrugated-iron elevation.
 *
 * CONCEPT: Naustið lives in a 1931 timber house clad in vertical bárujárn.
 * Every rib on that yellow façade is a line of light and a line of shadow.
 * That rib IS the page: photographs arrive as vertical yellow ribs on
 * harbour ink and resolve into the real photograph as you scroll. Rules,
 * dividers and the lit window are all the same rib at different scales.
 *
 * PALETTE — sampled from the client's own exterior photograph, not chosen:
 *   sunlit paint #FAE67A · body #C0A632 · shadow #8E7207 · sign black
 *   #150503 · window trim #CFE9EA. Those become RIB / RIB_DEEP / DEEP / BONE.
 *
 * TYPE — measured off the reference (sondaven.com, SOTD 5 Jun 2026):
 *   display all-caps, tracking −0.035em, leading .88 single / 1.04 multi
 *   (looser than the reference's .83 because Icelandic Á/Í/Ó/Ú/Ý collide
 *   at that leading — ledger #23); micro-labels 11px / +0.09em uppercase.
 *   No box-shadows anywhere. No card rounding. Pills only on CTAs.
 *
 * HONESTY — the six Unsplash atmosphere images are gone. This page uses
 * only the restaurant's own four photographs; everything else is drawn.
 * ══════════════════════════════════════════════════════════════════════ */

const DEEP = '#12171B' /* harbour ink — the page ground */
const DEEP_2 = '#0C1013' /* one step darker, for inset panels */
const RIB = '#E3B81F' /* the house yellow — accent AND raster colour */
const BONE = '#D8DEDD' /* the window trim, cooled */
const BONE_SOFT = 'rgba(216,222,221,.72)'
/* .52 measured 4.41:1 — under the 4.5 floor across 48 elements, the classic
 * one-token-many-labels failure. Lifted to .60 = 5.21:1 and re-measured. */
const BONE_MUTE = 'rgba(216,222,221,.60)'
const HAIR = 'rgba(216,222,221,.16)'
const HAIR_RIB = 'rgba(227,184,31,.34)'

/* Computed against DEEP #12171B (relative luminance .0082):
 *   RIB  9.57:1 AAA · BONE 13.24:1 AAA · BONE_SOFT 8.06:1 · BONE_MUTE 5.21:1
 *   DEEP on RIB 9.57:1 AAA (dark ink on the yellow band)                    */

const EASE = 'cubic-bezier(.22,.61,.21,1)'
const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E3B81F]'

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const goTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' })

/* ── useInViewOnce — IO on an UNTRANSFORMED wrapper (ledger #7), failsafe
 * gated by viewport position so below-fold choreography survives (#25). ── */
function useInViewOnce(threshold = 0.18) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
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
      { threshold, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    const t = window.setTimeout(() => {
      const r2 = el.getBoundingClientRect()
      if (r2.top < window.innerHeight) setShown(true)
    }, 1600)
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [threshold])
  return { ref, shown }
}

/* ── Reveal — rise + de-blur. NO overflow clip masks anywhere on this page:
 * Icelandic Í/Á/Ó acutes sit above the cap and masks guillotine them. ───── */
function Reveal({
  children,
  delay = 0,
  y = 18,
  className = '',
  style,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  style?: CSSProperties
  as?: 'div' | 'figure' | 'li' | 'p'
}) {
  const { ref, shown } = useInViewOnce(0.2)
  const reduced = useReducedMotion()
  const Tag = as
  const on = shown || !!reduced
  return (
    <Tag
      ref={ref as never}
      className={className}
      style={
        reduced
          ? style
          : {
              ...style,
              opacity: on ? 1 : 0,
              transform: on ? 'none' : `translateY(${y}px)`,
              filter: on ? 'blur(0px)' : 'blur(7px)',
              transition: `opacity .72s ${EASE} ${delay}ms, transform .72s ${EASE} ${delay}ms, filter .72s ${EASE} ${delay}ms`,
            }
      }
    >
      {children}
    </Tag>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
 *  THE SIGNATURE — RibRaster
 *
 *  A photograph redrawn as vertical corrugated ribs: for every rib column we
 *  walk down the image and draw a segment whose WIDTH tracks that pixel's
 *  luminance, in house yellow on harbour ink. Bright paint = a fat rib, deep
 *  shadow = a hairline. The result is the façade's own cladding rendered as
 *  a halftone.
 *
 *  Drawn ONCE per size (never per scroll frame — 60k rects/frame would drop
 *  us to single-digit fps). The scroll morph is a crossfade + counter-scale
 *  between this canvas and the real photograph underneath, which is cheap,
 *  compositor-only, and REVERSIBLE (scroll back up and the ribs return —
 *  that reversibility is what proves it is scrubbed and not a one-shot,
 *  ledger #50).
 * ══════════════════════════════════════════════════════════════════════ */
function drawRibs(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  opts: { ribGap?: number; rowStep?: number; gamma?: number; minW?: number; ground?: string } = {},
) {
  /* gamma < 1 lifts the mid-tones: at 1.15 the ribs crushed to near-black
   * everywhere the façade was in shadow and the raster read as a dark smear.
   * 0.78 keeps the shadow side thin but visible, which is what makes the
   * corrugation legible rather than murky. */
  const { ribGap = 7, rowStep = 3, gamma = 0.78, minW = 0.5, ground = 'transparent' } = opts
  const rect = canvas.getBoundingClientRect()
  const w = Math.max(1, Math.round(rect.width))
  const h = Math.max(1, Math.round(rect.height))
  if (!img.naturalWidth || !img.naturalHeight) return false
  const dpr = Math.min(window.devicePixelRatio || 1, 1.6)
  canvas.width = Math.round(w * dpr)
  canvas.height = Math.round(h * dpr)
  const ctx = canvas.getContext('2d')
  if (!ctx) return false
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, w, h)
  if (ground !== 'transparent') {
    ctx.fillStyle = ground
    ctx.fillRect(0, 0, w, h)
  }

  /* Rect count is (w/ribGap) x (h/rowStep) and it is the whole cost of a
   * raster. At phone width the hero was ~35k rects and showed up as a 496ms
   * long task on a 4x-throttled CPU. Coarsening the vertical step on small
   * canvases cuts that by a third; at 390px the ribs are ~2px apart on screen
   * and the difference is not visible. */
  const step = w < 500 ? rowStep + 1 : rowStep
  const cols = Math.max(2, Math.floor(w / ribGap))
  const rows = Math.max(2, Math.floor(h / step))

  /* Sample the photo once at rib resolution, cover-fitting like object-cover
   * so the raster frames the same crop the real photograph does. */
  const buf = document.createElement('canvas')
  buf.width = cols
  buf.height = rows
  const bctx = buf.getContext('2d', { willReadFrequently: true })
  if (!bctx) return false
  const scale = Math.max(cols / img.naturalWidth, rows / img.naturalHeight)
  const dw = img.naturalWidth * scale
  const dh = img.naturalHeight * scale
  bctx.drawImage(img, (cols - dw) / 2, (rows - dh) / 2, dw, dh)
  let data: Uint8ClampedArray
  try {
    data = bctx.getImageData(0, 0, cols, rows).data
  } catch {
    return false /* tainted canvas — caller keeps the plain photograph */
  }

  ctx.fillStyle = RIB
  const maxW = ribGap - 1
  for (let c = 0; c < cols; c++) {
    const cx = (c + 0.5) * ribGap
    for (let r = 0; r < rows; r++) {
      const i = (r * cols + c) * 4
      /* Rec. 709 luma, then gamma to push the mid-tones apart so the ribs
       * read as corrugation rather than as an even grey field. */
      const lum = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255
      const t = Math.pow(lum, gamma)
      const bw = minW + t * (maxW - minW)
      ctx.fillRect(cx - bw / 2, r * step, bw, step + 0.35)
    }
  }
  return true
}

/* The two ways a raster can resolve:
 *  · `reveal` (a number)         — one-shot, eased by a CSS transition
 *  · `scrub`  (a MotionValue)    — tied to scroll, written straight to the
 *                                  elements every frame with NO transition
 * Mixing them is the bug this split exists to prevent: a CSS transition on a
 * scroll-scrubbed property restarts on every scroll step, so the raster both
 * lags the finger and pins the compositor (measured p95 199ms / worst 383ms
 * on a throttled phone before this was separated). Ledger #19. */
function RibRaster({
  src,
  srcSet: imgSrcSet,
  webp,
  sizes,
  alt,
  className = '',
  ribGap = 7,
  rowStep = 3,
  /* 0 = pure ribs, 1 = the real photograph */
  reveal = 0,
  scrub,
  eager = false,
  objectPosition,
}: {
  src: string
  srcSet?: string
  webp?: string
  sizes?: string
  alt: string
  className?: string
  ribGap?: number
  rowStep?: number
  reveal?: number
  scrub?: MotionValue<number>
  eager?: boolean
  objectPosition?: string
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [ok, setOk] = useState(false)
  const [broken, setBroken] = useState(false)
  const okRef = useRef(false)

  const paint = useCallback(() => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return
    const drew = drawRibs(canvas, img, { ribGap, rowStep })
    okRef.current = drew
    setOk(drew)
  }, [ribGap, rowStep])

  /* Scrubbed path: one subscriber, direct style writes, zero React renders
   * per frame. Only opacity and transform are touched, so this stays on the
   * compositor. */
  useEffect(() => {
    if (!scrub) return
    const write = (v: number) => {
      const canvas = canvasRef.current
      const img = imgRef.current
      if (!canvas || !img) return
      const r = v < 0 ? 0 : v > 1 ? 1 : v
      const live = okRef.current
      canvas.style.opacity = String(live ? 1 - r : 0)
      canvas.style.transform = `scale(${1 + r * 0.03})`
      img.style.opacity = String(live ? r : 1)
      if (live) img.style.transform = `scale(${1.06 - r * 0.06})`
    }
    write(scrub.get())
    return scrub.on('change', write)
  }, [scrub, ok])

  useLayoutEffect(() => {
    const img = imgRef.current
    const host = hostRef.current
    if (!img || !host) return
    let raf = 0
    const schedule = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(paint)
    }
    /* A cached image fires no load event, so paint from whatever is already
     * decoded AND again on load — the cached-image trap from the WebGL
     * image-effect notes, which silently leaves the canvas empty. */
    if (img.complete) schedule()
    img.addEventListener('load', schedule)
    const ro = new ResizeObserver(schedule)
    ro.observe(host)
    return () => {
      cancelAnimationFrame(raf)
      img.removeEventListener('load', schedule)
      ro.disconnect()
    }
  }, [paint])

  const r = Math.min(1, Math.max(0, reveal))
  /* When scrubbed, the effect above owns opacity/transform — React must not
   * also write them, or it would fight the subscriber on every render. */
  const s = !!scrub
  return (
    <div
      ref={hostRef}
      className={`na-raster relative overflow-hidden ${className}`}
      data-scrub={s ? '' : undefined}
      style={{ background: DEEP_2 }}
    >
      {/* A plain <img>: this component needs a real ref to sample pixels from,
       * and the shared Img wrapper does not forward one. <picture> serves the
       * WebP ladder with the original JPEG as the fallback rung. */}
      <picture>
        {webp && <source type="image/webp" srcSet={webp} sizes={sizes} />}
        <img
        ref={imgRef}
        src={src}
        srcSet={imgSrcSet}
        sizes={sizes}
        alt={broken ? '' : alt}
        role={broken && alt ? 'img' : undefined}
        aria-label={broken && alt ? alt : undefined}
        decoding="async"
        loading={eager ? 'eager' : 'lazy'}
        {...(eager ? { fetchpriority: 'high' as const } : {})}
        onError={() => setBroken(true)}
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          objectPosition,
          transformOrigin: 'center',
          /* When the raster could not be drawn the photograph simply stays
           * visible — never a blank panel. */
          ...(s ? null : { opacity: broken ? 0 : ok ? r : 1, transform: ok ? `scale(${1.06 - r * 0.06})` : undefined }),
          ...(broken ? { opacity: 0 } : null),
        }}
        />
      </picture>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 h-full w-full"
        style={{
          transformOrigin: 'center',
          pointerEvents: 'none',
          ...(s ? null : { opacity: ok && !broken ? 1 - r : 0, transform: `scale(${1 + r * 0.03})` }),
          ...(broken ? { opacity: 0 } : null),
        }}
      />
    </div>
  )
}

/* A RibRaster that resolves itself once as it enters the viewport, for the
 * sections that are not scroll-scrubbed. */
function RibReveal({
  delay = 0,
  ...rest
}: Omit<Parameters<typeof RibRaster>[0], 'reveal' | 'scrub'> & { delay?: number }) {
  const { ref, shown } = useInViewOnce(0.16)
  const reduced = useReducedMotion()
  const [r, setR] = useState(0)
  useEffect(() => {
    if (reduced) {
      setR(1)
      return
    }
    if (!shown) return
    const t = window.setTimeout(() => setR(1), delay + 220)
    return () => window.clearTimeout(t)
  }, [shown, reduced, delay])
  return (
    <div ref={ref}>
      <RibRaster reveal={r} {...rest} />
    </div>
  )
}

/* ── Rib rule — the hairline, redrawn as corrugation. Pure CSS. ─────────── */
function RibRule({ className = '', tone = 'bone' }: { className?: string; tone?: 'bone' | 'rib' }) {
  return (
    <div
      aria-hidden
      className={`na-ribrule h-[10px] w-full ${className}`}
      style={{
        backgroundImage: `repeating-linear-gradient(90deg, ${
          tone === 'rib' ? HAIR_RIB : HAIR
        } 0 1px, transparent 1px 7px)`,
      }}
    />
  )
}

/* ── Label — the reference's micro-label: 11px, +0.09em, uppercase. ─────── */
function Label({
  children,
  color = RIB,
  className = '',
  as = 'p',
}: {
  children: ReactNode
  color?: string
  className?: string
  as?: 'p' | 'span' | 'h3'
}) {
  const Tag = as
  /* 12px on phones, 11px from sm up. The reference sets these at 10px, but it
   * is a desktop-first site — at 390px, 41 of these were the page's dominant
   * text style and 11px reads as fine print rather than as a label. */
  return (
    <Tag
      className={`font-mono text-[12px] uppercase leading-[1.5] tracking-[0.09em] sm:text-[11px] ${className}`}
      style={{ color }}
    >
      {children}
    </Tag>
  )
}

/* ── Display type. `lines` loosens the leading so a second line's Á/Í acute
 * never lands on the line above (ledger #23). ──────────────────────────── */
const display = (size: string, lines: 1 | 2 = 1, color: string = BONE): CSSProperties => ({
  color,
  fontSize: size,
  lineHeight: lines === 1 ? 0.9 : 1.04,
  letterSpacing: '-0.035em',
  textTransform: 'uppercase',
  fontWeight: 600,
})

/* ── The fish mark — a vector cut of the silhouette on Naustið's own black
 * facade sign (white fish + lowercase wordmark), not an invented logo. ─── */
/* `eye` must match whatever the mark sits ON — it is a hole punched through
 * the fish, not a dot. Defaults to the page ground; pass RIB on the yellow. */
function FishMark({ size = 34, color = BONE, eye = DEEP }: { size?: number; color?: string; eye?: string }) {
  return (
    <svg width={size} height={(size * 30) / 68} viewBox="0 0 68 30" aria-hidden fill="none">
      <path
        d="M2 15C11 5.5 27 2.5 41.5 9.5L60 3.5c-3.2 3.8-4.6 7.7-4.6 11.5s1.4 7.7 4.6 11.5l-18.5-6C27 27.5 11 24.5 2 15Z"
        fill={color}
      />
      <circle cx="11.5" cy="13.6" r="1.7" fill={eye} />
    </svg>
  )
}

/* ── Live open/closed against the verified daily hours, Iceland time ─────── */
function isOpenNow(): boolean {
  try {
    const hm = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Atlantic/Reykjavik',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).format(new Date())
    const [h, m] = hm.split(':').map(Number)
    const mins = h * 60 + m
    return mins >= OPEN_MIN && mins < CLOSE_MIN
  } catch {
    return true
  }
}
function useOpenNow() {
  const [open, setOpen] = useState(isOpenNow)
  useEffect(() => {
    const t = window.setInterval(() => setOpen(isOpenNow()), 60_000)
    return () => window.clearInterval(t)
  }, [])
  return open
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  NAV — ink over the hero, ink-solid once scrolled. Rib rule underneath.  */
/* ══════════════════════════════════════════════════════════════════════ */
function TopNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])
  const solid = scrolled || menuOpen
  const go = (id: string) => {
    setMenuOpen(false)
    goTo(id)
  }
  return (
    <nav
      aria-label="Aðalvalmynd"
      className="fixed inset-x-0 top-0 z-40"
      style={{
        background: solid ? 'rgba(18,23,27,.94)' : 'transparent',
        backdropFilter: solid ? 'blur(10px)' : undefined,
        WebkitBackdropFilter: solid ? 'blur(10px)' : undefined,
        transition: 'background-color .35s ease',
      }}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-3.5 md:px-10">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' })}
          className={`-my-2 flex min-h-[44px] items-center gap-2.5 py-2 ${FOCUS}`}
          aria-label="Naustið, efst á síðu"
        >
          <FishMark size={28} color={RIB} />
          <span
            className="font-display text-[17px] font-semibold uppercase leading-none tracking-[-0.02em]"
            style={{ color: BONE }}
          >
            Naustið
          </span>
        </button>

        <div className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className={`na-navlink font-mono text-[11px] uppercase tracking-[0.09em] ${FOCUS}`}
              style={{ color: BONE_SOFT }}
            >
              {n.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-5 lg:flex">
          <a
            href={PHONE_HREF}
            className={`font-mono text-[11px] uppercase tracking-[0.09em] ${FOCUS}`}
            style={{ color: BONE_SOFT }}
          >
            {PHONE}
          </a>
          <button
            onClick={() => go('panta')}
            className={`na-pill inline-flex min-h-[38px] items-center rounded-full border px-5 font-mono text-[11px] uppercase tracking-[0.09em] ${FOCUS}`}
            style={{ borderColor: HAIR_RIB, color: RIB }}
          >
            Panta borð
          </button>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Loka valmynd' : 'Opna valmynd'}
          className={`grid h-11 w-11 place-items-center lg:hidden ${FOCUS}`}
          style={{ color: BONE }}
        >
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden>
            {menuOpen ? (
              <path d="M1 1l18 12M19 1 1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            ) : (
              <path d="M0 1h20M0 7h20M0 13h20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>
      {solid && <RibRule tone="rib" className="h-[6px]" />}

      {menuOpen && (
        <div className="px-5 pb-7 pt-1 lg:hidden" style={{ background: DEEP }}>
          <div className="flex flex-col">
            {NAV.map((n, i) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className={`na-mlink py-4 text-left font-display text-[26px] font-semibold uppercase leading-none tracking-[-0.03em] ${FOCUS}`}
                style={{ color: BONE, animationDelay: `${60 + i * 55}ms` }}
              >
                {n.label}
              </button>
            ))}
          </div>
          <RibRule tone="rib" className="mt-3" />
          <div className="mt-4 flex items-center justify-between gap-3">
            <a href={PHONE_HREF} className={`inline-flex min-h-[44px] items-center font-mono text-[15px] ${FOCUS}`} style={{ color: RIB }}>
              {PHONE}
            </a>
            <button
              onClick={() => go('panta')}
              className={`inline-flex min-h-[44px] items-center rounded-full px-6 font-mono text-[11px] uppercase tracking-[0.09em] ${FOCUS}`}
              style={{ background: RIB, color: DEEP }}
            >
              Panta borð
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  1 · HERO — the house arrives out of its own cladding.                   */
/*  A 240vh band. The sticky stage holds the exterior photograph rendered   */
/*  entirely as vertical yellow ribs; scrolling resolves the ribs into the  */
/*  real photograph while the wordmark rises off the horizon. Ordinary      */
/*  scroll, never locked. Every scrubbed property is a raw MotionValue.     */
/* ══════════════════════════════════════════════════════════════════════ */
function Hero() {
  const reduced = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  /* rAF is PAUSED in a hidden tab, so a page opened in the background (ctrl
   * click, session restore, a screenshot service) would never flip `mounted`
   * and the whole headline would sit at opacity 0. Timers still run when
   * hidden, so a setTimeout failsafe guarantees the entrance resolves — the
   * same guard useInViewOnce already carries. */
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true))
    const t = window.setTimeout(() => setMounted(true), 400)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(t)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end end'] })
  const houseScale = useTransform(scrollYProgress, [0, 1], [1.16, 1])
  const textOpacity = useTransform(scrollYProgress, [0, 0.34], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.34], [0, -70])
  const markY = useTransform(scrollYProgress, [0, 1], ['0%', '-16%'])
  /* The reading scrim lifts as the headline leaves. Held opaque enough for
   * the copy while it is there, then out of the way so the house is actually
   * seen — a static scrim crushed the resolved photograph into mud. */
  const scrimOpacity = useTransform(scrollYProgress, [0, 0.3, 0.62], [1, 0.94, 0.34])
  /* The ribs resolve as a MotionValue, not React state: a state update per
   * scroll step re-rendered the whole hero subtree ~40x per pass for nothing. */
  const heroReveal = useTransform(scrollYProgress, [0.06, 0.52], [0, 1], { clamp: true })

  const stagger = (i: number): CSSProperties =>
    reduced
      ? {}
      : {
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'none' : 'translateY(22px)',
          filter: mounted ? 'blur(0px)' : 'blur(8px)',
          transition: `opacity .8s ${EASE} ${180 + i * 110}ms, transform .8s ${EASE} ${180 + i * 110}ms, filter .8s ${EASE} ${180 + i * 110}ms`,
        }

  const headline = (
    <>
      <Label className="!tracking-[0.14em]" color={RIB}>
        <span style={stagger(0)} className="inline-block">
          {HERO.eyebrow}
        </span>
      </Label>
      {/* The wordmark, set as the sign is set: the name, then the place.
          Two accented lines, so the leading stays at 1.04. */}
      <h1 className="mt-6 font-display" style={display('clamp(2.9rem,8.4vw,7.4rem)', 2)}>
        <span className="block" style={stagger(1)}>
          {HERO.h1a}
        </span>{' '}
        <span className="block" style={{ ...stagger(2), color: RIB }}>
          {HERO.h1b}
        </span>
      </h1>
      <p className="mt-7 max-w-[46ch] font-sans text-[15.5px] leading-[1.68]" style={{ ...stagger(3), color: BONE_SOFT }}>
        {HERO.sub}
      </p>
      <div className="mt-7 max-w-[520px]" style={stagger(4)}>
        <RibRule tone="rib" />
        <Label className="mt-3" color={BONE_MUTE}>
          {HERO.hoursLine}
        </Label>
      </div>
      <div className="mt-9 flex flex-wrap items-center gap-3.5" style={stagger(5)}>
        <a
          href={PHONE_HREF}
          className={`na-cta inline-flex min-h-[52px] items-center rounded-full px-8 font-mono text-[11.5px] uppercase tracking-[0.09em] ${FOCUS}`}
          style={{ background: RIB, color: DEEP }}
        >
          {HERO.ctaCall}
        </a>
        <button
          onClick={() => goTo('panta')}
          className={`na-pill inline-flex min-h-[52px] items-center rounded-full border px-8 font-mono text-[11.5px] uppercase tracking-[0.09em] ${FOCUS}`}
          style={{ borderColor: 'rgba(216,222,221,.34)', color: BONE }}
        >
          {HERO.ctaTable}
        </button>
      </div>
    </>
  )

  /* Reduced motion: one calm viewport, the real photograph, nothing moving. */
  if (reduced) {
    return (
      <header className="relative" style={{ background: DEEP }}>
        <div className="relative min-h-[100svh] overflow-hidden">
          {/* Native <picture> rather than the shared Img wrapper: reduced-motion
              visitors should get the WebP ladder too, and the wrapper has no
              <source> support. */}
          <picture>
            <source type="image/webp" srcSet={IMG.exteriorWebp} sizes="100vw" />
            <img
              src={IMG.exterior}
              srcSet={IMG.exteriorSrcSet}
              sizes="100vw"
              alt={HERO.houseAlt}
              {...{ fetchpriority: 'high' }}
              loading="eager"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: '58% 42%' }}
            />
          </picture>
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(100deg, rgba(18,23,27,.94) 0%, rgba(18,23,27,.82) 46%, rgba(18,23,27,.44) 100%)' }}
            aria-hidden
          />
          <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1500px] flex-col justify-center px-5 pb-24 pt-28 md:px-10">
            <div className="max-w-[720px]">{headline}</div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="relative" style={{ background: DEEP }}>
      <div ref={wrapRef} className="relative h-[240vh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <motion.div className="absolute inset-0" style={{ scale: houseScale }}>
            <RibRaster
              src={IMG.exterior}
              srcSet={IMG.exteriorSrcSet}
              webp={IMG.exteriorWebp}
              sizes="100vw"
              alt={HERO.houseAlt}
              className="h-full w-full"
              objectPosition="58% 42%"
              ribGap={8}
              rowStep={3}
              scrub={heroReveal}
              eager
            />
          </motion.div>
          {/* Reading scrim — measured against the worst backdrop pixel, so the
              headline holds whether the ribs or the photograph are showing. */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: scrimOpacity,
              background: 'linear-gradient(100deg, rgba(18,23,27,.94) 0%, rgba(18,23,27,.8) 46%, rgba(18,23,27,.26) 100%)',
            }}
            aria-hidden
          />

          <motion.div className="absolute inset-x-0 bottom-0 z-10" style={{ y: markY }} aria-hidden>
            <RibRule tone="rib" className="h-[14px] opacity-70" />
          </motion.div>
        </div>

        <motion.div
          className="absolute inset-x-0 top-0 z-10 flex h-[100svh] items-center"
          style={{ opacity: textOpacity, y: textY }}
        >
          <div className="mx-auto w-full max-w-[1500px] px-5 pt-12 md:px-10">
            <div className="max-w-[720px]">{headline}</div>
          </div>
        </motion.div>
      </div>
    </header>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  Section head — the reference's rule + label left, ordinal right.        */
/* ══════════════════════════════════════════════════════════════════════ */
function SectionHead({ label, n }: { label: string; n: string }) {
  return (
    <Reveal>
      <RibRule tone="rib" />
      <div className="mt-3 flex items-baseline justify-between gap-6">
        <Label color={RIB}>{label}</Label>
        <Label color={BONE_MUTE}>({n})</Label>
      </div>
    </Reveal>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  2 · SOUP — the door opens onto the signature dish                       */
/* ══════════════════════════════════════════════════════════════════════ */
function SoupSection() {
  return (
    <section id="supan" style={{ background: DEEP }} className="py-[clamp(84px,11vw,152px)]">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <SectionHead label={SOUP.eyebrow} n="01" />
        <div className="mt-12 grid items-start gap-x-16 gap-y-12 lg:grid-cols-[1fr_0.92fr]">
          <div>
            <Reveal delay={80}>
              <h2 className="font-display" style={display('clamp(2.4rem,5.4vw,4.6rem)', 2)}>
                {SOUP.heading}
              </h2>
            </Reveal>
            <Reveal delay={150} as="p" className="mt-8 max-w-[50ch] font-sans text-[16px] leading-[1.72]" style={{ color: BONE_SOFT }}>
              {SOUP.body1}
            </Reveal>
            <Reveal delay={200} as="p" className="mt-4 max-w-[50ch] font-sans text-[15px] leading-[1.72]" style={{ color: BONE_MUTE }}>
              {SOUP.body2}
            </Reveal>

            {/* The quote, set as a rib-ruled interruption rather than a card. */}
            <Reveal delay={260}>
              <figure className="m-0 mt-11">
                <RibRule />
                <blockquote className="mt-5 font-display" style={display('clamp(1.35rem,2.5vw,2rem)', 2, BONE)}>
                  “{SOUP.quote}”
                </blockquote>
                <figcaption className="mt-4">
                  <Label color={BONE_MUTE}>
                    {SOUP.quoteName} · {SOUP.quoteSource}
                  </Label>
                </figcaption>
              </figure>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-11">
                <RibRule tone="rib" />
                <Label className="mt-4" color={BONE_MUTE}>
                  {SOUP.priceLabel}
                </Label>
                <p className="mt-2 font-display tabular-nums" style={display('clamp(1.9rem,3.6vw,2.9rem)', 1, RIB)}>
                  {SOUP.priceValue}
                </p>
                <p className="mt-3 max-w-[44ch] font-sans text-[12.5px] leading-[1.6]" style={{ color: BONE_MUTE }}>
                  {SOUP.priceNote}
                </p>
              </div>
            </Reveal>
          </div>

          {/* Sticky: the left column runs much longer, and letting the photo
              travel with it closes a ~200px void at the fold. */}
          <figure className="m-0 lg:sticky lg:top-28">
            <RibReveal
              src={IMG.soup}
              webp={IMG.soupWebp}
              sizes="(max-width:1024px) 92vw, 44vw"
              alt={SOUP.imgAlt}
              className="aspect-[4/5] w-full"
              ribGap={6}
              rowStep={3}
              delay={140}
            />
            <figcaption className="mt-4">
              <Label color={BONE_MUTE}>Fiskisúpan á útiborði fyrir framan húsið · Mynd staðarins</Label>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  3 · MENU — the day's placard, real dishes, honest small print.          */
/*  No prices: Naustið publishes none, so the menu is typographic (the      */
/*  Monte pattern from Mobbin), not a price list we would have to invent.   */
/* ══════════════════════════════════════════════════════════════════════ */
function MenuSection() {
  return (
    <section id="matsedill" style={{ background: DEEP }} className="pb-[clamp(84px,11vw,152px)]">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <SectionHead label="Matseðill" n="02" />
        <div className="mt-12 grid gap-x-16 gap-y-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Reveal delay={60}>
              <h2 className="font-display" style={display('clamp(2.2rem,4.6vw,3.8rem)', 2)}>
                {MENU.heading}
              </h2>
            </Reveal>
            <Reveal delay={120} as="p" className="mt-7 max-w-[46ch] font-sans text-[15.5px] leading-[1.72]" style={{ color: BONE_SOFT }}>
              {MENU.intro}
            </Reveal>
            <Reveal delay={180}>
              <figure className="m-0 mt-10">
                <RibReveal src={IMG.salmon} webp={IMG.salmonWebp} sizes="(max-width:1024px) 92vw, 44vw" alt={MENU.imgAlt} className="aspect-[5/4] w-full" ribGap={6} rowStep={3} delay={120} />
                <figcaption className="mt-4">
                  <Label color={BONE_MUTE}>Grillaður lax af matseðlinum · Mynd staðarins</Label>
                </figcaption>
              </figure>
            </Reveal>
          </div>

          <div>
            {MENU.groups.map((g, gi) => (
              <div key={g.title} className={gi === 0 ? '' : 'mt-14'}>
                <RibRule tone="rib" />
                <Label className="mt-3" color={RIB} as="h3">
                  {g.title}
                </Label>
                <ul className="mt-5 list-none p-0">
                  {g.items.map((it, i) => (
                    <Reveal as="li" key={it.name} delay={40 + i * 45} y={10} className="na-dish py-4" style={{ borderTop: i === 0 ? 'none' : `1px solid ${HAIR}` }}>
                      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                        <span className="font-display" style={display('clamp(1.15rem,2vw,1.6rem)', 1, BONE)}>
                          {it.name}
                        </span>
                        <span className="font-sans text-[13.5px] leading-snug" style={{ color: BONE_MUTE }}>
                          {it.note}
                        </span>
                      </div>
                    </Reveal>
                  ))}
                </ul>
              </div>
            ))}
            <Reveal delay={220}>
              <div className="mt-12">
                <RibRule />
                <p className="mt-4 max-w-[58ch] font-sans text-[13px] leading-[1.7]" style={{ color: BONE_MUTE }}>
                  {MENU.smallPrint}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  4 · THE CLADDING BAND — full-bleed, the façade as pure corrugation.     */
/*  Replaces the old stock-rope divider: same job, but it is the actual     */
/*  building and it belongs to the client.                                  */
/* ══════════════════════════════════════════════════════════════════════ */
function CladdingBand() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  /* Resolves through the middle of its own pass and returns to ribs on the
   * way out — reversible in both directions, and driven as a MotionValue so
   * the band costs no React renders while it scrolls past. */
  const bandReveal = useTransform(scrollYProgress, [0.16, 0.5, 0.84], [0, 1, 0], { clamp: true })

  return (
    <div ref={ref} className="relative" style={{ background: DEEP }}>
      <RibRaster
        src={IMG.exterior}
        srcSet={IMG.exteriorSrcSet}
        webp={IMG.exteriorWebp}
        sizes="100vw"
        alt=""
        className="h-[46svh] w-full md:h-[62svh]"
        objectPosition="52% 38%"
        ribGap={9}
        rowStep={3}
        {...(reduced ? { reveal: 1 } : { scrub: bandReveal })}
      />
      <div
        className="pointer-events-none absolute inset-0 flex items-end"
        style={{ background: 'linear-gradient(180deg, rgba(18,23,27,.55) 0%, transparent 34%, rgba(18,23,27,.86) 100%)' }}
      >
        <div className="mx-auto w-full max-w-[1500px] px-5 pb-8 md:px-10">
          <Label color={RIB}>Bárujárn · Sel, byggt 1931</Label>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  5 · STORY — the 1931 house Sel and the two sisters-in-law               */
/* ══════════════════════════════════════════════════════════════════════ */
function StorySection() {
  return (
    <section id="sagan" style={{ background: DEEP }} className="py-[clamp(84px,11vw,152px)]">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <SectionHead label={STORY.eyebrow} n="03" />
        <div className="mt-12 grid items-start gap-x-16 gap-y-12 lg:grid-cols-[0.92fr_1fr]">
          <figure className="m-0">
            <RibReveal src={IMG.interior} webp={IMG.interiorWebp} sizes="(max-width:1024px) 92vw, 44vw" alt={STORY.imgAlt} className="aspect-[4/5] w-full" ribGap={6} rowStep={3} />
            <figcaption className="mt-4">
              <Label color={BONE_MUTE}>Matsalurinn í Seli · Mynd staðarins</Label>
            </figcaption>
          </figure>
          <div>
            <Reveal delay={80}>
              <h2 className="font-display" style={display('clamp(2.1rem,4.4vw,3.6rem)', 2)}>
                {STORY.heading}
              </h2>
            </Reveal>
            <Reveal delay={150} as="p" className="mt-8 max-w-[52ch] font-sans text-[15.5px] leading-[1.74]" style={{ color: BONE_SOFT }}>
              {STORY.body1}
            </Reveal>
            <Reveal delay={210} as="p" className="mt-4 max-w-[52ch] font-sans text-[15.5px] leading-[1.74]" style={{ color: BONE_MUTE }}>
              {STORY.body2}
            </Reveal>
          </div>
        </div>

        {/* The years, counted plainly — each one its own rib-ruled column. */}
        <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
          {STORY.timeline.map((t2, i) => (
            <Reveal key={t2.year} delay={i * 90} y={14}>
              <RibRule tone={i === STORY.timeline.length - 1 ? 'rib' : 'bone'} />
              <div
                className="mt-4 font-display tabular-nums"
                style={display('clamp(1.6rem,3vw,2.4rem)', 1, i === STORY.timeline.length - 1 ? RIB : BONE)}
              >
                {t2.year}
              </div>
              <div className="mt-2.5 max-w-[24ch] font-sans text-[13px] leading-snug" style={{ color: BONE_MUTE }}>
                {t2.label}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  6 · REVIEWS — real quotes, honest sourcing. Rib-ruled rows, no cards.   */
/* ══════════════════════════════════════════════════════════════════════ */
function ReviewsSection() {
  return (
    <section style={{ background: DEEP }} className="pb-[clamp(56px,7vw,92px)]">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <SectionHead label="Umsagnir" n="04" />
        <Reveal delay={70}>
          <h2 className="mt-12 max-w-[16ch] font-display" style={display('clamp(2.2rem,4.6vw,3.8rem)', 2)}>
            {REVIEWS.heading}
          </h2>
        </Reveal>
        <Reveal delay={130} as="p" className="mt-7 max-w-[56ch] font-sans text-[15.5px] leading-[1.72]" style={{ color: BONE_SOFT }}>
          {REVIEWS.body}
        </Reveal>

        <div className="mt-14">
          {REVIEWS.quotes.map((q, i) => (
            <Reveal key={q.name} delay={i * 110} className="na-quote grid gap-x-12 gap-y-4 py-9 md:grid-cols-[1fr_auto] md:items-end" style={{ borderTop: `1px solid ${HAIR}` }}>
              <blockquote className="font-display" style={display('clamp(1.3rem,2.7vw,2.1rem)', 2, BONE)}>
                “{q.text}”
              </blockquote>
              <div className="md:text-right">
                <Label color={RIB}>{q.name}</Label>
                <Label className="mt-1" color={BONE_MUTE}>
                  {q.source}
                </Label>
              </div>
            </Reveal>
          ))}
          <div style={{ borderTop: `1px solid ${HAIR}` }} />
        </div>

        <Reveal delay={200}>
          <p className="mt-6 max-w-[62ch] font-sans text-[12.5px] leading-[1.7]" style={{ color: BONE_MUTE }}>
            {REVIEWS.note}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  7 · LANTERN — the hours, as the window that is lit right now.           */
/*  The ribs themselves carry the light: open, and the cladding glows and   */
/*  the real dining room resolves behind it; closed, and it stays ribs.     */
/* ══════════════════════════════════════════════════════════════════════ */
function LanternSection() {
  const open = useOpenNow()
  const reduced = useReducedMotion()
  return (
    <section
      id="opid"
      style={{ background: DEEP_2 }}
      className="relative overflow-hidden pb-[clamp(72px,9vw,120px)] pt-[clamp(56px,7vw,92px)]"
    >
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <SectionHead label={LANTERN.eyebrow} n="05" />
        <div className="mt-12 grid items-center gap-x-16 gap-y-14 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <Reveal delay={70}>
              <h2 className="font-display" style={display('clamp(2.4rem,5.6vw,4.8rem)', 1)}>
                {LANTERN.heading}
              </h2>
            </Reveal>
            <Reveal delay={130} as="p" className="mt-7 max-w-[48ch] font-sans text-[15.5px] leading-[1.72]" style={{ color: BONE_SOFT }}>
              {LANTERN.body}
            </Reveal>

            <Reveal delay={190}>
              <div
                className="mt-9 inline-flex items-center gap-2.5 rounded-full border px-4 py-2"
                style={{ borderColor: open ? HAIR_RIB : 'rgba(216,222,221,.22)' }}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${open && !reduced ? 'na-pulse' : ''}`}
                  style={{ background: open ? RIB : BONE_MUTE }}
                  aria-hidden
                />
                <Label color={open ? RIB : BONE_MUTE}>
                  {open ? LANTERN.openNow : LANTERN.closedNow} · {open ? LANTERN.closesAt : LANTERN.opensAt}
                </Label>
              </div>
            </Reveal>

            <Reveal delay={250}>
              <p className="mt-9 font-display tabular-nums" style={display('clamp(2.4rem,6vw,4.6rem)', 1, BONE)}>
                {LANTERN.hours}
              </p>
            </Reveal>

            <Reveal delay={310}>
              <div className="mt-10">
                <RibRule tone="rib" />
                <dl className="mt-5 grid gap-y-4 sm:grid-cols-2">
                  <div>
                    <Label as="span" color={BONE_MUTE}>
                      Sími
                    </Label>
                    <dd className="mt-1.5 m-0">
                      <a
                        href={PHONE_HREF}
                        className={`inline-flex min-h-[44px] items-center font-display underline-offset-[7px] hover:underline ${FOCUS}`}
                        style={display('clamp(1.5rem,3vw,2.1rem)', 1, RIB)}
                      >
                        {PHONE}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <Label as="span" color={BONE_MUTE}>
                      Netfang
                    </Label>
                    <dd className="mt-1.5 m-0">
                      <a
                        href={`mailto:${EMAIL}`}
                        className={`inline-flex min-h-[44px] items-center font-sans text-[15px] underline underline-offset-[3px] ${FOCUS}`}
                        style={{ color: BONE_SOFT }}
                      >
                        {EMAIL}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </div>

          {/* The lit window: the real dining room, resolving only while open. */}
          <div className="relative mx-auto w-full max-w-[440px]">
            <RibReveal
              src={IMG.interior}
              webp={IMG.interiorWebp}
              sizes="(max-width:1024px) 92vw, 440px"
              alt={LANTERN.imgAlt}
              className="aspect-[3/4] w-full"
              ribGap={7}
              rowStep={3}
              delay={200}
            />
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-0 ${open && !reduced ? 'na-lantern' : ''}`}
              style={{
                background: 'radial-gradient(ellipse 62% 52% at 50% 50%, rgba(227,184,31,.34), transparent 70%)',
                opacity: open ? 1 : 0,
                transition: 'opacity 1.2s ease',
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: 'rgba(6,9,11,.66)', opacity: open ? 0 : 1, transition: 'opacity 1.2s ease' }}
            />
            <figcaption className="mt-4">
              <Label color={BONE_MUTE}>Ásgarðsvegur 1 · Mynd staðarins</Label>
            </figcaption>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  8 · RESERVATIONS — a note under the door, honestly a request            */
/* ══════════════════════════════════════════════════════════════════════ */
type NoteDraft = { name: string; contact: string; guests: string; when: string; message: string }
const EMPTY_NOTE: NoteDraft = { name: '', contact: '', guests: '', when: '', message: '' }

function ReserveSection() {
  const [draft, setDraft] = useState<NoteDraft>(EMPTY_NOTE)
  const [sent, setSent] = useState<NoteDraft | null>(null)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSent({ ...draft }) // snapshot at submit (ledger #25)
  }

  const mailto = sent
    ? `mailto:${EMAIL}?subject=${encodeURIComponent('Borðapöntun á Naustinu')}&body=${encodeURIComponent(
        `Nafn: ${sent.name}\nSamband: ${sent.contact}\nFjöldi gesta: ${sent.guests}\nDagur og tími: ${sent.when}\nSkilaboð: ${sent.message}`,
      )}`
    : `mailto:${EMAIL}`

  const field = (
    key: keyof NoteDraft,
    label: string,
    opts?: { textarea?: boolean; required?: boolean; half?: boolean },
  ) => (
    <div className={opts?.half ? '' : 'sm:col-span-2'}>
      <label htmlFor={`na-${key}`} className="mb-2 block font-mono text-[12px] uppercase tracking-[0.09em] sm:text-[11px]" style={{ color: BONE_MUTE }}>
        {label}
      </label>
      {opts?.textarea ? (
        <textarea
          id={`na-${key}`}
          rows={3}
          value={draft[key]}
          onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
          className="na-input min-h-[44px] w-full px-3.5 py-3 font-sans text-[15px]"
        />
      ) : (
        <input
          id={`na-${key}`}
          type="text"
          required={opts?.required}
          value={draft[key]}
          onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
          className="na-input min-h-[44px] w-full px-3.5 py-3 font-sans text-[15px]"
        />
      )}
    </div>
  )

  return (
    <section id="panta" style={{ background: DEEP }} className="pb-[clamp(84px,11vw,152px)] pt-[clamp(64px,8vw,104px)]">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <SectionHead label={RESERVE.eyebrow} n="06" />
        <div className="mt-12 grid gap-x-16 gap-y-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Reveal delay={70}>
              <h2 className="font-display" style={display('clamp(2.2rem,4.6vw,3.8rem)', 2)}>
                {RESERVE.heading}
              </h2>
            </Reveal>
            <Reveal delay={130} as="p" className="mt-7 max-w-[42ch] font-sans text-[15.5px] leading-[1.72]" style={{ color: BONE_SOFT }}>
              {RESERVE.body}
            </Reveal>
            <Reveal delay={190}>
              <div className="mt-9">
                <RibRule tone="rib" />
                <Label className="mt-4" color={BONE_MUTE}>
                  Eða hringdu beint
                </Label>
                <a
                  href={PHONE_HREF}
                  className={`mt-2 inline-flex min-h-[44px] w-fit items-center font-display underline-offset-[7px] hover:underline ${FOCUS}`}
                  style={display('clamp(1.8rem,3.6vw,2.7rem)', 1, RIB)}
                >
                  {PHONE}
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={160}>
            {sent ? (
              <div className="p-7 sm:p-9" style={{ background: DEEP_2, border: `1px solid ${HAIR}` }}>
                <h3 className="font-display" style={display('clamp(1.5rem,2.6vw,2.1rem)', 1, RIB)}>
                  {RESERVE.successHeading}
                </h3>
                <p className="mt-3 font-sans text-[14.5px] leading-[1.68]" style={{ color: BONE_SOFT }}>
                  {RESERVE.successBody}
                </p>
                <dl className="mt-6 space-y-2.5 pt-5 font-sans text-[14px]" style={{ borderTop: `1px solid ${HAIR}`, color: BONE }}>
                  {sent.name && (
                    <div className="flex gap-3">
                      <dt style={{ color: BONE_MUTE }}>{RESERVE.fields.name}:</dt>
                      <dd className="m-0 font-medium">{sent.name}</dd>
                    </div>
                  )}
                  {sent.contact && (
                    <div className="flex gap-3">
                      <dt style={{ color: BONE_MUTE }}>{RESERVE.fields.contact}:</dt>
                      <dd className="m-0 font-medium">{sent.contact}</dd>
                    </div>
                  )}
                  {sent.guests && (
                    <div className="flex gap-3">
                      <dt style={{ color: BONE_MUTE }}>{RESERVE.fields.guests}:</dt>
                      <dd className="m-0 font-medium">{sent.guests}</dd>
                    </div>
                  )}
                  {sent.when && (
                    <div className="flex gap-3">
                      <dt style={{ color: BONE_MUTE }}>{RESERVE.fields.when}:</dt>
                      <dd className="m-0 font-medium">{sent.when}</dd>
                    </div>
                  )}
                </dl>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href={mailto}
                    className={`na-cta inline-flex min-h-[48px] items-center rounded-full px-7 font-mono text-[11px] uppercase tracking-[0.09em] ${FOCUS}`}
                    style={{ background: RIB, color: DEEP }}
                  >
                    {RESERVE.successMail}
                  </a>
                  <a
                    href={PHONE_HREF}
                    className={`na-pill inline-flex min-h-[48px] items-center rounded-full border px-7 font-mono text-[11px] uppercase tracking-[0.09em] ${FOCUS}`}
                    style={{ borderColor: 'rgba(216,222,221,.32)', color: BONE }}
                  >
                    {RESERVE.successCall}
                  </a>
                </div>
                <button
                  onClick={() => {
                    setSent(null)
                    setDraft(EMPTY_NOTE)
                  }}
                  className={`mt-5 font-mono text-[11px] uppercase tracking-[0.09em] underline underline-offset-[4px] ${FOCUS}`}
                  style={{ color: BONE_MUTE }}
                >
                  Skrifa nýjan miða
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="p-7 sm:p-9" style={{ background: DEEP_2, border: `1px solid ${HAIR}` }}>
                <div className="grid gap-5 sm:grid-cols-2">
                  {field('name', RESERVE.fields.name, { required: true, half: true })}
                  {field('contact', RESERVE.fields.contact, { required: true, half: true })}
                  {field('guests', RESERVE.fields.guests, { half: true })}
                  {field('when', RESERVE.fields.when, { half: true })}
                  {field('message', RESERVE.fields.message, { textarea: true })}
                </div>
                <button
                  type="submit"
                  className={`na-cta mt-7 inline-flex min-h-[52px] w-full items-center justify-center rounded-full px-8 font-mono text-[11.5px] uppercase tracking-[0.09em] sm:w-auto ${FOCUS}`}
                  style={{ background: RIB, color: DEEP }}
                >
                  {RESERVE.submit}
                </button>
                <p className="mt-5 max-w-[52ch] font-sans text-[12.5px] leading-[1.65]" style={{ color: BONE_MUTE }}>
                  {RESERVE.disclaimer}
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  9 · FIND US — the address as display type. No invented distances, and   */
/*  no borrowed harbour photography: the place is named, not illustrated.   */
/* ══════════════════════════════════════════════════════════════════════ */
function FindSection() {
  return (
    <section id="stadsetning" style={{ background: DEEP }} className="pb-[clamp(84px,11vw,152px)]">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <SectionHead label="Staðsetning" n="07" />
        <div className="mt-12 grid gap-x-16 gap-y-12 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <Reveal delay={70}>
              <h2 className="max-w-[14ch] font-display" style={display('clamp(2.4rem,6vw,5rem)', 2)}>
                {FIND.heading}
              </h2>
            </Reveal>
            <Reveal delay={130} as="p" className="mt-8 max-w-[54ch] font-sans text-[15.5px] leading-[1.72]" style={{ color: BONE_SOFT }}>
              {FIND.body}
            </Reveal>
          </div>

          <Reveal delay={190}>
            <RibRule tone="rib" />
            <Label className="mt-4" color={BONE_MUTE}>
              {FIND.addressLabel}
            </Label>
            <p className="mt-3 font-display" style={display('clamp(1.7rem,3.4vw,2.6rem)', 2, BONE)}>
              Ásgarðsvegur 1
              <br />
              640 Húsavík
            </p>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className={`na-pill mt-7 inline-flex min-h-[48px] items-center rounded-full border px-7 font-mono text-[11px] uppercase tracking-[0.09em] ${FOCUS}`}
              style={{ borderColor: HAIR_RIB, color: RIB }}
            >
              {FIND.mapsCta}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  10 · CLOSING — the yellow band. The one place the house paint fills     */
/*  the screen, with the real facade sign standing on it.                   */
/* ══════════════════════════════════════════════════════════════════════ */
function ClosingSection() {
  return (
    <>
      <section style={{ background: RIB }} className="py-[clamp(76px,10vw,132px)]">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <div
            aria-hidden
            className="h-[12px] w-full"
            style={{ backgroundImage: `repeating-linear-gradient(90deg, rgba(18,23,27,.32) 0 1px, transparent 1px 7px)` }}
          />
          <div className="mt-10 flex flex-col items-start gap-12 md:flex-row md:items-end md:justify-between">
            <div>
              <Reveal>
                <h2 className="max-w-[13ch] font-display" style={display('clamp(2.6rem,6.4vw,5.4rem)', 2, DEEP)}>
                  {CLOSING.heading}
                </h2>
              </Reveal>
              <Reveal delay={90} as="p" className="mt-6 max-w-[44ch] font-sans text-[15.5px] leading-[1.68]" style={{ color: 'rgba(18,23,27,.78)' }}>
                {CLOSING.sub}
              </Reveal>
              <Reveal delay={160}>
                <div className="mt-9 flex flex-wrap items-center gap-5">
                  <a
                    href={PHONE_HREF}
                    className={`na-cta inline-flex min-h-[54px] items-center rounded-full px-9 font-display ${FOCUS}`}
                    style={{ ...display('20px', 1, RIB), background: DEEP }}
                  >
                    {PHONE}
                  </a>
                  <span className="font-mono text-[12px] uppercase tracking-[0.09em] sm:text-[11px]" style={{ color: 'rgba(18,23,27,.72)' }}>
                    {ADDRESS} · 11:30–21:30
                  </span>
                </div>
              </Reveal>
            </div>

            {/* The facade sign. It hangs on the house as a black plate, but a
                black plate floating on the yellow band read as a stray box —
                so here it is struck straight into the paint instead, ink on
                the house colour. */}
            <Reveal delay={220} className="shrink-0 text-center md:pr-2">
              <div className="flex justify-center">
                <FishMark size={62} color={DEEP} eye={RIB} />
              </div>
              <div className="mt-3 font-display text-[30px] font-semibold lowercase italic leading-none" style={{ color: DEEP }}>
                naustið
              </div>
              <div
                className="mt-2.5 font-mono text-[11px] uppercase tracking-[0.3em] sm:text-[10px]"
                style={{ color: 'rgba(18,23,27,.72)' }}
              >
                seafood restaurant
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section style={{ background: DEEP_2 }} className="px-5 py-12 md:px-10">
        <p className="mx-auto max-w-3xl text-center font-sans text-[12px] leading-[1.7]" style={{ color: BONE_MUTE }}>
          {DISCLAIMER}{' '}
          <a href={`mailto:${EMAIL}`} className="underline underline-offset-2">
            {EMAIL}
          </a>{' '}
          · {PHONE} · {ADDRESS}.
        </p>
      </section>
    </>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  STICKY MOBILE CTA                                                       */
/* ══════════════════════════════════════════════════════════════════════ */
function StickyCta() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)', background: DEEP_2 }}
    >
      <a
        href={PHONE_HREF}
        className={`flex min-h-[54px] items-center justify-center font-mono text-[11px] uppercase tracking-[0.09em] ${FOCUS}`}
        style={{ background: RIB, color: DEEP }}
      >
        Hringja · {PHONE}
      </a>
      <button
        onClick={() => goTo('panta')}
        className={`flex min-h-[54px] items-center justify-center font-mono text-[11px] uppercase tracking-[0.09em] ${FOCUS}`}
        style={{ color: BONE }}
      >
        Panta borð
      </button>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  PAGE                                                                    */
/* ══════════════════════════════════════════════════════════════════════ */
export default function Page() {
  useEffect(() => {
    document.title = 'Naustið · Sjávarréttir við höfnina á Húsavík'
    setThemeColor(DEEP)
    return () => setThemeColor('#0a1320')
  }, [])

  useEffect(() => {
    if (prefersReduced()) return
    const lenis = new Lenis({
      duration: 1.15,
      easing: (x: number) => Math.min(1, 1.001 - Math.pow(2, -10 * x)),
      smoothWheel: true,
    })
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  return (
    <div lang="is" className="font-sans overflow-x-clip" style={{ background: DEEP, color: BONE }}>
      {/* Every rule below is prefixed na- and scoped under #na-root so this
          page cannot bleed into the other previews (no-style-bleed rule). */}
      <style>{`
        #na-root ::selection { background:${RIB}; color:${DEEP}; }

        /* Only the one-shot reveals ease. A scrubbed raster ([data-scrub]) is
           written per frame by its scroll subscriber, and a transition there
           restarts on every step — mush plus a pinned compositor. */
        #na-root .na-raster:not([data-scrub]) canvas,
        #na-root .na-raster:not([data-scrub]) img {
          transition: opacity .55s ${EASE}, transform .9s ${EASE};
        }

        #na-root .na-navlink { position:relative; }
        #na-root .na-navlink::after {
          content:''; position:absolute; left:0; right:100%; bottom:-5px; height:1px;
          background:${RIB}; transition:right .3s ${EASE};
        }
        #na-root .na-navlink:hover::after { right:0; }

        #na-root .na-cta { transition:transform .16s ease, filter .25s ease; }
        #na-root .na-cta:hover { filter:brightness(1.06); }
        #na-root .na-cta:active { transform:scale(.985); }

        #na-root .na-pill { transition:border-color .3s ${EASE}, color .3s ${EASE}, background-color .3s ${EASE}; }
        @media (hover:hover) and (pointer:fine) {
          #na-root .na-pill:hover { border-color:${RIB}; background:${RIB}; color:${DEEP}; }
          /* A dish lights up like a rib catching the sun, not like a card. */
          #na-root .na-dish { transition:padding-left .4s ${EASE}; }
          #na-root .na-dish:hover { padding-left:14px; }
          #na-root .na-dish { position:relative; }
          #na-root .na-dish::before {
            content:''; position:absolute; left:0; top:16px; bottom:16px; width:2px;
            background:${RIB}; opacity:0; transition:opacity .4s ${EASE};
          }
          #na-root .na-dish:hover::before { opacity:1; }
        }

        #na-root .na-input {
          background:${DEEP}; border:1px solid rgba(216,222,221,.24); color:${BONE};
          border-radius:0;
          transition:border-color .2s ease, box-shadow .2s ease;
        }
        #na-root .na-input::placeholder { color:rgba(216,222,221,.4); }
        #na-root .na-input:focus { outline:none; border-color:${RIB}; box-shadow:0 0 0 2px rgba(227,184,31,.28); }

        @media (prefers-reduced-motion: no-preference) {
          #na-root .na-lantern { animation:na-lantern 5.5s ease-in-out infinite alternate; }
          @keyframes na-lantern { from { opacity:.7 } to { opacity:1 } }
          #na-root .na-pulse { animation:na-pulse 2.4s ease-in-out infinite; }
          @keyframes na-pulse { 0%,100% { opacity:1 } 50% { opacity:.35 } }
          #na-root .na-mlink { animation:na-mlink .5s ${EASE} both; }
          @keyframes na-mlink { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:none } }
        }
        @media (prefers-reduced-motion: reduce) {
          #na-root .na-navlink::after,
          #na-root .na-cta,
          #na-root .na-pill,
          #na-root .na-dish,
          #na-root .na-raster canvas,
          #na-root .na-raster img { transition:none !important; }
          #na-root .na-lantern,
          #na-root .na-pulse,
          #na-root .na-mlink { animation:none !important; }
        }
      `}</style>
      <div id="na-root">
        <PreviewChrome company={company} />
        <TopNav />
        <main>
          <Hero />
          <SoupSection />
          <MenuSection />
          <CladdingBand />
          <StorySection />
          <ReviewsSection />
          <LanternSection />
          <ReserveSection />
          <FindSection />
          <ClosingSection />
        </main>
        <div className="h-[54px] md:hidden" aria-hidden />
        <PreviewFooter company={company} />
        <div className="h-[54px] md:hidden" aria-hidden />
        <StickyCta />
      </div>
    </div>
  )
}
