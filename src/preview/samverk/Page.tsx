import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from 'framer-motion'
import { BadgeCheck, Factory, Mail, MapPin, Phone, Ruler } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { Img } from '../../components/Img'
import { Reveal } from '../../components/Reveal'
import {
  EMAIL,
  FOUNDED_YEAR,
  FOUNDING_STORY,
  IMG,
  INSTALL_BODY,
  LOCATIONS,
  MORE_PRODUCTS,
  PHONE_DISPLAY,
  PHONE_HREF,
  PRODUCTS,
  QUALITY_BODY,
} from './data'

const company = getPreviewCompany('samverk')

/* ── LJÓSBROT ("light refraction") — Samverk's whole value is glass: clarity,
      precision, light passing through. Every real photo is shown as a square
      "pane" (their photography happens to be 1:1 — a genuine constraint turned
      into the design's repeating module) with a hairline blue border and a
      light-sweep "glint" on hover, echoing how light catches real glass. Bright,
      airy, cool — a deliberate contrast to the recent dark/warm-paper builds.
      Signature is an interactive product index (functional split: clicking a
      name swaps the pane), built only from categories with a REAL photo. ───── */
const PAPER = '#F7F9FB'
const PANEL = '#EDF2F6'
const INK = '#101820'
const MUTE = 'rgba(16,24,32,.62)'
const BLUE = '#27639C' /* Samverk's real logo blue — 5.9:1 on PAPER as text, 6.3:1 as bg w/ white text */
const NAVY = '#153252'
const HAIR = 'rgba(16,24,32,.12)'

const BASE = import.meta.env.BASE_URL
const DISPLAY = "'ClashDisplay-Semibold', system-ui, sans-serif"
const DISPLAY_BOLD = "'ClashDisplay-Bold', system-ui, sans-serif"
const SANS = "'Satoshi', system-ui, sans-serif"

const CSS = `
@font-face{font-family:'ClashDisplay-Semibold';font-weight:600;font-style:normal;font-display:swap;
  src:url('${BASE}fonts/clash-display/fonts/ClashDisplay-Semibold.woff2') format('woff2'),
      url('${BASE}fonts/clash-display/fonts/ClashDisplay-Semibold.woff') format('woff')}
@font-face{font-family:'ClashDisplay-Bold';font-weight:700;font-style:normal;font-display:swap;
  src:url('${BASE}fonts/clash-display/fonts/ClashDisplay-Bold.woff2') format('woff2'),
      url('${BASE}fonts/clash-display/fonts/ClashDisplay-Bold.woff') format('woff')}
@font-face{font-family:'Satoshi';font-weight:400;font-style:normal;font-display:swap;
  src:url('${BASE}fonts/satoshi/Satoshi-Regular.woff2') format('woff2')}
@font-face{font-family:'Satoshi';font-weight:500;font-style:normal;font-display:swap;
  src:url('${BASE}fonts/satoshi/Satoshi-Medium.woff2') format('woff2')}
@font-face{font-family:'Satoshi';font-weight:700;font-style:normal;font-display:swap;
  src:url('${BASE}fonts/satoshi/Satoshi-Bold.woff2') format('woff2')}

.sv-root{position:relative;background:${PAPER};color:${INK};overflow-x:clip}
.sv-eyebrow{font-family:${SANS};font-weight:700;font-size:.72rem;letter-spacing:.26em;text-transform:uppercase;color:${BLUE}}

.sv-nav{position:sticky;top:0;z-index:40;display:flex;align-items:center;justify-content:space-between;
  padding:.8rem 1.25rem;background:rgba(247,249,251,.88);backdrop-filter:blur(10px);border-bottom:1px solid ${HAIR}}
.sv-nav-logo{height:42px;width:auto;display:block}
.sv-nav-links{display:none;gap:2rem;font-family:${SANS};font-weight:500;font-size:.86rem;color:${MUTE}}
@media (min-width:860px){.sv-nav-links{display:flex}}
.sv-nav-links a:hover{color:${INK}}
.sv-btn{display:inline-flex;align-items:center;gap:.5rem;font-family:${SANS};font-weight:700;font-size:.86rem;
  padding:.7rem 1.25rem;border-radius:2px;white-space:nowrap;transition:transform .15s ease,box-shadow .15s ease}
.sv-btn:active{transform:scale(.97)}
.sv-btn--blue{background:${BLUE};color:#fff}
.sv-btn--ghost{border:1.5px solid ${INK};color:${INK}}
.sv-btn--ghost-navy{border:1.5px solid rgba(255,255,255,.4);color:#fff}

/* the repeating "glass pane" module — every real photo lives in one of these */
.sv-pane{position:relative;overflow:hidden;border-radius:2px;aspect-ratio:1/1;border:1px solid rgba(39,99,156,.22);
  box-shadow:0 26px 48px -26px rgba(16,24,32,.28);background:${PANEL}}
.sv-pane img{width:100%;height:100%;object-fit:cover;transition:transform .7s cubic-bezier(.16,1,.3,1)}
.sv-pane::after{content:'';position:absolute;inset:-50% -20%;pointer-events:none;
  background:linear-gradient(115deg,transparent 42%,rgba(255,255,255,.55) 50%,transparent 58%);
  transform:translateX(-130%);transition:transform 1s cubic-bezier(.16,1,.3,1)}
.sv-pane:hover img,.sv-pane:focus-within img{transform:scale(1.045)}
.sv-pane:hover::after,.sv-pane:focus-within::after{transform:translateX(70%)}
@media (prefers-reduced-motion:reduce){.sv-pane::after{display:none}.sv-pane img{transition:none}}
.sv-pane-cap{position:absolute;left:0;right:0;bottom:0;padding:.85rem 1rem;font-family:${SANS};font-size:.78rem;
  color:#fff;background:linear-gradient(0deg,rgba(16,24,32,.7),transparent)}

.sv-hero{padding:6.5rem 1.25rem 5rem}
.sv-hero-grid{max-width:76rem;margin:0 auto;display:grid;gap:3rem}
@media (min-width:900px){.sv-hero-grid{grid-template-columns:1.05fr .95fr;align-items:center;gap:4rem}}
.sv-hero-h1{font-family:${DISPLAY_BOLD};font-size:clamp(2.4rem,6.2vw,4.4rem);line-height:1.04;letter-spacing:-.01em;
  margin-top:1rem;text-wrap:balance;color:${INK}}
.sv-hero-h1 em{font-style:normal;color:${BLUE}}
.sv-hero-sub{font-family:${SANS};color:${MUTE};font-size:clamp(1rem,1.6vw,1.15rem);max-width:32rem;
  margin-top:1.3rem;line-height:1.6}
.sv-hero-ctas{display:flex;flex-wrap:wrap;gap:.9rem;margin-top:2.1rem}
.sv-hero-chip{margin-top:2.2rem;display:flex;flex-wrap:wrap;gap:1.6rem;font-family:${SANS};font-size:.82rem;color:${MUTE}}
.sv-hero-chip strong{color:${INK};font-weight:700}

.sv-section{padding:6rem 1.25rem}
.sv-wrap{max-width:64rem;margin:0 auto}
.sv-wrap--wide{max-width:76rem;margin:0 auto}
.sv-h2{font-family:${DISPLAY};font-size:clamp(2rem,4.8vw,3.1rem);line-height:1.06;letter-spacing:-.005em;margin-top:.6rem}

.sv-story{background:${PANEL}}
.sv-story-grid{display:grid;gap:2.5rem;margin-top:3rem;align-items:center}
@media (min-width:860px){.sv-story-grid{grid-template-columns:.6fr 1.4fr}}
.sv-stat{font-family:${DISPLAY_BOLD};color:${BLUE};font-size:clamp(4rem,11vw,6.5rem);line-height:.9}
.sv-stat-label{font-family:${SANS};font-weight:700;font-size:.92rem;margin-top:.6rem;color:${INK}}
.sv-story-body{font-family:${SANS};color:${MUTE};font-size:1.03rem;line-height:1.65;max-width:36rem}

/* Mobile: plain stack in DOM order (list, then pane, then description) so the
   photo is visible right under the list you're tapping, not buried below a
   paragraph of text. Desktop: named areas put the pane beside both. */
.sv-index-grid{display:grid;gap:2rem;margin-top:3rem}
@media (min-width:900px){
  .sv-index-grid{grid-template-columns:.85fr 1.15fr;grid-template-areas:"list pane" "desc pane";
    column-gap:4rem;row-gap:2.5rem;align-items:start}
  .sv-index-col-list{grid-area:list}
  .sv-index-col-pane{grid-area:pane}
  .sv-index-col-desc{grid-area:desc}
}
.sv-index-list{list-style:none;display:grid;border-top:1px solid ${HAIR}}
.sv-index-item{border-bottom:1px solid ${HAIR}}
.sv-index-btn{display:flex;width:100%;align-items:center;justify-content:space-between;gap:1rem;
  padding:1.15rem .25rem;background:none;border:none;text-align:left;cursor:pointer;font-family:${SANS};
  font-weight:600;font-size:1.05rem;color:${MUTE};transition:color .15s ease}
.sv-index-btn:hover{color:${INK}}
.sv-index-item.is-active .sv-index-btn{color:${BLUE}}
.sv-index-btn-num{font-family:${SANS};font-size:.78rem;color:${MUTE};font-weight:500}
.sv-index-body{font-family:${SANS};color:${MUTE};font-size:.92rem;line-height:1.5;max-width:34rem}
.sv-chips{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:1.5rem}
.sv-chip{font-family:${SANS};font-size:.82rem;font-weight:500;color:${MUTE};background:${PANEL};
  border:1px solid ${HAIR};border-radius:99px;padding:.4rem .9rem}

.sv-quality{background:${NAVY};color:#fff}
.sv-quality .sv-eyebrow{color:#8FB6D9}
.sv-quality .sv-h2{color:#fff}
.sv-quality-grid{display:grid;gap:2rem;margin-top:3rem}
@media (min-width:800px){.sv-quality-grid{grid-template-columns:repeat(3,1fr)}}
.sv-quality-card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:4px;padding:1.75rem}
.sv-quality-card svg{color:#8FB6D9}
.sv-quality-card h3{font-family:${SANS};font-weight:700;font-size:1.02rem;margin-top:.9rem}
.sv-quality-card p{font-family:${SANS};font-size:.88rem;line-height:1.55;color:rgba(255,255,255,.68);margin-top:.5rem}

.sv-install-grid{display:grid;gap:3rem;margin-top:3rem}
@media (min-width:900px){.sv-install-grid{grid-template-columns:1fr 1fr;align-items:center}}
.sv-install-body{font-family:${SANS};color:${MUTE};font-size:1.02rem;line-height:1.65}

.sv-detail{position:relative;min-height:60svh;display:flex;align-items:flex-end}
.sv-detail-media{position:absolute;inset:0}
.sv-detail-media img{width:100%;height:100%;object-fit:cover;object-position:60% 40%}
.sv-detail-scrim{position:absolute;inset:0;background:linear-gradient(0deg,rgba(16,24,32,.82) 0%,rgba(16,24,32,.15) 55%,transparent 100%)}
.sv-detail-body{position:relative;z-index:1;max-width:64rem;margin:0 auto;padding:3.5rem 1.25rem}
.sv-detail-body .sv-h2{color:#fff}
.sv-detail-body p{font-family:${SANS};color:rgba(255,255,255,.8);max-width:30rem;margin-top:1rem;line-height:1.6}

.sv-locations-grid{display:grid;gap:1.75rem;margin-top:3rem}
@media (min-width:800px){.sv-locations-grid{grid-template-columns:1fr 1fr}}
.sv-location-card{background:${PANEL};border-radius:4px;padding:2rem;border-top:3px solid ${BLUE}}
.sv-location-name{font-family:${DISPLAY};font-size:1.5rem}
.sv-location-town{font-family:${SANS};font-weight:700;font-size:.82rem;color:${BLUE};letter-spacing:.08em;text-transform:uppercase}
.sv-location-row{display:flex;gap:.7rem;align-items:flex-start;font-family:${SANS};font-size:.94rem;margin-top:1rem}
.sv-location-row svg{flex:none;color:${BLUE};margin-top:.15rem}
.sv-hours-row{display:flex;justify-content:space-between;font-family:${SANS};font-size:.88rem;padding:.35rem 0;color:${MUTE}}

.sv-cta{background:${INK};color:#fff;text-align:center}
.sv-cta .sv-h2{color:#fff}
.sv-cta-body{font-family:${SANS};color:rgba(255,255,255,.72);max-width:32rem;margin:1rem auto 0;line-height:1.6}
.sv-cta-ctas{display:flex;flex-wrap:wrap;justify-content:center;gap:1rem;margin-top:2.1rem}

.sv-sticky{position:fixed;left:0;right:0;bottom:0;z-index:50;display:flex;gap:.6rem;padding:.7rem;
  background:rgba(16,24,32,.94);backdrop-filter:blur(10px);border-top:1px solid rgba(255,255,255,.08)}
@media (min-width:860px){.sv-sticky{display:none}}
.sv-sticky a{flex:1;justify-content:center}
`

/* ── Count-up: interval keyed off Date.now (not rAF), setTimeout lands the final value. */
function CountUp({ to, className, style }: { to: number; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState(to - 40)
  const started = useRef(false)
  const reduce = useReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const run = () => {
      if (started.current) return
      started.current = true
      if (reduce) {
        setN(to)
        return
      }
      const from = to - 40
      const dur = 1000
      const t0 = Date.now()
      const iv = window.setInterval(() => {
        const p = Math.min(1, (Date.now() - t0) / dur)
        setN(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))))
        if (p >= 1) window.clearInterval(iv)
      }, 32)
      window.setTimeout(() => {
        window.clearInterval(iv)
        setN(to)
      }, dur + 200)
    }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (run(), io.disconnect()), { threshold: 0.5 })
    io.observe(el)
    const fs = window.setTimeout(run, 1500)
    return () => {
      io.disconnect()
      window.clearTimeout(fs)
    }
  }, [to, reduce])
  return (
    <span ref={ref} className={className} style={style}>
      {n}
    </span>
  )
}

/* ── Signature: the product index. Clicking a name swaps the pane photo + caption —
      a functional split, not decoration, and built only from categories with a real
      photo (the rest of Samverk's real range is listed as plain chips below, honestly,
      instead of stretching a photo to cover a category it doesn't show). ──────────── */
function ProductIndex() {
  const [active, setActive] = useState(0)
  const p = PRODUCTS[active]

  return (
    <div className="sv-index-grid">
      <div className="sv-index-col-list">
        <ul className="sv-index-list">
          {PRODUCTS.map((item, i) => (
            <li key={item.key} className={`sv-index-item${i === active ? ' is-active' : ''}`}>
              <button type="button" className="sv-index-btn" onClick={() => setActive(i)} aria-current={i === active}>
                {item.name}
                <span className="sv-index-btn-num">{String(i + 1).padStart(2, '0')}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="sv-index-col-pane sv-pane">
        <Img src={p.img} alt={p.name} />
        <div className="sv-pane-cap">{p.name}</div>
      </div>
      <div className="sv-index-col-desc">
        <p className="sv-index-body">{p.body}</p>
        <div className="sv-chips">
          {MORE_PRODUCTS.map((m) => (
            <span key={m} className="sv-chip">
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function SamverkPage() {
  useEffect(() => {
    setThemeColor(PAPER)
    const lenis = new Lenis({ duration: 1.1, easing: (x) => Math.min(1, 1.001 - Math.pow(2, -10 * x)), smoothWheel: true })
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent('Fyrirspurn um gler')}`

  return (
    <div className="sv-root" lang="is">
      <style>{CSS}</style>
      <PreviewChrome company={company} />

      <nav className="sv-nav">
        <Img src={IMG.logo} alt="Samverk glerverksmiðja" className="sv-nav-logo" fetchpriority="high" />
        <div className="sv-nav-links">
          <a href="#vorur">Vörur</a>
          <a href="#gaedi">Gæði</a>
          <a href="#stadsetningar">Staðsetningar</a>
        </div>
        <a href={PHONE_HREF} className="sv-btn sv-btn--ghost">
          <Phone size={15} /> {PHONE_DISPLAY}
        </a>
      </nav>

      <header className="sv-hero">
        <div className="sv-hero-grid">
          <Reveal>
            <div className="sv-eyebrow">Samverk glerverksmiðja</div>
            <h1 className="sv-hero-h1">
              Frá {FOUNDED_YEAR}. <em>Enn í fremstu röð.</em>
            </h1>
            <p className="sv-hero-sub">
              Alhliða glerlausnir með áherslu á gæði, fagmennsku og þjónustu — frá elstu og stærstu glerverksmiðju
              landsins.
            </p>
            <div className="sv-hero-ctas">
              <a href={PHONE_HREF} className="sv-btn sv-btn--blue">
                <Phone size={16} /> Hringja
              </a>
              <a href="#vorur" className="sv-btn sv-btn--ghost">
                Skoða vöruúrval
              </a>
            </div>
            <div className="sv-hero-chip">
              <span>
                <strong>Kópavogur</strong> · sýningarsalur
              </span>
              <span>
                <strong>Hella</strong> · glerverksmiðja
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="sv-pane">
              <Img src={IMG.glerveggur} alt="Glerveggir og glerhurðir frá Samverk í skrifstofurými" fetchpriority="high" />
              <div className="sv-pane-cap">Glerveggir og hurðir — Samverk</div>
            </div>
          </Reveal>
        </div>
      </header>

      <section className="sv-section sv-story">
        <div className="sv-wrap--wide">
          <Reveal>
            <div className="sv-eyebrow">Sagan</div>
            <h2 className="sv-h2">Elsta starfandi glerverksmiðja landsins.</h2>
          </Reveal>
          <div className="sv-story-grid">
            <Reveal delay={0.05}>
              <div className="sv-stat">
                <CountUp to={FOUNDED_YEAR} />
              </div>
              <div className="sv-stat-label">Stofnað í Rangárþingi</div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="sv-story-body">{FOUNDING_STORY}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="vorur" className="sv-section">
        <div className="sv-wrap--wide">
          <Reveal>
            <div className="sv-eyebrow">Vöruúrval</div>
            <h2 className="sv-h2">Sérsmíðað gler, eftir máli.</h2>
          </Reveal>
          <Reveal delay={0.05}>
            <ProductIndex />
          </Reveal>
        </div>
      </section>

      <section id="gaedi" className="sv-section sv-quality">
        <div className="sv-wrap--wide">
          <Reveal>
            <div className="sv-eyebrow">Gæði og ábyrgð</div>
            <h2 className="sv-h2">Framleiðslutæki í hæsta gæðaflokki.</h2>
          </Reveal>
          <div className="sv-quality-grid">
            <Reveal delay={0.05}>
              <div className="sv-quality-card">
                <BadgeCheck size={22} />
                <h3>CE-vottað gler</h3>
                <p>{QUALITY_BODY}</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="sv-quality-card">
                <Factory size={22} />
                <h3>Tvær starfsstöðvar</h3>
                <p>Glerverksmiðja á Hellu og sýningarsalur með söluskrifstofu í Kópavogi — framleiðsla og ráðgjöf undir sama merki.</p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="sv-quality-card">
                <Ruler size={22} />
                <h3>Sérsmíði eftir máli</h3>
                <p>Sérsmíðað gler og speglar eftir hönnun og stærð — við leysum öll glerverkefni sem viðskiptavinir koma með til okkar.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="sv-section">
        <div className="sv-wrap--wide">
          <Reveal>
            <div className="sv-eyebrow">Uppsetning og mælingar</div>
            <h2 className="sv-h2">Endingin ræðst af ísetningunni.</h2>
          </Reveal>
          <div className="sv-install-grid">
            <Reveal delay={0.05}>
              <p className="sv-install-body">{INSTALL_BODY}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="sv-pane">
                <Img src={IMG.sturtugler} alt="Sérsniðið sturtugler frá Samverk" />
                <div className="sv-pane-cap">Mæling og uppsetning — hvert verkefni sérsniðið</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="sv-detail">
        <div className="sv-detail-media">
          <Img src={IMG.glerhandrid} alt="Glerhandrið, nærmynd — Samverk" />
        </div>
        <div className="sv-detail-scrim" />
        <div className="sv-detail-body">
          <Reveal>
            <div className="sv-eyebrow" style={{ color: '#8FB6D9' }}>
              Handverkið
            </div>
            <h2 className="sv-h2">Hvert handrið, hver saumur, hannað eftir máli.</h2>
            <p>Fullkomin framleiðslutæki og áratuga reynsla mætast í hverri afhendingu — sama hvort verkefnið er eitt handrið eða heil glerframhlið.</p>
          </Reveal>
        </div>
      </section>

      <section id="stadsetningar" className="sv-section">
        <div className="sv-wrap--wide">
          <Reveal>
            <div className="sv-eyebrow">Finndu okkur</div>
            <h2 className="sv-h2">Tvær starfsstöðvar, ein verksmiðja.</h2>
          </Reveal>
          <div className="sv-locations-grid">
            {LOCATIONS.map((loc, i) => (
              <Reveal key={loc.town} delay={0.05 * i}>
                <div className="sv-location-card">
                  <div className="sv-location-town">{loc.town}</div>
                  <div className="sv-location-name">{loc.name}</div>
                  <div className="sv-location-row">
                    <MapPin size={17} />
                    <a href={loc.maps} target="_blank" rel="noreferrer">
                      {loc.address}
                    </a>
                  </div>
                  <div style={{ marginTop: '1.1rem' }}>
                    {loc.hours.map((h) => (
                      <div key={h.day} className="sv-hours-row">
                        <span>{h.day}</span>
                        <span>{h.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sv-section sv-cta">
        <div className="sv-wrap">
          <Reveal>
            <div className="sv-eyebrow" style={{ color: '#8FB6D9' }}>
              Næsta skref
            </div>
            <h2 className="sv-h2">Segðu okkur frá verkefninu.</h2>
            <p className="sv-cta-body">Hringdu eða sendu okkur línu — Samverk-teymið fer yfir verkefnið og skilar tilboði sem hentar.</p>
            <div className="sv-cta-ctas">
              <a href={PHONE_HREF} className="sv-btn sv-btn--blue">
                <Phone size={16} /> {PHONE_DISPLAY}
              </a>
              <a href={mailto} className="sv-btn sv-btn--ghost-navy">
                <Mail size={16} /> Senda tölvupóst
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <PreviewFooter company={company} />

      <div className="sv-sticky">
        <a href={PHONE_HREF} className="sv-btn sv-btn--blue">
          <Phone size={15} /> Hringja
        </a>
        <a href={mailto} className="sv-btn sv-btn--ghost-navy">
          <Mail size={15} /> Senda póst
        </a>
      </div>
    </div>
  )
}
