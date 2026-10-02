import { useEffect, useState, type CSSProperties } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  ArrowButton, Btn, C, Chapter, CSS, Cursor, Header, Label, LineField, Reveal, StickyBar,
  Intro, Words, reduced, step, useGoto, useInview, useScrollFx,
} from './ui'
import {
  BIDSKYLI_STADIR, BIDSKYLI_TEXTI, CONTACT, JSON_LD, LEIDIR, LEIGU_REGLUR, MARKMID, PARTY_FACTS, PARTY_TENTS, PHOTO,
  PHOTO_CREDIT, SAGA, SAGA_FLEIRA, SAUMAD, SAUMAD_VERD, TEXTI, VEISLUTJALD, VERK_GRID, VERK_ONNUR, type Photo,
} from './data'
import { AwningFinder, BeforeAfter, BriefProvider, MarkisaLoford, RentalBuilder, RequestForm, TOOLS_CSS, kr, useBrief } from './Tools'

const company = getPreviewCompany('aegir')

/* Blocks that only the home page uses. Everything shared lives in ui.tsx. */
const PAGE_CSS = `
.aeg-hero{position:relative;min-height:100svh;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;color:#fff}
.aeg-hero .bg{position:absolute;inset:-10% 0 0;height:120%}
.aeg-hero .bg img{filter:saturate(.95)}
.aeg-hero .veil{position:absolute;inset:0;background:linear-gradient(to top,rgba(10,42,67,.9),rgba(10,42,67,.6) 45%,rgba(10,42,67,.26) 75%,rgba(10,42,67,.42));z-index:1}
/* a second, shorter scrim under the type block: white display copy has to clear AA
   over the brightest pixels of the photograph, not just its average */
.aeg-hero .veil2{position:absolute;inset:auto 0 0 0;height:72%;z-index:1;
  background:linear-gradient(to top,rgba(8,32,52,.94) 12%,rgba(8,32,52,.74) 46%,rgba(8,32,52,0))}
.aeg-hero .top{position:relative;z-index:2;padding:0 var(--gut) calc(var(--band) / 2)}
.aeg-hero h1{max-width:15ch;margin-top:.5em}
.aeg-hero .base{position:relative;z-index:2;padding:calc(var(--band) / 2) var(--gut) calc(var(--band) / 1.6);
  border-top:1px solid rgba(255,255,255,.25);display:grid;grid-template-columns:1.1fr 1.4fr auto;gap:var(--col);align-items:start}
@media (max-width:900px){.aeg-hero .base{grid-template-columns:1fr;gap:1.4rem}.aeg-hero h1{max-width:none}}
/* on a phone the photograph's own sign sat behind the label and headline; a taller
   frame pulls the sign up into the clear part of the picture */
@media (max-width:760px){.aeg-hero .bg{inset:-36% 0 auto;height:152%}}

.aeg-about{position:relative}
.aeg-about .top,.aeg-head2 .top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col);position:relative;z-index:1}
.aeg-about .btm{display:grid;grid-template-columns:1fr 1.4fr 1fr;gap:var(--col);margin-top:calc(var(--band) / 1.4);align-items:start;position:relative;z-index:1}
.aeg-about .btm .aeg-media{aspect-ratio:4 / 5}
.aeg-about .btm p+p{margin-top:1em}
@media (max-width:900px){.aeg-about .top,.aeg-head2 .top{grid-template-columns:1fr;gap:1.2rem}
  .aeg-about .btm{grid-template-columns:1fr;gap:1.6rem;margin-top:2.4rem}.aeg-about .btm .aeg-media{aspect-ratio:4 / 3}}

.aeg-serv .top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col)}
.aeg-ways{list-style:none;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--col);margin-top:calc(var(--band) / 1.6)}
.aeg-ways li{display:flex;flex-direction:column}
.aeg-ways a{display:flex;flex-direction:column;height:100%;color:inherit}
.aeg-ways .aeg-media{aspect-ratio:4 / 3}
.aeg-ways .n{font-size:var(--t-tag);opacity:.5;font-variant-numeric:tabular-nums;margin-top:1em}
.aeg-ways h3{margin-top:.25em}
.aeg-ways p{opacity:.74;margin-top:.5em;max-width:34ch}
.aeg-ways .go{margin-top:auto;padding-top:1.2em;font-size:var(--t-label);font-weight:600;text-transform:uppercase;letter-spacing:.06em;display:flex;align-items:center;gap:.6em;color:${C.blue}}
@media (max-width:1080px){.aeg-ways{grid-template-columns:repeat(2,minmax(0,1fr));gap:2.4rem var(--col)}}
@media (max-width:900px){.aeg-serv .top{grid-template-columns:1fr;gap:1rem}}
@media (max-width:560px){.aeg-ways{grid-template-columns:1fr}.aeg-ways .aeg-media{aspect-ratio:3 / 2}}

.aeg-verk .intro{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr) minmax(0,1.3fr);gap:var(--col);margin-bottom:calc(var(--band) / 1.5)}
@media (max-width:900px){.aeg-verk .intro{grid-template-columns:1fr;gap:1rem}}
.aeg-grid{font-size:0}
.aeg-card{display:inline-block;vertical-align:top;width:calc(33.3333% - var(--col));margin:0 calc(var(--col) / 2) calc(var(--band) / 1.6);font-size:var(--t-body);color:inherit}
/* the reference's full rhythm on seven jobs: a wide opener, a pair of portraits
   with a deliberate gap, then two pairs of half-width landscapes */
.aeg-card:nth-child(1){width:calc(66.6666% - var(--col))}
.aeg-card:nth-child(1) .aeg-media{aspect-ratio:3 / 2}
.aeg-card:nth-child(2),.aeg-card:nth-child(3){width:calc(33.3333% - var(--col))}
.aeg-card:nth-child(2) .aeg-media,.aeg-card:nth-child(3) .aeg-media{aspect-ratio:3 / 4}
.aeg-card:nth-child(3){margin-right:calc(33.3333% + var(--col) / 2)}
.aeg-card:nth-child(n+4){width:calc(50% - var(--col))}
.aeg-card:nth-child(n+4) .aeg-media{aspect-ratio:3 / 2}
.aeg-card .aeg-media{aspect-ratio:1 / 1}
.aeg-card .meta{display:flex;justify-content:space-between;gap:.6em;margin-top:.9em}
.aeg-card .meta .tags{display:flex;gap:.4em;flex-wrap:wrap}
.aeg-card h3{margin-top:.45em;padding-right:1.2em}
.aeg-media .inner:after{content:'';position:absolute;inset:0;background:${C.ink};opacity:.12;transition:opacity .3s;z-index:1}
@media (max-width:1080px){.aeg-card:nth-child(1){width:calc(100% - var(--col))}
  .aeg-card:nth-child(3){margin-right:calc(var(--col) / 2)}}
@media (max-width:760px){.aeg-card,.aeg-card:nth-child(n){width:100%;margin:0 0 2.6rem}
  .aeg-card .aeg-media,.aeg-card:nth-child(n) .aeg-media{aspect-ratio:4 / 3}}

.aeg-divider{height:1px;background:${C.hairline}}
.aeg-banner .cols{display:grid;grid-template-columns:1.1fr 1.2fr 1.4fr auto;gap:var(--col);align-items:center}
.aeg-banner .aeg-media{aspect-ratio:4 / 3}
.aeg-banner .onnur a{text-decoration:underline;text-decoration-color:${C.hairline};text-underline-offset:.2em}
.aeg-banner .onnur a:hover{text-decoration-color:currentColor}
@media (max-width:900px){.aeg-banner .cols{grid-template-columns:1fr;gap:1.4rem}}

.aeg-quote{position:relative;min-height:78vh;display:flex;align-items:center;overflow:hidden;color:#fff}
.aeg-quote .bg{position:absolute;inset:-8% 0;height:116%}
.aeg-quote .veil{position:absolute;inset:0;background:rgba(10,42,67,.62);z-index:1}
.aeg-quote .card{position:relative;z-index:2;background:rgba(0,112,176,.88);border-radius:var(--rad);padding:calc(var(--band) / 2);
  max-width:64ch;overflow:hidden}
.aeg-quote .qmark{font-size:var(--t-num);line-height:.7;opacity:.5;display:block}
.aeg-quote blockquote{margin-top:.6em;min-height:5.4em}
.aeg-quote .row{display:flex;justify-content:space-between;align-items:flex-end;gap:1rem;margin-top:1.6em}
.aeg-quote .count{font-size:var(--t-tag);letter-spacing:.08em;opacity:.8;font-variant-numeric:tabular-nums}
.aeg-quote .nav{display:flex;gap:.6em;color:#fff}
.aeg-quote .aeg-dot circle{stroke:#fff}
.aeg-quote .aeg-arrowbtn{border-color:rgba(255,255,255,.6)}
/* On a phone the card must fit between the floating header and the fold, or
   the first lines of the goal sit behind the header (caught on the iOS
   simulator). Smaller display size, no reserved height, tighter padding. */
@media (max-width:760px){.aeg-quote{min-height:0;padding:var(--band) 0}
  .aeg-quote .card{padding:2rem 1.4rem 1.6rem}
  .aeg-quote blockquote{min-height:0;font-size:var(--t-smaller);line-height:1.3}
  .aeg-quote .qmark{font-size:2.4rem}
  .aeg-quote .row{margin-top:1.2em}}

/* section head shared by the four service chapters */
.aeg-head2 .top .body{max-width:62ch}
.aeg-head2 .top .body p{margin-top:1.1em}
.aeg-head2{margin-bottom:calc(var(--band) / 1.4)}

/* tent hire: the two products, side by side */
.aeg-prod{display:grid;grid-template-columns:1fr 1fr;gap:calc(var(--col) * 2);margin-bottom:calc(var(--band) / 1.2)}
.aeg-prod article .aeg-media{aspect-ratio:3 / 2}
.aeg-prod h3{margin-top:.9em}
.aeg-prod .lead{margin-top:.6em;max-width:52ch}
.aeg-prod ul.facts{list-style:none;margin-top:1em}
.aeg-prod ul.facts li{border-top:1px solid ${C.hairline};padding:.7em 0;max-width:56ch}
.aeg-table{width:100%;border-collapse:collapse;margin-top:1.1rem;font-size:var(--t-body);font-variant-numeric:tabular-nums}
.aeg-table caption{position:absolute;left:-9999px}
.aeg-table th{font-size:var(--t-tag);font-weight:600;text-transform:uppercase;letter-spacing:.06em;text-align:left;padding:.6em .5em .6em 0;opacity:.7;border-bottom:1px solid ${C.ink}}
.aeg-table td{padding:.7em .5em .7em 0;border-bottom:1px solid ${C.hairline};vertical-align:baseline}
.aeg-table td:last-child,.aeg-table th:last-child{text-align:right;padding-right:0;white-space:nowrap}
@media (max-width:900px){.aeg-prod{grid-template-columns:1fr;gap:2.6rem}}
@media (max-width:420px){.aeg-table{font-size:15px}.aeg-table th{font-size:11px;letter-spacing:.03em}}

.aeg-strip{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--col);margin-top:calc(var(--band) / 1.2)}
.aeg-strip figure{margin:0}
.aeg-strip .aeg-media{aspect-ratio:4 / 3}
.aeg-strip .aeg-media.tall{aspect-ratio:3 / 4}
.aeg-strip figcaption.t{margin-top:.8em;max-width:36ch;font-size:var(--t-body);line-height:1.5}
.aeg-strip figcaption.t b{display:block;font-weight:600}
.aeg-strip.four{grid-template-columns:repeat(4,minmax(0,1fr))}
@media (max-width:900px){.aeg-strip,.aeg-strip.four{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:560px){.aeg-strip{grid-template-columns:1fr;gap:1.4rem}.aeg-strip.four{grid-template-columns:repeat(2,minmax(0,1fr));gap:.7rem}
  .aeg-strip.four .aeg-media,.aeg-strip.four .aeg-media.tall{aspect-ratio:1 / 1}}
.aeg-rules{margin-top:calc(var(--band) / 1.4);border-top:1px solid ${C.hairline}}
.aeg-rules summary{list-style:none;cursor:pointer;padding:1.1em 0;font-size:var(--t-lead);font-weight:600;display:flex;justify-content:space-between;gap:1rem;align-items:center;min-height:44px}
.aeg-rules summary::-webkit-details-marker{display:none}
.aeg-rules summary:after{content:'+';font-size:1.4em;line-height:1;transition:transform .3s}
.aeg-rules[open] summary:after{transform:rotate(45deg)}
.aeg-rules ul{list-style:none;padding-bottom:1.4rem;display:grid;gap:.7rem;max-width:70ch}
.aeg-rules li{padding-left:1.2em;position:relative;line-height:1.5}
.aeg-rules li:before{content:'';position:absolute;left:0;top:.7em;width:.5em;height:1px;background:currentColor;opacity:.6}
.aeg-rules summary:focus-visible{outline:2px solid ${C.blue};outline-offset:2px}

/* awnings */
.aeg-awn{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:calc(var(--col) * 2);margin-top:calc(var(--band) / 1.2);align-items:start}
.aeg-awn .aeg-media{aspect-ratio:3 / 2}
.aeg-awn .aeg-media.fan{aspect-ratio:4 / 3;margin-top:var(--col)}
@media (max-width:900px){.aeg-awn{grid-template-columns:1fr;gap:2rem}}

/* pools: dark band */
.aeg-pool{position:relative}
.aeg-pool .top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col);margin-bottom:calc(var(--band) / 1.4);position:relative;z-index:1}
.aeg-pool .body{max-width:62ch}
.aeg-pool .body p{margin-top:1.1em;opacity:.86}
.aeg-pool .wrap-ba{position:relative;z-index:1}
@media (max-width:900px){.aeg-pool .top{grid-template-columns:1fr;gap:1.2rem}}

/* workshop */
.aeg-saum-grid{list-style:none;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:calc(var(--col) * 1.4) var(--col)}
.aeg-saum-grid .aeg-media{aspect-ratio:4 / 3}
.aeg-saum-grid h3{margin-top:.8em}
.aeg-saum-grid p{opacity:.74;margin-top:.45em;max-width:34ch;font-size:var(--t-body)}
@media (max-width:1080px){.aeg-saum-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:560px){.aeg-saum-grid{grid-template-columns:1fr;gap:1.8rem}}
.aeg-saum-2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:calc(var(--col) * 2);margin-top:calc(var(--band) / 1.2);align-items:start}
@media (max-width:900px){.aeg-saum-2{grid-template-columns:1fr;gap:2.4rem}}
.aeg-bidskyli{display:grid;gap:1rem}
.aeg-bidskyli .aeg-media{aspect-ratio:3 / 2}
.aeg-bidskyli ul{list-style:none;display:flex;flex-wrap:wrap;gap:.4rem}
.aeg-verd{list-style:none;margin-top:1.1rem}
.aeg-verd li{display:flex;justify-content:space-between;gap:1.2rem;border-top:1px solid ${C.hairline};padding:.8em 0;font-variant-numeric:tabular-nums}
.aeg-verd li:last-child{border-bottom:1px solid ${C.hairline}}
.aeg-verd li span:last-child{white-space:nowrap;text-align:right}
@media (max-width:480px){.aeg-verd li{flex-direction:column;gap:.15em}.aeg-verd li span:last-child{text-align:left}}

/* history */
.aeg-saga .cols{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:calc(var(--col) * 2);align-items:start;margin-top:calc(var(--band) / 1.4)}
.aeg-time{list-style:none}
.aeg-time li{display:grid;grid-template-columns:5.2em minmax(0,1fr);gap:var(--col);border-top:1px solid ${C.hairline};padding:1em 0 1.1em}
.aeg-time li:last-child{border-bottom:1px solid ${C.hairline}}
.aeg-time .ar{font-variant-numeric:tabular-nums;color:${C.blue};font-weight:600}
.aeg-saga .pics{display:grid;gap:var(--col)}
.aeg-saga .pics .aeg-media{aspect-ratio:4 / 3}
.aeg-saga .fleira{margin-top:calc(var(--band) / 1.6);display:grid;grid-template-columns:1fr 1fr;gap:calc(var(--col) * 2)}
.aeg-saga .fleira p{max-width:54ch}
@media (max-width:900px){.aeg-saga .cols,.aeg-saga .fleira{grid-template-columns:1fr;gap:2rem}}

/* contact */
.aeg-c2a{position:relative;overflow:hidden;padding-top:2.4rem;margin-top:-2.4rem}
.aeg-c2a .head{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col);margin-bottom:calc(var(--band) / 1.4);position:relative;z-index:1}
.aeg-c2a .head p.l{max-width:56ch;margin-top:1.2em;opacity:.85}
.aeg-c2a .facts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--col);margin-top:calc(var(--band) / 1.2);padding-top:calc(var(--band) / 2);border-top:1px solid rgba(255,255,255,.25);position:relative;z-index:1}
.aeg-c2a .facts h3{font-size:var(--t-label);text-transform:uppercase;letter-spacing:.06em;font-weight:600;opacity:.6;margin-bottom:.8em}
.aeg-c2a .facts p,.aeg-c2a .facts a{font-size:var(--t-lead);line-height:1.5}
.aeg-c2a .facts a{text-decoration:underline;text-decoration-color:rgba(255,255,255,.4);text-underline-offset:.2em}
.aeg-c2a .reqwrap{position:relative;z-index:1}
@media (max-width:900px){.aeg-c2a .head{grid-template-columns:1fr;gap:1rem}.aeg-c2a .facts{grid-template-columns:repeat(2,minmax(0,1fr));gap:2rem 1rem}}
@media (max-width:480px){.aeg-c2a .facts{grid-template-columns:1fr}}

.aeg-back{display:inline-flex;align-items:center;gap:.5em;font-size:var(--t-label);text-transform:uppercase;letter-spacing:.06em;font-weight:600}
`

const dims = (ratio: string) => {
  const [w, h] = ratio.split('/').map((n) => Number(n.trim()))
  return { width: 1920, height: Math.round((1920 * h) / w) }
}

export function Media({ photo, speed = -1, scrim = 0.9, caption, className = '', sizes = '100vw', priority, style, pos }: {
  photo: Photo
  speed?: number
  scrim?: number
  caption?: string
  className?: string
  sizes?: string
  priority?: boolean
  style?: CSSProperties
  pos?: string
}) {
  return (
    <figure className={`aeg-media ${className}`} style={style}>
      <div className="inner" data-speed={speed}>
        <img
          src={photo.src}
          srcSet={photo.srcSet}
          sizes={sizes}
          alt={photo.alt}
          width={dims(photo.ratio).width}
          height={dims(photo.ratio).height}
          style={pos ? { objectPosition: pos } : undefined}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          // @ts-expect-error fetchpriority is valid HTML, React types lag
          fetchpriority={priority ? 'high' : undefined}
        />
      </div>
      <span className="scrim" data-scrim={scrim} />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

function Hero() {
  const ref = useInview<HTMLDivElement>()
  const goto = useGoto()
  return (
    <div className="aeg-hero" ref={ref}>
      <div className="bg" data-speed={-20} data-anchor="top">
        <img
          src={PHOTO.einstok.src}
          srcSet={PHOTO.einstok.srcSet}
          sizes="100vw"
          alt={PHOTO.einstok.alt}
          width={dims(PHOTO.einstok.ratio).width}
          height={dims(PHOTO.einstok.ratio).height}
          // @ts-expect-error fetchpriority is valid HTML, React types lag
          fetchpriority="high"
        />
      </div>
      <div className="veil" />
      <div className="veil2" />
      <div className="top">
        <Label>Seglagerðin Ægir ehf.</Label>
        <Words tag="h1" className="aeg-big" text={TEXTI.tagline} hold={0.35} />
      </div>
      <div className="base">
        <div className="aeg-rise" style={step(1)}>
          <Label>{TEXTI.heroLabel}</Label>
        </div>
        <p className="aeg-rise aeg-lead" style={step(2)}>{TEXTI.inngangur}</p>
        <div className="aeg-rise" style={step(3)}>
          <Btn href="#hafa-samband" variant="light" onClick={() => goto('#hafa-samband')}>Biðja um tilboð</Btn>
        </div>
      </div>
    </div>
  )
}

function QuoteSlider() {
  const [i, setI] = useState(0)
  const n = MARKMID.length
  const go = (d: number) => setI((p) => (p + d + n) % n)
  const [held, setHeld] = useState(false)
  useEffect(() => {
    if (reduced() || held) return
    const t = window.setInterval(() => setI((p) => (p + 1) % n), 9000)
    return () => clearInterval(t)
  }, [n, held])
  return (
    <section
      className="aeg-quote"
      id="stefna"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      <div className="bg" data-speed={-1}>
        <img src={PHOTO.markisaHus2.src} srcSet={PHOTO.markisaHus2.srcSet} sizes="100vw" alt="" width={dims(PHOTO.markisaHus2.ratio).width} height={dims(PHOTO.markisaHus2.ratio).height} loading="lazy" />
      </div>
      <div className="veil" />
      <div className="aeg-wrap">
        <Reveal className="card">
          <LineField top="auto" height={220} seed={4} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Label>Áherslur Seglagerðarinnar</Label>
            <span className="qmark" aria-hidden="true">&ldquo;</span>
            <blockquote key={i} className="aeg-normal" aria-live="polite">
              <Words tag="span" text={MARKMID[i]} hold={0.05} />
            </blockquote>
            <div className="row">
              <p className="count">
                {String(i + 1).padStart(2, '0')} <span aria-hidden="true">|</span> {String(n).padStart(2, '0')}
              </p>
              <div className="nav">
                <ArrowButton dir="left" label="Fyrri áhersla" onClick={() => go(-1)} />
                <ArrowButton dir="right" label="Næsta áhersla" onClick={() => go(1)} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function SectionHead({ n, label, h2, children, tag = 'h2' }: { n: string; label: string; h2: string; children?: React.ReactNode; tag?: 'h2' }) {
  return (
    <Reveal className="aeg-head2">
      <div className="top">
        <Chapter n={n} />
        <div className="body">
          <Label>{label}</Label>
          <Words tag={tag} className="aeg-normal" text={h2} />
          {children}
        </div>
      </div>
    </Reveal>
  )
}

function Ways() {
  const goto = useGoto()
  return (
    <ul className="aeg-ways">
      {LEIDIR.map((l, i) => (
        <Reveal as="li" key={l.id}>
          <a href={`#${l.id}`} data-cursor="card" onClick={(e) => { e.preventDefault(); goto(`#${l.id}`) }}>
            <Media photo={l.photo} className="aeg-rise" sizes="(max-width:560px) 100vw, (max-width:1080px) 46vw, 22vw" />
            <span className="n aeg-rise" style={step(1)}>{String(i + 1).padStart(2, '0')}</span>
            <h3 className="aeg-smallt aeg-rise" style={step(2)}>{l.titill}</h3>
            <p className="aeg-rise" style={step(3)}>{l.texti}</p>
            <span className="go aeg-rise" style={step(4)}>{l.hnappur}</span>
          </a>
        </Reveal>
      ))}
    </ul>
  )
}

function HomeBody() {
  const brief = useBrief()
  const goto = useGoto()
  return (
    <main id="efni">
      <Hero />

      <div className="aeg-band paper">
        <section className="aeg-about" id="um-okkur">
          <LineField top="6%" height={430} seed={2} />
          <div className="aeg-wrap">
            <Reveal className="top">
              <Chapter n="1.0" />
              <div>
                <Label>Um okkur</Label>
                <Words tag="h2" className="aeg-normal" text={TEXTI.um} />
              </div>
            </Reveal>
            <Reveal className="btm">
              <Media photo={PHOTO.sagaFyrr} sizes="(max-width:900px) 100vw, 26vw" className="aeg-rise" pos="50% 45%" />
              <div className="aeg-rise" style={step(2)}>
                <p>{TEXTI.umMalsgrein}</p>
                <p>{TEXTI.saumastofan}</p>
                <p>{TEXTI.tjaldaleigan}</p>
              </div>
              <div className="aeg-rise" style={step(3)}>
                <Btn href="#saga" variant="ghost" onClick={() => goto('#saga')}>Saga okkar</Btn>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="aeg-serv" id="thjonusta">
          <div className="aeg-wrap">
            <Reveal className="top">
              <Chapter n="1.1" />
              <p className="aeg-rise aeg-lead" style={{ ...step(1), maxWidth: '58ch' }}>{TEXTI.thjonustaIntro}</p>
            </Reveal>
            <Ways />
          </div>
        </section>
      </div>

      <div className="aeg-band white">
        <section className="aeg-verk" id="verkefni">
          <div className="aeg-wrap">
            <Reveal className="intro">
              <Chapter n="1.2" />
              <div>
                <Label>Verkin okkar</Label>
                <Words tag="h2" className="aeg-normal" text={TEXTI.verkH2} />
              </div>
              <p className="aeg-rise" style={step(2)}>{TEXTI.verkIntro}</p>
            </Reveal>
            <div className="aeg-grid">
              {VERK_GRID.map((v, idx) => (
                <Reveal as="article" key={v.slug} className="aeg-card">
                  <Link to={`/preview/aegir/verk/${v.slug}`} data-cursor="card" aria-label={v.stadur ? `${v.name}, ${v.flokkur.toLowerCase()}, ${v.stadur}` : `${v.name}, ${v.flokkur.toLowerCase()}`}>
                    <Media
                      photo={v.cover}
                      className="aeg-rise"
                      sizes={idx === 0 ? '(max-width:760px) 100vw, 60vw' : idx < 3 ? '(max-width:760px) 100vw, 30vw' : '(max-width:760px) 100vw, 45vw'}
                    />
                    <div className="meta aeg-rise" style={step(2)}>
                      <span className="tags"><span className="aeg-tag">{v.flokkur}</span></span>
                      {v.stadur ? <span className="aeg-tag">{v.stadur}</span> : null}
                    </div>
                    <h3 className="aeg-smallt aeg-rise" style={step(4)}>{v.name}</h3>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="aeg-wrap"><div className="aeg-divider" /></div>
        </section>

        <section className="aeg-banner">
          <div className="aeg-wrap">
            <Reveal className="cols">
              <Media photo={PHOTO.centrum} className="aeg-rise" sizes="(max-width:900px) 100vw, 24vw" />
              <Words tag="h2" className="aeg-normal" text={`Og ${VERK_ONNUR.length} verk til viðbótar.`} />
              <p className="aeg-rise onnur" style={step(2)}>
                {VERK_ONNUR.map((v, i) => (
                  <span key={v.slug}>
                    <Link to={`/preview/aegir/verk/${v.slug}`}>{v.name}</Link>
                    {i < VERK_ONNUR.length - 2 ? ', ' : i === VERK_ONNUR.length - 2 ? ' og ' : '.'}
                  </span>
                ))}
              </p>
              <div className="aeg-rise" style={step(3)}>
                <Btn href={CONTACT.simiHref} variant="brand">Hringja {CONTACT.simi}</Btn>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      <QuoteSlider />

      <div className="aeg-band paper">
        <section id="tjaldaleiga" style={{ position: 'relative' }}>
          <LineField top="0" height={430} seed={3} />
          <div className="aeg-wrap" style={{ position: 'relative', zIndex: 1 }}>
            <SectionHead n="1.3" label="Tjaldaleiga" h2={TEXTI.leigaH2}>
              <p className="aeg-rise aeg-lead" style={step(3)}>{TEXTI.leigaIntro}</p>
            </SectionHead>

            <Reveal className="aeg-prod">
              <article>
                <Media photo={PHOTO.partyPallur} className="aeg-rise" sizes="(max-width:900px) 100vw, 44vw" />
                <h3 className="aeg-smallt aeg-rise" style={step(1)}>Partýtjaldið</h3>
                <p className="lead aeg-rise" style={step(2)}>Partý tjaldið er auðvelt í uppsetningu og flutning. Það er til í fimm stærðum, 20, 30, 40, 50 og 60 fermetra, og allar stærðirnar líta eins út og eru settar upp á sama hátt.</p>
                <table className="aeg-table aeg-rise" style={step(3)}>
                  <caption>Partýtjald: stærðir, gestafjöldi og leiguverð</caption>
                  <thead><tr><th scope="col">Stærð</th><th scope="col">Mál</th><th scope="col">Gestir</th><th scope="col">Dag/helgarleiga</th></tr></thead>
                  <tbody>
                    {PARTY_TENTS.map((t) => (
                      <tr key={t.fm}><td>{t.fm} m²</td><td>{t.mal}</td><td>{t.gestir}</td><td>{kr(t.verd)}</td></tr>
                    ))}
                  </tbody>
                </table>
                <ul className="facts aeg-rise" style={step(4)}>
                  {PARTY_FACTS.map((f) => <li key={f}>{f}</li>)}
                </ul>
              </article>
              <article>
                <Media photo={PHOTO.veislaTun} className="aeg-rise" sizes="(max-width:900px) 100vw, 44vw" />
                <h3 className="aeg-smallt aeg-rise" style={step(1)}>Veislutjaldið</h3>
                <p className="lead aeg-rise" style={step(2)}>{VEISLUTJALD.notkun}</p>
                <ul className="facts aeg-rise" style={step(3)}>
                  <li>{VEISLUTJALD.stærd} Þú velur breidd 6, 9 eða 12 metra og lengdin fer eftir því hve margar einingar af grindinni eru settar upp.</li>
                  <li>{VEISLUTJALD.vegghaed}</li>
                  <li>{VEISLUTJALD.inngangur}</li>
                  <li>{VEISLUTJALD.uppsetning}</li>
                  <li><b>Verð:</b> tilboð, eftir stærð og staðsetningu.</li>
                </ul>
              </article>
            </Reveal>

            <Reveal>
              <RentalBuilder />
            </Reveal>

            <Reveal className="aeg-strip">
              <figure className="aeg-rise">
                <Media photo={PHOTO.hitari} className="" sizes="(max-width:560px) 100vw, 30vw" />
                <figcaption className="t"><b>Hitablásarar</b>Hitablásarar sem halda á þér hita sama hvernig viðrar. Þeir ganga fyrir gasi og eru 220 cm á hæð.</figcaption>
              </figure>
              <figure className="aeg-rise" style={step(1)}>
                <Media photo={PHOTO.golf2} className="" sizes="(max-width:560px) 100vw, 30vw" />
                <figcaption className="t"><b>Trégólf</b>Stöðugt og glæsilegt trégólf sem einstaklega auðvelt er að leggja. Hver eining er 50 cm × 300 cm.</figcaption>
              </figure>
              <figure className="aeg-rise" style={step(2)}>
                <Media photo={PHOTO.veislaInni} className="" sizes="(max-width:560px) 100vw, 30vw" />
                <figcaption className="t"><b>Borð og bekkir</b>Löngu borðin og bekkirnir eru úr fallegri og sterkri furu. Fótunum má smella niður til að auðvelda flutninga.</figcaption>
              </figure>
            </Reveal>

            <details className="aeg-rules">
              <summary>Reglur um leigubúnað</summary>
              <ul>{LEIGU_REGLUR.map((r) => <li key={r}>{r}</li>)}</ul>
            </details>
          </div>
        </section>
      </div>

      <div className="aeg-band white">
        <section id="markisur">
          <div className="aeg-wrap">
            <SectionHead n="1.4" label="Markísur og skyggni" h2={TEXTI.markisaH2}>
              <p className="aeg-rise aeg-lead" style={step(3)}>{TEXTI.markisaIntro}</p>
            </SectionHead>
            <Reveal>
              <AwningFinder />
            </Reveal>
            <Reveal className="aeg-awn">
              <div>
                <Label>Það sem þú getur treyst á</Label>
                <div style={{ marginTop: '1.2rem' }}><MarkisaLoford /></div>
                <Media photo={PHOTO.litir} className="aeg-rise fan" sizes="(max-width:900px) 100vw, 40vw" />
                <p className="aeg-rise" style={{ ...step(2), marginTop: '1em', maxWidth: '50ch' }}>Glæsilegt úrval er hjá okkur af mismunandi litum á akrýldúk. Við mælum og sérhönnum markísu fyrir þitt hús.</p>
              </div>
              <Media photo={PHOTO.markisaHus3} className="aeg-rise" sizes="(max-width:900px) 100vw, 40vw" style={{ aspectRatio: '4 / 5' }} />
            </Reveal>
            <Reveal className="aeg-strip four">
              {[PHOTO.markisaGata, PHOTO.markisaBox2, PHOTO.markisaPort, PHOTO.hlidar].map((p, i) => (
                <Media key={p.src} photo={p} className={`aeg-rise${p.portrait ? ' tall' : ''}`} style={step(i)} sizes="(max-width:560px) 100vw, 22vw" />
              ))}
            </Reveal>
          </div>
        </section>
      </div>

      <div className="aeg-band dark">
        <section className="aeg-pool" id="sundlaugar">
          <LineField top="0" height={380} seed={6} />
          <div className="aeg-wrap" style={{ position: 'relative', zIndex: 1 }}>
            <Reveal className="top">
              <Chapter n="1.5" />
              <div className="body">
                <Label>Sundlaugar og pottar</Label>
                <Words tag="h2" className="aeg-normal" text={TEXTI.laugH2} />
                <p className="aeg-rise" style={step(3)}>{TEXTI.laugIntro}</p>
                <p className="aeg-rise" style={step(4)}>Seglagerðin notast við sterkan pvc dúk og á bakkana er settur hálkufrír dúkur.</p>
              </div>
            </Reveal>
            <Reveal className="wrap-ba">
              <BeforeAfter />
            </Reveal>
            <Reveal className="aeg-strip four" style={{ marginTop: 'calc(var(--band) / 1.2)' }}>
              {[PHOTO.hlif1, PHOTO.potturEftir, PHOTO.pottur2, PHOTO.hlif3].map((p, i) => (
                <Media key={p.src} photo={p} className="aeg-rise" style={step(i)} sizes="(max-width:560px) 100vw, 22vw" />
              ))}
            </Reveal>
            <Reveal>
              <p className="aeg-rise" style={{ ...step(1), marginTop: '1.6rem', maxWidth: '60ch', opacity: 0.86 }}>
                Við útbúum líka yfirbreiðslur á sundlaugar og potta. Starfsmenn okkar hafa mikla reynslu af dúklögn í hinar ýmsu stærðir sundlauga og potta.
              </p>
              <div className="aeg-rise" style={{ ...step(2), marginTop: '1.6rem' }}>
                <Btn href="#hafa-samband" variant="light" onClick={() => { brief.setSaum({ flokkur: 'Annað', lysing: 'Sundlaug eða pottur: dúklögn eða yfirbreiðsla.' }); brief.senda('saum') }}>Senda verkefnið</Btn>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      <div className="aeg-band paper">
        <section id="saumastofa">
          <div className="aeg-wrap">
            <SectionHead n="1.6" label="Saumastofan og verkstæðið" h2={TEXTI.saumH2}>
              <p className="aeg-rise aeg-lead" style={step(3)}>{TEXTI.saumIntro}</p>
              <p className="aeg-rise" style={step(4)}>{TEXTI.saumVerkefni}</p>
            </SectionHead>

            <Reveal as="div">
              <ul className="aeg-saum-grid">
                {SAUMAD.map((s, i) => (
                  <li key={s.titill} className="aeg-rise" style={step(i % 4)}>
                    <Media photo={s.photo} sizes="(max-width:560px) 100vw, (max-width:1080px) 46vw, 22vw" />
                    <h3 className="aeg-smallert">{s.titill}</h3>
                    <p>{s.texti}</p>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="aeg-saum-2">
              <div className="aeg-bidskyli">
                <Media photo={PHOTO.bidskyli} className="aeg-rise" sizes="(max-width:900px) 100vw, 44vw" />
                <h3 className="aeg-smallt aeg-rise" style={step(1)}>Biðskýli</h3>
                <p className="aeg-rise" style={step(2)}>{BIDSKYLI_TEXTI}</p>
                <p className="aeg-rise" style={{ ...step(3), fontWeight: 600 }}>Biðskýlin frá okkur eru notuð í:</p>
                <ul className="aeg-rise" style={step(4)}>
                  {BIDSKYLI_STADIR.map((s) => <li key={s}><span className="aeg-tag">{s}</span></li>)}
                </ul>
              </div>
              <div>
                <Label>Verð á völdum vörum</Label>
                <ul className="aeg-verd aeg-rise">
                  {SAUMAD_VERD.map((v) => <li key={v.vara}><span>{v.vara}</span><span>{v.verd}</span></li>)}
                </ul>
                <p className="aeg-rise" style={{ ...step(2), marginTop: '1.6rem', maxWidth: '54ch' }}>Verkstæði Seglagerðarinnar býður upp á alhliða viðgerða- og viðhaldsþjónustu á seglum, tjöldum, skyggnum, yfirbreiðslum, sundlaugum og heitum pottum. Auðveldast er að koma með það sem gera á við en sé það ekki mögulegt sendir verkstæðið starfsmenn á staðinn.</p>
                <div className="aeg-rise" style={{ ...step(3), marginTop: '1.6rem' }}>
                  <Btn href="#hafa-samband" variant="brand" onClick={() => brief.senda('saum')}>Senda verkefnið</Btn>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      <div className="aeg-band white">
        <section className="aeg-saga" id="saga">
          <div className="aeg-wrap">
            <SectionHead n="1.7" label="Saga Seglagerðarinnar" h2={TEXTI.sagaH2}>
              <p className="aeg-rise" style={step(3)}>{TEXTI.sagaIntro}</p>
            </SectionHead>
            <Reveal className="cols">
              <ol className="aeg-time">
                {SAGA.map((s, i) => (
                  <li key={s.ar} className="aeg-rise" style={step(i % 4)}>
                    <span className="ar">{s.ar}</span>
                    <span>{s.texti}</span>
                  </li>
                ))}
              </ol>
              <div className="pics">
                <Media photo={PHOTO.sagaFyrr} className="aeg-rise" sizes="(max-width:900px) 100vw, 36vw" />
                <Media photo={PHOTO.sagaDalur} className="aeg-rise" style={step(1)} sizes="(max-width:900px) 100vw, 36vw" />
              </div>
            </Reveal>
            <Reveal className="fleira">
              {SAGA_FLEIRA.map((t, i) => <p key={t.slice(0, 20)} className="aeg-rise" style={step(i + 1)}>{t}</p>)}
            </Reveal>
          </div>
        </section>
      </div>

      <div className="aeg-band dark" id="hafa-samband">
        <section className="aeg-c2a">
          <LineField top="auto" height={300} seed={7} />
          <div className="aeg-wrap">
            <Reveal className="head">
              <Chapter n="1.8" />
              <div>
                <Label>Hafa samband</Label>
                <Words tag="h2" className="aeg-normal" text={TEXTI.metnadur} />
                <p className="l aeg-rise" style={step(3)}>{TEXTI.tilbod}</p>
              </div>
            </Reveal>
            <Reveal className="reqwrap">
              <RequestForm />
            </Reveal>
            <Reveal className="facts">
              <div className="aeg-rise">
                <h3>Heimilisfang</h3>
                <p>Seglagerðin Ægir<br />{CONTACT.heimilisfang}<br />{CONTACT.postnumer}</p>
              </div>
              <div className="aeg-rise" style={step(1)}>
                <h3>Sími</h3>
                <p><a href={CONTACT.simiHref}>{CONTACT.simi}</a></p>
              </div>
              <div className="aeg-rise" style={step(2)}>
                <h3>Netfang</h3>
                <p><a href={`mailto:${CONTACT.netfang}`}>{CONTACT.netfang}</a></p>
              </div>
              <div className="aeg-rise" style={step(3)}>
                <h3>Opnunartími</h3>
                <p>{CONTACT.opid}</p>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      <footer className="aeg-foot">
        <div className="aeg-wrap">
          <div className="cols">
            <div>
              <h3>Fyrirtækið</h3>
              <p>Seglagerðin Ægir ehf.<br />kt. {CONTACT.kennitala}<br />{CONTACT.heimilisfang}, {CONTACT.postnumer}</p>
            </div>
            <div>
              <h3>Samband</h3>
              <p>
                <a href={CONTACT.simiHref}>{CONTACT.simi}</a><br />
                <a href={`mailto:${CONTACT.netfang}`}>{CONTACT.netfang}</a>
              </p>
            </div>
            <div>
              <h3>Verkin</h3>
              <ul style={{ listStyle: 'none' }}>
                {VERK_GRID.map((v) => (
                  <li key={v.slug}><Link to={`/preview/aegir/verk/${v.slug}`}>{v.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Þjónusta</h3>
              <ul style={{ listStyle: 'none' }}>
                {LEIDIR.map((l) => <li key={l.id}>{l.titill}</li>)}
              </ul>
            </div>
          </div>
          <div className="rule" />
          <div className="fine">
            <p>{PHOTO_CREDIT}</p>
            <p>&copy; {new Date().getFullYear()} Seglagerðin Ægir ehf.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default function AegirPage() {
  useScrollFx()
  const loc = useLocation()
  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    document.title = 'Seglagerðin Ægir ehf. | Markísur, tjaldaleiga, sundlaugadúkar og sérsaumur frá 1913'
    document.documentElement.lang = 'is'
    const meta = document.querySelector('meta[name="description"]')
    const prevDesc = meta?.getAttribute('content') ?? ''
    meta?.setAttribute(
      'content',
      'Seglagerðin Ægir hannar og saumar markísur, skyggni, yfirbreiðslur og sundlaugadúka og leigir út veislutjöld og partýtjöld. Stofnuð 1913. Biddu um tilboð á netinu.',
    )
    setThemeColor(C.paper)
    return () => {
      document.title = prevTitle
      document.documentElement.lang = prevLang
      meta?.setAttribute('content', prevDesc)
    }
  }, [])

  /* arriving from a job page with a section to show: scroll to it once mounted */
  useEffect(() => {
    const hash = (loc.state as { hash?: string } | null)?.hash
    if (!hash) return
    const id = window.setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'auto', block: 'start' })
    }, 60)
    return () => window.clearTimeout(id)
  }, [loc])

  return (
    <div className="aeg-root">
      <style>{CSS}{PAGE_CSS}{TOOLS_CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />
      <Intro />
      <Cursor />
      <Header light />
      <StickyBar />
      <BriefProvider>
        <HomeBody />
      </BriefProvider>
      <PreviewFooter company={company} verifiedContent />
    </div>
  )
}
