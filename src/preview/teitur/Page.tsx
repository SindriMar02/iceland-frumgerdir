import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setMetaDescription, setThemeColor } from '../../lib/preview'
import { teiturCss } from './styles'
import { initTeiturMotion } from './motion'
import { HeroCard, RequestJourney, emptyTrip } from './Request'
import type { Trip } from './Request'
import { AgentsView, DashboardView } from './Views'
import {
  AGENTS, FLEET, HERO_SLIDES, HERO_UI, ICELAND_D, JSON_LD, PATHS, PLACES, REQ, ROUTES, SERVICE_IMG, T, URLS, brand, companyEntry, img, parseRoute, sizeOf,
  type Bus, type Lang, type RouteDef, type SizeFilter, type View,
} from './data'

const company = companyEntry
const B = import.meta.env.BASE_URL
const INK = '#241a15'

const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const NB = ' '

function Arrow({ className = '' }: { className?: string }) {
  return (
    <span className={`tj-arr ${className}`} aria-hidden="true">
      <svg viewBox="0 0 20 20" focusable="false"><path d="M6 14 14 6M7.5 6H14v6.5" /></svg>
    </span>
  )
}

function SectionHead({ n, title, id }: { n: string; title: string; id?: string }) {
  return (
    <div className="tj-shead">
      <span className="tj-shead__n" aria-hidden="true">{n}</span>
      <h2 className="tj-shead__t" id={id} data-lines>{title}</h2>
    </div>
  )
}

/* ------------------------------------------------------------------ header: the house mobile chrome
   A constant fixed glass bar (never moves, no scroll listener) + the sticky awning in the island strip. */
type Group = 'services' | 'about' | null

function Header({ lang, view, menu, setMenu }: { lang: Lang; view: View; menu: boolean; setMenu: (v: boolean) => void }) {
  const t = T[lang]
  const home = PATHS[lang].home
  const [open, setOpen] = useState<Group>(null)
  const bar = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => { if (bar.current && !bar.current.contains(e.target as Node)) setOpen(null) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])
  const anchor = (h: string) => `${home}#${h}`
  const close = () => { setOpen(null); setMenu(false) }
  const other: Lang = lang === 'is' ? 'en' : 'is'
  const langHref = PATHS[other][view]

  const servicesLinks: [string, string][] = [
    [t.nav.serviceItems.groups, PATHS[lang].request],
    [t.nav.serviceItems.hire, anchor('tj-fleet')],
    [t.nav.serviceItems.special, anchor('tj-services')],
    [t.nav.serviceItems.routes, anchor('tj-routes')],
  ]
  const aboutLinks: [string, string][] = [
    [t.nav.aboutItems.story, anchor('tj-about')],
    [t.nav.aboutItems.safety, anchor('tj-safety')],
    [t.nav.aboutItems.contact, anchor('tj-contact')],
  ]
  const dd = (key: Exclude<Group, null>, label: string, links: [string, string][]) => (
    <li className="tj-nav__item" onPointerEnter={(e) => { if (e.pointerType === 'mouse') setOpen(key) }} onPointerLeave={(e) => { if (e.pointerType === 'mouse') setOpen(null) }}>
      <button type="button" className="tj-nav__btn" aria-expanded={open === key} aria-controls={`tj-dd-${key}`} onClick={() => setOpen(open === key ? null : key)}>
        {label}
        <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="m2.5 4.5 3.5 3.5 3.5-3.5" /></svg>
      </button>
      <div className="tj-dd" id={`tj-dd-${key}`} data-open={open === key}>
        {links.map(([l, h]) => <Link key={l} to={h} onClick={close}>{l}</Link>)}
      </div>
    </li>
  )

  return (
    <>
      <div className="tj-awning" aria-hidden="true" />
      <header className="tj-bar" ref={bar}>
        <div className="tj-bar__in">
          <Link className="tj-brand" to={home} onClick={close} aria-label={t.nav.home}>
            <img src={brand('teitur-tile.svg')} width={80} height={39} alt="" />
          </Link>
          <nav className="tj-nav" aria-label={t.nav.home}>
            <ul>
              {dd('services', t.nav.services, servicesLinks)}
              <li className="tj-nav__item"><Link className="tj-nav__btn" to={anchor('tj-fleet')} onClick={close}>{t.nav.fleet}</Link></li>
              {dd('about', t.nav.about, aboutLinks)}
            </ul>
          </nav>
          <div className="tj-bar__end">
            <Link className="tj-bar__agents" to={PATHS[lang].agents} onClick={close}>{t.nav.agents}</Link>
            <a className="tj-bar__tel" href={`tel:${URLS.phone}`} aria-label={`${t.nav.call} ${URLS.phoneShow}`}>{URLS.phoneShow}</a>
            <div className="tj-lang" role="group" aria-label={t.nav.langLabel}>
              <Link className={lang === 'is' ? 'is-on' : ''} to={PATHS.is[view]} hrefLang="is" lang="is" aria-current={lang === 'is' ? 'true' : undefined}>IS</Link>
              <Link className={lang === 'en' ? 'is-on' : ''} to={PATHS.en[view]} hrefLang="en" lang="en" aria-current={lang === 'en' ? 'true' : undefined}>EN</Link>
            </div>
            <Link className="tj-btn tj-btn--orange tj-bar__cta" to={PATHS[lang].request} onClick={close}>{t.nav.request}</Link>
            <button type="button" className="tj-burger" aria-expanded={menu} aria-controls="tj-menu" onClick={() => setMenu(!menu)}>
              <span>{menu ? t.nav.close : t.nav.menu}</span>
            </button>
          </div>
        </div>
      </header>
      <div className={`tj-menu${menu ? ' is-open' : ''}`} id="tj-menu" aria-hidden={!menu}>
        <div className="tj-menu__in">
          <div className="tj-menu__foot">
            <Link className="tj-btn tj-btn--orange" to={PATHS[lang].request} onClick={close} tabIndex={menu ? 0 : -1}>{t.nav.request}</Link>
            <a className="tj-btn tj-btn--line-light" href={`tel:${URLS.phone}`} tabIndex={menu ? 0 : -1}>{URLS.phoneIntl}</a>
          </div>
          <p className="tj-menu__h">{t.nav.services}</p>
          {servicesLinks.map(([l, h]) => <Link key={l} to={h} onClick={close} tabIndex={menu ? 0 : -1}>{l}</Link>)}
          <Link className="tj-menu__solo" to={anchor('tj-fleet')} onClick={close} tabIndex={menu ? 0 : -1}>{t.nav.fleet}</Link>
          <p className="tj-menu__h">{t.nav.about}</p>
          {aboutLinks.map(([l, h]) => <Link key={l} to={h} onClick={close} tabIndex={menu ? 0 : -1}>{l}</Link>)}
          <Link className="tj-menu__agents" to={PATHS[lang].agents} onClick={close} tabIndex={menu ? 0 : -1}>{t.nav.agents}</Link>
          <Link className="tj-menu__lang" to={langHref} hrefLang={other} lang={other} onClick={close} tabIndex={menu ? 0 : -1}>{other === 'en' ? 'English' : 'Íslenska'}</Link>
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ hero */
function Hero({ lang, trip, setTrip, onReady }: { lang: Lang; trip: Trip; setTrip: Dispatch<SetStateAction<Trip>>; onReady: () => void }) {
  const t = T[lang]
  const ui = HERO_UI[lang]
  const ref = useRef<HTMLImageElement>(null)
  const reduced = useMemo(() => prefersReduced(), [])
  const [cur, setCur] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hold, setHold] = useState(false)
  /* every 6.5s to the next photograph; hovering or focusing the hero, or the pause button, stops it; a manual pick restarts the clock */
  useEffect(() => {
    if (reduced || paused || hold) return
    const id = window.setTimeout(() => setCur((c) => (c + 1) % HERO_SLIDES.length), 6500)
    return () => window.clearTimeout(id)
  }, [cur, paused, hold, reduced])
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (el.complete && el.naturalWidth) { onReady(); return }
    el.addEventListener('load', onReady, { once: true })
    el.addEventListener('error', onReady, { once: true })
    return () => { el.removeEventListener('load', onReady); el.removeEventListener('error', onReady) }
  }, [onReady])
  return (
    <section className="tj-hero" id="tj-top" aria-labelledby="tj-h1" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
      <div className="tj-hero__media" data-reveal="crop">
        <div className="tj-crop">
          {HERO_SLIDES.map((sl, i) => (
            <div key={sl.a} className={`tj-slide${i === cur ? ' is-on' : ''}`} aria-hidden={i === cur ? undefined : true}>
              <img ref={i === 0 ? ref : undefined} srcSet={`${img(sl.a)} ${sl.wa}w, ${img(sl.b)} ${sl.w}w`} sizes="100vw" src={img(sl.a)}
                width={sl.w} height={sl.h} alt={i === cur ? sl.alt[lang] : ''} style={{ objectPosition: sl.pos }} decoding="async"
                {...(i === 0 ? ({ fetchpriority: 'high' } as Record<string, string>) : ({ fetchpriority: 'low' } as Record<string, string>))} />
            </div>
          ))}
        </div>
        <div className="tj-hero__shade" aria-hidden="true" />
      </div>
      <div className="tj-hero__in">
        <div className="tj-hero__copy">
          <p className="tj-eyebrow" data-reveal="fade">{t.hero.eyebrow}</p>
          <h1 id="tj-h1" className="tj-h1" data-lines>{t.hero.h1}</h1>
          <p className="tj-hero__lead" data-reveal="fade">{t.hero.lead}</p>
          <div className="tj-hero__cta" data-reveal="fade">
            <Link className="tj-btn tj-btn--line-light" to={`${PATHS[lang].home}#tj-fleet`}>{t.hero.fleet}</Link>
          </div>
        </div>
        <div className="tj-hero__card" data-reveal="fade"><HeroCard lang={lang} trip={trip} setTrip={setTrip} /></div>
      </div>
      <div className="tj-slidectl" role="group" aria-label={ui.label}>
        {!reduced ? (
          <button type="button" className="tj-slidectl__pause" aria-pressed={paused} aria-label={paused ? ui.play : ui.pause} onClick={() => setPaused((v) => !v)}>
            <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">{paused ? <path d="M7 4.5v11l9-5.5z" /> : <path d="M6.5 4.5v11M13.5 4.5v11" />}</svg>
          </button>
        ) : null}
        <div className="tj-dots">
          {HERO_SLIDES.map((sl, i) => (
            <button key={sl.a} type="button" className={`tj-dot${i === cur ? ' is-on' : ''}`} aria-label={ui.go(i + 1, HERO_SLIDES.length)} aria-current={i === cur ? 'true' : undefined} onClick={() => setCur(i)}><span /></button>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ 02 fleet */
function FleetSection({ lang, onPick }: { lang: Lang; onPick: (b: Bus) => void }) {
  const t = T[lang].home.s2
  const am = T[lang].amenity
  const [filter, setFilter] = useState<SizeFilter>('all')
  const rail = useRef<HTMLDivElement>(null)
  const [edge, setEdge] = useState({ start: true, end: false })
  const list = useMemo(() => FLEET.filter((b) => filter === 'all' || sizeOf(b) === filter), [filter])
  const update = useCallback(() => {
    const el = rail.current
    if (!el) return
    setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 })
  }, [])
  useEffect(() => { rail.current?.scrollTo({ left: 0 }); update() }, [filter, update])
  useEffect(() => {
    const el = rail.current
    if (!el) return
    const ro = 'ResizeObserver' in window ? new ResizeObserver(update) : null
    ro?.observe(el)
    return () => ro?.disconnect()
  }, [update])
  const step = (dir: number) => {
    const el = rail.current
    const card = el?.firstElementChild as HTMLElement | null
    if (!el || !card) return
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 16), behavior: prefersReduced() ? 'auto' : 'smooth' })
  }
  return (
    <section className="tj-sec" id="tj-fleet" aria-labelledby="tj-fleet-h">
      <div className="tj-wrap">
        <SectionHead n="02" title={t.title} id="tj-fleet-h" />
        <p className="tj-statement tj-statement--left" data-reveal="fade">{t.lead}</p>
        <div className="tj-filters" role="group" aria-label={t.title}>
          {(['all', 'small', 'mid', 'large'] as SizeFilter[]).map((k) => (
            <button key={k} type="button" className={`tj-filter${filter === k ? ' is-on' : ''}`} aria-pressed={filter === k} onClick={() => setFilter(k)}>{t.filters[k]}</button>
          ))}
        </div>
      </div>
      <div className="tj-rail" ref={rail} onScroll={update} tabIndex={0} role="region" aria-label={t.title}>
        {list.map((b) => (
          <article className="tj-bus" key={b.id}>
            <div className="tj-bus__img"><img src={img(b.f)} width={b.w} height={b.h} alt={b.alt[lang]} loading="lazy" decoding="async" /></div>
            <div className="tj-bus__body">
              <h3 className="tj-bus__name">{b.name}</h3>
              <p className="tj-bus__seats"><strong>{b.seats}</strong>{NB}{t.seats}</p>
              <ul className="tj-bus__tags">{b.tags.map((k) => <li key={k}>{am[k]}</li>)}</ul>
              <button type="button" className="tj-bus__go" onClick={() => onPick(b)}><span>{t.pick}</span><Arrow className="tj-arr--orange" /></button>
            </div>
          </article>
        ))}
        {list.length === 0 ? <p className="tj-empty">{t.empty}</p> : null}
      </div>
      <div className="tj-wrap tj-railbar">
        <div className="tj-railbar__nav">
          <button type="button" className="tj-round" aria-label={t.prev} disabled={edge.start} onClick={() => step(-1)}>
            <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M12.5 4.5 7 10l5.5 5.5" /></svg>
          </button>
          <button type="button" className="tj-round" aria-label={t.next} disabled={edge.end} onClick={() => step(1)}>
            <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M7.5 4.5 13 10l-5.5 5.5" /></svg>
          </button>
          <span className="tj-count" aria-live="polite">{t.count(list.length)}</span>
        </div>
        <p className="tj-fine tj-railbar__note">{t.legend}</p>
        <Link className="tj-btn tj-btn--orange tj-btn--sm" to={PATHS[lang].request}>{t.open}</Link>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ 03 routes: the campus-map idea, as tiles */
function RouteTile({ r, lang, onUse }: { r: RouteDef; lang: Lang; onUse: (r: RouteDef) => void }) {
  const s3 = T[lang].home.s3
  const [x, y, w, h] = r.view
  const pts = r.path.map((k) => PLACES[k])
  return (
    <button type="button" className="tj-tile" onClick={() => onUse(r)} aria-label={`${s3.use}: ${r.name[lang]}. ${r.stops[lang].join(', ')}`}>
      <span className="tj-tile__art">
        <svg className="tj-tile__map" viewBox={`${x} ${y} ${w} ${h}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
          <path className="tj-land" d={ICELAND_D} />
          <polyline className="tj-route" points={pts.map((p) => p.join(',')).join(' ')} />
          {pts.map((p, i) => <circle key={i} className={i === 0 ? 'tj-pin tj-pin--home' : 'tj-pin'} cx={p[0]} cy={p[1]} r={w / (i === 0 ? 34 : 44)} />)}
        </svg>
        <span className="tj-chip">{r.name[lang]}</span>
        <span className="tj-tile__foot"><span className="tj-tile__tab">{s3.tab[r.tab]}</span><Arrow /></span>
      </span>
      <span className="tj-tile__stops">{r.stops[lang].join(', ')}</span>
    </button>
  )
}

/* ------------------------------------------------------------------ 04 about */
function Timeline({ lang }: { lang: Lang }) {
  const items = T[lang].home.s4.timeline
  const [open, setOpen] = useState(0)
  return (
    <ol className="tj-acc">
      {items.map((it, i) => (
        <li key={it.y} className={`tj-acc__i${open === i ? ' is-open' : ''}`}>
          <h3>
            <button type="button" className="tj-acc__head" aria-expanded={open === i} aria-controls={`tj-acc-${i}`} id={`tj-acch-${i}`} onClick={() => setOpen(open === i ? -1 : i)}>
              <span className="tj-acc__n" aria-hidden="true">0{i + 1}</span>
              <span className="tj-acc__y">{it.y.replace(/(\d) (til|to) (\d)/, `$1${NB}$2${NB}$3`)}</span>
              <span className="tj-acc__t">{it.t}</span>
              <span className="tj-acc__pm" aria-hidden="true" />
            </button>
          </h3>
          <div className="tj-acc__panel" id={`tj-acc-${i}`} role="region" aria-labelledby={`tj-acch-${i}`}>
            <div><p>{it.p}</p></div>
          </div>
        </li>
      ))}
    </ol>
  )
}

/* ------------------------------------------------------------------ home */
function Home({ lang, trip, setTrip, onReady, onBus, onRoute }: {
  lang: Lang; trip: Trip; setTrip: Dispatch<SetStateAction<Trip>>; onReady: () => void; onBus: (b: Bus) => void; onRoute: (r: RouteDef) => void
}) {
  const t = T[lang]
  const s1 = t.home.s1
  const s3 = t.home.s3
  const s4 = t.home.s4
  const s5 = t.home.s5
  const a = AGENTS[lang]
  const cards: { key: 'groups' | 'hire' | 'special'; el: (c: ReactNode) => ReactNode; tall?: boolean }[] = [
    { key: 'groups', el: (c) => <Link className="tj-svc__card" to={PATHS[lang].request}>{c}</Link> },
    { key: 'hire', tall: true, el: (c) => <Link className="tj-svc__card" to={`${PATHS[lang].home}#tj-fleet`}>{c}</Link> },
    { key: 'special', el: (c) => <a className="tj-svc__card" href={`tel:${URLS.phone}`}>{c}</a> },
  ]
  const alts: Record<'groups' | 'hire' | 'special', string> = lang === 'is'
    ? { groups: 'Hópferðabíll við foss og fólk á göngu í grænni hlíð', hire: 'Gulur Teitur strætisvagn á snæviþöktum vegi að kvöldi', special: 'Hvítur Mercedes Sprinter frá Teiti' }
    : { groups: 'A coach by a waterfall with people walking on a green hillside', hire: 'A yellow Teitur city bus on a snowy road in the evening', special: 'A white Mercedes Sprinter from Teitur' }
  return (
    <>
      <Hero lang={lang} trip={trip} setTrip={setTrip} onReady={onReady} />

      <div className="tj-sheet">
        {/* 01 services */}
        <section className="tj-sec tj-sec--band" id="tj-services" aria-labelledby="tj-svc-h">
          <div className="tj-wrap">
            <SectionHead n="01" title={s1.title} id="tj-svc-h" />
            <div className="tj-svc">
              {cards.map((c, i) => {
                const d = s1[c.key]
                const pic = SERVICE_IMG[c.key]
                return (
                  <div className={`tj-svc__cell${c.tall ? ' is-tall' : ''}`} key={c.key}>
                    <div className="tj-svc__par" data-parallax={i === 1 ? 'down' : 'up'}>
                      {c.el(
                        <>
                          <span className="tj-svc__img" data-reveal="crop"><span className="tj-crop"><img src={img(pic.f)} width={pic.w} height={pic.h} alt={alts[c.key]} loading="lazy" decoding="async" /></span></span>
                          <span className="tj-chip">{d.chip}</span>
                          <span className="tj-svc__foot"><span className="tj-svc__text">{d.text}</span><Arrow /></span>
                          <span className="tj-sr"> {d.cta}</span>
                        </>,
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="tj-statement" data-reveal="fade">{s1.statement}</p>
            <div className="tj-center" data-reveal="fade"><Link className="tj-btn tj-btn--orange" to={PATHS[lang].request}>{s1.cta}</Link></div>
            <div className="tj-uses">
              <h3 className="tj-uses__h">{s1.uses.head}</h3>
              <ul>{s1.uses.items.map((u) => <li key={u.t}><h4>{u.t}</h4><p>{u.p}</p></li>)}</ul>
            </div>
          </div>
        </section>

        <FleetSection lang={lang} onPick={onBus} />

        {/* 03 routes */}
        <section className="tj-sec tj-sec--band" id="tj-routes" aria-labelledby="tj-routes-h">
          <div className="tj-wrap">
            <SectionHead n="03" title={s3.title} id="tj-routes-h" />
            <div className="tj-routes">
              <div className="tj-routes__copy">
                <p data-reveal="fade">{s3.p}</p>
                <p className="tj-fine" data-reveal="fade">{s3.note}</p>
                <div data-reveal="fade"><Link className="tj-btn tj-btn--orange" to={PATHS[lang].request}>{s3.cta}</Link></div>
              </div>
              <div className="tj-tiles">{ROUTES.map((r) => <RouteTile key={r.id} r={r} lang={lang} onUse={onRoute} />)}</div>
            </div>
          </div>
        </section>

        {/* 04 about */}
        <section className="tj-sec" id="tj-about" aria-labelledby="tj-about-h">
          <div className="tj-wrap">
            <SectionHead n="04" title={s4.title} id="tj-about-h" />
            <div className="tj-about">
              <div className="tj-about__pic">
                <span className="tj-about__img" data-reveal="crop"><span className="tj-crop">
                  <img src={img('innri')} width={1600} height={1200} loading="lazy" decoding="async"
                    alt={lang === 'is' ? 'Innréttingin í hópferðabíl frá Teiti með appelsínugulum og gráum sætum' : 'The inside of a Teitur coach with orange and grey seats'} />
                </span></span>
                <p className="tj-about__lead" data-reveal="fade">{s4.lead}</p>
                <p className="tj-about__addr" data-reveal="fade">{s4.addr}</p>
              </div>
              <Timeline lang={lang} />
            </div>
          </div>
          <div className="tj-safety" id="tj-safety" role="group" aria-labelledby="tj-safety-h">
            <div className="tj-wrap">
              <h3 className="tj-safety__h" id="tj-safety-h">{s4.factsHead}</h3>
              <ul className="tj-safety__list">
                {s4.facts.map((f) => <li key={f.t}><h4>{f.t}</h4><p>{f.p}</p></li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* 05 agents */}
        <section className="tj-sec tj-sec--band" id="tj-agents" aria-labelledby="tj-agents-h">
          <div className="tj-wrap">
            <SectionHead n="05" title={s5.title} id="tj-agents-h" />
            <div className="tj-agentband">
              <div className="tj-agentband__copy">
                <p data-reveal="fade">{s5.p}</p>
                <ul data-reveal="fade">{s5.points.map((p) => <li key={p}>{p}</li>)}</ul>
                <div data-reveal="fade"><Link className="tj-btn tj-btn--dark" to={PATHS[lang].agents}>{s5.cta}</Link></div>
              </div>
              <div className="tj-agentband__pic">
                <span className="tj-agentband__img" data-reveal="crop"><span className="tj-crop">
                  <img src={img('kvold')} width={1400} height={788} loading="lazy" decoding="async"
                    alt={lang === 'is' ? 'Hvítur Scania hópferðabíll með blá ljós að kvöldi' : 'A white Scania coach with blue lights in the evening'} />
                </span></span>
                <div className="tj-mini" aria-label={a.inn.listHead}>
                  <p className="tj-mini__h">{a.inn.listHead} <span>{a.sample.split(':')[0]}</span></p>
                  <ul>{a.inn.rows.map(([k, s]) => <li key={k}><span>{k}</span><em>{s}</em></li>)}</ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* closing */}
        <section className="tj-sec tj-close" id="tj-contact" aria-labelledby="tj-close-h">
          <div className="tj-wrap tj-close__in">
            <div className="tj-close__copy">
              <h2 id="tj-close-h" className="tj-close__h" data-lines>{t.home.close.h}</h2>
              <p data-reveal="fade">{t.home.close.p}</p>
              <div className="tj-close__cta" data-reveal="fade">
                <Link className="tj-btn tj-btn--orange" to={PATHS[lang].request}>{t.home.close.book}</Link>
                <a className="tj-btn tj-btn--line-light" href={`tel:${URLS.phone}`}>{t.home.close.call}</a>
              </div>
            </div>
            <address className="tj-close__addr">
              <strong>{t.home.close.addrHead}</strong>
              {t.home.close.addr1}<br />{t.home.close.addr2}<br />
              <a href={`tel:${URLS.phone}`}>{URLS.phoneIntl}</a>
            </address>
          </div>
        </section>
      </div>
    </>
  )
}

function Footer({ lang }: { lang: Lang }) {
  const t = T[lang]
  const home = PATHS[lang].home
  return (
    <footer className="tj-foot">
      <div className="tj-wrap tj-foot__in">
        <div className="tj-foot__brand">
          <img src={brand('teitur-tile.svg')} width={112} height={55} alt="Teitur" />
          <p>Teitur Jónasson ehf.<br />Dalvegi 22, 201 Kópavogi<br /><a href={`tel:${URLS.phone}`}>{URLS.phoneIntl}</a></p>
        </div>
        <nav className="tj-foot__col" aria-label={t.footer.services}>
          <h2>{t.footer.services}</h2>
          <Link to={PATHS[lang].request}>{t.nav.request}</Link>
          <Link to={`${home}#tj-fleet`}>{t.nav.fleet}</Link>
          <Link to={`${home}#tj-routes`}>{t.nav.serviceItems.routes}</Link>
        </nav>
        <nav className="tj-foot__col" aria-label={t.footer.company}>
          <h2>{t.footer.company}</h2>
          <Link to={`${home}#tj-about`}>{t.nav.aboutItems.story}</Link>
          <Link to={`${home}#tj-safety`}>{t.nav.aboutItems.safety}</Link>
          <Link to={PATHS[lang].agents}>{t.nav.agents}</Link>
          <Link to={PATHS[lang].dashboard}>{t.footer.agentsDash}</Link>
        </nav>
        <nav className="tj-foot__col" aria-label={t.footer.contact}>
          <h2>{t.footer.contact}</h2>
          <a href={`tel:${URLS.phone}`}>{URLS.phoneIntl}</a>
          <a href={URLS.site} target="_blank" rel="noopener noreferrer">teitur.is</a>
        </nav>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ page */
export default function TeiturPage() {
  const { pathname, hash } = useLocation()
  const navigate = useNavigate()
  const { lang, view } = parseRoute(pathname)
  const t = T[lang]
  const rootRef = useRef<HTMLDivElement>(null)
  const reduced = useMemo(() => prefersReduced(), [])
  const css = useMemo(() => teiturCss(B), [])
  const [trip, setTrip] = useState<Trip>(emptyTrip)
  const [menu, setMenu] = useState(false)
  const [covered, setCovered] = useState(() => !prefersReduced() && view === 'home')
  const chromeCompany = useMemo(() => ({ ...company, english: lang === 'en' }), [lang])
  const onReady = useCallback(() => window.setTimeout(() => setCovered(false), 60), [])

  const titles: Record<View, string> = {
    home: t.title,
    request: `${REQ[lang].title} | Teitur`,
    agents: `${AGENTS[lang].h1} | Teitur`,
    dashboard: `${lang === 'is' ? 'Beiðnir' : 'Requests'} | Teitur`,
  }
  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    document.title = titles[view]
    document.documentElement.lang = t.htmlLang
    setThemeColor(INK)
    const offDesc = setMetaDescription(t.description)
    return () => { document.title = prevTitle; document.documentElement.lang = prevLang; offDesc() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, view])

  /* the cover is only for the first paint of the home page: if the image never loads, it still goes */
  useEffect(() => {
    if (!covered) return
    const id = window.setTimeout(() => setCovered(false), 2200)
    return () => window.clearTimeout(id)
  }, [covered])
  useEffect(() => { if (view !== 'home') setCovered(false) }, [view])

  /* anchors and route changes */
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) { window.setTimeout(() => el.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' }), 30); return }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash, reduced])

  /* menu: fixed-body scroll lock (restored instantly) */
  useEffect(() => {
    if (!menu) return
    const y = window.scrollY
    const s = document.body.style
    const prev = { position: s.position, top: s.top, width: s.width }
    s.position = 'fixed'; s.top = `-${y}px`; s.width = '100%'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false) }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      s.position = prev.position; s.top = prev.top; s.width = prev.width
      window.scrollTo(0, y)
    }
  }, [menu])
  useEffect(() => { setMenu(false) }, [pathname])

  /* motion: the root only gets tj-motion (which hides things) once the split has a chance to run */
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || prefersReduced()) return
    root.classList.add('tj-motion')
    const off = initTeiturMotion(root)
    return () => { off(); root.classList.remove('tj-motion') }
  }, [lang, view])

  const pickBus = useCallback((b: Bus) => {
    setTrip((x) => ({ ...x, vehicle: b.id }))
    navigate(PATHS[lang].request)
  }, [lang, navigate])
  const pickRoute = useCallback((r: RouteDef) => {
    setTrip((x) => ({ ...x, routeId: r.id, tab: r.tab, stops: r.stops[lang].slice(), end: r.tab === 'multi' ? x.end : null }))
    const card = document.getElementById('tj-card')
    card?.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' })
    window.setTimeout(() => document.querySelector<HTMLElement>('[data-tj-first]')?.focus({ preventScroll: true }), reduced ? 30 : 500)
  }, [lang, reduced])

  return (
    <div ref={rootRef} className="tj" lang={t.htmlLang}>
      <style>{css}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <link rel="preload" as="font" type="font/woff2" href={`${B}fonts/teitur/Switzer-Regular.woff2`} crossOrigin="" />
      <link rel="preload" as="font" type="font/woff2" href={`${B}fonts/teitur/Switzer-Medium.woff2`} crossOrigin="" />
      <PreviewChrome company={company} />
      <a className="tj-sr tj-skip" href="#tj-main">{t.skip}</a>
      <div className={`tj-cover${covered ? '' : ' is-off'}`} aria-hidden="true" />
      <Header lang={lang} view={view} menu={menu} setMenu={setMenu} />

      <main id="tj-main" key={`${lang}-${view}`} className={`tj-main tj-main--${view}`}>
        {view === 'home' && <Home lang={lang} trip={trip} setTrip={setTrip} onReady={onReady} onBus={pickBus} onRoute={pickRoute} />}
        {view === 'request' && (
          <div className="tj-page tj-sheet">
            <div className="tj-wrap tj-page__head">
              <p className="tj-eyebrow tj-eyebrow--dark" data-reveal="fade">{lang === 'is' ? 'Beiðni um rútu' : 'Coach request'}</p>
              <h1 className="tj-h1 tj-h1--page" data-lines>{REQ[lang].title}</h1>
              <p className="tj-lead" data-reveal="fade">{REQ[lang].lead}</p>
            </div>
            <div className="tj-wrap"><RequestJourney lang={lang} trip={trip} setTrip={setTrip} reset={() => setTrip(emptyTrip())} /></div>
          </div>
        )}
        {view === 'agents' && <AgentsView lang={lang} />}
        {view === 'dashboard' && <DashboardView lang={lang} />}
      </main>

      <Footer lang={lang} />
      <div className="tj-pf"><PreviewFooter company={{ ...chromeCompany, dark: true }} verifiedContent /></div>
    </div>
  )
}
