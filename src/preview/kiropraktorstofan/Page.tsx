import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'
import { Mail, Menu, Phone, Send, X } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import './kiro.css'
import {
  ADDRESS_LINE1, ADDRESS_LINE2, ADDRESS_NOTE, CHAPTERS, EMAIL, EMAIL_HREF, EXAM_FACTS,
  HOURS, IMG, JSON_LD, LEYFID_FACTS, MAPS_URL, NAV, PATIENT_COUNT_NOTE, PHONE_DISPLAY,
  PHONE_HREF, PRACTICE_NAME, PRICES, PRICE_NOTE, PRICE_VALID, SPINE_FACT,
  TREATMENT_LENGTH_NOTE, XRAY_NOTE,
} from './data'

gsap.registerPlugin(ScrollTrigger, SplitText)

const company = getPreviewCompany('kiropraktorstofan')

/* ── "FYRSTA LEYFIÐ" v2 ───────────────────────────────────────────────────
   Redo brief (BRIEF2-kiropraktorstofan.md). v1 (light paper, ghost words at
   .14 alpha on CREAM, four MR/1971-split chapters, navy pills, floating pill
   rail, empty-half-viewport text hero) was rejected as generic AI slop. v2
   is a DARK chaptered case history — a bound sjúkraskrá — told in exactly
   the four chapters the redo brief specifies: 01 the 1977 licence itself,
   02 Meðferðin, 03 Verðskráin, 04 Stofan. Ground stays one cool near-black
   family throughout (no alternating light/dark chapters), so the ghost
   words (D3) finally sit on a background their stroke can actually read
   against. Devices D1-D8 are numbered in the comments below so file:line
   citations are easy in the final report. NO PINNED SECTIONS anywhere,
   plain scroll-scrubs only. No page-level hero: the page opens directly on
   KAFLI 01's own full-bleed cover, so there is no text-only empty-viewport
   block (the exact failure mode that killed v1). ────────────────────────── */

const GROUND = '#0b0b0b'
const PANEL = '#131215'
const BONE = '#ece9e3'
const MUTE = 'rgba(236,233,227,.62)'
const HAIR = 'rgba(236,233,227,.14)'
/** ONE accent, oxblood, brief range #8e2a35..#a32638. IMPORTANT: this value
    fails AA/large-text contrast (~2.6:1) as foreground TEXT directly on
    GROUND — computed during this build, not eyeballed. So ACCENT is used
    ONLY as a fill (button/chip backgrounds carrying BONE text, which passes
    at ~6.3:1) or as a non-text decoration (rail fill, borders, dividers).
    It is never a glyph colour sitting bare on GROUND anywhere on this page. */
const ACCENT = '#9A2B34'
const OPEN_GREEN = '#5FBF77'

const DISPLAY = "'Kiro Khand', 'Arial Narrow', sans-serif"
const BODY = "'Kiro General Sans', -apple-system, 'Helvetica Neue', Arial, sans-serif"
const MONO = "'Kiro Server Mono', ui-monospace, 'SFMono-Regular', monospace"

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#ece9e3] focus-visible:ring-offset-[#0b0b0b]'

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

const pad = (n: number) => String(n).padStart(2, '0')

/* ── real, published hours → live status (data.ts HOURS, restated here as
   decimal spans for the client-side clock) ──────────────────────────────── */
interface Span {
  open: number
  close: number
}
const SCHEDULE: Record<number, Span[]> = {
  1: [{ open: 9, close: 12 }, { open: 13, close: 16 }],
  2: [{ open: 9, close: 12 }, { open: 14, close: 17 }],
  3: [{ open: 9, close: 12 }, { open: 13, close: 16 }],
  4: [{ open: 9, close: 12 }, { open: 14, close: 17 }],
  5: [{ open: 9, close: 12 }, { open: 13, close: 16 }],
}
const DAY_ACC: Record<number, string> = {
  0: 'sunnudaginn', 1: 'mánudaginn', 2: 'þriðjudaginn', 3: 'miðvikudaginn',
  4: 'fimmtudaginn', 5: 'föstudaginn', 6: 'laugardaginn',
}
const fmt = (h: number) => `${String(Math.floor(h)).padStart(2, '0')}:00`

function readStatus(now: Date): { open: boolean; text: string } {
  const day = now.getDay()
  const dec = now.getHours() + now.getMinutes() / 60
  const spans = SCHEDULE[day] ?? []
  const active = spans.find((s) => dec >= s.open && dec < s.close)
  if (active) return { open: true, text: `OPIÐ NÚNA · TIL KL. ${fmt(active.close)}` }
  const laterToday = spans.find((s) => dec < s.open)
  if (laterToday) return { open: false, text: `LOKAÐ NÚNA · OPNAR KL. ${fmt(laterToday.open)} Í DAG` }
  for (let i = 1; i <= 7; i++) {
    const d2 = (day + i) % 7
    const s2 = SCHEDULE[d2]
    if (s2 && s2.length) {
      const when = i === 1 ? 'Á MORGUN' : `Á ${DAY_ACC[d2].toUpperCase()}`
      return { open: false, text: `LOKAÐ NÚNA · OPNAR KL. ${fmt(s2[0].open)} ${when}` }
    }
  }
  return { open: false, text: 'LOKAÐ NÚNA' }
}

/* ── primitives ───────────────────────────────────────────────────────── */

/** Base reveal primitive. IntersectionObserver → .kiro-in, CSS transition
    toward resting state (never framer whileInView). Wired once in Page(). */
function Rise({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
  style,
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article' | 'header'
  style?: CSSProperties
}) {
  return (
    <Tag className={`kiro-rv ${className}`} style={{ ...style, '--kiro-d': delay } as CSSProperties}>
      {children}
    </Tag>
  )
}

/** K01's interior document plate (leyfid-monument.jpg) — hard clip-path
    wipe reveal (IntersectionObserver toggling .kiro-in) + the D8 velocity
    bend applied to its <img> from the Lenis-velocity ticker in Page(). */
function Plate({ src, alt, ratio }: { src: string; alt: string; ratio: string }) {
  return (
    <div data-plate className="kiro-plate kiro-rv" style={{ aspectRatio: ratio, ['--kiro-plate-bg' as string]: PANEL }}>
      <img src={src} alt={alt} loading="lazy" decoding="async" style={{ objectPosition: '55% 55%' }} />
    </div>
  )
}

/* ── D1 — chapter cover. 100svh full-bleed image: permanent
   grayscale(.4) contrast(1.06) brightness(.82) grade + a gradient shade
   down to GROUND; mono "KAFLI 0X / 04" bottom-left; giant chapter name
   bottom-right (clamp desktop / min() mobile floor, see .kiro-cover-word in
   kiro.css); scrubbed photo scale 1.16→1 with name yPercent drift (wired in
   the gsap.context effect in Page()). ──────────────────────────────────── */
function ChapterCover({
  n,
  total,
  word,
  src,
  alt,
  objectPosition = '50% 50%',
  tint,
  priority = false,
}: {
  n: string
  total: number
  word: string
  src: string
  alt: string
  objectPosition?: string
  tint?: string
  priority?: boolean
}) {
  return (
    <div className="kiro-cover relative flex min-h-[100svh] flex-col justify-end overflow-hidden" style={{ background: GROUND }}>
      <img
        data-cover-img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...(priority ? { fetchpriority: 'high' as const } : {})}
        className="kiro-cover-img"
        style={{
          filter: 'grayscale(.4) contrast(1.06) brightness(.82)',
          ['--kiro-pos' as string]: objectPosition,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `${tint ? tint + ',' : ''}linear-gradient(180deg, rgba(11,11,11,0) 0%, rgba(11,11,11,.14) 42%, rgba(11,11,11,.58) 72%, ${GROUND} 100%)`,
        }}
      />
      <div className="relative mx-auto flex w-full max-w-[1180px] flex-col gap-4 px-5 pb-12 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:px-8 sm:pb-16">
        <p style={{ fontFamily: MONO, fontSize: '.82rem', letterSpacing: '.12em', color: MUTE }}>
          KAFLI {n} / {pad(total)}
        </p>
        <p
          data-cover-year
          className="kiro-cover-word text-left sm:text-right"
          style={{ fontFamily: DISPLAY, fontWeight: 700, letterSpacing: '-.01em', color: BONE }}
        >
          {word}
        </p>
      </div>
    </div>
  )
}

/* ── D2 (per-letter title reveal, [data-split-title]) + D3 (two giant
   outlined ghost words per chapter head, counter-drifting on scrub,
   [data-ghost-a]/[data-ghost-b], desktop only) + an optional interior
   Plate (K01 only). ──────────────────────────────────────────────────── */
function ChapterHead({
  as: Tag,
  n,
  sub,
  title,
  abstract,
  ghostTop,
  ghostBottom,
  plate,
}: {
  as: 'h1' | 'h2'
  n: string
  sub: string
  title: string
  abstract: string
  ghostTop: string
  ghostBottom: string
  plate?: ReactNode
}) {
  return (
    <div data-chapter-head className="mx-auto max-w-[1180px] px-5 pt-20 pb-12 sm:px-8 sm:pt-28 sm:pb-16">
      <Rise>
        <p style={{ fontFamily: MONO, fontSize: '.78rem', letterSpacing: '.14em', color: MUTE }}>
          KAFLI {n} · {sub}
        </p>
        <Tag
          data-split-title
          className="mt-6 max-w-[17ch]"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 'clamp(2.4rem, 6.4vw, 4.8rem)',
            letterSpacing: '-.01em',
            lineHeight: 0.98,
            color: BONE,
          }}
        >
          {title}
        </Tag>
        <p className="mt-6 max-w-[46ch]" style={{ color: MUTE, fontSize: '1.06rem', lineHeight: 1.6 }}>
          {abstract}
        </p>
      </Rise>

      {/* overflow-hidden: the ghost words are decorative and MAY clip at
          their container edge, but must never cause a page-level
          horizontal scrollbar. D-FIX-6: minHeight now lives in kiro.css as
          .kiro-ghost-zone--plate/--plain, tightened from 58vh/30vh to
          46vh/20vh, and collapses to auto on <=1023px where .kiro-ghost is
          hidden — a fixed vh reservation with no ghost text and no plate
          was reading as dead near-black space on tablet/mobile. */}
      <div
        className={`kiro-ghost-zone ${plate ? 'kiro-ghost-zone--plate' : 'kiro-ghost-zone--plain'} relative mt-10 overflow-hidden`}
      >
        <p
          data-ghost-a
          aria-hidden="true"
          className="kiro-ghost absolute -top-2 left-0 max-w-full select-none"
          style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'min(15vw, 11rem)', lineHeight: 0.9 }}
        >
          {ghostTop}
        </p>
        <p
          data-ghost-b
          aria-hidden="true"
          className="kiro-ghost absolute right-0 bottom-0 max-w-full select-none text-right"
          style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'min(15vw, 11rem)', lineHeight: 0.9 }}
        >
          {ghostBottom}
        </p>
        {plate && (
          <div className="relative mx-auto" style={{ width: 'min(44vw, 400px)', maxWidth: '80vw' }}>
            {plate}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── D6 — numbered fact grid (LEYFID_FACTS, EXAM_FACTS). Hairline top+
   bottom (see .kiro-fact-grid wrapper below), 1px verticals between cells,
   a small FILLED accent chip (bone-on-oxblood, not oxblood-on-ground —
   see the ACCENT contrast note above) carries the 01/02 index. Never a
   pill, never a bordered card. ──────────────────────────────────────────── */
function FactGrid({ items }: { items: { n: string; label: string; value?: string; body?: string }[] }) {
  return (
    <div
      className="kiro-fact-grid"
      style={{ borderTop: `1px solid ${HAIR}`, borderBottom: `1px solid ${HAIR}`, ['--kiro-hair' as string]: HAIR }}
    >
      {items.map((it) => (
        <div key={it.n} className="kiro-fact-cell px-1 py-7 sm:px-6">
          <span className="kiro-chip" style={{ fontFamily: MONO, fontSize: '.7rem', ['--kiro-accent' as string]: ACCENT }}>
            {it.n}
          </span>
          <p className="mt-3" style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: '1.24rem', color: BONE }}>
            {it.label}
          </p>
          {it.value && (
            <p className="mt-1" style={{ fontFamily: MONO, fontSize: '.86rem', color: MUTE }}>
              {it.value}
            </p>
          )}
          {it.body && (
            <p className="mt-2" style={{ color: MUTE, lineHeight: 1.55, fontSize: '.96rem' }}>
              {it.body}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

/* ── D6 — ledger rows: verðskrá + opening hours, a typeset dotted-leader
   menu (mono index chip · display-face label · dotted leader · mono
   value), hairline between every row. ────────────────────────────────── */
function Ledger({ rows }: { rows: { n: string; label: string; value: string }[] }) {
  return (
    <ul className="kiro-ledger" style={{ ['--kiro-hair' as string]: HAIR }}>
      {rows.map((r) => (
        <li key={r.n} className="kiro-ledger-row py-4">
          <span className="kiro-chip shrink-0" style={{ fontFamily: MONO, fontSize: '.66rem', ['--kiro-accent' as string]: ACCENT }}>
            {r.n}
          </span>
          <span className="kiro-ledger-label" style={{ fontFamily: DISPLAY, fontSize: '1.1rem', color: BONE }}>{r.label}</span>
          <span className="kiro-ledger-leader" aria-hidden="true" />
          {/* D-FIX-1: was Tailwind `shrink-0`, which forces this span to its
              full single-line max-content width regardless of container —
              the longest HOURS value ("9.00-12.00 og 13.00-16.00", 25
              chars mono) then refused to shrink/wrap and pushed the whole
              row past 390px, inflating the mobile layout viewport itself
              (measured innerWidth 421 instead of 390). Sizing now lives in
              kiro.css's .kiro-ledger-value, which switches the row to a
              two-line grid (leader hidden, value below label) at <=560px
              so nothing is ever forced wider than the column. */}
          <span className="kiro-ledger-value" style={{ fontFamily: MONO, fontSize: '1rem', color: BONE }}>{r.value}</span>
        </li>
      ))}
    </ul>
  )
}

/* ── two-column story beat, closed by an oversized chapter tag above a
   hairline (editorial long-read grammar, not a numbered "process" strip). ── */
function StoryColumns({
  n,
  leftLabel,
  leftBody,
  rightLabel,
  rightBody,
}: {
  n: string
  leftLabel: string
  leftBody: string
  rightLabel: string
  rightBody: string
}) {
  return (
    <div className="mx-auto max-w-[1180px] px-5 pb-16 sm:px-8 sm:pb-20">
      <Rise>
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-16">
          <div>
            <h3 style={{ fontFamily: MONO, fontSize: '.82rem', letterSpacing: '.12em', color: MUTE }} className="uppercase">
              {leftLabel}
            </h3>
            <p className="mt-4 max-w-[42ch]" style={{ color: BONE, fontSize: '1.08rem', lineHeight: 1.6 }}>
              {leftBody}
            </p>
          </div>
          <div>
            <h3 style={{ fontFamily: MONO, fontSize: '.82rem', letterSpacing: '.12em', color: MUTE }} className="uppercase">
              {rightLabel}
            </h3>
            <p className="mt-4 max-w-[42ch]" style={{ color: BONE, fontSize: '1.08rem', lineHeight: 1.6 }}>
              {rightBody}
            </p>
          </div>
        </div>
      </Rise>
      <Rise delay={1} className="mt-16 flex items-end justify-between border-t pt-6" style={{ borderColor: HAIR }}>
        <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(2.4rem, 7vw, 4.6rem)', color: BONE, lineHeight: 1 }}>
          KAFLI {n}
        </span>
        <span style={{ fontFamily: MONO, fontSize: '.8rem', color: MUTE }}>{n} / 04</span>
      </Rise>
    </div>
  )
}

/* ── D4 — outro-style quote, unmasked word by word
   ([data-unmask-quote], see the gsap.context effect). Quotes are
   Tryggvi-story lines drawn straight from data.ts's verified facts, never
   invented testimonials. ─────────────────────────────────────────────── */
function UnmaskQuote({ text, source }: { text: string; source: string }) {
  return (
    <Rise className="mx-auto max-w-[1180px] px-5 pb-16 text-center sm:px-8 sm:pb-20">
      <blockquote
        data-unmask-quote
        style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(1.5rem, 3.6vw, 2.6rem)', lineHeight: 1.28, color: BONE }}
      >
        {text}
      </blockquote>
      <p className="mt-6" style={{ fontFamily: MONO, fontSize: '.8rem', color: MUTE }}>
        · {source}
      </p>
    </Rise>
  )
}

/* ── D5 — chapter progress rail. Fixed bottom-centre, desktop AND
   min-height >= 660px only (see the media query in kiro.css); a slim
   top-edge mobile page-progress line covers narrower/shorter viewports.
   GSAP scaleX fill per chapter, driven by that chapter's own ScrollTrigger
   progress (wired in Page()). D-FIX-3: was a rounded, bordered, drop-
   shadowed floating capsule — banned house chrome. Now a hairline
   segmented rail: one top rule spanning the row, a vertical hairline
   between each segment, mono labels underneath, no fill/border-radius/
   shadow/blur box. A soft bottom scrim (gradient only, not a panel) keeps
   the labels legible over whatever content is scrolling underneath. ───── */
function ChapterRail() {
  return (
    <nav aria-hidden="true" className="kiro-rail pointer-events-none fixed inset-x-0 bottom-0 z-30">
      <div aria-hidden="true" className="kiro-rail-scrim" />
      <div className="kiro-rail-row mx-auto flex w-full max-w-[440px] items-stretch px-6 pb-5" style={{ borderTop: `1px solid ${HAIR}` }}>
        {CHAPTERS.map((c, i) => (
          <div key={c.n} className="kiro-rail-seg flex-1" style={{ borderLeft: i === 0 ? 'none' : `1px solid ${HAIR}` }}>
            <span className="kiro-rail-track block" style={{ background: 'rgba(236,233,227,.14)' }}>
              <span data-rail-fill={i} className="kiro-rail-fill block h-full" style={{ background: ACCENT }} />
            </span>
            <span className="kiro-rail-label" style={{ fontFamily: MONO, color: MUTE }}>{c.short}</span>
          </div>
        ))}
      </div>
    </nav>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */

export default function KiropraktorstofanPage() {
  const [status, setStatus] = useState(() => readStatus(new Date()))
  const [menu, setMenu] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [erindi, setErindi] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => setThemeColor(GROUND), [])

  useEffect(() => {
    const t = window.setInterval(() => setStatus(readStatus(new Date())), 60000)
    return () => window.clearInterval(t)
  }, [])

  useEffect(() => {
    if (!menu) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [menu])

  /* Base reveal engine. Observes every .kiro-rv/.kiro-plate element, adds
     .kiro-in on first intersection (unobserve after), with an in-view-on-
     mount check and a <=2s failsafe so nothing strands hidden if a font, an
     image or a paused rAF ever delays it. */
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.kiro-rv, .kiro-plate'))
    if (reduced()) {
      els.forEach((el) => el.classList.add('kiro-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('kiro-in')
            io.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    )
    els.forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add('kiro-in')
      } else {
        io.observe(el)
      }
    })
    const failsafe = window.setTimeout(() => {
      els.forEach((el) => el.classList.add('kiro-in'))
    }, 1800)
    return () => {
      io.disconnect()
      window.clearTimeout(failsafe)
    }
  }, [])

  /* GSAP: covers (D1), title reveals (D2), ghost-word counter-drift (D3),
     progress rail (D5), unmask quote (D4), interior-plate velocity bend
     (D8). No pinned sections anywhere, plain scrubs only. */
  useEffect(() => {
    if (reduced() || !rootRef.current) return
    const root = rootRef.current
    let lenis: Lenis | null = null
    let tick: ((time: number) => void) | null = null

    const ctx = gsap.context(() => {
      lenis = new Lenis({ duration: 1.05, smoothWheel: true })
      lenis.on('scroll', ScrollTrigger.update)
      tick = (time: number) => lenis?.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)

      /* D1 — chapter covers: image scale 1.16→1 (the permanent grayscale/
         contrast/brightness grade lives as a static inline filter, never
         animated), name yPercent 20→−14, scrub 1.1. */
      gsap.utils.toArray<HTMLElement>('.kiro-cover').forEach((cover) => {
        const img = cover.querySelector<HTMLElement>('[data-cover-img]')
        const word = cover.querySelector<HTMLElement>('[data-cover-year]')
        const trig = { trigger: cover, start: 'top bottom', end: 'bottom top', scrub: 1.1 }
        if (img) gsap.fromTo(img, { scale: 1.16 }, { scale: 1, ease: 'none', scrollTrigger: trig })
        if (word) gsap.fromTo(word, { yPercent: 20 }, { yPercent: -14, ease: 'none', scrollTrigger: trig })
      })

      /* D3 — ghost-word counter-drift: top word drifts up, bottom word
         drifts down, scrubbed against its own chapter head. */
      gsap.utils.toArray<HTMLElement>('[data-chapter-head]').forEach((head) => {
        const a = head.querySelector<HTMLElement>('[data-ghost-a]')
        const b = head.querySelector<HTMLElement>('[data-ghost-b]')
        const trig = { trigger: head, start: 'top bottom', end: 'bottom top', scrub: 1 }
        if (a) gsap.fromTo(a, { yPercent: 6 }, { yPercent: -16, ease: 'none', scrollTrigger: trig })
        if (b) gsap.fromTo(b, { yPercent: -6 }, { yPercent: 16, ease: 'none', scrollTrigger: trig })
      })

      /* D5 — per-chapter rail fill. */
      gsap.utils.toArray<HTMLElement>('[data-chapter-root]').forEach((chRoot, i) => {
        const seg = document.querySelector<HTMLElement>(`[data-rail-fill="${i}"]`)
        if (!seg) return
        gsap.fromTo(
          seg,
          { scaleX: 0 },
          { scaleX: 1, ease: 'none', scrollTrigger: { trigger: chRoot, start: 'top 75%', end: 'bottom 25%', scrub: 0.4 } },
        )
      })

      /* Mobile slim page-progress line. */
      const pageFill = document.querySelector<HTMLElement>('[data-page-progress]')
      if (pageFill) {
        gsap.fromTo(
          pageFill,
          { scaleX: 0 },
          { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.3 } },
        )
      }

      /* D2 — per-letter title reveal + D4 — word unmask. Wait for the
         self-hosted fonts so SplitText measures real glyph widths, not
         fallback-font placeholders (see gsap-splittext-clearprops-traps). */
      document.fonts.ready.then(() => {
        const chars: Element[] = []
        const words: Element[] = []

        gsap.utils.toArray<HTMLElement>('[data-split-title]').forEach((el) => {
          const split = SplitText.create(el, { type: 'words,chars', wordsClass: 'kiro-word', charsClass: 'kiro-char' })
          chars.push(...split.chars)
          gsap.fromTo(
            split.chars,
            { yPercent: 60, opacity: 0, rotate: () => gsap.utils.random(-9, 9) },
            {
              yPercent: 0, opacity: 1, rotate: 0, duration: 0.85, ease: 'expo.out', stagger: 0.05,
              scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
            },
          )
        })

        gsap.utils.toArray<HTMLElement>('[data-unmask-quote]').forEach((el) => {
          const split = SplitText.create(el, { type: 'words', wordsClass: 'kiro-word' })
          words.push(...split.words)
          gsap.fromTo(
            split.words,
            { yPercent: 115, opacity: 0 },
            {
              yPercent: 0, opacity: 1, duration: 0.85, ease: 'expo.out', stagger: 0.022,
              scrollTrigger: { trigger: el, start: 'top 78%', toggleActions: 'play none none none' },
            },
          )
        })

        ScrollTrigger.refresh()

        /* Failsafe (<=2s): only clear the props that were actually
           animated, never clearProps:'all' (that wipes React's inline
           style attribute — see gsap-splittext-clearprops-traps). */
        window.setTimeout(() => {
          if (chars.length) gsap.set(chars, { opacity: 1, clearProps: 'transform' })
          if (words.length) gsap.set(words, { opacity: 1, clearProps: 'transform' })
        }, 1800)
      })

      /* D8 — interior-plate velocity bend, straight from Lenis velocity via
         GSAP quickSetters (cheap: exactly one interior plate exists). */
      const plateImgs = Array.from(document.querySelectorAll<HTMLImageElement>('.kiro-plate img'))
      const setters = plateImgs.map((img) => ({
        setT: gsap.quickSetter(img, 'transform') as (v: string) => void,
        setF: gsap.quickSetter(img, 'filter') as (v: string) => void,
      }))
      const bendTick = () => {
        if (!setters.length) return
        const v = lenis?.velocity ?? 0
        const s = Math.min(2.4, Math.abs(v))
        const t = `scale(${(1 + s * 0.012).toFixed(4)}) skewY(${(v * 0.4).toFixed(2)}deg)`
        const f = `blur(${Math.min(2.2, s * 1.6).toFixed(2)}px)`
        setters.forEach(({ setT, setF }) => {
          setT(t)
          setF(f)
        })
      }
      gsap.ticker.add(bendTick)

      return () => {
        gsap.ticker.remove(bendTick)
      }
    }, root)

    return () => {
      ctx.revert()
      if (tick) gsap.ticker.remove(tick)
      lenis?.destroy()
    }
  }, [])

  const mailto = useMemo(() => {
    const subject = 'Beiðni um tíma, kírópraktorstofan'
    const bodyLines = [
      `Nafn: ${name}`,
      `Símanúmer: ${phone}`,
      `Netfang: ${email}`,
      '',
      'Erindi:',
      erindi,
    ]
    return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`
  }, [name, phone, email, erindi])

  return (
    <div ref={rootRef} style={{ background: GROUND, color: BONE, fontFamily: BODY, minHeight: '100vh' }}>
      <style>{`
        @font-face { font-family:'Kiro Khand'; src:url('${import.meta.env.BASE_URL}kiropraktorstofan/fonts/khand-300.woff2') format('woff2'); font-weight:300; font-style:normal; font-display:swap; }
        @font-face { font-family:'Kiro Khand'; src:url('${import.meta.env.BASE_URL}kiropraktorstofan/fonts/khand-400.woff2') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
        @font-face { font-family:'Kiro Khand'; src:url('${import.meta.env.BASE_URL}kiropraktorstofan/fonts/khand-600.woff2') format('woff2'); font-weight:600; font-style:normal; font-display:swap; }
        @font-face { font-family:'Kiro Khand'; src:url('${import.meta.env.BASE_URL}kiropraktorstofan/fonts/khand-700.woff2') format('woff2'); font-weight:700; font-style:normal; font-display:swap; }
        @font-face { font-family:'Kiro General Sans'; src:url('${import.meta.env.BASE_URL}kiropraktorstofan/fonts/general-sans-400.woff2') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
        @font-face { font-family:'Kiro General Sans'; src:url('${import.meta.env.BASE_URL}kiropraktorstofan/fonts/general-sans-500.woff2') format('woff2'); font-weight:500; font-style:normal; font-display:swap; }
        @font-face { font-family:'Kiro General Sans'; src:url('${import.meta.env.BASE_URL}kiropraktorstofan/fonts/general-sans-600.woff2') format('woff2'); font-weight:600; font-style:normal; font-display:swap; }
        @font-face { font-family:'Kiro Server Mono'; src:url('${import.meta.env.BASE_URL}kiropraktorstofan/fonts/server-mono-400.woff2') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
        @font-face { font-family:'Kiro Server Mono'; src:url('${import.meta.env.BASE_URL}kiropraktorstofan/fonts/server-mono-italic.woff2') format('woff2'); font-weight:400; font-style:italic; font-display:swap; }
      `}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      <PreviewChrome company={company} />

      {/* mobile page-progress line */}
      <div aria-hidden="true" className="kiro-page-progress fixed inset-x-0 top-0 z-30 h-[3px]" style={{ background: 'rgba(236,233,227,.10)' }}>
        <div data-page-progress className="h-full" style={{ background: ACCENT, transformOrigin: 'left center', transform: 'scaleX(0)' }} />
      </div>

      <ChapterRail />

      {/* ── NAV ───────────────────────────────────────────────────────────
          D-FIX-2: was `sticky top-0`. Sticky still reserves its own height
          in normal flow at its natural position (the very top of the
          document, right before <main>) — that pushed KAFLI 01's 100svh
          cover down by the header's own height, so the cover's bottom-
          anchored "1977" word and "KAFLI 01 / 04" label sat that many
          pixels below the fold on a 900px-tall viewport (verified:
          cover.getBoundingClientRect().bottom was 973 against a 900px
          window, exactly headerH=73 too tall). A header pinned at the very
          top of the page with nothing above it behaves identically to
          `fixed` for scroll/visibility purposes, but `fixed` takes zero
          flow space, so switching removes the phantom gap and lets K01's
          cover fill the full 900px. ─────────────────────────────────────── */}
      <header
        className="fixed inset-x-0 top-0 z-40"
        style={{ background: 'rgba(11,11,11,.86)', backdropFilter: 'blur(10px)', borderBottom: `1px solid ${HAIR}` }}
      >
        <div className="mx-auto flex max-w-[1180px] items-center gap-4 px-5 py-3.5 sm:px-8">
          <a href="#top" className={`flex min-h-11 items-center gap-2.5 ${FOCUS}`} aria-label="Kírópraktorstofan, efst á síðu">
            <img
              src={IMG.logo}
              alt="Merki Kírópraktorstofu Tryggva Jónassonar"
              width={24}
              height={24}
              style={{ borderRadius: 2 }}
            />
            <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: '1.14rem', color: BONE, whiteSpace: 'nowrap' }}>
              Kírópraktorstofan
            </span>
          </a>
          <span
            className="ml-2 hidden items-center gap-2 md:flex"
            style={{ fontFamily: MONO, fontSize: '.72rem', letterSpacing: '.08em', color: status.open ? OPEN_GREEN : MUTE }}
          >
            <span aria-hidden="true" className="inline-block rounded-full" style={{ width: 6, height: 6, background: status.open ? OPEN_GREEN : MUTE }} />
            {status.text}
          </span>
          <nav className="ml-auto hidden items-center gap-6 lg:flex" aria-label="Aðalvalmynd">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={`kiro-navlink inline-flex min-h-11 items-center text-[.94rem] ${FOCUS}`}
                style={{ color: MUTE, fontFamily: BODY }}
              >
                {n.label}
              </a>
            ))}
          </nav>
          {/* D-FIX-1: was visible at every width, which — alongside the
              unshrinkable nowrap wordmark and the shrink-0 menu button —
              left no room at 320-374px (measured: the menu button's own
              right edge landed at 327px against a 320px viewport). The
              persistent bottom call strip (below) already puts the phone
              number one tap away on every viewport under 1024px, so this
              header chip is redundant clutter below `sm` and is dropped
              there; ml-auto moves to the menu button as a fallback so
              layout still docks right with the chip hidden. */}
          <a
            href={PHONE_HREF}
            className={`kiro-marker kiro-press ml-auto hidden min-h-11 shrink-0 items-center gap-2 ${FOCUS} sm:inline-flex lg:ml-0`}
            style={{ ['--kiro-accent' as string]: ACCENT, fontFamily: MONO, fontSize: '.86rem', whiteSpace: 'nowrap' }}
          >
            <Phone size={15} aria-hidden="true" /> {PHONE_DISPLAY}
          </a>
          <button
            type="button"
            onClick={() => setMenu((v) => !v)}
            aria-expanded={menu}
            aria-label={menu ? 'Loka valmynd' : 'Opna valmynd'}
            className={`ml-auto grid h-11 w-11 shrink-0 place-items-center sm:ml-0 lg:hidden ${FOCUS}`}
            style={{ border: `1px solid ${HAIR}`, color: BONE, borderRadius: 2 }}
          >
            {menu ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
        {menu && (
          <div className="border-t lg:hidden" style={{ borderColor: HAIR, background: GROUND }}>
            <nav className="mx-auto max-w-[1180px] px-5 py-2 sm:px-8" aria-label="Valmynd">
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setMenu(false)}
                  className={`flex min-h-12 items-center border-b py-3.5 text-[1.02rem] ${FOCUS}`}
                  style={{ borderColor: HAIR, fontFamily: DISPLAY, fontWeight: 600, color: BONE }}
                >
                  {n.label}
                </a>
              ))}
              <span className="flex min-h-12 items-center gap-2 py-3.5 text-[.86rem]" style={{ fontFamily: MONO, color: status.open ? OPEN_GREEN : MUTE }}>
                <span aria-hidden="true" className="inline-block rounded-full" style={{ width: 6, height: 6, background: status.open ? OPEN_GREEN : MUTE }} />
                {status.text}
              </span>
            </nav>
          </div>
        )}
      </header>

      {/* ── D7: fixed slim call strip, mobile only, present from first
          paint (not scroll-gated, not a pill: a full-width hairline bar). ── */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
        style={{ background: 'rgba(11,11,11,.94)', backdropFilter: 'blur(10px)', borderTop: `1px solid ${HAIR}`, paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <a
          href={PHONE_HREF}
          className={`kiro-press flex min-h-14 items-center justify-center gap-2.5 ${FOCUS}`}
          style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: '1.05rem', color: BONE }}
        >
          <Phone size={17} aria-hidden="true" style={{ color: ACCENT }} /> Hringja í {PHONE_DISPLAY}
        </a>
      </div>

      <main id="top" className="pb-16 lg:pb-0">
        {/* ── KAFLI 01 — 1977, leyfið sjálft ─────────────────────────────
            D-FIX-4: was a plain <div role="region">; now a real <section>
            landmark (aria-label alone is enough for a <section> to expose
            as a "region" landmark, so role="region" is dropped as
            redundant). Same for the other three chapter roots below. ──── */}
        <section id="leyfid" data-chapter-root={0} aria-label="Kafli 1 af 4: 1977, leyfið sjálft">
          <ChapterCover
            n="01" total={4} word="1977"
            src={IMG.doorway1977}
            alt="Sólarljós fellur inn um hurð með rifflóttu gleri á viðarþili, hurðarhúnn úr eir, dökkur viðarparketgólf. Skjaluð kyrralífsmynd sem vísar til ársins 1977, þegar stofan opnaði."
            objectPosition="50% 38%"
            priority
          />
          <ChapterHead
            as="h1" n="01" sub="1977"
            title="Fyrsta starfsleyfið á Íslandi"
            abstract="Tryggvi Jónasson lauk stúdentsprófi frá Menntaskólanum í Reykjavík 1971 og hélt sama haust til náms við Anglo-European College of Chiropractic á Englandi. Hann útskrifaðist sem Doctor of Chiropractic 1976, starfaði hálft ár í Danmörku og opnaði eigin stofu í Reykjavík haustið 1977, eftir að landlæknir og Alþingi höfðu tekið afstöðu til nýrrar heilbrigðisstéttar á Íslandi."
            ghostTop="LEYFIÐ" ghostBottom="1977"
            plate={
              <Plate
                src={IMG.document}
                alt="Kyrralífsmynd af stimpluðu skjali og fylliperi á dökku skrifborði, sem vísar til leyfisveitingarinnar."
                ratio="4 / 3"
              />
            }
          />
          <div className="mx-auto max-w-[1180px] px-5 pb-4 sm:px-8">
            <Rise>
              <FactGrid items={LEYFID_FACTS} />
            </Rise>
          </div>
          <UnmaskQuote
            text="Að sögn stofunnar sjálfrar var þetta fyrsta opinbera starfsleyfi kírópraktors sem veitt var á Norðurlöndunum."
            source="Frá kiropraktorstofan.is, ekki óháð staðfesting"
          />
        </section>

        {/* ── KAFLI 02 — Meðferðin ─────────────────────────────────────── */}
        <section id="medferdin" data-chapter-root={1} aria-label="Kafli 2 af 4: Meðferðin">
          <ChapterCover
            n="02" total={4} word="MEÐFERÐIN"
            src={IMG.hendur}
            alt="Nærmynd af höndum, öruggum þrátt fyrir aldur, sem hvíla á brún pappírsklædds meðferðarbekks í hlýrri hliðarlýsingu."
            objectPosition="56% 55%"
          />
          <ChapterHead
            as="h2" n="02" sub="Meðferðin"
            title="Áður en hnykkt er"
            abstract="Kírópraktík beinist að heilbrigði hryggjarins: byggingu hans, stöðu, hreyfingu og hæfni til að jafna sig. Sérhver gestur fær viðtal og ítarlega skoðun áður en meðferð hefst."
            ghostTop="SKOÐUN" ghostBottom="HNYKKING"
          />
          <div className="mx-auto max-w-[1180px] px-5 pb-4 sm:px-8">
            <Rise>
              <FactGrid items={EXAM_FACTS} />
            </Rise>
          </div>
          <Rise className="mx-auto max-w-[1180px] px-5 pt-10 pb-16 sm:px-8 sm:pb-20">
            <div className="grid gap-8 border-t pt-10 sm:grid-cols-2" style={{ borderColor: HAIR }}>
              <p style={{ color: MUTE, lineHeight: 1.62, fontSize: '1.02rem' }}>{SPINE_FACT}</p>
              <div className="grid gap-4" style={{ fontFamily: MONO, fontSize: '.86rem', color: MUTE, lineHeight: 1.6 }}>
                <p>{TREATMENT_LENGTH_NOTE}</p>
                <p>{XRAY_NOTE}</p>
              </div>
            </div>
          </Rise>
        </section>

        {/* ── KAFLI 03 — Verðskráin ────────────────────────────────────── */}
        <section id="verd" className="scroll-mt-24" data-chapter-root={2} aria-label="Kafli 3 af 4: Verðskráin">
          <ChapterCover
            n="03" total={4} word="VERÐSKRÁIN"
            src={IMG.document}
            alt="Kyrralífsmynd af stimpluðu skjali og fylliperi í hlýju hliðarljósi á dökku skrifborði, endurnýtt hér sem tákn fyrir opinberan taxta."
            objectPosition="62% 58%"
            tint="radial-gradient(120% 70% at 32% 12%, rgba(154,43,52,.18), transparent 60%)"
          />
          <ChapterHead
            as="h2" n="03" sub="Verðskrá"
            title="Verðskráin, loksins efst"
            abstract="Á núverandi vef er verðskráin þrjá smelli frá forsíðunni. Hér er hún efst, sýnileg og nákvæm, tekin beint af taxta stofunnar fyrir árið 2026."
            ghostTop="TAXTINN" ghostBottom="2026"
          />
          <div className="mx-auto max-w-[1180px] px-5 pb-8 sm:px-8">
            <Rise>
              <Ledger rows={PRICES.map((p, i) => ({ n: pad(i + 1), label: p.item, value: p.price }))} />
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <p style={{ fontFamily: MONO, fontSize: '.84rem', color: MUTE, lineHeight: 1.6 }}>{PRICE_VALID}</p>
                <p style={{ fontFamily: MONO, fontSize: '.84rem', color: MUTE, lineHeight: 1.6 }}>{PRICE_NOTE}</p>
              </div>
            </Rise>
            <Rise delay={1} className="mt-16">
              <h3 style={{ fontFamily: MONO, fontSize: '.78rem', letterSpacing: '.12em', color: MUTE }} className="uppercase">
                Opnunartími
              </h3>
              <div className="mt-4">
                <Ledger rows={HOURS.map((h, i) => ({ n: pad(i + 1), label: h.days, value: h.span }))} />
              </div>
            </Rise>
            <Rise delay={2} className="mt-14 pb-16 sm:pb-24">
              <a
                href="#bokun"
                className={`kiro-bracket kiro-bracket-underline inline-flex min-h-11 items-center gap-1 ${FOCUS}`}
                style={{ color: BONE, fontFamily: MONO, fontSize: '.94rem' }}
              >
                <span aria-hidden="true" className="kiro-bracket-mark">[ </span>Bóka tíma<span aria-hidden="true" className="kiro-bracket-mark"> ]</span>
              </a>
            </Rise>
          </div>
        </section>

        {/* ── KAFLI 04 — Stofan ────────────────────────────────────────── */}
        <section id="stadsetning" className="scroll-mt-24" data-chapter-root={3} aria-label="Kafli 4 af 4: Stofan">
          <ChapterCover
            n="04" total={4} word="STOFAN"
            src={IMG.stofanReal}
            alt="Tryggvi Jónasson stendur í dyragætt stofunnar árið 2017 með krosslagðar hendur, veggspjöld af hrygg og beinagrind sjást á vegg fyrir innan."
            objectPosition="72% 36%"
          />
          <ChapterHead
            as="h2" n="04" sub="Í dag"
            title="Háaleitisbraut 66"
            abstract={`${ADDRESS_NOTE} Stofan er í dag á Háaleitisbraut 66, við Grensáskirkju.`}
            ghostTop="HÁALEITISBRAUT" ghostBottom="66"
          />
          <StoryColumns
            n="04"
            leftLabel="Þá"
            leftBody="Klapparstígur 27, fyrsta stofan. Fljótlega eftir opnun fór af stað ferli hjá embætti landlæknis, sem taldi lagaheimild vanta fyrir svo nýja heilbrigðisþjónustu á Íslandi."
            rightLabel="Í dag"
            rightBody={`Stofan er í dag á Háaleitisbraut 66, við Grensáskirkju. ${PATIENT_COUNT_NOTE}`}
          />
          <UnmaskQuote
            text={PATIENT_COUNT_NOTE}
            source="Frá ferilskrá Tryggva Jónassonar á kiropraktorstofan.is"
          />
          <div className="mx-auto max-w-[1180px] px-5 pb-16 sm:px-8 sm:pb-20">
            <Rise>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className={`kiro-bracket kiro-bracket-underline inline-flex min-h-11 items-center gap-1 ${FOCUS}`}
                style={{ color: BONE, fontFamily: MONO, fontSize: '.94rem' }}
              >
                <span aria-hidden="true" className="kiro-bracket-mark">[ </span>Opna í kortum<span aria-hidden="true" className="kiro-bracket-mark"> ]</span>
              </a>
            </Rise>
          </div>
        </section>

        {/* ── BÓKUN ────────────────────────────────────────────────────── */}
        <section id="bokun" className="scroll-mt-24" style={{ background: PANEL }} aria-labelledby="bokun-h">
          <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 sm:py-28">
            <Rise>
              <h2
                id="bokun-h"
                style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(2rem, 5vw, 3.2rem)', letterSpacing: '-.01em', lineHeight: 0.98, color: BONE }}
              >
                Biðjið um tíma
              </h2>
              <p className="mt-5 max-w-[52ch]" style={{ color: MUTE, fontSize: '1.06rem', lineHeight: 1.6 }}>
                Fyllið út formið og Tryggvi hefur samband símleiðis eða í tölvupósti. Í bráðatilfellum er
                fljótlegast að hringja beint.
              </p>
            </Rise>
            <Rise delay={1}>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  window.location.href = mailto
                }}
                className="mt-10 grid max-w-[640px] gap-6"
              >
                <div className="grid gap-2">
                  <label htmlFor="kiro-name" style={{ fontFamily: MONO, fontSize: '.78rem', color: MUTE }} className="uppercase">
                    Fullt nafn
                  </label>
                  <input
                    id="kiro-name" required value={name} onChange={(e) => setName(e.target.value)}
                    className={`kiro-field min-h-12 px-1 ${FOCUS}`} style={{ fontFamily: BODY, fontSize: '1rem', color: BONE }}
                  />
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label htmlFor="kiro-phone" style={{ fontFamily: MONO, fontSize: '.78rem', color: MUTE }} className="uppercase">
                      Símanúmer
                    </label>
                    <input
                      id="kiro-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                      className={`kiro-field min-h-12 px-1 ${FOCUS}`} style={{ fontFamily: BODY, fontSize: '1rem', color: BONE }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="kiro-email" style={{ fontFamily: MONO, fontSize: '.78rem', color: MUTE }} className="uppercase">
                      Netfang
                    </label>
                    <input
                      id="kiro-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className={`kiro-field min-h-12 px-1 ${FOCUS}`} style={{ fontFamily: BODY, fontSize: '1rem', color: BONE }}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="kiro-erindi" style={{ fontFamily: MONO, fontSize: '.78rem', color: MUTE }} className="uppercase">
                    Aðrar upplýsingar sem þú vilt að komi fram
                  </label>
                  <textarea
                    id="kiro-erindi" rows={4} value={erindi} onChange={(e) => setErindi(e.target.value)}
                    className={`kiro-field px-1 py-2 ${FOCUS}`} style={{ fontFamily: BODY, fontSize: '1rem', color: BONE, resize: 'vertical' }}
                  />
                </div>
                <p style={{ fontFamily: MONO, fontSize: '.78rem', color: MUTE, lineHeight: 1.6 }}>
                  Beiðnin opnast í tölvupóstforritinu þínu, tilbúin til sendingar, og þú getur yfirfarið
                  hana áður en hún fer af stað.
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    className={`kiro-marker kiro-press inline-flex min-h-14 items-center gap-2 px-6 ${FOCUS}`}
                    style={{ ['--kiro-accent' as string]: ACCENT, fontFamily: DISPLAY, fontWeight: 600, fontSize: '1.05rem' }}
                  >
                    <Send size={17} aria-hidden="true" /> Senda beiðni
                  </button>
                  <a
                    href={PHONE_HREF}
                    className={`kiro-bracket kiro-bracket-underline inline-flex min-h-14 items-center gap-2 ${FOCUS}`}
                    style={{ color: BONE, fontFamily: MONO, fontSize: '.94rem' }}
                  >
                    <Phone size={16} aria-hidden="true" /> Hringja í {PHONE_DISPLAY}
                  </a>
                </div>
              </form>
            </Rise>
          </div>
        </section>

        {/* ── CLOSER ───────────────────────────────────────────────────── */}
        <section aria-labelledby="closer-h">
          <div className="mx-auto max-w-[1180px] px-5 py-24 text-center sm:px-8 sm:py-32">
            <Rise>
              <h2
                id="closer-h"
                className="mx-auto max-w-[20ch]"
                style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(2.1rem, 6vw, 3.8rem)', letterSpacing: '-.01em', lineHeight: 1.02, color: BONE }}
              >
                Sjúkraskráin heldur áfram. Hringdu og bættu þínum kafla við.
              </h2>
              <a
                href={PHONE_HREF}
                className={`kiro-marker kiro-press mt-10 inline-block ${FOCUS}`}
                style={{ ['--kiro-accent' as string]: ACCENT, fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(1.6rem, 5vw, 2.6rem)' }}
              >
                {PHONE_DISPLAY}
              </a>
              <p className="mt-9" style={{ fontFamily: MONO, fontSize: '.82rem', color: MUTE, lineHeight: 1.7 }}>
                {PRACTICE_NAME} · {ADDRESS_LINE1}, {ADDRESS_LINE2}
                <br />
                <a href={EMAIL_HREF} className={`kiro-navlink inline-flex min-h-11 items-center ${FOCUS}`} style={{ color: BONE }}>
                  <Mail size={13} className="mr-1.5" aria-hidden="true" /> {EMAIL}
                </a>
              </p>
            </Rise>
          </div>
        </section>
      </main>

      <PreviewFooter company={company} />
    </div>
  )
}
