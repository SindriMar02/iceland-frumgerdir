/* ── UNA Local Product · „Litla rauða húsið" ──────────────────────────────
   Display face Fraunces (--font-display) + Hanken Grotesk (--font-hanken) —
   BOTH already globally loaded (index.html Google-Fonts link + index.css
   @theme), so no self-loaded <link> is needed on this page.

   SIGNATURE — the arched Nissen-roof silhouette (locally: „bragginn") as a
   recurring UI shape: every photo sits inside an ArchFrame (a CSS clip-path
   dome cut from a plain rectangle) with a thin barn-red mat, and a small
   flat SVG hut mark (HutMark) repeats as the brand glyph. The interactive
   "explore the hut" tablist (Ull / Matur / Skart / Gjafir) cross-fades a
   photo inside that same arch, mirroring the roving-tabindex + arrow-key
   pattern of Pólar Hestar's season switcher but with its own barn-red,
   arched-frame visual language (no fjord-mist, no pills, no blobs).       */

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { Img } from '../../components/Img'
import { Reveal } from '../../components/Reveal'
import { StickyCta } from '../../components/StickyCta'
import { CATEGORIES, HERITAGE, HERO, IMG, JSON_LD, META, NAV, REVIEWS, VISIT } from './data'

const company = getPreviewCompany('una')

/* ── palette — barn-red accent (company.accent) on warm cream, ink for
      primary text, a muted warm brown for secondary text, moss for a
      second accent. Contrast computed via the WCAG relative-luminance
      formula (sRGB → linear, L = 0.2126R+0.7152G+0.0722B, then
      (L1+0.05)/(L2+0.05)):

      RED   #A5352B on CREAM #F3ECDF → L=0.1072 vs 0.8434 → 5.68:1  (AA, normal text)
      INK   #241A16 on CREAM          → L=0.0117 vs 0.8434 → 14.47:1 (AAA)
      MUTED #6B5C52 on CREAM          → L=0.1141 vs 0.8434 → 5.44:1  (AA)
      MOSS  #4B5D3A on CREAM          → L=0.0965 vs 0.8434 → 6.10:1  (AA)
      CREAM on RED (button label)    → same pair reversed  → 5.68:1  (AA)
      GOLD  #D9B98E on INK (heritage band eyebrow)          → 9.14:1  (AAA)
      Heritage-band photo scrim: linear-gradient to ~90% INK opacity, so
      the cream body text there sits on effectively-solid INK → ~14:1.   ── */
const CREAM = '#F3ECDF'
const RED = company.accent /* #A5352B */
const RED_DEEP = '#832B22'
const INK = '#241A16'
const MUTED = '#6B5C52'
const MOSS = '#4B5D3A'
const GOLD = '#D9B98E'
const HAIR = 'rgba(36,26,22,0.14)'
const EASE = [0.16, 1, 0.3, 1] as const

/* ── the arch — a Nissen-hut dome clipped from a rectangle. Straight side
      walls for the bottom 70% of the box, a sine-curve dome for the top
      30% (percentages, so it scales with whatever aspect ratio the frame
      is given — used identically everywhere for one consistent shape). ── */
const ARCH_CLIP = (() => {
  const steps = 20
  const domeH = 30
  const pts: string[] = ['0% 100%']
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 100
    const y = domeH * (1 - Math.sin((Math.PI * x) / 100))
    pts.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`)
  }
  pts.push('100% 100%')
  return `polygon(${pts.join(', ')})`
})()

/* ── ArchFrame — any photo, cut to the dome + wrapped in a thin red mat ── */
function ArchFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative p-[7px] md:p-2 ${className}`} style={{ clipPath: ARCH_CLIP, background: RED }}>
      <div className="relative h-full w-full overflow-hidden" style={{ clipPath: ARCH_CLIP }}>
        {children}
      </div>
    </div>
  )
}

/* ── HutMark — the recurring brand glyph: arched roof, corrugation lines,
      a small doorway. Flat SVG, `currentColor` fill so callers tint it.  ── */
function HutMark({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 48 40" className={className} style={style} aria-hidden="true">
      <path d="M6,36 L6,20 Q24,3 42,20 L42,36 Z" fill="currentColor" />
      <path d="M9,20 Q24,6 39,20" stroke="rgba(255,255,255,0.5)" strokeWidth="1.3" fill="none" />
      <path d="M7,20 Q24,3.5 41,20" stroke="rgba(255,255,255,0.3)" strokeWidth="1.1" fill="none" />
      <rect x="20" y="27" width="8" height="9" rx="1" fill="rgba(255,255,255,0.92)" />
    </svg>
  )
}

/* ── SIGNATURE · Explore the hut — roving-tabindex tablist, arrow-key
      navigation, one shared tabpanel whose photo cross-fades via Framer
      opacity (click-triggered state change, not scroll-driven).         ── */
function ExploreHut({ reduced }: { reduced: boolean }) {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const cat = CATEGORIES[active]

  const onTabKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    let next = active
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (active + 1) % CATEGORIES.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (active - 1 + CATEGORIES.length) % CATEGORIES.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = CATEGORIES.length - 1
    else return
    e.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="budin" aria-labelledby="budin-h" className="mx-auto w-full max-w-[1240px] scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
      <Reveal>
        <p className="flex items-center gap-2 text-[13.5px] font-semibold tracking-[0.08em] uppercase" style={{ color: RED }}>
          <HutMark className="h-5 w-5" style={{ color: RED }} />
          Í bragganum
        </p>
        <h2 id="budin-h" className="font-display mt-3 max-w-[18ch] text-[clamp(2.2rem,5.5vw,3.8rem)] leading-[1.05]" style={{ color: INK }}>
          Hvað leynist í bragganum?
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-10 md:grid-cols-[0.95fr_1.15fr] md:items-center md:gap-12">
        <div role="tablist" aria-label="Flokkar í búðinni" onKeyDown={onTabKey} className="flex flex-col gap-2.5">
          {CATEGORIES.map((c, i) => {
            const on = i === active
            return (
              <button
                key={c.id}
                id={`una-tab-${c.id}`}
                role="tab"
                aria-selected={on}
                aria-controls="una-panel"
                tabIndex={on ? 0 : -1}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                onClick={() => setActive(i)}
                className="una-tab flex min-h-[64px] items-center justify-between gap-4 rounded-lg px-5 py-4 text-left transition-colors duration-300"
                style={{
                  background: on ? RED : 'transparent',
                  boxShadow: on ? '0 8px 24px -12px rgba(165,53,43,0.5)' : `inset 0 0 0 1px ${HAIR}`,
                }}
              >
                <span>
                  <span className="font-display block text-xl md:text-2xl" style={{ color: on ? CREAM : INK }}>
                    {c.label}
                  </span>
                  <span className="mt-0.5 block text-[13px]" style={{ color: on ? 'rgba(243,236,223,0.85)' : MUTED }}>
                    {c.kicker}
                  </span>
                </span>
                <HutMark className="h-6 w-6 shrink-0" style={{ color: on ? CREAM : RED, opacity: on ? 1 : 0.4 }} />
              </button>
            )
          })}
        </div>

        <div>
          <ArchFrame className="aspect-[4/3] md:aspect-[16/12]">
            <div role="tabpanel" id="una-panel" aria-labelledby={`una-tab-${cat.id}`} className="relative h-full w-full">
              {CATEGORIES.map((c, i) => (
                <motion.div
                  key={c.id}
                  aria-hidden={i !== active}
                  className="absolute inset-0"
                  initial={false}
                  animate={{ opacity: i === active ? 1 : 0 }}
                  transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
                  style={{ pointerEvents: i === active ? 'auto' : 'none' }}
                >
                  <Img
                    src={IMG[c.img].src}
                    srcSet={IMG[c.img].srcSet}
                    sizes="(min-width: 768px) 52vw, 100vw"
                    alt={IMG[c.img].alt}
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </ArchFrame>
          <p className="mt-4 max-w-[54ch] text-[16px] leading-relaxed" style={{ color: MUTED }}>
            {cat.body}
          </p>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════ the page ═ */
export default function UnaPage() {
  const prefersReduced = useReducedMotion()
  const reduced = !!prefersReduced

  useEffect(() => {
    document.title = META.title
    setThemeColor(CREAM)
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    const prev = meta.content
    meta.content = META.description
    return () => {
      meta.content = prev
    }
  }, [])

  return (
    <div lang="is" className="una-root min-h-[100svh] overflow-x-hidden antialiased" style={{ background: CREAM, color: INK, fontFamily: 'var(--font-hanken)' }}>
      <script type="application/ld+json">{JSON.stringify(JSON_LD)}</script>
      <PreviewChrome company={company} />

      <style>{`
        .una-cta{transition:transform .16s cubic-bezier(.23,1,.32,1),opacity .16s ease}
        .una-cta:hover{transform:translateY(-2px)}
        .una-cta:active{transform:scale(.98)}
        .una-cta-fill:hover{background:${RED_DEEP} !important}
        .una-navlink{position:relative}
        .una-navlink::after{content:"";position:absolute;left:0;right:100%;bottom:-2px;height:1.5px;
          background:${RED};transition:right .22s cubic-bezier(.23,1,.32,1)}
        .una-navlink:hover::after{right:0}
        .una-tab:hover{box-shadow:inset 0 0 0 1.5px ${RED} !important}
        .una-root :focus-visible{outline:3px solid ${RED};outline-offset:3px}
        .una-dark :focus-visible{outline-color:${GOLD}}
        @media (prefers-reduced-motion: reduce){
          .una-root *,.una-root *::before,.una-root *::after{
            transition-duration:.01ms!important;animation-duration:.01ms!important}
        }
      `}</style>

      {/* ── header ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50" style={{ background: CREAM, borderBottom: `1px solid ${HAIR}` }}>
        <div className="mx-auto flex h-[76px] w-full max-w-[1240px] items-center justify-between gap-4 px-5 md:px-8">
          <a href="#efst" aria-label="UNA Local Product, efst á síðu" className="flex min-h-[44px] items-center gap-2.5">
            <HutMark className="h-8 w-8" style={{ color: RED }} />
            <span className="font-display text-xl md:text-2xl" style={{ color: INK }}>
              UNA
            </span>
          </a>
          <nav aria-label="Aðalvalmynd" className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="una-navlink inline-flex min-h-[44px] items-center text-[15px] font-medium" style={{ color: INK }}>
                {n.label}
              </a>
            ))}
          </nav>
          <a
            href={VISIT.mapHref}
            target="_blank"
            rel="noreferrer"
            className="una-cta una-cta-fill inline-flex min-h-[44px] items-center justify-center px-5 text-[14.5px] font-semibold"
            style={{ background: RED, color: CREAM }}
          >
            Leiðarlýsing
          </a>
        </div>
      </header>

      <main id="efst">
        {/* ── 1 · hero — never opacity-gated: starts at opacity 1, only a
              transform (y) settles in on mount ─────────────────────────── */}
        <section
          aria-label={HERO.eyebrow}
          className="mx-auto grid w-full max-w-[1240px] gap-10 px-5 pb-16 pt-10 md:min-h-[calc(100svh-76px)] md:grid-cols-[1.05fr_1fr] md:items-center md:gap-14 md:px-8 md:pb-20 md:pt-0"
        >
          <motion.div
            initial={{ opacity: 1, y: reduced ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <p className="flex items-center gap-2 text-[13.5px] font-semibold tracking-[0.04em]" style={{ color: MUTED }}>
              <HutMark className="h-5 w-5 shrink-0" style={{ color: RED }} />
              {HERO.eyebrow}
            </p>
            <h1 className="font-display text-balance mt-5 text-[clamp(3rem,9vw,6rem)] leading-[1.02]" style={{ color: INK }}>
              {HERO.title}
              <br />
              <em style={{ color: RED, fontStyle: 'italic' }}>{HERO.titleLine2}</em>
            </h1>
            <p className="mt-6 max-w-[46ch] text-[17px] leading-relaxed" style={{ color: MUTED }}>
              {HERO.sub}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={VISIT.mapHref}
                target="_blank"
                rel="noreferrer"
                className="una-cta una-cta-fill inline-flex min-h-[48px] items-center justify-center px-7 text-[15px] font-semibold"
                style={{ background: RED, color: CREAM }}
              >
                {HERO.ctaPrimary}
              </a>
              <a
                href="#budin"
                className="una-cta inline-flex min-h-[48px] items-center justify-center px-7 text-[15px] font-semibold"
                style={{ color: INK, boxShadow: `inset 0 0 0 1.5px ${INK}` }}
              >
                {HERO.ctaSecondary}
              </a>
            </div>
          </motion.div>

          <div>
            <ArchFrame className="aspect-[4/3] md:aspect-auto md:h-[min(72svh,660px)]">
              <Img
                src={IMG.countryside.src}
                srcSet={IMG.countryside.srcSet}
                sizes="(min-width: 768px) 48vw, 100vw"
                alt={IMG.countryside.alt}
                loading="eager"
                fetchpriority="high"
                className="h-full w-full object-cover"
              />
            </ArchFrame>
            <p className="mt-3 text-[13px]" style={{ color: MUTED }}>
              {HERO.imgCaption}
            </p>
          </div>
        </section>

        {/* ── 2 · SIGNATURE — explore the hut ─────────────────────────────── */}
        <ExploreHut reduced={reduced} />

        {/* ── 3 · fjölskyldan — full-bleed photo band, scrim ~90% INK behind
              the cream text (see palette contrast comment at top) ────────── */}
        <section id="fjolskyldan" aria-labelledby="fjolskyldan-h" className="una-dark relative scroll-mt-24 overflow-hidden" style={{ background: INK }}>
          <div aria-hidden className="absolute inset-0">
            <Img src={IMG.wool.src} alt="" className="h-full w-full object-cover" />
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(100deg, ${INK}ea 0%, ${INK}dd 46%, ${INK}b8 100%)` }}
            />
          </div>
          <div className="relative mx-auto w-full max-w-[1240px] px-5 py-24 md:px-8 md:py-32">
            <Reveal>
              <p className="text-[13.5px] font-semibold tracking-[0.08em] uppercase" style={{ color: GOLD }}>
                {HERITAGE.eyebrow}
              </p>
              <h2 id="fjolskyldan-h" className="font-display text-balance mt-4 max-w-[20ch] text-[clamp(2.2rem,5.5vw,4rem)] leading-[1.05]" style={{ color: CREAM }}>
                {HERITAGE.heading}
              </h2>
              <p className="mt-6 max-w-[58ch] text-[17px] leading-relaxed" style={{ color: 'rgba(243,236,223,0.9)' }}>
                {HERITAGE.body1}
              </p>
              <p className="mt-4 max-w-[58ch] text-[17px] leading-relaxed" style={{ color: 'rgba(243,236,223,0.9)' }}>
                {HERITAGE.body2}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── 4 · umsagnir — trust stat + one clearly-disclaimed sample quote ── */}
        <section id="umsagnir" aria-labelledby="umsagnir-h" className="mx-auto w-full max-w-[1240px] scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 id="umsagnir-h" className="font-display text-[clamp(2.2rem,5.5vw,3.6rem)]" style={{ color: INK }}>
                {REVIEWS.heading}
              </h2>
              <div className="text-right">
                <p className="font-display text-[clamp(2.4rem,5vw,3.4rem)] leading-none" style={{ color: RED }}>
                  {REVIEWS.stat.value}
                </p>
                <p className="mt-1 text-[13.5px]" style={{ color: MUTED }}>
                  {REVIEWS.stat.label}
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="mt-3 max-w-[62ch] text-[13.5px]" style={{ color: MUTED }}>
              {REVIEWS.disclaimer}
            </p>
            <blockquote className="mt-8 border-l-2 pl-6" style={{ borderColor: RED }}>
              <p className="font-display text-[clamp(1.4rem,2.6vw,2rem)] leading-snug" style={{ color: INK }}>
                {REVIEWS.quote}
              </p>
              <footer className="mt-4 text-[14px] font-medium" style={{ color: MUTED }}>
                {REVIEWS.quoteAttribution}
              </footer>
            </blockquote>
          </Reveal>
        </section>

        {/* ── 5 · heimsókn — real hours, address, map ─────────────────────── */}
        <section id="heimsokn" aria-labelledby="heimsokn-h" className="mx-auto w-full max-w-[1240px] scroll-mt-24 px-5 pb-24 md:px-8 md:pb-32">
          <Reveal>
            <h2 id="heimsokn-h" className="font-display text-[clamp(2.4rem,6vw,4.2rem)]" style={{ color: INK }}>
              {VISIT.heading}
            </h2>
            <p className="mt-4 max-w-[58ch] text-[17px] leading-relaxed" style={{ color: MUTED }}>
              {VISIT.intro}
            </p>
          </Reveal>

          <div className="mt-12 grid gap-12 md:grid-cols-12 md:gap-8">
            <Reveal className="md:col-span-5">
              <h3 className="font-display text-[1.7rem]" style={{ color: INK }}>
                UNA Local Product
              </h3>
              <p className="mt-2 text-[16px]" style={{ color: MUTED }}>
                {VISIT.address}
              </p>
              <dl className="mt-6 max-w-[26rem]" style={{ borderTop: `1px solid ${HAIR}` }}>
                {VISIT.hours.map((h) => (
                  <div key={h.days} className="flex items-baseline justify-between gap-6 py-3" style={{ borderBottom: `1px solid ${HAIR}` }}>
                    <dt className="text-[15px]" style={{ color: MUTED }}>
                      {h.days}
                    </dt>
                    <dd className="m-0 text-[15px] font-semibold" style={{ color: INK }}>
                      {h.time}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <a
                  href={VISIT.mapHref}
                  target="_blank"
                  rel="noreferrer"
                  className="una-cta una-cta-fill inline-flex min-h-[48px] items-center justify-center px-6 text-[15px] font-semibold"
                  style={{ background: RED, color: CREAM }}
                >
                  Skoða á korti
                </a>
                <a href={`mailto:${VISIT.email}`} className="inline-flex min-h-[44px] items-center text-[15px] font-semibold underline underline-offset-4" style={{ color: MOSS }}>
                  {VISIT.email}
                </a>
              </div>
            </Reveal>

            <Reveal className="md:col-span-7" delay={0.05}>
              <ArchFrame className="aspect-[16/10] md:aspect-[16/9]">
                <Img
                  src={IMG.countryside.src}
                  srcSet={IMG.countryside.srcSet}
                  sizes="(min-width: 768px) 55vw, 100vw"
                  alt={IMG.countryside.alt}
                  className="h-full w-full object-cover"
                />
              </ArchFrame>
              <p className="mt-3 text-[13px]" style={{ color: MUTED }}>
                {VISIT.imgCaption}
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <StickyCta
        label="UNA Local Product · Hvolsvelli"
        button="Leiðarlýsing"
        href={VISIT.mapHref}
        buttonClassName="bg-[#A5352B] text-[#F3ECDF]"
        barClassName="bg-[#F3ECDF]/90 text-[#241A16] border-t border-[#241A16]/10"
        watchTarget="#heimsokn"
      />

      <PreviewFooter company={company} />
    </div>
  )
}
