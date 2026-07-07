/**
 * Reynir bakari — single-page landing (English-first, IS toggle).
 *
 * Clones the Passion Reykjavík "printed menu / broadsheet" design + palette per
 * the brief (near-black #131313 ground, antique-gold serif, deep burgundy,
 * ivory; Lusitana + Source Serif 4) and re-skins it for Reynir: their real gold
 * script logo, their heritage "hands shaping dough" photo as the cover image,
 * their aha.is prices, and their 1994 family story.
 *
 * Sections: masthead cover (real dough photo bleeding off the right, feathered
 * into the ground) → gold marquee → editorial menu with dotted price leaders →
 * oversized burgundy "from scratch" statement → bread board → cakes & catering
 * + the one real review → two-location visit strip → footer.
 *
 * Motion: hero photo has a gentle scroll-scale (no rotation — it is a scene, not
 * a medallion). Section reveals are IntersectionObserver + CSS transitions.
 */

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { getPreviewCompany } from '../companies'
import { setThemeColor } from '../../lib/preview'
import { T, type Lang, type MenuItem, LOGO, FEATURE_IMG, LINKS, HOURS_BY_DAY, FEATURE, MENU, BREAD, CAKES } from './data'

const company = getPreviewCompany('reynir')

// ── Brand tokens (shared with Passion per the brief) ────────────────────────
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
/** Base box size of the travelling pistachio medallion (scaled via transform). */
const MED_BASE = 440

const GOLD_TEXT = {
  background: `linear-gradient(180deg, ${GOLD_LIGHT} 6%, ${GOLD} 58%, #A98C5F 100%)`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
} as const

const PAGE_CSS = `
  .rb-page ::selection { background:${BURGUNDY}; color:${IVORY}; }
  .rb-page a:focus-visible, .rb-page button:focus-visible {
    outline:2px solid ${GOLD}; outline-offset:3px; border-radius:4px;
  }

  .rb-cover { min-height:100svh; }

  @keyframes rb-rise { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
  .rb-enter  { animation:rb-rise .9s ${EASE} both; }
  .rb-enter-2 { animation:rb-rise .9s ${EASE} .14s both; }
  .rb-enter-3 { animation:rb-rise .9s ${EASE} .26s both; }
  .rb-enter-4 { animation:rb-rise .9s ${EASE} .38s both; }

  @keyframes rb-marquee { from { transform:translateX(0); } to { transform:translateX(-50%); } }
  .rb-marquee-track { display:flex; width:max-content; animation:rb-marquee 36s linear infinite; }

  .rb-navlink { color:${DIM}; text-decoration:none; font-size:14.5px; transition:color .2s ${EASE}; }
  .rb-navlink:hover { color:${GOLD_LIGHT}; }

  .rb-cta {
    display:inline-block; text-decoration:none; font-weight:600; font-size:15.5px;
    padding:14px 30px; border-radius:4px; white-space:nowrap;
    transition:background .25s ${EASE}, color .25s ${EASE}, border-color .25s ${EASE}, transform .18s ${EASE};
  }
  .rb-cta:active { transform:scale(.98); }
  .rb-cta-gold { background:${GOLD}; color:${INK}; border:1px solid ${GOLD}; }
  .rb-cta-gold:hover { background:${GOLD_LIGHT}; border-color:${GOLD_LIGHT}; }
  .rb-cta-ghost { background:transparent; color:${IVORY}; border:1px solid rgba(238,211,170,.34); }
  .rb-cta-ghost:hover { border-color:${GOLD}; background:rgba(238,211,170,.05); }

  .rb-lang { background:none; border:none; cursor:pointer; padding:4px 7px; font-family:${BODY};
    font-size:13px; letter-spacing:.08em; color:${FAINT}; transition:color .2s ${EASE}; border-radius:4px; }
  .rb-lang[aria-pressed="true"] { color:${GOLD_LIGHT}; }
  .rb-lang:hover { color:${IVORY}; }

  .rb-row { transition:color .2s ${EASE}; }
  .rb-row:hover .rb-row-name { color:${GOLD_LIGHT}; }
  .rb-leader { flex:1; align-self:center; height:0; border-bottom:1.5px dotted rgba(238,211,170,.32); margin:0 4px; transform:translateY(2px); }

  .rb-foot-link { color:${DIM}; text-decoration:none; transition:color .2s ${EASE}; }
  .rb-foot-link:hover { color:${GOLD_LIGHT}; }

  .rb-cover-art { position:absolute; top:50%; right:clamp(-30px,0vw,20px); transform:translateY(-50%);
    width:clamp(300px,40vw,${MED_BASE}px); z-index:1; pointer-events:none; display:flex; align-items:center; justify-content:center; }

  @media (max-width:980px) {
    .rb-cover-grid { grid-template-columns:1fr !important; }
    .rb-cover-art { position:static !important; transform:none !important; width:min(62vw,300px) !important; order:-1; margin:0 auto 8px; }
    .rb-cover-copy { text-align:center; align-items:center !important; }
    .rb-cover-meta { justify-content:center !important; }
    .rb-cover-ctas { justify-content:center !important; }
    .rb-menu-cols { grid-template-columns:1fr !important; }
    .rb-feature { grid-template-columns:1fr !important; }
    .rb-feature-art { order:-1; }
    .rb-feature-art > div { width:min(62vw,280px) !important; }
    .rb-bread-grid { grid-template-columns:1fr !important; }
    .rb-catering-grid { grid-template-columns:1fr !important; }
    .rb-visit-grid { grid-template-columns:1fr !important; }
  }
  @media (max-width:620px) {
    .rb-nav-links { display:none !important; }
    .rb-cover-ctas { flex-direction:column; align-items:stretch; }
    .rb-cover-meta { flex-direction:column; gap:6px !important; }
  }
  @media (prefers-reduced-motion: reduce) {
    .rb-enter, .rb-enter-2, .rb-enter-3, .rb-enter-4 { animation:none; }
    .rb-marquee-track { animation:none; }
    .rb-cta { transition:none; }
    .rb-cta:active { transform:none; }
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

/** A menu row with a dotted price leader. */
function MenuRow({ item, lang }: { item: MenuItem; lang: Lang }) {
  return (
    <div className="rb-row" style={{ padding: '20px 0', borderBottom: `1px solid ${HAIR_SOFT}` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span className="rb-row-name" style={{ fontFamily: DISPLAY, fontSize: 'clamp(19px,1.9vw,24px)', color: IVORY, transition: `color .2s ${EASE}` }}>
          {item.name}
          {item.tag && (
            <span style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: GOLD_LIGHT, background: BURGUNDY, padding: '3px 8px', borderRadius: 4, marginLeft: 12, verticalAlign: 'middle' }}>
              {item.tag[lang]}
            </span>
          )}
        </span>
        <span className="rb-leader" aria-hidden="true" />
        <span style={{ fontSize: 16, fontWeight: 600, color: GOLD, whiteSpace: 'nowrap' }}>{item.price}</span>
      </div>
      {item.desc[lang] && <p style={{ fontSize: 14, lineHeight: 1.55, color: DIM, margin: '8px 0 0', maxWidth: '46ch' }}>{item.desc[lang]}</p>}
    </div>
  )
}

export default function ReynirPage() {
  // Default to English on first load; flip to IS with the toggle.
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

  // ── "Follows you down": the pistachio medallion starts as the hero image and,
  // as you scroll, travels down (rotating, shrinking) and settles into the
  // featured-product slot. ONE fixed element, driven purely by page scroll
  // (transform-only, GPU). Desktop + motion only; small screens / reduced-motion
  // show the pistachio statically in both the hero and the feature slot.
  const featPlaceRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<{
    heroCX: number; heroCY: number; heroSize: number
    featCX: number; featTop: number; featSize: number; featEndCY: number; settleY: number
  } | null>(null)
  const [travelReady, setTravelReady] = useState(false)
  const [enableTravel, setEnableTravel] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)')
    const upd = () => setEnableTravel(!reduced && mq.matches)
    upd()
    mq.addEventListener('change', upd)
    return () => mq.removeEventListener('change', upd)
  }, [reduced])

  useLayoutEffect(() => {
    if (!enableTravel) {
      anchorRef.current = null
      setTravelReady(false)
      return
    }
    const measure = () => {
      const f = featPlaceRef.current
      if (!f) return
      const sy = window.scrollY
      const sx = window.scrollX
      const vw = window.innerWidth
      const vh = window.innerHeight
      const fr = f.getBoundingClientRect()
      // Hero start: big, centered-right in the viewport (bleeds slightly off).
      const heroSize = Math.min(vw * 0.42, 460)
      const heroCX = vw - heroSize * 0.45
      const heroCY = vh * 0.5
      const featSize = fr.width
      const featTop = fr.top + sy
      const featCX = fr.left + sx + featSize / 2
      const settleY = Math.max(1, featTop + featSize / 2 - vh * 0.46)
      const featEndCY = featTop + featSize / 2 - settleY // viewport center when settled (≈ 0.46·vh)
      anchorRef.current = { heroCX, heroCY, heroSize, featCX, featTop, featSize, featEndCY, settleY }
      setTravelReady(true)
    }
    measure()
    const t1 = window.setTimeout(measure, 300)
    const t2 = window.setTimeout(measure, 900)
    window.addEventListener('resize', measure)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.removeEventListener('resize', measure)
    }
  }, [enableTravel, lang])

  const { scrollY } = useScroll()
  const travelTransform = useTransform(scrollY, (y) => {
    const a = anchorRef.current
    if (!a) return 'translate3d(-9999px,-9999px,0)'
    const p = Math.min(Math.max(y / a.settleY, 0), 1)
    const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2 // easeInOutCubic
    let cx: number
    let cy: number
    let size: number
    if (y <= a.settleY) {
      cx = a.heroCX + (a.featCX - a.heroCX) * e
      cy = a.heroCY + (a.featEndCY - a.heroCY) * e
      size = a.heroSize + (a.featSize - a.heroSize) * e
    } else {
      cx = a.featCX
      cy = a.featTop + a.featSize / 2 - y // track the slot as it scrolls past
      size = a.featSize
    }
    const s = size / MED_BASE
    const tx = cx - MED_BASE / 2
    const ty = cy - MED_BASE / 2
    const r = e * 300
    return `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${s.toFixed(4)}) rotate(${r.toFixed(1)}deg)`
  })

  const marqueeItems = useMemo(
    () => ['Vínarbrauð', 'Súrdeigsbrauð', 'Snúður', 'Kanillengja', 'Pistasíusnúður', 'Kleina', 'Rúgbrauð', 'Skúffukaka'],
    [],
  )

  const sectionPad = 'clamp(80px,11vh,140px) clamp(20px,4.5vw,72px)'
  const wrap = { maxWidth: 1180, margin: '0 auto' } as const

  return (
    <div
      ref={rootRef}
      className="rb-page"
      lang={lang}
      style={{ fontFamily: BODY, color: IVORY, background: INK, overflowX: 'hidden', WebkitFontSmoothing: 'antialiased' }}
    >
      <style>{PAGE_CSS}</style>

      {/* ===================== MASTHEAD ===================== */}
      <header style={{ position: 'relative', zIndex: 5, padding: '20px clamp(20px,4.5vw,72px) 0' }}>
        <div style={{ ...wrap, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <img src={LOGO} alt="Reynir bakari" width={132} height={57} decoding="async" style={{ width: 132, height: 'auto', display: 'block' }} />
          <nav className="rb-nav-links" style={{ display: 'flex', gap: 26, alignItems: 'center' }}>
            <a href="#menu" className="rb-navlink">{t.navMenu}</a>
            <a href="#bread" className="rb-navlink">{t.navBread}</a>
            <a href="#story" className="rb-navlink">{t.navStory}</a>
            <a href="#visit" className="rb-navlink">{t.navVisit}</a>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div role="group" aria-label="Language" style={{ display: 'flex', gap: 2 }}>
              <button className="rb-lang" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
              <span aria-hidden="true" style={{ color: FAINT, alignSelf: 'center' }}>/</span>
              <button className="rb-lang" aria-pressed={lang === 'is'} onClick={() => setLang('is')}>ÍS</button>
            </div>
          </div>
        </div>
      </header>

      {/* ===================== COVER ===================== */}
      <section className="rb-cover" style={{ position: 'relative', display: 'flex', flexDirection: 'column', padding: '0 clamp(20px,4.5vw,72px)' }}>
        <div className="rb-cover-grid" style={{ ...wrap, flex: 1, width: '100%', display: 'grid', gridTemplateColumns: '1fr', alignItems: 'center', position: 'relative', padding: 'clamp(24px,5vh,56px) 0' }}>
          {/* the pistachio snúður starts here. On desktop it's an invisible sizer
              (the fixed travelling medallion overlays it and then scrolls down to
              the featured slot); on mobile / reduced-motion it's a static image. */}
          <div className="rb-cover-art rb-enter-3">
            {enableTravel ? (
              <div aria-hidden="true" style={{ width: '100%', aspectRatio: '1 / 1' }} />
            ) : (
              <img
                src={FEATURE_IMG}
                alt={lang === 'en' ? 'A Reynir pistachio snúður, glazed and topped with pistachios' : 'Pistasíusnúður frá Reyni, gljáður og toppaður með pistasíum'}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            )}
          </div>

          <div className="rb-cover-copy" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: 640, position: 'relative', zIndex: 2 }}>
            <div className="rb-cover-meta rb-enter" style={{ display: 'flex', gap: 18, alignItems: 'center', fontSize: 12.5, letterSpacing: '.14em', textTransform: 'uppercase', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: GOLD }}>
                <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: status.open ? '#8FA876' : GOLD }} />
                {status.label}
              </span>
            </div>

            <h1 className="rb-enter-2" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(54px, 9.5vw, 134px)', lineHeight: 0.98, letterSpacing: '.02em', margin: 'clamp(16px,3vh,30px) 0 0', ...GOLD_TEXT }}>
              {t.heroTitle}
            </h1>

            <p className="rb-enter-3" style={{ fontStyle: 'italic', fontSize: 'clamp(17px,1.9vw,23px)', color: IVORY, margin: 'clamp(16px,2.5vh,24px) 0 0', lineHeight: 1.5, maxWidth: '30ch' }}>
              {t.heroSub}
            </p>
            <p className="rb-enter-3" style={{ fontSize: 'clamp(14.5px,1.2vw,16px)', color: DIM, margin: '12px 0 0', maxWidth: '40ch', lineHeight: 1.6 }}>
              {t.heroLine}
            </p>

            <div className="rb-cover-ctas rb-enter-4" style={{ display: 'flex', gap: 14, marginTop: 'clamp(24px,3.5vh,36px)' }}>
              <a href={LINKS.order} target="_blank" rel="noreferrer" className="rb-cta rb-cta-gold">{t.orderPrimary}</a>
              <a href="#menu" className="rb-cta rb-cta-ghost">{t.ctaMenu}</a>
            </div>
          </div>
        </div>

        {/* gold marquee of the day's bakes */}
        <div style={{ borderTop: `1px solid ${HAIR}`, borderBottom: `1px solid ${HAIR}`, padding: '18px 0', overflow: 'hidden', position: 'relative', zIndex: 2 }}>
          <div className="rb-marquee-track" aria-hidden="true">
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

      {/* ===================== THE MENU ===================== */}
      <section id="menu" style={{ background: INK, borderTop: `1px solid ${HAIR_SOFT}`, padding: sectionPad }}>
        <div style={wrap}>
          <div data-reveal style={revealInit(reduced)}>
            <div style={{ borderTop: `1px solid ${HAIR}`, paddingTop: 16, fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD }}>{t.menuMasthead}</div>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(34px,4.6vw,62px)', lineHeight: 1.03, margin: '18px 0 0', ...GOLD_TEXT }}>{t.ovenTitle}</h2>
            <p style={{ fontSize: 16, color: DIM, margin: '16px 0 0', maxWidth: '52ch', lineHeight: 1.65 }}>{t.ovenIntro}</p>
          </div>

          {/* featured item — the signature pistachio snúður. Its medallion is the
              one that started in the hero and travelled down here on scroll; this
              slot is the landing place (an invisible sizer the fixed medallion
              settles onto). On mobile / reduced-motion it's a static image. */}
          <div
            data-reveal
            className="rb-feature"
            style={{
              ...revealInit(reduced, 0.1),
              marginTop: 'clamp(40px,6vh,68px)',
              borderTop: `1px solid ${HAIR_SOFT}`,
              borderBottom: `1px solid ${HAIR_SOFT}`,
              padding: 'clamp(32px,5vh,52px) 0',
              display: 'grid',
              gridTemplateColumns: '1fr 0.85fr',
              gap: 'clamp(24px,4vw,64px)',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD }}>{t.featuredLabel}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, flexWrap: 'wrap', marginTop: 14 }}>
                <h3 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(34px,5vw,64px)', margin: 0, ...GOLD_TEXT }}>{FEATURE.name}</h3>
                <span style={{ fontSize: 22, fontWeight: 600, color: GOLD }}>{FEATURE.price}</span>
              </div>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: DIM, margin: '16px 0 0', maxWidth: '46ch' }}>{FEATURE.desc[lang]}</p>
            </div>
            <div className="rb-feature-art" style={{ display: 'flex', justifyContent: 'center' }}>
              <div ref={featPlaceRef} style={{ width: 'min(100%, 380px)', aspectRatio: '1 / 1' }}>
                {!enableTravel && (
                  <img
                    src={FEATURE_IMG}
                    alt={lang === 'en' ? 'A Reynir pistachio snúður, glazed and topped with pistachios, from above' : 'Pistasíusnúður frá Reyni, gljáður og toppaður með pistasíum, ofan frá'}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* the menu, as an editorial list with dotted price leaders */}
          <div className="rb-menu-cols" data-reveal style={{ ...revealInit(reduced, 0.12), display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 'clamp(40px,6vw,88px)', rowGap: 0, marginTop: 'clamp(36px,5vh,56px)' }}>
            {MENU.map((item) => (
              <MenuRow key={item.name} item={item} lang={lang} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== STATEMENT (burgundy) ===================== */}
      <section id="story" style={{ background: BURGUNDY, padding: 'clamp(96px,15vh,180px) clamp(20px,4.5vw,72px)' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div data-reveal style={{ ...revealInit(reduced), fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD_LIGHT }}>
            {t.statementKicker}
          </div>
          <blockquote data-reveal style={{ ...revealInit(reduced, 0.08), fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(34px,5.4vw,76px)', lineHeight: 1.12, letterSpacing: '.005em', color: IVORY, margin: '24px 0 0' }}>
            “{t.statementQuote}”
          </blockquote>
          <div data-reveal style={{ ...revealInit(reduced, 0.14), fontSize: 14, color: 'rgba(243,234,211,.7)', marginTop: 22 }}>{t.statementWho}</div>

          <div data-reveal style={{ ...revealInit(reduced, 0.2), display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(24px,4vw,64px)', marginTop: 'clamp(48px,7vh,88px)', maxWidth: 820 }} className="rb-catering-grid">
            <p style={{ fontSize: 16.5, lineHeight: 1.75, color: 'rgba(243,234,211,.86)', margin: 0 }}>{t.storyP1}</p>
            <p style={{ fontSize: 16.5, lineHeight: 1.75, color: 'rgba(243,234,211,.86)', margin: 0 }}>{t.storyP2}</p>
          </div>
        </div>
      </section>

      {/* ===================== BREAD BOARD ===================== */}
      <section id="bread" style={{ background: INK_DEEP, padding: sectionPad }}>
        <div style={wrap}>
          <div data-reveal style={{ ...revealInit(reduced), display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap', borderTop: `1px solid ${HAIR}`, paddingTop: 16 }}>
            <div style={{ maxWidth: 620 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD }}>{t.breadKicker}</div>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(34px,4.8vw,64px)', lineHeight: 1.03, margin: '16px 0 0', ...GOLD_TEXT }}>{t.breadTitle}</h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: DIM, margin: '16px 0 0' }}>{t.breadIntro}</p>
            </div>
            <div style={{ fontSize: 13.5, color: FAINT, fontStyle: 'italic' }}>{t.breadNote}</div>
          </div>

          <div className="rb-bread-grid" data-reveal style={{ ...revealInit(reduced, 0.12), display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 'clamp(40px,6vw,88px)', marginTop: 'clamp(36px,5vh,56px)' }}>
            {BREAD.map((b) => (
              <div key={b.name} style={{ padding: '16px 0', borderBottom: '1px solid rgba(243,234,211,.1)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontFamily: DISPLAY, fontSize: 'clamp(18px,1.8vw,22px)', color: GOLD_LIGHT, lineHeight: 1.3 }}>{b.name}</span>
                  <span className="rb-leader" aria-hidden="true" />
                  <span style={{ fontSize: 15, fontWeight: 600, color: GOLD, whiteSpace: 'nowrap' }}>{b.price}</span>
                </div>
                <div style={{ fontSize: 13.5, color: DIM, marginTop: 5, lineHeight: 1.5 }}>{b.desc[lang]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CAKES & CATERING + REVIEW ===================== */}
      <section style={{ background: INK_WARM, padding: sectionPad }}>
        <div style={wrap}>
          <div className="rb-catering-grid" data-reveal style={{ ...revealInit(reduced), display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(28px,5vw,80px)', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD }}>{t.cateringKicker}</div>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(30px,3.6vw,50px)', margin: '16px 0 0', ...GOLD_TEXT }}>{t.cateringTitle}</h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: DIM, margin: '16px 0 0', maxWidth: '46ch' }}>{t.cateringBody}</p>
              <a href={`mailto:${LINKS.orderEmail}`} className="rb-cta rb-cta-ghost" style={{ marginTop: 'clamp(20px,3vh,28px)' }}>{t.cateringCta}</a>
            </div>
            <div>
              {/* real celebration-cake prices, as a compact list */}
              <div style={{ display: 'grid', gap: 0 }}>
                {CAKES.map((c) => (
                  <div key={c.name} style={{ display: 'flex', alignItems: 'baseline', gap: 4, padding: '13px 0', borderBottom: `1px solid ${HAIR_SOFT}` }}>
                    <span style={{ fontFamily: DISPLAY, fontSize: 'clamp(18px,1.8vw,22px)', color: IVORY }}>{c.name}</span>
                    <span className="rb-leader" aria-hidden="true" />
                    <span style={{ fontSize: 15, fontWeight: 600, color: GOLD, whiteSpace: 'nowrap' }}>{c.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* the one real review + trust line */}
          <figure data-reveal style={{ ...revealInit(reduced, 0.14), margin: '0', marginTop: 'clamp(48px,7vh,84px)', borderTop: `1px solid ${HAIR_SOFT}`, paddingTop: 'clamp(36px,5vh,52px)', textAlign: 'center' }}>
            <blockquote style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(28px,4vw,52px)', lineHeight: 1.2, color: IVORY }}>
              “{t.reviewQuote}”
            </blockquote>
            <figcaption style={{ fontSize: 14, color: FAINT, marginTop: 16 }}>{t.reviewWho}</figcaption>
            <div style={{ fontSize: 13.5, color: DIM, marginTop: 18 }}>{t.trustLine}</div>
          </figure>
        </div>
      </section>

      {/* ===================== VISIT STRIP ===================== */}
      <section id="visit" style={{ background: INK, padding: sectionPad }}>
        <div style={wrap}>
          <div className="rb-visit-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,80px)', alignItems: 'start' }}>
            <div data-reveal style={revealInit(reduced)}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD, borderTop: `1px solid ${HAIR}`, paddingTop: 16 }}>{t.visitKicker}</div>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(38px,5vw,72px)', lineHeight: 1.02, margin: '18px 0 0', ...GOLD_TEXT }}>{t.visitTitle}</h2>
              <a href={LINKS.order} target="_blank" rel="noreferrer" className="rb-cta rb-cta-gold" style={{ marginTop: 'clamp(24px,4vh,36px)' }}>{t.orderPrimary}</a>
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
                    <a href={`tel:${LINKS.phone}`} className="rb-foot-link" style={{ fontSize: 14.5, fontWeight: 600 }}>{LINKS.phoneLabel}</a>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                    <span style={{ fontSize: 14.5, color: DIM }}>{t.rowEmail}</span>
                    <a href={`mailto:${LINKS.email}`} className="rb-foot-link" style={{ fontSize: 14.5, fontWeight: 600, wordBreak: 'break-all' }}>{LINKS.email}</a>
                  </div>
                </div>
              </div>
              <div style={{ borderTop: `1px solid ${HAIR_SOFT}`, paddingTop: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: GOLD }}>{t.secondLabel}</div>
                <div style={{ fontFamily: DISPLAY, fontSize: 'clamp(20px,2vw,24px)', color: IVORY, marginTop: 8 }}>{t.secondName}</div>
                <p style={{ fontSize: 14, color: DIM, margin: '8px 0 0', lineHeight: 1.6 }}>{t.secondNote}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer style={{ background: INK_DEEP, borderTop: `1px solid ${HAIR_SOFT}`, padding: '52px clamp(20px,4.5vw,72px)' }}>
        <div style={{ ...wrap, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 22 }}>
          <div>
            <img src={LOGO} alt="" aria-hidden="true" width={120} height={52} loading="lazy" decoding="async" style={{ width: 120, height: 'auto', display: 'block' }} />
            <div style={{ fontSize: 13, color: FAINT, marginTop: 12 }}>{t.footerTag}</div>
          </div>
          <div style={{ fontSize: 13.5, color: DIM, lineHeight: 1.8, textAlign: 'right' }}>
            <div>{t.mainName} · {LINKS.phoneLabel}</div>
            <div style={{ display: 'flex', gap: 18, justifyContent: 'flex-end', marginTop: 6 }}>
              <a href={LINKS.instagram} target="_blank" rel="noreferrer" className="rb-foot-link">Instagram</a>
              <a href={LINKS.facebook} target="_blank" rel="noreferrer" className="rb-foot-link">Facebook</a>
              <a href={LINKS.order} target="_blank" rel="noreferrer" className="rb-foot-link">aha.is</a>
            </div>
          </div>
        </div>
      </footer>

      {/* the travelling pistachio medallion — fixed to the viewport, its
          transform driven by scroll (hero → featured slot). Desktop + motion. */}
      {enableTravel && (
        <motion.div
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: MED_BASE,
            height: MED_BASE,
            transformOrigin: '50% 50%',
            transform: travelTransform,
            zIndex: 3,
            pointerEvents: 'none',
            willChange: 'transform',
            opacity: travelReady ? 1 : 0,
            transition: 'opacity .45s ease',
          }}
        >
          <img src={FEATURE_IMG} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
        </motion.div>
      )}

      <PreviewChrome company={company} />
      <PreviewFooter company={company} />
    </div>
  )
}
