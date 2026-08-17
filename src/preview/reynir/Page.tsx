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

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import Chrome from './Chrome'
import { ORDER_PATH, STORY_PATH, LEGAL_PATH } from './paths'
import { setThemeColor } from '../../lib/preview'
import { T, type Lang, type MenuItem, type GalleryPhoto, type Review, type MenuArt, LOGO, FEATURE_IMG, PRODUCT_IMG, SHOP_IMG, MENU_ART, STORY_ART } from './data'
import { ARCHIVAL, ARCHIVAL_LIVE, BODY, BURGUNDY, DIM, DISPLAY, EASE, FAINT, GOLD, GOLD_LIGHT, GOLD_TEXT, HAIR, HAIR_SOFT, INK, INK_DEEP, INK_WARM, IVORY, LETTERPRESS } from './tokens'
import OrderTeaser from './OrderTeaser'
import MapCard from './MapCard'
import { ORDER_T } from './order'
import { useLang } from './useLang'
import { SiteContentProvider, useSiteContent, type DayHours } from './sanity'



// Brand tokens live in tokens.ts so section components share one source of truth.
/** Base box size of the travelling pistachio medallion (scaled via transform). */
const MED_BASE = 440

const PAGE_CSS = `
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

  .rb-cover { min-height:100svh; }

  @keyframes rb-rise { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
  .rb-enter  { animation:rb-rise .9s ${EASE} both; }
  .rb-enter-2 { animation:rb-rise .9s ${EASE} .14s both; }
  .rb-enter-3 { animation:rb-rise .9s ${EASE} .26s both; }
  .rb-enter-4 { animation:rb-rise .9s ${EASE} .38s both; }

  @keyframes rb-marquee { from { transform:translateX(0); } to { transform:translateX(-50%); } }
  .rb-marquee-track { display:flex; width:max-content; animation:rb-marquee 36s linear infinite; }

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
  .rb-stickybar { position:fixed; top:0; left:0; right:0; z-index:150;
    display:flex; align-items:center; justify-content:space-between; gap:20px;
    padding:10px clamp(16px,4.5vw,72px);
    background:rgba(11,10,9,.86);
    backdrop-filter:blur(14px) saturate(1.15); -webkit-backdrop-filter:blur(14px) saturate(1.15);
    border-bottom:1px solid rgba(238,211,170,.14);
    transform:translateY(-101%); opacity:0; pointer-events:none;
    transition:transform .55s ${EASE}, opacity .35s ${EASE}; }
  .rb-stickybar[data-on="true"] { transform:none; opacity:1; pointer-events:auto; }
  .rb-sticky-nav { display:flex; gap:22px; align-items:center; }
  .rb-sticky-cta { display:inline-flex; align-items:center; gap:9px; text-decoration:none;
    background:${GOLD}; color:${INK_DEEP}; font-family:${BODY}; font-size:13.5px; font-weight:600;
    letter-spacing:.02em; padding:9px 17px; border-radius:2px; white-space:nowrap;
    transition:background .2s ${EASE}, transform .15s ${EASE}; }
  .rb-sticky-cta:hover { background:${GOLD_LIGHT}; }
  .rb-sticky-cta:active { transform:scale(.98); }
  /* the open/closed dot, carried into the bar so the status stays visible */
  .rb-sticky-dot { width:6px; height:6px; border-radius:50%; flex:0 0 auto; }
  @media (max-width:820px) { .rb-sticky-nav { display:none; } }
  /* "Closed, we open at 7:00 today" will not fit beside a CTA on a phone —
     the dot alone still carries open/closed, so only the words go. */
  @media (max-width:560px) { .rb-sticky-status { display:none; } }
  @media (prefers-reduced-motion: reduce) {
    .rb-stickybar { transition:opacity .2s linear; }
  }

  .rb-cta {
    display:inline-block; text-decoration:none; font-weight:600; font-size:15.5px;
    padding:14px 30px; border-radius:4px; white-space:nowrap;
    transition:background .25s ${EASE}, color .25s ${EASE}, border-color .25s ${EASE}, transform .18s ${EASE};
  }
  .rb-cta:active { transform:scale(.98); }
  .rb-cta-gold { background:${GOLD}; color:${INK}; border:1px solid ${GOLD}; }
  .rb-cta-gold:hover { background:${GOLD_LIGHT}; border-color:${GOLD_LIGHT}; }
  .rb-cta-ghost { background:transparent; color:${IVORY}; border:1px solid rgba(238,211,170,.34); }
  .rb-cta-ghost:hover { border-color:${GOLD}; background:rgba(238,211,170,.05); }

  .rb-lang { background:none; border:none; cursor:pointer; padding:14px 13px; margin:-14px -13px; font-family:${BODY};
    font-size:13px; letter-spacing:.08em; color:${FAINT}; transition:color .2s ${EASE}; border-radius:4px; }
  .rb-lang[aria-pressed="true"] { color:${GOLD_LIGHT}; }
  .rb-lang:hover { color:${IVORY}; }

  .rb-row { transition:color .2s ${EASE}; }
  .rb-row:hover .rb-row-name { color:${GOLD_LIGHT}; }
  .rb-leader { flex:1; align-self:center; height:0; border-bottom:1.5px dotted rgba(238,211,170,.32); margin:0 4px; transform:translateY(2px); }

  .rb-foot-link { color:${DIM}; text-decoration:none; transition:color .2s ${EASE}; }
  .rb-foot-link:hover { color:${GOLD_LIGHT}; }

  .rb-cover-art { position:absolute; top:50%; right:clamp(-30px,0vw,20px); transform:translateY(-50%);
    width:clamp(300px,40vw,${MED_BASE}px); z-index:1; pointer-events:none; display:flex; align-items:center; justify-content:center; }

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
    .rb-marquee-track { animation:none; }
    .rb-hero-spin { animation:none; }
    .rb-cta { transition:none; }
    .rb-cta:active { transform:none; }
    .rb-gallery-item img { transition:none; }
    .rb-gallery-item:hover img { transform:none; }
    .rb-lightbox, .rb-lightbox-fig img { animation:none; }
    .rb-testi-fade { animation:none; }
    .rb-story-img { animation:none; }
    .rb-gallery-strip { scroll-snap-type:none; }
  }
`

const pad2 = (n: number) => String(n).padStart(2, '0')
const fmtHM = (mins: number) => `${Math.floor(mins / 60)}:${pad2(mins % 60)}`

/** Iceland has no DST, so UTC clock fields equal Iceland local time.
 *  hoursByDay is read live from the CMS (falls back to bundled data.ts) so
 *  the "open now" badge always matches whatever the owner set. */
function openStatus(now: number, lang: Lang, hoursByDay: readonly DayHours[]) {
  const d = new Date(now)
  const day = d.getUTCDay()
  const mins = d.getUTCHours() * 60 + d.getUTCMinutes()
  const today = hoursByDay[day]
  const t = T[lang]
  if (!today.closed && mins >= today.open && mins < today.close) return { open: true, label: t.statusOpen(fmtHM(today.close)) }
  if (today.closed || mins < today.open) return { open: false, label: t.statusOpensToday(fmtHM(today.open)) }
  return { open: false, label: t.statusOpensTomorrow(fmtHM(hoursByDay[(day + 1) % 7].open)) }
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
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
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
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (reduced || paused || reviews.length <= 1) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % reviews.length), 6500)
    return () => window.clearInterval(id)
  }, [reduced, paused, reviews])

  useEffect(() => {
    if (index >= reviews.length) setIndex(0)
  }, [reviews, index])

  const r = reviews[index] ?? reviews[0]

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <blockquote
        key={index}
        className={reduced ? undefined : 'rb-testi-fade'}
        style={{ margin: '0 auto', maxWidth: '38ch', fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(26px,3.6vw,46px)', lineHeight: 1.25, color: IVORY }}
      >
        “{r.quote[lang]}”
      </blockquote>
      <figcaption
        key={`w-${index}`}
        className={reduced ? undefined : 'rb-testi-fade'}
        style={{ fontSize: 14, color: FAINT, marginTop: 16 }}
      >
        {r.who}
      </figcaption>

      {reviews.length > 1 && (
        <div role="tablist" aria-label={lang === 'en' ? 'Reviews' : 'Umsagnir'} style={{ display: 'flex', gap: 0, justifyContent: 'center', marginTop: 4 }}>
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`${lang === 'en' ? 'Review' : 'Umsögn'} ${i + 1}`}
              data-active={i === index}
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
  // English on a first visit, but shared with the order route so a visitor
  // reading in Icelandic does not land back in English after ordering.
  const [lang, setLang] = useLang()
  const t = T[lang]
  const {
    LINKS, HOURS_BY_DAY, FEATURE, MENU, BREAD, CAKES, GALLERY, REVIEWS,
    hoursRows, mainName, trustLine,
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

  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30000)
    return () => window.clearInterval(id)
  }, [])
  const status = useMemo(() => openStatus(now, lang, HOURS_BY_DAY), [now, lang, HOURS_BY_DAY])

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
  const [intro, setIntro] = useState(() => {
    if (typeof window === 'undefined') return false
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    try {
      return window.sessionStorage.getItem('rb-intro-seen') !== '1'
    } catch {
      return true
    }
  })
  useEffect(() => {
    if (!intro) return
    const id = window.setTimeout(() => setIntro(false), 2150)
    return () => window.clearTimeout(id)
  }, [intro])
  // Marked as seen as soon as it has played or been dismissed, so a click-to-
  // skip counts too and the curtain does not return on the next route change.
  useEffect(() => {
    if (intro) return
    try { window.sessionStorage.setItem('rb-intro-seen', '1') } catch { /* private mode */ }
  }, [intro])

  useEffect(() => {
    if (reduced) return
    const root = rootRef.current
    if (!root || !('IntersectionObserver' in window)) return

    const reveal = (el: HTMLElement) => {
      el.style.opacity = '1'
      el.style.transform = 'none'
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

  const marqueeItems = useMemo(
    () => ['Vínarbrauð', 'Súrdeigsbrauð', 'Snúður', 'Kanillengja', 'Pistasíusnúður', 'Kleina', 'Rúgbrauð', 'Skúffukaka'],
    [],
  )

  // Gallery lightbox: null when closed, otherwise the open photo's index.
  const [lightbox, setLightbox] = useState<number | null>(null)

  // The sticky bar appears once the cover has scrolled out of view. Watching
  // the cover with an observer rather than polling scrollY keeps this off the
  // main thread's per-frame path; `pastCover` flips exactly twice per visit.
  const [pastCover, setPastCover] = useState(false)
  useEffect(() => {
    const cover = rootRef.current?.querySelector('.rb-cover')
    if (!cover) return
    const io = new IntersectionObserver(([e]) => setPastCover(!e.isIntersecting), { threshold: 0 })
    io.observe(cover)
    return () => io.disconnect()
  }, [])
  const closeLightbox = () => setLightbox(null)
  const stepLightbox = (dir: 1 | -1) => setLightbox((i) => (i === null ? i : (i + dir + GALLERY.length) % GALLERY.length))

  useEffect(() => {
    if (lightbox === null) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') stepLightbox(1)
      if (e.key === 'ArrowLeft') stepLightbox(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [lightbox])

  const sectionPad = 'clamp(80px,11vh,140px) clamp(20px,4.5vw,72px)'
  const wrap = { maxWidth: 1180, margin: '0 auto' } as const

  return (
    <div
      ref={rootRef}
      className="rb-page"
      lang={lang}
      style={{ fontFamily: BODY, color: IVORY, background: INK, overflowX: 'hidden', WebkitFontSmoothing: 'antialiased' }}
    >
      <style>{PAGE_CSS}</style>

      {intro && (
        <div className="rb-intro" onClick={() => setIntro(false)} aria-hidden="true">
          <div className="rb-intro-logo">
            <img className="rb-intro-draw" src={LOGO} alt="" decoding="async" />
            <span className="rb-intro-tip" />
          </div>
        </div>
      )}

      {/* ===================== STICKY BAR =====================
          Not a second navigation so much as a permanent way back to the two
          things people came for: what's on, and how to order it. Hidden while
          the cover is on screen so the hero keeps its full first impression. */}
      <div className="rb-stickybar" data-on={pastCover} aria-hidden={!pastCover}>
        <a href="#top" aria-label="Reynir bakari" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={LOGO} alt="" width={132} height={57} decoding="async" style={{ width: 96, height: 'auto', display: 'block' }} />
        </a>
        <nav className="rb-sticky-nav">
          <a href="#menu" className="rb-navlink">{t.navMenu}</a>
          <a href="#bread" className="rb-navlink">{t.navBread}</a>
          <Link to={STORY_PATH} className="rb-navlink">{t.navStory}</Link>
          <a href="#visit" className="rb-navlink">{t.navVisit}</a>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px,1.6vw,20px)' }}>
          {/* the open/closed status follows you down the page — for a bakery
              that shuts at 17:00 this is the single most asked question */}
          <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: status.open ? GOLD_LIGHT : FAINT, whiteSpace: 'nowrap' }}>
            <span className="rb-sticky-dot" style={{ background: status.open ? GOLD : 'rgba(243,234,211,.4)' }} />
            <span className="rb-sticky-status">{status.label}</span>
          </span>
          <Link to={ORDER_PATH} className="rb-sticky-cta">{ORDER_T[lang].navOrder}</Link>
        </div>
      </div>

      {/* ===================== MASTHEAD ===================== */}
      <header id="top" style={{ position: 'relative', zIndex: 5, padding: '20px clamp(20px,4.5vw,72px) 0' }}>
        <div style={{ ...wrap, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <img src={LOGO} alt="Reynir bakari" width={132} height={57} decoding="async" style={{ width: 132, height: 'auto', display: 'block' }} />
          <nav className="rb-nav-links" style={{ display: 'flex', gap: 26, alignItems: 'center' }}>
            <a href="#menu" className="rb-navlink">{t.navMenu}</a>
            <a href="#bread" className="rb-navlink">{t.navBread}</a>
            <a href="#gallery" className="rb-navlink">{t.navGallery}</a>
            {/* a real destination, not an anchor: clicking "Panta" means ordering */}
            <Link to={ORDER_PATH} className="rb-navlink">{ORDER_T[lang].navOrder}</Link>
            <Link to={STORY_PATH} className="rb-navlink">{t.navStory}</Link>
            <a href="#visit" className="rb-navlink">{t.navVisit}</a>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div role="group" aria-label="Language" style={{ display: 'flex', gap: 2 }}>
              <button className="rb-lang" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
              <span aria-hidden="true" style={{ color: FAINT, alignSelf: 'center' }}>/</span>
              <button className="rb-lang" aria-pressed={lang === 'is'} onClick={() => setLang('is')}>ÍS</button>
            </div>
          </div>
        </div>
      </header>

      {/* ===================== COVER ===================== */}
      <section className="rb-cover" style={{ position: 'relative', display: 'flex', flexDirection: 'column', padding: '0 clamp(20px,4.5vw,72px)' }}>
        <div className="rb-cover-grid" style={{ ...wrap, flex: 1, width: '100%', display: 'grid', gridTemplateColumns: '1fr', alignItems: 'center', position: 'relative', padding: 'clamp(24px,5vh,56px) 0' }}>
          {/* the pistachio snúður, a transparent cutout floating on the dark hero,
              turning slowly and smoothly in place */}
          <div className="rb-cover-art rb-enter-3">
            <img
              className="rb-hero-spin"
              src={FEATURE_IMG}
              alt={lang === 'en' ? 'A Reynir pistachio snúður, glazed and topped with pistachios' : 'Pistasíusnúður frá Reyni, gljáður og toppaður með pistasíum'}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          <div className="rb-cover-copy" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: 640, position: 'relative', zIndex: 2 }}>
            <div className="rb-cover-meta rb-enter" style={{ display: 'flex', gap: 18, alignItems: 'center', fontSize: 12.5, letterSpacing: '.14em', textTransform: 'uppercase', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: GOLD }}>
                <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: status.open ? '#8FA876' : GOLD }} />
                {status.label}
              </span>
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

            <div className="rb-cover-ctas rb-enter-4" style={{ display: 'flex', gap: 14, marginTop: 'clamp(24px,3.5vh,36px)' }}>
              {/* generic in the hero: the platform choice belongs further
                  down, where both options can be shown side by side */}
              <a href={LINKS.order} target="_blank" rel="noreferrer" className="rb-cta rb-cta-gold">{t.ctaDelivery}</a>
              <a href="#menu" className="rb-cta rb-cta-ghost">{t.ctaMenu}</a>
            </div>
          </div>
        </div>

        {/* gold marquee of the day's bakes */}
        <div style={{ borderTop: `1px solid ${HAIR}`, borderBottom: `1px solid ${HAIR}`, padding: '18px 0', overflow: 'hidden', position: 'relative', zIndex: 2 }}>
          <div className="rb-marquee-track" aria-hidden="true">
            {[0, 1].map((dup) => (
              <div key={dup} style={{ display: 'flex', alignItems: 'center' }}>
                {marqueeItems.map((it, i) => (
                  <span key={`${dup}-${i}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <span style={{ fontFamily: DISPLAY, fontSize: 'clamp(20px,2.4vw,30px)', color: i % 2 ? GOLD : GOLD_LIGHT, padding: '0 26px' }}>{it}</span>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: GOLD, opacity: 0.6 }} />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== THE MENU ===================== */}
      <section id="menu" style={{ background: INK, borderTop: `1px solid ${HAIR_SOFT}`, padding: sectionPad }}>
        <div style={wrap}>
          <div data-reveal style={revealInit(reduced)}>
            <div style={{ borderTop: `1px solid ${HAIR}`, paddingTop: 16, fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD }}>{t.menuMasthead}</div>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(34px,4.6vw,62px)', lineHeight: 1.03, margin: '18px 0 0', ...GOLD_TEXT, ...LETTERPRESS }}>{t.ovenTitle}</h2>
            <p style={{ fontSize: 16, color: DIM, margin: '16px 0 0', maxWidth: '52ch', lineHeight: 1.65 }}>{t.ovenIntro}</p>
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
                    alt={lang === 'en' ? 'A Reynir pistachio snúður torn open, gooey pistachio glaze stretching between the halves' : 'Pistasíusnúður frá Reyni rifinn í sundur, pistasíugljái teygist á milli helminganna'}
                    loading="lazy"
                    decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
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
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
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
              <Link to={STORY_PATH} className="rb-cta rb-cta-ghost">{t.storyMore}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== BREAD BOARD ===================== */}
      <section id="bread" style={{ background: INK_DEEP, padding: sectionPad }}>
        <div style={wrap}>
          <div data-reveal style={{ ...revealInit(reduced), display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap', borderTop: `1px solid ${HAIR}`, paddingTop: 16 }}>
            <div style={{ maxWidth: 620 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD }}>{t.breadKicker}</div>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(34px,4.8vw,64px)', lineHeight: 1.03, margin: '16px 0 0', ...GOLD_TEXT, ...LETTERPRESS }}>{t.breadTitle}</h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: DIM, margin: '16px 0 0' }}>{t.breadIntro}</p>
            </div>
            <div style={{ fontSize: 13.5, color: FAINT, fontStyle: 'italic' }}>{t.breadNote}</div>
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
      </section>

      {/* ===================== CAKES & CATERING + REVIEW ===================== */}
      <section style={{ background: INK_WARM, padding: sectionPad }}>
        <div style={wrap}>
          <div className="rb-catering-grid" data-reveal style={{ ...revealInit(reduced), display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(28px,5vw,80px)', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD }}>{t.cateringKicker}</div>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(30px,3.6vw,50px)', margin: '16px 0 0', ...GOLD_TEXT, ...LETTERPRESS }}>{t.cateringTitle}</h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: DIM, margin: '16px 0 0', maxWidth: '46ch' }}>{t.cateringBody}</p>
              <a href={`mailto:${LINKS.orderEmail}`} className="rb-cta rb-cta-ghost" style={{ marginTop: 'clamp(20px,3vh,28px)' }}>{t.cateringCta}</a>
              {/* the baker's hand placing the cherries — craft, not catalogue */}
              <MenuArtFrame art={MENU_ART.kaka} lang={lang} style={{ marginTop: 'clamp(28px,4vh,40px)', maxWidth: 480 }} />
            </div>
            <div>
              {/* real celebration-cake prices, as a compact list */}
              <div style={{ display: 'grid', gap: 0 }}>
                {CAKES.map((c) => (
                  <div key={c.name} style={{ display: 'flex', alignItems: 'baseline', gap: 4, padding: '13px 0', borderBottom: `1px solid ${HAIR_SOFT}` }}>
                    <span style={{ fontFamily: DISPLAY, fontSize: 'clamp(18px,1.8vw,22px)', color: IVORY }}>{c.name}</span>
                    <span className="rb-leader" aria-hidden="true" />
                    <span style={{ fontSize: 15, fontWeight: 600, color: GOLD, whiteSpace: 'nowrap' }}>{c.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* the real reviews, auto-rotating + trust line */}
          <figure data-reveal style={{ ...revealInit(reduced, 0.14), margin: '0', marginTop: 'clamp(48px,7vh,84px)', borderTop: `1px solid ${HAIR_SOFT}`, paddingTop: 'clamp(36px,5vh,52px)', textAlign: 'center' }}>
            <TestimonialRotator lang={lang} reduced={reduced} reviews={REVIEWS} />
            <div style={{ fontSize: 13.5, color: DIM, marginTop: 18 }}>{trustLine[lang]}</div>
          </figure>
        </div>
      </section>

      {/* ===================== CUSTOM ORDERS (teaser) =====================
          The full configurator lives on its own route so this page keeps its
          story. See OrderPage.tsx. */}
      <OrderTeaser lang={lang} orderPath={ORDER_PATH} />

      {/* ===================== GALLERY (closing strip) =====================
          These seventeen frames used to sit in a tall masonry wall ABOVE the
          order teaser — roughly five screens of scrolling between "I want to
          order a cake" and the button that lets you. The photographs are the
          best thing here, so none were cut; they now run as one horizontal
          strip below the order CTA, taking a single screen instead of five.
          Every frame still opens the same lightbox, so the indices below
          continue to line up with GALLERY. */}
      <section id="gallery" style={{ background: INK, padding: 'clamp(56px,9vh,110px) 0 clamp(64px,10vh,120px)' }}>
        <div style={wrap}>
          {/* The rule spans the full container, as it does in every other
              section — only the text is capped. Carrying the cap on the same
              element cut the hairline short and broke the page's one
              recurring device. */}
          <div data-reveal style={{ ...revealInit(reduced), borderTop: `1px solid ${HAIR}`, paddingTop: 16 }}>
            <div style={{ maxWidth: 640 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD }}>{t.galleryKicker}</div>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(30px,4vw,52px)', lineHeight: 1.03, margin: '18px 0 0', ...GOLD_TEXT, ...LETTERPRESS }}>{t.galleryTitle}</h2>
              <p style={{ fontSize: 16, color: DIM, margin: '16px 0 0', lineHeight: 1.65 }}>{t.galleryIntro}</p>
            </div>
          </div>
        </div>

        {/* Bleeds past the wrap on purpose: a strip that starts at the text's
            left edge but runs off the right tells you it scrolls. */}
        <div className="rb-gallery-strip" style={{ marginTop: 'clamp(28px,4vh,44px)' }}>
          {GALLERY.map((photo, i) => (
            <GalleryTile key={photo.src} photo={photo} lang={lang} onOpen={() => setLightbox(i)} style={revealInit(reduced, Math.min(i, 5) * 0.05)} />
          ))}
        </div>

        {/* The strip reads as "there are more of these", so give it somewhere
            to go: the same frames as a full wall on the archive page. */}
        <div style={{ ...wrap, padding: '0 clamp(20px,4.5vw,72px)', marginTop: 'clamp(24px,3.5vh,36px)' }}>
          <Link to={STORY_PATH} className="rb-cta rb-cta-ghost">{t.galleryMore}</Link>
        </div>
      </section>

      {/* ===================== VISIT STRIP ===================== */}
      <section id="visit" style={{ background: INK, padding: sectionPad }}>
        <div style={wrap}>
          <div className="rb-visit-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,80px)', alignItems: 'start' }}>
            {/* Left: everything you need in words. Right: the place itself.
                One location means the old two-address split left this whole
                column empty, so the practical detail is gathered here and the
                photograph and map carry the other side. */}
            <div data-reveal style={revealInit(reduced)}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD, borderTop: `1px solid ${HAIR}`, paddingTop: 16 }}>{t.visitKicker}</div>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(38px,5vw,72px)', lineHeight: 1.02, margin: '18px 0 0', ...GOLD_TEXT, ...LETTERPRESS }}>{t.visitTitle}</h2>

              <div style={{ fontFamily: DISPLAY, fontSize: 'clamp(22px,2.4vw,28px)', color: IVORY, marginTop: 'clamp(20px,3vh,28px)' }}>{mainName}</div>

              <div style={{ marginTop: 18, display: 'grid', gap: 12, maxWidth: 420 }}>
                {hoursRows[lang].map((l) => (
                  <div key={l.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, borderBottom: `1px solid ${HAIR_SOFT}`, paddingBottom: 10, fontSize: 14.5, color: DIM }}>
                    <span>{l.label}</span>
                    <span style={{ color: IVORY }}>{l.value}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, borderBottom: `1px solid ${HAIR_SOFT}`, paddingBottom: 10 }}>
                  <span style={{ fontSize: 14.5, color: DIM }}>{t.rowPhone}</span>
                  <a href={`tel:${LINKS.phone}`} className="rb-foot-link" style={{ fontSize: 14.5, fontWeight: 600 }}>{LINKS.phoneLabel}</a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                  <span style={{ fontSize: 14.5, color: DIM }}>{t.rowEmail}</span>
                  <a href={`mailto:${LINKS.email}`} className="rb-foot-link" style={{ fontSize: 14.5, fontWeight: 600, wordBreak: 'break-all' }}>{LINKS.email}</a>
                </div>
              </div>

              {/* Both delivery platforms they actually trade on, side by side.
                  aha.is stays the primary because it is the one they already
                  advertise; Wolt sat unlinked even though their storefront is
                  live and was the source we price-checked the menu against. */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 'clamp(26px,4vh,36px)' }}>
                <a href={LINKS.order} target="_blank" rel="noreferrer" className="rb-cta rb-cta-gold">{t.orderPrimary}</a>
                <a href={LINKS.wolt} target="_blank" rel="noreferrer" className="rb-cta rb-cta-ghost">{t.orderWolt}</a>
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
                  alt={lang === 'en' ? 'Inside Reynir bakari on Dalvegur: a wall of framed black-and-white bakery photographs above the tables' : 'Inni í Reyni bakara á Dalvegi: veggur með innrömmuðum svarthvítum myndum úr bakaríinu fyrir ofan borðin'}
                  width={1900}
                  height={1400}
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </figure>

              <MapCard
                lang={lang}
                locations={[
                  { label: t.mainLabel, address: mainName, query: 'Reynir bakari, Dalvegur 4, 201 Kópavogur' },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer style={{ background: INK_DEEP, borderTop: `1px solid ${HAIR_SOFT}`, padding: '52px clamp(20px,4.5vw,72px)' }}>
        <div style={{ ...wrap, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 22 }}>
          <div>
            <img src={LOGO} alt="" aria-hidden="true" width={120} height={52} loading="lazy" decoding="async" style={{ width: 120, height: 'auto', display: 'block' }} />
            <div style={{ fontSize: 13, color: FAINT, marginTop: 12 }}>{t.footerTag}</div>
          </div>
          <div style={{ fontSize: 13.5, color: DIM, lineHeight: 1.8, textAlign: 'right' }}>
            <div>{mainName} · {LINKS.phoneLabel}</div>
            <div style={{ display: 'flex', gap: 18, justifyContent: 'flex-end', marginTop: 6, flexWrap: 'wrap' }}>
              <a href={LINKS.instagram} target="_blank" rel="noreferrer" className="rb-foot-link">Instagram</a>
              <a href={LINKS.facebook} target="_blank" rel="noreferrer" className="rb-foot-link">Facebook</a>
              <a href={LINKS.order} target="_blank" rel="noreferrer" className="rb-foot-link">aha.is</a>
              <a href={LINKS.wolt} target="_blank" rel="noreferrer" className="rb-foot-link">Wolt</a>
              <Link to={LEGAL_PATH} className="rb-foot-link">{t.legalLink}</Link>
            </div>
            <div style={{ fontSize: 12, color: FAINT, marginTop: 10 }}>{t.legalLine}</div>
          </div>
        </div>
      </footer>

      {lightbox !== null && (
        <div className="rb-lightbox" role="dialog" aria-modal="true" aria-label={GALLERY[lightbox].caption[lang]} onClick={closeLightbox}>
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
            <img key={GALLERY[lightbox].src} src={GALLERY[lightbox].src} alt={GALLERY[lightbox].caption[lang]} decoding="async" />
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
