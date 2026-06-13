import { useEffect } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Clock,
  Compass,
  Languages,
  ShieldCheck,
  Snowflake,
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

const company = getCompany('ice-tourism')

const EXPEDITIONS = [
  {
    title: 'Glacier & Ice Caves',
    season: 'Oct – Mar',
    desc: 'Crystal-blue chambers beneath Europe’s largest glacier, reached by super jeep with a certified glacier guide.',
    price: 'From €390 per person',
    img: 'https://images.unsplash.com/photo-1494564605686-2e931f77a8e2?q=80&w=1200&auto=format&fit=crop',
    alt: 'Blue glacier ice floating in a lagoon',
  },
  {
    title: 'Aurora Hunt, Privately Guided',
    season: 'Sep – Apr',
    desc: 'No fixed route. Your guide reads the cloud cover and solar data, then drives to where the sky will open.',
    price: 'From €290 per person',
    img: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1200&auto=format&fit=crop',
    alt: 'Green aurora over snow',
  },
  {
    title: 'Highlands by Super Jeep',
    season: 'Jun – Sep',
    desc: 'Rhyolite mountains, steaming valleys and river crossings on the routes coaches physically cannot take.',
    price: 'From €540 per person',
    img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200&auto=format&fit=crop',
    alt: 'Mist over highland ridges',
  },
  {
    title: 'The South Coast, Unhurried',
    season: 'All year',
    desc: 'Waterfalls before the crowds, black-sand beaches at golden hour — a private day built around the light.',
    price: 'From €450 per person',
    img: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=1200&auto=format&fit=crop',
    alt: 'Waterfall on the south coast',
  },
]

const JOURNEYS = [
  {
    title: 'South: Beyond the Wall',
    length: '6 days · Apr – Oct',
    stops: ['Golden Circle, after hours', 'Vatnajökull glacier walk', 'Jökulsárlón ice lagoon', 'Highland detour, weather allowing'],
    img: 'https://images.unsplash.com/photo-1500043357865-c6b8827edf10?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Discovering Iceland',
    length: '8 days · May – Sep',
    stops: ['Full ring road, privately driven', 'North Iceland whale fjords', 'East fjord fishing villages', 'Mývatn geothermal baths'],
    img: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Greenland Extension',
    length: '4 days · add-on',
    stops: ['Flight from Reykjavík', 'Icefjord boat passage', 'Inuit settlement visit', 'Midnight-sun hiking'],
    img: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1200&auto=format&fit=crop',
  },
]

const WHY = [
  {
    icon: Compass,
    title: 'Weather-routed, every day',
    desc: 'Itineraries rebuilt each morning around light, wind and road conditions — the schedule serves the weather, never the reverse.',
  },
  {
    icon: ShieldCheck,
    title: '24/7 in-country support',
    desc: 'A local team on call for the whole journey — every hotel, transfer and backup plan handled.',
  },
  {
    icon: Users,
    title: 'Private or small group',
    desc: 'Your own guide and vehicle, or fixed departures capped small enough to feel personal.',
  },
  {
    icon: Languages,
    title: 'Guides in 9+ languages',
    desc: 'English, German, Spanish, Mandarin, Portuguese, Russian and more — expertise in your language.',
  },
]

const QUOTES = [
  {
    text: 'Our guide checked the aurora forecast at dinner, moved our entire evening, and at 23:40 the sky split open exactly where he parked. That is not luck. That is expertise.',
    name: 'Claire & Tomas',
    origin: 'Switzerland · Winter expedition',
  },
  {
    text: 'We had been to Iceland before, on a coach. This was a different country. We stood inside a glacier with nobody else in sight.',
    name: 'The Okafor family',
    origin: 'United Kingdom · Private south coast',
  },
  {
    text: 'Every hotel, every transfer, every backup plan handled. The most organised trip we have ever taken, anywhere.',
    name: 'Daniel R.',
    origin: 'United States · 8-day journey',
  },
]

export default function IceTourism() {
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 900], [0, 170])
  const reduce = useReducedMotion()

  useEffect(() => {
    document.title = 'Ice Tourism — Redesign Concept'
    setThemeColor('#060d17')
  }, [])

  return (
    <div className="min-h-screen bg-[#060d17] font-grotesk text-white">
      <BackChip dark />
      <SendPreview company={company} />
      <StickyCta
        label="Private Iceland expeditions"
        button="Plan my expedition"
        href="#book"
        buttonClassName="bg-cyan-300 text-slate-950 shadow-cyan-400/30"
        barClassName="bg-[#060d17]/85 text-white border-t border-white/10"
      />

      {/* Nav */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-5 md:px-10">
        <div className={`${brandOffsetClass()} flex items-center gap-2`}>
          <Snowflake className="h-5 w-5 text-cyan-300" />
          <span className="text-sm font-semibold tracking-[0.3em]">ICE TOURISM</span>
        </div>
        <a
          href="#book"
          className="hidden rounded-full border border-white/25 bg-white/5 px-5 py-2.5 text-sm font-medium backdrop-blur-md transition-colors hover:bg-white/15 md:inline-flex"
        >
          Plan your expedition
        </a>
      </header>

      {/* Hero */}
      <section className="relative flex h-[100svh] min-h-[640px] items-end overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Img
            src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000&auto=format&fit=crop"
            srcSet="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=828&auto=format&fit=crop 828w, https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1280&auto=format&fit=crop 1280w, https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000&auto=format&fit=crop 2000w"
            sizes="100vw"
            alt="Snow-covered Icelandic peak under a star-filled night sky"
            className="kenburns h-full w-full object-cover"
            loading="eager"
            fetchpriority="high"
            fallbackClassName="bg-gradient-to-b from-[#16304d] via-[#0b1b30] to-[#060d17]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#060d17]/55 via-transparent to-[#060d17]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060d17]/65 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24 md:px-10 md:pb-28">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-[11px] font-medium tracking-[0.38em] text-cyan-200/90 uppercase md:text-xs"
          >
            Private Arctic expeditions · Iceland & Greenland
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="mt-5 max-w-3xl font-tall text-5xl leading-[1.02] font-light text-balance md:text-7xl lg:text-8xl"
          >
            The Iceland most travellers <em className="text-cyan-200">never see</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/75 md:text-lg"
          >
            Custom expeditions built day by day around the weather, the light and you — by a
            licensed Reykjavík operator that has been doing exactly this since 2004.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.8 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <a
              href="#book"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-8 py-4 text-sm font-semibold text-slate-950 shadow-xl shadow-cyan-400/25 transition-all hover:-translate-y-0.5 hover:bg-cyan-200"
            >
              Plan your expedition
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#expeditions"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 py-4 text-sm font-semibold backdrop-blur-md transition-colors hover:bg-white/15"
            >
              View expeditions
            </a>
          </motion.div>
        </div>

        <p className="absolute right-6 bottom-8 hidden text-[10px] tracking-[0.3em] text-white/40 md:block">
          64.13° N — 21.90° W · REYKJAVÍK HQ
        </p>
        <motion.div
          animate={reduce ? undefined : { y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="absolute bottom-9 left-1/2 -translate-x-1/2 text-white/50"
        >
          <a href="#expeditions" aria-label="Scroll to expeditions">
            <ChevronDown className="h-5 w-5" />
          </a>
        </motion.div>
      </section>

      {/* Trust strip */}
      <section className="relative z-20 mx-auto -mt-10 max-w-5xl px-5">
        <Reveal>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl md:grid-cols-4">
            {[
              ['20+', 'years in operation'],
              ['Licensed', 'Icelandic DMC'],
              ['9+', 'guide languages'],
              ['4.9 / 5', 'traveller rating'],
            ].map(([big, small]) => (
              <div key={small} className="flex flex-col items-center gap-1 bg-[#0a1424]/60 px-4 py-6 text-center">
                <span className="font-tall text-2xl text-cyan-200 md:text-3xl">{big}</span>
                <span className="text-[11px] tracking-[0.14em] text-white/65 uppercase">{small}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Hook */}
      <section className="grain mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-32">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <Reveal>
              <p className="text-[11px] font-medium tracking-[0.38em] text-cyan-300/80 uppercase">The difference</p>
              <h2 className="mt-4 font-tall text-4xl leading-[1.08] font-light text-balance md:text-5xl lg:text-6xl">
                Anyone can visit Iceland. Few are shown it <em>properly</em>.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-white/65">
                Most visitors see Iceland through a coach window, on someone else’s schedule. We
                build each expedition around conditions on the ground — chasing clear skies, empty
                trailheads and the hour when the light turns gold — with a local expert beside you
                the entire way.
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <ul className="mt-8 flex flex-wrap gap-2.5">
                {['Weather-routed itineraries', 'Certified local guides', '24/7 in-country support', 'Hotels hand-picked & booked'].map(
                  (chip) => (
                    <li
                      key={chip}
                      className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/80"
                    >
                      {chip}
                    </li>
                  ),
                )}
              </ul>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="relative">
            <div className="overflow-hidden rounded-3xl border border-white/10">
              <Img
                src="https://images.unsplash.com/photo-1504893524553-b855bce32c67?q=80&w=1400&auto=format&fit=crop"
                alt="Glacial river canyon winding through Icelandic highlands"
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-105"
                fallbackClassName="bg-gradient-to-br from-cyan-900 via-slate-800 to-slate-950"
              />
            </div>
            <div className="absolute -bottom-5 -left-3 rounded-2xl border border-white/15 bg-[#0c1830]/85 px-5 py-4 shadow-2xl backdrop-blur-xl md:-left-8">
              <p className="text-[10px] tracking-[0.28em] text-cyan-300 uppercase">Day 03 · 09:40</p>
              <p className="mt-1 text-sm font-medium">Vatnajökull ice cave — conditions confirmed</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Expeditions */}
      <section id="expeditions" className="bg-[#0a1424] py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5 md:px-10">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-medium tracking-[0.38em] text-cyan-300/80 uppercase">Expeditions</p>
              <h2 className="mt-4 font-tall text-4xl font-light md:text-5xl">Choose your conditions</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-white/55">
              Every departure private or small-group, every price all-inclusive of guide, vehicle
              and equipment.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {EXPEDITIONS.map((e, i) => (
              <Reveal key={e.title} delay={i * 0.07}>
                <a href="#book" className="group block overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                  <div className="relative overflow-hidden">
                    <Img
                      src={e.img}
                      alt={e.alt}
                      className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      fallbackClassName="bg-gradient-to-br from-cyan-800 via-slate-800 to-slate-950"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1424]/80 via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-[11px] font-medium tracking-wide backdrop-blur-md">
                      <Clock className="h-3 w-3 text-cyan-300" />
                      {e.season}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4 p-6">
                    <div>
                      <h3 className="font-tall text-2xl font-normal">{e.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/60">{e.desc}</p>
                      <p className="mt-3 text-sm font-semibold text-cyan-200">{e.price}</p>
                    </div>
                    <span className="mt-1 rounded-full border border-white/15 p-2.5 transition-all group-hover:border-cyan-300 group-hover:bg-cyan-300 group-hover:text-slate-950">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
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
          <p className="text-center text-[11px] font-medium tracking-[0.38em] text-cyan-300/80 uppercase">
            Why travellers choose us
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-center font-tall text-4xl font-light text-balance md:text-5xl">
            Expedition-grade planning, hospitality-grade care
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.08}>
              <div className="group h-full rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition-colors hover:border-cyan-300/40 hover:bg-white/[0.07]">
                <w.icon className="h-6 w-6 text-cyan-300" />
                <h3 className="mt-5 text-base font-semibold">{w.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-white/55">{w.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Signature journeys */}
      <section className="bg-[#0a1424] py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5 md:px-10">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-medium tracking-[0.38em] text-cyan-300/80 uppercase">Signature journeys</p>
              <h2 className="mt-4 font-tall text-4xl font-light md:text-5xl">Multi-day, fully handled</h2>
            </div>
            <p className="inline-flex items-center gap-2 text-sm text-white/60">
              Scroll sideways
              <ArrowRight className="h-4 w-4" />
            </p>
          </Reveal>
        </div>
        <div className="scrollbar-none mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-pl-5 px-5 pb-4 md:scroll-pl-[max(2.5rem,calc((100vw-72rem)/2+2.5rem))] md:px-[max(2.5rem,calc((100vw-72rem)/2+2.5rem))]">
          {JOURNEYS.map((j) => (
            <article
              key={j.title}
              className="group w-[82vw] max-w-[420px] shrink-0 snap-start overflow-hidden rounded-3xl border border-white/10 bg-[#0c1a30]"
            >
              <div className="relative overflow-hidden">
                <Img
                  src={j.img}
                  alt={j.title}
                  className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  fallbackClassName="bg-gradient-to-br from-sky-900 via-slate-800 to-slate-950"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a30] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-5">
                  <p className="text-[11px] tracking-[0.24em] text-cyan-200 uppercase">{j.length}</p>
                  <h3 className="mt-1 font-tall text-3xl">{j.title}</h3>
                </div>
              </div>
              <ul className="space-y-2.5 p-6 text-sm text-white/65">
                {j.stops.map((s, idx) => (
                  <li key={s} className="flex gap-3">
                    <span className="pt-0.5 font-grotesk text-xs font-medium tracking-[0.18em] text-cyan-300/70">{String(idx + 1).padStart(2, '0')}</span>
                    {s}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Atmosphere */}
      <section className="relative overflow-hidden py-32 md:py-44">
        <Img
          src="https://images.unsplash.com/photo-1483347756197-71ef80e95f73?q=80&w=2000&auto=format&fit=crop"
          alt="Northern lights arcing over Icelandic mountains"
          className="absolute inset-0 h-full w-full object-cover"
          fallbackClassName="absolute inset-0 bg-gradient-to-br from-emerald-900 via-[#0b2030] to-[#060d17]"
        />
        <div className="absolute inset-0 bg-[#060d17]/60" />
        <div className="relative z-10 mx-auto max-w-4xl px-5 text-center">
          <Reveal>
            <h2 className="font-tall text-4xl leading-[1.08] font-light text-balance md:text-6xl">
              In winter, the sky performs. In summer, it simply never gets dark.
            </h2>
            <div className="mt-10 flex flex-wrap justify-center gap-2.5">
              {['Aurora season · Sep–Apr', 'Midnight sun · May–Jul', 'Ice caves · Oct–Mar', 'Highlands · Jun–Sep'].map((c) => (
                <span key={c} className="rounded-full border border-white/20 bg-black/30 px-4 py-2 text-xs font-medium backdrop-blur-md">
                  {c}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <p className="text-[11px] font-medium tracking-[0.38em] text-cyan-300/80 uppercase">From the field notes</p>
          <h2 className="mt-4 font-tall text-4xl font-light md:text-5xl">Travellers, verbatim</h2>
        </Reveal>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {QUOTES.map((q, i) => (
            <Reveal key={q.name} delay={i * 0.1}>
              <figure className="border-t border-white/15 pt-7">
                <div role="img" aria-label="Rated 5 out of 5" className="flex gap-1 text-cyan-300">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-5 font-tall text-2xl leading-normal font-normal text-white/85">
                  “{q.text}”
                </blockquote>
                <figcaption className="mt-5 text-sm">
                  <span className="font-semibold">{q.name}</span>
                  <span className="mt-0.5 block text-white/55">{q.origin}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section id="book" className="grain relative overflow-hidden bg-[#0a1424] py-28 md:py-36">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <Reveal>
            <Snowflake className="mx-auto h-8 w-8 text-cyan-300" />
            <h2 className="mt-6 font-tall text-4xl leading-[1.05] font-light text-balance md:text-6xl">
              Your expedition begins with a conversation
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/65">
              Tell us your dates, your pace and what you want to feel. A custom itinerary lands in
              your inbox within 48 hours — no payment until you approve every detail.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="mailto:icetourism@icetourism.com?subject=Private%20expedition%20enquiry&body=Dates%3A%0AGroup%20size%3A%0APace%20%26%20interests%3A"
                className="group inline-flex items-center gap-2 rounded-full bg-cyan-300 px-9 py-4 text-sm font-semibold text-slate-950 shadow-xl shadow-cyan-400/25 transition-all hover:-translate-y-0.5 hover:bg-cyan-200"
              >
                Request your itinerary
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <span className="text-xs text-white/60">No payment until you approve · EN / DE / ES / 中文</span>
            </div>
          </Reveal>
        </div>
      </section>

      <WantRedesign company={company} dark accentClassName="bg-cyan-300 text-slate-950 hover:bg-cyan-200" />
      <ProtoFooter company={company} dark />
    </div>
  )
}
