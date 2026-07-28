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
  HOURS, IMG, JSON_LD, LEYFID_FACTS, MAPS_URL, NAV, PHONE_DISPLAY, PHONE_HREF, PRACTICE_NAME,
  PRICES, PRICE_NOTE, PRICE_VALID, SPINE_FACT, TREATMENT_LENGTH_NOTE, XRAY_NOTE,
} from './data'

gsap.registerPlugin(ScrollTrigger, SplitText)

const company = getPreviewCompany('kiropraktorstofan')

/* ── "FYRSTA LEYFIÐ" ──────────────────────────────────────────────────────
   Reference system: rr-tales-design-system.md (Reykjavik Roses "Five tales").
   Its spine is the chaptered narrative itself, not its streetwear identity:
   a chapter COVER beat, a chapter HEAD beat (mono pre-labels, per-letter
   title reveal, giant outlined background words behind a centred plate), a
   numbered spec row, a chapter progress rail, a two-column "story" beat and
   an outro word-unmask. All six ship below, adapted to a 48-year chiropractic
   practice instead of a streetwear archive, with the reference's OWN palette
   and type left behind entirely (no dark near-black ground, no Array/Hanken/
   IBM Plex Mono). Devices are numbered "RR-DEVICE n" in the comments below
   so the final report can cite file:line for each one.

   CONCEPT. Tryggvi Jónasson holds Iceland's first official chiropractor
   licence, won through a real fight with landlæknir and a real Alþingi act.
   The page tells that as four chapters, MR to AECC, the 1977 opening, the
   licence itself, and what the practice does today, then ends at the
   reader's own back with a working booking request. No photography of the
   clinic exists (verified: nothing usable anywhere on kiropraktorstofan.is),
   so three SIGNATURE plates carry abstract, generated imagery instead, with
   intentional gradient/texture fallbacks until those assets exist (see
   IMAGE-PROMPTS.md). The signature device is the spine itself: a 24-vertebra
   rail doubling as chapter progress, uncurling into a neutral line in the
   closer, the "reader's own back" made literal. ────────────────────────── */

const BONE = '#F2ECDD'
const KRAFT = '#E7DCC0'
const PAPERWHITE = '#FBF8EF'
const INK = '#201C15'
const SOFT = '#3A3528'
const MUTE = '#5C554A'
const SEAL = '#1D3557'
const SEALDEEP = '#12233F'
const HAIR = 'rgba(32,28,21,.14)'
const HAIR_ON_SEAL = 'rgba(242,236,221,.20)'
const SEAL_SOFT = 'rgba(242,236,221,.82)'
const SEAL_MUTE = 'rgba(242,236,221,.58)'
const OPEN_GREEN = '#3F6B3F'

const DISPLAY = "'Kiro Marcellus', Georgia, 'Times New Roman', serif"
const BODY = "'Kiro Newsreader', Georgia, serif"
const MONO = "'Kiro Server Mono', ui-monospace, 'SFMono-Regular', monospace"

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1D3557] focus-visible:ring-offset-[#F2ECDD]'

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

/* ── real, published hours → live status (Kírópraktorstofan/data.ts HOURS,
   restated here as decimal spans for the client-side clock) ────────────── */
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

/* ── the spine layout (24 vertebrae + sacrum), a deterministic gentle
   forward-slouch curve, uncurled by RR-DEVICE 9 in the closer ───────────── */
const SPINE_LAYOUT = Array.from({ length: 24 }, (_, i) => {
  const t = i / 23
  const x = Math.sin(t * Math.PI * 1.15) * 20 + (1 - t) * 9
  return { x: Math.round(x * 10) / 10, r: Math.round(x * 0.5 * 10) / 10 }
})

/* ── primitives ───────────────────────────────────────────────────────── */

/** RR-DEVICE 7 — base reveal primitive. IntersectionObserver → .kiro-in,
    CSS transition toward resting state. Set up once in Page(), see useReveal. */
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

function H2({
  children,
  id,
  color = INK,
  size = 'clamp(2rem, 5vw, 3.2rem)',
}: {
  children: ReactNode
  id?: string
  color?: string
  size?: string
}) {
  return (
    <h2
      id={id}
      style={{
        fontFamily: DISPLAY,
        fontWeight: 400,
        fontSize: size,
        letterSpacing: '-.01em',
        lineHeight: 1.08,
        color,
      }}
    >
      {children}
    </h2>
  )
}

/** RR-DEVICE 8 — signature plate. Hard clip-path wipe reveal (IntersectionObserver
    toggling .kiro-in, see Rise/useReveal) + a Lenis-velocity CSS bend on the
    <img> once it loads (see the gsap.context tick in Page()). Ships with an
    intentional gradient/texture fallback; the real asset (from
    IMAGE-PROMPTS.md) fades in on top once the lead generates it, and if the
    file 404s the <img> hides itself so the fallback is the permanent visual. */
function Plate({
  src,
  alt,
  ratio,
  ground,
  children,
}: {
  src: string
  alt: string
  ratio: string
  ground: string
  children: ReactNode
}) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div
      data-plate
      className="kiro-plate"
      style={{ aspectRatio: ratio, ['--kiro-plate-bg' as string]: ground }}
    >
      <div className="kiro-plate-fallback" aria-hidden="true">
        {children}
      </div>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={loaded ? 'kiro-loaded' : ''}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          ;(e.currentTarget as HTMLImageElement).style.display = 'none'
        }}
      />
    </div>
  )
}

/** Kafli I has no dedicated signature photo (only three exist, for Kafli II,
    III and IV, see IMAGE-PROMPTS.md), so its stage is texture-only: no <img>,
    no src pretending an asset will eventually land here. Reusing another
    chapter's photo path would misattach a 1977-opening image to the 1971
    chapter once that asset actually exists, so this stays deliberately
    image-free rather than a fourth Plate. */
function TexturePanel({ ratio, children }: { ratio: string; children: ReactNode }) {
  return (
    <div className="kiro-rv relative overflow-hidden" style={{ aspectRatio: ratio }}>
      {children}
    </div>
  )
}

function GrainFilter() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <filter id="kiroGrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0" />
      </filter>
    </svg>
  )
}

/* ── RR-DEVICE 3 — numbered spec row. Hairline top+bottom, verticals between
   cells, mono 01/02/03. Never pills or chips. ──────────────────────────── */
function SpecRow({
  items,
  ink,
  mute,
  hair,
  accent,
}: {
  items: { n: string; label: string; value?: string; body?: string }[]
  ink: string
  mute: string
  hair: string
  accent: string
}) {
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        borderTop: `1px solid ${hair}`,
        borderBottom: `1px solid ${hair}`,
      }}
    >
      {items.map((it, i) => (
        <div
          key={it.n}
          className="kiro-spec-cell px-1 py-7 sm:px-6"
          style={
            {
              borderLeft: i === 0 ? 'none' : `1px solid ${hair}`,
              '--kiro-spec-hair': hair,
            } as CSSProperties
          }
        >
          <p style={{ fontFamily: MONO, fontSize: '.78rem', color: accent }}>{it.n}</p>
          <p className="mt-3" style={{ fontFamily: DISPLAY, fontSize: '1.18rem', color: ink }}>
            {it.label}
          </p>
          {it.value && (
            <p className="mt-1" style={{ fontFamily: MONO, fontSize: '.88rem', color: mute }}>
              {it.value}
            </p>
          )}
          {it.body && (
            <p className="mt-2" style={{ color: mute, lineHeight: 1.55, fontSize: '.96rem' }}>
              {it.body}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

/* ── RR-DEVICE 1 — chapter cover. 100svh full-bleed divider: mono
   "KAFLI 0X / 04" bottom-left, giant year/word bottom-right, scrubbed
   scale+brightness on the ground and a yPercent parallax on the name. ──── */
function ChapterCover({
  n,
  total,
  word,
  ground,
  textColor,
  hairColor,
  gradient,
}: {
  n: string
  total: number
  word: string
  ground: string
  textColor: string
  hairColor: string
  gradient: string
}) {
  return (
    <div
      className="kiro-cover relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
      style={{ background: ground }}
    >
      <div
        data-cover-bg
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: gradient, transformOrigin: 'center' }}
      />
      <div className="relative mx-auto flex w-full max-w-[1180px] flex-col gap-4 px-5 pb-12 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:px-8 sm:pb-16">
        <p style={{ fontFamily: MONO, fontSize: '.82rem', letterSpacing: '.12em', color: hairColor }}>
          KAFLI {n} / {String(total).padStart(2, '0')}
        </p>
        <p
          data-cover-year
          className="text-left sm:text-right"
          style={{
            fontFamily: DISPLAY,
            /* min(), not clamp()'s hard floor: a floor that ignores available
               width is exactly how the reference system's own longest chapter
               name overflowed a narrow phone (rr-tales-design-system §11.5).
               No floor here, so the longest word (MEÐFERÐIN) always fits. */
            fontSize: 'min(17vw, 9.5rem)',
            lineHeight: 0.92,
            letterSpacing: '-.02em',
            color: textColor,
          }}
        >
          {word}
        </p>
      </div>
    </div>
  )
}

/* ── RR-DEVICE 2 — chapter head. Mono pre-labels → per-letter SplitText
   title reveal ([data-split-title], see the gsap.context effect) → abstract
   → a stage holding two giant outlined background words behind a centred
   Plate. ─────────────────────────────────────────────────────────────── */
function ChapterHead({
  n,
  year,
  tagline,
  title,
  abstract,
  bgWordTop,
  bgWordBottom,
  plate,
  ink,
  mute,
  hair,
  accent,
}: {
  n: string
  year: string
  tagline: string
  title: string
  abstract: string
  bgWordTop: string
  bgWordBottom: string
  plate: ReactNode
  ink: string
  mute: string
  hair: string
  accent: string
}) {
  return (
    <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 sm:py-28">
      <Rise>
        <p style={{ fontFamily: MONO, fontSize: '.78rem', letterSpacing: '.14em', color: accent }}>
          KAFLI {n} · {year}
        </p>
        <p className="mt-1" style={{ fontFamily: MONO, fontSize: '.78rem', letterSpacing: '.1em', color: mute }}>
          {tagline}
        </p>
        <h2
          data-split-title
          className="mt-6 max-w-[16ch]"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 400,
            fontSize: 'clamp(2.2rem, 6vw, 4.4rem)',
            letterSpacing: '-.015em',
            lineHeight: 1.06,
            color: ink,
          }}
        >
          {title}
        </h2>
        <p className="mt-6 max-w-[42ch]" style={{ color: mute, fontSize: '1.08rem', lineHeight: 1.6 }}>
          {abstract}
        </p>
      </Rise>

      {/* overflow-hidden: the giant outlined words are decorative and MAY
          clip at their container edge (the reference system documents this
          as the one intentionally-clipped element), but must never cause a
          page-level horizontal scrollbar. */}
      <div className="relative mt-16 overflow-hidden" style={{ minHeight: '58vh' }}>
        <p
          aria-hidden="true"
          className="kiro-outline-word absolute -top-2 left-0 max-w-full select-none"
          style={{
            ['--kiro-hair' as string]: hair,
            fontFamily: DISPLAY,
            fontSize: 'min(15vw, 11rem)',
            lineHeight: 0.9,
          }}
        >
          {bgWordTop}
        </p>
        <p
          aria-hidden="true"
          className="kiro-outline-word absolute right-0 bottom-0 max-w-full select-none text-right"
          style={{
            ['--kiro-hair' as string]: hair,
            fontFamily: DISPLAY,
            fontSize: 'min(15vw, 11rem)',
            lineHeight: 0.9,
          }}
        >
          {bgWordBottom}
        </p>
        <div className="relative mx-auto" style={{ width: 'min(52vw, 460px)', maxWidth: '86vw' }}>
          {plate}
        </div>
      </div>
    </div>
  )
}

/* ── RR-DEVICE 5 — story two-column beat, closed by an oversized chapter
   tag above a hairline. ──────────────────────────────────────────────── */
function StoryColumns({
  n,
  total,
  leftLabel,
  leftBody,
  rightLabel,
  rightBody,
  ink,
  mute,
  hair,
  accent,
}: {
  n: string
  total: number
  leftLabel: string
  leftBody: string
  rightLabel: string
  rightBody: string
  ink: string
  mute: string
  hair: string
  accent: string
}) {
  return (
    <div className="mx-auto max-w-[1180px] px-5 pb-24 sm:px-8 sm:pb-32">
      <Rise>
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-16">
          <div>
            <h3 style={{ fontFamily: MONO, fontSize: '.82rem', letterSpacing: '.12em', color: accent }}>
              {leftLabel}
            </h3>
            <p className="mt-4 max-w-[42ch]" style={{ color: ink, fontSize: '1.08rem', lineHeight: 1.6 }}>
              {leftBody}
            </p>
          </div>
          <div>
            <h3 style={{ fontFamily: MONO, fontSize: '.82rem', letterSpacing: '.12em', color: accent }}>
              {rightLabel}
            </h3>
            <p className="mt-4 max-w-[42ch]" style={{ color: ink, fontSize: '1.08rem', lineHeight: 1.6 }}>
              {rightBody}
            </p>
          </div>
        </div>
      </Rise>
      <Rise delay={1} className="mt-16 flex items-end justify-between border-t pt-6" style={{ borderColor: hair }}>
        <span
          style={{ fontFamily: DISPLAY, fontSize: 'clamp(2.4rem, 7vw, 4.6rem)', color: accent, lineHeight: 1 }}
        >
          KAFLI {n}
        </span>
        <span style={{ fontFamily: MONO, fontSize: '.8rem', color: mute }}>
          {n} / {String(total).padStart(2, '0')}
        </span>
      </Rise>
    </div>
  )
}

/* ── RR-DEVICE 6 — outro-style quote, unmasked word by word
   ([data-unmask-quote], see the gsap.context effect). ───────────────────── */
function UnmaskQuote({
  text,
  source,
  ink,
  mute,
  accent,
}: {
  text: string
  source: string
  ink: string
  mute: string
  accent: string
}) {
  return (
    <Rise className="mx-auto max-w-[1180px] px-5 pb-24 text-center sm:px-8 sm:pb-32">
      <blockquote
        data-unmask-quote
        style={{
          fontFamily: DISPLAY,
          fontWeight: 400,
          fontSize: 'clamp(1.5rem, 3.6vw, 2.6rem)',
          lineHeight: 1.3,
          color: ink,
        }}
      >
        {text}
      </blockquote>
      <p className="mt-6" style={{ fontFamily: MONO, fontSize: '.8rem', color: mute }}>
        <span style={{ color: accent }}>·</span> {source}
      </p>
    </Rise>
  )
}

/* ── RR-DEVICE 4 — chapter progress rail. Fixed bottom-centre on desktop
   (a slim top-edge page-progress line replaces it on mobile, matching the
   reference's own documented mobile fix). GSAP scaleX fill per chapter,
   driven by that chapter's own ScrollTrigger progress; see the
   gsap.context effect for the fill tweens. ──────────────────────────── */
function ChapterRail() {
  return (
    <nav
      aria-hidden="true"
      className="kiro-progress-deco pointer-events-none fixed inset-x-0 bottom-0 z-30 hidden justify-center pb-5 lg:flex"
    >
      <div
        className="pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2.5"
        style={{ background: 'rgba(251,248,239,.92)', boxShadow: '0 10px 30px rgba(32,28,21,.16)', border: `1px solid ${HAIR}`, backdropFilter: 'blur(8px)' }}
      >
        {CHAPTERS.map((c, i) => (
          <div key={c.n} className="flex flex-col items-center gap-1.5">
            <span
              className="block overflow-hidden rounded-full"
              style={{ width: 46, height: 5, background: 'rgba(32,28,21,.14)' }}
            >
              <span
                data-rail-fill={i}
                className="kiro-rail-fill block h-full rounded-full"
                style={{ background: SEAL }}
              />
            </span>
            <span style={{ fontFamily: MONO, fontSize: '.62rem', color: MUTE }}>{c.short}</span>
          </div>
        ))}
      </div>
    </nav>
  )
}

/* ── RR-DEVICE 9 (bonus) — the spine settle. 24 vertebrae + sacrum, laid out
   on a deterministic slouch curve, uncurling to neutral once in view (the
   same IntersectionObserver that drives .kiro-rv, reused generically for
   .kiro-spine, see useReveal). "Ending at the reader's own back." ──────── */
function SpineSettle() {
  return (
    <div className="kiro-rv kiro-spine mx-auto" aria-hidden="true" style={{ width: 60 }}>
      <div className="flex flex-col items-center" style={{ gap: 5 }}>
        {SPINE_LAYOUT.map((v, i) => (
          <div
            key={i}
            className="kiro-spine-vert"
            style={
              {
                '--vx': `${v.x}px`,
                '--vr': `${v.r}deg`,
                '--vi': i,
                width: i % 4 === 0 ? 28 : 34,
                height: 9,
                borderRadius: 4,
                background: 'rgba(29,53,87,.14)',
                border: `1px solid ${SEAL}`,
              } as CSSProperties
            }
          />
        ))}
        <div
          className="kiro-spine-vert mt-1"
          style={{ '--vx': '0px', '--vr': '0deg', '--vi': 24, width: 44, height: 20, borderRadius: '9px 9px 18px 18px', background: SEAL } as CSSProperties}
        />
      </div>
    </div>
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

  useEffect(() => setThemeColor(BONE), [])

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

  /* RR-DEVICE 7 — base reveal engine. Observes every .kiro-rv/.kiro-plate/
     .kiro-spine element, adds .kiro-in on first intersection (unobserve
     after), with an in-view-on-mount check and a 2s failsafe so nothing
     strands hidden if a font, an image or a paused rAF ever delays it. */
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.kiro-rv, .kiro-plate, .kiro-spine'))
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
    }, 2200)
    return () => {
      io.disconnect()
      window.clearTimeout(failsafe)
    }
  }, [])

  /* GSAP: covers (device 1), title reveals (device 2), progress rail
     (device 4), unmask quote (device 6), plate velocity bend (device 8).
     No pinned sections anywhere, plain scrubs only. */
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

      /* RR-DEVICE 1 — chapter covers: bg scale 1.16→1 + brightening, name
         yPercent 22→−16, scrub 1.1 (verbatim rr-tales cover values). */
      gsap.utils.toArray<HTMLElement>('.kiro-cover').forEach((cover) => {
        const bg = cover.querySelector<HTMLElement>('[data-cover-bg]')
        const word = cover.querySelector<HTMLElement>('[data-cover-year]')
        const trig = { trigger: cover, start: 'top bottom', end: 'bottom top', scrub: 1.1 }
        if (bg) gsap.fromTo(bg, { scale: 1.16, filter: 'brightness(.86)' }, { scale: 1, filter: 'brightness(1)', ease: 'none', scrollTrigger: trig })
        if (word) gsap.fromTo(word, { yPercent: 22 }, { yPercent: -16, ease: 'none', scrollTrigger: trig })
      })

      /* RR-DEVICE 4 — per-chapter rail fill. */
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

      /* RR-DEVICE 2 — per-letter title reveal + RR-DEVICE 6 — word unmask.
         Wait for the self-hosted fonts so SplitText measures real glyph
         widths, not fallback-font placeholders (see gsap-splittext-
         clearprops-traps memory). */
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
              yPercent: 0, opacity: 1, rotate: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05,
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
              yPercent: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.022,
              scrollTrigger: { trigger: el, start: 'top 78%', toggleActions: 'play none none none' },
            },
          )
        })

        ScrollTrigger.refresh()

        /* Failsafe: only clear the props that were actually animated, never
           clearProps:'all' (that wipes React's inline style attribute). */
        window.setTimeout(() => {
          if (chars.length) gsap.set(chars, { opacity: 1, clearProps: 'transform' })
          if (words.length) gsap.set(words, { opacity: 1, clearProps: 'transform' })
        }, 2400)
      })

      /* RR-DEVICE 8 — plate velocity bend, straight from Lenis velocity via
         the same ticker tick (cheap: at most 3 signature plates exist). */
      const bendables = () => Array.from(document.querySelectorAll<HTMLElement>('[data-plate] img'))
      const bendTick = () => {
        const v = lenis?.velocity ?? 0
        const s = Math.min(2.4, Math.abs(v))
        bendables().forEach((img) => {
          img.style.transform = `scale(${1 + s * 0.012}) skewY(${(v * 0.4).toFixed(2)}deg)`
          img.style.filter = `blur(${Math.min(2.2, s * 1.6).toFixed(2)}px)`
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
    <div ref={rootRef} style={{ background: BONE, color: INK, fontFamily: BODY, minHeight: '100vh' }}>
      <GrainFilter />
      <style>{`
        @font-face { font-family:'Kiro Marcellus'; src:url('${import.meta.env.BASE_URL}kiropraktorstofan/fonts/marcellus-400.woff2') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
        @font-face { font-family:'Kiro Newsreader'; src:url('${import.meta.env.BASE_URL}kiropraktorstofan/fonts/newsreader-400.woff2') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
        @font-face { font-family:'Kiro Newsreader'; src:url('${import.meta.env.BASE_URL}kiropraktorstofan/fonts/newsreader-500.woff2') format('woff2'); font-weight:500; font-style:normal; font-display:swap; }
        @font-face { font-family:'Kiro Newsreader'; src:url('${import.meta.env.BASE_URL}kiropraktorstofan/fonts/newsreader-600.woff2') format('woff2'); font-weight:600; font-style:normal; font-display:swap; }
        @font-face { font-family:'Kiro Newsreader'; src:url('${import.meta.env.BASE_URL}kiropraktorstofan/fonts/newsreader-700.woff2') format('woff2'); font-weight:700; font-style:normal; font-display:swap; }
        @font-face { font-family:'Kiro Newsreader'; src:url('${import.meta.env.BASE_URL}kiropraktorstofan/fonts/newsreader-italic.woff2') format('woff2'); font-weight:400; font-style:italic; font-display:swap; }
        @font-face { font-family:'Kiro Server Mono'; src:url('${import.meta.env.BASE_URL}kiropraktorstofan/fonts/server-mono-400.woff2') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
        @font-face { font-family:'Kiro Server Mono'; src:url('${import.meta.env.BASE_URL}kiropraktorstofan/fonts/server-mono-italic.woff2') format('woff2'); font-weight:400; font-style:italic; font-display:swap; }

        /* fixed, pointer-events-none grain, per the performance guardrail
           (never on a scrolling container) */
        .kiro-grain-overlay { position:fixed; inset:0; z-index:2; pointer-events:none; opacity:.035; filter:url(#kiroGrain); mix-blend-mode:overlay; }

        .kiro-spine-vert {
          transform: translateX(var(--vx,0px)) rotate(var(--vr,0deg));
          transition: transform 1.1s cubic-bezier(.16,1,.3,1);
          transition-delay: calc(var(--vi,0) * 38ms);
        }
        .kiro-spine.kiro-in .kiro-spine-vert { --vx: 0px; --vr: 0deg; }

        .kiro-navlink { position: relative; }
        .kiro-navlink::after {
          content:''; position:absolute; left:0; right:0; bottom:-3px; height:1px;
          background: currentColor; transform: scaleX(0); transform-origin:left;
          transition: transform .32s cubic-bezier(.22,.61,.36,1);
        }
        .kiro-navlink:hover::after, .kiro-navlink:focus-visible::after { transform: scaleX(1); }

        /* SpecRow (RR-DEVICE 3): the left-border verticals only make sense
           between side-by-side cells. Once auto-fit collapses the grid to a
           single column on narrow phones, swap to a top-border row divider
           instead, or the left border reads as a stray vertical line down a
           full-width stacked card. */
        @media (max-width: 640px) {
          .kiro-spec-cell { border-left: none !important; border-top: 1px solid var(--kiro-spec-hair, rgba(32,28,21,.14)); }
          .kiro-spec-cell:first-child { border-top: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .kiro-grain-overlay { display:none; }
          /* the chapter rail and page-progress line are pure scroll-progress
             decoration (both aria-hidden); under reduced motion the GSAP tick
             that fills them never runs, so they would sit frozen at empty
             forever. Hide them rather than show a permanently-wrong state. */
          .kiro-progress-deco { display:none !important; }
        }
      `}</style>

      <div className="kiro-grain-overlay" aria-hidden="true" />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      <PreviewChrome company={company} />

      {/* mobile page-progress line */}
      <div aria-hidden="true" className="kiro-progress-deco fixed inset-x-0 top-0 z-30 h-[3px] md:hidden" style={{ background: 'rgba(32,28,21,.10)' }}>
        <div data-page-progress className="h-full" style={{ background: SEAL, transformOrigin: 'left center', transform: 'scaleX(0)' }} />
      </div>

      <ChapterRail />

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40"
        style={{ background: 'rgba(242,236,221,.92)', backdropFilter: 'blur(10px)', borderBottom: `1px solid ${HAIR}` }}
      >
        <div className="mx-auto flex max-w-[1180px] items-center gap-4 px-5 py-3.5 sm:px-8">
          <a href="#top" className={`flex min-h-11 items-center gap-2.5 ${FOCUS}`} aria-label="Kírópraktorstofan, efst á síðu">
            <svg viewBox="0 0 28 28" width="24" height="24" aria-hidden="true">
              <rect x="12" y="2" width="4" height="6" rx="1.6" fill={SEAL} />
              <rect x="9" y="9.5" width="10" height="5" rx="1.8" fill={SEAL} />
              <rect x="12" y="16" width="4" height="6" rx="1.6" fill={SEAL} opacity="0.6" />
              <path d="M8 24c2-2 4-3 6-3s4 1 6 3" stroke={SEAL} strokeWidth="1.6" fill="none" strokeLinecap="round" />
            </svg>
            <span style={{ fontFamily: DISPLAY, fontSize: '1.1rem', color: INK, whiteSpace: 'nowrap' }}>
              Kírópraktorstofan
            </span>
          </a>
          <nav className="ml-auto hidden items-center gap-6 lg:flex" aria-label="Aðalvalmynd">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={`kiro-navlink inline-flex min-h-11 items-center text-[.94rem] ${FOCUS}`}
                style={{ color: SOFT, fontFamily: BODY }}
              >
                {n.label}
              </a>
            ))}
          </nav>
          <a
            href={PHONE_HREF}
            className={`ml-auto inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 kiro-press ${FOCUS} lg:ml-0`}
            style={{ background: SEAL, color: '#fff', fontFamily: MONO, fontSize: '.86rem', whiteSpace: 'nowrap' }}
          >
            <Phone size={15} aria-hidden="true" /> {PHONE_DISPLAY}
          </a>
          <button
            type="button"
            onClick={() => setMenu((v) => !v)}
            aria-expanded={menu}
            aria-label={menu ? 'Loka valmynd' : 'Opna valmynd'}
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full lg:hidden ${FOCUS}`}
            style={{ border: `1px solid ${HAIR}`, color: INK }}
          >
            {menu ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
        {menu && (
          <div className="border-t lg:hidden" style={{ borderColor: HAIR, background: BONE }}>
            <nav className="mx-auto max-w-[1180px] px-5 py-2 sm:px-8" aria-label="Valmynd">
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setMenu(false)}
                  className={`flex min-h-12 items-center border-b py-3.5 text-[1.02rem] ${FOCUS}`}
                  style={{ borderColor: HAIR, fontFamily: DISPLAY, color: INK }}
                >
                  {n.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main id="top">
        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-[1180px] px-5 pt-14 pb-20 sm:px-8 sm:pt-20 sm:pb-28">
          <div className="flex items-center gap-2.5" style={{ fontFamily: MONO, fontSize: '.78rem', letterSpacing: '.1em', color: status.open ? OPEN_GREEN : MUTE }}>
            <span aria-hidden="true" className="inline-block rounded-full" style={{ width: 8, height: 8, background: status.open ? OPEN_GREEN : MUTE }} />
            <span>{status.text}</span>
          </div>
          <h1
            className="mt-6 max-w-[16ch]"
            style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(2.6rem, 7.2vw, 4.9rem)', letterSpacing: '-.015em', lineHeight: 1.05, color: INK }}
          >
            Kírópraktík á Íslandi byrjaði hér.
          </h1>
          <p className="mt-6 max-w-[46ch]" style={{ fontSize: 'clamp(1.06rem, 2.1vw, 1.28rem)', lineHeight: 1.55, color: SOFT }}>
            Haustið 1977 fékk Tryggvi Jónasson fyrsta opinbera starfsleyfi kírópraktors á Íslandi.
            Hann starfar enn, á Háaleitisbraut 66.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#bokun"
              className={`inline-flex min-h-14 items-center rounded-full px-8 kiro-press ${FOCUS}`}
              style={{ background: SEAL, color: '#fff', fontFamily: DISPLAY, fontSize: '1.08rem' }}
            >
              Bóka tíma
            </a>
            <a
              href={PHONE_HREF}
              className={`inline-flex min-h-14 items-center gap-2 rounded-full px-7 kiro-press ${FOCUS}`}
              style={{ border: `1px solid ${HAIR}`, color: INK, fontFamily: DISPLAY, fontSize: '1.02rem' }}
            >
              <Phone size={17} aria-hidden="true" /> Hringja í {PHONE_DISPLAY}
            </a>
          </div>
        </section>

        {/* ── KAFLI I — 1971 ────────────────────────────────────────────── */}
        <div id="sagan" className="scroll-mt-24" data-chapter-root={0} role="region" aria-label="Kafli 1 af 4: Nemandinn sem fór utan">
          <ChapterCover
            n="01" total={4} word="1971" ground={BONE} textColor={INK} hairColor={MUTE}
            gradient={`radial-gradient(120% 90% at 78% 100%, ${PAPERWHITE}, ${BONE} 62%)`}
          />
          <ChapterHead
            n="01" year="1971" tagline="MR til AECC"
            title="Nemandinn sem fór utan"
            abstract="Tryggvi Jónasson lauk stúdentsprófi frá Menntaskólanum í Reykjavík árið 1971. Sama haust settist hann á skólabekk í Englandi, fyrsti Íslendingurinn í kírópraktíknámi."
            bgWordTop="MR" bgWordBottom="AECC"
            ink={INK} mute={MUTE} hair={HAIR} accent={SEAL}
            plate={
              <TexturePanel ratio="3 / 4">
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(155deg, ${PAPERWHITE}, ${BONE} 70%)` }} />
                <div style={{ position: 'absolute', inset: 18, border: `1px solid ${HAIR}` }} />
              </TexturePanel>
            }
          />
          <Rise className="mx-auto max-w-[1180px] px-5 pb-24 sm:px-8 sm:pb-32">
            <div className="max-w-[52ch] border-t pt-8" style={{ borderColor: HAIR }}>
              <p style={{ color: SOFT, fontSize: '1.06rem', lineHeight: 1.62 }}>
                Hann útskrifaðist sem Doctor of Chiropractic sumarið 1976, eftir fimm ára nám við
                Anglo-European College of Chiropractic í Bournemouth. Að námi loknu starfaði hann
                hálft ár í Danmörku, fyrst hjá Henning Hviid í Árósum og síðan hjá Arne Amtoft
                Nielsen í Køge á Sjálandi.
              </p>
            </div>
          </Rise>
        </div>

        {/* ── KAFLI II — 1977 ───────────────────────────────────────────── */}
        <div data-chapter-root={1} style={{ background: KRAFT }} role="region" aria-label="Kafli 2 af 4: Fyrsti dagurinn á Klapparstíg">
          <ChapterCover
            n="02" total={4} word="1977" ground={KRAFT} textColor={INK} hairColor={MUTE}
            gradient={`radial-gradient(120% 90% at 20% 100%, ${PAPERWHITE}, ${KRAFT} 62%)`}
          />
          <ChapterHead
            n="02" year="1977" tagline="Stofan opnar"
            title="Fyrsti dagurinn á Klapparstíg"
            abstract="Haustið 1977 kom Tryggvi heim til Reykjavíkur og opnaði eigin stofu að Klapparstíg 27. Þar hófst starfsferill sem enn stendur, tæpri hálfri öld síðar."
            bgWordTop="1977" bgWordBottom="KLAPPARSTÍGUR"
            ink={INK} mute={MUTE} hair={HAIR} accent={SEAL}
            plate={
              <Plate src={IMG.stofan1977} alt="Skjalað kyrralíf sem vísar til ársins 1977, þegar stofan opnaði." ratio="3 / 4" ground={PAPERWHITE}>
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, #EFE6D0, ${KRAFT} 68%)` }} />
                <div style={{ position: 'absolute', inset: 18, border: `1px solid rgba(32,28,21,.18)` }} />
                <div style={{ position: 'absolute', left: '50%', top: '50%', width: 64, height: 64, borderRadius: 999, border: `1px solid rgba(32,28,21,.22)`, transform: 'translate(-50%,-50%)' }} />
              </Plate>
            }
          />
          <StoryColumns
            n="02" total={4}
            leftLabel="Þá" leftBody="Klapparstígur 27, fyrsta stofan. Fljótlega eftir opnun fór af stað ferli hjá embætti landlæknis, sem taldi lagaheimild vanta fyrir svo nýja heilbrigðisþjónustu á Íslandi."
            rightLabel="Í dag" rightBody="Stofan er í dag á Háaleitisbraut 66, við Grensáskirkju. Að eigin sögn hafa fleiri en 17.000 manns leitað til Tryggva frá upphafi."
            ink={INK} mute={MUTE} hair={HAIR} accent={SEAL}
          />
        </div>

        {/* ── KAFLI III — LEYFIÐ (the one deliberate dark-ink chapter) ───── */}
        <div data-chapter-root={2} style={{ background: SEALDEEP }} role="region" aria-label="Kafli 3 af 4: Landlæknir, Alþingi, undirskriftin">
          <ChapterCover
            n="03" total={4} word="LEYFIÐ" ground={SEALDEEP} textColor={PAPERWHITE} hairColor={SEAL_MUTE}
            gradient={`radial-gradient(130% 90% at 50% 110%, ${SEAL}, ${SEALDEEP} 68%)`}
          />
          <ChapterHead
            n="03" year="Leyfið" tagline="Landlæknir og Alþingi"
            title="Landlæknir. Alþingi. Undirskriftin."
            abstract="Embætti landlæknis taldi lagaheimild vanta. Þáverandi heilbrigðis- og tryggingamálaráðherra, Matthías Bjarnason, lagði því fyrir Alþingi breytingu á læknalögum: ákvæði um takmarkað lækningaleyfi."
            bgWordTop="LEYFIÐ" bgWordBottom="1977"
            ink={PAPERWHITE} mute={SEAL_SOFT} hair={HAIR_ON_SEAL} accent={BONE}
            plate={
              <Plate src={IMG.leyfid} alt="Skjalað kyrralíf sem vísar til leyfisveitingarinnar." ratio="4 / 3" ground={SEAL}>
                <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(90% 70% at 30% 20%, rgba(242,236,221,.16), transparent 60%), linear-gradient(150deg, ${SEAL}, ${SEALDEEP})` }} />
                <div style={{ position: 'absolute', inset: 22, border: `1px solid rgba(242,236,221,.22)` }} />
                <div style={{ position: 'absolute', left: '58%', top: '46%', width: 76, height: 76, borderRadius: 999, border: `1.5px solid rgba(242,236,221,.32)`, transform: 'translate(-50%,-50%) rotate(-8deg)' }} />
              </Plate>
            }
          />
          <div className="mx-auto max-w-[1180px] px-5 pb-4 sm:px-8">
            <Rise>
              <SpecRow items={LEYFID_FACTS} ink={PAPERWHITE} mute={SEAL_SOFT} hair={HAIR_ON_SEAL} accent={BONE} />
            </Rise>
          </div>
          <UnmaskQuote
            text="Að sögn stofunnar sjálfrar var þetta fyrsta opinbera starfsleyfi kírópraktors sem veitt var á Norðurlöndunum."
            source="Frá kiropraktorstofan.is, ekki óháð staðfesting"
            ink={PAPERWHITE} mute={SEAL_MUTE} accent={BONE}
          />
        </div>

        {/* ── KAFLI IV — Í DAG ─────────────────────────────────────────── */}
        <div id="kiropraktor" className="scroll-mt-24" data-chapter-root={3} role="region" aria-label="Kafli 4 af 4: Áður en hnykkt er">
          <ChapterCover
            n="04" total={4} word="MEÐFERÐIN" ground={BONE} textColor={INK} hairColor={MUTE}
            gradient={`radial-gradient(120% 90% at 78% 100%, ${PAPERWHITE}, ${BONE} 62%)`}
          />
          <ChapterHead
            n="04" year="Í dag" tagline="Meðferðin"
            title="Áður en hnykkt er"
            abstract="Kírópraktík beinist að heilbrigði hryggjarins: byggingu hans, stöðu, hreyfingu og hæfni til að jafna sig. Sérhver gestur fær viðtal og ítarlega skoðun áður en meðferð hefst."
            bgWordTop="SKOÐUN" bgWordBottom="HNYKKING"
            ink={INK} mute={MUTE} hair={HAIR} accent={SEAL}
            plate={
              <Plate src={IMG.hendur} alt="Skjöluð mynd sem vísar til meðferðar á meðferðarbekk." ratio="4 / 5" ground={PAPERWHITE}>
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(115deg, ${PAPERWHITE} 20%, ${BONE} 60%, #EAE0C7 100%)` }} />
                <div style={{ position: 'absolute', inset: 18, border: `1px solid ${HAIR}` }} />
              </Plate>
            }
          />
          <div className="mx-auto max-w-[1180px] px-5 pb-4 sm:px-8">
            <Rise>
              <SpecRow items={EXAM_FACTS} ink={INK} mute={MUTE} hair={HAIR} accent={SEAL} />
            </Rise>
          </div>
          <Rise className="mx-auto max-w-[1180px] px-5 pt-14 pb-24 sm:px-8 sm:pb-32">
            <div className="grid gap-8 border-t pt-10 sm:grid-cols-2" style={{ borderColor: HAIR }}>
              <p style={{ color: SOFT, lineHeight: 1.62, fontSize: '1.02rem' }}>{SPINE_FACT}</p>
              <div className="grid gap-4" style={{ fontFamily: MONO, fontSize: '.86rem', color: MUTE, lineHeight: 1.6 }}>
                <p>{TREATMENT_LENGTH_NOTE}</p>
                <p>{XRAY_NOTE}</p>
              </div>
            </div>
          </Rise>
        </div>

        {/* ── VERÐSKRÁ ─────────────────────────────────────────────────── */}
        <section id="verd" className="scroll-mt-24" style={{ background: KRAFT }} aria-labelledby="verd-h">
          <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 sm:py-28">
            <Rise>
              <H2 id="verd-h">Verðið, ekki falið lengur.</H2>
              <p className="mt-5 max-w-[52ch]" style={{ color: SOFT, fontSize: '1.06rem', lineHeight: 1.6 }}>
                Á núverandi vef er verðskráin þrjá smelli frá forsíðunni. Hér er hún efst, sýnileg og
                nákvæm, tekin beint af taxta stofunnar fyrir árið 2026.
              </p>
            </Rise>
            <Rise delay={1}>
              <ul className="mt-10">
                {PRICES.map((p) => (
                  <li key={p.item} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b py-5" style={{ borderColor: HAIR }}>
                    <span style={{ fontFamily: DISPLAY, fontSize: '1.18rem', color: INK }}>{p.item}</span>
                    <span style={{ fontFamily: MONO, color: SEAL, fontSize: '1.06rem' }}>{p.price}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <p style={{ fontFamily: MONO, fontSize: '.84rem', color: MUTE, lineHeight: 1.6 }}>{PRICE_VALID}</p>
                <p style={{ fontFamily: MONO, fontSize: '.84rem', color: MUTE, lineHeight: 1.6 }}>{PRICE_NOTE}</p>
              </div>
            </Rise>
          </div>
        </section>

        {/* ── STAÐSETNING ──────────────────────────────────────────────── */}
        <section id="stadsetning" className="scroll-mt-24" aria-labelledby="place-h">
          <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 sm:py-28">
            <Rise>
              <H2 id="place-h">Við Grensáskirkju, norðurendann</H2>
              <p className="mt-5 max-w-[52ch]" style={{ color: SOFT, fontSize: '1.06rem', lineHeight: 1.6 }}>{ADDRESS_NOTE}</p>
            </Rise>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <Rise delay={1} as="article">
                <div className="h-full rounded-2xl bg-white p-7 sm:p-8" style={{ border: `1px solid ${HAIR}` }}>
                  <p style={{ fontFamily: MONO, fontSize: '.74rem', color: MUTE, letterSpacing: '.12em' }} className="uppercase">
                    Heimilisfang
                  </p>
                  <h3 className="mt-4" style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', color: INK }}>
                    {ADDRESS_LINE1}
                  </h3>
                  <p className="mt-1" style={{ fontFamily: MONO, color: SOFT }}>{ADDRESS_LINE2}</p>
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className={`kiro-navlink mt-6 inline-flex min-h-11 items-center ${FOCUS}`}
                    style={{ color: SEAL, fontFamily: MONO, fontSize: '.88rem' }}
                  >
                    Opna í kortum
                  </a>
                </div>
              </Rise>
              <Rise delay={2} as="article">
                <div className="h-full rounded-2xl bg-white p-7 sm:p-8" style={{ border: `1px solid ${HAIR}` }}>
                  <p style={{ fontFamily: MONO, fontSize: '.74rem', color: MUTE, letterSpacing: '.12em' }} className="uppercase">
                    Opnunartími
                  </p>
                  <ul className="mt-4 grid gap-3">
                    {HOURS.map((h) => (
                      <li key={h.days}>
                        <p style={{ fontFamily: DISPLAY, fontSize: '1.06rem', color: INK }}>{h.days}</p>
                        <p style={{ fontFamily: MONO, fontSize: '.9rem', color: SOFT }}>{h.span}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Rise>
            </div>
          </div>
        </section>

        {/* ── BÓKUN ────────────────────────────────────────────────────── */}
        <section id="bokun" className="scroll-mt-24" style={{ background: PAPERWHITE }} aria-labelledby="bokun-h">
          <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 sm:py-28">
            <Rise>
              <H2 id="bokun-h">Biðjið um tíma</H2>
              <p className="mt-5 max-w-[52ch]" style={{ color: SOFT, fontSize: '1.06rem', lineHeight: 1.6 }}>
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
                className="mt-10 grid max-w-[640px] gap-5"
              >
                <div className="grid gap-2">
                  <label htmlFor="kiro-name" style={{ fontFamily: MONO, fontSize: '.78rem', color: MUTE }} className="uppercase">
                    Fullt nafn
                  </label>
                  <input
                    id="kiro-name" required value={name} onChange={(e) => setName(e.target.value)}
                    className={`kiro-field min-h-12 rounded-xl px-4 ${FOCUS}`} style={{ fontFamily: BODY, fontSize: '1rem', color: INK }}
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label htmlFor="kiro-phone" style={{ fontFamily: MONO, fontSize: '.78rem', color: MUTE }} className="uppercase">
                      Símanúmer
                    </label>
                    <input
                      id="kiro-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                      className={`kiro-field min-h-12 rounded-xl px-4 ${FOCUS}`} style={{ fontFamily: BODY, fontSize: '1rem', color: INK }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="kiro-email" style={{ fontFamily: MONO, fontSize: '.78rem', color: MUTE }} className="uppercase">
                      Netfang
                    </label>
                    <input
                      id="kiro-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className={`kiro-field min-h-12 rounded-xl px-4 ${FOCUS}`} style={{ fontFamily: BODY, fontSize: '1rem', color: INK }}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="kiro-erindi" style={{ fontFamily: MONO, fontSize: '.78rem', color: MUTE }} className="uppercase">
                    Aðrar upplýsingar sem þú vilt að komi fram
                  </label>
                  <textarea
                    id="kiro-erindi" rows={4} value={erindi} onChange={(e) => setErindi(e.target.value)}
                    className={`kiro-field rounded-xl px-4 py-3 ${FOCUS}`} style={{ fontFamily: BODY, fontSize: '1rem', color: INK, resize: 'vertical' }}
                  />
                </div>
                <p style={{ fontFamily: MONO, fontSize: '.78rem', color: MUTE, lineHeight: 1.6 }}>
                  Beiðnin opnast í tölvupóstforritinu þínu, tilbúin til sendingar, og þú getur yfirfarið
                  hana áður en hún fer af stað.
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    className={`inline-flex min-h-14 items-center gap-2 rounded-full px-8 kiro-press ${FOCUS}`}
                    style={{ background: SEAL, color: '#fff', fontFamily: DISPLAY, fontSize: '1.05rem' }}
                  >
                    <Send size={17} aria-hidden="true" /> Senda beiðni
                  </button>
                  <a
                    href={PHONE_HREF}
                    className={`inline-flex min-h-14 items-center gap-2 rounded-full px-7 kiro-press ${FOCUS}`}
                    style={{ border: `1px solid ${HAIR}`, color: INK, fontFamily: DISPLAY, fontSize: '1rem' }}
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
              <SpineSettle />
              <h2
                id="closer-h"
                className="mx-auto mt-10 max-w-[18ch]"
                style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(2.1rem, 6vw, 3.8rem)', letterSpacing: '-.015em', lineHeight: 1.08, color: INK }}
              >
                Næsta blaðsíðan er bakið þitt.
              </h2>
              <a
                href={PHONE_HREF}
                className={`mt-9 inline-flex min-h-[60px] items-center rounded-full px-9 kiro-press ${FOCUS}`}
                style={{ background: SEAL, color: '#fff', fontFamily: DISPLAY, fontSize: 'clamp(1.1rem, 3vw, 1.4rem)' }}
              >
                {PHONE_DISPLAY}
              </a>
              <p className="mt-8" style={{ fontFamily: MONO, fontSize: '.82rem', color: MUTE, lineHeight: 1.7 }}>
                {PRACTICE_NAME} · {ADDRESS_LINE1}, {ADDRESS_LINE2}
                <br />
                <a href={EMAIL_HREF} className={`kiro-navlink inline-flex min-h-11 items-center ${FOCUS}`} style={{ color: SEAL }}>
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
