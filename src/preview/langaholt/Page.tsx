import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, FormEvent, ReactNode } from 'react'
import Lenis from 'lenis'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import {
  ADDRESS,
  ARRIVAL,
  BOOKING,
  BOOKING_URL,
  DISCLOSURE,
  EMAIL,
  GOLF,
  HERO,
  HERO_SRCSET,
  IMG,
  JSON_LD,
  NAV,
  PHONE,
  PHONE_HREF,
  PRACTICAL,
  RESTAURANT,
  REVIEWS,
  ROOMS,
  ROOMS_INTRO,
  STICKY,
  STORY,
  SURROUNDINGS,
} from './data'

const company = getPreviewCompany('langaholt')

/* ── „Sjóndeildarhringurinn" — one horizon line runs the whole page.
   Sky above carries the family's story; the shore below carries rooms,
   kitchen and golf. The ONE scroll-linked element is the horizon line's
   colour: dawn tan → dusk rust → aurora green, written raw per frame
   into CSS custom properties (no CSS transition on any scrubbed value). */

/* Palette — sampled from the hotel's own photography (brief C.2).
 * INK on GROUND ≈ 14.8:1 (AAA) · SAND on GROUND ≈ 7.9:1 (AA)
 * INK on ACCENT ≈ 6.9:1 (AA normal text) — CTA fills use INK text. */
const GROUND = '#10151C' // overcast Snæfellsnes sky before dusk
const NIGHT = '#0A0E14' // deepened ground for the closing night section
const INK = '#F3ECD9' // warm off-white, the sand path
const INK_SOFT = 'rgba(243,236,217,.78)'
const INK_MUTE = 'rgba(243,236,217,.62)'
const ACCENT = '#8E2F23' // barn red from the real window/door trim
const SAND = '#C9A468' // golden dune tan
const SLATE = '#5C6B76' // mountain silhouette — hairlines/dividers only
const HAIRLINE = 'rgba(243,236,217,.14)'
const AURORA = '#5FA97C' // green band sampled from the aurora photo

const EASE = 'cubic-bezier(.22,1,.36,1)'
const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3ECD9]'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ── Reveal — IntersectionObserver on an untransformed wrapper + CSS
   transition on itself (repo convention; framer whileInView stalls in this
   preview tooling). Failsafe is viewport-gated per craft-ledger #25: only
   elements near the initial viewport get force-shown, so below-fold
   choreography stays intact for real scrollers. Blur mode is the accent-safe
   display reveal (no overflow masks over Í/Á/Ó lines, ledger #23). */
function Reveal({
  children,
  delay = 0,
  y = 24,
  blur = false,
  className = '',
  style,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  y?: number
  blur?: boolean
  className?: string
  style?: CSSProperties
  as?: 'div' | 'figure' | 'li' | 'blockquote'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(() => prefersReduced())
  useEffect(() => {
    if (prefersReduced()) {
      setShown(true)
      return
    }
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
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
      { rootMargin: '0px 0px -8% 0px', threshold: 0.15 },
    )
    io.observe(el)
    // Viewport-gated failsafe: only near-fold elements, never the whole page.
    let t: number | undefined
    if (r.top < window.innerHeight * 1.3) t = window.setTimeout(() => setShown(true), 1600)
    return () => {
      io.disconnect()
      if (t) window.clearTimeout(t)
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
        filter: blur ? (shown ? 'blur(0px)' : 'blur(10px)') : undefined,
        transition: prefersReduced()
          ? undefined
          : `opacity .7s ${EASE} ${delay}ms, transform .7s ${EASE} ${delay}ms${blur ? `, filter .8s ${EASE} ${delay}ms` : ''}`,
      }}
    >
      {children}
    </Tag>
  )
}

/* ── ClipImg — standalone content photo with its own aspect box: clip-path
   wipe + settle on viewport entry. Observer sits on the untransformed,
   unclipped figure; only the inner img animates (ledger #7). Full-bleed
   section backgrounds never use this — they render eager (ledger #12). */
function ClipImg({
  src,
  alt,
  aspect,
  caption,
  className = '',
  sizes,
  fallbackClassName = 'bg-gradient-to-br from-[#2a3440] to-[#141a22]',
}: {
  src: string
  alt: string
  aspect: string
  caption?: string
  className?: string
  sizes?: string
  fallbackClassName?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(() => prefersReduced())
  useEffect(() => {
    if (prefersReduced()) {
      setShown(true)
      return
    }
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
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
      { threshold: 0.18 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div className={className}>
      <figure ref={ref} className={`relative m-0 overflow-hidden ${aspect}`}>
        <Img
          src={src}
          alt={alt}
          sizes={sizes}
          className="absolute inset-0 h-full w-full object-cover"
          style={
            prefersReduced()
              ? undefined
              : {
                  clipPath: shown ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)',
                  transform: shown ? 'scale(1)' : 'scale(1.07)',
                  transition: `clip-path .9s ${EASE}, transform 1.15s ${EASE}`,
                }
          }
          fallbackClassName={fallbackClassName}
        />
      </figure>
      {caption && (
        <p className="mt-2.5 font-mono text-[11px] leading-relaxed tracking-[0.04em]" style={{ color: INK_MUTE }}>
          {caption}
        </p>
      )}
    </div>
  )
}

/* ── Horizon — the signature line. Colour/width come from the page-level
   CSS variables the scroll writer updates; the element itself is static. */
function Horizon({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={{
        height: 'var(--hz-w)',
        background: 'linear-gradient(90deg, var(--hz-c1), var(--hz-c2), var(--hz-c1))',
        opacity: 0.9,
        ...style,
      }}
    />
  )
}

/* ── Mono eyebrow label ───────────────────────────────────────────────── */
function Label({ children, color = SAND }: { children: ReactNode; color?: string }) {
  return (
    <p className="m-0 font-mono text-[11.5px] font-bold uppercase tracking-[0.22em]" style={{ color }}>
      {children}
    </p>
  )
}

/* ══════════════════════════ NAV ═══════════════════════════════════════ */
function TopNav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' })
  return (
    <nav
      aria-label="Aðalvalmynd"
      className="fixed inset-x-0 top-0 z-40"
      style={{
        background: scrolled ? 'rgba(16,21,28,.9)' : 'transparent',
        borderBottom: `1px solid ${scrolled ? HAIRLINE : 'transparent'}`,
        backdropFilter: scrolled ? 'blur(10px)' : undefined,
        WebkitBackdropFilter: scrolled ? 'blur(10px)' : undefined,
        transition: 'background .35s ease, border-color .35s ease',
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' })}
          className={`font-display text-[19px] font-semibold leading-none ${FOCUS}`}
          style={{ color: INK }}
        >
          Langaholt
        </button>
        <div className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className={`font-sans text-[13.5px] font-medium transition-opacity hover:opacity-75 ${FOCUS}`}
              style={{ color: INK_SOFT }}
            >
              {n.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-5">
          <a
            href={PHONE_HREF}
            className={`hidden font-mono text-[12.5px] tracking-[0.02em] transition-opacity hover:opacity-75 sm:block ${FOCUS}`}
            style={{ color: INK_SOFT }}
          >
            {PHONE}
          </a>
          <button
            onClick={() => go('boka')}
            className={`inline-flex min-h-[44px] items-center rounded-[2px] px-4 font-sans text-[13px] font-bold transition-transform active:scale-[0.98] ${FOCUS}`}
            style={{ background: ACCENT, color: INK }}
          >
            Bóka gistingu
          </button>
        </div>
      </div>
    </nav>
  )
}

/* ══════════════════════════ HERO ══════════════════════════════════════ */
function Hero() {
  const reduced = prefersReduced()
  return (
    <header className="relative min-h-[100svh] overflow-hidden" style={{ background: GROUND }}>
      {/* Full-bleed real beach-horizon photo — mount-triggered (ledger #12). */}
      <motion.div
        className="absolute inset-0"
        initial={reduced ? false : { opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Img
          src={IMG.hero1280}
          srcSet={HERO_SRCSET}
          sizes="100vw"
          alt={HERO.alt}
          fetchpriority="high"
          loading="eager"
          className="h-full w-full object-cover"
          fallbackClassName="bg-gradient-to-b from-[#5C6B76] to-[#C9A468]"
        />
      </motion.div>
      {/* Scrim for AA text over the photo — strengthened per contrast review:
          .12/.28 mid-stops measured ~2.6-2.8:1 against a mid-grey sky, failing
          both the 4.5:1 eyebrow floor and the 3:1 large-text floor. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(16,21,28,.42) 0%, rgba(16,21,28,.35) 38%, rgba(16,21,28,.6) 62%, rgba(16,21,28,.9) 100%)',
        }}
      />
      {/* Second, localized scrim under the bottom-left copy column — belt and
          braces so the eyebrow/headline stack always sits over near-black,
          regardless of what the sky/cloud pixels behind it happen to be. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[62%]"
        style={{
          background: 'radial-gradient(120% 100% at 20% 100%, rgba(16,21,28,.8) 0%, rgba(16,21,28,0) 72%)',
        }}
      />
      {/* The horizon line draws itself in on mount (1.2s), sitting on the
          photo's own horizon. Scroll only recolours it, never redraws. */}
      <div aria-hidden className="absolute inset-x-0 top-[56%] md:top-[54%]">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="block h-[40px] w-full" fill="none">
          <defs>
            <linearGradient id="lh-hz" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" style={{ stopColor: 'var(--hz-c1)' } as CSSProperties} />
              <stop offset="0.55" style={{ stopColor: 'var(--hz-c2)' } as CSSProperties} />
              <stop offset="1" style={{ stopColor: 'var(--hz-c1)' } as CSSProperties} />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,22 C180,18 340,26 600,21 C860,16 1040,24 1200,20"
            stroke="url(#lh-hz)"
            strokeWidth="2.4"
            strokeLinecap="round"
            initial={reduced ? false : { pathLength: 0, opacity: 0.4 }}
            animate={{ pathLength: 1, opacity: 0.95 }}
            transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1], delay: 0.35 }}
          />
        </svg>
      </div>

      {/* Copy block — staggered, rise+blur (accent-safe, no masks) */}
      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-[clamp(84px,14vh,150px)] pt-28 md:px-8">
        <Reveal blur y={18} delay={100}>
          {/* INK, not SAND: with the scrim strengthened above this is the
              belt-and-braces choice for the smallest text in the hero. */}
          <Label color={INK}>{HERO.eyebrow}</Label>
        </Reveal>
        <h1
          className="m-0 mt-5 font-display font-medium"
          /* One unbreakable 21-char word ("Sjóndeildarhringurinn") — floor must
             stay small enough to fit a 320px viewport, so vw leads the clamp.
             overflowWrap/wordBreak are a graceful-break failsafe (rather than a
             silent clip against the header's overflow-hidden) if any device
             renders Fraunces wider than measured. */
          style={{
            color: INK,
            fontSize: 'clamp(1.35rem,7.5vw,4.6rem)',
            lineHeight: 1.16,
            letterSpacing: '-0.01em',
            overflowWrap: 'anywhere',
            wordBreak: 'break-word',
          }}
        >
          <Reveal blur y={26} delay={240} className="block">
            {HERO.h1a}
          </Reveal>
          <Reveal blur y={26} delay={380} className="block" style={{ color: SAND }}>
            {HERO.h1b}
          </Reveal>
        </h1>
        <Reveal delay={560} y={18}>
          <p className="mt-6 max-w-[52ch] font-sans text-[15.5px] leading-[1.65]" style={{ color: INK_SOFT }}>
            {HERO.sub}
          </p>
        </Reveal>
        <Reveal delay={700} y={14}>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => document.getElementById('boka')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })}
              className={`inline-flex min-h-[50px] items-center rounded-[2px] px-7 font-sans text-[14.5px] font-bold transition-transform active:scale-[0.98] ${FOCUS}`}
              style={{ background: ACCENT, color: INK }}
            >
              {HERO.ctaPrimary}
            </button>
            <button
              onClick={() =>
                document.getElementById('herbergi')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
              }
              className={`inline-flex min-h-[50px] items-center rounded-[2px] border px-7 font-sans text-[14.5px] font-semibold transition-colors hover:bg-[rgba(243,236,217,.08)] ${FOCUS}`}
              style={{ borderColor: 'rgba(243,236,217,.4)', color: INK }}
            >
              {HERO.ctaSecondary}
            </button>
          </div>
        </Reveal>
      </div>
    </header>
  )
}

/* ═════════════════ ARRIVAL — the concept declares itself ══════════════ */
function Arrival() {
  return (
    <section id="stadurinn" style={{ background: GROUND }} className="py-[clamp(72px,10vw,128px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid items-center gap-x-14 gap-y-10 md:grid-cols-2">
          <div className="relative">
            <ClipImg
              src={IMG.exterior}
              alt={ARRIVAL.alt}
              aspect="aspect-[3/2]"
              caption={ARRIVAL.caption}
              sizes="(max-width:768px) 100vw, 50vw"
            />
            {/* The page's line meets the photo's own mountain horizon. */}
            <Horizon className="absolute inset-x-[-12px] top-[42%] md:inset-x-[-24px]" />
          </div>
          <div>
            <Reveal>
              <h2
                className="m-0 font-display font-medium"
                style={{ color: INK, fontSize: 'clamp(1.7rem,3.4vw,2.6rem)', lineHeight: 1.18 }}
              >
                {ARRIVAL.heading}
              </h2>
            </Reveal>
            <Reveal delay={90}>
              <p className="mt-5 max-w-[54ch] font-sans text-[15.5px] leading-[1.7]" style={{ color: INK_SOFT }}>
                {ARRIVAL.body1}
              </p>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-4 max-w-[54ch] font-sans text-[14.5px] leading-[1.7]" style={{ color: INK_MUTE }}>
                {ARRIVAL.body2}
              </p>
            </Reveal>
            <div className="mt-9 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4">
              {ARRIVAL.stats.map((s, i) => (
                <Reveal key={s.label} delay={200 + i * 80} y={16}>
                  <div className="font-display text-[2rem] font-medium leading-none" style={{ color: SAND }}>
                    {s.value}
                  </div>
                  <div className="mt-2 font-mono text-[11px] uppercase leading-snug tracking-[0.08em]" style={{ color: INK_MUTE }}>
                    {s.label}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═════════════════ STORY — the sky band, since 1978 ═══════════════════ */
function Story() {
  return (
    <section
      id="saga"
      className="border-t py-[clamp(72px,10vw,128px)]"
      style={{ background: GROUND, borderColor: HAIRLINE }}
      aria-label="Saga Langaholts"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <Label>Fjölskyldan á Ytri-Görðum</Label>
        </Reveal>
        <Reveal blur delay={90}>
          <h2
            className="m-0 mt-4 font-display font-medium"
            style={{ color: INK, fontSize: 'clamp(2.2rem,5.5vw,4rem)', lineHeight: 1.16 }}
          >
            {STORY.heading}
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-5 max-w-[60ch] font-sans text-[15.5px] leading-[1.7]" style={{ color: INK_SOFT }}>
            {STORY.intro}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-x-14 gap-y-12 lg:grid-cols-[1.1fr_0.9fr]">
          <ol className="m-0 grid list-none gap-y-6 p-0 sm:grid-cols-2 sm:gap-x-10">
            {STORY.timeline.map((t, i) => (
              <Reveal
                key={t.year}
                as="li"
                delay={i * 60}
                y={18}
                className="flex gap-4 border-t pt-4"
                style={{ borderColor: HAIRLINE }}
              >
                <span className="shrink-0 font-mono text-[13px] font-bold tabular-nums" style={{ color: SAND }}>
                  {t.year}
                </span>
                <span className="font-sans text-[13.5px] leading-[1.6]" style={{ color: INK_SOFT }}>
                  {t.text}
                </span>
              </Reveal>
            ))}
          </ol>
          <div>
            <div className="relative">
              <ClipImg
                src={IMG.loungeShelf}
                alt={STORY.shelfAlt}
                aspect="aspect-[3/2]"
                caption={STORY.shelfCaption}
                sizes="(max-width:1024px) 100vw, 40vw"
              />
              {/* The line continues through the Story section too (craft review). */}
              <Horizon className="absolute inset-x-0 top-[38%]" />
            </div>
            <Reveal delay={120} as="blockquote" className="m-0 mt-9 p-0">
              <p
                lang="en"
                className="m-0 font-tall italic"
                style={{ color: INK, fontSize: 'clamp(1.35rem,2.4vw,1.7rem)', lineHeight: 1.4 }}
              >
                {STORY.motto}
              </p>
              <footer className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: INK_MUTE }}>
                {STORY.mottoLabel}
              </footer>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═════════════════ ROOMS — every room, a window ═══════════════════════ */
function Rooms() {
  const reduced = prefersReduced()
  return (
    <section id="herbergi" style={{ background: GROUND }} className="py-[clamp(72px,10vw,128px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal blur>
          <h2
            className="m-0 font-display font-medium"
            style={{ color: INK, fontSize: 'clamp(1.9rem,4vw,3rem)', lineHeight: 1.18 }}
          >
            {ROOMS_INTRO.heading}
          </h2>
        </Reveal>
        <Reveal delay={90}>
          <p className="mt-4 max-w-[58ch] font-sans text-[15.5px] leading-[1.7]" style={{ color: INK_SOFT }}>
            {ROOMS_INTRO.body}
          </p>
        </Reveal>

        {/* The best window-view shot leads the section, framed in the same
            barn red as the hotel's real window trim — the motif comes from
            the photographs, not from an invented system. */}
        <Reveal delay={140} className="mt-12">
          <div className="relative border-[3px] p-2 sm:p-3" style={{ borderColor: ACCENT, background: 'rgba(142,47,35,.08)' }}>
            <ClipImg
              src={IMG.roomWindow}
              alt={ROOMS_INTRO.featureAlt}
              aspect="aspect-[16/9] sm:aspect-[21/9]"
              sizes="(max-width:1200px) 100vw, 1104px"
            />
            {/* The line continues through Rooms too (craft review — every
                section should carry the horizon motif). */}
            <Horizon className="absolute inset-x-2 top-[46%] sm:inset-x-3" />
          </div>
          <p className="mt-2.5 font-mono text-[11px] tracking-[0.04em]" style={{ color: INK_MUTE }}>
            {ROOMS_INTRO.featureCaption}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {ROOMS.map((r, i) => (
            <Reveal key={r.name} as="figure" delay={i * 90} y={22} className="m-0 flex flex-col">
              <div className="border-2 p-1.5" style={{ borderColor: ACCENT, background: 'rgba(142,47,35,.07)' }}>
                <ClipImg
                  src={r.img}
                  alt={r.alt}
                  aspect="aspect-[4/3]"
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                />
              </div>
              <figcaption className="flex flex-1 flex-col pt-4">
                <p className="m-0 font-mono text-[10.5px] uppercase tracking-[0.2em]" style={{ color: INK_MUTE }}>
                  {r.tag}
                </p>
                <h3 className="m-0 mt-2 font-display text-[1.25rem] font-medium leading-[1.2]" style={{ color: INK }}>
                  {r.name}
                </h3>
                <p className="mt-2 flex-1 font-sans text-[13px] leading-[1.6]" style={{ color: INK_SOFT }}>
                  {r.desc}
                </p>
                <p className="mt-3 font-mono text-[13.5px] font-bold" style={{ color: SAND }}>
                  frá {r.price} <span className="font-normal" style={{ color: INK_MUTE }}>nóttin</span>
                </p>
                <button
                  onClick={() =>
                    document.getElementById('boka')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
                  }
                  className={`mt-3 inline-flex min-h-[44px] items-center self-start border-b pb-1 font-sans text-[13px] font-bold transition-opacity hover:opacity-75 ${FOCUS}`}
                  style={{ color: INK, borderColor: SAND }}
                >
                  Skoða verð og bóka
                </button>
              </figcaption>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <p className="mt-8 font-sans text-[12.5px] leading-relaxed" style={{ color: INK_MUTE }}>
            {ROOMS_INTRO.note}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ═════════════════ RESTAURANT — the daily-catch board ═════════════════ */
function Restaurant() {
  return (
    <section id="veitingar" style={{ background: GROUND }}>
      {/* Full-bleed fisherman opener — eager render, scrim for AA (ledger #12). */}
      <div className="relative min-h-[72svh] overflow-hidden">
        <Img
          src={IMG.fisherman}
          alt={RESTAURANT.fishermanAlt}
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
          fallbackClassName="bg-gradient-to-b from-[#5C6B76] to-[#10151C]"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(16,21,28,.5) 0%, rgba(16,21,28,.15) 40%, rgba(16,21,28,.88) 100%)',
          }}
        />
        <Horizon className="absolute inset-x-0 top-[38%]" />
        <div className="relative mx-auto flex min-h-[72svh] max-w-6xl flex-col justify-end px-5 pb-14 pt-24 md:px-8">
          <Reveal>
            <Label>Veitingastofan · 60 sæti</Label>
          </Reveal>
          <Reveal blur delay={90}>
            <h2
              className="m-0 mt-4 max-w-[16ch] font-display font-medium"
              style={{ color: INK, fontSize: 'clamp(1.9rem,4.4vw,3.4rem)', lineHeight: 1.16 }}
            >
              {RESTAURANT.heading}
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-4 max-w-[56ch] font-sans text-[15px] leading-[1.7]" style={{ color: INK_SOFT }}>
              {RESTAURANT.sub}
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-[clamp(64px,8vw,104px)] md:px-8">
        {/* Catch board — mono, like the handwritten cards on their buffet. */}
        <div
          className="grid gap-x-10 gap-y-3 border-y py-7 sm:grid-cols-2 lg:grid-cols-4"
          style={{ borderColor: HAIRLINE }}
        >
          {RESTAURANT.board.map((b, i) => (
            <Reveal key={b.label} delay={i * 70} y={12} className="flex items-baseline justify-between gap-3 sm:block">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: SAND }}>
                {b.label}
              </span>
              <span className="block font-sans text-[14.5px] font-medium sm:mt-1.5" style={{ color: INK }}>
                {b.value}
              </span>
            </Reveal>
          ))}
        </div>

        {/* Hours + prices — plain, scannable, no puzzle. */}
        <div className="mt-12 grid gap-9 md:grid-cols-3">
          {RESTAURANT.menu.map((m, i) => (
            <Reveal key={m.name} delay={i * 90} y={20}>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="m-0 font-display text-[1.3rem] font-medium" style={{ color: INK }}>
                  {m.name}
                </h3>
                <span className="shrink-0 font-mono text-[13.5px] font-bold" style={{ color: SAND }}>
                  {m.price}
                </span>
              </div>
              <p className="mt-1.5 font-mono text-[12px] tracking-[0.06em]" style={{ color: INK_MUTE }}>
                {m.hours}
              </p>
              <p className="mt-3 font-sans text-[13.5px] leading-[1.65]" style={{ color: INK_SOFT }}>
                {m.note}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Kitchen photos + from-scratch claim */}
        <div className="mt-14 grid items-end gap-7 md:grid-cols-[1.2fr_1fr_0.8fr]">
          <ClipImg
            src={IMG.breakfast}
            alt={RESTAURANT.breakfastAlt}
            aspect="aspect-[4/3]"
            caption={RESTAURANT.breakfastCaption}
            sizes="(max-width:768px) 100vw, 40vw"
          />
          <ClipImg
            src={IMG.dinnerPlate}
            alt={RESTAURANT.plateAlt}
            aspect="aspect-[4/3]"
            caption={RESTAURANT.plateCaption}
            sizes="(max-width:768px) 100vw, 33vw"
          />
          <ClipImg
            src={IMG.kitchenPrep}
            alt={RESTAURANT.prepAlt}
            aspect="aspect-square"
            caption={RESTAURANT.prepCaption}
            sizes="(max-width:768px) 100vw, 25vw"
          />
        </div>
        <Reveal delay={100}>
          <p
            className="mt-10 max-w-[46ch] font-tall italic"
            style={{ color: INK, fontSize: 'clamp(1.25rem,2.2vw,1.55rem)', lineHeight: 1.45 }}
          >
            {RESTAURANT.kitchenClaim}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ═════════════════ SURROUNDINGS ═══════════════════════════════════════ */
function Surroundings() {
  return (
    <section id="umhverfi" style={{ background: GROUND }} className="py-[clamp(64px,9vw,112px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal blur>
          <h2
            className="m-0 font-display font-medium"
            style={{ color: INK, fontSize: 'clamp(1.9rem,4vw,3rem)', lineHeight: 1.18 }}
          >
            {SURROUNDINGS.heading}
          </h2>
        </Reveal>
        <Reveal delay={90}>
          <p className="mt-4 max-w-[60ch] font-sans text-[15.5px] leading-[1.7]" style={{ color: INK_SOFT }}>
            {SURROUNDINGS.body}
          </p>
        </Reveal>

        <ul className="m-0 mt-9 grid list-none gap-x-10 gap-y-4 p-0 sm:grid-cols-2">
          {SURROUNDINGS.items.map((it, i) => (
            <Reveal
              key={it.name}
              as="li"
              delay={i * 70}
              y={14}
              className="flex items-baseline justify-between gap-4 border-t pt-4"
              style={{ borderColor: HAIRLINE }}
            >
              <span className="font-sans text-[14.5px] font-semibold" style={{ color: INK }}>
                {it.name}
              </span>
              <span className="shrink-0 text-right font-mono text-[11.5px] tracking-[0.04em]" style={{ color: SAND }}>
                {it.detail}
              </span>
            </Reveal>
          ))}
        </ul>

        <div className="relative mt-12 grid gap-7 sm:grid-cols-3">
          {SURROUNDINGS.photos.map((p) => (
            <ClipImg
              key={p.caption}
              src={p.img}
              alt={p.alt}
              aspect="aspect-[4/3]"
              caption={p.caption}
              sizes="(max-width:640px) 100vw, 33vw"
            />
          ))}
          {/* One line connecting all three photo horizons at once (craft review). */}
          <Horizon className="absolute inset-x-0 top-[38%]" />
        </div>

        <Reveal delay={120}>
          <p
            className="mx-auto mt-14 max-w-[38ch] text-center font-tall italic"
            style={{ color: SAND, fontSize: 'clamp(1.3rem,2.4vw,1.7rem)', lineHeight: 1.45 }}
          >
            {SURROUNDINGS.folklore}
          </p>
          <p className="mt-3 text-center font-sans text-[12.5px]" style={{ color: INK_MUTE }}>
            {SURROUNDINGS.auroraNote}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ═════════════════ REVIEWS — real words, no invented score ════════════ */
function Reviews() {
  return (
    <section
      id="umsagnir"
      className="relative border-t py-[clamp(64px,9vw,112px)]"
      style={{ background: GROUND, borderColor: HAIRLINE }}
      aria-label="Umsagnir gesta"
    >
      {/* The line continues at the section boundary too (craft review). */}
      <Horizon className="absolute inset-x-0 top-0" />
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal blur>
          <h2
            className="m-0 font-display font-medium"
            style={{ color: INK, fontSize: 'clamp(1.8rem,3.6vw,2.7rem)', lineHeight: 1.2 }}
          >
            Gestir hafa orðið
          </h2>
        </Reveal>
        <div className="mt-11 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {REVIEWS.map((r, i) => (
            <Reveal
              key={r.name}
              as="blockquote"
              delay={i * 90}
              y={20}
              className="m-0 border-t p-0 pt-6"
              style={{ borderColor: HAIRLINE }}
            >
              <p lang={r.lang} className="m-0 font-tall text-[1.25rem] italic leading-[1.5]" style={{ color: INK }}>
                {r.quote}
              </p>
              <footer className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-sans text-[13px] font-semibold" style={{ color: INK_SOFT }}>
                  {r.name}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.1em]" style={{ color: INK_MUTE }}>
                  {r.source}
                </span>
              </footer>
            </Reveal>
          ))}
        </div>
        <Reveal delay={140}>
          <blockquote className="m-0 mt-14 border-t p-0 pt-8 text-center" style={{ borderColor: HAIRLINE }}>
            <p
              lang="en"
              className="mx-auto max-w-[52ch] font-tall italic"
              style={{ color: SAND, fontSize: 'clamp(1.2rem,2.2vw,1.5rem)', lineHeight: 1.5 }}
            >
              {STORY.gemQuote}
            </p>
            <footer className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: INK_MUTE }}>
              {STORY.gemAttribution}
            </footer>
          </blockquote>
        </Reveal>
      </div>
    </section>
  )
}

/* ═════════════════ GOLF — ending at the green ═════════════════════════ */
function Golf() {
  return (
    <section id="golf" style={{ background: GROUND }} className="py-[clamp(72px,10vw,128px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="relative">
          <ClipImg
            src={IMG.golfGreen}
            alt={GOLF.alt}
            aspect="aspect-[16/9] md:aspect-[21/9]"
            caption={GOLF.caption}
            sizes="(max-width:1200px) 100vw, 1104px"
          />
          <Horizon className="absolute inset-x-0 top-[26%]" />
        </div>

        <div className="mt-12 grid gap-x-14 gap-y-10 md:grid-cols-2">
          <div>
            <Reveal>
              <Label>Golfklúbbur Staðarsveitar · stofnaður á Langaholti 1998</Label>
            </Reveal>
            <Reveal blur delay={80}>
              <h2
                className="m-0 mt-4 font-display font-medium"
                style={{ color: INK, fontSize: 'clamp(1.9rem,4vw,3rem)', lineHeight: 1.18 }}
              >
                {GOLF.heading}
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-5 max-w-[54ch] font-sans text-[15.5px] leading-[1.7]" style={{ color: INK_SOFT }}>
                {GOLF.body1}
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-4 max-w-[54ch] font-sans text-[14.5px] leading-[1.7]" style={{ color: INK_MUTE }}>
                {GOLF.body2}
              </p>
            </Reveal>
            <Reveal delay={250}>
              <ul className="m-0 mt-7 flex list-none flex-wrap gap-x-6 gap-y-2 p-0">
                {GOLF.facts.map((f) => (
                  <li
                    key={f}
                    className="font-mono text-[12px] font-bold uppercase tracking-[0.12em]"
                    style={{ color: SAND }}
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={140}>
            <h3 className="m-0 font-display text-[1.35rem] font-medium" style={{ color: INK }}>
              {GOLF.packagesHeading}
            </h3>
            <dl className="m-0 mt-5">
              {GOLF.packages.map((p) => (
                <div
                  key={p.name}
                  className="flex items-baseline justify-between gap-4 border-t py-3.5"
                  style={{ borderColor: HAIRLINE }}
                >
                  <dt className="font-sans text-[14px]" style={{ color: INK_SOFT }}>
                    {p.name}
                  </dt>
                  <dd className="m-0 shrink-0 font-mono text-[14px] font-bold tabular-nums" style={{ color: SAND }}>
                    {p.price}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 font-sans text-[12.5px]" style={{ color: INK_MUTE }}>
              {GOLF.packagesNote}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${EMAIL}?subject=${encodeURIComponent('Golfpakki á Langaholti')}`}
                className={`inline-flex min-h-[46px] items-center rounded-[2px] px-6 font-sans text-[13.5px] font-bold transition-transform active:scale-[0.98] ${FOCUS}`}
                style={{ background: ACCENT, color: INK }}
              >
                {GOLF.cta}
              </a>
              <a
                href={PHONE_HREF}
                className={`font-mono text-[13px] transition-opacity hover:opacity-75 ${FOCUS}`}
                style={{ color: INK_SOFT }}
              >
                {PHONE}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ═════════════════ PRACTICAL INFO ═════════════════════════════════════ */
function Practical() {
  return (
    <section
      id="hagnytt"
      className="relative border-t py-[clamp(56px,8vw,96px)]"
      style={{ background: GROUND, borderColor: HAIRLINE }}
      aria-label="Hagnýtar upplýsingar"
    >
      {/* The line continues at the section boundary too (craft review). */}
      <Horizon className="absolute inset-x-0 top-0" />
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-x-14 gap-y-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="m-0 font-display text-[1.5rem] font-medium" style={{ color: INK }}>
              {PRACTICAL.heading}
            </h2>
            <a
              href={PHONE_HREF}
              className={`mt-6 block font-display font-medium leading-none transition-opacity hover:opacity-80 ${FOCUS}`}
              style={{ color: SAND, fontSize: 'clamp(2rem,5vw,3.4rem)' }}
            >
              {PHONE}
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className={`mt-4 inline-block font-sans text-[15.5px] underline underline-offset-4 transition-opacity hover:opacity-75 ${FOCUS}`}
              style={{ color: INK_SOFT }}
            >
              {EMAIL}
            </a>
            <p className="mt-6 max-w-[50ch] font-sans text-[14.5px] leading-[1.7]" style={{ color: INK_SOFT }}>
              {PRACTICAL.findBody}
            </p>
            <p className="mt-3 font-mono text-[12.5px] tracking-[0.04em]" style={{ color: INK_MUTE }}>
              {ADDRESS}
              {' · '}
              <a
                href={PRACTICAL.mapHref}
                target="_blank"
                rel="noreferrer"
                className={`underline underline-offset-4 ${FOCUS}`}
                style={{ color: INK_SOFT }}
              >
                Opna kort
              </a>
            </p>
          </div>
          <div>
            <h3 className="m-0 font-mono text-[11.5px] font-bold uppercase tracking-[0.2em]" style={{ color: SAND }}>
              {PRACTICAL.hoursHeading}
            </h3>
            <dl className="m-0 mt-4">
              {PRACTICAL.hours.map((h) => (
                <div
                  key={h.name}
                  className="flex items-baseline justify-between border-t py-3"
                  style={{ borderColor: HAIRLINE }}
                >
                  <dt className="font-sans text-[14px]" style={{ color: INK_SOFT }}>
                    {h.name}
                  </dt>
                  <dd className="m-0 font-mono text-[13px] tabular-nums" style={{ color: INK }}>
                    {h.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═════════════════ BOOKING BRIDGE — aurora night, 100% ════════════════ */
type BookingDraft = { checkin: string; checkout: string; guests: string; room: string }

function BookingBridge() {
  const [checkin, setCheckin] = useState('')
  const [checkout, setCheckout] = useState('')
  const [guests, setGuests] = useState(BOOKING.guestOptions[1])
  const [room, setRoom] = useState(ROOMS[0].name)
  /* Receipt snapshots at submit (craft-ledger #25) */
  const [draft, setDraft] = useState<BookingDraft | null>(null)
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setDraft({ checkin, checkout, guests, room })
  }
  const inputCls =
    'mt-2 block w-full rounded-[2px] border bg-transparent px-3.5 py-3 font-sans text-[14px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3ECD9]'
  const inputStyle: CSSProperties = { borderColor: 'rgba(243,236,217,.32)', color: INK, colorScheme: 'dark' }
  const labelCls = 'block font-mono text-[11px] font-bold uppercase tracking-[0.16em]'

  return (
    <section id="boka" className="relative overflow-hidden" style={{ background: NIGHT }}>
      {/* Aurora night photo — eager full-bleed background (ledger #12). */}
      <Img
        src={IMG.aurora}
        alt=""
        aria-hidden
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        fallbackClassName="bg-gradient-to-b from-[#0A0E14] to-[#10231a]"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          /* Top stop thickened (.55 -> .68): the AURORA-green "Bókun" eyebrow
             sits near this stop and green-on-green over aurora bands was
             unverified contrast risk (review C.5/contrast). */
          background:
            'linear-gradient(180deg, rgba(10,14,20,.68) 0%, rgba(10,14,20,.72) 55%, rgba(10,14,20,.95) 100%)',
        }}
      />
      {/* Static stars, scroll-mapped opacity via --stars (part of the ONE signature) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[46%]"
        style={{
          opacity: 'var(--stars)',
          backgroundImage:
            'radial-gradient(1.5px 1.5px at 12% 30%, rgba(243,236,217,.9), transparent 60%), radial-gradient(1px 1px at 28% 62%, rgba(243,236,217,.7), transparent 60%), radial-gradient(1.5px 1.5px at 43% 22%, rgba(243,236,217,.8), transparent 60%), radial-gradient(1px 1px at 58% 48%, rgba(243,236,217,.6), transparent 60%), radial-gradient(1.5px 1.5px at 71% 28%, rgba(243,236,217,.85), transparent 60%), radial-gradient(1px 1px at 84% 56%, rgba(243,236,217,.7), transparent 60%), radial-gradient(1.5px 1.5px at 93% 18%, rgba(243,236,217,.8), transparent 60%)',
        }}
      />
      <Horizon className="absolute inset-x-0 top-[42%]" />

      <div className="relative mx-auto max-w-6xl px-5 py-[clamp(88px,13vw,168px)] md:px-8">
        <Reveal>
          <Label color={AURORA}>Bókun</Label>
        </Reveal>
        <Reveal blur delay={90}>
          <h2
            className="m-0 mt-4 max-w-[18ch] font-display font-medium"
            style={{ color: INK, fontSize: 'clamp(2rem,4.6vw,3.5rem)', lineHeight: 1.16 }}
          >
            {BOOKING.heading}
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-4 max-w-[52ch] font-sans text-[15px] leading-[1.65]" style={{ color: INK_SOFT }}>
            {BOOKING.sub}
          </p>
        </Reveal>

        <Reveal delay={220} className="mt-10">
          {draft === null ? (
            <form
              onSubmit={onSubmit}
              className="grid max-w-4xl gap-5 border p-6 sm:grid-cols-2 md:p-8 lg:grid-cols-[1fr_1fr_0.8fr_1.2fr_auto] lg:items-end"
              style={{
                borderColor: 'rgba(243,236,217,.22)',
                background: 'rgba(10,14,20,.72)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
              }}
            >
              <div>
                <label htmlFor="lh-checkin" className={labelCls} style={{ color: SAND }}>
                  {BOOKING.fields.checkin}
                </label>
                <input
                  id="lh-checkin"
                  type="date"
                  required
                  value={checkin}
                  onChange={(e) => setCheckin(e.target.value)}
                  className={inputCls}
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="lh-checkout" className={labelCls} style={{ color: SAND }}>
                  {BOOKING.fields.checkout}
                </label>
                <input
                  id="lh-checkout"
                  type="date"
                  required
                  value={checkout}
                  onChange={(e) => setCheckout(e.target.value)}
                  className={inputCls}
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="lh-guests" className={labelCls} style={{ color: SAND }}>
                  {BOOKING.fields.guests}
                </label>
                <select
                  id="lh-guests"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className={inputCls}
                  style={inputStyle}
                >
                  {BOOKING.guestOptions.map((g) => (
                    <option key={g} value={g} style={{ color: '#10151C' }}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="lh-room" className={labelCls} style={{ color: SAND }}>
                  {BOOKING.fields.room}
                </label>
                <select
                  id="lh-room"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className={inputCls}
                  style={inputStyle}
                >
                  {ROOMS.map((r) => (
                    <option key={r.name} value={r.name} style={{ color: '#10151C' }}>
                      {r.name} · frá {r.price}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className={`inline-flex min-h-[50px] items-center justify-center rounded-[2px] px-6 font-sans text-[14px] font-bold transition-transform active:scale-[0.98] sm:col-span-2 lg:col-span-1 ${FOCUS}`}
                style={{ background: ACCENT, color: INK }}
              >
                {BOOKING.fields.submit}
              </button>
            </form>
          ) : (
            <div
              className="max-w-2xl border p-7 md:p-9"
              style={{
                borderColor: 'rgba(243,236,217,.22)',
                background: 'rgba(10,14,20,.8)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
              }}
            >
              <h3 className="m-0 font-display text-[1.4rem] font-medium" style={{ color: INK }}>
                {BOOKING.handoffTitle}
              </h3>
              <p className="mt-3 font-mono text-[12.5px] leading-relaxed tracking-[0.02em]" style={{ color: SAND }}>
                {draft.room} · {draft.guests}
                {draft.checkin && draft.checkout ? ` · ${draft.checkin} til ${draft.checkout}` : ''}
              </p>
              <p className="mt-4 font-sans text-[14.5px] leading-[1.7]" style={{ color: INK_SOFT }}>
                {BOOKING.handoffBody}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex min-h-[50px] items-center rounded-[2px] px-7 font-sans text-[14px] font-bold transition-transform active:scale-[0.98] ${FOCUS}`}
                  style={{ background: ACCENT, color: INK }}
                >
                  {BOOKING.handoffCta}
                </a>
                <button
                  onClick={() => setDraft(null)}
                  className={`font-sans text-[13.5px] font-semibold underline underline-offset-4 transition-opacity hover:opacity-75 ${FOCUS}`}
                  style={{ color: INK_SOFT }}
                >
                  {BOOKING.handoffBack}
                </button>
              </div>
            </div>
          )}
        </Reveal>
        <Reveal delay={280}>
          <p className="mt-6 max-w-[64ch] font-sans text-[12px] leading-relaxed" style={{ color: INK_MUTE }}>
            {BOOKING.disclaimer}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ═════════════════ STICKY MOBILE CTA ══════════════════════════════════ */
function StickyBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[auto_1fr] md:hidden"
      style={{ background: ACCENT, paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <a
        href={PHONE_HREF}
        className={`flex min-h-[54px] items-center border-r px-5 font-sans text-[13.5px] font-bold ${FOCUS}`}
        style={{ color: INK, borderColor: 'rgba(243,236,217,.28)' }}
      >
        {STICKY.call}
      </a>
      <button
        onClick={() =>
          document.getElementById('boka')?.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' })
        }
        className={`flex min-h-[54px] items-center justify-center font-sans text-[14.5px] font-bold ${FOCUS}`}
        style={{ color: INK }}
      >
        {STICKY.book}
      </button>
    </div>
  )
}

/* ═════════════════ PAGE ═══════════════════════════════════════════════ */
export default function Page() {
  const pageRef = useRef<HTMLDivElement>(null)

  /* Lenis smooth scroll — skipped entirely under reduced motion. */
  useEffect(() => {
    if (prefersReduced()) return
    const lenis = new Lenis({ duration: 1.1 })
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
  }, [])

  /* Title, theme colour, JSON-LD */
  useEffect(() => {
    document.title = 'Hótel Langaholt · Sjóndeildarhringurinn'
    setThemeColor(GROUND)
    const s = document.createElement('script')
    s.type = 'application/ld+json'
    s.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(s)
    return () => {
      s.remove()
    }
  }, [])

  /* THE ONE scroll-linked signature: page scroll progress recolours the
     horizon line (dawn tan → dusk rust → aurora green), thickens it 2→3px
     and fades the stars in at the night section. Values are written RAW per
     frame into CSS custom properties — no CSS transition ever touches them.
     QA hook: --sky-mix holds raw progress; sample it at 0/50/100% scroll. */
  const { scrollYProgress } = useScroll()
  const c1 = useTransform(scrollYProgress, [0, 0.5, 1], [SAND, ACCENT, AURORA])
  const c2 = useTransform(scrollYProgress, [0, 0.5, 1], [SLATE, SAND, ACCENT])
  const hzW = useTransform(scrollYProgress, [0, 1], [2, 3])
  const stars = useTransform(scrollYProgress, [0.7, 0.96], [0, 1])
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const el = pageRef.current
    if (!el || prefersReduced()) return
    el.style.setProperty('--sky-mix', v.toFixed(4))
  })
  /* Each derived value gets its OWN 'change' subscription rather than being
     read via .get() inside the scrollYProgress handler above — reading a
     sibling useTransform's .get() synchronously from another motion value's
     'change' callback can observe it BEFORE its own listener has recomputed
     for this tick, baking a one-scroll-step-stale value into the CSS var
     (confirmed via puppeteer: --hz-c1 lagged exactly one scroll jump behind
     --sky-mix). Subscribing directly to each derived value's own event
     guarantees the write always matches that value's current tick. */
  useMotionValueEvent(c1, 'change', (v) => {
    const el = pageRef.current
    if (el && !prefersReduced()) el.style.setProperty('--hz-c1', v)
  })
  useMotionValueEvent(c2, 'change', (v) => {
    const el = pageRef.current
    if (el && !prefersReduced()) el.style.setProperty('--hz-c2', v)
  })
  useMotionValueEvent(hzW, 'change', (v) => {
    const el = pageRef.current
    if (el && !prefersReduced()) el.style.setProperty('--hz-w', `${v.toFixed(2)}px`)
  })
  useMotionValueEvent(stars, 'change', (v) => {
    const el = pageRef.current
    if (el && !prefersReduced()) el.style.setProperty('--stars', v.toFixed(3))
  })
  /* Reduced motion: everything renders in its end state — the 100%/aurora
     mix per brief C.4, matching the scroll-linked transform's [1] output. */
  useEffect(() => {
    if (!prefersReduced()) return
    const el = pageRef.current
    if (!el) return
    el.style.setProperty('--hz-c1', AURORA)
    el.style.setProperty('--hz-c2', ACCENT)
    el.style.setProperty('--stars', '1')
  }, [])

  const initialVars = useMemo(
    () =>
      ({
        '--sky-mix': '0',
        '--hz-c1': SAND,
        '--hz-c2': SLATE,
        '--hz-w': '2px',
        '--stars': '0',
      }) as CSSProperties,
    [],
  )

  return (
    /* pb clears the fixed mobile CTA bar so the footer stays readable. */
    <div ref={pageRef} lang="is" className="pb-[54px] md:pb-0" style={{ background: GROUND, ...initialVars }}>
      <TopNav />
      <main>
        <Hero />
        <Arrival />
        <Story />
        <Rooms />
        <Restaurant />
        <Surroundings />
        <Reviews />
        <Golf />
        <Practical />
        <BookingBridge />
      </main>
      <section style={{ background: GROUND }} className="px-5 py-10 md:px-8">
        {/* honesty disclosure — quiet pre-footer line, per brief C.8 */}
        <p className="mx-auto max-w-3xl text-center font-sans text-[12px] leading-[1.65]" style={{ color: INK_MUTE }}>
          {DISCLOSURE}
        </p>
      </section>
      <StickyBar />
      <PreviewChrome company={company} />
      <PreviewFooter company={company} />
    </div>
  )
}
