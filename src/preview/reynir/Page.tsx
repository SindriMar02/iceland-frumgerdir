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
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { getPreviewCompany } from '../companies'
import { setThemeColor } from '../../lib/preview'
import { T, type Lang, type MenuItem, type GalleryPhoto, type Review, LOGO, FEATURE_IMG, PRODUCT_IMG, SHOP_IMG } from './data'
import { BODY, BURGUNDY, DIM, DISPLAY, EASE, FAINT, GOLD, GOLD_LIGHT, GOLD_TEXT, HAIR, HAIR_SOFT, INK, INK_DEEP, INK_WARM, IVORY } from './tokens'
import OrderTeaser from './OrderTeaser'
import MapCard from './MapCard'
import { ORDER_T } from './order'
import { useLang } from './useLang'
import { SiteContentProvider, useSiteContent, type DayHours } from './sanity'

/** The order configurator's own route. */
const ORDER_PATH = '/preview/reynir/panta'

const company = getPreviewCompany('reynir')

// Brand tokens live in tokens.ts so section components share one source of truth.
/** Base box size of the travelling pistachio medallion (scaled via transform). */
const MED_BASE = 440

const PAGE_CSS = `
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

  /* the hero pistachio turns slowly and smoothly, in place. It is a real
     photograph masked to a circle rather than a cutout, so it carries a gold
     hairline and a soft drop to read as a struck medallion rather than as a
     photo that happens to be round. */
  @keyframes rb-hero-spin { to { transform:rotate(360deg); } }
  .rb-hero-spin { animation:rb-hero-spin 44s linear infinite; will-change:transform; transform-origin:50% 50%;
    border-radius:50%; box-shadow:0 0 0 1px rgba(238,211,170,.34), 0 34px 70px -22px rgba(0,0,0,.85); }

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

  .rb-navlink { color:${DIM}; text-decoration:none; font-size:14.5px; transition:color .2s ${EASE}; }
  .rb-navlink:hover { color:${GOLD_LIGHT}; }

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

  /* ── photo gallery: print-style contact sheet, columns masonry ─────────── */
  .rb-gallery-grid { column-count:3; column-gap:14px; }
  .rb-gallery-item { break-inside:avoid; margin:0 0 14px; padding:0; border:0; display:block; width:100%;
    position:relative; overflow:hidden; border-radius:3px; cursor:zoom-in; background:${INK_DEEP};
    box-shadow:0 1px 0 rgba(238,211,170,.06); }
  .rb-gallery-item::after { content:''; position:absolute; inset:0; border-radius:3px;
    border:1px solid rgba(238,211,170,0); transition:border-color .3s ${EASE}; pointer-events:none; }
  .rb-gallery-item:hover::after, .rb-gallery-item:focus-visible::after { border-color:rgba(238,211,170,.4); }
  .rb-gallery-item img { width:100%; height:auto; display:block; transition:transform .6s ${EASE}, filter .6s ${EASE}; }
  .rb-gallery-item:hover img, .rb-gallery-item:focus-visible img { transform:scale(1.045); }
  .rb-gallery-cap { position:absolute; left:0; right:0; bottom:0; padding:26px 14px 12px;
    background:linear-gradient(0deg, rgba(11,10,9,.88) 0%, rgba(11,10,9,0) 100%);
    opacity:0; transform:translateY(6px); transition:opacity .35s ${EASE}, transform .35s ${EASE};
    text-align:left; font-family:${BODY}; font-size:12.5px; color:${GOLD_LIGHT}; letter-spacing:.01em; }
  .rb-gallery-item:hover .rb-gallery-cap, .rb-gallery-item:focus-visible .rb-gallery-cap { opacity:1; transform:none; }

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
    .rb-gallery-grid { column-count:2; column-gap:10px; }
    .rb-gallery-item { margin-bottom:10px; }
    .rb-lb-prev { left:4px; } .rb-lb-next { right:4px; }
  }
  @media (max-width:480px) {
    .rb-gallery-cap { opacity:1; transform:none; padding:18px 10px 9px; font-size:11.5px; }
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
      <span className="rb-gallery-cap" aria-hidden="true">{photo.caption[lang]}</span>
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

  // Intro loader: the gold script writes itself on, as if piped. Plays on
  // mount; skips entirely for reduced-motion; click anywhere to dismiss early.
  const [intro, setIntro] = useState(
    () => !(typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches),
  )
  useEffect(() => {
    if (!intro) return
    const id = window.setTimeout(() => setIntro(false), 2150)
    return () => window.clearTimeout(id)
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
  }, [reduced, lang])

  const marqueeItems = useMemo(
    () => ['Vínarbrauð', 'Súrdeigsbrauð', 'Snúður', 'Kanillengja', 'Pistasíusnúður', 'Kleina', 'Rúgbrauð', 'Skúffukaka'],
    [],
  )

  // Gallery lightbox: null when closed, otherwise the open photo's index.
  const [lightbox, setLightbox] = useState<number | null>(null)
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

      {/* ===================== MASTHEAD ===================== */}
      <header style={{ position: 'relative', zIndex: 5, padding: '20px clamp(20px,4.5vw,72px) 0' }}>
        <div style={{ ...wrap, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <img src={LOGO} alt="Reynir bakari" width={132} height={57} decoding="async" style={{ width: 132, height: 'auto', display: 'block' }} />
          <nav className="rb-nav-links" style={{ display: 'flex', gap: 26, alignItems: 'center' }}>
            <a href="#menu" className="rb-navlink">{t.navMenu}</a>
            <a href="#bread" className="rb-navlink">{t.navBread}</a>
            <a href="#gallery" className="rb-navlink">{t.navGallery}</a>
            {/* a real destination, not an anchor: clicking "Panta" means ordering */}
            <Link to={ORDER_PATH} className="rb-navlink">{ORDER_T[lang].navOrder}</Link>
            <a href="#story" className="rb-navlink">{t.navStory}</a>
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

            <h1 className="rb-enter-2" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(46px, 9.5vw, 134px)', lineHeight: 0.98, letterSpacing: '.02em', margin: 'clamp(16px,3vh,30px) 0 0', ...GOLD_TEXT }}>
              {heroTitle[lang]}
            </h1>

            <p className="rb-enter-3" style={{ fontStyle: 'italic', fontSize: 'clamp(17px,1.9vw,23px)', color: IVORY, margin: 'clamp(16px,2.5vh,24px) 0 0', lineHeight: 1.5, maxWidth: '30ch' }}>
              {heroSub[lang]}
            </p>
            <p className="rb-enter-3" style={{ fontSize: 'clamp(14.5px,1.2vw,16px)', color: DIM, margin: '12px 0 0', maxWidth: '40ch', lineHeight: 1.6 }}>
              {heroLine[lang]}
            </p>

            <div className="rb-cover-ctas rb-enter-4" style={{ display: 'flex', gap: 14, marginTop: 'clamp(24px,3.5vh,36px)' }}>
              <a href={LINKS.order} target="_blank" rel="noreferrer" className="rb-cta rb-cta-gold">{t.orderPrimary}</a>
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
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(34px,4.6vw,62px)', lineHeight: 1.03, margin: '18px 0 0', ...GOLD_TEXT }}>{t.ovenTitle}</h2>
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
                <h3 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(34px,5vw,64px)', margin: 0, ...GOLD_TEXT }}>{FEATURE.name}</h3>
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
                <div style={{ borderRadius: 10, overflow: 'hidden', aspectRatio: '1 / 1' }}>
                  <img
                    src={PRODUCT_IMG}
                    alt={lang === 'en' ? 'A Reynir pistachio snúður torn open, gooey pistachio glaze stretching between the halves' : 'Pistasíusnúður frá Reyni rifinn í sundur, pistasíugljái teygist á milli helminganna'}
                    loading="lazy"
                    decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              </figure>
            </div>
          </div>

          {/* the menu, as an editorial list with dotted price leaders */}
          <div className="rb-menu-cols" data-reveal style={{ ...revealInit(reduced, 0.12), display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 'clamp(40px,6vw,88px)', rowGap: 0, marginTop: 'clamp(36px,5vh,56px)' }}>
            {MENU.map((item) => (
              <MenuRow key={item.name} item={item} lang={lang} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== STATEMENT (burgundy) ===================== */}
      <section id="story" style={{ background: BURGUNDY, padding: 'clamp(96px,15vh,180px) clamp(20px,4.5vw,72px)' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div data-reveal style={{ ...revealInit(reduced), fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD_LIGHT }}>
            {t.statementKicker}
          </div>
          <blockquote data-reveal style={{ ...revealInit(reduced, 0.08), fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(34px,5.4vw,76px)', lineHeight: 1.12, letterSpacing: '.005em', color: IVORY, margin: '24px 0 0' }}>
            “{statementQuote[lang]}”
          </blockquote>
          <div data-reveal style={{ ...revealInit(reduced, 0.14), fontSize: 14, color: 'rgba(243,234,211,.7)', marginTop: 22 }}>{statementWho[lang]}</div>

          <div data-reveal style={{ ...revealInit(reduced, 0.2), display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(24px,4vw,64px)', marginTop: 'clamp(48px,7vh,88px)', maxWidth: 820 }} className="rb-catering-grid">
            <p style={{ fontSize: 16.5, lineHeight: 1.75, color: 'rgba(243,234,211,.86)', margin: 0 }}>{storyP1[lang]}</p>
            <p style={{ fontSize: 16.5, lineHeight: 1.75, color: 'rgba(243,234,211,.86)', margin: 0 }}>{storyP2[lang]}</p>
          </div>
        </div>
      </section>

      {/* ===================== BREAD BOARD ===================== */}
      <section id="bread" style={{ background: INK_DEEP, padding: sectionPad }}>
        <div style={wrap}>
          <div data-reveal style={{ ...revealInit(reduced), display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap', borderTop: `1px solid ${HAIR}`, paddingTop: 16 }}>
            <div style={{ maxWidth: 620 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD }}>{t.breadKicker}</div>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(34px,4.8vw,64px)', lineHeight: 1.03, margin: '16px 0 0', ...GOLD_TEXT }}>{t.breadTitle}</h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: DIM, margin: '16px 0 0' }}>{t.breadIntro}</p>
            </div>
            <div style={{ fontSize: 13.5, color: FAINT, fontStyle: 'italic' }}>{t.breadNote}</div>
          </div>

          <div className="rb-bread-grid" data-reveal style={{ ...revealInit(reduced, 0.12), display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 'clamp(40px,6vw,88px)', marginTop: 'clamp(36px,5vh,56px)' }}>
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
      </section>

      {/* ===================== GALLERY ===================== */}
      <section id="gallery" style={{ background: INK, padding: sectionPad }}>
        <div style={wrap}>
          <div data-reveal style={{ ...revealInit(reduced), borderTop: `1px solid ${HAIR}`, paddingTop: 16, maxWidth: 640 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD }}>{t.galleryKicker}</div>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(34px,4.6vw,62px)', lineHeight: 1.03, margin: '18px 0 0', ...GOLD_TEXT }}>{t.galleryTitle}</h2>
            <p style={{ fontSize: 16, color: DIM, margin: '16px 0 0', lineHeight: 1.65 }}>{t.galleryIntro}</p>
          </div>

          <div className="rb-gallery-grid" style={{ marginTop: 'clamp(32px,5vh,52px)' }}>
            {GALLERY.map((photo, i) => (
              <GalleryTile key={photo.src} photo={photo} lang={lang} onOpen={() => setLightbox(i)} style={revealInit(reduced, (i % 4) * 0.07)} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CAKES & CATERING + REVIEW ===================== */}
      <section style={{ background: INK_WARM, padding: sectionPad }}>
        <div style={wrap}>
          <div className="rb-catering-grid" data-reveal style={{ ...revealInit(reduced), display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(28px,5vw,80px)', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD }}>{t.cateringKicker}</div>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(30px,3.6vw,50px)', margin: '16px 0 0', ...GOLD_TEXT }}>{t.cateringTitle}</h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: DIM, margin: '16px 0 0', maxWidth: '46ch' }}>{t.cateringBody}</p>
              <a href={`mailto:${LINKS.orderEmail}`} className="rb-cta rb-cta-ghost" style={{ marginTop: 'clamp(20px,3vh,28px)' }}>{t.cateringCta}</a>
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

      {/* ===================== VISIT STRIP ===================== */}
      <section id="visit" style={{ background: INK, padding: sectionPad }}>
        <div style={wrap}>
          <div className="rb-visit-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,80px)', alignItems: 'start' }}>
            <div data-reveal style={revealInit(reduced)}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD, borderTop: `1px solid ${HAIR}`, paddingTop: 16 }}>{t.visitKicker}</div>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(38px,5vw,72px)', lineHeight: 1.02, margin: '18px 0 0', ...GOLD_TEXT }}>{t.visitTitle}</h2>
              <a href={LINKS.order} target="_blank" rel="noreferrer" className="rb-cta rb-cta-gold" style={{ marginTop: 'clamp(24px,4vh,36px)' }}>{t.orderPrimary}</a>
              <p style={{ fontSize: 14.5, color: DIM, margin: '18px 0 0', lineHeight: 1.6, maxWidth: '34ch' }}>{t.deliveryNote}</p>

              {/* The room itself, above the map: their own wall of framed
                  black-and-white bakery photographs and the tables you can
                  sit at. A map says where; this says what it is like. */}
              <figure style={{ margin: 'clamp(24px,3.5vh,32px) 0 0', borderRadius: 4, overflow: 'hidden', border: `1px solid ${HAIR}` }}>
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

              {/* the map fills this column's dead space, opposite the addresses */}
              <MapCard
                lang={lang}
                locations={[
                  { label: t.mainLabel, address: mainName, query: 'Reynir bakari, Dalvegur 4, 201 Kópavogur' },
                ]}
              />
            </div>

            <div data-reveal style={{ ...revealInit(reduced, 0.1), display: 'grid', gap: 26 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: GOLD }}>{t.mainLabel}</div>
                <div style={{ fontFamily: DISPLAY, fontSize: 'clamp(22px,2.4vw,28px)', color: IVORY, marginTop: 8 }}>{mainName}</div>
                <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
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
              </div>
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
            <div style={{ display: 'flex', gap: 18, justifyContent: 'flex-end', marginTop: 6 }}>
              <a href={LINKS.instagram} target="_blank" rel="noreferrer" className="rb-foot-link">Instagram</a>
              <a href={LINKS.facebook} target="_blank" rel="noreferrer" className="rb-foot-link">Facebook</a>
              <a href={LINKS.order} target="_blank" rel="noreferrer" className="rb-foot-link">aha.is</a>
            </div>
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

      <PreviewChrome company={company} />
      <PreviewFooter company={company} />
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
