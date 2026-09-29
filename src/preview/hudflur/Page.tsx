/**
 * Húðflúrstofa Norðurlands · "Blek á húð" (rebuild 2026-09-29, replaces "Fine Line").
 *
 * Look: Sindri's SAINTS reference board (anydesign pass in _docs/hudflur-harvest-2026-09-29/design.md),
 * made theirs: the studio's own Facebook cover already pairs a blackletter wordmark with the chrome
 * eagle shield, so the blackletter here is Grenze Gotisch (self-hosted, carries ð þ æ ö) standing in
 * for their letter, the name is set as the SAINTS poster in Cabinet Grotesk 800, and every picture is
 * one of their own posted pieces.
 * Motion: the live-up.co.jp teardown (sndr-teardowns PR #3), see motion.ts.
 *
 * Structure that must work without motion (header state, drawer, filters, tap-to-open, e-mail copy,
 * the fitted type) lives here and runs in both branches; motion.ts only adds travel.
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { MouseEvent as RMouseEvent } from 'react'
import { companyEntry } from './company'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setMetaDescription, setThemeColor } from '../../lib/preview'
import { hudflurCss } from './styles'
import { initHudflurMotion, refreshTriggers, scrollToHash } from './motion'
import {
  BOOK_HREF, CONTACT, EMAIL, FACEBOOK, GIFT, HERO, JSON_LD, LOGO, MAP, META, NAV, PHONE, PROCESS, STUDIO, TAGS, WALL, WORKS,
  work, workSet,
} from './data'
import type { Tag, Work } from './data'

const B = import.meta.env.BASE_URL
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const INTRO_KEY = 'hf-intro-seen'
const ROMAN = ['I', 'II', 'III', 'IV']

/* one masked line (live-up M4): the outer span clips, the inner span travels */
function Line({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`hf-line ${className}`} data-hf-mask=""><span>{children}</span></span>
}

/* big sans title + blackletter gloss, the live-up EN title / JA gloss pairing */
function Title({ id, lines, gloss }: { id: string; lines: string[]; gloss: string }) {
  return (
    <h2 className="hf-title" id={id}>
      {lines.map((l) => <Line key={l}>{l}</Line>)}
      <Line className="hf-gloss">{gloss}</Line>
    </h2>
  )
}

function Arrow() {
  return (
    <svg className="hf-btn__arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

/* the live-up Contact Form label roll: the same word twice, the second rolls up on hover */
function Btn({ href, children, ghost = false, onClick }: { href: string; children: string; ghost?: boolean; onClick?: (e: RMouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <a className={`hf-btn${ghost ? ' hf-btn--ghost' : ''}`} href={href} onClick={onClick}>
      <span className="hf-btn__roll"><span>{children}</span><span aria-hidden="true">{children}</span></span>
      <Arrow />
    </a>
  )
}

/* fit one line of type to its container's width: measured at 100px once the fonts are in */
function useFit(ref: React.RefObject<HTMLElement | null>, prop: string, max = Infinity) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const run = () => {
      const box = el.parentElement!.clientWidth
      el.style.setProperty(prop, '100px')
      el.style.display = 'inline-block'
      el.style.width = 'auto'
      const natural = el.scrollWidth
      el.style.display = ''
      el.style.width = ''
      if (natural) el.style.setProperty(prop, `${Math.min(max, (100 * box) / natural).toFixed(2)}px`)
    }
    run()
    document.fonts?.ready.then(run)
    const ro = new ResizeObserver(run)
    ro.observe(el.parentElement!)
    return () => ro.disconnect()
  }, [ref, prop, max])
}

function useMedia(query: string) {
  const [on, setOn] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const m = window.matchMedia(query)
    const f = () => setOn(m.matches)
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [query])
  return on
}

function WorkCard({ w, open, onToggle }: { w: Work; open: boolean; onToggle: () => void }) {
  return (
    <figure
      className={`hf-work${open ? ' is-open' : ''}`} onClick={onToggle} tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle() } }}
    >
      <img
        src={work(w.f, 960)} srcSet={workSet(w.f)} sizes="(max-width: 768px) 48vw, 24vw"
        width={w.w} height={w.h} alt={w.alt} loading="lazy" decoding="async"
      />
      <figcaption className="hf-work__veil">
        <span className="hf-work__line"><span className="hf-work__title">{w.own ? `„${w.title}“` : w.title}</span></span>
        <span className="hf-work__line"><span className="hf-work__date">{w.date}</span></span>
      </figcaption>
    </figure>
  )
}

function Works() {
  const [tag, setTag] = useState<'allt' | Tag>('allt')
  const [all, setAll] = useState(false)
  const [openF, setOpenF] = useState<string | null>(null)
  const [swapping, setSwapping] = useState(false)
  const narrow = useMedia('(max-width: 768px)')
  const cols = narrow ? 2 : 4
  const picked = useMemo(() => WORKS.filter((w) => tag === 'allt' || w.tag === tag), [tag])
  const shown = tag === 'allt' && !all ? picked.slice(0, 12) : picked
  const dealt = useMemo(() => {
    const c: Work[][] = Array.from({ length: cols }, () => [])
    shown.forEach((w, i) => c[i % cols].push(w))
    return c
  }, [shown, cols])
  const note = TAGS.find((t) => t.key === tag)!.note
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    refreshTriggers()
  }, [tag, all, cols])

  /* live-up's grid crossfade: fade the old deal out, re-deal, fade the new one in */
  const pick = (next: 'allt' | Tag) => {
    if (next === tag) return
    setOpenF(null)
    if (reducedMotion()) { setTag(next); return }
    setSwapping(true)
    window.setTimeout(() => { setTag(next); setSwapping(false) }, 260)
  }

  return (
    <section className="hf-sec hf-works" id="verk" aria-labelledby="verk-t">
      <div className="hf-works__head">
        <div><Title id="verk-t" lines={['Verk']} gloss="Af stofunni" /></div>
        <div className="hf-works__filters">
          <ul className="hf-tabs" aria-label="Sía verk">
            {TAGS.map((t) => (
              <li key={t.key}>
                <button type="button" className="hf-tab" aria-pressed={tag === t.key} onClick={() => pick(t.key)}>{t.label}</button>
              </li>
            ))}
          </ul>
          <div className="hf-note" aria-live="polite"><p key={note}>{note}</p></div>
        </div>
      </div>
      <div className={`hf-grid${swapping ? ' is-swapping' : ''}`}>
        {dealt.map((col, i) => (
          <div className="hf-col" key={`${tag}-${cols}-${i}`}>
            {col.map((w) => (
              <WorkCard key={w.f} w={w} open={openF === w.f} onToggle={() => { if (narrow) setOpenF((o) => (o === w.f ? null : w.f)) }} />
            ))}
          </div>
        ))}
      </div>
      {tag === 'allt' && !all && (
        <div className="hf-works__more">
          <button type="button" className="hf-btn hf-btn--ghost" onClick={() => setAll(true)}>
            <span className="hf-btn__roll"><span>Sýna öll {picked.length} verkin</span><span aria-hidden="true">Sýna öll {picked.length} verkin</span></span>
          </button>
        </div>
      )}
      <p className="hf-works__src">Öll verkin eru af Facebook-síðu stofunnar. Titlar í gæsalöppum eru þeirra eigin.</p>
    </section>
  )
}

export default function HudflurPage() {
  const company = companyEntry
  const rootRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const footRef = useRef<HTMLSpanElement>(null)
  const mailRef = useRef<HTMLSpanElement>(null)
  const css = useMemo(() => hudflurCss(B), [])
  const [intro, setIntro] = useState<'off' | 'on' | 'lit' | 'leaving'>('off')
  const [menu, setMenu] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [tip, setTip] = useState<string | null>(null)
  const tipTimer = useRef(0)

  useFit(nameRef, '--hero-size')
  useFit(footRef, '--foot-size')
  useFit(mailRef, '--mail-size', 190)

  useEffect(() => {
    document.title = META.title
    setThemeColor('#f4f4f2')
    return setMetaDescription(META.description)
  }, [])

  /* intro (live-up M2): once per visit, never under reduced motion; everyone else gets the quick entrance */
  useLayoutEffect(() => {
    const root = rootRef.current!
    let seen = false
    try { seen = sessionStorage.getItem(INTRO_KEY) === '1' } catch { /* private mode */ }
    if (seen || reducedMotion()) { root.classList.add('is-quick'); return }
    setIntro('on')
    document.documentElement.style.overflow = 'hidden'
    const t: number[] = []
    t.push(window.setTimeout(() => setIntro('lit'), 30))
    t.push(window.setTimeout(() => setIntro('leaving'), 700))
    t.push(window.setTimeout(() => {
      setIntro('off')
      document.documentElement.style.overflow = ''
      /* marked seen only once it has played, so an interrupted mount (StrictMode, fast back) plays it again */
      try { sessionStorage.setItem(INTRO_KEY, '1') } catch { /* private mode */ }
    }, 700 + 350 + 1500 + 150))
    return () => { t.forEach(clearTimeout); setIntro('off'); document.documentElement.style.overflow = '' }
  }, [])

  /* motion branch */
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || reducedMotion()) return
    return initHudflurMotion(root)
  }, [])

  /* masthead: condensed past 60px, scroll-spy at 42% of the viewport (live-up M3). Structural, both branches. */
  useEffect(() => {
    const head = headRef.current!
    const ids = NAV.map((n) => n.href.slice(1))
    let raf = 0
    const update = () => {
      raf = 0
      head.classList.toggle('is-condensed', window.scrollY > 60)
      const line = window.innerHeight * 0.42
      const cur = ids.findIndex((id) => {
        const r = document.getElementById(id)?.getBoundingClientRect()
        return !!r && r.top <= line && r.bottom > line
      })
      head.querySelectorAll('.hf-nav a').forEach((a, i) => a.classList.toggle('is-current', i === cur))
    }
    const io = new IntersectionObserver(() => { if (!raf) raf = requestAnimationFrame(update) }, { threshold: Array.from({ length: 11 }, (_, i) => i / 10) })
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el) })
    const hero = document.querySelector('.hf-hero')
    if (hero) io.observe(hero)
    update()
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [])

  /* drawer (live-up G8-G11): unhide, then roll the clip open on the next frame; reverse on close */
  const setMenuOpen = useCallback((open: boolean) => {
    setMenu(open)
    document.documentElement.style.overflow = open ? 'hidden' : ''
    if (open) requestAnimationFrame(() => requestAnimationFrame(() => setDrawerOpen(true)))
    else setDrawerOpen(false)
  }, [])
  useEffect(() => {
    if (!menu) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menu, setMenuOpen])
  const [drawerMounted, setDrawerMounted] = useState(false)
  useEffect(() => {
    if (menu) { setDrawerMounted(true); return }
    const t = window.setTimeout(() => setDrawerMounted(false), reducedMotion() ? 0 : 480)
    return () => clearTimeout(t)
  }, [menu])

  const onAnchor = (e: RMouseEvent<HTMLElement>) => {
    const a = (e.target as HTMLElement).closest('a[href^="#"]')
    const hash = a?.getAttribute('href')
    if (!hash || hash === '#') return
    if (menu) setMenuOpen(false)
    if (scrollToHash(hash)) { e.preventDefault(); history.replaceState(null, '', hash) }
  }

  /* the e-mail (live-up M11): click copies, the tooltip says so; no clipboard → mail client */
  const copyMail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setTip(CONTACT.copied)
      window.clearTimeout(tipTimer.current)
      tipTimer.current = window.setTimeout(() => setTip(null), 1500)
    } catch { window.location.href = `mailto:${EMAIL}` }
  }

  return (
    <div ref={rootRef} className="hf-root" lang="is" onClick={onAnchor}>
      <style>{css}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />
      <a className="hf-skip" href="#efni">Fara í efni</a>

      {intro !== 'off' && (
        <div className={`hf-intro${intro === 'lit' || intro === 'leaving' ? ' is-lit' : ''}${intro === 'leaving' ? ' is-leaving' : ''}`} aria-hidden="true">
          <div className="hf-intro__veil" />
          <div className="hf-intro__shutter" />
          <div className="hf-intro__mark">
            <img src={LOGO} alt="" width={120} height={170} />
            <span>Húðflúrstofa Norðurlands</span>
          </div>
        </div>
      )}

      <header ref={headRef} className={`hf-head${menu ? ' is-menu' : ''}`}>
        <a className="hf-brand" href="#efni" aria-label="Húðflúrstofa Norðurlands, efst á síðu">
          <span className="hf-brand__black">Húðflúrstofa</span>
          <span className="hf-brand__sans">Norðurlands</span>
        </a>
        <nav className="hf-nav" aria-label="Aðalvalmynd">
          {NAV.slice(0, 3).map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
          <a className="hf-nav__book" href="#samband">{HERO.cta}</a>
        </nav>
        <button type="button" className="hf-burger" aria-expanded={menu} aria-controls="hf-drawer" onClick={() => setMenuOpen(!menu)}>
          <span className="hf-burger__face hf-burger__face--open">Valmynd</span>
          <span className="hf-burger__face hf-burger__face--close">Loka</span>
          <span className="hf-sr">{menu ? 'Loka valmynd' : 'Opna valmynd'}</span>
        </button>
      </header>
      {drawerMounted && (
        <div id="hf-drawer" className={`hf-drawer${drawerOpen ? ' is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Valmynd">
          <nav className="hf-drawer__links" aria-label="Valmynd">
            {NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
          </nav>
          <div className="hf-drawer__meta">
            <a href={PHONE.href}>{PHONE.display}</a>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <span>{HERO.address}</span>
          </div>
        </div>
      )}

      <main id="efni">
        {/* the SAINTS poster: their eagle, the name as the wordmark, the trade in blackletter */}
        <section className="hf-hero" aria-label="Húðflúrstofa Norðurlands">
          <div className="hf-hero__lockup">
            <span className="hf-line"><img className="hf-hero__eagle hf-rise" src={LOGO} alt="" width={120} height={170} {...({ fetchpriority: 'high' } as Record<string, string>)} /></span>
            <h1 className="hf-hero__name" ref={nameRef}>
              <span className="hf-sr">Húðflúrstofa </span>
              <span className="hf-line"><span className="hf-rise hf-rise--2">Norðurlands</span></span>
            </h1>
            <span className="hf-line hf-hero__black" aria-hidden="true"><span className="hf-rise hf-rise--3">Húðflúrstofa</span></span>
          </div>
          <div className="hf-hero__foot hf-fadein">
            <p className="hf-hero__line">{HERO.line}</p>
            <div className="hf-hero__ctas">
              <Btn href="#samband">{HERO.cta}</Btn>
              <Btn href="#verk" ghost>{HERO.ctaAlt}</Btn>
            </div>
          </div>
        </section>

        {/* the wall: blackletter as skin, one of their pieces on top of it */}
        <section className="hf-wall" aria-label="Um ókomna tíð">
          <div className="hf-wall__rows" aria-hidden="true">
            {WALL.rows.map((r, i) => (
              <div className="hf-wall__row" key={i}>{[0, 1, 2, 3].map((k) => <span key={k}>{r}</span>)}</div>
            ))}
          </div>
          <figure className="hf-wall__photo">
            <img src={work(WALL.photo, 960)} srcSet={workSet(WALL.photo)} sizes="(max-width: 768px) 52vw, 24vw" width={1440} height={1800} alt={WALL.alt} loading="lazy" decoding="async" />
          </figure>
          <p className="hf-wall__cap">{WALL.caption}</p>
          <p className="hf-wall__credit">Jo.Helgason Tattoo</p>
        </section>

        <Works />

        <section className="hf-sec hf-studio" id="stofan" aria-labelledby="stofan-t">
          <div className="hf-studio__head"><Title id="stofan-t" lines={STUDIO.heading} gloss="Stofan" /></div>
          <div className="hf-studio__text">
            <blockquote className="hf-quote">
              <p style={{ margin: 0 }} data-hf-words="">
                {`„${STUDIO.quote}“`.split(' ').map((w, i) => <span key={i}>{w} </span>)}
              </p>
              <footer>{STUDIO.quoteBy}</footer>
            </blockquote>
            <p data-hf-fade="">{STUDIO.body}</p>
            <p data-hf-fade="">{STUDIO.guests}</p>
            <dl className="hf-stats" data-hf-fade="">
              {STUDIO.stats.map((s) => <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}
            </dl>
          </div>
          <div className="hf-studio__photos">
            {STUDIO.photos.map((p) => {
              const w = WORKS.find((x) => x.f === p)!
              return (
                <figure className="hf-frame" key={p}>
                  <img src={work(p, 960)} srcSet={workSet(p)} sizes="(max-width: 768px) 46vw, 20vw" width={w.w} height={w.h} alt={w.alt} loading="lazy" decoding="async" />
                </figure>
              )
            })}
          </div>
        </section>

        <section className="hf-sec hf-night" id="ferlid" aria-labelledby="ferlid-t">
          <Title id="ferlid-t" lines={[PROCESS.heading]} gloss="Frá hugmynd að húð" />
          <ol className="hf-steps">
            {PROCESS.steps.map((s, i) => (
              <li className="hf-step" key={s.title} data-hf-fade="">
                <span className="hf-step__n" aria-hidden="true">{ROMAN[i]}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
          <details className="hf-care">
            <summary>{PROCESS.careTitle}<span className="hf-care__plus" aria-hidden="true" /></summary>
            <ul>{PROCESS.care.map((c) => <li key={c}>{c}</li>)}</ul>
          </details>
        </section>

        <section className="hf-sec hf-gift" aria-labelledby="gjafabref-t">
          <div className="hf-gift__photo">
            <figure className="hf-frame">
              <img src={work(GIFT.photo, 960)} srcSet={workSet(GIFT.photo)} sizes="(max-width: 768px) 92vw, 40vw" width={1440} height={1440} alt={GIFT.alt} loading="lazy" decoding="async" />
            </figure>
          </div>
          <div className="hf-gift__text">
            <Title id="gjafabref-t" lines={[GIFT.heading]} gloss="Í jólagjöf eða afmælisgjöf" />
            <blockquote className="hf-quote" data-hf-fade="">
              <p style={{ margin: 0 }}>„{GIFT.quote}“</p>
              <footer>{GIFT.quoteBy}</footer>
            </blockquote>
            <Btn href={GIFT.href} ghost>{GIFT.cta}</Btn>
          </div>
        </section>

        <section className="hf-sec hf-contact" id="samband" aria-labelledby="samband-t">
          <Title id="samband-t" lines={[CONTACT.heading]} gloss="Hafa samband" />
          <p className="hf-contact__lead" data-hf-fade="">{CONTACT.lead}</p>
          <button
            type="button" className="hf-mail" onClick={copyMail} aria-label={`${CONTACT.copy}: ${EMAIL}`}
            onMouseEnter={() => setTip((t) => t ?? CONTACT.copy)} onMouseLeave={() => setTip(null)}
          >
            <span className="hf-mail__addr" ref={mailRef}>{EMAIL}</span>
            <span className="hf-mail__rule" aria-hidden="true" />
            <span className={`hf-mail__tip${tip ? '' : ' is-off'}`} aria-live="polite">{tip ?? CONTACT.copy}</span>
          </button>
          <dl className="hf-facts" data-hf-fade="">
            <div><dt>Sími</dt><dd><a href={PHONE.href}>{PHONE.display}</a></dd></div>
            <div><dt>Heimilisfang</dt><dd><a href={MAP} target="_blank" rel="noreferrer">{CONTACT.address[0]}<br />{CONTACT.address[1]}</a></dd></div>
            <div><dt>Opnunartími</dt><dd>{CONTACT.hours}</dd></div>
            <div><dt>Facebook</dt><dd><a href={FACEBOOK} target="_blank" rel="noreferrer">Senda skilaboð</a></dd></div>
          </dl>
          <div style={{ marginTop: 'clamp(32px,3vw,56px)' }}><Btn href={BOOK_HREF}>{HERO.cta}</Btn></div>
        </section>
      </main>

      <footer className="hf-foot hf-night">
        <div style={{ overflow: 'hidden' }}><span className="hf-foot__name" ref={footRef}>Húðflúrstofa Norðurlands</span></div>
        <div className="hf-foot__row">
          <img className="hf-foot__logo" src={LOGO} alt="Merki Húðflúrstofu Norðurlands" width={120} height={170} />
          <span>Gránufélagsgata 4, 600 Akureyri</span>
          <a href={PHONE.href}>{PHONE.display}</a>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <a href={FACEBOOK} target="_blank" rel="noreferrer">Facebook</a>
          <span>Opin síðan 2011</span>
        </div>
      </footer>
      <PreviewFooter company={company} verifiedContent />
    </div>
  )
}
