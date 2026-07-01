import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { PartialPrototypeBanner } from '../PartialPrototypeBanner'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import {
  AWARDS,
  BRUNO,
  C,
  CHEESES,
  FARM,
  HERO_STATS,
  IMG,
  MARQUEE,
  MORE_AT,
  PAIRINGS,
  PRESS,
  PROVENANCE_ROWS,
  SPEC_ROWS,
  srcSet,
  STAGES,
  u,
} from './data'

const company = getPreviewCompany('brunastadir')

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ── Specimen label caps (Manrope, tracked) ───────────────────────────── */
function Caps({
  children,
  color = C.accent,
  className = '',
}: {
  children: ReactNode
  color?: string
  className?: string
}) {
  return (
    <span
      className={`font-manrope text-[11.5px] font-semibold uppercase ${className}`}
      style={{ color, letterSpacing: '0.16em' }}
    >
      {children}
    </span>
  )
}

/* ── Reveal — IntersectionObserver + CSS transition, in-view-on-mount,
 *    setTimeout failsafe. No Framer whileInView, no rAF loop. ──────────── */
function Reveal({
  children,
  delay = 0,
  y = 26,
  dur = 0.85,
  className = '',
  style,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  y?: number
  dur?: number
  className?: string
  style?: CSSProperties
  as?: 'div' | 'li'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReduced()) {
      setShown(true)
      return
    }
    // in-view-on-mount check
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight && r.bottom > 0) {
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
      { rootMargin: '0px 0px -7% 0px', threshold: 0.14 },
    )
    io.observe(el)
    const t = window.setTimeout(() => setShown(true), 1500) // failsafe
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [])
  const Tag = as
  return (
    <Tag
      ref={ref as never}
      className={className}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translateY(${y}px)`,
        transition: `opacity ${dur}s cubic-bezier(.2,.8,.2,1) ${delay}ms, transform ${dur}s cubic-bezier(.2,.8,.2,1) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  )
}

/* ── Parallax image — passive synchronous scroll handler reads
 *    getBoundingClientRect → translateY, NO rAF lerp, NO Framer useScroll.
 *    Reduced-motion: no transform (static). The image always renders. ──── */
function useParallax(amount = 0.08) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced()) return
    const apply = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // -1 (below) → 1 (above); 0 when centered
      const centred = (rect.top + rect.height / 2 - vh / 2) / vh
      const shift = -(centred * amount * 100)
      el.style.transform = `translate3d(0, ${shift.toFixed(2)}%, 0)`
    }
    apply()
    window.addEventListener('scroll', apply, { passive: true })
    window.addEventListener('resize', apply, { passive: true })
    return () => {
      window.removeEventListener('scroll', apply)
      window.removeEventListener('resize', apply)
    }
  }, [amount])
  return ref
}

/* ════════════════════════════════════════════════════════════════════════
 *  NAV — floating wordmark bar with scroll-driven active link
 * ════════════════════════════════════════════════════════════════════════ */
const NAV_LINKS = [
  { href: '#story', id: 'story', label: 'Provenance' },
  { href: '#library', id: 'library', label: 'The Library' },
  { href: '#pairings', id: 'pairings', label: 'Pairings' },
  { href: '#recognised', id: 'recognised', label: 'Recognised' },
  { href: '#visit', id: 'visit', label: 'Visit' },
]

function Nav() {
  const [active, setActive] = useState('')
  useEffect(() => {
    const apply = () => {
      const probe = window.scrollY + window.innerHeight * 0.34
      let current = ''
      for (const l of NAV_LINKS) {
        const el = document.getElementById(l.id)
        if (el && el.offsetTop <= probe) current = l.id
      }
      setActive((prev) => (prev === current ? prev : current))
    }
    apply()
    window.addEventListener('scroll', apply, { passive: true })
    window.addEventListener('resize', apply, { passive: true })
    return () => {
      window.removeEventListener('scroll', apply)
      window.removeEventListener('resize', apply)
    }
  }, [])
  return (
    <nav className="pointer-events-none fixed inset-x-0 top-[14px] z-[90] flex justify-center px-3">
      <div
        className="pointer-events-auto flex items-center gap-5 rounded-full py-2 pl-5 pr-2.5"
        style={{
          background: 'rgba(251,246,234,0.84)',
          border: `1px solid ${C.rule}`,
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 30px rgba(36,27,18,0.10)',
        }}
      >
        <a
          href="#top"
          className="font-tryst text-[19px] leading-none"
          style={{ color: C.ink }}
          aria-label="Brúnastaðir, home"
        >
          Brúnastaðir
        </a>
        <div className="hidden items-center gap-5 lg:flex">
          {NAV_LINKS.map((l) => {
            const on = active === l.id
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={on ? 'true' : undefined}
                className="nav-link font-manrope text-[13px] font-medium transition-opacity hover:opacity-100"
                style={{ color: on ? C.ink : C.muted, opacity: on ? 1 : 0.74 }}
              >
                {l.label}
                <span
                  aria-hidden
                  className="nav-underline"
                  style={{ background: C.accent, transform: on ? 'scaleX(1)' : 'scaleX(0)' }}
                />
              </a>
            )
          })}
        </div>
        <a
          href="#visit"
          className="rounded-full px-4 py-2 font-manrope text-[12.5px] font-semibold transition-transform active:scale-95"
          style={{ background: C.accent, color: C.surface }}
        >
          Visit the farm
        </a>
      </div>
    </nav>
  )
}

/* ════════════════════════════════════════════════════════════════════════
 *  HERO + SIGNATURE — "The Specimen Plate" / "The Living Label"  (kept intact;
 *  plate enlarged + layered wedge + stat chips to fill the cream void)
 * ════════════════════════════════════════════════════════════════════════ */
function HeroSignature() {
  const pinRef = useRef<HTMLDivElement>(null)
  const wheelRef = useRef<HTMLDivElement>(null)
  // Scroll-rotate lives on the outer frame so it composes with the inner
  // wheel's infinite `.hs-breathe` transform instead of overwriting it.
  const tiltRef = useRef<HTMLDivElement>(null)
  const threadRef = useRef<SVGPathElement>(null)
  const specRef = useRef<HTMLDivElement>(null)
  const provRef = useRef<HTMLDivElement>(null)
  const [reduce, setReduce] = useState(false)
  // `compact` collapses the pinned scroll-stage to a static layout when the
  // scroll payoff is hidden anyway — reduced-motion OR narrow viewport (<768px,
  // where the thread + secondary wedge are md:block-hidden). Phones then get a
  // clean tall-but-not-pinned hero instead of a 165vh sticky stage.
  const [compact, setCompact] = useState(false)
  // On mobile there's no scroll-pin to cross-fade Specimen/Provenance, so a tap
  // flips between them — keeps the label card the same compact height as the
  // desktop version instead of stacking both and overrunning the photo.
  const [labelTab, setLabelTab] = useState<'specimen' | 'provenance'>('specimen')

  // Keep `compact` in sync if the viewport is resized across the 768px line.
  useEffect(() => {
    const sync = () => setCompact(prefersReduced() || window.innerWidth < 768)
    sync()
    window.addEventListener('resize', sync, { passive: true })
    return () => window.removeEventListener('resize', sync)
  }, [])

  useEffect(() => {
    const r = prefersReduced()
    setReduce(r)
    const isCompact = r || window.innerWidth < 768
    setCompact(isCompact)
    if (isCompact) {
      if (threadRef.current) threadRef.current.style.strokeDashoffset = '0'
      return
    }

    const pin = pinRef.current
    const tilt = tiltRef.current
    const thread = threadRef.current
    const spec = specRef.current
    const prov = provRef.current
    if (!pin || !tilt || !thread || !spec || !prov) return

    const len = thread.getTotalLength()
    thread.style.strokeDasharray = `${len}`
    thread.style.strokeDashoffset = `${len}`

    const apply = () => {
      const rect = pin.getBoundingClientRect()
      const vh = window.innerHeight
      const total = rect.height - vh
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0

      tilt.style.transform = `rotate(${(p * 12).toFixed(2)}deg)`
      thread.style.strokeDashoffset = `${(len * (1 - p)).toFixed(1)}`
      const provIn = Math.min(1, Math.max(0, (p - 0.25) / 0.5))
      spec.style.opacity = `${1 - provIn}`
      prov.style.opacity = `${provIn}`
      prov.style.pointerEvents = provIn > 0.5 ? 'auto' : 'none'
      spec.style.pointerEvents = provIn > 0.5 ? 'none' : 'auto'
    }
    apply() // sync initial paint
    window.addEventListener('scroll', apply, { passive: true })
    window.addEventListener('resize', apply, { passive: true })
    return () => {
      window.removeEventListener('scroll', apply)
      window.removeEventListener('resize', apply)
    }
  }, [])

  return (
    <header id="top" style={{ background: C.ground }}>
      {/* Pin zone trimmed toward ~165vh so the sticky stage isn't mostly cream. */}
      <div
        ref={pinRef}
        style={{ position: 'relative', height: compact ? 'auto' : 'min(165vh, 1380px)' }}
      >
        <div
          className="flex flex-col justify-center"
          style={
            compact
              ? { paddingTop: 'clamp(120px,16vw,180px)', paddingBottom: '40px' }
              : { position: 'sticky', top: 0, minHeight: '100svh', paddingTop: 'clamp(96px,12vw,150px)' }
          }
        >
          <div className="mx-auto w-full max-w-[1240px] px-[26px]">
            {/* shelf line under nav */}
            <div className="mb-[clamp(28px,5vw,60px)] h-px w-full" style={{ background: C.rule }} />

            <div
              className="grid grid-cols-1 items-center md:[grid-template-columns:minmax(280px,0.92fr)_minmax(300px,1.08fr)]"
              style={{ gap: 'clamp(34px,5vw,76px)' }}
            >
              {/* LEFT — wordmark + eyebrow + CTAs + stat chips */}
              <div className="hs-rise" style={{ ['--d' as string]: '40ms' }}>
                <Caps>Iceland’s only farm-made cheese</Caps>
                <h1
                  className="font-tryst m-0 mt-4 leading-[0.92]"
                  style={{ color: C.ink, fontSize: 'clamp(74px,12vw,124px)', letterSpacing: '-0.01em' }}
                >
                  Brúnó
                </h1>
                <p
                  className="font-manrope mt-6 max-w-[420px] leading-[1.62]"
                  style={{ color: C.muted, fontSize: 'clamp(15px,1.5vw,17px)' }}
                >
                  A hard goat cheese from the Fljót valley in Skagafjörður — its
                  rind washed in IPA from the brewery down the road. Each wheel is
                  a specimen; the valley is the proof.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <a
                    href="#library"
                    className="rounded-full px-6 py-3 font-manrope text-[14px] font-semibold transition-transform active:scale-95"
                    style={{ background: C.ink, color: C.surface }}
                  >
                    Browse the library
                  </a>
                  <a
                    href="#story"
                    className="rounded-full px-6 py-3 font-manrope text-[14px] font-semibold transition-colors"
                    style={{ border: `1px solid ${C.rule}`, color: C.ink }}
                  >
                    The closed loop
                  </a>
                </div>

                {/* stat chips — fill the lower-left cream void */}
                <div className="mt-8 flex flex-wrap gap-2.5">
                  {HERO_STATS.map((s, i) => (
                    <div
                      key={s.v}
                      className="hs-chip rounded-[9px] px-3.5 py-2.5"
                      style={{
                        ['--d' as string]: `${260 + i * 90}ms`,
                        background: C.surface,
                        border: `1px solid ${C.rule}`,
                      }}
                    >
                      <div className="font-tryst leading-none" style={{ color: C.ink, fontSize: '17px' }}>
                        {s.v}
                      </div>
                      <div
                        className="font-manrope mt-1 text-[10px] uppercase"
                        style={{ color: C.muted, letterSpacing: '0.1em' }}
                      >
                        {s.k}
                      </div>
                    </div>
                  ))}
                </div>

                {!reduce && (
                  <div
                    className="hs-fade-late mt-8 hidden items-center gap-2 font-manrope text-[12px] md:flex"
                    style={{ color: C.muted }}
                  >
                    <span className="hs-bob" aria-hidden>
                      ↓
                    </span>
                    Scroll to turn the wheel and read its provenance
                  </div>
                )}
              </div>

              {/* RIGHT — specimen plate: enlarged framed wheel + layered wedge + label */}
              <div className="hs-rise relative" style={{ ['--d' as string]: '120ms' }}>
                {/* the thread grows out of the label's left edge */}
                <svg
                  className="pointer-events-none absolute -bottom-[clamp(40px,8vw,90px)] left-[-6%] z-[3] hidden md:block"
                  width="62%"
                  height="160"
                  viewBox="0 0 320 160"
                  fill="none"
                  aria-hidden
                >
                  <path
                    ref={threadRef}
                    d="M2 30 C 90 30, 70 120, 170 120 S 300 150, 318 150"
                    stroke={C.accent}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="318" cy="150" r="4" fill={C.accent} />
                </svg>

                {/* layered secondary wedge tucked behind, upper right */}
                <div
                  className="absolute -right-[clamp(8px,3vw,40px)] -top-[clamp(20px,5vw,52px)] z-[1] hidden w-[clamp(180px,22vw,260px)] -rotate-3 overflow-hidden rounded-[10px] md:block"
                  style={{ border: `1px solid ${C.rule}`, boxShadow: '0 30px 60px rgba(36,27,18,0.16)' }}
                  aria-hidden
                >
                  <Img
                    src={u(IMG.wedge, 720)}
                    srcSet={srcSet(IMG.wedge)}
                    sizes="260px"
                    alt=""
                    className="block aspect-[4/5] w-full object-cover"
                    fallbackClassName="bg-gradient-to-br from-[#C99C6A] to-[#8A4B22]"
                  />
                </div>

                {/* enlarged framed wheel — dominates the right cols, bleeds slightly off */}
                <div
                  className="relative z-[2] mr-[-2%] ml-auto"
                  style={{ maxWidth: 'min(560px, 96%)' }}
                >
                  <div
                    ref={tiltRef}
                    className="relative overflow-hidden rounded-[10px]"
                    style={{
                      border: `1px solid ${C.rule}`,
                      padding: '16px',
                      background: C.surface,
                      boxShadow: '0 50px 90px rgba(36,27,18,0.20)',
                      willChange: 'transform',
                    }}
                  >
                    <div ref={wheelRef} className="hs-breathe overflow-hidden rounded-[6px]" style={{ willChange: 'transform' }}>
                      <Img
                        src={u(IMG.wheel, 1400)}
                        srcSet={srcSet(IMG.wheel)}
                        sizes="(max-width:768px) 92vw, 540px"
                        alt="Illustrative photo of a farmhouse cheese wheel (sample imagery)"
                        loading="eager"
                        fetchpriority="high"
                        className="block aspect-square w-full object-cover"
                        fallbackClassName="bg-gradient-to-br from-[#C99C6A] to-[#8A4B22]"
                      />
                    </div>
                  </div>

                  {/* hand-set label card overlapping the lower-left edge — on
                      mobile a tap flips Specimen/Provenance instead of stacking
                      both, so the card keeps the same compact footprint over
                      the photo as the desktop scroll-cross-fade version */}
                  <div
                    className="absolute -bottom-7 left-0 z-[4] w-[min(310px,84%)] rounded-[8px] sm:-left-7"
                    style={{
                      background: C.surface,
                      border: `1px solid ${C.rule}`,
                      boxShadow: '0 24px 50px rgba(36,27,18,0.20)',
                    }}
                  >
                    <div className="flex items-baseline justify-between gap-3 px-5 pt-4">
                      <span className="font-tryst italic" style={{ color: C.ink, fontSize: '24px' }}>
                        Brúnó
                      </span>
                      <Caps>No. 01</Caps>
                    </div>
                    <div className="mx-5 mt-3 h-px" style={{ background: C.rule }} />

                    {compact && (
                      <div className="flex gap-2 px-5 pt-3" role="tablist" aria-label="Label detail">
                        {(['specimen', 'provenance'] as const).map((tab) => (
                          <button
                            key={tab}
                            type="button"
                            role="tab"
                            aria-selected={labelTab === tab}
                            onClick={() => setLabelTab(tab)}
                            className="rounded-full px-3 py-1 font-manrope text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors"
                            style={
                              labelTab === tab
                                ? { background: C.ink, color: C.surface }
                                : { background: 'transparent', color: C.muted, border: `1px solid ${C.rule}` }
                            }
                          >
                            {tab === 'specimen' ? 'Specimen' : 'Provenance'}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="relative px-5 pb-5 pt-3" style={{ minHeight: '152px' }}>
                      <LabelRows
                        innerRef={specRef}
                        heading="Specimen"
                        showHeading={!compact}
                        rows={SPEC_ROWS}
                        startOpacity={compact ? (labelTab === 'specimen' ? 1 : 0) : 1}
                        absolute={compact}
                      />
                      <LabelRows
                        innerRef={provRef}
                        heading="Provenance"
                        showHeading={!compact}
                        rows={PROVENANCE_ROWS}
                        startOpacity={compact ? (labelTab === 'provenance' ? 1 : 0) : 0}
                        absolute={true}
                      />
                    </div>
                  </div>

                  <p
                    className="font-manrope mt-12 max-w-[300px] text-[11px] leading-[1.5]"
                    style={{ color: C.muted }}
                  >
                    Photography is illustrative — sample specimen imagery, not the
                    actual Brúnó wheel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

/* one label body (spec OR provenance); the two are stacked & cross-faded */
function LabelRows({
  innerRef,
  heading,
  showHeading = true,
  rows,
  startOpacity,
  absolute,
}: {
  innerRef: React.RefObject<HTMLDivElement>
  heading: string
  showHeading?: boolean
  rows: readonly { k: string; v: string }[]
  startOpacity: number
  absolute: boolean
}) {
  return (
    <div
      ref={innerRef}
      style={{
        opacity: startOpacity,
        ...(absolute ? { position: 'absolute', inset: '12px 20px 20px' } : {}),
        transition: 'opacity .25s linear',
      }}
    >
      {showHeading && (
        <Caps color={C.pasture} className="block mb-2.5">
          {heading}
        </Caps>
      )}
      <dl className="m-0 flex flex-col gap-1.5">
        {rows.map((r) => (
          <div key={r.k} className="flex items-baseline justify-between gap-3">
            <dt className="font-manrope text-[11px] uppercase" style={{ color: C.muted, letterSpacing: '0.1em' }}>
              {r.k}
            </dt>
            <dd
              className="font-manrope m-0 text-right text-[12.5px] font-medium"
              style={{ color: C.ink, maxWidth: '64%' }}
            >
              {r.v}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
 *  FULL-BLEED PROVENANCE OVERTURE — first 100vw image moment (NEW)
 * ════════════════════════════════════════════════════════════════════════ */
function Overture() {
  const bgRef = useParallax(0.1)
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: 'clamp(440px,64vh,720px)', background: C.ink }}
      aria-label="The Fljót valley"
    >
      <div ref={bgRef} className="absolute inset-0 will-change-transform" style={{ inset: '-8% 0' }}>
        <Img
          src={u(IMG.valley, 2000)}
          srcSet={srcSet(IMG.valley)}
          sizes="100vw"
          alt="Illustrative landscape of the Fljót valley — green pasture between the mountains and the Arctic sea (sample imagery)"
          className="h-full w-full object-cover"
          fallbackClassName="bg-gradient-to-br from-[#5B6B42] to-[#2c351f]"
        />
      </div>
      {/* ink scrim, left-anchored bottom for AA text */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(36,27,18,0.78) 0%, rgba(36,27,18,0.46) 42%, rgba(36,27,18,0.12) 78%, rgba(36,27,18,0) 100%), linear-gradient(0deg, rgba(36,27,18,0.55) 0%, rgba(36,27,18,0) 46%)',
        }}
      />
      <div className="relative mx-auto flex min-h-[clamp(440px,64vh,720px)] max-w-[1240px] items-end px-[26px] pb-[clamp(40px,7vw,84px)] pt-[clamp(90px,12vw,150px)]">
        <Reveal>
          <span
            className="font-manrope text-[11.5px] font-semibold uppercase"
            style={{ color: 'rgba(251,246,234,0.86)', letterSpacing: '0.16em' }}
          >
            The closed loop
          </span>
          <h2
            className="font-tryst mt-4 max-w-[16ch] leading-[1.02]"
            style={{ color: C.surface, fontSize: 'clamp(40px,6.4vw,82px)', letterSpacing: '-0.01em' }}
          >
            One valley, read back to front.
          </h2>
          <p
            className="font-manrope mt-5 max-w-[440px] leading-[1.6]"
            style={{ color: 'rgba(251,246,234,0.9)', fontSize: 'clamp(15px,1.6vw,18px)' }}
          >
            Pasture, milk, beer, cave, wheel — a closed loop of place, all of it
            inside 570 Fljót.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════════
 *  PROVENANCE STRIP — pasture → milk → cave → wheel (enriched + crescendo)
 * ════════════════════════════════════════════════════════════════════════ */
function StagePhoto({ s, ratio }: { s: (typeof STAGES)[number]; ratio: string }) {
  const ref = useParallax(0.07)
  return (
    <div className="overflow-hidden rounded-[8px]" style={{ border: `1px solid ${C.rule}`, boxShadow: '0 24px 54px rgba(36,27,18,0.16)' }}>
      <div ref={ref} className="will-change-transform" style={{ marginBlock: '-6%' }}>
        <Img
          src={u(IMG[s.img], 1400)}
          srcSet={srcSet(IMG[s.img])}
          sizes="(max-width:768px) 100vw, 50vw"
          alt={s.alt}
          className={`block w-full object-cover ${ratio}`}
          fallbackClassName="bg-gradient-to-br from-[#9DA77F] to-[#5B6B42]"
        />
      </div>
    </div>
  )
}

function ProvenanceStrip() {
  const last = STAGES.length - 1
  return (
    <section id="story" className="relative" style={{ background: C.ground, padding: 'clamp(80px,10vw,128px) 0' }}>
      <div className="mx-auto max-w-[1240px] px-[26px]">
        <Reveal>
          <Caps>The closed loop</Caps>
          <h2
            className="font-tryst mt-4 max-w-[760px] leading-[1.04]"
            style={{ color: C.ink, fontSize: 'clamp(36px,5.4vw,56px)', letterSpacing: '-0.01em' }}
          >
            One valley, read back to front.
          </h2>
          <p className="font-manrope mt-5 max-w-[520px] leading-[1.62]" style={{ color: C.muted, fontSize: '17px' }}>
            Pasture, milk, beer, cave, wheel. Brúnastaðir is the only farm in
            Iceland making cheese on its own land — the whole story sits inside
            570 Fljót.
          </p>
        </Reveal>

        <div className="relative mt-[clamp(40px,5.5vw,64px)]">
          <span
            aria-hidden
            className="absolute left-[18px] top-2 bottom-2 hidden w-px md:block"
            style={{ background: `linear-gradient(${C.pasture}, ${C.accent})` }}
          />
          <ol className="m-0 flex list-none flex-col gap-[clamp(32px,4.5vw,56px)] p-0">
            {STAGES.map((s, i) => {
              const flip = i % 2 === 1
              const feature = i === last // Stage 04 crescendos as a larger feature row
              return (
                <Reveal as="li" key={s.no} delay={60} y={30}>
                  <div className="relative md:pl-[64px]">
                    <span
                      aria-hidden
                      className="absolute left-[11px] top-1.5 hidden h-3.5 w-3.5 rounded-full md:block"
                      style={{
                        background: s.node === 'pasture' ? C.pasture : C.accent,
                        boxShadow: `0 0 0 4px ${C.ground}`,
                      }}
                    />
                    <div
                      className={
                        'grid items-center grid-cols-1' +
                        (feature
                          ? ' md:[grid-template-columns:minmax(280px,1.5fr)_minmax(260px,1fr)]'
                          : ' md:[grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]')
                      }
                      style={{ gap: 'clamp(24px,4vw,56px)' }}
                    >
                      <div className={flip && !feature ? 'md:order-2' : ''}>
                        <StagePhoto s={s} ratio={feature ? 'aspect-[16/10]' : 'aspect-[4/3]'} />
                      </div>
                      <div className={flip && !feature ? 'md:order-1' : ''}>
                        <div className="flex items-baseline gap-4">
                          <span className="font-tryst leading-none" style={{ color: C.accent, fontSize: feature ? 'clamp(48px,6vw,76px)' : 'clamp(40px,5vw,60px)' }}>
                            {s.no}
                          </span>
                          <h3 className="font-tryst" style={{ color: C.ink, fontSize: feature ? 'clamp(30px,3.6vw,44px)' : 'clamp(26px,3vw,36px)' }}>
                            {s.title}
                          </h3>
                        </div>
                        <p
                          className="font-manrope mt-4 max-w-[460px] leading-[1.65]"
                          style={{ color: C.muted, fontSize: feature ? '17px' : '16px' }}
                        >
                          {s.copy}
                        </p>
                        {/* field-note metadata row — ties to the label system */}
                        <div className="mt-4 inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5" style={{ background: C.surface, border: `1px solid ${C.rule}` }}>
                          <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: s.node === 'pasture' ? C.pasture : C.accent }} />
                          <Caps className="!text-[10.5px]">{s.note}</Caps>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </ol>
        </div>

        <p className="font-manrope mt-[clamp(40px,5.5vw,64px)] max-w-[560px] text-[12.5px] leading-[1.5]" style={{ color: C.muted }}>
          The closed loop — goats fed the brewery’s spent grain; Brúnó washed in
          that same brewery’s IPA (Segli, Siglufjörður) — is reported by
          Bændablaðið.
        </p>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════════
 *  THE CHEESE LIBRARY — featured Brúnó + denser staggered shelf
 * ════════════════════════════════════════════════════════════════════════ */
function ShelfCard({ c, index }: { c: (typeof CHEESES)[number]; index: number }) {
  return (
    <article className="group">
      <div className="overflow-hidden rounded-[8px]" style={{ border: `1px solid ${C.rule}`, boxShadow: '0 18px 44px rgba(36,27,18,0.14)' }}>
        <Img
          src={u(IMG[c.img], 900)}
          srcSet={srcSet(IMG[c.img])}
          sizes="(max-width:768px) 100vw, 30vw"
          alt={c.alt}
          className="block aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          fallbackClassName="bg-gradient-to-br from-[#C99C6A] to-[#8A4B22]"
        />
      </div>
      <div
        className="cheese-card relative mx-auto -mt-7 w-[92%] rounded-[7px] px-4 pb-4 pt-3.5 transition-transform duration-300 ease-out group-hover:-translate-y-1.5"
        style={{ background: C.surface, border: `1px solid ${C.rule}`, boxShadow: '0 16px 36px rgba(36,27,18,0.16)' }}
      >
        <span
          aria-hidden
          className="cheese-pull absolute -left-3 top-6 h-px w-3 origin-right transition-all duration-300 ease-out group-hover:-left-7 group-hover:w-7"
          style={{ background: C.accent }}
        />
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-tryst italic" style={{ color: C.ink, fontSize: '23px' }}>
            {c.name}
          </h3>
          <Caps>{String(index).padStart(2, '0')}</Caps>
        </div>
        <p className="font-manrope mt-0.5 text-[12px]" style={{ color: C.accent }}>
          {c.kind}
        </p>
        <dl className="mt-3 flex flex-col gap-1 border-t pt-3" style={{ borderColor: C.hair }}>
          {[
            ['Milk', c.milk],
            ['Age', c.age],
            ['Texture', c.texture],
          ].map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-2">
              <dt className="font-manrope text-[10.5px] uppercase" style={{ color: C.muted, letterSpacing: '0.1em' }}>
                {k}
              </dt>
              <dd className="font-manrope m-0 text-[12px] font-medium" style={{ color: C.ink }}>
                {v}
              </dd>
            </div>
          ))}
        </dl>
        <p className="cheese-note font-manrope mt-3 overflow-hidden text-[12px] leading-[1.5]" style={{ color: C.muted }}>
          {c.note}
        </p>
        <div className="mt-3 flex items-baseline justify-between gap-2 border-t pt-2.5" style={{ borderColor: C.hair }}>
          <span className="font-manrope text-[16px] font-semibold" style={{ color: C.ink }}>
            {c.sample.toLocaleString('is-IS')} kr
          </span>
          <span className="font-manrope text-[9.5px] uppercase" style={{ color: C.accent, letterSpacing: '0.12em' }}>
            Sýnishorn af verði
          </span>
        </div>
      </div>
    </article>
  )
}

function Library() {
  return (
    <section id="library" style={{ background: C.surface, padding: 'clamp(80px,10vw,128px) 0' }}>
      <div className="mx-auto max-w-[1240px] px-[26px]">
        <Reveal className="md:pl-[26px]" style={{ borderLeft: `2px solid ${C.rule}` }}>
          <Caps>Four wheels · one farm</Caps>
          <h2
            className="font-tryst mt-3 leading-[1.0]"
            style={{ color: C.ink, fontSize: 'clamp(44px,7vw,84px)', letterSpacing: '-0.015em' }}
          >
            The Library
          </h2>
          <p className="font-manrope mt-4 max-w-[460px] leading-[1.6]" style={{ color: C.muted, fontSize: '16px' }}>
            Every wheel is shelved like a specimen — milk, age, texture, a tasting
            note. The flagship leads; three more follow.
          </p>
        </Reveal>

        {/* FEATURED Brúnó (≈2x) + staggered shelf of three */}
        <div
          className="mt-[clamp(40px,5.5vw,64px)] grid grid-cols-1 items-start md:[grid-template-columns:minmax(300px,1.05fr)_minmax(280px,1.35fr)]"
          style={{ gap: 'clamp(28px,4vw,52px)' }}
        >
          {/* Featured Brúnó */}
          <Reveal y={30} dur={1}>
            <article className="cheese group">
              <div className="overflow-hidden rounded-[10px]" style={{ border: `1px solid ${C.rule}`, boxShadow: '0 30px 64px rgba(36,27,18,0.18)' }}>
                <Img
                  src={u(IMG[BRUNO.img], 1200)}
                  srcSet={srcSet(IMG[BRUNO.img])}
                  sizes="(max-width:768px) 100vw, 40vw"
                  alt={BRUNO.alt}
                  className="block aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  fallbackClassName="bg-gradient-to-br from-[#C99C6A] to-[#8A4B22]"
                />
              </div>
              <div
                className="cheese-card relative mx-auto -mt-9 w-[94%] rounded-[9px] px-6 pb-6 pt-5 transition-transform duration-300 ease-out group-hover:-translate-y-1.5"
                style={{ background: C.surface, border: `1px solid ${C.rule}`, boxShadow: '0 22px 48px rgba(36,27,18,0.18)' }}
              >
                <div className="flex items-center justify-between gap-3">
                  <Caps color={C.pasture}>The flagship</Caps>
                  <Caps>No. 01</Caps>
                </div>
                <h3 className="font-tryst italic mt-2" style={{ color: C.ink, fontSize: 'clamp(34px,4vw,46px)' }}>
                  {BRUNO.name}
                </h3>
                <p className="font-manrope mt-1 text-[13px]" style={{ color: C.accent }}>
                  {BRUNO.kind}
                </p>
                <p className="font-manrope mt-4 leading-[1.62] text-[14px]" style={{ color: C.muted }}>
                  {BRUNO.story}
                </p>
                <dl className="mt-5 grid grid-cols-3 gap-3 border-t pt-4" style={{ borderColor: C.hair }}>
                  {[
                    ['Milk', BRUNO.milk],
                    ['Age', BRUNO.age],
                    ['Texture', BRUNO.texture],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="font-manrope text-[10px] uppercase" style={{ color: C.muted, letterSpacing: '0.1em' }}>
                        {k}
                      </dt>
                      <dd className="font-tryst mt-1" style={{ color: C.ink, fontSize: '17px' }}>
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-5 flex items-baseline justify-between gap-2 border-t pt-3.5" style={{ borderColor: C.hair }}>
                  <span className="font-manrope text-[18px] font-semibold" style={{ color: C.ink }}>
                    {BRUNO.sample.toLocaleString('is-IS')} kr
                  </span>
                  <span className="font-manrope text-[9.5px] uppercase" style={{ color: C.accent, letterSpacing: '0.12em' }}>
                    Sýnishorn af verði
                  </span>
                </div>
              </div>
            </article>
          </Reveal>

          {/* the three on a denser staggered shelf */}
          <div
            className="grid items-start"
            style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(214px,1fr))', gap: 'clamp(22px,3vw,36px)' }}
          >
            {CHEESES.map((c, i) => (
              <Reveal
                key={c.name}
                delay={i * 90}
                y={28}
                className="cheese md:[transform:translateY(var(--off))]"
                style={{ ['--off' as string]: `${c.offset}px` }}
              >
                <ShelfCard c={c} index={i + 2} />
              </Reveal>
            ))}
          </div>
        </div>

        <p className="font-manrope mt-[clamp(34px,5vw,56px)] text-[12.5px]" style={{ color: C.muted }}>
          Prices shown are sample figures for this concept —{' '}
          <span style={{ color: C.accent }}>sýnishorn af verði</span>. Brúnastaðir
          does not publish cheese prices.
        </p>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════════
 *  PAIRINGS — "At the table" (NEW): board feature + 4 pairing cards
 * ════════════════════════════════════════════════════════════════════════ */
function Pairings() {
  const boardRef = useParallax(0.08)
  return (
    <section id="pairings" style={{ background: C.ground, padding: 'clamp(80px,10vw,128px) 0' }}>
      <div className="mx-auto max-w-[1240px] px-[26px]">
        <Reveal>
          <Caps>At the table</Caps>
          <h2 className="font-tryst mt-4 max-w-[620px] leading-[1.04]" style={{ color: C.ink, fontSize: 'clamp(36px,5.4vw,56px)', letterSpacing: '-0.01em' }}>
            Four wheels, set out.
          </h2>
          <p className="font-manrope mt-5 max-w-[500px] leading-[1.62]" style={{ color: C.muted, fontSize: '17px' }}>
            How the farm serves them — beer beside the cheese it bathed in, honey
            over the baked salad cheese, the sharp one to finish.
          </p>
        </Reveal>

        <div
          className="mt-[clamp(40px,5.5vw,64px)] grid grid-cols-1 items-start md:[grid-template-columns:minmax(280px,1fr)_minmax(300px,1.15fr)]"
          style={{ gap: 'clamp(28px,4vw,52px)' }}
        >
          {/* LARGE board feature */}
          <Reveal y={30} dur={1}>
            <div className="overflow-hidden rounded-[12px]" style={{ border: `1px solid ${C.rule}`, boxShadow: '0 34px 70px rgba(36,27,18,0.18)' }}>
              <div ref={boardRef} className="will-change-transform" style={{ marginBlock: '-7%' }}>
                <Img
                  src={u(IMG.board, 1400)}
                  srcSet={srcSet(IMG.board)}
                  sizes="(max-width:768px) 100vw, 46vw"
                  alt="Illustrative photo of a warm cheese board with bread, honey and ale (sample imagery)"
                  className="block aspect-[4/5] w-full object-cover"
                  fallbackClassName="bg-gradient-to-br from-[#C99C6A] to-[#8A4B22]"
                />
              </div>
            </div>
            <p className="font-manrope mt-4 text-[12px] leading-[1.5]" style={{ color: C.muted }}>
              Serving imagery is illustrative — sample board, not the farm’s own.
            </p>
          </Reveal>

          {/* pairing cards */}
          <div className="grid gap-[clamp(16px,2vw,22px)]" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))' }}>
            {PAIRINGS.map((p, i) => (
              <Reveal key={p.cheese} delay={i * 80} y={24}>
                <article
                  className="pair-card flex h-full gap-4 rounded-[10px] p-3.5 transition-transform duration-300 ease-out"
                  style={{ background: C.surface, border: `1px solid ${C.rule}`, boxShadow: '0 14px 32px rgba(36,27,18,0.12)' }}
                >
                  <div className="shrink-0 overflow-hidden rounded-[7px]" style={{ width: '74px', border: `1px solid ${C.rule}` }}>
                    <Img
                      src={u(IMG[p.img], 720)}
                      srcSet={srcSet(IMG[p.img])}
                      sizes="74px"
                      alt={p.alt}
                      className="block aspect-square h-full w-full object-cover"
                      fallbackClassName="bg-gradient-to-br from-[#C99C6A] to-[#8A4B22]"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-tryst italic" style={{ color: C.ink, fontSize: '21px' }}>
                      {p.cheese}
                    </h3>
                    <Caps className="!text-[10.5px]">{p.with}</Caps>
                    <p className="font-manrope mt-2 text-[12.5px] leading-[1.5]" style={{ color: C.muted }}>
                      {p.copy}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════════
 *  RECOGNISED — ochre band, filled left column (numeral + press quote)
 * ════════════════════════════════════════════════════════════════════════ */
function WaxSeal({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" aria-hidden className="shrink-0">
      <circle cx="22" cy="22" r="20" fill={C.surface} opacity="0.16" />
      <circle cx="22" cy="22" r="20" stroke={C.surface} strokeOpacity="0.6" strokeWidth="1" strokeDasharray="2 3" />
      <circle cx="22" cy="22" r="13" stroke={C.surface} strokeOpacity="0.85" strokeWidth="1.2" />
      <path d="M22 14 l2.1 4.6 5 .5 -3.8 3.3 1.2 4.9 -4.5 -2.6 -4.5 2.6 1.2 -4.9 -3.8 -3.3 5 -.5z" fill={C.surface} />
    </svg>
  )
}

function Recognised() {
  return (
    <section id="recognised" className="relative overflow-hidden" style={{ background: C.accent, color: C.surface, padding: 'clamp(80px,10vw,128px) 0' }}>
      {/* faint oversized seal watermark bleeding off the left edge */}
      <svg
        aria-hidden
        className="pointer-events-none absolute -left-[120px] top-1/2 hidden -translate-y-1/2 md:block"
        width="460"
        height="460"
        viewBox="0 0 44 44"
        fill="none"
        style={{ opacity: 0.07 }}
      >
        <circle cx="22" cy="22" r="20" stroke={C.surface} strokeWidth="0.6" strokeDasharray="1.4 2" />
        <circle cx="22" cy="22" r="13" stroke={C.surface} strokeWidth="0.5" />
        <path d="M22 14 l2.1 4.6 5 .5 -3.8 3.3 1.2 4.9 -4.5 -2.6 -4.5 2.6 1.2 -4.9 -3.8 -3.3 5 -.5z" fill={C.surface} />
      </svg>

      <div className="relative mx-auto max-w-[1240px] px-[26px]">
        <div
          className="grid items-center"
          style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 'clamp(36px,6vw,80px)' }}
        >
          {/* filled left column: big numeral + press pull-quote */}
          <Reveal>
            <span className="font-manrope text-[11.5px] font-semibold uppercase" style={{ color: 'rgba(251,246,234,0.9)', letterSpacing: '0.16em' }}>
              Recognised
            </span>
            <div className="mt-3 flex items-end gap-4">
              <span className="font-tryst leading-[0.82]" style={{ color: C.surface, fontSize: 'clamp(88px,13vw,168px)' }}>
                2025
              </span>
            </div>
            <h2 className="font-tryst mt-3 leading-[1.05]" style={{ color: C.surface, fontSize: 'clamp(28px,3.8vw,42px)' }}>
              Quietly decorated, in the valley.
            </h2>
            <figure className="m-0 mt-6 max-w-[460px]">
              <p className="font-tryst italic m-0 leading-[1.3]" style={{ color: C.surface, fontSize: 'clamp(18px,2.2vw,24px)' }}>
                {PRESS.quote}
              </p>
              <figcaption className="font-manrope mt-3 text-[12.5px]" style={{ color: 'rgba(251,246,234,0.9)' }}>
                {PRESS.source} · {PRESS.attribution}
              </figcaption>
            </figure>
          </Reveal>

          <div className="flex flex-col gap-3">
            {AWARDS.map((a, i) => (
              <Reveal key={a.label} delay={i * 110} y={20}>
                <div
                  className="seal-row flex items-center gap-4 rounded-[10px] px-4 py-3.5"
                  style={{ background: 'rgba(251,246,234,0.08)', border: '1px solid rgba(251,246,234,0.16)' }}
                >
                  <span className="seal-stamp inline-flex">
                    <WaxSeal />
                  </span>
                  <div>
                    <div className="font-manrope text-[16px] font-semibold" style={{ color: C.surface }}>
                      {a.label}
                    </div>
                    <div className="font-manrope text-[12.5px]" style={{ color: 'rgba(251,246,234,0.9)' }}>
                      {a.year ? `${a.year} · ` : ''}
                      {a.meta}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════════
 *  MARQUEE — slim full-width credibility band (CSS keyframe, reduced-safe)
 * ════════════════════════════════════════════════════════════════════════ */
function Marquee() {
  const items = [...MARQUEE, ...MARQUEE]
  return (
    <section
      aria-label="Brúnastaðir in brief"
      className="overflow-hidden"
      style={{ background: C.surface, borderTop: `1px solid ${C.rule}`, borderBottom: `1px solid ${C.rule}` }}
    >
      <div className="bru-marquee flex w-max items-center py-[clamp(16px,2.4vw,26px)]">
        {items.map((m, i) => (
          <span key={i} className="flex items-center" aria-hidden={i >= MARQUEE.length}>
            <span className="font-tryst whitespace-nowrap" style={{ color: C.ink, fontSize: 'clamp(18px,2.4vw,28px)' }}>
              {m}
            </span>
            <span className="mx-[clamp(20px,3vw,40px)] inline-block h-1.5 w-1.5 rounded-full" style={{ background: C.accent }} aria-hidden />
          </span>
        ))}
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════════
 *  VISIT — invitation + hours + valley map + LARGE farm photo + where-to-buy
 * ════════════════════════════════════════════════════════════════════════ */
function ValleyMap() {
  return (
    <svg viewBox="0 0 320 220" className="block w-full" role="img" aria-label="Sketch map of the Fljót valley with Brúnastaðir marked">
      <rect x="0" y="0" width="320" height="220" rx="8" fill={C.ground} />
      <path d="M0 150 L60 70 L110 120 L160 60 L210 130 L270 80 L320 140 L320 220 L0 220 Z" fill="rgba(91,107,66,0.16)" />
      <path d="M0 170 L70 110 L140 160 L210 110 L320 165 L320 220 L0 220 Z" fill="rgba(91,107,66,0.24)" />
      <path d="M0 0 H320 V40 C 240 56, 80 56, 0 40 Z" fill="rgba(94,78,60,0.10)" />
      <path d="M150 44 C 140 90, 175 110, 160 150 S 150 200, 158 218" stroke={C.accent} strokeWidth="1.6" fill="none" strokeDasharray="3 4" />
      <g className="map-ping">
        <circle cx="160" cy="150" r="6" fill={C.accent} />
        <circle className="ping-ring" cx="160" cy="150" r="6" fill="none" stroke={C.accent} strokeWidth="1.5" />
      </g>
      <text x="172" y="148" fill={C.ink} fontSize="11" fontFamily="Manrope, sans-serif" fontWeight="600">
        Brúnastaðir
      </text>
      <text x="14" y="26" fill={C.muted} fontSize="9.5" fontFamily="Manrope, sans-serif" letterSpacing="1.5">
        ARCTIC SEA
      </text>
    </svg>
  )
}

function Visit() {
  return (
    <section id="visit" style={{ background: C.ground, padding: 'clamp(80px,10vw,128px) 0' }}>
      <div className="mx-auto max-w-[1240px] px-[26px]">
        <Reveal>
          <Caps>Farm shop & petting zoo</Caps>
          <h2 className="font-tryst mt-4 max-w-[640px] leading-[1.04]" style={{ color: C.ink, fontSize: 'clamp(36px,5vw,56px)', letterSpacing: '-0.01em' }}>
            Come to the valley.
          </h2>
          <p className="font-manrope mt-5 max-w-[480px] leading-[1.65]" style={{ color: C.muted, fontSize: '16px' }}>
            Taste the wheels at the source, meet the goats and the sheep, and see
            the closed loop in one valley between the mountains and the Arctic sea.
          </p>
        </Reveal>

        {/* LARGE farm photograph band */}
        <Reveal y={30} dur={1} className="mt-[clamp(32px,5vw,56px)]">
          <div className="overflow-hidden rounded-[12px]" style={{ border: `1px solid ${C.rule}`, boxShadow: '0 30px 64px rgba(36,27,18,0.16)' }}>
            <Img
              src={u(IMG.pasture, 2000)}
              srcSet={srcSet(IMG.pasture)}
              sizes="100vw"
              alt="Illustrative photo of goats grazing by a farm in northern Iceland (sample imagery)"
              className="block aspect-[16/7] w-full object-cover"
              fallbackClassName="bg-gradient-to-br from-[#9DA77F] to-[#5B6B42]"
            />
          </div>
        </Reveal>

        <div
          className="mt-[clamp(28px,4vw,48px)] grid items-start"
          style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 'clamp(28px,4vw,48px)' }}
        >
          {/* hours card */}
          <Reveal>
            <div
              className="hours-card w-full rounded-[10px] p-5"
              style={{ background: C.surface, border: `1px solid ${C.rule}`, boxShadow: '0 22px 48px rgba(36,27,18,0.14)' }}
            >
              <Caps color={C.pasture}>Opening hours</Caps>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-tryst" style={{ color: C.ink, fontSize: 'clamp(28px,3.6vw,40px)' }}>
                  {FARM.hours}
                </span>
              </div>
              <dl className="mt-4 flex flex-col gap-2.5 border-t pt-4" style={{ borderColor: C.hair }}>
                {[
                  ['Season', FARM.season],
                  ['Address', FARM.address],
                  ['On site', FARM.zoo],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4">
                    <dt className="font-manrope text-[11px] uppercase" style={{ color: C.muted, letterSpacing: '0.1em' }}>
                      {k}
                    </dt>
                    <dd className="font-manrope m-0 text-right text-[13.5px] font-medium" style={{ color: C.ink }}>
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
              <a
                href={`mailto:${FARM.email}`}
                className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-manrope text-[13.5px] font-semibold transition-transform active:scale-95"
                style={{ background: C.accent, color: C.surface }}
              >
                Ask about visiting <span aria-hidden>→</span>
              </a>
            </div>
          </Reveal>

          {/* where-to-buy / more at Brúnastaðir */}
          <Reveal delay={80}>
            <div
              className="w-full rounded-[10px] p-5"
              style={{ background: C.surface, border: `1px solid ${C.rule}`, boxShadow: '0 22px 48px rgba(36,27,18,0.14)' }}
            >
              <Caps color={C.pasture}>Where to find Brúnó</Caps>
              <p className="font-manrope mt-3 text-[13.5px] leading-[1.6]" style={{ color: C.muted }}>
                The wheels are sold direct, at the farm shop on site — the surest
                place to taste them is the valley itself.
              </p>
              <dl className="mt-4 flex flex-col gap-3 border-t pt-4" style={{ borderColor: C.hair }}>
                {MORE_AT.map((m) => (
                  <div key={m.k} className="flex items-baseline gap-3">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: C.accent }} />
                    <div>
                      <dt className="font-manrope text-[13.5px] font-semibold" style={{ color: C.ink }}>
                        {m.k}
                      </dt>
                      <dd className="font-manrope m-0 text-[12.5px] leading-[1.45]" style={{ color: C.muted }}>
                        {m.v}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
              <p className="font-manrope mt-4 text-[11px] leading-[1.5]" style={{ color: C.muted }}>
                Sold direct from the farm; no third-party stockists are listed here.
              </p>
            </div>
          </Reveal>

          {/* valley map */}
          <Reveal delay={140} className="flex">
            <div
              className="w-full self-stretch overflow-hidden rounded-[12px] p-5"
              style={{ background: C.surface, border: `1px solid ${C.rule}`, boxShadow: '0 26px 56px rgba(36,27,18,0.14)' }}
            >
              <div className="flex h-full flex-col">
                <Caps>The Fljót valley</Caps>
                <div className="mt-4 flex-1">
                  <ValleyMap />
                </div>
                <p className="font-manrope mt-4 text-[12.5px] leading-[1.5]" style={{ color: C.muted }}>
                  570 Fljót, Skagafjörður — NW Iceland. Map is an illustrative
                  sketch of the valley, not a survey.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════════
 *  NEWSLETTER / SIGN-OFF — final conversion action (NEW pre-footer)
 * ════════════════════════════════════════════════════════════════════════ */
function SignOff() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const bgRef = useParallax(0.06)
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) setSent(true)
  }
  return (
    <section className="relative overflow-hidden" style={{ background: C.ground, padding: 'clamp(80px,10vw,128px) 0' }} aria-label="Word from the valley">
      {/* faint full-bleed rind texture */}
      <div ref={bgRef} className="absolute inset-0 will-change-transform" style={{ inset: '-6% 0', opacity: 0.12 }} aria-hidden>
        <Img
          src={u(IMG.texture, 1800)}
          srcSet={srcSet(IMG.texture)}
          sizes="100vw"
          alt=""
          className="h-full w-full object-cover"
          fallbackClassName="bg-gradient-to-br from-[#C99C6A] to-[#8A4B22]"
        />
      </div>
      <div className="absolute inset-0" style={{ background: `linear-gradient(${C.ground}cc, ${C.ground}f2)` }} aria-hidden />

      <div className="relative mx-auto max-w-[760px] px-[26px] text-center">
        <Reveal>
          <Caps>Word from the valley</Caps>
          <h2 className="font-tryst mx-auto mt-4 max-w-[18ch] leading-[1.04]" style={{ color: C.ink, fontSize: 'clamp(34px,5.2vw,58px)', letterSpacing: '-0.01em' }}>
            Hear when the wheels are ready.
          </h2>
          <p className="font-manrope mx-auto mt-4 max-w-[440px] leading-[1.6]" style={{ color: C.muted, fontSize: '16px' }}>
            Cheese moves slowly in the north. Leave an email and we’ll write when a
            new batch comes out of the cave.
          </p>

          {sent ? (
            <div
              className="mx-auto mt-8 inline-flex items-center gap-2.5 rounded-full px-6 py-3.5"
              style={{ background: C.surface, border: `1px solid ${C.rule}` }}
              role="status"
            >
              <span aria-hidden style={{ color: C.pasture }}>
                ✓
              </span>
              <span className="font-manrope text-[14px] font-medium" style={{ color: C.ink }}>
                Takk — you’re on the list (prototype, nothing was sent).
              </span>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="mx-auto mt-8 flex w-full max-w-[460px] flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.is"
                aria-label="Email address"
                className="bru-input font-manrope flex-1 rounded-full px-5 py-3.5 text-[14px] outline-none"
                style={{ background: C.surface, border: `1px solid ${C.rule}`, color: C.ink }}
              />
              <button
                type="submit"
                className="rounded-full px-6 py-3.5 font-manrope text-[14px] font-semibold transition-transform active:scale-95"
                style={{ background: C.accent, color: C.surface }}
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="font-manrope mt-4 text-[11px]" style={{ color: C.muted }}>
            Prototype form — no backend, nothing is stored or sent.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#visit"
              className="rounded-full px-6 py-3 font-manrope text-[14px] font-semibold transition-transform active:scale-95"
              style={{ background: C.ink, color: C.surface }}
            >
              Visit the farm
            </a>
            <a
              href={`mailto:${FARM.email}`}
              className="rounded-full px-6 py-3 font-manrope text-[14px] font-semibold"
              style={{ border: `1px solid ${C.rule}`, color: C.ink }}
            >
              Email Brúnastaðir
            </a>
          </div>

          <div className="mx-auto mt-12 flex items-center justify-center gap-4" aria-hidden>
            <span className="h-px w-12" style={{ background: C.rule }} />
            <WaxSealInk />
            <span className="h-px w-12" style={{ background: C.rule }} />
          </div>
          <p className="font-tryst mt-4 text-[20px]" style={{ color: C.ink }}>
            Brúnastaðir · 570 Fljót, Skagafjörður
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ink-coloured wax seal for the sign-off (the band's on cream, not ochre) */
function WaxSealInk() {
  return (
    <svg width="40" height="40" viewBox="0 0 44 44" fill="none" aria-hidden className="shrink-0">
      <circle cx="22" cy="22" r="20" stroke={C.accent} strokeOpacity="0.5" strokeWidth="1" strokeDasharray="2 3" />
      <circle cx="22" cy="22" r="13" stroke={C.accent} strokeOpacity="0.8" strokeWidth="1.1" />
      <path d="M22 14 l2.1 4.6 5 .5 -3.8 3.3 1.2 4.9 -4.5 -2.6 -4.5 2.6 1.2 -4.9 -3.8 -3.3 5 -.5z" fill={C.accent} />
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════════════════
 *  PAGE
 * ════════════════════════════════════════════════════════════════════════ */
export default function BrunastadirPage() {
  useEffect(() => {
    document.title = 'Brúnastaðir · The Rind Library — farmhouse cheese, Fljót'
    setThemeColor(C.ground)
    return () => setThemeColor('#0a1320')
  }, [])

  return (
    <div className="font-manrope overflow-x-hidden" style={{ background: C.ground, color: C.ink }}>
      <style>{`
        #bru-root { scroll-behavior:smooth; }
        html:focus-within { scroll-behavior:smooth; }
        #bru-root ::selection { background:${C.accent}; color:${C.surface}; }
        #bru-root a:focus-visible, #bru-root button:focus-visible, #bru-root input:focus-visible { outline:2px solid ${C.accent}; outline-offset:3px; border-radius:inherit; }
        #recognised a:focus-visible, #recognised button:focus-visible { outline-color:${C.surface}; }
        #bru-root .cheese:focus-visible { outline:2px solid ${C.accent}; outline-offset:6px; border-radius:10px; }
        #bru-root .bru-input:focus-visible { outline:2px solid ${C.accent}; outline-offset:2px; }
        /* nav active underline */
        .nav-link { position:relative; }
        .nav-underline { position:absolute; left:0; right:0; bottom:-6px; height:2px; transform-origin:left; transition:transform .35s cubic-bezier(.2,.8,.2,1); }
        /* Hero entrance — base state VISIBLE; keyframe drops it in. */
        .hs-rise { opacity:1; }
        .hs-chip { opacity:1; }
        .seal-stamp { display:inline-flex; }
        .bru-marquee { animation:none; }
        @media (prefers-reduced-motion: no-preference) {
          .hs-rise { animation: hs-rise .9s cubic-bezier(.2,.8,.2,1) var(--d,0ms) both; }
          @keyframes hs-rise { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:none; } }
          .hs-chip { animation: hs-rise .8s cubic-bezier(.2,.8,.2,1) var(--d,0ms) both; }
          .hs-breathe { animation: hs-breathe 22s ease-in-out infinite alternate; }
          @keyframes hs-breathe { from { transform:rotate(-0.4deg); } to { transform:rotate(0.4deg); } }
          .hs-bob { display:inline-block; animation: hs-bob 1.8s ease-in-out infinite; }
          @keyframes hs-bob { 0%,100% { transform:translateY(0); } 50% { transform:translateY(4px); } }
          .hs-fade-late { animation: hs-fadein 1s ease 1.1s both; }
          @keyframes hs-fadein { from { opacity:0; } to { opacity:.9; } }
          .seal-row .seal-stamp { animation: hs-stamp .6s cubic-bezier(.2,.9,.3,1) both; }
          @keyframes hs-stamp { 0% { transform:scale(1.18) rotate(-6deg); opacity:0; } 60% { opacity:1; } 100% { transform:scale(1) rotate(0); opacity:1; } }
          .ping-ring { transform-origin:160px 150px; animation: hs-ping 2.6s ease-out infinite; }
          @keyframes hs-ping { 0% { transform:scale(1); opacity:.9; } 70%,100% { transform:scale(3.4); opacity:0; } }
          .cheese-note { max-height:0; opacity:0; transition:max-height .35s ease, opacity .3s ease, margin-top .35s ease; margin-top:0; }
          .cheese:hover .cheese-note, .group:hover .cheese-note, .cheese:focus-within .cheese-note { max-height:120px; opacity:1; margin-top:.75rem; }
          .pair-card:hover { transform:translateY(-4px); }
          .bru-marquee { animation: bru-scroll 38s linear infinite; }
          @keyframes bru-scroll { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        }
        @media (prefers-reduced-motion: reduce) {
          .cheese-note { max-height:none; opacity:1; }
          .nav-underline { transition:none; }
        }
        @media (max-width: 767px) {
          .cheese-note { max-height:none !important; opacity:1 !important; margin-top:.75rem !important; }
        }
      `}</style>
      <div id="bru-root">
        <PreviewChrome company={company} />
        <PartialPrototypeBanner />
        <Nav />
        <main>
          <HeroSignature />
          <Overture />
          <ProvenanceStrip />
          <Library />
          <Pairings />
          <Recognised />
          <Marquee />
          <Visit />
          <SignOff />
        </main>
        <PreviewFooter company={company} />
      </div>
    </div>
  )
}
