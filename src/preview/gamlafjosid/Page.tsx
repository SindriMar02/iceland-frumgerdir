/**
 * Gamla Fjósið — "Eldur, gras og nautakjöt"
 * Creative direction: warm-editorial farm-to-plate, volcano setting, own-farm beef.
 * Signature: SVG provenance-trail path that draws on scroll (synchronous passive listener).
 */

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Img } from '../../components/Img'
import { Reveal } from '../../components/Reveal'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { getPreviewCompany } from '../companies'
import { setThemeColor } from '../../lib/preview'
import CircularGallery from '../../components/CircularGallery'
import { IMAGES, MENU, MENU_GALLERY, PROVENANCE, QUOTES, TIME_SLOTS } from './data'

const company = getPreviewCompany('gamlafjosid')

// ─── PALETTE ────────────────────────────────────────────────────────────────
const CREAM   = '#F3ECDD'
const ESPRESSO = '#241A12'
const DARK_WOOD = '#1A120C'
const EMBER     = '#C2410C'
const EMBER_CTA = '#9A3F12'
const EMBER_TEXT = '#9A3F12'
const PASTURE = '#4A5D3A'

// ─── NAV ────────────────────────────────────────────────────────────────────
function Nav({ showBar }: { showBar: boolean }) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      style={{
        background: showBar ? `${ESPRESSO}f2` : 'transparent',
        backdropFilter: showBar ? 'blur(12px)' : 'none',
        borderBottom: showBar ? `1px solid rgba(243,236,221,0.1)` : 'none',
      }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <a
          href="#top"
          className="font-bitter text-lg font-bold tracking-tight"
          style={{ color: CREAM }}
        >
          Gamla Fjósið
          <span
            className="ml-2 font-mono text-[10px] font-normal tracking-[0.18em] uppercase"
            style={{ color: `${CREAM}80` }}
          >
            síðan 1999
          </span>
        </a>
        <div className="flex items-center gap-4 md:gap-6">
          <a
            href="#menu"
            className="hidden text-sm font-medium transition-colors hover:opacity-80 md:inline"
            style={{ color: `${CREAM}cc` }}
          >
            Menu
          </a>
          <a
            href="#visit"
            className="hidden text-sm font-medium transition-colors hover:opacity-80 sm:inline"
            style={{ color: `${CREAM}cc` }}
          >
            Hours
          </a>
          <a
            href="#book"
            className="rounded-full px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5"
            style={{ background: EMBER_CTA, color: CREAM }}
          >
            Book a table
          </a>
        </div>
      </nav>
    </header>
  )
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] items-end overflow-hidden"
    >
      {/* Hero image - opacity:1 immediately, no framer gate */}
      <Img
        src={IMAGES.hero}
        alt="Gamla Fjosid restaurant in the converted cowshed with Eyjafjallajokull in the background"
        fetchpriority="high"
        className="absolute inset-0 h-full w-full object-cover"
        fallbackClassName="absolute inset-0 bg-gradient-to-br from-[#3d2510] via-[#241a12] to-[#0f0a06]"
      />

      {/* Warm scrim - rich from bottom, subtle at top */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, ${DARK_WOOD}f0 0%, ${DARK_WOOD}80 35%, ${DARK_WOOD}20 70%, transparent 100%)`,
        }}
      />

      {/* Hero content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-20 md:px-8 md:pb-28">
        <p
          className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] mb-5"
          style={{ color: `${CREAM}99` }}
        >
          Gamla Fjósið &middot; undir Eyjafjöllum &middot; síðan 1999
        </p>
        <h1
          className="font-bitter text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl"
          style={{ color: CREAM }}
        >
          Beef raised<br />
          under a volcano.
        </h1>
        <p
          className="mt-5 max-w-md text-base leading-relaxed md:text-lg"
          style={{ color: `${CREAM}cc` }}
        >
          Own-farm free-range beef, garden vegetables, and bread baked every morning.
          A working farm in South Iceland since 1999.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#book"
            className="inline-block rounded-full px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: EMBER_CTA, color: CREAM }}
          >
            Book a table
          </a>
          <a
            href="#menu"
            className="inline-block rounded-full border px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5"
            style={{
              borderColor: `${CREAM}50`,
              color: CREAM,
              background: 'rgba(243,236,221,0.08)',
            }}
          >
            See the menu
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── STORY BAND ──────────────────────────────────────────────────────────────
function StoryBand() {
  return (
    <section
      className="py-20 md:py-28"
      style={{ background: ESPRESSO }}
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
          {/* Left: text */}
          <div className="flex flex-col justify-center">
            <Reveal>
              <h2
                className="font-bitter text-3xl font-bold leading-tight md:text-4xl lg:text-5xl"
                style={{ color: CREAM }}
              >
                A farm that feeds its own restaurant.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p
                className="mt-6 text-base leading-relaxed md:text-lg"
                style={{ color: `${CREAM}cc` }}
              >
                Hvassafell farm sits directly beneath Eyjafjallajökull, the volcano that
                brought the world's attention to South Iceland in 2010. The restaurant
                opened in 1999 in a converted cowshed on that same land, with the same family,
                raising their own cattle in the fields you can see from the window.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p
                className="mt-4 text-base leading-relaxed md:text-lg"
                style={{ color: `${CREAM}cc` }}
              >
                The food is direct: own-farm free-range beef, salads from the kitchen garden,
                and sourdough bread baked fresh each morning. Nothing processed. Nothing
                imported when it can be grown or raised here.
              </p>
            </Reveal>
          </div>

          {/* Right: two stacked images */}
          <div className="grid grid-cols-2 gap-3">
            <Reveal className="col-span-2" delay={0.05}>
              <Img
                src={IMAGES.cattle}
                alt="Free-range cattle on the Hvassafell farm under Eyjafjallajokull"
                className="h-52 w-full rounded-2xl object-cover md:h-64"
                fallbackClassName="h-52 w-full rounded-2xl md:h-64 bg-gradient-to-br from-[#4a5d3a] to-[#2e3d22]"
              />
            </Reveal>
            <Reveal delay={0.12}>
              <Img
                src={IMAGES.interior}
                alt="The warm interior of the old cowshed restaurant"
                className="h-36 w-full rounded-2xl object-cover md:h-48"
                fallbackClassName="h-36 w-full rounded-2xl md:h-48 bg-gradient-to-br from-[#5c3018] to-[#241a12]"
              />
            </Reveal>
            <Reveal delay={0.18}>
              <Img
                src={IMAGES.bread}
                alt="Fresh sourdough bread baked daily at Gamla Fjosid"
                className="h-36 w-full rounded-2xl object-cover md:h-48"
                fallbackClassName="h-36 w-full rounded-2xl md:h-48 bg-gradient-to-br from-[#c49a6c] to-[#8a6340]"
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── PROVENANCE TRAIL ────────────────────────────────────────────────────────
// SVG line draws as you scroll - synchronous passive listener, no Framer useScroll
function ProvenanceTrail() {
  const reduce = useReducedMotion()
  const sectionRef  = useRef<HTMLDivElement>(null)
  const pathRef     = useRef<SVGPathElement>(null)
  const [activeIdx, setActiveIdx] = useState(-1)

  useEffect(() => {
    const path = pathRef.current
    const section = sectionRef.current
    if (!path || !section || reduce) {
      setActiveIdx(PROVENANCE.length - 1)
      return
    }

    const total = path.getTotalLength()
    // Start: fully hidden
    path.style.strokeDasharray = `${total}`
    path.style.strokeDashoffset = `${total}`

    const onScroll = () => {
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      // Progress: 0 when top of section hits bottom of viewport, 1 when bottom of section hits top
      const progress = Math.min(1, Math.max(0, (-rect.top) / (rect.height - vh * 0.5)))
      path.style.strokeDashoffset = `${total * (1 - progress)}`

      // Activate stages progressively
      const idx = Math.floor(progress * PROVENANCE.length) - 1
      setActiveIdx(Math.min(PROVENANCE.length - 1, Math.max(-1, idx)))
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reduce])

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32"
      style={{ background: CREAM }}
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <h2
            className="font-bitter text-3xl font-bold leading-tight md:text-4xl lg:text-5xl"
            style={{ color: ESPRESSO }}
          >
            From pasture to plate,<br />no detours.
          </h2>
        </Reveal>

        {/* SVG connecting line (desktop) */}
        <div className="relative mt-16 hidden md:block">
          <svg
            viewBox="0 0 900 120"
            preserveAspectRatio="none"
            className="absolute top-20 left-0 right-0 h-20 w-full pointer-events-none"
            aria-hidden="true"
          >
            <path
              ref={pathRef}
              d="M 100 60 C 250 20, 400 100, 550 60 C 700 20, 800 80, 850 60"
              fill="none"
              stroke={EMBER}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Four stages in a row */}
          <div className="grid grid-cols-4 gap-6">
            {PROVENANCE.map((stage, i) => (
              <div
                key={stage.id}
                className="flex flex-col items-center text-center transition-all duration-500"
                style={{ opacity: activeIdx >= i ? 1 : 0.3 }}
              >
                <div className="relative h-48 w-full overflow-hidden rounded-2xl">
                  <Img
                    src={stage.img}
                    alt={stage.alt}
                    className="h-full w-full object-cover transition-transform duration-700"
                    fallbackClassName={`h-full w-full ${stage.fallback}`}
                    style={{ transform: activeIdx >= i ? 'scale(1)' : 'scale(1.06)' }}
                  />
                  <div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: `linear-gradient(to top, ${DARK_WOOD}80, transparent)`,
                      opacity: activeIdx >= i ? 1 : 0,
                      transition: 'opacity 0.5s',
                    }}
                  />
                </div>
                <div
                  className="mt-1 h-5 w-0.5 transition-all duration-500"
                  style={{
                    background: EMBER,
                    opacity: activeIdx >= i ? 1 : 0,
                  }}
                />
                <span
                  className="font-bitter text-lg font-bold mt-2"
                  style={{ color: activeIdx >= i ? ESPRESSO : `${ESPRESSO}50` }}
                >
                  {stage.label}
                </span>
                <p
                  className="mt-1.5 text-sm leading-snug max-w-[160px]"
                  style={{ color: `${ESPRESSO}cc` }}
                >
                  {stage.caption}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical stacked */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:hidden">
          {PROVENANCE.map((stage, i) => (
            <Reveal key={stage.id} delay={i * 0.1}>
              <div className="flex gap-4 items-start">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                  <Img
                    src={stage.img}
                    alt={stage.alt}
                    className="h-full w-full object-cover"
                    fallbackClassName={`h-full w-full ${stage.fallback}`}
                  />
                </div>
                <div>
                  <span className="font-bitter text-base font-bold" style={{ color: ESPRESSO }}>
                    {stage.label}
                  </span>
                  <p className="mt-1 text-sm leading-snug" style={{ color: `${ESPRESSO}cc` }}>
                    {stage.caption}
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

// ─── VOLCANO SOUP FEATURE ────────────────────────────────────────────────────
function VolcanoSoup() {
  const reduce = useReducedMotion()

  return (
    <section
      className="relative overflow-hidden py-0"
      style={{ background: DARK_WOOD }}
    >
      <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16 items-center">
          {/* Image with steam effect */}
          <Reveal>
            <div className="relative h-72 overflow-hidden rounded-3xl md:h-[480px]">
              <Img
                src={IMAGES.soup}
                alt="Eldfjallasupa - the Volcano Soup, a rich beef and vegetable soup"
                className="h-full w-full object-cover"
                fallbackClassName="h-full w-full bg-gradient-to-br from-[#5c2010] to-[#1a0a04]"
              />
              {/* Warm ember glow overlay */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 50% 80%, ${EMBER}30 0%, transparent 65%)`,
                }}
              />
              {/* Steam particles - CSS only, reduced-motion safe */}
              {!reduce && (
                <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none overflow-hidden rounded-b-3xl">
                  <style>{`
                    @keyframes steamRise {
                      0%   { transform: translateY(0) translateX(0) scaleX(1); opacity: 0.7; }
                      50%  { transform: translateY(-50px) translateX(8px) scaleX(1.2); opacity: 0.4; }
                      100% { transform: translateY(-100px) translateX(-4px) scaleX(0.8); opacity: 0; }
                    }
                    @media (prefers-reduced-motion: reduce) {
                      .steam-thread { display: none; }
                    }
                  `}</style>
                  {[
                    { left: '30%', delay: '0s',    dur: '2.8s' },
                    { left: '50%', delay: '0.9s',  dur: '3.2s' },
                    { left: '68%', delay: '1.7s',  dur: '2.5s' },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className="steam-thread absolute bottom-4 w-1 rounded-full"
                      style={{
                        left: s.left,
                        height: '64px',
                        background: `linear-gradient(to top, ${CREAM}60, transparent)`,
                        animation: `steamRise ${s.dur} ${s.delay} ease-out infinite`,
                        filter: 'blur(3px)',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          {/* Text */}
          <div>
            <Reveal delay={0.1}>
              <h2
                className="font-bitter text-4xl font-bold italic leading-tight md:text-5xl lg:text-6xl"
                style={{ color: CREAM }}
              >
                Eldfjallasúpa
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p
                className="mt-2 font-mono text-sm tracking-[0.14em] uppercase"
                style={{ color: '#E8915C' }}
              >
                The Volcano Soup
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p
                className="mt-6 text-base leading-relaxed md:text-lg"
                style={{ color: `${CREAM}cc` }}
              >
                A hearty beef and vegetable soup that people drive out to South Iceland for.
                Made with stock from own-farm beef, vegetables from the kitchen garden, and
                served with fresh-baked bread. The soup that started it all.
              </p>
            </Reveal>
            <Reveal delay={0.28}>
              <div
                className="mt-8 inline-flex items-baseline gap-3 rounded-2xl px-6 py-4"
                style={{ background: `${CREAM}10`, border: `1px solid ${CREAM}18` }}
              >
                <span className="font-bitter text-3xl font-bold" style={{ color: CREAM }}>
                  3.490 kr.
                </span>
                <span className="text-sm" style={{ color: `${CREAM}70` }}>
                  with bread basket
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.34}>
              <a
                href="#book"
                className="mt-6 inline-block rounded-full px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5"
                style={{ background: EMBER_CTA, color: CREAM }}
              >
                Book a table
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── MENU ────────────────────────────────────────────────────────────────────
function MenuSection() {
  const [activeGroup, setActiveGroup] = useState(0)

  return (
    <section
      id="menu"
      className="py-24 md:py-32"
      style={{ background: CREAM }}
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <h2
            className="font-bitter text-3xl font-bold md:text-4xl lg:text-5xl"
            style={{ color: ESPRESSO }}
          >
            The menu.
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-3 text-base" style={{ color: `${ESPRESSO}b3` }}>
            One menu, photographed, honest. All meat from own farm.
          </p>
        </Reveal>

        {/* Scrollable dish gallery — drag, scroll, or arrow keys */}
        <Reveal delay={0.1}>
          <div className="relative mt-10 h-[420px] sm:h-[500px] md:h-[580px]" style={{ touchAction: 'pan-y' }}>
            <CircularGallery
              items={MENU_GALLERY}
              bend={2.5}
              textColor="#2A211A"
              borderRadius={0.06}
              font="600 30px Bitter"
              scrollSpeed={2.2}
              scrollEase={0.05}
            />
          </div>
          <p className="mt-4 text-center font-mono text-xs uppercase tracking-[0.15em]" style={{ color: `${ESPRESSO}99` }}>
            Drag · scroll · arrow keys — full menu below
          </p>
        </Reveal>

        {/* Tab strip */}
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap gap-2">
            {MENU.map((g, i) => (
              <button
                key={g.heading}
                onClick={() => setActiveGroup(i)}
                className="rounded-full px-4 py-2 text-sm font-medium transition-all inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3F12] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3ECDD]"
                style={{
                  background: activeGroup === i ? ESPRESSO : `${ESPRESSO}10`,
                  color: activeGroup === i ? CREAM : ESPRESSO,
                  transform: activeGroup === i ? 'translateY(-1px)' : 'none',
                  minHeight: '44px',
                }}
              >
                {g.heading}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Items */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MENU[activeGroup].items.map((item, i) => (
            <motion.div
              key={`${activeGroup}-${item.name}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: [0.21, 0.65, 0.36, 1] }}
              className="overflow-hidden rounded-2xl"
              style={{
                background: `${ESPRESSO}08`,
                border: `1px solid ${ESPRESSO}12`,
              }}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bitter text-base font-bold leading-tight" style={{ color: ESPRESSO }}>
                    {item.name}
                  </span>
                  <span className="shrink-0 font-mono text-sm font-semibold" style={{ color: EMBER_TEXT }}>
                    {item.price}
                  </span>
                </div>
                {item.desc && (
                  <p className="mt-1.5 text-sm leading-snug" style={{ color: `${ESPRESSO}cc` }}>
                    {item.desc}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── PROVENANCE STRIP ────────────────────────────────────────────────────────
function ProvenanceStrip() {
  const pillStyle = {
    background: `${CREAM}15`,
    border: `1px solid ${CREAM}25`,
    color: CREAM,
  }

  return (
    <section
      className="py-16 md:py-20"
      style={{ background: PASTURE }}
    >
      <Reveal>
        <div className="mx-auto max-w-4xl px-5 text-center md:px-8">
          <p
            className="font-bitter text-2xl font-bold leading-snug md:text-3xl lg:text-4xl"
            style={{ color: CREAM }}
          >
            "All our meat is 100% free range and unprocessed. Salads from our garden.
            Homemade bread every day."
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {['Own-farm beef', 'Garden salads', 'Daily bread', 'Since 1999'].map((pill) => (
              <span
                key={pill}
                className="rounded-full px-4 py-1.5 text-sm font-medium"
                style={pillStyle}
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}

// ─── THE ROOM ─────────────────────────────────────────────────────────────────
function TheRoom() {
  return (
    <section
      className="py-0 overflow-hidden"
      style={{ background: ESPRESSO }}
    >
      <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-8 md:grid-cols-5 md:gap-12 items-end">
          <div className="md:col-span-2 md:pb-6">
            <Reveal>
              <h2
                className="font-bitter text-3xl font-bold leading-tight md:text-4xl lg:text-5xl"
                style={{ color: CREAM }}
              >
                The old cowshed.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p
                className="mt-5 text-base leading-relaxed"
                style={{ color: `${CREAM}bb` }}
              >
                Original beams, stone walls, and the warmth that comes from a
                building that has been lived in for a century. The restaurant opened
                here in 1999 and the atmosphere has been the same ever since:
                unhurried, warm, genuinely Icelandic.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <a
                href="#book"
                className="mt-7 inline-block rounded-full border px-5 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5"
                style={{ borderColor: `${CREAM}40`, color: CREAM, background: `${CREAM}0a` }}
              >
                Reserve a seat
              </a>
            </Reveal>
          </div>
          <div className="md:col-span-3">
            <Reveal delay={0.08}>
              <div className="relative h-72 overflow-hidden rounded-3xl md:h-[500px]">
                <Img
                  src={IMAGES.interior}
                  alt="The candlelit interior of the converted cowshed, warm wooden beams and stone walls"
                  className="h-full w-full object-cover"
                  fallbackClassName="h-full w-full bg-gradient-to-br from-[#3d2010] to-[#1a0c06]"
                />
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: `linear-gradient(135deg, transparent 60%, ${DARK_WOOD}60)`,
                  }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── REVIEWS ─────────────────────────────────────────────────────────────────
function Reviews() {
  return (
    <section
      className="py-24 md:py-32"
      style={{ background: CREAM }}
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <h2
            className="font-bitter text-3xl font-bold md:text-4xl"
            style={{ color: ESPRESSO }}
          >
            What people say.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {QUOTES.map((q, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <blockquote
                className="flex h-full flex-col justify-between rounded-2xl p-5"
                style={{
                  background: i % 2 === 0 ? `${ESPRESSO}08` : `${ESPRESSO}04`,
                  border: `1px solid ${ESPRESSO}10`,
                }}
              >
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: `${ESPRESSO}cc` }}
                  dangerouslySetInnerHTML={{ __html: `"${q.text}"` }}
                />
                <footer className="mt-4 pt-4" style={{ borderTop: `1px solid ${ESPRESSO}10` }}>
                  <span className="block text-sm font-semibold" style={{ color: ESPRESSO }}>
                    {q.name}
                  </span>
                  <span className="text-xs" style={{ color: `${ESPRESSO}99` }}>
                    {q.from}
                  </span>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <p className="mt-6 text-xs" style={{ color: `${ESPRESSO}b3` }}>
            Sample reviews for illustration. Not verified.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

// ─── HOURS & BOOKING ─────────────────────────────────────────────────────────
function HoursAndBook() {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm   = String(today.getMonth() + 1).padStart(2, '0')
  const dd   = String(today.getDate()).padStart(2, '0')
  const minDate = `${yyyy}-${mm}-${dd}`

  const [date,    setDate]    = useState('')
  const [guests,  setGuests]  = useState(2)
  const [time,    setTime]    = useState('')
  const [name,    setName]    = useState('')

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Table request - ${date} at ${time} for ${guests}`)
    const body = encodeURIComponent(
      `Hello,\n\nI would like to request a table at Gamla Fjosid.\n\nDate: ${date}\nTime: ${time}\nGuests: ${guests}\nName: ${name}\n\nThank you!`
    )
    window.location.href = `mailto:info@gamlafjosid.is?subject=${subject}&body=${body}`
  }

  const inputStyle = {
    background: `${CREAM}0a`,
    border: `1px solid ${CREAM}25`,
    color: CREAM,
    borderRadius: '12px',
  }

  return (
    <section
      id="visit"
      className="py-24 md:py-32"
      style={{ background: ESPRESSO }}
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-14 md:grid-cols-2 md:gap-16">
          {/* Hours */}
          <div>
            <Reveal>
              <h2
                className="font-bitter text-3xl font-bold md:text-4xl"
                style={{ color: CREAM }}
              >
                Hours and location.
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <div
                className="mt-8 rounded-2xl p-6 md:p-7"
                style={{ background: `${CREAM}08`, border: `1px solid ${CREAM}14` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ background: '#4ade80' }}
                  />
                  <span className="text-sm font-semibold" style={{ color: `${CREAM}cc` }}>
                    Open daily 11:30 - 21:00
                  </span>
                </div>
                <div
                  className="rounded-xl px-4 py-3 mb-4 text-sm leading-relaxed"
                  style={{ background: `${EMBER}22`, border: `1px solid ${EMBER}35`, color: `${CREAM}cc` }}
                >
                  <strong style={{ color: CREAM }}>Seasonal closing:</strong> The restaurant closes
                  in mid-October and reopens in spring. We recommend calling ahead if you
                  are visiting outside summer season.
                </div>
                <div className="space-y-1 text-sm" style={{ color: `${CREAM}99` }}>
                  <p>Hvassafell, 861 Hvolsvöllur</p>
                  <p>Tel: <a href="tel:+3544877788" style={{ color: `${CREAM}cc` }}>+354 487 7788</a></p>
                  <p>Email: <a href="mailto:info@gamlafjosid.is" style={{ color: `${CREAM}cc` }}>info@gamlafjosid.is</a></p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.14}>
              <a
                href="https://www.google.com/maps/search/Hvassafell+861+Hvolsvollur+Iceland"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5"
                style={{ borderColor: `${CREAM}30`, color: `${CREAM}cc`, background: `${CREAM}06` }}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                </svg>
                Open in Maps
              </a>
            </Reveal>
          </div>

          {/* Booking form */}
          <div id="book">
            <Reveal delay={0.05}>
              <h3
                className="font-bitter text-2xl font-bold md:text-3xl"
                style={{ color: CREAM }}
              >
                Request a table.
              </h3>
              <p className="mt-2 text-sm" style={{ color: `${CREAM}cc` }}>
                We will confirm by email or phone within one business day.
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <form onSubmit={handleBook} className="mt-7 space-y-4">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide" style={{ color: `${CREAM}80` }}>
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 text-sm outline-none placeholder:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3F12] focus-visible:ring-offset-2 focus-visible:ring-offset-[#241A12]"
                    style={{
                      ...inputStyle,
                      minHeight: '44px',
                    }}
                  />
                </div>

                {/* Date + Guests row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide" style={{ color: `${CREAM}80` }}>
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      min={minDate}
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#9A3F12] focus-visible:ring-offset-2 focus-visible:ring-offset-[#241A12]"
                      style={{
                        ...inputStyle,
                        minHeight: '44px',
                        colorScheme: 'dark',
                      }}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide" style={{ color: `${CREAM}80` }}>
                      Guests
                    </label>
                    <div
                      className="flex items-center justify-between px-3 py-2"
                      style={{ ...inputStyle, minHeight: '44px' }}
                    >
                      <button
                        type="button"
                        onClick={() => setGuests(g => Math.max(1, g - 1))}
                        className="flex h-11 w-11 items-center justify-center rounded-full text-lg font-medium transition-colors hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3F12] focus-visible:ring-offset-2 focus-visible:ring-offset-[#241A12]"
                        style={{ color: CREAM, background: `${CREAM}15` }}
                        aria-label="Fewer guests"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium" style={{ color: CREAM }}>
                        {guests} {guests === 1 ? 'guest' : 'guests'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setGuests(g => Math.min(12, g + 1))}
                        className="flex h-11 w-11 items-center justify-center rounded-full text-lg font-medium transition-colors hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3F12] focus-visible:ring-offset-2 focus-visible:ring-offset-[#241A12]"
                        style={{ color: CREAM, background: `${CREAM}15` }}
                        aria-label="More guests"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Time */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide" style={{ color: `${CREAM}80` }}>
                    Preferred time
                  </label>
                  <select
                    required
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full px-4 py-3 text-sm outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3F12] focus-visible:ring-offset-2 focus-visible:ring-offset-[#241A12]"
                    style={{
                      ...inputStyle,
                      minHeight: '44px',
                      colorScheme: 'dark',
                    }}
                  >
                    <option value="" style={{ background: ESPRESSO }}>Select a time</option>
                    {TIME_SLOTS.map(t => (
                      <option key={t} value={t} style={{ background: ESPRESSO }}>{t}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full rounded-full py-3.5 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3F12] focus-visible:ring-offset-2 focus-visible:ring-offset-[#241A12]"
                  style={{ background: EMBER_CTA, color: CREAM, minHeight: '44px' }}
                >
                  Request a table
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── FINAL CTA ────────────────────────────────────────────────────────────────
function FinalCta() {
  return (
    <section
      className="relative overflow-hidden py-28 md:py-36"
      style={{ background: DARK_WOOD }}
    >
      {/* Subtle ember-glow radial */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, ${EMBER}25 0%, transparent 65%)`,
        }}
      />
      <Reveal>
        <div className="relative z-10 mx-auto max-w-3xl px-5 text-center md:px-8">
          <p
            className="font-mono text-xs uppercase tracking-[0.2em] mb-5"
            style={{ color: `${CREAM}60` }}
          >
            Hvassafell, Eyjafjöll
          </p>
          <h2
            className="font-bitter text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
            style={{ color: CREAM }}
          >
            A meal worth the drive.
          </h2>
          <p
            className="mt-5 text-base leading-relaxed md:text-lg"
            style={{ color: `${CREAM}bb` }}
          >
            Mon-Sun 11:30 - 21:00. Closed mid-October through spring.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#book"
              className="rounded-full px-8 py-4 text-base font-semibold transition-all hover:-translate-y-0.5 hover:shadow-xl"
              style={{ background: EMBER_CTA, color: CREAM }}
            >
              Book a table
            </a>
            <a
              href="tel:+3544877788"
              className="rounded-full border px-8 py-4 text-base font-semibold transition-all hover:-translate-y-0.5"
              style={{ borderColor: `${CREAM}35`, color: CREAM }}
            >
              +354 487 7788
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

// ─── MOBILE STICKY BAR ───────────────────────────────────────────────────────
function StickyBar({ show }: { show: boolean }) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 px-4 py-3 transition-transform duration-300 md:hidden"
      style={{
        background: `${ESPRESSO}f5`,
        backdropFilter: 'blur(12px)',
        borderTop: `1px solid ${CREAM}14`,
        transform: show ? 'translateY(0)' : 'translateY(100%)',
      }}
      aria-hidden={!show}
    >
      <div>
        <p className="font-bitter text-sm font-bold" style={{ color: CREAM }}>Gamla Fjósið</p>
        <p className="text-xs" style={{ color: `${CREAM}70` }}>11:30 - 21:00</p>
      </div>
      <a
        href="#book"
        className="rounded-full px-5 py-2.5 text-sm font-semibold"
        style={{ background: EMBER_CTA, color: CREAM, minHeight: '44px', display: 'flex', alignItems: 'center' }}
      >
        Book a table
      </a>
    </div>
  )
}

// ─── PAGE ROOT ────────────────────────────────────────────────────────────────
export default function Page() {
  const [scrolled, setScrolled]   = useState(false)
  const [showBar,  setShowBar]    = useState(false)

  useEffect(() => {
    document.title = 'Gamla Fjósið — Farm-to-Table under Eyjafjallajökull'
    setThemeColor('#241A12')
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 60)
      setShowBar(y > 480)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className="font-hanken antialiased"
      style={{ background: CREAM, color: ESPRESSO }}
    >
      <PreviewChrome company={company} />

      <Nav showBar={scrolled} />
      <Hero />
      <StoryBand />
      <ProvenanceTrail />
      <VolcanoSoup />
      <MenuSection />
      <ProvenanceStrip />
      <TheRoom />
      <Reviews />
      <HoursAndBook />
      <FinalCta />

      {/* Footer reserve for mobile sticky bar */}
      <div className="h-20 md:hidden" aria-hidden="true" />
      <StickyBar show={showBar} />

      <PreviewFooter company={company} />
    </div>
  )
}
