import { useEffect, useMemo, useRef, useState } from 'react'
import Lenis from 'lenis'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { getPreviewCompany } from '../companies'
import { HouseList, HOUSE_LIST_CSS } from './HouseList'
import { Preloader, PRELOADER_CSS } from './Preloader'
import { Herragardur, HERRAGARDUR_CSS } from './Herragardur'
import { Skyline } from './Skyline'
import { MobileNav, MOBILE_NAV_CSS } from './MobileNav'
import type { HouseShot } from './HouseList'
import {
  IMG, EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF, COMPANY_LINE, COMPANY_ADDRESS,
  PHOTOS, VISUALS, MOUNTAINS, HOUSES, DOCUMENTS, ENQUIRY_HOUSES, NAV,
} from './data'

/* ═════════════════════════════════════════════════════════════════════════
   HEKLUSÝN — built against kononenkogroup.com as MEASURED, not as described.

   The reference was inspected live in a real browser (headless returns an
   error page for its Angular shell). What it actually does:

     · Lenis smooth scroll. No GSAP and no ScrollTrigger on window.
     · 46 REAL <img> elements, every one of them visible. There is a single
       <canvas> on the page and it is NOT what draws the photographs.
     · Images move because an inner wrapper translates inside a section with
       overflow:hidden. Measured: div.okc inside section.ean{overflow:hidden}.
       That is the whole image effect.
     · Text arrives by translateY inside a mask. Measured: div.hgh sitting at
       matrix(1,0,0,1,0,127.954), a ~128px rise.
     · Rules wipe with scaleX. Measured: matrix(0,0,0,1,0,0) = scaleX(0).
     · 265 elements carry will-change.

   The previous build replaced all of that with a THREE.js renderer that
   uploaded every photograph as a texture and redrew it through a fragment
   shader every frame. Different machine, heavier, crashed on mount twice,
   and the reason nothing felt like the reference. It is gone. This file is
   CSS transforms on real images, driven by Lenis.

   Facts, prices and the Tölvumynd labelling rule are unchanged from data.ts.
   ═════════════════════════════════════════════════════════════════════════ */

const BASE = import.meta.env.BASE_URL
const GROUND = '#ffffff'
const INK = '#111111'
const MUTED = '#767676'   /* 4.55:1 on white — AA for normal text */
const RULE = '#e2e2e2'
const BAND = '#f0f0f0'

const SANS = "'HK Switzer', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
const SERIF = "'HK Hedvig', Georgia, 'Times New Roman', serif"
const EASE = 'cubic-bezier(.17,.84,.44,1)'

/* One shot per house, in HOUSES order. Renders keep their Tölvumynd chip. */
const HOUSE_SHOTS: HouseShot[] = [
  { file: PHOTOS.houseBuilt.file, alt: PHOTOS.houseBuilt.alt },
  { file: VISUALS.exterior.file, alt: VISUALS.exterior.alt, chip: 'Tölvumynd' },
  { file: PHOTOS.construction.file, alt: PHOTOS.construction.alt },
  { file: VISUALS.living.file, alt: VISUALS.living.alt, chip: 'Tölvumynd' },
  { file: PHOTOS.houseAutumn.file, alt: PHOTOS.houseAutumn.alt },
]

/* Baseline offsets, in em, that read as a ridge. Purely typographic: they
   describe nothing about where any mountain stands. */
/* A gentle stagger so the row reads as a horizon rather than a ticker.
   Deliberately NOT a height profile — we have no measured elevations for
   these eight, and inventing one is the same mistake as the fabricated
   summit pins this section replaced. Amplitude is small (max .5em) because
   these values were originally tuned for a 1.15–2.5rem list and the row now
   sets at 4.2rem, where the old .85/1em offsets threw names a full line
   apart and read as scatter. */
const SKY = ['0em', '-0.28em', '-0.1em', '-0.42em', '-0.18em', '-0.5em', '-0.12em', '-0.3em']

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const CSS = `
@font-face{font-family:'HK Switzer';src:url('${BASE}fonts/switzer/Switzer-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'HK Switzer';src:url('${BASE}fonts/switzer/Switzer-Medium.woff2') format('woff2');font-weight:500;font-display:swap}
@font-face{font-family:'HK Switzer';src:url('${BASE}fonts/switzer/Switzer-Semibold.woff2') format('woff2');font-weight:600;font-display:swap}
@font-face{font-family:'HK Hedvig';src:url('${BASE}fonts/hedvig/hedvig-latin.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'HK Hedvig';src:url('${BASE}fonts/hedvig/hedvig-latin-ext.woff2') format('woff2');font-weight:400;font-display:swap;unicode-range:U+0100-024F,U+1E00-1EFF,U+20A0-20AB,U+2C60-2C7F,U+A720-A7FF}

.hk-root{background:${GROUND};color:${INK};font-family:${SANS};-webkit-font-smoothing:antialiased;overflow-x:clip}
.hk-root *,.hk-root *::before,.hk-root *::after{box-sizing:border-box}
.hk-root h1,.hk-root h2,.hk-root p,.hk-root figure{margin:0}
.hk-root img{display:block;max-width:100%}
.hk-serif{font-family:${SERIF};font-weight:400;font-style:normal}
.hk-root :focus-visible{outline:2px solid currentColor;outline-offset:3px}

.hk-pad{padding-inline:clamp(18px,3.4vw,52px)}
.hk-sec{padding-block:clamp(72px,11vh,148px)}
/* The chrome is fixed with no background, so an anchor jump lands the target
   at y=0, underneath it. Every nav target is a section id, and the mobile
   menu is entirely anchors, so without this each menu tap hides the heading
   it just scrolled to. */
main > section[id]{scroll-margin-top:clamp(56px,9vh,96px)}

/* rule wipe — measured scaleX(0) → scaleX(1) */
.hk-rule{height:1px;background:${RULE};transform-origin:left center}
.hk-js .hk-rule{transform:scaleX(0);transition:transform 1.1s ${EASE}}
.hk-js .hk-rule.is-in{transform:scaleX(1)}

/* THE text device — translateY inside a mask.
   Resting state is VISIBLE: the hidden start only exists while .hk-js is on
   the root, so a crawler, a paused rAF or a JS failure can never strand copy. */
/* padding-bottom/margin-bottom give the mask headroom for descenders (the
   serif's g/y/þ drop well below the line box) without adding visible gap
   between stacked lines — the negative margin cancels the padding's height. */
.hk-m{display:block;overflow:hidden;padding-bottom:.22em;margin-bottom:-.22em}
.hk-m>span{display:block;transform:none}
.hk-js .hk-m>span{transform:translateY(108%);transition:transform 1.05s ${EASE}}
.hk-js .hk-m.is-in>span{transform:none}

/* Continuous scroll drift for type. The mask reveal above handles ARRIVAL;
   this handles the whole time a block is on screen, so headlines and body
   travel at slightly different rates from the page and from each other.
   Kept on a separate wrapper element so the two never share a transform. */
.hk-d{display:block;will-change:transform}
@media (prefers-reduced-motion:reduce){.hk-d{will-change:auto;transform:none!important}}

/* soft rise for blocks that are not display type */
.hk-r{opacity:1;transform:none}
.hk-js .hk-r{opacity:0;transform:translateY(24px);transition:opacity .9s ${EASE},transform .9s ${EASE}}
.hk-js .hk-r.is-in{opacity:1;transform:none}

/* THE image device — masked frame, inner wrapper drifts */
.hk-frame{position:relative;overflow:hidden;width:100%}
.hk-frame-in{position:absolute;inset:-9% 0;will-change:transform}
.hk-frame-in img,.hk-frame-in video{width:100%;height:100%;object-fit:cover}
@media (prefers-reduced-motion:reduce){.hk-frame-in{inset:0;will-change:auto;transform:none!important}}

/* fixed chrome */
.hk-chrome{position:fixed;top:0;left:0;right:0;z-index:40;display:flex;align-items:flex-start;
  justify-content:space-between;gap:2rem;padding:clamp(14px,2vw,26px) clamp(18px,3.4vw,52px);
  pointer-events:none;color:#fff;transition:color .45s ${EASE}}
.hk-chrome.is-ink{color:${INK}}
.hk-chrome a{pointer-events:auto;color:inherit;text-decoration:none}
.hk-wordmark{font-size:clamp(12px,1vw,15px);line-height:1.2;font-weight:400}
/* The chrome is fixed and has no background, so on a phone its three-line
   wordmark sat directly on top of section headings as they scrolled past.
   One line on narrow screens, and sections get enough top padding to clear it. */
@media (max-width:759px){
  .hk-wordmark{line-height:1.2;font-size:12px}
  .hk-wordmark br{display:none}
  .hk-wordmark span{display:none}
  .hk-sec{padding-block:clamp(84px,14vh,148px) clamp(72px,11vh,148px)}
}
.hk-nav{display:flex;gap:.3em;flex-wrap:wrap;justify-content:flex-end;max-width:62vw;
  font-size:clamp(12px,1vw,15px);font-weight:400}
.hk-nav a{white-space:nowrap}
.hk-nav a:hover{opacity:.55}

/* hero — full bleed, colossal lockup bottom left */
.hk-hero{position:relative;height:100svh;min-height:540px;overflow:hidden}
.hk-hero>.hk-frame{position:absolute;inset:0}
.hk-hero-scrim{position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(180deg,rgba(0,0,0,.34) 0%,rgba(0,0,0,.05) 32%,rgba(0,0,0,.28) 70%,rgba(0,0,0,.66) 100%)}
.hk-hero-lock{position:absolute;left:0;right:0;bottom:clamp(16px,2.6vw,40px);color:#fff}
/* line-height .9 was tight enough on its own to compress the line box below
   the serif's descender extent (g/y/þ). .98 keeps the same tight display
   rhythm but stops it fighting the mask's own headroom above. */
.hk-lock{display:block;font-weight:400;letter-spacing:-.03em;line-height:.98;
  font-size:clamp(2.5rem,10.6vw,10.4rem)}

/* statement — the page's opening line. Set LEFT on the same edge as every
   other heading and with its rule ABOVE it, like hk-land/hk-houses: centred
   with the rule underneath, it read as a detached box floating in its own
   frame rather than as the first beat of the page. Larger than an h2 because
   it is the thesis, but it obeys the same grammar as the rest. */
.hk-statement{max-width:22ch;color:${MUTED};
  font-size:clamp(1.35rem,3.6vw,3rem);line-height:1.14;letter-spacing:-.022em;font-weight:400}
.hk-statement .hk-serif{color:${INK}}

/* ledger */
.hk-intro{display:grid;gap:clamp(30px,4.5vw,72px);margin-top:clamp(30px,4vw,60px)}
@media (min-width:900px){.hk-intro{grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);align-items:start}}
.hk-spec{margin:0;border-top:1px solid ${RULE}}
.hk-spec>div{display:flex;justify-content:space-between;gap:1.2rem;align-items:baseline;
  padding-block:clamp(11px,1.3vw,16px);border-bottom:1px solid ${RULE}}
.hk-spec dt{margin:0;color:${MUTED};font-size:clamp(.84rem,1vw,.96rem)}
.hk-spec dd{margin:0;text-align:right;font-size:clamp(.95rem,1.15vw,1.08rem)}

.hk-ledger{border-top:1px solid ${RULE}}
.hk-led{display:grid;grid-template-columns:1fr auto;gap:1.4rem;align-items:baseline;
  padding-block:clamp(13px,1.5vw,21px);border-bottom:1px solid ${RULE}}
.hk-led-k,.hk-led-v{font-size:clamp(1.15rem,2.8vw,2.3rem);letter-spacing:-.02em;line-height:1.08}
.hk-led-v{text-align:right}

/* the horizon row. Full-bleed on purpose — it is a sightline, so it runs
   past both edges rather than stopping at the text column. */
/* Font size lives on the container so the padding below can be expressed in
   em and is therefore guaranteed to clear the tallest --r offset at every
   viewport. Without that top padding, overflow:hidden slices the raised
   names clean through the middle. */
.hk-skyline{width:100%;overflow:hidden;font-size:clamp(1.6rem,5.4vw,4.2rem);
  padding-block:.72em .28em}
.hk-skyline-track{display:inline-flex;align-items:flex-end;will-change:transform}
.hk-skyline.is-static{overflow-x:auto;-webkit-overflow-scrolling:touch}
.hk-skyline.is-static .hk-sky{padding-inline:clamp(18px,3.4vw,52px)}
.hk-sky{list-style:none;margin:0;padding:0;display:inline-flex;flex:0 0 auto;
  align-items:flex-end;gap:0;font-size:inherit;
  letter-spacing:-.028em;line-height:1.06;white-space:nowrap}
.hk-sky li{transform:translateY(var(--r,0));white-space:nowrap;padding-inline:.42em}
.hk-sky li:nth-child(even){color:${MUTED}}
@media (prefers-reduced-motion:reduce){.hk-sky li{transform:none}}


/* enquiry */
/* min-height:44px is the real tap-target floor (measured 21.5-24px before this,
   on a mobile audit — the underline look stays, the box just gets tall enough
   to tap reliably). */
.hk-field{display:block;box-sizing:border-box;min-height:44px;border:0;border-bottom:1px solid ${RULE};
  background:none;width:100%;padding:.85rem 0;font:inherit;font-size:1.05rem;color:${INK};border-radius:0}
.hk-field:focus{outline:none;border-bottom-color:${INK}}
.hk-lab{font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:${MUTED}}
/* .hk-send measured 29px tall — an invisible hit-slop grows the tap target to
   44px without visually bulking up a text link that's supposed to read light. */
.hk-send{display:inline-block;position:relative;margin-top:1.8rem;font-size:clamp(1.1rem,2vw,1.5rem);
  color:${INK};text-decoration:none;border-bottom:1px solid ${INK};padding-bottom:.1em}
.hk-send::before{content:'';position:absolute;inset:-10px -6px}
/* Same trick for the contact links: they measured 24px, and inline links in a
   flex row cannot take a min-height without breaking the baseline row. */
.hk-contact{position:relative}
.hk-contact::before{content:'';position:absolute;inset:-11px -4px}
.hk-send:hover{opacity:.6}
${HOUSE_LIST_CSS}
${PRELOADER_CSS}
${HERRAGARDUR_CSS}
${MOBILE_NAV_CSS}
`

/* ── text that rises out of a mask ─────────────────────────────────────── */
function Rise({ children, className, style }: { children: string; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={`hk-m ${className ?? ''}`} style={style}>
      <span>{children}</span>
    </span>
  )
}

/* ── a photograph in a masked frame whose inner wrapper drifts ─────────── */
function Frame({
  file, alt, ratio = '3 / 2', drift = 10, chip, priority = false,
}: { file: string; alt: string; ratio?: string; drift?: number; chip?: string; priority?: boolean }) {
  return (
    <div className="hk-frame" style={{ aspectRatio: ratio }}>
      {chip ? <span className="hk-chip">{chip}</span> : null}
      <div className="hk-frame-in" data-hk-drift={drift}>
        <img
          src={IMG(file)} alt={alt}
          loading={priority ? 'eager' : 'lazy'} decoding="async"
          {...(priority ? { fetchpriority: 'high' } : {})}
        />
      </div>
    </div>
  )
}

export default function HeklusynPage() {
  const company = getPreviewCompany('heklusyn')
  const rootRef = useRef<HTMLDivElement>(null)
  const [inkChrome, setInkChrome] = useState(false)
  const inkRef = useRef(false)
  const lenisRef = useRef<Lenis | null>(null)
  const [form, setForm] = useState({ name: '', email: '', house: ENQUIRY_HOUSES[0] })

  useEffect(() => { document.title = 'Heklusýn · Tólf hús á fimmtíu hekturum' }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduced = prefersReduced()

    if (!reduced) root.classList.add('hk-js')
    const targets = Array.from(root.querySelectorAll<HTMLElement>('.hk-m,.hk-r,.hk-rule'))
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) } }),
      { rootMargin: '0px 0px -10% 0px', threshold: 0.01 },
    )
    if (!reduced) targets.forEach((t) => io.observe(t))
    const failsafe = window.setTimeout(() => targets.forEach((t) => t.classList.add('is-in')), 2000)

    const frames = Array.from(root.querySelectorAll<HTMLElement>('.hk-frame-in'))
    const drifters = reduced ? [] : Array.from(root.querySelectorAll<HTMLElement>('[data-hk-tdrift]'))
    const hero = root.querySelector<HTMLElement>('.hk-hero')

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
        const amt = Number(el.dataset.hkDrift || 10)
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
        writes.push([el, `translate3d(0,${(-p * amt).toFixed(2)}%,0)`])
      }

      for (const el of drifters) {
        const r = el.getBoundingClientRect()
        if (r.bottom < -240 || r.top > vh + 240) continue
        const amt = Number(el.dataset.hkTdrift || 4)
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
      root.classList.remove('hk-js')
    }
  }, [])

  const sold = useMemo(() => HOUSES.filter((h) => h.statuses.includes('selt')).length, [])
  const mailto = useMemo(() => {
    const body = `Nafn: ${form.name}\nNetfang: ${form.email}\nHús: ${form.house}\n`
    return `mailto:${EMAIL}?subject=${encodeURIComponent('Fyrirspurn um Rangárslétta')}&body=${encodeURIComponent(body)}`
  }, [form])

  const H2: React.CSSProperties = {
    fontSize: 'clamp(1.5rem,3.6vw,3rem)', letterSpacing: '-.022em', lineHeight: 1.08, fontWeight: 400,
  }

  return (
    <div ref={rootRef} className="hk-root">
      <style>{CSS}</style>
      <Preloader ink={INK} ground={GROUND} />
      <PreviewChrome company={company} />

      <header className={`hk-chrome${inkChrome ? ' is-ink' : ''}`}>
        <a href="#hk-top" className="hk-wordmark">
          Heklusýn<br /><span>Rangárslétta<br />Ytri-Rangá</span>
        </a>
        <nav className="hk-nav" aria-label="Efnisyfirlit">
          {NAV.map((n, i) => (
            <a key={n.id} href={`#${n.id}`}>{n.label}{i < NAV.length - 1 ? ',' : ''}</a>
          ))}
        </nav>
        <MobileNav items={NAV} lenisRef={lenisRef} />
      </header>

      <main id="hk-top">
        {/* 1 · hero */}
        <section className="hk-hero">
          <div className="hk-frame" style={{ aspectRatio: 'auto', height: '100%' }}>
            <div className="hk-frame-in" data-hk-drift="6">
              <img src={IMG(PHOTOS.heroEstate.file)} alt={PHOTOS.heroEstate.alt}
                   loading="eager" decoding="async" {...{ fetchpriority: 'high' }} />
            </div>
          </div>
          <div className="hk-hero-scrim" aria-hidden />
          <div className="hk-hero-lock hk-pad">
            <h1 style={{ fontWeight: 400 }}>
              <Rise className="hk-lock">Heklusýn</Rise>
              <Rise className="hk-lock hk-serif">við Ytri-Rangá</Rise>
            </h1>
          </div>
        </section>

        {/* 2 · what Heklusýn actually is. The statement alone left a screen
             of white with two lines in it and never said what the company
             does. Every claim below is theirs: "Við byggjum hágæða hús",
             the spildur "allt að 5 hektarar" against the ordinary 0,3 til 1,
             "teiknuð og hönnuð af Studio Halla Friðgeirs", the land included
             in the price, delivery ready for interior or fully furnished,
             and the Nibe heat pump driving the underfloor heating. */}
        <section id="hk-thesis" className="hk-sec hk-pad">
          <div className="hk-rule" />
          <p
            className="hk-statement hk-d"
            data-hk-tdrift="34"
            style={{ margin: 'clamp(26px,3.6vw,48px) 0 0' }}
          >
            <Rise>Ekki sumarhús.</Rise>
            <Rise className="hk-serif">Þinn eigin herragarður.</Rise>
          </p>

          <div className="hk-intro">
            <div>
              <p className="hk-r hk-d" data-hk-tdrift="14" style={{ fontSize: 'clamp(1.05rem,1.5vw,1.32rem)', lineHeight: 1.5, letterSpacing: '-.01em' }}>
                Heklusýn byggir hús á Rangársléttu, fimmtíu hektara landi á vesturbakka
                Ytri-Rangár. Nálgunin er önnur en gengur og gerist. Í stað þess að skipta
                landinu í sem flestar lóðir verða húsin aðeins tólf til fjórtán, hvert á
                spildu sem getur orðið allt að fimm hektarar.
              </p>
              <p className="hk-r hk-d" data-hk-tdrift="12" style={{ color: MUTED, lineHeight: 1.62, marginTop: '1.5rem', maxWidth: '46ch' }}>
                Húsin eru teiknuð af Studio Halla Friðgeirs og afhent tilbúin til
                innréttingar, eða fullbúin ef þess er óskað. Landið fylgir húsinu í kaupunum.
              </p>
            </div>

            <dl className="hk-spec">
              {([
                ['Landið', 'Fylgir húsinu'],
                ['Hönnun', 'Studio Halla Friðgeirs'],
                ['Afhending', 'Tilbúið til innréttingar'],
                ['Hitun', 'Gólfhiti með varmadælu'],
              ] as const).map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 3 · THE WOW — the scale of the land, drawn from published areas.
             Heklusýn make this comparison themselves in a paragraph nobody
             reads: their spildur run to 5 ha where the ordinary Icelandic
             summerhouse plot is 0,3 til 1 ha. Drawn, it explains the price. */}
        <section id="hk-land" className="hk-sec hk-pad">
          <div className="hk-rule" />
          <h2 className="hk-d" data-hk-tdrift="26" style={{ ...H2, margin: 'clamp(26px,3.6vw,48px) 0 .7rem' }}>
            <Rise>Fimm hektarar,</Rise>
            <Rise className="hk-serif">ekki þrjú þúsund fermetrar.</Rise>
          </h2>
          <p className="hk-r hk-d" data-hk-tdrift="12" style={{ color: MUTED, maxWidth: '46ch', lineHeight: 1.62, marginBottom: 'clamp(30px,4vw,58px)' }}>
            Dæmigerð sumarhúsalóð á Íslandi er 0,3 til 1 hektari. Spildurnar á Rangársléttu eru
            allt að fimm hektarar. Húsið sjálft stendur á um 0,3 prósentum af landinu sem fylgir því.
          </p>
          <Herragardur />
          <p className="hk-r" style={{ color: MUTED, fontSize: '.86rem', marginTop: '1.6rem' }}>
            Skýringarmynd af flatarmáli, ekki mæld lóðablöð.
          </p>
        </section>

        {/* 3 · the land, full bleed */}
        <Frame file={PHOTOS.landRiver.file} alt={PHOTOS.landRiver.alt} ratio="16 / 8" drift={13} />

        <section className="hk-sec hk-pad">
          <div className="hk-rule" />
          <h2 className="hk-d" data-hk-tdrift="26" style={{ ...H2, marginTop: 'clamp(26px,3.6vw,52px)' }}>
            <Rise>Landinu var skammtað,</Rise>
            <Rise className="hk-serif">ekki skipt.</Rise>
          </h2>
          <p className="hk-r hk-d" data-hk-tdrift="12" style={{ color: MUTED, fontSize: 'clamp(1rem,1.2vw,1.1rem)', lineHeight: 1.62, maxWidth: '46ch', marginTop: '1.4rem' }}>
            Landið var áður hluti af bújörðinni Leirubakka og varð sjálfstæð eign við Ytri-Rangá árið 2020.
            Á svæðinu er þess gætt að raska sem minnst hraunmyndunum, mosa og gróðri sem fyrir er.
          </p>
        </section>

        {/* 4 · ledger */}
        <section className="hk-sec hk-pad">
          <div className="hk-ledger">
            {([['Landið', '50 hektarar'], ['Húsafjöldi', '12 til 14'], ['Sjálfstæð eign', '2020'], ['Seld hús', String(sold)]] as const).map(([k, v]) => (
              <div className="hk-led" key={k}>
                <span className="hk-led-k"><Rise>{k}</Rise></span>
                <span className="hk-led-v hk-serif"><Rise>{v}</Rise></span>
              </div>
            ))}
          </div>
        </section>

        {/* 5 · the houses */}
        <section id="hk-houses" className="hk-sec hk-pad">
          <h2 className="hk-d" data-hk-tdrift="26" style={{ ...H2, marginBottom: '.7rem' }}><Rise>Húsin</Rise></h2>
          <p className="hk-r hk-d" data-hk-tdrift="12" style={{ color: MUTED, maxWidth: '42ch', lineHeight: 1.6, marginBottom: 'clamp(24px,3.4vw,48px)' }}>
            Fimm skráð hús af tólf til fjórtán sem munu rísa.
          </p>
          {/* A list, not a grid. Five tiles read as a thin grid; five names
              set large read as the scarcity, which is the whole proposition. */}
          <HouseList shots={HOUSE_SHOTS} />
        </section>

        {/* 6 · the horizon — typographic, not a map.
             This was pins at a hardcoded top:44% with invented, evenly
             spaced x values (6,19,31,...,93). They landed on the meadow,
             not the ridge, and named mountains the photograph cannot
             resolve. A disclaimer does not rescue a device that asserts
             positions nobody measured, so the positions are gone. The names
             are set as a skyline instead: the fact is that you see all
             eight from one plot, and that needs no coordinates. */}
        <section id="hk-horizon" className="hk-sec hk-pad">
          <div className="hk-rule" />
          <h2 className="hk-d" data-hk-tdrift="26" style={{ ...H2, margin: 'clamp(26px,3.6vw,48px) 0 .7rem' }}>
            <Rise>Átta fjöll</Rise>
            <Rise className="hk-serif">í sjónlínu</Rise>
          </h2>
          <p className="hk-r hk-d" data-hk-tdrift="12" style={{ color: MUTED, maxWidth: '44ch', lineHeight: 1.6 }}>
            Af sömu spildu sérðu Heklu, Eyjafjallajökul og Þríhyrning. Öll átta í einni sjónlínu.
          </p>
        </section>

        <Skyline
          label="Fjöllin átta sem sjást frá Rangársléttu"
          peaks={MOUNTAINS.map((m, i) => ({ name: m.name, rise: SKY[i % SKY.length] }))}
        />

        {/* 7 · documents */}
        <section id="hk-docs" className="hk-sec hk-pad" style={{ background: BAND }}>
          <h2 className="hk-d" data-hk-tdrift="26" style={{ ...H2, marginBottom: '1.4rem' }}><Rise>Gögnin</Rise></h2>
          <div className="hk-ledger">
            {DOCUMENTS.map((d) => (
              <div className="hk-led" key={d.label}>
                <span className="hk-led-k"><Rise>{d.label}</Rise></span>
                <span className="hk-led-v hk-serif"><Rise>{d.count}</Rise></span>
              </div>
            ))}
          </div>
          <p className="hk-r hk-d" data-hk-tdrift="12" style={{ color: MUTED, marginTop: '1.3rem', maxWidth: '46ch', lineHeight: 1.6 }}>
            Gögnin eru gefin út af Heklusýn sjálfri.
          </p>
        </section>

        {/* 8 · enquiry */}
        <section id="hk-enquiry" className="hk-sec hk-pad">
          <h2 className="hk-d" data-hk-tdrift="40" style={{ fontSize: 'clamp(1.9rem,5.2vw,4.6rem)', letterSpacing: '-.028em', lineHeight: 1.02, fontWeight: 400, marginBottom: 'clamp(28px,4vw,56px)' }}>
            <Rise>Fyrirspurn</Rise>
          </h2>
          <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '44rem' }}>
            <label>
              <span className="hk-lab">Nafn</span>
              <input className="hk-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label>
              <span className="hk-lab">Netfang</span>
              <input className="hk-field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label>
              <span className="hk-lab">Hús</span>
              <select className="hk-field" value={form.house} onChange={(e) => setForm({ ...form, house: e.target.value })}>
                {ENQUIRY_HOUSES.map((h) => <option key={h}>{h}</option>)}
              </select>
            </label>
            <a className="hk-send" href={mailto}>Senda fyrirspurn</a>
          </div>

          <div className="hk-rule" style={{ margin: 'clamp(48px,7vw,96px) 0 1.5rem' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem 2.2rem', color: MUTED, fontSize: '.98rem' }}>
            <a className="hk-contact" href={EMAIL_HREF} style={{ color: INK }}>{EMAIL}</a>
            <a className="hk-contact" href={PHONE_HREF} style={{ color: INK }}>{PHONE_DISPLAY}</a>
            <span>{COMPANY_LINE}</span>
            <span>{COMPANY_ADDRESS}</span>
          </div>
        </section>
      </main>

      <PreviewFooter company={company} />
    </div>
  )
}

