/**
 * Húnabúð / Bæjarblómið — "Þrennt undir einu þaki".
 *
 * Concept: the real building already carries three signs side by side
 * (Húnabúð coffee, Bæjarblómið flowers, gift shop). The page makes that
 * literal fact legible and warm. Photography leads; motion is seasoning.
 *
 * Signature (ONE scroll-linked element): the "one roof" thread — a hand-drawn
 * wavy SVG line that stitches the three pillars together as you scroll the
 * pillar section, drawing pine-green → terracotta. Driven by scrollYProgress
 * through STYLE props on motion.path (style props subscribe to MotionValues;
 * the `d` attribute is never animated — ledger #19). Reduced motion renders it
 * fully drawn and static.
 *
 * Elevation (brief Part D), adapted into this stack (Framer Motion + Tailwind
 * v4, self-hosted, no new deps):
 *  1. Hero headline = word-level "vertical cut reveal" (mount-triggered),
 *     plain <h1> under prefers-reduced-motion.
 *  2. Three pillars = hover / tap / keyboard reveal cards, restyled to the
 *     pine + parchment palette, with touch + keyboard support the pulled
 *     component lacked.
 */
import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { MapPin, Phone } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  ADDRESS,
  C,
  CAFE_ITEMS,
  FONT,
  GIFTS,
  HOURS,
  IMG,
  MAP_EMBED,
  MAPS_HREF,
  OCCASIONS,
  PHONE_MAIN,
  PHONE_MAIN_TEL,
  PHONE_MOBILE,
  PHONE_MOBILE_TEL,
  PILLARS,
  REVIEWS,
  type ImgKey,
} from './data'

const company = getPreviewCompany('hunabud')
const EASE = [0.22, 1, 0.36, 1] as const
const asset = (p: string) => import.meta.env.BASE_URL + p

/* ------------------------------------------------------------------ helpers */

/** Word-level cut reveal for the hero headline. Mount-triggered. */
function WordCutReveal({
  text,
  reduced,
  className,
  style,
}: {
  text: string
  reduced: boolean
  className?: string
  style?: React.CSSProperties
}) {
  const words = text.split(' ')
  if (reduced) {
    return (
      <span className={className} style={style}>
        {text}
      </span>
    )
  }
  return (
    <span className={className} style={style} aria-label={text}>
      {words.map((w, i) => (
        // overflow-hidden mask is safe here: this headline has no floating
        // uppercase acutes (Í/Á/Ó/Ú/Ý/Æ/Ö); extra top padding gives Þ room.
        <span
          key={i}
          aria-hidden
          className="inline-block overflow-hidden pt-[0.12em] align-bottom"
          style={{ marginRight: '0.28em' }}
        >
          <motion.span
            className="inline-block"
            initial={{ y: '108%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.15 + i * 0.09 }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/** Standalone content photo — clip-path reveal on scroll-in (observer on the
 *  untransformed wrapper; the inner img carries the clip). Explicit aspect. */
function ClipImage({
  imgKey,
  alt,
  className,
  aspect,
  reduced,
  priority,
  position,
}: {
  imgKey: ImgKey
  alt: string
  className?: string
  aspect: string
  reduced: boolean
  priority?: boolean
  position?: string
}) {
  return (
    <div className={`relative overflow-hidden ${className ?? ''}`} style={{ aspectRatio: aspect }}>
      <motion.img
        src={asset(IMG[imgKey])}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...(priority ? { fetchpriority: 'high' as const } : {})}
        className="h-full w-full object-cover"
        style={{ objectPosition: position ?? 'center' }}
        initial={reduced ? false : { clipPath: 'inset(0 0 100% 0)', scale: 1.08 }}
        whileInView={{ clipPath: 'inset(0 0 0% 0)', scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: EASE }}
      />
    </div>
  )
}

/** Generic text reveal — opacity + small rise (never clips itself to zero). */
function FadeUp({
  children,
  reduced,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  reduced: boolean
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Mono star rating. */
function Stars({ n }: { n: number }) {
  return (
    <span role="img" aria-label={`${n} af 5 stjörnum`} style={{ color: C.accent, letterSpacing: '0.12em' }}>
      <span aria-hidden>{'★'.repeat(n)}</span>
      <span aria-hidden style={{ color: C.inkFaint }}>{'★'.repeat(5 - n)}</span>
    </span>
  )
}

/* -------------------------------------------- the three-pillar reveal card */

function PillarCard({
  pillar,
}: {
  pillar: (typeof PILLARS)[number]
}) {
  const [open, setOpen] = useState(false)
  return (
    <div
      role="group"
      tabIndex={0}
      aria-label={pillar.title}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setOpen((v) => !v)
        }
        if (e.key === 'Escape') setOpen(false)
      }}
      className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-[1.4rem] outline-none ring-offset-2 focus-visible:ring-2 md:aspect-[4/5]"
      style={{ background: C.ink, ['--tw-ring-color' as string]: C.accent, ['--tw-ring-offset-color' as string]: C.ground }}
    >
      <img
        src={asset(IMG[pillar.key])}
        alt={
          pillar.key === 'cakeCase'
            ? 'Kökuborð kaffihússins í Húnabúð'
            : pillar.key === 'florist'
              ? 'Blómaskreyting í vinnslu (myndskreyting)'
              : 'Íslensk ull og garn (myndskreyting)'
        }
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover transition-transform duration-[900ms] ease-out motion-reduce:transition-none ${open ? 'scale-105' : 'scale-100'}`}
      />
      {/* base gradient so the eyebrow/title stay AA legible at rest */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(30,68,51,0.86) 0%, rgba(30,68,51,0.18) 46%, rgba(30,68,51,0) 72%)' }}
      />
      {/* resting label */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <p
          className="text-[0.62rem] uppercase"
          style={{ fontFamily: FONT.mono, letterSpacing: '0.22em', color: C.ground }}
        >
          {pillar.eyebrow}
        </p>
        <h3
          className="mt-1 text-[1.7rem] leading-[1.04] uppercase md:text-[2rem]"
          style={{ fontFamily: FONT.display, color: C.ground }}
        >
          {pillar.title}
        </h3>
        <p className="mt-1 text-sm" style={{ fontFamily: FONT.body, color: 'rgba(244,238,224,0.82)' }}>
          {pillar.lede}
        </p>
      </div>
      {/* reveal panel — slides up on hover / tap / focus */}
      <div
        className={`absolute inset-x-0 bottom-0 px-5 pb-5 pt-16 transition-transform duration-500 ease-out motion-reduce:transition-none md:px-6 md:pb-6 ${open ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ background: 'linear-gradient(to top, rgba(30,68,51,0.96) 0%, rgba(30,68,51,0.9) 68%, rgba(30,68,51,0) 100%)' }}
      >
        <p
          className="text-[0.62rem] uppercase"
          style={{ fontFamily: FONT.mono, letterSpacing: '0.22em', color: C.ground }}
        >
          {pillar.eyebrow}
        </p>
        <h3
          className="mt-1 text-[1.7rem] leading-[1.04] uppercase md:text-[1.9rem]"
          style={{ fontFamily: FONT.display, color: C.ground }}
        >
          {pillar.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed" style={{ fontFamily: FONT.body, color: 'rgba(244,238,224,0.9)' }}>
          {pillar.body}
        </p>
        <span
          className="mt-3 inline-flex items-center gap-1.5 text-[0.72rem] uppercase"
          style={{ fontFamily: FONT.mono, letterSpacing: '0.14em', color: C.ground }}
        >
          {pillar.cue}
          <span aria-hidden style={{ color: pillar.tint }}>→</span>
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------- the "one roof" thread signature */

function ThreadPaths({
  dashoffset,
  stroke,
  knot,
}: {
  dashoffset: MotionValue<number> | number
  stroke: MotionValue<string> | string
  knot: MotionValue<number> | number
}) {
  const common = {
    fill: 'none' as const,
    strokeWidth: 3,
    strokeLinecap: 'round' as const,
    pathLength: 1,
  }
  return (
    <>
      {/* desktop: horizontal thread across the row */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
        viewBox="0 0 1200 140"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M 20 70 C 170 24, 300 118, 470 70 S 760 20, 920 74 S 1120 120, 1180 66"
          {...common}
          style={{ strokeDashoffset: dashoffset, stroke, strokeDasharray: 1 }}
        />
        <motion.circle cx={1180} cy={66} r={9} style={{ fill: stroke, opacity: knot }} />
      </svg>
      {/* mobile: vertical thread down the stacked column */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full md:hidden"
        viewBox="0 0 80 1200"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M 40 20 C 8 170, 72 320, 40 470 S 8 780, 44 940 S 72 1120, 38 1180"
          {...common}
          style={{ strokeDashoffset: dashoffset, stroke, strokeDasharray: 1 }}
        />
        <motion.circle cx={38} cy={1180} r={9} style={{ fill: stroke, opacity: knot }} />
      </svg>
    </>
  )
}

/* --------------------------------------------------------- mobile sticky CTA */

function StickyCallBar({ show }: { show: boolean }) {
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 flex items-stretch gap-2 px-3 pb-3 pt-2 transition-transform duration-300 md:hidden ${show ? 'translate-y-0' : 'translate-y-[130%]'}`}
      style={{ background: 'linear-gradient(to top, rgba(244,238,224,0.98), rgba(244,238,224,0))' }}
    >
      <a
        href={PHONE_MAIN_TEL}
        className="flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold shadow-lg"
        style={{ background: C.accent, color: C.ground, fontFamily: FONT.body }}
      >
        <Phone className="h-4 w-4" aria-hidden />
        Hringdu · {PHONE_MAIN}
      </a>
      <a
        href={MAPS_HREF}
        target="_blank"
        rel="noreferrer"
        aria-label="Á kortinu"
        className="flex items-center justify-center rounded-full px-4 shadow-lg"
        style={{ background: C.ink, color: C.ground }}
      >
        <MapPin className="h-5 w-5" aria-hidden />
      </a>
    </div>
  )
}

/* ------------------------------------------------------------------- section */

function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="text-[0.7rem] uppercase"
        style={{ fontFamily: FONT.mono, letterSpacing: '0.24em', color: C.accent }}
      >
        {n}
      </span>
      <span className="h-px flex-1" style={{ background: C.inkFaint }} />
      <span
        className="text-[0.7rem] uppercase"
        style={{ fontFamily: FONT.mono, letterSpacing: '0.24em', color: C.inkSoft }}
      >
        {children}
      </span>
    </div>
  )
}

/* ========================================================================== */

export default function Page() {
  const reduced = useReducedMotion() ?? false
  const [showBar, setShowBar] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const pillarsRef = useRef<HTMLDivElement>(null)

  /* Lenis smooth scroll (skip under reduced motion). */
  useEffect(() => {
    document.title = 'Húnabúð · Þrennt undir einu þaki'
    setThemeColor(C.ground)
    return () => setThemeColor('#0a1320')
  }, [])

  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({
      duration: 1.1,
      easing: (x: number) => Math.min(1, 1.001 - Math.pow(2, -10 * x)),
      smoothWheel: true,
    })
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [reduced])

  /* Sticky mobile CTA appears once the hero has scrolled away. */
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting), {
      rootMargin: '-40% 0px 0px 0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /* Signature: scroll progress through the pillar section. */
  const { scrollYProgress } = useScroll({
    target: pillarsRef,
    offset: ['start 0.85', 'end 0.35'],
  })
  // style props subscribe to MotionValues; no `d`-attribute animation.
  const dashMv = useTransform(scrollYProgress, [0, 1], [1, 0])
  const strokeMv = useTransform(scrollYProgress, [0, 0.5, 1], [C.ink, C.accent, C.accent] as string[])
  const knotMv = useTransform(scrollYProgress, [0.78, 0.95], [0, 1])
  const threadProps = reduced
    ? { dashoffset: 0, stroke: C.accent, knot: 1 }
    : { dashoffset: dashMv, stroke: strokeMv, knot: knotMv }

  return (
    <div lang="is" style={{ background: C.ground, color: C.ink, fontFamily: FONT.body }} className="overflow-x-hidden pb-[68px] md:pb-0">
      <PreviewChrome company={company} />

      {/* ============================================================ 1 · HERO */}
      <header ref={heroRef} className="relative min-h-[100svh] w-full overflow-hidden">
        <img
          src={asset(IMG.hero)}
          alt="Húnabúð við þjóðveginn í Blönduósi, lopapeysur á slá fyrir utan og gestur á leið inn"
          loading="eager"
          decoding="async"
          {...{ fetchpriority: 'high' }}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: '50% 42%' }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(20,44,32,0.9) 4%, rgba(20,44,32,0.5) 42%, rgba(20,44,32,0.12) 70%, rgba(20,44,32,0.4) 100%)' }}
        />

        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1240px] flex-col justify-end px-5 pb-24 pt-28 md:px-8 md:pb-20">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="text-[0.72rem] uppercase"
            style={{ fontFamily: FONT.mono, letterSpacing: '0.28em', color: '#F1D9B8' }}
          >
            Þjóðvegur 1 · Blönduós
          </motion.p>

          <h1
            className="mt-4 uppercase"
            style={{
              fontFamily: FONT.display,
              color: C.ground,
              fontSize: 'clamp(2.9rem, 10.5vw, 8.2rem)',
              lineHeight: 1.04,
              letterSpacing: '0.005em',
              textShadow: '0 2px 24px rgba(10,24,16,0.35)',
            }}
          >
            <WordCutReveal text="ÞRENNT UNDIR" reduced={reduced} className="block" />
            <WordCutReveal text="EINU ÞAKI" reduced={reduced} className="block" style={{ color: '#F1D9B8' }} />
          </h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.62 }}
            className="mt-6 max-w-xl text-base leading-relaxed md:text-lg"
            style={{ color: 'rgba(244,238,224,0.94)' }}
          >
            Kaffihús, blómabúð og gjafavara í Blönduósi, allt undir sama þaki við
            þjóðveginn. Nákvæmlega eins og skiltið á húsinu segir.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.74 }}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <a
              href={PHONE_MAIN_TEL}
              className="inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-base font-semibold shadow-xl transition-transform hover:-translate-y-0.5"
              style={{ background: C.accent, color: C.ground }}
            >
              <Phone className="h-4 w-4" aria-hidden />
              Hringdu · {PHONE_MAIN}
            </a>
            <a
              href={MAPS_HREF}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-base font-medium ring-1 backdrop-blur-sm transition-colors hover:bg-white/10"
              style={{ color: C.ground, ['--tw-ring-color' as string]: 'rgba(244,238,224,0.55)' }}
            >
              <MapPin className="h-4 w-4" aria-hidden />
              Á kortinu
            </a>
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
            className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[0.74rem] uppercase"
            style={{ fontFamily: FONT.mono, letterSpacing: '0.14em', color: 'rgba(244,238,224,0.82)' }}
          >
            <span>Kaffihús</span>
            <span aria-hidden style={{ color: C.accentLift }}>·</span>
            <span>Blómabúð</span>
            <span aria-hidden style={{ color: C.accentLift }}>·</span>
            <span>Gjafavara</span>
          </motion.div>
        </div>
      </header>

      {/* ================================================= 2 · THREE PILLARS */}
      <section className="mx-auto w-full max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
        <FadeUp reduced={reduced}>
          <SectionLabel n="01">Þrennt undir einu þaki</SectionLabel>
          <h2
            /* leading ≥1.16: ÞRJÁR/BÚÐIR carry Anton's high floating acutes
               (Á/Ú) that collide with the line below on mobile wrap (ledger #23) */
            className="mt-5 max-w-3xl text-[clamp(2rem,5vw,3.4rem)] leading-[1.18] uppercase"
            style={{ fontFamily: FONT.display }}
          >
            Þrjár búðir, eitt þak, eitt stopp
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: C.inkSoft }}>
            Skiltið á húsinu segir það sjálft. Undir sama þaki bíða kaffibolli,
            blómvöndur og gjöf. Farðu yfir kortin til að sjá hvað er inni.
          </p>
        </FadeUp>

        <div ref={pillarsRef} className="relative mt-12">
          <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
            {PILLARS.map((p) => (
              <PillarCard key={p.title} pillar={p} />
            ))}
          </div>
          {/* thread renders after the grid in DOM order so it paints on top
              of the card seams instead of being occluded behind them */}
          <ThreadPaths {...threadProps} />
        </div>
      </section>

      {/* ========================================================= 3 · STORY */}
      <section className="w-full" style={{ background: '#EFE6D3' }}>
        <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-10 px-5 py-20 md:grid-cols-2 md:gap-16 md:px-8 md:py-28">
          <ClipImage
            imgKey="signage"
            alt="Skiltin þrjú á húsi Húnabúðar, Húnabúð, Bæjarblómið og blóma- og gjafavöruverslun"
            aspect="4 / 3"
            reduced={reduced}
            className="rounded-[1.4rem]"
            position="50% 40%"
          />
          <FadeUp reduced={reduced}>
            <SectionLabel n="02">Fjölskyldan</SectionLabel>
            <h2 className="mt-5 text-[clamp(1.9rem,4.4vw,3rem)] leading-[1.1] uppercase" style={{ fontFamily: FONT.display }}>
              Rekið af Sillu og Sigurði
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed" style={{ color: 'rgba(30,68,51,0.82)' }}>
              <p>
                Húnabúð er fjölskyldurekin verslun við þjóðveginn í Blönduósi.
                Sigurlaug og Reynir Sigurður taka á móti gestum, hella upp á kaffi
                og baka eftir gömlum, heimafengnum uppskriftum.
              </p>
              <p>
                Þegar prjónahátíðin Prjónagleðin var haldin í bænum sumarið 2026
                var kaffi og heimabakað frá henni Sillu í Húnabúð borið fram fyrir
                gesti á markaðnum. Þannig er búðin hluti af bæjarlífinu.
              </p>
            </div>
            <p
              className="mt-6 text-[0.72rem] uppercase"
              style={{ fontFamily: FONT.mono, letterSpacing: '0.16em', color: C.inkSoft }}
            >
              Sigurlaug &amp; Reynir Sigurður · Blönduós
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ==================================================== 4 · CAFÉ OFFER */}
      <section className="mx-auto w-full max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
        <FadeUp reduced={reduced}>
          <SectionLabel n="03">Kaffihúsið</SectionLabel>
          <h2 className="mt-5 max-w-2xl text-[clamp(2rem,5vw,3.4rem)] leading-[1.08] uppercase" style={{ fontFamily: FONT.display }}>
            Heimabakað við veginn
          </h2>
        </FadeUp>

        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[1.15fr_0.85fr] md:gap-14">
          <ClipImage
            imgKey="cakeCase"
            alt="Kökuborð kaffihússins í Húnabúð, heimabakaðar kökur og sneiðar í borðinu"
            aspect="4 / 3"
            reduced={reduced}
            className="rounded-[1.4rem]"
          />
          <div>
            <p className="max-w-md text-base leading-relaxed" style={{ color: C.inkSoft }}>
              Gestir hafa nefnt bláberjakökuna, jógúrtkökuna og gúllassúpuna
              sérstaklega. Súpa dagsins, samlokur og heimabakað fylgja góðu kaffi.
            </p>
            <ul className="mt-6 divide-y" style={{ borderColor: C.inkFaint }}>
              {CAFE_ITEMS.map((it) => (
                <li key={it.name} className="flex items-baseline justify-between gap-4 py-3.5" style={{ borderColor: C.inkFaint }}>
                  <span className="text-lg font-semibold" style={{ fontFamily: FONT.body }}>{it.name}</span>
                  <span className="text-right text-[0.72rem] uppercase" style={{ fontFamily: FONT.mono, letterSpacing: '0.08em', color: C.inkSoft }}>
                    {it.note}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm" style={{ color: C.inkSoft }}>
              Úrvalið er breytilegt eftir dögum. Spyrðu í afgreiðslu um það sem er á
              boðstólum þann daginn.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================= 5 · REVIEWS */}
      <section className="w-full" style={{ background: C.ink }}>
        <div className="mx-auto w-full max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
          <FadeUp reduced={reduced}>
            <div className="flex items-center gap-3">
              <span className="text-[0.7rem] uppercase" style={{ fontFamily: FONT.mono, letterSpacing: '0.24em', color: C.ground }}>04</span>
              <span className="h-px flex-1" style={{ background: 'rgba(244,238,224,0.16)' }} />
              <span className="text-[0.7rem] uppercase" style={{ fontFamily: FONT.mono, letterSpacing: '0.24em', color: 'rgba(244,238,224,0.6)' }}>Umsagnir</span>
            </div>
            <h2 className="mt-5 max-w-2xl text-[clamp(2rem,5vw,3.4rem)] leading-[1.08] uppercase" style={{ fontFamily: FONT.display, color: C.ground }}>
              Þau stoppuðu og komu aftur
            </h2>
          </FadeUp>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6">
            {REVIEWS.map((r, i) => (
              <FadeUp reduced={reduced} delay={i * 0.06} key={r.name}>
                <figure className="flex h-full flex-col rounded-[1.2rem] p-6 md:p-7" style={{ background: 'rgba(244,238,224,0.06)', border: '1px solid rgba(244,238,224,0.12)' }}>
                  <div className="flex items-center justify-between text-sm" style={{ fontFamily: FONT.mono }}>
                    <Stars n={r.stars} />
                    <span style={{ color: 'rgba(244,238,224,0.7)' }}>{r.date}</span>
                  </div>
                  <blockquote lang="en" className="mt-4 flex-1 text-lg leading-relaxed" style={{ color: 'rgba(244,238,224,0.92)' }}>
                    {r.text}
                  </blockquote>
                  <figcaption className="mt-5 text-[0.72rem] uppercase" style={{ fontFamily: FONT.mono, letterSpacing: '0.14em', color: C.ground }}>
                    {r.name}
                  </figcaption>
                </figure>
              </FadeUp>
            ))}
          </div>
          <p className="mt-6 text-[0.72rem] uppercase" style={{ fontFamily: FONT.mono, letterSpacing: '0.1em', color: 'rgba(244,238,224,0.5)' }}>
            Umsagnir af Google, teknar saman á Wanderlog · um það bil 4,6 af 5
          </p>
        </div>
      </section>

      {/* ======================================================= 6 · FLOWERS */}
      <section className="mx-auto w-full max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
        <FadeUp reduced={reduced}>
          <SectionLabel n="05">Bæjarblómið</SectionLabel>
          <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-2xl text-[clamp(2rem,5vw,3.4rem)] leading-[1.18] uppercase" style={{ fontFamily: FONT.display }}>
              Blóm fyrir tímamótin
            </h2>
            <p className="max-w-sm text-base leading-relaxed" style={{ color: C.inkSoft }}>
              Blómabúðin undir sama þaki. Fersk blóm og skreytingar, unnar eftir
              tilefni og óskum.
            </p>
          </div>
        </FadeUp>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          <ClipImage imgKey="bouquet1" alt="Blómvöndur með ljósum rósum í glervasa (myndskreyting)" aspect="3 / 4" reduced={reduced} className="rounded-[1.4rem] md:mt-10" />
          <ClipImage imgKey="florist" alt="Hendur raða blómum í körfu á vinnuborði blómabúðar (myndskreyting)" aspect="3 / 4" reduced={reduced} className="rounded-[1.4rem]" />
          <ClipImage imgKey="bouquet2" alt="Brúðkaupsvöndur með rósum og hnappa (myndskreyting)" aspect="3 / 4" reduced={reduced} className="rounded-[1.4rem] md:mt-10" />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2.5">
          {OCCASIONS.map((o) => (
            <span key={o} className="rounded-full px-4 py-1.5 text-sm font-medium" style={{ background: 'rgba(201,124,104,0.16)', color: '#8E4636', fontFamily: FONT.body }}>
              {o}
            </span>
          ))}
          <span className="text-sm" style={{ color: C.inkSoft }}>Verð fer eftir óskum, hafðu samband.</span>
        </div>
      </section>

      {/* ========================================================= 7 · GIFTS */}
      <section className="w-full" style={{ background: '#EFE6D3' }}>
        <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-10 px-5 py-20 md:grid-cols-2 md:gap-16 md:px-8 md:py-28">
          <FadeUp reduced={reduced} className="md:order-2">
            <SectionLabel n="06">Gjafavara</SectionLabel>
            <h2 className="mt-5 text-[clamp(1.9rem,4.4vw,3rem)] leading-[1.1] uppercase" style={{ fontFamily: FONT.display }}>
              Handverk og gjafir heim
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed" style={{ color: 'rgba(30,68,51,0.82)' }}>
              Íslenskt handverk, ull og gjafavara undir sama þaki. Fyrir utan búðina
              hanga lopapeysur á slá, tilvalið að grípa með sér gjöf af leiðinni.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {GIFTS.map((g) => (
                <span key={g} className="rounded-full px-4 py-1.5 text-sm font-medium" style={{ background: 'rgba(201,154,62,0.2)', color: '#7C5E1E', fontFamily: FONT.body }}>
                  {g}
                </span>
              ))}
            </div>
          </FadeUp>
          <ClipImage
            imgKey="yarn"
            alt="Íslenskt ullargarn í hnyklum (myndskreyting)"
            aspect="4 / 3"
            reduced={reduced}
            className="rounded-[1.4rem] md:order-1"
          />
        </div>
      </section>

      {/* ================================================= 8 · ROUTE 1 / TOWN */}
      <section className="relative w-full overflow-hidden">
        <ClipImage
          imgKey="road"
          alt="Þjóðvegur 1 liðast meðfram strönd og fjöllum (myndskreyting)"
          aspect="21 / 9"
          reduced={reduced}
          className="min-h-[60vh] w-full"
          position="50% 55%"
        />
        <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(20,44,32,0.86), rgba(20,44,32,0.28) 55%, rgba(20,44,32,0.5))' }} />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-[1240px] px-5 pb-14 md:px-8 md:pb-20">
            <FadeUp reduced={reduced}>
              <span className="text-[0.7rem] uppercase" style={{ fontFamily: FONT.mono, letterSpacing: '0.24em', color: '#F1D9B8' }}>07 · Á leiðinni</span>
              <h2 className="mt-4 max-w-3xl text-[clamp(1.9rem,4.6vw,3.2rem)] leading-[1.18] uppercase" style={{ fontFamily: FONT.display, color: C.ground }}>
                Stopp á þjóðvegi 1
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: 'rgba(244,238,224,0.9)' }}>
                Húnabúð stendur við þjóðveg 1 í Blönduósi, við hliðina á N1 stöðinni.
                Tilvalið stopp á leiðinni um Norðurland fyrir kaffi, blóm eða gjöf.
              </p>
              <p className="mt-4 max-w-xl rounded-2xl px-4 py-3 text-sm leading-relaxed" style={{ background: 'rgba(20,44,32,0.55)', color: 'rgba(244,238,224,0.86)', border: '1px solid rgba(244,238,224,0.16)' }}>
                Opnunartími getur verið breytilegur eftir árstíð, enda sumaropnun við
                þjóðveginn. Hringdu á undan til að vera viss.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ===================================================== 9 · PRACTICAL */}
      <section className="w-full" style={{ background: C.ink, color: C.ground }}>
        <div className="mx-auto w-full max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
          <div className="flex items-center gap-3">
            <span className="text-[0.7rem] uppercase" style={{ fontFamily: FONT.mono, letterSpacing: '0.24em', color: C.ground }}>08</span>
            <span className="h-px flex-1" style={{ background: 'rgba(244,238,224,0.16)' }} />
            <span className="text-[0.7rem] uppercase" style={{ fontFamily: FONT.mono, letterSpacing: '0.24em', color: 'rgba(244,238,224,0.6)' }}>Heimsókn</span>
          </div>
          <h2 className="mt-5 max-w-3xl text-[clamp(2.2rem,6vw,4.4rem)] leading-[1.16] uppercase" style={{ fontFamily: FONT.display }}>
            Kíktu við í Húnabúð
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
            <div className="space-y-8" style={{ fontFamily: FONT.mono }}>
              <div>
                <p className="text-[0.68rem] uppercase" style={{ letterSpacing: '0.2em', color: 'rgba(244,238,224,0.55)' }}>Sími</p>
                <div className="mt-2 flex flex-col gap-1.5">
                  <a href={PHONE_MAIN_TEL} className="text-3xl font-bold tracking-tight hover:underline md:text-4xl" style={{ color: C.ground }}>{PHONE_MAIN}</a>
                  <a href={PHONE_MOBILE_TEL} className="text-lg hover:underline" style={{ color: 'rgba(244,238,224,0.75)' }}>{PHONE_MOBILE} (farsími)</a>
                </div>
              </div>
              <div>
                <p className="text-[0.68rem] uppercase" style={{ letterSpacing: '0.2em', color: 'rgba(244,238,224,0.55)' }}>Heimilisfang</p>
                <a href={MAPS_HREF} target="_blank" rel="noreferrer" className="mt-2 block text-lg hover:underline" style={{ color: C.ground, fontFamily: FONT.body }}>{ADDRESS}</a>
                <p className="mt-1 text-sm" style={{ color: 'rgba(244,238,224,0.6)', fontFamily: FONT.body }}>Við þjóðveg 1, við hliðina á N1</p>
              </div>
              <div>
                <p className="text-[0.68rem] uppercase" style={{ letterSpacing: '0.2em', color: 'rgba(244,238,224,0.55)' }}>Opnunartími</p>
                <ul className="mt-2 space-y-1.5">
                  {HOURS.map((h) => (
                    <li key={h.day} className="flex items-baseline justify-between gap-6 text-sm">
                      <span style={{ color: 'rgba(244,238,224,0.82)', fontFamily: FONT.body }}>{h.day}</span>
                      <span style={{ color: C.ground }}>{h.time}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 max-w-xs text-xs leading-relaxed" style={{ color: 'rgba(244,238,224,0.6)', fontFamily: FONT.body }}>
                  Opnunartími getur breyst eftir árstíð. Hringdu á undan til að vera viss.
                </p>
              </div>
              <a
                href={PHONE_MAIN_TEL}
                className="inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-base font-semibold transition-transform hover:-translate-y-0.5"
                style={{ background: C.accentLift, color: '#241009', fontFamily: FONT.body }}
              >
                <Phone className="h-4 w-4" aria-hidden />
                Hringdu · {PHONE_MAIN}
              </a>
            </div>

            <div className="overflow-hidden rounded-[1.4rem]" style={{ border: '1px solid rgba(244,238,224,0.16)' }}>
              <iframe
                title="Kort af staðsetningu Húnabúðar í Blönduósi"
                src={MAP_EMBED}
                className="h-full min-h-[360px] w-full"
                style={{ border: 0, filter: 'saturate(0.9)' }}
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <PreviewFooter company={company} />
      <StickyCallBar show={showBar} />
    </div>
  )
}
