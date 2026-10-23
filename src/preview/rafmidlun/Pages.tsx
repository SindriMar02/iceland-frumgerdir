import { useEffect, useRef, type ReactNode } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { BADGES, CONTACT, EQUAL_PAY, GRUNDARTANGI, PLACES, SERVICES, STAFF, WORK_ORDER_READY, serviceBySlug, staffCount, type Branch } from './data'
import { LABEL, RequestForm } from './Form'
import { setupMotion } from './motion'
import { Partners, PersonCard, ReadyList, StationArt } from './parts'
import { Arrow, Btn, to, useReducedMotion } from './ui'

/* The inner pages: one field of work, the staff list, the request, contact, the equal pay policy. */

function PageHead({ eyebrow, title, sub, crumbs, children, longTitle = false }: { eyebrow?: string; title: string; sub?: ReactNode; crumbs?: { to?: string; label: string }[]; children?: ReactNode; longTitle?: boolean }) {
  return (
    <header className="rm-phead">
      <div className="rm-wrap">
        {crumbs && (
          <nav className="rm-crumbs mono" aria-label="Brauðmolar">
            {crumbs.map((c, i) => <span key={i}>{c.to ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}</span>)}
          </nav>
        )}
        {eyebrow && <p className="mono rm-eyebrow">{eyebrow}</p>}
        <h1 className={`rm-phead__title${longTitle ? ' rm-phead__title--long' : ''}`} data-lines>{title}</h1>
        {sub && <p className="rm-phead__sub" data-lines>{sub}</p>}
        {children}
      </div>
    </header>
  )
}

function useMotionRoot() {
  const root = useRef<HTMLDivElement>(null)
  const rm = useReducedMotion()
  useEffect(() => (root.current ? setupMotion(root.current) : undefined), [rm])
  return root
}

/** the phones for a request, the kitchen line first where it is the kitchen */
const PhoneCard = ({ title, kitchen = false }: { title: string; kitchen?: boolean }) => {
  const office = <a className="rm-phone" href={CONTACT.phoneHref}><span>Skrifstofa og þjónusta</span><strong>{CONTACT.phone}</strong></a>
  const kit = <a className="rm-phone" href={CONTACT.kitchenHref}><span>Þjónusta stóreldhústækja</span><strong>{CONTACT.kitchenPhone}</strong></a>
  return (
    <div className="rm-order__card rm-order__card--blue">
      <p className="mono">{title}</p>
      {kitchen ? <>{kit}{office}</> : <>{office}{kit}</>}
    </div>
  )
}

/* ── /thjonusta/:slug ─────────────────────────────────────────────── */

export function Service() {
  const { slug = '' } = useParams()
  const s = serviceBySlug(slug)
  const root = useMotionRoot()
  if (!s) return <Navigate to={to('')} replace />
  const idx = SERVICES.indexOf(s)
  const next = SERVICES[(idx + 1) % SERVICES.length]
  const kitchen = s.branch === 'eldhus'
  const people = s.slug === 'storidja' ? GRUNDARTANGI : s.slug === 'storeldhus' ? STAFF.find((g) => g.id === 'eldhus')?.people ?? [] : []
  return (
    <div ref={root}>
      <PageHead
        eyebrow="Þjónusta"
        title={s.name}
        longTitle={s.slug === 'vidhald' || s.slug === 'storeldhus'}
        sub={s.blurb}
        crumbs={[{ to: to(''), label: 'Forsíða' }, { to: `${to('')}#thjonusta`, label: 'Þjónusta' }, { label: s.name }]}
      >
        <div className="rm-phead__act">
          <Btn tone="blue" to={`${to('/verkbeidni')}?leid=${s.branch}`} arrow>{s.branch === 'verk' ? 'Óska eftir tilboði' : LABEL[s.branch]}</Btn>
          <Btn tone="white" href={kitchen ? CONTACT.kitchenHref : CONTACT.phoneHref}>Sími {kitchen ? CONTACT.kitchenPhone : CONTACT.phone}</Btn>
        </div>
      </PageHead>

      <section className="rm-field" aria-label={s.name}>
        <div className="rm-wrap rm-field__grid">
          <div className="rm-field__copy">
            {s.paras.map((p, i) => <p key={i} className="rm-field__p">{p}</p>)}
            {s.items && (
              <ul className="rm-field__items">{s.items.map((it) => <li key={it}>{it}</li>)}</ul>
            )}
            {s.slug === 'skapasmidi' && (
              <div className="rm-field__partners">
                <p className="mono">Merki á vef Rafmiðlunar</p>
                <Partners />
              </div>
            )}
            {people.length > 0 && (
              <div className="rm-field__people">
                <h2 className="rm-h3">{s.slug === 'storidja' ? 'Á Grundartanga' : 'Þjónusta stóreldhústækja'}</h2>
                <ul className="rm-people">{people.map((p) => <PersonCard key={p.name} p={p} />)}</ul>
              </div>
            )}
            <p className="mono rm-source">Texti: {s.source}</p>
          </div>
          <div className="rm-field__art">
            <StationArt stage={s.art} />
          </div>
        </div>
      </section>

      <section className="rm-order rm-order--page" aria-labelledby="sb-h">
        <div className="rm-wrap">
          <h2 id="sb-h" className="rm-h2" data-lines>{s.branch === 'verk' ? 'Nýtt verk eða útboð' : 'Verkbeiðni'}</h2>
          <div className="rm-order__grid">
            <PhoneCard title="Hringdu ef það liggur á" kitchen={kitchen} />
            <div className="rm-order__card">
              <p className="mono">Það sem beiðnin þarf</p>
              <ReadyList items={WORK_ORDER_READY} />
              <div className="rm-order__act">
                <Btn tone="blue" to={`${to('/verkbeidni')}?leid=${s.branch}`} arrow>Áfram í beiðnina</Btn>
              </div>
            </div>
          </div>
        </div>
      </section>

      <nav className="rm-wrap rm-next" aria-label="Næsta svið">
        <Link to={to(`/thjonusta/${next.slug}`)}><span className="mono">Næst</span><strong>{next.name}</strong><Arrow /></Link>
      </nav>
    </div>
  )
}

/* ── /starfsfolk ──────────────────────────────────────────────────── */

export function Starfsfolk() {
  const root = useMotionRoot()
  return (
    <div ref={root}>
      <PageHead
        title="Starfsfólk"
        sub={`${staffCount} manns á listanum, flest með beinan síma og netfang. Skrifstofan er að Ögurhvarfi 8 og þjónustan að Flugumýri 32.`}
        crumbs={[{ to: to(''), label: 'Forsíða' }, { label: 'Starfsfólk' }]}
      >
        <nav className="rm-jump" aria-label="Hópar">
          {STAFF.map((g) => <a key={g.id} href={`#${g.id}`}>{g.name} <span className="mono">{g.people.length}</span></a>)}
        </nav>
      </PageHead>
      <section className="rm-staff">
        <div className="rm-wrap">
          {STAFF.map((g) => (
            <div key={g.id} className="rm-staff__group" id={g.id}>
              <h2 className="rm-h3">{g.name}</h2>
              <ul className="rm-people" data-grid-reveal>{g.people.map((p) => <PersonCard key={p.name} p={p} />)}</ul>
            </div>
          ))}
          <div className="rm-staff__job">
            <div>
              <h2 className="rm-h3">Viltu vinna hjá Rafmiðlun?</h2>
              <p>Rafvirkjar og nemar senda nafn, netfang, kennitölu og stöðu.</p>
            </div>
            <Btn tone="blue" to={`${to('/verkbeidni')}?leid=umsokn`} arrow>Starfsumsókn</Btn>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ── /verkbeidni ──────────────────────────────────────────────────── */

export function Verkbeidni() {
  const root = useMotionRoot()
  const [p] = useSearchParams()
  const leid = p.get('leid')
  const branches: Branch[] = ['verkbeidni', 'eldhus', 'verk', 'umsokn']
  const start = branches.includes(leid as Branch) ? (leid as Branch) : undefined
  return (
    <div ref={root}>
      <PageHead
        title={start === 'umsokn' ? 'Starfsumsókn' : 'Verkbeiðni'}
        sub={start === 'umsokn'
          ? 'Rafvirkjar og nemar: nafn, netfang, kennitala og staða. Þú sérð umsóknina í heild áður en nokkuð fer af stað.'
          : 'Beiðnin spyr um það sem þarf, og fer á netfangið sem svarar henni. Þú sérð hana í heild áður en nokkuð fer af stað.'}
        crumbs={[{ to: to(''), label: 'Forsíða' }, { label: start === 'umsokn' ? 'Starfsumsókn' : 'Verkbeiðni' }]}
      />
      <section className="rm-req">
        <div className="rm-wrap rm-req__grid">
          <div className="rm-req__form"><RequestForm start={start} key={start ?? 'val'} /></div>
          <aside className="rm-req__side" aria-label="Símar">
            <PhoneCard title="Viltu frekar hringja" kitchen={start === 'eldhus'} />
            <div className="rm-order__card">
              <p className="mono">Opið</p>
              <dl className="rm-hours">{CONTACT.hours.map((h) => <div key={h.d}><dt>{h.d}</dt><dd>{h.t}</dd></div>)}</dl>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}

/* ── /hafa-samband ────────────────────────────────────────────────── */

export function HafaSamband() {
  const root = useMotionRoot()
  return (
    <div ref={root}>
      <PageHead
        title="Hafa samband"
        sub="Skrifstofan er í Kópavogi og þjónustan í Mosfellsbæ. Stóreldhústæki eru með eigin síma."
        crumbs={[{ to: to(''), label: 'Forsíða' }, { label: 'Hafa samband' }]}
      />
      <section className="rm-places">
        <div className="rm-wrap">
          <ul className="rm-places__grid" data-grid-reveal>
            {PLACES.map((pl) => (
              <li key={pl.k} className="rm-place">
                <p className="mono">{pl.k}</p>
                <p className="rm-place__addr">{pl.v}</p>
                <a className="rm-place__tel" href={pl.href}>{pl.phone}</a>
                <a href={`mailto:${pl.email}`}>{pl.email}</a>
                {pl.extra && <p className="rm-place__extra">{pl.extra}</p>}
              </li>
            ))}
          </ul>
          <div className="rm-places__row">
            <div className="rm-order__card">
              <p className="mono">Opið</p>
              <dl className="rm-hours">{CONTACT.hours.map((h) => <div key={h.d}><dt>{h.d}</dt><dd>{h.t}</dd></div>)}</dl>
            </div>
            <div className="rm-order__card">
              <p className="mono">Starfsumsókn</p>
              <p className="rm-places__job">Rafvirkjar og nemar: nafn, netfang, kennitala og staða.</p>
              <Btn tone="blue" to={`${to('/verkbeidni')}?leid=umsokn`} arrow>Sækja um</Btn>
            </div>
            <div className="rm-order__card">
              <p className="mono">Verkbeiðni</p>
              <p className="rm-places__job">Fyrirtæki og kennitala, verkstaður, tengiliður og lýsing.</p>
              <Btn tone="blue" to={to('/verkbeidni')} arrow>Senda verkbeiðni</Btn>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ── /jafnlaunastefna ─────────────────────────────────────────────── */

export function Jafnlaunastefna() {
  const root = useMotionRoot()
  return (
    <div ref={root}>
      <PageHead
        title={EQUAL_PAY.title}
        crumbs={[{ to: to(''), label: 'Forsíða' }, { to: to('/starfsfolk'), label: 'Starfsfólk' }, { label: 'Jafnlaunastefna' }]}
      />
      <section className="rm-policy">
        <div className="rm-wrap rm-policy__grid">
          <div className="rm-policy__copy">
            {EQUAL_PAY.paras.map((p, i) => <p key={i}>{p}</p>)}
            <p><strong>{EQUAL_PAY.lead}</strong></p>
            <ul>{EQUAL_PAY.items.map((it) => <li key={it}>{it}</li>)}</ul>
          </div>
          <figure className="rm-policy__badge">
            <img src={BADGES.jafnlaun.src} alt={BADGES.jafnlaun.alt} width={BADGES.jafnlaun.w} height={BADGES.jafnlaun.h} loading="lazy" decoding="async" />
          </figure>
        </div>
      </section>
    </div>
  )
}
