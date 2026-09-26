import { useState } from 'react'
import { IMG, REVIEWS, GOOGLE_REVIEWS, TRIPADVISOR } from './data'
import type { Review } from './data'
import { PageHero, Photo, Stars, Title, useNavTo } from './shell'
import { useSite } from './site'
import { sectionHref } from './paths'

/* /umsagnir, v4: one review per spread, the words set large in the serif,
   the photograph of what the guest is talking about beside it. Verbatim and
   attributed; the Icelandic is a translation the reader asks for. */

export const REVIEWS_CSS = `
.bj3 .rvs{padding:clamp(40px,6vw,96px) 0 var(--sec)}
.bj3 .rv{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,4fr);gap:clamp(28px,6vw,110px);align-items:center;padding:clamp(56px,7vw,112px) 0;border-bottom:1px solid var(--line)}
.bj3 .rv:nth-child(even){grid-template-columns:minmax(0,4fr) minmax(0,7fr)}
.bj3 .rv:nth-child(even) .rv-photo{order:-1}
.bj3 .rv blockquote{margin:0}
.bj3 .rv .stars{margin-bottom:16px}
.bj3 .rv .title{font-family:var(--sans);font-weight:560;font-size:1rem;margin-bottom:14px}
.bj3 .rv .q{font-family:var(--serif);font-weight:300;font-size:clamp(1.5rem,2.6vw,2.4rem);line-height:1.24;letter-spacing:-.01em;animation:bj3-fade .25s ease-out both}
.bj3 .rv .who{display:flex;flex-wrap:wrap;align-items:center;gap:6px 22px;margin-top:clamp(22px,2.6vw,34px);font-size:.95rem;color:var(--mute)}
.bj3 .rv .who strong{color:var(--ink);font-weight:560}
.bj3 .rv .toggle{all:unset;cursor:pointer;display:inline-flex;align-items:center;min-height:44px;font-weight:520;color:var(--ink);text-decoration:underline;text-underline-offset:.28em;text-decoration-thickness:1px}
.bj3 .rv .toggle:hover{text-decoration-thickness:2px}
.bj3 .rv .toggle:focus-visible{outline:2px solid var(--band);outline-offset:3px}
.bj3 .rv-photo{border-radius:var(--r)}
.bj3 .rvs-foot{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:28px 48px;align-items:end;margin-top:clamp(64px,8vw,112px)}
.bj3 .rvs-foot .links{display:flex;flex-wrap:wrap;gap:12px}
@media (max-width:899px){
  .bj3 .rv,.bj3 .rv:nth-child(even){grid-template-columns:1fr}
  .bj3 .rv .rv-photo,.bj3 .rv:nth-child(even) .rv-photo{order:-1;aspect-ratio:3/2 !important}
  .bj3 .rvs-foot{grid-template-columns:1fr}
}
`

function Item({ r }: { r: Review }) {
  const { t, lang } = useSite()
  const [tr, setTr] = useState(false)
  /* Icelandic readers can have every review in Icelandic; English readers only need
     the ones not written in English */
  const translation = lang === 'is' ? r.is : r.lang === 'en' ? null : r.en ?? null
  const showing = tr && translation ? translation : r.text
  const shownLang = tr && translation ? lang : r.lang
  const title = tr && translation ? (lang === 'en' ? r.enTitle : undefined) : r.title
  const open = shownLang === 'is' || shownLang === 'de' ? '„' : '“'
  const close = shownLang === 'is' || shownLang === 'de' ? '“' : '”'
  return (
    <article className="rv" aria-labelledby={`rv-${r.id}`}>
      <div>
        {r.stars ? <Stars n={r.stars} label={t.ui.starsLabel(r.stars)} /> : null}
        <blockquote className="rv-up" lang={shownLang}>
          {title ? <p className="title">{title}</p> : null}
          <p key={String(tr)} className="q">{open}{showing}{r.excerpt ? ' …' : ''}{close}</p>
        </blockquote>
        <div className="who rv-up">
          <span><strong id={`rv-${r.id}`}>{r.name}</strong>, {r.source}, {r.when[lang]}</span>
          {translation ? (
            <button type="button" className="toggle" aria-pressed={tr} onClick={() => setTr((v) => !v)}>
              {tr ? t.reviewsPage.original : t.reviewsPage.translate}
            </button>
          ) : null}
        </div>
      </div>
      <Photo pic={IMG[r.pic]} sizes="(max-width: 899px) 92vw, 34vw" ratio="4 / 5" className="rv-photo rv-settle" />
    </article>
  )
}

export function Reviews() {
  const { t, lang } = useSite()
  const navTo = useNavTo()
  const book = sectionHref(lang, 'booking')
  return (
    <>
      <PageHero pic={IMG.lounge} title={t.reviewsPage.title} sub={t.reviewsPage.sub} id="bj3-rv-h1" />
      <div className="over">
        <section className="rvs" aria-label={t.meta.reviews.title.split(' | ')[0]}>
          <div className="wrap">
            {REVIEWS.map((r) => <Item key={r.id} r={r} />)}
            <div className="rvs-foot">
              <div style={{ display: 'grid', gap: 14 }}>
                <Title text={t.reviewsPage.more} />
                <p className="small mute rv-up">{t.reviewsPage.photoNote}</p>
              </div>
              <div className="links rv-up">
                <a className="pill pill-ink" href={GOOGLE_REVIEWS} target="_blank" rel="noopener">{t.reviewsPage.google}</a>
                <a className="pill pill-ink" href={TRIPADVISOR} target="_blank" rel="noopener">{t.reviewsPage.tripadvisor}</a>
                <a className="pill pill-solid" href={book} onClick={(e) => navTo(book, e)}>{t.ui.bookStay}</a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
