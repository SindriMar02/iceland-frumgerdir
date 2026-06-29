/**
 * Faxi Bakery - "Nýbakað, með útsýni"
 * A roadside bakery & café on Iceland's Ring Road (Route 1) under Eyjafjallajökull.
 * Greenfield brand + single-page site built from scratch.
 *
 * ENGINEERING CONTRACT honoured:
 *   - Only creates src/preview/faxibakery/Page.tsx and data.ts
 *   - Exact imports per spec
 *   - No Framer useScroll/useTransform; scroll effect uses passive listener + inline styles
 *   - Clock is time-driven (setInterval), seeded synchronously, gated behind useReducedMotion
 *   - Hero opacity:1 immediately, no mount/whileInView gate above fold
 *   - WCAG AA: gold text #9A6B1E on cream, berry #B23A48 on cream
 *   - All sample prices clearly marked
 */

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Img } from '../../components/Img'
import { Reveal } from '../../components/Reveal'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { getPreviewCompany } from '../companies'
import { setThemeColor } from '../../lib/preview'
import { IMAGES, FALLBACK, MENU, REVIEWS, VISIT, LANDMARKS } from './data'

const company = getPreviewCompany('faxibakery')

// ── Design tokens ──────────────────────────────────────────────────────────────
const CREAM   = '#FBF6EC'
const BUTTER  = '#F4E3B6'
const GOLD    = '#9A6B1E'   // decorative / icon strokes
const GOLD_AA = '#7E561A'   // ≈5.2:1 on cream, ≈4.6:1 on butter — AA for small text
const WHEAT   = '#C98A2E'   // decorative only (clock arc, steam, border accents)
const VOLCANO = '#5B6B72'   // secondary blue-grey
const BERRY   = '#B23A48'   // highlight + GF flags (passes AA on cream)
const ESPRESSO= '#2A211A'

// ── Scoped CSS injected once ───────────────────────────────────────────────────
const PAGE_CSS = `
  .faxi-page { background: ${CREAM}; color: ${ESPRESSO}; }

  /* Nav */
  .faxi-nav-link:hover  { color: ${ESPRESSO} !important; }
  .faxi-nav-cta:hover   { background: ${GOLD} !important; transform: translateY(-1px); }

  /* Hero — always visible immediately, no fade gate */
  .faxi-hero-img { opacity: 1 !important; }

  /* Steam keyframes */
  @keyframes faxi-steam {
    0%   { transform: translateY(0) scaleX(1); opacity: 0.7; }
    50%  { transform: translateY(-12px) scaleX(1.2); opacity: 0.4; }
    100% { transform: translateY(-22px) scaleX(0.8); opacity: 0; }
  }
  @keyframes faxi-steam2 {
    0%   { transform: translateY(0) scaleX(1); opacity: 0.5; }
    60%  { transform: translateY(-16px) scaleX(0.9); opacity: 0.3; }
    100% { transform: translateY(-28px) scaleX(0.7); opacity: 0; }
  }
  .faxi-steam-1 {
    animation: faxi-steam 2.2s ease-in-out infinite;
    animation-delay: 0s;
  }
  .faxi-steam-2 {
    animation: faxi-steam2 2.6s ease-in-out infinite;
    animation-delay: 0.7s;
  }
  .faxi-steam-3 {
    animation: faxi-steam 3s ease-in-out infinite;
    animation-delay: 1.3s;
  }
  @media (prefers-reduced-motion: reduce) {
    .faxi-steam-1, .faxi-steam-2, .faxi-steam-3 { animation: none !important; opacity: 0.35; }
  }

  /* Card hovers */
  .faxi-menu-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px -8px rgba(42,33,26,0.14); }
  .faxi-roll-card:hover { transform: translateY(-4px); }
  .faxi-review-card:hover { border-color: rgba(201,138,46,0.3); }
  .faxi-cta-pill:hover { background: ${GOLD} !important; transform: translateY(-2px); }
  .faxi-ghost-btn:hover { background: rgba(42,33,26,0.05) !important; }

  /* Sticky mobile bar */
  .faxi-sticky-bar {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    z-index: 40;
    background: ${CREAM};
    border-top: 1px solid rgba(42,33,26,0.10);
    padding: 12px 20px 20px;
    display: none;
  }
  @media (max-width: 767px) {
    .faxi-sticky-bar { display: flex; gap: 10px; align-items: center; }
  }

  /* Mobile layout fixes */
  @media (max-width: 767px) {
    .faxi-hero-grid  { grid-template-columns: 1fr !important; }
    .faxi-rolls-grid { grid-template-columns: 1fr !important; }
    .faxi-menu-grid  { grid-template-columns: 1fr !important; }
    .faxi-reviews-grid { grid-template-columns: 1fr !important; }
    .faxi-road-grid  { grid-template-columns: 1fr !important; }
    .faxi-visit-grid { grid-template-columns: 1fr !important; }
    .faxi-view-grid  { grid-template-columns: 1fr !important; }
  }

  /* No overflow on mobile */
  .faxi-page { overflow-x: hidden; }

  /* Focus-visible rings */
  .faxi-page a:focus-visible, .faxi-page button:focus-visible { outline: 2px solid #9A6B1E; outline-offset: 3px; border-radius: 6px; }
`

// ── Clock helpers ──────────────────────────────────────────────────────────────

/** Seed the dial progress synchronously: fraction of the current hour elapsed. */
function currentDialProgress(): number {
  const now = new Date()
  return (now.getMinutes() * 60 + now.getSeconds()) / 3600
}

/** "HH:00" of the next o'clock (today or tomorrow). */
function nextOClock(): string {
  const now = new Date()
  const next = new Date(now)
  next.setHours(now.getHours() + 1, 0, 0, 0)
  return `${String(next.getHours()).padStart(2, '0')}:00`
}

// ── Steam SVG (aria-hidden, decorative) ───────────────────────────────────────
function Steam({ reduced }: { reduced: boolean }) {
  if (reduced) return null
  return (
    <div aria-hidden="true" style={{ display: 'flex', gap: 10, alignItems: 'flex-end', justifyContent: 'center', height: 38 }}>
      {[0, 1, 2].map((i) => (
        <svg
          key={i}
          width="10" height="36"
          viewBox="0 0 10 36"
          fill="none"
          className={`faxi-steam-${i + 1 as 1 | 2 | 3}`}
          style={{ opacity: 0.6 }}
        >
          <path
            d="M5 36 C5 30 10 26 5 20 C0 14 5 10 5 4 C5 0 3 0 3 0"
            stroke={WHEAT}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      ))}
    </div>
  )
}

// ── Gluten-free badge ──────────────────────────────────────────────────────────
function GFBadge() {
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: BERRY,
        border: `1.5px solid ${BERRY}`,
        borderRadius: 4,
        padding: '1px 6px',
        lineHeight: 1.6,
        flexShrink: 0,
      }}
      aria-label="Gluten-free option available"
    >
      GF
    </span>
  )
}

// ── Signature Clock ────────────────────────────────────────────────────────────
function SignatureClock({ reduced }: { reduced: boolean }) {
  const [progress, setProgress] = useState<number>(currentDialProgress)
  const [nextTime, setNextTime]  = useState<string>(nextOClock)

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => {
      setProgress(currentDialProgress())
      setNextTime(nextOClock())
    }, 1000)
    return () => clearInterval(id)
  }, [reduced])

  // SVG clock: radius 70, circumference 2π*70 ≈ 439.8
  const R   = 70
  const C   = 2 * Math.PI * R
  const gap = C * (1 - progress)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      {/* Dial */}
      {reduced ? (
        <div
          style={{
            width: 168, height: 168,
            borderRadius: '50%',
            border: `3px solid ${BUTTER}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          aria-hidden="true"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke={WHEAT} strokeWidth="1.6"/>
            <path d="M12 7v5l3 2" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </div>
      ) : (
        <div aria-label={`Next fresh batch at ${nextTime}`} role="img">
          <svg
            aria-hidden="true"
            width="168" height="168"
            viewBox="-90 -90 180 180"
            style={{ overflow: 'visible' }}
          >
            {/* Background track */}
            <circle
              r={R}
              fill="none"
              stroke={BUTTER}
              strokeWidth="6"
            />
            {/* Progress arc — sweeps clockwise from 12 o'clock */}
            <circle
              r={R}
              fill="none"
              stroke={WHEAT}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={gap}
              transform="rotate(-90)"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
            {/* Centre label */}
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontFamily: 'var(--font-chillax, system-ui)', fontSize: 13, fill: GOLD_AA, fontWeight: 600 }}
            >
              {nextTime}
            </text>
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              y="18"
              style={{ fontFamily: 'var(--font-satoshi, system-ui)', fontSize: 9, fill: VOLCANO, letterSpacing: '0.06em', textTransform: 'uppercase' }}
            >
              next batch
            </text>
          </svg>
        </div>
      )}

      {/* Steam above the label */}
      <Steam reduced={reduced} />

      {/* Label */}
      {reduced ? (
        <p style={{ fontFamily: 'var(--font-satoshi, system-ui)', fontSize: 15, color: VOLCANO, textAlign: 'center', maxWidth: 260 }}>
          Baked every hour, on the hour.
        </p>
      ) : (
        <p style={{ fontFamily: 'var(--font-satoshi, system-ui)', fontSize: 15, color: VOLCANO, textAlign: 'center', maxWidth: 280, lineHeight: 1.55 }}>
          Next fresh batch of <strong style={{ color: ESPRESSO, fontWeight: 700 }}>snúðar</strong> at <strong style={{ color: ESPRESSO }}>{nextTime}</strong>
        </p>
      )}
    </div>
  )
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav({ scrolled }: { scrolled: boolean }) {
  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: 68,
        background: scrolled ? `${CREAM}f2` : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(42,33,26,0.08)' : '1px solid transparent',
        display: 'flex', alignItems: 'center',
        padding: '0 clamp(20px, 5vw, 60px)',
        transition: 'background 0.35s ease, border-color 0.35s ease',
      }}
      aria-label="Main navigation"
    >
      {/* Wordmark */}
      <a
        href="#top"
        style={{
          fontFamily: 'var(--font-chillax, system-ui)',
          fontSize: 18, fontWeight: 600,
          color: ESPRESSO,
          textDecoration: 'none',
          letterSpacing: '-0.01em',
          flexShrink: 0,
        }}
        aria-label="Faxi Bakery - home"
      >
        Faxi Bakery
      </a>

      {/* Desktop links */}
      <div className="bk-nav-desktop" style={{ display: 'flex', gap: 32, marginLeft: 'auto', alignItems: 'center' }}>
        {[
          { href: '#menu', label: 'Menu' },
          { href: '#kitchen', label: 'Kitchen' },
          { href: '#visit', label: 'Visit' },
        ].map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="faxi-nav-link"
            style={{
              fontFamily: 'var(--font-satoshi, system-ui)',
              fontSize: 14, fontWeight: 500,
              color: 'rgba(42,33,26,0.55)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
          >
            {l.label}
          </a>
        ))}
        <a
          href="#visit"
          className="faxi-nav-cta"
          style={{
            fontFamily: 'var(--font-satoshi, system-ui)',
            fontSize: 13, fontWeight: 600,
            color: '#fff',
            background: WHEAT,
            textDecoration: 'none',
            padding: '9px 20px',
            borderRadius: 9999,
            transition: 'background 0.2s, transform 0.2s',
            display: 'inline-block',
            letterSpacing: '0.01em',
          }}
        >
          Open daily 8-18
        </a>
      </div>

      {/* Mobile "Open daily" pill */}
      <a
        href="#visit"
        aria-label="Open daily 8-18, see visit info"
        className="bk-nav-mobile-cta"
        style={{
          marginLeft: 'auto',
          fontFamily: 'var(--font-satoshi, system-ui)',
          fontSize: 12, fontWeight: 600,
          color: GOLD_AA,
          border: `1.5px solid ${WHEAT}`,
          padding: '7px 14px',
          borderRadius: 9999,
          textDecoration: 'none',
        }}
      >
        8-18
      </a>
    </nav>
  )
}

// ── Page component ────────────────────────────────────────────────────────────
export default function Page() {
  const reduce = useReducedMotion() ?? false
  const [scrolled, setScrolled] = useState(false)
  const heroImgRef = useRef<HTMLDivElement>(null)

  // Set document title + theme color
  useEffect(() => {
    document.title = 'Faxi Bakery - Nýbakað, með útsýni'
    setThemeColor('#FBF6EC')
    return () => { setThemeColor('#0a1320') }
  }, [])

  // Inject scoped CSS
  useEffect(() => {
    const el = document.createElement('style')
    el.id = 'faxi-page-styles'
    el.textContent = PAGE_CSS
    document.head.appendChild(el)
    return () => el.remove()
  }, [])

  // Nav scroll state — synchronous passive listener writing no React state on every tick
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Hero parallax — passive scroll listener writes inline style directly (no rAF loop, no Framer)
  useEffect(() => {
    if (reduce) return
    const el = heroImgRef.current
    if (!el) return
    const onScroll = () => {
      const y = window.scrollY
      el.style.transform = `translateY(${y * 0.28}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reduce])

  return (
    <div className="faxi-page" id="top">
      <PreviewChrome company={company} />

      {/* Inject mobile nav overrides — desktop vs mobile split */}
      <style>{`
        @media (min-width: 768px) { .bk-nav-mobile-cta { display: none !important; } }
        @media (max-width: 767px) { .bk-nav-desktop { display: none !important; } }
      `}</style>

      <Nav scrolled={scrolled} />

      {/* ─── 1. HERO ─────────────────────────────────────────────────────── */}
      <section
        id="hero"
        aria-label="Hero - fresh from the oven, every hour"
        style={{
          minHeight: '100dvh',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Background image — opacity:1 immediately, no Framer gate */}
        <div
          ref={heroImgRef}
          style={{
            position: 'absolute', inset: 0,
            willChange: reduce ? 'auto' : 'transform',
          }}
        >
          <Img
            src={IMAGES.hero}
            alt="Tray of glazed cinnamon rolls on a warm bakery counter with Eyjafjallajökull visible through a large window"
            className="faxi-hero-img"
            fetchpriority="high"
            fallbackClassName={FALLBACK.hero}
            style={{ width: '100%', height: '108%', objectFit: 'cover', objectPosition: 'center' } as React.CSSProperties}
          />
          {/* Warm scrim — ensures AA text contrast over photo */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(105deg, rgba(42,33,26,0.58) 0%, rgba(42,33,26,0.25) 55%, rgba(42,33,26,0.04) 100%)',
            }}
          />
        </div>

        {/* Hero copy — left-aligned, max 4 text elements per spec */}
        <div
          style={{
            position: 'relative', zIndex: 2,
            padding: 'clamp(100px,14vh,140px) clamp(24px,6vw,80px) clamp(60px,8vh,80px)',
            maxWidth: 680,
          }}
        >
          {/* Eyebrow */}
          <p
            style={{
              fontFamily: 'var(--font-satoshi, system-ui)',
              fontSize: 12, fontWeight: 500,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: '#F4E3B6',
              textShadow: '0 1px 3px rgba(42,33,26,0.55)',
              margin: '0 0 18px',
            }}
          >
            Faxi Bakery · þjóðvegur 1 · undir Eyjafjöllum
          </p>

          {/* Headline */}
          <h1
            style={{
              fontFamily: 'var(--font-chillax, system-ui)',
              fontSize: 'clamp(2.6rem, 6.5vw, 5rem)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              color: '#fff',
              margin: '0 0 22px',
            }}
          >
            Fresh from the oven,<br />every hour.
          </h1>

          {/* Sub-copy */}
          <p
            style={{
              fontFamily: 'var(--font-satoshi, system-ui)',
              fontSize: 'clamp(15px,1.8vw,18px)',
              fontWeight: 400,
              lineHeight: 1.6,
              color: 'rgba(244,227,182,0.9)',
              margin: '0 0 36px',
              maxWidth: 420,
            }}
          >
            Cinnamon rolls baked on the hour. Real espresso. A clear view of Eyjafjallajökull.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href="#menu"
              className="faxi-cta-pill"
              style={{
                fontFamily: 'var(--font-satoshi, system-ui)',
                fontSize: 15, fontWeight: 600,
                color: ESPRESSO,
                background: BUTTER,
                padding: '13px 28px',
                borderRadius: 9999,
                textDecoration: 'none',
                transition: 'background 0.2s, transform 0.2s',
                whiteSpace: 'nowrap',
                display: 'inline-block',
              }}
            >
              See the menu
            </a>
            <span
              style={{
                fontFamily: 'var(--font-satoshi, system-ui)',
                fontSize: 14, fontWeight: 500,
                color: 'rgba(244,227,182,0.75)',
                whiteSpace: 'nowrap',
              }}
            >
              Open daily 8:00-18:00
            </span>
          </div>
        </div>
      </section>

      {/* ─── 2. SIGNATURE CLOCK ──────────────────────────────────────────── */}
      <section
        id="signature"
        aria-label="Every hour, on the hour - fresh cinnamon rolls"
        style={{ background: CREAM, padding: 'clamp(64px,8vh,96px) clamp(24px,6vw,80px)' }}
      >
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px,6vw,80px)', alignItems: 'center' }} className="faxi-view-grid">
          <Reveal>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-chillax, system-ui)',
                  fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
                  fontWeight: 700, lineHeight: 1.08,
                  letterSpacing: '-0.02em',
                  color: ESPRESSO, margin: '0 0 18px',
                }}
              >
                Every hour,<br />on the hour.
              </h2>
              <p style={{ fontFamily: 'var(--font-satoshi, system-ui)', fontSize: 16, lineHeight: 1.65, color: VOLCANO, maxWidth: 340, margin: '0 0 24px' }}>
                From 8am to 6pm, a fresh tray of <em>snúðar</em> leaves the oven on the stroke of every hour. The dial tells you how long to wait.
              </p>
              <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD_AA, margin: 0 }}>
                Snúðar · baked fresh · every 60 min
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <SignatureClock reduced={reduce} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── 3. THE CINNAMON ROLL ────────────────────────────────────────── */}
      <section
        id="snudur"
        aria-label="The cinnamon roll - our signature"
        style={{ background: BUTTER, padding: 'clamp(64px,8vh,96px) clamp(24px,6vw,80px)' }}
      >
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontFamily: 'var(--font-satoshi, system-ui)', fontSize: 12, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD_AA, margin: '0 0 14px' }}>
              The snúður
            </p>
            <h2 style={{ fontFamily: 'var(--font-chillax, system-ui)', fontSize: 'clamp(1.9rem,4vw,3rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', color: ESPRESSO, margin: '0 0 48px', maxWidth: 560 }}>
              Three ways to enjoy Iceland's favourite pastry.
            </h2>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }} className="faxi-rolls-grid">
            {[
              {
                img: IMAGES.snudur, fallback: FALLBACK.snudur,
                alt: 'Close-up of a glazed classic cinnamon roll with vanilla icing drizzle',
                name: 'Classic',
                nameIs: 'Klassískur snúður',
                desc: 'Soft pillowy dough, warm cinnamon butter, vanilla glaze. The one that started it all.',
                price: 'frá 750 kr.',
              },
              {
                img: IMAGES.snudurTray, fallback: FALLBACK.snudur,
                alt: 'Tray of freshly baked cinnamon rolls topped with thick cream cheese frosting',
                name: 'Cream Cheese Top',
                nameIs: 'Rjómaostahúð',
                desc: 'Same warm base, finished with a thick layer of whipped cream cheese.',
                price: 'frá 820 kr.',
              },
              {
                img: IMAGES.snudur, fallback: FALLBACK.snudur,
                alt: 'Golden sourdough cinnamon roll with slightly tangy dough and light sugar glaze',
                name: 'Sourdough',
                nameIs: 'Sourdough snúður',
                desc: 'Made with a slow-fermented base. Slightly tangy, very tender. Weekend special.',
                price: 'frá 850 kr.',
              },
            ].map((roll) => (
              <Reveal key={roll.name} delay={0.1}>
                <div
                  className="faxi-roll-card"
                  style={{
                    borderRadius: 16,
                    overflow: 'hidden',
                    background: CREAM,
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                    <Img
                      src={roll.img}
                      alt={roll.alt}
                      fallbackClassName={roll.fallback}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' } as React.CSSProperties}
                    />
                  </div>
                  <div style={{ padding: '20px 20px 24px' }}>
                    <p style={{ fontFamily: 'var(--font-chillax, system-ui)', fontSize: 18, fontWeight: 700, color: ESPRESSO, margin: '0 0 4px' }}>{roll.name}</p>
                    <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, color: VOLCANO, letterSpacing: '0.08em', margin: '0 0 10px', textTransform: 'uppercase' }}>{roll.nameIs}</p>
                    <p style={{ fontFamily: 'var(--font-satoshi, system-ui)', fontSize: 14, lineHeight: 1.6, color: VOLCANO, margin: '0 0 14px' }}>{roll.desc}</p>
                    <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 12, color: GOLD_AA, margin: 0, fontWeight: 600 }}>{roll.price} <span style={{ fontWeight: 400, color: VOLCANO, fontSize: 11 }}>sýnishorn</span></p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. MENU ─────────────────────────────────────────────────────── */}
      <section
        id="menu"
        aria-label="Full menu"
        style={{ background: CREAM, padding: 'clamp(64px,8vh,96px) clamp(24px,6vw,80px)' }}
      >
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <Reveal>
            <h2 style={{ fontFamily: 'var(--font-chillax, system-ui)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.02em', color: ESPRESSO, margin: '0 0 8px' }}>
              What's on the counter.
            </h2>
            <p style={{ fontFamily: 'var(--font-satoshi, system-ui)', fontSize: 14, color: VOLCANO, margin: '0 0 48px' }}>
              Prices are sample (sýnishorn). GF = gluten-free option available.
            </p>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 32 }} className="faxi-menu-grid">
            {MENU.map((cat) => (
              <Reveal key={cat.id} delay={0.08}>
                <div
                  className="faxi-menu-card"
                  style={{
                    background: '#fff',
                    border: '1px solid rgba(42,33,26,0.08)',
                    borderRadius: 16,
                    padding: '24px 24px 28px',
                    transition: 'transform 0.28s ease, box-shadow 0.28s ease',
                  }}
                >
                  <h3 style={{ fontFamily: 'var(--font-chillax, system-ui)', fontSize: 20, fontWeight: 700, color: ESPRESSO, margin: '0 0 4px' }}>
                    {cat.title}
                    {cat.titleIs !== cat.title && (
                      <span style={{ fontFamily: 'var(--font-satoshi, system-ui)', fontWeight: 400, fontSize: 13, color: VOLCANO, marginLeft: 8 }}>{cat.titleIs}</span>
                    )}
                  </h3>
                  {cat.note && (
                    <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, color: GOLD_AA, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 16px' }}>{cat.note}</p>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: cat.note ? 0 : 16 }}>
                    {cat.items.map((item) => (
                      <div key={item.id} style={{ borderTop: '1px solid rgba(42,33,26,0.07)', paddingTop: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                              <span style={{ fontFamily: 'var(--font-satoshi, system-ui)', fontWeight: 700, fontSize: 14, color: ESPRESSO }}>{item.name}</span>
                              {item.gf && <GFBadge />}
                              {item.tag && (
                                <span style={{ fontSize: 10, fontWeight: 600, color: '#fff', background: BERRY, borderRadius: 4, padding: '1px 7px', lineHeight: 1.7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.tag}</span>
                              )}
                            </div>
                            <p style={{ fontFamily: 'var(--font-satoshi, system-ui)', fontSize: 13, color: VOLCANO, lineHeight: 1.55, margin: 0 }}>{item.description}</p>
                          </div>
                          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 12, color: GOLD_AA, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0, marginTop: 2 }}>{item.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. THE OPEN KITCHEN ─────────────────────────────────────────── */}
      <section
        id="kitchen"
        aria-label="Open kitchen - baked fresh in front of you"
        style={{ background: BUTTER, padding: 'clamp(64px,8vh,96px) clamp(24px,6vw,80px)' }}
      >
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px,6vw,72px)', alignItems: 'center' }} className="faxi-view-grid">
          <Reveal>
            <div style={{ aspectRatio: '3/4', borderRadius: 20, overflow: 'hidden' }}>
              <Img
                src={IMAGES.kitchen}
                alt="Baker rolling cinnamon dough in an open kitchen counter visible from the seating area"
                fallbackClassName={FALLBACK.kitchen}
                style={{ width: '100%', height: '100%', objectFit: 'cover' } as React.CSSProperties}
              />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-chillax, system-ui)', fontSize: 'clamp(1.9rem,4vw,3rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', color: ESPRESSO, margin: '0 0 20px' }}>
                Watch it being made.
              </h2>
              <p style={{ fontFamily: 'var(--font-satoshi, system-ui)', fontSize: 16, lineHeight: 1.7, color: VOLCANO, margin: '0 0 18px' }}>
                The kitchen is open to the room. You can watch the dough being rolled, the filling pressed in, the trays loaded. There is no mystery about what goes into the snúðar here.
              </p>
              <p style={{ fontFamily: 'var(--font-satoshi, system-ui)', fontSize: 16, lineHeight: 1.7, color: VOLCANO, margin: 0 }}>
                Everything is made on-site. The bread for the sandwiches, the pastry shells for the cakes, the whipped cream cheese that goes on top.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── 6. THE VIEW ─────────────────────────────────────────────────── */}
      <section
        id="view"
        aria-label="The view - Eyjafjallajökull and the Ring Road"
        style={{ background: CREAM, padding: 'clamp(64px,8vh,96px) clamp(24px,6vw,80px)' }}
      >
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <Reveal>
            <h2 style={{ fontFamily: 'var(--font-chillax, system-ui)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.02em', color: ESPRESSO, margin: '0 0 48px', maxWidth: 520 }}>
              A volcano you can eat breakfast under.
            </h2>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }} className="faxi-view-grid">
            <Reveal>
              <div style={{ aspectRatio: '4/3', borderRadius: 20, overflow: 'hidden' }}>
                <Img
                  src={IMAGES.seating}
                  alt="Warm indoor seating area with large windows looking out toward Eyjafjallajökull"
                  fallbackClassName={FALLBACK.seating}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' } as React.CSSProperties}
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ aspectRatio: '4/3', borderRadius: 20, overflow: 'hidden' }}>
                <Img
                  src={IMAGES.exterior}
                  alt="Exterior of Faxi Bakery on the Ring Road with the glacier-capped volcano in the background"
                  fallbackClassName={FALLBACK.exterior}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' } as React.CSSProperties}
                />
              </div>
            </Reveal>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }} className="faxi-rolls-grid">
            {[
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                ),
                title: 'Indoor seating',
                body: 'Warm tables inside, looking straight at the mountain.',
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ),
                title: 'Outdoor seating',
                body: 'Tables outside on good days. The volcano is right there.',
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
                  </svg>
                ),
                title: 'Free WiFi',
                body: 'Stay as long as you like. The coffee is good; the view is better.',
              },
            ].map((item) => (
              <Reveal key={item.title} delay={0.08}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: BUTTER, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon}
                  </div>
                  <p style={{ fontFamily: 'var(--font-chillax, system-ui)', fontSize: 16, fontWeight: 700, color: ESPRESSO, margin: 0 }}>{item.title}</p>
                  <p style={{ fontFamily: 'var(--font-satoshi, system-ui)', fontSize: 14, color: VOLCANO, lineHeight: 1.6, margin: 0 }}>{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* 2010 eruption note */}
          <Reveal delay={0.1}>
            <div style={{ marginTop: 56, padding: '28px 32px', background: BUTTER, borderRadius: 16, borderLeft: `4px solid ${WHEAT}`, maxWidth: 640 }}>
              <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: GOLD_AA, margin: '0 0 10px' }}>About Eyjafjallajökull</p>
              <p style={{ fontFamily: 'var(--font-satoshi, system-ui)', fontSize: 15, lineHeight: 1.7, color: ESPRESSO, margin: 0 }}>
                The glacier-topped volcano directly above Faxi Bakery last erupted in April 2010, halting European air traffic for weeks. Information plaques near the bakery explain the event and the landscape. On a clear day, the summit is unmistakable from the window seat.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── 7. ON THE RING ROAD ─────────────────────────────────────────── */}
      <section
        id="ringroad"
        aria-label="Location on the Ring Road"
        style={{ background: VOLCANO, padding: 'clamp(64px,8vh,96px) clamp(24px,6vw,80px)' }}
      >
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <Reveal>
            <h2 style={{ fontFamily: 'var(--font-chillax, system-ui)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.02em', color: '#fff', margin: '0 0 12px' }}>
              Right on the Ring Road.
            </h2>
            <p style={{ fontFamily: 'var(--font-satoshi, system-ui)', fontSize: 16, color: 'rgba(255,255,255,0.92)', margin: '0 0 48px', maxWidth: 480, lineHeight: 1.65 }}>
              Between Hvolsvöllur and Vík, with large parking just off Route 1. A perfect stop near the south-coast waterfalls.
            </p>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }} className="faxi-road-grid">
            {LANDMARKS.map((l) => (
              <Reveal key={l.name} delay={0.08}>
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px 22px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                    <span style={{ fontFamily: 'var(--font-chillax, system-ui)', fontSize: 16, fontWeight: 700, color: '#fff' }}>{l.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, color: '#FFFFFF', letterSpacing: '0.08em' }}>{l.distance}</span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-satoshi, system-ui)', fontSize: 14, color: 'rgba(255,255,255,0.82)', margin: 0, lineHeight: 1.5 }}>{l.note}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15}>
            <div style={{ marginTop: 40, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a
                href={VISIT.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="faxi-cta-pill"
                style={{
                  fontFamily: 'var(--font-satoshi, system-ui)',
                  fontSize: 14, fontWeight: 600,
                  color: ESPRESSO, background: BUTTER,
                  padding: '12px 24px', borderRadius: 9999,
                  textDecoration: 'none', display: 'inline-block',
                  transition: 'background 0.2s, transform 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                Find us on Google Maps
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── 8. REVIEWS ──────────────────────────────────────────────────── */}
      <section
        id="reviews"
        aria-label="Guest reviews"
        style={{ background: CREAM, padding: 'clamp(64px,8vh,96px) clamp(24px,6vw,80px)' }}
      >
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <Reveal>
            <h2 style={{ fontFamily: 'var(--font-chillax, system-ui)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.02em', color: ESPRESSO, margin: '0 0 8px' }}>
              What people say.
            </h2>
            <p style={{ fontFamily: 'var(--font-satoshi, system-ui)', fontSize: 13, color: VOLCANO, margin: '0 0 48px' }}>
              Sample reviews (sýnishorn) - see footer disclaimer.
            </p>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }} className="faxi-reviews-grid">
            {REVIEWS.map((r) => (
              <Reveal key={r.author} delay={0.08}>
                <div
                  className="faxi-review-card"
                  style={{
                    background: '#fff',
                    border: '1px solid rgba(42,33,26,0.09)',
                    borderRadius: 16, padding: '26px 26px 24px',
                    transition: 'border-color 0.25s ease',
                    display: 'flex', flexDirection: 'column', gap: 18,
                  }}
                >
                  <p style={{ fontFamily: 'var(--font-satoshi, system-ui)', fontSize: 15, lineHeight: 1.65, color: ESPRESSO, margin: 0, fontStyle: 'italic' }}>
                    "{r.quote}"
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-satoshi, system-ui)', fontSize: 13, fontWeight: 700, color: ESPRESSO }}>{r.author}</span>
                    <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, color: VOLCANO, letterSpacing: '0.06em' }}>{r.origin} - {r.source}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 9. VISIT ────────────────────────────────────────────────────── */}
      <section
        id="visit"
        aria-label="Visit us"
        style={{ background: BUTTER, padding: 'clamp(64px,8vh,96px) clamp(24px,6vw,80px)' }}
      >
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <Reveal>
            <h2 style={{ fontFamily: 'var(--font-chillax, system-ui)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.02em', color: ESPRESSO, margin: '0 0 48px' }}>
              Come find us.
            </h2>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px,6vw,72px)' }} className="faxi-visit-grid">
            {/* Info blocks */}
            <Reveal>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {/* Hours */}
                <div>
                  <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: GOLD_AA, margin: '0 0 8px' }}>Hours</p>
                  <p style={{ fontFamily: 'var(--font-chillax, system-ui)', fontSize: 22, fontWeight: 700, color: ESPRESSO, margin: '0 0 4px' }}>Open daily</p>
                  <p style={{ fontFamily: 'var(--font-satoshi, system-ui)', fontSize: 16, color: VOLCANO, margin: 0 }}>8:00 - 18:00, every day of the year</p>
                </div>
                {/* Location */}
                <div>
                  <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: GOLD_AA, margin: '0 0 8px' }}>Location</p>
                  <p style={{ fontFamily: 'var(--font-satoshi, system-ui)', fontSize: 16, color: ESPRESSO, fontWeight: 600, margin: '0 0 4px' }}>Þjóðvegur 1, undir Eyjafjöllum</p>
                  <p style={{ fontFamily: 'var(--font-satoshi, system-ui)', fontSize: 14, color: VOLCANO, margin: '0 0 14px' }}>South Iceland, between Hvolsvöllur and Vík. Large parking area right on Route 1.</p>
                  <a
                    href={VISIT.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontFamily: 'var(--font-satoshi, system-ui)', fontSize: 14, fontWeight: 600, color: GOLD_AA, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    Open in Google Maps
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Contact */}
            <Reveal delay={0.15}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: GOLD_AA, margin: '0 0 4px' }}>Get in touch</p>
                <p style={{ fontFamily: 'var(--font-satoshi, system-ui)', fontSize: 14, color: VOLCANO, lineHeight: 1.65, margin: 0 }}>
                  No reservations needed - we are a bakery. But say hello on Instagram or give us a call.
                </p>

                <a
                  href={VISIT.instagram}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontFamily: 'var(--font-satoshi, system-ui)',
                    fontSize: 15, fontWeight: 600,
                    color: '#fff', background: BERRY,
                    padding: '13px 24px', borderRadius: 12,
                    textDecoration: 'none', display: 'inline-flex',
                    alignItems: 'center', gap: 10,
                    width: 'fit-content',
                    transition: 'opacity 0.2s',
                  }}
                  aria-label="Message us on Instagram @faxi_bakery_"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="3" width="18" height="18" rx="5.2" /><circle cx="12" cy="12" r="4" /><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
                  </svg>
                  Message on Instagram {VISIT.instagramHandle}
                </a>

                <a
                  href={`tel:${VISIT.phoneHref}`}
                  style={{
                    fontFamily: 'var(--font-chillax, system-ui)',
                    fontSize: 22, fontWeight: 700,
                    color: ESPRESSO, textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    transition: 'color 0.2s',
                  }}
                  aria-label={`Call us at ${VISIT.phoneFmt}`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6A16 16 0 0 0 14 15.09l.95-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {VISIT.phoneFmt}
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── 10. FINAL CTA ───────────────────────────────────────────────── */}
      <section
        id="final-cta"
        aria-label="Plan your visit"
        style={{
          background: ESPRESSO,
          padding: 'clamp(72px,10vh,120px) clamp(24px,6vw,80px)',
          textAlign: 'center',
        }}
      >
        <Reveal>
          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: WHEAT, margin: '0 0 18px' }}>
            Faxi Bakery · Ring Road · South Iceland
          </p>
          <h2 style={{ fontFamily: 'var(--font-chillax, system-ui)', fontSize: 'clamp(2.2rem,5vw,4rem)', fontWeight: 700, lineHeight: 1.06, letterSpacing: '-0.025em', color: '#fff', margin: '0 0 18px' }}>
            The rolls are warm.<br />The view is ready.
          </h2>
          <p style={{ fontFamily: 'var(--font-satoshi, system-ui)', fontSize: 16, color: 'rgba(244,227,182,0.7)', margin: '0 auto 40px', maxWidth: 380, lineHeight: 1.65 }}>
            Open every day 8:00-18:00. No booking needed. Just pull over.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="#menu"
              className="faxi-cta-pill"
              style={{
                fontFamily: 'var(--font-satoshi, system-ui)',
                fontSize: 15, fontWeight: 600,
                color: ESPRESSO, background: BUTTER,
                padding: '14px 32px', borderRadius: 9999,
                textDecoration: 'none', display: 'inline-block',
                transition: 'background 0.2s, transform 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              See the menu
            </a>
            <a
              href={VISIT.instagram}
              target="_blank"
              rel="noreferrer"
              className="faxi-ghost-btn"
              style={{
                fontFamily: 'var(--font-satoshi, system-ui)',
                fontSize: 15, fontWeight: 600,
                color: 'rgba(244,227,182,0.85)',
                border: '1.5px solid rgba(244,227,182,0.25)',
                padding: '14px 32px', borderRadius: 9999,
                textDecoration: 'none', display: 'inline-block',
                transition: 'background 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              Follow on Instagram
            </a>
          </div>
        </Reveal>
      </section>

      {/* ─── Mobile sticky bar ───────────────────────────────────────────── */}
      <div className="faxi-sticky-bar" aria-hidden="true">
        <a
          href="#menu"
          style={{
            flex: 1,
            fontFamily: 'var(--font-satoshi, system-ui)',
            fontSize: 14, fontWeight: 700,
            color: ESPRESSO, background: BUTTER,
            padding: '12px 0', borderRadius: 9999,
            textDecoration: 'none', textAlign: 'center',
            whiteSpace: 'nowrap', display: 'block',
          }}
          tabIndex={-1}
        >
          See the menu
        </a>
        <span
          style={{
            fontFamily: 'var(--font-satoshi, system-ui)',
            fontSize: 12, fontWeight: 600,
            color: VOLCANO, whiteSpace: 'nowrap', flexShrink: 0,
          }}
        >
          Open 8-18
        </span>
      </div>

      <PreviewFooter company={company} />
    </div>
  )
}
