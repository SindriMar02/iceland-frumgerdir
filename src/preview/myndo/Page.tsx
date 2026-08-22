import { useEffect, useRef, useState } from 'react'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { companyEntry as company } from './company'
import {
  STUDIO, HERO, STAGES, PACKAGES, PRINTS, PRICE_NOTE,
  PROCESS, SCHOOLS, OTHER, OLINA, IMAGES,
} from './data'

/* ------------------------------------------------------------------ tokens
   Transplanted from blastation.com, measured live at 1440x900 and 565x777 on
   2026-08-22. Their entire system is one typeface, four greys and no accent
   colour at all; the colour is supposed to come from the photographs. That is
   why it suits a photographer better than it suits a furniture maker.
   Two honest deviations from the measured original, both forced:
     - secondary text is #6E6E6E, not their #7F7F7F, which is 3.74:1 on the
       ground and fails AA for small text.
     - display line-height is 1.06, not their 1.0, because Icelandic uppercase
       carries acutes above the cap line and 1.0 clips them.                   */

const INK = '#000000'
const GROUND = '#F7F7F7'
const PAPER = '#FFFFFF'
const RULE = '#E7E7E7'
const MUTE = '#6E6E6E'

/* Their exact stack. No webfont, nothing to download. */
const FACE = '"Helvetica Neue", Helvetica, Arial, sans-serif'

/* Their measured fluid curve, solved through both breakpoints. */
const T_H1 = 'clamp(36.75px, 22.54px + 2.514vw, 58.75px)'
const T_H2 = 'clamp(27.56px, 19.45px + 1.436vw, 40.12px)'
const T_BODY = 'clamp(21px, 19.75px + 0.221vw, 22.93px)'
const T_LABEL = 'clamp(11.81px, 11.11px + 0.125vw, 12.9px)'

const NAV = [
  { id: 'aeviskeidin', label: 'Æviskeiðin' },
  { id: 'verdskra', label: 'Verðskrá' },
  { id: 'ferlid', label: 'Ferlið' },
  { id: 'skolamyndir', label: 'Skólamyndir' },
  { id: 'stofan', label: 'Stofan' },
]

/* Real proportions, so a tile's width tracks its own photograph the way a
   Bla Station tile tracks its product. */
const RATIO: Record<string, number> = {
  bumba: 1000 / 722, nyburi: 1400 / 990, born: 1400 / 1939,
  ferming: 1400 / 1939, utskrift: 1, gifting: 1400 / 1939,
  fjolskyldan: 1000 / 800,
}

/* The three stages she has more than one frame for get a full chapter. */
const CHAPTERS = [
  { id: 'born', a: '/myndo/extra-born-0.webp', b: '/myndo/extra-born-1.webp', wide: '/myndo/stage-bumba.webp' },
  { id: 'ferming', a: '/myndo/extra-ferming-2.webp', b: '/myndo/extra-ferming-3.webp', wide: '/myndo/stage-utskrift.webp' },
  { id: 'gifting', a: '/myndo/extra-gifting-4.webp', b: '/myndo/extra-gifting-5.webp', wide: '/myndo/fjolskyldan.webp' },
]

/* ------------------------------------------------------------------ styles */

const CSS = `
html,body{background:${GROUND}}
.my{background:${GROUND};color:${INK};font-family:${FACE};-webkit-font-smoothing:antialiased}
.my *{box-sizing:border-box}
.my-w{width:100%;max-width:1440px;margin:0 auto;padding:0 15px}

/* Their type roles. Display is 700 uppercase with 0.25px tracking, labels are
   500 uppercase at 12.9px, and body copy is LARGER than the labels by 1.78x. */
.my-h1{font-size:${T_H1};font-weight:700;line-height:1.06;letter-spacing:.25px;text-transform:uppercase;margin:0}
.my-h2{font-size:${T_H2};font-weight:700;line-height:1.06;letter-spacing:.25px;text-transform:uppercase;margin:0}
.my-lede{font-size:${T_BODY};font-weight:400;line-height:1.25;margin:0}
.my-lab{font-size:${T_LABEL};font-weight:500;line-height:1.333;letter-spacing:.25px;text-transform:uppercase}
.my-code{font-size:${T_LABEL};font-weight:400;line-height:1.333;letter-spacing:.25px}
.my-cap{font-size:13.5px;font-weight:400;line-height:1.42;color:${INK}}
.my-mute{color:${MUTE}}

/* A chapter opens on a 1px hairline that runs the container width. */
.my-sec{position:relative;padding-top:15.3px;margin-top:56px}
.my [id]{scroll-margin-top:60px}
.my-sec--rule::before{content:"";position:absolute;top:0;left:15px;right:15px;height:1px;background:${RULE}}

/* Reveal is opacity ONLY. They animate no transform anywhere on the page:
   base 0.7s ease-in-out, and the in-view state overrides to 0.25s ease-out,
   so it fades in quickly and would fade out slowly. */
.my-spy{opacity:0;transition:opacity .7s ease-in-out}
.my-spy.is-in{opacity:1;transition:opacity .25s ease-out}
@media (prefers-reduced-motion:reduce){.my-spy{opacity:1;transition:none}}

/* The black bar. Two stacked copies of the label; the wrapper rolls up by one
   line-height on hover so the second copy takes the first one's place. */
.my-btn{display:block;width:100%;background:${INK};color:${PAPER};border-radius:3.8px;
  padding:11.5px;text-decoration:none;border:0;cursor:pointer;text-align:center}
.my-btn__vp{display:block;height:17.2px;overflow:hidden}
.my-btn__roll{display:block;transition:transform .3s ease-in-out}
.my-btn__c{display:flex;align-items:center;justify-content:center;gap:10px;height:17.2px}
.my-btn:hover .my-btn__roll,.my-btn:focus-visible .my-btn__roll{transform:translateY(-17.2px)}
.my-btn svg{width:13px;height:13px;flex:none;stroke:currentColor;stroke-width:2;fill:none}
@media (prefers-reduced-motion:reduce){.my-btn__roll{transition:none}}

/* Catalogue row: fixed tile height, width set by the photograph's own ratio. */
.my-rail{--th:clamp(300px,34vw,470px);display:flex;gap:8px;overflow-x:auto;scroll-snap-type:x mandatory;
  scrollbar-width:none;-ms-overflow-style:none;padding-bottom:2px}
.my-rail::-webkit-scrollbar{display:none}
.my-tile{flex:none;scroll-snap-align:start;text-decoration:none;color:${INK};display:block}
.my-tile__f{background:${PAPER};display:flex;align-items:center;justify-content:center;overflow:hidden}
.my-tile img{display:block;height:100%;width:100%;object-fit:cover}
.my-tile__m{display:flex;gap:8px;align-items:baseline;padding-top:9px}

.my-dot{width:7px;height:7px;background:${RULE};border:0;padding:0;cursor:pointer}
.my-dot[data-on="1"]{background:${INK}}
.my-arw{width:26px;height:26px;display:flex;align-items:center;justify-content:center;
  background:none;border:0;cursor:pointer;color:${INK}}
.my-arw:disabled{opacity:.25;cursor:default}
.my-arw svg{width:14px;height:14px;stroke:currentColor;stroke-width:1.5;fill:none}

/* Two images side by side, caption under each. */
.my-2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.my-2>*{min-width:0}
.my-2 figure{margin:0}
.my-2 img{display:block;width:100%;height:auto}
.my-2 figcaption{padding-top:9px;max-width:62ch}

/* Chapter: one tall frame left, text and its two supporting frames right, both
   columns locked to the same height. Their b-media-with-text carries six lines
   of body copy in that right column; her stage descriptions are one sentence,
   so the column strands unless the supporting frames come up into it. */
.my-ch{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:minmax(0,1fr);gap:8px;height:clamp(420px,62vh,680px)}
.my-ch>*{min-height:0;min-width:0}
.my-ch>img{width:100%;height:100%;object-fit:cover;object-position:center 28%;display:block}
.my-ch__side{display:flex;flex-direction:column;gap:12px;min-height:0}
.my-ch__pair{display:grid;grid-template-columns:1fr 1fr;gap:8px;flex:1 1 auto;min-height:0}
.my-ch__pair img{width:100%;height:100%;object-fit:cover;object-position:center 26%;display:block}
@media (max-width:800px){
  .my-ch{grid-template-columns:1fr;grid-template-rows:auto;height:auto}
  .my-ch>img{height:clamp(300px,58vh,480px)}
  .my-ch__pair{height:230px}
}

/* Image left, text right. */
.my-mt{display:grid;grid-template-columns:1fr 1fr;gap:8px;align-items:start}
.my-mt img{display:block;width:100%;height:auto}

.my-fixed{position:fixed;top:0;left:0;right:0;z-index:60;background:${GROUND};border-bottom:1px solid ${RULE}}
.my-mark{background:${INK};color:${PAPER};display:inline-block;padding:5px 9px 6px;
  font-weight:700;letter-spacing:.25px;font-size:17px;line-height:1;text-transform:uppercase}
.my-navlink{text-decoration:none;color:${INK};position:relative}
.my-navlink::after{content:"";position:absolute;left:0;right:0;bottom:-4px;height:1px;
  background:${INK};transform:scaleX(0);transform-origin:left;transition:transform .3s ease-in-out}
.my-navlink:hover::after,.my-navlink:focus-visible::after{transform:scaleX(1)}

.my-hgrid{display:flex;flex-direction:row;align-items:flex-start;margin:0 -7.64px}
.my-hgrid>*{flex:0 1 50%;min-width:0;padding:0 7.64px}
@media (max-width:800px){.my-hgrid{display:block;margin:0}.my-hgrid>*{padding:0}.my-hgrid>*+*{padding-top:14px}}
.my-row{display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap}
.my-tbl{width:100%;border-collapse:collapse}
.my-tbl td{padding:14px 0;border-bottom:1px solid ${RULE};vertical-align:top}

.my :focus-visible{outline:2px solid ${INK};outline-offset:3px}

.my-nav-mob{display:none}
.my-botpad{height:64px}
@media (max-width:800px){.my-botpad{height:120px}}
@media (max-width:800px){
  .my-rail{--th:clamp(190px,42vw,260px)}
  .my-2,.my-mt{grid-template-columns:1fr;gap:8px}
  .my-sec{margin-top:40px}
  .my-nav-desk{display:none !important}
  .my-nav-mob{display:block}
  .my-h1,.my-h2{overflow-wrap:break-word}
  /* A table cannot shrink below its min-content width; with nowrap prices that
     floor was 415px on a 390px phone and it pushed the whole document wide.
     Stack the rows instead, which also reads better on a phone. */
  .my-tbl,.my-tbl tbody,.my-tbl tr,.my-tbl td{display:block;width:auto}
  .my-tbl tr{border-bottom:1px solid ${RULE};padding:13px 0}
  .my-tbl td{border:0;padding:0;text-align:left !important}
  .my-tbl td+td{padding-top:5px}
}
`

/* ------------------------------------------------------------------ pieces */

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 12h20M12 2l10 10L12 22" strokeMiterlimit="10" />
    </svg>
  )
}

/** Their button: an arrow, then the label, duplicated and rolled on hover. */
function Bar({ href, label, onClick }: { href?: string; label: string; onClick?: () => void }) {
  const inner = (
    <span className="my-btn__vp">
      <span className="my-btn__roll">
        <span className="my-btn__c my-lab"><Arrow />{label}</span>
        <span className="my-btn__c my-lab" aria-hidden="true"><Arrow />{label}</span>
      </span>
    </span>
  )
  if (onClick) return <button type="button" className="my-btn" onClick={onClick}>{inner}</button>
  return <a className="my-btn" href={href}>{inner}</a>
}

/** Opacity-only reveal, per their scrollspy. */
function Spy({ children, as = 'section', ...rest }: any) {
  const ref = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { el.classList.add('is-in'); io.unobserve(el) } }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const Tag = as as any
  const { className, ...attrs } = rest
  return <Tag ref={ref} {...attrs} className={`my-spy ${className || ''}`}>{children}</Tag>
}

/** The catalogue row: title, count, square dots, prev/next, snapping tiles. */
function Rail({ id, title, count, children, n }:
  { id?: string; title: string; count: string; children: React.ReactNode; n: number }) {
  const rail = useRef<HTMLDivElement | null>(null)
  const [i, setI] = useState(0)
  const [ends, setEnds] = useState({ s: true, e: false })

  useEffect(() => {
    const el = rail.current
    if (!el) return
    const onScroll = () => {
      const step = el.scrollWidth / Math.max(1, n)
      setI(Math.min(n - 1, Math.round(el.scrollLeft / Math.max(1, step))))
      setEnds({ s: el.scrollLeft <= 2, e: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 })
    }
    onScroll()
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { el.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [n])

  const go = (d: number) => {
    const el = rail.current
    if (!el) return
    const first = el.firstElementChild as HTMLElement | null
    el.scrollBy({ left: d * ((first?.offsetWidth || 320) + 8), behavior: 'smooth' })
  }

  return (
    <Spy className="my-sec my-sec--rule" id={id}>
      <div className="my-w">
        <div className="my-row" style={{ marginBottom: 20 }}>
          <h2 className="my-h2">{title}</h2>
          <div className="my-row" style={{ gap: 18, flex: '0 0 auto' }}>
            <span className="my-lab">{count}</span>
            <span style={{ display: 'flex', gap: 5 }}>
              {Array.from({ length: n }).map((_, k) => (
                <button key={k} type="button" className="my-dot" data-on={k === i ? '1' : '0'}
                  aria-label={`Fara á ${k + 1}`}
                  onClick={() => rail.current?.scrollTo({
                    left: k * (((rail.current.firstElementChild as HTMLElement)?.offsetWidth || 320) + 8),
                    behavior: 'smooth',
                  })} />
              ))}
            </span>
            <span style={{ display: 'flex' }}>
              <button type="button" className="my-arw" onClick={() => go(-1)} disabled={ends.s} aria-label="Fyrri">
                <svg viewBox="0 0 24 24"><path d="M15 3L6 12l9 9" /></svg>
              </button>
              <button type="button" className="my-arw" onClick={() => go(1)} disabled={ends.e} aria-label="Næsta">
                <svg viewBox="0 0 24 24"><path d="M9 3l9 9-9 9" /></svg>
              </button>
            </span>
          </div>
        </div>
      </div>
      <div className="my-w"><div className="my-rail" ref={rail}>{children}</div></div>
    </Spy>
  )
}

/* -------------------------------------------------------------------- page */

export default function MyndoPage() {
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    if (!menu) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false) }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  }, [menu])

  const stage = (id: string) => STAGES.find((s) => s.id === id)!
  const TH = 'var(--th)'

  return (
    <div className="my">
      <style>{CSS}</style>
      <PreviewChrome company={company} />

      {/* header: black-box wordmark left, nav distributed, actions right */}
      <header className="my-fixed">
        <div className="my-w" style={{ display: 'flex', alignItems: 'center', gap: 20, height: 46 }}>
          <a href="#top" className="my-mark" style={{ textDecoration: 'none', flex: '0 0 auto' }}>Myndó</a>
          <nav aria-label="Aðalvalmynd"
            style={{ display: 'flex', flex: 1, justifyContent: 'space-evenly' }}
            className="my-lab my-nav-desk">
            {NAV.map((n) => <a key={n.id} className="my-navlink" href={`#${n.id}`}>{n.label}</a>)}
          </nav>
          <a href={`tel:${STUDIO.telHref}`} className="my-lab my-navlink my-nav-desk"
            style={{ flex: '0 0 auto' }}>{STUDIO.tel}</a>
          <button type="button" onClick={() => setMenu(true)} aria-label="Opna valmynd" aria-expanded={menu}
            className="my-nav-mob" style={{ marginLeft: 'auto', background: 'none', border: 0, padding: 6, cursor: 'pointer' }}>
            <span style={{ display: 'block', width: 20, height: 1.5, background: INK, marginBottom: 5 }} />
            <span style={{ display: 'block', width: 20, height: 1.5, background: INK }} />
          </button>
        </div>
      </header>

      {/* mobile panel: X sits where the burger was */}
      <div role="dialog" aria-modal="true" aria-label="Valmynd"
        style={{
          position: 'fixed', inset: 0, zIndex: 70, background: GROUND,
          opacity: menu ? 1 : 0, visibility: menu ? 'visible' : 'hidden',
          transition: 'opacity .3s ease-in-out, visibility .3s',
        }}>
        <div className="my-w" style={{ height: 46, display: 'flex', alignItems: 'center', borderBottom: `1px solid ${RULE}` }}>
          <button type="button" onClick={() => setMenu(false)} aria-label="Loka valmynd"
            style={{ marginLeft: 'auto', background: 'none', border: 0, padding: 6, cursor: 'pointer', lineHeight: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" stroke={INK} strokeWidth="1.5" fill="none">
              <path d="M4 4l16 16M20 4L4 20" />
            </svg>
          </button>
        </div>
        <nav className="my-w" style={{ paddingTop: 26, display: 'grid', gap: 18 }}>
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} onClick={() => setMenu(false)}
              className="my-h2" style={{ textDecoration: 'none', color: INK }}>{n.label}</a>
          ))}
          <div style={{ paddingTop: 18 }}>
            <Bar href={`tel:${STUDIO.telHref}`} label={`Hringja ${STUDIO.tel}`} />
          </div>
        </nav>
      </div>

      <main id="top" style={{ paddingTop: 46 }}>
        {/* hero: image, title, lede, black bar */}
        <section className="my-w" style={{ paddingTop: 8 }}>
          <img src={stage('nyburi').photo} alt={stage('nyburi').alt}
            width={1400} height={990} fetchPriority="high"
            style={{ display: 'block', width: '100%', height: 'clamp(420px,72vh,780px)', objectFit: 'cover' }} />
          <div className="my-hgrid" style={{ paddingTop: 18 }}>
            <div><h1 className="my-h1">{HERO.headline}</h1></div>
            <div>
              <p className="my-lede">{HERO.lede}</p>
              <div style={{ paddingTop: 20 }}>
                <Bar href={HERO.cta.href} label={HERO.cta.label} />
              </div>
            </div>
          </div>
        </section>

        {/* the family: seven life stages as one catalogue row */}
        <Rail id="aeviskeidin" title="Æviskeiðin" count={`${STAGES.length} æviskeið`} n={STAGES.length}>
          {STAGES.map((s) => (
            <a key={s.id} className="my-tile"
              href={CHAPTERS.some((c) => c.id === s.id) ? `#kafli-${s.id}` : '#verdskra'}
              style={{ width: `calc(${TH} * ${RATIO[s.id].toFixed(3)})` }}>
              <span className="my-tile__f" style={{ height: TH }}>
                <img src={s.photo} alt={s.alt} loading="lazy" />
              </span>
              <span className="my-tile__m">
                <span className="my-code my-mute">{s.n}</span>
                <span className="my-lab">{s.name}</span>
                {s.price && <span className="my-code my-mute" style={{ marginLeft: 'auto' }}>{s.price} kr.</span>}
              </span>
            </a>
          ))}
        </Rail>

        {/* their b-cards--1: a single full-width frame, no title, as a breather */}
        {(() => null)()}

        {/* three chapters, for the stages she has more than one frame of */}
        {CHAPTERS.map((c) => {
          const s = stage(c.id)
          const pkg = PACKAGES.find((p) => p.price === s.price)
          return (
            <div key={c.id} id={`kafli-${c.id}`}>
              <Spy className="my-sec my-sec--rule">
                <div className="my-w">
                  <h2 className="my-h2" style={{ marginBottom: 20 }}>{s.name}</h2>
                  <div className="my-ch">
                    <img src={s.photo} alt={s.alt} loading="lazy" />
                    <div className="my-ch__side">
                      <div>
                        <p className="my-lede">{s.body}</p>
                        {pkg && <p className="my-cap my-mute" style={{ paddingTop: 10 }}>{pkg.fits}</p>}
                        {s.price && (
                          <p className="my-lab" style={{ paddingTop: 12 }}>
                            {s.price} kr. · {s.dur}{pkg ? ` · ${pkg.incl}` : ''}
                          </p>
                        )}
                      </div>
                      <div className="my-ch__pair">
                        <img src={c.a} alt={`${s.name} hjá Myndó.`} loading="lazy" />
                        <img src={c.b} alt={`${s.name} hjá Myndó.`} loading="lazy" />
                      </div>
                    </div>
                  </div>
                </div>
              </Spy>
              <Spy className="my-sec">
                <div className="my-w">
                  <img src={c.wide} alt={`${s.name} hjá Myndó.`} loading="lazy"
                    style={{ display: 'block', width: '100%', height: 'clamp(360px,64vh,700px)', objectFit: 'cover' }} />
                </div>
              </Spy>
            </div>
          )
        })}

        {/* verðskrá, in the same catalogue grammar */}
        <Spy className="my-sec my-sec--rule" id="verdskra">
          <div className="my-w">
            <div className="my-row" style={{ marginBottom: 20 }}>
              <h2 className="my-h2">Verðskrá</h2>
              <span className="my-lab">{PACKAGES.length} pakkar</span>
            </div>
            <table className="my-tbl">
              <tbody>
                {PACKAGES.map((p) => (
                  <tr key={p.name}>
                    <td style={{ width: '30%' }}>
                      <span className="my-lab">{p.name}</span><br />
                      <span className="my-code my-mute">{p.dur}</span>
                    </td>
                    <td className="my-cap" style={{ paddingRight: 24 }}>{p.fits}<br />
                      <span className="my-mute">{p.incl}</span></td>
                    <td className="my-lab" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{p.price} kr.</td>
                  </tr>
                ))}
                {PRINTS.map((p) => (
                  <tr key={p.k}>
                    <td><span className="my-lab">{p.k}</span></td>
                    <td className="my-cap my-mute">{p.note}</td>
                    <td className="my-lab" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{p.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="my-cap my-mute" style={{ paddingTop: 16, maxWidth: '72ch' }}>{PRICE_NOTE}</p>
          </div>
        </Spy>

        {/* ferlið */}
        <Spy className="my-sec my-sec--rule" id="ferlid">
          <div className="my-w">
            <div className="my-row" style={{ marginBottom: 20 }}>
              <h2 className="my-h2">Ferlið</h2>
              <span className="my-lab">{PROCESS.length} skref</span>
            </div>
            <div className="my-2" style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
              {PROCESS.map((p) => (
                <div key={p.n} style={{ borderTop: `1px solid ${RULE}`, paddingTop: 14 }}>
                  <span className="my-code my-mute">{p.n}</span>
                  <h3 className="my-lab" style={{ paddingTop: 6 }}>{p.t}</h3>
                  <p className="my-cap" style={{ paddingTop: 8 }}>{p.b}</p>
                </div>
              ))}
            </div>
          </div>
        </Spy>

        {/* skólamyndir */}
        <Spy className="my-sec my-sec--rule" id="skolamyndir">
          <div className="my-w">
            <h2 className="my-h2" style={{ marginBottom: 20 }}>{SCHOOLS.title}</h2>
            <div className="my-mt">
              <img src={IMAGES.nyburi2} alt="Mynd úr myndasafni Myndó." loading="lazy" />
              <div>
                <p className="my-lede">{SCHOOLS.body}</p>
                <div style={{ paddingTop: 20 }}>
                  <Bar href={`tel:${STUDIO.telHref}`} label="Hafa samband um skólamyndir" />
                </div>
                <p className="my-lab my-mute" style={{ paddingTop: 22 }}>Einnig</p>
                <ul style={{ listStyle: 'none', margin: 0, padding: '8px 0 0' }}>
                  {OTHER.map((o) => (
                    <li key={o} className="my-cap" style={{ borderTop: `1px solid ${RULE}`, padding: '10px 0' }}>{o}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Spy>

        {/* stofan */}
        <Spy className="my-sec my-sec--rule" id="stofan">
          <div className="my-w">
            <h2 className="my-h2" style={{ marginBottom: 20 }}>Stofan</h2>
            <div className="my-mt">
              <img src={IMAGES.olina} alt={`${OLINA.name}, ljósmyndari Myndó.`} loading="lazy" />
              <div>
                <span className="my-code my-mute">{OLINA.role}</span>
                <h3 className="my-lab" style={{ paddingTop: 4 }}>{OLINA.name}</h3>
                {OLINA.body.map((b) => (
                  <p key={b} className="my-lede" style={{ paddingTop: 12 }}>{b}</p>
                ))}
                <p className="my-lab my-mute" style={{ paddingTop: 18 }}>
                  {STUDIO.address} · Stofnuð {STUDIO.founded}
                </p>
              </div>
            </div>
          </div>
        </Spy>

        {/* contact, in their "THE LATEST" shape: title left, black bar right */}
        <Spy className="my-sec my-sec--rule" id="hafa-samband">
          <div className="my-w">
            <div className="my-mt" style={{ alignItems: 'center' }}>
              <h2 className="my-h2">Bóka myndatöku</h2>
              <Bar href={`tel:${STUDIO.telHref}`} label={`Hringja ${STUDIO.tel}`} />
            </div>
            <p className="my-cap my-mute" style={{ paddingTop: 16 }}>
              {STUDIO.legal} · kt. {STUDIO.kt} · {STUDIO.address} · {STUDIO.member}
            </p>
          </div>
        </Spy>

        <div className="my-botpad" style={{ height: 64 }} />
      </main>

      {/* mobile: the call bar is always reachable */}
      <div className="my-nav-mob" style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 55, padding: '8px 15px calc(8px + env(safe-area-inset-bottom))', background: GROUND, borderTop: `1px solid ${RULE}` }}>
        <Bar href={`tel:${STUDIO.telHref}`} label={`Hringja ${STUDIO.tel}`} />
      </div>

      <PreviewFooter company={company} />
    </div>
  )
}
