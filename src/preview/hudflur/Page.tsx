/**
 * Húðflúrstofa Norðurlands — "Fine Line"
 *
 * SIGNATURE: a single continuous ink line drawn down the page as the user
 * scrolls, connecting hero → trust → about → services → reviews/visit like
 * one piece of linework tattoo art. Driven by a SYNCHRONOUS passive `window`
 * scroll listener that reads the wrapping track's getBoundingClientRect()
 * and writes the SVG path's stroke-dashoffset directly — no Framer
 * useScroll/useVelocity, no rAF loop (this project's screenshot/verification
 * tooling and production behavior both depend on that exact pattern; see
 * cavesofhella/Page.tsx §DescentSection for the precedent). Reduced motion:
 * the line renders fully drawn, no listener attached.
 *
 * Hero is opacity:1 on mount — its entrance is a CSS transform-only keyframe
 * (never gated on a Framer mount/whileInView fire), per this project's rule
 * that a backgrounded preview tab freezes rAF/Framer mounts.
 *
 * Fonts: Space Grotesk (font-grotesk, display — swapped from the too-soft
 * Bricolage Grotesque per Sindri's "look more like an actual tattoo parlor"
 * note: a confident geometric grotesk pairs better against the real chrome
 * heraldic logo than a rounded friendly face), Hanken Grotesk (font-hanken,
 * body), Space Mono (font-mono, labels/stats). All already loaded
 * project-wide, no self-load needed — verified in index.html + the @theme
 * block in src/index.css before writing this file.
 *
 * Real logo: a chrome/silver heraldic shield-and-eagle mark recovered from
 * the studio's own Facebook profile photo (public/hudflur/brand/logo.png,
 * background keyed transparent). Anchors the header + a large low-opacity
 * hero watermark.
 */
import { useEffect, useRef } from 'react'
import type { CSSProperties, ReactNode, RefObject } from 'react'
import { useReducedMotion } from 'framer-motion'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Reveal } from '../../components/Reveal'
import { StickyCta } from '../../components/StickyCta'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import { ABOUT, CARE, HERO, IMG, JSON_LD, LOGO, META, NAV, PROCESS, REVIEWS, SERVICES, TRUST, VISIT } from './data'

const company = getPreviewCompany('hudflur')

/* ── palette ────────────────────────────────────────────────────────────────
   Near-black ink ground, off-white ink text, ONE accent — deep ink-crimson,
   starting from the company's accent field #C22A2E.

   Contrast math (WCAG relative luminance, sRGB channel c ∈ [0,1]):
     lin(c) = c/12.92                   if c <= 0.03928
     lin(c) = ((c+0.055)/1.055)^2.4     otherwise
     L = 0.2126*R + 0.7152*G + 0.0722*B      (contrast = (L1+0.05)/(L2+0.05))

   INK   #0D0D0F → R13 G13 B15  → L ≈ 0.0041
   ACCENT (raw) #C22A2E → R194 G42 B46 → L ≈ 0.1336
     contrast vs INK = (0.1336+0.05)/(0.0041+0.05) ≈ 3.39:1
     → only meets the AA "large text" floor (≥3:1: headings ≥24px, borders,
       icons) — NOT safe for small body text/links on the dark ground.
   ACCENT_TINT #D97577 = ACCENT mixed 35% toward white (same hue, lighter):
     R 194+(255-194)*.35≈215  G 42+(255-42)*.35≈117  B 46+(255-46)*.35≈119
     → L ≈ 0.2850 → contrast vs INK = (0.2850+0.05)/(0.0041+0.05) ≈ 6.19:1
     → AA-safe (≥4.5:1) for small text — the same lighten-for-small-text
       trick as Weider's #ff5470-on-dark. Used for every small accent label,
       stat caption, link and inline emphasis on the ink ground.
   MUTED rgba(241,238,233,0.68) over INK ≈ effective RGB (168,166,163)
     → L ≈ 0.383 → contrast ≈ 8:1 — safe for secondary body copy.        ── */
const INK = '#0D0D0F'
const PANEL = '#131217'
const OFFWHITE = '#F1EEE9'
const MUTED = 'rgba(241,238,233,0.68)'
const ACCENT = '#C22A2E'
const ACCENT_TINT = '#D97577'
const HAIR = 'rgba(241,238,233,0.14)'
const HAIR_ACCENT = 'rgba(194,42,46,0.4)'
/* Steel-silver, sampled from the real chrome logo — decorative only (icon
 * strokes, hairlines, ghost numerals), never load-bearing text, so it
 * doesn't need its own AA math: it's as light as OFFWHITE on this ground. */
const SILVER = '#C7CBCE'

const FACEBOOK_HREF = company.currentUrl
const EMAIL_HREF = `mailto:${company.ownerEmail}`

/** Shared inner-content wrapper: clears the ink-line gutter on the left
 *  (w-7/md:w-14 below), standard right gutter, centred reading column. */
const WRAP = 'mx-auto w-full max-w-[1240px] pl-9 pr-5 md:pl-16 md:pr-8'

/* ── SIGNATURE — the ink line ────────────────────────────────────────────── */

/** Deterministic snake path in a fixed 100×1000 coordinate space. Stretched
 *  via preserveAspectRatio="none" to whatever height the track renders at —
 *  getTotalLength()/dashoffset stay in these same local units regardless of
 *  the visual stretch, so no remeasuring is needed when content height
 *  changes (responsive reflow, image load, etc). */
function buildInkPath(waves = 7, totalY = 1000): string {
  const midX = 50
  const amp = 30
  const stepY = totalY / waves
  let d = `M ${midX} 0`
  for (let i = 0; i < waves; i++) {
    const y0 = i * stepY
    const y1 = y0 + stepY
    const dir = i % 2 === 0 ? 1 : -1
    const cx1 = midX + dir * amp
    const cy1 = y0 + stepY * 0.35
    const cx2 = midX - dir * amp
    const cy2 = y0 + stepY * 0.65
    d += ` C ${cx1.toFixed(1)} ${cy1.toFixed(1)} ${cx2.toFixed(1)} ${cy2.toFixed(1)} ${midX} ${y1.toFixed(1)}`
  }
  return d
}
const INK_PATH = buildInkPath()

function InkLine({ trackRef, reduced }: { trackRef: RefObject<HTMLDivElement>; reduced: boolean }) {
  const pathRef = useRef<SVGPathElement>(null)
  const lenRef = useRef(0)

  // Set up dasharray/dashoffset once the path node exists. Reduced motion:
  // fully drawn immediately (dashoffset 0), no listener attached below.
  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    const len = path.getTotalLength()
    lenRef.current = len
    path.style.strokeDasharray = String(len)
    path.style.strokeDashoffset = reduced ? '0' : String(len)
  }, [reduced])

  useEffect(() => {
    if (reduced) return
    const track = trackRef.current
    const path = pathRef.current
    if (!track || !path) return

    // Synchronous passive scroll handler: read the track's rect, map to a
    // 0..1 progress across "track enters viewport" → "track fully scrolled
    // past", write stroke-dashoffset directly. No rAF loop, no CSS
    // transition on this property (it must track the scroll tick exactly).
    const onScroll = () => {
      const rect = track.getBoundingClientRect()
      const vh = window.innerHeight
      const p = Math.min(1, Math.max(0, (vh - rect.top) / (rect.height + vh)))
      path.style.strokeDashoffset = String(lenRef.current * (1 - p))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reduced, trackRef])

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 h-full w-7 md:w-14"
      viewBox="0 0 100 1000"
      preserveAspectRatio="none"
    >
      <path
        ref={pathRef}
        d={INK_PATH}
        fill="none"
        stroke={ACCENT_TINT}
        strokeWidth={2.4}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/* ── small bits ─────────────────────────────────────────────────────────── */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono m-0 text-[11.5px] font-medium uppercase tracking-[0.22em]" style={{ color: ACCENT_TINT }}>
      {children}
    </p>
  )
}

function Cta({ href, children, variant, external, className = '' }: {
  href: string; children: ReactNode; variant: 'filled' | 'ghost'; external?: boolean; className?: string
}) {
  const styles: Record<string, CSSProperties> = {
    filled: { background: ACCENT, color: OFFWHITE },
    ghost: { background: 'transparent', color: OFFWHITE, boxShadow: `inset 0 0 0 1.5px ${HAIR_ACCENT}` },
  }
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className={`hf-cta font-hanken inline-flex min-h-[48px] items-center justify-center px-7 text-[15px] font-semibold tracking-[0.01em] ${className}`}
      style={styles[variant]}
    >
      {children}
    </a>
  )
}

function ServiceIcon({ kind }: { kind: 'tattoo' | 'piercing' }) {
  if (kind === 'piercing') {
    return (
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
        <circle cx="17" cy="17" r="10" stroke={ACCENT_TINT} strokeWidth="1.6" />
        <circle cx="17" cy="17" r="2.2" fill={ACCENT_TINT} />
      </svg>
    )
  }
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <path d="M6 28 C 10 20, 14 20, 17 14 C 20 8, 24 8, 28 5" stroke={ACCENT_TINT} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="28" cy="5" r="1.6" fill={ACCENT_TINT} />
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════ the page ═ */
export default function HudflurPage() {
  const reduced = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = META.title
    setThemeColor(INK)
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

  return (
    <div
      lang="is"
      className="hf-root font-hanken min-h-[100svh] overflow-x-hidden antialiased"
      style={{ background: INK, color: OFFWHITE }}
    >
      <script type="application/ld+json">{JSON.stringify(JSON_LD)}</script>
      <PreviewChrome company={company} />

      <style>{`
        .hf-hero-copy{opacity:1;transform:translateY(18px);animation:hfHeroIn .9s cubic-bezier(.16,1,.3,1) .1s both}
        @keyframes hfHeroIn{to{transform:translateY(0)}}
        .hf-navlink{position:relative;min-height:44px;display:inline-flex;align-items:center;padding:6px 2px}
        .hf-navlink::after{content:"";position:absolute;left:0;right:100%;bottom:2px;height:1.5px;
          background:${ACCENT_TINT};transition:right .22s cubic-bezier(.23,1,.32,1)}
        .hf-navlink:hover::after{right:0}
        .hf-cta{transition:transform .16s cubic-bezier(.23,1,.32,1),opacity .16s ease}
        .hf-cta:hover{transform:translateY(-2px)}
        .hf-cta:active{transform:scale(.98)}
        .hf-root :focus-visible{outline:3px solid ${ACCENT_TINT};outline-offset:3px}
        @media (prefers-reduced-motion: reduce){
          .hf-root *,.hf-root *::before,.hf-root *::after{
            transition-duration:.01ms!important;animation-duration:.01ms!important}
          .hf-hero-copy{animation:none;transform:none}
        }
      `}</style>

      {/* ── header ────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b" style={{ background: 'rgba(13,13,15,0.85)', borderColor: HAIR, backdropFilter: 'blur(10px)' }}>
        <div className="mx-auto flex h-[72px] w-full max-w-[1240px] items-center justify-between gap-4 px-5 md:px-8">
          <a href="#efst" aria-label="Húðflúrstofa Norðurlands, efst á síðu" className="flex min-h-[44px] items-center gap-2.5">
            <img src={`${import.meta.env.BASE_URL}${LOGO}`} alt="" aria-hidden="true" className="h-8 w-auto md:h-9" width={64} height={90} />
            <span className="font-grotesk text-[15.5px] font-semibold tracking-tight">
              Húðflúrstofa <span style={{ color: ACCENT_TINT }}>Norðurlands</span>
            </span>
          </a>
          <nav aria-label="Aðalvalmynd" className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="hf-navlink font-hanken text-[14.5px] font-medium" style={{ color: MUTED }}>
                {n.label}
              </a>
            ))}
          </nav>
          <Cta href={FACEBOOK_HREF} variant="filled" external className="hidden !min-h-[40px] !px-5 !text-[13.5px] sm:inline-flex">
            Panta tíma
          </Cta>
        </div>
      </header>

      <div ref={trackRef} className="relative">
        <InkLine trackRef={trackRef} reduced={!!reduced} />

        <main id="efst">
          {/* ── 1 · hero ──────────────────────────────────────────────────── */}
          <section aria-label="Kynning" className="relative min-h-[100svh] overflow-hidden">
            <div aria-hidden className="absolute inset-0">
              <Img
                src={IMG.hero.src}
                srcSet={IMG.hero.srcSet}
                sizes="100vw"
                alt=""
                loading="eager"
                fetchpriority="high"
                className="kenburns h-full w-full object-cover"
              />
              {/* Scrim: near-solid ink under the headline (left), fading toward
                  the photo (right) — keeps OFFWHITE text at ~17:1 on INK
                  regardless of the underlying photo's brightness (see palette
                  contrast math above). */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{ background: 'linear-gradient(105deg, rgba(13,13,15,0.95) 0%, rgba(13,13,15,0.84) 40%, rgba(13,13,15,0.45) 68%, rgba(13,13,15,0.18) 100%)' }}
              />
            </div>

            {/* ghost logo watermark — the real shield, low-opacity, desktop only */}
            <img
              src={`${import.meta.env.BASE_URL}${LOGO}`}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 top-1/2 hidden h-[130%] w-auto -translate-y-1/2 opacity-[0.09] lg:block"
              width={503}
              height={712}
            />

            <div className="hf-hero-copy relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1240px] flex-col justify-center pl-9 pr-5 py-28 md:pl-16 md:pr-8">
              <Eyebrow>{HERO.eyebrow}</Eyebrow>
              <h1 className="font-grotesk m-0 mt-5 max-w-[15ch] text-[clamp(2.6rem,8vw,5.2rem)] leading-[1.04]">
                {HERO.line1}
                <br />
                <span style={{ color: ACCENT_TINT }}>{HERO.line2}</span>
              </h1>
              <p className="font-hanken mt-6 max-w-[46ch] text-[17px] leading-relaxed" style={{ color: MUTED }}>
                {HERO.sub}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Cta href={FACEBOOK_HREF} variant="filled" external>{HERO.ctaPrimary}</Cta>
                <Cta href={EMAIL_HREF} variant="ghost">{HERO.ctaSecondary}</Cta>
              </div>
            </div>
          </section>

          {/* ── 2 · trust band — honest counted numbers, no invented meters ── */}
          <section aria-label="Í hnotskurn" style={{ background: PANEL, borderTop: `1px solid ${HAIR}`, borderBottom: `1px solid ${HAIR}` }}>
            <h2 className="sr-only">Í hnotskurn</h2>
            <div className={`${WRAP} grid grid-cols-1 gap-y-8 py-12 sm:grid-cols-3 sm:gap-x-8 md:py-16`}>
              {TRUST.map((t) => (
                <Reveal key={t.label}>
                  <p className="font-grotesk m-0 text-[clamp(2.4rem,4.5vw,3.4rem)]">{t.value}</p>
                  <p className="font-mono m-0 mt-2 text-[12.5px] uppercase tracking-[0.08em]" style={{ color: MUTED }}>
                    {t.label}
                  </p>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ── 3 · þjónusta ──────────────────────────────────────────────── */}
          <section id="thjonusta" aria-labelledby="thjonusta-h" className="scroll-mt-24" style={{ background: PANEL, borderTop: `1px solid ${HAIR}` }}>
            <div className={`${WRAP} py-20 md:py-28`}>
              <Reveal>
                <h2 id="thjonusta-h" className="font-grotesk m-0 text-[clamp(2.2rem,5.5vw,3.6rem)]">{SERVICES.heading}</h2>
                <p className="font-hanken mt-4 max-w-[50ch] text-[16.5px]" style={{ color: MUTED }}>{SERVICES.intro}</p>
              </Reveal>

              <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-10">
                {SERVICES.items.map((s, i) => (
                  <Reveal key={s.title} delay={i * 0.08}>
                    <div className="pt-7" style={{ borderTop: `1px solid ${HAIR_ACCENT}` }}>
                      <ServiceIcon kind={i === 0 ? 'tattoo' : 'piercing'} />
                      <h3 className="font-grotesk mt-5 text-[1.5rem]">{s.title}</h3>
                      <p className="font-hanken mt-3 max-w-[46ch] text-[15.5px] leading-relaxed" style={{ color: MUTED }}>{s.body}</p>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={0.2} className="mt-14 block">
                <figure className="m-0">
                  <div className="aspect-[16/9] overflow-hidden md:aspect-[21/9]">
                    <Img src={IMG.inkCaps.src} alt={IMG.inkCaps.alt} className="h-full w-full object-cover" />
                  </div>
                  <figcaption className="font-mono mt-3 text-[12px] uppercase tracking-[0.06em]" style={{ color: MUTED }}>
                    {SERVICES.caption}
                  </figcaption>
                </figure>
              </Reveal>
            </div>
          </section>

          {/* ── 4 · ferlið — how a session actually works ────────────────────── */}
          <section id="ferlid" aria-labelledby="ferlid-h" className="scroll-mt-24">
            <div className={`${WRAP} py-20 md:py-28`}>
              <Reveal>
                <Eyebrow>{PROCESS.eyebrow}</Eyebrow>
                <h2 id="ferlid-h" className="font-grotesk m-0 mt-3 max-w-[16ch] text-[clamp(2.2rem,5.5vw,3.6rem)]">
                  {PROCESS.heading}
                </h2>
              </Reveal>

              <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                {PROCESS.steps.map((s, i) => (
                  <Reveal key={s.n} delay={i * 0.07}>
                    <p className="font-grotesk m-0 text-[2.4rem] leading-none" style={{ color: SILVER, opacity: 0.5 }}>
                      {s.n}
                    </p>
                    <h3 className="font-grotesk mt-3 text-[1.15rem]">{s.title}</h3>
                    <p className="font-hanken mt-2 max-w-[32ch] text-[14.5px] leading-relaxed" style={{ color: MUTED }}>
                      {s.body}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── 5 · umhirða — genuine, generic aftercare guidance ─────────────── */}
          <section id="umhirda" aria-labelledby="umhirda-h" className="scroll-mt-24" style={{ background: PANEL, borderTop: `1px solid ${HAIR}` }}>
            <div className={`${WRAP} grid gap-12 py-20 md:grid-cols-[1fr_1.05fr] md:items-start md:gap-16 md:py-28`}>
              <Reveal>
                <Eyebrow>{CARE.eyebrow}</Eyebrow>
                <h2 id="umhirda-h" className="font-grotesk m-0 mt-3 max-w-[14ch] text-[clamp(2.2rem,5.5vw,3.6rem)] leading-tight">
                  {CARE.heading}
                </h2>
                <p className="font-hanken mt-5 max-w-[42ch] text-[15.5px] leading-relaxed" style={{ color: MUTED }}>
                  {CARE.intro}
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <ul className="m-0 flex list-none flex-col gap-4 p-0">
                  {CARE.items.map((item) => (
                    <li key={item} className="flex gap-3 pt-4" style={{ borderTop: `1px solid ${HAIR}` }}>
                      <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: ACCENT_TINT }} />
                      <p className="font-hanken m-0 text-[15.5px] leading-relaxed" style={{ color: OFFWHITE }}>{item}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>

          {/* ── 6 · um stofuna ───────────────────────────────────────────────── */}
          <section id="um" aria-labelledby="um-h" className="scroll-mt-24">
            <div className={`${WRAP} grid gap-12 py-20 md:grid-cols-[1.05fr_1fr] md:items-center md:gap-14 md:py-28`}>
              <Reveal>
                <h2 id="um-h" className="font-grotesk m-0 max-w-[14ch] text-[clamp(2.2rem,5.5vw,3.6rem)] leading-tight">
                  {ABOUT.heading}
                </h2>
                <p className="font-hanken mt-6 max-w-[52ch] text-[16.5px] leading-relaxed" style={{ color: MUTED }}>
                  {ABOUT.body1}
                </p>
                <p className="font-hanken mt-4 max-w-[52ch] text-[16.5px] leading-relaxed" style={{ color: MUTED }}>
                  {ABOUT.body2}
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <figure className="m-0">
                  <div className="aspect-[4/5] overflow-hidden md:aspect-[4/3]">
                    <Img
                      src={IMG.studio.src}
                      srcSet={IMG.studio.srcSet}
                      sizes="(min-width: 768px) 44vw, 100vw"
                      alt={IMG.studio.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="font-mono mt-3 text-[12px] uppercase tracking-[0.06em]" style={{ color: MUTED }}>
                    {ABOUT.caption}
                  </figcaption>
                </figure>
              </Reveal>
            </div>
          </section>

          {/* ── 7 · umsagnir + heimsókn ──────────────────────────────────────── */}
          <section id="umsagnir" aria-labelledby="umsagnir-h" className="scroll-mt-24">
            <div className={`${WRAP} py-20 md:py-28`}>
              <Reveal>
                <h2 id="umsagnir-h" className="font-grotesk m-0 text-[clamp(2.2rem,5.5vw,3.4rem)]">{REVIEWS.heading}</h2>
                <p className="font-hanken mt-3 max-w-[62ch] text-[13.5px]" style={{ color: MUTED }}>{REVIEWS.disclaimer}</p>
              </Reveal>

              <div className="mt-10 grid gap-10 md:grid-cols-2">
                {REVIEWS.items.map((r, i) => (
                  <Reveal key={r.quote} delay={i * 0.08}>
                    <blockquote className="m-0 pt-6" style={{ borderTop: `1px solid ${HAIR_ACCENT}` }}>
                      <p className="font-grotesk m-0 text-[1.25rem] leading-snug">{r.quote}</p>
                      <footer className="font-mono mt-4 text-[12.5px] uppercase tracking-[0.06em]" style={{ color: ACCENT_TINT }}>
                        {r.name}
                      </footer>
                    </blockquote>
                  </Reveal>
                ))}
              </div>

              <div id="heimsokn" aria-labelledby="heimsokn-h" className="mt-20 scroll-mt-24 md:mt-28">
                <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-14">
                  <Reveal>
                    <h2 id="heimsokn-h" className="font-grotesk m-0 text-[clamp(2.2rem,5.5vw,3.4rem)]">{VISIT.heading}</h2>
                    <h3 className="font-grotesk mt-6 text-[1.4rem]">{VISIT.name}</h3>
                    <p className="font-hanken mt-2 text-[16px]" style={{ color: MUTED }}>{VISIT.address}</p>

                    <dl className="m-0 mt-7 max-w-[26rem]" style={{ borderTop: `1px solid ${HAIR}` }}>
                      <div className="flex items-baseline justify-between gap-6 py-3" style={{ borderBottom: `1px solid ${HAIR}` }}>
                        <dt className="font-hanken text-[14.5px]" style={{ color: MUTED }}>{VISIT.hoursLabel}</dt>
                        <dd className="m-0 font-hanken text-[14.5px] font-semibold" style={{ color: OFFWHITE }}>{VISIT.hoursValue}</dd>
                      </div>
                    </dl>
                    <p className="font-hanken mt-3 max-w-[46ch] text-[14.5px] leading-relaxed" style={{ color: MUTED }}>{VISIT.hoursNote}</p>

                    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
                      <a href={VISIT.mapHref} target="_blank" rel="noreferrer" className="hf-navlink font-hanken text-[14.5px] font-semibold" style={{ color: ACCENT_TINT }}>
                        Sjá á korti
                      </a>
                      <a href={FACEBOOK_HREF} target="_blank" rel="noreferrer" className="hf-navlink font-hanken text-[14.5px] font-semibold" style={{ color: ACCENT_TINT }}>
                        Facebook
                      </a>
                      <a href={VISIT.phoneHref} className="hf-navlink font-hanken text-[14.5px] font-semibold" style={{ color: ACCENT_TINT }}>
                        Sími {VISIT.phoneDisplay}
                      </a>
                      <a href={EMAIL_HREF} className="hf-navlink font-hanken text-[14.5px] font-semibold" style={{ color: ACCENT_TINT }}>
                        {company.ownerEmail}
                      </a>
                    </div>

                    <div className="mt-10 border-t pt-8" style={{ borderColor: HAIR }}>
                      <p className="font-grotesk m-0 max-w-[18ch] text-[1.6rem]">{VISIT.closing.heading}</p>
                      <p className="font-hanken mt-2 max-w-[40ch] text-[15px]" style={{ color: MUTED }}>{VISIT.closing.body}</p>
                      <div className="mt-6">
                        <Cta href={FACEBOOK_HREF} variant="filled" external>Panta tíma</Cta>
                      </div>
                    </div>
                  </Reveal>

                  <Reveal delay={0.1}>
                    <figure className="m-0">
                      <div className="aspect-[4/5] overflow-hidden">
                        <Img src={IMG.fineLine.src} alt={IMG.fineLine.alt} className="h-full w-full object-cover" />
                      </div>
                      <figcaption className="font-mono mt-3 text-[12px] uppercase tracking-[0.06em]" style={{ color: MUTED }}>
                        {VISIT.caption}
                      </figcaption>
                    </figure>
                  </Reveal>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <StickyCta
        label="Ekkert bókunarkerfi — sendu línu"
        button="Facebook"
        href={FACEBOOK_HREF}
        buttonClassName="bg-[#C22A2E] text-[#F1EEE9]"
        barClassName="bg-[#0D0D0F]/90 text-[#F1EEE9] border-t border-white/10"
        watchTarget="#heimsokn"
      />

      <PreviewFooter company={company} />
    </div>
  )
}
