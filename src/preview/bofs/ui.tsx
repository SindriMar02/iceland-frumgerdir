/**
 * Öruggt skjól — shared UI shell: palette, fonts, language toggle, header,
 * footer, buttons, and the one-time ambient-motion stylesheet.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, animate, useInView, useReducedMotion, type MotionValue } from 'framer-motion'
import { CATEGORIES, ORG, SERVICES, UI, type L, type Lang, type Service } from './data'
import { HomeArt } from './illustrations'
import { Reveal } from '../../components/Reveal'
import { SndrBadge } from '../SndrBadge'

/* ── palette ──────────────────────────────────────────────────────────── */

export const C = {
  cream: '#FBF3E7', // page ground
  cream2: '#F6EAD7', // alt section / cards
  oat: '#EFDFC7', // deeper warm panel
  line: '#E7D6BC', // hairlines
  cocoa: '#3A2C22', // headings
  body: '#6A5648', // body text
  clay: '#B0512F', // primary accent as text/fill (AA on cream)
  clayText: '#A2492A', // accent when used as small text
  terra: '#D9744E', // decorative terracotta
  sun: '#E1962F', // sun-gold as text (AA); illustrations use lighter
  sage: '#5E8A5E', // sage as text (AA)
  sky: '#4E86A6', // sky-blue as text (AA)
  rose: '#C06C7C', // rose as text (AA)
  deep: '#4A3123', // deep cocoa band ground
  deepText: '#F6E8D5', // text on deep band
}

/* ── fonts ────────────────────────────────────────────────────────────── */

const DISPLAY = '"Bricolage Grotesque", system-ui, sans-serif'
const BODY = '"Hanken Grotesk", system-ui, sans-serif'
const HAND = '"Caveat", "Bricolage Grotesque", cursive'
export const FONT = { display: DISPLAY, body: BODY, hand: HAND }

/* ── assets ───────────────────────────────────────────────────────────── */

/** Base-path-safe URL for a file in public/bofs/. */
export const asset = (f: string) => `${import.meta.env.BASE_URL}bofs/${f}`
/** The real, official Barna- og fjölskyldustofa emblem. */
export const LOGO = asset('bofs-logo.png')

/* ── scrolling ────────────────────────────────────────────────────────── */

/*
 * NO LENIS ON THESE PAGES — measured decision, do not reintroduce.
 * A live profiler in Sindri's own Chrome showed the page renders at a
 * locked 58 to 60 fps in every section with every suspect toggled, yet
 * scrolling still felt laggy: the latency was Lenis's wheel interception
 * replacing native trackpad inertia with interpolation. Scrolling here is
 * fully native; anchors glide via the global html scroll-behavior smooth
 * rule in index.css and the scroll-mt-24 offsets on every section target.
 */

/* ── language ─────────────────────────────────────────────────────────── */

const LANG_KEY = 'bofs-lang'
const LANG_EVT = 'bofs-lang-change'

function readLang(): Lang {
  try {
    const v = localStorage.getItem(LANG_KEY)
    return v === 'en' || v === 'is' ? v : 'is'
  } catch {
    return 'is'
  }
}

export function useLang(): [Lang, (l: Lang) => void, (v: L) => string] {
  const [lang, setLangState] = useState<Lang>(readLang)

  useEffect(() => {
    const h = () => setLangState(readLang())
    window.addEventListener(LANG_EVT, h)
    return () => window.removeEventListener(LANG_EVT, h)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((l: Lang) => {
    try {
      localStorage.setItem(LANG_KEY, l)
    } catch {
      /* private mode — session only */
    }
    window.dispatchEvent(new Event(LANG_EVT))
  }, [])

  const pick = useCallback((v: L) => v[lang], [lang])
  return [lang, setLang, pick]
}

/* ── ambient motion + base styles (injected once) ─────────────────────── */

export function BofsStyles() {
  return (
    <style>{`
      .bofs-root { background:${C.cream}; color:${C.body}; font-family:${BODY}; -webkit-font-smoothing:antialiased; }
      .bofs-root ::selection { background:${C.terra}; color:#fff; }
      .bofs-display { font-family:${DISPLAY}; color:${C.cocoa}; letter-spacing:-0.02em; line-height:1.02; font-variation-settings:'opsz' 40; }
      /* let the true display cut show at hero scale, stay sturdy on small titles */
      .bofs-display-xl { font-variation-settings:'opsz' 96; }
      .bofs-display-sm { font-variation-settings:'opsz' 18; letter-spacing:-0.01em; }
      .bofs-hand { font-family:${HAND}; }
      /* long Icelandic compounds orphan easily; balance headings, pretty leads */
      .bofs-balance { text-wrap:balance; }
      .bofs-pretty { text-wrap:pretty; }
      /* one statement style, reused as each page's single large gesture */
      .bofs-statement { font-family:${DISPLAY}; color:${C.cocoa}; font-size:clamp(24px,3.6vw,38px); line-height:1.16; letter-spacing:-0.02em; font-variation-settings:'opsz' 64; }
      .bofs-num { font-variant-numeric:tabular-nums; font-feature-settings:'tnum' 1; }
      .bofs-root a { color:inherit; }
      .bofs-focus:focus-visible { outline:3px solid ${C.clay}; outline-offset:3px; border-radius:14px; }
      .bofs-root .no-scrollbar { scrollbar-width:none; -ms-overflow-style:none; }
      .bofs-root .no-scrollbar::-webkit-scrollbar { display:none; }

      /* one photographic language: unify eleven photos into one shoot */
      .bofs-photo { filter:saturate(.94) sepia(.05) contrast(.99); }
      /* the doorway crop; at most one per page */
      .bofs-arch { border-radius:999px 999px 30px 30px; }

      /* micro-interaction craft: composited-only lifts, gated behind real hover */
      .bofs-lift { transition:transform .2s ease-out, box-shadow .2s ease-out; }
      .bofs-press { transition:transform .12s ease-out; }
      .bofs-press:active { transform:scale(.985); }
      @media (hover:hover) and (pointer:fine) {
        .bofs-lift:hover { transform:translateY(-3px); }
      }

      @keyframes bofsDrift { from { transform:translateX(-16vw) } to { transform:translateX(116vw) } }
      @keyframes bofsBreathe { 0%,100% { transform:scale(1); opacity:1 } 50% { transform:scale(1.05); opacity:.92 } }
      @keyframes bofsTwinkle { 0%,100% { opacity:1 } 50% { opacity:.5 } }
      @keyframes bofsSway { 0%,100% { transform:rotate(-2deg) } 50% { transform:rotate(2deg) } }
      @keyframes bofsFly { 0% { transform:translate(0,0) } 50% { transform:translate(60px,-24px) } 100% { transform:translate(140px,10px) } }
      @keyframes bofsBeat { 0%,100% { transform:scale(1) } 25% { transform:scale(1.08) } 40% { transform:scale(1) } }
      @keyframes bofsFloat { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-9px) } }

      .bofs-drift { animation:bofsDrift linear infinite; will-change:transform; }
      .bofs-breathe { animation:bofsBreathe 7s ease-in-out infinite; will-change:transform; }
      .bofs-twinkle { animation:bofsTwinkle 5.5s ease-in-out infinite; }
      .bofs-sway { animation:bofsSway 8s ease-in-out infinite; }
      .bofs-fly { animation:bofsFly 14s ease-in-out infinite; will-change:transform; }
      .bofs-beat { animation:bofsBeat 4s ease-in-out infinite; }
      .bofs-float { animation:bofsFloat 6s ease-in-out infinite; will-change:transform; }

      @media (prefers-reduced-motion: reduce) {
        .bofs-drift,.bofs-breathe,.bofs-twinkle,.bofs-sway,.bofs-fly,.bofs-beat,.bofs-float { animation:none !important; }
        .bofs-faq { transition:none !important; }
      }
    `}</style>
  )
}

/* ── wordmark ─────────────────────────────────────────────────────────── */

export function Wordmark({ onDeep = false, compact = false }: { onDeep?: boolean; compact?: boolean }) {
  const ink = onDeep ? C.deepText : C.cocoa
  return (
    <span className="flex items-center gap-2.5">
      <span
        className="grid shrink-0 place-items-center rounded-2xl"
        style={{ width: 42, height: 42, background: '#fff', boxShadow: onDeep ? '0 6px 16px -8px rgba(0,0,0,.5)' : `inset 0 0 0 1px ${C.line}` }}
      >
        {/* The real Barna- og fjölskyldustofa emblem */}
        <img src={LOGO} width={30} height={30} alt="" aria-hidden="true" className="h-[30px] w-[30px]" />
      </span>
      <span className="leading-none">
        <span
          className={`block font-semibold ${compact ? 'text-[15px]' : 'text-[13.5px] sm:text-[16px]'}`}
          style={{ fontFamily: DISPLAY, color: ink, letterSpacing: '-0.01em' }}
        >
          Barna- og fjölskyldustofa
        </span>
        {!compact && (
          <span className="mt-0.5 hidden sm:block" style={{ fontFamily: HAND, color: onDeep ? C.sun : C.clayText, fontSize: 16, lineHeight: 1 }}>
            öruggt skjól
          </span>
        )}
      </span>
    </span>
  )
}

/* ── buttons ──────────────────────────────────────────────────────────── */

type BtnProps = {
  children: ReactNode
  href?: string
  to?: string
  onClick?: () => void
  variant?: 'primary' | 'soft' | 'ghost' | 'deep'
  className?: string
  icon?: ReactNode
}

const btnBase =
  'bofs-focus inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold transition-all duration-300 will-change-transform hover:-translate-y-0.5'

function btnStyle(variant: BtnProps['variant']) {
  switch (variant) {
    case 'soft':
      return { background: '#fff', color: C.cocoa, boxShadow: '0 2px 0 ' + C.line }
    case 'ghost':
      return { background: 'transparent', color: C.clayText, boxShadow: 'inset 0 0 0 1.5px ' + C.line }
    case 'deep':
      return { background: C.sun, color: '#3A2410', boxShadow: '0 10px 24px -12px rgba(58,44,34,.6)' }
    case 'primary':
    default:
      return { background: C.clay, color: '#FFF6EC', boxShadow: '0 12px 26px -14px rgba(176,81,47,.9)' }
  }
}

export function Button({ children, href, to, onClick, variant = 'primary', className = '', icon }: BtnProps) {
  const style = btnStyle(variant)
  const cls = `${btnBase} ${className}`
  const inner = (
    <>
      {children}
      {icon}
    </>
  )
  if (to)
    return (
      <Link to={to} className={cls} style={style} onClick={onClick}>
        {inner}
      </Link>
    )
  if (href)
    return (
      <a href={href} className={cls} style={style} onClick={onClick}>
        {inner}
      </a>
    )
  return (
    <button type="button" className={cls} style={style} onClick={onClick}>
      {inner}
    </button>
  )
}

/* ── language toggle ──────────────────────────────────────────────────── */

export function LangToggle({ lang, setLang, onDeep = false }: { lang: Lang; setLang: (l: Lang) => void; onDeep?: boolean }) {
  const opts: Lang[] = ['is', 'en']
  return (
    <div
      className="relative inline-flex items-center rounded-full p-0.5"
      style={{ background: onDeep ? 'rgba(255,255,255,.12)' : '#fff', boxShadow: onDeep ? 'none' : `inset 0 0 0 1px ${C.line}` }}
      role="group"
      aria-label="Language"
    >
      {opts.map((o) => {
        const active = lang === o
        return (
          <button
            key={o}
            type="button"
            onClick={() => setLang(o)}
            className="bofs-focus relative z-10 rounded-full px-3 py-1 text-[13px] font-bold uppercase tracking-wide transition-colors"
            style={{ color: active ? '#FFF6EC' : onDeep ? C.deepText : C.body }}
            aria-pressed={active}
          >
            {active && (
              <motion.span
                layoutId={`langpill-${onDeep ? 'd' : 'l'}`}
                className="absolute inset-0 -z-10 rounded-full"
                style={{ background: C.clay }}
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            {o === 'is' ? 'ÍS' : 'EN'}
          </button>
        )
      })}
    </div>
  )
}

/* ── header ───────────────────────────────────────────────────────────── */

export function Header() {
  const [lang, setLang, pick] = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [services, setServices] = useState(false)
  const servicesRef = useRef<HTMLDivElement | null>(null)
  const { pathname } = useLocation()
  const onHome = pathname.endsWith('/preview/bofs') || pathname.endsWith('/preview/bofs/')

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24)
    h()
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  // close both menus whenever the route changes
  useEffect(() => {
    setOpen(false)
    setServices(false)
  }, [pathname])

  // dropdown: close on Escape or outside pointer
  useEffect(() => {
    if (!services) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setServices(false)
    const onDown = (e: PointerEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) setServices(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [services])

  const base = onHome ? '' : '/preview/bofs'
  const homes = SERVICES.filter((s) => s.category === 'heimili')
  const thjonusta = SERVICES.filter((s) => s.category === 'thjonusta')
  const pageLinks = [
    { label: pick(UI.nav.system), to: '/preview/bofs/kerfid' },
    { label: pick(UI.nav.about), to: '/preview/bofs/um-stofnunina' },
    { label: pick(UI.nav.report), to: `${base}#tilkynna` },
    { label: pick(UI.nav.help), to: `${base}#help` },
  ]
  const isActive = (to: string) => pathname === to

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className="mx-auto mt-3 flex items-center justify-between gap-4 rounded-full px-3 py-2 pr-3 pl-4 transition-all duration-500 sm:mt-4"
        style={{
          margin: '12px 12px 0',
          maxWidth: 'min(1180px, calc(100% - 24px))',
          marginLeft: 'auto',
          marginRight: 'auto',
          background: scrolled ? 'rgba(251,243,231,.9)' : 'rgba(251,243,231,.35)',
          boxShadow: scrolled ? `0 12px 34px -20px rgba(58,44,34,.5), inset 0 0 0 1px ${C.line}` : 'none',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(10px)' : 'none',
        }}
      >
        <Link to="/preview/bofs" className="bofs-focus shrink-0 rounded-2xl" aria-label="Barna- og fjölskyldustofa">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex">
          <div className="relative" ref={servicesRef}>
            <button
              type="button"
              className="bofs-focus flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[14.5px] font-semibold transition-colors hover:bg-white/60"
              style={{ color: C.cocoa }}
              aria-haspopup="true"
              aria-expanded={services}
              onClick={() => setServices((v) => !v)}
            >
              {pick(UI.nav.services)}
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" style={{ transform: services ? 'rotate(180deg)' : 'none', transition: 'transform .2s ease-out' }}>
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <AnimatePresence>
              {services && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                  style={{ transformOrigin: 'top left', background: 'rgba(251,243,231,.97)', boxShadow: `0 26px 54px -26px rgba(58,44,34,.55), inset 0 0 0 1px ${C.line}`, backdropFilter: 'blur(14px)' }}
                  className="absolute left-0 top-[calc(100%+10px)] grid w-[520px] grid-cols-2 gap-1 rounded-3xl p-3"
                >
                  {[
                    { title: pick(CATEGORIES[0].title), list: homes },
                    { title: pick(CATEGORIES[1].title), list: thjonusta },
                  ].map((col) => (
                    <div key={col.title}>
                      <span className="block px-3 pb-1 pt-2 text-[11.5px] font-bold uppercase tracking-[0.16em]" style={{ color: C.clayText }}>
                        {col.title}
                      </span>
                      {col.list.map((s) => (
                        <Link
                          key={s.slug}
                          to={`/preview/bofs/${s.slug}`}
                          className="bofs-focus flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-white/70"
                        >
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.hue }} />
                          <span className="leading-tight">
                            <span className="block text-[14.5px] font-semibold" style={{ color: C.cocoa }}>
                              {s.name}
                            </span>
                            <span className="block text-[12px]" style={{ color: C.body }}>
                              {pick(s.kind)}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {pageLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="bofs-focus rounded-full px-3.5 py-2 text-[14.5px] font-semibold transition-colors hover:bg-white/60"
              style={{ color: C.cocoa, background: isActive(l.to) ? 'rgba(255,255,255,.6)' : undefined }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="tel:112"
            className="bofs-focus bofs-press hidden items-center gap-1.5 rounded-full px-3.5 py-2 text-[13.5px] font-bold sm:inline-flex"
            style={{ background: '#A83A24', color: '#fff' }}
          >
            <PhoneGlyph /> {pick(UI.emergencyChip)}
          </a>
          <span className="hidden sm:block">
            <LangToggle lang={lang} setLang={setLang} />
          </span>
          <button
            type="button"
            className="bofs-focus grid h-10 w-10 place-items-center rounded-full xl:hidden"
            style={{ background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}` }}
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-4 w-5">
              <span className="absolute inset-x-0 top-0 h-0.5 rounded" style={{ background: C.cocoa, transform: open ? 'translateY(7px) rotate(45deg)' : 'none', transition: '.3s' }} />
              <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded" style={{ background: C.cocoa, opacity: open ? 0 : 1, transition: '.3s' }} />
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded" style={{ background: C.cocoa, transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none', transition: '.3s' }} />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-3 mt-2 max-h-[80vh] overflow-y-auto rounded-3xl p-3 xl:hidden"
            style={{ background: 'rgba(251,243,231,.97)', boxShadow: `0 24px 48px -24px rgba(58,44,34,.5), inset 0 0 0 1px ${C.line}`, backdropFilter: 'blur(14px)' }}
          >
            <MobileGroup label={pick({ is: 'Síður', en: 'Pages' })}>
              {pageLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="bofs-focus block rounded-2xl px-4 py-3 text-[16px] font-semibold hover:bg-white/70"
                  style={{ color: C.cocoa }}
                >
                  {l.label}
                </Link>
              ))}
            </MobileGroup>
            <MobileGroup label={pick(UI.nav.services)}>
              <div className="grid grid-cols-2 gap-1">
                {SERVICES.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/preview/bofs/${s.slug}`}
                    onClick={() => setOpen(false)}
                    className="bofs-focus flex items-center gap-2 rounded-2xl px-3 py-2.5 text-[14.5px] font-semibold hover:bg-white/70"
                    style={{ color: C.cocoa }}
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: s.hue }} />
                    {s.name}
                  </Link>
                ))}
              </div>
            </MobileGroup>
            <a
              href="tel:112"
              onClick={() => setOpen(false)}
              className="mt-1 block rounded-2xl px-4 py-3 text-[16px] font-bold"
              style={{ background: '#A83A24', color: '#fff' }}
            >
              {pick(UI.emergencyChip)}
            </a>
            <div className="mt-2 flex items-center justify-between rounded-2xl px-4 py-2.5" style={{ background: '#fff' }}>
              <span className="text-[14px] font-semibold" style={{ color: C.body }}>
                {pick({ is: 'Tungumál', en: 'Language' })}
              </span>
              <LangToggle lang={lang} setLang={setLang} />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

function MobileGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-1">
      <span className="block px-4 pb-1 pt-2 text-[11.5px] font-bold uppercase tracking-[0.16em]" style={{ color: C.clayText }}>
        {label}
      </span>
      {children}
    </div>
  )
}

function PhoneGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L16 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 3-2z"
        fill="currentColor"
      />
    </svg>
  )
}

/* ── footer ───────────────────────────────────────────────────────────── */

export function Footer() {
  const [, , pick] = useLang()
  const homes = SERVICES.filter((s) => s.category === 'heimili')
  const services = SERVICES.filter((s) => s.category === 'thjonusta')
  return (
    <footer style={{ background: C.deep, color: C.deepText }}>
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
          <div>
            <Wordmark onDeep />
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed" style={{ color: 'rgba(246,232,213,.75)' }}>
              {pick(UI.footerTagline)}
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-[13px] font-bold uppercase tracking-widest" style={{ color: C.sun }}>
              {pick(UI.nav.homes)}
            </h4>
            <ul className="space-y-2 text-[15px]">
              {homes.map((s) => (
                <li key={s.slug}>
                  <Link to={`/preview/bofs/${s.slug}`} className="bofs-focus rounded transition-opacity hover:opacity-70" style={{ color: 'rgba(246,232,213,.85)' }}>
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-[13px] font-bold uppercase tracking-widest" style={{ color: C.sun }}>
              {pick(UI.footerServices)}
            </h4>
            <ul className="space-y-2 text-[15px]">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link to={`/preview/bofs/${s.slug}`} className="bofs-focus rounded transition-opacity hover:opacity-70" style={{ color: 'rgba(246,232,213,.85)' }}>
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-[13px] font-bold uppercase tracking-widest" style={{ color: C.sun }}>
              {pick(UI.footerSite)}
            </h4>
            <ul className="space-y-2 text-[15px]">
              {[
                { label: pick(UI.nav.system), to: '/preview/bofs/kerfid' },
                { label: pick(UI.nav.about), to: '/preview/bofs/um-stofnunina' },
                { label: pick(UI.nav.report), to: '/preview/bofs#tilkynna' },
                { label: pick(UI.nav.help), to: '/preview/bofs#help' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="bofs-focus rounded transition-opacity hover:opacity-70" style={{ color: 'rgba(246,232,213,.85)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-[13px] font-bold uppercase tracking-widest" style={{ color: C.sun }}>
              {pick(UI.footerContact)}
            </h4>
            <ul className="space-y-2 text-[15px]" style={{ color: 'rgba(246,232,213,.85)' }}>
              <li>{ORG.address}</li>
              <li>
                <a className="bofs-focus rounded hover:opacity-70" href={`tel:${ORG.phone.replace(/\s/g, '')}`}>
                  {ORG.phone}
                </a>
              </li>
              <li>
                <a className="bofs-focus rounded hover:opacity-70" href={`mailto:${ORG.email}`}>
                  {ORG.email}
                </a>
              </li>
              <li className="pt-1 text-[13.5px]" style={{ color: 'rgba(246,232,213,.6)' }}>
                {pick(ORG.hours)}
              </li>
            </ul>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-bold" style={{ background: '#A83A24', color: '#fff' }}>
              <PhoneGlyph /> 112
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t pt-6 text-[13px] sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: 'rgba(246,232,213,.16)', color: 'rgba(246,232,213,.6)' }}>
          <p>
            {pick(UI.conceptBadge)}
            <span className="mt-1 block opacity-80">
              {pick({
                is: 'Merki og nafn Barna- og fjölskyldustofu eru eign stofnunarinnar.',
                en: 'The Barna- og fjölskyldustofa emblem and name are property of the agency.',
              })}
            </span>
          </p>
          <div className="flex items-center gap-3">
            <p>{pick(UI.rights)} · 2026</p>
            <SndrBadge dark />
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ── shared bits: eyebrow, section head, arrow, service card ──────────── */

export function Arrow({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Eyebrow({ children, color = C.clayText }: { children: ReactNode; color?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {children}
    </span>
  )
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  align = 'left',
  onDeep = false,
}: {
  eyebrow?: string
  title: ReactNode
  lead?: string
  align?: 'left' | 'center'
  onDeep?: boolean
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && <Eyebrow color={onDeep ? C.sun : C.clayText}>{eyebrow}</Eyebrow>}
      <h2 className="bofs-display mt-3 text-[clamp(28px,5vw,46px)]" style={{ color: onDeep ? C.deepText : C.cocoa }}>
        {title}
      </h2>
      {lead && (
        <p className="mt-4 text-[17px] leading-relaxed" style={{ color: onDeep ? 'rgba(246,232,213,.8)' : C.body }}>
          {lead}
        </p>
      )}
    </div>
  )
}

export function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  const [, , pick] = useLang()
  return (
    <Reveal delay={(index % 3) * 0.08} y={26}>
      <Link
        to={`/preview/bofs/${service.slug}`}
        className="bofs-focus group relative flex h-full flex-col overflow-hidden rounded-[28px] p-6 transition-all duration-500 hover:-translate-y-1.5"
        style={{ background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}, 0 30px 54px -42px rgba(58,44,34,.55)` }}
      >
        <span
          className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-70 transition-transform duration-500 group-hover:scale-125"
          style={{ background: service.hueSoft }}
        />
        <HomeArt art={service.art} hue={service.hue} hueSoft={service.hueSoft} className="relative h-[92px] w-[92px] drop-shadow-sm" />
        <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-bold" style={{ background: service.hueSoft, color: C.cocoa }}>
          <span className="h-2 w-2 rounded-full" style={{ background: service.hue }} />
          {pick(service.kind)}
        </span>
        <h3 className="bofs-display bofs-display-sm mt-3 text-[23px]">{service.name}</h3>
        <p className="mt-2 flex-1 text-[15px] leading-relaxed" style={{ color: C.body }}>
          {pick(service.card)}
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-bold" style={{ color: C.clayText }}>
          {pick(UI.exploreCentre)}
          <Arrow className="transition-transform duration-200 ease-out group-hover:translate-x-1" />
        </span>
      </Link>
    </Reveal>
  )
}

/* ── count-up number (verified stats only) ────────────────────────────── */

export function StatCountUp({ value, format = 'plain', className, style }: { value: number; format?: 'plain' | 'thousand'; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [lang] = useLang()
  const inView = useInView(ref, { once: true, margin: '-70px' })
  const reduce = useReducedMotion()
  // Deterministic grouping: Icelandic thousands separator is a period, English a
  // comma. Do it by hand; this Chrome's ICU mis-maps is-IS to a comma.
  const sep = lang === 'is' ? '.' : ','
  const fmt = useCallback((n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep), [sep])

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (reduce || !inView) {
      if (reduce) node.textContent = fmt(value)
      return
    }
    const controls = animate(0, value, {
      duration: format === 'thousand' ? 1.4 : 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = fmt(v)
      },
    })
    return () => controls.stop()
  }, [inView, reduce, value, fmt, format])

  return (
    <span ref={ref} className={`bofs-num ${className ?? ''}`} style={style}>
      {reduce ? fmt(value) : fmt(0)}
    </span>
  )
}

/* ── sticky scroll-spy sub-nav (shared by the two long pages) ─────────── */

export function SubNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? '')
  const idKey = sections.map((s) => s.id).join('|')

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
    if (!els.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-42% 0px -52% 0px', threshold: [0, 0.2, 0.5, 1] },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idKey])

  return (
    <div className="sticky top-[84px] z-40 mx-auto max-w-6xl px-4">
      <nav
        className="no-scrollbar flex gap-1 overflow-x-auto rounded-full p-1.5"
        style={{ background: 'rgba(251,243,231,.92)', boxShadow: `inset 0 0 0 1px ${C.line}, 0 12px 30px -22px rgba(58,44,34,.5)`, backdropFilter: 'blur(10px)' }}
        aria-label="On this page"
      >
        {sections.map((s) => {
          const on = active === s.id
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="bofs-focus relative shrink-0 rounded-full px-3.5 py-1.5 text-[13.5px] font-semibold transition-colors"
              style={{ color: on ? '#FFF6EC' : C.body }}
              aria-current={on ? 'true' : undefined}
            >
              {on && (
                <motion.span
                  layoutId="bofs-subnav"
                  className="absolute inset-0 -z-10 rounded-full"
                  style={{ background: C.clay }}
                  transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                />
              )}
              {s.label}
            </a>
          )
        })}
      </nav>
    </div>
  )
}

/* ── compositor-only scroll rail (the one scrubbed signature on kerfid) ── */

export function ScrollRail({ progress, className }: { progress?: MotionValue<number>; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-full ${className ?? ''}`} style={{ background: C.line }} aria-hidden="true">
      {progress ? (
        <motion.div className="h-full w-full origin-top rounded-full" style={{ background: C.clay, scaleY: progress }} />
      ) : (
        <div className="h-full w-full rounded-full" style={{ background: C.clay }} />
      )}
    </div>
  )
}

/* ── slim concept disclaimer bar ──────────────────────────────────────── */

export function ConceptBar() {
  const [, , pick] = useLang()
  return (
    <div className="w-full py-1.5 text-center text-[12px] font-medium" style={{ background: C.oat, color: C.body }}>
      {pick(UI.conceptBadge)}
    </div>
  )
}
