/**
 * B&S Restaurant, Blönduós — 1:1 transplant of studenterkilden.dk's design
 * system (see /Users/sindri/Documents/Website redesign mockups/_docs/studenterkilden-teardown.md),
 * re-aimed at B&S's real published content (teardown section 9).
 *
 * SCAFFOLD ONLY: sections are inserted one at a time at the marker below by
 * later build steps, in the exact order of the work-list this scaffold step
 * returned (teardown 4.1 through 4.8, home page only). Do not add sections
 * here directly — extend the marker.
 *
 * Fonts: the reference loads one family, "Gt Ultra Median" (Grilli Type,
 * commercial, licence terms not in the harvested bundle — teardown 2.1/10.3).
 * Per the brief's substitution route, this build self-hosts Gambetta
 * (calm transitional serif, low stroke contrast, generous x-height, full
 * Icelandic glyph coverage, from the local font library at
 * ~/Design fonts/Gambetta) at a single 400 weight, no bold, matching the
 * reference's "one family, one weight" rule (teardown 2.1, 10.3). Body/UI
 * text also uses Gambetta at 400 since the reference uses one family for
 * everything (teardown 2.1: "One family, one weight, one style, loaded on
 * every page").
 */

import { useEffect, useRef, useState } from 'react'
import type { MutableRefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import Lenis from 'lenis'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { Img } from '../../components/Img'
import { companyEntry } from './company'
import { CONTACT, HOURS_LINE, SITEMAP, TRIPADVISOR_LINK, HERO, IMAGES, OFFER_CARDS, MENU, ABOUT_TEASER, HOUSE_FACTS, FAQ } from './data'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)

/* D2 Osmo curve (teardown 10.2 mandatory device 2, verbatim): the reference's
   one custom ease, cubic-bezier(0.625, 0.05, 0, 1) — the same curve already
   driving every CSS transition in this file (buttons 0.525s, accordion and
   card copy 0.6s, underline 0.735s, card image 0.8s). Registering it as a
   named GSAP ease and setting it as the sitewide default (0.8s) mirrors the
   reference's own `gsap.defaults({ ease: 'osmo', duration: 0.8 })` call
   (teardown 10.2 item 2) so every reveal-group tween that does not name its
   own ease/duration lands on the house curve instead of GSAP's stock
   power1.out. Every section below that previously hardcoded
   `ease: 'power3.out'` on a non-split D4 reveal-group child (eyebrow, CTA,
   card/item groups) now names `ease: 'osmo'` explicitly; the D3 masked
   SplitText rises keep `power3.out` on purpose (teardown 10.2 item 3: D3 is
   specified with power3.out, not osmo). */
CustomEase.create('osmo', '0.625, 0.05, 0, 1')
gsap.defaults({ ease: 'osmo', duration: 0.8 })

const company = companyEntry

/**
 * NOT YET IMPORTED HERE (nothing in this scaffold uses them yet, and
 * `noUnusedLocals` in tsconfig.app.json fails `tsc -b` on an unused import —
 * see [[tsc-b-is-the-real-gate]]). `Img`, `HERO`/`IMAGES` (4.1), `OFFER_CARDS`
 * (4.2), `ABOUT_TEASER` (4.3), `HOUSE_FACTS` (4.5) and `FAQ` (4.7) are now
 * imported above. Nothing remains to import for the home-page work-list.
 */

/* ── Fonts: self-hosted Gambetta, one weight (400), matching the reference's
   single-family/single-weight rule. Files live in the repo's shared
   public/fonts/ convention (see sjavarborg/Page.tsx for the same pattern). */
const FONTS = `${import.meta.env.BASE_URL}fonts/gambetta/`
const FONT_FAMILY = "'Gambetta', Georgia, serif"

/* ── 0.1 The resolution and sizing law, verbatim from the teardown ────────
   Fixed 16px root; every role is its own clamp tuned to the reference's
   375px-to-2560px window. Copied from teardown section 0.1 / 2.2. */
export const CLAMP = {
  h1: 'clamp(2.5rem, calc(1.8564rem + 2.746vw), 6.25rem)',
  h2: 'clamp(2rem, calc(1.4851rem + 2.1968vw), 5rem)',
  h3: 'clamp(1.75rem, calc(1.3209rem + 1.8307vw), 4.25rem)',
  h4: 'clamp(1.375rem, calc(1.0747rem + 1.2815vw), 3.125rem)',
  h5: 'clamp(1.125rem, calc(.9105rem + .9153vw), 2.375rem)',
  h6: 'clamp(.75rem, calc(.6642rem + .3661vw), 1.25rem)',
  bodyLarge: 'clamp(1.25rem, calc(.9926rem + 1.0984vw), 2.75rem)',
  bodyMedium: 'clamp(1rem, calc(.8284rem + .7323vw), 2rem)',
  bodySmall: 'clamp(.75rem, calc(.6642rem + .3661vw), 1.25rem)',
  gutter: 'clamp(.75rem, calc(.6263rem + .5277vw), 1.4804rem)',
  gap1: 'clamp(.25rem, calc(.1642rem + .3661vw), .75rem)',
  gap2: 'clamp(.75rem, calc(.6263rem + .5277vw), 1.4804rem)', // = gutter
  gap3: 'clamp(1.5rem, calc(.9851rem + 2.1968vw), 4.5rem)',
  gap4: 'clamp(2rem, calc(1.3135rem + 2.9291vw), 6rem)',
  gap5: 'clamp(2.75rem, calc(1.849rem + 3.8444vw), 8rem)',
  gap6: 'clamp(3.5rem, calc(2.1699rem + 5.6751vw), 11.25rem)',
  gap7: 'clamp(6rem, calc(3.1682rem + 12.0824vw), 22.5rem)',
} as const

const LINE_HEIGHT = {
  heading: 0.9,
  paragraph: 1.2,
  small: 1.5,
} as const

const LETTER_SPACING = {
  heading: '-0.05em', // h1 to h3
  smallHeading: '-0.025em', // h4 to h6
} as const

/* ── 1.1 Tokens, verbatim from the teardown (Studenterkilden's own measured
   values — not gamlafjosid's, not invented for B&S; the brand colours B&S
   would actually want are UNKNOWN per teardown section 9). ── */
const C = {
  paper: '#fdfdfd', // --brand--main-white / --semantic--background
  ink: '#161513', // --brand--black / --semantic--text-primary
  darkGrey: '#39393b', // --brand--dark-grey, the one dark band
  grey: '#cfcfcf', // hairlines
  eggwhite: '#f2e9cf', // ink-on-dark, callout panel fill
  accent: '#ebbf7d', // --brand--orange, CTA pill fill only
  footerScrim: '#201d1d',
  navOverlay: '#13131366',
  divider: '#16151333',
} as const

/* ── 3.1 Container and gutter: no max-width, 12/10/5 column grid ─────────── */
const GRID_STYLE = {
  display: 'grid',
  gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
  columnGap: CLAMP.gutter,
  rowGap: CLAMP.gutter,
  paddingLeft: CLAMP.gutter,
  paddingRight: CLAMP.gutter,
} as const

function PageFonts() {
  return (
    <style>{`
      @font-face {
        font-family: 'Gambetta';
        src: url('${FONTS}Gambetta-Regular.woff2') format('woff2'),
             url('${FONTS}Gambetta-Regular.woff') format('woff');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }
      * { -webkit-font-smoothing: antialiased; }
      .bs-h1 { font-family: ${FONT_FAMILY}; color: ${C.ink}; font-size: ${CLAMP.h1}; line-height: ${LINE_HEIGHT.heading}; font-weight: 400; letter-spacing: ${LETTER_SPACING.heading}; }
      /* .bs-h2 was never defined and CLAMP.h2 was dead code, so the
         offering h2 borrowed .bs-h1 and shouted at the same 69px as the
         page title (audit 2026-09-02). */
      .bs-h2 { font-family: ${FONT_FAMILY}; color: ${C.ink}; font-size: ${CLAMP.h2}; line-height: ${LINE_HEIGHT.heading}; font-weight: 400; letter-spacing: ${LETTER_SPACING.heading}; }
      .bs-h3 { font-family: ${FONT_FAMILY}; font-size: ${CLAMP.h3}; line-height: ${LINE_HEIGHT.paragraph}; font-weight: 400; letter-spacing: ${LETTER_SPACING.heading}; }
      .bs-h4 { font-family: ${FONT_FAMILY}; font-size: ${CLAMP.h4}; line-height: ${LINE_HEIGHT.heading}; font-weight: 400; letter-spacing: ${LETTER_SPACING.smallHeading}; }
      .bs-h6 { font-family: ${FONT_FAMILY}; color: ${C.ink}; font-size: ${CLAMP.h6}; line-height: ${LINE_HEIGHT.heading}; font-weight: 400; letter-spacing: ${LETTER_SPACING.smallHeading}; }
      .bs-p-large { font-family: ${FONT_FAMILY}; color: ${C.ink}; font-size: ${CLAMP.bodyLarge}; line-height: ${LINE_HEIGHT.paragraph}; }
      .bs-p-medium { font-family: ${FONT_FAMILY}; font-size: ${CLAMP.bodyMedium}; line-height: ${LINE_HEIGHT.paragraph}; }
      .bs-p-small { font-family: ${FONT_FAMILY}; font-size: ${CLAMP.bodySmall}; line-height: ${LINE_HEIGHT.small}; font-weight: 400; }

      /* SplitText mask wrappers clip descenders.
         A masked split wraps every line or word in a div with overflow:clip
         whose height is the LINE BOX. Headings here run at line-height 0.9
         (LINE_HEIGHT.heading, the reference's own value), which is shorter
         than the font's ink, so the clip box cut the tail off every
         descender: measured 11px of overflow on the 69.24px h1 and 8px on
         the 55.40px h2 at 1440, 6-7px and 5px at 390. In Icelandic that is
         constant, since th, j, g and eth all descend, and "thjodveg eitt i
         Blonduosi" was visibly sheared along its whole baseline.
         The wrappers carry no class of their own (GSAP inline-styles them),
         so they are addressed as the direct div children of each split host.
         Padding grows the clip box downward; the matching negative margin
         gives the space back, so no layout shifts. Masking still works: the
         tween starts the text at yPercent 150, far below this. */
      .bs-hero-h1 > div, .bs-hero-p > div, .bs-offer-h2 > div,
      .bs-menu-h2 > div, .bs-about-p > div, .bs-facts-p > div,
      .bs-faq-h2 > div {
        padding-bottom: 0.22em;
        margin-bottom: -0.22em;
      }
      .bs-btn { position: relative; isolation: isolate; display: inline-flex; align-items: center; gap: 0.5em; overflow: hidden; font-family: ${FONT_FAMILY}; font-size: ${CLAMP.bodySmall}; line-height: 1.2; color: ${C.ink}; text-decoration: none; padding: 1.25rem 1.5rem; border-radius: 0.25em; }
      /* body-small is pinned to a fixed .9rem below the reference's own 479px
         breakpoint (teardown section 0: "body-small is pinned to a fixed .9rem
         (14.4px) at max-width:479px"), which is what makes the reference's
         button label measure 14.40px at 390 rather than the clamp's 12.06px. */
      @media (max-width: 479px) { .bs-p-small, .bs-btn { font-size: .9rem; } }
      .bs-btn-primary { background: ${C.accent}; }
      .bs-btn-outline { border: 1px solid ${C.ink}; }
      /* D10 icon button (teardown 10.2 mandatory device 6 / section "D10.
         Icon button hover", verbatim): the tilted fill sweep
         (.btn-icon-content__bg), the label text-shadow slide
         (.btn-icon-content__text) and the icon chip (.btn-icon-icon__bg +
         .btn-icon-icon__arrow) all live under .bs-btn and only animate
         under (hover:hover) and (pointer:fine), same as the reference. */
      .bs-btn-fill { position: absolute; left: -10%; bottom: 0; width: 120%; height: 100%; z-index: 0; background: ${C.eggwhite}; transform: translateY(175%) rotate(15deg); pointer-events: none; }
      .bs-btn-label-wrap { position: relative; z-index: 1; display: inline-block; height: 1.2em; overflow: hidden; }
      .bs-btn-label { display: inline-block; text-shadow: 0 1.5em currentColor; }
      .bs-btn-icon-chip { position: relative; z-index: 1; flex: none; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; width: 1.5em; height: 1.5em; border-radius: 0.125em; border: 1px solid currentColor; }
      .bs-btn-icon-arrow, .bs-btn-icon-arrow-dup { position: absolute; inset: 0; margin: auto; width: 0.625em; height: 0.5em; }
      .bs-btn-icon-arrow-dup { transform: translate(-200%, 0); }
      @media (hover: hover) and (pointer: fine) {
        .bs-btn-fill, .bs-btn-label, .bs-btn-icon-chip, .bs-btn-icon-arrow, .bs-btn-icon-arrow-dup { transition: transform 0.525s cubic-bezier(0.625,0.05,0,1); }
        .bs-btn:hover .bs-btn-fill, .bs-btn:focus-visible .bs-btn-fill { transform: translate(0, 0) rotate(0deg); }
        .bs-btn:hover .bs-btn-label, .bs-btn:focus-visible .bs-btn-label { transform: translateY(-1.5em); }
        .bs-btn:hover .bs-btn-icon-chip, .bs-btn:focus-visible .bs-btn-icon-chip { transform: rotate(90deg); }
        .bs-btn:hover .bs-btn-icon-arrow, .bs-btn:focus-visible .bs-btn-icon-arrow { transform: translate(200%, 0); }
        .bs-btn:hover .bs-btn-icon-arrow-dup, .bs-btn:focus-visible .bs-btn-icon-arrow-dup { transform: translate(0, 0); }
      }
      [data-underline-link] { position: relative; text-decoration: none; }
      [data-underline-link]::before { content: ''; position: absolute; left: 0; right: 0; bottom: -0.0625em; height: 0.0625em; background: currentColor; transform: scaleX(0); transform-origin: right; transition: transform 0.735s cubic-bezier(0.625,0.05,0,1); }
      [data-underline-link]:hover::before { transform: scaleX(1); transform-origin: left; }
    `}</style>
  )
}

/* D10 icon button markup (teardown 10.2 mandatory device 6): every `.bs-btn`
   on the page shares this structure — a tilted fill layer, a clipped label
   with its text-shadow duplicate, and an icon chip holding two copies of the
   arrow glyph (base at rest, a duplicate parked at -200% so the hover swap
   reveals an incoming arrow instead of an empty chip). All four layers
   animate together per the CSS above. */
function BtnIcon({
  href,
  label,
  variant,
  className = '',
  onClick,
}: {
  href: string
  label: string
  variant: 'primary' | 'outline' | 'invert'
  className?: string
  onClick?: () => void
}) {
  return (
    <a href={href} onClick={onClick} className={`bs-btn bs-btn-${variant} ${className}`.trim()}>
      <span className="bs-btn-fill" aria-hidden="true" />
      <span className="bs-btn-label-wrap">
        <span className="bs-btn-label">{label}</span>
      </span>
      <span className="bs-btn-icon-chip" aria-hidden="true">
        <svg className="bs-btn-icon-arrow" viewBox="0 0 10 8" fill="none">
          <path d="M0 4H9M9 4L6 1M9 4L6 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg className="bs-btn-icon-arrow-dup" viewBox="0 0 10 8" fill="none">
          <path d="M0 4H9M9 4L6 1M9 4L6 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  )
}

/* ── Global chrome, per teardown section 4 header / global-chrome note:
   Menu / crest / is-en / persistent call-or-book action, plus the full D6
   side-nav wipe (teardown 10.2 mandatory device 8, section "D6. Side nav
   wipe", verbatim): open = lenis.stop(), stacked "Matseðill"/"Loka" labels
   yPercent 0 -> -100 stagger 0.2, icon rotate 0 -> 45 (0.25s power2.out),
   button colour -> eggwhite, overlay #13131366 autoAlpha 0 -> 1 (0.8s osmo,
   the D2 default), panel xPercent -101 -> 0 (0.575s, explicit per the
   teardown), sitemap links yPercent 140 + rotate 10 -> 0 stagger 0.05
   starting 0.35s in, a secondary contact block autoAlpha 0 + yPercent 50 ->
   1 + 0 stagger 0.04 starting 0.55s in (0.35 + 0.2, "<+=0.2" on the
   reference's own timeline). Close reverses (panel to xPercent -120, labels
   and icon back to rest) and both Escape and an overlay click trigger it;
   lenis.start() fires on close. Panel `max-width: 30em`, full width at the
   reference's 767px breakpoint (teardown: "max-width: 30em, full width at
   767"). `lenisRef` is the single page-level Lenis instance from Page()
   below — Lenis is skipped entirely on touch (memory: lenis-mobile-damage),
   so `lenisRef.current` is null there and stop()/start() are no-ops; the
   body-scroll lock below covers touch devices instead. */
function TopNav({ lenisRef }: { lenisRef: MutableRefObject<Lenis | null> }) {
  const [open, setOpen] = useState(false)
  const navWrapRef = useRef<HTMLDivElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const iconRef = useRef<SVGSVGElement | null>(null)
  const labelsRef = useRef<(HTMLSpanElement | null)[]>([])
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([])
  const fadeRef = useRef<HTMLDivElement | null>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const openNav = () => {
    const navWrap = navWrapRef.current
    const overlay = overlayRef.current
    const panel = panelRef.current
    if (!navWrap || !overlay || !panel) return

    setOpen(true)
    lenisRef.current?.stop()
    document.body.style.overflow = 'hidden'

    tlRef.current?.kill()
    const tl = gsap.timeline()
    tlRef.current = tl
    tl.set(navWrap, { display: 'flex' })
      .fromTo(labelsRef.current, { yPercent: 0 }, { yPercent: -100, stagger: 0.2 }, 0)
      .fromTo(iconRef.current, { rotate: 0 }, { rotate: 45, duration: 0.25, ease: 'power2.out' }, 0)
      .to(buttonRef.current, { color: C.eggwhite, duration: 0.25 }, 0)
      .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, 0)
      .fromTo(panel, { xPercent: -101 }, { xPercent: 0, duration: 0.575 }, 0)
      .fromTo(linksRef.current, { yPercent: 140, rotate: 10 }, { yPercent: 0, rotate: 0, stagger: 0.05 }, 0.35)
      .fromTo(fadeRef.current, { autoAlpha: 0, yPercent: 50 }, { autoAlpha: 1, yPercent: 0, stagger: 0.04 }, 0.55)
  }

  const closeNav = () => {
    const navWrap = navWrapRef.current
    const overlay = overlayRef.current
    const panel = panelRef.current
    if (!navWrap || !overlay || !panel) return

    setOpen(false)
    lenisRef.current?.start()
    document.body.style.overflow = ''

    tlRef.current?.kill()
    const tl = gsap.timeline({ onComplete: () => gsap.set(navWrap, { display: 'none' }) })
    tlRef.current = tl
    tl.to(overlay, { autoAlpha: 0 }, 0)
      .to(panel, { xPercent: -120 }, 0)
      .to(buttonRef.current, { color: '', duration: 0.3 }, 0)
      .to(labelsRef.current, { yPercent: 0 }, 0)
      .to(iconRef.current, { rotate: 0, duration: 0.25, ease: 'power2.out' }, 0)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeNav()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    return () => {
      tlRef.current?.kill()
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <>
      <div
        className="relative z-10 flex items-center justify-between"
        style={{ padding: `${CLAMP.gap2} ${CLAMP.gutter}` }}
      >
        <button
          ref={buttonRef}
          type="button"
          aria-label={open ? 'Loka valmynd' : 'Opna valmynd'}
          aria-expanded={open}
          onClick={() => (open ? closeNav() : openNav())}
          className="bs-p-medium"
          style={{
            background: 'none', border: 'none', cursor: 'pointer', color: C.ink,
            display: 'inline-flex', alignItems: 'center', gap: '0.6em', padding: 0,
          }}
        >
          <span style={{ position: 'relative', display: 'inline-block', height: '1.2em', overflow: 'hidden' }}>
            <span
              ref={(el) => { labelsRef.current[0] = el }}
              style={{ display: 'block' }}
            >
              Valmynd
            </span>
            <span
              ref={(el) => { labelsRef.current[1] = el }}
              style={{ display: 'block', position: 'absolute', top: '100%', left: 0 }}
            >
              Loka
            </span>
          </span>
          <svg ref={iconRef} width="16" height="16" viewBox="0 0 16 16" style={{ transformOrigin: 'center', flex: 'none' }}>
            <line x1="1" y1="4" x2="15" y2="4" stroke="currentColor" strokeWidth="1.5" />
            <line x1="1" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
        {/* B&S mark: UNKNOWN, no logo file published (brief VERIFIED CLIENT
            FACTS), so this is a typographic lockup, not a supplied logo. It
            occupies the reference's crest slot at roughly its footprint
            (crest 161x63 at max-width 5em). */}
        <a
          href="/preview/bogs"
          aria-label="B&S Restaurant, heim"
          style={{ textDecoration: 'none', color: C.ink, textAlign: 'center', lineHeight: 1 }}
        >
          <span style={{ display: 'block', fontFamily: FONT_FAMILY, fontSize: 'clamp(1.25rem, 1.6vw, 1.75rem)', letterSpacing: '-0.02em' }}>
            B&amp;S
          </span>
          <span style={{ display: 'block', fontFamily: FONT_FAMILY, fontSize: 'clamp(.5rem, .62vw, .7rem)', letterSpacing: '.34em', textTransform: 'uppercase', marginTop: '.35em', marginRight: '-.34em' }}>
            Restaurant
          </span>
        </a>
        <div className="flex items-center" style={{ gap: CLAMP.gap2 }}>
          {/* The is/en pair that sat here was REMOVED 2026-09-02. It was two
              plain spans: unfocusable, inoperable, and pointing at an English
              page that does not exist, while the faded "en" also failed
              contrast at 3.43:1. A control that cannot be used is worse than
              no control. Restore it as real links the day an /en route ships. */}
          <BtnIcon href={CONTACT.phoneHref} label="Hringja 453 5060" variant="primary" />
        </div>
      </div>

      <div ref={navWrapRef} style={{ display: 'none', position: 'fixed', inset: 0, zIndex: 60 }}>
        <style>{`
          .bs-sidenav-panel { max-width: 30em; }
          @media (max-width: 767px) {
            .bs-sidenav-panel { max-width: 100%; }
          }
        `}</style>
        <div
          ref={overlayRef}
          onClick={closeNav}
          style={{ position: 'absolute', inset: 0, background: C.navOverlay, opacity: 0 }}
        />
        <div
          ref={panelRef}
          className="bs-sidenav-panel"
          style={{
            // No inline `transform` here on purpose: navWrap starts
            // `display:none` (below) so the panel is invisible regardless,
            // and GSAP's own fromTo({xPercent:-101},...) sets the resting
            // off-screen position the instant openNav() runs. A static JSX
            // transform here would re-apply on every re-render (setOpen
            // triggers one) and stack with GSAP's writes instead of being
            // replaced by them, permanently doubling the offset.
            position: 'absolute', top: 0, left: 0, height: '100%', width: '100%',
            background: C.darkGrey, color: C.eggwhite, display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between', padding: CLAMP.gap4,
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: CLAMP.gap2 }}>
            {SITEMAP.map((item, i) => (
              <a
                key={item.href}
                ref={(el) => { linksRef.current[i] = el }}
                href={item.href}
                onClick={closeNav}
                className="bs-h4"
                style={{ color: C.eggwhite, textDecoration: 'none' }}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div ref={fadeRef} style={{ display: 'flex', flexDirection: 'column', gap: CLAMP.gap1 }}>
            <a href={CONTACT.phoneHref} className="bs-p-medium" style={{ color: C.eggwhite, textDecoration: 'none' }}>
              {CONTACT.phoneDisplay}
            </a>
            <span className="bs-p-small">{CONTACT.addressLine1}, {CONTACT.addressLine2}</span>
          </div>
        </div>
      </div>
    </>
  )
}

/* D13 Footer parallax (teardown 10.2 item 7, verbatim): the inner content
   rises from yPercent -25 to 0 and a scrim fades from opacity 0.5 to 0, both
   linear-eased and scrubbed against `clamp(top bottom)` -> `clamp(top 30%)`
   so the reveal is clamped to that scroll band instead of drifting past it
   on a fast scroll. Scrim colour is C.footerScrim (teardown's own token,
   otherwise unused in this file). */
function SiteFooter() {
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root)
      const inner = q('.bs-footer-inner')[0] as HTMLElement | undefined
      const scrim = q('.bs-footer-scrim')[0] as HTMLElement | undefined
      const tweens: gsap.core.Tween[] = []

      if (inner) {
        tweens.push(
          gsap.fromTo(
            inner,
            { yPercent: -25 },
            {
              yPercent: 0,
              ease: 'linear',
              scrollTrigger: { trigger: root, start: 'clamp(top bottom)', end: 'clamp(top 30%)', scrub: true },
            },
          ),
        )
      }
      if (scrim) {
        tweens.push(
          gsap.fromTo(
            scrim,
            { opacity: 0.5 },
            {
              opacity: 0,
              ease: 'linear',
              scrollTrigger: { trigger: root, start: 'clamp(top bottom)', end: 'clamp(top 30%)', scrub: true },
            },
          ),
        )
      }

      return () => {
        tweens.forEach((t) => {
          t.scrollTrigger?.kill()
          t.kill()
        })
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <footer ref={rootRef} style={{ position: 'relative', overflow: 'hidden', paddingLeft: CLAMP.gutter, paddingRight: CLAMP.gutter }}>
      <div className="bs-footer-scrim" style={{ position: 'absolute', inset: 0, background: C.footerScrim, opacity: 0.5, pointerEvents: 'none' }} />
      {/* Footer overlay texture (teardown 4.8: img.footer__overlay-texture,
          opacity .09, mix-blend-mode multiply, absolute inset-0, z-index 20,
          pointer-events none). PLACEHOLDER stand-in texture, see IMAGES.footerTexture. */}
      <Img
        src={IMAGES.footerTexture}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.09,
          mixBlendMode: 'multiply',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      />
      <div className="bs-footer-inner" style={{ position: 'relative', padding: `${CLAMP.gap3} 0`, display: 'flex', flexDirection: 'column', gap: CLAMP.gap4 }}>
        {/* Column labels below are <p>, not <h3>: at bs-h6 scale (15.9px)
            they sit far under the h3 role band, so tagging them h3 read as a
            heading-level/visual-scale mismatch (flagged on repair). They are
            still visually distinct labels, just not document headings. */}
        <style>{`
          /* The four footer blocks kept span-3 on a 12-col grid at 390px,
             i.e. 76px columns, and the address line overprinted the
             opening-hours column beside it (audit 2026-09-02). Two up
             on a phone, four from 768. */
          @media (max-width: 767px) {
            .bs-footer-col { grid-column: span 6 !important; }
          }
        `}</style>
        <div style={GRID_STYLE}>
          <div className="bs-footer-col" style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: CLAMP.gap2 }}>
            <p className="bs-h6" style={{ color: C.ink, margin: 0 }}>Sitemap</p>
            {SITEMAP.map((s) => (
              <a key={s.href} href={s.href} data-underline-link className="bs-p-small" style={{ color: C.ink }}>
                {s.label}
              </a>
            ))}
          </div>
          <div className="bs-footer-col" style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: CLAMP.gap2 }}>
            <p className="bs-h6" style={{ color: C.ink, margin: 0 }}>Traust</p>
            <a href={TRIPADVISOR_LINK.href} target="_blank" rel="noreferrer" data-underline-link className="bs-p-small" style={{ color: C.ink }}>
              {TRIPADVISOR_LINK.label}
            </a>
          </div>
          <div className="bs-footer-col" style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: CLAMP.gap2 }}>
            <p className="bs-h6" style={{ color: C.ink, margin: 0 }}>Hafa samband</p>
            <span className="bs-p-small">{CONTACT.addressLine1}, {CONTACT.addressLine2}</span>
            <a href={CONTACT.phoneHref} data-underline-link className="bs-p-small" style={{ color: C.ink }}>{CONTACT.phoneDisplay}</a>
            <a href={`mailto:${CONTACT.email}`} data-underline-link className="bs-p-small" style={{ color: C.ink }}>{CONTACT.email}</a>
          </div>
          <div className="bs-footer-col" style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: CLAMP.gap2 }}>
            <p className="bs-h6" style={{ color: C.ink, margin: 0 }}>Opnunartími</p>
            <p className="bs-p-small">{HOURS_LINE}</p>
          </div>
        </div>
        <div style={{ height: 2, background: C.divider }} />
        {/* Footer wordmark (teardown 4.8: the full company word above the
            bottom bar, measured 1405x157 — the width of the footer). B&S has
            no logo file, so it is set in the page's own serif as live text
            rather than an <img>, which also keeps it selectable and readable
            by a screen reader as the name it is. */}
        <div
          aria-hidden="true"
          style={{
            fontFamily: FONT_FAMILY, color: C.ink, whiteSpace: 'nowrap',
            fontSize: 'clamp(2rem, 13.2vw, 13rem)', lineHeight: 0.9,
            letterSpacing: '-0.03em',
          }}
        >
          B&amp;S Restaurant
        </div>
        <p className="bs-p-small" style={{ color: C.ink }}>© B&amp;S Restaurant</p>
      </div>
    </footer>
  )
}

/* ── 4.1 Home hero, `section.homepage-hero` (teardown 4.1) ────────────────
   Text-then-photo, stacked (not text-over-image): a centred content block
   (eyebrow / h1 / paragraph / CTA pair) sits above a full-bleed 120vh image.
   Devices reproduced: D4 reveal group (eyebrow slot 0, split h1 slot ~0.1,
   split paragraph slot ~0.2, CTA slot ~0.3), D3 masked SplitText (h1 words
   1.0s + stagger amount 0.2, paragraph lines 1.5s + stagger amount 0.2, both
   power3.out per the device catalogue's D3 entry), D7 image parallax
   (yPercent -15 -> 15, ease none, scrubbed top-center/bottom-top over the
   hero's own height, matching the 1530px-range/15% ratio measured in the
   teardown). D10 button hover already lives in the shared `.bs-btn` rule in
   PageFonts above. No Lenis here: this section only scrubs (no pinning), and
   Lenis is a known mobile-scroll hazard in this codebase (memory:
   lenis-mobile-damage) — plain ScrollTrigger against native scroll is enough
   and safer; a later section that truly needs a pinned scrub can add its own
   matchMedia-scoped Lenis instance following sjavarborg/Page.tsx if required. */
function Hero() {
  const heroRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = heroRef.current
    if (!root) return

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root)
      const splits: SplitText[] = []
      const tl = gsap.timeline({ delay: 0.1 })

      tl.fromTo(q('.bs-hero-eyebrow'), { autoAlpha: 0, y: '2em' }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'osmo' }, 0)

      const h1 = q('.bs-hero-h1')[0] as HTMLElement | undefined
      if (h1) {
        splits.push(
          SplitText.create(h1, {
            type: 'words',
            mask: 'words',
            autoSplit: true,
            onSplit: (self) =>
              tl.fromTo(
                self.words,
                { yPercent: 150, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 1.0, ease: 'power3.out', stagger: { amount: 0.2 } },
                0.1,
              ),
          }),
        )
      }

      const p = q('.bs-hero-p')[0] as HTMLElement | undefined
      if (p) {
        splits.push(
          SplitText.create(p, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
                        /*
             * Own ScrollTrigger, not a tween appended to `tl`. With
             * autoSplit the split can resolve AFTER the timeline's
             * `once: true` trigger has already fired (or after the
             * timeline finished), so an appended tween renders in the
             * past and the text stays at opacity 0 permanently. The
             * motion audit on 2026-09-02 measured exactly that: the hero
             * subline, the About copy and this facts paragraph were never
             * seen by any visitor at any scroll depth.
             */
            onSplit: (self) =>
              gsap.fromTo(
                self.lines,
                { yPercent: 150, opacity: 0 },
                {
                  yPercent: 0,
                  opacity: 1,
                  duration: 1.5,
                  ease: 'power3.out',
                  stagger: { amount: 0.2 },
                  delay: 0.2,
                  scrollTrigger: { trigger: root, start: 'top 80%', once: true },
                },
              ),
          }),
        )
      }

      tl.fromTo(q('.bs-hero-cta'), { autoAlpha: 0, y: '2em' }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'osmo' }, 0.3)

      // Failsafe: a renderer that captures before the timeline advances
      // (screenshot service, crawler, paused rAF) should not be left with a
      // hidden headline — force everything visible after a beat.
      const failsafe = window.setTimeout(() => {
        gsap.set(q('.bs-hero-eyebrow, .bs-hero-h1, .bs-hero-p, .bs-hero-cta'), { clearProps: 'opacity,visibility,transform' })
        /* ...and the SplitText-generated children, which is where the
           opacity:0 actually lives. Clearing only the parent left the
           text invisible forever whenever the split resolved after its
           own once:true trigger had already fired. */
        splits.forEach((sp) => gsap.set([...(sp.lines ?? []), ...(sp.words ?? [])], { clearProps: 'opacity,visibility,transform' }))
      }, 2400)

      // D7: hero image parallax, scrubbed against the section's own scroll
      // range (teardown: top center -> bottom top, yPercent -15 -> 15).
      const heroImg = q('.bs-hero-img')[0] as HTMLElement | undefined
      const parallax = heroImg
        ? gsap.fromTo(
            heroImg,
            { yPercent: -15 },
            {
              yPercent: 15,
              ease: 'none',
              scrollTrigger: { trigger: root, start: 'top center', end: 'bottom top', scrub: true },
            },
          )
        : undefined

      return () => {
        window.clearTimeout(failsafe)
        splits.forEach((s) => s.revert())
        parallax?.scrollTrigger?.kill()
        parallax?.kill()
        tl.kill()
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative flex flex-col"
      style={{ paddingTop: CLAMP.gap5, background: C.paper }}
    >
      <style>{`
        .bs-hero-asset { position: relative; overflow: hidden; min-height: 120vh; }
        @media (max-width: 767px) {
          .bs-hero-col { grid-column: 1 / span 12 !important; }
          .bs-hero-cta { flex-direction: column; align-items: stretch !important; }
        }
      `}</style>

      <div style={GRID_STYLE}>
        <div
          className="bs-hero-col flex flex-col items-center text-center"
          style={{
            gridColumn: '3 / span 8',
            paddingTop: CLAMP.gap6,
            paddingBottom: CLAMP.gap6,
            gap: CLAMP.gap2,
          }}
        >
          <p className="bs-h6 bs-hero-eyebrow" style={{ margin: 0 }}>
            {HERO.eyebrow}
          </p>
          <h1 className="bs-h1 bs-hero-h1" style={{ margin: 0 }}>
            {HERO.headline}
          </h1>
          <p className="bs-p-medium bs-hero-p" style={{ margin: 0, maxWidth: '42ch', color: C.ink }}>
            {HERO.paragraph}
          </p>
          <div
            className="bs-hero-cta flex flex-wrap items-center justify-center"
            style={{ gap: CLAMP.gap1, marginTop: CLAMP.gap1 }}
          >
            <BtnIcon href={HERO.ctaPrimary.href} label={HERO.ctaPrimary.label} variant="primary" />
            <BtnIcon href={HERO.ctaSecondary.href} label={HERO.ctaSecondary.label} variant="outline" />
          </div>
        </div>
      </div>

      <div className="bs-hero-asset">
        {/* PLACEHOLDER: no B&S exterior photo has been supplied yet (teardown
            9, row 4.1: "must be shot or supplied"). Unsplash stand-in from
            data.ts IMAGES.hero, replace before sending. */}
        <Img
          src={IMAGES.hero}
          alt="Veitingastaður við þjóðveg, sýnishorn"
          fetchpriority="high"
          className="bs-hero-img absolute inset-0 h-full w-full object-cover"
          fallbackClassName="absolute inset-0 bg-gradient-to-b from-[#cfcfcf] to-[#8f8f8f]"
        />
      </div>
    </section>
  )
}

/* ── 4.2 Our offering (3 cards), `section.section-offering.u-grid` (teardown
   4.2) ────────────────────────────────────────────────────────────────────
   Left-started eyebrow + h2 headline block over a 12-col row of three full-
   card links (image / title / body / arrow chip), re-aimed per teardown
   section 9: Maturinn (confirmed menu categories), Hópar og rútur (group
   menus for coaches), Eyvindarstofa (the themed hall with meeting
   facilities). Devices reproduced: D4 reveal group with two nested groups
   (headline block, then the three cards one slot apart), D3 masked
   SplitText on the h2 (words, 1.0s + stagger amount 0.2, power3.out, delay
   0.1 — teardown: "D3 on the h2, 1.2s total, delay 0.1"), D12 card hover
   (image scale(1.2) 0.8s osmo, body opacity 0.75 in 0.6s osmo, arrow
   translate(200%,0) 0.525s osmo — teardown's own cubic-bezier(0.625,0.05,0,1)
   already named "osmo" in the reference, values verbatim from section 5). */
function Offering() {
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root)
      const splits: SplitText[] = []
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 80%', once: true },
      })

      tl.fromTo(q('.bs-offer-eyebrow'), { autoAlpha: 0, y: '2em' }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'osmo' }, 0)

      const h2 = q('.bs-offer-h2')[0] as HTMLElement | undefined
      if (h2) {
        splits.push(
          SplitText.create(h2, {
            type: 'words',
            mask: 'words',
            autoSplit: true,
            onSplit: (self) =>
              tl.fromTo(
                self.words,
                { yPercent: 150, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 1.0, ease: 'power3.out', stagger: { amount: 0.2 } },
                0.1,
              ),
          }),
        )
      }

      tl.fromTo(
        q('.bs-offer-card'),
        { autoAlpha: 0, y: '2em' },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: 'osmo', stagger: 0.1 },
        0.3,
      )

      // Failsafe: see Hero's identical guard above.
      const failsafe = window.setTimeout(() => {
        gsap.set(q('.bs-offer-eyebrow, .bs-offer-h2, .bs-offer-card'), { clearProps: 'opacity,visibility,transform' })
        /* ...and the SplitText-generated children, which is where the
           opacity:0 actually lives. Clearing only the parent left the
           text invisible forever whenever the split resolved after its
           own once:true trigger had already fired. */
        splits.forEach((sp) => gsap.set([...(sp.lines ?? []), ...(sp.words ?? [])], { clearProps: 'opacity,visibility,transform' }))
      }, 2400)

      return () => {
        window.clearTimeout(failsafe)
        splits.forEach((s) => s.revert())
        tl.kill()
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      id="offering"
      ref={rootRef}
      className="relative"
      style={{ paddingTop: CLAMP.gap7, paddingBottom: CLAMP.gap5, background: C.paper }}
    >
      <style>{`
        .bs-offer-card { position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; text-decoration: none; color: ${C.ink}; cursor: pointer; }
        .bs-offer-card-img { position: relative; width: 100%; aspect-ratio: 4 / 5; overflow: hidden; }
        .bs-offer-card-img-inner { position: absolute; inset: 0; object-fit: cover; transition: transform 0.8s cubic-bezier(0.625,0.05,0,1); }
        .bs-offer-card:hover .bs-offer-card-img-inner, .bs-offer-card:focus-visible .bs-offer-card-img-inner { transform: scale(1.2); }
        .bs-offer-card-body { transition: opacity 0.6s cubic-bezier(0.625,0.05,0,1); }
        .bs-offer-card:hover .bs-offer-card-body, .bs-offer-card:focus-visible .bs-offer-card-body { opacity: 0.75; }
        .bs-offer-arrow { position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; width: 1.5em; height: 1.5em; border-radius: 50%; border: 1px solid ${C.ink}; }
        .bs-offer-arrow-icon, .bs-offer-arrow-icon-dup { position: absolute; inset: 0; margin: auto; width: 0.625em; height: 0.5em; transition: transform 0.525s cubic-bezier(0.625,0.05,0,1); }
        .bs-offer-arrow-icon-dup { transform: translate(-200%, 0); }
        /* D12 card hover, arrow half (teardown: "arrow shares D10's 200
           percent exit") — the base arrow exits right at translate(200%,0)
           while its duplicate, parked at -200%, slides in to translate(0,0)
           so the chip shows an incoming arrow instead of an empty circle. */
        .bs-offer-card:hover .bs-offer-arrow-icon, .bs-offer-card:focus-visible .bs-offer-arrow-icon { transform: translate(200%, 0); }
        .bs-offer-card:hover .bs-offer-arrow-icon-dup, .bs-offer-card:focus-visible .bs-offer-arrow-icon-dup { transform: translate(0, 0); }
        @media (max-width: 767px) {
          .bs-offer-head-col { grid-column: 1 / span 12 !important; }
          .bs-offer-card-col { grid-column: 1 / span 12 !important; }
        }
      `}</style>

      <div style={GRID_STYLE}>
        <div
          className="bs-offer-head-col flex flex-col items-start text-left"
          style={{ gridColumn: '1 / span 7', gap: CLAMP.gap1 }}
        >
          <p className="bs-h6 bs-offer-eyebrow" style={{ margin: 0 }}>
            Okkar framboð
          </p>
          <h2 className="bs-h2 bs-offer-h2" style={{ margin: 0 }}>
            Matur, hópar og fundarrými á Norðurlandsvegi 4
          </h2>
        </div>

        <div
          className="grid"
          style={{
            gridColumn: '1 / span 12',
            display: 'grid',
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            columnGap: CLAMP.gutter,
            rowGap: CLAMP.gap4,
            marginTop: CLAMP.gap4,
          }}
        >
          {OFFER_CARDS.map((card) => (
            <a
              key={card.id}
              id={card.id}
              href={card.href}
              className="bs-offer-card bs-offer-card-col"
              style={{ gridColumn: 'span 4', scrollMarginTop: '6rem' }}
            >
              <div className="bs-offer-card-img" style={{ marginBottom: CLAMP.gap2 }}>
                <Img
                  src={card.image}
                  alt={card.title}
                  className="bs-offer-card-img-inner h-full w-full"
                  fallbackClassName="absolute inset-0 bg-gradient-to-br from-[#cfcfcf] to-[#8f8f8f]"
                />
              </div>
              <div
                className="bs-offer-card-body flex flex-col items-center"
                style={{ gap: CLAMP.gap1 }}
              >
                <h3 className="bs-h4" style={{ margin: 0 }}>
                  {card.title}
                </h3>
                <p className="bs-p-medium" style={{ margin: 0, color: C.ink }}>
                  {card.body}
                </p>
                <span className="bs-offer-arrow" aria-hidden="true" style={{ marginTop: CLAMP.gap1 }}>
                  <svg className="bs-offer-arrow-icon" viewBox="0 0 10 8" fill="none">
                    <path d="M0 4H9M9 4L6 1M9 4L6 7" stroke={C.ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <svg className="bs-offer-arrow-icon-dup" viewBox="0 0 10 8" fill="none">
                    <path d="M0 4H9M9 4L6 1M9 4L6 7" stroke={C.ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}


/* ── MENU, `section.section-packages.u-grid` (teardown 4.19 / 4.26) ─────────
   The teardown's re-aim map specifies the home hero's secondary CTA as "Sjá
   matseðil" -> `#matur`; the first build never made that section, so the CTA
   had no destination and had to be relabelled. This is it.

   Row grammar is the reference's packages list, verbatim in structure: a
   vertical repeating list under a left-started eyebrow + h2, `padding-top/
   bottom: gap-7`, each row a `h3` title beside its body, rows separated by
   the reference's own 2px `.divider-line` in `#16151333` (C.divider). The
   reference calls it "not a table, not a pricing grid" and that is exactly
   why it suits a menu with no prices to print.

   Deviation, declared: the reference's rows each carry a 4:5
   `[data-parallax-image]`. These carry none. A menu is a typographic object,
   and four more stock plates would repeat the image-count padding that had
   to be removed from the facts band and the diptych on 2026-09-05.

   Devices: D4 reveal group (eyebrow, then the h2, then the rows one slot
   apart) and D3 masked SplitText on the h2 — the same pair every other
   headline block on this page uses. The row dividers take the reference's
   own `scaleX 0 -> 1` from D15's divider tween, which is inert on the
   reference itself (0 `.divider-line` inside its dinner sheet) but is the
   only divider motion the bundle defines. */
function MenuSection() {
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root)
      const splits: SplitText[] = []
      const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 80%', once: true } })

      tl.fromTo(q('.bs-menu-eyebrow'), { autoAlpha: 0, y: '2em' }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'osmo' }, 0)

      const h2 = q('.bs-menu-h2')[0] as HTMLElement | undefined
      if (h2) {
        splits.push(
          SplitText.create(h2, {
            type: 'words',
            mask: 'words',
            autoSplit: true,
            /* Own trigger, not appended to `tl` — with autoSplit the split can
               resolve after a `once: true` timeline has already fired, which
               is what left three paragraphs at opacity 0 for every visitor
               before the 2026-09-02 repair. */
            onSplit: (self) =>
              gsap.fromTo(
                self.words,
                { yPercent: 150, opacity: 0 },
                {
                  yPercent: 0, opacity: 1, duration: 1.0, ease: 'power3.out',
                  stagger: { amount: 0.2 },
                  scrollTrigger: { trigger: root, start: 'top 80%', once: true },
                },
              ),
          }),
        )
      }

      tl.fromTo(q('.bs-menu-divider'), { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power3.out', stagger: 0.06, transformOrigin: 'left center' }, 0.35)
      tl.fromTo(q('.bs-menu-row'), { autoAlpha: 0, y: '1.5em' }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'osmo', stagger: 0.08 }, 0.4)
      tl.fromTo(q('.bs-menu-note'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, ease: 'osmo' }, 0.8)

      const failsafe = window.setTimeout(() => {
        gsap.set(q('.bs-menu-eyebrow, .bs-menu-h2, .bs-menu-row, .bs-menu-note'), { clearProps: 'opacity,visibility,transform' })
        gsap.set(q('.bs-menu-divider'), { clearProps: 'transform' })
        splits.forEach((sp) => gsap.set([...(sp.lines ?? []), ...(sp.words ?? [])], { clearProps: 'opacity,visibility,transform' }))
      }, 4000)

      return () => {
        window.clearTimeout(failsafe)
        splits.forEach((sp) => sp.revert())
        tl.kill()
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      id="matsedill"
      ref={rootRef}
      className="relative"
      style={{ paddingTop: CLAMP.gap7, paddingBottom: CLAMP.gap7, background: C.paper, scrollMarginTop: '5rem' }}
    >
      <style>{`
        .bs-menu-head { grid-column: 1 / span 7; }
        .bs-menu-list { grid-column: 1 / span 12; }
        .bs-menu-row { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: ${CLAMP.gutter}; align-items: baseline; }
        .bs-menu-row__title { grid-column: 1 / span 5; }
        .bs-menu-row__body { grid-column: 7 / span 5; }
        .bs-menu-divider { height: 2px; background: ${C.divider}; }
        .bs-menu-note { grid-column: 7 / span 5; }
        @media (max-width: 767px) {
          .bs-menu-head, .bs-menu-list, .bs-menu-note { grid-column: 1 / span 12 !important; }
          .bs-menu-row { display: flex; flex-direction: column; }
        }
      `}</style>

      <div style={GRID_STYLE}>
        <div className="bs-menu-head flex flex-col items-start text-left" style={{ gap: CLAMP.gap1 }}>
          <p className="bs-h6 bs-menu-eyebrow" style={{ margin: 0 }}>{MENU.eyebrow}</p>
          <h2 className="bs-h2 bs-menu-h2" style={{ margin: 0 }}>{MENU.headline}</h2>
        </div>

        <div className="bs-menu-list" style={{ marginTop: CLAMP.gap4 }}>
          {MENU.rows.map((row, i) => (
            <div key={row.title}>
              {i === 0 && <div className="bs-menu-divider" />}
              <div
                className="bs-menu-row"
                style={{ paddingTop: CLAMP.gap3, paddingBottom: CLAMP.gap3, gap: CLAMP.gap2 }}
              >
                <h3 className="bs-h4 bs-menu-row__title" style={{ margin: 0 }}>{row.title}</h3>
                <p className="bs-p-medium bs-menu-row__body" style={{ margin: 0, color: C.ink }}>{row.body}</p>
              </div>
              <div className="bs-menu-divider" />
            </div>
          ))}
        </div>

        <p className="bs-p-small bs-menu-note" style={{ marginTop: CLAMP.gap2, color: C.ink, opacity: 0.7 }}>
          {MENU.note}
        </p>
      </div>
    </section>
  )
}

/* ── 4.3 About us teaser (dark band), `section.section-text.u-grid` (teardown
   4.3) ─────────────────────────────────────────────────────────────────────
   The reference's one dark band on the home page: a right-aligned 7-column
   block (eyebrow / lead paragraph / CTA) on the section's `--brand--dark-grey`
   fill, text in `--brand--eggwhite`. Re-aimed per teardown section 9, row
   4.3: only the two verified facts (family restaurant and café since 2007,
   Blönduós, ring road, open all year) — who the family is stays UNKNOWN, so
   ABOUT_TEASER.paragraph in data.ts stays short rather than inventing the
   reference's 61-word inn history. Devices reproduced: D4 reveal group
   (eyebrow slot 0, then the nested group's split paragraph, then the CTA —
   teardown: "microtype slot 0; text__inner nested group: p split lines,
   then the CTA"), D3 masked SplitText on the paragraph (lines, 1.5s +
   stagger amount 0.2, power3.out, once true, trigger top 80% per the D3
   general spec), D10 button hover already in `.bs-btn` (PageFonts above) —
   only the fill swaps to the teardown's named "dark-mode button variant:
   eggwhite fill") had no destination: it pointed at #about from inside
   #about. Removed with the button. */
function AboutTeaser() {
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root)
      const splits: SplitText[] = []
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 80%', once: true },
      })

      tl.fromTo(q('.bs-about-eyebrow'), { autoAlpha: 0, y: '2em' }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'osmo' }, 0)

      const p = q('.bs-about-p')[0] as HTMLElement | undefined
      if (p) {
        splits.push(
          SplitText.create(p, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            /*
             * Its OWN ScrollTrigger, not a tween appended to `tl`.
             * Appending here was the bug (audit 2026-09-02): `tl`'s trigger
             * is `once: true`, and with autoSplit the split can resolve
             * AFTER that trigger has already fired, so the tween landed on
             * a finished timeline, rendered in its past, and left every
             * line at opacity 0 permanently. This section rendered as an
             * empty dark block on every device. A self-contained trigger
             * cannot land in the past, and it re-arms correctly on each
             * autoSplit re-split.
             */
            onSplit: (self) =>
              gsap.fromTo(
                self.lines,
                { yPercent: 150, opacity: 0 },
                {
                  yPercent: 0,
                  opacity: 1,
                  duration: 1.5,
                  ease: 'power3.out',
                  stagger: { amount: 0.2 },
                  scrollTrigger: { trigger: root, start: 'top 80%', once: true },
                },
              ),
          }),
        )
      }


      // Failsafe: see Hero's identical guard above.
      const failsafe = window.setTimeout(() => {
        gsap.set(q('.bs-about-eyebrow, .bs-about-p'), { clearProps: 'opacity,visibility,transform' })
        /* ...and the SplitText-generated children, which is where the
           opacity:0 actually lives. Clearing only the parent left the
           text invisible forever whenever the split resolved after its
           own once:true trigger had already fired. */
        splits.forEach((sp) => gsap.set([...(sp.lines ?? []), ...(sp.words ?? [])], { clearProps: 'opacity,visibility,transform' }))
      }, 2400)

      return () => {
        window.clearTimeout(failsafe)
        splits.forEach((s) => s.revert())
        tl.kill()
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      id="about"
      ref={rootRef}
      className="relative"
      style={{ paddingTop: CLAMP.gap6, paddingBottom: CLAMP.gap6, background: C.darkGrey }}
    >
      {/*
       * REBALANCED 2026-09-05. This band reproduced the reference's geometry
       * literally — `.text__inner{span 7}` pushed to the right edge, gap-7
       * (224px) of padding above and below — but not its content mass. The
       * reference fills that block with 61 words over 7 lines (measured
       * 800x343, teardown 4.3); B&S has published only its founding year and
       * address, so the same box holds 20 words over 3 lines. The result was
       * a 677px dark slab with five empty columns beside a short paragraph
       * and 224px of air above and below it: faithful to the reference's
       * numbers, and visibly broken.
       *
       * The fix keeps the reference's right-weighted asymmetry but makes the
       * empty columns do work: the eyebrow moves out of the stack into a
       * left rail (a plain editorial label-left/text-right split), and the
       * vertical padding drops one step to gap-6 so the block is scaled to
       * the copy that actually exists. No copy was invented to fill it.
       */}
      <style>{`
        .bs-about-col { grid-column: 1 / span 9; }
        @media (max-width: 767px) {
          .bs-about-col { grid-column: 1 / span 12 !important; }
        }
      `}</style>

      <div style={GRID_STYLE}>
        <div className="bs-about-col flex flex-col items-start text-left" style={{ gap: CLAMP.gap3 }}>
          <p
            className="bs-h6 bs-about-eyebrow"
            style={{ margin: 0, color: C.eggwhite, opacity: 0.65 }}
          >
            {ABOUT_TEASER.eyebrow}
          </p>
          <p
            className="bs-about-p"
            style={{
              margin: 0,
              color: C.eggwhite,
              fontFamily: FONT_FAMILY,
              fontSize: CLAMP.h3,
              lineHeight: 1.12,
              letterSpacing: LETTER_SPACING.heading,
            }}
          >
            {ABOUT_TEASER.paragraph}
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── 4.4 Full-bleed photo, `section.section-image` (teardown 4.4) ─────────
   Purpose per the teardown: "atmosphere break, no text" — a single 110vh
   image, no heading, no CTA, no reveal group. Layout: full-bleed, no
   padding, `min-height:110vh`, image `object-fit:cover` at a constant
   `transform:scale(1.2)` baseline. Device reproduced: D7 parallax, scrubbed
   against the section's own scroll range (teardown: top center -> bottom
   top, `yPercent -15 -> 15` composed with the 1.2x CSS scale — the same
   top-center/bottom-top scrub convention as Hero's D7 above, GSAP preserves
   the CSS scale already on the element when it takes over the transform for
   yPercent, so only the CSS declares the 1.2x and only GSAP declares the
   yPercent). No Lenis: this section only scrubs, matching the Hero note
   above on lenis-mobile-damage. */
function FullBleedPhoto() {
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root)
      const img = q('.bs-plate-img')[0] as HTMLElement | undefined
      const parallax = img
        ? gsap.fromTo(
            img,
            { yPercent: -15 },
            {
              yPercent: 15,
              ease: 'none',
              scrollTrigger: { trigger: root, start: 'top center', end: 'bottom top', scrub: true },
            },
          )
        : undefined

      return () => {
        parallax?.scrollTrigger?.kill()
        parallax?.kill()
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      className="relative"
      style={{ width: '100%', minHeight: '110vh', overflow: 'hidden', background: C.paper }}
    >
      <style>{`
        .bs-plate-img { position: absolute; inset: 0; object-fit: cover; transform: scale(1.2); }
      `}</style>
      {/* PLACEHOLDER: no B&S dining room / exterior photo has been supplied
          yet (teardown 9, row 4.4: "asset UNKNOWN"). Unsplash stand-in from
          data.ts IMAGES.interior, replace before sending. */}
      <Img
        src={IMAGES.interior}
        alt="Borðsalur veitingastaðar, sýnishorn"
        className="bs-plate-img h-full w-full"
        fallbackClassName="absolute inset-0 bg-gradient-to-b from-[#cfcfcf] to-[#8f8f8f]"
      />
    </section>
  )
}

/* ── 4.5 House facts, `section.section-small-text.u-grid` (teardown 4.5) ──
   Purpose in the reference: a longer "why us" paragraph ("the house is
   always yours"). B&S has published no such philosophy, so per the re-aim
   map (teardown 9, row 4.5) this keeps the reference's exact layout and
   motion but carries only the three verified facts: open all year,
   breakfast served, groups welcome (see HOUSE_FACTS in data.ts). No
   heading, no CTA, same as the reference. Layout: `place-items:start end`
   on the 12-col grid, a single column at `7 / span 5` (desktop), start-
   aligned text, on the paper background (teardown: BG #fdfdfd). Device
   reproduced: D4 reveal group with one child, D3 masked SplitText on the
   paragraph (lines, 1.5s + stagger amount 0.2, power3.out, delay 0, trigger
   top 80%, once — teardown: "6 lines, 1.5s, amount 0.2, delay 0"). */
function HouseFacts() {
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root)
      const splits: SplitText[] = []
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 80%', once: true },
      })

      const p = q('.bs-facts-p')[0] as HTMLElement | undefined
      if (p) {
        splits.push(
          SplitText.create(p, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
                        /*
             * Own ScrollTrigger, not a tween appended to `tl`. With
             * autoSplit the split can resolve AFTER the timeline's
             * `once: true` trigger has already fired (or after the
             * timeline finished), so an appended tween renders in the
             * past and the text stays at opacity 0 permanently. The
             * motion audit on 2026-09-02 measured exactly that: the hero
             * subline, the About copy and this facts paragraph were never
             * seen by any visitor at any scroll depth.
             */
            onSplit: (self) =>
              gsap.fromTo(
                self.lines,
                { yPercent: 150, opacity: 0 },
                {
                  yPercent: 0,
                  opacity: 1,
                  duration: 1.5,
                  ease: 'power3.out',
                  stagger: { amount: 0.2 },
                  delay: 0,
                  scrollTrigger: { trigger: root, start: 'top 80%', once: true },
                },
              ),
          }),
        )
      }

      // Failsafe: see Hero's identical guard above.
      const failsafe = window.setTimeout(() => {
        gsap.set(q('.bs-facts-p'), { clearProps: 'opacity,transform' })
        splits.forEach((sp) => gsap.set([...(sp.lines ?? []), ...(sp.words ?? [])], { clearProps: 'opacity,visibility,transform' }))
      }, 2400)

      return () => {
        window.clearTimeout(failsafe)
        splits.forEach((s) => s.revert())
        tl.kill()
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      className="relative"
      style={{ paddingTop: CLAMP.gap7, paddingBottom: CLAMP.gap7, background: C.paper }}
    >
      <style>{`
        @media (max-width: 767px) {
          .bs-facts-col { grid-column: 1 / span 12 !important; }
        }
      `}</style>

      <div style={{ ...GRID_STYLE, placeItems: 'start end' }}>
        <div
          className="bs-facts-col flex flex-col items-start text-left"
          style={{ gridColumn: '7 / span 5', gap: CLAMP.gap3 }}
        >
          <p className="bs-p-medium bs-facts-p" style={{ margin: 0, color: C.ink }}>
            {HOUSE_FACTS.paragraph}
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── 4.6 Image gallery (diptych), `section.section-image-gallery.u-grid`
   (teardown 4.6) ───────────────────────────────────────────────────────────
   Purpose per the teardown: "two-photo visual break, asymmetric", no
   heading, no CTA, no reveal group — the section is only the two images.
   Content re-aimed per teardown section 9, row "4.6 Diptych": square = "a
   food close-up (pizza, a burger, or coffee and cake)", portrait = "the
   building or the ring-road setting" — both flagged UNKNOWN assets in the
   teardown, so IMAGES.gallerySmall (pizza, a confirmed menu item) and
   IMAGES.galleryLarge (building / ring-road) from data.ts stand in; both are
   PLACEHOLDER Unsplash stock, replace before sending. Layout: literal from
   the teardown at desktop — `.gallery-item__small.u-col{aspect-ratio:1;
   grid-column-end:span 3;overflow:hidden}` (auto-starts at column 1) and
   `.gallery-item__large.u-col{aspect-ratio:4/5;grid-column:8/span 5;
   overflow:hidden}`, both on the same row with four empty columns between
   (D19 "asymmetric diptych"), section padding gap-7/gutter matching the
   other content sections, BG #fdfdfd. At the reference's 767px breakpoint
   the pair stays side by side rather than stacking (measured: small ~128px
   at x20, large ~202px at x168 on a 390px viewport) — the reference's own
   breakpoint math swaps to a 5-column grid there, which does not translate
   1:1 onto this codebase's fixed 12-column GRID_STYLE, so the mobile spans
   below (`1 / span 4` and `6 / span 7`) are a reasonable proportional
   adaptation that preserves the same side-by-side, asymmetric read instead
   of falling back to this codebase's usual full-width mobile stack. Device
   reproduced: D7 parallax on both (teardown: "`[data-parallax-image]` on
   each `.gallery-item__*`... both `yPercent -15 -> 15` over the
   `scale(1.2)` baseline") — each item is its own scrub trigger (`top
   center` -> `bottom top`, `ease: none`, `scrub: true`), exactly the
   `wrapper.querySelector('img')` pattern the teardown's D7 write-up
   describes for `initImageParallax`, applied twice here since there are two
   independent wrappers rather than the section as a whole. No Lenis: only
   scrubbed, no pinning (see the lenis-mobile-damage note on Hero above). */
function ImageGallery() {
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const wrappers = Array.from(root.querySelectorAll<HTMLElement>('[data-parallax-image]'))
      const tweens = wrappers.map((wrapper) => {
        const img = wrapper.querySelector<HTMLElement>('img')
        if (!img) return undefined
        return gsap.fromTo(
          img,
          { yPercent: -15 },
          {
            yPercent: 15,
            ease: 'none',
            scrollTrigger: { trigger: wrapper, start: 'top center', end: 'bottom top', scrub: true },
          },
        )
      })

      return () => {
        tweens.forEach((t) => {
          t?.scrollTrigger?.kill()
          t?.kill()
        })
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      className="relative"
      style={{ paddingTop: CLAMP.gap7, paddingBottom: CLAMP.gap7, background: C.paper }}
    >
      <style>{`
        .bs-gallery-item { position: relative; overflow: hidden; }
        .bs-gallery-img { position: absolute; inset: 0; object-fit: cover; transform: scale(1.2); will-change: transform; }
        @media (max-width: 767px) {
          .bs-gallery-small { grid-column: 1 / span 3 !important; }
          .bs-gallery-large { grid-column: 1 / span 7 !important; }
        }
      `}</style>

      <div style={GRID_STYLE}>
        <div
          data-parallax-image
          className="bs-gallery-item bs-gallery-small"
          style={{ gridColumn: '1 / span 3', aspectRatio: '1' }}
        >
          {/* PLACEHOLDER: no B&S food photography supplied yet (teardown 9,
              row 4.6: "UNKNOWN assets"). Unsplash stand-in from data.ts
              IMAGES.gallerySmall (ristað brauð með áleggi, a confirmed nav
              category), replace before sending. */}
          <Img
            src={IMAGES.gallerySmall}
            alt="Ristað brauð með áleggi, sýnishorn"
            className="bs-gallery-img h-full w-full"
            fallbackClassName="absolute inset-0 bg-gradient-to-br from-[#cfcfcf] to-[#8f8f8f]"
          />
        </div>
        <div
          data-parallax-image
          className="bs-gallery-item bs-gallery-large"
          style={{ gridColumn: '8 / span 5', aspectRatio: '4 / 5' }}
        >
          {/* PLACEHOLDER: no B&S exterior photo supplied yet (teardown 9, row
              4.6: "UNKNOWN assets"). Unsplash stand-in from data.ts
              IMAGES.galleryLarge (building / ring-road setting), replace
              before sending. */}
          <Img
            src={IMAGES.galleryLarge}
            alt="Hús við þjóðveg, sýnishorn"
            className="bs-gallery-img h-full w-full"
            fallbackClassName="absolute inset-0 bg-gradient-to-br from-[#cfcfcf] to-[#8f8f8f]"
          />
        </div>
      </div>
    </section>
  )
}

/* ── 4.7 FAQ, `section.section-faq.u-grid` (teardown 4.7, D14) ────────────
   Purpose: an accordion of answerable questions, re-aimed per teardown
   section 9 row "4.7 FAQ (13)": the reference runs 13 questions, but only
   the ones answerable from VERIFIED CLIENT FACTS are kept (the brief
   forbids inventing the rest to reach 13) — the 7 items already curated in
   data.ts's FAQ array, including the disputed-hours item stated as a
   conflict rather than a picked answer. No CTA, matching the reference.
   Layout, literal from the teardown: `.faq__headline.u-col{grid-column-end:
   span 5;position:sticky;top:5%}` on the left, `.accordion-css.u-col{
   grid-column:7/span 6}` on the right, section padding gap-7/gutter, BG
   #fdfdfd, `.accordion-css__item-top{padding:gap-2;justify-content:
   space-between}`, `.accordion-css__item{border-bottom:1px solid
   var(--brand--grey)}`, `:hover{background-color:var(--brand--eggwhite)}`,
   icon wrapper `border-radius:50%;width:2em;height:2em`. Mobile: this
   codebase's fixed 12-column grid has no 5-column mode to fall into (the
   reference's own 767px breakpoint moves to a 5-col grid), so per this
   file's own convention elsewhere (Hero, Offering, AboutTeaser, HouseFacts,
   ImageGallery) both columns fall back to the usual full-width mobile stack
   at 767px, sticky cleared. Devices reproduced: D4 group (eyebrow slot 0,
   h2 split slot 0.1, list items one slot each from 0.8 with 0.1 stagger —
   teardown: "list finishes at 0.8 + 12 x 0.1 = 2.0 s"), D3 masked SplitText
   on the h2 (words, 1.0s + stagger amount 0.2, power3.out, matching the
   general D3 spec used on every other section's h2 in this file), D14
   accordion: CSS-only `grid-template-rows 0fr -> 1fr` and icon
   `rotate(180deg) -> rotate(0.001deg)`, both 0.6s cubic-bezier(0.625,0.05,
   0,1) verbatim from the teardown's D14 entry, `data-accordion-close-
   siblings` behaviour via a single `openIndex` state (only one item open at
   a time), and the reference's one violet focus-visible ring
   (`outline:2px solid #6b5bd4`, teardown D14 / section 1.1 — the site's
   only non-neutral colour, reproduced verbatim since the teardown gives the
   literal value). Native <button> gives Enter/Space toggling and
   `aria-expanded` for free, matching the reference's D14 keyboard note. */
function Faq() {
  const rootRef = useRef<HTMLElement | null>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  /* Section 9 re-aim map, row "4.7 FAQ": "Emit FAQPage JSON-LD from the same
     list, as the reference does on Kontakt" (the reference marks up this
     same accordion content as schema.org FAQPage on its Kontakt page, per
     teardown 4.39 and js/inline-en__kontakt-2.js). Built straight from the
     FAQ array in data.ts so the visible accordion and the schema markup can
     never drift apart. Appended to document.head on mount and removed on
     unmount, matching the sjavarborg/Page.tsx convention for per-page
     JSON-LD (document.createElement('script') + textContent +
     appendChild/remove), scoped here to this section's own component since
     this build-step only owns the FAQ section. */
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    })
    document.head.appendChild(script)
    return () => { script.remove() }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root)
      const splits: SplitText[] = []
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 80%', once: true },
      })

      tl.fromTo(q('.bs-faq-eyebrow'), { autoAlpha: 0, y: '2em' }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'osmo' }, 0)

      const h2 = q('.bs-faq-h2')[0] as HTMLElement | undefined
      if (h2) {
        splits.push(
          SplitText.create(h2, {
            type: 'words',
            mask: 'words',
            autoSplit: true,
            onSplit: (self) =>
              tl.fromTo(
                self.words,
                { yPercent: 150, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 1.0, ease: 'power3.out', stagger: { amount: 0.2 } },
                0.1,
              ),
          }),
        )
      }

      tl.fromTo(
        q('.bs-faq-item'),
        { autoAlpha: 0, y: '2em' },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: 'osmo', stagger: 0.1 },
        0.8,
      )

      // Failsafe: see Hero's identical guard above.
      const failsafe = window.setTimeout(() => {
        gsap.set(q('.bs-faq-eyebrow, .bs-faq-h2, .bs-faq-item'), { clearProps: 'opacity,visibility,transform' })
        /* ...and the SplitText-generated children, which is where the
           opacity:0 actually lives. Clearing only the parent left the
           text invisible forever whenever the split resolved after its
           own once:true trigger had already fired. */
        splits.forEach((sp) => gsap.set([...(sp.lines ?? []), ...(sp.words ?? [])], { clearProps: 'opacity,visibility,transform' }))
      }, 3000)

      return () => {
        window.clearTimeout(failsafe)
        splits.forEach((s) => s.revert())
        tl.kill()
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      className="relative"
      style={{ paddingTop: CLAMP.gap7, paddingBottom: CLAMP.gap7, background: C.paper }}
    >
      <style>{`
        .bs-faq-item { border-bottom: 1px solid ${C.grey}; }
        .bs-faq-item-top {
          all: unset; box-sizing: border-box; display: flex; width: 100%; cursor: pointer;
          align-items: center; justify-content: space-between; gap: ${CLAMP.gap1};
          padding: ${CLAMP.gap2} 0; transition: background-color 0.2s ease;
        }
        .bs-faq-item-top:hover { background-color: ${C.eggwhite}; }
        .bs-faq-item-top:focus-visible { outline: 2px solid #6b5bd4; outline-offset: 2px; }
        .bs-faq-icon {
          flex: none; display: flex; align-items: center; justify-content: center;
          width: 2em; height: 2em; border-radius: 50%; border: 1px solid ${C.ink};
          transform: rotate(180deg); transition: transform 0.6s cubic-bezier(0.625,0.05,0,1);
        }
        [data-open="true"] .bs-faq-icon { transform: rotate(0.001deg); }
        .bs-faq-icon-v { transition: opacity 0.6s cubic-bezier(0.625,0.05,0,1); }
        [data-open="true"] .bs-faq-icon-v { opacity: 0; }
        .bs-faq-item-bottom {
          display: grid; grid-template-rows: 0fr; overflow: hidden;
          transition: grid-template-rows 0.6s cubic-bezier(0.625,0.05,0,1);
        }
        [data-open="true"] .bs-faq-item-bottom { grid-template-rows: 1fr; }
        .bs-faq-item-bottom-inner { min-height: 0; overflow: hidden; }
        @media (max-width: 767px) {
          .bs-faq-head-col { grid-column: 1 / span 12 !important; position: static !important; }
          .bs-faq-list-col { grid-column: 1 / span 12 !important; }
        }
      `}</style>

      <div style={{ ...GRID_STYLE, justifyContent: 'space-between', placeItems: 'start stretch' }}>
        <div
          className="bs-faq-head-col flex flex-col items-start text-left"
          style={{ gridColumn: '1 / span 5', gap: CLAMP.gap1, position: 'sticky', top: '5%' }}
        >
          <p className="bs-h6 bs-faq-eyebrow" style={{ margin: 0 }}>
            Spurt og svarað
          </p>
          <h2 className="bs-h3 bs-faq-h2" style={{ margin: 0, color: C.ink }}>
            Leitar þú frekari upplýsinga?
          </h2>
        </div>

        <ul
          className="bs-faq-list-col"
          style={{ gridColumn: '7 / span 6', listStyle: 'none', margin: 0, padding: 0 }}
        >
          {FAQ.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <li key={item.q} className="bs-faq-item" data-open={isOpen}>
                <button
                  type="button"
                  className="bs-faq-item-top"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  {/* Not an <h3>: this is a control label inside an
                      accordion button, not a document heading, and its
                      body-medium visual scale sits far below the h3 role
                      band (a mismatch flagged on repair). A <span> keeps the
                      accessible name (read via the button) without claiming
                      a heading level it does not visually earn. */}
                  <span className="bs-p-medium" style={{ margin: 0, color: C.ink, textAlign: 'left' }}>
                    {item.q}
                  </span>
                  <span className="bs-faq-icon" aria-hidden="true">
                    <svg viewBox="0 0 36 36" width="1em" height="1em">
                      <line x1="8" y1="18" x2="28" y2="18" stroke={C.ink} strokeWidth="2" />
                      <line className="bs-faq-icon-v" x1="18" y1="8" x2="18" y2="28" stroke={C.ink} strokeWidth="2" />
                    </svg>
                  </span>
                </button>
                <div className="bs-faq-item-bottom">
                  <div className="bs-faq-item-bottom-inner">
                    <p className="bs-p-small" style={{ margin: 0, paddingBottom: CLAMP.gap2, color: C.ink, maxWidth: '60ch' }}>
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default function Page() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    /* Em dash out, and the page declares Icelandic (the shared shell
       ships lang="en"). Audit 2026-09-02. */
    document.title = 'B&S Restaurant, Blönduós'
    const prevLang = document.documentElement.lang
    document.documentElement.lang = 'is'
    setThemeColor(C.paper)
    return () => {
      document.documentElement.lang = prevLang
    }
  }, [])

  /* D1 Lenis (teardown 10.2 item 1, verbatim): one instance for the whole
     page, driven from gsap.ticker with lagSmoothing(0), lenis.on('scroll',
     ScrollTrigger.update) so every section's ScrollTrigger above stays in
     sync with the damped scroll position. None of those sections mount
     their own Lenis (see each section's own comment) — this is the single
     top-level instance the whole page shares. Exposed via `lenisRef` so
     TopNav's D6 side-nav wipe can call lenis.stop()/start() on open/close
     (teardown D6: "lenis.stop() ... lenis.start() at the click").
     Skipped entirely on touch (memory: lenis-mobile-damage, HARD — Lenis on
     a touch device kills the iOS toolbar auto-hide, freezes nested
     scrollers and fights momentum scrolling). Every scrub above reads
     native scroll already, so touch devices lose only the desktop damping
     feel, nothing functional; TopNav's own body-scroll lock covers the side
     nav on touch instead. */
  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches
      if (isTouchDevice) return undefined

      const lenis = new Lenis({ lerp: 0.165, wheelMultiplier: 1.25, syncTouch: false })
      lenisRef.current = lenis
      lenis.on('scroll', ScrollTrigger.update)
      const tick = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)

      return () => {
        gsap.ticker.remove(tick)
        lenis.destroy()
        lenisRef.current = null
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <div style={{ background: C.paper, color: C.ink, fontFamily: FONT_FAMILY }}>
      <PageFonts />
      <PreviewChrome company={company} />

      <TopNav lenisRef={lenisRef} />

      <Hero />

      <Offering />

      <MenuSection />

      <FullBleedPhoto />

      <HouseFacts />

      <ImageGallery />

      <AboutTeaser />

      <Faq />

      {/*
        Work-list (home page only, teardown 4.A "HOME"). 4.1 (Hero), 4.2
        (Offering), 4.3 (About us teaser), 4.4 (Full-bleed photo), 4.5 (House
        facts), 4.6 (Image gallery, diptych) and 4.7 (FAQ) are done, all
        above. 4.8 Footer is already below as SiteFooter — the home page
        work-list is complete.
      */}

      <SiteFooter />

      <PreviewFooter company={company} />
    </div>
  )
}
