import { useEffect, useRef, type ReactNode } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { LineSvg } from './Art'
import { CONTACT, FAMILIES, GROUP, LABELS, ON_CALL, PHOTO, SECTORS, SERVICE_READY, SERVICE_TEXT, STAGES, familyBySlug, memberById, sectorBySlug, stageOf } from './data'
import { RequestForm, type Branch } from './Form'
import { setupMotion } from './motion'
import { AddButton, FamilyCard, ModelCard, ReadyList, StationArt, Tile, Who, familyItem } from './parts'
import { useList } from './store'
import { Arrow, Btn, to, useReducedMotion } from './ui'

/* The inner pages: machines by step, one machine family, service, one industry, labels, the request. */

function PageHead({ eyebrow, title, sub, crumbs, children }: { eyebrow?: string; title: string; sub?: ReactNode; crumbs?: { to?: string; label: string }[]; children?: ReactNode }) {
  return (
    <header className="sh-phead">
      <div className="sh-wrap">
        {crumbs && (
          <nav className="sh-crumbs mono" aria-label="Brauðmolar">
            {crumbs.map((c, i) => <span key={i}>{c.to ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}</span>)}
          </nav>
        )}
        {eyebrow && <p className="mono sh-eyebrow">{eyebrow}</p>}
        <h1 className="sh-phead__title" data-lines>{title}</h1>
        {sub && <p className="sh-phead__sub" data-lines>{sub}</p>}
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

const PhoneCard = ({ title }: { title: string }) => (
  <div className="sh-service__card sh-service__card--blue">
    <p className="mono">{title}</p>
    <a className="sh-phone" href={CONTACT.phoneHref}><span>Skiptiborð, opið virka daga</span><strong>{CONTACT.phone}</strong></a>
    {ON_CALL.map((p) => <a key={p.phone} className="sh-phone" href={p.href}><span>{p.name}, utan opnunartíma</span><strong>{p.phone}</strong></a>)}
  </div>
)

/* ── /velar ───────────────────────────────────────────────────────── */

export function Velar() {
  const root = useMotionRoot()
  const [params, setParams] = useSearchParams()
  const sel = params.get('skref') ?? ''
  const stage = stageOf(sel)
  const idx = stage ? STAGES.indexOf(stage) : -1
  const shown = stage ? FAMILIES.filter((f) => stage.families.includes(f.slug)) : FAMILIES
  const pick = (id: string) => { const n = new URLSearchParams(params); if (id) n.set('skref', id); else n.delete('skref'); setParams(n, { replace: true }) }
  return (
    <div ref={root}>
      <PageHead
        title="Vélar og búnaður"
        sub="Vélar frá Samhentum og Plastco eftir skrefum í línunni, frá vinnslu að bretti. Við seljum þær, setjum upp og þjónustum."
        crumbs={[{ to: to(''), label: 'Forsíða' }, { label: 'Vélar' }]}
      />
      <section className="sh-explore" aria-label="Vélar eftir skrefi">
        <div className="sh-wrap">
          <div className="sh-steptabs" role="group" aria-label="Skref í línunni">
            <button type="button" aria-pressed={!stage} className={!stage ? 'is-on' : ''} onClick={() => pick('')}>Allt</button>
            {STAGES.map((s) => (
              <button key={s.id} type="button" aria-pressed={stage?.id === s.id} className={stage?.id === s.id ? 'is-on' : ''} onClick={() => pick(s.id)}>
                <span className="mono">{s.n}</span> {s.name}
              </button>
            ))}
          </div>
          {stage && (
            <div className="sh-stagecard">
              <div>
                <p className="mono">{stage.n} {stage.name}</p>
                <p className="sh-stagecard__line">{stage.line}</p>
                <p className="sh-stagecard__steps">{stage.steps}</p>
                <Who ids={stage.who} className="sh-who--onblue" />
              </div>
              <div className="sh-stagecard__art"><LineSvg active={idx} view={idx} form={idx + 1} /></div>
            </div>
          )}
          <div className="sh-famgrid" aria-live="polite">
            {shown.map((f) => <FamilyCard key={f.slug} f={f} />)}
          </div>
        </div>
      </section>
      <section className="sh-units" aria-labelledby="einingar-h">
        <div className="sh-wrap sh-units__grid">
          <h2 id="einingar-h" className="sh-h3">Hver selur og þjónustar</h2>
          {['samhentir', 'plastco'].map((id) => {
            const m = memberById(id)!
            return (
              <div key={id} className="sh-unit">
                <p className="sh-unit__name">{id === 'samhentir' ? 'Véladeild Samhentra' : 'Plastco'}</p>
                <p>{id === 'samhentir' ? 'Vélar fyrir vinnslu, kassa og bretti, ásamt viðgerðarþjónustu fyrir þær vélar sem við seljum.' : m.own}</p>
                <a href={id === 'samhentir' ? 'mailto:veladeild@samhentir.is' : `mailto:${m.email}`}>{id === 'samhentir' ? 'veladeild@samhentir.is' : m.email}</a>
              </div>
            )
          })}
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
  const unit = memberById(f.unit)!
  const ask = () => { if (!list.has(f.slug)) list.toggle(familyItem(f)); nav(`${to('/fyrirspurn')}?leid=vel`) }
  return (
    <div ref={root}>
      <PageHead
        eyebrow={`${stage.n} ${stage.name}`}
        title={f.name}
        sub={f.blurb}
        crumbs={[{ to: to(''), label: 'Forsíða' }, { to: to('/velar'), label: 'Vélar' }, { label: f.name }]}
      >
        <div className="sh-phead__act">
          <Btn tone="blue" onClick={ask} arrow>Senda fyrirspurn</Btn>
          <AddButton item={familyItem(f)} />
        </div>
      </PageHead>

      <section className="sh-fampage" aria-label={f.name}>
        <div className="sh-wrap sh-fampage__grid">
          <div className="sh-fampage__copy">
            <h2 className="sh-h3">Úrvalið</h2>
            <ul className="sh-lines">{f.lines.map((l) => <li key={l}>{l}</li>)}</ul>
            {f.makers && <p className="sh-fampage__makers">Framleiðendur sem við nefnum: {f.makers}</p>}
            <p className="sh-fampage__unit">Selt og þjónustað af <strong>{f.unit === 'samhentir' ? 'véladeild Samhentra' : unit.name}</strong>. <a href={f.unit === 'samhentir' ? 'mailto:veladeild@samhentir.is' : `mailto:${unit.email}`}>{f.unit === 'samhentir' ? 'veladeild@samhentir.is' : unit.email}</a></p>
            <p className="sh-source mono">Heimild: {f.source}</p>
          </div>
          <div className="sh-fampage__media">
            {f.models.length ? (
              <>
                <p className="mono sh-fampage__count">{f.models.length} gerðir í vöruúrvali</p>
                <ul className="sh-models">{f.models.map((m) => <ModelCard key={m.name} m={m} family={f} />)}</ul>
              </>
            ) : <StationArt stage={f.stage} label={`Teikning af línunni þar sem ${f.name.toLowerCase()} eru í skrefinu ${stage.name.toLowerCase()}`} />}
          </div>
        </div>
      </section>

      <section className="sh-where" aria-labelledby="stadur-h">
        <div className="sh-wrap sh-where__grid">
          <div>
            <p className="mono sh-eyebrow">Staður í línunni</p>
            <h2 id="stadur-h" className="sh-h2" data-lines>{stage.n} {stage.name}</h2>
            <p className="sh-head__sub" data-lines>{stage.line}</p>
            <Who ids={stage.who} className="sh-who--onblue" />
            <Link className="sh-textlink" to={`${to('/velar')}?skref=${stage.id}`}>Allar vélar í þessu skrefi <Arrow /></Link>
          </div>
          <div className="sh-where__art"><LineSvg active={f.stage} view={f.stage} form={f.stage + 1} label={`Línan, skrefið ${stage.name} lýst`} /></div>
        </div>
      </section>

      <section className="sh-prep" aria-labelledby="undirb-h">
        <div className="sh-wrap sh-prep__grid">
          <h2 id="undirb-h" className="sh-h2" data-lines>Svo fyrsta svarið sé svar</h2>
          <ReadyList items={[
            { k: 'Hvað þú framleiðir', v: 'Hráefnið eða varan, til dæmis ferskur lax, frosin flök eða kjötvörur.' },
            { k: 'Hvað vélin á að gera', v: 'Skrefið í línunni og hvernig varan á að koma út.' },
            { k: 'Afköst, ef þú veist', v: 'Til dæmis pakkningar á mínútu eða kíló á klukkustund. Nálgun dugar.' },
            { k: 'Pláss og aðstæður', v: 'Hvar vélin á að standa og hvaða vélar eru fyrir.' },
          ]} />
        </div>
      </section>

      <nav className="sh-wrap sh-pn" aria-label="Fleiri vélar">
        <Link to={to(`/velar/${prev.slug}`)} rel="prev"><span className="mono">Fyrri</span>{prev.name}</Link>
        <Link to={to(`/velar/${next.slug}`)} rel="next"><span className="mono">Næsta</span>{next.name}</Link>
      </nav>
    </div>
  )
}

/* ── /atvinnugreinar/:slug ────────────────────────────────────────── */

export function Sector() {
  const { slug = '' } = useParams()
  const s = sectorBySlug(slug)
  const root = useMotionRoot()
  const list = useList()
  if (!s) return <Navigate to={to('')} replace />
  const fams = s.families.map((id) => familyBySlug(id)!)
  const others = SECTORS.filter((x) => x.slug !== s.slug)
  return (
    <div ref={root}>
      <PageHead
        title={s.name}
        sub={s.lead}
        crumbs={[{ to: to(''), label: 'Forsíða' }, { to: `${to('')}#atvinnugreinar`, label: 'Atvinnugreinar' }, { label: s.name }]}
      >
        <div className="sh-phead__act">
          <Btn tone="blue" to={`${to('/fyrirspurn')}?leid=umbudir&geiri=${s.slug}`} arrow>Senda fyrirspurn</Btn>
          <Who ids={s.who} />
        </div>
      </PageHead>

      <section className="sh-sectorpage" aria-label={`Vörur fyrir ${s.for}`}>
        <div className="sh-wrap sh-sectorpage__grid">
          <div className="sh-sectorpage__media"><Tile photo={s.photo} priority sizes="(max-width: 991px) 92vw, 44vw" /></div>
          <ul className="sh-products">
            {s.products.map((p) => {
              const id = `${s.slug}:${p.k}`
              const on = list.has(id)
              return (
                <li key={p.k}>
                  <div>
                    <h2 className="sh-products__k">{p.k}</h2>
                    <p>{p.v}</p>
                  </div>
                  <button type="button" className={`sh-add sh-add--small${on ? ' is-on' : ''}`} aria-pressed={on} onClick={() => list.toggle({ id, label: p.k, kind: 'product', href: to(`/atvinnugreinar/${s.slug}`) })}>
                    <span className="sh-add__box" aria-hidden="true">{on ? '✓' : '+'}</span><span className="sh-sr">{on ? `Taka ${p.k} af fyrirspurnalista` : `Bæta ${p.k} á fyrirspurnalista`}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
        <p className="sh-wrap sh-source mono">Heimild: {s.source}</p>
      </section>

      <section className="sh-sectorline" aria-labelledby="linan-geiri-h">
        <div className="sh-wrap">
          <h2 id="linan-geiri-h" className="sh-h2" data-lines>Á línunni</h2>
          <div className="sh-famgrid">{fams.map((f) => <FamilyCard key={f.slug} f={f} />)}</div>
        </div>
      </section>

      <nav className="sh-wrap sh-othersec" aria-label="Aðrar atvinnugreinar">
        <p className="mono">Aðrar atvinnugreinar</p>
        <ul>{others.map((o) => <li key={o.slug}><Link to={to(`/atvinnugreinar/${o.slug}`)}>{o.name}</Link></li>)}</ul>
      </nav>
    </div>
  )
}

/* ── /merkingar ───────────────────────────────────────────────────── */

export function Merkingar() {
  const root = useMotionRoot()
  const vm = memberById('vorumerking')!
  return (
    <div ref={root}>
      <PageHead
        eyebrow="Vörumerking, frá 1962"
        title="Merkingar og límmiðar"
        sub={LABELS.lead}
        crumbs={[{ to: to(''), label: 'Forsíða' }, { label: 'Merkingar' }]}
      >
        <div className="sh-phead__act">
          <Btn tone="blue" to={`${to('/fyrirspurn')}?leid=merkingar`} arrow>Senda fyrirspurn</Btn>
          <a className="sh-textlink" href={vm.phoneHref}>Vörumerking {vm.phone}</a>
        </div>
      </PageHead>
      <section className="sh-labels" aria-label="Vörur Vörumerkingar">
        <div className="sh-wrap">
          <Tile photo={PHOTO.rullur} priority sizes="92vw" className="sh-labels__wide" />
          <ul className="sh-labels__grid">
            {LABELS.products.map((p) => <li key={p.k}><h2 className="sh-products__k">{p.k}</h2><p>{p.v}</p></li>)}
          </ul>
        </div>
      </section>
      <section className="sh-files" aria-labelledby="skil-h">
        <div className="sh-wrap sh-files__grid">
          <div>
            <h2 id="skil-h" className="sh-h2" data-lines>Skil á verkefnum</h2>
            <p className="sh-head__sub" data-lines>Skilaðu á formi sem prentsalurinn skilur og verkefnið fer hnökralaust í gegnum framleiðsluna.</p>
            <div className="sh-files__art"><Tile photo={PHOTO.prentvel} sizes="(max-width: 767px) 80vw, 30vw" /></div>
          </div>
          <ReadyList items={LABELS.files} />
        </div>
        <p className="sh-wrap sh-source mono">Heimild: {LABELS.source}</p>
      </section>
    </div>
  )
}

/* ── /thjonusta ───────────────────────────────────────────────────── */

export function Thjonusta() {
  const root = useMotionRoot()
  return (
    <div ref={root}>
      <PageHead
        title="Viðgerðir og varahlutir"
        sub={SERVICE_TEXT}
        crumbs={[{ to: to(''), label: 'Forsíða' }, { label: 'Þjónusta' }]}
      />
      <section className="sh-svc">
        <div className="sh-wrap sh-svc__grid">
          <aside className="sh-svc__side" aria-label="Símar og undirbúningur">
            <PhoneCard title="Ef framleiðslan stendur kyrr" />
            <div className="sh-service__card">
              <p className="mono">Hafðu við höndina</p>
              <ReadyList items={SERVICE_READY} />
            </div>
          </aside>
          <div className="sh-svc__form"><RequestForm lock="thjonusta" /></div>
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
  const branches: Branch[] = ['umbudir', 'vel', 'thjonusta', 'merkingar', 'veit-ekki']
  const start = {
    branch: branches.includes(leid as Branch) ? (leid as Branch) : undefined,
    sector: p.get('geiri') ?? undefined,
    sample: p.get('synishorn') === '1',
  }
  return (
    <div ref={root}>
      <PageHead
        title="Senda fyrirspurn"
        sub="Umbúðir, vélar, þjónusta eða merkingar. Þú sérð fyrirspurnina í heild áður en nokkuð fer af stað, og hún ratar á réttan stað í samstæðunni."
        crumbs={[{ to: to(''), label: 'Forsíða' }, { label: 'Fyrirspurn' }]}
      />
      <section className="sh-req">
        <div className="sh-wrap sh-req__grid">
          <div className="sh-req__form"><RequestForm start={start} key={`${start.branch}${start.sector}${start.sample}`} /></div>
          <aside className="sh-req__side" aria-label="Símar">
            <div className="sh-service__card">
              <p className="mono">Viltu frekar hringja</p>
              {GROUP.map((g) => <a key={g.id} className="sh-phone sh-phone--light" href={g.phoneHref}><span>{g.name}</span><strong>{g.phone}</strong></a>)}
              <p className="sh-service__note">{CONTACT.address}, {CONTACT.postcode}<br />{CONTACT.hours}</p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
