import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  motion,
  useAnimationControls,
  useReducedMotion,
  type Transition,
} from 'framer-motion'
import { Clock, ExternalLink, Flame, MapPin, Phone, Ticket } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import {
  ATMO_ID,
  EXHIBITS,
  HOURS,
  PHONE,
  PHONE_TEL,
  SITES,
  STAVES,
  TICKETS,
  type Stave,
} from './data'

const company = getPreviewCompany('galdrasyning')

const U = 'https://images.unsplash.com/'
const atmoSrc = `${U}${ATMO_ID}?q=80&w=2000&auto=format&fit=crop`
const atmoSrcSet = [828, 1280, 2000]
  .map((w) => `${U}${ATMO_ID}?q=80&w=${w}&auto=format&fit=crop ${w}w`)
  .join(', ')

/** Engraver's carve easing — slow, deliberate, never bouncy. */
const EASE = [0.22, 1, 0.36, 1] as const

/**
 * "Kindle" flicker — a tiny, asymmetric candle-flame opacity shimmer used on
 * hover. Low amplitude (never dips far), quick, as if a flame moved past the
 * gold. Shared by CTAs, the map link and stave cards so the whole surface
 * reacts to touch the same way: light, not motion.
 */
const KINDLE_KEYFRAMES = [1, 0.9, 1, 0.95, 1]
const KINDLE_TRANSITION: Transition = { duration: 0.42, ease: 'easeInOut' }

/** Ticket-enquiry mailto with a pre-filled, editable Icelandic template. */
function ticketMailto() {
  const subject = 'Fyrirspurn um miða — Galdrasýning á Ströndum'
  const body = [
    'Góðan dag,',
    '',
    'Mig langar að heimsækja Galdrasýninguna.',
    'Dagsetning: ',
    'Fjöldi fullorðinna: ',
    'Fjöldi barna (og aldur): ',
    'Viljum við líka skoða Kotbýlið í Bjarnarfirði? ',
    '',
    'Takk fyrir.',
  ].join('\n')
  return `mailto:${company.ownerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

/* ------------------------------------------------------------------ *
 * Original motion components (no shared Reveal — this direction owns
 * its reveals).
 * ------------------------------------------------------------------ */

/** Soft fade + rise as content scrolls into view. */
function FadeUp({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'li' | 'section' | 'figure'
}) {
  const MotionTag = motion[Tag]
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  )
}

/**
 * SIGNATURE: a galdrastafur that "inscribes" itself — every stroke draws on
 * with a stroke-dashoffset animation when scrolled into view, over a faint
 * engraved groove that is already present (so the gold nib appears to be
 * carving into existing shadow). Under reduced motion the stave is shown fully
 * drawn (no animation). whileInView is IntersectionObserver-based, which works
 * in this environment.
 *
 * Elevations in this pass:
 *  - `onInscribed`: fired as the LAST stroke completes its draw-on, so a parent
 *    (the hero) can brighten the candle glow in time with the inscription —
 *    "the act of inscribing lights the room."
 *  - `interactive`: on hover/focus the single most defining stroke re-traces
 *    (a quick pathLength redraw) and the whole gold line kindles (flicker),
 *    so the mark feels alive. No translate, no scale.
 */
function InscribeStave({
  stave,
  size = 120,
  strokeWidth = 2,
  className,
  duration = 1.8,
  decorative = false,
  onInscribed,
  interactive = false,
  hovered = false,
}: {
  stave: Stave
  size?: number
  strokeWidth?: number
  className?: string
  duration?: number
  /** Purely ornamental instances are hidden from assistive tech. */
  decorative?: boolean
  /** Called once when the final stroke finishes inscribing (not under reduce). */
  onInscribed?: () => void
  /** Enable the hover re-trace of the signature stroke. */
  interactive?: boolean
  /** Driven by the parent card's hover/focus state. */
  hovered?: boolean
}) {
  const reduce = useReducedMotion()
  const lastIndex = stave.paths.length - 1
  const sigIndex = stave.signatureStroke ?? 0
  // Re-trace token: bumping it restarts the signature stroke's draw.
  const retrace = useAnimationControls()
  const kindling = interactive && hovered && !reduce

  useEffect(() => {
    if (reduce || !interactive) return
    if (hovered) {
      retrace.set({ pathLength: 0 })
      retrace.start({
        pathLength: 1,
        transition: { duration: 0.5, ease: EASE },
      })
    }
  }, [hovered, interactive, reduce, retrace])

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      {...(decorative
        ? { 'aria-hidden': true }
        : { role: 'img', 'aria-label': `Teiknaður galdrastafur: ${stave.name}` })}
    >
      {/* faint engraved shadow underneath, always visible */}
      <g
        stroke="#3a2c14"
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.45}
        transform="translate(0.8 1)"
        aria-hidden="true"
      >
        {stave.paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      {/* the glowing gold line that inscribes itself */}
      <motion.g
        stroke="#d4af52"
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        // whole-line kindle flicker on hover (no movement, just light). Only
        // attach an opacity animation while actively kindling — otherwise leave
        // a plain attribute so framer never reads an undefined SVG base.
        {...(kindling
          ? { animate: { opacity: KINDLE_KEYFRAMES }, transition: KINDLE_TRANSITION }
          : { opacity: 1 })}
      >
        {stave.paths.map((d, i) => {
          const isSig = interactive && i === sigIndex
          // pathLength is the carve; opacity stays a static attribute (animating
          // SVG-path opacity makes framer read an undefined base → console warn).
          return (
            <motion.path
              key={i}
              d={d}
              initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ pathLength: { duration, ease: EASE, delay: i * 0.07 } }}
              onAnimationComplete={
                i === lastIndex && onInscribed && !reduce ? onInscribed : undefined
              }
              // signature stroke is also bound to the hover re-trace controls
              {...(isSig ? { animate: retrace } : {})}
            />
          )
        })}
      </motion.g>
    </svg>
  )
}

/**
 * Candlelight radial glow. A single breathing flame (6.5s opacity+scale pulse)
 * that, on the hero, can be briefly BRIGHTENED in time with stave-stroke
 * completion via `flare` — so inscribing the rune literally lights the room.
 * Gated to static under reduced motion.
 */
function CandleGlow({
  className = 'left-1/2 top-[34%] h-[78vw] w-[78vw] max-h-[640px] max-w-[640px]',
  flare = 0,
}: {
  /** Position/size utility classes for this glow instance. */
  className?: string
  /** Bumped externally to pulse a brief brightening flare. */
  flare?: number
}) {
  const reduce = useReducedMotion()
  const controls = useAnimationControls()

  // Brief brightening flare, layered on top of the steady breathing pulse.
  useEffect(() => {
    if (reduce || flare === 0) return
    controls.start({
      opacity: [1, 1.18, 1],
      scale: [1.0, 1.06, 1.0],
      transition: { duration: 0.9, ease: 'easeOut' },
    })
  }, [flare, reduce, controls])

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -z-10 -translate-x-1/2 -translate-y-1/2 rounded-full ${className}`}
    >
      {/* steady breathing flame */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle at center, rgba(212,175,82,0.32) 0%, rgba(176,138,52,0.16) 38%, rgba(110,33,32,0.10) 62%, rgba(12,10,8,0) 78%)',
        }}
        initial={false}
        animate={reduce ? { opacity: 0.9 } : { opacity: [0.78, 1, 0.78], scale: [1, 1.045, 1] }}
        transition={reduce ? undefined : { duration: 6.5, ease: 'easeInOut', repeat: Infinity }}
      />
      {/* flare layer that brightens as strokes complete */}
      {!reduce && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(circle at center, rgba(212,175,82,0.22) 0%, rgba(212,175,82,0.08) 40%, rgba(12,10,8,0) 70%)',
          }}
          initial={{ opacity: 0, scale: 1 }}
          animate={controls}
        />
      )}
    </div>
  )
}

/**
 * KindleLink — a CTA / link that "kindles" on hover/focus: the gold warms and
 * a faint candle-flicker plays across it. No scale, no lift, no shadow-pop.
 * Renders an <a>; passes through the usual anchor props.
 */
function KindleLink({
  href,
  children,
  className,
  target,
  rel,
  tabIndex,
  ariaHidden,
  flame = 'dark',
}: {
  href: string
  children: ReactNode
  className?: string
  target?: string
  rel?: string
  tabIndex?: number
  ariaHidden?: boolean
  /** 'dark' = gold-filled button (ink on gold); 'light' = outline on dark. */
  flame?: 'dark' | 'light'
}) {
  const reduce = useReducedMotion()
  const [lit, setLit] = useState(false)
  const kindle = lit && !reduce
  return (
    <motion.a
      href={href}
      target={target}
      rel={rel}
      tabIndex={tabIndex}
      aria-hidden={ariaHidden}
      className={className}
      onHoverStart={() => setLit(true)}
      onHoverEnd={() => setLit(false)}
      onFocus={() => setLit(true)}
      onBlur={() => setLit(false)}
      style={{ opacity: 1 }}
      {...(kindle
        ? {
            animate: {
              opacity: flame === 'dark' ? [1, 0.94, 1, 0.97, 1] : KINDLE_KEYFRAMES,
            },
            transition: KINDLE_TRANSITION,
          }
        : {})}
    >
      {children}
    </motion.a>
  )
}

/**
 * Stave gallery card — the stave inscribes on scroll, then re-traces its
 * signature stroke and kindles when the card is hovered/focused. Border warms
 * to gold on hover (no lift, no scale — light, not motion).
 */
function StaveGalleryCard({ stave, delay }: { stave: Stave; delay: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <FadeUp
      as="li"
      delay={delay}
      className="group flex flex-col items-center rounded-lg border border-[#b08a34]/18 bg-[#100c08] px-3 py-6 text-center transition-colors duration-500 hover:border-[#d4af52]/55 focus-within:border-[#d4af52]/55"
    >
      <div
        tabIndex={0}
        role="group"
        aria-label={stave.name}
        className="flex flex-col items-center rounded-md outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d4af52]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        <InscribeStave
          stave={stave}
          size={92}
          strokeWidth={2.4}
          duration={1.9}
          interactive
          hovered={hovered}
        />
        <h3 className="mt-4 font-cinzel text-[0.92rem] text-[#e8d9b8]">{stave.name}</h3>
        <p className="mt-1.5 text-[0.74rem] leading-snug text-[#d8cab0]/60">{stave.gloss}</p>
      </div>
    </FadeUp>
  )
}

/** Parchment stave aside in the SAGAN section — inscribes, then re-traces. */
function StaveAside({ stave }: { stave: Stave }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      tabIndex={0}
      role="group"
      aria-label={stave.name}
      className={`relative w-full rounded-lg border border-[#b08a34]/25 p-7 outline-none transition-colors duration-500 hover:border-[#6e2120]/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af52] ${PARCHMENT}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div className="flex justify-center">
        <InscribeStave
          stave={stave}
          size={150}
          strokeWidth={2.4}
          duration={2.2}
          interactive
          hovered={hovered}
          className="[&_path]:[stroke:#3a2614]"
        />
      </div>
      <figcaption className="mt-5 text-center">
        <p className="font-cinzel text-base text-[#3a2614]">{stave.name}</p>
        <p className="mt-1.5 text-[0.82rem] leading-snug text-[#5a4326]">{stave.gloss}</p>
      </figcaption>
    </div>
  )
}

/** Parchment-texture panel surface via layered CSS gradients. */
const PARCHMENT =
  'bg-[#d8cab0] [background-image:radial-gradient(circle_at_20%_15%,rgba(110,33,32,0.06),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(60,44,20,0.10),transparent_50%),linear-gradient(180deg,#ded2ba,#d2c3a6)]'

/* ------------------------------------------------------------------ */

export default function Page() {
  const reduce = useReducedMotion()

  useEffect(() => {
    document.title = 'Galdrasýning á Ströndum (hugmynd)'
  }, [])

  // Mobile sticky CTA: manual passive scroll listener (no Framer scroll
  // values for load-bearing UI — they're throttled here).
  const [showBar, setShowBar] = useState(false)
  const ticking = useRef(false)
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        setShowBar(window.scrollY > 620)
        ticking.current = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { href: '#syningin', label: 'Sýningin' },
    { href: '#sagan', label: 'Sagan' },
    { href: '#heimsokn', label: 'Heimsókn' },
    { href: '#midar', label: 'Miðar' },
  ]

  // Glow flares: bumped when a hero / final-CTA stave finishes inscribing, so
  // the candlelight visibly brightens as the rune is carved.
  const [heroFlare, setHeroFlare] = useState(0)
  const [finalFlare, setFinalFlare] = useState(0)

  return (
    <div
      lang="is"
      className="min-h-screen bg-[#0c0a08] font-sans text-[#d8cab0] antialiased selection:bg-[#b08a34]/40"
    >
      <PreviewChrome company={company} />

      {/* ---------------- NAV ---------------- */}
      <header className="sticky top-0 z-30 border-b border-[#b08a34]/15 bg-[#0c0a08]/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <a
            href="#top"
            className="flex items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af52]"
          >
            <InscribeStave stave={STAVES[1]} size={30} strokeWidth={3} duration={1.1} decorative />
            <span className="font-cinzel text-[0.78rem] leading-none tracking-normal text-[#e8d9b8] sm:text-sm">
              Galdrasýning
            </span>
          </a>

          <ul className="hidden items-center gap-7 md:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[#d8cab0]/70 transition-colors hover:text-[#d4af52] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af52]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <KindleLink
            href="#midar"
            flame="light"
            className="rounded-full border border-[#b08a34]/50 bg-[#b08a34]/10 px-4 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[#e8d9b8] transition-colors hover:bg-[#b08a34]/25 hover:border-[#d4af52]/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af52]"
          >
            Kaupa miða
          </KindleLink>
        </nav>
      </header>

      {/* ---------------- HERO ---------------- */}
      <section
        id="top"
        className="grain relative overflow-hidden px-5 pb-20 pt-16 sm:pt-24 md:pb-28"
      >
        <CandleGlow flare={heroFlare} />
        {/* vignette top + bottom to seat the glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_50%_30%,transparent_30%,#0c0a08_82%)]"
        />

        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <FadeUp>
            <p className="mb-7 font-mono text-[0.7rem] uppercase tracking-[0.34em] text-[#d4af52]/85">
              Strandagaldur · síðan 2000
            </p>
          </FadeUp>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.1 }}
            className="mb-8"
          >
            <InscribeStave
              stave={STAVES[0]}
              size={132}
              strokeWidth={2.2}
              duration={2.4}
              decorative
              onInscribed={() => setHeroFlare((n) => n + 1)}
            />
          </motion.div>

          <h1 className="font-cinzel text-[2rem] font-semibold leading-[1.22] tracking-[0.01em] text-[#efe2c4] [text-wrap:balance] sm:text-5xl sm:leading-[1.18] md:text-6xl md:leading-[1.16]">
            Galdrasýning
            <span className="block pt-2 text-[#d4af52]">á Ströndum</span>
          </h1>

          <FadeUp delay={0.15}>
            <p className="mx-auto mt-7 max-w-xl text-balance text-[0.98rem] leading-relaxed text-[#d8cab0]/80 sm:text-lg">
              Safn íslenskrar galdratrúar í hálfrökkri. Saga galdrastafa, galdrabóka og
              galdrabrennanna á 17. öld — sögð af virðingu við höfnina í Hólmavík.
            </p>
          </FadeUp>

          <FadeUp
            delay={0.32}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <KindleLink
              href="#midar"
              flame="dark"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b08a34] px-7 py-3.5 font-mono text-[0.74rem] uppercase tracking-[0.14em] text-[#0c0a08] transition-colors hover:bg-[#d4af52] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af52]"
            >
              <Ticket className="h-4 w-4" aria-hidden="true" />
              Kaupa miða
            </KindleLink>
            <KindleLink
              href="#heimsokn"
              flame="light"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d8cab0]/25 px-7 py-3.5 font-mono text-[0.74rem] uppercase tracking-[0.14em] text-[#d8cab0]/90 transition-colors hover:border-[#d4af52]/60 hover:text-[#d4af52] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af52]"
            >
              <Clock className="h-4 w-4" aria-hidden="true" />
              Opnunartími
            </KindleLink>
          </FadeUp>

          <FadeUp delay={0.42} className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
            {['Hólmavík', 'Strandir', 'Vestfirðir'].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-[#b08a34]/30 bg-[#b08a34]/[0.06] px-3.5 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-[#d8cab0]/70"
              >
                {chip}
              </span>
            ))}
          </FadeUp>
        </div>
      </section>

      {/* ---------------- ATMOSPHERIC BAND ---------------- */}
      <section className="relative overflow-hidden">
        <Img
          src={atmoSrc}
          srcSet={atmoSrcSet}
          sizes="100vw"
          alt="Mynd í hálfrökkri"
          loading="eager"
          fetchpriority="high"
          className="h-[44vh] min-h-[300px] w-full object-cover sm:h-[52vh]"
          fallbackClassName="bg-gradient-to-b from-[#1a130b] via-[#0c0a08] to-[#1a130b]"
        />
        {/* heavy dark scrim for mood + contrast */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,8,0.82),rgba(12,10,8,0.66)_45%,rgba(12,10,8,0.92))]"
        />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <FadeUp className="max-w-2xl text-center">
            <p className="font-cinzel text-xl leading-[1.5] text-[#efe2c4] sm:text-2xl sm:leading-[1.5]">
              Til var öld þegar fólk trúði því að rétt ristur stafur réði meiru
              en sverð og spjót.
            </p>
            <p className="mt-4 font-mono text-[0.66rem] uppercase tracking-[0.22em] text-[#d4af52]/80">
              Galdrasýning á Ströndum
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ---------------- SAGAN ---------------- */}
      <section id="sagan" className="relative px-5 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <FadeUp className="mb-12 max-w-2xl">
            <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-[#d4af52]/85">
              Sagan
            </p>
            <h2 className="font-cinzel text-[1.7rem] leading-[1.25] text-[#efe2c4] sm:text-4xl sm:leading-[1.22]">
              Galdratrú og brennur á Ströndum
            </h2>
          </FadeUp>

          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-start md:gap-16">
            <div className="space-y-5 text-[0.98rem] leading-relaxed text-[#d8cab0]/85 sm:text-[1.02rem]">
              <FadeUp as="div">
                <p>
                  Á 17. öld var Ísland gegnsýrt trú á galdra. Fólk reisti sér varnir með
                  ristum táknum, las galdrabækur í laumi og óttaðist hvort tveggja: að verða
                  fyrir göldrum og að vera sakað um þá. Strandir urðu þungamiðja þessarar sögu.
                </p>
              </FadeUp>
              <FadeUp as="div" delay={0.05}>
                <p>
                  Galdrabrennurnar — ofsóknir gegn meintum galdramönnum — kostuðu rúmlega
                  tuttugu manns lífið hér á landi á 17. öld. Ólíkt því sem þekktist í Evrópu voru
                  það nær eingöngu karlar sem brenndir voru á báli. Þetta er harmsaga
                  raunverulegs fólks, og hún er sögð hér af alúð og virðingu.
                </p>
              </FadeUp>
              <FadeUp as="div" delay={0.1}>
                <p>
                  Galdrasýningin, rekin af Strandagaldri frá árinu 2000, varðveitir þessa sögu:
                  galdrastafina, trúna og örlög fólksins sem lifði í skugga hennar. Markmiðið er
                  ekki að hræða, heldur að skilja.
                </p>
              </FadeUp>
            </div>

            {/* stave aside that inscribes itself, then re-traces on hover */}
            <FadeUp as="figure" className="flex flex-col items-center">
              <StaveAside stave={STAVES[1]} />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ---------------- SÝNINGIN ---------------- */}
      <section id="syningin" className="grain relative border-y border-[#b08a34]/12 bg-[#0a0806] px-5 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <FadeUp className="mb-14 max-w-2xl">
            <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-[#d4af52]/85">
              Sýningin
            </p>
            <h2 className="font-cinzel text-[1.7rem] leading-[1.25] text-[#efe2c4] sm:text-4xl sm:leading-[1.22]">
              Það sem bíður þín í rökkrinu
            </h2>
            <p className="mt-5 text-[0.98rem] leading-relaxed text-[#d8cab0]/75">
              Engar æpandi myndir — bara stafirnir, sögurnar og stemningin. Þetta er það sem
              þú sérð þegar þú gengur inn.
            </p>
          </FadeUp>

          {/* drawn stave gallery */}
          <ul className="mb-16 grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-6">
            {STAVES.map((s, i) => (
              <StaveGalleryCard key={s.name} stave={s} delay={i * 0.08} />
            ))}
          </ul>

          {/* exhibit copy, typography-led — each card marked by a small inscribing glyph */}
          <div className="grid gap-px overflow-hidden rounded-lg border border-[#b08a34]/15 bg-[#b08a34]/10 sm:grid-cols-3">
            {EXHIBITS.map((ex, i) => (
              <FadeUp
                key={ex.title}
                delay={i * 0.08}
                className="bg-[#0c0a08] p-6 sm:p-7"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-[#d4af52]/80">
                    {ex.kicker}
                  </p>
                  <InscribeStave
                    stave={STAVES[ex.stave]}
                    size={34}
                    strokeWidth={3}
                    duration={1.5}
                    decorative
                    className="-mt-1 shrink-0 opacity-70"
                  />
                </div>
                <h3 className="mt-2 font-cinzel text-lg leading-[1.3] text-[#e8d9b8]">
                  {ex.title}
                </h3>
                <span
                  aria-hidden="true"
                  className="mt-3 block h-px w-10 bg-gradient-to-r from-[#d4af52]/70 to-transparent"
                />
                <p className="mt-3 text-[0.88rem] leading-relaxed text-[#d8cab0]/75">{ex.body}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- HEIMSÓKN ---------------- */}
      <section id="heimsokn" className="relative px-5 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <FadeUp className="mb-12 max-w-2xl">
            <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-[#d4af52]/85">
              Heimsókn
            </p>
            <h2 className="font-cinzel text-[1.7rem] leading-[1.25] text-[#efe2c4] sm:text-4xl sm:leading-[1.22]">
              Að finna okkur á Ströndum
            </h2>
          </FadeUp>

          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
            {/* two sites */}
            <div className="space-y-5">
              {SITES.map((site, i) => (
                <FadeUp
                  key={site.name}
                  delay={i * 0.08}
                  className="rounded-lg border border-[#b08a34]/20 bg-[#100c08] p-6 transition-colors duration-500 hover:border-[#b08a34]/40"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#d4af52]" aria-hidden="true" />
                    <div className="min-w-0">
                      <h3 className="font-cinzel text-lg text-[#e8d9b8]">{site.name}</h3>
                      <p className="mt-0.5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-[#d4af52]/75">
                        {site.role}
                      </p>
                      <p className="mt-2.5 text-[0.9rem] leading-relaxed text-[#d8cab0]/80">
                        {site.desc}
                      </p>
                      <KindleLink
                        href={site.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        flame="light"
                        className="mt-3.5 inline-flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-[#d4af52]/90 transition-colors hover:text-[#d4af52] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af52]"
                      >
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                        Finna á korti
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </KindleLink>
                    </div>
                  </div>
                </FadeUp>
              ))}

              <FadeUp className="rounded-lg border border-[#6e2120]/35 bg-[#6e2120]/[0.12] p-6">
                <div className="flex items-start gap-3">
                  <Flame className="mt-0.5 h-5 w-5 shrink-0 text-[#d4af52]" aria-hidden="true" />
                  <div>
                    <h3 className="font-cinzel text-lg text-[#e8d9b8]">Kaffi Galdur</h3>
                    <p className="mt-2 text-[0.9rem] leading-relaxed text-[#d8cab0]/80">
                      Kaffihús safnsins við höfnina — heimabakað, súpa dagsins og útsýni yfir
                      Steingrímsfjörð. Tilvalin hvíld á Strandaleiðinni.
                    </p>
                  </div>
                </div>
              </FadeUp>
            </div>

            {/* hours + directions */}
            <div className="space-y-6">
              <FadeUp className={`rounded-lg border border-[#b08a34]/25 p-6 ${PARCHMENT}`}>
                <div className="flex items-center gap-2.5">
                  <Clock className="h-5 w-5 text-[#6e2120]" aria-hidden="true" />
                  <h3 className="font-cinzel text-lg text-[#3a2614]">Opnunartími</h3>
                </div>
                <dl className="mt-4 space-y-3">
                  {HOURS.map((h) => (
                    <div
                      key={h.when}
                      className="flex items-baseline justify-between gap-4 border-b border-[#3a2614]/15 pb-3 last:border-0 last:pb-0"
                    >
                      <dt className="text-[0.9rem] text-[#3a2614]">{h.when}</dt>
                      <dd className="font-mono text-[0.82rem] font-bold text-[#3a2614]">{h.time}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-[0.76rem] leading-snug text-[#4a3318]">
                  Tímar eru sýnishorn. Best er að hafa samband og staðfesta opnun yfir
                  háveturinn.
                </p>
              </FadeUp>

              <FadeUp delay={0.08} className="rounded-lg border border-[#b08a34]/20 bg-[#100c08] p-6">
                <h3 className="font-cinzel text-lg text-[#e8d9b8]">Á leiðinni</h3>
                <p className="mt-2.5 text-[0.9rem] leading-relaxed text-[#d8cab0]/80">
                  Hólmavík er á þjóðvegi 61, um 230 km frá Reykjavík. Sýningin er niðri við
                  höfnina og auðfundin í þorpinu. Kotbýlið er norðar í Bjarnarfirði.
                </p>
                <p className="mt-4 text-[0.84rem] leading-relaxed text-[#d8cab0]/65">
                  Galdrasýningin er rótgróinn áfangastaður á Ströndum og fær reglulega lof
                  ferðamanna og umfjöllun í ferðahandbókum.
                </p>
                <KindleLink
                  href={`tel:${PHONE_TEL}`}
                  flame="light"
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#b08a34]/45 px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[#e8d9b8] transition-colors hover:bg-[#b08a34]/20 hover:border-[#d4af52]/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af52]"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Sími {PHONE}
                </KindleLink>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- MIÐAR ---------------- */}
      <section id="midar" className="grain relative border-t border-[#b08a34]/12 bg-[#0a0806] px-5 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <FadeUp className="mb-12 text-center">
            <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-[#d4af52]/85">
              Miðar
            </p>
            <h2 className="font-cinzel text-[1.7rem] leading-[1.25] text-[#efe2c4] sm:text-4xl sm:leading-[1.22]">
              Aðgangur að sýningunni
            </h2>
          </FadeUp>

          <ul className="grid gap-5 sm:grid-cols-3">
            {TICKETS.map((t, i) => (
              <FadeUp
                as="li"
                key={t.name}
                delay={i * 0.08}
                className="flex flex-col rounded-lg border border-[#b08a34]/25 bg-[#100c08] p-6 text-center transition-colors duration-500 hover:border-[#d4af52]/45"
              >
                <h3 className="font-cinzel text-[1.05rem] leading-snug text-[#e8d9b8]">{t.name}</h3>
                <p className="mt-4 font-cinzel text-3xl text-[#d4af52]">{t.price}</p>
                <p className="mt-3 text-[0.8rem] leading-snug text-[#d8cab0]/65">{t.note}</p>
              </FadeUp>
            ))}
          </ul>

          <FadeUp className="mt-10 flex flex-col items-center gap-4">
            <KindleLink
              href={ticketMailto()}
              flame="dark"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b08a34] px-9 py-4 font-mono text-[0.78rem] uppercase tracking-[0.14em] text-[#0c0a08] transition-colors hover:bg-[#d4af52] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af52]"
            >
              <Ticket className="h-4 w-4" aria-hidden="true" />
              Senda fyrirspurn
            </KindleLink>
            <p className="max-w-md text-center text-[0.78rem] leading-snug text-[#d8cab0]/70">
              Verð eru sýnishorn. Sendu okkur fyrirspurn og við staðfestum dagsetningu og
              fjölda — eða borgaðu á staðnum við komu.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ---------------- FINAL CTA ---------------- */}
      <section className="grain relative overflow-hidden px-5 py-24 text-center md:py-32">
        {/* the same breathing candle carries through to the close */}
        <CandleGlow
          flare={finalFlare}
          className="left-1/2 top-1/2 h-[60vw] w-[60vw] max-h-[480px] max-w-[480px]"
        />
        <FadeUp className="mx-auto max-w-2xl">
          <div className="mb-8 flex justify-center">
            <InscribeStave
              stave={STAVES[2]}
              size={110}
              strokeWidth={2.2}
              duration={2.2}
              decorative
              onInscribed={() => setFinalFlare((n) => n + 1)}
            />
          </div>
          <h2 className="font-cinzel text-[1.6rem] leading-[1.28] text-[#efe2c4] sm:text-4xl sm:leading-[1.24]">
            Stígðu inn í rökkrið
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[0.98rem] leading-relaxed text-[#d8cab0]/80">
            Komdu við í Hólmavík, kynnstu galdratrúnni og fáðu þér kaffi við höfnina.
            Galdrasýningin bíður á Strandaleiðinni.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <KindleLink
              href="#midar"
              flame="dark"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b08a34] px-8 py-3.5 font-mono text-[0.76rem] uppercase tracking-[0.14em] text-[#0c0a08] transition-colors hover:bg-[#d4af52] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af52]"
            >
              <Ticket className="h-4 w-4" aria-hidden="true" />
              Kaupa miða
            </KindleLink>
            <KindleLink
              href={`mailto:${company.ownerEmail}`}
              flame="light"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d8cab0]/25 px-8 py-3.5 font-mono text-[0.76rem] uppercase tracking-[0.14em] text-[#d8cab0]/90 transition-colors hover:border-[#d4af52]/60 hover:text-[#d4af52] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af52]"
            >
              Hafa samband
            </KindleLink>
          </div>
        </FadeUp>
      </section>

      {/* ---------------- MOBILE STICKY CTA ---------------- */}
      <motion.div
        aria-hidden={!showBar}
        initial={false}
        animate={{ y: showBar ? 0 : 120, opacity: showBar ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { type: 'spring', damping: 26, stiffness: 280 }}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[#b08a34]/25 bg-[#0c0a08]/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-cinzel text-[0.78rem] leading-tight text-[#e8d9b8]">
              Galdrasýning á Ströndum
            </p>
            <p className="truncate font-mono text-[0.64rem] uppercase tracking-[0.1em] text-[#d8cab0]/70">
              Opið daglega · Hólmavík
            </p>
          </div>
          <a
            href="#midar"
            tabIndex={showBar ? 0 : -1}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#b08a34] px-5 py-3 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-[#0c0a08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af52]"
          >
            <Ticket className="h-3.5 w-3.5" aria-hidden="true" />
            Miðar
          </a>
        </div>
      </motion.div>

      <PreviewFooter company={company} />
    </div>
  )
}
