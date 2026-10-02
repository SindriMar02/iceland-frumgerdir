import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { CubeDrop, LineSvg } from './Art'
import { ABOUT, CONTACT, SECTORS, SERVICE_READY, SERVICE_TEXT, STAGES, SUPPLIERS, TRIAL_TEXT, PHOTO, FAMILIES } from './data'
import { cubeDrop, heroStreams, initStack, lineField, setupMotion } from './motion'
import { ReadyList, SupplierCard, Tile } from './parts'
import { Arrow, Btn, to, useMedia, useReducedMotion } from './ui'

/* The home page: Deepbook's section order, re-aimed. Hero with streams, divider, the pinned
   production line (their "stack"), who we serve (cube drop), suppliers, a white band for trials,
   service, stats, closing line field. */

export function Hero() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const rm = useReducedMotion()
  useEffect(() => (canvas.current ? heroStreams(canvas.current, rm) : undefined), [rm])
  return (
    <section className="mv-hero" aria-labelledby="mv-h1">
      <canvas ref={canvas} className="mv-hero__canvas" aria-hidden="true" />
      <div className="mv-hero__veil" aria-hidden="true" />
      <div className="mv-wrap mv-hero__in">
        <p className="mono mv-hero__eyebrow">Matvélar og umbúðir ehf. · Garðabær</p>
        <h1 id="mv-h1" className="mv-hero__title" data-lines>Vélar og þjónusta fyrir matvælaiðnaðinn</h1>
        <p className="mv-hero__sub" data-lines>
          Frá forvinnslu til pökkunar. Við seljum og þjónustum vélar fyrir kjötvinnslur, fiskvinnslur, kjúklingaframleiðendur, iðnaðarbakarí og mjólkuriðnaðinn.
        </p>
        <div className="mv-doors">
          <Btn tone="signal" to={`${to('/fyrirspurn')}?leid=ny`}>Ný vél eða ráðgjöf</Btn>
          <Btn tone="white" to={to('/thjonusta')}>Þjónusta og varahlutir</Btn>
        </div>
      </div>
    </section>
  )
}

export const Rule = () => (
  <div className="mv-rule" data-rule aria-hidden="true"><span className="mv-rule__cube" /><span className="mv-rule__cube" /></div>
)

const Plus = ({ pos }: { pos: string }) => (
  <span className={`mv-plus mv-plus--${pos}`} aria-hidden="true"><svg viewBox="0 0 12 12"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.2" /></svg></span>
)

function Stack() {
  const track = useRef<HTMLDivElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  /* a pinned scene needs a tall window: a phone on its side gets the same five stages as a plain list */
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
      <section className="mv-stack mv-stack--static" id="linan" aria-labelledby="linan-h">
        <div className="mv-wrap">
          <p className="mono mv-eyebrow">Framleiðslulínan</p>
          <h2 id="linan-h" className="mv-h2">Frá forvinnslu til pökkunar</h2>
          <ol className="mv-stack__list">
            {STAGES.map((s, i) => (
              <li key={s.id}>
                <div className="mv-stack__panel">
                  <p className="mono">{s.n} {s.name}</p>
                  <p className="mv-stack__line">{s.line}</p>
                  <p className="mv-stack__steps">{s.steps}</p>
                </div>
                <div className="mv-stack__view"><div className="mv-stack__card"><LineSvg active={i} view={i} form={i + 1} /></div></div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    )
  }

  return (
    <section className="mv-stack" id="linan" aria-labelledby="linan-h">
      <h2 id="linan-h" className="mv-sr">Framleiðslulínan, frá forvinnslu til pökkunar</h2>
      <div className="mv-stack__track" ref={track}>
        <div className="mv-stack__stage">
          <div className="mv-wrap mv-stack__wrap">
            <div className="mv-stack__grid">
              <div className="mv-stack__panel">
                <Plus pos="tl" /><Plus pos="tr" /><Plus pos="bl" /><Plus pos="br" />
                <p className="mv-stack__eyebrow">Framleiðslulínan</p>
                <div className="mv-stack__heads">
                  {STAGES.map((s) => (
                    <div key={s.id} className="mv-stack__slide" data-slide>
                      <p className="mono mv-stack__n" data-fade>{s.n} · {s.name}</p>
                      <p className="mv-stack__line" data-split>{s.line}</p>
                      <p className="mv-stack__steps" data-fade>{s.steps}</p>
                    </div>
                  ))}
                </div>
                <div className="mv-stack__dots" aria-hidden="true">
                  {STAGES.map((s) => <span key={s.id} className="mv-stack__dot" data-dot><span className="mv-stack__fill" data-fill /></span>)}
                </div>
              </div>
              <div className="mv-stack__view">
                <div className="mv-stack__dotgrid" aria-hidden="true" />
                <div className="mv-stack__card">
                  <LineSvg active={null} view="overview" form={0} svgRef={svg} label="Teikning af framleiðslulínu: hakkavél, saltsprauta, formunarvél, ofn og pökkunarvél á einu færibandi, með vöruna á leið eftir bandinu" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <nav className="mv-wrap mv-steps" aria-label="Skref í línunni">
        <p className="mono">Skoða vélar eftir skrefi</p>
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
    <section className="mv-sectors" ref={sec} aria-labelledby="geirar-h">
      <div className="mv-wrap">
        <div className="mv-sectors__top">
          <h2 id="geirar-h" className="mv-sectors__title" data-lines>Hverja við þjónum</h2>
          <p className="mv-sectors__sub" data-lines>Við vöxum með viðskiptavinum okkar: kjötvinnslur, fiskvinnslur, kjúklingaframleiðendur, iðnaðarbakarí og mjólkuriðnaðinn.</p>
        </div>
        <div className="mv-sectors__art"><CubeDrop /></div>
        <ul className="mv-sectors__list" data-grid-reveal>
          {SECTORS.map((s, i) => (
            <li key={s.id} data-grid-item>
              <Link to={`${to('/fyrirspurn')}?leid=ny&geiri=${s.id}`}>
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="mv-sectors__name">{s.name}</span>
                <span className="mv-sectors__go">Spyrja um vélar fyrir {s.ask}<Arrow /></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Suppliers() {
  return (
    <section className="mv-suppliers" id="birgjar" aria-labelledby="birgjar-h">
      <div className="mv-wrap">
        <div className="mv-head">
          <p className="mono mv-eyebrow">Birgjar</p>
          <h2 id="birgjar-h" className="mv-h2" data-lines>Samstarf við fremstu framleiðendur heims</h2>
          <p className="mv-head__sub" data-lines>Sjö framleiðendur, frá skömmtun og formun til reykofna og umbúða. Hver þeirra með sínum orðum, eins og við lýsum þeim.</p>
        </div>
        <div className="mv-suppliers__grid" data-grid-reveal>
          {SUPPLIERS.map((s) => <div key={s.id} data-grid-item><SupplierCard s={s} /></div>)}
        </div>
        <div className="mv-suppliers__all"><Btn to={to('/velar')} tone="white" arrow>Allar vélar eftir skrefum</Btn></div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="mv-about" id="um-okkur" aria-labelledby="um-h">
      <div className="mv-wrap mv-about__grid">
        <div className="mv-about__title">
          <p className="mono mv-eyebrow">Um okkur</p>
          <h2 id="um-h" className="mv-h2" data-lines>Sala og þjónusta við matvælaiðnaðinn í landinu</h2>
        </div>
        <div className="mv-about__text">
          {ABOUT.map((p, i) => <p key={i} data-lines>{p}</p>)}
        </div>
      </div>
    </section>
  )
}

function Trial() {
  return (
    <section className="mv-trial" aria-labelledby="prufur-h">
      <div className="mv-wrap mv-trial__grid">
        <div className="mv-trial__copy">
          <p className="mono mv-eyebrow mv-eyebrow--ink">Prufur og námskeið</p>
          <h2 id="prufur-h" className="mv-h1ish" data-lines>Prufur með þínu hráefni</h2>
          <p className="mv-trial__sub" data-lines>{TRIAL_TEXT}</p>
          <div className="mv-trial__act">
            <Btn tone="dark" to={`${to('/fyrirspurn')}?leid=ny&prufa=1`}>Óska eftir prufu</Btn>
          </div>
        </div>
        <div className="mv-trial__art">
          <Tile photo={PHOTO.pylsur} />
          <p className="mono">Hráefni frá viðskiptavini, unnið á vél birgis</p>
        </div>
      </div>
    </section>
  )
}

function Service() {
  return (
    <section className="mv-service" aria-labelledby="thj-h">
      <div className="mv-wrap">
        <div className="mv-service__top">
          <p className="mono mv-eyebrow">Þjónusta</p>
          <h2 id="thj-h" className="mv-h2" data-lines>Vél í notkun?</h2>
          <p className="mv-head__sub" data-lines>{SERVICE_TEXT}</p>
        </div>
        <div className="mv-service__grid" data-grid-reveal>
          <div className="mv-service__card" data-grid-item>
            <p className="mono">Þjónusta og varahlutir</p>
            <a className="mv-phone" href={CONTACT.phoneHref}><span>Páll í Matvélum</span><strong>{CONTACT.phone}</strong></a>
            <a className="mv-phone" href={CONTACT.kappHref}><span>Rúnar í KAPP</span><strong>{CONTACT.kapp}</strong></a>
            <p className="mv-service__note">Ef framleiðslan stendur kyrr er símtal fljótlegast.</p>
          </div>
          <div className="mv-service__card" data-grid-item>
            <p className="mono">Svo fyrsta svarið sé svar</p>
            <ReadyList items={SERVICE_READY} />
            <div className="mv-service__act"><Btn tone="signal" to={to('/thjonusta')} arrow>Senda þjónustubeiðni</Btn></div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stats() {
  const t = [
    { n: String(SUPPLIERS.length), l: 'birgjar' },
    { n: String(FAMILIES.length - 1), l: 'vélaflokkar' },
    { n: String(SECTORS.length), l: 'geirar' },
    { n: '20+', l: 'ár með KG Wetter á Íslandi' },
  ]
  return (
    <section className="mv-statsec" aria-label="Í tölum">
      <div className="mv-wrap">
        <div className="mv-stats" data-stats>
          {t.map((x) => (
            <div key={x.l} className="mv-stat">
              <span className="mv-stat__n" data-count>{x.n}</span>
              <span className="mv-stat__l mono" data-scramble>{x.l}</span>
            </div>
          ))}
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
    <section className="mv-closing" ref={sec} aria-labelledby="lok-h">
      <canvas ref={canvas} className="mv-closing__bg" aria-hidden="true" />
      <div className="mv-wrap mv-closing__in">
        <p className="mono mv-closing__eyebrow">Byrjum á réttum upplýsingum</p>
        <h2 id="lok-h" className="mv-closing__title" data-lines>Segðu okkur hvað þú framleiðir</h2>
        <p className="mv-closing__sub" data-lines>Fyrirspurnin kemur til okkar með öllu sem þarf til að svara: hvað er unnið, hvað vélin á að gera og hver þú ert.</p>
        <div className="mv-doors">
          <Btn tone="signal" to={`${to('/fyrirspurn')}?leid=ny`}>Ný vél eða ráðgjöf</Btn>
          <Btn tone="white" to={to('/thjonusta')}>Þjónusta og varahlutir</Btn>
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
      <Suppliers />
      <About />
      <Trial />
      <Service />
      <Stats />
      <Closing />
    </div>
  )
}
