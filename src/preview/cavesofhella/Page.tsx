/**
 * Caves of Hella — "Niður í myrkrið / Iceland's Hidden World"
 *
 * ENGINEERING NOTES:
 * - Signature scroll effect: synchronous passive scroll listener writing raw
 *   inline styles / CSS custom properties each tick. NO Framer useScroll/useTransform,
 *   NO rAF loops (both throttled in preview tab). NO CSS transition on scroll-driven props.
 * - Hero is opacity:1 immediately. No mount/whileInView gates above the fold.
 * - All infinite animations (candle flicker) gated behind useReducedMotion().
 * - ISK prices formatted exactly: "6.950 kr."
 */

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Img } from '../../components/Img'
import { Reveal } from '../../components/Reveal'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { getPreviewCompany } from '../companies'
import { setThemeColor } from '../../lib/preview'
import {
  HERO,
  DESCENT,
  MYSTERY,
  CAVES,
  CAVES_NOTE,
  EXPERIENCE,
  PRICES,
  SPECIAL_TOURS,
  BOOKING,
  REVIEWS,
  VISIT,
  IMAGES,
} from './data'

const company = getPreviewCompany('cavesofhella')

// ---------------------------------------------------------------------------
// Palette constants (not Tailwind — used in inline styles for scroll-driven values)
// ---------------------------------------------------------------------------
const C = {
  canvas: '#0B0B0D',
  stone: '#15140F',
  bone: '#E8E2D2',
  amber: '#D99A3E',
  amberDeep: '#C8862F',
  ember: '#9A5B1E',
  boneLight: 'rgba(232,226,210,0.7)',
} as const

// ---------------------------------------------------------------------------
// Utility: format ISK price
// ---------------------------------------------------------------------------
function formatKr(n: number): string {
  return n.toLocaleString('is-IS').replace(/,/g, '.') + ' kr.'
}

// ---------------------------------------------------------------------------
// SVG: Latin cross that self-inscribes via stroke-dashoffset
// ---------------------------------------------------------------------------
function AnimatedCross({ className = '', reduce = false }: { className?: string; reduce?: boolean }) {
  // Vertical bar: total length ~240. Horizontal bar: ~120. Approx total ~360.
  const vRef = useRef<SVGLineElement>(null)
  const hRef = useRef<SVGLineElement>(null)

  useEffect(() => {
    if (reduce) return
    const v = vRef.current
    const h = hRef.current
    if (!v || !h) return
    const vLen = v.getTotalLength?.() ?? 240
    const hLen = h.getTotalLength?.() ?? 120
    v.style.strokeDasharray = String(vLen)
    v.style.strokeDashoffset = String(vLen)
    h.style.strokeDasharray = String(hLen)
    h.style.strokeDashoffset = String(hLen)
    // Animate over 2.4s using CSS animation declared inline
    v.style.animation = 'crossDraw 1.4s ease-out 0.2s forwards'
    h.style.animation = 'crossDraw 0.8s ease-out 1.5s forwards'
  }, [reduce])

  return (
    <>
      <style>{`
        @keyframes crossDraw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
      <svg
        className={className}
        viewBox="0 0 60 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <line
          ref={vRef}
          x1="30" y1="5" x2="30" y2="95"
          stroke={C.amber}
          strokeWidth="3"
          strokeLinecap="round"
          style={reduce ? {} : { strokeDasharray: 90, strokeDashoffset: 90 }}
        />
        <line
          ref={hRef}
          x1="10" y1="32" x2="50" y2="32"
          stroke={C.amber}
          strokeWidth="3"
          strokeLinecap="round"
          style={reduce ? {} : { strokeDasharray: 40, strokeDashoffset: 40 }}
        />
      </svg>
    </>
  )
}

// ---------------------------------------------------------------------------
// Section 2: THE DESCENT — synchronous scroll signature
// ---------------------------------------------------------------------------
function DescentSection() {
  const reduce = useReducedMotion() ?? false
  const sectionRef = useRef<HTMLDivElement>(null)
  const daylightRef = useRef<HTMLDivElement>(null)
  const wallLRef = useRef<HTMLDivElement>(null)
  const wallRRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const depthRef = useRef<HTMLSpanElement>(null)
  const crossContainerRef = useRef<HTMLDivElement>(null)
  const [crossVisible, setCrossVisible] = useState(false)
  const crossShownRef = useRef(false)

  useEffect(() => {
    if (reduce) {
      // Resolved END state for users who prefer reduced motion
      if (daylightRef.current) daylightRef.current.style.opacity = '0'
      if (wallLRef.current) wallLRef.current.style.transform = 'translateX(0)'
      if (wallRRef.current) wallRRef.current.style.transform = 'translateX(0)'
      if (glowRef.current) glowRef.current.style.opacity = '1'
      if (depthRef.current) depthRef.current.textContent = DESCENT.depthFinal
      setCrossVisible(true)
      return
    }
    const section = sectionRef.current
    if (!section) return

    const handler = () => {
      const track = section.parentElement as HTMLElement   // relative wrapper = sticky scene + 220vh spacer
      const rect = track.getBoundingClientRect()
      const vh = window.innerHeight
      const scrollable = rect.height - vh
      const p = Math.min(1, Math.max(0, -rect.top / scrollable))

      // Daylight overlay: 1 → 0
      if (daylightRef.current) {
        daylightRef.current.style.opacity = String(Math.max(0, 1 - p * 2.2))
      }

      // Side walls translate inward: from -22vw to 0
      const wallX = Math.max(0, (1 - p * 2.5)) * 22
      if (wallLRef.current) {
        wallLRef.current.style.transform = `translateX(-${wallX}vw)`
      }
      if (wallRRef.current) {
        wallRRef.current.style.transform = `translateX(${wallX}vw)`
      }

      // Candle glow fades in from p=0.3
      const glowP = Math.min(1, Math.max(0, (p - 0.25) / 0.6))
      if (glowRef.current) {
        glowRef.current.style.opacity = String(glowP)
      }

      // Depth readout
      if (depthRef.current) {
        const meters = Math.round(p * 12)
        depthRef.current.textContent = meters < 12 ? `${meters} m` : DESCENT.depthFinal
      }

      // Trigger cross inscription once we're 55% through
      if (p > 0.55 && !crossShownRef.current) {
        crossShownRef.current = true
        setCrossVisible(true)
      }
    }

    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [reduce])

  return (
    <section
      ref={sectionRef}
      id="descent"
      style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
        background: C.canvas,
        zIndex: 1,
      }}
      aria-label="The descent"
    >
      {/* Base cave image */}
      <Img
        src={IMAGES.chamber1}
        alt="The interior of a carved cave at Aegissida, darkness closing in"
        className="absolute inset-0 h-full w-full object-cover object-center"
        fallbackClassName="absolute inset-0 bg-gradient-to-b from-[#1a1410] via-[#0f0d09] to-[#0b0b0d]"
      />

      {/* Dark base veil so text always reads */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(11,11,13,0.45) 0%, rgba(11,11,13,0.72) 100%)' }}
      />

      {/* Daylight overlay — fades from white/gold to nothing */}
      <div
        ref={daylightRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(232,220,170,0.55) 0%, rgba(220,190,100,0.18) 50%, transparent 80%)',
          pointerEvents: 'none',
          transition: 'none',
        }}
      />

      {/* Left basalt wall — translates inward */}
      <div
        ref={wallLRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '28vw',
          height: '100%',
          background: 'linear-gradient(to right, #0f0e0a 0%, rgba(15,14,10,0.82) 70%, transparent 100%)',
          transform: 'translateX(-22vw)',
          transition: 'none',
          pointerEvents: 'none',
        }}
      />

      {/* Right basalt wall */}
      <div
        ref={wallRRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '28vw',
          height: '100%',
          background: 'linear-gradient(to left, #0f0e0a 0%, rgba(15,14,10,0.82) 70%, transparent 100%)',
          transform: 'translateX(22vw)',
          transition: 'none',
          pointerEvents: 'none',
        }}
      />

      {/* Candle glow */}
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0,
          background: `radial-gradient(ellipse 60% 44% at 50% 64%, rgba(201,134,47,0.38) 0%, rgba(154,91,30,0.18) 42%, transparent 70%)`,
          pointerEvents: 'none',
          transition: 'none',
        }}
      />

      {/* Content: centred in scene */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        {/* Depth readout */}
        <p
          className="font-mono text-xs tracking-[0.22em] uppercase mb-8"
          style={{ color: C.amber, letterSpacing: '0.22em' }}
        >
          <span ref={depthRef}>0 m</span>
        </p>

        {/* Self-inscribing cross */}
        <div
          ref={crossContainerRef}
          className="mb-8"
          style={{ width: 48, height: 80, opacity: crossVisible ? 1 : 0.12 }}
        >
          <AnimatedCross reduce={reduce || !crossVisible} />
        </div>

        {/* End-of-descent line */}
        <p
          className="font-marcellus text-2xl md:text-3xl lg:text-4xl"
          style={{ color: C.bone, maxWidth: '36ch', lineHeight: 1.3 }}
        >
          {DESCENT.endLine}
        </p>
      </div>
    </section>
  )
}

// Spacer that creates the scroll distance for the pinned descent
function DescentSpacer() {
  return <div aria-hidden="true" style={{ height: '220vh', background: C.canvas }} />
}

// ---------------------------------------------------------------------------
// Section 6: Pricing table
// ---------------------------------------------------------------------------
function PriceCard({ label, price, detail }: { label: string; price: string; detail?: string }) {
  return (
    <div
      className="flex items-baseline justify-between py-5 border-b"
      style={{ borderColor: 'rgba(232,226,210,0.1)' }}
    >
      <div>
        <span className="font-marcellus text-lg" style={{ color: C.bone }}>
          {label}
        </span>
        {detail && (
          <span className="ml-2 font-mono text-[11px] tracking-wide" style={{ color: C.amberDeep }}>
            {detail}
          </span>
        )}
      </div>
      <span className="font-marcellus text-xl" style={{ color: C.amber }}>
        {price}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Section 7: Booking panel
// ---------------------------------------------------------------------------
function BookingPanel() {
  const today = new Date()
  const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const [date, setDate] = useState(defaultDate)
  const [time, setTime] = useState<string>(BOOKING.tourTimes[0])
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)

  const isFamily = adults === 2 && children === 2
  const total = isFamily
    ? BOOKING.familyPrice
    : adults * BOOKING.adultPrice + children * BOOKING.childPrice

  const buildMailto = () => {
    const subj = `Cave tour booking request - ${date} at ${time}`
    const body = [
      `Hello,`,
      ``,
      `I would like to request a cave tour booking at Caves of Hella.`,
      ``,
      `Date: ${date}`,
      `Time: ${time}`,
      `Adults: ${adults}`,
      `Children (6-15): ${children}`,
      ``,
      `Estimated total: ${formatKr(total)}`,
      ``,
      `Please confirm availability and next steps.`,
      ``,
      `Thank you`,
    ].join('\n')
    return `mailto:${BOOKING.email}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`
  }

  const Stepper = ({
    label,
    sublabel,
    value,
    onDec,
    onInc,
  }: {
    label: string
    sublabel?: string
    value: number
    onDec: () => void
    onInc: () => void
  }) => (
    <div className="flex items-center justify-between py-4 border-b" style={{ borderColor: 'rgba(232,226,210,0.1)' }}>
      <div>
        <p className="font-sans text-sm" style={{ color: C.bone }}>
          {label}
        </p>
        {sublabel && (
          <p className="font-sans text-xs mt-0.5" style={{ color: C.ember }}>
            {sublabel}
          </p>
        )}
      </div>
      <div className="flex items-center gap-0">
        <button
          onClick={onDec}
          className="flex items-center justify-center rounded-l-lg text-lg font-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99A3E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0D]"
          style={{
            width: 44,
            height: 44,
            background: 'rgba(232,226,210,0.06)',
            color: value === 0 ? 'rgba(232,226,210,0.45)' : C.bone,
            border: '1px solid rgba(232,226,210,0.1)',
            borderRight: 'none',
            cursor: value === 0 ? 'default' : 'pointer',
          }}
          aria-label={`Decrease ${label}`}
          disabled={value === 0}
        >
          -
        </button>
        <div
          className="flex items-center justify-center font-marcellus text-lg"
          style={{
            width: 44,
            height: 44,
            background: 'rgba(232,226,210,0.06)',
            color: C.bone,
            border: '1px solid rgba(232,226,210,0.1)',
            borderLeft: 'none',
            borderRight: 'none',
          }}
          aria-live="polite"
          aria-label={`${value} ${label}`}
        >
          {value}
        </div>
        <button
          onClick={onInc}
          className="flex items-center justify-center rounded-r-lg text-lg font-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99A3E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0D]"
          style={{
            width: 44,
            height: 44,
            background: 'rgba(232,226,210,0.06)',
            color: C.bone,
            border: '1px solid rgba(232,226,210,0.1)',
            borderLeft: 'none',
            cursor: 'pointer',
          }}
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  )

  return (
    <div
      className="rounded-2xl p-6 md:p-8"
      style={{ background: 'rgba(21,20,15,0.92)', border: '1px solid rgba(232,226,210,0.1)' }}
    >
      {/* Date */}
      <div className="mb-5">
        <label className="block font-mono text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: C.amber }}>
          Date
        </label>
        <input
          type="date"
          value={date}
          min={defaultDate}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg px-4 py-3 font-sans text-sm outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99A3E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0D]"
          style={{
            background: 'rgba(232,226,210,0.06)',
            border: '1px solid rgba(232,226,210,0.18)',
            color: C.bone,
            colorScheme: 'dark',
          }}
          aria-label="Tour date"
        />
      </div>

      {/* Time */}
      <div className="mb-6">
        <label className="block font-mono text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: C.amber }}>
          Tour time
        </label>
        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full rounded-lg px-4 py-3 font-sans text-sm outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99A3E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0D]"
          style={{
            background: 'rgba(232,226,210,0.06)',
            border: '1px solid rgba(232,226,210,0.18)',
            color: C.bone,
            colorScheme: 'dark',
          }}
          aria-label="Tour time"
        >
          {BOOKING.tourTimes.map((t) => (
            <option key={t} value={t} style={{ background: C.stone, color: C.bone }}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Guests */}
      <div className="mb-1">
        <p className="font-mono text-[11px] tracking-[0.2em] uppercase mb-1" style={{ color: C.amber }}>
          Guests
        </p>
      </div>
      <Stepper
        label="Adults"
        sublabel={`6.950 kr. each`}
        value={adults}
        onDec={() => setAdults((a) => Math.max(1, a - 1))}
        onInc={() => setAdults((a) => Math.min(20, a + 1))}
      />
      <Stepper
        label="Children (6-15)"
        sublabel="2.850 kr. each"
        value={children}
        onDec={() => setChildren((c) => Math.max(0, c - 1))}
        onInc={() => setChildren((c) => Math.min(20, c + 1))}
      />

      {/* Family note */}
      {adults === 2 && children === 2 && (
        <p
          className="mt-3 font-mono text-[11px] tracking-wide"
          style={{ color: C.amber }}
          aria-live="polite"
        >
          Family rate applied (2 adults + 2 children)
        </p>
      )}

      {/* Total */}
      <div
        className="mt-6 flex items-baseline justify-between py-4 border-t border-b"
        style={{ borderColor: 'rgba(232,226,210,0.12)' }}
      >
        <span className="font-sans text-sm" style={{ color: C.boneLight }}>
          Estimated total
        </span>
        <span className="font-marcellus text-2xl" style={{ color: C.bone }}>
          {formatKr(total)}
        </span>
      </div>

      {/* CTA */}
      <a
        href={buildMailto()}
        className="mt-6 flex w-full items-center justify-center rounded-xl py-4 font-sans text-sm font-semibold tracking-wide transition-opacity hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99A3E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0D]"
        style={{
          background: C.amber,
          color: '#0B0B0D',
          letterSpacing: '0.04em',
        }}
        aria-label="Request cave tour booking by email"
      >
        {BOOKING.cta}
      </a>

      <p className="mt-3 text-center font-sans text-xs" style={{ color: 'rgba(232,226,210,0.62)' }}>
        {BOOKING.note}
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------
export default function CavesOfHellaPage() {
  const reduce = useReducedMotion() ?? false

  useEffect(() => {
    document.title = 'Caves of Hella · Iceland’s Hidden World'
    setThemeColor('#0B0B0D')
  }, [])

  // Candle flicker animation for hero — CSS keyframe, gated behind reduce
  const flickerStyle = reduce
    ? {}
    : {
        animation: 'candleFlicker 3.8s ease-in-out infinite alternate',
      }

  return (
    <div style={{ background: C.canvas, color: C.bone, fontFamily: 'inherit' }}>
      {/* Candle flicker keyframes */}
      <style>{`
        @keyframes candleFlicker {
          0%   { opacity: 0.38; transform: scale(1.00) translate(0px, 0px); }
          18%  { opacity: 0.44; transform: scale(1.02) translate(1px, -1px); }
          36%  { opacity: 0.36; transform: scale(0.98) translate(-1px, 1px); }
          54%  { opacity: 0.42; transform: scale(1.01) translate(1px, 0px); }
          72%  { opacity: 0.35; transform: scale(0.99) translate(-1px, -1px); }
          100% { opacity: 0.40; transform: scale(1.00) translate(0px, 0px); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes candleFlicker { 0%, 100% { opacity: 0.38; } }
        }
      `}</style>

      <PreviewChrome company={company} />

      {/* ================================================================
          SECTION 1: HERO
          Full-bleed, opacity:1 immediately — no entrance animation gates it
          ================================================================ */}
      <section
        id="top"
        className="relative min-h-[100dvh] flex flex-col justify-end overflow-hidden"
        style={{ background: C.canvas }}
        aria-label="Hero"
      >
        {/* Hero image */}
        <Img
          src={IMAGES.hero}
          alt="A shaft of light entering through the carved mouth of a cave at Aegissida, Hella"
          className="absolute inset-0 h-full w-full object-cover object-center"
          fallbackClassName="absolute inset-0 bg-gradient-to-b from-[#2a1f10] via-[#15120a] to-[#0b0b0d]"
          fetchpriority="high"
        />

        {/* Deep veil gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(11,11,13,0.12) 0%, rgba(11,11,13,0.35) 40%, rgba(11,11,13,0.82) 75%, rgba(11,11,13,0.98) 100%)',
          }}
        />

        {/* Candle glow — infinite, reduced-motion gated */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 52% 36% at 50% 38%, rgba(201,134,47,0.32) 0%, rgba(154,91,30,0.12) 45%, transparent 72%)',
            ...flickerStyle,
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 px-6 pb-16 pt-32 md:px-12 md:pb-20 lg:px-20 lg:pb-24 max-w-7xl">
          {/* Eyebrow */}
          <p
            className="font-mono text-[11px] tracking-[0.26em] uppercase mb-6"
            style={{ color: C.amber }}
          >
            {HERO.eyebrow}
          </p>

          {/* H1 */}
          <h1
            className="font-marcellus text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.06] mb-6"
            style={{ color: C.bone, maxWidth: '14ch' }}
          >
            {HERO.h1}
          </h1>

          {/* Sub */}
          <p
            className="font-sans text-base md:text-lg leading-relaxed mb-8"
            style={{ color: 'rgba(232,226,210,0.72)', maxWidth: '42ch' }}
          >
            {HERO.sub}
          </p>

          {/* CTA + times row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <a
              href={HERO.ctaHref}
              className="inline-flex items-center rounded-xl px-8 py-3.5 font-sans text-sm font-semibold tracking-wide transition-opacity hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99A3E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0D]"
              style={{ background: C.amber, color: '#0B0B0D' }}
            >
              {HERO.cta}
            </a>

            {/* Tour time chips */}
            <div className="flex flex-wrap gap-2" aria-label="Daily tour times">
              {HERO.times.map((t) => (
                <span
                  key={t}
                  className="font-mono text-[12px] rounded-full px-3 py-1.5"
                  style={{
                    border: `1px solid rgba(217,154,62,0.4)`,
                    color: C.amber,
                    background: 'rgba(217,154,62,0.07)',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Meta line */}
          <p className="font-sans text-xs" style={{ color: 'rgba(232,226,210,0.62)', letterSpacing: '0.04em' }}>
            {HERO.meta}
          </p>
        </div>
      </section>

      {/* ================================================================
          SECTION 2: THE DESCENT (sticky scroll signature + spacer)
          ================================================================ */}
      <div style={{ position: 'relative' }}>
        <DescentSection />
        <DescentSpacer />
      </div>

      {/* ================================================================
          SECTION 3: THE MYSTERY
          ================================================================ */}
      <section
        id="mystery"
        className="relative py-24 md:py-32 lg:py-40 px-6 md:px-12 lg:px-20"
        style={{ background: C.stone }}
        aria-label="The mystery"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left: text */}
            <div>
              <Reveal>
                <h2
                  className="font-marcellus text-3xl md:text-4xl lg:text-5xl leading-[1.12] mb-8"
                  style={{ color: C.bone }}
                >
                  {MYSTERY.heading}
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="font-sans text-base leading-relaxed mb-5" style={{ color: C.boneLight }}>
                  {MYSTERY.lead}
                </p>
              </Reveal>
              {MYSTERY.body.map((para, i) => (
                <Reveal key={i} delay={0.12 + i * 0.06}>
                  <p className="font-sans text-sm leading-relaxed mb-5" style={{ color: 'rgba(232,226,210,0.62)' }}>
                    {para}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* Right: cross detail image */}
            <Reveal delay={0.18}>
              <div className="relative">
                <Img
                  src={IMAGES.crossDetail}
                  alt="A carved Latin cross in the basalt wall of Kirkjuhellir, Caves of Hella"
                  className="w-full rounded-2xl object-cover"
                  fallbackClassName="w-full rounded-2xl bg-gradient-to-b from-[#1a1813] to-[#0b0b0d]"
                  style={{ aspectRatio: '4/5', maxHeight: '520px' }}
                />
                <p
                  className="mt-3 font-mono text-[11px] tracking-wide"
                  style={{ color: C.ember }}
                >
                  {MYSTERY.imageCaption}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 4: THE CAVES
          Broken grid, not uniform cards
          ================================================================ */}
      <section
        id="caves"
        className="relative py-24 md:py-32 px-6 md:px-12 lg:px-20"
        style={{ background: C.canvas }}
        aria-label="The caves"
      >
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2
              className="font-marcellus text-3xl md:text-4xl lg:text-5xl mb-4"
              style={{ color: C.bone }}
            >
              Inside the caves
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="font-sans text-sm mb-16" style={{ color: 'rgba(232,226,210,0.62)', maxWidth: '52ch' }}>
              {CAVES_NOTE}
            </p>
          </Reveal>

          {/* Cave 1 — full width feature */}
          <Reveal>
            <div className="mb-8 grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(232,226,210,0.07)' }}>
              <div className="lg:col-span-3 relative" style={{ minHeight: 320 }}>
                <Img
                  src={CAVES[0].img}
                  alt={CAVES[0].alt}
                  className="absolute inset-0 w-full h-full object-cover"
                  fallbackClassName="absolute inset-0 bg-gradient-to-br from-[#1a1813] to-[#0b0b0d]"
                />
              </div>
              <div
                className="lg:col-span-2 flex flex-col justify-center p-8 md:p-10"
                style={{ background: 'rgba(21,20,15,0.98)' }}
              >
                <p className="font-mono text-[11px] tracking-[0.22em] uppercase mb-3" style={{ color: C.amber }}>
                  {CAVES[0].nameEn}
                </p>
                <h3 className="font-marcellus text-2xl md:text-3xl mb-4" style={{ color: C.bone }}>
                  {CAVES[0].nameIs}
                </h3>
                <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(232,226,210,0.62)' }}>
                  {CAVES[0].tagline}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Caves 2 & 3 — side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {CAVES.slice(1, 3).map((cave, i) => (
              <Reveal key={cave.nameIs} delay={i * 0.1}>
                <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(232,226,210,0.07)' }}>
                  <div className="relative" style={{ aspectRatio: '16/10' }}>
                    <Img
                      src={cave.img}
                      alt={cave.alt}
                      className="absolute inset-0 w-full h-full object-cover"
                      fallbackClassName="absolute inset-0 bg-gradient-to-b from-[#1a1813] to-[#0b0b0d]"
                    />
                  </div>
                  <div className="p-6" style={{ background: 'rgba(21,20,15,0.98)' }}>
                    <p className="font-mono text-[11px] tracking-[0.22em] uppercase mb-2" style={{ color: C.amber }}>
                      {cave.nameEn}
                    </p>
                    <h3 className="font-marcellus text-xl mb-2" style={{ color: C.bone }}>
                      {cave.nameIs}
                    </h3>
                    {cave.note && (
                      <p className="font-mono text-[10px] tracking-wide mb-2" style={{ color: C.amberDeep }}>
                        {cave.note}
                      </p>
                    )}
                    <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(232,226,210,0.62)' }}>
                      {cave.tagline}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Cave 4 — offset right strip */}
          <Reveal>
            <div
              className="ml-0 md:ml-auto md:w-4/5 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
              style={{ border: '1px solid rgba(232,226,210,0.07)' }}
            >
              <div className="p-8 flex flex-col justify-center order-2 md:order-1" style={{ background: 'rgba(21,20,15,0.98)' }}>
                <p className="font-mono text-[11px] tracking-[0.22em] uppercase mb-3" style={{ color: C.amber }}>
                  {CAVES[3].nameEn}
                </p>
                <h3 className="font-marcellus text-2xl mb-3" style={{ color: C.bone }}>
                  {CAVES[3].nameIs}
                </h3>
                <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(232,226,210,0.62)' }}>
                  {CAVES[3].tagline}
                </p>
              </div>
              <div className="relative order-1 md:order-2" style={{ minHeight: 240 }}>
                <Img
                  src={CAVES[3].img}
                  alt={CAVES[3].alt}
                  className="absolute inset-0 w-full h-full object-cover"
                  fallbackClassName="absolute inset-0 bg-gradient-to-b from-[#1a1813] to-[#0b0b0d]"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================================================================
          SECTION 5: THE EXPERIENCE
          ================================================================ */}
      <section
        id="experience"
        className="relative py-24 md:py-32 px-6 md:px-12 lg:px-20"
        style={{ background: C.stone }}
        aria-label="The experience"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: candlelight image stack */}
          <div className="grid grid-cols-2 gap-4">
            <Reveal>
              <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '3/4' }}>
                <Img
                  src={IMAGES.candlelight}
                  alt="Candlelight illuminating the carved stone walls inside a cave at Hella"
                  className="absolute inset-0 w-full h-full object-cover"
                  fallbackClassName="absolute inset-0 bg-gradient-to-b from-[#1a1410] to-[#0b0b0d]"
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative rounded-2xl overflow-hidden mt-8" style={{ aspectRatio: '3/4' }}>
                <Img
                  src={IMAGES.seatDetail}
                  alt="A carved stone seat inside one of the Hella caves, worn smooth by centuries"
                  className="absolute inset-0 w-full h-full object-cover"
                  fallbackClassName="absolute inset-0 bg-gradient-to-b from-[#1a1813] to-[#0b0b0d]"
                />
              </div>
            </Reveal>
          </div>

          {/* Right: content */}
          <div>
            <Reveal>
              <h2
                className="font-marcellus text-3xl md:text-4xl lg:text-5xl mb-6 leading-[1.12]"
                style={{ color: C.bone }}
              >
                {EXPERIENCE.heading}
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="font-sans text-base leading-relaxed mb-10" style={{ color: C.boneLight }}>
                {EXPERIENCE.lead}
              </p>
            </Reveal>

            <ul className="space-y-0" role="list">
              {EXPERIENCE.bullets.map((b, i) => (
                <Reveal key={i} delay={0.1 + i * 0.05}>
                  <li
                    className="flex items-start gap-4 py-4 border-b"
                    style={{ borderColor: 'rgba(232,226,210,0.08)' }}
                  >
                    <span
                      className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full"
                      style={{ background: C.amber, marginTop: 8 }}
                      aria-hidden="true"
                    />
                    <span className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(232,226,210,0.72)' }}>
                      {b}
                    </span>
                  </li>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.3}>
              <div className="mt-8 flex gap-6">
                <div>
                  <p className="font-mono text-[11px] tracking-[0.2em] uppercase mb-1" style={{ color: C.ember }}>
                    Duration
                  </p>
                  <p className="font-marcellus text-lg" style={{ color: C.bone }}>
                    {EXPERIENCE.duration}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[11px] tracking-[0.2em] uppercase mb-1" style={{ color: C.ember }}>
                    Language
                  </p>
                  <p className="font-marcellus text-lg" style={{ color: C.bone }}>
                    {EXPERIENCE.language}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 6: TOURS & PRICES
          ================================================================ */}
      <section
        id="prices"
        className="relative py-24 md:py-32 px-6 md:px-12 lg:px-20"
        style={{ background: C.canvas }}
        aria-label="Tours and prices"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: standard prices */}
            <div>
              <Reveal>
                <h2
                  className="font-marcellus text-3xl md:text-4xl lg:text-5xl mb-10 leading-[1.12]"
                  style={{ color: C.bone }}
                >
                  Tours &amp; prices
                </h2>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="mb-10">
                  {PRICES.map((p) => (
                    <PriceCard key={p.label} {...p} />
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.12}>
                <div
                  className="rounded-xl p-5"
                  style={{
                    background: 'rgba(217,154,62,0.07)',
                    border: '1px solid rgba(217,154,62,0.2)',
                  }}
                >
                  <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-2" style={{ color: C.amber }}>
                    Under 6
                  </p>
                  <p className="font-sans text-sm" style={{ color: C.boneLight }}>
                    Children under 6 join for free. The caves are low and the passages narrow in places; children must be comfortable in enclosed spaces.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Right: special tours */}
            <div>
              <Reveal delay={0.06}>
                <h3
                  className="font-marcellus text-2xl mb-8 pt-2"
                  style={{ color: C.bone }}
                >
                  Special experiences
                </h3>
              </Reveal>
              <div className="space-y-0">
                {SPECIAL_TOURS.map((s, i) => (
                  <Reveal key={s.t} delay={0.1 + i * 0.06}>
                    <div
                      className="py-5 border-b"
                      style={{ borderColor: 'rgba(232,226,210,0.08)' }}
                    >
                      <p className="font-marcellus text-lg mb-1" style={{ color: C.bone }}>
                        {s.t}
                      </p>
                      <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(232,226,210,0.55)' }}>
                        {s.d}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 7: BOOKING
          ================================================================ */}
      <section
        id="booking"
        className="relative pt-24 pb-32 md:py-32 px-6 md:px-12 lg:px-20"
        style={{ background: C.stone }}
        aria-label="Book a tour"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: heading + exterior image */}
          <div>
            <Reveal>
              <h2
                className="font-marcellus text-3xl md:text-4xl lg:text-5xl mb-4 leading-[1.1]"
                style={{ color: C.bone }}
              >
                {BOOKING.heading}
              </h2>
            </Reveal>
            <Reveal delay={0.07}>
              <p className="font-sans text-base leading-relaxed mb-10" style={{ color: 'rgba(232,226,210,0.62)' }}>
                {BOOKING.sub}
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <Img
                  src={IMAGES.exterior}
                  alt="The entrance to the cave cluster at Aegissida on a clear South Iceland day"
                  className="absolute inset-0 w-full h-full object-cover"
                  fallbackClassName="absolute inset-0 bg-gradient-to-b from-[#1a1813] to-[#0b0b0d]"
                />
              </div>
            </Reveal>
          </div>

          {/* Right: booking panel */}
          <Reveal delay={0.1}>
            <BookingPanel />
          </Reveal>
        </div>
      </section>

      {/* ================================================================
          SECTION 8: REVIEWS
          ================================================================ */}
      <section
        id="reviews"
        className="relative py-24 md:py-32 px-6 md:px-12 lg:px-20"
        style={{ background: C.canvas }}
        aria-label="Guest reviews"
      >
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2
              className="font-marcellus text-3xl md:text-4xl mb-12"
              style={{ color: C.bone }}
            >
              In their words
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REVIEWS.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.08}>
                <blockquote
                  className="flex flex-col h-full rounded-2xl p-7"
                  style={{
                    background: 'rgba(21,20,15,0.9)',
                    border: '1px solid rgba(232,226,210,0.07)',
                  }}
                >
                  <svg
                    aria-hidden="true"
                    width="24"
                    height="18"
                    viewBox="0 0 24 18"
                    fill="none"
                    className="mb-4 shrink-0"
                  >
                    <path
                      d="M0 18V10.8C0 4.56 3.12 1.2 9.36 0L10.56 1.92C7.44 2.64 5.52 4.56 4.8 7.2H8.4V18H0ZM13.68 18V10.8C13.68 4.56 16.8 1.2 23.04 0L24 1.92C20.88 2.64 18.96 4.56 18.24 7.2H21.84V18H13.68Z"
                      fill={C.amber}
                      fillOpacity="0.4"
                    />
                  </svg>
                  <p
                    className="font-sans text-sm leading-relaxed flex-1 mb-5"
                    style={{ color: 'rgba(232,226,210,0.7)' }}
                  >
                    {r.body}
                  </p>
                  <footer>
                    <p className="font-marcellus text-base" style={{ color: C.bone }}>
                      {r.name}
                    </p>
                    <p className="font-mono text-[11px] tracking-wide mt-0.5" style={{ color: C.ember }}>
                      {r.from}
                    </p>
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 9: PLAN YOUR VISIT
          ================================================================ */}
      <section
        id="visit"
        className="relative py-24 md:py-32 px-6 md:px-12 lg:px-20"
        style={{ background: C.stone }}
        aria-label="Plan your visit"
      >
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2
              className="font-marcellus text-3xl md:text-4xl lg:text-5xl mb-14"
              style={{ color: C.bone }}
            >
              {VISIT.heading}
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
            {/* Getting there */}
            <Reveal delay={0.06}>
              <div>
                <p className="font-mono text-[11px] tracking-[0.22em] uppercase mb-5" style={{ color: C.amber }}>
                  Getting there
                </p>
                <p className="font-marcellus text-xl mb-1" style={{ color: C.bone }}>
                  {VISIT.address}
                </p>
                <p className="font-sans text-sm mb-2" style={{ color: C.boneLight }}>
                  {VISIT.addressNote}
                </p>
                <p className="font-sans text-sm mb-1" style={{ color: 'rgba(232,226,210,0.6)' }}>
                  {VISIT.fromReykjavik}
                </p>
                <p className="font-sans text-sm mb-6" style={{ color: 'rgba(232,226,210,0.6)' }}>
                  {VISIT.parking}
                </p>
                <a
                  href={VISIT.mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-sans text-sm font-medium transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99A3E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0D]"
                  style={{
                    background: 'rgba(232,226,210,0.08)',
                    border: '1px solid rgba(232,226,210,0.14)',
                    color: C.bone,
                  }}
                  aria-label="Open Caves of Hella on Google Maps"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                      fill={C.amber}
                    />
                  </svg>
                  Open in Maps
                </a>
              </div>
            </Reveal>

            {/* Contact */}
            <Reveal delay={0.1}>
              <div>
                <p className="font-mono text-[11px] tracking-[0.22em] uppercase mb-5" style={{ color: C.amber }}>
                  Contact
                </p>
                <a
                  href={VISIT.phoneHref}
                  className="block font-marcellus text-xl mb-2 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99A3E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0D]"
                  style={{ color: C.bone }}
                  aria-label="Call Caves of Hella"
                >
                  {VISIT.phone}
                </a>
                <a
                  href={`mailto:${VISIT.email}`}
                  className="block font-sans text-sm transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99A3E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0D]"
                  style={{ color: 'rgba(232,226,210,0.6)' }}
                  aria-label="Email Caves of Hella"
                >
                  {VISIT.email}
                </a>
              </div>
            </Reveal>

            {/* Final CTA */}
            <Reveal delay={0.14}>
              <div className="flex flex-col justify-end lg:text-right">
                <p
                  className="font-marcellus text-xl md:text-2xl mb-6 leading-snug"
                  style={{ color: C.bone }}
                >
                  A thousand years of carved silence, an hour below the surface.
                </p>
                <a
                  href="#booking"
                  className="inline-flex items-center justify-center rounded-xl px-8 py-4 font-sans text-sm font-semibold tracking-wide transition-opacity hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99A3E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0D]"
                  style={{ background: C.amber, color: '#0B0B0D' }}
                >
                  Book a tour
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mobile sticky CTA bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden px-4 pb-4 pt-3"
        style={{ background: 'linear-gradient(to top, rgba(11,11,13,0.98) 80%, transparent)' }}
        aria-label="Mobile booking bar"
      >
        <a
          href="#booking"
          className="flex w-full items-center justify-center rounded-xl py-4 font-sans text-sm font-semibold tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99A3E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0D]"
          style={{ background: C.amber, color: '#0B0B0D' }}
        >
          Book a tour
        </a>
      </div>

      <PreviewFooter company={company} />
    </div>
  )
}
