import { C } from './ui'

/* Home-page blocks of the Ægir build, re-coloured (generated from aegir/Page.tsx, then owned here). */
export const PAGE_CSS_BASE = `
.stg-hero{position:relative;min-height:100svh;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;color:#fff}
.stg-hero .bg{position:absolute;inset:-10% 0 0;height:120%}
.stg-hero .bg img{filter:saturate(.95)}
.stg-hero .veil{position:absolute;inset:0;background:linear-gradient(to top,rgba(26,30,27,.9),rgba(26,30,27,.6) 45%,rgba(26,30,27,.26) 75%,rgba(26,30,27,.42));z-index:1}
/* a second, shorter scrim under the type block: white display copy has to clear AA
   over the brightest pixels of the photograph, not just its average */
.stg-hero .veil2{position:absolute;inset:auto 0 0 0;height:72%;z-index:1;
  background:linear-gradient(to top,rgba(14,17,14,.94) 12%,rgba(14,17,14,.74) 46%,rgba(14,17,14,0))}
.stg-hero .top{position:relative;z-index:2;padding:0 var(--gut) calc(var(--band) / 2)}
.stg-hero h1{max-width:15ch;margin-top:.5em}
.stg-hero .base{position:relative;z-index:2;padding:calc(var(--band) / 2) var(--gut) calc(var(--band) / 1.6);
  border-top:1px solid rgba(255,255,255,.25);display:grid;grid-template-columns:1.1fr 1.4fr auto;gap:var(--col);align-items:start}
@media (max-width:900px){.stg-hero .base{grid-template-columns:1fr;gap:1.4rem}.stg-hero h1{max-width:none}}
/* on a phone the photograph's own sign sat behind the label and headline; a taller
   frame pulls the sign up into the clear part of the picture */
@media (max-width:760px){.stg-hero .bg{inset:-36% 0 auto;height:152%}}

.stg-about{position:relative}
.stg-about .top,.stg-head2 .top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col);position:relative;z-index:1}
.stg-about .btm{display:grid;grid-template-columns:1fr 1.4fr 1fr;gap:var(--col);margin-top:calc(var(--band) / 1.4);align-items:start;position:relative;z-index:1}
.stg-about .btm .stg-media{aspect-ratio:4 / 5}
.stg-about .btm p+p{margin-top:1em}
@media (max-width:900px){.stg-about .top,.stg-head2 .top{grid-template-columns:1fr;gap:1.2rem}
  .stg-about .btm{grid-template-columns:1fr;gap:1.6rem;margin-top:2.4rem}.stg-about .btm .stg-media{aspect-ratio:4 / 3}}

.stg-serv .top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col)}
.stg-ways{list-style:none;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--col);margin-top:calc(var(--band) / 1.6)}
.stg-ways li{display:flex;flex-direction:column}
.stg-ways a{display:flex;flex-direction:column;height:100%;color:inherit}
.stg-ways .stg-media{aspect-ratio:4 / 3}
.stg-ways .n{font-size:var(--t-tag);opacity:.5;font-variant-numeric:tabular-nums;margin-top:1em}
.stg-ways h3{margin-top:.25em}
.stg-ways p{opacity:.74;margin-top:.5em;max-width:34ch}
.stg-ways .go{margin-top:auto;padding-top:1.2em;font-size:var(--t-label);font-weight:600;text-transform:uppercase;letter-spacing:.06em;display:flex;align-items:center;gap:.6em;color:${C.green}}
@media (max-width:1080px){.stg-ways{grid-template-columns:repeat(2,minmax(0,1fr));gap:2.4rem var(--col)}}
@media (max-width:900px){.stg-serv .top{grid-template-columns:1fr;gap:1rem}}
@media (max-width:560px){.stg-ways{grid-template-columns:1fr}.stg-ways .stg-media{aspect-ratio:3 / 2}}

.stg-verk .intro{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr) minmax(0,1.3fr);gap:var(--col);margin-bottom:calc(var(--band) / 1.5)}
@media (max-width:900px){.stg-verk .intro{grid-template-columns:1fr;gap:1rem}}
.stg-grid{font-size:0}
.stg-card{display:inline-block;vertical-align:top;width:calc(33.3333% - var(--col));margin:0 calc(var(--col) / 2) calc(var(--band) / 1.6);font-size:var(--t-body);color:inherit}
/* the reference's full rhythm on seven jobs: a wide opener, a pair of portraits
   with a deliberate gap, then two pairs of half-width landscapes */
.stg-card:nth-child(1){width:calc(66.6666% - var(--col))}
.stg-card:nth-child(1) .stg-media{aspect-ratio:3 / 2}
.stg-card:nth-child(2),.stg-card:nth-child(3){width:calc(33.3333% - var(--col))}
.stg-card:nth-child(2) .stg-media,.stg-card:nth-child(3) .stg-media{aspect-ratio:3 / 4}
.stg-card:nth-child(3){margin-right:calc(33.3333% + var(--col) / 2)}
.stg-card:nth-child(n+4){width:calc(50% - var(--col))}
.stg-card:nth-child(n+4) .stg-media{aspect-ratio:3 / 2}
.stg-card .stg-media{aspect-ratio:1 / 1}
.stg-card .meta{display:flex;justify-content:space-between;gap:.6em;margin-top:.9em}
.stg-card .meta .tags{display:flex;gap:.4em;flex-wrap:wrap}
.stg-card h3{margin-top:.45em;padding-right:1.2em}
.stg-media .inner:after{content:'';position:absolute;inset:0;background:${C.ink};opacity:.12;transition:opacity .3s;z-index:1}
@media (max-width:1080px){.stg-card:nth-child(1){width:calc(100% - var(--col))}
  .stg-card:nth-child(3){margin-right:calc(var(--col) / 2)}}
@media (max-width:760px){.stg-card,.stg-card:nth-child(n){width:100%;margin:0 0 2.6rem}
  .stg-card .stg-media,.stg-card:nth-child(n) .stg-media{aspect-ratio:4 / 3}}

.stg-divider{height:1px;background:${C.hairline}}
.stg-banner .cols{display:grid;grid-template-columns:1.1fr 1.2fr 1.4fr auto;gap:var(--col);align-items:center}
.stg-banner .stg-media{aspect-ratio:4 / 3}
.stg-banner .onnur a{text-decoration:underline;text-decoration-color:${C.hairline};text-underline-offset:.2em}
.stg-banner .onnur a:hover{text-decoration-color:currentColor}
@media (max-width:900px){.stg-banner .cols{grid-template-columns:1fr;gap:1.4rem}}

.stg-quote{position:relative;min-height:78vh;display:flex;align-items:center;overflow:hidden;color:#fff}
.stg-quote .bg{position:absolute;inset:-8% 0;height:116%}
.stg-quote .veil{position:absolute;inset:0;background:rgba(26,30,27,.62);z-index:1}
.stg-quote .card{position:relative;z-index:2;background:rgba(46,125,53,.88);border-radius:var(--rad);padding:calc(var(--band) / 2);
  max-width:64ch;overflow:hidden}
.stg-quote .qmark{font-size:var(--t-num);line-height:.7;opacity:.5;display:block}
.stg-quote blockquote{margin-top:.6em;min-height:5.4em}
.stg-quote .row{display:flex;justify-content:space-between;align-items:flex-end;gap:1rem;margin-top:1.6em}
.stg-quote .count{font-size:var(--t-tag);letter-spacing:.08em;opacity:.8;font-variant-numeric:tabular-nums}
.stg-quote .nav{display:flex;gap:.6em;color:#fff}
.stg-quote .stg-dot circle{stroke:#fff}
.stg-quote .stg-arrowbtn{border-color:rgba(255,255,255,.6)}
/* On a phone the card must fit between the floating header and the fold, or
   the first lines of the goal sit behind the header (caught on the iOS
   simulator). Smaller display size, no reserved height, tighter padding. */
@media (max-width:760px){.stg-quote{min-height:0;padding:var(--band) 0}
  .stg-quote .card{padding:2rem 1.4rem 1.6rem}
  .stg-quote blockquote{min-height:0;font-size:var(--t-smaller);line-height:1.3}
  .stg-quote .qmark{font-size:2.4rem}
  .stg-quote .row{margin-top:1.2em}}

/* section head shared by the four service chapters */
.stg-head2 .top .body{max-width:62ch}
.stg-head2 .top .body p{margin-top:1.1em}
.stg-head2{margin-bottom:calc(var(--band) / 1.4)}

/* tent hire: the two products, side by side */
.stg-prod{display:grid;grid-template-columns:1fr 1fr;gap:calc(var(--col) * 2);margin-bottom:calc(var(--band) / 1.2)}
.stg-prod article .stg-media{aspect-ratio:3 / 2}
.stg-prod h3{margin-top:.9em}
.stg-prod .lead{margin-top:.6em;max-width:52ch}
.stg-prod ul.facts{list-style:none;margin-top:1em}
.stg-prod ul.facts li{border-top:1px solid ${C.hairline};padding:.7em 0;max-width:56ch}
.stg-table{width:100%;border-collapse:collapse;margin-top:1.1rem;font-size:var(--t-body);font-variant-numeric:tabular-nums}
.stg-table caption{position:absolute;left:-9999px}
.stg-table th{font-size:var(--t-tag);font-weight:600;text-transform:uppercase;letter-spacing:.06em;text-align:left;padding:.6em .5em .6em 0;opacity:.7;border-bottom:1px solid ${C.ink}}
.stg-table td{padding:.7em .5em .7em 0;border-bottom:1px solid ${C.hairline};vertical-align:baseline}
.stg-table td:last-child,.stg-table th:last-child{text-align:right;padding-right:0;white-space:nowrap}
@media (max-width:900px){.stg-prod{grid-template-columns:1fr;gap:2.6rem}}
@media (max-width:420px){.stg-table{font-size:15px}.stg-table th{font-size:11px;letter-spacing:.03em}}

.stg-strip{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--col);margin-top:calc(var(--band) / 1.2)}
.stg-strip figure{margin:0}
.stg-strip .stg-media{aspect-ratio:4 / 3}
.stg-strip .stg-media.tall{aspect-ratio:3 / 4}
.stg-strip figcaption.t{margin-top:.8em;max-width:36ch;font-size:var(--t-body);line-height:1.5}
.stg-strip figcaption.t b{display:block;font-weight:600}
.stg-strip.four{grid-template-columns:repeat(4,minmax(0,1fr))}
@media (max-width:900px){.stg-strip,.stg-strip.four{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:560px){.stg-strip{grid-template-columns:1fr;gap:1.4rem}.stg-strip.four{grid-template-columns:repeat(2,minmax(0,1fr));gap:.7rem}
  .stg-strip.four .stg-media,.stg-strip.four .stg-media.tall{aspect-ratio:1 / 1}}
.stg-rules{margin-top:calc(var(--band) / 1.4);border-top:1px solid ${C.hairline}}
.stg-rules summary{list-style:none;cursor:pointer;padding:1.1em 0;font-size:var(--t-lead);font-weight:600;display:flex;justify-content:space-between;gap:1rem;align-items:center;min-height:44px}
.stg-rules summary::-webkit-details-marker{display:none}
.stg-rules summary:after{content:'+';font-size:1.4em;line-height:1;transition:transform .3s}
.stg-rules[open] summary:after{transform:rotate(45deg)}
.stg-rules ul{list-style:none;padding-bottom:1.4rem;display:grid;gap:.7rem;max-width:70ch}
.stg-rules li{padding-left:1.2em;position:relative;line-height:1.5}
.stg-rules li:before{content:'';position:absolute;left:0;top:.7em;width:.5em;height:1px;background:currentColor;opacity:.6}
.stg-rules summary:focus-visible{outline:2px solid ${C.green};outline-offset:2px}

/* awnings */
.stg-awn{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:calc(var(--col) * 2);margin-top:calc(var(--band) / 1.2);align-items:start}
.stg-awn .stg-media{aspect-ratio:3 / 2}
.stg-awn .stg-media.fan{aspect-ratio:4 / 3;margin-top:var(--col)}
@media (max-width:900px){.stg-awn{grid-template-columns:1fr;gap:2rem}}

/* pools: dark band */
.stg-pool{position:relative}
.stg-pool .top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col);margin-bottom:calc(var(--band) / 1.4);position:relative;z-index:1}
.stg-pool .body{max-width:62ch}
.stg-pool .body p{margin-top:1.1em;opacity:.86}
.stg-pool .wrap-ba{position:relative;z-index:1}
@media (max-width:900px){.stg-pool .top{grid-template-columns:1fr;gap:1.2rem}}

/* workshop */
.stg-saum-grid{list-style:none;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:calc(var(--col) * 1.4) var(--col)}
.stg-saum-grid .stg-media{aspect-ratio:4 / 3}
.stg-saum-grid h3{margin-top:.8em}
.stg-saum-grid p{opacity:.74;margin-top:.45em;max-width:34ch;font-size:var(--t-body)}
@media (max-width:1080px){.stg-saum-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:560px){.stg-saum-grid{grid-template-columns:1fr;gap:1.8rem}}
.stg-saum-2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:calc(var(--col) * 2);margin-top:calc(var(--band) / 1.2);align-items:start}
@media (max-width:900px){.stg-saum-2{grid-template-columns:1fr;gap:2.4rem}}
.stg-bidskyli{display:grid;gap:1rem}
.stg-bidskyli .stg-media{aspect-ratio:3 / 2}
.stg-bidskyli ul{list-style:none;display:flex;flex-wrap:wrap;gap:.4rem}
.stg-verd{list-style:none;margin-top:1.1rem}
.stg-verd li{display:flex;justify-content:space-between;gap:1.2rem;border-top:1px solid ${C.hairline};padding:.8em 0;font-variant-numeric:tabular-nums}
.stg-verd li:last-child{border-bottom:1px solid ${C.hairline}}
.stg-verd li span:last-child{white-space:nowrap;text-align:right}
@media (max-width:480px){.stg-verd li{flex-direction:column;gap:.15em}.stg-verd li span:last-child{text-align:left}}

/* history */
.stg-saga .cols{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:calc(var(--col) * 2);align-items:start;margin-top:calc(var(--band) / 1.4)}
.stg-time{list-style:none}
.stg-time li{display:grid;grid-template-columns:5.2em minmax(0,1fr);gap:var(--col);border-top:1px solid ${C.hairline};padding:1em 0 1.1em}
.stg-time li:last-child{border-bottom:1px solid ${C.hairline}}
.stg-time .ar{font-variant-numeric:tabular-nums;color:${C.green};font-weight:600}
.stg-saga .pics{display:grid;gap:var(--col)}
.stg-saga .pics .stg-media{aspect-ratio:4 / 3}
.stg-saga .fleira{margin-top:calc(var(--band) / 1.6);display:grid;grid-template-columns:1fr 1fr;gap:calc(var(--col) * 2)}
.stg-saga .fleira p{max-width:54ch}
@media (max-width:900px){.stg-saga .cols,.stg-saga .fleira{grid-template-columns:1fr;gap:2rem}}

/* contact */
.stg-c2a{position:relative;overflow:hidden;padding-top:2.4rem;margin-top:-2.4rem}
.stg-c2a .head{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:var(--col);margin-bottom:calc(var(--band) / 1.4);position:relative;z-index:1}
.stg-c2a .head p.l{max-width:56ch;margin-top:1.2em;opacity:.85}
.stg-c2a .facts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--col);margin-top:calc(var(--band) / 1.2);padding-top:calc(var(--band) / 2);border-top:1px solid rgba(255,255,255,.25);position:relative;z-index:1}
.stg-c2a .facts h3{font-size:var(--t-label);text-transform:uppercase;letter-spacing:.06em;font-weight:600;opacity:.6;margin-bottom:.8em}
.stg-c2a .facts p,.stg-c2a .facts a{font-size:var(--t-lead);line-height:1.5}
.stg-c2a .facts a{text-decoration:underline;text-decoration-color:rgba(255,255,255,.4);text-underline-offset:.2em}
.stg-c2a .reqwrap{position:relative;z-index:1}
@media (max-width:900px){.stg-c2a .head{grid-template-columns:1fr;gap:1rem}.stg-c2a .facts{grid-template-columns:repeat(2,minmax(0,1fr));gap:2rem 1rem}}
@media (max-width:480px){.stg-c2a .facts{grid-template-columns:1fr}}

.stg-back{display:inline-flex;align-items:center;gap:.5em;font-size:var(--t-label);text-transform:uppercase;letter-spacing:.06em;font-weight:600}
`

