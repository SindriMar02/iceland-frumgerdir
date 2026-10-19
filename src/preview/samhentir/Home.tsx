import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CubeDrop, LineSvg } from './Art'
import { CERTS, CONTACT, DESIGN, GROUP, LEAD, ON_CALL, PHOTO, QUOTE, SECTORS, SERVICE_READY, SERVICE_TEXT, SHOP, STAGES, STOCK_TEXT, STORY, WORK, memberById } from './data'
import { cubeDrop, fluteField, initStack, lineField, setupMotion } from './motion'
import { ReadyList, Tile } from './parts'
import { Arrow, Btn, to, useMedia, useReducedMotion } from './ui'

/* The home page. The engine's section order, re-aimed at a group: hero on corrugated board,
   the divider of their mark, the pinned line where every station is a company in the group,
   industries (the carton drop), the four companies, their own work, design, machines and
   service, numbers, and the close on their blue. */

export function Hero() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const rm = useReducedMotion()
  /* the board keeps moving beside the headline, so it has its own stop control (WCAG 2.2.2) */
  const [paused, setPaused] = useState(false)
  useEffect(() => (canvas.current ? fluteField(canvas.current, rm || paused) : undefined), [rm, paused])
  return (
    <section className="sh-hero" aria-labelledby="sh-h1">
      <div className="sh-wrap sh-hero__in">
        <p className="mono sh-hero__eyebrow">Samhentir · Vörumerking · Plastco · Formar</p>
        <h1 id="sh-h1" className="sh-hero__title">{/* fixed lines: the wrap must not depend on which font has arrived, or the hero shifts when the wide face loads */}<span>Allt fyrir</span> <span>framleiðsluna,</span> <span>á einum stað</span></h1>
        <p className="sh-hero__sub">Umbúðir, merkingar og vélar, frá vinnslulínunni að brettinu sem fer á bílinn.</p>
        <div className="sh-doors">
          <Btn tone="blue" to={to('/fyrirspurn')}>Senda fyrirspurn</Btn>
          <Btn tone="white" href={SHOP} external>Vefverslun</Btn>
        </div>
        <figure className="sh-hero__goods">
          <img src={PHOTO.oskjur.src} srcSet={PHOTO.oskjur.srcSet} sizes="34vw" alt={PHOTO.oskjur.alt} width={PHOTO.oskjur.w} height={PHOTO.oskjur.h} {...{ fetchpriority: "high" }} decoding="async" />
        </figure>
      </div>
      <div className="sh-hero__board">
        <canvas ref={canvas} className="sh-hero__canvas" aria-hidden="true" />
      </div>
      {!rm && (
        <button type="button" className="sh-hero__pause" aria-pressed={paused} onClick={() => setPaused((v) => !v)}>
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">{paused ? <path d="M4 2.5v11l9-5.5z" fill="currentColor" /> : <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor" />}</svg>
          <span className="sh-sr">{paused ? 'Setja hreyfingu af stað' : 'Stöðva hreyfingu'}</span>
        </button>
      )}
    </section>
  )
}

export const Rule = () => (
  <div className="sh-rule" data-rule aria-hidden="true"><span className="sh-rule__sq" /><span className="sh-rule__sq sh-rule__sq--bite" /></div>
)

const Plus = ({ pos }: { pos: string }) => (
  <span className={`sh-plus sh-plus--${pos}`} aria-hidden="true"><svg viewBox="0 0 12 12"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.2" /></svg></span>
)

const whoNames = (ids: string[]) => ids.map((id) => memberById(id)!.name).join(' og ')

function Stack() {
  const track = useRef<HTMLDivElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  /* a pinned scene needs a tall window: a phone on its side gets the same six steps as a plain list */
  const rm = useMedia('(prefers-reduced-motion: reduce), (max-height: 560px)')
  useEffect(() => {
    if (rm || !track.current || !svg.current) return
    let off: (() => void) | undefined
    let dead = false
    const t = track.current, s = svg.current
    ;(document.fonts?.ready ?? Promise.resolve()).then(() => { if (!dead) off = initStack({ track: t, svg: s }) })
    return () => { dead = true; off?.() }
  }, [rm])

  if (rm) {
    return (
      <section className="sh-stack sh-stack--static" id="linan" aria-labelledby="linan-h">
        <div className="sh-wrap">
          <h2 id="linan-h" className="sh-h2">Frá vél að bretti, eitt hús</h2>
          <ol className="sh-stack__list">
            {STAGES.map((s, i) => (
              <li key={s.id}>
                <div className="sh-stack__panel">
                  <p className="mono">{s.n} {s.name}</p>
                  <p className="sh-stack__line">{s.line}</p>
                  <p className="sh-stack__who">{whoNames(s.who)}</p>
                </div>
                <div className="sh-stack__view"><div className="sh-stack__card"><LineSvg active={i} view={i} form={i + 1} /></div></div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    )
  }

  return (
    <section className="sh-stack" id="linan" aria-labelledby="linan-h">
      <div className="sh-wrap sh-stack__intro">
        <h2 id="linan-h" className="sh-h2" data-lines>Frá vél að bretti, eitt hús</h2>
        <p className="sh-head__sub" data-lines>Fylgdu einu flaki eftir línunni. Hvert skref á henni er eitthvað sem fyrirtækin fjögur selja og þjónusta.</p>
      </div>
      <div className="sh-stack__track" ref={track}>
        <div className="sh-stack__stage">
          <div className="sh-wrap sh-stack__wrap">
            <div className="sh-stack__grid">
              <div className="sh-stack__panel">
                <Plus pos="tl" /><Plus pos="tr" /><Plus pos="bl" /><Plus pos="br" />
                <p className="sh-stack__eyebrow">Línan</p>
                <div className="sh-stack__heads">
                  {STAGES.map((s) => (
                    <div key={s.id} className="sh-stack__slide" data-slide>
                      <p className="mono sh-stack__n" data-fade>{s.n} · {s.name}</p>
                      <p className="sh-stack__line" data-split>{s.line}</p>
                      <p className="sh-stack__who" data-fade>{whoNames(s.who)}</p>
                    </div>
                  ))}
                </div>
                <div className="sh-stack__dots" aria-hidden="true">
                  {STAGES.map((s) => <span key={s.id} className="sh-stack__dot" data-dot><span className="sh-stack__fill" data-fill /></span>)}
                </div>
              </div>
              <div className="sh-stack__view">
                <div className="sh-stack__dotgrid" aria-hidden="true" />
                <div className="sh-stack__card">
                  <LineSvg active={null} view="overview" form={0} svgRef={svg} label="Teikning af línu: skurðarvél, samvalsvog, bakkapökkunarvél, merkivél, kassavél og brettavafningsvél á einu færibandi, með laxaflök sem verða að merktum bökkum í kassa á vöfðu bretti" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <nav className="sh-wrap sh-steps" aria-label="Skref í línunni">
        <ul>
          {STAGES.map((s) => <li key={s.id}><Link to={`${to('/velar')}?skref=${s.id}`}><span className="mono">{s.n}</span> {s.name}</Link></li>)}
        </ul>
      </nav>
    </section>
  )
}

function Sectors() {
  const sec = useRef<HTMLElement>(null)
  const rm = useReducedMotion()
  useEffect(() => {
    if (!sec.current) return
    if (rm) { sec.current.querySelector('[data-crate]')?.setAttribute('transform', 'translate(0 0)'); sec.current.querySelectorAll('[data-guide]').forEach((l) => l.setAttribute('y1', l.getAttribute('y2') ?? '0')); return }
    return cubeDrop(sec.current)
  }, [rm])
  return (
    <section className="sh-sectors" id="atvinnugreinar" ref={sec} aria-labelledby="geirar-h">
      <div className="sh-wrap sh-sectors__grid">
        <div className="sh-sectors__top">
          <h2 id="geirar-h" className="sh-sectors__title" data-lines>Breiður hópur viðskiptavina</h2>
          <p className="sh-sectors__sub" data-lines>Starfsemin hófst í kringum sjávarútveginn, sem stendur enn undir tæplega helmingi teknanna, og í dag þjónum við fjölmörgum öðrum greinum atvinnulífsins.</p>
          <div className="sh-sectors__art"><CubeDrop /></div>
        </div>
        <ul className="sh-sectors__list" data-grid-reveal>
          {SECTORS.map((s) => (
            <li key={s.slug} data-grid-item>
              <Link to={to(`/atvinnugreinar/${s.slug}`)}>
                <span className="sh-sectors__name">{s.name}</span>
                <span className="sh-sectors__go">{s.products.slice(0, 3).map((p) => p.k).join(', ')}<Arrow /></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Group() {
  return (
    <section className="sh-group" id="samstaedan" aria-labelledby="hattur-h">
      <div className="sh-wrap">
        <div className="sh-group__head">
          <h2 id="hattur-h" className="sh-h2" data-lines>Fjögur fyrirtæki undir einum hatti</h2>
          <p className="sh-head__sub" data-lines>Við Suðurhraun í Garðabæ og í Reykjanesbæ. Ein fyrirspurn ratar á réttan stað, sama hvert fyrirtækið er.</p>
        </div>
        <ol className="sh-group__list" data-grid-reveal>
          {GROUP.map((g) => (
            <li key={g.id} className="sh-member" data-grid-item>
              <div className="sh-member__name">
                <h3>{g.name}</h3>
                <p className="mono">{g.since}</p>
              </div>
              <div className="sh-member__what">
                <p className="sh-member__lead">{g.what}</p>
                <p className="sh-member__own">{g.own}</p>
                {g.joined && <p className="sh-member__joined">{g.joined}</p>}
              </div>
              <div className="sh-member__reach">
                <a href={g.phoneHref} className="sh-member__tel">{g.phone}</a>
                <a href={`mailto:${g.email}`}>{g.email}</a>
                <a href={g.url} target="_blank" rel="noopener noreferrer">{g.urlLabel} <Arrow /><span className="sh-sr"> (opnast í nýjum glugga)</span></a>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Story() {
  return (
    <section className="sh-story" aria-labelledby="saga-h">
      <div className="sh-wrap sh-story__grid">
        <figure className="sh-story__art">
          <Tile photo={PHOTO.trollakassi} sizes="(max-width: 767px) 80vw, 30vw" />
        </figure>
        <div className="sh-story__copy">
          <h2 id="saga-h" className="sh-sr">Sagan</h2>
          <blockquote className="sh-quote">
            <p data-lines>„{QUOTE.text}“</p>
            <footer><strong>{QUOTE.who}</strong>, {QUOTE.role}</footer>
          </blockquote>
          {STORY.map((p, i) => <p key={i} className="sh-story__p">{p}</p>)}
        </div>
      </div>
    </section>
  )
}

function Work() {
  return (
    <section className="sh-work" aria-labelledby="verk-h">
      <div className="sh-wrap">
        <h2 id="verk-h" className="sh-h2" data-lines>Umbúðir frá Samhentum</h2>
        <ul className="sh-work__grid" data-grid-reveal>
          {WORK.map((w, i) => (
            <li key={i} className={`sh-work__item sh-work__item--${i}`} data-grid-item>
              {w.sector ? (
                <Link to={to(`/atvinnugreinar/${w.sector}`)} className="sh-work__link">
                  <Tile photo={w.photo} sizes="(max-width: 767px) 92vw, 33vw" />
                  <span className="sh-work__cap"><strong>{w.t}</strong> {w.s}</span>
                </Link>
              ) : (
                <div className="sh-work__link">
                  <Tile photo={w.photo} sizes="(max-width: 767px) 92vw, 33vw" />
                  <span className="sh-work__cap"><strong>{w.t}</strong> {w.s}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Design() {
  return (
    <section className="sh-design" id="honnun" aria-labelledby="honnun-h">
      <div className="sh-wrap sh-design__grid">
        <div className="sh-design__copy">
          <h2 id="honnun-h" className="sh-h2" data-lines>Lausnir að þínum þörfum</h2>
          <p className="sh-head__sub" data-lines>{DESIGN.lead}</p>
          <dl className="sh-design__list">
            {DESIGN.items.map((d) => <div key={d.k}><dt>{d.k}</dt><dd>{d.v}</dd></div>)}
          </dl>
          <div className="sh-design__act">
            <Btn tone="blue" to={`${to('/fyrirspurn')}?leid=umbudir&synishorn=1`} arrow>Óska eftir sýnishorni</Btn>
          </div>
        </div>
        <div className="sh-design__art">
          <Tile photo={PHOTO.pappi} sizes="(max-width: 767px) 80vw, 34vw" />
        </div>
      </div>
    </section>
  )
}

function Service() {
  return (
    <section className="sh-service" aria-labelledby="thj-h">
      <div className="sh-wrap">
        <div className="sh-service__top">
          <h2 id="thj-h" className="sh-h2" data-lines>Vél í notkun?</h2>
          <p className="sh-head__sub" data-lines>{SERVICE_TEXT}</p>
        </div>
        <div className="sh-service__grid" data-grid-reveal>
          <div className="sh-service__card sh-service__card--blue" data-grid-item>
            <p className="mono">Ef framleiðslan stendur kyrr</p>
            <a className="sh-phone" href={CONTACT.phoneHref}><span>Skiptiborð, opið virka daga</span><strong>{CONTACT.phone}</strong></a>
            {ON_CALL.map((p) => <a key={p.phone} className="sh-phone" href={p.href}><span>{p.name}, utan opnunartíma</span><strong>{p.phone}</strong></a>)}
          </div>
          <div className="sh-service__card" data-grid-item>
            <p className="mono">Svo fyrsta svarið sé svar</p>
            <ReadyList items={SERVICE_READY} />
            <div className="sh-service__act">
              <Btn tone="blue" to={to('/thjonusta')} arrow>Senda þjónustubeiðni</Btn>
              <Link className="sh-textlink" to={to('/velar')}>Vélar og búnaður <Arrow /></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Numbers() {
  const t = [
    { n: '30', l: 'ár frá stofnun Samhentra' },
    { n: '15.000', l: 'fermetrar undir lager' },
    { n: '1937', l: 'Kassagerð Reykjavíkur stofnuð' },
    { n: '14', l: 'ára meðalstarfsaldur' },
  ]
  return (
    <section className="sh-numbers" aria-labelledby="tolur-h">
      <div className="sh-wrap">
        <h2 id="tolur-h" className="sh-sr">Í tölum</h2>
        <div className="sh-stats" data-stats>
          {t.map((x) => (
            <div key={x.l} className="sh-stat">
              <span className="sh-stat__n" data-count>{x.n}</span>
              <span className="sh-stat__l mono" data-scramble>{x.l}</span>
            </div>
          ))}
        </div>
        <div className="sh-numbers__grid">
          <p className="sh-numbers__stock">{STOCK_TEXT}</p>
          <ul className="sh-certs">
            {CERTS.map((c) => <li key={c.k}><strong>{c.k}</strong><span>{c.v}</span></li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Closing() {
  const sec = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const rm = useReducedMotion()
  useEffect(() => (sec.current && canvas.current ? lineField(sec.current, canvas.current, rm) : undefined), [rm])
  return (
    <section className="sh-closing" ref={sec} aria-labelledby="lok-h">
      <canvas ref={canvas} className="sh-closing__bg" aria-hidden="true" />
      <div className="sh-wrap sh-closing__in">
        <h2 id="lok-h" className="sh-closing__title" data-lines>Þín hugmynd rúmast hjá okkur</h2>
        <p className="sh-closing__sub" data-lines>{LEAD}</p>
        <div className="sh-doors">
          <Btn tone="onblue" to={to('/fyrirspurn')}>Senda fyrirspurn</Btn>
          <Btn tone="ghost" to={to('/thjonusta')}>Þjónustubeiðni</Btn>
        </div>
      </div>
    </section>
  )
}

export function HomeBody() {
  const root = useRef<HTMLDivElement>(null)
  const rm = useReducedMotion()
  useEffect(() => (root.current ? setupMotion(root.current) : undefined), [rm])
  return (
    <div ref={root}>
      <Hero />
      <Rule />
      <Stack />
      <Sectors />
      <Group />
      <Story />
      <Work />
      <Design />
      <Service />
      <Numbers />
      <Closing />
    </div>
  )
}
