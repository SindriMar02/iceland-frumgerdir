import { useEffect, useRef, useState } from 'react'
import type { ReactNode, KeyboardEvent as ReactKeyboardEvent } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from 'framer-motion'
import {
  Phone, MapPin, Clock, ArrowRight, Mail, ExternalLink, Star,
} from 'lucide-react'
import { Img } from '../../components/Img'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { getPreviewCompany } from '../companies'
import { setThemeColor } from '../../lib/preview'
import {
  IMG, PHONE_DISPLAY, PHONE_HREF, EMAIL, EMAIL_HREF, FACEBOOK, THORFISH, TRIPADVISOR,
  LOCATIONS, MENU_HERO, MENU_LIST, PRICE_ESTIMATE, PRICE_SOURCE, REVIEWS, RATINGS, SOURCING_QUOTE,
  OWNER_IMG, HJORDIS_WINDOW_IMG, LOGO_WIDE,
} from './data'

const company = getPreviewCompany('issi')
const BASE = import.meta.env.BASE_URL

/* ISSI – Fish & Chips — "Ljósið í kofanum" redesign.
   Issi's real brand at night: the white hut at Fitjar glowing mint-green in
   the dark (their actual neon signage), the bearded owner (their own
   homepage portrait), fish & chips on real newspaper. The page is a night
   page lit only by that one green glow; everything menu/order-shaped is
   printed on a newsprint ticket, not a SaaS form. Every fact/quote/photo
   below is sourced only from data.ts + the brief. */

/* ---- Palette — sampled from their real photography, AA verified below ----
   Contrast ratios computed against the exact hex pairs used in this file
   (WCAG relative-luminance formula), not eyeballed:
   - MINT       vs NIGHT  → 8.32:1  (night-ground accent: headline, header, CTAs, icons on photos)
   - MINT_GLOW  vs NIGHT  → 11.05:1 (hover/glow variant, brighter still)
   - DEEP       vs NIGHT  → 1.95:1  (decorative fill/border ONLY, never text, on night ground)
   - PAPER      vs NIGHT  → 15.76:1 (body copy on the night ground)
   - INK        vs PAPER  → 14.76:1 (ink text on newsprint panels)
   - DEEP       vs PAPER  → 8.08:1  (the "rubber-stamp" accent — deep green reads fine on paper,
                                      which is why DEEP is the ticket's accent while MINT is the
                                      night ground's — MINT on PAPER is only 1.89:1 and is never used) */
const NIGHT = '#0C0F0E' // ground — warm near-black, not pure black
const MINT = '#4FBD9A' // neon mint sampled from the hut's real glow — primary night accent
const MINT_GLOW = '#5FD9B2' // bright glow variant — hover states, the flicker's steady peak
const DEEP = '#1E4B3C' // deep green — the ticket's accent (stamps, borders, icons on paper)
const PAPER = '#EDE8DC' // newsprint panel surface + body text colour on the night ground
const INK = '#141716' // ink text on newsprint panels

/* ---- Type ---- */
const DISPLAY = "'Tanker-Regular', sans-serif" // chunky poster face — page-local @font-face below
const BODY = 'var(--font-manrope)' // body/nav/buttons
const MONO = 'var(--font-geistmono)' // prices/labels/ticket — newsprint voice

const EASE = 'cubic-bezier(0.16,1,0.3,1)'
/* Two focus-ring treatments: night-ground controls get a mint ring (safe at
   8–11:1 on NIGHT); paper-ticket controls get an ink ring (MINT fails
   3:1 non-text contrast on PAPER, so it is never used there). */
const FOCUS_NIGHT = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5FD9B2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C0F0E]'
const FOCUS_PAPER = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141716] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EDE8DC]'

/* Shared Lenis handle so nav/CTAs can smooth-scroll to a section. Offset
   clears the fixed header (~72px) so the section heading never lands hidden
   underneath it. */
let lenisRef: Lenis | null = null
const HEADER_CLEARANCE = 88
function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenisRef) {
    lenisRef.scrollTo(el, { offset: -HEADER_CLEARANCE })
  } else {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_CLEARANCE
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
  }
}

const WRAP = 'mx-auto w-full max-w-[1440px] px-5 md:px-10 xl:px-16'

/* ============================================================= Reveals
   Two independent, non-framer entrance mechanisms (CSS transition driven —
   framer-motion mount/state variants proved unreliable on this stack, so we
   never gate opacity on framer's initial/animate props here):
   - Rise: mount-triggered (hero, above the fold), one shared timer.
   - FadeUp / PhotoClip: IntersectionObserver-triggered (everything below). */
function useMountShown(reduce: boolean) {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    if (reduce) { setShown(true); return }
    const raf = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(raf)
  }, [reduce])
  return shown
}

function Rise({ shown, reduce, delay = 0, className = '', children }: {
  shown: boolean; reduce: boolean; delay?: number; className?: string; children: ReactNode
}) {
  return (
    <div
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(18px)',
        transition: reduce ? 'none' : `opacity 640ms ${EASE} ${delay}ms, transform 700ms ${EASE} ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function FadeUp({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion() ?? false
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    if (reduce) { setShown(true); return }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { setShown(true); io.disconnect() } }),
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduce])
  return (
    <div ref={ref} className={className}>
      <div
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? 'none' : 'translateY(24px)',
          transition: reduce ? 'none' : `opacity 700ms ${EASE} ${delay}ms, transform 760ms ${EASE} ${delay}ms`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

/* Clip-path reveal for standalone content photos. Outer = untransformed IO
   target; only the inner element clips/scales. */
function PhotoClip({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion() ?? false
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    if (reduce) { setShown(true); return }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { setShown(true); io.disconnect() } }),
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduce])
  return (
    <div ref={ref} className={className}>
      <div
        style={{
          height: '100%',
          clipPath: shown ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
          transform: shown ? 'scale(1)' : 'scale(1.06)',
          transition: reduce ? 'none' : `clip-path 820ms ${EASE} ${delay}ms, transform 900ms ${EASE} ${delay}ms`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

/* ============================================================= Small bits */
function Tag({ children, tone = 'outline' }: { children: ReactNode; tone?: 'outline' | 'mint' | 'ink' }) {
  const styles =
    tone === 'mint'
      ? { color: INK, background: MINT }
      : tone === 'ink'
        ? { color: 'rgba(20,23,22,0.62)', border: '1px solid rgba(20,23,22,0.2)' }
        : { color: 'rgba(237,232,220,0.78)', border: '1px solid rgba(237,232,220,0.26)' }
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] tracking-[0.14em] uppercase"
      style={{ fontFamily: MONO, ...styles }}
    >
      {children}
    </span>
  )
}

function PrimaryButton({ onClick, href, children }: { onClick?: () => void; href?: string; children: ReactNode }) {
  const cls = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-bold transition-transform duration-200 hover:-translate-y-0.5 ${FOCUS_NIGHT}`
  const style = {
    fontFamily: BODY,
    background: MINT,
    color: INK,
    boxShadow: '0 0 0 1px rgba(79,189,154,0.45), 0 10px 28px -10px rgba(79,189,154,0.65)',
  }
  if (href) return <a href={href} className={cls} style={style}>{children}</a>
  return <button type="button" onClick={onClick} className={cls} style={style}>{children}</button>
}
function GhostButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-bold transition-colors duration-200 hover:border-[#5FD9B2] ${FOCUS_NIGHT}`}
      style={{ fontFamily: BODY, border: '1.5px solid rgba(237,232,220,0.5)', color: PAPER }}
    >
      {children}
    </a>
  )
}

/* ============================================================= Order ticket
   Signature interaction: "Settu saman kassann" — kept as a radiogroup
   (main), radiogroup (size, only when the item defines sizes) and a
   checkbox-group (meðlæti), now printed as a "Pöntunarmiði": a torn-edge
   newsprint ticket (is-ticket) instead of a dark UI card. The three real
   product-cutout photos crossfade/scale to assemble a visual box that sits
   directly on the paper. Under reduced motion the crossfade/scale never
   runs; the underlying controls are always real, readable text regardless
   of motion. */
const SIZE_SCALE: Record<string, number> = { Lítill: 0.8, Miðlungs: 0.9, Stór: 1 }
const EXTRA_NAMES = ['Gellur', 'Issapopp', 'Issa sósa', 'Drykkir']
const EXTRAS = MENU_LIST.filter((m) => EXTRA_NAMES.includes(m.name))

function radioKeyHandler(count: number, current: number, onMove: (next: number) => void) {
  return (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    let next = current
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (current + 1) % count
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (current - 1 + count) % count
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = count - 1
    else return
    e.preventDefault()
    onMove(next)
  }
}

function RadioPill({ id, active, label, sub, onClick, onKeyDown, innerRef }: {
  id: string; active: boolean; label: string; sub?: string
  onClick: () => void; onKeyDown: (e: ReactKeyboardEvent<HTMLButtonElement>) => void
  innerRef: (el: HTMLButtonElement | null) => void
}) {
  return (
    <button
      id={id}
      ref={innerRef}
      type="button"
      role="radio"
      aria-checked={active}
      tabIndex={active ? 0 : -1}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={`min-h-11 flex-1 rounded-2xl px-4 py-3 text-left transition-colors duration-200 ${FOCUS_PAPER}`}
      style={{
        background: active ? DEEP : 'rgba(20,23,22,0.04)',
        border: `1.5px solid ${active ? DEEP : 'rgba(20,23,22,0.22)'}`,
      }}
    >
      <span className="block text-base font-bold" style={{ fontFamily: BODY, color: active ? PAPER : INK }}>{label}</span>
      {sub && (
        <span className="mt-0.5 block text-[11px] uppercase tracking-wide" style={{ fontFamily: MONO, color: active ? 'rgba(237,232,220,0.75)' : 'rgba(20,23,22,0.62)' }}>
          {sub}
        </span>
      )}
    </button>
  )
}

function TogglePill({ active, label, sub, onClick }: { active: boolean; label: string; sub: string; onClick: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={active}
      onClick={onClick}
      className={`is-stamp min-h-11 inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-left transition-transform duration-150 ${FOCUS_PAPER}`}
      style={{
        background: active ? 'rgba(30,75,60,0.08)' : 'rgba(20,23,22,0.03)',
        border: `2px solid ${active ? DEEP : 'rgba(20,23,22,0.22)'}`,
        transform: active ? 'rotate(-1.5deg)' : 'none',
      }}
    >
      <span
        aria-hidden
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
        style={{ background: active ? DEEP : 'transparent', border: active ? 'none' : '1.5px solid rgba(20,23,22,0.4)', color: PAPER }}
      >
        {active ? '✓' : ''}
      </span>
      <span className="text-sm font-bold uppercase tracking-wide" style={{ fontFamily: MONO, color: active ? DEEP : INK }}>{label}</span>
      <span className="hidden text-[11px] sm:inline" style={{ fontFamily: MONO, color: 'rgba(20,23,22,0.62)' }}>{sub}</span>
    </button>
  )
}

function OrderTicket({ reduce }: { reduce: boolean }) {
  const [mainIndex, setMainIndex] = useState(0)
  const [sizeIndex, setSizeIndex] = useState<number | null>(MENU_HERO[0].sizes.length ? 0 : null)
  const [extras, setExtras] = useState<Set<string>>(new Set())
  const mainRefs = useRef<Array<HTMLButtonElement | null>>([])
  const sizeRefs = useRef<Array<HTMLButtonElement | null>>([])

  const mainItem = MENU_HERO[mainIndex]
  const sizeLabel = sizeIndex !== null ? mainItem.sizes[sizeIndex] ?? null : null
  const scale = sizeLabel ? SIZE_SCALE[sizeLabel] ?? 1 : 1
  const extraList = Array.from(extras)
  const issaborgari = MENU_LIST.find((m) => m.name === 'Issaborgari')

  function selectMain(i: number) {
    setMainIndex(i)
    setSizeIndex(MENU_HERO[i].sizes.length ? 0 : null)
    mainRefs.current[i]?.focus()
  }
  function selectSize(i: number) {
    setSizeIndex(i)
    sizeRefs.current[i]?.focus()
  }
  function toggleExtra(name: string) {
    setExtras((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const summary = `Í kassanum: ${sizeLabel ? `${sizeLabel} ` : ''}${mainItem.name}${extraList.length ? ` með ${extraList.join(', ')}` : ''}.`

  return (
    <div className="is-ticket rounded-[8px] p-6 md:p-10" style={{ background: PAPER, boxShadow: '0 30px 70px -30px rgba(0,0,0,0.55)' }}>
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        {/* ---- Controls ---- */}
        <div>
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'rgba(20,23,22,0.16)' }}>
            <span className="text-lg font-bold" style={{ fontFamily: DISPLAY, color: INK }}>Pöntunarmiði</span>
            <span className="text-[11px] uppercase tracking-[0.14em]" style={{ fontFamily: MONO, color: 'rgba(20,23,22,0.5)' }}>Nr. 001 · ISSI</span>
          </div>

          <div className="mt-6">
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase" style={{ fontFamily: MONO, color: DEEP }}>Skref 1 · Veldu aðalrétt</span>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row" role="radiogroup" aria-label="Veldu aðalrétt">
              {MENU_HERO.map((it, i) => (
                <RadioPill
                  key={it.name}
                  id={`issi-main-${i}`}
                  active={i === mainIndex}
                  label={it.name}
                  sub={it.note}
                  innerRef={(el) => { mainRefs.current[i] = el }}
                  onClick={() => selectMain(i)}
                  onKeyDown={radioKeyHandler(MENU_HERO.length, mainIndex, selectMain)}
                />
              ))}
            </div>
          </div>

          {mainItem.sizes.length > 0 && (
            <div className="mt-8">
              <span className="text-[11px] font-bold tracking-[0.18em] uppercase" style={{ fontFamily: MONO, color: DEEP }}>Skref 2 · Veldu stærð</span>
              <div className="mt-3 flex gap-2" role="radiogroup" aria-label="Veldu stærð">
                {mainItem.sizes.map((s, i) => (
                  <RadioPill
                    key={s}
                    id={`issi-size-${i}`}
                    active={i === sizeIndex}
                    label={s}
                    innerRef={(el) => { sizeRefs.current[i] = el }}
                    onClick={() => selectSize(i)}
                    onKeyDown={radioKeyHandler(mainItem.sizes.length, sizeIndex ?? 0, selectSize)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase" style={{ fontFamily: MONO, color: DEEP }}>Skref 3 · Bæta við meðlæti (valfrjálst)</span>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Bæta við meðlæti">
              {EXTRAS.map((it) => (
                <TogglePill key={it.name} active={extras.has(it.name)} label={it.name} sub={it.note} onClick={() => toggleExtra(it.name)} />
              ))}
            </div>
            {issaborgari && (
              <p className="mt-4 text-[13px]" style={{ fontFamily: MONO, color: 'rgba(20,23,22,0.68)' }}>
                Einnig á boðstólum: {issaborgari.name}, {issaborgari.note}.
              </p>
            )}
          </div>

          <p aria-live="polite" className="sr-only">{summary}</p>

          <div className="mt-9 border-t-2 border-dashed pt-5" style={{ borderColor: 'rgba(20,23,22,0.28)' }}>
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-sm font-bold" style={{ fontFamily: MONO, color: INK }}>{PRICE_ESTIMATE}</span>
              <span className="text-[11px]" style={{ fontFamily: MONO, color: 'rgba(20,23,22,0.55)' }}>({PRICE_SOURCE})</span>
            </p>
            <p className="mt-2 text-[13px]" style={{ color: 'rgba(20,23,22,0.62)' }}>
              Þetta er matseðilskönnuður til að skoða samsetningar, ekki pöntunarkerfi. Hringdu til að panta.
            </p>
            <p className="mt-2 text-[13px]" style={{ color: 'rgba(20,23,22,0.62)' }}>
              Fiskurinn fer í deigið og á pönnuna þegar þú pantar. Ekkert liggur tilbúið undir lampa.
            </p>
            <div className="mt-4">
              <PrimaryButton href={PHONE_HREF}><Phone className="h-4 w-4" aria-hidden /> Hringja og panta</PrimaryButton>
            </div>
          </div>
        </div>

        {/* ---- Assembled box, printed straight onto the ticket ---- */}
        <div className="flex flex-col items-center">
          <div className="relative aspect-square w-full max-w-sm" style={{ border: '2px dotted rgba(20,23,22,0.3)', borderRadius: 4 }}>
            {MENU_HERO.map((it, i) => (
              <div
                key={it.name}
                aria-hidden
                className="absolute inset-0 flex items-center justify-center p-8"
                style={{
                  opacity: i === mainIndex ? 1 : 0,
                  transform: i === mainIndex ? `scale(${scale})` : 'scale(0.92)',
                  transition: reduce ? 'none' : `opacity 420ms ${EASE}, transform 420ms ${EASE}`,
                }}
              >
                <Img src={it.img} alt="" className="h-full w-full object-contain drop-shadow-2xl" />
              </div>
            ))}
            <div className="absolute inset-x-0 bottom-2 flex flex-wrap justify-center gap-1.5 px-3">
              {extraList.map((name) => (
                <span
                  key={name}
                  className="is-stamp-pop rounded-sm px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
                  style={{ fontFamily: MONO, border: `1.5px solid ${DEEP}`, color: DEEP, background: 'rgba(237,232,220,0.9)', transform: 'rotate(-2deg)' }}
                >
                  + {name}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-4 max-w-xs text-center text-[13px]" style={{ fontFamily: MONO, color: 'rgba(20,23,22,0.55)' }}>
            Alveg eins og kassarnir sem koma yfir borðið, bara stafrænir.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ============================================================= Page */
export default function Page() {
  const reduce = useReducedMotion() ?? false
  const heroShown = useMountShown(reduce)
  const [solid, setSolid] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.title = 'ISSI Fish & Chips · Ljósið í kofanum'
    setThemeColor(NIGHT)
  }, [])

  // Header solidity after scrolling past the hero.
  useEffect(() => {
    const onScroll = () => setSolid((window.scrollY || 0) > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lenis smooth scroll (skipped entirely under reduced motion).
  useEffect(() => {
    if (reduce) return
    const lenis = new Lenis({ duration: 1.15, easing: (x) => Math.min(1, 1.001 - Math.pow(2, -10 * x)), smoothWheel: true })
    lenisRef = lenis
    let raf = 0
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef = null
    }
  }, [reduce])

  // Mobile nav: body scroll lock + Lenis stop/start + Escape + focus into panel.
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      lenisRef?.stop()
      const raf = requestAnimationFrame(() => closeBtnRef.current?.focus())
      const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
      window.addEventListener('keydown', onKey)
      return () => {
        cancelAnimationFrame(raf)
        window.removeEventListener('keydown', onKey)
      }
    }
    document.body.style.overflow = ''
    if (!reduce) lenisRef?.start()
    return undefined
  }, [menuOpen, reduce])

  function trapTab(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Tab') return
    const els = overlayRef.current?.querySelectorAll<HTMLElement>('a[href],button')
    if (!els?.length) return
    const first = els[0]
    const last = els[els.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }

  function onNavTap(id: string) {
    setMenuOpen(false)
    document.body.style.overflow = ''
    if (!reduce) lenisRef?.start()
    scrollToId(id)
  }

  const NAV: { id: string; label: string }[] = [
    { id: 'kassinn', label: 'Matseðill' },
    { id: 'uppruni', label: 'Uppruni' },
    { id: 'sagan', label: 'Sagan' },
    { id: 'umsagnir', label: 'Umsagnir' },
    { id: 'stadsetningar', label: 'Staðir' },
  ]

  return (
    <div style={{ background: NIGHT, color: PAPER, fontFamily: BODY }} className="min-h-screen overflow-x-hidden">
      <style>{`
        @font-face{font-family:'Tanker-Regular';font-weight:400;font-style:normal;font-display:swap;
          src:url('${BASE}fonts/tanker/fonts/Tanker-Regular.woff2') format('woff2'),
              url('${BASE}fonts/tanker/fonts/Tanker-Regular.woff') format('woff'),
              url('${BASE}fonts/tanker/fonts/Tanker-Regular.ttf') format('truetype')}

        .is-bgphoto { animation: is-bg-in 1500ms cubic-bezier(.16,1,.3,1) both; }
        @keyframes is-bg-in { from { transform: scale(1.08); } to { transform: scale(1); } }

        /* Neon flicker-on, once, on mount — a classic two-dip start settling
           to steady glow. Content itself is never hidden (opacity never
           drops below .55) so nothing is gated on this animation. */
        .is-neon-flicker { animation: is-neon-flicker 1500ms ${EASE} both; }
        @keyframes is-neon-flicker {
          0%   { opacity: .55; filter: drop-shadow(0 0 1px rgba(95,217,178,.15)); }
          8%   { opacity: 1;   filter: drop-shadow(0 0 14px rgba(95,217,178,.85)); }
          16%  { opacity: .6;  filter: drop-shadow(0 0 2px rgba(95,217,178,.2)); }
          26%  { opacity: 1;   filter: drop-shadow(0 0 10px rgba(95,217,178,.75)); }
          45%  { opacity: .92; filter: drop-shadow(0 0 6px rgba(95,217,178,.55)); }
          100% { opacity: 1;   filter: drop-shadow(0 0 8px rgba(95,217,178,.6)); }
        }

        .is-burger { position: relative; width: 44px; height: 44px; border-radius: 12px; border: 1.5px solid rgba(237,232,220,.32); background: rgba(12,15,14,.35); }
        .is-burger-bar { position: absolute; left: 12px; right: 12px; height: 2px; border-radius: 2px; background: ${MINT}; transition: transform 320ms cubic-bezier(.16,1,.3,1), opacity 200ms ease, background-color 320ms ease; }
        .is-burger-bar:nth-child(1) { top: 15px; }
        .is-burger-bar:nth-child(2) { top: 21px; }
        .is-burger-bar:nth-child(3) { top: 27px; }
        .is-burger.is-open .is-burger-bar { background: ${MINT_GLOW}; }
        .is-burger.is-open .is-burger-bar:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .is-burger.is-open .is-burger-bar:nth-child(2) { opacity: 0; }
        .is-burger.is-open .is-burger-bar:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

        .is-nav-overlay {
          position: fixed; inset: 0; z-index: 60; background: ${NIGHT};
          display: flex; flex-direction: column; visibility: hidden; opacity: 0; transform: translateY(-14px);
          transition: opacity 380ms cubic-bezier(.16,1,.3,1), transform 380ms cubic-bezier(.16,1,.3,1), visibility 0s linear 380ms;
        }
        .is-nav-overlay.is-open { visibility: visible; opacity: 1; transform: translateY(0); transition: opacity 380ms cubic-bezier(.16,1,.3,1), transform 380ms cubic-bezier(.16,1,.3,1), visibility 0s; }
        .is-nav-link { opacity: 0; transform: translateY(16px); transition: opacity 420ms cubic-bezier(.16,1,.3,1), transform 420ms cubic-bezier(.16,1,.3,1); }
        .is-nav-overlay.is-open .is-nav-link:nth-child(1) { transition-delay: 70ms; }
        .is-nav-overlay.is-open .is-nav-link:nth-child(2) { transition-delay: 120ms; }
        .is-nav-overlay.is-open .is-nav-link:nth-child(3) { transition-delay: 170ms; }
        .is-nav-overlay.is-open .is-nav-link:nth-child(4) { transition-delay: 220ms; }
        .is-nav-overlay.is-open .is-nav-link:nth-child(5) { transition-delay: 270ms; }
        .is-nav-overlay.is-open .is-nav-link { opacity: 1; transform: translateY(0); }

        .is-stamp-pop { animation: is-stamp-in 260ms cubic-bezier(.16,1,.3,1) both; }
        @keyframes is-stamp-in { from { opacity: 0; transform: translateY(6px) scale(.9) rotate(-2deg); } to { opacity: 1; transform: rotate(-2deg); } }
        .is-stamp:active { transform: scale(.98); }

        /* Torn-ticket perforation — a repeating row of night-coloured notches
           cut into the paper's top and bottom edge. */
        .is-ticket { position: relative; }
        .is-ticket::before, .is-ticket::after {
          content: ''; position: absolute; left: 0; right: 0; height: 16px; pointer-events: none;
          background-image: radial-gradient(circle at 11px 50%, ${NIGHT} 7px, transparent 7.5px);
          background-size: 22px 16px; background-repeat: repeat-x;
        }
        .is-ticket::before { top: -8px; }
        .is-ticket::after { bottom: -8px; }

        @media (prefers-reduced-motion: reduce) {
          .is-bgphoto { animation: none; }
          .is-neon-flicker { animation: none; opacity: 1; filter: drop-shadow(0 0 8px rgba(95,217,178,.6)); }
          .is-burger-bar { transition: none; }
          .is-nav-overlay, .is-nav-link { transition: none !important; }
          .is-stamp-pop { animation: none; }
        }
      `}</style>

      {/* ---- Header (fixed, transparent over hero then solid) ---- */}
      <header
        className="fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-4 px-5 py-4 transition-colors duration-300 md:px-10"
        style={{ background: solid || menuOpen ? 'rgba(12,15,14,0.88)' : 'transparent', backdropFilter: solid || menuOpen ? 'blur(10px)' : 'none', borderBottom: solid || menuOpen ? '1px solid rgba(237,232,220,0.1)' : '1px solid transparent' }}
      >
        <a
          href="#top"
          onClick={(e) => { e.preventDefault(); scrollToId('top') }}
          className={`is-neon-flicker select-none ${FOCUS_NIGHT}`}
          aria-label="ISSI Fish & Chips"
        >
          <img src={LOGO_WIDE} alt="ISSI Fish &amp; Chips" style={{ height: 30, width: 'auto', display: 'block' }} />
        </a>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Valmynd á síðu">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={(e) => { e.preventDefault(); scrollToId(n.id) }}
              className={`text-[13px] font-bold tracking-wide transition-colors hover:text-[#5FD9B2] ${FOCUS_NIGHT}`}
              style={{ fontFamily: BODY, color: PAPER }}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={PHONE_HREF}
            className={`inline-flex min-h-11 items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-bold ring-1 ring-inset ring-white/25 sm:text-sm ${FOCUS_NIGHT}`}
            style={{ fontFamily: MONO, color: PAPER }}
          >
            <Phone className="h-4 w-4 shrink-0" style={{ color: MINT }} aria-hidden /> {PHONE_DISPLAY}
          </a>
          <button
            type="button"
            className={`is-burger lg:hidden ${FOCUS_NIGHT}${menuOpen ? ' is-open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls="issi-mobile-nav"
            aria-label={menuOpen ? 'Loka valmynd' : 'Opna valmynd'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="is-burger-bar" />
            <span className="is-burger-bar" />
            <span className="is-burger-bar" />
          </button>
        </div>
      </header>

      {/* ---- Full-screen mobile nav overlay (header sibling) ---- */}
      <div
        id="issi-mobile-nav"
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Valmynd"
        aria-hidden={!menuOpen}
        onKeyDown={trapTab}
        className={`is-nav-overlay${menuOpen ? ' is-open' : ''}`}
      >
        <div className="flex items-center justify-between px-5 pt-6 md:px-10">
          <img src={LOGO_WIDE} alt="ISSI Fish &amp; Chips" style={{ height: 28, width: 'auto', filter: 'drop-shadow(0 0 8px rgba(95,217,178,.55))' }} />
          <button ref={closeBtnRef} type="button" onClick={() => setMenuOpen(false)} aria-label="Loka valmynd" className={`is-burger is-open ${FOCUS_NIGHT}`}>
            <span className="is-burger-bar" />
            <span className="is-burger-bar" />
            <span className="is-burger-bar" />
          </button>
        </div>
        <nav className="mt-10 flex flex-1 flex-col gap-1 px-5 md:px-10" aria-label="Valmynd á síðu">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={(e) => { e.preventDefault(); onNavTap(n.id) }}
              className={`is-nav-link border-b py-4 text-[clamp(1.8rem,6vw,2.6rem)] ${FOCUS_NIGHT}`}
              style={{ fontFamily: DISPLAY, fontWeight: 400, lineHeight: 1.15, color: PAPER, borderColor: 'rgba(237,232,220,0.14)' }}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="is-nav-link flex flex-col gap-3 px-5 pb-10 md:px-10">
          <a href={PHONE_HREF} className={`inline-flex min-h-11 items-center gap-2 text-lg font-bold ${FOCUS_NIGHT}`} style={{ fontFamily: MONO, color: MINT_GLOW }}>
            <Phone className="h-5 w-5" aria-hidden /> {PHONE_DISPLAY}
          </a>
          <a href={EMAIL_HREF} className={`inline-flex min-h-11 items-center gap-2 text-sm ${FOCUS_NIGHT}`} style={{ fontFamily: MONO, color: 'rgba(237,232,220,0.7)' }}>
            <Mail className="h-4 w-4" aria-hidden /> {EMAIL}
          </a>
        </div>
      </div>

      {/* ==================================================== 1 · HERO */}
      <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden">
        <div className="is-bgphoto absolute inset-0">
          <Img
            src={OWNER_IMG}
            fetchpriority="high"
            loading="eager"
            alt="Issi, með derhúfu og yfirvaraskegg, brosir í eldhúsinu hjá ISSI Fish &amp; Chips."
            className="h-full w-full object-cover"
            style={{ objectPosition: 'center 30%', filter: 'grayscale(1) contrast(1.08) brightness(.94)' }}
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, rgba(12,15,14,.68) 0%, rgba(12,15,14,.14) 26%, rgba(12,15,14,.12) 56%, rgba(12,15,14,.94) 100%),
                         radial-gradient(ellipse at 22% 100%, rgba(79,189,154,.24) 0%, rgba(79,189,154,0) 55%)`,
          }}
        />

        <div className="relative flex flex-1 flex-col justify-between pt-24 pb-10 md:pt-28">
          {/* Credibility, up top */}
          <Rise shown={heroShown} reduce={reduce} className={WRAP}>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold tracking-[0.1em] uppercase ring-1 ring-white/30" style={{ fontFamily: MONO, color: PAPER }}>
                Tilnefnd til alþjóðlegra verðlauna · National Fish &amp; Chip Awards 2026
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold tracking-[0.1em] uppercase ring-1 ring-white/30" style={{ fontFamily: MONO, color: PAPER }}>
                <Star className="h-3.5 w-3.5" style={{ color: MINT }} aria-hidden /> {RATINGS[0].value}/5 Google · {RATINGS[0].detail}
              </span>
            </div>
          </Rise>

          {/* Main hero content, anchored bottom */}
          <div className={WRAP}>
            <Rise shown={heroShown} reduce={reduce} delay={80}>
              <span className="text-[12px] font-bold tracking-[0.24em] uppercase" style={{ fontFamily: MONO, color: 'rgba(237,232,220,0.75)' }}>
                Fitjar 3 · Reykjanesbær &amp; Selfoss
              </span>
            </Rise>
            <Rise shown={heroShown} reduce={reduce} delay={160}>
              <h1
                className="is-neon-flicker mt-4 text-[clamp(2.8rem,11vw,7.8rem)]"
                style={{ fontFamily: DISPLAY, fontWeight: 400, lineHeight: 1.12, color: MINT_GLOW }}
              >
                Ljósið í kofanum
              </h1>
            </Rise>
            <Rise shown={heroShown} reduce={reduce} delay={240} className="mt-5 max-w-xl">
              <p className="text-lg md:text-xl" style={{ color: 'rgba(237,232,220,0.88)' }}>
                Fiskur og franskar, steikt eftir pöntun. Sérvalinn og sjófrystur fiskur, alltaf ferskur í deigið.
              </p>
            </Rise>
            <Rise shown={heroShown} reduce={reduce} delay={320} className="mt-8 flex flex-wrap items-center gap-3">
              <PrimaryButton onClick={() => scrollToId('kassinn')}>Settu saman kassann <ArrowRight className="h-4 w-4" aria-hidden /></PrimaryButton>
              <GhostButton href={PHONE_HREF}><Phone className="h-4 w-4" aria-hidden /> {PHONE_DISPLAY}</GhostButton>
              <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm ring-1 ring-white/25" style={{ fontFamily: MONO, color: 'rgba(237,232,220,0.85)' }}>
                <Clock className="h-4 w-4" aria-hidden /> Opið alla daga 11:00–20:00
              </span>
            </Rise>
          </div>
        </div>
      </section>

      {/* ==================================================== 2 · TRUST STRIP */}
      <section aria-label="Traust og viðurkenningar" style={{ borderTop: '1px solid rgba(237,232,220,0.1)', borderBottom: '1px solid rgba(237,232,220,0.1)' }}>
        <h2 className="sr-only">Traust og viðurkenningar</h2>
        <div className={`${WRAP} grid gap-x-8 gap-y-4 py-6 text-center md:grid-cols-3 md:text-left`}>
          {[
            'Tilnefnd 2026 · National Fish & Chip Awards, alþjóðlegi flokkurinn',
            `${RATINGS[0].value}/5 á ${RATINGS[0].platform} · ${RATINGS[0].detail}`,
            `${RATINGS[1].value}/5 á ${RATINGS[1].platform} · ${RATINGS[1].detail}`,
          ].map((t, i) => (
            <div key={t} className={`flex items-center justify-center gap-3 md:justify-start ${i < 2 ? 'md:border-r md:border-white/10' : ''}`}>
              <Star className="h-4 w-4 shrink-0" style={{ color: MINT }} aria-hidden />
              <p className="text-[13px] leading-snug tracking-wide" style={{ fontFamily: MONO, color: 'rgba(237,232,220,0.85)' }}>{t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================== 3 · ORDER TICKET (signature) */}
      <section id="kassinn" className={`${WRAP} py-20 md:py-28`}>
        <FadeUp>
          <Tag tone="mint">Settu saman kassann</Tag>
          <h2 className="mt-4 max-w-2xl text-[clamp(2rem,5vw,3.6rem)]" style={{ fontFamily: DISPLAY, fontWeight: 400, lineHeight: 1.12 }}>
            Prófaðu þig áfram á matseðlinum
          </h2>
          <p className="mt-4 max-w-xl text-lg" style={{ color: 'rgba(237,232,220,0.72)' }}>
            Veldu aðalrétt, stærð og meðlæti og sjáðu kassann þinn taka á sig mynd, alveg eins og hann kemur yfir borðið.
          </p>
        </FadeUp>

        <FadeUp delay={80} className="mt-12">
          <OrderTicket reduce={reduce} />
        </FadeUp>

        <FadeUp delay={100} className="mt-14">
          <div className="overflow-hidden rounded-2xl">
            <Img
              src={IMG('01_issi_1574_1720x920.webp')}
              alt="Tveir stökkir fiskbitar í deigi með frönskum og sósu í ISSI kassa á dagblaðapappír."
              className="aspect-[21/9] w-full object-cover"
            />
          </div>
          <h3 className="mt-8 text-sm font-bold tracking-[0.14em] uppercase" style={{ fontFamily: MONO, color: 'rgba(237,232,220,0.55)' }}>Allur matseðillinn</h3>
          <ul className="mt-4 grid gap-x-10 gap-y-1 md:grid-cols-2">
            {MENU_LIST.map((it) => (
              <li key={it.name} className="flex items-baseline justify-between gap-4 border-b py-4" style={{ borderColor: 'rgba(237,232,220,0.1)' }}>
                <div>
                  <span className="text-xl" style={{ fontFamily: DISPLAY, fontWeight: 400 }}>{it.name}</span>
                  <span className="ml-3 text-sm" style={{ color: 'rgba(237,232,220,0.68)' }}>{it.note}</span>
                </div>
                {it.sizes && <span className="shrink-0 text-[12px]" style={{ fontFamily: MONO, color: 'rgba(237,232,220,0.62)' }}>{it.sizes}</span>}
              </li>
            ))}
          </ul>
        </FadeUp>
      </section>

      {/* ==================================================== 4 · SOURCING (full-bleed) */}
      <section id="uppruni" aria-label="Fiskurinn okkar" className="relative overflow-hidden">
        <div className="is-bgphoto absolute inset-0">
          <Img
            src={IMG('04_thorbjorn_7341.webp')}
            srcSet={`${IMG('04_thorbjorn_7341-900.webp')} 900w, ${IMG('04_thorbjorn_7341.webp')} 1720w`}
            sizes="100vw"
            alt="Togarinn Ágúst GK-95 plægir í gegnum þunga norður-atlantshafsöldu."
            className="h-full w-full object-cover"
            style={{ filter: 'grayscale(.85) contrast(1.05)' }}
          />
        </div>
        <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(12,15,14,.88) 0%, rgba(12,15,14,.55) 55%, rgba(12,15,14,.25) 100%)' }} />
        <div className={`relative ${WRAP} py-24 md:py-36`}>
          <FadeUp className="max-w-2xl">
            <h2 className="sr-only">Fiskurinn okkar</h2>
            <Tag tone="outline">Fiskurinn okkar</Tag>
            <blockquote className="mt-6 text-[clamp(1.7rem,4.2vw,3rem)]" style={{ fontFamily: DISPLAY, fontWeight: 400, lineHeight: 1.16, color: PAPER }}>
              „{SOURCING_QUOTE}“
            </blockquote>
            <p className="mt-6 max-w-lg text-[13px] leading-relaxed" style={{ fontFamily: MONO, color: 'rgba(237,232,220,0.7)' }}>
              Þorbjörn hf. heldur utan um rekjanleika aflans. Hægt er að fletta upp hvaðan fiskurinn kemur á{' '}
              <a href={THORFISH} target="_blank" rel="noreferrer" className={`underline underline-offset-2 hover:text-white ${FOCUS_NIGHT}`}>thorfish.is</a>.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ==================================================== 5 · LJÓSIÐ Í KOFANUM (full-bleed night band) */}
      <section aria-label="Ljósið í kofanum" className="relative overflow-hidden">
        <div className="is-bgphoto absolute inset-0">
          <Img
            src={IMG('06_issi_fitjar_snjor.webp')}
            srcSet={`${IMG('06_issi_fitjar_snjor-900.webp')} 900w, ${IMG('06_issi_fitjar_snjor.webp')} 1720w`}
            sizes="100vw"
            alt="Hvíti ISSI kofinn á Fitjum að vetri til í rökkri, grænt ljós skín út um gluggana."
            className="h-full w-full object-cover"
          />
        </div>
        <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(12,15,14,.85) 0%, rgba(12,15,14,.2) 45%, rgba(12,15,14,.35) 100%)' }} />
        <div className={`relative ${WRAP} py-24 text-center md:py-36`}>
          <FadeUp className="mx-auto max-w-2xl">
            <div className="rounded-2xl px-6 py-8" style={{ background: 'rgba(12,15,14,0.62)', backdropFilter: 'blur(2px)' }}>
            <Tag tone="outline">Ljósið í kofanum</Tag>
            <h2 className="mt-6 text-[clamp(1.9rem,5vw,3.6rem)]" style={{ fontFamily: DISPLAY, fontWeight: 400, lineHeight: 1.16, color: MINT_GLOW, textShadow: '0 2px 24px rgba(12,15,14,0.85)' }}>
              Sama ljós, sama kofi, sama fiskur
            </h2>
            <p className="mx-auto mt-5 max-w-md text-[13px] tracking-wide" style={{ fontFamily: MONO, color: 'rgba(237,232,220,0.9)' }}>
              Fitjar 3 · þegar birtan dettur á
            </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ==================================================== 6 · STORY */}
      <section id="sagan" aria-label="Issi og Hjördís" className={`${WRAP} py-20 md:py-28`}>
        <PhotoClip className="overflow-hidden rounded-3xl">
          <Img
            src={HJORDIS_WINDOW_IMG}
            alt="Horft út um afgreiðslugluggann á ISSI, starfsfólk að sinna afgreiðslu."
            className="aspect-[16/6] w-full object-cover"
            style={{ filter: 'grayscale(1) contrast(1.05)' }}
          />
        </PhotoClip>
        <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-16">
          <FadeUp>
            <Tag tone="outline">Issi &amp; Hjördís</Tag>
            <h2 className="mt-4 text-[clamp(1.9rem,4.5vw,3rem)]" style={{ fontFamily: DISPLAY, fontWeight: 400, lineHeight: 1.14 }}>
              Fjölskyldurekið, frá fyrsta degi
            </h2>
          </FadeUp>
          <FadeUp delay={80}>
            <p className="text-lg" style={{ color: 'rgba(237,232,220,0.82)' }}>
              Issi og Hjördís gengu saman í skóla í Grindavík, kynntust aftur á fullorðinsárum og hófu reksturinn saman. Þau byrjuðu með matarbíla árið 2007 og formfestu staðinn sem Tralla ehf árið 2016.
            </p>
            <p className="mt-5 text-[15px] leading-relaxed" style={{ color: 'rgba(237,232,220,0.6)' }}>
              Issi segir að afi hans hafi rekið einn af fyrstu stöðunum á Íslandi sem seldu fisk og franskar, á Akureyri í kringum 1942, og selt breskum hermönnum. Sagan segir að staðurinn hafi síðar brunnið eftir að gleymdist að slökkva á pönnunni. Þetta er sagan sem fylgir nafninu, sögð eins og hún gengur í fjölskyldunni.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ==================================================== 7 · REVIEWS */}
      <section id="umsagnir" aria-label="Umsagnir" className={`${WRAP} py-20 md:py-28`}>
        <FadeUp>
          <Tag tone="mint">Umsagnir</Tag>
          <h2 className="mt-4 text-[clamp(2rem,5vw,3.4rem)]" style={{ fontFamily: DISPLAY, fontWeight: 400, lineHeight: 1.12 }}>
            Fólk keyrir út á Reykjanes fyrir þetta
          </h2>
        </FadeUp>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <FadeUp key={r.author} delay={i * 80}>
              <figure className="flex h-full flex-col rounded-3xl p-6" style={{ background: PAPER, border: '1px solid rgba(20,23,22,0.08)' }}>
                <blockquote className="flex-1 text-[17px] leading-relaxed" style={{ fontFamily: DISPLAY, fontWeight: 400, color: INK }}>„{r.quote}“</blockquote>
                <figcaption className="mt-5 border-t pt-4 text-[12px]" style={{ borderColor: 'rgba(20,23,22,0.1)', fontFamily: MONO, color: 'rgba(20,23,22,0.68)' }}>
                  <span className="block font-bold" style={{ color: INK }}>{r.author}</span>
                  {r.source}
                </figcaption>
              </figure>
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={60}>
          <a href={TRIPADVISOR} target="_blank" rel="noreferrer" className={`mt-8 inline-flex items-center gap-1.5 text-sm font-bold underline underline-offset-4 ${FOCUS_NIGHT}`} style={{ fontFamily: BODY, color: PAPER }}>
            Lesa fleiri umsagnir á TripAdvisor <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        </FadeUp>
      </section>

      {/* ==================================================== 8 · CATERING (full-bleed) */}
      <section aria-label="Á ferðinni" className="relative overflow-hidden">
        <div className="is-bgphoto absolute inset-0">
          <Img
            src={IMG('08_DJI_0005-2_1720x920.webp')}
            srcSet={`${IMG('08_DJI_0005-2_1720x920-900.webp')} 900w, ${IMG('08_DJI_0005-2_1720x920.webp')} 1720w`}
            sizes="100vw"
            alt="Loftmynd af ISSI vagninum dregnum eftir vegi í gegnum íslenskt hraun."
            className="h-full w-full object-cover"
            style={{ filter: 'grayscale(.55) saturate(.7) contrast(1.05)' }}
          />
        </div>
        <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(12,15,14,.92) 0%, rgba(12,15,14,.55) 48%, rgba(12,15,14,.3) 100%)' }} />
        <div className={`relative ${WRAP} py-24 text-center md:py-36`}>
          <FadeUp className="mx-auto max-w-2xl">
            <Tag tone="outline">Á ferðinni</Tag>
            <h2 className="mt-6 text-[clamp(2rem,5vw,3.6rem)]" style={{ fontFamily: DISPLAY, fontWeight: 400, lineHeight: 1.14, color: PAPER }}>
              ISSI kemur með veisluna til þín
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg" style={{ color: 'rgba(237,232,220,0.85)' }}>
              Fiskur og franskar beint úr vagninum, hvar sem hentar. Sendu okkur línu ef þú ert að skipuleggja viðburð eða veislu.
            </p>
            <div className="mt-8 flex justify-center">
              <PrimaryButton href={EMAIL_HREF}><Mail className="h-4 w-4" aria-hidden /> Senda fyrirspurn</PrimaryButton>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ==================================================== 9 · LOCATIONS */}
      <section id="stadsetningar" aria-label="Finndu okkur" className={`${WRAP} py-20 md:py-28`}>
        <FadeUp>
          <Tag tone="mint">Finndu okkur</Tag>
          <h2 className="mt-4 text-[clamp(2rem,5vw,3.4rem)]" style={{ fontFamily: DISPLAY, fontWeight: 400, lineHeight: 1.12 }}>
            Tveir staðir, sami fiskur
          </h2>
        </FadeUp>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {LOCATIONS.map((loc, i) => (
            <FadeUp key={loc.name} delay={i * 90}>
              <article className="flex h-full flex-col overflow-hidden rounded-3xl" style={{ background: PAPER, border: '1px solid rgba(20,23,22,0.08)' }}>
                <PhotoClip className="overflow-hidden">
                  <Img
                    src={loc.img}
                    srcSet={loc.imgMobile !== loc.img ? `${loc.imgMobile} 900w, ${loc.img} 1720w` : undefined}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    alt={loc.alt}
                    className="aspect-[16/10] w-full object-cover"
                    style={loc.name === 'Fitjar' ? undefined : { filter: 'grayscale(.35) contrast(1.05)' }}
                  />
                </PhotoClip>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-2xl" style={{ fontFamily: DISPLAY, fontWeight: 400, color: INK }}>{loc.name}</h3>
                  <p className="mt-2 flex items-start gap-2 text-[15px]" style={{ color: 'rgba(20,23,22,0.78)' }}>
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: DEEP }} aria-hidden />
                    <span>{loc.address}, {loc.place}</span>
                  </p>
                  <div className="mt-3 space-y-1">
                    {loc.hours.map((h) => (
                      <p key={h.label} className="flex items-center gap-2 text-[13px]" style={{ fontFamily: MONO, color: 'rgba(20,23,22,0.68)' }}>
                        <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden /> {h.label} {h.value}
                      </p>
                    ))}
                  </div>
                  <div className="mt-5 overflow-hidden rounded-2xl" style={{ border: '1px solid rgba(20,23,22,0.12)' }}>
                    <iframe
                      title={`Kort: ISSI ${loc.name}`}
                      src={loc.map}
                      loading="eager"
                      className="h-44 w-full"
                      style={{ border: 0 }}
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={80}>
          <div className="mt-12 flex flex-col items-center gap-3 text-center">
            <span className="text-[12px] font-bold tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: 'rgba(237,232,220,0.6)' }}>Hringdu og pantaðu</span>
            <a href={PHONE_HREF} className={`inline-flex items-center gap-3 text-[clamp(2.4rem,8vw,4.5rem)] ${FOCUS_NIGHT}`} style={{ fontFamily: DISPLAY, fontWeight: 400, lineHeight: 1.1, color: MINT_GLOW }}>
              <Phone className="h-8 w-8 md:h-10 md:w-10" style={{ color: MINT }} aria-hidden /> {PHONE_DISPLAY}
            </a>
          </div>
        </FadeUp>
      </section>

      {/* ==================================================== 10 · FINAL CTA */}
      <section aria-label="Komdu við" style={{ borderTop: '1px solid rgba(237,232,220,0.1)' }}>
        <div className={`${WRAP} py-20 text-center md:py-28`}>
          <FadeUp>
            <h2 className="text-[clamp(2.4rem,7vw,5rem)]" style={{ fontFamily: DISPLAY, fontWeight: 400, lineHeight: 1.16, color: MINT_GLOW, filter: 'drop-shadow(0 0 18px rgba(95,217,178,.45))' }}>Ljósið í kofanum</h2>
            <p className="mx-auto mt-4 max-w-lg text-lg" style={{ color: 'rgba(237,232,220,0.78)' }}>
              Fitjar 3 í Reykjanesbæ og við BYKO á Selfossi. Komdu við, hringdu eða sendu okkur línu.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <PrimaryButton href={PHONE_HREF}><Phone className="h-4 w-4" aria-hidden /> {PHONE_DISPLAY}</PrimaryButton>
              <GhostButton href={EMAIL_HREF}><Mail className="h-4 w-4" aria-hidden /> {EMAIL}</GhostButton>
              <GhostButton href={FACEBOOK}>Facebook</GhostButton>
            </div>
            <div className="mx-auto mt-10 grid max-w-lg gap-y-2 text-[13px] md:grid-cols-2" style={{ fontFamily: MONO, color: 'rgba(237,232,220,0.68)' }}>
              <p>Fitjar: alla daga 11:00–20:00</p>
              <p>Selfoss: virka daga 11:30–19:30, lau 11:30–19:00</p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ---- Sticky mobile CTA bar (clears the PreviewChrome corner chips) ---- */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex gap-2 border-t p-3 lg:hidden" style={{ background: 'rgba(12,15,14,0.96)', borderColor: 'rgba(237,232,220,0.14)', backdropFilter: 'blur(8px)' }}>
        <a href={PHONE_HREF} className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-bold ${FOCUS_NIGHT}`} style={{ fontFamily: BODY, background: MINT, color: INK }}>
          <Phone className="h-4 w-4" aria-hidden /> Hringja
        </a>
        <button type="button" onClick={() => scrollToId('kassinn')} className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-bold ring-1 ring-white/40 ${FOCUS_NIGHT}`} style={{ fontFamily: BODY, color: PAPER }}>
          Matseðill
        </button>
      </div>

      <PreviewFooter company={company} />
      <PreviewChrome company={company} />
    </div>
  )
}
