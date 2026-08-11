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
  IMG, ADDRESS, EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF, KT,
  PHOTOS, SPEC, LEDGER, SERVICES, REGISTER, REGISTER_RISE, ENQUIRY_TOPICS, NAV,
  PAGE_TITLE, PAGE_DESCRIPTION, JSON_LD,
} from './data'

/* ═════════════════════════════════════════════════════════════════════════
   T.ARK ARKITEKTAR — the Heklusýn machine, device for device. Same premium
   look, T.ark's facts:

     · Lenis + CSS transforms, zero canvas, real <img> throughout
     · .tark-frame / .tark-frame-in image drift, inset derived from drift
     · .tark-m masked translateY(108%) arrival, .tark-d continuous drift,
       .tark-rule scaleX wipe, .tark-r soft rise
     · percentage preloader whose wordmark fills as the number climbs
     · cursor-following photograph over a typeset list of works
     · velocity-driven register marquee (42 titles across their six fields)
     · a scale diagram of the Laugarás house and its lagoon, two published
       areas from one verbatim line: "Hús 3000m2, lón 1000m2"

   The thesis is the register's own spread: the same practice is lead
   designer of Hellisheiðarvirkjun and architect of Sky Lagoon. Facts
   harvested from tark.is on 2026-08-10; "skráð 1978" derives from their
   published kennitala, stated as registration only.
   ═════════════════════════════════════════════════════════════════════════ */

const BASE = import.meta.env.BASE_URL
const GROUND = '#ffffff'
const INK = '#111111'
const MUTED = '#767676'
const RULE = '#e2e2e2'
const BAND = '#f0f0f0'

const SANS = "'TARK Switzer', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
const SERIF = "'TARK Hedvig', Georgia, 'Times New Roman', serif"
const EASE = 'cubic-bezier(.17,.84,.44,1)'

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const CSS = `
@font-face{font-family:'TARK Switzer';src:url('${BASE}fonts/switzer/Switzer-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'TARK Switzer';src:url('${BASE}fonts/switzer/Switzer-Medium.woff2') format('woff2');font-weight:500;font-display:swap}
@font-face{font-family:'TARK Switzer';src:url('${BASE}fonts/switzer/Switzer-Semibold.woff2') format('woff2');font-weight:600;font-display:swap}
@font-face{font-family:'TARK Hedvig';src:url('${BASE}fonts/hedvig/hedvig-latin.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'TARK Hedvig';src:url('${BASE}fonts/hedvig/hedvig-latin-ext.woff2') format('woff2');font-weight:400;font-display:swap;unicode-range:U+0100-024F,U+1E00-1EFF,U+20A0-20AB,U+2C60-2C7F,U+A720-A7FF}

.tark-root{background:${GROUND};color:${INK};font-family:${SANS};-webkit-font-smoothing:antialiased;overflow-x:clip}
.tark-root *,.tark-root *::before,.tark-root *::after{box-sizing:border-box}
.tark-root h1,.tark-root h2,.tark-root p,.tark-root figure{margin:0}
.tark-root img{display:block;max-width:100%}
.tark-serif{font-family:${SERIF};font-weight:400;font-style:normal}
.tark-root :focus-visible{outline:2px solid currentColor;outline-offset:3px}

.tark-pad{padding-inline:clamp(18px,3.4vw,52px)}
.tark-sec{padding-block:clamp(72px,11vh,148px)}
main > section[id]{scroll-margin-top:clamp(56px,9vh,96px)}

/* rule wipe */
.tark-rule{height:1px;background:${RULE};transform-origin:left center}
.tark-js .tark-rule{transform:scaleX(0);transition:transform 1.1s ${EASE}}
.tark-js .tark-rule.is-in{transform:scaleX(1)}

/* THE text device — translateY inside a mask; resting state VISIBLE */
.tark-m{display:block;overflow:hidden;padding-bottom:.22em;margin-bottom:-.22em}
.tark-m>span{display:block;transform:none}
.tark-js .tark-m>span{transform:translateY(108%);transition:transform 1.05s ${EASE}}
.tark-js .tark-m.is-in>span{transform:none}

/* continuous scroll drift for type, separate wrapper */
.tark-d{display:block;will-change:transform}
@media (prefers-reduced-motion:reduce){.tark-d{will-change:auto;transform:none!important}}

/* soft rise for non-display blocks */
.tark-r{opacity:1;transform:none}
.tark-js .tark-r{opacity:0;transform:translateY(24px);transition:opacity .9s ${EASE},transform .9s ${EASE}}
.tark-js .tark-r.is-in{opacity:1;transform:none}

/* THE image device — masked frame, inner wrapper drifts, inset derived */
.tark-frame{position:relative;overflow:hidden;width:100%}
.tark-frame-in{position:absolute;inset:calc(-1 * var(--dz,9%)) 0;will-change:transform}
.tark-frame-in img{width:100%;height:100%;object-fit:cover}
@media (prefers-reduced-motion:reduce){.tark-frame-in{inset:0;will-change:auto;transform:none!important}}

/* fixed chrome */
.tark-chrome{position:fixed;top:0;left:0;right:0;z-index:40;display:flex;align-items:flex-start;
  justify-content:space-between;gap:2rem;padding:clamp(14px,2vw,26px) clamp(18px,3.4vw,52px);
  pointer-events:none;color:#fff;transition:color .45s ${EASE}}
.tark-chrome.is-ink{color:${INK}}
.tark-chrome a{pointer-events:auto;color:inherit;text-decoration:none}
.tark-wordmark{font-size:clamp(12px,1vw,15px);line-height:1.2;font-weight:400}
@media (max-width:759px){
  .tark-wordmark{line-height:1.2;font-size:12px}
  .tark-wordmark br{display:none}
  .tark-wordmark span{display:none}
  .tark-sec{padding-block:clamp(84px,14vh,148px) clamp(72px,11vh,148px)}
}
.tark-nav{display:flex;gap:.3em;flex-wrap:wrap;justify-content:flex-end;max-width:62vw;
  font-size:clamp(12px,1vw,15px);font-weight:400}
.tark-nav a{white-space:nowrap}
.tark-nav a:hover{opacity:.55}

/* hero */
.tark-hero{position:relative;height:100svh;min-height:540px;overflow:hidden}
.tark-hero>.tark-frame{position:absolute;inset:0}
.tark-hero-scrim{position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(180deg,rgba(0,0,0,.30) 0%,rgba(0,0,0,.02) 26%,rgba(0,0,0,.10) 52%,rgba(0,0,0,.52) 82%,rgba(0,0,0,.74) 100%)}
/* cinematic settle: the hero photograph eases out of a slight push-in once,
   on the IMG so it never fights the scroll loop's transform on the wrapper.
   Keyframes are prefixed per-page — no style bleed between builds. */
@keyframes tark-heroSettle{from{transform:scale(1.075)}to{transform:scale(1)}}
.tark-hero .tark-frame-in img{transform-origin:50% 55%;
  animation:tark-heroSettle 2600ms cubic-bezier(.17,.84,.44,1) both}
@media (prefers-reduced-motion:reduce){.tark-hero .tark-frame-in img{animation:none}}
.tark-hero-lock{position:absolute;left:0;right:0;bottom:clamp(16px,2.6vw,40px);color:#fff}
.tark-lock{display:block;font-weight:400;letter-spacing:-.03em;line-height:.98;
  font-size:clamp(1.9rem,7.4vw,7.2rem)}

/* statement */
.tark-statement{max-width:22ch;color:${MUTED};
  font-size:clamp(1.35rem,3.6vw,3rem);line-height:1.14;letter-spacing:-.022em;font-weight:400}
.tark-statement .tark-serif{color:${INK}}

/* intro + spec */
.tark-intro{display:grid;gap:clamp(30px,4.5vw,72px);margin-top:clamp(30px,4vw,60px)}
@media (min-width:900px){.tark-intro{grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);align-items:start}}
.tark-spec{margin:0;border-top:1px solid ${RULE}}
.tark-spec>div{display:flex;justify-content:space-between;gap:1.2rem;align-items:baseline;
  padding-block:clamp(11px,1.3vw,16px);border-bottom:1px solid ${RULE}}
.tark-spec dt{margin:0;color:${MUTED};font-size:clamp(.84rem,1vw,.96rem)}
.tark-spec dd{margin:0;text-align:right;font-size:clamp(.95rem,1.15vw,1.08rem)}

/* ledger */
.tark-ledger{border-top:1px solid ${RULE}}
.tark-led{display:grid;grid-template-columns:1fr auto;gap:1.4rem;align-items:baseline;
  padding-block:clamp(13px,1.5vw,21px);border-bottom:1px solid ${RULE}}
.tark-led-k,.tark-led-v{font-size:clamp(1.15rem,2.8vw,2.3rem);letter-spacing:-.02em;line-height:1.08}
.tark-led-v{text-align:right}

/* register marquee — the mobile sizing from the THG fix is baked in */
.tark-skyline{width:100%;overflow:hidden;font-size:clamp(1.3rem,4.2vw,3.4rem);
  padding-block:.72em .28em}
.tark-skyline-track{display:inline-flex;align-items:flex-end;will-change:transform}
.tark-skyline.is-static{overflow-x:auto;-webkit-overflow-scrolling:touch}
.tark-skyline.is-static .tark-sky{padding-inline:clamp(18px,3.4vw,52px)}
.tark-sky{list-style:none;margin:0;padding:0;display:inline-flex;flex:0 0 auto;
  align-items:flex-end;gap:0;font-size:inherit;
  letter-spacing:-.028em;line-height:1.06;white-space:nowrap}
.tark-sky li{transform:translateY(var(--r,0));white-space:nowrap;padding-inline:.42em}
.tark-sky li:nth-child(even){color:${MUTED}}
@media (prefers-reduced-motion:reduce){.tark-sky li{transform:none}}
@media (max-width:759px){
  #tark-register{padding-bottom:clamp(24px,4vh,40px)}
  .tark-skyline{font-size:clamp(2.4rem,9vw,3.4rem);padding-block:.62em .46em}
}

/* interiors pair */
.tark-pair{display:grid;gap:clamp(14px,2vw,28px)}
@media (min-width:820px){.tark-pair{grid-template-columns:1fr 1fr;align-items:start}
  .tark-pair>*:nth-child(2){margin-top:clamp(28px,5vw,88px)}}

/* enquiry */
.tark-field{display:block;box-sizing:border-box;min-height:44px;border:0;border-bottom:1px solid ${RULE};
  background:none;width:100%;padding:.85rem 0;font:inherit;font-size:1.05rem;color:${INK};border-radius:0}
.tark-field:focus{outline:none;border-bottom-color:${INK}}
.tark-lab{font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:${MUTED}}
.tark-send{display:inline-block;position:relative;margin-top:1.8rem;font-size:clamp(1.1rem,2vw,1.5rem);
  color:${INK};text-decoration:none;border-bottom:1px solid ${INK};padding-bottom:.1em}
.tark-send::before{content:'';position:absolute;inset:-10px -6px}
.tark-contact{position:relative}
.tark-contact::before{content:'';position:absolute;inset:-11px -4px}
.tark-send:hover{opacity:.6}

/* ═══ premium layer — the drawing-sheet language ═══ */
/* ghost numeral behind the diagram: outline-only display figure */
#tark-scale{position:relative;overflow:hidden}
.tark-ghost{position:absolute;right:clamp(8px,2vw,40px);top:44%;transform:translateY(-50%);
  font-family:'TARK Hedvig',Georgia,serif;font-size:clamp(10rem,24vw,21rem);line-height:1;
  color:transparent;-webkit-text-stroke:1.2px rgba(17,17,17,.09);
  pointer-events:none;user-select:none;white-space:nowrap}
@media (max-width:759px){.tark-ghost{display:none}}

/* hero title block, bottom right — the sheet's own corner stamp */
.tark-tblock{position:absolute;right:clamp(18px,3.4vw,52px);bottom:clamp(16px,2.6vw,40px);
  margin:0;color:#fff;display:grid;gap:.5em;text-align:right;
  border-right:1px solid rgba(255,255,255,.4);padding-right:1.2em}
.tark-tblock>div{display:grid;gap:.15em}
.tark-tblock dt{margin:0;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.62)}
.tark-tblock dd{margin:0;font-family:'TARK Hedvig',Georgia,serif;font-size:clamp(14px,1.15vw,17px);line-height:1}
@media (max-width:899px){.tark-tblock{display:none}}

/* marquee: fade the register in and out at the edges */
.tark-skyline{-webkit-mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent);
  mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)}

/* the close: a display-size line, not a small link */
.tark-send{font-family:'TARK Hedvig',Georgia,serif;font-size:clamp(1.5rem,3.2vw,2.9rem);
  letter-spacing:-.015em;border-bottom-width:2px}

/* statement gets one size more air */
.tark-statement{font-size:clamp(1.5rem,4vw,3.4rem);line-height:1.1}

/* hairline print edge on every framed photograph */
.tark-frame::after{content:'';position:absolute;inset:0;box-shadow:inset 0 0 0 1px rgba(17,17,17,.06);pointer-events:none}
${WORK_LIST_CSS}
${PRELOADER_CSS}
${DIAGRAM_CSS}
${MOBILE_NAV_CSS}
`

/* ── text that rises out of a mask ─────────────────────────────────────── */
function Rise({ children, className, style }: { children: string; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={`tark-m ${className ?? ''}`} style={style}>
      <span>{children}</span>
    </span>
  )
}

/* ── a photograph in a masked frame whose inner wrapper drifts ─────────── */
function Frame({
  file, alt, ratio = '3 / 2', drift = 10, priority = false,
}: { file: string; alt: string; ratio?: string; drift?: number; priority?: boolean }) {
  return (
    <div className="tark-frame" style={{ aspectRatio: ratio }}>
      <div
        className="tark-frame-in"
        data-tark-drift={drift}
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

export default function TarkPage() {
  const company = getPreviewCompany('tark')
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

    if (!reduced) root.classList.add('tark-js')
    const targets = Array.from(root.querySelectorAll<HTMLElement>('.tark-m,.tark-r,.tark-rule'))
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) } }),
      { rootMargin: '0px 0px -10% 0px', threshold: 0.01 },
    )
    if (!reduced) targets.forEach((t) => io.observe(t))
    const failsafe = window.setTimeout(() => targets.forEach((t) => t.classList.add('is-in')), 2000)

    /* premium: small ledger figures count up as they arrive. Years and other
       4-digit values stay static (a spinning 1997 reads cheap); the failsafe
       writes the final figure no matter what. */
    const counters = Array.from(root.querySelectorAll<HTMLElement>('.tark-led-v .tark-m>span'))
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

    const frames = Array.from(root.querySelectorAll<HTMLElement>('.tark-frame-in'))
    const drifters = reduced ? [] : Array.from(root.querySelectorAll<HTMLElement>('[data-tark-tdrift]'))
    const hero = root.querySelector<HTMLElement>('.tark-hero')

    /* One pass, reads first then writes — never interleave. */
    const onScroll = () => {
      const vh = window.innerHeight
      const writes: Array<[HTMLElement, string]> = []
      for (const el of frames) {
        const box = el.parentElement
        if (!box) continue
        const r = box.getBoundingClientRect()
        if (r.bottom < -240 || r.top > vh + 240) continue
        const amt = Number(el.dataset.tarkDrift || 10)
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
        writes.push([el, `translate3d(0,${(-p * amt).toFixed(2)}%,0)`])
      }
      for (const el of drifters) {
        const r = el.getBoundingClientRect()
        if (r.bottom < -240 || r.top > vh + 240) continue
        const amt = Number(el.dataset.tarkTdrift || 4)
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
      root.classList.remove('tark-js')
    }
  }, [])

  const mailto = useMemo(() => {
    const body = `Nafn: ${form.name}\nNetfang: ${form.email}\nErindi: ${form.topic}\n`
    return `mailto:${EMAIL}?subject=${encodeURIComponent('Fyrirspurn til T.ark arkitekta')}&body=${encodeURIComponent(body)}`
  }, [form])

  const H2: React.CSSProperties = {
    fontSize: 'clamp(1.5rem,3.6vw,3rem)', letterSpacing: '-.022em', lineHeight: 1.08, fontWeight: 400,
  }

  return (
    <div ref={rootRef} className="tark-root">
      <style>{CSS}</style>
      <Preloader ink={INK} ground={GROUND} />
      <PreviewChrome company={company} />

      <header className={`tark-chrome${inkChrome ? ' is-ink' : ''}`}>
        <a href="#tark-top" className="tark-wordmark">
          T.ark arkitektar<br /><span>{ADDRESS}</span>
        </a>
        <nav className="tark-nav" aria-label="Efnisyfirlit">
          {NAV.map((n, i) => (
            <a key={n.id} href={`#${n.id}`}>{n.label}{i < NAV.length - 1 ? ',' : ''}</a>
          ))}
        </nav>
        <MobileNav items={NAV} lenisRef={lenisRef} />
      </header>

      <main id="tark-top">
        {/* 1 · hero */}
        <section className="tark-hero">
          <div className="tark-frame" style={{ aspectRatio: 'auto', height: '100%' }}>
            <div className="tark-frame-in" data-tark-drift="6" style={{ '--dz': '9%' } as React.CSSProperties}>
              <img src={IMG(PHOTOS.hero.file)} alt={PHOTOS.hero.alt}
                   loading="eager" decoding="async" {...{ fetchpriority: 'high' }} />
            </div>
          </div>
          <div className="tark-hero-scrim" aria-hidden />
          <dl className="tark-tblock">
            <div><dt>Verk í skrá</dt><dd>42</dd></div>
            <div><dt>Skráð</dt><dd>1978</dd></div>
            <div><dt>Svið</dt><dd>6</dd></div>
          </dl>
          <div className="tark-hero-lock tark-pad">
            <h1 style={{ fontWeight: 400 }}>
              <Rise className="tark-lock">T.ark arkitektar</Rise>
              <Rise className="tark-lock tark-serif">frá 1978</Rise>
            </h1>
          </div>
        </section>

        {/* 2 · thesis — their own naming sentence */}
        <section id="tark-thesis" className="tark-sec tark-pad">
          <div className="tark-rule" />
          <p className="tark-statement tark-d" data-tark-tdrift="34" style={{ margin: 'clamp(26px,3.6vw,48px) 0 0' }}>
            <Rise>Frá virkjun</Rise>
            <Rise className="tark-serif">að baðlóni.</Rise>
          </p>

          <div className="tark-intro">
            <div>
              <p className="tark-r tark-d" data-tark-tdrift="14" style={{ fontSize: 'clamp(1.05rem,1.5vw,1.32rem)', lineHeight: 1.5, letterSpacing: '-.01em' }}>
                T.ark er tuttugu og sex manna stofa í Hátúni 2b, skráð 1978, í eigu ellefu starfsmanna
                sinna. Verkin spanna sex svið: sama stofan var aðalhönnuður Hellisheiðarvirkjunar fyrir ON
                og arkitekt Sky Lagoon á Kársnesi, teiknaði 74 íbúðir við Austurhöfn og viðbyggingu við
                Sundhöll Reykjavíkur.
              </p>
              <p className="tark-r tark-d" data-tark-tdrift="12" style={{ color: MUTED, lineHeight: 1.62, marginTop: '1.5rem', maxWidth: '46ch' }}>
                Fyrstu verðlaun fylgja skránni: alþjóðleg samkeppni C40 samtakanna og Reykjavíkurborgar
                um Ártún, og opin samkeppni um nýtt skipulag Stjórnarráðsreitsins.
              </p>
            </div>
            <dl className="tark-spec">
              {SPEC.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
          </div>
        </section>

        {/* 3 · THE WOW — the spread of scale, three published areas */}
        <section id="tark-scale" className="tark-sec tark-pad">
          <div className="tark-rule" />
          <span className="tark-ghost" aria-hidden>3.000</span>
          <h2 className="tark-d" data-tark-tdrift="26" style={{ ...H2, margin: 'clamp(26px,3.6vw,48px) 0 .7rem' }}>
            <Rise>Húsið er þrjú þúsund fermetrar,</Rise>
            <Rise className="tark-serif">lónið er eitt þúsund.</Rise>
          </h2>
          <p className="tark-r tark-d" data-tark-tdrift="12" style={{ color: MUTED, maxWidth: '46ch', lineHeight: 1.62, marginBottom: 'clamp(30px,4vw,58px)' }}>
            Laugarás Lagoon í Bláskógabyggð. Torfið kemur frá söndunum við Markarfljót og timburklæðningin
            er öll stikagreni úr Haukadalsskógi. Húsið ber lónið, ekki öfugt, og hlutföllin segja það sjálf.
          </p>
          <Diagram />
          <p className="tark-r" style={{ color: MUTED, fontSize: '.86rem', marginTop: '1.6rem' }}>
            Skýringarmynd af flatarmáli, ekki mæld teikning.
          </p>
        </section>

        {/* 3b · full bleed */}
        <Frame file={PHOTOS.band.file} alt={PHOTOS.band.alt} ratio="16 / 8" drift={13} />

        <section className="tark-sec tark-pad">
          <div className="tark-rule" />
          <h2 className="tark-d" data-tark-tdrift="26" style={{ ...H2, marginTop: 'clamp(26px,3.6vw,52px)' }}>
            <Rise>Nítján þúsund fermetrar</Rise>
            <Rise className="tark-serif">við hliðina á Hörpu.</Rise>
          </h2>
          <p className="tark-r tark-d" data-tark-tdrift="12" style={{ color: MUTED, fontSize: 'clamp(1rem,1.2vw,1.1rem)', lineHeight: 1.62, maxWidth: '46ch', marginTop: '1.4rem' }}>
            The Reykjavik Edition á Austurbakkanum er nítján þúsund fermetrar á sex hæðum, með 253
            gestaherbergjum, veitingastað, veislusal og heilsulind. Á sömu skrá standa skrifstofur Alþingis,
            Arion banki við Borgartún og 74 íbúðir við Austurhöfn. Hús sem fólk hefur þegar verið inni í,
            án þess að vita hver teiknaði þau.
          </p>
        </section>

        {/* 4 · ledger */}
        <section className="tark-sec tark-pad">
          <div className="tark-ledger">
            {LEDGER.map(([k, v]) => (
              <div className="tark-led" key={k}>
                <span className="tark-led-k"><Rise>{k}</Rise></span>
                <span className="tark-led-v tark-serif"><Rise>{v}</Rise></span>
              </div>
            ))}
          </div>
        </section>

        {/* 5 · the works */}
        <section id="tark-works" className="tark-sec tark-pad">
          <h2 className="tark-d" data-tark-tdrift="26" style={{ ...H2, marginBottom: '.7rem' }}><Rise>Verkin</Rise></h2>
          <p className="tark-r tark-d" data-tark-tdrift="12" style={{ color: MUTED, maxWidth: '46ch', lineHeight: 1.6, marginBottom: 'clamp(24px,3.4vw,48px)' }}>
            Sjö af fjörutíu og tveimur verkum í skránni, þau sem sýna sviðin sex best.
          </p>
          <WorkList />
        </section>

        {/* 5b · innandyra */}
        <section className="tark-sec tark-pad">
          <h2 className="tark-d" data-tark-tdrift="26" style={{ ...H2, marginBottom: 'clamp(24px,3.4vw,48px)' }}>
            <Rise>Innandyra</Rise>
          </h2>
          <div className="tark-pair">
            <Frame file={PHOTOS.insideA.file} alt={PHOTOS.insideA.alt} ratio="4 / 3" drift={10} />
            <Frame file={PHOTOS.insideB.file} alt={PHOTOS.insideB.alt} ratio="4 / 3" drift={10} />
          </div>
        </section>

        {/* 6 · the register */}
        <section id="tark-register" className="tark-sec tark-pad">
          <div className="tark-rule" />
          <h2 className="tark-d" data-tark-tdrift="26" style={{ ...H2, margin: 'clamp(26px,3.6vw,48px) 0 .7rem' }}>
            <Rise>Fjörutíu og tvö verk</Rise>
            <Rise className="tark-serif">á sex sviðum</Rise>
          </h2>
          <p className="tark-r tark-d" data-tark-tdrift="12" style={{ color: MUTED, maxWidth: '46ch', lineHeight: 1.6 }}>
            Atvinnuhúsnæði, íbúðir, hótel og ferðaþjónusta, skólar og íþróttir, skipulag og iðnaður.
            Öll skráð á vef stofunnar.
          </p>
        </section>

        <Register
          label="Verkefnaskrá T.ark arkitekta"
          peaks={REGISTER.map((name, i) => ({ name, rise: REGISTER_RISE[i % REGISTER_RISE.length] }))}
        />

        {/* 7 · services */}
        <section id="tark-services" className="tark-sec tark-pad" style={{ background: BAND }}>
          <h2 className="tark-d" data-tark-tdrift="26" style={{ ...H2, marginBottom: '1.4rem' }}><Rise>Þjónustan</Rise></h2>
          <div className="tark-ledger">
            {SERVICES.map(([k, v]) => (
              <div className="tark-led" key={k}>
                <span className="tark-led-k"><Rise>{k}</Rise></span>
                <span className="tark-led-v tark-serif"><Rise>{v}</Rise></span>
              </div>
            ))}
          </div>
          <p className="tark-r tark-d" data-tark-tdrift="12" style={{ color: MUTED, marginTop: '1.3rem', maxWidth: '46ch', lineHeight: 1.6 }}>
            Öll svið stofunnar eins og hún lýsir þeim sjálf.
          </p>
        </section>

        {/* 7b · closing frame */}
        <Frame file={PHOTOS.closing.file} alt={PHOTOS.closing.alt} ratio="16 / 8" drift={11} />

        {/* 8 · enquiry */}
        <section id="tark-enquiry" className="tark-sec tark-pad">
          <h2 className="tark-d" data-tark-tdrift="40" style={{ fontSize: 'clamp(1.9rem,5.2vw,4.6rem)', letterSpacing: '-.028em', lineHeight: 1.02, fontWeight: 400, marginBottom: 'clamp(28px,4vw,56px)' }}>
            <Rise>Fyrirspurn</Rise>
          </h2>
          <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '44rem' }}>
            <label>
              <span className="tark-lab">Nafn</span>
              <input className="tark-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label>
              <span className="tark-lab">Netfang</span>
              <input className="tark-field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label>
              <span className="tark-lab">Erindi</span>
              <select className="tark-field" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
                {ENQUIRY_TOPICS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <a className="tark-send" href={mailto}>Senda fyrirspurn</a>
          </div>

          <div className="tark-rule" style={{ margin: 'clamp(48px,7vw,96px) 0 1.5rem' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem 2.2rem', color: MUTED, fontSize: '.98rem' }}>
            <a className="tark-contact" href={EMAIL_HREF} style={{ color: INK }}>{EMAIL}</a>
            <a className="tark-contact" href={PHONE_HREF} style={{ color: INK }}>{PHONE_DISPLAY}</a>
            <span>T.ark arkitektar ehf. · {KT}</span>
            <span>{ADDRESS}</span>
          </div>
        </section>
      </main>

      <PreviewFooter company={company} />
    </div>
  )
}
