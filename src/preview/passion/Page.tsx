/**
 * Passion Reykjavík — single-page landing (English-first, IS toggle).
 *
 * CONCEPT: "The Passion Menu" — the page is set like a fine printed menu /
 * broadsheet, deliberately NOT the hero→product-cards→stats→review-columns→
 * visit-cards template shared by the Sauðárkróksbakarí and GK builds. It is
 * type-led: a masthead cover, a gold marquee of the day's bakes, an editorial
 * menu with dotted price leaders (no card grid), one oversized burgundy
 * statement (the sourdough-passion quote), a bollur "board", a single giant
 * featured review, and a tight visit strip.
 *
 * Brand is theirs: near-black #111 ground, antique-gold serif, deep burgundy,
 * ivory. Lusitana (display) + Source Serif 4 (body) — the fonts their own
 * unfinished build preloads.
 *
 * Signature motion: the flagship Cinnabon (tightly cropped on a flat #111
 * ground) is a medallion that bleeds off the cover's right edge and turns as
 * the hero scrolls past (framer useScroll + useSpring). Transform-only; static
 * under reduced motion. Hero starts visible; section reveals are
 * IntersectionObserver + CSS transitions (no framer whileInView).
 *
 * Radius lock: controls 4px, frames 12px. Photography: one real photo (the
 * Cinnabon); a small "coming soon" gallery holds labelled placeholder frames.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Img } from '../../components/Img'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { getPreviewCompany } from '../companies'
import { setThemeColor } from '../../lib/preview'
import {
  T,
  type Lang,
  LOGO,
  HERO_IMG,
  FEATURE_IMG,
  LINKS,
  HOURS_BY_DAY,
  FEATURE,
  MENU,
  BOLLUR,
  REVIEWS,
} from './data'

const company = getPreviewCompany('passion')

// ── Brand tokens (sampled from their own logo + site) ───────────────────────
// #131313 = the exact flattened background of the Higgsfield Cinnabon shot —
// the page ground matches it so the photo edges dissolve invisibly.
const INK = '#131313'
const INK_WARM = '#161311'
const INK_DEEP = '#0B0A09'
const BURGUNDY = '#5C1C1F'
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

// Feather the feature photo's edges into the page ground (its own background is
// a moody gradient, not flat #131313). Two intersecting linear fades = a soft
// rectangular vignette that dissolves all four edges.
const FEATURE_FEATHER =
  'linear-gradient(to right, transparent 0, #000 8%, #000 92%, transparent 100%), ' +
  'linear-gradient(to bottom, transparent 0, #000 7%, #000 93%, transparent 100%)'

const GOLD_TEXT = {
  background: `linear-gradient(180deg, ${GOLD_LIGHT} 6%, ${GOLD} 58%, #A98C5F 100%)`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
} as const

const PAGE_CSS = `
  .pn-page ::selection { background:${BURGUNDY}; color:${IVORY}; }
  .pn-page a:focus-visible, .pn-page button:focus-visible {
    outline:2px solid ${GOLD}; outline-offset:3px; border-radius:4px;
  }

  .pn-cover { min-height:100svh; }

  @keyframes pn-rise { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
  .pn-enter  { animation:pn-rise .9s ${EASE} both; }
  .pn-enter-2 { animation:pn-rise .9s ${EASE} .14s both; }
  .pn-enter-3 { animation:pn-rise .9s ${EASE} .26s both; }
  .pn-enter-4 { animation:pn-rise .9s ${EASE} .38s both; }

  @keyframes pn-marquee { from { transform:translateX(0); } to { transform:translateX(-50%); } }
  .pn-marquee-track { display:flex; width:max-content; animation:pn-marquee 34s linear infinite; }

  .pn-navlink { color:${DIM}; text-decoration:none; font-size:14.5px; transition:color .2s ${EASE}; }
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

  .pn-lang { background:none; border:none; cursor:pointer; padding:4px 7px; font-family:${BODY};
    font-size:13px; letter-spacing:.08em; color:${FAINT}; transition:color .2s ${EASE}; border-radius:4px; }
  .pn-lang[aria-pressed="true"] { color:${GOLD_LIGHT}; }
  .pn-lang:hover { color:${IVORY}; }

  /* Editorial menu rows with dotted price leaders */
  .pn-row { transition:color .2s ${EASE}; }
  .pn-row:hover .pn-row-name { color:${GOLD_LIGHT}; }
  .pn-leader { flex:1; align-self:center; height:0; border-bottom:1.5px dotted rgba(238,211,170,.32); margin:0 4px; transform:translateY(2px); }

  .pn-foot-link { color:${DIM}; text-decoration:none; transition:color .2s ${EASE}; }
  .pn-foot-link:hover { color:${GOLD_LIGHT}; }

  .pn-medallion { position:absolute; top:50%; right:clamp(-140px,-4vw,-40px); transform:translateY(-50%);
    width:clamp(320px,42vw,600px); z-index:1; pointer-events:none; }

  @media (max-width:980px) {
    .pn-cover-grid { grid-template-columns:1fr !important; }
    .pn-medallion { position:static !important; transform:none !important; width:min(64vw,300px) !important;
      margin:6px auto 0; order:-1; }
    .pn-cover-copy { text-align:center; align-items:center !important; }
    .pn-cover-meta { justify-content:center !important; }
    .pn-cover-ctas { justify-content:center !important; }
    .pn-menu-cols { grid-template-columns:1fr !important; }
    .pn-feature { grid-template-columns:1fr !important; }
    .pn-bollur-grid { grid-template-columns:1fr !important; }
    .pn-gallery { grid-template-columns:repeat(3,1fr) !important; }
    .pn-visit-grid { grid-template-columns:1fr !important; }
    .pn-vegan-grid { grid-template-columns:1fr !important; }
  }
  @media (max-width:620px) {
    .pn-nav-links { display:none !important; }
    .pn-cover-ctas { flex-direction:column; align-items:stretch; }
    .pn-gallery { grid-template-columns:1fr !important; }
    .pn-cover-meta { flex-direction:column; gap:6px !important; }
  }
  @media (prefers-reduced-motion: reduce) {
    .pn-enter, .pn-enter-2, .pn-enter-3, .pn-enter-4 { animation:none; }
    .pn-marquee-track { animation:none; }
    .pn-cta { transition:none; }
    .pn-cta:active { transform:none; }
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

/** Small labelled placeholder frame for HD photography still to come. */
function PhotoSlot({ label, initial, ratio = '3 / 4' }: { label: string; initial: string; ratio?: string }) {
  return (
    <div style={{ aspectRatio: ratio, borderRadius: 12, border: `1px solid ${HAIR}`, background: 'rgba(243,234,211,.03)', padding: 5 }}>
      <div
        aria-hidden="true"
        style={{
          height: '100%',
          borderRadius: 8,
          border: '1px dashed rgba(238,211,170,.22)',
          background: 'linear-gradient(160deg, #1D1712 0%, #120F0B 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          padding: 14,
        }}
      >
        <span style={{ fontFamily: DISPLAY, fontSize: 40, lineHeight: 1, color: GOLD, opacity: 0.3 }}>{initial}</span>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: FAINT, textAlign: 'center' }}>
          {label}
        </span>
      </div>
    </div>
  )
}

/** Menu section header: a hairline rule with an eyebrow + the section title. */
function SectionRule({ eyebrow, title, reduced }: { eyebrow: string; title: string; reduced: boolean }) {
  return (
    <div data-reveal style={revealInit(reduced)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderTop: `1px solid ${HAIR}`, paddingTop: 16 }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD }}>{eyebrow}</span>
      </div>
      <h2 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(34px,4.6vw,62px)', lineHeight: 1.03, margin: '18px 0 0', ...GOLD_TEXT }}>
        {title}
      </h2>
    </div>
  )
}

export default function PassionPage() {
  // Default to English on first load (tourist-facing); flip to IS with the toggle.
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

  // Scroll-linked spin on the hero medallion.
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const rollSpin = useSpring(useTransform(scrollYProgress, [0, 1], [0, 200]), { stiffness: 90, damping: 22, mass: 0.4 })
  const rollScale = useTransform(scrollYProgress, [0, 1], [1, 1.06])

  // The marquee of the day's bakes (product names are their real Icelandic names).
  const marqueeItems = useMemo(() => [FEATURE.name, ...MENU.map((m) => m.name), 'Bollur', 'Vegan croissant', 'Súrdeigsbrauð'], [])

  const sectionPad = 'clamp(80px,11vh,140px) clamp(20px,4.5vw,72px)'
  const wrap = { maxWidth: 1180, margin: '0 auto' } as const

  return (
    <div
      ref={rootRef}
      className="pn-page"
      lang={lang}
      style={{ fontFamily: BODY, color: IVORY, background: INK, overflowX: 'hidden', WebkitFontSmoothing: 'antialiased' }}
    >
      <style>{PAGE_CSS}</style>

      {/* ===================== MASTHEAD ===================== */}
      <header style={{ position: 'relative', zIndex: 5, padding: '20px clamp(20px,4.5vw,72px) 0' }}>
        <div style={{ ...wrap, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <img src={LOGO} alt="Passion Reykjavík" width={100} height={62} decoding="async" style={{ width: 100, height: 'auto', display: 'block' }} />
          <nav className="pn-nav-links" style={{ display: 'flex', gap: 26, alignItems: 'center' }}>
            <a href="#menu" className="pn-navlink">{t.navMenu}</a>
            <a href="#bollur" className="pn-navlink">{t.navBollur}</a>
            <a href="#story" className="pn-navlink">{t.navStory}</a>
            <a href="#visit" className="pn-navlink">{t.navVisit}</a>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div role="group" aria-label="Language" style={{ display: 'flex', gap: 2 }}>
              <button className="pn-lang" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
              <span aria-hidden="true" style={{ color: FAINT, alignSelf: 'center' }}>/</span>
              <button className="pn-lang" aria-pressed={lang === 'is'} onClick={() => setLang('is')}>ÍS</button>
            </div>
          </div>
        </div>
      </header>

      {/* ===================== COVER ===================== */}
      <section ref={heroRef} className="pn-cover" style={{ position: 'relative', display: 'flex', flexDirection: 'column', padding: '0 clamp(20px,4.5vw,72px)' }}>
        <div className="pn-cover-grid" style={{ ...wrap, flex: 1, width: '100%', display: 'grid', gridTemplateColumns: '1fr', alignItems: 'center', position: 'relative', padding: 'clamp(24px,5vh,56px) 0' }}>
          {/* the medallion bleeds off the right edge on desktop, sits on top on mobile */}
          <div className="pn-medallion pn-enter-3">
            <motion.div style={{ aspectRatio: '1 / 1', rotate: reduced ? 0 : rollSpin, scale: reduced ? 1 : rollScale, transformOrigin: '50% 50%', willChange: 'transform' }}>
              <Img
                src={HERO_IMG}
                alt={lang === 'en' ? 'The Passion Cinnabon, freshly glazed, from above' : 'Cinnabon frá Passion, nýgljáður, ofan frá'}
                fallbackClassName="bg-transparent"
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              />
            </motion.div>
          </div>

          <div className="pn-cover-copy" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: 720, position: 'relative', zIndex: 2 }}>
            <div className="pn-cover-meta pn-enter" style={{ display: 'flex', gap: 18, alignItems: 'center', fontSize: 12.5, letterSpacing: '.14em', textTransform: 'uppercase', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: GOLD }}>
                <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: status.open ? '#8FA876' : GOLD }} />
                {status.label}
              </span>
            </div>

            <h1 className="pn-enter-2" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(54px, 10.5vw, 148px)', lineHeight: 0.96, letterSpacing: '.01em', margin: 'clamp(16px,3vh,30px) 0 0', ...GOLD_TEXT }}>
              {t.heroTitle}
            </h1>

            <p className="pn-enter-3" style={{ fontStyle: 'italic', fontSize: 'clamp(17px,1.9vw,23px)', color: IVORY, margin: 'clamp(16px,2.5vh,24px) 0 0', lineHeight: 1.5, maxWidth: '32ch' }}>
              {t.heroSub}
            </p>
            <p className="pn-enter-3" style={{ fontSize: 'clamp(14.5px,1.2vw,16px)', color: DIM, margin: '12px 0 0', maxWidth: '40ch', lineHeight: 1.6 }}>
              {t.heroLine}
            </p>

            <div className="pn-cover-ctas pn-enter-4" style={{ display: 'flex', gap: 14, marginTop: 'clamp(24px,3.5vh,36px)' }}>
              <a href={LINKS.wolt} target="_blank" rel="noreferrer" className="pn-cta pn-cta-gold">{t.orderWolt}</a>
              <a href="#menu" className="pn-cta pn-cta-ghost">{t.ctaCounter}</a>
            </div>
          </div>
        </div>

        {/* gold marquee of the day's bakes — the one kinetic strip on the page */}
        <div style={{ borderTop: `1px solid ${HAIR}`, borderBottom: `1px solid ${HAIR}`, padding: '18px 0', overflow: 'hidden', position: 'relative', zIndex: 2 }}>
          <div className="pn-marquee-track" aria-hidden="true">
            {[0, 1].map((dup) => (
              <div key={dup} style={{ display: 'flex', alignItems: 'center' }}>
                {marqueeItems.map((it, i) => (
                  <span key={`${dup}-${i}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <span style={{ fontFamily: DISPLAY, fontSize: 'clamp(20px,2.4vw,30px)', color: i % 2 ? GOLD : GOLD_LIGHT, padding: '0 26px' }}>{it}</span>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: GOLD, opacity: 0.6 }} />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== THE MENU =====================
          Ground stays INK: the featured Cinnabon photo lives here and its
          baked #131313 background must dissolve into the section. */}
      <section id="menu" style={{ background: INK, borderTop: `1px solid ${HAIR_SOFT}`, padding: sectionPad }}>
        <div style={wrap}>
          <SectionRule eyebrow={t.menuMasthead} title={t.ovenTitle} reduced={reduced} />
          <p data-reveal style={{ ...revealInit(reduced, 0.05), fontSize: 16, color: DIM, margin: '16px 0 0', maxWidth: '52ch', lineHeight: 1.65 }}>{t.ovenIntro}</p>

          {/* Featured: the one real photo, the house favourite */}
          <div className="pn-feature" data-reveal style={{ ...revealInit(reduced, 0.1), display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 'clamp(24px,4vw,56px)', alignItems: 'center', marginTop: 'clamp(40px,6vh,68px)' }}>
            {/* Shot 2: the Cinnabon torn open (IMAGE-PROMPTS.md). Its own
                background is a moody gradient (not flat #131313), so the photo
                edges are FEATHERED into the page ground rather than framed in a
                hard box — it dissolves like the hero. Until the file lands, the
                dashed placeholder frame communicates the photo slot. */}
            <div style={{ aspectRatio: '1 / 1', background: INK }}>
              <Img
                src={FEATURE_IMG}
                alt={lang === 'en' ? 'A Passion Cinnabon torn open, showing the soft layered interior' : 'Cinnabon frá Passion rifinn í sundur, mjúk lögin sjást'}
                fallbackClassName="bg-gradient-to-br from-[#1D1712] to-[#120F0B] border border-dashed border-[#EED3AA38] rounded-[8px]"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  WebkitMaskImage: FEATURE_FEATHER,
                  maskImage: FEATURE_FEATHER,
                  WebkitMaskComposite: 'source-in',
                  maskComposite: 'intersect',
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD }}>{t.featuredLabel}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap', marginTop: 12 }}>
                <h3 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(30px,3.4vw,46px)', margin: 0, color: IVORY }}>{FEATURE.name}</h3>
                <span style={{ fontSize: 20, fontWeight: 600, color: GOLD }}>{FEATURE.price}</span>
              </div>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: DIM, margin: '16px 0 0', maxWidth: '42ch' }}>{FEATURE.desc[lang]}</p>
            </div>
          </div>

          {/* the menu, as an editorial list with dotted price leaders */}
          <div className="pn-menu-cols" data-reveal style={{ ...revealInit(reduced, 0.12), display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 'clamp(40px,6vw,88px)', rowGap: 0, marginTop: 'clamp(44px,7vh,72px)' }}>
            {MENU.map((item) => (
              <div key={item.name} className="pn-row" style={{ padding: '20px 0', borderBottom: `1px solid ${HAIR_SOFT}` }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span className="pn-row-name" style={{ fontFamily: DISPLAY, fontSize: 'clamp(20px,2vw,25px)', color: IVORY, transition: `color .2s ${EASE}` }}>
                    {item.name}
                    {item.tag && (
                      <span style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: GOLD_LIGHT, background: BURGUNDY, padding: '3px 8px', borderRadius: 4, marginLeft: 12, verticalAlign: 'middle' }}>
                        {item.tag[lang]}
                      </span>
                    )}
                  </span>
                  <span className="pn-leader" aria-hidden="true" />
                  <span style={{ fontSize: 16, fontWeight: 600, color: GOLD, whiteSpace: 'nowrap' }}>{item.price}</span>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: DIM, margin: '8px 0 0', maxWidth: '46ch' }}>{item.desc[lang]}</p>
              </div>
            ))}
          </div>

          {/* photography-coming gallery: keeps the "HD photos land here" promise, minimal */}
          <div data-reveal style={{ ...revealInit(reduced, 0.16), marginTop: 'clamp(52px,8vh,84px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
              <h3 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(22px,2.4vw,30px)', margin: 0, color: GOLD_LIGHT }}>{t.galleryTitle}</h3>
              <span style={{ fontSize: 13, color: FAINT, fontStyle: 'italic', maxWidth: '40ch', textAlign: 'right' }}>{t.photoNote}</span>
            </div>
            <div className="pn-gallery" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginTop: 22 }}>
              {['Ostaslaufa', 'Vegan croissant', 'Snúður', 'Súrdeig'].map((label, i) => (
                <PhotoSlot key={label} label={t.placeholder} initial={label.charAt(0)} ratio={i % 2 ? '3 / 4' : '4 / 5'} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== STATEMENT (burgundy) ===================== */}
      <section id="story" style={{ background: BURGUNDY, padding: 'clamp(96px,15vh,180px) clamp(20px,4.5vw,72px)' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div data-reveal style={{ ...revealInit(reduced), fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD_LIGHT }}>
            {t.navStory}
          </div>
          <blockquote data-reveal style={{ ...revealInit(reduced, 0.08), fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(34px,5.4vw,76px)', lineHeight: 1.12, letterSpacing: '.005em', color: IVORY, margin: '24px 0 0' }}>
            “{t.storyQuote}”
          </blockquote>
          <div data-reveal style={{ ...revealInit(reduced, 0.14), fontSize: 14, color: 'rgba(243,234,211,.7)', marginTop: 22 }}>{t.storyQuoteWho}</div>

          <div data-reveal style={{ ...revealInit(reduced, 0.2), display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(24px,4vw,64px)', marginTop: 'clamp(48px,7vh,88px)', maxWidth: 820 }} className="pn-vegan-grid">
            <p style={{ fontSize: 16.5, lineHeight: 1.75, color: 'rgba(243,234,211,.86)', margin: 0 }}>{t.storyP1}</p>
            <p style={{ fontSize: 16.5, lineHeight: 1.75, color: 'rgba(243,234,211,.86)', margin: 0 }}>{t.storyP2}</p>
          </div>
        </div>
      </section>

      {/* ===================== BOLLUR BOARD ===================== */}
      <section id="bollur" style={{ background: INK_DEEP, padding: sectionPad }}>
        <div style={wrap}>
          <div data-reveal style={{ ...revealInit(reduced), display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap', borderTop: `1px solid ${HAIR}`, paddingTop: 16 }}>
            <div style={{ maxWidth: 620 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD }}>{t.bollurKicker}</div>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(34px,4.8vw,64px)', lineHeight: 1.03, margin: '16px 0 0', ...GOLD_TEXT }}>{t.bollurTitle}</h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: DIM, margin: '16px 0 0' }}>{t.bollurIntro}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: GOLD_LIGHT }}>{t.bollurPrice}</div>
              <div style={{ fontSize: 13.5, color: FAINT, marginTop: 6, fontStyle: 'italic', maxWidth: '30ch' }}>{t.bollurSeason}</div>
            </div>
          </div>

          <div className="pn-bollur-grid" data-reveal style={{ ...revealInit(reduced, 0.12), display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 'clamp(40px,6vw,88px)', marginTop: 'clamp(36px,5vh,56px)' }}>
            {BOLLUR.map((b) => (
              <div key={b.name} style={{ padding: '14px 0', borderBottom: '1px solid rgba(243,234,211,.1)' }}>
                <div style={{ fontFamily: DISPLAY, fontSize: 'clamp(18px,1.8vw,22px)', color: GOLD_LIGHT, lineHeight: 1.3 }}>{b.name}</div>
                <div style={{ fontSize: 13.5, color: DIM, marginTop: 3, lineHeight: 1.5 }}>{b.filling[lang]}</div>
              </div>
            ))}
          </div>
          <div data-reveal style={{ ...revealInit(reduced, 0.2), fontSize: 14, color: FAINT, marginTop: 24 }}>{t.bollurBulk}</div>
        </div>
      </section>

      {/* ===================== VEGAN + ONE BIG REVIEW ===================== */}
      <section style={{ background: INK_WARM, padding: sectionPad }}>
        <div style={wrap}>
          <div className="pn-vegan-grid" data-reveal style={{ ...revealInit(reduced), display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 'clamp(28px,5vw,80px)', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD }}>Vegan</div>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(28px,3.2vw,42px)', margin: '16px 0 0', color: GOLD_LIGHT }}>{t.veganTitle}</h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: DIM, margin: '16px 0 0' }}>{t.veganBody}</p>
            </div>
            <figure style={{ margin: 0, borderLeft: `2px solid ${GOLD}`, paddingLeft: 'clamp(20px,3vw,40px)' }}>
              <blockquote style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(26px,3.4vw,46px)', lineHeight: 1.28, color: IVORY }}>
                “{t.veganQuote}”
              </blockquote>
              <figcaption style={{ fontSize: 14, color: FAINT, marginTop: 18 }}>{t.veganWho}</figcaption>
            </figure>
          </div>

          {/* the other two reviews, quiet, in one line */}
          <div data-reveal style={{ ...revealInit(reduced, 0.12), display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(24px,4vw,64px)', marginTop: 'clamp(48px,7vh,84px)', borderTop: `1px solid ${HAIR_SOFT}`, paddingTop: 'clamp(36px,5vh,52px)' }} className="pn-vegan-grid">
            {REVIEWS.filter((r) => r.who !== 'Mia D').slice(0, 2).map((r) => (
              <figure key={r.who} style={{ margin: 0 }}>
                <blockquote style={{ margin: 0, fontSize: 16.5, lineHeight: 1.65, color: 'rgba(243,234,211,.82)' }}>“{r.quote}”</blockquote>
                <figcaption style={{ fontSize: 13.5, color: FAINT, marginTop: 12 }}>{r.who}, {r.when[lang]}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== VISIT STRIP ===================== */}
      <section id="visit" style={{ background: INK, padding: sectionPad }}>
        <div style={wrap}>
          <div className="pn-visit-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,80px)', alignItems: 'start' }}>
            <div data-reveal style={revealInit(reduced)}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD, borderTop: `1px solid ${HAIR}`, paddingTop: 16 }}>{t.visitKicker}</div>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(38px,5vw,72px)', lineHeight: 1.02, margin: '18px 0 0', ...GOLD_TEXT }}>{t.visitTitle}</h2>
              <a href={LINKS.wolt} target="_blank" rel="noreferrer" className="pn-cta pn-cta-gold" style={{ marginTop: 'clamp(24px,4vh,36px)' }}>{t.orderWolt}</a>
              <p style={{ fontSize: 14.5, color: DIM, margin: '18px 0 0', lineHeight: 1.6, maxWidth: '34ch' }}>{t.deliveryNote}</p>
            </div>

            <div data-reveal style={{ ...revealInit(reduced, 0.1), display: 'grid', gap: 26 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: GOLD }}>{t.mainLabel}</div>
                <div style={{ fontFamily: DISPLAY, fontSize: 'clamp(22px,2.4vw,28px)', color: IVORY, marginTop: 8 }}>{t.mainName}</div>
                <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
                  {t.hoursRows.map((l) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, borderBottom: `1px solid ${HAIR_SOFT}`, paddingBottom: 10, fontSize: 14.5, color: DIM }}>
                      <span>{l.split(/\s(.+)/)[0]}</span>
                      <span style={{ color: IVORY }}>{l.split(/\s(.+)/)[1]}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, borderBottom: `1px solid ${HAIR_SOFT}`, paddingBottom: 10 }}>
                    <span style={{ fontSize: 14.5, color: DIM }}>{t.rowPhone}</span>
                    <a href={`tel:${LINKS.phone}`} className="pn-foot-link" style={{ fontSize: 14.5, fontWeight: 600 }}>{LINKS.phoneLabel}</a>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                    <span style={{ fontSize: 14.5, color: DIM }}>{t.rowEmail}</span>
                    <a href={`mailto:${LINKS.email}`} className="pn-foot-link" style={{ fontSize: 14.5, fontWeight: 600, wordBreak: 'break-all' }}>{LINKS.email}</a>
                  </div>
                </div>
              </div>
              <div style={{ borderTop: `1px solid ${HAIR_SOFT}`, paddingTop: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: GOLD }}>{t.counterLabel}</div>
                <div style={{ fontFamily: DISPLAY, fontSize: 'clamp(20px,2vw,24px)', color: IVORY, marginTop: 8 }}>{t.counterName}</div>
                <p style={{ fontSize: 14, color: DIM, margin: '8px 0 0', lineHeight: 1.6 }}>{t.counterNote}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer style={{ background: INK_DEEP, borderTop: `1px solid ${HAIR_SOFT}`, padding: '52px clamp(20px,4.5vw,72px)' }}>
        <div style={{ ...wrap, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 22 }}>
          <div>
            <img src={LOGO} alt="" aria-hidden="true" width={92} height={56} loading="lazy" decoding="async" style={{ width: 92, height: 'auto', display: 'block' }} />
            <div style={{ fontSize: 13, color: FAINT, marginTop: 10 }}>{t.footerTag}</div>
          </div>
          <div style={{ fontSize: 13.5, color: DIM, lineHeight: 1.8, textAlign: 'right' }}>
            <div>{t.mainName} · {LINKS.phoneLabel}</div>
            <div style={{ display: 'flex', gap: 18, justifyContent: 'flex-end', marginTop: 6 }}>
              <a href={LINKS.instagram} target="_blank" rel="noreferrer" className="pn-foot-link">Instagram</a>
              <a href={LINKS.facebook} target="_blank" rel="noreferrer" className="pn-foot-link">Facebook</a>
              <a href={LINKS.wolt} target="_blank" rel="noreferrer" className="pn-foot-link">Wolt</a>
            </div>
          </div>
        </div>
      </footer>

      <PreviewChrome company={company} />
      <PreviewFooter company={company} />
    </div>
  )
}
