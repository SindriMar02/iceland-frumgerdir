import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  CONTACT, JSON_LD, LOGOS, PACKAGES, PHOTO, srcSet, type HmPhoto,
} from './data'

gsap.registerPlugin(ScrollTrigger)

const company = getPreviewCompany('huldamargret')

/* ── HULDA MARGRÉT · "EINN DAGUR" ──────────────────────────────────────────
   One page, one working day of the studio. The canvas follows the sun:
   morning paper-light for executive portraits, cool daylight on the pitch,
   the golden hour for a wedding, and stage-dark night for concerts. A single
   scroll-driven palette lerp (Mirror House lineage, new arc, new palette),
   Icelandic day-phase labels carrying the structure, and a pinned climax:
   the day's CONTACT SHEET, five of her frames dealt across one pin while
   the light dies to night. Every photograph is her own published work.

   Scoped fluid unit --u on .hm-root only ([[no-style-bleed-between-designs]]).
   Display leading never below 1.12 with .22em mask headroom (ledger #23).

   Motion identity (one per site): "the shutter". Images arrive by a vertical
   shutter-wipe with a one-shot exposure settle; frames then drift inside
   fixed boxes (Heklusýn spec: derived --dz, batched reads before writes).
   Text rises through word masks. The seam-reveal appears ONCE, in the hero:
   the wordmark opens out of a hairline the way a leaf shutter opens. ────── */

const MORNING = '#F1EFEA'
const NIGHT = '#101017'
const INK_DAY = '#2C2823'
const GOLD = '#B98A45'

const DISPLAY = "'Erode', Georgia, serif"
const SANS = "'Supreme', system-ui, sans-serif"
const MONO = "'Azeret Mono', ui-monospace, monospace"

const BASE = import.meta.env.BASE_URL

/**
 * Palette stops: morning paper → cool daylight → golden hour → night.
 * Canvas and ink cross fast (Mirror House lesson: a slow crossover parks
 * body copy at 2.6:1 mid-grey). The crossover sits inside the contact-sheet
 * pin, so the light dies while the day is being recapped.
 */
const STOPS = [
  { at: 0.0, c: '#F1EFEA', ink: '#2C2823', soft: '#E7E3DA' },
  { at: 0.3, c: '#EDEEEC', ink: '#25292B', soft: '#E0E4E2' },
  { at: 0.52, c: '#EBDFC9', ink: '#33291A', soft: '#E2D3B6' },
  { at: 0.62, c: '#E4D2B4', ink: '#33281733', soft: '#DAC59F' }, // approach
  { at: 0.68, c: '#241F1E', ink: '#EDE8E1', soft: '#2E2827' },
  { at: 0.74, c: '#101017', ink: '#EEEDF0', soft: '#1A1A22' },
  { at: 1.0, c: '#101017', ink: '#EEEDF0', soft: '#1A1A22' },
]
// the 0.62 ink above carries a typo-guard: never ship 8-digit hex into mix
STOPS[3].ink = '#332817'

const hex2rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const mixHex = (a: string, b: string, t: number) => {
  const A = hex2rgb(a), B = hex2rgb(b)
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`
}
const paletteAt = (p: number) => {
  let i = 0
  while (i < STOPS.length - 2 && p > STOPS[i + 1].at) i++
  const a = STOPS[i], b = STOPS[i + 1]
  const t = Math.max(0, Math.min(1, (p - a.at) / (b.at - a.at || 1)))
  return { c: mixHex(a.c, b.c, t), ink: mixHex(a.ink, b.ink, t), soft: mixHex(a.soft, b.soft, t) }
}

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

/** Fluid size with a phone floor. */
const fluid = (n: number, floor: number) =>
  `clamp(${floor}px, calc(var(--u) * ${n}), ${+(n * 1.15).toFixed(1)}px)`

/* ── motion engine: one Lenis clock drives drift + reveals + palette ───── */

function useMotion(ready: boolean) {
  useEffect(() => {
    if (!ready) return
    const root = document.querySelector<HTMLElement>('.hm-root')
    if (!root) return

    if (reduced()) {
      root.classList.add('hm-static')
      const { c, ink, soft } = paletteAt(0)
      root.style.setProperty('--hm-c', c)
      root.style.setProperty('--hm-ink', ink)
      root.style.setProperty('--hm-soft', soft)
      return
    }

    root.classList.add('hm-js')
    ScrollTrigger.config({ ignoreMobileResize: true })
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })

    /* drift: Heklusýn spec — batched reads then writes, off-screen skipped,
       and frozen while the contact-sheet pin holds the viewport still */
    const frames = Array.from(root.querySelectorAll<HTMLElement>('.hm-frame-in'))
    let sheetST: ScrollTrigger | null = null
    const drift = () => {
      if (sheetST?.isActive) return
      const vh = window.innerHeight
      const writes: [HTMLElement, string][] = []
      for (const el of frames) {
        const box = el.parentElement
        if (!box) continue
        const r = box.getBoundingClientRect()
        if (r.bottom < -240 || r.top > vh + 240) continue
        const d = Number(el.dataset.drift || 9)
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
        writes.push([el, `translate3d(0,${(-p * d).toFixed(2)}%,0)`])
      }
      for (const [el, t] of writes) el.style.transform = t
    }

    /* palette: ONE writer for the whole page */
    let lastC = '', lastInk = '', lastSoft = ''
    const applyPalette = (p: number) => {
      const { c, ink, soft } = paletteAt(p)
      if (c !== lastC) { root.style.setProperty('--hm-c', c); lastC = c }
      if (ink !== lastInk) { root.style.setProperty('--hm-ink', ink); lastInk = ink }
      if (soft !== lastSoft) { root.style.setProperty('--hm-soft', soft); lastSoft = soft }
      const rgb = c.match(/\d+/g)!.map(Number)
      const lin = rgb.map((v) => { const x = v / 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4) })
      const night = 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2] < 0.18
      if (root.classList.contains('hm-night') !== night) {
        root.classList.toggle('hm-night', night)
        setThemeColor(night ? NIGHT : MORNING)
      }
    }
    applyPalette(0)

    /* shutter reveals: IO arms a class once; CSS owns the transition */
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-in')),
      // threshold 0: a figure taller than the sampling window that is scrolled
      // past fast never reaches a ratio threshold, and stays clipped forever.
      { threshold: 0, rootMargin: '0px 0px -8% 0px' },
    )
    root.querySelectorAll('.hm-rv').forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in')
      io.observe(el)
    })

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 0,
        end: () => document.documentElement.scrollHeight - window.innerHeight,
        onUpdate: (self) => applyPalette(self.progress),
        invalidateOnRefresh: true,
      })

      /* THE WORDMARK — the leaf shutter.
         A hairline stands between the two names. It draws itself, then HULDA
         opens leftward out of it and MARGRÉT rightward, the way a leaf
         shutter opens around its own centre line. Clip-path only. Scroll
         keeps opening it: the halves part further and the line grows past
         them as the page leaves the hero. */
      const seam = root.querySelector<HTMLElement>('.hm-wm-seam')
      const wmL = root.querySelector<HTMLElement>('.hm-wm-a')
      const wmR = root.querySelector<HTMLElement>('.hm-wm-b')
      const heroEl = root.querySelector<HTMLElement>('.hm-hero')

      if (seam && wmL && wmR && heroEl) {
        gsap.set(seam, { scaleY: 0 })
        gsap.set(wmL, { clipPath: 'inset(0% 0% 0% 100%)' })
        gsap.set(wmR, { clipPath: 'inset(0% 100% 0% 0%)' })

        const open = () => {
          gsap.timeline()
            .to(seam, { scaleY: 1, duration: 0.85, ease: 'expo.out' })
            .to([wmL, wmR], { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.out' }, '-=0.42')
            .from([wmL, wmR], { x: (i: number) => (i === 0 ? 26 : -26), duration: 1.5, ease: 'expo.out' }, '<')
        }

        if (document.querySelector('.hm-loader')) {
          window.addEventListener('hm:revealed', open, { once: true })
        } else {
          gsap.delayedCall(0.12, open)
        }

        const driveOn = { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: 0.6 }
        gsap.to(wmL, { xPercent: -12, opacity: 0.08, ease: 'none', scrollTrigger: driveOn })
        gsap.to(wmR, { xPercent: 12, opacity: 0.08, ease: 'none', scrollTrigger: driveOn })
        gsap.to(seam, { scaleY: 3.2, opacity: 0, ease: 'none', scrollTrigger: driveOn })
      }

      /* word-mask rises */
      root.querySelectorAll<HTMLElement>('[data-hm-headline]').forEach((h) => {
        const words = h.querySelectorAll<HTMLElement>('.hm-word')
        if (!words.length) return
        gsap.fromTo(
          words,
          { yPercent: 116, opacity: 0 },
          {
            yPercent: 0, opacity: 1,
            duration: 1.05, ease: 'expo.out', stagger: 0.07,
            scrollTrigger: { trigger: h, start: 'top 88%', once: true },
          },
        )
      })

      /* THE CONTACT SHEET — the day recapped in five frames while the light
         dies. A pinned horizontal track (desktop only; phones get a native
         scroll-snap strip). The master palette's crossover sits inside this
         pin, so night falls between the wedding frame and the stage frame. */
      const sheet = root.querySelector<HTMLElement>('.hm-sheet')
      const track = root.querySelector<HTMLElement>('.hm-sheet-track')
      if (sheet && track && window.matchMedia('(min-width: 768px)').matches) {
        const travel = () => Math.max(0, track.scrollWidth - window.innerWidth)
        const tween = gsap.to(track, {
          x: () => -travel(),
          ease: 'none',
          scrollTrigger: {
            trigger: sheet,
            start: 'top top',
            end: () => `+=${travel() + window.innerHeight * 0.5}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        sheetST = tween.scrollTrigger ?? null
      }
    }, root)

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => { drift(); lenis.raf(t * 1000) }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    drift()

    return () => {
      io.disconnect()
      gsap.ticker.remove(tick)
      ctx.revert()
      lenis.destroy()
    }
  }, [ready])
}

/* ── primitives ────────────────────────────────────────────────────────── */

/** Split PER WORD, never per character (Icelandic accent risk, ledger #23). */
function Headline({ text, size, floor, as: Tag = 'h2', className = '', measure }: {
  text: string; size: number; floor: number
  as?: 'h1' | 'h2' | 'h3'; className?: string; measure?: number
}) {
  return (
    <Tag
      data-hm-headline
      aria-label={text}
      className={`hm-headline ${className}`}
      style={{
        fontSize: fluid(size, floor),
        maxWidth: measure ? `calc(var(--u) * ${measure})` : undefined,
      }}
    >
      {text.split(' ').map((w, i, arr) => (
        <span key={i} aria-hidden="true">
          <span className="hm-line"><span className="hm-word">{w}</span></span>
          {i < arr.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

/** Day-phase label: the page's only recurring structural device. */
function Phase({ is, en }: { is: string; en: string }) {
  return (
    <p className="hm-phase">
      <span className="hm-phase-is">{is}</span>
      <span aria-hidden="true"> · </span>
      <span>{en}</span>
    </p>
  )
}

/** A photograph that drifts inside a fixed frame and arrives by shutter-wipe. */
function Frame({ photo, drift = 9, priority = false, className = '' }: {
  photo: HmPhoto
  drift?: number; priority?: boolean; className?: string
}) {
  return (
    <figure className={`hm-frame hm-rv ${className}`} style={{ aspectRatio: photo.ratio }}>
      <div
        className="hm-frame-in"
        data-drift={drift}
        style={{ '--dz': `${Math.max(9, drift * 1.35)}%` } as React.CSSProperties}
      >
        <img src={photo.src} srcSet={srcSet(photo.src)} sizes="(max-width: 991px) 100vw, 60vw"
          alt={photo.alt} loading={priority ? 'eager' : 'lazy'} decoding="async" />
      </div>
    </figure>
  )
}

/* ── preloader (Heklusýn spec) ─────────────────────────────────────────── */

const shouldShowLoader = () => {
  if (typeof window === 'undefined' || reduced()) return false
  if (new URLSearchParams(window.location.search).has('loader')) return true
  try { return !sessionStorage.getItem('hm_seen') } catch { return true }
}

function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    try { sessionStorage.setItem('hm_seen', '1') } catch { /* private mode */ }
    const t0 = performance.now()
    let raf = 0
    let shown = 0
    const hero = document.querySelector<HTMLImageElement>('.hm-hero-media img')
    let target = 0
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
      target = ((heroDone ? 55 : Math.min(50, t / 24)) + (fontsDone ? 45 : 0))
      if (t >= CAP) target = 100
      shown += (target - shown) * 0.12
      const display = Math.min(100, Math.round(shown))
      setPct(display)
      if (display >= 100 && t >= FLOOR) {
        setLeaving(true)
        window.setTimeout(onDone, 950)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  return (
    <div className={`hm-loader ${leaving ? 'is-leaving' : ''}`} aria-hidden="true">
      <p className="hm-loader-mark" style={{ backgroundPositionX: `${100 - pct}%` }}>
        HULDA&nbsp;MARGRÉT
      </p>
      <p className="hm-loader-pct">{pct}%</p>
    </div>
  )
}

/* ── the page ──────────────────────────────────────────────────────────── */

const SHEET: Array<{ photo: HmPhoto; is: string; en: string }> = [
  { photo: PHOTO.portrettA, is: 'Morgunn', en: 'Portrett' },
  { photo: PHOTO.vollur, is: 'Dagur', en: 'Á vellinum' },
  { photo: PHOTO.ferming, is: 'Síðdegi', en: 'Fjölskyldan' },
  { photo: PHOTO.brudkaup, is: 'Gullna stundin', en: 'Brúðkaup' },
  { photo: PHOTO.svid, is: 'Kvöld', en: 'Á sviðinu' },
]

export default function HuldaMargretPage() {
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(shouldShowLoader)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setThemeColor(MORNING)
    document.title = 'Hulda Margrét ljósmyndari'
    setReady(true)
  }, [])

  useMotion(ready)

  const anchor = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <div ref={rootRef} className="hm-root">
      <style>{CSS}</style>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />
      {loading && <Preloader onDone={() => { setLoading(false); window.dispatchEvent(new Event('hm:revealed')) }} />}

      {/* nav */}
      <header className="hm-nav">
        <a className="hm-nav-mark" href="#top" onClick={anchor('top')}>HULDA&nbsp;MARGRÉT</a>
        <nav className="hm-nav-links" aria-label="Síða">
          <a href="#dagurinn" onClick={anchor('dagurinn')}>Dagurinn</a>
          <a href="#verdskra" onClick={anchor('verdskra')}>Verðskrá</a>
        </nav>
        <a className="hm-nav-cta" href="#samband" onClick={anchor('samband')}>Bóka myndatöku</a>
      </header>

      {/* 01 · hero (morning) */}
      <main>
      <section className="hm-hero" id="top">
        <div className="hm-hero-media hm-rv">
          <div className="hm-frame-in" data-drift={13}
            style={{ '--dz': `${(13 * 1.35).toFixed(2)}%` } as React.CSSProperties}>
            <img src={PHOTO.brudkaup.src} srcSet={srcSet(PHOTO.brudkaup.src)} sizes="100vw"
              alt={PHOTO.brudkaup.alt} loading="eager" decoding="async" />
          </div>
        </div>
        <h1 className="hm-wordmark" aria-label="Hulda Margrét ljósmyndari">
          <span className="hm-wm-word hm-wm-a" aria-hidden="true">HULDA</span>
          <span className="hm-wm-seam" aria-hidden="true" />
          <span className="hm-wm-word hm-wm-b" aria-hidden="true">MARGRÉT</span>
        </h1>
        <div className="hm-hero-block">
          <p className="hm-hero-sub">
            Ljósmyndari sem fylgir deginum: portrett að morgni, landsleikur um miðjan
            dag, brúðkaup í gullnu stundinni.
          </p>
          <a className="hm-hero-link" href="#samband" onClick={anchor('samband')}>Bóka myndatöku</a>
        </div>
      </section>

      {/* 02 · manifesto */}
      <section className="hm-manifesto">
        <div className="hm-manifesto-copy">
          <Headline text="Augnablikið gerist einu sinni." size={96} floor={40} measure={700} />
          <p className="hm-body hm-rv">
            Það verður ekki endurtekið: markið, jáið, fyrsti hljómurinn. Vinnan er
            að standa á réttum stað þegar það gerist, með ljósið lesið fyrirfram.
            Þessi síða fylgir einum vinnudegi, og hvert verk á henni er raunverulegt.
          </p>
        </div>
        <Frame photo={PHOTO.studio} drift={9} className="hm-manifesto-fig" />
      </section>

      {/* 03 · morning, portraits */}
      <section className="hm-morgunn" id="dagurinn">
        <div className="hm-morgunn-copy">
          <Phase is="Morgunn" en="Portrett" />
          <Headline text="Dagurinn byrjar í augnhæð." size={64} floor={32} measure={560} />
          <p className="hm-body hm-rv">
            Vönduð og traustvekjandi portrett fyrir stjórnendur og starfsfólk, tekin
            fyrir heimasíður, ársskýrslur, fréttir og viðburði. Hálftími fyrir
            manneskju sem á að þekkjast á myndinni sinni.
          </p>
        </div>
        <div className="hm-morgunn-figs">
          <Frame photo={PHOTO.portrettA} drift={9} />
          <Frame photo={PHOTO.portrettB} drift={7} className="hm-morgunn-b" />
        </div>
      </section>

      {/* 04 · day, the pitch */}
      <section className="hm-dagur">
        <div className="hm-dagur-head">
          <Phase is="Dagur" en="Á vellinum" />
          <Headline text="Svo flautar dómarinn." size={64} floor={32} measure={560} />
        </div>
        <Frame photo={PHOTO.vollur} drift={12} className="hm-dagur-bleed" />
        <div className="hm-dagur-foot">
          <p className="hm-body hm-rv">
            Íþróttir, viðburðir og vörur: hraðar aðstæður þar sem augnablikið vinnst
            með viðbragði, ekki uppstillingu.
          </p>
          <Frame photo={PHOTO.vara} drift={8} className="hm-dagur-vara" />
        </div>
      </section>

      {/* 05 · afternoon, families */}
      <section className="hm-sidegi">
        <div className="hm-sidegi-figs">
          <Frame photo={PHOTO.ferming} drift={9} />
        </div>
        <div className="hm-sidegi-copy">
          <Phase is="Síðdegi" en="Fjölskyldan" />
          <Headline text="Síðdegið á fjölskyldan." size={56} floor={30} measure={520} />
          <p className="hm-body hm-rv">
            Fermingar, fjölskyldur og hópar. Myndir sem hanga uppi árum saman eiga
            skilið dagsljós og næði frekar en flýti.
          </p>
        </div>
      </section>

      {/* 06 · the contact sheet: golden hour dies into night inside this pin */}
      <section className="hm-sheet" aria-label="Snertiörk dagsins">
        <div className="hm-sheet-head">
          <Phase is="Gullna stundin" en="Brúðkaup" />
          <Headline text="Fimm augnablik. Einn dagur." size={64} floor={30} measure={620} />
        </div>
        <div className="hm-sheet-track">
          {SHEET.map((s) => (
            <figure key={s.is} className="hm-sheet-cell">
              <img src={s.photo.src} srcSet={srcSet(s.photo.src)}
                sizes="(max-width: 767px) 86vw, 44vw"
                alt={s.photo.alt} loading="lazy" decoding="async" />
              <figcaption>
                <span className="hm-sheet-is">{s.is}</span>
                <span className="hm-sheet-en">{s.en}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* 07 · night: clients */}
      <section className="hm-vidskipta">
        <Phase is="Kvöld" en="Á sviðinu" />
        <Headline text="Þeir sem hringja aftur." size={64} floor={32} measure={620} />
        <p className="hm-body hm-rv">
          Yfir þrjátíu fyrirtæki og félög sýna merkin sín á vef Huldu. Hér eru tólf.
        </p>
        {/* One continuous band: the client list is breadth, not twelve items
            each deserving its own tile. The second run is aria-hidden so the
            loop is seamless without doubling it for screen readers. */}
        <div className="hm-marquee hm-rv" data-hm-marquee>
          <div className="hm-marquee-track">
            <ul className="hm-marquee-run" aria-label="Meðal viðskiptavina">
              {LOGOS.map((l) => (
                <li key={l.name} className="hm-logo-chip">
                  <img src={l.src} alt={l.name} loading="lazy" decoding="async" />
                </li>
              ))}
            </ul>
            <ul className="hm-marquee-run" aria-hidden="true">
              {LOGOS.map((l) => (
                <li key={`${l.name}-2`} className="hm-logo-chip">
                  <img src={l.src} alt="" loading="lazy" decoding="async" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 08 · price list (real) */}
      <section className="hm-verd" id="verdskra">
        <Headline text="Verðskrá brúðkaupa." size={72} floor={34} measure={560} />
        <ul className="hm-verd-grid">
          {PACKAGES.map((p) => (
            <li key={p.name} className="hm-verd-card hm-rv">
              <p className="hm-verd-name">{p.name}</p>
              <p className="hm-verd-price">{p.price}</p>
              <ul className="hm-verd-inc">
                {p.includes.map((i) => <li key={i}>{i}</li>)}
              </ul>
            </li>
          ))}
        </ul>
        <p className="hm-stat hm-rv">
          Verð af vef Huldu, ágúst 2026. Innifalinn er allt að 60 mínútna akstur.
          Aðrar myndatökur: hafðu samband.
        </p>
      </section>

      {/* 09 · contact */}
      <section className="hm-samband" id="samband">
        <Headline text="Dagurinn þinn er næstur." size={80} floor={36} measure={640} />
        <div className="hm-samband-row hm-rv">
          <a className="hm-samband-tel" href={CONTACT.phoneHref}>{CONTACT.phone}</a>
          <a className="hm-cta" href={`mailto:${CONTACT.email}?subject=${encodeURIComponent('Fyrirspurn um myndatöku')}`}>
            Bóka myndatöku
          </a>
        </div>
        <p className="hm-samband-mail hm-rv">{CONTACT.email}</p>
      </section>

      {/* footer facts */}
      <div className="hm-foot">
        <div className="hm-foot-grid">
          <div>
            <p className="hm-foot-mark">HULDA MARGRÉT</p>
            <p className="hm-foot-line">Ljósmyndastúdíó Huldu Margrétar</p>
          </div>
          <div>
            <p className="hm-foot-line">{CONTACT.phone}</p>
            <p className="hm-foot-line">{CONTACT.email}</p>
          </div>
          <div>
            <p className="hm-foot-line">
              Allar myndir og öll verð eru af vef Huldu, huldamargret.is, ágúst 2026.
            </p>
            <p className="hm-foot-line">Frumgerð frá SNDR.</p>
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
@font-face { font-family: 'Erode'; src: url('${BASE}fonts/erode/Erode-Light.woff2') format('woff2'); font-weight: 300; font-display: swap; }
@font-face { font-family: 'Erode'; src: url('${BASE}fonts/erode/Erode-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'Erode'; src: url('${BASE}fonts/erode/Erode-Medium.woff2') format('woff2'); font-weight: 500; font-display: swap; }
@font-face { font-family: 'Supreme'; src: url('${BASE}fonts/supreme/Supreme-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'Supreme'; src: url('${BASE}fonts/supreme/Supreme-Medium.woff2') format('woff2'); font-weight: 500; font-display: swap; }
@font-face { font-family: 'Azeret Mono'; src: url('${BASE}fonts/azeret-mono/AzeretMono-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }

.hm-root {
  --u: clamp(.44px, 100vw / 1440, 1.15px);
  --hm-c: ${MORNING};
  --hm-ink: ${INK_DAY};
  --hm-soft: #E7E3DA;
  --hm-gold: ${GOLD};
  /* gold reads too pale on the morning canvas; text uses a deeper cut */
  --hm-accent-text: #7A5A26;
  --hm-mute: color-mix(in srgb, var(--hm-ink) 76%, transparent);
  --hm-hair: color-mix(in srgb, var(--hm-ink) 16%, transparent);
  background: var(--hm-c);
  color: var(--hm-ink);
  font-family: ${SANS};
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
}
.hm-root [id] { scroll-margin-top: 84px; }
.hm-root a, .hm-root button { touch-action: manipulation; }
.hm-night { color-scheme: dark; }
.hm-loader-pct, .hm-verd-price { font-variant-numeric: tabular-nums; }
.hm-root ::selection { background: var(--hm-gold); color: #1B150C; }
.hm-night { --hm-accent-text: #D9A65A; }
.hm-root :focus-visible { outline: 2px solid var(--hm-accent-text); outline-offset: 3px; border-radius: 2px; }

/* palette transitions ride the vars; chrome colour follows the sky */
.hm-root, .hm-nav, .hm-frame, .hm-logo-chip, .hm-verd-card { transition: background-color .4s linear, color .4s linear, border-color .4s linear; }

/* nav — fixed, borderless, difference-blend so no bar is ever needed */
.hm-nav {
  position: fixed; inset: 0 0 auto 0; z-index: 40;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: calc(var(--u) * 22) calc(var(--u) * 34);
  mix-blend-mode: difference; color: #F2EFE8; pointer-events: none;
}
.hm-nav a { pointer-events: auto; color: inherit; text-decoration: none; }
.hm-nav-mark { font-family: ${MONO}; font-size: ${fluid(13, 12)}; letter-spacing: .14em; }
.hm-nav-links { display: flex; gap: calc(var(--u) * 26); font-size: ${fluid(14, 13)}; }
.hm-nav-links a:hover, .hm-nav-cta:hover { opacity: .72; }
.hm-nav-cta { font-size: ${fluid(14, 13)}; border-bottom: 1px solid currentColor; padding-bottom: 2px; }
@media (max-width: 640px) { .hm-nav-links { display: none; } }

/* loader */
.hm-loader {
  position: fixed; inset: 0; z-index: 90; display: grid; place-content: center; gap: 10px;
  background: ${MORNING}; transition: opacity .8s ease, visibility .8s ease;
}
.hm-loader.is-leaving { opacity: 0; visibility: hidden; }
.hm-loader-mark {
  font-family: ${DISPLAY}; font-weight: 300; font-size: ${fluid(54, 30)}; letter-spacing: .04em;
  background-image: linear-gradient(90deg, ${INK_DAY} 50%, #C9C2B4 50%);
  background-size: 200% 100%; -webkit-background-clip: text; background-clip: text;
  color: transparent;
}
.hm-loader-pct { font-family: ${MONO}; font-size: 12px; color: #8A8375; text-align: center; }

/* hero */
.hm-hero { position: relative; height: 100svh; min-height: 560px; display: grid; }
.hm-hero-media { position: absolute; inset: 0; overflow: hidden; }
.hm-hero-media .hm-frame-in { position: absolute; inset: calc(-1 * var(--dz)) 0; will-change: transform; }
.hm-hero-media img { width: 100%; height: 100%; object-fit: cover; }
.hm-hero::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(180deg, rgb(20 16 10 / .18), transparent 40%, rgb(20 16 10 / .38) 88%);
  pointer-events: none;
}
.hm-wordmark {
  position: absolute; left: 50%; top: 44%; transform: translate(-50%, -50%);
  display: flex; align-items: center; gap: calc(var(--u) * 26); z-index: 2;
  font-family: ${DISPLAY}; font-weight: 300; color: #F6F3EC;
  font-size: ${fluid(108, 40)}; letter-spacing: .02em; line-height: 1.12;
  margin: 0; white-space: nowrap;
  text-shadow: 0 2px 26px rgb(15 12 8 / .35);
}
.hm-wm-word { display: inline-block; }
.hm-wm-seam { width: 1px; align-self: stretch; background: #F6F3EC; transform-origin: center; }
.hm-hero-block {
  position: absolute; left: calc(var(--u) * 34); right: calc(var(--u) * 34);
  bottom: calc(var(--u) * 44); z-index: 2; color: #F6F3EC;
  display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 18px;
}
.hm-hero-sub { max-width: 46ch; font-size: ${fluid(17, 15)}; line-height: 1.6; margin: 0; }
.hm-hero-link {
  color: inherit; font-size: ${fluid(15, 14)}; text-decoration: none;
  border-bottom: 1px solid currentColor; padding-bottom: 3px;
}
.hm-hero-link:hover { opacity: .75; }

/* shared type */
.hm-headline {
  font-family: ${DISPLAY}; font-weight: 300; line-height: 1.14; letter-spacing: .005em;
  margin: 0 0 calc(var(--u) * 26);
}
.hm-line { display: inline-block; overflow: hidden; padding-bottom: .22em; margin-bottom: -.22em; vertical-align: bottom; }
.hm-word { display: inline-block; }
.hm-body { font-size: ${fluid(17, 15)}; line-height: 1.66; color: var(--hm-mute); max-width: 58ch; margin: 0; }
.hm-stat { font-family: ${MONO}; font-size: ${fluid(12.5, 11.5)}; color: var(--hm-mute); margin: calc(var(--u) * 22) 0 0; }
.hm-phase {
  font-family: ${MONO}; font-size: ${fluid(12.5, 11.5)}; letter-spacing: .12em;
  text-transform: uppercase; color: var(--hm-accent-text);
  margin: 0 0 calc(var(--u) * 18);
}
.hm-phase-is { font-weight: 400; }

/* frames + shutter reveal */
.hm-frame { position: relative; overflow: hidden; margin: 0; background: var(--hm-soft); }
.hm-frame-in { position: absolute; inset: calc(-1 * var(--dz)) 0; will-change: transform; }
.hm-frame img { width: 100%; height: 100%; object-fit: cover; }
.hm-js .hm-rv { clip-path: inset(12% 0 12% 0); opacity: 0; filter: brightness(1.3); transform: translateY(14px); }
.hm-js .hm-rv.is-in {
  clip-path: inset(0 0 0 0); opacity: 1; filter: brightness(1); transform: none;
  transition: clip-path .9s cubic-bezier(.16,1,.3,1), opacity .7s ease, filter 1.1s ease, transform .9s cubic-bezier(.16,1,.3,1);
}
.hm-static .hm-rv, .hm-root:not(.hm-js) .hm-rv { clip-path: none; opacity: 1; filter: none; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .hm-frame-in { inset: 0; transform: none !important; }
  .hm-line .hm-word { transform: none !important; opacity: 1 !important; }
}

/* sections */
/* One vertical rhythm. Neighbouring sections each contributing 140u stacked
   into a dead band, so the step is smaller and the section owns its own air. */
.hm-manifesto, .hm-morgunn, .hm-sidegi, .hm-vidskipta, .hm-verd, .hm-samband {
  padding: calc(var(--u) * 104) calc(var(--u) * 34);
}
/* ONE image rhythm for the whole page: every figure fills its grid cell, one
   shared gutter, one shared ratio per role (3:2 standing, 21:9 for the two
   full-bleed bands). No negative margins, no percentage widths, no per-figure
   max-widths — those read as arbitrary rather than composed. */
.hm-manifesto { display: grid; grid-template-columns: 1fr 1fr; gap: calc(var(--u) * 48); align-items: center; }
.hm-manifesto-fig { width: 100%; aspect-ratio: 3 / 2 !important; }

.hm-morgunn { display: grid; grid-template-columns: 0.9fr 1.3fr; gap: calc(var(--u) * 48); align-items: center; }
.hm-morgunn-figs { display: grid; grid-template-columns: 1fr 1fr; gap: calc(var(--u) * 24); }
.hm-morgunn-figs .hm-frame { width: 100%; aspect-ratio: 4 / 5 !important; }

.hm-dagur { padding: calc(var(--u) * 110) 0; }
.hm-dagur-head { padding: 0 calc(var(--u) * 34) calc(var(--u) * 44); }
.hm-dagur-bleed { aspect-ratio: 21 / 9 !important; }
.hm-dagur-bleed img { object-position: 50% 30%; }
.hm-dagur-foot {
  display: grid; grid-template-columns: 1fr 1fr; gap: calc(var(--u) * 48);
  align-items: center; padding: calc(var(--u) * 48) calc(var(--u) * 34) 0;
}
.hm-dagur-vara { width: 100%; aspect-ratio: 3 / 2 !important; }

.hm-sidegi { display: grid; grid-template-columns: 1fr 1fr; gap: calc(var(--u) * 48); align-items: center; }
.hm-sidegi-figs .hm-frame { width: 100%; aspect-ratio: 3 / 2 !important; }

/* the contact sheet */
.hm-sheet { position: relative; padding: calc(var(--u) * 120) 0 calc(var(--u) * 80); }
.hm-sheet-head { padding: 0 calc(var(--u) * 34) calc(var(--u) * 40); }
.hm-sheet-track { display: flex; gap: calc(var(--u) * 40); padding: 0 calc(var(--u) * 34); will-change: transform; }
.hm-sheet-cell { flex: 0 0 auto; width: min(44vw, 720px); margin: 0; }
.hm-sheet-cell img { width: 100%; aspect-ratio: 3 / 2; object-fit: cover; background: var(--hm-soft); }
.hm-sheet-cell figcaption {
  display: flex; justify-content: space-between; gap: 12px;
  font-family: ${MONO}; font-size: ${fluid(12.5, 11.5)};
  padding-top: 10px; color: var(--hm-mute);
}
.hm-sheet-is { text-transform: uppercase; letter-spacing: .12em; color: var(--hm-accent-text); }
@media (max-width: 767px) {
  .hm-sheet-track { overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
  .hm-sheet-cell { width: 86vw; scroll-snap-align: center; }
}

/* clients */
.hm-vidskipta { text-align: left; padding-bottom: calc(var(--u) * 74); }
/* the client band: one continuous run, edges faded into the canvas */
.hm-marquee {
  margin: calc(var(--u) * 44) calc(var(--u) * -34) 0;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}
.hm-marquee-track { display: flex; width: max-content; }
.hm-js .hm-marquee-track { animation: hm-logo-run 42s linear infinite; }
.hm-marquee:hover .hm-marquee-track, .hm-marquee:focus-within .hm-marquee-track { animation-play-state: paused; }
@keyframes hm-logo-run { from { transform: translate3d(0,0,0) } to { transform: translate3d(-50%,0,0) } }
.hm-marquee-run {
  list-style: none; display: flex; align-items: center;
  gap: calc(var(--u) * 16); padding: 0 calc(var(--u) * 8); margin: 0;
}
.hm-logo-chip {
  flex: 0 0 auto; width: calc(var(--u) * 190); height: calc(var(--u) * 104);
  background: #F4F1EA; border: 1px solid var(--hm-hair);
  display: grid; place-content: center; padding: calc(var(--u) * 20);
}
.hm-logo-chip img { max-width: 100%; max-height: calc(var(--u) * 56); object-fit: contain; }
@media (prefers-reduced-motion: reduce) {
  .hm-marquee { overflow-x: auto; -webkit-mask-image: none; mask-image: none; }
  .hm-marquee-track { animation: none !important; }
  .hm-marquee-run:nth-child(2) { display: none; }
}

/* price list */
.hm-verd-grid {
  list-style: none; display: grid; grid-template-columns: repeat(3, 1fr);
  gap: calc(var(--u) * 26); padding: 0; margin: calc(var(--u) * 20) 0 0;
}
.hm-verd-card { border: 1px solid var(--hm-hair); padding: calc(var(--u) * 34); background: color-mix(in srgb, var(--hm-soft) 55%, transparent); }
.hm-verd-name { font-family: ${MONO}; font-size: ${fluid(12.5, 11.5)}; letter-spacing: .12em; text-transform: uppercase; color: var(--hm-accent-text); margin: 0 0 calc(var(--u) * 16); }
.hm-verd-price { font-family: ${DISPLAY}; font-weight: 300; font-size: ${fluid(44, 28)}; margin: 0 0 calc(var(--u) * 18); }
.hm-verd-inc { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; font-size: ${fluid(15, 14)}; color: var(--hm-mute); }
.hm-verd-inc li { border-top: 1px solid var(--hm-hair); padding-top: 8px; }

/* contact */
.hm-samband { text-align: center; }
.hm-samband .hm-headline { margin-inline: auto; }
.hm-samband-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: calc(var(--u) * 34); margin-top: calc(var(--u) * 30); }
.hm-samband-tel {
  font-family: ${DISPLAY}; font-weight: 300; font-size: ${fluid(56, 26)};
  color: inherit; text-decoration: none;
}
.hm-samband-tel:hover { color: var(--hm-accent-text); }
.hm-cta {
  display: inline-block; font-size: ${fluid(16, 15)}; color: var(--hm-c);
  background: var(--hm-ink); padding: calc(var(--u) * 16) calc(var(--u) * 30);
  text-decoration: none; transition: opacity .25s ease, transform .25s ease;
}
.hm-cta:hover { opacity: .88; }
.hm-cta:active { transform: scale(.98); }
.hm-samband-mail { font-family: ${MONO}; font-size: ${fluid(13, 12)}; color: var(--hm-mute); margin-top: calc(var(--u) * 22); }

/* footer */
.hm-foot { border-top: 1px solid var(--hm-hair); padding: calc(var(--u) * 54) calc(var(--u) * 34) calc(var(--u) * 70); }
.hm-foot-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 34); }
.hm-foot-mark { font-family: ${MONO}; font-size: ${fluid(13, 12)}; letter-spacing: .14em; margin: 0 0 10px; }
.hm-foot-line { font-size: ${fluid(13.5, 12.5)}; color: var(--hm-mute); margin: 0 0 6px; line-height: 1.6; }

/* responsive collapse */
@media (max-width: 991px) {
  /* Stacked: one column, every figure fills it — a figure keeping a desktop
     width leaves a dead column beside it. */
  .hm-manifesto, .hm-morgunn, .hm-sidegi, .hm-dagur-foot { grid-template-columns: 1fr; gap: calc(var(--u) * 34); }
  .hm-manifesto-fig, .hm-dagur-vara, .hm-sidegi-figs .hm-frame { width: 100%; aspect-ratio: 16 / 9 !important; }
  .hm-morgunn-figs { grid-template-columns: 1fr 1fr; }
  .hm-logos { grid-template-columns: repeat(3, 1fr); }
  .hm-verd-grid { grid-template-columns: 1fr; }
  .hm-foot-grid { grid-template-columns: 1fr; }
  .hm-wordmark { gap: calc(var(--u) * 14); font-size: clamp(30px, 9.4vw, 64px); }
}
@media (max-width: 640px) {
  .hm-manifesto, .hm-morgunn, .hm-sidegi, .hm-vidskipta, .hm-verd, .hm-samband { padding: 88px 20px; }
  .hm-dagur-head { padding: 0 20px 28px; }
  .hm-dagur-foot { padding: 34px 20px 0; }
  .hm-sheet-head { padding: 0 20px 24px; }
  .hm-sheet-track { padding: 0 20px; }
  .hm-hero-block { left: 20px; right: 20px; bottom: 30px; }
  .hm-logos { grid-template-columns: repeat(2, 1fr); }
  .hm-dagur-bleed { aspect-ratio: 4 / 3 !important; }
}
`
