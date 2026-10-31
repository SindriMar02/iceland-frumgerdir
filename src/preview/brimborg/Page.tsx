import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import Lenis from 'lenis'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Mail, MapPin, Menu, MessageCircle, Phone, X } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { SndrBadge } from '../SndrBadge'
import { setMetaDescription, setNoindex, setThemeColor } from '../../lib/preview'
import { A, CATEGORIES, CONTACT, DEPTS, EMERGENCY, IMG, JSON_LD, LINKS, MODELS, P5, P5_GALLERY, SAGA, SHOWROOM, USED, fullName, openState, type Model, type Photo } from './data'
import { answer, CHIPS, GREETING } from './chat'
import { CSS, INK } from './styles'

/*
 * Brimborg: "Polestar 5 er kominn". DESIGN.md beside this file.
 *
 * A transplant of the Bílabúð Benna system (src/preview/benni) by way of ÍSBAND and Íslyft:
 * same motion, same layout, same chat wiring; Brimborg's teal, logo, photos and facts, plus
 * one new chapter (the Polestar 5 price, lease and showroom) and a loader that waits for the
 * fonts and the hero picture before it lifts.
 *
 * Layout from the Drivehub dealer template Sindri pinned (contact bar over a dark car hero,
 * white pill CTA, browse-by-type rail with arrows, a featured grid). Behaviour from
 * spykercars.com, lifted from its own bundle into _reference/spyker-teardown/TEARDOWN.md:
 * Lenis lerp .125, the cubic-bezier(.625,.05,0,1) ease, masked character titles (.8s, .018),
 * line-faded body (.05), clip-scale media (.6 → 1, picture 1.1 → 1), 8% inner parallax,
 * per-ratio collage drift, a hero that recedes to .8 from "40% top", the statement band's
 * inset(10%) clip, the heritage float (scrub .55, .45s → -s) and a header that changes
 * colour exactly at the section edge.
 *
 * Declared deviation: reveals are tied to scroll POSITION over a short band
 * (scroll-reveals-must-be-position-tied); Spyker plays them once on a timer. Same curve,
 * same staggers, but a fast flick cannot outrun them.
 */

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)
CustomEase.create('bb', 'M0,0 C0.625,0.05 0,1 1,1')

const company = getPreviewCompany('brimborg')
const SEEN = 'bb-opened'

/* Lenis drives the wheel on fine pointers only (lenis-mobile-damage): a phone
 * keeps native scroll so Safari can collapse its toolbar. */
let pageLenis: Lenis | null = null
const isTouch = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches
const still = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function goTo(id: string) {
  const t = document.getElementById(id)
  if (!t) return
  if (pageLenis) pageLenis.scrollTo(t, { offset: -64 })
  else t.scrollIntoView({ behavior: still() ? 'auto' : 'smooth', block: 'start' })
}

/* ── small parts ────────────────────────────────────────────────────────── */

function Pic({ p, sizes, eager, className, pos }: { p: Photo; sizes: string; eager?: boolean; className?: string; pos?: string }) {
  return (
    <img className={className} src={p.src} srcSet={p.srcSet} sizes={sizes} alt={p.alt} width={p.w} height={p.h}
      style={pos ? { objectPosition: pos } : undefined}
      loading={eager ? 'eager' : 'lazy'} decoding={eager ? 'sync' : 'async'} {...(eager ? { fetchpriority: 'high' } : {})} />
  )
}

/* A frame whose picture sits 10% oversize for the inner parallax, and which
 * clip-scales in (Spyker media reveal). */
function Frame({ p, sizes, ratio, className = '', pos, alt, parallax = true }: { p: Photo; sizes: string; ratio?: string; className?: string; pos?: string; alt?: string; parallax?: boolean }) {
  return (
    <div className={`frame ${className}${parallax ? '' : ' whole-photo'}`} style={ratio ? { aspectRatio: ratio } : undefined} data-media="">
      <div className={parallax ? 'par' : 'still-photo'} data-par={parallax ? '' : undefined}>
        <Pic p={alt === undefined ? p : { ...p, alt }} sizes={sizes} pos={pos} />
      </div>
    </div>
  )
}

/* Spyker's button: opens from the middle on entry, label characters roll on
 * hover. The accessible name is the plain label; the rolling copy is hidden. */
function Btn({ href, label, tone = 'light', icon, onClick, ext, type, className = '' }: {
  href?: string; label: string; tone?: 'light' | 'dark' | 'ghost' | 'red' | 'line'; icon?: ReactNode; onClick?: () => void; ext?: boolean; type?: 'submit' | 'button'; className?: string
}) {
  const inner = (
    <>
      <span className="sr">{label}</span>
      <span className="lbl" aria-hidden="true">
        {[...label].map((c, i) => <span key={i} className="c" style={{ '--i': i } as CSSProperties}>{c === ' ' ? ' ' : c}</span>)}
      </span>
      {icon}
    </>
  )
  const cls = `btn btn-${tone} ${className}`
  if (href) {
    const internal = href.startsWith('#')
    return (
      <a className={cls} href={href} data-btn=""
        {...(ext ? { target: '_blank', rel: 'noopener' } : {})}
        onClick={(e) => { if (internal) { e.preventDefault(); onClick?.(); goTo(href.slice(1)) } else onClick?.() }}>
        {inner}
      </a>
    )
  }
  return <button className={cls} type={type ?? 'button'} onClick={onClick} data-btn="">{inner}</button>
}

function Eyebrow({ children, dot = true }: { children: ReactNode; dot?: boolean }) {
  return <p className="eyebrow" data-fade="">{dot && <i aria-hidden="true" />}{children}</p>
}

/* A price that rolls like an odometer. Each digit is a strip of 0-9 twice, parked on the real digit with
 * a margin so the resting state needs no transform; the roll tweens yPercent from the digit's own offset
 * back to 0. Screen readers get the plain text. */
function Digits({ value, unit, roll = 'intro' }: { value: string; unit?: string; roll?: 'intro' | 'scroll' }) {
  return (
    <>
      <span className="sr">{value}{unit ? ` ${unit}` : ''}</span>
      <span className="num" aria-hidden="true" data-roll={roll}>
        {[...value].map((c, i) => /\d/.test(c)
          ? <span key={i} className="dg"><span className="dr" data-d={c} style={{ marginTop: `${-(Number(c) + 10)}em` }}>{Array.from({ length: 20 }, (_, k) => <i key={k}>{k % 10}</i>)}</span></span>
          : <span key={i} className="sep">{c}</span>)}
        {unit && <span className="cur">{unit}</span>}
      </span>
    </>
  )
}

/* ── header ─────────────────────────────────────────────────────────────── */

const NAV = [
  { k: 'polestar5', label: 'Polestar 5' },
  { k: 'urval', label: 'Nýir bílar' },
  { k: 'notadir', label: 'Notaðir bílar' },
  { k: 'thjonusta', label: 'Þjónusta' },
  { k: 'opid', label: 'Opnunartímar' },
]

function HeaderRow({ layer, focusKey, onFocusKey, onMenu }: { layer: 'base' | 'top'; focusKey: string | null; onFocusKey: (k: string | null) => void; onMenu: (viaKey: boolean) => void }) {
  const hidden = layer === 'top'
  const tab = hidden ? -1 : undefined
  const f = (k: string) => (hidden ? {} : { onFocus: () => onFocusKey(k), onBlur: () => onFocusKey(null) })
  const kf = (k: string) => (hidden && focusKey === k ? ' kf' : '')
  return (
    <div className="row">
      <a className={`logo${kf('logo')}`} href="#efst" tabIndex={tab} {...f('logo')} aria-label="Brimborg, efst á síðu"
        onClick={(e) => { e.preventDefault(); if (pageLenis) pageLenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' }) }}>
        <img src={A(hidden ? 'logo-white.svg' : 'logo.svg')} alt="" width={110} height={38} />
      </a>
      <nav className="links" aria-label={hidden ? undefined : 'Aðalvalmynd'}>
        {NAV.map((n) => (
          <a key={n.k} className={`nl${kf(n.k)}`} href={`#${n.k}`} tabIndex={tab} {...f(n.k)}
            onClick={(e) => { e.preventDefault(); goTo(n.k) }}>{n.label}</a>
        ))}
      </nav>
      <div className="acts">
        <a className={`pill${kf('cta')}`} href="#reynsluakstur" tabIndex={tab} {...f('cta')}
          onClick={(e) => { e.preventDefault(); goTo('reynsluakstur') }}>Bóka reynsluakstur</a>
        <button className={`burger${kf('menu')}`} type="button" tabIndex={tab} {...f('menu')} onClick={(e) => onMenu(e.detail === 0)} aria-label="Opna valmynd">
          <Menu size={22} strokeWidth={1.6} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

/* ── page ───────────────────────────────────────────────────────────────── */

type Filter = 'allir' | 'polestar' | 'volvo' | 'ford' | 'mazda' | 'peugeot' | 'rafmagn' | 'jeppar' | 'sjo' | 'sendibilar' | 'pallbilar'
const FILTERS: { k: Filter; label: string }[] = [
  { k: 'allir', label: 'Allir' }, { k: 'polestar', label: 'Polestar' }, { k: 'volvo', label: 'Volvo' },
  { k: 'ford', label: 'Ford' }, { k: 'mazda', label: 'Mazda' }, { k: 'peugeot', label: 'Peugeot' }, { k: 'rafmagn', label: 'Rafmagn' },
]
const inFilter = (m: Model, f: Filter) =>
  f === 'allir' ? true
    : f === 'rafmagn' ? m.power === 'Rafmagn'
      : f === 'jeppar' ? m.group === 'jeppi'
        : f === 'sjo' ? m.group === 'sjo'
          : f === 'sendibilar' ? m.group === 'sendibill'
            : f === 'pallbilar' ? m.group === 'pallbill'
              : m.brand.toLowerCase() === f
/* A category the filter row has no button for still filters; the row then shows
   "Allir" as off and the grid tells you what it is showing. */
const CAT_FILTER: Record<string, Filter | null> = { rafbilar: 'rafmagn', jeppar: 'jeppar', sjo: 'sjo', sendibilar: 'sendibilar', pallbilar: 'pallbilar', notadir: null }
const FILTER_NAME: Partial<Record<Filter, string>> = { jeppar: 'Jeppar og jepplingar', sjo: 'Sjö manna bílar', sendibilar: 'Sendibílar', pallbilar: 'Pallbílar' }

type ChatEl = HTMLElement & { answerer?: typeof answer; open?: () => void }

export default function BrimborgPage() {
  const root = useRef<HTMLDivElement>(null)
  const [loader, setLoader] = useState(() => {
    try { return !sessionStorage.getItem(SEEN) && !window.matchMedia('(prefers-reduced-motion: reduce)').matches } catch { return false }
  })
  const [menu, setMenu] = useState(false)
  const [focusKey, setFocusKey] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('allir')
  const [sent, setSent] = useState(false)
  const [car, setCar] = useState('')
  const [now, setNow] = useState(() => new Date())
  const chat = useRef<ChatEl | null>(null)

  /* head: title, description, noindex, theme colour, structured data */
  useEffect(() => {
    const prevTitle = document.title
    document.title = 'Brimborg | Polestar 5 er kominn | Ford, Volvo, Polestar, Mazda, Citroën, Peugeot og Opel'
    setThemeColor(INK)
    const a = setMetaDescription('Polestar 5 er kominn til Íslands: verð frá 21.990.000 kr., til afgreiðslu strax í Polestar Reykjavík á Bíldshöfða 6. Brimborg er umboðsaðili Ford, Volvo, Polestar, Mazda, Citroën, Peugeot og Opel. Sími 515 7000.')
    const b = setNoindex(true)
    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.textContent = JSON.stringify(JSON_LD)
    document.head.appendChild(ld)
    return () => { document.title = prevTitle; a(); b(); ld.remove() }
  }, [])

  /* focus-guard: remember whether the last input was a pointer or a key, so a tap never rings the first item */
  useEffect(() => {
    const root = document.documentElement
    const set = (v: string) => { if (root.getAttribute('data-input') !== v) root.setAttribute('data-input', v) }
    const pd = () => set('pointer')
    const kd = (e: KeyboardEvent) => { if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') return; set('key') }
    addEventListener('pointerdown', pd, true)
    addEventListener('keydown', kd, true)
    return () => { removeEventListener('pointerdown', pd, true); removeEventListener('keydown', kd, true); root.removeAttribute('data-input') }
  }, [])

  /* the live open/closed labels */
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(t)
  }, [])

  /* the assistant: our widget, answering only from this page (chat.ts) */
  useEffect(() => {
    let el: ChatEl | null = null
    let alive = true
    import('./vendor/sndr-chat.js').then(() => {
      if (!alive || !root.current) return
      el = document.createElement('sndr-chat') as ChatEl
      el.setAttribute('name', 'Brimborg')
      el.setAttribute('phone', CONTACT.phone)
      el.setAttribute('lang', 'is')
      el.setAttribute('label', 'Spurðu okkur')
      el.setAttribute('greeting', GREETING)
      el.setAttribute('chips', JSON.stringify(CHIPS))
      el.answerer = answer
      root.current.appendChild(el)
      chat.current = el
    }).catch(() => { /* the page works without it; the phone is everywhere */ })
    return () => { alive = false; el?.remove(); chat.current = null }
  }, [])
  const openChat = () => { setMenu(false); chat.current?.open?.() }

  /* ── chrome: hide on the way down, show on the way up, colour at the edge ── */
  const chromeRef = useRef<HTMLDivElement>(null)
  const topPlate = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const chrome = chromeRef.current!
    let lastY = window.scrollY
    let raf = 0
    const tick = () => {
      raf = 0
      const y = window.scrollY
      /* the contact bar scrolls away first, then the header docks */
      chrome.style.setProperty('--bar', `${-Math.min(y, 38)}px`)
      chrome.dataset.solid = y > 60 ? '1' : '0'
      const heroFrame = root.current?.querySelector<HTMLElement>('.bb-hero .hframe')
      if (root.current) root.current.dataset.sticky = heroFrame && heroFrame.getBoundingClientRect().bottom <= 0 ? '1' : '0'
      if (!document.documentElement.classList.contains('bb-menu')) {
        if (y > 320 && y > lastY + 4) chrome.dataset.hide = '1'
        else if (y < lastY - 4 || y <= 320) chrome.dataset.hide = '0'
      }
      lastY = y
      /* Spyker's header: the dark layer is clipped to exactly the dark band
         under it, so the colour changes at the section edge, not at a line */
      const plate = topPlate.current
      if (!plate) return
      const band = plate.getBoundingClientRect()
      let a = Infinity, b = -Infinity
      root.current?.querySelectorAll<HTMLElement>('[data-tone="dark"]').forEach((d) => {
        const r = d.getBoundingClientRect()
        const t = Math.max(r.top, band.top), bt = Math.min(r.bottom, band.bottom)
        if (bt > t && r.width > window.innerWidth * 0.6) { a = Math.min(a, t - band.top); b = Math.max(b, bt - band.top) }
      })
      plate.style.clipPath = a === Infinity ? 'inset(0 0 100% 0)' : `inset(${a.toFixed(1)}px 0 ${(band.height - b).toFixed(1)}px 0)`
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(tick) }
    tick()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    const iv = window.setInterval(on, 250) // the hero scale moves the edge without a scroll event
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); window.clearInterval(iv); cancelAnimationFrame(raf) }
  }, [])

  /* menu: lock scroll, Esc closes, D14 motion */
  const menuRef = useRef<HTMLDivElement>(null)
  const menuViaKey = useRef(false)
  useEffect(() => {
    const html = document.documentElement
    html.classList.toggle('bb-menu', menu)
    if (!menu) return
    pageLenis?.stop()
    const opener = document.activeElement as HTMLElement | null
    const bg = root.current ? [...root.current.children].filter((c) => !c.classList.contains('bb-menu-panel') && c.tagName !== 'STYLE') as HTMLElement[] : []
    bg.forEach((c) => c.setAttribute('inert', ''))
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false) }
    document.addEventListener('keydown', onKey)
    const panel = menuRef.current
    /* a tap or click lands on the panel itself, only the keyboard goes to the first item (_tools/focus-guard) */
    ;(menuViaKey.current ? panel?.querySelector<HTMLElement>('a,button') : panel)?.focus({ preventScroll: true })
    if (panel && !still()) {
      gsap.fromTo(panel, { yPercent: -100 }, { yPercent: 0, duration: 0.8, ease: 'bb' })
      gsap.fromTo(panel.querySelectorAll('[data-mi]'), { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.07, delay: 0.3, ease: 'bb' })
    }
    return () => { document.removeEventListener('keydown', onKey); pageLenis?.start(); html.classList.remove('bb-menu'); bg.forEach((c) => c.removeAttribute('inert')); opener?.focus?.() }
  }, [menu])

  /* ── motion ─────────────────────────────────────────────────────────── */
  useLayoutEffect(() => {
    const el = root.current!
    const reduce = still()
    let lenis: Lenis | null = null
    const onTick = (t: number) => lenis?.raf(t * 1000)
    if (!reduce && window.matchMedia('(pointer: fine)').matches) {
      lenis = !isTouch() ? new Lenis({ lerp: 0.125, anchors: true, smoothWheel: true }) : null
      pageLenis = lenis
      lenis?.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(onTick)
      gsap.ticker.lagSmoothing(0)
    }

    /* SplitText measures lines when it runs. Before Host Grotesk has loaded it
       measures the narrower fallback, and the stored lines rewrap into orphans once
       the real font arrives. So the scroll motion is built after the fonts. */
    let ctx: gsap.Context | null = null
    let alive = true
    const build = () => { if (!alive) return; ctx = gsap.context(() => {
      if (reduce) return
      const desk = window.matchMedia('(min-width: 900px)').matches

      /* D4 · titles: masked characters, .8s, .018 stagger, by position */
      el.querySelectorAll<HTMLElement>('[data-chars]').forEach((t) => {
        if (t.closest('.bb-hero')) return
        const s = new SplitText(t, { type: 'chars,words', charsClass: 'ch', wordsClass: 'wd', mask: 'chars' })
        gsap.fromTo(s.chars, { yPercent: 100 }, {
          yPercent: 0, ease: 'bb', duration: 0.8, stagger: 0.018,
          scrollTrigger: { trigger: t, start: 'top 100%', end: 'top 86%', scrub: true },
        })
      })
      /* D5 · body: lines fade, .05 apart */
      el.querySelectorAll<HTMLElement>('[data-lines]').forEach((t) => {
        const s = new SplitText(t, { type: 'lines', linesClass: 'ln' })
        gsap.fromTo(s.lines, { autoAlpha: 0, y: 14 }, {
          autoAlpha: 1, y: 0, ease: 'bb', duration: 0.8, stagger: 0.05,
          scrollTrigger: { trigger: t, start: 'top 100%', end: 'top 84%', scrub: true },
        })
      })
      el.querySelectorAll<HTMLElement>('[data-fade]').forEach((t) => {
        if (t.closest('.bb-hero')) return
        gsap.fromTo(t, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, ease: 'none', scrollTrigger: { trigger: t, start: 'top 100%', end: 'top 84%', scrub: true } })
      })
      /* D6 · media: clip from the centre at .6 scale, picture 1.1 → 1 */
      el.querySelectorAll<HTMLElement>('[data-media]').forEach((f) => {
        const img = f.querySelector('img')
        const tl = gsap.timeline({ scrollTrigger: { trigger: f, start: 'top 100%', end: 'top 70%', scrub: true } })
        tl.fromTo(f, { clipPath: 'inset(20% 20% 20% 20%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'bb', duration: 0.9 }, 0)
        if (img) tl.fromTo(img, { scale: 1.1 }, { scale: 1, ease: 'bb', duration: 0.9 }, 0)
      })
      /* D8 · inner parallax, 8% of the oversized layer */
      el.querySelectorAll<HTMLElement>('[data-par]').forEach((p) => {
        if (p.closest('.bb-hero')) return
        gsap.fromTo(p, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: p.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
      /* D9 · collage drift, per aspect ratio in px (Spyker's table) */
      if (desk) el.querySelectorAll<HTMLElement>('[data-drift]').forEach((d) => {
        const [a, b] = d.dataset.drift!.split(',').map(Number)
        gsap.fromTo(d, { y: a }, { y: b, ease: 'none', scrollTrigger: { trigger: d, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
      /* D7 · items: scale .85 + fade, .08 apart */
      el.querySelectorAll<HTMLElement>('[data-items]').forEach((g) => {
        gsap.fromTo(g.children, { scale: 0.85, autoAlpha: 0 }, {
          scale: 1, autoAlpha: 1, ease: 'bb', duration: 0.8, stagger: 0.08,
          scrollTrigger: { trigger: g, start: 'top 100%', end: 'top 84%', scrub: true },
        })
      })
      /* D12 · buttons open from the middle */
      el.querySelectorAll<HTMLElement>('[data-btn]').forEach((b) => {
        if (b.closest('.bb-hero,.bb-chrome,.bb-sticky,.bb-menu-panel')) return
        gsap.fromTo(b, { clipPath: 'inset(0 50% 0 50%)' }, { clipPath: 'inset(0 0% 0 0%)', ease: 'bb', scrollTrigger: { trigger: b, start: 'top 99%', end: 'top 84%', scrub: true } })
      })

      /* P5 · the price rolls in with the scroll (position-tied, like every other reveal) */
      el.querySelectorAll<HTMLElement>('[data-roll="scroll"]').forEach((n) => {
        gsap.fromTo(n.querySelectorAll('.dr'), { yPercent: (_i: number, t: Element) => (Number((t as HTMLElement).dataset.d) + 10) * 5 }, {
          yPercent: 0, ease: 'bb', stagger: 0.07, duration: 1,
          scrollTrigger: { trigger: n, start: 'top 90%', end: 'top 40%', scrub: 0.5 },
        })
      })
      /* P5 · the figures count up to their value */
      el.querySelectorAll<HTMLElement>('[data-count]').forEach((n) => {
        const end = Number(n.dataset.count), dec = Number(n.dataset.dec ?? 0)
        const fmt = (v: number) => (dec ? v.toFixed(dec).replace('.', ',') : String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'))
        const o = { v: 0 }
        n.textContent = fmt(0)
        gsap.to(o, { v: end, ease: 'none', onUpdate: () => { n.textContent = fmt(o.v) }, scrollTrigger: { trigger: n, start: 'top 94%', end: 'top 58%', scrub: 0.4 } })
      })
      /* P5 · the wide picture pans sideways as it passes, on top of the vertical drift */
      el.querySelectorAll<HTMLElement>('[data-pan]').forEach((n) => {
        gsap.fromTo(n, { xPercent: -4 }, { xPercent: 4, ease: 'none', scrollTrigger: { trigger: n.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
      })

      /* D3 · hero: picture drifts 16%, the whole frame recedes to .8 */
      const hero = el.querySelector<HTMLElement>('.bb-hero')!
      const frame = hero.querySelector<HTMLElement>('.hframe')!
      gsap.fromTo(hero.querySelector('.hpar'), { yPercent: 0 }, { yPercent: 16, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.15 } })
      gsap.fromTo(frame, { scale: 1 }, { scale: 0.8, ease: 'none', transformOrigin: 'center center', scrollTrigger: { trigger: hero, start: '40% top', end: 'bottom top', scrub: 0.15 } })

      /* D10 · statement band: inset(10%) → 0 over the first 40% of the
         viewport, held, then back to 10% over the last 60% of its height */
      const band = el.querySelector<HTMLElement>('.bb-statement')!
      const m = 10
      const st = { inset: m }
      const set = () => { band.style.clipPath = `inset(${st.inset}% round ${st.inset > 0.5 ? 8 : 0}px)` }
      set()
      const q = gsap.quickTo(st, 'inset', { duration: 0.15, ease: 'none', onUpdate: set })
      ScrollTrigger.create({
        trigger: band, start: 'top bottom', end: 'bottom top',
        onUpdate: (s) => {
          const y = s.scroll(), h = band.offsetHeight
          const a = s.start + 0.4 * window.innerHeight, b = s.end - 0.6 * h
          const v = y <= a ? gsap.utils.mapRange(s.start, a, m, 0, y) : y >= b ? gsap.utils.mapRange(b, s.end, 0, m, y) : 0
          q(gsap.utils.clamp(0, m, v))
        },
      })

      /* D11 · heritage float: each picture y .45s → -s, text .35m → -m */
      const her = el.querySelector<HTMLElement>('.bb-heritage')!
      her.querySelectorAll<HTMLElement>('[data-float]').forEach((f) => {
        const s = Number(f.dataset.float) * (desk ? 1 : 0.4)
        gsap.fromTo(f, { y: 0.45 * s }, { y: -s, ease: 'none', scrollTrigger: { trigger: her, start: 'top bottom', end: 'bottom top', scrub: 0.55, invalidateOnRefresh: true } })
      })
      const mm = desk ? 72 : 28
      gsap.fromTo(her.querySelector('.hcopy'), { y: 0.35 * mm }, { y: -mm, ease: 'none', scrollTrigger: { trigger: her, start: 'top bottom', end: 'bottom top', scrub: 0.55 } })
    }, el); ScrollTrigger.refresh() }
    if (!document.fonts || document.fonts.status === 'loaded') build()
    else document.fonts.ready.then(build)

    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => {
      window.removeEventListener('load', refresh)
      alive = false
      ctx?.revert()
      gsap.ticker.remove(onTick)
      lenis?.destroy()
      pageLenis = null
    }
  }, [])

  /* D2 · loader, then the hero intro. The plate lifts only once the fonts are ready and the hero picture is
     decoded, so the page opens on a finished frame. Timed: it is the page opening, not a scroll reveal. */
  const loaderRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = root.current!
    const hero = el.querySelector<HTMLElement>('.bb-hero')!
    const chrome = el.querySelector<HTMLElement>('.bb-chrome')!
    if (still()) return
    const h1 = hero.querySelector<HTMLElement>('[data-chars]')!
    const split = new SplitText(h1, { type: 'chars,words', charsClass: 'ch', wordsClass: 'wd', mask: 'chars' })
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'bb' } })
    tl.fromTo(hero.querySelector('.hpic'), { scale: 1.12 }, { scale: 1, duration: 1.6 }, 0)
      .fromTo(hero.querySelectorAll('[data-fade]'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.1)
      .fromTo(split.chars, { yPercent: 100 }, { yPercent: 0, duration: 0.8, stagger: 0.018 }, 0.15)
      .fromTo(hero.querySelector('.lede'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.55)
      .fromTo(hero.querySelectorAll('.hprice .dr'), { yPercent: (_i: number, t: Element) => (Number((t as HTMLElement).dataset.d) + 10) * 5 }, { yPercent: 0, duration: 1.5, stagger: 0.06 }, 0.5)
      .fromTo(hero.querySelectorAll('[data-btn]'), { clipPath: 'inset(0 50% 0 50%)' }, { clipPath: 'inset(0 0% 0 0%)', duration: 0.7, stagger: 0.08 }, 0.75)
      .fromTo(hero.querySelector('.hmeta'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 1)
      .fromTo(chrome, { '--iy': '-26px', autoAlpha: 0 }, { '--iy': '0px', autoAlpha: 1, duration: 0.9, clearProps: 'opacity,visibility' }, 0.35)

    const ld = loaderRef.current
    const live: gsap.core.Animation[] = []
    let alive = true
    if (ld) {
      pageLenis?.stop()
      const mk = ld.querySelector<HTMLElement>('.mk img')!
      const num = ld.querySelector<HTMLElement>('.pct .n')!
      const bar = ld.querySelector<HTMLElement>('.bar i')!
      const prog = { v: 0 }
      const paint = () => { num.textContent = String(Math.round(prog.v)).padStart(2, '0'); bar.style.transform = `scaleX(${prog.v / 100})` }
      const pic = hero.querySelector<HTMLImageElement>('img.hpic')
      const guard = (p: Promise<unknown>, ms: number) => Promise.race([p, new Promise((r) => window.setTimeout(r, ms))])
      const gate = Promise.all([
        guard(document.fonts?.ready ?? Promise.resolve(), 3000),
        guard(pic?.decode?.().catch(() => undefined) ?? Promise.resolve(), 3500),
        new Promise((r) => window.setTimeout(r, 1700)),
      ])
      live.push(
        gsap.timeline({ defaults: { ease: 'bb' } })
          .fromTo(mk, { clipPath: 'inset(0 50% 0 50%)' }, { clipPath: 'inset(0 0% 0 0%)', duration: 0.7 })
          .fromTo(ld.querySelectorAll('.ld-fade'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, 0.35),
        gsap.to(prog, { v: 86, duration: 1.6, ease: 'power2.out', onUpdate: paint }),
      )
      gate.then(() => {
        if (!alive) return
        live.push(
          gsap.to(prog, { v: 100, duration: 0.5, ease: 'power2.inOut', onUpdate: paint, onComplete: () => {
            if (!alive) return
            live.push(gsap.timeline({ defaults: { ease: 'bb' }, onComplete: () => { pageLenis?.start(); try { sessionStorage.setItem(SEEN, '1') } catch { /* private mode */ } setLoader(false) } })
              .to(ld.querySelectorAll('.mk, .ld-foot'), { autoAlpha: 0, y: -8, duration: 0.4, ease: 'power1.out' }, 0)
              .to(ld, { yPercent: -100, duration: 0.9 }, 0.2)
              .add(() => { tl.play() }, 0.38))
          } }),
        )
      })
    } else tl.play()
    return () => { alive = false; live.forEach((a) => a.kill()); tl.kill(); split.revert() }
  }, [])

  /* ── carousels: arrows + mouse drag with a click guard ── */
  const railRef = useRef<HTMLDivElement>(null)
  const usedRef = useRef<HTMLDivElement>(null)
  const galRef = useRef<HTMLDivElement>(null)
  const [railEdge, setRailEdge] = useState({ a: true, b: false })
  const [usedEdge, setUsedEdge] = useState({ a: true, b: false })
  const [galEdge, setGalEdge] = useState({ a: true, b: false })
  useEffect(() => {
    const wire = (r: HTMLDivElement | null, set: (v: { a: boolean; b: boolean }) => void) => {
      if (!r) return () => {}
      const upd = () => set({ a: r.scrollLeft < 8, b: r.scrollLeft + r.clientWidth > r.scrollWidth - 8 })
      upd()
      let down = false, x0 = 0, s0 = 0, moved = false
      const pd = (e: PointerEvent) => { if (e.pointerType !== 'mouse' || e.button !== 0) return; down = true; moved = false; x0 = e.clientX; s0 = r.scrollLeft }
      const pm = (e: PointerEvent) => { if (!down) return; const dx = e.clientX - x0; if (Math.abs(dx) > 6) { moved = true; r.classList.add('drag') } r.scrollLeft = s0 - dx }
      const pu = () => { down = false; r.classList.remove('drag') }
      const ck = (e: MouseEvent) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false } }
      r.addEventListener('scroll', upd, { passive: true })
      r.addEventListener('pointerdown', pd)
      window.addEventListener('pointermove', pm)
      window.addEventListener('pointerup', pu)
      r.addEventListener('click', ck, true)
      window.addEventListener('resize', upd)
      return () => { r.removeEventListener('scroll', upd); r.removeEventListener('pointerdown', pd); window.removeEventListener('pointermove', pm); window.removeEventListener('pointerup', pu); r.removeEventListener('click', ck, true); window.removeEventListener('resize', upd) }
    }
    const u1 = wire(railRef.current, setRailEdge)
    const u2 = wire(usedRef.current, setUsedEdge)
    const u3 = wire(galRef.current, setGalEdge)
    return () => { u1(); u2(); u3() }
  }, [])
  const step = (r: HTMLDivElement | null, dir: 1 | -1) => {
    if (!r) return
    const card = r.querySelector<HTMLElement>('[data-card]')
    const w = card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(r).columnGap || '16') : r.clientWidth * 0.8
    r.scrollBy({ left: dir * w, behavior: still() ? 'auto' : 'smooth' })
  }

  /* ── the signature: Jeep and RAM | Leapmotor, one divider, one house ── */
  const splitRef = useRef<HTMLElement>(null)
  const [pos, setPos] = useState(50)
  const [copySide, setCopySide] = useState<'both' | 'jr' | 'lp'>('both')
  const target = useRef(50)
  const cur = useRef(50)
  const toRef = useRef<(v: number) => void>(() => {})
  useEffect(() => {
    const s = splitRef.current
    if (!s) return
    let raf = 0
    let seen = false
    let visibleCopy: 'both' | 'jr' | 'lp' = 'both'
    const apply = (v: number) => {
      s.style.setProperty('--x', `${v.toFixed(2)}%`)
      const next = v <= 30 ? 'lp' : v >= 70 ? 'jr' : 'both'
      if (next !== visibleCopy) { visibleCopy = next; setCopySide(next) }
    }
    const loop = () => {
      raf = 0
      cur.current += (target.current - cur.current) * (still() ? 1 : 0.1)
      apply(cur.current)
      if (Math.abs(target.current - cur.current) > 0.05) raf = requestAnimationFrame(loop)
      else { cur.current = target.current; apply(cur.current); setPos(Math.round(cur.current)) }
    }
    const to = (v: number) => { target.current = Math.min(86, Math.max(14, v)); if (!raf) raf = requestAnimationFrame(loop) }
    toRef.current = to
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    let dragging = false
    let capture: { el: HTMLElement; id: number } | null = null
    const xOf = (e: PointerEvent) => { const r = s.getBoundingClientRect(); return ((e.clientX - r.left) / r.width) * 100 }
    const move = (e: PointerEvent) => { if ((fine && e.pointerType === 'mouse') || dragging) to(xOf(e)) }
    const leave = (e: PointerEvent) => { if (fine && e.pointerType === 'mouse') to(50) }
    const down = (e: PointerEvent) => {
      const handle = (e.target as Element).closest<HTMLElement>('.handle')
      if (handle) { dragging = true; capture = { el: handle, id: e.pointerId }; handle.setPointerCapture(e.pointerId) }
    }
    const up = () => {
      dragging = false
      if (capture?.el.hasPointerCapture(capture.id)) capture.el.releasePointerCapture(capture.id)
      capture = null
    }
    s.addEventListener('pointermove', move)
    s.addEventListener('pointerleave', leave)
    s.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    /* on first sight the divider sweeps across once, so a visitor sees there are two sides */
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting && !seen) {
        seen = true
        if (!still()) { cur.current = 18; target.current = 18; apply(18); window.setTimeout(() => to(50), 380) }
      }
    }, { threshold: 0.45 })
    io.observe(s)
    apply(50)
    return () => { up(); s.removeEventListener('pointermove', move); s.removeEventListener('pointerleave', leave); s.removeEventListener('pointerdown', down); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); io.disconnect(); cancelAnimationFrame(raf) }
  }, [])
  const splitTo = (v: number) => toRef.current(v)

  /* a filter change reflows everything below the grid, so every trigger downstream re-measures */
  useEffect(() => {
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 650)
    return () => window.clearTimeout(t)
  }, [filter])

  const shown = MODELS.filter((m) => inFilter(m, filter))
  const salur = openState(DEPTS[0], now)
  const showroom = openState(SHOWROOM, now)
  const wd = now.getUTCDay()
  const todayRow = wd === 1 ? 0 : wd >= 2 && wd <= 4 ? 1 : wd === 5 ? 2 : 3

  return (
    <div ref={root} className={`bb${menu ? ' menu-open' : ''}`} id="efst">
      <style>{CSS}</style>
      <PreviewChrome company={company} />
      <a className="skip" href="#efni">Fara í efni</a>

      {loader && (
        <div className="bb-loader" ref={loaderRef} aria-hidden="true">
          <div className="mk">
            <img src={A('logo-white.svg')} alt="" width={340} height={117} />
            <p className="yr ld-fade">{CONTACT.slogan}</p>
          </div>
          <div className="ld-foot">
            <p className="pct ld-fade"><span className="n">00</span><small>%</small></p>
            <p className="note ld-fade">Polestar 5 er kominn.<br />Frumsýndur í október 2026</p>
          </div>
          <div className="bar"><i /></div>
        </div>
      )}

      {/* ── chrome: contact bar + header (Drivehub), edge-coloured (Spyker) ── */}
      <div className="bb-chrome" ref={chromeRef} data-hide="0" data-solid="0">
        <div className="bar">
          <div className="in">
            <a href={`tel:${CONTACT.tel}`}><Phone size={13} aria-hidden="true" />{CONTACT.phone}</a>
            <a href={`mailto:${CONTACT.email}`} className="hide-s"><Mail size={13} aria-hidden="true" />{CONTACT.email}</a>
            <a href={LINKS.map} target="_blank" rel="noopener" className="hide-s"><MapPin size={13} aria-hidden="true" />{CONTACT.street}, {CONTACT.town}</a>
            <span className={`st${salur.open ? ' on' : ''}`}><i aria-hidden="true" />Söludeild: {salur.text.toLowerCase()}</span>
          </div>
        </div>
        <header className="hdr">
          <div className="plate base">
            <HeaderRow layer="base" focusKey={focusKey} onFocusKey={setFocusKey} onMenu={(k) => { menuViaKey.current = k; setMenu(true) }} />
          </div>
          <div className="plate top" ref={topPlate} aria-hidden="true">
            <HeaderRow layer="top" focusKey={focusKey} onFocusKey={setFocusKey} onMenu={(k) => { menuViaKey.current = k; setMenu(true) }} />
          </div>
        </header>
      </div>

      {/* ── mobile menu ── */}
      {menu && (
        <div className="bb-menu-panel" ref={menuRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Valmynd" data-lenis-prevent="">
          <div className="mtop">
            <img src={A('logo-white.svg')} alt="Brimborg" width={110} height={38} />
            <button type="button" className="mx" onClick={() => setMenu(false)} aria-label="Loka valmynd"><X size={24} strokeWidth={1.6} aria-hidden="true" /></button>
          </div>
          <nav aria-label="Valmynd">
            {[...NAV, { k: 'reynsluakstur', label: 'Reynsluakstur' }].map((n) => (
              <a key={n.k} href={`#${n.k}`} data-mi="" onClick={(e) => { e.preventDefault(); setMenu(false); window.setTimeout(() => goTo(n.k), 60) }}>{n.label}</a>
            ))}
          </nav>
          <div className="mfoot" data-mi="">
            <a href={`tel:${CONTACT.tel}`}><Phone size={18} aria-hidden="true" />{CONTACT.phone}</a>
            <button type="button" onClick={openChat}><MessageCircle size={16} aria-hidden="true" />Spyrja aðstoðarmanninn</button>
            <p>Söludeildir eru opnar virka daga og lokaðar um helgar</p>
          </div>
        </div>
      )}

      <main id="efni">
        {/* ── 1 · hero: Polestar 5 ── */}
        <section className="bb-hero" aria-labelledby="h-hero">
          <div className="hframe" data-tone="dark">
            <div className="hpar"><Pic p={IMG.hero} sizes="100vw" eager className="hpic" /></div>
            <div className="shade" aria-hidden="true" />
            <div className="copy">
              <Eyebrow dot={false}>Frumsýndur á Íslandi í október 2026</Eyebrow>
              <h1 id="h-hero" data-chars=""><span>Polestar 5</span> <span>er kominn.</span></h1>
              <p className="lede">Allt að 650 kW og til afgreiðslu strax í Polestar Reykjavík á Bíldshöfða 6.</p>
              <div className="hprice" data-fade="">
                <span className="hl"><i aria-hidden="true" />{P5.delivery}</span>
                <Digits value="21.990.000" unit="kr." />
              </div>
              <div className="ctas">
                <Btn href="#polestar5" label="Skoða Polestar 5" tone="light" />
                <Btn href="#reynsluakstur" label="Reynsluakstur" tone="ghost" onClick={() => setCar('polestar5')} />
              </div>
            </div>
            <p className="hmeta">{P5.name} · {P5.colour}</p>
          </div>
        </section>

        {/* ── 2 · Polestar 5: the price, the lease, the car, the showroom ── */}
        <section className="bb-p5" id="polestar5" data-tone="dark" aria-labelledby="h-p5">
          <div className="wrap">
            <div className="p5-head">
              <div>
                <Eyebrow>Frumsýndur á Íslandi · október 2026</Eyebrow>
                <h2 id="h-p5" data-chars="">Polestar 5</h2>
              </div>
              <p className="p5-lede" data-lines="">Polestar 5 Performance í litnum {P5.colour} er kominn til Brimborgar og bíður í Polestar Reykjavík. Hér er verðið, leigan og salurinn þar sem hægt er að sjá hann og prófa.</p>
            </div>
            <div className="p5-price">
              <span className="pl">Verð</span>
              <Digits value="21.990.000" unit="kr." roll="scroll" />
              <div className="p5-tags" data-items="">
                <span className="on"><i aria-hidden="true" />{P5.delivery}</span>
                <span>{P5.stock}</span>
                <span>{P5.colour}</span>
                <span>{P5.interior}</span>
              </div>
            </div>
          </div>

          <figure className="wrap p5-hero">
            <div className="frame p5img" data-media="">
              <div className="par" data-par="" data-pan=""><Pic p={IMG.p5wide} sizes="(min-width: 1440px) 1344px, 96vw" /></div>
            </div>
            <figcaption>Polestar 5 á fjallvegi. Mynd: Polestar.</figcaption>
          </figure>

          <div className="wrap p5-stats" data-items="">
            <div className="st4">
              <p className="big"><span data-count="791640">791.640</span><small>kr.</small></p>
              <p className="lb">Á mánuði í langtímaleigu</p>
              <p className="sc">36 mánuðir, samkvæmt skrá Brimborgar</p>
            </div>
            {P5.stats.map((s) => (
              <div key={s.unit} className="st4">
                <p className="big"><span data-count={s.v} data-dec={s.dec}>{s.v.toFixed(s.dec).replace('.', ',')}</span><small>{s.unit}</small></p>
                <p className="lb">{s.label}</p>
                <p className="sc">{s.src}</p>
              </div>
            ))}
          </div>

          <div className="p5-gal">
            <div className="wrap head">
              <div>
                <Eyebrow>Polestar 5</Eyebrow>
                <h3 data-chars="">Smáatriðin</h3>
              </div>
              <div className="arrows">
                <button type="button" onClick={() => step(galRef.current, -1)} disabled={galEdge.a} aria-label="Fyrri myndir"><ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" /></button>
                <button type="button" onClick={() => step(galRef.current, 1)} disabled={galEdge.b} aria-label="Næstu myndir"><ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" /></button>
              </div>
            </div>
            <div className="rail p5-rail" ref={galRef} role="list">
              {P5_GALLERY.map((g) => (
                <figure key={g.cap} className="pc" role="listitem" data-card="" style={{ aspectRatio: `${g.img.w} / ${g.img.h}` }}>
                  <Frame p={g.img} sizes="(min-width: 900px) 40vw, 76vw" />
                  <figcaption className="cap">{g.cap}</figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="wrap p5-show">
            <div className="sh-stage">
            <figure className="sh-fig">
              <Frame p={IMG.showroom} sizes="(min-width: 1440px) 1344px, 96vw" pos="50% 60%" />
            </figure>
            <div className="sh-card" data-fade="">
              <Eyebrow>Sýningarsalur</Eyebrow>
              <h3>{SHOWROOM.name}</h3>
              <p className="ln">{SHOWROOM.line}</p>
              <address><a href={LINKS.map} target="_blank" rel="noopener">{SHOWROOM.street}, {SHOWROOM.town}</a></address>
              <dl>{SHOWROOM.hours.map((h, i) => <div key={h.label} className={i === todayRow ? 'today' : undefined}><dt>{h.label}</dt><dd>{h.time}</dd></div>)}</dl>
              <span className={`st${showroom.open ? ' on' : ''}`}><i aria-hidden="true" />{showroom.text}</span>
              <div className="ctas">
                <Btn href="#reynsluakstur" label="Bóka reynsluakstur" tone="light" onClick={() => setCar('polestar5')} />
                <Btn href={LINKS.polestarSpace} ext label="Um salinn" tone="ghost" icon={<ArrowUpRight size={15} aria-hidden="true" />} />
              </div>
              <a className="tel" href={`tel:${SHOWROOM.tel}`}><Phone size={16} aria-hidden="true" />{SHOWROOM.phone}</a>
            </div>
            </div>
            <p className="p5-fine">Sala, reynsluakstur og afhending: {SHOWROOM.services.join(', ').toLowerCase()}. Verð, leiga og afhending af nyirbilar.brimborg.is, afl og hröðun af polestar.com, 31. október 2026.</p>
          </div>
        </section>

        {/* ── 3 · browse by type (Drivehub) ── */}
        <section className="bb-cats" id="flokkar" aria-labelledby="h-cats">
          <div className="wrap head">
            <div>
              <Eyebrow>Flokkar</Eyebrow>
              <h2 id="h-cats" data-chars="">Skoðaðu eftir flokki</h2>
            </div>
            <div className="arrows">
              <button type="button" onClick={() => step(railRef.current, -1)} disabled={railEdge.a} aria-label="Fyrri flokkar"><ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" /></button>
              <button type="button" onClick={() => step(railRef.current, 1)} disabled={railEdge.b} aria-label="Næstu flokkar"><ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" /></button>
            </div>
          </div>
          <div className="rail" ref={railRef} role="list">
            {CATEGORIES.map((c) => (
              <a key={c.key} className="cat" role="listitem" data-card="" href={c.href}
                onClick={(e) => { e.preventDefault(); const f = CAT_FILTER[c.key]; if (f) setFilter(f); goTo(c.href.slice(1)) }}>
                <Frame p={c.img} sizes="(min-width: 900px) 30vw, 78vw" className="cph" pos={c.pos} />
                <span className="cshade" aria-hidden="true" />
                <span className="clab">{c.label}</span>
                <span className="cgo" aria-hidden="true"><ArrowUpRight size={17} strokeWidth={1.6} /></span>
              </a>
            ))}
          </div>
        </section>

        {/* ── 4 · the signature: electric | plug-in hybrid, one house ── */}
        <section className="bb-split" id="merkin" ref={splitRef} data-tone="dark" aria-labelledby="h-split">
          <div className="side lp">
            <Pic p={IMG.splitPhev} sizes="100vw" className="sbg" />
            <div className="sshade" aria-hidden="true" />
          </div>
          <div className="side jr">
            <Pic p={IMG.splitEv} sizes="100vw" className="sbg" />
            <div className="sshade" aria-hidden="true" />
          </div>
          <div className="scopy">
            <div className="sbody jr" hidden={copySide === 'lp'} aria-hidden={copySide === 'lp'}>
              <p className="sname" translate="no">Rafmagn</p>
              <p className="ssub">Polestar, Volvo, Ford og Peugeot. Rafbílar frá 4.380.000 kr. með 400.000 kr. rafbílastyrk.</p>
              <a className="slink" href={LINKS.bev} tabIndex={copySide === 'lp' ? -1 : undefined} target="_blank" rel="noopener">Allir rafbílar <ArrowUpRight size={15} aria-hidden="true" /></a>
            </div>
            <div className="sbody lp" hidden={copySide === 'jr'} aria-hidden={copySide === 'jr'}>
              <p className="sname" translate="no">Tengiltvinn</p>
              <p className="ssub">Mazda CX-60 frá 9.710.000 kr. og Ford Ranger Wildtrak frá 14.490.000 kr.</p>
              <a className="slink" href={LINKS.phev} tabIndex={copySide === 'jr' ? -1 : undefined} target="_blank" rel="noopener">Tengiltvinnbílar <ArrowUpRight size={15} aria-hidden="true" /></a>
            </div>
          </div>
          <div className="stitle">
            <Eyebrow dot={false}>Nýir bílar hjá Brimborg</Eyebrow>
            <h2 id="h-split" data-chars="">Rafmagn eða tengiltvinn.</h2>
          </div>
          <div className="divider" aria-hidden="true" />
          <button type="button" className="handle" role="slider" aria-label="Rafmagn eða tengiltvinn: dragðu til að bera saman"
            aria-valuemin={14} aria-valuemax={86} aria-valuenow={pos} aria-valuetext={pos >= 50 ? `Rafmagn ${pos}%` : `Tengiltvinn ${100 - pos}%`}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); splitTo(target.current - 8) }
              if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); splitTo(target.current + 8) }
              if (e.key === 'Home') { e.preventDefault(); splitTo(14) }
              if (e.key === 'End') { e.preventDefault(); splitTo(86) }
            }}>
            <ArrowLeft size={14} strokeWidth={1.8} aria-hidden="true" /><ArrowRight size={14} strokeWidth={1.8} aria-hidden="true" />
          </button>
          <div className="stabs">
            <button type="button" onClick={() => splitTo(80)}>Rafmagn</button>
            <button type="button" onClick={() => splitTo(20)}>Tengiltvinn</button>
          </div>
        </section>

        {/* ── 5 · featured (Drivehub) ── */}
        <section className="bb-feat" id="urval" aria-labelledby="h-feat">
          <div className="wrap">
            <div className="center">
              <Eyebrow>Nýir bílar</Eyebrow>
              <h2 id="h-feat" data-chars="">Úrval nýrra bíla</h2>
            </div>
            <div className="filters" role="group" aria-label="Sía bíla">
              {FILTERS.map((f) => (
                <button key={f.k} type="button" aria-pressed={filter === f.k} onClick={() => setFilter(f.k)}>{f.label}</button>
              ))}
              {FILTER_NAME[filter] && <button type="button" aria-pressed="true" aria-label={`${FILTER_NAME[filter]}: hreinsa síu`} onClick={() => setFilter('allir')}>{FILTER_NAME[filter]} <X size={13} strokeWidth={2} aria-hidden="true" /></button>}
            </div>
            <motion.ul className="grid" layout role="list">
              <AnimatePresence mode="popLayout" initial={false}>
                {shown.map((m) => (
                  <motion.li key={m.key} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ duration: still() ? 0 : 0.5, ease: [0.625, 0.05, 0, 1] }}>
                    <a className="car" href={m.href} target="_blank" rel="noopener">
                      <div className={`ph${m.studio ? ' studio' : ''}`}><Pic p={m.img} sizes="(min-width: 1100px) 30vw, (min-width: 700px) 46vw, 92vw" /></div>
                      <p className="meta"><span translate="no">{m.brand}</span><span>{m.kind}</span></p>
                      <h3 translate="no">{m.name}</h3>
                      <p className="pr">{m.price ?? 'Leitið til sölumanna'}<ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" /></p>
                      {m.note && <p className="note">{m.note}</p>}
                    </a>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
            <div className="loan">
              <p><strong>Polestar 5 frá {P5.lease} á mánuði</strong> í langtímaleigu í 36 mánuði. Brimborg sýnir leiguverð á bílum á lager og býður bílalán, kaupleigu og rekstrarleigu.</p>
              <a href={LINKS.bilalan} target="_blank" rel="noopener">Bílalán og leiga <ArrowUpRight size={15} aria-hidden="true" /></a>
            </div>
            <p className="fine">Verð af nyirbilar.brimborg.is, 31. október 2026, með vsk. nema annað sé tekið fram. Rafbílastyrkur er 400.000 kr. og kaupandinn sækir um hann hjá Orkusjóði. Nánari upplýsingar um hvern bíl á vef Brimborgar.</p>
          </div>
        </section>

        {/* ── 6 · used cars rail (Spyker news rail) ── */}
        <section className="bb-used" id="notadir" aria-labelledby="h-used">
          <div className="wrap head">
            <div>
              <Eyebrow>Notaðir bílar · Brimborg</Eyebrow>
              <h2 id="h-used" data-chars="">Á söluskrá núna</h2>
            </div>
            <div className="arrows">
              <button type="button" onClick={() => step(usedRef.current, -1)} disabled={usedEdge.a} aria-label="Fyrri bílar"><ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" /></button>
              <button type="button" onClick={() => step(usedRef.current, 1)} disabled={usedEdge.b} aria-label="Næstu bílar"><ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" /></button>
            </div>
          </div>
          <div className="rail" ref={usedRef} role="list">
            {USED.map((u) => (
              <a key={u.key} className="uc" role="listitem" data-card="" href={u.href} target="_blank" rel="noopener">
                <Frame p={u.img} sizes="(min-width: 900px) 24vw, 72vw" ratio="5 / 4" className="uph" />
                <p className="um">{u.year} · {u.km} · {u.fuel}</p>
                <h3 translate="no">{u.name}</h3>
                <p className="up"><span>{u.price}</span></p>
              </a>
            ))}
          </div>
          <div className="wrap ufoot">
            <p>Notaðir bílar eru seldir á Bíldshöfða 6 og 8 og á Akureyri. Sýnishorn af lagerskrá notadir.brimborg.is, 31. október 2026. Myndirnar eru úr sal Brimborgar.</p>
            <Btn href={LINKS.used} ext label="Öll söluskráin" tone="dark" icon={<ArrowUpRight size={15} aria-hidden="true" />} />
          </div>
        </section>

        {/* ── 7 · service collage (Spyker "Pure passion") ── */}
        <section className="bb-serv" id="thjonusta" aria-labelledby="h-serv">
          <div className="wrap collage">
            <div className="intro">
              <Eyebrow>Þjónusta</Eyebrow>
              <h2 id="h-serv" data-chars="">Verkstæði Brimborgar</h2>
              <p data-lines="">Sérhæfð verkstæði fyrir Volvo, Polestar, Ford, Mazda, Opel, Citroën og Peugeot. Á höfuðborgarsvæðinu bókar þú eða breytir tíma beint á vefnum eða í Noona appinu og færð staðfestingu um hæl.</p>
              <dl className="hrs">
                <div><dt>Bíldshöfða 6 og 8</dt><dd><a href={`tel:${DEPTS[2].tel}`}>{DEPTS[2].phone}</a></dd></div>
                <div><dt>Mánudaga til fimmtudaga</dt><dd>07:45–17:00</dd></div>
                <div><dt>Föstudaga</dt><dd>07:45–16:15</dd></div>
              </dl>
              <Btn href={LINKS.verkstaedi} ext label="Panta tíma" tone="dark" />
            </div>
            <figure className="f fa" data-drift="24,-52">
              <Frame p={IMG.fa} sizes="(min-width: 900px) 44vw, 92vw" ratio="3 / 2" />
              <figcaption>Verkstæði og varahlutir fyrir Volvo, Polestar og Ford á Bíldshöfða 6, og fyrir Mazda, Citroën, Peugeot og Opel á Bíldshöfða 8.</figcaption>
            </figure>
            <figure className="f fb" data-drift="-28,44">
              <Frame p={IMG.fb} sizes="(min-width: 900px) 46vw, 92vw" ratio="3 / 2" parallax={false} />
              <figcaption>Verkstæðin taka líka við bílum af sömu tegundum sem Brimborg flytur ekki inn, en þjónustan getur þá verið takmörkuð.</figcaption>
            </figure>
            <a className="f fd sos" href={`tel:${CONTACT.emergencyTel}`} data-drift="32,-40">
              <span className="k">Neyðarsími verkstæðis, virka daga kl. 18–22 og um helgar kl. 10–17</span>
              <span className="v">{CONTACT.emergency}</span>
            </a>
            <figure className="f fc" data-drift="-20,64">
              <Frame p={IMG.fc} sizes="(min-width: 900px) 34vw, 92vw" ratio="16 / 10" />
              <figcaption>Varahlutir fyrir allar sjö tegundirnar á Bíldshöfða 6 og 8. <a href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a></figcaption>
            </figure>
          </div>
        </section>

        {/* ── 8 · statement band, in Brimborg teal: the cars and the charging ── */}
        <section className="bb-statement" id="hledsla" aria-labelledby="h-state">
          <div className="scopy">
            <p className="roman" data-fade="">BÍLORKA · HRAÐHLEÐSLA</p>
            <h2 id="h-state" data-chars=""><span>Rafbíllinn og</span> <span>hleðslan.</span></h2>
            <p data-lines="">Brimborg selur rafbíla frá Polestar, Volvo, Ford, Mazda og Peugeot og rekur hraðhleðslunet fyrir rafknúin ökutæki undir merkinu Bílorka.</p>
            <div className="spk">
              <a href={LINKS.bilorka} target="_blank" rel="noopener"><span>Bílorka</span><span>Hraðhleðslunetið</span><ArrowUpRight size={15} aria-hidden="true" /></a>
              <a href={LINKS.hledslustodvar} target="_blank" rel="noopener"><span>Hleðslustöðvar</span><span>Til sölu</span><ArrowUpRight size={15} aria-hidden="true" /></a>
              <a href={LINKS.styrkur} target="_blank" rel="noopener"><span>Rafbílastyrkur</span><span>400.000 kr. hjá Orkusjóði</span><ArrowUpRight size={15} aria-hidden="true" /></a>
            </div>
          </div>
          <figure className="sfig">
            <Frame p={IMG.statement} sizes="(min-width: 1100px) 1000px, 92vw" ratio="2 / 1" pos="70% 60%" />
            <figcaption>Rafbíll í hleðslu, af forsíðu brimborg.is.</figcaption>
          </figure>
        </section>

        {/* ── 9 · heritage float (Spyker racing heritage) ── */}
        <section className="bb-heritage" id="sagan" aria-labelledby="h-her">
          <div className="fstage">
            <div className="floats" aria-hidden="true">
              <figure className="fl f1" data-float="120"><Pic p={IMG.h1} sizes="22vw" /><figcaption>Citroën e-C4</figcaption></figure>
              <figure className="fl f2" data-float="60"><Pic p={IMG.h2} sizes="18vw" /><figcaption>Polestar Reykjavík á Bíldshöfða 6</figcaption></figure>
              <figure className="fl f3" data-float="160"><Pic p={IMG.h3} sizes="26vw" /><figcaption>Volvo EX90</figcaption></figure>
              <figure className="fl f4" data-float="90"><Pic p={IMG.h4} sizes="20vw" /><figcaption>Ford Explorer Plug-In Hybrid</figcaption></figure>
              <figure className="fl f5" data-float="140"><Pic p={IMG.h5} sizes="22vw" /><figcaption>Polestar 5, frumsýndur 2026</figcaption></figure>
            </div>
            <div className="hcopy">
              <Eyebrow dot={false}>Brimborg ehf.</Eyebrow>
              <h2 id="h-her" data-chars="">Síðan 1964</h2>
              <p data-lines="">Brimborg var stofnað árið 1964 sem sérhæft bílaverkstæði og fagnaði 60 ára afmæli í bílgreininni árið 2024. Í dag er Brimborg umboðsaðili Ford, Volvo, Polestar, Mazda, Citroën, Peugeot og Opel og starfar í Reykjavík, Hafnarfirði, Reykjanesbæ og á Akureyri.</p>
              <Btn href={LINKS.um} ext label="Um Brimborg" tone="line" icon={<ArrowUpRight size={15} aria-hidden="true" />} />
            </div>
          </div>
          <p className="sr">Úr sögunni: {SAGA.map((s) => `${s.y}, ${s.t}`).join('. ')}.</p>
        </section>

        {/* ── 10 · practical ── */}
        <section className="bb-info" id="opid" aria-labelledby="h-info">
          <div className="wrap">
            <div className="head1">
              <Eyebrow>Opnunartímar</Eyebrow>
              <h2 id="h-info" data-chars="">Hvar og hvenær</h2>
              <p className="sub">Venjulegur opnunartími. Hann getur verið annar á almennum frídögum og er lokað um helgar.</p>
            </div>
            <div className="rows">
              {DEPTS.map((d) => {
                const s = openState(d, now)
                return (
                  <article key={d.key} className="r">
                    <h3>{d.name}</h3>
                    <a href={d.map} target="_blank" rel="noopener">{d.street}</a>
                    <a href={`tel:${d.tel}`} className="tel">{d.phone}</a>
                    <dl>{d.hours.map((h) => <div key={h.label}><dt>{h.label}</dt><dd>{h.time}</dd></div>)}{d.note && <p className="dn">{d.note}</p>}</dl>
                    <span className={`st${s.open ? ' on' : ''}`}><i aria-hidden="true" />{s.text}</span>
                  </article>
                )
              })}
              <article className="r em">
                <h3>Neyðarsími verkstæðis</h3>
                <span>Útkall kostar {EMERGENCY.fee}</span>
                <a href={`tel:${CONTACT.emergencyTel}`} className="tel">{CONTACT.emergency}</a>
                <dl>
                  <div><dt>Virka daga utan opnunartíma</dt><dd>{EMERGENCY.weekdays}</dd></div>
                  <div><dt>Helgar og rauða daga</dt><dd>{EMERGENCY.weekends}</dd></div>
                </dl>
              </article>
            </div>
          </div>
        </section>

        {/* ── 11 · test drive (Spyker signup band) ── */}
        <section className="bb-drive" id="reynsluakstur" data-tone="dark" aria-labelledby="h-drive">
          <div className="dbg"><div className="par" data-par=""><Pic p={IMG.drive} sizes="100vw" /></div></div>
          <div className="dshade" aria-hidden="true" />
          <div className="wrap dgrid">
            <div className="dcopy">
              <h2 id="h-drive">Bókaðu reynsluakstur</h2>
              <p>Veldu bíl og sölumaður hefur samband til að finna tíma. Polestar 5 bíður í Polestar Reykjavík á Bíldshöfða 6, sem er opinn virka daga og lokaður um helgar.</p>
              <p className="demo">Í þessari frumgerð er formið ekki tengt. Hringdu í {CONTACT.phone} til að bóka.</p>
            </div>
            <form className="dform" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
              <label><span>Nafn</span><input name="nafn" autoComplete="name" required /></label>
              <label><span>Sími</span><input name="simi" type="tel" inputMode="tel" autoComplete="tel" required /></label>
              <label><span>Bíll</span>
                <select name="bill" value={car} onChange={(e) => setCar(e.target.value)}>
                  <option value="" disabled>Veldu bíl</option>
                  {MODELS.map((m) => <option key={m.key} value={m.key}>{fullName(m)}</option>)}
                </select>
              </label>
              <Btn type="submit" label="Senda beiðni" tone="red" />
              {sent && <p className="done" role="status">Þetta er frumgerð, svo beiðnin var ekki send. Hringdu í {CONTACT.phone} eða skrifaðu á {CONTACT.email}.</p>}
            </form>
          </div>
        </section>
      </main>

      {/* ── footer (Spyker) ── */}
      <footer className="bb-foot">
        <div className="wrap fgrid">
          <div className="fbrand">
            <img src={A('logo.svg')} alt="Brimborg" width={200} height={69} />
            <p>{CONTACT.slogan}</p>
          </div>
          <nav className="fnav" aria-label="Neðst á síðu">
            {NAV.map((n) => <a key={n.k} href={`#${n.k}`} onClick={(e) => { e.preventDefault(); goTo(n.k) }}>{n.label}</a>)}
          </nav>
          <div className="fside">
            <a href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <a href={LINKS.map} target="_blank" rel="noopener">{CONTACT.street}, {CONTACT.town}</a>
          </div>
        </div>
        <div className="wrap flegal">
          <p>{CONTACT.legal} · Kt. {CONTACT.kt} · VSK {CONTACT.vsk}</p>
          <SndrBadge />
        </div>
        <p className="wrap proto">Frumgerð: hugmynd að nýrri forsíðu, ekki vefur Brimborgar. Upplýsingar, verð og myndir eru af brimborg.is, nyirbilar.brimborg.is, notadir.brimborg.is og polestar.com, sótt 31. október 2026. Verð geta breyst án fyrirvara. Myndir af Polestar 5 og Polestar Reykjavík eru frá Polestar. Merkið er endurteiknað eftir merki Brimborgar á vefnum. Aðstoðarmaðurinn er sýnishorn: hann svarar ekki spurningum í frumgerðinni.</p>
      </footer>

      {/* ── mobile sticky CTA ── */}
      <div className="bb-sticky" aria-label="Flýtileiðir">
        <a href={`tel:${CONTACT.tel}`}><Phone size={16} aria-hidden="true" />Hringja</a>
        <a href="#reynsluakstur" onClick={(e) => { e.preventDefault(); goTo('reynsluakstur') }}>Reynsluakstur</a>
        <button type="button" onClick={openChat}><MessageCircle size={16} aria-hidden="true" />Spyrja</button>
      </div>
    </div>
  )
}
