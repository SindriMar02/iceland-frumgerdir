/**
 * Reynir bakarí — the story and the photographic archive, on their own route.
 *
 * WHY THIS PAGE EXISTS
 * The landing page has to sell: what is baked, what it costs, when they are
 * open, how to order. The bakery's actual story — a family who have run the
 * same ovens on Dalvegur since 1994 — and a professional shoot of an entire
 * working morning were both being compressed into that sales flow, which
 * serves neither. The landing page keeps a short version of each, and links
 * here; this page gives both room.
 *
 * THE PHOTOGRAPHS ARE THE ARGUMENT
 * The landing page shows the archive as a horizontal filmstrip, which reads
 * as "there are more of these" — a teaser. Here it becomes a full masonry
 * wall in the photographer's own black-and-white, because on this page the
 * pictures are the content rather than an accent, and a visitor who followed
 * a link called "see all photographs" came to look at all of them.
 *
 * Everything is bilingual and CMS-backed on exactly the same terms as the
 * landing page: the story paragraphs and the gallery captions are the owner's
 * to edit, and this page reads whatever he sets.
 */

import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import Chrome from './Chrome'
import { HOME_PATH } from './paths'
import { setThemeColor } from '../../lib/preview'
import { T, type GalleryPhoto, LOGO, STORY_ART } from './data'
import { useLang } from './useLang'
import { SiteContentProvider, useSiteContent } from './sanity'
import {
  ARCHIVAL, ARCHIVAL_LIVE, BODY, BURGUNDY, DIM, DISPLAY, EASE, FAINT, GOLD, GOLD_LIGHT,
  GOLD_TEXT, HAIR, HAIR_SOFT, INK, INK_DEEP, IVORY, LETTERPRESS,
} from './tokens'


const CSS = `
  /* Safari 26 tints its chrome from body's background-color (theme-color is
     ignored since Liquid Glass) — without this the status-bar strip is WHITE
     on this ink-dark page. See [[ios-safe-area-chrome-color]]. */
  html, body { background-color:${INK}; }
  .rb-st ::selection { background:${BURGUNDY}; color:${IVORY}; }
  .rb-st a:focus-visible, .rb-st button:focus-visible { outline:2px solid ${GOLD}; outline-offset:3px; border-radius:4px; }

  /* the same paper grain as the landing page, so the two feel like one site */
  .rb-st::after { content:''; position:fixed; inset:0; z-index:200; pointer-events:none;
    opacity:.055; mix-blend-mode:overlay;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
    background-size:200px 200px; }

  .rb-st-bar { position:sticky; top:0; z-index:150; display:flex; align-items:center;
    justify-content:space-between; gap:20px; padding:calc(14px + env(safe-area-inset-top, 0px)) clamp(20px,4.5vw,72px) 14px;
    background-color:${INK}; border-bottom:1px solid ${HAIR_SOFT}; }
  .rb-st-back { display:inline-flex; align-items:center; gap:8px; text-decoration:none;
    font-family:${BODY}; font-size:14px; color:${DIM}; padding:10px 0; transition:color .2s ${EASE}; }
  .rb-st-back:hover { color:${GOLD_LIGHT}; font-style:italic; }
  .rb-st-lang { background:none; border:none; cursor:pointer; padding:14px 13px; margin:-14px -13px;
    font-family:${BODY}; font-size:13px; letter-spacing:.08em; color:${FAINT};
    transition:color .2s ${EASE}; border-radius:4px; }
  .rb-st-lang[aria-pressed="true"] { color:${GOLD_LIGHT}; }

  /* ── the archive wall ───────────────────────────────────────────────────
     CSS columns rather than grid: the frames are a mix of portrait and
     landscape, and columns let each keep its own height instead of being
     cropped into a uniform cell. */
  .rb-st-wall { column-count:3; column-gap:14px; }
  .rb-st-item { break-inside:avoid; margin:0 0 14px; padding:0; border:0; display:block; width:100%;
    position:relative; overflow:hidden; border-radius:3px; cursor:zoom-in; background:${INK_DEEP}; }
  .rb-st-item img { width:100%; height:auto; display:block; filter:${ARCHIVAL};
    transition:transform .6s ${EASE}, filter .6s ${EASE}; }
  .rb-st-item:hover img, .rb-st-item:focus-visible img { transform:scale(1.03); filter:${ARCHIVAL_LIVE}; }
  .rb-st-item::after { content:''; position:absolute; inset:0; border-radius:3px;
    border:1px solid rgba(238,211,170,0); transition:border-color .3s ${EASE}; pointer-events:none; }
  .rb-st-item:hover::after, .rb-st-item:focus-visible::after { border-color:rgba(238,211,170,.4); }
  @media (max-width:900px) { .rb-st-wall { column-count:2; } }
  @media (max-width:560px) { .rb-st-wall { column-count:1; } }

  .rb-st-chapter { display:grid; grid-template-columns:1fr 1fr; gap:clamp(28px,5vw,72px); align-items:center; }
  .rb-st-chapter img { width:100%; height:auto; display:block; border-radius:3px; filter:${ARCHIVAL}; }
  @media (max-width:820px) { .rb-st-chapter { grid-template-columns:1fr; } }

  .rb-lightbox { position:fixed; inset:0; z-index:300; background:rgba(11,10,9,.94);
    padding-top:env(safe-area-inset-top, 0px);
    display:flex; align-items:center; justify-content:center; padding:clamp(16px,5vh,56px);
    animation:rb-st-lb-in .28s ${EASE} both; }
  @keyframes rb-st-lb-in { from { opacity:0; } to { opacity:1; } }
  .rb-lightbox-fig { margin:0; max-width:min(92vw,1100px); max-height:88vh; display:flex;
    flex-direction:column; align-items:center; gap:14px; }
  .rb-lightbox-fig img { max-width:100%; max-height:74vh; width:auto; height:auto; display:block;
    border-radius:3px; box-shadow:0 40px 90px -20px rgba(0,0,0,.7); }
  .rb-lightbox-cap { font-family:${BODY}; font-style:italic; font-size:15px; color:${IVORY}; text-align:center; }
  .rb-lb-btn { position:absolute; background:rgba(19,19,19,.55); border:1px solid rgba(238,211,170,.22);
    color:${IVORY}; width:44px; height:44px; border-radius:50%; display:flex; align-items:center;
    justify-content:center; cursor:pointer; transition:background .2s ${EASE}, border-color .2s ${EASE}; }
  .rb-lb-btn:hover { background:rgba(200,168,119,.16); border-color:${GOLD}; }
  .rb-lb-close { top:clamp(10px,2vh,28px); right:clamp(10px,2vw,28px); }
  .rb-lb-prev { left:clamp(6px,1.5vw,20px); top:50%; transform:translateY(-50%); }
  .rb-lb-next { right:clamp(6px,1.5vw,20px); top:50%; transform:translateY(-50%); }

  @media (prefers-reduced-motion: reduce) {
    .rb-st-item img { transition:none; }
    .rb-st-item:hover img { transform:none; }
    .rb-lightbox { animation:none; }
  }
`

function StoryPageInner() {
  const [lang, setLang] = useLang()
  const t = T[lang]
  const { GALLERY, statementQuote, statementWho, storyP1, storyP2 } = useSiteContent()
  const [lightbox, setLightbox] = useState<number | null>(null)

  useEffect(() => { setThemeColor(INK) }, [])

  // Escape closes, arrows step. A gallery you cannot leave with the keyboard
  // is a trap for anyone not using a mouse.
  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') setLightbox((i) => (i === null ? i : (i + 1) % GALLERY.length))
      if (e.key === 'ArrowLeft') setLightbox((i) => (i === null ? i : (i - 1 + GALLERY.length) % GALLERY.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, GALLERY])

  const wrap: CSSProperties = { maxWidth: 1180, margin: '0 auto' }
  const pad = 'clamp(64px,9vh,110px) clamp(20px,4.5vw,72px)'

  return (
    <div className="rb-st" style={{ background: INK, color: IVORY, fontFamily: BODY, minHeight: '100svh' }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="rb-st-bar">
        <Link to={HOME_PATH} className="rb-st-back">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t.storyBack}
        </Link>
        <img src={LOGO} alt="Reynir bakari" width={132} height={57} decoding="async" style={{ width: 92, height: 'auto' }} />
        <div role="group" aria-label="Language" style={{ display: 'flex', gap: 2 }}>
          <button className="rb-st-lang" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
          <span aria-hidden="true" style={{ color: FAINT, alignSelf: 'center' }}>/</span>
          <button className="rb-st-lang" aria-pressed={lang === 'is'} onClick={() => setLang('is')}>ÍS</button>
        </div>
      </div>

      {/* the opening frame, full width — the same oven that opens the story
          section on the landing page, given the room it deserves here */}
      <section style={{ position: 'relative', height: 'clamp(300px,52vh,560px)', overflow: 'hidden', background: INK_DEEP }}>
        <img
          src={STORY_ART.open.src}
          alt=""
          aria-hidden="true"
          width={STORY_ART.open.w}
          height={STORY_ART.open.h}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: ARCHIVAL }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(11,10,9,.92) 0%, rgba(11,10,9,.2) 55%, rgba(11,10,9,.5) 100%)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 'clamp(24px,4vw,56px) clamp(20px,4.5vw,72px)' }}>
          <div style={{ ...wrap }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD }}>
              {t.storyPageKicker}
            </div>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(32px,5vw,68px)', lineHeight: 1.04, margin: '14px 0 0', ...GOLD_TEXT, ...LETTERPRESS }}>
              {t.storyPageTitle}
            </h1>
          </div>
        </div>
      </section>

      {/* the story itself */}
      <section style={{ background: INK, padding: pad }}>
        <div style={wrap}>
          <p style={{ fontSize: 'clamp(17px,1.9vw,21px)', lineHeight: 1.7, color: 'rgba(243,234,211,.86)', margin: 0, maxWidth: '62ch' }}>
            {t.storyPageLead}
          </p>

          <div className="rb-st-chapter" style={{ marginTop: 'clamp(48px,7vh,88px)' }}>
            <div>
              <p style={{ fontSize: 16.5, lineHeight: 1.75, color: DIM, margin: 0 }}>{storyP1[lang]}</p>
            </div>
            <img src={STORY_ART.founding.src} alt="" width={STORY_ART.founding.w} height={STORY_ART.founding.h} loading="lazy" decoding="async" />
          </div>

          <div className="rb-st-chapter" style={{ marginTop: 'clamp(40px,6vh,72px)' }}>
            <img src={STORY_ART.today.src} alt="" width={STORY_ART.today.w} height={STORY_ART.today.h} loading="lazy" decoding="async" style={{ order: -1 }} />
            <div>
              <p style={{ fontSize: 16.5, lineHeight: 1.75, color: DIM, margin: 0 }}>{storyP2[lang]}</p>
            </div>
          </div>
        </div>
      </section>

      {/* the quote, on the burgundy — the one colour break, as on the landing page */}
      <section style={{ background: BURGUNDY, padding: 'clamp(72px,11vh,140px) clamp(20px,4.5vw,72px)' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <blockquote style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(30px,4.8vw,64px)', lineHeight: 1.14, color: IVORY, margin: 0 }}>
            “{statementQuote[lang]}”
          </blockquote>
          <div style={{ fontSize: 14, color: 'rgba(243,234,211,.7)', marginTop: 20 }}>{statementWho[lang]}</div>
        </div>
      </section>

      {/* the full archive */}
      <section style={{ background: INK, padding: pad }}>
        <div style={wrap}>
          <div style={{ borderTop: `1px solid ${HAIR}`, paddingTop: 16 }}>
            <div style={{ maxWidth: 640 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD }}>
                {t.storyPageArchive}
              </div>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(30px,4vw,52px)', lineHeight: 1.03, margin: '18px 0 0', ...GOLD_TEXT, ...LETTERPRESS }}>
                {t.galleryTitle}
              </h2>
              <p style={{ fontSize: 16, color: DIM, margin: '16px 0 0', lineHeight: 1.65 }}>{t.storyPageArchiveIntro}</p>
            </div>
          </div>

          <div className="rb-st-wall" style={{ marginTop: 'clamp(32px,5vh,52px)' }}>
            {GALLERY.map((photo: GalleryPhoto, i: number) => (
              <button
                key={photo.src}
                type="button"
                className="rb-st-item"
                onClick={() => setLightbox(i)}
                aria-label={photo.caption[lang]}
              >
                <img
                  src={photo.srcSm}
                  srcSet={`${photo.srcSm} 800w, ${photo.src} 2000w`}
                  sizes="(max-width:560px) 92vw, (max-width:900px) 46vw, 384px"
                  alt={photo.caption[lang]}
                  loading="lazy"
                  decoding="async"
                  style={{ aspectRatio: `${photo.w} / ${photo.h}` }}
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ background: INK_DEEP, borderTop: `1px solid ${HAIR_SOFT}`, padding: '48px clamp(20px,4.5vw,72px)' }}>
        <div style={{ ...wrap, display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <Link to={HOME_PATH} className="rb-st-back">{t.storyBack}</Link>
          <div style={{ fontSize: 13, color: FAINT }}>Dalvegur 4, 201 Kópavogur</div>
        </div>
      </footer>

      {lightbox !== null && GALLERY[lightbox] && (
        <div className="rb-lightbox" role="dialog" aria-modal="true" aria-label={GALLERY[lightbox].caption[lang]} onClick={() => setLightbox(null)}>
          <button type="button" className="rb-lb-btn rb-lb-close" onClick={() => setLightbox(null)} aria-label={t.galleryClose}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
          <button type="button" className="rb-lb-btn rb-lb-prev" aria-label={t.galleryPrev}
            onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i === null ? i : (i - 1 + GALLERY.length) % GALLERY.length)) }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M11 3L5 9L11 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" className="rb-lb-btn rb-lb-next" aria-label={t.galleryNext}
            onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i === null ? i : (i + 1) % GALLERY.length)) }}>
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

export default function ReynirStoryPage() {
  return (
    <SiteContentProvider>
      <StoryPageInner />
    </SiteContentProvider>
  )
}
