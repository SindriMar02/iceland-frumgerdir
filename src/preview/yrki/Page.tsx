import { useEffect, useMemo, useRef, useState } from 'react'
import Lenis from 'lenis'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { getPreviewCompany } from '../companies'
import { WorkList, WORK_LIST_CSS } from './WorkList'
import { Preloader, PRELOADER_CSS } from './Preloader'
import { Diagram, DIAGRAM_CSS } from './Diagram'
import { Register } from './Register'
import { MobileNav, MOBILE_NAV_CSS } from './MobileNav'
import { setNoindex } from '../../lib/preview'
import {
  IMG, ADDRESS, EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF,
  PRACTICE, PHOTOS, SPEC, LEDGER, SERVICES, REGISTER, REGISTER_RISE, ENQUIRY_TOPICS, NAV,
  PAGE_TITLE, PAGE_DESCRIPTION, JSON_LD,
} from './data'

/* ═════════════════════════════════════════════════════════════════════════
   YRKI ARKITEKTAR — the Heklusýn machine, device for device, third
   transplant (Heklusýn → THG → this). Same premium look, Yrki's facts:

     · Lenis + CSS transforms, zero canvas, real <img> throughout
     · .yrki-frame / .yrki-frame-in image drift, inset derived from drift
     · .yrki-m masked translateY(108%) arrival, .yrki-d continuous drift,
       .yrki-rule scaleX wipe, .yrki-r soft rise
     · percentage preloader whose wordmark fills as the number climbs
     · cursor-following photograph over a typeset list of works
     · velocity-driven register marquee (86 titles, their whole register)
     · a scale diagram drawn from three published areas, statuses included

   The thesis is their own: the name Yrki "vísar til sýnar stofunnar um að
   sameina það jarðbundna og ljóðræna" (yrki.is/stofan, verbatim). Facts
   re-verified against yrki.is on 2026-08-10; competition entries are
   labelled as such, never presented as built.
   ═════════════════════════════════════════════════════════════════════════ */

const BASE = import.meta.env.BASE_URL
const GROUND = '#ffffff'
const INK = '#111111'
const MUTED = '#767676'
const RULE = '#e2e2e2'
const BAND = '#f0f0f0'

const SANS = "'YRKI Switzer', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
const SERIF = "'YRKI Hedvig', Georgia, 'Times New Roman', serif"
const EASE = 'cubic-bezier(.17,.84,.44,1)'

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const CSS = `
@font-face{font-family:'YRKI Switzer';src:url('${BASE}fonts/switzer/Switzer-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'YRKI Switzer';src:url('${BASE}fonts/switzer/Switzer-Medium.woff2') format('woff2');font-weight:500;font-display:swap}
@font-face{font-family:'YRKI Switzer';src:url('${BASE}fonts/switzer/Switzer-Semibold.woff2') format('woff2');font-weight:600;font-display:swap}
@font-face{font-family:'YRKI Hedvig';src:url('${BASE}fonts/hedvig/hedvig-latin.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'YRKI Hedvig';src:url('${BASE}fonts/hedvig/hedvig-latin-ext.woff2') format('woff2');font-weight:400;font-display:swap;unicode-range:U+0100-024F,U+1E00-1EFF,U+20A0-20AB,U+2C60-2C7F,U+A720-A7FF}

.yrki-root{background:${GROUND};color:${INK};font-family:${SANS};-webkit-font-smoothing:antialiased;overflow-x:clip}
.yrki-root *,.yrki-root *::before,.yrki-root *::after{box-sizing:border-box}
.yrki-root h1,.yrki-root h2,.yrki-root p,.yrki-root figure{margin:0}
.yrki-root img{display:block;max-width:100%}
.yrki-serif{font-family:${SERIF};font-weight:400;font-style:normal}
.yrki-root :focus-visible{outline:2px solid currentColor;outline-offset:3px}

.yrki-pad{padding-inline:clamp(18px,3.4vw,52px)}
.yrki-sec{padding-block:clamp(72px,11vh,148px)}
main > section[id]{scroll-margin-top:clamp(56px,9vh,96px)}

/* rule wipe */
.yrki-rule{height:1px;background:${RULE};transform-origin:left center}
.yrki-js .yrki-rule{transform:scaleX(0);transition:transform 1.1s ${EASE}}
.yrki-js .yrki-rule.is-in{transform:scaleX(1)}

/* THE text device — translateY inside a mask; resting state VISIBLE */
.yrki-m{display:block;overflow:hidden;padding-bottom:.22em;margin-bottom:-.22em}
.yrki-m>span{display:block;transform:none}
.yrki-js .yrki-m>span{transform:translateY(108%);transition:transform 1.05s ${EASE}}
.yrki-js .yrki-m.is-in>span{transform:none}

/* continuous scroll drift for type, separate wrapper */
.yrki-d{display:block;will-change:transform}
@media (prefers-reduced-motion:reduce){.yrki-d{will-change:auto;transform:none!important}}

/* soft rise for non-display blocks */
.yrki-r{opacity:1;transform:none}
.yrki-js .yrki-r{opacity:0;transform:translateY(24px);transition:opacity .9s ${EASE},transform .9s ${EASE}}
.yrki-js .yrki-r.is-in{opacity:1;transform:none}

/* THE image device — masked frame, inner wrapper drifts, inset derived */
.yrki-frame{position:relative;overflow:hidden;width:100%}
.yrki-frame-in{position:absolute;inset:calc(-1 * var(--dz,9%)) 0;will-change:transform}
.yrki-frame-in img{width:100%;height:100%;object-fit:cover}
@media (prefers-reduced-motion:reduce){.yrki-frame-in{inset:0;will-change:auto;transform:none!important}}

/* fixed chrome */
.yrki-chrome{position:fixed;top:0;left:0;right:0;z-index:40;display:flex;align-items:flex-start;
  justify-content:space-between;gap:2rem;padding:clamp(14px,2vw,26px) clamp(18px,3.4vw,52px);
  pointer-events:none;color:#fff;transition:color .45s ${EASE}}
.yrki-chrome.is-ink{color:${INK}}
.yrki-chrome a{pointer-events:auto;color:inherit;text-decoration:none}
.yrki-wordmark{font-size:clamp(12px,1vw,15px);line-height:1.2;font-weight:400}
@media (max-width:759px){
  .yrki-wordmark{line-height:1.2;font-size:12px}
  .yrki-wordmark br{display:none}
  .yrki-wordmark span{display:none}
  .yrki-sec{padding-block:clamp(84px,14vh,148px) clamp(72px,11vh,148px)}
}
.yrki-nav{display:flex;gap:.3em;flex-wrap:wrap;justify-content:flex-end;max-width:62vw;
  font-size:clamp(12px,1vw,15px);font-weight:400}
.yrki-nav a{white-space:nowrap}
.yrki-nav a:hover{opacity:.55}

/* hero */
.yrki-hero{position:relative;height:100svh;min-height:540px;overflow:hidden}
.yrki-hero>.yrki-frame{position:absolute;inset:0}
.yrki-hero-scrim{position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(180deg,rgba(0,0,0,.30) 0%,rgba(0,0,0,.02) 26%,rgba(0,0,0,.10) 52%,rgba(0,0,0,.52) 82%,rgba(0,0,0,.74) 100%)}
/* cinematic settle: the hero photograph eases out of a slight push-in once,
   on the IMG so it never fights the scroll loop's transform on the wrapper.
   Keyframes are prefixed per-page — no style bleed between builds. */
@keyframes yrki-heroSettle{from{transform:scale(1.075)}to{transform:scale(1)}}
.yrki-hero .yrki-frame-in img{transform-origin:50% 55%;
  animation:yrki-heroSettle 2600ms cubic-bezier(.17,.84,.44,1) both}
@media (prefers-reduced-motion:reduce){.yrki-hero .yrki-frame-in img{animation:none}}
.yrki-hero-lock{position:absolute;left:0;right:0;bottom:clamp(16px,2.6vw,40px);color:#fff}
.yrki-lock{display:block;font-weight:400;letter-spacing:-.03em;line-height:.98;
  font-size:clamp(1.9rem,7.4vw,7.2rem)}

/* statement */
.yrki-statement{max-width:22ch;color:${MUTED};
  font-size:clamp(1.35rem,3.6vw,3rem);line-height:1.14;letter-spacing:-.022em;font-weight:400}
.yrki-statement .yrki-serif{color:${INK}}

/* intro + spec */
.yrki-intro{display:grid;gap:clamp(30px,4.5vw,72px);margin-top:clamp(30px,4vw,60px)}
@media (min-width:900px){.yrki-intro{grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);align-items:start}}
.yrki-spec{margin:0;border-top:1px solid ${RULE}}
.yrki-spec>div{display:flex;justify-content:space-between;gap:1.2rem;align-items:baseline;
  padding-block:clamp(11px,1.3vw,16px);border-bottom:1px solid ${RULE}}
.yrki-spec dt{margin:0;color:${MUTED};font-size:clamp(.84rem,1vw,.96rem)}
.yrki-spec dd{margin:0;text-align:right;font-size:clamp(.95rem,1.15vw,1.08rem)}

/* ledger */
.yrki-ledger{border-top:1px solid ${RULE}}
.yrki-led{display:grid;grid-template-columns:1fr auto;gap:1.4rem;align-items:baseline;
  padding-block:clamp(13px,1.5vw,21px);border-bottom:1px solid ${RULE}}
.yrki-led-k,.yrki-led-v{font-size:clamp(1.15rem,2.8vw,2.3rem);letter-spacing:-.02em;line-height:1.08}
.yrki-led-v{text-align:right}

/* register marquee — the mobile sizing from the THG fix is baked in */
.yrki-skyline{width:100%;overflow:hidden;font-size:clamp(1.3rem,4.2vw,3.4rem);
  padding-block:.72em .28em}
.yrki-skyline-track{display:inline-flex;align-items:flex-end;will-change:transform}
.yrki-skyline.is-static{overflow-x:auto;-webkit-overflow-scrolling:touch}
.yrki-skyline.is-static .yrki-sky{padding-inline:clamp(18px,3.4vw,52px)}
.yrki-sky{list-style:none;margin:0;padding:0;display:inline-flex;flex:0 0 auto;
  align-items:flex-end;gap:0;font-size:inherit;
  letter-spacing:-.028em;line-height:1.06;white-space:nowrap}
.yrki-sky li{transform:translateY(var(--r,0));white-space:nowrap;padding-inline:.42em}
.yrki-sky li:nth-child(even){color:${MUTED}}
@media (prefers-reduced-motion:reduce){.yrki-sky li{transform:none}}
@media (max-width:759px){
  #yrki-register{padding-bottom:clamp(24px,4vh,40px)}
  .yrki-skyline{font-size:clamp(2.4rem,9vw,3.4rem);padding-block:.62em .46em}
}

/* interiors pair */
.yrki-pair{display:grid;gap:clamp(14px,2vw,28px)}
@media (min-width:820px){.yrki-pair{grid-template-columns:1fr 1fr;align-items:start}
  .yrki-pair>*:nth-child(2){margin-top:clamp(28px,5vw,88px)}}

/* enquiry */
.yrki-field{display:block;box-sizing:border-box;min-height:44px;border:0;border-bottom:1px solid ${RULE};
  background:none;width:100%;padding:.85rem 0;font:inherit;font-size:1.05rem;color:${INK};border-radius:0}
.yrki-field:focus{outline:none;border-bottom-color:${INK}}
.yrki-lab{font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:${MUTED}}
.yrki-send{display:inline-block;position:relative;margin-top:1.8rem;font-size:clamp(1.1rem,2vw,1.5rem);
  color:${INK};text-decoration:none;border-bottom:1px solid ${INK};padding-bottom:.1em}
.yrki-send::before{content:'';position:absolute;inset:-10px -6px}
.yrki-contact{position:relative}
.yrki-contact::before{content:'';position:absolute;inset:-11px -4px}
.yrki-send:hover{opacity:.6}

/* ═══ premium layer — the drawing-sheet language ═══ */
/* ghost numeral behind the diagram: outline-only display figure */
#yrki-scale{position:relative;overflow:hidden}
.yrki-ghost{position:absolute;right:clamp(8px,2vw,40px);top:44%;transform:translateY(-50%);
  font-family:'YRKI Hedvig',Georgia,serif;font-size:clamp(10rem,24vw,21rem);line-height:1;
  color:transparent;-webkit-text-stroke:1.2px rgba(17,17,17,.09);
  pointer-events:none;user-select:none;white-space:nowrap}
@media (max-width:759px){.yrki-ghost{display:none}}

/* hero title block, bottom right — the sheet's own corner stamp */
.yrki-tblock{position:absolute;right:clamp(18px,3.4vw,52px);bottom:clamp(16px,2.6vw,40px);
  margin:0;color:#fff;display:grid;gap:.5em;text-align:right;
  border-right:1px solid rgba(255,255,255,.4);padding-right:1.2em}
.yrki-tblock>div{display:grid;gap:.15em}
.yrki-tblock dt{margin:0;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.62)}
.yrki-tblock dd{margin:0;font-family:'YRKI Hedvig',Georgia,serif;font-size:clamp(14px,1.15vw,17px);line-height:1}
@media (max-width:899px){.yrki-tblock{display:none}}

/* marquee: fade the register in and out at the edges */
.yrki-skyline{-webkit-mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent);
  mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)}

/* the close: a display-size line, not a small link */
.yrki-send{font-family:'YRKI Hedvig',Georgia,serif;font-size:clamp(1.5rem,3.2vw,2.9rem);
  letter-spacing:-.015em;border-bottom-width:2px}

/* statement gets one size more air */
.yrki-statement{font-size:clamp(1.5rem,4vw,3.4rem);line-height:1.1}

/* hairline print edge on every framed photograph */
.yrki-frame::after{content:'';position:absolute;inset:0;box-shadow:inset 0 0 0 1px rgba(17,17,17,.06);pointer-events:none}
${WORK_LIST_CSS}
${PRELOADER_CSS}
${DIAGRAM_CSS}
${MOBILE_NAV_CSS}
`

/* ── text that rises out of a mask ─────────────────────────────────────── */
function Rise({ children, className, style }: { children: string; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={`yrki-m ${className ?? ''}`} style={style}>
      <span>{children}</span>
    </span>
  )
}

/* ── a photograph in a masked frame whose inner wrapper drifts ─────────── */
function Frame({
  file, alt, ratio = '3 / 2', drift = 10, priority = false,
}: { file: string; alt: string; ratio?: string; drift?: number; priority?: boolean }) {
  return (
    <div className="yrki-frame" style={{ aspectRatio: ratio }}>
      <div
        className="yrki-frame-in"
        data-yrki-drift={drift}
        style={{ '--dz': `${Math.max(9, drift * 1.35).toFixed(2)}%` } as React.CSSProperties}
      >
        <img
          src={IMG(file)} alt={alt}
          loading={priority ? 'eager' : 'lazy'} decoding="async"
          {...(priority ? { fetchpriority: 'high' } : {})}
        />
      </div>
    </div>
  )
}

export default function YrkiPage() {
  const company = getPreviewCompany('yrki')
  const rootRef = useRef<HTMLDivElement>(null)
  const [inkChrome, setInkChrome] = useState(false)
  const inkRef = useRef(false)
  const lenisRef = useRef<Lenis | null>(null)
  const [form, setForm] = useState({ name: '', email: '', topic: ENQUIRY_TOPICS[0] })

  useEffect(() => setNoindex(true), [])

  useEffect(() => {
    document.title = PAGE_TITLE
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const created = !meta
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    const prevDesc = meta.content
    meta.content = PAGE_DESCRIPTION
    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(ld)
    return () => {
      ld.remove()
      if (created) meta?.remove()
      else if (meta) meta.content = prevDesc
    }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduced = prefersReduced()

    if (!reduced) root.classList.add('yrki-js')
    const targets = Array.from(root.querySelectorAll<HTMLElement>('.yrki-m,.yrki-r,.yrki-rule'))
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) } }),
      { rootMargin: '0px 0px -10% 0px', threshold: 0.01 },
    )
    if (!reduced) targets.forEach((t) => io.observe(t))
    const failsafe = window.setTimeout(() => targets.forEach((t) => t.classList.add('is-in')), 2000)

    /* premium: small ledger figures count up as they arrive. Years and other
       4-digit values stay static (a spinning 1997 reads cheap); the failsafe
       writes the final figure no matter what. */
    const counters = Array.from(root.querySelectorAll<HTMLElement>('.yrki-led-v .yrki-m>span'))
      .filter((el) => /^\d{1,3}$/.test((el.textContent || '').trim()))
    counters.forEach((el) => { el.dataset.final = (el.textContent || '').trim() })
    let io2: IntersectionObserver | null = null
    if (!reduced && counters.length) {
      io2 = new IntersectionObserver((es) => es.forEach((e) => {
        if (!e.isIntersecting) return
        const el = e.target as HTMLElement
        io2!.unobserve(el)
        const final = Number(el.dataset.final)
        const t0 = performance.now()
        const D = 1100
        const tick = (t: number) => {
          const pr = Math.min(1, (t - t0) / D)
          const ease = 1 - Math.pow(1 - pr, 3)
          el.textContent = String(Math.round(final * ease))
          if (pr < 1) requestAnimationFrame(tick)
          else el.textContent = String(final)
        }
        requestAnimationFrame(tick)
      }), { threshold: 0.6 })
      counters.forEach((el) => io2!.observe(el))
    }
    const counterFailsafe = window.setTimeout(() => {
      counters.forEach((el) => { if (el.dataset.final) el.textContent = el.dataset.final })
    }, 2600)

    const frames = Array.from(root.querySelectorAll<HTMLElement>('.yrki-frame-in'))
    const drifters = reduced ? [] : Array.from(root.querySelectorAll<HTMLElement>('[data-yrki-tdrift]'))
    const hero = root.querySelector<HTMLElement>('.yrki-hero')

    /* One pass, reads first then writes — never interleave. */
    const onScroll = () => {
      const vh = window.innerHeight
      const writes: Array<[HTMLElement, string]> = []
      for (const el of frames) {
        const box = el.parentElement
        if (!box) continue
        const r = box.getBoundingClientRect()
        if (r.bottom < -240 || r.top > vh + 240) continue
        const amt = Number(el.dataset.yrkiDrift || 10)
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
        writes.push([el, `translate3d(0,${(-p * amt).toFixed(2)}%,0)`])
      }
      for (const el of drifters) {
        const r = el.getBoundingClientRect()
        if (r.bottom < -240 || r.top > vh + 240) continue
        const amt = Number(el.dataset.yrkiTdrift || 4)
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
        writes.push([el, `translate3d(0,${(-p * amt).toFixed(2)}px,0)`])
      }
      const heroRect = hero ? hero.getBoundingClientRect() : null
      for (const [el, t] of writes) el.style.transform = t
      if (heroRect) {
        const wantInk = heroRect.bottom < 88
        if (wantInk !== inkRef.current) { inkRef.current = wantInk; setInkChrome(wantInk) }
      }
    }

    let lenis: Lenis | null = null
    let raf = 0
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
      lenisRef.current = lenis
      const loop = (t: number) => { lenis?.raf(t); onScroll(); raf = requestAnimationFrame(loop) }
      raf = requestAnimationFrame(loop)
    } else {
      window.addEventListener('scroll', onScroll, { passive: true })
    }
    onScroll()
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.clearTimeout(failsafe)
      window.clearTimeout(counterFailsafe)
      io2?.disconnect()
      io.disconnect()
      cancelAnimationFrame(raf)
      lenis?.destroy()
      lenisRef.current = null
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      root.classList.remove('yrki-js')
    }
  }, [])

  const mailto = useMemo(() => {
    const body = `Nafn: ${form.name}\nNetfang: ${form.email}\nErindi: ${form.topic}\n`
    return `mailto:${EMAIL}?subject=${encodeURIComponent('Fyrirspurn til Yrki arkitekta')}&body=${encodeURIComponent(body)}`
  }, [form])

  const H2: React.CSSProperties = {
    fontSize: 'clamp(1.5rem,3.6vw,3rem)', letterSpacing: '-.022em', lineHeight: 1.08, fontWeight: 400,
  }

  return (
    <div ref={rootRef} className="yrki-root">
      <style>{CSS}</style>
      <Preloader ink={INK} ground={GROUND} />
      <PreviewChrome company={company} />

      <header className={`yrki-chrome${inkChrome ? ' is-ink' : ''}`}>
        <a href="#yrki-top" className="yrki-wordmark">
          Yrki arkitektar<br /><span>{ADDRESS}</span>
        </a>
        <nav className="yrki-nav" aria-label="Efnisyfirlit">
          {NAV.map((n, i) => (
            <a key={n.id} href={`#${n.id}`}>{n.label}{i < NAV.length - 1 ? ',' : ''}</a>
          ))}
        </nav>
        <MobileNav items={NAV} lenisRef={lenisRef} />
      </header>

      <main id="yrki-top">
        {/* 1 · hero */}
        <section className="yrki-hero">
          <div className="yrki-frame" style={{ aspectRatio: 'auto', height: '100%' }}>
            <div className="yrki-frame-in" data-yrki-drift="6" style={{ '--dz': '9%' } as React.CSSProperties}>
              <img src={IMG(PHOTOS.hero.file)} alt={PHOTOS.hero.alt}
                   loading="eager" decoding="async" {...{ fetchpriority: 'high' }} />
            </div>
          </div>
          <div className="yrki-hero-scrim" aria-hidden />
          <dl className="yrki-tblock">
            <div><dt>Verk í skrá</dt><dd>86</dd></div>
            <div><dt>Stofnað</dt><dd>1997</dd></div>
            <div><dt>ISO 9001</dt><dd>2008</dd></div>
          </dl>
          <div className="yrki-hero-lock yrki-pad">
            <h1 style={{ fontWeight: 400 }}>
              <Rise className="yrki-lock">Yrki arkitektar</Rise>
              <Rise className="yrki-lock yrki-serif">frá 1997</Rise>
            </h1>
          </div>
        </section>

        {/* 2 · thesis — their own naming sentence */}
        <section id="yrki-thesis" className="yrki-sec yrki-pad">
          <div className="yrki-rule" />
          <p className="yrki-statement yrki-d" data-yrki-tdrift="34" style={{ margin: 'clamp(26px,3.6vw,48px) 0 0' }}>
            <Rise>Það jarðbundna.</Rise>
            <Rise className="yrki-serif">Og það ljóðræna.</Rise>
          </p>

          <div className="yrki-intro">
            <div>
              <p className="yrki-r yrki-d" data-yrki-tdrift="14" style={{ fontSize: 'clamp(1.05rem,1.5vw,1.32rem)', lineHeight: 1.5, letterSpacing: '-.01em' }}>
                Yrki var stofnað árið 1997 af {PRACTICE.founders}, í framhaldi af fyrstu verðlaunum sem þær
                hlutu fyrir Lækningaminjasafnið við Nesstofu. Nafnið vísar til sýnar stofunnar, að sameina
                það jarðbundna og ljóðræna í öllum verkefnum, frá þéttbýli til náttúru.
              </p>
              <p className="yrki-r yrki-d" data-yrki-tdrift="12" style={{ color: MUTED, lineHeight: 1.62, marginTop: '1.5rem', maxWidth: '46ch' }}>
                {PRACTICE.isoLine} Í dag starfar hjá Yrki {PRACTICE.staffLine} hönnuða í arkitektúr og skipulagi.
              </p>
            </div>
            <dl className="yrki-spec">
              {SPEC.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
          </div>
        </section>

        {/* 3 · THE WOW — the spread of scale, three published areas */}
        <section id="yrki-scale" className="yrki-sec yrki-pad">
          <div className="yrki-rule" />
          <span className="yrki-ghost" aria-hidden>2.280</span>
          <h2 className="yrki-d" data-yrki-tdrift="26" style={{ ...H2, margin: 'clamp(26px,3.6vw,48px) 0 .7rem' }}>
            <Rise>Tvö hundruð og tíu fermetrar,</Rise>
            <Rise className="yrki-serif">og tvö þúsund tvö hundruð og áttatíu.</Rise>
          </h2>
          <p className="yrki-r yrki-d" data-yrki-tdrift="12" style={{ color: MUTED, maxWidth: '46ch', lineHeight: 1.62, marginBottom: 'clamp(30px,4vw,58px)' }}>
            Sumarbústaður við Heklurætur sem Dezeen skrifaði um, nemendagarðar á Flateyri og frystigeymsla
            í Sundahöfn. Sama stofan, sami metnaður, hvort sem verkið er 210 fermetrar eða tíu sinnum stærra.
          </p>
          <Diagram />
          <p className="yrki-r" style={{ color: MUTED, fontSize: '.86rem', marginTop: '1.6rem' }}>
            Skýringarmynd af flatarmáli, ekki mæld teikning.
          </p>
        </section>

        {/* 3b · full bleed */}
        <Frame file={PHOTOS.band.file} alt={PHOTOS.band.alt} ratio="16 / 8" drift={13} />

        <section className="yrki-sec yrki-pad">
          <div className="yrki-rule" />
          <h2 className="yrki-d" data-yrki-tdrift="26" style={{ ...H2, marginTop: 'clamp(26px,3.6vw,52px)' }}>
            <Rise>Stofan var stofnuð</Rise>
            <Rise className="yrki-serif">á fyrstu verðlaunum.</Rise>
          </h2>
          <p className="yrki-r yrki-d" data-yrki-tdrift="12" style={{ color: MUTED, fontSize: 'clamp(1rem,1.2vw,1.1rem)', lineHeight: 1.62, maxWidth: '46ch', marginTop: '1.4rem' }}>
            Yrki arkitektar hlutu fyrstu verðlaun í opinni hönnunarsamkeppni um Lækningaminjasafn við
            Nesstofu á Seltjarnarnesi, og stofan var stofnuð í framhaldi af þeim. Verðlaunin hafa fylgt
            stofunni síðan, í samkeppnum, alútboðum og hugmyndaleitum um allt land.
          </p>
        </section>

        {/* 4 · ledger */}
        <section className="yrki-sec yrki-pad">
          <div className="yrki-ledger">
            {LEDGER.map(([k, v]) => (
              <div className="yrki-led" key={k}>
                <span className="yrki-led-k"><Rise>{k}</Rise></span>
                <span className="yrki-led-v yrki-serif"><Rise>{v}</Rise></span>
              </div>
            ))}
          </div>
        </section>

        {/* 5 · the works */}
        <section id="yrki-works" className="yrki-sec yrki-pad">
          <h2 className="yrki-d" data-yrki-tdrift="26" style={{ ...H2, marginBottom: '.7rem' }}><Rise>Verkin</Rise></h2>
          <p className="yrki-r yrki-d" data-yrki-tdrift="12" style={{ color: MUTED, maxWidth: '46ch', lineHeight: 1.6, marginBottom: 'clamp(24px,3.4vw,48px)' }}>
            Sjö af áttatíu og sex verkum í skránni, þau sem sýna breiddina best.
          </p>
          <WorkList />
        </section>

        {/* 5b · innandyra */}
        <section className="yrki-sec yrki-pad">
          <h2 className="yrki-d" data-yrki-tdrift="26" style={{ ...H2, marginBottom: 'clamp(24px,3.4vw,48px)' }}>
            <Rise>Innandyra</Rise>
          </h2>
          <div className="yrki-pair">
            <Frame file={PHOTOS.insideA.file} alt={PHOTOS.insideA.alt} ratio="4 / 3" drift={10} />
            <Frame file={PHOTOS.insideB.file} alt={PHOTOS.insideB.alt} ratio="4 / 3" drift={10} />
          </div>
        </section>

        {/* 6 · the register */}
        <section id="yrki-register" className="yrki-sec yrki-pad">
          <div className="yrki-rule" />
          <h2 className="yrki-d" data-yrki-tdrift="26" style={{ ...H2, margin: 'clamp(26px,3.6vw,48px) 0 .7rem' }}>
            <Rise>Áttatíu og sex verk</Rise>
            <Rise className="yrki-serif">í skránni</Rise>
          </h2>
          <p className="yrki-r yrki-d" data-yrki-tdrift="12" style={{ color: MUTED, maxWidth: '46ch', lineHeight: 1.6 }}>
            Skólar, hjúkrunarheimili, höfuðstöðvar, sumarhús, skipulag og samkeppnir. Öll skráð á vef stofunnar.
          </p>
        </section>

        <Register
          label="Verkefnaskrá Yrki arkitekta"
          peaks={REGISTER.map((name, i) => ({ name, rise: REGISTER_RISE[i % REGISTER_RISE.length] }))}
        />

        {/* 7 · services */}
        <section id="yrki-services" className="yrki-sec yrki-pad" style={{ background: BAND }}>
          <h2 className="yrki-d" data-yrki-tdrift="26" style={{ ...H2, marginBottom: '1.4rem' }}><Rise>Þjónustan</Rise></h2>
          <div className="yrki-ledger">
            {SERVICES.map(([k, v]) => (
              <div className="yrki-led" key={k}>
                <span className="yrki-led-k"><Rise>{k}</Rise></span>
                <span className="yrki-led-v yrki-serif"><Rise>{v}</Rise></span>
              </div>
            ))}
          </div>
          <p className="yrki-r yrki-d" data-yrki-tdrift="12" style={{ color: MUTED, marginTop: '1.3rem', maxWidth: '46ch', lineHeight: 1.6 }}>
            Öll svið stofunnar eins og hún lýsir þeim sjálf.
          </p>
        </section>

        {/* 7b · closing frame */}
        <Frame file={PHOTOS.closing.file} alt={PHOTOS.closing.alt} ratio="16 / 8" drift={11} />

        {/* 8 · enquiry */}
        <section id="yrki-enquiry" className="yrki-sec yrki-pad">
          <h2 className="yrki-d" data-yrki-tdrift="40" style={{ fontSize: 'clamp(1.9rem,5.2vw,4.6rem)', letterSpacing: '-.028em', lineHeight: 1.02, fontWeight: 400, marginBottom: 'clamp(28px,4vw,56px)' }}>
            <Rise>Fyrirspurn</Rise>
          </h2>
          <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '44rem' }}>
            <label>
              <span className="yrki-lab">Nafn</span>
              <input className="yrki-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label>
              <span className="yrki-lab">Netfang</span>
              <input className="yrki-field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label>
              <span className="yrki-lab">Erindi</span>
              <select className="yrki-field" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
                {ENQUIRY_TOPICS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <a className="yrki-send" href={mailto}>Senda fyrirspurn</a>
          </div>

          <div className="yrki-rule" style={{ margin: 'clamp(48px,7vw,96px) 0 1.5rem' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem 2.2rem', color: MUTED, fontSize: '.98rem' }}>
            <a className="yrki-contact" href={EMAIL_HREF} style={{ color: INK }}>{EMAIL}</a>
            <a className="yrki-contact" href={PHONE_HREF} style={{ color: INK }}>{PHONE_DISPLAY}</a>
            <span>Yrki arkitektar ehf.</span>
            <span>{ADDRESS}</span>
          </div>
        </section>
      </main>

      <PreviewFooter company={company} />
    </div>
  )
}
