/* ── FONT WIRING for the lead ────────────────────────────────────────────────
   The ONE new face: Zodiak (FontShare) — refined editorial serif, jewelry
   register (not used by any other prototype).
   index.html <head>:
     <link href="https://api.fontshare.com/v2/css?f[]=zodiak@400,401,700&display=swap" rel="stylesheet" />
   index.css @theme:
     --font-zodiak: "Zodiak", Georgia, serif;  (Geisli — gleraugu eru skart)
   Body face is Hanken Grotesk, ALREADY loaded globally (--font-hanken).
   Until wired, this page self-loads Zodiak via the <link> rendered in JSX.  */

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import Lenis from 'lenis'
import { motion, useReducedMotion } from 'framer-motion'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { Img } from '../../components/Img'
import {
  CLOSING, FRAMES, HERITAGE, HERO, IMG, JSON_LD, LENS, LOGO, META, NAV,
  PHONE_DISPLAY, PHONE_HREF, REVIEWS, SERVICES, TRUST, VISIT,
} from './data'

const company = getPreviewCompany('geisli')

/* ── GEISLI · „Gleraugu eru skart" — luminous ivory jewelry boutique.
      Two signatures: (1) the interactive blur⇄sharp lens divider over a
      north-Iceland fjord, (2) focus typography — key headlines resolve
      from blur via IntersectionObserver + CSS transition.               ── */

const IVORY = '#F5F2EC'
const INK = '#1D1A16'          /* on ivory 15.51:1 */
const EMERALD = '#1F5C4D'      /* on ivory 6.97:1 · ivory on emerald 6.97:1 */
const GOLD = '#8A6A3B'         /* on ivory 4.47:1 — LARGE text (≥3:1) + hairlines ONLY */
const GOLD_DEEP = '#85663A'    /* on ivory 4.75:1 — gold at small/normal text sizes */
const GOLD_LIGHT = '#C9A56C'   /* on night 7.89:1 */
const MUTED = '#5C554A'        /* on ivory 6.59:1 */
const MINT = '#D9E4DF'         /* on emerald 5.98:1 */

const BASE = import.meta.env.BASE_URL
const DISPLAY = "'Zodiak', Georgia, 'Times New Roman', serif"
const SANS = "'Hanken Grotesk', system-ui, sans-serif"

const HAIR = 'rgba(29,26,22,0.14)'
const HAIR_GOLD = 'rgba(138,106,59,0.4)'
const EASE = [0.16, 1, 0.3, 1] as const

/* ── shared IntersectionObserver hook — fires once, observes an element
      that is itself never transform-animated (the craft-ledger rule)     ── */
function useSeen<T extends HTMLElement>(disabled: boolean) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(disabled)
  useEffect(() => {
    if (disabled || seen) return
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [disabled, seen])
  return { ref, seen }
}

/* ── SIGNATURE 2 · focus typography — headline resolves from blur(8px) to
      sharp via IO + CSS transition (compositor-safe, NOT Framer whileInView).
      Reduced motion renders sharp immediately.                            ── */
function FocusText({ children, className = '', style }: {
  children: ReactNode; className?: string; style?: CSSProperties
}) {
  const reduced = useReducedMotion()
  const { ref, seen } = useSeen<HTMLSpanElement>(!!reduced)
  return (
    <span ref={ref} className={`gl-focus ${seen ? 'is-sharp' : ''} ${className}`} style={style}>
      {children}
    </span>
  )
}

/* ── clip-path photo reveal — IO on the untransformed wrapper, the inner
      image animates (clip wipes open while a slight zoom settles)        ── */
function ClipReveal({ src, srcSet, sizes, alt, className = '', imgClassName = '' }: {
  src: string; srcSet?: string; sizes?: string; alt: string
  className?: string; imgClassName?: string
}) {
  const reduced = useReducedMotion()
  const { ref, seen } = useSeen<HTMLDivElement>(!!reduced)
  return (
    <div ref={ref} className={`gl-clip overflow-hidden ${seen ? 'is-open' : ''} ${className}`}>
      <Img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        className={`gl-clip-img h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  )
}

/* ── SIGNATURE 1 · the lens — interactive blur⇄sharp divider. A native
      range input stretched over the whole photo drives the divider, so
      pointer drag, tap-to-place, touch and arrow keys all work for free.
      Reduced motion / no JS: the sharp photo alone.                      ── */
function LensDivider() {
  const reduced = useReducedMotion()
  const [pos, setPos] = useState(58)

  if (reduced) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden md:aspect-[21/9]">
        <Img
          src={IMG.fjord.src}
          srcSet={IMG.fjord.srcSet}
          sizes="(min-width: 1280px) 1200px, 100vw"
          alt={IMG.fjord.alt}
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  return (
    <div className="gl-lens relative aspect-[4/3] w-full overflow-hidden md:aspect-[21/9]">
      {/* sharp base */}
      <Img
        src={IMG.fjord.src}
        srcSet={IMG.fjord.srcSet}
        sizes="(min-width: 1280px) 1200px, 100vw"
        alt={IMG.fjord.alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* blurred layer, clipped to the left of the divider */}
      <div
        aria-hidden
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Img
          src={IMG.fjord.src}
          srcSet={IMG.fjord.srcSet}
          sizes="(min-width: 1280px) 1200px, 100vw"
          alt=""
          className="h-full w-full scale-[1.04] object-cover"
          style={{ filter: 'blur(13px) saturate(0.92)' }}
        />
      </div>

      {/* corner state labels */}
      <span aria-hidden className="gl-lens-tag left-3 md:left-5">{LENS.before}</span>
      <span aria-hidden className="gl-lens-tag right-3 md:right-5">{LENS.after}</span>

      {/* the control: an invisible range input covering the whole photo */}
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={LENS.inputLabel}
        className="gl-lens-range"
      />

      {/* divider line + round lens handle (visual only, input does the work) */}
      <div aria-hidden className="gl-lens-divider" style={{ left: `${pos}%` }} />
      <div aria-hidden className="gl-lens-handle" style={{ left: `${pos}%` }}>
        <svg width="26" height="14" viewBox="0 0 26 14" fill="none">
          <path d="M8 1 2 7l6 6M18 1l6 6-6 6" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

/* ── buttons — rectangular, jewelry-plate sharp (no pills, no arrow chips) ── */
function Cta({ href, children, variant, className = '' }: {
  href: string; children: ReactNode; variant: 'emerald' | 'inkline' | 'ivory'; className?: string
}) {
  const styles: Record<string, CSSProperties> = {
    emerald: { background: EMERALD, color: IVORY },
    inkline: { background: 'transparent', color: INK, boxShadow: `inset 0 0 0 1.5px ${INK}` },
    ivory: { background: IVORY, color: EMERALD },
  }
  return (
    <a
      href={href}
      className={`gl-cta inline-flex min-h-[48px] items-center justify-center px-7 text-[15px] font-semibold tracking-[0.01em] ${className}`}
      style={{ fontFamily: SANS, ...styles[variant] }}
    >
      {children}
    </a>
  )
}

/* ═══════════════════════════════════════════════════════════════ the page ═ */
export default function GeisliPage() {
  const reduced = useReducedMotion()

  useEffect(() => {
    document.title = META.title
    setThemeColor(IVORY)
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    const prev = meta.content
    meta.content = META.description
    return () => { meta.content = prev }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.1 })
    let raf = 0
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); lenis.destroy() }
  }, [])

  /* staggered hero entrance (mount-triggered, not whileInView) */
  const heroStagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  }
  const heroItem = {
    hidden: { opacity: 0, y: reduced ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
  }

  return (
    <div
      lang="is"
      className="gl-root min-h-[100svh] overflow-x-hidden antialiased"
      style={{ background: IVORY, color: INK, fontFamily: SANS }}
    >
      <link href="https://api.fontshare.com/v2/css?f[]=zodiak@400,401,700&display=swap" rel="stylesheet" />
      <script type="application/ld+json">{JSON.stringify(JSON_LD)}</script>
      <PreviewChrome company={company} />

      <style>{`
        .gl-root{-webkit-font-smoothing:antialiased}
        .gl-display{font-family:${DISPLAY};line-height:1.06;letter-spacing:0;font-weight:400}
        .gl-balance{text-wrap:balance}
        .gl-focus{display:inline-block;filter:blur(8px);opacity:.3;
          transition:filter .55s cubic-bezier(.23,1,.32,1),opacity .55s cubic-bezier(.23,1,.32,1)}
        .gl-focus.is-sharp{filter:blur(0);opacity:1}
        .gl-clip .gl-clip-img{clip-path:inset(0 0 100% 0);transform:scale(1.08);
          transition:clip-path 1.05s cubic-bezier(.16,1,.3,1),transform 1.3s cubic-bezier(.16,1,.3,1)}
        .gl-clip.is-open .gl-clip-img{clip-path:inset(0 0 0 0);transform:scale(1)}
        @keyframes glHero{from{clip-path:inset(0 0 100% 0);transform:scale(1.08)}
          to{clip-path:inset(0 0 0 0);transform:scale(1)}}
        .gl-heroimg{animation:glHero 1.5s cubic-bezier(.16,1,.3,1) both}
        .gl-cta{transition:transform .16s cubic-bezier(.23,1,.32,1),opacity .16s ease}
        .gl-cta:hover{transform:translateY(-2px)}
        .gl-cta:active{transform:scale(.98)}
        .gl-navlink{position:relative;min-height:44px;display:inline-flex;align-items:center;padding:6px 2px}
        .gl-navlink::after{content:"";position:absolute;left:0;right:100%;bottom:9px;height:1.5px;
          background:${EMERALD};transition:right .22s cubic-bezier(.23,1,.32,1)}
        .gl-navlink:hover::after{right:0}
        .gl-lens-range{position:absolute;inset:0;z-index:3;width:100%;height:100%;margin:0;
          opacity:0;cursor:ew-resize;touch-action:pan-y;-webkit-appearance:none;appearance:none}
        .gl-lens-divider{position:absolute;top:0;bottom:0;z-index:2;width:2px;margin-left:-1px;
          background:${IVORY};box-shadow:0 0 14px rgba(23,21,15,.5);pointer-events:none}
        .gl-lens-handle{position:absolute;top:50%;z-index:2;display:flex;align-items:center;justify-content:center;
          width:56px;height:56px;border-radius:50%;transform:translate(-50%,-50%);pointer-events:none;
          background:${IVORY};border:2px solid rgba(29,26,22,.2);box-shadow:0 6px 24px rgba(23,21,15,.35)}
        .gl-lens-range:focus-visible ~ .gl-lens-handle{outline:3px solid ${EMERALD};outline-offset:3px}
        .gl-lens-tag{position:absolute;bottom:12px;z-index:2;pointer-events:none;padding:5px 10px;
          font-size:12px;letter-spacing:.06em;color:${IVORY};background:rgba(23,21,15,.7)}
        .gl-root :focus-visible{outline:3px solid ${EMERALD};outline-offset:3px}
        .gl-dark :focus-visible{outline-color:${IVORY}}
        @media (prefers-reduced-motion: reduce){
          .gl-root *,.gl-root *::before,.gl-root *::after{
            transition-duration:.01ms!important;animation-duration:.01ms!important}
          .gl-heroimg{animation:none}
          .gl-focus{filter:none;opacity:1}
          .gl-clip .gl-clip-img{clip-path:inset(0 0 0 0);transform:none}
        }
      `}</style>

      {/* ── header — light ground for the vintage dark mark ─────────────────── */}
      <header className="sticky top-0 z-50" style={{ background: IVORY, borderBottom: `1px solid ${HAIR}` }}>
        <div className="mx-auto flex h-[76px] w-full max-w-[1240px] items-center justify-between gap-4 px-5 md:px-8">
          <a href="#efst" aria-label="Gleraugnasalan Geisli, efst á síðu" className="flex min-h-[44px] items-center">
            {/* recovered vintage mark, cropped tight to content + smoothly upscaled (572x312, ratio-safe) */}
            <img src={`${BASE}${LOGO}`} alt="Gleraugnasalan Geisli" width={572} height={312} className="h-14 w-auto md:h-16" />
          </a>
          <nav aria-label="Aðalvalmynd" className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="gl-navlink text-[15px] font-medium">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <a href={PHONE_HREF} className="hidden min-h-[44px] items-center text-[15px] font-semibold sm:inline-flex" style={{ color: EMERALD }}>
              {PHONE_DISPLAY}
            </a>
            <Cta href={PHONE_HREF} variant="emerald">Panta tíma</Cta>
          </div>
        </div>
      </header>

      <main id="efst">
        {/* ── 1 · hero — editorial split, headline resolves into focus ───────── */}
        <section aria-label="Gleraugu eru skart" className="mx-auto grid w-full max-w-[1240px] gap-10 px-5 pb-16 pt-10 md:min-h-[calc(100svh-76px)] md:grid-cols-[1.05fr_1fr] md:items-center md:gap-14 md:px-8 md:pb-20 md:pt-0">
          <motion.div variants={heroStagger} initial="hidden" animate="show">
            <motion.p variants={heroItem} className="text-[13.5px] font-medium tracking-[0.02em]" style={{ color: MUTED }}>
              {HERO.eyebrow}
            </motion.p>
            <h1 className="gl-display gl-balance m-0 mt-5 text-[clamp(3rem,9.5vw,6.4rem)]">
              <FocusText>
                {HERO.line1}
                <br />
                eru <em style={{ color: EMERALD, fontStyle: 'italic' }}>skart.</em>
              </FocusText>
            </h1>
            <motion.p variants={heroItem} className="mt-6 max-w-[46ch] text-[17px] leading-relaxed" style={{ color: MUTED }}>
              {HERO.sub}
            </motion.p>
            <motion.div variants={heroItem} className="mt-9 flex flex-wrap gap-3">
              <Cta href={PHONE_HREF} variant="emerald">{HERO.ctaPrimary}</Cta>
              <Cta href="#thjonusta" variant="inkline">{HERO.ctaSecondary}</Cta>
            </motion.div>
          </motion.div>

          <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:h-[min(78svh,760px)]">
            <Img
              src={IMG.hero.src}
              srcSet={IMG.hero.srcSet}
              sizes="(min-width: 768px) 48vw, 100vw"
              alt={IMG.hero.alt}
              loading="eager"
              fetchpriority="high"
              className="gl-heroimg h-full w-full object-cover"
            />
          </div>
        </section>

        {/* ── 2 · trust band — the three counted facts ────────────────────────── */}
        <section aria-label="Geisli í hnotskurn" style={{ borderTop: `1px solid ${HAIR_GOLD}`, borderBottom: `1px solid ${HAIR_GOLD}` }}>
          <h2 className="sr-only">Geisli í hnotskurn</h2>
          <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-y-8 px-5 py-12 sm:grid-cols-3 sm:gap-x-8 md:px-8 md:py-14">
            {TRUST.map((t) => (
              <div key={t.label} className="text-center sm:text-left">
                <p className="gl-display m-0 text-[clamp(2.2rem,4vw,3rem)]" style={{ color: GOLD }}>
                  {t.value}
                </p>
                <p className="m-0 mt-1 text-[15px]" style={{ color: MUTED }}>{t.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3 · SIGNATURE — the blur⇄sharp lens over the fjord ─────────────── */}
        <section id="sjonin" aria-labelledby="sjonin-h" className="mx-auto w-full max-w-[1240px] scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
          <h2 id="sjonin-h" className="gl-display gl-balance m-0 max-w-[18ch] text-[clamp(2.2rem,5.5vw,4rem)]">
            <FocusText>{LENS.heading}</FocusText>
          </h2>
          <p className="mt-5 max-w-[58ch] text-[17px] leading-relaxed" style={{ color: MUTED }}>
            {LENS.body}
          </p>
          <div className="mt-10">
            <LensDivider />
            <div className="mt-4 flex flex-col justify-between gap-1 text-[13.5px] sm:flex-row" style={{ color: MUTED }}>
              <span style={{ color: GOLD_DEEP, fontWeight: 600 }}>{LENS.caption}</span>
              <span>{LENS.hint}</span>
            </div>
          </div>
        </section>

        {/* ── 4 · umgjarðir sem skart — jewelry plates ────────────────────────── */}
        <section id="umgjardir" aria-labelledby="umgjardir-h" className="mx-auto w-full max-w-[1240px] scroll-mt-24 px-5 pb-20 md:px-8 md:pb-28">
          <div className="max-w-[62ch]">
            <h2 id="umgjardir-h" className="gl-display gl-balance m-0 text-[clamp(2.4rem,6vw,4.4rem)]">
              <FocusText>
                Umgjarðir sem <em style={{ color: EMERALD, fontStyle: 'italic' }}>skart</em>
              </FocusText>
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed" style={{ color: MUTED }}>{FRAMES.intro}</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-3 md:mt-16">
            {FRAMES.plates.map((p, i) => (
              <figure key={p.caption} className={`m-0 ${i === 1 ? 'sm:mt-14' : ''}`}>
                <ClipReveal
                  src={IMG[p.img].src}
                  sizes="(min-width: 640px) 30vw, 100vw"
                  alt={IMG[p.img].alt}
                  className={i === 1 ? 'aspect-square' : 'aspect-[4/5]'}
                />
                <figcaption className="mt-4 flex items-baseline gap-3 text-[14.5px]" style={{ color: MUTED }}>
                  <span aria-hidden className="inline-block h-px w-7 self-center" style={{ background: HAIR_GOLD }} />
                  {p.caption}
                </figcaption>
              </figure>
            ))}
          </div>

          <figure className="m-0 mt-12 md:mt-16">
            <ClipReveal
              src={IMG.wall.src}
              sizes="(min-width: 1280px) 1200px, 100vw"
              alt={IMG.wall.alt}
              className="aspect-[16/9] md:aspect-[21/9]"
            />
            <figcaption className="mt-4 text-[14.5px]" style={{ color: MUTED }}>{FRAMES.wallCaption}</figcaption>
          </figure>
        </section>

        {/* ── 5 · þjónusta — exam + lenses stacked against the exam photo,
                then the first-glasses story as its own emotional moment ──────── */}
        <section id="thjonusta" aria-labelledby="thjonusta-h" className="mx-auto w-full max-w-[1240px] scroll-mt-24 px-5 pb-20 md:px-8 md:pb-28">
          <h2 id="thjonusta-h" className="gl-display m-0 text-[clamp(2.4rem,6vw,4.4rem)]">
            <FocusText>{SERVICES.heading}</FocusText>
          </h2>

          <div className="mt-12 grid gap-12 md:grid-cols-[1fr_1.15fr] md:gap-14">
            <div className="flex flex-col justify-center">
              <div style={{ borderTop: `1px solid ${HAIR}` }}>
                <div className="py-8">
                  <h3 className="gl-display m-0 text-[1.8rem]" style={{ color: INK }}>{SERVICES.exam.title}</h3>
                  <p className="m-0 mt-3 max-w-[52ch] text-[16px] leading-relaxed" style={{ color: MUTED }}>
                    {SERVICES.exam.body}
                  </p>
                </div>
                <div className="py-8" style={{ borderTop: `1px solid ${HAIR}` }}>
                  <h3 className="gl-display m-0 text-[1.8rem]" style={{ color: INK }}>{SERVICES.lenses.title}</h3>
                  <p className="m-0 mt-3 max-w-[52ch] text-[16px] leading-relaxed" style={{ color: MUTED }}>
                    {SERVICES.lenses.body}
                  </p>
                </div>
              </div>
            </div>
            <ClipReveal
              src={IMG.exam.src}
              sizes="(min-width: 768px) 54vw, 100vw"
              alt={IMG.exam.alt}
              className="aspect-[4/3] md:aspect-auto md:min-h-[440px]"
            />
          </div>

          <div className="mt-16 grid items-center gap-10 md:mt-24 md:grid-cols-[1fr_1.1fr] md:gap-14">
            <ClipReveal
              src={IMG.child.src}
              sizes="(min-width: 768px) 44vw, 100vw"
              alt={IMG.child.alt}
              className="aspect-[4/5] md:order-none"
            />
            <div>
              <h3 className="gl-display gl-balance m-0 text-[clamp(2rem,4.5vw,3.2rem)]" style={{ color: EMERALD }}>
                {SERVICES.child.title}
              </h3>
              <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed" style={{ color: MUTED }}>
                {SERVICES.child.body}
              </p>
            </div>
          </div>
        </section>

        {/* ── 6 · heritage band — deep ground, full-bleed retro exam photo ────── */}
        {/* solid near-black ground so the band stays legible if the photo fails */}
        <section id="sagan" aria-labelledby="sagan-h" className="gl-dark relative scroll-mt-24 overflow-hidden" style={{ background: '#17150F' }}>
          <motion.div
            aria-hidden
            className="absolute inset-0"
            initial={{ opacity: 0, scale: reduced ? 1 : 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: EASE }}
          >
            <Img
              src={IMG.retro.src}
              alt=""
              loading="eager"
              className="h-full w-full object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: 'linear-gradient(100deg, rgba(23,21,15,0.94) 0%, rgba(23,21,15,0.86) 46%, rgba(23,21,15,0.55) 100%)' }}
            />
          </motion.div>
          <div className="relative mx-auto w-full max-w-[1240px] px-5 py-24 md:px-8 md:py-36">
            <p className="gl-display m-0 text-[clamp(4rem,12vw,8.5rem)] leading-none" style={{ color: GOLD_LIGHT }}>
              {HERITAGE.year}
            </p>
            <h2 id="sagan-h" className="gl-display gl-balance m-0 mt-4 max-w-[18ch] text-[clamp(2.2rem,5.5vw,4rem)]" style={{ color: IVORY }}>
              <FocusText>{HERITAGE.heading}</FocusText>
            </h2>
            <p className="mt-6 max-w-[56ch] text-[17px] leading-relaxed" style={{ color: 'rgba(245,242,236,0.9)' }}>
              {HERITAGE.body1}
            </p>
            <p className="mt-4 max-w-[56ch] text-[17px] leading-relaxed" style={{ color: 'rgba(245,242,236,0.9)' }}>
              {HERITAGE.body2}
            </p>
          </div>
        </section>

        {/* ── 7 · umsagnir — sample reviews, clearly disclaimed ──────────────── */}
        <section id="umsagnir" aria-labelledby="umsagnir-h" className="mx-auto w-full max-w-[1240px] scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
          <h2 id="umsagnir-h" className="gl-display m-0 text-[clamp(2.2rem,5.5vw,3.6rem)]">{REVIEWS.heading}</h2>
          <p className="mt-3 max-w-[68ch] text-[13.5px]" style={{ color: MUTED }}>{REVIEWS.disclaimer}</p>
          <div className="mt-10 grid gap-10 md:grid-cols-[1.25fr_1fr_1fr] md:gap-8">
            {REVIEWS.items.map((r, i) => (
              <blockquote key={r.name} className={`m-0 pt-6 ${i === 2 ? 'md:mt-12' : ''}`} style={{ borderTop: `1px solid ${HAIR_GOLD}` }}>
                <p className={`gl-display m-0 leading-snug ${i === 0 ? 'text-[clamp(1.3rem,2.4vw,1.7rem)]' : 'text-[1.2rem]'}`} style={{ color: INK }}>
                  {r.quote}
                </p>
                <footer className="mt-4 text-[14.5px] font-medium" style={{ color: EMERALD }}>{r.name}</footer>
              </blockquote>
            ))}
          </div>
        </section>

        {/* ── 8 · heimsókn — verified Kaupangur hours, Glerártorg by name only ── */}
        <section id="heimsokn" aria-labelledby="heimsokn-h" className="mx-auto w-full max-w-[1240px] scroll-mt-24 px-5 pb-24 md:px-8 md:pb-32">
          <h2 id="heimsokn-h" className="gl-display m-0 text-[clamp(2.4rem,6vw,4.4rem)]">
            <FocusText>{VISIT.heading}</FocusText>
          </h2>
          <div className="mt-12 grid gap-12 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-5">
              <h3 className="gl-display m-0 text-[1.8rem]">{VISIT.kaupangur.name}</h3>
              <p className="m-0 mt-2 text-[16px]" style={{ color: MUTED }}>{VISIT.kaupangur.address}</p>
              <a href={PHONE_HREF} className="gl-display mt-5 inline-flex min-h-[44px] items-center text-[clamp(1.9rem,4vw,2.6rem)]" style={{ color: EMERALD }}>
                {PHONE_DISPLAY}
              </a>
              <dl className="m-0 mt-6 max-w-[26rem]" style={{ borderTop: `1px solid ${HAIR}` }}>
                {VISIT.kaupangur.hours.map((h) => (
                  <div key={h.days} className="flex items-baseline justify-between gap-6 py-3" style={{ borderBottom: `1px solid ${HAIR}` }}>
                    <dt className="text-[15px]" style={{ color: MUTED }}>{h.days}</dt>
                    <dd className="m-0 text-[15px] font-semibold" style={{ color: INK }}>{h.time}</dd>
                  </div>
                ))}
              </dl>
              <a href={VISIT.kaupangur.mapHref} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-[44px] items-center text-[15px] font-semibold underline underline-offset-4" style={{ color: EMERALD }}>
                Sjá Kaupang á korti
              </a>
            </div>

            <div className="md:col-span-3">
              <h3 className="gl-display m-0 text-[1.8rem]">{VISIT.glerartorg.name}</h3>
              <p className="m-0 mt-2 text-[16px]" style={{ color: MUTED }}>{VISIT.glerartorg.address}</p>
              <p className="m-0 mt-5 max-w-[30ch] text-[16px] leading-relaxed" style={{ color: MUTED }}>
                {VISIT.glerartorg.note}
              </p>
              <a href={VISIT.glerartorg.mapHref} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-[44px] items-center text-[15px] font-semibold underline underline-offset-4" style={{ color: EMERALD }}>
                Sjá Glerártorg á korti
              </a>
            </div>

            <figure className="m-0 md:col-span-4">
              <ClipReveal
                src={IMG.town.src}
                sizes="(min-width: 768px) 32vw, 100vw"
                alt={IMG.town.alt}
                className="aspect-[4/5]"
              />
              <figcaption className="mt-3 text-[13.5px]" style={{ color: MUTED }}>{VISIT.townCaption}</figcaption>
            </figure>
          </div>
        </section>

        {/* ── 9 · closing — emerald band, one clear call ─────────────────────── */}
        <section aria-labelledby="lokakall-h" className="gl-dark" style={{ background: EMERALD }}>
          <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center px-5 py-20 text-center md:px-8 md:py-28">
            <h2 id="lokakall-h" className="gl-display gl-balance m-0 max-w-[16ch] text-[clamp(2.4rem,7vw,5rem)]" style={{ color: IVORY }}>
              <FocusText>{CLOSING.heading}</FocusText>
            </h2>
            <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed" style={{ color: MINT }}>{CLOSING.body}</p>
            <a href={PHONE_HREF} className="gl-display mt-8 inline-flex min-h-[44px] items-center text-[clamp(2.6rem,8vw,4.5rem)] leading-none" style={{ color: IVORY }}>
              {PHONE_DISPLAY}
            </a>
            <div className="mt-9">
              <Cta href={PHONE_HREF} variant="ivory">Panta tíma</Cta>
            </div>
            <p className="mt-12 text-[12.5px] tracking-[0.04em]" style={{ color: MINT }}>{CLOSING.imprint}</p>
          </div>
        </section>
      </main>

      {/* ── mobile sticky CTA ──────────────────────────────────────────────── */}
      <a
        href={PHONE_HREF}
        className="fixed inset-x-4 bottom-4 z-40 flex min-h-[52px] items-center justify-center text-[16.5px] font-semibold md:hidden"
        style={{ background: EMERALD, color: IVORY, boxShadow: '0 10px 30px rgba(23,21,15,0.3)' }}
      >
        Panta tíma · {PHONE_DISPLAY}
      </a>
      <div aria-hidden className="h-20 md:hidden" />

      <PreviewFooter company={company} />
    </div>
  )
}
