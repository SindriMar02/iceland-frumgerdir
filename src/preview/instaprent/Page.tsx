import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { companyEntry as company } from './company'
import { BIZ, CATS, PRODUCTS, type Product } from './catalog'
import { ABOUT, ASSURE, FAQ, HERO, INTERTEXT, STEPS, TILES } from './content'
import { B, CSS, Card, Chars, Footer, Header, IMG, ROOT, Shell, bag, catName, inCat, kr, useMagnetic, useReveals, useSmooth } from './ui'

/* ==========================================================================
   Pages. Section order and every measurement follow the Coutumes teardown;
   additions a gift-shop customer needs (how it works, product row, FAQ) are
   built only from Coutumes' own components. Declared in DESIGN notes below.
   ========================================================================== */

/* React 18 only passes the lowercase attribute through. */
const HI = { fetchpriority: 'high' } as object

const PAGE_CSS = `
/* HERO (Coutumes .mosaic_tile.is-full + .mosaic_hero): one full-bleed image. The
   seasonal campaign word is replaced by her own line, centred: the headline in the
   condensed campaign face (letters rise out of a clip, magnetic weight on desktop),
   her slogan under it, then the two things a first-time visitor needs to do.
   Phones: the copy sits under a 9/10 crop so all of it lands on the first screen. */
.ip-hero{position:relative;container-type:inline-size;background:var(--beige);overflow:hidden}
.ip-hero_stage{position:relative}
/* Phone: a 9/10 crop so the headline and both buttons land on the first screen. */
.ip-hero_media{display:block;position:relative;aspect-ratio:9/10;max-height:calc(100svh - var(--nav-h) - 200px);min-height:340px;width:100%;overflow:hidden}
.ip-hero_media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 38%;
  animation:ip-hero-in 1.6s var(--reveal) both}
@media (min-width:1024px){.ip-hero_media{aspect-ratio:auto;max-height:none;height:100vh;height:100dvh;min-height:560px}.ip-hero_media img{object-position:50% 50%}}
@supports (animation-timeline: scroll()){
  .ip-hero_media picture{position:absolute;inset:0;animation:ip-hero-par linear both;animation-timeline:scroll(root);animation-range:0 100vh}
}
@keyframes ip-hero-in{from{transform:scale(1.08)}to{transform:none}}
@keyframes ip-hero-par{to{transform:translate3d(0,14%,0)}}
.ip-hero_copy{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;text-align:center;gap:14px;padding:26px var(--pad) 34px;background:var(--white)}
.ip-hero .ip-hero_title{font-family:var(--cond);font-weight:700;text-transform:uppercase;line-height:.86;letter-spacing:-.015em;font-size:12.4vw;color:var(--black);white-space:nowrap}
/* padding keeps Ó and Ö inside the clip the letters rise out of; the negative margin keeps the leading tight */
.ip-hero_line{display:block;overflow:hidden;padding-top:.22em;margin-top:-.22em}
.ip-hero_line:first-child{margin-top:0}
.ip-hero_title [data-ch]{display:inline-block;white-space:pre;animation:ip-char-in .9s var(--reveal) both;animation-delay:calc(.2s + var(--i) * .035s)}
.ip-hero_line + .ip-hero_line [data-ch]{animation-delay:calc(.42s + var(--i) * .035s)}
@keyframes ip-char-in{from{transform:translate3d(0,110%,0)}to{transform:none}}
.ip-hero .ip-hero_slogan{font-style:italic;font-size:19px;line-height:24px;animation:ip-fade .7s .8s var(--reveal) both}
.ip-hero_btns{display:flex;flex-wrap:wrap;justify-content:center;gap:8px 20px;align-items:center;margin-top:4px;animation:ip-fade .7s .95s var(--reveal) both}
@media (min-width:1024px){
  .ip-hero_copy{position:absolute;left:0;right:0;bottom:var(--copy-b,12vh);background:none;padding:0 24px;gap:18px}
  .ip-hero .ip-hero_title{font-size:6.4cqw}
  .ip-hero .ip-hero_slogan{font-size:22px;line-height:28px}
}
@keyframes ip-fade{from{opacity:0;transform:translate3d(0,8px,0)}to{opacity:1;transform:none}}

/* INTERTEXT (edito-intertext: 104px above and below on desktop, centred, 4 of 12 cols) */
.ip-inter{display:grid;justify-items:center;text-align:center;gap:18px;padding:64px var(--pad)}
.ip-inter p{max-width:460px}
@media (min-width:1024px){.ip-inter{padding:104px 24px}}

/* MOSAIC (c-mosaic, 4/5 tiles). Deviation asked for by Sindri: a gap and side
   padding between the categories instead of edge to edge. */
.ip-mosaic{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--gap);padding:0 var(--gap)}
@media (min-width:1024px){.ip-mosaic{grid-template-columns:repeat(4,minmax(0,1fr))}}
.ip-tile{position:relative;display:block;container-type:inline-size;overflow:hidden;background:var(--beige)}
.ip-tile_media{display:block;aspect-ratio:4/5;overflow:hidden}
.ip-tile_media img{width:100%;height:100%;object-fit:cover;transition:transform 1.2s var(--reveal)}
@media (hover:hover){.ip-tile:hover .ip-tile_media img{transform:scale(1.04)}}
.ip-tile_over{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.4cqw;text-align:center;
  text-transform:uppercase;pointer-events:none;padding:0 4%}
/* Coutumes darkens each tile (--overlay-darken); a centred falloff keeps the coloured
   title readable on her lighter product shots without greying the whole picture. */
.ip-tile_over::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(ellipse 75% 42% at 50% 50%,rgba(0,0,0,.38),rgba(0,0,0,.1))}
.ip-tile_t{display:block;white-space:nowrap;font-family:var(--cond);font-weight:750;line-height:.85;letter-spacing:-.01em;color:var(--c);
  font-size:min(18cqw,calc(92cqw / (var(--len) * .5)));text-shadow:0 1px 24px rgba(0,0,0,.3)}
.ip-tile_s{display:block;font-family:var(--cond);font-weight:700;font-size:5.6cqw;letter-spacing:.04em;color:var(--white);text-shadow:0 1px 12px rgba(0,0,0,.35)}
@media (min-width:1024px){.ip-tile_t{font-size:min(15cqw,calc(92cqw / (var(--len) * .5)))}.ip-tile_s{font-size:3.4cqw}}

/* Section heading (c-mosaic .mosaic_heading: 22px / 28px, 28px / 44px padding) */
.ip-heading{font-size:22px;line-height:1.2;text-align:center;padding:28px 16px}
@media (min-width:1024px){.ip-heading{font-size:28px;padding:44px 16px}}
.ip-sec{padding-top:40px}
@media (min-width:1024px){.ip-sec{padding-top:88px}}

/* HOW IT WORKS: three steps, Coutumes type only */
.ip-steps{display:grid;gap:28px;padding:0 var(--pad) 8px;max-width:1200px;margin:0 auto}
@media (min-width:768px){.ip-steps{grid-template-columns:repeat(3,1fr)}}
/* phones: number beside the text, so all three steps sit on one screen */
.ip-steps{gap:0}
.ip-step{display:grid;grid-template-columns:48px 1fr;column-gap:14px;row-gap:6px;align-items:start;padding:20px 4px;border-top:1px solid var(--beige-500)}
.ip-step b{grid-row:span 2;font-family:var(--cond);font-weight:700;font-size:52px;line-height:.8;color:var(--orange);padding-top:2px}
@media (min-width:768px){
  .ip-steps{gap:24px}
  .ip-step{grid-template-columns:none;justify-items:center;text-align:center;gap:10px;padding:24px 12px}
  .ip-step b{grid-row:auto;font-size:64px;padding-top:0}
}
.ip-step:nth-child(2) b{color:var(--blue)}.ip-step:nth-child(3) b{color:var(--pink)}
.ip-step p{max-width:30ch}

/* product row */
.ip-rowhead{display:flex;justify-content:space-between;align-items:center;padding:0 var(--pad) 18px;gap:16px}
.ip-rowhead .ip-heading{padding:0;text-align:left}
.ip .ip-more{display:flex;justify-content:center;padding:32px 0 0}

/* EDITORIAL DUO (c-mosaic mosaic_2: 5/6 tiles, serif title 4.8cqw, sub 1.8cqw) */
.ip-duo{display:grid;gap:var(--gap);padding:0 var(--gap)}
@media (min-width:768px){.ip-duo{grid-template-columns:1fr 1fr}}
.ip-duo .ip-tile_media{aspect-ratio:5/6}
.ip-duo .ip-tile_over::before{background:radial-gradient(ellipse 80% 38% at 50% 50%,rgba(0,0,0,.44),rgba(0,0,0,.14))}
.ip-duo_t{font-family:var(--serif);font-weight:400;font-size:7.4cqw;line-height:1.05;color:var(--white);text-transform:none}
.ip-duo_s{font-family:var(--cond);font-weight:700;font-size:3.4cqw;letter-spacing:.04em;color:var(--white);margin-top:.6cqw}
@media (min-width:1024px){.ip-duo_t{font-size:4.8cqw}.ip-duo_s{font-size:1.8cqw}}

/* FAQ: Coutumes PDP disclosure rows (▸ + Plaak 6 caps) */
.ip-faq{max-width:760px;margin:0 auto;padding:0 var(--pad)}
.ip-faq details{border-bottom:1px solid var(--beige-500)}
.ip-faq summary{list-style:none;display:flex;gap:12px;align-items:center;padding:18px 0;cursor:pointer}
.ip-faq summary::-webkit-details-marker{display:none}
.ip-faq summary::before{content:"";border:4px solid transparent;border-left:5px solid currentColor;border-right:0;transition:transform .2s ease}
.ip-faq details[open] summary::before{transform:rotate(90deg)}
.ip-faq details p{padding:0 0 20px 17px;max-width:60ch}

/* REASSURANCE (reinsurance-block: 4 cols, Plaak 6 11px caps, 6px orange rule) */
.ip-assure{display:grid;grid-template-columns:1fr 1fr;border-bottom:6px solid var(--orange);margin-top:64px}
@media (min-width:1024px){.ip-assure{grid-template-columns:repeat(4,1fr);margin-top:104px}}
.ip-assure li{display:grid;place-items:center;text-align:center;padding:40px 16px;min-height:108px}
.ip-assure .u-cta{max-width:150px;text-wrap:balance}

/* COLLECTION (Coutumes §9) */
.ip-coll_head{padding:32px var(--pad) 28px;border-bottom:1px solid var(--beige-500)}
.ip-coll_head h1{font-size:28px;line-height:1.2;display:inline-flex;align-items:flex-start;gap:8px}
@media (min-width:1024px){.ip-coll_head{padding:56px 24px 40px}.ip-coll_head h1{font-size:36px;line-height:43.2px}}
.ip-coll_head sup{font-family:var(--ext);font-weight:700;font-size:10px;line-height:1;margin-top:6px}
.ip-coll_head .intro{margin-top:10px;max-width:46ch;font-size:14px;line-height:18px;color:rgba(0,0,0,.7)}
.ip-coll_cats{display:grid;gap:14px;padding:22px var(--pad);border-bottom:1px solid var(--beige-500)}
@media (min-width:1024px){.ip-coll_cats{grid-template-columns:1fr auto;padding:24px}}
.ip-coll_list{display:grid;grid-auto-flow:column;grid-auto-columns:104px;gap:8px;overflow-x:auto;scrollbar-width:none}
@media (min-width:1024px){.ip-coll_list{grid-auto-columns:120px}}
.ip-coll_list a{display:grid;gap:8px;font-size:14px;line-height:18px}
.ip-coll_list img{aspect-ratio:1;width:100%;object-fit:cover;background:var(--beige)}
.ip-coll_list a[aria-current] img{outline:1px solid var(--black);outline-offset:-1px}
.ip-coll_bar{display:flex;justify-content:space-between;align-items:center;padding:14px var(--pad) 20px}
.ip-coll_bar select{appearance:none;border:0;background:none;font:inherit;font-family:var(--ext);font-weight:700;font-size:11px;text-transform:uppercase;padding:10px 18px 10px 0;cursor:pointer}
.ip-dens{display:none;gap:14px}
@media (min-width:1024px){.ip-dens{display:flex}}
.ip-dens button{font-family:var(--ext);font-weight:700;font-size:11px;color:#bbb;padding:8px 2px}
.ip-dens button[aria-pressed="true"]{color:var(--black)}

/* PRODUCT (Coutumes §10) */
.ip-pdp{display:grid}
@media (min-width:1024px){.ip-pdp{grid-template-columns:50% 1fr;min-height:calc(100vh - var(--nav-h))}}
.ip-pdp_media{position:relative;background:var(--beige)}
.ip-pdp_main{aspect-ratio:4/5;position:relative;overflow:hidden}
.ip-pdp_main img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.ip-pdp_main img.contain{object-fit:contain;padding:10%}
@media (min-width:1024px){.ip-pdp_media{position:sticky;top:var(--nav-h);height:calc(100vh - var(--nav-h))}.ip-pdp_main{aspect-ratio:auto;height:100%}}
.ip-pdp_right{display:grid;align-content:start;gap:24px;padding:20px var(--pad) 40px}
@media (min-width:1024px){.ip-pdp_right{grid-template-columns:118px minmax(0,340px);column-gap:72px;padding:80px 24px 80px 22px}}
.ip-thumbs{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none}
@media (min-width:1024px){.ip-thumbs{flex-direction:column;gap:18px}}
.ip-thumbs button{flex:0 0 72px;aspect-ratio:4/5;background:var(--beige);outline:1px solid transparent;outline-offset:-1px}
@media (min-width:1024px){.ip-thumbs button{flex-basis:auto;width:118px}}
.ip-thumbs button[aria-pressed="true"]{outline:2px solid var(--black);outline-offset:-2px}
.ip-thumbs img{width:100%;height:100%;object-fit:cover}
.ip-info{display:grid;gap:22px;align-content:start}
.ip-info_top{display:flex;justify-content:space-between;gap:20px;align-items:flex-start}
.ip-info_top h1{font-size:18px;line-height:20px}
.ip-info_top .u-price{font-size:16px;line-height:20px;white-space:nowrap}
.ip-desc{font-size:14px;line-height:16px}
.ip-field{display:grid;gap:12px}
.ip-opts{display:flex;flex-wrap:wrap;gap:6px}
.ip-opt{min-width:42px;height:42px;padding:0 12px;box-shadow:inset 0 0 0 1px var(--beige-500);font-size:14px;transition:box-shadow .15s}
.ip-opt[aria-checked="true"]{box-shadow:inset 0 0 0 1px var(--black)}
@media (hover:hover){.ip-opt:hover{box-shadow:inset 0 0 0 1px #888}}
.ip-opt.sw{width:42px;padding:0}
.ip-opt.sw i{display:block;width:30px;height:30px;margin:auto;box-shadow:inset 0 0 0 1px rgba(0,0,0,.15)}
.ip-upload{display:grid;gap:10px}
.ip-drop{display:flex;align-items:center;justify-content:center;gap:10px;min-height:64px;box-shadow:inset 0 0 0 1px var(--black);font-family:var(--ext);font-weight:700;font-size:11px;text-transform:uppercase}
.ip-drop.err{box-shadow:inset 0 0 0 1px #b3261e}
.ip-pics{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.ip-pics li{position:relative;aspect-ratio:1;background:var(--beige)}
.ip-pics img{width:100%;height:100%;object-fit:cover}
.ip-pics button{position:absolute;top:4px;right:4px;width:24px;height:24px;background:var(--white);font-size:14px;line-height:24px}
.ip-info textarea{width:100%;min-height:90px;border:0;box-shadow:inset 0 0 0 1px var(--beige-500);padding:12px;font:inherit;font-size:16px;line-height:22px;resize:vertical}
.ip-info textarea:focus{outline:none;box-shadow:inset 0 0 0 1px var(--black)}
.ip-err{color:#b3261e;font-size:12px}
.ip-stock{display:flex;align-items:center;gap:10px;font-size:14px}
.ip-stock::before{content:"";width:6px;height:6px;border-radius:50%;background:#2f8f46}
.ip-rows details{border-top:1px solid var(--beige-500)}
.ip-rows details:last-child{border-bottom:1px solid var(--beige-500)}
.ip-rows summary{list-style:none;display:flex;gap:10px;align-items:center;padding:14px 0;cursor:pointer}
.ip-rows summary::-webkit-details-marker{display:none}
.ip-rows summary::before{content:"";border:4px solid transparent;border-left:5px solid currentColor;border-right:0;transition:transform .2s ease}
.ip-rows details[open] summary::before{transform:rotate(90deg)}
.ip-rows p{padding:0 0 16px 15px;font-size:14px;line-height:18px}
.ip-sticky{position:fixed;left:0;right:0;bottom:0;z-index:30;display:flex;gap:12px;align-items:center;justify-content:space-between;
  padding:10px var(--pad) calc(10px + env(safe-area-inset-bottom));background:linear-gradient(to top,var(--white) 70%,rgba(255,255,255,0));transform:translateY(110%);transition:transform .3s var(--easing)}
.ip-sticky.on{transform:none}
@media (min-width:1024px){.ip-sticky{display:none}}
.ip-related{padding:64px 0 0}

/* ABOUT */
.ip-about{display:grid;gap:40px;padding:40px var(--pad) 0;max-width:1200px;margin:0 auto}
@media (min-width:1024px){.ip-about{grid-template-columns:1fr 360px;gap:96px;padding:80px 24px 0}}
.ip-about_text p{font-size:18px;line-height:26px}
.ip-about_text p+p{margin-top:16px}
.ip-about_text h2{font-size:22px;line-height:28px;margin:40px 0 12px}
.ip-spec li{display:flex;justify-content:space-between;gap:16px;padding:10px 0;border-bottom:1px solid var(--beige-500);font-size:14px}
.ip-spec a{text-decoration:underline;text-underline-offset:3px}
`

/* ------------------------------------------------------------------ home */
function Home() {
  const title = useMagnetic<HTMLHeadingElement>()
  const picks = useMemo(() => ['kanna-med-thinni-mynd-og-texta', 'pusluspil-ur-vid', 'pudi-med-thinni-honnun-hor', 'samfella-med-thinni-honnun']
    .map((s) => PRODUCTS.find((p) => p.slug === s)).filter(Boolean) as Product[], [])
  return (
    <main id="main">
      <section className="ip-hero" aria-labelledby="hero-t">
        <div className="ip-hero_stage">
          <div className="ip-hero_media" aria-hidden="true">
            <picture>
              <source media="(max-width:1023px)" srcSet={IMG('hero-m')} />
              <img src={IMG('hero-d')} srcSet={`${IMG('hero-d-1200')} 1200w, ${IMG('hero-d')} 2400w`} sizes="100vw" alt="" {...HI} decoding="async" />
            </picture>
          </div>
          <div className="ip-hero_copy">
            <h1 className="ip-hero_title" id="hero-t" ref={title}>
              <span className="ip-sr">{HERO.title.join(' ')}</span>
              <span aria-hidden="true">{HERO.title.map((l) => <span className="ip-hero_line" key={l}><Chars text={l} /></span>)}</span>
            </h1>
            <p className="ip-hero_slogan">{HERO.slogan}</p>
            <div className="ip-hero_btns">
              <Link to={`${ROOT}/${HERO.primary.to}`} className="c-button -bg"><span>{HERO.primary.label}</span></Link>
              <Link to={`${ROOT}/${HERO.secondary.to}`} className="c-button"><span>{HERO.secondary.label}</span></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="ip-inter">
        <p className="u-title-300 rv">{INTERTEXT.text}</p>
        <a href="#svona" className="ip-textlink u-p-100 rv" style={{ ['--d' as string]: '.1s' }}>{INTERTEXT.link}</a>
      </section>

      <section aria-label="Flokkar">
        <div className="ip-mosaic">
          {TILES.map((t, i) => {
            const name = catName(t.cat)
            /* one line, sized by the whole title: a wrapped second line puts Ö and Þ accents into the line above at .85 leading */
            const len = name.length
            return (
              <Link key={t.cat} to={`${ROOT}/flokkur/${t.cat}`} className="ip-tile rv" style={{ ['--c' as string]: t.color, ['--len' as string]: len, ['--d' as string]: `${i * 0.1}s` }}>
                <span className="ip-tile_media rv-img"><img src={IMG(t.img + '-s')} srcSet={`${IMG(t.img + '-s')} 700w, ${IMG(t.img)} 1400w`} sizes="(min-width:1024px) 25vw, 50vw" alt="" loading="lazy" decoding="async" /></span>
                <span className="ip-tile_over"><span className="ip-tile_t">{name}</span><span className="ip-tile_s">Skoða</span></span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="ip-sec" id="svona" aria-labelledby="svona-t">
        <h2 className="ip-heading rv" id="svona-t">Svona virkar þetta</h2>
        <ol className="ip-steps">
          {STEPS.map((s, i) => (
            <li className="ip-step rv" key={s.t} style={{ ['--d' as string]: `${i * 0.1}s` }}>
              <b aria-hidden="true">{i + 1}</b>
              <h3 className="u-cta">{s.t}</h3>
              <p className="u-p-100">{s.p}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="ip-sec" aria-labelledby="picks-t">
        <div className="ip-rowhead">
          <h2 className="ip-heading rv" id="picks-t">Með þinni mynd</h2>
          <Link to={`${ROOT}/flokkur/thin-honnun`} className="c-button"><span>Allt með þinni mynd</span></Link>
        </div>
        <div className="c-grid">
          {picks.map((p, i) => <div className="rv" key={p.slug} style={{ ['--d' as string]: `${i * 0.08}s` }}><Card p={p} /></div>)}
        </div>
        <p className="ip-more"><Link to={`${ROOT}/verslun`} className="c-button -line"><span>Allar vörur</span></Link></p>
      </section>

      <section className="ip-sec" aria-label="Instaprent">
        <div className="ip-duo">
          <Link to={`${ROOT}/um-okkur#samband`} className="ip-tile rv">
            <span className="ip-tile_media rv-img"><img src={IMG('shop-frames')} alt="" loading="lazy" decoding="async" /></span>
            <span className="ip-tile_over"><span className="ip-duo_t">Verslun og verkstæði</span><span className="ip-duo_s">Háholt 14, Mosfellsbæ</span></span>
          </Link>
          <Link to={`${ROOT}/um-okkur`} className="ip-tile rv" style={{ ['--d' as string]: '.1s' }}>
            <span className="ip-tile_media rv-img"><img src={IMG('p-oroi-med-thinni-mynd-1')} alt="" loading="lazy" decoding="async" /></span>
            <span className="ip-tile_over"><span className="ip-duo_t">Um Instaprent</span><span className="ip-duo_s">Sjá nánar</span></span>
          </Link>
        </div>
      </section>

      <section className="ip-sec" aria-labelledby="faq-t">
        <h2 className="ip-heading rv" id="faq-t">Spurt og svarað</h2>
        <div className="ip-faq">
          {FAQ.map((f, i) => (
            <details key={f.q} className="rv" style={{ ['--d' as string]: `${i * 0.06}s` }}>
              <summary className="u-cta">{f.q}</summary>
              <p className="u-p-100">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <Assure />
    </main>
  )
}

function Assure() {
  return (
    <ul className="ip-assure" aria-label="Þjónusta">
      {ASSURE.map((a, i) => <li key={a} className="rv" style={{ ['--d' as string]: `${i * 0.1}s` }}><span className="u-cta">{a}</span></li>)}
    </ul>
  )
}

/* ------------------------------------------------------------------ collection */
function Collection({ cat }: { cat: string | null }) {
  const list = cat ? inCat(cat) : PRODUCTS
  const [sort, setSort] = useState('')
  const [dens, setDens] = useState<'2' | '4'>('4')
  const rows = useMemo(() => {
    const r = [...list]
    if (sort === 'price') r.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') r.sort((a, b) => b.price - a.price)
    return r
  }, [list, sort])
  const title = cat ? catName(cat) : 'Allar vörur'
  const intro = cat ? CATS.find((c) => c.slug === cat)?.intro : 'Persónulegar gjafir og ljósmyndaprentun, prentað hjá okkur í Mosfellsbæ.'
  return (
    <main id="main">
      <header className="ip-coll_head">
        <h1>{title} <sup>[{list.length}]</sup></h1>
        {intro ? <p className="intro">{intro}</p> : null}
      </header>
      <div className="ip-coll_cats">
        <span className="u-cta">Flokkar [{CATS.length}]</span>
        <nav className="ip-coll_list" aria-label="Flokkar">
          {CATS.map((c) => {
            const im = inCat(c.slug)[0]?.imgs[0]
            return (
              <Link key={c.slug} to={`${ROOT}/flokkur/${c.slug}`} aria-current={c.slug === cat ? 'page' : undefined}>
                {im ? <img src={IMG(im.src + '-s')} alt="" loading="lazy" /> : null}
                <span>{c.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="ip-coll_bar">
        <label>
          <span className="ip-sr">Raða</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Raða +</option>
            <option value="price">Verð, lægst fyrst</option>
            <option value="price-desc">Verð, hæst fyrst</option>
          </select>
        </label>
        <div className="ip-dens" role="group" aria-label="Uppröðun">
          <button type="button" aria-pressed={dens === '2'} onClick={() => setDens('2')}>2</button>
          <button type="button" aria-pressed={dens === '4'} onClick={() => setDens('4')}>4</button>
        </div>
      </div>
      <div className="c-grid" data-d={dens}>
        {rows.map((p, i) => <div className="rv" key={p.slug} style={{ ['--d' as string]: `${(i % 4) * 0.06}s` }}><Card p={p} eager={i < 4} /></div>)}
      </div>
      <Assure />
    </main>
  )
}

/* ------------------------------------------------------------------ product */
const FK_SIZES: Record<string, { label: string; tiers: [number, number][]; min?: number; group: string[] }> = {
  '10x15': { label: '10×15', tiers: [[100, 60], [0, 55]], min: 600, group: ['10x15'] },
  '10x10': { label: '10×10', tiers: [[10, 90], [50, 85], [0, 80]], group: ['10x10'] },
  polaroid: { label: 'Polaroid', tiers: [[0, 90]], group: ['polaroid'] },
}
const fkPrice = (key: string, n: number) => {
  const s = FK_SIZES[key]
  let u = 0
  for (const [max, v] of s.tiers) { u = v; if (max === 0 || n <= max) break }
  return Math.max(u * n, s.min ?? 0)
}

/* Her Wix copy asks for the photo by email or "flipann mynd já takk"; the upload
   field on this page replaces that step, so the instruction is dropped. */
const cleanDesc = (d: string) => {
  const t = d.replace(/\s*Þú sendir okkur.*?(\.(?=\s)|$)/g, '').trim()
  return /[.!?]$/.test(t) ? t : `${t}.`
}

function ProductPage({ p }: { p: Product }) {
  const [img, setImg] = useState(0)
  const [sel, setSel] = useState<Record<string, string>>(() => Object.fromEntries(p.variations[0] ? Object.entries(p.variations[0].attrs) : []))
  const [pics, setPics] = useState<{ url: string; name: string }[]>([])
  const [text, setText] = useState<string[]>(() => (p.personalize?.texts ?? []).map(() => ''))
  const [err, setErr] = useState('')
  const [sticky, setSticky] = useState(false)
  const input = useRef<HTMLInputElement | null>(null)
  const buyRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => { setImg(0); setPics([]); setErr('') }, [p.slug])
  const fixedSel = sel['Fjöldi mynda'] ? parseInt(sel['Fjöldi mynda'], 10) : 0
  useEffect(() => { if (fixedSel) setPics((v) => v.slice(0, fixedSel)) }, [fixedSel])
  useEffect(() => {
    const el = buyRef.current
    if (!el) return
    /* Coutumes' phone buy bar: shown whenever the main button is off screen */
    const io = new IntersectionObserver(([e]) => setSticky(!e.isIntersecting))
    io.observe(el); return () => io.disconnect()
  }, [p.slug])
  const variation = p.variations.find((v) => Object.entries(v.attrs).every(([k, val]) => sel[k] === val))
  const fk = p.framkollun
  const fkKey = fk && FK_SIZES[fk] ? fk : null
  const n = Math.max(1, pics.length)
  /* Framköllun: her tiered per-print prices. Stækkanir: the chosen size's price per print. */
  const unit = fkKey ? fkPrice(fkKey, n) : fk ? (variation?.price ?? p.price) * n : variation?.price ?? p.price
  const pz = p.personalize
  /* Samsettar myndir: the "Fjöldi mynda" choice sets exactly how many photos are needed. */
  const fixedCount = sel['Fjöldi mynda'] ? parseInt(sel['Fjöldi mynda'], 10) : 0
  const maxPics = fk ? 200 : fixedCount || (pz?.photo?.max ?? 0)
  const minPics = fk ? 1 : fixedCount || (pz?.require === 'photo' ? Math.max(1, pz.photo?.min ?? 1) : 0)
  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const fs = Array.from(e.target.files ?? []).slice(0, Math.max(0, maxPics - pics.length))
    setPics((v) => [...v, ...fs.map((f) => ({ url: URL.createObjectURL(f), name: f.name }))])
    setErr(''); e.target.value = ''
  }
  const add = () => {
    if (fk && !pics.length) { setErr('Veldu myndirnar sem á að prenta.'); return }
    if (minPics && pics.length < minPics) { setErr(minPics > 1 ? `Veldu ${minPics} myndir, þú ert með ${pics.length}.` : 'Veldu myndina sem á að prenta.'); return }
    if (pz?.require === 'either' && !pics.length && !text.some((t) => t.trim())) { setErr('Veldu mynd eða skrifaðu texta, eða hvort tveggja.'); return }
    const reqIdx = (pz?.texts ?? []).findIndex((t, i) => t.required && !text[i]?.trim())
    if (reqIdx >= 0) { setErr(`Fylltu út „${pz?.texts[reqIdx].label}“.`); return }
    const opts = [
      ...Object.entries(sel).map(([k, v]) => `${k}: ${v}`),
      ...(pics.length ? [`Mynd: ${pics.length} ${pics.length === 1 ? 'mynd' : 'myndir'}`] : []),
      ...text.map((t, i) => (t.trim() ? `${pz?.texts[i].label}: ${t.trim()}` : '')).filter(Boolean),
    ].join(' · ')
    bag.add({ slug: p.slug, name: fk ? `${p.name}, ${pics.length} ${pics.length === 1 ? 'mynd' : 'myndir'}` : p.name, opts: fk ? Object.entries(sel).map(([k, v]) => `${k}: ${v}`).join(' · ') : opts, unit, img: p.imgs[0].src })
    setPics([]); setText((v) => v.map(() => ''))
  }
  const related = PRODUCTS.filter((x) => x.slug !== p.slug && x.cats.some((c) => p.cats.includes(c))).slice(0, 4)
  const cur = p.imgs[img] ?? p.imgs[0]
  return (
    <main id="main">
      <div className="ip-pdp">
        <div className="ip-pdp_media">
          <div className="ip-pdp_main">
            <img key={cur.src} src={IMG(cur.src)} alt={p.name} className={cur.fit === 'contain' ? 'contain' : ''} decoding="async" {...HI} />
          </div>
        </div>
        <div className="ip-pdp_right">
          {p.imgs.length > 1 ? (
            <div className="ip-thumbs" role="group" aria-label="Myndir">
              {p.imgs.map((im, i) => (
                <button key={im.src} type="button" aria-pressed={i === img} aria-label={`Mynd ${i + 1}`} onClick={() => setImg(i)}>
                  <img src={IMG(im.src + '-s')} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          ) : <div />}
          <div className="ip-info">
            <div className="ip-info_top">
              <h1>{p.name}</h1>
              <p className="u-price">{kr(unit)}</p>
            </div>
            <p className="ip-desc">{cleanDesc(p.desc)}</p>

            {p.attrs.map((a) => (
              <div className="ip-field" key={a.name}>
                <span className="u-cta">{a.name}{sel[a.name] ? <span style={{ fontFamily: 'var(--serif)', fontWeight: 400, textTransform: 'none', marginLeft: 8, fontSize: 13 }}>{sel[a.name]}</span> : null}</span>
                <div className="ip-opts" role="radiogroup" aria-label={a.name}>
                  {a.options.map((o) => (
                    <button key={o} type="button" role="radio" aria-checked={sel[a.name] === o} className={`ip-opt${a.kind === 'swatch' ? ' sw' : ''}`}
                      title={o} onClick={() => setSel((s) => ({ ...s, [a.name]: o }))}>
                      {a.kind === 'swatch' ? <i style={{ background: a.swatches?.[o] ?? '#ddd' }} /> : o.replace(/(\d)\s*x\s*(\d)/gi, '$1×$2')}
                      {a.kind === 'swatch' ? <span className="ip-sr">{o}</span> : null}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {fkKey ? (
              <p className="u-p-100">{FK_SIZES[fkKey].tiers.length > 1 ? `${kr(FK_SIZES[fkKey].tiers[0][1])} stk., ${kr(FK_SIZES[fkKey].tiers[1][1])} frá ${FK_SIZES[fkKey].tiers[0][0] + 1} stk.` : `${kr(FK_SIZES[fkKey].tiers[0][1])} stk.`}{FK_SIZES[fkKey].min ? ` Lágmark ${kr(FK_SIZES[fkKey].min ?? 0)}.` : ''}</p>
            ) : null}

            {maxPics > 0 ? (
              <div className="ip-upload">
                <span className="u-cta">{maxPics > 1 ? 'Myndirnar þínar' : 'Myndin þín'}{fixedCount ? <span style={{ fontFamily: 'var(--serif)', fontWeight: 400, textTransform: 'none', marginLeft: 8, fontSize: 13 }}>{pics.length} af {fixedCount}</span> : fk && pics.length ? <span style={{ fontFamily: 'var(--serif)', fontWeight: 400, textTransform: 'none', marginLeft: 8, fontSize: 13 }}>{pics.length} {pics.length === 1 ? 'mynd' : 'myndir'}</span> : null}</span>
                {pics.length ? (
                  <ul className="ip-pics">
                    {pics.map((pc, i) => <li key={pc.url}><img src={pc.url} alt="" /><button type="button" aria-label="Fjarlægja mynd" onClick={() => setPics((v) => v.filter((_, j) => j !== i))}>×</button></li>)}
                  </ul>
                ) : null}
                <button type="button" className={`ip-drop${err && !pics.length ? ' err' : ''}`} onClick={() => input.current?.click()} disabled={maxPics > 1 && pics.length >= maxPics}>
                  + {pics.length ? (maxPics > 1 ? 'Bæta við myndum' : 'Skipta um mynd') : maxPics > 1 ? 'Velja myndir' : 'Velja mynd'}
                </button>
                <input ref={input} type="file" accept="image/*" multiple={maxPics > 1} hidden onChange={(e) => { if (maxPics === 1) setPics([]); onPick(e) }} />
              </div>
            ) : null}

            {(pz?.texts ?? []).map((t, i) => (
              <label className="ip-field" key={t.label}>
                <span className="u-cta">{t.label}<span style={{ fontFamily: 'var(--serif)', fontWeight: 400, textTransform: 'none', marginLeft: 8, fontSize: 13, color: 'rgba(0,0,0,.55)' }}>{t.required ? 'Nauðsynlegt' : pz?.require === 'either' ? 'Mynd, texti eða hvort tveggja' : 'Valfrjálst'}</span></span>
                <textarea value={text[i] ?? ''} placeholder={t.hint} maxLength={t.max || 500} onChange={(e) => setText((v) => v.map((x, j) => (j === i ? e.target.value : x)))} />
              </label>
            ))}

            {err ? <p className="ip-err" role="alert">{err}</p> : null}
            <button ref={buyRef} type="button" className="c-button -bg -wide" style={{ minHeight: 44 }} onClick={add}><span>Setja í körfu • {kr(unit)}</span></button>
            <p className="ip-stock">Tilbúið á 5–7 virkum dögum · Sótt eða sent</p>
            <div className="ip-rows">
              <details><summary className="u-cta">Afhending</summary><p>Það tekur venjulega 5-7 virka daga að fá vöruna. Þú sækir í Háholt 14, Mosfellsbæ, eða færð sent með Póstinum. Mælum með að panta gjafir tímanlega fyrir jól.</p></details>
              <details><summary className="u-cta">Myndin og hönnunin</summary><p>Myndin og textinn fylgja pöntuninni. Eftir pöntun færð þú tölvupóst frá okkur varðandi hönnunina á vörunni þinni.</p></details>
              <details><summary className="u-cta">Spurningar</summary><p>Hringdu í <a href={`tel:${BIZ.phone_href}`}>{BIZ.phone}</a> eða sendu á <a href={`mailto:${BIZ.email}`}>{BIZ.email}</a>.</p></details>
            </div>
          </div>
        </div>
      </div>
      {related.length ? (
        <section className="ip-related" aria-labelledby="rel-t">
          <h2 className="ip-heading" id="rel-t">Þér gæti líka líkað</h2>
          <div className="c-grid">{related.map((r) => <Card key={r.slug} p={r} />)}</div>
        </section>
      ) : null}
      <div className={`ip-sticky${sticky ? ' on' : ''}`} aria-hidden={!sticky}>
        <span className="u-price">{kr(unit)}</span>
        <button type="button" className="c-button -bg" tabIndex={sticky ? 0 : -1} onClick={() => { buyRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }) }}><span>Setja í körfu</span></button>
      </div>
      <Assure />
    </main>
  )
}

/* ------------------------------------------------------------------ about */
function About() {
  const { hash } = useLocation()
  useEffect(() => { if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' }) }, [hash])
  return (
    <main id="main">
      <header className="ip-coll_head"><h1>Um okkur</h1></header>
      <div className="ip-about">
        <div className="ip-about_text">
          {ABOUT.map((t) => <p key={t} className="rv">{t}</p>)}
          <h2 id="afhending">Afhending</h2>
          <p>Um leið og gengið er frá pöntun og hún greidd fer ferlið í gang. Það tekur venjulega 5-7 virka daga að fá vöruna senda en það fer þó allt eftir hversu mikið er að gera hverju sinni. Mælum við með að þegar um gjafir sé að ræða að panta tímanlega.</p>
          <h2 id="skilmalar">Skilmálar</h2>
          <p>Verð í netversluninni er með VSK og reikningar eru gefnir út með VSK. Seljandi heitir kaupanda fullum trúnaði um allar þær upplýsingar sem kaupandi gefur upp í tengslum við viðskiptin. Um skilmála þessa gilda ákvæði laga um húsgöngu- og fjarsölu nr. 96/1992 og laga um neytendakaup nr. 48/2003.</p>
        </div>
        <aside id="samband">
          <p className="u-cta" style={{ marginBottom: 12 }}>Verslun og verkstæði</p>
          <ul className="ip-spec">
            <li><span>Heimilisfang</span><span>{BIZ.street_note}, {BIZ.postcode} {BIZ.city}</span></li>
            <li><span>Virka daga</span><span>12–17</span></li>
            <li><span>Laugardaga</span><span>12–15</span></li>
            <li><span>Sími</span><span><a href={`tel:${BIZ.phone_href}`}>{BIZ.phone}</a></span></li>
            <li><span>Netfang</span><span><a href={`mailto:${BIZ.email}`}>{BIZ.email}</a></span></li>
          </ul>
          <p style={{ marginTop: 20 }}><a className="c-button -line" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Bjarkarholt 2, 270 Mosfellsbær')}`} target="_blank" rel="noopener noreferrer"><span>Opna í korti</span></a></p>
        </aside>
      </div>
      <Assure />
    </main>
  )
}

/* ------------------------------------------------------------------ router */
export default function InstaprentPage() {
  const { pathname } = useLocation()
  const rest = pathname.replace(/\/+$/, '').slice(ROOT.length).split('/').filter(Boolean)
  useSmooth()
  useReveals(pathname)
  useEffect(() => { setThemeColor('#ffffff'); document.title = 'Instaprent | Persónuleg gjöf sem gleður' }, [])
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  let body = <Home />
  let hero = true
  if (rest[0] === 'verslun') { body = <Collection cat={null} />; hero = false }
  else if (rest[0] === 'flokkur' && rest[1]) { body = <Collection key={rest[1]} cat={rest[1]} />; hero = false }
  else if (rest[0] === 'vara' && rest[1]) {
    const p = PRODUCTS.find((x) => x.slug === rest[1])
    body = p ? <ProductPage key={p.slug} p={p} /> : <Collection cat={null} />; hero = false
  } else if (rest[0] === 'um-okkur') { body = <About />; hero = false }
  return (
    <Shell hero={hero}>
      <style>{CSS + PAGE_CSS}</style>
      <PreviewChrome company={company} />
      <Header hero={hero} />
      {body}
      <Footer />
      <PreviewFooter company={company} verifiedContent />
      <link rel="preload" as="image" href={`${B}instaprent/logo-word.png`} />
    </Shell>
  )
}
