/**
 * Reynir bakari — single-page landing (English-first, IS toggle).
 *
 * Clones the Passion Reykjavík "printed menu / broadsheet" design + palette per
 * the brief (near-black #131313 ground, antique-gold serif, deep burgundy,
 * ivory; Lusitana + Source Serif 4) and re-skins it for Reynir: their real gold
 * script logo, their heritage "hands shaping dough" photo as the cover image,
 * their aha.is prices, and their 1994 family story.
 *
 * Sections: masthead cover (real dough photo bleeding off the right, feathered
 * into the ground) → gold marquee → editorial menu with dotted price leaders →
 * oversized burgundy "from scratch" statement → bread board → cakes & catering
 * + the one real review → two-location visit strip → footer.
 *
 * Motion: hero photo has a gentle scroll-scale (no rotation — it is a scene, not
 * a medallion). Section reveals are IntersectionObserver + CSS transitions.
 */

import { noticeIsActive, shortDate, upcomingExceptions, type DateException } from './availability'
import { useModalFocus } from './useModalFocus'
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import Chrome from './Chrome'
import { pathsFor } from './paths'
import { setThemeColor } from '../../lib/preview'
import { SndrCredit } from './SndrCredit'
import { PipedTitle } from './PipedTitle'
import { useIsomorphicLayoutEffect } from './ssr'
import { type Lang, type MenuItem, type GalleryPhoto, type Review, type MenuArt, type CakeArt, LOGO } from './data'
import { ARCHIVAL, ARCHIVAL_LIVE, BODY, BURGUNDY, DIM, DISPLAY, EASE, FAINT, GOLD, GOLD_LIGHT, GOLD_TEXT, HAIR, HAIR_SOFT, INK, INK_DEEP, INK_WARM, IVORY, LETTERPRESS } from './tokens'
import OrderTeaser from './OrderTeaser'
import { useLang } from './useLang'
import { SiteContentProvider, usePageText, useOrderText, useSiteArt, useSiteContent, type DayHours } from './sanity'



// Brand tokens live in tokens.ts so section components share one source of truth.
/** Base box size of the travelling pistachio medallion (scaled via transform). */
const MED_BASE = 440

const PAGE_CSS = `
  .rb-skip { position:fixed; top:8px; left:8px; z-index:1000; padding:14px 20px; background:#F3EAD3; color:#131313; transform:translateY(-200%); }
  .rb-skip:focus { transform:none; }
  /* ── paper grain ────────────────────────────────────────────────────────
     The single cheapest thing that separates "dark website" from "printed on
     something". A fixed, non-interactive noise plate over the whole page, at
     an opacity low enough that you read it as paper tooth rather than as
     texture. Fixed rather than attached to a scrolling container on purpose:
     a noise layer inside the scroll flow repaints on every frame and drops
     mobile framerate, and it would also swim against the page instead of
     sitting still like a surface. z-index sits under the lightbox (300) and
     the intro curtain (9999) so neither picks up grain. */
  .rb-page::after { content:''; position:fixed; inset:0; z-index:200; pointer-events:none;
    opacity:.055; mix-blend-mode:overlay; will-change:auto;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
    background-size:200px 200px; }

  .rb-page ::selection { background:${BURGUNDY}; color:${IVORY}; }
  .rb-page a:focus-visible, .rb-page button:focus-visible {
    outline:2px solid ${GOLD}; outline-offset:3px; border-radius:4px;
  }

  /* iOS chrome colour. Safari 26 stopped reading the theme-color meta; it
     samples fixed edge elements' background-color and falls back to BODY's.
     html and body had none, so the status-bar strip and the band under the
     bottom URL bar rendered WHITE on a page that is ink-dark everywhere —
     see [[ios-safe-area-chrome-color]] before touching any of this. */
  html, body { background-color:${INK}; }

  .rb-cover { min-height:100svh; }

  @keyframes rb-rise { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
  .rb-enter  { animation:rb-rise .9s ${EASE} both; }
  .rb-enter-2 { animation:rb-rise .9s ${EASE} .14s both; }
  .rb-enter-3 { animation:rb-rise .9s ${EASE} .26s both; }
  .rb-enter-4 { animation:rb-rise .9s ${EASE} .38s both; }

  /* ── Scroll motion ──
     The page revealed each block as one lump: everything fades up together,
     which reads as a template. Two additions, both driven by the same
     observer via [data-shown] and both pure CSS, because framer's
     mount/state animations are unreliable in this app.

     1. HEADING WIPE. A display heading is masked and rises into view rather
        than fading — the move that separates an editorial site from a
        generated one. It runs on the h2 itself, so the gold gradient and the
        letterpress shadow are untouched.
     2. STAGGER. Direct children of a marked block arrive in sequence, ~70ms
        apart, so the eye is led down the section instead of being handed it
        all at once. */
  .rb-wipe > h2, h2.rb-wipe { clip-path:inset(0 0 110% 0); transform:translateY(.14em);
    transition:clip-path 1.05s ${EASE}, transform 1.05s ${EASE}; will-change:clip-path, transform; }
  [data-shown="true"].rb-wipe > h2, h2[data-shown="true"].rb-wipe,
  [data-shown="true"] > .rb-wipe > h2 { clip-path:inset(0 0 -0.22em 0); transform:none; }
  .rb-stagger > * { opacity:0; transform:translateY(14px);
    transition:opacity .8s ${EASE}, transform .8s ${EASE}; }
  .rb-stagger[data-shown="true"] > * { opacity:1; transform:none; }
  .rb-stagger[data-shown="true"] > *:nth-child(2) { transition-delay:.07s; }
  .rb-stagger[data-shown="true"] > *:nth-child(3) { transition-delay:.14s; }
  .rb-stagger[data-shown="true"] > *:nth-child(4) { transition-delay:.21s; }
  @media (prefers-reduced-motion: reduce) {
    .rb-wipe > h2, h2.rb-wipe { clip-path:none; transform:none; transition:none; }
    .rb-stagger > * { opacity:1; transform:none; transition:none; }
  }

  /* The edge-to-edge map band that closes the page. */
  .rb-mapband { position:relative; display:block; overflow:hidden; background:${INK_DEEP};
    aspect-ratio:21 / 9; }
  .rb-mapband iframe { position:absolute; inset:0; width:100%; height:100%; border:0; display:block;
    filter:invert(1) hue-rotate(180deg) saturate(.14) brightness(.86) contrast(1.08); }
  /* the plate the band shows before the map is asked for: a faint street
     grid round a pin, lit from the middle, in the page's own gold */
  .rb-mapband-cover { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center;
    justify-content:center; gap:12px; padding:20px 20px 16%;
    background:
      radial-gradient(60% 70% at 50% 42%, rgba(200,168,119,.12), transparent 70%),
      repeating-linear-gradient(0deg, transparent 0 55px, rgba(238,211,170,.05) 55px 56px),
      repeating-linear-gradient(90deg, transparent 0 55px, rgba(238,211,170,.05) 55px 56px),
      linear-gradient(115deg, transparent 47%, rgba(238,211,170,.07) 47.2% 48.4%, transparent 48.6%),
      ${INK_DEEP}; }
  .rb-mapband-pin { color:${GOLD}; }
  .rb-mapband-load { position:relative; z-index:2; min-height:44px; padding:11px 22px; cursor:pointer;
    font-family:${BODY}; font-size:14.5px; color:${GOLD_LIGHT}; background:rgba(11,10,9,.6);
    border:1px solid rgba(238,211,170,.34); border-radius:4px;
    transition:border-color .2s ${EASE}, background .2s ${EASE}, transform .15s ${EASE}; }
  .rb-mapband-load:hover { border-color:${GOLD}; background:rgba(200,168,119,.1); }
  .rb-mapband-load:active { transform:scale(.98); }
  .rb-mapband-load:focus-visible { outline:2px solid ${GOLD}; outline-offset:3px; }
  .rb-mapband-note { position:relative; z-index:2; font-size:12px; color:${DIM}; }
  .rb-mapband-veil { position:absolute; inset:0; pointer-events:none;
    background:linear-gradient(180deg, rgba(11,10,9,.55) 0%, rgba(11,10,9,0) 20%,
      rgba(11,10,9,0) 55%, rgba(11,10,9,.92) 100%); }
  .rb-mapband-cta { position:absolute; left:clamp(20px,4.5vw,72px); bottom:clamp(20px,3vh,34px);
    font-family:${DISPLAY}; font-size:clamp(16px,1.7vw,20px); color:${IVORY}; text-decoration:none;
    border-bottom:1px solid rgba(200,168,119,.5); padding-bottom:3px;
    transition:color .2s ${EASE}, border-color .2s ${EASE}; }
  .rb-mapband-cta:hover { color:${GOLD_LIGHT}; border-bottom-color:${GOLD}; }
  .rb-mapband-cta:focus-visible { outline:2px solid ${GOLD}; outline-offset:4px; border-radius:2px; }
  /* Squarer on a phone: 21:9 of map on a 375px screen is a 160px sliver. */
  @media (max-width:760px) { .rb-mapband { aspect-ratio:4 / 5; } }

  /* Section intros. Full-bleed ones are centred and carry no rule; the
     kicker's letterspacing already reads as a masthead without one. */
  .rb-sec-intro { text-align:center; }
  .rb-sec-kicker { font-size:12px; font-weight:700; letter-spacing:.24em; text-transform:uppercase;
    color:${GOLD}; }
  .rb-sec-lede { margin-inline:auto; }

  /* Section intros. Full-bleed ones are centred and carry no rule; the
     kicker's letterspacing already reads as a masthead without one. */
  .rb-sec-intro { text-align:center; }
  .rb-sec-kicker { font-size:12px; font-weight:700; letter-spacing:.24em; text-transform:uppercase;
    color:${GOLD}; }
  .rb-sec-lede { margin-inline:auto; }

  /* The lettering band under the hero. Full-bleed photograph, the text
     sitting on a veil at the bottom so the craft is the thing you see first
     and the links are the thing you act on. */
  /* Escapes .rb-cover's horizontal padding so the photograph runs edge to
     edge. The band lives inside the cover section (it belongs to the hero,
     not to the menu that follows), so it cannot simply be moved out — the
     negative margin is what full-bleeds it from inside a padded parent. */
  .rb-hand { position:relative; display:block; overflow:hidden; background:${INK_DEEP};
    margin-inline:calc(-1 * clamp(20px,4.5vw,72px));
    border-top:1px solid ${HAIR}; border-bottom:1px solid ${HAIR}; }
  .rb-hand-img { display:block; width:100%; height:100%; object-fit:cover;
    aspect-ratio:1800 / 960; max-height:clamp(300px,42vh,460px); }
  .rb-hand-veil { position:absolute; inset:0; pointer-events:none;
    background:linear-gradient(180deg, rgba(11,10,9,.30) 0%, rgba(11,10,9,0) 30%,
      rgba(11,10,9,.55) 62%, rgba(11,10,9,.93) 100%); }
  .rb-hand-body { position:absolute; left:clamp(20px,4.5vw,72px); right:clamp(20px,4.5vw,72px);
    bottom:clamp(18px,3vh,30px); display:flex; align-items:flex-end; justify-content:space-between;
    gap:18px; flex-wrap:wrap; }
  .rb-hand-line { margin:0; font-family:${DISPLAY}; font-size:clamp(19px,2.4vw,32px);
    color:${IVORY}; line-height:1.15; max-width:16ch; }
  .rb-hand-links { display:flex; align-items:baseline; gap:14px; flex-wrap:wrap; }
  .rb-hand-cta { font-size:11px; font-weight:700; letter-spacing:.2em; text-transform:uppercase;
    color:${FAINT}; }
  .rb-hand-link { font-family:${DISPLAY}; font-size:clamp(15px,1.5vw,18px); color:${GOLD_LIGHT};
    text-decoration:none; border-bottom:1px solid rgba(200,168,119,.4); padding-bottom:2px;
    transition:color .2s ${EASE}, border-color .2s ${EASE}; }
  .rb-hand-link:hover { color:${IVORY}; border-bottom-color:${GOLD}; }
  .rb-hand-link:focus-visible { outline:2px solid ${GOLD}; outline-offset:3px; border-radius:2px; }
  @media (max-width:760px) {
    .rb-hand-body { flex-direction:column; align-items:flex-start; gap:10px; }
    .rb-hand-img { max-height:none; aspect-ratio:4 / 3; }
  }

  /* Section intros. Full-bleed ones are centred and carry no rule; the
     kicker's letterspacing already reads as a masthead without one. */
  .rb-sec-intro { text-align:center; }
  .rb-sec-kicker { font-size:12px; font-weight:700; letter-spacing:.24em; text-transform:uppercase;
    color:${GOLD}; }
  .rb-sec-lede { margin-inline:auto; }

  /* The counter rail that replaced the scrolling marquee. Static by design:
     the facts ARE the content, so there is nothing to animate. */
  .rb-facts-strip { border-top:1px solid ${HAIR}; border-bottom:1px solid ${HAIR};
    padding:16px clamp(20px,4.5vw,72px); position:relative; z-index:2; }
  .rb-facts { display:flex; align-items:center; justify-content:center; flex-wrap:wrap;
    gap:0 clamp(14px,2vw,26px); max-width:1180px; margin:0 auto; }
  .rb-fact { display:inline-flex; align-items:center; gap:9px; font-family:${DISPLAY};
    font-size:clamp(15px,1.5vw,18px); color:${IVORY}; }
  .rb-fact-sep { width:4px; height:4px; border-radius:50%; background:${GOLD}; opacity:.55; }
  .rb-fact-dot { width:7px; height:7px; border-radius:50%; background:${FAINT};
    box-shadow:0 0 0 3px rgba(243,234,211,.06); }
  .rb-fact[data-open="true"] .rb-fact-dot { background:${GOLD};
    box-shadow:0 0 0 3px rgba(200,168,119,.16); }
  /* Stacked on a phone: three facts on one line would set 11px type. */
  @media (max-width:760px) {
    .rb-facts { flex-direction:column; gap:7px; }
    .rb-fact-sep { display:none; }
  }

  /* the hero pistachio turns slowly and smoothly, in place — a true cutout on
     transparency, so the ground shows through and nothing frames it. */
  @keyframes rb-hero-spin { to { transform:rotate(360deg); } }
  .rb-hero-spin { animation:rb-hero-spin 44s linear infinite; will-change:transform; transform-origin:50% 50%;
    filter:drop-shadow(0 30px 45px rgba(0,0,0,.6)); }

  /* the one full-bleed break: a slow, held breath rather than a static plate */
  @keyframes rb-break-zoom { from { transform:scale(1.08); } to { transform:scale(1); } }
  .rb-break-img { animation:rb-break-zoom 12s ${EASE} both; }
  @media (prefers-reduced-motion: reduce) { .rb-break-img { animation:none; } }

  /* ── intro loader: the gold script writes itself on, as if piped ──────────── */
  .rb-intro { position:fixed; inset:0; z-index:9999; background:${INK};
    display:flex; align-items:center; justify-content:center; cursor:pointer;
    animation:rb-intro-out .6s cubic-bezier(.7,0,.2,1) 1.55s forwards; }
  .rb-intro-logo { position:relative; width:min(74vw,400px); }
  .rb-intro-logo img { width:100%; height:auto; display:block; }
  .rb-intro-draw { clip-path:inset(0 100% 0 0);
    animation:rb-draw 1.3s cubic-bezier(.5,.05,.2,1) .2s forwards; }
  .rb-intro-tip { position:absolute; top:50%; left:0; width:11px; height:11px; margin:-5.5px 0 0 -5.5px;
    border-radius:50%; opacity:0; pointer-events:none;
    background:radial-gradient(circle, ${GOLD_LIGHT} 0%, ${GOLD} 52%, transparent 74%);
    box-shadow:0 0 18px 5px rgba(200,168,119,.5);
    animation:rb-tip 1.3s cubic-bezier(.5,.05,.2,1) .2s forwards; }
  @keyframes rb-draw { to { clip-path:inset(0 0 0 0); } }
  @keyframes rb-tip { 0% { left:0%; opacity:0; } 9% { opacity:1; } 86% { opacity:1; } 100% { left:100%; opacity:0; } }
  @keyframes rb-intro-out { to { opacity:0; visibility:hidden; } }
  /* The mark recedes a touch as it goes, so the curtain reads as opening onto
     the page rather than a layer being switched off. Slightly ahead of the
     ink, which is what makes it feel like depth. */
  .rb-intro-logo { animation:rb-intro-mark-out .5s cubic-bezier(.4,0,.2,1) 1.5s forwards; }
  @keyframes rb-intro-mark-out { to { opacity:0; transform:scale(1.05); } }

  /* THE HELD ENTRANCE — see the curtain comment in ReynirPageInner. Paused at
     frame 0 while the ink is up; released on the curtain's first fading frame,
     from which point the stagger runs at its normal pace in full view. */
  [data-curtain="playing"] .rb-enter,
  [data-curtain="playing"] .rb-enter-2,
  [data-curtain="playing"] .rb-enter-3,
  [data-curtain="playing"] .rb-enter-4 { animation-play-state:paused; }
  /* The cover's photograph is not part of the stagger, so it gets the same
     hold by hand: a still frame under type that is about to rise. */
  [data-curtain="playing"] .rb-break-img { animation-play-state:paused; }

  /* Italic on hover, not a colour-only shift: on a serif identity the type
     itself can carry the state, and Lusitana's italic is a real cut. */
  .rb-navlink { color:${DIM}; text-decoration:none; font-size:14.5px;
    transition:color .2s ${EASE}; }
  .rb-navlink:hover, .rb-navlink:focus-visible { color:${GOLD_LIGHT}; font-style:italic; }

  /* ── sticky bar ─────────────────────────────────────────────────────────
     The masthead is position:relative and scrolls away with the hero, which
     left the entire rest of the page with no navigation and — more costly —
     no way to order without scrolling back. This bar materialises once the
     cover has left the viewport and keeps one action permanently reachable.
     Driven by IntersectionObserver on the cover rather than a scroll
     listener, so nothing runs per-frame. backdrop-filter is safe here
     because the element is fixed; on a scrolling container it would repaint
     continuously and cost real frames on mobile. */
  /* THE AWNING — the only thing that can own the Dynamic Island strip.
     Measured twice in the simulator: a fixed element paints NOTHING above the
     layout viewport (a 120px red cap: zero pixels), but that strip renders
     the SCROLLING document — and position:sticky lives in the scrolling
     layer. Stuck at top:-100px it rests inside the strip itself and paints
     solid ink where the page used to show through (red-awning test: the
     strip filled edge to edge). Negative margin cancels its height, so
     layout is untouched. Requires the page root to use overflow-x:clip —
     overflow-x:hidden silently kills sticky in every descendant. Gated on
     the same state as the bar so the hero keeps its clean opening. */
  /* PERMANENT, from first paint — the strip nothing can leak into. At rest it
     is a real 70px band at the top of the flow, so the masthead starts below
     the Dynamic Island zone instead of sliding under it; once scrolling
     collapses the chrome it sticks 64px above the viewport top and keeps the
     strip solid ink at every scroll position. No opacity gate: gating it on
     scroll state is what let the masthead leak into the island at rest. */
  /* content scrolls under a permanent bar, so anchor jumps must stop short */
  #menu, #bread, #gallery, #visit { scroll-margin-top: 76px; }

  .rb-awning { position:sticky; top:-100px; height:106px; flex:none;
    z-index:140; background:${INK}; pointer-events:none; }

  /* SNDR's .bar, verbatim in mechanism (Sindri's own site, the reference he
     named): fixed at top:0 from FIRST PAINT, always visible, never hides,
     never transforms — 88% ink glass over blur with a hairline underneath.
     No observer, no scroll state, no reveal: a header that never moves is a
     header that can never detach, split, or arrive over content. Present at
     first paint also means Safari's chrome sampler sees it immediately. */
  .rb-stickybar { position:fixed; inset:0 0 auto 0; z-index:150;
    display:flex; align-items:center; justify-content:space-between; gap:20px;
    padding:10px clamp(16px,4.5vw,72px);
    background-color:rgba(11,10,9,.88);
    -webkit-backdrop-filter:blur(10px); backdrop-filter:blur(10px);
    border-bottom:1px solid rgba(238,211,170,.14); }
  .rb-sticky-nav { display:flex; gap:22px; align-items:center; }
  /* Right side: one utility cluster, then the action. The hairlines do the
     grouping so the items need no boxes of their own. */
  .rb-bar-right { display:flex; align-items:center; gap:clamp(12px,1.6vw,20px); }
  .rb-bar-util { display:flex; align-items:center; gap:11px; }
  .rb-bar-sep { width:1px; height:13px; background:rgba(238,211,170,.18); flex:0 0 auto; }
  /* 16px glyph, 44px hit area, pulled back out of the layout with a negative
     margin so the cluster still measures 16px tall on the bar. */
  .rb-social { display:inline-flex; align-items:center; justify-content:center;
    width:44px; height:44px; margin:-14px -14px; color:${FAINT};
    transition:color .2s ${EASE}, transform .18s ${EASE}; }
  .rb-social:hover { color:${GOLD_LIGHT}; }
  .rb-social:active { transform:scale(.94); }
  .rb-social:focus-visible { outline:1px solid rgba(238,211,170,.5); outline-offset:-12px; border-radius:2px; }
  /* in the drawer the 44px box IS the layout, so the pull-back comes off */
  .rb-social-menu { margin:0; }
  .rb-sticky-cta { display:inline-flex; align-items:center; gap:9px; text-decoration:none;
    background:${GOLD}; color:${INK_DEEP}; font-family:${BODY}; font-size:13.5px; font-weight:600;
    letter-spacing:.02em; padding:9px 17px; border-radius:2px; white-space:nowrap;
    transition:background .2s ${EASE}, transform .15s ${EASE}; }
  .rb-sticky-cta:hover { background:${GOLD_LIGHT}; }
  .rb-sticky-cta:active { transform:scale(.98); }
  /* the open/closed dot, carried into the bar so the status stays visible */
  .rb-sticky-dot { width:6px; height:6px; border-radius:50%; flex:0 0 auto; }

  /* Dot + one word, with the hours on hover/focus. The tip is rendered in
     place (never removed from the DOM) so it can transition instead of
     restarting a keyframe, and it scales from its own top edge — it belongs to
     the status below the bar, not to the middle of the viewport. */
  .rb-status { position:relative; display:inline-flex; align-items:center; gap:7px;
    font-size:12px; letter-spacing:.08em; text-transform:uppercase; white-space:nowrap;
    text-decoration:none; color:${FAINT}; transition:color .2s ${EASE}; }
  .rb-status[data-open="true"] { color:${GOLD_LIGHT}; }
  .rb-status-tip { position:absolute; top:calc(100% + 11px); left:50%;
    transform:translate(-50%,-4px) scale(.96); transform-origin:50% 0;
    opacity:0; pointer-events:none; visibility:hidden;
    background:rgba(20,18,15,.97); color:${IVORY};
    -webkit-backdrop-filter:blur(8px); backdrop-filter:blur(8px);
    border:1px solid rgba(238,211,170,.18); border-radius:3px;
    padding:7px 11px; font-size:11.5px; letter-spacing:.06em;
    box-shadow:0 10px 26px rgba(0,0,0,.42);
    transition:opacity .16s ${EASE}, transform .16s ${EASE}, visibility .16s; }
  /* the little notch, so the tip reads as spoken by the dot */
  .rb-status-tip::before { content:''; position:absolute; top:-4px; left:50%;
    width:7px; height:7px; transform:translateX(-50%) rotate(45deg);
    background:rgba(20,18,15,.97);
    border-left:1px solid rgba(238,211,170,.18); border-top:1px solid rgba(238,211,170,.18); }
  /* Hover only where there is a real pointer; focus-visible everywhere, so a
     keyboard reaches the hours without a mouse. */
  @media (hover:hover) and (pointer:fine) {
    .rb-status:hover .rb-status-tip { opacity:1; visibility:visible; transform:translate(-50%,0) scale(1); }
  }
  .rb-status:focus-visible .rb-status-tip { opacity:1; visibility:visible; transform:translate(-50%,0) scale(1); }
  .rb-status:focus-visible { outline:1px solid rgba(238,211,170,.5); outline-offset:4px; border-radius:2px; }
  @media (prefers-reduced-motion:reduce) {
    .rb-status-tip { transition:opacity .16s linear, visibility .16s; transform:translate(-50%,0) scale(1); }
    .rb-status:hover .rb-status-tip, .rb-status:focus-visible .rb-status-tip { transform:translate(-50%,0) scale(1); }
  }
  @media (max-width:820px) {
    .rb-sticky-nav { display:none; }
    .rb-bar-lang { display:none !important; }
    /* social and language move into the drawer, where there is room for them;
       the status dot stays, because it is the one thing worth reading here */
    .rb-stickybar .rb-social, .rb-bar-sep { display:none; }
  }
  
  /* One word fits beside the CTA where the old sentence did not, so it now
     survives down to the narrowest phones; under 380px the dot alone carries
     open/closed again. */
  @media (max-width:380px) { .rb-sticky-status { display:none; } }


  .rb-cta {
    display:inline-block; text-decoration:none; font-weight:600; font-size:15.5px;
    padding:14px 30px; border-radius:4px; white-space:nowrap;
    transition:background .25s ${EASE}, color .25s ${EASE}, border-color .25s ${EASE}, transform .18s ${EASE};
  }
  .rb-cta:active { transform:scale(.98); }
  .rb-cta-gold { background:${GOLD}; color:${INK}; border:1px solid ${GOLD}; }
  .rb-cta-gold:hover { background:${GOLD_LIGHT}; border-color:${GOLD_LIGHT}; }
  /* Screen-reader-only text. The clip technique, not a negative offset: an
     off-canvas absolute element inside a scroll container drags the container
     with it (see the .sr-only note in the studio memory). */
  .rb-sr { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden;
    clip:rect(0 0 0 0); clip-path:inset(50%); white-space:nowrap; border:0; }
  .rb-cta-ghost { background:transparent; color:${IVORY}; border:1px solid rgba(238,211,170,.34); }
  /* An outlined button with an arrow means this one leaves the site. The arrow
     is a separate span so it can sit at the size of the text without being
     read out as a word. */
  .rb-cta-ext { display:inline-flex; align-items:center; gap:9px; }
  .rb-cta-ext > span[aria-hidden] { font-size:13px; opacity:.75; transition:transform .2s ${EASE}; }
  .rb-cta-ext:hover > span[aria-hidden] { transform:translate(2px,-2px); }
  .rb-cta-ghost:hover { border-color:${GOLD}; background:rgba(238,211,170,.05); }

  .rb-lang { background:none; border:none; cursor:pointer; padding:14px 13px; margin:-14px -13px; font-family:${BODY};
    font-size:13px; letter-spacing:.08em; color:${FAINT}; transition:color .2s ${EASE}; border-radius:4px; }
  .rb-lang[aria-pressed="true"] { color:${GOLD_LIGHT}; }
  .rb-lang:hover { color:${IVORY}; }

  /* ── mobile menu ─────────────────────────────────────────────────────────
     Below 620px the masthead nav is hidden, and below 820px the sticky bar's
     nav goes too — which left a phone with a logo, a status dot and one CTA,
     and no way to reach the menu, the gallery or the story at all. This is
     that navigation, not a shrunken copy of the desktop one: six destinations
     set as a printed list, because the page's whole identity is a serif on
     paper and a phone is where that reads best.

     The button appears in whichever bar is on screen. They are never both
     visible: the sticky bar only materialises once the masthead has scrolled
     away. */
  .rb-burger { display:none; position:relative; width:44px; height:44px; margin-right:-10px;
    align-items:center; justify-content:center; background:none; border:none; cursor:pointer;
    -webkit-tap-highlight-color:transparent; }
  .rb-burger-line { position:absolute; left:12px; width:20px; height:1.5px; background:${IVORY};
    border-radius:2px; transition:transform .4s ${EASE}, opacity .2s ${EASE}, background .2s ${EASE}; }
  .rb-burger-line:nth-child(1) { transform:translateY(-6px); }
  .rb-burger-line:nth-child(3) { transform:translateY(6px); }
  .rb-burger[aria-expanded="true"] .rb-burger-line { background:${GOLD_LIGHT}; }
  .rb-burger[aria-expanded="true"] .rb-burger-line:nth-child(1) { transform:rotate(45deg); }
  .rb-burger[aria-expanded="true"] .rb-burger-line:nth-child(2) { opacity:0; transform:scaleX(.4); }
  .rb-burger[aria-expanded="true"] .rb-burger-line:nth-child(3) { transform:rotate(-45deg); }
  .rb-burger-close { display:inline-flex; }
  @media (max-width:820px) { .rb-burger-bar { display:inline-flex; } }

  /* visibility, not display, so the panel can animate out rather than vanish */
  .rb-menu { position:fixed; inset:0; z-index:300; display:flex; flex-direction:column;
    background:${INK};
    background-image:radial-gradient(120% 70% at 50% -10%, rgba(200,168,119,.13), transparent 62%);
    opacity:0; visibility:hidden;
    transition:opacity .42s ${EASE}, visibility 0s linear .42s; }
  .rb-menu[data-open="true"] { opacity:1; visibility:visible; transition:opacity .42s ${EASE}, visibility 0s; }
  .rb-menu-top { display:flex; align-items:center; justify-content:space-between;
    padding:calc(10px + env(safe-area-inset-top, 0px)) clamp(16px,4.5vw,72px) 10px; min-height:64px; }
  .rb-menu-nav { flex:1; display:flex; flex-direction:column; justify-content:center;
    padding:0 clamp(22px,6vw,72px); gap:2px; }
  .rb-menu-link { position:relative; display:block; text-decoration:none;
    font-family:${DISPLAY}; font-size:clamp(30px,8.6vw,44px); line-height:1.18; letter-spacing:.01em;
    padding:clamp(9px,1.5vh,14px) 0; border-bottom:1px solid ${HAIR_SOFT};
    opacity:0; transform:translateY(16px);
    transition:opacity .5s ${EASE}, transform .5s ${EASE}; }
  .rb-menu-link:last-of-type { border-bottom:none; }
  /* the stagger: each line arrives just after the one above, the way a list
     is read rather than the way a grid appears */
  .rb-menu[data-open="true"] .rb-menu-link { opacity:1; transform:none; }
  .rb-menu[data-open="true"] .rb-menu-link:nth-of-type(1) { transition-delay:.10s; }
  .rb-menu[data-open="true"] .rb-menu-link:nth-of-type(2) { transition-delay:.155s; }
  .rb-menu[data-open="true"] .rb-menu-link:nth-of-type(3) { transition-delay:.21s; }
  .rb-menu[data-open="true"] .rb-menu-link:nth-of-type(4) { transition-delay:.265s; }
  .rb-menu[data-open="true"] .rb-menu-link:nth-of-type(5) { transition-delay:.32s; }
  .rb-menu[data-open="true"] .rb-menu-link:nth-of-type(6) { transition-delay:.375s; }
  /* index, not decoration: it numbers the list like a printed menu card */
  .rb-menu-num { font-family:${BODY}; font-size:11px; letter-spacing:.16em; color:${FAINT};
    vertical-align:super; margin-right:12px; }
  .rb-menu-link:active { opacity:.72; }

  .rb-menu-foot { padding:clamp(18px,3vh,26px) clamp(22px,6vw,72px) calc(clamp(20px,3vh,30px) + env(safe-area-inset-bottom));
    border-top:1px solid ${HAIR_SOFT}; display:flex; flex-direction:column; gap:16px;
    opacity:0; transform:translateY(10px); transition:opacity .45s ${EASE} .34s, transform .45s ${EASE} .34s; }
  .rb-menu[data-open="true"] .rb-menu-foot { opacity:1; transform:none; }
  .rb-menu-footrow { display:flex; align-items:center; justify-content:space-between; gap:18px; }
  .rb-menu-status { display:flex; align-items:center; gap:8px; font-size:12px; letter-spacing:.08em;
    text-transform:uppercase; }
  .rb-menu-cta { display:block; text-align:center; text-decoration:none; background:${GOLD};
    color:${INK_DEEP}; font-family:${BODY}; font-size:16px; font-weight:600; letter-spacing:.02em;
    padding:15px 24px; border-radius:3px; transition:background .2s ${EASE}, transform .15s ${EASE}; }
  .rb-menu-cta:active { transform:scale(.985); }

  /* Nothing moves, but nothing disappears either: the panel still opens and
     closes, it simply arrives at once. */
  @media (prefers-reduced-motion: reduce) {
    .rb-menu, .rb-menu-link, .rb-menu-foot, .rb-burger-line {
      transition-duration:.01ms !important; transition-delay:0s !important; }
    .rb-menu-link, .rb-menu-foot { opacity:1; transform:none; }
  }

  .rb-row { transition:color .2s ${EASE}; }
  .rb-row:hover .rb-row-name { color:${GOLD_LIGHT}; }
  .rb-leader { flex:1; align-self:center; height:0; border-bottom:1.5px dotted rgba(238,211,170,.32); margin:0 4px; transform:translateY(2px); }

  .rb-foot-link { color:${DIM}; text-decoration:none; transition:color .2s ${EASE}; }
  .rb-foot-link:hover { color:${GOLD_LIGHT}; }

  .rb-cover-art { position:absolute; top:50%; right:clamp(-30px,0vw,20px); transform:translateY(-50%);
    width:clamp(300px,40vw,${MED_BASE}px); z-index:1; pointer-events:none; display:flex; align-items:center; justify-content:center; }
  /* THE SNUDUR WAS NEVER ACTUALLY CENTRED, and that is why the craft band cut
     it. top:50% only centres together with translateY(-50%), and this element
     also carries the shared entrance class .rb-enter-3, whose keyframes END at
     transform:none with fill-mode both. A filled animation beats a normal
     declaration, so the instant the intro finished the browser threw the -50%
     away: the cutout's TOP edge sat on the grid's centre line instead of its
     middle, dropping it about 240px. Measured at 1440x900 before this fix: the
     art ran 438-920 while the band starts at 770, so 150px (31% of the pastry)
     was behind a band that paints over it (z-index:2, by design). Centred, it
     ends at 679 and clears the band by 91px.
     Fix: its own keyframes, carrying the -50% at both ends. Nothing about the
     hero's design, the band, or the z-index changes.
     GENERAL RULE: never put .rb-enter* on an element that needs its own
     transform. Animate a wrapper, or give it keyframes that preserve it. */
  @keyframes rb-rise-art {
    from { opacity:0; transform:translateY(calc(-50% + 14px)); }
    to   { opacity:1; transform:translateY(-50%); }
  }
  .rb-cover-art.rb-enter-3 { animation-name:rb-rise-art; }

  /* ── photo gallery: one horizontal strip, scroll-snapped ───────────────── */
  .rb-gallery-strip { display:flex; gap:14px; overflow-x:auto; overflow-y:hidden;
    scroll-snap-type:x mandatory; scroll-padding-left:max(20px,calc((100vw - 1180px) / 2 + 20px));
    padding:4px max(20px,calc((100vw - 1180px) / 2 + 20px)) 18px;
    -webkit-overflow-scrolling:touch; scrollbar-width:thin;
    scrollbar-color:rgba(238,211,170,.28) transparent; }
  .rb-gallery-strip::-webkit-scrollbar { height:6px; }
  .rb-gallery-strip::-webkit-scrollbar-track { background:transparent; }
  .rb-gallery-strip::-webkit-scrollbar-thumb { background:rgba(238,211,170,.28); border-radius:3px; }
  .rb-gallery-strip::-webkit-scrollbar-thumb:hover { background:rgba(238,211,170,.45); }
  /* fixed HEIGHT, auto width: mixed portrait/landscape frames keep their own
     aspect ratios and simply occupy more or less of the strip, which is what
     makes a filmstrip read as a filmstrip rather than as cropped tiles. */
  .rb-gallery-strip .rb-gallery-item { flex:0 0 auto; width:auto; height:clamp(300px,46vh,440px);
    margin:0; scroll-snap-align:start; }
  .rb-gallery-strip .rb-gallery-item img { height:100%; width:auto; }

  /* ── the story: two mirrored chapters over a full-bleed opening plate ──── */
  @keyframes rb-story-zoom { from { transform:scale(1.07); } to { transform:scale(1); } }
  .rb-story-img { animation:rb-story-zoom 14s ${EASE} both; filter:${ARCHIVAL}; }
  .rb-story-chapter > img { filter:${ARCHIVAL}; }

  .rb-gallery-item { break-inside:avoid; margin:0 0 14px; padding:0; border:0; display:block; width:100%;
    position:relative; overflow:hidden; border-radius:3px; cursor:zoom-in; background:${INK_DEEP};
    box-shadow:0 1px 0 rgba(238,211,170,.06); }
  .rb-gallery-item::after { content:''; position:absolute; inset:0; border-radius:3px;
    border:1px solid rgba(238,211,170,0); transition:border-color .3s ${EASE}; pointer-events:none; }
  .rb-gallery-item:hover::after, .rb-gallery-item:focus-visible::after { border-color:rgba(238,211,170,.4); }
  .rb-gallery-item img { width:100%; height:auto; display:block; filter:${ARCHIVAL};
    transition:transform .6s ${EASE}, filter .6s ${EASE}; }
  .rb-gallery-item:hover img, .rb-gallery-item:focus-visible img { transform:scale(1.045); filter:${ARCHIVAL_LIVE}; }
  /* Anchor targets must clear the sticky bar (63px) or a jumped-to heading
     lands underneath it. */
  .rb-page section[id] { scroll-margin-top:78px; }

  .rb-lightbox { position:fixed; inset:0; z-index:300; background:rgba(11,10,9,.94);
    padding-top:env(safe-area-inset-top, 0px);
    display:flex; align-items:center; justify-content:center; padding:clamp(16px,5vh,56px);
    animation:rb-lb-in .28s ${EASE} both; }
  @keyframes rb-lb-in { from { opacity:0; } to { opacity:1; } }
  .rb-lightbox-fig { margin:0; max-width:min(92vw,1100px); max-height:88vh; display:flex; flex-direction:column; align-items:center; gap:14px; }
  .rb-lightbox-fig img { max-width:100%; max-height:74vh; width:auto; height:auto; display:block; border-radius:3px;
    box-shadow:0 40px 90px -20px rgba(0,0,0,.7); animation:rb-lb-zoom .32s ${EASE} both; }
  @keyframes rb-lb-zoom { from { opacity:0; transform:scale(.97); } to { opacity:1; transform:none; } }
  .rb-lightbox-cap { font-family:${BODY}; font-style:italic; font-size:15px; color:${IVORY}; text-align:center; }
  .rb-lb-btn { position:absolute; background:rgba(19,19,19,.55); border:1px solid rgba(238,211,170,.22); color:${IVORY};
    width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer;
    transition:background .2s ${EASE}, border-color .2s ${EASE}, transform .15s ${EASE}; }
  .rb-lb-btn:hover { background:rgba(200,168,119,.16); border-color:${GOLD}; }
  .rb-lb-btn:active { transform:scale(.94); }
  .rb-lb-close { top:clamp(10px,2vh,28px); right:clamp(10px,2vw,28px); }
  .rb-lb-prev { left:clamp(6px,1.5vw,20px); top:50%; transform:translateY(-50%); }
  .rb-lb-next { right:clamp(6px,1.5vw,20px); top:50%; transform:translateY(-50%); }

  /* ── rotating testimonial: soft crossfade on each key-remount ─────────── */
  @keyframes rb-testi-in { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
  .rb-testi-fade { animation:rb-testi-in .7s ${EASE} both; }
  .rb-testi-stack { list-style:none; margin:0; padding:0; display:grid; }
  .rb-testi-item { grid-area:1 / 1; align-self:center; opacity:0; visibility:hidden;
    transform:translateY(8px);
    transition:opacity .32s ${EASE}, transform .32s ${EASE}, visibility 0s linear .32s; }
  /* the outgoing quote clears fast, the incoming one arrives a beat later and
     slower: a dot press gets an answer inside ~100ms, and the two never sit on
     top of each other at half opacity */
  .rb-testi-item[data-active] { opacity:1; visibility:visible; transform:none;
    transition:opacity .5s ${EASE} .08s, transform .5s ${EASE} .08s, visibility 0s; }
  /* 44px tap target with a small 7px visible dot centered inside (WCAG target size) */
  .rb-testi-dot { width:44px; height:44px; padding:0; border:0; background:transparent; cursor:pointer;
    display:flex; align-items:center; justify-content:center; }
  .rb-testi-dot::after { content:''; width:7px; height:7px; border-radius:50%; border:1px solid rgba(238,211,170,.4);
    transition:background .25s ${EASE}, border-color .25s ${EASE}, transform .2s ${EASE}; }
  .rb-testi-dot:hover::after { border-color:${GOLD}; transform:scale(1.15); }
  .rb-testi-dot[data-active="true"]::after { background:${GOLD}; border-color:${GOLD}; }

  @media (max-width:820px) {
    .rb-gallery-strip { gap:10px; }
    .rb-gallery-item { margin-bottom:10px; }
    .rb-lb-prev { left:4px; } .rb-lb-next { right:4px; }
  }

  @media (max-width:980px) {
    .rb-cover-grid { grid-template-columns:1fr !important; }
    .rb-cover-art { position:static !important; transform:none !important; width:min(62vw,300px) !important; order:-1; margin:0 auto 8px; }
    .rb-cover-copy { text-align:center; align-items:center !important; }
    .rb-cover-meta { justify-content:center !important; }
    .rb-cover-ctas { justify-content:center !important; }
    .rb-menu-cols { grid-template-columns:1fr !important; }
    .rb-feature { grid-template-columns:1fr !important; }
    .rb-feature-art { order:-1; }
    .rb-feature-art > div { width:min(62vw,280px) !important; }
    .rb-bread-grid { grid-template-columns:1fr !important; }
    .rb-catering-grid { grid-template-columns:1fr !important; }
    .rb-visit-grid { grid-template-columns:1fr !important; }
    /* Once the grids are a single column, a frame with its own max-width sits
       in a much wider column and reads as pushed to one side. Auto margins
       centre it. Frames that fill their cell are already 100% wide, so this
       does nothing to them. !important because the width cap and the top
       margin arrive as inline style. */
    .rb-menu-art { margin-left:auto !important; margin-right:auto !important; }
    /* the story's two chapters stack, photo always above its paragraph —
       explicit grid-row/column overrides because the flipped chapter pins
       its image to column 2, which would otherwise survive the collapse. */
    .rb-story-chapter { grid-template-columns:1fr !important; }
    .rb-story-chapter > img { grid-column:1 !important; grid-row:1 !important; }
    .rb-story-chapter > p { grid-column:1 !important; grid-row:2 !important; }
  }
  @media (max-width:620px) {
    .rb-nav-links { display:none !important; }
    .rb-cover-ctas { flex-direction:column; align-items:stretch; }
    .rb-cover-meta { flex-direction:column; gap:6px !important; }
  }
  @media (prefers-reduced-motion: reduce) {
    .rb-enter, .rb-enter-2, .rb-enter-3, .rb-enter-4 { animation:none; }
    .rb-hero-spin { animation:none; }
    .rb-cta { transition:none; }
    .rb-cta:active { transform:none; }
    .rb-gallery-item img { transition:none; }
    .rb-gallery-item:hover img { transform:none; }
    .rb-lightbox, .rb-lightbox-fig img { animation:none; }
    .rb-testi-fade { animation:none; }
    .rb-testi-item, .rb-testi-item[data-active] { transform:none; transition:opacity .3s linear, visibility 0s; }
    .rb-story-img { animation:none; }
    .rb-gallery-strip { scroll-snap-type:none; }
  }
`

const pad2 = (n: number) => String(n).padStart(2, '0')
const fmtHM = (mins: number) => `${Math.floor(mins / 60)}:${pad2(mins % 60)}`
/* Zero-padded, for the printed hours line rather than a sentence — "kl. 7:00"
   reads naturally mid-sentence, "07:00–17:00" reads right as a timetable. */
const fmtHMPad = (mins: number) => `${pad2(Math.floor(mins / 60))}:${pad2(mins % 60)}`

/** Iceland has no DST, so UTC clock fields equal Iceland local time.
 *  hoursByDay is read live from the CMS (falls back to bundled data.ts) so
 *  the "open now" badge always matches whatever the owner set. */
/** The status shown before the browser clock is known — i.e. in the
 *  prerendered HTML, which is the only version a non-JavaScript crawler ever
 *  reads. It states the opening hours rather than guessing open/closed,
 *  because a build-time "Lokað" would be frozen into the page for every
 *  search engine and AI assistant that quotes it. */
function staticStatus(hoursByDay: readonly DayHours[], t: ReturnType<typeof usePageText>) {
  const days = hoursByDay.filter((d) => !d.closed)
  const uniform =
    days.length === hoursByDay.length &&
    days.every((d) => d.open === days[0].open && d.close === days[0].close)
  return {
    open: false,
    label: uniform ? t.statusHours(fmtHMPad(days[0].open), fmtHMPad(days[0].close)) : t.statusHoursVaried,
    /* No clock yet, so there is no honest single word — the strip shows the
       hours themselves and the dot stays neutral. */
    word: uniform ? t.statusHours(fmtHMPad(days[0].open), fmtHMPad(days[0].close)) : t.statusHoursVaried,
    detail: uniform ? t.statusHours(fmtHMPad(days[0].open), fmtHMPad(days[0].close)) : t.statusHoursVaried,
  }
}

function openStatus(now: number, lang: Lang, hoursByDay: readonly DayHours[], exceptions: DateException[], t: ReturnType<typeof usePageText>) {
  const d = new Date(now)
  const hours = (date: Date) => exceptions.find(e => e.date === date.toISOString().slice(0, 10)) ?? hoursByDay[date.getUTCDay()]
  const today = hours(d)
  const mins = d.getUTCHours() * 60 + d.getUTCMinutes()
  /* `word` is what the sticky bar shows — one word, Opið or Lokað. `detail`
     is the hover/focus answer to the question that word provokes: the hours
     for the day it refers to, as a timetable. `label` is the long sentence,
     still used where there is room for it (the mobile menu footer). */
  const closedWord = t.statusWordClosed
  if (today.closed || today.open < 0 || today.close <= today.open) {
    const long = lang === 'is' ? 'Lokað í dag' : 'Closed today'
    return {open: false, label: long, word: closedWord, detail: t.statusClosedAllDay}
  }
  const todayHours = t.statusToday(fmtHMPad(today.open), fmtHMPad(today.close))
  if (mins >= today.open && mins < today.close) {
    return {open: true, label: t.statusOpen(fmtHM(today.close)), word: t.statusWordOpen, detail: todayHours}
  }
  if (mins < today.open) return {open: false, label: t.statusOpensToday(fmtHM(today.open)), word: closedWord, detail: todayHours}
  const tomorrow = hours(new Date(now + 86_400_000))
  const shut = tomorrow.closed || tomorrow.open < 0 || tomorrow.close <= tomorrow.open
  return {
    open: false,
    label: shut ? t.statusHoursVaried : t.statusOpensTomorrow(fmtHM(tomorrow.open)),
    word: closedWord,
    detail: shut ? t.statusHoursVaried : t.statusTomorrow(fmtHMPad(tomorrow.open), fmtHMPad(tomorrow.close)),
  }
}

const revealInit = (reduced: boolean, delay = 0) =>
  reduced
    ? {}
    : {
        opacity: 0,
        transform: 'translateY(26px)',
        transition: `opacity .95s ${EASE} ${delay}s, transform .95s ${EASE} ${delay}s`,
      }

/** A menu row with a dotted price leader. */
/* ────────────────────────────────────────────────────────────────────────
 * The filmstrip drifts on its own until someone touches it, then it is theirs.
 *
 * Native scroll-snap does the scrolling in both modes — this only calls
 * scrollTo, so the strip stays a real scroll container: no transform track to
 * fight, no cloned slides, no state to keep in sync, and a drag or a
 * trackpad swipe behaves exactly as it does today.
 *
 * WHAT COUNTS AS INTERACTION is genuine input — pointerdown, wheel,
 * touchstart, a key, focus landing inside — never the `scroll` event, which
 * our own scrollTo also fires and which would therefore stop the drift on its
 * first step. Interaction is final, not a pause: a strip that starts creeping
 * again while someone is reading it is worse than one that never moved.
 *
 * It also holds while off screen or on a hidden tab (an animation nobody can
 * see is only battery), and never starts at all under reduced motion.
 * ──────────────────────────────────────────────────────────────────────── */

const STRIP_DWELL = 3600

function useStripDrift(reduced: boolean) {
  const ref = useRef<HTMLDivElement>(null)
  /* `taken` is a ref, not state: nothing renders differently once the visitor
     takes over, and a re-render here would restart the timer it cancels. */
  const taken = useRef(false)
  const [live, setLive] = useState(false)

  /* visible + not hidden + not taken = drifting */
  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const io = new IntersectionObserver(
      ([e]) => setLive(e.isIntersecting && !taken.current),
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const stop = () => {
      taken.current = true
      setLive(false)
    }
    const opts = { passive: true } as AddEventListenerOptions
    el.addEventListener('pointerdown', stop, opts)
    el.addEventListener('touchstart', stop, opts)
    el.addEventListener('wheel', stop, opts)
    el.addEventListener('keydown', stop)
    el.addEventListener('focusin', stop)
    return () => {
      el.removeEventListener('pointerdown', stop)
      el.removeEventListener('touchstart', stop)
      el.removeEventListener('wheel', stop)
      el.removeEventListener('keydown', stop)
      el.removeEventListener('focusin', stop)
    }
  }, [reduced])

  useEffect(() => {
    if (!live || reduced) return
    const el = ref.current
    if (!el) return
    const tick = () => {
      if (taken.current || document.hidden) return
      /* The next frame whose left edge is past the current scroll position —
         asking the DOM rather than counting steps, so a resize, a lazy image
         that changed a frame's width, or a mid-drift nudge cannot desync it. */
      const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0
      const here = el.scrollLeft
      const end = el.scrollWidth - el.clientWidth
      if (here >= end - 2) {
        el.scrollTo({ left: 0, behavior: 'smooth' })
        return
      }
      const next = Array.from(el.children).find(
        (c) => (c as HTMLElement).offsetLeft - pad > here + 2,
      ) as HTMLElement | undefined
      el.scrollTo({ left: next ? next.offsetLeft - pad : end, behavior: 'smooth' })
    }
    const id = window.setInterval(tick, STRIP_DWELL)
    return () => window.clearInterval(id)
  }, [live, reduced])

  return ref
}

/* ────────────────────────────────────────────────────────────────────────
 * The two social glyphs. Inline, currentColor, drawn on the same 16px grid so
 * they sit at one optical weight beside 12px type — an icon font or an image
 * for two shapes would be two more requests and one more thing to cache.
 * ──────────────────────────────────────────────────────────────────────── */

function IgIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <rect x="1.9" y="1.9" width="12.2" height="12.2" rx="3.6" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="3.05" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="11.6" cy="4.4" r=".95" fill="currentColor" />
    </svg>
  )
}

function FbIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M9.6 14.2V8.9h1.9l.3-2.2H9.6V5.3c0-.64.18-1.08 1.1-1.08h1.17V2.25A15.6 15.6 0 0 0 10.16 2.1c-1.7 0-2.86 1.04-2.86 2.94v1.66H5.4v2.2h1.9v5.3Z"
        fill="currentColor"
      />
    </svg>
  )
}

function MenuRow({ item, lang }: { item: MenuItem; lang: Lang }) {
  return (
    <div className="rb-row" style={{ padding: '20px 0', borderBottom: `1px solid ${HAIR_SOFT}` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span className="rb-row-name" style={{ fontFamily: DISPLAY, fontSize: 'clamp(19px,1.9vw,24px)', color: IVORY, transition: `color .2s ${EASE}` }}>
          {item.name}
          {item.tag && (
            <span style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: GOLD_LIGHT, background: BURGUNDY, padding: '3px 8px', borderRadius: 4, marginLeft: 12, verticalAlign: 'middle' }}>
              {item.tag[lang]}
            </span>
          )}
        </span>
        <span className="rb-leader" aria-hidden="true" />
        <span style={{ fontSize: 16, fontWeight: 600, color: GOLD, whiteSpace: 'nowrap' }}>{item.price}</span>
      </div>
      {item.desc[lang] && <p style={{ fontSize: 14, lineHeight: 1.55, color: DIM, margin: '8px 0 0', maxWidth: '46ch' }}>{item.desc[lang]}</p>}
    </div>
  )
}

/** A photograph set among the menu rows — printed on the page, not boxed in a
 *  card. No border, no shadow, no padding: the photo bleeds to its column
 *  width and stops at a single hairline, the same rule every row below it
 *  stops at. That hairline is the page's one recurring device; the photos
 *  now use it instead of inventing a second one. `fill` lets a frame stretch
 *  to whatever height its row asks for (the bread photo does) rather than
 *  being capped at its own intrinsic aspect ratio and leaving air beneath. */
function MenuArtFrame({ art, lang, fill, style }: { art: MenuArt; lang: Lang; fill?: boolean; style?: CSSProperties }) {
  return (
    <figure className="rb-menu-art" style={{ margin: 0, display: 'flex', flexDirection: 'column', height: fill ? '100%' : undefined, ...style }}>
      <div style={{ overflow: 'hidden', borderRadius: 3, flex: fill ? '1 1 auto' : undefined, aspectRatio: fill ? undefined : `${art.w} / ${art.h}` }}>
        <img
          src={art.src}
          alt={art.cap[lang]}
          loading="lazy"
          decoding="async"
          width={art.w}
          height={art.h}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: art.pos, display: 'block' }}
        />
      </div>
      <figcaption style={{ display: 'flex', alignItems: 'baseline', gap: 4, padding: '16px 0 14px', borderBottom: `1px solid ${HAIR_SOFT}` }}>
        <span style={{ fontFamily: DISPLAY, fontStyle: 'italic', fontSize: 'clamp(15px,1.5vw,17px)', color: FAINT }}>{art.cap[lang]}</span>
        {art.price && (
          <>
            <span className="rb-leader" aria-hidden="true" />
            <span style={{ fontSize: 14, fontWeight: 600, color: GOLD, whiteSpace: 'nowrap' }}>{art.price}</span>
          </>
        )}
      </figcaption>
    </figure>
  )
}

/** One cake, two views, one caption — the pair that sits above the cake list.
 *
 *  Built on MenuArtFrame's rule rather than beside it: no card, no shadow, no
 *  padding, and the whole figure stops at the same hairline every price row
 *  below it stops at. The only thing added is the split: two images sharing a
 *  single caption, so they read as one product photographed twice instead of
 *  as two products.
 *
 *  The images keep their own aspect ratio and equal width, which is what makes
 *  the pair read as a pair. Under 640px the section is already one column, so
 *  the two frames stay side by side there too — halving a 5:4 frame still
 *  leaves a legible photograph, and stacking them would push the price list a
 *  full screen further down for no gain. */
function CakeArtPair({ art, lang, style }: { art: CakeArt; lang: Lang; style?: CSSProperties }) {
  return (
    <figure className="rb-menu-art" style={{ margin: 0, ...style }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${art.frames.length}, 1fr)`, gap: 10 }}>
        {art.frames.map((f) => (
          <div key={f.src} style={{ overflow: 'hidden', borderRadius: 3, aspectRatio: `${f.w} / ${f.h}` }}>
            <img
              src={f.src}
              alt={f.alt[lang]}
              loading="lazy"
              decoding="async"
              width={f.w}
              height={f.h}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: f.pos, display: 'block' }}
            />
          </div>
        ))}
      </div>
      <figcaption style={{ display: 'flex', alignItems: 'baseline', gap: 4, padding: '16px 0 14px', borderBottom: `1px solid ${HAIR_SOFT}` }}>
        <span style={{ fontFamily: DISPLAY, fontStyle: 'italic', fontSize: 'clamp(15px,1.5vw,17px)', color: FAINT }}>{art.cap[lang]}</span>
        {art.price && (
          <>
            <span className="rb-leader" aria-hidden="true" />
            <span style={{ fontSize: 14, fontWeight: 600, color: GOLD, whiteSpace: 'nowrap' }}>{art.price}</span>
          </>
        )}
      </figcaption>
    </figure>
  )
}

/** One beat of the story: a black-and-white frame beside its paragraph, with
 *  a burgundy rule marking the text. `flip` mirrors the pair so the two
 *  chapters alternate sides and the eye crosses the page. The paragraph is
 *  vertically centred against the photograph rather than top-aligned, because
 *  the two frames have very different heights (one portrait, one landscape). */
function StoryChapter({ art, text, reduced, flip }: { art: { src: string; w: number; h: number }; text: string; reduced: boolean; flip?: boolean }) {
  return (
    <div
      data-reveal
      className="rb-story-chapter"
      style={{
        ...revealInit(reduced, 0.08),
        display: 'grid',
        /* The photo track is capped rather than fluid: one source is portrait
           (1335×2000) and at a full fr it would render nearly 1000px tall and
           swallow the chapter. The text track is sized to its own measure so
           the paragraph doesn't float in a column twice its width. */
        gridTemplateColumns: flip
          ? 'minmax(280px,420px) minmax(0,480px)'
          : 'minmax(0,480px) minmax(280px,420px)',
        gap: 'clamp(28px,5vw,72px)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img
        src={art.src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        width={art.w}
        height={art.h}
        style={{ gridColumn: flip ? 2 : 1, gridRow: 1, width: '100%', height: 'auto', display: 'block', borderRadius: 3 }}
      />
      <p
        style={{
          gridColumn: flip ? 1 : 2,
          gridRow: 1,
          margin: 0,
          borderLeft: `2px solid ${BURGUNDY}`,
          paddingLeft: 'clamp(18px,2.4vw,32px)',
          fontSize: 'clamp(17px,1.9vw,21px)',
          lineHeight: 1.72,
          color: 'rgba(243,234,211,.86)',
        }}
      >
        {text}
      </p>
    </div>
  )
}

/** One gallery photo: hover reveals a gold caption over a dark scrim; click opens the lightbox. */
function GalleryTile({ photo, lang, onOpen, style }: { photo: GalleryPhoto; lang: Lang; onOpen: () => void; style?: CSSProperties }) {
  return (
    <button type="button" className="rb-gallery-item" data-reveal style={style} onClick={onOpen} aria-label={photo.caption[lang]}>
      {/* Tiles render around 380px wide, so let the browser take the 800px
          variant here and keep the 2000px file for the lightbox. */}
      <img
        src={photo.srcSm}
        srcSet={`${photo.srcSm} 800w, ${photo.src} 2000w`}
        /* The tile is 31vw only until the 1180px container caps it at 384px
           (1180 minus two 14px gaps, over three columns). Saying "31vw" past
           that point overstates the slot, and on a 2× screen the browser then
           reaches past the 800px file for the 2000px one — which is exactly
           the download the small variant exists to avoid. */
        sizes="(max-width:480px) 92vw, (max-width:820px) 46vw, (max-width:1239px) 31vw, 384px"
        alt={photo.caption[lang]}
        loading="lazy"
        decoding="async"
        style={{ aspectRatio: `${photo.w} / ${photo.h}` }}
      />
      {/* No caption overlay on hover. These read as stray explanatory labels
          floating over the photographs in a filmstrip, and the caption is
          already shown properly in the lightbox on click. The button keeps
          its aria-label, so nothing is lost for screen readers. */}
    </button>
  )
}

/** The real reviews, auto-rotating with a soft crossfade. Pauses on
 *  hover/focus and under prefers-reduced-motion; dots give manual control. */
function TestimonialRotator({ lang, reduced, reviews }: { lang: Lang; reduced: boolean; reviews: Review[] }) {
  /* EVERY REVIEW IS IN THE PAGE, all the time.
   *
   * The rotator used to render one quote and swap it, so the prerendered HTML
   * — the only version a search crawler or an AI assistant ever reads — held a
   * single review out of ten. Now all of them are rendered as a list of real
   * <figure>s, stacked in one grid cell, and the sequence only decides which
   * one is visible. A crawler reads ten attributed quotes; a visitor sees one
   * at a time, in turn, as before.
   *
   * Stacking in one cell also sizes the stage to the LONGEST review, so a
   * one-line quote following a paragraph no longer yanks the page up by 150px
   * every six seconds. Shorter ones sit centred in that space. */
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [manualPause, setManualPause] = useState(false)

  useEffect(() => {
    if (reduced || paused || manualPause || reviews.length <= 1) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % reviews.length), 6500)
    return () => window.clearInterval(id)
  }, [reduced, paused, manualPause, reviews])

  useEffect(() => {
    if (index >= reviews.length) setIndex(0)
  }, [reviews, index])

  if (!reviews.length) return null
  const active = Math.min(index, reviews.length - 1)

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <ul className="rb-testi-stack" aria-label={lang === 'en' ? 'Reviews' : 'Umsagnir'}>
        {reviews.map((r, i) => (
          /* Inactive quotes are hidden with visibility, not removed: still in
             the HTML for crawlers, out of the accessibility tree and the tab
             order for people, who step through with the dots instead. */
          <li key={`${r.who}-${i}`} className="rb-testi-item" data-active={i === active || undefined} aria-hidden={i === active ? undefined : true}>
            <figure style={{ margin: 0 }}>
              <blockquote
                style={{ margin: '0 auto', maxWidth: '38ch', fontFamily: DISPLAY, fontWeight: 400, fontSize: r.quote[lang].length > 140 ? 'clamp(21px,2.6vw,32px)' : 'clamp(26px,3.6vw,46px)', lineHeight: 1.28, color: IVORY }}
              >
                “{r.quote[lang]}”
              </blockquote>
              <figcaption style={{ fontSize: 14, color: FAINT, marginTop: 16 }}>{r.who}</figcaption>
            </figure>
          </li>
        ))}
      </ul>

      {reviews.length > 1 && <button type="button" aria-pressed={manualPause} onClick={() => setManualPause(value => !value)} style={{background: 'transparent', color: IVORY, border: `1px solid ${HAIR}`, padding: '10px 16px', marginTop: 16, minHeight: 44}}>{manualPause ? (lang === 'is' ? 'Halda áfram' : 'Resume reviews') : (lang === 'is' ? 'Stöðva umsagnir' : 'Pause reviews')}</button>}
      {reviews.length > 1 && (
        <div role="group" aria-label={lang === 'en' ? 'Choose a review' : 'Veldu umsögn'} style={{ display: 'flex', flexWrap: 'wrap', gap: 0, justifyContent: 'center', marginTop: 4 }}>
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-pressed={i === active}
              aria-label={`${lang === 'en' ? 'Review' : 'Umsögn'} ${i + 1} ${lang === 'en' ? 'of' : 'af'} ${reviews.length}`}
              data-active={i === active}
              className="rb-testi-dot"
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ReynirPageInner() {
  const {FEATURE_IMG, PRODUCT_IMG, PRODUCT_POS, SHOP_IMG, MENU_ART, CAKE_ART, STORY_ART} = useSiteArt()
  // English on a first visit, but shared with the order route so a visitor
  // reading in Icelandic does not land back in English after ordering.
  const [lang, setLang] = useLang()
  /* Every internal link, in the language of the URL we are on: from /en the
     nav must lead to /en/panta, not back into Icelandic. */
  const P = pathsFor(lang)
  const t = usePageText(lang)
  const ot = useOrderText(lang)
  const {
    images, dateExceptions, LINKS, HOURS_BY_DAY, FEATURE, MENU, BREAD, CAKES, GALLERY, REVIEWS,
    hoursRows, mainName, trustLine, notice,
    heroTitle, heroSub, heroLine, statementQuote, statementWho, storyP1, storyP2,
  } = useSiteContent()
  // The left menu column opens with a landscape frame, the right one closes
  // with a square frame — one extra row on the left keeps the feet level.
  const menuSplit = Math.min(MENU.length, Math.ceil(MENU.length / 2) + 1)
  const rootRef = useRef<HTMLDivElement>(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const on = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  /* the filmstrip drifts until someone takes hold of it */
  const stripRef = useStripDrift(reduced)
  /* the map band loads Google only when asked — see the band's comment */
  const [mapLive, setMapLive] = useState(false)

  /* null until mounted, so the server render and the browser's first render
     are identical and hydration is clean. Reading the clock during render
     would bake the build machine's minute into the shipped HTML. */
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const id = window.setInterval(() => setNow(Date.now()), 30000)
    return () => window.clearInterval(id)
  }, [])
  /* Client-only, like the open/closed badge: both depend on today's date,
     which the prerendered HTML cannot know. */
  const noticeLive = now !== null && noticeIsActive(notice, now)
  const soonExceptions = now === null ? [] : upcomingExceptions(dateExceptions, now)
  const status = useMemo(
    () => (now === null ? staticStatus(HOURS_BY_DAY, t) : openStatus(now, lang, HOURS_BY_DAY, dateExceptions, t)),
    [now, lang, HOURS_BY_DAY, dateExceptions, t],
  )

  useEffect(() => {
    setThemeColor(INK)
  }, [])

  /* Intro loader: the gold script writes itself on, as if piped.
   *
   * ONCE PER SESSION, not once per mount. The order page, the legal page and
   * the story page are all real routes, so coming back to the landing page
   * remounts this component — and the curtain was replaying every time, which
   * turns a brand moment into a toll gate on ordinary navigation.
   *
   * sessionStorage rather than localStorage on purpose: it survives navigation
   * within a visit, which is the bug, but a genuinely new visit tomorrow still
   * gets the intro. localStorage would mean a returning customer never sees it
   * again, which throws the moment away to fix a much smaller problem.
   *
   * Wrapped in try/catch because sessionStorage throws outright in some
   * privacy modes; the intro is decorative, so on failure it simply plays. */
  /* Starts false so the server-rendered HTML and the browser's first render
     agree — deciding this during render read sessionStorage, which the server
     has no version of, and that single mismatch made React throw away the
     whole prerendered tree and rebuild it client-side (error #418/#422).
     The decision moves into a LAYOUT effect, which runs after mount but
     before the browser paints, so the curtain still covers the first frame
     the visitor actually sees. */
  const [intro, setIntro] = useState(false)
  /* THE HANDOVER. The hero's entrance used to run on mount, which meant it
     finished at ~1.3s — behind a curtain that only started lifting at 1.55s.
     By the time anyone saw the page it had already arrived, so the loader felt
     like a door onto a static picture.
     'playing' pauses those entrance animations at frame 0 (exact, because they
     fill `both`); 'gone' releases them, timed to the first frame of the ink
     dissolving, so the cover rises THROUGH the curtain rather than after it.
     'none' is the no-intro path — a returning visitor, reduced motion, or the
     prerendered first frame — where nothing is ever held. */
  const [curtain, setCurtain] = useState<'none' | 'playing' | 'gone'>('none')
  useIsomorphicLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let show = true
    try {
      show = window.sessionStorage.getItem('rb-intro-seen') !== '1'
    } catch {
      /* private mode: the intro is decorative, so on failure it simply plays */
    }
    if (show) {
      setIntro(true)
      setCurtain('playing')
    }
  }, [])
  useEffect(() => {
    if (!intro) return
    /* 1500ms: the ink's own fade-out starts at 1.55s, and starting the page a
       breath earlier is what makes the two read as one movement instead of a
       handoff. 2150 unmounts the curtain, which is when its fade has finished. */
    const release = window.setTimeout(() => setCurtain('gone'), 1500)
    const id = window.setTimeout(() => setIntro(false), 2150)
    return () => {
      window.clearTimeout(release)
      window.clearTimeout(id)
    }
  }, [intro])
  /* Click-to-skip has to release the hero too, or a visitor who taps the
     curtain away gets a page frozen at frame 0 of its own entrance. */
  const dismissIntro = () => {
    setIntro(false)
    setCurtain('gone')
  }
  // Marked as seen as soon as it has played or been dismissed, so a click-to-
  // skip counts too and the curtain does not return on the next route change.
  /* ── mobile menu ──────────────────────────────────────────────────────
     Deterministic false on first render, so the prerendered HTML and the
     browser agree. */
  const [menu, setMenu] = useState(false)

  /* Anchor links inside the panel cannot rely on the browser's own jump: at
     the instant of the click the body is still overflow:hidden for the scroll
     lock, so the native scroll is discarded, and a plain hash change is not
     something React Router reports — so nothing scrolled and the section was
     simply never reached. The target is remembered here and scrolled to after
     the panel has closed and the lock has been released. */
  const pendingHash = useRef<string | null>(null)
  useEffect(() => {
    if (menu) return
    const target = pendingHash.current
    if (!target) return
    pendingHash.current = null
    const el = document.querySelector(target)
    if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }, [menu, reduced])

  useEffect(() => {
    if (!menu) return
    /* The panel is fixed and covers the page, so the page behind it must not
       scroll. overflow:hidden alone does NOT lock iOS Safari — the page kept
       scrolling under a finger, and on close the browser could land on a
       different scroll position, which read as the whole layout having
       changed. The reliable lock is to fix the body at its current offset;
       the -top preserves what is on screen, and close restores the exact
       scroll position with an instant jump (html has scroll-behavior:smooth,
       which would otherwise animate the restore). */
    const y = window.scrollY
    const b = document.body.style
    const prev = { position: b.position, top: b.top, left: b.left, right: b.right, width: b.width, overflow: b.overflow }
    b.position = 'fixed'
    b.top = `-${y}px`
    b.left = '0'
    b.right = '0'
    b.width = '100%'
    b.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false) }
    window.addEventListener('keydown', onKey)
    /* Rotating a phone to landscape can cross the breakpoint that hides the
       button, which would strand the panel open with no way to shut it. */
    const mq = window.matchMedia('(min-width:821px)')
    const onWide = (e: MediaQueryListEvent) => { if (e.matches) setMenu(false) }
    mq.addEventListener('change', onWide)
    return () => {
      b.position = prev.position
      b.top = prev.top
      b.left = prev.left
      b.right = prev.right
      b.width = prev.width
      b.overflow = prev.overflow
      window.scrollTo({ top: y, left: 0, behavior: 'instant' })
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onWide)
    }
  }, [menu])

  const introDecided = useRef(false)
  useEffect(() => {
    if (intro) { introDecided.current = true; return }
    /* Skip the first pass: intro is false before the layout effect has ruled,
       and writing the flag then would mark the curtain seen before it plays. */
    if (!introDecided.current) { introDecided.current = true; return }
    try { window.sessionStorage.setItem('rb-intro-seen', '1') } catch { /* private mode */ }
  }, [intro])

  useEffect(() => {
    if (reduced) return
    const root = rootRef.current
    if (!root || !('IntersectionObserver' in window)) return

    /* Sets the inline pair the old reveal always set, AND flips a data flag
     * so CSS can carry motion the inline style cannot express — a mask wipe
     * on a heading, a stagger across children. The flag is what the richer
     * animations key off; the inline pair stays because every existing
     * data-reveal block still relies on it. */
    const reveal = (el: HTMLElement) => {
      el.style.opacity = '1'
      el.style.transform = 'none'
      el.setAttribute('data-shown', 'true')
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            reveal(e.target as HTMLElement)
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
    )
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
    els.forEach((el) => io.observe(el))

    // Safety net: a backgrounded tab (opened in a background tab, some in-app
    // browsers) pauses IntersectionObserver delivery, which can leave already
    // scrolled-past content stuck at opacity:0. Catch it up shortly after
    // mount and whenever the tab becomes visible again.
    const catchUp = () => {
      els.forEach((el) => {
        if (el.style.opacity === '1') return
        if (el.getBoundingClientRect().top < window.innerHeight) {
          reveal(el)
          io.unobserve(el)
        }
      })
    }
    const onVisible = () => {
      if (document.visibilityState === 'visible') catchUp()
    }
    const timeoutId = window.setTimeout(catchUp, 2500)
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      io.disconnect()
      window.clearTimeout(timeoutId)
      document.removeEventListener('visibilitychange', onVisible)
    }
    // Re-run when the CMS content lands. The page first renders the bundled
    // photos, then swaps in the Sanity ones — which REPLACES every gallery
    // tile with a new element (the React key is the image src). Those new
    // nodes were never observed, so without this dependency they keep the
    // opacity:0 that revealInit gave them and the whole gallery stays blank.
  }, [reduced, lang, GALLERY])


  // Gallery lightbox: null when closed, otherwise the open photo's index.
  const [lightbox, setLightbox] = useState<number | null>(null)
  const modalRef = useModalFocus(lightbox !== null && !!GALLERY[lightbox])
  useEffect(() => { if (lightbox !== null && !GALLERY[lightbox]) setLightbox(null) }, [lightbox, GALLERY])

  // The sticky bar appears once the cover has scrolled out of view. Watching
  // the cover with an observer rather than polling scrollY keeps this off the

  const closeLightbox = () => setLightbox(null)
  const stepLightbox = (dir: 1 | -1) => setLightbox((i) => (i === null ? i : (i + dir + GALLERY.length) % GALLERY.length))

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') stepLightbox(1)
      if (e.key === 'ArrowLeft') stepLightbox(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
    }
  }, [lightbox])

  const sectionPad = 'clamp(80px,11vh,140px) clamp(20px,4.5vw,72px)'
  const wrap = { maxWidth: 1180, margin: '0 auto' } as const

  return (
    <div
      ref={rootRef}
      className="rb-page"
      data-curtain={curtain}
      lang={lang}
      style={{ fontFamily: BODY, color: IVORY, background: INK, overflowX: 'clip', WebkitFontSmoothing: 'antialiased' }}
    >
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />

      <a className="rb-skip" href="#reynir-content">{lang === 'is' ? 'Fara í efni' : 'Skip to content'}</a>
      {intro && (
        <div className="rb-intro" onClick={dismissIntro} aria-hidden="true">
          <div className="rb-intro-logo">
            <img className="rb-intro-draw" src={LOGO} alt="" decoding="async" width={1200} height={519} />
            <span className="rb-intro-tip" />
          </div>
        </div>
      )}

      {/* ===================== STICKY BAR =====================
          Not a second navigation so much as a permanent way back to the two
          things people came for: what's on, and how to order it. Hidden while
          the cover is on screen so the hero keeps its full first impression. */}
      
      <div className="rb-awning" id="top" aria-hidden="true" />
      <div className="rb-stickybar">
        <a href="#top" className="rb-sticky-logo" aria-label="Reynir bakari" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={LOGO} alt="" width={132} height={57} decoding="async" style={{ width: 96, height: 'auto', display: 'block' }} />
        </a>
        {/* FOUR destinations, not five. "Úr ofninum" and "Brauð" read as two
            menus when they are one chapter of the same counter, so Brauð comes
            out of the bar and stays a heading inside it — and out of the drawer
            too, because a drawer that lists more than the bar is its own kind
            of confusion. What is left is the three questions a bakery gets
            asked, plus the pictures. */}
        <nav className="rb-sticky-nav">
          <a href="#menu" className="rb-navlink">{t.navMenu}</a>
          {GALLERY.length > 0 && <a href="#gallery" className="rb-navlink">{t.navGallery}</a>}
          <Link to={P.story} className="rb-navlink">{t.navStory}</Link>
          <a href="#visit" className="rb-navlink">{t.navVisit}</a>
        </nav>
        {/* The right-hand side was four unrelated things sitting at four
            different weights next to a gold button. They are now one small
            utility cluster — state, social, language — hairline-separated from
            the one thing that is an action. */}
        <div className="rb-bar-right">
          <div className="rb-bar-util">
          {/* The open/closed status follows you down the page — for a bakery
              that shuts at 17:00 this is the single most asked question. It is
              a dot and one word, not a sentence: the full sentence ran 200px
              wide next to the order button and read like a notice. The hours
              are the hover/focus detail, and because a tooltip is no use on a
              phone the whole thing is a link to the printed hours in Heimsækja
              — which also gives it real keyboard focus rather than a tabindex
              on a span. */}
          <a
            href="#visit"
            className="rb-status"
            data-open={status.open}
            aria-label={`${status.word} — ${status.detail}`}
          >
            <span className="rb-sticky-dot" style={{ background: status.open ? GOLD : 'rgba(243,234,211,.4)' }} />
            <span className="rb-sticky-status" aria-hidden="true">{status.word}</span>
            <span className="rb-status-tip" aria-hidden="true">{status.detail}</span>
          </a>
            <span className="rb-bar-sep" aria-hidden="true" />
            <a className="rb-social" href={LINKS.instagram} target="_blank" rel="noreferrer" aria-label={`Instagram — Reynir bakari (${t.extNote})`}>
              <IgIcon />
            </a>
            <a className="rb-social" href={LINKS.facebook} target="_blank" rel="noreferrer" aria-label={`Facebook — Reynir bakari (${t.extNote})`}>
              <FbIcon />
            </a>
            <span className="rb-bar-sep rb-bar-sep-lang" aria-hidden="true" />
            <div className="rb-bar-lang" role="group" aria-label="Language" style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <button className="rb-lang" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
              <span aria-hidden="true" style={{ color: FAINT }}>/</span>
              <button className="rb-lang" aria-pressed={lang === 'is'} onClick={() => setLang('is')}>ÍS</button>
            </div>
          </div>
          <Link to={P.order} className="rb-sticky-cta">{ot.navOrder}</Link>
          <button
            type="button"
            className="rb-burger rb-burger-bar"
            aria-expanded={menu}
            aria-controls="rb-mobile-menu"
            aria-label={lang === 'is' ? 'Valmynd' : 'Menu'}
            onClick={() => setMenu((v) => !v)}
          >
            <span className="rb-burger-line" aria-hidden="true" />
            <span className="rb-burger-line" aria-hidden="true" />
            <span className="rb-burger-line" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ===================== MOBILE MENU =====================
          The six destinations as a printed list. Panta is not in the list: it
          is the one thing someone opens this menu to do, so it sits at the
          bottom as the only filled button, where a thumb already is. */}
      <div className="rb-menu" id="rb-mobile-menu" data-open={menu} aria-hidden={!menu}>
        <div className="rb-menu-top">
          <img src={LOGO} alt="" width={132} height={57} decoding="async" style={{ width: 104, height: 'auto', display: 'block' }} />
          <button
            type="button"
            className="rb-burger rb-burger-close"
            aria-expanded={menu}
            aria-controls="rb-mobile-menu"
            aria-label={lang === 'is' ? 'Loka valmynd' : 'Close menu'}
            onClick={() => setMenu(false)}
          >
            <span className="rb-burger-line" aria-hidden="true" />
            <span className="rb-burger-line" aria-hidden="true" />
            <span className="rb-burger-line" aria-hidden="true" />
          </button>
        </div>

        <nav className="rb-menu-nav" aria-label={lang === 'is' ? 'Valmynd' : 'Menu'}>
          {[
            { href: '#menu', label: t.navMenu },
            ...(GALLERY.length > 0 ? [{ href: '#gallery', label: t.navGallery }] : []),
            { to: P.story, label: t.navStory },
            { href: '#visit', label: t.navVisit },
          ].map((item, i) => {
            const inner = (
              <>
                <span className="rb-menu-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                {item.label}
              </>
            )
            const style = { ...GOLD_TEXT, ...LETTERPRESS } as CSSProperties
            return item.to ? (
              <Link key={item.label} to={item.to} className="rb-menu-link" style={style} onClick={() => setMenu(false)} tabIndex={menu ? 0 : -1}>
                {inner}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="rb-menu-link"
                style={style}
                onClick={(e) => {
                  e.preventDefault()
                  pendingHash.current = item.href!
                  setMenu(false)
                }}
                tabIndex={menu ? 0 : -1}
              >
                {inner}
              </a>
            )
          })}
        </nav>

        <div className="rb-menu-foot">
          <div className="rb-menu-footrow">
            <span className="rb-menu-status" style={{ color: status.open ? GOLD_LIGHT : FAINT }}>
              <span className="rb-sticky-dot" style={{ background: status.open ? GOLD : 'rgba(243,234,211,.4)' }} />
              {status.label}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* the pair the bar hides on a phone — full 44px targets here */}
              <a
                className="rb-social rb-social-menu"
                href={LINKS.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label={`Instagram — Reynir bakari (${t.extNote})`}
                tabIndex={menu ? 0 : -1}
              >
                <IgIcon />
              </a>
              <a
                className="rb-social rb-social-menu"
                href={LINKS.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label={`Facebook — Reynir bakari (${t.extNote})`}
                tabIndex={menu ? 0 : -1}
              >
                <FbIcon />
              </a>
              <div role="group" aria-label="Language" style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <button className="rb-lang" aria-pressed={lang === 'en'} onClick={() => setLang('en')} tabIndex={menu ? 0 : -1}>EN</button>
                <span aria-hidden="true" style={{ color: FAINT }}>/</span>
                <button className="rb-lang" aria-pressed={lang === 'is'} onClick={() => setLang('is')} tabIndex={menu ? 0 : -1}>ÍS</button>
              </div>
            </div>
          </div>
          <Link to={P.order} className="rb-menu-cta" onClick={() => setMenu(false)} tabIndex={menu ? 0 : -1}>
            {ot.navOrder}
          </Link>
        </div>
      </div>


      {/* ===================== COVER ===================== */}
      <main id="reynir-content" tabIndex={-1}>
      <section className="rb-cover" style={{ position: 'relative', display: 'flex', flexDirection: 'column', padding: '0 clamp(20px,4.5vw,72px)' }}>
        <div className="rb-cover-grid" style={{ ...wrap, flex: 1, width: '100%', display: 'grid', gridTemplateColumns: '1fr', alignItems: 'center', position: 'relative', padding: 'clamp(24px,5vh,56px) 0' }}>
          {/* the pistachio snúður, a transparent cutout floating on the dark hero,
              turning slowly and smoothly in place */}
          <div className="rb-cover-art rb-enter-3">
            <img
              className="rb-hero-spin"
              src={FEATURE_IMG}
              alt={images.hero?.caption[lang] ?? (lang === 'en' ? 'A Reynir pistachio snúður, glazed and topped with pistachios' : 'Pistasíusnúður frá Reyni, gljáður og toppaður með pistasíum')}
              width={1004}
              height={1100}
              decoding="async"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          <div className="rb-cover-copy" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: 640, position: 'relative', zIndex: 2 }}>
            <div className="rb-cover-meta rb-enter" style={{ display: 'flex', gap: 18, alignItems: 'center', fontSize: 12.5, letterSpacing: '.14em', textTransform: 'uppercase', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: GOLD }}>
                <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: status.open ? '#8FA876' : GOLD }} />
                {status.label}
              </span>
              {noticeLive && notice && <span style={{ color: IVORY }}>{notice.text[lang]}</span>}
            </div>

            <h1 className="rb-enter-2" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(46px, 9.5vw, 134px)', lineHeight: 0.98, letterSpacing: '.02em', margin: 'clamp(16px,3vh,30px) 0 0', ...GOLD_TEXT, ...LETTERPRESS }}>
              {heroTitle[lang]}
            </h1>

            <p className="rb-enter-3" style={{ fontStyle: 'italic', fontSize: 'clamp(17px,1.9vw,23px)', color: IVORY, margin: 'clamp(16px,2.5vh,24px) 0 0', lineHeight: 1.5, maxWidth: '30ch' }}>
              {heroSub[lang]}
            </p>
            <p className="rb-enter-3" style={{ fontSize: 'clamp(14.5px,1.2vw,16px)', color: DIM, margin: '12px 0 0', maxWidth: '40ch', lineHeight: 1.6 }}>
              {heroLine[lang]}
            </p>

            {/* The hero used to offer "Panta heim" in gold, which left the
                site for aha.is, while the header's "Panta" opened the bakery's
                own cake order. One verb, two errands, and the gold one was the
                one that pays a commission. So: the bakery's own order flow is
                the gold button, the delivery app is an outlined button that
                says where it goes and marks itself as leaving, and a line
                under them states which is which. */}
            <div className="rb-cover-ctas rb-enter-4" style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 'clamp(24px,3.5vh,36px)' }}>
              {/* Þorleifur, 2026-09-21: the cover carries the two delivery
                  apps; ordering ahead lives under "Pantanir" in the bar and in
                  its own block further down. aha.is leads because it is the
                  bakery's primary delivery partner. */}
              <a href={LINKS.order} target="_blank" rel="noreferrer" className="rb-cta rb-cta-gold rb-cta-ext">
                {t.ctaDelivery}
                <span aria-hidden="true">↗</span>
                <span className="rb-sr">({t.extNote})</span>
              </a>
              <a href={LINKS.wolt} target="_blank" rel="noreferrer" className="rb-cta rb-cta-ghost rb-cta-ext">
                {t.ctaWolt}
                <span aria-hidden="true">↗</span>
                <span className="rb-sr">({t.extNote})</span>
              </a>
            </div>
            <p className="rb-enter-4" style={{ fontSize: 13.5, color: DIM, margin: '14px 0 0', maxWidth: '42ch', lineHeight: 1.55 }}>
              {t.ctaPathsNote}
            </p>
          </div>
        </div>

        {/* No band under the hero any more. Three things sat here over time —
            a marquee of product nouns, a rail of facts, then a black-and-white
            craft frame — and Sindri's verdict on the last one was that it did
            not belong: a strip of a different photograph wedged between the
            hero and the menu, which the hero's own cutout kept colliding with.
            The hero ends on its own dark ground and the menu opens on its
            hairline. The frame stays in the gallery, where it belongs. */}

      </section>

      {/* ===================== THE MENU ===================== */}
      <section id="menu" style={{ background: INK, borderTop: `1px solid ${HAIR_SOFT}`, padding: sectionPad }}>
        <div style={wrap}>
          {/* Centred, and the rule above the kicker is gone.
              The hairline survives where it does WORK — separating the menu
              rows below, closing a photo frame — but above a heading it was
              only decoration, and a rule plus a left edge plus a masthead is
              three devices doing one job. A full-bleed section intro is
              centred; a header that heads a COLUMN (bread, cakes, visit)
              stays left-aligned with its column. That is the rule, so the
              page reads as a system rather than as two moods. */}
          <div className="rb-sec-intro rb-wipe rb-stagger" data-reveal style={revealInit(reduced)}>
            <div className="rb-sec-kicker">{t.menuMasthead}</div>
            <PipedTitle align="center" style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(34px,4.6vw,62px)', lineHeight: 1.03, margin: '18px 0 0', ...GOLD_TEXT, ...LETTERPRESS }}>{t.ovenTitle}</PipedTitle>
            <p className="rb-sec-lede" style={{ fontSize: 16, color: DIM, margin: '16px auto 0', maxWidth: '52ch', lineHeight: 1.65 }}>{t.ovenIntro}</p>
          </div>

          {/* featured item — the signature pistachio snúður, shown as a rich
              torn-open product photo in a sleek gold frame. */}
          <div
            data-reveal
            className="rb-feature"
            style={{
              ...revealInit(reduced, 0.1),
              marginTop: 'clamp(40px,6vh,68px)',
              borderTop: `1px solid ${HAIR_SOFT}`,
              borderBottom: `1px solid ${HAIR_SOFT}`,
              padding: 'clamp(32px,5vh,52px) 0',
              display: 'grid',
              gridTemplateColumns: '1fr 0.85fr',
              gap: 'clamp(24px,4vw,64px)',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD }}>{t.featuredLabel}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, flexWrap: 'wrap', marginTop: 14 }}>
                <h3 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(34px,5vw,64px)', margin: 0, ...GOLD_TEXT, ...LETTERPRESS }}>{FEATURE.name}</h3>
                <span style={{ fontSize: 22, fontWeight: 600, color: GOLD }}>{FEATURE.price}</span>
              </div>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: DIM, margin: '16px 0 0', maxWidth: '46ch' }}>{FEATURE.desc[lang]}</p>
            </div>
            <div className="rb-feature-art" style={{ display: 'flex', justifyContent: 'center' }}>
              {/* sleek framed product photo: gold hairline, thin mat, concentric
                  radii, and a soft shadow to lift it off the dark ground */}
              <figure
                className="rb-frame"
                style={{
                  margin: 0,
                  width: 'min(100%, 420px)',
                  borderRadius: 16,
                  padding: 6,
                  border: `1px solid rgba(238,211,170,.22)`,
                  background: 'linear-gradient(160deg, rgba(243,234,211,.06), rgba(243,234,211,.02))',
                  boxShadow: '0 34px 70px -24px rgba(0,0,0,.75), inset 0 1px 0 rgba(255,255,255,.06)',
                }}
              >
                <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '1 / 1' }}>
                  <img
                    src={PRODUCT_IMG}
                    alt={images.featured?.caption[lang] ?? (lang === 'en' ? 'A Reynir pistachio snúður torn open, gooey pistachio glaze stretching between the halves' : 'Pistasíusnúður frá Reyni rifinn í sundur, pistasíugljái teygist á milli helminganna')}
                    loading="lazy"
                    decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: PRODUCT_POS, display: 'block' }}
                  />
                  {/* the same small tag-pill already used on Kanillengja in the
                      menu (not a new device) marks this as the signature item —
                      quiet on the photo, not a banner across it. */}
                  <span
                    style={{
                      position: 'absolute', top: 14, left: 14,
                      fontFamily: BODY, fontSize: 10.5, fontWeight: 700, letterSpacing: '.1em',
                      textTransform: 'uppercase', color: GOLD_LIGHT, background: BURGUNDY,
                      padding: '4px 9px', borderRadius: 4,
                      boxShadow: '0 6px 16px -6px rgba(0,0,0,.6)',
                    }}
                  >
                    {t.featuredLabel}
                  </span>
                </div>
              </figure>
            </div>
          </div>

          {/* The menu, as an editorial list with dotted price leaders — with
              their own photography set diagonally among the rows like plates
              on a menu spread: the lengjur trays open the left column, the
              pastry pile closes the right. The left column takes one extra row
              because a landscape frame is shorter than a square one. */}
          <div className="rb-menu-cols" data-reveal style={{ ...revealInit(reduced, 0.12), display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 'clamp(40px,6vw,88px)', rowGap: 0, marginTop: 'clamp(36px,5vh,56px)' }}>
            <div style={{ display: 'grid', alignContent: 'start' }}>
              <MenuArtFrame art={MENU_ART.lengjur} lang={lang} style={{ marginBottom: 14 }} />
              {MENU.slice(0, menuSplit).map((item) => (
                <MenuRow key={item.name} item={item} lang={lang} />
              ))}
            </div>
            <div style={{ display: 'grid', alignContent: 'start' }}>
              {MENU.slice(menuSplit).map((item) => (
                <MenuRow key={item.name} item={item} lang={lang} />
              ))}
              <MenuArtFrame art={MENU_ART.bordid} lang={lang} style={{ marginTop: 26 }} />
            </div>
          </div>
        </div>
      </section>

      {/* ===================== THE STORY (photo essay) =====================
          The bakery's own history, told on its own photographs. This replaces
          two sections that used to fight each other: a full-bleed photo that
          hard-cut into a flat burgundy slab, with the actual story — a family
          business since 1994, the founder's death in 2019, the two sons who
          took over his ovens — set as plain text on colour while seventeen
          beautiful black-and-white craft frames sat unused in a grid further
          down. The photographs now carry the story instead of decorating it.

          Burgundy survives as an accent (the rule beside each chapter, the
          scrim's warm floor) rather than as a flat plane, which is what made
          the seam so hard in the first place. */}
      <section id="story" style={{ background: INK_DEEP }}>
        {/* the opening plate: the quote laid over the oven's glow. The scrim
            resolves to INK_DEEP at the bottom edge so the photograph hands
            off to the section below it instead of butting against it. */}
        <div className="rb-story-open" style={{ position: 'relative', height: 'clamp(380px,72vh,760px)', overflow: 'hidden' }}>
          <img
            src={STORY_ART.open.src}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            width={STORY_ART.open.w}
            height={STORY_ART.open.h}
            className="rb-story-img"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: STORY_ART.open.pos }}
          />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(0deg, ${INK_DEEP} 0%, rgba(11,10,9,.78) 22%, rgba(92,28,31,.28) 62%, rgba(11,10,9,.45) 100%)` }} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 'clamp(28px,5vw,72px)' }}>
            <div style={{ maxWidth: 1180, margin: '0 auto' }}>
              <div data-reveal style={{ ...revealInit(reduced), fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD_LIGHT }}>
                {t.statementKicker}
              </div>
              <blockquote data-reveal style={{ ...revealInit(reduced, 0.08), fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(32px,5.4vw,76px)', lineHeight: 1.1, letterSpacing: '.005em', color: IVORY, margin: '18px 0 0', maxWidth: '18ch' }}>
                “{statementQuote[lang]}”
              </blockquote>
              <div data-reveal style={{ ...revealInit(reduced, 0.14), fontSize: 14, color: 'rgba(243,234,211,.72)', marginTop: 18 }}>{statementWho[lang]}</div>
            </div>
          </div>
        </div>

        {/* the two chapters, each a photograph beside its paragraph, mirrored
            so the eye crosses the page rather than running down one gutter */}
        <div style={{ padding: 'clamp(56px,9vh,110px) clamp(20px,4.5vw,72px) clamp(72px,11vh,140px)' }}>
          <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gap: 'clamp(48px,8vh,96px)' }}>
            <StoryChapter art={STORY_ART.founding} text={storyP1[lang]} reduced={reduced} />
            <StoryChapter art={STORY_ART.today} text={storyP2[lang]} reduced={reduced} flip />
            {/* the landing page tells the short version; the whole story and
                the full archive live on their own route */}
            <div data-reveal style={{ ...revealInit(reduced, 0.1) }}>
              <Link to={P.story} className="rb-cta rb-cta-ghost">{t.storyMore}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== BREAD BOARD ===================== */}
      {/* A shelf the owner has emptied is left out whole, heading and all,
          rather than printed as a title over nothing. */}
      {BREAD.length > 0 && <section id="bread" style={{ background: INK_DEEP, padding: sectionPad }}>
        <div style={wrap}>
          <div className="rb-wipe" data-reveal style={{ ...revealInit(reduced), display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ maxWidth: 620 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD }}>{t.breadKicker}</div>
              <PipedTitle align="start" style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(34px,4.8vw,64px)', lineHeight: 1.03, margin: '16px 0 0', ...GOLD_TEXT, ...LETTERPRESS }}>{t.breadTitle}</PipedTitle>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: DIM, margin: '16px 0 0' }}>{t.breadIntro}</p>
            </div>
            {t.breadNote && <div style={{ fontSize: 13.5, color: FAINT, fontStyle: 'italic' }}>{t.breadNote}</div>}
          </div>

          {/* The loaves themselves carry the left of this section — the rack
              of sourdough rolls from their own shoot, stretched the full
              height of the list beside it (fill) rather than stopping at its
              own aspect ratio and leaving the column short. */}
          <div className="rb-bread-grid" data-reveal style={{ ...revealInit(reduced, 0.12), display: 'grid', gridTemplateColumns: 'minmax(260px,400px) minmax(0,1fr)', columnGap: 'clamp(40px,6vw,88px)', alignItems: 'stretch', marginTop: 'clamp(36px,5vh,56px)' }}>
            <MenuArtFrame art={MENU_ART.braud} lang={lang} fill />
            <div>
            {BREAD.map((b) => (
              <div key={b.name} style={{ padding: '16px 0', borderBottom: '1px solid rgba(243,234,211,.1)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontFamily: DISPLAY, fontSize: 'clamp(18px,1.8vw,22px)', color: GOLD_LIGHT, lineHeight: 1.3 }}>{b.name}</span>
                  <span className="rb-leader" aria-hidden="true" />
                  <span style={{ fontSize: 15, fontWeight: 600, color: GOLD, whiteSpace: 'nowrap' }}>{b.price}</span>
                </div>
                <div style={{ fontSize: 13.5, color: DIM, marginTop: 5, lineHeight: 1.5 }}>{b.desc[lang]}</div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>}

      {/* ===================== CAKES & CATERING + REVIEW ===================== */}
      <section style={{ background: INK_WARM, padding: sectionPad }}>
        <div style={wrap}>
          <div className="rb-catering-grid" data-reveal style={{ ...revealInit(reduced), display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(28px,5vw,80px)', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD }}>{t.cateringKicker}</div>
              <PipedTitle align="start" style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(30px,3.6vw,50px)', margin: '16px 0 0', ...GOLD_TEXT, ...LETTERPRESS }}>{t.cateringTitle}</PipedTitle>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: DIM, margin: '16px 0 0', maxWidth: '46ch' }}>{t.cateringBody}</p>
              <a href={`mailto:${LINKS.orderEmail}`} className="rb-cta rb-cta-ghost" style={{ marginTop: 'clamp(20px,3vh,28px)' }}>{t.cateringCta}</a>
              {/* the baker's hand placing the cherries — craft, not catalogue */}
              <MenuArtFrame art={MENU_ART.kaka} lang={lang} style={{ marginTop: 'clamp(28px,4vh,40px)', maxWidth: 480 }} />
            </div>
            <div>
              {/* One cake photographed, then the counter prices. Colour is the
                  product and black-and-white is the craft: the baker's hands
                  stay in the left column, what you can actually buy sits over
                  here. */}
              <CakeArtPair art={CAKE_ART} lang={lang} style={{ marginBottom: 'clamp(20px,3vh,30px)' }} />
              {/* real celebration-cake prices, as a compact list */}
              <div style={{ display: 'grid', gap: 0 }}>
                {CAKES.map((c) => (
                  <div key={c.name} style={{ padding: '13px 0', borderBottom: `1px solid ${HAIR_SOFT}` }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontFamily: DISPLAY, fontSize: 'clamp(18px,1.8vw,22px)', color: IVORY }}>{c.name}</span>
                      <span className="rb-leader" aria-hidden="true" />
                      <span style={{ fontSize: 15, fontWeight: 600, color: GOLD, whiteSpace: 'nowrap' }}>{c.price}</span>
                    </div>
                    {/* Every cake here currently ships without one. The line is
                        rendered anyway so that a description typed into the CMS
                        appears on the site instead of landing in a field the
                        page never reads — the failure this build has already
                        hit twice, in the other direction. */}
                    {c.desc[lang] && (
                      <p style={{ fontSize: 13.5, lineHeight: 1.55, color: DIM, margin: '6px 0 0', maxWidth: '44ch' }}>{c.desc[lang]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* the real reviews, auto-rotating + trust line */}
          {REVIEWS.length > 0 && <div data-reveal style={{ ...revealInit(reduced, 0.14), margin: '0', marginTop: 'clamp(48px,7vh,84px)', borderTop: `1px solid ${HAIR_SOFT}`, paddingTop: 'clamp(36px,5vh,52px)', textAlign: 'center' }}>
            <TestimonialRotator lang={lang} reduced={reduced} reviews={REVIEWS} />
            {trustLine[lang] && <div style={{ fontSize: 13.5, color: DIM, marginTop: 18 }}>{trustLine[lang]}</div>}
          </div>}
        </div>
      </section>

      {/* ===================== CUSTOM ORDERS (teaser) =====================
          The full configurator lives on its own route so this page keeps its
          story. See OrderPage.tsx. */}
      <OrderTeaser lang={lang} orderPath={P.order} />

      {/* ===================== GALLERY (closing strip) =====================
          These seventeen frames used to sit in a tall masonry wall ABOVE the
          order teaser — roughly five screens of scrolling between "I want to
          order a cake" and the button that lets you. The photographs are the
          best thing here, so none were cut; they now run as one horizontal
          strip below the order CTA, taking a single screen instead of five.
          Every frame still opens the same lightbox, so the indices below
          continue to line up with GALLERY. */}
      {GALLERY.length > 0 && <section id="gallery" style={{ background: INK, padding: 'clamp(56px,9vh,110px) 0 clamp(64px,10vh,120px)' }}>
        {/* The section itself has no horizontal padding, because the photo
            strip below bleeds. That left this header with none either, so on
            anything narrower than the 1180px wrap the kicker, the heading and
            the paragraph sat hard against the left edge of the screen.
            It now carries the SAME gutter expression as the strip, so the two
            share one left edge at every width instead of only agreeing above
            1180px. */}
        <div style={{ padding: '0 max(20px, calc((100vw - 1180px) / 2 + 20px))' }}>
          {/* The rule spans the full container, as it does in every other
              section — only the text is capped. Carrying the cap on the same
              element cut the hairline short and broke the page's one
              recurring device. */}
          <div className="rb-sec-intro rb-wipe" data-reveal style={revealInit(reduced)}>
            <div style={{ maxWidth: 640, marginInline: 'auto' }}>
              <div className="rb-sec-kicker">{t.galleryKicker}</div>
              <PipedTitle align="center" style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(30px,4vw,52px)', lineHeight: 1.03, margin: '18px 0 0', ...GOLD_TEXT, ...LETTERPRESS }}>{t.galleryTitle}</PipedTitle>
              <p style={{ fontSize: 16, color: DIM, margin: '16px 0 0', lineHeight: 1.65 }}>{t.galleryIntro}</p>
            </div>
          </div>
        </div>

        {/* Bleeds past the wrap on purpose: a strip that starts at the text's
            left edge but runs off the right tells you it scrolls. */}
        <div ref={stripRef} className="rb-gallery-strip" style={{ marginTop: 'clamp(28px,4vh,44px)' }}>
          {GALLERY.map((photo, i) => (
            <GalleryTile key={photo.src} photo={photo} lang={lang} onOpen={() => setLightbox(i)} style={revealInit(reduced, Math.min(i, 5) * 0.05)} />
          ))}
        </div>

        {/* The strip reads as "there are more of these", so give it somewhere
            to go: the same frames as a full wall on the archive page. */}
        <div style={{ ...wrap, padding: '0 clamp(20px,4.5vw,72px)', marginTop: 'clamp(24px,3.5vh,36px)' }}>
          <Link to={P.story} className="rb-cta rb-cta-ghost">{t.galleryMore}</Link>
        </div>
      </section>}

      {/* ===================== VISIT STRIP ===================== */}
      <section id="visit" style={{ background: INK, padding: sectionPad }}>
        <div style={wrap}>
          <div className="rb-visit-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,80px)', alignItems: 'start' }}>
            {/* Left: everything you need in words. Right: the place itself.
                One location means the old two-address split left this whole
                column empty, so the practical detail is gathered here and the
                photograph and map carry the other side. */}
            <div data-reveal style={revealInit(reduced)}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD }}>{t.visitKicker}</div>
              <PipedTitle align="start" style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(38px,5vw,72px)', lineHeight: 1.02, margin: '18px 0 0', ...GOLD_TEXT, ...LETTERPRESS }}>{t.visitTitle}</PipedTitle>

              <div style={{ fontFamily: DISPLAY, fontSize: 'clamp(22px,2.4vw,28px)', color: IVORY, marginTop: 'clamp(20px,3vh,28px)' }}>{mainName}</div>

              <div style={{ marginTop: 18, display: 'grid', gap: 12, maxWidth: 420 }}>
                {hoursRows[lang].map((l) => (
                  <div key={l.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, borderBottom: `1px solid ${HAIR_SOFT}`, paddingBottom: 10, fontSize: 14.5, color: DIM }}>
                    <span>{l.label}</span>
                    <span style={{ color: IVORY }}>{l.value}</span>
                  </div>
                ))}
                {soonExceptions.map((d) => (
                  <div key={d.date} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, borderBottom: `1px solid ${HAIR_SOFT}`, paddingBottom: 10, fontSize: 14.5, color: DIM }}>
                    <span>{shortDate(d.date, lang)}</span>
                    <span style={{ color: GOLD }}>{d.closed ? (lang === 'en' ? 'Closed' : 'Lokað') : `${Math.floor(d.open / 60)}:${String(d.open % 60).padStart(2, '0')} ${lang === 'en' ? 'to' : 'til'} ${Math.floor(d.close / 60)}:${String(d.close % 60).padStart(2, '0')}`}</span>
                  </div>
                ))}
                {noticeLive && notice && <p style={{ margin: 0, fontSize: 14.5, color: IVORY, lineHeight: 1.55 }}>{notice.text[lang]}</p>}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, borderBottom: `1px solid ${HAIR_SOFT}`, paddingBottom: 10 }}>
                  <span style={{ fontSize: 14.5, color: DIM }}>{t.rowPhone}</span>
                  <a href={`tel:${LINKS.phone}`} className="rb-foot-link" style={{ fontSize: 14.5, fontWeight: 600 }}>{LINKS.phoneLabel}</a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                  <span style={{ fontSize: 14.5, color: DIM }}>{t.rowEmail}</span>
                  <a href={`mailto:${LINKS.email}`} className="rb-foot-link" style={{ fontSize: 14.5, fontWeight: 600, wordBreak: 'break-all' }}>{LINKS.email}</a>
                </div>
              </div>

              {/* Both delivery platforms they actually trade on, under a head
                  that says what they are for. Neither is gold any more: gold
                  is reserved for ordering FROM the bakery, so a customer can
                  tell the two errands apart by sight anywhere on the page.
                  The buttons carry only the platform name — the head above
                  them already says "heimsending", and "Panta á aha.is" was
                  the third thing on this page starting with "Panta". */}
              <div style={{ marginTop: 'clamp(26px,4vh,36px)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD }}>
                  {t.deliveryKicker}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 14 }}>
                  <a href={LINKS.order} target="_blank" rel="noreferrer" className="rb-cta rb-cta-ghost rb-cta-ext">
                    {t.orderPrimary}<span aria-hidden="true">↗</span><span className="rb-sr">({t.extNote})</span>
                  </a>
                  <a href={LINKS.wolt} target="_blank" rel="noreferrer" className="rb-cta rb-cta-ghost rb-cta-ext">
                    {t.orderWolt}<span aria-hidden="true">↗</span><span className="rb-sr">({t.extNote})</span>
                  </a>
                </div>
              </div>
              <p style={{ fontSize: 14.5, color: DIM, margin: '18px 0 0', lineHeight: 1.6, maxWidth: '34ch' }}>{t.deliveryNote}</p>
            </div>

            <div data-reveal style={{ ...revealInit(reduced, 0.1) }}>
              {/* The room itself: their own wall of framed black-and-white
                  bakery photographs and the tables you can sit at. A map says
                  where it is; this says what it is like. */}
              <figure style={{ margin: 0, borderRadius: 4, overflow: 'hidden', border: `1px solid ${HAIR}` }}>
                <img
                  src={SHOP_IMG}
                  alt={images.shop?.caption[lang] ?? (lang === 'en' ? 'Inside Reynir bakari on Dalvegur: a wall of framed black-and-white bakery photographs above the tables' : 'Inni í Reyni bakara á Dalvegi: veggur með innrömmuðum svarthvítum myndum úr bakaríinu fyrir ofan borðin')}
                  width={1900}
                  height={1400}
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </figure>

            </div>
          </div>
        </div>
      </section>

      {/* The map, edge to edge, the way Villa North closes.
          It was a 4:3 widget boxed in a rounded border inside the visit grid —
          a panel of Google's chrome interrupting the page one screen from the
          end. Full-bleed it stops being a widget and becomes the ground the
          footer sits on: the veil takes the bottom of the map down to INK_DEEP,
          which is the footer's own colour, so the two meet with no seam.

          The filter is the same trick MapCard used and for the same reason —
          a keyless Google embed only ever serves a LIGHT map, so night has to
          be taken out of it by inverting and rotating the hue back. Both scrims
          are pointer-events:none, so the map stays draggable underneath. */}
      <section className="rb-mapband" aria-label={t.mainLabel}>
        {/* TAP TO LOAD. An embedded Google map can set Google cookies as soon
            as it loads, and the site's case for having no cookie banner is
            that nothing does. So the band starts as its own plate and the
            iframe is only requested when someone asks for it. The link at the
            bottom left needs no consent: it leaves the site. */}
        {mapLive ? (
          <iframe
            title={`${t.mainLabel}: ${mainName}`}
            src="https://maps.google.com/maps?q=Reynir%20bakari%2C%20Dalvegur%204%2C%20201%20K%C3%B3pavogur&z=15&output=embed&hl=is"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <div className="rb-mapband-cover">
            <svg className="rb-mapband-pin" width="24" height="32" viewBox="0 0 22 30" fill="none" aria-hidden="true">
              <path d="M11 29s9-9.3 9-17A9 9 0 0 0 2 12c0 7.7 9 17 9 17Z" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="11" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <button type="button" className="rb-mapband-load" onClick={() => setMapLive(true)}>
              {lang === 'is' ? 'Sýna kort' : 'Show map'}
            </button>
            <span className="rb-mapband-note">{lang === 'is' ? 'Kortið kemur frá Google' : 'The map is served by Google'}</span>
          </div>
        )}
        <span className="rb-mapband-veil" aria-hidden="true" />
        <a
          className="rb-mapband-cta"
          href="https://maps.google.com/?q=Reynir+bakari,+Dalvegur+4,+201+K%C3%B3pavogur"
          target="_blank"
          rel="noopener noreferrer"
        >
          {mainName}
        </a>
      </section>

      </main>
      {/* ===================== FOOTER ===================== */}
      {/* No borderTop: the map band above ends in a veil that has already
          reached INK_DEEP, so a hairline here would draw the seam the veil
          exists to hide. */}
      <footer style={{ background: INK_DEEP, padding: '52px clamp(20px,4.5vw,72px)' }}>
        <div style={{ ...wrap, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 22 }}>
          <div>
            <img src={LOGO} alt="" aria-hidden="true" width={120} height={52} loading="lazy" decoding="async" style={{ width: 120, height: 'auto', display: 'block' }} />
            <div style={{ fontSize: 13, color: FAINT, marginTop: 12 }}>{t.footerTag}</div>
            {/* the studio signature, under the bakery's own mark */}
            <div style={{ marginTop: 18 }}><SndrCredit lang={lang} /></div>
          </div>
          <div style={{ fontSize: 13.5, color: DIM, lineHeight: 1.8, textAlign: 'right' }}>
            <div>{mainName} · {LINKS.phoneLabel}</div>
            <div style={{ display: 'flex', gap: 18, justifyContent: 'flex-end', marginTop: 6, flexWrap: 'wrap' }}>
              <a href={LINKS.instagram} target="_blank" rel="noreferrer" className="rb-foot-link">Instagram</a>
              <a href={LINKS.facebook} target="_blank" rel="noreferrer" className="rb-foot-link">Facebook</a>
              <a href={LINKS.order} target="_blank" rel="noreferrer" className="rb-foot-link">aha.is</a>
              <a href={LINKS.wolt} target="_blank" rel="noreferrer" className="rb-foot-link">Wolt</a>
              <Link to={P.legal} className="rb-foot-link">{t.legalLink}</Link>
            </div>
            <div style={{ fontSize: 12, color: FAINT, marginTop: 10 }}>{t.legalLine}</div>
          </div>
        </div>
      </footer>

      {lightbox !== null && GALLERY[lightbox] && (
        <div ref={modalRef} tabIndex={-1} className="rb-lightbox" role="dialog" aria-modal="true" aria-label={GALLERY[lightbox].caption[lang]} onClick={closeLightbox}>
          <button type="button" className="rb-lb-btn rb-lb-close" onClick={closeLightbox} aria-label={t.galleryClose}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
          <button
            type="button"
            className="rb-lb-btn rb-lb-prev"
            onClick={(e) => { e.stopPropagation(); stepLightbox(-1) }}
            aria-label={t.galleryPrev}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M11 3L5 9L11 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button
            type="button"
            className="rb-lb-btn rb-lb-next"
            onClick={(e) => { e.stopPropagation(); stepLightbox(1) }}
            aria-label={t.galleryNext}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M7 3L13 9L7 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <figure className="rb-lightbox-fig" onClick={(e) => e.stopPropagation()}>
            <img key={GALLERY[lightbox].src} src={GALLERY[lightbox].src} alt={GALLERY[lightbox].caption[lang]}
              width={GALLERY[lightbox].w} height={GALLERY[lightbox].h} decoding="async" />
            <figcaption className="rb-lightbox-cap">{GALLERY[lightbox].caption[lang]}</figcaption>
          </figure>
        </div>
      )}

      <Chrome />
    </div>
  )
}

export default function ReynirPage() {
  return (
    <SiteContentProvider>
      <ReynirPageInner />
    </SiteContentProvider>
  )
}
