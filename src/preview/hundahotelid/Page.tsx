import { useEffect, useMemo, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { Mail, Menu, Phone, X } from 'lucide-react'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import './hh.css'
import { ArchFrame } from './components/ArchFrame'
import { FramePair } from './components/FramePair'
import { HeroFrame } from './components/HeroFrame'
import { Ticker } from './components/Ticker'
import { Loader } from './components/Loader'
import { TimelineSpine } from './components/TimelineSpine'
import { Testimonials } from './components/Testimonials'
import {
  ADDRESS_LINE, ADDRESS_POSTCODE, BOARDING, BOARDING_NOTES, BRING_NO, BRING_YES, CATS_NOTE,
  COMPANY_ENTRY, DAYCARE, DAY_BEATS, EMAIL_HREF, FOUNDERS_NOTE, GOOGLE_RATING, GOOGLE_REVIEW_COUNT,
  GRINDAVIK, GROOMING, IMG, JSON_LD, LOGO_SVG, MAPS_HREF, NAV, OPEN_HOURS, OPEN_NOTE, PHONE_DISPLAY,
  PHONE_HREF, POSITIONING, PRICE_EFFECTIVE, RHYTHM_HONEST_NOTE, TERMS, TESTIMONIALS, TRAINING_NOTE,
  TRAINING_PARTNER_HREF, TRAINING_PRICE_NOTE, TRANSPORT_NOTE, TRANSPORT_PRICE, WALK_NOTE, WALK_PRICE,
} from './data'

gsap.registerPlugin(ScrollTrigger)

/* ── HUNDAHÓTELIÐ ÁSBRÚ · "SÓLARHRINGURINN" ──────────────────────────────
   Batch 13, v2 rebuild. v1 borrowed Amour Liquide's arch-mask grammar
   (amourliquide-teardown.md) but ran it through the SAME reveal spine as
   the other four v1 builds, with no logo, no reviews and no story — for the
   one company on this list that actually has all three. v2 keeps the arch
   grammar (it is a genuinely good fit for a kennel door) but rebuilds the
   STRUCTURAL MODEL around it: the page's spine is one real day at the
   hotel, 07:45 to evening (see TimelineSpine.tsx / DAY_BEATS in data.ts),
   with the real logo, the real 4.5-star Google rating and the real
   Grindavík evacuation story woven through it — see data.ts's header
   comment for the full source audit and the photo-sourcing deviation from
   the brief's five named stock files (one carries a third-party watermark).

   PALETTE (computed AA contrast; see hh.css for the hex values):
     INK #2B211A on CREAM #F7F1E4      = 13.97:1
     INK on CREAM-2 #EFE4CD            = 12.47:1
     RUST-DEEP #A8431F on CREAM        = 5.35:1  (AA, normal text)
     BRONZE #7A5A38 on CREAM           = 5.57:1  (AA, captions)
     MUTED #6B5D4E on CREAM            = 5.65:1
     WHITE on RUST #C1502E             = 4.71:1  (AA, button text)
   real/logo.svg + logo.png are pure black line art (kennel roof, two dogs,
   hearts, no inherent color) — the terracotta/bronze register is the
   brief's own suggested warm direction, tuned rather than lifted from the
   mark, since the mark carries none.
   TYPE: single family, "HH Fraunces" (self-hosted, public/hundahotelid/
   fonts/, Google's Fraunces v38). Headings and body both, device 5.
   ────────────────────────────────────────────────────────────────────────── */

const CREAM = '#F7F1E4'

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

/** Scoped to this file only — never touches any shared module. */
let pageLenis: Lenis | null = null

function scrollToId(id: string) {
  const target = document.querySelector<HTMLElement>(id)
  if (!target) return
  if (pageLenis) {
    pageLenis.scrollTo(target, { offset: -76, duration: reduced() ? 0 : 1.1 })
  } else {
    target.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' })
  }
}

/** Devices 1-3's scroll engine: Lenis feeding ScrollTrigger.update through
    gsap.ticker (the proven wiring from budir, ledger #42). Fully skipped
    under reduced motion, which leaves the page a plain static document. */
function useHHEngine() {
  useEffect(() => {
    if (reduced()) return
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, lerp: 0.11, wheelMultiplier: 0.9 })
    lenis.on('scroll', ScrollTrigger.update)
    pageLenis = lenis
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => {
      window.removeEventListener('load', onLoad)
      gsap.ticker.remove(tick)
      lenis.destroy()
      pageLenis = null
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [])
}

/** Craft rule #4: IntersectionObserver + CSS transitions animating TOWARD
    the resting state, an in-view-on-mount check, and a ~2s failsafe so
    nothing can strand hidden (no framer whileInView anywhere on this page). */
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-hh-reveal]'))
    if (reduced() || !els.length) {
      els.forEach((el) => el.classList.add('hh-in'))
      return
    }
    const vh = window.innerHeight
    const pending: HTMLElement[] = []
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add('hh-in')
      else pending.push(el)
    })
    if (!pending.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('hh-in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    pending.forEach((el) => io.observe(el))
    const failsafe = window.setTimeout(() => {
      pending.forEach((el) => el.classList.add('hh-in'))
      io.disconnect()
    }, 2000)
    return () => {
      io.disconnect()
      window.clearTimeout(failsafe)
    }
  }, [])
}

const FONT_FACES = (base: string) => `
@font-face{font-family:'HH Fraunces';src:url('${base}hundahotelid/fonts/Fraunces-Regular.woff2') format('woff2');font-weight:400;font-style:normal;font-display:swap;}
@font-face{font-family:'HH Fraunces';src:url('${base}hundahotelid/fonts/Fraunces-Italic.woff2') format('woff2');font-weight:400;font-style:italic;font-display:swap;}
@font-face{font-family:'HH Fraunces';src:url('${base}hundahotelid/fonts/Fraunces-Medium.woff2') format('woff2');font-weight:500;font-style:normal;font-display:swap;}
@font-face{font-family:'HH Fraunces';src:url('${base}hundahotelid/fonts/Fraunces-SemiBold.woff2') format('woff2');font-weight:600;font-style:normal;font-display:swap;}
@font-face{font-family:'HH Fraunces';src:url('${base}hundahotelid/fonts/Fraunces-SemiBoldItalic.woff2') format('woff2');font-weight:600;font-style:italic;font-display:swap;}
@font-face{font-family:'HH Fraunces';src:url('${base}hundahotelid/fonts/Fraunces-Bold.woff2') format('woff2');font-weight:700;font-style:normal;font-display:swap;}
@font-face{font-family:'HH Fraunces';src:url('${base}hundahotelid/fonts/Fraunces-Black.woff2') format('woff2');font-weight:900;font-style:normal;font-display:swap;}
`

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-semibold tracking-[0.18em] text-[var(--hh-rust-deep)] uppercase">{children}</p>
  )
}

export default function HundahotelidPage() {
  const company = COMPANY_ENTRY
  useHHEngine()
  useReveal()
  const [menuOpen, setMenuOpen] = useState(false)
  const baseRef = useRef(import.meta.env.BASE_URL)

  useEffect(() => setThemeColor(CREAM), [])

  useEffect(() => {
    if (!menuOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const navClick = (id: string) => (e: ReactMouseEvent) => {
    e.preventDefault()
    setMenuOpen(false)
    scrollToId(id)
  }

  const [form, setForm] = useState({ from: '', to: '', size: 'Litlir', name: '', phone: '', email: '', note: '' })

  const bookingMailto = useMemo(() => {
    const lines = [
      `Nafn: ${form.name || '(vantar)'}`,
      `Sími: ${form.phone || '(vantar)'}`,
      `Netfang: ${form.email || '(vantar)'}`,
      `Dagsetning frá: ${form.from || '(vantar)'}`,
      `Dagsetning til: ${form.to || '(vantar)'}`,
      `Stærð hunds: ${form.size}`,
      form.note ? `Athugasemd: ${form.note}` : '',
      '',
      'Sent úr bókunarbeiðni á frumgerð Hundahótelsins Ásbrú.',
    ].filter(Boolean)
    const subject = encodeURIComponent(`Bókunarbeiðni frá ${form.name || 'nýjum viðskiptavini'}`)
    const body = encodeURIComponent(lines.join('\n'))
    return `${EMAIL_HREF}?subject=${subject}&body=${body}`
  }, [form])

  return (
    <div className="hh-root">
      <style>{FONT_FACES(baseRef.current)}</style>

      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          {/* device 1 — the kennel-door arch: a swooping, leaning dome (the
             Amour Liquide grammar, recolored and reshaped for this brand),
             an SVG clipPath in objectBoundingBox units. Both variants
             overshoot above the box (control-point y < 0) so the curve
             reads as a genuine leaning swoop rather than a rounded corner
             at any width (D-FIX-2 — the base path used to peak at y=0.06,
             never crossing 0, which read as a plain rounded top on
             mobile/tablet); the --lg swap at 992px (hh.css) gives wide
             frames an even more dramatic lean. */}
          <clipPath id="hh-arch" clipPathUnits="objectBoundingBox">
            <path d="M0,0.24 C0.14,0.05 0.88,-0.05 1,0.24 V0.999 H0 Z" />
          </clipPath>
          <clipPath id="hh-arch-lg" clipPathUnits="objectBoundingBox">
            <path d="M0,0.218 C0.1875,0.0898 1.0195,-0.0938 1,0.218 V0.999 H0 Z" />
          </clipPath>
        </defs>
      </svg>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      <PreviewChrome company={company} />

      {/* the loader */}
      <Loader />

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30 border-b"
        style={{ background: 'rgba(247,241,228,.93)', backdropFilter: 'blur(10px)', borderColor: 'var(--hh-hair)' }}
      >
        <div className="mx-auto flex h-[70px] max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-8">
          <a href="#hero" onClick={navClick('#hero')} className="hh-focus flex items-center gap-2.5">
            <img
              src={LOGO_SVG}
              alt="Hundahótelið Ásbrú"
              className="h-9 w-auto"
              loading="eager"
              {...{ fetchpriority: 'high' }}
            />
            <span className="text-[17px] leading-tight font-semibold tracking-tight">
              Hundahótelið <span className="hh-italic" style={{ color: 'var(--hh-rust-deep)' }}>Ásbrú</span>
            </span>
          </a>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Aðalvalmynd">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={navClick(item.href)}
                className="hh-focus text-sm font-medium text-[var(--hh-ink)]/80 transition-colors hover:text-[var(--hh-rust-deep)]"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <a href={PHONE_HREF} className="hh-focus text-sm font-semibold text-[var(--hh-ink)]/80 hover:text-[var(--hh-rust-deep)]">
              {PHONE_DISPLAY}
            </a>
            <button type="button" onClick={navClick('#bokun')} className="hh-btn hh-btn--primary hh-focus">
              Óska eftir bókun
            </button>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="hh-focus flex h-11 w-11 items-center justify-center rounded-full border lg:hidden"
            style={{ borderColor: 'var(--hh-hair)' }}
            aria-label={menuOpen ? 'Loka valmynd' : 'Opna valmynd'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
          </button>
        </div>
        {menuOpen ? (
          <div className="border-t px-5 pt-2 pb-6 lg:hidden" style={{ borderColor: 'var(--hh-hair)' }} lang="is">
            <nav className="flex flex-col" aria-label="Valmynd, farsími">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={navClick(item.href)}
                  className="hh-focus flex min-h-[44px] items-center border-b text-base font-medium"
                  style={{ borderColor: 'var(--hh-hair)' }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-2.5">
              <a href={PHONE_HREF} className="hh-btn hh-btn--ghost hh-focus">
                <Phone className="h-4 w-4" strokeWidth={1.75} /> {PHONE_DISPLAY}
              </a>
              <button type="button" onClick={navClick('#bokun')} className="hh-btn hh-btn--primary hh-focus">
                Óska eftir bókun
              </button>
            </div>
          </div>
        ) : null}
      </header>

      {/* ── 1 · HERO — device 1, full-bleed variant (D-FIX-1) ───────────────
         Image-led: the arch frame owns the first screen at 76-80svh, the
         real photograph carries the moment, and the headline/CTAs sit
         INSIDE the frame over a bottom scrim rather than in a text column
         beside it. D-FIX-3: the hero photo is now a warm, non-institutional
         real photo (the chain-link kennel run has moved to the Aðstaðan
         section below, where its honesty belongs). D-FIX-4: the opening
         hours are restated in the site's own eyebrow typography, no pill
         chip. Booking/phone stay reachable in this first screen (both CTAs
         below), same as before. ───────────────────────────────────────── */}
      <section id="hero" className="hh-hero">
        <HeroFrame
          src={IMG.yardWide}
          alt="Útigerðið á Hundahótelinu Ásbrú, girt með viðargirðingu undir heiðum himni"
        >
          <p className="hh-hero__hours">{OPEN_HOURS} · alla daga ársins</p>

          <h1 className="mt-3 max-w-[14ch] text-[clamp(2.2rem,6.6vw,4.2rem)] leading-[1.04] font-semibold tracking-tight text-[var(--hh-cream)]">
            Hótel fyrir besta vin þinn
          </h1>

          <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-[var(--hh-cream)]/90 sm:text-[17px]">
            {POSITIONING}
          </p>

          <div className="hh-hero__cta">
            <a href={PHONE_HREF} className="hh-btn hh-btn--primary hh-focus">
              <Phone className="h-4 w-4" strokeWidth={1.75} /> Hringja í {PHONE_DISPLAY}
            </a>
            <a href="#bokun" onClick={navClick('#bokun')} className="hh-btn hh-btn--ghost-on-dark hh-focus">
              Óska eftir bókun
            </a>
          </div>

          <p className="hh-hero__rating">
            {GOOGLE_RATING} af 5 í einkunn · {GOOGLE_REVIEW_COUNT} umsagnir á Google
          </p>
        </HeroFrame>
      </section>

      <Ticker />

      {/* ── 2 · DAGURINN — device 3 ────────────────────────────────────── */}
      <section id="dagurinn" className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="max-w-[60ch]" data-hh-reveal>
            <Eyebrow>Sólarhringurinn</Eyebrow>
            <h2 className="mt-2 text-[clamp(1.9rem,4vw,2.7rem)] leading-[1.1] font-semibold tracking-tight">
              Einn dagur á Hundahótelinu Ásbrú
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[var(--hh-ink)]/80">
              Engin tvö hótel eru eins, en dagurinn hér fylgir sömu föstu rútínu, hvern einasta dag ársins.
              Svona lítur hann út.
            </p>
          </div>

          <div className="mt-14 sm:mt-16">
            <TimelineSpine beats={DAY_BEATS} />
          </div>
        </div>
      </section>

      {/* ── 3 · UMSAGNIR — device 6 ────────────────────────────────────── */}
      <section id="umsagnir" className="py-20 sm:py-28" style={{ background: 'var(--hh-cream-2)' }}>
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="max-w-[60ch]" data-hh-reveal>
            <Eyebrow>Frá alvöru eigendum, af Google</Eyebrow>
            <h2 className="mt-2 text-[clamp(1.9rem,4vw,2.7rem)] leading-[1.1] font-semibold tracking-tight">
              {GOOGLE_RATING} af 5, {GOOGLE_REVIEW_COUNT} umsagnir á Google
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[var(--hh-ink)]/80">
              Þetta segja eigendur sem hafa raunverulega skilið hundinn sinn eftir hjá okkur. Tilvitnanirnar
              standa á ensku, óbreyttar, beint af Google.
            </p>
          </div>

          <div className="mt-12">
            <Testimonials items={TESTIMONIALS} />
          </div>
        </div>
      </section>

      {/* ── 4 · GRINDAVÍK — device 7 ───────────────────────────────────── */}
      <section id="grindavik" className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <figure data-hh-reveal="scale">
              <div className="hh-frame hh-frame--plain" style={{ aspectRatio: '4 / 3' }}>
                <img
                  src={GRINDAVIK.img}
                  alt={GRINDAVIK.imgAlt}
                  loading="lazy"
                  className="hh-frame__img"
                  style={{ top: 0, bottom: 0, height: '100%' }}
                />
              </div>
            </figure>

            <div data-hh-reveal>
              <Eyebrow>{GRINDAVIK.eyebrow}</Eyebrow>
              <p className="hh-italic mt-3 text-[clamp(1.8rem,3.6vw,2.6rem)] leading-[1.15] font-medium">
                „{GRINDAVIK.quote}“
              </p>
              <p className="mt-5 max-w-[54ch] text-[16px] leading-relaxed text-[var(--hh-ink)]/85">
                {GRINDAVIK.body}
              </p>
              <p className="mt-4 max-w-[54ch] text-[14px] leading-relaxed text-[var(--hh-muted)]">
                {GRINDAVIK.attribution}
              </p>
              <a
                href={GRINDAVIK.sourceHref}
                target="_blank"
                rel="noreferrer"
                className="hh-focus mt-5 inline-block text-[13px] font-semibold tracking-wide text-[var(--hh-rust-deep)] underline underline-offset-4"
              >
                {GRINDAVIK.sourceLabel}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5 · AÐSTAÐAN — device 2 ────────────────────────────────────── */}
      <section id="adstadan" className="py-20 sm:py-28" style={{ background: 'var(--hh-cream-2)' }}>
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="max-w-[60ch]" data-hh-reveal>
            <Eyebrow>Ekki heimatilbúið bílskúrshótel</Eyebrow>
            <h2 className="mt-2 text-[clamp(1.9rem,4vw,2.7rem)] leading-[1.1] font-semibold tracking-tight">
              Aðstaðan sjálf, ekki stock-myndir
            </h2>
          </div>

          <figure className="mt-12" data-hh-reveal="scale">
            <ArchFrame src={IMG.yardWide} alt="Vítt útigerði á Hundahótelinu Ásbrú með bæinn í baksýn" aspect="21 / 9" />
            <figcaption className="hh-cap">Útigerðin, með Reykjanesbæ í baksýn.</figcaption>
          </figure>

          <div className="mt-16 grid gap-16 sm:mt-20 sm:gap-20 lg:grid-cols-2">
            <div data-hh-reveal>
              <FramePair
                big={{ src: IMG.hallDim, alt: 'Gangur með röð af hundaherbergjum á Hundahótelinu Ásbrú', caption: 'Gangurinn milli herbergjanna.' }}
                pill={{ src: IMG.hallBright, alt: 'Taumar og töskur gesta hangandi á vegg í móttökunni' }}
              />
            </div>
            <div data-hh-reveal>
              <FramePair
                big={{ src: IMG.roomBright, alt: 'Bjart hundaherbergi með útgangi út í eigið gerði', caption: 'Bjart herbergi með eigin útgangi.' }}
                pill={{ src: IMG.roomBone, alt: 'Kringlótt rúm, vatnsskálar og tuggubein í herbergi' }}
              />
            </div>
          </div>

          {/* D-FIX-3: the chain-link kennel run — honest here, where it
             belongs, rather than as the hero's welcome photo. */}
          <div className="mt-16 sm:mt-20" data-hh-reveal>
            <FramePair
              big={{
                src: IMG.yardDog,
                alt: 'Hundur stekkur upp að vírnetsgirðingu útigerðis, brosandi með tungu úti',
                caption: 'Vírnetið er ekki fyrir myndavélina. Það er þar til að halda öllum öruggum, alla daga ársins.',
              }}
              pill={{ src: IMG.yardRows, alt: 'Röð af aðskildum útigerðum, hvert með sinni girðingu' }}
            />
          </div>
        </div>
      </section>

      <Ticker reverse tone="light" />

      {/* ── 6 · VERÐSKRÁ — device 8 ────────────────────────────────────── */}
      <section id="verdskra" className="relative overflow-hidden py-20 sm:py-28">
        <img src={LOGO_SVG} alt="Lógó Hundahótelsins Ásbrú" aria-hidden="true" className="hh-price-watermark" />
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="max-w-[60ch]" data-hh-reveal>
            <Eyebrow>{PRICE_EFFECTIVE}</Eyebrow>
            <h2 className="mt-2 text-[clamp(1.9rem,4vw,2.7rem)] leading-[1.1] font-semibold tracking-tight">
              Verðskrá
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[var(--hh-ink)]/80">
              Gisting er verðlögð eftir fjölda hunda, ekki stærð þeirra. Aukaþjónusta er verðlögð sér.
            </p>
          </div>

          <div className="mt-12 grid gap-14 lg:grid-cols-2 lg:gap-x-20">
            <div data-hh-reveal>
              <h3 className="text-lg font-semibold">Gisting, á sólarhring</h3>
              <div className="mt-4">
                {BOARDING.map((row) => (
                  <div key={row.count} className="hh-price-row">
                    <span>
                      <span className="font-medium">{row.count}</span>
                      <span className="ml-2 text-[13px] text-[var(--hh-muted)]">{row.desc}</span>
                    </span>
                    <span className="font-semibold whitespace-nowrap">{row.price}</span>
                  </div>
                ))}
              </div>
              <ul className="mt-5 space-y-1.5 text-[13px] leading-relaxed text-[var(--hh-muted)]">
                {BOARDING_NOTES.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>

            <div data-hh-reveal>
              <h3 className="text-lg font-semibold">Bað og blástur, eftir stærð</h3>
              <div className="mt-4">
                {GROOMING.map((row) => (
                  <div key={row.size} className="hh-price-row">
                    <span>{row.size}</span>
                    <span className="font-semibold whitespace-nowrap">{row.price}</span>
                  </div>
                ))}
              </div>

              <h3 className="mt-10 text-lg font-semibold">Dagvistun</h3>
              <div className="mt-4">
                {DAYCARE.map((row) => (
                  <div key={row.label} className="hh-price-row">
                    <span>{row.label}</span>
                    <span className="font-semibold whitespace-nowrap">{row.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-10 border-t pt-10 sm:grid-cols-3" style={{ borderColor: 'var(--hh-hair)' }} data-hh-reveal>
            <div>
              <p className="text-[13px] font-semibold tracking-wide text-[var(--hh-rust-deep)] uppercase">Göngutúrar</p>
              <p className="mt-1.5 text-2xl font-semibold">{WALK_PRICE}</p>
              <p className="mt-1.5 text-[14px] text-[var(--hh-muted)]">{WALK_NOTE}</p>
            </div>
            <div>
              <p className="text-[13px] font-semibold tracking-wide text-[var(--hh-rust-deep)] uppercase">Hundaskutl</p>
              <p className="mt-1.5 text-2xl font-semibold">{TRANSPORT_PRICE}</p>
              <p className="mt-1.5 text-[14px] text-[var(--hh-muted)]">{TRANSPORT_NOTE}</p>
            </div>
            <div>
              <p className="text-[13px] font-semibold tracking-wide text-[var(--hh-rust-deep)] uppercase">Hundaþjálfun</p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--hh-ink)]/85">{TRAINING_NOTE}</p>
              <p className="mt-1.5 text-[13px] text-[var(--hh-muted)]">
                {TRAINING_PRICE_NOTE}{' '}
                <a href={TRAINING_PARTNER_HREF} target="_blank" rel="noreferrer" className="hh-focus underline underline-offset-2">
                  Hundatengsl
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7 · PRAKTÍSKT ───────────────────────────────────────────────── */}
      <section id="praktiskt" className="py-20 sm:py-28" style={{ background: 'var(--hh-cream-2)' }}>
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="max-w-[60ch]" data-hh-reveal>
            <Eyebrow>Áður en þið bókið</Eyebrow>
            <h2 className="mt-2 text-[clamp(1.9rem,4vw,2.7rem)] leading-[1.1] font-semibold tracking-tight">
              Það praktíska
            </h2>
          </div>

          <div className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <div data-hh-reveal>
              <h3 className="text-base font-semibold">Opnunartími</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--hh-ink)]/85">
                Opið {OPEN_HOURS}. {OPEN_NOTE}
              </p>
            </div>

            <div data-hh-reveal>
              <h3 className="text-base font-semibold">Hafið með</h3>
              <ul className="mt-2.5 space-y-1.5 text-[15px] leading-relaxed text-[var(--hh-ink)]/85">
                {BRING_YES.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <p className="mt-3 text-[13px] text-[var(--hh-muted)]">
                Sleppið heiman úr: {BRING_NO.join(', ').toLowerCase()}.
              </p>
            </div>

            <div data-hh-reveal>
              <h3 className="text-base font-semibold">Skilmálar í hnotskurn</h3>
              <ul className="mt-2.5 space-y-1.5 text-[14px] leading-relaxed text-[var(--hh-ink)]/85">
                {TERMS.slice(0, 3).map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>

            <div data-hh-reveal>
              <h3 className="text-base font-semibold">Kettir velkomnir</h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-[var(--hh-ink)]/85">{CATS_NOTE}</p>
            </div>
          </div>

          <p className="mt-14 border-t pt-8 text-[14px] leading-relaxed text-[var(--hh-muted)]" style={{ borderColor: 'var(--hh-hair)' }} data-hh-reveal>
            {FOUNDERS_NOTE} {RHYTHM_HONEST_NOTE}
          </p>
        </div>
      </section>

      {/* ── 8 · BÓKUN ───────────────────────────────────────────────────── */}
      <section id="bokun" className="py-20 pb-32 sm:py-28 sm:pb-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div data-hh-reveal>
              <Eyebrow>Bókun</Eyebrow>
              <h2 className="mt-2 text-[clamp(1.9rem,4vw,2.7rem)] leading-[1.1] font-semibold tracking-tight">
                Óskið eftir plássi
              </h2>
              <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-[var(--hh-ink)]/80">
                Bókun fer fram í síma eða tölvupósti, ekki með sjálfvirkri dagatalsbókun á vefnum. Fyllið út
                fyrirspurn hér og hún opnast tilbúin í tölvupóstforritinu ykkar, eða hringið beint.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href={PHONE_HREF} className="hh-btn hh-btn--primary hh-focus">
                  <Phone className="h-4 w-4" strokeWidth={1.75} /> Hringja í {PHONE_DISPLAY}
                </a>
              </div>
              <div className="mt-8 space-y-1 text-[14px] text-[var(--hh-muted)]">
                <p>{ADDRESS_LINE}, {ADDRESS_POSTCODE}</p>
                <a href={MAPS_HREF} target="_blank" rel="noreferrer" className="hh-focus underline underline-offset-2">
                  Skoða á korti
                </a>
              </div>
            </div>

            <form
              className="rounded-2xl border p-6 sm:p-8"
              style={{ borderColor: 'var(--hh-hair)', background: 'var(--hh-cream-2)' }}
              data-hh-reveal="scale"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm">
                  <span className="mb-1.5 block font-medium">Nafn</span>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="hh-focus w-full rounded-[10px] border bg-[var(--hh-cream)] px-3.5 py-2.5 text-[15px]"
                    style={{ borderColor: 'var(--hh-hair)' }}
                    autoComplete="name"
                  />
                </label>
                <label className="text-sm">
                  <span className="mb-1.5 block font-medium">Sími</span>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="hh-focus w-full rounded-[10px] border bg-[var(--hh-cream)] px-3.5 py-2.5 text-[15px]"
                    style={{ borderColor: 'var(--hh-hair)' }}
                    type="tel"
                    autoComplete="tel"
                  />
                </label>
                <label className="text-sm sm:col-span-2">
                  <span className="mb-1.5 block font-medium">Netfang</span>
                  <input
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="hh-focus w-full rounded-[10px] border bg-[var(--hh-cream)] px-3.5 py-2.5 text-[15px]"
                    style={{ borderColor: 'var(--hh-hair)' }}
                    type="email"
                    autoComplete="email"
                  />
                </label>
                <label className="text-sm">
                  <span className="mb-1.5 block font-medium">Frá</span>
                  <input
                    value={form.from}
                    onChange={(e) => setForm((f) => ({ ...f, from: e.target.value }))}
                    className="hh-focus w-full rounded-[10px] border bg-[var(--hh-cream)] px-3.5 py-2.5 text-[15px]"
                    style={{ borderColor: 'var(--hh-hair)' }}
                    type="date"
                  />
                </label>
                <label className="text-sm">
                  <span className="mb-1.5 block font-medium">Til</span>
                  <input
                    value={form.to}
                    onChange={(e) => setForm((f) => ({ ...f, to: e.target.value }))}
                    className="hh-focus w-full rounded-[10px] border bg-[var(--hh-cream)] px-3.5 py-2.5 text-[15px]"
                    style={{ borderColor: 'var(--hh-hair)' }}
                    type="date"
                  />
                </label>
                <label className="text-sm sm:col-span-2">
                  <span className="mb-1.5 block font-medium">Athugasemd</span>
                  <textarea
                    value={form.note}
                    onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                    className="hh-focus w-full resize-none rounded-[10px] border bg-[var(--hh-cream)] px-3.5 py-2.5 text-[15px]"
                    style={{ borderColor: 'var(--hh-hair)' }}
                    rows={3}
                  />
                </label>
              </div>
              <a href={bookingMailto} className="hh-btn hh-btn--primary hh-focus mt-6 w-full">
                <Mail className="h-4 w-4" strokeWidth={1.75} /> Senda fyrirspurn í tölvupósti
              </a>
            </form>
          </div>
        </div>
      </section>

      {/* fixed mobile booking bar — balance: one action, any scroll position */}
      <div className="hh-stickybar" role="navigation" aria-label="Fljótleg bókun">
        <a href={PHONE_HREF} className="hh-btn hh-btn--ghost hh-focus">
          <Phone className="h-4 w-4" strokeWidth={1.75} /> Hringja
        </a>
        <a href="#bokun" onClick={navClick('#bokun')} className="hh-btn hh-btn--primary hh-focus">
          Óska eftir bókun
        </a>
      </div>

      <PreviewFooter company={company} />
    </div>
  )
}
