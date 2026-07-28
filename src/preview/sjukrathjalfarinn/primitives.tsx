import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

// eslint-disable-next-line react-refresh/only-export-components -- shared helper, not a component
export const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

/* ═══ 1. THE SCROLL ENGINE ═══════════════════════════════════════════════
   One Lenis instance drives both the GSAP ticker (so ScrollTrigger, the
   marquee and SplitText reveals stay in sync) and a single rAF pass that
   damps every [data-sjr] element toward a 0 to 1 --rv value, read by the
   Rise and Plate primitives below. Batches every READ before every WRITE. */
// eslint-disable-next-line react-refresh/only-export-components -- hook, not a component
export function useScrollEngine() {
  useEffect(() => {
    if (reduced()) {
      document.querySelectorAll<HTMLElement>('[data-sjr]').forEach((el) => el.style.setProperty('--rv', '1'))
      return
    }

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const cur = new WeakMap<HTMLElement, number>()
    const curP = new WeakMap<HTMLElement, number>()
    let raf = 0
    let last = performance.now()

    const frame = (now: number) => {
      const dt = Math.min(64, now - last) / 1000
      last = now

      const els = Array.from(document.querySelectorAll<HTMLElement>('[data-sjr]'))
      const vh = window.innerHeight

      const rects = els.map((el) => el.getBoundingClientRect())
      const targets = rects.map((r) => {
        const start = vh * 0.92
        const end = vh * 0.38
        const t = (start - r.top) / Math.max(1, start - end)
        return Math.max(0, Math.min(1, t))
      })
      // DEVICE 6 — global parallax on photography, adapted from the reference's
      // `[data-parallax]` device: a continuous (unclamped) drift value, damped
      // separately from --rv, written only for Plate instances rendered with
      // the `parallax` prop (see Plate below and its `data-parallax` marker).
      const pTargets = rects.map((r) => (vh / 2 - (r.top + r.height / 2)) * 0.1)

      els.forEach((el, i) => {
        const tgt = targets[i]
        const prev = cur.get(el) ?? 0
        const tau = 0.16
        let next = prev + (tgt - prev) * (1 - Math.exp(-dt / tau))
        if (Math.abs(tgt - next) < 0.001) next = tgt
        if (next !== prev) {
          cur.set(el, next)
          el.style.setProperty('--rv', next.toFixed(4))
        }

        if (el.hasAttribute('data-parallax')) {
          const ptgt = pTargets[i]
          const pprev = curP.get(el) ?? 0
          let pnext = pprev + (ptgt - pprev) * (1 - Math.exp(-dt / 0.22))
          if (Math.abs(ptgt - pnext) < 0.01) pnext = ptgt
          if (pnext !== pprev) {
            curP.set(el, pnext)
            el.style.setProperty('--pv', pnext.toFixed(2))
          }
        }
      })

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])
}

/* ═══ 2. RISE — content reveal, scrubbed off --rv ═══════════════════════ */
export function Rise({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article' | 'span'
}) {
  return (
    <Tag data-sjr className={`sjr-rise ${className}`} style={{ '--d': delay } as React.CSSProperties}>
      {children}
    </Tag>
  )
}

/* ═══ 3. PLATE — scrubbed media reveal (hard clip sweep + blur falling
   away), optionally carrying continuous parallax drift on --pv. Image is
   oversized so blur cannot pull transparency in at the edges. ═══════════ */
export function Plate({
  src,
  alt,
  ratio = '4 / 3',
  className = '',
  priority = false,
  parallax = false,
}: {
  src: string
  alt: string
  ratio?: string
  className?: string
  priority?: boolean
  parallax?: boolean
}) {
  return (
    <div
      data-sjr
      {...(parallax ? { 'data-parallax': true } : {})}
      className={`sjr-plate ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async" />
    </div>
  )
}

/* ═══ 3b. HERO PLATE — above-the-fold only. A pure CSS entrance (see the
   `sjr-hero-in` keyframe), never gated on the scroll engine, so the hero
   stays fully readable even with rAF frozen (craft rule 6). ═══════════════ */
export function HeroPlate({ src, alt, ratio = '4 / 5', className = '' }: { src: string; alt: string; ratio?: string; className?: string }) {
  return (
    <div className={`sjr-hero-plate ${className}`} style={{ aspectRatio: ratio }}>
      <img src={src} alt={alt} loading="eager" decoding="async" {...{ fetchpriority: 'high' as const }} />
    </div>
  )
}

/* ═══ DEVICE 4 — SPLIT HEADING — masked word/char reveal, adapted from the
   reference catalogue's device 1 (SplitText line/char reveals). Always
   `type:'words,chars'`, never `clearProps`. fromTo toward the resting state
   with a ~2s failsafe so nothing strands invisible if ScrollTrigger never
   fires. ═══════════════════════════════════════════════════════════════ */
export function SplitHeading({
  children,
  as: Tag = 'h2',
  className = '',
  id,
}: {
  children: string
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  id?: string
}) {
  const ref = useRef<HTMLHeadingElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || reduced()) return

    let split: SplitText | null = null
    let failsafe = 0
    const ctx = gsap.context(() => {
      split = SplitText.create(el, {
        type: 'words,chars',
        mask: 'chars',
        autoSplit: true,
        onSplit: (self) => {
          const tween = gsap.fromTo(
            self.chars,
            { yPercent: 108, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.85,
              ease: 'power3.out',
              stagger: 0.018,
              scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            },
          )
          failsafe = window.setTimeout(() => {
            gsap.set(self.chars, { yPercent: 0, opacity: 1 })
          }, 2200)
          return tween
        },
      })
    }, el)

    return () => {
      window.clearTimeout(failsafe)
      ctx.revert()
      split?.revert()
    }
  }, [])

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  )
}

/* ═══ DEVICE 5 — HIGHLIGHT TEXT — scrubbed char read, adapted from the
   reference catalogue's device 2. Chars sit dim until the scroll position
   sweeps past them, alpha .14 to 1, linear, reversible. ═════════════════ */
export function HighlightText({ children, className = '' }: { children: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || reduced()) return

    let split: SplitText | null = null
    let failsafe = 0
    const ctx = gsap.context(() => {
      split = SplitText.create(el, {
        type: 'words,chars',
        autoSplit: true,
        onSplit: (self) => {
          gsap.set(self.chars, { opacity: 0.14 })
          const tween = gsap.to(self.chars, {
            opacity: 1,
            stagger: 0.4 / Math.max(1, self.chars.length),
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 92%', end: 'center 42%', scrub: true },
          })
          failsafe = window.setTimeout(() => {
            gsap.set(self.chars, { opacity: 1 })
          }, 2400)
          return tween
        },
      })
    }, el)

    return () => {
      window.clearTimeout(failsafe)
      ctx.revert()
      split?.revert()
    }
  }, [])

  return (
    <p ref={ref} className={className}>
      {children}
    </p>
  )
}

/* ═══ DEVICE 7 — DRAG ROW — pointer driven horizontal snap row, adapted
   from the reference catalogue's draggable review row / mobile card-swipe
   devices: a physical card row you drag, backed by native scroll-snap so
   momentum and accessibility come for free; JS tracks the grab cursor
   state and the actual pointer-driven scroll. ═══════════════════════════ */
export function DragRow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [dragging, setDragging] = useState(false)
  const start = useRef({ x: 0, scroll: 0, moved: false })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const down = (e: PointerEvent) => {
      start.current = { x: e.clientX, scroll: el.scrollLeft, moved: false }
      setDragging(true)
      el.setPointerCapture(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      if (!start.current) return
      const dx = e.clientX - start.current.x
      if (Math.abs(dx) > 3) start.current.moved = true
      if (e.pressure === 0 && e.pointerType !== 'touch') return
      el.scrollLeft = start.current.scroll - dx
    }
    const up = (e: PointerEvent) => {
      setDragging(false)
      try {
        el.releasePointerCapture(e.pointerId)
      } catch {
        /* already released */
      }
    }
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
    }
  }, [])

  return (
    <div ref={ref} className={`sjr-drag-row ${dragging ? 'sjr-dragging' : ''} ${className}`}>
      {children}
    </div>
  )
}
