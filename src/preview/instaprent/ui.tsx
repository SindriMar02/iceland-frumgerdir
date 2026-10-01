import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BIZ, CATS, PRODUCTS, type Product } from './catalog'

/* ==========================================================================
   Instaprent: a 1:1 Coutumes transplant (teardown: instaprent-design/teardowns/
   coutumes/TEARDOWN.md, literal CSS from vendor/css/styles.css). Coutumes'
   type roles are kept, re-cast in free faces with Icelandic glyphs:
     Exposure (serif, UI + titles)      -> Newsreader
     Plaak 3 (condensed bold, campaign) -> Big Shoulders (variable wght)
     Plaak 6 (extended bold, labels)    -> Martian Grotesk Wide
   Colour is Instaprent's own logo inks: orange takes Coutumes' orange role,
   blue and pink appear as small accents only.
   ========================================================================== */

export const B = import.meta.env.BASE_URL
export const ROOT = '/preview/instaprent'
export const IMG = (n: string) => `${B}instaprent/${n}.webp`
const F = (n: string) => `${B}fonts/${n}`

export const kr = (n: number) => `${Math.round(n).toLocaleString('de-DE')} kr.`
export const catName = (slug: string) => CATS.find((c) => c.slug === slug)?.name ?? ''
export const inCat = (slug: string) => PRODUCTS.filter((p) => p.cats.includes(slug))
export const priceLabel = (p: Product) => (p.priceMax > p.price ? `Frá ${kr(p.price)}` : kr(p.price))

export const reduced = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
export const finePointer = () => typeof window !== 'undefined' && matchMedia('(hover: hover) and (pointer: fine)').matches

export const CSS = `
@font-face{font-family:'IP Serif';src:url('${F('newsreader/newsreader-v26-latin_latin-ext-regular.woff2')}') format('woff2');font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'IP Serif';src:url('${F('newsreader/newsreader-v26-latin_latin-ext-italic.woff2')}') format('woff2');font-weight:400;font-style:italic;font-display:swap}
@font-face{font-family:'IP Serif';src:url('${F('newsreader/newsreader-v26-latin_latin-ext-500.woff2')}') format('woff2');font-weight:500;font-style:normal;font-display:swap}
@font-face{font-family:'IP Cond';src:url('${F('big-shoulders/BigShoulders-Variable.woff2')}') format('woff2');font-weight:100 900;font-style:normal;font-display:swap}
@font-face{font-family:'IP Ext';src:url('${F('martian-grotesk/MartianGrotesk-WdBd.woff2')}') format('woff2');font-weight:700;font-style:normal;font-display:swap}
@font-face{font-family:'IP Ext';src:url('${F('martian-grotesk/MartianGrotesk-WdMd.woff2')}') format('woff2');font-weight:500;font-style:normal;font-display:swap}

.ip{--black:#111;--white:#fff;--beige:#ece9e2;--beige-500:#ede9df;--beige-600:#f6f2eb;--gray:#999;
  --orange:#f67a32;--blue:#75c6e8;--pink:#f998b2;--slate:#4a6168;
  --serif:'IP Serif',Georgia,'Times New Roman',serif;--cond:'IP Cond','Arial Narrow',Arial,sans-serif;--ext:'IP Ext',Arial,sans-serif;
  --speed:.3s;--easing:cubic-bezier(.215,.61,.355,1);--custom-in:cubic-bezier(.4,0,.1,1);--custom-out:cubic-bezier(.7,0,.7,1);
  --reveal:cubic-bezier(.33,1,.68,1);
  --nav-h:56px;--pad:16px;--gap:8px;
  background:var(--white);color:var(--black);font-family:var(--serif);font-size:16px;line-height:24px;
  -webkit-font-smoothing:antialiased;overflow-x:clip;min-height:100vh}
@media (min-width:1024px){.ip{--nav-h:72px;--pad:24px;--gap:16px}}
.ip *,.ip *::before,.ip *::after{box-sizing:border-box}
:where(.ip) img{display:block;max-width:100%}
:where(.ip) a{color:inherit;text-decoration:none}
:where(.ip) button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer;-webkit-tap-highlight-color:transparent}
/* :where() keeps the reset at zero specificity so single-class components always win */
:where(.ip) :where(h1,h2,h3,p,ul,figure){margin:0;padding:0}
:where(.ip) ul{list-style:none}
:where(.ip) :where(h1,h2,h3){font-weight:400;text-wrap:balance}
.ip :focus-visible{outline:2px solid var(--black);outline-offset:3px}
.ip ::selection{background:var(--orange);color:var(--black)}
.ip-sr{position:absolute!important;width:1px;height:1px;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}

/* Coutumes type utilities (literal sizes from computed-typography.json) */
.u-cta{font-family:var(--ext);font-weight:700;font-size:11px;line-height:14px;text-transform:uppercase;letter-spacing:.02em}
.u-price{font-family:var(--ext);font-weight:700;font-size:12px;line-height:1.33;text-transform:uppercase;letter-spacing:.02em}
.u-p-100{font-size:14px;line-height:16px}
.u-p-200{font-size:12px;line-height:16px}
.u-title-300{font-size:18px;line-height:22px;letter-spacing:-.02em}
@media (min-width:1024px){.u-title-300{font-size:28px;line-height:32px;letter-spacing:-1.12px}}

/* c-button: Plaak 6 11px caps, 6px dot slides in on hover, label nudges 6px */
.c-button{position:relative;display:inline-flex;align-items:center;justify-content:center;min-height:44px;font-family:var(--ext);font-weight:700;
  font-size:11px;line-height:1.27;text-transform:uppercase;letter-spacing:.02em}
.c-button::before{content:"";position:absolute;left:-12px;top:47.5%;width:6px;height:6px;border-radius:1px;background:currentColor;
  transform:translate3d(6px,-50%,0) scale3d(0,0,0);transition:transform var(--speed) var(--easing)}
.c-button>span{display:block;transition:transform var(--speed) var(--easing)}
@media (hover:hover){.c-button:hover::before{transform:translate3d(6px,-50%,0) scaleX(1)}.c-button:hover>span{transform:translate3d(6px,0,0)}}
.c-button.-bg{padding:0 22px;background:var(--black);color:var(--white)}
.c-button.-bg::before{display:none}
.c-button.-bg>span{position:relative}
.c-button.-bg>span::before{content:"";position:absolute;left:-12px;top:50%;width:6px;height:6px;border-radius:1px;background:currentColor;
  transform:translate3d(0,-50%,0) scale3d(0,0,0);transition:transform var(--speed) var(--easing)}
@media (hover:hover){.c-button.-bg:hover>span::before{transform:translate3d(0,-50%,0) scaleX(1)}}
.c-button.-line{padding:0 22px;box-shadow:inset 0 0 0 1px currentColor}
.c-button.-wide{width:100%}
.c-button.-orange{background:var(--orange);color:var(--black)}
.ip-textlink{font-style:italic;text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px}

/* ---------- header (c-nav) ---------- */
.ip-awning{position:sticky;top:calc(-1 * var(--nav-h));height:calc(var(--nav-h) + env(safe-area-inset-top));background:var(--white);z-index:39;pointer-events:none}
@media (min-width:1024px){.ip-awning{display:none}.ip:not(.is-hero) main{padding-top:var(--nav-h)}}
.c-nav{position:fixed;inset:0 0 auto 0;z-index:40;color:var(--black)}
.c-nav_bar{position:relative;z-index:2;height:calc(var(--nav-h) + env(safe-area-inset-top));padding:env(safe-area-inset-top) var(--pad) 0;
  display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:24px;background:var(--white);transition:background-color .25s ease,color .25s ease}
.c-nav_bar::before{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--beige-500);transition:opacity .25s ease}
.c-nav_logo{display:flex;align-items:center;gap:10px}
.c-nav_logo .mk{height:34px;width:auto}
.c-nav_logo .wd{height:20px;width:auto}
@media (min-width:1024px){.c-nav_logo .mk{height:44px}.c-nav_logo .wd{height:25px}}
.c-nav_links{display:none;justify-self:start;gap:28px;padding-left:max(0px,calc(21vw - 170px))}
.c-nav_right{display:flex;align-items:center;gap:20px;justify-self:end}
.c-nav_link{position:relative;outline:none;font-size:16px;line-height:24px;white-space:nowrap}
.c-nav_link::before{content:"";position:absolute;left:-12px;top:50%;width:6px;height:6px;border-radius:1px;background:currentColor;
  transform:translate3d(0,-50%,0) scale3d(0,0,0);transition:transform var(--speed) var(--easing)}
.c-nav_link.is-active::before{transform:translate3d(0,-50%,0) scaleX(1)}
@media (hover:hover){.c-nav_link:hover::before{transform:translate3d(0,-50%,0) scaleX(1)}}
.c-nav_contact{display:none}
.c-nav_burger{width:40px;height:40px;margin-left:-8px;display:grid;place-items:center}
.c-nav_burger i{display:block;width:18px;height:1.5px;background:currentColor;box-shadow:0 -6px 0 currentColor,0 6px 0 currentColor;transition:box-shadow .2s,transform .2s}
.c-nav_burger[aria-expanded="true"] i{box-shadow:none;transform:rotate(45deg)}
.c-nav_burger[aria-expanded="true"] i::after{content:"";display:block;width:18px;height:1.5px;background:currentColor;transform:rotate(90deg)}
@media (max-width:1023px){.c-nav_bar{grid-template-columns:auto 1fr auto}.c-nav_logo{justify-self:center;grid-column:2}.c-nav_burger{grid-column:1;grid-row:1}.c-nav_right{grid-column:3}.c-nav_cartlabel{display:none}}
@media (min-width:1024px){
  .c-nav_links{display:flex}.c-nav_contact{display:inline}.c-nav_burger{display:none}
  /* The hero photograph is a light linen still life, so the transparent bar keeps
     black ink and the logo stays in her own colours (Coutumes inverts to white over
     its darker campaign images). */
  .ip.is-hero:not(.is-scrolled):not(.is-open) .c-nav_bar{background:transparent;color:var(--black)}
  .ip.is-hero:not(.is-scrolled):not(.is-open) .c-nav_bar::before{opacity:0}
}

/* Verslun panel: Coutumes subnav, 50% panel, 240px picture sidebar, -56px, .15s */
.c-subnav{position:fixed;left:0;right:0;bottom:0;top:var(--nav-h);z-index:1;pointer-events:none}
.c-subnav.is-open{pointer-events:auto}
.c-subnav_bg{position:absolute;inset:0;background:rgba(0,0,0,.5);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);opacity:0;transition:opacity .15s var(--custom-out)}
.c-subnav.is-open .c-subnav_bg{opacity:1;transition-timing-function:var(--custom-in)}
.c-subnav_inner{position:absolute;inset:0 auto 0 0;width:50%;min-width:680px;display:grid;grid-template-columns:240px 1fr;background:var(--white);
  opacity:0;transform:translate3d(-56px,0,0);transition:opacity .15s var(--custom-out),transform .15s var(--custom-out)}
.c-subnav.is-open .c-subnav_inner{opacity:1;transform:none;transition-timing-function:var(--custom-in)}
.c-subnav_side{position:relative;border-right:1px solid var(--beige-500);background:var(--beige)}
.c-subnav_side img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .3s ease}
.c-subnav_side img.on{opacity:1}
.c-subnav_cols{display:grid;grid-template-columns:1fr 1fr;gap:40px;padding:40px 40px;align-content:start}
.c-subnav_cols .u-cta{color:var(--gray);margin-bottom:18px;display:block}
.c-subnav_cols a{display:block;padding:5px 0;font-size:28px;line-height:32px;letter-spacing:-1.12px}
.c-subnav_cols ul:hover a{opacity:.45}.c-subnav_cols ul a:hover{opacity:1}
.c-subnav_cols a{transition:opacity .2s ease}

/* phone menu: Coutumes full-screen white panel */
.c-mnav{position:fixed;inset:0;z-index:38;background:var(--white);overflow-y:auto;overscroll-behavior:contain;
  padding:calc(var(--nav-h) + env(safe-area-inset-top) + 20px) var(--pad) calc(32px + env(safe-area-inset-bottom));
  opacity:0;transform:translate3d(-56px,0,0);pointer-events:none;transition:opacity .15s var(--custom-out),transform .15s var(--custom-out)}
.c-mnav.is-open{opacity:1;transform:none;pointer-events:auto;transition-timing-function:var(--custom-in)}
.c-mnav_big a{display:block;padding:8px 0;font-size:28px;line-height:32px;letter-spacing:-1.12px}
.c-mnav_small{margin-top:28px;padding-top:16px;border-top:1px solid var(--beige-500);display:grid;grid-template-columns:1fr 1fr}
.c-mnav_small a{display:block;padding:10px 0;font-size:16px}
.c-mnav_info{margin-top:24px;font-size:14px;line-height:20px;color:#555}
@media (min-width:1024px){.c-mnav{display:none}}

/* ---------- bag drawer (Coutumes cart-drawer: 56px + fade, 120ms) ---------- */
.c-bag{position:fixed;inset:0;z-index:60;pointer-events:none}
.c-bag.is-open{pointer-events:auto}
.c-bag_bg{position:absolute;inset:0;background:rgba(0,0,0,.2);opacity:0;transition:opacity .12s var(--custom-out)}
.c-bag.is-open .c-bag_bg{opacity:1;transition-timing-function:var(--custom-in)}
.c-bag_panel{position:absolute;top:0;right:0;bottom:0;width:100%;max-width:600px;background:var(--white);display:flex;flex-direction:column;
  transform:translateX(56px);opacity:0;transition:transform .12s var(--custom-out),opacity .12s var(--custom-out);padding-bottom:env(safe-area-inset-bottom)}
@media (min-width:1024px){.c-bag_panel{width:50%}}
.c-bag.is-open .c-bag_panel{transform:none;opacity:1;transition-timing-function:var(--custom-in)}
.c-bag_head{display:flex;justify-content:space-between;align-items:center;padding:calc(12px + env(safe-area-inset-top)) var(--pad) 12px;border-bottom:1px solid var(--beige-500);min-height:var(--nav-h)}
.c-bag_strip{background:var(--beige-600);padding:10px var(--pad);font-size:12px;line-height:16px}
.c-bag_lines{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:0 var(--pad)}
.c-bag_line{display:grid;grid-template-columns:64px 1fr auto;gap:14px;padding:18px 0;border-bottom:1px solid var(--beige-500)}
@media (min-width:1024px){.c-bag_line{grid-template-columns:90px 1fr auto}}
.c-bag_line img{width:100%;aspect-ratio:4/5;object-fit:cover;background:var(--beige)}
.c-bag_line h3{font-size:14px;line-height:16px}
.c-bag_line .v{font-size:12px;line-height:16px;color:rgba(0,0,0,.6);margin-top:4px}
.c-bag_step{display:inline-flex;align-items:center;gap:0;margin-top:12px;border:1px solid var(--beige-500)}
.c-bag_step button{width:32px;height:32px;display:grid;place-items:center;font-size:14px}
.c-bag_step button:disabled{opacity:.3}
.c-bag_step output{min-width:24px;text-align:center;font-family:var(--ext);font-size:12px}
.c-bag_rm{font-size:12px;text-decoration:underline;text-underline-offset:3px;margin-top:10px;display:block;color:rgba(0,0,0,.6)}
.c-bag_foot{border-top:1px solid var(--beige-500);padding:16px var(--pad) 20px;display:grid;gap:10px}
.c-bag_row{display:flex;justify-content:space-between;align-items:baseline}
.c-bag_note{font-size:12px;line-height:16px;color:rgba(0,0,0,.6)}
.c-bag_empty{flex:1;display:grid;place-content:center;justify-items:center;gap:16px;text-align:center;padding:40px var(--pad)}

/* ---------- product card (c-product-card) ---------- */
.c-card{position:relative;min-width:0}
.c-card_media{position:relative;display:block;aspect-ratio:4/5;background:var(--beige);overflow:hidden}
.c-card_media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity .3s ease}
.c-card_media img.contain{object-fit:contain;padding:12%}
.c-card_media img.b{opacity:0}
.c-card_arrow{position:absolute;top:50%;width:36px;height:36px;margin-top:-18px;display:grid;place-items:center;font-size:18px;opacity:0;visibility:hidden;
  transition:opacity .15s ease,visibility 0s .15s;z-index:2}
.c-card_arrow.l{left:8px}.c-card_arrow.r{right:8px}
.c-card_panel{position:absolute;left:10px;right:10px;bottom:10px;z-index:2;background:var(--white);padding:12px 14px;display:grid;gap:8px;
  opacity:0;transform:translateY(6px);visibility:hidden;transition:opacity .2s ease,transform .2s ease,visibility 0s .2s}
.c-card_panel .r1{display:flex;justify-content:space-between;align-items:center;gap:10px;font-size:12px;line-height:16px}
.c-card_panel .opts{display:flex;flex-wrap:wrap;gap:4px 10px;font-size:12px;line-height:16px}
.c-card_panel .sw{width:14px;height:14px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.2)}
@media (hover:hover) and (pointer:fine){
  .c-card:hover .c-card_panel,.c-card:hover .c-card_arrow{opacity:1;transform:none;visibility:visible;transition-delay:0s}
}
.c-card_dots{position:absolute;left:0;right:0;bottom:10px;display:flex;justify-content:center;gap:5px;z-index:1}
.c-card_dots i{width:5px;height:5px;border-radius:50%;background:#2424244d;transition:background .15s ease}
.c-card_dots i.on{background:#242424}
@media (hover:hover) and (pointer:fine){.c-card_dots{display:none}}
.c-card_content{display:flex;justify-content:space-between;gap:12px;padding:10px 2px 0}
.c-card_content h3{font-size:12px;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.c-card_content .sub{font-size:11px;line-height:1.3;color:rgba(0,0,0,.6);margin-top:2px}
.c-card_content .u-price{white-space:nowrap}
.c-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px var(--gap);padding:0 var(--gap)}
@media (min-width:1024px){.c-grid{grid-template-columns:repeat(4,minmax(0,1fr));row-gap:40px}.c-grid[data-d="2"]{grid-template-columns:repeat(2,minmax(0,1fr))}}

/* ---------- footer (c-footer: orange + tiled grain) ---------- */
.c-footer{position:relative;background:var(--orange);color:var(--black);overflow:hidden}
.c-footer::before{content:"";position:absolute;inset:0;background:url('${B}instaprent/grain.png');background-size:260px 260px;opacity:.55;mix-blend-mode:multiply;pointer-events:none}
.c-footer_in{position:relative;display:grid;gap:40px;padding:48px var(--pad) 28px}
.c-footer_left{display:grid;gap:40px;align-content:start}
.c-footer_mark{width:78px;transform:translate3d(var(--x,0),var(--y,0),0)}
.c-footer_contact .u-cta{display:block;margin-bottom:14px}
.c-footer_big{display:block;font-size:22px;line-height:1.25;padding:4px 0}
.c-footer_big:hover{text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px}
.c-footer_hours{margin-top:14px;font-size:12px;line-height:16px}
.c-footer_cols{display:grid;grid-template-columns:1fr 1fr;gap:28px 24px}
.c-footer_cols .u-cta{display:block;margin-bottom:14px}
.c-footer_cols a{display:block;font-size:14px;line-height:16px;padding:5px 0}
.c-footer_cols a:hover{text-decoration:underline;text-underline-offset:3px}
.c-footer_word{width:100%;max-width:640px}
.c-footer_legal{display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center;font-size:12px;line-height:16px}
.c-footer_legal i{width:3px;height:3px;border-radius:50%;background:currentColor}
@media (min-width:1024px){
  .c-footer_in{grid-template-columns:1fr 1fr;padding:48px 24px 28px;column-gap:24px;row-gap:64px}
  .c-footer_left{grid-template-columns:78px 1fr;column-gap:24px;align-items:start}
  .c-footer_contact{grid-column:2}
  .c-footer_right{grid-column:2;display:grid;gap:56px;align-content:start;padding-top:28px}
  .c-footer_cols{grid-template-columns:repeat(3,1fr)}
  .c-footer_bottom{grid-column:1 / -1;display:grid;grid-template-columns:1fr 1fr;align-items:end;column-gap:24px}
  .c-footer_mark{grid-row:1}
}

/* ---------- reveals: Coutumes .fx-reveal-fade values, tied to scroll position ---------- */
.rv{opacity:0;transform:translate3d(0,24px,0);transition:opacity 1s var(--reveal),transform 1s var(--reveal);transition-delay:var(--d,0s)}
.rv.is-inview{opacity:1;transform:none}
.rv-img{overflow:hidden}
.rv-img>img,.rv-img>picture img{transform:scale(1.12);transition:transform 1.4s var(--reveal);transition-delay:var(--d,0s)}
.rv-img.is-inview>img,.rv-img.is-inview>picture img{transform:none}
@supports (animation-timeline: view()){
  .rv,.rv-img>img,.rv-img>picture img{transition:none}
  .rv{animation:ip-rise linear both;animation-timeline:view();animation-range:entry 0% entry 70%}
  .rv-img>img,.rv-img>picture img{animation:ip-settle linear both;animation-timeline:view();animation-range:entry 0% cover 45%}
}
@keyframes ip-rise{from{opacity:0;transform:translate3d(0,28px,0)}to{opacity:1;transform:none}}
@keyframes ip-settle{from{transform:scale(1.14)}to{transform:scale(1)}}
@media (prefers-reduced-motion:reduce){
  .rv,.rv-img>img,.rv-img>picture img{animation:none!important;transition:none!important;opacity:1!important;transform:none!important}
}
`

/* ------------------------------------------------------------------ bag */
export type Line = { id: string; slug: string; name: string; opts: string; unit: number; qty: number; img: string }
const BAG_KEY = 'ip-poki-v1'
let lines: Line[] = (() => { try { return JSON.parse(localStorage.getItem(BAG_KEY) || '[]') as Line[] } catch { return [] } })()
const subs = new Set<() => void>()
const emit = () => { try { localStorage.setItem(BAG_KEY, JSON.stringify(lines)) } catch { /* private mode */ } subs.forEach((f) => f()) }
export const bag = {
  get: () => lines,
  subscribe: (f: () => void) => { subs.add(f); return () => { subs.delete(f) } },
  add(l: Omit<Line, 'id' | 'qty'> & { qty?: number }) {
    const id = `${l.slug}|${l.opts}`
    const found = lines.find((x) => x.id === id && !l.opts.includes('Mynd:'))
    lines = found ? lines.map((x) => (x === found ? { ...x, qty: x.qty + (l.qty ?? 1) } : x)) : [...lines, { ...l, id: `${id}|${Date.now()}`, qty: l.qty ?? 1 }]
    emit(); openBag()
  },
  qty(id: string, q: number) { lines = q <= 0 ? lines.filter((x) => x.id !== id) : lines.map((x) => (x.id === id ? { ...x, qty: q } : x)); emit() },
}
export const useBag = () => useSyncExternalStore(bag.subscribe, bag.get, bag.get)
export const openBag = () => window.dispatchEvent(new Event('ip-bag-open'))

/* ------------------------------------------------------------------ motion */

/* Lenis on fine pointers only (studio rule: phones keep native momentum). */
export function useSmooth() {
  useEffect(() => {
    if (reduced() || !finePointer()) return
    let alive = true, raf = 0
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null
    void import('lenis').then(({ default: Lenis }) => {
      if (!alive) return
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true }) as unknown as { raf: (t: number) => void; destroy: () => void }
      const tick = (t: number) => { lenis?.raf(t); raf = requestAnimationFrame(tick) }
      raf = requestAnimationFrame(tick)
    })
    return () => { alive = false; cancelAnimationFrame(raf); lenis?.destroy() }
  }, [])
}

/* Fallback for browsers without scroll-driven animations: add is-inview early
   (a fifth of a screen before entry) so the 1s fade has finished by the time it is read. */
export function useReveals(dep: unknown) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.ip .rv, .ip .rv-img'))
    if (reduced() || (typeof window.CSS !== 'undefined' && window.CSS.supports('animation-timeline: view()'))) { els.forEach((e) => e.classList.add('is-inview')); return }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-inview'); io.unobserve(e.target) } }), { rootMargin: '0px 0px 20% 0px' })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [dep])
}

/* Coutumes TextVar: characters near the cursor swell toward the heavy end of
   the variable font (lerp .28, 0 at the pointer to 100% of the radius). Desktop,
   in view, fine pointer only. Here: Big Shoulders wght 600..900. */
export function useMagnetic<T extends HTMLElement>(radius = 220) {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reduced() || !finePointer()) return
    const chars = Array.from(el.querySelectorAll<HTMLElement>('[data-ch]'))
    let mx = -9999, my = -9999, lx = -9999, ly = -9999, raf = 0, on = false
    const move = (e: PointerEvent) => { mx = e.clientX; my = e.clientY }
    const tick = () => {
      lx += (mx - lx) * 0.28; ly += (my - ly) * 0.28
      for (const c of chars) {
        const r = c.getBoundingClientRect()
        const d = Math.hypot(r.left + r.width / 2 - lx, r.top + r.height / 2 - ly)
        const s = Math.max(0, 1 - d / radius)
        c.style.fontVariationSettings = `"wght" ${Math.round(640 + s * 260)}`
      }
      raf = on ? requestAnimationFrame(tick) : 0
    }
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting
      if (on && !raf) raf = requestAnimationFrame(tick)
    })
    io.observe(el)
    window.addEventListener('pointermove', move, { passive: true })
    return () => { io.disconnect(); window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); on = false }
  }, [radius])
  return ref
}

/* Coutumes Bird: the footer mark drifts away from the cursor (lerp .5, about 4px). */
export function useRepel<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reduced() || !finePointer()) return
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      tx = -((e.clientX - (r.left + r.width / 2)) / innerWidth) * 8
      ty = -((e.clientY - (r.top + r.height / 2)) / innerHeight) * 8
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const tick = () => {
      x += (tx - x) * 0.5; y += (ty - y) * 0.5
      el.style.setProperty('--x', `${x.toFixed(2)}px`); el.style.setProperty('--y', `${y.toFixed(2)}px`)
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.05 ? requestAnimationFrame(tick) : 0
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf) }
  }, [])
  return ref
}

/* ------------------------------------------------------------------ pieces */

export function Chars({ text }: { text: string }) {
  return <>{Array.from(text).map((c, i) => <span key={i} data-ch style={{ ['--i' as string]: i } as CSSProperties}>{c}</span>)}</>
}

export function Header({ hero = false }: { hero?: boolean }) {
  const [sub, setSub] = useState(false)
  const [menu, setMenu] = useState(false)
  const [pic, setPic] = useState<string>(CATS[0].slug)
  const count = useBag().reduce((a, l) => a + l.qty, 0)
  const loc = useLocation()
  useEffect(() => { setSub(false); setMenu(false) }, [loc.pathname])
  useEffect(() => {
    const root = document.querySelector('.ip')
    const on = () => root?.classList.toggle('is-scrolled', scrollY > 50)
    on(); addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])
  useEffect(() => { document.querySelector('.ip')?.classList.toggle('is-open', sub || menu) }, [sub, menu])
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') { setSub(false); setMenu(false) } }
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [])
  useEffect(() => { document.documentElement.style.overflow = menu ? 'hidden' : ''; return () => { document.documentElement.style.overflow = '' } }, [menu])
  const tileImg = (slug: string) => {
    const p = inCat(slug)[0]
    return p ? p.imgs[0].src : ''
  }
  return (
    <>
      <div className="ip-awning" aria-hidden="true" />
      <header className="c-nav" data-hero={hero || undefined}>
        <div className="c-nav_bar">
          <button type="button" className="c-nav_burger" aria-expanded={menu} aria-controls="ip-mnav" aria-label={menu ? 'Loka valmynd' : 'Valmynd'} onClick={() => setMenu((v) => !v)}><i /></button>
          <Link to={ROOT} className="c-nav_logo" aria-label="Instaprent, forsíða">
            <img className="mk" src={`${B}instaprent/logo-mark.png`} alt="" width={900} height={814} />
            <img className="wd" src={`${B}instaprent/logo-word.png`} alt="Instaprent" width={1800} height={359} />
          </Link>
          <nav className="c-nav_links" aria-label="Aðalvalmynd">
            <button type="button" className={`c-nav_link${sub ? ' is-active' : ''}`} aria-expanded={sub} aria-controls="ip-subnav" onClick={() => setSub((v) => !v)}>Verslun</button>
            {CATS.slice(0, 3).map((c) => (
              <Link key={c.slug} to={`${ROOT}/flokkur/${c.slug}`} className={`c-nav_link${loc.pathname.endsWith(`/flokkur/${c.slug}`) ? ' is-active' : ''}`}>{c.name}</Link>
            ))}
            <Link to={`${ROOT}/um-okkur`} className={`c-nav_link${loc.pathname.endsWith('/um-okkur') ? ' is-active' : ''}`}>Um okkur</Link>
          </nav>
          <div className="c-nav_right">
            <Link to={`${ROOT}/um-okkur#samband`} className="c-nav_link c-nav_contact">Hafa samband</Link>
            <button type="button" className="c-nav_link" onClick={openBag} aria-label={`Karfa, ${count} vörur`}>
              <span className="c-nav_cartlabel">Karfa </span>({count})
            </button>
          </div>
        </div>
        <div className={`c-subnav${sub ? ' is-open' : ''}`} id="ip-subnav" aria-hidden={!sub}>
          <div className="c-subnav_bg" onClick={() => setSub(false)} />
          <div className="c-subnav_inner">
            <div className="c-subnav_side" aria-hidden="true">
              {CATS.map((c) => <img key={c.slug} className={pic === c.slug ? 'on' : ''} src={IMG(tileImg(c.slug) + '-s')} alt="" loading="lazy" />)}
            </div>
            <div className="c-subnav_cols">
              <div>
                <span className="u-cta">Flokkar</span>
                <ul>
                  <li><Link to={`${ROOT}/verslun`} tabIndex={sub ? 0 : -1} onMouseEnter={() => setPic(CATS[0].slug)}>Allar vörur</Link></li>
                  {CATS.map((c) => <li key={c.slug}><Link to={`${ROOT}/flokkur/${c.slug}`} tabIndex={sub ? 0 : -1} onMouseEnter={() => setPic(c.slug)} onFocus={() => setPic(c.slug)}>{c.name}</Link></li>)}
                </ul>
              </div>
              <div>
                <span className="u-cta">Þjónusta</span>
                <ul>
                  <li><Link to={`${ROOT}/flokkur/framkollun`} tabIndex={sub ? 0 : -1}>Framköllun</Link></li>
                  <li><Link to={`${ROOT}/um-okkur#samband`} tabIndex={sub ? 0 : -1}>Hafa samband</Link></li>
                  <li><Link to={`${ROOT}/um-okkur`} tabIndex={sub ? 0 : -1}>Um okkur</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
      <nav className={`c-mnav${menu ? ' is-open' : ''}`} id="ip-mnav" aria-label="Valmynd" aria-hidden={!menu}>
        <ul className="c-mnav_big">
          <li><Link to={`${ROOT}/verslun`} tabIndex={menu ? 0 : -1}>Allar vörur</Link></li>
          {CATS.map((c) => <li key={c.slug}><Link to={`${ROOT}/flokkur/${c.slug}`} tabIndex={menu ? 0 : -1}>{c.name}</Link></li>)}
        </ul>
        <ul className="c-mnav_small">
          <li><Link to={`${ROOT}/um-okkur`} tabIndex={menu ? 0 : -1}>Um okkur</Link></li>
          <li><Link to={`${ROOT}/um-okkur#samband`} tabIndex={menu ? 0 : -1}>Hafa samband</Link></li>
        </ul>
        <p className="c-mnav_info">{BIZ.street}, {BIZ.postcode} {BIZ.city}<br />Virka daga 12–17, laugardaga 12–15<br /><a href={`tel:${BIZ.phone_href}`}>{BIZ.phone}</a> · <a href={`mailto:${BIZ.email}`}>{BIZ.email}</a></p>
      </nav>
      <Bag />
    </>
  )
}

function Bag() {
  const [open, setOpen] = useState(false)
  const items = useBag()
  const panel = useRef<HTMLDivElement | null>(null)
  const total = items.reduce((a, l) => a + l.unit * l.qty, 0)
  useEffect(() => {
    const o = () => setOpen(true)
    window.addEventListener('ip-bag-open', o)
    return () => window.removeEventListener('ip-bag-open', o)
  }, [])
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    addEventListener('keydown', k)
    document.documentElement.style.overflow = 'hidden'
    setTimeout(() => panel.current?.focus(), 30)
    return () => { removeEventListener('keydown', k); document.documentElement.style.overflow = ''; prev?.focus?.() }
  }, [open])
  return (
    <div className={`c-bag${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="c-bag_bg" onClick={() => setOpen(false)} />
      <div className="c-bag_panel" role="dialog" aria-modal="true" aria-label="Karfa" tabIndex={-1} ref={panel}>
        <div className="c-bag_head">
          <span className="u-cta">Karfa ({items.reduce((a, l) => a + l.qty, 0)})</span>
          <button type="button" className="c-button" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}><span>Loka</span></button>
        </div>
        <p className="c-bag_strip">Sótt í Háholt 14, Mosfellsbæ, eða sent með Póstinum.</p>
        {items.length ? (
          <>
            <ul className="c-bag_lines">
              {items.map((l) => (
                <li className="c-bag_line" key={l.id}>
                  <img src={IMG(l.img + '-s')} alt="" loading="lazy" />
                  <div>
                    <h3>{l.name}</h3>
                    {l.opts ? <p className="v">{l.opts}</p> : null}
                    <div className="c-bag_step" role="group" aria-label="Fjöldi">
                      <button type="button" aria-label="Færri" disabled={l.qty <= 1} onClick={() => bag.qty(l.id, l.qty - 1)} tabIndex={open ? 0 : -1}>−</button>
                      <output>{l.qty}</output>
                      <button type="button" aria-label="Fleiri" onClick={() => bag.qty(l.id, l.qty + 1)} tabIndex={open ? 0 : -1}>+</button>
                    </div>
                    <button type="button" className="c-bag_rm" onClick={() => bag.qty(l.id, 0)} tabIndex={open ? 0 : -1}>Fjarlægja</button>
                  </div>
                  <span className="u-price">{kr(l.unit * l.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="c-bag_foot">
              <p className="c-bag_row"><span className="u-cta">Samtals</span><span className="u-price" style={{ fontSize: 16 }}>{kr(total)}</span></p>
              <p className="c-bag_note">Sendingarkostnaður bætist við í kassa. Í netversluninni fer þessi hnappur í greiðsluskref WooCommerce.</p>
              <button type="button" className="c-button -bg -wide" tabIndex={open ? 0 : -1} onClick={() => alert('Frumgerð: hér tekur greiðsluskref verslunarinnar við.')}><span>Ganga frá pöntun • {kr(total)}</span></button>
            </div>
          </>
        ) : (
          <div className="c-bag_empty">
            <p className="u-title-300">Karfan er tóm.</p>
            <Link to={`${ROOT}/verslun`} className="c-button -line" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}><span>Skoða vörurnar</span></Link>
          </div>
        )}
      </div>
    </div>
  )
}

export function Card({ p, eager = false }: { p: Product; eager?: boolean }) {
  const [i, setI] = useState(0)
  const n = p.imgs.length
  const swatch = p.attrs.find((a) => a.kind === 'swatch')
  const opt = p.attrs.find((a) => a.kind === 'buttons')
  const sub = p.personalize || p.framkollun ? 'Með þinni mynd' : opt ? `${opt.options.length} ${opt.name === 'Stærð' ? 'stærðir' : 'útgáfur'}` : ''
  const go = (d: number) => (e: MouseEvent) => { e.preventDefault(); setI((v) => (v + d + n) % n) }
  return (
    <article className="c-card">
      <Link to={`${ROOT}/vara/${p.slug}`} className="c-card_media" aria-label={p.name}>
        {p.imgs.map((im, j) => (
          <img key={im.src} src={IMG(im.src + '-s')} srcSet={`${IMG(im.src + '-s')} 700w, ${IMG(im.src)} 1400w`} sizes="(min-width:1024px) 25vw, 50vw"
            alt={j === 0 ? p.name : ''} className={`${im.fit === 'contain' ? 'contain' : ''}${j === i ? '' : ' b'}`}
            loading={eager && j === 0 ? 'eager' : 'lazy'} decoding="async" style={{ opacity: j === i ? 1 : 0 }} />
        ))}
        {n > 1 ? (
          <>
            <button type="button" className="c-card_arrow l" aria-label="Fyrri mynd" onClick={go(-1)}>‹</button>
            <button type="button" className="c-card_arrow r" aria-label="Næsta mynd" onClick={go(1)}>›</button>
            <span className="c-card_dots" aria-hidden="true">{p.imgs.map((im, j) => <i key={im.src} className={j === i ? 'on' : ''} />)}</span>
          </>
        ) : null}
        <span className="c-card_panel" aria-hidden="true">
          <span className="r1"><span>{swatch ? 'Litir' : opt ? opt.name : 'Í boði'}</span><span className="u-price">{priceLabel(p)}</span></span>
          {swatch ? (
            <span className="opts">{swatch.options.map((o) => <i key={o} className="sw" style={{ background: swatch.swatches?.[o] ?? '#ddd' }} title={o} />)}</span>
          ) : opt ? (
            <span className="opts">{opt.options.slice(0, 6).map((o) => <span key={o}>{o.replace(/(\d)\s*x\s*(\d)/gi, '$1×$2')}</span>)}{opt.options.length > 6 ? <span>+{opt.options.length - 6}</span> : null}</span>
          ) : (
            <span className="opts"><span>{p.personalize || p.framkollun ? 'Með þinni mynd og texta' : 'Tilbúin gjöf'}</span></span>
          )}
        </span>
      </Link>
      <div className="c-card_content">
        <div>
          <h3><Link to={`${ROOT}/vara/${p.slug}`}>{p.name}</Link></h3>
          {sub ? <p className="sub">{sub}</p> : null}
        </div>
        <p className="u-price">{priceLabel(p)}</p>
      </div>
    </article>
  )
}

export function Footer() {
  const mark = useRepel<HTMLImageElement>()
  return (
    <footer className="c-footer">
      <div className="c-footer_in">
        <div className="c-footer_left">
          <img ref={mark} className="c-footer_mark" src={`${B}instaprent/logo-mark.png`} alt="" width={900} height={814} aria-hidden="true" />
          <div className="c-footer_contact" id="samband">
            <span className="u-cta">Hafa samband</span>
            <a className="c-footer_big" href={`tel:${BIZ.phone_href}`}>{BIZ.phone}</a>
            <a className="c-footer_big" href={`mailto:${BIZ.email}`}>{BIZ.email}</a>
            <p className="c-footer_hours">{BIZ.street_note}, {BIZ.postcode} {BIZ.city}<br />Virka daga 12–17 · Laugardaga 12–15</p>
          </div>
        </div>
        <div className="c-footer_right">
          <div className="c-footer_cols">
            <div>
              <span className="u-cta">Verslun</span>
              <ul>{CATS.map((c) => <li key={c.slug}><Link to={`${ROOT}/flokkur/${c.slug}`}>{c.name}</Link></li>)}</ul>
            </div>
            <div>
              <span className="u-cta">Instaprent</span>
              <ul>
                <li><Link to={`${ROOT}/um-okkur`}>Um okkur</Link></li>
                <li><Link to={`${ROOT}/um-okkur#samband`}>Verslun og verkstæði</Link></li>
                <li><a href="https://myndo.is" target="_blank" rel="noopener noreferrer">Myndó ljósmyndastofa</a></li>
              </ul>
            </div>
            <div>
              <span className="u-cta">Aðstoð</span>
              <ul>
                <li><Link to={`${ROOT}/um-okkur#afhending`}>Afhending</Link></li>
                <li><Link to={`${ROOT}/um-okkur#skilmalar`}>Skilmálar</Link></li>
                <li><Link to={`${ROOT}/um-okkur#samband`}>Hafa samband</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="c-footer_bottom">
          <img className="c-footer_word" src={`${B}instaprent/logo-word.png`} alt="Instaprent.is" width={1800} height={359} loading="lazy" />
          <p className="c-footer_legal">
            <span>{BIZ.legal}</span><i /><span>kt. {BIZ.kt}</span><i /><span>VSK nr. {BIZ.vsk}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export function Shell({ children, hero = false }: { children: ReactNode; hero?: boolean }) {
  return <div className={`ip${hero ? ' is-hero' : ''}`}>{children}</div>
}
