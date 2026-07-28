import { useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import Lenis from 'lenis'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { CSS } from './styles'
import {
  ABOUT_QUOTE, ADDRESS_CORRECT, COMPANY, EMAIL, EMAIL_HREF, FEES, FEE_HEADLINE, FEE_SUB,
  FOUNDING, HERO_INDEXES, IMG, JSON_LD, KENNITALA, LEGAL_NAME, LISTINGS, LISTINGS_LABEL,
  LOGO, EDITORIAL_CARDS, NAV, PHONE_DISPLAY, PHONE_HREF, PRICE_BANDS, SORT_OPTIONS,
  STADUR_FILTERS, STAFF, TOWNS,
  type EditorialCard, type Listing, type SortMode,
} from './data'

gsap.registerPlugin(SplitText, CustomEase)
CustomEase.create('egmOut', '.25,1,.5,1')

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

/* ══════════════════════════════════════════════════════════════════════
   THE SCROLL ENGINE
   One Lenis instance drives smooth scroll. On every Lenis 'scroll' tick we
   read two element rects and write two scrub-driven inline styles directly
   (device 3, the dive-in hero; device 10, the footer aperture close) — both
   genuinely tied to scroll position. Everything else (device 7 reveals,
   device 5 chrome theming) runs off IntersectionObserver, registered
   separately below.
   ══════════════════════════════════════════════════════════════════════ */
function useSceneEngine(heroStackRef: RefObject<HTMLDivElement | null>, closerRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (reduced()) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    const raf = (t: number) => {
      lenis.raf(t)
      requestAnimationFrame(raf)
    }
    const id = requestAnimationFrame(raf)

    const onScroll = () => {
      const vh = window.innerHeight
      const hero = heroStackRef.current
      if (hero) {
        const wrap = hero.closest<HTMLElement>('[data-egm-hero]')
        if (wrap) {
          const r = wrap.getBoundingClientRect()
          const p = Math.max(0, Math.min(1, -r.top / vh))
          hero.style.transform = `scale(${1 + p})`
        }
      }
      const closer = closerRef.current
      if (closer) {
        const r = closer.getBoundingClientRect()
        const p = Math.max(0, Math.min(1, 1 - r.top / vh))
        const mobile = window.innerWidth < 992
        const yInset = mobile ? p * 4 : p * 8
        const xInset = mobile ? p * 32 : p * 22
        closer.style.clipPath = `inset(${yInset}% ${xInset}%)`
        const stage = closer.querySelector<HTMLElement>('[data-egm-closer-stage]')
        if (stage) {
          stage.style.transform = `scale(${0.86 + p * 0.14})`
          stage.style.opacity = `${0.55 + p * 0.45}`
        }
      }
    }
    lenis.on('scroll', onScroll)
    onScroll()

    return () => {
      cancelAnimationFrame(id)
      lenis.off('scroll', onScroll)
      lenis.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

/* ── device 7 — reveal primitives: h / p / line / slide, and only these ──
   h    SplitText chars, rotateY 90 + yPercent 50 → 0            (headings)
   p    masked lines, yPercent 110 → 0, no opacity                (paragraphs)
   line clip-path inset wipe                                      (rules)
   slide skewed polygon wipe + inner counter-scale 1.5             (panels)
   IntersectionObserver-driven, once:true, in-view-on-mount check, a 2s
   failsafe so nothing strands hidden. Reduced motion renders everything
   resolved with no animation at all. */
function useRevealSystem() {
  useEffect(() => {
    const skip = reduced()
    const splitCache = new WeakMap<Element, SplitText>()

    const revealHeading = (el: Element, instant: boolean) => {
      let split = splitCache.get(el)
      if (!split) {
        split = new SplitText(el as HTMLElement, { type: 'words,chars' })
        splitCache.set(el, split)
      }
      if (instant || skip) {
        gsap.set(split.chars, { opacity: 1, rotateY: 0, yPercent: 0 })
        return
      }
      gsap.fromTo(
        split.chars,
        { opacity: 0, rotateY: 90, yPercent: 50, transformOrigin: '50% 100%' },
        { opacity: 1, rotateY: 0, yPercent: 0, duration: 1.2, ease: 'egmOut', stagger: 0.028 },
      )
    }

    const revealPlain = (el: Element, instant: boolean) => {
      el.classList.add(instant || skip ? 'egm-in-instant' : 'egm-in')
    }

    const selector = '[data-egm-split="h"],[data-egm-rv-line],[data-egm-rv-p],[data-egm-rv-slide]'

    if (skip) {
      document.querySelectorAll('[data-egm-split="h"]').forEach((el) => revealHeading(el, true))
      document.querySelectorAll('[data-egm-rv-line],[data-egm-rv-p],[data-egm-rv-slide]').forEach((el) => revealPlain(el, true))
      return
    }

    const targets = Array.from(document.querySelectorAll(selector))
    const fired = new WeakSet<Element>()
    const fire = (el: Element, instant: boolean) => {
      if (fired.has(el)) return
      fired.add(el)
      if (el.getAttribute('data-egm-split') === 'h') revealHeading(el, instant)
      else revealPlain(el, instant)
    }

    const vh = window.innerHeight
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fire(entry.target, false)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )

    targets.forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.top < vh * 0.92 && r.bottom > 0) fire(el, true) // in-view-on-mount: resolve instantly, no flash
      else io.observe(el)
    })

    const failsafe = window.setTimeout(() => {
      targets.forEach((el) => fire(el, true))
    }, 2000)

    return () => {
      io.disconnect()
      window.clearTimeout(failsafe)
    }
  }, [])
}

/* ── device 5 — self-theming fixed chrome ────────────────────────────────
   Each fixed element gets its OWN IntersectionObserver, rootMargin-shifted
   to a 1px line at that element's vertical centre, observing every themed
   section. Whichever section's box currently straddles that line supplies
   the theme. 0.4s CSS colour transition does the rest. */
function useSelfThemingChrome(refs: Array<RefObject<HTMLElement | null>>) {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-egm-theme]'))
    if (!sections.length) return
    const observers: IntersectionObserver[] = []

    refs.forEach((ref) => {
      const el = ref.current
      if (!el) return
      const apply = () => {
        const rect = el.getBoundingClientRect()
        const cy = rect.top + rect.height / 2
        const above = window.innerHeight - cy
        const io = new IntersectionObserver(
          () => {
            let theme = 'light'
            for (const s of sections) {
              const r = s.getBoundingClientRect()
              if (r.top <= cy && r.bottom >= cy) {
                theme = s.dataset.egmTheme || 'light'
                break
              }
            }
            el.classList.toggle('egm-theme-dark', theme === 'dark')
            el.classList.toggle('egm-theme-light', theme !== 'dark')
          },
          { rootMargin: `${-cy}px 0px ${-above}px 0px`, threshold: [0, 0.0001, 1] },
        )
        sections.forEach((s) => io.observe(s))
        observers.push(io)
      }
      apply()
    })

    return () => observers.forEach((o) => o.disconnect())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

/* ── device 3 — hero photo cycle, driven by the same wipe grammar as the
   reveal system's 'slide' primitive (skewed polygon + counter-scale),
   never a fade. Disabled entirely under reduced motion: one static frame. */
function useHeroCycle(count: number) {
  const [active, setActive] = useState(0)
  useEffect(() => {
    if (reduced() || count < 2) return
    const id = window.setInterval(() => setActive((v) => (v + 1) % count), 4200)
    return () => window.clearInterval(id)
  }, [count])
  return active
}

/* ── small building blocks ───────────────────────────────────────────── */

function Rv({
  as: Tag = 'div',
  kind = 'p',
  className = '',
  children,
  id,
}: {
  as?: 'div' | 'section' | 'article' | 'li' | 'span'
  kind?: 'line' | 'p'
  className?: string
  children: React.ReactNode
  id?: string
}) {
  const attr = kind === 'line' ? 'data-egm-rv-line' : 'data-egm-rv-p'
  const base = kind === 'line' ? 'egm-rv-line' : 'egm-rv-p'
  return (
    <Tag id={id} {...{ [attr]: true }} className={`${base} ${className}`}>
      {children}
    </Tag>
  )
}

/** The 'slide' reveal primitive: skewed clip-path wipe + inner counter-scale
 * 1.5, for image panels and monument headlines (device 7). */
function RvSlide({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div data-egm-rv-slide className={`egm-rv-slide ${className}`}>
      <div className="egm-slide-inner">{children}</div>
    </div>
  )
}

function H({ children, id, level = 2, className = '' }: { children: string; id?: string; level?: 2 | 3; className?: string }) {
  const Tag = level === 2 ? 'h2' : 'h3'
  return (
    <Tag id={id} data-egm-split="h" className={`${level === 2 ? 'egm-h2' : 'egm-h3'} ${className}`}>
      {children}
    </Tag>
  )
}

function Frame({ src, alt, ratio, className = '' }: { src: string; alt: string; ratio: string; className?: string }) {
  return (
    <RvSlide className={className}>
      <div style={{ width: '100%', aspectRatio: ratio, overflow: 'hidden', position: 'relative', background: 'var(--egm-stone)' }}>
        <img src={src} alt={alt} loading="lazy" decoding="async" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </RvSlide>
  )
}

/** Simplified currentColor glyph for the fixed self-theming chrome — the
 * real logo (imported as LOGO from data.ts) is a fixed navy PNG on an
 * opaque white plate, so it cannot itself flip colour as the chrome crosses
 * light/dark sections. This mark carries that job; the real logo gets its
 * own full-size, honestly-credited placement in the Saga section below. */
function Mark({ size = 26, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
      <path d="M4 20 L20 6 L36 20" fill="none" stroke={color} strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
      <path d="M9 18 V34 H31 V18" fill="none" stroke={color} strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
      <path d="M16 34 V24 H24 V34" fill="none" stroke={color} strokeWidth="2.4" />
    </svg>
  )
}

type Row = { row: Listing } | { editorial: EditorialCard }

function withEditorial(list: Listing[]): Row[] {
  const out: Row[] = []
  list.forEach((item, i) => {
    out.push({ row: item })
    if (i === 5 && list.length > 7) out.push({ editorial: EDITORIAL_CARDS[0] })
    if (i === 11 && list.length > 13) out.push({ editorial: EDITORIAL_CARDS[1] })
    if (i === 17 && list.length > 19) out.push({ editorial: EDITORIAL_CARDS[2] })
  })
  return out
}

function ListingRow({ l }: { l: Listing }) {
  return (
    <article className="egm-row">
      <div className="egm-row-photo">
        <img src={l.photo} alt={l.photoAlt} loading="lazy" decoding="async" />
      </div>
      <div className="egm-row-main">
        <p className="egm-label" style={{ color: 'var(--egm-mute-ink)' }}>{l.town} · {l.type}</p>
        <p className="egm-h5" style={{ marginTop: 'var(--egm-4)' }}>{l.address}</p>
        <p className="egm-data" style={{ marginTop: 'var(--egm-4)', color: 'var(--egm-soft-ink)', fontSize: '.86rem' }}>
          {l.sqm} m²{l.rooms > 0 ? ` · ${l.rooms} herb.` : ''}
        </p>
      </div>
      <p className={`egm-h4 egm-data egm-row-price ${l.priceValue === null ? 'egm-row-price-offer' : ''}`}>{l.price}</p>
    </article>
  )
}

function EditorialRow({ card }: { card: EditorialCard }) {
  if (card.kind === 'starfsmadur') {
    return (
      <div className="egm-editorial egm-editorial-staff">
        <div className="egm-editorial-photo">
          <img src={card.staff.photo} alt={card.staff.alt} loading="lazy" decoding="async" />
        </div>
        <div>
          <p className="egm-label" style={{ color: 'var(--egm-blue-bright)' }}>{card.tag}</p>
          <p className="egm-h5" style={{ color: 'var(--egm-paper)', marginTop: 'var(--egm-4)' }}>{card.staff.name}</p>
          <a href={card.staff.phoneHref} className="egm-data" style={{ color: 'var(--egm-mute-paper)', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>
            {card.staff.phone}
          </a>
        </div>
      </div>
    )
  }
  return (
    <div className="egm-editorial">
      <p className="egm-label" style={{ color: 'var(--egm-blue-bright)' }}>{card.tag}</p>
      <p className="egm-h5" style={{ color: 'var(--egm-paper)' }}>{card.line}</p>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   DEVICE 2 — the arch aperture preloader, tied to the first hero photo
   actually loading. ≤2.5s, skippable, absent under reduced motion.
   ══════════════════════════════════════════════════════════════════════ */
function Preloader({ heroSrc }: { heroSrc: string }) {
  const [stage, setStage] = useState<'hold' | 'open' | 'exit' | 'gone'>('hold')

  useEffect(() => {
    if (reduced()) {
      setStage('gone')
      return
    }
    let cancelled = false
    const heroImg = new Image()
    heroImg.src = heroSrc
    const ready = Promise.race([
      Promise.all([document.fonts?.ready ?? Promise.resolve(), new Promise((res) => { heroImg.onload = res; heroImg.onerror = res })]),
      new Promise((res) => window.setTimeout(res, 1350)),
    ])
    const openTimer = window.setTimeout(() => { if (!cancelled) setStage('open') }, 90)
    ready.then(() => {
      window.setTimeout(() => { if (!cancelled) setStage('exit') }, 1050)
    })
    return () => {
      cancelled = true
      window.clearTimeout(openTimer)
    }
  }, [heroSrc])

  useEffect(() => {
    if (stage !== 'exit') return
    const t = window.setTimeout(() => setStage('gone'), 700)
    return () => window.clearTimeout(t)
  }, [stage])

  useEffect(() => {
    if (stage === 'hold') document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [stage])

  if (stage === 'gone') return null
  return (
    <div
      aria-hidden="true"
      className={`egm-preloader ${stage === 'open' || stage === 'exit' ? 'egm-preloader-open' : ''} ${stage === 'exit' ? 'egm-preloader-exit' : ''}`}
    >
      <span className="egm-preloader-word">Eignamiðlun Suðurnesja</span>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */

export default function EignamidlunPage() {
  const heroStackRef = useRef<HTMLDivElement>(null)
  const closerRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const [stadur, setStadur] = useState('Öll')
  const [bandIdx, setBandIdx] = useState(0)
  const [sort, setSort] = useState<SortMode>('default')
  const [menu, setMenu] = useState(false)

  const heroListings = useMemo(() => HERO_INDEXES.map((i) => LISTINGS[i]), [])
  const activeHero = useHeroCycle(heroListings.length)

  useSceneEngine(heroStackRef, closerRef)
  useRevealSystem()
  useSelfThemingChrome([brandRef, ctaRef])

  useEffect(() => setThemeColor(COMPANY.accent), [])

  useEffect(() => {
    if (!menu) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [menu])

  const band = PRICE_BANDS[bandIdx]
  const filtered = useMemo(() => {
    let out = LISTINGS.filter((l) => stadur === 'Öll' || l.town === stadur)
    out = out.filter((l) => {
      if (band.min === undefined && band.max === undefined) return true
      if (l.priceValue === null) return false
      if (band.min !== undefined && l.priceValue < band.min) return false
      if (band.max !== undefined && l.priceValue >= band.max) return false
      return true
    })
    if (sort !== 'default') {
      out = [...out].sort((a, b) => {
        if (a.priceValue === null) return 1
        if (b.priceValue === null) return -1
        return sort === 'verd-haekkandi' ? a.priceValue - b.priceValue : b.priceValue - a.priceValue
      })
    }
    return out
  }, [stadur, band, sort])

  const rows = useMemo(() => withEditorial(filtered), [filtered])
  const resetFilters = () => { setStadur('Öll'); setBandIdx(0); setSort('default') }

  return (
    <div className="egm-canvas" lang="is">
      <style>{CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      <PreviewChrome company={COMPANY} />
      <Preloader heroSrc={heroListings[0].photo} />

      {/* ── device 5: self-theming fixed chrome ─────────────────────── */}
      <div ref={brandRef} className="egm-chrome egm-chrome-brand egm-theme-light">
        <Mark size={24} color="var(--egm-blue)" />
        <span className="egm-label" style={{ letterSpacing: '.1em' }}>Eignamiðlun&nbsp;Suðurnesja</span>
      </div>
      <div ref={ctaRef} className="egm-chrome egm-chrome-cta">
        <a href={PHONE_HREF} className="egm-pill">☏ {PHONE_DISPLAY}</a>
      </div>
      <button
        type="button"
        onClick={() => setMenu((v) => !v)}
        aria-expanded={menu}
        aria-controls="egm-menu"
        aria-label={menu ? 'Loka valmynd' : 'Opna valmynd'}
        className="egm-chrome egm-theme-light"
        style={{ right: 'var(--egm-24)', top: 'var(--egm-80)', width: 44, height: 44, display: 'grid', placeItems: 'center', border: '1px solid currentColor', borderRadius: 3, background: 'transparent' }}
      >
        <span aria-hidden="true" style={{ fontFamily: "'EGM Body', sans-serif", fontSize: '1.1rem', fontWeight: 600 }}>{menu ? '×' : '≡'}</span>
      </button>
      {menu && (
        <nav id="egm-menu" aria-label="Valmynd" className="egm-gr-ink" style={{ position: 'fixed', inset: 0, zIndex: 95, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--egm-16)', padding: 'var(--egm-48)' }}>
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setMenu(false)}
              className="egm-h3"
              style={{ color: 'var(--egm-paper)', textDecoration: 'none' }}
            >
              {n.label}
            </a>
          ))}
          <a href={PHONE_HREF} className="egm-label" style={{ color: 'var(--egm-blue-bright)', marginTop: 'var(--egm-24)' }}>☏ {PHONE_DISPLAY}</a>
        </nav>
      )}

      <main id="top">
        {/* ── HERO — device 3: real listing photo cycle + dive-in scrub ─── */}
        <section data-egm-hero data-egm-theme="dark" style={{ position: 'relative', height: '100svh', minHeight: 560, overflow: 'hidden' }} aria-labelledby="egm-h1">
          <div ref={heroStackRef} style={{ position: 'absolute', inset: 0, transformOrigin: '50% 75%', willChange: 'transform' }}>
            {heroListings.map((l, i) => (
              <div key={l.address} className="egm-hero-layer" style={{ zIndex: i === activeHero ? 2 : 1 }}>
                <RvSlide className={i === activeHero ? 'egm-in' : ''}>
                  <div style={{ position: 'absolute', inset: 0 }}>
                    {/* object-position + a small overscan on transform-origin push the
                        source photo's own bottom-left corner (every es.is listing photo
                        carries a baked-in company-logo watermark stamp there, confirmed
                        across the harvested set) out past the visible frame, instead of
                        letting it bleed off the hero edge at full-bleed scale. */}
                    <img
                      src={l.photo}
                      alt={l.photoAlt}
                      aria-hidden={i === activeHero ? undefined : true}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      {...(i === 0 ? { fetchpriority: 'high' } : {})}
                      decoding="async"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '78% 22%', transform: 'scale(1.24)', transformOrigin: '82% 18%' }}
                    />
                  </div>
                </RvSlide>
              </div>
            ))}
            <div style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'linear-gradient(180deg, rgba(19,33,46,.34), rgba(19,33,46,.66) 72%, rgba(19,33,46,.88))' }} />
          </div>
          <div className="egm-container" style={{ position: 'relative', zIndex: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 'var(--egm-64)', color: 'var(--egm-paper)' }}>
            <p className="egm-label" style={{ color: 'var(--egm-paper)', opacity: 0.82, marginBottom: 'var(--egm-16)' }}>Fasteignasala á Suðurnesjum · síðan 1978</p>
            <h1 id="egm-h1" data-egm-split="h" className="egm-h1" style={{ color: 'var(--egm-paper)', margin: 0 }}>
              Heim á&nbsp;Suðurnesjum
            </h1>
            <p className="egm-body" style={{ maxWidth: '38ch', marginTop: 'var(--egm-24)', color: 'var(--egm-soft-paper)' }}>
              Sama fyrirtæki frá 1978, sama gagnsæja gjaldskráin fyrir hvert einasta hús á núverandi söluskrá.
            </p>
            <div aria-hidden="true" className="egm-hero-cap" style={{ marginTop: 'var(--egm-32)' }}>
              <p className="egm-label" style={{ color: 'var(--egm-blue-bright)' }}>{heroListings[activeHero].town} · {heroListings[activeHero].type}</p>
              <p className="egm-h3" style={{ color: 'var(--egm-paper)', marginTop: 'var(--egm-4)' }}>{heroListings[activeHero].address}</p>
              <p className="egm-h4 egm-data" style={{ color: 'var(--egm-blue-bright)', marginTop: 'var(--egm-4)' }}>{heroListings[activeHero].price}</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--egm-12)', marginTop: 'var(--egm-32)' }}>
              <a href="#soluskra" className="egm-btn" style={{ background: 'var(--egm-blue)', color: '#fff' }}>Skoða söluskrá</a>
              <a href="#gjaldskra" className="egm-btn egm-btn-outline" style={{ borderColor: 'rgba(247,241,228,.42)', color: 'var(--egm-paper)' }}>Sjá gjaldskrá</a>
            </div>
          </div>
          <div className="egm-bob" aria-hidden="true" style={{ position: 'absolute', bottom: 'var(--egm-24)', left: '50%', transform: 'translateX(-50%)', zIndex: 4, color: 'var(--egm-paper)', opacity: 0.7 }}>
            <span className="egm-label">Skruna</span>
          </div>
        </section>

        {/* ── FOUNDING — "Síðan 1978" + the real logo, honestly placed ──── */}
        <section id="saga" className="egm-gr-paper" data-egm-theme="light" aria-labelledby="saga-h">
          <div className="egm-container" style={{ padding: 'var(--egm-96) 0' }}>
            <Rv kind="line"><div style={{ height: 1, background: 'var(--egm-hair-ink)', marginBottom: 'var(--egm-32)' }} /></Rv>
            <Rv kind="p">
              <img
                src={LOGO}
                alt="Merki Eignamiðlunar Suðurnesja"
                width={220}
                height={197}
                loading="lazy"
                decoding="async"
                style={{ width: 'calc(200em / var(--egm-ratio))', minWidth: 120, height: 'auto', mixBlendMode: 'multiply' }}
              />
            </Rv>
            <div className="egm-saga-cols" style={{ marginTop: 'var(--egm-48)' }}>
              <div>
                <Rv kind="p"><p className="egm-label" style={{ color: 'var(--egm-blue)' }}>{FOUNDING.date}</p></Rv>
                <H id="saga-h" level={2}>Tollvörður í aukastarfi</H>
              </div>
              <div>
                <Rv kind="p">
                  <p className="egm-body">
                    <span>Eignamiðlun Suðurnesja var stofnuð af {FOUNDING.founders}. {FOUNDING.lede}</span>
                  </p>
                </Rv>
                <Rv kind="p" className="egm-mt">
                  <p className="egm-body" style={{ color: 'var(--egm-soft-ink)', marginTop: 'var(--egm-16)' }}>
                    <span>{FOUNDING.body}</span>
                  </p>
                </Rv>
                <Rv kind="p">
                  <p className="egm-num" style={{ fontSize: 'var(--egm-h2)', marginTop: 'var(--egm-32)', color: 'var(--egm-blue)' }}>{FOUNDING.years} ár</p>
                </Rv>
                <Rv kind="p"><p className="egm-label" style={{ color: 'var(--egm-mute-ink)' }}>á sama landsvæði, án hlés</p></Rv>
              </div>
            </div>
          </div>
        </section>

        {/* ── PILLARS — "Af hverju Eignamiðlun Suðurnesja" ─────────────── */}
        <section className="egm-gr-stone" data-egm-theme="light" aria-labelledby="pillars-h">
          <div className="egm-container" style={{ padding: 'var(--egm-80) 0' }}>
            <Rv kind="p"><H id="pillars-h" level={2}>Af hverju Eignamiðlun Suðurnesja</H></Rv>
            <Rv kind="p" className="egm-mt">
              <p className="egm-body" style={{ maxWidth: '62ch', color: 'var(--egm-soft-ink)' }}>„{ABOUT_QUOTE}“</p>
            </Rv>
            <div style={{ display: 'grid', gap: 'var(--egm-24)', marginTop: 'var(--egm-48)' }} className="egm-pillar-grid">
              {[
                { n: '01', t: 'Staðbundin þekking frá 1978', b: 'Sama fyrirtæki hefur selt hús á Suðurnesjum í 47 ár, óslitið síðan Hannes og Halldóra byrjuðu.' },
                { n: '02', t: 'Gagnsæ gjaldskrá', b: '1,3% söluþóknun og engin lágmarksþóknun, sagt beint út áður en nokkur spyr.' },
                { n: '03', t: 'Engin skuldbinding', b: 'Frítt verðmat, bæði sölu og banka, og ekkert gjald fyrir gagnaöflun eða ljósmyndun.' },
              ].map((p) => (
                <Rv key={p.n} kind="p" as="article">
                  <p className="egm-data" style={{ color: 'var(--egm-blue)', fontSize: '.85rem' }}>{p.n}</p>
                  <h3 className="egm-h5" style={{ marginTop: 'var(--egm-8)' }}>{p.t}</h3>
                  <p className="egm-body" style={{ color: 'var(--egm-soft-ink)', marginTop: 'var(--egm-8)' }}>{p.b}</p>
                </Rv>
              ))}
            </div>
          </div>
        </section>

        {/* ── SÖLUSKRÁ — device 6: real-photo rows + filters + editorial ─── */}
        <section id="soluskra" className="egm-gr-paper" data-egm-theme="light" aria-labelledby="soluskra-h">
          <div className="egm-container" style={{ padding: 'var(--egm-96) 0' }}>
            <Rv kind="p">
              <p className="egm-label" style={{ color: 'var(--egm-blue)' }}>{LISTINGS_LABEL}</p>
              <H id="soluskra-h" level={2}>Söluskráin, öll uppi á borðum</H>
              <p className="egm-body" style={{ color: 'var(--egm-soft-ink)', maxWidth: '58ch', marginTop: 'var(--egm-16)' }}>
                Tuttugu eignir beint af söluskrá Eignamiðlunar Suðurnesja, með raunverulegum myndum af eignunum
                sjálfum, sóttar 28. júlí 2026.
              </p>
            </Rv>

            <Rv kind="p" className="egm-mt">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--egm-16)' }}>
                <div role="group" aria-label="Sía eftir staðsetningu" className="egm-filter-group">
                  {STADUR_FILTERS.map((f) => (
                    <button key={f.value} type="button" className="egm-chip" aria-pressed={stadur === f.value} onClick={() => setStadur(f.value)}>
                      {f.label}
                    </button>
                  ))}
                </div>
                <div role="group" aria-label="Sía eftir verðbili" className="egm-filter-group">
                  {PRICE_BANDS.map((b, i) => (
                    <button key={b.label} type="button" className="egm-chip" aria-pressed={bandIdx === i} onClick={() => setBandIdx(i)}>
                      {b.label}
                    </button>
                  ))}
                </div>
                <div className="egm-filter-group" style={{ justifyContent: 'space-between' }}>
                  <label className="egm-filter-group" style={{ gap: 'var(--egm-8)' }}>
                    <span className="egm-label" style={{ color: 'var(--egm-mute-ink)' }}>Röðun</span>
                    <select className="egm-select" value={sort} onChange={(e) => setSort(e.target.value as SortMode)} aria-label="Raða eftir verði">
                      {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </label>
                  <p className="egm-data" style={{ color: 'var(--egm-mute-ink)', fontSize: '.82rem' }}>
                    {filtered.length} af {LISTINGS.length} eignum
                  </p>
                </div>
              </div>
            </Rv>

            <div className="egm-mt">
              {filtered.length === 0 ? (
                <div className="egm-empty">
                  <p className="egm-body">Engin eign fannst með þessari síu.</p>
                  <button type="button" className="egm-btn egm-btn-outline" style={{ marginTop: 'var(--egm-16)' }} onClick={resetFilters}>
                    Núllstilla síur
                  </button>
                </div>
              ) : (
                <div className="egm-list">
                  {rows.map((r, i) =>
                    'row' in r ? (
                      <Rv key={r.row.address} as="div" kind="p"><ListingRow l={r.row} /></Rv>
                    ) : (
                      <Rv key={`ed-${i}`} as="div" kind="p"><EditorialRow card={r.editorial} /></Rv>
                    ),
                  )}
                  <div style={{ borderTop: '1px solid var(--egm-hair-ink)' }} />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── GJALDSKRÁ MONUMENT — device 8 + device 4 (dome #1) ───────── */}
        <section id="gjaldskra" className="egm-arch egm-gr-ink" data-egm-theme="dark" aria-labelledby="fee-h" style={{ marginTop: 'calc(var(--egm-64) * -1)' }}>
          <div className="egm-container" style={{ padding: 'var(--egm-120) 0 var(--egm-96)' }}>
            {/* centred, narrow: keeps the numeral clear of the arch's still-
                curving corners (see .egm-dome-inner in styles.ts) */}
            <div className="egm-dome-inner">
              <Rv kind="p">
                <p className="egm-label" style={{ color: 'var(--egm-blue-bright)' }}>Gjaldskrá</p>
                <h2 id="fee-h" data-egm-split="h" className="egm-num" style={{ color: 'var(--egm-paper)', marginTop: 'var(--egm-16)' }}>
                  {FEE_HEADLINE}
                </h2>
                <p className="egm-h4" style={{ color: 'var(--egm-mute-paper)', marginTop: 'var(--egm-8)', fontWeight: 500 }}>{FEE_SUB}</p>
              </Rv>
            </div>

            <div style={{ marginTop: 'var(--egm-64)', display: 'grid', gap: 0 }}>
              {FEES.map((f) => (
                <Rv key={f.label} kind="line">
                  <div
                    style={{
                      display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline',
                      gap: 'var(--egm-16)', padding: 'var(--egm-20) 0', borderTop: '1px solid var(--egm-hair-paper)',
                    }}
                  >
                    <div>
                      <p className="egm-body" style={{ color: 'var(--egm-paper)' }}>{f.label}</p>
                      {f.note && <p className="egm-data" style={{ color: 'var(--egm-mute-paper)', fontSize: '.82rem', marginTop: 'var(--egm-4)', maxWidth: '46ch' }}>{f.note}</p>}
                    </div>
                    <p className="egm-h4" style={{ color: 'var(--egm-blue-bright)', whiteSpace: 'nowrap' }}>{f.value}</p>
                  </div>
                </Rv>
              ))}
              <div style={{ borderTop: '1px solid var(--egm-hair-paper)' }} />
            </div>
          </div>
        </section>

        {/* ── SVÆÐIÐ — dome #2 ──────────────────────────────────────────── */}
        <section id="svaedid" className="egm-arch egm-gr-stone" data-egm-theme="light" aria-labelledby="svaedi-h" style={{ marginTop: 'calc(var(--egm-64) * -1)' }}>
          <div className="egm-container" style={{ padding: 'var(--egm-120) 0 var(--egm-80)' }}>
            {/* centred, narrow: keeps the heading clear of the arch's still-
                curving corners (see .egm-dome-inner in styles.ts) */}
            <div className="egm-dome-inner egm-dome-inner--wide">
              <Rv kind="p">
                <p className="egm-label" style={{ color: 'var(--egm-blue)' }}>Svæðið okkar</p>
                <H id="svaedi-h" level={2}>Reykjanesbær og nágrenni</H>
              </Rv>
            </div>
            <div style={{ marginTop: 'var(--egm-48)' }}>
              {TOWNS.map((t) => (
                <Rv key={t.name} kind="line">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: 'var(--egm-16) 0', borderTop: '1px solid var(--egm-hair-ink)' }}>
                    <h3 className="egm-h4">{t.name}</h3>
                    <p className="egm-data" style={{ color: t.count > 0 ? 'var(--egm-blue)' : 'var(--egm-mute-ink)' }}>
                      {t.count > 0 ? `${t.count} eign${t.count === 1 ? '' : 'ir'} á skrá` : 'Engin eign á skrá í sýnishorni'}
                    </p>
                  </div>
                </Rv>
              ))}
              <div style={{ borderTop: '1px solid var(--egm-hair-ink)' }} />
            </div>
            <Rv kind="p" className="egm-mt">
              <p className="egm-body" style={{ color: 'var(--egm-soft-ink)', maxWidth: '56ch' }}>
                Ein eign í sýnishorninu, Akurvellir 1, er á skrá utan Suðurnesja (Hafnarfjörður) og er talin
                með til fullkomins samræmis við söluskrá Eignamiðlunar Suðurnesja, ekki sleppt.
              </p>
            </Rv>
            <Frame src={IMG.svaedi} alt="Mosavaxið hraun og vegur, einkennandi landslag Reykjanesskagans." ratio="21 / 9" className="egm-mt" />
          </div>
        </section>

        {/* ── STAFF — device 9: real portraits, CSS hover state machine ─── */}
        <section id="starfsfolk" className="egm-gr-paper" data-egm-theme="light" aria-labelledby="staff-h">
          <div className="egm-container" style={{ padding: 'var(--egm-96) 0' }}>
            <Rv kind="p"><H id="staff-h" level={2}>Starfsfólkið</H></Rv>
            <div className="egm-staff-grid" style={{ marginTop: 'var(--egm-40)' }}>
              {STAFF.map((s) => (
                <Rv key={s.email} as="article" kind="p" className="egm-staff-card">
                  <div className="egm-staff-photo-wrap">
                    <img src={s.photo} alt={s.alt} loading="lazy" decoding="async" />
                  </div>
                  <h3 className="egm-h5" style={{ marginTop: 'var(--egm-16)' }}>{s.name}</h3>
                  <p className="egm-body" style={{ color: 'var(--egm-soft-ink)', marginTop: 'var(--egm-4)', fontSize: '.92rem' }}>{s.title}</p>
                  <div className="egm-staff-contact" style={{ marginTop: 'var(--egm-8)', display: 'flex', flexDirection: 'column', gap: 'var(--egm-4)' }}>
                    <a href={s.phoneHref} className="egm-data" style={{ color: 'var(--egm-blue)', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>{s.phone}</a>
                    <a href={`mailto:${s.email}`} className="egm-data" style={{ color: 'var(--egm-soft-ink)', fontSize: '.88rem', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>{s.email}</a>
                  </div>
                </Rv>
              ))}
            </div>
          </div>
        </section>

        {/* ── SELLER CTA + device 10: footer aperture close ────────────── */}
        <section aria-labelledby="cta-h" style={{ position: 'relative' }}>
          <div ref={closerRef} data-egm-closer className="egm-gr-ink" data-egm-theme="dark" style={{ willChange: 'clip-path' }}>
            <div data-egm-closer-stage className="egm-container" style={{ padding: 'var(--egm-120) 0', textAlign: 'center', transformOrigin: '50% 50%' }}>
              <Rv kind="p">
                <p className="egm-label" style={{ color: 'var(--egm-blue-bright)' }}>Skráðu eignina</p>
                <h2 id="cta-h" data-egm-split="h" className="egm-h1" style={{ color: 'var(--egm-paper)', fontSize: 'var(--egm-h2)', margin: '0 auto', maxWidth: '18ch' }}>
                  Eitt símtal. Engin lágmarksþóknun.
                </h2>
                <p className="egm-body" style={{ color: 'var(--egm-mute-paper)', maxWidth: '48ch', margin: 'var(--egm-24) auto 0' }}>
                  Frítt verðmat og gagnsæ 1,3% gjaldskrá frá fyrsta degi. Hringdu eða sendu okkur línu og við
                  metum eignina ykkar án nokkurrar skuldbindingar.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--egm-12)', marginTop: 'var(--egm-32)' }}>
                  <a href={PHONE_HREF} className="egm-btn" style={{ background: 'var(--egm-blue)', color: '#fff' }}>Hringja í {PHONE_DISPLAY}</a>
                  <a href={EMAIL_HREF} className="egm-btn egm-btn-outline" style={{ borderColor: 'rgba(247,241,228,.42)', color: 'var(--egm-paper)' }}>Senda á {EMAIL}</a>
                </div>
                <p className="egm-data" style={{ color: 'var(--egm-mute-paper)', fontSize: '.82rem', marginTop: 'var(--egm-32)' }}>
                  {LEGAL_NAME} · kt. {KENNITALA} · {ADDRESS_CORRECT}
                </p>
              </Rv>
            </div>
          </div>
        </section>
      </main>

      <PreviewFooter company={COMPANY} />
    </div>
  )
}
