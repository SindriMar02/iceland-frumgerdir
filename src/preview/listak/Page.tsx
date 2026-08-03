import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowUpRight, Play } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  ADDRESS, ADMISSION, EDUCATION, EMAIL, EMAIL_HREF, FACEBOOK_URL, FLOORPLAN,
  HALLS, HALL_EMPTY, HOURS_RECAP, INSTAGRAM_URL, JSON_LD, META, NEWSLETTER_URL,
  PHONE_DISPLAY, PHONE_HREF, SHOWS, SITE_URL, TAGLINE, UPCOMING, openStatus,
} from './data'
import type { OpenStatus, Show } from './data'

gsap.registerPlugin(ScrollTrigger)

const company = getPreviewCompany('listak')

/* ── SÝNINGARGANGURINN — the gallery corridor ──────────────────────────────
   Listasafnið á Akureyri runs NINE exhibitions at once in numbered halls
   (Salur 01–12). The page walks all nine as one continuous horizontal
   corridor — the way a visitor actually walks the building. One signature
   interaction; everything else stays flat, calm and hairline-bordered.

   Engines reused, not reinvented:
   - westfjords/Page.tsx  → the Heklusýn drift loop (module-level node Set +
     ONE shared rAF, batched reads-then-writes, --dz derived inset).
   - budir/Page.tsx       → the horizontal journey (gsap TWEEN + pinned
     scrub 1 + Lenis; a timeline freezes at x=0), compositing hints,
     fonts.ready + image-decode refresh.
   - laxa/Page.tsx        → the button vocabulary (micro-caps 0.14em),
     re-skinned: sharp corners here, because pills are reserved EXCLUSIVELY
     for metadata chips (hall numbers, dates, status) in this system. ───── */

const GROUND = '#F0EFE8' /* cool stone-white gallery wall */
const INK = '#14140F' /* warm charcoal near-black */
const ACCENT = '#C03E31' /* signal red — sampled from their own artwork photo set */
const ACCENT_DEEP = '#A83428' /* body-size accent text (small sizes need >4.5:1) */
const MUT = 'rgba(20,20,15,0.64)'
const PAPER = '#F0EFE8'
const PAPER_MUTE = 'rgba(240,239,232,0.66)'
const HAIR_PAPER = 'rgba(240,239,232,0.24)'
const OPEN_GREEN = '#1E7B34'

/* 'Familjen Grotesk Var' is the VARIABLE file (wght 400..700) declared under
   its own family name so it deterministically wins the cascade; the four
   static faces stay declared under 'Familjen Grotesk' as the fallback for
   browsers without variable-font support. */
const DISPLAY = "'Familjen Grotesk Var', 'Familjen Grotesk', ui-sans-serif, system-ui, sans-serif"
const SERIF = "'Sentient', Georgia, 'Times New Roman', serif"

const BASE = import.meta.env.BASE_URL
const IMG = (f: string) => `${BASE}listak/${f}`
const FONT_DIR = `${BASE}fonts/`

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* The one gate every hover/pointer device on this page asks. It mirrors the
   CSS `@media (hover: hover) and (pointer: fine)` blocks exactly, so a touch
   device can never end up with a JS-driven hover state that CSS cannot clear. */
const finePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

const motionOk = () => !prefersReduced()
const hoverOk = () => motionOk() && finePointer()

/* Module handles so anchor nav + stop focus can map into the pinned journey
   (budir's labelToScroll pattern). Set/cleared by the matchMedia branch. */
let journeyNav: { master: ScrollTrigger; track: HTMLElement; lenis: Lenis } | null = null
let pageLenis: Lenis | null = null

/* ── THE drift engine (westfjords architecture, renamed lk-) ──────────────
   ONE shared rAF loop for every drifting frame AND the corridor's
   depth-of-field. All READS happen first, into arrays, then all WRITES —
   interleaving getBoundingClientRect with style writes forces a synchronous
   layout per node per frame. No React setState anywhere in here. */
const driftNodes = new Set<HTMLElement>()
const dofNodes = new Set<HTMLElement>()
let driftRaf = 0

/* Hover amount per drift frame, lerped in the loop so the hover reads as a
   slow counter-drift rather than a CSS transition fighting the rAF writer.
   `.lk-frame-in` has exactly ONE writer (this loop) — the corridor's GSAP
   parallax targets the <img> inside it, never this node. */
const hoverAmt = new WeakMap<HTMLElement, number>()

/* ── variable-font weight groups (the cursor device) ──────────────────────
   Registered letter nodes whose 'wght' axis is driven from pointer distance.
   Rides the SAME rAF as the drift loop: per group ONE layout read (the host
   rect) per frame, letter offsets cached from a one-off measure pass, and a
   write only when the quantised weight actually changes. No setState. */
interface WeightGroup {
  host: HTMLElement
  letters: Array<SVGElement | HTMLElement>
  /** same letters on a non-measurable layer (inside <mask>), written in step */
  mirror: Array<SVGElement | HTMLElement> | null
  ox: number[]
  oy: number[]
  rest: number
  lo: number
  hi: number
  radius: number
  amp: number
  last: number[]
}
const weightGroups = new Set<WeightGroup>()
let ptrX = -1e5
let ptrY = -1e5
let ptrSeen = false

function onPointerMove(e: PointerEvent) {
  ptrX = e.clientX
  ptrY = e.clientY
  ptrSeen = true
}
function onPointerLeave() {
  ptrSeen = false
}
let ptrBound = false
function bindPointer() {
  if (ptrBound || !hoverOk()) return
  ptrBound = true
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('pointerdown', onPointerMove, { passive: true })
  document.addEventListener('pointerleave', onPointerLeave)
  window.addEventListener('blur', onPointerLeave)
}
function unbindPointer() {
  if (!ptrBound || weightGroups.size) return
  ptrBound = false
  ptrSeen = false
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerdown', onPointerMove)
  document.removeEventListener('pointerleave', onPointerLeave)
  window.removeEventListener('blur', onPointerLeave)
}

function driftTick() {
  const vh = window.innerHeight
  const vw = window.innerWidth
  const dReads: Array<[HTMLElement, number, HTMLElement]> = []
  driftNodes.forEach((el) => {
    const host = el.parentElement
    if (!host) return
    const r = host.getBoundingClientRect()
    if (r.bottom < -240 || r.top > vh + 240) return
    dReads.push([el, (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2), host])
  })
  const fReads: Array<[HTMLElement, number]> = []
  dofNodes.forEach((el) => {
    const r = el.getBoundingClientRect()
    if (r.right < -vw * 0.6 || r.left > vw * 1.6) return
    fReads.push([el, (r.left + r.width / 2 - vw / 2) / (vw / 2 + r.width / 2)])
  })
  /* one rect per weight group, read BEFORE any write below */
  const wReads: Array<[WeightGroup, number, number]> = []
  weightGroups.forEach((g) => {
    const r = g.host.getBoundingClientRect()
    if (r.bottom < 0 || r.top > vh) {
      /* off screen: relax to rest without paying for distance math */
      if (g.amp > 0.001) wReads.push([g, r.left, r.top])
      return
    }
    wReads.push([g, r.left, r.top])
  })
  /* writes */
  for (let i = 0; i < dReads.length; i++) {
    const [el, p, host] = dReads[i]
    const d = Number(el.dataset.drift) || 9
    /* hover: ease toward 1 on enter, back to 0 on leave (~0.5s at 60fps) */
    const target = host.dataset.lkHover === '1' ? 1 : 0
    const prev = hoverAmt.get(el) ?? 0
    const h = prev + (target - prev) * 0.09
    hoverAmt.set(el, h)
    /* counter-drift: the frame slows against its own drift as it is hovered */
    const y = -p * d * (1 - 0.55 * h)
    el.style.transform =
      `translate3d(0px, ${y.toFixed(3)}%, 0)` +
      (h > 0.001 ? ` scale(${(1 + 0.036 * h).toFixed(4)})` : '')
  }
  for (let i = 0; i < wReads.length; i++) {
    const [g, hx, hy] = wReads[i]
    /* the light source is the LETTERS, not the block. A host-box test lit the
       empty half of a full-width heading and dimmed every letter at once with
       no visible source; gating on distance to the nearest letter keeps the
       entry smooth and leaves the line at rest everywhere else. */
    let near2 = Infinity
    if (ptrSeen) {
      for (let j = 0; j < g.ox.length; j++) {
        const dx = ptrX - (hx + g.ox[j])
        const dy = ptrY - (hy + g.oy[j])
        const d2 = dx * dx + dy * dy
        if (d2 < near2) near2 = d2
      }
    }
    const reach = g.radius * 1.15
    const engaged = ptrSeen && near2 <= reach * reach
    g.amp += ((engaged ? 1 : 0) - g.amp) * 0.12
    if (g.amp < 0.002 && !engaged) g.amp = 0
    for (let j = 0; j < g.letters.length; j++) {
      let w = g.rest
      if (g.amp > 0) {
        const dx = ptrX - (hx + g.ox[j])
        const dy = ptrY - (hy + g.oy[j])
        const dist = Math.sqrt(dx * dx + dy * dy)
        let f = 1 - dist / g.radius
        f = f < 0 ? 0 : f > 1 ? 1 : f
        f = f * f * (3 - 2 * f)
        const near = g.lo + (g.hi - g.lo) * f
        w = g.rest + (near - g.rest) * g.amp
      }
      /* quantised: most frames write nothing, so the SVG mask that the hero
         cutout depends on is not re-rasterised 60 times a second */
      const q = Math.round(w / 20) * 20
      if (g.last[j] !== q) {
        g.last[j] = q
        const v = `'wght' ${q}`
        g.letters[j].style.fontVariationSettings = v
        if (g.mirror) g.mirror[j].style.fontVariationSettings = v
      }
    }
  }
  for (let i = 0; i < fReads.length; i++) {
    const [el, p] = fReads[i]
    const a = Math.min(1, Math.abs(p))
    /* blur up to 6px + slight scale-down off-centre, sharp at centre.
       A SHARP PLATEAU (|offset| <= 0.28) keeps exactly one plane in focus
       through the hand-off — a real rack focus never melts everything at
       once. Quantised so the compositor is not re-rastering every frame. */
    const t = Math.max(0, a - 0.28)
    const blur = Math.round(Math.min(6, t * 9) * 4) / 4
    const scale = (1 - Math.min(0.05, t * 0.083)).toFixed(4)
    const key = `${blur}|${scale}`
    if (el.dataset.lkDof !== key) {
      el.dataset.lkDof = key
      el.style.filter = blur > 0 ? `blur(${blur}px)` : ''
      el.style.transform = `scale(${scale})`
    }
  }
  driftRaf = requestAnimationFrame(driftTick)
}

function ensureDriftLoop() {
  if (!driftRaf && (driftNodes.size || dofNodes.size || weightGroups.size)) {
    driftRaf = requestAnimationFrame(driftTick)
  }
}
function maybeStopDriftLoop() {
  if (!driftNodes.size && !dofNodes.size && !weightGroups.size && driftRaf) {
    cancelAnimationFrame(driftRaf)
    driftRaf = 0
  }
}

function useDriftNode(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (prefersReduced()) return
    const el = ref.current
    if (!el) return
    driftNodes.add(el)
    ensureDriftLoop()
    return () => {
      driftNodes.delete(el)
      maybeStopDriftLoop()
    }
  }, [ref])
}

/* ── the variable-font cursor primitive ───────────────────────────────────
   'Variable Font And Cursor': letters near the pointer gain weight, letters
   far from it stay light, interpolated by distance with a falloff radius.

   Two things keep it honest under the house rules:
   - it never runs at all unless (hover: hover) and (pointer: fine) and
     prefers-reduced-motion is no-preference. Touch and reduced-motion never
     register a group, never bind a pointer listener, and the type renders at
     its designed static weight;
   - the layout is PINNED so gaining weight cannot reflow the line. SVG lines
     get `textLength` + `lengthAdjust="spacing"`; DOM letters get a measured
     fixed inline-block width. Without this the wordmark would swim. */
function useWeightGroup(
  hostRef: React.RefObject<HTMLElement | null>,
  opts: {
    rest: number
    lo: number
    hi: number
    /** falloff radius as a share of viewport width, floored at 200px */
    radiusVw: number
    /** SVG: pin each `text.lk-vf-line` to its natural length */
    pinSvgLines?: boolean
    /** DOM: freeze each letter box to its natural width */
    fixWidths?: boolean
    /** scope the MEASURED letters (a rendered layer) */
    measureSel?: string
    /** letters that copy the measured layer's weights but cannot be measured
        themselves — the hero cutout lives inside <mask>, which has no box */
    mirrorSel?: string
  },
) {
  const optRef = useRef(opts)
  optRef.current = opts
  useEffect(() => {
    const host = hostRef.current
    if (!host || !hoverOk()) return
    let group: WeightGroup | null = null
    let dead = false

    const measure = () => {
      if (dead) return
      const o = optRef.current
      const pick = (sel: string, scope?: string) =>
        Array.from(host.querySelectorAll(scope ? `${scope} ${sel}` : sel))
      const letters = pick('.lk-vf-ch', o.measureSel) as Array<SVGElement | HTMLElement>
      const mirror = (o.mirrorSel ? pick('.lk-vf-ch', o.mirrorSel) : []) as Array<
        SVGElement | HTMLElement
      >
      if (!letters.length) return
      /* reset to the natural resting state before measuring anything */
      const all = letters.concat(mirror)
      all.forEach((el) => {
        el.style.fontVariationSettings = `'wght' ${o.rest}`
        if (o.fixWidths) el.style.width = ''
      })
      /* READS */
      const measureLines = o.pinSvgLines
        ? (pick('.lk-vf-line', o.measureSel) as unknown as SVGTextElement[])
        : []
      const mirrorLines = o.pinSvgLines && o.mirrorSel
        ? (pick('.lk-vf-line', o.mirrorSel) as unknown as SVGTextElement[])
        : []
      /* clear last pass's pinning or the positions read back are its own */
      measureLines.concat(mirrorLines).forEach((t) => {
        t.removeAttribute('textLength')
        t.removeAttribute('lengthAdjust')
        Array.from(t.children).forEach((c) => c.removeAttribute('x'))
      })
      /* Per-GLYPH advance centres, in user units, at the resting weight.
         Pinning the LINE length alone is not enough: `lengthAdjust="spacing"`
         holds the two ends still but lets the interior letters slide as their
         advances change (measured: 26px of wobble at 284px type). Anchoring
         every letter to its own advance centre instead means a letter gains
         weight strictly in place. */
      const perLine = measureLines.map((t) => {
        if (typeof t.getNumberOfChars !== 'function') return null
        try {
          const n = t.getNumberOfChars()
          const xs: number[] = []
          for (let i = 0; i < n; i++) {
            const s = t.getStartPositionOfChar(i)
            const e = t.getEndPositionOfChar(i)
            xs.push((s.x + e.x) / 2)
          }
          return xs
        } catch {
          return null
        }
      })
      const natural = measureLines.map((t) =>
        typeof t.getComputedTextLength === 'function' ? t.getComputedTextLength() : 0,
      )
      const hr = host.getBoundingClientRect()
      const ox: number[] = []
      const oy: number[] = []
      const widths: number[] = []
      for (let i = 0; i < letters.length; i++) {
        const r = letters[i].getBoundingClientRect()
        ox.push(r.left + r.width / 2 - hr.left)
        oy.push(r.top + r.height / 2 - hr.top)
        widths.push(r.width)
      }
      /* WRITES */
      for (let i = 0; i < measureLines.length; i++) {
        const xs = perLine[i]
        if (xs && xs.length) {
          /* every letter anchored to its own advance centre; a tspan with an
             absolute x starts its own chunk, and the inherited
             text-anchor:middle then centres that one glyph on it */
          const pin = (line: SVGTextElement) => {
            let ci = 0
            Array.from(line.children).forEach((c) => {
              const len = (c.textContent || '').length
              if (c.classList.contains('lk-vf-ch') && xs[ci] !== undefined) {
                c.setAttribute('x', xs[ci].toFixed(2))
              }
              ci += len
            })
          }
          pin(measureLines[i])
          if (mirrorLines[i]) pin(mirrorLines[i])
        } else if (natural[i] > 0) {
          /* fallback for engines without getStartPositionOfChar */
          const len = String(natural[i])
          measureLines[i].setAttribute('textLength', len)
          measureLines[i].setAttribute('lengthAdjust', 'spacing')
          if (mirrorLines[i]) {
            mirrorLines[i].setAttribute('textLength', len)
            mirrorLines[i].setAttribute('lengthAdjust', 'spacing')
          }
        }
      }
      if (o.fixWidths) {
        for (let i = 0; i < letters.length; i++) {
          ;(letters[i] as HTMLElement).style.width = `${widths[i].toFixed(2)}px`
        }
      }
      if (group) weightGroups.delete(group)
      group = {
        host,
        letters,
        mirror: mirror.length === letters.length ? mirror : null,
        ox,
        oy,
        rest: o.rest,
        lo: o.lo,
        hi: o.hi,
        radius: Math.max(200, window.innerWidth * o.radiusVw),
        amp: 0,
        last: letters.map(() => -1),
      }
      weightGroups.add(group)
      bindPointer()
      ensureDriftLoop()
    }

    /* the wordmark is vw-sized: measure only once the display font is real */
    let raf = 0
    const schedule = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measure)
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(schedule).catch(schedule)
    } else {
      schedule()
    }
    let rt = 0
    const onResize = () => {
      window.clearTimeout(rt)
      rt = window.setTimeout(measure, 180)
    }
    window.addEventListener('resize', onResize)

    return () => {
      dead = true
      cancelAnimationFrame(raf)
      window.clearTimeout(rt)
      window.removeEventListener('resize', onResize)
      if (group) {
        group.letters.concat(group.mirror ?? []).forEach((el) => {
          el.style.fontVariationSettings = ''
          ;(el as HTMLElement).style.width = ''
        })
        weightGroups.delete(group)
        group = null
      }
      unbindPointer()
      maybeStopDriftLoop()
    }
  }, [hostRef])
}

/* Per-letter renderer shared by the hero wordmark and the Húsið heading.
   Spaces stay outside `.lk-vf-ch` so they are never weight targets. */
function vfChars(text: string, Tag: 'tspan' | 'span') {
  if (Tag === 'tspan') {
    return Array.from(text).map((ch, i) =>
      ch === ' ' ? (
        <tspan key={i} xmlSpace="preserve">{' '}</tspan>
      ) : (
        <tspan key={i} className="lk-vf-ch">{ch}</tspan>
      ),
    )
  }
  /* DOM: letters are inline-block (so a measured width can pin them), so the
     words must be wrapped or the line could never break. Real space text
     nodes between the word boxes keep the natural wrap opportunities. */
  const words = text.split(' ')
  const out: ReactNode[] = []
  words.forEach((word, w) => {
    if (w > 0) out.push(<span key={`s${w}`}> </span>)
    out.push(
      <span key={`w${w}`} className="lk-vf-w">
        {Array.from(word).map((ch, i) => (
          <span key={i} className="lk-vf-ch lk-vf-ch-dom">{ch}</span>
        ))}
      </span>,
    )
  })
  return out
}

/* Corridor-stop hover: drives the drift frame's hover channel from the WHOLE
   stop, so hovering the title moves the artwork too. Focus does the same, so
   keyboard users get the identical state. Never attached on touch/reduced
   motion. */
function useStopHover(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el || !hoverOk()) return
    const frame = el.querySelector('.lk-frame') as HTMLElement | null
    const on = () => {
      if (frame) frame.dataset.lkHover = '1'
    }
    const off = () => {
      if (frame) frame.dataset.lkHover = '0'
    }
    el.addEventListener('pointerenter', on)
    el.addEventListener('pointerleave', off)
    el.addEventListener('focusin', on)
    el.addEventListener('focusout', off)
    return () => {
      el.removeEventListener('pointerenter', on)
      el.removeEventListener('pointerleave', off)
      el.removeEventListener('focusin', on)
      el.removeEventListener('focusout', off)
      if (frame) delete frame.dataset.lkHover
    }
  }, [ref])
}

/* A fixed frame whose image drifts inside it. --dz is DERIVED from the drift
   value: a flat inset is silently wrong at drift 12+, where the image runs
   out of overhang and its own edge slides into frame. */
function DriftFrame({
  src, srcSet, sizes, alt, drift = 9, className = '', style, eager = false, w, h,
}: {
  src: string
  srcSet?: string
  sizes?: string
  alt: string
  drift?: number
  className?: string
  style?: React.CSSProperties
  eager?: boolean
  /** intrinsic pixels of `src`, declared so nothing shifts before decode */
  w?: number
  h?: number
}) {
  const inner = useRef<HTMLDivElement>(null)
  useDriftNode(inner)
  return (
    <div className={`lk-frame ${className}`} style={style}>
      <div
        ref={inner}
        className="lk-frame-in"
        data-drift={drift}
        style={{ ['--dz' as string]: `${Math.max(9, drift * 1.35).toFixed(2)}%` }}
      >
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          width={w}
          height={h}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          {...(eager ? { fetchpriority: 'high' as const } : {})}
        />
      </div>
    </div>
  )
}

/* IntersectionObserver reveal — fires once, on an untransformed wrapper. */
function useInView<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, inView }
}

function Reveal({
  children, className = '', delay = 0, soft = false,
}: {
  children: ReactNode
  className?: string
  delay?: number
  soft?: boolean
}) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={`${soft ? 'lk-reveal-soft' : 'lk-reveal'} ${inView ? 'is-in' : ''} ${className}`}
      style={inView && delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

/* ── page-scoped styles — everything prefixed lk- ── */
const CSS = `
  @font-face {
    font-family: 'Familjen Grotesk';
    src: url('${FONT_DIR}familjen-grotesk/familjen-grotesk-v11-latin_latin-ext-regular.woff2') format('woff2');
    font-weight: 400; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Familjen Grotesk';
    src: url('${FONT_DIR}familjen-grotesk/familjen-grotesk-v11-latin_latin-ext-500.woff2') format('woff2');
    font-weight: 500; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Familjen Grotesk';
    src: url('${FONT_DIR}familjen-grotesk/familjen-grotesk-v11-latin_latin-ext-600.woff2') format('woff2');
    font-weight: 600; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Familjen Grotesk';
    src: url('${FONT_DIR}familjen-grotesk/familjen-grotesk-v11-latin_latin-ext-700.woff2') format('woff2');
    font-weight: 700; font-style: normal; font-display: swap;
  }
  /* the VARIABLE face — wght 400..700, its own family so it wins outright.
     Latin-ext first, then Latin: Icelandic (Á Ð Í Ó Ú Ý Þ Æ Ö) lives in
     U+00C0..U+00FF, inside the Latin subset. Any glyph outside both ranges
     falls back to the static faces above, which cover the same design. */
  @font-face {
    font-family: 'Familjen Grotesk Var';
    src: url('${FONT_DIR}familjen-grotesk/familjen-grotesk-variable-latin-ext.woff2') format('woff2');
    font-weight: 400 700; font-style: normal; font-display: swap;
    unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
  }
  @font-face {
    font-family: 'Familjen Grotesk Var';
    src: url('${FONT_DIR}familjen-grotesk/familjen-grotesk-variable-latin.woff2') format('woff2');
    font-weight: 400 700; font-style: normal; font-display: swap;
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  @font-face {
    font-family: 'Sentient';
    src: url('${FONT_DIR}sentient/Sentient-Light.woff2') format('woff2');
    font-weight: 300; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Sentient';
    src: url('${FONT_DIR}sentient/Sentient-Regular.woff2') format('woff2');
    font-weight: 400; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Sentient';
    src: url('${FONT_DIR}sentient/Sentient-Medium.woff2') format('woff2');
    font-weight: 500; font-style: normal; font-display: swap;
  }

  .lk-root { background: ${GROUND}; color: ${INK}; }
  .lk-root ::selection { background: ${ACCENT}; color: ${GROUND}; }
  .lk-root a:focus-visible, .lk-root button:focus-visible, .lk-root [tabindex]:focus-visible {
    outline: 2px solid ${ACCENT}; outline-offset: 2px;
  }

  .lk-sr {
    position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
  }
  .lk-skip {
    position: fixed; left: 12px; top: -60px; z-index: 90;
    display: inline-flex; align-items: center; min-height: 44px;
    background: ${INK}; color: ${GROUND}; padding: 12px 18px;
    font-family: ${DISPLAY}; font-size: 12px; letter-spacing: 0.14em;
    text-transform: uppercase; transition: top .25s ease;
  }
  .lk-skip:focus-visible { top: 12px; }

  /* ── drift frames (Heklusýn device) ── */
  .lk-frame { position: relative; overflow: hidden; width: 100%; }
  .lk-frame-in { position: absolute; inset: calc(var(--dz, 9%) * -1) 0; will-change: transform; }
  .lk-frame-in > img { width: 100%; height: 100%; object-fit: cover; }
  /* A drift frame paints its image at ~1.42x its own box width: the --dz
     overhang makes the cover box 1.243x taller than the frame, and the
     corridor parallax scales the <img> a further 1.14x. --lk-fh is the frame
     height at which that product lands exactly on the file's intrinsic width,
     so a tall screen can never make the big panels outrun their own pixels. */
  .lk-stop-frame { max-height: var(--lk-fh, none); max-width: var(--lk-fw, none); }

  /* ── reveals: resting state under reduced motion is fully visible ── */
  @keyframes lk-rise {
    from { opacity: 0; transform: translateY(26px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lk-rise-soft {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .lk-reveal { opacity: 0; transform: translateY(26px); }
  .lk-reveal.is-in { animation: lk-rise 0.9s ${EASE} both; }
  .lk-reveal-soft { opacity: 0; transform: translateY(12px); }
  .lk-reveal-soft.is-in { animation: lk-rise-soft 0.7s ${EASE} both; }

  /* hairline rule that draws in with its reveal (Búðir .bu-rule-draw idea) */
  .lk-rule-draw { transform: scaleX(0); transform-origin: left center; }
  .is-in .lk-rule-draw {
    transform: scaleX(1); transition: transform 1s ${EASE} 0.08s;
  }

  /* ── metadata pill chips — the ONLY rounded surfaces on the page ── */
  .lk-chip {
    display: inline-flex; align-items: center; gap: 7px;
    border-radius: 999px; padding: 6px 13px;
    font-family: ${DISPLAY}; font-size: 12px; font-weight: 500;
    letter-spacing: 0.14em; text-transform: uppercase; white-space: nowrap;
  }
  .lk-chip-accent { border: 1px solid ${ACCENT}; color: ${ACCENT_DEEP}; }
  .lk-chip-ink { border: 1px solid rgba(20,20,15,0.34); color: ${MUT}; }
  .lk-chip-paper { border: 1px solid ${HAIR_PAPER}; color: ${PAPER_MUTE}; }

  /* ── buttons — laxa micro-caps DNA, sharp corners (pills are metadata) ── */
  .lk-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 10px;
    min-height: 46px; border-radius: 2px; padding: 12px 26px;
    font-family: ${DISPLAY}; font-size: 12px; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase; white-space: nowrap;
    transition: color .4s ${EASE}, border-color .4s ${EASE}, background-color .4s ${EASE};
  }
  .lk-btn-solid { background: ${ACCENT}; color: #FFFFFF; border: 1px solid ${ACCENT}; }
  .lk-btn-ghost { background: transparent; color: ${INK}; border: 1px solid ${ACCENT}; }

  /* text link rows — hairline separations carried by the single accent */
  .lk-row {
    position: relative; display: flex; align-items: center; justify-content: space-between;
    gap: 16px; min-height: 56px; padding: 14px 2px; text-decoration: none; color: ${INK};
    border-bottom: 1px solid ${ACCENT};
  }
  .lk-row .lk-row-arrow { color: ${ACCENT_DEEP}; transition: transform .45s ${EASE}; }

  /* real N4 press video — sharp corners, hairline border, no shadow */
  .lk-video-frame { overflow: hidden; border-radius: 4px; border: 1px solid ${ACCENT}; }
  .lk-video-frame:focus-visible { outline: 2px solid ${ACCENT_DEEP}; outline-offset: 2px; }

  /* ── HERO — wordmark-as-mask, resolves ONCE ─────────────────────────────
     Resting state (no JS armed, reduced motion, crawler) is the RESOLVED
     state: photo visible, solid wordmark. The cutout veil only exists while
     .lk-js is present and the hero has not resolved. */
  .lk-hero { position: relative; height: 100svh; overflow: hidden; background: ${INK}; }
  .lk-hero-photo { position: absolute; inset: 0; }
  .lk-hero-photo img { filter: saturate(.96); }
  /* under-veil darkener: makes the photo read INSIDE the letterforms against
     the stone ground. Fades away with the veil on resolve. */
  .lk-hero-shade { position: absolute; inset: 0; background: ${INK}; opacity: 0; }
  .lk-hero-veil { position: absolute; inset: 0; opacity: 0; }
  .lk-hero-solid { position: absolute; inset: 0; opacity: 1; transform-origin: 50% 40%; }
  .lk-hero-veil svg, .lk-hero-solid svg { display: block; width: 100%; height: 100%; }
  .lk-hero-type {
    font-family: ${DISPLAY}; font-weight: 700; letter-spacing: -0.02em;
    font-size: clamp(44px, 17vw, 284px); text-anchor: middle;
  }
  .lk-js:not(.lk-done) .lk-hero-shade { opacity: 0.6; }
  .lk-js:not(.lk-done) .lk-hero-veil { opacity: 1; }
  .lk-js:not(.lk-done) .lk-hero-solid { opacity: 0; }
  .lk-done .lk-hero-shade { opacity: 0; transition: opacity 1.1s ease .05s; }
  .lk-done .lk-hero-veil { opacity: 0; transition: opacity 1s ease .05s; }
  @keyframes lk-dock {
    0%   { opacity: 0; transform: none; }
    26%  { opacity: 1; transform: none; }
    52%  { opacity: 1; transform: none; }
    100% { opacity: 0; transform: translate(-33vw, -34vh) scale(0.18); }
  }
  .lk-js.lk-done .lk-hero-solid { animation: lk-dock 1.9s ${EASE} 0.12s forwards; }

  /* ground-toned scrim under the hero's bottom content, always present */
  .lk-hero-foot {
    position: absolute; inset: auto 0 0 0; z-index: 6;
    padding: 120px 20px 26px;
    background: linear-gradient(to top, rgba(240,239,232,0.97) 0%, rgba(240,239,232,0.9) 46%, rgba(240,239,232,0) 100%);
  }
  .lk-hero-credit {
    position: absolute; right: 20px; top: 84px; z-index: 6;
    font-family: ${DISPLAY}; font-size: 12px; letter-spacing: 0.14em;
    text-transform: uppercase; color: ${INK};
    background: rgba(240,239,232,0.85); padding: 6px 10px;
  }

  /* header wordmark waits for the dock */
  .lk-mark { opacity: 1; transition: opacity .6s ease; }
  .lk-js:not(.lk-done) .lk-mark { opacity: 0; }
  .lk-js.lk-done .lk-mark { transition-delay: 1.35s; }

  /* ── corridor — vertical stacked list by default (phones, coarse pointer,
     reduced motion). The horizontal journey CSS exists ONLY inside the
     desktop fine-pointer motion-ok query below. ── */
  .lk-journey { position: relative; background: ${GROUND}; }
  .lk-stop { position: relative; }
  .lk-stop-core { width: 100%; }
  .lk-hud { display: none; }
  /* the corridor scroll hint and the centering tail exist ONLY where the
     horizontal journey itself exists — never in the stacked fallback */
  .lk-hint { display: none; }
  .lk-track-tail { display: none; }

  /* ── MOUNTED PLATES — the resolution rule, expressed in CSS ─────────────
     Six of the nine exhibition images the museum publishes are small; several
     are screenshots they uploaded to their own site and nothing larger exists
     anywhere. So a plate is sized from the FILE, never from the panel:
       --lk-pw  0.8x the file's true intrinsic width  (the outer ceiling)
       --lk-ar  the file's aspect ratio               (w / h, unitless)
     and on the desktop corridor a viewport-height term keeps the whole
     wall-label composition inside one 100svh panel. Nothing may raise these:
     an image is never drawn wider than its own pixels. */
  .lk-platefig {
    margin: 0; display: flex; flex-direction: column; align-items: flex-start;
    gap: 10px; order: -1;
  }
  .lk-plate {
    width: min(var(--lk-pw), 100%);
    padding: 10px; background: #FFFFFF; border: 1px solid ${ACCENT};
  }
  .lk-plate > img { display: block; width: 100%; height: auto; }
  .lk-platecap {
    margin: 0; font-family: ${DISPLAY}; font-size: 12px; letter-spacing: 0.14em;
    text-transform: uppercase; color: ${MUT};
  }
  .lk-labelgrid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 20px; }
  .lk-labelcol { display: flex; flex-direction: column; gap: 8px; }
  .lk-labelrule { height: 1px; width: 100%; background: ${ACCENT}; }

  @media (min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
    .lk-journey { height: 100svh; overflow: hidden; }
    .lk-track {
      display: flex; width: max-content; height: 100svh; align-items: stretch;
      will-change: transform; backface-visibility: hidden;
    }
    .lk-stop { flex: none; height: 100svh; display: flex; align-items: center; overflow: hidden; }
    /* the pinned journey zeroes the stacked rhythm HERE, not via md: utility
       classes — tablets and reduced-motion desktops get the stacked fallback
       at >=768px and must keep the mobile padding */
    .lk-journey .lk-stop { padding: 0; }
    .lk-hint { display: block; }
    /* trailing spacer so the LAST stop (56vw) lands dead-centre at x=-maxX:
       (100vw - 56vw) / 2 — the walk must end on a sharp, centred frame */
    .lk-track-tail { display: block; flex: none; width: 22vw; height: 100svh; }
    .lk-stop-core {
      display: flex; flex-direction: column; justify-content: center;
      gap: 2.4svh; padding: 10svh 4vw 12svh; will-change: transform, filter;
    }
    .lk-stop-intro { width: 46vw; }
    .lk-stop-std { width: 56vw; }
    .lk-stop-wide { width: 76vw; }
    .lk-stop-plate { width: 56vw; }
    /* the wall-label panels are the WIDEST stops and carry the SMALLEST
       images: the ground around a modest reproduction is the composition */
    .lk-stop-small { width: 66vw; }
    .lk-labelgrid { grid-template-columns: minmax(180px, 1fr) auto; gap: 3vw; align-items: end; }
    .lk-platefig { order: 0; }
    .lk-plate { width: min(var(--lk-pw), 36vw, calc(46svh * var(--lk-ar))); }
    .lk-stop-frame { height: 50svh; width: auto; }
    .lk-stop-wide .lk-stop-frame { height: 56svh; }
    .lk-stop-frame > .lk-frame-in > img { will-change: transform; }
    .lk-hud {
      display: flex; align-items: center; gap: 18px;
      position: absolute; left: 0; right: 0; bottom: 0; z-index: 8;
      padding: 0 32px 18px;
    }
    .lk-hud-rail { position: relative; flex: 1; height: 2px; background: rgba(20,20,15,0.14); }
    .lk-hud-fill {
      position: absolute; inset: 0; background: ${ACCENT};
      transform: scaleX(0); transform-origin: left center;
    }
    /* inside the pinned journey the IO reveals would fire oddly — panels are
       laid out horizontally, so rest them visible and let the DOF carry it */
    .lk-journey .lk-reveal, .lk-journey .lk-reveal-soft {
      opacity: 1; transform: none; animation: none;
    }
    .lk-journey .lk-rule-draw { transform: scaleX(1); }
  }
  @media (max-width: 1023.9px) {
    .lk-stop-frame { width: 100%; height: auto; }
  }

  /* ── mobile type floor: nothing customer-facing below 12px ── */
  .lk-eyebrow {
    font-family: ${DISPLAY}; font-size: 12px; font-weight: 500;
    letter-spacing: 0.14em; text-transform: uppercase;
  }

  /* every link family carries the SAME accent hairline wipe: header nav,
     Fræðsla cards, footer links. One grammar, no opacity fades, no lifts. */
  .lk-nav, .lk-card, .lk-flink { position: relative; }
  .lk-play { border-radius: 2px; background: ${ACCENT}; color: #FFFFFF; }

  /* status dot */
  .lk-dot { width: 9px; height: 9px; border-radius: 999px; display: inline-block; flex: none; }

  /* serif register — Um safnið ONLY */
  .lk-serif { font-family: ${SERIF}; }

  /* ── variable-font letter boxes ──
     Inline-block so the measured width can pin them; the pin is what stops a
     letter gaining weight from reflowing the whole line. */
  .lk-vf-w { display: inline-block; white-space: nowrap; }
  .lk-vf-ch-dom { display: inline-block; text-align: center; }

  /* ══ HOVER VOCABULARY ══════════════════════════════════════════════════
     Every hover state on this page lives inside this one query. On a touch
     screen the rules do not exist at all, so a tap can never strand an
     element in a hover state that nothing will clear. One accent, one
     hairline, house easing, 0.4s to 0.6s. */
  @media (hover: hover) and (pointer: fine) {
    /* buttons stay calm: exactly one state change, no lift, no fade */
    .lk-btn-ghost:hover { background: ${ACCENT}; color: #FFFFFF; }
    .lk-btn-solid:hover { background: ${ACCENT_DEEP}; border-color: ${ACCENT_DEEP}; }

    /* link rows: the accent hairline WIPES in from the left */
    .lk-row::after {
      content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px;
      background: ${ACCENT_DEEP}; transform: scaleX(0); transform-origin: left center;
      transition: transform .55s ${EASE};
    }
    .lk-row:hover::after, .lk-row:focus-visible::after { transform: scaleX(1); }
    .lk-row:hover .lk-row-arrow, .lk-row:focus-visible .lk-row-arrow {
      transform: translate(4px, -4px);
    }

    /* corridor stops: chip fills, artist line lifts, image scales and
       counter-drifts (the scale + counter-drift are written by the shared
       rAF loop on .lk-frame-in, never by a second animation) */
    .lk-stop-hov .lk-chip-accent {
      transition: background-color .5s ${EASE}, color .5s ${EASE}, border-color .5s ${EASE};
    }
    .lk-stop-hov:hover .lk-chip-accent,
    .lk-stop-hov:focus-within .lk-chip-accent { background: ${ACCENT}; color: #FFFFFF; }
    .lk-stop-artist { transition: transform .5s ${EASE}, color .5s ${EASE}; }
    .lk-stop-hov:hover .lk-stop-artist,
    .lk-stop-hov:focus-within .lk-stop-artist { transform: translateY(-5px); color: ${INK}; }
    /* the 250x313 plate has no drift frame, so it gets the same read in CSS */
    .lk-stop-plate figure img { transition: transform .55s ${EASE}; }
    .lk-stop-plate:hover figure img,
    .lk-stop-plate:focus-within figure img { transform: scale(1.03); }
    /* the wall-label plates get NO image transform: a reproduction sized to
       its own pixels must not be scaled past them by a hover. The catalogue
       caption carries the state instead. */
    .lk-stop-small .lk-platecap { transition: color .5s ${EASE}; }
    .lk-stop-small:hover .lk-platecap,
    .lk-stop-small:focus-within .lk-platecap { color: ${ACCENT_DEEP}; }

    .lk-hall:hover { border-color: ${ACCENT}; }

    /* header nav + footer links: the hairline wipes in under the text */
    .lk-nav::after, .lk-flink::after {
      content: ''; position: absolute; left: 0; right: 0; bottom: calc(50% - 0.9em);
      height: 2px; background: ${ACCENT}; transform: scaleX(0);
      transform-origin: left center; transition: transform .55s ${EASE};
    }
    .lk-nav:hover::after, .lk-nav:focus-visible::after,
    .lk-flink:hover::after, .lk-flink:focus-visible::after { transform: scaleX(1); }

    /* Fræðsla cards: the same wipe along the card's own bottom hairline */
    .lk-card::after {
      content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px;
      background: ${ACCENT_DEEP}; transform: scaleX(0); transform-origin: left center;
      transition: transform .55s ${EASE};
    }
    .lk-card:hover::after, .lk-card:focus-visible::after { transform: scaleX(1); }
    .lk-card .lk-row-arrow { transition: transform .5s ${EASE}; }
    .lk-card:hover .lk-row-arrow, .lk-card:focus-visible .lk-row-arrow {
      transform: translate(4px, -4px);
    }

    /* the video trigger joins the accent-fill family: no scale lift */
    .lk-play { transition: background-color .4s ${EASE}; }
    .lk-video-frame:hover .lk-play, .lk-video-frame:focus-visible .lk-play {
      background: ${ACCENT_DEEP};
    }
  }

  /* ══ §HÚSIÐ — schematic hall index + the museum's own floor plan ══════ */
  .lk-halls { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
  @media (min-width: 560px) { .lk-halls { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
  .lk-hall {
    position: relative; display: flex; flex-direction: column; align-items: stretch;
    gap: 5px; min-height: 96px; padding: 10px 11px; text-align: left; cursor: pointer;
    border: 1px solid rgba(20,20,15,0.26); border-radius: 2px;
    background: transparent; color: ${INK};
    transition: background-color .4s ${EASE}, border-color .4s ${EASE}, color .4s ${EASE};
  }
  .lk-hall-n {
    font-family: ${DISPLAY}; font-size: 12px; font-weight: 500; letter-spacing: 0.14em;
    text-transform: uppercase; color: ${MUT}; transition: color .4s ${EASE};
  }
  .lk-hall-t {
    font-family: ${DISPLAY}; font-size: 12px; line-height: 1.32; color: ${MUT};
    transition: color .4s ${EASE};
  }
  .lk-hall.is-lit { background: ${ACCENT}; border-color: ${ACCENT}; color: #FFFFFF; }
  .lk-hall.is-lit .lk-hall-n, .lk-hall.is-lit .lk-hall-t { color: #FFFFFF; }

  .lk-showrow {
    position: relative; display: flex; align-items: baseline; justify-content: space-between;
    gap: 14px; width: 100%; min-height: 56px; padding: 12px 8px; text-align: left;
    border-top: 1px solid rgba(20,20,15,0.26); background: transparent; color: ${INK};
    cursor: pointer; transition: background-color .4s ${EASE}, border-color .4s ${EASE};
  }
  .lk-showrow:last-child { border-bottom: 1px solid rgba(20,20,15,0.26); }
  .lk-showrow-halls {
    font-family: ${DISPLAY}; font-size: 12px; font-weight: 500; letter-spacing: 0.14em;
    text-transform: uppercase; white-space: nowrap; color: ${ACCENT_DEEP};
    transition: color .4s ${EASE};
  }
  .lk-showrow.is-lit { background: rgba(192,62,49,0.08); border-color: ${ACCENT}; }
  .lk-showrow.is-lit + .lk-showrow { border-top-color: ${ACCENT}; }
  .lk-showrow::after {
    content: ''; position: absolute; left: 0; right: 0; top: -1px; height: 2px;
    background: ${ACCENT}; transform: scaleX(0); transform-origin: left center;
    transition: transform .55s ${EASE};
  }
  .lk-showrow.is-lit::after { transform: scaleX(1); }

  .lk-plan { position: relative; border: 1px solid ${ACCENT}; background: #FFFFFF; }
  .lk-plan img { display: block; width: 100%; height: auto; }
  .lk-planpin {
    position: absolute; width: 34px; height: 34px; margin: -17px 0 0 -17px;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid ${ACCENT}; border-radius: 999px;
    background: rgba(240,239,232,0.55);
    font-family: ${DISPLAY}; font-size: 12px; font-weight: 600; letter-spacing: 0.04em;
    color: ${ACCENT_DEEP};
    transition: background-color .4s ${EASE}, color .4s ${EASE}, transform .4s ${EASE};
  }
  .lk-planpin.is-lit { background: ${ACCENT}; color: #FFFFFF; transform: scale(1.2); }

  /* ══ LOADER — "húsið opnast, salur fyrir sal" ════════════════════════════
     The twelve-cell hall schematic of §Húsið, switched on. Same grid rhythm
     (3 cols under 560px, 4 above, 8px gap, 1px hairline, 2px radius, the
     same ~1.6 cell ratio) so the page rhymes with itself: the progress meter
     IS the museum's floor plan, not a bar bolted on top of it.

     Motion budget: transform + colour only. Twelve discrete steps over the
     whole life of the sheet, so there is no per-frame work of any kind and
     no second rAF loop — the fills are CSS transitions, driven by a class
     that changes at most twelve times.

     The sheet NEVER touches document/body overflow. That is deliberate: a
     loader that locks scroll is one bad code path away from a permanently
     frozen page, and on a phone it eats the first swipe. Instead the sheet
     is opaque and capped, and any input lands it at once. ══════════════ */
  .lk-load {
    position: fixed; inset: 0; z-index: 200; background: ${GROUND};
    display: flex; align-items: center; justify-content: center;
    padding: 28px 20px;
    transform: translateY(0);
  }
  .lk-load-in { width: min(560px, 100%); }
  /* exit — one composed gesture: the sheet lifts, the plate leaves slightly
     ahead of it, and the hero is simply there underneath in its own resting
     state (the loader never touches .lk-js / .lk-done). */
  .lk-load.is-out { transform: translateY(-101%); transition: transform .7s ${EASE}; }
  .lk-load.is-out .lk-load-in {
    opacity: 0; transform: translateY(-7%);
    transition: opacity .24s ease-in, transform .7s ${EASE};
  }

  .lk-load-mark {
    margin: 0; font-family: ${DISPLAY}; font-weight: 500;
    font-size: clamp(24px, 5.2vw, 44px); line-height: 1.02;
    letter-spacing: -0.02em; text-transform: uppercase; color: ${INK};
  }
  .lk-load-mark span { display: block; }

  /* the strip: one hairline track, one accent fill driven by real progress */
  .lk-load-track {
    position: relative; height: 2px; margin-top: 22px;
    background: rgba(20,20,15,0.16); overflow: hidden;
  }
  .lk-load-bar {
    position: absolute; inset: 0; background: ${ACCENT};
    transform: scaleX(0); transform-origin: 0 50%;
    transition: transform .34s ${EASE};
  }
  .lk-load-meta {
    display: flex; align-items: baseline; justify-content: space-between;
    gap: 14px; margin-top: 12px;
  }
  .lk-load-count { font-variant-numeric: tabular-nums; color: ${ACCENT_DEEP}; }

  @media (prefers-reduced-motion: reduce) {
    /* belt and braces: the component already never mounts here */
    .lk-load { display: none !important; }
    .lk-frame-in { inset: 0; transform: none !important; }
    .lk-reveal, .lk-reveal-soft {
      opacity: 1 !important; transform: none !important; animation: none !important;
    }
    .lk-rule-draw { transform: scaleX(1) !important; transition: none !important; }
    .lk-btn, .lk-btn:hover, .lk-btn:active { transition: none; transform: none; }
    .lk-row .lk-row-arrow { transition: none; }
    /* the whole hover vocabulary collapses to instant, readable state changes */
    .lk-row::after, .lk-showrow::after,
    .lk-nav::after, .lk-flink::after, .lk-card::after { transition: none !important; }
    .lk-card .lk-row-arrow, .lk-play { transition: none !important; }
    .lk-stop-artist, .lk-stop-hov .lk-chip-accent, .lk-stop-plate figure img,
    .lk-platecap, .lk-hall, .lk-hall-n, .lk-hall-t, .lk-showrow, .lk-planpin {
      transition: none !important;
    }
    .lk-stop-hov:hover .lk-stop-artist,
    .lk-stop-hov:focus-within .lk-stop-artist { transform: none !important; }
    .lk-stop-plate:hover figure img,
    .lk-stop-plate:focus-within figure img { transform: none !important; }
    .lk-planpin.is-lit { transform: none !important; }
    .lk-hero-shade, .lk-hero-veil { opacity: 0 !important; transition: none !important; }
    .lk-hero-solid { opacity: 1 !important; animation: none !important; transform: none !important; }
    .lk-mark { opacity: 1 !important; }
  }
`

/* ── the wordmark, drawn twice: once as a cutout mask, once solid ── */
const MARK_L1 = 'LISTASAFNIÐ'
const MARK_L2 = 'Á AKUREYRI'

function WordmarkSvg({ mode }: { mode: 'cut' | 'solid' }) {
  const lines = (fill: string) => (
    <>
      <text className="lk-hero-type lk-vf-line" x="50%" y="36%" fill={fill}>
        {vfChars(MARK_L1, 'tspan')}
      </text>
      <text className="lk-hero-type lk-vf-line" x="50%" y="36%" dy="0.98em" fill={fill}>
        {vfChars(MARK_L2, 'tspan')}
      </text>
    </>
  )
  if (mode === 'solid') {
    return (
      <svg aria-hidden="true" focusable="false">
        {lines(INK)}
      </svg>
    )
  }
  return (
    <svg aria-hidden="true" focusable="false">
      <defs>
        <mask id="lk-wordmark-cut">
          <rect width="100%" height="100%" fill="#FFFFFF" />
          {lines('#000000')}
        </mask>
      </defs>
      <rect width="100%" height="100%" fill={GROUND} mask="url(#lk-wordmark-cut)" />
    </svg>
  )
}

/* ── nav ── */
const NAV_LINKS = [
  { id: 'syningar', label: 'Sýningarnar' },
  { id: 'husid', label: 'Húsið' },
  { id: 'framundan', label: 'Framundan' },
  { id: 'fraedsla', label: 'Fræðsla' },
  { id: 'ketilhus', label: 'Ketilhús' },
  { id: 'um', label: 'Um safnið' },
]

function goTo(id: string) {
  const target = document.getElementById(id)
  if (!target) return
  if (pageLenis) {
    pageLenis.scrollTo(target, { offset: 0, immediate: prefersReduced() })
  } else {
    target.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' })
  }
}

function Header() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-40"
      style={{
        background: 'rgba(240,239,232,0.92)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${ACCENT}`,
      }}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:px-8">
        <button
          onClick={() => (pageLenis ? pageLenis.scrollTo(0, {}) : window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' }))}
          className="lk-mark flex min-h-[44px] items-center"
          aria-label="Listasafnið á Akureyri, efst á síðu"
        >
          <img src={IMG('logo.png')} alt="Listasafnið á Akureyri" className="h-6 w-auto md:h-7" />
        </button>
        <nav aria-label="Aðalvalmynd" className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => goTo(l.id)}
              className="lk-nav lk-eyebrow min-h-[44px]"
              style={{ color: INK }}
            >
              {l.label}
            </button>
          ))}
          <a href={PHONE_HREF} className="lk-nav lk-eyebrow flex min-h-[44px] items-center" style={{ color: ACCENT_DEEP }}>
            {PHONE_DISPLAY}
          </a>
        </nav>
        <button
          onClick={() => goTo('syningar')}
          className="lk-eyebrow flex min-h-[44px] items-center border px-4 lg:hidden"
          style={{ borderColor: ACCENT, color: ACCENT_DEEP, borderRadius: 2 }}
        >
          Sýningarnar
        </button>
      </div>
    </header>
  )
}

/* ── §1 HERO ── */
function Hero({ status }: { status: OpenStatus | null }) {
  const heroRef = useRef<HTMLElement>(null)
  /* THE cursor device. Rest 700 is the designed wordmark weight, so an idle
     desktop, a touch device and a reduced-motion visitor all see exactly the
     wordmark the brief locked. Bring the pointer into the hero and the mark
     thins to 400 and thickens back to 700 under the cursor. */
  useWeightGroup(heroRef, {
    rest: 700,
    lo: 400,
    hi: 700,
    radiusVw: 0.26,
    pinSvgLines: true,
    measureSel: '.lk-hero-solid',
    mirrorSel: '.lk-hero-veil',
  })
  return (
    <section ref={heroRef} className="lk-hero" id="efst" aria-label="Listasafnið á Akureyri">
      <h1 className="lk-sr">Listasafnið á Akureyri</h1>
      <div className="lk-hero-photo">
        <DriftFrame
          src={IMG('show-zimoun.jpg')}
          w={1300}
          h={867}
          alt="Hljóðinnsetning eftir ZIMOUN í sölum 10 og 11: skúlptúrar úr ljósum viði í hvítum sal"
          drift={13}
          className="h-full"
          eager
        />
      </div>
      <div className="lk-hero-shade" aria-hidden="true" />
      <div className="lk-hero-veil" aria-hidden="true">
        <WordmarkSvg mode="cut" />
      </div>
      <div className="lk-hero-solid" aria-hidden="true">
        <WordmarkSvg mode="solid" />
      </div>

      <p className="lk-hero-credit m-0">ZIMOUN, 2026 · Salir 10–11</p>

      <div className="lk-hero-foot">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-0 md:px-3">
          <p className="lk-eyebrow m-0" style={{ color: ACCENT_DEEP }}>
            Listasafnið á Akureyri · Kaupvangsstræti 8
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <p className="m-0 flex items-center gap-2.5 text-[16px]" style={{ fontFamily: DISPLAY, color: INK }} aria-live="polite">
              {status ? (
                <>
                  <span
                    className="lk-dot"
                    aria-hidden="true"
                    style={{ background: status.open ? OPEN_GREEN : ACCENT_DEEP }}
                  />
                  {status.closedDay
                    ? 'Lokað í dag'
                    : status.open
                      ? `Opið núna · í dag ${status.hoursLabel}`
                      : `Lokað núna · opið í dag ${status.hoursLabel}`}
                </>
              ) : (
                <>
                  <span className="lk-dot" aria-hidden="true" style={{ background: MUT }} />
                  {'Opið alla daga'}
                </>
              )}
            </p>
            <button onClick={() => goTo('syningar')} className="lk-btn lk-btn-ghost">
              Sýningarnar
              <ArrowUpRight size={15} aria-hidden />
            </button>
          </div>
          <p className="m-0 max-w-xl text-[16px] leading-relaxed" style={{ fontFamily: DISPLAY, color: MUT }}>
            {TAGLINE} Níu sýningar í tólf sölum, undir einu þaki.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── §2 STAÐAN Í DAG — live status triptych ── */
function StatusTriptych({ status }: { status: OpenStatus | null }) {
  return (
    <section id="stada" className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 md:py-20" aria-label="Staðan í dag">
      <Reveal>
        <p className="lk-eyebrow m-0" style={{ color: ACCENT_DEEP }}>Staðan í dag</p>
      </Reveal>
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        <Reveal className="h-full">
          <div className="flex h-full flex-col gap-3 p-6" style={{ border: `1px solid ${ACCENT}` }}>
            <h2 className="m-0 text-[19px] font-semibold uppercase tracking-[-0.01em]" style={{ fontFamily: DISPLAY }}>
              Opið í dag
            </h2>
            <p className="m-0 flex items-center gap-2.5 text-[16px]" style={{ fontFamily: DISPLAY, color: INK }}>
              {status ? (
                <>
                  <span className="lk-dot" aria-hidden="true" style={{ background: status.open ? OPEN_GREEN : ACCENT_DEEP }} />
                  {status.closedDay ? 'Lokað í dag' : `${status.hoursLabel}${status.open ? ' · opið núna' : ''}`}
                </>
              ) : 'Opið alla daga'}
            </p>
            <p className="m-0 text-[14px] leading-relaxed" style={{ fontFamily: DISPLAY, color: MUT }}>
              Sumar 10:00–17:00 · vetur 12:00–17:00, alla daga. Lokað 24., 25. og 31. desember og 1. janúar.
            </p>
          </div>
        </Reveal>
        <Reveal delay={80} className="h-full">
          <div className="flex h-full flex-col gap-3 p-6" style={{ border: `1px solid ${ACCENT}` }}>
            <h2 className="m-0 text-[19px] font-semibold uppercase tracking-[-0.01em]" style={{ fontFamily: DISPLAY }}>
              Aðgangur
            </h2>
            <dl className="m-0 flex flex-col gap-1.5">
              {ADMISSION.map((a) => (
                <div key={a.label} className="flex items-baseline justify-between gap-4">
                  <dt className="text-[14px]" style={{ fontFamily: DISPLAY, color: MUT }}>{a.label}</dt>
                  <dd className="m-0 whitespace-nowrap text-[14px] font-medium" style={{ fontFamily: DISPLAY, color: INK }}>{a.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
        <Reveal delay={160} className="h-full">
          <div className="flex h-full flex-col gap-3 p-6" style={{ border: `1px solid ${ACCENT}` }}>
            <h2 className="m-0 text-[19px] font-semibold uppercase tracking-[-0.01em]" style={{ fontFamily: DISPLAY }}>
              Ketilkaffi
            </h2>
            <p className="m-0 text-[15px] leading-relaxed" style={{ fontFamily: DISPLAY, color: INK }}>
              Kaffihús í Ketilhúsi, opið alla daga 08:00–17:00.
            </p>
            <p className="m-0 mt-auto text-[14px] leading-relaxed" style={{ fontFamily: DISPLAY, color: MUT }}>
              {ADDRESS} ·{' '}
              <a href={PHONE_HREF} className="inline-flex min-h-[44px] items-center" style={{ color: ACCENT_DEEP }}>{PHONE_DISPLAY}</a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ── §3 SÝNINGARGANGURINN — the signature device ── */
function StopChips({ show }: { show: Show }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="lk-chip lk-chip-accent">{show.chip}</span>
      {show.dates ? <span className="lk-chip lk-chip-ink">{show.dates}</span> : null}
    </div>
  )
}

/* THE RESOLUTION RULE, in one place: the layout each show gets is decided by
   how many pixels its photograph actually has, never the other way round.

   'full'  (zimoun 1300, eirikur 1400, kristin 1400) keep the big drift frame.
           --lk-fh caps the frame height so the frame's ~1.42x draw factor
           (cover overhang x parallax scale) lands inside the file.
   'small' (fugl 702, magnus 782, ulfur 789, silica 804, hughrif 822) become a
           wall-label composition: a mounted reproduction at roughly 0.6x to
           0.8x of its own pixels, generous ground, and the type carrying the
           panel. This is how a gallery presents a modest reproduction.
   'mini'  (katrín 250) stays the small mounted plate under a huge title. */
function plateVars(show: Show): React.CSSProperties {
  return {
    ['--lk-pw' as string]: `${Math.round(show.natW * 0.8)}px`,
    ['--lk-ar' as string]: String(+(show.natW / show.natH).toFixed(4)),
  }
}

function Stop({ show, index }: { show: Show; index: number }) {
  const ref = useRef<HTMLElement>(null)
  useStopHover(ref)
  const n = String(index + 1).padStart(2, '0')
  const layoutClass =
    show.plate === 'full'
      ? show.layout === 'wide' ? 'lk-stop-wide' : 'lk-stop-std'
      : show.plate === 'mini'
        ? 'lk-stop-plate'
        : 'lk-stop-small'
  const ar = show.natW / show.natH
  return (
    <article
      ref={ref}
      data-stop={show.key}
      className={`lk-stop lk-stop-hov ${layoutClass} px-5 py-10`}
      tabIndex={0}
      aria-label={`Sýning ${n} af 09: ${show.title}${show.artist && show.artist !== show.title ? `, ${show.artist}` : ''}, ${show.chip}`}
    >
      <div className="lk-stop-core">
        <Reveal soft>
          <div className="flex items-baseline justify-between gap-4">
            <StopChips show={show} />
          </div>
        </Reveal>

        {show.plate === 'mini' ? (
          <>
            <Reveal>
              <h3
                className="m-0 mt-4 max-w-[16em] uppercase"
                style={{
                  fontFamily: DISPLAY, fontWeight: 600, letterSpacing: '-0.015em',
                  fontSize: 'clamp(1.7rem, 5vw, 4.6rem)', lineHeight: 1.02,
                  paddingBottom: '0.12em',
                }}
              >
                {show.title}
              </h3>
            </Reveal>
            <Reveal delay={60}>
              <p className="lk-stop-artist m-0 text-[16px] font-medium" style={{ fontFamily: DISPLAY, color: INK }}>{show.artist}</p>
              <p className="lk-stop-artist m-0 mt-1 text-[15px]" style={{ fontFamily: DISPLAY, color: MUT }}>{show.fact}</p>
            </Reveal>
            {/* 250x313 source — mounted as a small wall plate, never upscaled:
                the box is the file's own width and the mat eats 16px of it */}
            <Reveal delay={110}>
              <figure className="m-0 mt-4 flex items-end gap-4">
                <div className="p-2" style={{ border: `1px solid ${ACCENT}`, width: `min(${show.natW}px, 56vw)` }}>
                  <img
                    src={IMG(show.img)}
                    width={show.natW}
                    height={show.natH}
                    alt={show.alt}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full"
                  />
                </div>
                <figcaption className="pb-1 text-[12px] uppercase tracking-[0.14em]" style={{ fontFamily: DISPLAY, color: MUT }}>
                  Verk á sýningunni
                </figcaption>
              </figure>
            </Reveal>
          </>
        ) : show.plate === 'small' ? (
          <>
            {/* WALL LABEL. The source is 702px to 822px wide, so the plate is
                capped well under 1:1 and the panel is carried by the type
                beside it. Mirror image of the Katrín plate on purpose: label
                left, reproduction right, caption under the mat, not beside. */}
            <Reveal>
              <h3
                className="m-0 mt-3 max-w-[13em] uppercase"
                style={{
                  fontFamily: DISPLAY, fontWeight: 600, letterSpacing: '-0.015em',
                  fontSize: 'clamp(1.5rem, 3vw, 2.9rem)', lineHeight: 1.04,
                  paddingBottom: '0.12em',
                }}
              >
                {show.title}
              </h3>
            </Reveal>
            <Reveal delay={70}>
              <div className="lk-labelgrid mt-3">
                <div className="lk-labelcol">
                  <div className="lk-rule-draw lk-labelrule" aria-hidden="true" />
                  {show.artist && show.artist !== show.title ? (
                    <p className="lk-stop-artist m-0 text-[16px] font-medium" style={{ fontFamily: DISPLAY, color: INK }}>
                      {show.artist}
                    </p>
                  ) : null}
                  <p className="lk-stop-artist m-0 text-[15px] leading-relaxed" style={{ fontFamily: DISPLAY, color: MUT }}>
                    {show.fact}
                  </p>
                  {show.datesNote ? (
                    <p className="m-0 text-[14px] leading-relaxed" style={{ fontFamily: DISPLAY, color: MUT }}>
                      {show.datesNote}
                    </p>
                  ) : null}
                </div>
                <figure className="lk-platefig">
                  <div className="lk-plate" style={plateVars(show)}>
                    <img
                      src={IMG(show.img)}
                      width={show.natW}
                      height={show.natH}
                      alt={show.alt}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <figcaption className="lk-platecap">Verk úr sýningunni · {show.chip}</figcaption>
                </figure>
              </div>
            </Reveal>
          </>
        ) : (
          <>
            <Reveal>
              <DriftFrame
                src={IMG(show.img)}
                w={show.natW}
                h={show.natH}
                srcSet={show.img800 ? `${IMG(show.img800)} 800w, ${IMG(show.img)} ${show.natW}w` : undefined}
                /* sizes describes the width the image is actually PAINTED at,
                   not the width of its box: a drift frame draws ~1.42x its box
                   (measured), so 76vw of box is ~88vw of pixels. */
                sizes={show.img800 ? (show.layout === 'wide' ? '(min-width: 1024px) 88vw, 100vw' : '(min-width: 1024px) 56vw, 100vw') : undefined}
                alt={show.alt}
                drift={9}
                className="lk-stop-frame"
                style={{
                  aspectRatio: String(ar),
                  /* --lk-fh caps the pinned corridor (height drives the frame);
                     --lk-fw caps the stacked fallback, where a wide viewport
                     would otherwise hand a 1300px file a 1400px box */
                  ['--lk-fh' as string]: `${Math.floor(show.natW / (1.42 * ar))}px`,
                  ['--lk-fw' as string]: `${show.natW}px`,
                }}
              />
            </Reveal>
            <Reveal delay={60}>
              <h3
                className="m-0 mt-2 uppercase"
                style={{
                  fontFamily: DISPLAY, fontWeight: 600, letterSpacing: '-0.015em',
                  fontSize: 'clamp(1.6rem, 5vw, 4.2rem)', lineHeight: 1.02,
                  paddingBottom: '0.12em',
                }}
              >
                {show.title}
              </h3>
            </Reveal>
            <Reveal delay={100}>
              <p className="lk-stop-artist m-0 text-[16px]" style={{ fontFamily: DISPLAY, color: MUT }}>
                {show.artist && show.artist !== show.title ? (
                  <span className="font-medium" style={{ color: INK }}>{show.artist} · </span>
                ) : null}
                {show.fact}
                {show.datesNote ? <span> · {show.datesNote}</span> : null}
              </p>
            </Reveal>
          </>
        )}
      </div>
    </article>
  )
}

function Corridor() {
  return (
    <section id="syningar" className="lk-journey" aria-label="Sýningargangurinn, níu sýningar í gangi">
      <div className="lk-track">
        <div className="lk-stop lk-stop-intro px-5 py-16">
          <div className="lk-stop-core md:pl-[6vw]">
            <Reveal>
              <p className="lk-eyebrow m-0" style={{ color: ACCENT_DEEP }}>Sýningargangurinn</p>
            </Reveal>
            <Reveal delay={70}>
              <h2
                className="m-0 mt-3 uppercase"
                style={{
                  fontFamily: DISPLAY, fontWeight: 600, letterSpacing: '-0.015em',
                  fontSize: 'clamp(2rem, 5.4vw, 5rem)', lineHeight: 1.0, paddingBottom: '0.12em',
                }}
              >
                Níu sýningar, tólf salir
              </h2>
            </Reveal>
            <Reveal delay={130}>
              <p className="m-0 mt-2 max-w-md text-[16px] leading-relaxed" style={{ fontFamily: DISPLAY, color: MUT }}>
                {TAGLINE} Gengið er í salaröð, frá Sal 01 að Sal 12.
              </p>
            </Reveal>
            <Reveal delay={180}>
              <p className="lk-eyebrow lk-hint m-0 mt-2" style={{ color: MUT }}>
                Skrunaðu · gangurinn liggur til hægri
              </p>
            </Reveal>
          </div>
        </div>
        {SHOWS.map((show, i) => (
          <Stop key={show.key} show={show} index={i} />
        ))}
        <div className="lk-track-tail" aria-hidden="true" />
      </div>
      <div className="lk-hud" aria-hidden="true">
        <div className="lk-hud-rail"><div className="lk-hud-fill" /></div>
        <span className="lk-eyebrow lk-hud-count" style={{ color: INK }}>01/09</span>
      </div>
    </section>
  )
}

/* ── §3.5 HÚSIÐ — the live wayfinder ──────────────────────────────────────
   The museum's real visitor problem: nine shows are on at once and nothing
   tells you which one is in which hall. This answers it, two ways at once.

   HONESTY, stated in code because it is the load-bearing decision here:
   the twelve-cell grid is a SCHEMATIC index, drawn in CSS, labelled as a
   schematic in the copy. It asserts the ORDER of the halls, nothing about
   the building's geometry. The museum's own published drawing sits beside
   it as the real artefact, and the only things marked on it are the five
   hall numerals that are actually printed on that sheet (01 to 05), at the
   positions those numerals actually occupy. Halls 06 to 12 are not on that
   sheet and are therefore not marked on it. No coordinate anywhere in this
   section was invented. */
function Husid() {
  const [hall, setHall] = useState<string | null>(null)
  const headRef = useRef<HTMLHeadingElement>(null)
  /* the cursor primitive, reused ONCE more and nowhere else */
  useWeightGroup(headRef, { rest: 600, lo: 420, hi: 700, radiusVw: 0.16, fixWidths: true })

  const showOf = (key: string | null) => (key ? SHOWS.find((s) => s.key === key) ?? null : null)
  const activeKey = hall ? HALLS.find((h) => h.id === hall)?.showKey ?? null : null
  const hallsOf = (key: string) => HALLS.filter((h) => h.showKey === key).map((h) => h.id)

  const enter = (id: string | null) => setHall(id)
  const mouseOnly = (e: React.PointerEvent, id: string | null) => {
    if (e.pointerType !== 'mouse') return
    setHall(id)
  }
  /* Tap path. It must NOT toggle: on touch the button takes focus first
     (onFocus lights it) and the click lands a beat later, so a toggle would
     immediately switch the highlight back off. Setting is idempotent; blur,
     or a tap on another cell, clears it. */
  const press = (id: string) => setHall(id || null)

  return (
    <section
      id="husid"
      className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 md:py-24"
      aria-label="Húsið, hvaða sýning er í hvaða sal"
    >
      <Reveal>
        <p className="lk-eyebrow m-0" style={{ color: ACCENT_DEEP }}>Húsið</p>
      </Reveal>
      <Reveal delay={60}>
        <h2
          ref={headRef}
          className="m-0 mt-3 uppercase"
          style={{
            fontFamily: DISPLAY, fontWeight: 600, letterSpacing: '-0.015em',
            fontSize: 'clamp(1.8rem, 4vw, 3.4rem)', lineHeight: 1.02, paddingBottom: '0.12em',
          }}
        >
          {vfChars('Hvaða sýning er í hvaða sal', 'span')}
        </h2>
      </Reveal>
      <Reveal delay={110}>
        <p className="m-0 mt-3 max-w-[42em] text-[16px] leading-relaxed" style={{ fontFamily: DISPLAY, color: MUT }}>
          Níu sýningar standa yfir í tólf sölum. Veldu sal eða sýningu, þá lýsist hitt upp á móti.
        </p>
      </Reveal>

      <div className="mt-9 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12">
        {/* the schematic index */}
        <Reveal delay={60}>
          <h3 className="lk-eyebrow m-0" style={{ color: MUT }}>Salirnir tólf · skýringarmynd</h3>
          <div className="lk-halls mt-3" role="group" aria-label="Salir safnsins">
            {HALLS.map((h) => {
              const s = showOf(h.showKey)
              const isLit = h.id === hall || (activeKey !== null && h.showKey === activeKey)
              return (
                <button
                  key={h.id}
                  type="button"
                  className={`lk-hall ${isLit ? 'is-lit' : ''}`}
                  aria-pressed={isLit}
                  onPointerEnter={(e) => mouseOnly(e, h.id)}
                  onPointerLeave={(e) => mouseOnly(e, null)}
                  onFocus={() => enter(h.id)}
                  onBlur={() => enter(null)}
                  onClick={() => press(h.id)}
                >
                  <span className="lk-hall-n">Salur {h.id}</span>
                  <span className="lk-hall-t">{s ? s.title : HALL_EMPTY}</span>
                </button>
              )
            })}
          </div>
          <p className="m-0 mt-3 text-[13px] leading-relaxed" style={{ fontFamily: DISPLAY, color: MUT }}>
            Skýringarmyndin sýnir röð salanna, ekki lögun hússins eða stærð þeirra.
          </p>
        </Reveal>

        {/* the nine shows, linked back */}
        <Reveal delay={120}>
          <h3 className="lk-eyebrow m-0" style={{ color: MUT }}>Sýningarnar níu</h3>
          <div className="mt-3">
            {SHOWS.map((s) => {
              const halls = hallsOf(s.key)
              const isLit = activeKey === s.key
              return (
                <button
                  key={s.key}
                  type="button"
                  className={`lk-showrow ${isLit ? 'is-lit' : ''}`}
                  aria-pressed={isLit}
                  onPointerEnter={(e) => mouseOnly(e, halls[0] ?? null)}
                  onPointerLeave={(e) => mouseOnly(e, null)}
                  onFocus={() => enter(halls[0] ?? null)}
                  onBlur={() => enter(null)}
                  onClick={() => press(halls[0] ?? '')}
                >
                  <span className="flex flex-col gap-1">
                    <span
                      className="text-[16px] font-medium uppercase tracking-[-0.01em] md:text-[18px]"
                      style={{ fontFamily: DISPLAY }}
                    >
                      {s.title}
                    </span>
                    <span className="text-[13px]" style={{ fontFamily: DISPLAY, color: MUT }}>
                      {s.artist && s.artist !== s.title ? s.artist : s.fact}
                    </span>
                  </span>
                  <span className="lk-showrow-halls">{s.chip}</span>
                </button>
              )
            })}
          </div>
        </Reveal>
      </div>

      {/* the museum's own drawing */}
      <Reveal delay={80}>
        <figure className="m-0 mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start lg:gap-12">
          <div className="lk-plan">
            <img
              src={IMG(FLOORPLAN.src)}
              width={FLOORPLAN.w}
              height={FLOORPLAN.h}
              loading="lazy"
              decoding="async"
              alt="Grunnteikning Listasafnsins á Akureyri. Á teikningunni eru salir 01 til 05 tölusettir með rauðu."
            />
            {FLOORPLAN.marks.map((m) => {
              const isLit = m.id === hall || (activeKey !== null && HALLS.find((h) => h.id === m.id)?.showKey === activeKey)
              return (
                <span
                  key={m.id}
                  className={`lk-planpin ${isLit ? 'is-lit' : ''}`}
                  style={{ left: `${m.x}%`, top: `${m.y}%` }}
                  aria-hidden="true"
                >
                  {m.id}
                </span>
              )
            })}
          </div>
          <figcaption className="flex flex-col gap-4">
            <p className="lk-eyebrow m-0" style={{ color: ACCENT_DEEP }}>Grunnteikning</p>
            <p className="m-0 text-[15px] leading-relaxed" style={{ fontFamily: DISPLAY, color: INK }}>
              Safnið birtir sjálft grunnteikningar af húsinu. Þetta er teikning þeirra, óbreytt.
            </p>
            <p className="m-0 text-[14px] leading-relaxed" style={{ fontFamily: DISPLAY, color: MUT }}>
              Á þessari teikningu eru fimm salir tölusettir, salir 01 til 05, og hringirnir sitja
              á þeim tölum. Salir 06 til 12 eru ekki á þessu blaði og eru því ekki merktir hér.
            </p>
            <a href={SITE_URL} target="_blank" rel="noreferrer" className="lk-row" style={{ borderTop: `1px solid ${ACCENT}`, borderBottom: 'none' }}>
              <span className="text-[15px] font-medium uppercase tracking-[-0.01em]" style={{ fontFamily: DISPLAY }}>
                Grunnteikningar á listak.is
              </span>
              <ArrowUpRight size={16} className="lk-row-arrow" aria-hidden />
            </a>
          </figcaption>
        </figure>
      </Reveal>
    </section>
  )
}

/* ── §4 FRAMUNDAN ── */
function Upcoming() {
  return (
    <section id="framundan" className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 md:py-24" aria-label="Framundan">
      <Reveal>
        <p className="lk-eyebrow m-0" style={{ color: ACCENT_DEEP }}>Framundan</p>
      </Reveal>
      <Reveal delay={60}>
        <h2
          className="m-0 mt-3 uppercase"
          style={{
            fontFamily: DISPLAY, fontWeight: 600, letterSpacing: '-0.015em',
            fontSize: 'clamp(1.8rem, 4vw, 3.4rem)', lineHeight: 1.02, paddingBottom: '0.12em',
          }}
        >
          Á dagskrá safnsins
        </h2>
      </Reveal>
      <div className="mt-8">
        {UPCOMING.map((title, i) => (
          <Reveal key={title} soft delay={i * 40}>
            <div className="lk-rule-draw h-px w-full" style={{ background: ACCENT }} aria-hidden="true" />
            <a href={SITE_URL} target="_blank" rel="noreferrer" className="lk-row" style={{ borderBottom: 'none' }}>
              <span className="flex items-baseline gap-5">
                <span className="lk-eyebrow" style={{ color: MUT }} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[17px] font-medium uppercase tracking-[-0.01em] md:text-[20px]" style={{ fontFamily: DISPLAY }}>
                  {title}
                </span>
              </span>
              <ArrowUpRight size={17} className="lk-row-arrow" aria-hidden />
            </a>
          </Reveal>
        ))}
        <Reveal soft>
          <div className="lk-rule-draw h-px w-full" style={{ background: ACCENT }} aria-hidden="true" />
        </Reveal>
      </div>
      <Reveal delay={80}>
        <p className="m-0 mt-5 text-[14px]" style={{ fontFamily: DISPLAY, color: MUT }}>
          Dagsetningar birtast á listak.is þegar nær dregur.
        </p>
      </Reveal>
    </section>
  )
}

/* ── §5 FRÆÐSLA ── */
function Education() {
  return (
    <section id="fraedsla" className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 md:py-24" aria-label="Fræðsla og fyrirlestrar">
      <Reveal>
        <p className="lk-eyebrow m-0" style={{ color: ACCENT_DEEP }}>Fræðsla og fyrirlestrar</p>
      </Reveal>
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        {EDUCATION.map((e, i) => (
          <Reveal key={e.title} delay={i * 80} className="h-full">
            <a
              href={SITE_URL}
              target="_blank"
              rel="noreferrer"
              className="lk-card flex h-full flex-col gap-3 p-6 no-underline"
              style={{ border: `1px solid ${ACCENT}`, color: INK }}
            >
              <h3 className="m-0 text-[19px] font-semibold uppercase tracking-[-0.01em]" style={{ fontFamily: DISPLAY }}>
                {e.title}
              </h3>
              <p className="m-0 text-[15px]" style={{ fontFamily: DISPLAY, color: MUT }}>{e.line}</p>
              <span className="lk-eyebrow mt-auto flex items-center gap-2" style={{ color: ACCENT_DEEP }}>
                Nánar á listak.is
                <ArrowUpRight size={14} className="lk-row-arrow" aria-hidden />
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ── §6 KETILHÚS · KETILKAFFI · SAFNBÚÐIN ── */
function Ketilhus() {
  return (
    <section id="ketilhus" className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 md:py-24" aria-label="Ketilhús og Ketilkaffi">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <p className="lk-eyebrow m-0" style={{ color: ACCENT_DEEP }}>Í húsinu</p>
          </Reveal>
          <Reveal delay={60}>
            <h2
              className="m-0 mt-3 uppercase"
              style={{
                fontFamily: DISPLAY, fontWeight: 600, letterSpacing: '-0.015em',
                fontSize: 'clamp(1.8rem, 4vw, 3.4rem)', lineHeight: 1.02, paddingBottom: '0.12em',
              }}
            >
              Ketilhús og Ketilkaffi
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-6 flex flex-col">
              <div className="py-4" style={{ borderTop: `1px solid ${ACCENT}` }}>
                <h3 className="m-0 text-[17px] font-semibold uppercase tracking-[-0.01em]" style={{ fontFamily: DISPLAY }}>Ketilhús</h3>
                <p className="m-0 mt-1.5 text-[15px] leading-relaxed" style={{ fontFamily: DISPLAY, color: MUT }}>
                  Viðburðahús safnsins: sýningarrými og útleiga fyrir viðburði.
                </p>
              </div>
              <div className="py-4" style={{ borderTop: `1px solid ${ACCENT}` }}>
                <h3 className="m-0 text-[17px] font-semibold uppercase tracking-[-0.01em]" style={{ fontFamily: DISPLAY }}>Ketilkaffi</h3>
                <p className="m-0 mt-1.5 text-[15px] leading-relaxed" style={{ fontFamily: DISPLAY, color: MUT }}>
                  Kaffihús í Ketilhúsi, opið alla daga 08:00–17:00.
                </p>
              </div>
              <div className="py-4" style={{ borderTop: `1px solid ${ACCENT}`, borderBottom: `1px solid ${ACCENT}` }}>
                <h3 className="m-0 text-[17px] font-semibold uppercase tracking-[-0.01em]" style={{ fontFamily: DISPLAY }}>Safnbúðin</h3>
                <p className="m-0 mt-1.5 text-[15px] leading-relaxed" style={{ fontFamily: DISPLAY, color: MUT }}>
                  Safnbúð með völdum vörum, sjá myndina hér til hliðar.
                </p>
              </div>
              <p className="m-0 mt-4 text-[14px]" style={{ fontFamily: DISPLAY, color: MUT }}>
                {ADDRESS} · <a href={PHONE_HREF} className="inline-flex min-h-[44px] items-center" style={{ color: ACCENT_DEEP }}>{PHONE_DISPLAY}</a>
              </p>
            </div>
          </Reveal>
        </div>
        <Reveal delay={100}>
          <figure className="m-0">
            <DriftFrame
              src={IMG('samsett-mynd-1400.jpg')}
              w={1400}
              h={736}
              srcSet={`${IMG('samsett-mynd-800.jpg')} 800w, ${IMG('samsett-mynd-1400.jpg')} 1400w`}
              /* the frame is 46vw wide but the cover overhang paints ~82vw of
                 pixels into it; the old 46vw here made desktop pick the 800w
                 file and draw it at ~1170px, a 1.5x upscale */
              sizes="(min-width: 1024px) 82vw, 100vw"
              alt="Samsett mynd úr safnbúð Listasafnsins á Akureyri: vörur og varningur búðarinnar"
              drift={9}
              className="aspect-[4/3]"
            />
            <figcaption className="mt-2.5 text-[12px] uppercase tracking-[0.14em]" style={{ fontFamily: DISPLAY, color: MUT }}>
              Safnbúðin
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}

/* Real N4 regional-TV segment about the museum, verified via YouTube oEmbed
   2026-08-03 (author_name: N4, embeddable). Click-to-play facade — no iframe,
   no YouTube JS, loads on the page until the visitor actually wants the video. */
const N4_VIDEO_ID = 'CXHdAGkYNIQ'
const N4_VIDEO_TITLE = 'Að norðan: Listasafnið á Akureyri — N4'

function MuseumVideo() {
  const [playing, setPlaying] = useState(false)
  if (playing) {
    return (
      <div className="lk-video-frame" style={{ aspectRatio: '16/9', background: '#000' }}>
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${N4_VIDEO_ID}?autoplay=1`}
          title={N4_VIDEO_TITLE}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    )
  }
  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="lk-video-frame group relative block w-full cursor-pointer border-0 p-0"
      style={{ aspectRatio: '16/9' }}
      aria-label={`Spila myndband: ${N4_VIDEO_TITLE}`}
    >
      <img
        src={`https://i.ytimg.com/vi/${N4_VIDEO_ID}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover"
      />
      <span className="absolute inset-0" style={{ background: 'rgba(20,20,15,0.28)' }} aria-hidden />
      <span
        className="lk-play absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        aria-hidden
      >
        <Play size={22} fill="currentColor" style={{ marginLeft: 3 }} />
      </span>
      <span
        className="absolute bottom-3 left-3 right-3 text-left text-[12px] font-medium uppercase tracking-[0.08em]"
        style={{ fontFamily: DISPLAY, color: '#fff' }}
      >
        N4 · Að norðan
      </span>
    </button>
  )
}

/* ── §7 UM SAFNIÐ — the single serif register ── */
function About() {
  return (
    <section id="um" className="mx-auto max-w-[1440px] px-5 py-14 md:px-8 md:py-16" aria-label="Um safnið">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-20">
        <div>
          <Reveal>
            <p className="lk-eyebrow m-0" style={{ color: ACCENT_DEEP }}>Um safnið</p>
          </Reveal>
          <Reveal delay={70}>
            <p
              className="lk-serif m-0 mt-6 max-w-[34em] text-[20px] font-light leading-[1.75] md:text-[23px]"
              style={{ color: INK }}
            >
              Listasafnið á Akureyri er opinbert safn sem Akureyrarbær rekur, til húsa við
              Kaupvangsstræti 8. Í húsinu eru tólf sýningarsalir ásamt Ketilhúsi, viðburðahúsi
              safnsins, og þar standa níu sýningar yfir samtímis. Safnið er viðurkennt safn.
            </p>
          </Reveal>
          <Reveal delay={140}>
            <div className="mt-8 flex items-center gap-4">
              <img
                src={IMG('vidurkennt.png')}
                alt="Viðurkennt safn, viðurkenningarmerki"
                width={56}
                height={56}
                loading="lazy"
                className="h-14 w-14"
              />
              <p className="m-0 text-[14px]" style={{ fontFamily: DISPLAY, color: MUT }}>
                Viðurkennt safn · Rekið af Akureyrarbæ
              </p>
            </div>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <div className="flex flex-col">
            <MuseumVideo />
            <p className="m-0 mb-6 mt-2 text-[12px]" style={{ color: MUT }}>
              Að norðan, N4 sjónvarp: sjónvarpsþáttur um safnið.
            </p>
            <a href={SITE_URL} target="_blank" rel="noreferrer" className="lk-row" style={{ borderTop: `1px solid ${ACCENT}` }}>
              <span className="text-[16px] font-medium uppercase tracking-[-0.01em]" style={{ fontFamily: DISPLAY }}>
                Vinir Listasafnsins
              </span>
              <ArrowUpRight size={16} className="lk-row-arrow" aria-hidden />
            </a>
            <a href={SITE_URL} target="_blank" rel="noreferrer" className="lk-row">
              <span className="text-[16px] font-medium uppercase tracking-[-0.01em]" style={{ fontFamily: DISPLAY }}>
                Útleiga á Ketilhúsi
              </span>
              <ArrowUpRight size={16} className="lk-row-arrow" aria-hidden />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ── §8 FYLGSTU MEÐ ── */
function Follow() {
  const links = [
    { label: 'Instagram · @listak.is', href: INSTAGRAM_URL },
    { label: 'Facebook', href: FACEBOOK_URL },
    { label: 'Póstlisti · skráning á listak.is', href: NEWSLETTER_URL },
  ]
  return (
    <section id="fylgstu" className="mx-auto max-w-[1440px] px-5 py-12 md:px-8 md:py-14" aria-label="Fylgstu með">
      <Reveal>
        <p className="lk-eyebrow m-0" style={{ color: ACCENT_DEEP }}>Fylgstu með</p>
      </Reveal>
      <div className="mt-6 grid grid-cols-1 gap-x-10 md:grid-cols-3">
        {links.map((l, i) => (
          <Reveal key={l.label} soft delay={i * 60}>
            <a
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="lk-row"
              style={{ borderTop: `1px solid ${ACCENT}`, borderBottom: 'none' }}
            >
              <span className="text-[15px] font-medium" style={{ fontFamily: DISPLAY }}>{l.label}</span>
              <ArrowUpRight size={16} className="lk-row-arrow" aria-hidden />
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ── §9 FOOTER — ink band flip ── */
function Footer() {
  return (
    <footer id="samband" className="mt-2" style={{ background: INK, color: PAPER }} aria-label="Hafðu samband">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 md:py-20">
        <p
          className="m-0 uppercase"
          style={{
            fontFamily: DISPLAY, fontWeight: 700, letterSpacing: '-0.02em',
            fontSize: 'clamp(1.7rem, 4.6vw, 4rem)', lineHeight: 1.0,
            color: PAPER, paddingBottom: '0.22em', marginBottom: '-0.1em',
          }}
        >
          Listasafnið á Akureyri
        </p>
        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <p className="lk-eyebrow m-0" style={{ color: PAPER_MUTE }}>Heimsókn</p>
            <address className="mt-4 flex flex-col gap-2 not-italic" style={{ fontFamily: DISPLAY }}>
              <span className="text-[15px]">{ADDRESS}</span>
              <a href={PHONE_HREF} className="lk-flink inline-flex min-h-[44px] w-fit max-w-full items-center text-[15px]" style={{ color: PAPER }}>
                {PHONE_DISPLAY}
              </a>
              <a href={EMAIL_HREF} className="lk-flink inline-flex min-h-[44px] w-fit max-w-full items-center break-all text-[15px]" style={{ color: PAPER }}>
                {EMAIL}
              </a>
            </address>
          </div>
          <div>
            <p className="lk-eyebrow m-0" style={{ color: PAPER_MUTE }}>Opnunartímar</p>
            <dl className="m-0 mt-4 flex flex-col">
              {HOURS_RECAP.map((h) => (
                <div key={h.label} className="flex flex-col gap-0.5 py-2.5" style={{ borderTop: `1px solid ${HAIR_PAPER}` }}>
                  <dt className="text-[13px]" style={{ fontFamily: DISPLAY, color: PAPER_MUTE }}>{h.label}</dt>
                  <dd className="m-0 text-[15px]" style={{ fontFamily: DISPLAY }}>{h.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex flex-col items-start gap-4">
            <p className="lk-eyebrow m-0" style={{ color: PAPER_MUTE }}>Safnið</p>
            <div className="flex items-center gap-4">
              <img
                src={IMG('vidurkennt.png')}
                alt="Viðurkennt safn, viðurkenningarmerki"
                width={48}
                height={48}
                loading="lazy"
                className="h-12 w-12"
                style={{ background: PAPER, padding: 4 }}
              />
              <p className="m-0 text-[14px] leading-relaxed" style={{ fontFamily: DISPLAY, color: PAPER_MUTE }}>
                Viðurkennt safn<br />Rekið af Akureyrarbæ
              </p>
            </div>
            <a
              href={SITE_URL}
              target="_blank"
              rel="noreferrer"
              className="lk-flink lk-eyebrow inline-flex min-h-[44px] w-fit max-w-full items-center gap-2"
              style={{ color: PAPER }}
            >
              listak.is
              <ArrowUpRight size={14} aria-hidden />
            </a>
          </div>
        </div>
      </div>
      <div
        className="px-5 py-5 text-center text-[12px] tracking-[0.16em]"
        style={{ fontFamily: DISPLAY, color: PAPER_MUTE, borderTop: `1px solid ${HAIR_PAPER}` }}
      >
        FRUMGERÐ · SNDR STUDIO
      </div>
    </footer>
  )
}

/* ── PAGE ── */
/* ═════════════════════════════════════════════════════════════════════════
   LOADER — the twelve halls come on, one by one, on REAL load progress
   ═════════════════════════════════════════════════════════════════════════
   Timing contract (all four numbers are load-bearing, none of them is a
   decorative timer):

     FLOOR 1100ms  the cells may not run faster than this. On a warm cache
                   every image is already .complete, so without a floor the
                   sheet would mount and unmount inside one tick and nobody
                   would ever see it.
     HOLD   180ms  the twelfth hall stays lit long enough to register.
     EXIT   700ms  the lift.
     CAP   1700ms  hard stop on the WAIT, so the sheet is gone by 2400ms
                   even if an asset never arrives (1700 + 700 = 2400).

   Progress itself is real: the images the browser is actually fetching for
   this paint (eager ones, plus any lazy one it has already decided to load)
   and the display font, counted as completed units. `shown` is clamped by
   BOTH the true fraction and the floor pace, so the meter can never claim
   more halls than are genuinely loaded. STEP only limits how fast a jump
   may sweep across the plan; it can never push the meter past the truth. */
const LK_LOAD_FLOOR = 1100
const LK_LOAD_HOLD = 180
const LK_LOAD_EXIT = 700
const LK_LOAD_CAP = 1700
const LK_LOAD_STEP = 0.13 /* per 50ms tick: a full sweep takes ~460ms */
const LK_LOAD_KEY = 'lk-loader-seen'

function lkLoaderWanted(): boolean {
  if (typeof window === 'undefined') return false
  /* reduced motion wins over everything, including ?loader */
  if (prefersReduced()) return false
  try {
    if (new URLSearchParams(window.location.search).has('loader')) return true
  } catch { /* malformed query: fall through to the session rule */ }
  try {
    if (sessionStorage.getItem(LK_LOAD_KEY) === '1') return false
  } catch { /* private mode throws: show it */ }
  return true
}

function Loader() {
  /* computed during the first render, not in an effect — an effect would
     paint the page for one frame and then drop the sheet on top of it */
  const [visible, setVisible] = useState(lkLoaderWanted)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!visible) return
    const root = rootRef.current
    if (!root) return
    try { sessionStorage.setItem(LK_LOAD_KEY, '1') } catch { /* private mode */ }

    const bar = root.querySelector('.lk-load-bar') as HTMLElement | null
    const count = root.querySelector('.lk-load-count') as HTMLElement | null

    /* ── real load units ── */
    const imgs = Array.from(document.images).filter((im) => im.loading !== 'lazy' || im.complete)
    let loaded = imgs.filter((im) => im.complete).length
    let fontsDone = false
    const total = imgs.length + 1 /* +1: the display font */
    const detach: Array<() => void> = []
    imgs.forEach((im) => {
      if (im.complete) return
      const on = () => { loaded += 1 }
      im.addEventListener('load', on, { once: true })
      im.addEventListener('error', on, { once: true })
      detach.push(() => {
        im.removeEventListener('load', on)
        im.removeEventListener('error', on)
      })
    })
    try {
      document.fonts.ready.then(() => { fontsDone = true })
    } catch { fontsDone = true }

    const t0 = performance.now()
    let shown = 0
    let lit = -1
    let fullAt = 0
    let done = false
    let iv = 0
    let capT = 0
    let exitT = 0

    /* one strip, driven by real progress. Quantised to whole percent so the
       transform is written at most 100 times, never once per tick. */
    const paint = (pct: number) => {
      if (pct === lit) return
      if (bar) bar.style.transform = `scaleX(${pct / 100})`
      if (count) count.textContent = `${String(pct).padStart(3, '0')}%`
      lit = pct
    }

    const finish = () => {
      if (done) return
      done = true
      window.clearInterval(iv)
      window.clearTimeout(capT)
      detach.forEach((f) => f())
      window.removeEventListener('pointerdown', skip, opts)
      window.removeEventListener('touchmove', skip, opts)
      window.removeEventListener('wheel', skip, opts)
      window.removeEventListener('keydown', skip, opts)
      root.classList.add('is-out')
      /* setTimeout, never rAF: the sheet must come off a backgrounded tab,
         a throttled frame loop or a killed rAF just the same */
      exitT = window.setTimeout(() => setVisible(false), LK_LOAD_EXIT)
    }

    /* INPUT-SKIP. Passive and capture, and nothing is ever preventDefault'ed:
       the wheel / touchmove that dismissed the sheet still scrolls the
       document underneath it, because nothing here locks scrolling. */
    const opts: AddEventListenerOptions = { passive: true, capture: true }
    function skip() { finish() }
    window.addEventListener('pointerdown', skip, opts)
    window.addEventListener('touchmove', skip, opts)
    window.addEventListener('wheel', skip, opts)
    window.addEventListener('keydown', skip, opts)

    const tick = () => {
      const now = performance.now()
      const real = (loaded + (fontsDone ? 1 : 0)) / total
      const target = Math.min(real, (now - t0) / LK_LOAD_FLOOR)
      shown = Math.min(target, shown + LK_LOAD_STEP)
      const n = shown >= 1 ? 100 : Math.max(0, Math.floor(shown * 100))
      paint(n)
      if (n === 100) {
        if (!fullAt) fullAt = now
        if (now - fullAt >= LK_LOAD_HOLD) finish()
      }
    }
    paint(0)
    iv = window.setInterval(tick, 50)
    capT = window.setTimeout(finish, LK_LOAD_CAP)

    return () => {
      window.clearInterval(iv)
      window.clearTimeout(capT)
      window.clearTimeout(exitT)
      detach.forEach((f) => f())
      window.removeEventListener('pointerdown', skip, opts)
      window.removeEventListener('touchmove', skip, opts)
      window.removeEventListener('wheel', skip, opts)
      window.removeEventListener('keydown', skip, opts)
    }
  }, [visible])

  if (!visible) return null

  return (
    <div ref={rootRef} className="lk-load" aria-hidden="true">
      <div className="lk-load-in">
        <p className="lk-load-mark">
          <span>{MARK_L1}</span>
          <span>{MARK_L2}</span>
        </p>
        <div className="lk-load-track">
          <div className="lk-load-bar" />
        </div>
        <div className="lk-load-meta">
          <p className="lk-eyebrow m-0" style={{ color: MUT }}>Kaupvangsstræti 8, Akureyri</p>
          <p className="lk-eyebrow lk-load-count m-0">000%</p>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [armed, setArmed] = useState(false)
  const [resolved, setResolved] = useState(false)
  const [status, setStatus] = useState<OpenStatus | null>(null)

  /* head: title, description, lang, JSON-LD, font preloads */
  useEffect(() => {
    document.title = META.title
    setThemeColor(GROUND)
    document.documentElement.lang = 'is'
    const meta = document.querySelector('meta[name="description"]')
    const prevDesc = meta?.getAttribute('content') ?? ''
    meta?.setAttribute('content', META.description)
    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(ld)
    const preloads = ['familjen-grotesk-v11-latin_latin-ext-700.woff2', 'familjen-grotesk-v11-latin_latin-ext-600.woff2'].map((f) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'font'
      link.type = 'font/woff2'
      link.crossOrigin = 'anonymous'
      link.href = `${FONT_DIR}familjen-grotesk/${f}`
      document.head.appendChild(link)
      return link
    })
    return () => {
      meta?.setAttribute('content', prevDesc)
      ld.remove()
      preloads.forEach((l) => l.remove())
    }
  }, [])

  /* live open/closed status — computed once from the real rules */
  useEffect(() => {
    setStatus(openStatus())
  }, [])

  /* arm the mask choreography only for motion-ok desktop fine pointers.
     Touch and small viewports rest PRE-RESOLVED (photo revealed, solid
     wordmark) — the cutout veil would otherwise leave the first phone
     screen as dark type over empty stone with an invisible photo. The
     resting CSS state without .lk-js is already the resolved state. */
  useEffect(() => {
    if (prefersReduced()) return
    if (!window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches) return
    setArmed(true)
  }, [])

  /* hero resolves ONCE, on first scroll intent */
  useEffect(() => {
    if (!armed || resolved) return
    let done = false
    const fire = () => {
      if (done) return
      done = true
      setResolved(true)
    }
    const onWheel = (e: WheelEvent) => { if (e.deltaY > 0) fire() }
    const onScroll = () => { if ((window.scrollY || 0) > 8) fire() }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') fire()
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchmove', fire, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchmove', fire)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', onKey)
    }
  }, [armed, resolved])

  /* THE JOURNEY — desktop, fine pointer, motion ok. Lenis + one pinned tween
     (a timeline freezes at x=0 — known Búðir bug), containerAnimation-style
     image parallax, DOF via the shared drift loop, keyboard focus mapping. */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const mm = gsap.matchMedia()
    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        desktop: '(min-width: 1024px)',
        fine: '(pointer: fine)',
      },
      (mctx) => {
        const c = mctx.conditions as { motion: boolean; desktop: boolean; fine: boolean }
        if (!c.motion || !c.desktop || !c.fine) return undefined

        const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true })
        lenis.on('scroll', ScrollTrigger.update)
        pageLenis = lenis
        /* exposed for the QA harness only */
        ;(window as unknown as Record<string, unknown>).__lkLenis = lenis
        const tick = (t: number) => lenis.raf(t * 1000)
        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)

        const journeyEl = root.querySelector('.lk-journey') as HTMLElement | null
        const track = root.querySelector('.lk-track') as HTMLElement | null
        const hudFill = root.querySelector('.lk-hud-fill') as HTMLElement | null
        const hudCount = root.querySelector('.lk-hud-count') as HTMLElement | null
        if (!journeyEl || !track) return undefined

        const maxX = () => Math.max(1, track.scrollWidth - window.innerWidth)
        /* a TWEEN, never a timeline */
        const journeyTween = gsap.to(track, { x: () => -maxX(), ease: 'none', force3D: true })
        /* HUD counter = the stop NEAREST viewport centre, from real geometry,
           so it can never disagree with the per-stop "n/09" labels. Centres
           are cached on refresh (offsetLeft is untransformed track space). */
        const showStops = Array.from(track.querySelectorAll('.lk-stop:not(.lk-stop-intro)')) as HTMLElement[]
        let stopCenters: number[] = []
        let maxXCache = 1
        const measureStops = () => {
          maxXCache = maxX()
          stopCenters = showStops.map((s) => s.offsetLeft + s.offsetWidth / 2)
        }
        measureStops()
        let lastIdx = -1
        const master = ScrollTrigger.create({
          animation: journeyTween,
          trigger: journeyEl,
          pin: journeyEl,
          scrub: 1,
          start: 'top top',
          end: () => '+=' + maxX(),
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: measureStops,
          onUpdate: (self) => {
            if (hudFill) hudFill.style.transform = `scaleX(${self.progress})`
            if (hudCount && stopCenters.length) {
              const centre = maxXCache * self.progress + window.innerWidth / 2
              let idx = 0
              let best = Infinity
              for (let i = 0; i < stopCenters.length; i++) {
                const d = Math.abs(stopCenters[i] - centre)
                if (d < best) { best = d; idx = i }
              }
              if (idx !== lastIdx) {
                lastIdx = idx
                hudCount.textContent = `${String(idx + 1).padStart(2, '0')}/09`
              }
            }
          },
        })
        journeyNav = { master, track, lenis }

        /* depth-of-field: register every SHOW stop core with the SHARED drift
           loop (one reads pass per frame — never a second rAF loop). The
           intro panel is EXEMPT: it sits left-of-centre at pin entry, and the
           visitor needs its orientation copy sharp from the first frame. */
        const cores = Array.from(track.querySelectorAll('.lk-stop:not(.lk-stop-intro) .lk-stop-core')) as HTMLElement[]
        cores.forEach((el) => dofNodes.add(el))
        ensureDriftLoop()

        /* corridor image parallax rides the traverse via containerAnimation.
           Targets the <img>, never .lk-frame-in — that node belongs to the
           drift loop, and two writers on one transform fight. */
        const parallaxTweens: gsap.core.Tween[] = []
        Array.from(track.querySelectorAll('.lk-stop-frame > .lk-frame-in > img')).forEach((img) => {
          parallaxTweens.push(
            gsap.fromTo(img, { xPercent: 5.5, scale: 1.14 }, {
              xPercent: -5.5, scale: 1.14, ease: 'none',
              scrollTrigger: {
                trigger: (img as HTMLElement).closest('.lk-stop') as HTMLElement,
                containerAnimation: journeyTween,
                start: 'left 100%', end: 'right 0%', scrub: true,
              },
            }),
          )
        })

        /* A ScrollTrigger refresh re-parents the pinned journey, and the
           browser BLURS whatever was focused inside it — that is what made
           the last two corridor stops keyboard-unreachable: the late refresh
           fired mid-travel and dropped focus onto <body>. Carry focus across
           every refresh, whoever triggered it (resize included). */
        let focusHeld: HTMLElement | null = null
        const onRefreshInit = () => {
          const a = document.activeElement as HTMLElement | null
          focusHeld = a && a !== document.body && journeyEl.contains(a) ? a : null
        }
        const onRefreshed = () => {
          const keep = focusHeld
          focusHeld = null
          if (keep && keep.isConnected && document.activeElement !== keep) {
            keep.focus({ preventScroll: true })
          }
        }
        ScrollTrigger.addEventListener('refreshInit', onRefreshInit)
        ScrollTrigger.addEventListener('refresh', onRefreshed)

        /* keyboard reachability: focusing a stop travels the corridor to it */
        const onFocus = (e: FocusEvent) => {
          const stopEl = (e.target as Element | null)?.closest?.('.lk-stop') as HTMLElement | null
          if (!stopEl || !journeyNav) return
          journeyEl.scrollLeft = 0
          journeyEl.scrollTop = 0
          const mx = maxX()
          const x = Math.min(Math.max(0, stopEl.offsetLeft - (window.innerWidth - stopEl.offsetWidth) / 2), mx)
          /* clamp to the master's own range: the LAST stop maps to exactly
             `end`, and one pixel past it unpins the journey under the caret */
          const top = Math.min(master.end, master.start + (x / mx) * (master.end - master.start))
          if (Math.abs(window.scrollY - top) < 2) return
          lenis.scrollTo(top, {})
        }
        journeyEl.addEventListener('focusin', onFocus)

        /* the traverse is only correct once the display font AND the track
           images have loaded — refresh after both. Every corridor frame
           carries an explicit aspect-ratio, so once the visitor is INSIDE the
           pin the image pass has nothing left to correct and a refresh there
           would only jolt the travel. */
        document.fonts.ready.then(() => ScrollTrigger.refresh())
        const imgs = Array.from(track.querySelectorAll('img'))
        Promise.all(imgs.map((im) => {
          const el = im as HTMLImageElement
          if (el.complete && el.naturalWidth > 0) return Promise.resolve()
          const dec = el.decode ? el.decode().catch(() => undefined) : undefined
          return dec ?? new Promise<void>((res) => {
            el.addEventListener('load', () => res(), { once: true })
            el.addEventListener('error', () => res(), { once: true })
          })
        })).then(() => {
          if (master.progress > 0) return
          ScrollTrigger.refresh()
        })

        return () => {
          ScrollTrigger.removeEventListener('refreshInit', onRefreshInit)
          ScrollTrigger.removeEventListener('refresh', onRefreshed)
          journeyEl.removeEventListener('focusin', onFocus)
          parallaxTweens.forEach((t) => {
            t.scrollTrigger?.kill()
            t.kill()
          })
          master.kill()
          journeyTween.kill()
          cores.forEach((el) => {
            dofNodes.delete(el)
            el.style.filter = ''
            el.style.transform = ''
            delete el.dataset.lkDof
          })
          maybeStopDriftLoop()
          gsap.ticker.remove(tick)
          lenis.destroy()
          delete (window as unknown as Record<string, unknown>).__lkLenis
          journeyNav = null
          pageLenis = null
        }
      },
    )
    return () => { mm.revert() }
  }, [])

  return (
    <div
      ref={rootRef}
      lang="is"
      className={`lk-root min-h-[100svh] antialiased ${armed ? 'lk-js' : ''} ${resolved ? 'lk-done' : ''}`}
      style={{ fontFamily: DISPLAY }}
    >
      <style>{CSS}</style>
      <a href="#meginmal" className="lk-skip">Beint í efni</a>
      <Header />
      <main id="meginmal">
        <Hero status={status} />
        <StatusTriptych status={status} />
        <Corridor />
        <Husid />
        <Upcoming />
        <Education />
        <Ketilhus />
        <About />
        <Follow />
      </main>
      <Footer />
      <PreviewFooter company={company} />
      <PreviewChrome company={company} />
      <Loader />
    </div>
  )
}
