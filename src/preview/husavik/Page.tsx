import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Anchor as AnchorIcon,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Binoculars,
  Clock,
  Compass,
  Crosshair,
  Gift,
  Mail,
  MapPin,
  Menu as MenuIcon,
  Phone,
  ShieldCheck,
  Snowflake,
  Waves,
  X,
} from 'lucide-react'
import { companyEntry } from './data'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { CONTACT, DEPARTURES_NOTE, DEPARTURES_SAMPLE, DEPARTURES_SOURCE_YEAR, FAQ, IMAGES, JSON_LD, META, SIZES, SRCSET, fmtISK } from './data'
import type { ImageAsset } from './data'

const company = companyEntry

/* ── SJÓNAUKINN (the viewfinder) ───────────────────────────────────────────
   The client rejected the previous pass outright: "generic template design
   look, ugly generic and badly thought out and laid out entirely." That
   pass had a colour palette and no structural reference, so it produced the
   template default: centred eyebrow, big headline, two column split, card
   grid, coloured band, contact. This rebuild throws the whole shape away
   and is built strictly around one real, decorated reference: "21 Hours on
   the Moon" (21hrs.space, Awwwards SOTD), measured from its live DOM.

   WHY THIS REFERENCE FITS THIS CLIENT: Húsavík Adventures put people on a
   fast RIB and take them out on a cold bay to look for an animal. The whole
   activity is scanning open water through an instrument, in the cold,
   hoping. A viewfinder framing the page is honest to what they actually do,
   it is not decoration bolted on afterwards.

   TOKENS (locked, palette kept from the client's own material, ground and
   type system taken from the reference):
     GROUND   #000000  pure black, the reference's void
     INK      #FFF3EA  warm bone, primary text on black
     ACCENT   #BF244C  their real crimson, sampled off the Húsavík shopfront
                        sign, wordmark and front door (see IMAGES.shopfront).
                        Replaces the reference's tan instrument stroke.
     COLD     #8ED9F6  cold sea blue, sparing secondary or hover tint only
     MUT      rgba(255,243,234,0.6)  dimmed bone body text
     HAIR     rgba(255,243,234,0.34)  instrument chrome, hairlines, brackets
     HAIRDIM  rgba(255,243,234,0.14)  quiet section dividers
     SURFACE  #0D0906  warm near black, image letterbox tone while loading

   CONTRAST, computed by hand from the WCAG relative luminance formula
   (linearise each sRGB channel, L = 0.2126R + 0.7152G + 0.0722B, contrast
   = (L1+0.05)/(L2+0.05) with the lighter colour first). GROUND is pure
   black so L_ground = 0 and every ratio against it simplifies to
   (L_text+0.05)/0.05:
     INK on GROUND        19.26:1
     MUT on GROUND          6.85:1   (rgba(255,243,234,0.6) over solid black
                                       composites to sRGB approximately
                                       (153,146,140), comfortably clears the
                                       4.5:1 body text floor)
     COLD on GROUND        13.41:1
     WHITE on ACCENT         5.88:1   (button and badge text set on crimson)
     INK on ACCENT            5.39:1   (the alternative text on crimson colour)
     ACCENT on GROUND           3.57:1  FAILS the 4.5:1 body text floor, so
                                         accent is never a glyph colour on
                                         black, only a fill, a border or an
                                         icon tint
     MUT on ACCENT                 1.68:1  FAILS badly, so the dimmed body
                                            colour never appears inside the
                                            one crimson band either, that
                                            section always uses INK or white
   Rule enforced everywhere below: ACCENT is a fill, a border or an icon
   tint, never the colour of a text glyph, on any ground in this build.
   Every crimson surface carries white or ink text on top of it. ─────────── */

const GROUND = '#000000'
const INK = '#FFF3EA'
const ACCENT = '#BF244C'
const COLD = '#8ED9F6'
const MUT = 'rgba(255,243,234,0.6)'
const HAIR = 'rgba(255,243,234,0.34)'
const HAIRDIM = 'rgba(255,243,234,0.14)'
const SURFACE = '#0D0906'
const WHITE = '#FFFFFF'

/* Mono is the PRIMARY face across the whole page, the reference's own
   discipline (AkkuratMono at 300 for body, 500 for emphasis). We do not
   have a 300 file, GeistMono ships Regular (400) and Medium (500) only, so
   400 stands in for body and 500 for emphasis and headings. Alpino
   (geometric sans) is used exactly twice, the hero headline and the
   closing line, the reference's own "occasional display" allowance.
   Switzer appears once, the one paragraph in the crimson band that reads
   like a spoken line rather than an instrument readout. Every other string
   on the page, nav, labels, buttons, captions, table data, is mono. */
const MONO = "'Geist Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace"
const DISPLAY = "'Alpino Variable', 'Arial Narrow', system-ui, sans-serif"
const READING = "'Switzer Variable', system-ui, sans-serif"

const EASE = [0.32, 0.72, 0, 1] as const

/* Quiet film grain, SVG feTurbulence, no canvas and no WebGL. Built once at
   module load, encoded through encodeURIComponent rather than hand rolled
   percent escapes so there is nothing to get wrong in the string. */
const GRAIN_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240">' +
  '<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/></filter>' +
  '<rect width="100%" height="100%" filter="url(#n)"/></svg>'
const GRAIN_URI = `url("data:image/svg+xml,${encodeURIComponent(GRAIN_SVG)}")`

const CSS = `
  @font-face {
    font-family: 'Geist Mono';
    src: url('${import.meta.env.BASE_URL}fonts/geist-mono/GeistMono-Regular.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Geist Mono';
    src: url('${import.meta.env.BASE_URL}fonts/geist-mono/GeistMono-Medium.woff2') format('woff2');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Alpino Variable';
    src: url('${import.meta.env.BASE_URL}fonts/alpino/Alpino-Variable.woff2') format('woff2');
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Switzer Variable';
    src: url('${import.meta.env.BASE_URL}fonts/switzer/Switzer-Variable.woff2') format('woff2');
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
  }
  .hv-page ::selection { background: ${ACCENT}; color: #FFFFFF; }
  .hv-page a:focus-visible, .hv-page button:focus-visible {
    outline: 2px solid ${INK}; outline-offset: 3px; border-radius: 4px;
  }

  /* The page's one continuous ambient layer, standing in for the
     reference's two full viewport WebGL starfields. CSS/SVG only, transform
     and opacity only, killed entirely under reduced motion. */
  /* Phone: the inline console links measured 20-22px tall, which is a fine
     reading size and a poor thumb target. Lifted on small screens only, so the
     desktop instrument scale is untouched. The tiny mono labels stay small on
     purpose: this page is meant to read as an instrument. */
  @media (max-width: 640px) {
    .hv-page a, .hv-page button { min-height: 44px; }
    .hv-page a:not(:has(img)) { display: inline-flex; align-items: center; }
  }

  @keyframes husavik-grain-drift {
    0%, 100% { transform: translate3d(0,0,0); }
    50%      { transform: translate3d(-1.4%,-1%,0); }
  }
  .husavik-grain { animation: husavik-grain-drift 46s ease-in-out infinite; }

  @keyframes husavik-pulse {
    0%, 100% { opacity: 0.55; transform: scale(1); }
    50%      { opacity: 0.9; transform: scale(1.07); }
  }
  .husavik-pulse { animation: husavik-pulse 9s ease-in-out infinite; }

  /* Route plot waypoint markers idling like a boat at anchor. */
  @keyframes husavik-blip {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-3px); }
  }
  .husavik-blip { animation: husavik-blip 3.4s ease-in-out infinite; }

  @media (prefers-reduced-motion: reduce) {
    .husavik-grain, .husavik-pulse, .husavik-blip { animation: none !important; transform: none !important; }
  }
`

/* ── reveal primitives ─────────────────────────────────────────────────────
   Rise: text and content blocks, whileInView, transform+opacity only.
   RiseImg: photographs, MOUNT TRIGGERED (initial/animate, never
   whileInView), transform+opacity only, since a photo clipped or scaled to
   zero never satisfies its own IntersectionObserver and would ship
   invisible. Both collapse to a plain static div under reduced motion. ───*/
function Rise({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

function RiseImg({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20, scale: 1.015 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/** Four small corner ticks, the photo frame's own miniature echo of the
 *  page level viewfinder brackets. Pure decoration, aria hidden, the parent
 *  must be `relative`. */
function CornerTicks({ color = HAIR }: { color?: string }) {
  const base = 'absolute h-4 w-4'
  return (
    <span aria-hidden>
      <span className={`${base} -left-1.5 -top-1.5 border-l-2 border-t-2`} style={{ borderColor: color }} />
      <span className={`${base} -right-1.5 -top-1.5 border-r-2 border-t-2`} style={{ borderColor: color }} />
      <span className={`${base} -bottom-1.5 -left-1.5 border-b-2 border-l-2`} style={{ borderColor: color }} />
      <span className={`${base} -bottom-1.5 -right-1.5 border-b-2 border-r-2`} style={{ borderColor: color }} />
    </span>
  )
}

/** Device 6: photographs presented inside bracketed instrument frames, not
 *  bare rounded cards. `index` is a mono observation number in the running
 *  log ("ATHUGUN 0N"), the same number wherever an image repeats. `reticle`
 *  drops a faint stationary crosshair over the frame, used once, on the
 *  hero's own sighting, so it reads as a moment rather than a mannerism.
 *  These 2048x1536 source photos are not editorial grade, so a light
 *  desaturation unifies them into one moody, sonar like register instead of
 *  competing with the mono type for attention. */
function ScopeFrame({
  img,
  ratio = 'aspect-[4/3]',
  className = '',
  delay = 0,
  priority = false,
  index,
  reticle = false,
}: {
  img: ImageAsset
  ratio?: string
  className?: string
  delay?: number
  priority?: boolean
  index?: string
  reticle?: boolean
}) {
  return (
    <RiseImg delay={delay} className={className}>
      <div className="relative">
        <CornerTicks />
        <div className={`overflow-hidden ${ratio}`} style={{ background: SURFACE }}>
          <img
            src={img.src}
            srcSet={SRCSET[img.src]}
            sizes={SIZES}
            alt={img.alt}
            width={img.w}
            height={img.h}
            loading={priority ? undefined : 'lazy'}
            // @ts-expect-error React 18 DOM typings want the lowercase attribute
            fetchpriority={priority ? 'high' : undefined}
            className="h-full w-full object-cover"
            style={{ filter: 'grayscale(0.14) saturate(0.92) contrast(1.04)' }}
          />
          {reticle && (
            <span
              aria-hidden
              className="husavik-pulse absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ animationDuration: '8s' }}
            >
              <Crosshair size={38} strokeWidth={1} style={{ color: INK }} />
            </span>
          )}
        </div>
        {index && (
          <span
            className="absolute bottom-2 left-2 px-1.5 py-0.5 text-[0.62rem] uppercase tracking-[0.14em]"
            style={{ fontFamily: MONO, fontWeight: 500, color: INK, background: 'rgba(0,0,0,0.6)' }}
          >
            {index}
          </span>
        )}
      </div>
    </RiseImg>
  )
}

/** tone="onAccent" is for text sitting directly on the crimson fill: see
 *  the contrast table above, the dimmed MUT colour fails badly there
 *  (1.68:1), so onAccent renders full white instead. */
function Eyebrow({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'onAccent' }) {
  return (
    <span
      className="inline-flex items-center gap-2 text-[0.78rem] uppercase tracking-[0.22em]"
      style={{ fontFamily: MONO, color: tone === 'onAccent' ? WHITE : MUT, fontWeight: 500 }}
    >
      {children}
    </span>
  )
}

/** Device 4: the console slab button. A bracketed rectangular button, mono
 *  caps inside it, a subtle vertical stripe texture behind the label, one
 *  corner cut with an asymmetric radius that echoes the viewfinder
 *  brackets. `onAccent` swaps the palette for use inside the one crimson
 *  band, where the dimmed body colour is never safe (see contrast table). */
function ConsoleButton({
  children,
  onClick,
  href,
  variant = 'solid',
  onAccent = false,
  size = 'md',
}: {
  children: ReactNode
  onClick?: () => void
  href?: string
  variant?: 'solid' | 'outline'
  onAccent?: boolean
  size?: 'md' | 'sm'
}) {
  const solidBg = onAccent ? WHITE : ACCENT
  const solidText = onAccent ? ACCENT : WHITE
  const outlineBorder = onAccent ? 'rgba(255,255,255,0.55)' : HAIR
  const outlineText = onAccent ? WHITE : INK
  const stripeColor = variant === 'solid' ? 'rgba(0,0,0,0.4)' : onAccent ? 'rgba(255,255,255,0.4)' : 'rgba(255,243,234,0.4)'

  const style =
    variant === 'solid'
      ? { borderColor: solidBg, background: solidBg, color: solidText, fontFamily: MONO, borderRadius: '10px 0 10px 0' }
      : { borderColor: outlineBorder, background: 'transparent', color: outlineText, fontFamily: MONO, borderRadius: '10px 0 10px 0' }

  const cls = `group relative inline-flex items-center gap-3 overflow-hidden border-2 font-medium uppercase tracking-[0.14em] ${
    size === 'sm' ? 'px-4 py-2 text-[0.72rem]' : 'px-6 py-3.5 text-[0.82rem]'
  }`

  const content = (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: `repeating-linear-gradient(90deg, ${stripeColor} 0px, ${stripeColor} 1px, transparent 1px, transparent 5px)`, opacity: 0.5 }}
      />
      <span className="relative z-10 inline-flex items-center gap-3">{children}</span>
    </>
  )

  if (href) {
    return (
      <a href={href} className={cls} style={style}>
        {content}
      </a>
    )
  }
  return (
    <button onClick={onClick} className={cls} style={style}>
      {content}
    </button>
  )
}

/** Device 3: circular outlined controls, 26x26px, 2px stroke at
 *  rgba(255,243,234,0.6), border-radius 50px, exactly the reference's
 *  measured values. The visible circle stays 26px, the hit target is
 *  widened to a comfortable ~44px with transparent padding so the small
 *  instrument look never costs tap accuracy. */
function ScopeControl({
  href,
  onClick,
  label,
  children,
}: {
  href?: string
  onClick?: () => void
  label: string
  children: ReactNode
}) {
  const inner = (
    <span
      className="flex items-center justify-center rounded-full"
      style={{ height: 26, width: 26, border: '2px solid rgba(255,243,234,0.6)', color: INK }}
    >
      {children}
    </span>
  )
  const cls = 'flex items-center justify-center p-[9px] -m-[9px]'
  if (href) {
    return (
      <a href={href} aria-label={label} className={cls}>
        {inner}
      </a>
    )
  }
  return (
    <button onClick={onClick} aria-label={label} className={cls}>
      {inner}
    </button>
  )
}

/* Their real wordmark sets HÚSAVÍK large with ADVENTURES letter spaced
   beneath it. Reproduced typographically in mono, uppercase applied only
   through CSS text-transform on natural case source text (accessible: a
   screen reader announces the words normally, never letter by letter), see
   LOGO_TODO in data.ts for why the real circular mark is not hand drawn
   here. */
function Wordmark({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  const big = size === 'lg'
  return (
    <span className="inline-flex flex-col leading-none" style={{ fontFamily: MONO }}>
      <span
        className={`uppercase ${big ? 'text-[2rem] md:text-[3.2rem]' : 'text-[0.95rem] md:text-[1.05rem]'}`}
        style={{ fontWeight: 500, color: INK, letterSpacing: big ? '0.01em' : '0.04em' }}
      >
        Húsavík
      </span>
      <span
        className={`uppercase ${big ? 'mt-2 text-[0.8rem] md:text-[0.92rem]' : 'mt-0.5 text-[0.48rem] md:text-[0.54rem]'}`}
        style={{ fontFamily: MONO, fontWeight: 400, color: COLD, letterSpacing: big ? '0.36em' : '0.3em' }}
      >
        Adventures
      </span>
    </span>
  )
}

/* ── Device 1: fixed viewfinder corner brackets, page level chrome, always
   above the content. Measured from the reference: 66x66px, border 4px
   solid, border-radius "10px 0 0" (top-left 10px, every other corner 0,
   per the CSS 3-value shorthand), one shared shape rotated 0/90/180/270deg
   into each corner so the single rounded corner always points toward the
   true corner of the viewport. Crimson here, the client's own colour
   standing in for the reference's tan stroke. Pointer-events none: this is
   read-only instrument glass, it must never block a click underneath it. */
function ViewfinderChrome() {
  const corners: { style: { top?: number; left?: number; right?: number; bottom?: number }; rotate: number }[] = [
    { style: { top: 12, left: 12 }, rotate: 0 },
    { style: { top: 12, right: 12 }, rotate: 90 },
    { style: { bottom: 12, right: 12 }, rotate: 180 },
    { style: { bottom: 12, left: 12 }, rotate: 270 },
  ]
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      {corners.map((c, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            ...c.style,
            height: 66,
            width: 66,
            border: `4px solid ${ACCENT}`,
            borderRadius: '10px 0 0',
            transform: `rotate(${c.rotate}deg)`,
            /* The chrome is fixed and the page scrolls a crimson band under it,
               so a crimson bracket briefly vanishes into a crimson ground. A
               hairline dark outline on both edges of the stroke keeps the
               bracket legible on every section without changing its colour.
               Cheaper and more reliable than driving it off scroll position. */
            boxShadow: '0 0 0 1px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(0,0,0,0.55)',
          }}
        />
      ))}
      <span
        /* sat at top-[30px] and ran straight through the wordmark; dropped below
           the nav band so the instrument chrome reads as chrome rather than as a
           collision */
        className="absolute left-[92px] top-[112px] hidden text-[0.6rem] uppercase tracking-[0.2em] sm:block"
        style={{ fontFamily: MONO, color: HAIR }}
      >
        N 66°02&apos; V 17°20&apos;
      </span>
      <span
        className="absolute bottom-[30px] right-[92px] hidden text-[0.6rem] uppercase tracking-[0.2em] sm:block"
        style={{ fontFamily: MONO, color: HAIR }}
      >
        Skjálfandaflói
      </span>
    </div>
  )
}

/* ── Device 5: the quiet full-bleed atmosphere behind every section,
   standing in for the reference's two full viewport WebGL starfields
   without WebGL, canvas or a shader. Grain drifts, two very soft blooms
   breathe. Everything here is transform and opacity only, and the whole
   layer is inert under reduced motion via the CSS classes it uses. Fixed
   and first in the DOM, so the page's own solid black background sits
   beneath it and every section above it stays transparent, letting this
   layer read through continuously rather than as an alternating band. */
function Atmosphere() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden" style={{ background: GROUND }}>
      <div
        className="husavik-grain absolute -inset-[15%]"
        style={{ backgroundImage: GRAIN_URI, backgroundSize: '240px 240px', opacity: 0.05 }}
      />
      <div
        className="husavik-pulse absolute -left-[10%] -top-[12%] h-[55vh] w-[55vh] rounded-full"
        style={{ background: `radial-gradient(circle, ${ACCENT}2E 0%, transparent 68%)`, filter: 'blur(70px)', animationDuration: '13s' }}
      />
      <div
        className="husavik-pulse absolute -bottom-[8%] -right-[8%] h-[46vh] w-[46vh] rounded-full"
        style={{ background: `radial-gradient(circle, ${COLD}22 0%, transparent 68%)`, filter: 'blur(80px)', animationDuration: '17s', animationDirection: 'reverse' }}
      />
    </div>
  )
}

/* ── mobile menu overlay, rendered as a SIBLING of <Nav>, never nested
      inside it (a backdrop-filtered header becomes the containing block
      and the overlay would collapse to nothing). Escape closes, body
      scroll locked while open. ─────────────────────────────────────────*/
const NAV_LINKS = [
  { id: 'val', label: 'Ferðirnar' },
  { id: 'floinn', label: 'Flóinn' },
  { id: 'buggy', label: 'Buggý' },
  { id: 'brottfarir', label: 'Brottfarir' },
  { id: 'bokun', label: 'Bókun' },
]

function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function MobileOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  const pick = (id: string) => {
    onClose()
    window.setTimeout(() => goTo(id), reduce ? 0 : 120)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Valmynd"
          lang="is"
          className="fixed inset-0 z-[80] flex flex-col md:hidden"
          style={{ background: GROUND, fontFamily: MONO }}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: EASE }}
        >
          <div className="flex items-center justify-between px-6 pt-6">
            <Wordmark size="sm" />
            <ScopeControl onClick={onClose} label="Loka valmynd">
              <X size={13} aria-hidden />
            </ScopeControl>
          </div>

          <nav className="mt-10 flex flex-1 flex-col justify-center gap-1 px-6">
            {NAV_LINKS.map((l, i) => (
              <motion.button
                key={l.id}
                onClick={() => pick(l.id)}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: reduce ? 0 : 0.06 * i, ease: EASE }}
                className="border-b py-4 text-left uppercase"
                style={{ fontFamily: MONO, fontWeight: 500, fontSize: '1.8rem', color: INK, borderColor: HAIRDIM }}
              >
                {l.label}
              </motion.button>
            ))}
          </nav>

          <div className="flex flex-col gap-3 px-6 pb-10">
            <ConsoleButton href={CONTACT.phoneHref}>
              <Phone size={15} aria-hidden />
              Hringja í {CONTACT.phoneDisplay}
            </ConsoleButton>
            <ConsoleButton href={`mailto:${CONTACT.email}`} variant="outline">
              <Mail size={14} aria-hidden />
              {CONTACT.email}
            </ConsoleButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Nav({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (v: boolean) => void }) {
  return (
    <header
      className="fixed inset-x-0 top-0 z-40 border-b"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderColor: HAIRDIM }}
    >
      <div className="mx-auto flex h-16 max-w-[1360px] items-center justify-between px-16 md:h-20 md:px-24">
        <button onClick={() => goTo('efst')} aria-label="Húsavík Adventures, efst á síðu">
          <Wordmark size="sm" />
        </button>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => goTo(l.id)}
              className="uppercase tracking-[0.14em] transition-colors hover:text-[#8ED9F6]"
              style={{ fontFamily: MONO, fontWeight: 500, color: MUT, fontSize: '0.76rem' }}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3.5">
          <span className="hidden sm:block">
            <ConsoleButton href={CONTACT.phoneHref} size="sm">
              <Phone size={12} aria-hidden />
              {CONTACT.phoneDisplay}
            </ConsoleButton>
          </span>
          <span className="hidden sm:block">
            <ScopeControl href={`mailto:${CONTACT.email}`} label={`Senda tölvupóst á ${CONTACT.email}`}>
              <Mail size={12} aria-hidden />
            </ScopeControl>
          </span>
          <span className="md:hidden">
            <ScopeControl onClick={() => setMenuOpen(!menuOpen)} label={menuOpen ? 'Loka valmynd' : 'Opna valmynd'}>
              <motion.span animate={{ rotate: menuOpen ? 90 : 0 }} transition={{ duration: 0.3, ease: EASE }} className="flex">
                {menuOpen ? <X size={13} aria-hidden /> : <MenuIcon size={13} aria-hidden />}
              </motion.span>
            </ScopeControl>
          </span>
        </div>
      </div>
    </header>
  )
}

/* ── Leiðarplott: the literal out and back route across the bay, the
   page's other signature move, walked twice (leaving after Targets,
   returning before Contact). Waypoints are named by place, not by time, no
   schedule is implied: HÖFNIN (the harbour), Á FLÓANUM (out on the bay),
   HEIM (home), the inherent shape of a two hour boat trip, nothing
   invented. The moving marker animates x/y on an SVG <g>, which has no
   native positional attribute, so Framer Motion applies it as a transform,
   never a layout property and never a scroll listener. ───────────────────*/
function RoutePlot({ reverse = false, label }: { reverse?: boolean; label: string }) {
  const reduce = useReducedMotion()
  const wp: [number, number][] = reverse
    ? [[1180, 22], [860, 52], [560, 26], [260, 56], [40, 24]]
    : [[40, 24], [260, 56], [560, 26], [860, 52], [1180, 22]]
  const xs = wp.map((p) => p[0])
  const ys = wp.map((p) => p[1])
  const d = `M${wp.map((p) => p.join(',')).join(' L')}`
  const start = wp[0]
  const end = wp[wp.length - 1]
  const waypoints = reverse ? ['Á flóanum', 'Heim'] : ['Höfnin', 'Á flóanum']

  return (
    <div className="relative overflow-hidden py-12 md:py-16">
      <Rise className="mx-auto max-w-[1360px] px-5 md:px-8">
        <span className="flex items-center gap-2" style={{ fontFamily: MONO, color: MUT }}>
          <Compass size={13} aria-hidden style={{ color: COLD }} />
          <span className="text-[0.74rem] uppercase tracking-[0.2em]">{label}</span>
        </span>
        <svg viewBox="0 0 1220 80" className="mt-4 h-14 w-full md:h-16" preserveAspectRatio="none" role="presentation" aria-hidden="true">
          <path d={d} fill="none" stroke={HAIR} strokeWidth={1.4} strokeDasharray="1 9" strokeLinecap="round" />
          <circle className="husavik-blip" cx={start[0]} cy={start[1]} r={4} fill={COLD} />
          <circle className="husavik-blip" cx={end[0]} cy={end[1]} r={4} fill={COLD} style={{ animationDelay: '0.6s' }} />
          {reduce ? (
            <g transform={`translate(${end[0]},${end[1]})`}>
              <circle r={6} fill={ACCENT} />
            </g>
          ) : (
            <motion.g
              initial={{ opacity: 0, x: xs[0], y: ys[0] }}
              whileInView={{ opacity: 1, x: xs, y: ys }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 2.4, delay: 0.2, ease: EASE }}
            >
              <circle r={9} fill="none" stroke={ACCENT} strokeOpacity={0.35} strokeWidth={1.5} />
              <circle r={5.5} fill={ACCENT} />
            </motion.g>
          )}
        </svg>
        <div className="mt-2 flex justify-between text-[0.62rem] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, color: HAIR }}>
          <span>{waypoints[0]}</span>
          <span>{waypoints[1]}</span>
        </div>
      </Rise>
    </div>
  )
}

/* ── Hero: the reference's own instruction is explicit, never stretch a
   thin snapshot across a full bleed band, treat it as a sighting caught
   through the instrument instead. So there is no full bleed hero photo
   here: the atmosphere behind everything IS the background, the fluke
   photo sits inside a contained ScopeFrame beside the headline, and the
   whole thing reads as a log entry rather than a travel brochure banner. */
function Hero() {
  const reduce = useReducedMotion()
  return (
    <section id="efst" className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden pb-16 pt-32 md:pt-36">
      <div className="mx-auto grid w-full max-w-[1360px] grid-cols-1 items-center gap-14 px-5 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <div>
          <Rise>
            <span className="flex items-center gap-2.5" style={{ fontFamily: MONO, color: MUT }}>
              <Binoculars size={14} aria-hidden style={{ color: ACCENT }} />
              <span className="text-[0.78rem] uppercase tracking-[0.22em]">Sjónauki á Skjálfandaflóa</span>
            </span>
          </Rise>

          <h1
            aria-label="Út á kaldan Skjálfandaflóa. Þar sem hvalirnir ráða ríkjum."
            className="mt-5 max-w-xl leading-[0.98]"
            style={{ fontFamily: DISPLAY, color: INK, fontSize: 'clamp(2.5rem,5.6vw,4.4rem)' }}
          >
            {reduce ? (
              <>
                <span className="block" style={{ fontWeight: 340 }}>Út á kaldan Skjálfandaflóa.</span>
                <span className="block" style={{ fontWeight: 860 }}>Þar sem hvalirnir ráða ríkjum.</span>
              </>
            ) : (
              <>
                <motion.span
                  className="block"
                  style={{ fontWeight: 340 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.85, delay: 0.12, ease: EASE }}
                >
                  Út á kaldan Skjálfandaflóa.
                </motion.span>
                <motion.span
                  className="block"
                  style={{ fontWeight: 860 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.85, delay: 0.28, ease: EASE }}
                >
                  Þar sem hvalirnir ráða ríkjum.
                </motion.span>
              </>
            )}
          </h1>

          <Rise delay={0.2}>
            <p className="mt-6 max-w-md text-[1rem] leading-relaxed" style={{ color: MUT, fontFamily: MONO }}>
              Tvenns konar ævintýri, sama áhöfnin. Hraðskreiður RIB bátur út á Skjálfandaflóa í leit að hvölum og lundum, og buggýferðir um landið, sumar sem vetur.
            </p>
          </Rise>

          <Rise delay={0.3}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ConsoleButton onClick={() => goTo('val')}>
                Skoða ferðirnar
                <ArrowDown size={14} aria-hidden />
              </ConsoleButton>
              <ScopeControl href={CONTACT.phoneHref} label={`Hringja í ${CONTACT.phoneDisplay}`}>
                <Phone size={12} aria-hidden />
              </ScopeControl>
              <span style={{ fontFamily: MONO, color: MUT }} className="text-[0.85rem]">
                {CONTACT.phoneDisplay}
              </span>
            </div>
          </Rise>

          <Rise delay={0.38}>
            <p className="mt-8 text-[0.72rem] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: MUT }}>
              Óháð fyrirtæki á Húsavík · Ekki keðja
            </p>
          </Rise>
        </div>

        <div>
          <ScopeFrame img={IMAGES.fluke} ratio="aspect-[4/3]" priority index="Athugun 01 · Hnúfubakur" reticle />
          <RiseImg delay={0.4} className="mt-3">
            <p className="max-w-sm text-[0.78rem]" style={{ color: MUT, fontFamily: MONO }}>
              {IMAGES.fluke.alt}
            </p>
          </RiseImg>
        </div>
      </div>
    </section>
  )
}

/* ── Val: the two product lines, presented as two logged observations
   rather than a generic feature card grid. ───────────────────────────────*/
function Targets() {
  return (
    <section id="val" className="mx-auto max-w-[1360px] px-5 py-24 md:px-8 md:py-32">
      <Rise>
        <h2 className="max-w-xl uppercase leading-[1.05]" style={{ fontFamily: MONO, fontWeight: 500, color: INK, fontSize: 'clamp(2rem,4.2vw,3.2rem)' }}>
          Veldu ævintýrið þitt.
        </h2>
      </Rise>

      <div className="mt-14 grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-10">
        <div>
          <ScopeFrame img={IMAGES.hiVisGuests} ratio="aspect-[4/3]" index="Athugun 02 · Hvalir" />
          <Rise delay={0.1} className="mt-6">
            <Eyebrow>
              <AnchorIcon size={12} aria-hidden />
              Sjórinn
            </Eyebrow>
            <h3 className="mt-2 text-[1.6rem] leading-tight" style={{ fontFamily: MONO, fontWeight: 500, color: INK }}>
              Hvala- og lundaskoðun
            </h3>
            <p className="mt-3 max-w-md text-[1rem] leading-relaxed" style={{ color: MUT, fontFamily: MONO }}>
              Hraðskreiður RIB bátur siglir út á Skjálfandaflóa í tveggja tíma ferð frá höfninni. Öllum er fenginn hlýr flotgalli áður en lagt er af stað.
            </p>
            <button
              onClick={() => goTo('floinn')}
              className="mt-5 inline-flex items-center gap-2 text-[0.9rem] font-medium uppercase tracking-[0.08em] underline-offset-4 hover:underline"
              style={{ color: INK, fontFamily: MONO }}
            >
              Skoða flóann
              <ArrowRight size={15} aria-hidden style={{ color: ACCENT }} />
            </button>
          </Rise>
        </div>

        <div>
          <ScopeFrame img={IMAGES.buggyAction} ratio="aspect-[4/3]" delay={0.08} index="Athugun 03 · Buggý" />
          <Rise delay={0.18} className="mt-6">
            <Eyebrow>
              <Compass size={12} aria-hidden />
              Landið
            </Eyebrow>
            <h3 className="mt-2 text-[1.6rem] leading-tight" style={{ fontFamily: MONO, fontWeight: 500, color: INK }}>
              Buggýferðir
            </h3>
            <p className="mt-3 max-w-md text-[1rem] leading-relaxed" style={{ color: MUT, fontFamily: MONO }}>
              Akstur um möl á sumrin, snjó á veturna. Ferðir allan ársins hring, óháð árstíð.
            </p>
            <button
              onClick={() => goTo('buggy')}
              className="mt-5 inline-flex items-center gap-2 text-[0.9rem] font-medium uppercase tracking-[0.08em] underline-offset-4 hover:underline"
              style={{ color: INK, fontFamily: MONO }}
            >
              Skoða buggýferðirnar
              <ArrowRight size={15} aria-hidden style={{ color: ACCENT }} />
            </button>
          </Rise>
        </div>
      </div>
    </section>
  )
}

/* ── Flóinn: the bay and what lives in it ─────────────────────────────────*/
function Bay() {
  return (
    <section id="floinn" className="border-t" style={{ borderColor: HAIRDIM }}>
      <div className="mx-auto max-w-[1360px] px-5 py-24 md:px-8 md:py-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Rise>
              <Eyebrow>
                <Waves size={12} aria-hidden />
                Flóinn
              </Eyebrow>
            </Rise>
            <Rise delay={0.08}>
              <h2 className="mt-4 uppercase leading-[1.05]" style={{ fontFamily: MONO, fontWeight: 500, color: INK, fontSize: 'clamp(1.9rem,3.8vw,2.9rem)' }}>
                Skjálfandaflói
              </h2>
            </Rise>
            <Rise delay={0.16}>
              <p className="mt-6 max-w-md text-[1.02rem] leading-relaxed" style={{ color: MUT, fontFamily: MONO }}>
                Hnúfubakar halda til í Skjálfandaflóa, og lundar verpa í björgunum í kring. RIB báturinn kemst hratt út á flóann, með áhöfn sem þekkir hverja vík.
              </p>
            </Rise>
            <Rise delay={0.24}>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 border px-4 py-2 text-[0.8rem] uppercase tracking-[0.06em]" style={{ borderColor: HAIRDIM, color: INK, fontFamily: MONO }}>
                  <Waves size={13} aria-hidden style={{ color: COLD }} />
                  Hnúfubakar
                </span>
                <span className="inline-flex items-center gap-2 border px-4 py-2 text-[0.8rem] uppercase tracking-[0.06em]" style={{ borderColor: HAIRDIM, color: INK, fontFamily: MONO }}>
                  <Waves size={13} aria-hidden style={{ color: COLD }} />
                  Lundar
                </span>
              </div>
            </Rise>
          </div>

          <ScopeFrame img={IMAGES.bayAerial} ratio="aspect-[4/3]" delay={0.1} index="Athugun 04 · Flóinn" />
        </div>
      </div>
    </section>
  )
}

/* ── Báturinn og flotgallarnir: why you're warm and safe. ─────────────────*/
function Safety() {
  const points = [
    'Flotgalli fyrir hvern og einn, innifalinn í ferðinni',
    'Áhöfn sem þekkir flóann og veðrið eins og bakvasann sinn',
    'Öryggið ræður alltaf ferðinni, ekki tímaáætlunin',
  ]
  return (
    <section id="batur" className="border-t" style={{ borderColor: HAIRDIM }}>
      <div className="mx-auto max-w-[1360px] px-5 py-24 md:px-8 md:py-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <ScopeFrame img={IMAGES.crewRib} ratio="aspect-[3/4]" className="mx-auto max-w-xs lg:mx-0" index="Athugun 05 · Áhöfnin" />

          <div>
            <Rise>
              <Eyebrow>
                <ShieldCheck size={12} aria-hidden />
                Báturinn og flotgallarnir
              </Eyebrow>
            </Rise>
            <Rise delay={0.08}>
              <h2 className="mt-4 uppercase leading-[1.05]" style={{ fontFamily: MONO, fontWeight: 500, color: INK, fontSize: 'clamp(1.9rem,3.8vw,2.9rem)' }}>
                Af hverju ykkur er alltaf hlýtt
              </h2>
            </Rise>
            <Rise delay={0.16}>
              <p className="mt-6 max-w-lg text-[1.02rem] leading-relaxed" style={{ color: MUT, fontFamily: MONO }}>
                RIB báturinn er hraðskreiður og opinn, svo allir sem um borð fara klæðast hlýjum flotgalla frá toppi til táar, sama hvernig viðrar.
              </p>
            </Rise>
            <ul className="mt-8 flex flex-col gap-4">
              {points.map((p, i) => (
                <Rise key={p} delay={0.2 + i * 0.08}>
                  <li className="flex items-start gap-3">
                    <ShieldCheck size={18} className="mt-0.5 shrink-0" style={{ color: COLD }} aria-hidden />
                    <span className="text-[0.98rem] leading-relaxed" style={{ color: MUT, fontFamily: MONO }}>
                      {p}
                    </span>
                  </li>
                </Rise>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Loforðið: the one full bleed crimson band, the page's one loud
   moment. FAQ answers are framed as entries in a log rather than a buried
   accordion, since these are the client's own three, real, currently
   published questions. Every text glyph inside this section is INK or
   WHITE, never MUT: see the contrast table at the top of the file, the
   dimmed body colour fails badly (1.68:1) against this exact crimson. ───*/
function PromiseBand() {
  return (
    <section id="loford" className="relative overflow-hidden" style={{ background: ACCENT }}>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.5) 0px, rgba(0,0,0,0.5) 1px, transparent 1px, transparent 8px)', opacity: 0.05 }}
      />
      <div className="relative mx-auto max-w-[1360px] px-5 py-24 md:px-8 md:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-16">
          <div>
            <Rise>
              <Eyebrow tone="onAccent">Loforðið</Eyebrow>
            </Rise>
            <Rise delay={0.08}>
              <h2
                className="mt-4 uppercase leading-[1.08]"
                style={{ fontFamily: MONO, fontWeight: 500, color: WHITE, fontSize: 'clamp(1.9rem,4vw,3rem)', letterSpacing: '-0.01em' }}
              >
                Við lofum ekki hval.
                <br />
                Við lofum að leita af alvöru.
              </h2>
            </Rise>
            {/* The one place Switzer appears: a proportional, readable pause
                inside the instrument voice, for the one line that reads
                like something a person says rather than a readout. */}
            <Rise delay={0.16}>
              <p className="mt-6 max-w-lg text-[1.05rem] leading-relaxed" style={{ color: WHITE, fontFamily: READING }}>
                Enginn getur lofað villtu dýri, og enginn ætti að reyna. Það sem áhöfnin lofar er að þekkja flóann, leita af alvöru og setja öryggið alltaf í fyrsta sæti.
              </p>
            </Rise>
          </div>

          <ScopeFrame img={IMAGES.hiVisGuests} ratio="aspect-[3/4]" className="max-w-xs md:mx-0" delay={0.2} />
        </div>

        <div className="mt-16 border-t pt-16 md:mt-24 md:pt-20" style={{ borderColor: 'rgba(255,255,255,0.32)' }}>
          <Rise>
            <span className="text-[0.72rem] uppercase tracking-[0.22em]" style={{ fontFamily: MONO, color: 'rgba(255,255,255,0.78)' }}>
              Sendingar úr brúnni
            </span>
          </Rise>
          <Rise delay={0.06}>
            <h3 className="mt-3 max-w-xl uppercase leading-[1.1]" style={{ fontFamily: MONO, fontWeight: 500, color: WHITE, fontSize: 'clamp(1.5rem,2.8vw,2.1rem)' }}>
              Spurningarnar sem allir spyrja
            </h3>
          </Rise>

          <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {FAQ.map((item, i) => (
              <Rise key={item.q} delay={0.1 + i * 0.08}>
                <p className="text-[0.68rem] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: 'rgba(255,255,255,0.72)' }}>
                  {`Færsla 0${i + 1}`}
                </p>
                <p className="mt-2 text-[1.1rem] leading-tight" style={{ fontFamily: MONO, fontWeight: 500, color: WHITE }}>
                  {item.q}
                </p>
                <p className="mt-3 text-[0.96rem] leading-relaxed" style={{ color: WHITE, fontFamily: MONO }}>
                  {item.a}
                </p>
              </Rise>
            ))}
          </div>

          <Rise delay={0.3} className="mt-12">
            <ConsoleButton href={CONTACT.phoneHref} variant="outline" onAccent>
              <Phone size={14} aria-hidden />
              Fleiri spurningar? {CONTACT.phoneDisplay}
            </ConsoleButton>
          </Rise>
        </div>
      </div>
    </section>
  )
}

/* ── Buggýferðir ───────────────────────────────────────────────────────── */
function Buggy() {
  const shots: { img: ImageAsset; index: string }[] = [
    { img: IMAGES.buggyAction, index: 'Athugun 03' },
    { img: IMAGES.buggyTwoWinter, index: 'Athugun 06' },
    { img: IMAGES.winterLandscape, index: 'Athugun 07' },
    { img: IMAGES.buggyBotnsvatn, index: 'Athugun 08' },
  ]
  return (
    <section id="buggy" className="border-t" style={{ borderColor: HAIRDIM }}>
      <div className="mx-auto max-w-[1360px] px-5 py-24 md:px-8 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Rise>
              <Eyebrow>
                <Snowflake size={12} aria-hidden />
                Buggýferðir
              </Eyebrow>
            </Rise>
            <Rise delay={0.08}>
              <h2 className="mt-4 uppercase leading-[1.05]" style={{ fontFamily: MONO, fontWeight: 500, color: INK, fontSize: 'clamp(1.9rem,3.8vw,2.9rem)' }}>
                Sama tækið, allt árið
              </h2>
            </Rise>
          </div>
          <Rise delay={0.14} className="max-w-sm">
            <p className="text-[1rem] leading-relaxed" style={{ color: MUT, fontFamily: MONO }}>
              Buggýin fara þangað sem venjulegir bílar komast ekki, um landið í kringum Húsavík. Möl á sumrin, snjór á veturna, sama tækið allan hringinn.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 border px-4 py-2 text-[0.8rem] uppercase tracking-[0.06em]" style={{ borderColor: HAIRDIM, color: INK, fontFamily: MONO }}>
                <Snowflake size={13} aria-hidden style={{ color: COLD }} />
                Allan ársins hring
              </span>
            </div>
          </Rise>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {shots.map((s, i) => (
            <ScopeFrame key={s.img.src} img={s.img} ratio="aspect-[3/4]" delay={0.08 * i} index={s.index} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Brottfarir: departures/price sample module, restyled as a HUD
      readout, clearly and permanently marked as a 2020 sample. Never
      presented as a live price, see DEPARTURES_NOTE in data.ts. ─────────*/
function Departures() {
  return (
    <section id="brottfarir" className="border-t" style={{ borderColor: HAIRDIM }}>
      <div className="mx-auto max-w-[1360px] px-5 py-24 md:px-8 md:py-32">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <Rise>
              <Eyebrow>
                <Clock size={12} aria-hidden />
                Brottfarir
              </Eyebrow>
            </Rise>
            <Rise delay={0.08}>
              <h2 className="mt-4 uppercase leading-[1.05]" style={{ fontFamily: MONO, fontWeight: 500, color: INK, fontSize: 'clamp(1.9rem,3.8vw,2.9rem)' }}>
                Dæmi um verðskrá
              </h2>
            </Rise>
          </div>
          <Rise delay={0.12}>
            <span
              className="inline-flex items-center gap-2 px-4 py-2 text-[0.7rem] font-medium uppercase tracking-[0.1em]"
              style={{ background: ACCENT, color: WHITE, fontFamily: MONO }}
            >
              <Clock size={13} aria-hidden />
              Sýnishorn · verð frá {DEPARTURES_SOURCE_YEAR}, óstaðfest
            </span>
          </Rise>
        </div>

        <Rise delay={0.18} className="mt-10">
          <div className="border" style={{ borderColor: HAIR }}>
            {DEPARTURES_SAMPLE.map((row, i) => (
              <div
                key={row.season}
                className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-[1.2fr_1fr_0.8fr_0.8fr] sm:items-center md:p-8"
                style={i > 0 ? { borderTop: `1px solid ${HAIRDIM}` } : undefined}
              >
                <div>
                  <p className="text-[1.02rem] uppercase" style={{ fontFamily: MONO, fontWeight: 500, color: INK }}>
                    {row.season}
                  </p>
                  <p className="mt-1 text-[0.85rem]" style={{ color: MUT, fontFamily: MONO }}>
                    {row.frequency}
                  </p>
                </div>
                <div>
                  <p className="text-[0.72rem] uppercase tracking-[0.1em]" style={{ color: MUT, fontFamily: MONO }}>
                    Fullorðnir
                  </p>
                  <p className="mt-1 text-[1.15rem]" style={{ fontFamily: MONO, fontWeight: 500, color: INK }}>
                    {fmtISK(row.priceAdultNum)}
                  </p>
                </div>
                <div>
                  <p className="text-[0.72rem] uppercase tracking-[0.1em]" style={{ color: MUT, fontFamily: MONO }}>
                    {row.childAgeNote}
                  </p>
                  <p className="mt-1 text-[1.15rem]" style={{ fontFamily: MONO, fontWeight: 500, color: INK }}>
                    {fmtISK(row.priceChildNum)}
                  </p>
                </div>
                <div className="sm:text-right">
                  <button
                    onClick={() => goTo('bokun')}
                    className="inline-flex items-center gap-1.5 text-[0.85rem] font-medium uppercase tracking-[0.06em] underline-offset-4 hover:underline"
                    style={{ color: INK, fontFamily: MONO }}
                  >
                    Fá staðfest verð
                    <ArrowRight size={14} aria-hidden style={{ color: ACCENT }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Rise>

        <Rise delay={0.26}>
          <p className="mt-6 max-w-2xl text-[0.85rem] leading-relaxed" style={{ color: MUT, fontFamily: MONO }}>
            {DEPARTURES_NOTE}
          </p>
        </Rise>
      </div>
    </section>
  )
}

/* ── Bókun: the handoff, designed as a deliberate instrument panel, not
      bolted on. TODO(owner): real Bókun embed code/URL, see BOOKING_TODO in
      data.ts. Until it arrives the CTA opens a prefilled email as the
      honest interim path, nothing here fabricates a bokun.io link. ───────*/
function Booking() {
  return (
    <section id="bokun" className="border-t" style={{ borderColor: HAIRDIM }}>
      <div className="mx-auto max-w-[1360px] px-5 py-24 md:px-8 md:py-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Rise>
              <Eyebrow>
                <ArrowUpRight size={12} aria-hidden />
                Bókun
              </Eyebrow>
            </Rise>
            <Rise delay={0.08}>
              <h2 className="mt-4 uppercase leading-[1.05]" style={{ fontFamily: MONO, fontWeight: 500, color: INK, fontSize: 'clamp(1.9rem,3.8vw,2.9rem)' }}>
                Bókun fer fram hjá Bókun
              </h2>
            </Rise>
            <Rise delay={0.16}>
              <p className="mt-6 max-w-lg text-[1.02rem] leading-relaxed" style={{ color: MUT, fontFamily: MONO }}>
                Húsavík Adventures bókar nú þegar í gegnum Bókun, alþjóðlegt bókunarkerfi sem fjöldi íslenskra ferðaþjónustufyrirtækja treystir á. Við breytum ekki því sem virkar, við gefum því bara betri umgjörð.
              </p>
            </Rise>
            <Rise delay={0.24}>
              <ConsoleButton href={`mailto:${CONTACT.email}?subject=${encodeURIComponent('Bókunarfyrirspurn')}`}>
                Bóka núna
                <ArrowUpRight size={15} aria-hidden />
              </ConsoleButton>
            </Rise>
          </div>

          <RiseImg delay={0.15}>
            <div className="relative flex aspect-[4/3] flex-col items-center justify-center gap-3 border p-8 text-center" style={{ borderColor: HAIR, background: 'rgba(255,243,234,0.03)' }}>
              <CornerTicks color={HAIR} />
              <span className="text-[0.7rem] uppercase tracking-[0.2em]" style={{ color: COLD, fontFamily: MONO }}>
                Bókunargluggi Bókun
              </span>
              <p className="max-w-[22ch] text-[1.05rem] uppercase leading-snug" style={{ fontFamily: MONO, fontWeight: 500, color: INK }}>
                Kalendarinn ykkar opnast hér, beint af Bókun
              </p>
            </div>
          </RiseImg>
        </div>
      </div>
    </section>
  )
}

/* ── Gjafabréf ─────────────────────────────────────────────────────────── */
function GiftCards() {
  return (
    <section id="gjafabref" className="border-t" style={{ borderColor: HAIRDIM }}>
      <div className="mx-auto max-w-[1360px] px-5 py-24 md:px-8 md:py-32">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Rise>
              <Eyebrow>
                <Gift size={12} aria-hidden />
                Gjafabréf
              </Eyebrow>
            </Rise>
            <Rise delay={0.08}>
              <h2 className="mt-4 max-w-md uppercase leading-[1.08]" style={{ fontFamily: MONO, fontWeight: 500, color: INK, fontSize: 'clamp(1.7rem,3.4vw,2.5rem)' }}>
                Gefðu ævintýri, ekki hlut
              </h2>
            </Rise>
            <Rise delay={0.16}>
              <p className="mt-5 max-w-md text-[1rem] leading-relaxed" style={{ color: MUT, fontFamily: MONO }}>
                Gjafabréf frá Húsavík Adventures hentar í hvala- og lundaskoðun eða buggýferð, að vali þess sem fær. Sendið okkur línu og við göngum frá gjafabréfi sem hentar.
              </p>
            </Rise>
          </div>
          <Rise delay={0.2}>
            <ConsoleButton href={`mailto:${CONTACT.email}?subject=${encodeURIComponent('Gjafabréf')}`} variant="outline">
              <Gift size={15} aria-hidden />
              Fyrirspurn um gjafabréf
            </ConsoleButton>
          </Rise>
        </div>
      </div>
    </section>
  )
}

/* ── Gott að vita: practical info ─────────────────────────────────────── */
function Practical() {
  const items = [
    'RIB ferðin tekur um tvær klukkustundir, frá höfninni á Húsavík.',
    'Flotgalli er innifalinn og fer utan yfir venjuleg föt, svo klæðið ykkur hlýlega að innan.',
    'Buggýferðir eru í boði allan ársins hring, óháð veðri og árstíð.',
    'Nákvæm staðsetning og mætingartími eru staðfest við bókun.',
  ]
  return (
    <section id="upplysingar" className="mx-auto max-w-[1360px] px-5 py-24 md:px-8 md:py-32">
      <Rise>
        <Eyebrow>Gott að vita</Eyebrow>
      </Rise>
      <Rise delay={0.08}>
        <h2 className="mt-4 max-w-lg uppercase leading-[1.05]" style={{ fontFamily: MONO, fontWeight: 500, color: INK, fontSize: 'clamp(1.9rem,3.8vw,2.9rem)' }}>
          Áður en þið mætið
        </h2>
      </Rise>

      <ul className="mt-12 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
        {items.map((it, i) => (
          <Rise key={it} delay={0.06 * i}>
            <li className="flex items-start gap-3 border-t pt-5" style={{ borderColor: HAIRDIM }}>
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: ACCENT }} />
              <span className="text-[1rem] leading-relaxed" style={{ color: MUT, fontFamily: MONO }}>
                {it}
              </span>
            </li>
          </Rise>
        ))}
      </ul>
    </section>
  )
}

/* ── Samband: final panel and the second, closing use of Alpino, the
      reference's "occasional display" allowance spent once at the open and
      once here at the close. Their real shopfront photo grounds the
      crimson claim in something seen, not just declared. ─────────────────*/
function Contact() {
  return (
    <section id="samband" className="border-t" style={{ borderColor: HAIRDIM }}>
      <div className="mx-auto max-w-[1360px] px-5 py-24 md:px-8 md:py-32">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="text-center lg:text-left">
            <Rise>
              <Wordmark size="lg" />
            </Rise>
            <Rise delay={0.1}>
              <h2 className="mt-8 leading-[0.98]" style={{ fontFamily: DISPLAY, fontWeight: 820, color: INK, fontSize: 'clamp(2.2rem,5.2vw,4rem)' }}>
                Sjáumst á Húsavík.
              </h2>
            </Rise>
            <Rise delay={0.18}>
              <p className="mx-auto mt-6 max-w-md text-[1.02rem] lg:mx-0" style={{ color: MUT, fontFamily: MONO }}>
                {CONTACT.location}. Óháð fyrirtæki, ekki keðja.
              </p>
            </Rise>
            <Rise delay={0.26}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <ConsoleButton href={CONTACT.phoneHref}>
                  <Phone size={15} aria-hidden />
                  {CONTACT.phoneDisplay}
                </ConsoleButton>
                <ConsoleButton href={`mailto:${CONTACT.email}`} variant="outline">
                  <Mail size={14} aria-hidden />
                  {CONTACT.email}
                </ConsoleButton>
                <ConsoleButton href={CONTACT.maps} variant="outline">
                  <MapPin size={14} aria-hidden />
                  Opna kort
                </ConsoleButton>
              </div>
            </Rise>
          </div>

          <ScopeFrame img={IMAGES.shopfront} ratio="aspect-[4/3]" delay={0.15} index="Athugun 09 · Höfnin" />
        </div>
      </div>
    </section>
  )
}

/* ── mobile sticky bottom bar: phone, gift, book ─────────────────────────*/
function StickyBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-between gap-2 border-t px-3 py-2.5 md:hidden"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: HAIRDIM }}
    >
      <a
        href={CONTACT.phoneHref}
        aria-label={`Hringja í ${CONTACT.phoneDisplay}`}
        className="flex flex-1 flex-col items-center justify-center gap-1 text-[0.65rem] uppercase"
        style={{ color: INK, fontFamily: MONO }}
      >
        <Phone size={18} aria-hidden />
        Hringja
      </a>
      <button
        onClick={() => goTo('gjafabref')}
        aria-label="Gjafabréf"
        className="flex flex-1 flex-col items-center justify-center gap-1 text-[0.65rem] uppercase"
        style={{ color: INK, fontFamily: MONO }}
      >
        <Gift size={18} aria-hidden />
        Gjafabréf
      </button>
      <button
        onClick={() => goTo('bokun')}
        className="flex flex-[1.4] items-center justify-center gap-2 text-[0.82rem] font-medium uppercase tracking-[0.06em]"
        style={{ background: ACCENT, color: WHITE, fontFamily: MONO, borderRadius: '10px 0 10px 0' }}
      >
        <ArrowUpRight size={16} aria-hidden />
        Bóka núna
      </button>
    </div>
  )
}

/* ── page ─────────────────────────────────────────────────────────────── */
export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.title = META.title
    setThemeColor(GROUND)
    /* the shell's index.html declares lang="en", this page is Icelandic. */
    document.documentElement.lang = 'is'
    const meta = document.querySelector('meta[name="description"]')
    const prev = meta?.getAttribute('content') ?? ''
    meta?.setAttribute('content', META.description)
    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(ld)
    return () => {
      meta?.setAttribute('content', prev)
      ld.remove()
    }
  }, [])

  /* FLUID ROOT: the page's own font-size (in vw, clamped) drives every rem
     value in the tree. Scoped to when this route is mounted, restored on
     unmount, never a persistent edit to index.css. */
  useEffect(() => {
    const prev = document.documentElement.style.fontSize
    document.documentElement.style.fontSize = 'clamp(16px, 13px + 0.6vw, 19px)'
    return () => {
      document.documentElement.style.fontSize = prev
    }
  }, [])

  return (
    <div className="hv-page min-h-dvh overflow-x-clip pb-24 antialiased md:pb-0" style={{ background: GROUND, color: INK, fontFamily: MONO }}>
      <style>{CSS}</style>

      <Atmosphere />
      <ViewfinderChrome />

      <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="relative z-10">
        <Hero />
        <Targets />
        <RoutePlot label="Leiðin út" />
        <Bay />
        <Safety />
        <PromiseBand />
        <Buggy />
        <Departures />
        <Booking />
        <GiftCards />
        <Practical />
        <RoutePlot reverse label="Leiðin heim" />
        <Contact />
      </main>

      <div
        className="relative z-10 px-5 py-5 text-center text-[0.7rem] uppercase tracking-[0.14em]"
        style={{ fontFamily: MONO, color: MUT, borderTop: `1px solid ${HAIRDIM}` }}
      >
        Frumgerð · verð og brottfarir eru sýnishorn frá {DEPARTURES_SOURCE_YEAR}, óstaðfest · SNDR Studio
      </div>
      <div className="relative z-10">
        <PreviewFooter company={company} />
      </div>
      <PreviewChrome company={company} />
      <StickyBar />
    </div>
  )
}
