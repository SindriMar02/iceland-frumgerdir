import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, FormEvent, ReactNode } from 'react'
import Lenis from 'lenis'
import { useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { Instagram, Mail, MapPin, Phone } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { setThemeColor } from '../../lib/preview'
import {
  ADDRESS,
  asset,
  BOOKING_OPTIONS,
  bookingLabel,
  CUSTOM_BODY,
  DISCLAIMER,
  EMAIL,
  INCLUDED,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PHONE,
  PHONE_HREF,
  PRICE_SOURCE,
  RENTAL,
  STORY_BODY,
  STORY_QUOTE,
  STORY_QUOTE_SOURCE,
  TOURS,
  u,
  UIMG,
  uSrcSet,
} from './data'
import type { BookingChoice } from './data'

const company = getPreviewCompany('sagakayak')

/* ── Palette (sampled from Saga Kayak's own verðskrá graphic + fjord photos)
 * GROUND #F5F0E8 · DARK #12181C · INK #2B2A26 (12.7:1 on ground, AAA)
 * OLIVE #4A5834 labels on ground (AA) · CORAL #E8734F fills w/ INK text (4.8:1)
 * FOG #B9C2C2 secondary on dark (9.8:1) · off-white #F2EFE9 on dark (AAA) */

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

const FOCUS_LIGHT =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B2A26]'
const FOCUS_DARK =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2EFE9]'

const BTN_PRIMARY = `inline-flex items-center justify-center gap-2 rounded-full bg-[#E8734F] px-6 py-3 font-sans text-[15px] font-semibold text-[#2B2A26] transition-[background-color,transform] duration-300 hover:bg-[#F0906C] active:scale-[0.97] ${FOCUS_LIGHT}`
const BTN_GHOST = `inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border-2 border-[#2B2A26] px-5 py-3 font-sans text-[15px] font-semibold text-[#2B2A26] transition-colors duration-300 hover:bg-[#2B2A26] hover:text-[#F5F0E8] active:scale-[0.97] ${FOCUS_LIGHT}`
const BTN_GHOST_DARK = `inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border-2 border-[#F2EFE9]/60 px-5 py-3 font-sans text-[15px] font-semibold text-[#F2EFE9] transition-colors duration-300 hover:bg-[#F2EFE9]/10 active:scale-[0.97] ${FOCUS_DARK}`

const INPUT =
  'w-full rounded-[8px] border border-[#2B2A26]/25 bg-white px-3.5 py-2.5 font-sans text-[15px] text-[#2B2A26] placeholder:text-[#6B675E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#B84A28]'
const LABEL = 'mb-1.5 block font-sans text-sm font-medium text-[#2B2A26]'

/* Trust strip — three verified facts, nothing invented */
const TRUST_ITEMS = [
  'Fjölskyldurekið á Vopnafirði',
  'Búnaður og leiðsögn innifalin í öllum ferðum',
  'Sérferðir í boði fyrir hópa og tilefni',
]

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ── Reveal — IntersectionObserver on an untransformed wrapper; the inner
 * element animates (ledger #7). Failsafe is viewport-gated (ledger #25).
 * Reduced motion renders plainly (ledger #8). */
function Reveal({
  children,
  variant = 'rise',
  delay = 0,
  className = '',
  innerClassName = '',
}: {
  children: ReactNode
  variant?: 'rise' | 'clip' | 'fade'
  delay?: number
  className?: string
  innerClassName?: string
}) {
  const reduced = useReducedMotion() === true
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(reduced)
  useEffect(() => {
    if (reduced) {
      setShown(true)
      return
    }
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight * 0.9 && r.bottom > 0) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.15 },
    )
    io.observe(el)
    /* Failsafe gated by viewport position: only force-show something that
     * should already be on screen; below-fold reveals keep their entrance. */
    const t = window.setTimeout(() => {
      const rr = el.getBoundingClientRect()
      if (rr.top < window.innerHeight && rr.bottom > 0) setShown(true)
    }, 1700)
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [reduced])

  const style: CSSProperties = reduced
    ? {}
    : variant === 'clip'
      ? {
          clipPath: shown ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)',
          transform: shown ? 'none' : 'translateY(16px)',
          transition: `clip-path 0.9s ${EASE} ${delay}s, transform 0.9s ${EASE} ${delay}s`,
        }
      : variant === 'fade'
        ? { opacity: shown ? 1 : 0, transition: `opacity 0.8s ${EASE} ${delay}s` }
        : {
            opacity: shown ? 1 : 0,
            transform: shown ? 'none' : 'translateY(26px)',
            transition: `opacity 0.75s ${EASE} ${delay}s, transform 0.75s ${EASE} ${delay}s`,
          }

  return (
    <div ref={ref} className={className}>
      <div className={`h-full w-full ${innerClassName}`} style={style}>
        {children}
      </div>
    </div>
  )
}

/* ── Route-line stop marker — lit state is driven from the single scroll
 * callback via data attributes (discrete toggles, so a CSS transition on the
 * pop is safe: nothing here is scrubbed per frame). */
function RouteDot({ className = '' }: { className?: string }) {
  return <span aria-hidden data-route-dot data-lit="0" className={`route-dot ${className}`} />
}

interface FormShape {
  name: string
  contact: string
  tour: BookingChoice
  date: string
  group: string
  message: string
}

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-')
  return y && m && d ? `${d}.${m}.${y}` : iso
}

export default function Page() {
  const reduced = useReducedMotion() === true
  const [mounted, setMounted] = useState(false)
  const [ctaShown, setCtaShown] = useState(false)
  const [form, setForm] = useState<FormShape>({
    name: '',
    contact: '',
    tour: 'kayak2',
    date: '',
    group: '2',
    message: '',
  })
  const [sent, setSent] = useState<FormShape | null>(null)

  const lenisRef = useRef<Lenis | null>(null)
  const heroEndRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const dotsRef = useRef<{ el: HTMLElement; frac: number }[]>([])
  const sentHeadingRef = useRef<HTMLHeadingElement>(null)
  const bookingSectionRef = useRef<HTMLElement>(null)

  /* Theme color + staged hero entrance (mount-triggered, never whileInView) */
  useEffect(() => {
    setThemeColor('#12181C')
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  /* Lenis smooth scroll — skipped entirely under reduced motion */
  useEffect(() => {
    if (prefersReduced()) return
    const lenis = new Lenis()
    lenisRef.current = lenis
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    })
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  /* Sticky mobile CTA appears once the hero has been scrolled past, and hides
   * once the booking section itself is in view (no dead scroll-to-self). */
  useEffect(() => {
    const el = heroEndRef.current
    const booking = bookingSectionRef.current
    if (!el) return
    let pastHero = false
    let bookingVisible = false
    const update = () => setCtaShown(pastHero && !bookingVisible)
    const heroIo = new IntersectionObserver(([e]) => {
      pastHero = !e.isIntersecting && e.boundingClientRect.top < 0
      update()
    })
    heroIo.observe(el)
    let bookingIo: IntersectionObserver | undefined
    if (booking) {
      bookingIo = new IntersectionObserver(([e]) => {
        bookingVisible = e.isIntersecting
        update()
      })
      bookingIo.observe(booking)
    }
    return () => {
      heroIo.disconnect()
      bookingIo?.disconnect()
    }
  }, [])

  /* Move focus to the confirmation heading on submit so keyboard/SR users
   * aren't dropped when the form is replaced by the success panel. */
  useEffect(() => {
    if (sent) sentHeadingRef.current?.focus()
  }, [sent])

  /* ── The ONE scroll-linked signature: the paddle-route line. Explicit
   * height + preserveAspectRatio (ledger #26); everything derived from the
   * raw progress value inside a single callback (ledger #26b); dashoffset is
   * written raw per frame, no CSS transition on it. */
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start 0.85', 'end 0.8'],
  })

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const collect = () => Array.from(wrap.querySelectorAll<HTMLElement>('[data-route-dot]'))
    if (reduced) {
      /* Plain render: line fully drawn, every stop lit */
      pathRef.current?.setAttribute('stroke-dashoffset', '0')
      collect().forEach((el) => {
        el.dataset.lit = '1'
      })
      return
    }
    const measure = () => {
      const r = wrap.getBoundingClientRect()
      if (r.height <= 0) return
      dotsRef.current = collect().map((el) => {
        const er = el.getBoundingClientRect()
        return { el, frac: (er.top + er.height / 2 - r.top) / r.height }
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [reduced])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reduced) return
    const p = Math.min(1, Math.max(0, v))
    pathRef.current?.setAttribute('stroke-dashoffset', String(1 - p))
    for (const d of dotsRef.current) {
      const want = p >= d.frac - 0.012 ? '1' : '0'
      if (d.el.dataset.lit !== want) d.el.dataset.lit = want
    }
  })

  const goTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -8 })
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  const update = <K extends keyof FormShape>(key: K, value: FormShape[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const choose = (tour: BookingChoice) => {
    update('tour', tour)
    goTo('boka')
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSent({ ...form })
  }

  /* Staged hero entrance styles */
  const stage = (i: number): CSSProperties =>
    reduced
      ? {}
      : {
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'none' : 'translateY(22px)',
          transition: `opacity 0.85s ${EASE} ${0.08 + i * 0.09}s, transform 0.85s ${EASE} ${0.08 + i * 0.09}s`,
        }
  const heroBgStyle: CSSProperties = reduced
    ? {}
    : { opacity: mounted ? 1 : 0, transition: `opacity 1.1s ${EASE}` }
  const portraitClip: CSSProperties = reduced
    ? {}
    : {
        clipPath: mounted ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
        transition: `clip-path 1.05s ${EASE} 0.42s`,
      }

  return (
    <div lang="is" className="bg-[#F5F0E8] font-sans text-[#2B2A26] antialiased">
      <style>{`
        .route-dot{position:absolute;z-index:30;width:14px;height:14px;border-radius:9999px;border:2px solid #E8734F;background:transparent;transform:scale(.55);opacity:.4;transition:transform .5s cubic-bezier(.22,1,.36,1),opacity .5s cubic-bezier(.22,1,.36,1),background-color .5s cubic-bezier(.22,1,.36,1)}
        .route-dot[data-lit='1']{background:#E8734F;transform:scale(1);opacity:1}
        .route-dot-end{width:20px;height:20px}
        @media (prefers-reduced-motion: reduce){.route-dot{transition:none;background:#E8734F;transform:scale(1);opacity:1}}
      `}</style>

      <PreviewChrome company={company} />

      {/* ── 1 · HERO — the put-in point ──────────────────────────────────── */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#12181C]">
        {/* Real Saga Kayak photo. Sharp cover on mobile (640px source fills a
            phone honestly); blurred-extended on desktop so the low-res frame
            is never stretched across a wide viewport (the sharp portrait
            panel carries it there instead). */}
        <div className="absolute inset-0" style={heroBgStyle}>
          <Img
            src={asset('horizons.jpg')}
            alt="Róið á kayak inn þröngan fjörð undir bröttum hlíðum, eigin mynd Saga Kayak af Austfjörðum"
            className="h-full w-full object-cover object-[42%_50%] brightness-[.58] md:scale-110 md:blur-2xl md:brightness-[.4]"
            loading="eager"
            fetchpriority="high"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#12181C]/90 via-[#12181C]/45 to-[#12181C]/55" />
        </div>

        <header className="relative z-10 flex items-center justify-between px-5 py-4 md:px-8" style={stage(0)}>
          <span className="flex items-center gap-3">
            <img
              src={asset('logo-icon.png')}
              alt="Saga Kayak merkið"
              className="h-10 w-10 rounded-full object-cover ring-1 ring-white/25"
            />
            <span className="font-display text-lg text-[#F2EFE9]">Saga Kayak</span>
          </span>
          <a href={PHONE_HREF} className={`inline-flex min-h-[44px] items-center gap-2 rounded-full px-3 py-2.5 font-mono text-sm text-[#F2EFE9]/90 transition-colors hover:text-[#F2EFE9] ${FOCUS_DARK}`}>
            <Phone aria-hidden className="h-4 w-4" />
            {PHONE}
          </a>
        </header>

        <div className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-5 pb-24 pt-10 md:grid-cols-[1.1fr_.9fr] md:px-8 md:pb-20">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#B9C2C2]" style={stage(1)}>
              Vopnafjörður · Austfirðir
            </p>
            <h1
              className="mt-4 font-display text-[2.85rem] leading-[1.08] text-[#F2EFE9] sm:text-6xl lg:text-7xl"
              style={stage(2)}
            >
              Róið inn <em className="italic text-[#E8734F]">fjörðinn</em>
            </h1>
            <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-[#F2EFE9]/85 md:text-lg" style={stage(3)}>
              Lítið fjölskyldurekið fyrirtæki á Vopnafirði. Kayakferðir, veiðiferðir og
              norðurljósaferðir í firðinum og nágrenni, með öllum búnaði og leiðsögn.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3" style={stage(4)}>
              <button type="button" onClick={() => goTo('boka')} className={BTN_PRIMARY}>
                Bóka ferð
              </button>
              <button type="button" onClick={() => goTo('ferdir')} className={BTN_GHOST_DARK}>
                Sjá ferðir og verð
              </button>
            </div>
          </div>

          <figure className="hidden md:block md:justify-self-end" style={stage(3)}>
            <div
              className="relative w-[300px] overflow-hidden rounded-[10px] ring-1 ring-white/20 lg:w-[340px]"
              style={portraitClip}
            >
              <Img
                src={asset('horizons.jpg')}
                alt="Kayak á leið inn fjörðinn, stafn bátsins klýfur spegilsléttan sjó"
                className="aspect-[9/16] w-full object-cover"
                loading="eager"
              />
            </div>
            <figcaption className="mt-3 font-mono text-[11px] text-[#B9C2C2]">
              Eigin mynd Saga Kayak af Austfjörðum
            </figcaption>
          </figure>
        </div>
        <div ref={heroEndRef} aria-hidden className="absolute bottom-0 h-px w-px" />
      </section>

      {/* ── The route: everything from here to the booking form is connected
             by the coral paddle-route line drawing itself down the left
             margin as you scroll. ─────────────────────────────────────────── */}
      <div ref={wrapRef} className="relative">
        <svg
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-20 h-full w-6 md:w-10"
          viewBox="0 0 24 1200"
          preserveAspectRatio="none"
        >
          <path
            ref={pathRef}
            d="M12 0 C 20 110 4 210 12 320 C 19 420 5 510 12 610 C 19 710 5 800 12 895 C 18 975 7 1060 12 1140 L 12 1200"
            fill="none"
            stroke="#E8734F"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1}
            opacity={0.9}
          />
        </svg>

        {/* ── 2 · TRUST BAR — first stop on the line ─────────────────────── */}
        <section className="relative border-b border-[#2B2A26]/10 bg-[#F5F0E8]">
          <RouteDot className="left-[5px] top-1/2 -translate-y-1/2 md:left-[13px]" />
          <h2 className="sr-only">Staðreyndir um Saga Kayak</h2>
          <ul className="mx-auto grid max-w-6xl gap-1.5 px-6 py-5 sm:grid-cols-3 sm:gap-6 md:px-8">
            {TRUST_ITEMS.map((t) => (
              <li key={t} className="font-mono text-[12.5px] leading-relaxed text-[#4A5834]">
                {t}
              </li>
            ))}
          </ul>
        </section>

        {/* ── 3 · TOUR TIERS — the three stops from the real verðskrá ────── */}
        <section id="ferdir" className="bg-[#F5F0E8] pb-20 pt-20 md:pb-24 md:pt-28">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <Reveal>
              <h2 className="max-w-[16ch] font-display text-4xl leading-[1.12] md:text-6xl">
                Þrjár ferðir út á fjörðinn
              </h2>
              <p className="mt-4 max-w-[58ch] leading-relaxed text-[#55524A]">{PRICE_SOURCE}</p>
            </Reveal>
          </div>

          <div className="mt-14 space-y-16 md:mt-20 md:space-y-24">
            {TOURS.slice(0, 2).map((t, i) => (
              <div key={t.id} className="relative">
                <RouteDot className="left-[5px] top-3 md:left-[13px] md:top-6" />
                <div className="mx-auto max-w-6xl px-6 md:px-8">
                  <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
                    <Reveal
                      variant="clip"
                      className={`relative aspect-[4/5] overflow-hidden rounded-[10px] ${i === 1 ? 'md:order-2' : ''}`}
                      innerClassName="relative"
                    >
                      <Img
                        src={asset(i === 0 ? 'load-summer.jpg' : 'vopnafjordur-loc.jpg')}
                        alt={
                          i === 0
                            ? 'Róið á kayak á lygnum firði, mynd úr ferð hjá Saga Kayak'
                            : 'Kayak dreginn yfir svartan sand við Vopnafjörð, eigin mynd Saga Kayak'
                        }
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </Reveal>
                    <Reveal delay={0.08} className={i === 1 ? 'md:order-1' : ''}>
                      <span className="inline-flex rounded-full border border-[#4A5834]/35 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[#4A5834]">
                        {t.stop} · {t.duration}
                      </span>
                      <h3 className="mt-4 font-display text-2xl leading-[1.16] md:text-4xl">{t.name}</h3>
                      <p className="mt-3 max-w-[52ch] leading-relaxed text-[#55524A]">{t.desc}</p>
                      <dl className="mt-6 grid max-w-md grid-cols-2 gap-6">
                        <div>
                          <dt className="font-sans text-xs text-[#55524A]">Einsmanna kayak</dt>
                          <dd className="mt-1 font-mono text-2xl md:text-[1.65rem]">{t.priceSingle}</dd>
                        </div>
                        <div>
                          <dt className="font-sans text-xs text-[#55524A]">Tveggja manna, verð á mann</dt>
                          <dd className="mt-1 font-mono text-2xl md:text-[1.65rem]">{t.priceDouble}</dd>
                        </div>
                      </dl>
                      <button type="button" onClick={() => choose(t.id)} className={`${BTN_GHOST} mt-7`}>
                        Velja þessa ferð
                      </button>
                    </Reveal>
                  </div>
                </div>
              </div>
            ))}

            {/* Stop 3 — the two-season tour gets its own dark panel */}
            <div className="relative">
              <RouteDot className="left-[5px] top-6 md:left-[13px]" />
              <div className="mx-auto max-w-6xl px-6 md:px-8">
                <Reveal>
                  <div className="overflow-hidden rounded-[10px] bg-[#12181C]">
                    <div className="grid md:grid-cols-2">
                      <div className="p-7 md:p-12">
                        <span className="inline-flex rounded-full border border-[#B9C2C2]/40 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[#B9C2C2]">
                          {TOURS[2].stop} · {TOURS[2].duration}
                        </span>
                        <h3 className="mt-4 max-w-[18ch] font-display text-2xl leading-[1.16] text-[#F2EFE9] md:text-4xl">
                          {TOURS[2].name}
                        </h3>
                        <p className="mt-3 max-w-[48ch] leading-relaxed text-[#B9C2C2]">{TOURS[2].desc}</p>
                        <dl className="mt-6 grid max-w-md grid-cols-2 gap-6">
                          <div>
                            <dt className="font-sans text-xs text-[#B9C2C2]">Einsmanna kayak</dt>
                            <dd className="mt-1 font-mono text-2xl text-[#F2EFE9] md:text-[1.65rem]">
                              {TOURS[2].priceSingle}
                            </dd>
                          </div>
                          <div>
                            <dt className="font-sans text-xs text-[#B9C2C2]">Tveggja manna, verð á mann</dt>
                            <dd className="mt-1 font-mono text-2xl text-[#F2EFE9] md:text-[1.65rem]">
                              {TOURS[2].priceDouble}
                            </dd>
                          </div>
                        </dl>
                        <button type="button" onClick={() => choose('veidi')} className={`${BTN_PRIMARY} mt-8`}>
                          Velja þessa ferð
                        </button>
                      </div>
                      <div className="relative min-h-[260px] md:min-h-0">
                        <Img
                          src={u(UIMG.aurora, 1280)}
                          srcSet={uSrcSet(UIMG.aurora)}
                          sizes="(min-width: 768px) 50vw, 100vw"
                          alt="Græn norðurljós yfir dimmu vatni (sviðsmynd)"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>

          {/* Included in every tour — verbatim from the verðskrá */}
          <div className="mx-auto mt-14 max-w-6xl px-6 md:mt-16 md:px-8">
            <Reveal>
              <p className="font-sans text-sm font-medium">Innifalið í öllum ferðum</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {INCLUDED.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-[#2B2A26]/15 bg-white/60 px-3.5 py-1.5 font-mono text-[12px] text-[#4A5834]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ── 4 · RENTAL WITHOUT A GUIDE ─────────────────────────────────── */}
        <section className="bg-[#F5F0E8] pb-20 md:pb-28">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <Reveal>
              <div className="rounded-[10px] border border-[#2B2A26]/15 bg-white/60 p-7 md:p-10">
                <div className="md:flex md:items-center md:justify-between md:gap-12">
                  <div className="max-w-[42ch]">
                    <h2 className="font-display text-2xl leading-[1.16] md:text-3xl">Leiga án leiðsagnar</h2>
                    <p className="mt-3 leading-relaxed text-[#55524A]">
                      Viltu bara bátinn? Við leigjum líka kayak og fatnað án leiðsagnar.
                    </p>
                    <button
                      type="button"
                      onClick={() => choose('leiga')}
                      className={`${BTN_GHOST} mt-5`}
                    >
                      Velja leigu
                    </button>
                  </div>
                  <dl className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-0 md:w-[46%]">
                    {RENTAL.map((r) => (
                      <div key={r.name} className="rounded-[10px] border border-[#2B2A26]/10 bg-[#F5F0E8] px-5 py-4">
                        <dt className="font-sans font-medium">{r.name}</dt>
                        <dd className="mt-0.5 font-sans text-sm text-[#55524A]">{r.detail}</dd>
                        <dd className="mt-3 font-mono text-xl">{r.price}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 5 · STORY — the people behind the sign ─────────────────────── */}
        <section className="relative bg-[#F5F0E8] pb-20 md:pb-28">
          <RouteDot className="left-[5px] top-10 md:left-[13px]" />
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2 md:gap-16 md:px-8">
            <div className="mx-auto md:max-w-[600px]">
              <Reveal
                variant="clip"
                className="relative aspect-square overflow-hidden rounded-[10px]"
                innerClassName="relative"
              >
                <Img
                  src={asset('owners-sign-hq.jpg')}
                  alt="Fólkið á bak við Saga Kayak, hlæjandi fyrir framan handmálað Saga Kayak skilti"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </Reveal>
              <p className="mt-3 font-mono text-[11px] text-[#55524A]">
                Opnunarteitið í júlí 2024, mynd af Instagram Saga Kayak
              </p>
            </div>
            <Reveal delay={0.08}>
              <h2 className="max-w-[16ch] font-display text-3xl leading-[1.14] md:text-5xl">
                Lítið fjölskyldufyrirtæki við fjörðinn
              </h2>
              <p className="mt-5 max-w-[54ch] leading-relaxed text-[#55524A]">{STORY_BODY}</p>
              <figure className="mt-8">
                <blockquote className="max-w-[36ch] font-display text-xl italic leading-[1.35] text-[#4A5834] md:text-2xl">
                  „{STORY_QUOTE}“
                </blockquote>
                <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[#55524A]">
                  {STORY_QUOTE_SOURCE}
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* ── 6 · THE FJORD — full-bleed setting ─────────────────────────── */}
        <section className="relative flex min-h-[66svh] items-end overflow-hidden bg-[#12181C] md:min-h-[78svh]">
          <Img
            src={u(UIMG.fjord, 2000)}
            srcSet={uSrcSet(UIMG.fjord)}
            sizes="100vw"
            alt="Kyrr fjörður með grænum hlíðum undir skýjuðum himni (sviðsmynd)"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#12181C]/85 via-[#12181C]/20 to-[#12181C]/25" />
          <div className="relative mx-auto w-full max-w-6xl px-6 pb-14 pt-44 md:px-8 md:pb-20">
            <Reveal>
              <h2 className="font-display text-4xl leading-[1.12] text-[#F2EFE9] md:text-6xl">Vopnafjörður</h2>
              <p className="mt-4 max-w-[50ch] leading-relaxed text-[#F2EFE9]/90">
                Fjörður og byggð á Austurlandi. Af sjónum sést fjörðurinn frá allt öðru
                sjónarhorni en af landi, og allar ferðir fara fram í firðinum og nágrenni hans.
              </p>
              <p className="mt-6 font-mono text-[11px] text-[#F2EFE9]/75">Sviðsmynd af austfirskum firði</p>
            </Reveal>
          </div>
        </section>

        {/* ── 7 · TWO SEASONS, ONE TOUR ──────────────────────────────────── */}
        <section className="relative overflow-hidden bg-[#12181C] py-20 md:py-28">
          <Img
            src={u(UIMG.mountain, 2000)}
            srcSet={uSrcSet(UIMG.mountain)}
            sizes="100vw"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div aria-hidden className="absolute inset-0 bg-[#12181C]/60" />
          <div className="relative mx-auto max-w-6xl px-6 md:px-8">
            <Reveal>
              <h2 className="max-w-[16ch] font-display text-3xl leading-[1.14] text-[#F2EFE9] md:text-5xl">
                Ein ferð, tvær árstíðir
              </h2>
              <p className="mt-4 max-w-[54ch] leading-relaxed text-[#B9C2C2]">
                Veiðiferðin og norðurljósaferðin eru sama tveggja tíma ferðin á sama verði.
                Árstíðin ræður því hvor útgáfan er í boði.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 md:gap-6">
              <Reveal delay={0.05}>
                <div className="h-full rounded-[10px] border border-white/10 bg-[#0E1418]/75 p-6 md:p-8">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#B9C2C2]">Bjartari mánuðirnir</p>
                  <h3 className="mt-2 font-display text-2xl text-[#F2EFE9]">Veiðiferð</h3>
                  <p className="mt-2 leading-relaxed text-[#B9C2C2]">
                    Róið út á fjörðinn og rennt fyrir fisk. Annar búnaður fylgir með.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="h-full rounded-[10px] border border-white/10 bg-[#0E1418]/75 p-6 md:p-8">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#B9C2C2]">Þegar dimmir</p>
                  <h3 className="mt-2 font-display text-2xl text-[#F2EFE9]">Norðurljósaferð</h3>
                  <p className="mt-2 leading-relaxed text-[#B9C2C2]">
                    Sama ferð róin í vetrarmyrkrinu þegar norðurljósin geta látið sjá sig.
                  </p>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <p className="font-mono text-lg text-[#F2EFE9]">
                  15.000 kr. einsmanna
                  <span className="mx-3 text-[#B9C2C2]">·</span>
                  10.000 kr. á mann í tveggja manna
                </p>
                <button type="button" onClick={() => choose('veidi')} className={BTN_GHOST_DARK}>
                  Velja þessa ferð
                </button>
              </div>
              <p className="mt-6 font-mono text-[11px] text-[#F2EFE9]/75">Íslensk fjöll, sviðsmynd</p>
            </Reveal>
          </div>
        </section>

        {/* ── 8 · CUSTOM TRIPS — the rainbow payoff ──────────────────────── */}
        <section className="bg-[#F5F0E8] py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2 md:gap-16 md:px-8">
            <Reveal>
              <h2 className="max-w-[14ch] font-display text-3xl leading-[1.14] md:text-5xl">
                Sérferðir fyrir hópinn þinn
              </h2>
              <p className="mt-5 max-w-[54ch] leading-relaxed text-[#55524A]">{CUSTOM_BODY}</p>
              <button type="button" onClick={() => choose('serferd')} className={`${BTN_GHOST} mt-7`}>
                Senda fyrirspurn um sérferð
              </button>
            </Reveal>
            <div className="md:order-first">
              <Reveal
                variant="clip"
                className="relative aspect-[4/5] overflow-hidden rounded-[10px]"
                innerClassName="relative"
              >
                <Img
                  src={asset('tag-someone.jpg')}
                  alt="Regnbogi yfir firðinum séð frá kayak í kvöldbirtu, eigin mynd Saga Kayak"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </Reveal>
              <p className="mt-3 font-mono text-[11px] text-[#55524A]">Eigin mynd Saga Kayak af firðinum</p>
            </div>
          </div>
        </section>

        {/* ── 9 · PRACTICAL INFO — big and scannable ─────────────────────── */}
        <section className="border-t border-[#2B2A26]/10 bg-[#F5F0E8] py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <Reveal>
              <h2 className="font-display text-3xl leading-[1.14] md:text-5xl">Hér erum við</h2>
              <p className="mt-3 max-w-[54ch] leading-relaxed text-[#55524A]">
                Best er að ná í okkur í síma, með tölvupósti eða skilaboðum á Instagram.
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <div className="mt-8 divide-y divide-[#2B2A26]/10 border-y border-[#2B2A26]/10">
                <a
                  href={PHONE_HREF}
                  className={`group flex flex-wrap items-center justify-between gap-3 py-6 ${FOCUS_LIGHT}`}
                >
                  <span className="flex items-center gap-4">
                    <Phone aria-hidden className="h-5 w-5 shrink-0 text-[#4A5834]" />
                    <span className="font-mono text-2xl transition-colors group-hover:text-[#B84A28] md:text-4xl">
                      {PHONE}
                    </span>
                  </span>
                  <span className="font-sans text-sm text-[#55524A]">Hringdu í okkur</span>
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className={`group flex flex-wrap items-center justify-between gap-3 py-6 ${FOCUS_LIGHT}`}
                >
                  <span className="flex items-center gap-4">
                    <Mail aria-hidden className="h-5 w-5 shrink-0 text-[#4A5834]" />
                    <span className="break-all font-mono text-lg transition-colors group-hover:text-[#B84A28] md:text-2xl">
                      {EMAIL}
                    </span>
                  </span>
                  <span className="font-sans text-sm text-[#55524A]">Sendu póst</span>
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={`group flex flex-wrap items-center justify-between gap-3 py-6 ${FOCUS_LIGHT}`}
                >
                  <span className="flex items-center gap-4">
                    <Instagram aria-hidden className="h-5 w-5 shrink-0 text-[#4A5834]" />
                    <span className="font-mono text-lg transition-colors group-hover:text-[#B84A28] md:text-2xl">
                      {INSTAGRAM_HANDLE}
                    </span>
                  </span>
                  <span className="font-sans text-sm text-[#55524A]">Sendu skilaboð</span>
                </a>
                <p className="flex flex-wrap items-center gap-4 py-6">
                  <MapPin aria-hidden className="h-5 w-5 shrink-0 text-[#4A5834]" />
                  <span className="font-mono text-lg md:text-2xl">{ADDRESS}</span>
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 10 · BOOKING REQUEST — the route's terminus ────────────────── */}
        <section id="boka" ref={bookingSectionRef} className="relative bg-[#F5F0E8] pb-24 pt-4 md:pb-32 md:pt-8">
          <RouteDot className="route-dot-end left-[2px] top-24 md:left-[10px]" />
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <Reveal>
              <h2 className="max-w-[15ch] font-display text-4xl leading-[1.12] md:text-6xl">
                Sendu bókunarbeiðni
              </h2>
              <p className="mt-4 max-w-[56ch] leading-relaxed text-[#55524A]">
                Veldu ferð og dagsetningu sem hentar þér. Við förum yfir beiðnina og höfum
                samband til að staðfesta tíma.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-10 md:mt-12 md:grid-cols-[1fr_.68fr] md:gap-14">
              <Reveal delay={0.05}>
                {sent ? (
                  <div
                    role="status"
                    className="rounded-[10px] border border-[#4A5834]/30 bg-white p-6 md:p-8"
                  >
                    <h3
                      ref={sentHeadingRef}
                      tabIndex={-1}
                      className="font-display text-2xl outline-none"
                    >
                      Beiðnin er skráð
                    </h3>
                    <p className="mt-3 leading-relaxed text-[#55524A]">
                      Takk fyrir, {sent.name}. Beiðni um {bookingLabel(sent.tour)}
                      {sent.date ? ` þann ${formatDate(sent.date)}` : ''} fyrir {sent.group}{' '}
                      {Number(sent.group) === 1 ? 'manneskju' : 'manns'} er skráð.
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[#55524A]">
                      Í fullbúnum vef berst beiðnin beint til Saga Kayak sem hefur samband við þig
                      ({sent.contact}) til að staðfesta tíma. Þetta er frumgerð og beiðnin sendist
                      því ekki áfram.
                    </p>
                    <button type="button" onClick={() => setSent(null)} className={`${BTN_GHOST} mt-6`}>
                      Senda aðra beiðni
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={onSubmit}
                    className="rounded-[10px] border border-[#2B2A26]/15 bg-white p-6 md:p-8"
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="sk-name" className={LABEL}>
                          Nafn
                        </label>
                        <input
                          id="sk-name"
                          type="text"
                          required
                          autoComplete="name"
                          value={form.name}
                          onChange={(e) => update('name', e.target.value)}
                          className={INPUT}
                        />
                      </div>
                      <div>
                        <label htmlFor="sk-contact" className={LABEL}>
                          Netfang eða símanúmer
                        </label>
                        <input
                          id="sk-contact"
                          type="text"
                          required
                          value={form.contact}
                          onChange={(e) => update('contact', e.target.value)}
                          className={INPUT}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="sk-tour" className={LABEL}>
                          Ferð
                        </label>
                        <select
                          id="sk-tour"
                          value={form.tour}
                          onChange={(e) => update('tour', e.target.value as BookingChoice)}
                          className={INPUT}
                        >
                          {BOOKING_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="sk-date" className={LABEL}>
                          Óskadagsetning
                        </label>
                        <input
                          id="sk-date"
                          type="date"
                          value={form.date}
                          onChange={(e) => update('date', e.target.value)}
                          className={INPUT}
                        />
                      </div>
                      <div>
                        <label htmlFor="sk-group" className={LABEL}>
                          Fjöldi í hóp
                        </label>
                        <input
                          id="sk-group"
                          type="number"
                          min={1}
                          value={form.group}
                          onChange={(e) => update('group', e.target.value)}
                          className={INPUT}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="sk-message" className={LABEL}>
                          Skilaboð (valfrjálst)
                        </label>
                        <textarea
                          id="sk-message"
                          rows={4}
                          value={form.message}
                          onChange={(e) => update('message', e.target.value)}
                          className={INPUT}
                          placeholder="Til dæmis tilefni, óskir um tíma dags eða spurningar"
                        />
                      </div>
                    </div>
                    <button type="submit" className={`${BTN_PRIMARY} mt-6 w-full sm:w-auto`}>
                      Senda bókunarbeiðni
                    </button>
                    <p className="mt-4 text-xs leading-relaxed text-[#55524A]">
                      Beiðni er ekki staðfest bókun. Þetta er frumgerð og beiðnin sendist ekki
                      áfram.
                    </p>
                  </form>
                )}
              </Reveal>
              <div className="hidden md:block">
                <Reveal
                  variant="clip"
                  className="relative aspect-[3/4] overflow-hidden rounded-[10px]"
                  innerClassName="relative"
                >
                  <Img
                    src={u(UIMG.oar, 1280)}
                    srcSet={uSrcSet(UIMG.oar)}
                    sizes="(min-width: 768px) 38vw, 100vw"
                    alt="Árarblað úr tré yfir kyrrum sjó í kvöldbirtu (sviðsmynd)"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </Reveal>
                <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-[#55524A]">
                  Engin greiðsla fer fram á netinu. Við svörum öllum beiðnum og staðfestum
                  tímann við þig.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── 11 · FOOTER — contact repeated + honesty disclaimer ──────────── */}
      <section className="bg-[#12181C] py-14 text-[#B9C2C2]">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <div className="flex flex-wrap items-center gap-4">
            <img
              src={asset('logo-icon.png')}
              alt="Saga Kayak merkið"
              loading="lazy"
              className="h-12 w-12 rounded-full object-cover ring-1 ring-white/20"
            />
            <div>
              <p className="font-display text-xl text-[#F2EFE9]">Saga Kayak</p>
              <p className="font-mono text-xs">{ADDRESS}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-mono text-sm">
            <a href={PHONE_HREF} className={`inline-flex items-center py-2 transition-colors hover:text-[#F2EFE9] ${FOCUS_DARK}`}>
              {PHONE}
            </a>
            <a href={`mailto:${EMAIL}`} className={`inline-flex items-center py-2 transition-colors hover:text-[#F2EFE9] ${FOCUS_DARK}`}>
              {EMAIL}
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center py-2 transition-colors hover:text-[#F2EFE9] ${FOCUS_DARK}`}
            >
              {INSTAGRAM_HANDLE}
            </a>
          </div>
          <p className="mt-8 max-w-2xl text-xs leading-relaxed text-[#B9C2C2]/80">{DISCLAIMER}</p>
        </div>
      </section>

      <PreviewFooter company={company} />

      {/* Sticky mobile CTA — booking is always one tap away */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#2B2A26]/10 bg-[#F5F0E8]/95 px-4 py-3 backdrop-blur transition-transform duration-500 md:hidden ${
          ctaShown ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => goTo('boka')} className={`${BTN_PRIMARY} flex-1`}>
            Bóka ferð
          </button>
          <a
            href={PHONE_HREF}
            aria-label="Hringja í Saga Kayak, sími 847 4053"
            className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#2B2A26] text-[#2B2A26] transition-transform active:scale-95 ${FOCUS_LIGHT}`}
          >
            <Phone aria-hidden className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  )
}
