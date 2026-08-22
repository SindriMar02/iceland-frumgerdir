import { useEffect, useMemo, useRef, useState } from 'react'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { companyEntry as company } from './company'
import {
  CLINIC, LICENCES, HERO, GENERAL, SPECIALITIES, PRICES, PRICE_NOTE,
  CANCELLATION, CAREER, ELFA, HREFNA, WELCOME, IMAGES,
} from './data'

/* ------------------------------------------------------------------ tokens */

const CHALK = '#F2F0EC'
const ENAMEL = '#FBFAF8'
const INK = '#1E2329'
const MINERAL = '#666D78' /* 4.59:1 on chalk, so secondary text clears AA */
const EG = '#5C68DC' /* sampled off her own logo, not chosen. Fills only. */
/* Her logo blue is 4.13:1 on chalk, which fails AA for small text. Fills keep
   the true brand colour (white on it is 5.22:1); text uses this darker step. */
const EG_TEXT = '#5261D4'
const LINE = 'rgba(30,35,41,.13)'

const DISPLAY = "'Satoshi', system-ui, sans-serif"
const BODY = "'Schibsted Grotesk', system-ui, sans-serif"

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

const SECTIONS = [
  { id: 'stofan', label: 'Stofan' },
  { id: 'thjonusta', label: 'Þjónusta' },
  { id: 'ferillinn', label: 'Ferillinn' },
  { id: 'verdskra', label: 'Verðskrá' },
  { id: 'folkid', label: 'Fólkið' },
  { id: 'hafa-samband', label: 'Hafa samband' },
]

/* ------------------------------------------------------------------ styles */

const CSS = `
.eg-root{background:${CHALK};color:${INK};font-family:${BODY}}
.eg-root ::selection{background:${EG};color:#fff}
.eg-bleed > *{position:relative}
.eg-display{font-family:${DISPLAY};font-weight:700;letter-spacing:-.03em;line-height:1.16}
.eg-eyebrow{font-size:11.5px;font-weight:600;letter-spacing:.15em;text-transform:uppercase}
.eg-num{font-variant-numeric:tabular-nums;font-feature-settings:"tnum" 1}

/* ---- headline rise, per word ---- */
.eg-ln{display:inline-block;overflow:hidden;vertical-align:bottom;
  padding-top:.18em;margin-top:-.18em}
.eg-w{display:inline-block;transform:translateY(105%);opacity:0;
  transition:transform 820ms cubic-bezier(.16,1,.3,1),opacity 620ms linear}
.eg-in .eg-w{transform:translateY(0);opacity:1}

.eg-rv{opacity:0;transform:translateY(20px);
  transition:opacity 640ms cubic-bezier(.16,1,.3,1),transform 640ms cubic-bezier(.16,1,.3,1)}
.eg-in.eg-rv,.eg-in .eg-rv{opacity:1;transform:none}

/* ---- THE SIGNATURE: the career spine ------------------------------------
   Not a scroll-progress bar. Discrete notches, one per section, that SEAT
   with a small click when the scroll reaches them, the way a step in a
   sequence lands. The sequence is real: her dated career. */
.eg-spine{position:fixed;left:26px;top:50%;transform:translateY(-50%);z-index:25;
  display:none}
/* only where the gutter genuinely clears the 1180px content column,
   otherwise the active label lands on top of the lede */
@media (min-width:1560px){.eg-spine{display:block}}
.eg-notch{display:flex;align-items:center;gap:12px;padding:9px 0;background:none;border:0;
  cursor:pointer;color:${MINERAL}}
.eg-tick{display:block;width:16px;height:2px;background:${INK};opacity:.22;
  transition:width 260ms cubic-bezier(.16,1,.3,1),opacity 260ms ease,background-color 260ms ease}
.eg-notch[aria-current="true"] .eg-tick{width:34px;opacity:1;background:${EG};
  animation:eg-seat 200ms cubic-bezier(.34,1.56,.64,1)}
.eg-notch:hover .eg-tick{width:26px;opacity:.6}
.eg-label{font-size:11px;letter-spacing:.13em;text-transform:uppercase;opacity:0;
  transform:translateX(-6px);transition:opacity 200ms ease,transform 200ms ease}
.eg-notch[aria-current="true"] .eg-label,.eg-notch:hover .eg-label{opacity:1;transform:none}
.eg-notch[aria-current="true"] .eg-label{color:${EG_TEXT}}
@keyframes eg-seat{0%{transform:scaleX(1)}45%{transform:scaleX(.9)}100%{transform:scaleX(1)}}

/* mobile: the same notches as a top rail */
.eg-rail{position:sticky;top:0;z-index:24;display:flex;gap:4px;padding:10px 20px;
  background:${CHALK};border-bottom:1px solid ${LINE}}
@media (min-width:1560px){.eg-rail{display:none}}
.eg-rail i{flex:1;height:2px;background:${INK};opacity:.16;border-radius:2px;
  transition:opacity 240ms ease,background-color 240ms ease}
.eg-rail i[data-on="1"]{opacity:1;background:${EG}}

/* ---- her mark: one continuous stroke, swept in once per visit ---- */
.eg-mark{-webkit-mask-image:linear-gradient(100deg,#000 0 var(--eg-p,100%),transparent calc(var(--eg-p,100%) + 7%));
  mask-image:linear-gradient(100deg,#000 0 var(--eg-p,100%),transparent calc(var(--eg-p,100%) + 7%))}
.eg-mark[data-draw="1"]{animation:eg-draw 1100ms cubic-bezier(.65,0,.35,1) both}
@keyframes eg-draw{from{--eg-p:0%}to{--eg-p:100%}}
@property --eg-p{syntax:'<percentage>';inherits:false;initial-value:100%}

/* ---- links, buttons, rows ---- */
.eg-link{position:relative;display:inline-block}
.eg-link::after{content:"";position:absolute;left:0;right:0;bottom:-3px;height:1px;
  background:currentColor;transform:scaleX(0);transform-origin:left;
  transition:transform 190ms cubic-bezier(.16,1,.3,1)}
.eg-link:hover::after,.eg-link:focus-visible::after{transform:scaleX(1)}
.eg-btn{transition:background-color 170ms ease,transform 150ms ease,box-shadow 170ms ease}
.eg-btn:active{transform:scale(.985)}

/* ---- price rows: dotted leader, tabular figures ---- */
.eg-price{display:grid;grid-template-columns:1fr auto;align-items:baseline;gap:10px;
  padding:11px 0;border-bottom:1px dotted rgba(30,35,41,.22)}
.eg-price:last-child{border-bottom:0}

.eg-card{background:${ENAMEL};border:1px solid ${LINE};border-radius:14px}

/* ---- header: nav either side of the mark, sitting on the hero ---- */
.eg-head{position:absolute;left:0;right:0;top:0;z-index:26;padding:20px}
.eg-head-in{margin:0 auto;max-width:1320px;display:grid;align-items:center;
  grid-template-columns:1fr auto 1fr;gap:20px}
.eg-navset{display:none;gap:26px}
@media (min-width:900px){.eg-navset{display:flex}}
.eg-navset.is-right{justify-content:flex-end}
.eg-navlink{font-size:12px;letter-spacing:.13em;text-transform:uppercase;font-weight:600;
  color:${INK};min-height:44px;display:inline-flex;align-items:center}

/* ---- full-bleed hero ---- */
.eg-hero{position:relative;min-height:clamp(520px,86svh,880px);display:grid;
  isolation:isolate}
.eg-hero > *{grid-area:1/1}
.eg-hero-img{width:100%;height:100%;object-fit:cover;object-position:60% 45%}
.eg-hero-veil{background:
  linear-gradient(to top, ${CHALK} 2%, rgba(242,240,236,.92) 20%, rgba(242,240,236,.35) 48%, rgba(242,240,236,0) 72%)}
.eg-hero-body{align-self:end}

@media (prefers-reduced-motion:reduce){
  .eg-w{transform:none;opacity:1;transition:none}
  .eg-rv{opacity:1;transform:none;transition:none}
  .eg-mark[data-draw="1"]{animation:none}
  .eg-tick,.eg-label{transition:none}
  .eg-notch[aria-current="true"] .eg-tick{animation:none}
  .eg-notch:hover .eg-tick{width:16px;opacity:.22}
}
`

/* ------------------------------------------------------------- primitives */

function Headline({
  text, id, className = '', size = 92, measure, as: Tag = 'h2',
}: {
  text: string; id?: string; className?: string; size?: number; measure?: number
  as?: 'h1' | 'h2'
}) {
  const words = useMemo(() => text.split(' '), [text])
  return (
    <Tag
      id={id}
      aria-label={text}
      className={`eg-display ${className}`}
      style={{
        fontSize: `clamp(29px, ${size / 19}vw, ${size}px)`,
        maxWidth: measure ? `${measure}px` : undefined,
        textWrap: 'balance',
      }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={`${w}-${i}`}>
            <span className="eg-ln">
              <span className="eg-w" style={{ transitionDelay: `${i * 42}ms` }}>{w}</span>
            </span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </Tag>
  )
}

/* ------------------------------------------------------------------- page */

export default function ElfaPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [draw, setDraw] = useState(false)

  /* The opening stroke plays ONCE per visit, not on every return to the top
     (ledger #213). The flag is read during render so there is no flash. */
  useEffect(() => {
    let seen = false
    try { seen = sessionStorage.getItem('eg:intro') === '1' } catch { seen = false }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!seen && !reduce) {
      setDraw(true)
      try { sessionStorage.setItem('eg:intro', '1') } catch { /* private mode */ }
    }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-rv]'))
    if (reduce) targets.forEach((t) => t.classList.add('eg-in'))

    const io = reduce
      ? null
      : new IntersectionObserver(
          (es) => es.forEach((e) => {
            if (e.isIntersecting) { e.target.classList.add('eg-in'); io?.unobserve(e.target) }
          }),
          { rootMargin: '0px 0px -12% 0px', threshold: 0.16 },
        )
    if (io) targets.forEach((t) => io.observe(t))

    /* spine: which section owns the viewport */
    const secs = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
    const spy = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (!e.isIntersecting) return
          const i = secs.indexOf(e.target as HTMLElement)
          if (i >= 0) setActive(i)
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    secs.forEach((s) => spy.observe(s))

    return () => { io?.disconnect(); spy.disconnect() }
  }, [])

  return (
    <div ref={rootRef} className="eg-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ------------------------------------------------- the career spine */}
      <nav className="eg-spine" aria-label="Kaflar">
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`eg-notch ${FOCUS}`}
            aria-current={i === active}
            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            <span className="eg-tick" aria-hidden="true" />
            <span className="eg-label">{s.label}</span>
          </button>
        ))}
      </nav>

      <div className="eg-rail" aria-hidden="true">
        {SECTIONS.map((s, i) => <i key={s.id} data-on={i <= active ? '1' : '0'} />)}
      </div>

      <header className="eg-head">
        <div className="eg-head-in">
          <nav className="eg-navset" aria-label="Valmynd, vinstri">
            {SECTIONS.slice(1, 4).map((n) => (
              <a key={n.id} href={`#${n.id}`} className={`eg-link eg-navlink ${FOCUS}`}>{n.label}</a>
            ))}
          </nav>

          <a href="#top" className={`justify-self-center ${FOCUS}`} aria-label="Tannlæknastofa EG, forsíða">
            <img
              src={IMAGES.mark}
              data-draw={draw ? '1' : '0'}
              className="eg-mark"
              width={707}
              height={700}
              alt=""
              style={{ width: 'clamp(52px,5.4vw,74px)', height: 'auto', display: 'block' }}
              loading="eager"
              decoding="async"
            />
          </a>

          <nav className="eg-navset is-right" aria-label="Valmynd, hægri">
            <a href={`#${SECTIONS[4].id}`} className={`eg-link eg-navlink ${FOCUS}`}>{SECTIONS[4].label}</a>
            <a href={`tel:${CLINIC.telHref}`} className={`eg-link eg-navlink ${FOCUS}`} style={{ color: EG_TEXT }}>
              {CLINIC.tel}
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ hero */}
        <section id="stofan" className="eg-bleed eg-hero scroll-mt-16" aria-labelledby="hero-h">
          <picture>
            <source media="(max-width: 700px)" srcSet={IMAGES.heroMob} />
            <source media="(max-width: 1300px)" srcSet={IMAGES.heroSm} />
            <img
              src={IMAGES.hero}
              width={2400}
              height={1029}
              alt="Ljós sem fellur eftir mjúkri, gegnsærri bogadreginni ferlu."
              className="eg-hero-img"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </picture>
          <div className="eg-hero-veil" aria-hidden="true" />

          <div className="eg-hero-body w-full px-5 pb-14 sm:px-10 sm:pb-20">
            <div className="mx-auto w-full max-w-[1320px]">
              <div data-rv className="eg-rv">
                <p className="eg-eyebrow" style={{ color: MINERAL }}>{HERO.eyebrow}</p>
              </div>

              <div data-rv className="mt-4">
                <Headline as="h1" id="hero-h" text={HERO.headline} size={96} measure={1000} />
              </div>

              <div data-rv className="eg-rv mt-7 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-[50ch] text-[16px] leading-relaxed sm:text-[17px]" style={{ color: MINERAL }}>
                  {HERO.lede}
                </p>
                <a
                  href={HERO.cta.href}
                  className={`eg-btn inline-flex shrink-0 items-center justify-center rounded-full px-8 text-[15px] font-semibold ${FOCUS}`}
                  style={{ background: EG, color: '#fff', minHeight: 52 }}
                >
                  {HERO.cta.label}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* hours and the two numbers, straight under the hero */}
        <section className="px-5 sm:px-10" aria-label="Opnunartími og símanúmer">
          <dl data-rv className="eg-rv mx-auto grid max-w-[1320px] gap-px sm:grid-cols-3"
              style={{ background: LINE, border: `1px solid ${LINE}`, borderRadius: 14, overflow: 'hidden' }}>
            {[
              { k: 'Opnunartími', v: CLINIC.hours },
              { k: 'Tímapantanir', v: CLINIC.tel, href: `tel:${CLINIC.telHref}` },
              { k: 'Neyðarþjónusta', v: CLINIC.emergency, href: `tel:${CLINIC.emergencyHref}` },
            ].map((c) => (
              <div key={c.k} className="px-6 py-6" style={{ background: ENAMEL }}>
                <dt className="eg-eyebrow" style={{ color: MINERAL }}>{c.k}</dt>
                <dd className="eg-num mt-2 text-[22px] font-semibold sm:text-[24px]">
                  {c.href
                    ? <a href={c.href} className={`eg-link ${FOCUS}`}
                         style={{ color: EG_TEXT, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>{c.v}</a>
                    : c.v}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* -------------------------------------------------------- services */}
        <section id="thjonusta" className="scroll-mt-16 px-5 py-20 sm:px-10 sm:py-28" aria-labelledby="serv-h">
          <div className="mx-auto max-w-[1180px]">
            <div data-rv>
              <Headline id="serv-h" text="Almennar tannlækningar og skurðaðgerðir" size={66} measure={780} />
            </div>
            <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
              <p data-rv className="eg-rv max-w-[46ch] text-[16px] leading-relaxed sm:text-[17px]"
                 style={{ color: MINERAL }}>
                {GENERAL}
              </p>
              <div data-rv className="eg-rv">
                <p className="eg-eyebrow" style={{ color: EG_TEXT }}>Sérhæfing</p>
                <ul className="mt-5">
                  {SPECIALITIES.map((s) => (
                    <li key={s} className="py-4 text-[15px] leading-relaxed sm:text-[16px]"
                        style={{ borderTop: `1px solid ${LINE}` }}>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- the path */}
        <section
          id="ferillinn"
          className="scroll-mt-16 px-5 py-20 sm:px-10 sm:py-28"
          style={{ background: ENAMEL, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}
          aria-labelledby="path-h"
        >
          <div className="mx-auto max-w-[1180px]">
            <div data-rv>
              <Headline id="path-h" text="Frá Húsavík til Alabama og aftur heim" size={66} measure={820} />
            </div>
            <ol data-rv className="eg-rv mt-12">
              {CAREER.map((c) => (
                <li key={c.year}
                    className="grid grid-cols-[76px_1fr] gap-6 py-6 sm:grid-cols-[120px_1fr] sm:gap-10"
                    style={{ borderTop: `1px solid ${LINE}` }}>
                  <span className="eg-num eg-eyebrow pt-1" style={{ color: EG_TEXT }}>{c.year}</span>
                  <div>
                    <p className="text-[17px] font-semibold sm:text-[18px]">{c.title}</p>
                    <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed" style={{ color: MINERAL }}>{c.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------ the prices */}
        <section id="verdskra" className="scroll-mt-16 px-5 py-20 sm:px-10 sm:py-28" aria-labelledby="price-h">
          <div className="mx-auto max-w-[1180px]">
            <div data-rv>
              <Headline id="price-h" text="Verðskráin, uppi á borðum" size={66} measure={700} />
            </div>
            <p data-rv className="eg-rv mt-6 max-w-[62ch] text-[15px] leading-relaxed" style={{ color: MINERAL }}>
              {PRICE_NOTE}
            </p>

            <div data-rv className="eg-rv mt-12 grid gap-x-16 gap-y-12 md:grid-cols-2">
              {PRICES.map((g) => (
                <section key={g.group} aria-label={g.group}>
                  <h3 className="eg-eyebrow" style={{ color: EG_TEXT }}>{g.group}</h3>
                  <div className="mt-4">
                    {g.rows.map((r) => (
                      <div key={r.k} className="eg-price">
                        <span className="text-[15px] leading-snug">{r.k}</span>
                        <span className="eg-num text-[15px] font-semibold whitespace-nowrap">{r.v} kr.</span>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <p data-rv className="eg-rv mt-12 text-[14px]" style={{ color: MINERAL }}>{CANCELLATION}</p>
          </div>
        </section>

        {/* -------------------------------------------------------- the people */}
        <section
          id="folkid"
          className="scroll-mt-16 px-5 py-20 sm:px-10 sm:py-28"
          style={{ background: ENAMEL, borderTop: `1px solid ${LINE}` }}
          aria-labelledby="people-h"
        >
          <div className="mx-auto max-w-[1180px]">
            <div data-rv>
              <Headline id="people-h" text="Tvær á stofunni, sömu tvær síðan 2009" size={62} measure={860} />
            </div>

            <div className="mt-14 grid gap-12 lg:grid-cols-[420px_1fr] lg:gap-20">
              <div data-rv className="eg-rv">
                <img
                  src={IMAGES.portrait}
                  width={1100}
                  height={1633}
                  alt="Elfa Guðmundsdóttir tannlæknir."
                  className="h-auto w-full rounded-[14px]"
                  style={{ border: `1px solid ${LINE}` }}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div data-rv className="eg-rv">
                <p className="eg-display" style={{ fontSize: 'clamp(23px,2.6vw,30px)' }}>{ELFA.name}</p>
                <p className="eg-eyebrow mt-2" style={{ color: EG_TEXT }}>{ELFA.creds}</p>
                {ELFA.body.map((p) => (
                  <p key={p.slice(0, 22)} className="mt-5 max-w-[58ch] text-[15px] leading-relaxed sm:text-[16px]"
                     style={{ color: MINERAL }}>
                    {p}
                  </p>
                ))}

                <div className="eg-card mt-10 p-7">
                  <p className="text-[17px] font-semibold">{HREFNA.name}</p>
                  <p className="mt-2 max-w-[54ch] text-[15px] leading-relaxed" style={{ color: MINERAL }}>
                    {HREFNA.body}
                  </p>
                </div>
              </div>
            </div>

            <p data-rv className="eg-rv mt-14 max-w-[62ch] text-[16px] leading-relaxed sm:text-[18px]">
              {WELCOME}
            </p>
          </div>
        </section>

        {/* ---------------------------------------------------------- contact */}
        <section id="hafa-samband" className="scroll-mt-16 px-5 pb-28 pt-20 sm:px-10 sm:pt-28" aria-labelledby="c-h">
          <div className="mx-auto max-w-[1180px]">
            <div data-rv>
              <Headline id="c-h" text="Salavegur 2, Kópavogi" size={70} measure={720} />
            </div>

            <div data-rv className="eg-rv mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { k: 'Tímapantanir', v: CLINIC.tel, href: `tel:${CLINIC.telHref}` },
                { k: 'Neyðarþjónusta', v: CLINIC.emergency, href: `tel:${CLINIC.emergencyHref}` },
                { k: 'Netfang', v: CLINIC.email, href: `mailto:${CLINIC.email}` },
                { k: 'Opnunartími', v: CLINIC.hours },
              ].map((c) => (
                <div key={c.k}>
                  <p className="eg-eyebrow" style={{ color: MINERAL }}>{c.k}</p>
                  <p className="eg-num mt-2 text-[17px] font-semibold break-words">
                    {c.href
                      ? <a href={c.href} className={`eg-link ${FOCUS}`}
                           style={{ color: EG_TEXT, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>{c.v}</a>
                      : c.v}
                  </p>
                </div>
              ))}
            </div>

            {/* her real licences, named on her own site */}
            <dl data-rv className="eg-rv mt-16">
              {LICENCES.map((l) => (
                <div key={l.label} className="grid gap-1 py-5 sm:grid-cols-[300px_1fr] sm:gap-8"
                     style={{ borderTop: `1px solid ${LINE}` }}>
                  <dt className="eg-eyebrow pt-1" style={{ color: MINERAL }}>{l.label}</dt>
                  <dd className="text-[15px]">{l.body}</dd>
                </div>
              ))}
            </dl>

            <p data-rv className="eg-rv mt-10 text-[14px] leading-relaxed" style={{ color: MINERAL }}>
              {CLINIC.legal} · {CLINIC.address} · kennitala {CLINIC.kt} · stofnuð {CLINIC.founded}
            </p>
          </div>
        </section>
      </main>

      <PreviewChrome company={company} />
      <PreviewFooter company={company} />
    </div>
  )
}
