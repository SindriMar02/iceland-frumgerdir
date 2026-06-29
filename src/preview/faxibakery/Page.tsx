/**
 * Faxi Bakery Café — single-page landing.
 *
 * Faithful production rebuild of the "Faxi Bakery Café" design handoff from
 * Claude design. The handoff's DC-runtime prototype (x-dc / image-slot / {{ }})
 * is reproduced here in React with the project's conventions:
 *   - inline styles + one scoped <style> block for hover/keyframes (per handoff)
 *   - live "fresh in" countdown to the top of the next hour (setInterval, 1s)
 *   - deterministic steam wisps (sin-hash, built once — never on the clock tick)
 *   - IntersectionObserver scroll reveals (threshold .12, play once)
 *   - seamless hero: the provided cinnamon-roll photo sits on its own cream
 *     ground, which is feathered into the page's cream gradient via a radial mask
 *
 * Exact tokens, type scale, copy and interactions follow the handoff README +
 * Faxi Bakery.dc.html (source of truth).
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Img } from '../../components/Img'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { getPreviewCompany } from '../companies'
import { setThemeColor } from '../../lib/preview'
import { IMAGES, FALLBACK, MENU, STATS, VISIT } from './data'

const company = getPreviewCompany('faxibakery')

// ── Design tokens (from handoff) ─────────────────────────────────────────────
const CREAM = '#ECE3D1' // page base
const CREAM_LIGHT = '#F6F0E3' // surfaces / text on dark
const INK = '#1B1712' // volcanic near-black
const MOSS = '#4C5A41' // moss green
const MOSS_LIGHT = '#A7B197' // muted labels on dark
const SAND = '#D7CDB6' // muted labels on moss
const CARAMEL = '#C2773A' // warm script accent
const HERO_GRADIENT =
  'radial-gradient(120% 90% at 50% 8%, #F2EADA 0%, #E7DCC4 46%, #DCCEAF 100%)'
const IG = 'https://www.instagram.com/faxi_bakery_/'

const EASE = 'cubic-bezier(.16,.84,.44,1)'

// Steam defaults (handoff design knobs)
const STEAM = { warmth: '#FBE6C6', opacity: 0.18, spread: 520, speed: 1, wisps: 9 }

// ── Scoped CSS — keyframes + hover states (handoff uses :hover / style-hover) ──
const PAGE_CSS = `
  .faxi-page ::selection { background:${MOSS}; color:${CREAM_LIGHT}; }

  @keyframes faxi-steamA {
    0%   { opacity:0; transform:translate(0,8px) scaleX(.65) scaleY(.85); }
    14%  { opacity:1; }
    45%  { transform:translate(-12px,-52px) scaleX(1.25) scaleY(1.05); }
    72%  { opacity:.55; }
    100% { opacity:0; transform:translate(10px,-136px) scaleX(2.1) scaleY(1.35); }
  }
  @keyframes faxi-steamB {
    0%   { opacity:0; transform:translate(0,8px) scaleX(.7) scaleY(.9); }
    16%  { opacity:1; }
    48%  { transform:translate(14px,-58px) scaleX(1.3) scaleY(1.08); }
    74%  { opacity:.5; }
    100% { opacity:0; transform:translate(-9px,-142px) scaleX(2) scaleY(1.4); }
  }

  .faxi-navlink { color:${INK}; text-decoration:none; transition:color .2s ${EASE}; }
  .faxi-navlink:hover { color:${MOSS}; }

  .faxi-ig { transition:background .25s ${EASE}, color .25s ${EASE}, border-color .25s ${EASE}; }
  .faxi-ig:hover { background:${INK}; color:${CREAM_LIGHT}; border-color:${INK}; }

  .faxi-cta-primary { transition:background .25s ${EASE}; }
  .faxi-cta-primary:hover { background:${MOSS}; }
  .faxi-cta-ghost { transition:background .25s ${EASE}, border-color .25s ${EASE}; }
  .faxi-cta-ghost:hover { background:#fff; border-color:${INK}; }

  .faxi-card { transition:transform .8s ${EASE}, box-shadow .8s ${EASE}; will-change:transform; }
  .faxi-card:hover { transform:translateY(-6px); box-shadow:0 22px 44px #1B171218; }

  .faxi-visit-cta { transition:background .25s ${EASE}, color .25s ${EASE}; }
  .faxi-visit-cta:hover { background:${CARAMEL}; color:#fff; }

  .faxi-footer-link { transition:color .2s ${EASE}; }
  .faxi-footer-link:hover { color:${CARAMEL}; }

  @media (max-width:860px) {
    .faxi-story-grid, .faxi-visit-grid { grid-template-columns:1fr !important; }
    .faxi-visit-img { order:-1; }
    .faxi-stat-strip { grid-template-columns:repeat(2,1fr) !important; row-gap:30px !important; }
  }
  @media (max-width:560px) {
    .faxi-nav-links { display:none !important; }
  }
  @media (prefers-reduced-motion: reduce) {
    .faxi-card { transition:none; }
  }
`

// ── Steam (deterministic; built once, gated behind reduced-motion) ───────────
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
      const name = i % 2 ? 'faxi-steamA' : 'faxi-steamB'
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
        bottom: '42%',
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

// ── Reveal initial style helper (IntersectionObserver flips it to visible) ────
const revealInit = (reduced: boolean, delay = 0, dur = 0.9) =>
  reduced
    ? {}
    : {
        opacity: 0,
        transform: 'translateY(40px)',
        transition: `opacity ${dur}s ${EASE} ${delay}s, transform ${dur}s ${EASE} ${delay}s`,
      }

export default function FaxiBakeryPage() {
  const reduced = useReducedMotion() ?? false
  const rootRef = useRef<HTMLDivElement>(null)

  // Live "fresh in" countdown to the top of the next hour.
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [])
  const freshIn = useMemo(() => {
    const d = new Date(now)
    const totalSec = Math.max(
      0,
      Math.floor(((60 - d.getMinutes()) * 60000 - d.getSeconds() * 1000) / 1000),
    )
    const mm = String(Math.floor(totalSec / 60)).padStart(2, '0')
    const ss = String(totalSec % 60).padStart(2, '0')
    return `${mm}:${ss}`
  }, [now])

  useEffect(() => {
    setThemeColor(CREAM)
  }, [])

  // Scroll-driven reveals (threshold .12, play once).
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

  // Scroll-linked spin: the cinnamon roll is a spiral, so as the hero scrolls
  // past it slowly turns (scrubbed to scroll position) and eases up a touch.
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
      className="faxi-page"
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
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '26px clamp(20px,4vw,56px) 0',
          background: HERO_GRADIENT,
        }}
      >
        {/* nav */}
        <nav
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
            className="faxi-nav-links"
            style={{ display: 'flex', gap: 26, alignItems: 'center', fontSize: 15, fontWeight: 600, letterSpacing: '.01em' }}
          >
            <a href="#menu" className="faxi-navlink">Menu</a>
            <a href="#story" className="faxi-navlink">Story</a>
            <a href="#visit" className="faxi-navlink">Visit</a>
          </div>
          <div style={{ textAlign: 'center', lineHeight: 0.9 }}>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 30, letterSpacing: '-.02em' }}>Faxi</div>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.42em', color: MOSS, marginTop: 3 }}>BAKERY&nbsp;·&nbsp;CAFÉ</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, alignItems: 'center' }}>
            <a
              href={IG}
              target="_blank"
              rel="noreferrer"
              className="faxi-ig"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: INK, border: '1.5px solid #1B171225', borderRadius: 100, padding: '8px 15px', fontSize: 13, fontWeight: 600 }}
            >
              @faxi_bakery_<span style={{ fontSize: 11 }}>↗</span>
            </a>
          </div>
        </nav>

        {/* ribbon / live clock */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'clamp(18px,3vh,34px)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: 12.5, fontWeight: 700, letterSpacing: '.12em', color: MOSS, textTransform: 'uppercase' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: CARAMEL, display: 'inline-block', boxShadow: '0 0 0 4px #C2773A22' }} />
            Next batch out of the oven in{' '}
            <span style={{ fontVariantNumeric: 'tabular-nums', color: INK, background: '#1B17120D', padding: '2px 8px', borderRadius: 6 }}>{freshIn}</span>
          </div>
        </div>

        {/* headline */}
        <div style={{ textAlign: 'center', marginTop: 'clamp(10px,2vh,22px)', position: 'relative', zIndex: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(12px,2.2vw,30px)' }}>
            <span style={{ height: 2, width: 'clamp(20px,4.5vw,80px)', flexShrink: 0, background: '#1B171255' }} />
            <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 'clamp(42px,9vw,138px)', lineHeight: 0.82, letterSpacing: '-.035em', margin: 0, color: INK, whiteSpace: 'nowrap' }}>CINNAMON ROLL</h1>
            <span style={{ height: 2, width: 'clamp(20px,4.5vw,80px)', flexShrink: 0, background: '#1B171255' }} />
          </div>
          <div style={{ fontFamily: "'Caveat', cursive", fontWeight: 700, fontSize: 'clamp(30px,6vw,86px)', color: MOSS, lineHeight: 0.7, marginTop: '-.06em', transform: 'rotate(-3deg)' }}>fresh, every hour</div>
        </div>

        {/* roll stage */}
        <div style={{ position: 'relative', flex: 1, minHeight: 'clamp(320px,46vh,560px)', marginTop: 'clamp(14px,2vh,26px)' }}>
          {/* CTAs */}
          <div style={{ position: 'absolute', top: '6%', left: '50%', transform: 'translateX(-50%)', zIndex: 4, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="#menu" className="faxi-cta-primary" style={{ background: INK, color: CREAM_LIGHT, textDecoration: 'none', fontWeight: 600, fontSize: 16, padding: '15px 30px', borderRadius: 100, boxShadow: '0 10px 30px #1B171233' }}>Order ahead</a>
            <a href="#menu" className="faxi-cta-ghost" style={{ background: '#FFFFFFcc', color: INK, textDecoration: 'none', fontWeight: 600, fontSize: 16, padding: '15px 30px', borderRadius: 100, border: '1.5px solid #1B171222', backdropFilter: 'blur(4px)' }}>See the menu</a>
          </div>

          {/* steam */}
          <Steam reduced={reduced} />

          {/* hero photo — sits on its own cream ground, feathered into the page.
              The inner layer carries the scroll-linked spin; the circular feather
              mask is rotation-invariant, so the seamless blend is preserved. */}
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
                willChange: 'transform',
                // Feather the photo's flat-cream ground completely away — only the
                // bun and a soft halo survive, so it sits on the page with no seam.
                WebkitMaskImage: 'radial-gradient(circle closest-side at 50% 46%, #000 0%, #000 78%, rgba(0,0,0,0) 99%)',
                maskImage: 'radial-gradient(circle closest-side at 50% 46%, #000 0%, #000 78%, rgba(0,0,0,0) 99%)',
              }}
            >
              <img
                src={IMAGES.hero}
                alt="A single cinnamon roll, fresh from the oven — golden laminated layers dusted with cinnamon sugar"
                decoding="async"
                {...{ fetchpriority: 'high' }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </motion.div>
          </div>
        </div>

        {/* hero footer row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, padding: '0 0 26px', position: 'relative', zIndex: 4 }}>
          <div style={{ maxWidth: 340 }}>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 'clamp(18px,2vw,23px)', lineHeight: 1.05, letterSpacing: '-.01em' }}>A bakery with unregular stuff.</div>
            <div style={{ fontSize: 13.5, color: '#1B1712aa', marginTop: 7, lineHeight: 1.45 }}>Pulled off Route 1 in Hvolsvöllur, under the Eyjafjallajökull volcano. Nice coffee, cool setup.</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 12.5, fontWeight: 600, letterSpacing: '.1em', color: MOSS, textTransform: 'uppercase', lineHeight: 1.6 }}>
            Open every day<br />9 — 8
          </div>
        </div>
      </section>

      {/* ===================== STORY ===================== */}
      <section id="story" style={{ background: INK, color: CREAM_LIGHT, padding: 'clamp(70px,11vh,140px) clamp(20px,4vw,72px)' }}>
        <div data-reveal style={{ ...revealInit(reduced), maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, fontWeight: 700, letterSpacing: '.24em', color: MOSS_LIGHT, textTransform: 'uppercase' }}>
            <span style={{ width: 34, height: 1.5, background: MOSS_LIGHT }} />The Story
          </div>
          <div className="faxi-story-grid" style={{ display: 'grid', gridTemplateColumns: '1.15fr .85fr', gap: 'clamp(28px,5vw,80px)', alignItems: 'center', marginTop: 34 }}>
            <div>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 'clamp(34px,4.6vw,68px)', lineHeight: 1, letterSpacing: '-.025em', margin: 0 }}>
                A coffee stop with a<br /><span style={{ color: CARAMEL }}>volcano</span> for a view.
              </h2>
              <p style={{ fontSize: 'clamp(15px,1.3vw,18px)', lineHeight: 1.65, color: '#F6F0E3cc', maxWidth: '48ch', margin: '24px 0 0' }}>
                Right where the Ring Road runs under Eyjafjallajökull, Faxi is the kind of place locals linger over coffee and road-trippers can't quite drive past. We bake our cinnamon rolls fresh{' '}
                <em style={{ fontStyle: 'normal', color: '#fff', borderBottom: `2px solid ${CARAMEL}` }}>every hour, on the hour</em> — so something good is always coming out of the oven.
              </p>
              <p style={{ fontSize: 'clamp(15px,1.3vw,18px)', lineHeight: 1.65, color: '#F6F0E3cc', maxWidth: '48ch', margin: '18px 0 0' }}>
                Real espresso from a real machine — not the automatic kind you find everywhere else in Iceland. Sit inside among the plants, or grab one for the road out front.
              </p>
              <div aria-hidden style={{ fontFamily: "'Caveat', cursive", fontWeight: 700, fontSize: 30, color: CARAMEL, marginTop: 22, transform: 'rotate(-2deg)' }}>🐌 🐳 🦩 🐿️</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ aspectRatio: '4 / 5', borderRadius: 20, overflow: 'hidden' }}>
                <Img src={IMAGES.volcano} alt="The café exterior with Eyjafjallajökull and green mountains behind it on a blue-sky day" fallbackClassName={FALLBACK.volcano} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ aspectRatio: '16 / 10', borderRadius: 20, overflow: 'hidden' }}>
                <Img src={IMAGES.interior} alt="Cozy plant-filled interior — counter, pastry case, warm wood and greenery" fallbackClassName={FALLBACK.card} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            </div>
          </div>

          {/* stat strip */}
          <div data-reveal className="faxi-stat-strip" style={{ ...revealInit(reduced, 0.15), display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginTop: 'clamp(48px,7vh,90px)', borderTop: '1px solid #F6F0E322', paddingTop: 36 }}>
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
            <div style={{ fontFamily: "'Caveat', cursive", fontWeight: 600, fontSize: 24, color: '#1B1712aa', transform: 'rotate(-1.5deg)', maxWidth: 300, textAlign: 'right' }}>prices in króna · cash &amp; card · cinnamon rolls never last</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(266px,1fr))', gap: 22, marginTop: 48 }}>
            {MENU.map((item) => (
              <div key={item.slotId} data-reveal style={revealInit(reduced, 0, 0.8)}>
                <div className="faxi-card" style={{ background: CREAM_LIGHT, borderRadius: 20, overflow: 'hidden', border: '1px solid #1B17120F', cursor: 'pointer' }}>
                  <div style={{ position: 'relative', aspectRatio: '5 / 4', overflow: 'hidden', background: '#E4D9C2' }}>
                    <Img src={item.img} alt={item.shot} fallbackClassName={item.fallback} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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
        <div data-reveal className="faxi-visit-grid" style={{ ...revealInit(reduced), maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(28px,5vw,72px)', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, fontWeight: 700, letterSpacing: '.24em', color: SAND, textTransform: 'uppercase' }}>
              <span style={{ width: 34, height: 1.5, background: SAND }} />Visit
            </div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 'clamp(34px,4.6vw,66px)', lineHeight: 1, letterSpacing: '-.025em', margin: '16px 0 0' }}>Pull off the<br />Ring Road.</h2>
            <div style={{ marginTop: 30, display: 'grid', gap: 18, maxWidth: 420 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, borderBottom: '1px solid #F6F0E322', paddingBottom: 14 }}>
                <span style={{ color: SAND, fontSize: 14 }}>Where</span>
                <span style={{ fontWeight: 600, textAlign: 'right' }}>Route 1 · Hvolsvöllur<br />South Iceland</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, borderBottom: '1px solid #F6F0E322', paddingBottom: 14 }}>
                <span style={{ color: SAND, fontSize: 14 }}>Hours</span>
                <span style={{ fontWeight: 600, textAlign: 'right' }}>{VISIT.hours}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, borderBottom: '1px solid #F6F0E322', paddingBottom: 14 }}>
                <span style={{ color: SAND, fontSize: 14 }}>Call</span>
                <a href={`tel:${VISIT.callHref}`} style={{ fontWeight: 600, textAlign: 'right', color: CREAM_LIGHT, textDecoration: 'none' }}>{VISIT.call}</a>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                <span style={{ color: SAND, fontSize: 14 }}>Bookings</span>
                <span style={{ fontWeight: 600, textAlign: 'right' }}>{VISIT.bookings}</span>
              </div>
            </div>
            <a href={IG} target="_blank" rel="noreferrer" className="faxi-visit-cta" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 30, background: CREAM_LIGHT, color: INK, textDecoration: 'none', fontWeight: 700, fontSize: 15, padding: '15px 28px', borderRadius: 100 }}>
              Grab a coffee for the road <span>↗</span>
            </a>
          </div>
          <div className="faxi-visit-img" style={{ aspectRatio: '1 / 1', borderRadius: 24, overflow: 'hidden' }}>
            <Img src={IMAGES.visit} alt="Faxi's outdoor terrace seating on Route 1 with a mountain view" fallbackClassName={FALLBACK.moss} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer style={{ background: INK, color: CREAM_LIGHT, padding: '46px clamp(20px,4vw,72px)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: '-.02em' }}>
            Faxi <span style={{ color: MOSS_LIGHT, fontWeight: 600, fontSize: 13, letterSpacing: '.2em' }}>BAKERY · CAFÉ</span>
          </div>
          <div style={{ fontSize: 13, color: '#F6F0E388' }}>A bakery with unregular stuff · Hvolsvöllur, Iceland · ©2026</div>
          <a href={IG} target="_blank" rel="noreferrer" className="faxi-footer-link" style={{ color: CREAM_LIGHT, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>@faxi_bakery_ ↗</a>
        </div>
      </footer>

      <PreviewChrome company={company} />
      <PreviewFooter company={company} />
    </div>
  )
}
