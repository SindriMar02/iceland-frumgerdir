import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import {
  Anchor,
  ArrowRight,
  CalendarCheck,
  ChevronDown,
  Clock,
  LifeBuoy,
  Mail,
  MapPin,
  ShieldCheck,
  Star,
  Users,
  Waves,
} from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { Reveal } from '../../components/Reveal'
import { HERO_ID, TRIPS, VOICES } from './data'

const company = getPreviewCompany('seakayak')

const U = 'https://images.unsplash.com/'
const heroSrc = `${U}${HERO_ID}?q=80&w=2000&auto=format&fit=crop`
const heroSrcSet = [828, 1280, 2000]
  .map((w) => `${U}${HERO_ID}?q=80&w=${w}&auto=format&fit=crop ${w}w`)
  .join(', ')

const TRUST = [
  { big: '30 yrs', small: 'On this water' },
  { big: '#1', small: 'Activity in Stokkseyri' },
  { big: '4.8★', small: 'TripAdvisor rating' },
  { big: 'All', small: 'Levels welcome' },
]

const NAV_LINKS = [
  { href: '#trips', label: 'Trips' },
  { href: '#safety', label: 'Why us' },
  { href: '#place', label: 'The place' },
]

const SAFETY = [
  {
    icon: ShieldCheck,
    title: 'Thirty years, no shortcuts',
    desc: 'The same family has guided these waters since 1995. Every trip starts with a calm land briefing — you’ll never be pushed past what feels right.',
  },
  {
    icon: Users,
    title: 'Certified, patient guides',
    desc: 'Wilderness-first-aid certified and endlessly patient with nervous first-timers. Small groups mean a guide is always within reach.',
  },
  {
    icon: LifeBuoy,
    title: 'All gear & dry suits included',
    desc: 'Warm dry suits, buoyancy aids, paddles and stable kayaks — all provided and fitted. Just bring something warm to wear underneath.',
  },
  {
    icon: Waves,
    title: 'Sheltered, glassy water',
    desc: 'We choose calm, protected routes and read the conditions daily. First-timers and kids welcome — most paddlers have never kayaked before.',
  },
]

/** Booking enquiry mailto with a pre-filled, editable template. */
function bookingMailto(trip?: string) {
  const subject = trip ? `Booking enquiry — ${trip}` : 'Sea kayak booking enquiry'
  const body = [
    'Hi Sea Kayak Iceland,',
    '',
    `Trip: ${trip ?? '(which trip?)'}`,
    'Preferred date(s): ',
    'Number of paddlers (and ages of any children): ',
    'Any paddling experience? ',
    '',
    'Takk!',
  ].join('\n')
  return `mailto:${company.ownerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

/** Mobile-only sticky booking bar — appears after the hero scrolls away. */
function MobileBookBar() {
  const [show, setShow] = useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => setShow(y > 560))

  return (
    <motion.div
      initial={false}
      animate={{ y: show ? 0 : 120, opacity: show ? 1 : 0 }}
      transition={{ type: 'spring', damping: 26, stiffness: 280 }}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0e1c22]/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#eef4f5]">Sea Kayak · Stokkseyri</p>
          <p className="truncate text-xs text-[#9fc0c9]">Since 1995 · 4.8★ · all levels</p>
        </div>
        <a
          href="#book"
          lang="is"
          className="shrink-0 rounded-full bg-[#2aa7c4] px-5 py-2.5 text-sm font-bold text-[#06141a] shadow-lg shadow-[#2aa7c4]/25 transition-colors hover:bg-[#5fd0e6]"
        >
          Bóka ferð
        </a>
      </div>
    </motion.div>
  )
}

export default function Page() {
  const reduce = useReducedMotion()
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const [headerH, setHeaderH] = useState(0)

  useEffect(() => {
    document.title = 'Sea Kayak Iceland — Still Water (Concept)'
  }, [])

  // Track header height so the mobile overlay can pad below it.
  useEffect(() => {
    const measure = () => setHeaderH(headerRef.current?.offsetHeight ?? 0)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Lock body scroll and allow Escape to close while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)
  const menuDuration = reduce ? 'duration-0' : 'duration-300'

  return (
    <div className="min-h-screen scroll-smooth bg-[#0e1c22] font-sans text-[#eef4f5] antialiased">
      <PreviewChrome company={company} />
      <MobileBookBar />

      {/* Sticky mini-nav */}
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-30 border-b border-white/[0.06] backdrop-blur-md transition-colors ${menuDuration} ${
          menuOpen ? 'bg-[#0e1c22]' : 'bg-[#0e1c22]/80'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 md:px-10">
          <a href="#top" className="flex items-center gap-2.5 pl-10 md:pl-12">
            <Anchor className="h-4.5 w-4.5 text-[#2aa7c4]" aria-hidden="true" />
            <span className="font-grotesk text-base font-semibold tracking-tight text-[#eef4f5]">
              Sea Kayak Iceland
            </span>
          </a>
          <nav className="flex items-center gap-4 md:gap-7" aria-label="Primary">
            <a href="#trips" className="hidden text-sm text-[#9fc0c9] transition-colors hover:text-[#eef4f5] md:inline">
              Trips
            </a>
            <a href="#safety" className="hidden text-sm text-[#9fc0c9] transition-colors hover:text-[#eef4f5] md:inline">
              Why us
            </a>
            <a href="#place" className="hidden text-sm text-[#9fc0c9] transition-colors hover:text-[#eef4f5] md:inline">
              The place
            </a>
            <a
              href="#book"
              lang="is"
              className="rounded-full bg-[#2aa7c4] px-4 py-2 text-sm font-bold text-[#06141a] transition-colors hover:bg-[#5fd0e6]"
            >
              Bóka ferð
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Loka valmynd' : 'Opna valmynd'}
              className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#eef4f5] transition-colors hover:bg-white/5 md:hidden"
            >
              <span className="relative block h-4 w-5" aria-hidden="true">
                <span
                  className={`absolute inset-x-0 top-0 h-[2px] rounded-full bg-current transition-all ${menuDuration} ease-out ${
                    menuOpen ? 'top-[7px] rotate-45' : ''
                  }`}
                />
                <span
                  className={`absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-current transition-all ${menuDuration} ease-out ${
                    menuOpen ? 'bottom-[7px] -rotate-45' : ''
                  }`}
                />
              </span>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile menu overlay — rendered as a header sibling (not nested inside it) so the
          header's own backdrop-blur containing-block stays correct while this is open. */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Valmynd"
        style={{ paddingTop: headerH }}
        className={`fixed inset-0 z-20 flex flex-col bg-[#0e1c22] transition-opacity ${menuDuration} md:hidden ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <nav aria-label="Valmynd farsíma" className="flex flex-1 flex-col justify-center px-8">
          <ul>
            {NAV_LINKS.map((l, i) => (
              <li key={l.href} className="overflow-hidden py-1.5">
                <a
                  href={l.href}
                  onClick={closeMenu}
                  className={`block font-grotesk text-4xl font-semibold tracking-tight text-[#eef4f5] transition-all ease-out ${
                    reduce ? 'duration-0' : 'duration-500'
                  } ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
                  style={{ transitionDelay: menuOpen && !reduce ? `${100 + i * 90}ms` : '0ms' }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div
            aria-hidden="true"
            className={`mt-8 h-px w-16 bg-[#2aa7c4]/50 transition-opacity ${
              reduce ? 'duration-0' : 'duration-500'
            } ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: menuOpen && !reduce ? '380ms' : '0ms' }}
          />
          <p
            className={`mt-4 text-[11px] font-semibold tracking-[0.34em] text-[#7fa3ad] uppercase transition-opacity ${
              reduce ? 'duration-0' : 'duration-500'
            } ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: menuOpen && !reduce ? '420ms' : '0ms' }}
          >
            Stokkseyri · síðan 1995
          </p>
        </nav>

        <div className="px-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
          <a
            href="#book"
            lang="is"
            onClick={closeMenu}
            className={`flex w-full items-center justify-center gap-2 rounded-full bg-[#2aa7c4] px-8 py-4 text-base font-bold tracking-wide text-[#06141a] shadow-xl shadow-[#2aa7c4]/25 transition-all hover:bg-[#5fd0e6] ${
              reduce ? 'duration-0' : 'duration-500'
            } ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            style={{ transitionDelay: menuOpen && !reduce ? '460ms' : '0ms' }}
          >
            Bóka ferð
          </a>
        </div>
      </div>

      {/* Hero */}
      <section id="top" className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
        <Img
          src={heroSrc}
          srcSet={heroSrcSet}
          sizes="100vw"
          alt="A lone paddler on a small kayak gliding across misty, glass-still mountain water"
          className="kenburns absolute inset-0 h-full w-full object-cover"
          loading="eager"
          fetchpriority="high"
          fallbackClassName="absolute inset-0 bg-gradient-to-b from-[#1c3b46] via-[#122932] to-[#0e1c22]"
        />
        {/* Teal scrim for AA contrast on light text */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1c22] via-[#0e1c22]/55 to-[#0e1c22]/70" />
        <div className="absolute inset-0 bg-[#0e1c22]/25" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24 md:px-10 md:pb-28">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.34em] text-[#5fd0e6] uppercase"
          >
            <Waves className="h-3.5 w-3.5" aria-hidden="true" />
            Stokkseyri · South Iceland · since 1995
          </motion.p>

          <h1 className="mt-5 max-w-3xl font-grotesk text-[12vw] leading-[1.06] font-semibold tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            <motion.span
              lang="is"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.75 }}
              className="block"
            >
              Kyrrt vatn,
            </motion.span>
            <motion.span
              lang="is"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.75 }}
              className="block bg-gradient-to-r from-[#5fd0e6] to-[#2aa7c4] bg-clip-text pb-[0.12em] text-transparent forced-colors:text-[#5fd0e6] forced-colors:[-webkit-text-fill-color:currentColor]"
            >
              þrjátíu ár.
            </motion.span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.75 }}
            className="mt-7 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          >
            <p className="max-w-md text-base leading-relaxed text-[#d6e4e8] md:text-lg">
              Sea kayaking from Stokkseyri since 1995 — calm, sheltered water minutes from Reykjavík.
              Thirty years of guiding first-timers, families and seasoned paddlers onto Icelandic seas.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#book"
                lang="is"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#2aa7c4] px-8 py-4 text-sm font-bold tracking-wide text-[#06141a] shadow-xl shadow-[#2aa7c4]/25 transition-all hover:-translate-y-0.5 hover:bg-[#5fd0e6]"
              >
                Bóka ferð · Book a trip
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </a>
              <a
                href="#trips"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 py-4 text-sm font-semibold tracking-wide backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                See the trips
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll cue (infinite — gated for reduced motion) */}
        {!reduce && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.85, 0.3], y: [0, 7, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-[#9fc0c9]"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        )}
      </section>

      {/* Trust strip */}
      <section aria-label="Track record" className="border-y border-white/[0.06] bg-[#122932]">
        <div className="mx-auto max-w-6xl px-5 py-7 md:px-10">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:flex md:items-center md:justify-between md:gap-2">
            {TRUST.map((t, i) => (
              <Reveal key={t.small} delay={i * 0.05} y={16}>
                <li className="flex flex-col md:items-center md:text-center">
                  <span className="font-grotesk text-2xl font-semibold text-[#5fd0e6] md:text-3xl">{t.big}</span>
                  <span className="mt-1 text-[11px] tracking-wide text-[#9fc0c9] uppercase">{t.small}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* The trips */}
      <section id="trips" className="scroll-mt-20 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-10">
          <Reveal className="max-w-2xl">
            <p className="text-[11px] font-semibold tracking-[0.34em] text-[#2aa7c4] uppercase">The trips</p>
            <h2 className="mt-4 font-grotesk text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
              Four ways onto the water
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#9fc0c9]">
              Every trip includes dry suits, all gear and a guide who has read this coast for years.
              Pick your pace — the calmest needs no experience at all.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {TRIPS.map((t, i) => (
              <Reveal key={t.name} delay={(i % 2) * 0.08}>
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[#122932] transition-colors hover:border-[#2aa7c4]/45">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Img
                      src={t.img}
                      alt={t.alt}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      fallbackClassName="bg-gradient-to-br from-[#1c3b46] to-[#0e1c22]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e1c22]/70 to-transparent" />
                    <span className="absolute top-3.5 left-3.5 rounded-full bg-[#0e1c22]/80 px-3 py-1 text-[11px] font-semibold tracking-wide text-[#5fd0e6] uppercase backdrop-blur-sm">
                      {t.tagline}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6 md:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-grotesk text-2xl font-semibold tracking-tight">{t.name}</h3>
                      <span className="shrink-0 text-right">
                        <span className="block font-grotesk text-lg font-semibold text-[#5fd0e6]">{t.price}</span>
                        <span className="block text-[11px] text-[#7fa3ad]">per person</span>
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-[11px] font-medium text-[#d6e4e8]">
                        <Clock className="h-3 w-3 text-[#2aa7c4]" aria-hidden="true" />
                        {t.duration}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#9fc0c9]">
                        <span className="flex gap-1" aria-hidden="true">
                          {[1, 2, 3].map((dot) => (
                            <span
                              key={dot}
                              className={`h-1.5 w-1.5 rounded-full ${dot <= t.level ? 'bg-[#2aa7c4]' : 'bg-white/15'}`}
                            />
                          ))}
                        </span>
                        <span className="sr-only">Difficulty {t.level} of 3 — </span>
                        {t.levelLabel}
                      </span>
                      <span className="text-[11px] text-[#7fa3ad]">{t.season}</span>
                    </div>

                    <p className="mt-4 flex-1 text-sm leading-relaxed text-[#9fc0c9]">{t.blurb}</p>

                    <a
                      href={bookingMailto(t.name)}
                      className="mt-6 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-[#5fd0e6] transition-all hover:gap-3"
                    >
                      Book {t.name}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why us / safety */}
      <section id="safety" className="scroll-mt-20 border-y border-white/[0.06] bg-[#0b171c] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal>
              <p className="text-[11px] font-semibold tracking-[0.34em] text-[#2aa7c4] uppercase">Why paddle with us</p>
              <h2 className="mt-4 font-grotesk text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
                Nervous about the water? <span className="text-[#5fd0e6]">Good.</span>
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-[#9fc0c9]">
                Most people who climb into our kayaks have never paddled before — and step out grinning.
                After thirty years, calm is the whole point. Here is what that looks like.
              </p>
              <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-[#2aa7c4]/25 bg-[#122932] px-5 py-4">
                <Star className="h-5 w-5 fill-current text-[#5fd0e6]" aria-hidden="true" />
                <p className="text-sm text-[#d6e4e8]">
                  <span className="font-semibold text-[#eef4f5]">4.8 / 5</span> · the #1-rated activity in Stokkseyri
                </p>
              </div>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2">
              {SAFETY.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.06}>
                  <div className="h-full rounded-2xl border border-white/[0.08] bg-[#122932] p-6 transition-colors hover:border-[#2aa7c4]/40">
                    <s.icon className="h-6 w-6 text-[#2aa7c4]" aria-hidden="true" />
                    <h3 className="mt-4 font-grotesk text-lg font-semibold tracking-tight">{s.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-[#9fc0c9]">{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The place */}
      <section id="place" className="relative scroll-mt-20 overflow-hidden py-28 md:py-40">
        <Img
          src={`${U}photo-1500043357865-c6b8827edf10?q=80&w=2000&auto=format&fit=crop`}
          alt="Black-sand Icelandic coastline with sea stacks under a soft sky"
          className="absolute inset-0 h-full w-full object-cover"
          fallbackClassName="absolute inset-0 bg-gradient-to-br from-[#1c3b46] via-[#122932] to-[#0e1c22]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e1c22] via-[#0e1c22]/90 to-[#0e1c22]/70" />
        <div aria-hidden className="absolute inset-0 bg-[#0e1c22]/30 md:bg-transparent" />
        <div className="relative z-10 mx-auto max-w-6xl px-5 md:px-10">
          <Reveal className="max-w-xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-[#0e1c22]/70 px-4 py-2 text-[11px] font-semibold tracking-[0.28em] uppercase backdrop-blur-sm">
              <MapPin className="h-3.5 w-3.5 text-[#5fd0e6]" aria-hidden="true" />
              Stokkseyri · 45 min from Reykjavík
            </p>
            <h2 className="mt-6 font-grotesk text-4xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
              The easiest add-on to any south-coast day
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#d6e4e8]">
              We sit on the south coast at Stokkseyri — a quiet fishing village 45 minutes from
              Reykjavík and right on the road to the waterfalls, black beaches and glaciers everyone
              drives to anyway. Paddle in the morning, carry on south by lunch. Half a day on the
              water, no detour required.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {['Free parking on site', 'Hot showers & changing', 'Group & private trips'].map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-white/15 bg-[#0e1c22]/60 px-4 py-2 text-xs font-medium text-[#d6e4e8] backdrop-blur-sm"
                >
                  {p}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Voices */}
      <section aria-label="Reviews" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-10">
          <Reveal className="max-w-2xl">
            <p className="text-[11px] font-semibold tracking-[0.34em] text-[#2aa7c4] uppercase">Voices</p>
            <h2 className="mt-4 font-grotesk text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
              Calm water, kind guides
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {VOICES.map((v, i) => (
              <Reveal key={v.name} delay={i * 0.08}>
                <figure className="flex h-full flex-col rounded-3xl border border-white/[0.08] bg-[#122932] p-7">
                  <div role="img" aria-label="Rated 5 out of 5" className="flex gap-1 text-[#5fd0e6]">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-[#d6e4e8]">
                    “{v.quote}”
                  </blockquote>
                  <figcaption className="mt-6 border-t border-white/[0.08] pt-5">
                    <span className="block font-semibold text-[#eef4f5]">{v.name}</span>
                    <span className="mt-0.5 block text-xs text-[#9fc0c9]">{v.trip}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Book CTA */}
      <section id="book" className="scroll-mt-20 border-t border-white/[0.06] bg-[#122932] py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-5 text-center md:px-10">
          <Reveal>
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.34em] text-[#5fd0e6] uppercase">
              <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Booking · two taps
            </p>
            <h2 lang="is" className="mt-5 font-grotesk text-4xl leading-tight font-semibold tracking-tight text-balance md:text-6xl">
              Bóka ferð
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-[#9fc0c9]">
              Pick a trip and tell us your dates — we’ll reply with availability fast, usually the same day.
              No deposit to ask, free to cancel up to 24 hours before.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-2.5">
              {TRIPS.map((t) => (
                <a
                  key={t.name}
                  href={bookingMailto(t.name)}
                  className="rounded-full border border-white/15 bg-[#0e1c22] px-4 py-2.5 text-sm font-medium text-[#d6e4e8] transition-colors hover:border-[#2aa7c4]/50 hover:text-[#eef4f5]"
                >
                  {t.name}
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={bookingMailto()}
                lang="is"
                className="group inline-flex items-center gap-2 rounded-full bg-[#2aa7c4] px-9 py-4 text-sm font-bold tracking-wide text-[#06141a] shadow-xl shadow-[#2aa7c4]/25 transition-all hover:-translate-y-0.5 hover:bg-[#5fd0e6]"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Senda fyrirspurn · Enquire now
              </a>
              <span className="text-xs font-medium text-[#7fa3ad]">
                Or call us — we answer between trips.
              </span>
            </div>
          </Reveal>

          {/* Warm human sign-off */}
          <Reveal delay={0.24}>
            <p className="mt-12 font-grotesk text-lg text-[#d9c7a3] italic">
              “See you on the water.”
            </p>
          </Reveal>
        </div>
      </section>

      <PreviewFooter company={company} />
    </div>
  )
}
