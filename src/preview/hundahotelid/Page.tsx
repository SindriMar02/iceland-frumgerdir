import { useEffect, useMemo, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { Mail, MapPin, Menu, Phone, X } from 'lucide-react'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import './hh.css'
import { ArchFrame } from './components/ArchFrame'
import { FramePair } from './components/FramePair'
import { Ticker } from './components/Ticker'
import { Loader } from './components/Loader'
import { ResidentViewer } from './components/ResidentViewer'
import {
  ADDRESS_LINE, ADDRESS_POSTCODE, BOARDING, BOARDING_NOTES, BOOKING_LIVE_HREF, BRING_NO,
  BRING_YES, CATS_NOTE, COMPANY_ENTRY, DAYCARE, EMAIL, EMAIL_HREF, FOUNDERS_NOTE, GROOMING, IMG,
  JSON_LD, KENNITALA, MAPS_HREF, NAV, OPEN_HOURS, OPEN_NOTE, PHONE_DISPLAY, PHONE_HREF,
  POSITIONING, PRICE_EFFECTIVE, RHYTHM, RHYTHM_HONEST_NOTE, SERVICES, TERMS, TRAINING_NOTE,
  TRAINING_PARTNER_HREF, TRAINING_PRICE_NOTE, TRANSPORT_NOTE, TRANSPORT_PRICE, WALK_NOTE, WALK_PRICE,
} from './data'

gsap.registerPlugin(ScrollTrigger)

/* ── HUNDAHÓTELIÐ ÁSBRÚ · "HÓTEL FYRIR BESTA VIN ÞINN" ────────────────────
   Batch 13. Reference system: Amour Liquide (amourliquide.com/en), studied
   at source per amourliquide-teardown.md and transplanted as EIGHT numbered
   devices (see each component's header comment for the exact device it
   implements). Behaviour transplanted, not brand: no orange/cream identity,
   no Ostia Antica, our own palette and our own arch shape (a kennel door,
   not a swooping dome).

   CONCEPT: hundahotelid.is buries its best asset, a hotel that is genuinely
   open 365 days a year with a real daily rhythm, under a thin single-page
   Nuxt site (grep BRIEF-hundahotelid.md + this file's data.ts header for the
   full source audit). This build treats it as an actual hotel page: arrival,
   rooms, the day's rhythm, services, rates, booking. Playful in tone, never
   cartoony: real photography only, no illustration system.

   PALETTE (computed AA contrast, see data.ts / hh.css for the hex values):
     INK #211D16 on CREAM #F4F3E9  = 15.05:1
     INK on CREAM-2 #EAE7D4        = 13.48:1
     GREEN #2F6E3B on CREAM        = 5.52:1  (passes AA for normal text)
     WHITE on GREEN                = 6.15:1
     WHITE on GREEN-DEEP #16321D   = 13.92:1
     MUTED #65615A (ink@68% / cream) on CREAM = 5.52:1, on CREAM-2 = 4.95:1
   TYPE: single family, "HH National Park" (self-hosted, public/hundahotelid/
   fonts/), device 6. Headings and body both, per the transplant's single-
   typeface discipline.
   ────────────────────────────────────────────────────────────────────────── */

const CREAM = '#F4F3E9'

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
@font-face{font-family:'HH National Park';src:url('${base}hundahotelid/fonts/national-park-300.woff2') format('woff2');font-weight:300;font-style:normal;font-display:swap;}
@font-face{font-family:'HH National Park';src:url('${base}hundahotelid/fonts/national-park-400.woff2') format('woff2');font-weight:400;font-style:normal;font-display:swap;}
@font-face{font-family:'HH National Park';src:url('${base}hundahotelid/fonts/national-park-500.woff2') format('woff2');font-weight:500;font-style:normal;font-display:swap;}
@font-face{font-family:'HH National Park';src:url('${base}hundahotelid/fonts/national-park-600.woff2') format('woff2');font-weight:600;font-style:normal;font-display:swap;}
@font-face{font-family:'HH National Park';src:url('${base}hundahotelid/fonts/national-park-700.woff2') format('woff2');font-weight:700;font-style:normal;font-display:swap;}
@font-face{font-family:'HH National Park';src:url('${base}hundahotelid/fonts/national-park-800.woff2') format('woff2');font-weight:800;font-style:normal;font-display:swap;}
`

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-semibold tracking-[0.18em] text-[var(--hh-green)] uppercase">{children}</p>
  )
}

function SectionGround({
  id,
  bg,
  children,
  className = '',
}: {
  id: string
  bg: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} style={{ background: bg }} className={`relative ${className}`}>
      {children}
    </section>
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

  const [form, setForm] = useState({
    from: '',
    to: '',
    size: 'Litlir',
    name: '',
    phone: '',
    email: '',
    note: '',
  })

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

  const dagvistun = SERVICES.find((s) => s.id === 'dagvistun')!
  const gongutur = SERVICES.find((s) => s.id === 'gongutur')!
  const snyrting = SERVICES.find((s) => s.id === 'snyrting')!
  const akstur = SERVICES.find((s) => s.id === 'akstur')!

  return (
    <div className="hh-root">
      <style>{FONT_FACES(baseRef.current)}</style>

      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          {/* device 1 — the kennel-door arch. Symmetric round-top stable-door
             shape (deliberately not Amour's leaning swoop): mobile keeps
             more of the box below the arch (start 0.30), the --lg variant
             gives the arch more height (0.46) so it still reads as an arch
             once frames go wide on desktop. */}
          <clipPath id="hh-arch" clipPathUnits="objectBoundingBox">
            <path d="M0,1 L0,0.30 C0,0.105 0.15,0 0.5,0 C0.85,0 1,0.105 1,0.30 L1,1 Z" />
          </clipPath>
          <clipPath id="hh-arch-lg" clipPathUnits="objectBoundingBox">
            <path d="M0,1 L0,0.46 C0,0.161 0.15,0 0.5,0 C0.85,0 1,0.161 1,0.46 L1,1 Z" />
          </clipPath>
        </defs>
      </svg>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      <PreviewChrome company={company} />

      {/* device 7 — the loader */}
      <Loader />

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30 border-b"
        style={{ background: 'rgba(244,243,233,.92)', backdropFilter: 'blur(10px)', borderColor: 'var(--hh-hair)' }}
      >
        <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-8">
          <a href="#hero" onClick={navClick('#hero')} className="hh-focus text-lg font-bold tracking-tight">
            Hundahótelið <span style={{ color: 'var(--hh-green)' }}>Ásbrú</span>
          </a>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Aðalvalmynd">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={navClick(item.href)}
                className="hh-focus text-sm font-medium text-[var(--hh-ink)]/80 transition-colors hover:text-[var(--hh-green)]"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <a href={PHONE_HREF} className="hh-focus text-sm font-semibold text-[var(--hh-ink)]/80 hover:text-[var(--hh-green)]">
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

      {/* ── 1 · HERO — arch hero + resident viewer (devices 1, 2, 4, 8) ──── */}
      <section id="hero" className="pt-10 pb-16 sm:pt-14 sm:pb-20">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5" style={{ borderColor: 'var(--hh-hair)' }}>
            <span className="h-2 w-2 rounded-full" style={{ background: 'var(--hh-green)' }} aria-hidden="true" />
            <span className="text-[12px] font-semibold tracking-wide">{OPEN_HOURS} · alla daga ársins</span>
          </div>

          <h1 className="mt-5 max-w-[16ch] text-[clamp(2.5rem,6.4vw,4.6rem)] leading-[1.03] font-bold tracking-tight">
            Alvöru hótel fyrir besta vin þinn.
          </h1>

          <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed" style={{ color: 'var(--hh-muted)' }}>
            Herbergi, hvíld og útivera á hverjum einasta degi ársins, líka um jól og verslunarmannahelgi.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button type="button" onClick={navClick('#bokun')} className="hh-btn hh-btn--primary hh-focus">
              Óska eftir bókun
            </button>
            <a href={PHONE_HREF} className="hh-btn hh-btn--ghost hh-focus">
              <Phone className="h-4 w-4" strokeWidth={1.75} /> Hringja í {PHONE_DISPLAY}
            </a>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-[1400px] px-5 sm:px-8">
          <ArchFrame
            src={IMG.yardDog}
            alt="Hundur á fullri ferð í gerðinu á Hundahótelinu Ásbrú, undir víðum íslenskum himni"
            caption="Gerðið á Hundahótelinu Ásbrú, Klettatröð 6A. Alvöru mynd, ekki sýnishorn."
            aspect="16 / 9"
            eager
          />
        </div>

        <div className="mx-auto mt-10 max-w-[1400px] rounded-[2rem]" style={{ background: 'var(--hh-green-deep)' }}>
          <div className="px-5 py-10 sm:px-8 sm:py-12">
            <p className="mb-6 text-[13px] font-semibold tracking-[0.16em] text-[var(--hh-cream)]/70 uppercase">
              Íbúarnir í dag
            </p>
            <ResidentViewer slides={SERVICES} onNavigate={scrollToId} />
          </div>
        </div>
      </section>

      {/* ── 2 · OPIÐ ALLA DAGA ÁRSINS — promise band + ticker (device 5) ─── */}
      <SectionGround id="opid" bg="var(--hh-green-deep)" className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div data-hh-reveal className="max-w-[36ch]">
            <h2 className="text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.05] font-bold text-[var(--hh-cream)]">
              Opið alla daga ársins.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[var(--hh-cream)]/75">{OPEN_NOTE}</p>
          </div>

          <div data-hh-reveal className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 p-6">
              <p className="text-3xl font-bold text-[var(--hh-cream)]">{OPEN_HOURS}</p>
              <p className="mt-1 text-sm text-[var(--hh-cream)]/70">Opnunartími, hvern einasta dag</p>
            </div>
            <div className="rounded-2xl border border-white/15 p-6">
              <p className="text-3xl font-bold text-[var(--hh-cream)]">365 dagar</p>
              <p className="mt-1 text-sm text-[var(--hh-cream)]/70">Á ári, engin lokun um hátíðar</p>
            </div>
            <div className="rounded-2xl border border-white/15 p-6">
              <p className="text-3xl font-bold text-[var(--hh-cream)]">0 rauðir dagar</p>
              <p className="mt-1 text-sm text-[var(--hh-cream)]/70">Sama verð, sama þjónusta alla daga</p>
            </div>
          </div>
        </div>

        <div className="mt-14 border-y border-white/10 py-6">
          <Ticker tone="dark" />
          <div className="mt-3">
            <Ticker tone="dark" reverse />
          </div>
        </div>
      </SectionGround>

      {/* ── 3 · HERBERGIN OG AÐSTAÐAN — arch media pairs (devices 1-4) ──── */}
      <SectionGround id="adstadan" bg="var(--hh-cream)" className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div data-hh-reveal className="max-w-[58ch]">
            <h2 className="text-[clamp(1.9rem,4vw,3rem)] leading-[1.06] font-bold">Herbergin og aðstaðan</h2>
            <p className="mt-4 text-[16px] leading-relaxed" style={{ color: 'var(--hh-muted)' }}>
              Hver hundur fær sitt eigið herbergi með mjúku rúmi, vatni og leikfangi. Göngin tengja
              herbergin við rúmgott gerði úti, þar sem gefst færi á lausagöngu og félagsskap ef
              eigandi óskar þess. Skipt er í smáhunda og stóra hunda.
            </p>
          </div>

          <div data-hh-reveal="scale" className="mt-14">
            <FramePair
              big={{
                src: IMG.roomCosy,
                alt: 'Notalegt herbergi með rúmi, leikfangi og merki Hundahótelsins á veggnum',
                caption: 'Eigið herbergi, eigið rúm. Alvöru mynd af Hundahótelinu Ásbrú.',
              }}
              pill={{ src: IMG.hallBright, alt: 'Gangur með herbergjum og taumum viðskiptavina hangandi upp' }}
            />
          </div>

          <div data-hh-reveal="scale" className="mt-16">
            <FramePair
              big={{
                src: IMG.yardWide,
                alt: 'Rúmgott gerði úti á Hundahótelinu Ásbrú með trégirðingu og víðum himni',
                caption: 'Gerðið úti, undir íslenskum himni. Alvöru mynd af Hundahótelinu Ásbrú.',
              }}
              pill={{ src: IMG.shop, alt: 'Móttaka og lítil verslun með hundafóður og nammi' }}
            />
          </div>

          <div data-hh-reveal className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="rounded-2xl border p-6" style={{ borderColor: 'var(--hh-hair)' }}>
              <h3 className="text-base font-semibold">Gott að taka með</h3>
              <ul className="mt-3 space-y-2 text-[15px]" style={{ color: 'var(--hh-muted)' }}>
                {BRING_YES.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden="true" style={{ color: 'var(--hh-green)' }}>+</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border p-6" style={{ borderColor: 'var(--hh-hair)' }}>
              <h3 className="text-base font-semibold">Betra að sleppa</h3>
              <ul className="mt-3 space-y-2 text-[15px]" style={{ color: 'var(--hh-muted)' }}>
                {BRING_NO.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden="true">−</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </SectionGround>

      {/* ── 4 · DAGURINN Á HÓTELINU — the daily rhythm, timeline family ─── */}
      <SectionGround id="dagurinn" bg="var(--hh-cream-2)" className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div data-hh-reveal className="grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <h2 className="text-[clamp(1.9rem,4vw,3rem)] leading-[1.06] font-bold">Dagurinn á hótelinu</h2>
              <p className="mt-4 max-w-[46ch] text-[16px] leading-relaxed" style={{ color: 'var(--hh-muted)' }}>
                Rútínan er sú sama hvern einasta dag, {OPEN_HOURS.toLowerCase()}. Fyrirsjáanleiki er
                hluti af hvíldinni.
              </p>
              <blockquote
                className="mt-8 rounded-2xl border-l-4 p-5 text-[14px] leading-relaxed"
                style={{ borderColor: 'var(--hh-green)', color: 'var(--hh-muted)', background: 'var(--hh-cream)' }}
              >
                {RHYTHM_HONEST_NOTE}
              </blockquote>
              <div data-hh-reveal="scale" className="mt-8 max-w-[420px]">
                <ArchFrame
                  src={IMG.yardRows}
                  alt="Raðir af gerðum úti á Hundahótelinu Ásbrú, tilbúnar fyrir útiveruna"
                  caption="Útiveran, hluti af hverjum degi. Alvöru mynd af Hundahótelinu Ásbrú."
                  aspect="4 / 5"
                />
              </div>
            </div>

            <ol className="relative border-l-2 pl-8" style={{ borderColor: 'var(--hh-hair)' }}>
              {RHYTHM.map((row) => (
                <li key={row.time} data-hh-reveal className="relative mb-10 last:mb-0">
                  <span
                    className="absolute top-1.5 -left-[41px] h-4 w-4 rounded-full border-2"
                    style={{ borderColor: 'var(--hh-green)', background: 'var(--hh-cream-2)' }}
                    aria-hidden="true"
                  />
                  <p className="text-lg font-bold" style={{ color: 'var(--hh-green)' }}>{row.time}</p>
                  <p className="mt-1.5 text-[15px] leading-relaxed">{row.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </SectionGround>

      {/* ── 5 · ÞJÓNUSTA — bento card grid ───────────────────────────────── */}
      <SectionGround id="thjonusta" bg="var(--hh-cream)" className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Eyebrow>Þjónustan öll</Eyebrow>
          <h2 data-hh-reveal className="mt-2 max-w-[26ch] text-[clamp(1.9rem,4vw,3rem)] leading-[1.06] font-bold">
            Meira en gisting
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <article
              id="dagvistun"
              data-hh-reveal="scale"
              className="grid scroll-mt-24 grid-cols-1 gap-0 overflow-hidden rounded-[1.75rem] border sm:grid-cols-2"
              style={{ borderColor: 'var(--hh-hair)' }}
            >
              <div className="relative aspect-[4/3] sm:aspect-auto">
                <img src={dagvistun.img} alt={dagvistun.imgAlt} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col justify-center p-7">
                <h3 className="text-xl font-bold">{dagvistun.label}</h3>
                <p className="mt-2 text-[15px] leading-relaxed" style={{ color: 'var(--hh-muted)' }}>
                  {dagvistun.tagline}
                </p>
                <ul className="mt-4 space-y-1.5 text-[14px]">
                  {DAYCARE.map((row) => (
                    <li key={row.label} className="flex items-baseline justify-between gap-3">
                      <span style={{ color: 'var(--hh-muted)' }}>{row.label}</span>
                      <span className="font-semibold">{row.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <article
              id="gongutur"
              data-hh-reveal="scale"
              className="relative flex scroll-mt-24 flex-col justify-end overflow-hidden rounded-[1.75rem] border p-7"
              style={{ borderColor: 'var(--hh-hair)', minHeight: 280 }}
            >
              <img src={gongutur.img} alt={gongutur.imgAlt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(22,50,29,.86), rgba(22,50,29,.05) 60%)' }} />
              <div className="relative">
                <h3 className="text-xl font-bold text-white">{gongutur.label}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/85">{gongutur.tagline}</p>
                <p className="mt-3 text-lg font-bold text-white">{WALK_PRICE} <span className="text-sm font-medium text-white/75">á göngutúr</span></p>
              </div>
            </article>

            <article
              id="snyrting"
              data-hh-reveal="scale"
              className="grid scroll-mt-24 grid-cols-1 gap-0 overflow-hidden rounded-[1.75rem] border sm:grid-cols-2"
              style={{ borderColor: 'var(--hh-hair)' }}
            >
              <div className="relative aspect-[4/3] sm:aspect-auto">
                <img src={snyrting.img} alt={snyrting.imgAlt} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col justify-center p-7">
                <h3 className="text-xl font-bold">{snyrting.label}</h3>
                <p className="mt-2 text-[15px] leading-relaxed" style={{ color: 'var(--hh-muted)' }}>
                  {snyrting.tagline}
                </p>
                <ul className="mt-4 space-y-1.5 text-[14px]">
                  {GROOMING.map((row) => (
                    <li key={row.size} className="flex items-baseline justify-between gap-3">
                      <span style={{ color: 'var(--hh-muted)' }}>{row.size}</span>
                      <span className="font-semibold">{row.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <article
              id="akstur"
              data-hh-reveal="scale"
              className="relative flex scroll-mt-24 flex-col justify-end overflow-hidden rounded-[1.75rem] border p-7"
              style={{ borderColor: 'var(--hh-hair)', minHeight: 280 }}
            >
              <img src={akstur.img} alt={akstur.imgAlt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(22,50,29,.86), rgba(22,50,29,.05) 60%)' }} />
              <div className="relative">
                <h3 className="text-xl font-bold text-white">{akstur.label}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/85">{akstur.tagline}</p>
                <p className="mt-3 text-lg font-bold text-white">{TRANSPORT_PRICE} <span className="text-sm font-medium text-white/75">hver ferð</span></p>
              </div>
            </article>
          </div>

          <div data-hh-reveal className="mt-10 flex flex-col gap-3 rounded-2xl border p-6 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: 'var(--hh-hair)' }}>
            <div>
              <h3 className="text-base font-semibold">Hundaþjálfun</h3>
              <p className="mt-1 max-w-[60ch] text-[14px] leading-relaxed" style={{ color: 'var(--hh-muted)' }}>
                {TRAINING_NOTE} {TRAINING_PRICE_NOTE}
              </p>
            </div>
            <a
              href={TRAINING_PARTNER_HREF}
              target="_blank"
              rel="noreferrer"
              className="hh-btn hh-btn--ghost hh-focus shrink-0"
            >
              Hundatengsl.is
            </a>
          </div>
        </div>
      </SectionGround>

      {/* ── 6 · VERÐSKRÁ — full-bleed price band, grouped tiles ──────────── */}
      <SectionGround id="verdskra" bg="var(--hh-cream-2)" className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Eyebrow>{PRICE_EFFECTIVE}</Eyebrow>
          <h2 data-hh-reveal className="mt-2 max-w-[24ch] text-[clamp(1.9rem,4vw,3rem)] leading-[1.06] font-bold">
            Full verðskrá, ekkert falið
          </h2>

          <div data-hh-reveal className="mt-12">
            <h3 className="text-sm font-semibold tracking-wide uppercase" style={{ color: 'var(--hh-green)' }}>
              Gisting, eftir fjölda hunda
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {BOARDING.map((row) => (
                <div key={row.count} className="rounded-2xl p-6" style={{ background: 'var(--hh-cream)' }}>
                  <p className="text-sm font-semibold" style={{ color: 'var(--hh-muted)' }}>{row.desc}</p>
                  <p className="mt-2 text-3xl font-bold">{row.price}</p>
                  <p className="text-sm" style={{ color: 'var(--hh-muted)' }}>{row.unit}</p>
                </div>
              ))}
            </div>
            <ul className="mt-4 space-y-1.5 text-[13px]" style={{ color: 'var(--hh-muted)' }}>
              {BOARDING_NOTES.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>

          <div data-hh-reveal className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold tracking-wide uppercase" style={{ color: 'var(--hh-green)' }}>
                Bað og blástur, eftir stærð
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {GROOMING.map((row) => (
                  <div key={row.size} className="rounded-xl p-4" style={{ background: 'var(--hh-cream)' }}>
                    <p className="text-[13px]" style={{ color: 'var(--hh-muted)' }}>{row.size}</p>
                    <p className="mt-1 text-xl font-bold">{row.price}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-wide uppercase" style={{ color: 'var(--hh-green)' }}>
                Dagvistun
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {DAYCARE.map((row) => (
                  <div key={row.label} className="rounded-xl p-4" style={{ background: 'var(--hh-cream)' }}>
                    <p className="text-[13px]" style={{ color: 'var(--hh-muted)' }}>{row.label}</p>
                    <p className="mt-1 text-xl font-bold">{row.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div data-hh-reveal className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl p-6" style={{ background: 'var(--hh-cream)' }}>
              <h3 className="text-sm font-semibold tracking-wide uppercase" style={{ color: 'var(--hh-green)' }}>
                Göngutúr
              </h3>
              <p className="mt-2 text-3xl font-bold">{WALK_PRICE}</p>
              <p className="mt-1 text-[14px]" style={{ color: 'var(--hh-muted)' }}>{WALK_NOTE}</p>
            </div>
            <div className="rounded-2xl p-6" style={{ background: 'var(--hh-cream)' }}>
              <h3 className="text-sm font-semibold tracking-wide uppercase" style={{ color: 'var(--hh-green)' }}>
                Hundaskutl
              </h3>
              <p className="mt-2 text-3xl font-bold">{TRANSPORT_PRICE}</p>
              <p className="mt-1 text-[14px]" style={{ color: 'var(--hh-muted)' }}>{TRANSPORT_NOTE}</p>
            </div>
          </div>
        </div>
      </SectionGround>

      {/* ── 7 · KETTIRNIR — small, honest, quiet ─────────────────────────── */}
      <SectionGround id="kettir" bg="var(--hh-cream)" className="py-16 sm:py-20">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div data-hh-reveal className="mx-auto max-w-[62ch] rounded-[1.75rem] border p-8 text-center sm:p-12" style={{ borderColor: 'var(--hh-hair)' }}>
            <h2 className="text-2xl font-bold">Kettirnir fá pláss líka</h2>
            <p className="mt-4 text-[15px] leading-relaxed" style={{ color: 'var(--hh-muted)' }}>
              {CATS_NOTE}
            </p>
          </div>
        </div>
      </SectionGround>

      {/* ── 8 · BÓKUN — request panel (form + tel CTA + their real flow) ── */}
      <SectionGround id="bokun" bg="var(--hh-cream-2)" className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_0.8fr]">
            <div data-hh-reveal>
              <Eyebrow>Bókun</Eyebrow>
              <h2 className="mt-2 text-[clamp(1.9rem,4vw,3rem)] leading-[1.06] font-bold">Óska eftir bókun</h2>
              <p className="mt-4 max-w-[54ch] text-[15px] leading-relaxed" style={{ color: 'var(--hh-muted)' }}>
                Fyllið út dagsetningar og upplýsingar um hundinn hér að neðan. Takkinn opnar
                tölvupóstforritið ykkar með útfylltum tölvupósti á {EMAIL}, tilbúnum til að senda.
              </p>

              <form
                className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  window.location.href = bookingMailto
                }}
              >
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="hh-from" className="text-[13px] font-semibold">Kemur (dagsetning)</label>
                  <input
                    id="hh-from"
                    type="date"
                    value={form.from}
                    onChange={(e) => setForm((f) => ({ ...f, from: e.target.value }))}
                    className="hh-focus min-h-[44px] rounded-xl border bg-[var(--hh-cream)] px-3.5 text-[15px]"
                    style={{ borderColor: 'var(--hh-hair)' }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="hh-to" className="text-[13px] font-semibold">Fer (dagsetning)</label>
                  <input
                    id="hh-to"
                    type="date"
                    value={form.to}
                    onChange={(e) => setForm((f) => ({ ...f, to: e.target.value }))}
                    className="hh-focus min-h-[44px] rounded-xl border bg-[var(--hh-cream)] px-3.5 text-[15px]"
                    style={{ borderColor: 'var(--hh-hair)' }}
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="hh-size" className="text-[13px] font-semibold">Stærð hunds</label>
                  <select
                    id="hh-size"
                    value={form.size}
                    onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
                    className="hh-focus min-h-[44px] rounded-xl border bg-[var(--hh-cream)] px-3.5 text-[15px]"
                    style={{ borderColor: 'var(--hh-hair)' }}
                  >
                    <option>Litlir</option>
                    <option>Miðlungs</option>
                    <option>Stórir</option>
                    <option>Mjög stórir og loðnir</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="hh-name" className="text-[13px] font-semibold">Nafn</label>
                  <input
                    id="hh-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="hh-focus min-h-[44px] rounded-xl border bg-[var(--hh-cream)] px-3.5 text-[15px]"
                    style={{ borderColor: 'var(--hh-hair)' }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="hh-phone" className="text-[13px] font-semibold">Sími</label>
                  <input
                    id="hh-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="hh-focus min-h-[44px] rounded-xl border bg-[var(--hh-cream)] px-3.5 text-[15px]"
                    style={{ borderColor: 'var(--hh-hair)' }}
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="hh-email" className="text-[13px] font-semibold">Netfang</label>
                  <input
                    id="hh-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="hh-focus min-h-[44px] rounded-xl border bg-[var(--hh-cream)] px-3.5 text-[15px]"
                    style={{ borderColor: 'var(--hh-hair)' }}
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="hh-note" className="text-[13px] font-semibold">Athugasemd (aukalega)</label>
                  <textarea
                    id="hh-note"
                    rows={3}
                    value={form.note}
                    onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                    className="hh-focus rounded-xl border bg-[var(--hh-cream)] px-3.5 py-2.5 text-[15px]"
                    style={{ borderColor: 'var(--hh-hair)' }}
                  />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" className="hh-btn hh-btn--primary hh-focus w-full sm:w-auto">
                    <Mail className="h-4 w-4" strokeWidth={1.75} /> Senda bókunarbeiðni
                  </button>
                </div>
              </form>
            </div>

            <aside data-hh-reveal className="rounded-[1.75rem] p-8" style={{ background: 'var(--hh-green-deep)' }}>
              <h3 className="text-lg font-bold text-[var(--hh-cream)]">Viljið þið frekar hringja?</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--hh-cream)]/75">
                Öll bókun hjá Hundahótelinu Ásbrú fer í dag fram símleiðis eða í tölvupósti, ekki með
                sjálfvirkri bókun á netinu. Það á líka við hér, þessi síða er frumgerð.
              </p>
              <a href={PHONE_HREF} className="hh-btn hh-btn--on-dark hh-focus mt-5 w-full">
                <Phone className="h-4 w-4" strokeWidth={1.75} /> {PHONE_DISPLAY}
              </a>
              <a href={EMAIL_HREF} className="hh-btn hh-btn--ghost hh-focus mt-3 w-full !border-white/25 !text-[var(--hh-cream)]">
                <Mail className="h-4 w-4" strokeWidth={1.75} /> {EMAIL}
              </a>
              <div className="mt-6 border-t border-white/15 pt-6">
                <p className="text-[13px] font-semibold tracking-wide text-[var(--hh-cream)]/60 uppercase">Afbókun</p>
                <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-[var(--hh-cream)]/75">
                  {TERMS.slice(3).map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <a
                href={BOOKING_LIVE_HREF}
                target="_blank"
                rel="noreferrer"
                className="hh-focus mt-6 inline-block text-[13px] underline underline-offset-2 text-[var(--hh-cream)]/60"
              >
                Sjá núverandi vef Hundahótelsins
              </a>
            </aside>
          </div>
        </div>
      </SectionGround>

      {/* ── 9 · STAÐSETNING OG HAGNÝTAR UPPLÝSINGAR ──────────────────────── */}
      <SectionGround id="stadsetning" bg="var(--hh-cream)" className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div data-hh-reveal className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-[clamp(1.9rem,4vw,3rem)] leading-[1.06] font-bold">Staðsetning</h2>
              <p className="mt-4 text-[16px] leading-relaxed" style={{ color: 'var(--hh-muted)' }}>
                {ADDRESS_LINE}, {ADDRESS_POSTCODE}.
              </p>
              <a href={MAPS_HREF} target="_blank" rel="noreferrer" className="hh-btn hh-btn--ghost hh-focus mt-5">
                <MapPin className="h-4 w-4" strokeWidth={1.75} /> Skoða á korti
              </a>

              <dl className="mt-8 grid grid-cols-2 gap-y-5 text-[14px]">
                <dt className="font-semibold">Sími</dt>
                <dd><a href={PHONE_HREF} className="hh-focus underline underline-offset-2">{PHONE_DISPLAY}</a></dd>
                <dt className="font-semibold">Netfang</dt>
                <dd><a href={EMAIL_HREF} className="hh-focus underline underline-offset-2">{EMAIL}</a></dd>
                <dt className="font-semibold">Kennitala</dt>
                <dd style={{ color: 'var(--hh-muted)' }}>{KENNITALA}</dd>
                <dt className="font-semibold">Opnunartími</dt>
                <dd style={{ color: 'var(--hh-muted)' }}>{OPEN_HOURS}, alla daga</dd>
              </dl>

              <p className="mt-8 text-[14px] leading-relaxed" style={{ color: 'var(--hh-muted)' }}>
                {FOUNDERS_NOTE}
              </p>
            </div>

            <div className="rounded-2xl border p-7" style={{ borderColor: 'var(--hh-hair)' }}>
              <h3 className="text-base font-semibold">Almennir skilmálar</h3>
              <ul className="mt-4 space-y-3 text-[14px] leading-relaxed" style={{ color: 'var(--hh-muted)' }}>
                {TERMS.map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: 'var(--hh-green)' }} />
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[13px]" style={{ color: 'var(--hh-muted)' }}>
                Bruna- og innbrotsvörn er beintengd við stjórnstöð.
              </p>
            </div>
          </div>
        </div>
      </SectionGround>

      {/* ── 10 · LOKAORÐ — closing band ──────────────────────────────────── */}
      <SectionGround id="lokaord" bg="var(--hh-green-deep)" className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1400px] px-5 text-center sm:px-8">
          <p data-hh-reveal className="mx-auto max-w-[46ch] text-[clamp(1.5rem,3.4vw,2.2rem)] leading-[1.2] font-bold text-[var(--hh-cream)]">
            {POSITIONING}
          </p>
          <div data-hh-reveal className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button type="button" onClick={navClick('#bokun')} className="hh-btn hh-btn--on-dark hh-focus">
              Óska eftir bókun
            </button>
            <a href={PHONE_HREF} className="hh-btn hh-btn--ghost hh-focus !border-white/25 !text-[var(--hh-cream)]">
              <Phone className="h-4 w-4" strokeWidth={1.75} /> {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </SectionGround>

      <div style={{ background: CREAM }}>
        <PreviewFooter company={company} />
      </div>
    </div>
  )
}
