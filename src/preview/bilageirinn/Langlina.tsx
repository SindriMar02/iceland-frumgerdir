import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import Lenis from 'lenis'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Clock, Mail, MapPin, Menu, Phone, ShieldCheck, X } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  ADDRESS,
  BRANDS,
  CLAIM_STEPS,
  CRAFT,
  CTA,
  EMAIL,
  FACILITY,
  FACTS,
  HERO,
  HOURS,
  IMG,
  INSURANCE,
  LOGO,
  LUBE_PHONE_DISPLAY,
  LUBE_PHONE_HREF,
  MAPS,
  PHONE_DISPLAY,
  PHONE_HREF,
  SEO,
  SERVICES,
  STORY,
  TEAM,
  TRUST_STRIP,
} from './data'

const company = getPreviewCompany('bilageirinn')

/* ── CARNOV. Rebuilt 2026-07-15 at the client's direct request: the other
      three concepts (this one included, formerly "Langa línan" — a slow
      scroll-drawn line through warm-dark-stone chapters) read as too
      experimental for a shop that mostly needs people to read the
      headline, see the work, and dial the phone. He showed a template
      called Carnov: boxed nav → text zone on solid ground with a huge
      two-tone headline → one big calm photo → plain, scannable sections.
      This file rebuilds that structure, dark, with a clean saturated red
      standing in for their template red — red because it is the other
      three concepts' one color NOT already spoken for (v2 amber, Blueprint
      plotter red-orange, Signal hazard yellow) and because red is simply
      the honest, common color of an auto-body brand. Motion is limited to
      quiet fades and quick (150–250ms) hover states; the one signature
      touch is a slow Ken Burns drift on the two large photos. No
      scroll-linked choreography anywhere on this page, by design. ────── */

const BG = '#121314' /* near-black ground */
const BG_DEEP = '#0E0F10' /* one step darker: footer/contact band */
const PANEL = '#1B1C1E' /* card / row fill, one step up from BG */
const INK = '#F2F1EE' /* paper-white text; 16.5:1 on BG */
const MUT = '#A8A6A1' /* muted warm grey body text; 7.7:1 on BG */
const HAIR = 'rgba(242,241,238,0.14)' /* hairlines/dividers only, never text */
const RED = '#EF4444' /* accent: headline word, icons, small text — 4.95:1 on BG */
const RED_DEEP = '#DC2626' /* button fill under white label — 4.83:1 with white */

const DISPLAY = "'ClashDisplay-Bold', 'Arial Black', sans-serif"
const DISPLAY_SEMI = "'ClashDisplay-Semibold', 'Arial Black', sans-serif"
const BODY = "'Satoshi', 'Helvetica Neue', Arial, sans-serif"
const MONO = "'Geist Mono', ui-monospace, 'SF Mono', Menlo, monospace"

const B = import.meta.env.BASE_URL
const EASE = [0.22, 1, 0.36, 1] as const

const CSS = `
@font-face { font-family: 'ClashDisplay-Semibold'; src: url('${B}fonts/clash-display/fonts/ClashDisplay-Semibold.woff2') format('woff2'); font-weight: 600; font-style: normal; font-display: swap; }
@font-face { font-family: 'ClashDisplay-Bold'; src: url('${B}fonts/clash-display/fonts/ClashDisplay-Bold.woff2') format('woff2'); font-weight: 700; font-style: normal; font-display: swap; }
@font-face { font-family: 'Satoshi'; src: url('${B}fonts/satoshi/Satoshi-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Satoshi'; src: url('${B}fonts/satoshi/Satoshi-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }
@font-face { font-family: 'Satoshi'; src: url('${B}fonts/satoshi/Satoshi-Bold.woff2') format('woff2'); font-weight: 700; font-style: normal; font-display: swap; }
@font-face { font-family: 'Geist Mono'; src: url('${B}fonts/geist-mono/GeistMono-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Geist Mono'; src: url('${B}fonts/geist-mono/GeistMono-Medium.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: swap; }

.cv-page { background: ${BG}; color: ${INK}; }
.cv-page ::selection { background: ${RED}; color: ${INK}; }
.cv-page a, .cv-page button { -webkit-tap-highlight-color: transparent; }
.cv-page :focus-visible { outline: 2px solid ${RED}; outline-offset: 3px; border-radius: 2px; }

/* the one signature touch on the whole page: a slow, quiet photo drift */
@keyframes cv-kenburns { from { transform: scale(1.02); } to { transform: scale(1.09); } }
.cv-kb { animation: cv-kenburns 42s linear alternate infinite; will-change: transform; }
@media (prefers-reduced-motion: reduce) { .cv-kb { animation: none; } }

.cv-navlink { position: relative; }
.cv-navlink::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: -4px; height: 1px;
  background: ${RED}; transform: scaleX(0); transform-origin: left;
  transition: transform 200ms ease;
}
.cv-navlink:hover::after, .cv-navlink:focus-visible::after { transform: scaleX(1); }

.cv-cta { transition: background-color 180ms ease, transform 180ms ease; }
.cv-cta:hover { background-color: #C81F1F; transform: translateY(-1px); }
.cv-cta:active { transform: translateY(0); }

.cv-row { transition: background-color 200ms ease, padding-left 200ms ease; }
.cv-row:hover, .cv-row:focus-within { background-color: ${PANEL}; }

.cv-tile img { transition: transform 400ms ease, filter 400ms ease; }
.cv-tile:hover img { transform: scale(1.045); }
.cv-tile .cv-tile-label { transition: opacity 200ms ease, transform 200ms ease; }
`

/* ───────────────────────── shared motion helper ───────────────────────── */

/** Quiet, quick fade + small rise. Whole blocks only — never masked, so
    Icelandic accents (Í Á Þ Æ Ö…) never clip. */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/** A photo that fades in once, then optionally drifts slowly (Ken Burns).
    Observer sits on the untransformed <figure>. */
function Photo({
  src,
  alt,
  className,
  kenBurns = false,
}: {
  src: string
  alt: string
  className?: string
  kenBurns?: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduced = useReducedMotion()
  return (
    <figure ref={ref} className={className}>
      <div className="h-full w-full overflow-hidden">
        {reduced ? (
          <img src={src} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        ) : (
          <motion.img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className={`h-full w-full object-cover ${kenBurns ? 'cv-kb' : ''}`}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          />
        )}
      </div>
    </figure>
  )
}

/** Small badge: icon + a single verified line, never a fabricated rating. */
function Badge({ children }: { children: ReactNode }) {
  return (
    <div
      className="inline-flex items-center gap-2.5 rounded-sm border px-4 py-2.5"
      style={{ borderColor: HAIR, background: 'rgba(18,19,20,0.6)', backdropFilter: 'blur(6px)' }}
    >
      <ShieldCheck size={16} strokeWidth={2.2} color={RED} aria-hidden />
      <span className="text-[13px] leading-tight" style={{ fontFamily: BODY, fontWeight: 500, color: INK }}>
        {children}
      </span>
    </div>
  )
}

/* ──────────────────────────────── nav ──────────────────────────────── */

const NAV_LINKS = [
  { href: '#thjonusta', label: 'Þjónusta' },
  { href: '#traust', label: 'Af hverju við' },
  { href: '#myndband', label: 'Myndband' },
  { href: '#verkin', label: 'Verkin okkar' },
]

function Nav({ lenisRef }: { lenisRef: React.RefObject<Lenis | null> }) {
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    setOpen(false)
    const el = document.querySelector(href)
    if (!el) return
    if (lenisRef.current) lenisRef.current.scrollTo(el as HTMLElement, { offset: -76 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b"
      style={{ background: 'rgba(18,19,20,0.86)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderColor: HAIR }}
    >
      <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-5 md:px-8">
        <a
          href="#efst"
          className="inline-flex min-h-11 items-center"
          aria-label="Bílageirinn, efst á síðu"
          onClick={e => {
            e.preventDefault()
            if (lenisRef.current) lenisRef.current.scrollTo(0)
            else window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          <img src={LOGO} alt="Bílageirinn" className="h-8 w-auto" style={{ filter: 'invert(1) brightness(1.04)' }} />
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Aðalvalmynd">
          {NAV_LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={e => go(e, l.href)}
              className="cv-navlink min-h-11 py-1 text-[14px]"
              style={{ fontFamily: BODY, fontWeight: 500, color: INK }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-5">
          <a
            href={PHONE_HREF}
            className="hidden min-h-11 items-center gap-2 text-[14px] md:inline-flex"
            style={{ fontFamily: MONO, color: INK }}
          >
            <Phone size={14} strokeWidth={2.2} color={RED} aria-hidden />
            {PHONE_DISPLAY}
          </a>
          <a
            href={PHONE_HREF}
            className="cv-cta inline-flex min-h-11 items-center gap-1.5 rounded-sm px-4 text-[13.5px] md:px-5 md:text-[14px]"
            style={{ background: RED_DEEP, color: '#FFFFFF', fontFamily: BODY, fontWeight: 600 }}
          >
            <span className="hidden sm:inline">{HERO.ctaPrimary}</span>
            <span className="sm:hidden">Hringja</span>
            <ArrowUpRight size={16} strokeWidth={2.4} aria-hidden />
          </a>
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            aria-label={open ? 'Loka valmynd' : 'Opna valmynd'}
            className="flex min-h-11 min-w-11 items-center justify-center lg:hidden"
            style={{ color: INK }}
          >
            {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="overflow-hidden border-t lg:hidden"
            style={{ borderColor: HAIR, background: BG }}
            initial={reduced ? undefined : { height: 0, opacity: 0 }}
            animate={reduced ? undefined : { height: 'auto', opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <nav className="flex flex-col px-5 py-3" aria-label="Aðalvalmynd, farsími">
              {NAV_LINKS.map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={e => go(e, l.href)}
                  className="min-h-11 border-b py-3 text-[15px]"
                  style={{ fontFamily: BODY, fontWeight: 500, color: INK, borderColor: HAIR }}
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

/* ─────────────────────────────── hero ─────────────────────────────── */

function Hero() {
  const reduced = useReducedMotion()
  const enter = (delay: number) =>
    reduced
      ? {}
      : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease: EASE, delay } }

  return (
    <section id="efst" className="relative z-[1] pt-[72px]">
      <div className="mx-auto max-w-[1320px] px-5 pb-14 pt-16 md:px-8 md:pb-20 md:pt-24">
        <motion.p
          className="text-[12px] tracking-[0.2em] uppercase"
          style={{ fontFamily: MONO, color: MUT }}
          {...enter(0)}
        >
          Réttingar · Bílamálun · Bílaþjónusta · {ADDRESS.street}, {ADDRESS.town}
        </motion.p>

        <motion.h1
          className="mt-6 max-w-4xl text-balance"
          style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(2.6rem, 7.6vw, 5.6rem)', lineHeight: 1.08, letterSpacing: '-0.015em' }}
          {...enter(0.1)}
        >
          <span style={{ color: INK }}>Aftur í rétta </span>
          <br />
          <span style={{ color: RED }}>línu.</span>
        </motion.h1>

        <motion.p
          className="mt-7 max-w-[46ch] text-[16.5px] leading-[1.7] md:text-[18px]"
          style={{ fontFamily: BODY, color: MUT }}
          {...enter(0.2)}
        >
          {HERO.sub}
        </motion.p>

        <motion.div className="mt-8 flex flex-wrap items-center gap-4" {...enter(0.3)}>
          <a
            href={PHONE_HREF}
            className="cv-cta inline-flex min-h-12 items-center gap-2 rounded-sm px-6 text-[15px]"
            style={{ background: RED_DEEP, color: '#FFFFFF', fontFamily: BODY, fontWeight: 600 }}
          >
            {HERO.ctaPrimary}
            <ArrowUpRight size={18} strokeWidth={2.4} aria-hidden />
          </a>
          <a
            href="#thjonusta"
            onClick={e => {
              e.preventDefault()
              document.querySelector('#thjonusta')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
            className="cv-navlink inline-flex min-h-12 items-center text-[15px]"
            style={{ fontFamily: BODY, fontWeight: 500, color: INK }}
          >
            {HERO.ctaSecondary}
          </a>
          <Badge>{HERO.cert}</Badge>
        </motion.div>
      </div>

      {/* the one large, calm photo — cropped clean, no scrim, nothing sits on it */}
      <Reveal delay={0.1}>
        <div className="relative h-[46vh] w-full overflow-hidden md:h-[62vh]">
          <Photo src={IMG.retting} alt="Réttingamaður vinnur yfirbyggingu bíls með höndunum" className="h-full w-full" kenBurns />
          <div
            className="absolute bottom-4 left-4 rounded-sm px-3 py-2 md:bottom-6 md:left-6"
            style={{ background: 'rgba(18,19,20,0.7)', backdropFilter: 'blur(4px)' }}
          >
            <p className="text-[11px] tracking-[0.16em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
              Verkstæðið í {ADDRESS.street}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* ─────────────────────────── trust strip ─────────────────────────── */

function TrustStrip() {
  return (
    <section className="relative z-[1] border-b" style={{ borderColor: HAIR, background: BG_DEEP }}>
      <Reveal>
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5 py-6 md:px-8 md:py-7">
          {TRUST_STRIP.map(item => (
            <span key={item} className="text-[12.5px] tracking-[0.06em]" style={{ fontFamily: MONO, color: MUT }}>
              {item}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

/* ────────────────────────────── services ────────────────────────────── */

function Services() {
  return (
    <section id="thjonusta" className="relative z-[1] mx-auto max-w-[1320px] scroll-mt-20 px-5 py-24 md:px-8 md:py-32">
      <Reveal>
        <p className="text-[12px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: RED }}>
          Þjónustan
        </p>
        <h2
          className="mt-4 max-w-2xl text-balance"
          style={{ fontFamily: DISPLAY_SEMI, fontWeight: 600, fontSize: 'clamp(1.9rem, 4vw, 3rem)', lineHeight: 1.12, color: INK }}
        >
          Allt undir sama þaki í Grófinni
        </h2>
      </Reveal>

      <div className="mt-12 border-t" style={{ borderColor: HAIR }}>
        {SERVICES.map((s, i) => (
          <Reveal key={s.name} delay={Math.min(i * 0.04, 0.2)}>
            <div className="cv-row flex flex-col gap-2 border-b px-3 py-6 sm:flex-row sm:items-baseline sm:gap-6 md:px-4 md:py-7" style={{ borderColor: HAIR }}>
              <span className="w-9 shrink-0 text-[12px] tabular-nums" style={{ fontFamily: MONO, color: RED }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 style={{ fontFamily: DISPLAY_SEMI, fontWeight: 600, fontSize: 'clamp(1.15rem, 2vw, 1.5rem)', color: INK }}>
                    {s.name}
                  </h3>
                  <span className="text-[10.5px] tracking-[0.16em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
                    {s.tag}
                  </span>
                </div>
                <p className="mt-2 max-w-[58ch] text-[14.5px] leading-[1.65]" style={{ fontFamily: BODY, color: MUT }}>
                  {s.desc}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p className="mt-8 text-[14.5px]" style={{ fontFamily: BODY, color: MUT }}>
          Smurstöðin svarar beint í{' '}
          <a
            href={LUBE_PHONE_HREF}
            className="cv-navlink inline-flex min-h-11 items-center font-medium"
            style={{ color: INK }}
          >
            {LUBE_PHONE_DISPLAY}
          </a>
        </p>
      </Reveal>
    </section>
  )
}

/* ─────────────────────────── why trust us ─────────────────────────── */

function FactTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l pl-5" style={{ borderColor: HAIR }}>
      <p style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: RED, lineHeight: 1.1 }}>
        {value}
      </p>
      <p className="mt-2 max-w-[18ch] text-[12.5px] leading-[1.5]" style={{ fontFamily: BODY, color: MUT }}>
        {label}
      </p>
    </div>
  )
}

function WhyTrustUs() {
  const founder = TEAM[0]
  return (
    <section id="traust" className="relative z-[1] scroll-mt-20 border-t" style={{ borderColor: HAIR, background: BG_DEEP }}>
      <div className="mx-auto max-w-[1320px] px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-14 md:grid-cols-[1.1fr_0.9fr] md:gap-20">
          <div>
            <Reveal>
              <p className="text-[12px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: RED }}>
                Af hverju Bílageirinn
              </p>
              <h2
                className="mt-4 max-w-xl text-balance"
                style={{ fontFamily: DISPLAY_SEMI, fontWeight: 600, fontSize: 'clamp(1.9rem, 4vw, 3rem)', lineHeight: 1.12, color: INK }}
              >
                {STORY.title}
              </h2>
              <p className="mt-6 max-w-[56ch] text-[16px] leading-[1.75]" style={{ fontFamily: BODY, color: MUT }}>
                {STORY.lead}
              </p>
              <p className="mt-4 text-[12.5px] tracking-[0.1em] uppercase" style={{ fontFamily: MONO, color: RED }}>
                {founder.name} · {founder.detail}
              </p>
            </Reveal>

            <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
              {FACTS.map((f, i) => (
                <Reveal key={f.label} delay={0.05 + i * 0.05}>
                  <FactTile value={f.num !== null ? `${f.num}${f.suffix}` : `${f.text}${f.suffix}`} label={f.label} />
                </Reveal>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Reveal delay={0.1}>
              <div className="rounded-sm border p-6 md:p-7" style={{ borderColor: HAIR, background: PANEL }}>
                <h3 style={{ fontFamily: DISPLAY_SEMI, fontWeight: 600, fontSize: '1.2rem', color: INK }}>{BRANDS.title}</h3>
                <p className="mt-3 text-[14.5px] leading-[1.7]" style={{ fontFamily: BODY, color: MUT }}>
                  {BRANDS.body}
                </p>
                <div className="mt-5 flex items-center gap-4">
                  {[{ src: IMG.toyota, alt: 'Toyota' }, { src: IMG.kia, alt: 'Kia' }].map(m => (
                    <div key={m.alt} className="flex h-10 items-center rounded-sm border px-3" style={{ borderColor: HAIR, background: BG }}>
                      <img src={m.src} alt={m.alt} loading="lazy" decoding="async" className="max-h-6 w-auto object-contain" />
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="rounded-sm border p-6 md:p-7" style={{ borderColor: HAIR, background: PANEL }}>
                <h3 style={{ fontFamily: DISPLAY_SEMI, fontWeight: 600, fontSize: '1.2rem', color: INK }}>{CRAFT.title}</h3>
                <p className="mt-3 text-[14.5px] leading-[1.7]" style={{ fontFamily: BODY, color: MUT }}>
                  {CRAFT.body}
                </p>
                <ul className="mt-4 space-y-2">
                  {CRAFT.points.map(p => (
                    <li key={p} className="flex items-center gap-2.5 text-[12.5px] tracking-[0.06em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
                      <span aria-hidden className="h-[2px] w-5 shrink-0" style={{ background: RED }} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="rounded-sm border p-6 md:p-7" style={{ borderColor: HAIR, background: PANEL }}>
                <h3 style={{ fontFamily: DISPLAY_SEMI, fontWeight: 600, fontSize: '1.2rem', color: INK }}>{FACILITY.title}</h3>
                <p className="mt-3 text-[14.5px] leading-[1.7]" style={{ fontFamily: BODY, color: MUT }}>
                  {FACILITY.body}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────── claim / insurance ────────────────────────── */

function ClaimProcess() {
  return (
    <section id="tjon" className="relative z-[1] mx-auto max-w-[1320px] scroll-mt-20 px-5 py-24 md:px-8 md:py-32">
      <Reveal>
        <p className="text-[12px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: RED }}>
          Verði tjón
        </p>
        <h2
          className="mt-4 max-w-xl text-balance"
          style={{ fontFamily: DISPLAY_SEMI, fontWeight: 600, fontSize: 'clamp(1.9rem, 4vw, 3rem)', lineHeight: 1.12, color: INK }}
        >
          {INSURANCE.title}
        </h2>
        <p className="mt-5 max-w-[60ch] text-[16px] leading-[1.75]" style={{ fontFamily: BODY, color: MUT }}>
          {INSURANCE.body}
        </p>
        <p className="mt-4 text-[12.5px] tracking-[0.14em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
          {INSURANCE.companies.join(' · ')}
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CLAIM_STEPS.map((s, i) => (
          <Reveal key={s.title} delay={0.05 + i * 0.06}>
            <div
              className="h-full rounded-sm border p-6"
              style={{
                borderColor: s.highlight ? RED : HAIR,
                background: s.highlight ? 'rgba(239,68,68,0.09)' : PANEL,
              }}
            >
              <p className="text-[11px] tracking-[0.18em]" style={{ fontFamily: MONO, color: RED }}>
                {String(i + 1).padStart(2, '0')}
                {s.highlight ? ' · INNIFALIÐ' : ''}
              </p>
              <h3 className="mt-3" style={{ fontFamily: DISPLAY_SEMI, fontWeight: 600, fontSize: '1.15rem', lineHeight: 1.2, color: INK }}>
                {s.title}
              </h3>
              <p className="mt-2.5 text-[13.5px] leading-[1.65]" style={{ fontFamily: BODY, color: MUT }}>
                {s.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ────────────────────────────── video ────────────────────────────── */

const FILM_STEPS = ['Skoðun', 'Mæling', 'Rétting', 'Málun', 'Afhending']

function VideoSection() {
  return (
    <section id="myndband" className="relative z-[1] scroll-mt-20 border-t" style={{ borderColor: HAIR, background: BG_DEEP }}>
      <div className="mx-auto max-w-[1320px] px-5 py-24 md:px-8 md:py-32">
        <Reveal>
          <p className="text-[12px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: RED }}>
            Myndband
          </p>
          <h2
            className="mt-4 max-w-xl text-balance"
            style={{ fontFamily: DISPLAY_SEMI, fontWeight: 600, fontSize: 'clamp(1.9rem, 4vw, 3rem)', lineHeight: 1.12, color: INK }}
          >
            Verkið sjálft, tekið upp í Grófinni
          </h2>
          <p className="mt-5 max-w-[60ch] text-[15.5px] leading-[1.75]" style={{ fontFamily: BODY, color: MUT }}>
            Heimildarmynd um eina tjónaviðgerð hjá Bílageiranum að Grófinni 14a er í vinnslu. Hún birtist hér þegar
            hún er tilbúin.
          </p>
        </Reveal>

        {/* honest slot: poster + slow drift, no play button — a real
            <video controls poster> drops in here once filming is done */}
        <Reveal delay={0.15} className="mt-10">
          <div className="relative aspect-video overflow-hidden rounded-sm" style={{ background: PANEL }}>
            <Photo src={IMG.booth} alt="Bíll afmarkaður með pappír og grunnaður í sprautuklefa" className="absolute inset-0 h-full w-full" kenBurns />
            <p
              className="absolute left-4 top-4 rounded-sm px-3 py-1.5 text-[11px] tracking-[0.16em] uppercase md:left-6 md:top-6"
              style={{ fontFamily: MONO, color: INK, background: 'rgba(18,19,20,0.7)' }}
            >
              Í vinnslu · Grófin 14a
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <ol className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            {FILM_STEPS.map((s, i) => (
              <li key={s} className="flex items-center gap-2.5 text-[12.5px] tracking-[0.1em] uppercase" style={{ fontFamily: MONO, color: MUT }}>
                <span style={{ color: RED }}>{String(i + 1).padStart(2, '0')}</span>
                {s}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────────────────────────── showcase ───────────────────────────── */

const SHOWCASE = [
  { img: IMG.retting, alt: 'Flötur yfirbyggingar varinn og unninn með höndunum', service: SERVICES[0] },
  { img: IMG.malun, alt: 'Sprautuvinna í málningarklefa', service: SERVICES[1] },
  { img: IMG.garage, alt: 'Verkstæðisgólf með bílum í viðgerð', service: SERVICES[2] },
  { img: IMG.lift, alt: 'Unnið undir bíl á lyftu', service: SERVICES[3] },
  { img: IMG.wheel, alt: 'Fjöðrunar- og hjólabúnaður í nærmynd', service: SERVICES[4] },
  { img: IMG.headlight, alt: 'Aðalljós á dökkum bíl', service: SERVICES[5] },
  { img: IMG.brake, alt: 'Bremsubúnaður skoðaður með hjólið af', service: SERVICES[6] },
]

function Showcase() {
  return (
    <section id="verkin" className="relative z-[1] mx-auto max-w-[1320px] scroll-mt-20 px-5 py-24 md:px-8 md:py-32">
      <Reveal>
        <p className="text-[12px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: RED }}>
          Verkin okkar
        </p>
        <h2
          className="mt-4 max-w-xl text-balance"
          style={{ fontFamily: DISPLAY_SEMI, fontWeight: 600, fontSize: 'clamp(1.9rem, 4vw, 3rem)', lineHeight: 1.12, color: INK }}
        >
          Þjónustan í myndum
        </h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {SHOWCASE.map((s, i) => (
          <Reveal key={s.service.name} delay={Math.min(i * 0.04, 0.24)} className={i === 0 ? 'col-span-2 row-span-2' : undefined}>
            <div className={`cv-tile group relative overflow-hidden rounded-sm ${i === 0 ? 'aspect-square md:aspect-auto md:h-full' : 'aspect-square'}`}>
              <Photo src={s.img} alt={s.alt} className="h-full w-full" />
              <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(14,15,16,0.75), transparent 55%)' }} />
              <p
                className="cv-tile-label absolute bottom-3 left-3 text-[12px] tracking-[0.08em] uppercase md:bottom-4 md:left-4"
                style={{ fontFamily: MONO, color: INK }}
              >
                {s.service.name}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ───────────────────────────── contact ───────────────────────────── */

function Contact() {
  return (
    <section id="samband" className="relative z-[1] scroll-mt-20 border-t" style={{ borderColor: HAIR, background: BG_DEEP }}>
      <div className="mx-auto max-w-[1320px] px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-16 md:grid-cols-[1.15fr_1fr] md:gap-20">
          <div>
            <Reveal>
              <p className="text-[12px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: RED }}>
                Samband
              </p>
              <h2
                className="mt-4 max-w-lg text-balance"
                style={{ fontFamily: DISPLAY_SEMI, fontWeight: 600, fontSize: 'clamp(1.9rem, 4vw, 3rem)', lineHeight: 1.14, color: INK }}
              >
                {CTA.title}
              </h2>
              <p className="mt-5 max-w-[46ch] text-[16px] leading-[1.7]" style={{ fontFamily: BODY, color: MUT }}>
                {CTA.body}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <a
                href={PHONE_HREF}
                className="mt-8 inline-flex items-center gap-3 leading-none transition-opacity duration-200 hover:opacity-85"
                style={{ fontFamily: DISPLAY, fontWeight: 700, color: INK, fontSize: 'clamp(2.6rem, 7vw, 4.6rem)', letterSpacing: '-0.01em' }}
              >
                {PHONE_DISPLAY}
                <ArrowUpRight size={34} strokeWidth={2.2} color={RED} aria-hidden className="mb-2" />
              </a>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="mt-8 space-y-2.5 text-[14.5px]" style={{ fontFamily: MONO, color: MUT }}>
                <p className="flex items-center gap-2.5">
                  <Phone size={14} strokeWidth={2.2} color={RED} aria-hidden />
                  Smurstöðin:{' '}
                  <a href={LUBE_PHONE_HREF} className="cv-navlink font-medium" style={{ color: INK }}>
                    {LUBE_PHONE_DISPLAY}
                  </a>
                </p>
                <p className="flex items-center gap-2.5">
                  <Mail size={14} strokeWidth={2.2} color={RED} aria-hidden />
                  <a href={`mailto:${EMAIL}`} className="cv-navlink" style={{ color: INK }}>
                    {EMAIL}
                  </a>
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-1 md:gap-12">
              <div>
                <p className="flex items-center gap-2.5 text-[11px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: RED }}>
                  <Clock size={13} strokeWidth={2.2} aria-hidden />
                  Opnunartími
                </p>
                <ul className="mt-4 space-y-2 text-[15px] leading-[1.6]" style={{ fontFamily: BODY, color: MUT }}>
                  {HOURS.map(h => (
                    <li key={h.days}>
                      <span style={{ color: INK }}>{h.days}</span>
                      <br />
                      {h.close ? `${h.open}–${h.close}` : h.open}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="flex items-center gap-2.5 text-[11px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: RED }}>
                  <MapPin size={13} strokeWidth={2.2} aria-hidden />
                  Staðsetning
                </p>
                <p className="mt-4 text-[15px] leading-[1.6]" style={{ fontFamily: BODY, color: MUT }}>
                  <span style={{ color: INK }}>{ADDRESS.street}</span>
                  <br />
                  {ADDRESS.town}
                </p>
                <a
                  href={MAPS}
                  target="_blank"
                  rel="noreferrer"
                  className="cv-navlink mt-4 inline-flex min-h-11 items-center gap-2 text-[14.5px] font-medium"
                  style={{ fontFamily: BODY, color: INK }}
                >
                  Opna í kortum
                  <ArrowUpRight size={15} strokeWidth={2.2} aria-hidden />
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <p className="mt-20 border-t pt-8 text-[11px] leading-[2.2] tracking-[0.14em] uppercase" style={{ fontFamily: MONO, color: MUT, borderColor: HAIR }}>
            {TRUST_STRIP.join(' · ')}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ─────────────────────────────── the page ─────────────────────────────── */

export default function Page() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    document.title = SEO.title
    setThemeColor(BG)
    const meta = document.querySelector('meta[name="description"]')
    const prev = meta?.getAttribute('content') ?? ''
    meta?.setAttribute('content', SEO.description)

    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'AutoBodyShop',
      name: 'Bílageirinn',
      telephone: '+354 421 6901',
      email: EMAIL,
      address: { '@type': 'PostalAddress', streetAddress: ADDRESS.street, addressLocality: 'Reykjanesbær', postalCode: '230', addressCountry: 'IS' },
      foundingDate: '2003',
    })
    document.head.appendChild(ld)

    return () => {
      meta?.setAttribute('content', prev)
      ld.remove()
    }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.05 })
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
  }, [])

  return (
    <div className="cv-page min-h-screen antialiased" style={{ fontFamily: BODY }}>
      <style>{CSS}</style>
      <Nav lenisRef={lenisRef} />
      <main>
        <Hero />
        <TrustStrip />
        <Services />
        <WhyTrustUs />
        <ClaimProcess />
        <VideoSection />
        <Showcase />
        <Contact />
      </main>

      <div className="relative z-[1] px-5 py-5 text-center text-[11px] tracking-[0.16em]" style={{ fontFamily: MONO, color: MUT, borderTop: `1px solid ${HAIR}`, background: BG_DEEP }}>
        FRUMGERÐ · SNDR STUDIO
      </div>
      <PreviewFooter company={company} />
      <PreviewChrome company={company} />
    </div>
  )
}
