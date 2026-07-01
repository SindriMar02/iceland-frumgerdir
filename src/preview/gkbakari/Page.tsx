/**
 * GK Bakarí — single-page landing.
 *
 * Reuses the Faxi Bakery Café design system verbatim (volcanic-black / moss-green
 * / cream palette, Bricolage Grotesque display + Caveat script + Hanken Grotesk
 * body, TextPressure headline, steam, scroll-linked hero motion, IntersectionObserver
 * reveals) — content rebuilt from GK Bakarí's own real, sourced facts:
 *   - Live "open now / closes at" status computed from their real weekly hours
 *     (replaces Faxi's "next batch in MM:SS", which was specific to a verified
 *     hourly-bake claim this bakery doesn't make)
 *   - Hero shows a real sourced photo of glossy iced cinnamon rolls (kanilsnúður
 *     is a real, priced menu item) in a framed card rather than Faxi's seamless
 *     cream-matched cutout (no isolated-background source photo exists for GK)
 *   - Two menu items with no honest matching stock photo render as photo-light
 *     typographic cards instead of a mismatched image
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Img } from '../../components/Img'
import TextPressure from '../../components/TextPressure'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { getPreviewCompany } from '../companies'
import { setThemeColor } from '../../lib/preview'
import { IMAGES, FALLBACK, LOGO, MENU, STATS, HOURS_BY_DAY, VISIT } from './data'

const company = getPreviewCompany('gkbakari')

// ── Design tokens — identical to Faxi Bakery Café ───────────────────────────
const CREAM = '#F1E4CE'
const CREAM_LIGHT = '#FAF3E4'
const INK = '#1B1712'
const MOSS = '#4C5A41'
const MOSS_LIGHT = '#A7B197'
const SAND = '#D7CDB6'
const CARAMEL = '#C2773A'
const HERO_BG = CREAM
const FB = VISIT.facebook
const BRICOLAGE_VF =
  'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap'

const EASE = 'cubic-bezier(.16,.84,.44,1)'
const STEAM = { warmth: '#FBE6C6', opacity: 0.18, spread: 520, speed: 1, wisps: 9 }

const PAGE_CSS = `
  .gk-page ::selection { background:${MOSS}; color:${CREAM_LIGHT}; }
  .gk-headline { letter-spacing:-.03em; display:flex !important; justify-content:center; align-items:baseline; }

  .gk-hero { min-height:100vh; min-height:100svh; }

  @keyframes gk-steamA {
    0%   { opacity:0; transform:translate(0,8px) scaleX(.65) scaleY(.85); }
    14%  { opacity:1; }
    45%  { transform:translate(-12px,-52px) scaleX(1.25) scaleY(1.05); }
    72%  { opacity:.55; }
    100% { opacity:0; transform:translate(10px,-136px) scaleX(2.1) scaleY(1.35); }
  }
  @keyframes gk-steamB {
    0%   { opacity:0; transform:translate(0,8px) scaleX(.7) scaleY(.9); }
    16%  { opacity:1; }
    48%  { transform:translate(14px,-58px) scaleX(1.3) scaleY(1.08); }
    74%  { opacity:.5; }
    100% { opacity:0; transform:translate(-9px,-142px) scaleX(2) scaleY(1.4); }
  }

  .gk-navlink { color:${INK}; text-decoration:none; transition:color .2s ${EASE}; }
  .gk-navlink:hover { color:${MOSS}; }

  .gk-fb { transition:background .25s ${EASE}, color .25s ${EASE}, border-color .25s ${EASE}; }
  .gk-fb:hover { background:${MOSS}; color:${CREAM_LIGHT}; border-color:${MOSS}; }

  .gk-cta-primary { transition:background .25s ${EASE}; }
  .gk-cta-primary:hover { background:${MOSS}; }
  .gk-cta-ghost { transition:background .25s ${EASE}, border-color .25s ${EASE}; }
  .gk-cta-ghost:hover { background:#fff; border-color:${INK}; }

  .gk-card { transition:transform .8s ${EASE}, box-shadow .8s ${EASE}; will-change:transform; }
  .gk-card:hover { transform:translateY(-6px); box-shadow:0 22px 44px #1B171218; }

  .gk-visit-cta { transition:background .25s ${EASE}, color .25s ${EASE}; }
  .gk-visit-cta:hover { background:${CARAMEL}; color:#fff; }

  .gk-footer-link { transition:color .2s ${EASE}; }
  .gk-footer-link:hover { color:${CARAMEL}; }

  @media (max-width:860px) {
    .gk-story-grid, .gk-visit-grid { grid-template-columns:1fr !important; }
    .gk-visit-img { order:-1; }
    .gk-stat-strip { grid-template-columns:repeat(2,1fr) !important; row-gap:30px !important; }
  }
  @media (max-width:560px) {
    .gk-nav { grid-template-columns:auto 1fr !important; }
    .gk-nav-links { display:none !important; }
    .gk-herofoot { flex-direction:column; align-items:flex-start !important; gap:12px; }
    .gk-hours { text-align:left !important; }
  }
  @media (prefers-reduced-motion: reduce) {
    .gk-card { transition:none; }
  }
`

function Steam({ reduced }: { reduced: boolean }) {
  const wisps = useMemo(() => {
    const { warmth, spread, speed, wisps: n } = STEAM
    void spread
    const rnd = (i: number, s: number) => {
      const x = Math.sin((i + 1) * 12.9898 + s * 78.233) * 43758.5453
      return x - Math.floor(x)
    }
    const out = []
    for (let i = 0; i < n; i++) {
      const leftPct = ((i + 0.5) / n) * 100 + (rnd(i, 1) - 0.5) * (60 / n)
      const w = 14 + rnd(i, 2) * 26
      const h = 64 + rnd(i, 3) * 78
      const dur = (4.4 + rnd(i, 4) * 3.2) / speed
      const delay = -rnd(i, 5) * dur
      const blur = 6 + rnd(i, 6) * 6
      const name = i % 2 ? 'gk-steamA' : 'gk-steamB'
      out.push(
        <span
          key={i}
          style={{
            position: 'absolute',
            bottom: 0,
            left: leftPct + '%',
            width: w.toFixed(0) + 'px',
            height: h.toFixed(0) + 'px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${warmth} 0%, rgba(255,255,255,0) 72%)`,
            filter: `blur(${blur.toFixed(1)}px)`,
            animation: `${name} ${dur.toFixed(2)}s ease-in-out ${delay.toFixed(2)}s infinite`,
            willChange: 'transform, opacity',
          }}
        />,
      )
    }
    return out
  }, [])

  if (reduced) return null
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        left: '50%',
        bottom: '38%',
        transform: 'translateX(-50%)',
        width: STEAM.spread + 'px',
        maxWidth: '92vw',
        height: 160,
        opacity: STEAM.opacity,
        zIndex: 2,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
      }}
    >
      {wisps}
    </div>
  )
}

const revealInit = (reduced: boolean, delay = 0, dur = 0.9) =>
  reduced
    ? {}
    : {
        opacity: 0,
        transform: 'translateY(40px)',
        transition: `opacity ${dur}s ${EASE} ${delay}s, transform ${dur}s ${EASE} ${delay}s`,
      }

const pad2 = (n: number) => String(n).padStart(2, '0')
const fmtHM = (mins: number) => `${Math.floor(mins / 60)}:${pad2(mins % 60)}`

/** Iceland has no DST, so UTC clock fields already equal Iceland local time. */
function openStatus(now: number) {
  const d = new Date(now)
  const day = d.getUTCDay()
  const mins = d.getUTCHours() * 60 + d.getUTCMinutes()
  const today = HOURS_BY_DAY[day]
  if (mins >= today.open && mins < today.close) {
    return { open: true, label: `Open now — closes ${fmtHM(today.close)}` }
  }
  if (mins < today.open) {
    return { open: false, label: `Closed — opens today at ${fmtHM(today.open)}` }
  }
  const tomorrow = HOURS_BY_DAY[(day + 1) % 7]
  return { open: false, label: `Closed — opens tomorrow at ${fmtHM(tomorrow.open)}` }
}

export default function GkBakariPage() {
  const reduced = useReducedMotion() ?? false
  const rootRef = useRef<HTMLDivElement>(null)

  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 30000)
    return () => window.clearInterval(t)
  }, [])
  const status = useMemo(() => openStatus(now), [now])

  useEffect(() => {
    setThemeColor(CREAM)
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
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    root.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [reduced])

  // Scroll-linked spin: the hero roll slowly turns as the hero scrolls past.
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const rollSpin = useSpring(useTransform(scrollYProgress, [0, 1], [0, 214]), {
    stiffness: 90,
    damping: 22,
    mass: 0.4,
  })
  const rollScale = useTransform(scrollYProgress, [0, 1], [1, 1.07])
  const rollLift = useTransform(scrollYProgress, [0, 1], [0, -36])

  return (
    <div
      ref={rootRef}
      className="gk-page"
      lang="en"
      style={{
        fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
        color: INK,
        background: CREAM,
        overflowX: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{PAGE_CSS}</style>

      {/* ===================== HERO ===================== */}
      <section
        ref={heroRef}
        className="gk-hero"
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          padding: '26px clamp(20px,4vw,56px) 0',
          background: HERO_BG,
        }}
      >
        <nav
          className="gk-nav"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: 16,
            position: 'relative',
            zIndex: 5,
          }}
        >
          <div
            className="gk-nav-links"
            style={{ display: 'flex', gap: 26, alignItems: 'center', fontSize: 15, fontWeight: 600, letterSpacing: '.01em' }}
          >
            <a href="#menu" className="gk-navlink">Menu</a>
            <a href="#story" className="gk-navlink">Story</a>
            <a href="#visit" className="gk-navlink">Visit</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <img
              src={LOGO}
              alt="GK Bakarí logo — a gold hand-drawn cinnamon roll behind a GK monogram"
              width={46}
              height={46}
              decoding="async"
              style={{ width: 46, height: 46, borderRadius: '50%', display: 'block', boxShadow: '0 4px 14px #1B171226', border: '2px solid #FAF3E4' }}
            />
            <div style={{ textAlign: 'left', lineHeight: 0.9 }}>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: '-.02em' }}>GK</div>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.32em', color: MOSS, marginTop: 3 }}>BAKARÍ&nbsp;·&nbsp;SELFOSS</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, alignItems: 'center' }}>
            <a
              href={FB}
              target="_blank"
              rel="noreferrer"
              className="gk-fb"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: INK, border: '1.5px solid #1B171225', borderRadius: 100, padding: '8px 15px', fontSize: 13, fontWeight: 600 }}
            >
              {VISIT.facebookHandle}<span style={{ fontSize: 11 }}>↗</span>
            </a>
          </div>
        </nav>

        {/* live open/closed status, replacing Faxi's hourly-bake countdown */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'clamp(18px,3vh,34px)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: 12.5, fontWeight: 700, letterSpacing: '.12em', color: MOSS, textTransform: 'uppercase' }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: status.open ? '#4C8A5A' : CARAMEL,
                display: 'inline-block',
                boxShadow: status.open ? '0 0 0 4px #4C8A5A22' : '0 0 0 4px #C2773A22',
              }}
            />
            {status.label}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'clamp(10px,2vh,22px)', position: 'relative', zIndex: 4 }}>
          {reduced ? (
            <h1 className="gk-headline" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 'clamp(40px,9vw,132px)', lineHeight: 0.9, letterSpacing: '-.035em', margin: 0, color: INK, whiteSpace: 'nowrap' }}>KANILSNÚÐUR</h1>
          ) : (
            /* TextPressure sizes glyphs at containerW/(chars/2); KANILSNÚÐUR is 11
               chars vs Faxi's 13, so the container is scaled by 11/13 to keep the
               rendered glyph size (and the height clamp) identical to the design. */
            <div style={{ width: 'min(57vw,760px)', margin: '0 auto', height: 'clamp(46px,8.4vw,122px)' }}>
                <TextPressure
                  text={'KANILSNÚÐUR'}
                  fontFamily="Bricolage Grotesque"
                  fontUrl={BRICOLAGE_VF}
                  className="gk-headline"
                  flex={false}
                  width={false}
                  weight
                  italic={false}
                  alpha={false}
                  minWeight={800}
                  maxWeight={0}
                  scaleAmount={1.3}
                  initialFromCenter={false}
                  textColor={INK}
                  minFontSize={36}
                />
            </div>
          )}
          <div style={{ fontFamily: "'Caveat', cursive", fontWeight: 700, fontSize: 'clamp(28px,5.4vw,74px)', color: MOSS, lineHeight: 0.7, marginTop: '-.06em', transform: 'rotate(-3deg)' }}>freshly baked, freshly ground</div>
        </div>

        <div style={{ position: 'relative', flex: 1, minHeight: 'clamp(320px,46vh,560px)', marginTop: 'clamp(14px,2vh,26px)' }}>
          <div style={{ position: 'absolute', top: '6%', left: '50%', transform: 'translateX(-50%)', zIndex: 4, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href={VISIT.wolt} target="_blank" rel="noreferrer" className="gk-cta-primary" style={{ background: INK, color: CREAM_LIGHT, textDecoration: 'none', fontWeight: 600, fontSize: 16, padding: '15px 30px', borderRadius: 100, boxShadow: '0 10px 30px #1B171233' }}>Order ahead on Wolt</a>
            <a href="#menu" className="gk-cta-ghost" style={{ background: '#FFFFFFcc', color: INK, textDecoration: 'none', fontWeight: 600, fontSize: 16, padding: '15px 30px', borderRadius: 100, border: '1.5px solid #1B171222', backdropFilter: 'blur(4px)' }}>See the menu</a>
          </div>

          <Steam reduced={reduced} />

          {/* hero photo — crisp, unfeathered. Its own cream background is the
              exact same tone as the page (CREAM), so the square edges dissolve
              into the page while the roll stays sharp. */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 0,
              transform: 'translateX(-50%)',
              width: 'clamp(250px,37vw,460px)',
              zIndex: 1,
            }}
          >
            <motion.div
              style={{
                aspectRatio: '1 / 1',
                rotate: reduced ? 0 : rollSpin,
                scale: reduced ? 1 : rollScale,
                y: reduced ? 0 : rollLift,
                transformOrigin: '50% 46%',
                willChange: 'transform',
              }}
            >
              <img
                src={IMAGES.hero}
                alt="A single cinnamon roll (kanilsnúður), fresh from the oven — golden laminated layers dusted with cinnamon sugar"
                decoding="async"
                {...{ fetchpriority: 'high' }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </motion.div>
          </div>
        </div>

        <div className="gk-herofoot" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, padding: '0 0 26px', position: 'relative', zIndex: 4 }}>
          <div style={{ maxWidth: 340 }}>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 'clamp(18px,2vw,23px)', lineHeight: 1.05, letterSpacing: '-.01em' }}>Baked in Selfoss, for Selfoss.</div>
            <div style={{ fontSize: 13.5, color: '#1B1712aa', marginTop: 7, lineHeight: 1.45 }}>On Austurvegur, right where the Ring Road runs through town. Fresh bread from seven, coffee ground for every cup, and a seat if you want to stay.</div>
          </div>
          <div className="gk-hours" style={{ textAlign: 'right', fontSize: 12.5, fontWeight: 600, letterSpacing: '.1em', color: MOSS, textTransform: 'uppercase', lineHeight: 1.6, whiteSpace: 'nowrap' }}>
            {VISIT.hoursLines.map((l) => <div key={l}>{l}</div>)}
          </div>
        </div>
      </section>

      {/* ===================== STORY ===================== */}
      <section id="story" style={{ background: INK, color: CREAM_LIGHT, padding: 'clamp(70px,11vh,140px) clamp(20px,4vw,72px)' }}>
        <div data-reveal style={{ ...revealInit(reduced), maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, fontWeight: 700, letterSpacing: '.24em', color: MOSS_LIGHT, textTransform: 'uppercase' }}>
            <span style={{ width: 34, height: 1.5, background: MOSS_LIGHT }} />The Story
          </div>
          <div className="gk-story-grid" style={{ display: 'grid', gridTemplateColumns: '1.15fr .85fr', gap: 'clamp(28px,5vw,80px)', alignItems: 'center', marginTop: 34 }}>
            <div>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 'clamp(34px,4.6vw,68px)', lineHeight: 1, letterSpacing: '-.025em', margin: 0 }}>
                A gathering place,<br />baked by <span style={{ color: CARAMEL }}>two friends</span>.
              </h2>
              <p style={{ fontSize: 'clamp(15px,1.3vw,18px)', lineHeight: 1.65, color: '#F6F0E3cc', maxWidth: '48ch', margin: '24px 0 0' }}>
                Guðmundur baked at Brauð &amp; Co in Reykjavík. Kjartan learned his craft in an IKEA bakery. In January 2020 we opened our own doors in{' '}
                <em style={{ fontStyle: 'normal', color: '#fff', borderBottom: `2px solid ${CARAMEL}` }}>Kjartan's hometown of Selfoss</em> — not just a bakery, but the gathering place a town like this deserves.
              </p>
              <p style={{ fontSize: 'clamp(15px,1.3vw,18px)', lineHeight: 1.65, color: '#F6F0E3cc', maxWidth: '48ch', margin: '18px 0 0' }}>
                Traditional Icelandic bakes next to real espresso and a daily pot of soup, with ingredients from South Iceland producers like Korngrís and Ártangi.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ aspectRatio: '4 / 5', borderRadius: 20, overflow: 'hidden' }}>
                <Img src={IMAGES.hands} alt="A baker's hands shaping a ball of dough on a floured counter" fallbackClassName={FALLBACK.card} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ aspectRatio: '16 / 10', borderRadius: 20, overflow: 'hidden' }}>
                <Img src={IMAGES.counter} alt="A wood-framed glass bakery case with handwritten labels" fallbackClassName={FALLBACK.card} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            </div>
          </div>

          <div data-reveal className="gk-stat-strip" style={{ ...revealInit(reduced, 0.15), display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginTop: 'clamp(48px,7vh,90px)', borderTop: '1px solid #F6F0E322', paddingTop: 36 }}>
            {STATS.map((s) => (
              <div key={s.caption}>
                <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 'clamp(30px,4vw,52px)', letterSpacing: '-.02em' }}>{s.value}</div>
                <div style={{ fontSize: 13, color: MOSS_LIGHT, marginTop: 4 }}>{s.caption}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== MENU ===================== */}
      <section id="menu" style={{ background: CREAM, padding: 'clamp(70px,11vh,140px) clamp(20px,4vw,72px)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div data-reveal style={{ ...revealInit(reduced), display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 18 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, fontWeight: 700, letterSpacing: '.24em', color: MOSS, textTransform: 'uppercase' }}>
                <span style={{ width: 34, height: 1.5, background: MOSS }} />From the case
              </div>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 'clamp(34px,4.6vw,68px)', lineHeight: 1, letterSpacing: '-.025em', margin: '14px 0 0' }}>Today's good stuff</h2>
            </div>
            <div style={{ fontFamily: "'Caveat', cursive", fontWeight: 600, fontSize: 24, color: '#1B1712aa', transform: 'rotate(-1.5deg)', maxWidth: 300, textAlign: 'right' }}>prices in króna · order ahead on Wolt</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(266px,1fr))', gap: 22, marginTop: 48 }}>
            {MENU.map((item) => (
              <div key={item.slotId} data-reveal style={revealInit(reduced, 0, 0.8)}>
                <div className="gk-card" style={{ background: CREAM_LIGHT, borderRadius: 20, overflow: 'hidden', border: '1px solid #1B17120F', cursor: 'pointer' }}>
                  <div style={{ position: 'relative', aspectRatio: '5 / 4', overflow: 'hidden', background: '#E5D5BA' }}>
                    {item.img ? (
                      <Img src={item.img} alt={item.shot} fallbackClassName={item.fallback} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <div className={item.fallback} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 40, color: CREAM_LIGHT, letterSpacing: '-.02em', opacity: 0.9 }}>
                          {item.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    {item.tag && (
                      <span style={{ position: 'absolute', top: 12, left: 12, background: INK, color: CREAM_LIGHT, fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', padding: '6px 11px', borderRadius: 100 }}>{item.tag}</span>
                    )}
                  </div>
                  <div style={{ padding: '18px 18px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                      <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 18.5, lineHeight: 1.12, letterSpacing: '-.01em', margin: 0 }}>{item.name}</h3>
                      <span style={{ fontWeight: 700, fontSize: 15, color: MOSS, whiteSpace: 'nowrap' }}>{item.price}</span>
                    </div>
                    <p style={{ fontSize: 13.5, lineHeight: 1.5, color: '#1B1712aa', margin: '9px 0 0' }}>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== VISIT ===================== */}
      <section id="visit" style={{ background: MOSS, color: CREAM_LIGHT, padding: 'clamp(70px,11vh,140px) clamp(20px,4vw,72px)' }}>
        <div data-reveal className="gk-visit-grid" style={{ ...revealInit(reduced), maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(28px,5vw,72px)', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, fontWeight: 700, letterSpacing: '.24em', color: SAND, textTransform: 'uppercase' }}>
              <span style={{ width: 34, height: 1.5, background: SAND }} />Visit
            </div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 'clamp(34px,4.6vw,66px)', lineHeight: 1, letterSpacing: '-.025em', margin: '16px 0 0' }}>Right on the way<br />through town.</h2>
            <div style={{ marginTop: 30, display: 'grid', gap: 18, maxWidth: 420 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, borderBottom: '1px solid #F6F0E322', paddingBottom: 14 }}>
                <span style={{ color: SAND, fontSize: 14 }}>Where</span>
                <span style={{ fontWeight: 600, textAlign: 'right', whiteSpace: 'pre-line' }}>{VISIT.where}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, borderBottom: '1px solid #F6F0E322', paddingBottom: 14 }}>
                <span style={{ color: SAND, fontSize: 14 }}>Hours</span>
                <span style={{ fontWeight: 600, textAlign: 'right' }}>{VISIT.hoursLines.map((l) => <div key={l}>{l}</div>)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, borderBottom: '1px solid #F6F0E322', paddingBottom: 14 }}>
                <span style={{ color: SAND, fontSize: 14 }}>Call</span>
                <a href={`tel:${VISIT.callHref}`} style={{ fontWeight: 600, textAlign: 'right', color: CREAM_LIGHT, textDecoration: 'none' }}>{VISIT.call}</a>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                <span style={{ color: SAND, fontSize: 14 }}>Email</span>
                <a href={`mailto:${VISIT.email}`} style={{ fontWeight: 600, textAlign: 'right', color: CREAM_LIGHT, textDecoration: 'none' }}>{VISIT.email}</a>
              </div>
            </div>
            <a href={VISIT.wolt} target="_blank" rel="noreferrer" className="gk-visit-cta" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 30, background: CREAM_LIGHT, color: INK, textDecoration: 'none', fontWeight: 700, fontSize: 15, padding: '15px 28px', borderRadius: 100 }}>
              Order for delivery on Wolt <span>↗</span>
            </a>
          </div>
          <div className="gk-visit-img" style={{ aspectRatio: '1 / 1', borderRadius: 24, overflow: 'hidden' }}>
            <Img src={IMAGES.visit} alt="A tray of fresh cinnamon rolls, flat-lay" fallbackClassName={FALLBACK.moss} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer style={{ background: INK, color: CREAM_LIGHT, padding: '46px clamp(20px,4vw,72px)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img
              src={LOGO}
              alt=""
              aria-hidden="true"
              width={38}
              height={38}
              loading="lazy"
              decoding="async"
              style={{ width: 38, height: 38, borderRadius: '50%', display: 'block', border: '1.5px solid #F6F0E326' }}
            />
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: '-.02em' }}>
              GK <span style={{ color: MOSS_LIGHT, fontWeight: 600, fontSize: 13, letterSpacing: '.2em' }}>BAKARÍ · SELFOSS</span>
            </div>
          </div>
          <div style={{ fontSize: 13, color: '#F6F0E388' }}>Freshly baked, freshly ground and freshly awakened · Austurvegur 31b, Selfoss · ©2026</div>
          <a href={FB} target="_blank" rel="noreferrer" className="gk-footer-link" style={{ color: CREAM_LIGHT, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>{VISIT.facebookHandle} ↗</a>
        </div>
      </footer>

      <PreviewChrome company={company} />
      <PreviewFooter company={company} />
    </div>
  )
}
