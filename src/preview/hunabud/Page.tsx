/**
 * Húnabúð / Bæjarblómið — "Þrír gluggar, eitt þak" rebuild.
 *
 * The real building carries three signs side by side (Húnabúð coffee,
 * Bæjarblómið flowers, a gift shop). This pass makes the redesign's core job
 * literal and functional: hours, location and the three-part offering used
 * to be buried in the footer with no nav at all. Here they sit inside the
 * hero itself, and a persistent header keeps them one tap away everywhere.
 *
 * Signature (NEW — replaces the old scroll-drawn "one roof" thread): a
 * three-window switcher, an accessible segmented control (role=tablist/tab,
 * roving focus, arrow keys) whose three "shop windows" are ALWAYS all
 * partially visible, mirroring the three real signs. Selecting one grows it
 * (flex-grow crossfade) and shifts its local colour to that offering's tint;
 * the other two recede but never disappear. Under prefers-reduced-motion all
 * three render fully expanded at once, in a static stacked layout, with
 * instant (non-animated) selection — no content is ever gated behind hover
 * or motion. The deeper per-window copy (CAFE_ITEMS / OCCASIONS / GIFTS) is
 * also repeated in full further down the page, so nothing here is the only
 * place to find it.
 *
 * Palette: porcelain ground (brightest of the four redesign passes), pine
 * structural ink (the real signage colour, ~10.4:1 on porcelain, computed),
 * three offering tints — coffee (safe at any text size, ~7.6:1), rose and
 * mustard (safe as large text/fills at their base value, ~3.2 to 3.5:1; the
 * *Dark variants carry small text at ~5:1). See data.ts C for the figures.
 *
 * Type: display = Instrument Serif (var(--font-survey)), body = Schibsted
 * Grotesk (var(--font-schibsted)). No overflow-hidden text-clip reveal
 * anywhere in this file — Icelandic display copy (Þrír, Húnabúð, Blönduós,
 * Bæjarblómið) carries uppercase acutes and descenders a clip mask can cut
 * into, so every reveal here is a plain opacity/translate fade instead, and
 * every Instrument Serif heading keeps leading >= 1.15.
 *
 * Deviation from the old build: the old "rekið af Sillu og Sigurði" founders
 * aside is dropped. It wasn't sourced from data.ts and the brief's locked
 * section order doesn't include it, so it's cut rather than carried over
 * unverified. The real three-signs photo (IMG.signage) is kept and now
 * leads the switcher section as literal proof of the concept.
 */
import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Clock, MapPin, Phone } from 'lucide-react'
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
  OPENING_SCHEDULE,
  PHONE_MAIN,
  PHONE_MAIN_TEL,
  PHONE_MOBILE,
  PHONE_MOBILE_TEL,
  PILLARS,
  REVIEWS,
  STATUS_CAVEAT,
  type ImgKey,
  type Pillar,
} from './data'

const company = getPreviewCompany('hunabud')
const EASE = [0.22, 1, 0.36, 1] as const
const asset = (p: string) => import.meta.env.BASE_URL + p

/** Same HOURS facts as the deep table, condensed for the hero dock + menu. */
const HOURS_SUMMARY = OPENING_SCHEDULE.map((r) => r.label).join(' · ')

/** Shared focus-visible treatment; colour is set per element via style. */
const FOCUS = 'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'

/* ------------------------------------------------------------------ helpers */

/** Per-word rise reveal — opacity + translate only, never overflow-hidden.
 *  Safe over Icelandic display copy with uppercase acutes (no clip mask to
 *  cut a floating accent off mid-transition). Mount-triggered, not scroll. */
function RiseWords({
  text,
  reduced,
  className,
  style,
  delayStart = 0.1,
}: {
  text: string
  reduced: boolean
  className?: string
  style?: React.CSSProperties
  delayStart?: number
}) {
  if (reduced) {
    return (
      <span className={className} style={style}>
        {text}
      </span>
    )
  }
  const words = text.split(' ')
  return (
    <span className={className} style={style}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ marginRight: '0.28em' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: EASE, delay: delayStart + i * 0.08 }}
        >
          {w}
        </motion.span>
      ))}
    </span>
  )
}

/** Standalone content photo — clip-path reveal on scroll-in. This clips a
 *  PHOTOGRAPH's edges, not text, so it carries none of the accent-clipping
 *  risk RiseWords avoids; kept for below-fold inset images only (not the
 *  full-bleed background photos, which get their own mount-triggered,
 *  eager-loaded treatment inline where they're used). */
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

/** Illustrative stand-in photo (flowers/gifts sections only) — mount-
 *  triggered opacity/scale reveal, not whileInView. The flowers and gifts
 *  sections were rendering as an empty porcelain void: ClipImage's
 *  scroll-triggered clip-path reveal never fired for these particular grids,
 *  leaving every image permanently clipped to zero height (the same
 *  whileInView unreliability already on record for this codebase). Firing
 *  on mount sidesteps that failure mode entirely. Carries a tint-coloured
 *  wash tying the stand-in to its section's offering colour. */
function StandInImage({
  imgKey,
  alt,
  aspect,
  reduced,
  tint,
  className,
  delay = 0,
}: {
  imgKey: ImgKey
  alt: string
  aspect: string
  reduced: boolean
  tint: string
  className?: string
  delay?: number
}) {
  return (
    <div className={`relative overflow-hidden rounded-[1.4rem] ${className ?? ''}`} style={{ aspectRatio: aspect, background: C.ink }}>
      <motion.img
        src={asset(IMG[imgKey])}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
        initial={reduced ? false : { opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay }}
      />
      <div aria-hidden className="absolute inset-0" style={{ background: `linear-gradient(to top, ${tint}59 0%, transparent 48%)` }} />
    </div>
  )
}

/** Honest "these are stand-ins" caption for StandInImage groups. */
function StandInLabel({ color }: { color: string }) {
  return (
    <p className="mt-3 text-[0.66rem] uppercase" style={{ fontFamily: FONT.body, letterSpacing: '0.16em', color }}>
      Myndir til skýringar, ekki af versluninni sjálfri
    </p>
  )
}

/** Generic text reveal — opacity + small rise, never clips itself to zero. */
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

/** Star rating — mustard fill reads as a warm rosette, not a semantic colour. */
function Stars({ n }: { n: number }) {
  return (
    <span role="img" aria-label={`${n} af 5 stjörnum`} style={{ color: C.mustard, letterSpacing: '0.12em' }}>
      <span aria-hidden>{'★'.repeat(n)}</span>
      <span aria-hidden style={{ color: 'rgba(251,250,246,0.28)' }}>{'★'.repeat(5 - n)}</span>
    </span>
  )
}

function SectionLabel({ n, dark, children }: { n: string; dark?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[0.7rem] uppercase" style={{ fontFamily: FONT.body, letterSpacing: '0.24em', color: dark ? C.ground : C.coffee }}>
        {n}
      </span>
      <span className="h-px flex-1" style={{ background: dark ? 'rgba(251,250,246,0.18)' : C.inkFaint }} />
      <span className="text-[0.7rem] uppercase" style={{ fontFamily: FONT.body, letterSpacing: '0.24em', color: dark ? 'rgba(251,250,246,0.6)' : C.inkSoft }}>
        {children}
      </span>
    </div>
  )
}

/** Real vs illustrative alt text, kept honest per data.ts's own docblock. */
function altFor(key: ImgKey): string {
  if (key === 'cakeCase') return 'Kökuborð kaffihússins í Húnabúð'
  if (key === 'florist') return 'Hendur raða blómum í vöndul (myndskreyting)'
  if (key === 'yarn') return 'Íslenskt ullargarn í hnyklum (myndskreyting)'
  return ''
}

/* ------------------------------------------------- indicative open status */

/** Computed from OPENING_SCHEDULE (the same verified HOURS facts). Always
 *  paired with STATUS_CAVEAT wherever it's shown — never a bare claim. */
function computeStatus(now: Date): { open: boolean; label: string } {
  const day = now.getDay()
  const minutes = now.getHours() * 60 + now.getMinutes()
  const rule = OPENING_SCHEDULE.find((r) => r.days.includes(day))
  const open = !!rule && minutes >= rule.start && minutes < rule.end
  return { open, label: open ? 'Líklega opið núna' : 'Líklega lokað núna' }
}

function useOpenStatus() {
  const [status, setStatus] = useState(() => computeStatus(new Date()))
  useEffect(() => {
    const id = window.setInterval(() => setStatus(computeStatus(new Date())), 60_000)
    return () => window.clearInterval(id)
  }, [])
  return status
}

/** The hero's info dock — hours, location, phone and the indicative status,
 *  surfaced immediately instead of buried in the footer (the core job). */
function InfoDock({ reduced }: { reduced: boolean }) {
  const { open, label } = useOpenStatus()
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE, delay: 1.0 }}
      className="mt-8 w-full max-w-2xl rounded-[1.4rem] px-5 py-4 md:px-6 md:py-5"
      style={{
        background: 'rgba(251,250,246,0.12)',
        border: '1px solid rgba(251,250,246,0.24)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
    >
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
        <span
          aria-hidden
          className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ background: open ? C.ground : 'transparent', border: `1.5px solid ${C.ground}` }}
        />
        <span className="text-sm font-semibold" style={{ fontFamily: FONT.body, color: C.ground }}>
          {label}
        </span>
        <span className="text-xs" style={{ fontFamily: FONT.body, color: 'rgba(251,250,246,0.72)' }}>
          ({STATUS_CAVEAT})
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-sm" style={{ fontFamily: FONT.body, color: 'rgba(251,250,246,0.92)' }}>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden style={{ color: 'rgba(251,250,246,0.65)' }} />
          {HOURS_SUMMARY}
        </span>
        <a
          href={MAPS_HREF}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex min-h-11 items-center gap-1.5 underline-offset-4 hover:underline ${FOCUS}`}
          style={{ outlineColor: C.ground }}
        >
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden style={{ color: 'rgba(251,250,246,0.65)' }} />
          {ADDRESS}
        </a>
        <a
          href={PHONE_MAIN_TEL}
          className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 font-semibold ${FOCUS}`}
          style={{ background: C.ground, color: C.ink, outlineColor: C.ground }}
        >
          <Phone className="h-3.5 w-3.5" aria-hidden />
          {PHONE_MAIN}
        </a>
      </div>
    </motion.div>
  )
}

/* --------------------------------------------------------- ambient signage */

/** Thin ambient signage strip echoing the building's own three names.
 *  Purely decorative (aria-hidden both branches — the real, accessible
 *  names live in the switcher tabs and section headings below). */
function SignageMarquee({ reduced }: { reduced: boolean }) {
  const words = ['Kaffihús', 'Bæjarblómið', 'Gjafavara']
  if (reduced) {
    return (
      <div
        aria-hidden
        className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-y py-3 text-[0.72rem] uppercase"
        style={{ fontFamily: FONT.body, letterSpacing: '0.22em', color: C.inkSoft, borderColor: C.inkFaint }}
      >
        {words.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
    )
  }
  const loop = [...words, ...words, ...words]
  return (
    <div aria-hidden className="overflow-hidden border-y py-3" style={{ borderColor: C.inkFaint }}>
      <div
        className="hb-marquee-track flex w-max items-center gap-8 whitespace-nowrap text-[0.72rem] uppercase"
        style={{ fontFamily: FONT.body, letterSpacing: '0.22em', color: C.inkSoft }}
      >
        {loop.map((w, i) => (
          <span key={i} className="inline-flex items-center gap-8">
            {w}
            <span aria-hidden style={{ color: C.inkFaint }}>·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------------------- three-window switcher */

/** The peek (eyebrow/title/lede, always rendered) + the deeper content
 *  (body + item chips), which only renders when `expanded`. Used by both
 *  the interactive row and the reduced-motion grid, so "expanded" behaves
 *  identically either way — reduced motion just passes it in permanently. */
function WindowContent({ pillar, items, expanded }: { pillar: Pillar; items: string[]; expanded: boolean }) {
  return (
    <div className="relative z-10 flex h-full flex-col justify-end p-5 md:p-6">
      <span
        className="inline-flex w-fit items-center rounded-full px-3 py-1 text-[0.66rem] font-semibold uppercase"
        style={{ background: pillar.tint, color: C.ground, letterSpacing: '0.14em', fontFamily: FONT.body }}
      >
        {pillar.eyebrow}
      </span>
      <h3 className="mt-3 text-[1.6rem] md:text-[2rem]" style={{ fontFamily: FONT.display, color: C.ground, lineHeight: 1.16 }}>
        {pillar.title}
      </h3>
      <p className="mt-1 text-sm md:text-base" style={{ fontFamily: FONT.body, color: 'rgba(251,250,246,0.86)' }}>
        {pillar.lede}
      </p>
      {expanded && (
        <div className="mt-4 max-w-md">
          <p className="text-sm leading-relaxed md:text-[0.95rem]" style={{ fontFamily: FONT.body, color: 'rgba(251,250,246,0.92)' }}>
            {pillar.body}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {items.map((it) => (
              <span key={it} className="rounded-full px-3 py-1 text-xs" style={{ background: 'rgba(251,250,246,0.16)', color: C.ground, fontFamily: FONT.body }}>
                {it}
              </span>
            ))}
          </div>
          <span className="mt-3 inline-flex items-center gap-1.5 text-[0.72rem] font-semibold uppercase" style={{ fontFamily: FONT.body, letterSpacing: '0.1em', color: C.ground }}>
            {pillar.cue}
            <span aria-hidden style={{ color: pillar.tint }}>→</span>
          </span>
        </div>
      )}
    </div>
  )
}

/** The signature: three shop windows, always all partially visible.
 *  Accessible segmented control (role=tablist/tab, roving focus, arrow
 *  keys) drives which window is grown. Reduced motion swaps to a static
 *  stacked grid where all three are permanently, equally expanded. */
function WindowSwitcher({ reduced }: { reduced: boolean }) {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const onTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = -1
    if (e.key === 'ArrowRight') next = (i + 1) % PILLARS.length
    else if (e.key === 'ArrowLeft') next = (i - 1 + PILLARS.length) % PILLARS.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = PILLARS.length - 1
    if (next === -1) return
    e.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  const itemsFor = (key: ImgKey): string[] => {
    if (key === 'cakeCase') return CAFE_ITEMS.map((it) => it.name)
    if (key === 'florist') return OCCASIONS
    if (key === 'yarn') return GIFTS
    return []
  }

  return (
    <div>
      <div role="tablist" aria-label="Þrjár verslanir undir einu þaki" className="flex flex-wrap gap-2">
        {PILLARS.map((p, i) => {
          const isActive = active === i
          return (
            <button
              key={p.key}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`hb-tab-${p.key}`}
              aria-selected={isActive}
              aria-controls={`hb-panel-${p.key}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onTabKeyDown(e, i)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors duration-300 motion-reduce:transition-none ${FOCUS}`}
              style={{
                background: isActive ? p.tint : 'transparent',
                color: isActive ? C.ground : C.inkSoft,
                border: `1px solid ${isActive ? p.tint : C.inkFaint}`,
                fontFamily: FONT.body,
                outlineColor: p.tint,
              }}
            >
              {p.title}
            </button>
          )
        })}
      </div>

      {reduced ? (
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {PILLARS.map((p) => (
            <div
              key={p.key}
              id={`hb-panel-${p.key}`}
              role="tabpanel"
              aria-labelledby={`hb-tab-${p.key}`}
              className="relative overflow-hidden rounded-[1.6rem]"
              style={{ aspectRatio: '4 / 5', background: C.ink }}
            >
              <img
                src={asset(IMG[p.key])}
                alt={altFor(p.key)}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(30,68,51,0.92) 0%, rgba(30,68,51,0.4) 55%, rgba(30,68,51,0.1) 100%)' }} />
              <div aria-hidden className="absolute inset-0" style={{ background: `linear-gradient(to top, ${p.tint} 0%, transparent 68%)`, opacity: 0.42 }} />
              <WindowContent pillar={p} items={itemsFor(p.key)} expanded />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4 md:h-[560px] md:flex-row md:gap-3">
          {PILLARS.map((p, i) => {
            const isActive = active === i
            return (
              <div
                key={p.key}
                id={`hb-panel-${p.key}`}
                role="tabpanel"
                aria-labelledby={`hb-tab-${p.key}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                className="relative h-[420px] cursor-pointer overflow-hidden rounded-[1.6rem] md:h-full"
                style={{
                  flexGrow: isActive ? 3.2 : 1,
                  flexBasis: 0,
                  minWidth: 0,
                  transition: 'flex-grow 650ms cubic-bezier(0.22,1,0.36,1)',
                  background: C.ink,
                }}
              >
                <img
                  src={asset(IMG[p.key])}
                  alt={altFor(p.key)}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-700 ease-out"
                  style={{ filter: isActive ? 'saturate(1) brightness(1)' : 'saturate(0.4) brightness(0.62)' }}
                />
                <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(30,68,51,0.92) 0%, rgba(30,68,51,0.4) 55%, rgba(30,68,51,0.1) 100%)' }} />
                <div
                  aria-hidden
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{ background: `linear-gradient(to top, ${p.tint} 0%, transparent 68%)`, opacity: isActive ? 0.5 : 0 }}
                />
                <WindowContent pillar={p} items={itemsFor(p.key)} expanded={isActive} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------- site header */

function SiteHeader({ reduced, lenisRef }: { reduced: boolean; lenisRef: React.RefObject<Lenis | null> }) {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.55)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* menu open: freeze the page behind it (Lenis + native scroll), Escape closes */
  useEffect(() => {
    if (!open) return
    lenisRef.current?.stop()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      lenisRef.current?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [open, lenisRef])

  const scrollTo = (hash: string) => {
    const el = document.querySelector(hash)
    if (!el) return
    if (lenisRef.current) lenisRef.current.scrollTo(el as HTMLElement, { offset: -76 })
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }
  const go = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    scrollTo(hash)
  }
  const goMobile = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    requestAnimationFrame(() => scrollTo(hash))
  }

  const links = [
    { hash: '#kaffihus', label: 'Kaffihús' },
    { hash: '#bloma', label: 'Bæjarblómið' },
    { hash: '#gjafavara', label: 'Gjafavara' },
    { hash: '#opnunartimi', label: 'Opnunartími' },
  ]
  const dark = solid || open

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-colors duration-500"
        style={{
          background: dark ? C.ground : 'transparent',
          borderBottom: dark ? `1px solid ${C.inkFaint}` : '1px solid transparent',
        }}
      >
        <div className="mx-auto flex h-[68px] max-w-[1240px] items-center justify-between gap-3 px-5 md:px-8">
          <a href="#hero" onClick={go('#hero')} className={`inline-flex min-h-11 items-center gap-2 ${FOCUS}`} aria-label="Efst á síðu, Húnabúð" style={{ outlineColor: dark ? C.ink : C.ground }}>
            <span aria-hidden className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ background: C.coffee }} />
              <span className="h-2 w-2 rounded-full" style={{ background: C.rose }} />
              <span className="h-2 w-2 rounded-full" style={{ background: C.mustard }} />
            </span>
            <span style={{ fontFamily: FONT.display, fontSize: '1.5rem', color: dark ? C.ink : C.ground }}>Húnabúð</span>
          </a>

          <nav aria-label="Aðalvalmynd" className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.hash}
                href={l.hash}
                onClick={go(l.hash)}
                className={`inline-flex min-h-11 items-center px-3 text-[13px] font-medium uppercase ${FOCUS}`}
                style={{ fontFamily: FONT.body, letterSpacing: '0.08em', color: dark ? C.inkSoft : 'rgba(251,250,246,0.9)', outlineColor: dark ? C.ink : C.ground }}
              >
                {l.label}
              </a>
            ))}
            <a
              href={PHONE_MAIN_TEL}
              className={`ml-2 inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-[14px] font-semibold ${FOCUS}`}
              style={{ fontFamily: FONT.body, background: dark ? C.ink : C.ground, color: dark ? C.ground : C.ink, outlineColor: dark ? C.ink : C.ground }}
            >
              <Phone className="h-3.5 w-3.5" aria-hidden />
              {PHONE_MAIN}
            </a>
          </nav>

          <div className="flex items-center gap-1 md:hidden">
            <a
              href={PHONE_MAIN_TEL}
              aria-label={`Hringja í Húnabúð, ${PHONE_MAIN}`}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full ${FOCUS}`}
              style={{ color: dark ? C.ink : C.ground, outlineColor: dark ? C.ink : C.ground }}
            >
              <Phone className="h-5 w-5" aria-hidden />
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="hb-mobile-menu"
              aria-label={open ? 'Loka valmynd' : 'Opna valmynd'}
              className={`relative inline-flex h-11 w-11 items-center justify-center rounded-full ${FOCUS}`}
              style={{ outlineColor: dark ? C.ink : C.ground }}
            >
              {/* burger -> X morph: two lines, pine + coffee, in the site's own vocabulary */}
              <span
                aria-hidden
                className="absolute h-[2px] w-6 transition-transform duration-300 motion-reduce:transition-none"
                style={{ background: dark ? C.ink : C.ground, transform: open ? 'rotate(45deg)' : 'translateY(-4px)' }}
              />
              <span
                aria-hidden
                className="absolute h-[2px] w-6 transition-transform duration-300 motion-reduce:transition-none"
                style={{ background: open ? C.coffee : dark ? C.ink : C.ground, transform: open ? 'rotate(-45deg)' : 'translateY(4px)' }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* mobile menu: full-screen porcelain overlay, rendered as a header
          SIBLING (never inside it — a fixed-position ancestor with its own
          stacking context can squeeze an in-header overlay to zero height) */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="hb-mobile-menu"
            key="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Valmynd"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto pt-[68px] md:hidden"
            style={{ background: C.ground }}
          >
            <nav aria-label="Valmynd" className="flex flex-1 flex-col justify-center gap-2 px-6 py-10">
              {links.map((l, i) => (
                <motion.a
                  key={l.hash}
                  href={l.hash}
                  onClick={goMobile(l.hash)}
                  initial={reduced ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: reduced ? 0 : 0.45, ease: EASE, delay: reduced ? 0 : 0.08 + i * 0.06 }}
                  className={`block py-2 ${FOCUS}`}
                  style={{ fontFamily: FONT.display, fontSize: 'clamp(2rem, 10vw, 2.6rem)', color: C.ink, lineHeight: 1.2, outlineColor: C.ink }}
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <div className="border-t px-6 py-6" style={{ borderColor: C.inkFaint }}>
              <p className="text-sm" style={{ fontFamily: FONT.body, color: C.inkSoft }}>{ADDRESS}</p>
              <p className="mt-1 text-xs" style={{ fontFamily: FONT.body, color: C.inkSoft }}>{HOURS_SUMMARY}</p>
              <a
                href={PHONE_MAIN_TEL}
                className={`mt-3 inline-flex min-h-11 items-center gap-2 text-xl font-semibold ${FOCUS}`}
                style={{ fontFamily: FONT.body, color: C.ink, outlineColor: C.ink }}
              >
                <Phone className="h-4 w-4" aria-hidden />
                {PHONE_MAIN}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ========================================================================== */

export default function Page() {
  const reduced = useReducedMotion() ?? false
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    document.title = 'Húnabúð · Þrír gluggar, eitt þak'
    setThemeColor(C.ground)
    return () => setThemeColor('#0a1320')
  }, [])

  /* Lenis smooth scroll (skip under reduced motion); kept in a ref so the
     header can stop/start it around the mobile menu and drive anchor nav. */
  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({
      duration: 1.1,
      easing: (x: number) => Math.min(1, 1.001 - Math.pow(2, -10 * x)),
      smoothWheel: true,
    })
    lenisRef.current = lenis
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduced])

  return (
    <div lang="is" style={{ background: C.ground, color: C.ink, fontFamily: FONT.body }} className="overflow-x-hidden">
      {/* the only custom CSS in this file — namespaced hb-, page-local only */}
      <style>{`
        @keyframes hb-marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-33.3333%); }
        }
        .hb-marquee-track { animation: hb-marquee-scroll 24s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .hb-marquee-track { animation: none; }
        }
      `}</style>

      <PreviewChrome company={company} />
      <SiteHeader reduced={reduced} lenisRef={lenisRef} />

      {/* ============================================================ 1 · HERO */}
      <section id="hero" className="relative min-h-[100svh] w-full overflow-hidden">
        <motion.img
          src={asset(IMG.hero)}
          alt="Húnabúð við þjóðveginn í Blönduósi, lopapeysur á slá fyrir utan og gestur á leið inn"
          loading="eager"
          decoding="async"
          {...{ fetchpriority: 'high' as const }}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: '50% 42%' }}
          initial={reduced ? false : { opacity: 0, scale: 1.07 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.3, ease: EASE }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(20,44,32,0.92) 4%, rgba(20,44,32,0.55) 40%, rgba(20,44,32,0.18) 68%, rgba(20,44,32,0.4) 100%)' }}
        />

        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1240px] flex-col justify-end px-5 pb-10 pt-28 md:px-8 md:pb-14">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            className="text-[0.72rem] uppercase"
            style={{ fontFamily: FONT.body, letterSpacing: '0.28em', color: 'rgba(251,250,246,0.85)' }}
          >
            Þjóðvegur 1 · Blönduós
          </motion.p>

          <h1
            className="mt-4"
            aria-label="Þrír gluggar, eitt þak"
            style={{ fontFamily: FONT.display, color: C.ground, fontSize: 'clamp(2.6rem, 8.5vw, 6.4rem)', lineHeight: 1.15, textShadow: '0 2px 28px rgba(10,24,16,0.4)' }}
          >
            <span aria-hidden="true">
              <RiseWords text="Þrír gluggar," reduced={reduced} className="block" delayStart={0.25} />
              <RiseWords text="eitt þak" reduced={reduced} className="block italic" delayStart={0.55} />
            </span>
            {/* correctly-spaced, in-DOM copy: the word-split spans above have
                no real space text node between them (only CSS margin), so
                both the accessible name and a crawler reading raw text would
                otherwise see "Þrírgluggar,eittþak" */}
            <span className="sr-only">Þrír gluggar, eitt þak</span>
          </h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.85 }}
            className="mt-5 max-w-xl text-base leading-relaxed md:text-lg"
            style={{ fontFamily: FONT.body, color: 'rgba(251,250,246,0.92)' }}
          >
            Kaffihús, blómabúð og gjafavara undir sama þaki við þjóðveginn í Blönduósi. Þrjár búðir bak við þrjú skilti, ein heimsókn.
          </motion.p>

          <InfoDock reduced={reduced} />
        </div>
      </section>

      {/* ================================================ 2 · WINDOW SWITCHER */}
      <section id="gluggar" className="mx-auto w-full max-w-[1240px] px-5 py-20 md:px-8 md:py-28" style={{ background: C.ground }}>
        <FadeUp reduced={reduced}>
          <SectionLabel n="01">Þrír gluggar, eitt þak</SectionLabel>
          <h2 className="mt-5 max-w-2xl text-[clamp(2rem,5vw,3.4rem)]" style={{ fontFamily: FONT.display, lineHeight: 1.18 }}>
            Veldu þinn glugga
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ fontFamily: FONT.body, color: C.inkSoft }}>
            Þrjú skilti á sama húsi, kaffihús, blómabúð og gjafavara. Smelltu eða renndu yfir til að sjá hvað leynist bak við hvert þeirra.
          </p>
        </FadeUp>

        <ClipImage
          imgKey="signage"
          alt="Skiltin þrjú á húsi Húnabúðar, Húnabúð, Bæjarblómið og blóma- og gjafavöruverslun"
          aspect="21 / 8"
          reduced={reduced}
          className="mt-8 rounded-[1.4rem]"
          position="50% 42%"
        />
        <p className="mt-2 text-[0.68rem] uppercase" style={{ fontFamily: FONT.body, letterSpacing: '0.14em', color: C.inkSoft }}>
          Alvöru skilti hússins, þrjú nöfn undir einu þaki
        </p>

        <div className="mt-10">
          <SignageMarquee reduced={reduced} />
        </div>

        <div className="mt-8">
          <WindowSwitcher reduced={reduced} />
        </div>
      </section>

      {/* ==================================================== 3 · CAFÉ OFFER */}
      <section id="kaffihus" className="mx-auto w-full max-w-[1240px] px-5 py-20 md:px-8 md:py-28" style={{ background: C.ground }}>
        <FadeUp reduced={reduced}>
          <SectionLabel n="02">Kaffihúsið</SectionLabel>
          <h2 className="mt-5 max-w-2xl text-[clamp(2rem,5vw,3.4rem)]" style={{ fontFamily: FONT.display, lineHeight: 1.15 }}>
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
            <p className="max-w-md text-base leading-relaxed" style={{ fontFamily: FONT.body, color: C.inkSoft }}>
              Gestir hafa nefnt bláberjakökuna, jógúrtkökuna og gúllassúpuna sérstaklega. Súpa dagsins, samlokur og heimabakað fylgja góðu kaffi.
            </p>
            <ul className="mt-6 divide-y" style={{ borderColor: C.inkFaint }}>
              {CAFE_ITEMS.map((it) => (
                <li key={it.name} className="flex items-baseline justify-between gap-4 py-3.5" style={{ borderColor: C.inkFaint }}>
                  <span className="text-lg font-semibold" style={{ fontFamily: FONT.body }}>{it.name}</span>
                  <span className="text-right text-[0.72rem] uppercase" style={{ fontFamily: FONT.body, letterSpacing: '0.08em', color: C.inkSoft }}>
                    {it.note}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm" style={{ fontFamily: FONT.body, color: C.inkSoft }}>
              Úrvalið er breytilegt eftir dögum. Spyrðu í afgreiðslu um það sem er á boðstólum þann daginn.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================= 4 · FLOWERS */}
      <section id="bloma" className="w-full" style={{ background: '#F4F1EA' }}>
        <div className="mx-auto w-full max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
          <FadeUp reduced={reduced}>
            <SectionLabel n="03">Bæjarblómið</SectionLabel>
            <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <h2 className="max-w-2xl text-[clamp(2rem,5vw,3.4rem)]" style={{ fontFamily: FONT.display, lineHeight: 1.18 }}>
                Blóm fyrir tímamótin
              </h2>
              <p className="max-w-sm text-base leading-relaxed" style={{ fontFamily: FONT.body, color: C.inkSoft }}>
                Blómabúðin undir sama þaki. Fersk blóm og skreytingar, unnar eftir tilefni og óskum.
              </p>
            </div>
          </FadeUp>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            <StandInImage imgKey="bouquet1" alt="Blómvöndur með ljósum rósum í glervasa (myndskreyting)" aspect="3 / 4" reduced={reduced} tint={C.rose} className="md:mt-6" />
            <StandInImage imgKey="florist" alt="Hendur raða blómum í körfu á vinnuborði blómabúðar (myndskreyting)" aspect="3 / 4" reduced={reduced} tint={C.rose} delay={0.1} />
            <StandInImage imgKey="bouquet2" alt="Brúðkaupsvöndur með rósum og hnappa (myndskreyting)" aspect="3 / 4" reduced={reduced} tint={C.rose} className="md:mt-6" delay={0.2} />
          </div>
          <StandInLabel color={C.roseDark} />

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            {OCCASIONS.map((o) => (
              <span key={o} className="rounded-full px-4 py-1.5 text-sm font-medium" style={{ background: 'rgba(192,112,92,0.16)', color: C.roseDark, fontFamily: FONT.body }}>
                {o}
              </span>
            ))}
            <span className="text-sm" style={{ fontFamily: FONT.body, color: C.inkSoft }}>Verð fer eftir óskum, hafðu samband.</span>
          </div>
        </div>
      </section>

      {/* ========================================================= 5 · GIFTS */}
      <section id="gjafavara" className="w-full" style={{ background: C.ground }}>
        <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-10 px-5 py-20 md:grid-cols-2 md:gap-16 md:px-8 md:py-28">
          <FadeUp reduced={reduced} className="md:order-2">
            <SectionLabel n="04">Gjafavara</SectionLabel>
            <h2 className="mt-5 text-[clamp(1.9rem,4.4vw,3rem)]" style={{ fontFamily: FONT.display, lineHeight: 1.15 }}>
              Handverk og gjafir heim
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed" style={{ fontFamily: FONT.body, color: C.inkSoft }}>
              Íslenskt handverk, ull og gjafavara undir sama þaki. Fyrir utan búðina hanga lopapeysur á slá, tilvalið að grípa með sér gjöf af leiðinni.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {GIFTS.map((g) => (
                <span key={g} className="rounded-full px-4 py-1.5 text-sm font-medium" style={{ background: 'rgba(180,132,46,0.18)', color: C.mustardDark, fontFamily: FONT.body }}>
                  {g}
                </span>
              ))}
            </div>
          </FadeUp>
          <div className="md:order-1">
            <StandInImage imgKey="yarn" alt="Íslenskt ullargarn í hnyklum (myndskreyting)" aspect="4 / 5" reduced={reduced} tint={C.mustard} />
            <StandInLabel color={C.mustardDark} />
          </div>
        </div>
      </section>

      {/* ======================================================= 6 · REVIEWS */}
      <section className="w-full" style={{ background: C.ink }}>
        <div className="mx-auto w-full max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
          <FadeUp reduced={reduced}>
            <SectionLabel n="05" dark>Umsagnir</SectionLabel>
            <h2 className="mt-5 max-w-2xl text-[clamp(2rem,5vw,3.4rem)]" style={{ fontFamily: FONT.display, color: C.ground, lineHeight: 1.15 }}>
              Þau stoppuðu og komu aftur
            </h2>
          </FadeUp>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6">
            {REVIEWS.map((r, i) => (
              <FadeUp reduced={reduced} delay={i * 0.06} key={r.name}>
                <figure className="flex h-full flex-col rounded-[1.2rem] p-6 md:p-7" style={{ background: 'rgba(251,250,246,0.06)', border: '1px solid rgba(251,250,246,0.12)' }}>
                  <div className="flex items-center justify-between text-sm" style={{ fontFamily: FONT.body }}>
                    <Stars n={r.stars} />
                    <span style={{ color: 'rgba(251,250,246,0.7)' }}>{r.date}</span>
                  </div>
                  <blockquote lang="en" className="mt-4 flex-1 text-lg leading-relaxed" style={{ fontFamily: FONT.body, color: 'rgba(251,250,246,0.92)' }}>
                    {r.text}
                  </blockquote>
                  <figcaption className="mt-5 text-[0.72rem] uppercase" style={{ fontFamily: FONT.body, letterSpacing: '0.14em', color: C.ground }}>
                    {r.name}
                  </figcaption>
                </figure>
              </FadeUp>
            ))}
          </div>
          <p className="mt-6 text-[0.72rem] uppercase" style={{ fontFamily: FONT.body, letterSpacing: '0.1em', color: 'rgba(251,250,246,0.5)' }}>
            Umsagnir af Google, teknar saman á Wanderlog · um það bil 4,6 af 5
          </p>
        </div>
      </section>

      {/* ================================================= 7 · ROUTE 1 / TOWN */}
      <section id="a-leidinni" className="relative w-full overflow-hidden">
        {/* full-bleed background photo: mount-triggered + eager, not
            whileInView — a whileInView observer can race an element that's
            already past the viewport by the time it attaches (the exact
            "reveal fires unreliably" bug already hit elsewhere in this
            codebase), so this fires deterministically on mount instead. */}
        <motion.img
          src={asset(IMG.road)}
          alt="Þjóðvegur 1 liðast meðfram strönd og fjöllum (myndskreyting)"
          loading="eager"
          decoding="async"
          className="min-h-[60vh] w-full object-cover"
          style={{ objectPosition: '50% 55%' }}
          initial={reduced ? false : { opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: EASE }}
        />
        <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(20,44,32,0.88), rgba(20,44,32,0.3) 55%, rgba(20,44,32,0.5))' }} />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-[1240px] px-5 pb-14 md:px-8 md:pb-20">
            <FadeUp reduced={reduced}>
              <SectionLabel n="06" dark>Á leiðinni</SectionLabel>
              <h2 className="mt-4 max-w-3xl text-[clamp(1.9rem,4.6vw,3.2rem)]" style={{ fontFamily: FONT.display, color: C.ground, lineHeight: 1.18 }}>
                Stopp á þjóðvegi 1
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ fontFamily: FONT.body, color: 'rgba(251,250,246,0.9)' }}>
                Húnabúð stendur við þjóðveg 1 í Blönduósi, við hliðina á N1 stöðinni. Tilvalið stopp á leiðinni um Norðurland fyrir kaffi, blóm eða gjöf.
              </p>
              <p className="mt-4 max-w-xl rounded-2xl px-4 py-3 text-sm leading-relaxed" style={{ background: 'rgba(30,68,51,0.5)', color: 'rgba(251,250,246,0.9)', border: '1px solid rgba(251,250,246,0.18)', fontFamily: FONT.body }}>
                {STATUS_CAVEAT}
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ===================================================== 8 · PRACTICAL */}
      <section id="opnunartimi" className="w-full" style={{ background: C.ink, color: C.ground }}>
        <div className="mx-auto w-full max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
          <SectionLabel n="07" dark>Heimsókn</SectionLabel>
          <h2 className="mt-5 max-w-3xl text-[clamp(2.2rem,6vw,4.2rem)]" style={{ fontFamily: FONT.display, lineHeight: 1.15 }}>
            Kíktu við í Húnabúð
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
            <div className="space-y-8">
              <div>
                <p className="text-[0.68rem] uppercase" style={{ fontFamily: FONT.body, letterSpacing: '0.2em', color: 'rgba(251,250,246,0.55)' }}>Sími</p>
                <div className="mt-2 flex flex-col gap-1.5">
                  <a href={PHONE_MAIN_TEL} className={`text-3xl font-bold tracking-tight hover:underline md:text-4xl ${FOCUS}`} style={{ fontFamily: FONT.body, color: C.ground, outlineColor: C.ground }}>
                    {PHONE_MAIN}
                  </a>
                  <a href={PHONE_MOBILE_TEL} className={`text-lg hover:underline ${FOCUS}`} style={{ fontFamily: FONT.body, color: 'rgba(251,250,246,0.75)', outlineColor: C.ground }}>
                    {PHONE_MOBILE} (farsími)
                  </a>
                </div>
              </div>
              <div>
                <p className="text-[0.68rem] uppercase" style={{ fontFamily: FONT.body, letterSpacing: '0.2em', color: 'rgba(251,250,246,0.55)' }}>Heimilisfang</p>
                <a href={MAPS_HREF} target="_blank" rel="noreferrer" className={`mt-2 block text-lg hover:underline ${FOCUS}`} style={{ fontFamily: FONT.body, color: C.ground, outlineColor: C.ground }}>
                  {ADDRESS}
                </a>
                <p className="mt-1 text-sm" style={{ fontFamily: FONT.body, color: 'rgba(251,250,246,0.6)' }}>Við þjóðveg 1, við hliðina á N1</p>
              </div>
              <div>
                <p className="text-[0.68rem] uppercase" style={{ fontFamily: FONT.body, letterSpacing: '0.2em', color: 'rgba(251,250,246,0.55)' }}>Opnunartími</p>
                <ul className="mt-2 space-y-1.5">
                  {HOURS.map((h) => (
                    <li key={h.day} className="flex items-baseline justify-between gap-6 text-sm">
                      <span style={{ fontFamily: FONT.body, color: 'rgba(251,250,246,0.82)' }}>{h.day}</span>
                      <span style={{ fontFamily: FONT.body, color: C.ground }}>{h.time}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 max-w-xs text-xs leading-relaxed" style={{ fontFamily: FONT.body, color: 'rgba(251,250,246,0.6)' }}>
                  {STATUS_CAVEAT}
                </p>
              </div>
              <a
                href={PHONE_MAIN_TEL}
                className={`inline-flex min-h-11 items-center gap-2.5 rounded-full px-6 py-3.5 text-base font-semibold transition-transform hover:-translate-y-0.5 ${FOCUS}`}
                style={{ fontFamily: FONT.body, background: C.ground, color: C.ink, outlineColor: C.ground }}
              >
                <Phone className="h-4 w-4" aria-hidden />
                Hringdu · {PHONE_MAIN}
              </a>
            </div>

            <div className="overflow-hidden rounded-[1.4rem]" style={{ border: '1px solid rgba(251,250,246,0.16)' }}>
              <iframe
                title="Kort af staðsetningu Húnabúðar í Blönduósi"
                src={MAP_EMBED}
                loading="eager"
                className="h-full min-h-[360px] w-full"
                style={{ border: 0 }}
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <PreviewFooter company={company} />
    </div>
  )
}
