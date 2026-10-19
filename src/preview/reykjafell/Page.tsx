import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  ArrowButton, Btn, C, Chapter, CSS, Cursor, Header, Label, LineField, Reveal, StickyBar,
  Intro, Words, ask, reduced, step, useGoto, useInview, useRouteScroll, useScrollFx,
} from './ui'
import {
  CONTACT, JSON_LD, KLASAR, PHOTO, PHOTO_CREDIT, STADREYNDIR, TEXTI, VERK_GRID, VIDURKENNINGAR, folkmynd, starfsmadur, type Photo,
} from './data'
import { BriefProvider, Catalog, Efnislisti, RequestForm, TOOLS_CSS, Thjonusta, Vidburdir } from './Tools'
import { ASSIST_CSS, Assistant } from './Assistant'

const company = getPreviewCompany('reykjafell')

/* Blocks that only the home page uses: the Ægir page sheet, renamed, plus the
   Reykjafell additions at the end. Everything shared lives in ui.tsx. */
const PAGE_CSS = `
.rfl-hero{position:relative;min-height:100svh;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;color:#fff}
.rfl-hero .bg{position:absolute;inset:-10% 0 0;height:120%}
.rfl-hero .bg img{filter:saturate(.95)}
.rfl-hero .veil{position:absolute;inset:0;background:linear-gradient(to top,rgba(7,43,63,.9),rgba(7,43,63,.6) 45%,rgba(7,43,63,.26) 75%,rgba(7,43,63,.42));z-index:1}
/* a second, shorter scrim under the type block: white display copy has to clear AA
   over the brightest pixels of the photograph, not just its average */
.rfl-hero .veil2{position:absolute;inset:auto 0 0 0;height:72%;z-index:1;
  background:linear-gradient(to top,rgba(5,30,45,.94) 12%,rgba(5,30,45,.74) 46%,rgba(5,30,45,0))}
.rfl-hero .top{position:relative;z-index:2;padding:0 var(--gut) calc(var(--band) / 2)}
.rfl-hero h1{max-width:15ch;margin-top:.5em}
.rfl-hero .base{position:relative;z-index:2;padding:calc(var(--band) / 2) var(--gut) calc(var(--band) / 1.6);
  border-top:1px solid rgba(255,255,255,.25);display:grid;grid-template-columns:1.1fr 1.4fr auto;gap:var(--col);align-items:start}
@media (max-width:900px){.rfl-hero .base{grid-template-columns:1fr;gap:1.4rem}.rfl-hero h1{max-width:none}}
/* on a phone the photograph's own sign sat behind the label and headline; a taller
   frame pulls the sign up into the clear part of the picture */
@media (max-width:760px){.rfl-hero .bg{inset:-36% 0 auto;height:152%}}

.rfl-about{position:relative}
.rfl-about .top,.rfl-head2 .top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col);position:relative;z-index:1}
.rfl-about .btm{display:grid;grid-template-columns:1fr 1.4fr 1fr;gap:var(--col);margin-top:calc(var(--band) / 1.4);align-items:start;position:relative;z-index:1}
.rfl-about .btm .rfl-media{aspect-ratio:4 / 5}
.rfl-about .btm p+p{margin-top:1em}
@media (max-width:900px){.rfl-about .top,.rfl-head2 .top{grid-template-columns:1fr;gap:1.2rem}
  .rfl-about .btm{grid-template-columns:1fr;gap:1.6rem;margin-top:2.4rem}.rfl-about .btm .rfl-media{aspect-ratio:4 / 3}}

.rfl-serv .top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col)}
.rfl-ways{list-style:none;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--col);margin-top:calc(var(--band) / 1.6)}
.rfl-ways li{display:flex;flex-direction:column}
.rfl-ways a{display:flex;flex-direction:column;height:100%;color:inherit}
.rfl-ways .rfl-media{aspect-ratio:4 / 3}
.rfl-ways .n{font-size:var(--t-tag);opacity:.5;font-variant-numeric:tabular-nums;margin-top:1em}
.rfl-ways h3{margin-top:.25em}
.rfl-ways p{opacity:.74;margin-top:.5em;max-width:34ch}
.rfl-ways .go{margin-top:auto;padding-top:1.2em;font-size:var(--t-label);font-weight:600;text-transform:uppercase;letter-spacing:.06em;display:flex;align-items:center;gap:.6em;color:${C.blue}}
@media (max-width:1080px){.rfl-ways{grid-template-columns:repeat(2,minmax(0,1fr));gap:2.4rem var(--col)}}
@media (max-width:900px){.rfl-serv .top{grid-template-columns:1fr;gap:1rem}}
@media (max-width:560px){.rfl-ways{grid-template-columns:1fr}.rfl-ways .rfl-media{aspect-ratio:3 / 2}}

.rfl-verk .intro{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr) minmax(0,1.3fr);gap:var(--col);margin-bottom:calc(var(--band) / 1.5)}
@media (max-width:900px){.rfl-verk .intro{grid-template-columns:1fr;gap:1rem}}
.rfl-grid{font-size:0}
.rfl-card{display:inline-block;vertical-align:top;width:calc(33.3333% - var(--col));margin:0 calc(var(--col) / 2) calc(var(--band) / 1.6);font-size:var(--t-body);color:inherit}
/* the reference's full rhythm on seven jobs: a wide opener, a pair of portraits
   with a deliberate gap, then two pairs of half-width landscapes */
.rfl-card:nth-child(1){width:calc(66.6666% - var(--col))}
.rfl-card:nth-child(1) .rfl-media{aspect-ratio:3 / 2}
.rfl-card:nth-child(2),.rfl-card:nth-child(3){width:calc(33.3333% - var(--col))}
.rfl-card:nth-child(2) .rfl-media,.rfl-card:nth-child(3) .rfl-media{aspect-ratio:3 / 4}
.rfl-card:nth-child(3){margin-right:calc(33.3333% + var(--col) / 2)}
.rfl-card:nth-child(n+4){width:calc(50% - var(--col))}
.rfl-card:nth-child(n+4) .rfl-media{aspect-ratio:3 / 2}
.rfl-card .rfl-media{aspect-ratio:1 / 1}
.rfl-card .meta{display:flex;justify-content:space-between;gap:.6em;margin-top:.9em}
.rfl-card .meta .tags{display:flex;gap:.4em;flex-wrap:wrap}
.rfl-card h3{margin-top:.45em;padding-right:1.2em}
.rfl-media .inner:after{content:'';position:absolute;inset:0;background:${C.ink};opacity:.12;transition:opacity .3s;z-index:1}
@media (max-width:1080px){.rfl-card:nth-child(1){width:calc(100% - var(--col))}
  .rfl-card:nth-child(3){margin-right:calc(var(--col) / 2)}}
@media (max-width:760px){.rfl-card,.rfl-card:nth-child(n){width:100%;margin:0 0 2.6rem}
  .rfl-card .rfl-media,.rfl-card:nth-child(n) .rfl-media{aspect-ratio:4 / 3}}

.rfl-divider{height:1px;background:${C.hairline}}
.rfl-banner .cols{display:grid;grid-template-columns:1.1fr 1.2fr 1.4fr auto;gap:var(--col);align-items:center}
.rfl-banner .rfl-media{aspect-ratio:4 / 3}
.rfl-banner .onnur a{text-decoration:underline;text-decoration-color:${C.hairline};text-underline-offset:.2em}
.rfl-banner .onnur a:hover{text-decoration-color:currentColor}
@media (max-width:900px){.rfl-banner .cols{grid-template-columns:1fr;gap:1.4rem}}

.rfl-quote{position:relative;min-height:78vh;display:flex;align-items:center;overflow:hidden;color:#fff}
.rfl-quote .bg{position:absolute;inset:-8% 0;height:116%}
.rfl-quote .veil{position:absolute;inset:0;background:rgba(7,43,63,.62);z-index:1}
.rfl-quote .card{position:relative;z-index:2;background:rgba(0,120,173,.93);border-radius:var(--rad);padding:calc(var(--band) / 2);
  max-width:64ch;overflow:hidden}
.rfl-quote .qmark{font-size:var(--t-num);line-height:.7;opacity:.5;display:block}
.rfl-quote blockquote{margin-top:.6em;min-height:5.4em}
.rfl-quote .row{display:flex;justify-content:space-between;align-items:flex-end;gap:1rem;margin-top:1.6em}
.rfl-quote .count{font-size:var(--t-tag);letter-spacing:.08em;opacity:.8;font-variant-numeric:tabular-nums}
.rfl-quote .nav{display:flex;gap:.6em;color:#fff}
.rfl-quote .rfl-dot circle{stroke:#fff}
.rfl-quote .rfl-arrowbtn{border-color:rgba(255,255,255,.6)}
/* On a phone the card must fit between the floating header and the fold, or
   the first lines of the goal sit behind the header (caught on the iOS
   simulator). Smaller display size, no reserved height, tighter padding. */
@media (max-width:760px){.rfl-quote{min-height:0;padding:var(--band) 0}
  .rfl-quote .card{padding:2rem 1.4rem 1.6rem}
  .rfl-quote blockquote{min-height:0;font-size:var(--t-smaller);line-height:1.3}
  .rfl-quote .qmark{font-size:2.4rem}
  .rfl-quote .row{margin-top:1.2em}}

/* section head shared by the four service chapters */
.rfl-head2 .top .body{max-width:62ch}
.rfl-head2 .top .body p{margin-top:1.1em}
.rfl-head2{margin-bottom:calc(var(--band) / 1.4)}

/* tent hire: the two products, side by side */
.rfl-prod{display:grid;grid-template-columns:1fr 1fr;gap:calc(var(--col) * 2);margin-bottom:calc(var(--band) / 1.2)}
.rfl-prod article .rfl-media{aspect-ratio:3 / 2}
.rfl-prod h3{margin-top:.9em}
.rfl-prod .lead{margin-top:.6em;max-width:52ch}
.rfl-prod ul.facts{list-style:none;margin-top:1em}
.rfl-prod ul.facts li{border-top:1px solid ${C.hairline};padding:.7em 0;max-width:56ch}
.rfl-table{width:100%;border-collapse:collapse;margin-top:1.1rem;font-size:var(--t-body);font-variant-numeric:tabular-nums}
.rfl-table caption{position:absolute;left:-9999px}
.rfl-table th{font-size:var(--t-tag);font-weight:600;text-transform:uppercase;letter-spacing:.06em;text-align:left;padding:.6em .5em .6em 0;opacity:.7;border-bottom:1px solid ${C.ink}}
.rfl-table td{padding:.7em .5em .7em 0;border-bottom:1px solid ${C.hairline};vertical-align:baseline}
.rfl-table td:last-child,.rfl-table th:last-child{text-align:right;padding-right:0;white-space:nowrap}
@media (max-width:900px){.rfl-prod{grid-template-columns:1fr;gap:2.6rem}}
@media (max-width:420px){.rfl-table{font-size:15px}.rfl-table th{font-size:11px;letter-spacing:.03em}}

.rfl-strip{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--col);margin-top:calc(var(--band) / 1.2)}
.rfl-strip figure{margin:0}
.rfl-strip .rfl-media{aspect-ratio:4 / 3}
.rfl-strip .rfl-media.tall{aspect-ratio:3 / 4}
.rfl-strip figcaption.t{margin-top:.8em;max-width:36ch;font-size:var(--t-body);line-height:1.5}
.rfl-strip figcaption.t b{display:block;font-weight:600}
.rfl-strip.four{grid-template-columns:repeat(4,minmax(0,1fr))}
@media (max-width:900px){.rfl-strip,.rfl-strip.four{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:560px){.rfl-strip{grid-template-columns:1fr;gap:1.4rem}.rfl-strip.four{grid-template-columns:repeat(2,minmax(0,1fr));gap:.7rem}
  .rfl-strip.four .rfl-media,.rfl-strip.four .rfl-media.tall{aspect-ratio:1 / 1}}
.rfl-rules{margin-top:calc(var(--band) / 1.4);border-top:1px solid ${C.hairline}}
.rfl-rules summary{list-style:none;cursor:pointer;padding:1.1em 0;font-size:var(--t-lead);font-weight:600;display:flex;justify-content:space-between;gap:1rem;align-items:center;min-height:44px}
.rfl-rules summary::-webkit-details-marker{display:none}
.rfl-rules summary:after{content:'+';font-size:1.4em;line-height:1;transition:transform .3s}
.rfl-rules[open] summary:after{transform:rotate(45deg)}
.rfl-rules ul{list-style:none;padding-bottom:1.4rem;display:grid;gap:.7rem;max-width:70ch}
.rfl-rules li{padding-left:1.2em;position:relative;line-height:1.5}
.rfl-rules li:before{content:'';position:absolute;left:0;top:.7em;width:.5em;height:1px;background:currentColor;opacity:.6}
.rfl-rules summary:focus-visible{outline:2px solid ${C.blue};outline-offset:2px}

/* awnings */
.rfl-awn{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:calc(var(--col) * 2);margin-top:calc(var(--band) / 1.2);align-items:start}
.rfl-awn .rfl-media{aspect-ratio:3 / 2}
.rfl-awn .rfl-media.fan{aspect-ratio:4 / 3;margin-top:var(--col)}
@media (max-width:900px){.rfl-awn{grid-template-columns:1fr;gap:2rem}}

/* pools: dark band */
.rfl-pool{position:relative}
.rfl-pool .top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col);margin-bottom:calc(var(--band) / 1.4);position:relative;z-index:1}
.rfl-pool .body{max-width:62ch}
.rfl-pool .body p{margin-top:1.1em;opacity:.86}
.rfl-pool .wrap-ba{position:relative;z-index:1}
@media (max-width:900px){.rfl-pool .top{grid-template-columns:1fr;gap:1.2rem}}

/* workshop */
.rfl-saum-grid{list-style:none;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:calc(var(--col) * 1.4) var(--col)}
.rfl-saum-grid .rfl-media{aspect-ratio:4 / 3}
.rfl-saum-grid h3{margin-top:.8em}
.rfl-saum-grid p{opacity:.74;margin-top:.45em;max-width:34ch;font-size:var(--t-body)}
@media (max-width:1080px){.rfl-saum-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:560px){.rfl-saum-grid{grid-template-columns:1fr;gap:1.8rem}}
.rfl-saum-2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:calc(var(--col) * 2);margin-top:calc(var(--band) / 1.2);align-items:start}
@media (max-width:900px){.rfl-saum-2{grid-template-columns:1fr;gap:2.4rem}}
.rfl-bidskyli{display:grid;gap:1rem}
.rfl-bidskyli .rfl-media{aspect-ratio:3 / 2}
.rfl-bidskyli ul{list-style:none;display:flex;flex-wrap:wrap;gap:.4rem}
.rfl-verd{list-style:none;margin-top:1.1rem}
.rfl-verd li{display:flex;justify-content:space-between;gap:1.2rem;border-top:1px solid ${C.hairline};padding:.8em 0;font-variant-numeric:tabular-nums}
.rfl-verd li:last-child{border-bottom:1px solid ${C.hairline}}
.rfl-verd li span:last-child{white-space:nowrap;text-align:right}
@media (max-width:480px){.rfl-verd li{flex-direction:column;gap:.15em}.rfl-verd li span:last-child{text-align:left}}

/* history */
.rfl-saga .cols{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:calc(var(--col) * 2);align-items:start;margin-top:calc(var(--band) / 1.4)}
.rfl-time{list-style:none}
.rfl-time li{display:grid;grid-template-columns:5.2em minmax(0,1fr);gap:var(--col);border-top:1px solid ${C.hairline};padding:1em 0 1.1em}
.rfl-time li:last-child{border-bottom:1px solid ${C.hairline}}
.rfl-time .ar{font-variant-numeric:tabular-nums;color:${C.blue};font-weight:600}
.rfl-saga .pics{display:grid;gap:var(--col)}
.rfl-saga .pics .rfl-media{aspect-ratio:4 / 3}
.rfl-saga .fleira{margin-top:calc(var(--band) / 1.6);display:grid;grid-template-columns:1fr 1fr;gap:calc(var(--col) * 2)}
.rfl-saga .fleira p{max-width:54ch}
@media (max-width:900px){.rfl-saga .cols,.rfl-saga .fleira{grid-template-columns:1fr;gap:2rem}}

/* contact */
.rfl-c2a{position:relative;overflow:hidden;padding-top:2.4rem;margin-top:-2.4rem}
.rfl-c2a .head{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col);margin-bottom:calc(var(--band) / 1.4);position:relative;z-index:1}
.rfl-c2a .head p.l{max-width:56ch;margin-top:1.2em;opacity:.85}
.rfl-c2a .facts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--col);margin-top:calc(var(--band) / 1.2);padding-top:calc(var(--band) / 2);border-top:1px solid rgba(255,255,255,.25);position:relative;z-index:1}
.rfl-c2a .facts h3{font-size:var(--t-label);text-transform:uppercase;letter-spacing:.06em;font-weight:600;opacity:.6;margin-bottom:.8em}
.rfl-c2a .facts p,.rfl-c2a .facts a{font-size:var(--t-lead);line-height:1.5}
.rfl-c2a .facts a{text-decoration:underline;text-decoration-color:rgba(255,255,255,.4);text-underline-offset:.2em}
.rfl-c2a .reqwrap{position:relative;z-index:1}
@media (max-width:900px){.rfl-c2a .head{grid-template-columns:1fr;gap:1rem}.rfl-c2a .facts{grid-template-columns:repeat(2,minmax(0,1fr));gap:2rem 1rem}}
@media (max-width:480px){.rfl-c2a .facts{grid-template-columns:1fr}}

.rfl-back{display:inline-flex;align-items:center;gap:.5em;font-size:var(--t-label);text-transform:uppercase;letter-spacing:.06em;font-weight:600}
`

const RFL_CSS = `
/* hero: one question field under the headline, straight into the assistant */
/* the Ægir base row sized its third column to one button (auto); a question
   field needs a real column, or it collapses to the width of its button */
@media (min-width:901px){.rfl-hero .base{grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr) minmax(340px,1fr)}}
.rfl-heroask{display:flex;align-items:center;gap:.4rem;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.45);border-radius:var(--rad);
  padding:.35rem .35rem .35rem 1rem;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);width:100%}
.rfl-heroask input{flex:1;min-width:0;background:transparent;border:0;color:#fff;font:inherit;font-size:max(16px,var(--t-body));padding:.6em 0}
.rfl-heroask input::placeholder{color:rgba(255,255,255,.72)}
.rfl-heroask input:focus{outline:none}
.rfl-heroask:focus-within{outline:2px solid #fff;outline-offset:2px}
.rfl-heroask button{flex:none;height:44px;padding:0 1.1em;border:0;border-radius:var(--rad);background:#fff;color:${C.blueDeep};font:inherit;font-size:var(--t-label);
  font-weight:600;text-transform:uppercase;letter-spacing:.06em;cursor:pointer}
.rfl-hero .chipsrow{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.8rem}
.rfl-hero .chipsrow button{font:inherit;font-size:var(--t-tag);color:#fff;background:transparent;border:1px solid rgba(255,255,255,.35);border-radius:999px;padding:.45em .85em;cursor:pointer;min-height:44px}

/* Reserve the floating chrome's space even when the hero is taller than a
   short phone viewport. The chips must remain clear of the contact dock. */
@media (max-width:760px){
  .rfl-hero{padding-top:calc(60px + 10.648vw + env(safe-area-inset-top))}
  .rfl-hero .base{padding-bottom:max(calc(var(--band) / 1.6),calc(91px + env(safe-area-inset-bottom)))}
  .rfl-folk .c a,.rfl-c2a .facts a{display:inline-flex;align-items:center;min-height:44px}
}

/* about: the stats column */
.rfl-stats{list-style:none;display:grid;gap:0}
.rfl-stats li{display:grid;grid-template-columns:minmax(4.2ch,auto) minmax(0,1fr);gap:1rem;align-items:baseline;padding:.9em 0;border-top:1px solid ${C.hairline}}
.rfl-stats li:last-child{border-bottom:1px solid ${C.hairline}}
.rfl-stats .rfl-num{color:${C.blue}}
.rfl-stats span:last-child{line-height:1.4}

/* clusters: five ways, with the person responsible on each */
.rfl-ways.five{grid-template-columns:repeat(5,minmax(0,1fr))}
@media (max-width:1280px){.rfl-ways.five{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:760px){.rfl-ways.five{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:560px){.rfl-ways.five{grid-template-columns:1fr}}
.rfl-ways .who{display:flex;align-items:center;gap:.7em;margin-top:1em;font-size:var(--t-tag);line-height:1.35}
.rfl-ways .who img{width:36px;height:36px;border-radius:50%;object-fit:cover;object-position:50% 20%;flex:none}
.rfl-ways .who b{display:block;font-weight:600;font-size:var(--t-body)}
.rfl-ways .marks{display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.8em}

/* people */
.rfl-folk{list-style:none;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:calc(var(--col) * 1.6) var(--col)}
@media (max-width:1080px){.rfl-folk{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:760px){.rfl-folk{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.8rem .9rem}}
.rfl-folk .ph{aspect-ratio:600 / 714;border-radius:var(--rad);overflow:hidden;background:#dde1e3}
.rfl-folk .ph img{object-fit:cover;filter:grayscale(1) contrast(1.02);transition:filter .5s}
.rfl-folk h3{font-size:var(--t-lead);font-weight:600;margin-top:.8em;line-height:1.25}
.rfl-folk .role{font-size:var(--t-tag);opacity:.7;margin-top:.25em;line-height:1.4;min-height:2.8em}
.rfl-folk .c{display:grid;gap:.1em;margin-top:.6em;font-size:var(--t-tag)}
.rfl-folk .c a{text-decoration:underline;text-decoration-color:${C.hairline};text-underline-offset:.2em;overflow-wrap:anywhere;padding:.2em 0}
.rfl-folk .loc{font-family:'RflMono',ui-monospace,monospace;font-size:11px;opacity:.6;margin-top:.9em}
.rfl-self{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:calc(var(--col) * 2);margin-top:calc(var(--band) / 1.2);align-items:center}
.rfl-self .rfl-media{aspect-ratio:3 / 2}
@media (max-width:900px){.rfl-self{grid-template-columns:1fr;gap:1.6rem}}
@media (hover:hover) and (pointer:fine){.rfl-folk li:hover .ph img{filter:none}}
`

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
  const [w, h] = photo.ratio.split('/').map((n) => Number(n.trim()))
  return (
    <figure className={`rfl-media ${className}`} style={style}>
      <div className="inner" data-speed={speed}>
        <img
          src={photo.src}
          srcSet={photo.srcSet}
          sizes={sizes}
          alt={photo.alt}
          width={w}
          height={h}
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
  const [q, setQ] = useState('')
  const [w, h] = PHOTO.hq.ratio.split('/').map((n) => Number(n.trim()))
  return (
    <div className="rfl-hero" ref={ref}>
      <div className="bg" data-speed={-20} data-anchor="top">
        {/* @ts-expect-error fetchpriority is valid HTML, React types lag */}
        <img src={PHOTO.hq.src} srcSet={PHOTO.hq.srcSet} sizes="100vw" alt={PHOTO.hq.alt} width={w} height={h} fetchpriority="high" />
      </div>
      <div className="veil" />
      <div className="veil2" />
      <div className="top">
        <Label>Reykjafell ehf.</Label>
        <Words tag="h1" className="rfl-big" text={TEXTI.tagline} hold={0.35} />
      </div>
      <div className="base">
        <div className="rfl-rise" style={step(1)}>
          <Label>{TEXTI.heroLabel}</Label>
        </div>
        <p className="rfl-rise rfl-lead" style={step(2)}>{TEXTI.inngangur}</p>
        <div className="rfl-rise" style={step(3)}>
          <form className="rfl-heroask" role="search" onSubmit={(e) => { e.preventDefault(); ask(q); setQ('') }}>
            <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Vörunúmer eða spurning…" autoComplete="off" aria-label="Spyrja Reykjafell" enterKeyHint="send" />
            <button type="submit">Spyrja</button>
          </form>
          <div className="chipsrow">
            {['Er UT9260M til?', 'Næsta námskeið'].map((t) => <button key={t} type="button" onClick={(e) => ask(t, e.detail === 0)}>{t}</button>)}
          </div>
        </div>
      </div>
    </div>
  )
}

function QuoteSlider() {
  const [i, setI] = useState(0)
  const n = VIDURKENNINGAR.length
  const go = (d: number) => setI((p) => (p + d + n) % n)
  const [held, setHeld] = useState(false)
  useEffect(() => {
    if (reduced() || held) return
    const t = window.setInterval(() => setI((p) => (p + 1) % n), 9000)
    return () => clearInterval(t)
  }, [n, held])
  const [w, h] = PHOTO.safnahus.ratio.split('/').map((x) => Number(x.trim()))
  return (
    <section
      className="rfl-quote"
      id="vidurkenningar"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      <div className="bg" data-speed={-1}>
        <img src={PHOTO.safnahus.src} srcSet={PHOTO.safnahus.srcSet} sizes="100vw" alt="" width={w} height={h} loading="lazy" />
      </div>
      <div className="veil" />
      <div className="rfl-wrap">
        <Reveal className="card">
          <LineField top="auto" height={220} seed={4} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Label>Viðurkenningar Reykjafells</Label>
            <span className="qmark" aria-hidden="true">&ldquo;</span>
            <blockquote key={i} className="rfl-normal" aria-live="polite">
              <Words tag="span" text={VIDURKENNINGAR[i]} hold={0.05} />
            </blockquote>
            <div className="row">
              <p className="count">
                {String(i + 1).padStart(2, '0')} <span aria-hidden="true">|</span> {String(n).padStart(2, '0')}
              </p>
              <div className="nav">
                <ArrowButton dir="left" label="Fyrri viðurkenning" onClick={() => go(-1)} />
                <ArrowButton dir="right" label="Næsta viðurkenning" onClick={() => go(1)} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function SectionHead({ n, label, h2, children }: { n: string; label: string; h2: string; children?: ReactNode }) {
  return (
    <Reveal className="rfl-head2">
      <div className="top">
        <Chapter n={n} />
        <div className="body">
          <Label>{label}</Label>
          <Words tag="h2" className="rfl-normal" text={h2} />
          {children}
        </div>
      </div>
    </Reveal>
  )
}

function Klasar() {
  const goto = useGoto()
  return (
    <ul className="rfl-ways five">
      {KLASAR.map((k, i) => {
        const p = starfsmadur(k.abyrgd)
        return (
          <Reveal as="li" key={k.id}>
            <a href="#vorur" data-cursor="card" onClick={(e) => { e.preventDefault(); goto('#vorur') }}>
              <Media photo={k.photo} className="rfl-rise" sizes="(max-width:560px) 100vw, (max-width:1280px) 30vw, 18vw" />
              <span className="n rfl-rise" style={step(1)}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className="rfl-smallt rfl-rise" style={step(2)}>{k.titill}</h3>
              <p className="rfl-rise" style={step(3)}>{k.texti}</p>
              {p ? (
                <span className="who rfl-rise" style={step(4)}>
                  <img src={folkmynd(p.uid)} alt="" width={36} height={36} loading="lazy" />
                  <span><b>{p.name}</b>{p.tel}</span>
                </span>
              ) : null}
            </a>
          </Reveal>
        )
      })}
    </ul>
  )
}

const FOLK = [
  'einar-thor-einarsson', 'kristinn-benediktsson', 'thorvaldur-gudmundsson', 'adalsteinn-richter',
  'jon-thor-vigfusson', 'olafur-helgi-hardarson', 'geir-arnar-geirsson', 'adam-thorsteinsson',
  'ivareidsson', 'asgeir-thordarson', 'adalsteinn-stefansson', 'adalsteinn-e-bergthorsson',
]

function Folkid() {
  return (
    <ul className="rfl-folk">
      {FOLK.map((uid, i) => {
        const p = starfsmadur(uid)
        if (!p) return null
        return (
          <li key={uid} className="rfl-rise" style={step(i % 4)}>
            <div className="ph"><img src={folkmynd(uid)} alt={p.name} width={600} height={714} loading="lazy" /></div>
            <h3>{p.name}</h3>
            <p className="role">{p.role || p.title}</p>
            <p className="c">
              <a href={`tel:+354${p.tel.replace(/\s/g, '')}`}>{p.tel}</a>
              <a href={`mailto:${p.email}`}>{p.email}</a>
            </p>
            <p className="loc">{p.loc === 'AK' ? 'Akureyri' : 'Reykjavík'}</p>
          </li>
        )
      })}
    </ul>
  )
}

function HomeBody() {
  const goto = useGoto()
  return (
    <main id="efni">
      <Hero />

      <div className="rfl-band paper">
        <section className="rfl-about" id="um-okkur">
          <LineField top="6%" height={430} seed={2} />
          <div className="rfl-wrap">
            <Reveal className="top">
              <Chapter n="1.0" />
              <div>
                <Label>Um Reykjafell</Label>
                <Words tag="h2" className="rfl-normal" text={TEXTI.um} />
              </div>
            </Reveal>
            <Reveal className="btm">
              <Media photo={PHOTO.stjorn} sizes="(max-width:900px) 100vw, 26vw" className="rfl-rise" pos="50% 40%" />
              <div className="rfl-rise" style={step(2)}>
                <p>{TEXTI.umMalsgrein}</p>
                <p>{TEXTI.hq}</p>
                <p>{TEXTI.netverslun}</p>
              </div>
              <ul className="rfl-stats rfl-rise" style={step(3)}>
                {STADREYNDIR.map((s) => (
                  <li key={s.t}><span className="rfl-num">{s.n}{s.sup ? <sup>{s.sup}</sup> : null}</span><span>{s.t}</span></li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section className="rfl-serv" id="klasar">
          <div className="rfl-wrap">
            <Reveal className="top">
              <Chapter n="1.1" />
              <div>
                <Label>Klasarnir</Label>
                <Words tag="h2" className="rfl-normal" text={TEXTI.klasarH2} />
                <p className="rfl-rise rfl-lead" style={{ ...step(3), maxWidth: '58ch', marginTop: '1em' }}>{TEXTI.klasarIntro}</p>
              </div>
            </Reveal>
            <Klasar />
          </div>
        </section>
      </div>

      <div className="rfl-band white">
        <section className="rfl-verk" id="verkefni">
          <div className="rfl-wrap">
            <Reveal className="intro">
              <Chapter n="1.2" />
              <div>
                <Label>Verkin</Label>
                <Words tag="h2" className="rfl-normal" text={TEXTI.verkH2} />
              </div>
              <p className="rfl-rise" style={step(2)}>{TEXTI.verkIntro}</p>
            </Reveal>
            <div className="rfl-grid">
              {VERK_GRID.map((v, idx) => (
                <Reveal as="article" key={v.slug} className="rfl-card">
                  <Link to={`/preview/reykjafell/verk/${v.slug}`} data-cursor="card" aria-label={`${v.name}, ${v.flokkur.toLowerCase()}${v.stadur ? `, ${v.stadur}` : ''}`}>
                    <Media
                      photo={v.cover}
                      className="rfl-rise"
                      sizes={idx === 0 ? '(max-width:760px) 100vw, 60vw' : idx < 3 ? '(max-width:760px) 100vw, 30vw' : '(max-width:760px) 100vw, 45vw'}
                    />
                    <div className="meta rfl-rise" style={step(2)}>
                      <span className="tags"><span className="rfl-tag">{v.flokkur}</span><span className="rfl-tag">{v.ar}</span></span>
                      {v.stadur ? <span className="rfl-tag">{v.stadur}</span> : null}
                    </div>
                    <h3 className="rfl-smallt rfl-rise" style={step(4)}>{v.name}</h3>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="rfl-wrap"><div className="rfl-divider" /></div>
        </section>

        <section className="rfl-banner">
          <div className="rfl-wrap">
            <Reveal className="cols">
              <Media photo={PHOTO.afmaeli} className="rfl-rise" sizes="(max-width:900px) 100vw, 24vw" />
              <Words tag="h2" className="rfl-normal" text="Sjötíu ár, nýjar höfuðstöðvar og ný framkvæmdastjórn." />
              <p className="rfl-rise" style={step(2)}>Um 600 gestir fögnuðu 70 ára afmælinu í vöruhúsinu á Blikastaðavegi 22. maí 2026, þar á meðal 35 fulltrúar erlendra birgja. Í september tóku Einar Þór Einarsson og Kristinn Benediktsson við framkvæmdastjórn.</p>
              <div className="rfl-rise" style={step(3)}>
                <Btn href={CONTACT.simiHref} variant="brand">Hringja {CONTACT.simi}</Btn>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      <QuoteSlider />

      <div className="rfl-band white">
        <section id="vorur">
          <div className="rfl-wrap">
            <SectionHead n="1.3" label="Vörurnar" h2={TEXTI.vorurH2}>
              <p className="rfl-rise rfl-lead" style={{ ...step(3), marginTop: '1em' }}>{TEXTI.vorurIntro}</p>
            </SectionHead>
            <Reveal>
              <Catalog />
            </Reveal>
          </div>
        </section>
      </div>

      <div className="rfl-band paper">
        <section id="efnislisti" style={{ position: 'relative' }}>
          <LineField top="0" height={430} seed={3} />
          <div className="rfl-wrap" style={{ position: 'relative', zIndex: 1 }}>
            <SectionHead n="1.4" label="Efnislisti og tilboð" h2={TEXTI.listiH2}>
              <p className="rfl-rise rfl-lead" style={{ ...step(3), marginTop: '1em' }}>{TEXTI.listiIntro}</p>
            </SectionHead>
            <Reveal>
              <Efnislisti />
            </Reveal>
          </div>
        </section>
      </div>

      <div className="rfl-band white" id="kerfin">
        <section id="vidburdir">
          <div className="rfl-wrap">
            <SectionHead n="1.5" label="Viðburðir og námskeið" h2={TEXTI.vidburdirH2}>
              <p className="rfl-rise rfl-lead" style={{ ...step(3), marginTop: '1em' }}>{TEXTI.vidburdirIntro}</p>
            </SectionHead>
            <Reveal className="rfl-strip">
              <figure className="rfl-rise"><Media photo={PHOTO.kuka} sizes="(max-width:560px) 100vw, 30vw" /><figcaption className="t"><b>KUKA</b>Námskeið í forritun og uppsetningu á iðnaðarþjörkum.</figcaption></figure>
              <figure className="rfl-rise" style={step(1)}><Media photo={PHOTO.lb2024} sizes="(max-width:560px) 100vw, 30vw" /><figcaption className="t"><b>Light+Building</b>Reykjafellsdagurinn á opnunardegi sýningarinnar í Frankfurt.</figcaption></figure>
              <figure className="rfl-rise" style={step(2)}><Media photo={PHOTO.maelir} sizes="(max-width:560px) 100vw, 30vw" /><figcaption className="t"><b>Tækniskólinn</b>Úttektarmælir frá Kyoritsu afhentur til kennslu.</figcaption></figure>
            </Reveal>
            <div style={{ marginTop: 'calc(var(--band) / 1.4)' }}>
              <Reveal>
                <Vidburdir />
              </Reveal>
            </div>
          </div>
        </section>
      </div>

      <div className="rfl-band dark">
        <section className="rfl-pool" id="thjonusta">
          <LineField top="0" height={380} seed={6} />
          <div className="rfl-wrap" style={{ position: 'relative', zIndex: 1 }}>
            <Reveal className="top">
              <Chapter n="1.6" />
              <div className="body">
                <Label>Þjónusta og bilanir</Label>
                <Words tag="h2" className="rfl-normal" text={TEXTI.thjonustaH2} />
                <p className="rfl-rise" style={step(3)}>{TEXTI.thjonustaIntro}</p>
              </div>
            </Reveal>
            <Reveal>
              <Thjonusta />
            </Reveal>
          </div>
        </section>
      </div>

      <div className="rfl-band paper">
        <section id="folkid">
          <div className="rfl-wrap">
            <SectionHead n="1.7" label="Fólkið" h2={TEXTI.folkH2}>
              <p className="rfl-rise rfl-lead" style={{ ...step(3), marginTop: '1em' }}>{TEXTI.folkIntro}</p>
            </SectionHead>
            <Reveal>
              <Folkid />
            </Reveal>
            <Reveal className="rfl-self">
              <Media photo={PHOTO.ansellDagar} className="rfl-rise" sizes="(max-width:900px) 100vw, 44vw" />
              <div>
                <Label>Sjálfsafgreiðsla</Label>
                <p className="rfl-rise rfl-lead" style={{ ...step(1), marginTop: '1em', maxWidth: '50ch' }}>{TEXTI.sjalfsafgreidsla}</p>
                <p className="rfl-rise" style={{ ...step(2), marginTop: '1em', maxWidth: '50ch', opacity: 0.8 }}>{TEXTI.fagmadur}</p>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      <div className="rfl-band dark" id="hafa-samband">
        <section className="rfl-c2a">
          <LineField top="auto" height={300} seed={7} />
          <div className="rfl-wrap">
            <Reveal className="head">
              <Chapter n="1.8" />
              <div>
                <Label>Hafa samband</Label>
                <Words tag="h2" className="rfl-normal" text={TEXTI.metnadur} />
                <p className="l rfl-rise" style={step(3)}>{TEXTI.tilbod}</p>
              </div>
            </Reveal>
            <Reveal className="reqwrap">
              <RequestForm />
            </Reveal>
            <Reveal className="facts">
              <div className="rfl-rise">
                <h3>Reykjavík</h3>
                <p>{CONTACT.heimilisfang}<br />{CONTACT.postnumer}<br /><a href={CONTACT.simiHref}>{CONTACT.simi}</a></p>
              </div>
              <div className="rfl-rise" style={step(1)}>
                <h3>Akureyri</h3>
                <p>{CONTACT.ak.heimilisfang}<br />{CONTACT.ak.postnumer}<br /><a href={CONTACT.ak.simiHref}>{CONTACT.ak.simi}</a></p>
              </div>
              <div className="rfl-rise" style={step(2)}>
                <h3>Neyðarsími</h3>
                <p>Reykjavík <a href={CONTACT.neydHref}>{CONTACT.neyd}</a><br />Akureyri <a href={CONTACT.ak.neydHref}>{CONTACT.ak.neyd}</a></p>
              </div>
              <div className="rfl-rise" style={step(3)}>
                <h3>Opnunartími</h3>
                <p>{CONTACT.opidStutt}<br />Netverslunin allan sólarhringinn</p>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      <footer className="rfl-foot">
        <div className="rfl-wrap">
          <div className="cols">
            <div>
              <h3>Reykjafell ehf.</h3>
              <p>Heildverslun<br />kt. {CONTACT.kennitala}<br />Vsknr. {CONTACT.vsk}</p>
            </div>
            <div>
              <h3>Reykjavík</h3>
              <p>{CONTACT.heimilisfang}, {CONTACT.postnumer}<br /><a href={CONTACT.simiHref}>{CONTACT.simi}</a></p>
            </div>
            <div>
              <h3>Akureyri</h3>
              <p>{CONTACT.ak.heimilisfang}, {CONTACT.ak.postnumer}<br /><a href={CONTACT.ak.simiHref}>{CONTACT.ak.simi}</a></p>
            </div>
            <div>
              <h3>Kerfin</h3>
              <ul style={{ listStyle: 'none' }}>
                {[['#vorur', 'Vöruleit'], ['#efnislisti', 'Efnislisti og tilboð'], ['#vidburdir', 'Viðburðir'], ['#thjonusta', 'Þjónusta'], ['#hafa-samband', 'Sækja um aðgang']].map(([h, t]) => (
                  <li key={h + t}><a href={h} onClick={(e) => { e.preventDefault(); goto(h) }}>{t}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rule" />
          <div className="fine">
            <p>{PHOTO_CREDIT}</p>
            <p>&copy; {new Date().getFullYear()} Reykjafell ehf. Allur réttur áskilinn.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default function ReykjafellPage() {
  useScrollFx()
  useRouteScroll()
  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    document.title = 'Reykjafell ehf. | Heildverslun með raf- og lýsingarbúnað frá 1956'
    document.documentElement.lang = 'is'
    const meta = document.querySelector('meta[name="description"]')
    const prevDesc = meta?.getAttribute('content') ?? ''
    meta?.setAttribute('content', 'Reykjafell er heildsala fyrir fagfólk og fyrirtæki í rafiðnaði: lýsing, afldreifing, iðnstýringar, rafbílahleðsla og lagnaefni. Reykjavík og Akureyri, frá 1956.')
    setThemeColor(C.paper)
    return () => {
      document.title = prevTitle
      document.documentElement.lang = prevLang
      meta?.setAttribute('content', prevDesc)
    }
  }, [])

  return (
    <div className="rfl-root">
      <style>{CSS}{PAGE_CSS}{RFL_CSS}{TOOLS_CSS}{ASSIST_CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />
      <Intro />
      <Cursor />
      <Header light />
      <StickyBar />
      <BriefProvider>
        <HomeBody />
        <Assistant />
      </BriefProvider>
      <PreviewFooter company={company} verifiedContent />
    </div>
  )
}
