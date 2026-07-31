import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  ADVICE, AFTER_CLOSE, ASK_CHIPS, ASK_ENDPOINT, ASK_FACTS, ASK_FALLBACK, EMAIL, EMAIL_HREF,
  HOURS_NOTE, IMG, JSON_LD, KENNITALA, LEGAL_NAME, ONCALL_FROM, ON_THE_WAY, ON_THE_WAY_ART_NOTE, ON_THE_WAY_NOTE,
  PHONE_DISPLAY, PHONE_HREF,
  PLACES, PLACE_NOTE, PRICE_GROUPS, PRICE_NOTES, PRICE_SURCHARGE, SURCHARGE_VALUE, TRAUMA_NOTE, TRIAGE,
  RED_FLAGS, VISIT, AFTERCARE,
  URGENT_INTRO, URGENT_NOW, URGENT_WAIT, WEEK,
} from './data'

gsap.registerPlugin(ScrollTrigger)

const company = getPreviewCompany('tannlaeknavaktin')

/* ── TANNLÆKNAVAKTIN v3 · "LÉTTIRINN" ─────────────────────────────────────
   v2 was bright and honest but read as a template: 83px headlines at 1.02
   leading in a rounded sans, stacked in a centred column of bands.

   Rebuilt on two Awwwards-verified references, both measured off their live
   DOM and CSS rather than described (see [[daylight-headline-device]]):

   · godaylight.com  — media and type share ONE grid cell; a 12px mono
     uppercase eyebrow against a colossal serif; the headline split PER WORD
     and risen on a GSAP stagger. The eyebrow-to-headline size ratio is the
     drama, not the photograph.
   · kononenkogroup.com — the type scale itself: fluid, tight, -.03em, with
     display leading well under 1. And the image-drift mask: an inner wrapper
     translating inside overflow:hidden, so photographs drift in a fixed frame
     instead of moving with the page.

   THE FLUID UNIT IS SCOPED, NOT GLOBAL. Both references set html{font-size}
   to a viewport fraction. This page is one route inside a shared SPA, so doing
   that would resize every other preview in the app ([[no-style-bleed-between-designs]]).
   Everything here scales off --u instead, which lives on this page's root only.

   ICELANDIC: display leading never goes below 1.16 or the acutes on Í and Á
   clip (ledger #23). The reference's own 1.16 is exactly that floor. Words are
   split per WORD, never per character.

   KEPT from v2: every verified fact, brand red #E70104 sampled from their real
   logo, the bracket device, the live clock, the grounded assistant.
   ────────────────────────────────────────────────────────────────────────── */

const RED = '#E70104'
const BRASS = '#7A5F12'
const GREEN = '#3A6B4A'
const BONE = '#F7F2EA'
const SAND = '#EDE4D6'
const INK = '#1C1613'

const SERIF = "'Erode', Georgia, serif"
const SANS = "'Hanken Grotesk', system-ui, sans-serif"
const MONO = "'Space Mono', ui-monospace, monospace"

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#7A5F12] focus-visible:ring-offset-[#F7F2EA]'

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

const pad = (n: number) => String(n).padStart(2, '0')
const hhmm = (h: number) => `${pad(h)}:00`

/* ── clock ────────────────────────────────────────────────────────────── */

interface Status {
  open: boolean; onCall: boolean
  today: (typeof WEEK)[number]
  clock: string; closesAt: string; opensAt: string; opensLabel: string; progress: number
}

function readStatus(d: Date): Status {
  const dow = d.getDay(), h = d.getHours(), m = d.getMinutes()
  const today = WEEK.find((w) => w.day === dow) ?? WEEK[0]
  const dec = h + m / 60
  const open = dec >= today.open && dec < today.close
  const weekend = dow === 0 || dow === 6
  const beforeOpen = dec < today.open
  const next = WEEK.find((w) => w.day === (beforeOpen ? dow : (dow + 1) % 7)) ?? WEEK[0]
  return {
    open,
    onCall: open && (weekend || h >= ONCALL_FROM),
    today,
    clock: `${pad(h)}:${pad(m)}`,
    closesAt: hhmm(today.close),
    opensAt: hhmm(next.open),
    opensLabel: beforeOpen ? 'í dag' : 'á morgun',
    progress: Math.max(0, Math.min(1, (dec - today.open) / (today.close - today.open))),
  }
}

/* ── the motion engine ────────────────────────────────────────────────────
   ONE Lenis loop drives BOTH devices, so the headline rises and the photographs
   drift against the same clock. Running the drift on its own scroll listener
   would let the two desync visibly at speed.

   The drift is the kononenkogroup brief exactly: every getBoundingClientRect
   READ is batched before every style WRITE. Interleaving them forces one
   synchronous layout per element per frame, which at ~10 frames pins the main
   thread hard enough to make the tab stutter. */

function useMotion(ready: boolean) {
  useEffect(() => {
    if (!ready) return
    if (reduced()) {
      document.querySelectorAll<HTMLElement>('.tlv-word').forEach((w) => {
        w.style.transform = 'none'
        w.style.opacity = '1'
      })
      return
    }

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true })
    const frames = Array.from(document.querySelectorAll<HTMLElement>('.tlv-frame-in'))

    const drift = () => {
      const vh = window.innerHeight
      const writes: [HTMLElement, string][] = []
      for (const el of frames) {
        const box = el.parentElement
        if (!box) continue
        const r = box.getBoundingClientRect()
        if (r.bottom < -240 || r.top > vh + 240) continue
        const d = Number(el.dataset.drift || 10)
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
        writes.push([el, `translate3d(0,${(-p * d).toFixed(2)}%,0)`])
      }
      for (const [el, t] of writes) el.style.transform = t
    }

    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>('[data-headline]').forEach((h) => {
        const words = h.querySelectorAll<HTMLElement>('.tlv-word')
        if (!words.length) return
        gsap.fromTo(
          words,
          { yPercent: 118, opacity: 0 },
          {
            yPercent: 0, opacity: 1,
            duration: 1.05, ease: 'expo.out', stagger: 0.055,
            scrollTrigger: { trigger: h, start: 'top 88%', once: true },
          },
        )
      })
    })

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => { lenis.raf(t * 1000); drift() }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    drift()

    const onResize = () => drift()
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('resize', onResize)
      ctx.revert()
      lenis.destroy()
    }
  }, [ready])
}

/* ── primitives ───────────────────────────────────────────────────────── */

/**
 * Split PER WORD, never per character: per-char on Icelandic reads as a gimmick
 * and multiplies the accent risk. The mask box is padded .18em top and pulled
 * back by the same amount, so Í Á Ó Ú Ý keep their accents inside an
 * overflow-hidden line (ledger #71) with layout unchanged.
 *
 * A11Y: the visible split is aria-hidden and the heading carries the correct
 * string in aria-label plus one sr-only copy, because a split headline
 * otherwise reports its accessible name as "Verkurinnhættirí dag" (ledger #36c).
 */
function Headline({
  text, size, className = '', id, measure,
}: { text: string; size: number; className?: string; id?: string; measure?: number }) {
  return (
    <h2
      id={id}
      data-headline
      aria-label={text}
      className={className}
      style={{
        fontFamily: SERIF,
        fontWeight: 400,
        fontSize: `calc(var(--u) * ${size})`,
        lineHeight: 1.16,
        letterSpacing: '-.03em',
        margin: 0,
        // .tlv-line is an inline-block, so a WORD can never break internally.
        // Without balance, a narrow measure strands one word per line and the
        // result reads as broken rather than as a deliberate ragged edge.
        textWrap: 'balance',
        // The measure belongs HERE, in --u units, never as `ch` on a wrapper:
        // `ch` resolves against the element it sits on, so 20ch on a plain div
        // is 20 × Hanken-16px ≈ 160px, not 20 characters of Erode at 92u. Every
        // headline was being squeezed into a ~160px column by exactly that.
        maxWidth: measure ? `calc(var(--u) * ${measure})` : undefined,
      } as React.CSSProperties}
    >
      {/* No sr-only twin: aria-label already names the heading, and a second
          copy doubles textContent to "Verkurinn hættir í dag.Verkurinn hættir
          í dag." for crawlers (ledger #36c). The split below carries correctly
          spaced text on its own because the space is a sibling of the clipped
          box, not a child of it. */}
      {text.split(' ').map((w, i, arr) => (
        <span key={i}>
          <span className="tlv-line">
            <span className="tlv-word">{w}</span>
          </span>
          {i < arr.length - 1 ? ' ' : ''}
        </span>
      ))}
    </h2>
  )
}

function Eyebrow({ n, children }: { n?: string; children: React.ReactNode }) {
  return (
    <p
      className="uppercase"
      style={{
        fontFamily: MONO, fontSize: 12, lineHeight: 1.5,
        letterSpacing: '.14em', color: 'rgba(42,33,28,.52)', margin: 0,
      }}
    >
      {n && <span style={{ color: BRASS }}>[{n}]&nbsp;&nbsp;</span>}
      {children}
    </p>
  )
}

/**
 * A photograph that drifts inside a fixed frame. The image moves, the frame
 * never does, so the picture is masked by its own box rather than scrolling
 * with the page (the kononenkogroup mechanism: no WebGL, no canvas, a real
 * <img> that stays visible and crawlable throughout).
 *
 * Drift, per the measured spec: 6 for a contained hero, 9 for cards, 12 to 13
 * for a full-bleed band. The overscan is computed from the drift here rather
 * than being a fixed number in the stylesheet, because the two must move
 * together: too little inset for the drift and the image edge slides into
 * frame at the extremes of the travel.
 */
function Frame({
  src, alt, ratio, drift = 10, priority = false, className = '',
}: { src: string; alt: string; ratio: string; drift?: number; priority?: boolean; className?: string }) {
  return (
    <div className={`tlv-frame ${className}`} style={{ aspectRatio: ratio }}>
      <div className="tlv-frame-in" data-drift={drift}
        style={{ '--dz': `${Math.max(9, drift * 1.35)}%` } as React.CSSProperties}>
        <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async" />
      </div>
    </div>
  )
}

/**
 * A painted instruction band. 16:9, media edge to edge, caption set into the
 * dark negative space the painting was composed to leave empty on the left.
 *
 * The paintings are generated, and deliberately depict a PORCELAIN STUDY MODEL
 * rather than anyone's real tooth: it keeps the grip unambiguous (fingers on
 * the crown, root untouched) and it is what the footer discloses.
 *
 * No drift here on purpose. .tlv-frame-in crops ~9% off each edge, which would
 * eat the hand, and drift stacked on a clip that already moves reads as noise.
 */
function PaintBand({
  src, poster, alt, step, line, note,
}: { src: string; poster?: string; alt: string; step: string; line: string; note: string }) {
  const [still, setStill] = useState(true)
  const isVideo = src.endsWith('.mp4')

  useEffect(() => { setStill(reduced()) }, [])

  return (
    <figure className="tlv-band" style={{ margin: 0, background: INK }}>
      <div className="tlv-band-media">
        {isVideo && !still ? (
          <video
            src={src} poster={poster} aria-label={alt}
            autoPlay muted loop playsInline preload="metadata"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <img
            src={isVideo ? (poster as string) : src} alt={alt}
            loading="lazy" decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}
      </div>

      <figcaption className="flex items-end p-6 sm:p-10" style={{ pointerEvents: 'none' }}>
        <div style={{ maxWidth: 'calc(var(--u) * 420)' }}>
          <p className="uppercase" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.16em', color: '#C9A227' }}>
            {step}
          </p>
          <p className="mt-3" style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'calc(var(--u) * 40)', lineHeight: 1.16, letterSpacing: '-.02em', color: '#FFF7E9' }}>
            {line}
          </p>
          <p className="mt-3 uppercase" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.14em', color: 'rgba(255,247,233,.62)' }}>
            {note}
          </p>
        </div>
      </figcaption>
    </figure>
  )
}

function Mark({ size = 28, color = RED }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 132 132" width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
      <path d="M34 10H12v112h22" fill="none" stroke={color} strokeWidth="13" strokeLinecap="square" />
      <path d="M98 10h22v112H98" fill="none" stroke={color} strokeWidth="13" strokeLinecap="square" />
      <path d="M66 18c-19 0-30 12-30 32 0 19 6 34 10 54 2 11 12 13 14 2l5-29c1-6 8-6 9 0l5 29c2 11 12 9 14-2 4-20 10-35 10-54 0-20-11-32-30-32Z" fill={color} />
      <path d="M59 44h6v-6h6v6h6v6h-6v6h-6v-6h-6z" fill="#fff" transform="rotate(45 66 50)" />
    </svg>
  )
}


/**
 * The one number on this page worth animating: the call-out surcharge nobody
 * phoning at 21:00 knows about.
 *
 * Formatted BY HAND. Intl.NumberFormat('is-IS') returns "45,590" in this
 * Chrome's ICU and Icelandic wants "45.590" (ledger #27a), so no locale API
 * goes anywhere near a price. This is also why NumberFlow was not adopted from
 * 21st.dev: its entire value is the Intl integration we cannot use.
 */
function isk(n: number): string {
  return `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} kr.`
}

function RollingPrice({ value, className, style }: {
  value: number; className?: string; style?: React.CSSProperties
}) {
  const ref = useRef<HTMLSpanElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced()) { el.textContent = isk(value); return }
    const box = { n: 0 }
    const tw = gsap.to(box, {
      n: value, duration: 1.5, ease: 'power3.out',
      onUpdate: () => { el.textContent = isk(box.n) },
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    })
    return () => { tw.scrollTrigger?.kill(); tw.kill() }
  }, [value])
  // the final string is in the DOM from the start so it is never blank, never
  // unreadable to a crawler, and correct if JS never runs
  return <span ref={ref} className={className} style={style}>{isk(value)}</span>
}

/* ── the spine ────────────────────────────────────────────────────────────
   The numbered index from the reference, but made of THEIR bracket. It doubles
   as navigation and as the assistant's home, which is why there is no floating
   corner bubble: a page whose whole device is [ ] should not also wear the
   same chat circle as every SaaS site on earth. */

const SPINE = [
  { n: '00', label: 'Núna', href: '#top' },
  { n: '01', label: 'Bráðatilvik', href: '#bradatilvik' },
  { n: '02', label: 'Á leiðinni', href: '#aleidinni' },
  { n: '03', label: 'Neyð', href: '#neyd' },
  { n: '04', label: 'Á vaktinni', href: '#vaktin' },
  { n: '05', label: 'Verðskrá', href: '#verd' },
  { n: '06', label: 'Opnunartími', href: '#opnunartimi' },
  { n: '07', label: 'Staðsetning', href: '#stadsetning' },
  { n: '09', label: 'Spyrja', href: '#spyrja' },
]

/* ═══════════════════════════════════════════════════════════════════════ */

export default function TannlaeknavaktinPage() {
  const [status, setStatus] = useState<Status>(() => readStatus(new Date()))
  const [ready, setReady] = useState(false)
  const [menu, setMenu] = useState(false)
  /**
   * The header rides ON the hero painting with no ground of its own, and only
   * takes a solid ivory ground once you scroll. Because the hero is now dark,
   * its contents have to invert too: cream over the painting, umber once the
   * ivory arrives. Fires at 24px so the bar is never half-legible over
   * passing content. The menu forces it solid, since a dropdown over a
   * painting is unreadable.
   */
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const headerSolid = scrolled || menu
  /* The hero went light again, so the header never inverts: umber on both. */

  useMotion(ready)

  useEffect(() => {
    setThemeColor(BONE)
    const t = window.setInterval(() => setStatus(readStatus(new Date())), 30000)
    // wait for the webfont before splitting, or line boxes measure wrong
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
    if (fonts?.ready) fonts.ready.then(() => setReady(true))
    else setReady(true)
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

  return (
    <div style={{ background: BONE, color: INK, fontFamily: SANS, minHeight: '100vh' }}>
      <style>{`
        /* THE FLUID UNIT, scoped to this page. 1u = 1px at 1440, clamped so it
           never collapses on a phone or runs away on a 5K display. Both
           references put this on html; here it would bleed into every other
           preview in the app, so it lives on the page root instead. */
        .tlv-root { --u: clamp(.44px, calc(100vw / 1440), 1.12px); }

        .tlv-line { display: inline-block; overflow: hidden;
                    padding-top: .18em; margin-top: -.18em; vertical-align: bottom; }
        .tlv-word { display: inline-block; will-change: transform; }

        /* the drift frame — kononenkogroup's device. The negative inset IS the
           headroom the drift travels through; keep it ≳ drift × 1.2 / 100. */
        .tlv-frame    { position: relative; overflow: hidden; width: 100%; background: ${SAND}; }
        /* Inset is DERIVED from the drift, never hardcoded. The kononenko spec
           requires inset >= drift x 1.2, and a fixed -9% silently breaks the
           moment a frame is given a full-bleed drift of 12-13: the image runs
           out of overscan and its edge slides into view. --dz is set per frame
           by <Frame> from its own drift value, so the constraint cannot be
           violated by changing a number in the JSX. */
        .tlv-frame-in { position: absolute; inset: calc(var(--dz, 9%) * -1) 0; will-change: transform; }
        .tlv-frame-in img { width: 100%; height: 100%; max-width: none;
                            object-fit: cover; display: block; }

        /* media and type share ONE grid cell, so text sits over the photograph
           with no absolute positioning and no z-index fight */
        .tlv-bleed { display: grid; }
        /* position:relative on EVERY cell child is load-bearing, not tidiness.
           .tlv-frame-in is position:absolute, and a positioned element paints
           above a static one regardless of DOM order — so the photograph was
           covering the hero's eyebrow, paragraph and buttons. The only things
           that survived were the ones that happened to be positioned or
           composited: the fixed spine, the relative rail, and the headline
           words (will-change:transform makes its own layer). */
        .tlv-bleed > * { grid-column: 1; grid-row: 1; position: relative; }

        /* Receptionist. Keyframes are prefixed tlv- so they cannot collide with
           the other previews sharing this SPA. */
        .tlv-ask-input::placeholder { color: rgba(255,247,233,.3); }
        /* The chips sit ON the ink slab now, so the hover tint has to be light.
           A dark tint here was invisible against #1C1613. */
        .tlv-chip { transition: background .18s ease, padding-left .18s ease; padding-left: 0; }
        .tlv-chip:hover { background: rgba(255,247,233,.055); padding-left: 10px; }
        .tlv-ask-line { transition: border-color .22s ease; }
        .tlv-ask-line:focus-within { border-color: rgba(255,155,142,.9) !important; }
        /* Replaces the three bouncing dots. A single hairline sweeping once
           through its own width reads as considered rather than as the stock
           "AI is typing" tell every chat widget ships. */
        @keyframes tlv-sweep { 0% { transform: translateX(-100%) } 100% { transform: translateX(320%) } }
        .tlv-sweep { position: relative; overflow: hidden; height: 1px;
                     background: rgba(255,247,233,.14); }
        .tlv-sweep::after { content: ''; position: absolute; inset-block: 0; left: 0;
                            width: 30%; background: #C9A227;
                            animation: tlv-sweep 1.25s cubic-bezier(.4,0,.2,1) infinite; }
        /* Light-ground twin, for the floating panel's ivory interior. */
        .tlv-sweep-lt { background: rgba(42,33,28,.13); }
        .tlv-sweep-lt::after { background: #7A5F12; }
        .tlv-ask-input-lt::placeholder { color: rgba(42,33,28,.36); }
        .tlv-follow { transition: background .18s ease, border-color .18s ease; }
        .tlv-follow:hover { background: rgba(42,33,28,.05); border-color: rgba(42,33,28,.34) !important; }

        /* Header menu. It was popping in with no transition at all. Animating
           grid-template-rows 0fr→1fr collapses to the content's real height
           without hard-coding a max-height that clips or overshoots. */
        /* Border lives here, NOT in an inline style: an inline transition
           property replaces the whole shorthand and silently kills the
           grid-rows and opacity transitions declared on this class.
           (No backticks in this block — it is inside a template literal.) */
        .tlv-menu { display: grid; grid-template-rows: 0fr; opacity: 0;
          border-top: 1px solid transparent;
          transition: grid-template-rows .42s cubic-bezier(.16,1,.3,1), opacity .3s ease, border-color .3s ease; }
        .tlv-menu[data-open="true"] { grid-template-rows: 1fr; opacity: 1; border-top-color: rgba(42,33,28,.1); }
        .tlv-menu > div { overflow: hidden; min-height: 0; }
        .tlv-menu a { opacity: 0; transform: translateY(-6px);
          transition: opacity .32s ease, transform .32s cubic-bezier(.16,1,.3,1); }
        .tlv-menu[data-open="true"] a { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) {
          .tlv-menu, .tlv-menu a, .tlv-follow { transition: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tlv-sweep::after { animation: none; width: 100%; opacity: .5; }
          .tlv-chip, .tlv-ask-line { transition: none; }
          .tlv-chip:hover { padding-left: 0; }
        }

        /* Instruction band. The paintings leave their negative space on the
           LEFT, which only exists once the band is wide enough. Below md the
           band is too small for that, so the caption stacks under the picture
           instead of sitting on the hand. */
        .tlv-band { display: grid; }
        .tlv-band > * { position: relative; }
        .tlv-band-media { aspect-ratio: 4 / 3; overflow: hidden; }
        @media (min-width: 768px) {
          .tlv-band > * { grid-column: 1; grid-row: 1; }
          .tlv-band-media { aspect-ratio: 16 / 9; }
        }

        /* Floating assistant. Every shadow here is tinted with the text brown
           rather than neutral grey — a grey shadow over warm ivory reads as
           dirt on the paper. The easing is the same expo-out curve the
           headlines rise on, so the panel belongs to the page's motion. */
        @keyframes tlv-panel-in { from { opacity: 0; transform: scale(.94) translateY(14px) } to { opacity: 1; transform: none } }
        @keyframes tlv-msg-in { from { opacity: 0; transform: translateY(9px) } to { opacity: 1; transform: none } }
        @keyframes tlv-ring { from { opacity: .34; transform: scale(1) } to { opacity: 0; transform: scale(2.1) } }
        .tlv-panel { animation: tlv-panel-in .42s cubic-bezier(.16,1,.3,1) both; transform-origin: 100% 100%; }
        .tlv-msg { animation: tlv-msg-in .5s cubic-bezier(.16,1,.3,1) both; }
        .tlv-launch { transition: transform .32s cubic-bezier(.16,1,.3,1), box-shadow .32s ease; }
        .tlv-launch:hover { transform: translateY(-2px); }
        /* The label unfurls from the mark instead of the whole button
           resizing, so the tooth never shifts under the cursor. */
        .tlv-launch-label { max-width: 0; opacity: 0; overflow: hidden; white-space: nowrap;
          transition: max-width .4s cubic-bezier(.16,1,.3,1), opacity .26s ease, margin-left .4s cubic-bezier(.16,1,.3,1); }
        .tlv-launch:hover .tlv-launch-label,
        .tlv-launch:focus-visible .tlv-launch-label { max-width: 190px; opacity: 1; margin-left: 11px; }
        /* Twice, then never again. A permanently pulsing badge is a nag. */
        .tlv-ring { animation: tlv-ring 2.1s ease-out 1.5s 2 both; }
        @media (prefers-reduced-motion: reduce) {
          .tlv-panel, .tlv-msg, .tlv-ring { animation: none; }
          .tlv-launch, .tlv-launch-label { transition: none; }
          .tlv-launch-label { max-width: 190px; opacity: 1; margin-left: 11px; }
        }

        .tlv-link { position: relative; }
        .tlv-link::after { content:''; position:absolute; left:0; right:0; bottom:-3px; height:1px;
          background: currentColor; transform: scaleX(0); transform-origin: left;
          transition: transform .34s cubic-bezier(.22,.61,.36,1); }
        .tlv-link:hover::after, .tlv-link:focus-visible::after { transform: scaleX(1); }

        .tlv-row { transition: background-color .25s ease; }
        .tlv-row:hover { background: rgba(42,33,28,.035); }

        /* CTAs. The fill sweeps in from the left rather than the whole button
           flipping colour, and the label holds still while it happens.
           ::before is the sweep, z-index keeps the text above it. */
        .tlv-cta { position: relative; display: inline-flex; align-items: center; gap: 10px;
          border-radius: 999px; padding: 15px 30px; min-height: 56px; overflow: hidden;
          text-decoration: none; border: 1px solid transparent; isolation: isolate;
          transition: transform .34s cubic-bezier(.16,1,.3,1), box-shadow .34s ease, border-color .34s ease, color .34s ease; }
        .tlv-cta > * { position: relative; z-index: 1; }
        .tlv-cta::before { content: ''; position: absolute; inset: 0; z-index: 0;
          transform: scaleX(0); transform-origin: left center;
          transition: transform .46s cubic-bezier(.16,1,.3,1); }
        .tlv-cta:hover::before, .tlv-cta:focus-visible::before { transform: scaleX(1); }
        .tlv-cta:active { transform: translateY(1px) scale(.99); }

        /* Default fills to UMBER, because most of these sit on ivory where a
           cream fill would all but disappear. */
        .tlv-cta-solid { background: #E70104; color: #fff;
          box-shadow: 0 1px 2px rgba(42,33,28,.12), 0 6px 18px rgba(231,1,4,.20); }
        .tlv-cta-solid::before { background: #1C1613; }
        .tlv-cta-solid:hover { color: #FFF7E9; transform: translateY(-2px);
          box-shadow: 0 3px 8px rgba(42,33,28,.16), 0 14px 34px rgba(42,33,28,.26); }
        /* On the night hero the ground is already dark, so it fills to cream
           instead. Same button, opposite surface. */
        .tlv-on-dark.tlv-cta-solid { box-shadow: 0 2px 6px rgba(0,0,0,.28), 0 10px 28px rgba(231,1,4,.22); }
        .tlv-on-dark.tlv-cta-solid::before { background: #FFF7E9; }
        .tlv-on-dark.tlv-cta-solid:hover { color: #1C1613;
          box-shadow: 0 4px 12px rgba(0,0,0,.34), 0 18px 40px rgba(0,0,0,.3); }

        /* Ghost on the dark hero: cream outline that fills to cream. */
        .tlv-cta-ghost { background: transparent; color: #2A211C; border-color: rgba(42,33,28,.24); }
        .tlv-cta-ghost::before { background: #1C1613; }
        .tlv-cta-ghost:hover { color: #FFF7E9; border-color: #1C1613; transform: translateY(-2px); }
        .tlv-cta-ghost-dark { background: transparent; color: #FFF7E9;
          border-color: rgba(255,247,233,.34); }
        .tlv-cta-ghost-dark::before { background: #FFF7E9; }
        .tlv-cta-ghost-dark:hover { color: #1C1613; border-color: #FFF7E9; transform: translateY(-2px); }

        @media (prefers-reduced-motion: reduce) {
          .tlv-cta, .tlv-cta::before { transition: none; }
          .tlv-cta:hover { transform: none; }
        }

        /* Live dot on the hero status line. Only runs while genuinely open, so
           the motion carries meaning. Green lifted to #7FBF95 for the dark
           ground, where the page's #3A6B4A would disappear. */
        @keyframes tlv-dot-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(58,107,74,.5) }
          70%      { box-shadow: 0 0 0 8px rgba(58,107,74,0) }
        }
        .tlv-pulse-dot { animation: tlv-dot-glow 2.6s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) { .tlv-pulse-dot { animation: none } }

        /* Live dot on the hero status plate. Only ever runs while the clinic
           is actually open, so the motion means something. GREEN is #3A6B4A. */
        @keyframes tlv-dot-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(58,107,74,.5) }
          70%      { box-shadow: 0 0 0 8px rgba(58,107,74,0) }
        }
        .tlv-pulse-dot { animation: tlv-dot-glow 2.6s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) { .tlv-pulse-dot { animation: none } }

        /* Header call pill and hairline burger. The burger's bars are animated
           from the class, never inline, so an inline transition cannot clobber
           the shorthand (ledger #81). */
        .tlv-call { box-shadow: 0 1px 2px rgba(42,33,28,.10);
          transition: transform .28s cubic-bezier(.16,1,.3,1), box-shadow .28s ease; }
        .tlv-call:hover { transform: translateY(-1px); box-shadow: 0 5px 16px rgba(42,33,28,.20); }
        .tlv-burger span > span { transition: top .3s cubic-bezier(.16,1,.3,1),
          bottom .3s cubic-bezier(.16,1,.3,1), transform .3s cubic-bezier(.16,1,.3,1), width .3s ease; }
        .tlv-burger:hover span > span { width: 100%; }
        @media (prefers-reduced-motion: reduce) {
          .tlv-call, .tlv-burger span > span { transition: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .tlv-frame-in { inset: 0; will-change: auto; transform: none !important; }
          .tlv-word { transform: none !important; opacity: 1 !important; }
        }
      `}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />

      <div className="tlv-root">
        {/* ── NAV ─────────────────────────────────────────────────────── */}
        {/* Rebuilt: the saturated red pill and the filled black puck were two
            heavy blobs sitting next to each other. Now one dark call pill
            carrying a live status dot, and the menu reduced to bare hairlines
            with no container at all. Lighter ground, thinner rule, more air. */}
        {/* FIXED, not sticky: a sticky header keeps its layout space even when
            it has no ground, which pushed the hero down and left a strip
            across the top. Fixed takes no space, so the painting starts at the
            very top edge and the bar rides on it. */}
        <header className="fixed inset-x-0 top-0 z-40"
          style={{
            background: headerSolid ? 'rgba(247,242,234,.82)' : 'transparent',
            backdropFilter: headerSolid ? 'blur(14px) saturate(1.4)' : 'none',
            WebkitBackdropFilter: headerSolid ? 'blur(14px) saturate(1.4)' : 'none',
            borderBottom: `1px solid ${headerSolid ? 'rgba(42,33,28,.07)' : 'transparent'}`,
            transition: 'background .38s ease, border-color .38s ease',
          }}>
          {/* Wash extends 190px, well past the bar's own 70px. Fading inside
              the bar's height ends on a visible line across the painting. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0"
            style={{
              height: 190,
              background: 'linear-gradient(to bottom, rgba(247,242,234,.62) 0%, rgba(247,242,234,.30) 38%, rgba(247,242,234,0) 100%)',
              opacity: headerSolid ? 0 : 1,
              transition: 'opacity .38s ease',
            }} />
          <div className="relative mx-auto flex max-w-[1240px] items-center gap-4 px-5 py-3 sm:px-8">
            <a href="#top" className={`flex items-center gap-2.5 ${FOCUS}`} style={{ minHeight: 44 }} aria-label="Tannlæknavaktin">
              <Mark size={22} />
              <span className="text-[.92rem] sm:text-[1rem]" style={{ fontFamily: SERIF, fontWeight: 500, letterSpacing: '-.02em', whiteSpace: 'nowrap', color: INK }}>
                tannlæknavaktin
              </span>
            </a>

            {/* One auto margin on the GROUP, not on each child — two competing
                auto margins would split the free space and strand the status
                label in the middle of the bar. */}
            <div className="ml-auto flex shrink-0 items-center gap-4">
            {/* Status reads at a glance without competing with the call. */}
            <span className="hidden items-center gap-2 sm:inline-flex" style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.15em', color: 'rgba(42,33,28,.5)' }}>
              <span aria-hidden="true" className="inline-block rounded-full" style={{ width: 6, height: 6, background: status.open ? GREEN : 'rgba(42,33,28,.32)' }} />
              {status.open ? 'OPIÐ NÚNA' : 'LOKAÐ'}
            </span>

            <a
              href={PHONE_HREF}
              className={`tlv-call inline-flex shrink-0 items-center gap-2.5 rounded-full px-4 sm:px-5 ${FOCUS}`}
              style={{
                background: INK, color: '#FFF7E9',
                fontFamily: SANS, fontWeight: 600, fontSize: 15, letterSpacing: '-.01em',
                minHeight: 42, whiteSpace: 'nowrap',
                transition: 'background .38s ease, color .38s ease',
              }}
              aria-label={`Hringja í ${PHONE_DISPLAY}`}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" style={{ display: 'block' }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
                  fill="none" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {PHONE_DISPLAY}
            </a>

            {/* No puck, no border: two hairlines that cross. The 44px hit area
                stays, it is just not drawn. */}
            <button
              type="button" onClick={() => setMenu((v) => !v)} aria-expanded={menu}
              aria-label={menu ? 'Loka valmynd' : 'Opna valmynd'}
              className={`tlv-burger -mr-2 grid h-11 w-11 shrink-0 place-items-center rounded-full 2xl:hidden ${FOCUS}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <span className="relative block h-[11px] w-[20px]" aria-hidden="true">
                <span className="absolute left-0 block" style={{ height: 1.5, width: '100%', background: INK, borderRadius: 2, top: menu ? 4.75 : 0, transform: menu ? 'rotate(45deg)' : 'none' }} />
                <span className="absolute left-0 block" style={{ height: 1.5, width: menu ? '100%' : '72%', background: INK, borderRadius: 2, bottom: menu ? 4.75 : 0, transform: menu ? 'rotate(-45deg)' : 'none' }} />
              </span>
            </button>
            </div>
          </div>
          {/* Always rendered so it can animate; a conditional mount has no
              closing state to transition from. Links leave the tab order and
              the a11y tree while collapsed. */}
          <div className="tlv-menu 2xl:hidden" data-open={menu} aria-hidden={!menu}
            style={{ background: BONE }}>
            <div>
              <nav className="mx-auto max-w-[1240px] px-5 py-2 sm:px-8" aria-label="Valmynd">
                {SPINE.map((s, i) => (
                  <a key={s.href} href={s.href} onClick={() => setMenu(false)} tabIndex={menu ? 0 : -1}
                    className={`flex items-baseline gap-4 border-b py-3.5 ${FOCUS}`}
                    style={{ borderColor: 'rgba(42,33,28,.1)', minHeight: 48, transitionDelay: menu ? `${0.05 + i * 0.035}s` : '0s' }}>
                    <span style={{ fontFamily: MONO, fontSize: 12, color: BRASS }}>[{s.n}]</span>
                    <span style={{ fontFamily: SERIF, fontSize: '1.25rem' }}>{s.label}</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </header>

        {/* The spine. It is FIXED at left:24 and its widest item runs to ~149,
            while the 1240 container puts content at (vw-1240)/2 + 32. Those
            only clear each other from 1474px up, so the breakpoint is 2xl
            (1536), NOT xl (1280) — at xl the labels printed straight over the
            headline. The hamburger hides at the same breakpoint so there is
            never a width with no navigation at all. */}
        <nav aria-label="Efnisyfirlit" className="pointer-events-none fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 2xl:block">
          <ul className="pointer-events-auto grid gap-3">
            {SPINE.map((s) => (
              <li key={s.href}>
                <a href={s.href} className={`tlv-link inline-flex items-baseline gap-2 ${FOCUS}`}
                  style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.1em', color: 'rgba(42,33,28,.5)' }}>
                  <span style={{ color: BRASS }}>[{s.n}]</span>
                  <span className="uppercase">{s.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main id="top">
          {/* ── 00 · HERO ────────────────────────────────────────────────
              The stock relief portrait said only "calm". This says what the
              business IS: the one lit window on a street where everything else
              is shut. Painted in the same hand as the first-aid plates, so the
              page has one illustrator rather than a stock library.

              Full viewport, no header ground on top of it, and the type lives
              in the left two thirds where the paint is deliberately empty
              (measured 14.9:1 average contrast for cream over that region). */}
          <section className="tlv-hero tlv-bleed" style={{ minHeight: '100svh' }}>
            {/* drift 12, not 6. Six is the spec's value for a CONTAINED hero;
                this is a full-bleed band running the whole viewport, which the
                spec puts at 12 to 13. Overscan is derived from it in <Frame>. */}
            <Frame src={IMG.heroRelief} alt="Máluð mynd af hendi sem heldur um heitan bolla." ratio="auto" drift={12} priority className="h-full" />

            {/* The painting is already pale, so this is not for contrast (umber
                measures 14.9:1 over the type region). It exists to resolve the
                hero into the exact page ground so there is no seam at the
                bottom edge. */}
            <div aria-hidden="true" style={{
              background: `linear-gradient(to top, ${BONE} 0%, rgba(247,242,234,.82) 14%, rgba(247,242,234,.34) 40%, rgba(247,242,234,0) 70%)`,
            }} />

            <div className="mx-auto flex w-full max-w-[1240px] flex-col justify-end px-5 pb-16 sm:px-8 sm:pb-20">
              <p className="uppercase" style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '.15em', color: 'rgba(42,33,28,.6)' }}>
                Bráðaþjónusta vegna tannlækninga í Reykjavík
              </p>
              <h1 className="mt-6" style={{ margin: 0, color: INK }}>
                <Headline text="Verkurinn hættir í dag." size={116} measure={880} />
              </h1>

              {/* One typographic line, not a card. The bar only exists while
                  open, so it can never imply a position outside opening hours
                  (progress clamps to 1 when shut). */}
              <div className="mt-9 max-w-[540px]">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="inline-flex items-center gap-2.5">
                    <span aria-hidden="true" className={`inline-block shrink-0 rounded-full ${status.open ? 'tlv-pulse-dot' : ''}`}
                      style={{ width: 8, height: 8, background: status.open ? GREEN : 'rgba(42,33,28,.36)' }} />
                    <span className="uppercase" style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: '.16em', color: status.open ? GREEN : 'rgba(42,33,28,.55)' }}>
                      {status.open ? (status.onCall ? 'Opið · bakvakt' : 'Opið núna') : 'Lokað núna'}
                    </span>
                  </span>
                  <span style={{ fontFamily: SERIF, fontSize: 'clamp(17px, calc(var(--u) * 22), 26px)', color: INK, letterSpacing: '-.01em' }}>
                    {status.open ? <>Lokum {status.closesAt}</> : <>Opnum {status.opensAt} {status.opensLabel}</>}
                  </span>
                  <span className="ml-auto" style={{ fontFamily: MONO, fontSize: 11.5, color: 'rgba(42,33,28,.45)', fontVariantNumeric: 'tabular-nums' }}>
                    {status.clock}
                  </span>
                </div>

                {status.open && (
                  <div className="relative mt-4 h-px w-full" aria-hidden="true" style={{ background: 'rgba(42,33,28,.2)' }}>
                    <span className="absolute left-0 top-0 h-px" style={{ width: `${status.progress * 100}%`, background: 'rgba(58,107,74,.6)', transition: 'width 1s linear' }} />
                    <span className="absolute top-1/2 rounded-full"
                      style={{ left: `${status.progress * 100}%`, width: 7, height: 7, background: GREEN, transform: 'translate(-50%,-50%)', transition: 'left 1s linear' }} />
                  </div>
                )}

                {!status.open && (
                  <p className="mt-3" style={{ fontFamily: MONO, fontSize: 12, color: 'rgba(255,247,233,.55)', lineHeight: 1.6 }}>
                    Í neyðartilvikum er bent á að hafa samband við 112.
                  </p>
                )}
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a href={PHONE_HREF} className={`tlv-cta tlv-cta-solid ${FOCUS}`}
                  style={{ fontFamily: SANS, fontWeight: 600, fontSize: 'clamp(16px, calc(var(--u) * 18), 20px)' }}>
                  <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" style={{ display: 'block' }}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
                      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Hringja í {PHONE_DISPLAY}</span>
                </a>
                <button type="button" onClick={() => askOpen()}
                  className={`tlv-cta tlv-cta-ghost ${FOCUS}`}
                  style={{ fontFamily: SANS, fontWeight: 500, fontSize: 'clamp(15px, calc(var(--u) * 17), 19px)', cursor: 'pointer' }}>
                  <span>Spyrja vaktina</span>
                </button>
              </div>
            </div>
          </section>

          {/* ── 01 · IS THIS AN EMERGENCY ────────────────────────────────
              Was THREE sections — a triage table, a full-bleed "Hvenær á að
              hringja strax" band, and an orphan list — all answering the same
              question with the same words. One section now: what counts, what
              can wait, and which of the three channels to use. */}
          <section id="bradatilvik" className="scroll-mt-16" aria-labelledby="urgent-h">
            <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32">
              {/* Eyebrow deliberately does NOT repeat the headline's word —
                  saying "Bráðatilvik" twice in 20px of each other is exactly
                  the repetition that made the page feel padded. */}
              <Eyebrow n="01">Fyrsta matið</Eyebrow>
              <Headline id="urgent-h" className="mt-6" text="Er þetta bráðatilvik?" size={104} measure={820} />
              <p className="mt-7 max-w-[56ch]" style={{ color: 'rgba(42,33,28,.72)', fontSize: 'calc(var(--u) * 19)', lineHeight: 1.55 }}>
                {URGENT_INTRO}
              </p>

              <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-16">
                <div>
                  <h3 className="uppercase" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.16em', color: BRASS }}>Hringdu strax</h3>
                  <ul className="mt-5">
                    {URGENT_NOW.map((u) => (
                      <li key={u} className="flex items-baseline gap-3 border-b py-3.5" style={{ borderColor: 'rgba(42,33,28,.12)', fontSize: 'calc(var(--u) * 18)' }}>
                        <span aria-hidden="true" style={{ color: BRASS, fontFamily: MONO, fontSize: 11 }}>◆</span>{u}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="uppercase" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.16em', color: 'rgba(42,33,28,.45)' }}>Má oftast bíða</h3>
                  <p className="mt-5" style={{ color: 'rgba(42,33,28,.72)', lineHeight: 1.62, fontSize: 'calc(var(--u) * 18)' }}>{URGENT_WAIT}</p>
                  <p className="mt-4 max-w-[46ch]" style={{ color: 'rgba(42,33,28,.72)', lineHeight: 1.62, fontSize: 'calc(var(--u) * 18)' }}>{TRAUMA_NOTE}</p>
                </div>
              </div>

              <div className="mt-16 grid gap-px" style={{ background: 'rgba(42,33,28,.14)' }}>
                {TRIAGE.map((t) => (
                  <div key={t.title} className="tlv-row grid gap-5 p-7 sm:p-9 md:grid-cols-[140px_1fr_auto] md:items-center" style={{ background: BONE }}>
                    <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.12em', color: t.primary ? BRASS : 'rgba(42,33,28,.5)' }} className="uppercase">{t.tag}</span>
                    <div>
                      <h3 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'calc(var(--u) * 30)', lineHeight: 1.16, letterSpacing: '-.02em' }}>{t.title}</h3>
                      <p className="mt-2 max-w-[52ch]" style={{ color: 'rgba(42,33,28,.7)', lineHeight: 1.55 }}>{t.line}</p>
                      <p className="mt-2" style={{ fontFamily: MONO, fontSize: 12, color: 'rgba(42,33,28,.48)' }}>{t.note}</p>
                    </div>
                    <a href={t.href} className={`inline-flex items-center justify-center rounded-full ${FOCUS}`}
                      style={{ background: t.primary ? RED : 'transparent', color: t.primary ? '#fff' : INK, border: t.primary ? 'none' : '1px solid rgba(42,33,28,.2)', fontFamily: SANS, fontWeight: 600, padding: '14px 24px', minHeight: 48, whiteSpace: 'nowrap' }}>
                      {t.action}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 02 · ON THE WAY ──────────────────────────────────────────
              Their /in-english page carries this first aid; their Icelandic
              page does not have it at all. The knocked-out tooth is first
              because it is the only one with a clock running on it, and the
              one hour window is the most useful sentence on their site. */}
          {/* Ivory, not a dark slab. The paintings are already near-black, so
              on ivory they read as plates hung on paper — which is the whole
              point of the warm-porcelain direction: the dark shrinks to the
              emergency band and the images, and the page breathes. */}
          <section id="aleidinni" className="scroll-mt-16" aria-labelledby="otw-h">
            <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32">
              <p className="uppercase" style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '.14em', color: 'rgba(42,33,28,.6)' }}>
                <span style={{ color: BRASS }}>[02]&nbsp;&nbsp;</span>Á leiðinni
              </p>
              <Headline id="otw-h" className="mt-6" text="Hvað á að gera næstu tíu mínúturnar" size={92} measure={1000} />

              {/* The two bands ARE the lesson for the tooth that fell out: hold
                  it by the crown, and if it will not go back, milk. Everything
                  below is the detail. Both sentences are lifted from the body
                  copy verbatim so nothing new is asserted in Icelandic. */}
              <div className="mt-14 grid gap-px" style={{ background: 'rgba(42,33,28,.16)' }}>
                <PaintBand
                  src={IMG.otwLoop}
                  poster={IMG.otwPoster}
                  alt="Máluð mynd af hendi sem heldur um krónu tannar. Rótin snertir ekkert."
                  step="Skref 01"
                  line="Haltu um krónuna, ekki rótina."
                  note="Ekki bursta rótina"
                />
                <PaintBand
                  src={IMG.otwMilk}
                  alt="Máluð mynd af mjólkurglasi á dökkum fleti."
                  step="Skref 02"
                  line="Fari hún ekki á sinn stað, geymdu hana í mjólk."
                  note="Innan klukkustundar"
                />
              </div>

              <div className="mt-14 grid gap-px" style={{ background: 'rgba(42,33,28,.16)' }}>
                {ON_THE_WAY.map((o) => (
                  <article key={o.n} className="grid gap-4 p-7 sm:p-9 md:grid-cols-[64px_1fr] md:gap-8" style={{ background: BONE }}>
                    <p style={{ fontFamily: MONO, fontSize: 12, color: o.urgent ? BRASS : 'rgba(42,33,28,.42)' }}>[{o.n}]</p>
                    <div>
                      <h3 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'calc(var(--u) * 34)', lineHeight: 1.16, letterSpacing: '-.02em' }}>
                        {o.head}
                        {o.urgent && (
                          <span className="ml-4 align-middle uppercase" style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '.14em', color: BRASS }}>
                            klukkan tifar
                          </span>
                        )}
                      </h3>
                      <p className="mt-3 max-w-[62ch]" style={{ color: 'rgba(42,33,28,.76)', lineHeight: 1.62, fontSize: 'calc(var(--u) * 17)' }}>
                        {o.body}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              <p className="mt-12 max-w-[58ch]" style={{ fontFamily: MONO, fontSize: 12, color: 'rgba(42,33,28,.52)', lineHeight: 1.7 }}>
                {ON_THE_WAY_NOTE}
                <span className="mt-3 block" style={{ color: 'rgba(42,33,28,.4)' }}>{ON_THE_WAY_ART_NOTE}</span>
              </p>
            </div>
          </section>

          {/* ── 03 · RED FLAGS ───────────────────────────────────────────
              PROPOSED, not from their site (see data.ts). The one case where
              waiting for a dentist is the wrong call: swelling that reaches
              the airway. Dark, because this is the section that should stop
              someone scrolling. */}
          <section id="neyd" className="scroll-mt-16" style={{ background: INK, color: '#FFF7E9' }} aria-labelledby="neyd-h">
            <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32">
              <p className="uppercase" style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '.14em', color: 'rgba(255,247,233,.6)' }}>
                <span style={{ color: '#C9A227' }}>[03]&nbsp;&nbsp;</span>Neyð
              </p>
              <Headline id="neyd-h" className="mt-6" text="Þegar það bíður ekki eftir tannlækni" size={92} measure={1000} />
              <p className="mt-8 max-w-[56ch]" style={{ color: 'rgba(255,247,233,.84)', fontSize: 'calc(var(--u) * 19)', lineHeight: 1.55 }}>
                {RED_FLAGS.intro}
              </p>
              <ul className="mt-12 grid gap-px" style={{ background: 'rgba(255,247,233,.16)' }}>
                {RED_FLAGS.items.map((r, i) => (
                  <li key={r} className="flex items-baseline gap-5 p-6 sm:px-8" style={{ background: INK }}>
                    <span aria-hidden="true" style={{ fontFamily: MONO, fontSize: 11, color: '#C9A227' }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ fontFamily: SERIF, fontSize: 'calc(var(--u) * 28)', lineHeight: 1.3, letterSpacing: '-.02em' }}>{r}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-11 flex flex-wrap items-center gap-x-10 gap-y-6">
                <p className="max-w-[54ch]" style={{ color: 'rgba(255,247,233,.72)', lineHeight: 1.62, fontSize: 'calc(var(--u) * 17)' }}>
                  {RED_FLAGS.note}
                </p>
                <a href="tel:112" className={`ml-auto inline-flex items-center rounded-full ${FOCUS}`}
                  style={{ background: RED, color: '#fff', fontFamily: SANS, fontWeight: 600, fontSize: 'calc(var(--u) * 19)', padding: '16px 32px', minHeight: 54, whiteSpace: 'nowrap' }}>
                  Hringja í 112
                </a>
              </div>
            </div>
          </section>

          {/* ── 04 · THE VISIT ───────────────────────────────────────────
              PROPOSED. Every step maps to a line in their own verðskrá, so it
              promises nothing they do not already sell. Answers the question
              nobody had addressed: what actually happens when I get there. */}
          <section id="vaktin" className="scroll-mt-16" style={{ background: SAND }} aria-labelledby="visit-h">
            <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32">
              <Eyebrow n="04">Á vaktinni</Eyebrow>
              <Headline id="visit-h" className="mt-6" text="Hvað gerist þegar þú kemur" size={98} measure={900} />
              <ol className="mt-14 grid gap-px" style={{ background: 'rgba(42,33,28,.14)' }}>
                {VISIT.map((v) => (
                  <li key={v.n} className="grid gap-4 p-7 sm:p-9 md:grid-cols-[64px_1fr] md:gap-8" style={{ background: SAND }}>
                    <p style={{ fontFamily: MONO, fontSize: 12, color: BRASS }}>[{v.n}]</p>
                    <div>
                      <h3 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'calc(var(--u) * 32)', lineHeight: 1.16, letterSpacing: '-.02em' }}>{v.head}</h3>
                      <p className="mt-3 max-w-[62ch]" style={{ color: 'rgba(42,33,28,.76)', lineHeight: 1.62, fontSize: 'calc(var(--u) * 17)' }}>{v.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* ── 03 · HOURS ──────────────────────────────────────────────── */}
          <section id="opnunartimi" className="scroll-mt-16" style={{ background: SAND }} aria-labelledby="hours-h">
            <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32">
              <Eyebrow n="06">Opnunartími</Eyebrow>
              <Headline id="hours-h" className="mt-6" text="Vaktin, dag fyrir dag" size={98} />
              <ul className="mt-14">
                {WEEK.map((w) => {
                  const today = w.day === status.today.day
                  return (
                    <li key={w.day} className="tlv-row flex flex-wrap items-baseline justify-between gap-3 border-b py-5" style={{ borderColor: 'rgba(42,33,28,.14)', color: today ? INK : 'rgba(42,33,28,.62)' }}>
                      <span className="flex items-center gap-3">
                        {today && <span aria-hidden="true" className="inline-block rounded-full" style={{ width: 7, height: 7, background: status.open ? GREEN : RED }} />}
                        <span style={{ fontFamily: SERIF, fontSize: 'calc(var(--u) * 30)', lineHeight: 1.16 }}>{w.label}</span>
                        {today && <span style={{ fontFamily: MONO, fontSize: 10, color: BRASS, letterSpacing: '.1em' }}>Í DAG</span>}
                      </span>
                      <span style={{ fontFamily: MONO, fontSize: 'calc(var(--u) * 17)' }}>
                        <span aria-hidden="true" style={{ opacity: .4 }}>[</span>
                        <span style={{ padding: '0 .55em' }}>{hhmm(w.open)} · {hhmm(w.close)}</span>
                        <span aria-hidden="true" style={{ opacity: .4 }}>]</span>
                      </span>
                    </li>
                  )
                })}
              </ul>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <p style={{ fontFamily: MONO, fontSize: 13, color: 'rgba(42,33,28,.6)', lineHeight: 1.65 }}>{HOURS_NOTE}</p>
                <p style={{ fontFamily: MONO, fontSize: 13, color: 'rgba(42,33,28,.6)', lineHeight: 1.65 }}>{AFTER_CLOSE}</p>
              </div>
            </div>
          </section>

          {/* ── 04 · PRICES ─────────────────────────────────────────────── */}
          <section id="verd" className="scroll-mt-16" aria-labelledby="price-h">
            <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32">
              <Eyebrow n="05">Verðskrá</Eyebrow>
              <Headline id="price-h" className="mt-6" text="Öll verðin, uppi á borðum" size={98} />
              {/* Was a full red slab, which is the loudest object on the page
                  telling you about a SURCHARGE — the one number a nervous
                  visitor least wants shouted. Umber carries the same weight
                  without the alarm, and keeps red meaning "call". */}
              <div className="mt-12 grid gap-7 rounded-2xl p-8 sm:p-11 md:grid-cols-[auto_1fr] md:items-center md:gap-14" style={{ background: INK, color: '#FFF7E9' }}>
                <div>
                  <p className="uppercase" style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '.13em', color: '#C9A227' }}>{PRICE_SURCHARGE.label}</p>
                  <RollingPrice value={SURCHARGE_VALUE} className="mt-3 block"
                  style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'calc(var(--u) * 76)', letterSpacing: '-.035em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }} />
                </div>
                <p style={{ lineHeight: 1.58, fontSize: 'calc(var(--u) * 18)', color: 'rgba(255,247,233,.82)' }}>{PRICE_SURCHARGE.body}</p>
              </div>
              {/* Grouped, not a flat dump. The groups are the natural ones in
                  the clinic's own list; tabular-nums makes the prices form a
                  column instead of a ragged edge. */}
              <div className="mt-16 grid gap-12">
                {PRICE_GROUPS.map((g) => (
                  <section key={g.group} aria-label={g.group}>
                    <h3 className="uppercase" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.16em', color: BRASS }}>{g.group}</h3>
                    <ul className="mt-4">
                      {g.items.map((p) => (
                        <li key={p.item} className="tlv-row flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b py-4" style={{ borderColor: 'rgba(42,33,28,.12)' }}>
                          <span style={{ fontSize: 'calc(var(--u) * 18)' }}>{p.item}</span>
                          <span style={{ fontFamily: MONO, fontSize: 'calc(var(--u) * 15)', color: 'rgba(42,33,28,.68)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{p.price}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
              <ul className="mt-8 grid gap-3">
                {PRICE_NOTES.map((n) => (
                  <li key={n} className="flex gap-3" style={{ fontFamily: MONO, fontSize: 12.5, color: 'rgba(42,33,28,.5)', lineHeight: 1.6 }}>
                    <span aria-hidden="true" style={{ color: BRASS }}>·</span><span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ── 04 · LOCATIONS ───────────────────────────────────────────
              One section, not two. It was a full-bleed band followed by two
              equal cards, which said the same thing twice AND implied both
              addresses are open. Only ONE is, on any given day — so the two are
              now set as an EITHER/OR with "eða" between them, over the night
              photograph. The layout now carries the fact instead of fighting it. */}
          {/* ── 07 · WHERE ───────────────────────────────────────────────
              No photograph. It carried a second night-window shot that read as
              a weaker copy of the hero, and this section is pure wayfinding:
              two addresses and the question of which one is open tonight.
              Utility wants clarity, not atmosphere.

              The real answer is the awkward one, so it leads: the location
              MOVES, and only the phone knows. Everything else supports it. */}
          <section id="stadsetning" className="scroll-mt-16">
            {/* The night window belongs HERE, not on the hero. It is the literal
                answer to the headline: which of the two is lit tonight. As the
                hero it was atmosphere; here it is the subject. Drift 13, the
                spec's top of the full-bleed band range. */}
            <div className="tlv-bleed" aria-hidden="true">
              <Frame src={IMG.heroNight} alt="" ratio="21/9" drift={13} />
              <div style={{ background: 'linear-gradient(to bottom, rgba(28,22,19,.34) 0%, rgba(28,22,19,.12) 45%, rgba(247,242,234,.55) 86%, ' + BONE + ' 100%)' }} />
            </div>
            <div className="mx-auto w-full max-w-[1240px] px-5 pb-24 pt-16 sm:px-8 sm:pb-32 sm:pt-20" aria-labelledby="place-h">
              <Eyebrow n="07">Staðsetning</Eyebrow>
              <Headline id="place-h" className="mt-6" text="Hvar er opið í kvöld" size={104} measure={820} />

              <p className="mt-7 max-w-[50ch]" style={{ color: 'rgba(42,33,28,.72)', fontSize: 'calc(var(--u) * 19)', lineHeight: 1.55 }}>
                {PLACE_NOTE}
              </p>

              {/* The either/or, as an actual fork rather than two cards. */}
              <div className="mt-14 grid items-start gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-8">
                {PLACES.map((place, i) => (
                  <div key={place.address} className="contents">
                    {i === 1 && (
                      <div className="flex items-start justify-center md:pt-7" aria-hidden="true">
                        <span className="uppercase" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.2em', color: BRASS }}>eða</span>
                      </div>
                    )}
                    <div className="border-t pt-7" style={{ borderColor: 'rgba(42,33,28,.18)' }}>
                      <h3 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'calc(var(--u) * 52)', lineHeight: 1.1, letterSpacing: '-.03em', color: INK }}>
                        {place.address}
                      </h3>
                      <p className="mt-2" style={{ fontFamily: MONO, fontSize: 'calc(var(--u) * 15)', color: 'rgba(42,33,28,.55)' }}>{place.postcode}</p>
                      <p className="mt-6 max-w-[34ch]" style={{ color: 'rgba(42,33,28,.78)', lineHeight: 1.5, fontSize: 'calc(var(--u) * 17)' }}>
                        {place.dentists}
                      </p>
                      <p className="mt-4 max-w-[34ch]" style={{ fontFamily: MONO, fontSize: 11.5, color: 'rgba(42,33,28,.45)', lineHeight: 1.6 }}>
                        {place.licence}
                      </p>
                      <a href={place.maps} target="_blank" rel="noreferrer"
                        className={`tlv-link mt-5 inline-flex items-center ${FOCUS}`}
                        style={{ color: BRASS, fontFamily: MONO, fontSize: 13, minHeight: 44 }}>
                        Opna í kortum
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Only the phone can resolve the fork, so it closes the section. */}
              <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-5 border-t pt-8" style={{ borderColor: 'rgba(42,33,28,.16)' }}>
                <p className="max-w-[46ch]" style={{ fontFamily: MONO, fontSize: 12.5, color: 'rgba(42,33,28,.55)', lineHeight: 1.65 }}>
                  Í síma 426 8000 færðu staðfest hvor stofan tekur á móti þann daginn.
                </p>
                <a href={PHONE_HREF} className={`tlv-cta tlv-cta-solid ml-auto ${FOCUS}`}
                  style={{ fontFamily: SANS, fontWeight: 600, fontSize: 'clamp(16px, calc(var(--u) * 18), 20px)' }}>
                  <span>Hringja í {PHONE_DISPLAY}</span>
                </a>
              </div>
            </div>
          </section>

          {/* ── 05 · ASK ────────────────────────────────────────────────── */}
          <AskSection />

          {/* ── ADVICE ──────────────────────────────────────────────────── */}
          <section style={{ background: SAND }} aria-labelledby="advice-h">
            <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32">
              <Eyebrow n="08">Á meðan þú bíður</Eyebrow>
              <Headline id="advice-h" className="mt-6" text="Ráð við tannverk" size={98} />
              <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-x-16">
                {ADVICE.map((a) => (
                  <article key={a.n}>
                    <p style={{ fontFamily: MONO, fontSize: 12, color: BRASS }}>[ {a.n} ]</p>
                    <h3 className="mt-3" style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'calc(var(--u) * 28)', lineHeight: 1.2, letterSpacing: '-.02em' }}>{a.head}</h3>
                    <p className="mt-3" style={{ color: 'rgba(42,33,28,.7)', lineHeight: 1.62 }}>{a.body}</p>
                  </article>
                ))}
              </div>
              {/* PROPOSED (see data.ts). Pairs with the advice above: what to
                  do before you are seen, and what to do after. Previously the
                  page simply stopped at the appointment. */}
              <div className="mt-16 border-t pt-12" style={{ borderColor: 'rgba(42,33,28,.16)' }}>
                <h3 className="uppercase" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.16em', color: BRASS }}>Eftir heimsóknina</h3>
                <ul className="mt-6 grid gap-x-16 gap-y-1 md:grid-cols-2">
                  {AFTERCARE.map((a, i) => (
                    <li key={a} className="flex items-baseline gap-4 border-b py-4" style={{ borderColor: 'rgba(42,33,28,.12)' }}>
                      <span aria-hidden="true" style={{ fontFamily: MONO, fontSize: 11, color: 'rgba(42,33,28,.4)' }}>{String(i + 1).padStart(2, '0')}</span>
                      <span style={{ color: 'rgba(42,33,28,.78)', lineHeight: 1.6, fontSize: 'calc(var(--u) * 17)' }}>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-14 max-w-[62ch]" style={{ fontFamily: MONO, fontSize: 12.5, color: 'rgba(42,33,28,.5)', lineHeight: 1.65 }}>
                Ráðin hér að ofan koma ekki í staðinn fyrir greiningu tannlæknis.
              </p>
            </div>
          </section>

          {/* ── CLOSER ──────────────────────────────────────────────────── */}
          <section className="mx-auto max-w-[1240px] px-5 py-28 sm:px-8 sm:py-36" aria-labelledby="closer-h">
            <Mark size={40} />
            <Headline id="closer-h" className="mt-10" text={status.open ? 'Það er opið. Hringdu.' : `Við opnum klukkan ${status.opensAt}.`} size={104} measure={880} />
            <a href={PHONE_HREF} className={`mt-10 inline-flex items-center rounded-full ${FOCUS}`}
              style={{ background: RED, color: '#fff', fontFamily: SANS, fontWeight: 600, fontSize: 'calc(var(--u) * 24)', padding: '19px 38px', minHeight: 60 }}>
              {PHONE_DISPLAY}
            </a>
            <p className="mt-12" style={{ fontFamily: MONO, fontSize: 12, color: 'rgba(42,33,28,.5)', lineHeight: 1.8 }}>
              {LEGAL_NAME} · kt. {KENNITALA} · Skipholt 33, 105 Reykjavík<br />
              <a href={EMAIL_HREF} className={`tlv-link inline-flex items-center ${FOCUS}`} style={{ color: BRASS, minHeight: 44 }}>{EMAIL}</a>
            </p>
          </section>
        </main>
      </div>

      <PreviewFooter company={company} />

      {/* Outside .tlv-root's flow on purpose: it is fixed to the viewport and
          must sit above the sticky header (z-40) and the spine (z-30). */}
      <VaktinBubble />
    </div>
  )
}

/* ── the assistant, living in the spine ───────────────────────────────── */

interface Turn { who: 'you' | 'vakt'; text: string }

function answerFor(q: string): string {
  const n = q.toLowerCase()
  let best: { s: number; a: string } | null = null
  for (const f of ASK_FACTS) {
    const s = f.match.reduce((acc, m) => (n.includes(m) ? acc + 1 : acc), 0)
    if (s > 0 && (!best || s > best.s)) best = { s, a: f.answer }
  }
  return best ? best.a : ASK_FALLBACK
}


/* ── the assistant ─────────────────────────────────────────────────────────
   Sindri asked for this twice: it is a FLOATING BUBBLE, not an inline panel.
   That is also the right call on the merits — "er þetta bráðatilvik?" occurs
   to someone while they are reading the prices or the first aid, not when
   they finally reach a section near the bottom. Fixed to the viewport, it is
   reachable from every scroll position.

   Section 06 keeps only the pitch and the example questions. Clicking one
   opens the bubble and sends it. The two are decoupled by a single window
   event rather than lifting conversation state up through the whole page. */

const ASK_OPEN = 'tlv:ask-open'
const askOpen = (q?: string) =>
  window.dispatchEvent(new CustomEvent<string | undefined>(ASK_OPEN, { detail: q }))

/**
 * Copy carried over from studying how consumer sites actually ship a
 * domain-limited assistant (Tripadvisor's "Ask our AI assistant" flow on
 * Mobbin, plus Pi). Three things they all do that this was missing:
 *
 *  1. the opener STATES ITS SCOPE, so nobody asks it to diagnose them;
 *  2. a standing disclaimer sits above the conversation, not buried;
 *  3. every answer is attributed, because a grounded assistant's whole
 *     selling point is that it is not improvising.
 *
 * The last one is free here and is the actual differentiator: the Worker only
 * ever replies with sentences published by the clinic, so saying where they
 * came from costs nothing and is simply true.
 */
const ASK_BADGE = 'Sjálfvirk svör'
const ASK_DISCLAIMER =
  'Svörin eru byggð á vef stofunnar og koma ekki í staðinn fyrir mat tannlæknis. Ekki senda persónuupplýsingar.'
const ASK_GREETING = 'Góðan dag. Hvað get ég gert fyrir þig?'
const ASK_SCOPE =
  'Ég svara því sem stendur á vef stofunnar: opnunartíma, verðskrá, hvað telst bráðatilvik og hvað á að gera á leiðinni. Viti ég ekki svarið segi ég það og vísa á símann.'
const ASK_SOURCE = 'Heimild: tannlaeknavaktin.is'

function AskSection() {
  return (
    <section id="spyrja" className="scroll-mt-16" aria-labelledby="ask-h">
      <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32">
        <Eyebrow n="09">Spyrðu vaktina</Eyebrow>
        <Headline id="ask-h" className="mt-6" text="Spurning sem má ekki bíða eftir símtali" size={92} measure={980} />
        <p className="mt-7 max-w-[54ch]" style={{ color: 'rgba(42,33,28,.7)', fontSize: 'calc(var(--u) * 19)', lineHeight: 1.55 }}>
          Svarar strax, allan sólarhringinn, líka þegar lokað er. Kann opnunartímann,
          verðskrána, hvað telst bráðatilvik og hvað á að gera á leiðinni. Viti hann
          ekki svarið segir hann það og vísar á símann.
        </p>

        <ul className="mt-12 sm:grid sm:grid-cols-2 sm:gap-x-14">
          {ASK_CHIPS.map((c, i) => (
            <li key={c}>
              <button type="button" onClick={() => askOpen(c)}
                className={`tlv-chip flex w-full items-baseline gap-4 py-4 pr-3 text-left ${FOCUS}`}
                style={{ borderTop: '1px solid rgba(42,33,28,.14)', minHeight: 56 }}>
                <span style={{ fontFamily: MONO, fontSize: 11, color: BRASS, letterSpacing: '.08em' }}>
                  [{String(i + 1).padStart(2, '0')}]
                </span>
                <span style={{ fontFamily: SANS, fontSize: 'clamp(15px, calc(var(--u) * 18), 20px)', color: 'rgba(42,33,28,.78)', lineHeight: 1.45 }}>
                  {c}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function VaktinBubble() {
  const [open, setOpen] = useState(false)
  const [entered, setEntered] = useState(false)
  const [turns, setTurns] = useState<Turn[]>([])
  const [value, setValue] = useState('')
  const [thinking, setThinking] = useState(false)
  const logRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const launchRef = useRef<HTMLButtonElement | null>(null)

  /* Let the hero have its moment before anything slides into the corner. */
  useEffect(() => {
    const t = window.setTimeout(() => setEntered(true), 900)
    return () => window.clearTimeout(t)
  }, [])

  /**
   * Suggestions to offer AFTER an answer: the examples not already asked,
   * capped at three so the panel does not turn into a menu. Only shown once
   * the assistant has actually replied, never mid-answer.
   */
  const asked = new Set(turns.filter((t) => t.who === 'you').map((t) => t.text))
  const answered = turns.length > 0 && turns[turns.length - 1].who === 'vakt'
  const followUps = answered ? ASK_CHIPS.filter((c) => !asked.has(c)).slice(0, 3) : []

  const send = useCallback(async (raw: string) => {
    const q = raw.trim()
    if (!q) return
    setValue('')
    const history = [...turns, { who: 'you' as const, text: q }]
    setTurns(history); setThinking(true)
    let answer = ''
    const ctrl = new AbortController()
    const timer = window.setTimeout(() => ctrl.abort(), 9000)
    try {
      const res = await fetch(ASK_ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctrl.signal,
        body: JSON.stringify({ messages: history.map((t) => ({ role: t.who === 'you' ? 'user' : 'assistant', content: t.text })) }),
      })
      if (res.ok) answer = ((await res.json()) as { answer?: string }).answer || ''
    } catch { /* fall back to the local grounded answers */ }
    finally { window.clearTimeout(timer) }
    setTurns((t) => [...t, { who: 'vakt', text: answer || answerFor(q) }])
    setThinking(false)
  }, [turns])

  /* Opened from the section's example questions. */
  useEffect(() => {
    const onOpen = (e: Event) => {
      setOpen(true)
      const q = (e as CustomEvent<string | undefined>).detail
      if (q) send(q)
    }
    window.addEventListener(ASK_OPEN, onOpen)
    return () => window.removeEventListener(ASK_OPEN, onOpen)
  }, [send])

  /* Escape closes and hands focus back to the launcher, which is where the
     keyboard user came from. */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); launchRef.current?.focus() }
    }
    window.addEventListener('keydown', onKey)
    const t = window.setTimeout(() => inputRef.current?.focus(), 120)
    return () => { window.removeEventListener('keydown', onKey); window.clearTimeout(t) }
  }, [open])

  /* Here a scroll-to-bottom IS correct: the panel is a fixed-height box, so
     the log genuinely scrolls inside it. (The inline section had no such box,
     which is why it needed the opposite treatment.) */
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [turns, thinking, open])

  return (
    <>
      {open && (
        <div
          data-lenis-prevent
          className="tlv-panel fixed z-[70] flex flex-col overflow-hidden right-5 bottom-[88px] sm:right-7 sm:bottom-[96px] w-[min(400px,calc(100vw-2.5rem))] h-[min(560px,calc(100svh-190px))]"
          role="dialog" aria-label="Spyrja vaktina"
          style={{
            background: BONE,
            border: '1px solid rgba(42,33,28,.10)',
            borderRadius: 18,
            // warm-tinted, three layers: contact, lift, ambient
            boxShadow: '0 1px 2px rgba(42,33,28,.05), 0 8px 24px rgba(42,33,28,.10), 0 32px 64px rgba(42,33,28,.13)',
          }}>
          <div className="flex items-center gap-2.5 px-5 py-3.5" style={{ borderBottom: '1px solid rgba(42,33,28,.09)' }}>
            <Mark size={17} color={BRASS} />
            <p style={{ fontFamily: SERIF, fontSize: 16.5, letterSpacing: '-.01em', color: '#2A211C' }}>Vaktin</p>
            {/* Honest capability label, the way Tripadvisor ships a BETA chip.
                Never let it read as a person. */}
            <span className="uppercase" style={{
              fontFamily: MONO, fontSize: 8.5, letterSpacing: '.13em', color: BRASS,
              border: '1px solid rgba(122,95,18,.32)', borderRadius: 3, padding: '2px 5px',
            }}>
              {ASK_BADGE}
            </span>
            <button type="button" onClick={() => { setOpen(false); launchRef.current?.focus() }}
              aria-label="Loka spjalli"
              className={`ml-auto grid h-9 w-9 place-items-center rounded-full ${FOCUS}`}
              style={{ color: 'rgba(42,33,28,.5)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" style={{ display: 'block' }}>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" fill="none" />
              </svg>
            </button>
          </div>

          {/* overscroll-behavior: contain stops the NATIVE scroll chaining that
              fires once this box hits its top or bottom — without it the page
              behind still creeps even though Lenis has stepped aside.
              min-h-0 defeats the flex-item min-height:auto default so the box
              can shrink below its content and actually scroll. */}
          <div ref={logRef}
            className="min-h-0 flex-1 overflow-y-auto px-5 py-5"
            style={{ overscrollBehavior: 'contain' }}
            role="log" aria-live="polite" aria-label="Samtal við vaktina">
            {/* Standing, not dismissible, and above the conversation rather
                than in a footnote. A dental page needs this more than a
                travel site does. */}
            <p style={{
              fontFamily: MONO, fontSize: 10, lineHeight: 1.65, color: 'rgba(42,33,28,.5)',
              background: SAND, borderRadius: 8, padding: '9px 11px',
            }}>
              {ASK_DISCLAIMER}
            </p>

            {turns.length === 0 ? (
              <>
                <p className="tlv-msg mt-5" style={{ fontFamily: SERIF, fontSize: 21, lineHeight: 1.35, letterSpacing: '-.01em', color: '#2A211C' }}>
                  {ASK_GREETING}
                </p>
                {/* States its own limits up front, so nobody asks it to
                    diagnose them and then feels refused. */}
                <p className="tlv-msg mt-2.5" style={{ fontFamily: SANS, fontSize: 13.5, lineHeight: 1.55, color: 'rgba(42,33,28,.6)', animationDelay: '.05s' }}>
                  {ASK_SCOPE}
                </p>
                <ul className="mt-6">
                  {ASK_CHIPS.map((c, i) => (
                    <li key={c} className="tlv-msg" style={{ animationDelay: `${0.1 + i * 0.045}s` }}>
                      <button type="button" onClick={() => send(c)}
                        className={`tlv-chip flex w-full items-baseline gap-3 py-2.5 pr-2 text-left ${FOCUS}`}
                        style={{ borderTop: '1px solid rgba(42,33,28,.1)', minHeight: 46 }}>
                        <span style={{ fontFamily: MONO, fontSize: 10, color: BRASS, letterSpacing: '.06em' }}>
                          [{String(i + 1).padStart(2, '0')}]
                        </span>
                        <span style={{ fontFamily: SANS, fontSize: 14.5, color: 'rgba(42,33,28,.8)', lineHeight: 1.45 }}>{c}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              turns.map((t, i) => (
                <div key={i} className="tlv-msg mt-5">
                  {t.who === 'you' ? (
                    <p style={{ fontFamily: MONO, fontSize: 11.5, lineHeight: 1.6, letterSpacing: '.01em', color: BRASS }}>
                      {t.text}
                    </p>
                  ) : (
                    <>
                      <p style={{ fontFamily: SERIF, fontSize: 19, lineHeight: 1.45, letterSpacing: '-.01em', color: '#2A211C' }}>
                        {t.text}
                      </p>
                      {/* Attribution is the point of a grounded assistant. */}
                      <p className="mt-2" style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: '.06em', color: 'rgba(42,33,28,.38)' }}>
                        {ASK_SOURCE}
                      </p>
                    </>
                  )}
                </div>
              ))
            )}

            {thinking && (
              <div className="tlv-sweep tlv-sweep-lt mt-5" aria-label="Vaktin skrifar" style={{ maxWidth: 150 }} />
            )}

            {/* Follow-ups after an answer, not only on the empty state — the
                second question is the one people struggle to phrase. */}
            {!thinking && followUps.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {followUps.map((c) => (
                  <li key={c}>
                    <button type="button" onClick={() => send(c)}
                      className={`tlv-follow ${FOCUS}`}
                      style={{
                        fontFamily: SANS, fontSize: 12.5, lineHeight: 1.3, textAlign: 'left',
                        color: 'rgba(42,33,28,.72)', background: 'transparent',
                        border: '1px solid rgba(42,33,28,.18)', borderRadius: 999,
                        padding: '7px 13px', minHeight: 36, cursor: 'pointer',
                      }}>
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* The conversion, permanently in reach. Tripadvisor's answers end
              in a bookable card; an emergency dentist's end in a phone call,
              and it should never take a scroll to find it. */}
          <a href={PHONE_HREF}
            className={`flex items-center justify-center gap-2.5 ${FOCUS}`}
            style={{
              background: RED, color: '#fff', fontFamily: SANS, fontWeight: 600,
              fontSize: 15, minHeight: 48, textDecoration: 'none',
            }}>
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" style={{ display: 'block' }}>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
                fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Hringja í {PHONE_DISPLAY}
          </a>

          <form onSubmit={(e) => { e.preventDefault(); send(value) }}
            className="flex items-center gap-3 px-5 py-2.5" style={{ borderTop: '1px solid rgba(42,33,28,.09)' }}>
            <label htmlFor="tlv-ask" className="sr-only">Spurningin þín</label>
            <input ref={inputRef} id="tlv-ask" value={value} onChange={(e) => setValue(e.target.value)}
              placeholder="Skrifaðu spurningu"
              className="tlv-ask-input-lt flex-1 bg-transparent focus:outline-none"
              style={{ color: '#2A211C', fontFamily: SERIF, fontSize: 16, minHeight: 46, border: 'none' }} />
            <button type="submit" disabled={thinking}
              className={`shrink-0 uppercase ${FOCUS}`}
              style={{
                fontFamily: MONO, fontSize: 10.5, letterSpacing: '.16em', color: BRASS,
                background: 'none', border: 'none', minHeight: 46, padding: '0 2px',
                cursor: thinking ? 'default' : 'pointer',
                opacity: thinking ? .4 : 1, transition: 'opacity .2s',
              }}>
              Spyrja
            </button>
          </form>
        </div>
      )}

      {/* Entrance lives on the wrapper so the button keeps its own hover
          transform — an inline transform on the button would outrank the
          stylesheet's :hover rule and kill it. */}
      <div className="fixed z-[71] right-5 bottom-5 sm:right-7 sm:bottom-7"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? 'none' : 'scale(.72) translateY(10px)',
          transition: 'opacity .5s ease, transform .55s cubic-bezier(.16,1,.3,1)',
        }}>
        <button ref={launchRef} type="button" onClick={() => setOpen((o) => !o)}
          aria-expanded={open} aria-label={open ? 'Loka spjalli' : 'Spyrja vaktina'}
          className={`tlv-launch flex items-center rounded-full ${FOCUS}`}
          style={{
            background: INK, height: 56, padding: '0 17px', border: 'none', cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(42,33,28,.18), 0 12px 30px rgba(42,33,28,.22)',
          }}>
          <span className="relative grid shrink-0 place-items-center" style={{ width: 22, height: 22 }}>
            {!open && entered && (
              <span aria-hidden="true" className="tlv-ring absolute rounded-full"
                style={{ inset: -7, border: '1.5px solid #C9A227' }} />
            )}
            {open ? (
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style={{ display: 'block' }}>
                <path d="M6 6l12 12M18 6L6 18" stroke="#C9A227" strokeWidth="1.9" strokeLinecap="round" fill="none" />
              </svg>
            ) : (
              <Mark size={21} color="#C9A227" />
            )}
          </span>
          <span className="tlv-launch-label uppercase"
            style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '.16em', color: '#C9A227' }}>
            {open ? 'Loka' : 'Spyrja vaktina'}
          </span>
        </button>
      </div>
    </>
  )
}
