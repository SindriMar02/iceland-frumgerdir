import { useEffect, useRef, type ReactNode } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { LineSvg } from './Art'
import { ALSO, CONTACT, FAMILIES, SERVICE_READY, SERVICE_TEXT, STAGES, SUPPLIERS, familyBySlug, stageOf } from './data'
import { RequestForm, type Branch } from './Form'
import { setupMotion } from './motion'
import { AddButton, FamilyCard, ReadyList, SupplierCard, Tile, familyItem } from './parts'
import { useList } from './store'
import { Arrow, Btn, to, useReducedMotion } from './ui'

/* The inner pages: machines by step, one machine family, service, the request. */

function PageHead({ eyebrow, title, sub, crumbs, children }: { eyebrow: string; title: string; sub?: ReactNode; crumbs?: { to?: string; label: string }[]; children?: ReactNode }) {
  return (
    <header className="mv-phead">
      <div className="mv-wrap">
        {crumbs && (
          <nav className="mv-crumbs mono" aria-label="Brauðmolar">
            {crumbs.map((c, i) => <span key={i}>{c.to ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}</span>)}
          </nav>
        )}
        <p className="mono mv-eyebrow">{eyebrow}</p>
        <h1 className="mv-phead__title" data-lines>{title}</h1>
        {sub && <p className="mv-phead__sub" data-lines>{sub}</p>}
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

/* ── /velar ───────────────────────────────────────────────────────── */

export function Velar() {
  const root = useMotionRoot()
  const [params, setParams] = useSearchParams()
  const list = useList()
  const sel = params.get('skref') ?? ''
  const stage = stageOf(sel)
  const shown = stage ? FAMILIES.filter((f) => stage.families.includes(f.slug)) : FAMILIES
  const alsoShown = stage ? ALSO.filter((a) => stage.also.includes(a.id)) : ALSO
  const pick = (id: string) => { const n = new URLSearchParams(params); if (id) n.set('skref', id); else n.delete('skref'); setParams(n, { replace: true }) }
  return (
    <div ref={root}>
      <PageHead
        eyebrow="Vélar og umbúðir"
        title="Frá forvinnslu til pökkunar"
        sub="Veldu skref í framleiðslunni og sjáðu hvaða vélar við seljum, frá hvaða framleiðanda og hvað þarf að koma fram í fyrirspurn."
        crumbs={[{ to: to(''), label: 'Forsíða' }, { label: 'Vélar' }]}
      />
      <section className="mv-explore" aria-label="Vélar eftir skrefi">
        <div className="mv-wrap">
          <div className="mv-steptabs" role="group" aria-label="Skref í framleiðslunni">
            <button type="button" aria-pressed={!stage} className={!stage ? 'is-on' : ''} onClick={() => pick('')}>Allt</button>
            {STAGES.map((s) => (
              <button key={s.id} type="button" aria-pressed={stage?.id === s.id} className={stage?.id === s.id ? 'is-on' : ''} onClick={() => pick(s.id)}>
                <span className="mono">{s.n}</span> {s.name}
              </button>
            ))}
          </div>
          {stage && (
            <div className="mv-stagecard">
              <div>
                <p className="mono">{stage.n} {stage.name}</p>
                <p className="mv-stagecard__line">{stage.line}</p>
                <p className="mv-stagecard__steps">{stage.steps}</p>
              </div>
              <div className="mv-stagecard__art"><LineSvg active={STAGES.indexOf(stage)} view={STAGES.indexOf(stage)} form={STAGES.indexOf(stage) + 1} /></div>
            </div>
          )}
          <div className="mv-famgrid" aria-live="polite">
            {shown.map((f) => <FamilyCard key={f.slug} f={f} />)}
          </div>
          {shown.length === 0 && <p className="mv-empty">Vélar í þessu skrefi eru í vörulýsingum birgja okkar. Settu þær á fyrirspurnalistann hér að neðan og við svörum.</p>}
          {alsoShown.length > 0 && (
            <div className="mv-also">
              <h2 className="mv-h3">{stage ? 'Einnig í þessu skrefi' : 'Fleira úr vöruúrvalinu'}</h2>
              <p className="mv-also__sub">Vélar sem birgjar okkar framleiða og við nefnum á vefnum. Þær eiga ekki enn sína eigin síðu en þú getur sett þær á fyrirspurnalistann.</p>
              <ul className="mv-also__list">
                {alsoShown.map((a) => {
                  const on = list.has(a.id)
                  return (
                    <li key={a.id}>
                      <button type="button" className={`mv-chip mv-chip--btn${on ? ' is-on' : ''}`} aria-pressed={on} onClick={() => list.toggle({ id: a.id, label: a.name, kind: 'also' })}>
                        <span className="mv-add__box" aria-hidden="true">{on ? '✓' : '+'}</span>{a.name}<span className="mono"> {a.from}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </section>
      <section className="mv-suppliers mv-suppliers--page" aria-labelledby="vbirgjar-h">
        <div className="mv-wrap">
          <div className="mv-head">
            <p className="mono mv-eyebrow">Birgjar</p>
            <h2 id="vbirgjar-h" className="mv-h2" data-lines>Framleiðendurnir sjö</h2>
          </div>
          <div className="mv-suppliers__grid" data-grid-reveal>
            {SUPPLIERS.map((s) => <div key={s.id} data-grid-item><SupplierCard s={s} /></div>)}
          </div>
        </div>
      </section>
    </div>
  )
}

/* ── /velar/:slug ─────────────────────────────────────────────────── */

export function Family() {
  const { slug = '' } = useParams()
  const f = familyBySlug(slug)
  const root = useMotionRoot()
  const nav = useNavigate()
  const list = useList()
  if (!f) return <Navigate to={to('/velar')} replace />
  const idx = FAMILIES.indexOf(f)
  const prev = FAMILIES[(idx + FAMILIES.length - 1) % FAMILIES.length]
  const next = FAMILIES[(idx + 1) % FAMILIES.length]
  const stage = STAGES[f.stage]
  const sups = f.suppliers.map((id) => SUPPLIERS.find((s) => s.id === id)!)
  const names = sups.map((s) => s.name)
  const lead = `Við seljum ${f.sell} frá ${names.length > 1 ? `${names.slice(0, -1).join(', ')} og ${names[names.length - 1]}` : names[0]}.`
  const ask = () => { if (!list.has(f.slug)) list.toggle(familyItem(f)); nav(`${to('/fyrirspurn')}?leid=ny`) }
  return (
    <div ref={root}>
      <PageHead
        eyebrow={`${stage.n} ${stage.name}`}
        title={f.name}
        sub={lead}
        crumbs={[{ to: to(''), label: 'Forsíða' }, { to: to('/velar'), label: 'Vélar' }, { label: f.name }]}
      >
        <div className="mv-phead__act">
          <Btn tone="signal" onClick={ask} arrow>Fyrirspurn um {f.sell}</Btn>
          <AddButton item={familyItem(f)} />
        </div>
      </PageHead>

      <section className="mv-fampage" aria-label={f.name}>
        <div className="mv-wrap mv-fampage__grid">
          <div className="mv-fampage__media">
            {f.photo ? <Tile photo={f.photo} priority /> : <figure className="mv-tile mv-tile--white mv-fam__art mv-fampage__art"><LineSvg active={f.stage} view={f.stage} form={f.stage + 1} label={`Teikning af framleiðslulínunni þar sem ${f.name.toLowerCase()} eru í skrefinu ${stage.name.toLowerCase()}`} /></figure>}
            {f.slug === 'umbudir' && <div className="mv-fampage__more">{[SUPPLIERS[6].photos[1], SUPPLIERS[6].photos[2]].map((p, i) => <Tile key={i} photo={p} />)}</div>}
          </div>
          <div className="mv-fampage__copy">
            <h2 className="mv-h3" data-lines>Frá birgjum okkar</h2>
            {sups.map((s) => (
              <div key={s.id} className="mv-fampage__sup">
                <div className="mv-sup__logo"><img src={s.logo} alt={s.logoAlt} /></div>
                <p>{s.text}</p>
                <a className="mv-textlink" href={s.url} target="_blank" rel="noopener noreferrer">Nánar hjá {s.name} <Arrow /><span className="mv-sr"> (opnast í nýjum glugga)</span></a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mv-where" aria-labelledby="stadur-h">
        <div className="mv-wrap mv-where__grid">
          <div>
            <p className="mono mv-eyebrow">Staður í línunni</p>
            <h2 id="stadur-h" className="mv-h2" data-lines>{stage.name}</h2>
            <p className="mv-head__sub" data-lines>{stage.line}</p>
            <p className="mv-where__steps">{stage.steps}</p>
            <Link className="mv-textlink" to={`${to('/velar')}?skref=${stage.id}`}>Allar vélar í þessu skrefi <Arrow /></Link>
          </div>
          <div className="mv-where__art"><LineSvg active={f.stage} view={f.stage} form={f.stage + 1} label={`Framleiðslulínan, skrefið ${stage.name} lýst`} /></div>
        </div>
      </section>

      <section className="mv-prep" aria-labelledby="undirb-h">
        <div className="mv-wrap mv-prep__grid">
          <div>
            <p className="mono mv-eyebrow">Fyrirspurn</p>
            <h2 id="undirb-h" className="mv-h2" data-lines>Svo fyrsta svarið sé svar</h2>
          </div>
          <ReadyList items={[
            { k: 'Hvað þú vinnur með', v: 'Hráefnið eða varan, til dæmis lambakjöt, lax eða brauð.' },
            { k: 'Hvað vélin á að gera', v: 'Skrefið í framleiðslunni og hvað á að koma út.' },
            { k: 'Afköst, ef þú veist', v: 'Til dæmis kíló á klukkustund. Það má vera nálgun.' },
            { k: 'Pláss og aðstæður', v: 'Hvar vélin á að standa og hvað er fyrir.' },
          ]} />
        </div>
      </section>

      <nav className="mv-wrap mv-pn" aria-label="Fleiri vélar">
        <Link to={to(`/velar/${prev.slug}`)} rel="prev"><span className="mono">Fyrri</span>{prev.name}</Link>
        <Link to={to(`/velar/${next.slug}`)} rel="next"><span className="mono">Næsta</span>{next.name}</Link>
      </nav>
    </div>
  )
}

/* ── /thjonusta ───────────────────────────────────────────────────── */

export function Thjonusta() {
  const root = useMotionRoot()
  return (
    <div ref={root}>
      <PageHead
        eyebrow="Þjónusta"
        title="Þjónusta og varahlutir"
        sub={SERVICE_TEXT}
        crumbs={[{ to: to(''), label: 'Forsíða' }, { label: 'Þjónusta' }]}
      />
      <section className="mv-svc">
        <div className="mv-wrap mv-svc__grid">
          <aside className="mv-svc__side" aria-label="Símar og undirbúningur">
            <div className="mv-service__card mv-service__card--flat">
              <p className="mono">Ef framleiðslan stendur kyrr</p>
              <a className="mv-phone" href={CONTACT.phoneHref}><span>Páll í Matvélum</span><strong>{CONTACT.phone}</strong></a>
              <a className="mv-phone" href={CONTACT.kappHref}><span>Rúnar í KAPP</span><strong>{CONTACT.kapp}</strong></a>
            </div>
            <div className="mv-service__card mv-service__card--flat">
              <p className="mono">Hafðu við höndina</p>
              <ReadyList items={SERVICE_READY} />
            </div>
          </aside>
          <div className="mv-svc__form"><RequestForm lock="thjonusta" /></div>
        </div>
      </section>
    </div>
  )
}

/* ── /fyrirspurn ──────────────────────────────────────────────────── */

export function Fyrirspurn() {
  const root = useMotionRoot()
  const [p] = useSearchParams()
  const leid = p.get('leid')
  const start = {
    branch: (leid === 'ny' || leid === 'thjonusta' || leid === 'veit-ekki' ? leid : undefined) as Branch | undefined,
    sector: p.get('geiri') ?? undefined,
    trial: p.get('prufa') === '1',
  }
  return (
    <div ref={root}>
      <PageHead
        eyebrow="Fyrirspurn"
        title="Senda fyrirspurn"
        sub="Ný vél, ráðgjöf eða vél í notkun. Þú sérð fyrirspurnina í heild áður en nokkuð fer af stað."
        crumbs={[{ to: to(''), label: 'Forsíða' }, { label: 'Fyrirspurn' }]}
      />
      <section className="mv-req">
        <div className="mv-wrap mv-req__grid">
          <div className="mv-req__form"><RequestForm start={start} key={`${start.branch}${start.sector}${start.trial}`} /></div>
          <aside className="mv-req__side" aria-label="Símar">
            <div className="mv-service__card mv-service__card--flat">
              <p className="mono">Viltu frekar hringja</p>
              <a className="mv-phone" href={CONTACT.phoneHref}><span>Páll í Matvélum</span><strong>{CONTACT.phone}</strong></a>
              <a className="mv-phone" href={CONTACT.kappHref}><span>Rúnar í KAPP, þjónusta</span><strong>{CONTACT.kapp}</strong></a>
              <p className="mv-service__note">{CONTACT.address}, {CONTACT.postcode}<br /><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
