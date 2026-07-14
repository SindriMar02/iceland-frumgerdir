/* ── FÓTÓGRAFÍ · „Framköllun" ─────────────────────────────────────────────
   Concept: a photography shop about photography. Signature mechanic — the
   DEVELOP-REVEAL: every photo mounts/settles the way a print resolves in a
   darkroom tray (high-key, low-contrast, red-shifted + blurred → full
   contrast, sharp, true colour). Pure CSS keyframes/transitions driven by
   mount or IntersectionObserver, never Framer whileInView on anything
   full-bleed — this project has hit that visibility bug repeatedly
   (Kogga, Háafell, Prentverk). A small aperture-iris SVG appears ONCE as a
   section divider — a minor flourish, not a second competing signature.

   Fonts: Clash Display (--font-clash) + Space Mono (--font-mono) + Satoshi
   (--font-satoshi) are already loaded globally via FontShare in index.html
   — no self-loaded <link> needed for this page.

   ── AA CONTRAST MATH (WCAG relative-luminance formula) ──────────────────
   GROUND #141210 → L = 0.0062   PAPER #EFE9DD → L = 0.8186
   ACCENT #B23327 (company.accent) → L = 0.1197
   ACCENT_TEXT #E2574A (lighter ember tint) → L = 0.2349
   MUTED_DARK #B8AFA0 → L = 0.4340   MUTED_PAPER #5C534A → L = 0.0896

   • PAPER text on GROUND bg:      (0.8186+.05)/(0.0062+.05) = 15.46:1  (body text, dark sections)
   • GROUND text on PAPER bg:      same pair, symmetric        = 15.46:1  (body text, cream sections)
   • ACCENT text on GROUND bg:     (0.1197+.05)/(0.0062+.05) =  3.02:1  → fails normal-text AA;
     reserved for LARGE display numerals / UI graphics only (3:1 threshold) on dark ground.
   • ACCENT_TEXT on GROUND bg:     (0.2349+.05)/(0.0062+.05) =  5.07:1  → AA-safe normal text (eyebrows/labels on dark).
   • ACCENT text on PAPER bg:      (0.8186+.05)/(0.1197+.05) =  5.12:1  → AA-safe normal text (eyebrows on cream).
   • PAPER text on ACCENT bg:      (0.8186+.05)/(0.1197+.05) =  5.12:1  → AA-safe (solid CTA button).
   • MUTED_DARK on GROUND bg:      (0.4340+.05)/(0.0062+.05) =  8.61:1  → secondary text, dark sections.
   • MUTED_PAPER on PAPER bg:      (0.8186+.05)/(0.0896+.05) =  6.22:1  → secondary text, cream sections.
   Hero text sits over a bottom-heavy scrim (≥0.82 opacity near the text
   block, see .fk-hero-scrim), so effective local contrast tracks the
   GROUND-pair ratios above, not the raw photo. The header carries its own
   ~0.78-opacity dark backdrop so its PAPER-coloured text stays ~15:1
   regardless of what scrolls behind it.                                    */

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { Img } from '../../components/Img'
import { Reveal } from '../../components/Reveal'
import { StickyCta } from '../../components/StickyCta'
import { COLLECTION, HERO, IMG, JSON_LD, META, NAV, PRODUCTS, STORY, VISIT } from './data'

const company = getPreviewCompany('fotografi')

const GROUND = '#141210' /* darkroom near-black, warm red-black cast */
const PAPER = '#EFE9DD' /* warm cream — contrast section (Vörur) */
const ACCENT = company.accent /* '#B23327' — safelight red, large text/UI/background only on GROUND */
const ACCENT_TEXT = '#E2574A' /* ember tint — AA-safe (5.07:1) for small/normal text on GROUND */
const MUTED_DARK = '#B8AFA0' /* secondary text on GROUND, 8.61:1 */
const MUTED_PAPER = '#5C534A' /* secondary text on PAPER, 6.22:1 */
const HAIR_DARK = 'rgba(239,233,221,0.14)'
const HAIR_PAPER = 'rgba(20,18,16,0.14)'

const DISPLAY = "'Clash Display', system-ui, sans-serif"
const MONO = "'Space Mono', ui-monospace, monospace"
const SANS = "'Satoshi', system-ui, sans-serif"

/* ── shared IntersectionObserver hook — fires once, observes an element
      that is itself never transform-animated (the craft-ledger rule) ── */
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

/* ── SIGNATURE · develop-reveal — a photo resolving out of the developer
      tray. `trigger="mount"` is CSS-keyframe driven and starts the instant
      the element mounts (safe for the hero / any full-bleed background —
      never gated on whileInView). `trigger="inview"` uses the IO hook above
      for smaller in-flow content photos with their own explicit aspect
      ratio. Reduced motion: renders fully developed/sharp immediately.   ── */
function DevelopImg({
  src, srcSet, sizes, alt, trigger, className = '', priority = false,
}: {
  src: string
  srcSet?: string
  sizes?: string
  alt: string
  trigger: 'mount' | 'inview'
  className?: string
  priority?: boolean
}) {
  const reduced = useReducedMotion()
  const { ref, seen } = useSeen<HTMLDivElement>(trigger === 'mount' || !!reduced)
  const developed = !!reduced || seen
  const imgAnim = reduced ? '' : trigger === 'mount' ? 'fk-dev-mount' : `fk-dev-inview ${developed ? 'is-developed' : ''}`
  const glowAnim = trigger === 'mount' ? 'fk-glow-mount' : `fk-glow-inview ${developed ? 'is-developed' : ''}`

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} style={{ background: GROUND }}>
      <Img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : undefined}
        fetchpriority={priority ? 'high' : undefined}
        className={`h-full w-full object-cover ${imgAnim}`}
      />
      {!reduced && <div aria-hidden className={glowAnim} />}
    </div>
  )
}

/* ── minor decorative flourish — a 6-blade aperture iris, used ONCE as a
      section divider. Not a second signature: static shape, Reveal fades
      it in like any other small in-flow element.                        ── */
const APERTURE_BLADES = Array.from({ length: 6 }, (_, i) => {
  const start = ((i * 60 - 90) * Math.PI) / 180
  const end = ((i * 60 + 46 - 90) * Math.PI) / 180
  const r = 30
  const cx = 32
  const cy = 32
  const x0 = cx + r * Math.cos(start)
  const y0 = cy + r * Math.sin(start)
  const x1 = cx + r * Math.cos(end)
  const y1 = cy + r * Math.sin(end)
  return `${cx},${cy} ${x0.toFixed(1)},${y0.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`
})

function Aperture({ hole, size = 56 }: { hole: string; size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      {APERTURE_BLADES.map((pts, i) => (
        <polygon key={i} points={pts} fill={ACCENT} opacity={0.9} />
      ))}
      <circle cx={32} cy={32} r={9} fill={hole} />
    </svg>
  )
}

/* ── buttons ─────────────────────────────────────────────────────────── */
function Cta({ href, children, variant, external, className = '' }: {
  href: string
  children: ReactNode
  variant: 'solid' | 'outlineLight'
  external?: boolean
  className?: string
}) {
  const styles: Record<string, CSSProperties> = {
    solid: { background: ACCENT, color: PAPER },
    outlineLight: { background: 'transparent', color: PAPER, boxShadow: `inset 0 0 0 1.5px ${MUTED_DARK}` },
  }
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className={`fk-cta inline-flex min-h-[48px] items-center justify-center px-7 text-[15px] font-semibold tracking-[0.01em] ${className}`}
      style={{ fontFamily: SANS, ...styles[variant] }}
    >
      {children}
    </a>
  )
}

/* ═══════════════════════════════════════════════════════════════ the page ═ */
export default function FotografiPage() {
  useEffect(() => {
    document.title = META.title
    setThemeColor(ACCENT)
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
    <div lang="is" className="fk-root min-h-[100svh] overflow-x-hidden antialiased" style={{ background: GROUND, color: PAPER, fontFamily: SANS }}>
      <script type="application/ld+json">{JSON.stringify(JSON_LD)}</script>
      <PreviewChrome company={company} />

      <style>{`
        .fk-root{-webkit-font-smoothing:antialiased}
        .fk-display{font-family:${DISPLAY};line-height:1.03;letter-spacing:-0.01em;font-weight:600}
        .fk-mono{font-family:${MONO}}
        .fk-balance{text-wrap:balance}

        @keyframes fkDevelop{
          0%{filter:brightness(2.1) contrast(.32) saturate(.12) sepia(.5) hue-rotate(-20deg) blur(7px);opacity:.2;transform:scale(1.045)}
          55%{filter:brightness(1.35) contrast(.6) saturate(.45) sepia(.28) hue-rotate(-12deg) blur(3px);opacity:.78}
          100%{filter:brightness(1) contrast(1) saturate(1) sepia(0) hue-rotate(0deg) blur(0);opacity:1;transform:scale(1)}
        }
        .fk-dev-mount{animation:fkDevelop 2.4s cubic-bezier(.19,1,.22,1) both}
        .fk-dev-inview{
          filter:brightness(2.1) contrast(.32) saturate(.12) sepia(.5) hue-rotate(-20deg) blur(7px);
          opacity:.2;transform:scale(1.045);
          transition:filter 2s cubic-bezier(.19,1,.22,1),opacity 2s cubic-bezier(.19,1,.22,1),transform 2.2s cubic-bezier(.19,1,.22,1)
        }
        .fk-dev-inview.is-developed{filter:none;opacity:1;transform:scale(1)}

        @keyframes fkGlow{0%{opacity:.85}55%{opacity:.5}100%{opacity:0}}
        .fk-glow-mount,.fk-glow-inview{
          position:absolute;inset:0;pointer-events:none;
          background:radial-gradient(120% 90% at 50% 65%,rgba(178,51,39,0.55) 0%,rgba(178,51,39,0.18) 45%,rgba(20,18,16,0) 75%)
        }
        .fk-glow-mount{animation:fkGlow 2.6s cubic-bezier(.19,1,.22,1) both}
        .fk-glow-inview{opacity:.9;transition:opacity 2.1s cubic-bezier(.19,1,.22,1)}
        .fk-glow-inview.is-developed{opacity:0}

        .fk-cta{transition:transform .16s cubic-bezier(.23,1,.32,1),opacity .16s ease}
        .fk-cta:hover{transform:translateY(-2px)}
        .fk-cta:active{transform:scale(.98)}

        .fk-navlink{position:relative;min-height:44px;display:inline-flex;align-items:center;padding:6px 2px}
        .fk-navlink::after{content:"";position:absolute;left:0;right:100%;bottom:9px;height:1.5px;background:currentColor;transition:right .22s cubic-bezier(.23,1,.32,1)}
        .fk-navlink:hover::after{right:0}

        .fk-root :focus-visible{outline:3px solid ${ACCENT_TEXT};outline-offset:3px}

        @media (prefers-reduced-motion: reduce){
          .fk-root *,.fk-root *::before,.fk-root *::after{transition-duration:.01ms!important;animation-duration:.01ms!important}
          .fk-dev-mount,.fk-dev-inview{animation:none!important;filter:none!important;opacity:1!important;transform:none!important}
          .fk-glow-mount,.fk-glow-inview{display:none!important}
        }
      `}</style>

      {/* ── header — solid-ish dark backdrop independent of scroll position ── */}
      <header className="fixed inset-x-0 top-0 z-40" style={{ background: 'rgba(20,18,16,0.78)', backdropFilter: 'blur(10px)', borderBottom: `1px solid ${HAIR_DARK}` }}>
        <div className="mx-auto flex h-[68px] w-full max-w-[1240px] items-center justify-between gap-4 px-5 md:px-8">
          <a href="#efst" aria-label="Fótógrafí, efst á síðu" className="fk-display flex min-h-[44px] items-center text-[19px]" style={{ color: PAPER }}>
            Fótógrafí
          </a>
          <nav aria-label="Aðalvalmynd" className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="fk-navlink fk-mono text-[13px] tracking-[0.08em]" style={{ color: PAPER }}>
                {n.label}
              </a>
            ))}
          </nav>
          <Cta href={VISIT.mapHref} variant="solid" external>
            {VISIT.mapLabel}
          </Cta>
        </div>
      </header>

      <main id="efst">
        {/* ── 1 · hero — the develop-reveal signature, mount-triggered ─────── */}
        <section aria-label="Fótógrafí — Skólavörðustígur 22" className="relative flex min-h-[100svh] items-end overflow-hidden">
          <DevelopImg
            src={IMG.hero.src}
            srcSet={IMG.hero.srcSet}
            sizes="100vw"
            alt={IMG.hero.alt}
            trigger="mount"
            priority
            className="absolute inset-0 h-full w-full"
          />
          {/* scrim — bottom ≥0.82 opacity near the text block keeps effective
              contrast at the GROUND-pair ratios computed above */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(20,18,16,0.12) 0%, rgba(20,18,16,0.5) 52%, rgba(20,18,16,0.92) 100%)' }}
          />
          {/* film-edge print — a small authentic photography detail, desktop only */}
          <div
            aria-hidden
            className="fk-mono absolute left-4 top-1/2 z-10 hidden text-[10.5px] tracking-[0.32em] md:block"
            style={{ color: 'rgba(239,233,221,0.55)', writingMode: 'vertical-rl', transform: 'translateY(-50%) rotate(180deg)' }}
          >
            {HERO.filmEdge}
          </div>

          <div className="relative z-10 mx-auto w-full max-w-[1240px] px-5 pb-14 pt-32 md:px-8 md:pb-20">
            <p className="fk-mono text-[13px] tracking-[0.12em]" style={{ color: MUTED_DARK }}>{HERO.eyebrow}</p>
            <h1 className="fk-display fk-balance mt-4 max-w-[18ch] text-[clamp(2.6rem,8.5vw,5.6rem)]" style={{ color: PAPER }}>
              {HERO.heading}
            </h1>
            <p className="mt-6 max-w-[50ch] text-[17px] leading-relaxed" style={{ color: PAPER }}>{HERO.sub}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Cta href={VISIT.mapHref} variant="solid" external>{HERO.ctaPrimary}</Cta>
              <Cta href="#safnid" variant="outlineLight">{HERO.ctaSecondary}</Cta>
            </div>
          </div>
        </section>

        {/* ── 2 · Söfnunin — 300 cameras + vinyl ──────────────────────────── */}
        <section id="safnid" aria-labelledby="safnid-h" className="scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-[1240px]">
            <Reveal>
              <p className="fk-mono text-[13px] tracking-[0.12em]" style={{ color: ACCENT_TEXT }}>{COLLECTION.eyebrow}</p>
              <h2 id="safnid-h" className="fk-display fk-balance mt-3 max-w-[20ch] text-[clamp(2.1rem,5.2vw,3.8rem)]" style={{ color: PAPER }}>
                {COLLECTION.heading}
              </h2>
              <p className="mt-5 max-w-[60ch] text-[16.5px] leading-relaxed" style={{ color: MUTED_DARK }}>{COLLECTION.body}</p>
            </Reveal>

            <div className="mt-12 grid gap-6 md:grid-cols-[1.4fr_1fr] md:gap-8">
              <figure className="m-0">
                <DevelopImg
                  src={IMG.cameraWall.src}
                  srcSet={IMG.cameraWall.srcSet}
                  sizes="(min-width: 768px) 58vw, 100vw"
                  alt={IMG.cameraWall.alt}
                  trigger="inview"
                  className="aspect-[4/3] md:aspect-[16/10]"
                />
                <figcaption className="mt-3 text-[13.5px]" style={{ color: MUTED_DARK }}>{COLLECTION.captionWall}</figcaption>
              </figure>

              <div className="flex flex-col gap-6">
                <figure className="m-0">
                  <DevelopImg
                    src={IMG.vinyl.src}
                    srcSet={IMG.vinyl.srcSet}
                    sizes="(min-width: 768px) 32vw, 100vw"
                    alt={IMG.vinyl.alt}
                    trigger="inview"
                    className="aspect-[4/3]"
                  />
                  <figcaption className="mt-3 text-[13.5px]" style={{ color: MUTED_DARK }}>{COLLECTION.captionVinyl}</figcaption>
                </figure>

                <div className="grid grid-cols-2 gap-6 border-t pt-6" style={{ borderColor: HAIR_DARK }}>
                  <div>
                    <p className="fk-display text-[clamp(1.7rem,3.2vw,2.4rem)]" style={{ color: ACCENT_TEXT }}>{COLLECTION.statCameras}</p>
                    <p className="mt-1 text-[13px] leading-snug" style={{ color: MUTED_DARK }}>{COLLECTION.statCamerasLabel}</p>
                  </div>
                  <div>
                    <p className="fk-display text-[clamp(1.2rem,2.4vw,1.7rem)]" style={{ color: ACCENT_TEXT }}>{COLLECTION.statVinyl}</p>
                    <p className="mt-1 text-[13px] leading-snug" style={{ color: MUTED_DARK }}>{COLLECTION.statVinylLabel}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3 · Sagan — Ari's story ──────────────────────────────────────── */}
        <section id="sagan" aria-labelledby="sagan-h" className="scroll-mt-24 px-5 py-20 md:px-8 md:py-28" style={{ borderTop: `1px solid ${HAIR_DARK}` }}>
          <div className="mx-auto grid max-w-[1240px] items-center gap-12 md:grid-cols-[1fr_1.05fr] md:gap-16">
            <Reveal>
              <p className="fk-mono text-[13px] tracking-[0.12em]" style={{ color: ACCENT_TEXT }}>{STORY.eyebrow}</p>
              <p className="fk-display mt-4 text-[clamp(3.2rem,8vw,5.4rem)] leading-none" style={{ color: ACCENT_TEXT }}>{STORY.year}</p>
              <h2 id="sagan-h" className="fk-display fk-balance mt-4 max-w-[16ch] text-[clamp(1.9rem,4.6vw,3.1rem)]" style={{ color: PAPER }}>
                {STORY.heading}
              </h2>
              <p className="mt-5 max-w-[54ch] text-[16.5px] leading-relaxed" style={{ color: MUTED_DARK }}>{STORY.body1}</p>
              <p className="mt-4 max-w-[54ch] text-[16.5px] leading-relaxed" style={{ color: MUTED_DARK }}>{STORY.body2}</p>
            </Reveal>

            <figure className="m-0">
              <DevelopImg
                src={IMG.camera.src}
                srcSet={IMG.camera.srcSet}
                sizes="(min-width: 768px) 44vw, 100vw"
                alt={IMG.camera.alt}
                trigger="inview"
                className="aspect-[4/5] md:aspect-[3/4]"
              />
              <figcaption className="mt-3 text-[13.5px]" style={{ color: MUTED_DARK }}>{STORY.imgCaption}</figcaption>
            </figure>
          </div>
        </section>

        {/* ── divider — the one decorative aperture flourish ──────────────── */}
        <div aria-hidden className="flex justify-center pt-4 pb-2" style={{ background: PAPER }}>
          <Reveal y={12}>
            <Aperture hole={PAPER} />
          </Reveal>
        </div>

        {/* ── 4 · Vörur — cream contrast section ──────────────────────────── */}
        <section id="vorur" aria-labelledby="vorur-h" className="scroll-mt-24 px-5 pb-20 md:px-8 md:pb-28" style={{ background: PAPER }}>
          <div className="mx-auto max-w-[1240px]">
            <Reveal>
              <p className="fk-mono text-[13px] tracking-[0.12em]" style={{ color: ACCENT }}>{PRODUCTS.eyebrow}</p>
              <h2 id="vorur-h" className="fk-display fk-balance mt-3 max-w-[18ch] text-[clamp(2.1rem,5.2vw,3.8rem)]" style={{ color: GROUND }}>
                {PRODUCTS.heading}
              </h2>
              <p className="mt-5 max-w-[60ch] text-[16.5px] leading-relaxed" style={{ color: MUTED_PAPER }}>{PRODUCTS.intro}</p>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {PRODUCTS.items.map((p) => (
                <Reveal key={p.frame}>
                  <div className="h-full border p-6" style={{ borderColor: HAIR_PAPER }}>
                    <p className="fk-mono text-[12px] tracking-[0.1em]" style={{ color: ACCENT }}>NR. {p.frame}</p>
                    <h3 className="fk-display mt-3 text-[1.2rem]" style={{ color: GROUND }}>{p.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed" style={{ color: MUTED_PAPER }}>{p.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <p className="mt-10 max-w-[68ch] pl-4 text-[13.5px] leading-relaxed" style={{ color: MUTED_PAPER, borderLeft: `2px solid ${ACCENT}` }}>
              {PRODUCTS.note}
            </p>
          </div>
        </section>

        {/* ── 5 · Heimsókn — back to darkroom mood ─────────────────────────── */}
        <section id="heimsokn" aria-labelledby="heimsokn-h" className="scroll-mt-24 px-5 py-20 md:px-8 md:py-28" style={{ background: GROUND, borderTop: `1px solid ${HAIR_DARK}` }}>
          <div className="mx-auto max-w-[1240px]">
            <Reveal>
              <p className="fk-mono text-[13px] tracking-[0.12em]" style={{ color: ACCENT_TEXT }}>{VISIT.eyebrow}</p>
              <h2 id="heimsokn-h" className="fk-display fk-balance mt-3 max-w-[16ch] text-[clamp(2.1rem,5.2vw,3.8rem)]" style={{ color: PAPER }}>
                {VISIT.heading}
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-12 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-7">
                <p className="text-[18px] font-semibold" style={{ color: PAPER }}>{VISIT.address}</p>
                <p className="mt-1 text-[15px]" style={{ color: MUTED_DARK }}>{VISIT.addressNote}</p>

                <dl className="m-0 mt-8 max-w-[30rem]" style={{ borderTop: `1px solid ${HAIR_DARK}` }}>
                  <div className="flex items-baseline justify-between gap-6 py-3" style={{ borderBottom: `1px solid ${HAIR_DARK}` }}>
                    <dt className="text-[14.5px]" style={{ color: MUTED_DARK }}>{VISIT.hoursLabel}</dt>
                    <dd className="m-0 text-[14.5px] font-semibold" style={{ color: PAPER }}>{VISIT.hoursValue}</dd>
                  </div>
                </dl>
                <p className="mt-3 max-w-[46ch] text-[14.5px] leading-relaxed" style={{ color: MUTED_DARK }}>{VISIT.hoursNote}</p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Cta href={VISIT.mapHref} variant="solid" external>{VISIT.mapLabel}</Cta>
                  <Cta href={`mailto:${VISIT.email}`} variant="outlineLight">{VISIT.email}</Cta>
                </div>

                <blockquote className="m-0 mt-14 max-w-[46ch] pl-5" style={{ borderLeft: `2px solid ${ACCENT}` }}>
                  <p className="fk-display text-[1.2rem] leading-snug" style={{ color: PAPER }}>{VISIT.review.quote}</p>
                  <footer className="mt-3 text-[13.5px]" style={{ color: MUTED_DARK }}>{VISIT.review.name}</footer>
                </blockquote>
                <p className="mt-2 max-w-[60ch] text-[12px] leading-relaxed" style={{ color: MUTED_DARK }}>{VISIT.reviewDisclaimer}</p>
              </div>

              <figure className="m-0 md:col-span-5">
                <DevelopImg
                  src={IMG.reykjavik.src}
                  srcSet={IMG.reykjavik.srcSet}
                  sizes="(min-width: 768px) 40vw, 100vw"
                  alt={IMG.reykjavik.alt}
                  trigger="inview"
                  className="aspect-[4/5]"
                />
                <figcaption className="mt-3 text-[13.5px]" style={{ color: MUTED_DARK }}>{VISIT.imgCaption}</figcaption>
              </figure>
            </div>
          </div>
        </section>
      </main>

      {/* ── mobile sticky CTA ────────────────────────────────────────────── */}
      <StickyCta
        label={`${VISIT.address} · ${VISIT.hoursValue}`}
        button={VISIT.mapLabel}
        href={VISIT.mapHref}
        buttonClassName="bg-[#B23327] text-[#EFE9DD]"
        barClassName="bg-[#141210]/95 text-[#EFE9DD] border-t border-white/10"
        watchTarget="#heimsokn"
      />
      <div aria-hidden className="h-20 md:hidden" />

      <PreviewFooter company={company} />
    </div>
  )
}
