import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import Lenis from 'lenis'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { Img } from '../../components/Img'
import { Reveal } from '../../components/Reveal'
import {
  ADDRESS,
  COVERAGE,
  DIFFERENTIATOR,
  EMAIL,
  HOURS,
  IMG,
  MAPS,
  PHONE_DISPLAY,
  PHONE_HREF,
  REVIEWS,
  REVIEW_COUNT,
  SERVICES,
  STAT_MULTIPLIER,
  TIMELINE,
  WARRANTY_BODY,
  WARRANTY_YEARS,
} from './data'

const company = getPreviewCompany('smariholm')

/* ── BRYNJA — "an invisible armor against Icelandic weather." Prolan's real
      differentiator (a flexible lanolin membrane, not a rigid shell) reframed as
      the whole visual system: warm paper instead of another dark near-black page,
      two FUNCTIONAL accents — rust-red for the threat, wax-amber for the cure —
      used exactly where the copy is talking about one or the other, never as
      decoration. Signature move is a drag scrubber across Prolan's real 10-year
      warranty claim, not a scroll gimmick. ─────────────────────────────────── */
const PAPER = '#F1ECE0'
const STEEL = '#E4DECE'
const INK = '#18140F'
const MUTE = 'rgba(24,20,15,.62)' /* ~6.6:1 on PAPER */
const RUST = '#A8371B' /* 5.5:1 on PAPER as text; 5.8:1 on PAPER as bg w/ paper text */
const RUST_DEEP = '#7C2814'
const AMBER = '#C98A2E' /* 6.25:1 with INK text — fill/bg only, never text-on-paper */
const HAIR = 'rgba(24,20,15,.14)'

const BASE = import.meta.env.BASE_URL
const DISPLAY = "'BebasNeue-Regular', Impact, sans-serif"
const SANS = "'Satoshi', system-ui, sans-serif"

const CSS = `
@font-face{font-family:'BebasNeue-Regular';font-weight:400;font-style:normal;font-display:swap;
  src:url('${BASE}fonts/bebas-neue/fonts/BebasNeue-Regular.woff2') format('woff2'),
      url('${BASE}fonts/bebas-neue/fonts/BebasNeue-Regular.woff') format('woff')}
@font-face{font-family:'Satoshi';font-weight:400;font-style:normal;font-display:swap;
  src:url('${BASE}fonts/satoshi/Satoshi-Regular.woff2') format('woff2')}
@font-face{font-family:'Satoshi';font-weight:500;font-style:normal;font-display:swap;
  src:url('${BASE}fonts/satoshi/Satoshi-Medium.woff2') format('woff2')}
@font-face{font-family:'Satoshi';font-weight:700;font-style:normal;font-display:swap;
  src:url('${BASE}fonts/satoshi/Satoshi-Bold.woff2') format('woff2')}

.sh-root{position:relative;background:${PAPER};color:${INK};overflow-x:clip}
.sh-eyebrow{font-family:${SANS};font-weight:700;font-size:.72rem;letter-spacing:.28em;text-transform:uppercase}

.sh-nav{position:sticky;top:0;z-index:40;display:flex;align-items:center;justify-content:space-between;
  padding:.9rem 1.25rem;background:rgba(241,236,224,.86);backdrop-filter:blur(10px);border-bottom:1px solid ${HAIR}}
.sh-wordmark{font-family:${DISPLAY};font-size:1.7rem;letter-spacing:.02em;line-height:1;color:${INK}}
.sh-wordmark span{color:${RUST}}
.sh-nav-links{display:none;gap:2rem;font-family:${SANS};font-weight:500;font-size:.86rem;color:${MUTE}}
@media (min-width:860px){.sh-nav-links{display:flex}}
.sh-nav-links a:hover{color:${INK}}
.sh-btn{display:inline-flex;align-items:center;gap:.5rem;font-family:${SANS};font-weight:700;font-size:.86rem;
  padding:.7rem 1.25rem;border-radius:3px;white-space:nowrap;transition:transform .15s ease,box-shadow .15s ease}
.sh-btn:active{transform:scale(.97)}
.sh-btn--amber{background:${AMBER};color:${INK}}
.sh-btn--rust{background:${RUST};color:${PAPER}}
.sh-btn--ghost{border:1.5px solid ${INK};color:${INK}}
.sh-btn--ghost-light{border:1.5px solid rgba(241,236,224,.55);color:${PAPER}}

.sh-hero{position:relative;min-height:92svh;display:flex;flex-direction:column;justify-content:flex-end;
  padding:6.5rem 1.25rem 3.5rem}
.sh-hero-media{position:absolute;inset:0;z-index:0}
.sh-hero-media img{width:100%;height:100%;object-fit:cover;object-position:center 38%}
.sh-hero-scrim{position:absolute;inset:0;
  background:linear-gradient(180deg,rgba(15,12,8,.55) 0%,rgba(15,12,8,.35) 38%,rgba(15,12,8,.86) 100%)}
.sh-hero-body{position:relative;z-index:1;max-width:64rem;margin:0 auto;width:100%}
.sh-hero-eyebrow{color:${AMBER};display:flex;align-items:center;gap:.6rem}
.sh-hero-h1{font-family:${DISPLAY};color:${PAPER};font-size:clamp(2.9rem,9.5vw,6.4rem);line-height:.98;
  letter-spacing:.005em;margin-top:1rem;text-wrap:balance}
.sh-hero-h1 em{font-style:normal;color:${AMBER}}
.sh-hero-sub{font-family:${SANS};color:rgba(241,236,224,.86);font-size:clamp(1rem,2vw,1.2rem);max-width:38rem;
  margin-top:1.4rem;line-height:1.55}
.sh-hero-ctas{display:flex;flex-wrap:wrap;gap:.9rem;margin-top:2.2rem}
.sh-hero-chip{margin-top:2.4rem;display:flex;flex-wrap:wrap;gap:1.6rem;font-family:${SANS};font-size:.82rem;
  color:rgba(241,236,224,.72)}
.sh-hero-chip strong{color:${PAPER};font-weight:700}

.sh-section{padding:6.5rem 1.25rem}
.sh-wrap{max-width:64rem;margin:0 auto}
.sh-wrap--wide{max-width:76rem;margin:0 auto}
.sh-h2{font-family:${DISPLAY};font-size:clamp(2.2rem,5.6vw,3.6rem);line-height:1.02;letter-spacing:.005em;margin-top:.6rem}

.sh-threat{background:${PAPER}}
.sh-threat-grid{display:grid;gap:3rem;margin-top:3rem}
@media (min-width:900px){.sh-threat-grid{grid-template-columns:1.15fr .85fr;align-items:center}}
.sh-stat{font-family:${DISPLAY};color:${RUST};font-size:clamp(5rem,16vw,9rem);line-height:.85;display:flex;align-items:flex-start}
.sh-stat sup{font-size:.34em;margin-left:.15em;margin-top:.3em}
.sh-threat-body{font-family:${SANS};color:${MUTE};font-size:1.05rem;line-height:1.65;max-width:34rem;margin-top:1.2rem}
.sh-threat-photo{position:relative;border-radius:4px;overflow:hidden;aspect-ratio:4/3;box-shadow:0 24px 48px -24px rgba(24,20,15,.35)}
.sh-threat-photo img{width:100%;height:100%;object-fit:cover;filter:saturate(1.05) contrast(1.05)}
.sh-threat-photo-cap{position:absolute;left:0;right:0;bottom:0;padding:.8rem 1rem;font-family:${SANS};font-size:.72rem;
  color:${PAPER};background:linear-gradient(0deg,rgba(15,12,8,.75),transparent)}

.sh-brynja{background:${INK};color:${PAPER}}
.sh-brynja .sh-eyebrow{color:${AMBER}}
.sh-brynja .sh-h2{color:${PAPER}}
.sh-brynja-lede{font-family:${SANS};color:rgba(241,236,224,.66);max-width:38rem;margin-top:1rem;line-height:1.6}
.sh-scrub{margin-top:3.5rem;display:grid;gap:2.5rem}
@media (min-width:900px){.sh-scrub{grid-template-columns:.8fr 1.2fr;align-items:center;gap:4rem}}
.sh-scrub-readout{font-family:${DISPLAY};font-size:clamp(4.5rem,10vw,6.5rem);line-height:.9;color:${AMBER};
  display:flex;align-items:baseline;gap:.6rem}
.sh-scrub-readout span{font-size:.24em;color:rgba(241,236,224,.5);letter-spacing:.1em}
.sh-scrub-label{font-family:${SANS};font-weight:700;font-size:1.15rem;margin-top:.6rem}
.sh-scrub-body{font-family:${SANS};color:rgba(241,236,224,.62);font-size:.96rem;line-height:1.55;margin-top:.5rem;min-height:3.2em}
.sh-scrub-track{position:relative;height:6px;border-radius:99px;background:rgba(241,236,224,.16);
  margin-top:1rem;touch-action:none;cursor:grab}
.sh-scrub-track:active{cursor:grabbing}
.sh-scrub-fill{position:absolute;left:0;top:0;bottom:0;border-radius:99px;background:linear-gradient(90deg,${RUST},${AMBER})}
.sh-scrub-tick{position:absolute;top:50%;width:2px;height:10px;background:rgba(241,236,224,.28);transform:translate(-1px,-50%)}
.sh-scrub-thumb{position:absolute;top:50%;width:26px;height:26px;border-radius:50%;background:${PAPER};
  border:4px solid ${AMBER};transform:translate(-50%,-50%);box-shadow:0 4px 14px rgba(0,0,0,.4)}
.sh-scrub-labels{display:flex;justify-content:space-between;font-family:${SANS};font-size:.72rem;letter-spacing:.14em;
  text-transform:uppercase;color:rgba(241,236,224,.4);margin-top:.7rem}
.sh-warranty{font-family:${SANS};font-size:.86rem;color:rgba(241,236,224,.56);margin-top:2rem;padding-top:1.5rem;
  border-top:1px solid rgba(241,236,224,.14)}
.sh-warranty strong{color:${AMBER}}

.sh-how{background:${STEEL}}
.sh-how-grid{display:grid;gap:3rem;margin-top:3rem}
@media (min-width:900px){.sh-how-grid{grid-template-columns:1fr 1fr}}
.sh-how-body{font-family:${SANS};color:${MUTE};font-size:1.02rem;line-height:1.65}
.sh-coverage{list-style:none;margin-top:1.6rem;display:grid;gap:.65rem}
.sh-coverage li{display:flex;align-items:center;gap:.7rem;font-family:${SANS};font-weight:500;font-size:.94rem}
.sh-coverage svg{flex:none;color:${RUST}}
.sh-how-photo{position:relative;margin-top:3rem;border-radius:4px;overflow:hidden;aspect-ratio:21/9;
  box-shadow:0 24px 48px -24px rgba(24,20,15,.35)}
.sh-how-photo img{width:100%;height:100%;object-fit:cover;filter:grayscale(.25) contrast(1.05)}
.sh-how-photo-cap{position:absolute;left:0;right:0;bottom:0;padding:.9rem 1.1rem;font-family:${SANS};font-size:.78rem;
  color:${PAPER};background:linear-gradient(0deg,rgba(15,12,8,.72),transparent)}

.sh-services-grid{display:grid;gap:1.5px;background:${HAIR};margin-top:3rem;border:1px solid ${HAIR};border-radius:4px;overflow:hidden}
@media (min-width:700px){.sh-services-grid{grid-template-columns:1fr 1fr}}
.sh-service{background:${PAPER};padding:2rem}
.sh-service-name{font-family:${DISPLAY};font-size:1.5rem;letter-spacing:.01em}
.sh-service-body{font-family:${SANS};color:${MUTE};font-size:.92rem;line-height:1.55;margin-top:.6rem}

.sh-craft{position:relative;min-height:80svh;display:flex;align-items:flex-end}
.sh-craft-media{position:absolute;inset:0}
.sh-craft-media img{width:100%;height:100%;object-fit:cover;object-position:center 30%}
.sh-craft-scrim{position:absolute;inset:0;background:linear-gradient(90deg,rgba(15,12,8,.82) 0%,rgba(15,12,8,.4) 55%,rgba(15,12,8,.08) 100%)}
.sh-craft-body{position:relative;z-index:1;max-width:30rem;padding:4rem 1.25rem}
.sh-craft-body .sh-h2{color:${PAPER}}
.sh-craft-body p{font-family:${SANS};color:rgba(241,236,224,.8);font-size:1rem;line-height:1.6;margin-top:1.1rem}

.sh-reviews{background:${PAPER}}
.sh-carousel{margin-top:3rem;max-width:40rem}
.sh-carousel-track{position:relative;min-height:12rem}
@media (min-width:640px){.sh-carousel-track{min-height:9rem}}
.sh-review{position:absolute;inset:0;background:${STEEL};border-radius:4px;padding:2rem;border-left:3px solid ${RUST}}
.sh-review-quote{font-family:${SANS};font-size:1.02rem;line-height:1.55;color:${INK}}
.sh-review-meta{font-family:${SANS};font-weight:700;font-size:.82rem;color:${MUTE};margin-top:1rem}
.sh-carousel-controls{display:flex;align-items:center;gap:1.1rem;margin-top:1.5rem}
.sh-carousel-btn{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;border:1.5px solid ${HAIR};
  color:${INK};flex:none;transition:border-color .15s ease,transform .15s ease}
.sh-carousel-btn:hover{border-color:${RUST}}
.sh-carousel-btn:active{transform:scale(.92)}
.sh-carousel-dots{display:flex;gap:.5rem}
.sh-carousel-dot{width:8px;height:8px;border-radius:50%;background:${HAIR};border:none;padding:0;transition:background .2s ease,transform .2s ease}
.sh-carousel-dot.is-active{background:${RUST};transform:scale(1.3)}

.sh-location{position:relative;background:${INK};color:${PAPER}}
.sh-location-media{position:absolute;inset:0;opacity:.28}
.sh-location-media img{width:100%;height:100%;object-fit:cover}
.sh-location-scrim{position:absolute;inset:0;background:linear-gradient(180deg,${INK} 0%,rgba(24,20,15,.2) 40%,${INK} 100%)}
.sh-location-body{position:relative;z-index:1}
.sh-location-grid{display:grid;gap:2.5rem;margin-top:3rem}
@media (min-width:800px){.sh-location-grid{grid-template-columns:1fr 1fr}}
.sh-location-row{display:flex;gap:.8rem;align-items:flex-start;font-family:${SANS};font-size:.98rem;margin-top:.9rem}
.sh-location-row svg{flex:none;color:${AMBER};margin-top:.15rem}
.sh-hours-row{display:flex;justify-content:space-between;font-family:${SANS};font-size:.9rem;padding:.5rem 0;
  border-bottom:1px solid rgba(241,236,224,.1);color:rgba(241,236,224,.75)}

.sh-cta{background:${RUST_DEEP};color:${PAPER};text-align:center}
.sh-cta .sh-h2{color:${PAPER}}
.sh-cta-body{font-family:${SANS};color:rgba(241,236,224,.78);max-width:34rem;margin:1rem auto 0;line-height:1.6}
.sh-cta-ctas{display:flex;flex-wrap:wrap;justify-content:center;gap:1rem;margin-top:2.2rem}

.sh-sticky{position:fixed;left:0;right:0;bottom:0;z-index:50;display:flex;gap:.6rem;padding:.7rem;
  background:rgba(24,20,15,.92);backdrop-filter:blur(10px);border-top:1px solid rgba(241,236,224,.1)}
@media (min-width:860px){.sh-sticky{display:none}}
.sh-sticky a{flex:1;justify-content:center}
`

/* ── Count-up: interval keyed off Date.now (not rAF, which the preview harness
      throttles), a setTimeout lands the exact final value regardless. ─────── */
function CountUp({ to, suffix = '', className, style }: { to: number; suffix?: string; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState(0)
  const started = useRef(false)
  const reduce = useReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const run = () => {
      if (started.current) return
      started.current = true
      if (reduce) {
        setN(to)
        return
      }
      const dur = 1000
      const t0 = Date.now()
      const iv = window.setInterval(() => {
        const p = Math.min(1, (Date.now() - t0) / dur)
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
        if (p >= 1) window.clearInterval(iv)
      }, 32)
      window.setTimeout(() => {
        window.clearInterval(iv)
        setN(to)
      }, dur + 200)
    }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (run(), io.disconnect()), { threshold: 0.5 })
    io.observe(el)
    const fs = window.setTimeout(run, 1500)
    return () => {
      io.disconnect()
      window.clearTimeout(fs)
    }
  }, [to, reduce])
  return (
    <span ref={ref} className={className} style={style}>
      {n}
      {suffix}
    </span>
  )
}

/* ── Signature: THE 10-YEAR SCRUBBER. A drag handle (not scroll-linked, so it's
      both smooth for real users and verifiable here) scrubs 0→10 years across
      Prolan's own tested-protection claim, swapping a qualitative caption at each
      milestone. Functional, not decorative — it visualises the one number
      (10 ára prófuð vernd) this whole business is staking its trust on. ────── */
function YearScrubber() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [year, setYear] = useState(0)
  const [dragging, setDragging] = useState(false)

  const setFromClientX = (clientX: number) => {
    const el = trackRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    setYear(Math.round(pct * 10))
  }
  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
    setFromClientX(e.clientX)
  }
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return
    setFromClientX(e.clientX)
  }
  const onUp = () => setDragging(false)

  const active = TIMELINE.reduce((best, t) => (t.year <= year ? t : best), TIMELINE[0])
  const pct = (year / 10) * 100

  return (
    <div>
      <div className="sh-scrub-readout">
        {year}
        <span>ÁR AF VÖRN</span>
      </div>
      <div className="sh-scrub-label">{active.label}</div>
      <p className="sh-scrub-body">{active.body}</p>
      <div
        ref={trackRef}
        className="sh-scrub-track"
        role="slider"
        aria-label="Ár af Prolan vernd, 0 til 10"
        aria-valuemin={0}
        aria-valuemax={10}
        aria-valuenow={year}
        tabIndex={0}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') setYear((y) => Math.min(10, y + 1))
          if (e.key === 'ArrowLeft') setYear((y) => Math.max(0, y - 1))
        }}
      >
        <div className="sh-scrub-fill" style={{ width: `${pct}%` }} />
        {[0, 2, 4, 6, 8, 10].map((y) => (
          <div key={y} className="sh-scrub-tick" style={{ left: `${y * 10}%` }} />
        ))}
        <div className="sh-scrub-thumb" style={{ left: `${pct}%` }} />
      </div>
      <div className="sh-scrub-labels">
        <span>0 ÁR</span>
        <span>{WARRANTY_YEARS} ÁR</span>
      </div>
    </div>
  )
}

/* ── Reviews carousel: auto-rotates through the real Google reviews, pauses on
      hover/focus and while a reduced-motion preference is set, always reachable
      via dots + prev/next (never only auto-advancing). ────────────────────── */
function ReviewCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce || paused) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % REVIEWS.length), 5500)
    return () => window.clearInterval(id)
  }, [reduce, paused])

  const go = (i: number) => setIndex(((i % REVIEWS.length) + REVIEWS.length) % REVIEWS.length)
  const r = REVIEWS[index]

  return (
    <div
      className="sh-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="sh-carousel-track" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            className="sh-review"
            initial={{ opacity: 0, x: reduce ? 0 : 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduce ? 0 : -18 }}
            transition={{ duration: 0.4, ease: [0.21, 0.65, 0.36, 1] }}
          >
            <p className="sh-review-quote">“{r.quote}”</p>
            <div className="sh-review-meta">
              {r.name} · {r.date}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="sh-carousel-controls">
        <button type="button" aria-label="Fyrri umsögn" className="sh-carousel-btn" onClick={() => go(index - 1)}>
          <ChevronLeft size={18} />
        </button>
        <div className="sh-carousel-dots">
          {REVIEWS.map((rv, i) => (
            <button
              key={rv.name}
              type="button"
              aria-label={`Umsögn ${i + 1} af ${REVIEWS.length}`}
              aria-current={i === index}
              className={`sh-carousel-dot${i === index ? ' is-active' : ''}`}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <button type="button" aria-label="Næsta umsögn" className="sh-carousel-btn" onClick={() => go(index + 1)}>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

export default function SmariholmPage() {
  useEffect(() => {
    setThemeColor(PAPER)
    const lenis = new Lenis({ duration: 1.1, easing: (x) => Math.min(1, 1.001 - Math.pow(2, -10 * x)), smoothWheel: true })
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent('Fyrirspurn um ryðvörn')}`

  return (
    <div className="sh-root" lang="is">
      <style>{CSS}</style>
      <PreviewChrome company={company} />

      <nav className="sh-nav">
        <div className="sh-wordmark">
          PROLAN<span>.</span>
        </div>
        <div className="sh-nav-links">
          <a href="#thjonusta">Þjónusta</a>
          <a href="#umsagnir">Umsagnir</a>
          <a href="#samband">Hafa samband</a>
        </div>
        <a href={PHONE_HREF} className="sh-btn sh-btn--ghost">
          <Phone size={15} /> {PHONE_DISPLAY}
        </a>
      </nav>

      <header className="sh-hero">
        <div className="sh-hero-media">
          <Img src={IMG.hero()} alt="Bíll á lyftu á verkstæði" fetchpriority="high" />
        </div>
        <div className="sh-hero-scrim" />
        <div className="sh-hero-body">
          <div className="sh-eyebrow sh-hero-eyebrow">
            <ShieldCheck size={15} /> Prolan Bílaryðvörn · Hjá Smára Hólm
          </div>
          <h1 className="sh-hero-h1">
            RYÐ SÉST EKKI. <em>FYRR EN ÞAÐ ER OF SEINT.</em>
          </h1>
          <p className="sh-hero-sub">
            Við leggjum metnað okkar í faglega þjónustu og vandaða vinnu, svo bíllinn þinn fái ryðvörn sem endist.
            Bíllinn þinn á skilið allt það besta.
          </p>
          <div className="sh-hero-ctas">
            <a href={PHONE_HREF} className="sh-btn sh-btn--amber">
              <Phone size={16} /> Hringja núna
            </a>
            <a href="#thjonusta" className="sh-btn sh-btn--ghost-light">
              Sjá þjónustu
            </a>
          </div>
          <div className="sh-hero-chip">
            <span>
              <strong>{REVIEW_COUNT}</strong> umsagnir á Google
            </span>
            <span>
              <strong>{ADDRESS.street}</strong>, {ADDRESS.town}
            </span>
          </div>
        </div>
      </header>

      <section className="sh-section sh-threat">
        <div className="sh-wrap">
          <Reveal>
            <div className="sh-eyebrow" style={{ color: RUST }}>
              Íslenskt veðurfar
            </div>
            <h2 className="sh-h2">Af hverju þarf bíllinn þinn ryðvörn hér?</h2>
          </Reveal>
          <div className="sh-threat-grid">
            <Reveal delay={0.05}>
              <div className="sh-stat">
                <CountUp to={Number(STAT_MULTIPLIER)} />
                <sup>×</sup>
              </div>
              <p className="sh-threat-body">
                Íslenskt loftslag skapar með versta tæringarskilyrði í Evrópu fyrir ökutæki. Vegasalt, frost,
                stöðugur raki og malbiksblettir flýta fyrir ryði, oft á stöðum sem sjást ekki fyrr en það er of
                seint. Óvarin ökutæki í hörðu saltumhverfi geta orðið fyrir allt að fimm sinnum meiri mælanlegri
                tæringu undir vagnstelli — og ryð ógnar ekki bara útlitinu, heldur styrk grindar, bremsuleiðslum,
                festipunktum fjöðrunar og endursöluverði.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="sh-threat-photo">
                <Img src={IMG.rust()} alt="Ryðgaður, ómeðhöndlaður málmur í nærmynd" />
                <div className="sh-threat-photo-cap">Ómeðhöndlaður málmur — svona vinnur tæringin þegar ekkert stöðvar hana.</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="sh-section sh-brynja">
        <div className="sh-wrap">
          <Reveal>
            <div className="sh-eyebrow">Brynjan</div>
            <h2 className="sh-h2">Ein himna. Prófuð í allt að tíu ár.</h2>
            <p className="sh-brynja-lede">
              Dragðu sleðann og sjáðu hversu lengi PROLAN-himnan heldur — sama hvort bíllinn er splunkunýr eða
              kominn áratug áleiðis.
            </p>
          </Reveal>
          <div className="sh-scrub">
            <Reveal delay={0.05}>
              <YearScrubber />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="sh-brynja-lede" style={{ maxWidth: '34rem' }}>{DIFFERENTIATOR}</p>
              <div className="sh-warranty">
                <strong>{WARRANTY_YEARS} ára prófuð vernd:</strong> {WARRANTY_BODY}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="thjonusta" className="sh-section sh-how">
        <div className="sh-wrap--wide">
          <Reveal>
            <div className="sh-eyebrow" style={{ color: RUST }}>
              Hvernig PROLAN virkar
            </div>
            <h2 className="sh-h2">Sveigjanleg vörn, ekki stíf húðun.</h2>
          </Reveal>
          <div className="sh-how-grid">
            <Reveal delay={0.05}>
              <p className="sh-how-body">
                PROLAN er náttúrulegt ryðvarnarefni úr lanólíni sem bindur sig við málmflöt og myndar verndandi
                himnu gegn súrefni og raka — helstu orsökum tæringar. Ólíkt stífum húðunum sem geta sprungið eða
                fangað raka með tímanum, helst PROLAN sveigjanlegt og sígur inn í sauma, liði, holrúm og staði sem
                hefðbundnar meðferðir ná oft ekki til. Hentar á málm, gúmmí, plast og raftengla.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="sh-coverage">
                {COVERAGE.map((c) => (
                  <li key={c}>
                    <ShieldCheck size={17} /> {c}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <div className="sh-how-photo">
              <Img src={IMG.tools()} alt="Verkfæri á verkstæðisbekk" />
              <div className="sh-how-photo-cap">Handverkið á bak við hverja meðferð — sama natni, sama yfirferð, í hvert sinn.</div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="sh-section" style={{ background: PAPER }}>
        <div className="sh-wrap--wide">
          <Reveal>
            <div className="sh-eyebrow" style={{ color: RUST }}>
              Þjónusta
            </div>
            <h2 className="sh-h2">Það sem við bjóðum</h2>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="sh-services-grid">
              {SERVICES.map((s) => (
                <div key={s.name} className="sh-service">
                  <div className="sh-service-name">{s.name}</div>
                  <div className="sh-service-body">{s.body}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="sh-craft">
        <div className="sh-craft-media">
          <Img src={IMG.craft()} alt="Vélvirki að störfum á verkstæði" />
        </div>
        <div className="sh-craft-scrim" />
        <div className="sh-craft-body">
          <div className="sh-eyebrow" style={{ color: AMBER }}>
            Handverkið
          </div>
          <h2 className="sh-h2">Smári og teymið sjá um hvern bíl sjálf.</h2>
          <p>
            Prolan ehf. er rekið af Smára Hólm í Hafnarfirði — ekki keðja, ekki afgreiðslubandi. Hver bíll fer í
            gegnum sömu vönduðu yfirferð: skoðað, meðhöndlað og gengið frá með þeirri natni sem lanólín-vinna
            krefst.
          </p>
        </div>
      </section>

      <section id="umsagnir" className="sh-section sh-reviews">
        <div className="sh-wrap">
          <Reveal>
            <div className="sh-eyebrow" style={{ color: RUST }}>
              Umsagnir
            </div>
            <h2 className="sh-h2">{REVIEW_COUNT} umsagnir á Google</h2>
          </Reveal>
          <Reveal delay={0.05}>
            <ReviewCarousel />
          </Reveal>
        </div>
      </section>

      <section className="sh-location">
        <div className="sh-location-media">
          <Img src={IMG.climate()} alt="Vetrarvegur á Íslandi" />
        </div>
        <div className="sh-location-scrim" />
        <div className="sh-location-body sh-section">
          <div className="sh-wrap">
            <Reveal>
              <div className="sh-eyebrow" style={{ color: AMBER }}>
                Finndu okkur
              </div>
              <h2 className="sh-h2">Suðurhella 10, Hafnarfjörður</h2>
            </Reveal>
            <div className="sh-location-grid">
              <Reveal delay={0.05}>
                <div className="sh-location-row">
                  <MapPin size={18} />
                  <a href={MAPS} target="_blank" rel="noreferrer">
                    {ADDRESS.street}, {ADDRESS.town}
                  </a>
                </div>
                <div className="sh-location-row">
                  <Phone size={18} />
                  <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
                </div>
                <div className="sh-location-row">
                  <Mail size={18} />
                  <a href={mailto}>{EMAIL}</a>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="sh-eyebrow" style={{ color: 'rgba(241,236,224,.5)' }}>
                  Opnunartími
                </div>
                {HOURS.map((h) => (
                  <div key={h.day} className="sh-hours-row">
                    <span>{h.day}</span>
                    <span>{h.time}</span>
                  </div>
                ))}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section id="samband" className="sh-section sh-cta">
        <div className="sh-wrap">
          <Reveal>
            <div className="sh-eyebrow" style={{ color: AMBER }}>
              Næsta skref
            </div>
            <h2 className="sh-h2">Brynjum bílinn þinn áður en ryðið gerir það sjálft.</h2>
            <p className="sh-cta-body">
              Hringdu eða sendu okkur línu — segðu frá bílnum þínum og skráningarnúmeri, og við komum til baka með
              ráðgjöf og tilboði sem hentar.
            </p>
            <div className="sh-cta-ctas">
              <a href={PHONE_HREF} className="sh-btn sh-btn--amber">
                <Phone size={16} /> {PHONE_DISPLAY}
              </a>
              <a href={mailto} className="sh-btn sh-btn--ghost-light">
                <Mail size={16} /> Senda tölvupóst
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <PreviewFooter company={company} />

      <div className="sh-sticky">
        <a href={PHONE_HREF} className="sh-btn sh-btn--amber">
          <Phone size={15} /> Hringja
        </a>
        <a href={mailto} className="sh-btn sh-btn--rust">
          <Mail size={15} /> Senda póst
        </a>
      </div>
    </div>
  )
}
