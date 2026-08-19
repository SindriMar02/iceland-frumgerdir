import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import Lenis from 'lenis'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { companyEntry } from './data'
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
import { SHOP_CAT_EN, SHOP_CAT_IS, SHOP_PRODUCTS } from './shop'
import type { ShopCat, ShopProduct } from './shop'
import { ABOUT, t } from './strings'
import type { Lang } from './strings'
import { COLOUR_EN, COLOUR_HEX, COLOUR_ORDER, SERIES, WORKS } from './works'
import type { Medium, Work } from './works'

gsap.registerPlugin(DrawSVGPlugin, ScrollToPlugin)

const BASE = import.meta.env.BASE_URL
/* shop.ts stores root-absolute paths, which resolve against the DOMAIN root and
   404 under a sub-path deploy (/iceland-frumgerdir/). Re-base them like the rest. */
const SHOP_IMG = (p: string) => `${BASE}${p.replace(/^\/+/, '')}`
const GRID = (id: string) => `${BASE}asaja/grid/${id}.jpg`
const FULL = (id: string) => `${BASE}asaja/work/${id}.jpg`
const HERO = (id: string) => `${BASE}asaja/hero/${id}.jpg`

const pad2 = (n: number) => String(n).padStart(2, '0')
const pad3 = (n: number) => String(n).padStart(3, '0')
const isk = (n: number) => `${n.toLocaleString('de-DE')} kr.`

const bySeries = (id: string) => WORKS.filter((w) => w.series === id)
const workById = (id: string) => WORKS.find((w) => w.id === id)
const seriesById = (id: string) => SERIES.find((s) => s.id === id)
const yearRange = (ws: Work[]) => {
  const ys = ws.map((w) => w.year)
  const lo = Math.min(...ys)
  const hi = Math.max(...ys)
  return lo === hi ? String(lo) : `${lo}–${hi}`
}

type View =
  | { k: 'home' }
  | { k: 'series'; id: string }
  | { k: 'work'; id: string }
  | { k: 'colours'; c: string | null }
  | { k: 'medium'; m: Medium | 'allt' }
  | { k: 'shop'; cat: ShopCat | 'allt' }
  | { k: 'about' }
  | { k: 'contact' }

const sameView = (a: View, b: View) => JSON.stringify(a) === JSON.stringify(b)

/* The 9px label — the reference's 8px Doner, one notch up for legibility. */
const LBL = 'font-sans text-[11px] md:text-[9px] font-extrabold uppercase tracking-[0.14em] leading-none'

function Rule({ className = '' }: { className?: string }) {
  return <span aria-hidden className={`inline-block h-px w-7 bg-current align-middle ${className}`} />
}

/* Hero band ink + crop, measured per hero (see aslaugsaja-build memory). */
type Ink = 'light' | 'dark'
const HERO_INK: Record<string, { band: Ink; pos: string }> = {
  brum: { band: 'dark', pos: '50% 40%' },
  jord: { band: 'dark', pos: '50% 50%' },
  olifur: { band: 'light', pos: '50% 50%' },
  omur: { band: 'light', pos: '50% 50%' },
  skammdegi: { band: 'light', pos: '50% 50%' },
  stilla: { band: 'dark', pos: '50% 50%' },
  sumar: { band: 'dark', pos: '50% 45%' },
  vatn: { band: 'light', pos: '50% 50%' },
}
/** Band + nav ink: ALWAYS pure white, flat, no glow — Sindri's call (2026-08-03),
 *  and the reference's own rule. The measured per-hero ink survives only as the
 *  crop position table; the nav keeps a whisper of shadow at 9px. */
const navInkStyle = () => ({ color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,.45)' })
const GRAINED = ['jord', 'olifur', 'sumar']

function MetaBand({
  years,
  name,
  count,
  label,
}: {
  years: string
  name: string
  count: number
  label: string
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 -translate-y-1/2">
      <div className="relative flex flex-col items-start gap-3 px-6 text-white md:flex-row md:items-center md:gap-0 md:px-10">
        <span className="asaja-display whitespace-nowrap text-[13px] font-medium tracking-[0.1em] tabular-nums">
          {years}
        </span>
        <span className="asaja-display text-[clamp(34px,4.6vw,64px)] uppercase leading-[0.95] tracking-[-0.01em] md:ml-[8vw]">
          {name}
        </span>
        <span className="asaja-display flex items-center gap-3 whitespace-nowrap text-[13px] font-medium tracking-[0.1em] tabular-nums md:ml-auto">
          {pad2(count)}
          <Rule />
          {label}
        </span>
      </div>
    </div>
  )
}

/** Build a paused reveal timeline and play it on the loader's first beat
 *  (with a fallback for mounts that happen outside a transition). */
function useRevealOnLoader(build: () => gsap.core.Timeline | null, deps: unknown[]) {
  useEffect(() => {
    const tl = build()
    if (!tl) return
    const play = () => tl.play()
    window.addEventListener(REVEAL_START, play)
    const fallback = window.setTimeout(() => {
      if (tl.progress() === 0 && !tl.isActive()) tl.play()
    }, 1100)
    return () => {
      window.removeEventListener(REVEAL_START, play)
      window.clearTimeout(fallback)
      tl.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/* ------------------------------------------------------------------ *
 * View router. No loading screen: the landing page reveals itself on
 * first paint, and a view change swaps content and re-fires the same
 * reveal cues. Everything that animates in — the hero settle, the grid
 * rise, the split-line text — listens for REVEAL_START, so the entrance
 * choreography is identical whether you just arrived or just navigated.
 * ------------------------------------------------------------------ */
function useViewRouter(initial: View) {
  const [view, setView] = useState<View>(initial)
  const busy = useRef(false)

  const fire = useCallback(() => {
    const reduced = reduceMotion()
    window.dispatchEvent(new CustomEvent(REVEAL_START))
    window.setTimeout(() => window.dispatchEvent(new CustomEvent(REVEAL_MIDDLE)), reduced ? 60 : 300)
    window.setTimeout(() => window.dispatchEvent(new CustomEvent(REVEAL_END)), reduced ? 120 : 700)
  }, [])

  // first paint: let the view mount its paused timelines, then cue them
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
      // two frames so the new view has mounted before its reveals are cued
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

/* ---- the sparse index grid (menu overlay · colours · medium views) ---- */
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
      className="asaja-grid mx-auto grid list-none grid-cols-2 justify-center gap-x-[26px] gap-y-[44px] px-6
                 sm:grid-cols-3 sm:gap-x-[56px] sm:gap-y-[76px]
                 lg:[grid-template-columns:repeat(4,150px)] lg:gap-x-[100px] lg:gap-y-[104px]
                 [@media(min-width:1440px)]:[grid-template-columns:repeat(5,173px)]
                 [@media(min-width:1440px)]:gap-x-[134px] [@media(min-width:1440px)]:gap-y-[134px]"
    >
      {works.map((w, i) => (
        <li key={w.id}>
          <button
            type="button"
            onClick={() => onOpen(w.id)}
            className="asaja-cell group block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
          >
            <span className="block aspect-square w-full overflow-hidden">
              <img
                src={GRID(w.id)}
                alt={`${w.title}, ${w.year}`}
                loading={i < 10 ? 'eager' : 'lazy'}
                decoding="async"
                width={w.w}
                height={w.h}
                className="asaja-thumb block h-full w-full object-contain object-bottom will-change-transform"
              />
            </span>
            <span className={`${LBL} mt-3 flex items-baseline gap-2 text-black`}>
              <span className="tabular-nums opacity-40">{pad2(i + 1)}</span>
              <span className="truncate">{w.title}</span>
            </span>
            {showSeries && (
              <span className={`${LBL} mt-1 block text-black/35`}>
                {seriesById(w.series)?.[lang === 'is' ? 'name' : 'en']}
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  )
}

/* ------------------------------------------------------------------ *
 * DEVICE — the shop grid. Her REAL working shop (saja.is): silk scarves and
 * cotton bags carrying patterns drawn from the paintings. Same column/gutter
 * geometry as IndexGrid, so it reads as one system, but the cell is a 4:5
 * product-photography ratio, not the painting's square — the one deliberate
 * break that says "this is a different kind of object." Every card is a real
 * outbound link to saja.is; nothing here fakes a cart or a transaction.
 * ------------------------------------------------------------------ */
function ShopGrid({ products, buyLabel }: { products: ShopProduct[]; buyLabel: string }) {
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
    return tl
  }, [products])

  return (
    <ul
      ref={ref}
      className="asaja-grid mx-auto grid list-none grid-cols-2 justify-center gap-x-[26px] gap-y-[44px] px-6
                 sm:grid-cols-3 sm:gap-x-[56px] sm:gap-y-[76px]
                 lg:[grid-template-columns:repeat(4,150px)] lg:gap-x-[100px] lg:gap-y-[104px]
                 [@media(min-width:1440px)]:[grid-template-columns:repeat(5,173px)]
                 [@media(min-width:1440px)]:gap-x-[134px] [@media(min-width:1440px)]:gap-y-[134px]"
    >
      {products.map((p, i) => (
        <li key={p.id}>
          <a
            href={`https://saja.is/products/${p.handle}`}
            target="_blank"
            rel="noreferrer"
            className="asaja-cell group block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
          >
            <span className="block aspect-[4/5] w-full overflow-hidden bg-black/5">
              <img
                src={SHOP_IMG(p.image)}
                alt={p.is}
                loading={i < 10 ? 'eager' : 'lazy'}
                decoding="async"
                className="asaja-thumb block h-full w-full object-cover will-change-transform"
              />
            </span>
            <span className={`${LBL} mt-3 block text-black`}>{p.is}</span>
            <span className={`${LBL} mt-1 flex items-center justify-between text-black/45`}>
              <span>{isk(p.price)}</span>
              <span className="opacity-0 transition-opacity group-hover:opacity-100">{buyLabel} ↗</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}

export default function AslaugSajaPage() {
  const company = companyEntry
  const [lang, setLang] = useState<Lang>('is')
  const [menu, setMenu] = useState(false)
  const [safnOpen, setSafnOpen] = useState(false)
  const [safn, setSafn] = useState<string[]>([])
  const { view, go } = useViewRouter({ k: 'home' })
  const tr = useCallback((k: Parameters<typeof t>[0]) => t(k, lang), [lang])

  useEffect(() => {
    document.title = 'Áslaug Saja Davíðsdóttir'
  }, [])

  /* Lenis with the reference's params — paused on the slider view, like
     their lenisShouldPause. */
  const lenisRef = useRef<Lenis | null>(null)
  useEffect(() => {
    /* Never run Lenis on a touch device. iOS momentum scrolling is smoother than
       any JS lerp, and running both means Lenis's rAF loop and the compositor
       fight over the same scroll position every frame — that fight IS the judder
       on a phone. Desktop keeps the reference's damped feel; touch gets native. */
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

  const seriesMeta = useMemo(
    () =>
      SERIES.map((s) => {
        const ws = bySeries(s.id)
        return { ...s, works: ws, count: ws.length, years: yearRange(ws) }
      }),
    [],
  )
  const colourCounts = useMemo(() => {
    const m: Record<string, number> = {}
    for (const c of COLOUR_ORDER) m[c] = WORKS.filter((w) => w.colours.includes(c)).length
    return m
  }, [])

  const L = lang === 'is'
  const sName = useCallback((s: { name: string; en: string }) => (L ? s.name : s.en), [L])
  const cName = (c: string) => (L ? c.toUpperCase() : COLOUR_EN[c].toUpperCase())

  /* the slider slides: hero + two hover variants from the same series */
  const slides = useMemo<Slide[]>(
    () =>
      seriesMeta.map((s) => {
        const variants = s.works
          .filter((w) => w.id !== s.hero)
          .sort((a, b) => b.w * b.h - a.w * a.h)
          .slice(0, 2)
          .map((w) => FULL(w.id))
        return {
          id: s.id,
          hero: HERO(s.id),
          variants,
          pos: HERO_INK[s.id].pos,
          band: HERO_INK[s.id].band,
          label: sName(s),
          node: (
            <MetaBand years={s.years} name={sName(s)} count={s.count} label={tr('pieces')} />
          ),
        }
      }),
    [seriesMeta, sName, tr],
  )

  /* nav ink: white over the slider / hero panels, black on #FAFAFA */
  const [overPainting, setOverPainting] = useState(true)
  useEffect(() => {
    if (view.k === 'home') {
      setOverPainting(true)
      return
    }
    const NAV_MID = 29
    const pick = () => {
      const panels = document.querySelectorAll<HTMLElement>('[data-hero-panel]')
      for (const p of panels) {
        const r = p.getBoundingClientRect()
        if (r.top <= NAV_MID && r.bottom > NAV_MID) {
          setOverPainting(true)
          return
        }
      }
      setOverPainting(false)
    }
    pick()
    window.addEventListener('scroll', pick, { passive: true })
    window.addEventListener('resize', pick)
    return () => {
      window.removeEventListener('scroll', pick)
      window.removeEventListener('resize', pick)
    }
  }, [view])

  /* ---- per-view reveal refs ---- */
  const workImgRef = useRef<HTMLDivElement>(null)
  const workTextRef = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const seriesHeroImgRef = useRef<HTMLImageElement>(null)

  /* work view: images yPercent 50 · 1s · quart.out; texts split-line with 0.1 delay */
  useRevealOnLoader(() => {
    if (view.k !== 'work') return null
    if (reduceMotion()) return null
    const tl = gsap.timeline({ paused: true })
    const imgs = workImgRef.current?.querySelectorAll('img')
    if (imgs?.length)
      tl.from(imgs, { yPercent: 50, duration: 1, stagger: 0.05, ease: 'quart.out', clearProps: 'transform' }, 0)
    const texts = workTextRef.current
      ? [...workTextRef.current.querySelectorAll<HTMLElement>('[data-reveal-text]')]
      : []
    const sub = splitLineReveal(texts, 0.1)
    if (sub) tl.add(sub.play(), 0)
    return tl
  }, [view])

  /* about/contact: split-line text blocks at 0.1·i + the contact image clip reveal */
  useRevealOnLoader(() => {
    if (view.k !== 'about' && view.k !== 'contact') return null
    const root = aboutRef.current
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
        { yPercent: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.75, ease: 'power3.out', clearProps: 'all' },
        0,
      )
    return tl
  }, [view])

  /* series hero: settle from a 1.12 scale, the slider slide's arrival echo */
  useRevealOnLoader(() => {
    if (view.k !== 'series') return null
    const img = seriesHeroImgRef.current
    if (!img || reduceMotion()) return null
    return gsap
      .timeline({ paused: true })
      .fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.75, ease: 'expo.out', clearProps: 'transform' })
  }, [view])

  const navItem = `${LBL} transition-opacity duration-200 hover:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current`

  return (
    <div lang={L ? 'is' : 'en'} className="min-h-screen bg-[#FAFAFA] text-black antialiased">
      <style>{`
        .asaja-display{font-family:'Clash Display',sans-serif;font-weight:600}
        .asaja-thumb{transition:opacity .5s ease}
        .asaja-cell:hover .asaja-thumb{opacity:.55}
        .asaja-topveil{background:linear-gradient(to bottom,rgba(0,0,0,.46),rgba(0,0,0,.20) 38%,rgba(0,0,0,0) 100%);pointer-events:none;z-index:10}
        .asaja-grain{
          background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3'/></filter><rect width='140' height='140' filter='url(%23n)' opacity='.5'/></svg>");
          mix-blend-mode:overlay;opacity:.16;pointer-events:none;
        }
        .line{will-change:transform}
        @media (prefers-reduced-motion: reduce){.asaja-thumb{transition:none}}
      `}</style>

      {/* ---- tri-cluster fixed transparent nav ---- */}
      <header
        className="fixed inset-x-0 top-0 z-50 flex h-[58px] items-center bg-transparent px-6 md:px-10"
        style={overPainting ? navInkStyle() : { color: '#000' }}
      >
        {/* On a phone the light views scroll their own dark text straight under
            this transparent bar and the wordmark collides with it. Desktop has
            the room and keeps the approved transparent nav untouched. */}
        {!overPainting && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[92px] bg-gradient-to-b from-[#FAFAFA] via-[#FAFAFA] to-transparent lg:hidden"
          />
        )}
        <button
          type="button"
          onClick={() => nav({ k: 'home' })}
          className="asaja-display text-[20px] uppercase leading-none tracking-[0.01em] transition-opacity hover:opacity-50 md:text-[26px]"
        >
          Áslaug Saja
        </button>
        <nav className="ml-auto hidden items-center gap-8 lg:flex" aria-label={L ? 'Aðalvalmynd' : 'Main'}>
          <span className="flex items-center gap-5">
            <button type="button" className={navItem} onClick={() => nav({ k: 'home' })}>
              {tr('bySeries')}
            </button>
            <button type="button" className={navItem} onClick={() => nav({ k: 'colours', c: null })}>
              {tr('byColour')}
            </button>
            <button type="button" className={navItem} onClick={() => nav({ k: 'shop', cat: 'allt' })}>
              {tr('shop')}
            </button>
          </span>
          <span className="flex items-center gap-5">
            <button type="button" className={navItem} onClick={() => nav({ k: 'medium', m: 'allt' })}>
              {tr('all')}
            </button>
            <button type="button" className={navItem} onClick={() => nav({ k: 'medium', m: 'strigi' })}>
              {tr('canvas')}
            </button>
            <button type="button" className={navItem} onClick={() => nav({ k: 'medium', m: 'pappir' })}>
              {tr('paper')}
            </button>
          </span>
          <span className="flex items-center gap-5">
            <button type="button" className={navItem} onClick={() => nav({ k: 'about' })}>
              {tr('about')}
            </button>
            <button type="button" className={navItem} onClick={() => nav({ k: 'contact' })}>
              {tr('contact')}
            </button>
            <button type="button" className={navItem} onClick={() => setSafnOpen(true)}>
              {tr('collection')} ({safn.length})
            </button>
            <button
              type="button"
              className={`${LBL} tracking-[0.14em] transition-opacity hover:opacity-40`}
              onClick={() => setLang(L ? 'en' : 'is')}
              aria-label={L ? 'Switch to English' : 'Skipta yfir á íslensku'}
            >
              <span className={L ? '' : 'opacity-35'}>IS</span>
              <span className="mx-1 opacity-35">/</span>
              <span className={L ? 'opacity-35' : ''}>EN</span>
            </button>
          </span>
        </nav>
        <button type="button" className={`${navItem} ml-auto lg:hidden`} onClick={() => setMenu(true)}>
          {tr('menu')} ({WORKS.length})
        </button>
      </header>

      {/* ---- views ---- */}
      <main key={JSON.stringify(view)}>
        {view.k === 'home' && (
          <>
            <h1 className="sr-only">Áslaug Saja Davíðsdóttir {L ? '— málverk' : '— paintings'}</h1>
            <div className="h-[100svh]">
              <HomeSlider slides={slides} onOpen={(id) => nav({ k: 'series', id })} />
            </div>
          </>
        )}

        {view.k === 'series' && (() => {
          const s = seriesById(view.id)
          if (!s) return null
          const ws = bySeries(s.id)
          return (
            <>
              <section data-hero-panel="" className="relative h-[100svh] w-full overflow-hidden bg-black">
                <img
                  ref={seriesHeroImgRef}
                  src={HERO(s.id)}
                  alt={sName(s)}
                  loading="eager"
                  decoding="async"
                  style={{ objectPosition: HERO_INK[s.id].pos }}
                  className="absolute inset-0 h-full w-full object-cover will-change-transform"
                />
                {GRAINED.includes(s.id) && <div aria-hidden className="asaja-grain absolute inset-0" />}
                <div aria-hidden className="asaja-topveil absolute inset-x-0 top-0 h-[150px]" />
                <MetaBand years={yearRange(ws)} name={sName(s)} count={ws.length} label={tr('pieces')} />
              </section>
              <h1 className="sr-only">{sName(s)}</h1>
              <div className="pt-16">
                <SeriesWorks
                  works={ws}
                  grid={GRID}
                  full={FULL}
                  onOpen={openWork}
                  lbl={LBL}
                  listLabel={L ? 'LISTI' : 'LIST'}
                  gridLabel={L ? 'GRIND' : 'GRID'}
                />
              </div>
            </>
          )
        })()}

        {view.k === 'work' && (() => {
          const w = workById(view.id)
          if (!w) return null
          const s = seriesById(w.series)
          const sibs = bySeries(w.series)
          const i = sibs.findIndex((x) => x.id === w.id)
          const prev = sibs[(i - 1 + sibs.length) % sibs.length]
          const next = sibs[(i + 1) % sibs.length]
          const inSafn = safn.includes(w.id)
          const alsoAs = SHOP_PRODUCTS.filter((p) => p.matchedWork === w.id)
          return (
            <article className="px-6 pb-24 pt-[110px] md:px-10">
              <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[1fr_260px] lg:gap-24">
                <div ref={workImgRef}>
                  <div className="overflow-hidden">
                    <img
                      src={FULL(w.id)}
                      alt={`${w.title}, ${w.tech}`}
                      loading="eager"
                      decoding="async"
                      width={w.w}
                      height={w.h}
                      className="block w-full will-change-transform"
                    />
                  </div>
                  <figure className="mt-16">
                    <figcaption className={`${LBL} mb-3 text-black/40`}>{tr('detail')}</figcaption>
                    <div className="aspect-[16/7] w-full overflow-hidden">
                      <img
                        src={FULL(w.id)}
                        alt=""
                        aria-hidden
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full scale-[2.4] object-cover"
                        style={{ objectPosition: '38% 44%' }}
                      />
                    </div>
                  </figure>

                  {alsoAs.length > 0 && (
                    <div className="mt-16 border-t border-black/10 pt-10">
                      <p className={`${LBL} text-black/40`}>{tr('alsoAvailableAs')}</p>
                      <ul className="mt-6 flex list-none flex-wrap gap-8">
                        {alsoAs.map((p) => (
                          <li key={p.id}>
                            <a
                              href={`https://saja.is/products/${p.handle}`}
                              target="_blank"
                              rel="noreferrer"
                              className="group block w-[132px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                            >
                              <span className="block aspect-[4/5] w-full overflow-hidden bg-black/5">
                                <img
                                  src={p.image}
                                  alt={p.is}
                                  loading="lazy"
                                  decoding="async"
                                  className="asaja-thumb block h-full w-full object-cover"
                                />
                              </span>
                              <span className={`${LBL} mt-2 block text-black`}>{p.is}</span>
                              <span className={`${LBL} mt-1 block text-black/45`}>{isk(p.price)}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <aside ref={workTextRef} className="lg:sticky lg:top-[110px] lg:self-start">
                  <p className={`${LBL} text-black/40`} data-reveal-text="">
                    <button type="button" className="hover:opacity-50" onClick={() => nav({ k: 'series', id: w.series })}>
                      {s ? sName(s) : ''}
                    </button>
                    <span className="mx-2 opacity-40">/</span>
                    <span className="tabular-nums">{pad2(w.n)}</span>
                  </p>
                  <h1 className="mt-5 asaja-display text-[26px] uppercase leading-none tracking-[0em]" data-reveal-text="">
                    {w.title}
                  </h1>
                  <dl className="mt-10 space-y-4">
                    {[
                      [tr('year'), String(w.year)],
                      [tr('size'), w.size],
                      [tr('technique'), w.tech],
                      [tr('price'), isk(w.price)],
                    ].map(([k, v]) => (
                      <div key={k} className="flex gap-4 border-t border-black/10 pt-4">
                        <dt className={`${LBL} w-20 shrink-0 text-black/40`}>{k}</dt>
                        <dd className={`${LBL} normal-case tracking-[0.06em] leading-[1.7]`} data-reveal-text="">
                          {v}
                        </dd>
                      </div>
                    ))}
                    <div className="flex gap-4 border-t border-black/10 pt-4">
                      <dt className={`${LBL} w-20 shrink-0 text-black/40`}>{tr('colours')}</dt>
                      <dd className="flex flex-wrap gap-2">
                        {w.colours.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => nav({ k: 'colours', c })}
                            title={cName(c)}
                            className="h-4 w-4 rounded-full ring-1 ring-black/15 transition-transform hover:scale-125"
                            style={{ background: COLOUR_HEX[c] }}
                          >
                            <span className="sr-only">{cName(c)}</span>
                          </button>
                        ))}
                      </dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={() => toggleSafn(w.id)}
                    className={`${LBL} mt-10 border-b border-black pb-1 transition-opacity hover:opacity-45`}
                  >
                    {inSafn ? tr('inCollection') : tr('enquire')}
                  </button>
                  <div className="mt-14 flex gap-8">
                    <button type="button" className={`${LBL} text-black/45 hover:text-black`} onClick={() => openWork(prev.id)}>
                      {tr('prev')}
                    </button>
                    <button type="button" className={`${LBL} text-black/45 hover:text-black`} onClick={() => openWork(next.id)}>
                      {tr('next')}
                    </button>
                  </div>
                </aside>
              </div>
            </article>
          )
        })()}

        {view.k === 'colours' && (() => {
          const active = view.c
          const list = active ? WORKS.filter((w) => w.colours.includes(active)) : WORKS
          return (
            <div className="px-6 pb-24 pt-[110px] md:px-10">
              <h1 className="sr-only">{tr('byColour')}</h1>
              <div className="mx-auto max-w-[1400px]">
                <nav aria-label={tr('byColour')}>
                  <ul className="flex list-none flex-wrap gap-x-7 gap-y-4 border-b border-black/10 pb-6">
                    <li>
                      <button
                        type="button"
                        onClick={() => nav({ k: 'colours', c: null })}
                        className={`${LBL} flex items-center gap-3 ${active ? 'text-black/40' : 'text-black'}`}
                      >
                        {tr('all')} <span className="tabular-nums opacity-50">{pad3(WORKS.length)}</span>
                      </button>
                    </li>
                    {COLOUR_ORDER.map((c) => (
                      <li key={c}>
                        <button
                          type="button"
                          onClick={() => nav({ k: 'colours', c })}
                          className={`${LBL} flex items-center gap-3 ${active === c ? 'text-black' : 'text-black/40'}`}
                        >
                          <span className="h-3 w-3 rounded-full ring-1 ring-black/15" style={{ background: COLOUR_HEX[c] }} />
                          {cName(c)}
                          <span className="tabular-nums opacity-50">{pad3(colourCounts[c])}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div className="pt-20">
                <IndexGrid works={list} lang={lang} onOpen={openWork} showSeries />
              </div>
            </div>
          )
        })()}

        {view.k === 'medium' && (() => {
          const list = view.m === 'allt' ? WORKS : WORKS.filter((w) => w.medium === view.m)
          const heading = view.m === 'allt' ? tr('all') : view.m === 'strigi' ? tr('canvas') : tr('paper')
          return (
            <div className="px-6 pb-24 pt-[110px] md:px-10">
              <div className="mx-auto flex max-w-[1400px] items-baseline gap-6 border-b border-black/10 pb-6">
                <h1 className="asaja-display text-[26px] uppercase leading-none tracking-[0em]">{heading}</h1>
                <span className={`${LBL} ml-auto flex items-center gap-3 tabular-nums text-black/45`}>
                  {pad3(list.length)}
                  <Rule />
                  {tr('pieces')}
                </span>
              </div>
              <div className="pt-20">
                <IndexGrid works={list} lang={lang} onOpen={openWork} showSeries />
              </div>
            </div>
          )
        })()}

        {view.k === 'shop' && (() => {
          const cat = view.cat
          const list = cat === 'allt' ? SHOP_PRODUCTS : SHOP_PRODUCTS.filter((p) => p.cat === cat)
          const CATS: Array<ShopCat | 'allt'> = ['allt', 'slaedur', 'toskur', 'heimili', 'mus']
          const catLabel = (c: ShopCat | 'allt') =>
            c === 'allt' ? tr('shopAll') : L ? SHOP_CAT_IS[c] : SHOP_CAT_EN[c]
          return (
            <div className="px-6 pb-24 pt-[110px] md:px-10">
              <h1 className="sr-only">{tr('shop')}</h1>
              <div className="mx-auto max-w-[1400px]">
                <p
                  className={`${LBL} max-w-[52ch] normal-case leading-[1.9] tracking-[0.04em] text-black/50`}
                >
                  {tr('shopIntro')}
                </p>
                <nav aria-label={tr('shop')} className="mt-8">
                  <ul className="flex list-none flex-wrap gap-x-7 gap-y-4 border-b border-black/10 pb-6">
                    {CATS.map((c) => (
                      <li key={c}>
                        <button
                          type="button"
                          onClick={() => nav({ k: 'shop', cat: c })}
                          className={`${LBL} flex items-center gap-3 ${cat === c ? 'text-black' : 'text-black/40'}`}
                        >
                          {catLabel(c)}
                          <span className="tabular-nums opacity-50">
                            {pad3(c === 'allt' ? SHOP_PRODUCTS.length : SHOP_PRODUCTS.filter((p) => p.cat === c).length)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div className="pt-20">
                <ShopGrid products={list} buyLabel={tr('buyOnSaja')} />
              </div>
            </div>
          )
        })()}

        {view.k === 'about' && (
          <div ref={aboutRef} className="px-6 pb-24 pt-[110px] md:px-10">
            <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[1fr_1fr] lg:gap-24">
              <div>
                <h1 className="asaja-display text-[26px] uppercase leading-none tracking-[0em]" data-reveal-text="">
                  {tr('aboutTitle')}
                </h1>
                <div className="mt-10 max-w-[46ch] space-y-6 font-sans text-[17px] leading-[1.75] text-black/80">
                  {ABOUT[lang].map((p) => (
                    <p key={p.slice(0, 24)} data-reveal-text="">
                      {p}
                    </p>
                  ))}
                </div>
                <p className={`${LBL} mt-12 text-black/40`}>
                  {tr('studio')}
                  <Rule className="mx-3" />
                  Hveragerði
                </p>
              </div>
              <div className="overflow-hidden">
                <img
                  src={HERO('stilla')}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  decoding="async"
                  className="w-full"
                  data-reveal-image=""
                />
              </div>
            </div>
          </div>
        )}

        {view.k === 'contact' && (
          <div ref={aboutRef} className="px-6 pb-24 pt-[110px] md:px-10">
            <div className="mx-auto max-w-[1400px]">
              <h1 className="asaja-display text-[26px] uppercase leading-none tracking-[0em]" data-reveal-text="">
                {tr('contact')}
              </h1>
              <p className="mt-10 max-w-[46ch] font-sans text-[17px] leading-[1.75] text-black/80" data-reveal-text="">
                {tr('enquiryIntro')}
              </p>
              <button
                type="button"
                onClick={() => setSafnOpen(true)}
                className={`${LBL} mt-10 block border-b border-black pb-1 transition-opacity hover:opacity-45`}
              >
                {tr('collection')} ({safn.length})
              </button>
              {/* The enquiry basket is the intended route, but a contact page that
                  offers no way to make contact when the basket is empty is a dead
                  end. Her own published address, from saja.is/policies/contact-information. */}
              <p className={`${LBL} mt-12 block text-black/45`}>{tr('orWriteDirect')}</p>
              <a
                href={`mailto:${company.ownerEmail}`}
                className="asaja-display mt-2 inline-block text-[clamp(20px,4.4vw,30px)] lowercase leading-none tracking-[0em] transition-opacity hover:opacity-45"
              >
                {company.ownerEmail}
              </a>
            </div>
          </div>
        )}
      </main>

      {/* ---- the sparse index lives INSIDE the menu overlay ---- */}
      {/* data-lenis-prevent: while the page Lenis is stopped it preventDefaults
          EVERY wheel/touch event (lenis.mjs:611), which freezes this nested
          scroller too. The attribute makes Lenis bail out first (lenis.mjs:607).
          overscroll-contain stops the freed gesture chaining to the page. */}
      {menu && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-[80] overflow-y-auto overscroll-contain bg-[#FAFAFA]"
        >
          <div className="sticky top-0 z-10 flex h-[58px] items-center bg-[#FAFAFA] px-6 md:px-10">
            <span className="asaja-display text-[20px] uppercase leading-none tracking-[0.01em] md:text-[26px]">Áslaug Saja</span>
            <button type="button" className={`${LBL} ml-auto`} onClick={() => setMenu(false)}>
              {tr('close')}
            </button>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-4 px-6 pb-12 pt-6 md:px-10" aria-label={tr('menu')}>
            {[
              [tr('bySeries'), () => nav({ k: 'home' })],
              [tr('byColour'), () => nav({ k: 'colours', c: null })],
              [tr('shop'), () => nav({ k: 'shop', cat: 'allt' })],
              [tr('canvas'), () => nav({ k: 'medium', m: 'strigi' })],
              [tr('paper'), () => nav({ k: 'medium', m: 'pappir' })],
              [tr('about'), () => nav({ k: 'about' })],
              [tr('contact'), () => nav({ k: 'contact' })],
            ].map(([label, fn]) => (
              <button key={label as string} type="button" className={LBL} onClick={fn as () => void}>
                {label as string}
              </button>
            ))}
            <button
              type="button"
              className={LBL}
              onClick={() => setLang(L ? 'en' : 'is')}
              aria-label={L ? 'Switch to English' : 'Skipta yfir á íslensku'}
            >
              <span className={L ? '' : 'opacity-35'}>IS</span>
              <span className="mx-1 opacity-35">/</span>
              <span className={L ? 'opacity-35' : ''}>EN</span>
            </button>
          </nav>
          <div className="pb-16">
            <IndexGrid works={WORKS} lang={lang} onOpen={openWork} showSeries revealNow />
          </div>
          <PreviewFooter company={company} />
        </div>
      )}

      {/* ---- the enquiry selection ---- */}
      {safnOpen && (
        <div className="fixed inset-0 z-[90] flex justify-end bg-black/25" onClick={() => setSafnOpen(false)}>
          <aside
            className="flex h-full w-full max-w-[440px] flex-col bg-[#FAFAFA] px-6 py-6 md:px-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center">
              <span className={LBL}>
                {tr('collection')} ({safn.length})
              </span>
              <button type="button" className={`${LBL} ml-auto`} onClick={() => setSafnOpen(false)}>
                {tr('close')}
              </button>
            </div>
            {safn.length === 0 ? (
              <p className={`${LBL} mt-10 normal-case leading-[1.9] tracking-[0.04em] text-black/45`}>{tr('emptyCollection')}</p>
            ) : (
              <>
                <ul data-lenis-prevent className="mt-8 flex-1 list-none space-y-6 overflow-y-auto overscroll-contain">
                  {safn.map((id) => {
                    const w = workById(id)
                    if (!w) return null
                    return (
                      <li key={id} className="flex gap-4">
                        <img src={GRID(id)} alt="" aria-hidden className="h-16 w-16 object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className={`${LBL} truncate`}>{w.title}</p>
                          <p className={`${LBL} mt-2 text-black/45`}>
                            {w.size}
                            <Rule className="mx-2 w-4" />
                            {isk(w.price)}
                          </p>
                        </div>
                        <button type="button" className={`${LBL} shrink-0 text-black/40 hover:text-black`} onClick={() => toggleSafn(id)}>
                          {tr('remove')}
                        </button>
                      </li>
                    )
                  })}
                </ul>
                <p className={`${LBL} mt-6 normal-case leading-[1.9] tracking-[0.04em] text-black/45`}>{tr('enquiryIntro')}</p>
                <button type="button" className={`${LBL} mt-6 self-start border-b border-black pb-1`}>
                  {tr('sendEnquiry')}
                </button>
              </>
            )}
          </aside>
        </div>
      )}

      <PreviewChrome company={company} />
      {view.k !== 'home' && <PreviewFooter company={company} />}
    </div>
  )
}
