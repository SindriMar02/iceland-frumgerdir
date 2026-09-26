import { useState } from 'react'
import { IMG, REVIEWS, REVIEWS_PAGE, GOOGLE_REVIEWS, TRIPADVISOR, BOOKING_URL } from './data'
import type { Review } from './data'
import { PageHero, Photo, Title } from './shell'

/* /umsagnir, v4: one review per spread, the words set large in the serif,
   the photograph of what the guest is talking about beside it. Verbatim and
   attributed; the Icelandic is a translation the reader asks for. */

export const REVIEWS_CSS = `
.bj3 .rvs{padding:clamp(40px,6vw,96px) 0 var(--sec)}
.bj3 .rv{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,4fr);gap:clamp(28px,6vw,110px);align-items:center;padding:clamp(56px,7vw,112px) 0;border-bottom:1px solid var(--line)}
.bj3 .rv:nth-child(even){grid-template-columns:minmax(0,4fr) minmax(0,7fr)}
.bj3 .rv:nth-child(even) .rv-photo{order:-1}
.bj3 .rv blockquote{margin:0}
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
  const [is, setIs] = useState(false)
  const open = r.lang === 'en' ? '“' : '„'
  const close = r.lang === 'en' ? '”' : '“'
  const shown = is ? r.is : r.text
  return (
    <article className="rv" aria-labelledby={`rv-${r.id}`}>
      <div>
        <blockquote className="rv-up" lang={is ? 'is' : r.lang}>
          {r.title && !is && <p className="title">{r.title}</p>}
          <p key={String(is)} className="q">{is ? '„' : open}{shown}{r.excerpt ? ' …' : ''}{is ? '“' : close}</p>
        </blockquote>
        <div className="who rv-up">
          <span><strong id={`rv-${r.id}`}>{r.name}</strong>, {r.source}, {r.when.toLowerCase()}</span>
          <button type="button" className="toggle" aria-pressed={is} onClick={() => setIs((v) => !v)}>
            {is ? REVIEWS_PAGE.original : REVIEWS_PAGE.translate}
          </button>
        </div>
      </div>
      <Photo pic={IMG[r.pic]} sizes="(max-width: 899px) 92vw, 34vw" ratio="4 / 5" className="rv-photo rv-settle" />
    </article>
  )
}

export function Reviews() {
  return (
    <>
      <PageHero pic={IMG.lounge} title={REVIEWS_PAGE.title} sub={REVIEWS_PAGE.sub} id="bj3-rv-h1" />
      <div className="over">
        <section className="rvs" aria-label="Umsagnir">
          <div className="wrap">
            {REVIEWS.map((r) => <Item key={r.id} r={r} />)}
            <div className="rvs-foot">
              <div style={{ display: 'grid', gap: 14 }}>
                <Title text={REVIEWS_PAGE.more} />
                <p className="small mute rv-up">{REVIEWS_PAGE.photoNote}</p>
              </div>
              <div className="links rv-up">
                <a className="pill pill-ink" href={GOOGLE_REVIEWS} target="_blank" rel="noreferrer">{REVIEWS_PAGE.google}</a>
                <a className="pill pill-ink" href={TRIPADVISOR} target="_blank" rel="noreferrer">{REVIEWS_PAGE.tripadvisor}</a>
                <a className="pill pill-solid" href={BOOKING_URL} target="_blank" rel="noreferrer">Bóka gistingu</a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
