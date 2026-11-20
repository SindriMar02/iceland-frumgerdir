import { gsap } from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BoardForm, CubeDrop } from './Art'
import { ABOUT, AIM, BADGES, CONTACT, HERO_FILM, INTRO, LEAD, LOGO, PHOTOS, SERVICES, SERVICE_WORDS, STAGES, TAGLINE, WHOLE, WORK_ORDER_READY, staffCount } from './data'
import { cubeDrop, holdReveal, lineField, releaseReveal, setupMotion } from './motion'
import { Partners, Photo, ReadyList, ServiceCard } from './parts'
import { Arrow, Btn, Oval, to, useReducedMotion } from './ui'

/* The home page. The engine's section order, re-aimed at an electrical contractor: hero on the
   conductors of their logo, the oval divider, their own sentence (ráðgjöf to framkvæmd) as five
   plain steps of one switchboard, the five fields of work, the board dropping onto its
   plinth for skápasmíði, the work order their site has lost, numbers, partners, and the close on
   their navy. */

/* the loading screen shows once per visit, on the first open of the home page; decided once, so a
   second render (StrictMode, a remount) gets the same answer */
let bootShow: boolean | null = null

export function Hero() {
  const p = PHOTOS.virkjun
  const film = useRef<HTMLVideoElement>(null)
  const photo = useRef<HTMLImageElement>(null)
  const veil = useRef<HTMLDivElement>(null)
  const [loading] = useState(() => {
    if (bootShow === null) bootShow = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return bootShow
  })
  const [gone, setGone] = useState(!loading)
  const [src, setSrc] = useState<string | null>(null)
  const [paused, setPaused] = useState(false)
  /* the film plays on open for everyone; only a data-saving connection keeps the photograph alone.
     The pause control stays for anyone who wants it still (WCAG 2.2.2). */
  useEffect(() => {
    const saving = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    if (saving) { setSrc(null); return }
    setSrc(window.matchMedia('(max-width: 767px)').matches ? HERO_FILM.narrow : HERO_FILM.wide)
  }, [])
  /* the film only plays while it is on screen. iOS wants muted set as a property before play(), and
     Low Power Mode can refuse the first play(), so the first touch or scroll asks again */
  useEffect(() => {
    const v = film.current
    if (!v) return
    v.muted = true; v.defaultMuted = true; v.setAttribute('muted', '')
    let seen = true
    const sync = () => { if (paused || !seen || document.hidden) v.pause(); else if (v.paused) v.play().catch(() => undefined) }
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; sync() })
    io.observe(v)
    const nudge = () => sync()
    const opts = { passive: true } as const
    document.addEventListener('visibilitychange', sync)
    window.addEventListener('touchstart', nudge, opts)
    window.addEventListener('pointerdown', nudge, opts)
    window.addEventListener('scroll', nudge, opts)
    sync()
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
      window.removeEventListener('touchstart', nudge)
      window.removeEventListener('pointerdown', nudge)
      window.removeEventListener('scroll', nudge)
    }
  }, [paused, src])
  /* the loading screen: a conductor line fills under the logo while the fonts, the photograph and the
     first frames of the film arrive (at least 1 s, at most 3 s), then the white panel lifts off the
     hero and the headline rises as it clears */
  useEffect(() => {
    if (!loading || !veil.current) return
    holdReveal()
    const el = veil.current
    const line = el.querySelector('.rm-veil__line i')
    const mark = el.querySelector('.rm-veil__mark')
    let done = false
    const wait = <T,>(pr: Promise<T>) => pr.catch(() => undefined)
    const filmReady = () => new Promise<void>((res) => {
      const t = window.setInterval(() => { const v = film.current; if (!v || v.readyState >= 3) { window.clearInterval(t); res() } }, 80)
    })
    const fill = gsap.fromTo(line, { scaleX: 0 }, { scaleX: 0.86, duration: 2.2, ease: 'power2.out' })
    const ready = Promise.all([
      wait(document.fonts?.ready ?? Promise.resolve()),
      wait(photo.current?.decode() ?? Promise.resolve()),
      filmReady(),
      new Promise((r) => window.setTimeout(r, 1000)),
    ])
    const cap = new Promise((r) => window.setTimeout(r, 3000))
    const out = () => {
      if (done) return
      done = true
      bootShow = false
      fill.kill()
      const tl = gsap.timeline({ onComplete: () => setGone(true) })
      tl.to(line, { scaleX: 1, duration: 0.35, ease: 'power2.inOut' })
        .to([mark, el.querySelector('.rm-veil__line')], { y: -14, opacity: 0, duration: 0.45, ease: 'power2.in', stagger: 0.05 }, '+=0.08')
        .to(el, { yPercent: -100, duration: 1.05, ease: 'rmcurtain' }, '-=0.12')
        .add(() => releaseReveal(), '-=0.62')
    }
    Promise.race([ready, cap]).then(out)
    return () => { done = true; fill.kill(); releaseReveal() }
  }, [loading])
  return (
    <section className="rm-hero" aria-labelledby="rm-h1">
      {!gone && (
        <div ref={veil} className="rm-veil" aria-hidden="true">
          <img className="rm-veil__mark" src={LOGO.src} alt="" width={LOGO.w} height={LOGO.h} />
          <span className="rm-veil__line"><i /></span>
        </div>
      )}
      <div className="rm-wrap rm-hero__in">
        <p className="mono rm-hero__eyebrow">Rafverktaki og innflytjandi · Frá 1996</p>
        <h1 id="rm-h1" className="rm-hero__title" data-lines>{TAGLINE}</h1>
        <p className="rm-hero__sub" data-lines>{LEAD}</p>
        <div className="rm-doors">
          <Btn tone="blue" to={to('/verkbeidni')}>Senda verkbeiðni</Btn>
          <Btn tone="white" href={CONTACT.phoneHref}>Sími {CONTACT.phone}</Btn>
        </div>
      </div>
      {/* the photograph on their own front page, edge to edge under the headline */}
      <div className="rm-hero__photo">
        <picture>
          {p.narrow && <source media="(max-width: 767px)" type="image/webp" srcSet={p.narrow.set} sizes="100vw" />}
          <img ref={photo} src={p.wide.src} srcSet={p.wide.set} sizes="100vw" alt={p.alt} width={p.wide.w} height={p.wide.h} decoding="async" />
        </picture>
        {src && (
          <video
            ref={film} className="rm-hero__film" src={src} muted loop playsInline autoPlay preload="auto"
            aria-hidden="true" tabIndex={-1} disablePictureInPicture
            onPlaying={(e) => e.currentTarget.classList.add('is-on')}
          />
        )}
      </div>
      {/* the steam keeps moving, so it has its own stop control (WCAG 2.2.2) */}
      {src && (
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

/* The whole job, one switchboard as the example: five steps side by side, each with a drawing of
   the board as it stands at that step and a caption that says so. Nothing pinned, nothing to scroll
   through: the visitor reads it like a row of cards (Sindri 2026-11-16: the pinned scene was unclear). */
function Stack() {
  return (
    <section className="rm-stack" id="linan" aria-labelledby="linan-h">
      <div className="rm-wrap">
        <div className="rm-stack__intro">
          <p className="mono rm-stack__eyebrow">Heildarlausn</p>
          <h2 id="linan-h" className="rm-h2" data-lines>Allt verkið á einum stað</h2>
          <p className="rm-head__sub">{WHOLE} Hér er dæmi: ein rafmagnstafla, frá fyrsta fundi þar til hún er komin upp og tengd.</p>
        </div>
        <ol className="rm-stack__row" data-grid-reveal>
          {STAGES.map((s) => (
            <li key={s.id} className="rm-stack__step" data-grid-item>
              <figure className="rm-stack__fig">
                <div className="rm-stack__art"><BoardForm form={s.form} /></div>
                <figcaption className="mono">{s.draw}</figcaption>
              </figure>
              <p className="mono rm-stack__n"><span>{s.n}</span> {s.name}</p>
              <p className="rm-stack__line">{s.line}</p>
            </li>
          ))}
        </ol>
        <div className="rm-stack__cta">
          <Link className="rm-textlink" to={`${to('/verkbeidni')}?leid=verk`}>Nýtt verk eða útboð <Arrow /></Link>
        </div>
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
      <div className="rm-wrap rm-about__photo"><Photo p={PHOTOS.skapur} /></div>
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
