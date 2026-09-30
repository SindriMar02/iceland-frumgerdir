import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CONTACT, T, UNIT_LABEL, img, pad2, path, type Lang } from './data'
import { Arrow, CatalogSection, Ring } from './Catalog'
import { useList } from './store'
import { SetLogo } from './Logo'

/* ------------------------------------------------------------------ hero */
function Hero({ lang, ringOn }: { lang: Lang; ringOn: boolean }) {
  const t = T[lang].hero
  return (
    <section className="set-hero" aria-labelledby="set-h1" data-set-hero="">
      <div className="set-hero__text">
        <div className="set-hero__mark" data-set-fade=""><SetLogo /></div>
        <p className="set-hero__kicker set-label" data-set-fade="">{t.kicker}</p>
        <h1 className="set-h" id="set-h1" data-set-words="">{t.h1}</h1>
        <p className="set-hero__sub set-lede" data-set-fade="" data-set-i="4">{t.sub}</p>
        <div className="set-hero__cta" data-set-fade="" data-set-i="6">
          <a className="set-btn" href="#vorur">{t.cta}<Arrow /></a>
          <Link className="set-ringlink" to={path(lang, 'list')}><Ring />{t.cta2}</Link>
        </div>
      </div>
      <figure className="set-hero__fig">
        <div className="set-hero__frame">
          <img src={img('extruder', 1600)} srcSet={`${img('extruder', 800)} 800w, ${img('extruder', 1600)} 1536w`} sizes="(max-width: 900px) 100vw, 42vw"
            alt={t.alt} width={1536} height={2048} {...{ fetchpriority: "high" }} data-set-drift="" />
          {/* the ring device, drawn round the pipe in the welder's clamps; same box and crop as the photo (slice = cover) */}
          <svg className={`set-hero__ring${ringOn ? ' is-on' : ''}`} viewBox="0 0 1536 2048" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <ellipse cx="697" cy="1022" rx="540" ry="500" pathLength={1} transform="rotate(-90 697 1022)" />
            <ellipse cx="697" cy="1022" rx="540" ry="500" pathLength={1} transform="rotate(-90 697 1022)" />
          </svg>
        </div>
        <figcaption className="set-cap">{t.cap}</figcaption>
      </figure>
    </section>
  )
}

/* ------------------------------------------------------------------ numbered accordion (image 2) */
function How({ lang }: { lang: Lang }) {
  const t = T[lang].how
  const [open, setOpen] = useState(0)
  return (
    <section className="set-how" id="thjonusta" aria-labelledby="set-how-h">
      <div className="set-how__head">
        <h2 className="set-d" id="set-how-h" data-set-mask="" data-set-fit="">{t.title}</h2>
        <a className="set-btn" href={`mailto:${CONTACT.sales}`}>{t.contact}<Arrow /></a>
      </div>
      <ol className="set-how__list">
        {t.items.map((it, i) => {
          const on = open === i
          return (
            <li key={it.t} className={`set-acc${on ? ' is-open' : ''}`} data-set-fade="" data-set-i={i}>
              <h3>
                <button type="button" className="set-acc__btn" aria-expanded={on} aria-controls={`set-acc-${i}`} id={`set-acc-b-${i}`} onClick={() => setOpen(on ? -1 : i)}>
                  <span className="set-acc__n">{pad2(i + 1)}</span>
                  <span className="set-acc__t">{it.t}</span>
                  <span className="set-acc__pm" aria-hidden="true" />
                </button>
              </h3>
              <div className="set-acc__panel" id={`set-acc-${i}`} role="region" aria-labelledby={`set-acc-b-${i}`}>
                <div>
                  <p className="set-acc__body">
                    {it.b}
                    {it.link && <> <a className="set-link" href={it.link[1]} target="_blank" rel="noopener" tabIndex={on ? 0 : -1}>{it.link[0]}</a></>}
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
    <section className="set-rail" id="framleidsla" aria-labelledby="set-rail-h">
      <div className="set-rail__head">
        <h2 className="set-d" id="set-rail-h" data-set-mask="" data-set-fit="">{t.title}</h2>
        <p className="set-lede" data-set-words="">{t.lead}</p>
        <div className="set-rail__arrows">
          <button type="button" onClick={() => go(on - 1)} disabled={on === 0} aria-label={t.prev}><Ring dir="left" /></button>
          <button type="button" onClick={() => go(on + 1)} disabled={on === t.items.length - 1} aria-label={t.next}><Ring /></button>
        </div>
      </div>
      <div className="set-rail__track" ref={track} role="list">
        {t.items.map((it, i) => {
          const active = on === i
          return (
            <article key={it.t} role="listitem" className={`set-rc${active ? ' is-on set-dark' : ''}`} aria-current={active ? 'true' : undefined}
              onPointerEnter={(e) => { if (e.pointerType === 'mouse') setOn(i) }} onClick={() => setOn(i)} onFocus={() => setOn(i)}
              data-set-fade="" data-set-i={i}>
              <div className="set-rc__top">
                <span className="set-rc__n">{pad2(i + 1)}</span>
                <svg className="set-rc__arr" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5" /></svg>
              </div>
              <div className="set-rc__media">
                {it.img
                  ? <img src={img(it.img, 800)} srcSet={`${img(it.img, 800)} 800w, ${img(it.img, 1600)} 1600w`} sizes="(max-width: 900px) 80vw, 50vw" alt={it.alt ?? ''} loading="lazy" decoding="async" />
                  : <div className="set-rc__noimg"><RailRing /></div>}
              </div>
              <div className="set-rc__body">
                <p className="set-rc__y">{it.y}</p>
                <h3 className="set-rc__t">
                  <button type="button" onClick={() => setOn(i)} style={{ textAlign: 'left', textTransform: 'inherit', font: 'inherit', letterSpacing: 'inherit' }} aria-expanded={active}>{it.t}</button>
                </h3>
                <p className="set-rc__b">{it.b}</p>
                {it.cap && <p className="set-rc__cap">{it.cap}</p>}
                {it.links && <p className="set-rc__links">{it.links.map(([l, h]) => <a key={h} href={h} target="_blank" rel="noopener" tabIndex={active ? 0 : -1}>{l}</a>)}</p>}
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
    <section className="set-teaser" aria-labelledby="set-teaser-h">
      <div className="set-teaser__text">
        <h2 className="set-d" id="set-teaser-h" data-set-mask="" data-set-fit="">{t.title}</h2>
        <p className="set-lede" style={{ color: 'var(--ink)' }} data-set-fade="">{t.body}</p>
        <Link className="set-btn" to={path(lang, 'list')}>{t.cta}<Arrow /></Link>
        <Link className="set-ringlink" to={path(lang, 'review')}><Ring />{t.staff}</Link>
        <p className="set-teaser__note">{t.note}</p>
      </div>
      <ul className="set-teaser__list" aria-label={T[lang].list.h1} data-set-fade="">
        {lines.map((l) => <li key={l.sku}><b style={{ fontWeight: 500 }}>{l.name}</b><span>{l.sku} · {l.qty} {UNIT_LABEL[lang][l.unit]}</span></li>)}
        <li className="set-teaser__foot set-dark">
          <span style={{ color: '#fff' }}>{T[lang].list.sum.items(list.lines.length)}</span>
          <SetLogo className="" />
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
