import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Globe, Pause, Play, Star } from 'lucide-react'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setMetaDescription, setThemeColor } from '../../lib/preview'
import { dillCss } from './styles'
import { initDillMotion } from './motion'
import {
  HERO_SLIDES, JSON_LD, OFFER, PORTRAIT, REEL_LAND, REEL_RETTIR, SPLIT_IMG, STACK_SALUR, T, URLS, brand, companyEntry, img,
  type Lang,
} from './data'

const company = companyEntry
const B = import.meta.env.BASE_URL
const BG = '#141c12'

const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const NB = '\u00A0'
const fmt = (price: string, lang: Lang) => `${price}${NB}${lang === 'is' ? 'kr' : 'ISK'}`
/* numbers keep their unit and their range words on one line */
const nb = (s: string) => s.replace(/(\d) (klst\.|kr\.?|ISK|gesti|gestir|guests|hours|réttir|courses|til|to)(?=[\s.,]|$)/g, `$1${NB}$2`).replace(/\b(til|to) (\d)/g, `$1${NB}$2`)
const end = (s: string) => (/[.!?]$/.test(s) ? s : `${s}.`)

/* The traced logo files carry currentColor; as CSS masks they take the colour of the element. */
const RATIO = { 'dill-sprig.svg': 1908.6 / 865.77, 'dill-letters.svg': 2457.3 / 805.66, 'dill-lockup.svg': 2457.3 / 2165.2 } as const
function Mark({ file, label, className = '', style }: { file: keyof typeof RATIO; label?: string; className?: string; style?: CSSProperties }) {
  const url = `url(${brand(file)})`
  return (
    <span
      className={`dl-mark ${className}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ WebkitMaskImage: url, maskImage: url, ['--mr' as string]: RATIO[file], ...style }}
    />
  )
}

/* The reference's own thin long arrow (its clean-room rebuild), used on buttons, hero arrows and the reel discs. */
function Arrow({ dir = 'next' }: { dir?: 'next' | 'prev' }) {
  return (
    <svg className={`dl-arrow${dir === 'prev' ? ' dl-arrow--prev' : ''}`} viewBox="16 21 32 20" aria-hidden="true" focusable="false">
      <path d="M33.52 22.3C33.52 22.3 38.99 31 46 31 38.99 31 33.52 39.7 33.52 39.7" />
      <path d="M43.9 31H17" />
    </svg>
  )
}

/* ------------------------------------------------------------------ hero slideshow
   Vegas 2.5.4 as configured on the reference (TEARDOWN M11/M12): fade 1000ms, Ken Burns down 1000ms
   (scale 1.35 to 1), 5000ms autoplay, loop, the previous slide stays underneath, arrows step and restart the clock. */
function SlideLayer({ slide, first, reduced }: { slide: (typeof HERO_SLIDES)[number]; first: boolean; reduced: boolean }) {
  const ref = useRef<HTMLImageElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    let t = 0
    let dead = false
    const show = () => { if (!dead) t = window.setTimeout(() => setOn(true), reduced ? 0 : 100) }
    if (el && el.complete && el.naturalWidth) show()
    else if (el) {
      el.addEventListener('load', show, { once: true })
      el.addEventListener('error', show, { once: true })
    }
    return () => { dead = true; window.clearTimeout(t) }
  }, [reduced])
  const priority = first ? ({ fetchpriority: 'high' } as Record<string, string>) : {}
  return (
    <div className={`dl-slide${on ? ' is-in' : ''}${reduced ? '' : ' is-kb'}`}>
      <img ref={ref} className="dl-slide__img" src={img(slide.f)} width={slide.w} height={slide.h} alt="" decoding="async" {...priority} />
    </div>
  )
}

function Slideshow({ lang, reduced }: { lang: Lang; reduced: boolean }) {
  const t = T[lang]
  const n = HERO_SLIDES.length
  const [layers, setLayers] = useState<Array<{ id: number; i: number }>>([{ id: 0, i: 0 }])
  const [userPaused, setUserPaused] = useState(false)
  const [hold, setHold] = useState(false) // pointer over the pictures or focus on a control
  const cur = useRef(0)
  const uid = useRef(0)
  const timer = useRef(0)
  const go = useCallback((dir: number) => {
    cur.current = (cur.current + dir + n) % n
    uid.current += 1
    const layer = { id: uid.current, i: cur.current }
    setLayers((l) => [...l.slice(-1), layer])
  }, [n])
  useEffect(() => {
    if (reduced || userPaused || hold) return
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => go(1), 5000)
    return () => window.clearTimeout(timer.current)
  }, [layers, reduced, userPaused, hold, go])
  return (
    <>
      <div className="dl-hero__slides" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
        {layers.map((l) => <SlideLayer key={l.id} slide={HERO_SLIDES[l.i]} first={l.id === 0} reduced={reduced} />)}
      </div>
      <div className="dl-hero__controls" onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
        <div className="dl-shell">
          <div className="dl-hero__controls-inner">
            <button className="dl-hero__arrow dl-hero__arrow--next" type="button" aria-label={t.slideshow.next} onClick={() => go(1)}><Arrow /></button>
            <button className="dl-hero__arrow dl-hero__arrow--prev" type="button" aria-label={t.slideshow.prev} onClick={() => go(-1)}><Arrow dir="prev" /></button>
          </div>
        </div>
      </div>
      {!reduced && (
        <div className="dl-hero__pause-wrap">
          <div className="dl-shell">
            <button className="dl-hero__pause" type="button" aria-pressed={userPaused} aria-label={userPaused ? t.slideshow.play : t.slideshow.pause} onClick={() => setUserPaused((v) => !v)}>
              {userPaused ? <Play strokeWidth={1.25} aria-hidden="true" /> : <Pause strokeWidth={1.25} aria-hidden="true" />}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

/* ------------------------------------------------------------------ reels
   tiny-slider 2.9.2 as configured on the reference (M13): auto-width items, looped, 300ms step, no drag or swipe;
   a click anywhere on the reel, or the mobile disc, advances one item. The moved item goes to the end. */
type Pic = (typeof REEL_RETTIR)[number]

function Reel({ items, lang, variant, next, visible = false }: { items: readonly Pic[]; lang: Lang; variant: 'courses' | 'land'; next: string; visible?: boolean }) {
  const track = useRef<HTMLDivElement>(null)
  const run = useRef<{ on: boolean; timer: number }>({ on: false, timer: 0 })
  /* With visible overflow (the chef's reel on the reference) the previous item peeks in at the left edge:
     the track keeps its previous item first and rests one item-width to the left. */
  const rest = useCallback(() => {
    const t = track.current
    if (!t) return 0
    return visible && t.firstElementChild ? -(t.firstElementChild as HTMLElement).getBoundingClientRect().width : 0
  }, [visible])
  const settle = useCallback(() => {
    const t = track.current
    if (!t) return
    t.style.transition = 'none'
    t.style.transform = `translate3d(${rest()}px,0,0)`
  }, [rest])
  const finish = useCallback(() => {
    const t = track.current
    const s = run.current
    if (!t || !s.on) return
    window.clearTimeout(s.timer)
    s.on = false
    const first = t.firstElementChild
    if (first) t.appendChild(first)
    settle()
  }, [settle])
  const advance = useCallback(() => {
    const t = track.current
    if (!t) return
    finish()
    const step = (t.children[visible ? 1 : 0] as HTMLElement | undefined)?.getBoundingClientRect().width
    if (!step) return
    if (prefersReduced()) {
      const first = t.firstElementChild
      if (first) t.appendChild(first)
      settle()
      return
    }
    const s = run.current
    s.on = true
    void t.offsetWidth // commit the reset above before the animated move
    t.style.transition = 'transform 300ms cubic-bezier(.23,1,.32,1)'
    t.style.transform = `translate3d(${rest() - step}px,0,0)`
    s.timer = window.setTimeout(finish, 300)
  }, [finish, rest, settle, visible])
  useLayoutEffect(() => {
    const t = track.current
    if (!t) return
    /* once only: React's dev double-mount would otherwise rotate the track twice */
    if (visible && !t.dataset.peek && t.lastElementChild && t.firstElementChild) {
      t.insertBefore(t.lastElementChild, t.firstElementChild)
      t.dataset.peek = '1'
    }
    settle()
    const state = run.current
    const onResize = () => { if (!state.on) settle() }
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('resize', onResize); window.clearTimeout(state.timer) }
  }, [settle, visible])
  return (
    <div className={`dl-reel-frame dl-reel-frame--${variant}`} data-cursor="arrow">
      <button className="dl-disc dl-disc--corner" type="button" aria-label={next} onClick={(e) => { e.stopPropagation(); advance() }}><Arrow /></button>
      <div className={`dl-reel-viewport${visible ? ' dl-reel-viewport--visible' : ''}`}>
        <div className={`dl-reel dl-reel--${variant}`} ref={track} onClick={advance}>
          {items.map((p) => (
            <div key={p.f} className={`dl-reel__item dl-reel__item--${p.cls}`}>
              <div className="dl-reel__frame"><img src={img(p.f)} width={p.w} height={p.h} alt={p.alt[lang]} loading="lazy" decoding="async" /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* Stacked cards (M14/M15): a click moves every card one place forward, the front card goes to the back,
   the current dot advances. */
function Stack({ items, lang, next }: { items: readonly Pic[]; lang: Lang; next: string }) {
  const n = items.length
  const [cur, setCur] = useState(0)
  const advance = useCallback(() => setCur((c) => (c + 1) % n), [n])
  return (
    <div className="dl-stack" data-cursor="arrow">
      <button className="dl-disc dl-disc--middle" type="button" aria-label={next} onClick={advance}><Arrow /></button>
      <div className="dl-stack__cards" onClick={advance}>
        {items.map((p, i) => (
          <div key={p.f} className="dl-stack__card" data-pos={((i - cur + n) % n) + 1}>
            <img src={img(p.f)} width={p.w} height={p.h} alt={p.alt[lang]} loading="lazy" decoding="async" />
          </div>
        ))}
      </div>
      <div className="dl-stack__track" aria-hidden="true">
        {items.map((p, i) => <span key={p.f} className={`dl-stack__dot${i === cur ? ' is-current' : ''}`} />)}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ page */
export default function DillPage() {
  const { pathname } = useLocation()
  const lang: Lang = /\/en\/?$/.test(pathname) ? 'en' : 'is'
  const t = T[lang]
  const rootRef = useRef<HTMLDivElement>(null)
  const reduced = useMemo(() => prefersReduced(), [])
  const css = useMemo(() => dillCss(B), [])
  const home = lang === 'en' ? '/preview/dill/en' : '/preview/dill'
  const chromeCompany = useMemo(() => ({ ...company, english: lang === 'en' }), [lang])

  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    const prevBody = document.body.style.background
    document.title = t.title
    document.documentElement.lang = t.htmlLang
    document.body.style.background = BG
    setThemeColor(BG)
    const offDesc = setMetaDescription(t.description)
    return () => {
      document.title = prevTitle
      document.documentElement.lang = prevLang
      document.body.style.background = prevBody
      offDesc()
    }
  }, [t])

  useEffect(() => { window.scrollTo(0, 0) }, [lang])

  /* the motion branch: content stays visible by default (CSS); this only hides headings that are about to be typed in */
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || prefersReduced()) return
    root.classList.add('dl-motion')
    if (window.matchMedia('(hover:hover) and (pointer:fine)').matches && window.innerWidth >= 768) root.classList.add('dl-cursor-on')
    const off = initDillMotion(root)
    return () => { off(); root.classList.remove('dl-motion', 'dl-cursor-on') }
  }, [lang])

  const offers = [
    { key: 'signature' as const, meta: `${end(`${t.courses.sig}, ${lang === 'is' ? '16 til 18 réttir' : '16 to 18 courses'}`)} ${t.courses.sigNote}`, seats: t.welcome.seatSig },
    { key: 'short' as const, meta: `${end(t.courses.short)} ${t.courses.shortNote}`, seats: t.welcome.seatShort },
  ]

  return (
    <div ref={rootRef} className="dl-root" lang={t.htmlLang}>
      <style>{css}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />
      <a className="dl-sr" href="#dl-main">{lang === 'is' ? 'Fara í efni' : 'Skip to content'}</a>

      <div className="dl-site">
        <header className="dl-hero">
          <nav className="dl-topbar" aria-label={t.nav.home}>
            <div className="dl-shell dl-topbar__inner">
              <Link className="dl-topbar__brand" to={home} aria-label={t.nav.home}>
                <Mark file="dill-sprig.svg" style={{ color: 'var(--c-amber)' }} />
              </Link>
              <div className="dl-topbar__actions">
                <div className="dl-lang" role="group" aria-label={t.nav.langLabel}>
                  <Globe className="dl-lang__globe" strokeWidth={1.25} aria-hidden="true" />
                  <span className="dl-lang__list">
                    <Link className={`dl-lang__link${lang === 'is' ? ' is-current' : ''}`} to="/preview/dill" hrefLang="is" lang="is" title="Íslenska" aria-current={lang === 'is' ? 'true' : undefined}>IS</Link>
                    <Link className={`dl-lang__link${lang === 'en' ? ' is-current' : ''}`} to="/preview/dill/en" hrefLang="en" lang="en" title="English" aria-current={lang === 'en' ? 'true' : undefined}>EN</Link>
                  </span>
                </div>
                <a className="dl-button dl-topbar__cta" href={URLS.book} target="_blank" rel="noopener noreferrer">
                  <span>{t.nav.reserve}</span><Arrow />
                </a>
              </div>
            </div>
          </nav>

          <Slideshow lang={lang} reduced={reduced} />

          <div className="dl-hero__brand">
            <div className="dl-shell"><Mark file="dill-lockup.svg" label="DILL" style={{ color: '#fff' }} /></div>
          </div>
        </header>

        <div className="dl-content" id="dl-main" role="main">
          {/* S2: the Michelin star, the sentence, the founding */}
          <section className="dl-block dl-block--intro dl-glow dl-glow--wall dl-glow--right dl-glow--lift">
            <div className="dl-block__inner">
              <div className="dl-shell">
                <div className="dl-col dl-col--intro">
                  <div className="dl-awards">
                    <a className="dl-award" href={URLS.michelin} target="_blank" rel="noopener noreferrer">
                      <Star className="dl-award__star" aria-hidden="true" />
                      <span className="dl-award__label">{t.award.label}</span>
                      <span className="dl-award__line">{t.award.line}</span>
                      <span className="dl-award__caption">{t.award.caption}</span>
                    </a>
                  </div>
                  <h1 className="dl-display dl-center" data-dl-reveal>{t.intro.h1}</h1>
                  <p className="dl-copy dl-center dl-gap-1">{t.intro.lead}</p>
                </div>
                <div className="dl-col dl-col--story">
                  <div className="dl-story">
                    <div className="dl-story__media">
                      <div className="dl-story__portrait" data-dl-drift>
                        <img src={img(PORTRAIT.f)} width={PORTRAIT.w} height={PORTRAIT.h} alt={t.intro.portraitAlt} loading="lazy" decoding="async" />
                      </div>
                    </div>
                    <div className="dl-story__gap" />
                    <div className="dl-story__text">
                      <p className="dl-lead dl-lead--caps">{t.intro.storyLead}</p>
                      <p className="dl-copy dl-gap-1">{t.intro.storyP}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* S3: sixteen to eighteen courses, the two ways to dine */}
          <section className="dl-block dl-block--courses dl-glow dl-glow--green dl-glow--left dl-glow--lift">
            <div className="dl-block__inner">
              <div className="dl-bleed dl-bleed--flush">
                <div className="dl-courses">
                  <p className="dl-figure" data-dl-slide aria-label={t.courses.a11y}>
                    <span className="dl-figure__num" aria-hidden="true">{t.courses.num}</span>
                    <span className="dl-figure__label" data-dl-reveal aria-hidden="true">{t.courses.label}</span>
                  </p>
                  <Reel items={REEL_RETTIR} lang={lang} variant="courses" next={t.courses.next} />
                </div>
              </div>
              <div className="dl-shell">
                <div className="dl-col dl-col--menu">
                  <div className="dl-menu-note">
                    <p className="dl-copy">{t.courses.p1}</p>
                    <p className="dl-copy dl-gap-1">{t.courses.p2}</p>
                    <p className="dl-copy dl-gap-1">{t.courses.p3}</p>
                    <p className="dl-copy dl-gap-1">{t.courses.allergy}</p>
                    <p className="dl-copy dl-gap-1">{t.courses.allergy48}</p>
                    <p className="dl-action dl-gap-1">
                      <a className="dl-button" href={URLS.book} target="_blank" rel="noopener noreferrer"><span>{t.courses.book}</span><Arrow /></a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* S4: three and a half hours, the room */}
          <section className="dl-block dl-block--tables">
            <div className="dl-block__inner">
              <div className="dl-bleed">
                <p className="dl-figure dl-figure--floating" data-dl-slide aria-label={t.tables.a11y}>
                  <span className="dl-figure__num" aria-hidden="true">{t.tables.num}</span>
                  <span className="dl-figure__label" data-dl-reveal aria-hidden="true">{t.tables.label}</span>
                </p>
                <Stack items={STACK_SALUR} lang={lang} next={t.tables.next} />
              </div>
            </div>
          </section>

          {/* S5: the room, and where the ingredients come from */}
          <section className="dl-block dl-block--concept dl-glow dl-glow--wall dl-glow--right dl-glow--up dl-glow--lift">
            <div className="dl-block__inner">
              <div className="dl-shell">
                <div className="dl-col dl-col--concept">
                  <h2 className="dl-lead">{t.concept.lead}<br /><strong className="dl-lead--caps">{t.concept.strong}</strong></h2>
                  <p className="dl-copy dl-gap-1">{t.concept.p}</p>
                  <p className="dl-copy dl-gap-1">{nb(t.concept.seats)}</p>
                  <div className="dl-line-gap" />
                </div>
              </div>
              <div className="dl-split">
                <div className="dl-split__image" data-dl-drift role="img" aria-label={t.concept.splitAlt}>
                  <img src={img(SPLIT_IMG.f)} width={1500} height={1124} alt="" loading="lazy" decoding="async" />
                </div>
                <div className="dl-split__body">
                  <div className="dl-split__text">
                    <p className="dl-lead">{t.concept.splitLead}</p>
                    <p className="dl-copy dl-gap-1">{t.concept.splitP1}</p>
                    <p className="dl-copy dl-gap-1">{t.concept.splitP2}</p>
                    <div className="dl-line-gap dl-line-gap--2" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* S6: land and sea */}
          <section className="dl-block dl-block--land dl-glow dl-glow--green dl-glow--left dl-glow--up">
            <div className="dl-block__inner">
              <div className="dl-shell">
                <div className="dl-col dl-col--land">
                  <h2 className="dl-display dl-center" data-dl-reveal>{t.land.h1}</h2>
                  <p className="dl-lead dl-center dl-gap-1">{t.land.lead}</p>
                  <p className="dl-copy dl-center dl-gap-1">{t.land.p}</p>
                </div>
                <div className="dl-reel-bleed">
                  <Reel items={REEL_LAND} lang={lang} variant="land" next={t.land.next} visible />
                </div>
              </div>
            </div>
          </section>

          {/* S7: welcome */}
          <div className="dl-block dl-block--welcome dl-glow dl-glow--green dl-glow--right dl-glow--down">
            <section className="dl-block__inner">
              <div className="dl-shell">
                <div className="dl-welcome">
                  <div className="dl-welcome__signet-wrap">
                    <span className="dl-welcome__disc"><Mark file="dill-sprig.svg" /></span>
                  </div>
                  <h2 className="dl-display" data-dl-reveal>{t.welcome.h1}</h2>
                  <address className="dl-gap-1">
                    <p className="dl-copy">{t.welcome.addr1}</p>
                    <p className="dl-copy">{t.welcome.addr2}</p>
                    <p className="dl-copy">{t.welcome.addr3}</p>
                  </address>
                  <p className="dl-copy dl-copy--small dl-gap-2">{t.courses.priceHead}</p>
                  <div className="dl-offers">
                    {offers.map(({ key, meta, seats }) => (
                      <div className="dl-offers__row" key={key}>
                        <p className="dl-offers__name">{OFFER[key].name}</p>
                        <p className="dl-offers__price">{fmt(OFFER[key].price, lang)}</p>
                        <p className="dl-offers__meta">{nb(meta)}</p>
                        <p className="dl-offers__meta">{nb(seats)}</p>
                        <dl className="dl-offers__pairs">
                          {OFFER[key].pairings.map((p) => (
                            <Fragment key={p.en}>
                              <dt>{p[lang]}</dt>
                              <dd>+ {fmt(p.price, lang)}</dd>
                            </Fragment>
                          ))}
                        </dl>
                      </div>
                    ))}
                  </div>
                  <p className="dl-copy dl-fine dl-gap-2">{t.welcome.waitlist}</p>
                  <p className="dl-copy dl-fine dl-gap-1">{t.welcome.kids}</p>
                  <p className="dl-action dl-action--center dl-gap-2">
                    <a className="dl-button" href={URLS.book} target="_blank" rel="noopener noreferrer"><span>{t.welcome.book}</span><Arrow /></a>
                    <a className="dl-button" href={URLS.vouchers} target="_blank" rel="noopener noreferrer"><span>{t.welcome.vouchers}</span><Arrow /></a>
                  </p>
                  <p className="dl-copy dl-copy--small dl-gap-1">{nb(t.welcome.vouchersNote)}</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <footer className="dl-footer">
          <div className="dl-shell">
            <div className="dl-footer__row">
              <div className="dl-footer__col">
                <Mark file="dill-letters.svg" label="DILL" className="dl-footer__logo" style={{ color: '#fff' }} />
                <p className="dl-copy dl-copy--small dl-gap-1">{t.footer.copy}</p>
              </div>
              <div className="dl-footer__col dl-footer__col--center">
                <p className="dl-copy"><a className="dl-footer__mail" href={`mailto:${URLS.email}`}>{URLS.email}</a></p>
                <p className="dl-copy"><a className="dl-footer__link" href={`tel:${URLS.phone}`}>552 1522</a></p>
                <p className="dl-copy dl-gap-1">{t.footer.address1}</p>
                <p className="dl-copy">{t.footer.address2}</p>
                <div className="dl-line-gap" />
              </div>
              <div className="dl-footer__col dl-footer__col--end">
                <p className="dl-copy"><a className="dl-footer__link" href={`mailto:${URLS.email}?subject=${encodeURIComponent(t.footer.press)}`}>{t.footer.press}</a></p>
                <p className="dl-copy"><a className="dl-footer__link" href={`mailto:${URLS.jobs}`}>{t.footer.jobs}</a></p>
                <p className="dl-copy"><a className="dl-footer__link" href={URLS.instagram} target="_blank" rel="noopener noreferrer">{t.footer.ig}</a></p>
                <p className="dl-copy"><a className="dl-footer__link" href={URLS.facebook} target="_blank" rel="noopener noreferrer">{t.footer.fb}</a></p>
              </div>
            </div>
          </div>
        </footer>
        <div className="dl-site__end" />
      </div>

      <div className="dl-cursor" aria-hidden="true">
        <div className="dl-cursor__ring">
          <svg className="dl-cursor__ring-dot" width="30" height="30"><circle cx="15" cy="15" r="12" /></svg>
          <svg className="dl-cursor__arrow" width="60" height="60" viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="30" r="30" fill="#D19A55" />
            <path d="M33.5203 22.2998C33.5203 22.2998 38.9936 30.9998 46 30.9998C38.9936 30.9998 33.5203 39.6998 33.5203 39.6998" stroke="#141c12" strokeMiterlimit="10" />
            <path d="M43.9081 31.0112H17" stroke="#141c12" strokeMiterlimit="10" />
          </svg>
        </div>
        <div className="dl-cursor__dot"><svg width="10" height="10"><circle cx="5" cy="5" r="4" /></svg></div>
      </div>

      <PreviewFooter company={chromeCompany} verifiedContent />
    </div>
  )
}
