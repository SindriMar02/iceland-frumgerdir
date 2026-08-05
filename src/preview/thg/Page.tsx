import { useEffect, useMemo, useRef, useState } from 'react'
import Lenis from 'lenis'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { getPreviewCompany } from '../companies'
import { WorkList, WORK_LIST_CSS } from './WorkList'
import { Preloader, PRELOADER_CSS } from './Preloader'
import { Stadarandi, STADARANDI_CSS } from './Stadarandi'
import { Register } from './Register'
import { MobileNav, MOBILE_NAV_CSS } from './MobileNav'
import {
  IMG, ADDRESS, EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF, KT,
  PHOTOS, SPEC, LEDGER, SERVICES, REGISTER, REGISTER_RISE, ENQUIRY_TOPICS, NAV,
  PAGE_TITLE, PAGE_DESCRIPTION, JSON_LD,
} from './data'

/* ═════════════════════════════════════════════════════════════════════════
   THG ARKITEKTAR — the Heklusýn machine, device for device.

   The reference is src/preview/heklusyn/Page.tsx as it ships live, which was
   itself built against kononenkogroup.com AS MEASURED. Every device below is
   that page's, re-prefixed thg- and re-aimed at THG's own facts:

     · Lenis smooth scroll. No GSAP, no ScrollTrigger.
     · Real <img> elements, every one visible. No canvas, no WebGL.
     · Images move because an inner wrapper translates inside a frame with
       overflow:hidden (.thg-frame / .thg-frame-in). That is the whole image
       effect.
     · Text arrives by translateY(108%) inside a mask (.thg-m), and keeps
       drifting the whole time it is on screen on a separate wrapper
       (.thg-d + data-thg-tdrift) so two transforms never share an element.
     · Rules wipe with scaleX(0) → scaleX(1).
     · Percentage preloader whose wordmark fills as the number climbs.
     · Cursor-following photograph over a typeset list of works.
     · Velocity-driven marquee.
     · A scale diagram drawn from published areas only.

   THIS REPLACES the previous THG build, which rendered every photograph
   through a THREE.js fragment shader (webgl.ts / shaders.ts, both deleted).
   The Heklusýn file's own header records why that machine was abandoned
   there: "Different machine, heavier, crashed on mount twice, and the reason
   nothing felt like the reference." THG had never been given the correction.

   Facts: everything below is thg.is's own, re-verified 5 August 2026. Their
   register now lists TWENTY-TWO projects (it listed seven when the original
   brief was written) and their staff page names THIRTY-FOUR people (not
   "um fjörutíu"), so both numbers changed and the copy follows the site.
   ═════════════════════════════════════════════════════════════════════════ */

const BASE = import.meta.env.BASE_URL
const GROUND = '#ffffff'
const INK = '#111111'
const MUTED = '#767676'   /* 4.55:1 on white — AA for normal text */
const RULE = '#e2e2e2'
const BAND = '#f0f0f0'

const SANS = "'THG Switzer', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
const SERIF = "'THG Hedvig', Georgia, 'Times New Roman', serif"
const EASE = 'cubic-bezier(.17,.84,.44,1)'

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const CSS = `
@font-face{font-family:'THG Switzer';src:url('${BASE}fonts/switzer/Switzer-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'THG Switzer';src:url('${BASE}fonts/switzer/Switzer-Medium.woff2') format('woff2');font-weight:500;font-display:swap}
@font-face{font-family:'THG Switzer';src:url('${BASE}fonts/switzer/Switzer-Semibold.woff2') format('woff2');font-weight:600;font-display:swap}
@font-face{font-family:'THG Hedvig';src:url('${BASE}fonts/hedvig/hedvig-latin.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'THG Hedvig';src:url('${BASE}fonts/hedvig/hedvig-latin-ext.woff2') format('woff2');font-weight:400;font-display:swap;unicode-range:U+0100-024F,U+1E00-1EFF,U+20A0-20AB,U+2C60-2C7F,U+A720-A7FF}

.thg-root{background:${GROUND};color:${INK};font-family:${SANS};-webkit-font-smoothing:antialiased;overflow-x:clip}
.thg-root *,.thg-root *::before,.thg-root *::after{box-sizing:border-box}
.thg-root h1,.thg-root h2,.thg-root p,.thg-root figure{margin:0}
.thg-root img{display:block;max-width:100%}
.thg-serif{font-family:${SERIF};font-weight:400;font-style:normal}
.thg-root :focus-visible{outline:2px solid currentColor;outline-offset:3px}

.thg-pad{padding-inline:clamp(18px,3.4vw,52px)}
.thg-sec{padding-block:clamp(72px,11vh,148px)}
/* The chrome is fixed with no background, so an anchor jump lands the target
   at y=0, underneath it. Every nav target is a section id, and the mobile
   menu is entirely anchors, so without this each menu tap hides the heading
   it just scrolled to. */
main > section[id]{scroll-margin-top:clamp(56px,9vh,96px)}

/* rule wipe — measured scaleX(0) → scaleX(1) */
.thg-rule{height:1px;background:${RULE};transform-origin:left center}
.thg-js .thg-rule{transform:scaleX(0);transition:transform 1.1s ${EASE}}
.thg-js .thg-rule.is-in{transform:scaleX(1)}

/* THE text device — translateY inside a mask.
   Resting state is VISIBLE: the hidden start only exists while .thg-js is on
   the root, so a crawler, a paused rAF or a JS failure can never strand copy. */
/* padding-bottom/margin-bottom give the mask headroom for descenders (the
   serif's g/y/þ drop well below the line box) without adding visible gap
   between stacked lines — the negative margin cancels the padding's height. */
.thg-m{display:block;overflow:hidden;padding-bottom:.22em;margin-bottom:-.22em}
.thg-m>span{display:block;transform:none}
.thg-js .thg-m>span{transform:translateY(108%);transition:transform 1.05s ${EASE}}
.thg-js .thg-m.is-in>span{transform:none}

/* Continuous scroll drift for type. The mask reveal above handles ARRIVAL;
   this handles the whole time a block is on screen, so headlines and body
   travel at slightly different rates from the page and from each other.
   Kept on a separate wrapper element so the two never share a transform. */
.thg-d{display:block;will-change:transform}
@media (prefers-reduced-motion:reduce){.thg-d{will-change:auto;transform:none!important}}

/* soft rise for blocks that are not display type */
.thg-r{opacity:1;transform:none}
.thg-js .thg-r{opacity:0;transform:translateY(24px);transition:opacity .9s ${EASE},transform .9s ${EASE}}
.thg-js .thg-r.is-in{opacity:1;transform:none}

/* THE image device — masked frame, inner wrapper drifts.
   --dz is derived from the drift so the two cannot be changed independently:
   at drift 13 a fixed -9% inset runs out of overhang and the image's own edge
   slides into frame at the extremes of the travel. */
.thg-frame{position:relative;overflow:hidden;width:100%}
.thg-frame-in{position:absolute;inset:calc(-1 * var(--dz,9%)) 0;will-change:transform}
.thg-frame-in img{width:100%;height:100%;object-fit:cover}
@media (prefers-reduced-motion:reduce){.thg-frame-in{inset:0;will-change:auto;transform:none!important}}

/* fixed chrome */
.thg-chrome{position:fixed;top:0;left:0;right:0;z-index:40;display:flex;align-items:flex-start;
  justify-content:space-between;gap:2rem;padding:clamp(14px,2vw,26px) clamp(18px,3.4vw,52px);
  pointer-events:none;color:#fff;transition:color .45s ${EASE}}
.thg-chrome.is-ink{color:${INK}}
.thg-chrome a{pointer-events:auto;color:inherit;text-decoration:none}
.thg-wordmark{font-size:clamp(12px,1vw,15px);line-height:1.2;font-weight:400}
/* The chrome is fixed and has no background, so on a phone its three-line
   wordmark sat directly on top of section headings as they scrolled past.
   One line on narrow screens, and sections get enough top padding to clear it. */
@media (max-width:759px){
  .thg-wordmark{line-height:1.2;font-size:12px}
  .thg-wordmark br{display:none}
  .thg-wordmark span{display:none}
  .thg-sec{padding-block:clamp(84px,14vh,148px) clamp(72px,11vh,148px)}
}
.thg-nav{display:flex;gap:.3em;flex-wrap:wrap;justify-content:flex-end;max-width:62vw;
  font-size:clamp(12px,1vw,15px);font-weight:400}
.thg-nav a{white-space:nowrap}
.thg-nav a:hover{opacity:.55}

/* hero — full bleed, colossal lockup bottom left */
.thg-hero{position:relative;height:100svh;min-height:540px;overflow:hidden}
.thg-hero>.thg-frame{position:absolute;inset:0}
.thg-hero-scrim{position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(180deg,rgba(0,0,0,.34) 0%,rgba(0,0,0,.05) 32%,rgba(0,0,0,.28) 70%,rgba(0,0,0,.66) 100%)}
.thg-hero-lock{position:absolute;left:0;right:0;bottom:clamp(16px,2.6vw,40px);color:#fff}
/* line-height .9 was tight enough on its own to compress the line box below
   the serif's descender extent (g/y/þ). .98 keeps the same tight display
   rhythm but stops it fighting the mask's own headroom above.
   The clamp ceiling is 7.4vw where Heklusýn's is 10.6vw: "THG Arkitektar" is
   fourteen characters to "Heklusýn"'s eight, and at 10.6vw it overflowed the
   viewport on every width below about 1100px. */
.thg-lock{display:block;font-weight:400;letter-spacing:-.03em;line-height:.98;
  font-size:clamp(1.9rem,7.4vw,7.2rem)}

/* statement — the page's opening line. Set LEFT on the same edge as every
   other heading and with its rule ABOVE it: centred with the rule underneath,
   it read as a detached box floating in its own frame rather than as the
   first beat of the page. Larger than an h2 because it is the thesis, but it
   obeys the same grammar as the rest. */
.thg-statement{max-width:22ch;color:${MUTED};
  font-size:clamp(1.35rem,3.6vw,3rem);line-height:1.14;letter-spacing:-.022em;font-weight:400}
.thg-statement .thg-serif{color:${INK}}

/* intro + spec */
.thg-intro{display:grid;gap:clamp(30px,4.5vw,72px);margin-top:clamp(30px,4vw,60px)}
@media (min-width:900px){.thg-intro{grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);align-items:start}}
.thg-spec{margin:0;border-top:1px solid ${RULE}}
.thg-spec>div{display:flex;justify-content:space-between;gap:1.2rem;align-items:baseline;
  padding-block:clamp(11px,1.3vw,16px);border-bottom:1px solid ${RULE}}
.thg-spec dt{margin:0;color:${MUTED};font-size:clamp(.84rem,1vw,.96rem)}
.thg-spec dd{margin:0;text-align:right;font-size:clamp(.95rem,1.15vw,1.08rem)}

/* ledger */
.thg-ledger{border-top:1px solid ${RULE}}
.thg-led{display:grid;grid-template-columns:1fr auto;gap:1.4rem;align-items:baseline;
  padding-block:clamp(13px,1.5vw,21px);border-bottom:1px solid ${RULE}}
.thg-led-k,.thg-led-v{font-size:clamp(1.15rem,2.8vw,2.3rem);letter-spacing:-.02em;line-height:1.08}
.thg-led-v{text-align:right}

/* the register row. Full-bleed on purpose — it is a register, so it runs past
   both edges rather than stopping at the text column. */
/* Font size lives on the container so the padding below can be expressed in
   em and is therefore guaranteed to clear the tallest --r offset at every
   viewport. Without that top padding, overflow:hidden slices the raised
   names clean through the middle. */
.thg-skyline{width:100%;overflow:hidden;font-size:clamp(1.3rem,4.2vw,3.4rem);
  padding-block:.72em .28em}
.thg-skyline-track{display:inline-flex;align-items:flex-end;will-change:transform}
.thg-skyline.is-static{overflow-x:auto;-webkit-overflow-scrolling:touch}
.thg-skyline.is-static .thg-sky{padding-inline:clamp(18px,3.4vw,52px)}
.thg-sky{list-style:none;margin:0;padding:0;display:inline-flex;flex:0 0 auto;
  align-items:flex-end;gap:0;font-size:inherit;
  letter-spacing:-.028em;line-height:1.06;white-space:nowrap}
.thg-sky li{transform:translateY(var(--r,0));white-space:nowrap;padding-inline:.42em}
.thg-sky li:nth-child(even){color:${MUTED}}
@media (prefers-reduced-motion:reduce){.thg-sky li{transform:none}}

/* the interiors pair */
.thg-pair{display:grid;gap:clamp(14px,2vw,28px)}
@media (min-width:820px){.thg-pair{grid-template-columns:1fr 1fr;align-items:start}
  .thg-pair>*:nth-child(2){margin-top:clamp(28px,5vw,88px)}}

/* enquiry */
/* min-height:44px is the real tap-target floor (measured 21.5-24px before this,
   on a mobile audit — the underline look stays, the box just gets tall enough
   to tap reliably). */
.thg-field{display:block;box-sizing:border-box;min-height:44px;border:0;border-bottom:1px solid ${RULE};
  background:none;width:100%;padding:.85rem 0;font:inherit;font-size:1.05rem;color:${INK};border-radius:0}
.thg-field:focus{outline:none;border-bottom-color:${INK}}
.thg-lab{font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:${MUTED}}
/* .thg-send measured 29px tall — an invisible hit-slop grows the tap target to
   44px without visually bulking up a text link that's supposed to read light. */
.thg-send{display:inline-block;position:relative;margin-top:1.8rem;font-size:clamp(1.1rem,2vw,1.5rem);
  color:${INK};text-decoration:none;border-bottom:1px solid ${INK};padding-bottom:.1em}
.thg-send::before{content:'';position:absolute;inset:-10px -6px}
/* Same trick for the contact links: they measured 24px, and inline links in a
   flex row cannot take a min-height without breaking the baseline row. */
.thg-contact{position:relative}
.thg-contact::before{content:'';position:absolute;inset:-11px -4px}
.thg-send:hover{opacity:.6}
${WORK_LIST_CSS}
${PRELOADER_CSS}
${STADARANDI_CSS}
${MOBILE_NAV_CSS}
`

/* ── text that rises out of a mask ─────────────────────────────────────── */
function Rise({ children, className, style }: { children: string; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={`thg-m ${className ?? ''}`} style={style}>
      <span>{children}</span>
    </span>
  )
}

/* ── a photograph in a masked frame whose inner wrapper drifts ───────────
   The inset is DERIVED from the drift rather than fixed: at drift 13 a flat
   -9% runs out of overhang and the photograph's own edge slides into frame
   at the extremes of the travel. */
function Frame({
  file, alt, ratio = '3 / 2', drift = 10, priority = false,
}: { file: string; alt: string; ratio?: string; drift?: number; priority?: boolean }) {
  return (
    <div className="thg-frame" style={{ aspectRatio: ratio }}>
      <div
        className="thg-frame-in"
        data-thg-drift={drift}
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

export default function ThgPage() {
  const company = getPreviewCompany('thg')
  const rootRef = useRef<HTMLDivElement>(null)
  const [inkChrome, setInkChrome] = useState(false)
  const inkRef = useRef(false)
  const lenisRef = useRef<Lenis | null>(null)
  const [form, setForm] = useState({ name: '', email: '', topic: ENQUIRY_TOPICS[0] })

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

    if (!reduced) root.classList.add('thg-js')
    const targets = Array.from(root.querySelectorAll<HTMLElement>('.thg-m,.thg-r,.thg-rule'))
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) } }),
      { rootMargin: '0px 0px -10% 0px', threshold: 0.01 },
    )
    if (!reduced) targets.forEach((t) => io.observe(t))
    const failsafe = window.setTimeout(() => targets.forEach((t) => t.classList.add('is-in')), 2000)

    const frames = Array.from(root.querySelectorAll<HTMLElement>('.thg-frame-in'))
    const drifters = reduced ? [] : Array.from(root.querySelectorAll<HTMLElement>('[data-thg-tdrift]'))
    const hero = root.querySelector<HTMLElement>('.thg-hero')

    /* One pass, reads first then writes. Interleaving getBoundingClientRect
       with style.transform forces a synchronous layout per element — with
       ~18 tracked nodes that is 18 forced layouts every frame, which pins
       the main thread. Read everything, then write everything. */
    const onScroll = () => {
      const vh = window.innerHeight
      const writes: Array<[HTMLElement, string]> = []

      for (const el of frames) {
        const box = el.parentElement
        if (!box) continue
        const r = box.getBoundingClientRect()
        if (r.bottom < -240 || r.top > vh + 240) continue
        const amt = Number(el.dataset.thgDrift || 10)
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
        writes.push([el, `translate3d(0,${(-p * amt).toFixed(2)}%,0)`])
      }

      for (const el of drifters) {
        const r = el.getBoundingClientRect()
        if (r.bottom < -240 || r.top > vh + 240) continue
        const amt = Number(el.dataset.thgTdrift || 4)
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
        writes.push([el, `translate3d(0,${(-p * amt).toFixed(2)}px,0)`])
      }

      const heroRect = hero ? hero.getBoundingClientRect() : null

      // every read is done; now write
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
      io.disconnect()
      cancelAnimationFrame(raf)
      lenis?.destroy()
      lenisRef.current = null
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      root.classList.remove('thg-js')
    }
  }, [])

  const mailto = useMemo(() => {
    const body = `Nafn: ${form.name}\nNetfang: ${form.email}\nErindi: ${form.topic}\n`
    return `mailto:${EMAIL}?subject=${encodeURIComponent('Fyrirspurn til THG Arkitekta')}&body=${encodeURIComponent(body)}`
  }, [form])

  const H2: React.CSSProperties = {
    fontSize: 'clamp(1.5rem,3.6vw,3rem)', letterSpacing: '-.022em', lineHeight: 1.08, fontWeight: 400,
  }

  return (
    <div ref={rootRef} className="thg-root">
      <style>{CSS}</style>
      <Preloader ink={INK} ground={GROUND} />
      <PreviewChrome company={company} />

      <header className={`thg-chrome${inkChrome ? ' is-ink' : ''}`}>
        <a href="#thg-top" className="thg-wordmark">
          THG Arkitektar<br /><span>{ADDRESS}</span>
        </a>
        <nav className="thg-nav" aria-label="Efnisyfirlit">
          {NAV.map((n, i) => (
            <a key={n.id} href={`#${n.id}`}>{n.label}{i < NAV.length - 1 ? ',' : ''}</a>
          ))}
        </nav>
        <MobileNav items={NAV} lenisRef={lenisRef} />
      </header>

      <main id="thg-top">
        {/* 1 · hero */}
        <section className="thg-hero">
          <div className="thg-frame" style={{ aspectRatio: 'auto', height: '100%' }}>
            <div className="thg-frame-in" data-thg-drift="6" style={{ '--dz': '9%' } as React.CSSProperties}>
              <img src={IMG(PHOTOS.hero.file)} alt={PHOTOS.hero.alt}
                   loading="eager" decoding="async" {...{ fetchpriority: 'high' }} />
            </div>
          </div>
          <div className="thg-hero-scrim" aria-hidden />
          <div className="thg-hero-lock thg-pad">
            <h1 style={{ fontWeight: 400 }}>
              <Rise className="thg-lock">THG Arkitektar</Rise>
              <Rise className="thg-lock thg-serif">frá 1994</Rise>
            </h1>
          </div>
        </section>

        {/* 2 · what the practice actually is. Every claim is theirs: founded
             by Halldór Guðmundsson in October 1994, thirty-four named people
             on the staff page, twenty-two projects in the register, the
             services sentence verbatim, ISO 9001:2015 since 2016. */}
        <section id="thg-thesis" className="thg-sec thg-pad">
          <div className="thg-rule" />
          <p
            className="thg-statement thg-d"
            data-thg-tdrift="34"
            style={{ margin: 'clamp(26px,3.6vw,48px) 0 0' }}
          >
            <Rise>Ekki hús á auðum reit.</Rise>
            <Rise className="thg-serif">Hús sem á heima.</Rise>
          </p>

          <div className="thg-intro">
            <div>
              <p className="thg-r thg-d" data-thg-tdrift="14" style={{ fontSize: 'clamp(1.05rem,1.5vw,1.32rem)', lineHeight: 1.5, letterSpacing: '-.01em' }}>
                THG Arkitektar teiknar hótel, hjúkrunarheimili, þjónustuíbúðir, verslunar- og
                veitingarými. Halldór Guðmundsson arkitekt stofnaði stofuna í október 1994 og þar
                starfa þrjátíu og fjórir. Í verkefnaskránni eru tuttugu og tvö verk.
              </p>
              <p className="thg-r thg-d" data-thg-tdrift="12" style={{ color: MUTED, lineHeight: 1.62, marginTop: '1.5rem', maxWidth: '46ch' }}>
                Hönnun og ráðgjafarþjónusta í mannvirkjagerð á sviðum arkitektúrs, skipulags og
                umhverfishönnunar, auk verkumsjónar og eftirlits. Gæðakerfi stofunnar er vottað
                samkvæmt ÍST EN ISO 9001:2015.
              </p>
            </div>

            <dl className="thg-spec">
              {SPEC.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 3 · THE WOW — the thesis as an area, from their own two published
             numbers for Vík. See Stadarandi.tsx for the arithmetic and the
             honesty boundary. */}
        <section id="thg-vik" className="thg-sec thg-pad">
          <div className="thg-rule" />
          <h2 className="thg-d" data-thg-tdrift="26" style={{ ...H2, margin: 'clamp(26px,3.6vw,48px) 0 .7rem' }}>
            <Rise>Tvö þúsund sjö hundruð og þrjátíu fermetrar,</Rise>
            <Rise className="thg-serif">utan um átta hundruð og fimmtíu.</Rise>
          </h2>
          <p className="thg-r thg-d" data-thg-tdrift="12" style={{ color: MUTED, maxWidth: '46ch', lineHeight: 1.62, marginBottom: 'clamp(30px,4vw,58px)' }}>
            Endurhæfingarmiðstöð SÁÁ í Vík stækkar um 2.730 fermetra og verður 3.580 fermetrar alls.
            Húsið sem fyrir stóð er því 850 fermetrar. Verkefnið er ekki nýbygging á auðum reit,
            heldur viðbót sem þarf að lúta því sem stendur.
          </p>
          <Stadarandi />
          <p className="thg-r" style={{ color: MUTED, fontSize: '.86rem', marginTop: '1.6rem' }}>
            Skýringarmynd af flatarmáli, ekki mæld teikning.
          </p>
        </section>

        {/* 3b · full bleed */}
        <Frame file={PHOTOS.band.file} alt={PHOTOS.band.alt} ratio="16 / 8" drift={13} />

        <section className="thg-sec thg-pad">
          <div className="thg-rule" />
          <h2 className="thg-d" data-thg-tdrift="26" style={{ ...H2, marginTop: 'clamp(26px,3.6vw,52px)' }}>
            <Rise>Gatan liggur</Rise>
            <Rise className="thg-serif">gegnum húsið.</Rise>
          </h2>
          <p className="thg-r thg-d" data-thg-tdrift="12" style={{ color: MUTED, fontSize: 'clamp(1rem,1.2vw,1.1rem)', lineHeight: 1.62, maxWidth: '46ch', marginTop: '1.4rem' }}>
            Kolasundið liggur gegnum jarðhæð Reykjavík Konsúlat við Hafnarstræti 19 og tengir gamla
            miðbæinn við það sem áður var sjávarströndin. Almenn gönguleið er hluti af húsinu sjálfu,
            ekki viðbót við það.
          </p>
        </section>

        {/* 4 · ledger */}
        <section className="thg-sec thg-pad">
          <div className="thg-ledger">
            {LEDGER.map(([k, v]) => (
              <div className="thg-led" key={k}>
                <span className="thg-led-k"><Rise>{k}</Rise></span>
                <span className="thg-led-v thg-serif"><Rise>{v}</Rise></span>
              </div>
            ))}
          </div>
        </section>

        {/* 5 · the works */}
        <section id="thg-works" className="thg-sec thg-pad">
          <h2 className="thg-d" data-thg-tdrift="26" style={{ ...H2, marginBottom: '.7rem' }}><Rise>Verkin</Rise></h2>
          <p className="thg-r thg-d" data-thg-tdrift="12" style={{ color: MUTED, maxWidth: '46ch', lineHeight: 1.6, marginBottom: 'clamp(24px,3.4vw,48px)' }}>
            Sjö af tuttugu og tveimur verkum í skránni — þau sem eiga birtar ljósmyndir.
          </p>
          {/* A list, not a grid. Seven tiles read as a thin grid of stock
              photographs; seven names set large read as a practice with a
              position. */}
          <WorkList />
        </section>

        {/* 5b · innandyra */}
        <section className="thg-sec thg-pad">
          <h2 className="thg-d" data-thg-tdrift="26" style={{ ...H2, marginBottom: 'clamp(24px,3.4vw,48px)' }}>
            <Rise>Innandyra</Rise>
          </h2>
          <div className="thg-pair">
            <Frame file={PHOTOS.insideA.file} alt={PHOTOS.insideA.alt} ratio="4 / 3" drift={10} />
            <Frame file={PHOTOS.insideB.file} alt={PHOTOS.insideB.alt} ratio="4 / 3" drift={10} />
          </div>
        </section>

        {/* 6 · the register — the answer to "is that all you've done?".
             Twenty-two titles, exactly as thg.is/verkefni lists them. */}
        <section id="thg-register" className="thg-sec thg-pad">
          <div className="thg-rule" />
          <h2 className="thg-d" data-thg-tdrift="26" style={{ ...H2, margin: 'clamp(26px,3.6vw,48px) 0 .7rem' }}>
            <Rise>Tuttugu og tvö verk</Rise>
            <Rise className="thg-serif">í skránni</Rise>
          </h2>
          <p className="thg-r thg-d" data-thg-tdrift="12" style={{ color: MUTED, maxWidth: '46ch', lineHeight: 1.6 }}>
            Hótel, hjúkrunarheimili, þjónustuíbúðir, verslun, veitingar, skólar og skipulag. Öll skráð
            á vef stofunnar.
          </p>
        </section>

        <Register
          label="Verkefnaskrá THG Arkitekta"
          peaks={REGISTER.map((name, i) => ({ name, rise: REGISTER_RISE[i % REGISTER_RISE.length] }))}
        />

        {/* 7 · services */}
        <section id="thg-services" className="thg-sec thg-pad" style={{ background: BAND }}>
          <h2 className="thg-d" data-thg-tdrift="26" style={{ ...H2, marginBottom: '1.4rem' }}><Rise>Þjónustan</Rise></h2>
          <div className="thg-ledger">
            {SERVICES.map(([k, v]) => (
              <div className="thg-led" key={k}>
                <span className="thg-led-k"><Rise>{k}</Rise></span>
                <span className="thg-led-v thg-serif"><Rise>{v}</Rise></span>
              </div>
            ))}
          </div>
          <p className="thg-r thg-d" data-thg-tdrift="12" style={{ color: MUTED, marginTop: '1.3rem', maxWidth: '46ch', lineHeight: 1.6 }}>
            Öll svið stofunnar eins og hún lýsir þeim sjálf.
          </p>
        </section>

        {/* 7b · closing frame */}
        <Frame file={PHOTOS.closing.file} alt={PHOTOS.closing.alt} ratio="16 / 8" drift={11} />

        {/* 8 · enquiry */}
        <section id="thg-enquiry" className="thg-sec thg-pad">
          <h2 className="thg-d" data-thg-tdrift="40" style={{ fontSize: 'clamp(1.9rem,5.2vw,4.6rem)', letterSpacing: '-.028em', lineHeight: 1.02, fontWeight: 400, marginBottom: 'clamp(28px,4vw,56px)' }}>
            <Rise>Fyrirspurn</Rise>
          </h2>
          <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '44rem' }}>
            <label>
              <span className="thg-lab">Nafn</span>
              <input className="thg-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label>
              <span className="thg-lab">Netfang</span>
              <input className="thg-field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label>
              <span className="thg-lab">Erindi</span>
              <select className="thg-field" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
                {ENQUIRY_TOPICS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <a className="thg-send" href={mailto}>Senda fyrirspurn</a>
          </div>

          <div className="thg-rule" style={{ margin: 'clamp(48px,7vw,96px) 0 1.5rem' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem 2.2rem', color: MUTED, fontSize: '.98rem' }}>
            <a className="thg-contact" href={EMAIL_HREF} style={{ color: INK }}>{EMAIL}</a>
            <a className="thg-contact" href={PHONE_HREF} style={{ color: INK }}>{PHONE_DISPLAY}</a>
            <span>THG Arkitektar ehf. · {KT}</span>
            <span>{ADDRESS}</span>
          </div>
        </section>
      </main>

      <PreviewFooter company={company} />
    </div>
  )
}
