/**
 * Kirkjubær II Camping — full bilingual site (6 views) rebuilt from the
 * "Kirkjubær II Camping" design handoff from Claude design.
 *
 * The handoff's DC-runtime prototype (x-dc / hash routing / renderVals) is
 * reproduced here in React with the project's conventions:
 *   - inline styles for layout + one scoped <style> block for hover/focus/keyframes
 *   - self-contained view switching via internal state (no hash/router clash with
 *     the app's react-router) — nav, language toggle (EN/IS) and mobile menu
 *   - fixed header: transparent over the home hero, solid/blurred after 40px or
 *     on any interior page; nav colour flips via the --nav CSS variable
 *   - hero parallax (framer useScroll) + a slow ken-burns drift + a film-grain
 *     veil that gives the soft 1024px source photo an intentional editorial feel
 *   - IntersectionObserver scroll reveals, re-armed on every view change
 *   - live "open / closed for the season" status from the current date
 *
 * Audit improvements over the raw handoff (all within its visual language):
 *   - contrast-safe label/clay tokens (WCAG AA on small text)
 *   - visible :focus-visible rings for keyboard users
 *   - facility pictograms seated on white chips so the official Nordic signage
 *     reads as deliberate, not clip-art on a white box
 *   - the season dot follows status colour (green open / clay closed)
 *   - prefers-reduced-motion fully honoured (parallax, ken-burns, reveals, pulse)
 *
 * Tokens, type scale, copy (EN/IS) and interactions follow the handoff
 * README + Kirkjubaer Camping.dc.html (source of truth).
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Img } from '../../components/Img'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { getPreviewCompany } from '../companies'
import { setThemeColor } from '../../lib/preview'
import { IMAGES, LINKS, NAV, getContent, seasonStatus } from './data'
import type { Lang, PageKey } from './data'

const company = getPreviewCompany('kirkjubaer')

// ── Design tokens (from the handoff; small-text colours nudged for WCAG AA) ──
const PAPER = '#f4ede0' // page background
const PAPER_ALT = '#ece1cc' // alt sections, cards, facility tiles
const PAPER_ALT_HOVER = '#e7d9bd'
const INK = '#28241d' // primary text
const INK74 = 'rgba(40,36,29,.74)' // body text
const FOREST = '#2f4a39' // primary buttons
const FOREST_DEEP_SEC = '#243a2c' // dark sections / button hover
const FOREST_FOOTER = '#1f2e14' // footer bg
const CLAY = '#c2693f' // accent fills (CTA band, quote marks)
const CLAY_BTN = '#b35e34' // clay *buttons* — deepened so white text clears AA
const CLAY_BTN_HOVER = '#9c4f2a'
const CREAM_TEXT = '#f6f1e6' // text on dark / clay
const LIME = '#b6c24f' // labels/links on dark sections
const MOSS_TICK = '#5a7d4a' // ✓ in lists
const OLIVE = '#7a5d2e' // kicker labels on paper (darkened from #9a7d4e for AA)
const GREEN_DOT = '#86d98f'
const FOOTER_TEXT = '#d3decb'
const SAND_LINE = 'rgba(40,36,29,.12)'

const DISP = "'Bricolage Grotesque', system-ui, sans-serif"
const BODY = "'Hanken Grotesk', system-ui, sans-serif"
const EASE = 'cubic-bezier(.16,1,.3,1)'
const MAXW = 1180

// Tiny feathered-noise data-URI — a film grain that masks the soft hero source.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")"

const PAGE_CSS = `
  .kb-page ::selection { background:${FOREST}; color:${PAPER}; }
  .kb-page a { color:inherit; text-decoration:none; }
  .kb-page :focus-visible { outline:2.5px solid ${CLAY}; outline-offset:3px; border-radius:6px; }
  .kb-page header :focus-visible { outline-color:var(--nav); }

  @keyframes kbPageFade { from{opacity:0; transform:translateY(12px)} to{opacity:1; transform:none} }
  @keyframes kbFloaty { 0%,100%{transform:translateY(0)} 50%{transform:translateY(9px)} }
  @keyframes kbPulseDot { 0%,100%{opacity:1; transform:scale(1)} 50%{opacity:.4; transform:scale(.78)} }
  @keyframes kbKenburns { 0%{transform:scale(1.06)} 100%{transform:scale(1.16)} }

  /* nav links */
  .kb-navlink { position:relative; padding:9px 14px; font:600 14.5px ${BODY}; color:var(--nav); opacity:.9; transition:opacity .25s ease; }
  .kb-navlink:hover { opacity:1; }
  .kb-langbtn { position:relative; background:none; border:none; color:var(--nav); cursor:pointer; padding:2px 1px; font:600 12.5px ${BODY}; opacity:.62; transition:opacity .25s ease; }
  .kb-langbtn:hover { opacity:1; }
  .kb-hcta { transition:background .3s ease,color .3s ease; }
  .kb-hcta:hover { background:var(--nav); color:${FOREST}; }

  /* buttons */
  .kb-btn { display:inline-flex; align-items:center; gap:9px; border-radius:999px; font-weight:600; cursor:pointer; border:none; transition:background .3s ease, transform .3s ease, color .3s ease; }
  .kb-btn:hover { transform:translateY(-2px); }
  .kb-btn-clay { background:${CLAY_BTN}; color:#fff; }
  .kb-btn-clay:hover { background:${CLAY_BTN_HOVER}; transform:translateY(-2px); }
  .kb-btn-forest { background:${FOREST}; color:${PAPER}; }
  .kb-btn-forest:hover { background:${FOREST_DEEP_SEC}; transform:translateY(-2px); }
  .kb-btn-ghost-dark { background:rgba(246,241,230,.1); color:${CREAM_TEXT}; border:1.5px solid rgba(246,241,230,.55); backdrop-filter:blur(6px); }
  .kb-btn-ghost-dark:hover { background:rgba(246,241,230,.22); transform:translateY(-2px); }
  .kb-btn-ghost-ink { border:1.5px solid rgba(40,36,29,.3); color:${INK}; background:transparent; }
  .kb-btn-ghost-ink:hover { background:${INK}; color:${PAPER}; }
  .kb-btn-ghost-cream { border:1.5px solid rgba(233,239,226,.4); color:#e9efe2; background:transparent; }
  .kb-btn-ghost-cream:hover { background:rgba(233,239,226,.12); }
  .kb-btn-ghost-clay { background:rgba(255,248,239,.15); border:1.5px solid rgba(255,248,239,.6); color:${CREAM_TEXT}; }
  .kb-btn-ghost-clay:hover { background:rgba(255,248,239,.26); }
  .kb-btn-lime { background:${LIME}; color:#1f2e14; }
  .kb-btn-lime:hover { background:#c8d35f; }
  .kb-pill { display:inline-flex; align-items:center; gap:7px; padding:11px 18px; border-radius:999px; background:${FOREST}; color:${PAPER}; font:600 14px ${BODY}; transition:transform .25s ease,background .3s ease; }
  .kb-pill:hover { background:${FOREST_DEEP_SEC}; transform:translateY(-2px); }

  /* facility tile */
  .kb-fac { display:flex; flex-direction:column; align-items:center; text-align:center; gap:13px; padding:24px 12px; background:${PAPER_ALT}; border-radius:18px; transition:transform .35s ease,background .35s ease; }
  .kb-fac:hover { transform:translateY(-4px); background:${PAPER_ALT_HOVER}; }
  .kb-facchip { width:62px; height:62px; border-radius:14px; background:#fff; display:flex; align-items:center; justify-content:center; box-shadow:0 1px 0 rgba(40,36,29,.06); }

  /* image frame */
  .kb-frame { position:relative; border-radius:22px; overflow:hidden; }
  .kb-frame img { transition:transform .9s ${EASE}; }
  .kb-frame:hover img { transform:scale(1.05); }

  /* attraction card */
  .kb-attr { display:block; border-radius:20px; overflow:hidden; transition:transform .4s ease; }
  .kb-attr:hover { transform:translateY(-6px); }
  .kb-attr .kb-attr-img { transition:transform .9s ${EASE}; }
  .kb-attr:hover .kb-attr-img { transform:scale(1.07); }

  .kb-footlink { transition:color .25s ease; }
  .kb-footlink:hover { color:${LIME}; }

  /* reveal */
  .kb-reveal { opacity:0; transform:translateY(30px); transition:opacity 1.05s ${EASE}, transform 1.05s ${EASE}; }

  /* custom scrollbar */
  .kb-page::-webkit-scrollbar { width:11px; }
  .kb-page::-webkit-scrollbar-track { background:#e7dcc6; }
  .kb-page::-webkit-scrollbar-thumb { background:#bcab8c; border-radius:8px; border:3px solid #e7dcc6; }

  @media (max-width:900px){ .kb-desktopnav{ display:none !important; } .kb-hcta{ display:none !important; } .kb-burger{ display:inline-flex !important; } }
  @media (max-width:820px){ .kb-stack{ grid-template-columns:1fr !important; } .kb-stack .kb-imgcol{ order:-1; } }
  @media (prefers-reduced-motion: reduce){
    .kb-reveal{ opacity:1 !important; transform:none !important; transition:none !important; }
  }
`

type Go = (p: PageKey | 'home') => void

// ── Interior-page banner (camping / cottages / location / prices / surroundings)
function Banner({
  img,
  alt,
  kicker,
  title,
  minVh,
}: {
  img: string
  alt: string
  kicker: string
  title: string
  minVh: number
}) {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: `${minVh}vh`,
        display: 'flex',
        alignItems: 'flex-end',
        padding: '130px clamp(20px,5vw,80px) 56px',
        overflow: 'hidden',
      }}
    >
      <Img
        src={img}
        alt={alt}
        fetchpriority="high"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg,rgba(20,26,18,.5) 0%,rgba(20,26,18,.14) 45%,rgba(20,26,18,.8) 100%)',
        }}
      />
      <div style={{ position: 'relative', maxWidth: MAXW, margin: '0 auto', width: '100%', color: CREAM_TEXT }}>
        <span data-reveal className="kb-reveal" style={{ font: `600 12px ${BODY}`, letterSpacing: '.3em', textTransform: 'uppercase', opacity: 0.85 }}>
          {kicker}
        </span>
        <h1
          data-reveal
          data-reveal-delay="80"
          className="kb-reveal"
          style={{ fontFamily: DISP, fontWeight: 800, fontSize: 'clamp(44px,8vw,104px)', lineHeight: 0.94, letterSpacing: '-.025em', margin: '10px 0 0' }}
        >
          {title}
        </h1>
      </div>
    </section>
  )
}

// ── Lead paragraph (display weight, centred) ─────────────────────────────────
function Lead({ children, maxW = 780 }: { children: React.ReactNode; maxW?: number }) {
  return (
    <div style={{ maxWidth: maxW, margin: '0 auto' }}>
      <p
        data-reveal
        className="kb-reveal"
        style={{ fontSize: 'clamp(19px,2vw,26px)', lineHeight: 1.55, color: '#3a4a35', fontFamily: DISP, fontWeight: 500, letterSpacing: '-.01em', margin: 0 }}
      >
        {children}
      </p>
    </div>
  )
}

// ── Facility grid (shared by home + camping) ─────────────────────────────────
function Facilities({ facilities, min }: { facilities: { img: string; label: string }[]; min: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit,minmax(${min}px,1fr))`, gap: 14 }}>
      {facilities.map((f) => (
        <div key={f.label} data-reveal className="kb-fac kb-reveal">
          <span className="kb-facchip">
            <img src={f.img} alt="" aria-hidden style={{ width: 38, height: 38, objectFit: 'contain' }} />
          </span>
          <span style={{ font: `600 13px ${BODY}`, color: '#3a4a35', lineHeight: 1.3 }}>{f.label}</span>
        </div>
      ))}
    </div>
  )
}

const kicker = (color: string): React.CSSProperties => ({
  font: `600 12px ${BODY}`,
  letterSpacing: '.28em',
  textTransform: 'uppercase',
  color,
})
const sectionPad = 'clamp(70px,10vw,130px) clamp(20px,5vw,80px)'
const h2Style: React.CSSProperties = {
  fontFamily: DISP,
  fontWeight: 700,
  fontSize: 'clamp(30px,4.4vw,56px)',
  lineHeight: 1.04,
  letterSpacing: '-.02em',
  margin: '14px 0 0',
  color: FOREST_DEEP_SEC,
}

export default function KirkjubaerPage() {
  const reduced = useReducedMotion() ?? false
  const [page, setPage] = useState<PageKey | 'home'>('home')
  const [lang, setLang] = useState<Lang>('en')
  const [menuOpen, setMenuOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)

  const isHome = page === 'home'
  const C = useMemo(() => getContent(lang), [lang])
  const status = useMemo(() => seasonStatus(lang, new Date()), [lang])

  const go: Go = (p) => {
    setMenuOpen(false)
    setPage(p)
  }

  // Title + mobile browser chrome tint, reactive to language.
  useEffect(() => {
    document.title =
      lang === 'is'
        ? 'Tjaldsvæðið Kirkjubær II · Kirkjubæjarklaustur'
        : 'Kirkjubær II Camping Ground · Kirkjubæjarklaustur'
    setThemeColor(FOREST_DEEP_SEC)
  }, [lang])

  // Header solidity: transparent over home hero, solid after 40px or on any
  // interior page. Drives the --nav colour flip.
  useEffect(() => {
    const onScroll = () => setSolid(!isHome || (window.scrollY || 0) > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  // On view change: scroll to top.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [page])

  // Scroll reveals — re-armed whenever the view (and its DOM) changes.
  useEffect(() => {
    if (reduced) return
    const root = rootRef.current
    if (!root || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement
            const d = el.getAttribute('data-reveal-delay')
            if (d) el.style.transitionDelay = `${d}ms`
            el.style.opacity = '1'
            el.style.transform = 'none'
            io.unobserve(el)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -7% 0px' },
    )
    const id = requestAnimationFrame(() =>
      root.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el)),
    )
    return () => {
      cancelAnimationFrame(id)
      io.disconnect()
    }
  }, [reduced, page])

  // Hero parallax (home only): the photo drifts down slower than the scroll.
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0vh', '22vh'])

  const nav = NAV.map((n) => ({ ...n, label: lang === 'is' ? n.is : n.en, active: page === n.key }))
  const navColor = solid ? INK : '#f7f2e7'

  return (
    <div
      ref={rootRef}
      className="kb-page"
      lang={lang}
      style={{
        fontFamily: BODY,
        color: INK,
        background: PAPER,
        overflowX: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{PAGE_CSS}</style>

      {/* ===================== HEADER ===================== */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          padding: '16px clamp(18px,4vw,56px)',
          transition: 'background .45s ease, box-shadow .45s ease',
          background: solid ? 'rgba(244,237,224,.92)' : 'transparent',
          boxShadow: solid ? '0 1px 0 rgba(40,36,29,.10)' : 'none',
          backdropFilter: solid ? 'saturate(150%) blur(12px)' : 'none',
          WebkitBackdropFilter: solid ? 'saturate(150%) blur(12px)' : 'none',
          '--nav': navColor,
        } as React.CSSProperties}
      >
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault()
            go('home')
          }}
          aria-label={lang === 'is' ? 'Forsíða' : 'Home'}
          style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, color: navColor }}
        >
          <span style={{ font: `600 9px/1 ${BODY}`, letterSpacing: '.34em', textTransform: 'uppercase', opacity: 0.72 }}>
            Tjaldsvæðið
          </span>
          <span style={{ fontFamily: DISP, fontWeight: 800, fontSize: 22, letterSpacing: '-.01em', marginTop: 4 }}>
            Kirkjubær II
          </span>
        </a>

        <nav className="kb-desktopnav" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {nav.map((item) => (
            <a
              key={item.key}
              href={`#${item.key}`}
              className="kb-navlink"
              aria-current={item.active ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault()
                go(item.key)
              }}
            >
              {item.label}
              {item.active && (
                <span style={{ position: 'absolute', left: 14, right: 14, bottom: 2, height: 2, background: 'currentColor', borderRadius: 2 }} />
              )}
            </a>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: navColor }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }} role="group" aria-label={C.t.langLabel}>
            <button className="kb-langbtn" onClick={() => setLang('en')} aria-pressed={lang === 'en'} style={lang === 'en' ? { opacity: 1 } : undefined}>
              EN
              {lang === 'en' && <span style={{ position: 'absolute', left: 0, right: 0, bottom: -3, height: 2, background: 'currentColor' }} />}
            </button>
            <span style={{ opacity: 0.35 }}>/</span>
            <button className="kb-langbtn" onClick={() => setLang('is')} aria-pressed={lang === 'is'} style={lang === 'is' ? { opacity: 1 } : undefined}>
              IS
              {lang === 'is' && <span style={{ position: 'absolute', left: 0, right: 0, bottom: -3, height: 2, background: 'currentColor' }} />}
            </button>
          </div>
          <a
            className="kb-hcta"
            href={`tel:${LINKS.tel}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 999, border: '1.5px solid currentColor', color: navColor, font: `600 13.5px ${BODY}` }}
          >
            {C.t.call}
          </a>
          <button
            className="kb-burger"
            onClick={() => setMenuOpen(true)}
            aria-label={C.t.menuLabel}
            style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: 42, height: 42, borderRadius: 12, border: '1.5px solid currentColor', background: 'none', color: navColor, cursor: 'pointer', fontSize: 18 }}
          >
            ≡
          </button>
        </div>
      </header>

      {/* ===================== MOBILE MENU ===================== */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: PAPER, display: 'flex', flexDirection: 'column', padding: '24px clamp(20px,6vw,40px)', animation: 'kbPageFade .35s ease both' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: DISP, fontWeight: 800, fontSize: 22 }}>Kirkjubær II</span>
            <button onClick={() => setMenuOpen(false)} aria-label={lang === 'is' ? 'Loka' : 'Close'} style={{ width: 44, height: 44, borderRadius: 12, border: '1.5px solid rgba(40,36,29,.3)', background: 'none', cursor: 'pointer', fontSize: 20 }}>
              ✕
            </button>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 40 }}>
            {nav.map((item) => (
              <a
                key={item.key}
                href={`#${item.key}`}
                onClick={(e) => {
                  e.preventDefault()
                  go(item.key)
                }}
                style={{ fontFamily: DISP, fontWeight: 700, fontSize: 'clamp(30px,9vw,46px)', letterSpacing: '-.02em', padding: '8px 0', color: INK }}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a href={`tel:${LINKS.tel}`} style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9, padding: 16, borderRadius: 999, background: FOREST, color: PAPER, font: `600 16px ${BODY}` }}>
            {C.t.call} · {LINKS.telDisplay}
          </a>
        </div>
      )}

      {/* ===================== MAIN (keyed so each view fades in) ===================== */}
      <main key={page} style={{ animation: reduced ? undefined : 'kbPageFade .55s ease both' }}>
        {isHome && <Home C={C} status={status} reduced={reduced} go={go} heroRef={heroRef} heroY={heroY} />}
        {page === 'camping' && <Camping C={C} go={go} />}
        {page === 'cottages' && <Cottages C={C} />}
        {page === 'location' && <Location C={C} />}
        {page === 'prices' && <Prices C={C} />}
        {page === 'surroundings' && <Surroundings C={C} />}
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer style={{ background: FOREST_FOOTER, color: FOOTER_TEXT, padding: 'clamp(52px,7vw,92px) clamp(20px,5vw,80px) 36px' }}>
        <div style={{ maxWidth: MAXW, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 40 }}>
          <div>
            <span style={{ fontFamily: DISP, fontWeight: 800, fontSize: 24, color: PAPER }}>Kirkjubær II</span>
            <p style={{ margin: '16px 0 0', fontSize: 14.5, lineHeight: 1.7, color: 'rgba(211,222,203,.72)' }}>
              {C.c.addressLine1}
              <br />
              880 Kirkjubæjarklaustur, {lang === 'is' ? 'Ísland' : 'Iceland'}
            </p>
            <p style={{ margin: '14px 0 0', fontSize: 14.5, lineHeight: 1.8, color: 'rgba(211,222,203,.72)' }}>
              {C.t.phoneLabel}:{' '}
              <a href={`tel:${LINKS.tel}`} style={{ color: LIME }}>
                {LINKS.telDisplay}
              </a>
              <br />
              {C.t.emailLabel}:{' '}
              <a href={`mailto:${LINKS.email}`} style={{ color: LIME }}>
                {LINKS.email}
              </a>
            </p>
          </div>
          <div>
            <span style={{ font: `600 11px ${BODY}`, letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(211,222,203,.55)' }}>
              {C.t.menuLabel}
            </span>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 16 }}>
              {nav.map((item) => (
                <a
                  key={item.key}
                  href={`#${item.key}`}
                  className="kb-footlink"
                  onClick={(e) => {
                    e.preventDefault()
                    go(item.key)
                  }}
                  style={{ fontSize: 15, color: FOOTER_TEXT, width: 'fit-content' }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <span style={{ font: `600 11px ${BODY}`, letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(211,222,203,.55)' }}>
              {C.t.followLabel}
            </span>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 16 }}>
              <a className="kb-footlink" href={LINKS.facebook} target="_blank" rel="noopener noreferrer" style={{ fontSize: 15, color: FOOTER_TEXT }}>
                Facebook ↗
              </a>
              <a className="kb-footlink" href={LINKS.tripadvisor} target="_blank" rel="noopener noreferrer" style={{ fontSize: 15, color: FOOTER_TEXT }}>
                TripAdvisor ↗
              </a>
              <a className="kb-footlink" href={LINKS.airbnbHost} target="_blank" rel="noopener noreferrer" style={{ fontSize: 15, color: FOOTER_TEXT }}>
                Airbnb ↗
              </a>
            </nav>
          </div>
        </div>
        <div style={{ maxWidth: MAXW, margin: '48px auto 0', paddingTop: 24, borderTop: '1px solid rgba(211,222,203,.14)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, fontSize: 12.5, color: 'rgba(211,222,203,.5)' }}>
          <span>© 2026 kirkjubaer.com · {C.t.rights}</span>
          <span>Kirkjubæjarklaustur · {lang === 'is' ? 'Suður-Ísland' : 'South Iceland'}</span>
        </div>
      </footer>

      <PreviewChrome company={company} />
      <PreviewFooter company={company} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME
// ─────────────────────────────────────────────────────────────────────────────
function Home({
  C,
  status,
  reduced,
  go,
  heroRef,
  heroY,
}: {
  C: ReturnType<typeof getContent>
  status: ReturnType<typeof seasonStatus>
  reduced: boolean
  go: Go
  heroRef: React.RefObject<HTMLElement>
  heroY: import('framer-motion').MotionValue<string>
}) {
  const { t, c } = C
  return (
    <>
      {/* HERO */}
      <section ref={heroRef} style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <motion.div style={{ position: 'absolute', inset: 0, y: reduced ? 0 : heroY, willChange: 'transform' }}>
          <img
            src={IMAGES.hero}
            alt="Kirkjubær II camping ground: a wooden footbridge and grassy pitches with campervans below distant glacier-capped mountains"
            decoding="async"
            {...{ fetchpriority: 'high' }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '130%',
              objectFit: 'cover',
              objectPosition: '50% 42%',
              animation: reduced ? undefined : 'kbKenburns 26s ease-in-out infinite alternate',
              willChange: 'transform',
            }}
          />
        </motion.div>
        {/* legibility gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(20,26,18,.5) 0%,rgba(20,26,18,.12) 32%,rgba(20,26,18,.28) 60%,rgba(20,26,18,.82) 100%)' }} />
        {/* film grain — masks the soft source, adds editorial texture */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: GRAIN, opacity: 0.06, mixBlendMode: 'overlay', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', width: '100%', maxWidth: MAXW, margin: '0 auto', padding: '0 clamp(20px,5vw,80px) clamp(56px,9vh,110px)', color: CREAM_TEXT }}>
          <span data-reveal className="kb-reveal" style={{ display: 'block', font: `600 13px ${BODY}`, letterSpacing: '.32em', textTransform: 'uppercase', opacity: 0.9 }}>
            {c.heroKicker}
          </span>
          <h1 data-reveal data-reveal-delay="90" className="kb-reveal" style={{ fontFamily: DISP, fontWeight: 800, fontSize: 'clamp(48px,9vw,128px)', lineHeight: 0.92, letterSpacing: '-.025em', margin: '14px 0 0', maxWidth: '14ch' }}>
            {c.heroTitle}
          </h1>
          <p data-reveal data-reveal-delay="180" className="kb-reveal" style={{ margin: '22px 0 0', maxWidth: '46ch', fontSize: 'clamp(16px,1.6vw,20px)', lineHeight: 1.6, color: 'rgba(246,241,230,.92)' }}>
            {c.heroBody}
          </p>
          <div data-reveal data-reveal-delay="260" className="kb-reveal" style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 32 }}>
            <a className="kb-btn kb-btn-clay" href="#cottages" onClick={(e) => { e.preventDefault(); go('cottages') }} style={{ padding: '16px 28px', fontSize: 15.5 }}>
              {t.bookCottage} →
            </a>
            <a className="kb-btn kb-btn-ghost-dark" href="#camping" onClick={(e) => { e.preventDefault(); go('camping') }} style={{ padding: '16px 28px', fontSize: 15.5 }}>
              {t.seeCamping}
            </a>
          </div>
          <div data-reveal data-reveal-delay="340" className="kb-reveal" style={{ display: 'inline-flex', alignItems: 'center', gap: 11, marginTop: 34, padding: '10px 18px', borderRadius: 999, background: 'rgba(246,241,230,.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(246,241,230,.26)' }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: status.open ? GREEN_DOT : CLAY, boxShadow: `0 0 0 4px ${status.open ? 'rgba(134,217,143,.22)' : 'rgba(194,105,63,.22)'}`, animation: reduced ? undefined : 'kbPulseDot 2.4s ease infinite' }} />
            <span style={{ font: `600 14px ${BODY}` }}>{status.label}</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span style={{ font: `500 13px ${BODY}`, opacity: 0.86 }}>{status.sub}</span>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, color: CREAM_TEXT, opacity: 0.78 }}>
          <span style={{ font: `600 10px ${BODY}`, letterSpacing: '.3em', textTransform: 'uppercase' }}>{t.scroll}</span>
          <span style={{ fontSize: 18, animation: reduced ? undefined : 'kbFloaty 2.1s ease infinite' }}>↓</span>
        </div>
      </section>

      {/* WELCOME */}
      <section style={{ padding: sectionPad }}>
        <div style={{ maxWidth: MAXW, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'clamp(28px,5vw,72px)', alignItems: 'start' }}>
          <div>
            <span data-reveal className="kb-reveal" style={kicker(OLIVE)}>{c.welcomeKicker}</span>
            <h2 data-reveal data-reveal-delay="80" className="kb-reveal" style={h2Style}>{c.welcomeTitle}</h2>
          </div>
          <p data-reveal data-reveal-delay="140" className="kb-reveal" style={{ margin: '6px 0 0', fontSize: 'clamp(17px,1.5vw,20px)', lineHeight: 1.7, color: INK74 }}>
            {c.welcomeBody}
          </p>
        </div>
        <div data-reveal data-reveal-delay="120" className="kb-reveal" style={{ maxWidth: MAXW, margin: 'clamp(40px,6vw,72px) auto 0' }}>
          <Facilities facilities={C.facilities} min={132} />
        </div>
      </section>

      {/* STAY YOUR WAY */}
      <section style={{ background: PAPER_ALT, padding: 'clamp(60px,8vw,110px) clamp(20px,5vw,80px)' }}>
        <div style={{ maxWidth: MAXW, margin: '0 auto' }}>
          <span data-reveal className="kb-reveal" style={kicker(OLIVE)}>{c.stayKicker}</span>
          <div className="kb-stack" data-reveal data-reveal-delay="80" style={{ display: 'grid', gridTemplateColumns: '1.04fr .96fr', gap: 'clamp(24px,4vw,64px)', alignItems: 'center', marginTop: 34 }}>
            <div className="kb-imgcol kb-frame" style={{ aspectRatio: '4/3' }}>
              <img src={IMAGES.hero} alt="Tents and campervans on the grassy pitches at Kirkjubær II" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <h3 style={{ fontFamily: DISP, fontWeight: 700, fontSize: 'clamp(28px,3.6vw,46px)', letterSpacing: '-.02em', margin: 0, color: FOREST_DEEP_SEC }}>{c.campCardTitle}</h3>
              <p style={{ margin: '16px 0 0', fontSize: 18, lineHeight: 1.65, color: INK74, maxWidth: '44ch' }}>{c.campCardBody}</p>
              <a className="kb-btn kb-btn-forest" href="#camping" onClick={(e) => { e.preventDefault(); go('camping') }} style={{ marginTop: 24, padding: '14px 24px', fontSize: 15 }}>
                {t.seeCamping} →
              </a>
            </div>
          </div>
          <div className="kb-stack" data-reveal style={{ display: 'grid', gridTemplateColumns: '.96fr 1.04fr', gap: 'clamp(24px,4vw,64px)', alignItems: 'center', marginTop: 'clamp(32px,5vw,64px)' }}>
            <div>
              <h3 style={{ fontFamily: DISP, fontWeight: 700, fontSize: 'clamp(28px,3.6vw,46px)', letterSpacing: '-.02em', margin: 0, color: FOREST_DEEP_SEC }}>{c.cotCardTitle}</h3>
              <p style={{ margin: '16px 0 0', fontSize: 18, lineHeight: 1.65, color: INK74, maxWidth: '44ch' }}>{c.cotCardBody}</p>
              <a className="kb-btn kb-btn-forest" href="#cottages" onClick={(e) => { e.preventDefault(); go('cottages') }} style={{ marginTop: 24, padding: '14px 24px', fontSize: 15 }}>
                {t.seeCottages} →
              </a>
            </div>
            <div className="kb-imgcol kb-frame" style={{ aspectRatio: '4/3' }}>
              <img src={IMAGES.cottages} alt="The row of little cottages at Kirkjubær II" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section style={{ padding: sectionPad }}>
        <div className="kb-stack" style={{ maxWidth: MAXW, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(28px,5vw,72px)', alignItems: 'center' }}>
          <div>
            <span data-reveal className="kb-reveal" style={kicker(OLIVE)}>{c.locKicker}</span>
            <h2 data-reveal data-reveal-delay="80" className="kb-reveal" style={{ ...h2Style, fontSize: 'clamp(30px,4.2vw,54px)' }}>{c.locTitle}</h2>
            <p data-reveal data-reveal-delay="140" className="kb-reveal" style={{ margin: '18px 0 0', fontSize: 18, lineHeight: 1.7, color: INK74, maxWidth: '46ch' }}>{c.locBody}</p>
            <a className="kb-btn kb-btn-forest kb-reveal" data-reveal data-reveal-delay="200" href="#location" onClick={(e) => { e.preventDefault(); go('location') }} style={{ marginTop: 26, padding: '14px 24px', fontSize: 15 }}>
              {t.getDirections} →
            </a>
          </div>
          <div data-reveal data-reveal-delay="120" className="kb-imgcol kb-reveal" style={{ borderRadius: 22, overflow: 'hidden', background: PAPER_ALT, border: '1px solid rgba(40,36,29,.08)' }}>
            <img src={IMAGES.locationMap} alt="Map showing Kirkjubær II beside Kirkjubæjarklaustur on Route 1" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* SURROUNDINGS */}
      <section style={{ background: FOREST_DEEP_SEC, color: '#e9efe2', padding: sectionPad }}>
        <div style={{ maxWidth: MAXW, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20 }}>
            <div>
              <span data-reveal className="kb-reveal" style={kicker(LIME)}>{c.surrKicker}</span>
              <h2 data-reveal data-reveal-delay="80" className="kb-reveal" style={{ ...h2Style, color: '#e9efe2', fontSize: 'clamp(30px,4.2vw,54px)' }}>{c.surrTitle}</h2>
            </div>
            <p data-reveal data-reveal-delay="120" className="kb-reveal" style={{ margin: 0, maxWidth: '42ch', fontSize: 17, lineHeight: 1.65, color: 'rgba(233,239,226,.78)' }}>{c.surrBody}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, marginTop: 48 }}>
            {C.surroundings.map((s) => (
              <a key={s.title} className="kb-attr kb-reveal" data-reveal href={s.link} target="_blank" rel="noopener noreferrer" style={{ background: '#2c4636', border: '1px solid rgba(255,255,255,.07)' }}>
                <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                  <Img src={s.img} alt={s.title} className="kb-attr-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ padding: 22 }}>
                  <h3 style={{ fontFamily: DISP, fontWeight: 700, fontSize: 21, margin: 0, letterSpacing: '-.01em' }}>
                    {s.title} <span style={{ color: LIME }}>↗</span>
                  </h3>
                  <p style={{ margin: '10px 0 0', fontSize: 14.5, lineHeight: 1.6, color: 'rgba(233,239,226,.72)' }}>{s.blurb}</p>
                </div>
              </a>
            ))}
          </div>
          <div data-reveal className="kb-reveal" style={{ marginTop: 36 }}>
            <a className="kb-btn kb-btn-ghost-cream" href="#surroundings" onClick={(e) => { e.preventDefault(); go('surroundings') }} style={{ padding: '14px 24px', fontSize: 15 }}>
              {t.seeSurroundings} →
            </a>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding: 'clamp(70px,10vw,120px) clamp(20px,5vw,80px)' }}>
        <div style={{ maxWidth: MAXW, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 14 }}>
            <span data-reveal className="kb-reveal" style={kicker(OLIVE)}>{c.revKicker}</span>
            <span data-reveal className="kb-reveal" style={{ font: `500 11px ui-monospace,Menlo,monospace`, color: 'rgba(40,36,29,.5)' }}>{c.revNote}</span>
          </div>
          <h2 data-reveal data-reveal-delay="70" className="kb-reveal" style={{ ...h2Style, fontSize: 'clamp(28px,4vw,50px)', maxWidth: '18ch' }}>{c.revTitle}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 18, marginTop: 40 }}>
            {C.reviews.map((r, i) => (
              <div key={i} data-reveal className="kb-reveal" style={{ background: PAPER_ALT, borderRadius: 20, padding: '28px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <span aria-hidden style={{ fontFamily: DISP, fontWeight: 700, fontSize: 34, lineHeight: 0, color: CLAY, height: 18 }}>“</span>
                <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: '#3a4a35', flex: 1 }}>{r.q}</p>
                <span style={{ font: `600 12px ${BODY}`, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(40,36,29,.5)' }}>{r.a}</span>
              </div>
            ))}
          </div>
          <div data-reveal className="kb-reveal" style={{ marginTop: 32 }}>
            <a className="kb-btn kb-btn-ghost-ink" href={LINKS.tripadvisor} target="_blank" rel="noopener noreferrer" style={{ padding: '14px 24px', fontSize: 15 }}>
              {t.readReviews} ↗
            </a>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section style={{ position: 'relative', padding: 'clamp(72px,11vw,150px) clamp(20px,5vw,80px)', background: CLAY, color: '#fff8ef', overflow: 'hidden' }}>
        <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 data-reveal className="kb-reveal" style={{ fontFamily: DISP, fontWeight: 800, fontSize: 'clamp(34px,6vw,76px)', lineHeight: 1, letterSpacing: '-.025em', margin: 0 }}>{c.ctaTitle}</h2>
          <p data-reveal data-reveal-delay="90" className="kb-reveal" style={{ margin: '22px auto 0', maxWidth: '54ch', fontSize: 'clamp(16px,1.5vw,19px)', lineHeight: 1.65, color: 'rgba(255,248,239,.9)' }}>{c.ctaBody}</p>
          <div data-reveal data-reveal-delay="160" className="kb-reveal" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14, marginTop: 34 }}>
            <a className="kb-btn" href={LINKS.airbnbHost} target="_blank" rel="noopener noreferrer" style={{ background: FOREST_DEEP_SEC, color: PAPER, padding: '16px 30px', fontSize: 15.5 }}>
              {t.bookCottage} ↗
            </a>
            <a className="kb-btn kb-btn-ghost-clay" href={`tel:${LINKS.tel}`} style={{ padding: '16px 30px', fontSize: 15.5 }}>
              {t.call} · {LINKS.telDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CAMPING
// ─────────────────────────────────────────────────────────────────────────────
function Camping({ C, go }: { C: ReturnType<typeof getContent>; go: Go }) {
  const { t, c } = C
  const stats = [
    { label: c.recLabel, val: c.recHoursCamp },
    { label: c.quietLabel, val: c.quietVal },
    { label: c.seasonLabel, val: c.seasonVal },
    { label: c.bookingLabel, val: c.bookingVal },
  ]
  return (
    <>
      <Banner img={IMAGES.hero} alt="" kicker="Kirkjubær II" title={c.campTitle} minVh={64} />
      <section style={{ padding: 'clamp(56px,8vw,100px) clamp(20px,5vw,80px)' }}>
        <Lead>{c.campLead}</Lead>
        <div style={{ maxWidth: MAXW, margin: 'clamp(44px,6vw,72px) auto 0' }}>
          <h2 data-reveal className="kb-reveal" style={{ fontFamily: DISP, fontWeight: 700, fontSize: 'clamp(24px,3vw,38px)', letterSpacing: '-.02em', color: FOREST_DEEP_SEC, margin: '0 0 28px' }}>{c.facTitle}</h2>
          <Facilities facilities={C.facilities} min={140} />
        </div>
        <div data-reveal className="kb-reveal" style={{ maxWidth: MAXW, margin: 'clamp(44px,6vw,72px) auto 0', background: FOREST_DEEP_SEC, color: '#e9efe2', borderRadius: 24, padding: 'clamp(32px,5vw,52px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 32 }}>
          {stats.map((s) => (
            <div key={s.label}>
              <span style={{ font: `600 11px ${BODY}`, letterSpacing: '.22em', textTransform: 'uppercase', color: LIME }}>{s.label}</span>
              <p style={{ margin: '8px 0 0', fontFamily: DISP, fontWeight: 700, fontSize: 24 }}>{s.val}</p>
            </div>
          ))}
        </div>
        <div data-reveal className="kb-reveal" style={{ maxWidth: MAXW, margin: '28px auto 0', display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <a className="kb-btn kb-btn-forest" href="#prices" onClick={(e) => { e.preventDefault(); go('prices') }} style={{ padding: '14px 24px', fontSize: 15 }}>{t.seePrices} →</a>
          <a className="kb-btn kb-btn-ghost-ink" href="#location" onClick={(e) => { e.preventDefault(); go('location') }} style={{ padding: '14px 24px', fontSize: 15 }}>{t.getDirections} →</a>
        </div>
      </section>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// COTTAGES
// ─────────────────────────────────────────────────────────────────────────────
function Cottages({ C }: { C: ReturnType<typeof getContent> }) {
  const { t, c } = C
  return (
    <>
      <Banner img={IMAGES.cottages} alt="" kicker="Kirkjubær II" title={c.cotTitle} minVh={64} />
      <section style={{ padding: 'clamp(56px,8vw,100px) clamp(20px,5vw,80px)' }}>
        <div className="kb-stack" style={{ maxWidth: MAXW, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 'clamp(28px,5vw,64px)', alignItems: 'center' }}>
          <div>
            <p data-reveal className="kb-reveal" style={{ fontSize: 'clamp(18px,1.8vw,22px)', lineHeight: 1.6, color: '#3a4a35', margin: 0 }}>{c.cotLead}</p>
            <div data-reveal data-reveal-delay="100" className="kb-reveal" style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 26, alignItems: 'center' }}>
              <a className="kb-btn kb-btn-clay" href={LINKS.airbnbHost} target="_blank" rel="noopener noreferrer" style={{ padding: '15px 26px', fontSize: 15 }}>{t.bookNow} ↗</a>
              <span style={{ font: `500 13px ${BODY}`, color: 'rgba(40,36,29,.55)' }}>{c.bookVia}</span>
            </div>
          </div>
          <div data-reveal data-reveal-delay="120" className="kb-imgcol kb-frame kb-reveal" style={{ aspectRatio: '4/3' }}>
            <img src={IMAGES.cottageSingle} alt="A single cottage at Kirkjubær II" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        <div className="kb-stack" style={{ maxWidth: MAXW, margin: 'clamp(48px,7vw,84px) auto 0', display: 'grid', gridTemplateColumns: '.9fr 1.1fr', gap: 'clamp(28px,5vw,64px)', alignItems: 'center' }}>
          <div data-reveal className="kb-imgcol kb-frame kb-reveal" style={{ aspectRatio: '3/2' }}>
            <img src={IMAGES.cottageBunk} alt="Bunk beds inside a Kirkjubær II cottage" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 28 }}>
            <div data-reveal className="kb-reveal">
              <h3 style={{ fontFamily: DISP, fontWeight: 700, fontSize: 21, color: FOREST_DEEP_SEC, margin: '0 0 14px' }}>{c.cotHasTitle}</h3>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11 }}>
                {C.hasList.map((li) => (
                  <li key={li} style={{ display: 'flex', gap: 10, fontSize: 15.5, lineHeight: 1.5, color: INK74 }}>
                    <span style={{ color: MOSS_TICK, fontWeight: 700 }}>✓</span>
                    {li}
                  </li>
                ))}
              </ul>
            </div>
            <div data-reveal data-reveal-delay="80" className="kb-reveal">
              <h3 style={{ fontFamily: DISP, fontWeight: 700, fontSize: 21, color: FOREST_DEEP_SEC, margin: '0 0 14px' }}>{c.cotBringTitle}</h3>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11 }}>
                {C.bringList.map((li) => (
                  <li key={li} style={{ display: 'flex', gap: 10, fontSize: 15.5, lineHeight: 1.5, color: INK74 }}>
                    <span style={{ color: CLAY, fontWeight: 700 }}>→</span>
                    {li}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: PAPER_ALT, padding: 'clamp(56px,8vw,100px) clamp(20px,5vw,80px)' }}>
        <div style={{ maxWidth: MAXW, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 28 }}>
          <CabinCard title={c.cabinSmallTitle} desc={c.cabinSmallDesc} cabins={C.cabinsSmall} />
          <CabinCard delay={80} title={c.cabinLargeTitle} desc={c.cabinLargeDesc} cabins={C.cabinsLarge} />
        </div>
      </section>
    </>
  )
}

function CabinCard({ title, desc, cabins, delay = 0 }: { title: string; desc: string; cabins: { url: string; label: string }[]; delay?: number }) {
  return (
    <div data-reveal data-reveal-delay={delay || undefined} className="kb-reveal" style={{ background: PAPER, borderRadius: 22, padding: 'clamp(28px,4vw,42px)' }}>
      <h3 style={{ fontFamily: DISP, fontWeight: 700, fontSize: 'clamp(22px,2.6vw,30px)', color: FOREST_DEEP_SEC, margin: 0, letterSpacing: '-.01em' }}>{title}</h3>
      <p style={{ margin: '14px 0 0', fontSize: 15.5, lineHeight: 1.6, color: INK74 }}>{desc}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 22 }}>
        {cabins.map((cb) => (
          <a key={cb.label} className="kb-pill" href={cb.url} target="_blank" rel="noopener noreferrer">
            {cb.label} ↗
          </a>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LOCATION
// ─────────────────────────────────────────────────────────────────────────────
function Location({ C }: { C: ReturnType<typeof getContent> }) {
  const { c } = C
  return (
    <>
      <Banner img={IMAGES.volcanicWay} alt="" kicker="Kirkjubær II" title={c.locPageTitle} minVh={60} />
      <section style={{ padding: 'clamp(56px,8vw,100px) clamp(20px,5vw,80px)' }}>
        <Lead>{c.locPageLead}</Lead>
        <div data-reveal className="kb-reveal" style={{ maxWidth: MAXW, margin: 'clamp(40px,6vw,64px) auto 0', borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(40,36,29,.1)', background: PAPER_ALT, aspectRatio: '16/8', minHeight: 340 }}>
          <iframe title={C.c.locPageTitle === 'Location' ? 'Map of Kirkjubæjarklaustur' : 'Kort af Kirkjubæjarklaustri'} src={LINKS.osmEmbed} loading="lazy" style={{ width: '100%', height: '100%', border: 0 }} />
        </div>
        <div style={{ maxWidth: MAXW, margin: '36px auto 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
          <div data-reveal className="kb-reveal" style={{ background: FOREST_DEEP_SEC, color: '#e9efe2', borderRadius: 20, padding: 30 }}>
            <span style={{ font: `600 11px ${BODY}`, letterSpacing: '.22em', textTransform: 'uppercase', color: LIME }}>{c.addressLabel}</span>
            <p style={{ margin: '12px 0 0', fontFamily: DISP, fontWeight: 700, fontSize: 21, lineHeight: 1.3 }}>
              {c.addressLine1}
              <br />
              880 Kirkjubæjarklaustur
            </p>
            <a className="kb-btn kb-btn-lime" href={LINKS.googleMaps} target="_blank" rel="noopener noreferrer" style={{ marginTop: 18, padding: '12px 20px', fontSize: 14 }}>
              {c.openMaps} ↗
            </a>
          </div>
          <div data-reveal data-reveal-delay="80" className="kb-reveal" style={{ background: PAPER_ALT, borderRadius: 20, padding: 30 }}>
            <span style={{ font: `600 11px ${BODY}`, letterSpacing: '.22em', textTransform: 'uppercase', color: OLIVE }}>{c.distLabel}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
              {C.distances.map((d) => (
                <div key={d.place} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: `1px solid ${SAND_LINE}`, paddingBottom: 10 }}>
                  <span style={{ fontSize: 15.5, color: '#3a4a35', fontWeight: 500 }}>{d.place}</span>
                  <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: 17, color: FOREST_DEEP_SEC }}>{d.km}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PRICES
// ─────────────────────────────────────────────────────────────────────────────
function Prices({ C }: { C: ReturnType<typeof getContent> }) {
  const { t, c } = C
  const chips = [
    { label: c.seasonLabel, val: c.seasonVal },
    { label: c.recLabel, val: c.recHoursCamp },
    { label: c.quietLabel, val: c.quietVal },
  ]
  return (
    <>
      <Banner img={IMAGES.prices} alt="" kicker="Kirkjubær II" title={c.priceTitle} minVh={54} />
      <section style={{ padding: 'clamp(56px,8vw,100px) clamp(20px,5vw,80px)' }}>
        <div data-reveal className="kb-reveal" style={{ maxWidth: MAXW, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16 }}>
          {chips.map((ch) => (
            <div key={ch.label} style={{ background: PAPER_ALT, borderRadius: 16, padding: 22 }}>
              <span style={{ font: `600 11px ${BODY}`, letterSpacing: '.2em', textTransform: 'uppercase', color: OLIVE }}>{ch.label}</span>
              <p style={{ margin: '8px 0 0', fontFamily: DISP, fontWeight: 700, fontSize: 19, color: FOREST_DEEP_SEC }}>{ch.val}</p>
            </div>
          ))}
        </div>

        <div data-reveal className="kb-reveal" style={{ maxWidth: MAXW, margin: '36px auto 0', background: FOREST_DEEP_SEC, borderRadius: 24, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '22px clamp(24px,4vw,40px)', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
            <span style={{ font: `600 11px ${BODY}`, letterSpacing: '.2em', textTransform: 'uppercase', color: LIME }}>{c.colService}</span>
            <span style={{ font: `600 11px ${BODY}`, letterSpacing: '.2em', textTransform: 'uppercase', color: LIME }}>{c.colPrice}</span>
          </div>
          {C.prices.map((pr) => (
            <div key={pr.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, padding: '18px clamp(24px,4vw,40px)', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
              <div>
                <span style={{ fontSize: 16.5, color: '#e9efe2', fontWeight: 500 }}>{pr.label}</span>
                {pr.note && <span style={{ display: 'block', fontSize: 13, color: 'rgba(233,239,226,.6)', marginTop: 3 }}>{pr.note}</span>}
              </div>
              <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: 21, color: '#fff', whiteSpace: 'nowrap' }}>
                {pr.price} <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>ISK</span>
              </span>
            </div>
          ))}
          <div style={{ padding: '18px clamp(24px,4vw,40px)', display: 'flex', flexWrap: 'wrap', gap: 18, font: `500 13px ${BODY}`, color: 'rgba(233,239,226,.65)' }}>
            <span>{c.allIsk}</span>
            <span aria-hidden>·</span>
            <span>{c.noCard}</span>
            <span aria-hidden>·</span>
            <span>{c.updated}</span>
          </div>
        </div>

        <div data-reveal className="kb-reveal" style={{ maxWidth: MAXW, margin: '36px auto 0', background: CLAY, color: '#fff8ef', borderRadius: 24, padding: 'clamp(32px,5vw,52px)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ maxWidth: '54ch' }}>
            <h2 style={{ fontFamily: DISP, fontWeight: 700, fontSize: 'clamp(24px,3vw,36px)', margin: 0, letterSpacing: '-.01em' }}>{c.cotRentTitle}</h2>
            <p style={{ margin: '12px 0 0', fontSize: 16, lineHeight: 1.6, color: 'rgba(255,248,239,.92)' }}>{c.cotRentBody}</p>
          </div>
          <a className="kb-btn" href={LINKS.airbnbHost} target="_blank" rel="noopener noreferrer" style={{ background: FOREST_DEEP_SEC, color: PAPER, padding: '16px 30px', fontSize: 15.5, whiteSpace: 'nowrap' }}>
            {t.bookNow} ↗
          </a>
        </div>
      </section>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SURROUNDINGS
// ─────────────────────────────────────────────────────────────────────────────
function Surroundings({ C }: { C: ReturnType<typeof getContent> }) {
  const { c } = C
  return (
    <>
      <Banner img={IMAGES.fjadrargljufur} alt="" kicker="Kirkjubær II" title={c.surrPageTitle} minVh={60} />
      <section style={{ padding: 'clamp(56px,8vw,100px) clamp(20px,5vw,80px)' }}>
        <Lead maxW={840}>{c.surrPageLead}</Lead>
        <div style={{ maxWidth: MAXW, margin: 'clamp(44px,6vw,72px) auto 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 22 }}>
          {C.surroundings.map((s) => (
            <a key={s.title} className="kb-attr kb-reveal" data-reveal href={s.link} target="_blank" rel="noopener noreferrer" style={{ background: PAPER_ALT }}>
              <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                <Img src={s.img} alt={s.title} className="kb-attr-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ padding: 24 }}>
                <h3 style={{ fontFamily: DISP, fontWeight: 700, fontSize: 22, color: FOREST_DEEP_SEC, margin: 0, letterSpacing: '-.01em' }}>
                  {s.title} <span style={{ color: CLAY }}>↗</span>
                </h3>
                <p style={{ margin: '11px 0 0', fontSize: 15, lineHeight: 1.6, color: 'rgba(40,36,29,.72)' }}>{s.blurb}</p>
              </div>
            </a>
          ))}
        </div>
        <div data-reveal className="kb-reveal" style={{ maxWidth: MAXW, margin: 'clamp(40px,6vw,64px) auto 0' }}>
          <h2 style={{ fontFamily: DISP, fontWeight: 700, fontSize: 'clamp(22px,2.6vw,32px)', color: FOREST_DEEP_SEC, margin: '0 0 20px', letterSpacing: '-.01em' }}>{c.moreTitle}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {C.morePlaces.map((m) => (
              <span key={m} style={{ padding: '12px 20px', borderRadius: 999, background: FOREST_DEEP_SEC, color: '#e9efe2', font: `600 14.5px ${BODY}` }}>{m}</span>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
