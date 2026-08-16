import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  CONTACT, JSON_LD, PHOTO, PROJECTS, REGISTER, REGISTER_COUNT, srcSet, type KiPhoto,
} from './data'

gsap.registerPlugin(ScrollTrigger)

const company = getPreviewCompany('katrinisfeld')

/* ── KATRÍN ÍSFELD · "RÝMIÐ MAN" ───────────────────────────────────────────
   The ERA Residence machine, re-aimed at an interior architect: the visitor
   arrives into one room at a time, each with its own colour world, and the
   fixed chrome re-themes itself per element as it crosses each room's
   boundary. Six of ERA's set-pieces, no more (beyond that it reads as
   pastiche): arch aperture preloader · dive-in hero · rising dome with arc
   type · shutter project entrances · semantic per-section theming with
   self-theming chrome · footer arch. Every colour world is pulled from her
   own photography (Súluhöfða wine + copper, Fljótshlíð linen + light).

   ERA's real gaps are fixed, not copied: prefers-reduced-motion renders
   everything at rest, body copy holds 15px+, and the preloader is tied to
   real loading with a 2.4s cap (theirs faked 7s).

   Scoped fluid unit --u on .ki-root only ([[no-style-bleed-between-designs]]).
   Icelandic display: per-WORD splits only, leading ≥1.12, .22em mask headroom
   (ledger #23). ─────────────────────────────────────────────────────────── */

const CREAM = '#EFEAE2'
const INK = '#231F1B'
const CHARCOAL = '#1D1B19'
const WINE = '#8C3A34'

const DISPLAY = "'Sentient', Georgia, serif"
const SANS = "'Archia', system-ui, sans-serif"
const MONO = "'Geist Mono', ui-monospace, monospace"

const BASE = import.meta.env.BASE_URL

/* ERA's measured curves — the actual "feel" */
const OUT = 'cubic-bezier(.25,1,.5,1)'
const EASE_DIVE = '0.6,0,0,1'

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

const fluid = (n: number, floor: number) =>
  `clamp(${floor}px, calc(var(--u) * ${n}), ${+(n * 1.15).toFixed(1)}px)`

/* ── motion engine ─────────────────────────────────────────────────────── */

function useMotion(ready: boolean) {
  useEffect(() => {
    if (!ready) return
    const root = document.querySelector<HTMLElement>('.ki-root')
    if (!root) return

    /* SELF-THEMING CHROME — ERA's signature detail. Each fixed chrome element
       is themed by which section ITS OWN vertical centre is inside, with a
       0.4s colour transition. One read pass per frame, rects cached. */
    const chromeEls = Array.from(root.querySelectorAll<HTMLElement>('[data-ki-chrome]'))
    let bands: Array<{ top: number; bottom: number; dark: boolean }> = []
    const readBands = () => {
      const sy = window.scrollY
      bands = Array.from(root.querySelectorAll<HTMLElement>('[data-ki-band]')).map((s) => {
        const r = s.getBoundingClientRect()
        return { top: r.top + sy, bottom: r.bottom + sy, dark: s.dataset.kiBand === 'dark' }
      })
    }
    const themeChrome = () => {
      if (!bands.length) return
      const sy = window.scrollY
      for (const el of chromeEls) {
        const r = el.getBoundingClientRect()
        const centre = sy + r.top + r.height / 2
        let dark = false
        for (const b of bands) {
          if (centre >= b.top && centre < b.bottom) { dark = b.dark; break }
        }
        const want = dark ? 'dark' : 'light'
        if (el.dataset.kiOn !== want) el.dataset.kiOn = want
      }
    }

    /* Reduced motion still needs the chrome themed. Without this the nav sat
       at its :not([data-ki-on]) fallback (dark ink) over every dark band, so
       a visitor with the OS setting on read dark-on-dark for most of the
       page. Reduced motion means gentler movement, not unreadable text, so
       the theming runs here off native scroll with no Lenis and no tweens. */
    if (reduced()) {
      root.classList.add('ki-static')
      readBands()
      themeChrome()
      const onScroll = () => themeChrome()
      const onResize = () => { readBands(); themeChrome() }
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onResize, { passive: true })
      return () => {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onResize)
      }
    }

    root.classList.add('ki-js')
    ScrollTrigger.config({ ignoreMobileResize: true })
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })

    /* reveals: IO arms a class; CSS owns transitions (ERA reveal/initial) */
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-in')),
      // threshold 0 + a negative-free root margin: a tall figure scrolled past
      // quickly never reached a 0.2 ratio, so it stayed clipped at
      // inset(0 50%) forever and held a full-height invisible box.
      { threshold: 0, rootMargin: '0px 0px -8% 0px' },
    )
    root.querySelectorAll('.ki-rv, .ki-slide, .ki-shutter').forEach((el) => {
      // anything already above the fold when the observer arms is revealed
      // outright rather than waiting for a crossing that already happened
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in')
      io.observe(el)
    })
    /* A scroll fast enough to skip an element's whole box between painted
       frames never produces an intersecting entry at all, so it would stay
       clipped forever. Same sweep the Chris build carries. */
    const revealPassed = () => {
      root.querySelectorAll('.ki-rv:not(.is-in), .ki-slide:not(.is-in), .ki-shutter:not(.is-in)').forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in')
      })
    }

    const ctx = gsap.context(() => {
      /* dive-in hero: the camera settles into the first room (scale 2 from
         50% 75%, ERA's diveIn curve), chained off the loader when present */
      const heroMedia = root.querySelector<HTMLElement>('.ki-hero-media img')
      const heroWords = root.querySelectorAll<HTMLElement>('.ki-hero .ki-word')
      if (heroMedia) {
        gsap.set(heroMedia, { scale: 2, transformOrigin: '50% 75%' })
        const dive = () => {
          gsap.to(heroMedia, { scale: 1, duration: 1.6, ease: `cubic-bezier(${EASE_DIVE})` })
          if (heroWords.length) {
            gsap.fromTo(heroWords,
              { yPercent: 116, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: 1.2, ease: 'expo.out', stagger: 0.06, delay: 0.35 })
          }
        }
        if (document.querySelector('.ki-loader')) {
          window.addEventListener('ki:revealed', dive, { once: true })
        } else {
          gsap.delayedCall(0.15, dive)
        }
      }

      /* word-mask rises for section headlines */
      root.querySelectorAll<HTMLElement>('[data-ki-headline]:not(.ki-hero-title)').forEach((h) => {
        const words = h.querySelectorAll<HTMLElement>('.ki-word')
        if (!words.length) return
        gsap.fromTo(words,
          { yPercent: 116, opacity: 0 },
          {
            yPercent: 0, opacity: 1, duration: 1.2, ease: 'expo.out', stagger: 0.06,
            scrollTrigger: { trigger: h, start: 'top 86%', once: true },
          })
      })

      /* rising dome: the arch lifts into view while the headline's words
         spread apart (ERA: word-spacing 0 → 10rem, scaled to our canvas) */
      const dome = root.querySelector<HTMLElement>('.ki-dome-arch')
      const arc = root.querySelector<HTMLElement>('.ki-dome-title')
      if (dome) {
        gsap.fromTo(dome, { yPercent: 18 }, {
          yPercent: 0, ease: 'none',
          scrollTrigger: { trigger: dome, start: 'top bottom', end: 'top 30%', scrub: 0.8 },
        })
      }
      if (arc) {
        // word-spacing itself reflows text every scrub frame; spreading the
        // per-word wrapper spans apart on transform:x gives the same look
        // (words drifting apart as the dome rises) without ever touching layout.
        const words = Array.from(arc.querySelectorAll<HTMLElement>(':scope > span'))
        if (words.length > 1) {
          const n = words.length
          const em = parseFloat(getComputedStyle(arc).fontSize) || 60
          gsap.fromTo(words, { x: 0 }, {
            x: (i: number) => (i - (n - 1) / 2) * em * 0.42,
            ease: 'none',
            scrollTrigger: { trigger: arc, start: 'top 95%', end: 'bottom 30%', scrub: 0.8 },
          })
        }
      }

      /* footer arch: the last room rises into place through its arch.
         The arch itself is now a STATIC border-radius. It used to be tweened
         as clip-path: inset(... round ...), but GSAP cannot interpolate an
         inset() that carries a round component: the computed value collapsed
         to inset(0% 0% 0px), the radius was dropped, and the dome arrived as
         a broken rectangle. Only the rise is animated now. */
      const foot = root.querySelector<HTMLElement>('.ki-samband-in')
      if (foot) {
        gsap.fromTo(foot, { yPercent: 5 }, {
          yPercent: 0, ease: 'none',
          scrollTrigger: { trigger: foot, start: 'top 95%', end: 'top 45%', scrub: 0.8 },
        })
      }

      ScrollTrigger.addEventListener('refresh', readBands)
      readBands()
    }, root)

    /* theming + the reveal sweep ride the scroll event, not every ticker
       frame: between gestures nothing they read can have changed, so a
       per-frame pass is several getBoundingClientRect reads for no result */
    lenis.on('scroll', () => { ScrollTrigger.update(); themeChrome(); revealPassed() })
    const tick = (t: number) => { lenis.raf(t * 1000) }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    readBands()
    themeChrome()

    return () => {
      io.disconnect()
      gsap.ticker.remove(tick)
      ScrollTrigger.removeEventListener('refresh', readBands)
      ctx.revert()
      lenis.destroy()
    }
  }, [ready])
}

/* ── primitives ────────────────────────────────────────────────────────── */

function Headline({ text, size, floor, as: Tag = 'h2', className = '', measure }: {
  text: string; size: number; floor: number
  as?: 'h1' | 'h2' | 'h3'; className?: string; measure?: number
}) {
  return (
    <Tag
      data-ki-headline
      aria-label={text}
      className={`ki-headline ${className}`}
      style={{
        fontSize: fluid(size, floor),
        maxWidth: measure ? `calc(var(--u) * ${measure})` : undefined,
      }}
    >
      {text.split(' ').map((w, i, arr) => (
        <span key={i} aria-hidden="true">
          <span className="ki-line"><span className="ki-word">{w}</span></span>
          {i < arr.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

/** slide: ERA's skewed-polygon media reveal with inner counter-scale.
 *  variant="shutter" swaps in the converging-panel reveal for one deliberate
 *  moment so the page doesn't run the same photo treatment start to finish. */
function Slide({ photo, className = '', priority = false, variant = 'slide' }: {
  photo: KiPhoto; className?: string; priority?: boolean; variant?: 'slide' | 'shutter'
}) {
  return (
    <figure className={`${variant === 'shutter' ? 'ki-shutter' : 'ki-slide'} ${className}`} style={{ aspectRatio: photo.ratio }}>
      <img src={photo.src} srcSet={srcSet(photo.src)} sizes="(max-width: 991px) 100vw, 46vw"
        alt={photo.alt} loading={priority ? 'eager' : 'lazy'} decoding="async" />
    </figure>
  )
}

/* ── preloader: the arch aperture, tied to real loading ────────────────── */

const shouldShowLoader = () => {
  if (typeof window === 'undefined' || reduced()) return false
  if (new URLSearchParams(window.location.search).has('loader')) return true
  try { return !sessionStorage.getItem('ki_seen') } catch { return true }
}

function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    try { sessionStorage.setItem('ki_seen', '1') } catch { /* private mode */ }
    const t0 = performance.now()
    let raf = 0
    let shown = 0
    const hero = document.querySelector<HTMLImageElement>('.ki-hero-media img')
    let heroDone = hero ? hero.complete : true
    let fontsDone = false
    if (hero && !heroDone) {
      hero.addEventListener('load', () => { heroDone = true }, { once: true })
      hero.addEventListener('error', () => { heroDone = true }, { once: true })
    }
    document.fonts.ready.then(() => { fontsDone = true })

    const FLOOR = 1100, CAP = 2400
    const tick = () => {
      const t = performance.now() - t0
      let target = (heroDone ? 55 : Math.min(50, t / 24)) + (fontsDone ? 45 : 0)
      if (t >= CAP) target = 100
      shown += (target - shown) * 0.12
      const display = Math.min(100, Math.round(shown))
      setPct(display)
      if (display >= 100 && t >= FLOOR) {
        setLeaving(true)
        window.setTimeout(onDone, 1000)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  return (
    <div className={`ki-loader ${leaving ? 'is-leaving' : ''}`} aria-hidden="true">
      <div className="ki-loader-arch">
        <p className="ki-loader-mark">KATRÍN ÍSFELD</p>
        <p className="ki-loader-pct">{pct}%</p>
      </div>
    </div>
  )
}

/* the overview, clustered by her own categories so a hotel or clinic owner
   can find their kind of work without scrolling past a wall of homes first */
const PROJECT_GROUPS = (() => {
  const order: string[] = []
  const byFlokkur = new Map<string, typeof PROJECTS>()
  for (const p of PROJECTS) {
    if (!byFlokkur.has(p.flokkur)) { byFlokkur.set(p.flokkur, []); order.push(p.flokkur) }
    byFlokkur.get(p.flokkur)!.push(p)
  }
  return order.map((flokkur) => ({ flokkur, items: byFlokkur.get(flokkur)! }))
})()

/* ── the page ──────────────────────────────────────────────────────────── */

export default function KatrinIsfeldPage() {
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(shouldShowLoader)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setThemeColor(CHARCOAL)
    document.title = 'Katrín Ísfeld innanhússarkitekt'
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content =
      'Katrín Ísfeld innanhússarkitekt hannar innanhús fyrir heimili, gistiheimili, ' +
      'hótel og atvinnurými í Reykjavík: 23 verk, þar á meðal ítalskar innréttingar.'
    setReady(true)
  }, [])

  useMotion(ready)

  const anchor = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <div ref={rootRef} className="ki-root">
      <style>{CSS}</style>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />
      {loading && <Preloader onDone={() => { setLoading(false); window.dispatchEvent(new Event('ki:revealed')) }} />}

      {/* chrome: fixed, self-theming per element */}
      <header className="ki-nav">
        <a className="ki-nav-mark" data-ki-chrome href="#top" onClick={anchor('top')}>KATRÍN&nbsp;ÍSFELD</a>
        <nav className="ki-nav-links" aria-label="Síða">
          <a data-ki-chrome href="#verkefni" onClick={anchor('verkefni')}>Verkefni</a>
          <a data-ki-chrome href="#skra" onClick={anchor('skra')}>Skráin</a>
        </nav>
        <a className="ki-nav-cta" data-ki-chrome href="#samband" onClick={anchor('samband')}>Hafa samband</a>
      </header>

      {/* 01 · hero — the first room, dived into */}
      <main>
      <section className="ki-hero" id="top" data-ki-band="dark">
        <div className="ki-hero-media">
          <img src={PHOTO.eldhusVitt.src} srcSet={srcSet(PHOTO.eldhusVitt.src)} sizes="100vw"
            alt={PHOTO.eldhusVitt.alt} loading="eager" decoding="async" />
        </div>
        <div className="ki-hero-scrim" aria-hidden="true" />
        <div className="ki-hero-lockup">
          <Headline as="h1" className="ki-hero-title" text="Innanhús, hugsað í heild." size={100} floor={36} />
          <p className="ki-hero-sub">
            Katrín Ísfeld hannar innanhús frá grunni: heimili, gistiheimili, hótel
            og atvinnurými.
          </p>
        </div>
      </section>

      {/* 02 · intent */}
      <section className="ki-intro" data-ki-band="light">
        <span className="ki-rule ki-rv" aria-hidden="true" />
        <Headline text="Hvert verkefni fær sinn eigin litheim." size={72} floor={32} measure={780} />
        <p className="ki-body ki-rv">
          Vínrautt og kopar í einu húsi, hör og dagsbirta í öðru. Litirnir á þessari
          síðu eru ekki valdir úr litakorti heldur teknir beint úr verkefnunum sjálfum,
          eins og þau voru ljósmynduð.
        </p>
      </section>

      {/* 03 · the overview: her work across all four categories, clustered so
          each buyer type (heimili / gistiheimili og hótel / atvinnuhúsnæði)
          reads as its own body of work rather than one undifferentiated wall */}
      <section className="ki-yfirlit" id="verkefni" data-ki-band="dark">
        <div className="ki-yfirlit-head">
          <p className="ki-verk-kicker" aria-hidden="true">Verkefni</p>
          <Headline text="Heimili, gistiheimili, hótel og atvinnurými." size={80} floor={32} measure={880} />
          <p className="ki-body ki-rv">
            Sautján verk úr skránni hennar, hvert með sinni eigin ljósmynd: eldhús og
            baðherbergi, heil heimili, gistiherbergi og atvinnurými.
          </p>
        </div>
        {PROJECT_GROUPS.map((g) => (
          <div key={g.flokkur} className="ki-yfirlit-cluster">
            <p className="ki-yfirlit-cat ki-rv">
              {g.flokkur}<span className="ki-yfirlit-cat-n">{g.items.length} verk</span>
            </p>
            <ul className="ki-yfirlit-grid" style={{ ['--cluster-cols' as string]: Math.min(g.items.length, 3) }}>
              {g.items.map((v) => (
                <li key={v.name} className="ki-verk-card ki-rv">
                  <figure className="ki-verk-card-fig">
                    <img src={v.photo.src} srcSet={srcSet(v.photo.src)}
                      sizes="(max-width: 640px) 92vw, (max-width: 991px) 46vw, 30vw"
                      alt={v.photo.alt} loading="lazy" decoding="async" />
                  </figure>
                  <div className="ki-verk-card-meta">
                    <span className="ki-verk-card-name">{v.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* 04 · one project in depth, so the overview has a floor */}
      <section className="ki-verk ki-verk-sulu" data-ki-band="dark">
        <div className="ki-verk-head">
          <p className="ki-verk-kicker" aria-hidden="true">Eitt verk í nærmynd</p>
          <Headline text="Nýbyggt hús í Súluhöfða." size={72} floor={32} measure={760} />
          <p className="ki-body ki-rv">
            Eyjan er vínrauð, ljósin kopar og arinveggurinn ljós steinn með
            eldiviðarhólfum, allt teiknað inn í húsið frá grunni.
          </p>
        </div>
        <div className="ki-verk-grid">
          <Slide photo={PHOTO.skapur} />
          <Slide photo={PHOTO.arinn} />
          <Slide photo={PHOTO.fot} />
          <Slide photo={PHOTO.bad} />
        </div>
        <dl className="ki-facts ki-rv">
          <div><dt>Hlutverk</dt><dd>Öll innanhússhönnun</dd></div>
          <div><dt>Staða</dt><dd>Lokið</dd></div>
          <div><dt>Ljósmyndað</dt><dd>2025</dd></div>
        </dl>
      </section>

      {/* 05 · the dome: materials */}
      <section className="ki-dome" data-ki-band="light">
        <Headline className="ki-dome-title" text="Efnin bera rýmið." size={84} floor={32} />
        <div className="ki-dome-arch">
          <img src={PHOTO.sturta.src} srcSet={srcSet(PHOTO.sturta.src)} sizes="(max-width: 991px) 94vw, 72vw"
            alt={PHOTO.sturta.alt} loading="lazy" decoding="async" />
        </div>
        <p className="ki-body ki-dome-body ki-rv">
          Steinn sem heldur skugganum, viður sem heldur hitanum, kopar sem eldist
          með húsinu. Efnisvalið er helmingur hönnunarinnar; ljósið sér um hitt.
        </p>
      </section>

      {/* 06 · Italian cabinetry — follows straight on from the materials
          section above instead of interrupting the register with a pitch */}
      <section className="ki-italskar" data-ki-band="dark">
        <div className="ki-italskar-in">
          <Headline text="Ítalskar innréttingar." size={64} floor={30} measure={560} />
          <p className="ki-body ki-rv">
            Innréttingar fyrir eldhús og bað koma frá Ítalíu og eru teiknaðar inn í
            hvert verkefni frá grunni, hvort sem um er að ræða heimili eða
            gistiheimili.
          </p>
          <a className="ki-cta ki-rv" href="#samband" onClick={anchor('samband')}>Hafa samband</a>
        </div>
        <Slide photo={PHOTO.fEyja} className="ki-italskar-fig" />
      </section>

      {/* 07 · the register: the complete index, six more than the photographed
          overview above, so it earns its place instead of repeating it */}
      <section className="ki-skra" id="skra" data-ki-band="dark">
        <div className="ki-skra-head">
          <Headline text="Skráin öll." size={84} floor={34} />
          <p className="ki-body ki-rv">
            Sautján verk að ofan eru ljósmynduð; hér er skráin í heild, sex til
            viðbótar.
          </p>
          <p className="ki-skra-count ki-rv" aria-label={`${REGISTER_COUNT} verk í ${REGISTER.length} flokkum`}>
            <span className="ki-skra-n">{REGISTER_COUNT}</span> verk ·{' '}
            <span className="ki-skra-n">{REGISTER.length}</span> flokkar
          </p>
        </div>
        <div className="ki-skra-cols">
          {REGISTER.map((f) => (
            <div key={f.flokkur} className="ki-skra-flokkur ki-rv">
              <h3 className="ki-skra-cat">{f.flokkur}</h3>
              <ul className="ki-skra-list">
                {f.verk.map((v) => (
                  <li key={v} className="ki-skra-row"><span>{v}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="ki-stat ki-rv">Verkefnaskráin eins og hún er birt á katrinisfeld.is, ágúst 2026.</p>
      </section>

      {/* 08 · the studio — the pedigree gets real weight here: a specific,
          hard-to-match credential, not a footnote before the contact block */}
      <section className="ki-studio" data-ki-band="light">
        <Slide photo={PHOTO.fStofa} className="ki-studio-fig" variant="shutter" />
        <div className="ki-studio-copy">
          <p className="ki-verk-kicker" aria-hidden="true">Bakgrunnur</p>
          <Headline text="Stúdíóið." size={78} floor={32} />
          <p className="ki-body ki-rv">
            Áður en Katrín opnaði stúdíóið sitt við Bankastræti starfaði hún á
            arkitektastofum í Hollandi og í Fort Lauderdale, þar sem hún hannaði
            glæsivillur. Sú reynsla mótar hvernig hún tekur að sér verkefni hér
            heima, hvort sem það er eitt herbergi eða húsið í heild.
          </p>
        </div>
      </section>

      {/* 09 · contact through the arch */}
      <section className="ki-samband" id="samband" data-ki-band="dark">
        <div className="ki-samband-in">
          <Headline text="Segðu Katrínu frá rýminu þínu." size={80} floor={32} measure={720} />
          <div className="ki-samband-row">
            <a className="ki-samband-tel" href={CONTACT.phoneHref}>{CONTACT.phone}</a>
            <a className="ki-cta" href={`mailto:${CONTACT.email}?subject=${encodeURIComponent('Fyrirspurn um hönnun')}`}>
              Hafa samband
            </a>
          </div>
          <p className="ki-samband-addr">{CONTACT.address} · {CONTACT.email}</p>
        </div>
      </section>

      <div className="ki-foot" data-ki-band="dark">
        <div className="ki-foot-grid">
          <div>
            <p className="ki-foot-mark">KATRÍN ÍSFELD</p>
            <p className="ki-foot-line">Innanhússarkitekt · {CONTACT.address}</p>
          </div>
          <div>
            <p className="ki-foot-line">{CONTACT.phone} · {CONTACT.email}</p>
          </div>
          <div>
            <p className="ki-foot-line">
              Allar myndir eru raunveruleg verkefni af katrinisfeld.is, sótt í ágúst 2026.
            </p>
            <p className="ki-foot-line">Frumgerð frá SNDR.</p>
          </div>
        </div>
      </div>
      </main>

      <PreviewFooter company={company} />
    </div>
  )
}

/* ── styles ────────────────────────────────────────────────────────────── */

const CSS = `
@font-face { font-family: 'Sentient'; src: url('${BASE}fonts/sentient/Sentient-Light.woff2') format('woff2'); font-weight: 300; font-display: swap; }
@font-face { font-family: 'Sentient'; src: url('${BASE}fonts/sentient/Sentient-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'Sentient'; src: url('${BASE}fonts/sentient/Sentient-LightItalic.woff2') format('woff2'); font-weight: 300; font-style: italic; font-display: swap; }
@font-face { font-family: 'Archia'; src: url('${BASE}fonts/archia/Archia-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'Geist Mono'; src: url('${BASE}fonts/geist-mono/GeistMono-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }

.ki-root {
  --u: clamp(.44px, 100vw / 1440, 1.15px);
  --ki-ground: ${CREAM};
  --ki-ink: ${INK};
  --ki-wine: ${WINE};
  --ki-copper: #B0714B;
  background: var(--ki-ground);
  color: var(--ki-ink);
  font-family: ${SANS};
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
}
.ki-root [id] { scroll-margin-top: 84px; }
.ki-root a, .ki-root button { touch-action: manipulation; }
.ki-skra-n, .ki-loader-pct { font-variant-numeric: tabular-nums; }
.ki-root ::selection { background: var(--ki-wine); color: #F4EEE6; }
.ki-root :focus-visible { outline: 2px solid var(--ki-copper); outline-offset: 3px; border-radius: 2px; }

/* section colour worlds — the semantic theme swap */
[data-ki-band] { position: relative; }
[data-ki-band='dark'] { background: ${CHARCOAL}; color: #EDE7DE; --ki-mute: #B9B1A5; --ki-hair: rgb(237 231 222 / .16); }
[data-ki-band='light'] { background: ${CREAM}; color: ${INK}; --ki-mute: #6E675D; --ki-hair: rgb(35 31 27 / .16); }
[data-ki-band='summer'] { background: #E9E2D5; color: #2A251E; --ki-mute: #6E675B; --ki-hair: rgb(42 37 30 / .16); }
.ki-verk-sulu { background: #241B19; }
.ki-italskar { background: #3B2320; color: #EFE6DC; }

/* chrome: fixed, each element themes itself with a 0.4s colour swap */
.ki-nav {
  position: fixed; inset: 0 0 auto 0; z-index: 40;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: calc(var(--u) * 22) calc(var(--u) * 34);
  pointer-events: none;
}
.ki-nav a { pointer-events: auto; text-decoration: none; transition: color .4s linear, opacity .25s ${OUT}; }
.ki-nav a[data-ki-on='dark'] { color: #EDE7DE; }
.ki-nav a[data-ki-on='light'], .ki-nav a:not([data-ki-on]) { color: ${INK}; }
.ki-nav a:hover { opacity: .68; }
.ki-nav-mark { font-family: ${MONO}; font-size: ${fluid(13, 12)}; letter-spacing: .14em; }
.ki-nav-links { display: flex; gap: calc(var(--u) * 26); font-size: ${fluid(14, 13)}; }
.ki-nav-cta { font-size: ${fluid(14, 13)}; border-bottom: 1px solid currentColor; padding-bottom: 2px; }
@media (max-width: 640px) { .ki-nav-links { display: none; } }

/* loader: the arch aperture */
.ki-loader {
  position: fixed; inset: 0; z-index: 90; display: grid; place-content: end center;
  background: ${CHARCOAL}; transition: opacity .7s ${OUT}, visibility .7s ${OUT};
}
.ki-loader.is-leaving { opacity: 0; visibility: hidden; }
.ki-loader-arch {
  width: min(74vw, 520px); height: min(60vh, 560px);
  border: 1px solid rgb(237 231 222 / .3); border-bottom: none;
  border-radius: calc(var(--u) * 400) calc(var(--u) * 400) 0 0;
  display: grid; place-content: center; gap: 12px; text-align: center;
  animation: ki-arch-rise 1.1s ${OUT} both;
}
@keyframes ki-arch-rise { from { transform: translateY(18%); opacity: 0 } to { transform: none; opacity: 1 } }
.ki-loader-mark { font-family: ${DISPLAY}; font-weight: 300; font-size: ${fluid(38, 24)}; color: #EDE7DE; letter-spacing: .06em; margin: 0; }
.ki-loader-pct { font-family: ${MONO}; font-size: 12px; color: #8E867A; margin: 0; }

/* hero */
.ki-hero { position: relative; height: 100svh; min-height: 560px; overflow: hidden; display: grid; align-items: end; }
.ki-hero-media { position: absolute; inset: 0; }
.ki-hero-media img { width: 100%; height: 100%; object-fit: cover; will-change: transform; }
.ki-hero-scrim {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(180deg, rgb(18 14 12 / .3), transparent 38%, rgb(18 14 12 / .58) 92%);
}
.ki-hero-lockup { position: relative; z-index: 2; padding: 0 calc(var(--u) * 34) calc(var(--u) * 52); color: #F2ECE3; }
.ki-hero-title { color: inherit; }
.ki-hero-sub { font-size: ${fluid(17, 15)}; line-height: 1.6; max-width: 52ch; margin: calc(var(--u) * 20) 0 0; }

/* type */
.ki-headline { font-family: ${DISPLAY}; font-weight: 300; line-height: 1.13; letter-spacing: .002em; margin: 0 0 calc(var(--u) * 24); }
.ki-line { display: inline-block; overflow: hidden; padding-bottom: .22em; margin-bottom: -.22em; vertical-align: bottom; }
.ki-word { display: inline-block; }
.ki-body { font-size: ${fluid(17, 15)}; line-height: 1.68; color: var(--ki-mute, #6E675D); max-width: 60ch; margin: 0; }
.ki-stat { font-family: ${MONO}; font-size: ${fluid(12.5, 11.5)}; color: var(--ki-mute, #6E675D); margin: calc(var(--u) * 30) 0 0; }

/* reveals — ERA: reveal 1.2s Out; resting state is visible without JS */
.ki-js .ki-rv { opacity: 0; transform: translateY(34px); }
.ki-js .ki-rv.is-in { opacity: 1; transform: none; transition: opacity 1.2s ${OUT}, transform 1.2s ${OUT}; }
.ki-rule { display: block; width: calc(var(--u) * 220); height: 1px; background: currentColor; opacity: .4; margin-bottom: calc(var(--u) * 34); }
.ki-js .ki-rule { transform: scaleX(0); transform-origin: left; opacity: 0; }
.ki-js .ki-rule.is-in { transform: none; opacity: .4; transition: transform 1.2s ${OUT}, opacity .6s linear; }

/* slide: skewed polygon + inner counter-scale */
.ki-slide { position: relative; overflow: hidden; margin: 0; background: rgb(0 0 0 / .08); }
.ki-slide img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ki-js .ki-slide { clip-path: polygon(0 12%, 100% 0, 100% 88%, 0 100%); opacity: 0; }
.ki-js .ki-slide img { transform: scale(1.28); }
.ki-js .ki-slide.is-in { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); opacity: 1; transition: clip-path 1.2s ${OUT}, opacity .5s ${OUT}; }
.ki-js .ki-slide.is-in img { transform: scale(1); transition: transform 1.4s ${OUT}; }

/* shutter: converging panels */
.ki-shutter { position: relative; overflow: hidden; margin: 0; background: rgb(0 0 0 / .12); }
.ki-shutter img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ki-js .ki-shutter { clip-path: inset(0 50% 0 50%); }
.ki-js .ki-shutter img { transform: scale(1.24); }
.ki-js .ki-shutter.is-in { clip-path: inset(0 0 0 0); transition: clip-path 1.3s ${OUT}; }
.ki-js .ki-shutter.is-in img { transform: scale(1); transition: transform 1.6s ${OUT}; }

.ki-static .ki-rv, .ki-static .ki-slide, .ki-static .ki-shutter,
.ki-root:not(.ki-js) .ki-rv, .ki-root:not(.ki-js) .ki-slide, .ki-root:not(.ki-js) .ki-shutter {
  opacity: 1; transform: none; clip-path: none;
}
.ki-static .ki-slide img, .ki-static .ki-shutter img { transform: none; }

/* group entrances: a 45ms wave instead of every item in a row popping in at
   once (each cluster/grid restarts its own count, so nothing accumulates
   into a long tail by the last item) */
.ki-js .ki-yfirlit-grid .ki-verk-card:nth-child(3n+2) { transition-delay: 45ms; }
.ki-js .ki-yfirlit-grid .ki-verk-card:nth-child(3n+3) { transition-delay: 90ms; }
.ki-js .ki-verk-grid .ki-slide:nth-child(2) { transition-delay: 45ms; }
.ki-js .ki-verk-grid .ki-slide:nth-child(3) { transition-delay: 90ms; }
.ki-js .ki-verk-grid .ki-slide:nth-child(4) { transition-delay: 135ms; }
.ki-js .ki-skra-cols .ki-skra-flokkur:nth-child(2) { transition-delay: 45ms; }
.ki-js .ki-skra-cols .ki-skra-flokkur:nth-child(3) { transition-delay: 90ms; }
.ki-js .ki-skra-cols .ki-skra-flokkur:nth-child(4) { transition-delay: 135ms; }

@media (prefers-reduced-motion: reduce) {
  .ki-hero-media img { transform: none !important; }
  .ki-word { transform: none !important; opacity: 1 !important; }
}

/* sections */
.ki-intro { padding: calc(var(--u) * 150) calc(var(--u) * 34); }
.ki-verk { padding: calc(var(--u) * 130) calc(var(--u) * 34); }

/* THE OVERVIEW — clustered by category so breadth reads as three distinct
   bodies of work (homes / hospitality / business), not one undifferentiated
   wall. One ratio, one gutter within each cluster: still no collage. */
.ki-yfirlit { padding: calc(var(--u) * 140) calc(var(--u) * 34); }
.ki-yfirlit-head { max-width: calc(var(--u) * 900); margin-bottom: calc(var(--u) * 64); }
.ki-yfirlit-cluster + .ki-yfirlit-cluster { margin-top: calc(var(--u) * 76); }
.ki-yfirlit-cat {
  display: flex; align-items: baseline; gap: calc(var(--u) * 14);
  font-family: ${MONO}; font-size: ${fluid(12.5, 11.5)}; letter-spacing: .13em; text-transform: uppercase;
  color: #D9A87E; border-top: 1px solid var(--ki-hair); padding-top: calc(var(--u) * 18);
  margin: 0 0 calc(var(--u) * 28);
}
.ki-yfirlit-cat-n { font-family: ${SANS}; letter-spacing: 0; text-transform: none; color: var(--ki-mute); font-size: ${fluid(12.5, 11.5)}; }
.ki-yfirlit-grid {
  list-style: none; margin: 0; padding: 0;
  display: grid; grid-template-columns: repeat(var(--cluster-cols, 3), 1fr); gap: calc(var(--u) * 34) calc(var(--u) * 28);
}
.ki-verk-card-fig { margin: 0; overflow: hidden; background: rgb(0 0 0 / .18); }
.ki-verk-card-fig img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; display: block; transition: transform .6s ${OUT}; }
@media (hover: hover) { .ki-verk-card:hover .ki-verk-card-fig img { transform: scale(1.04); } }
.ki-verk-card-meta { padding-top: 10px; }
.ki-verk-card-name { font-size: ${fluid(16, 14.5)}; }
.ki-verk-kicker { font-family: ${MONO}; font-size: ${fluid(12.5, 11.5)}; letter-spacing: .14em; text-transform: uppercase; color: #8A5A33; margin: 0 0 calc(var(--u) * 16); }
[data-ki-band='dark'] .ki-verk-kicker, .ki-verk-sulu .ki-verk-kicker { color: #D9A87E; }
.ki-verk-head { max-width: calc(var(--u) * 860); margin-bottom: calc(var(--u) * 54); }
.ki-verk-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: calc(var(--u) * 40); }
.ki-verk-grid .ki-slide:nth-child(2) { margin-top: calc(var(--u) * 70); }
.ki-verk-grid .ki-slide:nth-child(3) { margin-top: calc(var(--u) * -50); }
.ki-facts { display: flex; flex-wrap: wrap; gap: calc(var(--u) * 60); margin: calc(var(--u) * 50) 0 0; }
.ki-facts dt { font-family: ${MONO}; font-size: ${fluid(11.5, 11)}; letter-spacing: .12em; text-transform: uppercase; color: var(--ki-mute); margin-bottom: 6px; }
.ki-facts dd { margin: 0; font-size: ${fluid(16, 14.5)}; }

/* dome */
.ki-dome { padding: calc(var(--u) * 150) calc(var(--u) * 34) calc(var(--u) * 120); text-align: center; overflow: hidden; }
.ki-dome-title { margin-inline: auto; white-space: nowrap; }
.ki-dome-arch {
  width: min(100%, calc(var(--u) * 900)); margin: calc(var(--u) * 40) auto 0;
  border-radius: calc(var(--u) * 450) calc(var(--u) * 450) 0 0; overflow: hidden;
  will-change: transform;
}
.ki-dome-arch img { width: 100%; aspect-ratio: 4 / 4.4; object-fit: cover; display: block; }
.ki-dome-body { margin: calc(var(--u) * 44) auto 0; }

/* register */
.ki-skra { padding: calc(var(--u) * 140) calc(var(--u) * 34); }
.ki-skra-head { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 18px; margin-bottom: calc(var(--u) * 50); }
.ki-skra-count { font-family: ${MONO}; font-size: ${fluid(14, 12.5)}; color: var(--ki-mute); margin: 0; }
.ki-skra-n { font-family: ${DISPLAY}; font-weight: 300; font-size: ${fluid(40, 24)}; color: #EDE7DE; padding: 0 .1em; }
.ki-skra-cols { display: grid; grid-template-columns: repeat(4, 1fr); gap: calc(var(--u) * 44); align-items: start; }
.ki-skra-cat { font-family: ${MONO}; font-size: ${fluid(12, 11)}; letter-spacing: .13em; text-transform: uppercase; font-weight: 400; color: var(--ki-copper); margin: 0 0 calc(var(--u) * 18); }
.ki-skra-list { list-style: none; margin: 0; padding: 0; }
.ki-skra-row {
  position: relative; border-top: 1px solid var(--ki-hair);
  padding: 12px 0; font-size: ${fluid(15.5, 14)};
  transition: color .8s ${OUT};
}
.ki-skra-row > span { display: inline-block; transition: transform .8s ${OUT}; }
.ki-skra-row::before {
  content: ''; position: absolute; left: 0; top: 50%; translate: 0 -50%;
  width: 10px; height: 1px; background: var(--ki-copper);
  transform: scaleX(0); transform-origin: left; transition: transform .8s ${OUT};
}
@media (hover: hover) {
  .ki-skra-row:hover { color: var(--ki-copper); }
  .ki-skra-row:hover > span { transform: translateX(18px); }
  .ki-skra-row:hover::before { transform: scaleX(1); }
}

/* Italian cabinetry */
.ki-italskar { display: grid; grid-template-columns: 1.1fr 1fr; gap: calc(var(--u) * 70); align-items: center; padding: calc(var(--u) * 120) calc(var(--u) * 34); }
.ki-italskar .ki-body { color: #C9B8AC; }
.ki-italskar-fig { max-width: calc(var(--u) * 460); justify-self: end; width: 100%; }

/* studio */
.ki-studio { display: grid; grid-template-columns: 1fr 1.2fr; gap: calc(var(--u) * 70); align-items: center; padding: calc(var(--u) * 140) calc(var(--u) * 34); }
.ki-studio-fig { max-width: calc(var(--u) * 440); width: 100%; }

/* contact */
.ki-samband { padding: calc(var(--u) * 60) 0 0; }
.ki-samband-in {
  text-align: center; padding: calc(var(--u) * 140) calc(var(--u) * 34) calc(var(--u) * 60);
  background: #16211E; color: #E9EDE8;
  /* the arch, held in CSS so no tween can drop it */
  border-radius: calc(var(--u) * 420) calc(var(--u) * 420) 0 0;
  overflow: hidden; will-change: transform;
  /* both grounds are near-black, so the dome needs its own drawn edge */
  box-shadow: inset 0 1px 0 rgb(237 231 222 / .22);
}
.ki-samband-in .ki-headline { margin-inline: auto; }
.ki-samband-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: calc(var(--u) * 34); margin-top: calc(var(--u) * 26); }
.ki-samband-tel { font-family: ${DISPLAY}; font-weight: 300; font-size: ${fluid(56, 26)}; color: inherit; text-decoration: none; transition: color .3s ${OUT}; }
.ki-samband-tel:hover { color: var(--ki-copper); }
.ki-samband-addr { font-family: ${MONO}; font-size: ${fluid(13, 12)}; color: #9AA79F; margin-top: calc(var(--u) * 20); }
.ki-cta {
  display: inline-block; font-size: ${fluid(16, 15)}; color: #171310;
  background: #EDE7DE; padding: calc(var(--u) * 16) calc(var(--u) * 30);
  text-decoration: none; transition: opacity .25s ${OUT}, transform .16s ${OUT};
}
.ki-cta:hover { opacity: .85; }
.ki-cta:active { transform: scale(.97); }
.ki-italskar .ki-cta, .ki-samband .ki-cta { background: #EDE7DE; color: #171310; }

/* footer */
.ki-foot { border-top: 1px solid rgb(237 231 222 / .14); padding: calc(var(--u) * 42) calc(var(--u) * 34) calc(var(--u) * 42); background: ${CHARCOAL}; color: #EDE7DE; }
.ki-foot-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 34); }
.ki-foot-mark { font-family: ${MONO}; font-size: ${fluid(13, 12)}; letter-spacing: .14em; margin: 0 0 10px; }
.ki-foot-line { font-size: ${fluid(13.5, 12.5)}; color: #B9B1A5; margin: 0 0 6px; line-height: 1.6; }

/* responsive */
@media (max-width: 991px) {
  .ki-verk-grid { grid-template-columns: 1fr; }
  .ki-yfirlit-grid { grid-template-columns: repeat(2, 1fr); }
  .ki-verk-grid .ki-slide:nth-child(2), .ki-verk-grid .ki-slide:nth-child(3) { margin-top: 0; }
  .ki-skra-cols { grid-template-columns: 1fr 1fr; }
  .ki-foot-grid { grid-template-columns: 1fr; }
  .ki-dome-title { white-space: normal; }
}
/* Text + one modest figure: these hold as two columns far below the page's
   main 991 breakpoint. Collapsing them early left the figure at its desktop
   max-width in a full-width column, i.e. a dead half-screen beside it. */
@media (max-width: 860px) {
  .ki-italskar, .ki-studio { grid-template-columns: 1fr; gap: calc(var(--u) * 40); }
  .ki-italskar-fig, .ki-studio-fig { justify-self: stretch; max-width: none; width: 100%; }
}
@media (max-width: 640px) {
  .ki-intro, .ki-verk, .ki-dome, .ki-skra, .ki-italskar, .ki-studio { padding-left: 20px; padding-right: 20px; }
  .ki-samband-in { padding: calc(var(--u) * 140) 20px 16px; }
  .ki-samband-row { margin-top: 16px; }
  .ki-samband-addr { margin-top: 10px; }
  .ki-skra-cols { grid-template-columns: 1fr; }
  .ki-yfirlit { padding-left: 20px; padding-right: 20px; }
  .ki-yfirlit-grid { grid-template-columns: 1fr; }
  .ki-hero-lockup { padding: 0 20px 34px; }
  /* the footer's three columns stack full-height here (single column), so
     the fixed nav needs more headroom above the final CTA than desktop */
  .ki-foot { padding: 14px 20px; }
  .ki-foot-grid { gap: 8px; }
}
`
