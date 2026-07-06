/**
 * Passion Reykjavík — single-page landing (English-first, IS toggle).
 *
 * Structure borrowed from the GK Bakarí skeleton (hero with live open/closed
 * status → menu → colour feature band → story + stats → visit → footer) but
 * re-skinned entirely in Passion's OWN brand: near-black #111 ground (their
 * current site background), antique-gold serif display, deep-burgundy
 * brushstroke (their logo's mark), Lusitana + Source Serif (the fonts their
 * own build preloads). Elegant register: no steam, no spinning food, no pill
 * buttons, no arrow chips.
 *
 * Signature: a burgundy brushstroke that draws itself across the PASSION
 * headline on load (CSS dashoffset animation, time-based — never gates text
 * visibility; static under reduced motion).
 *
 * Motion rules per project lessons: hero starts visible (no JS-gated
 * opacity), reveals are IntersectionObserver + CSS transitions (no framer
 * whileInView), everything transform/opacity only.
 *
 * Radius system (documented lock): controls 4px, frames/cards 14px (inner 9px).
 * Photography: ONE real image (the existing cinnamon-roll plate). All other
 * slots are labelled placeholder frames for HD shots to come.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { getPreviewCompany } from '../companies'
import { setThemeColor } from '../../lib/preview'
import {
  T,
  type Lang,
  LOGO,
  CINNABON_IMG,
  LINKS,
  HOURS_BY_DAY,
  FEATURE,
  MENU,
  BOLLUR,
  REVIEWS,
} from './data'

const company = getPreviewCompany('passion')

// ── Brand tokens (sampled from their own logo + site) ───────────────────────
const INK = '#111111'
const INK_WARM = '#161311'
const INK_DEEP = '#0B0A09'
const BURGUNDY = '#5C1C1F'
const BRUSH = '#722930' // burgundy lifted one step so the stroke reads on ink
const GOLD = '#C8A877'
const GOLD_LIGHT = '#EED3AA'
const IVORY = '#F3EAD3'
const DIM = 'rgba(243,234,211,.66)'
const FAINT = 'rgba(243,234,211,.4)'
const HAIR = 'rgba(238,211,170,.16)'
const HAIR_SOFT = 'rgba(238,211,170,.1)'

const DISPLAY = "'Lusitana', Georgia, serif"
const BODY = "'Source Serif 4', 'Source Serif Pro', Georgia, serif"

const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)'

const PAGE_CSS = `
  .pn-page ::selection { background:${BURGUNDY}; color:${IVORY}; }
  .pn-page a:focus-visible, .pn-page button:focus-visible {
    outline:2px solid ${GOLD}; outline-offset:3px; border-radius:4px;
  }

  .pn-hero { min-height:100svh; }

  /* Brushstroke self-draw. pathLength=1 normalises the dash values. */
  @keyframes pn-draw { to { stroke-dashoffset:0; } }
  .pn-brush {
    stroke-dasharray:1; stroke-dashoffset:1;
    animation:pn-draw 1.7s ${EASE} .45s forwards;
  }

  @keyframes pn-rise { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
  .pn-enter { animation:pn-rise .9s ${EASE} both; }
  .pn-enter-2 { animation:pn-rise .9s ${EASE} .18s both; }
  .pn-enter-3 { animation:pn-rise .9s ${EASE} .32s both; }

  .pn-navlink {
    color:${DIM}; text-decoration:none; font-size:14.5px;
    transition:color .2s ${EASE};
  }
  .pn-navlink:hover { color:${GOLD_LIGHT}; }

  .pn-cta {
    display:inline-block; text-decoration:none; font-weight:600; font-size:15.5px;
    padding:14px 30px; border-radius:4px; white-space:nowrap;
    transition:background .25s ${EASE}, color .25s ${EASE}, border-color .25s ${EASE}, transform .18s ${EASE};
  }
  .pn-cta:active { transform:scale(.98); }
  .pn-cta-gold { background:${GOLD}; color:${INK}; border:1px solid ${GOLD}; }
  .pn-cta-gold:hover { background:${GOLD_LIGHT}; border-color:${GOLD_LIGHT}; }
  .pn-cta-ghost { background:transparent; color:${IVORY}; border:1px solid rgba(238,211,170,.34); }
  .pn-cta-ghost:hover { border-color:${GOLD}; background:rgba(238,211,170,.05); }

  .pn-lang {
    background:none; border:none; cursor:pointer; padding:4px 7px;
    font-family:${BODY}; font-size:13px; letter-spacing:.08em; color:${FAINT};
    transition:color .2s ${EASE}; border-radius:4px;
  }
  .pn-lang[aria-pressed="true"] { color:${GOLD_LIGHT}; }
  .pn-lang:hover { color:${IVORY}; }

  .pn-card {
    transition:transform .6s ${EASE}, border-color .6s ${EASE};
  }
  .pn-card:hover { transform:translateY(-5px); border-color:rgba(238,211,170,.28) !important; }
  .pn-feature-img img { transition:transform 1.1s ${EASE}; }
  .pn-feature-img:hover img { transform:scale(1.04); }

  .pn-footlink { color:${DIM}; text-decoration:none; transition:color .2s ${EASE}; }
  .pn-footlink:hover { color:${GOLD_LIGHT}; }

  @media (max-width:900px) {
    .pn-grid-2, .pn-story-grid, .pn-visit-grid, .pn-vegan-grid { grid-template-columns:1fr !important; }
    .pn-menu-grid { grid-template-columns:repeat(2,1fr) !important; }
    .pn-bollur-cols { columns:1 !important; }
    .pn-stats { grid-template-columns:repeat(2,1fr) !important; row-gap:28px !important; }
    .pn-reviews { grid-template-columns:1fr !important; }
    .pn-reviews > figure { margin-top:0 !important; }
  }
  @media (max-width:600px) {
    .pn-nav { grid-template-columns:auto 1fr !important; row-gap:14px; }
    .pn-nav-left { order:1; grid-column:1 / -1; justify-content:center; }
    .pn-nav-cta { display:none !important; }
    .pn-menu-grid { grid-template-columns:1fr !important; }
    .pn-hero-ctas { flex-direction:column; align-items:stretch; }
    .pn-herofoot { flex-direction:column; align-items:flex-start !important; gap:10px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .pn-brush { animation:none; stroke-dashoffset:0; }
    .pn-enter, .pn-enter-2, .pn-enter-3 { animation:none; }
    .pn-card, .pn-cta, .pn-feature-img img { transition:none; }
    .pn-card:hover, .pn-cta:active { transform:none; }
  }
`

const pad2 = (n: number) => String(n).padStart(2, '0')
const fmtHM = (mins: number) => `${Math.floor(mins / 60)}:${pad2(mins % 60)}`

/** Iceland has no DST, so UTC clock fields equal Iceland local time. */
function openStatus(now: number, lang: Lang) {
  const d = new Date(now)
  const day = d.getUTCDay()
  const mins = d.getUTCHours() * 60 + d.getUTCMinutes()
  const today = HOURS_BY_DAY[day]
  const t = T[lang]
  if (mins >= today.open && mins < today.close) return { open: true, label: t.statusOpen(fmtHM(today.close)) }
  if (mins < today.open) return { open: false, label: t.statusOpensToday(fmtHM(today.open)) }
  return { open: false, label: t.statusOpensTomorrow(fmtHM(HOURS_BY_DAY[(day + 1) % 7].open)) }
}

const revealInit = (reduced: boolean, delay = 0) =>
  reduced
    ? {}
    : {
        opacity: 0,
        transform: 'translateY(26px)',
        transition: `opacity .95s ${EASE} ${delay}s, transform .95s ${EASE} ${delay}s`,
      }

/** Labelled placeholder frame — where the owner's HD photography will live. */
function PhotoSlot({
  label,
  initial,
  ratio = '5 / 4',
}: {
  label: string
  initial: string
  ratio?: string
}) {
  return (
    <div
      style={{
        aspectRatio: ratio,
        borderRadius: 14,
        border: `1px solid ${HAIR}`,
        background: 'rgba(243,234,211,.03)',
        padding: 5,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          height: '100%',
          borderRadius: 9,
          border: `1px dashed rgba(238,211,170,.22)`,
          background: 'linear-gradient(160deg, #1D1712 0%, #120F0B 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          padding: 14,
        }}
      >
        <span style={{ fontFamily: DISPLAY, fontSize: 44, lineHeight: 1, color: GOLD, opacity: 0.32 }}>
          {initial}
        </span>
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            color: FAINT,
            textAlign: 'center',
          }}
        >
          {label}
        </span>
      </div>
    </div>
  )
}

export default function PassionPage() {
  const [lang, setLang] = useState<Lang>('en')
  const t = T[lang]
  const rootRef = useRef<HTMLDivElement>(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const on = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30000)
    return () => window.clearInterval(id)
  }, [])
  const status = useMemo(() => openStatus(now, lang), [now, lang])

  useEffect(() => {
    setThemeColor(INK)
  }, [])

  useEffect(() => {
    if (reduced) return
    const root = rootRef.current
    if (!root || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement
            el.style.opacity = '1'
            el.style.transform = 'none'
            io.unobserve(el)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
    )
    root.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [reduced, lang])

  const sectionPad = 'clamp(84px,12vh,150px) clamp(20px,4.5vw,72px)'
  const wrap = { maxWidth: 1180, margin: '0 auto' } as const

  return (
    <div
      ref={rootRef}
      className="pn-page"
      lang={lang}
      style={{
        fontFamily: BODY,
        color: IVORY,
        background: INK,
        overflowX: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{PAGE_CSS}</style>

      {/* ===================== HERO ===================== */}
      <section
        className="pn-hero"
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px clamp(20px,4.5vw,72px) 0',
          background: INK,
        }}
      >
        <nav
          className="pn-nav"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: 16,
            position: 'relative',
            zIndex: 5,
          }}
        >
          <div className="pn-nav-left" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <a href="#menu" className="pn-navlink">{t.navMenu}</a>
            <a href="#bollur" className="pn-navlink">{t.navBollur}</a>
            <a href="#story" className="pn-navlink">{t.navStory}</a>
            <a href="#visit" className="pn-navlink">{t.navVisit}</a>
          </div>
          <img
            src={LOGO}
            alt="Passion Reykjavík"
            width={104}
            height={64}
            decoding="async"
            style={{ width: 104, height: 'auto', display: 'block' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 18 }}>
            <div role="group" aria-label="Language" style={{ display: 'flex', gap: 2 }}>
              <button className="pn-lang" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
              <span aria-hidden="true" style={{ color: FAINT, alignSelf: 'center' }}>/</span>
              <button className="pn-lang" aria-pressed={lang === 'is'} onClick={() => setLang('is')}>ÍS</button>
            </div>
            <a
              href={LINKS.wolt}
              target="_blank"
              rel="noreferrer"
              className="pn-cta pn-cta-ghost pn-nav-cta"
              style={{ padding: '10px 20px', fontSize: 14 }}
            >
              {t.orderWolt}
            </a>
          </div>
        </nav>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: 'clamp(28px,5vh,60px) 0',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div
            className="pn-enter"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 12.5,
              fontWeight: 600,
              letterSpacing: '.18em',
              textTransform: 'uppercase',
              color: GOLD,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: status.open ? '#8FA876' : GOLD,
                boxShadow: status.open ? '0 0 0 4px rgba(143,168,118,.15)' : '0 0 0 4px rgba(200,168,119,.12)',
              }}
            />
            {status.label}
          </div>

          <div style={{ position: 'relative', marginTop: 'clamp(18px,3.5vh,38px)' }}>
            {/* The brand brushstroke, drawing itself through the wordmark */}
            <svg
              aria-hidden="true"
              viewBox="0 0 900 460"
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%,-40%) rotate(-2deg)',
                width: 'min(72vw, 700px)',
                height: 'auto',
                pointerEvents: 'none',
              }}
            >
              <path
                className="pn-brush"
                pathLength={1}
                d="M64 396 C 250 330, 470 250, 600 172 C 650 142, 688 110, 666 92 C 646 76, 614 102, 628 132 C 644 164, 718 158, 798 120"
                fill="none"
                stroke={BRUSH}
                strokeWidth={13}
                strokeLinecap="round"
                opacity={0.9}
              />
            </svg>
            <h1
              className="pn-enter-2"
              style={{
                fontFamily: DISPLAY,
                fontWeight: 700,
                fontSize: 'clamp(54px, 12.5vw, 158px)',
                lineHeight: 1,
                letterSpacing: '.12em',
                margin: 0,
                paddingLeft: '.12em', // optical balance for the tracking
                background: `linear-gradient(180deg, ${GOLD_LIGHT} 8%, ${GOLD} 55%, #A98C5F 100%)`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                position: 'relative',
              }}
            >
              PASSION
            </h1>
          </div>

          <p
            className="pn-enter-3"
            style={{
              fontStyle: 'italic',
              fontSize: 'clamp(17px, 2vw, 22px)',
              color: IVORY,
              margin: 'clamp(16px,2.5vh,26px) 0 0',
              lineHeight: 1.5,
            }}
          >
            {t.heroSub}
          </p>
          <p
            className="pn-enter-3"
            style={{ fontSize: 'clamp(14.5px,1.4vw,16.5px)', color: DIM, margin: '10px 0 0', maxWidth: '46ch', lineHeight: 1.6 }}
          >
            {t.heroLine}
          </p>

          <div
            className="pn-hero-ctas pn-enter-3"
            style={{ display: 'flex', gap: 14, marginTop: 'clamp(24px,4vh,40px)', justifyContent: 'center' }}
          >
            <a href={LINKS.wolt} target="_blank" rel="noreferrer" className="pn-cta pn-cta-gold">
              {t.orderWolt}
            </a>
            <a href="#menu" className="pn-cta pn-cta-ghost">
              {t.ctaCounter}
            </a>
          </div>
        </div>

        <div
          className="pn-herofoot"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            padding: '18px 0 22px',
            borderTop: `1px solid ${HAIR_SOFT}`,
            position: 'relative',
            zIndex: 2,
          }}
        >
          <span style={{ fontSize: 13.5, color: DIM }}>{t.mainName}</span>
          <span style={{ fontSize: 13.5, color: DIM, textAlign: 'right' }}>
            {t.hoursShort[0]} · {t.hoursShort[1]}
          </span>
        </div>
      </section>

      {/* ===================== FROM THE OVEN ===================== */}
      <section id="menu" style={{ background: INK_WARM, padding: sectionPad }}>
        <div style={wrap}>
          <div data-reveal style={revealInit(reduced)}>
            <h2
              style={{
                fontFamily: DISPLAY,
                fontWeight: 400,
                fontSize: 'clamp(34px,4.4vw,58px)',
                lineHeight: 1.05,
                margin: 0,
                color: GOLD_LIGHT,
              }}
            >
              {t.ovenTitle}
            </h2>
            <p style={{ fontSize: 16, color: DIM, margin: '14px 0 0', maxWidth: '52ch', lineHeight: 1.65 }}>
              {t.ovenIntro}
            </p>
          </div>

          {/* Feature: the one real photo we have (Cinnabon) */}
          <div
            data-reveal
            className="pn-grid-2"
            style={{
              ...revealInit(reduced, 0.1),
              display: 'grid',
              gridTemplateColumns: '1fr 1.1fr',
              gap: 'clamp(24px,4vw,56px)',
              alignItems: 'center',
              marginTop: 'clamp(40px,6vh,64px)',
            }}
          >
            <div
              className="pn-feature-img"
              style={{
                borderRadius: 14,
                border: `1px solid ${HAIR}`,
                padding: 5,
                background: 'rgba(243,234,211,.03)',
              }}
            >
              <div style={{ borderRadius: 9, overflow: 'hidden', aspectRatio: '1 / 1' }}>
                <img
                  src={CINNABON_IMG}
                  alt={lang === 'en' ? 'The Passion Cinnabon, freshly glazed on a cream plate' : 'Cinnabon frá Passion, nýgljáður á ljósum diski'}
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
                <h3 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(28px,3vw,40px)', margin: 0, color: IVORY }}>
                  {FEATURE.name}
                </h3>
                <span style={{ fontSize: 19, fontWeight: 600, color: GOLD }}>{FEATURE.price}</span>
              </div>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: DIM, margin: '16px 0 0', maxWidth: '44ch' }}>
                {FEATURE.desc[lang]}
              </p>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: FAINT, margin: '22px 0 0', maxWidth: '44ch', fontStyle: 'italic' }}>
                {t.photoNote}
              </p>
            </div>
          </div>

          {/* Grid: verified items, placeholder frames for HD photography */}
          <div
            className="pn-menu-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
              gap: 20,
              marginTop: 'clamp(36px,5vh,56px)',
            }}
          >
            {MENU.map((item, i) => (
              <div key={item.name} data-reveal style={revealInit(reduced, Math.min(i * 0.06, 0.3))}>
                <div
                  className="pn-card"
                  style={{
                    background: 'rgba(243,234,211,.03)',
                    border: `1px solid ${HAIR_SOFT}`,
                    borderRadius: 14,
                    padding: 14,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <PhotoSlot label={t.placeholder} initial={item.name.charAt(0)} />
                    {item.tag && (
                      <span
                        style={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          background: BURGUNDY,
                          color: IVORY,
                          fontSize: 10.5,
                          fontWeight: 700,
                          letterSpacing: '.1em',
                          textTransform: 'uppercase',
                          padding: '5px 10px',
                          borderRadius: 4,
                        }}
                      >
                        {item.tag[lang]}
                      </span>
                    )}
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
                      <h3 style={{ fontFamily: BODY, fontWeight: 600, fontSize: 17, lineHeight: 1.25, margin: 0, color: IVORY }}>
                        {item.name}
                      </h3>
                      <span style={{ fontSize: 15, fontWeight: 600, color: GOLD, whiteSpace: 'nowrap' }}>{item.price}</span>
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.55, color: DIM, margin: '8px 0 0' }}>{item.desc[lang]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== BOLLUR (burgundy band) ===================== */}
      <section id="bollur" style={{ background: BURGUNDY, padding: sectionPad }}>
        <div style={wrap}>
          <div data-reveal style={{ ...revealInit(reduced), maxWidth: 640 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '.22em',
                textTransform: 'uppercase',
                color: GOLD_LIGHT,
              }}
            >
              {t.bollurKicker}
            </div>
            <h2
              style={{
                fontFamily: DISPLAY,
                fontWeight: 400,
                fontSize: 'clamp(36px,4.8vw,64px)',
                lineHeight: 1.04,
                margin: '16px 0 0',
                color: IVORY,
              }}
            >
              {t.bollurTitle}
            </h2>
            <p style={{ fontSize: 16.5, lineHeight: 1.7, color: 'rgba(243,234,211,.82)', margin: '18px 0 0' }}>
              {t.bollurIntro}
            </p>
            <p style={{ fontSize: 16, fontWeight: 600, color: GOLD_LIGHT, margin: '16px 0 0' }}>
              {t.bollurPrice}
            </p>
          </div>

          <div
            data-reveal
            className="pn-bollur-cols"
            style={{
              ...revealInit(reduced, 0.12),
              columns: 2,
              columnGap: 'clamp(32px,5vw,72px)',
              marginTop: 'clamp(36px,5vh,56px)',
            }}
          >
            {BOLLUR.map((b) => (
              <div
                key={b.name}
                style={{
                  breakInside: 'avoid',
                  padding: '13px 0',
                  borderBottom: '1px solid rgba(243,234,211,.14)',
                }}
              >
                <div style={{ fontFamily: DISPLAY, fontSize: 18.5, color: GOLD_LIGHT, lineHeight: 1.3 }}>{b.name}</div>
                <div style={{ fontSize: 13.5, color: 'rgba(243,234,211,.66)', marginTop: 3, lineHeight: 1.5 }}>
                  {b.filling[lang]}
                </div>
              </div>
            ))}
          </div>

          <div
            data-reveal
            style={{
              ...revealInit(reduced, 0.2),
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
              marginTop: 26,
            }}
          >
            <span style={{ fontSize: 14, color: 'rgba(243,234,211,.72)' }}>{t.bollurBulk}</span>
            <span style={{ fontSize: 14, fontStyle: 'italic', color: 'rgba(243,234,211,.55)' }}>{t.bollurSeason}</span>
          </div>
        </div>
      </section>

      {/* ===================== VEGAN ===================== */}
      <section style={{ background: INK, padding: sectionPad }}>
        <div
          data-reveal
          className="pn-vegan-grid"
          style={{
            ...revealInit(reduced),
            ...wrap,
            display: 'grid',
            gridTemplateColumns: '1.2fr .8fr',
            gap: 'clamp(28px,5vw,80px)',
            alignItems: 'center',
          }}
        >
          <figure style={{ margin: 0 }}>
            <blockquote
              style={{
                margin: 0,
                fontFamily: DISPLAY,
                fontSize: 'clamp(24px,3vw,38px)',
                lineHeight: 1.32,
                color: GOLD_LIGHT,
              }}
            >
              “{t.veganQuote}”
            </blockquote>
            <figcaption style={{ fontSize: 14, color: FAINT, marginTop: 18 }}>{t.veganWho}</figcaption>
          </figure>
          <div>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(26px,2.8vw,36px)', margin: 0, color: IVORY }}>
              {t.veganTitle}
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: DIM, margin: '14px 0 0' }}>{t.veganBody}</p>
          </div>
        </div>
      </section>

      {/* ===================== STORY ===================== */}
      <section id="story" style={{ background: INK_DEEP, borderTop: `1px solid ${HAIR_SOFT}`, padding: sectionPad }}>
        <div style={wrap}>
          <div
            className="pn-story-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.05fr .95fr',
              gap: 'clamp(28px,5vw,76px)',
              alignItems: 'center',
            }}
          >
            <div data-reveal style={revealInit(reduced)}>
              <h2
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 400,
                  fontSize: 'clamp(34px,4.2vw,56px)',
                  lineHeight: 1.08,
                  margin: 0,
                  color: GOLD_LIGHT,
                  whiteSpace: 'pre-line',
                }}
              >
                {t.storyTitle}
              </h2>
              <p style={{ fontSize: 16.5, lineHeight: 1.75, color: DIM, margin: '24px 0 0', maxWidth: '52ch' }}>{t.storyP1}</p>
              <p style={{ fontSize: 16.5, lineHeight: 1.75, color: DIM, margin: '14px 0 0', maxWidth: '52ch' }}>{t.storyP2}</p>
              <figure style={{ margin: '28px 0 0', paddingLeft: 18, borderLeft: `2px solid ${BRUSH}` }}>
                <blockquote style={{ margin: 0, fontStyle: 'italic', fontSize: 18, lineHeight: 1.55, color: IVORY }}>
                  “{t.storyQuote}”
                </blockquote>
                <figcaption style={{ fontSize: 13.5, color: FAINT, marginTop: 8 }}>{t.storyQuoteWho}</figcaption>
              </figure>
            </div>
            <div data-reveal style={revealInit(reduced, 0.12)}>
              <PhotoSlot label={t.interiorLabel} initial="P" ratio="4 / 5" />
            </div>
          </div>

          <div
            data-reveal
            className="pn-stats"
            style={{
              ...revealInit(reduced, 0.15),
              display: 'grid',
              gridTemplateColumns: 'repeat(4,1fr)',
              gap: 20,
              marginTop: 'clamp(52px,8vh,92px)',
              borderTop: `1px solid ${HAIR_SOFT}`,
              paddingTop: 38,
            }}
          >
            {t.stats.map((s) => (
              <div key={s.caption}>
                <div style={{ fontFamily: DISPLAY, fontSize: 'clamp(30px,3.6vw,48px)', color: GOLD }}>{s.value}</div>
                <div style={{ fontSize: 13.5, color: DIM, marginTop: 6, lineHeight: 1.5 }}>{s.caption}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== REVIEWS ===================== */}
      <section style={{ background: INK_WARM, padding: sectionPad }}>
        <div style={wrap}>
          <div data-reveal style={{ ...revealInit(reduced), display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(30px,3.6vw,46px)', margin: 0, color: GOLD_LIGHT }}>
              {t.reviewsTitle}
            </h2>
            <span style={{ fontSize: 13.5, color: FAINT }}>{t.reviewsNote}</span>
          </div>
          <div
            className="pn-reviews"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'clamp(24px,3.5vw,48px)', marginTop: 'clamp(36px,5vh,54px)' }}
          >
            {REVIEWS.map((r, i) => (
              <figure
                key={r.who}
                data-reveal
                style={{
                  ...revealInit(reduced, i * 0.08),
                  margin: 0,
                  marginTop: i === 1 ? 36 : 0,
                  paddingLeft: 18,
                  borderLeft: `1px solid ${HAIR}`,
                }}
              >
                <blockquote style={{ margin: 0, fontSize: 16.5, lineHeight: 1.65, color: IVORY }}>“{r.quote}”</blockquote>
                <figcaption style={{ fontSize: 13.5, color: FAINT, marginTop: 14 }}>
                  {r.who}, {r.when[lang]}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== VISIT ===================== */}
      <section id="visit" style={{ background: INK, padding: sectionPad }}>
        <div style={wrap}>
          <div data-reveal style={revealInit(reduced)}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: GOLD }}>
              {t.visitKicker}
            </div>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(34px,4.2vw,56px)', margin: '14px 0 0', color: GOLD_LIGHT }}>
              {t.visitTitle}
            </h2>
          </div>

          <div
            className="pn-visit-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.15fr .85fr',
              gap: 'clamp(24px,4vw,56px)',
              marginTop: 'clamp(36px,5vh,56px)',
              alignItems: 'stretch',
            }}
          >
            <div
              data-reveal
              style={{
                ...revealInit(reduced, 0.08),
                border: `1px solid ${HAIR}`,
                borderRadius: 14,
                padding: 'clamp(24px,3vw,40px)',
                background: 'rgba(243,234,211,.03)',
              }}
            >
              <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: GOLD }}>
                {t.mainLabel}
              </div>
              <div style={{ fontFamily: DISPLAY, fontSize: 'clamp(22px,2.4vw,30px)', color: IVORY, marginTop: 10 }}>{t.mainName}</div>
              <div style={{ marginTop: 24, display: 'grid', gap: 15 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, borderBottom: `1px solid ${HAIR_SOFT}`, paddingBottom: 13 }}>
                  <span style={{ color: FAINT, fontSize: 14 }}>{t.rowHours}</span>
                  <span style={{ fontSize: 14.5, textAlign: 'right', color: DIM }}>
                    {t.hoursRows.map((l) => (
                      <span key={l} style={{ display: 'block' }}>{l}</span>
                    ))}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, borderBottom: `1px solid ${HAIR_SOFT}`, paddingBottom: 13 }}>
                  <span style={{ color: FAINT, fontSize: 14 }}>{t.rowPhone}</span>
                  <a href={`tel:${LINKS.phone}`} className="pn-footlink" style={{ fontSize: 14.5, fontWeight: 600 }}>
                    {LINKS.phoneLabel}
                  </a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                  <span style={{ color: FAINT, fontSize: 14 }}>{t.rowEmail}</span>
                  <a href={`mailto:${LINKS.email}`} className="pn-footlink" style={{ fontSize: 14.5, fontWeight: 600, wordBreak: 'break-all' }}>
                    {LINKS.email}
                  </a>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div
                data-reveal
                style={{
                  ...revealInit(reduced, 0.14),
                  border: `1px solid ${HAIR}`,
                  borderRadius: 14,
                  padding: 'clamp(22px,2.6vw,32px)',
                  background: 'rgba(243,234,211,.03)',
                  flex: 1,
                }}
              >
                <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: GOLD }}>
                  {t.counterLabel}
                </div>
                <div style={{ fontFamily: DISPLAY, fontSize: 'clamp(20px,2vw,25px)', color: IVORY, marginTop: 10 }}>{t.counterName}</div>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: DIM, margin: '10px 0 0' }}>{t.counterNote}</p>
              </div>
              <div
                data-reveal
                style={{
                  ...revealInit(reduced, 0.2),
                  borderRadius: 14,
                  padding: 'clamp(22px,2.6vw,32px)',
                  background: BURGUNDY,
                }}
              >
                <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(243,234,211,.85)', margin: 0 }}>{t.deliveryNote}</p>
                <a
                  href={LINKS.wolt}
                  target="_blank"
                  rel="noreferrer"
                  className="pn-cta pn-cta-gold"
                  style={{ marginTop: 18 }}
                >
                  {t.orderWolt}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer style={{ background: INK_DEEP, borderTop: `1px solid ${HAIR_SOFT}`, padding: '52px clamp(20px,4.5vw,72px)' }}>
        <div
          style={{
            ...wrap,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 22,
          }}
        >
          <div>
            <img src={LOGO} alt="" aria-hidden="true" width={92} height={56} loading="lazy" decoding="async" style={{ width: 92, height: 'auto', display: 'block' }} />
            <div style={{ fontSize: 13, color: FAINT, marginTop: 10 }}>{t.footerTag}</div>
          </div>
          <div style={{ fontSize: 13.5, color: DIM, lineHeight: 1.8, textAlign: 'right' }}>
            <div>{t.mainName} · {LINKS.phoneLabel}</div>
            <div style={{ display: 'flex', gap: 18, justifyContent: 'flex-end', marginTop: 6 }}>
              <a href={LINKS.instagram} target="_blank" rel="noreferrer" className="pn-footlink">Instagram</a>
              <a href={LINKS.facebook} target="_blank" rel="noreferrer" className="pn-footlink">Facebook</a>
              <a href={LINKS.wolt} target="_blank" rel="noreferrer" className="pn-footlink">Wolt</a>
            </div>
          </div>
        </div>
      </footer>

      <PreviewChrome company={company} />
      <PreviewFooter company={company} />
    </div>
  )
}
