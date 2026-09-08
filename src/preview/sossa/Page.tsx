/**
 * Sossa Björnsdóttir — the juliencalot.com system, second transplant.
 *
 * Branched from the Áslaug Saja build, which carried the same reference's seven
 * devices with a measured gate table. What is DIFFERENT here, and why:
 *
 *  - HER WORKS HAVE NO TITLES, YEARS, PRICES, SIZES OR TECHNIQUES. Her own site
 *    publishes none. The Áslaug Saja build could sort by colour because Apolloart
 *    had already tagged her catalogue; nothing equivalent exists here, so the
 *    browse axis is her OWN EXHIBITIONS, which is the one true axis her material
 *    actually carries. Inventing a title for a painting is inventing a fact about
 *    a client's work, and it does not happen here.
 *  - THE PAINTING IS CONTAINED, NOT CROPPED. The reference's full-bleed hero needs
 *    source images at least a viewport wide; of 366 images harvested from her site
 *    exactly one clears that. So a slide presents the whole painting on the ground,
 *    hung, at its true aspect — the same decision the Áslaug Saja grid made for its
 *    cells, extended to the hero because her figures cannot survive a crop. The one
 *    image that does have the pixels (danmork-01, 3737px) gets the true full bleed.
 *  - THE CV IS A VIEW. Forty years, Beijing, Florence, Boston, Copenhagen. It is the
 *    strongest asset she owns and her current site buries it on a text page.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import Lenis from 'lenis'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { getPreviewCompany } from '../companies'
import { HomeSlider } from './HomeSlider'
import type { Slide } from './HomeSlider'
import { SeriesWorks } from './SeriesWorks'
import {
  GRID_REVEAL,
  LENIS,
  REVEAL_END,
  REVEAL_MIDDLE,
  REVEAL_START,
  gridDelay,
  isMobile,
  isTouchDevice,
  reduceMotion,
  splitLineReveal,
} from './motion'
import { ABOUT, CONTACT, CV, EDUCATION, STUDIOS, t } from './strings'
import type { Lang } from './strings'
import { ALL_WORKS, HERO_POS, LEAD, SERIES } from './works'
import type { Work } from './works'

gsap.registerPlugin(ScrollToPlugin)

const BASE = import.meta.env.BASE_URL
const GRID = (id: string) => `${BASE}sossa/grid/${id}.jpg`
const FULL = (id: string) => `${BASE}sossa/work/${id}.jpg`
const HERO = (id: string) => `${BASE}sossa/hero/${id}.jpg`

type View =
  | { k: 'home' }
  | { k: 'series'; id: string }
  | { k: 'all' }
  | { k: 'work'; id: string }
  | { k: 'about' }
  | { k: 'cv' }
  | { k: 'contact' }

function sameView(a: View, b: View) {
  return a.k === b.k && (a as { id?: string }).id === (b as { id?: string }).id
}

const pad2 = (n: number) => String(n).padStart(2, '0')

/** the 9px label, the reference's signature restraint (11px on phones — 8px is
 *  under this project's legibility floor, the same deviation the saja build declared) */
const LBL =
  'font-sans text-[11px] md:text-[9px] font-extrabold uppercase tracking-[0.14em] leading-none'

function Rule({ className = '' }: { className?: string }) {
  return <span aria-hidden className={`inline-block h-px w-7 bg-current align-middle ${className}`} />
}

const seriesById = (id: string) => SERIES.find((s) => s.id === id)
const workById = (id: string) => ALL_WORKS.find((w) => w.id === id)

/* ------------------------------------------------------------------ *
 * DEVICE 3 — the mid-height metadata band. The single best device on the
 * reference: a thin row at ~50% viewport height, tiny labels laid across the
 * painting, nothing else on the screen. Year at far left, exhibition name in
 * the display face, count at far right.
 * ------------------------------------------------------------------ */
function MetaBand({
  years,
  name,
  count,
  label,
  ink,
  aspect,
  contain,
}: {
  years: string
  name: string
  count: number
  label: string
  ink: 'light' | 'dark'
  aspect: number
  contain: boolean
}) {
  const inner = (
    <div className="flex w-full items-baseline">
      <span className={`${LBL} mr-4 shrink-0 whitespace-nowrap tabular-nums md:mr-0 md:w-[16%]`}>
        {years}
      </span>
      <span className="sossa-display text-[23px] leading-none tracking-[0.46px] md:text-[23px]">
        {name}
      </span>
      <span className={`${LBL} ml-auto tabular-nums`}>
        {pad2(count)} <Rule className="mx-1 opacity-60" /> {label}
      </span>
    </div>
  )
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-20 flex items-center justify-center ${
        contain ? 'p-6 md:p-16' : ''
      } ${ink === 'light' ? 'text-white' : 'text-black'}`}
    >
      {contain ? (
        /* the same box the contained <img> resolves to, reproduced in CSS */
        <div
          className="relative flex h-full w-full items-center"
          style={{ aspectRatio: String(aspect), maxWidth: '100%', maxHeight: '100%' }}
        >
          {inner}
        </div>
      ) : (
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10">{inner}</div>
      )}
    </div>
  )
}

/** build a paused reveal timeline and play it on the loader's first beat */
function useRevealOnLoader(build: () => gsap.core.Timeline | null, deps: unknown[]) {
  useEffect(() => {
    const tl = build()
    if (!tl) return
    const play = () => tl.play(0)
    window.addEventListener(REVEAL_START, play)
    return () => {
      window.removeEventListener(REVEAL_START, play)
      tl.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

function useViewRouter(initial: View) {
  const [view, setView] = useState<View>(initial)
  const busy = useRef(false)

  const fire = useCallback(() => {
    const reduced = reduceMotion()
    window.dispatchEvent(new CustomEvent(REVEAL_START))
    window.setTimeout(() => window.dispatchEvent(new CustomEvent(REVEAL_MIDDLE)), reduced ? 60 : 300)
    window.setTimeout(() => window.dispatchEvent(new CustomEvent(REVEAL_END)), reduced ? 120 : 700)
  }, [])

  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(fire))
    return () => cancelAnimationFrame(id)
  }, [fire])

  const go = useCallback(
    (next: View) => {
      if (busy.current || sameView(next, view)) return
      busy.current = true
      setView(next)
      window.scrollTo(0, 0)
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          fire()
          busy.current = false
        }),
      )
    },
    [fire, view],
  )

  return { view, go }
}

/* ------------------------------------------------------------------ *
 * DEVICE 5 — the sparse index grid. 5 columns of 173px with ~134px gutters,
 * the gutter at 77% of the column width. Enormous air. It lives inside the
 * menu overlay, exactly as on the reference.
 *
 * Cells are square with `object-contain` on a common baseline: her works run
 * 75 landscape / 25 portrait / 2 square, so a fixed portrait cell would leave
 * 40% dead air and a cover crop would cut the figures. They hang instead.
 * ------------------------------------------------------------------ */
function IndexGrid({
  works,
  lang,
  onOpen,
  showSeries = false,
  revealNow = false,
}: {
  works: Work[]
  lang: Lang
  onOpen: (id: string) => void
  showSeries?: boolean
  /** the menu overlay mounts outside the view router, so no loader beat ever
   *  reaches it — without this its images stay parked at yPercent 200 and the
   *  grid renders as bare labels over empty space. */
  revealNow?: boolean
}) {
  const ref = useRef<HTMLUListElement>(null)

  useRevealOnLoader(() => {
    const el = ref.current
    if (!el || reduceMotion()) return null
    const imgs = [...el.querySelectorAll<HTMLElement>('img')]
    const tl = gsap.timeline({ paused: true })
    imgs.forEach((img, i) => {
      tl.from(
        img,
        {
          yPercent: GRID_REVEAL.yPercent,
          duration: GRID_REVEAL.duration,
          ease: GRID_REVEAL.ease,
          clearProps: 'transform',
        },
        gridDelay(i, isMobile()),
      )
    })
    if (revealNow) tl.play()
    return tl
  }, [works, revealNow])

  return (
    <ul
      ref={ref}
      className="sossa-grid mx-auto grid list-none grid-cols-2 justify-center gap-x-[26px] gap-y-[44px] px-6
                 sm:grid-cols-3 sm:gap-x-[56px] sm:gap-y-[76px]
                 lg:[grid-template-columns:repeat(4,150px)] lg:gap-x-[100px] lg:gap-y-[104px]
                 [@media(min-width:1440px)]:[grid-template-columns:repeat(5,173px)]
                 [@media(min-width:1440px)]:gap-x-[134px] [@media(min-width:1440px)]:gap-y-[134px]"
    >
      {works.map((w, i) => {
        const s = seriesById(w.series)
        const sName = s ? (lang === 'is' ? s.name : s.nameEn) : ''
        return (
          <li key={w.id}>
            <button
              type="button"
              onClick={() => onOpen(w.id)}
              className="sossa-cell group block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
            >
              <span className="block aspect-square w-full overflow-hidden">
                <img
                  src={GRID(w.id)}
                  alt={`${sName} ${pad2(w.n)}`}
                  loading={i < 10 ? 'eager' : 'lazy'}
                  decoding="async"
                  width={w.w}
                  height={w.h}
                  className="sossa-thumb block h-full w-full object-contain object-bottom will-change-transform"
                />
              </span>
              <span className={`${LBL} mt-3 flex items-baseline gap-2 text-black`}>
                <span className="tabular-nums opacity-40">{pad2(i + 1)}</span>
                {showSeries && <span className="truncate">{sName}</span>}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default function SossaPage() {
  const company = getPreviewCompany('sossa')
  const [lang, setLang] = useState<Lang>('is')
  const [menu, setMenu] = useState(false)
  const [safnOpen, setSafnOpen] = useState(false)
  const [safn, setSafn] = useState<string[]>([])
  const { view, go } = useViewRouter({ k: 'home' })
  const tr = useCallback((k: Parameters<typeof t>[0]) => t(k, lang), [lang])
  const L = lang === 'is'

  useEffect(() => {
    document.title = 'Sossa Björnsdóttir'
  }, [])

  /* Lenis with the reference's params, paused on the slider view exactly as
     their lenisShouldPause does. Never on touch: iOS momentum is smoother than
     any JS lerp and running both makes them fight for the same scroll position
     every frame, which is what the judder on a phone actually is. */
  const lenisRef = useRef<Lenis | null>(null)
  useEffect(() => {
    if (reduceMotion() || isTouchDevice()) return
    const lenis = new Lenis({
      lerp: LENIS.lerp,
      wheelMultiplier: LENIS.wheelMultiplier,
      touchMultiplier: LENIS.touchMultiplier,
      smoothWheel: true,
    })
    lenisRef.current = lenis
    let id = 0
    const raf = (time: number) => {
      lenis.raf(time)
      id = requestAnimationFrame(raf)
    }
    id = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(id)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    const lenis = lenisRef.current
    if (!lenis) return
    if (view.k === 'home' || menu || safnOpen) lenis.stop()
    else lenis.start()
  }, [view, menu, safnOpen])

  useEffect(() => {
    const locked = menu || safnOpen || view.k === 'home'
    document.body.style.overflow = locked ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menu, safnOpen, view])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setMenu(false)
      setSafnOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const nav = useCallback(
    (v: View) => {
      setMenu(false)
      setSafnOpen(false)
      go(v)
    },
    [go],
  )
  const openWork = useCallback((id: string) => nav({ k: 'work', id }), [nav])
  const toggleSafn = useCallback((id: string) => {
    setSafn((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }, [])

  const sName = useCallback(
    (s: { name: string; nameEn: string }) => (L ? s.name : s.nameEn),
    [L],
  )

  /* the slider slides: one per exhibition, plus two hover variants from inside it */
  const slides = useMemo<Slide[]>(
    () =>
      SERIES.map((s) => {
        const lead = s.works.find((w) => w.id === LEAD[s.id]) ?? s.works[0]
        const variants = s.works
          .filter((w) => w.id !== lead.id)
          .sort((a, b) => b.w * b.h - a.w * a.h)
          .slice(0, 2)
          .map((w) => FULL(w.id))
        return {
          id: s.id,
          hero: HERO(lead.id),
          variants,
          pos: HERO_POS[s.id] ?? '50% 50%',
          band: 'light',
          label: sName(s),
          contain: false,
          node: (
            <MetaBand
              years={s.years}
              name={sName(s)}
              count={s.works.length}
              label={tr('pieces')}
              ink="light"
              aspect={lead.w / lead.h}
              contain={false}
            />
          ),
        }
      }),
    [sName, tr],
  )

  /* ---- per-view reveal refs ---- */
  const workImgRef = useRef<HTMLDivElement>(null)
  const workTextRef = useRef<HTMLElement>(null)
  const proseRef = useRef<HTMLDivElement>(null)
  const seriesHeroImgRef = useRef<HTMLImageElement>(null)

  useRevealOnLoader(() => {
    if (view.k !== 'work' || reduceMotion()) return null
    const tl = gsap.timeline({ paused: true })
    const imgs = workImgRef.current?.querySelectorAll('img')
    if (imgs?.length)
      tl.from(
        imgs,
        { yPercent: 50, duration: 1, stagger: 0.05, ease: 'quart.out', clearProps: 'transform' },
        0,
      )
    const texts = workTextRef.current
      ? [...workTextRef.current.querySelectorAll<HTMLElement>('[data-reveal-text]')]
      : []
    const sub = splitLineReveal(texts, 0.1)
    if (sub) tl.add(sub.play(), 0)
    return tl
  }, [view])

  useRevealOnLoader(() => {
    if (view.k !== 'about' && view.k !== 'contact' && view.k !== 'cv') return null
    const root = proseRef.current
    if (!root || reduceMotion()) return null
    const texts = [...root.querySelectorAll<HTMLElement>('[data-reveal-text]')]
    const tl = gsap.timeline({ paused: true })
    texts.forEach((el, i) => {
      const sub = splitLineReveal([el], 0.1 * i)
      if (sub) tl.add(sub.play(), 0)
    })
    const img = root.querySelector('[data-reveal-image]')
    if (img)
      tl.fromTo(
        img,
        { yPercent: 100, clipPath: 'inset(0 0 100% 0)' },
        {
          yPercent: 0,
          clipPath: 'inset(0 0 0% 0)',
          duration: 0.75,
          ease: 'power3.out',
          clearProps: 'all',
        },
        0,
      )
    return tl
  }, [view])

  useRevealOnLoader(() => {
    if (view.k !== 'series') return null
    const img = seriesHeroImgRef.current
    if (!img || reduceMotion()) return null
    return gsap
      .timeline({ paused: true })
      .fromTo(img, { scale: 1.06 }, { scale: 1, duration: 1.75, ease: 'expo.out', clearProps: 'transform' })
  }, [view])

  const navItem = `${LBL} transition-opacity duration-200 hover:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current`

  /* Nav ink. The reference keeps white over its full-bleed photographs; here all
     but one slide hangs the painting on the #FAFAFA ground, so white would be
     invisible. Ink follows the slide actually under the nav. */
  /* Every slide is a full-bleed painting now, so the nav carries the reference's
     white ink over the photograph, with its top veil underneath. The metadata band
     is plain white too: no wash, no shadow. Sindri's call, twice. */
  const sliderBleeds = view.k === 'home'

  const currentSeries = view.k === 'series' ? seriesById(view.id) : null
  const currentWork = view.k === 'work' ? workById(view.id) : null
  const currentWorkSeries = currentWork ? seriesById(currentWork.series) : null

  return (
    <div lang={L ? 'is' : 'en'} className="min-h-screen bg-[#FAFAFA] text-black antialiased">
      <style>{`
        .sossa-display{font-family:'Clash Display',sans-serif;font-weight:600}
        /* The reference keeps a white nav over its photographs. Sampling the strip
           under the nav and re-inking per scroll step flickers up to seven times
           inside one panel (measured on the Áslaug Saja build), so the answer is a
           fixed white nav plus this veil — one gradient, no flicker. */
        .sossa-topveil{background:linear-gradient(to bottom,rgba(0,0,0,.46),rgba(0,0,0,.20) 38%,rgba(0,0,0,0) 100%);pointer-events:none;z-index:10}
        .sossa-thumb{transition:opacity .5s ease}
        .sossa-cell:hover .sossa-thumb{opacity:.55}
        @media (prefers-reduced-motion: reduce){
          .sossa-thumb{transition:none}
        }
      `}</style>

      <PreviewChrome company={company} />

      {/* ---- DEVICE 4 — tri-cluster fixed nav, 58px, fully transparent, no scrim ---- */}
      <header
        className={`fixed inset-x-0 top-0 z-40 h-[58px] transition-colors duration-300 ${
          sliderBleeds ? 'text-white' : 'text-black'
        }`}
      >
        <div className="mx-auto flex h-full max-w-[1440px] items-center gap-6 px-6 md:px-10">
          <button
            type="button"
            onClick={() => nav({ k: 'home' })}
            className="sossa-display text-[19px] leading-none tracking-[0.46px] md:text-[23px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
          >
            SOSSA
          </button>

          <nav className="ml-auto hidden items-center gap-5 md:flex">
            <button type="button" className={navItem} onClick={() => setMenu(true)}>
              {tr('menu')}
            </button>
            <button type="button" className={navItem} onClick={() => nav({ k: 'all' })}>
              {tr('all')}
            </button>
            <button type="button" className={navItem} onClick={() => nav({ k: 'cv' })}>
              {tr('cv')}
            </button>
            <button type="button" className={navItem} onClick={() => nav({ k: 'about' })}>
              {tr('about')}
            </button>
            <button type="button" className={navItem} onClick={() => nav({ k: 'contact' })}>
              {tr('contact')}
            </button>
          </nav>

          <div className="ml-auto flex items-center gap-4 md:ml-0">
            <button
              type="button"
              className={navItem}
              onClick={() => setSafnOpen(true)}
              aria-label={`${tr('collection')} (${safn.length})`}
            >
              {tr('collection')} ({pad2(safn.length)})
            </button>
            <button
              type="button"
              className={navItem}
              onClick={() => setLang(L ? 'en' : 'is')}
              aria-label={L ? 'Switch to English' : 'Skipta yfir á íslensku'}
            >
              {L ? 'EN' : 'IS'}
            </button>
            <button type="button" className={`${navItem} md:hidden`} onClick={() => setMenu(true)}>
              {tr('menu')}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ---- HOME — the wheel-physics snap slider, one slide per exhibition ---- */}
        {view.k === 'home' && (
          <HomeSlider slides={slides} onOpen={(id) => nav({ k: 'series', id })} />
        )}

        {/* ---- SERIES — hero, then the list/grid works view with the odometer ---- */}
        {view.k === 'series' && currentSeries && (
          <div className="pt-[58px]">
            <div
              data-hero-panel=""
              className="relative h-[62svh] overflow-hidden bg-black md:h-[74svh]"
            >
              <img
                ref={seriesHeroImgRef}
                style={{ objectPosition: HERO_POS[currentSeries.id] ?? '50% 50%' }}
                src={HERO(LEAD[currentSeries.id] ?? currentSeries.works[0].id)}
                alt={`${sName(currentSeries)} — ${
                  currentSeries.works.find((w) => w.id === LEAD[currentSeries.id])?.n ?? 1
                }`}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mx-auto max-w-[1440px] px-6 pb-6 pt-8 md:px-10">
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                <span className={`${LBL} w-[120px] shrink-0 tabular-nums opacity-40`}>
                  {currentSeries.years}
                </span>
                <h1 className="sossa-display text-[34px] leading-[0.95] tracking-[0.46px] md:text-[56px]">
                  {sName(currentSeries)}
                </h1>
                <span className={`${LBL} ml-auto tabular-nums`}>
                  {pad2(currentSeries.works.length)} <Rule className="mx-1 opacity-60" />{' '}
                  {tr('pieces')}
                </span>
              </div>
              <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.5] text-black/70">
                {L ? currentSeries.blurb : currentSeries.blurbEn}
              </p>
            </div>

            <SeriesWorks
              works={currentSeries.works}
              grid={GRID}
              full={FULL}
              onOpen={openWork}
              lbl={LBL}
              listLabel={tr('list')}
              gridLabel={tr('grid')}
              nameFor={(w) => `${sName(currentSeries)} ${pad2(w.n)}`}
              initialLayout={currentSeries.works.length > 20 ? 'grid' : 'list'}
            />
          </div>
        )}

        {/* ---- ALL WORK — the index grid on its own page ---- */}
        {view.k === 'all' && (
          <div className="pt-[110px]">
            <div className="mx-auto max-w-[1440px] px-6 pb-12 md:px-10">
              <h1 className="sossa-display text-[34px] leading-[0.95] tracking-[0.46px] md:text-[56px]">
                {tr('all')}
              </h1>
              <p className={`${LBL} mt-4 opacity-40`}>
                {pad2(ALL_WORKS.length)} <Rule className="mx-1" /> {tr('pieces')}
              </p>
              <p className="mt-6 max-w-[56ch] text-[13px] leading-[1.5] text-black/50">
                {t('untitledNote', lang)}
              </p>
            </div>
            <IndexGrid works={ALL_WORKS} lang={lang} onOpen={openWork} showSeries />
            <div className="h-24" />
          </div>
        )}

        {/* ---- WORK — one painting, large, with its provenance ---- */}
        {view.k === 'work' && currentWork && currentWorkSeries && (
          <div className="pt-[110px]">
            <div className="mx-auto max-w-[1440px] px-6 md:px-10">
              <div ref={workImgRef} className="flex justify-center">
                <img
                  src={FULL(currentWork.id)}
                  alt={`${sName(currentWorkSeries)} ${pad2(currentWork.n)}`}
                  width={currentWork.w}
                  height={currentWork.h}
                  className="max-h-[74svh] w-auto max-w-full object-contain"
                />
              </div>

              <section ref={workTextRef} className="mx-auto mt-10 max-w-[1440px]">
                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
                  <h1
                    data-reveal-text=""
                    className="sossa-display text-[28px] leading-none tracking-[0.46px] md:text-[40px]"
                  >
                    {sName(currentWorkSeries)} {pad2(currentWork.n)}
                  </h1>
                  <span className={`${LBL} tabular-nums opacity-40`}>
                    {currentWorkSeries.years}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleSafn(currentWork.id)}
                    className={`${LBL} ml-auto border border-current px-4 py-3 transition-colors hover:bg-black hover:text-[#FAFAFA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black`}
                  >
                    {safn.includes(currentWork.id) ? tr('inCollection') : tr('enquire')}
                  </button>
                </div>
                <p data-reveal-text="" className="mt-6 max-w-[52ch] text-[13px] leading-[1.5] text-black/50">
                  {t('untitledNote', lang)}
                </p>
              </section>

              <div className="mt-16">
                <p className={`${LBL} mb-6 opacity-40`}>{sName(currentWorkSeries)}</p>
                <IndexGrid
                  works={currentWorkSeries.works.filter((w) => w.id !== currentWork.id).slice(0, 10)}
                  lang={lang}
                  onOpen={openWork}
                  revealNow
                />
              </div>
              <div className="h-24" />
            </div>
          </div>
        )}

        {/* ---- ABOUT · CV · CONTACT ---- */}
        {(view.k === 'about' || view.k === 'cv' || view.k === 'contact') && (
          <div ref={proseRef} className="pt-[110px]">
            <div className="mx-auto max-w-[1440px] px-6 md:px-10">
              <h1
                data-reveal-text=""
                className="sossa-display text-[34px] leading-[0.95] tracking-[0.46px] md:text-[56px]"
              >
                {view.k === 'about' ? tr('about') : view.k === 'cv' ? tr('cv') : tr('contact')}
              </h1>

              {view.k === 'about' && (
                <div className="mt-10 grid gap-12 md:grid-cols-[minmax(0,1fr)_360px]">
                  <div className="max-w-[56ch] space-y-6">
                    {ABOUT[lang].map((p, i) => (
                      <p key={i} data-reveal-text="" className="text-[17px] leading-[1.5]">
                        {p}
                      </p>
                    ))}
                  </div>
                  <figure className="self-start">
                    <div className="overflow-hidden">
                      <img
                        data-reveal-image=""
                        src={HERO('portrait')}
                        alt={L ? 'Sossa á vinnustofunni' : 'Sossa in the studio'}
                        loading="lazy"
                        className="block w-full"
                      />
                    </div>
                    <figcaption className={`${LBL} mt-3 opacity-40`}>
                      {L ? 'VINNUSTOFAN' : 'THE STUDIO'}
                    </figcaption>
                  </figure>
                </div>
              )}

              {view.k === 'cv' && (
                <div className="mt-10 max-w-[72ch]">
                  <p className={`${LBL} mb-6 opacity-40`}>{L ? 'SÝNINGAR (ÚRVAL)' : 'EXHIBITIONS (SELECTED)'}</p>
                  <ul className="mb-14 list-none">
                    {CV.map((r, i) => (
                      <li
                        key={i}
                        data-reveal-text=""
                        className="flex items-baseline gap-6 border-t border-black/12 py-4"
                      >
                        <span
                          className={`${LBL} w-[120px] shrink-0 whitespace-nowrap tabular-nums opacity-40`}
                        >
                          {r.year}
                        </span>
                        <span className="text-[17px] leading-[1.35]">{r.venue[L ? 0 : 1]}</span>
                      </li>
                    ))}
                  </ul>

                  <p className={`${LBL} mb-6 opacity-40`}>{L ? 'MENNTUN' : 'EDUCATION'}</p>
                  <ul className="list-none">
                    {EDUCATION.map((r, i) => (
                      <li
                        key={i}
                        data-reveal-text=""
                        className="flex items-baseline gap-6 border-t border-black/12 py-4"
                      >
                        <span
                          className={`${LBL} w-[120px] shrink-0 whitespace-nowrap tabular-nums opacity-40`}
                        >
                          {r.year}
                        </span>
                        <span className="text-[17px] leading-[1.35]">{r.school[L ? 0 : 1]}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {view.k === 'contact' && (
                <div className="mt-10 grid gap-12 md:grid-cols-[minmax(0,1fr)_360px]">
                  <div className="max-w-[52ch] space-y-8">
                    <p data-reveal-text="" className="text-[17px] leading-[1.5]">
                      {t('enquiryIntro', lang)}
                    </p>
                    <div className="space-y-6">
                      {STUDIOS.map((s) => (
                        <div key={s.addr} data-reveal-text="">
                          <p className={`${LBL} opacity-40`}>{s.place[L ? 0 : 1]}</p>
                          <p className="mt-2 text-[17px] leading-[1.35]">{s.addr}</p>
                        </div>
                      ))}
                      <div data-reveal-text="">
                        <p className={`${LBL} opacity-40`}>{L ? 'NETFANG' : 'EMAIL'}</p>
                        <a
                          href={`mailto:${CONTACT.email}`}
                          className="mt-2 inline-block text-[17px] leading-[1.35] underline underline-offset-4"
                        >
                          {CONTACT.email}
                        </a>
                      </div>
                      <div data-reveal-text="">
                        <p className={`${LBL} opacity-40`}>{L ? 'SÍMI' : 'PHONE'}</p>
                        <a
                          href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}
                          className="mt-2 inline-block text-[17px] leading-[1.35] underline underline-offset-4"
                        >
                          {CONTACT.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                  <figure className="self-start">
                    <div className="overflow-hidden">
                      <img
                        data-reveal-image=""
                        src={HERO('place')}
                        alt={L ? 'Vinnustofan í Turup' : 'The studio in Turup'}
                        loading="lazy"
                        className="block w-full"
                      />
                    </div>
                    <figcaption className={`${LBL} mt-3 opacity-40`}>TURUP</figcaption>
                  </figure>
                </div>
              )}
              <div className="h-24" />
            </div>
          </div>
        )}
      </main>

      {/* ---- the menu overlay: browse axes + the sparse grid, the reference's own home for it ---- */}
      {menu && (
        <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-[#FAFAFA]">
          <div className="mx-auto max-w-[1440px] px-6 pb-24 pt-8 md:px-10">
            <div className="flex items-center">
              <span className="sossa-display text-[23px] leading-none tracking-[0.46px]">SOSSA</span>
              <button type="button" className={`${navItem} ml-auto`} onClick={() => setMenu(false)}>
                {tr('close')}
              </button>
            </div>

            <p className={`${LBL} mt-14 opacity-40`}>{tr('bySeries')}</p>
            <ul className="mt-6 list-none">
              {SERIES.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => nav({ k: 'series', id: s.id })}
                    className="group flex w-full items-baseline gap-4 border-t border-black/12 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                  >
                    <span
                      className={`${LBL} w-[120px] shrink-0 whitespace-nowrap tabular-nums opacity-40`}
                    >
                      {s.years}
                    </span>
                    <span className="sossa-display text-[23px] leading-none tracking-[0.46px] transition-opacity group-hover:opacity-40">
                      {sName(s)}
                    </span>
                    <span className={`${LBL} ml-auto shrink-0 tabular-nums opacity-40`}>
                      {pad2(s.works.length)} <Rule className="mx-1" /> {tr('pieces')}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-20">
              <IndexGrid works={ALL_WORKS} lang={lang} onOpen={openWork} revealNow />
            </div>
          </div>
        </div>
      )}

      {/* ---- SAFN — the enquiry selection. Not a cart: she sells through the studio ---- */}
      {safnOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-[#FAFAFA]">
          <div className="mx-auto max-w-[1440px] px-6 pb-24 pt-8 md:px-10">
            <div className="flex items-center">
              <span className="sossa-display text-[23px] leading-none tracking-[0.46px]">
                {tr('collection')} ({pad2(safn.length)})
              </span>
              <button
                type="button"
                className={`${navItem} ml-auto`}
                onClick={() => setSafnOpen(false)}
              >
                {tr('close')}
              </button>
            </div>

            {safn.length === 0 ? (
              <div className="mt-16 max-w-[52ch]">
                <p className="text-[17px] leading-[1.5]">{tr('emptyCollection')}</p>
                <p className="mt-6 text-[15px] leading-[1.5] text-black/60">
                  {t('enquiryIntro', lang)}
                </p>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className={`${LBL} mt-8 inline-block border border-current px-4 py-3 transition-colors hover:bg-black hover:text-[#FAFAFA]`}
                >
                  {CONTACT.email}
                </a>
              </div>
            ) : (
              <>
                <ul className="mt-14 list-none">
                  {safn.map((id) => {
                    const w = workById(id)
                    const s = w ? seriesById(w.series) : null
                    if (!w || !s) return null
                    return (
                      <li
                        key={id}
                        className="flex items-center gap-5 border-t border-black/12 py-4"
                      >
                        <img
                          src={GRID(id)}
                          alt=""
                          width={w.w}
                          height={w.h}
                          className="h-14 w-14 shrink-0 object-contain"
                        />
                        <span className="text-[15px]">
                          {sName(s)} {pad2(w.n)}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleSafn(id)}
                          className={`${LBL} ml-auto opacity-40 transition-opacity hover:opacity-100`}
                        >
                          {tr('remove')}
                        </button>
                      </li>
                    )
                  })}
                </ul>
                <a
                  href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(
                    L ? 'Fyrirspurn um verk' : 'Enquiry about works',
                  )}&body=${encodeURIComponent(
                    (L ? 'Góðan dag Sossa,\n\nMig langar að spyrjast fyrir um:\n' : 'Hello Sossa,\n\nI would like to ask about:\n') +
                      safn
                        .map((id) => {
                          const w = workById(id)
                          const s = w ? seriesById(w.series) : null
                          return w && s ? `- ${L ? s.name : s.nameEn} ${pad2(w.n)}` : ''
                        })
                        .filter(Boolean)
                        .join('\n'),
                  )}`}
                  className={`${LBL} mt-10 inline-block border border-current px-5 py-4 transition-colors hover:bg-black hover:text-[#FAFAFA]`}
                >
                  {tr('sendEnquiry')}
                </a>
              </>
            )}
          </div>
        </div>
      )}

      <PreviewFooter company={company} />
    </div>
  )
}
