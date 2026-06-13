import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowRight,
  Award,
  Clock,
  Flame,
  MapPin,
  Mountain,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react'
import { getCompany } from '../data/companies'
import { brandOffsetClass, setThemeColor } from '../lib/preview'
import { Img } from '../components/Img'
import { Reveal } from '../components/Reveal'
import { SendPreview } from '../components/SendPreview'
import { StickyCta } from '../components/StickyCta'
import { BackChip, ProtoFooter, WantRedesign } from '../components/Proto'

const company = getCompany('eldhestar')

const MARQUEE = ['VOLCANO TRAILS', 'HOT-SPRING VALLEYS', 'BLACK-SAND BEACHES', 'MIDNIGHT-SUN RIDES', 'HERDS AT FULL GALLOP']

const GAITS = [
  {
    name: 'Fet',
    label: 'the walk',
    desc: 'Calm and steady — how every ride begins, and how nervous first-timers fall in love.',
  },
  {
    name: 'Brokk',
    label: 'the trot',
    desc: 'Two-beat and honest. You’ll find your rhythm faster than you think.',
  },
  {
    name: 'Tölt',
    label: 'the famous one',
    desc: 'The four-beat gait only the Icelandic horse has kept — so smooth riders carry a full pint at speed without spilling.',
  },
  {
    name: 'Stökk',
    label: 'the canter',
    desc: 'Wind, hoofbeats and open lava fields. The moment the photos never quite capture.',
  },
  {
    name: 'Skeið',
    label: 'the flying pace',
    desc: 'The fifth gear — raced over short distances by the boldest horses and riders. Pure ceremony.',
  },
]

const RIDES = [
  {
    title: 'Lava & Landscapes',
    meta: '1.5 hours · all levels',
    desc: 'An easy ride through mossy lava fields on a kind, sure-footed horse. Zero experience needed — just curiosity.',
    price: 'from 12.900 kr',
    level: 1,
    img: 'https://images.unsplash.com/photo-1587754296335-e9bf5454306c?q=80&w=1400&auto=format&fit=crop',
    alt: 'Icelandic horses grazing on an open green plain',
  },
  {
    title: 'Hot Spring Valley',
    meta: 'Half day · some experience',
    desc: 'Ride into the steaming Reykjadalur valley, tie up the horses, and bathe in a naturally hot river. Towel provided, awe included.',
    price: 'from 27.900 kr',
    level: 2,
    img: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1400&auto=format&fit=crop',
    alt: 'Evening sun over a rugged Icelandic valley',
  },
  {
    title: 'Highland Expedition',
    meta: 'Multi-day · experienced riders',
    desc: 'Days in the saddle, a free-running herd alongside, mountain huts at night. The ride people plan their year around.',
    price: 'from 189.000 kr',
    level: 3,
    img: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1400&auto=format&fit=crop',
    alt: 'Snow-capped peak above open moorland',
  },
]

const WHY = [
  { icon: Award, title: 'Riding since 1986', desc: 'Nearly four decades of guided tours from the same geothermal valley.' },
  { icon: Users, title: 'A horse for every rider', desc: 'Hundreds of well-schooled horses — gentle souls for beginners, fire for the experienced.' },
  { icon: ShieldCheck, title: 'Certified & equipped', desc: 'Trained guides, helmets and rain gear included on every single tour.' },
  { icon: Mountain, title: 'Real Icelandic trails', desc: 'Lava fields, river crossings and steam vents — not a paddock circuit.' },
]

export default function Eldhestar() {
  const [gait, setGait] = useState(2)

  useEffect(() => {
    document.title = 'Eldhestar — Redesign Concept'
    setThemeColor('#171210')
  }, [])

  return (
    <div className="min-h-screen bg-[#171210] font-sans text-[#ece5da]">
      <BackChip dark />
      <SendPreview company={company} />
      <StickyCta
        label="Icelandic horse adventures"
        button="Book a ride"
        href="#book"
        buttonClassName="bg-[#e2502a] text-[#1c0e08] shadow-[#e2502a]/40"
        barClassName="bg-[#171210]/90 text-[#ece5da] border-t border-white/10"
      />

      {/* Nav */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-5 md:px-10">
        <div className={`${brandOffsetClass()} flex items-baseline gap-3`}>
          <span className="font-poster text-xl tracking-wide text-[#ece5da]">ELDHESTAR</span>
          <span className="hidden text-[10px] tracking-[0.3em] text-[#b3a89a] uppercase sm:inline">
            Volcano horses · est. 1986
          </span>
        </div>
        <a
          href="#book"
          className="hidden rounded-full bg-[#e2502a] px-5 py-2.5 text-sm font-semibold text-[#1c0e08] transition-colors hover:bg-[#f06236] md:inline-flex"
        >
          Book a ride
        </a>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
        <Img
          src="https://images.unsplash.com/photo-1534773728080-33d31da27ae5?q=80&w=2000&auto=format&fit=crop"
          srcSet="https://images.unsplash.com/photo-1534773728080-33d31da27ae5?q=80&w=828&auto=format&fit=crop 828w, https://images.unsplash.com/photo-1534773728080-33d31da27ae5?q=80&w=1280&auto=format&fit=crop 1280w, https://images.unsplash.com/photo-1534773728080-33d31da27ae5?q=80&w=2000&auto=format&fit=crop 2000w"
          sizes="100vw"
          alt="Icelandic horses moving across open land"
          className="kenburns absolute inset-0 h-full w-full object-cover"
          loading="eager"
          fetchpriority="high"
          fallbackClassName="absolute inset-0 bg-gradient-to-b from-[#5a4636] via-[#33261d] to-[#171210]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171210] via-[#171210]/30 to-[#171210]/60" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 md:px-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.38em] text-[#f0a387] uppercase"
          >
            <Flame className="h-3.5 w-3.5" />
            Icelandic horse adventures · Hveragerði
          </motion.p>
          <h1 className="mt-5 font-poster text-[14.5vw] leading-[0.92] tracking-tight uppercase sm:text-7xl md:text-8xl lg:text-9xl">
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="block"
            >
              Ride the land
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="block bg-gradient-to-r from-[#ff7a45] via-[#e2502a] to-[#b53517] bg-clip-text text-transparent"
            >
              of fire & ice
            </motion.span>
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-7 flex flex-col gap-5 md:flex-row md:items-center md:justify-between"
          >
            <p className="max-w-md text-base leading-relaxed text-[#d8cfc2]">
              On a horse bred pure for a thousand years, across a landscape still being made.
              Guided rides for absolute beginners and lifelong riders.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#rides"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#e2502a] px-8 py-4 text-sm font-bold tracking-wide text-[#1c0e08] uppercase shadow-xl shadow-[#e2502a]/30 transition-all hover:-translate-y-0.5 hover:bg-[#f06236]"
              >
                Choose your ride
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#heritage"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-8 py-4 text-sm font-bold tracking-wide uppercase backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                Meet the horse
                <ArrowDown className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Marquee */}
        <div className="relative z-10 mt-10 overflow-hidden bg-[#e2502a] py-3">
          <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap">
            {[0, 1].map((copy) => (
              <div key={copy} aria-hidden={copy === 1} className="flex items-center gap-10">
                {MARQUEE.map((m) => (
                  <span key={m} className="flex items-center gap-10 font-poster text-sm tracking-[0.18em] text-[#1c0e08]">
                    {m}
                    <Flame className="h-4 w-4" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage */}
      <section id="heritage" className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-32">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <Reveal className="relative order-2 md:order-1">
            <div className="overflow-hidden rounded-[2rem]">
              <Img
                src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=1400&auto=format&fit=crop"
                alt="An Icelandic horse standing in golden light"
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-105"
                fallbackClassName="bg-gradient-to-br from-[#7a5b41] to-[#2a1d14]"
              />
            </div>
            <div className="absolute -right-3 -bottom-6 rounded-2xl bg-[#e2502a] px-6 py-4 shadow-2xl md:-right-8">
              <p className="font-poster text-3xl text-[#1c0e08]">1000+</p>
              <p className="text-[11px] font-bold tracking-[0.2em] text-[#1c0e08] uppercase">years of pure breed</p>
            </div>
          </Reveal>
          <div className="order-1 md:order-2">
            <Reveal>
              <p className="text-[11px] font-semibold tracking-[0.38em] text-[#f0a387] uppercase">The heritage</p>
              <h2 className="mt-4 font-poster text-4xl leading-[1.02] uppercase lg:text-5xl xl:text-6xl">
                One breed.
                <br />
                A thousand years.
                <br />
                <span className="text-[#e2502a]">Five gaits.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-[#b3a89a]">
                The Vikings brought these horses here over a millennium ago, and Iceland has allowed
                no other breed in since. The result is unlike anything else on Earth: small,
                strong-hearted, famously friendly — and the only horse with five gaits.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-9 grid grid-cols-3 gap-4 border-t border-white/10 pt-7">
                {[
                  ['1986', 'guiding ever since'],
                  ['350+', 'schooled horses'],
                  ['5', 'gaits, one breed'],
                ].map(([big, small]) => (
                  <div key={small}>
                    <p className="font-poster text-3xl text-[#ece5da] md:text-4xl">{big}</p>
                    <p className="mt-1 text-[11px] tracking-wide text-[#8f8475] uppercase">{small}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* Gait selector */}
        <Reveal className="mt-20">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 md:p-10">
            <p className="text-[11px] font-semibold tracking-[0.38em] text-[#f0a387] uppercase">
              Try the gears — tap a gait
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {GAITS.map((g, i) => (
                <button
                  key={g.name}
                  onClick={() => setGait(i)}
                  aria-pressed={gait === i}
                  className={`rounded-full px-5 py-2.5 font-poster text-sm tracking-[0.12em] uppercase transition-all ${
                    gait === i
                      ? 'scale-105 bg-[#e2502a] text-[#1c0e08]'
                      : 'bg-white/5 text-[#b3a89a] hover:bg-white/10 hover:text-[#ece5da]'
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={gait}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="mt-6 min-h-32 sm:min-h-24 md:min-h-20"
              >
                <p className="text-sm font-semibold tracking-[0.2em] text-[#f0a387] uppercase">
                  {GAITS[gait].name} — {GAITS[gait].label}
                </p>
                <p className="mt-2 max-w-2xl text-lg leading-relaxed text-[#ece5da]">{GAITS[gait].desc}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </section>

      {/* Rides */}
      <section id="rides" className="bg-[#100c0a] py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5 md:px-10">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.38em] text-[#f0a387] uppercase">The rides</p>
              <h2 className="mt-4 font-poster text-4xl uppercase md:text-6xl">Pick your pulse</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[#8f8475]">
              Helmets, rain gear and a horse matched to your experience — included on every tour.
            </p>
          </Reveal>

          <div className="mt-14 space-y-8">
            {RIDES.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.06}>
                <a
                  href="#book"
                  className={`group grid items-stretch gap-0 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] transition-colors hover:border-[#e2502a]/50 md:grid-cols-5 ${
                    i % 2 ? 'md:[direction:rtl]' : ''
                  }`}
                >
                  <div className="relative overflow-hidden md:col-span-2 md:[direction:ltr]">
                    <Img
                      src={r.img}
                      alt={r.alt}
                      className="aspect-[16/10] h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06] md:aspect-auto"
                      fallbackClassName="bg-gradient-to-br from-[#7a5b41] to-[#2a1d14]"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-7 md:col-span-3 md:p-12 md:[direction:ltr]">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-[#d8cfc2] uppercase">
                        <Clock className="h-3 w-3 text-[#f0a387]" />
                        {r.meta}
                      </span>
                      <span className="flex items-center gap-1" aria-label={`Intensity level ${r.level} of 3`}>
                        {[1, 2, 3].map((dot) => (
                          <span
                            key={dot}
                            className={`h-1.5 w-5 rounded-full ${dot <= r.level ? 'bg-[#e2502a]' : 'bg-white/15'}`}
                          />
                        ))}
                      </span>
                    </div>
                    <h3 className="mt-4 font-poster text-3xl uppercase md:text-5xl">{r.title}</h3>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#b3a89a] md:text-base">{r.desc}</p>
                    <div className="mt-5 flex items-center gap-4">
                      <span className="text-base font-bold text-[#f0a387]">{r.price}</span>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#ece5da] transition-all group-hover:gap-3">
                        Book this ride <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <h2 className="text-center font-poster text-4xl uppercase md:text-5xl">
            Why ride with <span className="text-[#e2502a]">Eldhestar</span>
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.08}>
              <div className="h-full rounded-[1.75rem] border border-white/10 p-7 transition-colors hover:border-[#e2502a]/50 hover:bg-white/[0.04]">
                <w.icon className="h-6 w-6 text-[#e2502a]" />
                <h3 className="mt-5 text-base font-bold">{w.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#8f8475]">{w.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#100c0a] py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5 md:px-10">
          <Reveal>
            <figure className="mx-auto max-w-3xl text-center">
              <div role="img" aria-label="Rated 5 out of 5" className="flex justify-center gap-1 text-[#e2502a]">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-6 font-poster text-2xl leading-snug uppercase md:text-4xl">
                “Twenty years in the saddle — tölting a lava field felt like flying.”
              </blockquote>
              <figcaption className="mt-5 text-sm text-[#8f8475]">
                Anna K. · Denmark · Hot Spring Valley tour
              </figcaption>
            </figure>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {[
              {
                text: 'Total beginner, slightly terrified. My horse Glói clearly had the patience of a kindergarten teacher. Best day of our trip.',
                name: 'Marcus T. · USA',
              },
              {
                text: 'Riding to a hot river, then bathing in it while the horses grazed — it does not feel real even in the photos.',
                name: 'Yuki & Haru · Japan',
              },
            ].map((q, i) => (
              <Reveal key={q.name} delay={i * 0.1}>
                <figure className="h-full rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-7">
                  <blockquote className="text-base leading-relaxed text-[#d8cfc2]">“{q.text}”</blockquote>
                  <figcaption className="mt-4 text-sm font-semibold text-[#f0a387]">{q.name}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="relative overflow-hidden py-32 md:py-44">
        <Img
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2000&auto=format&fit=crop"
          alt="Steam rising over misty Icelandic hills"
          className="absolute inset-0 h-full w-full object-cover"
          fallbackClassName="absolute inset-0 bg-gradient-to-br from-[#4a3b2d] via-[#241a13] to-[#100c0a]"
        />
        <div className="absolute inset-0 bg-[#171210]/65" />
        <div className="relative z-10 mx-auto max-w-4xl px-5 text-center">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-[11px] font-semibold tracking-[0.3em] uppercase backdrop-blur-md">
              <MapPin className="h-3.5 w-3.5 text-[#f0a387]" />
              Hveragerði · 35 min from Reykjavík
            </p>
            <h2 className="mt-6 font-poster text-4xl leading-tight uppercase text-balance md:text-6xl">
              A valley that steams. Horses that know its trails.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#d8cfc2]">
              Eldhestar’s farm sits at the mouth of one of Iceland’s most active geothermal valleys
              — close enough for a half-day escape from Reykjavík, wild enough to forget it exists.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section id="book" className="grain bg-[#e2502a] py-28 text-center text-[#1c0e08] md:py-36">
        <div className="mx-auto max-w-3xl px-5">
          <Reveal>
            <h2 className="font-poster text-6xl uppercase md:text-8xl">Saddle up.</h2>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed font-medium">
              Tours run daily, year-round. Tell us your level and your dates — we’ll match you with
              the right horse.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="mailto:info@eldhestar.is?subject=Ride%20booking&body=Dates%3A%0ARiding%20experience%3A%0AGroup%20size%3A"
                className="group inline-flex items-center gap-2 rounded-full bg-[#1c0e08] px-9 py-4 text-sm font-bold tracking-wide text-[#ece5da] uppercase shadow-xl shadow-black/30 transition-all hover:-translate-y-0.5 hover:bg-[#33241b]"
              >
                Book your ride
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <span className="text-xs font-semibold">Free cancellation until 24 hours before · Gear included</span>
            </div>
          </Reveal>
        </div>
      </section>

      <WantRedesign company={company} dark accentClassName="bg-[#e2502a] text-[#1c0e08] hover:bg-[#f06236]" />
      <ProtoFooter company={company} dark />
    </div>
  )
}
