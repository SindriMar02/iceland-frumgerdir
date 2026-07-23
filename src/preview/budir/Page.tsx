import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  IMG, EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF, ADDRESS,
  BOOKING_URL, MAP_EMBED, MAP_LINK, NAV, HERO, RAILS, ROOMS, ROOMS_NOTE,
  RESTAURANT, SAGA, WEDDINGS, PLACE, PHOTOS, JSON_LD,
} from './data'

gsap.registerPlugin(ScrollTrigger, SplitText)

const company = getPreviewCompany('budir')

/* ── „Svarti punkturinn" — the black anchor. ────────────────────────────────
   The cream hotel and the black church are the only fixed things in a
   landscape that never repeats. System: warm bone paper, black ink bands,
   colossal ultralight Boska serif sitting ON a horizon line, a sky that
   changes colour across the whole scroll while the black type and the
   photographs stay put. Lineage: normalisboring.es (cropped ultralight
   display, italic-serif interruptions, masked SplitText reveals, vertical
   rails, disassembled lockup, tiny typographic furniture). ──────────────── */

/* Palette — computed WCAG ratios (relative luminance):
   INK  #111111 on BONE #EFEAE0 ..... 15.75:1 (AAA) — and inverted on bands
   OLIVE #8A8455 on BONE ............  3.18:1 — LARGE display text only
   OLIVE_INK #5F5A38 on BONE ........  5.83:1 (AA small) · 5.4:1 on dusk tint
   BRASS #A8802F on BONE ............  3.02:1 — decorative accents only
   BRASS on INK band ................  5.21:1 — tiny furniture on black OK
   ink @62% on bone ≈ 4.9:1 · bone @80% on ink ≈ 10.6:1 · @64% ≈ 7.1:1  */
const BONE = '#EFEAE0'
const INK = '#111111'
const OLIVE = '#8A8455'      // large display accents only (restaurant wall)
const OLIVE_INK = '#5F5A38'  // small-text-safe olive
const BRASS = '#A8802F'      // the single saturated accent — tiny uses only

const INK_SOFT = 'rgba(17,17,17,.80)'
const INK_MUTE = 'rgba(17,17,17,.62)'
const BONE_SOFT = 'rgba(239,234,224,.82)'
const BONE_MUTE = 'rgba(239,234,224,.64)'
const HAIR_INK = 'rgba(17,17,17,.16)'
const HAIR_BONE = 'rgba(239,234,224,.20)'

const GROTESK = 'var(--font-familjen)'
const SERIF = "'Boska', 'Cormorant Garamond', Georgia, serif"

const FONTS = `${import.meta.env.BASE_URL}fonts/boska/`

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A8802F]'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ── Sky scrub — one scrubbed value drives the whole world. Everything is
   derived from raw progress inside a single onUpdate (craft-ledger rule). ── */
interface SkyStop { p: number; hi: string; lo: string; ground: string }
const SKY_STOPS: SkyStop[] = [
  { p: 0.0, hi: '#F3EDDD', lo: '#EDE1C7', ground: '#EFEAE0' }, // dögun — bone
  { p: 0.36, hi: '#D7E1E6', lo: '#ECEFEB', ground: '#EAEDEA' }, // dagur — pale blue
  { p: 0.7, hi: '#E9D8AC', lo: '#F0E5C7', ground: '#F0E8D3' }, // gyllt síðdegi
  { p: 1.0, hi: '#5C6874', lo: '#9FA7AE', ground: '#E2E0DA' }, // rökkur — slate
]
function mixHex(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16)
  const pb = parseInt(b.slice(1), 16)
  const ch = (shift: number) => {
    const va = (pa >> shift) & 255
    const vb = (pb >> shift) & 255
    return Math.round(va + (vb - va) * t)
  }
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`
}
function skyAt(p: number): { hi: string; lo: string; ground: string } {
  const clamped = Math.min(1, Math.max(0, p))
  let i = 0
  while (i < SKY_STOPS.length - 2 && clamped > SKY_STOPS[i + 1].p) i += 1
  const a = SKY_STOPS[i]
  const b = SKY_STOPS[i + 1]
  const t = (clamped - a.p) / (b.p - a.p)
  return { hi: mixHex(a.hi, b.hi, t), lo: mixHex(a.lo, b.lo, t), ground: mixHex(a.ground, b.ground, t) }
}

/* ── Page-local styles: Boska @font-face, bu- keyframes, media-gated rooms
   rail, reduced-motion neutralisation. Nothing leaks outside bu-. ────────── */
const PAGE_STYLES = `
@font-face {
  font-family: 'Boska';
  src: url('${FONTS}Boska-Extralight.woff2') format('woff2');
  font-weight: 200; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Boska';
  src: url('${FONTS}Boska-ExtralightItalic.woff2') format('woff2');
  font-weight: 200; font-style: italic; font-display: swap;
}
@font-face {
  font-family: 'Boska';
  src: url('${FONTS}Boska-Light.woff2') format('woff2');
  font-weight: 300; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Boska';
  src: url('${FONTS}Boska-LightItalic.woff2') format('woff2');
  font-weight: 300; font-style: italic; font-display: swap;
}

.bu-root {
  --bu-sky-hi: ${SKY_STOPS[0].hi};
  --bu-sky-lo: ${SKY_STOPS[0].lo};
  --bu-ground: ${SKY_STOPS[0].ground};
}
.bu-root ::selection { background: ${INK}; color: ${BONE}; }

/* Boska Extralight metrics (upm 1000, asc 960, desc 250, cap 715, Ú accent
   715–925). Chars get line-height 1.21 (= (asc+desc)/upm) so each
   inline-block's background box starts exactly at the ascender — then on the
   hero Ú the zone above 19.6% of that box is the acute accent only, and
   painting it brass via background-clip touches no cap stroke. */
.bu-hero-char, .bu-pre-char { display: inline-block; line-height: 1.21; will-change: transform; }
.bu-u-accent {
  background: linear-gradient(180deg, ${BRASS} 0 19.6%, ${INK} 19.6%);
  background-repeat: no-repeat;
  -webkit-background-clip: text; background-clip: text;
  color: transparent;
}

/* The hero mask: clipped at the HORIZON (wrapper), never per-line — accents
   get 0.24em of headroom, the baseline is pulled to the mask's bottom edge
   (descent = 0.25em below it) so the caps stand exactly on the line. */
.bu-hero-mask { overflow: hidden; padding-top: 0.24em; }
.bu-hero-word { line-height: 1; margin-bottom: -0.25em; }

.bu-pre-mask { overflow: hidden; padding-top: 0.24em; }

.bu-vert { writing-mode: vertical-rl; transform: rotate(180deg); }

.bu-photo .bu-photo-img {
  filter: saturate(.84);
  transform: scale(1.001);
  transition: filter .6s ease, transform 1.1s cubic-bezier(.22,1,.36,1);
}
.bu-photo:hover .bu-photo-img { filter: saturate(1); transform: scale(1.02); }

.bu-ul {
  text-decoration: underline;
  text-decoration-color: rgba(168,128,47,.45);
  text-decoration-thickness: 1px;
  text-underline-offset: 5px;
  transition: text-decoration-color .25s ease;
}
.bu-ul:hover { text-decoration-color: ${BRASS}; }

.bu-cta {
  transition: letter-spacing .35s ease, background-color .3s ease;
}
.bu-cta:hover { letter-spacing: .24em; }

/* Rooms rail — horizontal layout exists ONLY where the pin runs (desktop +
   motion-ok). Everywhere else it is a plain vertical stack. */
.bu-rooms-track { display: grid; gap: 4.5rem; padding: 3.5rem clamp(1.25rem, 5vw, 4rem) 5.5rem; }
.bu-rooms-intro { max-width: 34rem; }
@media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
  .bu-rooms-viewport { height: 100svh; display: flex; align-items: center; overflow: hidden; }
  .bu-rooms-track {
    display: flex; align-items: center; flex-wrap: nowrap;
    gap: 6vw; padding: 0 10vw 0 6vw; width: max-content;
  }
  .bu-rooms-intro { width: 30vw; max-width: none; flex: none; }
  .bu-slab { width: clamp(340px, 26vw, 480px); flex: none; }
}

@keyframes bu-menu-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes bu-menu-link { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: none; } }
.bu-menu-panel { animation: bu-menu-in .3s ease both; }
.bu-menu-link { animation: bu-menu-link .55s cubic-bezier(.22,1,.36,1) both; }

@media (prefers-reduced-motion: reduce) {
  .bu-menu-panel, .bu-menu-link { animation: none !important; opacity: 1 !important; transform: none !important; }
  .bu-photo .bu-photo-img { transition: none !important; filter: none !important; transform: none !important; }
  .bu-cta { transition: none !important; }
}
`

/* ═══════════════ Photo — the fixed things; they never animate ════════════ */
function Photo({
  src, alt, spec, aspect = 'aspect-[4/3]', className = '', position = 'center',
  priority = false, tone = 'light',
}: {
  src: string; alt: string; spec?: string; aspect?: string; className?: string
  position?: string; priority?: boolean; tone?: 'light' | 'dark'
}) {
  const [failed, setFailed] = useState(false)
  return (
    <figure className={`bu-photo relative m-0 ${className}`}>
      <div className={`relative overflow-hidden ${aspect}`}>
        {failed ? (
          <div className="absolute inset-0" style={{ background: '#DCD5C4' }} role="img" aria-label={alt} />
        ) : (
          <img
            src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async"
            {...(priority ? { fetchpriority: 'high' as const } : {})}
            onError={() => setFailed(true)}
            className="bu-photo-img absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: position }}
          />
        )}
      </div>
      {spec ? (
        <figcaption
          className="mt-0 flex items-baseline justify-between gap-4 border-t pt-2.5 text-[10.5px] uppercase tracking-[0.18em]"
          style={{
            fontFamily: GROTESK,
            borderColor: tone === 'light' ? HAIR_INK : HAIR_BONE,
            color: tone === 'light' ? INK_MUTE : BONE_MUTE,
          }}>
          <span>{spec}</span>
        </figcaption>
      ) : null}
    </figure>
  )
}

/* ═══════════════ Section head — the horizon rule persists ════════════════ */
function SectionHead({ index, label, tone = 'light' }: {
  index: string; label: string; tone?: 'light' | 'dark'
}) {
  return (
    <div>
      <div className="bu-rule-draw h-px w-full origin-left"
        style={{ background: tone === 'light' ? INK : BONE, opacity: tone === 'light' ? 0.55 : 0.4 }} />
      <div className="flex items-baseline justify-between pt-3 text-[11px] font-medium uppercase tracking-[0.24em]"
        style={{ fontFamily: GROTESK, color: tone === 'light' ? INK_MUTE : BONE_MUTE }}>
        <span>{label}</span>
        <span aria-hidden style={{ color: tone === 'light' ? OLIVE_INK : BONE_MUTE }}>({index})</span>
      </div>
    </div>
  )
}

/* ═══════════════ Header + full-screen bone menu ══════════════════════════ */
function TopNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduced = prefersReduced()

  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
    }, 40)
  }
  const solid = scrolled || open

  return (
    <>
      <nav aria-label="Aðalvalmynd" className="fixed inset-x-0 top-0 z-40"
        style={{
          background: solid ? 'rgba(239,234,224,.94)' : 'transparent',
          borderBottom: `1px solid ${solid ? HAIR_INK : 'transparent'}`,
          backdropFilter: solid ? 'blur(8px)' : undefined,
          WebkitBackdropFilter: solid ? 'blur(8px)' : undefined,
          transition: 'background .35s ease, border-color .35s ease',
        }}>
        <div className="flex items-center justify-between px-5 py-4 md:px-8">
          <button type="button"
            onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }) }}
            className={`min-h-[44px] text-[12px] font-semibold uppercase tracking-[0.32em] ${FOCUS}`}
            style={{ fontFamily: GROTESK, color: INK }}>
            Hótel Búðir
          </button>
          <div className="hidden items-center gap-8 lg:flex">
            {NAV.map((n) => (
              <button key={n.id} type="button" onClick={() => go(n.id)}
                className={`min-h-[44px] text-[12px] font-medium uppercase tracking-[0.18em] transition-opacity hover:opacity-60 ${FOCUS}`}
                style={{ fontFamily: GROTESK, color: INK }}>
                {n.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-5">
            <a href={PHONE_HREF}
              className={`hidden min-h-[44px] items-center text-[12px] tracking-[0.06em] sm:flex ${FOCUS}`}
              style={{ fontFamily: GROTESK, color: INK_SOFT }}>
              {PHONE_DISPLAY}
            </a>
            <a href={BOOKING_URL} target="_blank" rel="noreferrer"
              className={`bu-ul flex min-h-[44px] items-center text-[13px] font-medium tracking-[0.04em] ${FOCUS}`}
              style={{ fontFamily: GROTESK, color: INK }}>
              (Bóka)
            </a>
            <button type="button" aria-label={open ? 'Loka valmynd' : 'Opna valmynd'}
              aria-expanded={open} aria-controls="bu-menu"
              onClick={() => setOpen((v) => !v)}
              className={`relative flex h-11 w-11 items-center justify-center lg:hidden ${FOCUS}`}>
              <span aria-hidden className="absolute block h-px w-6"
                style={{
                  background: INK,
                  transform: open ? 'rotate(45deg)' : 'translateY(-4px)',
                  transition: reduced ? 'none' : 'transform .32s cubic-bezier(.22,1,.36,1)',
                }} />
              <span aria-hidden className="absolute block h-px w-6"
                style={{
                  background: INK,
                  transform: open ? 'rotate(-45deg)' : 'translateY(4px)',
                  transition: reduced ? 'none' : 'transform .32s cubic-bezier(.22,1,.36,1)',
                }} />
            </button>
          </div>
        </div>
      </nav>
      {/* Sibling of nav — the nav's backdrop-filter must never become this
          overlay's containing block (craft-ledger gotcha). */}
      {open ? (
        <div id="bu-menu" role="dialog" aria-modal="true" aria-label="Valmynd"
          className="bu-menu-panel fixed inset-0 z-30 flex flex-col justify-between px-6 pb-10 pt-28 lg:hidden"
          style={{ background: BONE }}>
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {NAV.map((n, i) => (
              <li key={n.id} className="bu-menu-link" style={{ animationDelay: `${90 + i * 60}ms` }}>
                <button type="button" onClick={() => go(n.id)}
                  className={`min-h-[48px] text-left text-[2.3rem] font-light ${FOCUS}`}
                  style={{ fontFamily: SERIF, fontWeight: 300, color: INK, lineHeight: 1.15 }}>
                  {n.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="bu-menu-link flex flex-wrap items-center gap-x-8 gap-y-3"
            style={{ animationDelay: `${90 + NAV.length * 60}ms` }}>
            <a href={BOOKING_URL} target="_blank" rel="noreferrer"
              className={`bu-ul flex min-h-[44px] items-center text-[14px] font-medium tracking-[0.04em] ${FOCUS}`}
              style={{ fontFamily: GROTESK, color: INK }}>
              (Bóka herbergi)
            </a>
            <a href={PHONE_HREF}
              className={`flex min-h-[44px] items-center text-[13px] tracking-[0.06em] ${FOCUS}`}
              style={{ fontFamily: GROTESK, color: INK_SOFT }}>
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      ) : null}
    </>
  )
}

/* ═══════════════ HERO — the word stands on the horizon ═══════════════════ */
function Hero() {
  const heroChars = HERO.word.split('')
  return (
    <header className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Sky — driven by the page-wide scrub via CSS custom properties. */}
      <div className="relative" style={{
        height: '62svh',
        background: 'linear-gradient(180deg, var(--bu-sky-hi) 0%, var(--bu-sky-lo) 100%)',
      }}>
        <p className="bu-hero-fade absolute left-5 top-20 m-0 text-[11px] font-medium uppercase tracking-[0.26em] md:left-8"
          style={{ fontFamily: GROTESK, color: INK_SOFT }}>
          {HERO.eyebrow}
        </p>
        <div className="absolute inset-x-0 bottom-0">
          <p className="bu-hero-fade m-0 pb-2 text-center text-[12px] font-medium uppercase tracking-[0.5em]"
            style={{ fontFamily: GROTESK, color: INK_SOFT }} aria-hidden>
            {HERO.wordPrefix}
          </p>
          <div className="bu-hero-mask">
            <h1 aria-label={`${HERO.wordPrefix} ${HERO.word}`}
              className="bu-hero-word m-0 whitespace-nowrap text-center font-extralight"
              style={{
                fontFamily: SERIF, fontWeight: 200, color: INK,
                fontSize: 'min(38vw, 50svh)', letterSpacing: '-0.02em',
              }}>
              {heroChars.map((ch, i) => (
                <span key={`${ch}-${i}`} aria-hidden
                  className={`bu-hero-char${ch === 'Ú' ? ' bu-u-accent' : ''}`}>
                  {ch}
                </span>
              ))}
            </h1>
          </div>
        </div>
      </div>

      {/* THE horizon. Full-strength ink, 1px. */}
      <div aria-hidden className="h-px w-full" style={{ background: INK }} />

      {/* Below sea level: the real place, quiet. Band ≤ 45vh (1080px source). */}
      <div className="relative flex-1" style={{ minHeight: '38svh', background: INK }}>
        <img src={IMG(PHOTOS.heroWater.file)} alt={HERO.photoAlt}
          loading="eager" decoding="async" {...{ fetchpriority: 'high' as const }}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: 'center 55%', filter: 'saturate(.9)' }} />
        <div className="bu-hero-fade absolute left-0 top-0 max-w-[34rem] p-5 md:left-8 md:max-w-[30rem] md:p-7"
          style={{ background: BONE }}>
          <p className="m-0 text-[14px] leading-[1.7] md:text-[15px]"
            style={{ fontFamily: GROTESK, color: INK_SOFT }}>
            {HERO.sub}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href={BOOKING_URL} target="_blank" rel="noreferrer"
              className={`bu-cta inline-flex min-h-[48px] items-center px-6 text-[12px] font-semibold uppercase tracking-[0.2em] ${FOCUS}`}
              style={{ fontFamily: GROTESK, background: INK, color: BONE }}>
              {HERO.cta}
            </a>
            <a href={PHONE_HREF}
              className={`bu-ul inline-flex min-h-[44px] items-center text-[13px] tracking-[0.06em] ${FOCUS}`}
              style={{ fontFamily: GROTESK, color: INK }}>
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
        <p className="bu-hero-fade absolute bottom-3 right-4 m-0 hidden px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] md:block"
          style={{ fontFamily: GROTESK, background: 'rgba(239,234,224,.9)', color: INK_SOFT }}>
          Hótelið og svarta kirkjan við ósinn
        </p>
      </div>
    </header>
  )
}

/* ═══════════════ RAILS — their three phrases, colossal ═══════════════════
   Grotesque caps interrupted mid-line by the italic serif noun — the
   reference's signature type move, carried by their own homepage copy. */
function Rails() {
  return (
    <section aria-label="Búðir" className="relative flex min-h-[92svh] flex-col"
      style={{ background: 'var(--bu-ground)' }}>
      <div className="px-5 pt-14 md:px-8">
        <SectionHead index="01" label={HERO.word} />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-6 px-5 py-20 md:gap-8 md:px-8">
        {RAILS.map((phrase, i) => {
          const [first, ...rest] = phrase.split(' ')
          return (
            <div key={phrase} className="bu-mask overflow-hidden"
              style={{ paddingLeft: `${i * 7}%` }}>
              <p className="bu-mrise m-0 whitespace-nowrap"
                style={{ lineHeight: 1.14, fontSize: 'clamp(1.9rem, 6.6vw, 5.6rem)' }}>
                <span className="font-semibold uppercase"
                  style={{ fontFamily: GROTESK, letterSpacing: '-0.01em', color: INK }}>
                  {first}
                </span>{' '}
                <em style={{ fontFamily: SERIF, fontWeight: 300, fontStyle: 'italic', color: OLIVE }}>
                  {rest.join(' ')}
                </em>
                <span aria-hidden className="ml-4 hidden align-super text-[11px] font-medium tracking-[0.2em] sm:inline"
                  style={{ fontFamily: GROTESK, color: INK_MUTE }}>
                  (0{i + 1})
                </span>
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ═══════════════ HERBERGI — horizontal scrub past the four categories ════ */
function Rooms() {
  return (
    <section id="herbergi" className="bu-rooms scroll-mt-16" style={{ background: 'var(--bu-ground)' }}>
      <div className="px-5 pt-14 md:px-8 lg:hidden">
        <SectionHead index="02" label={NAV[0].label} />
      </div>
      <div className="bu-rooms-viewport">
        <div className="bu-rooms-track">
          <div className="bu-rooms-intro flex items-stretch gap-6">
            <span aria-hidden className="bu-vert hidden text-[11px] font-medium uppercase tracking-[0.3em] lg:block"
              style={{ fontFamily: GROTESK, color: INK_MUTE }}>
              {NAV[0].label} · (02)
            </span>
            <div>
              <h2 className="bu-chars m-0"
                style={{
                  fontFamily: SERIF, fontWeight: 200, color: INK,
                  fontSize: 'clamp(3.4rem, 8.5vw, 7.5rem)', lineHeight: 1.08,
                }}>
                {NAV[0].label}
              </h2>
              <p className="bu-lines mt-6 max-w-[24rem] text-[14.5px] leading-[1.7]"
                style={{ fontFamily: GROTESK, color: INK_SOFT }}>
                {ROOMS_NOTE}
              </p>
              <a href={BOOKING_URL} target="_blank" rel="noreferrer"
                className={`bu-ul mt-4 inline-flex min-h-[44px] items-center text-[13px] font-medium tracking-[0.04em] ${FOCUS}`}
                style={{ fontFamily: GROTESK, color: INK }}>
                (Bóka)
              </a>
            </div>
          </div>
          {ROOMS.map((room, i) => (
            <article key={room.key} className="bu-slab">
              <Photo src={IMG(room.img)} alt={room.alt} aspect="aspect-[4/5]"
                spec={`${room.wing} · 0${i + 1}`} />
              <h3 className="mb-0 mt-4"
                style={{
                  fontFamily: SERIF, fontWeight: 300, color: INK,
                  fontSize: 'clamp(1.7rem, 2.6vw, 2.3rem)', lineHeight: 1.12,
                }}>
                {room.name}
              </h3>
              <p className="mt-3 text-[14px] leading-[1.7]"
                style={{ fontFamily: GROTESK, color: INK_SOFT }}>
                {room.body}
              </p>
              <a href={BOOKING_URL} target="_blank" rel="noreferrer"
                className={`bu-ul mt-3 inline-flex min-h-[44px] items-center text-[12px] font-medium uppercase tracking-[0.18em] ${FOCUS}`}
                style={{ fontFamily: GROTESK, color: INK }}>
                Bóka
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ VEITINGASTAÐURINN — the black band ══════════════════════ */
function Restaurant() {
  /* The italic-serif interruption, built strictly from their own sentence. */
  const [barBefore, barAfter] = RESTAURANT.barLine.split('stórbrotnu útsýni')
  return (
    <section id="veitingar" className="scroll-mt-16" style={{ background: INK }}>
      <div className="px-5 pb-20 pt-14 md:px-8 md:pb-28">
        <SectionHead index="03" label={NAV[1].label} tone="dark" />
        <h2 className="bu-chars mb-0 mt-10"
          style={{
            fontFamily: SERIF, fontWeight: 200, color: BONE,
            fontSize: 'clamp(2.7rem, 8.5vw, 7.5rem)', lineHeight: 1.06,
            marginLeft: '-0.04em',
          }}>
          {RESTAURANT.title}
        </h2>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <p className="bu-lines m-0 max-w-[36rem] text-[15.5px] leading-[1.8]"
              style={{ fontFamily: GROTESK, color: BONE_SOFT }}>
              {RESTAURANT.body}
            </p>
            <p className="bu-lines mb-0 mt-10 max-w-[40rem]"
              style={{ lineHeight: 1.24, fontSize: 'clamp(1.5rem, 3.6vw, 2.9rem)' }}>
              <span className="font-semibold uppercase"
                style={{ fontFamily: GROTESK, letterSpacing: '-0.005em', color: BONE }}>
                {barBefore}
              </span>
              <em style={{ fontFamily: SERIF, fontWeight: 300, fontStyle: 'italic', color: BONE }}>
                stórbrotnu útsýni
              </em>
              <span className="font-semibold uppercase"
                style={{ fontFamily: GROTESK, letterSpacing: '-0.005em', color: BONE }}>
                {barAfter}
              </span>
            </p>
          </div>
          <div>
            <dl className="m-0">
              {RESTAURANT.hours.map((h) => (
                <div key={h.label}
                  className="flex items-baseline justify-between gap-6 border-b py-4"
                  style={{ borderColor: HAIR_BONE }}>
                  <dt className="text-[12px] font-medium uppercase tracking-[0.2em]"
                    style={{ fontFamily: GROTESK, color: BONE_MUTE }}>
                    {h.label}
                  </dt>
                  <dd className="m-0 text-right text-[13.5px] tracking-[0.03em]"
                    style={{ fontFamily: GROTESK, color: BONE_SOFT }}>
                    {h.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          <Photo src={IMG(PHOTOS.plateFish.file)} alt={PHOTOS.plateFish.alt}
            aspect="aspect-[4/5]" spec="Fiskréttur á steindiski" tone="dark" />
          <Photo src={IMG(PHOTOS.barTeal.file)} alt={PHOTOS.barTeal.alt}
            aspect="aspect-[4/5]" spec="Barinn" tone="dark" className="lg:mt-14" />
          <Photo src={IMG(PHOTOS.breakfast.file)} alt={PHOTOS.breakfast.alt}
            aspect="aspect-[4/5]" spec={RESTAURANT.hours[0].label} tone="dark"
            className="sm:col-span-2 sm:mx-auto sm:w-2/3 lg:col-span-1 lg:mx-0 lg:w-auto" />
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ SAGAN — eras bleeding off the left edge ═════════════════ */
function Saga() {
  const sagaPhotos = [PHOTOS.churchHill, null, PHOTOS.snow] as const
  return (
    <section id="sagan" className="scroll-mt-16 overflow-hidden"
      style={{ background: 'var(--bu-ground)' }}>
      <div className="px-5 pt-14 md:px-8">
        <SectionHead index="04" label={NAV[2].label} />
        <div className="flex items-end justify-between gap-8">
          <h2 className="bu-lines mb-0 mt-10 max-w-[30rem]"
            style={{
              fontFamily: SERIF, fontWeight: 300, color: INK,
              fontSize: 'clamp(1.9rem, 4vw, 3.2rem)', lineHeight: 1.15,
            }}>
            {SAGA.title}
          </h2>
          <span aria-hidden className="bu-vert hidden pb-2 text-[11px] font-medium uppercase tracking-[0.3em] lg:block"
            style={{ fontFamily: GROTESK, color: INK_MUTE }}>
            {NAV[2].label} · Búðir
          </span>
        </div>
      </div>

      <div className="pb-24 pt-6 md:pb-32">
        {SAGA.steps.map((step, i) => {
          const photo = sagaPhotos[i]
          return (
            <div key={step.era} className="mt-16 md:mt-24">
              <div className="grid items-end gap-x-10 gap-y-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
                <div aria-label={step.era} role="heading" aria-level={3}
                  className="bu-chars whitespace-nowrap"
                  style={{
                    fontFamily: SERIF, fontWeight: 200, color: INK,
                    fontSize: 'clamp(5rem, 16vw, 13rem)', lineHeight: 0.95,
                    marginLeft: 'max(-6vw, -4rem)',
                  }}>
                  {step.era}
                </div>
                <p className="bu-lines m-0 max-w-[30rem] px-5 pb-3 text-[15px] leading-[1.8] md:px-0 md:pr-8"
                  style={{ fontFamily: GROTESK, color: INK_SOFT }}>
                  {step.text}
                </p>
              </div>
              {photo ? (
                <div className={`mt-12 px-5 md:px-8 ${i === 0 ? 'md:ml-[38%]' : 'md:mr-[42%]'}`}>
                  <Photo src={IMG(photo.file)} alt={photo.alt} aspect="aspect-[16/10]"
                    spec={photo.alt} className="max-w-[560px]" />
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ═══════════════ BRÚÐKAUP — quiet ════════════════════════════════════════ */
function Weddings() {
  return (
    <section id="brudkaup" className="scroll-mt-16" style={{ background: 'var(--bu-ground)' }}>
      <div className="px-5 pb-24 pt-14 md:px-8 md:pb-32">
        <SectionHead index="05" label={NAV[3].label} />
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div className="max-w-[26rem]">
            <h2 className="bu-chars m-0"
              style={{
                fontFamily: SERIF, fontWeight: 200, color: INK,
                fontSize: 'clamp(2.4rem, 5.5vw, 4.6rem)', lineHeight: 1.08,
              }}>
              {WEDDINGS.title}
            </h2>
            <p className="bu-lines mb-0 mt-7 text-[15px] leading-[1.8]"
              style={{ fontFamily: GROTESK, color: INK_SOFT }}>
              {WEDDINGS.body}
            </p>
            <a href={EMAIL_HREF}
              className={`bu-cta mt-8 inline-flex min-h-[48px] items-center px-6 text-[12px] font-semibold uppercase tracking-[0.2em] ${FOCUS}`}
              style={{ fontFamily: GROTESK, background: INK, color: BONE }}>
              {WEDDINGS.cta}
            </a>
          </div>
          <div className="grid gap-10 sm:grid-cols-[1.15fr_1fr] sm:items-start">
            <Photo src={IMG(PHOTOS.eventHall.file)} alt={PHOTOS.eventHall.alt}
              aspect="aspect-[4/5]" spec="Veislusalurinn" />
            <Photo src={IMG(PHOTOS.churchGrass.file)} alt={PHOTOS.churchGrass.alt}
              aspect="aspect-[4/5]" spec="Svarta kirkjan" className="sm:mt-20" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ STAÐURINN — the landscape, captioned honestly ═══════════ */
function Place() {
  const slabs = [PHOTOS.coast, PHOTOS.aerial, PHOTOS.beach] as const
  return (
    <section id="stadurinn" className="scroll-mt-16" style={{ background: 'var(--bu-ground)' }}>
      <div className="px-5 pb-24 pt-14 md:px-8 md:pb-32">
        <SectionHead index="06" label={NAV[4].label} />
        <div className="mt-12 grid gap-8 md:grid-cols-2 md:items-end">
          <h2 className="bu-chars m-0"
            style={{
              fontFamily: SERIF, fontWeight: 200, color: INK,
              fontSize: 'clamp(2.6rem, 6.5vw, 5.5rem)', lineHeight: 1.05,
            }}>
            {PLACE.title}
          </h2>
          <p className="bu-lines m-0 max-w-[26rem] text-[15px] leading-[1.8] md:justify-self-end"
            style={{ fontFamily: GROTESK, color: INK_SOFT }}>
            {PLACE.body}
          </p>
        </div>
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {slabs.map((ph, i) => (
            <Photo key={ph.file} src={IMG(ph.file)} alt={ph.alt} aspect="aspect-[4/5]"
              spec={ph.alt} className={i === 1 ? 'lg:mt-14' : i === 2 ? 'sm:col-span-2 sm:mx-auto sm:w-2/3 lg:col-span-1 lg:mx-0 lg:mt-28 lg:w-auto' : ''} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ FOOTER — night; the lockup disassembled ═════════════════ */
function FooterBlack() {
  return (
    <footer className="relative overflow-hidden" style={{ background: INK }}>
      <div className="flex items-baseline justify-between px-5 pt-10 md:px-8">
        <span className="text-[12px] font-semibold uppercase tracking-[0.32em]"
          style={{ fontFamily: GROTESK, color: BONE }}>
          Hótel
        </span>
        <a href={BOOKING_URL} target="_blank" rel="noreferrer"
          className={`bu-ul inline-flex min-h-[44px] items-center text-[13px] font-medium tracking-[0.04em] ${FOCUS}`}
          style={{ fontFamily: GROTESK, color: BONE }}>
          (Bóka)
        </a>
      </div>

      <div className="mt-14 grid gap-12 px-5 md:grid-cols-[1.2fr_1fr] md:gap-20 md:px-8">
        <dl className="m-0 max-w-[30rem]">
          {[
            { label: 'Netfang', value: EMAIL, href: EMAIL_HREF },
            { label: 'Sími', value: PHONE_DISPLAY, href: PHONE_HREF },
            { label: 'Heimilisfang', value: ADDRESS, href: MAP_LINK },
          ].map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-6 border-b py-4"
              style={{ borderColor: HAIR_BONE }}>
              <dt className="text-[11px] font-medium uppercase tracking-[0.22em]"
                style={{ fontFamily: GROTESK, color: BONE_MUTE }}>
                {row.label}
              </dt>
              <dd className="m-0 text-right">
                <a href={row.href}
                  {...(row.href === MAP_LINK ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className={`bu-ul inline-flex min-h-[44px] items-center text-[14px] tracking-[0.02em] ${FOCUS}`}
                  style={{ fontFamily: GROTESK, color: BONE_SOFT }}>
                  {row.value}
                </a>
              </dd>
            </div>
          ))}
          <div className="pt-5">
            <a href={MAP_LINK} target="_blank" rel="noreferrer"
              className={`bu-ul inline-flex min-h-[44px] items-center text-[12px] font-medium uppercase tracking-[0.18em] ${FOCUS}`}
              style={{ fontFamily: GROTESK, color: BONE_MUTE }}>
              Opna í Google kortum
            </a>
          </div>
        </dl>
        <div>
          <div className="overflow-hidden" style={{ border: `1px solid ${HAIR_BONE}` }}>
            <iframe title={`Kort af Hótel Búðum, ${ADDRESS}`} src={MAP_EMBED}
              loading="eager" referrerPolicy="no-referrer-when-downgrade"
              className="h-[260px] w-full border-0"
              style={{ filter: 'grayscale(1) contrast(0.96)' }} />
          </div>
        </div>
      </div>

      {/* The reference's colossal cropped sign-off, sunk below the fold edge;
          the lockup's other half anchors the opposite corner. */}
      <div className="relative mt-16">
        <span className="absolute bottom-6 right-5 z-10 text-[12px] font-semibold uppercase tracking-[0.32em] md:right-8"
          style={{ fontFamily: GROTESK, color: BONE }}>
          Búðir
        </span>
        <p aria-hidden className="m-0 select-none whitespace-nowrap pl-2 font-extralight"
          style={{
            fontFamily: SERIF, fontWeight: 200, color: BONE,
            fontSize: 'min(17vw, 15rem)', lineHeight: 0.9,
            transform: 'translateY(0.22em)',
          }}>
          Við sjáumst
        </p>
      </div>
    </footer>
  )
}

/* ═══════════════ PAGE ════════════════════════════════════════════════════ */
export default function Page() {
  const rootRef = useRef<HTMLDivElement>(null)
  const preRef = useRef<HTMLDivElement>(null)

  /* Preloader: first visit only, never under reduced motion. */
  const [pre, setPre] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    if (prefersReduced()) return false
    try { return window.localStorage.getItem('bu_seen') !== '1' } catch { return false }
  })
  const preShownRef = useRef(pre)

  useEffect(() => {
    document.title = 'Hótel Búðir · Sveitahótel á Snæfellsnesi'
    setThemeColor(BONE)
    const s = document.createElement('script')
    s.type = 'application/ld+json'
    s.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(s)
    return () => { s.remove() }
  }, [])

  /* Preloader timeline — ≤1.6s: chars rise from the masked baseline, the
     thin rule draws, the bone sheet releases upward. */
  useEffect(() => {
    try { window.localStorage.setItem('bu_seen', '1') } catch { /* private mode */ }
    if (!pre) return
    const el = preRef.current
    if (!el) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const chars = el.querySelectorAll('.bu-pre-char')
    const rule = el.querySelector('.bu-pre-rule')
    const tl = gsap.timeline({
      onComplete: () => {
        setPre(false)
        ScrollTrigger.refresh()
      },
    })
    tl.fromTo(chars, { yPercent: 115 }, { yPercent: 0, duration: 0.75, ease: 'power4.out', stagger: 0.05 }, 0)
      .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, 0.2)
      .to(el, { yPercent: -100, duration: 0.55, ease: 'power3.inOut' }, 1.05)
    return () => {
      document.body.style.overflow = prevOverflow
      tl.kill()
    }
  }, [pre])

  /* All scroll choreography. Reduced motion: the matchMedia branch returns
     before a single tween is created — every element's resting CSS state is
     fully visible, no pin, no scrub, no preloader. */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const mm = gsap.matchMedia()
    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        desktop: '(min-width: 1024px)',
      },
      (mctx) => {
        const c = mctx.conditions as { motion: boolean; desktop: boolean }
        if (!c.motion) return undefined
        const q = gsap.utils.selector(root)
        const splits: SplitText[] = []

        /* 1 — The sky scrub: one ScrollTrigger over the whole page; every
           colour (hero sky pair + the page ground tint) is derived from the
           raw progress value inside this single callback. */
        const applySky = (p: number) => {
          const s = skyAt(p)
          root.style.setProperty('--bu-sky-hi', s.hi)
          root.style.setProperty('--bu-sky-lo', s.lo)
          root.style.setProperty('--bu-ground', s.ground)
        }
        applySky(0)
        ScrollTrigger.create({
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.4,
          onUpdate: (self) => applySky(self.progress),
        })

        /* 2 — Hero: BÚÐIR rises from below the horizon, masked at the
           horizon wrapper (never per-line — Icelandic accents keep their
           0.24em headroom inside the mask). */
        const introDelay = preShownRef.current ? 1.35 : 0.2
        gsap.fromTo(q('.bu-hero-char'), { yPercent: 118 }, {
          yPercent: 0, duration: 1.3, ease: 'power3.out', stagger: 0.07, delay: introDelay,
        })
        gsap.from(q('.bu-hero-fade'), {
          opacity: 0, y: 22, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: introDelay + 0.5,
        })

        /* 3 — Rails + hand-masked statements: play on enter, reverse on
           leave-back (the reference's toggle behaviour). */
        q('.bu-mrise').forEach((el) => {
          gsap.from(el, {
            yPercent: 112, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
          })
        })

        /* 4 — Horizon rules draw in. */
        q('.bu-rule-draw').forEach((el) => {
          gsap.from(el, {
            scaleX: 0, duration: 1.1, ease: 'power2.inOut',
            scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none reverse' },
          })
        })

        /* 5 — SplitText reveals. autoSplit re-splits when Boska finishes
           loading; onSplit returns the tween so it is rebuilt cleanly.
           Line masks carry leading ≥1.15 wherever accents occur. */
        q('.bu-lines').forEach((el) => {
          splits.push(SplitText.create(el, {
            type: 'lines', mask: 'lines', autoSplit: true,
            onSplit: (self) => gsap.from(self.lines, {
              yPercent: 112, duration: 0.9, ease: 'power3.out', stagger: 0.09,
              scrollTrigger: { trigger: el, start: 'top 87%', toggleActions: 'play none none reverse' },
            }),
          }))
        })
        q('.bu-chars').forEach((el) => {
          splits.push(SplitText.create(el, {
            type: 'chars', mask: 'chars', autoSplit: true,
            onSplit: (self) => gsap.from(self.chars, {
              yPercent: 110, duration: 0.8, ease: 'power3.out', stagger: 0.035,
              scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none reverse' },
            }),
          }))
        })

        /* 6 — The rooms rail: pinned horizontal scrub, desktop only. The
           horizontal layout itself only exists under the same media gate
           (page CSS), so mobile and reduced-motion get a plain stack. */
        if (c.desktop) {
          const track = q('.bu-rooms-track')[0] as HTMLElement | undefined
          const viewport = q('.bu-rooms-viewport')[0] as HTMLElement | undefined
          if (track && viewport) {
            const dist = () => Math.max(0, track.scrollWidth - window.innerWidth)
            gsap.to(track, {
              x: () => -dist(),
              ease: 'none',
              scrollTrigger: {
                trigger: viewport,
                start: 'top top',
                end: () => `+=${Math.round(dist() * 1.35)}`,
                pin: true,
                scrub: 0.5,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            })
          }
        }

        return () => { splits.forEach((sp) => sp.revert()) }
      },
    )
    return () => { mm.revert() }
  }, [])

  return (
    <div ref={rootRef} lang="is" className="bu-root antialiased"
      style={{ background: 'var(--bu-ground)', overflowX: 'clip' }}>
      <style>{PAGE_STYLES}</style>

      {pre ? (
        <div ref={preRef} aria-hidden
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center"
          style={{ background: BONE }}>
          <div className="bu-pre-mask">
            <p className="m-0 whitespace-nowrap"
              style={{
                fontFamily: SERIF, fontWeight: 200, color: INK,
                fontSize: 'min(17vw, 7.5rem)', lineHeight: 1, letterSpacing: '-0.02em',
              }}>
              {HERO.word.split('').map((ch, i) => (
                <span key={`${ch}-${i}`} className={`bu-pre-char${ch === 'Ú' ? ' bu-u-accent' : ''}`}>
                  {ch}
                </span>
              ))}
            </p>
          </div>
          <span className="bu-pre-rule mt-5 block h-px w-40 origin-left" style={{ background: INK }} />
        </div>
      ) : null}

      <TopNav />
      <main>
        <Hero />
        <Rails />
        <Rooms />
        <Restaurant />
        <Saga />
        <Weddings />
        <Place />
      </main>
      <FooterBlack />
      <PreviewChrome company={company} />
      <PreviewFooter company={company} />
    </div>
  )
}
