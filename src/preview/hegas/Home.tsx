import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CONTACT, MORE_BRANDS, NEWS, NEW_MACHINES, PLATES, STAFF, STAFF_GROUPS, T, UNIT_LABEL, USED, USED_TOTAL, brandSlug, fmtKr, img, isDate, pad2, path, staffImg, tel,
  type Lang,
} from './data'
import { Arrow, CatalogSection, Ring, useCatalog } from './Catalog'
import { useList } from './store'
import { HgLogo } from './Logo'

const srcset = (name: string) => `${img(name, 800)} 800w, ${img(name, 1600)} 1600w`

/* ------------------------------------------------------------------ hero: their own line, their own delivery photo */
function Hero({ lang, ringOn }: { lang: Lang; ringOn: boolean }) {
  const t = T[lang].hero
  return (
    <section className="hg-hero" aria-labelledby="hg-h1" data-hg-hero="">
      <div className="hg-hero__text">
        <div className="hg-hero__mark" data-hg-fade=""><HgLogo tagline={false} /></div>
        <p className="hg-hero__kicker hg-label" data-hg-fade="">{t.kicker}</p>
        <h1 className="hg-h" id="hg-h1" data-hg-words="">{t.h1}</h1>
        <p className="hg-hero__sub hg-lede" data-hg-fade="" data-hg-i="4">{t.sub}</p>
        <div className="hg-hero__cta" data-hg-fade="" data-hg-i="6">
          <a className="hg-btn" href="#vorur">{t.cta}<Arrow /></a>
          <Link className="hg-ringlink" to={path(lang, 'list')}><Ring />{t.cta2}</Link>
        </div>
      </div>
      <figure className="hg-hero__fig">
        <div className="hg-hero__frame">
          <img src={img('magic-light', 1600)} srcSet={srcset('magic-light')} sizes="(max-width: 900px) 100vw, 42vw"
            alt={t.alt} width={1536} height={1086} {...{ fetchpriority: 'high' }} data-hg-drift="" />
          {/* the logo's square: a blue frame with its white inner line draws round the photo once */}
          <svg className={`hg-hero__ring${ringOn ? ' is-on' : ''}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <rect x="3.5" y="3" width="93" height="94" pathLength={1} />
            <rect x="5" y="4.2" width="90" height="91.6" pathLength={1} />
          </svg>
        </div>
        <figcaption className="hg-cap">{t.cap}</figcaption>
      </figure>
    </section>
  )
}

/* ------------------------------------------------------------------ six-plate brand selector (from the Vatt build) */
function BrandPlates({ lang }: { lang: Lang }) {
  const t = T[lang].brands
  const nav = useNavigate()
  const { cat } = useCatalog()
  const [open, setOpen] = useState(0)
  const [fine, setFine] = useState(false)
  useEffect(() => { setFine(matchMedia('(hover: hover) and (pointer: fine)').matches) }, [])
  const count = (key: string) => cat?.products.filter((p) => p.brand === key).length ?? 0
  const act = (i: number) => {
    const b = PLATES[i]
    if (open !== i) { setOpen(i); return }
    if (b.to === 'machines') document.getElementById('velar')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    else nav(path(lang, 'brand', brandSlug(b.key)))
  }
  const others = cat ? [...new Set(cat.products.map((p) => p.brand).filter((b) => b && !PLATES.some((x) => x.key === b)))].sort() : []
  return (
    <section className="hg-brands" id="merki" aria-labelledby="hg-brands-h">
      <div className="hg-brands__head">
        <h2 className="hg-d" id="hg-brands-h" data-hg-mask="" data-hg-fit="">{t.title}</h2>
        <p className="hg-lede" data-hg-words="">{t.lead}</p>
      </div>
      <div className="hg-plates" role="list">
        {PLATES.map((b, i) => (
          <div key={b.key} role="listitem" className="hg-plate" data-open={open === i ? '1' : '0'}>
            <button type="button" onPointerEnter={() => { if (fine) setOpen(i) }} onFocus={() => setOpen(i)} onClick={() => act(i)}
              aria-expanded={open === i} aria-label={`${b.name}: ${b.line}`}>
              <span className="hg-plate__ph" aria-hidden="true"><img src={img(b.img, 800)} srcSet={srcset(b.img)} sizes="(min-width: 900px) 40vw, 100vw" alt="" loading="lazy" decoding="async" /></span>
              <span className="hg-plate__n hg-tnum" aria-hidden="true">{pad2(i + 1)}</span>
              <span className="hg-plate__name" aria-hidden="true">{b.name}</span>
              <span className="hg-plate__line" aria-hidden="true">{b.line}{b.to === 'brand' && cat ? ` · ${t.products(count(b.key))}` : ''}</span>
              <span className="hg-plate__go" aria-hidden="true"><Arrow /></span>
            </button>
          </div>
        ))}
      </div>
      <p className="hg-brands__more">
        <span>{t.note}</span>{' '}
        {others.map((b) => <Link key={b} className="hg-link" to={path(lang, 'brand', brandSlug(b))}>{b}</Link>)}
        {MORE_BRANDS.map(([l, h]) => <a key={h + l} className="hg-link" href={h} target="_blank" rel="noopener">{l}</a>)}
      </p>
    </section>
  )
}

/* ------------------------------------------------------------------ machines: Biesse new, the used list with prices */
function Machines({ lang }: { lang: Lang }) {
  const t = T[lang].machines
  const ask = (m: string) => `mailto:${CONTACT.sales}?subject=${encodeURIComponent(`Fyrirspurn: ${m}`)}&body=${t.askBody(m)}`
  return (
    <section className="hg-mach" id="velar" aria-labelledby="hg-mach-h">
      <div className="hg-mach__head">
        <h2 className="hg-d" id="hg-mach-h" data-hg-mask="" data-hg-fit="">{t.title}</h2>
        <p className="hg-lede" data-hg-words="">{t.lead}</p>
      </div>
      <article className="hg-mach__feature" aria-labelledby="hg-mach-f">
        <figure className="hg-mach__ffig" data-hg-fade="">
          <img src={img('axis-2', 1600)} srcSet={srcset('axis-2')} sizes="(max-width: 900px) 100vw, 58vw" alt="Biesse Rover Cut plötusög komin upp í vinnslusal AXIS; starfsmenn við stjórnborðið" loading="lazy" decoding="async" data-hg-drift="" />
        </figure>
        <div className="hg-mach__ftext">
          <p className="hg-label">{t.feature}</p>
          <h3 className="hg-h" id="hg-mach-f" data-hg-words="">{t.featureT}</h3>
          <p>{t.featureB}</p>
          <a className="hg-link" href={t.featureUrl} target="_blank" rel="noopener">Fréttin á hegas.is</a>
        </div>
      </article>
      <h3 className="hg-mach__sub">{t.newT}</h3>
      <ul className="hg-mach__new" role="list">
        {NEW_MACHINES.map((m, i) => (
          <li key={m.name} className="hg-mcard" data-hg-fade="" data-hg-i={i}>
            <div className="hg-mcard__img"><img src={img(m.img, 800)} alt={`Biesse ${m.name}, ${m.kind.toLowerCase()}`} loading="lazy" decoding="async" /></div>
            <p className="hg-label">{m.kind}</p>
            <h4>{m.name}</h4>
            <p className="hg-mcard__b">{m.body}</p>
            <a className="hg-link" href={ask(`Biesse ${m.name}`)}>{t.ask}<span className="hg-sr">: Biesse {m.name}</span></a>
          </li>
        ))}
      </ul>
      <div className="hg-mach__usedhead">
        <h3 className="hg-mach__sub" style={{ margin: 0 }}>{t.usedT}</h3>
        <p className="hg-help">{t.usedLead(USED_TOTAL)}</p>
      </div>
      <ul className="hg-used" role="list">
        {USED.map((m, i) => (
          <li key={m.name} className="hg-ucard" data-hg-fade="" data-hg-i={i % 5}>
            <div className="hg-ucard__img"><img src={img(m.img, 800)} alt={m.alt} loading="lazy" decoding="async" /></div>
            <h4>{m.name}</h4>
            <p className="hg-ucard__p hg-tnum">{fmtKr(m.price)}</p>
            <a className="hg-link" href={ask(m.name)}>{t.ask}<span className="hg-sr">: {m.name}</span></a>
          </li>
        ))}
      </ul>
      <p className="hg-mach__links">
        <a className="hg-ringlink" href="https://hegas.is/velar-verkfaeri/notadar-velar/" target="_blank" rel="noopener"><Ring />{t.allUsed}</a>
      </p>
    </section>
  )
}

/* ------------------------------------------------------------------ numbered accordion */
function How({ lang }: { lang: Lang }) {
  const t = T[lang].how
  const [open, setOpen] = useState(0)
  return (
    <section className="hg-how" id="thjonusta" aria-labelledby="hg-how-h">
      <div className="hg-how__head">
        <h2 className="hg-d" id="hg-how-h" data-hg-mask="" data-hg-fit="">{t.title}</h2>
        <a className="hg-btn" href={`mailto:${CONTACT.sales}`}>{t.contact}<Arrow /></a>
      </div>
      <ol className="hg-how__list">
        {t.items.map((it, i) => {
          const on = open === i
          return (
            <li key={it.t} className={`hg-acc${on ? ' is-open' : ''}`} data-hg-fade="" data-hg-i={i}>
              <h3>
                <button type="button" className="hg-acc__btn" aria-expanded={on} aria-controls={`hg-acc-${i}`} id={`hg-acc-b-${i}`} onClick={() => setOpen(on ? -1 : i)}>
                  <span className="hg-acc__n">{pad2(i + 1)}</span>
                  <span className="hg-acc__t">{it.t}</span>
                  <span className="hg-acc__pm" aria-hidden="true" />
                </button>
              </h3>
              <div className="hg-acc__panel" id={`hg-acc-${i}`} role="region" aria-labelledby={`hg-acc-b-${i}`}>
                <div>
                  <p className="hg-acc__body">
                    {it.b}
                    {it.link && <> <a className="hg-link" href={it.link[1]} target="_blank" rel="noopener" tabIndex={on ? 0 : -1}>{it.link[0]}</a></>}
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

/* ------------------------------------------------------------------ the story rail: card-flick */
function RailMark() {
  return <svg viewBox="0 0 200 200" aria-hidden="true"><rect x="20" y="20" width="160" height="160" /><rect x="34" y="34" width="132" height="132" strokeDasharray="2 6" /><path d="M64 166a36 36 0 0 1 72 0" /><circle cx="100" cy="146" r="14" /></svg>
}
function Story({ lang }: { lang: Lang }) {
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
    <section className="hg-rail" id="sagan" aria-labelledby="hg-rail-h">
      <div className="hg-rail__head">
        <h2 className="hg-d" id="hg-rail-h" data-hg-mask="" data-hg-fit="">{t.title}</h2>
        <p className="hg-lede" data-hg-words="">{t.lead}</p>
        <div className="hg-rail__arrows">
          <button type="button" onClick={() => go(on - 1)} disabled={on === 0} aria-label={t.prev}><Ring dir="left" /></button>
          <button type="button" onClick={() => go(on + 1)} disabled={on === t.items.length - 1} aria-label={t.next}><Ring /></button>
        </div>
      </div>
      <div className="hg-rail__track" ref={track} role="list">
        {t.items.map((it, i) => {
          const active = on === i
          return (
            <article key={it.t} role="listitem" className={`hg-rc${active ? ' is-on hg-dark' : ''}`} aria-current={active ? 'true' : undefined}
              onPointerEnter={(e) => { if (e.pointerType === 'mouse') setOn(i) }} onClick={() => setOn(i)} onFocus={() => setOn(i)}
              data-hg-fade="" data-hg-i={i}>
              <div className="hg-rc__top">
                <span className="hg-rc__n">{pad2(i + 1)}</span>
                <svg className="hg-rc__arr" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5" /></svg>
              </div>
              <div className="hg-rc__media">
                {it.img
                  ? <img src={img(it.img, 800)} srcSet={srcset(it.img)} sizes="(max-width: 900px) 80vw, 50vw" alt={it.alt ?? ''} loading="lazy" decoding="async" />
                  : <div className="hg-rc__noimg"><RailMark /></div>}
              </div>
              <div className="hg-rc__body">
                <p className="hg-rc__y">{it.y}</p>
                <h3 className="hg-rc__t">
                  <button type="button" onClick={() => setOn(i)} style={{ textAlign: 'left', textTransform: 'inherit', font: 'inherit', letterSpacing: 'inherit' }} aria-expanded={active}>{it.t}</button>
                </h3>
                <p className="hg-rc__b">{it.b}</p>
                {it.cap && <p className="hg-rc__cap">{it.cap}</p>}
                {it.links && <p className="hg-rc__links">{it.links.map(([l, h]) => <a key={h} href={h} target="_blank" rel="noopener" tabIndex={active ? 0 : -1}>{l}</a>)}</p>}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ news: one headline each, no slider */
function News({ lang }: { lang: Lang }) {
  const t = T[lang].news
  return (
    <section className="hg-news" id="frettir" aria-labelledby="hg-news-h">
      <div className="hg-news__head">
        <h2 className="hg-d" id="hg-news-h" data-hg-mask="" data-hg-fit="">{t.title}</h2>
        <a className="hg-ringlink" href="https://hegas.is/frettir/" target="_blank" rel="noopener"><Ring />{t.all}</a>
      </div>
      <ul className="hg-news__list" role="list">
        {NEWS.slice(0, 5).map((n, i) => (
          <li key={n.url} className={`hg-nc${i === 0 ? ' hg-nc--lead' : ''}`} data-hg-fade="" data-hg-i={i % 3}>
            <div className="hg-nc__img"><img src={img(n.img, i === 0 ? 1600 : 800)} srcSet={srcset(n.img)} sizes={i === 0 ? '(max-width: 900px) 100vw, 50vw' : '(max-width: 900px) 100vw, 25vw'} alt={n.alt} loading="lazy" decoding="async" /></div>
            <p className="hg-nc__d"><time dateTime={n.date}>{isDate(n.date)}</time></p>
            <h3 className="hg-nc__t"><a href={n.url} target="_blank" rel="noopener">{n.t}</a></h3>
            <p className="hg-nc__b">{n.b}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ------------------------------------------------------------------ staff: every phone and address works */
function Staff({ lang }: { lang: Lang }) {
  const t = T[lang].staff
  return (
    <section className="hg-staff" id="starfsfolk" aria-labelledby="hg-staff-h">
      <div className="hg-staff__head">
        <h2 className="hg-d" id="hg-staff-h" data-hg-mask="" data-hg-fit="">{t.title}</h2>
        <p className="hg-lede" data-hg-words="">{t.lead}</p>
      </div>
      {STAFF_GROUPS.map(([g, label]) => (
        <div key={g} className="hg-staff__group">
          <h3 className="hg-label">{label}</h3>
          <ul className="hg-staff__list" role="list">
            {STAFF.filter((p) => p.group === g).map((p, i) => (
              <li key={p.name} className="hg-person" data-hg-fade="" data-hg-i={i % 4}>
                <div className="hg-person__img"><img src={staffImg(p.n)} alt={`${p.name}, ${p.role}`} width={300} height={386} loading="lazy" decoding="async" /></div>
                <h4>{p.name}</h4>
                <p className="hg-person__r">{p.role}</p>
                <p className="hg-person__c">
                  {p.direct && <a href={tel(p.direct)}><span className="hg-sr">{p.direct === CONTACT.phone ? 'Sími' : t.direct}: </span>{p.direct}</a>}
                  {p.gsm && <a href={tel(p.gsm)}><span aria-hidden="true">{t.gsm} </span><span className="hg-sr">{t.gsm}: </span>{p.gsm}</a>}
                  <a href={`mailto:${p.email}`}>{p.email}</a>
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}

/* ------------------------------------------------------------------ contact */
function Contact({ lang }: { lang: Lang }) {
  const t = T[lang].contactS
  return (
    <section className="hg-contact" id="hafa-samband" aria-labelledby="hg-contact-h">
      <h2 className="hg-d" id="hg-contact-h" data-hg-mask="" data-hg-fit="">{t.title}</h2>
      <div className="hg-contact__grid">
        <div>
          <h3 className="hg-label">{t.come}</h3>
          <p className="hg-contact__big">HEGAS<br />{CONTACT.street}<br />{CONTACT.town}</p>
          <a className="hg-link" href={CONTACT.map} target="_blank" rel="noopener">{t.map}</a>
        </div>
        <div>
          <h3 className="hg-label">{t.talk}</h3>
          <p className="hg-contact__big"><a href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a></p>
          <h3 className="hg-label" style={{ marginTop: 24 }}>{t.hours}</h3>
          <dl className="hg-hours">{CONTACT.hours.map(([d, h]) => <div key={d}><dt>{d}</dt><dd className="hg-tnum">{h}</dd></div>)}</dl>
        </div>
        <div>
          <h3 className="hg-label">{t.mail}</h3>
          <p className="hg-contact__mail"><span>{t.sales}</span><a href={`mailto:${CONTACT.sales}`}>{CONTACT.sales}</a></p>
          <p className="hg-contact__mail"><span>{t.general}</span><a href={`mailto:${CONTACT.general}`}>{CONTACT.general}</a></p>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ material list teaser */
function Teaser({ lang }: { lang: Lang }) {
  const t = T[lang].teaser
  const { list } = useList()
  const lines = list.lines.slice(0, 4)
  return (
    <section className="hg-teaser" aria-labelledby="hg-teaser-h">
      <div className="hg-teaser__text">
        <h2 className="hg-d" id="hg-teaser-h" data-hg-mask="" data-hg-fit="">{t.title}</h2>
        <p className="hg-lede" style={{ color: 'var(--ink)' }} data-hg-fade="">{t.body}</p>
        <Link className="hg-btn" to={path(lang, 'list')}>{t.cta}<Arrow /></Link>
        <Link className="hg-ringlink" to={path(lang, 'review')}><Ring />{t.staff}</Link>
        <p className="hg-teaser__note">{t.note}</p>
      </div>
      <ul className="hg-teaser__list" aria-label={T[lang].list.h1} data-hg-fade="">
        {lines.map((l) => <li key={l.sku}><b style={{ fontWeight: 500 }}>{l.name}</b><span>{l.qty} {UNIT_LABEL[lang][l.unit]}</span></li>)}
        <li className="hg-teaser__foot hg-dark">
          <span style={{ color: '#fff' }}>{T[lang].list.sum.items(list.lines.length)}</span>
          <HgLogo className="" tagline={false} mono />
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
      <BrandPlates lang={lang} />
      <Teaser lang={lang} />
      <Machines lang={lang} />
      <How lang={lang} />
      <News lang={lang} />
      <Staff lang={lang} />
      <Story lang={lang} />
      <Contact lang={lang} />
    </>
  )
}
