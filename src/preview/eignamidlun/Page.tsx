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
  ADDRESS_CORRECT, COMPANY, EMAIL, EMAIL_HREF, FEES, FEE_HEADLINE, FEE_SUB, FOUNDING,
  IMG, JSON_LD, KENNITALA, LEGAL_NAME, LISTINGS, LISTINGS_LABEL, LISTING_FILTERS,
  EDITORIAL_CARDS, NAV, PHONE_DISPLAY, PHONE_HREF, STAFF, TOWNS,
  type Listing, type ListingType,
} from './data'

gsap.registerPlugin(SplitText, CustomEase)
CustomEase.create('egmOut', '.25,1,.5,1')
CustomEase.create('egmIn', '.5,0,.75,0')

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

/* ══════════════════════════════════════════════════════════════════════
   THE SCROLL ENGINE
   One Lenis instance drives smooth scroll. On every Lenis 'scroll' tick we
   read two element rects and write two scrub-driven inline styles directly
   (device 3, the dive-in hero; device 8, the footer aperture close) — both
   genuinely tied to scroll position, no artificial pinned runway needed.
   Everything else (device 5 reveals, device 4 chrome theming) runs off
   IntersectionObserver, registered separately below.
   ══════════════════════════════════════════════════════════════════════ */
function useSceneEngine(heroImgRef: RefObject<HTMLDivElement | null>, closerRef: RefObject<HTMLDivElement | null>) {
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
      const hero = heroImgRef.current
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

/* ── device 5 — reveal primitives ────────────────────────────────────────
   h    SplitText chars, rotateY 90 + yPercent 50 → 0            (headings)
   p    masked lines, yPercent 110 → 0, no opacity                (paragraphs)
   line clip-path inset wipe                                      (rules)
   ctn  opacity + y                                                (containers)
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

    if (skip) {
      document.querySelectorAll('[data-egm-split="h"]').forEach((el) => revealHeading(el, true))
      document.querySelectorAll('[data-egm-rv-ctn],[data-egm-rv-line],[data-egm-rv-p]').forEach((el) => revealPlain(el, true))
      return
    }

    const targets = Array.from(
      document.querySelectorAll('[data-egm-split="h"],[data-egm-rv-ctn],[data-egm-rv-line],[data-egm-rv-p]'),
    )
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

/* ── device 4 — self-theming fixed chrome ────────────────────────────────
   Each fixed element gets its OWN IntersectionObserver, rootMargin-shifted
   to a 1px line at that element's vertical centre, observing every themed
   section. Whichever section's box currently straddles that line supplies
   the theme. 0.4s CSS colour transition does the rest (see .egm-chrome in
   styles.ts). */
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

/* ── device 2 — the arch aperture preloader ──────────────────────────── */
function Preloader() {
  const [stage, setStage] = useState<'hold' | 'open' | 'exit' | 'gone'>('hold')

  useEffect(() => {
    if (reduced()) {
      setStage('gone')
      return
    }
    let cancelled = false
    const heroImg = new Image()
    heroImg.src = IMG.lighthouse
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
  }, [])

  useEffect(() => {
    if (stage !== 'exit') return
    const t = window.setTimeout(() => setStage('gone'), 700)
    return () => window.clearTimeout(t)
  }, [stage])

  useEffect(() => {
    if (stage !== 'gone') return
    document.body.style.overflow = ''
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

/* ── small building blocks ───────────────────────────────────────────── */

function Rv({
  as: Tag = 'div',
  kind = 'ctn',
  className = '',
  children,
  id,
}: {
  as?: 'div' | 'section' | 'article' | 'li' | 'span'
  kind?: 'ctn' | 'line' | 'p'
  className?: string
  children: React.ReactNode
  id?: string
}) {
  const attr = kind === 'ctn' ? 'data-egm-rv-ctn' : kind === 'line' ? 'data-egm-rv-line' : 'data-egm-rv-p'
  const base = kind === 'ctn' ? 'egm-rv-ctn' : kind === 'line' ? 'egm-rv-line' : 'egm-rv-p'
  return (
    <Tag id={id} {...{ [attr]: true }} className={`${base} ${className}`}>
      {children}
    </Tag>
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
    <div className={className} style={{ width: '100%', aspectRatio: ratio, overflow: 'hidden', position: 'relative', background: 'var(--egm-stone)' }}>
      <img src={src} alt={alt} loading="lazy" decoding="async" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  )
}

function Mark({ size = 26, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
      <path d="M4 20 L20 6 L36 20" fill="none" stroke={color} strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
      <path d="M9 18 V34 H31 V18" fill="none" stroke={color} strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
      <path d="M16 34 V24 H24 V34" fill="none" stroke={color} strokeWidth="2.4" />
    </svg>
  )
}

type Row = { row: Listing } | { editorial: (typeof EDITORIAL_CARDS)[number] }

function withEditorial(filtered: Listing[]): Row[] {
  const out: Row[] = []
  filtered.forEach((item, i) => {
    out.push({ row: item })
    if (i === 3 && filtered.length > 5) out.push({ editorial: EDITORIAL_CARDS[0] })
    if (i === 10 && filtered.length > 12) out.push({ editorial: EDITORIAL_CARDS[1] })
  })
  return out
}

/* ══════════════════════════════════════════════════════════════════════ */

export default function EignamidlunPage() {
  const heroImgRef = useRef<HTMLDivElement>(null)
  const closerRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<ListingType | 'Öll'>('Öll')
  const [menu, setMenu] = useState(false)

  useSceneEngine(heroImgRef, closerRef)
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

  const filtered = useMemo(
    () => (filter === 'Öll' ? LISTINGS : LISTINGS.filter((l) => l.type === filter)),
    [filter],
  )
  const rows = useMemo(() => withEditorial(filtered), [filtered])

  return (
    <div className="egm-canvas" lang="is">
      <style>{CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      <PreviewChrome company={COMPANY} />
      <Preloader />

      {/* ── device 4: self-theming fixed chrome ─────────────────────── */}
      <div ref={brandRef} className="egm-chrome egm-chrome-brand egm-theme-light">
        <Mark size={24} color="var(--egm-accent)" />
        <span className="egm-label" style={{ letterSpacing: '.14em' }}>Eignamiðlun&nbsp;Suðurnesja</span>
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
        style={{ right: 'var(--egm-24)', top: 'var(--egm-80)', width: 44, height: 44, display: 'grid', placeItems: 'center', border: '1px solid currentColor', borderRadius: '999px', background: 'transparent' }}
      >
        <span aria-hidden="true" style={{ fontFamily: "'EGM Mono', monospace", fontSize: '1.1rem' }}>{menu ? '×' : '≡'}</span>
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
          <a href={PHONE_HREF} className="egm-label" style={{ color: 'var(--egm-accent-bright)', marginTop: 'var(--egm-24)' }}>☏ {PHONE_DISPLAY}</a>
        </nav>
      )}

      <main id="top">
        {/* ── HERO — device 3: dive-in scale scrub ────────────────────── */}
        <section data-egm-hero data-egm-theme="dark" style={{ position: 'relative', height: '100svh', minHeight: 560, overflow: 'hidden' }} aria-labelledby="egm-h1">
          <div ref={heroImgRef} style={{ position: 'absolute', inset: 0, transformOrigin: '50% 75%', willChange: 'transform' }}>
            <img src={IMG.lighthouse} alt="Hvítur viti á grænni hæð við hafið." style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(14,26,32,.32), rgba(14,26,32,.68) 72%, rgba(14,26,32,.86))' }} />
          </div>
          <div className="egm-container" style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 'var(--egm-64)', color: 'var(--egm-paper)' }}>
            <p className="egm-label" style={{ color: 'var(--egm-paper)', opacity: 0.82, marginBottom: 'var(--egm-16)' }}>Fasteignasala á Suðurnesjum · síðan 1978</p>
            <h1 id="egm-h1" data-egm-split="h" className="egm-h1" style={{ color: 'var(--egm-paper)', margin: 0 }}>
              Eignamiðlun&nbsp;Suðurnesja
            </h1>
            <p className="egm-body" style={{ maxWidth: '38ch', marginTop: 'var(--egm-24)', color: 'var(--egm-soft-paper)' }}>
              Suðurnesin, hús fyrir hús. Sama fyrirtæki frá 1978, sama gagnsæja gjaldskráin fyrir hvert einasta hús.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--egm-12)', marginTop: 'var(--egm-32)' }}>
              <a href="#soluskra" className="egm-btn" style={{ background: 'var(--egm-accent)', color: '#fff' }}>Skoða söluskrá</a>
              <a href="#gjaldskra" className="egm-btn egm-btn-outline" style={{ borderColor: 'rgba(244,234,217,.42)', color: 'var(--egm-paper)' }}>Sjá gjaldskrá</a>
            </div>
          </div>
          <div className="egm-bob" aria-hidden="true" style={{ position: 'absolute', bottom: 'var(--egm-24)', left: '50%', transform: 'translateX(-50%)', color: 'var(--egm-paper)', opacity: 0.7 }}>
            <span className="egm-label">Skruna</span>
          </div>
        </section>

        {/* ── FOUNDING — "Síðan 1978" ──────────────────────────────────── */}
        <section id="saga" className="egm-gr-paper" data-egm-theme="light" aria-labelledby="saga-h">
          <div className="egm-container" style={{ padding: 'var(--egm-96) 0', display: 'grid', gap: 'var(--egm-48)', gridTemplateColumns: '1fr' }}>
            <div style={{ display: 'grid', gap: 'var(--egm-48)' }} className="egm-saga-grid">
              <Rv kind="line"><div style={{ height: 1, background: 'var(--egm-hair-ink)', marginBottom: 'var(--egm-24)' }} /></Rv>
              <div className="egm-saga-cols">
                <div>
                  <Frame src={IMG.coastDusk} alt="Klettur í hafinu við sólsetur." ratio="4 / 5" />
                  <Rv kind="ctn" className="egm-mt"><p className="egm-label" style={{ color: 'var(--egm-accent-ink)', marginTop: 'var(--egm-24)' }}>{FOUNDING.date}</p></Rv>
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
                  <Rv kind="ctn">
                    <p className="egm-num" style={{ fontSize: 'var(--egm-h2)', marginTop: 'var(--egm-32)', color: 'var(--egm-accent)' }}>{FOUNDING.years} ár</p>
                    <p className="egm-label" style={{ color: 'var(--egm-mute-ink)' }}>á sama landsvæði, án hlés</p>
                  </Rv>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PILLARS — "Af hverju Eignamiðlun Suðurnesja" ─────────────── */}
        <section className="egm-gr-stone" data-egm-theme="light" aria-labelledby="pillars-h">
          <div className="egm-container" style={{ padding: 'var(--egm-80) 0' }}>
            <Rv kind="ctn"><H id="pillars-h" level={2}>Af hverju Eignamiðlun Suðurnesja</H></Rv>
            <div style={{ display: 'grid', gap: 'var(--egm-24)', marginTop: 'var(--egm-48)' }} className="egm-pillar-grid">
              {[
                { n: '01', t: 'Staðbundin þekking frá 1978', b: 'Sama fyrirtæki hefur selt hús á Suðurnesjum í 47 ár, óslitið síðan Hannes og Halldóra byrjuðu.' },
                { n: '02', t: 'Gagnsæ gjaldskrá', b: '1,3% söluþóknun og engin lágmarksþóknun, sagt beint út áður en nokkur spyr.' },
                { n: '03', t: 'Engin skuldbinding', b: 'Frítt verðmat, bæði sölu og banka, og ekkert gjald fyrir gagnaöflun eða ljósmyndun.' },
              ].map((p) => (
                <Rv key={p.n} kind="ctn" as="article">
                  <p className="egm-mono" style={{ color: 'var(--egm-accent-ink)', fontSize: '.85rem' }}>{p.n}</p>
                  <h3 className="egm-h5" style={{ marginTop: 'var(--egm-8)' }}>{p.t}</h3>
                  <p className="egm-body" style={{ color: 'var(--egm-soft-ink)', marginTop: 'var(--egm-8)' }}>{p.b}</p>
                </Rv>
              ))}
            </div>
            <Frame src={IMG.mossDetail} alt="Nærmynd af mosavöxnu hrauni." ratio="21 / 6" className="egm-mt" />
          </div>
        </section>

        {/* ── SÖLUSKRÁ — device 6: filtered grid + injected editorial cards ── */}
        <section id="soluskra" className="egm-gr-paper" data-egm-theme="light" aria-labelledby="soluskra-h">
          <div className="egm-container" style={{ padding: 'var(--egm-96) 0' }}>
            <Rv kind="ctn">
              <p className="egm-label" style={{ color: 'var(--egm-accent-ink)' }}>{LISTINGS_LABEL}</p>
              <H id="soluskra-h" level={2}>Söluskráin, öll uppi á borðum</H>
              <p className="egm-body" style={{ color: 'var(--egm-soft-ink)', maxWidth: '58ch', marginTop: 'var(--egm-16)' }}>
                Tuttugu raunverulegar eignir af söluskrá Eignamiðlunar Suðurnesja, beint af vefsíðu þeirra.
                Engar sviðsettar ljósmyndir á raunveruleg heimilisföng, aðeins tölurnar sjálfar.
              </p>
            </Rv>

            <Rv kind="ctn" className="egm-mt">
              <div role="group" aria-label="Sía eftir eignagerð" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--egm-8)', marginTop: 'var(--egm-32)' }}>
                {LISTING_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    className="egm-chip"
                    aria-pressed={filter === f.value}
                    onClick={() => setFilter(f.value)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <p className="egm-mono" style={{ marginTop: 'var(--egm-16)', color: 'var(--egm-mute-ink)', fontSize: '.82rem' }}>
                {filtered.length} af {LISTINGS.length} eignum
              </p>
            </Rv>

            <div className="egm-grid" style={{ marginTop: 'var(--egm-24)' }}>
              {rows.map((r, i) =>
                'row' in r ? (
                  <Rv key={r.row.address} as="article" kind="ctn" className="egm-listing">
                    <p className="egm-mono" style={{ fontSize: '.76rem', color: 'var(--egm-mute-ink)', letterSpacing: '.08em' }}>
                      {r.row.town} · {r.row.type}
                    </p>
                    <h3 className="egm-h5" style={{ marginTop: 'var(--egm-8)' }}>{r.row.address}</h3>
                    <p className="egm-mono" style={{ marginTop: 'var(--egm-12)', color: 'var(--egm-soft-ink)', fontSize: '.86rem' }}>
                      {r.row.sqm} m² {r.row.rooms > 0 ? `· ${r.row.rooms} herb.` : ''}
                    </p>
                    <p className="egm-h4" style={{ marginTop: 'var(--egm-16)', fontSize: 'clamp(1.3rem, 3.4vw, 1.9rem)', color: r.row.priceValue ? 'var(--egm-ink)' : 'var(--egm-accent-ink)' }}>
                      {r.row.price}
                    </p>
                  </Rv>
                ) : (
                  <Rv key={`ed-${i}`} as="article" kind="ctn" className="egm-editorial">
                    <p className="egm-label" style={{ color: 'var(--egm-accent-bright)' }}>{r.editorial.tag}</p>
                    <p className="egm-h5" style={{ marginTop: 'var(--egm-12)', color: 'var(--egm-paper)' }}>{r.editorial.line}</p>
                  </Rv>
                ),
              )}
            </div>
          </div>
        </section>

        {/* ── GJALDSKRÁ MONUMENT — compliance stated as a monument ────── */}
        <section id="gjaldskra" className="egm-gr-ink" data-egm-theme="dark" aria-labelledby="fee-h">
          <div className="egm-container" style={{ padding: 'var(--egm-96) 0' }}>
            <Rv kind="ctn">
              <p className="egm-label" style={{ color: 'var(--egm-accent-bright)' }}>Gjaldskrá</p>
              <h2 id="fee-h" data-egm-split="h" className="egm-num" style={{ color: 'var(--egm-paper)', marginTop: 'var(--egm-16)' }}>
                {FEE_HEADLINE}
              </h2>
              <p className="egm-h4" style={{ color: 'var(--egm-mute-paper)', marginTop: 'var(--egm-8)', fontWeight: 500 }}>{FEE_SUB}</p>
            </Rv>

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
                      {f.note && <p className="egm-mono" style={{ color: 'var(--egm-mute-paper)', fontSize: '.82rem', marginTop: 'var(--egm-4)', maxWidth: '46ch' }}>{f.note}</p>}
                    </div>
                    <p className="egm-h4" style={{ color: 'var(--egm-accent-bright)', whiteSpace: 'nowrap' }}>{f.value}</p>
                  </div>
                </Rv>
              ))}
              <div style={{ borderTop: '1px solid var(--egm-hair-paper)' }} />
            </div>
          </div>
        </section>

        {/* ── DOME — device 7: "Svæðið okkar" ──────────────────────────── */}
        <section id="svaedid" className="egm-arch egm-gr-stone" data-egm-theme="light" aria-labelledby="svaedi-h" style={{ marginTop: 'calc(var(--egm-64) * -1)', position: 'relative', zIndex: 1 }}>
          <div className="egm-container" style={{ padding: 'var(--egm-120) 0 var(--egm-80)' }}>
            <Rv kind="ctn">
              <p className="egm-label" style={{ color: 'var(--egm-accent-ink)' }}>Svæðið okkar</p>
              <H id="svaedi-h" level={2}>Reykjanesbær og nágrenni</H>
            </Rv>
            <div style={{ marginTop: 'var(--egm-48)' }}>
              {TOWNS.map((t) => (
                <Rv key={t.name} kind="line">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: 'var(--egm-16) 0', borderTop: '1px solid var(--egm-hair-ink)' }}>
                    <h3 className="egm-h4">{t.name}</h3>
                    <p className="egm-mono" style={{ color: t.count > 0 ? 'var(--egm-accent-ink)' : 'var(--egm-mute-ink)' }}>
                      {t.count > 0 ? `${t.count} eign${t.count === 1 ? '' : 'ir'} á skrá` : 'Engin eign á skrá í sýnishorni'}
                    </p>
                  </div>
                </Rv>
              ))}
              <div style={{ borderTop: '1px solid var(--egm-hair-ink)' }} />
            </div>
            <Rv kind="ctn" className="egm-mt">
              <p className="egm-body" style={{ color: 'var(--egm-soft-ink)', marginTop: 'var(--egm-24)', maxWidth: '56ch' }}>
                Ein eign í sýnishorninu, Akurvellir 1, er á skrá utan Suðurnesja (Hafnarfjörður) og er talin
                með til fullkomins samræmis við söluskrá Eignamiðlunar Suðurnesja, ekki sleppt.
              </p>
            </Rv>
            <Frame src={IMG.lavaRoad} alt="Mosavaxið hraun og vegur, einkennandi landslag Reykjanesskagans." ratio="21 / 9" className="egm-mt" />
          </div>
        </section>

        {/* ── STAFF ─────────────────────────────────────────────────────── */}
        <section id="starfsfolk" className="egm-gr-paper" data-egm-theme="light" aria-labelledby="staff-h">
          <div className="egm-container" style={{ padding: 'var(--egm-96) 0' }}>
            <Rv kind="ctn"><H id="staff-h" level={2}>Starfsfólkið</H></Rv>
            <div style={{ marginTop: 'var(--egm-32)' }}>
              {STAFF.map((s) => (
                <Rv key={s.email} kind="line">
                  <div className="egm-staff" style={{ display: 'grid', gap: 'var(--egm-8)' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 'var(--egm-16)' }}>
                      <h3 className="egm-h4">{s.name}</h3>
                      <div style={{ display: 'flex', gap: 'var(--egm-16)', flexWrap: 'wrap' }}>
                        <a href={`tel:+354${s.phone.replace(/\s/g, '')}`} className="egm-mono" style={{ color: 'var(--egm-accent-ink)', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>{s.phone}</a>
                        <a href={`mailto:${s.email}`} className="egm-mono" style={{ color: 'var(--egm-soft-ink)', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>{s.email}</a>
                      </div>
                    </div>
                    <p className="egm-body" style={{ color: 'var(--egm-soft-ink)' }}>{s.title}</p>
                  </div>
                </Rv>
              ))}
            </div>
          </div>
        </section>

        {/* ── SELLER CTA + device 8: footer aperture close ─────────────── */}
        <section aria-labelledby="cta-h" style={{ position: 'relative' }}>
          <div ref={closerRef} data-egm-closer className="egm-gr-ink" data-egm-theme="dark" style={{ willChange: 'clip-path' }}>
            <div data-egm-closer-stage className="egm-container" style={{ padding: 'var(--egm-120) 0', textAlign: 'center', transformOrigin: '50% 50%' }}>
              <Rv kind="ctn">
                <p className="egm-label" style={{ color: 'var(--egm-accent-bright)' }}>Skráðu eignina</p>
                <h2 id="cta-h" data-egm-split="h" className="egm-h1" style={{ color: 'var(--egm-paper)', fontSize: 'var(--egm-h2)', margin: '0 auto', maxWidth: '18ch' }}>
                  Ein símtal. Engin lágmarksþóknun.
                </h2>
                <p className="egm-body" style={{ color: 'var(--egm-mute-paper)', maxWidth: '48ch', margin: 'var(--egm-24) auto 0' }}>
                  Frítt verðmat og gagnsæ 1,3% gjaldskrá frá fyrsta degi. Hringdu eða sendu okkur línu og við
                  metum eignina ykkar án nokkurrar skuldbindingar.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--egm-12)', marginTop: 'var(--egm-32)' }}>
                  <a href={PHONE_HREF} className="egm-btn" style={{ background: 'var(--egm-accent)', color: '#fff' }}>Hringja í {PHONE_DISPLAY}</a>
                  <a href={EMAIL_HREF} className="egm-btn egm-btn-outline" style={{ borderColor: 'rgba(244,234,217,.42)', color: 'var(--egm-paper)' }}>Senda á {EMAIL}</a>
                </div>
                <p className="egm-mono" style={{ color: 'var(--egm-mute-paper)', fontSize: '.82rem', marginTop: 'var(--egm-32)' }}>
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
