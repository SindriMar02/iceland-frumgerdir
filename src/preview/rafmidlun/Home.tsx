import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BoardArt, CubeDrop, LineSvg } from './Art'
import { ABOUT, AIM, BADGES, CONTACT, INTRO, LEAD, SERVICES, SERVICE_WORDS, STAGES, TAGLINE, WHOLE, WORK_ORDER_READY, staffCount } from './data'
import { cubeDrop, initStack, lineField, setupMotion, wireField } from './motion'
import { Partners, ReadyList, ServiceCard } from './parts'
import { Arrow, Btn, Oval, to, useMedia, useReducedMotion } from './ui'

/* The home page. The engine's section order, re-aimed at an electrical contractor: hero on the
   conductors of their logo, the oval divider, the pinned line of their own sentence (ráðgjöf to
   framkvæmd) where one switchboard is built, the five fields of work, the board dropping onto its
   plinth for skápasmíði, the work order their site has lost, numbers, partners, and the close on
   their navy. */

export function Hero() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const rm = useReducedMotion()
  /* the conductors keep moving beside the headline, so they have their own stop control (WCAG 2.2.2) */
  const [paused, setPaused] = useState(false)
  useEffect(() => (canvas.current ? wireField(canvas.current, rm || paused) : undefined), [rm, paused])
  return (
    <section className="rm-hero" aria-labelledby="rm-h1">
      <div className="rm-wrap rm-hero__in">
        <p className="mono rm-hero__eyebrow">Rafverktaki og innflytjandi · Frá 1996</p>
        <h1 id="rm-h1" className="rm-hero__title">{TAGLINE}</h1>
        <p className="rm-hero__sub">{LEAD}</p>
        <div className="rm-doors">
          <Btn tone="blue" to={to('/verkbeidni')}>Senda verkbeiðni</Btn>
          <Btn tone="white" href={CONTACT.phoneHref}>Sími {CONTACT.phone}</Btn>
        </div>
        <figure className="rm-hero__board">
          <BoardArt label="Teikning af lokaðri rafmagnstöflu á sökkli, með merkimiða á hurðinni og strengi upp úr toppnum" />
        </figure>
      </div>
      <div className="rm-hero__field">
        <canvas ref={canvas} className="rm-hero__canvas" aria-hidden="true" />
      </div>
      {!rm && (
        <button type="button" className="rm-hero__pause" aria-pressed={paused} onClick={() => setPaused((v) => !v)}>
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">{paused ? <path d="M4 2.5v11l9-5.5z" fill="currentColor" /> : <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor" />}</svg>
          <span className="rm-sr">{paused ? 'Setja hreyfingu af stað' : 'Stöðva hreyfingu'}</span>
        </button>
      )}
    </section>
  )
}

export const Rule = () => (
  <div className="rm-rule" data-rule aria-hidden="true">
    <span className="rm-rule__wires rm-rule__wires--l" />
    <Oval className="rm-rule__oval" />
    <span className="rm-rule__wires rm-rule__wires--r" />
  </div>
)

const Plus = ({ pos }: { pos: string }) => (
  <span className={`rm-plus rm-plus--${pos}`} aria-hidden="true"><svg viewBox="0 0 12 12"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.2" /></svg></span>
)

const LINE_LABEL = 'Teikning af kapalstiga sem tafla ferðast eftir: fundarborð með uppdrætti og öryggishjálmi, skrifborð með einlínumynd á skjá, teiknivél, lagerhillur með kapalkefli og kössum, og veggur með kapalstiga, þar sem lokuð tafla stendur tilbúin'

function Stack() {
  const track = useRef<HTMLDivElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  /* a pinned scene needs a tall window: a phone on its side gets the same five steps as a plain list */
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
      <section className="rm-stack rm-stack--static" id="linan" aria-labelledby="linan-h">
        <div className="rm-wrap">
          <h2 id="linan-h" className="rm-h2">Frá ráðgjöf til framkvæmdar</h2>
          <p className="rm-head__sub">{WHOLE}</p>
          <ol className="rm-stack__list">
            {STAGES.map((s, i) => (
              <li key={s.id}>
                <div className="rm-stack__panel">
                  <p className="mono">{s.n} {s.name}</p>
                  <p className="rm-stack__line">{s.line}</p>
                </div>
                <div className="rm-stack__view"><div className="rm-stack__card"><LineSvg active={i} view={i} form={i + 1} /></div></div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    )
  }

  return (
    <section className="rm-stack" id="linan" aria-labelledby="linan-h">
      <div className="rm-wrap rm-stack__intro">
        <h2 id="linan-h" className="rm-h2" data-lines>Frá ráðgjöf til framkvæmdar</h2>
        <p className="rm-head__sub" data-lines>{WHOLE} Fylgdu einni töflu eftir stiganum.</p>
      </div>
      <div className="rm-stack__track" ref={track}>
        <div className="rm-stack__stage">
          <div className="rm-wrap rm-stack__wrap">
            <div className="rm-stack__grid">
              <div className="rm-stack__panel">
                <Plus pos="tl" /><Plus pos="tr" /><Plus pos="bl" /><Plus pos="br" />
                <p className="rm-stack__eyebrow">Heildarlausn</p>
                <div className="rm-stack__heads">
                  {STAGES.map((s) => (
                    <div key={s.id} className="rm-stack__slide" data-slide>
                      <p className="mono rm-stack__n" data-fade>{s.n} · {s.name}</p>
                      <p className="rm-stack__line" data-split>{s.line}</p>
                    </div>
                  ))}
                </div>
                <div className="rm-stack__dots" aria-hidden="true">
                  {STAGES.map((s) => <span key={s.id} className="rm-stack__dot" data-dot><span className="rm-stack__fill" data-fill /></span>)}
                </div>
              </div>
              <div className="rm-stack__view">
                <div className="rm-stack__dotgrid" aria-hidden="true" />
                <div className="rm-stack__card">
                  <LineSvg active={null} view="overview" form={0} svgRef={svg} label={LINE_LABEL} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="rm-wrap rm-steps">
        <ol aria-label="Skrefin fimm">
          {STAGES.map((s) => <li key={s.id}><span className="mono">{s.n}</span> {s.name}</li>)}
        </ol>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section className="rm-services" id="thjonusta" aria-labelledby="svid-h">
      <div className="rm-wrap">
        <div className="rm-services__head">
          <h2 id="svid-h" className="rm-h2" data-lines>Á öllum sviðum rafverktöku</h2>
          <p className="rm-head__sub" data-lines>{AIM}</p>
        </div>
        <div className="rm-scards" data-grid-reveal>
          {SERVICES.map((s) => <div key={s.slug} data-grid-item><ServiceCard s={s} /></div>)}
        </div>
      </div>
    </section>
  )
}

function Cabinets() {
  const sec = useRef<HTMLElement>(null)
  const rm = useReducedMotion()
  useEffect(() => {
    if (!sec.current) return
    if (rm) { sec.current.querySelector('[data-crate]')?.setAttribute('transform', 'translate(0 0)'); sec.current.querySelectorAll('[data-guide]').forEach((l) => l.setAttribute('y1', l.getAttribute('y2') ?? '0')); return }
    return cubeDrop(sec.current)
  }, [rm])
  return (
    <section className="rm-cabinets" id="skapasmidi" ref={sec} aria-labelledby="skapar-h">
      <div className="rm-wrap rm-cabinets__grid">
        <div className="rm-cabinets__copy">
          <p className="mono rm-eyebrow">Skápasmíði</p>
          <h2 id="skapar-h" className="rm-cabinets__title" data-lines>Öflugt í skápasmíði</h2>
          <p className="rm-cabinets__sub" data-lines>{INTRO}</p>
          <Partners />
          <Link className="rm-textlink" to={to('/thjonusta/skapasmidi')}>Skápasmíði <Arrow /></Link>
        </div>
        <div className="rm-cabinets__art"><CubeDrop /></div>
      </div>
    </section>
  )
}

function WorkOrder() {
  return (
    <section className="rm-order" id="verkbeidni" aria-labelledby="verkb-h">
      <div className="rm-wrap">
        <div className="rm-order__top">
          <h2 id="verkb-h" className="rm-h2" data-lines>Verkbeiðni</h2>
          <p className="rm-head__sub" data-lines>Fjögur atriði, og verkið kemst á rétta manneskju í fyrstu tilraun. Beiðnin fer beint á netfangið sem þjónustan svarar.</p>
        </div>
        <div className="rm-order__grid" data-grid-reveal>
          <div className="rm-order__card rm-order__card--blue" data-grid-item>
            <p className="mono">Hringdu ef það liggur á</p>
            <a className="rm-phone" href={CONTACT.phoneHref}><span>Skrifstofa og þjónusta</span><strong>{CONTACT.phone}</strong></a>
            <a className="rm-phone" href={CONTACT.kitchenHref}><span>Þjónusta stóreldhústækja</span><strong>{CONTACT.kitchenPhone}</strong></a>
          </div>
          <div className="rm-order__card" data-grid-item>
            <p className="mono">Það sem verkbeiðnin þarf</p>
            <ReadyList items={WORK_ORDER_READY} />
            <div className="rm-order__act">
              <Btn tone="blue" to={to('/verkbeidni')} arrow>Senda verkbeiðni</Btn>
              <Link className="rm-textlink" to={`${to('/verkbeidni')}?leid=verk`}>Nýtt verk eða útboð <Arrow /></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="rm-about" aria-labelledby="um-h">
      <div className="rm-wrap rm-about__grid">
        <div className="rm-about__copy">
          <h2 id="um-h" className="rm-h2" data-lines>Um fyrirtækið</h2>
          {ABOUT.map((p, i) => <p key={i} className="rm-about__p">{p}</p>)}
        </div>
        <aside className="rm-about__side">
          <h3 className="rm-h3">{SERVICE_WORDS.title}</h3>
          <p>{SERVICE_WORDS.text}</p>
        </aside>
      </div>
    </section>
  )
}

function Numbers() {
  const t = [
    { n: '1996', l: 'Rafmiðlun stofnað' },
    { n: '30', l: 'ár í rafverktöku' },
    { n: '10', l: 'ár Framúrskarandi fyrirtæki' },
    { n: String(staffCount), l: 'manns á starfsmannalistanum' },
  ]
  return (
    <section className="rm-numbers" aria-labelledby="tolur-h">
      <div className="rm-wrap">
        <h2 id="tolur-h" className="rm-sr">Í tölum</h2>
        <div className="rm-stats" data-stats>
          {t.map((x) => (
            <div key={x.l} className="rm-stat">
              <span className="rm-stat__n" data-count>{x.n}</span>
              <span className="rm-stat__l mono" data-scramble>{x.l}</span>
            </div>
          ))}
        </div>
        <div className="rm-badges">
          <img src={BADGES.framurskarandi.src} alt={BADGES.framurskarandi.alt} width={BADGES.framurskarandi.w} height={BADGES.framurskarandi.h} loading="lazy" decoding="async" />
          <Link to={to('/jafnlaunastefna')} className="rm-badges__eq">
            <img src={BADGES.jafnlaun.src} alt={BADGES.jafnlaun.alt} width={BADGES.jafnlaun.w} height={BADGES.jafnlaun.h} loading="lazy" decoding="async" />
            <span className="rm-textlink">Jafnlaunastefna <Arrow /></span>
          </Link>
          <Link to={to('/starfsfolk')} className="rm-badges__staff">
            <span className="mono">Starfsfólk</span>
            <span className="rm-badges__big">Beinir símar og netföng á einum lista</span>
            <span className="rm-textlink">Starfsfólk <Arrow /></span>
          </Link>
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
    <section className="rm-closing" ref={sec} aria-labelledby="lok-h">
      <canvas ref={canvas} className="rm-closing__bg" aria-hidden="true" />
      <div className="rm-wrap rm-closing__in">
        <h2 id="lok-h" className="rm-closing__title" data-lines>Hvert er verkið?</h2>
        <p className="rm-closing__sub" data-lines>{AIM}</p>
        <div className="rm-doors">
          <Btn tone="onblue" to={to('/verkbeidni')}>Senda verkbeiðni</Btn>
          <Btn tone="ghost" href={CONTACT.phoneHref}>Sími {CONTACT.phone}</Btn>
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
      <Services />
      <Cabinets />
      <WorkOrder />
      <About />
      <Numbers />
      <Closing />
    </div>
  )
}
