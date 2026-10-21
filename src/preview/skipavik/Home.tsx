import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FAMILIES, PRODUCTS, T, img, pad2, path, type Lang } from './data'
import { Arrow, CatalogSection, Ring } from './Catalog'
import { useList } from './store'
import { SkvLogo } from './Logo'

/* ------------------------------------------------------------------ hero */
function Hero({ lang }: { lang: Lang; ringOn: boolean }) {
  const t = T[lang].hero
  return (
    <section className="skv-hero" aria-labelledby="skv-h1" data-skv-hero="">
      <div className="skv-hero__text">
        <div className="skv-hero__mark" data-skv-fade=""><SkvLogo /></div>
        <p className="skv-hero__kicker skv-label" data-skv-fade="">{t.kicker}</p>
        <h1 className="skv-h" id="skv-h1" data-skv-words="">{t.h1}</h1>
        <p className="skv-hero__sub skv-lede" data-skv-fade="" data-skv-i="4">{t.sub}</p>
        <div className="skv-hero__cta" data-skv-fade="" data-skv-i="6">
          <a className="skv-btn" href="#svid">{t.cta}<Arrow /></a>
          <Link className="skv-ringlink" to={path(lang, 'list')}><Ring />{t.cta2}</Link>
        </div>
        {/* the slipway's published dimensions, set as dimension lines: the one device on this site */}
        <dl className="skv-facts" data-skv-fade="" data-skv-i="7">
          {t.facts.map(([v, u, l]) => (
            <div key={l} className="skv-fact"><dt className="skv-sr">{l}</dt><dd><b className="skv-tnum">{v}</b><span>{u}</span></dd><dd className="skv-fact__l" aria-hidden="true">{l}</dd></div>
          ))}
        </dl>
      </div>
      <figure className="skv-hero__fig">
        <div className="skv-hero__frame">
          <img src={img('yard-aerial', 1600)} srcSet={`${img('yard-aerial', 800)} 800w, ${img('yard-aerial', 1600)} 1600w`} sizes="(max-width: 900px) 100vw, 42vw"
            alt={t.alt} width={1600} height={928} {...{ fetchpriority: 'high' }} data-skv-drift="" style={{ objectPosition: '58% 50%' }} />
        </div>
        <figcaption className="skv-cap">{t.cap}</figcaption>
      </figure>
    </section>
  )
}

/* ------------------------------------------------------------------ numbered accordion (image 2) */
function How({ lang }: { lang: Lang }) {
  const t = T[lang].how
  const [open, setOpen] = useState(0)
  return (
    <section className="skv-how" id="spurt" aria-labelledby="skv-how-h">
      <div className="skv-how__head">
        <h2 className="skv-d" id="skv-how-h" data-skv-mask="" data-skv-fit="">{t.title}</h2>
        <Link className="skv-btn" to={path(lang, 'list')}>{t.contact}<Arrow /></Link>
      </div>
      <ol className="skv-how__list">
        {t.items.map((it, i) => {
          const on = open === i
          return (
            <li key={it.t} className={`skv-acc${on ? ' is-open' : ''}`} data-skv-fade="" data-skv-i={i}>
              <h3>
                <button type="button" className="skv-acc__btn" aria-expanded={on} aria-controls={`skv-acc-${i}`} id={`skv-acc-b-${i}`} onClick={() => setOpen(on ? -1 : i)}>
                  <span className="skv-acc__n">{pad2(i + 1)}</span>
                  <span className="skv-acc__t">{it.t}</span>
                  <span className="skv-acc__pm" aria-hidden="true" />
                </button>
              </h3>
              <div className="skv-acc__panel" id={`skv-acc-${i}`} role="region" aria-labelledby={`skv-acc-b-${i}`}>
                <div>
                  <p className="skv-acc__body">
                    {it.b}
                    {it.link && <> <a className="skv-link" href={it.link[1]} target="_blank" rel="noopener" tabIndex={on ? 0 : -1}>{it.link[0]}</a></>}
                  </p>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

/* ------------------------------------------------------------------ production rail: Whitedesert card-flick */
function RailRing() {
  return <svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="86" /><circle cx="100" cy="100" r="64" /><circle cx="100" cy="100" r="64" strokeDasharray="2 6" /></svg>
}
function Production({ lang }: { lang: Lang }) {
  const t = T[lang].rail
  const [on, setOn] = useState(0)
  const track = useRef<HTMLDivElement>(null)
  const fine = useRef(false)
  useEffect(() => { fine.current = matchMedia('(hover:hover) and (pointer:fine)').matches && window.innerWidth > 900 }, [])
  const go = (i: number) => {
    const n = Math.max(0, Math.min(t.items.length - 1, i))
    setOn(n)
    const el = track.current?.children[n] as HTMLElement | undefined
    if (el && !fine.current) track.current!.scrollTo({ left: el.offsetLeft - track.current!.offsetLeft, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }
  return (
    <section className="skv-rail" id="saga" aria-labelledby="skv-rail-h">
      <div className="skv-rail__head">
        <h2 className="skv-d" id="skv-rail-h" data-skv-mask="" data-skv-fit="">{t.title}</h2>
        <p className="skv-lede" data-skv-words="">{t.lead}</p>
        <div className="skv-rail__arrows">
          <button type="button" onClick={() => go(on - 1)} disabled={on === 0} aria-label={t.prev}><Ring dir="left" /></button>
          <button type="button" onClick={() => go(on + 1)} disabled={on === t.items.length - 1} aria-label={t.next}><Ring /></button>
        </div>
      </div>
      <div className="skv-rail__track" ref={track} role="list">
        {t.items.map((it, i) => {
          const active = on === i
          return (
            <article key={it.t} role="listitem" className={`skv-rc${active ? ' is-on skv-dark' : ''}`} aria-current={active ? 'true' : undefined}
              onPointerEnter={(e) => { if (e.pointerType === 'mouse') setOn(i) }} onClick={() => setOn(i)} onFocus={() => setOn(i)}
              data-skv-fade="" data-skv-i={i}>
              <div className="skv-rc__top">
                <span className="skv-rc__n">{pad2(i + 1)}</span>
                <svg className="skv-rc__arr" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5" /></svg>
              </div>
              <div className="skv-rc__media">
                {it.img
                  ? <img src={img(it.img, 800)} srcSet={`${img(it.img, 800)} 800w, ${img(it.img, 1600)} 1600w`} sizes="(max-width: 900px) 80vw, 50vw" alt={it.alt ?? ''} width={1600} height={1200} loading="lazy" decoding="async" />
                  : <div className="skv-rc__noimg"><RailRing /></div>}
              </div>
              <div className="skv-rc__body">
                <p className="skv-rc__y">{it.y}</p>
                <h3 className="skv-rc__t">
                  <button type="button" onClick={() => setOn(i)} style={{ textAlign: 'left', textTransform: 'inherit', font: 'inherit', letterSpacing: 'inherit' }} aria-expanded={active}>{it.t}</button>
                </h3>
                <p className="skv-rc__b">{it.b}</p>
                {it.cap && <p className="skv-rc__cap">{it.cap}</p>}
                {it.links && <p className="skv-rc__links">{it.links.map(([l, h]) => <a key={h} href={h} target="_blank" rel="noopener" tabIndex={active ? 0 : -1}>{l}</a>)}</p>}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ material list teaser */
function Teaser({ lang }: { lang: Lang }) {
  const t = T[lang].teaser
  const { list } = useList()
  const lines = list.lines.slice(0, 3)
  return (
    <section className="skv-teaser" aria-labelledby="skv-teaser-h">
      <div className="skv-teaser__text">
        <h2 className="skv-d" id="skv-teaser-h" data-skv-mask="" data-skv-fit="">{t.title}</h2>
        <p className="skv-lede" style={{ color: 'var(--ink)' }} data-skv-fade="">{t.body}</p>
        <Link className="skv-btn" to={path(lang, 'list')}>{t.cta}<Arrow /></Link>
        <Link className="skv-ringlink" to={path(lang, 'review')}><Ring />{t.staff}</Link>
        <p className="skv-teaser__note">{t.note}</p>
      </div>
      <ul className="skv-teaser__list" aria-label={T[lang].list.h1} data-skv-fade="">
        {lines.map((l) => { const p = PRODUCTS.find((x) => x.sku === l.sku); const f = FAMILIES.find((x) => x.n === p?.fam); return <li key={l.sku}><b style={{ fontWeight: 500 }}>{l.name}</b><span>{l.sku}{f ? ` · ${f.is}` : ''}</span></li> })}
        <li className="skv-teaser__foot skv-dark">
          <span style={{ color: '#fff' }}>{T[lang].list.sum.items(list.lines.length)}</span>
          <SkvLogo className="" />
        </li>
      </ul>
    </section>
  )
}

export function Home({ lang, ringOn }: { lang: Lang; ringOn: boolean }) {
  return (
    <>
      <Hero lang={lang} ringOn={ringOn} />
      <CatalogSection lang={lang} />
      <How lang={lang} />
      <Production lang={lang} />
      <Teaser lang={lang} />
    </>
  )
}
